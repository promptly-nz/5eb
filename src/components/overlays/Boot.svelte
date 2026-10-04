<script lang="ts">
  import { BOOT_LINES } from '../../data/content'
  import { reduce } from '../../lib/util'

  let { off, onfinish }: { off: boolean; onfinish: () => void } = $props()

  let text = $state('')
  let ready = $state(false)

  // Types the camcorder boot log out character by character, then hands over to the site.
  $effect(() => {
    let i = 0, j = 0, out = '', t: ReturnType<typeof setTimeout>
    const tick = () => {
      if (i >= BOOT_LINES.length) {
        ready = true
        return
      }
      const line = BOOT_LINES[i]
      if (j < line.length) {
        out += line[j++]
        text = out
        t = setTimeout(tick, reduce ? 0 : 11)
      } else {
        out += '\n'
        i++
        j = 0
        text = out
        t = setTimeout(tick, reduce ? 0 : 60)
      }
    }
    tick()
    return () => clearTimeout(t)
  })
</script>

<!-- A click, tap or key press finishes the boot at any point. It's also the touch browsers need before they allow sound. -->
<svelte:window onpointerdown={() => onfinish()} onkeydown={() => onfinish()} />

<div
  class={[
    'fixed inset-0 z-[1000] grid place-items-center bg-black p-5 font-lcd text-[26px] leading-[1.3] text-phos',
    off && 'pointer-events-none animate-[crtoff_.7s_cubic-bezier(.7,0,.3,1)_forwards]',
  ]}
>
  <div class="w-[min(640px,100%)]">
    <pre class="min-h-[11.5em] font-lcd whitespace-pre-wrap [text-shadow:0_0_8px_var(--color-phos)]">{text}</pre>
    <p class={['mt-5 px-3 py-2 text-center tracking-[.08em] [text-shadow:0_0_8px_var(--color-phos)]', ready ? 'animate-blink' : 'opacity-0']}>
      ▶ CLICK ANYWHERE
    </p>
  </div>
</div>

<style>
  @keyframes -global-crtoff {
    0% { transform: scale(1); filter: brightness(1) }
    35% { transform: scaleY(.006) scaleX(1); filter: brightness(6) }
    70% { transform: scaleY(.006) scaleX(.02); filter: brightness(8) }
    100% { transform: scale(0); opacity: 0 }
  }
</style>
