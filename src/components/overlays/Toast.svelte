<script lang="ts">
  import { toast, dismissToast } from '../../lib/toast.svelte'
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
<div
  class={[
    'fixed [overflow-wrap:anywhere] right-[18px] bottom-12 z-[970] w-[min(300px,86vw)] cursor-pointer border-4 border-[#1c2b1c] bg-[#8fa58a] px-3 py-2.5 font-lcd text-[24px] leading-none tracking-[.06em] text-[#1c2b1c] shadow-[6px_6px_0_#000] [image-rendering:pixelated]',
    toast.open
      ? 'visible [transform:none] [transition:.4s_cubic-bezier(.3,1.4,.5,1)]'
      : 'invisible [transform:translateY(300%)] [transition:.4s_cubic-bezier(.3,1.4,.5,1),visibility_0s_.4s]',
  ]}
  role="status"
  aria-live="polite"
  onclick={dismissToast}
>
  <b class="mb-1.5 block border-b-2 border-[#1c2b1c] pb-1 font-normal">{toast.head}</b>{toast.body}
  <span class="mt-2 flex items-center justify-end gap-4">
    {#if toast.action}
      <button
        type="button"
        class="bg-[#1c2b1c] px-2 py-0.5 text-[#8fa58a] hover:bg-black"
        onclick={e => { e.stopPropagation(); toast.action?.run(); dismissToast() }}
      >{toast.action.label}</button>
    {/if}
    <span class="underline">OK</span>
  </span>
</div>
