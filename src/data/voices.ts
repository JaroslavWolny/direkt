// Hlasy trenéra (DOKUMENTACE.md kap. 8) — sady klipů v public/voice/<id>/.

export type VoiceId = 'harry' | 'charlie' | 'adam' | 'antonin'
export type VoiceLang = 'cs' | 'en'

export interface VoiceInfo {
  id: VoiceId
  name: string
  lang: VoiceLang
  note: string
}

export const VOICES: readonly VoiceInfo[] = [
  { id: 'harry', name: 'Harry', lang: 'en', note: 'Angličtina · bojovník' },
  { id: 'charlie', name: 'Charlie', lang: 'en', note: 'Angličtina · nabuzený' },
  { id: 'adam', name: 'Adam', lang: 'en', note: 'Angličtina · dominantní' },
  { id: 'antonin', name: 'Antonín', lang: 'cs', note: 'Čeština · klidný' },
]

export const DEFAULT_VOICE: VoiceId = 'harry'

export const isVoiceId = (x: unknown): x is VoiceId => VOICES.some((v) => v.id === x)

export const voiceLang = (id: VoiceId): VoiceLang => VOICES.find((v) => v.id === id)?.lang ?? 'en'
