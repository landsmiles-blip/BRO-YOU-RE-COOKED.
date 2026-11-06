# LAUNCH — v1.0, 27 Oct 2026

> **STATUS, 6 Nov 2026 (read this first).** This file describes the 27 Oct launch.
> What is true now: tag `v1.0` = `5d38d3b` and tag `v1.0.1` = `c9a273a` (D12: BRIDGE
> is the Chapter 1 boss). The Playgama-ready work (Bridge pause/audio/storage/ads,
> recorded sound, full-window layout, new covers) is on branch
> `prelaunch/playgama-compliance`, pushed, NOT merged to `main` and NOT tagged.
> Current zips (5 Nov): YouTube 96,790 B, web 96,794 B, Playgama 493,269 B (it
> carries the recorded-sound bank). Details: `docs/launch/PLAYGAMA-CHECKLIST.md`,
> `docs/DECISIONS.md` D13-D16.

**Decision (D11 in docs/DECISIONS.md):** ship the 45 levels now to the places
that will take them today. Stop adding content. Let real players' numbers
decide what comes next.

YouTube Playables is still applied for, but its door is Google's:
- early access only, with no published timeline;
- revenue sharing is a pilot with no published split.

## Where it goes, in this order (your part, about an hour)

| # | Where | What it is for | Steps |
|---|---|---|---|
| 1 | **Playgama Sandbox** | Real players' attempts **per level**, the input the difficulty curve has never had | `docs/PLAYGAMA.md`: create the account, optionally connect it to Claude, then tell me to go (or upload `dist/byc-playgama.zip` yourself). **Never tick YouTube there.** |
| 2 | **itch.io** | A public link, comments, ratings; the link YouTube gets | `STORE_PAGE.md` → itch.io; `dist/byc-web.zip` |
| 3 | **CrazyGames** | A large web audience, not exclusive | `STORE_PAGE.md` → CrazyGames; `dist/byc-web.zip` |
| 4 | **YouTube** | The original target | After two weeks: the message in `STORE_PAGE.md`, with the real numbers |

Also yours, before YouTube: the content and audience sign-off, and whether to
commission a trademark search on the title (`docs/CERTIFICATION.md` §6,
`docs/DECISIONS.md` D4).

## Frozen at launch

- **The campaign**: 45 levels. It was frozen at commit `f159983` on 27 Oct; the
  tags that exist now are `v1.0` = `5d38d3b` and `v1.0.1` = `c9a273a`, which
  re-ordered Chapter 1 only (D12). Any change to it reshuffles every future
  daily challenge, so after launch change it in batches, and say so.
  (Tags exist on GitHub; do not move them: a change gets a new tag.)
- **No new levels until the numbers are in.** The 25 open slots, bee slot 29,
  FUNNEL's back door and the eight levels over the 60-try ceiling all wait for
  real attempts.
- The skip is the safety valve meanwhile. It is offered after 3 failures on a
  spike or boss level and 5 elsewhere, and granted free when no ad is
  available, so a wall cannot end anyone's game.

## What to read

**After one week**
- Playgama: plays, and how many players reach levels 5, 10, 20 and 45 (the drop-off).
- itch.io / CrazyGames: comments. Read every one; a level named twice is a finding.

**After two weeks**
1. Export the Playgama runs. Then run:
   - `node tools/lib/import-tries.mjs export.csv > data/playtests/attempts.json`
   - `python3 tools/lib/fit-curve.py --real data/playtests/attempts.json`

   This prints real against simulated attempts, level by level.
2. Minutes per session (target about 10), and how many players came back the
   next day.

## What the numbers decide

| If | Then |
|---|---|
| A level's real attempts are more than 2× its simulated ones, or the drop-off spikes there | Ease or hold that level first, before anything new is built |
| Players finish the campaign and come back the next day | Build the next chapter: new levels are worth paying for |
| Players leave early and do not come back | Fix the first ten levels and the daily before adding anything |
| The numbers are strong | Send them to YouTube, or take a Playables publisher, with the evidence in hand |

## The release gate this build passed (27 Oct)

| Check | Result |
|---|---|
| `npm run film` | All 45 levels won by their certified, hand-drawn lines in the real browser. **Chapter 1 was re-shot on 6 Nov 2026 in the D12 order: 8 of 8 won** (films read, BRIDGE included); the other 37 were last shot 27 Oct, and their order did not change |
| `FILM_IDLE=1 npm run film` | All 45 lost with nothing drawn, each with a named reason |
| `npm test` | All physics gates pass |
| `npm run curve` | Pass |
| `npm run plates` | Pass (FUNNEL listed open) |
| `npm run test:board` | Pass |
| `npm run test:conformance` | Every machine-checkable YouTube row passes on Linux. **On Windows 6 Nov: 46 pass, 5 cannot run** (they build file paths with `.pathname` and call a Linux `unzip`; the files exist) |
| `npm run test:browser` / `test:board` / `test:audio` | Pass on 6 Nov (Chromium 1234; `test:board` needs `BASE_URL=http://127.0.0.1:8080/` with `npm run serve` running) |
| Zips (5 Nov) | YouTube 96,790 B, web 96,794 B (about 95 KB each), Playgama 493,269 B |
