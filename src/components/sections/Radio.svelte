<script lang="ts">
  import Sticker from '../ui/Sticker.svelte'
  import { LATEST, R } from '../../data/releases'
  import SectionHeader from '../ui/SectionHeader.svelte'
  import { audio, frequencyData, setRadio, setSound } from '../../lib/audio.svelte'
  import { F0, GARBLE, STATIONS } from '../../data/content'
  import { clamp } from '../../lib/util'

  let section: HTMLElement
  let viz: HTMLCanvasElement
  let tune = $state(900)

  const f = $derived(tune / 10)
  const lock = $derived(Math.pow(clamp(1 - Math.abs(f - F0) / 1.1, 0, 1), 1.4))
  const near = $derived(STATIONS.find(s => Math.abs(s[0] - f) < 0.35 && s[0] !== F0))
  const locked = $derived(lock > 0.8)
  const status = $derived(
    locked
      ? audio.on ? `5EB FM — LIVE: "${LATEST.title.toUpperCase()}"` : '5EB FM — LOCKED · TURN SND ON'
      : near ? near[1] + ' — NOTHING BUT STATIC' : GARBLE[((f * 10) | 0) % GARBLE.length],
  )

  // Mix between static and beat as the dial nears 5EB.
  $effect(() => { setRadio({ lock, near: !!near }) })

  // The radio is loudest when it's centred on screen.
  function onscroll() {
    const r = section.getBoundingClientRect()
    const c = r.top + r.height / 2 - innerHeight / 2
    setRadio({ presence: clamp(1 - Math.abs(c) / (innerHeight * 0.9), 0, 1) })
  }

  function seek() {
    if (!audio.on) setSound(true)
    const from = tune, to = F0 * 10
    let k = 0
    const iv = setInterval(() => {
      k += 0.04
      tune = Math.round(from + (to - from) * (1 - Math.pow(1 - clamp(k, 0, 1), 3)) + (1 - k) * (Math.sin(k * 40) * 18))
      if (k >= 1) {
        tune = to
        clearInterval(iv)
      }
    }, 30)
  }

  // LED-bar spectrum: real FFT when sound is on, a faked wobble otherwise.
  $effect(() => {
    const vx = viz.getContext('2d')!
    let raf = 0
    const draw = () => {
      const w = viz.width, h = viz.height, n = 32, bw = w / n
      vx.clearRect(0, 0, w, h)
      const data = frequencyData()
      const t = performance.now() / 1000
      for (let i = 0; i < n; i++) {
        const v = data
          ? data[i] / 255
          : Math.abs(Math.sin(t * 5 + i * 0.7)) * 0.5 * lock + Math.random() * 0.15 * (1 - lock) + (lock > 0.8 ? Math.abs(Math.sin(t * 9 + i)) * 0.4 : 0)
        const segs = Math.floor(Math.max(2, v * h) / 6)
        for (let s = 0; s < segs; s++) {
          vx.fillStyle = s > 9 ? '#ff4a2a' : '#9bf06a'
          vx.fillRect(i * bw + 1, h - (s + 1) * 6, bw - 3, 4)
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  })
</script>

<svelte:window {onscroll} />

<section
  bind:this={section}
  id="radio"
  class="overflow-hidden border-y-[6px] border-solid border-black bg-orange px-[4vw] pt-[120px] pb-[140px] text-black before:absolute before:inset-0 before:opacity-[.12] before:content-[''] before:[background:radial-gradient(#000_25%,transparent_27%)_0_0/12px_12px]"
>
  <SectionHeader class="mb-[30px] px-[4vw]" tone="ink" title="Fendi Radio" tag="tune in · don't tell the landlord" />
  <div class="relative grid grid-cols-[1.25fr_1fr] items-center gap-[5vw] max-[900px]:grid-cols-1">
    <div class="relative rounded-[26px] border-[5px] border-solid border-black bg-[linear-gradient(#2c2926,#0f0e0d)] p-[26px] text-cream shadow-[12px_12px_0_#000]">
      <div class="grid grid-cols-[150px_1fr] gap-[22px] max-[900px]:grid-cols-1">
        <div class="min-h-[150px] rounded-[14px] shadow-[inset_0_0_12px_#000] [background:radial-gradient(#000_35%,transparent_38%)_0_0/12px_12px,#3a3632] max-[900px]:min-h-[50px]"></div>
        <div class="relative overflow-hidden rounded-lg border-4 border-solid border-black bg-[#0c150a] px-[14px] py-[10px] shadow-[inset_0_0_20px_#000,0_0_0_2px_#555]">
          <div
            class={[
              'absolute top-[10px] right-[12px] [font-family:VT323] text-[22px] font-normal tracking-[.1em]',
              locked ? 'animate-blink text-rec [text-shadow:0_0_10px_var(--color-rec)]' : 'text-[#244]',
            ]}
          >● ON AIR</div>
          <div class="font-lcd text-[clamp(46px,6vw,78px)] leading-[.9] font-normal text-phos [text-shadow:0_0_12px_var(--color-phos)]">{f.toFixed(1)}<small class="ml-2 text-[.4em]">FM</small></div>
          <canvas bind:this={viz} class="block h-[70px] w-full" width="400" height="70"></canvas>
          <div class="min-h-[1.2em] font-lcd text-[22px] font-normal tracking-[.1em] text-phos">{status}</div>
        </div>
      </div>
      <div class="relative mt-[26px] h-[86px]">
        <div class="absolute inset-x-0 top-[34px] h-[30px] opacity-70 [-webkit-mask:linear-gradient(transparent,#000_10%)] [background:repeating-linear-gradient(90deg,var(--color-cream)_0_2px,transparent_2px_calc(100%_/_41)),linear-gradient(var(--color-cream),var(--color-cream))_0_100%/100%_2px_no-repeat] [mask:linear-gradient(transparent,#000_10%)]"></div>
        {#each STATIONS as [freq, name]}
          <span
            class={[
              "absolute top-0 -translate-x-1/2 font-lcd text-[17px] font-normal tracking-[.06em] whitespace-nowrap after:absolute after:top-[18px] after:left-1/2 after:h-[14px] after:w-px after:bg-[#aaa] after:content-['']",
              freq === F0 ? 'text-orange' : 'text-[#aaa]',
            ]}
            style="left:{((freq - 87.5) / 20.5) * 100}%">{name}</span>
        {/each}
        <input
          id="tune"
          class="absolute top-[14px] left-0 m-0 h-[70px] w-full appearance-none bg-transparent [&::-moz-range-thumb]:h-[74px] [&::-moz-range-thumb]:w-[10px] [&::-moz-range-thumb]:rounded-[2px] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-orange [&::-webkit-slider-thumb]:h-[74px] [&::-webkit-slider-thumb]:w-[10px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-[2px] [&::-webkit-slider-thumb]:bg-orange [&::-webkit-slider-thumb]:shadow-[0_0_14px_var(--color-orange),0_0_0_2px_#000]"
          type="range"
          min="875"
          max="1080"
          bind:value={tune}
          aria-label="Tune radio"
        />
      </div>
      <div class="mt-3 flex items-center gap-1.5 font-lcd text-[20px] font-normal tracking-[.1em] text-[#aaa]">SIGNAL <span>{#each Array(10) as _, i}<i class={['inline-block h-[14px] w-[14px] rounded-[2px]', i < Math.round(lock * 10) ? 'bg-phos shadow-[0_0_8px_var(--color-phos)]' : 'bg-[#2b2b2b]']}></i>{/each}</span></div>
    </div>
    <div>
      <h3 class="text-[clamp(40px,5vw,76px)] text-black">Find the<br>frequency</h3>
      <p class="my-4 max-w-[30em] text-[20px] leading-[1.3] font-bold">Drag the dial. Somewhere between the static, a roof, a coat-hanger aerial and a box room — 5EB is on air.</p>
      <button
        type="button"
        class="inline-block border-[3px] border-solid border-black bg-black px-[18px] py-[10px] font-anton text-[22px] font-normal tracking-[.06em] text-orange uppercase shadow-[6px_6px_0_var(--color-cream)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_var(--color-cream)]"
        onclick={seek}
      >▶ Auto-seek 5EB FM</button>
      <div class="relative mt-[30px] h-[260px]">
        <Sticker col src={R.allsummalong.img} caption={R.allsummalong.title} style="width:200px;height:200px;left:0;top:0;transform:rotate(-5deg)" />
        <Sticker col src={R.ducati.img} caption={R.ducati.title} style="width:190px;height:190px;left:180px;top:30px;transform:rotate(6deg)" />
      </div>
    </div>
  </div>
</section>
