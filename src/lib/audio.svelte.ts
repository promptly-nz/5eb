// Radio static and UI beeps, built on WebAudio. Nothing is loaded from disk. (Music is real: see music.svelte.ts.)
/** Reactive sound state, drives the music tag. */
export const audio = $state({ on: false, running: false })

/** What the radio dial is currently doing, fed in by the Radio section. */
const radio = { lock: 0, presence: 0, near: false }
/**
 * How much of the radio static is let through under the music: 1 with nothing playing, a little less
 * under the quiet bed, 0 while a song from the music list plays. Changes fade over about a second.
 */
let duck = 1
export function setStaticDuck(mult: number) {
  duck = mult
  if (ctx) duckG.gain.setTargetAtTime(duck, ctx.currentTime, 0.35)
}

let ctx: AudioContext | null = null
let master: GainNode, noiseG: GainNode, duckG: GainNode
let an: AnalyserNode
let nbufCache: AudioBuffer | undefined

function audioInit() {
  if (ctx) return
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.9
  an = ctx.createAnalyser()
  an.fftSize = 128
  an.smoothingTimeConstant = 0.7
  master.connect(an)
  an.connect(ctx.destination)
  // static
  const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const d = nb.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const ns = ctx.createBufferSource()
  ns.buffer = nb
  ns.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 2600
  bp.Q.value = 0.5
  noiseG = ctx.createGain()
  noiseG.gain.value = 0
  duckG = ctx.createGain()
  duckG.gain.value = duck
  ns.connect(bp).connect(noiseG).connect(duckG).connect(master)
  ns.start()
  applyRadio()
}

function env(g: GainNode, t: number, a: number, d: number, peak: number) {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + a)
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d)
}

function nbuf() {
  if (nbufCache) return nbufCache
  nbufCache = ctx!.createBuffer(1, ctx!.sampleRate * 0.3, ctx!.sampleRate)
  const d = nbufCache.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return nbufCache
}

/** Short square-wave UI beep. */
export function blip(f = 880, d = 0.05) {
  if (!audio.on || !ctx) return
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain()
  o.type = 'square'
  o.frequency.value = f
  env(g, t, 0.002, d, 0.15)
  o.connect(g).connect(master)
  o.start(t)
  o.stop(t + d + 0.05)
}

/** Noise burst, used for channel changes and camera flashes. */
export function burst() {
  if (!audio.on || !ctx) return
  const b = ctx.createBufferSource()
  b.buffer = nbuf()
  const g = ctx.createGain()
  env(g, ctx.currentTime, 0.005, 0.22, 0.6)
  b.connect(g).connect(master)
  b.start()
}

/** Current FFT bins for the radio visualiser, or null when there's nothing playing. */
export function frequencyData(): Uint8Array | null {
  if (!ctx || !audio.on || !an) return null
  const data = new Uint8Array(an.frequencyBinCount)
  an.getByteFrequencyData(data)
  return data
}

function syncRunning() {
  audio.running = ctx?.state === 'running'
}

export function setSound(on: boolean) {
  audio.on = on
  if (on) {
    audioInit()
    ctx!.resume().then(syncRunning, syncRunning)
    ctx!.onstatechange = syncRunning
  } else if (ctx) {
    ctx.suspend()
  }
  syncRunning()
  applyRadio()
}

/** Update radio parameters (any subset) and re-mix the static. */
export function setRadio(p: Partial<typeof radio>) {
  Object.assign(radio, p)
  applyRadio()
}

function applyRadio() {
  if (!ctx || !audio.on) return
  const t = ctx.currentTime
  const { lock, presence, near } = radio
  noiseG.gain.setTargetAtTime((1 - lock) * (0.03 + 0.19 * presence) * (near ? 0.6 : 1), t, 0.05)
}

// Browsers block autoplay until the first gesture: if blocked, unlock on first tap/click/key.
for (const ev of ['pointerdown', 'keydown', 'touchend']) {
  addEventListener(ev, () => {
    if (audio.on && ctx && ctx.state !== 'running') ctx.resume().then(syncRunning)
  }, { passive: true })
}
