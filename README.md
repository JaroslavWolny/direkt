# DIREKT

Trenér na boxovací pytel pro iPhone. Hlas během kola hlásí komba čísly
(„one, two, three body, slip" / „jedna, dva, tři na tělo, úklon"), gong začíná a končí kola,
posledních 10 s kola je finiš naplno, mezi koly běží pauza.
Jen box. Web appka přidaná na plochu, funguje offline, žádný účet ani server.
Živě: https://direkt-indol.vercel.app

Co a proč se staví, je v **[DOKUMENTACE.md](DOKUMENTACE.md)** — změny nejdřív tam, pak kód.

## Stack

- Vite 8 + React 19 + TypeScript, čisté CSS (`src/index.css`)
- `vite-plugin-pwa` (offline precache, nová verze se nenačte uprostřed tréninku — R14)
- hlas: předgenerované klipy v `public/voice/<hlas>/` (Harry, Charlie, Adam z ElevenLabs,
  Antonín z Microsoft Edge TTS), hraje Web Audio; gong, klepnutí a pípání se syntetizují
- písmo Archivo (OFL) je v `public/fonts`, nic se netahá z internetu

## Vývoj

```bash
nvm use 20        # Vite 8 vyžaduje Node >= 20.19
npm install
npm run dev
npm test          # engine: výběr komb, časování, finiš, časová osa, úložiště
npm run build     # tsc -b && vite build
npm run lint
npm run icons     # přegeneruje ikony appky (bez závislostí)
npx vercel deploy --prod --yes
```

Engine je čistý TypeScript v `src/engine/` (bez DOM, plně testovaný). Zvuk a hlas jsou
jen v `src/audio/`, běh tréninku v `src/workout/runner.ts`, obrazovky v `src/ui/`.
Komba a slova pro hlas: `src/data/combos.ts` a `src/data/moves.ts`.

Hlasové klipy: `scripts/gen-voice.py` (postup a závislosti v hlavičce skriptu, `--clip <id>`
přegeneruje jen vybrané klipy). Klíč ElevenLabs je jen v `~/.config/elevenlabs.key`.

## Instalace na iPhone

1. Otevřít adresu v **Safari**.
2. Sdílet → **Přidat na plochu**.
3. Spouštět z ikony na ploše.

Pozor: appka na ploše má vlastní úložiště, oddělené od Safari.

## Při tréninku

- Telefon nech ležet u pytle s displejem zapnutým — appka drží displej rozsvícený.
- Zamčení nebo přepnutí appky trénink pozastaví (vypnout jde v Nastavení).
- Hudba ze Spotify hraje dál, ale při hlášení se **neztiší** — web appka to neumí,
  hlas ji musí přehlušit sám.
- Když je iPhone v tichém režimu a nic neslyšíš: Nastavení → **Hrát i v tichém režimu**
  (zastaví ale hudbu z telefonu).
- Hlas trenéra se vybírá v Nastavení appky.

## Záchranná brzda

Kdyby se zasekla stará verze: otevřít adresu s `?sw-reset` — zahodí service worker i cache.
