<script lang="ts">
  import Noise from '../ui/Noise.svelte'
  import { CREDITS } from '../../data/products'
  import { LATEST, SOCIALS, linkOf } from '../../data/releases'
  let section: HTMLElement
  let seen = $state(false)

  // only animate the static while this section is on screen
  $effect(() => {
    const io = new IntersectionObserver(([e]) => (seen = e.isIntersecting))
    io.observe(section)
    return () => io.disconnect()
  })

  const LINK =
    "block border-[3px] border-black bg-orange px-3.5 py-2 font-anton text-[20px] tracking-[.1em] text-black uppercase shadow-[4px_4px_0_var(--color-cream)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--color-cream)]"
</script>

<section bind:this={section} id="end" class="grid h-screen h-svh min-h-[640px] place-items-center overflow-hidden pb-10">
  <div
    class="absolute -inset-x-1 inset-y-0 animate-[tv-wobble_.9s_steps(1)_infinite] [background:linear-gradient(90deg,#c0c0c0_0_14.28%,#c0c000_0_28.56%,#00c0c0_0_42.84%,#00c000_0_57.12%,#c000c0_0_71.4%,#c00000_0_85.68%,#0000c0_0)_top/100%_70%_no-repeat,linear-gradient(90deg,#0000c0_0_14.28%,#111_0_28.56%,#c000c0_0_42.84%,#111_0_57.12%,#00c0c0_0_71.4%,#111_0_85.68%,#c0c0c0_0)_0_70%/100%_8%_no-repeat,linear-gradient(90deg,#00214c_0_18%,#fff_0_36%,#32006a_0_54%,#111_0_72%,#050505_0)_0_78%/100%_22%_no-repeat] [filter:saturate(.85)_brightness(.85)] after:absolute after:inset-0 after:bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.2)_0_2px,transparent_2px_4px)] after:content-['']"
  ></div>
  <div class="pointer-events-none absolute inset-0 opacity-[.14] mix-blend-overlay"><Noise active={seen} /></div>
  <div class="pointer-events-none absolute inset-x-0 -top-[30%] h-[28%] animate-[tv-roll_7s_linear_infinite] bg-[linear-gradient(transparent,rgba(255,255,255,.1)_45%,rgba(255,255,255,.18)_55%,transparent)]"></div>
  <div class="relative z-[3] max-w-[min(92vw,680px)] animate-[float_5s_ease-in-out_infinite_alternate] border-[6px] border-orange bg-black px-10 pt-[30px] pb-[34px] text-center shadow-[12px_12px_0_var(--color-cream)]">
    <img class="mx-auto -mt-[90px] mb-2.5 size-[150px] drop-shadow-[4px_4px_0_var(--color-orange)]" src="/img/logo.png" alt="5EB" />
    <h2 class="text-[clamp(56px,10vw,128px)] text-cream">Please<br><span class="text-orange">stand by</span></h2>
    <p class="mt-3 mb-[18px] font-lcd text-[26px] tracking-[.12em] text-phos">NO SIGNAL · <a class="underline hover:text-white" href={linkOf(LATEST)} target="_blank" rel="noopener">{LATEST.title.toUpperCase()}</a> · NEXT TRANSMISSION SOON</p>
    <ul class="flex flex-wrap justify-center gap-2.5">
      {#each SOCIALS as [name, url]}
        <li><a class={LINK} href={url} target="_blank" rel="noopener" data-cursor={name.toUpperCase()}>{name}</a></li>
      {/each}
    </ul>
  </div>
  <div class="absolute inset-x-0 bottom-11 z-[3] bg-[rgba(0,0,0,.7)] px-2.5 py-0.5 text-center font-lcd text-[18px] tracking-[.06em] text-white">
    <div>Demo · Built by <a class="underline hover:text-orange" href="https://promptly.nz" target="_blank" rel="noopener">promptly.nz</a>, the greatest.</div>
    <div class="text-[15px] tracking-[.08em] text-[#9a9282]">
      Demo shop, nothing is actually sold. Shop photos from Wikimedia Commons: {CREDITS.map(c => `${c[0]} ${c[1]} (${c[2]})`).join(' · ')}
    </div>
  </div>
</section>

<style>
  /* tiny horizontal tracking wobble + brightness flicker, stepped so it reads as analogue not smooth */
  @keyframes -global-tv-wobble {
    0% { transform: translateX(0) }
    20% { transform: translateX(1px); filter: saturate(.85) brightness(.88) }
    40% { transform: translateX(-2px) }
    60% { transform: translateX(0); filter: saturate(.85) brightness(.82) }
    80% { transform: translateX(2px) }
  }
  /* a slow bright band rolling down the picture */
  @keyframes -global-tv-roll {
    to { transform: translateY(460%) }
  }
</style>
