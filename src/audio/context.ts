// Jedna sdílená AudioContext pro keep-alive, gong, klepnutí i pípání (DOKUMENTACE.md R2, kap. 8).

let ctx: AudioContext | null = null
let master: GainNode | null = null
let keepAlive: OscillatorNode | null = null

type NavigatorWithAudioSession = Navigator & { audioSession?: { type: string } }

export function getContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
    // Kompresor na výstupu: tři gongy přes sebe nepřebudí reproduktor.
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -6
    comp.knee.value = 6
    comp.ratio.value = 12
    comp.attack.value = 0.002
    comp.release.value = 0.15
    master = ctx.createGain()
    master.connect(comp).connect(ctx.destination)
  }
  return ctx
}

export function output(): AudioNode {
  getContext()
  return master as GainNode
}

/** Volat synchronně v gestu. Na resume() se čeká max 1 s — na iOS umí viset (R4). */
export function resumeContext(timeoutMs = 1000): Promise<void> {
  const c = getContext()
  if (c.state === 'running') return Promise.resolve()
  return Promise.race([
    c.resume().catch(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]).then(() => undefined)
}

/** 'playback' hraje i v tichém režimu, ale zastaví hudbu; 'auto' se s hudbou mixuje (R7). */
export function setSilentOverride(on: boolean): void {
  const session = (navigator as NavigatorWithAudioSession).audioSession
  if (!session) return
  try {
    session.type = on ? 'playback' : 'auto'
  } catch {
    // starší iOS — necháme výchozí chování
  }
}

/** Neslyšitelný tón drží audio session vzhůru → hlášení bez ~300ms zpoždění (R2). */
export function startKeepAlive(): void {
  if (keepAlive) return
  const c = getContext()
  const osc = c.createOscillator()
  osc.frequency.value = 30
  const gain = c.createGain()
  gain.gain.value = 0.0005
  osc.connect(gain).connect(c.destination)
  osc.start()
  keepAlive = osc
}

export function stopKeepAlive(): void {
  if (!keepAlive) return
  keepAlive.stop()
  keepAlive.disconnect()
  keepAlive = null
}
