import { Fragment, useState, type ReactNode } from 'react'
import { EXPERIENCES, GOALS, MINUTES, PER_WEEK, type Experience, type Goal, type Minutes, type PerWeek, type PlanAnswers } from '../engine/plan'
import { t } from '../i18n'
import { RoundProgress } from './bars'
import { IconButton } from './controls'
import { IconBack } from './icons'
import { useThemeColor } from './useThemeColor'

const STEPS = 3

/** Nadpis po řádcích (zalomení jako v předlohách). */
const lines = (xs: readonly string[]): ReactNode =>
  xs.map((x, i) => (
    <Fragment key={x}>
      {i > 0 && <br />}
      {x}
    </Fragment>
  ))

function Check({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5 9-10" />
    </svg>
  )
}

interface Props {
  /** Minulé odpovědi (Upravit odpovědi, návrat z plánu). */
  initial?: PlanAnswers
  /** 0–2; návrat z plánu otevře poslední otázku. */
  initialStep?: number
  onDone: (answers: PlanAnswers) => void
  /** Zpět z první otázky. */
  onClose: () => void
}

/** Dotazník (DOKUMENTACE.md 9.0, Otazka1–3.html): Pokračovat až po výběru. */
export function QuizScreen({ initial, initialStep = 0, onDone, onClose }: Props) {
  useThemeColor('--paper')
  const s = t().quiz
  const [step, setStep] = useState(initialStep)
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd')
  const [experience, setExperience] = useState<Experience | null>(initial?.experience ?? null)
  const [goals, setGoals] = useState<Goal[]>(initial?.goals ?? [])
  const [perWeek, setPerWeek] = useState<PerWeek | null>(initial?.perWeek ?? null)
  const [minutes, setMinutes] = useState<Minutes | null>(initial?.minutes ?? null)

  const go = (to: number) => {
    setDir(to > step ? 'fwd' : 'back')
    setStep(to)
  }
  const toggleGoal = (g: Goal) => setGoals((gs) => (gs.includes(g) ? gs.filter((x) => x !== g) : [...gs, g]))

  let title: ReactNode
  let note: string | null = null
  let body: ReactNode
  let next: { label: string; ready: boolean; onClick: () => void }

  if (step === 0) {
    title = lines(s.q1)
    note = s.q1Note
    body = (
      <div className="quiz-list" role="radiogroup" aria-label={s.experienceAria}>
        {EXPERIENCES.map((e) => (
          <button
            key={e}
            type="button"
            role="radio"
            aria-checked={experience === e}
            className="quiz-choice"
            onClick={() => setExperience(e)}
          >
            {s.experience[e]}
            <span className="quiz-tick" aria-hidden="true">
              {experience === e && <Check size={14} />}
            </span>
          </button>
        ))}
      </div>
    )
    next = { label: s.next, ready: experience !== null, onClick: () => go(1) }
  } else if (step === 1) {
    title = lines(s.q2)
    note = s.q2Note
    body = (
      <div className="quiz-grid" role="group" aria-label={s.goalsAria}>
        {GOALS.map((g) => (
          <button key={g} type="button" aria-pressed={goals.includes(g)} className="quiz-tile" onClick={() => toggleGoal(g)}>
            {s.goalTile[g]}
            {goals.includes(g) && <Check size={18} />}
          </button>
        ))}
      </div>
    )
    next = { label: s.next, ready: goals.length > 0, onClick: () => go(2) }
  } else {
    title = lines(s.q3)
    const total = perWeek !== null && minutes !== null ? s.total(perWeek * minutes) : null
    body = (
      <>
        <section className="quiz-section">
          <h2 className="caption">{s.perWeek}</h2>
          <div className="quiz-freq" role="radiogroup" aria-label={s.perWeek}>
            {PER_WEEK.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={perWeek === n}
                aria-label={s.perWeekAria(n)}
                onClick={() => setPerWeek(n)}
              >
                {n}×
              </button>
            ))}
          </div>
        </section>
        <section className="quiz-section">
          <h2 className="caption">{s.length}</h2>
          <div className="quiz-len" role="radiogroup" aria-label={s.lengthAria}>
            {MINUTES.map((m) => (
              <button key={m} type="button" role="radio" aria-checked={minutes === m} onClick={() => setMinutes(m)}>
                <span>{m}</span>
                <span>min</span>
              </button>
            ))}
          </div>
        </section>
        {total && (
          <p className="quiz-total">
            {total[0]}
            <strong>{total[1]}</strong>
            {total[2]}
          </p>
        )}
      </>
    )
    const ready = experience !== null && goals.length > 0 && perWeek !== null && minutes !== null
    next = {
      label: s.build,
      ready,
      onClick: () => {
        if (experience !== null && perWeek !== null && minutes !== null) {
          onDone({ experience, goals: GOALS.filter((g) => goals.includes(g)), perWeek, minutes })
        }
      },
    }
  }

  return (
    <div className="screen">
      <i className="screen-edge" aria-hidden="true" />
      <header className="top-bar">
        <IconButton label={t().back} onClick={() => (step === 0 ? onClose() : go(step - 1))}>
          <IconBack />
        </IconButton>
        <span className="top-bar-title">{s.step(step + 1, STEPS)}</span>
        <span className="spacer-44" aria-hidden="true" />
      </header>
      <div className="quiz-progress">
        <RoundProgress rounds={STEPS} done={step + 1} track="var(--hairline)" fill="var(--ink)" />
      </div>
      <div key={step} className={`quiz-step ${dir}`}>
        <h1 className="quiz-title">{title}</h1>
        {note && <p className="quiz-note">{note}</p>}
        <div className="quiz-body">{body}</div>
        <div className="grow" />
        <button type="button" className="primary-btn" disabled={!next.ready} onClick={next.onClick}>
          {next.label}
        </button>
      </div>
    </div>
  )
}
