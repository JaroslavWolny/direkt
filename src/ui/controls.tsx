// Sdílené komponenty z předloh (design/ZADANI.md kap. 3).
import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import type { Limit } from '../engine/constants'
import { clampToLimit } from '../store/storage'
import { IconMinus, IconPlus } from './icons'

interface IconButtonProps {
  label: string
  /** paper (výchozí `fill`), on-accent, on-ink, accent, paper */
  tone?: 'on-accent' | 'on-ink' | 'accent' | 'paper'
  onClick: () => void
  children: ReactNode
}

export function IconButton({ label, tone, onClick, children }: IconButtonProps) {
  return (
    <button type="button" aria-label={label} className={tone ? `icon-btn ${tone}` : 'icon-btn'} onClick={onClick}>
      {children}
    </button>
  )
}

interface SegmentedProps<T extends number | string> {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (v: T) => void
}

export function Segmented<T extends number | string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

interface StepperProps {
  label: string
  value: number
  limit: Limit
  format: (v: number) => string
  onChange: (v: number) => void
}

/** [−] hodnota [+] na bílé kartě (Nastaveni.html). */
export function Stepper({ label, value, limit, format, onChange }: StepperProps) {
  const step = (dir: 1 | -1) => onChange(clampToLimit(value + dir * limit.step, limit, value))
  return (
    <div className="group-row">
      <span>{label}</span>
      <div className="stepper">
        <button
          type="button"
          className="icon-btn paper"
          aria-label={`${label}: méně`}
          disabled={value <= limit.min}
          onClick={() => step(-1)}
        >
          <IconMinus />
        </button>
        <output aria-live="polite">{format(value)}</output>
        <button
          type="button"
          className="icon-btn paper"
          aria-label={`${label}: více`}
          disabled={value >= limit.max}
          onClick={() => step(1)}
        >
          <IconPlus size={16} />
        </button>
      </div>
    </div>
  )
}

interface SwitchRowProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}

/** Celý řádek je přepínač (Nastaveni.html). */
export function SwitchRow({ label, checked, onChange }: SwitchRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="group-row switch-row"
      onClick={() => onChange(!checked)}
    >
      <span>{label}</span>
      <span className="switch" aria-checked={checked} aria-hidden="true">
        <span />
      </span>
    </button>
  )
}

interface SheetProps {
  label: string
  onClose: () => void
  children: ReactNode
}

/** Panel zespodu (detail komba, editory, nastavení tréninku). */
export function Sheet({ label, onClose, children }: SheetProps) {
  return (
    <div className="backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

interface ConfirmProps {
  title: string
  text: string
  confirm: string
  cancel: string
  onConfirm: () => void
  onCancel: () => void
}

/** Potvrzovací dialog („Ukončit trénink?"). */
export function ConfirmDialog({ title, text, confirm, cancel, onConfirm, onCancel }: ConfirmProps) {
  return (
    <div className="backdrop center" onClick={onCancel}>
      <div className="dialog" role="alertdialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h2 className="display-s">{title}</h2>
        <p>{text}</p>
        <div className="dialog-actions">
          <button type="button" className="pill-btn" onClick={onCancel}>
            {cancel}
          </button>
          <button type="button" className="pill-btn ink" onClick={onConfirm}>
            {confirm}
          </button>
        </div>
      </div>
    </div>
  )
}

const SWIPE_ACTION_PX = 96

interface SwipeRowProps {
  label: string
  onOpen: () => void
  onDelete: () => void
  children: ReactNode
}

/** Řádek seznamu: ťuk otevře, swipe doleva odkryje Smazat (kap. 9.4, 9.5). */
export function SwipeRow({ label, onOpen, onDelete, children }: SwipeRowProps) {
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef<{ x: number; y: number; base: number; moved: boolean; horizontal: boolean | null } | null>(
    null,
  )
  // Klik, který prohlížeč pošle hned po tahu, nesmí řádek zase zavřít nebo otevřít.
  const justDragged = useRef(false)

  const onPointerDown = (e: PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY, base: dx, moved: false, horizontal: null }
  }
  const onPointerMove = (e: PointerEvent) => {
    const s = start.current
    if (!s) return
    const mx = e.clientX - s.x
    const my = e.clientY - s.y
    if (s.horizontal === null && Math.hypot(mx, my) > 8) s.horizontal = Math.abs(mx) > Math.abs(my)
    if (!s.horizontal) return
    s.moved = true
    setDragging(true)
    setDx(Math.max(-SWIPE_ACTION_PX, Math.min(0, s.base + mx)))
  }
  const onPointerUp = () => {
    const s = start.current
    start.current = null
    setDragging(false)
    if (!s?.moved) return
    justDragged.current = true
    setTimeout(() => (justDragged.current = false), 0)
    setDx((v) => (v < -SWIPE_ACTION_PX / 2 ? -SWIPE_ACTION_PX : 0))
  }

  return (
    <div className="swipe">
      <button type="button" className="swipe-action" aria-label={`Smazat ${label}`} tabIndex={dx ? 0 : -1} onClick={onDelete}>
        Smazat
      </button>
      <button
        type="button"
        className={dragging ? 'swipe-content dragging' : 'swipe-content'}
        style={{ transform: `translateX(${dx}px)`, touchAction: 'pan-y' }}
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={() => {
          if (justDragged.current) return
          if (dx !== 0) setDx(0)
          else onOpen()
        }}
      >
        {children}
      </button>
    </div>
  )
}
