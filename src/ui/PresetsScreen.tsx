import { useState } from 'react'
import type { Combo } from '../data/combos'
import type { VoiceId } from '../data/voices'
import type { WorkoutConfig } from '../engine/timeline'
import type { Pace } from '../engine/timing'
import { t } from '../i18n'
import { newId, type Preset } from '../store/storage'
import { RoundBar } from './bars'
import { IconButton, SwipeRow } from './controls'
import { presetMeta, presetName, workoutMinutes } from './format'
import { IconBack, IconPlus } from './icons'
import { PresetDetail } from './PresetDetail'
import { useThemeColor } from './useThemeColor'
import { WorkoutForm } from './WorkoutForm'

interface Props {
  presets: Preset[]
  onPresets: (p: Preset[]) => void
  config: WorkoutConfig
  /** Kombinace, ze kterých se v tréninku losuje (detail, 9.5). */
  poolFor: (c: WorkoutConfig) => readonly Combo[]
  voice: VoiceId
  pace: Pace
  /** Spustí trénink z karty Začít v detailu; volat přímo z gesta. */
  onStart: (p: Preset) => void
  onBack: () => void
}

/** Uložené tréninky (DOKUMENTACE.md 9.5, Treninky.html). */
export function PresetsScreen({ presets, onPresets, config, poolFor, voice, pace, onStart, onBack }: Props) {
  useThemeColor('--paper')
  const s = t().presets
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const open = presets.find((p) => p.id === openId)

  if (open) {
    return (
      <PresetDetail
        preset={open}
        pool={poolFor(open.config)}
        voice={voice}
        pace={pace}
        onStart={() => onStart(open)}
        onBack={() => setOpenId(null)}
      />
    )
  }

  return (
    <div className="screen">
      <i className="screen-edge" aria-hidden="true" />
      <header className="top-bar">
        <IconButton label={t().back} onClick={onBack}>
          <IconBack />
        </IconButton>
        <IconButton label={s.new} onClick={() => setCreating(true)}>
          <IconPlus />
        </IconButton>
      </header>

      <div className="page-title">
        <h1 className="display">{s.title}</h1>
        <span className="count">{presets.length}</span>
      </div>

      <div className="list-scroll">
        {presets.length === 0 ? (
          <div className="empty">
            <strong>{s.emptyTitle}</strong>
            <span>{s.emptyText}</span>
          </div>
        ) : (
          presets.map((p) => (
            <SwipeRow
              key={p.id}
              label={presetName(p)}
              onOpen={() => setOpenId(p.id)}
              onDelete={() => onPresets(presets.filter((x) => x.id !== p.id))}
            >
              <span className="workout-row">
                <span className="row-body">
                  <span className="name">{presetName(p)}</span>
                  <span className="meta">{presetMeta(p.config)}</span>
                  <RoundBar
                    config={p.config}
                    work={p.config.level === 2 ? 'var(--accent)' : 'var(--ink)'}
                    rest="var(--hairline)"
                    tight
                  />
                </span>
                <span className="total">
                  <span className="display-s">{workoutMinutes(p.config)}</span>
                  <span>min</span>
                </span>
              </span>
            </SwipeRow>
          ))
        )}
      </div>

      {creating && (
        <WorkoutForm
          initial={config}
          onSave={(name, cfg) => {
            onPresets([...presets, { id: newId('t'), name, config: cfg }])
            setCreating(false)
          }}
          onClose={() => setCreating(false)}
        />
      )}
    </div>
  )
}
