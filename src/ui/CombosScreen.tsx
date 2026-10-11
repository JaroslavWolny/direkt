import { useState } from 'react'
import { LEVELS, type Combo, type Level } from '../data/combos'
import { comboTitle, isDefense, speechText } from '../data/moves'
import type { VoiceId } from '../data/voices'
import type { Intensity } from '../engine/constants'
import { getLang, t } from '../i18n'
import type { Library } from '../store/storage'
import { ComboDetail } from './ComboDetail'
import { IconButton } from './controls'
import { comboSec, formatSec } from './format'
import { IconBack, IconSearch } from './icons'
import { PunchSequence } from './punch'
import { useThemeColor } from './useThemeColor'

type Filter = 'vse' | Level | 'obrana'

const matchesFilter = (c: Combo, f: Filter) =>
  f === 'vse' ? true : f === 'obrana' ? c.moves.some(isDefense) : c.level === f

/** Hledá v názvu i v textu řeči („tři na tělo"), v jazyce rozhraní, bez ohledu na diakritiku. */
const fold = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const matchesQuery = (c: Combo, q: string) => {
  const lang = getLang()
  return !q.trim() || fold(`${c.name ?? comboTitle(c.moves, lang)} ${c.moves.join(' ')} ${speechText(c.moves, lang)}`).includes(fold(q.trim()))
}

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
  const s = t().combos
  const filters: { value: Filter; label: string }[] = [
    { value: 'vse', label: s.all },
    ...LEVELS.map((l) => ({ value: l, label: t().level[l] })),
    { value: 'obrana', label: s.defense },
  ]
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
      <i className="screen-edge" aria-hidden="true" />
      <header className="top-bar">
        <IconButton label={t().back} onClick={onBack}>
          <IconBack />
        </IconButton>
        <IconButton
          label={s.search}
          onClick={() => {
            setSearching(!searching)
            setQuery('')
          }}
        >
          <IconSearch />
        </IconButton>
      </header>

      <div className="page-title">
        <h1 className="display">{s.title}</h1>
        <span className="count">{list.length}</span>
      </div>

      {searching && (
        <input
          className="search"
          name="search"
          autoFocus
          value={query}
          enterKeyHint="search"
          placeholder={s.placeholder}
          aria-label={s.search}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      <div className="filters" role="group" aria-label={s.filter}>
        {filters.map((f) => (
          <button key={f.value} type="button" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="scroll under-header">
        <p className="legend">{s.legend}</p>
        {list.map((c) => (
          <button
            key={c.id}
            type="button"
            className={disabled.has(c.id) ? 'list-row off' : 'list-row'}
            onClick={() => setDetailId(c.id)}
          >
            <span className="combo-row">
              <span className="row-body">
                <span className="name">{c.name ?? comboTitle(c.moves, getLang())}</span>
                <PunchSequence moves={c.moves} />
              </span>
              <span className="side">
                <span>{formatSec(comboSec(c.moves, intensity, voice))}</span>
                <span>{t().level[c.level]}</span>
              </span>
            </span>
          </button>
        ))}
        {list.length === 0 && (
          <div className="empty">
            <strong>{s.noneTitle}</strong>
            <span>{s.noneText}</span>
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
