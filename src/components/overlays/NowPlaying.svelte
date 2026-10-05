<script lang="ts">
  import { audio, setSound } from '../../lib/audio.svelte'
  import { music, stopMusic } from '../../lib/music.svelte'

  // The one music control: shows what's playing, and a click stops it. On the quiet radio bed that
  // mutes the music; on a track you started it stops the track, and the bed comes back.
  const own = $derived(music.src !== null && music.src !== 'radio')

  function onclick() {
    if (!audio.on) setSound(true)
    else if (own) stopMusic()
    else setSound(false)
  }
</script>

<button
  type="button"
  class={[
    'fixed top-12 right-[18px] z-[960] flex max-w-[min(260px,70vw)] max-[640px]:top-2 max-[640px]:right-2 max-[640px]:max-w-[44vw] max-[640px]:text-[16px] items-center gap-2 border-2 bg-black px-2.5 font-lcd text-[18px] tracking-[.08em]',
    audio.on ? 'border-phos text-phos hover:bg-phos hover:text-black' : 'border-[#555] text-[#888] hover:border-phos hover:text-phos',
  ]}
  aria-label={!audio.on ? 'Turn the music on' : own ? 'Stop ' + music.song?.title : 'Mute the music'}
  {onclick}
>
  <span class={['shrink-0', audio.on && music.playing && 'animate-blink']}>♪</span>
  <span class="truncate">{!audio.on ? 'MUSIC OFF' : (music.song?.title ?? 'LOADING')}</span>
  {#if audio.on}<span class="shrink-0">■</span>{/if}
</button>
