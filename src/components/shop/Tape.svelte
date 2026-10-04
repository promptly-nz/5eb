<script lang="ts">
  import Stage from './Stage.svelte'
  import { Spinner } from '../../lib/spin.svelte'
  import { pad } from '../../lib/util'
  import type { Product } from '../../data/products'

  // The cassette: press play or drag along it to wind the reels. The two hubs are cropped straight
  // from the photo and spun on top of it; the maker's label is hidden under our masking tape.
  let { item, index, color }: { item: Product; index: number; color: string } = $props()

  const spin = new Spinner(170)
  let x = 0
  let at = 0

  const counter = $derived(pad(Math.abs(Math.floor(spin.angle / 40)) % 1000, 3))

  function onpointerdown(e: PointerEvent) {
    if ((e.target as HTMLElement).closest('button')) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    x = e.clientX
    at = performance.now()
    spin.drag(0, 1000)
  }

  function onpointermove(e: PointerEvent) {
    if (!(e.buttons & 1)) return
    const now = performance.now()
    spin.drag((e.clientX - x) * 1.6, now - at)
    x = e.clientX
    at = now
  }

  $effect(() => () => spin.destroy())

  const HUB = 'absolute aspect-square w-[10.2%]'
</script>

<Stage no={index + 1} stock={item.stock} ratio={item.ratio} hint="DRAG ALONG IT TO WIND · OR PRESS PLAY" class="touch-none" {onpointerdown} {onpointermove} onpointerup={() => spin.release()}>
  <div class="absolute inset-0 -rotate-3 [filter:drop-shadow(7px_10px_0_rgba(0,0,0,.5))]">
    <img class="size-full" src="/img/shop/cassette.webp" alt="" draggable="false" />
    <img class={HUB} style="left:24.2%;top:37.5%;transform:rotate({spin.angle}deg)" src="/img/shop/hubL.webp" alt="" draggable="false" />
    <img class={HUB} style="left:65.7%;top:36.8%;transform:rotate({spin.angle * 0.8}deg)" src="/img/shop/hubR.webp" alt="" draggable="false" />
    <!-- handwritten index line -->
    <div class="absolute -rotate-1 font-marker text-[4.6em] leading-none text-[#15130f]" style="left:29%;top:11.5%;width:62%">5EB VOL.1 — N17 · side A</div>
    <!-- masking tape over the maker's label -->
    <div
      class="absolute flex items-center justify-between px-[2.5em] shadow-[0_2px_0_rgba(0,0,0,.45)] [clip-path:polygon(0_6%,2%_0,98%_4%,100%_0,100%_94%,98%_100%,2%_96%,0_100%)]"
      style="left:4%;top:56.5%;width:91.5%;height:15.5%;background:{color};transform:rotate(.6deg)"
    >
      <b class="font-marker text-[6em] leading-none font-normal text-[#111]">5EB · VOL.1</b>
      <span class="font-marker text-[4.4em] leading-none text-[#111]">No. 073 / 100</span>
    </div>
    {#if !item.stock}
      <div class="pointer-events-none absolute top-[28%] left-[18%] -rotate-12 border-[0.7em] border-[#d11]/85 px-[3em] py-[.5em] font-anton text-[12em] leading-none tracking-[.06em] text-[#d11]/85 uppercase">Sold out</div>
    {/if}
  </div>
  {#snippet after()}
    <div class="absolute bottom-7 left-2.5 z-[6] flex items-center gap-2">
      <button type="button" class="border-2 border-black bg-orange px-3 py-0.5 font-anton text-[18px] tracking-[.06em] text-black uppercase hover:bg-white" onclick={() => spin.toggle()}>{spin.playing ? '■ Stop' : '▶ Play'}</button>
      <span class="bg-black px-2 font-lcd text-[19px] tracking-[.1em] text-phos">CTR {counter}</span>
    </div>
  {/snippet}
</Stage>
