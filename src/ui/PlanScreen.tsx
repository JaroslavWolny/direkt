import { useState } from 'react'
import { buildPlan, PLAN_WEEKS, type Weekday } from '../engine/plan'
import type { Plan } from '../store/storage'
import { RoundBar } from './bars'
import { ConfirmDialog, IconButton } from './controls'
import { DAY_NAME, DAY_SHORT, GOAL_NAME, planSummary, sessionLabel, sessionMeta, workoutMinutes, workoutSec } from './format'
import { IconBack, IconPlay } from './icons'
import { useThemeColor } from './useThemeColor'

interface Props {
  plan: Plan
  /** onboarding: zpět = otázka 3, dole Domů; menu: zpět = Domů, dole Ukončit plán. */
  mode: 'onboarding' | 'menu'
  /** Volat přímo z ťuknutí (START v gestu, R1). */
  onStart: () => void
  onEdit: () => void
  onBack: () => void
  onHome: () => void
  onEnd: () => void
}

/** Tvůj plán (DOKUMENTACE.md 9.7, Plan.html): týden na řadě, trénink na řadě, další v týdnu. */
export function PlanScreen({ plan, mode, onStart, onEdit, onBack, onHome, onEnd }: Props) {
  useThemeColor('--paper')
  const [asking, setAsking] = useState(false)
  const sessions = buildPlan(plan.answers)
  const next = plan.done < sessions.length ? sessions[plan.done] : null
  const week = next?.week ?? PLAN_WEEKS
  const inWeek = sessions.map((s, index) => ({ ...s, index })).filter((s) => s.week === week)
  const weekMin = Math.round(inWeek.reduce((sum, s) => sum + workoutSec(s.config), 0) / 60)

  const dayState = (d: Weekday): 'next' | 'train' | 'done' | 'rest' => {
    const s = inWeek.find((x) => x.weekday === d)
    if (!s) return 'rest'
    return s.index === plan.done ? 'next' : s.index < plan.done ? 'done' : 'train'
  }
  const DAY_ARIA = { next: 'trénink na řadě', train: 'trénink', done: 'hotovo', rest: 'volno' } as const

  return (
    <div className="screen">
      <i className="screen-edge" aria-hidden="true" />
      <div className="scroll">
        <header className="top-bar">
          <IconButton label="Zpět" onClick={onBack}>
            <IconBack />
          </IconButton>
          <button type="button" className="pill-btn" onClick={onEdit}>
            Upravit odpovědi
          </button>
        </header>
        <h1 className="display plan-title">Tvůj plán</h1>
        <p className="plan-summary">{planSummary(plan.answers)}</p>

        <section className="plan-week" aria-label={`Týden ${week}`}>
          <div className="plan-week-head">
            <span>
              Týden {week} ze {PLAN_WEEKS}
            </span>
            <span className="muted">{weekMin} min celkem</span>
          </div>
          <div className="plan-days">
            {DAY_SHORT.map((label, d) => {
              const state = dayState(d as Weekday)
              return (
                <span key={label} className={`plan-day ${state}`} aria-label={`${DAY_NAME[d]}, ${DAY_ARIA[state]}`}>
                  {label}
                </span>
              )
            })}
          </div>
        </section>

        {next ? (
          <button type="button" className="plan-card" aria-label={`Začít: ${GOAL_NAME[next.goal]}`} onClick={onStart}>
            <span className="plan-card-top">
              <span>{sessionLabel(next.weekday)}</span>
              <span>{workoutMinutes(next.config)} min</span>
            </span>
            <span className="display-s plan-card-name">{GOAL_NAME[next.goal]}</span>
            <RoundBar config={next.config} work="var(--white)" rest="var(--white-a30)" />
            <span className="plan-card-bottom">
              <span>{sessionMeta(next.config)}</span>
              <span className="plan-card-play">
                <IconPlay size={18} />
              </span>
            </span>
          </button>
        ) : (
          <div className="plan-complete">
            <p>Plán splněný.</p>
            <button type="button" className="primary-btn" onClick={onEdit}>
              Nový plán
            </button>
          </div>
        )}

        <div className="plan-list">
          {inWeek
            .filter((s) => s.index > plan.done)
            .map((s) => (
              <div key={s.index} className="plan-item">
                <span className="plan-item-day">{DAY_SHORT[s.weekday]}</span>
                <span className="row-text">
                  <strong>{GOAL_NAME[s.goal]}</strong>
                  <span>{sessionMeta(s.config)}</span>
                </span>
                <span className="plan-item-min">{workoutMinutes(s.config)} min</span>
              </div>
            ))}
        </div>

        {/* Navíc oproti předloze (9.7): odchod bez tréninku / ukončení plánu. */}
        {mode === 'onboarding' ? (
          <button type="button" className="plan-link" onClick={onHome}>
            Domů
          </button>
        ) : (
          <button type="button" className="plan-link" onClick={() => setAsking(true)}>
            Ukončit plán
          </button>
        )}
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
