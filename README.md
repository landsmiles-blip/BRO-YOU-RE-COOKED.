# BRO, YOU'RE COOKED.

A physics rescue puzzle where one simple drawing can turn a disaster into a ridiculous
last-second save. The player does not need more buttons; they need better ideas.

**Platform:** YouTube Playables (primary) · open web (validation + revenue)
**Status:** Pre-production complete → entering M0 (Truth Machine)

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

## Current milestone — M0: Truth Machine

Capsules and grey circles. No art, no menu, no stars, no sound.

1. Boot skeleton + state machine + RAF loop
2. Physics adapter — fixed 120 Hz, 900 u/s clamp
3. **Free-fall + tunneling acceptance tests — nothing proceeds until both pass**
4. Drawing pipeline → anchoring
5. Milo locomotion
6. Levels A1–A4
7. Death cam + ghost stroke
8. Six comprehension gates, run on a stranger

**Exit gate:** a stranger can say out loud why Milo died, every time.
