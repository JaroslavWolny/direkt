// Načasování hlášení (DOKUMENTACE.md kap. 7.2).
import { BASE_GAP_MS, PER_ACTION_MS, type Intensity } from './constants'

/** Mezera od konce hlášení do dalšího hlášení. */
export const gapMs = (actions: number, intensity: Intensity): number => BASE_GAP_MS[intensity] + PER_ACTION_MS * actions

/** Vejde se kombo (vyslovit + provést) do zbytku kola? Radši ticho do gongu než useknuté kombo. */
export const fitsInRound = (remainingMs: number, speechMs: number, actions: number): boolean =>
  remainingMs >= speechMs + PER_ACTION_MS * actions
