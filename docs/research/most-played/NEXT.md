# NEXT: where the research stopped (paused 2026-11-04, resume next session)

## STATE, 5 NOV EVENING (newest; supersedes the blocks below where they differ)
BYC IS UPLOAD-READY EXCEPT FOR THE OWNER'S GATED STEPS. Branch `prelaunch/playgama-compliance`, pushed to origin (no tags; `main` still c9a273a = v1.0.1).
Done and committed: layout fills at every ratio (8465edb); covers built from the game's own renderer, 3 sizes + alternates (`docs/launch/covers/`, ae43748); recorded CC0 sound + loop for the Playgama build only, D15 (96a97b8; 0 oscillators, mute/pause verified in Chrome); `performance_sample` (4257799); Esc off on Playgama (rule 1.5.2); checklist `docs/launch/PLAYGAMA-CHECKLIST.md`. `npm test` exit 0, all gates PASS, final run after the last change.
Zips: `dist/byc-playgama.zip` (493,269 B), `byc-playables.zip` (96,790 B), `byc-web.zip` (96,794 B), built with the scratchpad Windows copy of `tools/build.js` (`make-build-win.py` -> `build-win.mjs`, `pack.py`; build output dir via BYC_OUT). Only the Playgama page carries the audio bank (YouTube/web 279 KB, no audio data).
NEXT, each asked first: (1) `create_application` for BYC; (2) fill the form (title "BRO, YOU'RE COOKED.", English only, all orientations, category: read `get_game_categories`); (3) upload the 3 covers (square/portrait/landscape; `start_cover_upload` -> PUT -> `confirm_cover_upload`); (4) read `get_archive_qa_tool_link`, re-read `get_game_checklist`; (5) `start_archive_upload` with `dist/byc-playgama.zip`; (6) `publish_sandbox`; (7) owner reads the real Sandbox targets off the console card; (8) the free traffic boost (3 runs left) ONLY on an explicit yes after the build is live.
Open risks (stated in the checklist): nobody has listened to the audio choices; Firefox/Safari/Edge not exercised; 1.6.7 text size not checked; audio is base64 in index.html (not separate files); the game ran at ~1 fps in an automated Chrome tab (cause UNVERIFIED, looks like tab throttling); the `performance_sample` events from Sandbox players will show real frame rates.
Housekeeping: untracked files that must stay out: `decision_log.md`, `Code_Generated_Image.png`, `youtube_playables_forensic_analysis_2026.md`. Scratch servers are stopped. PyAV/numpy live only in the scratchpad venv.

## STATE AT END OF 2026-11-05 (research; earlier block)
RESEARCH IS DONE AND WRITTEN: `REPORT.md`, `translation-to-byc.md`, `CHALLENGE-ME.md`, `sources.md`, `red-team.md` (33 claims: 17 confirmed, 10 weakened, 2 refuted, 4 cannot check). Commit on `prelaunch/playgama-compliance`, NOT pushed. Gemini cannot see it until the owner says push.
vidIQ credits: 60 left. Only one thing in the study is still open: a second hub snapshot (needs ~1 week gap; rerun `data/scrape-hub.js` exactly) to get plays/day.
NEXT WORK, in order (each gated as stated in `translation-to-byc.md`):
1. Layout fill (Playgama 1.6.1/1.6.8): paint the paper pattern across the whole canvas, keep the 9:16 playfield; check in Chrome at 9:16, 1:1, 16:9, 21:9; `npm test`. No level or `tools/` change.
2. Covers: 800x800, 1080x1920, 1920x1080, text-free, subject in the middle 70% (hub tile is 5:7). Ask before uploading.
3. Sound: owner must decide D5 (see D14 in DECISIONS.md); Kenney packs are in C:/Users/BDE/Downloads; still need a CC0 loop; Playgama-only build step needs `tools/build.js` (ask).
4. Rebuild zips (recreate scratchpad `make-build-win.py` + `pack.py` if the scratchpad is gone; build output must go to a scratch dir, then copy to `dist/`), verify names, `npm test` with exact output.
5. Playgama draft for BYC: read `get_archive_qa_tool_link` (certification) first; ask before each create/update/upload/publish; the free traffic boost (3 runs left) only on an explicit yes and after the build is live.
6. Real-phone test of the first level at low frame rates (loop caps catch-up at 8 steps/frame; red-team.md 2i). Needs the owner's phone.
7. Push/tag only on the owner's explicit yes.

UPDATE 2026-11-05 (later, read after the block below): Agents E, F, G finished (distribution.md, packaging-experiments.md, tile-census.md, first-minute-measured.md, data/hub-snapshot-20261105-0701Z.csv, data/scrape-hub.js). Agent H is collecting the TubeGames tracker (added dates) into data/tracker-*.csv + tracker-method.md. vidIQ balance now 70.
- CORRECTION to the velocity plan: the hub rounds plays to 100K (1M-10M) and 1M (>10M) [CALC from the snapshot: 475 of 1,124 games], so a 6-24 h difference shows nothing for them. Hub snapshot 2 needs a gap of about a week; use the tracker's added dates for age-adjusted plays/day instead.
- Sound packs: downloaded through Chrome (user said YES) to C:/Users/BDE/Downloads/kenney_impact-sounds.zip (800,850 B, 130 OGG) and kenney_interface-sounds.zip (834,536 B, 100 OGG). Both License.txt say CC0 [read 5 Nov]. NOT in the repo yet; nothing wired. Kenney has no music loop: a CC0 loop (OpenGameArt) is still to be found and each file's licence checked.
- Poof Poof sandbox (read-only): ACTIVE since 25 Oct; free traffic: 3 runs remain, each 3 days, ~50 expected gameplays; form step blocked by NO_CERTIFICATION (QA tool link). The "100 plays at 5 min" Sandbox target is not public: UNVERIFIED, read it from the console card.
- Needs a decision (propose, do not do): BYC draws a fixed 9:16 column; at 1:1 art fills 56% and at 16:9 32%, with flat grey bars that also accept input [first-minute-measured.md]. Playgama rule 1.6.8 (fetched 4 Nov) wants a square window filled with no empty bars. Hub tiles are 194x272 CSS px (~5:7): keep the subject inside the central ~70% [tile-census.md].

## UPDATE 2026-11-05 (read this first; the 4 Nov text below is history)
Audit result: files intact; vidIQ balance was 85 (not ~100); `dist/*.zip` stale; scratchpad helpers lost and recreated (`make-build-win.py` -> `build-win.mjs`, `pack.py`; build output goes to `<scratchpad>/out`, not `dist/`).
Decisions (owner delegated): D-A keep my 20 added assertions in `tools/test/playgama.js` (rule breach disclosed; log in DECISIONS.md); D-B research time-boxed today, prep in parallel.
Done today: commit f56c4c9 (Playgama sound starts MUTED until the Bridge answers, Required step 5); zips rebuilt in scratchpad `out/` with compliance code (playables 95,894 / web 95,902 / playgama 96,070 bytes; `index.html` at root, no slashes); platform gates PASS (playgama, ads, save).
Launched agents: G (the ONLY Chrome user: hub snapshot 1 -> `docs/research/data/`, tile census, first-minute, BYC at 16:9/1:1/9:16), E (distribution mechanics -> `distribution.md`), F (vidIQ before/after packaging, cap 15 credits -> `packaging-experiments.md`). Snapshot 2 of the hub is due >= 6 h after snapshot 1 (run `docs/research/data/scrape-hub.js` the same way, then difference for plays/day). Red team (D) runs LAST.
Facts found: Playgama cover slots are exact: square 800x800, portrait 1080x1920, landscape 1920x1080, PNG/JPEG <= 10 MB, uploaded via `start_cover_upload` -> HTTP PUT -> `confirm_cover_upload` (ask the user before uploading). Kenney.nl returns 403 to curl: download the CC0 packs through Chrome (user said YES) after Agent G is done.
OPEN DECISION for the owner (AGENTS.md: reversing a decision is theirs): DECISIONS.md D5 (LOCKED: synthesised, collision-driven sound, no music) and D5a conflict with Playgama rule 3.3.2/3.3.1 (recorded sound + music required). Proposed 1:3:1: keep D5 for YouTube and the web build; for the Playgama build only, play recorded CC0 samples chosen by the same `normalSpeed` thresholds plus a recorded loop. Needs a build step that embeds samples ONLY in the Playgama flavour, which means touching `tools/build.js`: ask the owner before doing that.
Also pending docs: `docs/PLAYGAMA.md` line 26 still says ads on Playgama are off (now ON between levels, platform-paced); add a DECISIONS entry.

Branch: `prelaunch/playgama-compliance` (local only; nothing pushed, nothing uploaded to Playgama).
Plan file: `C:\Users\BDE\.claude\plans\pasted-content-id-8310-read-claude-md-playful-hamming.md`

## Done
- Playgama compliance code (commit 1e4f2e6): Bridge storage, pause/audio events, platform-paced interstitials, watch-to-earn rewarded skip. `npm test` all green.
- Research agents A, B, C finished and wrote their files in this folder:
  - `mrbeast-case-study.md` (Agent A: channels, thumbnails, titles, series, persona)
  - `mrbeast-structure.md` (Agent B: second-by-second structure of 7 items)
  - `playables-autopsy.md` (Agent C: live hub, 1,091 tiles scraped 4 Nov 2026, 14 games opened)
- vidIQ credits: started 145, A spent 10, B spent 35 -> about 100 left. D was capped at 20 but was stopped before it finished (spend unknown, check `vidiq_balance`).

## NOT done (resume here, in this order)
1. **Agent D, the red team, was stopped before writing `red-team.md`.** Re-run it. Brief: read the three files, re-check the ~20 most load-bearing claims against primary sources, verdict each CONFIRMED / WEAKENED / REFUTED / CANNOT CHECK. Must stress-test: (a) Agent C's "draw/rescue titles ~3x over-represented at the top" (8 of top 50 vs 51 of 1,091), since keyword matching and game AGE both confound it; (b) Agent A's counts (30/30 thumbnails with a face, 25/30 titles with a number, 17/30 with a dollar amount); (c) Agent B's timestamps (spot-check 3); (d) every leaked-handbook claim is second-hand, do not fetch leaked-file mirrors; (e) survivorship bias, find 3 copycat failures or say none found; (f) alternative explanation: rank = publisher size + platform featuring + age, not design.
2. **Fill Agent C's gaps** (it was thinner than briefed): first minute of the top-4 games and Thief Puzzle never loaded; no fail/retry timing for mid-table games; ad timing for non-Premium players unknown; BYC's built page (`dist/web/index.html`) was never run in the comparison.
3. **Synthesis by me:** write `REPORT.md`, `translation-to-byc.md` (principle -> game equivalent -> transfers yes/partly/no -> action), `sources.md`, `CHALLENGE-ME.md` (claims for Gemini to attack first). Grade every claim MEASURED / REPORTED / INFERRED / UNPROVEN.
4. Then the queue from the plan: apply cheap findings to BYC -> text-free thumbnails (16:9, 1:1, 9:16, no logos) -> sound (Kenney Impact + Interface Sounds CC0 and a CC0 music loop via Chrome, user already said YES; show file list + licences before wiring; Playgama rule 3.3.2 forbids code-made sound) -> Playgama BYC draft (ask before each create/update/upload/publish) -> push/tag only on the user's explicit yes.

## Findings so far (provisional until D has run)
- Playables hub shows a play count on every tile. Top: Tall Man Run 112M, Build a Queen 107M, Snake Clash 104M, Going Balls 102M, Stealth Master 99M, Dessert DIY 95M, Thief Puzzle 95M. Median ~988K. Draw/rescue titles span #7 to #453, so the label alone buys nothing. Cumulative plays mostly encode age.
- MrBeast: every long video states the stake in ~15 s, first consequence by ~50 s, modules of 2-6 min, teasers paid off later, climax at ~82-98% of runtime. Thumbnails: all 30 recent have a face, 11 have 0-2 words, titles ~7 words, number in 25/30. Retention data is private: click and session claims are INFERRED.
- BYC gaps (inferred): title names no subject while top titles are literal; no visible attempt clock; no reward/streak hook in the first minute; levels 1-5 share one backyard look.

## Housekeeping
- Do not commit: `decision_log.md`, `Code_Generated_Image.png`, `youtube_playables_forensic_analysis_2026.md`.
- Playgama account has only "Poof Poof" (DRAFT). BYC entry not created.
- Playgama MCP server is `playgama-developer-cabinet` (user scope); ask-guards for create/update/upload/publish are in settings.
- Gemini needs the repo pushed to see this folder: ask the user first.
