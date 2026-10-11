// Úložiště (DOKUMENTACE.md kap. 11). Každý klíč se čte obranně: nesmysl → výchozí hodnota.
import { LEVELS, type Combo, type Level } from '../data/combos'
import { DEFAULT_VOICE, isVoiceId, type VoiceId } from '../data/voices'
import { isMove } from '../data/moves'
import { INTENSITY_CHOICES, LIMITS, type IntensityChoice, type Limit } from '../engine/constants'
import type { WorkoutConfig } from '../engine/timeline'

export interface Settings {
  prepSec: number
  silentOverride: boolean
  autoPause: boolean
  voice: VoiceId
}

export interface Library {
  /** Vypnutá vestavěná i vlastní komba (id). */
  disabled: string[]
  custom: Combo[]
}

export interface Preset {
  id: string
  name: string
  config: WorkoutConfig
}

export const MAX_MOVES = 8
export const MAX_NAME = 30

export const DEFAULT_CONFIG: WorkoutConfig = { rounds: 3, roundSec: 180, restSec: 60, level: 0, intensity: 1 }
export const DEFAULT_SETTINGS: Settings = {
  prepSec: 15,
  silentOverride: false,
  autoPause: true,
  voice: DEFAULT_VOICE,
}
export const DEFAULT_LIBRARY: Library = { disabled: [], custom: [] }
export const DEFAULT_PRESETS: Preset[] = [
  { id: 'rozcvicka', name: 'Rozcvička', config: { rounds: 3, roundSec: 120, restSec: 60, level: 0, intensity: 0 } },
  { id: 'amater', name: 'Amatérský zápas', config: { rounds: 3, roundSec: 180, restSec: 60, level: 1, intensity: 1 } },
  { id: 'profi', name: 'Profi kola', config: { rounds: 6, roundSec: 180, restSec: 60, level: 2, intensity: 2 } },
]

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x)

/** Číslo zarovnané na krok a oříznuté do rozsahu; cokoli jiného → výchozí. */
export function clampToLimit(v: unknown, lim: Limit, fallback: number): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) return fallback
  const snapped = lim.min + Math.round((v - lim.min) / lim.step) * lim.step
  const clamped = Math.min(lim.max, Math.max(lim.min, snapped))
  return Math.round(clamped * 1000) / 1000 // pryč s 1.0999999 z kroků 0,1
}

const pickFrom = <T>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback

export function sanitizeConfig(x: unknown): WorkoutConfig {
  const o = isObject(x) ? x : {}
  const d = DEFAULT_CONFIG
  return {
    rounds: clampToLimit(o.rounds, LIMITS.rounds, d.rounds),
    roundSec: clampToLimit(o.roundSec, LIMITS.roundSec, d.roundSec),
    restSec: clampToLimit(o.restSec, LIMITS.restSec, d.restSec),
    level: pickFrom<Level>(o.level, LEVELS, d.level),
    intensity: pickFrom<IntensityChoice>(o.intensity, INTENSITY_CHOICES, d.intensity),
  }
}

export function sanitizeSettings(x: unknown): Settings {
  const o = isObject(x) ? x : {}
  const d = DEFAULT_SETTINGS
  return {
    prepSec: clampToLimit(o.prepSec, LIMITS.prepSec, d.prepSec),
    silentOverride: o.silentOverride === true,
    autoPause: o.autoPause !== false,
    voice: isVoiceId(o.voice) ? o.voice : d.voice,
  }
}

function sanitizeCombo(x: unknown): Combo | null {
  if (!isObject(x) || typeof x.id !== 'string' || !LEVELS.includes(x.level as Level)) return null
  const moves = x.moves
  if (!Array.isArray(moves) || moves.length < 1 || moves.length > MAX_MOVES || !moves.every(isMove)) return null
  const combo: Combo = { id: x.id, level: x.level as Level, moves: [...moves], custom: true }
  const name = typeof x.name === 'string' ? x.name.trim().slice(0, MAX_NAME) : ''
  if (name) combo.name = name
  return combo
}

export function sanitizeLibrary(x: unknown): Library {
  if (!isObject(x)) return { ...DEFAULT_LIBRARY }
  const disabled = Array.isArray(x.disabled) ? x.disabled.filter((id): id is string => typeof id === 'string') : []
  const custom = Array.isArray(x.custom)
    ? x.custom.map(sanitizeCombo).filter((c): c is Combo => c !== null)
    : []
  return { disabled, custom }
}

/** Chybějící nebo rozbitý klíč → výchozí tréninky; prázdný seznam je platná volba. */
export function sanitizePresets(x: unknown): Preset[] {
  if (!Array.isArray(x)) return DEFAULT_PRESETS.map((p) => ({ ...p, config: { ...p.config } }))
  return x.flatMap((p) =>
    isObject(p) && typeof p.id === 'string' && typeof p.name === 'string' && p.name.trim()
      ? [{ id: p.id, name: p.name.trim(), config: sanitizeConfig(p.config) }]
      : [],
  )
}

// ---------- localStorage ----------

const PREFIX = 'direkt.v1.'

function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? undefined : JSON.parse(raw)
  } catch {
    return undefined
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // plné nebo zakázané úložiště — appka jede dál bez ukládání
  }
}

export const loadConfig = (): WorkoutConfig => sanitizeConfig(read('config'))
export const saveConfig = (v: WorkoutConfig): void => write('config', v)
export const loadSettings = (): Settings => sanitizeSettings(read('settings'))
export const saveSettings = (v: Settings): void => write('settings', v)
export const loadLibrary = (): Library => sanitizeLibrary(read('combos'))
export const saveLibrary = (v: Library): void => write('combos', v)
export const loadPresets = (): Preset[] => sanitizePresets(read('presets'))
export const savePresets = (v: Preset[]): void => write('presets', v)

export const sameConfig = (a: WorkoutConfig, b: WorkoutConfig): boolean =>
  a.rounds === b.rounds &&
  a.roundSec === b.roundSec &&
  a.restSec === b.restSec &&
  a.level === b.level &&
  a.intensity === b.intensity

export const newId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
