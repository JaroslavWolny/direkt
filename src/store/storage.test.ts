import { describe, expect, it } from 'vitest'
import { chipText, comboTitle, parseMoves, speechText, wordText } from '../data/moves'
import {
  DEFAULT_CONFIG,
  DEFAULT_PRESETS,
  DEFAULT_SETTINGS,
  PRESETS_VERSION,
  sanitizeConfig,
  sanitizeLibrary,
  sanitizePlan,
  sanitizePresets,
  sanitizeSettings,
} from './storage'

describe('text řeči', () => {
  it('čísla česky, úder na tělo, obrana slovem', () => {
    expect(speechText(parseMoves('1 2 3t uklon'))).toBe('jedna, dva, tři na tělo, úklon')
    expect(speechText(parseMoves('4 5 6 ponor zaklon kryt vzad ukrok'))).toBe(
      'čtyři, pět, šest, ponoř, záklon, kryt, vzad, úkrok',
    )
  })

  it('anglicky pro úderné hlasy (texty jako v scripts/gen-voice.py)', () => {
    expect(speechText(parseMoves('1 2 3t uklon'), 'en')).toBe('one, two, three body, slip')
    expect(speechText(parseMoves('4 5 6t ponor zaklon kryt vzad ukrok'), 'en')).toBe(
      'four, five, six body, roll, pull, block, back, pivot',
    )
  })

  it('název komba, čipy a slova do kola', () => {
    const m = parseMoves('1 2 3t uklon 6')
    expect(comboTitle(m)).toBe('Jab – Cross – Hák na tělo – Úklon – Zadní zvedák')
    expect(m.map(chipText)).toEqual(['1', '2', '3T', 'Ú', '6'])
    expect(m.map((x) => wordText(x))).toEqual(['1', '2', '3 TĚLO', 'ÚKLON', '6'])
    expect(m.map((x) => wordText(x, 'en'))).toEqual(['1', '2', '3 BODY', 'SLIP', '6'])
  })

  it('neznámý tah ve vestavěných datech je chyba', () => {
    expect(() => parseMoves('1 7')).toThrow()
  })
})

describe('obranné čtení úložiště', () => {
  it('nesmysly → výchozí hodnoty, nikdy pád', () => {
    for (const junk of [undefined, null, 42, 'x', [], { rounds: 'tři' }]) {
      expect(sanitizeConfig(junk)).toEqual(DEFAULT_CONFIG)
      expect(sanitizeSettings(junk)).toEqual(DEFAULT_SETTINGS)
      expect(sanitizeLibrary(junk)).toEqual({ disabled: [], custom: [] })
    }
  })

  it('hodnoty mimo rozsah se oříznou a zarovnají na krok', () => {
    expect(sanitizeConfig({ rounds: 99, roundSec: 100, restSec: 1, level: 5, intensity: 2 })).toEqual({
      rounds: 12,
      roundSec: 90,
      restSec: 15,
      level: 0,
      intensity: 2,
    })
    // staré klíče hlasu (voiceURI, rate) z doby speechSynthesis se zahodí
    expect(sanitizeSettings({ rate: 9, prepSec: 7, voiceURI: 3, silentOverride: 'ano' })).toEqual({
      ...DEFAULT_SETTINGS,
      prepSec: 5,
    })
    expect(sanitizeSettings({ prepSec: 22.4 }).prepSec).toBe(20)
  })

  it('plán: platný se načte, rozbitý nebo z v8 = žádný, postup se ořízne', () => {
    const answers = { experience: 1, goals: ['kondice', 'technika'], perWeek: 3, minutes: 15 }
    expect(sanitizePlan({ answers, done: 5 })).toEqual({ answers, done: 5 })
    expect(sanitizePlan({ answers, done: 99 })?.done).toBe(12)
    expect(sanitizePlan({ answers, done: -2 })?.done).toBe(0)
    expect(sanitizePlan({ answers, done: 'x' })?.done).toBe(0)
    // neznámé cíle pryč, pořadí podle dlaždic
    expect(sanitizePlan({ answers: { ...answers, goals: ['obrana', 'x', 'kondice'] } })?.answers.goals).toEqual([
      'kondice',
      'obrana',
    ])
    expect(sanitizePlan({ answers: { ...answers, goals: [] }, done: 1 })).toBeNull()
    expect(sanitizePlan({ answers: { ...answers, minutes: 25 }, done: 1 })).toBeNull()
    expect(sanitizePlan({ answers: { experience: 1, goal: 'kondice', perWeek: 3, minutes: 25 }, done: 1 })).toBeNull()
    expect(sanitizePlan(null)).toBeNull()
    expect(sanitizePlan('plán')).toBeNull()
  })

  it('úvod: verze, kterou už viděl (v8 ukládal true)', () => {
    expect(sanitizeSettings({}).onboarded).toBe(0)
    expect(sanitizeSettings({ onboarded: true }).onboarded).toBe(1)
    expect(sanitizeSettings({ onboarded: 2 }).onboarded).toBe(2)
    expect(sanitizeSettings({ onboarded: 'ano' }).onboarded).toBe(0)
  })

  it('stupňovaná intenzita se načte, neznámá padne na výchozí', () => {
    expect(sanitizeConfig({ intensity: 'ramp' }).intensity).toBe('ramp')
    expect(sanitizeConfig({ intensity: 'turbo' }).intensity).toBe(1)
  })

  it('hlas: známé id se nechá, neznámé → výchozí (Harry)', () => {
    expect(DEFAULT_SETTINGS.voice).toBe('harry')
    expect(sanitizeSettings({ voice: 'antonin' }).voice).toBe('antonin')
    expect(sanitizeSettings({ voice: 'liam' }).voice).toBe('harry')
    expect(sanitizeSettings({ voice: 7 }).voice).toBe('harry')
  })

  it('vlastní komba: zahodí rozbitá, nechá platná', () => {
    const lib = sanitizeLibrary({
      disabled: ['z01', 5],
      custom: [
        { id: 'c-1', level: 1, moves: ['1', '2t', 'uklon'] },
        { id: 'c-2', level: 1, moves: ['7'] },
        { id: 'c-3', level: 3, moves: ['1'] },
        { id: 'c-4', level: 0, moves: [] },
        { id: 'c-5', level: 0, moves: Array(9).fill('1') },
      ],
    })
    expect(lib.disabled).toEqual(['z01'])
    expect(lib.custom).toEqual([{ id: 'c-1', level: 1, moves: ['1', '2t', 'uklon'], custom: true }])
  })

  it('název vlastního komba: ořízne, zkrátí na 30 znaků, prázdný vynechá', () => {
    const lib = sanitizeLibrary({
      custom: [
        { id: 'a', level: 0, moves: ['1'], name: '  Moje 1  ' },
        { id: 'b', level: 0, moves: ['2'], name: 'x'.repeat(40) },
        { id: 'c', level: 0, moves: ['3'], name: '   ' },
      ],
    })
    expect(lib.custom.map((c) => c.name)).toEqual(['Moje 1', 'x'.repeat(30), undefined])
  })

  it('automatická pauza je výchozí zapnutá, vypne ji jen false', () => {
    expect(sanitizeSettings({}).autoPause).toBe(true)
    expect(sanitizeSettings({ autoPause: 'ne' }).autoPause).toBe(true)
    expect(sanitizeSettings({ autoPause: false }).autoPause).toBe(false)
  })

  it('tréninky: chybějící klíč → výchozí, prázdný seznam zůstane prázdný', () => {
    expect(sanitizePresets(undefined, undefined)).toEqual(DEFAULT_PRESETS)
    expect(sanitizePresets([], PRESETS_VERSION)).toEqual([])
    expect(sanitizePresets([{ id: 'a', name: '  Ráno  ', config: { rounds: 2 } }, { id: 'b', name: '' }, 3], PRESETS_VERSION)).toEqual([
      { id: 'a', name: 'Ráno', config: { ...DEFAULT_CONFIG, rounds: 2 } },
    ])
  })

  it('vestavěné tréninky sedí do limitů a mají unikátní id', () => {
    for (const p of DEFAULT_PRESETS) expect(sanitizeConfig(p.config)).toEqual(p.config)
    expect(new Set(DEFAULT_PRESETS.map((p) => p.id)).size).toBe(DEFAULT_PRESETS.length)
  })

  it('tréninky ze starší verze: nové vestavěné na konec, smazané se nevrací', () => {
    const own = { id: 'p-1', name: 'Můj', config: DEFAULT_CONFIG }
    const rozcvicka = DEFAULT_PRESETS[0]
    // v1 bez verze: uživatel smazal Profi kola a Amatérský zápas, přidal vlastní
    const upgraded = sanitizePresets([rozcvicka, own], undefined)
    const ids = upgraded.map((p) => p.id)
    expect(ids.slice(0, 2)).toEqual(['rozcvicka', 'p-1'])
    expect(ids).not.toContain('profi')
    expect(ids).not.toContain('amater')
    expect(ids).toContain('vypalovak')
    expect(ids).toContain('titul-muzi')
    expect(upgraded).toHaveLength(2 + DEFAULT_PRESETS.length - 3)
    // aktuální verze: nic se nepřidá (smazaný Vypalovák zůstane smazaný)
    expect(sanitizePresets([rozcvicka, own], PRESETS_VERSION)).toHaveLength(2)
    // co už v seznamu je, se nezdvojí
    const vypalovak = DEFAULT_PRESETS.find((p) => p.id === 'vypalovak')!
    expect(sanitizePresets([vypalovak], 1).filter((p) => p.id === 'vypalovak')).toHaveLength(1)
  })
})
