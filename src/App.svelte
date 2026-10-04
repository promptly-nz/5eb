<script lang="ts">
  import { onMount } from 'svelte'
  import Boot from './components/overlays/Boot.svelte'
  import ChannelSurf from './components/sections/ChannelSurf.svelte'
  import ClickPops from './components/overlays/ClickPops.svelte'
  import Clock from './components/overlays/Clock.svelte'
  import Cursor from './components/overlays/Cursor.svelte'
  import DvdMenu from './components/sections/DvdMenu.svelte'
  import EndCard from './components/sections/EndCard.svelte'
  import Grain from './components/overlays/Grain.svelte'
  import Hero from './components/sections/Hero.svelte'
  import Marquees from './components/sections/Marquees.svelte'
  import NightBus from './components/sections/NightBus.svelte'
  import NowPlaying from './components/overlays/NowPlaying.svelte'
  import Radio from './components/sections/Radio.svelte'
  import Scanlines from './components/overlays/Scanlines.svelte'
  import Shop from './components/shop/Shop.svelte'
  import Snake from './components/sections/Snake.svelte'
  import SmsTicker from './components/overlays/SmsTicker.svelte'
  import Toast from './components/overlays/Toast.svelte'
  import Wall from './components/sections/Wall.svelte'
  import { F0 } from './data/content'
  import { LATEST } from './data/releases'
  import { setSound } from './lib/audio.svelte'
  import { scrollToHash, trackSections } from './lib/hash'
  import { showToast } from './lib/toast.svelte'

  // boot: camcorder boot log -> CRT-off -> site live
  let phase = $state<'boot' | 'off' | 'live'>('boot')

  function start(sound: boolean) {
    if (phase !== 'boot') return
    phase = 'off'
    document.body.classList.remove('booting')
    setSound(sound)
    setTimeout(() => {
      phase = 'live'
      scrollToHash()
    }, 800)
    setTimeout(() => showToast('Bluetooth', `Receiving '${LATEST.title.replace(/\s+/g, '_')}_FINAL_v2.mp3' from 5EB. Accept?`), 14000)
    setTimeout(
      () => showToast('1 new message', `Marv: ur on dubplate tonite fam. ${F0} FM, dont be late`, {
        label: 'TUNE IN ▶',
        run: () => document.getElementById('radio')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      }),
      32000,
    )
  }

  onMount(() => {
    if (location.hash === '#skip') start(true)
    return trackSections()
  })
</script>

<Grain />
<Scanlines />
<Cursor />
<ClickPops />
<img class="pointer-events-none fixed top-2 left-3.5 z-[950] size-16 drop-shadow-[2px_2px_0_#000]" src="/img/logo.png" alt="5EB" />
<Clock />
<NowPlaying />
<!-- <SmsTicker /> -->
<Toast />

{#if phase !== 'live'}
  <Boot off={phase === 'off'} onfinish={() => start(true)} />
{/if}

<main class={[phase !== 'boot' && 'animate-[poweron_1.1s_ease-out_both]']}>
  <Hero />
  <Marquees />
  <ChannelSurf />
  <Radio />
  <NightBus />
  <Wall />
  <DvdMenu />
  <!-- <Snake /> -->
  <Shop />
  <EndCard />
</main>

<style>
  @keyframes -global-poweron {
    0% { filter: brightness(5) saturate(0); transform: scaleY(.01) }
    30% { filter: brightness(3) saturate(0); transform: scaleY(1) }
    100% { filter: none; transform: none }
  }
</style>
