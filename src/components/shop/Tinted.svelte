<script lang="ts">
  import type { Snippet } from 'svelte'

  // A real photo recoloured live: the picture is a greyscale shading map with the garment's outline as
  // its alpha. A flat colour is masked to that outline and the shading is multiplied over it, so
  // creases, knit and seams survive any colourway. `under` sits below the shading (screen prints that
  // pick up the folds), `over` sits above it and gets the mask string (patches, glare).
  let { src, color, dip = false, under, over, class: cls = '' }: {
    src: string
    color: string
    /** when the colour changes, the new colour spreads up from the bottom like a dye dip */
    dip?: boolean
    under?: Snippet
    over?: Snippet<[mask: string]>
    class?: string
  } = $props()

  let prev = $state<string>()
  let last: string | undefined
  $effect(() => {
    const c = color
    if (last !== undefined && last !== c) prev = last
    last = c
  })

  const url = $derived('/img/shop/' + src)
  const mask = $derived(`-webkit-mask:url(${url}) 0 0/100% 100% no-repeat;mask:url(${url}) 0 0/100% 100% no-repeat;`)
</script>

<div class={['isolate', cls]}>
  <div class="absolute inset-0" style="background:{prev ?? color};{mask}"></div>
  {#key color}
    <div class={['absolute inset-0', dip && 'animate-[dip_.7s_ease-out_both]']} style="background:{color};{mask}"></div>
  {/key}
  {@render under?.()}
  <img class="absolute inset-0 size-full mix-blend-multiply" src={url} alt="" draggable="false" />
  {@render over?.(mask)}
</div>

<style>
  @keyframes -global-dip {
    from { clip-path: circle(0% at 50% 90%) }
    to { clip-path: circle(150% at 50% 90%) }
  }
</style>
