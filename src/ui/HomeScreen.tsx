import type { WorkoutConfig } from '../engine/timeline'
import { t } from '../i18n'
import { RoundBar } from './bars'
import { IconButton } from './controls'
import { todayMeta, workoutMinutes } from './format'
import { IconArrow, IconPlay, IconSliders } from './icons'
import { useThemeColor } from './useThemeColor'

export type Screen = 'home' | 'komba' | 'vlastni' | 'treninky' | 'nastaveni' | 'plan'

interface Props {
  config: WorkoutConfig
  workoutName: string
  /** Nadpis karty: „Dnešní trénink", u plánu „Plán · trénink 5 z 12" (9.1). */
  cardLabel: string
  poolSize: number
  /** Postup plánu „5/12", bez plánu „—". */
  planCount: string
  counts: { combos: number; custom: number; presets: number }
  onStart: () => void
  onNavigate: (s: Screen) => void
}

/** Domů (DOKUMENTACE.md 9.1, Main.html). */
export function HomeScreen({ config, workoutName, cardLabel, poolSize, planCount, counts, onStart, onNavigate }: Props) {
  useThemeColor('--paper')
  const s = t().home
  const menu: { screen: Screen; label: string; count: number | string }[] = [
    { screen: 'plan', label: s.plan, count: planCount },
    { screen: 'komba', label: s.combos, count: counts.combos },
    { screen: 'vlastni', label: s.customCombos, count: counts.custom },
    { screen: 'treninky', label: s.presets, count: counts.presets },
  ]
  const [w1, w2, w3, w4] = s.title

  return (
    <div className="screen">
      <i className="screen-edge" aria-hidden="true" />
      <header className="top-bar">
        <span className="logo">DIREKT</span>
        <IconButton label={s.settings} onClick={() => onNavigate('nastaveni')}>
          <IconSliders />
        </IconButton>
      </header>

      <div className="home-body">
        <h1 className="home-title">
          <span>{w1}</span>
          <span>{w2}</span>
          <span className="accent">{w3}</span>
          <span className="accent">{w4}</span>
        </h1>

        <div className="home-spacer" />

        {/* Přímo v onClick: iOS pustí zvuk jen z gesta (R1). */}
        <button
          type="button"
          className="today"
          disabled={poolSize === 0}
          aria-label={s.startAria(workoutName)}
          onClick={onStart}
        >
          <span className="today-top">
            <span>{cardLabel}</span>
            <span>{workoutMinutes(config)} min</span>
          </span>
          <span className="today-name">
            <span className="display-s">{workoutName}</span>
            <span>{todayMeta(config)}</span>
          </span>
          <RoundBar config={config} work="var(--white)" rest="var(--white-a30)" />
          <span className="today-go">
            <span className="display-s">{s.go}</span>
            <span className="today-play">
              <IconPlay />
            </span>
          </span>
        </button>
        {poolSize === 0 && <p className="home-warn">{s.poolEmpty}</p>}

        <nav className="menu" aria-label={s.menu}>
          {menu.map((m) => (
            <button key={m.screen} type="button" className="menu-row" onClick={() => onNavigate(m.screen)}>
              <span>{m.label}</span>
              <span className="count">{m.count}</span>
              <IconArrow />
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
