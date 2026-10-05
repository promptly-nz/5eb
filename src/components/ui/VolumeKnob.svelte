<script lang="ts">
  import { blip, mix, setVolume } from '../../lib/audio.svelte'
  import { clamp } from '../../lib/util'

  // A rotary volume knob: grab it and turn it (or use the wheel, arrow keys, or double-click to reset).
  // It sweeps 270 degrees, and a ring of LEDs shows the level. The caller positions it (relative or absolute) and sets --r, the LED ring radius.
  let { class: cls = '' }: { class?: string } = $props()

  const MIN = -135, SWEEP = 270, LEDS = 11
  const pct = $derived(Math.round(mix.vol * 100))
  const angle = $derived(MIN + mix.vol * SWEEP)

  let knob: HTMLElement
  let lastTick = -1
  let from = 0 // pointer angle at the last move
  let base = 0 // volume when the grab started
  let turned = 0 // degrees turned since the grab

  // angle of the pointer around the knob's centre, in degrees, 0 at the top and clockwise
  function angleAt(e: PointerEvent) {
    const r = knob.getBoundingClientRect()
    return (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI
  }

  function set(v: number) {
    setVolume(clamp(v, 0, 1))
    const t = Math.round(mix.vol * 20)
    if (t !== lastTick) {
      lastTick = t
      blip(500 + t * 40, 0.015) // a little click as it turns
    }
  }

  // Grab the knob and turn it: it follows the pointer round, and stops at the ends like a real one.
  function onpointerdown(e: PointerEvent) {
    knob.setPointerCapture(e.pointerId)
    from = angleAt(e)
    base = mix.vol
    turned = 0
  }

  function onpointermove(e: PointerEvent) {
    if (!(e.buttons & 1)) return
    const a = angleAt(e)
    let d = a - from
    if (d > 180) d -= 360
    if (d < -180) d += 360
    from = a
    turned += d
    set(base + turned / SWEEP)
    turned = (mix.vol - base) * SWEEP // at an end stop the turn stops too, so reversing responds at once
  }

  function onwheel(e: WheelEvent) {
    e.preventDefault()
    set(mix.vol - Math.sign(e.deltaY) * 0.05)
  }

  function onkeydown(e: KeyboardEvent) {
    const d: Record<string, number> = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05, PageUp: 0.1, PageDown: -0.1 }
    if (e.key in d) set(mix.vol + d[e.key])
    else if (e.key === 'Home') set(0)
    else if (e.key === 'End') set(1)
    else return
    e.preventDefault()
  }
</script>

<div class={['grid place-items-center select-none', cls]}>
  <!-- LED ring -->
  {#each Array(LEDS) as _, i}
    <i
      class={['absolute top-1/2 left-1/2 h-[7px] w-[7px] -mt-[3.5px] -ml-[3.5px] rounded-full', i / (LEDS - 1) <= mix.vol + 0.001 && mix.vol > 0 ? 'bg-phos shadow-[0_0_6px_var(--color-phos)]' : 'bg-[#2b2b2b]']}
      style="transform:rotate({MIN + (i / (LEDS - 1)) * SWEEP}deg) translateY(calc(var(--r) * -1))"
    ></i>
  {/each}
  <div
    bind:this={knob}
    class="relative size-[96px] cursor-grab active:cursor-grabbing max-[900px]:size-[64px] touch-none rounded-full border-[3px] border-black bg-[conic-gradient(from_0deg,#4a4640,#2a2724,#58534b,#2a2724,#4a4640)] shadow-[0_5px_0_#000,inset_0_2px_0_rgba(255,255,255,.18),inset_0_-6px_10px_rgba(0,0,0,.5)] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-orange"
    role="slider"
    tabindex="0"
    aria-label="Volume"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow={pct}
    aria-valuetext="{pct} percent"
    {onpointerdown}
    {onpointermove}
    {onwheel}
    {onkeydown}
    ondblclick={() => set(0.8)}
  >
    <!-- grip ridges -->
    <span class="absolute inset-[12%] rounded-full bg-[repeating-conic-gradient(rgba(0,0,0,.28)_0_4deg,transparent_4deg_12deg)]"></span>
    <!-- pointer -->
    <span class="absolute inset-0 [transition:transform_.06s_linear]" style="transform:rotate({angle}deg)">
      <i class="absolute top-[7%] left-1/2 h-[26%] w-[5px] -translate-x-1/2 rounded-full bg-orange shadow-[0_0_6px_var(--color-orange)]"></i>
    </span>
  </div>
  <span class="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 font-lcd text-[18px] leading-none tracking-[.12em] text-[#aaa]">VOL {pct}</span>
</div>
