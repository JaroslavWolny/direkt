// Běh tréninku: hodiny bez pauz, události z časové osy, hlášení komb (DOKUMENTACE.md kap. 7–8).
import { resumeContext, setSilentOverride, startKeepAlive, stopKeepAlive } from '../audio/context'
import { beep, bell, clap } from '../audio/sounds'
import { clipsFor, playClips, stopVoice, voiceDurationMs } from '../audio/voice'
import { acquireWakeLock, reacquireWakeLock, releaseWakeLock } from '../audio/wakelock'
import type { Combo } from '../data/combos'
import { voiceLang, type VoiceId, type VoiceLang } from '../data/voices'
import { isDefense, speechText } from '../data/moves'
import { FIRST_CALL_DELAY_MS, REPEAT_CHANCE, REPEAT_CHANCE_DRILL, type Intensity } from '../engine/constants'
import { createSelector, shouldRepeat } from '../engine/selector'
import {
  buildSegments,
  eventsBetween,
  phaseAt,
  scheduleEvents,
  segmentEnd,
  totalMs,
  type PhaseState,
  type Segment,
  type WorkoutConfig,
  type WorkoutEvent,
} from '../engine/timeline'
import { comboWindowMs, fitsInRound, gapMs, tempoForRound } from '../engine/timing'
import type { Settings } from '../store/storage'

export interface WorkoutView extends PhaseState {
  rounds: number
  combo: Combo | null
  /** Index úderu, který hlas právě říká; −1 když nemluví (kap. 9.2). */
  moveIndex: number
  /** Kombo je zopakované na „Znovu!" (7.9). */
  repeat: boolean
  /** Tempo aktuálního kola — u stupňované intenzity se mění po kolech (7.10). */
  tempo: Intensity
  /** První kombo dalšího kola — příprava a Pauza ho ukazují dopředu (7.6). */
  upcoming: Combo | null
  /** Roste s každým hlášením — klíč pro animaci nového komba a počet komb na Hotovo. */
  callSeq: number
  /** Údery v ohlášených kombech bez obrany (obrazovka Hotovo). */
  punches: number
  /** Co hlas naposledy řekl (bublina) a jestli právě mluví (vlnovka). */
  spoken: string | null
  speaking: boolean
  paused: boolean
  wakeLockFailed: boolean
  /** Čas v kolech bez přeskočených částí — „celkem" na Hotovo (9.2). */
  boxedMs: number
}

const TICK_MS = 100
const FINISH_SPEECH_DELAY_MS = 2600
const AFTER_ANNOUNCE_MS = 800
/** „Naplno!" až po dvojím klepnutí (~0,24 s), ať se nepřekryjí (7.8). */
const FINISHER_LEAD_S = 0.3
/** „Poslední kolo" až po úderu gongu, jinak v něm zanikne (7.3). */
const LAST_ROUND_LEAD_S = 0.4
/** Delší mezera mezi tiky = appka byla uspaná (jen bez automatické pauzy, 7.7). */
const RESYNC_GAP_MS = 2000

type Phrase = 'pripravse' | 'posledni' | 'naplno' | 'znovu' | 'hotovo'

/** Hlášky mimo komba v jazyce hlasu (text do bubliny; klip má stejné id). */
export const PHRASES: Record<VoiceLang, Record<Phrase, string>> = {
  cs: { pripravse: 'Připrav se', posledni: 'Poslední kolo', naplno: 'Naplno', znovu: 'Znovu', hotovo: 'Hotovo. Dobrá práce.' },
  en: { pripravse: 'Get ready', posledni: 'Last round', naplno: 'All out', znovu: 'Again', hotovo: 'Time! Great work!' },
}

export class WorkoutRunner {
  private readonly segs: Segment[]
  private readonly events: WorkoutEvent[]
  private readonly next: () => Combo
  private readonly rng: () => number
  private readonly voiceId: VoiceId
  private readonly lang: VoiceLang
  private readonly config: WorkoutConfig
  private readonly settings: Settings
  private readonly onView: (v: WorkoutView) => void
  private readonly onFinish: () => void
  private accumulated = 0
  private runningSince: number | null = null
  /** Přeskočené části kol — odečtou se od „celkem" (9.2). */
  private skippedRoundMs = 0
  private prevMs = -1
  private timer: ReturnType<typeof setInterval> | null = null
  private finishTimer: ReturnType<typeof setTimeout> | null = null
  /** Probíhá hlášení nebo ohlášení — další kombo počká. */
  private speaking = false
  private voiceActive = false
  private spoken: string | null = null
  private nextCallAt = Infinity
  private upcoming: Combo | null
  /** Začátky klipů právě hlášeného komba (performance.now). */
  private clipStarts: number[] = []
  private intensity: WorkoutConfig['intensity']
  private lastCombo: Combo | null = null
  /** Kolikrát po sobě zaznělo „Znovu" (7.9). */
  private repeats = 0
  private repeat = false
  private combo: Combo | null = null
  private callSeq = 0
  private punches = 0
  private wakeLockFailed = false
  private finished = false

  constructor(
    config: WorkoutConfig,
    settings: Settings,
    pool: readonly Combo[],
    onView: (v: WorkoutView) => void,
    /** Trénink doběhl na Hotovo (ne Konec) — posun v plánu (7.11). */
    onFinish: () => void = () => undefined,
    rng: () => number = Math.random,
  ) {
    this.config = config
    this.settings = settings
    this.onView = onView
    this.onFinish = onFinish
    this.segs = buildSegments(config, settings.prepSec)
    this.events = scheduleEvents(this.segs)
    this.next = createSelector(pool, config.level, rng)
    this.rng = rng
    this.voiceId = settings.voice
    this.lang = voiceLang(settings.voice)
    this.intensity = config.intensity
    this.upcoming = this.next()
  }

  /** Volat přímo v handleru ťuknutí — iOS pustí zvuk a řeč jen z gesta (R1). */
  start(): void {
    setSilentOverride(this.settings.silentOverride)
    void resumeContext()
    startKeepAlive()
    this.speak(['pripravse'], PHRASES[this.lang].pripravse)
    acquireWakeLock(this.onWakeLock)
    this.runningSince = performance.now()
    this.timer = setInterval(this.tick, TICK_MS)
    this.tick()
  }

  pause(): void {
    if (this.runningSince === null || this.finished) return
    this.accumulated = this.elapsed()
    this.runningSince = null
    this.silence()
    this.emit()
  }

  /** Volat v handleru ťuknutí — obnoví zvuk po přerušení (hovor, zamčení). */
  resume(): void {
    if (this.runningSince !== null || this.finished) return
    void resumeContext()
    startKeepAlive()
    reacquireWakeLock(this.onWakeLock)
    this.runningSince = performance.now()
    const now = this.accumulated
    if (phaseAt(this.segs, now).phase === 'round') {
      // Po pauze celá mezera posledního komba, ne její zbytek (7.3).
      this.nextCallAt =
        now +
        (this.lastCombo
          ? gapMs(this.lastCombo.moves.length, this.tempo(), this.settings.actionMs)
          : FIRST_CALL_DELAY_MS)
    }
    this.tick()
  }

  /** Intenzita z panelu v kole — platí od dalšího komba (kap. 9.2). */
  setIntensity(intensity: WorkoutConfig['intensity']): void {
    this.intensity = intensity
  }

  /** DALŠÍ / PŘESKOČIT PAUZU: skok na konec fáze, zazní jen události na hranici (7.5). */
  skip(): void {
    if (this.finished) return
    const now = this.elapsed()
    const end = segmentEnd(this.segs, now)
    if (end === null) return
    this.silence()
    if (phaseAt(this.segs, now).phase === 'round') this.skippedRoundMs += end - now
    this.accumulated += end - now
    this.prevMs = end - 1
    this.process(this.elapsed())
  }

  onVisibility(visible: boolean): void {
    if (this.finished) return
    if (!visible) {
      if (this.settings.autoPause) this.pause() // R6
      return
    }
    reacquireWakeLock(this.onWakeLock)
    if (!this.settings.autoPause && this.runningSince !== null) {
      void resumeContext()
      this.resync(this.elapsed())
      this.emit()
    }
  }

  /** Konec (✕/KONEC) nebo zavření obrazovky po dokončení. */
  stop(): void {
    this.finished = true
    this.runningSince = null
    if (this.timer) clearInterval(this.timer)
    if (this.finishTimer) clearTimeout(this.finishTimer)
    this.timer = null
    this.finishTimer = null
    this.silence()
    stopKeepAlive()
    releaseWakeLock()
    setSilentOverride(false)
  }

  /** Tempo podle intenzity a kola, které běží (7.10). */
  private tempo(): Intensity {
    return tempoForRound(this.intensity, phaseAt(this.segs, this.elapsed()).round, this.config.rounds)
  }

  private elapsed(): number {
    return this.accumulated + (this.runningSince === null ? 0 : performance.now() - this.runningSince)
  }

  private readonly onWakeLock = (ok: boolean): void => {
    this.wakeLockFailed = !ok
    this.emit()
  }

  /** Přehraje klipy hlasu; `text` jde do bubliny na obrazovce. */
  private speak(clips: readonly string[], text: string, onDone?: () => void, leadS = 0): void {
    this.spoken = text
    this.voiceActive = true
    this.clipStarts = []
    playClips(
      this.voiceId,
      clips,
      () => {
        this.voiceActive = false
        this.clipStarts = []
        onDone?.()
        this.emit()
      },
      (starts) => {
        this.clipStarts = starts
      },
      leadS,
    )
  }

  private silence(): void {
    stopVoice()
    this.speaking = false
    this.voiceActive = false
    this.clipStarts = []
  }

  private readonly tick = (): void => {
    if (this.runningSince === null) return
    const now = this.elapsed()
    if (!this.settings.autoPause && this.prevMs >= 0 && now - this.prevMs > RESYNC_GAP_MS) this.resync(now)
    this.process(now)
  }

  /** Návrat z uspání bez automatické pauzy: zmeškané zvuky se nepřehrávají, jen se dorovná stav (7.7). */
  private resync(now: number): void {
    this.prevMs = now
    this.silence()
    this.combo = null
    const ps = phaseAt(this.segs, now)
    if (ps.phase === 'done') this.finish()
    else this.nextCallAt = ps.phase === 'round' ? now + FIRST_CALL_DELAY_MS : Infinity
  }

  private process(now: number): void {
    for (const e of eventsBetween(this.events, this.prevMs, now)) this.handle(e)
    this.prevMs = now
    if (this.finished) return
    const ps = phaseAt(this.segs, now)
    if (this.runningSince !== null && ps.phase === 'round' && !this.speaking && now >= this.nextCallAt) {
      this.call(comboWindowMs(ps.remainingMs, ps.durationMs))
    }
    this.emit()
  }

  /** windowMs = čas do finiše, kolo bez finiše do gongu (7.8). */
  private call(windowMs: number): void {
    const last = this.lastCombo
    // „Znovu!" = stejné kombo ještě jednou, hlas řekne jen to slovo (7.9).
    const drill = this.config.focus === 'technika' || this.config.focus === 'obrana'
    const chance = drill ? REPEAT_CHANCE_DRILL : REPEAT_CHANCE
    const again = last !== null && shouldRepeat(this.rng, this.repeats, chance)
    const combo = again ? last : (this.upcoming ?? this.next())
    if (!again) this.upcoming = null
    const clips = again ? ['znovu'] : clipsFor(combo.moves)
    if (!fitsInRound(windowMs, voiceDurationMs(this.voiceId, clips), combo.moves.length, this.settings.actionMs)) {
      this.nextCallAt = Infinity // radši ticho než useknuté kombo
      return
    }
    this.repeats = again ? this.repeats + 1 : 0
    this.repeat = again
    this.speaking = true
    this.combo = combo
    this.lastCombo = combo
    this.callSeq++
    this.punches += combo.moves.filter((m) => !isDefense(m)).length
    this.speak(clips, again ? PHRASES[this.lang].znovu : speechText(combo.moves, this.lang), () => {
      this.speaking = false
      this.nextCallAt = this.elapsed() + gapMs(combo.moves.length, this.tempo(), this.settings.actionMs)
    })
  }

  private handle(e: WorkoutEvent): void {
    switch (e.type) {
      case 'beep':
        beep()
        break
      case 'roundStart':
        bell(1)
        this.combo = null
        this.lastCombo = null
        this.repeats = 0
        this.spoken = null // „Naplno!" z minulého kola do nového nepatří
        this.nextCallAt = e.atMs + FIRST_CALL_DELAY_MS
        if (e.lastRound) {
          this.speaking = true
          this.speak(
            ['posledni'],
            PHRASES[this.lang].posledni,
            () => {
              this.speaking = false
              this.nextCallAt = Math.max(this.nextCallAt, this.elapsed() + AFTER_ANNOUNCE_MS)
            },
            LAST_ROUND_LEAD_S,
          )
        }
        break
      case 'warning':
        // Finiš: komba končí, volné údery naplno do gongu (7.8).
        clap(2)
        this.silence()
        this.combo = null
        this.nextCallAt = Infinity
        this.speak(['naplno'], PHRASES[this.lang].naplno, undefined, FINISHER_LEAD_S)
        break
      case 'roundEnd':
        bell(3)
        this.silence()
        this.combo = null
        this.nextCallAt = Infinity
        // Pauza ukazuje první kombo dalšího kola dopředu (kap. 9.2).
        if (e.round < this.config.rounds) this.upcoming = this.next()
        break
      case 'finish':
        this.finish()
        break
    }
  }

  private finish(): void {
    this.finished = true
    this.accumulated = totalMs(this.segs)
    this.runningSince = null
    if (this.timer) clearInterval(this.timer)
    this.timer = null
    releaseWakeLock()
    this.finishTimer = setTimeout(
      () => this.speak(['hotovo'], PHRASES[this.lang].hotovo, stopKeepAlive),
      FINISH_SPEECH_DELAY_MS,
    )
    this.emit()
    this.onFinish()
  }

  private emit(): void {
    const ps: PhaseState = this.finished
      ? { phase: 'done', round: this.config.rounds, remainingMs: 0, durationMs: 0 }
      : phaseAt(this.segs, this.elapsed())
    const now = performance.now()
    const moveIndex =
      this.voiceActive && this.combo && !this.repeat && this.clipStarts.length > 0
        ? this.clipStarts.filter((t) => t <= now).length - 1
        : -1
    this.onView({
      ...ps,
      rounds: this.config.rounds,
      combo: this.combo,
      moveIndex,
      repeat: this.repeat && this.combo !== null,
      tempo: this.tempo(),
      upcoming: this.upcoming,
      callSeq: this.callSeq,
      punches: this.punches,
      spoken: this.spoken,
      speaking: this.voiceActive,
      paused: this.runningSince === null && !this.finished,
      wakeLockFailed: this.wakeLockFailed,
      boxedMs: this.config.rounds * this.config.roundSec * 1000 - this.skippedRoundMs,
    })
  }
}
