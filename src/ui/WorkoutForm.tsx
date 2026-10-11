import { useState, type FormEvent } from 'react'
import { LEVELS } from '../data/combos'
import { LIMITS } from '../engine/constants'
import type { WorkoutConfig } from '../engine/timeline'
import { t } from '../i18n'
import { IconButton, Segmented, Sheet, Stepper } from './controls'
import { formatSec } from './format'
import { IconClose } from './icons'

interface Props {
  initial: WorkoutConfig
  onSave: (name: string, config: WorkoutConfig) => void
  onClose: () => void
}

/** Nový trénink (DOKUMENTACE.md 9.5) — předvyplněný aktuálním nastavením. */
export function WorkoutForm({ initial, onSave, onClose }: Props) {
  const s = t().presets
  const [name, setName] = useState('')
  const [config, setConfig] = useState(initial)
  const set = <K extends keyof WorkoutConfig>(key: K, value: WorkoutConfig[K]) => setConfig({ ...config, [key]: value })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim()) onSave(name.trim(), config)
  }

  return (
    <Sheet label={s.new} onClose={onClose}>
      <form className="sheet-form" onSubmit={submit}>
        <div className="sheet-head">
          <h2 className="display-s">{s.new}</h2>
          <IconButton label={t().close} onClick={onClose}>
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
          placeholder={s.namePlaceholder}
          aria-label={s.nameAria}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="group">
          <Stepper label={t().roundCount} value={config.rounds} limit={LIMITS.rounds} format={String} onChange={(v) => set('rounds', v)} />
          <Stepper label={t().roundLength} value={config.roundSec} limit={LIMITS.roundSec} format={formatSec} onChange={(v) => set('roundSec', v)} />
          <Stepper label={t().restBetween} value={config.restSec} limit={LIMITS.restSec} format={formatSec} onChange={(v) => set('restSec', v)} />
        </div>
        <Segmented
          label={t().levelCaption}
          value={config.level}
          options={LEVELS.map((l) => ({ value: l, label: t().level[l] }))}
          onChange={(v) => set('level', v)}
        />
        <button type="submit" className="primary-btn" disabled={!name.trim()}>
          {s.save}
        </button>
      </form>
    </Sheet>
  )
}
