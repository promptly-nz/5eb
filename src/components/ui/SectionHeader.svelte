<script lang="ts">
  import type { Snippet } from 'svelte'

  // The big outlined section title with a hand-written tag on the right.
  // Layout (padding, margin, positioning) is up to the caller via `class`.
  // `tone` swaps the colour scheme: light (default), ink (on orange), lcd (on the Nokia screen).
  let { title, tag, tone = 'light', size = 'lg', class: cls = '' }: {
    title: string
    tag?: string | Snippet
    tone?: 'light' | 'ink' | 'lcd'
    size?: 'md' | 'lg'
    class?: string
  } = $props()

  const SIZE = { md: 'text-[clamp(44px,6vw,84px)]', lg: 'text-[clamp(54px,9vw,140px)]' }

  const TITLE = {
    light: 'text-cream [text-shadow:5px_5px_0_var(--color-orange)]',
    ink: 'text-black [text-shadow:5px_5px_0_var(--color-cream)]',
    lcd: 'text-[#16240f] [text-shadow:6px_6px_0_rgba(22,36,15,.28)] animate-[lcd-flicker_4s_steps(1)_infinite]',
  }
  const TAG = { light: 'text-orange', ink: 'text-black', lcd: 'text-[#16240f]' }
</script>

<div class={['flex items-end justify-between gap-5', cls]}>
  <h2 class={[SIZE[size], TITLE[tone]]}>{title}</h2>
  {#if tag}
    <div class={['-rotate-3 text-right font-marker text-[24px]', TAG[tone]]}>
      {#if typeof tag === 'string'}{tag}{:else}{@render tag()}{/if}
    </div>
  {/if}
</div>

<style>
  @keyframes -global-lcd-flicker {
    0%, 96%, 100% { opacity: 1 }
    97% { opacity: .55 }
    98% { opacity: 1 }
    99% { opacity: .7 }
  }
</style>
