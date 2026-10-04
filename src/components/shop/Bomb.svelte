<script lang="ts">
  import Stage from './Stage.svelte'
  import { blip, burst } from '../../lib/audio.svelte'
  import { showToast } from '../../lib/toast.svelte'
  import { pad } from '../../lib/util'
  import { R } from '../../data/releases'
  import type { Product } from '../../data/products'

  // The sticker pack: click the bench to slap one down. The stickers are the cover art, die-cut with
  // a border in the chosen colour; the bench is a real photo of a sticker-bombed one.
  let { item, index, color }: { item: Product; index: number; color: string } = $props()

  interface Stuck { id: number; x: number; y: number; rot: number; src: string; round: boolean; edge: string }

  const PACK = [R.ducati, R.sexSells, R.hysteric, R.motionmuzik, R.allsummalong, R.fendi5ive, R.magic, R.lovely, R.yinYang, R.starStruck, R.highbernation, R.childi5h]
  const MAX = PACK.length

  let box: HTMLElement
  let stuck = $state<Stuck[]>([])
  let n = 0

  function slap(e: MouseEvent) {
    const r = box.getBoundingClientRect()
    place(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100)
  }

  // keyboard: Enter/Space puts one down on a random spot of the bench
  function onkeydown(e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    place(15 + Math.random() * 70, 15 + Math.random() * 70)
  }

  function place(x: number, y: number) {
    if (stuck.length >= MAX) return
    const s = PACK[stuck.length]
    stuck.push({
      id: n++,
      x,
      y,
      rot: Math.round((Math.random() - 0.5) * 50),
      src: '/img/' + s.img,
      round: stuck.length % 3 === 1,
      edge: color,
    })
    burst()
    blip(160, 0.08)
    if (stuck.length === MAX) showToast('Bus stop bombed', "12 for 12. That's the whole pack, fam.")
  }

  function peel() {
    stuck = []
    blip(700, 0.04)
  }
</script>

<Stage no={index + 1} stock={item.stock} ratio={item.ratio} hint="CLICK THE BENCH TO SLAP ONE ON">
  <div bind:this={box} class="absolute inset-0 cursor-crosshair overflow-hidden [filter:drop-shadow(7px_10px_0_rgba(0,0,0,.5))]" role="button" tabindex={0} aria-label="Slap a sticker on the bench" {onkeydown} onclick={slap}>
    <img class="size-full object-cover" src="/img/shop/{item.img}" alt="" draggable="false" />
    {#each stuck as s (s.id)}
      <img
        class={['pointer-events-none absolute aspect-square w-[15%] animate-[slap_.4s_cubic-bezier(.2,1.6,.4,1)_both] border-[0.7em] object-cover shadow-[1px_2px_0_rgba(0,0,0,.55)]', s.round ? 'rounded-full' : 'rounded-[3px]']}
        style="left:{s.x}%;top:{s.y}%;margin:-7.5% 0 0 -7.5%;border-color:{s.edge};--r:{s.rot}deg"
        src={s.src}
        alt=""
      />
    {/each}
  </div>
  {#snippet after()}
    <div class="absolute bottom-7 left-2.5 z-[6] flex items-center gap-2">
      <span class="bg-black px-2 font-lcd text-[19px] tracking-[.1em] text-phos">STUCK {pad(stuck.length)}/{MAX}</span>
      <button type="button" class="border-2 border-black bg-orange px-3 py-0.5 font-anton text-[18px] tracking-[.06em] text-black uppercase hover:bg-white disabled:opacity-40" disabled={!stuck.length} onclick={peel}>Peel off</button>
    </div>
  {/snippet}
</Stage>

<style>
  @keyframes -global-slap {
    0% { transform: scale(2.6) rotate(calc(var(--r) + 40deg)); opacity: 0 }
    55% { transform: scale(.9) rotate(var(--r)); opacity: 1 }
    100% { transform: scale(1) rotate(var(--r)) }
  }
</style>
