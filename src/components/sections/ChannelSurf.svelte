<script lang="ts">
  import { onMount } from 'svelte'
  import Noise from '../ui/Noise.svelte'
  import SectionHeader from '../ui/SectionHeader.svelte'
  import LowerThird from '../ui/LowerThird.svelte'
  import { CHANNELS, type Channel } from '../../data/content'
  import { burst } from '../../lib/audio.svelte'
  import { clamp, pad, reduce } from '../../lib/util'

  interface Strip { y: number; h: number; dx: number; ch: Channel }

  let surf: HTMLElement
  let stage: HTMLElement
  let scr: HTMLElement
  let ch = $state(-1)
  let isStatic = $state(false)
  let vhs = $state(false)
  let rev = $state(false)
  let strips = $state<Strip[]>([])
  let stripH = $state(0)
  let jitter: ReturnType<typeof setInterval>

  const FILTER: Record<string, string> = {
    f1: '[filter:grayscale(1)_contrast(1.6)_brightness(.9)_sepia(.6)_hue-rotate(-12deg)_saturate(2.2)]',
    f2: '[filter:contrast(1.25)_saturate(1.5)_brightness(.95)]',
    f3: '[filter:grayscale(1)_contrast(1.9)_brightness(.9)_sepia(1)_hue-rotate(55deg)_saturate(3)]',
    f4: '[filter:contrast(1.15)_saturate(1.7)]',
    f5: '[filter:grayscale(1)_contrast(1.6)]',
    f6: '[filter:grayscale(1)_contrast(1.8)_brightness(1.1)_sepia(.8)_hue-rotate(-20deg)_saturate(2.5)]',
  }
  const STATIC = '[filter:grayscale(.7)_contrast(1.5)_brightness(1.5)]'
  const CHAN = 'absolute bg-cover bg-center [transform:scale(1.02)]'
  const SLASH = 'pointer-events-none absolute top-[-10%] -left-[30%] w-[160%] bg-white opacity-0'

  const cur = $derived(CHANNELS[Math.max(ch, 0)])

  // Tear the old picture into horizontal strips that jitter sideways, then swap in the new picture.
  function tear(from: Channel, to: Channel) {
    if (reduce) return
    stripH = scr.clientHeight
    const next: Strip[] = []
    let y = 2
    while (y < 96) {
      const h = 3 + Math.random() * 12
      if (Math.random() < 0.7) next.push({ y, h, dx: 0, ch: from })
      y += h + Math.random() * 9
    }
    strips = next
    const shake = () => { for (const s of strips) s.dx = (Math.random() * 2 - 1) * (25 + Math.random() * 110) }
    shake()
    clearInterval(jitter)
    jitter = setInterval(shake, 70)
    setTimeout(() => { for (const s of strips) s.ch = to }, 230)
    setTimeout(() => { clearInterval(jitter); strips = [] }, 560)
  }

  function setCh(i: number) {
    if (i === ch) return
    const prev = ch
    const old = CHANNELS[prev]
    ch = i
    isStatic = vhs = true
    rev = prev > i
    burst()
    setTimeout(() => (isStatic = false), 420)
    setTimeout(() => (vhs = false), 600)
    if (old) tear(old, CHANNELS[i])
  }

  function onscroll() {
    // measured against the pinned stage, not innerHeight (which changes as a phone's toolbar slides)
    const r = surf.getBoundingClientRect()
    const p = clamp(-r.top / (r.height - stage.clientHeight), 0, 0.999)
    setCh(Math.floor(p * CHANNELS.length))
  }

  onMount(() => setCh(0))
</script>

<svelte:window {onscroll} />

<section class="h-[560vh] bg-[radial-gradient(circle_at_50%_30%,#241a12,#050403_70%)]" id="surf" bind:this={surf}>
  <div bind:this={stage} class="sticky top-0 grid h-screen h-svh place-items-center overflow-hidden">
    <SectionHeader class="absolute inset-x-0 top-[70px] m-0 px-[4vw]" title="Channel Surf" />
    <div class="absolute top-1/2 left-[3vw] z-[3] flex -translate-y-1/2 flex-col gap-2 font-lcd text-[22px] text-[#7a6a5a] max-[900px]:hidden">
      {#each CHANNELS as _, i}
        <b
          class={[
            'font-normal [transition:.2s]',
            i === ch && "translate-x-[10px] text-phos [text-shadow:0_0_8px_var(--color-phos)] before:[font-family:VT323] before:content-['▶_']",
          ]}>P{pad(i + 1, 2)}</b>
      {/each}
    </div>
    <div class="relative mt-[60px] aspect-[1.38] w-[min(88vw,calc(70vh_*_1.38),920px)]">
      <div class="absolute bottom-full left-1/2 h-[120px] w-1 origin-bottom rotate-[-28deg] bg-[#bbb]"></div>
      <div class="absolute bottom-full left-1/2 h-[120px] w-1 origin-bottom rotate-[26deg] bg-[#bbb]"></div>
      <div class="absolute inset-0 rounded-[44px] bg-[linear-gradient(145deg,#4a4640,#1d1b18_50%,#312e2a)] shadow-[0_30px_80px_#000,inset_0_2px_0_rgba(255,255,255,.2),inset_0_-6px_12px_rgba(0,0,0,.6)]"></div>
      <div
        class={[
          'absolute top-[5.5%] left-[4.5%] h-[89%] w-[77%] overflow-hidden rounded-[70px/52px] bg-black shadow-[inset_0_0_60px_#000,0_0_0_6px_#111,0_0_0_8px_#555]',
          vhs && '[animation:surf-tvshake_.55s_steps(1)]',
        ]}
        bind:this={scr}
      >
        <div
          class={[CHAN, 'inset-0 animate-kb', isStatic ? STATIC : FILTER[cur.f]]}
          style="background-image:url(/img/{cur.img})"
        ></div>
        <div class="crtfx"></div>
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          {#each strips as s}
            <div
              class="pointer-events-none absolute inset-x-0 overflow-hidden shadow-[-7px_0_0_rgba(255,30,70,.55),7px_0_0_rgba(0,225,255,.55)]"
              style="top:{s.y}%;height:{s.h}%;transform:translateX({s.dx}px)"
            >
              <div
                class={[CHAN, 'inset-auto right-0 left-0', isStatic ? STATIC : FILTER[s.ch.f]]}
                style="background-image:url(/img/{s.ch.img});top:{(-s.y / 100) * stripH}px;height:{stripH}px"
              ></div>
            </div>
          {/each}
        </div>
        <div class="absolute top-[7%] left-[6%] flex items-end gap-[3px] font-lcd text-[22px] font-normal text-phos">
          VOL {#each [8, 12, 16, 20, 24] as h}<i class="w-1.5 bg-phos shadow-[0_0_6px_var(--color-phos)]" style="height:{h}px"></i>{/each}
        </div>
        <div class="absolute top-[7%] right-[6%] font-lcd text-[clamp(34px,5vw,64px)] font-normal tracking-[.06em] text-phos [text-shadow:0_0_10px_var(--color-phos),2px_2px_0_#000]">P {pad(ch + 1, 2)}</div>
        {#key ch}
          <LowerThird class="bottom-[11%]" title={cur.a} subtitle={cur.b} />
        {/key}
        <div
          class={[
            'pointer-events-none absolute top-[110%] -right-[5%] -left-[5%] h-[22%] opacity-0 mix-blend-screen',
            'bg-[linear-gradient(transparent,rgba(255,255,255,.7)_45%,rgba(255,255,255,.25)_60%,transparent),repeating-linear-gradient(0deg,rgba(255,255,255,.5)_0_1px,transparent_1px_3px)]',
            vhs && 'animate-[surf-trk_.55s_linear]',
          ]}
        ></div>
        <div
          class={[
            SLASH,
            'h-[9px] shadow-[0_0_0_3px_var(--color-orange),0_0_0_6px_var(--color-cyan-fx),0_0_36px_8px_rgba(255,255,255,.8)]',
            vhs && rev ? 'rotate-[17deg] animate-[surf-slashr_.5s_cubic-bezier(.6,0,.3,1)]' : 'rotate-[-17deg]',
            vhs && !rev && 'animate-[surf-slash_.5s_cubic-bezier(.6,0,.3,1)]',
          ]}
        ></div>
        <div
          class={[
            SLASH,
            'h-[3px] shadow-[0_0_0_2px_var(--color-rec),0_0_20px_4px_#fff]',
            vhs && rev ? 'rotate-[17deg] animate-[surf-slashr_.5s_.09s_cubic-bezier(.6,0,.3,1)]' : 'rotate-[-17deg]',
            vhs && !rev && 'animate-[surf-slash_.5s_.09s_cubic-bezier(.6,0,.3,1)]',
          ]}
        ></div>
        <div
          class={[
            'absolute bottom-[7%] left-[6%] [font-family:VT323] text-[clamp(20px,2.6vw,34px)] font-normal tracking-[.14em] text-white [text-shadow:2px_0_var(--color-rec),-2px_0_var(--color-cyan-fx)]',
            vhs ? 'block animate-[surf-blink_.22s_steps(1)_infinite]' : 'hidden',
          ]}
        >▶▶ TRACKING</div>
        <Noise active={isStatic} />
      </div>
      <div class="absolute top-[8%] right-[3%] bottom-[8%] flex w-[14%] flex-col items-center gap-[12%] pt-[6%]">
        <div
          class="relative aspect-square w-[70%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#999,#333_60%,#111)] shadow-[0_3px_6px_#000] [transition:transform_.5s] after:absolute after:top-[6%] after:left-[48%] after:h-[30%] after:w-[4%] after:bg-white after:content-['']"
          style="transform:rotate({ch * 52}deg)"
        ></div>
        <div
          class="relative aspect-square w-[70%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#999,#333_60%,#111)] shadow-[0_3px_6px_#000] [transition:transform_.5s] after:absolute after:top-[6%] after:left-[48%] after:h-[30%] after:w-[4%] after:bg-white after:content-['']"
          style="transform:rotate({-ch * 37}deg)"
        ></div>
        <div class="w-4/5 flex-1 rounded-[6px] bg-[repeating-linear-gradient(0deg,#000_0_3px,#2a2724_3px_7px)]"></div>
      </div>
    </div>
    <div class="absolute top-1/2 right-[3vw] origin-right [transform:translateY(-50%)_rotate(90deg)] font-lcd text-[22px] font-normal tracking-[.3em] whitespace-nowrap text-orange max-[900px]:hidden">KEEP SCROLLING · NO ADS</div>
  </div>
</section>

<style>
  @keyframes -global-surf-trk { 0% { top: 110%; opacity: 1 } 85% { opacity: 1 } 100% { top: -30%; opacity: 0 } }
  @keyframes -global-surf-slash { 0% { top: -12%; opacity: 1 } 100% { top: 112%; opacity: 1 } }
  @keyframes -global-surf-slashr { 0% { top: 112%; opacity: 1 } 100% { top: -12%; opacity: 1 } }
  @keyframes -global-surf-blink { 50% { opacity: 0 } }
  @keyframes -global-surf-tvshake {
    0% { transform: translateX(-5px) skewX(1.5deg) }
    15% { transform: translateX(6px) skewX(-2deg) }
    30% { transform: translateX(-3px) }
    45% { transform: translateX(4px) skewX(1deg) }
    60% { transform: translateX(-6px) skewX(-1deg) }
    80% { transform: translateX(2px) }
    100% { transform: none }
  }
</style>
