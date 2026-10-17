import { clipsFor, previewClips } from '../audio/voice'
import type { Combo } from '../data/combos'
import { comboTitle } from '../data/moves'
import type { VoiceId } from '../data/voices'
import type { Pace } from '../engine/timing'
import { getLang, t } from '../i18n'
import { IconButton, Sheet, SwitchRow } from './controls'
import { comboSec, formatSec } from './format'
import { IconClose, IconPlay } from './icons'
import { PunchSequence } from './punch'

interface Props {
  combo: Combo
  enabled: boolean
  voice: VoiceId
  pace: Pace
  silentOverride: boolean
  onToggle: (on: boolean) => void
  onDelete?: () => void
  onClose: () => void
}

/** Detail komba (DOKUMENTACE.md 9.3): poslech, zařazení do tréninku, u vlastního smazání. */
export function ComboDetail({ combo, enabled, voice, pace, silentOverride, onToggle, onDelete, onClose }: Props) {
  const s = t().combos
  const name = combo.name ?? comboTitle(combo.moves, getLang())
  return (
    <Sheet label={name} onClose={onClose}>
      <div className="sheet-head">
        <h2 className="display-s">{name}</h2>
        <IconButton label={t().close} onClick={onClose}>
          <IconClose />
        </IconButton>
      </div>
      <PunchSequence moves={combo.moves} size="m" />
      <p className="label-15 muted">
        {t().level[combo.level]} · {s.inRound(formatSec(comboSec(combo.moves, voice, pace)))}
      </p>
      <div className="group">
        <div className="group-row tall">
          <span className="listen-row">
            <IconButton
              tone="accent"
              label={s.listenAria}
              onClick={() => previewClips(voice, clipsFor(combo.moves), silentOverride)}
            >
              <IconPlay size={16} />
            </IconButton>
            {s.listen}
          </span>
        </div>
        <SwitchRow label={s.include} checked={enabled} onChange={onToggle} />
      </div>
      {onDelete && (
        <button type="button" className="pill-btn big" onClick={onDelete}>
          {s.delete}
        </button>
      )}
    </Sheet>
  )
}
