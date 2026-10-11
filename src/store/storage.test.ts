import { afterEach, describe, expect, it, vi } from 'vitest'
import { chipText, comboTitle, parseMoves, speechText, wordText } from '../data/moves'
import { detectLang } from '../i18n'
import { cs, z } from '../i18n/cs'
import { en } from '../i18n/en'
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
      'čtyři, pět, šest, dolů, záklon, kryt, vzad, stranou',
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
    expect(comboTitle(m)).toBe('Direkt – Zadní direkt – Hák na tělo – Úklon – Zadní zvedák')
    expect(m.map((x) => chipText(x))).toEqual(['1', '2', '3T', 'Ú', '6'])
    // povely z lap (kap. 5): Dolů, Stranou
    expect(comboTitle(parseMoves('3 ponor 3 ukrok'))).toBe('Hák – Dolů – Hák – Stranou')
    expect(parseMoves('ponor ukrok').map((x) => chipText(x))).toEqual(['D', 'S'])
    expect(m.map((x) => wordText(x))).toEqual(['1', '2', '3 TĚLO', 'ÚKLON', '6'])
    expect(m.map((x) => wordText(x, 'en'))).toEqual(['1', '2', '3 BODY', 'SLIP', '6'])
  })

  it('anglický název komba a čipy (9.8)', () => {
    const m = parseMoves('1 2 3t uklon 4t 6')
    expect(comboTitle(m, 'en')).toBe('Jab – Cross – Body hook – Slip – Rear body hook – Rear uppercut')
    expect(m.map((x) => chipText(x, 'en'))).toEqual(['1', '2', '3B', 'S', '4B', '6'])
    expect(parseMoves('zaklon ponor kryt vzad ukrok').map((x) => chipText(x, 'en'))).toEqual(['PL', 'R', 'BL', 'BK', 'PV'])
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

  it('jazyk: uložený platí, staré nastavení = čeština, první spuštění = jazyk zařízení (9.8)', () => {
    expect(sanitizeSettings({ lang: 'en' }, 'cs').lang).toBe('en')
    expect(sanitizeSettings({ lang: 'de' }, 'en').lang).toBe('cs')
    expect(sanitizeSettings({ onboarded: 2 }, 'en').lang).toBe('cs')
    expect(sanitizeSettings(undefined, 'en').lang).toBe('en')
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

describe('jazyk rozhraní (9.8)', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('jazyk zařízení: čeština a slovenština → cs, jinak en', () => {
    for (const [langs, want] of [
      [['cs-CZ', 'en-US'], 'cs'],
      [['sk'], 'cs'],
      [['en-GB', 'cs-CZ'], 'en'],
      [['de-DE'], 'en'],
      [[], 'en'],
    ] as const) {
      vi.stubGlobal('navigator', { languages: langs, language: langs[0] })
      expect(detectLang()).toBe(want)
    }
  })

  it('angličtina má všechny texty jako čeština a nic prázdného', () => {
    const keys = (o: object, at = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) =>
        v && typeof v === 'object' && !Array.isArray(v) && k !== 'presetName' ? keys(v, `${at}${k}.`) : [`${at}${k}`],
      )
    expect(keys(en)).toEqual(keys(cs))
    const empty = (o: object): boolean =>
      Object.values(o).some((v) => (typeof v === 'string' ? !v.trim() : v && typeof v === 'object' ? empty(v) : false))
    expect(empty(en)).toBe(false)
  })

  it('česky z/ze před číslem podle výslovnosti (9.9)', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(z).join(' ')).toBe('z ze ze ze z ze ze z z z z ze')
    expect([16, 20].map(z)).toEqual(['ze', 'ze'])
    expect(cs.workout.round(1, 5)).toBe('Kolo 1 z 5')
    expect(cs.workout.round(2, 3)).toBe('Kolo 2 ze 3')
    expect(cs.plan.progress(6, 12)).toBe('Plán: 6 ze 12 hotovo')
    expect(cs.nCombos(1)).toBe('1 kombinace')
    expect(cs.nCombos(42)).toBe('42 kombinací')
  })

  it('anglické názvy mají všechny vestavěné tréninky', () => {
    expect(DEFAULT_PRESETS.every((p) => en.presetName[p.id])).toBe(true)
  })
})
