import { useState } from 'react'
import { LEVELS, sameMoves, type Combo, type Level } from '../data/combos'
import {
  DEFENSE_ABBR,
  DEFENSE_LABEL,
  DEFENSES,
  PUNCHES,
  PUNCH_NAME,
  isBody,
  isDefense,
  punchOf,
  type BodyPunch,
  type Move,
} from '../data/moves'
import { getLang, t } from '../i18n'
import { MAX_MOVES, MAX_NAME, newId } from '../store/storage'
import { IconButton, Segmented, Sheet } from './controls'
import { IconClose } from './icons'
import { PunchSequence } from './punch'

interface Props {
  existing: readonly Combo[]
  defaultName: string
  onSave: (c: Combo) => void
  onCancel: () => void
}

/** Editor komba (DOKUMENTACE.md 9.4) ve stylu předloh. */
export function ComboBuilder({ existing, defaultName, onSave, onCancel }: Props) {
  const s = t().builder
  const lang = getLang()
  const [name, setName] = useState('')
  const [moves, setMoves] = useState<Move[]>([])
  const [level, setLevel] = useState<Level>(0)
  const [error, setError] = useState<string | null>(null)
  const last = moves.at(-1)
  const lastPunch = last && !isDefense(last) ? punchOf(last) : null
  const full = moves.length >= MAX_MOVES

  const update = (next: Move[]) => {
    setMoves(next)
    setError(null)
  }

  /** „T" přepne poslední úder mezi hlavou a tělem. */
  const toggleBody = () => {
    if (!last || !lastPunch) return
    update([...moves.slice(0, -1), isBody(last) ? lastPunch : (`${lastPunch}t` as BodyPunch)])
  }

  const save = () => {
    if (existing.some((c) => c.level === level && sameMoves(c.moves, moves))) {
      setError(s.duplicate)
      return
    }
    onSave({ id: newId('c'), level, moves, custom: true, name: name.trim() || defaultName })
  }

  return (
    <Sheet label={s.title} onClose={onCancel}>
      <div className="sheet-head">
        <h2 className="display-s">{s.title}</h2>
        <IconButton label={t().close} onClick={onCancel}>
          <IconClose />
        </IconButton>
      </div>

      <input
        className="text-input"
        name="comboName"
        value={name}
        maxLength={MAX_NAME}
        enterKeyHint="done"
        placeholder={defaultName}
        aria-label={s.nameAria}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="preview">
        {moves.length > 0 ? <PunchSequence moves={moves} size="m" /> : s.hint}
      </div>

      <div className="keys">
        {PUNCHES.map((p) => (
          <button key={p} type="button" className="num" aria-label={PUNCH_NAME[lang][p]} disabled={full} onClick={() => update([...moves, p])}>
            {p}
          </button>
        ))}
        {DEFENSES.map((d) => (
          <button key={d} type="button" className="mod" aria-label={DEFENSE_LABEL[lang][d]} disabled={full} onClick={() => update([...moves, d])}>
            {DEFENSE_ABBR[lang][d]}
            <small>{DEFENSE_LABEL[lang][d].toLowerCase()}</small>
          </button>
        ))}
        <button
          type="button"
          className="mod wide3"
          aria-label={s.bodyAria}
          aria-pressed={!!last && isBody(last)}
          disabled={!lastPunch}
          onClick={toggleBody}
        >
          {s.body}
        </button>
        <button type="button" className="fill wide3" aria-label={s.deleteLast} disabled={moves.length === 0} onClick={() => update(moves.slice(0, -1))}>
          ⌫
        </button>
      </div>

      <Segmented
        label={t().levelCaption}
        value={level}
        options={LEVELS.map((l) => ({ value: l, label: t().level[l] }))}
        onChange={setLevel}
      />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button type="button" className="primary-btn" disabled={moves.length === 0} onClick={save}>
        {s.save}
      </button>
    </Sheet>
  )
}
