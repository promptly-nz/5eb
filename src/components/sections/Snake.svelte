<script lang="ts">
  import { untrack } from 'svelte'
  import Star from '../ui/Star.svelte'
  import Sticker from '../ui/Sticker.svelte'
  import SectionHeader from '../ui/SectionHeader.svelte'
  import { blip } from '../../lib/audio.svelte'
  import { pad } from '../../lib/util'

  type Cell = [number, number]
  type Dir = 'up' | 'down' | 'left' | 'right'

  const G = 40 // cell size in canvas px
  const CW = 800, CH = 480
  const W = (CW / G) | 0, H = (CH / G) | 0
  const BG = '158,181,150', DK = '#16240f', MID = '#4d6a42'
  const LETTERS = ['5', 'E', 'B']
  const MOVES: Record<Dir, Cell> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }
  const KEYS: Record<string, Dir> = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right', '2': 'up', '8': 'down', '4': 'left', '6': 'right',
  }

  let canvas: HTMLCanvasElement
  let bez: HTMLElement
  let section: HTMLElement

  // Shown in the UI.
  let score = $state(0)
  let best = $state(0)
  let pressed = $state<Dir | ''>('')

  // Game state, read by the render loop every frame (deliberately not reactive).
  let snake: Cell[] = []
  let dir: Cell = [1, 0]
  let nextDir: Cell = dir
  let food: Cell = [0, 0]
  let alive = true
  let started = false
  let shake = 0
  let flash = 0
  let floaters: { t: string; x: number; y: number; l: number }[] = []
  let ring = 0
  let T = 0

  function reset() {
    started = false
    snake = [[5, 6], [4, 6], [3, 6]]
    dir = [1, 0]
    nextDir = dir
    score = 0
    alive = true
    floaters = []
    spawn()
  }

  function spawn() {
    do {
      food = [(Math.random() * W) | 0, (Math.random() * H) | 0]
    } while (snake.some(p => p[0] === food[0] && p[1] === food[1]))
    ring = 1
  }

  function turn(d: Dir) {
    const m = MOVES[d]
    if (!m) return
    if (!alive) reset()
    if (m[0] !== -dir[0] || m[1] !== -dir[1]) nextDir = m
    started = true
    blip(500, 0.03)
    pressed = d
    setTimeout(() => (pressed = ''), 120)
  }

  const inView = () => {
    const r = section.getBoundingClientRect()
    return r.top < innerHeight * 0.75 && r.bottom > innerHeight * 0.2
  }

  function onkeydown(e: KeyboardEvent) {
    const k = KEYS[e.key]
    if (k && inView()) {
      e.preventDefault()
      turn(k)
    }
  }

  // Swipe to steer on touch screens.
  let sx = 0, sy = 0
  const onpointerdown = (e: PointerEvent) => { sx = e.clientX; sy = e.clientY }
  const onpointerup = (e: PointerEvent) => {
    const dx = e.clientX - sx, dy = e.clientY - sy
    if (Math.abs(dx) + Math.abs(dy) > 14) turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
  }

  $effect(() => {
    const c = canvas.getContext('2d')!
    let raf = 0, timer: ReturnType<typeof setTimeout>

    // spinning CD (the food)
    function cd(x: number, y: number, r: number, t: number) {
      c.save()
      c.translate(x, y)
      c.rotate(t)
      c.fillStyle = 'rgba(22,36,15,.18)'
      c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill()
      c.strokeStyle = DK
      c.lineWidth = 4
      c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke()
      c.lineWidth = 3
      c.beginPath(); c.arc(0, 0, r * 0.55, 0.3, 2.4); c.stroke()
      c.fillStyle = DK
      c.beginPath(); c.arc(0, 0, r * 0.22, 0, 7); c.fill()
      c.restore()
    }

    function seg(p: Cell, i: number) {
      const x = p[0] * G, y = p[1] * G, r = i ? 9 : 14
      c.fillStyle = i ? MID : DK
      c.beginPath(); c.roundRect(x + 3, y + 3, G - 6, G - 6, r); c.fill()
      c.strokeStyle = DK
      c.lineWidth = 3
      c.stroke()
      if (i) {
        // body segments spell 5-E-B
        c.fillStyle = `rgb(${BG})`
        c.font = '30px VT323, monospace'
        c.textAlign = 'center'
        c.textBaseline = 'middle'
        c.fillText(LETTERS[(snake.length - i) % 3], x + G / 2, y + G / 2 + 1)
      } else {
        // head: eyes + tongue
        const ex = dir[0] * 6, ey = dir[1] * 6, px = -dir[1] * 8, py = dir[0] * 8
        c.fillStyle = `rgb(${BG})`
        for (const k of [1, -1]) {
          c.beginPath()
          c.arc(x + G / 2 + ex + px * k * (dir[0] ? 0 : 1), y + G / 2 + ey + py * k * (dir[1] ? 0 : 1), 4, 0, 7)
          c.fill()
        }
        if (dir[0]) {
          for (const k of [1, -1]) {
            c.beginPath(); c.arc(x + G / 2 + ex, y + G / 2 + ey + 8 * k, 4, 0, 7); c.fill()
          }
        }
        if (Math.floor(T / 8) % 2) {
          c.strokeStyle = '#c33'
          c.lineWidth = 3
          c.beginPath()
          c.moveTo(x + G / 2 + dir[0] * 14, y + G / 2 + dir[1] * 14)
          c.lineTo(x + G / 2 + dir[0] * 26, y + G / 2 + dir[1] * 26)
          c.stroke()
        }
      }
    }

    // Runs every frame; LCD "ghosting" = previous frames fade out slowly.
    function frame() {
      T++
      c.fillStyle = `rgba(${BG},${started && alive ? 0.42 : 1})`
      c.fillRect(0, 0, CW, CH)
      // faint grid dots so cells are readable
      c.fillStyle = 'rgba(22,36,15,.14)'
      for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) c.fillRect(x * G + G / 2 - 1, y * G + G / 2 - 1, 2, 2)
      // food
      if (ring > 0) {
        c.strokeStyle = `rgba(22,36,15,${ring})`
        c.lineWidth = 3
        c.beginPath(); c.arc(food[0] * G + G / 2, food[1] * G + G / 2, (1 - ring) * 70 + 14, 0, 7); c.stroke()
        ring -= 0.03
      }
      cd(food[0] * G + G / 2, food[1] * G + G / 2, 15 * (1 + Math.sin(T / 5) * 0.12), T / 6)
      for (let i = snake.length - 1; i >= 0; i--) seg(snake[i], i)
      // floating +7
      floaters = floaters.filter(f => f.l > 0)
      for (const f of floaters) {
        c.fillStyle = `rgba(22,36,15,${f.l / 40})`
        c.font = '46px VT323'
        c.textAlign = 'center'
        c.fillText(f.t, f.x, f.y)
        f.y -= 1.6
        f.l--
      }
      if (flash > 0) {
        c.fillStyle = `rgba(22,36,15,${flash / 10})`
        c.fillRect(0, 0, CW, CH)
        flash--
      }
      if (!alive || !started) {
        c.fillStyle = `rgb(${BG})`
        c.fillRect(150, 150, 500, 180)
        c.strokeStyle = DK
        c.lineWidth = 6
        c.strokeRect(150, 150, 500, 180)
        c.strokeRect(160, 160, 480, 160)
        c.fillStyle = DK
        c.textAlign = 'center'
        c.textBaseline = 'alphabetic'
        c.font = '84px VT323, monospace'
        c.fillText(alive ? 'SNAKE' : 'GAME OVER', 400, 245)
        c.font = '36px VT323, monospace'
        c.fillText(alive ? 'PRESS AN ARROW KEY' : 'TAP TO TRY AGAIN', 400, 295)
      }
      if (shake > 0) {
        bez.classList.remove('shake')
        void bez.offsetWidth // restart the CSS animation
        bez.classList.add('shake')
        shake = 0
      }
      raf = requestAnimationFrame(frame)
    }

    // Game logic step; speeds up with score.
    function tick() {
      if (alive && started && inView()) {
        dir = nextDir
        const h: Cell = [snake[0][0] + dir[0], snake[0][1] + dir[1]]
        if (h[0] < 0 || h[1] < 0 || h[0] >= W || h[1] >= H || snake.some(p => p[0] === h[0] && p[1] === h[1])) {
          alive = false
          best = Math.max(best, score)
          blip(120, 0.25)
          shake = 1
          flash = 10
        } else {
          snake.unshift(h)
          if (h[0] === food[0] && h[1] === food[1]) {
            score += 7
            floaters.push({ t: '+7', x: h[0] * G + G / 2, y: h[1] * G, l: 40 })
            spawn()
            blip(1500, 0.04)
            shake = 1
            flash = 4
          } else snake.pop()
        }
      }
      timer = setTimeout(tick, Math.max(90, 170 - score * 1.2))
    }

    // The game manages its own state; don't let reads in here become effect dependencies.
    untrack(() => {
      reset()
      frame()
      tick()
    })
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  })

  const LCD_GRID = 'bg-[repeating-linear-gradient(0deg,rgba(22,36,15,.13)_0_1px,transparent_1px_4px),repeating-linear-gradient(90deg,rgba(22,36,15,.13)_0_1px,transparent_1px_4px),radial-gradient(ellipse_at_center,transparent_45%,rgba(22,36,15,.5)_100%)]'
  const NOTE = "pointer-events-none absolute z-4 px-3.5 py-2 font-marker text-[clamp(16px,2vw,26px)] shadow-[4px_5px_0_var(--dk)] before:absolute before:-top-2.5 before:left-1/2 before:h-[18px] before:w-14 before:-translate-x-1/2 before:rotate-[-3deg] before:bg-[rgba(240,226,150,.85)] before:content-['']"
  const PHONE_KEY = 'absolute h-[7%] w-[15%] -translate-1/2 hover:rounded-[50%] hover:bg-[rgba(240,112,0,.45)]'
  const PHONE_KEY_ON = 'rounded-[50%] bg-[rgba(240,112,0,.45)]'
  const DKEY = 'grid place-items-center border-[3px] border-black font-anton text-[28px] font-normal'
  const DKEY_OFF = 'bg-[#111] text-orange shadow-[4px_4px_0_var(--color-orange)] active:translate-x-[3px] active:translate-y-[3px] active:bg-orange active:text-black active:shadow-[1px_1px_0_var(--color-orange)]'
  const DKEY_ON = 'translate-x-[3px] translate-y-[3px] bg-orange text-black shadow-[1px_1px_0_var(--color-orange)]'

</script>

<svelte:window {onkeydown} />

<section bind:this={section} id="nokia" class="overflow-hidden bg-(--lc) px-[3vw] pt-[110px] pb-[300px] text-(--dk) [--dk:#16240f] [--lc:#9db596]">
  <div class={['pointer-events-none absolute inset-0', LCD_GRID]}></div>
  <div class="pointer-events-none absolute top-1/2 left-1/2 animate-[snake-ghostdrift_9s_ease-in-out_infinite_alternate] font-anton text-[clamp(300px,52vw,900px)] font-normal whitespace-nowrap text-[rgba(22,36,15,.08)] [transform:translate(-50%,-50%)]">SNAKE</div>
  <SectionHeader title="Snake" tone="lcd" class="relative mb-[26px] px-[4vw]" />
  <div class="relative mx-auto max-w-[1080px]">
    <div class="absolute -top-[70px] -right-1.5 z-3 rotate-2 bg-(--dk) px-[18px] py-0.5 font-lcd text-[clamp(26px,3.4vw,44px)] tracking-[.14em] whitespace-pre text-(--lc) shadow-[6px_6px_0_rgba(22,36,15,.35)]">SCORE {pad(score, 3)}  BEST {pad(best, 3)}</div>
    <div
      class="relative rounded-[34px] border-[16px] border-[#6e726c] bg-(--lc) p-1.5 shadow-[inset_0_0_0_4px_#3b3e3a,14px_14px_0_var(--dk),0_0_0_4px_#3b3e3a] [transform:rotate(-1.4deg)] before:absolute before:top-[-34px] before:left-1/2 before:-translate-x-1/2 before:rounded-t-[4px] before:bg-[#3b3e3a] before:px-4 before:py-0.5 before:text-[20px] before:font-bold before:tracking-[.2em] before:text-[#e9e9e9] before:[font-family:Arial,sans-serif] before:content-['NOKIA'] after:pointer-events-none after:absolute after:inset-1.5 after:bg-[repeating-linear-gradient(0deg,rgba(22,36,15,.1)_0_1px,transparent_1px_3px),repeating-linear-gradient(90deg,rgba(22,36,15,.1)_0_1px,transparent_1px_3px),linear-gradient(135deg,rgba(255,255,255,.25),transparent_30%)] after:content-[''] [&.shake]:animate-[snake-bshake_.25s_steps(1)]"
      bind:this={bez}
    >
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
      <canvas class="block h-auto w-full cursor-pointer bg-(--lc) [image-rendering:pixelated]" bind:this={canvas} width={CW} height={CH} onclick={() => { if (!alive) reset() }} {onpointerdown} {onpointerup}></canvas>
    </div>
    <div class={[NOTE, 'top-[8%] left-[-2vw] rotate-[-7deg] bg-white text-[#111]']}>arrows / WASD to start</div>
    <div class={[NOTE, 'top-[34%] right-[-2vw] rotate-6 bg-orange text-[#111]']}>eat the spinning CD</div>
    <div class={[NOTE, '-bottom-[70px] left-[34%] rotate-[-3deg] bg-black text-(--lc)']}>don't eat yourself</div>
    <Star n={12} class="z-4" style="width:130px;height:130px;left:-60px;top:-60px;transform:rotate(-12deg)">HIGH<br>SCORE<br>WINS</Star>
    <div class="absolute -bottom-[210px] -left-[3vw] z-5 aspect-[2/3] w-[min(36vw,230px)] rotate-[-9deg] rounded-lg bg-[#e3e3e6] p-[5px] shadow-[6px_8px_0_var(--dk)]">
      <img class="h-full w-full rounded-[3px] object-cover" src="/img/nokia.jpg" alt="Nokia 3310" />
      <div class="pointer-events-none absolute top-[31%] left-[31%] w-[36%] text-center font-lcd text-[clamp(18px,2.2vw,28px)] leading-none text-[#1b2a1b]">{pad(score, 3)}</div>
      <button class={[PHONE_KEY, pressed === 'up' && PHONE_KEY_ON]} onclick={() => turn('up')} style="left:50%;top:66.5%" aria-label="up"></button>
      <button class={[PHONE_KEY, pressed === 'left' && PHONE_KEY_ON]} onclick={() => turn('left')} style="left:34%;top:71.5%" aria-label="left"></button>
      <button class={[PHONE_KEY, pressed === 'right' && PHONE_KEY_ON]} onclick={() => turn('right')} style="left:66%;top:71.5%" aria-label="right"></button>
      <button class={[PHONE_KEY, pressed === 'down' && PHONE_KEY_ON]} onclick={() => turn('down')} style="left:50%;top:77%" aria-label="down"></button>
    </div>
    <Sticker class="right-[34vw] -bottom-[200px] z-2 aspect-square w-[min(26vw,210px)] rotate-[8deg] max-[900px]:hidden" col src="minidisc.jpg" caption="MZ-R500 · mega bass" />
    <div class="absolute -right-[1vw] -bottom-[220px] z-5 grid grid-cols-[repeat(3,62px)] grid-rows-[repeat(3,62px)] gap-1.5 rotate-3">
      <button class={[DKEY, 'col-start-2 row-start-1', pressed === 'up' ? DKEY_ON : DKEY_OFF]} onclick={() => turn('up')} aria-label="Up">▲</button>
      <button class={[DKEY, 'col-start-1 row-start-2', pressed === 'left' ? DKEY_ON : DKEY_OFF]} onclick={() => turn('left')} aria-label="Left">◄</button>
      <span class="col-start-2 row-start-2 grid place-items-center font-lcd text-sm tracking-[.1em] text-(--dk)">STEER</span>
      <button class={[DKEY, 'col-start-3 row-start-2', pressed === 'right' ? DKEY_ON : DKEY_OFF]} onclick={() => turn('right')} aria-label="Right">►</button>
      <button class={[DKEY, 'col-start-2 row-start-3', pressed === 'down' ? DKEY_ON : DKEY_OFF]} onclick={() => turn('down')} aria-label="Down">▼</button>
    </div>
  </div>
</section>

<style>
  @keyframes -global-snake-ghostdrift {
    to { transform: translate(-46%, -52%) skewX(-6deg) }
  }
  @keyframes -global-snake-bshake {
    0% { transform: rotate(-1.4deg) translate(-8px, 4px) }
    25% { transform: rotate(-0.4deg) translate(9px, -5px) }
    50% { transform: rotate(-2.2deg) translate(-5px, -6px) }
    75% { transform: rotate(-1deg) translate(6px, 5px) }
  }
</style>
