# NEXT: where the research stopped (paused 2026-11-04, resume next session)

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
