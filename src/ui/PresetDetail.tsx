import type { Combo } from '../data/combos'
import { comboTitle } from '../data/moves'
import type { VoiceId } from '../data/voices'
import type { Pace } from '../engine/timing'
import { getLang, t } from '../i18n'
import type { Preset } from '../store/storage'
import { RoundBar } from './bars'
import { IconButton } from './controls'
import { comboSec, formatSec, presetName, sessionMeta, workoutMinutes } from './format'
import { IconBack, IconPlay } from './icons'
import { PunchSequence } from './punch'
import { useThemeColor } from './useThemeColor'

interface Props {
  preset: Preset
  /** Kombinace, ze kterých se v tréninku losuje (7.1). */
  pool: readonly Combo[]
  voice: VoiceId
  pace: Pace
  /** Volat přímo z gesta (R1). */
  onStart: () => void
  onBack: () => void
}

/** Detail uloženého tréninku (DOKUMENTACE.md 9.5): karta Začít a jeho kombinace. */
export function PresetDetail({ preset, pool, voice, pace, onStart, onBack }: Props) {
  useThemeColor('--paper')
  const s = t().presets
  const name = presetName(preset)
  const { config } = preset

  return (
    <div className="screen">
      <i className="screen-edge" aria-hidden="true" />
      <div className="scroll">
        <header className="top-bar">
          <IconButton label={t().back} onClick={onBack}>
            <IconBack />
          </IconButton>
        </header>
        <h1 className="display plan-title">{name}</h1>

        <button
          type="button"
          className="plan-card"
          aria-label={t().home.startAria(name)}
          disabled={pool.length === 0}
          onClick={onStart}
        >
          <span className="plan-card-top">
            <span>{sessionMeta(config)}</span>
            <span>{workoutMinutes(config)} min</span>
          </span>
          <span className="display-s plan-card-name">{s.start}</span>
          <RoundBar config={config} work="var(--white)" rest="var(--white-a30)" />
          <span className="plan-card-bottom">
            <span>
              {t().level[config.level]} · {s.tempo(t().intensity[config.intensity])}
            </span>
            <span className="plan-card-play">
              <IconPlay size={18} />
            </span>
          </span>
        </button>
        {pool.length === 0 && <p className="home-warn">{t().home.poolEmpty}</p>}

        <div className="preset-combos-head">
          <span>{t().combos.title}</span>
          <span className="muted">{pool.length}</span>
        </div>
        {pool.map((c) => (
          <div key={c.id} className="list-row">
            <span className="combo-row">
              <span className="row-body">
                <span className="name">{c.name ?? comboTitle(c.moves, getLang())}</span>
                <PunchSequence moves={c.moves} />
              </span>
              <span className="side">
                <span>{formatSec(comboSec(c.moves, voice, pace))}</span>
                <span>{t().level[c.level]}</span>
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
