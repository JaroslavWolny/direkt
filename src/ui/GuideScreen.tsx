import { useState } from 'react'
import { GUIDE, type GuideItem, type GuideVideo } from '../data/guide'
import { speakMove } from '../data/moves'
import type { VoiceLang } from '../data/voices'
import { getLang, t } from '../i18n'
import { IconButton } from './controls'
import { formatSec } from './format'
import { IconArrow, IconBack, IconPlay } from './icons'
import { PunchSequence } from './punch'
import { useThemeColor } from './useThemeColor'

interface Props {
  /** Jazyk povelů — „Trenér řekne" ukazuje slovo, které opravdu uslyší (9.6). */
  voiceLang: VoiceLang
  onBack: () => void
}

/** Příručka úderů a obrany (DOKUMENTACE.md 9.11): seznam podle čísel a povelů, detail s videem. */
export function GuideScreen({ voiceLang, onBack }: Props) {
  useThemeColor('--paper')
  const s = t().guide
  const [open, setOpen] = useState<GuideItem | null>(null)
  if (open) return <GuideDetail item={open} voiceLang={voiceLang} onBack={() => setOpen(null)} />

  const lang = getLang()
  const groups = [
    { group: 'punch', label: s.punches },
    { group: 'defense', label: s.defense },
  ] as const

  return (
    <div className="screen">
      <i className="screen-edge" aria-hidden="true" />
      <div className="scroll">
        <header className="top-bar">
          <IconButton label={t().back} onClick={onBack}>
            <IconBack />
          </IconButton>
        </header>
        <h1 className="display plan-title">{s.title}</h1>
        <p className="plan-summary">{s.intro}</p>

        {groups.map(({ group, label }) => (
          <section key={group} className="guide-group">
            <h2 className="caption">{label}</h2>
            {GUIDE.filter((i) => i.group === group).map((i) => (
              <button key={i.move} type="button" className="list-row" onClick={() => setOpen(i)}>
                <span className="guide-row">
                  <PunchSequence moves={[i.move]} size="m" />
                  <span className="row-text">
                    <strong>{i.text[lang].title}</strong>
                    <span>{s.word(speakMove(i.move, voiceLang))}</span>
                  </span>
                  <IconArrow />
                </span>
              </button>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

interface DetailProps {
  item: GuideItem
  voiceLang: VoiceLang
  onBack: () => void
}

function GuideDetail({ item, voiceLang, onBack }: DetailProps) {
  const s = t().guide
  const text = item.text[getLang()]
  return (
    <div className="screen">
      <i className="screen-edge" aria-hidden="true" />
      <div className="scroll">
        <header className="top-bar">
          <IconButton label={t().back} onClick={onBack}>
            <IconBack />
          </IconButton>
        </header>
        <div className="guide-head">
          <PunchSequence moves={[item.move]} size="m" />
          <h1 className="display">{text.title}</h1>
        </div>
        <p className="guide-calls">{s.calls(speakMove(item.move, voiceLang))}</p>

        <Video video={item.video} title={text.title} />

        <p className="guide-summary">{text.summary}</p>
        <h2 className="caption guide-caption">{s.how}</h2>
        <ul className="guide-list">
          {text.how.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h2 className="caption guide-caption">{s.mistakes}</h2>
        <ul className="guide-list">
          {text.mistakes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="guide-source">{s.source(item.video.coach)}</p>
      </div>
    </div>
  )
}

/** Do ťuknutí se z YouTube nic nenačítá; pak přehrávač youtube-nocookie od místa ukázky (9.11). */
function Video({ video, title }: { video: GuideVideo; title: string }) {
  const s = t().guide
  const [playing, setPlaying] = useState(false)

  if (playing) {
    const src =
      `https://www.youtube-nocookie.com/embed/${video.id}` +
      `?start=${video.start}&autoplay=1&playsinline=1&rel=0&hl=${getLang()}`
    return (
      <div className="guide-video">
        <iframe
          src={src}
          title={s.videoTitle(title)}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    )
  }

  const offline = !navigator.onLine
  return (
    <button
      type="button"
      className="guide-video"
      disabled={offline}
      aria-label={s.play(title)}
      onClick={() => setPlaying(true)}
    >
      {offline ? (
        <span className="guide-offline">{s.offline}</span>
      ) : (
        <span className="guide-play">
          <IconPlay size={24} />
        </span>
      )}
      <span className="guide-video-meta">
        <span>
          {s.demo} · {video.coach}
        </span>
        {video.start > 0 && <span>{s.from(formatSec(video.start))}</span>}
      </span>
    </button>
  )
}
