// Výběr komba (DOKUMENTACE.md kap. 7.1, Znovu 7.9).
import type { Combo, Level } from '../data/combos'
import { LEVEL_WEIGHTS, MAX_REPEATS, NO_REPEAT_WINDOW, REPEAT_CHANCE } from './constants'

/** Zapnutá komba s úrovní ≤ zvolené. */
export const buildPool = (combos: readonly Combo[], disabled: ReadonlySet<string>, level: Level): Combo[] =>
  combos.filter((c) => c.level <= level && !disabled.has(c.id))

export function createSelector(pool: readonly Combo[], level: Level, rng: () => number): () => Combo {
  if (pool.length === 0) throw new Error('Prázdný bazén komb')
  const windowSize = Math.min(NO_REPEAT_WINDOW, pool.length - 1)
  const recent: string[] = []

  return () => {
    // Nedávná komba se vyřadí předem; okno je menší než bazén, takže vždy něco zbyde.
    const candidates = pool.filter((c) => !recent.includes(c.id))
    const byLevel = new Map<Level, Combo[]>()
    for (const c of candidates) {
      const list = byLevel.get(c.level)
      if (list) list.push(c)
      else byLevel.set(c.level, [c])
    }
    const groups = [...byLevel].map(([lvl, list]) => ({ list, weight: LEVEL_WEIGHTS[level - lvl] ?? 0 }))
    const total = groups.reduce((s, g) => s + g.weight, 0)

    let r = rng() * total
    let group = groups[groups.length - 1]
    for (const g of groups) {
      if (r < g.weight) {
        group = g
        break
      }
      r -= g.weight
    }
    const combo = group.list[Math.min(group.list.length - 1, Math.floor(rng() * group.list.length))]

    if (windowSize > 0) {
      recent.push(combo.id)
      if (recent.length > windowSize) recent.shift()
    }
    return combo
  }
}

/** „Znovu!" místo nového komba? `repeats` = kolikrát po sobě už zaznělo; nejvýš MAX_REPEATS (7.9). */
export const shouldRepeat = (rng: () => number, repeats: number): boolean =>
  repeats < MAX_REPEATS && rng() < REPEAT_CHANCE
