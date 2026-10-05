<script lang="ts">
  import SectionHeader from '../ui/SectionHeader.svelte'
  import { PAINT } from '../../data/content'
  import { coarse } from '../../lib/util'

  let canvas: HTMLCanvasElement
  let section: HTMLElement
  let col = $state('#f07000')
  // on a touch screen a swipe scrolls the page unless TAG mode is on (otherwise the wall swallows every swipe)
  let tagging = $state(false)

  // Spray-paint canvas: hold to build up soft paint, linger to make it drip.
  interface Drip { x: number; y: number; v: number; l: number; col: string; w: number }

  $effect(() => {
    const c = canvas.getContext('2d')!
    const drips: Drip[] = []
    let down = false, px = 0, py = 0, lx = 0, ly = 0, dwell = 0, raf = 0

    const size = () => {
      const r = section.getBoundingClientRect()
      // phones fire resize as the toolbar slides, and setting width wipes the paint: only react to a real width change
      if (canvas.width === Math.round(r.width) && canvas.height > 0) return
      canvas.width = r.width
      canvas.height = r.height
    }
    const pos = (e: PointerEvent): [number, number] => {
      const r = canvas.getBoundingClientRect()
      return [e.clientX - r.left, e.clientY - r.top]
    }
    const hex = (h: string) => {
      const n = parseInt(h.slice(1), 16)
      return [n >> 16, (n >> 8) & 255, n & 255]
    }
    // soft round puff: solid-ish core fading out, builds up the longer you hold
    function puff(x: number, y: number, r: number, a: number) {
      const [R, G, B] = hex(col), g = c.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, `rgba(${R},${G},${B},${a})`)
      g.addColorStop(0.55, `rgba(${R},${G},${B},${a * 0.7})`)
      g.addColorStop(1, `rgba(${R},${G},${B},0)`)
      c.fillStyle = g
      c.beginPath()
      c.arc(x, y, r, 0, 7)
      c.fill()
    }
    function frame() {
      if (down) {
        const dx = px - lx, dy = py - ly, dist = Math.hypot(dx, dy), n = Math.max(1, Math.ceil(dist / 4))
        dwell = dist < 2 ? dwell + 1 : Math.max(0, dwell - 2)
        for (let k = 1; k <= n; k++) puff(lx + (dx * k) / n, ly + (dy * k) / n, 15, 0.3)
        c.fillStyle = col
        for (let i = 0; i < 30; i++) {
          const a = Math.random() * 6.283, r = 14 + Math.pow(Math.random(), 1.6) * 20
          c.globalAlpha = 0.35 + Math.random() * 0.4
          const z = Math.random() < 0.2 ? 2.2 : 1.3
          c.fillRect(px + Math.cos(a) * r, py + Math.sin(a) * r, z, z)
        }
        c.globalAlpha = 1
        lx = px
        ly = py
        if (Math.random() < 0.02 + Math.min(dwell, 90) * 0.0035)
          drips.push({ x: px + (Math.random() * 10 - 5), y: py + 6, v: 0.5 + Math.random() * 0.9, l: 25 + Math.random() * (40 + dwell), col, w: 2 + (Math.random() < 0.4 ? 1 : 0) })
      }
      for (let i = drips.length - 1; i >= 0; i--) {
        const d = drips[i]
        c.fillStyle = d.col
        c.fillRect(d.x, d.y, d.w, 2)
        d.y += d.v
        d.l -= d.v
        if (d.l <= 0) drips.splice(i, 1)
      }
      // idle: stop the loop until the next touch (it restarts in onDown)
      raf = down || drips.length ? requestAnimationFrame(frame) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const onDown = (e: PointerEvent) => {
      down = true
      ;[px, py] = pos(e)
      lx = px
      ly = py
      dwell = 0
      canvas.setPointerCapture(e.pointerId)
      kick()
    }
    const onMove = (e: PointerEvent) => { if (down) [px, py] = pos(e) }
    const onUp = () => (down = false)

    size()
    addEventListener('resize', size)
    addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', size)
      removeEventListener('pointerup', onUp)
    }
  })

  const clear = () => canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
</script>

<section
  bind:this={section}
  id="wall"
  class="h-[92vh] min-h-[620px] overflow-hidden bg-[url(/img/graffiti-wall.jpg)] bg-cover bg-center"
>
  <canvas bind:this={canvas} id="spray" class={['absolute inset-0 z-[2] h-full w-full', coarse && !tagging ? 'touch-pan-y' : 'touch-none']}></canvas>
  <SectionHeader class="pointer-events-none absolute inset-x-0 top-[50px] z-[3] m-0 px-[4vw]" title="Tag the Wall" tag="hold &amp; drag · leave your mark" />
  <div class="absolute bottom-[60px] left-1/2 z-[4] flex w-max max-w-[calc(100%-24px)] -translate-x-1/2 flex-wrap items-center justify-center gap-3 border-[3px] border-solid border-orange bg-black px-4 py-[10px] max-[640px]:gap-2 max-[640px]:px-3 font-lcd text-[22px] font-normal tracking-[.1em] text-phos">PAINT
    {#each PAINT as [name, hex]}
      <button
        type="button"
        class={['size-[34px] rounded-full max-[640px]:size-[30px] border-[3px] border-solid border-white', col === hex && 'outline-[3px] outline-offset-[3px] outline-orange']}
        style="background:{hex}"
        aria-label={name}
        onclick={() => (col = hex)}
      ></button>
    {/each}
    <button type="button" class="h-[34px] border-2 border-solid border-cream px-[10px] tracking-normal [font-family:VT323] text-[20px] font-normal text-cream" onclick={clear}>CLEAR</button>
    {#if coarse}
      <button
        type="button"
        class={['h-[34px] border-2 border-solid px-[10px] tracking-normal [font-family:VT323] text-[20px] font-normal', tagging ? 'border-orange bg-orange text-black' : 'border-cream text-cream']}
        aria-pressed={tagging}
        onclick={() => (tagging = !tagging)}
      >{tagging ? 'SCROLL' : 'TAG'}</button>
    {/if}
  </div>
</section>
