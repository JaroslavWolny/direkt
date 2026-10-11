import { useState } from 'react'
import { buildPlan, PLAN_WEEKS, type Weekday } from '../engine/plan'
import { t } from '../i18n'
import type { Plan } from '../store/storage'
import { RoundBar } from './bars'
import { ConfirmDialog, IconButton } from './controls'
import { sessionLabel, sessionMeta, workoutMinutes, workoutSec } from './format'
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
  const s = t().plan
  const goalName = t().goal
  const [asking, setAsking] = useState(false)
  const sessions = buildPlan(plan.answers)
  const next = plan.done < sessions.length ? sessions[plan.done] : null
  const week = next?.week ?? PLAN_WEEKS
  const inWeek = sessions.map((s, index) => ({ ...s, index })).filter((s) => s.week === week)
  const weekMin = Math.round(inWeek.reduce((sum, s) => sum + workoutSec(s.config), 0) / 60)

  const dayState = (d: Weekday): 'next' | 'train' | 'done' | 'rest' => {
    const x = inWeek.find((y) => y.weekday === d)
    if (!x) return 'rest'
    return x.index === plan.done ? 'next' : x.index < plan.done ? 'done' : 'train'
  }

  return (
    <div className="screen">
      <i className="screen-edge" aria-hidden="true" />
      <div className="scroll">
        <header className="top-bar">
          <IconButton label={t().back} onClick={onBack}>
            <IconBack />
          </IconButton>
          <button type="button" className="pill-btn" onClick={onEdit}>
            {s.edit}
          </button>
        </header>
        <h1 className="display plan-title">{s.title}</h1>
        <p className="plan-summary">{s.summary(plan.answers)}</p>

        <section className="plan-week" aria-label={s.weekAria(week)}>
          <div className="plan-week-head">
            <span>{s.week(week, PLAN_WEEKS)}</span>
            <span className="muted">{s.weekTotal(weekMin)}</span>
          </div>
          <div className="plan-days">
            {s.dayShort.map((label, d) => {
              const state = dayState(d as Weekday)
              return (
                <span key={label} className={`plan-day ${state}`} aria-label={`${s.dayName[d]}, ${s.dayState[state]}`}>
                  {label}
                </span>
              )
            })}
          </div>
        </section>

        {next ? (
          <button type="button" className="plan-card" aria-label={t().home.startAria(goalName[next.goal])} onClick={onStart}>
            <span className="plan-card-top">
              <span>{sessionLabel(next.weekday)}</span>
              <span>{workoutMinutes(next.config)} min</span>
            </span>
            <span className="display-s plan-card-name">{goalName[next.goal]}</span>
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
            <p>{s.complete}</p>
            <button type="button" className="primary-btn" onClick={onEdit}>
              {s.newPlan}
            </button>
          </div>
        )}

        <div className="plan-list">
          {inWeek
            .filter((x) => x.index > plan.done)
            .map((x) => (
              <div key={x.index} className="plan-item">
                <span className="plan-item-day">{s.dayShort[x.weekday]}</span>
                <span className="row-text">
                  <strong>{goalName[x.goal]}</strong>
                  <span>{sessionMeta(x.config)}</span>
                </span>
                <span className="plan-item-min">{workoutMinutes(x.config)} min</span>
              </div>
            ))}
        </div>

        {/* Navíc oproti předloze (9.7): odchod bez tréninku / ukončení plánu. */}
        {mode === 'onboarding' ? (
          <button type="button" className="plan-link" onClick={onHome}>
            {t().homeLink}
          </button>
        ) : (
          <button type="button" className="plan-link" onClick={() => setAsking(true)}>
            {s.end}
          </button>
        )}
      </div>

      {asking && (
        <ConfirmDialog
          title={s.endTitle}
          text={s.endText}
          confirm={s.endConfirm}
          cancel={t().back}
          onConfirm={onEnd}
          onCancel={() => setAsking(false)}
        />
      )}
    </div>
  )
}
