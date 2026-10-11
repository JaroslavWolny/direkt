// Plán z dotazníku: 4 týdny, tréninky po pořadí bez data (DOKUMENTACE.md 7.11).
import type { Level } from '../data/combos'
import { LIMITS, type IntensityChoice } from './constants'
import type { Focus, WorkoutConfig } from './timeline'

export type Goal = Focus
export type PerWeek = 2 | 3 | 4
export type Minutes = 15 | 25 | 40

export interface PlanAnswers {
  /** Začínám / Trénuju / Závodím = úroveň komb. */
  experience: Level
  goal: Goal
  perWeek: PerWeek
  minutes: Minutes
}

export interface PlanSession {
  /** Týden 1–4. */
  week: number
  focus: Focus
  config: WorkoutConfig
}

export const PLAN_WEEKS = 4
export const GOALS: readonly Goal[] = ['kondice', 'technika']
export const PER_WEEK: readonly PerWeek[] = [2, 3, 4]
export const MINUTES: readonly Minutes[] = [15, 25, 40]

/** Podíl zvolených minut po týdnech — přidává se po týdnech, ne po dnech. */
const VOLUME = [0.7, 0.8, 0.9, 1] as const
const REST_KONDICE: Record<'zacatek' | 'jinak', readonly number[]> = {
  zacatek: [60, 60, 45, 45],
  jinak: [60, 45, 45, 30],
}
const REST_TECHNIKA = 60

function session(a: PlanAnswers, week: number, focus: Focus): PlanSession {
  const i = week - 1
  const roundSec = a.experience === 0 ? 120 : 180
  const beginner = a.experience === 0
  const restSec = focus === 'kondice' ? REST_KONDICE[beginner ? 'zacatek' : 'jinak'][i] : REST_TECHNIKA
  const intensity: IntensityChoice =
    focus === 'kondice' ? (beginner || week <= 2 ? 'ramp' : 2) : week <= 2 ? 0 : 1
  const level = (focus === 'technika' && week >= 3 ? Math.min(2, a.experience + 1) : a.experience) as Level
  const timeSec = a.minutes * 60 * VOLUME[i]
  const fit = Math.floor((timeSec + restSec) / (roundSec + restSec))
  const rounds = Math.min(LIMITS.rounds.max, Math.max(2, fit))
  return { week, focus, config: { rounds, roundSec, restSec, level, intensity, focus } }
}

/** Všechny tréninky plánu po pořadí; hlavní zaměření v týdnu převažuje (H V H V). */
export function buildPlan(a: PlanAnswers): PlanSession[] {
  const other: Goal = a.goal === 'kondice' ? 'technika' : 'kondice'
  const pattern = [a.goal, other, a.goal, other].slice(0, a.perWeek)
  return Array.from({ length: PLAN_WEEKS }, (_, w) => pattern.map((f) => session(a, w + 1, f))).flat()
}
