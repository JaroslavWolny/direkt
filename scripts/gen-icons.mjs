// Generuje PWA ikony bez závislostí: vlastní PNG encoder + vektorové vykreslení ikony uživatele
// (design/ikona/icon.svg — abstraktní „d": bílá nožička shora, černý kruh s akcentovou mezerou).
// Spuštění: node scripts/gen-icons.mjs
import { deflateSync } from 'node:zlib'
import { copyFileSync, writeFileSync } from 'node:fs'

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

const encodePng = (size, rgb) => {
  const raw = Buffer.alloc((size * 3 + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0 // filter: none
    rgb.copy(raw, y * (size * 3 + 1) + 1, y * size * 3, (y + 1) * size * 3)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // truecolor, bez průhlednosti (iOS ikony musí být neprůhledné)
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// Barvy z tokenů (src/index.css).
const ACCENT = [0x2c, 0x3b, 0xff]
const WHITE = [0xff, 0xff, 0xff]
const INK = [0x11, 0x11, 0x11]

// Geometrie v jednotkách 1024 × 1024 přesně podle icon.svg.
const FULL = { stem: [612, 0, 772, 770], cx: 446, cy: 574, gap: 222, dot: 196 }
// Maskable: totéž zmenšené na ~61 % do bezpečné zóny jako adaptive-icon.png; nožička dál
// vybíhá z horního okraje.
const SAFE = 0.612
const MASKABLE = {
  stem: [470 + (612 - 446) * SAFE, 0, 470 + (772 - 446) * SAFE, 550 + (770 - 574) * SAFE],
  cx: 470,
  cy: 550,
  gap: 222 * SAFE,
  dot: 196 * SAFE,
}

const shade = (g, x, y) => {
  const d = Math.hypot(x - g.cx, y - g.cy)
  if (d <= g.dot) return INK
  if (d <= g.gap) return ACCENT
  const [x0, y0, x1, y1] = g.stem
  return x >= x0 && x <= x1 && y >= y0 && y <= y1 ? WHITE : ACCENT
}

const SS = 4 // supersampling kvůli hladkým hranám

function render(size, g) {
  const out = Buffer.alloc(size * size * 3)
  const k = 1024 / (size * SS)
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0
      let gr = 0
      let b = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const c = shade(g, (px * SS + sx + 0.5) * k, (py * SS + sy + 0.5) * k)
          r += c[0]
          gr += c[1]
          b += c[2]
        }
      }
      const i = (py * size + px) * 3
      out[i] = Math.round(r / (SS * SS))
      out[i + 1] = Math.round(gr / (SS * SS))
      out[i + 2] = Math.round(b / (SS * SS))
    }
  }
  return encodePng(size, out)
}

const targets = [
  ['public/pwa-192.png', 192, FULL],
  ['public/pwa-512.png', 512, FULL],
  ['public/apple-touch-icon.png', 180, FULL],
  ['public/maskable-512.png', 512, MASKABLE],
]
for (const [file, size, g] of targets) {
  writeFileSync(file, render(size, g))
  console.log(file, size)
}

copyFileSync('design/ikona/icon.svg', 'public/favicon.svg')
console.log('public/favicon.svg')
