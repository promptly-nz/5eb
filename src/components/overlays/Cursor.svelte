<script lang="ts">
  let el: HTMLDivElement
  let down = $state(false)
  // Over a link the crosshair turns into an orange pill; `data-cursor` on the link sets its label.
  let link = $state(false)
  let label = $state('')

  function onpointerover(e: PointerEvent) {
    const a = (e.target as Element).closest<HTMLElement>('a[href]')
    link = !!a
    label = a?.dataset.cursor ?? ''
  }

  // Smoothed crosshair that trails the real pointer.
  $effect(() => {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, raf = 0
    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY }
    const loop = () => {
      cx += (mx - cx) * 0.2
      cy += (my - cy) * 0.2
      el.style.transform = `translate(${cx}px,${cy}px)`
      raf = requestAnimationFrame(loop)
    }
    addEventListener('pointermove', move)
    loop()
    return () => {
      removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  })
</script>

<svelte:window {onpointerover} onpointerdown={() => (down = true)} onpointerup={() => (down = false)} />

<div
  class={[
    'pointer-events-none fixed top-0 left-0 z-[999] [transition:width_.15s,height_.15s,margin_.15s] pointer-coarse:hidden',
    link ? 'ml-[-32px] mt-[-32px] size-16' : 'mix-blend-difference',
    !link && (down ? 'ml-[-15px] mt-[-15px] size-[30px]' : 'ml-[-23px] mt-[-23px] size-[46px]'),
    link && down && 'scale-75',
  ]}
  bind:this={el}
>
  <i class={['absolute top-0 left-0 size-3 border-2 border-r-0 border-b-0', link ? 'border-orange' : 'border-white']}></i>
  <i class={['absolute top-0 right-0 size-3 border-2 border-b-0 border-l-0', link ? 'border-orange' : 'border-white']}></i>
  <i class={['absolute bottom-0 left-0 size-3 border-2 border-t-0 border-r-0', link ? 'border-orange' : 'border-white']}></i>
  <i class={['absolute right-0 bottom-0 size-3 border-2 border-t-0 border-l-0', link ? 'border-orange' : 'border-white']}></i>
  <b class={['absolute top-1/2 left-1/2 m-[-2px] size-1 rounded-full', link ? 'bg-orange' : 'bg-white']}></b>
  {#if link}
    <span class="absolute top-full left-1/2 mt-1 -translate-x-1/2 border-2 border-black bg-orange px-1.5 font-anton text-[13px] leading-[1.2] tracking-[.08em] whitespace-nowrap text-black">{label || 'OPEN'} ↗</span>
  {/if}
</div>
