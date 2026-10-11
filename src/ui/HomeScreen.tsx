import type { WorkoutConfig } from '../engine/timeline'
import { RoundBar } from './bars'
import { IconButton } from './controls'
import { todayMeta, workoutMinutes } from './format'
import { IconArrow, IconPlay, IconSliders } from './icons'
import { useThemeColor } from './useThemeColor'

export type Screen = 'home' | 'komba' | 'vlastni' | 'treninky' | 'nastaveni'

interface Props {
  config: WorkoutConfig
  workoutName: string
  poolSize: number
  counts: { combos: number; custom: number; presets: number }
  onStart: () => void
  onNavigate: (s: Screen) => void
}

/** Domů (DOKUMENTACE.md 9.1, Main.html). */
export function HomeScreen({ config, workoutName, poolSize, counts, onStart, onNavigate }: Props) {
  useThemeColor('--paper')
  const menu: { screen: Screen; label: string; count: number }[] = [
    { screen: 'komba', label: 'Komba', count: counts.combos },
    { screen: 'vlastni', label: 'Vlastní komba', count: counts.custom },
    { screen: 'treninky', label: 'Uložené tréninky', count: counts.presets },
  ]

  return (
    <div className="screen">
      <header className="top-bar">
        <span className="logo">DIREKT</span>
        <IconButton label="Nastavení" onClick={() => onNavigate('nastaveni')}>
          <IconSliders />
        </IconButton>
      </header>

      <div className="home-body">
        <h1 className="home-title">
          <span>Žádné</span>
          <span>řeči.</span>
          <span className="accent">Jen</span>
          <span className="accent">údery.</span>
        </h1>

        <div className="home-spacer" />

        {/* Přímo v onClick: iOS pustí zvuk jen z gesta (R1). */}
        <button
          type="button"
          className="today"
          disabled={poolSize === 0}
          aria-label={`Začít dnešní trénink: ${workoutName}`}
          onClick={onStart}
        >
          <span className="today-top">
            <span>Dnešní trénink</span>
            <span>{workoutMinutes(config)} min</span>
          </span>
          <span className="today-name">
            <span className="display-s">{workoutName}</span>
            <span>{todayMeta(config)}</span>
          </span>
          <RoundBar config={config} work="var(--white)" rest="var(--white-a30)" />
          <span className="today-go">
            <span className="display-s">Začít</span>
            <span className="today-play">
              <IconPlay />
            </span>
          </span>
        </button>
        {poolSize === 0 && <p className="home-warn">Zapni aspoň jedno kombo pro tuhle úroveň.</p>}

        <nav className="menu" aria-label="Hlavní menu">
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
