<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { pad } from '../../lib/util'

  // The dark spotlit frame every product sits in. `children` render inside a box that has the photo's
  // aspect ratio and 1em = 1% of its width, so overlays can be placed and sized in % / em of the photo.
  // `after` is for controls pinned to the frame. Extra attributes (pointer handlers) land on the frame.
  let { no, stock, ratio, hint, frame = $bindable(), children, after, class: cls = '', ...rest }: {
    no: number
    stock: number
    ratio: number
    hint?: string
    frame?: HTMLElement
    children: Snippet
    after?: Snippet
    class?: string
  } & HTMLAttributes<HTMLDivElement> = $props()

  const TAG = 'pointer-events-none absolute z-[3] px-2 py-px font-lcd text-[20px] tracking-[.12em]'
  const w = $derived(`min(80cqw,calc(80cqh*${ratio}))`)
</script>

<div
  bind:this={frame}
  class={[
    'relative h-[340px] animate-[stage-in_.4s_steps(3)_both] overflow-hidden border-[3px] border-[#2a2622] bg-[radial-gradient(circle_at_50%_38%,#3a2d20,#0b0907_78%)] select-none [container-type:size] outline-offset-2 focus-visible:outline-[3px] focus-visible:outline-orange min-[901px]:h-full',
    "after:pointer-events-none after:absolute after:inset-0 after:z-[4] after:bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.16)_0_1px,transparent_1px_3px)] after:content-['']",
    cls,
  ]}
  {...rest}
>
  <div class={[TAG, 'top-2 left-2.5 bg-orange text-black']}>NO.{pad(no)}</div>
  <div class={[TAG, 'top-2 right-2.5', stock > 0 && stock < 10 ? 'animate-blink bg-[#d11] text-white' : 'bg-black text-phos']}>
    {stock ? (stock < 10 ? 'ONLY ' + stock + ' LEFT' : stock + ' IN STOCK') : 'SOLD OUT'}
  </div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" data-fly style="width:{w};aspect-ratio:{ratio};font-size:calc({w}/100)">
    {@render children()}
  </div>
  <div class="pointer-events-none absolute inset-x-0 bottom-1.5 z-[5] text-center font-lcd text-[17px] tracking-[.14em] text-[#8a8070]">{hint}</div>
  {@render after?.()}
</div>

<style>
  @keyframes -global-stage-in {
    0% { translate: -14px 0; filter: hue-rotate(90deg) contrast(3) }
    50% { translate: 16px 0; filter: invert(1) }
  }
</style>
