# BRO, YOU'RE COOKED.

A physics rescue puzzle for YouTube Playables. One line. One shot. Get him out.

A little guy is walking, at his own pace, directly into something that will kill him.
The world stops one heartbeat before it happens.
You draw **one line**.
Time restarts.
He lives or he doesn't, and either way you understand exactly why within one second.
You are drawing again four seconds later.

## Where it stands — 2026-10-13

- **21 levels** in four chapters (the line · plate & gate · air · the finale),
  ordered by measured difficulty.
- **A daily challenge**: one level a day on the three-star ink budget, from a
  58-level deck, every day proved winnable by a shaky hand.
- **The YouTube build exists and the certification walk is done**:
  `dist/byc-playables.zip`, 53 KB gzipped, every machine-checkable requirement
  passing with evidence. Playables access is pending.
- **What happens next is [docs/PLAN.md](docs/PLAN.md).**

## The documents

| | |
|---|---|
| **[CLAUDE.md](CLAUDE.md)** | **Read first.** The rules this project paid for — every one cost a shipped bug, a wasted build or a failed playtest. Where any other document disagrees, this one wins. |
| [docs/PLAN.md](docs/PLAN.md) | How many levels, why, how they get built, and by whom. |
| [docs/PRODUCTION_BIBLE_v1.0.md](docs/PRODUCTION_BIBLE_v1.0.md) | The design spec: the Freeze, physics, art, the level schema. The code cites it by section. |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Locked calls and their reasoning. |
| [docs/HELD.md](docs/HELD.md) | 29 levels that were built and did not ship, and the measured reason for each. |
| [docs/CERTIFICATION.md](docs/CERTIFICATION.md) | Every Playables requirement, with its evidence. |
| [docs/launch/](docs/launch/) | Store words, cover, screenshots, how to put it on itch.io. |

## Run it

```bash
npm run serve                # → http://localhost:8080 (browser tests need it)
npm test                     # level data, physics, levels, curve, daily — fast
npm run build                # dist/: web page, YouTube ZIP, web ZIP
npm run film                 # films every level being won — READ THE IMAGES
```

The full list, and when to run what, is under COMMANDS in [CLAUDE.md](CLAUDE.md).

## What every level must clear

| Gate | Rule |
|---|---|
| Doing nothing fails | and the death cam explains why |
| Breadth | 2–40% of plausible strokes win |
| Precision floor | ≥25u — a thumb, on a 6 cm puzzle |
| Stability | a hand-drawn winner does not vibrate |
| Hand-robust | a certified winner survives three tremors |
| The A14 test | delete the level's noun and the outcome must change |
| The curve | it fits the measured difficulty order |

And then a person has to look at it: the films, the frozen frame, a playtest.
The gates measure fair. They cannot measure meaningful.

Star thresholds are measured, never typed.
