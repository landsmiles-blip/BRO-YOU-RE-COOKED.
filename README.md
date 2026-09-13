# BRO, YOU'RE COOKED.

A physics rescue puzzle where one simple drawing can turn a disaster into a ridiculous
last-second save. The player does not need more buttons; they need better ideas.

**Platform:** YouTube Playables (primary) · open web (validation + revenue)
**Status:** M1 — eight levels shipping, solver-gated

> One line. One shot. Get him out.

---

## The game in six lines

A little guy is walking, at his own pace, directly into something that will kill him.
The world stops one heartbeat before it happens.
You draw **one line**.
Time restarts.
He lives or he doesn't, and either way you understand exactly why within one second.
You are drawing again four seconds later.

---

## Documents

| Document | What it is |
|---|---|
| **[docs/PRODUCTION_BIBLE_v1.0.md](docs/PRODUCTION_BIBLE_v1.0.md)** | **What the game is.** Blind-spot analysis, locked design, physics spec, art direction, level system. Includes **Amendment A** (platform-verification corrections). |
| **[docs/EXECUTION_ROADMAP_v1.0.md](docs/EXECUTION_ROADMAP_v1.0.md)** | **How it ships.** Strategy, verified platform constraints, milestones M0–M7 with gates and cut lines. |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Locked calls and their reasoning |
| [docs/CERTIFICATION_CHECKLIST.md](docs/CERTIFICATION_CHECKLIST.md) | Line-by-line sign-off sheet for the M5 certification dry-run |
| [docs/source/](docs/source/) | Original v0.2–v0.4 documents, kept as lineage |

v1.0 supersedes v0.2–v0.4. Where they disagree, v1.0 wins.

---

## Run it

```bash
node tools/serve.js          # → http://localhost:8080
npm test                     # physics gates + A1 solvability (headless)
npm run test:browser         # real Chromium: 6 aspect ratios + full playthrough
node tools/solver            # sweep ~1500 strokes/level, measure the gates
node tools/solver --check    # gates only, no write (regression mode)
```

## Solver gates

Every level is swept with ~1,500 human-shaped strokes and must clear all of
them. A level that fails does **not** ship — it is held back, not deleted.

| Level | Verb | Breadth (2–40%) | Precision (≥25u) | ★★/★★★ |
|---|---|---|---|---|
| A1 WALL | BLOCK | 22.0% | 45u | 300/222 |
| A2 GAP | BRIDGE | 3.9% | 45u | 336/230 |
| A3 REDIRECT | REDIRECT | 22.2% | 65u | 294/228 |
| A5 HANG | BLOCK | 17.3% | 65u | — |
| A7 PROP | SUPPORT | 4.4% | 45u | — |
| A8 JAM | WEDGE | 5.3% | 65u | — |
| A9 CHUTE | FUNNEL | 37.9% | 65u | — |
| A10 THE SWITCH | TRIGGER | 22.7% | 65u | — |

**Held back** (in the repo, not in the game):
- **A4 CATCH** — precision floor pinned at 10u at every geometry tried.
- **A6 RAMP** — only passes with a 47u wall, barely above the 22u step-up.

Star thresholds are **measured, never typed**. Re-run after any physics change.

## Current milestone — M0: Truth Machine

Capsules and grey circles. No art, no menu, no stars, no sound — by design.

| | |
|---|---|
| Boot, state machine, fixed-step loop | done |
| Physics adapter (120 Hz, 900 u/s clamp) | done |
| Free-fall + tunneling gates | **passing** |
| Drawing pipeline → anchoring | done |
| Milo locomotion (walk / airborne / stunned, step-up) | done |
| **A1 WALL · A2 GAP · A3 REDIRECT · A4 CATCH** | done — 31 assertions |
| Death cam + causality + ghost stroke | done |
| Hollow-ring closed strokes | done |
| **Procedural art system** (boiling line, Milo rig, freeze) | done — **0 art assets** |
| Six comprehension gates, on a stranger | needs a human |

**Payload: 68.8 KB gzipped** — 0.45% of the 15 MiB recommended Playables
ceiling, with zero image or audio assets. Load time is the competitive
weapon in a programme that prioritises fast-loading games.

**Exit gate:** a stranger can say out loud why Milo died, every time.
