import { useState } from 'react'
import { comboTitle } from '../data/moves'
import type { VoiceLang } from '../data/voices'
import { INTENSITY_CHOICES, INTENSITY_LABEL, type IntensityChoice } from '../engine/constants'
import type { WorkoutConfig } from '../engine/timeline'
import { inFinisher } from '../engine/timing'
import { PHRASES, type WorkoutView } from '../workout/runner'
import { RoundProgress } from './bars'
import { ConfirmDialog, IconButton, Segmented, Sheet } from './controls'
import { formatCountdown, formatSec, plural, wordsAreLong } from './format'
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

const INTENSITY_OPTIONS = INTENSITY_CHOICES.map((i) => ({ value: i, label: INTENSITY_LABEL[i] }))

/** „jedna, dva, tři na tělo" → „Jedna, dva, tři na tělo!" */
const sayText = (s: string) => `${s[0].toUpperCase()}${s.slice(1)}${/[.!?]$/.test(s) ? '' : '!'}`

/** Trénink běží (DOKUMENTACE.md 9.2): Odpočet → Kolo → Pauza → … → Hotovo. */
export function WorkoutScreen(props: Props) {
  const { view, config, workoutName, lang, planNote, onPause, onResume, onSkip, onIntensity, onAgain, onClose } = props
  const { phase, round, rounds, remainingMs, durationMs, paused } = view
  const [asking, setAsking] = useState(false)
  const [quick, setQuick] = useState(false)
  useThemeColor(phase === 'round' ? '--accent' : phase === 'rest' ? '--ink' : '--paper')

  const progress = durationMs > 0 ? 1 - remainingMs / durationMs : 1
  const togglePause = paused ? onResume : onPause
  const confirm = asking && (
    <ConfirmDialog
      title="Ukončit trénink?"
      text="Odboxovaná kola se nikam neukládají."
      confirm="Ukončit"
      cancel="Pokračovat"
      onConfirm={onClose}
      onCancel={() => setAsking(false)}
    />
  )
  const banner = view.wakeLockFailed && (
    <p className="warn-strip">Displej může zhasnout — Nastavení → Displej a jas → Automatický zámek → Nikdy</p>
  )

  if (phase === 'done') {
    return (
      <div className="screen spread">
        <i className="screen-edge" aria-hidden="true" />
        <div className="stack gap-8">
          <h1 className="display">Hotovo</h1>
          <span className="label-15 muted">Dobrá práce.</span>
        </div>
        <div className="stack done-mid">
          <div className={rounds > 9 ? 'countdown two' : 'countdown'} aria-hidden="true">
            {rounds}
          </div>
          <div className="stack gap-6 done-caption">
            <span className="label-15 muted">
              {plural(rounds, 'kolo', 'kola', 'kol')} · celkem {formatSec(view.boxedMs / 1000)}
            </span>
            <span className="label-15 muted">
              {view.callSeq} {plural(view.callSeq, 'kombo', 'komba', 'komb')} · {view.punches}{' '}
              {plural(view.punches, 'úder', 'údery', 'úderů')}
            </span>
            {planNote && <span className="label-15">{planNote}</span>}
          </div>
        </div>
        <div className="stack gap-10">
          <button type="button" className="primary-btn" onClick={onAgain}>
            Znovu
          </button>
          <button type="button" className="pill-btn big" onClick={onClose}>
            Domů
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
            <IconButton label="Ukončit trénink" onClick={() => setAsking(true)}>
              <IconClose />
            </IconButton>
          </header>
          <h1 className="display">{paused ? 'Pozastaveno' : 'Připrav se'}</h1>
          <span className="label-15 muted">
            {workoutName} · kolo 1 ze {rounds}
          </span>
        </div>
        <div className={sec > 9 ? 'countdown two' : 'countdown'} role="timer" aria-label={`Začínáme za ${sec} s`}>
          {sec}
        </div>
        <div className="stack gap-16">
          <RoundProgress rounds={rounds} done={1} track="var(--hairline)" fill="var(--ink)" />
          <div className="top-bar">
            <div className="stack gap-10">
              <span className="label-13">První kombo</span>
              {view.upcoming && <PunchSequence moves={view.upcoming.moves} size="prep" />}
            </div>
            {paused ? (
              <button type="button" className="pill-btn ink" onClick={onResume}>
                Pokračovat
              </button>
            ) : (
              <button type="button" className="pill-btn" onClick={onSkip}>
                Přeskočit
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
            <IconButton tone="on-ink" label="Ukončit trénink" onClick={() => setAsking(true)}>
              <IconClose />
            </IconButton>
            <span className="top-bar-title">
              Kolo {round - 1} ze {rounds} hotovo
            </span>
            <span className="spacer-44" aria-hidden="true" />
          </header>
          <RoundProgress rounds={rounds} done={round - 1} track="var(--dark-track)" fill="var(--white)" />
        </div>
        <div className="stack gap-6">
          <h1 className="display rest-title">Pauza</h1>
          <span className="label-15 on-dark-muted">{paused ? 'Pozastaveno' : 'Další kolo za'}</span>
          <div className="timer" role="timer">
            {formatCountdown(remainingMs)}
          </div>
          <div className="rest-bar" aria-hidden="true">
            <i style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <div className="stack gap-14">
          {next && (
            <section className="next-card" aria-label="Další kombo">
              <div className="head">
                <span>Další kombo</span>
                <span>{next.name ?? comboTitle(next.moves)}</span>
              </div>
              <PunchSequence moves={next.moves} size="m" inverse />
            </section>
          )}
          <div className="rest-actions">
            <button type="button" className="round-pause" aria-label={paused ? 'Pokračovat' : 'Pozastavit pauzu'} onClick={togglePause}>
              {paused ? <IconPlay size={22} /> : <IconPause size={22} />}
            </button>
            <button type="button" className="pill-btn big white grow" onClick={onSkip}>
              Přeskočit pauzu
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
          <IconButton tone="on-accent" label="Zavřít trénink" onClick={() => setAsking(true)}>
            <IconClose />
          </IconButton>
          <span className="top-bar-title">
            Kolo {round} ze {rounds}
          </span>
          <IconButton tone="on-accent" label="Nastavení tréninku" onClick={() => setQuick(true)}>
            <IconSliders />
          </IconButton>
        </header>
        <RoundProgress rounds={rounds} done={round - 1} partial={progress} track="var(--white-a30)" fill="var(--white)" />
      </div>

      <div className="stack gap-6">
        <span className="label-15">{paused ? 'Pozastaveno' : 'Zbývá'}</span>
        <div className="timer" role="timer">
          {formatCountdown(remainingMs)}
        </div>
      </div>

      <section className="stack gap-16" aria-label="Aktuální kombo">
        <div className="top-bar label-15">
          <span>{finisher ? 'Finiš' : view.repeat ? 'Znovu' : 'Kombo'}</span>
          <span>
            {finisher
              ? 'Do gongu'
              : current >= 0
                ? `Úder ${current + 1} ze ${n}`
                : n > 0
                  ? `${n} ${plural(n, 'úder', 'údery', 'úderů')}`
                  : ''}
          </span>
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
          <span>{view.spoken ? `„${sayText(view.spoken)}“` : 'Poslouchej trenéra.'}</span>
        </div>
      </section>

      <div className="controls">
        <button type="button" className="control" onClick={onSkip}>
          <span className="ring">
            <IconNext />
          </span>
          Další kolo
        </button>
        <button type="button" className="big-pause" aria-label={paused ? 'Pokračovat' : 'Pozastavit'} onClick={togglePause}>
          {paused ? <IconPlay size={28} /> : <IconPause />}
        </button>
        <button type="button" className="control" onClick={() => setAsking(true)}>
          <span className="ring">
            <IconStop />
          </span>
          Konec
        </button>
      </div>
      {banner}

      {quick && (
        <Sheet label="Nastavení tréninku" onClose={() => setQuick(false)}>
          <h2 className="display-s sheet-title">Intenzita</h2>
          <Segmented label="Intenzita" value={config.intensity} options={INTENSITY_OPTIONS} onChange={onIntensity} />
          {config.intensity === 'ramp' && (
            <p className="label-15 muted">
              Kolo {round}: {INTENSITY_LABEL[view.tempo]}
            </p>
          )}
          <p className="label-15 muted">Platí od dalšího komba.</p>
          <button type="button" className="primary-btn" onClick={() => setQuick(false)}>
            Hotovo
          </button>
        </Sheet>
      )}
      {confirm}
    </div>
  )
}
