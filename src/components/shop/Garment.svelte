<script lang="ts">
  import Stage from './Stage.svelte'
  import Tinted from './Tinted.svelte'
  import { blip } from '../../lib/audio.svelte'
  import { clamp, reduce } from '../../lib/util'
  import type { Product } from '../../data/products'

  // Tee, hoodie, beanie: a real photo you can tilt, recolour and poke. Pokes (and fast swipes) run a
  // turbulence displacement over the photo so the cloth ripples, then settles.
  let { item, index, color, size }: { item: Product; index: number; color: string; size: string } = $props()

  let frame = $state<HTMLElement>()
  let rx = $state(0)
  let ry = $state(0)
  let gx = $state(50)
  let gy = $state(30)
  let cloth = $state(false)
  let turb: SVGFETurbulenceElement
  let disp: SVGFEDisplacementMapElement
  let energy = 0
  let raf = 0
  let lx = 0
  let lt = 0

  // Where the chest print sits on each photo, in % of the picture.
  const PRINT: Record<string, string> = {
    tee: 'left:38.5%;top:25%;width:23%',
    hood: 'left:38%;top:37%;width:24%',
  }
  // The woven patch covers the maker's label on the beanie cuff.
  const PATCH = 'left:39%;top:80.5%;width:22.5%;height:18%'

  const scale = $derived(item.sz ? 0.9 + item.sz.indexOf(size) * 0.055 : 1)

  function poke(a: number) {
    if (reduce) return
    energy = Math.min(1, energy + a)
    if (!raf) raf = requestAnimationFrame(tick)
  }

  function tick(t: number) {
    energy *= 0.95
    const ph = t / 1000
    disp?.setAttribute('scale', (energy * 30).toFixed(1))
    turb?.setAttribute('baseFrequency', `${0.01 + 0.004 * Math.sin(ph * 6)} ${0.016 + 0.004 * Math.cos(ph * 5)}`)
    cloth = energy > 0.02
    raf = cloth ? requestAnimationFrame(tick) : 0
  }

  function onpointermove(e: PointerEvent) {
    const r = frame!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    ry = clamp((x - 0.5) * 30, -15, 15)
    rx = clamp(-(y - 0.5) * 30, -15, 15)
    gx = x * 100
    gy = y * 100
    const now = performance.now(), v = Math.abs(e.clientX - lx) / Math.max(1, now - lt)
    lx = e.clientX
    lt = now
    if (v > 1.4) poke(Math.min(0.1, v * 0.02))
  }

  function onpointerdown() {
    poke(0.9)
    blip(180, 0.07)
    setTimeout(() => blip(260, 0.05), 60)
  }

  $effect(() => () => cancelAnimationFrame(raf))
</script>

<Stage bind:frame no={index + 1} stock={item.stock} ratio={item.ratio} hint="TILT IT · POKE THE FABRIC" {onpointermove} {onpointerdown} onpointerleave={() => { rx = 0; ry = 0 }}>
  <div
    class="absolute inset-0 [transition:transform_.2s_ease-out]"
    style="transform:perspective(900px) rotateX({rx}deg) rotateY({ry}deg) scale({scale});filter:{cloth ? 'url(#cloth)' : 'none'}"
  >
    <div class="absolute inset-0 animate-float">
      <Tinted src={item.img} {color} dip class="absolute inset-0 [filter:drop-shadow(7px_10px_0_rgba(0,0,0,.45))]">
        {#snippet under()}
          {#if PRINT[item.id]}
            <img class="absolute" style={PRINT[item.id]} src="/img/logo.png" alt="" draggable="false" />
          {/if}
        {/snippet}
        {#snippet over(mask)}
          {#if item.id === 'beanie'}
            <div
              class="absolute grid place-items-center border-2 border-dashed border-black/60 bg-orange shadow-[1px_2px_0_rgba(0,0,0,.6)] outline-2 outline-orange"
              style="{PATCH};transform:rotate(-1.5deg)"
            ><b class="font-anton text-[5.5em] leading-none font-normal text-black [text-shadow:1px_1px_0_rgba(255,255,255,.35)]">5EB</b></div>
          {/if}
          <div class="absolute inset-0 mix-blend-overlay" style="background:radial-gradient(circle at {gx}% {gy}%,rgba(255,255,255,.7),transparent 48%);{mask}"></div>
        {/snippet}
      </Tinted>
    </div>
  </div>
  <svg class="absolute size-0" aria-hidden="true">
    <filter id="cloth" x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence bind:this={turb} type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="4" result="n" />
      <feDisplacementMap bind:this={disp} in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
</Stage>
