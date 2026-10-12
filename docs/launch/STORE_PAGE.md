# Launch kit — the public link and the Playables application

Everything here comes from the real game: the build in `dist/`, the images in
this folder, captured from it. Rebuild with `node tools/build.js`.

| File | Use |
|---|---|
| `dist/byc-web.zip` | **The open web.** Upload to itch.io (or any static host). No YouTube SDK. |
| `dist/byc-playables.zip` | **YouTube.** Upload in the Playables developer portal once access arrives. |
| `cover-630x500.png` | itch.io cover image |
| `screenshot-1` … `6` | store screenshots, in this order |

## The words

**Title:** BRO, YOU'RE COOKED.

**Tagline:** One line. One shot. Get him out.

**Short description:** A physics rescue puzzle. Milo is walking into trouble —
draw one line to save him.

**Description:**

> A little guy is walking, at his own pace, directly into something that will
> squash him. The world stops one heartbeat before it happens. You draw one
> line. Time restarts. He lives or he doesn't — and either way you see exactly
> why, and you're drawing again four seconds later.
>
> 21 levels that each add one new idea: rocks, ramps, pressure plates, air
> currents, levers, balloons and floors that crack. Three stars for the
> shortest line, and a new daily challenge every day with less ink than the
> level normally allows.
>
> No buttons to learn. If you can draw a line, you can play.

**How to play:** Draw one line with your finger or mouse, then let go. A line
that touches something holds fast; a line in mid-air falls. That's the whole
game.

**Genre / tags:** Puzzle · Physics · Drawing · Casual · Hand-drawn · Mobile

## Put it online (itch.io, free) — about ten minutes

1. Sign in at itch.io → **Upload new project**.
2. **Title**: as above. **Kind of project: HTML**.
3. **Uploads**: add `dist/byc-web.zip`, and tick **This file will be played in
   the browser**.
4. **Embed options**: viewport **405 × 720** (portrait), tick **Mobile
   friendly** and **Fullscreen button**, leave scrollbars off.
5. **Cover image**: `cover-630x500.png`. **Screenshots**: `screenshot-1` to `6`.
6. Paste the description and tags. **Visibility: Public** → **Save**.
7. Open the page on your phone and play level 1 to the end once.

(itch.io sometimes renames these options slightly; the choices are the same.)

**Faster, but less polished:** the game link you already have is private.
Open it, use **Share → Anyone with the link**, and that URL works for anyone
— no setup, but no store page around it either.

## What to send to YouTube (the interest form / your Partner Manager)

> **BRO, YOU'RE COOKED.** — a one-line physics rescue puzzle built for Playables.
> Play it: <your public link>
>
> Built for the platform from day one: the Playables SDK loads first,
> `firstFrameReady`/`gameReady` are wired, cloud save via `saveData`/`loadData`,
> `onPause` halts physics, audio and rendering, zero external network calls.
> 67 KB gzipped, interactive in under 1.5 s on slow 4G, playable at all nine
> aspect ratios. 21 levels plus a daily challenge. A certification dry-run
> against the published requirements is complete; the ZIP is ready to upload.

The roadmap calls sending this link "the single highest-leverage action in the
entire plan": it turns the build into approval evidence.
