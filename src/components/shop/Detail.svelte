<script lang="ts">
  import { money, type Product } from '../../data/products'

  interface Selection { c: number; z: string; q: number }

  let { item, s, onsetcolour, onsetsize, onqty, onadd }: {
    item: Product
    s: Selection
    onsetcolour: (k: number) => void
    onsetsize: (z: string) => void
    onqty: (d: number) => void
    onadd: () => void
  } = $props()

  const OL = 'mt-2.5 mb-1 flex justify-between font-lcd text-[18px] tracking-[.14em] text-[#8a8070] uppercase'

  const stock = $derived(item.stock)
  const guide = $derived(item.guide?.find(g => g[0] === s.z))
</script>

<div class="flex min-w-0 flex-col">
  <h3 class="text-[clamp(34px,3.4vw,54px)] tracking-[.01em] text-white">{item.n}</h3>
  <div class="mt-2 flex items-baseline gap-3">
    <span class="font-anton text-[clamp(34px,3vw,46px)] leading-none text-orange">{money(item.p)}</span>
    <span class="font-anton text-[22px] text-[#776] line-through">{money(item.was)}</span>
    <span class={['ml-auto font-lcd text-[18px] tracking-[.1em]', !stock ? 'text-[#999]' : stock < 10 ? 'animate-blink text-[#ff5a4a]' : 'text-phos']}>
      {stock ? (stock < 10 ? '● ONLY ' + stock + ' LEFT' : '● IN STOCK') : '○ SOLD OUT'}
    </span>
  </div>
  <p class="my-2.5 max-w-[34em] font-narrow text-[16px] leading-[1.3] font-bold text-[#cfc6b4]">{item.d}</p>
  {#key item.id}
    <div class="border-t-2 border-dashed border-[#3a342c]">
      {#each item.spec as r, i}
        <div
          class="grid animate-row-in grid-cols-[78px_1fr] gap-2 border-b border-dashed border-[#2a2622] py-[3px] font-lcd text-[17px] leading-[1.1] tracking-[.06em] uppercase [animation-delay:calc(var(--i)*.08s)]"
          style="--i:{i}"
        ><b class="font-normal text-orange">{r[0]}</b><span class="text-cream">{r[1]}</span></div>
      {/each}
    </div>
  {/key}
  <div class={OL}><span>{item.kind === 'tape' ? 'Label' : item.kind === 'stickers' ? 'Edge' : item.kind === 'disc' ? 'Finish' : 'Colour'} <em class="text-cream not-italic">{item.cols[s.c][0]}</em></span></div>
  <div class="flex gap-2">
    {#each item.cols as c, k}
      <button
        type="button"
        class={[
          'size-[34px] border-[3px] border-black bg-(--sw) [transition:.12s] hover:[transform:translateY(-3px)]',
          k === s.c ? 'shadow-[0_0_0_3px_var(--color-orange)]' : 'shadow-[0_0_0_2px_#3a342c]',
        ]}
        style="--sw:{c[1]}"
        aria-label={c[0]}
        onclick={() => onsetcolour(k)}
      ></button>
    {/each}
  </div>
  {#if item.sz}
    <div class={OL}>
      <span>Size <em class="text-cream not-italic">{s.z}</em></span>
      {#if guide}<span>chest {guide[1]} · length {guide[2]} cm</span>{/if}
    </div>
    <div class="flex flex-wrap gap-2">
      {#each item.sz as z}
        <button
          type="button"
          class={[
            'min-w-[46px] border-2 px-2 py-0.5 font-anton text-[20px]',
            z === s.z ? 'border-orange bg-orange text-black' : 'border-[#4a4238] bg-[#12100e] text-cream hover:border-orange',
          ]}
          onclick={() => onsetsize(z)}>{z}</button>
      {/each}
    </div>
  {/if}
  <div class="mt-auto flex items-stretch gap-2.5 pt-3">
    <div class="flex items-center border-[3px] border-[#4a4238] bg-[#12100e]">
      <button type="button" class="w-8 font-anton text-[24px] text-orange" aria-label="less" onclick={() => onqty(-1)}>-</button>
      <span class="min-w-[28px] text-center font-anton text-[24px]">{s.q}</span>
      <button type="button" class="w-8 font-anton text-[24px] text-orange" aria-label="more" onclick={() => onqty(1)}>+</button>
    </div>
    <button
      type="button"
      class="flex-1 border-4 border-black bg-orange px-4 py-1.5 font-anton text-[24px] tracking-[.06em] text-black uppercase shadow-[5px_5px_0_var(--color-cream)] [transition:.1s] enabled:hover:bg-white enabled:hover:shadow-[3px_3px_0_var(--color-cream)] enabled:hover:[transform:translate(2px,2px)] disabled:bg-[#3a342c] disabled:text-[#8a8070] disabled:shadow-none"
      disabled={!stock}
      onclick={onadd}>{stock ? 'Add to bag' : 'Sold out'}</button>
  </div>
</div>
