// Všechny ladicí konstanty enginu (DOKUMENTACE.md kap. 7).

export type Intensity = 0 | 1 | 2
export const INTENSITIES: readonly Intensity[] = [0, 1, 2]
/** Tempo tréninku (plán, uložené tréninky, panel v kole): pevné, nebo stupňované po kolech (7.10). */
export type IntensityChoice = Intensity | 'ramp'
export const INTENSITY_CHOICES: readonly IntensityChoice[] = [...INTENSITIES, 'ramp']

/** Pauza po kombinaci (odpočinek před dalším hlášením), volba v Nastavení; platí při Středním tempu. */
export const PAUSE_MS_CHOICES = [0, 500, 1000, 2000, 3000] as const
export const DEFAULT_PAUSE_MS = 1000
/** Tempo Lehké pauzu prodlouží, Tvrdé zkrátí (nejmíň na 0). */
export const TEMPO_SHIFT_MS = 1000
/** Čas na provedení jedné akce (úder i obrana), volba v Nastavení, stejný pro všechna tempa. */
export const ACTION_MS_CHOICES = [300, 400, 500, 600, 700] as const
export const DEFAULT_ACTION_MS = 500
/** První hlášení po startovním gongu. */
export const FIRST_CALL_DELAY_MS = 1500

/** Váhy úrovní při losování: zvolená, o jednu nižší, o dvě nižší. */
export const LEVEL_WEIGHTS = [0.5, 0.3, 0.2] as const
/** Kolik posledních komb se nesmí opakovat (víc nejde než velikost bazénu − 1). */
export const NO_REPEAT_WINDOW = 3
/** „Znovu!" místo nového komba: pravděpodobnost a max. počet po sobě (7.9). */
export const REPEAT_CHANCE = 0.25
export const MAX_REPEATS = 2
/** Trénink plánu Technika a Obrana drilluje víc (7.11). */
export const REPEAT_CHANCE_DRILL = 0.4

/** Klepnutí 10 s před koncem kola, jen pro kola aspoň 30 s. */
export const WARNING_BEFORE_END_MS = 10_000
export const WARNING_MIN_ROUND_MS = 30_000
/** Pípnutí před koncem přípravy a pauzy (sekundy před koncem). */
export const COUNTDOWN_BEEPS_S = [3, 2, 1] as const

export interface Limit {
  min: number
  max: number
  step: number
}

export const LIMITS = {
  rounds: { min: 1, max: 12, step: 1 },
  roundSec: { min: 60, max: 600, step: 30 },
  restSec: { min: 15, max: 180, step: 15 },
  prepSec: { min: 5, max: 60, step: 5 },
} satisfies Record<string, Limit>

/** Volby v Nastavení (kap. 9.6) — data samotná snesou jemnější kroky z LIMITS. */
export const ROUND_MINUTE_CHOICES = [1, 2, 3, 4, 5, 6, 7, 8, 10] as const
export const REST_SEC_CHOICES = [30, 60, 90, 120, 180] as const
