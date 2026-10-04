<script lang="ts">
  import Thumb from './Thumb.svelte'
  import { blip } from '../../lib/audio.svelte'
  import { money, type Product } from '../../data/products'

  export interface CartEntry { key: string; item: Product; c: number; z: string; q: number }

  let { cart, onchange, onremove, onclear }: {
    cart: CartEntry[]
    onchange: (key: string, d: number) => void
    onremove: (key: string) => void
    onclear: () => void
  } = $props()

  let root: HTMLElement
  let rail: HTMLElement

  const QBTN = 'size-5 bg-[#2a2622] font-anton text-[14px] leading-none text-white hover:bg-orange hover:text-black'

  const sub = $derived(cart.reduce((n, e) => n + e.item.p * e.q, 0))
  const count = $derived(cart.reduce((n, e) => n + e.q, 0))
  const delivery = $derived(sub === 0 || sub >= 50 ? 0 : 3.99)
  const total = $derived(sub + delivery)

  // "Text my order": the bag turns into a Nokia SMS that types itself out.
  let sms = $state({ open: false, text: '', count: 160, status: '', reply: '' })

  function sendOrder() {
    const parts = cart.map(e => (e.q > 1 ? e.q + 'X ' : '') + e.item.id.toUpperCase() + '-' + e.item.cols[e.c][0].slice(0, 3).toUpperCase() + (e.z ? '-' + e.z : ''))
    const msg = 'BUY ' + parts.join(' ') + ' ' + money(total)
    sms = { open: true, text: '', count: 160, status: '', reply: '' }
    let i = 0
    const iv = setInterval(() => {
      sms.text = msg.slice(0, ++i)
      sms.count = Math.max(0, 160 - i)
      blip(700 + Math.random() * 300, 0.02)
      if (i < msg.length) return
      clearInterval(iv)
      setTimeout(() => {
        sms.status = 'SENDING...'
        blip(400, 0.2)
        setTimeout(() => {
          sms.status = 'MESSAGE SENT ✓'
          sms.reply = '5EB: Ta fam! Order #N17-' + ((1000 + Math.random() * 8999) | 0) + ' confirmed. Allow 3-5 days. (Demo only, nothing was charged.)'
          blip(1200, 0.1)
          setTimeout(() => {
            onclear()
            sms.open = false
          }, 4500)
        }, 1400)
      }, 500)
    }, 45)
  }

  // a new item scrolls into view at the end of the rail
  $effect(() => {
    cart.length
    rail.scrollTo({ left: rail.scrollWidth, behavior: 'smooth' })
  })

  // the mouse wheel scrolls the rail sideways while it has room to go that way, else the page scrolls as normal
  function onwheel(e: WheelEvent) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
    const max = rail.scrollWidth - rail.clientWidth
    if ((e.deltaY < 0 && rail.scrollLeft <= 0) || (e.deltaY > 0 && rail.scrollLeft >= max - 1) || max <= 0) return
    e.preventDefault()
    rail.scrollLeft += e.deltaY
  }

  /** The bag's box, so the shop can fly items towards it. */
  export function el() {
    return root
  }
</script>

<div class="relative mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 border-[3px] border-[#2a2622] bg-[#100e0c] px-3.5 py-2" bind:this={root}>
  <h4 class="font-anton text-[22px] tracking-[.04em] text-white uppercase">Ya bag <small class="ml-1 bg-orange px-1.5 font-lcd text-[18px] tracking-[.1em] text-black">{count}</small></h4>
  <div bind:this={rail} {onwheel} role="group" aria-label="Items in your bag" class="flex min-w-0 flex-1 gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-color:var(--color-orange)_#1a1713] [scrollbar-width:thin]">
    {#each cart as e (e.key)}
      <div class="grid shrink-0 animate-[row-in_.3s_steps(3)_both] grid-cols-[38px_auto] items-center gap-2 border-2 border-[#2a2622] bg-[#17140f] py-0.5 pr-2 pl-1">
        <Thumb item={e.item} color={e.item.cols[e.c][1]} size={38} />
        <div class="leading-none">
          <b class="block font-anton text-[15px] font-normal text-white uppercase">{e.item.n}</b>
          <small class="font-lcd text-[15px] tracking-[.06em] text-[#8a8070]">{e.item.cols[e.c][0]}{e.z ? ' · ' + e.z : ''}</small>
          <div class="mt-0.5 flex items-center gap-1 font-anton text-[15px] text-orange">
            <button type="button" class={QBTN} onclick={() => onchange(e.key, -1)}>-</button>x{e.q}<button type="button" class={QBTN} onclick={() => onchange(e.key, 1)}>+</button>
            <span class="ml-1 text-cream">{money(e.item.p * e.q)}</span>
            <button type="button" class="ml-1 px-1 font-lcd text-[14px] text-[#b55] underline hover:bg-orange hover:text-black" onclick={() => onremove(e.key)}>x</button>
          </div>
        </div>
      </div>
    {:else}
      <span class="font-lcd text-[19px] tracking-[.1em] whitespace-nowrap text-[#6a6258]">NOTHING IN HERE YET.</span>
    {/each}
  </div>
  <div class="flex items-center gap-4">
    <div class="text-right leading-none">
      <div class="font-anton text-[30px] text-white uppercase">{money(total)}</div>
      <div class="font-lcd text-[15px] tracking-[.1em] text-[#8a8070]">{sub === 0 ? 'TOTAL' : sub >= 50 ? 'FREE DELIVERY' : 'ADD ' + money(50 - sub) + ' FOR FREE DELIVERY'}</div>
    </div>
    <button
      class="border-4 border-black bg-orange px-4 py-1 font-anton text-[20px] tracking-[.08em] text-black uppercase shadow-[4px_4px_0_var(--color-cream)] enabled:hover:bg-white enabled:hover:shadow-[2px_2px_0_var(--color-cream)] enabled:hover:[transform:translate(2px,2px)] disabled:opacity-35"
      type="button"
      disabled={!count || sms.open}
      onclick={sendOrder}>Text my order</button>
  </div>
  <div
    class={[
      'absolute right-3 bottom-full z-10 mb-3 min-h-[120px] w-[min(320px,calc(100%-24px))] rounded-[14px_14px_40px_40px] border-[5px] border-[#3b3e3a] bg-[#9db596] px-3 pt-2 pb-4 font-lcd text-[21px] leading-[1.05] text-[#16240f] shadow-[inset_0_0_0_2px_#16240f55,4px_4px_0_#000]',
      sms.open ? 'block' : 'hidden',
    ]}
  >
    <div class="mb-1.5 flex justify-between border-b-2 border-[#16240f] pb-0.5"><span>To: 80000</span><span>{sms.count}</span></div>
    <div class="after:animate-blink after:content-['\5f']">{sms.text}</div>
    <div class="mt-2 text-center tracking-[.1em]">{sms.status}</div>
    {#if sms.reply}<div class="mt-2 border-t-2 border-dashed border-[#16240f] pt-1.5">{sms.reply}</div>{/if}
  </div>
</div>
