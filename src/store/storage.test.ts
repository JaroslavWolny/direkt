import { describe, expect, it } from 'vitest'
import { chipText, comboTitle, parseMoves, speechText, wordText } from '../data/moves'
import {
  DEFAULT_CONFIG,
  DEFAULT_PRESETS,
  DEFAULT_SETTINGS,
  sanitizeConfig,
  sanitizeLibrary,
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
    expect(sanitizePresets(undefined)).toEqual(DEFAULT_PRESETS)
    expect(sanitizePresets([])).toEqual([])
    expect(sanitizePresets([{ id: 'a', name: '  Ráno  ', config: { rounds: 2 } }, { id: 'b', name: '' }, 3])).toEqual([
      { id: 'a', name: 'Ráno', config: { ...DEFAULT_CONFIG, rounds: 2 } },
    ])
  })
})
