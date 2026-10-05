<script lang="ts">
  import { coarse, reduce } from '../../lib/util'

  let canvas: HTMLCanvasElement

  $effect(() => {
    if (reduce) return
    const x = canvas.getContext('2d')!
    const img = x.createImageData(canvas.width, canvas.height)
    const draw = () => {
      if (document.hidden) return
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0
        d[i] = d[i + 1] = d[i + 2] = v
        d[i + 3] = 255
      }
      x.putImageData(img, 0, 0)
    }
    const iv = setInterval(draw, coarse ? 160 : 90)
    return () => clearInterval(iv)
  })
</script>

<canvas
  bind:this={canvas}
  class="pointer-events-none fixed inset-0 z-[900] size-full opacity-[.07] [image-rendering:pixelated]"
  width="320"
  height="240"
></canvas>
