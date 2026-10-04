<script lang="ts">
  import Noise from '../ui/Noise.svelte'
  import LowerThird from '../ui/LowerThird.svelte'
  import { TRACKS } from '../../data/content'
  import { blip, burst } from '../../lib/audio.svelte'
  import { music, playSongs, stopMusic } from '../../lib/music.svelte'
  import { pad } from '../../lib/util'
  import { untrack } from 'svelte'

  let section: HTMLElement
  let sel = $state(0)
  let swap = $state(0) // bumped on every selection so the glitch animation replays
  let flash = $state(false)

  const track = $derived(TRACKS[sel])
  const playing = $derived(music.src === 'dvd' && music.playing && music.song?.id === track[3])
  const SONGS = TRACKS.map(t => ({ id: t[3], title: t[0] }))

  // PLAY ALL: when a track ends the next one starts, and the menu follows along
  $effect(() => {
    const id = music.src === 'dvd' ? music.song?.id : undefined
    if (!id) return
    untrack(() => {
      const k = TRACKS.findIndex(t => t[3] === id)
      if (k >= 0 && k !== sel) {
        sel = k
        swap++
      }
    })
  })

  function pick(i: number) {
    sel = (i + TRACKS.length) % TRACKS.length
    swap++
    blip(700, 0.05)
  }

  function enter(i: number) {
    sel = (i + TRACKS.length) % TRACKS.length
    swap++
    if (music.src === 'dvd' && music.song?.id === TRACKS[sel][3]) stopMusic('dvd')
    else playSongs('dvd', SONGS, { index: sel })
    blip(1400, 0.05)
    flash = true
    burst()
    setTimeout(() => (flash = false), 300)
  }

  function onkeydown(e: KeyboardEvent) {
    const r = section.getBoundingClientRect()
    if (!(r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.3)) return
    if (e.key === 'ArrowDown') { e.preventDefault(); pick(sel + 1) }
    if (e.key === 'ArrowUp') { e.preventDefault(); pick(sel - 1) }
    if (e.key === 'Enter') enter(sel)
  }
</script>

<svelte:window {onkeydown} />

<section bind:this={section} id="dvd" class="border-t-[6px] border-solid border-orange bg-[#050505] px-[4vw] pt-[110px] pb-[120px]">
  <div class="mb-[30px] flex flex-wrap gap-[30px] font-lcd text-[24px] font-normal tracking-[.2em] text-[#777]">
    <span class="text-phos [text-shadow:0_0_8px_var(--color-phos)]">MAIN MENU</span><span>PLAY ALL</span><span>CHAPTERS</span><span>EXTRAS</span><span>SUBTITLES: OFF</span>
  </div>
  <div class="grid grid-cols-[1fr_1.15fr] items-start gap-[4vw] max-[900px]:grid-cols-1">
    <ul>
      {#each TRACKS as t, i}
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_mouse_events_have_key_events, a11y_no_noninteractive_element_interactions -->
        <li
          class={[
            "relative flex items-baseline gap-[18px] border-b-2 border-dashed border-[#333] py-[14px] pr-3 font-anton text-[clamp(30px,4vw,56px)] leading-none font-normal uppercase [transition:.12s]",
            "before:absolute before:top-1/2 before:left-[10px] before:text-[28px] before:text-orange before:content-['▶'] before:[transition:.15s]",
            i === sel
              ? 'bg-[linear-gradient(90deg,rgba(240,112,0,.35),transparent)] pl-[70px] text-cream before:[transform:translateY(-50%)_scale(1)]'
              : 'pl-[54px] text-[#6d6558] before:[transform:translateY(-50%)_scale(0)]',
          ]}
          onmouseenter={() => pick(i)}
          onclick={() => enter(i)}
        >{pad(i + 1)} {t[0]}<small class={['ml-auto font-lcd text-[22px] font-normal tracking-[.1em]', i === sel ? 'text-phos' : 'text-[#555]']}>{t[1]}</small></li>
      {/each}
    </ul>
    <div>
      <div class="relative aspect-[4/3] overflow-hidden rounded-[14px] border-[6px] border-solid border-[#1c1c1c] bg-black shadow-[0_0_0_3px_#555,12px_12px_0_var(--color-orange)]">
        {#key swap}
          <div
            class="absolute inset-0 bg-cover bg-center [animation:dvd-swap_.35s_steps(2),kb_9s_ease-in-out_infinite_alternate]"
            style="background-image:url(/img/{track[2]})"
          ></div>
        {/key}
        <div class="crtfx"></div>
        <div class="absolute top-[10px] right-[14px] font-lcd text-[28px] font-normal text-white [text-shadow:0_0_6px_#000]">CH {pad(sel + 1)}</div>
        {#key swap}
          <LowerThird class="bottom-[10%]" title={track[0]} subtitle={playing ? '▶ NOW PLAYING' : '5EB · ' + track[1]} />
        {/key}
        <Noise active={flash} />
      </div>
      <div class="mt-[22px] [font-family:VT323] text-[22px] font-normal tracking-[.12em] text-[#777]">ENTER play or stop</div>
    </div>
  </div>
</section>

<style>
  @keyframes -global-dvd-swap {
    0% { transform: translateX(-14px) scaleY(1.2); filter: hue-rotate(90deg) contrast(3) }
    50% { transform: translateX(18px); filter: invert(1) }
  }
</style>
