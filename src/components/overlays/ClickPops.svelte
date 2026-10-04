<script lang="ts">
  const WORDS = ['BARE BARS', 'N17', 'WAGWAN', 'ROAD', 'RESPECT', 'DUCATI', 'FLEX', 'BLAZE', 'LONDON', 'SELFISH']
  // Interactive things handle their own clicks, so don't spray graffiti words over them.
  const SKIP = '#spray,canvas#snake,.boot,button,input,.nk'

  const burstClip = (() => {
    const n = 9, pts: string[] = []
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 ? 30 : 50, a = (i / (n * 2)) * Math.PI * 2
      pts.push(50 + Math.cos(a) * r + '% ' + (50 + Math.sin(a) * r) + '%')
    }
    return `polygon(${pts.join(',')})`
  })()

  interface Pop { id: number; x: number; y: number; word: string; col: string }
  let pops = $state<Pop[]>([])
  let nextId = 0

  function onDown(e: PointerEvent) {
    const el = document.elementFromPoint(e.clientX, e.clientY)
    if (el?.closest(SKIP)) return
    const id = nextId++
    pops.push({ id, x: e.clientX, y: e.clientY, word: WORDS[(Math.random() * WORDS.length) | 0], col: Math.random() > 0.5 ? '#f07000' : '#e9e2d0' })
    setTimeout(() => (pops = pops.filter(p => p.id !== id)), 1150)
  }
</script>

<svelte:window onpointerdown={onDown} />

{#each pops as p (p.id)}
  <div class="pointer-events-none fixed z-[980] size-[60px] animate-[pop_.7s_ease-out_forwards] bg-orange text-[0px]" style="left:{p.x}px;top:{p.y}px;clip-path:{burstClip}"></div>
  <div class="pointer-events-none fixed z-[980] animate-[pop_1.1s_ease-out_forwards] font-marker text-[34px] whitespace-nowrap text-orange [text-shadow:2px_2px_0_#000]" style="left:{p.x}px;top:{p.y}px;color:{p.col}">{p.word}</div>
{/each}

<style>
  @keyframes -global-pop {
    0% { transform: translate(-50%, -50%) scale(.3) rotate(0); opacity: 1 }
    30% { transform: translate(-50%, -80%) scale(1.15) rotate(-6deg) }
    100% { transform: translate(-50%, -260%) scale(1) rotate(8deg); opacity: 0 }
  }
</style>
