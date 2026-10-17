import { useState } from 'react'
import { clipsFor, previewClips } from '../audio/voice'
import { LEVELS } from '../data/combos'
import { parseMoves } from '../data/moves'
import { VOICES, type VoiceInfo } from '../data/voices'
import { ACTION_MS_CHOICES, LIMITS, PAUSE_MS_CHOICES } from '../engine/constants'
import type { WorkoutConfig } from '../engine/timeline'
import { LANG_NAME, LANGS, t } from '../i18n'
import type { Settings } from '../store/storage'
import { IconButton, Segmented, Stepper, SwitchRow } from './controls'
import { formatSec } from './format'
import { IconBack, IconChevron, IconPlay, IconSpeaker } from './icons'
import { useThemeColor } from './useThemeColor'

interface Props {
  settings: Settings
  onSettings: (s: Settings) => void
  config: WorkoutConfig
  onConfig: (c: WorkoutConfig) => void
  /** Běží plán — nastavení kol platí jen mimo něj (9.6). */
  planActive: boolean
  onBack: () => void
}

const SAMPLE = clipsFor(parseMoves('1 2 3t uklon'))
const LANG_OPTIONS = LANGS.map((l) => ({ value: l, label: LANG_NAME[l] }))

/** Nastavení (DOKUMENTACE.md 9.6, Nastaveni.html) — vše se ukládá hned. */
export function SettingsScreen({ settings, onSettings, config, onConfig, planActive, onBack }: Props) {
  useThemeColor('--paper')
  const s = t().settings
  const [playing, setPlaying] = useState<VoiceInfo['id'] | null>(null)
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => onSettings({ ...settings, [key]: value })
  const setCfg = <K extends keyof WorkoutConfig>(key: K, value: WorkoutConfig[K]) => onConfig({ ...config, [key]: value })

  /** Stejné klipy jako v tréninku; zvuk se musí rozjet přímo v ťuknutí (R1). */
  const test = (v: VoiceInfo) => {
    setPlaying(v.id)
    previewClips(v.id, SAMPLE, settings.silentOverride, () => setPlaying(null))
  }

  return (
    <div className="screen">
      <i className="screen-edge" aria-hidden="true" />
      <div className="scroll">
        <IconButton label={t().back} onClick={onBack}>
          <IconBack />
        </IconButton>
        <h1 className="display settings-title">{s.title}</h1>

        <section className="section">
          <h2 className="caption">{s.language}</h2>
          <Segmented label={s.language} value={settings.lang} options={LANG_OPTIONS} onChange={(v) => set('lang', v)} />
        </section>

        <section className="section">
          <h2 className="caption">{s.voice}</h2>
          <div className="group" role="radiogroup" aria-label={s.voice}>
            {VOICES.map((v) => (
              <div key={v.id} className="group-row tall">
                <button
                  type="button"
                  role="radio"
                  aria-checked={settings.voice === v.id}
                  className="voice-pick"
                  onClick={() => set('voice', v.id)}
                >
                  <span className="radio" aria-hidden="true" />
                  <span className="row-text">
                    <strong>{v.name}</strong>
                    <span>
                      {s.voiceLang[v.lang]} · {s.voiceStyle[v.id]}
                    </span>
                  </span>
                </button>
                <IconButton
                  tone="accent"
                  label={playing === v.id ? s.playing(v.name) : s.play(v.name)}
                  onClick={() => test(v)}
                >
                  {playing === v.id ? <IconSpeaker size={18} /> : <IconPlay size={16} />}
                </IconButton>
              </div>
            ))}
            <details className="disclosure">
              <summary>
                {s.cantHear}
                <IconChevron />
              </summary>
              <p>{s.cantHearText}</p>
            </details>
          </div>
        </section>

        <section className="section">
          <h2 className="caption">{s.pause}</h2>
          <Segmented<number>
            label={s.pause}
            value={settings.pauseMs}
            options={PAUSE_MS_CHOICES.map((ms) => ({ value: ms, label: s.seconds(ms) }))}
            onChange={(v) => set('pauseMs', v)}
          />
          <p className="settings-note">{s.pauseNote}</p>
        </section>

        <section className="section">
          <h2 className="caption">{s.actionTime}</h2>
          <Segmented<number>
            label={s.actionTime}
            value={settings.actionMs}
            options={ACTION_MS_CHOICES.map((ms) => ({ value: ms, label: s.seconds(ms) }))}
            onChange={(v) => set('actionMs', v)}
          />
          <p className="settings-note">{s.actionTimeNote}</p>
        </section>

        <section className="section">
          <h2 className="caption">{t().levelCaption}</h2>
          <Segmented
            label={t().levelCaption}
            value={config.level}
            options={LEVELS.map((l) => ({ value: l, label: t().level[l] }))}
            onChange={(v) => setCfg('level', v)}
          />
        </section>

        <section className="section">
          <h2 className="caption">{s.round}</h2>
          <div className="group">
            <Stepper label={t().roundCount} value={config.rounds} limit={LIMITS.rounds} format={String} onChange={(v) => setCfg('rounds', v)} />
            <Stepper label={t().roundLength} value={config.roundSec} limit={LIMITS.roundSec} format={formatSec} onChange={(v) => setCfg('roundSec', v)} />
            <Stepper label={t().restBetween} value={config.restSec} limit={LIMITS.restSec} format={formatSec} onChange={(v) => setCfg('restSec', v)} />
            <Stepper
              label={s.countdown}
              value={settings.prepSec}
              limit={LIMITS.prepSec}
              format={(v) => `${v} s`}
              onChange={(v) => set('prepSec', v)}
            />
          </div>
          {planActive && <p className="settings-note">{s.planNote}</p>}
        </section>

        <section className="section">
          <h2 className="caption">{s.playback}</h2>
          <div className="group">
            <SwitchRow label={s.silent} checked={settings.silentOverride} onChange={(v) => set('silentOverride', v)} />
            <SwitchRow label={s.autoPause} checked={settings.autoPause} onChange={(v) => set('autoPause', v)} />
          </div>
        </section>

        <section className="section">
          <div className="group single">
            <details className="disclosure">
              <summary>
                {s.about}
                <IconChevron />
              </summary>
              <p>{s.aboutText(__APP_VERSION__)}</p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}
