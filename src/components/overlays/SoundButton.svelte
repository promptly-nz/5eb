<script lang="ts">
  import { audio, setSound } from '../../lib/audio.svelte'

  const label = $derived(!audio.on ? 'SND: OFF' : audio.running ? 'SND: ON' : 'SND: TAP')
</script>

<button
  type="button"
  class="fixed top-12 right-[18px] z-[960] border-2 border-phos bg-black px-2.5 font-lcd text-[18px] tracking-[.1em] text-phos hover:bg-phos hover:text-black"
  onclick={() => setSound(!audio.on)}>{label}</button
>
