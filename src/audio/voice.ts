// Hlas = sady předgenerovaných klipů, jedna na hlas (DOKUMENTACE.md kap. 8, R8).
// Přehrává sdílená AudioContext; konec hlášení je přesně známý z délek klipů (R10).
import { isBody, isDefense, type Move } from '../data/moves'
import type { VoiceId } from '../data/voices'
import { getContext, output, resumeContext, setSilentOverride } from './context'

const CLIP_IDS = [
  ...['1', '2', '3', '4', '5', '6'].flatMap((n) => [`n${n}`, `t${n}`]),
  'uklon',
  'zaklon',
  'ponor',
  'kryt',
  'vzad',
  'ukrok',
  'pripravse',
  'posledni',
  'naplno',
  'znovu',
  'hotovo',
]

/** Mezera mezi slovy komba. */
const WORD_GAP_S = 0.07
/** Odhad délky klipu, dokud se klipy nenačtou. */
const FALLBACK_CLIP_S = 0.45
/** Práh ticha pro ořez na krajích (MP3 má na začátku vatu z enkodéru). */
const SILENCE = 0.003
const EDGE_PAD_S = 0.01

interface Clip {
  buffer: AudioBuffer
  offset: number
  duration: number
}

const clipsByVoice = new Map<VoiceId, Map<string, Clip>>()
const loading = new Map<VoiceId, Promise<void>>()

const clipOf = (m: Move): string => (isDefense(m) ? m : isBody(m) ? `t${m[0]}` : `n${m}`)

/** Klipy komba: „3t" → jeden klip „Tři na tělo!". */
export const clipsFor = (moves: readonly Move[]): string[] => moves.map(clipOf)

/** Začátek a délka zvuku v bufferu bez ticha na krajích. */
function audible(buffer: AudioBuffer): { offset: number; duration: number } {
  const data = buffer.getChannelData(0)
  let first = 0
  while (first < data.length && Math.abs(data[first]) < SILENCE) first++
  let last = data.length - 1
  while (last > first && Math.abs(data[last]) < SILENCE) last--
  const rate = buffer.sampleRate
  const offset = Math.max(0, first / rate - EDGE_PAD_S)
  const end = Math.min(buffer.duration, last / rate + EDGE_PAD_S)
  return { offset, duration: Math.max(0.05, end - offset) }
}

/** Načte a dekóduje všechny klipy hlasu (jednou; při chybě se zkusí znovu příště). */
export function loadVoice(voice: VoiceId): Promise<void> {
  let pending = loading.get(voice)
  if (!pending) {
    const clips = new Map<string, Clip>()
    pending = Promise.all(
      CLIP_IDS.map(async (id) => {
        const res = await fetch(`/voice/${voice}/${id}.mp3`)
        if (!res.ok) throw new Error(`Klip ${voice}/${id}: ${res.status}`)
        const buffer = await getContext().decodeAudioData(await res.arrayBuffer())
        clips.set(id, { buffer, ...audible(buffer) })
      }),
    ).then(
      () => {
        clipsByVoice.set(voice, clips)
      },
      (e: unknown) => {
        loading.delete(voice)
        throw e
      },
    )
    loading.set(voice, pending)
  }
  return pending
}

/** Jak dlouho bude hlášení trvat (ms). */
export function voiceDurationMs(voice: VoiceId, ids: readonly string[]): number {
  const clips = clipsByVoice.get(voice)
  const seconds = ids.reduce((s, id) => s + (clips?.get(id)?.duration ?? FALLBACK_CLIP_S), 0)
  return (seconds + WORD_GAP_S * Math.max(0, ids.length - 1)) * 1000
}

let generation = 0
let active: AudioBufferSourceNode[] = []

/**
 * Přehraje klipy za sebou; onDone po doznění — ne po stopVoice().
 * onStart dostane začátek každého klipu v čase performance.now() (zvýraznění aktuálního úderu).
 * leadS odloží začátek (hláška nepřekryje klepnutí).
 */
export function playClips(
  voice: VoiceId,
  ids: readonly string[],
  onDone?: () => void,
  onStart?: (startsMs: number[]) => void,
  leadS = 0,
): void {
  const gen = generation
  loadVoice(voice).then(
    () => {
      if (gen !== generation) return
      const clips = clipsByVoice.get(voice) as Map<string, Clip>
      const c = getContext()
      const now = c.currentTime
      const perfNow = performance.now()
      let t = now + 0.03 + leadS
      const started: AudioBufferSourceNode[] = []
      const startsMs: number[] = []
      for (const id of ids) {
        const clip = clips.get(id)
        if (!clip) continue
        const src = c.createBufferSource()
        src.buffer = clip.buffer
        src.connect(output())
        src.start(t, clip.offset, clip.duration)
        started.push(src)
        startsMs.push(perfNow + (t - now) * 1000)
        t += clip.duration + WORD_GAP_S
      }
      active.push(...started)
      onStart?.(startsMs)
      const endMs = (t - WORD_GAP_S - c.currentTime) * 1000
      setTimeout(() => {
        active = active.filter((s) => !started.includes(s))
        if (gen === generation) onDone?.()
      }, Math.max(0, endMs))
    },
    // Klipy se nenačetly (offline bez cache) — trénink se nesmí zaseknout.
    () => {
      if (gen === generation) onDone?.()
    },
  )
}

/** Utne hlas; čekající onDone se už nezavolají. */
export function stopVoice(): void {
  generation++
  for (const s of active) {
    try {
      s.stop()
    } catch {
      // už dohrál
    }
  }
  active = []
}

/** Ukázka hlasu z ťuknutí (Nastavení, detail komba): rozjede zvuk v gestu a přehraje klipy (R1). */
export function previewClips(
  voice: VoiceId,
  ids: readonly string[],
  silentOverride: boolean,
  onDone?: () => void,
): void {
  setSilentOverride(silentOverride)
  void resumeContext()
  stopVoice()
  playClips(voice, ids, onDone)
}
