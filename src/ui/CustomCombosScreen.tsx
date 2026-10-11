import { useState } from 'react'
import type { Combo } from '../data/combos'
import type { VoiceId } from '../data/voices'
import type { Intensity } from '../engine/constants'
import type { Library } from '../store/storage'
import { ComboBuilder } from './ComboBuilder'
import { ComboDetail } from './ComboDetail'
import { IconButton, SwipeRow } from './controls'
import { comboSec, formatSec } from './format'
import { IconBack, IconPlus } from './icons'
import { PunchSequence } from './punch'
import { useThemeColor } from './useThemeColor'

interface Props {
  all: readonly Combo[]
  library: Library
  onLibrary: (l: Library) => void
  intensity: Intensity
  voice: VoiceId
  silentOverride: boolean
  onBack: () => void
}

/** Vlastní komba (DOKUMENTACE.md 9.4, VlastniKomba.html). */
export function CustomCombosScreen({ all, library, onLibrary, intensity, voice, silentOverride, onBack }: Props) {
  useThemeColor('--paper')
  const [building, setBuilding] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const disabled = new Set(library.disabled)
  const custom = library.custom
  const detail = custom.find((c) => c.id === detailId) ?? null

  const setEnabled = (id: string, on: boolean) =>
    onLibrary({
      ...library,
      disabled: on ? library.disabled.filter((x) => x !== id) : [...library.disabled, id],
    })

  const remove = (id: string) => {
    onLibrary({
      disabled: library.disabled.filter((x) => x !== id),
      custom: library.custom.filter((c) => c.id !== id),
    })
    setDetailId(null)
  }

  return (
    <div className="screen">
      <i className="screen-edge" aria-hidden="true" />
      <header className="top-bar">
        <IconButton label="Zpět" onClick={onBack}>
          <IconBack />
        </IconButton>
        <IconButton label="Sestavit kombo" onClick={() => setBuilding(true)}>
          <IconPlus />
        </IconButton>
      </header>

      <h1 className="display title-2">
        Vlastní
        <br />
        komba<span className="count">{custom.length}</span>
      </h1>

      <div className="list-scroll">
        {custom.length === 0 ? (
          <div className="empty">
            <strong>Zatím žádné kombo.</strong>
            <span>Sestav první.</span>
          </div>
        ) : (
          custom.map((c) => (
            <SwipeRow key={c.id} label={c.name ?? 'Vlastní kombo'} onOpen={() => setDetailId(c.id)} onDelete={() => remove(c.id)}>
              <span className={disabled.has(c.id) ? 'custom-row off' : 'custom-row'}>
                <span className="row-body">
                  <span className="head">
                    <span className="name">{c.name ?? 'Vlastní kombo'}</span>
                    <span className="time">{formatSec(comboSec(c.moves, intensity, voice))}</span>
                  </span>
                  <PunchSequence moves={c.moves} size="m" />
                </span>
              </span>
            </SwipeRow>
          ))
        )}
      </div>

      {building && (
        <ComboBuilder
          existing={all}
          defaultName={`Moje ${custom.length + 1}`}
          onSave={(combo) => {
            onLibrary({ ...library, custom: [...library.custom, combo] })
            setBuilding(false)
          }}
          onCancel={() => setBuilding(false)}
        />
      )}

      {detail && (
        <ComboDetail
          combo={detail}
          enabled={!disabled.has(detail.id)}
          intensity={intensity}
          voice={voice}
          silentOverride={silentOverride}
          onToggle={(on) => setEnabled(detail.id, on)}
          onDelete={() => remove(detail.id)}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  )
}
