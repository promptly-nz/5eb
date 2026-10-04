<script lang="ts">
  import { MARQUEE_WORDS, MARQUEE_IMGS } from '../../data/content'

  const words = [...MARQUEE_WORDS, ...MARQUEE_WORDS]
  const forward = MARQUEE_IMGS
  const backward = [...MARQUEE_IMGS].reverse()

  const ROW = 'inline-flex items-center gap-10 pl-10 font-anton text-[clamp(44px,6vw,86px)] leading-[1.1] uppercase'
</script>

{#snippet row(imgs: string[])}
  <!-- two copies so the loop is seamless -->
  {#each [0, 1] as _}
    {#each words as w, i}
      <span class={[i % 3 === 1 && 'text-orange [-webkit-text-stroke:2px_#000]']}>{w}</span>
      {#if i % 2}<img
          src="/img/{imgs[(i >> 1) % imgs.length]}"
          alt=""
          class="h-[1em] w-[1.5em] max-w-none -rotate-4 border-[3px] border-black object-cover "
        />{/if}
    {/each}
  {/each}
{/snippet}

<div class="mqw relative h-[300px] overflow-hidden bg-ink">
  <div class="absolute top-9 -left-[5%] w-[110%] -rotate-3 overflow-hidden border-y-[5px] border-black bg-orange whitespace-nowrap text-black">
    <div class={[ROW, 'animate-marquee']}>{@render row(forward)}</div>
  </div>
  <div class="absolute top-[150px] -left-[5%] w-[110%] rotate-[2.2deg] overflow-hidden border-y-[5px] border-black bg-cream whitespace-nowrap text-black">
    <div class={[ROW, 'animate-[marquee_26s_linear_infinite_reverse]']}>{@render row(backward)}</div>
  </div>
</div>
