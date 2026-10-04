// Procedural 140bpm grime beat + radio static, built on WebAudio. Nothing is loaded from disk.
/** Reactive sound state, drives the SND button label. */
export const audio = $state({ on: false, running: false })

/** What the radio dial is currently doing, fed in by the Radio section. */
const radio = { lock: 0, presence: 0, near: false }

let ctx: AudioContext | null = null
let master: GainNode, noiseG: GainNode, beatG: GainNode, beatLP: BiquadFilterNode
let an: AnalyserNode
let step = 0
let nextT = 0
let nbufCache: AudioBuffer | undefined
const SD = 60 / 140 / 4

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
  ns.connect(bp).connect(noiseG).connect(master)
  ns.start()
  // beat bus
  beatLP = ctx.createBiquadFilter()
  beatLP.type = 'lowpass'
  beatLP.frequency.value = 400
  beatG = ctx.createGain()
  beatG.gain.value = 0
  beatLP.connect(beatG).connect(master)
  nextT = ctx.currentTime + 0.1
  setInterval(sched, 25)
  applyRadio()
}

function sched() {
  while (nextT < ctx!.currentTime + 0.12) {
    play(step % 16, nextT)
    nextT += SD
    step++
  }
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

function kick(t: number) {
  const o = ctx!.createOscillator(), g = ctx!.createGain()
  o.frequency.setValueAtTime(150, t)
  o.frequency.exponentialRampToValueAtTime(40, t + 0.12)
  env(g, t, 0.003, 0.28, 1)
  o.connect(g).connect(beatLP)
  o.start(t)
  o.stop(t + 0.35)
}

function snare(t: number) {
  const b = ctx!.createBufferSource()
  b.buffer = nbuf()
  const f = ctx!.createBiquadFilter()
  f.type = 'highpass'
  f.frequency.value = 1500
  const g = ctx!.createGain()
  env(g, t, 0.002, 0.18, 0.8)
  b.connect(f).connect(g).connect(beatLP)
  b.start(t)
  b.stop(t + 0.25)
  const o = ctx!.createOscillator(), g2 = ctx!.createGain()
  o.type = 'triangle'
  o.frequency.setValueAtTime(220, t)
  o.frequency.exponentialRampToValueAtTime(120, t + 0.1)
  env(g2, t, 0.002, 0.12, 0.5)
  o.connect(g2).connect(beatLP)
  o.start(t)
  o.stop(t + 0.2)
}

function hat(t: number, open: boolean, v: number) {
  const b = ctx!.createBufferSource()
  b.buffer = nbuf()
  const f = ctx!.createBiquadFilter()
  f.type = 'highpass'
  f.frequency.value = 7500
  const g = ctx!.createGain()
  env(g, t, 0.001, open ? 0.14 : 0.04, v)
  b.connect(f).connect(g).connect(beatLP)
  b.start(t)
  b.stop(t + 0.2)
}

function sub(t: number, f: number, len: number) {
  const o = ctx!.createOscillator(), g = ctx!.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(f, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.9, t + 0.02)
  g.gain.setValueAtTime(0.9, t + len * SD - 0.04)
  g.gain.exponentialRampToValueAtTime(0.0001, t + len * SD)
  o.connect(g).connect(beatLP)
  o.start(t)
  o.stop(t + len * SD + 0.05)
}

function stab(t: number, f: number) {
  ;[0, 7].forEach(dt => {
    const o = ctx!.createOscillator(), g = ctx!.createGain(), lp = ctx!.createBiquadFilter()
    o.type = 'square'
    o.frequency.value = f
    o.detune.value = dt - 3
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(3200, t)
    lp.frequency.exponentialRampToValueAtTime(500, t + 0.14)
    env(g, t, 0.003, 0.16, 0.12)
    o.connect(lp).connect(g).connect(beatG)
    o.start(t)
    o.stop(t + 0.25)
  })
}

const STABS = [0, 3, 6, 10, 12]
const STAB_NOTES = [349.2, 415.3, 523.3, 415.3, 466.2]

function play(s: number, t: number) {
  if ([0, 5, 10].includes(s)) kick(t)
  if (s === 8) snare(t)
  if (s === 15) snare(t)
  hat(t, s === 14, s % 2 ? 0.18 : 0.3)
  if (s === 0) sub(t, 43.65, 5)
  if (s === 10) sub(t, 51.9, 3)
  if (s === 13) sub(t, 38.9, 3)
  if (STABS.includes(s)) stab(t, STAB_NOTES[STABS.indexOf(s)])
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

/** Update radio parameters (any subset) and re-mix static vs beat. */
export function setRadio(p: Partial<typeof radio>) {
  Object.assign(radio, p)
  applyRadio()
}

function applyRadio() {
  if (!ctx || !audio.on) return
  const t = ctx.currentTime
  const { lock, presence, near } = radio
  noiseG.gain.setTargetAtTime((1 - lock) * (0.03 + 0.19 * presence) * (near ? 0.6 : 1), t, 0.05)
  beatG.gain.setTargetAtTime(0.3 + lock * 0.65, t, 0.08)
  beatLP.frequency.setTargetAtTime(450 + lock * lock * 9000, t, 0.08)
}

// Browsers block autoplay until the first gesture: if blocked, unlock on first tap/click/key.
for (const ev of ['pointerdown', 'keydown', 'touchend']) {
  addEventListener(ev, () => {
    if (audio.on && ctx && ctx.state !== 'running') ctx.resume().then(syncRunning)
  }, { passive: true })
}
