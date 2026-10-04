import { untrack } from 'svelte'
import { audio, setSound, setStaticDuck } from './audio.svelte'
import { showToast } from './toast.svelte'
import { clamp } from './util'

// Real 5EB tracks, played through one hidden YouTube player (IFrame API, loaded on first play).
// Whatever plays is tagged with a `src` so each part of the site only stops its own music.

export interface Song { id: string; title: string }
export type Source = 'radio' | 'dvd' | 'cd' | 'tape'

export const music = $state<{ src: Source | null; song: Song | null; playing: boolean }>({ src: null, song: null, playing: false })

interface YTPlayer {
  loadVideoById(o: { videoId: string; startSeconds?: number }): void
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  getPlayerState(): number
  setVolume(v: number): void
}
interface YTApi {
  Player: new (el: HTMLElement, o: {
    width: number
    height: number
    playerVars: Record<string, string | number>
    events: { onReady: (e: { target: YTPlayer }) => void; onStateChange: (e: { data: number }) => void; onError: () => void }
  }) => unknown
}
declare global {
  interface Window { YT?: YTApi; onYouTubeIframeAPIReady?: () => void }
}

let player: YTPlayer | undefined
let loading: Promise<YTPlayer> | undefined
let queue: Song[] = []
let at = 0
let loop = false
let volume = 100
let seq = 0
let heldBySound = false

function getPlayer(): Promise<YTPlayer> {
  loading ??= new Promise((resolve, reject) => {
    // Kept off-screen and silent to look at: the site is audio only.
    const host = document.createElement('div')
    host.style.cssText = 'position:fixed;left:-9999px;top:0;width:200px;height:200px;pointer-events:none'
    const slot = document.createElement('div')
    host.append(slot)
    document.body.append(host)
    const make = () =>
      new window.YT!.Player(slot, {
        width: 200,
        height: 200,
        playerVars: { playsinline: 1, controls: 0, disablekb: 1, fs: 0, rel: 0, origin: location.origin },
        events: {
          onReady: e => {
            player = e.target
            resolve(e.target)
          },
          onStateChange: e => onState(e.data),
          onError: onFail,
        },
      })
    if (window.YT?.Player) return make()
    window.onYouTubeIframeAPIReady = make
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    s.onerror = () => reject(new Error('YouTube blocked'))
    document.head.append(s)
  })
  return loading
}

function onState(state: number) {
  if (state === 1) music.playing = true
  else if (state === 2) music.playing = false
  else if (state === 0) advance()
}

function advance() {
  if (at + 1 < queue.length) return start(at + 1)
  if (loop) return start(0)
  stopMusic()
}

function onFail() {
  // an embed that won't play: skip to the next song, or give up
  if (at + 1 < queue.length) return start(at + 1)
  showToast('No signal', "Couldn't load that track. Try it on Spotify instead.")
  stopMusic()
}

async function start(i: number, startSeconds = 0) {
  const tok = ++seq
  at = i
  // a song from the music list silences the static; the quiet bed only sits it back a little
  setStaticDuck(music.src === 'radio' ? 0.45 : 0)
  music.song = queue[i]
  music.playing = true
  try {
    const p = await getPlayer()
    if (tok !== seq) return
    p.setVolume(volume)
    p.loadVideoById({ videoId: queue[i].id, startSeconds })
  } catch {
    if (tok !== seq) return
    showToast('No signal', "Couldn't reach YouTube, so no music this time.")
    stopMusic()
  }
}

/** Play `songs` for `src`, replacing whatever was playing. Turns sound on (it's called from a click). */
export function playSongs(src: Source, songs: Song[], o: { index?: number; loop?: boolean; volume?: number; start?: number } = {}) {
  if (!songs.length) return
  if (!audio.on) setSound(true)
  heldBySound = false
  music.src = src
  queue = songs
  loop = !!o.loop
  volume = o.volume ?? 100
  start(o.index ?? 0, o.start)
}

/** Stop everything, or only `src`'s music. */
export function stopMusic(src?: Source) {
  if (src && music.src !== src) return
  seq++
  player?.stopVideo()
  music.src = null
  music.song = null
  music.playing = false
  heldBySound = false
  setStaticDuck(1)
}

/** Press play on `src`: starts it, or stops it if it's already the thing playing. */
export function toggleMusic(src: Source, songs: Song[]) {
  if (music.src === src) stopMusic(src)
  else playSongs(src, songs)
}

/**
 * The radio bed: whenever sound is on and nothing else is playing, a ##MOTIONMUZIK track loops quietly
 * under the page. Locking the dial onto 5EB FM (near the radio section) swells it up over the static.
 * It never takes over from a song the visitor started, and carries on again when theirs ends.
 */
const BED = 0.2
export function radioBed(lock: number, presence: number, songs: Song[]) {
  if (!audio.on) return stopMusic('radio')
  const level = clamp(BED + (1 - BED) * lock * (0.35 + 0.65 * presence), 0, 1)
  if (music.src === 'radio') {
    volume = Math.round(level * 100)
    player?.setVolume(volume)
  } else if (music.src === null) {
    playSongs('radio', songs, { loop: true, volume: Math.round(level * 100), start: 8 })
  }
}

// Sound is on by default, but browsers won't autoplay before the visitor has touched the page:
// the bed starts on their first tap, click or key press.
for (const ev of ['pointerdown', 'keydown', 'touchend']) {
  addEventListener(
    ev,
    () => {
      if (music.src !== 'radio' || !audio.on || heldBySound || !player) return
      if (player.getPlayerState() !== 1) player.playVideo()
    },
    { passive: true },
  )
}

// muting (the music tag) pauses songs too, and unmuting brings them back
$effect.root(() => {
  $effect(() => {
    const on = audio.on
    untrack(() => {
      if (!player) return
      if (!on && music.playing) {
        heldBySound = true
        player.pauseVideo()
      } else if (on && heldBySound) {
        heldBySound = false
        player.playVideo()
      }
    })
  })
})
