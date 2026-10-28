# LAUNCH — v1.0, 27 Oct 2026

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

- **The campaign**: 45 levels, as of release commit `f159983` on
  `claude/game-markdown-review-23hf3j`. Any change to it reshuffles every
  future daily challenge, so after launch change it in batches, and say so.
  **Tag it on GitHub** (this session's git access cannot push tags):
  Releases → Draft a new release → tag `v1.0` → target that commit.
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
| `npm run film` | All 45 levels won by their certified, hand-drawn lines in the real browser |
| `FILM_IDLE=1 npm run film` | All 45 lost with nothing drawn, each with a named reason |
| `npm test` | All physics gates pass |
| `npm run curve` | Pass |
| `npm run plates` | Pass (FUNNEL listed open) |
| `npm run test:board` | Pass |
| `npm run test:conformance` | Every machine-checkable YouTube row passes |
| Zips | 92 KB each |
