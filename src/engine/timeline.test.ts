import { describe, expect, it } from 'vitest'
import { mulberry32 } from './random'
import {
  buildSegments,
  eventsBetween,
  phaseAt,
  scheduleEvents,
  segmentEnd,
  totalMs,
  type WorkoutConfig,
  type WorkoutEvent,
} from './timeline'

const cfg = (over: Partial<WorkoutConfig> = {}): WorkoutConfig => ({
  rounds: 3,
  roundSec: 180,
  restSec: 60,
  level: 0,
  intensity: 1,
  ...over,
})

describe('časová osa', () => {
  const segs = buildSegments(cfg(), 15)

  it('příprava → kolo → pauza → … → poslední kolo, bez pauzy na konci', () => {
    expect(segs.map((s) => `${s.phase}${s.round}`)).toEqual(['prep1', 'round1', 'rest2', 'round2', 'rest3', 'round3'])
    expect(totalMs(segs)).toBe((15 + 3 * 180 + 2 * 60) * 1000)
  })

  it('phaseAt na hranicích fází', () => {
    expect(phaseAt(segs, 0)).toEqual({ phase: 'prep', round: 1, remainingMs: 15_000, durationMs: 15_000 })
    expect(phaseAt(segs, 14_999).phase).toBe('prep')
    expect(phaseAt(segs, 15_000)).toEqual({ phase: 'round', round: 1, remainingMs: 180_000, durationMs: 180_000 })
    expect(phaseAt(segs, 195_000)).toMatchObject({ phase: 'rest', round: 2, remainingMs: 60_000 })
    expect(phaseAt(segs, 255_000)).toMatchObject({ phase: 'round', round: 2 })
    expect(phaseAt(segs, totalMs(segs) - 1)).toMatchObject({ phase: 'round', round: 3, remainingMs: 1 })
    expect(phaseAt(segs, totalMs(segs))).toEqual({ phase: 'done', round: 3, remainingMs: 0, durationMs: 0 })
  })

  it('jedno kolo nemá pauzu ani „poslední kolo"', () => {
    const one = buildSegments(cfg({ rounds: 1, roundSec: 60 }), 5)
    expect(one.map((s) => s.phase)).toEqual(['prep', 'round'])
    expect(scheduleEvents(one).find((e) => e.type === 'roundStart')?.lastRound).toBe(false)
  })
})

describe('události', () => {
  it('počty a pořadí na konci', () => {
    const events = scheduleEvents(buildSegments(cfg(), 15))
    const count = (t: WorkoutEvent['type']) => events.filter((e) => e.type === t).length
    expect(count('roundStart')).toBe(3)
    expect(count('roundEnd')).toBe(3)
    expect(count('warning')).toBe(3)
    expect(count('finish')).toBe(1)
    expect(count('beep')).toBe(3 * 3) // příprava + 2 pauzy
    expect(events.filter((e) => e.lastRound).map((e) => e.round)).toEqual([3])
    expect(events.slice(-2).map((e) => e.type)).toEqual(['roundEnd', 'finish'])
  })

  it('klepnutí 10 s před koncem kola, ne u kol pod 30 s', () => {
    const events = scheduleEvents(buildSegments(cfg({ rounds: 1, roundSec: 60 }), 15))
    expect(events.find((e) => e.type === 'warning')?.atMs).toBe(15_000 + 50_000)
    const short = scheduleEvents([{ phase: 'round', round: 1, startMs: 0, durationMs: 20_000 }])
    expect(short.some((e) => e.type === 'warning')).toBe(false)
  })

  it('pípnutí 3, 2, 1 s před koncem přípravy', () => {
    const beeps = scheduleEvents(buildSegments(cfg({ rounds: 1 }), 15)).filter((e) => e.type === 'beep')
    expect(beeps.map((e) => e.atMs)).toEqual([12_000, 13_000, 14_000])
  })

  it('každá událost padne právě jednou i při nepravidelných a velkých skocích času', () => {
    const segs = buildSegments(cfg({ rounds: 4, roundSec: 90, restSec: 30 }), 10)
    const events = scheduleEvents(segs)
    const rng = mulberry32(5)
    const seen: WorkoutEvent[] = []
    let prev = -1
    while (prev < totalMs(segs)) {
      const next = Math.min(totalMs(segs), prev + 1 + Math.floor(rng() * 20_000))
      seen.push(...eventsBetween(events, prev, next))
      prev = next
    }
    expect(seen).toEqual(events)
  })
})

describe('přeskočení fáze (7.5)', () => {
  const segs = buildSegments(cfg({ rounds: 2, roundSec: 60, restSec: 30 }), 10)
  const events = scheduleEvents(segs)
  // Stejně jako runner: skok na konec fáze a události jen z (konec − 1, konec].
  const skipFrom = (ms: number) => {
    const end = segmentEnd(segs, ms)!
    return { end, fired: eventsBetween(events, end - 1, end).map((e) => e.type) }
  }

  it('z přípravy rovnou do kola: jen gong, žádné pípání', () => {
    expect(skipFrom(2_000)).toEqual({ end: 10_000, fired: ['roundStart'] })
  })

  it('z kola do pauzy: jen 3× gong, žádné klepnutí', () => {
    expect(skipFrom(20_000)).toEqual({ end: 70_000, fired: ['roundEnd'] })
  })

  it('z pauzy do dalšího kola, z posledního kola konec', () => {
    expect(skipFrom(75_000).fired).toEqual(['roundStart'])
    expect(skipFrom(110_000)).toEqual({ end: 160_000, fired: ['roundEnd', 'finish'] })
  })

  it('po konci tréninku už není kam skočit', () => {
    expect(segmentEnd(segs, totalMs(segs))).toBeNull()
  })
})
