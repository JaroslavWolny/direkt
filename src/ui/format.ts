import { voiceDurationMs, clipsFor } from '../audio/voice'
import type { VoiceId, VoiceLang } from '../data/voices'
import { wordText, type Move } from '../data/moves'
import type { Intensity } from '../engine/constants'
import type { Weekday } from '../engine/plan'
import type { WorkoutConfig } from '../engine/timeline'
import { gapMs } from '../engine/timing'
import { t } from '../i18n'
import type { Preset } from '../store/storage'

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

/** Délka tréninku bez odpočtu (Treninky.html): kola × kolo + (kola − 1) × pauza. */
export const workoutSec = (c: WorkoutConfig): number => c.rounds * c.roundSec + (c.rounds - 1) * c.restSec

export const workoutMinutes = (c: WorkoutConfig): number => Math.round(workoutSec(c) / 60)

/** Karta Dnešní trénink: „3 kola · 2:00 práce · 1:00 pauza". */
export const todayMeta = (c: WorkoutConfig): string =>
  t().home.meta(t().nRounds(c.rounds), formatSec(c.roundSec), formatSec(c.restSec))

/** Řádek uloženého tréninku: „3 kola · 2:00 / 1:00 · Začátečník". */
export const presetMeta = (c: WorkoutConfig): string => `${sessionMeta(c)} · ${t().level[c.level]}`

/** Vestavěný trénink se ukáže v jazyce rozhraní, vlastní pod svým názvem (9.8). */
export const presetName = (p: Preset): string => t().presetName[p.id] ?? p.name

/** Jak dlouho kombo v kole zabere: hlášení + mezera při dané intenzitě. */
export const comboSec = (moves: readonly Move[], intensity: Intensity, voice: VoiceId): number =>
  Math.round((voiceDurationMs(voice, clipsFor(moves)) + gapMs(moves.length, intensity)) / 1000)

/** Dlouhá sekvence v kole dostane menší písmo (zadání, kap. 8). */
export const wordsAreLong = (moves: readonly Move[], lang: VoiceLang): boolean =>
  moves.map((m) => wordText(m, lang)).join('').length + moves.length > 18

// ---------- plán (7.11) ----------

/** Dnešní den v týdnu jako v plánu: 0 = pondělí. */
export const todayWeekday = (): Weekday => ((new Date().getDay() + 6) % 7) as Weekday

/** Štítek karty tréninku na řadě: „Dnes · pondělí", jinak „Na řadě · středa" (7.11). */
export const sessionLabel = (weekday: Weekday): string => {
  const s = t().plan
  return `${weekday === todayWeekday() ? s.today : s.upNext} · ${s.dayName[weekday]}`
}

/** „3 kola · 2:00 / 1:00" */
export function sessionMeta(c: WorkoutConfig): string {
  return `${t().nRounds(c.rounds)} · ${formatSec(c.roundSec)} / ${formatSec(c.restSec)}`
}
