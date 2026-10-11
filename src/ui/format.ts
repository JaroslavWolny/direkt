import { voiceDurationMs, clipsFor } from '../audio/voice'
import type { VoiceId, VoiceLang } from '../data/voices'
import { LEVEL_LABEL } from '../data/combos'
import { wordText, type Move } from '../data/moves'
import type { Intensity } from '../engine/constants'
import type { Goal, PlanAnswers, Weekday } from '../engine/plan'
import type { WorkoutConfig } from '../engine/timeline'
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

export const DAY_SHORT = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'] as const
export const DAY_NAME = ['pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota', 'neděle'] as const

/** Dnešní den v týdnu jako v plánu: 0 = pondělí. */
export const todayWeekday = (): Weekday => ((new Date().getDay() + 6) % 7) as Weekday

/** Název tréninku plánu. */
export const GOAL_NAME: Record<Goal, string> = {
  kondice: 'Kondice',
  technika: 'Technika',
  sila: 'Síla úderu',
  rychlost: 'Rychlost',
  obrana: 'Obrana',
  hlava: 'Vyčistit hlavu',
}

/** Štítek karty tréninku na řadě: „Dnes · pondělí", jinak „Na řadě · středa" (7.11). */
export const sessionLabel = (weekday: Weekday): string =>
  `${weekday === todayWeekday() ? 'Dnes' : 'Na řadě'} · ${DAY_NAME[weekday]}`

/** „3 kola · 2:00 / 1:00" */
export const sessionMeta = (c: WorkoutConfig): string => `${rounds(c.rounds)} · ${formatSec(c.roundSec)} / ${formatSec(c.restSec)}`

const FOR_WHOM = ['začátečníka', 'mírně pokročilého', 'pokročilého', 'závodníka'] as const
const GOAL_ACC: Record<Goal, string> = {
  kondice: 'kondici',
  technika: 'techniku',
  sila: 'sílu úderu',
  rychlost: 'rychlost',
  obrana: 'obranu',
  hlava: 'vyčištění hlavy',
}

/** „kondici, techniku a obranu" */
const joinAnd = (xs: readonly string[]): string =>
  xs.length < 2 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} a ${xs[xs.length - 1]}`

/** Shrnutí odpovědí jednou větou (Plan.html). */
export const planSummary = (a: PlanAnswers): string =>
  `Pro ${FOR_WHOM[a.experience]} na ${joinAnd(a.goals.map((g) => GOAL_ACC[g]))}, ${a.perWeek}× týdně do ${a.minutes} minut. ` +
  'Každý týden přidáme kolo, nebo zkrátíme pauzu.'
