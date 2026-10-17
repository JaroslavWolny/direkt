// Úložiště (DOKUMENTACE.md kap. 11). Každý klíč se čte obranně: nesmysl → výchozí hodnota.
import { LEVELS, type Combo, type Level } from '../data/combos'
import { DEFAULT_VOICE, isVoiceId, type VoiceId } from '../data/voices'
import { isLang, detectLang, type Lang } from '../i18n'
import { isMove } from '../data/moves'
import { ACTION_MS_CHOICES, DEFAULT_ACTION_MS, DEFAULT_PAUSE_MS, INTENSITY_CHOICES, PAUSE_MS_CHOICES, LIMITS, type IntensityChoice, type Limit } from '../engine/constants'
import { EXPERIENCES, GOALS, MINUTES, PER_WEEK, PLAN_WEEKS, type Experience, type Minutes, type PerWeek, type PlanAnswers } from '../engine/plan'
import type { WorkoutConfig } from '../engine/timeline'

export interface Settings {
  prepSec: number
  /** Pauza po kombinaci v ms (7.2). */
  pauseMs: number
  /** Čas na úder v ms (7.2). */
  actionMs: number
  silentOverride: boolean
  autoPause: boolean
  voice: VoiceId
  /** Verze úvodu, kterou už viděl (9.0); menší než ONBOARDING_VERSION = ukázat. */
  onboarded: number
  /** Jazyk rozhraní, nezávislý na hlasu (9.8). */
  lang: Lang
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

/** Jen postup — tréninky se počítají z odpovědí (7.11). */
export interface Plan {
  answers: PlanAnswers
  done: number
}

/** v9: nový úvod a dotazník se ukážou i tomu, kdo prošel úvodem v8. */
export const ONBOARDING_VERSION = 2

export const MAX_MOVES = 8
export const MAX_NAME = 30

export const DEFAULT_CONFIG: WorkoutConfig = { rounds: 3, roundSec: 180, restSec: 60, level: 0, intensity: 1 }
export const DEFAULT_SETTINGS: Settings = {
  prepSec: 15,
  pauseMs: DEFAULT_PAUSE_MS,
  actionMs: DEFAULT_ACTION_MS,
  silentOverride: false,
  autoPause: true,
  voice: DEFAULT_VOICE,
  onboarded: 0,
  lang: 'cs',
}
export const DEFAULT_LIBRARY: Library = { disabled: [], custom: [] }
export const DEFAULT_PRESETS: Preset[] = [
  { id: 'rozcvicka', name: 'Rozcvička', config: { rounds: 3, roundSec: 120, restSec: 60, level: 0, intensity: 0 } },
  { id: 'amater', name: 'Amatérský zápas', config: { rounds: 3, roundSec: 180, restSec: 60, level: 1, intensity: 1 } },
  { id: 'profi', name: 'Profi kola', config: { rounds: 6, roundSec: 180, restSec: 60, level: 2, intensity: 2 } },
  { id: 'technika', name: 'Technika', config: { rounds: 4, roundSec: 180, restSec: 60, level: 1, intensity: 0 } },
  { id: 'kondice', name: 'Kondice', config: { rounds: 5, roundSec: 180, restSec: 60, level: 1, intensity: 'ramp' } },
  { id: 'silove-minuty', name: 'Silové minuty', config: { rounds: 10, roundSec: 60, restSec: 60, level: 1, intensity: 2 } },
  { id: 'vypalovak', name: 'Vypalovák', config: { rounds: 8, roundSec: 180, restSec: 30, level: 2, intensity: 2 } },
  { id: 'titul-zeny', name: 'Zápas o titul – ženy', config: { rounds: 10, roundSec: 120, restSec: 60, level: 2, intensity: 1 } },
  { id: 'titul-muzi', name: 'Zápas o titul – muži', config: { rounds: 12, roundSec: 180, restSec: 60, level: 2, intensity: 'ramp' } },
]

/** Verze vestavěného seznamu (9.5); trénink bez záznamu v PRESET_SINCE je tam od verze 1. */
export const PRESETS_VERSION = 2
const PRESET_SINCE: Record<string, number> = {
  technika: 2,
  kondice: 2,
  'silove-minuty': 2,
  vypalovak: 2,
  'titul-zeny': 2,
  'titul-muzi': 2,
}

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

/** `firstRunLang` platí jen bez uloženého nastavení; kdo appku už měl, měl ji česky (9.8). */
export function sanitizeSettings(x: unknown, firstRunLang: Lang = DEFAULT_SETTINGS.lang): Settings {
  const o = isObject(x) ? x : {}
  const d = DEFAULT_SETTINGS
  return {
    prepSec: clampToLimit(o.prepSec, LIMITS.prepSec, d.prepSec),
    pauseMs: pickFrom<number>(o.pauseMs, PAUSE_MS_CHOICES, d.pauseMs),
    actionMs: pickFrom<number>(o.actionMs, ACTION_MS_CHOICES, d.actionMs),
    silentOverride: o.silentOverride === true,
    autoPause: o.autoPause !== false,
    voice: isVoiceId(o.voice) ? o.voice : d.voice,
    // v8 ukládal true
    onboarded: o.onboarded === true ? 1 : typeof o.onboarded === 'number' && Number.isInteger(o.onboarded) ? Math.max(0, o.onboarded) : 0,
    lang: isLang(o.lang) ? o.lang : isObject(x) ? 'cs' : firstRunLang,
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

const copyPreset = (p: Preset): Preset => ({ ...p, config: { ...p.config } })

/**
 * Chybějící nebo rozbitý klíč → výchozí tréninky; prázdný seznam je platná volba.
 * Seznam uložený starší verzí (`version`, chybí = 1) dostane na konec vestavěné tréninky,
 * které od té doby přibyly — jen jednou, smazané se nevrací.
 */
export function sanitizePresets(x: unknown, version: unknown): Preset[] {
  if (!Array.isArray(x)) return DEFAULT_PRESETS.map(copyPreset)
  const kept = x.flatMap((p) =>
    isObject(p) && typeof p.id === 'string' && typeof p.name === 'string' && p.name.trim()
      ? [{ id: p.id, name: p.name.trim(), config: sanitizeConfig(p.config) }]
      : [],
  )
  const from = typeof version === 'number' && Number.isInteger(version) ? version : 1
  const added = DEFAULT_PRESETS.filter(
    (p) => (PRESET_SINCE[p.id] ?? 1) > from && !kept.some((k) => k.id === p.id),
  ).map(copyPreset)
  return [...kept, ...added]
}

/** Rozbitý, neúplný nebo starý plán (v8) → žádný plán (dotazník jde vyplnit znovu). */
export function sanitizePlan(x: unknown): Plan | null {
  if (!isObject(x) || !isObject(x.answers)) return null
  const a = x.answers
  const goals = Array.isArray(a.goals) ? GOALS.filter((g) => (a.goals as unknown[]).includes(g)) : []
  if (
    !EXPERIENCES.includes(a.experience as Experience) ||
    goals.length === 0 ||
    !PER_WEEK.includes(a.perWeek as PerWeek) ||
    !MINUTES.includes(a.minutes as Minutes)
  ) {
    return null
  }
  const answers: PlanAnswers = {
    experience: a.experience as Experience,
    goals,
    perWeek: a.perWeek as PerWeek,
    minutes: a.minutes as Minutes,
  }
  const total = PLAN_WEEKS * answers.perWeek
  const done = typeof x.done === 'number' && Number.isInteger(x.done) ? Math.min(total, Math.max(0, x.done)) : 0
  return { answers, done }
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
export const loadSettings = (): Settings => sanitizeSettings(read('settings'), detectLang())
export const saveSettings = (v: Settings): void => write('settings', v)
export const loadLibrary = (): Library => sanitizeLibrary(read('combos'))
export const saveLibrary = (v: Library): void => write('combos', v)
export const loadPresets = (): Preset[] => sanitizePresets(read('presets'), read('presetsVersion'))
export const savePresets = (v: Preset[]): void => {
  write('presets', v)
  write('presetsVersion', PRESETS_VERSION)
}
export const loadPlan = (): Plan | null => sanitizePlan(read('plan'))
export const savePlan = (v: Plan | null): void => write('plan', v)

export const sameConfig = (a: WorkoutConfig, b: WorkoutConfig): boolean =>
  a.rounds === b.rounds &&
  a.roundSec === b.roundSec &&
  a.restSec === b.restSec &&
  a.level === b.level &&
  a.intensity === b.intensity

export const newId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
