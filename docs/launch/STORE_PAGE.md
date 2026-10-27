# Launch kit — the words and images for every store

Everything here comes from the real game: the builds in `dist/` and the images
in this folder, captured from it. Refreshed **27 Oct 2026** for v1.0. The first
kit (12 Oct) still said "21 levels" and showed the old look.

- Rebuild the zips with `npm run build`.
- Recapture the images with `node tools/launch/store-shots.mjs`.

The order to put it out, and what to read afterwards, is in **`LAUNCH.md`**.

| File | Use |
|---|---|
| `dist/byc-web.zip` | **The open web**: itch.io, CrazyGames, any static host. No YouTube SDK. |
| `dist/byc-playgama.zip` | **Playgama Sandbox**: real players' attempts per level (see `docs/PLAYGAMA.md`). |
| `dist/byc-playables.zip` | **YouTube**: upload in the Playables developer portal once access arrives. |
| `cover-630x500.png` | itch.io cover |
| `cover-1920x1080.png` | landscape key art (16:9) |
| `cover-800x1200.png` | portrait key art (2:3) |
| `screenshot-1` … `8` | store screenshots, in this order |

Portals that ask for other sizes say so on their upload page. Recapture at
those sizes rather than stretching these: add a line to the `cover(...)` list
in the script.

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
> 45 levels in seven chapters, each bringing something new to deal with:
> - falling rocks;
> - pressure plates and gates;
> - a dog that turns round at whatever you draw;
> - a swarm of bees that flies straight at anyone alive;
> - TNT;
> - air currents and balloons;
> - floors that crack.
>
> Three stars for the shortest line, and a new daily challenge every day with
> less ink than the level normally allows. Stuck? After a few tries you can
> skip a level and come back to it.
>
> No buttons to learn. If you can draw a line, you can play.

**How to play / controls:** Draw one line with your finger or mouse, then let
go. A line that touches something holds fast; a line in mid-air falls. That's
the whole game.

**Genre / tags:** Puzzle · Physics · Drawing · Casual · Hand-drawn · Brain ·
Dog · Mobile

**Audience:** general, 13+. A stick figure, no blood. A death is a word
("HE'S GONE") and a replay. Not made for kids; the title is slang.

**Accessibility facts** (for any portal that asks):
- one-finger play;
- no information carried by sound alone (it plays muted inside YouTube);
- no time pressure while drawing, because the world is frozen;
- reduced motion is honoured;
- legible at every aspect ratio from 9:32 to 32:9.

## itch.io (free, about ten minutes)

1. Sign in at itch.io → **Upload new project**.
2. **Title**: as above. **Kind of project: HTML**.
3. **Uploads**: add `dist/byc-web.zip`, and tick **This file will be played in
   the browser**.
4. **Embed options**:
   - viewport **405 × 720** (portrait);
   - tick **Mobile friendly** and **Fullscreen button**;
   - leave scrollbars off.
5. **Cover image**: `cover-630x500.png`. **Screenshots**: `screenshot-1` to `8`.
6. Paste the description and tags. **Visibility: Public** → **Save**.
7. Open the page on your phone and play level 1 to the end once.

(itch.io sometimes renames these options slightly; the choices are the same.)

## CrazyGames

1. Create a developer account at developer.crazygames.com.
2. Submit `dist/byc-web.zip` as an HTML5 game, with the description, the
   controls line, and the covers its form asks for.
3. Their QA reviews every game against technical and quality rules. Third
   parties report:
   - feedback in about one to two days;
   - a first "basic launch" that needs no SDK;
   - ads only through CrazyGames' own SDK.

   **Read the form for what it actually asks today.** If they offer a full
   launch, I add their SDK in a separate web build. The YouTube build is never
   touched.
4. It is not exclusive, so it can sit beside itch.io and Playgama.

**Poki is the exception:** it is reported to ask for web exclusivity, which
would rule out CrazyGames. Leave it until the numbers say which is worth more.

## What to send YouTube (the interest form or your Partner Manager)

> **BRO, YOU'RE COOKED.** — a one-line physics rescue puzzle built for Playables.
> Play it: <your itch.io link>
>
> Built for the platform from day one:
> - the Playables SDK loads first, and `firstFrameReady`/`gameReady` are wired;
> - cloud save via `saveData`/`loadData` is the only save;
> - `onPause` halts physics, audio and rendering;
> - zero external network calls;
> - a 92 KB zip, interactive 163 ms after load in our conformance run;
> - playable at all nine aspect ratios.
>
> 45 levels in seven chapters, plus a daily challenge. A certification dry-run
> against the published requirements is complete, and the ZIP is ready to
> upload.
> <After two weeks, add the real numbers: plays, levels finished per player,
> minutes per session, players who came back the next day.>

Playables access is reviewed by YouTube, and it weighs a creator's history and
past performance. A public link with real players' numbers turns the build into
evidence.
