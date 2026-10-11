// Vestavěná komba (DOKUMENTACE.md kap. 6). [E] Evolve University, [S] Sting Sports.
import { parseMoves, type Move } from './moves'

export type Level = 0 | 1 | 2
export const LEVELS: readonly Level[] = [0, 1, 2]

export interface Combo {
  id: string
  level: Level
  moves: Move[]
  custom?: boolean
  /** Jen u vlastních komb. */
  name?: string
}

const c = (id: string, level: Level, moves: string): Combo => ({ id, level, moves: parseMoves(moves) })

export const BUILTIN_COMBOS: readonly Combo[] = [
  // Začátečník
  c('z01', 0, '1'),
  c('z02', 0, '1 1'),
  c('z03', 0, '1 2'), // [S]
  c('z04', 0, '1 1 2'), // [S]
  c('z05', 0, '1 2 1'),
  c('z06', 0, '1 2 3'), // [S]
  c('z07', 0, '2 3'),
  c('z08', 0, '3 2'),
  c('z09', 0, '1 2 1 2'),
  c('z10', 0, '2 3 2'), // [S]
  c('z11', 0, '1 2 kryt'),
  c('z12', 0, '1 2 vzad'),
  c('z13', 0, '1 1 2 vzad'),
  c('z14', 0, 'uklon 2'),
  c('z15', 0, '1 3'),
  // Pokročilý
  c('p01', 1, '1 2 3 2'), // [E][S]
  c('p02', 1, '3 2 3'), // [S]
  c('p03', 1, '1 6 3'), // [S]
  c('p04', 1, '1 6 3 2'),
  c('p05', 1, '1 2 5 2'), // [E]
  c('p06', 1, '1 2 3t'), // [E]
  c('p07', 1, '1 2 1t'), // [S]
  c('p08', 1, '2t 3 2'), // [S]
  c('p09', 1, '3t 3'), // [E]
  c('p10', 1, 'uklon 2 3'), // [S]
  c('p11', 1, '1 2 uklon 2'),
  c('p12', 1, '1 2 3 ponor'),
  c('p13', 1, '1 2 zaklon 2'),
  c('p14', 1, '1 2 ukrok'),
  c('p15', 1, '6 3 2'),
  c('p16', 1, '1 1 2 3'),
  c('p17', 1, '2 3 2 vzad'),
  c('p18', 1, '1 2 3 2 kryt'),
  // Expert
  c('e01', 2, '1 1 2 3 2'), // [E]
  c('e02', 2, '3 2 3t'), // [E]
  c('e03', 2, '2 3 2 ponor 2'), // [E]
  c('e04', 2, '6 3 3t'), // [E]
  c('e05', 2, '3 2 3 3t'), // [E]
  c('e06', 2, '1 2 3 ponor 3'), // [E]
  c('e07', 2, '5 4 3t'), // [E]
  c('e08', 2, '2 3t ukrok 3'), // [E]
  c('e09', 2, '1 6t 6'), // [E]
  c('e10', 2, '1 2 3 uklon 3t'), // [E]
  c('e11', 2, '1 2 uklon 2 3 2'),
  c('e12', 2, 'zaklon 2 3 2'),
  c('e13', 2, '1 2 3 2 ponor 2 3'),
  c('e14', 2, '1 6 3 2 ukrok'),
  c('e15', 2, '1 2 5 2 3 vzad'),
  c('e16', 2, '3t 3 2'),
  c('e17', 2, '1 2 3t 3 2'),
]

export const sameMoves = (a: readonly Move[], b: readonly Move[]): boolean =>
  a.length === b.length && a.every((m, i) => m === b[i])
