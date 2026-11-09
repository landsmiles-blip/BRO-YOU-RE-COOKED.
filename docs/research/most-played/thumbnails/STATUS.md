# Thumbnail study: STATUS

## UPDATE 9 Nov 2026 (newest; the 6 Nov text below is history)
Phase A and B are DONE and committed: three verified helper reports (`agents/`), `REPORT.md`, `DESIGN-BRIEF.md`, `PACKAGING-PLAYBOOK.md`. Phase C is at the review gate: twelve candidate covers and a contact sheet in `docs/launch/covers/candidates-20261109/` (`CANDIDATES.md` has the hard verdicts), built by `docs/launch/covers/generator/compose.html`. The owner picked C3 on 9 Nov and the three C3 covers were uploaded and confirmed into the draft's slots (replacing the 6 Nov set). Phase D evidence: `docs/launch/crossbrowser/` (Chromium, Firefox, WebKit clean; Playgama's QA tool ticked all 4 mandatory SDK items). Still to do: the owner's pick, then upload (asked first); the Playgama description/how-to-play text (drafts in `agents/a3-youtubers-descriptions.md`) and category Puzzle; the zip upload (asked first); distribution choice re-confirmed when the form shows the partner list.

**9 Nov, later:** with the owner's go-ahead the zip `byc-1.0.2-playgama` (492,072 B, archive `cmw8qitr520q9mt0hm3r40acu`) was uploaded and PASSED Playgama's build check (Bridge 2.4.1 found, load 307 ms); form saved: description and how-to-play (variant A, no 'free' and no sound claim), category puzzle, devices desktop + iOS + Android, both orientations, English; distribution fields untouched (owner's earlier answer was ambiguous). The `sandbox` step is now TODO (`publish_sandbox` needs the owner's explicit yes). `story` is still empty: it must be real facts from the developer, a draft is awaiting the owner's approval. The `form` step for the tool still says NO_CERTIFICATION (a human play-through in Playgama's QA tool) but the form saved anyway.

## (history) Paused 6 Nov 2026, ~16:30 +07 by the owner's request, to move to another computer

Approved plan: `PLAN.md` in this folder (phases 0-4). Phase 0 is done, Phase 1 was started, nothing after that. NOTHING new has been uploaded to Playgama since the covers described below.

## What happened (so a new session does not have to guess)
- 6 Nov: after the Gemini audit, the owner's four asks were done (Node zip packer, duplicates archived, one decision log, `main` fast-forwarded and tagged `v1.0.2` at `86cbee8`). Then BYC draft created on Playgama: id `cmw4qnmru02lzn10hszv36dy1`, status DRAFT, English, engine js.
- I uploaded the 3 covers (first the paper set, never confirmed; then the "pop" set: sky-blue background, big Milo scream, red boulder, blue line, no text; confirmed into the square/portrait/landscape slots). Commit `a977334` has them in `docs/launch/covers/`; the paper set is in `docs/launch/covers/alt/`.
- The owner watched a recording of the console form and was disappointed: cover art weak, description/how-to-play empty, layout/crop wrong. They asked for the thumbnail research to be redone properly: game tiles first (YouTube Playables hub + Playgama catalog), MrBeast second. The Manus file they supplied (`MrBeast Operating-System Case Study v0.2`) is a video-structure study; its section 6 says not to transfer MrBeast's thumbnail grammar, and it has no thumbnail measurements.
- My own faults, stated plainly: covers made and uploaded in one pass with no review gate; MrBeast traits applied without an evidence-based brief; my own tile census (`../tile-census.md`: 65-73% of hub tiles carry lettering, top tiles mostly 3D renders, 194x272 portrait tile) was ignored; visible craft faults (Milo's body cropped, floating line, grid noise, empty half in the landscape).

## Phase 0 result: what the recording shows (4 frames read, 15 s long, 1920x1032)
- The console form (developer.playgama.com/applications/<id>) is editable in the UI: Title "BRO, YOU'RE COOKED.", engine Plain JS, agent Claude Code / claude-sonnet-5-5, **Game description empty** (placeholder text only), **How to play empty**, category not chosen ("Sandbox targets depend on it"), Game Archive empty, devices and orientation unticked, languages English, Save Changes / Continue greyed out.
- Cover Images section: all three slots filled with the pop set. At thumbnail size in the console the square crop cuts Milo's body, and the portrait shows a strip of ground at the bottom.
- So "no description" is partly mine: the MCP `update_application_form` is blocked until the archive passes QA (`NO_CERTIFICATION`), but the owner can type it into the console form. The store text is drafted in `docs/launch/STORE_PAGE.md`; a Playgama-specific version (description, how to play, category choice) has NOT been written yet.

## Phase 1 so far (started, not analysed)
- Playgama catalog structure, MEASURED from the live pages: listing pages are server-rendered HTML with `?page=N` (6 pages x 45 cap on trending/puzzle/new, 62 on top_playgama). Tiles on the home page and category pages are mostly LANDSCAPE `preview` images (448x252 served; tile boxes 221x148 to 450x277), with a few portrait 500x820 tiles (259x454) and square `icon` tiles (218x218 served, 123x123 box). Most tiles carry the game's name inside the art. One glance at the home screenshot: saturated 3D/illustrated art, characters or vehicles, the title in big lettering. That is an impression from one screenshot, NOT coded data.
- Lists crawled (`data/playgama-lists-20261106.json`: top_playgama 62, trending_now 270, puzzle 270, new 270 tiles with rank, slug, title, image path, badge such as hot/top).
- Image downloads were interrupted (scratch only, not committed): about 170 Playgama tiles and 373 of 1,124 YouTube hub tiles. Re-run `scripts/playgama_download.py` and `scripts/youtube_download.py` from this folder.
- `scripts/features.py` computes saturation, brightness, share of strongly saturated pixels, contrast, edge density, share of pale "paper" pixels, centre-vs-border difference for any image; it has NOT been run on the tiles or on BYC's covers yet.
- Not started: hand-coded rubric over ~120 tiles (blind second pass), the "why" pass on Thief Puzzle / DOP / Save The Pets / Draw Climber / Happy Glass, the grid-context mock-up, the MrBeast small-size pass, REPORT.md and the design brief.

## Where to resume
1. Read `PLAN.md`. 2. Re-run the two download scripts, run `features.py`, hand-code the tiles. 3. Write `REPORT.md` + design brief. 4. Build 4 concepts, show the owner a contact sheet on a mock grid BEFORE any upload. 5. Only then replace covers, and ask before every Playgama call.
Limits to keep stating: no CTR data exists outside the platforms; Playgama and YouTube plays track publisher, time on platform and distribution more than look (`../REPORT.md`, `../red-team.md`).

## Rules that still bind
Playgama 4.2.3-4.2.5 (no one else's brand: no MrBeast face, name or branding), 4.3.1 (AI-made visuals perform worse: build the art from the game's own renderer); YouTube: no studio/platform logos in thumbnails; ask before create/update/upload/publish/boost calls; the free traffic boost (3 runs left) only after the build is live and only on an explicit yes.
