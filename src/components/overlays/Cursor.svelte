<script lang="ts">
  let el: HTMLDivElement
  let down = $state(false)

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

<svelte:window onpointerdown={() => (down = true)} onpointerup={() => (down = false)} />

<div
  class={[
    'pointer-events-none fixed top-0 left-0 z-[999] mix-blend-difference [transition:width_.15s,height_.15s,margin_.15s] pointer-coarse:hidden',
    down ? 'ml-[-15px] mt-[-15px] size-[30px]' : 'ml-[-23px] mt-[-23px] size-[46px]',
  ]}
  bind:this={el}
>
  <i class="absolute top-0 left-0 size-3 border-2 border-r-0 border-b-0 border-white"></i>
  <i class="absolute top-0 right-0 size-3 border-2 border-b-0 border-l-0 border-white"></i>
  <i class="absolute bottom-0 left-0 size-3 border-2 border-t-0 border-r-0 border-white"></i>
  <i class="absolute right-0 bottom-0 size-3 border-2 border-t-0 border-l-0 border-white"></i>
  <b class="absolute top-1/2 left-1/2 m-[-2px] size-1 rounded-full bg-white"></b>
</div>
