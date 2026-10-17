import { describe, expect, it } from 'vitest'
import { BUILTIN_COMBOS, type Combo, type Level } from '../data/combos'
import {
  ACTION_MS_CHOICES,
  DEFAULT_PAUSE_MS,
  FIRST_CALL_DELAY_MS,
  INTENSITIES,
  MAX_REPEATS,
  WARNING_BEFORE_END_MS,
} from './constants'
import { mulberry32 } from './random'
import { buildPool, createSelector, shouldRepeat } from './selector'
import { comboWindowMs, fitsInRound, gapMs, inFinisher, tempoForRound } from './timing'

const draw = (level: Level, n: number, seed = 1, pool = buildPool(BUILTIN_COMBOS, new Set(), level)) => {
  const next = createSelector(pool, level, mulberry32(seed))
  return Array.from({ length: n }, next)
}

describe('vestavěná komba', () => {
  it('mají unikátní id, 1–8 akcí a počty 23/36/46', () => {
    const ids = BUILTIN_COMBOS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const c of BUILTIN_COMBOS) expect(c.moves.length).toBeGreaterThanOrEqual(1)
    for (const c of BUILTIN_COMBOS) expect(c.moves.length).toBeLessThanOrEqual(8)
    const count = (l: Level) => BUILTIN_COMBOS.filter((c) => c.level === l).length
    expect([count(0), count(1), count(2)]).toEqual([23, 36, 46])
  })

  it('nepoužívají id vyřazená ve v14 (vypnutá komba se ukládají podle id)', () => {
    const retired = [
      ...['z08', 'z11', 'z12', 'z13', 'z15'],
      ...['p02', 'p07', 'p08', 'p10', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18'],
      ...['e12', 'e13', 'e14', 'e15', 'e16', 'e17'],
    ]
    expect(BUILTIN_COMBOS.filter((c) => retired.includes(c.id))).toEqual([])
  })
})

describe('buildPool', () => {
  it('bere jen zapnutá komba do zvolené úrovně', () => {
    const pool = buildPool(BUILTIN_COMBOS, new Set(['z01', 'p01']), 1)
    expect(pool.some((c) => c.level === 2)).toBe(false)
    expect(pool.some((c) => c.id === 'z01' || c.id === 'p01')).toBe(false)
    expect(pool.length).toBe(23 + 36 - 2)
  })
})

describe('createSelector', () => {
  it('se stejným seedem dává stejnou sekvenci', () => {
    expect(draw(2, 200, 42).map((c) => c.id)).toEqual(draw(2, 200, 42).map((c) => c.id))
    expect(draw(2, 200, 42).map((c) => c.id)).not.toEqual(draw(2, 200, 43).map((c) => c.id))
  })

  it('Expert losuje úrovně zhruba 50/30/20', () => {
    const picks = draw(2, 10_000, 7)
    const share = (l: Level) => picks.filter((c) => c.level === l).length / picks.length
    expect(share(2)).toBeCloseTo(0.5, 1)
    expect(share(1)).toBeCloseTo(0.3, 1)
    expect(share(0)).toBeCloseTo(0.2, 1)
  })

  it('Pokročilý losuje 5:3 mezi svou a nižší úrovní a Expert nikdy', () => {
    const picks = draw(1, 10_000, 3)
    expect(picks.some((c) => c.level === 2)).toBe(false)
    expect(picks.filter((c) => c.level === 1).length / picks.length).toBeCloseTo(0.625, 1)
  })

  it('Začátečník bere jen začátečnická komba', () => {
    expect(draw(0, 2_000, 9).every((c) => c.level === 0)).toBe(true)
  })

  it('neopakuje žádné z posledních 3 komb', () => {
    const ids = draw(2, 5_000, 11).map((c) => c.id)
    ids.forEach((id, i) => expect(ids.slice(Math.max(0, i - 3), i)).not.toContain(id))
  })

  it('bazén s 1 kombem ho opakuje, se 2 komby střídá', () => {
    const one = BUILTIN_COMBOS.slice(0, 1)
    expect(draw(0, 5, 1, one).map((c) => c.id)).toEqual(Array(5).fill('z01'))
    const ids = draw(0, 6, 1, BUILTIN_COMBOS.slice(0, 2)).map((c) => c.id)
    ids.slice(1).forEach((id, i) => expect(id).not.toBe(ids[i]))
    expect(new Set(ids)).toEqual(new Set(['z01', 'z02']))
  })

  it('prázdný bazén vyhodí chybu', () => {
    expect(() => createSelector([], 0, Math.random)).toThrow()
  })
})

describe('načasování', () => {
  it('mezera = pauza po kombinaci (tempo ±1 s) + čas na úder × akce', () => {
    const pace = { pauseMs: 1000, actionMs: 500 }
    expect([2, 4, 7].map((a) => gapMs(a, 1, pace))).toEqual([2000, 3000, 4500])
    expect([2, 4, 7].map((a) => gapMs(a, 0, pace))).toEqual([3000, 4000, 5500])
    expect([2, 4, 7].map((a) => gapMs(a, 2, pace))).toEqual([1000, 2000, 3500])
    expect(gapMs(3, 1, { pauseMs: 3000, actionMs: 300 })).toBe(3900)
  })

  it('Tvrdé tempo pauzu nezkrátí pod nulu', () => {
    expect(gapMs(2, 2, { pauseMs: 500, actionMs: 400 })).toBe(800)
    expect(gapMs(2, 2, { pauseMs: 0, actionMs: 400 })).toBe(800)
  })

  it('poslední kombo kola se vždy stihne vyslovit i provést před gongem', () => {
    for (const intensity of INTENSITIES) {
      for (const roundSec of [60, 90, 180]) {
        // Délka hlášení jako u klipů: ~0,45–0,7 s na slovo + 70 ms mezi slovy.
        for (const perClipMs of [450, 700]) {
          for (const actionMs of ACTION_MS_CHOICES) {
            const pace = { pauseMs: DEFAULT_PAUSE_MS, actionMs }
            const roundMs = roundSec * 1000
            const next = createSelector(buildPool(BUILTIN_COMBOS, new Set(), 2), 2, mulberry32(roundSec + intensity))
            let t = FIRST_CALL_DELAY_MS
            let called = 0
            for (;;) {
              const combo: Combo = next()
              const speech = perClipMs * combo.moves.length + 70 * (combo.moves.length - 1)
              if (!fitsInRound(roundMs - t, speech, combo.moves.length, actionMs)) break
              expect(t + speech + actionMs * combo.moves.length).toBeLessThanOrEqual(roundMs)
              t += speech + gapMs(combo.moves.length, intensity, pace)
              called++
            }
            expect(called).toBeGreaterThan(3)
          }
        }
      }
    }
  })
})

describe('finiš (7.8)', () => {
  const round = (remainingMs: number, durationMs = 60_000) =>
    ({ phase: 'round', round: 1, remainingMs, durationMs }) as const

  it('okno pro komba končí 10 s před gongem', () => {
    expect(comboWindowMs(60_000, 60_000)).toBe(50_000)
    expect(comboWindowMs(10_000, 180_000)).toBe(0)
    expect(comboWindowMs(4_000, 60_000)).toBe(-6_000)
  })

  it('žádné kombo nepřetáhne do finiše', () => {
    for (const intensity of INTENSITIES) {
      for (const actionMs of ACTION_MS_CHOICES) {
        const pace = { pauseMs: DEFAULT_PAUSE_MS, actionMs }
        const roundMs = 60_000
        const next = createSelector(buildPool(BUILTIN_COMBOS, new Set(), 2), 2, mulberry32(7 + intensity))
        let t = FIRST_CALL_DELAY_MS
        let called = 0
        for (;;) {
          const combo: Combo = next()
          const speech = 700 * combo.moves.length + 70 * (combo.moves.length - 1)
          if (!fitsInRound(comboWindowMs(roundMs - t, roundMs), speech, combo.moves.length, actionMs)) break
          expect(t + speech + actionMs * combo.moves.length).toBeLessThanOrEqual(roundMs - WARNING_BEFORE_END_MS)
          t += speech + gapMs(combo.moves.length, intensity, pace)
          called++
        }
        expect(called).toBeGreaterThan(2)
      }
    }
  })

  it('běží posledních 10 s kola, jinde ne', () => {
    expect(inFinisher(round(10_001))).toBe(false)
    expect(inFinisher(round(10_000))).toBe(true)
    expect(inFinisher(round(1))).toBe(true)
    expect(inFinisher({ ...round(5_000), phase: 'rest' })).toBe(false)
    expect(inFinisher({ ...round(5_000), phase: 'prep' })).toBe(false)
  })

  it('kolo bez klepnutí (pod 30 s) finiš nemá', () => {
    expect(inFinisher(round(5_000, 20_000))).toBe(false)
    expect(comboWindowMs(5_000, 20_000)).toBe(5_000)
  })
})

describe('Znovu (7.9)', () => {
  const run = (seed: number) => {
    const rng = mulberry32(seed)
    let repeats = 0
    return Array.from({ length: 10_000 }, () => {
      repeats = shouldRepeat(rng, repeats) ? repeats + 1 : 0
      return repeats
    })
  }

  it('padne zhruba ve čtvrtině hlášení a nikdy víc než 2× po sobě', () => {
    const seq = run(42)
    const rate = seq.filter((r) => r > 0).length / seq.length
    expect(Math.max(...seq)).toBe(MAX_REPEATS)
    expect(rate).toBeGreaterThan(0.21) // ustálený stav ≈ 0,238 (strop 2× sníží 25 %)
    expect(rate).toBeLessThan(0.27)
  })

  it('po dvou „Znovu" vždy nové kombo', () => {
    expect(shouldRepeat(() => 0, MAX_REPEATS)).toBe(false)
    expect(shouldRepeat(() => 0, 0)).toBe(true)
    expect(shouldRepeat(() => 0.99, 0)).toBe(false)
  })

  it('se seedem deterministické', () => {
    expect(run(7)).toEqual(run(7))
  })
})

describe('stupňované tempo (7.10)', () => {
  const tempos = (rounds: number) => Array.from({ length: rounds }, (_, i) => tempoForRound('ramp', i + 1, rounds))

  it('od Lehkého po Tvrdé rovnoměrně', () => {
    expect(tempos(3)).toEqual([0, 1, 2])
    expect(tempos(6)).toEqual([0, 0, 1, 1, 2, 2])
    expect(tempos(2)).toEqual([0, 2])
    expect(tempos(12)[0]).toBe(0)
    expect(tempos(12)[11]).toBe(2)
  })

  it('jedno kolo = Střední', () => {
    expect(tempos(1)).toEqual([1])
  })

  it('pevná intenzita se po kolech nemění', () => {
    for (const i of INTENSITIES) expect([1, 2, 3].map((r) => tempoForRound(i, r, 3))).toEqual([i, i, i])
  })
})
