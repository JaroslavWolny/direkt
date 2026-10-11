// Časová osa tréninku a zvukové události (DOKUMENTACE.md kap. 7.3).
import type { Level } from '../data/combos'
import { COUNTDOWN_BEEPS_S, WARNING_BEFORE_END_MS, WARNING_MIN_ROUND_MS, type Intensity } from './constants'

export interface WorkoutConfig {
  rounds: number
  roundSec: number
  restSec: number
  level: Level
  intensity: Intensity
}

export type Phase = 'prep' | 'round' | 'rest' | 'done'

export interface Segment {
  phase: Exclude<Phase, 'done'>
  /** Kolo, které běží; u přípravy a pauzy to, které přijde. */
  round: number
  startMs: number
  durationMs: number
}

export interface PhaseState {
  phase: Phase
  round: number
  remainingMs: number
  durationMs: number
}

export type EventType = 'beep' | 'roundStart' | 'warning' | 'roundEnd' | 'finish'

export interface WorkoutEvent {
  atMs: number
  type: EventType
  round: number
  /** Poslední kolo tréninku s víc než jedním kolem — hlas řekne „Poslední kolo". */
  lastRound?: boolean
}

export function buildSegments(config: WorkoutConfig, prepSec: number): Segment[] {
  const segs: Segment[] = []
  let t = 0
  const push = (phase: Segment['phase'], round: number, durationMs: number) => {
    segs.push({ phase, round, startMs: t, durationMs })
    t += durationMs
  }
  push('prep', 1, prepSec * 1000)
  for (let r = 1; r <= config.rounds; r++) {
    push('round', r, config.roundSec * 1000)
    if (r < config.rounds) push('rest', r + 1, config.restSec * 1000)
  }
  return segs
}

export const totalMs = (segs: readonly Segment[]): number => {
  const last = segs[segs.length - 1]
  return last ? last.startMs + last.durationMs : 0
}

export function phaseAt(segs: readonly Segment[], elapsedMs: number): PhaseState {
  for (const s of segs) {
    if (elapsedMs < s.startMs + s.durationMs) {
      return {
        phase: s.phase,
        round: s.round,
        remainingMs: s.startMs + s.durationMs - Math.max(elapsedMs, s.startMs),
        durationMs: s.durationMs,
      }
    }
  }
  const lastRound = segs.reduce((m, s) => Math.max(m, s.round), 0)
  return { phase: 'done', round: lastRound, remainingMs: 0, durationMs: 0 }
}

/** Všechny zvukové události tréninku s absolutními časy, seřazené. */
export function scheduleEvents(segs: readonly Segment[]): WorkoutEvent[] {
  const rounds = segs.filter((s) => s.phase === 'round').length
  const events: WorkoutEvent[] = []
  for (const s of segs) {
    const end = s.startMs + s.durationMs
    if (s.phase === 'round') {
      const lastRound = s.round === rounds && rounds > 1
      events.push({ atMs: s.startMs, type: 'roundStart', round: s.round, lastRound })
      if (s.durationMs >= WARNING_MIN_ROUND_MS) {
        events.push({ atMs: end - WARNING_BEFORE_END_MS, type: 'warning', round: s.round })
      }
      events.push({ atMs: end, type: 'roundEnd', round: s.round })
      if (s.round === rounds) events.push({ atMs: end, type: 'finish', round: s.round })
    } else {
      for (const sec of COUNTDOWN_BEEPS_S) {
        if (s.durationMs > sec * 1000) events.push({ atMs: end - sec * 1000, type: 'beep', round: s.round })
      }
    }
  }
  // Stabilní řazení: při shodném čase zůstane pořadí vložení (roundEnd před finish).
  return events.sort((a, b) => a.atMs - b.atMs)
}

/** Konec fáze, ve které je čas `elapsedMs`; po konci tréninku null (7.5). */
export function segmentEnd(segs: readonly Segment[], elapsedMs: number): number | null {
  const s = segs.find((x) => elapsedMs < x.startMs + x.durationMs)
  return s ? s.startMs + s.durationMs : null
}

/** Události v intervalu (od, do] — každá padne právě jednou i při velkém skoku času. */
export const eventsBetween = (events: readonly WorkoutEvent[], fromMs: number, toMs: number): WorkoutEvent[] =>
  events.filter((e) => e.atMs > fromMs && e.atMs <= toMs)
