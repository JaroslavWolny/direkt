import { voiceDurationMs, clipsFor } from '../audio/voice'
import type { VoiceId, VoiceLang } from '../data/voices'
import { LEVEL_LABEL } from '../data/combos'
import { wordText, type Move } from '../data/moves'
import { INTENSITY_LABEL, type Intensity } from '../engine/constants'
import type { PlanAnswers } from '../engine/plan'
import type { Focus, WorkoutConfig } from '../engine/timeline'
import { gapMs } from '../engine/timing'

const pad = (n: number) => String(n).padStart(2, '0')

/** Sekundy → „3:00", od hodiny „1:02:30" (předlohy: bez úvodní nuly). */
export function formatSec(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`
}

/** Odpočet zaokrouhluje nahoru: 0,4 s zbývá → „0:01". */
export const formatCountdown = (ms: number): string => formatSec(Math.ceil(ms / 1000))

/** Český tvar podle počtu: 1 kolo, 2–4 kola, 5+ kol. */
export const plural = (n: number, one: string, few: string, many: string): string =>
  n === 1 ? one : n >= 2 && n <= 4 ? few : many

export const rounds = (n: number): string => `${n} ${plural(n, 'kolo', 'kola', 'kol')}`

/** Délka tréninku bez odpočtu (Treninky.html): kola × kolo + (kola − 1) × pauza. */
export const workoutSec = (c: WorkoutConfig): number => c.rounds * c.roundSec + (c.rounds - 1) * c.restSec

export const workoutMinutes = (c: WorkoutConfig): number => Math.round(workoutSec(c) / 60)

/** Karta Dnešní trénink: „3 kola · 2:00 práce · 1:00 pauza". */
export const todayMeta = (c: WorkoutConfig): string =>
  `${rounds(c.rounds)} · ${formatSec(c.roundSec)} práce · ${formatSec(c.restSec)} pauza`

/** Řádek uloženého tréninku: „3 kola · 2:00 / 1:00 · Začátečník". */
export const presetMeta = (c: WorkoutConfig): string =>
  `${rounds(c.rounds)} · ${formatSec(c.roundSec)} / ${formatSec(c.restSec)} · ${LEVEL_LABEL[c.level]}`

/** Jak dlouho kombo v kole zabere: hlášení + mezera při dané intenzitě. */
export const comboSec = (moves: readonly Move[], intensity: Intensity, voice: VoiceId): number =>
  Math.round((voiceDurationMs(voice, clipsFor(moves)) + gapMs(moves.length, intensity)) / 1000)

/** Dlouhá sekvence v kole dostane menší písmo (zadání, kap. 8). */
export const wordsAreLong = (moves: readonly Move[], lang: VoiceLang): boolean =>
  moves.map((m) => wordText(m, lang)).join('').length + moves.length > 18

// ---------- plán (7.11) ----------

export const EXPERIENCE_LABEL = ['Začínám', 'Trénuju', 'Závodím'] as const
export const FOCUS_LABEL: Record<Focus, string> = { kondice: 'Kondice', technika: 'Technika' }

/** Řádek tréninku plánu: „4 kola · 3:00 / 0:45 · Rostoucí". */
export const sessionMeta = (c: WorkoutConfig): string =>
  `${rounds(c.rounds)} · ${formatSec(c.roundSec)} / ${formatSec(c.restSec)} · ${INTENSITY_LABEL[c.intensity]}`

/** Odpovědi dotazníku: „Trénuju · Kondice · 3× týdně · 25 min". */
export const answersText = (a: PlanAnswers): string =>
  `${EXPERIENCE_LABEL[a.experience]} · ${FOCUS_LABEL[a.goal]} · ${a.perWeek}× týdně · ${a.minutes} min`
