<script lang="ts">
  // TV static. Only draws while `active`, to save cycles.
  let { active }: { active: boolean } = $props()

  let canvas: HTMLCanvasElement

  $effect(() => {
    if (!active) return
    const x = canvas.getContext('2d')!
    const img = x.createImageData(canvas.width, canvas.height)
    const draw = () => {
      const d = img.data
      for (let k = 0; k < d.length; k += 4) {
        const v = (Math.random() * 255) | 0
        d[k] = d[k + 1] = d[k + 2] = v
        d[k + 3] = 255
      }
      x.putImageData(img, 0, 0)
    }
    draw()
    const iv = setInterval(draw, 50)
    return () => clearInterval(iv)
  })
</script>

<canvas
  bind:this={canvas}
  class={['pointer-events-none absolute inset-0 h-full w-full [image-rendering:pixelated]', active ? 'opacity-[.62]' : 'opacity-0']}
  width="160"
  height="120"
></canvas>
