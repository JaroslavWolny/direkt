// Hlasy trenéra (DOKUMENTACE.md kap. 8) — sady klipů v public/voice/<id>/.

export type VoiceId = 'harry' | 'charlie' | 'adam' | 'antonin'
export type VoiceLang = 'cs' | 'en'

export interface VoiceInfo {
  id: VoiceId
  name: string
  lang: VoiceLang
}

export const VOICES: readonly VoiceInfo[] = [
  { id: 'harry', name: 'Harry', lang: 'en' },
  { id: 'charlie', name: 'Charlie', lang: 'en' },
  { id: 'adam', name: 'Adam', lang: 'en' },
  { id: 'antonin', name: 'Antonín', lang: 'cs' },
]

export const DEFAULT_VOICE: VoiceId = 'harry'

export const isVoiceId = (x: unknown): x is VoiceId => VOICES.some((v) => v.id === x)

export const voiceLang = (id: VoiceId): VoiceLang => VOICES.find((v) => v.id === id)?.lang ?? 'en'
