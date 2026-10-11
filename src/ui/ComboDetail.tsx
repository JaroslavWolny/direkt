import { clipsFor, previewClips } from '../audio/voice'
import { LEVEL_LABEL, type Combo } from '../data/combos'
import { comboTitle } from '../data/moves'
import type { VoiceId } from '../data/voices'
import type { Intensity } from '../engine/constants'
import { IconButton, Sheet, SwitchRow } from './controls'
import { comboSec, formatSec } from './format'
import { IconClose, IconPlay } from './icons'
import { PunchSequence } from './punch'

interface Props {
  combo: Combo
  enabled: boolean
  intensity: Intensity
  voice: VoiceId
  silentOverride: boolean
  onToggle: (on: boolean) => void
  onDelete?: () => void
  onClose: () => void
}

/** Detail komba (DOKUMENTACE.md 9.3): poslech, zařazení do tréninku, u vlastního smazání. */
export function ComboDetail({ combo, enabled, intensity, voice, silentOverride, onToggle, onDelete, onClose }: Props) {
  const name = combo.name ?? comboTitle(combo.moves)
  return (
    <Sheet label={name} onClose={onClose}>
      <div className="sheet-head">
        <h2 className="display-s">{name}</h2>
        <IconButton label="Zavřít" onClick={onClose}>
          <IconClose />
        </IconButton>
      </div>
      <PunchSequence moves={combo.moves} size="m" />
      <p className="label-15 muted">
        {LEVEL_LABEL[combo.level]} · {formatSec(comboSec(combo.moves, intensity, voice))} v kole
      </p>
      <div className="group">
        <div className="group-row tall">
          <span className="listen-row">
            <IconButton
              tone="accent"
              label="Poslechnout kombo"
              onClick={() => previewClips(voice, clipsFor(combo.moves), silentOverride)}
            >
              <IconPlay size={16} />
            </IconButton>
            Poslechnout
          </span>
        </div>
        <SwitchRow label="Zařadit do tréninku" checked={enabled} onChange={onToggle} />
      </div>
      {onDelete && (
        <button type="button" className="pill-btn big" onClick={onDelete}>
          Smazat kombo
        </button>
      )}
    </Sheet>
  )
}
