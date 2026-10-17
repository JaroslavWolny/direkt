// Render videí do IG story (DOKUMENTACE.md 15.1, 15.2): statický server → headless Chrome přes
// DevTools protokol → PNG snímky rovnou do ffmpeg + WAV z OfflineAudioContext → ffmpeg
// (loudnorm −14 LUFS, x264). Stránka si sama řekne o motion blur (SUBFRAMES) a zrno (GRAIN).
//
//   node --experimental-websocket marketing/video/render.mjs                 # promo.html → MP4
//   node --experimental-websocket marketing/video/render.mjs --page spot     # spot.html → MP4
//   … --serve                                     # jen server pro náhled
//   … --out cesta.mp4                             # jiný výstup
//   … --sheet 0.1,1.2,3.5 --out arch.png          # náhledový arch jednotlivých okamžiků (červeně IG zóny)
//   … --tile 1080                                 # šířka snímku v archu (výchozí 360)
//   … --qa                                        # důležité texty [data-qa]: v pásu y 250–1580, písmo ≥ 30 px
//   … --query hook=2                              # parametry stránky (varianty)
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
const NAME = arg('--page') ?? 'promo'
const SHEET = arg('--sheet')?.split(',').map(Number)
const QUERY = arg('--query')
const TILE = Number(arg('--tile') ?? 360)
const OUT = resolve(arg('--out') ?? join(homedir(), `Desktop/DIREKT-marketing/DIREKT-story-${NAME}.mp4`))
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
// bez běžícího serveru nespouštět Chrome (jinak zůstane viset jako sirotek na DEBUG_PORT)
await new Promise((ok, fail) => server.once('listening', ok).once('error', fail))

const PAGE = `http://127.0.0.1:${PORT}/marketing/video/${NAME}.html${QUERY ? `?${QUERY}` : ''}`
if (process.argv.includes('--serve')) {
  const q = QUERY ? '&' : '?'
  console.log(`Náhled: ${PAGE}${q}play  (jeden okamžik: ${q}t=5.4)`)
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
    const sub = await cdp.evaluate('window.SUBFRAMES ?? 1')
    const grain = await cdp.evaluate('window.GRAIN ?? 0')
    const shot = async () => Buffer.from((await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true })).data, 'base64')
    mkdirSync(dirname(OUT), { recursive: true })

    if (SHEET) {
      for (const [i, t] of SHEET.entries()) {
        await cdp.evaluate(`seek(${t})`)
        writeFileSync(join(work, `s${String(i).padStart(3, '0')}.png`), await shot())
      }
      const cols = Math.min(SHEET.length, 6)
      const zones = [250, 1580].map((y) => `drawbox=y=${y - 2}:w=iw:h=4:color=red@0.7:t=fill`).join(',')
      ffmpeg(['-y', '-i', join(work, 's%03d.png'), '-vf', `${zones},scale=${TILE}:-1,tile=${cols}x${Math.ceil(SHEET.length / cols)}:padding=8:color=gray`,
        '-frames:v', '1', OUT])
      console.log(`arch: ${OUT}`)
      return cdp.close()
    }

    if (process.argv.includes('--qa')) {
      const found = new Map()
      for (let i = 0; i < frames; i += 3) {
        const t = i / fps
        await cdp.evaluate(`seek(${t})`)
        for (const msg of await cdp.evaluate(`(${qaCheck})()`)) (found.get(msg) ?? found.set(msg, []).get(msg)).push(t)
      }
      // souvislé úseky; průlety kratší než 0,3 s (nájezdy, přechody) se nehlásí
      const report = []
      for (const [msg, ts] of found) {
        let s = ts[0]
        ts.forEach((t, k) => {
          if (ts[k + 1] - t < 0.15) return
          if (t - s + 0.1 >= 0.3 || msg.startsWith('písmo')) report.push(`  ${s.toFixed(1)}–${(t + 0.1).toFixed(1)} s  ${msg}`)
          s = ts[k + 1]
        })
      }
      console.log(report.length ? `QA PROBLÉMY:\n${report.join('\n')}` : 'QA: ok')
      return cdp.close()
    }

    // Hlasitost jako u reelů: −14 LUFS, true peak ≤ −1 dBTP (dva průchody loudnorm).
    const wav = join(work, 'audio.wav')
    writeFileSync(wav, Buffer.from(await cdp.evaluate('renderAudio()'), 'base64'))
    const LN = 'loudnorm=I=-14:TP=-1.5:LRA=11'
    const measured = ffmpeg(['-i', wav, '-af', `${LN}:print_format=json`, '-f', 'null', '-'])
    const m = JSON.parse(measured.slice(measured.lastIndexOf('{'), measured.lastIndexOf('}') + 1))
    const af =
      `${LN}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}` +
      `:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`

    // Motion blur: snímek = průměr `sub` dílčích snímků; zrno až po zprůměrování.
    const vf = [
      sub > 1 && `tmix=frames=${sub},select='eq(mod(n\\,${sub})\\,${sub - 1})',setpts=N/(${fps}*TB)`,
      grain && `noise=alls=${grain}:allf=t`,
      'format=yuv420p',
    ].filter(Boolean).join(',')
    const enc = spawn('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps * sub), '-i', 'pipe:0',
      '-i', wav, '-vf', vf, '-af', af,
      // strop datového toku: zrno je skoro nekomprimovatelné, bez stropu má 15 s přes 200 MB
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-maxrate', '24M', '-bufsize', '48M', '-profile:v', 'high',
      '-r', String(fps), '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '48000', '-movflags', '+faststart', '-shortest', OUT,
    ], { stdio: ['pipe', 'inherit', 'inherit'] })
    const done = new Promise((ok, fail) => enc.on('close', (code) => (code === 0 ? ok() : fail(new Error(`ffmpeg ${code}`)))))
    for (let i = 0; i < frames * sub; i++) {
      await cdp.evaluate(`seek(${i / (fps * sub)})`)
      if (!enc.stdin.write(await shot())) await new Promise((r) => enc.stdin.once('drain', r))
      if (i % (fps * sub) === 0) process.stdout.write(`\rsnímky ${i / sub}/${frames}`)
    }
    enc.stdin.end()
    await done
    console.log(`\rsnímky ${frames}/${frames}`)
    cdp.close()
    const check = ffmpeg(['-i', OUT, '-af', `${LN}:print_format=json`, '-f', 'null', '-'])
    const c = JSON.parse(check.slice(check.lastIndexOf('{'), check.lastIndexOf('}') + 1))
    console.log(`hotovo: ${OUT}\nhlasitost ${c.input_i} LUFS, true peak ${c.input_tp} dBTP`)
  } finally {
    const exited = new Promise((r) => chrome.once('exit', r))
    chrome.kill()
    await exited // Chrome jinak ještě zapisuje do profilu, který mažeme
    rmSync(work, { recursive: true, force: true })
    rmSync(profile, { recursive: true, force: true, maxRetries: 5 })
  }
}

/** Běží ve stránce: viditelné [data-qa] mimo pás y 250–1580 nebo s písmem pod 30 px (po zvětšení kamerou). */
function qaCheck() {
  const out = []
  for (const el of document.querySelectorAll('[data-qa]')) {
    let o = 1
    for (let n = el; n && o > 0.05; n = n.parentElement) {
      const cs = getComputedStyle(n)
      o = cs.display === 'none' || cs.visibility === 'hidden' ? 0 : o * cs.opacity
    }
    const r = el.getBoundingClientRect()
    if (o <= 0.05 || !r.width || r.bottom < 0 || r.top > 1920) continue
    const name = `"${el.textContent.trim().replace(/\s+/g, ' ').slice(0, 32)}"`
    if (r.top < 250 - 2 || r.bottom > 1580 + 2 || r.left < -2 || r.right > 1082) out.push(`mimo pás: ${name}`)
    const font = parseFloat(getComputedStyle(el).fontSize) * (r.width / (el.offsetWidth || r.width))
    if (font < 29.5) out.push(`písmo ${Math.round(font)} px: ${name}`)
  }
  return out
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
