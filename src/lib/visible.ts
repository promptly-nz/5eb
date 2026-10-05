/** Calls `on(true | false)` as `el` enters or leaves the screen (with some slack), and returns a cleanup. */
export function whenVisible(el: Element, on: (visible: boolean) => void, margin = '120px') {
  const io = new IntersectionObserver(([e]) => on(e.isIntersecting), { rootMargin: margin })
  io.observe(el)
  return () => io.disconnect()
}

/**
 * Marks each section `data-off` while it is off screen. A CSS rule in app.css pauses every animation
 * inside those, so nothing animates (or re-styles the page) where nobody can see it.
 */
export function pauseOffscreen(root: Element) {
  const io = new IntersectionObserver(
    entries => { for (const e of entries) (e.target as HTMLElement).toggleAttribute('data-off', !e.isIntersecting) },
    { rootMargin: '150px' },
  )
  for (const s of root.querySelectorAll(':scope > section')) io.observe(s)
  return () => io.disconnect()
}
