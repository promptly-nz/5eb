<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  // A spiky "sticker burst" badge: `n` points, clipped with a generated polygon.
  let { n = 12, style = '', class: cls = '', children, ...rest }: {
    n?: number
    children: Snippet
  } & HTMLAttributes<HTMLDivElement> = $props()

  const clip = $derived.by(() => {
    const pts: string[] = []
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 ? 38 : 50, a = (i / (n * 2)) * Math.PI * 2
      pts.push((50 + Math.cos(a) * r).toFixed(1) + '% ' + (50 + Math.sin(a) * r).toFixed(1) + '%')
    }
    return `polygon(${pts.join(',')})`
  })
</script>

<div
  class={['pointer-events-none absolute grid place-items-center bg-orange text-center font-anton text-[22px] leading-[.95] text-black uppercase', cls]}
  style="{style};clip-path:{clip}"
  {...rest}
><span>{@render children()}</span></div>
