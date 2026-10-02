---
name: experimental-culture-site
description: Build a bold, experimental single-file website where the interface is made from the real artefacts of a subculture or era (devices, media formats, games), researched first, with real photos, generated shapes, sound and interaction, then verified in a real browser. Use when the user asks for something "crazy", "insane", "experimental", or "like a design hackathon entry", or wants a site that captures a specific era/scene's aesthetic.
---

# Experimental Culture Site

A repeatable method for turning "make it match this era/scene" into a site people want to play with, not just look at. Derived from a session that produced a 2000s UK underground hip-hop/grime site (camcorder hero, CRT channel-surf, pirate radio dial, bus-blind LED ticker, spray wall, DVD menu, playable Nokia Snake).

## The core idea

**Don't style the culture. Make the culture the interface.**

Every section is a different real object from the era. The page is a set of toys, not a layout with a theme. Pick the objects, then ask of each one: what would a visitor *do* with it?

| Era artefact | Becomes |
|---|---|
| Camcorder | Hero HUD: REC light, running timecode, date stamp, focus brackets |
| CRT TV | Scroll-pinned "channel surf": scrolling changes channel, static burst between, lower-third captions |
| Pirate radio | Tuning dial; static fades into a live beat at the right frequency |
| Bus destination blind | Dot-matrix LED scrolling ticker |
| Graffiti wall | Spray-paint canvas with drips |
| DVD menu | Tracklist with arrow-key navigation and glitchy preview |
| Nokia phone | Playable Snake drawn over a real photo, keypad buttons wired up |
| TV test card | Footer ("Please stand by") |
| SMS ticker (Channel U) | Fixed scrolling text-message bar |

Swap in the artefacts of whatever era/scene the user names.

## Process (follow in order)

### 1. Research first, and report it
- Run several web searches on the culture: the media formats, TV/radio/DVD/print artefacts, fashion, technology, flyers, typography, slang.
- Extract **concrete features** (e.g. "Channel U ran a text-message ticker", "Risky Roadz DVDs: handheld camera, lower-thirds"), not adjectives like "gritty".
- If a specific name/term the user gives returns nothing, **say so plainly** and ask for a link or screenshots. Never invent details and attribute them to it.

### 2. Pick one bold concept and commit
- One-sentence concept that the whole page obeys ("the site is a stack of the era's devices").
- Choose 6-9 sections, each a distinct device/object with its own interaction.
- Reuse the palette, logo and motifs already established in the project.

### 3. Gather real assets
- Find freely licensed photos: Wikimedia Commons API search (`action=query&generator=search&gsrsearch=filetype:bitmap <term>&prop=imageinfo&iiprop=url|size|extmetadata`).
- Download with `Special:FilePath/<URL-encoded name>?width=1200` and a browser-like `User-Agent`.
- **View every image before using it.** Reject poor fits (e.g. fly-tipping junk) rather than forcing them in.
- Record licences and credit them in the page footer.
- Photos with ugly backgrounds: present them as taped-on **stickers/polaroids** with a white border rather than attempting a cut-out. Overlay interactive canvases on top of photos by percentage position (e.g. a game on a phone photo's screen).

### 4. Build as one standalone file (HTML + CSS + JS)
Include, at minimum:
- **Global texture:** animated film-grain canvas (keep opacity low, ~0.07), scanlines, vignette.
- **Custom cursor** that fits the theme (viewfinder crosshair); disable on touch devices.
- **Click feedback:** themed words/starbursts popping where the user clicks.
- **Glitch typography:** layered pseudo-elements with `clip-path` slices and offset colour channels.
- **Shapes generated in code:** starbursts via `clip-path: polygon()` computed in JS, halftone dots via `radial-gradient`, barcodes via `repeating-linear-gradient`, tape strips, torn edges.
- **Parallax** on mouse and scroll, in a single `requestAnimationFrame` loop.
- **Scroll-driven sections:** a tall section with a `position: sticky` stage; compute progress from `getBoundingClientRect` and map it to state.
- **Sound** (see below) and **games/toys** (see below).
- A **boot screen** that doubles as the user-gesture needed to start audio ("Play with sound" / "Play silent").
- A **`#skip` URL hash** that bypasses the boot screen (useful for testing).
- Respect `prefers-reduced-motion`; stack to one column on narrow screens.

### 5. Sound: generate it, don't download it
Web Audio API, no assets needed:
- Looping noise buffer through a bandpass filter = radio static / TV static bursts.
- Simple step sequencer (look-ahead scheduling with `setInterval` ~25ms): kick (sine pitch drop), snare (filtered noise + triangle), hats (high-passed noise), sub bass (sine), detuned square-wave stabs through a low-pass.
- Tie audio to interaction (e.g. tuning crossfade: static level `1 - lock`, beat level `lock`, low-pass cutoff opens as it locks in).
- Visuals must still work when sound is off.

### 6. Verify in a real browser. Do not skip.
- Use Playwright with the system Chrome (`executablePath`, `--no-sandbox`), collect `pageerror` and console errors, scroll to each section, and screenshot.
- Look at every screenshot. Fix what is wrong. In the original session this caught: grain too heavy, a game that started moving by itself, a hidden notification peeking above the bottom bar, text overlapping fixed UI.
- Report honestly what was and wasn't verified (e.g. audio not heard, mobile not checked).

## Prompt template (paste to reproduce)

> Build a new standalone file. Treat it as a design-hackathon entry: pick one bold concept and commit to it. Research the era/culture first and tell me what you found. Turn the real artefacts of that culture into the interface itself, so every section is a playable object (a device, a game, a toy), not just a styled block. Use real photos plus generated shapes. Add motion, sound and interaction, not only visuals. Then open it in a browser, screenshot each section, and fix what's broken.

Shorter nudges that worked in the original session:
- "Try something crazy."
- "Insane animations and graphics using photos and shapes that match the era."
- "Do lots of research into what this could mean."
- "As if you were designing in a design hackathon."

## Why each phrase works

- **"Something crazy / insane"** gives permission to leave the safe landing-page default.
- **"Design hackathon"** signals: one strong idea, executed fully, over polish and hedging.
- **"Lots of research"** produces concrete, era-accurate features to build instead of vague mood words.
- **"Photos and shapes"** triggers real assets plus code-generated graphics.
- **"New file"** keeps the experiment separate from the working site so it can go further without risk.

## Habits that matter most

1. Research, then concept, then build, in that order.
2. Make the culture the UI; don't skin a generic layout.
3. Demand interactivity (audio, games, drag, scroll-driven) beyond animation.
4. Insist on browser verification with screenshots.
5. Keep experiments in a separate file.
6. Be honest about gaps: unfindable references, unverified audio, unchecked mobile, placeholder copy (label it as placeholder in the page footer).

## Content cautions
- Invented names, dates, venues, prices, quotes and phone short-codes must be clearly placeholder; label the page as a demo.
- Don't use real brands' logos or real station/organisation names as if affiliated; use fictional equivalents.
- Credit all third-party photos with their licence.
