<script lang="ts">
  import Star from '../ui/Star.svelte'
  import Sticker from '../ui/Sticker.svelte'
  import { LATEST, R, linkOf } from '../../data/releases'
  import { whenVisible } from '../../lib/visible'
  import { coarse, pad, reduce } from '../../lib/util'

  let hero: HTMLElement
  let timecode = $state('00:00:00:00')

  // Camcorder timecode, 25fps.
  $effect(() => {
    const t0 = performance.now()
    let iv = 0
    const run = (on: boolean) => {
      clearInterval(iv)
      if (on) iv = setInterval(tick, 40)
    }
    const tick = () => {
      const t = (performance.now() - t0) / 1000
      const f = Math.floor((t % 1) * 25), s = Math.floor(t) % 60, m = Math.floor(t / 60) % 60, h = Math.floor(t / 3600)
      timecode = [h, m, s, f].map(v => pad(v)).join(':')
    }
    const stop = whenVisible(hero, run)
    return () => {
      stop()
      clearInterval(iv)
    }
  })

  // Parallax: each .layer drifts with the pointer (data-d) and with scroll (data-s).
  $effect(() => {
    if (reduce || coarse) return // on a phone the scroll lag fights the native scroll and looks like jitter
    const layers = [...hero.querySelectorAll<HTMLElement>('.layer')]
    let mx = innerWidth / 2, my = innerHeight / 2, sy = scrollY, raf = 0
    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY }
    const loop = () => {
      sy += (scrollY - sy) * 0.15
      const nx = mx - innerWidth / 2, ny = my - innerHeight / 2
      if (sy < hero.offsetHeight * 1.2) {
        for (const l of layers) {
          const d = +(l.dataset.d ?? 0), s = +(l.dataset.s ?? 0)
          l.style.translate = `${nx * d}px ${ny * d + sy * s}px`
        }
      }
      raf = requestAnimationFrame(loop)
    }
    addEventListener('pointermove', move)
    // only run the loop while the hero is on screen
    const stop = whenVisible(hero, on => {
      cancelAnimationFrame(raf)
      if (on) loop()
    })
    return () => {
      stop()
      removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  })
</script>

<section bind:this={hero} id="hero" class="grid h-[112vh] min-h-[760px] place-items-center overflow-hidden border-b-[6px] border-orange">
  <div
    class="layer absolute -inset-[6%] animate-[shake_5s_steps(1)_infinite] bg-[url(/img/5eb/2.webp)] bg-cover bg-no-repeat bg-[position:50%_-120px] will-change-transform [filter:grayscale(1)_contrast(1.5)_brightness(.75)] [transform:scale(1.1)] before:absolute before:inset-0 before:z-[1] before:opacity-[.35] before:mix-blend-multiply before:[background:radial-gradient(#000_30%,transparent_32%)_0_0/6px_6px] before:content-[''] after:absolute after:inset-0 after:bg-orange after:opacity-80 after:mix-blend-multiply after:content-['']"
    data-d="-0.02"
    data-s="0.18"
  ></div>

  <div
    class="layer pointer-events-none absolute -top-[14vw] -left-[12vw] size-[46vw] rounded-full opacity-90 will-change-transform [background:radial-gradient(var(--color-ink)_30%,transparent_32%)_0_0/9px_9px,var(--color-orange)]"
    data-d="0.03"
    data-s="0.28"
  ></div>
  <Star class="layer will-change-transform" n={14} data-d="-0.05" data-s="0.42" style="width:210px;height:210px;right:7vw;top:16vh;background:var(--color-cream)">OUT<br>NOW</Star>
  <Star class="layer will-change-transform" n={11} data-d="0.04" data-s="0.32" style="width:150px;height:150px;left:9vw;bottom:20vh">NEW<br>SINGLE</Star>

  <Sticker class="layer animate-float will-change-transform" col src={R.motionmuzik.img} caption={R.motionmuzik.title} href={linkOf(R.motionmuzik)} data-d="0.045" data-s="0.5" style="width:23vw;max-width:340px;aspect-ratio:1;left:5vw;top:18vh;transform:rotate(-8deg)" />
  <Sticker class="layer animate-float will-change-transform" col src={R.fendi5ive.img} caption={R.fendi5ive.title} href={linkOf(R.fendi5ive)} data-d="-0.04" data-s="0.6" style="width:21vw;max-width:300px;aspect-ratio:1;right:6vw;bottom:14vh;transform:rotate(7deg);animation-delay:-2s" />
  <Sticker class="layer animate-float will-change-transform" col src={R.highbernation.img} caption={R.highbernation.title} href={linkOf(R.highbernation)} data-d="0.06" data-s="0.4" style="width:15vw;max-width:210px;aspect-ratio:1;right:23vw;top:9vh;transform:rotate(14deg);animation-delay:-4s" />

  <div
    class="layer pointer-events-none absolute bottom-[9vh] left-[34vw] h-[46px] w-[110px] -rotate-6 border-[6px] border-white will-change-transform [background:repeating-linear-gradient(90deg,#000_0_2px,transparent_2px_4px,#000_4px_5px,transparent_5px_9px,#000_9px_12px,transparent_12px_14px),#fff]"
    data-d="0.02"
    data-s="0.2"
  ></div>

  <h1
    class="layer relative z-5 text-center font-anton text-[clamp(190px,40vw,620px)] leading-[.8] tracking-[-.02em] text-cream will-change-transform select-none [text-shadow:12px_12px_0_#000] before:absolute before:top-0 before:left-0 before:w-full before:animate-[gl1_3.1s_steps(1)_infinite] before:text-orange before:mix-blend-screen before:[text-shadow:none] before:[transform:translate(-9px,0)] before:content-[attr(data-t)] after:absolute after:top-0 after:left-0 after:w-full after:animate-[gl2_2.7s_steps(1)_infinite] after:text-cyan-fx after:mix-blend-screen after:[text-shadow:none] after:[transform:translate(9px,0)] after:content-[attr(data-t)]"
    data-d="0.012"
    data-s="0.08"
    data-t="5EB"
  >5EB</h1>
  <a href={linkOf(LATEST)} target="_blank" rel="noopener" class="absolute bottom-[18%] left-1/2 z-[9] border-[3px] border-orange bg-black px-4 py-1.5 font-anton text-[clamp(20px,3vw,38px)] tracking-[.14em] whitespace-nowrap text-orange uppercase [transform:translateX(-50%)_rotate(-2deg)]">{LATEST.title} · Out now</a>

  <div class="pointer-events-none absolute inset-0 z-[8] font-lcd text-[28px] text-white [text-shadow:0_0_6px_rgba(0,0,0,.8)]">
    <i class="absolute top-[70px] left-[4vw] size-12 border-[3px] border-r-0 border-b-0 border-white"></i>
    <i class="absolute top-[70px] right-[4vw] size-12 border-[3px] border-b-0 border-l-0 border-white"></i>
    <i class="absolute bottom-[60px] left-[4vw] size-12 border-[3px] border-t-0 border-r-0 border-white"></i>
    <i class="absolute right-[4vw] bottom-[60px] size-12 border-[3px] border-t-0 border-l-0 border-white"></i>
    <div class="absolute top-1/2 left-1/2 aspect-video w-[min(52vw,640px)] border-2 border-dashed border-[rgba(255,255,255,.35)] [transform:translate(-50%,-50%)] max-[900px]:hidden"></div>
    <div class="absolute top-[76px] left-[calc(4vw+66px)] flex items-center gap-2.5 tracking-[.1em] before:size-4 before:animate-blink before:rounded-full before:bg-rec before:shadow-[0_0_12px_var(--color-rec)] before:content-['']">REC <span>SP</span></div>
    <div class="absolute top-[76px] right-[calc(4vw+66px)] tracking-[.1em] max-[640px]:top-[104px] max-[640px]:right-auto max-[640px]:left-[calc(4vw+66px)]">{timecode}</div>
    <div class="absolute bottom-[68px] left-[calc(4vw+66px)] tracking-[.14em] max-[640px]:hidden">▶ PLAY &nbsp; AUTO FOCUS &nbsp; ▮▮▮▯</div>
    <div class="absolute right-[calc(4vw+66px)] bottom-[68px] text-right leading-[.9] text-orange">02 OCT 2004<br>16:48</div>
  </div>
  <div class="absolute bottom-14 left-1/2 z-[9] animate-[bob_1.4s_infinite] font-lcd text-[22px] tracking-[.2em] text-phos [transform:translateX(-50%)]">▼ SCROLL TO CHANGE CHANNEL ▼</div>
</section>

<style>
  @keyframes -global-shake {
    0% { transform: scale(1.1) }
    20% { transform: scale(1.1) translate(-3px, 2px) }
    22% { transform: scale(1.1) }
    60% { transform: scale(1.1) translate(2px, -3px) }
    61% { transform: scale(1.1) }
    85% { transform: scale(1.1) translate(3px, 1px) }
    86% { transform: scale(1.1) }
  }
  @keyframes -global-gl1 {
    0% { clip-path: inset(0 0 70% 0); transform: translate(-9px, 0) }
    7% { clip-path: inset(30% 0 40% 0); transform: translate(-22px, 3px) }
    9% { clip-path: inset(0 0 70% 0); transform: translate(-9px, 0) }
    40% { clip-path: inset(60% 0 8% 0); transform: translate(14px, -2px) }
    43% { clip-path: inset(0 0 70% 0); transform: translate(-9px, 0) }
    78% { clip-path: inset(10% 0 55% 0); transform: translate(-30px, 0) }
    80% { clip-path: inset(0 0 70% 0); transform: translate(-9px, 0) }
  }
  @keyframes -global-gl2 {
    0% { clip-path: inset(65% 0 0 0); transform: translate(9px, 0) }
    12% { clip-path: inset(20% 0 55% 0); transform: translate(26px, -3px) }
    14% { clip-path: inset(65% 0 0 0); transform: translate(9px, 0) }
    52% { clip-path: inset(40% 0 30% 0); transform: translate(-14px, 2px) }
    55% { clip-path: inset(65% 0 0 0); transform: translate(9px, 0) }
    90% { clip-path: inset(0 0 80% 0); transform: translate(34px, 0) }
    92% { clip-path: inset(65% 0 0 0); transform: translate(9px, 0) }
  }
  @keyframes -global-bob {
    50% { transform: translate(-50%, 8px) }
  }
</style>
