// PunchSequence a velká sekvence v kole (design/ZADANI.md kap. 3, Trenink.html).
import { chipText, isBody, isDefense, speechText, wordText, type Move } from '../data/moves'
import type { VoiceLang } from '../data/voices'
import { getLang } from '../i18n'

interface SequenceProps {
  moves: readonly Move[]
  /** s = 28 px (seznam Komba), m = 34 px, prep = 32 px (Odpočet) */
  size?: 's' | 'm' | 'prep'
  inverse?: boolean
}

/** Čísla = plné kolečko, úder na tělo a obrana = obrysová pilulka v akcentu. */
export function PunchSequence({ moves, size = 's', inverse }: SequenceProps) {
  const cls = ['seq', size !== 's' && size, inverse && 'inverse'].filter(Boolean).join(' ')
  const lang = getLang()
  return (
    <span className={cls} role="img" aria-label={speechText(moves, lang)}>
      {moves.map((m, i) => (
        <span key={i} className={isDefense(m) || isBody(m) ? 'chip mod' : 'chip num'}>
          {chipText(m, lang)}
        </span>
      ))}
    </span>
  )
}

interface WordsProps {
  moves: readonly Move[]
  /** Index úderu, který hlas právě říká; −1 = žádný (vše bíle). */
  current: number
  /** Jazyk hlasu — slova jsou přepis hlášky (DOKUMENTACE.md 9.2). */
  lang: VoiceLang
  small?: boolean
}

/** Sekvence slovy: odehrané průhledné, aktuální v bílé pilulce, další bílé. */
export function Words({ moves, current, lang, small }: WordsProps) {
  return (
    <span className={small ? 'words small' : 'words'} role="img" aria-label={speechText(moves, lang)}>
      {moves.map((m, i) => (
        <span key={i} className={current < 0 ? undefined : i < current ? 'done' : i === current ? 'now' : undefined}>
          {wordText(m, lang)}
        </span>
      ))}
    </span>
  )
}
