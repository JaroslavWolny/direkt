// Načasování hlášení (DOKUMENTACE.md kap. 7.2, finiš 7.8, stupňování 7.10).
import { BASE_GAP_MS, WARNING_BEFORE_END_MS, WARNING_MIN_ROUND_MS, type Intensity, type IntensityChoice } from './constants'
import type { PhaseState } from './timeline'

/** Mezera od konce hlášení do dalšího hlášení; actionMs = čas na úder z Nastavení. */
export const gapMs = (actions: number, intensity: Intensity, actionMs: number): number =>
  BASE_GAP_MS[intensity] + actionMs * actions

/** Vejde se kombo (vyslovit + provést) do zbytku kola? Radši ticho do gongu než useknuté kombo. */
export const fitsInRound = (remainingMs: number, speechMs: number, actions: number, actionMs: number): boolean =>
  remainingMs >= speechMs + actionMs * actions

/** Finiš začíná s klepnutím 10 s před koncem — má ho každé kolo, které klepnutí má (7.8). */
const hasFinisher = (roundMs: number): boolean => roundMs >= WARNING_MIN_ROUND_MS

/** Kolik času kola zbývá na komba — posledních 10 s patří finiši (7.8). */
export const comboWindowMs = (remainingMs: number, roundMs: number): number =>
  hasFinisher(roundMs) ? remainingMs - WARNING_BEFORE_END_MS : remainingMs

/** Běží finiš — volné údery naplno do gongu? */
export const inFinisher = (ps: PhaseState): boolean =>
  ps.phase === 'round' && hasFinisher(ps.durationMs) && ps.remainingMs <= WARNING_BEFORE_END_MS

/** Tempo kola: pevné, nebo stupňované Lehké → Tvrdé rovnoměrně po kolech; jedno kolo = Střední (7.10). */
export function tempoForRound(choice: IntensityChoice, round: number, rounds: number): Intensity {
  if (choice !== 'ramp') return choice
  if (rounds <= 1) return 1
  return Math.round((2 * (round - 1)) / (rounds - 1)) as Intensity
}
