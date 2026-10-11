// Boxerské číslování a obrana (DOKUMENTACE.md kap. 5). Slova pro hlas se mění jen tady.
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

export const PUNCH_NAME: Record<Punch, string> = {
  '1': 'přední direkt',
  '2': 'zadní direkt',
  '3': 'přední hák',
  '4': 'zadní hák',
  '5': 'přední zvedák',
  '6': 'zadní zvedák',
}

export const DEFENSE_LABEL: Record<Defense, string> = {
  uklon: 'Úklon',
  zaklon: 'Záklon',
  ponor: 'Ponoř',
  kryt: 'Kryt',
  vzad: 'Vzad',
  ukrok: 'Úkrok',
}

const DEFENSE_SPEECH: Record<Defense, string> = {
  uklon: 'úklon',
  zaklon: 'záklon',
  ponor: 'ponoř',
  kryt: 'kryt',
  vzad: 'vzad',
  ukrok: 'úkrok',
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

/** Jména úderů pro název komba (styl předloh: „Jab – Cross – Hák"). */
const PUNCH_TITLE: Record<Punch, string> = {
  '1': 'Jab',
  '2': 'Cross',
  '3': 'Hák',
  '4': 'Zadní hák',
  '5': 'Zvedák',
  '6': 'Zadní zvedák',
}

/** Zkratky obrany pro malé čipy (legenda na obrazovce Komba). */
export const DEFENSE_ABBR: Record<Defense, string> = {
  uklon: 'Ú',
  zaklon: 'Z',
  ponor: 'P',
  kryt: 'K',
  vzad: 'V',
  ukrok: 'ÚK',
}

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

/** Název komba z úderů: „Jab – Cross – Hák na tělo". */
export const comboTitle = (moves: readonly Move[]): string =>
  moves
    .map((m) => (isDefense(m) ? DEFENSE_LABEL[m] : `${PUNCH_TITLE[m[0] as Punch]}${isBody(m) ? ' na tělo' : ''}`))
    .join(' – ')

/** Text čipu: číslo, „3T", nebo zkratka obrany. */
export const chipText = (m: Move): string => (isDefense(m) ? DEFENSE_ABBR[m] : isBody(m) ? `${m[0]}T` : m)

/** Slovo do velké sekvence v kole: „3", „3 TĚLO", „ÚKLON". */
export function wordText(m: Move, lang: VoiceLang = 'cs'): string {
  if (isDefense(m)) return (lang === 'en' ? DEFENSE_SPEECH_EN[m] : DEFENSE_LABEL[m]).toUpperCase()
  if (isBody(m)) return `${m[0]} ${lang === 'en' ? 'BODY' : 'TĚLO'}`
  return m
}
