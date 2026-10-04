# 5EB

5EB's site: a scroll-through camcorder / CRT / Nokia themed site, built with **Svelte 5 + Vite + TypeScript + Tailwind CSS v4**.

## Run it

```sh
npm install
npm run dev       # http://localhost:5173  (add #skip to bypass the boot screen)
npm run build     # static output in dist/
npm run check     # svelte-check + tsc
```

## Layout

```
index.html            Vite entry (fonts, #app mount)
public/img/           images, served at /img/*
src/
  App.svelte          boot -> live phases, composes everything
  app.css             Tailwind entry: @theme tokens (colours, fonts, shared animations), base styles, `crtfx` utility
  lib/                behaviour, no content
    audio.svelte.ts   WebAudio engine: procedural beat, radio static, blip/burst; reactive sound state
    toast.svelte.ts   Nokia-style toast store
    util.ts           clamp / pad / reduced-motion flag
  data/               content, no behaviour
    content.ts        channels, tracks, stations, ticker text, boot log
    products.ts       shop catalogue + SVG product art
  components/
    overlays/         always-on chrome: Boot, Grain, Scanlines, Cursor, ClickPops, Clock,
                      SoundButton, SmsTicker, Toast
    sections/         one per scroll section: Hero, Marquees, ChannelSurf, Radio, NightBus,
                      Wall, DvdMenu, Snake, EndCard
    shop/             Shop (state) -> ProductStage (tilt / flip / inspect), ProductInfo, Bag, Thumb, Art
    ui/               shared pieces: Star, Sticker, Noise, SectionHeader, LowerThird
legacy/               the original single-file HTML pages (kept for reference)
```

## Styling

Everything is Tailwind utilities in the markup; there are no component stylesheets.

- **Tokens** live in `@theme` in `src/app.css`: colours `orange ink cream phos rec cyan-fx`, fonts `font-anton / font-marker / font-lcd / font-narrow`, and the shared animations (`animate-blink`, `animate-kb`, `animate-float`, ...). Use them as `bg-orange`, `text-phos`, or `var(--color-orange)` in inline styles.
- **Component-specific keyframes** sit in a keyframes-only `<style>` block next to the component, written as `@keyframes -global-<name>` (so Svelte doesn't hash the name) and used via `animate-[<name>_...]`.
- **Conditional classes** use Svelte's array syntax, `class={['base', cond && 'bg-orange']}`, never `class:foo={}` or string-built class names. Tailwind only sees complete literal strings.
- Classes like `layer` (Hero parallax) and `mqw` are kept as plain hooks for JS / test selectors.
