import { useState } from 'react'
import { buildPlan, PLAN_WEEKS, type PlanSession } from '../engine/plan'
import type { Plan } from '../store/storage'
import { ConfirmDialog, IconButton } from './controls'
import { answersText, FOCUS_LABEL, sessionMeta } from './format'
import { IconBack, IconCheck } from './icons'
import { useThemeColor } from './useThemeColor'

interface WeekProps {
  week: number
  sessions: readonly PlanSession[]
  /** Index prvního tréninku týdne v celém plánu. */
  offset: number
  /** Kolik tréninků plánu je hotových; bez postupu (náhled v dotazníku) undefined. */
  done?: number
}

/** Týden plánu: řádky tréninků se stavem (DOKUMENTACE.md 9.7). */
export function PlanWeek({ week, sessions, offset, done }: WeekProps) {
  return (
    <section className="section">
      <h2 className="caption">Týden {week}</h2>
      <div className="group">
        {sessions.map((s, i) => {
          const index = offset + i
          const state = done === undefined ? null : index < done ? 'done' : index === done ? 'next' : null
          return (
            <div key={index} className={state === 'done' ? 'group-row tall plan-row done' : 'group-row tall plan-row'}>
              <span className="row-text">
                <strong>{FOCUS_LABEL[s.focus]}</strong>
                <span>{sessionMeta(s.config)}</span>
              </span>
              {state === 'done' && (
                <span className="plan-check" aria-label="Hotovo">
                  <IconCheck />
                </span>
              )}
              {state === 'next' && <span className="plan-next">Na řadě</span>}
            </div>
          )
        })}
      </div>
    </section>
  )
}

interface Props {
  plan: Plan
  onNew: () => void
  onEnd: () => void
  onBack: () => void
}

/** Plán (DOKUMENTACE.md 9.7): týdny, postup, nový plán, ukončení. */
export function PlanScreen({ plan, onNew, onEnd, onBack }: Props) {
  useThemeColor('--paper')
  const [asking, setAsking] = useState(false)
  const sessions = buildPlan(plan.answers)
  const perWeek = plan.answers.perWeek
  const complete = plan.done >= sessions.length

  return (
    <div className="screen">
      <div className="scroll">
        <header className="top-bar">
          <IconButton label="Zpět" onClick={onBack}>
            <IconBack />
          </IconButton>
          <span className="top-bar-note">
            {plan.done} z {sessions.length}
          </span>
        </header>
        <h1 className="display title-1">Plán</h1>
        <p className="plan-answers">{answersText(plan.answers)}</p>
        {complete && <p className="plan-complete">Plán splněný.</p>}

        {Array.from({ length: PLAN_WEEKS }, (_, w) => (
          <PlanWeek
            key={w}
            week={w + 1}
            sessions={sessions.slice(w * perWeek, (w + 1) * perWeek)}
            offset={w * perWeek}
            done={plan.done}
          />
        ))}

        <div className="plan-actions">
          <button type="button" className="pill-btn big ink grow" onClick={onNew}>
            Nový plán
          </button>
          <button type="button" className="pill-btn big grow" onClick={() => setAsking(true)}>
            Ukončit plán
          </button>
        </div>
      </div>

      {asking && (
        <ConfirmDialog
          title="Ukončit plán?"
          text="Postup se smaže."
          confirm="Ukončit"
          cancel="Zpět"
          onConfirm={onEnd}
          onCancel={() => setAsking(false)}
        />
      )}
    </div>
  )
}
