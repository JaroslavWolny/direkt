#!/usr/bin/env python3
"""Generuje hlasové klipy DIREKT do public/voice/<hlas>/ (DOKUMENTACE.md kap. 8).

Hlasy:
- antonin — Microsoft cs-CZ-AntoninNeural přes edge-tts (funkce „Číst nahlas" v Edge), česky.
- harry, charlie, adam — ElevenLabs (model eleven_v3, křik přes tag [shouts]), anglicky.
  API klíč se čte z ~/.config/elevenlabs.key (nebo ELEVENLABS_API_KEY); do repa ani appky nepatří.

Potřebuje síť a ffmpeg; pro antonin navíc balíček edge-tts.

    python3 -m venv ~/.local/share/direkt-voice-venv
    ~/.local/share/direkt-voice-venv/bin/pip install edge-tts
    ~/.local/share/direkt-voice-venv/bin/python scripts/gen-voice.py harry adam   # bez argumentů = všechny
    ~/.local/share/direkt-voice-venv/bin/python scripts/gen-voice.py --clip naplno  # jen vybrané klipy
"""
import array
import asyncio
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile
import time
import urllib.request
import wave

ROOT = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'voice'

# Id klipů musí sedět se src/audio/voice.ts.
TEXTS = {
    'cs': {
        'n1': 'Jedna!', 'n2': 'Dva!', 'n3': 'Tři!', 'n4': 'Čtyři!', 'n5': 'Pět!', 'n6': 'Šest!',
        't1': 'Jedna na tělo!', 't2': 'Dva na tělo!', 't3': 'Tři na tělo!',
        't4': 'Čtyři na tělo!', 't5': 'Pět na tělo!', 't6': 'Šest na tělo!',
        'uklon': 'Úklon!', 'zaklon': 'Záklon!', 'ponor': 'Ponoř!', 'kryt': 'Kryt!', 'vzad': 'Vzad!', 'ukrok': 'Úkrok!',
        'pripravse': 'Připrav se!', 'posledni': 'Poslední kolo!', 'naplno': 'Naplno!', 'hotovo': 'Hotovo. Dobrá práce!',
    },
    'en': {
        'n1': 'One!', 'n2': 'Two!', 'n3': 'Three!', 'n4': 'Four!', 'n5': 'Five!', 'n6': 'Six!',
        't1': 'One body!', 't2': 'Two body!', 't3': 'Three body!',
        't4': 'Four body!', 't5': 'Five body!', 't6': 'Six body!',
        'uklon': 'Slip!', 'zaklon': 'Pull!', 'ponor': 'Roll!', 'kryt': 'Block!', 'vzad': 'Back!', 'ukrok': 'Pivot!',
        'pripravse': 'Get ready!', 'posledni': 'Last round!', 'naplno': 'All out!', 'hotovo': 'Time! Great work!',
    },
}

VOICES = {
    'antonin': {'engine': 'edge', 'voice': 'cs-CZ-AntoninNeural', 'lang': 'cs'},
    'harry': {'engine': 'elevenlabs', 'voice': 'SOYHLrjzK2X1ezoPC6cr', 'lang': 'en'},  # Fierce Warrior
    'charlie': {'engine': 'elevenlabs', 'voice': 'IKne3meq5aSn9XLyUdCD', 'lang': 'en'},  # Deep, Energetic
    'adam': {'engine': 'elevenlabs', 'voice': 'pNInz6obpgDQGcFmaJgB', 'lang': 'en'},  # Dominant, Firm
}

# Ořez ticha na obou koncích (konec přes areverse), nechá 10 ms / 40 ms rezervu; mírná komprese.
# Výkřiky z ElevenLabs mají dlouhý tichý dozvuk → přísnější práh.
def trim(db: int) -> str:
    return (
        f'silenceremove=start_periods=1:start_threshold={db}dB:start_silence=0.01,'
        f'areverse,silenceremove=start_periods=1:start_threshold={db}dB:start_silence=0.04,areverse'
    )


COMPRESS = 'acompressor=threshold=-20dB:ratio=3:attack=5:release=60'
TRIM_DB = {'edge': -50, 'elevenlabs': -38}
# Výkřiky z ElevenLabs jsou protáhlé → klipy do komb zrychlit bez změny výšky; hlášky ne.
TEMPO = 1.3
PHRASES = ('pripravse', 'posledni', 'naplno', 'hotovo')
# Max. délka hotového klipu (s), hlídá se jen u ElevenLabs: číslo/obrana, na tělo, hlášky.
MAX_SEC = {'t': 0.9, 'pripravse': 1.2, 'posledni': 1.4, 'naplno': 1.2, 'hotovo': 2.0}
MAX_SEC_DEFAULT = 0.65
ATTEMPTS = 5


def edge_synth(text: str, voice: str, path: pathlib.Path) -> None:
    import edge_tts

    async def run() -> None:
        await edge_tts.Communicate(text, voice, rate='+10%').save(str(path))

    asyncio.run(run())


def elevenlabs_key() -> str:
    key = os.environ.get('ELEVENLABS_API_KEY') or (pathlib.Path.home() / '.config' / 'elevenlabs.key').read_text()
    return key.strip()


def elevenlabs_synth(text: str, voice: str, path: pathlib.Path) -> None:
    body = json.dumps(
        {'text': f'[shouts] {text}', 'model_id': 'eleven_v3', 'voice_settings': {'stability': 0.5}}
    ).encode()
    req = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128',
        data=body,
        headers={'xi-api-key': elevenlabs_key(), 'Content-Type': 'application/json'},
    )
    with urllib.request.urlopen(req, timeout=60) as res:
        path.write_bytes(res.read())


def transcribe(path: pathlib.Path) -> str:
    """ElevenLabs převod řeči na text — kontrola, že hlas řekl přesně to, co má."""
    boundary = 'direktboundary'
    parts = [
        f'--{boundary}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'.encode(),
        f'--{boundary}\r\nContent-Disposition: form-data; name="language_code"\r\n\r\nen\r\n'.encode(),
        f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\n'
        f'Content-Type: audio/mpeg\r\n\r\n'.encode() + path.read_bytes() + b'\r\n',
        f'--{boundary}--\r\n'.encode(),
    ]
    req = urllib.request.Request(
        'https://api.elevenlabs.io/v1/speech-to-text',
        data=b''.join(parts),
        headers={'xi-api-key': elevenlabs_key(), 'Content-Type': f'multipart/form-data; boundary={boundary}'},
    )
    with urllib.request.urlopen(req, timeout=60) as res:
        return json.loads(res.read()).get('text', '')


def words(text: str) -> str:
    return ' '.join(re.sub(r'[^a-zA-Záčďéěíňóřšťúůýž ]', ' ', text.lower()).split())


def synth(cfg: dict, text: str, path: pathlib.Path) -> None:
    for attempt in range(5):
        try:
            (edge_synth if cfg['engine'] == 'edge' else elevenlabs_synth)(text, cfg['voice'], path)
            if path.stat().st_size > 1000:
                return
        except Exception as e:  # síť / služba občas škytne
            print(f'  pokus {attempt + 1} selhal: {e}')
        time.sleep(1 + attempt)
    raise RuntimeError(f'TTS selhalo: {text}')


def ffmpeg(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(['ffmpeg', '-y', '-hide_banner', *args], capture_output=True, text=True, check=True)


def peak_db(path: pathlib.Path) -> float:
    out = ffmpeg('-i', str(path), '-af', 'volumedetect', '-f', 'null', '-').stderr
    return float(re.search(r'max_volume: (-?[\d.]+) dB', out).group(1))


def duration(path: pathlib.Path) -> float:
    out = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)],
        capture_output=True, text=True, check=True,
    ).stdout
    return float(out)


def trim_end(wav: pathlib.Path, rel_db: float = -40, pad_s: float = 0.04) -> None:
    """Ořízne konec za posledním zvukem (nad −40 dB pod špičkou), nechá 40 ms a dozní 10 ms.

    Rubberband nechá za slovem ~0,5 s skoro ticha a na úplném konci krátké cvaknutí, o které
    se silenceremove zastaví. Cvaknutí = úsek kratší než 60 ms po aspoň 150 ms ticha; koncová
    souhláska (t v „Pivot", p ve „Slip") má před sebou mezeru jen ~50–100 ms, ta zůstane.
    """
    with wave.open(str(wav)) as w:
        params = w.getparams()
        samples = array.array('h', w.readframes(w.getnframes()))
    hop = params.framerate // 100  # rámce po 10 ms
    limit = max(map(abs, samples)) * 10 ** (rel_db / 20)
    loud = [max(map(abs, samples[i:i + hop])) > limit for i in range(0, len(samples), hop)]
    runs: list[list[int]] = []  # [začátek, konec) hlasitých úseků v rámcích
    for i, on in enumerate(loud):
        if on and runs and runs[-1][1] == i:
            runs[-1][1] = i + 1
        elif on:
            runs.append([i, i + 1])
    while len(runs) > 1 and runs[-1][1] - runs[-1][0] < 6 and runs[-1][0] - runs[-2][1] >= 15:
        runs.pop()
    if not runs:
        return
    cut = min(len(samples), runs[-1][1] * hop + int(pad_s * params.framerate))
    samples = samples[:cut]
    fade = min(cut, hop)
    for k in range(fade):
        samples[cut - fade + k] = int(samples[cut - fade + k] * (fade - k) / fade)
    with wave.open(str(wav), 'wb') as w:
        w.setparams(params)
        w.writeframes(samples.tobytes())


def max_sec(clip_id: str) -> float:
    return MAX_SEC.get(clip_id) or (MAX_SEC['t'] if re.fullmatch(r't\d', clip_id) else MAX_SEC_DEFAULT)


def render(cfg: dict, clip_id: str, text: str, tmpdir: pathlib.Path, n: int) -> pathlib.Path:
    """Jedna verze klipu: syntéza → ořez → komprese (→ zrychlení) → mono 24 kHz → špička −1 dBFS → MP3."""
    raw = tmpdir / f'{n}.raw.mp3'
    wav = tmpdir / f'{n}.wav'
    mp3 = tmpdir / f'{n}.mp3'
    synth(cfg, text, raw)
    chain = [trim(TRIM_DB[cfg['engine']]), COMPRESS]
    if cfg['engine'] == 'elevenlabs' and clip_id not in PHRASES:
        chain.append(f'rubberband=tempo={TEMPO}')
    ffmpeg('-i', str(raw), '-af', ','.join(chain), '-ac', '1', '-ar', '24000', '-c:a', 'pcm_s16le', str(wav))
    if cfg['engine'] == 'elevenlabs':
        trim_end(wav)
    gain = -1.0 - peak_db(wav)
    ffmpeg('-i', str(wav), '-af', f'volume={gain:.2f}dB', '-c:a', 'libmp3lame', '-b:a', '64k', str(mp3))
    return mp3


def main(slugs: list[str], only: set[str]) -> None:
    for slug in slugs:
        cfg = VOICES[slug]
        out = ROOT / slug
        out.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory() as tmp:
            tmpdir = pathlib.Path(tmp)
            for clip_id, text in TEXTS[cfg['lang']].items():
                if only and clip_id not in only:
                    continue
                if cfg['engine'] == 'edge':
                    best = render(cfg, clip_id, text, tmpdir, 0)
                    note = ''
                else:
                    # ElevenLabs občas přidá citoslovce nebo slovo zkomolí → kontrola přepisem a délkou.
                    limit = max_sec(clip_id)
                    best, best_len, note = None, 99.0, ''
                    for n in range(ATTEMPTS):
                        mp3 = render(cfg, clip_id, text, tmpdir, n)
                        heard = transcribe(mp3)
                        length = duration(mp3)
                        if words(heard) == words(text) and length < best_len:
                            best, best_len, note = mp3, length, f'{length:.2f}s'
                            if length <= limit:
                                break
                    if best is None:
                        raise RuntimeError(f'{slug} {clip_id}: žádná verze nezněla jako „{text}"')
                dst = out / f'{clip_id}.mp3'
                dst.write_bytes(best.read_bytes())
                print(f'{slug:8} {clip_id:10} {text:22} {note:6} {dst.stat().st_size:6} B')


if __name__ == '__main__':
    args = sys.argv[1:]
    only = set(args[args.index('--clip') + 1:]) if '--clip' in args else set()
    slugs = args[:args.index('--clip')] if '--clip' in args else args
    main(slugs or list(VOICES), only)
