import { useState, type FormEvent } from 'react'
import { LEVEL_LABEL, LEVELS } from '../data/combos'
import { LIMITS } from '../engine/constants'
import type { WorkoutConfig } from '../engine/timeline'
import { IconButton, Segmented, Sheet, Stepper } from './controls'
import { formatSec } from './format'
import { IconClose } from './icons'

interface Props {
  initial: WorkoutConfig
  onSave: (name: string, config: WorkoutConfig) => void
  onClose: () => void
}

const LEVEL_OPTIONS = LEVELS.map((l) => ({ value: l, label: LEVEL_LABEL[l] }))

/** Nový trénink (DOKUMENTACE.md 9.5) — předvyplněný aktuálním nastavením. */
export function WorkoutForm({ initial, onSave, onClose }: Props) {
  const [name, setName] = useState('')
  const [config, setConfig] = useState(initial)
  const set = <K extends keyof WorkoutConfig>(key: K, value: WorkoutConfig[K]) => setConfig({ ...config, [key]: value })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim()) onSave(name.trim(), config)
  }

  return (
    <Sheet label="Nový trénink" onClose={onClose}>
      <form className="sheet-form" onSubmit={submit}>
        <div className="sheet-head">
          <h2 className="display-s">Nový trénink</h2>
          <IconButton label="Zavřít" onClick={onClose}>
            <IconClose />
          </IconButton>
        </div>
        <input
          className="text-input"
          name="workoutName"
          autoFocus
          value={name}
          maxLength={40}
          enterKeyHint="done"
          placeholder="Název, např. Ranní 6 × 3"
          aria-label="Název tréninku"
          onChange={(e) => setName(e.target.value)}
        />
        <div className="group">
          <Stepper label="Počet kol" value={config.rounds} limit={LIMITS.rounds} format={String} onChange={(v) => set('rounds', v)} />
          <Stepper label="Délka kola" value={config.roundSec} limit={LIMITS.roundSec} format={formatSec} onChange={(v) => set('roundSec', v)} />
          <Stepper label="Pauza mezi koly" value={config.restSec} limit={LIMITS.restSec} format={formatSec} onChange={(v) => set('restSec', v)} />
        </div>
        <Segmented label="Úroveň" value={config.level} options={LEVEL_OPTIONS} onChange={(v) => set('level', v)} />
        <button type="submit" className="primary-btn" disabled={!name.trim()}>
          Uložit trénink
        </button>
      </form>
    </Sheet>
  )
}
