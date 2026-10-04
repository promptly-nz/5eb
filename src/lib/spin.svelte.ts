import { blip } from './audio.svelte'

/**
 * Something that turns: drag it to push it round, let go and it coasts to a stop, or set it playing
 * and it spins up to speed. Used by the CD-R and the cassette reels.
 */
export class Spinner {
  angle = $state(0)
  rpm = $state(0)
  playing = $state(false)

  private vel = 0
  private raf = 0
  private last = 0
  private dragging = false
  private tick = 0

  /** @param speed degrees per second while playing */
  constructor(private speed: number) {}

  /** Push by `deg` over `ms` milliseconds of pointer travel. */
  drag(deg: number, ms: number) {
    this.dragging = true
    this.angle += deg
    this.vel = deg / Math.max(8, ms) * 1000
    this.kick()
  }

  release() {
    this.dragging = false
    this.kick()
  }

  toggle() {
    this.playing = !this.playing
    blip(this.playing ? 880 : 440, 0.05)
    this.kick()
  }

  /** Start or stop playing from outside (e.g. when the music starts or ends). */
  set(on: boolean) {
    if (this.playing === on) return
    this.playing = on
    this.kick()
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.raf = 0
  }

  private kick() {
    if (this.raf) return
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  private frame = (t: number) => {
    const dt = Math.min(0.05, (t - this.last) / 1000)
    this.last = t
    if (!this.dragging) {
      const target = this.playing ? this.speed : 0
      this.vel += (target - this.vel) * (1 - Math.exp(-dt * (this.playing ? 1.8 : 1)))
      this.angle += this.vel * dt
    }
    this.rpm = Math.round(Math.abs(this.vel) / 6)
    const k = Math.floor(this.angle / 45)
    if (k !== this.tick) {
      this.tick = k
      if (Math.abs(this.vel) < 420) blip(260 + (k & 3) * 40, 0.012)
    }
    if (this.playing || this.dragging || Math.abs(this.vel) > 3) {
      this.raf = requestAnimationFrame(this.frame)
    } else {
      this.raf = 0
      this.vel = 0
      this.rpm = 0
    }
  }
}
