<script lang="ts">
  import SectionHeader from '../ui/SectionHeader.svelte'
  import { PAINT } from '../../data/content'

  let canvas: HTMLCanvasElement
  let section: HTMLElement
  let col = $state('#f07000')

  // Spray-paint canvas: hold to build up soft paint, linger to make it drip.
  interface Drip { x: number; y: number; v: number; l: number; col: string; w: number }

  $effect(() => {
    const c = canvas.getContext('2d')!
    const drips: Drip[] = []
    let down = false, px = 0, py = 0, lx = 0, ly = 0, dwell = 0, raf = 0

    const size = () => {
      const r = section.getBoundingClientRect()
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
      raf = requestAnimationFrame(frame)
    }

    const onDown = (e: PointerEvent) => {
      down = true
      ;[px, py] = pos(e)
      lx = px
      ly = py
      dwell = 0
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => { if (down) [px, py] = pos(e) }
    const onUp = () => (down = false)

    size()
    addEventListener('resize', size)
    addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    frame()
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
  class="h-[92vh] min-h-[620px] overflow-hidden bg-[url(/img/old/graffiti.jpg)] bg-cover bg-center before:absolute before:inset-0 before:bg-black/[.42] before:backdrop-grayscale-[.7] before:backdrop-contrast-[1.3] before:content-['']"
>
  <canvas bind:this={canvas} id="spray" class="absolute inset-0 z-[2] h-full w-full touch-none"></canvas>
  <SectionHeader class="pointer-events-none absolute inset-x-0 top-[50px] z-[3] m-0 px-[4vw]" title="Tag the Wall" tag="hold &amp; drag · leave your mark" />
  <div class="absolute bottom-[60px] left-1/2 z-[4] flex -translate-x-1/2 items-center gap-3 border-[3px] border-solid border-orange bg-black px-4 py-[10px] font-lcd text-[22px] font-normal tracking-[.1em] text-phos">PAINT
    {#each PAINT as [name, hex]}
      <button
        type="button"
        class={['h-[34px] w-[34px] rounded-full border-[3px] border-solid border-white', col === hex && 'outline-[3px] outline-offset-[3px] outline-orange']}
        style="background:{hex}"
        aria-label={name}
        onclick={() => (col = hex)}
      ></button>
    {/each}
    <button type="button" class="h-[34px] border-2 border-solid border-cream px-[10px] tracking-normal [font-family:VT323] text-[20px] font-normal text-cream" onclick={clear}>CLEAR</button>
  </div>
</section>
