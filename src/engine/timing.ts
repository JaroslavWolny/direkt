// Načasování hlášení (DOKUMENTACE.md kap. 7.2, finiš 7.8).
import { BASE_GAP_MS, PER_ACTION_MS, WARNING_BEFORE_END_MS, WARNING_MIN_ROUND_MS, type Intensity } from './constants'
import type { PhaseState } from './timeline'

/** Mezera od konce hlášení do dalšího hlášení. */
export const gapMs = (actions: number, intensity: Intensity): number => BASE_GAP_MS[intensity] + PER_ACTION_MS * actions

/** Vejde se kombo (vyslovit + provést) do zbytku kola? Radši ticho do gongu než useknuté kombo. */
export const fitsInRound = (remainingMs: number, speechMs: number, actions: number): boolean =>
  remainingMs >= speechMs + PER_ACTION_MS * actions

/** Finiš začíná s klepnutím 10 s před koncem — má ho každé kolo, které klepnutí má (7.8). */
const hasFinisher = (roundMs: number): boolean => roundMs >= WARNING_MIN_ROUND_MS

/** Kolik času kola zbývá na komba — posledních 10 s patří finiši (7.8). */
export const comboWindowMs = (remainingMs: number, roundMs: number): number =>
  hasFinisher(roundMs) ? remainingMs - WARNING_BEFORE_END_MS : remainingMs

/** Běží finiš — volné údery naplno do gongu? */
export const inFinisher = (ps: PhaseState): boolean =>
  ps.phase === 'round' && hasFinisher(ps.durationMs) && ps.remainingMs <= WARNING_BEFORE_END_MS
