# Certification — BRO, YOU'RE COOKED.

Every YouTube Playables requirement, with the evidence that it is met. Walked
**2026-10-12**, against Google's published requirements (sources at the end), on build
`dist/byc-playables.zip` (one file: `index.html`). **Machine half re-run 2026-10-13**
on the purged build — 185 KB raw / 53 KB gzipped, shelved levels out of the
bundle — and every row still passes; the figures below are that run's.
**Re-run the machine half:** `npm run build && npm run serve &` then
`npm run test:conformance`, `npm run test:board`, `npm run test:audio`, `npm test`.

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
- **Found 2026-10-19, from Google's save rules: progress went to TWO places.**
  Every save was mirrored to `localStorage` as a backup, inside Playables too,
  and Google's wording is "Game MUST NOT use any other mechanism to save user
  progress". The old row below said PASS because it only checked that the
  cloud save worked. Inside Playables the cloud is now the only save and
  `localStorage` is used only off the platform, as in Google's own sample.
  The same walk found that a save could be asked for before `loadData` had
  landed (the sound switch, pressed early), which the platform rejects — and
  which, if it were accepted, would write a fresh progress over the player's
  real one. Nothing is sent now until a load has succeeded, and what the player
  did first is folded into the save when it arrives. `tools/test/save.js` and
  conformance both check it; the test fails ten checks on the old code.

## 1. Integration

| | Requirement | Evidence |
|---|---|---|
| PASS | SDK is the first script | conformance: YouTube build's first script is `game_api/v1`, and it is the only script with a `src` |
| PASS | `firstFrameReady` on first meaningful frame | conformance: called, and before `gameReady` |
| PASS | `gameReady` when input is accepted | conformance: time to interactive 82 ms |
| PASS | Cloud save via `saveData`/`loadData` | conformance: round-trip through the cloud; `loadData` used on boot |
| PASS | No other mechanism saves progress | inside Playables the browser's storage is never touched, read or write: conformance counts every `Storage` call through boot, a save and a load (0), and `tools/test/save.js` asserts it on and off the platform |
| PASS | `loadData` completes before any `saveData` | conformance holds the load, presses the sound switch, and sees no save until the load lands — then one save carrying the switch AND the stars already in the cloud; `save.js`: a save before or during the load, or after a failed one, is never sent |
| PASS | Save versioned; old loads; unknown degrades | conformance: versioned payload, unknown version and malformed data degrade without throwing; `tools/test/daily.js`: a v1 save migrates; `tools/test/progress.js`: v1 and v2 saves migrate to v3 (skips and tokens), an old save keeps every level up to its furthest open, and impossible token counts are dropped |
| PASS | Follows YouTube's sound setting | `ytgame.system.isAudioEnabled()` sets the starting state and `onAudioEnabledChange` is followed live (`js/main.js`); the player's own switch can only turn sound further OFF; `ads.js` asserts both calls on a mocked platform and audio-on off it |
| PASS | Audio does not wait for a tap | Google's FAQ calls this the most common audio failure. Inside Playables the sound starts once the save says whether the player muted it, and a tap resumes it if the browser held it back; conformance: an audio context exists before any gesture |
| PASS | `onPause` halts everything | conformance: physics frozen (simTime unchanged), phase clock stopped, audio context SUSPENDED; `audio.js`: pause suspends, resume restores |
| PASS | `onResume` restores, no catch-up | conformance: 100 ms of simulation in 120 ms of wall clock after resume |
| PASS | Zero external network calls | build gate (5 primitives) + conformance grep: clean |
| PASS | All game data in the initial bundle | one file; conformance: no asset URLs |

## 2. Stability & performance

| | Requirement | Evidence |
|---|---|---|
| PASS | Bundle < 30 MiB (< 15 recommended) | 53.2 KB gzipped — 0.35% of 15 MiB |
| PASS | Peak heap < 512 MB | conformance 200-retry soak: peak 5.5 MB |
| PASS | Time to interactive < 5 s | 82 ms local; **1.46 s on Slow 4G (1.6 Mbps, 150 ms RTT) with CPU x4, cold cache, uncompressed**; 2.13 s on Fast 3G (throttled figures measured 2026-10-12 on the larger 67 KB build) |
| PASS | No leak across 200 retries | 3.5 → 4.5 MB |
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
| PASS | Esc closes a dialog (SHOULD) | the level board is the one dialog; conformance opens it and presses Escape |

## 4. Monetization

| | Requirement | Evidence |
|---|---|---|
| PASS | Rewarded ad only on explicit request | its one call site is the SKIP, a button the player taps on the fail card after 3 failures on a spike or boss level (5 elsewhere), never on levels 1-3 or the daily; `tools/test/ads.js` asserts each rule and that a playthrough which never skips requests no rewarded ad |
| PASS | Reward IDs unique / no user data | `skip-<level id>`: one per level, built from level data only; asserted in `ads.js` |
| PASS | No ad before meaningful investment | `ads.js`: first interstitial after level 3, every 3rd level after, never over the ending; no interstitial straight after a rewarded ad (the counter resets); the skip is granted even when no ad is shown, so an ad is never the only way forward |

## 5. Privacy & data

| | Requirement | Evidence |
|---|---|---|
| PASS | No external analytics | `analytics.js` is a hard no-op when the SDK is present; conformance grep clean |
| PASS | No user data transmitted | zero network primitives |
| PASS | No user data in reward IDs | `skip-<level id>` only |

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
| HUMAN | Not "substantially identical" to another Playable (policy of 25 Aug 2026) | Undefined test, so judged by eye. Closest rival: **Save The Pets** (draw a line to shield a dog from bees, ~38M plays) now that BYC has a dog and a bee chapter. The decisions differ — Milo must walk out alive, not sit out a timer, and the game spans air, balloons, TNT and brittle floors — but lead the listing's thumbnail and first frame with what no bee game has. Confirm with the Partner Manager; re-read the live page before submitting |
| HUMAN | Accessibility tags declared (added 24 Aug 2026) | Set in the portal at submission. Facts for them: no information carried by audio alone (it plays muted), one-finger play, no time pressure while drawing (the world is frozen), reduced motion honoured. Re-read the live page for the tag list before submitting |

## 7. Packaging & submission

| | Requirement | Evidence |
|---|---|---|
| PASS | Self-contained HTML5 ZIP | `dist/byc-playables.zip`: `index.html` at the root, nothing else; conformance checks it |
| HUMAN | Channel onboarded to Playables | access pending (interest form submitted) |
| HUMAN | Partner Manager contact | pending access |
| HUMAN | Portal "Verify and test" + the SDK Test Suite | pending access |
| HUMAN | One rejection round budgeted | 2–7 business days testing → release |

## Known rejection causes — designed against from the first commit

Google names these as the common reasons a Playable is sent back: text
rendering on high-density screens (§3: legible at 1x/2x/3x), crashes on
specific devices (§2: needs real devices), pause/resume lifecycle failures
(§1: `onPause` halts everything), and initial load size (§2: 53 KB gzipped).

## Sources

Re-verify against Google's live documentation before submitting: requirements
change, and the live pages are the final authority.

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
