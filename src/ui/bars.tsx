// RoundBar a RoundProgress (design/ZADANI.md kap. 3).
import type { WorkoutConfig } from '../engine/timeline'

interface RoundBarProps {
  config: WorkoutConfig
  /** Barvy jako CSS tokeny, např. 'var(--white)'. */
  work: string
  rest: string
  tight?: boolean
}

/** Časová osa tréninku: bloky kol a pauz v poměru jejich délek. */
export function RoundBar({ config, work, rest, tight }: RoundBarProps) {
  const segs: { flex: number; color: string }[] = []
  for (let r = 1; r <= config.rounds; r++) {
    segs.push({ flex: config.roundSec, color: work })
    if (r < config.rounds) segs.push({ flex: config.restSec, color: rest })
  }
  return (
    <span className={tight ? 'round-bar tight' : 'round-bar'} aria-hidden="true">
      {segs.map((s, i) => (
        <span key={i} style={{ flex: `${s.flex} 1 0`, background: s.color }} />
      ))}
    </span>
  )
}

interface ProgressProps {
  rounds: number
  /** Kolik segmentů je celých (hotová kola). */
  done: number
  /** Jak moc je naplněný segment za nimi (0–1). */
  partial?: number
  track: string
  fill: string
}

/** Segment na kolo, hotové plné, aktuální se plní zleva. */
export function RoundProgress({ rounds, done, partial = 0, track, fill }: ProgressProps) {
  return (
    <span className="progress" aria-hidden="true">
      {Array.from({ length: rounds }, (_, i) => {
        const f = i < done ? 1 : i === done ? partial : 0
        return (
          <span key={i} style={{ background: track }}>
            <i style={{ width: `${f * 100}%`, background: fill }} />
          </span>
        )
      })}
    </span>
  )
}
