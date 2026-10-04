/** Sections that get a shareable #hash, in page order. */
export const SECTIONS = ['hero', 'surf', 'radio', 'bus', 'wall', 'dvd', 'shop', 'end']

/**
 * Keeps the URL hash on whichever section is crossing the middle of the screen, so any scroll
 * position can be copied and shared. Uses replaceState, so it doesn't fill the back button.
 * `#skip` (the test bypass) is left alone.
 */
export function trackSections(): () => void {
  const io = new IntersectionObserver(
    entries => {
      if (location.hash === '#skip') return
      const hit = entries.find(e => e.isIntersecting)
      if (!hit) return
      const id = hit.target.id
      history.replaceState(null, '', id === 'hero' ? location.pathname + location.search : '#' + id)
    },
    { rootMargin: '-50% 0px -50% 0px' },
  )
  for (const id of SECTIONS) {
    const el = document.getElementById(id)
    if (el) io.observe(el)
  }
  return () => io.disconnect()
}

/** Jump to the section named in the URL, if any (called once the boot screen is gone). */
export function scrollToHash() {
  const id = location.hash.slice(1)
  if (SECTIONS.includes(id)) document.getElementById(id)?.scrollIntoView()
}
