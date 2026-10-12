# Certification Evidence — BRO, YOU'RE COOKED.

**Walked:** 2026-10-12, against `docs/CERTIFICATION_CHECKLIST.md`, on build
`dist/byc-playables.zip` (one file: `index.html`, 233 KB raw / 67 KB gzipped).
**Re-run the machine half:** `node tools/build.js && node tools/serve.js &` then
`node tools/test/conformance.js`, `node tools/test/board.js`,
`node tools/test/audio.js`, `npm test`.

Google's live docs were re-checked for the integration rules on this date (SDK
`game_api/v1` before any game code, `index.html` at the bundle root, ZIP upload,
< 30 MiB, no external calls, `firstFrameReady` then `gameReady`). Their
**Playables SDK Test Suite** exists for pre-submission validation and needs
portal access — run it first thing once access arrives.

Legend: **PASS** with evidence · **PROXY** measured here, needs a real device ·
**HUMAN** only a person can sign · **N/A** does not apply.

## Found and fixed during this walk

- **The YouTube build did not exist.** The shipped bundle had only a commented
  SDK slot, and the conformance check read the slot in the DEV page, so the
  first integration requirement was unmet in the file that would be uploaded
  while every gate was green. `tools/build.js` now emits
  `dist/playables/index.html` (SDK first) and `dist/byc-playables.zip`, and
  conformance checks the uploaded file itself.
- **The board gate never ran its second half.** It crashed fetching a file the
  page cannot reach; the "button never swallows a stroke" check had never run.
  Fixed; it passes.

## 1. Integration

| | Requirement | Evidence |
|---|---|---|
| PASS | SDK is the first script | conformance: YouTube build's first script is `game_api/v1`, and it is the only script with a `src` |
| PASS | `firstFrameReady` on first meaningful frame | conformance: called, and before `gameReady` |
| PASS | `gameReady` when input is accepted | conformance: time to interactive 150 ms |
| PASS | Cloud save via `saveData`/`loadData` | conformance: round-trip through the cloud; `loadData` used on boot |
| PASS | Save versioned; old loads; unknown degrades | conformance: versioned payload, unknown version and malformed data degrade without throwing; `tools/test/daily.js`: a v1 save migrates |
| PASS | `onPause` halts everything | conformance: physics frozen (simTime unchanged), phase clock stopped, audio context SUSPENDED; `audio.js`: pause suspends, resume restores |
| PASS | `onResume` restores, no catch-up | conformance: 100 ms of simulation in 120 ms of wall clock after resume |
| PASS | Zero external network calls | build gate (5 primitives) + conformance grep: clean |
| PASS | All game data in the initial bundle | one file; conformance: no asset URLs |

## 2. Stability & performance

| | Requirement | Evidence |
|---|---|---|
| PASS | Bundle < 30 MiB (< 15 recommended) | 67.3 KB gzipped — 0.44% of 15 MiB |
| PASS | Peak heap < 512 MB | conformance 200-retry soak: peak 5.8 MB |
| PASS | Time to interactive < 5 s | 150 ms local; **1.46 s on Slow 4G (1.6 Mbps, 150 ms RTT) with CPU x4, cold cache, uncompressed**; 2.13 s on Fast 3G |
| PASS | No leak across 200 retries | 4.3 → 4.8 MB |
| PROXY | 60 fps on mid-range Android | Locked 16.7 ms frames at native CPU. With CPU x4 and SOFTWARE canvas (headless, no GPU — pessimistic): median 16.7 ms, p95 33.4 ms on the heaviest levels. Physics is fixed-step, so a slow frame never changes an outcome. **Check on a real mid-range Android.** |
| HUMAN | No crashes across the device matrix | needs devices |
| HUMAN | Does not crash the YouTube app | portal "Verify and test" |

## 3. Design

| | Requirement | Evidence |
|---|---|---|
| PASS | Playable at all nine ratios, 9:32 → 32:9 | conformance: nine screenshots, each read by eye (letterbox at 9:32, pillarbox at 32:9, HUD legible) |
| PASS | Auto-adjusts on viewport change | conformance ratio pass + resize test |
| PASS | State survives resize mid-simulation | conformance: t 700 → 942 ms, stroke kept, phase sim |
| PASS | Never locks orientation | conformance grep: clean |
| PASS | Fills viewport or letterboxes | nine-ratio screenshots |
| PASS | Touch input works | real touch events (CDP) drew the certified stroke and WON a1-wall and a31-thorns |
| PASS | Mouse input works | every filmstrip, the board gate |
| PASS | Both on a hybrid device | input is Pointer Events only (`js/input.js`), one path for touch, mouse and pen |
| PASS | Text legible at 1x/2x/3x DPR | conformance: canvas backing at native resolution for each; the 3x screenshot read by eye |
| PASS | Graphics clear at all resolutions | same 3x screenshot |
| PASS | Small embed 320 x 480 | conformance: legible AND a stroke committed |

## 4. Monetization

| | Requirement | Evidence |
|---|---|---|
| PASS | Rewarded ad only on explicit request | it has NO call site by design; `tools/test/ads.js` fails if one appears |
| N/A | Reward IDs unique / no user data | no rewarded ad |
| PASS | No ad before meaningful investment | `ads.js`: first interstitial after level 3, every 3rd level after, never over the ending |

## 5. Privacy & data

| | Requirement | Evidence |
|---|---|---|
| PASS | No external analytics | `analytics.js` is a hard no-op when the SDK is present; conformance grep clean |
| PASS | No user data transmitted | zero network primitives |
| N/A | No user data in reward IDs | no rewarded ad |

## 6. Trust & safety / content

| | Requirement | Evidence |
|---|---|---|
| HUMAN | Community Guidelines | Reviewed: a stick figure, no blood or gore, a death is a label ("HE'S GONE") and a replay; the title is slang. Needs your sign-off. |
| HUMAN | General audience 13+ | as above |
| HUMAN | Not made for kids | designed for a general audience; your call on the portal's audience setting |
| PASS | No third-party IP | no image, font or audio files in the bundle; the character and art are procedural |
| PASS | No copyrighted music or SFX | every sound is synthesised in `js/audio.js` |
| HUMAN | Title cleared (trademark) | decision D4 — a real trademark search is yours to commission |
| PASS | Art original | procedural ink rendering; nothing generated |

## 7. Packaging & submission

| | Requirement | Evidence |
|---|---|---|
| PASS | Self-contained HTML5 ZIP | `dist/byc-playables.zip`: `index.html` at the root, nothing else; conformance checks it |
| HUMAN | Channel onboarded to Playables | access pending (interest form submitted) |
| HUMAN | Partner Manager contact | pending access |
| HUMAN | Portal "Verify and test" + the SDK Test Suite | pending access |
| HUMAN | One rejection round budgeted | 2–7 business days testing → release |
