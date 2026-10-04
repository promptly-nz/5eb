<script lang="ts">
  import Tinted from './Tinted.svelte'
  import type { Product } from '../../data/products'

  // A small square preview of the real photo. Garments get the live colourway; a CD spins and
  // the rest wiggle when an ancestor with the `group` class is hovered.
  let { item, color, size }: { item: Product; color: string; size: number } = $props()

  const wide = $derived(item.ratio >= 1)
</script>

<span class="grid flex-none place-items-center" style="width:{size}px;height:{size}px">
  <span
    class={[
      'block [filter:drop-shadow(2px_3px_0_rgba(0,0,0,.5))]',
      item.kind === 'disc' ? 'group-hover:animate-[spin_2.4s_linear_infinite]' : 'group-hover:animate-[wiggle_.5s_ease-in-out_infinite]',
    ]}
    style="aspect-ratio:{item.ratio};{wide ? 'width:100%' : 'height:100%'}"
  >
    {#if item.kind === 'garment'}
      <Tinted src={item.img} {color} class="relative size-full" />
    {:else}
      <img class={['size-full', item.kind === 'stickers' && 'rounded-[3px] object-cover']} src="/img/shop/{item.img}" alt="" draggable="false" />
    {/if}
  </span>
</span>

<style>
  @keyframes -global-wiggle {
    0%, 100% { transform: rotate(-4deg) }
    50% { transform: rotate(4deg) translateY(-3px) }
  }
</style>
