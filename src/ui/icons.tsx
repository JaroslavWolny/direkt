// Ikony převzaté z předloh (design/predlohy) — tah 1,75–2 px, barva = currentColor.
import type { ReactNode } from 'react'

interface IconProps {
  size?: number
}

function Stroke({ size, width, children }: { size: number; width: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function Filled({ size, children }: { size: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {children}
    </svg>
  )
}

export function IconSliders({ size = 20 }: IconProps) {
  return (
    <Stroke size={size} width={1.75}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </Stroke>
  )
}

export function IconBack({ size = 20 }: IconProps) {
  return (
    <Stroke size={size} width={1.75}>
      <path d="M15 5l-7 7 7 7" />
    </Stroke>
  )
}

export function IconSearch({ size = 20 }: IconProps) {
  return (
    <Stroke size={size} width={1.75}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
    </Stroke>
  )
}

export function IconArrow({ size = 18 }: IconProps) {
  return (
    <Stroke size={size} width={1.75}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Stroke>
  )
}

export function IconChevron({ size = 18 }: IconProps) {
  return (
    <Stroke size={size} width={1.75}>
      <path d="M9 6l6 6-6 6" />
    </Stroke>
  )
}

export function IconClose({ size = 18 }: IconProps) {
  return (
    <Stroke size={size} width={2}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Stroke>
  )
}

export function IconPlus({ size = 20 }: IconProps) {
  return (
    <Stroke size={size} width={2}>
      <path d="M12 5v14M5 12h14" />
    </Stroke>
  )
}

export function IconMinus({ size = 16 }: IconProps) {
  return (
    <Stroke size={size} width={2}>
      <path d="M5 12h14" />
    </Stroke>
  )
}

export function IconSpeaker({ size = 20 }: IconProps) {
  return (
    <Stroke size={size} width={1.75}>
      <path d="M4 9h4l5-4v14l-5-4H4z" />
      <path d="M17 9a4 4 0 010 6M19.5 6.5a7.5 7.5 0 010 11" />
    </Stroke>
  )
}

export function IconNext({ size = 20 }: IconProps) {
  return (
    <Stroke size={size} width={2}>
      <path d="M6 5v14l9-7z" fill="currentColor" />
      <path d="M18 5v14" />
    </Stroke>
  )
}

export function IconPlay({ size = 20 }: IconProps) {
  return (
    <Filled size={size}>
      <path d="M8 5v14l11-7z" />
    </Filled>
  )
}

export function IconPause({ size = 28 }: IconProps) {
  return (
    <Filled size={size}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </Filled>
  )
}

export function IconStop({ size = 16 }: IconProps) {
  return (
    <Filled size={size}>
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </Filled>
  )
}
