export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
export const pad = (n: number, len = 2) => String(n).padStart(len, '0')
export const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
/** A touch screen: no hover or pointer parallax, and a lighter touch on the effects. */
export const coarse = matchMedia('(pointer:coarse)').matches
