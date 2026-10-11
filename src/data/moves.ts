// Boxerské číslování a obrana (DOKUMENTACE.md kap. 5). Slova pro hlas i rozhraní se mění jen tady.
import type { Lang } from '../i18n'
import type { VoiceLang } from './voices'

export type Punch = '1' | '2' | '3' | '4' | '5' | '6'
export type BodyPunch = `${Punch}t`
export type Defense = 'uklon' | 'zaklon' | 'ponor' | 'kryt' | 'vzad' | 'ukrok'
export type Move = Punch | BodyPunch | Defense

export const PUNCHES: readonly Punch[] = ['1', '2', '3', '4', '5', '6']
export const DEFENSES: readonly Defense[] = ['uklon', 'zaklon', 'ponor', 'kryt', 'vzad', 'ukrok']

const NUMBER_WORD: Record<Punch, string> = {
  '1': 'jedna',
  '2': 'dva',
  '3': 'tři',
  '4': 'čtyři',
  '5': 'pět',
  '6': 'šest',
}

export const PUNCH_NAME: Record<Lang, Record<Punch, string>> = {
  cs: {
    '1': 'přední direkt',
    '2': 'zadní direkt',
    '3': 'přední hák',
    '4': 'zadní hák',
    '5': 'přední zvedák',
    '6': 'zadní zvedák',
  },
  en: {
    '1': 'jab',
    '2': 'cross',
    '3': 'lead hook',
    '4': 'rear hook',
    '5': 'lead uppercut',
    '6': 'rear uppercut',
  },
}

/** Povely, jak je trenér zakřičí na lapech, stejná slova jako hlas (kap. 5, 9.8). */
export const DEFENSE_LABEL: Record<Lang, Record<Defense, string>> = {
  cs: { uklon: 'Úklon', zaklon: 'Záklon', ponor: 'Dolů', kryt: 'Kryt', vzad: 'Vzad', ukrok: 'Stranou' },
  en: { uklon: 'Slip', zaklon: 'Pull', ponor: 'Roll', kryt: 'Block', vzad: 'Back', ukrok: 'Pivot' },
}

const DEFENSE_SPEECH: Record<Defense, string> = {
  uklon: 'úklon',
  zaklon: 'záklon',
  ponor: 'dolů',
  kryt: 'kryt',
  vzad: 'vzad',
  ukrok: 'stranou',
}

// Angličtina pro úderné hlasy (kap. 8) — musí sedět s texty v scripts/gen-voice.py.
const NUMBER_WORD_EN: Record<Punch, string> = {
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
}

const DEFENSE_SPEECH_EN: Record<Defense, string> = {
  uklon: 'slip',
  zaklon: 'pull',
  ponor: 'roll',
  kryt: 'block',
  vzad: 'back',
  ukrok: 'pivot',
}

/**
 * Jména úderů pro název kombinace, na hlavu / na tělo. Česky přední úder bez přívlastku, zadní
 * se „Zadní" — terminologie učebnic, ne „Jab – Cross" (kros je česky jiný úder, kap. 5).
 */
const PUNCH_TITLE: Record<Lang, Record<Punch, readonly [string, string]>> = {
  cs: {
    '1': ['Direkt', 'Direkt na tělo'],
    '2': ['Zadní direkt', 'Zadní direkt na tělo'],
    '3': ['Hák', 'Hák na tělo'],
    '4': ['Zadní hák', 'Zadní hák na tělo'],
    '5': ['Zvedák', 'Zvedák na tělo'],
    '6': ['Zadní zvedák', 'Zadní zvedák na tělo'],
  },
  en: {
    '1': ['Jab', 'Body jab'],
    '2': ['Cross', 'Body cross'],
    '3': ['Hook', 'Body hook'],
    '4': ['Rear hook', 'Rear body hook'],
    '5': ['Uppercut', 'Body uppercut'],
    '6': ['Rear uppercut', 'Rear body uppercut'],
  },
}

/** Zkratky obrany pro malé čipy (legenda na obrazovce Komba); anglicky podle slov hlasu. */
export const DEFENSE_ABBR: Record<Lang, Record<Defense, string>> = {
  cs: { uklon: 'Ú', zaklon: 'Z', ponor: 'D', kryt: 'K', vzad: 'V', ukrok: 'S' },
  en: { uklon: 'S', zaklon: 'PL', ponor: 'R', kryt: 'BL', vzad: 'BK', ukrok: 'PV' },
}

/** Přípona úderu na tělo v čipu: „3T" / „3B" (anglická literatura píše b = body). */
const BODY_MARK: Record<Lang, string> = { cs: 'T', en: 'B' }

const ALL_MOVES = new Set<string>([...PUNCHES, ...PUNCHES.map((p) => `${p}t`), ...DEFENSES])

export const isMove = (x: unknown): x is Move => typeof x === 'string' && ALL_MOVES.has(x)

export const isDefense = (m: Move): m is Defense => (DEFENSES as readonly string[]).includes(m)

export const isBody = (m: Move): m is BodyPunch => m.length === 2 && m.endsWith('t')

/** Číslo úderu, u obrany null. */
export const punchOf = (m: Move): Punch | null => (isDefense(m) ? null : (m[0] as Punch))

export function speakMove(m: Move, lang: VoiceLang = 'cs'): string {
  if (isDefense(m)) return (lang === 'en' ? DEFENSE_SPEECH_EN : DEFENSE_SPEECH)[m]
  const word = (lang === 'en' ? NUMBER_WORD_EN : NUMBER_WORD)[m[0] as Punch]
  if (!isBody(m)) return word
  return lang === 'en' ? `${word} body` : `${word} na tělo`
}

/** Text, který řekne hlas: „jedna, dva, tři na tělo" / „one, two, three body". */
export const speechText = (moves: readonly Move[], lang: VoiceLang = 'cs'): string =>
  moves.map((m) => speakMove(m, lang)).join(', ')

/** „1 2 3t úklon" → pole tahů; neznámé tokeny vyhodí chybu (jen pro vestavěná data). */
export function parseMoves(s: string): Move[] {
  return s
    .trim()
    .split(/\s+/)
    .map((t) => {
      if (!isMove(t)) throw new Error(`Neznámý tah: ${t}`)
      return t
    })
}

/** Název kombinace z úderů: „Direkt – Zadní direkt – Hák na tělo" / „Jab – Cross – Body hook". */
export const comboTitle = (moves: readonly Move[], lang: Lang = 'cs'): string =>
  moves
    .map((m) => (isDefense(m) ? DEFENSE_LABEL[lang][m] : PUNCH_TITLE[lang][m[0] as Punch][isBody(m) ? 1 : 0]))
    .join(' – ')

/** Text čipu: číslo, „3T" / „3B", nebo zkratka obrany. */
export const chipText = (m: Move, lang: Lang = 'cs'): string =>
  isDefense(m) ? DEFENSE_ABBR[lang][m] : isBody(m) ? `${m[0]}${BODY_MARK[lang]}` : m

/** Slovo do velké sekvence v kole (jazyk hlasu): „3", „3 TĚLO", „ÚKLON". */
export function wordText(m: Move, lang: VoiceLang = 'cs'): string {
  if (isDefense(m)) return DEFENSE_LABEL[lang][m].toUpperCase()
  if (isBody(m)) return `${m[0]} ${lang === 'en' ? 'BODY' : 'TĚLO'}`
  return m
}
