import { describe, expect, it } from 'vitest'
import { BUILTIN_COMBOS } from '../data/combos'
import { isDefense } from '../data/moves'
import { LIMITS } from './constants'
import {
  buildPlan,
  EXPERIENCES,
  GOALS,
  MINUTES,
  PER_WEEK,
  PLAN_WEEKS,
  TRAINING_DAYS,
  type Goal,
  type PlanAnswers,
} from './plan'
import { focusPool } from './selector'

/** Všechny neprázdné podmnožiny cílů. */
const GOAL_SETS: Goal[][] = Array.from({ length: 2 ** GOALS.length - 1 }, (_, m) =>
  GOALS.filter((_, i) => ((m + 1) >> i) & 1),
)

const ALL: PlanAnswers[] = EXPERIENCES.flatMap((experience) =>
  GOAL_SETS.flatMap((goals) =>
    PER_WEEK.flatMap((perWeek) => MINUTES.map((minutes) => ({ experience, goals, perWeek, minutes }))),
  ),
)

/** Délka tréninku bez odpočtu (s). */
const durationSec = (c: { rounds: number; roundSec: number; restSec: number }) =>
  c.rounds * c.roundSec + (c.rounds - 1) * c.restSec

const onStep = (v: number, lim: { min: number; max: number; step: number }) =>
  v >= lim.min && v <= lim.max && (v - lim.min) % lim.step === 0

const first = (a: PlanAnswers, goal: Goal, week = 1) =>
  buildPlan(a).find((s) => s.goal === goal && s.week === week)?.config

describe('plán v9 (7.11)', () => {
  it('4 týdny × frekvence, dny s odstupem podle rozvrhu', () => {
    for (const a of ALL) {
      const plan = buildPlan(a)
      expect(plan).toHaveLength(PLAN_WEEKS * a.perWeek)
      for (let w = 1; w <= PLAN_WEEKS; w++) {
        expect(plan.filter((s) => s.week === w).map((s) => s.weekday)).toEqual(TRAINING_DAYS[a.perWeek])
      }
    }
    expect(TRAINING_DAYS[2]).toEqual([0, 3]) // Po Čt
    expect(TRAINING_DAYS[3]).toEqual([0, 2, 4]) // Po St Pá
    expect(TRAINING_DAYS[4]).toEqual([0, 1, 3, 4]) // Po Út Čt Pá
    expect(TRAINING_DAYS[5]).toEqual([0, 1, 2, 3, 4]) // Po–Pá
  })

  it('každý trénink je platné nastavení a nepřesáhne zvolenou délku', () => {
    for (const a of ALL) {
      for (const s of buildPlan(a)) {
        const c = s.config
        expect(onStep(c.rounds, LIMITS.rounds)).toBe(true)
        expect(c.rounds).toBeGreaterThanOrEqual(2)
        expect(onStep(c.roundSec, LIMITS.roundSec)).toBe(true)
        expect(onStep(c.restSec, LIMITS.restSec)).toBe(true)
        expect(durationSec(c)).toBeLessThanOrEqual(a.minutes * 60)
        expect(c.focus).toBe(s.goal)
      }
    }
  })

  it('progrese: každý týden nejvýš jeden krok (+1 kolo, nebo pauza −0:15), nikdy obojí', () => {
    for (const a of ALL) {
      for (const goal of a.goals) {
        const weeks = Array.from({ length: PLAN_WEEKS }, (_, w) => first({ ...a, goals: [goal] }, goal, w + 1))
        for (let i = 1; i < weeks.length; i++) {
          const [prev, cur] = [weeks[i - 1]!, weeks[i]!]
          const moreRounds = cur.rounds - prev.rounds
          const shorterRest = prev.restSec - cur.restSec
          expect([0, 1]).toContain(moreRounds)
          expect([0, 15]).toContain(shorterRest)
          expect(moreRounds > 0 && shorterRest > 0).toBe(false)
        }
      }
    }
  })

  it('cíle se střídají po řadě dlaždic, napříč dny i týdny', () => {
    const plan = buildPlan({ experience: 1, goals: ['obrana', 'kondice', 'technika'], perWeek: 2, minutes: 15 })
    expect(plan.map((s) => s.goal)).toEqual([
      'kondice',
      'technika',
      'obrana',
      'kondice',
      'technika',
      'obrana',
      'kondice',
      'technika',
    ])
  })

  it('zkušenost: úroveň komb, kolo a tempo', () => {
    const tech = (experience: 0 | 1 | 2 | 3) => first({ experience, goals: ['technika'], perWeek: 3, minutes: 30 }, 'technika')
    expect(tech(0)).toMatchObject({ level: 0, roundSec: 120, restSec: 60, intensity: 0 })
    expect(tech(1)).toMatchObject({ level: 1, roundSec: 120, restSec: 60, intensity: 0 })
    expect(tech(2)).toMatchObject({ level: 1, roundSec: 180, restSec: 60, intensity: 0 })
    expect(tech(3)).toMatchObject({ level: 2, roundSec: 180, restSec: 60, intensity: 1 })
  })

  it('cíle: kondice kratší pauza a rostoucí tempo, síla kratší kola s delší pauzou, rychlost tvrdě', () => {
    const a = (goal: Goal): PlanAnswers => ({ experience: 2, goals: [goal], perWeek: 3, minutes: 30 })
    expect(first(a('kondice'), 'kondice')).toMatchObject({ roundSec: 180, restSec: 45, intensity: 'ramp' })
    expect(first(a('sila'), 'sila')).toMatchObject({ roundSec: 150, restSec: 90, intensity: 0 })
    expect(first(a('rychlost'), 'rychlost')).toMatchObject({ roundSec: 180, restSec: 60, intensity: 2 })
    expect(first(a('hlava'), 'hlava')).toMatchObject({ roundSec: 180, restSec: 60, intensity: 1 })
    // síla pauzu nezkracuje — progrese jen koly
    const sila = Array.from({ length: PLAN_WEEKS }, (_, w) => first(a('sila'), 'sila', w + 1)!.restSec)
    expect(sila).toEqual([90, 90, 90, 90])
  })

  it('začátečník, technika, 15 min: start 3 × 2:00 / 1:00 (start ze zdrojů), pak +kolo / −pauza / +kolo', () => {
    const a: PlanAnswers = { experience: 0, goals: ['technika'], perWeek: 2, minutes: 15 }
    const weeks = Array.from({ length: PLAN_WEEKS }, (_, w) => first(a, 'technika', w + 1)!)
    expect(weeks.map((c) => [c.rounds, c.restSec])).toEqual([
      [3, 60],
      [4, 60],
      [4, 45],
      [5, 45],
    ])
  })

  it('Obrana bere jen komba s obranou; bez nich celý bazén', () => {
    const pool = focusPool(BUILTIN_COMBOS, 'obrana')
    expect(pool.length).toBeGreaterThan(0)
    expect(pool.every((c) => c.moves.some(isDefense))).toBe(true)
    const bezObrany = BUILTIN_COMBOS.filter((c) => !c.moves.some(isDefense))
    expect(focusPool(bezObrany, 'obrana')).toBe(bezObrany)
    expect(focusPool(BUILTIN_COMBOS, 'kondice')).toBe(BUILTIN_COMBOS)
  })
})
