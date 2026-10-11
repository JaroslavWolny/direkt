// Syntetizované zvuky — žádné zvukové soubory (DOKUMENTACE.md kap. 8).
import { getContext, output } from './context'

let noise: AudioBuffer | null = null

function noiseBuffer(c: AudioContext): AudioBuffer {
  if (!noise || noise.sampleRate !== c.sampleRate) {
    const len = Math.floor(c.sampleRate * 0.25)
    noise = c.createBuffer(1, len, c.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  }
  return noise
}

function noiseBurst(c: AudioContext, t: number, freq: number, q: number, level: number, decayS: number): void {
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c)
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = freq
  filter.Q.value = q
  const gain = c.createGain()
  gain.gain.setValueAtTime(level, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + decayS)
  src.connect(filter).connect(gain).connect(output())
  src.start(t)
  src.stop(t + decayS + 0.01)
}

// Gong: nesouladné sinusové složky, vyšší doznívají rychleji.
const BELL_F0 = 830
const BELL_DECAY_S = 1.6
const BELL_PARTIALS: readonly (readonly [ratio: number, amp: number])[] = [
  [1, 1],
  [2.32, 0.55],
  [4.25, 0.32],
  [6.63, 0.18],
]

function strike(c: AudioContext, t: number): void {
  const bus = c.createGain()
  bus.gain.value = 0.42
  bus.connect(output())
  for (const [ratio, amp] of BELL_PARTIALS) {
    const decay = BELL_DECAY_S / Math.sqrt(ratio)
    const osc = c.createOscillator()
    osc.frequency.value = BELL_F0 * ratio
    const gain = c.createGain()
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(amp, t + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + decay)
    osc.connect(gain).connect(bus)
    osc.start(t)
    osc.stop(t + decay + 0.05)
  }
  noiseBurst(c, t, 3200, 0.8, 0.5, 0.04) // úder paličky
}

/** Gong: 1× začátek kola, 3× konec. */
export function bell(times: number): void {
  const c = getContext()
  const t0 = c.currentTime + 0.02
  for (let i = 0; i < times; i++) strike(c, t0 + i * 0.42)
}

/** Klepnutí jako klapačka v gymu — 10 s do konce kola. */
export function clap(times = 2): void {
  const c = getContext()
  const t0 = c.currentTime + 0.02
  for (let i = 0; i < times; i++) noiseBurst(c, t0 + i * 0.16, 2000, 1.2, 1, 0.06)
}

/** Krátké pípnutí odpočtu (nikdy se nevyslovuje číslem — R13). */
export function beep(): void {
  const c = getContext()
  const t = c.currentTime + 0.01
  const osc = c.createOscillator()
  osc.frequency.value = 880
  const gain = c.createGain()
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.35, t + 0.01)
  gain.gain.setValueAtTime(0.35, t + 0.1)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
  osc.connect(gain).connect(output())
  osc.start(t)
  osc.stop(t + 0.13)
}
