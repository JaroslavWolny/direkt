// Render promo videa (DOKUMENTACE.md 15.1): statický server → headless Chrome přes DevTools
// protokol → PNG snímky + WAV z OfflineAudioContext → ffmpeg (loudnorm −14 LUFS, x264).
//
//   node --experimental-websocket marketing/video/render.mjs            # vyrenderuje MP4
//   node --experimental-websocket marketing/video/render.mjs --serve    # jen server pro náhled
//   … --out cesta.mp4                                                   # jiný výstup
import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { homedir, tmpdir } from 'node:os'
import { dirname, extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const PORT = 4319
const DEBUG_PORT = 9339
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const arg = (name) => {
  const i = process.argv.indexOf(name)
  return i > 0 ? process.argv[i + 1] : undefined
}
const OUT = resolve(arg('--out') ?? join(homedir(), 'Desktop/DIREKT-marketing/DIREKT-story-promo.mp4'))
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
}

// Kořen repa; /fonts/ → public/fonts (cesty, které používá src/index.css).
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const file = resolve(ROOT, '.' + (path.startsWith('/fonts/') ? `/public${path}` : path))
  let ok = file.startsWith(ROOT + sep)
  try {
    ok &&= statSync(file).isFile()
  } catch {
    ok = false
  }
  if (!ok) return res.writeHead(404).end()
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' })
  res.end(readFileSync(file))
}).listen(PORT, '127.0.0.1')

const PAGE = `http://127.0.0.1:${PORT}/marketing/video/promo.html`
if (process.argv.includes('--serve')) {
  console.log(`Náhled: ${PAGE}?play  (jeden okamžik: ?t=5.4)`)
} else {
  if (typeof WebSocket === 'undefined') throw new Error('Spusť přes: node --experimental-websocket …')
  await render().finally(() => server.close())
}

async function render() {
  const profile = mkdtempSync(join(tmpdir(), 'direkt-chrome-'))
  const work = mkdtempSync(join(tmpdir(), 'direkt-promo-'))
  const chrome = spawn(
    CHROME,
    ['--headless=new', `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profile}`, '--no-first-run',
      '--no-default-browser-check', '--hide-scrollbars', '--mute-audio', 'about:blank'],
    { stdio: 'ignore' },
  )
  try {
    const cdp = await connect()
    await cdp.send('Page.enable')
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false })
    const loaded = cdp.once('Page.loadEventFired')
    await cdp.send('Page.navigate', { url: PAGE })
    await loaded
    await cdp.evaluate('window.ready')
    const fps = await cdp.evaluate('FPS')
    const frames = Math.round(fps * (await cdp.evaluate('DURATION')))

    const wav = join(work, 'audio.wav')
    writeFileSync(wav, Buffer.from(await cdp.evaluate('renderAudio()'), 'base64'))
    for (let i = 0; i < frames; i++) {
      await cdp.evaluate(`seek(${i / fps})`)
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
      writeFileSync(join(work, `f${String(i).padStart(5, '0')}.png`), Buffer.from(data, 'base64'))
      if (i % fps === 0) process.stdout.write(`\rsnímky ${i}/${frames}`)
    }
    console.log(`\rsnímky ${frames}/${frames}`)
    cdp.close()

    // Hlasitost jako u reelů: −14 LUFS, true peak ≤ −1 dBTP (dva průchody loudnorm).
    const LN = 'loudnorm=I=-14:TP=-1.5:LRA=11'
    const measured = ffmpeg(['-i', wav, '-af', `${LN}:print_format=json`, '-f', 'null', '-'])
    const m = JSON.parse(measured.slice(measured.lastIndexOf('{'), measured.lastIndexOf('}') + 1))
    const af =
      `${LN}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}` +
      `:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`
    mkdirSync(dirname(OUT), { recursive: true })
    ffmpeg([
      '-y', '-framerate', String(fps), '-i', join(work, 'f%05d.png'), '-i', wav, '-af', af,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(fps),
      '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '48000', '-movflags', '+faststart', '-shortest', OUT,
    ])
    const check = ffmpeg(['-i', OUT, '-af', `${LN}:print_format=json`, '-f', 'null', '-'])
    const c = JSON.parse(check.slice(check.lastIndexOf('{'), check.lastIndexOf('}') + 1))
    console.log(`hotovo: ${OUT}\nhlasitost ${c.input_i} LUFS, true peak ${c.input_tp} dBTP`)
  } finally {
    chrome.kill()
    rmSync(work, { recursive: true, force: true })
    rmSync(profile, { recursive: true, force: true })
  }
}

function ffmpeg(args) {
  const r = spawnSync('ffmpeg', ['-hide_banner', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (r.status !== 0) throw new Error(r.stderr.slice(-2000))
  return r.stderr
}

/** Minimální klient DevTools protokolu (stránka = první záložka headless Chromu). */
async function connect() {
  let target
  for (let i = 0; i < 100 && !target; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json()
      target = list.find((t) => t.type === 'page')
    } catch {
      // Chrome ještě startuje
    }
    if (!target) await new Promise((r) => setTimeout(r, 100))
  }
  if (!target) throw new Error('Chrome se nespustil')
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((r, j) => {
    ws.addEventListener('open', r, { once: true })
    ws.addEventListener('error', j, { once: true })
  })
  let id = 0
  const pending = new Map()
  const waiting = []
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data)
    if (msg.id && pending.has(msg.id)) {
      const { ok, fail } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) fail(new Error(msg.error.message))
      else ok(msg.result)
    } else if (msg.method) {
      for (const w of waiting.filter((x) => x.method === msg.method)) {
        waiting.splice(waiting.indexOf(w), 1)
        w.ok(msg.params)
      }
    }
  })
  const send = (method, params = {}) =>
    new Promise((ok, fail) => {
      pending.set(++id, { ok, fail })
      ws.send(JSON.stringify({ id, method, params }))
    })
  return {
    send,
    once: (method) => new Promise((ok) => waiting.push({ method, ok })),
    async evaluate(expression) {
      const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text)
      return r.result.value
    },
    close: () => ws.close(),
  }
}
