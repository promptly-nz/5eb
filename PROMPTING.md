# How This Site Was Prompted

A record of the prompts that took this project from a plain three-column comparison to an experimental, 2000s UK underground hip-hop experience, and what each prompt did. Use it to repeat the approach on other projects.

See also `experimental-design-skill.md` for the build method written as a reusable skill. This file is the other half: the *prompting* that steered it.

> The original brief that started the project (`PLAN.md`) has been removed from the working tree. It is still in git history (`git show eb867af:PLAN.md`) and summarised in Step 0 below.

---

## TL;DR: what actually pushed it in this direction

1. **Name the era and scene, not a style.** "2000s underground UK hip hop / rap" pulled in concrete culture (pirate radio, DVDs, Nokias), where "gritty" or "urban" would not.
2. **Say "experimental", "crazy" and "insane" out loud.** Without those words the default is a tidy landing page.
3. **Give a frame to work in.** "As if you were designing in a design hackathon" meant: one bold concept, fully committed.
4. **Ask for research.** "Do lots of research into what this could mean" turned vague mood into buildable features.
5. **Ask for real photos and generated shapes.** Real images plus code-drawn graphics made it look made, not templated.
6. **Work in a new file.** An experiment file can go further without risking the working site.
7. **Correct by direction, not detail.** "It isn't as experimental and crazy now" got a bolder redesign than a list of fixes would have.
8. **Iterate in small, specific steps.** One change per prompt, checked before the next.

---

## The prompt ladder (real prompts, in order)

### Step 0: Start from a written brief
> Use the PLAN.md and build me a demo

`PLAN.md` described a "5EB Style Comparison": three landing-page styles side by side (editorial direct-flash, grungy streetwear DIY, low-light night casuals), each with a hero image box, an artist title, a mock audio player and a CTA button.

**Effect:** a three-column comparison page. A written brief with explicit palettes, typography and per-column rules gave a solid, comparable starting point.
**Takeaway:** start with a concrete brief, then react to what you see.

### Step 1: Pick favourites, reject one, change the era
> 1 and 2 are best. 3 i do not like
> i want some more 2000s underground UK hip hop / rap aesthic.
> use real photos from the internet also to illustrate the design

**Effect:** the third column was replaced with a photocopied-mixtape look (yellow and black, halftone, a Winamp-style player) and real Wikimedia photos were added to all three.
**Takeaway:** keep what works, name what doesn't, and give the era in plain words. Asking for real photos is what stops it looking like a template.

### Step 2: Double down on what you liked
> I like the third column now the most can we expand on this and create a new file with just the design with a more fleshed out page

**Effect:** a full landing page (hero, player, gallery, tour dates, bio, merch, signup).
**Takeaway:** "expand on X" plus "new file" turns a winning idea into a full page without touching the original.

### Step 3: Swap components and bring your own assets
> Cool lets make the media player an ipod touch, also use this image as the logo. stray away slightly from the yellow colour and move more towards the darker colours and the orange from the logo.
> Look up ##MOTIONMUZIK, as well would like some images and themes from that in this demo

**Effect:** an iPod touch player, the supplied logo, and a dark and orange palette.
**Takeaway:** attaching a logo and naming a colour direction ("away from yellow, towards orange and dark") re-themes a whole site in one go. A research reference that returns nothing should be reported as such and followed up with a link or screenshots.

### Step 4: Small design nudges
> Make it an iPod classic
> Remove the background / border for the logo also the ipod classic

**Effect:** a click-wheel iPod classic, then cleaner edges.
**Takeaway:** era-specific swaps ("iPod touch" → "iPod classic") are quick and strongly shift the feel.

### Step 5: The prompt that unlocked the experimental direction
> I want to try something crazy. Let's make a new file and add some insane animations and graphics using photos and shapes that match the underground 2000s uk hip hop and rap era aesethic.. Do lots of research into what this could mean and build something super experimental as if you were designing in a design hackathon

Why it worked, phrase by phrase:

| Phrase | What it changed |
|---|---|
| "try something crazy" / "insane animations" | Permission to leave safe defaults; motion became a core feature. |
| "make a new file" | A sandbox, so it could be bold without risk. |
| "photos and shapes that match the era" | Real photos and shapes drawn in code, in the era's style. |
| "lots of research into what this could mean" | Searches on grime culture, Channel U, Risky Roadz DVDs and pirate radio fed the actual features. |
| "super experimental" | Rules were bent: scroll-driven TV, generated audio, playable games. |
| "as if you were designing in a design hackathon" | One bold concept (every section is a device from the era), fully built. |

**Effect:** a camcorder hero, a scroll-driven CRT channel-surf, a pirate-radio tuner with a live synthesised beat, an LED bus-blind, a spray-paint wall, a DVD menu, and playable Snake on a Nokia photo.

### Step 6: Targeted feature requests on the experiment
> I want to add when you scroll through the channel surf the transition between the states has a VHS static kinda slash effect?
> Replace the 5ebtv tag in the top left with the logo
> On the page load up remove the buttons and just go straight into with sound played after a second or so
> For the tag the wall part make the spray paint just a bit more solid and less patchy, not straight solid but just a bit more realistic

**Takeaway:** vivid, felt descriptions ("VHS static kinda slash", "a bit more solid, not straight solid, but more realistic") get good results even without technical terms. A request that clashes with browser rules (autoplay) gets the nearest workable behaviour, with an explanation.

### Step 7: Fix usability without losing the vibe
> The snake game we need to make it a bit easier to understand what is going on and make the screen more visible, you cant really see how you're playing
> This is better but now the design isnt as experimental and crazy, lets try a quick redesign of this snake section

**Takeaway:** a two-step pattern: first fix clarity, then say honestly when the fix flattened the style and ask for a bolder redo. The result (the whole section became the LCD) was better than either step alone. "It isn't as experimental as before" is a strong, reusable correction.

### Step 8: Add a new section in the same spirit
> I want to add a component / section for a store for like merch
> I like the idea but I want more of an experiemntal undergorund 2000s uk hip hop aesethic / vibe for the store

**Effect:** a first, clean shop was rejected for being too generic. The second version became a 3am market stall: string lights, a clothes rail, a milk crate, cardboard price tags and a text-to-order checkout on a Nokia screen.
**Takeaway:** accept a functional first draft, then immediately push the vibe. Re-stating the aesthetic in the follow-up works.

### Step 9: Behaviour tweaks, redesign and trimming
> When you mouse over an item in the rail animate the item to center and stop swaying so you can press the buttons.
> Let's do another redesign on the actual cart / ya bag section
> Remove the haggle stuff
> Remove the bag indicator in the top right with the sound toggle

**Takeaway:** describe the interaction you want in plain words. Don't be afraid to ask for a redesign of one component, or to cut something that isn't working.

---

## Reusable prompt templates

### Start a new experimental piece
> I want to try something crazy. Make a new file and add insane animations and graphics using photos and shapes that match the **[era/scene]** aesthetic. Do lots of research into what this could mean and build something super experimental as if you were designing in a design hackathon.

### Make a component fit the vibe
> I like the idea but I want more of an experimental **[era/scene]** aesthetic / vibe for **[component]**.

### Push it further after a "safe" fix
> This is better but now the design isn't as experimental and crazy. Let's do a quick redesign of this section.

### Rebrand in one go
> Use this image as the logo. Move away from **[colour]** towards **[colours from the logo]** and darker tones.

### Ask for clarity without losing style
> Make it easier to understand what's going on and make **[the thing]** more visible, but keep it in the same experimental style.

### Ask for tactile feel
> Make **[effect]** a bit more solid/realistic, not fully solid, just a bit more convincing.

---

## Habits worth repeating

- **Use a new file or branch for risky ideas.** This project used a branch per feature, with conventional commit messages, merged back once approved.
- **Ask for real assets and say where they come from.** Photos were licensed Creative Commons images from Wikimedia and need credit if published.
- **Ask to see it working.** Each section was checked in a real browser with screenshots before being called done.
- **Say what you don't like plainly.** "I do not like it" and "it isn't as experimental" were more useful than technical instructions.
- **Make one request per prompt.** Small steps kept the style consistent.

## Things to be aware of
- Anything that autoplays sound is limited by browsers until the first click or key press.
- Product names, prices, songs and messages in the demo are placeholders.
- "##MOTIONMUZIK" returned no useful search results; supply links or screenshots if you want it referenced.
