import { useEffect, useState, type CSSProperties } from 'react'
import { useThemeColor } from './useThemeColor'

export type IntroVariant = 'a' | 'b' | 'c'

/** Kdy je animace u konce (časy v CSS, DOKUMENTACE.md 10.1). */
const END_MS: Record<IntroVariant, number> = { a: 1900, b: 2050, c: 1850 }
/** B: papír vyjede nahoru a plocha je kobaltová — stavová lišta se přebarví s ní. */
const FLIP_MS = 1050

const reducedMotion = (): boolean =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

const delay = (i: number) => ({ '--i': i }) as CSSProperties

/** Pohyblivá část — jen do konce animace. */
function Stage({ variant }: { variant: IntroVariant }) {
  if (variant === 'c') {
    return (
      <span className="intro-stage intro-words" aria-hidden="true">
        {['Jab', 'Cross', 'Hák'].map((w, i) => (
          <span key={w} className="intro-word" style={delay(i)}>
            {w}
            <i>{w}</i>
          </span>
        ))}
      </span>
    )
  }
  const nums = variant === 'a' ? ['1', '2', '3'] : ['3', '2', '1']
  return (
    <span className="intro-stage" aria-hidden="true">
      {nums.map((n, i) => (
        <span key={n} className="intro-num" style={delay(i)}>
          {n}
        </span>
      ))}
    </span>
  )
}

interface Props {
  variant: IntroVariant
  onPlan: () => void
  onSkip: () => void
}

/** Úvod při prvním spuštění (DOKUMENTACE.md 9.0); ťuk během animace skočí na konec. */
export function IntroScreen({ variant, onPlan, onSkip }: Props) {
  const [ended, setEnded] = useState(reducedMotion)
  const [flipped, setFlipped] = useState(() => variant !== 'b' || reducedMotion())
  useThemeColor(flipped ? '--accent' : '--paper')

  useEffect(() => {
    if (ended) return
    const t = setTimeout(() => setEnded(true), END_MS[variant])
    return () => clearTimeout(t)
  }, [ended, variant])
  useEffect(() => {
    if (flipped) return
    const t = setTimeout(() => setFlipped(true), FLIP_MS)
    return () => clearTimeout(t)
  }, [flipped])

  const skip = () => {
    setEnded(true)
    setFlipped(true)
  }

  return (
    <div
      className={`screen on-accent intro intro-${variant}${ended ? ' ended' : ''}`}
      onClick={ended ? undefined : skip}
    >
      {variant === 'b' && !ended && <span className="intro-paper" aria-hidden="true" />}
      <div className="intro-mid">
        {!ended && <Stage variant={variant} />}
        <span className="intro-logo">DIREKT</span>
        <span className="intro-tag">Žádné řeči. Jen údery.</span>
      </div>
      <div className="intro-actions">
        <button type="button" className="primary-btn white" onClick={onPlan}>
          Sestavit plán
        </button>
        <button type="button" className="pill-btn big on-accent" onClick={onSkip}>
          Bez plánu
        </button>
      </div>
    </div>
  )
}
