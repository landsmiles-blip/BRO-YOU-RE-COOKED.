# Certification Checklist — YouTube Playables

**Use:** walked line by line at **M5**, before submission. Every box signed off with evidence (a test name, a measurement, a screenshot), never from memory.

**Re-verify this document against Google's live documentation immediately before use.** Platform requirements change; sources are in `EXECUTION_ROADMAP_v1.0.md` §9.

---

## 1. Integration

| ✓ | Requirement | Evidence |
|---|---|---|
| ☐ | Playables SDK is the **first script** in `index.html`, before any module import | view-source |
| ☐ | `firstFrameReady` called when the first meaningful frame paints | perf trace |
| ☐ | `gameReady` called when input is accepted, **before** deferrable warm-up | perf trace |
| ☐ | Cloud save implemented via `saveData` / `loadData` | manual save/reload |
| ☐ | Save payload is versioned; v1 payload loads in current build; unknown version degrades, never throws | version-ladder test |
| ☐ | `onPause` halts **game loop, physics, audio, input, rendering** — everything | lifecycle test |
| ☐ | `onResume` restores exactly, with **no physics catch-up** and no duplicate timers | lifecycle test |
| ☐ | **Zero external network calls** — build-time grep for `fetch`/`XMLHttpRequest`/`WebSocket`/`sendBeacon` returns clean | build log |
| ☐ | All game data ships in the initial bundle | bundle manifest |

## 2. Stability & performance

| ✓ | Requirement | Target | Evidence |
|---|---|---|---|
| ☐ | Initial bundle, page-load → `gameReady` | **< 30 MiB required · < 15 MiB recommended** (projected ≈200 KB) | measured |
| ☐ | Peak JS heap | **< 512 MB** | 200-retry soak, sampled |
| ☐ | Time to interactive | **< 5 s** (target < 1 s on throttled 4G) | cold-cache measurement |
| ☐ | No reproducible crashes on any device in the matrix | — | device pass |
| ☐ | Does not crash the YouTube app/site or other software | — | embedded test |
| ☐ | 60 fps on mid-range Android | — | profiler |
| ☐ | No leak across 200 retries | — | heap sampling |

## 3. Design

| ✓ | Requirement | Evidence |
|---|---|---|
| ☐ | Playable at **9:32** | screenshot + play |
| ☐ | Playable at **9:21** | screenshot + play |
| ☐ | Playable at **9:16** | screenshot + play |
| ☐ | Playable at **3:4** | screenshot + play |
| ☐ | Playable at **1:1** | screenshot + play |
| ☐ | Playable at **4:3** | screenshot + play |
| ☐ | Playable at **16:9** | screenshot + play |
| ☐ | Playable at **21:9** | screenshot + play |
| ☐ | Playable at **32:9** | screenshot + play |
| ☐ | Auto-adjusts on viewport change | resize test |
| ☐ | **Game state survives resize, including mid-simulation** | resize-mid-run test |
| ☐ | **Never** calls `screen.orientation.lock()` — no orientation or posture lock | source grep |
| ☐ | Fills viewport, or centres with pillarbox/letterbox | visual |
| ☐ | **Touch** input works | device test |
| ☐ | **Mouse** input works | desktop test |
| ☐ | Both work on a device that has both | hybrid test |
| ☐ | Text legible at 1× / 2× / 3× DPR — *named rejection cause* | density screenshots |
| ☐ | Graphics render clearly at all resolutions | density screenshots |
| ☐ | Small-embed case (320 × 480 css px) legible and drawable | screenshot |

## 4. Monetization

| ✓ | Requirement | Evidence |
|---|---|---|
| ☐ | `requestRewardedAd(id)` fires **only** on explicit player request | code review |
| ☐ | Reward IDs are unique | code review |
| ☐ | Reward IDs contain **no user data** — readable string or UUID | code review |
| ☐ | No ad interrupts before meaningful player investment | flow review |

## 5. Privacy & data

| ✓ | Requirement | Evidence |
|---|---|---|
| ☐ | No external analytics of any kind (GA, GameAnalytics, or otherwise) | build grep |
| ☐ | No user data transmitted anywhere | build grep |
| ☐ | No user data embedded in reward IDs | code review |

## 6. Trust & safety / content

| ✓ | Requirement | Evidence |
|---|---|---|
| ☐ | Complies with YouTube Community Guidelines | content review |
| ☐ | Suitable for general audience **13+** | content review |
| ☐ | **Not** "made for kids" and not designed exclusively for children | content review |
| ☐ | No third-party IP, no recognisable protected characters, no borrowed logos | asset audit |
| ☐ | No copyrighted music or SFX (all synthesised) | asset audit |
| ☐ | Title cleared — trademark/collision search complete | clearance record |
| ☐ | Art is original; nothing reads as obvious AI-generated asset production | asset audit |

## 7. Packaging & submission

| ✓ | Requirement | Evidence |
|---|---|---|
| ☐ | Self-contained HTML5, all assets bundled in the ZIP | archive |
| ☐ | Channel has channel-manager permission and is onboarded to Playables | portal |
| ☐ | Partner Manager contact established | correspondence |
| ☐ | Portal "Verify and test" flow completed | portal |
| ☐ | **One rejection round budgeted** — expect ~2–7 business days testing → release | schedule |

---

**Sign-off:** M5 does not exit and submission does not happen until every box above is ticked with evidence attached.
