// Jazyk rozhraní (DOKUMENTACE.md 9.8). Texty v cs.ts a en.ts, slova úderů v data/moves.ts.
import { cs, type Strings } from './cs'
import { en } from './en'

export type Lang = 'cs' | 'en'
export const LANGS: readonly Lang[] = ['cs', 'en']
/** Jméno jazyka v něm samém (přepínač). */
export const LANG_NAME: Record<Lang, string> = { cs: 'Čeština', en: 'English' }

export const isLang = (x: unknown): x is Lang => x === 'cs' || x === 'en'

const STRINGS: Record<Lang, Strings> = { cs, en }
let current: Lang = 'cs'

/** Volá App při každém vykreslení, takže obrazovky pod ní už čtou nový jazyk. */
export const setLang = (lang: Lang): void => {
  current = lang
}
export const getLang = (): Lang => current
/** Texty v aktuálním jazyce. */
export const t = (): Strings => STRINGS[current]

/**
 * Jazyk zařízení pro první spuštění: cs a sk → čeština, jinak angličtina.
 * iOS appka na ploše ho občas hlásí špatně → přepínač na úvodu a v Nastavení (9.8).
 */
export function detectLang(): Lang {
  const first = typeof navigator === 'undefined' ? '' : (navigator.languages?.[0] ?? navigator.language ?? '')
  return /^(cs|sk)\b/i.test(first) ? 'cs' : 'en'
}
