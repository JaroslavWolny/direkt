import { describe, expect, it } from 'vitest'
import { LEVELS } from '../data/combos'
import { LIMITS } from './constants'
import { buildPlan, GOALS, MINUTES, PER_WEEK, PLAN_WEEKS, type PlanAnswers } from './plan'

const ALL: PlanAnswers[] = LEVELS.flatMap((experience) =>
  GOALS.flatMap((goal) =>
    PER_WEEK.flatMap((perWeek) => MINUTES.map((minutes) => ({ experience, goal, perWeek, minutes }))),
  ),
)

/** Délka tréninku bez odpočtu (s). */
const durationSec = (c: { rounds: number; roundSec: number; restSec: number }) =>
  c.rounds * c.roundSec + (c.rounds - 1) * c.restSec

const onStep = (v: number, lim: { min: number; max: number; step: number }) =>
  v >= lim.min && v <= lim.max && (v - lim.min) % lim.step === 0

describe('plán (7.11)', () => {
  it('4 týdny × zvolený počet tréninků, týdny po pořadí', () => {
    for (const a of ALL) {
      const plan = buildPlan(a)
      expect(plan).toHaveLength(PLAN_WEEKS * a.perWeek)
      expect(plan.map((s) => s.week)).toEqual([...plan.map((s) => s.week)].sort((x, y) => x - y))
    }
  })

  it('každý trénink je platné nastavení a vejde se do zvolených minut', () => {
    for (const a of ALL) {
      for (const s of buildPlan(a)) {
        const c = s.config
        expect(onStep(c.rounds, LIMITS.rounds)).toBe(true)
        expect(c.rounds).toBeGreaterThanOrEqual(2)
        expect(onStep(c.roundSec, LIMITS.roundSec)).toBe(true)
        expect(onStep(c.restSec, LIMITS.restSec)).toBe(true)
        expect(durationSec(c)).toBeLessThanOrEqual(a.minutes * 60)
        expect(c.focus).toBe(s.focus)
      }
    }
  })

  it('poslední týden využije zvolený čas (chybí méně než jedno kolo s pauzou)', () => {
    for (const a of ALL) {
      for (const s of buildPlan(a).filter((x) => x.week === PLAN_WEEKS)) {
        const c = s.config
        if (c.rounds < LIMITS.rounds.max) {
          expect(a.minutes * 60 - durationSec(c)).toBeLessThan(c.roundSec + c.restSec)
        }
      }
    }
  })

  it('objem po týdnech neklesá a pauza se neprodlužuje', () => {
    for (const a of ALL) {
      for (const focus of GOALS) {
        // první trénink daného zaměření v každém týdnu
        const byWeek = Array.from({ length: PLAN_WEEKS }, (_, w) =>
          buildPlan(a).find((s) => s.week === w + 1 && s.focus === focus),
        ).filter((s) => s !== undefined)
        for (let i = 1; i < byWeek.length; i++) {
          const [prev, cur] = [byWeek[i - 1].config, byWeek[i].config]
          expect(cur.rounds * cur.roundSec).toBeGreaterThanOrEqual(prev.rounds * prev.roundSec)
          expect(cur.restSec).toBeLessThanOrEqual(prev.restSec)
        }
      }
    }
  })

  it('hlavní zaměření převažuje: H V H V', () => {
    const week1 = (a: PlanAnswers) => buildPlan(a).filter((s) => s.week === 1).map((s) => s.focus)
    expect(week1({ experience: 1, goal: 'kondice', perWeek: 2, minutes: 25 })).toEqual(['kondice', 'technika'])
    expect(week1({ experience: 1, goal: 'technika', perWeek: 3, minutes: 25 })).toEqual(['technika', 'kondice', 'technika'])
    expect(week1({ experience: 1, goal: 'kondice', perWeek: 4, minutes: 25 })).toEqual([
      'kondice',
      'technika',
      'kondice',
      'technika',
    ])
  })

  it('začátečník, 15 min: start 3 × 2:00 / 1:00, konec 5 kol', () => {
    const plan = buildPlan({ experience: 0, goal: 'technika', perWeek: 2, minutes: 15 })
    expect(plan[0].config).toMatchObject({ rounds: 3, roundSec: 120, restSec: 60, level: 0, intensity: 0 })
    expect(plan[plan.length - 2].config).toMatchObject({ rounds: 5, roundSec: 120, restSec: 60 })
  })

  it('kondice: pauzy se zkracují, od 3. týdne tvrdé tempo (kromě začátečníka)', () => {
    const plan = buildPlan({ experience: 2, goal: 'kondice', perWeek: 2, minutes: 40 })
    const k = plan.filter((s) => s.focus === 'kondice').map((s) => s.config)
    expect(k.map((c) => c.restSec)).toEqual([60, 45, 45, 30])
    expect(k.map((c) => c.intensity)).toEqual(['ramp', 'ramp', 2, 2])
    expect(k[3]).toMatchObject({ rounds: 11, roundSec: 180 }) // 11 × 3:00 / 0:30 = 38 min
    const zacatek = buildPlan({ experience: 0, goal: 'kondice', perWeek: 2, minutes: 25 }).filter((s) => s.focus === 'kondice')
    expect(zacatek.map((s) => s.config.intensity)).toEqual(['ramp', 'ramp', 'ramp', 'ramp'])
  })

  it('technika: od 3. týdne o úroveň výš, nejvýš Expert', () => {
    const levels = (experience: 0 | 1 | 2) =>
      buildPlan({ experience, goal: 'technika', perWeek: 2, minutes: 25 })
        .filter((s) => s.focus === 'technika')
        .map((s) => s.config.level)
    expect(levels(0)).toEqual([0, 0, 1, 1])
    expect(levels(2)).toEqual([2, 2, 2, 2])
  })
})
