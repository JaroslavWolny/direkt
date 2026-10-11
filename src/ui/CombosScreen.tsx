import { useState } from 'react'
import { LEVEL_LABEL, LEVELS, type Combo, type Level } from '../data/combos'
import { comboTitle, isDefense, speechText } from '../data/moves'
import type { VoiceId } from '../data/voices'
import type { Intensity } from '../engine/constants'
import type { Library } from '../store/storage'
import { ComboDetail } from './ComboDetail'
import { IconButton } from './controls'
import { comboSec, formatSec } from './format'
import { IconBack, IconSearch } from './icons'
import { PunchSequence } from './punch'
import { useThemeColor } from './useThemeColor'

type Filter = 'vse' | Level | 'obrana'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'vse', label: 'Vše' },
  ...LEVELS.map((l) => ({ value: l, label: LEVEL_LABEL[l] })),
  { value: 'obrana', label: 'Obrana' },
]

const LEGEND =
  '1 jab · 2 cross · 3 hák · 4 zadní hák · 5 zvedák · 6 zadní zvedák · T na tělo · Ú úklon · Z záklon · P ponoř · K kryt · V vzad · ÚK úkrok'

const matchesFilter = (c: Combo, f: Filter) =>
  f === 'vse' ? true : f === 'obrana' ? c.moves.some(isDefense) : c.level === f

/** Hledá v názvu i v textu řeči („tři na tělo"), bez ohledu na diakritiku. */
const fold = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const matchesQuery = (c: Combo, q: string) =>
  !q.trim() || fold(`${c.name ?? comboTitle(c.moves)} ${c.moves.join(' ')} ${speechText(c.moves)}`).includes(fold(q.trim()))

interface Props {
  all: readonly Combo[]
  library: Library
  onLibrary: (l: Library) => void
  intensity: Intensity
  voice: VoiceId
  silentOverride: boolean
  onBack: () => void
}

/** Komba (DOKUMENTACE.md 9.3, Komba.html). */
export function CombosScreen({ all, library, onLibrary, intensity, voice, silentOverride, onBack }: Props) {
  useThemeColor('--paper')
  const [filter, setFilter] = useState<Filter>('vse')
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [detailId, setDetailId] = useState<string | null>(null)
  const disabled = new Set(library.disabled)
  const list = all.filter((c) => matchesFilter(c, filter) && matchesQuery(c, query))
  const detail = all.find((c) => c.id === detailId) ?? null

  const setEnabled = (id: string, on: boolean) =>
    onLibrary({
      ...library,
      disabled: on ? library.disabled.filter((x) => x !== id) : [...library.disabled, id],
    })

  return (
    <div className="screen">
      <header className="top-bar">
        <IconButton label="Zpět" onClick={onBack}>
          <IconBack />
        </IconButton>
        <IconButton
          label="Hledat kombo"
          onClick={() => {
            setSearching(!searching)
            setQuery('')
          }}
        >
          <IconSearch />
        </IconButton>
      </header>

      <div className="page-title">
        <h1 className="display">Komba</h1>
        <span className="count">{list.length}</span>
      </div>

      {searching && (
        <input
          className="search"
          name="search"
          autoFocus
          value={query}
          enterKeyHint="search"
          placeholder="Hledat (např. hák, 1 2 3)"
          aria-label="Hledat kombo"
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      <div className="filters" role="group" aria-label="Filtr">
        {FILTERS.map((f) => (
          <button key={f.value} type="button" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="scroll">
        <p className="legend">{LEGEND}</p>
        {list.map((c) => (
          <button
            key={c.id}
            type="button"
            className={disabled.has(c.id) ? 'list-row off' : 'list-row'}
            onClick={() => setDetailId(c.id)}
          >
            <span className="combo-row">
              <span className="row-body">
                <span className="name">{c.name ?? comboTitle(c.moves)}</span>
                <PunchSequence moves={c.moves} />
              </span>
              <span className="side">
                <span>{formatSec(comboSec(c.moves, intensity, voice))}</span>
                <span>{LEVEL_LABEL[c.level]}</span>
              </span>
            </span>
          </button>
        ))}
        {list.length === 0 && (
          <div className="empty">
            <strong>Nic nenalezeno.</strong>
            <span>Zkus jiný název nebo filtr.</span>
          </div>
        )}
      </div>

      {detail && (
        <ComboDetail
          combo={detail}
          enabled={!disabled.has(detail.id)}
          intensity={intensity}
          voice={voice}
          silentOverride={silentOverride}
          onToggle={(on) => setEnabled(detail.id, on)}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  )
}
