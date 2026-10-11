// Plán z dotazníku: 4 týdny, dny jako rozvrh, postup po pořadí (DOKUMENTACE.md 7.11).
import type { Level } from '../data/combos'
import { LIMITS, type Intensity, type IntensityChoice } from './constants'
import type { Focus, WorkoutConfig } from './timeline'

/** Začínám / Pár měsíců / Rok a víc / Závodím. */
export type Experience = 0 | 1 | 2 | 3
export type Goal = Focus
export type PerWeek = 2 | 3 | 4 | 5
export type Minutes = 10 | 15 | 20 | 30
/** 0 = pondělí … 6 = neděle. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface PlanAnswers {
  experience: Experience
  /** Aspoň jeden cíl. */
  goals: Goal[]
  perWeek: PerWeek
  minutes: Minutes
}

export interface PlanSession {
  /** Týden 1–4. */
  week: number
  weekday: Weekday
  goal: Goal
  config: WorkoutConfig
}

export const PLAN_WEEKS = 4
export const EXPERIENCES: readonly Experience[] = [0, 1, 2, 3]
/** Pořadí, ve kterém se cíle v plánu střídají (= pořadí dlaždic v Otazka2). */
export const GOALS: readonly Goal[] = ['kondice', 'technika', 'sila', 'rychlost', 'obrana', 'hlava']
export const PER_WEEK: readonly PerWeek[] = [2, 3, 4, 5]
export const MINUTES: readonly Minutes[] = [10, 15, 20, 30]

/** Tréninkové dny s odstupem (ONBOARDING.md). */
export const TRAINING_DAYS: Record<PerWeek, readonly Weekday[]> = {
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 3, 4],
}

interface Base {
  level: Level
  roundSec: number
  restSec: number
  tempo: Intensity
}

/** Zkušenost → základ tréninku. */
const BASE: Record<Experience, Base> = {
  0: { level: 0, roundSec: 120, restSec: 60, tempo: 0 },
  1: { level: 1, roundSec: 120, restSec: 60, tempo: 1 },
  2: { level: 1, roundSec: 180, restSec: 60, tempo: 1 },
  3: { level: 2, roundSec: 180, restSec: 60, tempo: 2 },
}

interface Shape {
  roundSec: number
  restSec: number
  intensity: IntensityChoice
  /** Pod tuhle pauzu progrese nejde. */
  minRest: number
}

const slower = (t: Intensity): Intensity => Math.max(0, t - 1) as Intensity

/** Cíl → typ tréninku. */
function shape(goal: Goal, b: Base): Shape {
  switch (goal) {
    case 'kondice':
      return { roundSec: b.roundSec, restSec: b.restSec - 15, intensity: 'ramp', minRest: 30 }
    case 'technika':
    case 'obrana':
      return { roundSec: b.roundSec, restSec: b.restSec, intensity: slower(b.tempo), minRest: 45 }
    case 'sila': {
      // kratší kola, delší pauza, čas na plný úder; pauza se nezkracuje
      const restSec = b.restSec + 30
      return { roundSec: Math.max(60, b.roundSec - 30), restSec, intensity: 0, minRest: restSec }
    }
    case 'rychlost':
      return { roundSec: b.roundSec, restSec: b.restSec, intensity: 2, minRest: 30 }
    case 'hlava':
      return { roundSec: b.roundSec, restSec: b.restSec, intensity: 1, minRest: 45 }
  }
}

const REST_STEP = 15
/** Start = nejvíc kol, co se vejde, mínus tohle — místo na progresi. */
const HEADROOM = 2

/** Kola a pauza po týdnech: týden 2 a 4 +1 kolo, týden 3 pauza −0:15, nikdy obojí. */
function progression(s: Shape, minutes: Minutes): { rounds: number; restSec: number }[] {
  const limit = minutes * 60
  const fits = (rounds: number, rest: number) =>
    rounds <= LIMITS.rounds.max && rounds * s.roundSec + (rounds - 1) * rest <= limit
  let rest = s.restSec
  const most = Math.floor((limit + rest) / (s.roundSec + rest))
  let rounds = Math.max(2, Math.min(LIMITS.rounds.max, most) - HEADROOM)
  const weeks = [{ rounds, restSec: rest }]
  const addRound = (): boolean => {
    if (!fits(rounds + 1, rest)) return false
    rounds++
    return true
  }
  const cutRest = (): boolean => {
    if (rest - REST_STEP < s.minRest || !fits(rounds, rest - REST_STEP)) return false
    rest -= REST_STEP
    return true
  }
  for (let week = 2; week <= PLAN_WEEKS; week++) {
    if (week % 2 === 0) {
      if (!addRound()) cutRest()
    } else if (!cutRest()) {
      addRound()
    }
    weeks.push({ rounds, restSec: rest })
  }
  return weeks
}

/** Všechny tréninky plánu po pořadí; cíle se střídají napříč dny i týdny. */
export function buildPlan(a: PlanAnswers): PlanSession[] {
  const base = BASE[a.experience]
  const goals = GOALS.filter((g) => a.goals.includes(g))
  const days = TRAINING_DAYS[a.perWeek]
  const shapes = new Map(goals.map((g) => [g, shape(g, base)]))
  const steps = new Map(goals.map((g) => [g, progression(shape(g, base), a.minutes)]))
  return Array.from({ length: PLAN_WEEKS }, (_, w) =>
    days.map((weekday, i): PlanSession => {
      const goal = goals[(w * days.length + i) % goals.length]
      const s = shapes.get(goal) as Shape
      const { rounds, restSec } = (steps.get(goal) as ReturnType<typeof progression>)[w]
      return {
        week: w + 1,
        weekday,
        goal,
        config: { rounds, roundSec: s.roundSec, restSec, level: base.level, intensity: s.intensity, focus: goal },
      }
    }),
  ).flat()
}
