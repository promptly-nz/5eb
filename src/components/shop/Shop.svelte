<script lang="ts">
  import Bag, { type CartEntry } from './Bag.svelte'
  import Bomb from './Bomb.svelte'
  import Detail from './Detail.svelte'
  import Disc from './Disc.svelte'
  import Garment from './Garment.svelte'
  import Tape from './Tape.svelte'
  import Thumb from './Thumb.svelte'
  import SectionHeader from '../ui/SectionHeader.svelte'
  import { blip } from '../../lib/audio.svelte'
  import { clamp, pad, reduce } from '../../lib/util'
  import { PRODUCTS, money } from '../../data/products'

  let section: HTMLElement
  let bag: ReturnType<typeof Bag>

  let cur = $state(0)
  // Per-product picks: colourway index, size, quantity.
  const sel = $state(Object.fromEntries(PRODUCTS.map(p => [p.id, { c: 0, z: p.sz ? p.sz[1] : '', q: 1 }])))
  let cart = $state<CartEntry[]>([])

  const item = $derived(PRODUCTS[cur])
  const s = $derived(sel[item.id])

  function pick(i: number) {
    if (i === cur) return
    cur = i
    blip(700, 0.04)
  }

  function add() {
    if (!item.stock) return
    const key = [item.id, s.c, s.z].join('|')
    const e = cart.find(x => x.key === key)
    if (e) e.q += s.q
    else cart.push({ key, item, c: s.c, z: s.z, q: s.q })
    blip(900, 0.05)
    setTimeout(() => blip(1300, 0.04), 70)
    fly(section.querySelector<HTMLElement>('[data-fly]'))
  }

  function change(key: string, d: number) {
    const e = cart.find(x => x.key === key)
    if (!e) return
    e.q += d
    if (e.q <= 0) remove(key)
    blip(500, 0.03)
  }

  function remove(key: string) {
    cart = cart.filter(x => x.key !== key)
    blip(500, 0.03)
  }

  // A copy of the product photo flies down into the bag.
  function fly(src: HTMLElement | null) {
    if (reduce || !src) return
    const a = src.getBoundingClientRect(), b = bag.el().getBoundingClientRect()
    const f = document.createElement('div')
    f.className = 'pointer-events-none fixed z-[990] [transition:transform_.7s_cubic-bezier(.5,-0.3,.6,1),opacity_.7s]'
    f.innerHTML = src.innerHTML
    f.style.cssText += `left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px;font-size:${getComputedStyle(src).fontSize};`
    document.body.appendChild(f)
    requestAnimationFrame(() => {
      f.style.transform = `translate(${b.left + 60 - a.left - a.width / 2}px,${b.top + 20 - a.top - a.height / 2}px) scale(.1) rotate(30deg)`
      f.style.opacity = '.2'
    })
    setTimeout(() => f.remove(), 700)
  }

  // arrow keys browse the shelf while it's on screen
  function onkeydown(e: KeyboardEvent) {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!d || /input|textarea|select/i.test((e.target as HTMLElement).tagName) || (e.target as HTMLElement).closest('[data-keys]')) return
    const r = section.getBoundingClientRect()
    if (!(r.top < innerHeight * 0.3 && r.bottom > innerHeight * 0.7)) return
    e.preventDefault()
    pick((cur + d + PRODUCTS.length) % PRODUCTS.length)
  }
</script>

<svelte:window {onkeydown} />

<section bind:this={section} id="shop" class="relative overflow-x-clip border-t-[6px] border-orange bg-ink px-[4vw] pt-14 pb-[120px]">
  <SectionHeader title="The Goods" size="md" tag="pick one up · demo shop" class="mb-5 p-0" />
  <div class="flex gap-2 max-[900px]:flex-col" role="group" aria-label="Products">
    {#each PRODUCTS as p, i (p.id)}
      {@const on = i === cur}
      <div
        class={[
          'relative min-w-0 overflow-hidden border-2 bg-[#12100e] [transition:flex-grow_.55s_cubic-bezier(.3,1,.4,1),height_.55s_cubic-bezier(.3,1,.4,1),border-color_.15s] min-[901px]:h-[540px] min-[901px]:basis-0 max-[900px]:grow-0',
          on ? 'grow-[7] border-orange max-[900px]:h-[800px]' : 'grow border-[#2a2622] hover:border-[#6a5238] max-[900px]:h-[84px]',
        ]}
      >
        {#if !on}
          <button
            type="button"
            aria-expanded="false"
            aria-label="Open {p.n}"
            class="group absolute inset-0 z-10 flex flex-col items-center gap-3 px-1.5 pt-2.5 pb-3 text-left max-[900px]:flex-row max-[900px]:gap-4 max-[900px]:px-3 max-[900px]:py-0"
            onclick={() => pick(i)}
          >
            <i class="font-lcd text-[17px] text-[#666] not-italic">{pad(i + 1)}</i>
            <Thumb item={p} color={p.cols[0][1]} size={78} />
            <b class={['rotate-180 font-anton text-[25px] leading-none font-normal tracking-[.02em] uppercase [writing-mode:vertical-rl] max-[900px]:rotate-0 max-[900px]:[writing-mode:horizontal-tb]', p.stock ? 'text-[#eee]' : 'text-[#777] line-through']}>{p.n}</b>
            <span class="mt-auto -rotate-[5deg] bg-cream px-1.5 font-marker text-[17px] leading-tight text-black shadow-[2px_2px_0_#000] max-[900px]:mt-0 max-[900px]:ml-auto">{p.stock ? money(p.p) : 'SOLD'}</span>
          </button>
        {:else}
          <div role="region" aria-label={p.n} class="absolute inset-0 grid animate-[card-in_.35s_.2s_both] grid-cols-[1.08fr_1fr] gap-3.5 p-3 max-[900px]:grid-cols-1">
            {#if p.kind === 'garment'}
              <Garment item={p} index={i} color={p.cols[s.c][1]} size={s.z} />
            {:else if p.kind === 'disc'}
              <Disc item={p} index={i} ci={s.c} />
            {:else if p.kind === 'tape'}
              <Tape item={p} index={i} color={p.cols[s.c][1]} />
            {:else}
              <Bomb item={p} index={i} color={p.cols[s.c][1]} />
            {/if}
            <Detail
              item={p}
              {s}
              onsetcolour={k => { s.c = k; blip(800, 0.03) }}
              onsetsize={z => { s.z = z; blip(600, 0.03) }}
              onqty={d => { s.q = clamp(s.q + d, 1, 9); blip(500, 0.03) }}
              onadd={add}
            />
          </div>
        {/if}
      </div>
    {/each}
  </div>
  <Bag bind:this={bag} {cart} onchange={change} onremove={remove} onclear={() => (cart = [])} />
</section>

<style>
  @keyframes -global-card-in {
    from { opacity: 0 }
  }
</style>
