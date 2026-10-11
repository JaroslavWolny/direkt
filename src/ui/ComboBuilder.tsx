import { useState } from 'react'
import { LEVEL_LABEL, LEVELS, sameMoves, type Combo, type Level } from '../data/combos'
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

const LEVEL_OPTIONS = LEVELS.map((l) => ({ value: l, label: LEVEL_LABEL[l] }))

/** Editor komba (DOKUMENTACE.md 9.4) ve stylu předloh. */
export function ComboBuilder({ existing, defaultName, onSave, onCancel }: Props) {
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
      setError('Tohle kombo už máš.')
      return
    }
    onSave({ id: newId('c'), level, moves, custom: true, name: name.trim() || defaultName })
  }

  return (
    <Sheet label="Nové kombo" onClose={onCancel}>
      <div className="sheet-head">
        <h2 className="display-s">Nové kombo</h2>
        <IconButton label="Zavřít" onClick={onCancel}>
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
        aria-label="Název komba"
        onChange={(e) => setName(e.target.value)}
      />

      <div className="preview">
        {moves.length > 0 ? <PunchSequence moves={moves} size="m" /> : 'Ťukej údery a obranu'}
      </div>

      <div className="keys">
        {PUNCHES.map((p) => (
          <button key={p} type="button" className="num" aria-label={PUNCH_NAME[p]} disabled={full} onClick={() => update([...moves, p])}>
            {p}
          </button>
        ))}
        {DEFENSES.map((d) => (
          <button key={d} type="button" className="mod" aria-label={DEFENSE_LABEL[d]} disabled={full} onClick={() => update([...moves, d])}>
            {DEFENSE_ABBR[d]}
            <small>{DEFENSE_LABEL[d].toLowerCase()}</small>
          </button>
        ))}
        <button
          type="button"
          className="mod wide3"
          aria-label="Poslední úder na tělo"
          aria-pressed={!!last && isBody(last)}
          disabled={!lastPunch}
          onClick={toggleBody}
        >
          T · na tělo
        </button>
        <button type="button" className="fill wide3" aria-label="Smazat poslední" disabled={moves.length === 0} onClick={() => update(moves.slice(0, -1))}>
          ⌫
        </button>
      </div>

      <Segmented label="Úroveň" value={level} options={LEVEL_OPTIONS} onChange={setLevel} />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button type="button" className="primary-btn" disabled={moves.length === 0} onClick={save}>
        Uložit kombo
      </button>
    </Sheet>
  )
}
