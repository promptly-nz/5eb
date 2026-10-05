<script lang="ts">
  import { pad } from '../../lib/util'

  let now = $state(new Date())
  $effect(() => {
    const iv = setInterval(() => (now = new Date()), 500)
    return () => clearInterval(iv)
  })
  const text = $derived(pad(now.getHours()) + (now.getSeconds() % 2 ? ':' : ' ') + pad(now.getMinutes()))
</script>

<div class="pointer-events-none fixed top-3.5 right-[18px] max-[640px]:hidden z-[950] font-lcd text-[26px] tracking-[.1em] whitespace-pre text-phos [text-shadow:0_0_8px_var(--color-phos)]">{text}</div>
