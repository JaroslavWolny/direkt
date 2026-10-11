import { useState } from 'react'
import { comboTitle } from '../data/moves'
import type { VoiceLang } from '../data/voices'
import { INTENSITY_CHOICES, type IntensityChoice } from '../engine/constants'
import type { WorkoutConfig } from '../engine/timeline'
import { inFinisher } from '../engine/timing'
import { getLang, t } from '../i18n'
import { PHRASES, type WorkoutView } from '../workout/runner'
import { RoundProgress } from './bars'
import { ConfirmDialog, IconButton, Segmented, Sheet } from './controls'
import { formatCountdown, formatSec, wordsAreLong } from './format'
import { IconClose, IconNext, IconPause, IconPlay, IconSliders, IconSpeaker, IconStop } from './icons'
import { PunchSequence, Words } from './punch'
import { useThemeColor } from './useThemeColor'

interface Props {
  view: WorkoutView
  config: WorkoutConfig
  workoutName: string
  /** Jazyk hlasu pro slova v kole (9.2). */
  lang: VoiceLang
  /** Trénink plánu: „Plán: 6 z 12 hotovo" na Hotovo. */
  planNote?: string
  onPause: () => void
  onResume: () => void
  onSkip: () => void
  onIntensity: (i: IntensityChoice) => void
  onAgain: () => void
  onClose: () => void
}

/** „jedna, dva, tři na tělo" → „Jedna, dva, tři na tělo!" */
const sayText = (s: string) => `${s[0].toUpperCase()}${s.slice(1)}${/[.!?]$/.test(s) ? '' : '!'}`

/** Uvozovky podle jazyka rozhraní: „…“ / “…” */
const quote = (s: string) => (getLang() === 'en' ? `“${s}”` : `„${s}“`)

/** Trénink běží (DOKUMENTACE.md 9.2): Odpočet → Kolo → Pauza → … → Hotovo. */
export function WorkoutScreen(props: Props) {
  const { view, config, workoutName, lang, planNote, onPause, onResume, onSkip, onIntensity, onAgain, onClose } = props
  const { phase, round, rounds, remainingMs, durationMs, paused } = view
  const [asking, setAsking] = useState(false)
  const [quick, setQuick] = useState(false)
  useThemeColor(phase === 'round' ? '--accent' : phase === 'rest' ? '--ink' : '--paper')
  const s = t().workout

  const progress = durationMs > 0 ? 1 - remainingMs / durationMs : 1
  const togglePause = paused ? onResume : onPause
  const confirm = asking && (
    <ConfirmDialog
      title={s.endTitle}
      text={s.endText}
      confirm={s.endConfirm}
      cancel={t().resume}
      onConfirm={onClose}
      onCancel={() => setAsking(false)}
    />
  )
  const banner = view.wakeLockFailed && (
    <p className="warn-strip">{s.wakeLock}</p>
  )

  if (phase === 'done') {
    return (
      <div className="screen spread">
        <i className="screen-edge" aria-hidden="true" />
        <div className="stack gap-8">
          <h1 className="display">{s.doneTitle}</h1>
          <span className="label-15 muted">{s.goodWork}</span>
        </div>
        <div className="stack done-mid">
          <div className={rounds > 9 ? 'countdown two' : 'countdown'} aria-hidden="true">
            {rounds}
          </div>
          <div className="stack gap-6 done-caption">
            <span className="label-15 muted">{s.boxed(rounds, formatSec(view.boxedMs / 1000))}</span>
            <span className="label-15 muted">
              {t().nCombos(view.callSeq)} · {t().nPunches(view.punches)}
            </span>
            {planNote && <span className="label-15">{planNote}</span>}
          </div>
        </div>
        <div className="stack gap-10">
          <button type="button" className="primary-btn" onClick={onAgain}>
            {s.again}
          </button>
          <button type="button" className="pill-btn big" onClick={onClose}>
            {t().homeLink}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'prep') {
    const sec = Math.ceil(remainingMs / 1000)
    return (
      <div className="screen spread">
        <i className="screen-edge" aria-hidden="true" />
        <div className="stack gap-8">
          <header className="top-bar prep-bar">
            <IconButton label={s.endAria} onClick={() => setAsking(true)}>
              <IconClose />
            </IconButton>
          </header>
          <h1 className="display">{paused ? s.paused : s.getReady}</h1>
          <span className="label-15 muted">{s.prepSub(workoutName, rounds)}</span>
        </div>
        <div className={sec > 9 ? 'countdown two' : 'countdown'} role="timer" aria-label={s.startingIn(sec)}>
          {sec}
        </div>
        <div className="stack gap-16">
          <RoundProgress rounds={rounds} done={1} track="var(--hairline)" fill="var(--ink)" />
          <div className="top-bar">
            <div className="stack gap-10">
              <span className="label-13">{s.firstCombo}</span>
              {view.upcoming && <PunchSequence moves={view.upcoming.moves} size="prep" />}
            </div>
            {paused ? (
              <button type="button" className="pill-btn ink" onClick={onResume}>
                {t().resume}
              </button>
            ) : (
              <button type="button" className="pill-btn" onClick={onSkip}>
                {s.skip}
              </button>
            )}
          </div>
          {banner}
        </div>
        {confirm}
      </div>
    )
  }

  if (phase === 'rest') {
    const next = view.upcoming
    return (
      <div className="screen spread on-ink">
        <i className="screen-edge" aria-hidden="true" />
        <div className="stack gap-20">
          <header className="top-bar">
            <IconButton tone="on-ink" label={s.endAria} onClick={() => setAsking(true)}>
              <IconClose />
            </IconButton>
            <span className="top-bar-title">{s.roundDone(round - 1, rounds)}</span>
            <span className="spacer-44" aria-hidden="true" />
          </header>
          <RoundProgress rounds={rounds} done={round - 1} track="var(--dark-track)" fill="var(--white)" />
        </div>
        <div className="stack gap-6">
          <h1 className="display rest-title">{s.rest}</h1>
          <span className="label-15 on-dark-muted">{paused ? s.paused : s.nextRoundIn}</span>
          <div className="timer" role="timer">
            {formatCountdown(remainingMs)}
          </div>
          <div className="rest-bar" aria-hidden="true">
            <i style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <div className="stack gap-14">
          {next && (
            <section className="next-card" aria-label={s.nextCombo}>
              <div className="head">
                <span>{s.nextCombo}</span>
                <span>{next.name ?? comboTitle(next.moves, getLang())}</span>
              </div>
              <PunchSequence moves={next.moves} size="m" inverse />
            </section>
          )}
          <div className="rest-actions">
            <button type="button" className="round-pause" aria-label={paused ? t().resume : s.pauseRest} onClick={togglePause}>
              {paused ? <IconPlay size={22} /> : <IconPause size={22} />}
            </button>
            <button type="button" className="pill-btn big white grow" onClick={onSkip}>
              {s.skipRest}
            </button>
          </div>
          {banner}
        </div>
        {confirm}
      </div>
    )
  }

  // Kolo
  const finisher = inFinisher(view)
  const shown = view.combo ?? view.upcoming
  const n = shown?.moves.length ?? 0
  const current = view.combo ? view.moveIndex : -1
  return (
    <div className="screen spread on-accent">
      <i className="screen-edge" aria-hidden="true" />
      <div className="stack gap-20">
        <header className="top-bar">
          <IconButton tone="on-accent" label={s.closeAria} onClick={() => setAsking(true)}>
            <IconClose />
          </IconButton>
          <span className="top-bar-title">{s.round(round, rounds)}</span>
          <IconButton tone="on-accent" label={s.quickAria} onClick={() => setQuick(true)}>
            <IconSliders />
          </IconButton>
        </header>
        <RoundProgress rounds={rounds} done={round - 1} partial={progress} track="var(--white-a30)" fill="var(--white)" />
      </div>

      <div className="stack gap-6">
        <span className="label-15">{paused ? s.paused : s.remaining}</span>
        <div className="timer" role="timer">
          {formatCountdown(remainingMs)}
        </div>
      </div>

      <section className="stack gap-16" aria-label={s.currentCombo}>
        <div className="top-bar label-15">
          <span>{finisher ? s.finisher : view.repeat ? s.repeat : s.combo}</span>
          <span>{finisher ? s.toBell : current >= 0 ? s.punchOf(current + 1, n) : n > 0 ? t().nPunches(n) : ''}</span>
        </div>
        {finisher ? (
          <span className="words">
            <span className="now">{PHRASES[lang].naplno.toUpperCase()}</span>
          </span>
        ) : shown ? (
          <Words key={view.callSeq} moves={shown.moves} current={current} lang={lang} small={wordsAreLong(shown.moves, lang)} />
        ) : (
          <span className="words">—</span>
        )}
        <div className="say">
          <IconSpeaker />
          <span>{view.spoken ? quote(sayText(view.spoken)) : s.listen}</span>
        </div>
      </section>

      <div className="controls">
        <button type="button" className="control" onClick={onSkip}>
          <span className="ring">
            <IconNext />
          </span>
          {s.nextRound}
        </button>
        <button type="button" className="big-pause" aria-label={paused ? t().resume : s.pause} onClick={togglePause}>
          {paused ? <IconPlay size={28} /> : <IconPause />}
        </button>
        <button type="button" className="control" onClick={() => setAsking(true)}>
          <span className="ring">
            <IconStop />
          </span>
          {s.end}
        </button>
      </div>
      {banner}

      {quick && (
        <Sheet label={s.quickAria} onClose={() => setQuick(false)}>
          <h2 className="display-s sheet-title">{t().intensityCaption}</h2>
          <Segmented
            label={t().intensityCaption}
            value={config.intensity}
            options={INTENSITY_CHOICES.map((i) => ({ value: i, label: t().intensity[i] }))}
            onChange={onIntensity}
          />
          {config.intensity === 'ramp' && <p className="label-15 muted">{s.rampRound(round, t().intensity[view.tempo])}</p>}
          <p className="label-15 muted">{s.fromNext}</p>
          <button type="button" className="primary-btn" onClick={() => setQuick(false)}>
            {t().done}
          </button>
        </Sheet>
      )}
      {confirm}
    </div>
  )
}
