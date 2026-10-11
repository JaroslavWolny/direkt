import { useEffect, useState, type CSSProperties } from 'react'
import { LANG_NAME, t, type Lang } from '../i18n'
import { BagMark, Wordmark } from './brand'
import { IconArrow } from './icons'
import { useThemeColor } from './useThemeColor'

/** Kdy je animace u konce (časy v CSS, DOKUMENTACE.md 10.1). */
const END_MS = 1850

const reducedMotion = (): boolean =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

const order = (i: number) => ({ '--i': i }) as CSSProperties

interface Props {
  /** Návrat z dotazníku: rovnou konečný stav, 1-2-3 se neopakuje. */
  animate: boolean
  /** Volat v gestu — zazní gong (iOS pustí zvuk jen z ťuknutí). */
  onPlan: () => void
  onSkip: () => void
  /** Přepínač jazyka pod Přeskočit (9.0, 9.8). */
  lang: Lang
  onLang: (lang: Lang) => void
}

/** Úvod (DOKUMENTACE.md 9.0, Uvod.html): 1-2-3, pak se složí obrazovka. Ťuk = skok na konec. */
export function IntroScreen({ animate, onPlan, onSkip, lang, onLang }: Props) {
  useThemeColor('--accent')
  const s = t().intro
  const other: Lang = lang === 'cs' ? 'en' : 'cs'
  const [ended, setEnded] = useState(() => !animate || reducedMotion())

  useEffect(() => {
    if (ended) return
    const t = setTimeout(() => setEnded(true), END_MS)
    return () => clearTimeout(t)
  }, [ended])

  return (
    <div className={ended ? 'screen on-accent intro ended' : 'screen on-accent intro'} onClick={ended ? undefined : () => setEnded(true)}>
      <i className="screen-edge" aria-hidden="true" />
      {!ended && (
        <span className="intro-stage" aria-hidden="true">
          {['1', '2', '3'].map((n, i) => (
            <span key={n} className="intro-num" style={order(i)}>
              {n}
            </span>
          ))}
        </span>
      )}
      <BagMark className="intro-bag" />
      <Wordmark className="intro-wordmark" />
      <div className="grow" />
      <div className="intro-copy">
        <h1 className="intro-title">
          {s.title.map((w, i) => (
            <span key={w} style={order(i)}>
              {w}
            </span>
          ))}
        </h1>
        <p className="intro-text">{s.text}</p>
      </div>
      <div className="intro-actions">
        <button type="button" className="intro-cta" onClick={onPlan}>
          {s.cta}
          <IconArrow size={22} />
        </button>
        <button type="button" className="intro-skip" onClick={onSkip}>
          {s.skip}
        </button>
        <button type="button" className="intro-lang" lang={other} onClick={() => onLang(other)}>
          {LANG_NAME[other]}
        </button>
      </div>
    </div>
  )
}
