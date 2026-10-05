<script lang="ts">
  import Sticker from '../ui/Sticker.svelte'
  import { LATEST } from '../../data/releases'
  import SectionHeader from '../ui/SectionHeader.svelte'
  import { whenVisible } from '../../lib/visible'

  let canvas: HTMLCanvasElement

  // LED dot-matrix destination blind: render the text to an offscreen strip, then scroll it as dots.
  $effect(() => {
    const c = canvas.getContext('2d')!
    const txt = `N17  TOTTENHAM HALE  ◄  5EB  ◄  NIGHT BUS - NOT IN SERVICE - ${LATEST.title.toUpperCase()} OUT NOW  ◄  BARE BARS NO HOOKS  ◄      `
    const ROWS = 18, GAP = 10, R = 3.6, cols = Math.floor(canvas.width / GAP)
    const off = document.createElement('canvas')
    const ox = off.getContext('2d', { willReadFrequently: true })!
    let px: Uint8ClampedArray | null = null
    let W = 0, o = 0, raf = 0, last = 0

    // one lit and one unlit dot, drawn once with their glow, then stamped
    const PAD = 12, S = GAP + PAD * 2
    const dot = (lit: boolean) => {
      const s = document.createElement('canvas')
      s.width = s.height = S
      const d = s.getContext('2d')!
      d.beginPath()
      d.arc(S / 2, S / 2, R, 0, 7)
      d.fillStyle = lit ? '#ff8a1a' : '#1a1006'
      if (lit) {
        d.shadowColor = '#f07000'
        d.shadowBlur = 10
      }
      d.fill()
      return s
    }
    const on = dot(true), offDot = dot(false)

    function build() {
      ox.font = '20px VT323'
      W = Math.ceil(ox.measureText(txt).width) + cols
      off.width = W
      off.height = ROWS
      ox.font = '22px VT323'
      ox.textBaseline = 'middle'
      ox.fillStyle = '#fff'
      ox.clearRect(0, 0, W, ROWS)
      ox.fillText(txt, 0, ROWS / 2 + 1)
      px = ox.getImageData(0, 0, W, ROWS).data
    }
    document.fonts.load('22px VT323').then(build, build)

    function draw(now: number) {
      raf = requestAnimationFrame(draw)
      if (now - last < 33) return // 30fps
      last = now
      c.clearRect(0, 0, canvas.width, canvas.height)
      if (px) {
        o = (o + 1) % W
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < cols; x++) {
            const sx = Math.floor(x + o) % W
            c.drawImage(px[(y * W + sx) * 4 + 3] > 110 ? on : offDot, x * GAP - PAD, y * GAP - PAD)
          }
        }
      }
    }
    // only while the bus blind is on screen
    const stop = whenVisible(canvas, v => {
      cancelAnimationFrame(raf)
      if (v) raf = requestAnimationFrame(draw)
    })
    return () => {
      stop()
      cancelAnimationFrame(raf)
    }
  })
</script>

<section id="bus" class="overflow-hidden bg-black pt-[110px] pb-[120px]">
  <div class="absolute inset-0 bg-[url(/img/busstop.jpg)] bg-cover bg-center opacity-[.28] grayscale contrast-[1.4]"></div>
  <SectionHeader class="relative mb-[30px] px-[4vw]" title="Night Bus" tag="last one home" />
  <div class="relative mx-[4vw] rounded-[10px] border-8 border-solid border-[#2a2a2a] bg-black px-5 py-[18px] shadow-[0_0_0_3px_#555,0_0_80px_rgba(240,112,0,.25),inset_0_0_30px_#000] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(120deg,rgba(255,255,255,.08),transparent_30%)] after:content-['']">
    <canvas bind:this={canvas} class="block h-auto w-full" width="1200" height="180"></canvas>
  </div>
  <div class="relative mt-[60px] flex flex-wrap items-center justify-around gap-[30px] px-[4vw]">
    <Sticker flow col src="old/oyster.jpg" caption="top up before you cuff it" style="width:min(80vw,380px);aspect-ratio:1.45;transform:rotate(-3deg)" />
    <p class="max-w-[12em] rotate-[-3deg] font-marker text-[clamp(30px,4vw,56px)] leading-[1.1] font-normal text-orange [text-shadow:3px_3px_0_#000]">Top deck, back seat, one earphone each.</p>
    <Sticker flow col src="old/bus.jpg" caption="N41 · no stopping" style="width:min(80vw,340px);aspect-ratio:1.3;transform:rotate(4deg)" />
  </div>
</section>
