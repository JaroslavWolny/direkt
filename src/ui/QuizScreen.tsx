import { useEffect, useRef, useState } from 'react'
import { buildPlan, type PlanAnswers } from '../engine/plan'
import { RoundProgress } from './bars'
import { IconButton } from './controls'
import { plural } from './format'
import { IconBack, IconClose } from './icons'
import { PlanWeek } from './PlanScreen'
import { useThemeColor } from './useThemeColor'

interface Question {
  key: keyof PlanAnswers
  title: string
  note?: string
  options: readonly { value: PlanAnswers[keyof PlanAnswers]; label: string; note?: string }[]
}

/** Každá otázka mění plán (DOKUMENTACE.md 7.11, texty 9.0). */
const QUESTIONS: readonly Question[] = [
  {
    key: 'experience',
    title: 'Jak dlouho boxuješ?',
    options: [
      { value: 0, label: 'Začínám', note: 'Učím se základy, kola po 2 minutách' },
      { value: 1, label: 'Trénuju', note: 'Pár měsíců a víc' },
      { value: 2, label: 'Závodím', note: 'Ring a sparingy' },
    ],
  },
  {
    key: 'goal',
    title: 'Co chceš hlavně zlepšit?',
    options: [
      { value: 'kondice', label: 'Kondice', note: 'Víc kol, kratší pauzy, tvrdší tempo' },
      { value: 'technika', label: 'Technika', note: 'Klidnější tempo, víc opakování komb' },
    ],
  },
  {
    key: 'perWeek',
    title: 'Kolikrát týdně?',
    options: [
      { value: 2, label: '2×' },
      { value: 3, label: '3×' },
      { value: 4, label: '4×' },
    ],
  },
  {
    key: 'minutes',
    title: 'Kolik času na trénink?',
    note: 'Bez rozcvičky',
    options: [
      { value: 15, label: '15 min' },
      { value: 25, label: '25 min' },
      { value: 40, label: '40 min' },
    ],
  },
]

/** Výběr je vidět, než naskočí další otázka. */
const PICK_MS = 180

interface Props {
  /** Minulé odpovědi (nový plán) — předvyplní volby. */
  initial?: PlanAnswers
  onDone: (answers: PlanAnswers) => void
  onClose: () => void
}

/** Dotazník → Plán je hotový (DOKUMENTACE.md 9.0). */
export function QuizScreen({ initial, onDone, onClose }: Props) {
  useThemeColor('--paper')
  const [answers, setAnswers] = useState<Partial<PlanAnswers>>(initial ?? {})
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const go = (to: number) => {
    setDir(to > step ? 'fwd' : 'back')
    setStep(to)
  }
  const back = () => (step === 0 ? onClose() : go(step - 1))

  const q = QUESTIONS[step] as Question | undefined
  const header = (
    <>
      <header className="top-bar">
        <IconButton label={step === 0 ? 'Zavřít' : 'Zpět'} onClick={back}>
          {step === 0 ? <IconClose /> : <IconBack />}
        </IconButton>
        {q && (
          <span className="top-bar-note">
            {step + 1} ze {QUESTIONS.length}
          </span>
        )}
      </header>
      <div className="quiz-progress">
        <RoundProgress rounds={QUESTIONS.length} done={step + 1} track="var(--hairline)" fill="var(--ink)" />
      </div>
    </>
  )

  if (!q) {
    const a = answers as PlanAnswers
    const sessions = buildPlan(a)
    return (
      <div className="screen">
        {header}
        <div key="hotovo" className={`quiz-step ${dir}`}>
          <div className="scroll">
            <h1 className="display quiz-title">
              Plán
              <br />
              je hotový
            </h1>
            <p className="plan-answers">
              4 týdny · {sessions.length} {plural(sessions.length, 'trénink', 'tréninky', 'tréninků')} · do {a.minutes} min
            </p>
            <PlanWeek week={1} sessions={sessions.slice(0, a.perWeek)} offset={0} />
          </div>
          <button type="button" className="primary-btn" onClick={() => onDone(a)}>
            Jdeme na to
          </button>
        </div>
      </div>
    )
  }

  const pick = (value: Question['options'][number]['value']) => {
    if (timer.current) return // dvojí ťuk nepřeskočí otázku
    setAnswers({ ...answers, [q.key]: value })
    timer.current = setTimeout(() => {
      timer.current = null
      go(step + 1)
    }, PICK_MS)
  }

  return (
    <div className="screen">
      {header}
      <div key={step} className={`quiz-step ${dir}`}>
        <div className="stack gap-8">
          <h1 className="display quiz-title">{q.title}</h1>
          {q.note && <span className="label-15 muted">{q.note}</span>}
        </div>
        <div className="group" role="radiogroup" aria-label={q.title}>
          {q.options.map((o) => (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={answers[q.key] === o.value}
              className="group-row tall quiz-option"
              onClick={() => pick(o.value)}
            >
              <span className="radio" aria-hidden="true" />
              <span className="row-text">
                <strong>{o.label}</strong>
                {o.note && <span>{o.note}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
