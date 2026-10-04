<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  // Taped-on polaroid. Extra attributes (data-*, etc.) fall through to the <figure>.
  // `flow` puts it in normal layout (relative) instead of absolutely positioned.
  let { src, caption, href, col = false, flow = false, class: cls = '', ...rest }: {
    src: string
    caption: string
    /** makes the whole print a link (opens in a new tab) */
    href?: string
    col?: boolean
    flow?: boolean
  } & HTMLAttributes<HTMLElement> = $props()
</script>

<figure
  class={[
    flow ? 'relative' : 'absolute',
    "bg-white pt-[7px] pr-[7px] pb-6 pl-[7px] shadow-[4px_5px_0_rgba(0,0,0,.7)]",
    "before:absolute before:-top-[11px] before:left-1/2 before:h-[19px] before:w-[60px] before:-translate-x-1/2 before:-rotate-3 before:bg-[rgba(240,226,150,.85)] before:content-['']",
    cls,
  ]}
  {...rest}
>
  {#if href}<a class="absolute inset-0 z-10" data-cursor="LISTEN" {href} target="_blank" rel="noopener" aria-label="Listen to {caption}"></a>{/if}
  <img
    src="/img/{src}"
    alt=""
    class={['block h-full w-full object-cover', col ? 'contrast-[1.1] saturate-[1.2]' : 'grayscale contrast-[1.4]']}
  />
  <figcaption class="absolute right-2 bottom-0.5 left-2 text-center font-marker text-[15px] text-[#111]">{caption}</figcaption>
</figure>
