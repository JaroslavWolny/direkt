import { useState } from 'react'
import { clipsFor, previewClips } from '../audio/voice'
import { LEVEL_LABEL, LEVELS } from '../data/combos'
import { parseMoves } from '../data/moves'
import { VOICES, type VoiceInfo } from '../data/voices'
import { INTENSITY_CHOICES, INTENSITY_LABEL, LIMITS } from '../engine/constants'
import type { WorkoutConfig } from '../engine/timeline'
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
const LEVEL_OPTIONS = LEVELS.map((l) => ({ value: l, label: LEVEL_LABEL[l] }))
const INTENSITY_OPTIONS = INTENSITY_CHOICES.map((i) => ({ value: i, label: INTENSITY_LABEL[i] }))

/** Nastavení (DOKUMENTACE.md 9.6, Nastaveni.html) — vše se ukládá hned. */
export function SettingsScreen({ settings, onSettings, config, onConfig, planActive, onBack }: Props) {
  useThemeColor('--paper')
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
        <IconButton label="Zpět" onClick={onBack}>
          <IconBack />
        </IconButton>
        <h1 className="display settings-title">Nastavení</h1>

        <section className="section">
          <h2 className="caption">Hlas trenéra</h2>
          <div className="group" role="radiogroup" aria-label="Hlas trenéra">
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
                    <span>{v.note}</span>
                  </span>
                </button>
                <IconButton
                  tone="accent"
                  label={playing === v.id ? `Přehrávám ukázku: ${v.name}` : `Přehrát ukázku: ${v.name}`}
                  onClick={() => test(v)}
                >
                  {playing === v.id ? <IconSpeaker size={18} /> : <IconPlay size={16} />}
                </IconButton>
              </div>
            ))}
            <details className="disclosure">
              <summary>
                Nic neslyšíš?
                <IconChevron />
              </summary>
              <p>
                iPhone je asi v tichém režimu — vypni ho, nebo níž zapni „Hrát i v tichém režimu" (zastaví ale
                hudbu z telefonu).
              </p>
            </details>
          </div>
        </section>

        <section className="section">
          <h2 className="caption">Intenzita</h2>
          <Segmented label="Intenzita" value={config.intensity} options={INTENSITY_OPTIONS} onChange={(v) => setCfg('intensity', v)} />
        </section>

        <section className="section">
          <h2 className="caption">Úroveň</h2>
          <Segmented label="Úroveň" value={config.level} options={LEVEL_OPTIONS} onChange={(v) => setCfg('level', v)} />
        </section>

        <section className="section">
          <h2 className="caption">Kolo</h2>
          <div className="group">
            <Stepper label="Počet kol" value={config.rounds} limit={LIMITS.rounds} format={String} onChange={(v) => setCfg('rounds', v)} />
            <Stepper label="Délka kola" value={config.roundSec} limit={LIMITS.roundSec} format={formatSec} onChange={(v) => setCfg('roundSec', v)} />
            <Stepper label="Pauza mezi koly" value={config.restSec} limit={LIMITS.restSec} format={formatSec} onChange={(v) => setCfg('restSec', v)} />
            <Stepper
              label="Odpočet"
              value={settings.prepSec}
              limit={LIMITS.prepSec}
              format={(v) => `${v} s`}
              onChange={(v) => set('prepSec', v)}
            />
          </div>
          {planActive && <p className="settings-note">Plán má vlastní kola a tempo. Tohle platí pro trénink mimo plán.</p>}
        </section>

        <section className="section">
          <h2 className="caption">Přehrávání</h2>
          <div className="group">
            <SwitchRow label="Hrát i v tichém režimu" checked={settings.silentOverride} onChange={(v) => set('silentOverride', v)} />
            <SwitchRow label="Automatická pauza na pozadí" checked={settings.autoPause} onChange={(v) => set('autoPause', v)} />
          </div>
        </section>

        <section className="section">
          <div className="group single">
            <details className="disclosure">
              <summary>
                O aplikaci
                <IconChevron />
              </summary>
              <p>
                DIREKT {__APP_VERSION__} — trenér na boxovací pytel. Hlasy: ElevenLabs (Harry, Charlie, Adam) a Microsoft
                Antonín. Písmo: Archivo (OFL). Na plochu: Safari → Sdílet → Přidat na plochu.
              </p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}
