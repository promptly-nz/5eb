<script lang="ts">
  import { SMS } from '../../data/content'

  const text = SMS.map(s => '● ' + s).join('     ') + '     '
</script>

<div
  class="pointer-events-none fixed inset-x-0 bottom-0 z-[950] h-[30px] overflow-hidden border-t-[3px] border-orange bg-black font-lcd text-[21px] leading-[30px] tracking-[.08em] whitespace-nowrap text-phos before:absolute before:inset-y-0 before:left-0 before:z-[2] before:bg-orange before:px-3 before:font-anton before:text-[15px] before:tracking-[.1em] before:text-black before:content-['TXT_5EB_TO_80000_▶']"
>
  <div class="inline-block animate-[smsrun_70s_linear_infinite] pl-[100%]">{text}</div>
</div>

<style>
  @keyframes -global-smsrun {
    from { transform: translateX(0) }
    to { transform: translateX(-100%) }
  }
</style>
