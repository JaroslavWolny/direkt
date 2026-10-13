// Obrázek výsledku z Hotovo do IG story (DOKUMENTACE.md 9.10, R15, R16).
import { getLang, t } from '../i18n'
import { formatSec } from './format'

export interface ShareStats {
  rounds: number
  /** Čas v kolech (9.2). */
  boxedMs: number
  combos: number
  punches: number
  /** Název tréninku v jazyce rozhraní. */
  name: string
}

const W = 1080
const H = 1920
/** Okraj mřížky. */
const M = 80
/** Bezpečná zóna story: nahoře profil, dole odpověď (kap. 15). */
const SAFE_TOP = 250
/** Účaří posledního popisku v kolonách. */
const BOTTOM = 1440
/** Účaří adresy v patičce — těsně nad dolní hranou bezpečné zóny (1580). */
const FOOTER = 1562
const ICON = 72
/** Mezera mezi kolonami. */
const GAP = 56
/** Odstup mezi čárou, kolonami a řádkem údajů. */
const SECTION_GAP = 72
/** Čísla údajů a odstup popisku pod nimi. */
const STAT = 96
const LABEL_GAP = 26
/** O kolik nejširší číslice přetéká pravý okraj — schválně, jako na Hotovo. */
const BLEED = 0.07

/** Statické řezy Archiva — šířku proměnného písma canvas ve WebKitu neumí (R15). */
const WIDE = 'DIREKT Archivo 125 900'
const TEXT = 'DIREKT Archivo 500'
// stejné rozsahy jako @font-face v index.css
const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, ' +
  'U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
const LATIN_EXT =
  'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, ' +
  'U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF'

let fonts: Promise<void> | null = null

/** Řezy se načtou jednou. Když selžou, kreslí se náhradním písmem a příště se zkusí znovu. */
function loadFonts(): Promise<void> {
  fonts ??= Promise.all(
    (
      [
        [WIDE, 'x900'],
        [TEXT, '500'],
      ] as const
    ).flatMap(([family, cut]) =>
      (
        [
          ['latin', LATIN],
          ['latin-ext', LATIN_EXT],
        ] as const
      ).map(([subset, unicodeRange]) => {
        const face = new FontFace(family, `url(/fonts/archivo-share-${cut}-${subset}.woff2) format('woff2')`, {
          unicodeRange,
        })
        document.fonts.add(face)
        return face.load()
      }),
    ),
  ).then(
    () => undefined,
    () => {
      fonts = null
    },
  )
  return fonts
}

type Ctx = CanvasRenderingContext2D

/** Písmo nastavené přes setFont — podle něj se měří kresba (inkSpan). */
let current = { family: '', size: 0 }

const setFont = (ctx: Ctx, family: string, size: number): void => {
  current = { family, size }
  ctx.font = `${size}px "${family}"`
}

const PROBE = 200
const spans = new Map<string, { left: number; right: number }>()

/**
 * Kde kresba textu začíná a končí vůči počátku, v násobcích velikosti písma. Měří se pixely na
 * zkušebním plátně: WebKit vrací actualBoundingBoxLeft 0, i když kresba začíná až za počátkem (R17).
 */
function inkSpan(family: string, text: string): { left: number; right: number } {
  const key = `${family}|${text}`
  const known = spans.get(key)
  if (known) return known
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('canvas 2d')
  const pad = PROBE / 2
  ctx.font = `${PROBE}px "${family}"`
  canvas.width = Math.ceil(ctx.measureText(text).width + 2 * pad)
  canvas.height = 2 * PROBE
  ctx.font = `${PROBE}px "${family}"` // změna rozměru plátno vynuluje
  ctx.fillText(text, pad, 1.5 * PROBE)
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const filled = (x: number): boolean => {
    for (let y = 0; y < height; y++) if (data[(y * width + x) * 4 + 3] > 0) return true
    return false
  }
  let left = 0
  while (left < width && !filled(left)) left++
  let right = width - 1
  while (right > left && !filled(right)) right--
  const span = left < width ? { left: (left - pad) / PROBE, right: (right + 1 - pad) / PROBE } : { left: 0, right: 0 }
  spans.set(key, span)
  return span
}

/** Šířka kresby textu v aktuálním písmu. */
const inkWidth = (text: string): number => {
  const { left, right } = inkSpan(current.family, text)
  return (right - left) * current.size
}

/** Největší velikost do `max`, při které se text vejde do šířky; nastaví ji. */
function fit(ctx: Ctx, family: string, text: string, max: number, width: number): void {
  setFont(ctx, family, max)
  const w = ctx.measureText(text).width
  if (w > width) setFont(ctx, family, Math.floor((max * width) / w))
}

/** Výška verzálek — řádky se sází podle ní, ať je diakritika nerozhodí. */
const capHeight = (ctx: Ctx): number => ctx.measureText('H').actualBoundingBoxAscent

/** Kresba textu začne přesně na x, verzálky nahoře na y. Vrací účaří. */
function ink(ctx: Ctx, text: string, x: number, top: number): number {
  const base = top + capHeight(ctx)
  ctx.fillText(text, x - inkSpan(current.family, text).left * current.size, base)
  return base
}

/** Šířka kresby nejširší číslice — velikost čísla pak nezávisí na tom, která to je (jako na Hotovo). */
const widestDigit = (): number => Math.max(...'0123456789'.split('').map(inkWidth))

/** Ikona appky (design/ikona/icon.svg, plátno 1024) se zaoblením jako na ploše iPhonu. */
function drawIcon(ctx: Ctx, x: number, y: number, size: number, color: (token: string) => string): void {
  const k = size / 1024
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(k, k)
  ctx.beginPath()
  ctx.roundRect(0, 0, 1024, 1024, 16 / k)
  ctx.clip()
  ctx.fillStyle = color('--accent')
  ctx.fillRect(0, 0, 1024, 1024)
  ctx.fillStyle = color('--white')
  ctx.fillRect(612, 0, 160, 770)
  ctx.fillStyle = color('--accent')
  ctx.beginPath()
  ctx.arc(446, 574, 222, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = color('--ink')
  ctx.beginPath()
  ctx.arc(446, 574, 196, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function draw(ctx: Ctx, s: ShareStats, date: Date): void {
  const css = getComputedStyle(document.documentElement)
  const color = (token: string): string => css.getPropertyValue(token).trim()
  const lang = getLang()
  const up = (x: string): string => x.toLocaleUpperCase(lang)
  const str = t()

  ctx.fillStyle = color('--paper')
  ctx.fillRect(0, 0, W, H)

  // Hlavička: ikona + DIREKT, vpravo datum.
  drawIcon(ctx, M, SAFE_TOP, ICON, color)
  const mid = SAFE_TOP + ICON / 2
  ctx.fillStyle = color('--ink')
  setFont(ctx, WIDE, 40)
  ctx.fillText('DIREKT', M + ICON + 24, mid + capHeight(ctx) / 2)
  ctx.fillStyle = color('--muted')
  setFont(ctx, TEXT, 30)
  ctx.textAlign = 'right'
  ctx.fillText(str.share.date(date), W - M, mid + capHeight(ctx) / 2)
  ctx.textAlign = 'left'

  // HOTOVO. + název tréninku
  ctx.fillStyle = color('--ink')
  const title = up(str.share.title)
  fit(ctx, WIDE, title, 170, W - 2 * M)
  const titleBase = ink(ctx, title, M, SAFE_TOP + ICON + 80)
  ctx.fillStyle = color('--muted')
  fit(ctx, TEXT, s.name, 40, W - 2 * M)
  const metaBase = ink(ctx, s.name, M, titleBase + 44)
  const lineY = metaBase + 56
  ctx.fillStyle = color('--hairline')
  ctx.fillRect(M, lineY, W - 2 * M, 2)
  const top = lineY + SECTION_GAP

  // Patička: čára a adresa appky — kdo story uvidí, ví, kde ji najít.
  setFont(ctx, TEXT, 30)
  const footerTop = FOOTER - capHeight(ctx)
  ctx.fillRect(M, footerTop - 44, W - 2 * M, 2)
  ctx.fillStyle = color('--ink')
  ctx.fillText(location.host, M, FOOTER)

  // Údaj = číslo + popisek pod ním. Všechna tři čísla mají stejnou velikost — tu, při které
  // se nejdelší vejde do kolony; sedí na stejném účaří.
  setFont(ctx, TEXT, 30)
  const labelCap = capHeight(ctx)
  setFont(ctx, WIDE, STAT)
  const statCap = capHeight(ctx)
  const statH = statCap + LABEL_GAP + labelCap
  const stats: [string, string][] = [
    [formatSec(s.boxedMs / 1000), str.share.boxed],
    [String(s.combos), str.combosWord(s.combos)],
    [String(s.punches), str.punchesWord(s.punches)],
  ]
  const drawStats = (x: (i: number) => number, y: (i: number) => number, width: number): void => {
    setFont(ctx, WIDE, STAT)
    const widest = Math.max(...stats.map(([value]) => ctx.measureText(value).width))
    const size = widest > width ? Math.floor((STAT * width) / widest) : STAT
    stats.forEach(([value, label], i) => {
      ctx.fillStyle = color('--ink')
      setFont(ctx, WIDE, size)
      const base = ink(ctx, value, x(i), y(i) + statCap - capHeight(ctx))
      ctx.fillStyle = color('--muted')
      setFont(ctx, TEXT, 30)
      ink(ctx, up(label), x(i), base + LABEL_GAP)
    })
  }

  // Obří počet kol v akcentu, nahoře zarovnaný s údaji, popisek pod ním.
  const digits = String(s.rounds)
  setFont(ctx, WIDE, 1000)
  const capPer1000 = capHeight(ctx)
  const sizeFor = (height: number): number => Math.floor((1000 * height) / capPer1000)
  const rounds = (x: number, size: number): void => {
    setFont(ctx, WIDE, size)
    ctx.fillStyle = color('--accent')
    const base = ink(ctx, digits, x, top)
    ctx.fillStyle = color('--muted')
    setFont(ctx, TEXT, 30)
    ink(ctx, up(str.roundsWord(s.rounds)), x, base + LABEL_GAP)
  }

  if (digits.length === 1) {
    // Vpravo číslo až k BOTTOM; nejširší číslice přetéká pravý okraj o BLEED, jako na Hotovo.
    const size = sizeFor(BOTTOM - labelCap - LABEL_GAP - top)
    setFont(ctx, WIDE, size)
    const x = W - widestDigit() * (1 - BLEED)
    rounds(x, size)
    // Vlevo tři údaje pod sebou mezi `top` a BOTTOM.
    const step = (BOTTOM - statH - top) / (stats.length - 1)
    drawStats(
      () => M,
      (i) => top + i * step,
      x - GAP - M,
    )
  } else {
    // 10–12 kol by se do kolony vešlo jen malé → číslo přes celou šířku, údaje pod ním v řádku.
    const statsTop = BOTTOM - statH
    let size = sizeFor(statsTop - SECTION_GAP - labelCap - LABEL_GAP - top)
    setFont(ctx, WIDE, size)
    const width = inkWidth(digits)
    const maxWidth = (W - M) / (1 - BLEED)
    if (width > maxWidth) size = Math.floor((size * maxWidth) / width)
    rounds(M, size)
    const colW = (W - 2 * M) / stats.length
    drawStats(
      (i) => M + i * colW,
      () => statsTop,
      colW - GAP,
    )
  }
}

/** Vyrobí obrázek 1080 × 1920 (PNG) — volat hned po zobrazení Hotovo, ne až v ťuknutí (R16). */
export async function shareCardFile(stats: ShareStats, date = new Date()): Promise<File> {
  await loadFonts()
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d')
  draw(ctx, stats, date)
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/png'),
  )
  return new File([blob], t().share.file, { type: 'image/png' })
}

function download(file: File): void {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

/**
 * Volat přímo v ťuknutí: list sdílení dostane jen soubor (adresa je v obrázku).
 * Výsledek se ignoruje — iOS po „Uložit obrázek" slib někdy nevyřeší (R16). Bez Web Share stažení.
 */
export async function shareFile(file: File): Promise<void> {
  if (!navigator.canShare?.({ files: [file] })) {
    download(file)
    return
  }
  try {
    await navigator.share({ files: [file] })
  } catch (e) {
    if (!(e instanceof DOMException && e.name === 'AbortError')) download(file)
  }
}
