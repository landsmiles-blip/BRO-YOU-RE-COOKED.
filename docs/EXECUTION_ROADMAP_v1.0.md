# BRO, YOU'RE COOKED.
## Execution Roadmap v1.0 — Idea to Launched Playable

**Companion to:** `PRODUCTION_BIBLE_v1.0.md` (what the game is) + `AMENDMENT_A` within it.
**This document:** how it ships.
**Status:** Active production plan.

**Operating position:**

| | |
|---|---|
| Playables access | Interest form submitted, awaiting review |
| Resources | Solo + Claude Code, ~$0 asset budget |
| Timeline | Quality-gated — milestones are *passed*, not *finished* |
| Distribution | Dual-track: open web + Playables |

---

# 1. STRATEGIC POSITION

## 1.1 Two products, three files apart

~95% of the code is shared. The two builds differ only at the adapter boundary.

| | **Product A — Web** | **Product B — Playables** |
|---|---|---|
| Purpose | Application artifact · analytics · revenue | The prize |
| Network | Analytics allowed | **Zero external calls — prohibited** |
| Storage | Guarded `localStorage` | `saveData` / `loadData` |
| Lifecycle | Page Visibility API | `onPause` / `onResume` |
| Ads | Portal-appropriate | `requestRewardedAd(id)` |
| Ships at | **M3** | **M7** |

## 1.2 Two clocks

Google's approval clock is outside your control. Your build clock is not.

> **The job is to finish the build at or before approval lands — and to make the build accelerate approval.**

Playables is a Limited/Early Access program. Approval is reported to take weeks-to-months, is decided by YouTube team review, and is evaluated on technical excellence, UX and policy compliance — with a **working, publicly-hosted demo** as a core input. Release itself runs through a designated Partner Manager, on a channel with channel-manager permissions that has been onboarded to Playables.

**Therefore the open-web build is not late-stage validation. It is Milestone 3, and it is the application artifact.** The Production Bible had it as Phase 3 (after content, before Playables prep). Given the access model, that ordering was wrong. One public URL does three jobs simultaneously:

1. The strongest evidence you can put in front of the review team.
2. Your **only** source of analytics anywhere — Playables prohibits all external network calls, naming Google Analytics and GameAnalytics specifically.
3. Independent revenue and a real product if approval is slow, or never comes.

Nothing built is wasted regardless of Google's answer. That is the definition of a strategy rather than a bet.

## 1.3 The weapon is load time

Initial bundle **MUST** be < 30 MiB and **SHOULD** be < 15 MiB, measured from page-load start to the `gameReady` call, with ~5 seconds to interactive.

The Bible's procedural art and synthesised-audio direction puts the entire game at **≈200 KB** — roughly **1.3% of the recommended ceiling**, interactive in well under a second on a cold cache.

In a program that explicitly prioritises fast-loading, responsive, casual games, this is not a nice-to-have. It is the single clearest signal available that this submission is a serious one.

---

# 2. VERIFIED PLATFORM CONSTRAINTS

Every line below is a coded requirement or a QA gate, not background reading. Sources in §9.

### 2.1 Integration
- [ ] SDK **loads before any game code** — first script in `index.html`, ahead of module imports.
- [ ] `firstFrameReady` called when the first meaningful frame paints.
- [ ] `gameReady` called when the game accepts input.
- [ ] Cloud save via `saveData` / `loadData`, with **data integrity and backward compatibility across game versions**.
- [ ] **All** execution pauses on `onPause`; resumes only on `onResume` — game loop, music, interactions, rendering.
- [ ] **No external network calls.** All data in the initial bundle.

### 2.2 Stability & performance
- [ ] Initial bundle **< 30 MiB required**, **< 15 MiB recommended**, measured page-load → `gameReady`.
- [ ] Peak JS heap **< 512 MB** (cited cause of iPhone crashes).
- [ ] Does not crash the YouTube app, site, or other software. No reproducible crashes.
- [ ] Loads and is interactive within ~5 seconds.

### 2.3 Design
- [ ] Playable at **9:32, 9:21, 9:16, 3:4, 1:1, 4:3, 16:9, 21:9, 32:9**, auto-adjusting on viewport change.
- [ ] **Never locks device orientation or device posture.**
- [ ] Fills the viewport, or is centred with pillarbox / letterbox.
- [ ] Touch **and** mouse input.
- [ ] **Game state survives window resizing.**
- [ ] Text and graphics render clearly at all resolutions and pixel densities.

### 2.4 Monetization
- [ ] Ad-only: preroll, interstitial, rewarded.
- [ ] `requestRewardedAd(id)` fired only on explicit player request, with a unique reward ID.

### 2.5 Privacy / Trust & Safety
- [ ] **Reward IDs contain no user data** — readable string or UUID.
- [ ] No external analytics of any kind.
- [ ] YouTube Community Guidelines; general audience **13+**; **not "made for kids."**

### 2.6 Process
Certification spans **integration, design, stability/performance, monetization, privacy/data, trust & safety**. The developer portal exposes a **"Verify and test"** flow. Expect **~2–7 business days** from testing start to platform release, with catalog listing following within days.

### 2.7 Known rejection causes — design against these from commit one
1. Text rendering on high-density screens
2. Crashes on specific device models
3. Pause/resume lifecycle failures
4. Initial load size

---

# 3. MILESTONES

A milestone is not *done*. It is **passed**. No milestone begins before the previous gate passes.

## M0 — Truth Machine
*Capsules and grey circles. Zero art. Bible Phase 0.*

- Boot skeleton, state machine, RAF loop
- `js/physics/adapter.js` — fixed 120 Hz step, 900 u/s global clamp
- **Free-fall unit test + tunneling acceptance test — written before any level exists**
- Drawing pipeline → anchoring (weld-on-release, anchor sparks)
- Milo three-state locomotion + step-up
- A1 WALL · A2 GAP · A3 REDIRECT · A4 CATCH
- Death cam + causality tracking + ghost stroke — **inside M0**, because gate 6 measures them

**Gate:** both physics tests green, plus the Bible's six comprehension gates run on a stranger with no coaching. Gate 6 — *they can say out loud why Milo died, every time* — is the one that matters.

**Cut line:** gates 1–4 fail → the mechanic is wrong. Redesign or kill. **Do not add content.**

## M1 — Feel & Look

- Boiling-line stroke renderer, built **standalone first**
- Milo rig + danger scalar; freeze / unfreeze transition
- WebAudio synthesised SFX, impulse-driven
- **Solver harness** (headless Node) — solvability, breadth, precision floor, star thresholds
- Levels 1–10
- Responsive contain-fit + all nine ratios
- Heap soak test

**Gate:** thumbnail test on 5 strangers · solver passes all 10 levels on all 6 checks · 60 fps on mid-range Android · legible at 320 px · **measured** authoring cost per level · heap stable across 200 retries.

**Cut lines:**
- Stroke renderer doesn't sing within one week → the $0 art thesis has failed. **Stop and escalate to the user.** This is the money-in decision point.
- Authoring cost > 90 min/level → shippable game drops from 24 levels to 16, decided on data.

## M2 — The Complete Game

- Levels 11–24 (Bible §7.4 ladder — **do not cut level 20**)
- **Full meta shell** (§7.5): level select, stars /72, real ending + stat card, 3★ chase, settings, save/restore
- Save schema + version ladder
- Rewarded-ad **placeholders** (no live ads)

**Gate:** a stranger plays cold boot → ending screen, unassisted, hitting no broken state.

## M3 — Web Launch · **the application artifact**
*The strategic pivot.*

- Analytics adapter live (web only)
- HTTPS hosting, stable, fast, public URL
- Landing page — title, one-line pitch, the frozen tableau as hero image
- Instrument the Bible §68 metric list

**Gate:** live and stable · < 1s to interactive on throttled 4G · analytics flowing · zero console errors.

**Then, immediately:** send the URL to the Partner Manager / update the interest-form submission. **This is the single highest-leverage action in the entire plan** — it converts your build into approval evidence.

## M4 — Data & Tune
*Where the Bible's open questions get answered instead of argued.*

- **Retry-after-failure rate** — the most diagnostic number in the project
- Time-to-first-input · L1/L3 completion · attempts per level · % reaching 10 minutes
- Retune gravity, speed, thresholds — then re-run the solver as a regression suite

**Gate:** retry rate healthy. If players fail once and leave, the loop is not addictive and **no amount of content fixes it.**

## M5 — Playables Conformance Build
*Mechanical, if M0–M4 respected the adapter boundary.*

- SDK as first script; `firstFrameReady` / `gameReady` placement
- `saveData` / `loadData` + version ladder
- `onPause` / `onResume` freezing **everything**
- `requestRewardedAd(id)`, UUID reward IDs, no user data
- Analytics compiled out — **build-time grep proves zero network primitives**
- ZIP packaging; bundle measured to `gameReady`
- Full nine-ratio pass + resize-mid-run + high-density text

**Gate:** internal certification dry-run — `CERTIFICATION_CHECKLIST.md` walked line by line and signed off **before** submission. **Budget for one rejection round.** Assuming a clean first pass is how schedules slip.

## M6 — Certification
Portal release → "Verify and test" → submit → iterate with the Partner Manager.

## M7 — Launch & Live Ops
Catalog listing, monitoring, and post-launch content from the 60-level runway **only if retention justifies it**.

---

# 4. DUAL-BUILD ARCHITECTURE

The Bible §8.1 layout stands. The dual-track makes the adapter boundary **enforced, not aspirational**:

| File | Rule |
|---|---|
| `js/platform/sdk.js` | The only file touching the Playables SDK. No-op stub elsewhere, so dev runs in a plain browser tab. |
| `js/platform/storage.js` | SDK-first, try/catch fallback, version ladder. **Never** bare `localStorage`. |
| `js/platform/analytics.js` | Real on web. **Hard no-op** in Playables. |
| `js/physics/adapter.js` | The only file importing Matter. Planck.js escape hatch intact. |

One source → `dist/web/` and `dist/playables/` (ZIP). A build-time check greps the Playables target for `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` and **fails the build** on any hit. Compliance becomes impossible to forget rather than a thing to remember.

---

# 5. QA MATRIX

| Axis | Coverage |
|---|---|
| Aspect ratios | All nine required, **plus resize mid-simulation** |
| Pixel density | 1×, 2×, 3× DPR — text legibility is a named rejection cause |
| Input | Touch, mouse, and both on one device |
| Lifecycle | Pause/resume during **freeze, drawing, simulation, death cam** |
| Memory | 200-retry soak, heap sampled, < 512 MB peak |
| Load | Cold-cache page-load → `gameReady` on throttled 4G |
| Physics | Free-fall analytic · tunneling (20 angles) · full solver regression |

---

# 6. RISK BURNDOWN

| Risk | Mitigation | Owned by |
|---|---|---|
| Approval never comes | Web build is an independent product with its own revenue — nothing wasted | M3 |
| Tunneling / physics leak | Acceptance test before any level; adapter escape hatch | M0 |
| Failure illegible | Death cam + causality + ghost stroke; gate 6 | M0 |
| Procedural art reads as programmer art | One-week cut line on the thumbnail test | M1 |
| Aspect-ratio rejection | Contain-fit safe box, nine ratios tested from M1 | M1 / M5 |
| Pause/resume rejection | Named rejection cause — wired from first commit, explicitly tested | M0 / M5 |
| Content treadmill | Solver harness + measured authoring-cost cut line | M1 |
| Accidental network call | Build-time grep fails the build | M5 |

---

# 7. VERIFICATION

- **Physics:** `node tools/test/freefall.js` asserts `d = ½gt²` within 1%. `node tools/test/tunnel.js` fires a body at 900 u/s into a 16-unit static line from 20 angles and asserts 20 contacts. **Both green before A1 exists.**
- **Levels:** `node tools/solver <level>` returns solvable, breadth 2–40%, precision floor ≥ 25 u, and writes measured star thresholds back into the level file. Re-run across all levels after any physics change.
- **Playability:** the game runs in a plain browser tab throughout development (SDK stubbed), so M0–M4 are verifiable by playing them.
- **Certification:** `CERTIFICATION_CHECKLIST.md` walked line by line at M5.

---

# 8. THE NEXT ACTION

M0, in strict order:

1. Repo scaffolding + `index.html` + state machine + RAF loop
2. `js/physics/adapter.js` — fixed 120 Hz, speed clamp
3. **The two physics acceptance tests. Nothing else proceeds until both pass.**
4. Drawing pipeline → anchoring
5. Milo locomotion
6. A1–A4
7. Death cam + ghost stroke
8. Six gates, on a stranger

---

# 9. SOURCES

Platform requirements verified against Google's official Playables documentation:

- [YouTube Playables — overview](https://developers.google.com/youtube/gaming/playables)
- [Integration requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_integration)
- [Stability and performance requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_stability)
- [Design requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_design)
- [Monetization requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_monetization)
- [Privacy requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_privacydata)
- [Trust & safety requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_trustsafety)
- [Certification FAQ](https://developers.google.com/youtube/gaming/playables/support/certification_faq)
- [Design best practices](https://developers.google.com/youtube/gaming/playables/certification/best_practices_design)
- [Monetization SDK reference](https://developers.google.com/youtube/gaming/playables/reference/monetization)
- [Developer Portal](https://developers.google.com/youtube/gaming/playables/developer_portal)

**Caveat that does not expire:** platform requirements change. Google's live documentation is the final authority at implementation and certification time — re-verify §2 immediately before M5.
