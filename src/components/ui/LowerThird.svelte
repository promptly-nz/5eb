<script lang="ts">
  // TV news-style caption: orange title bar with a black subtitle under it.
  // Position it with `class` (e.g. "bottom-[11%]").
  let { title, subtitle, class: cls = '' }: { title: string; subtitle: string; class?: string } = $props()
</script>

<div class={['absolute left-0 max-w-[84%]', cls]}>
  <span
    class="inline-block animate-slide-in bg-orange py-1 pr-[18px] pl-[22px] font-anton text-[clamp(20px,3.2vw,44px)] tracking-[.04em] text-black uppercase [clip-path:polygon(0_0,100%_0,calc(100%-14px)_100%,0_100%)]"
  >{title}</span>
  <span
    class="mt-0.5 block w-max max-w-full animate-[slide-in_.5s_.1s_ease-out_both] bg-black py-[3px] pr-[18px] pl-[22px] font-narrow text-[clamp(12px,1.6vw,20px)] font-medium tracking-[.14em] text-white uppercase"
  >{subtitle}</span>
</div>
