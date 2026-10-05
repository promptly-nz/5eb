<script lang="ts">
  import Stage from './Stage.svelte'
  import { untrack } from 'svelte'
  import { CD_QUEUE } from '../../data/music'
  import { music, toggleMusic } from '../../lib/music.svelte'
  import { Spinner } from '../../lib/spin.svelte'
  import { LATEST_ALBUM, LATEST_ALBUM_TRACKS } from '../../data/releases'
  import type { Product } from '../../data/products'

  // The CD-R: grab it and spin it, or hit play. A rainbow glint sits over the photo like the real
  // dye layer does and swings round with the pointer. Everything scribbled on the label is ours,
  // stuck over the maker's printing.
  let { item, index, ci }: { item: Product; index: number; ci: number } = $props()

  const spin = new Spinner(560)
  let frame = $state<HTMLElement>()
  let pa = $state(40)
  let from = 0
  let at = 0

  const black = $derived(ci === 1)
  const url = '/img/shop/cd.webp'

  function angleAt(e: PointerEvent) {
    const r = frame!.getBoundingClientRect()
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI
  }

  function onpointerdown(e: PointerEvent) {
    if ((e.target as HTMLElement).closest('button')) return
    frame!.setPointerCapture(e.pointerId)
    from = angleAt(e)
    at = performance.now()
    spin.drag(0, 1000)
  }

  function onpointermove(e: PointerEvent) {
    const a = angleAt(e)
    pa = a + 40
    if (!(e.buttons & 1)) return
    let d = a - from
    if (d > 180) d -= 360
    if (d < -180) d += 360
    const now = performance.now()
    spin.drag(d, now - at)
    from = a
    at = now
  }

  // keyboard: Space/Enter plays or stops, left/right spin it by hand
  function onkeydown(e: KeyboardEvent) {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      spin.drag(e.key === 'ArrowLeft' ? -45 : 45, 70)
      spin.release()
    }
  }

  // the real music drives the spin: it plays while the track does
  const live = $derived(music.src === 'cd' && music.playing)
  $effect(() => {
    const on = live
    untrack(() => spin.set(on))
  })
  const toggle = () => toggleMusic('cd', CD_QUEUE)

  $effect(() => () => spin.destroy())
</script>

<Stage bind:frame no={index + 1} stock={item.stock} ratio={item.ratio} hint="DRAG TO SPIN · CATCH THE LIGHT" class="touch-none" tabindex={0} role="group" aria-label="{item.n} photo. Space plays or stops it, left and right arrows spin it." data-keys {onkeydown} {onpointerdown} {onpointermove} onpointerup={() => spin.release()}>
  <div class="absolute inset-0 [filter:drop-shadow(7px_10px_0_rgba(0,0,0,.5))]">
    <div class="absolute inset-0" style="transform:rotate({spin.angle}deg)">
      <img class="size-full" style={black ? 'filter:brightness(.26) contrast(1.5) saturate(.4) hue-rotate(200deg)' : ''} src={url} alt="" draggable="false" />
      <!-- sticker over the maker's logo -->
      <div class="absolute flex -rotate-2 items-center gap-[2em] bg-cream px-[2.5em] shadow-[1px_2px_0_rgba(0,0,0,.5)]" style="left:21%;top:8.5%;width:56%;height:14.5%">
        <img class="h-[88%]" src="/img/logo.png" alt="" draggable="false" />
        <b class="font-marker text-[5.2em] leading-none font-normal whitespace-nowrap text-[#111]">{LATEST_ALBUM.title.toUpperCase()}</b>
      </div>
      <!-- marker on the writing lines -->
      <div class="absolute -rotate-[5deg] font-marker leading-[1.15] text-[#15130f]" style="left:11%;top:64%;width:78%">
        <div class="text-[7.6em]">{LATEST_ALBUM_TRACKS.length} tracks · no skips</div>
      </div>
    </div>
    <div
      class={['pointer-events-none absolute inset-0', black ? 'opacity-90 mix-blend-screen' : 'opacity-90 mix-blend-overlay']}
      style="background:conic-gradient(from {pa}deg,transparent 0 6%,#ff3da0 13%,#ffe23d 19%,#3dffc8 25%,#4d7bff 31%,transparent 39% 56%,#ff3da0 64%,#4dc8ff 73%,transparent 81%);-webkit-mask:url({url}) 0 0/100% 100% no-repeat;mask:url({url}) 0 0/100% 100% no-repeat"
    ></div>
  </div>
  {#snippet after()}
    <div class="absolute bottom-7 left-2.5 z-[6] flex items-center gap-2">
      <button type="button" class="border-2 border-black bg-orange px-3 py-0.5 font-anton text-[18px] tracking-[.06em] text-black uppercase hover:bg-white" onclick={toggle}>{live ? '■ Stop' : '▶ Play'}</button>
      <span class="bg-black px-2 font-lcd text-[19px] tracking-[.1em] text-phos">52X · {String(spin.rpm).padStart(4, '0')} RPM</span>
      {#if music.src === 'cd' && music.song}<span class="max-w-[9em] truncate bg-black px-2 font-lcd text-[19px] tracking-[.06em] text-phos">♪ {music.song.title}</span>{/if}
    </div>
  {/snippet}
</Stage>
