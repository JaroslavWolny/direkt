import { useState } from 'react'
import type { WorkoutConfig } from '../engine/timeline'
import { newId, type Preset } from '../store/storage'
import { RoundBar } from './bars'
import { IconButton, SwipeRow } from './controls'
import { plural, presetMeta, workoutMinutes } from './format'
import { IconBack, IconPlus } from './icons'
import { useThemeColor } from './useThemeColor'
import { WorkoutForm } from './WorkoutForm'

interface Props {
  presets: Preset[]
  onPresets: (p: Preset[]) => void
  config: WorkoutConfig
  /** Ťuk na trénink ho rovnou spustí (Treninky.html → Odpočet); volat přímo z gesta. */
  onStart: (p: Preset) => void
  onBack: () => void
}

/** Uložené tréninky (DOKUMENTACE.md 9.5, Treninky.html). */
export function PresetsScreen({ presets, onPresets, config, onStart, onBack }: Props) {
  useThemeColor('--paper')
  const [creating, setCreating] = useState(false)

  return (
    <div className="screen">
      <i className="screen-edge" aria-hidden="true" />
      <header className="top-bar">
        <IconButton label="Zpět" onClick={onBack}>
          <IconBack />
        </IconButton>
        <span className="top-bar-note">
          {presets.length} {plural(presets.length, 'uložený', 'uložené', 'uložených')}
        </span>
      </header>

      <h1 className="display title-1">Tréninky</h1>

      <div className="list-scroll">
        {presets.length === 0 ? (
          <div className="empty">
            <strong>Zatím žádný trénink.</strong>
            <span>Ulož si první.</span>
          </div>
        ) : (
          presets.map((p) => (
            <SwipeRow
              key={p.id}
              label={p.name}
              onOpen={() => onStart(p)}
              onDelete={() => onPresets(presets.filter((x) => x.id !== p.id))}
            >
              <span className="workout-row">
                <span className="row-body">
                  <span className="name">{p.name}</span>
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

      <button type="button" className="primary-btn" onClick={() => setCreating(true)}>
        <IconPlus />
        Nový trénink
      </button>

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
