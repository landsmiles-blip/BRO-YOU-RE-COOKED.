# Plan (6 Nov 2026): redo the BYC covers properly, starting with real thumbnail research

## Context
The owner watched a screen recording of the BYC draft on Playgama (`...\Recordings\20261106-0900-58.1701708.mp4`) and is disappointed: the cover art looks weak, the draft shows no description, and the layout/crop looks wrong. They want thumbnails treated as a first-class traffic driver, the research redone (hub game tiles first, MrBeast second), and a plan before any more action. They answered: research focus = **game tiles first, MrBeast second**; problems = **cover art, empty description/page, crop/layout**.

State now (verified): draft `cmw4qnmru02lzn10hszv36dy1` exists, private, status DRAFT; my "pop" covers (confirmed 6 Nov, commit `a977334`, local only) are in all three slots; no zip, no description yet; the `form` step is BLOCKED (`NO_CERTIFICATION`) until the archive passes Playgama's QA, which is why the page is empty. Nothing is public. Covers can be replaced at any time (a confirmed upload replaces the slot).

## What went wrong (to say plainly, once)
1. I made and uploaded the covers in one pass and called them stronger on my own eyes; the owner saw them first on Playgama. No review gate, no side-by-side with real tiles.
2. I applied three MrBeast traits (big face, saturated background, no text) without a brief built from evidence, and ignored my own census: 65-73% of hub tiles carry the game's name as lettering, the top tiles are mostly 3D-rendered, and BYC's tile sits in a 194x272 portrait grid, not a 16:9 video feed (`docs/research/most-played/tile-census.md`).
3. Visible craft faults: Milo's body cropped, the blue line floats, grid still showing through, right half of the landscape empty.
4. The Manus file the owner gave is NOT a thumbnail study. Its section 6 says not to transfer MrBeast's thumbnail grammar (host face, outlined type, saturated spectacle) and it makes no thumbnail measurements. What transfers from it: one proposition understood instantly, visible state/stakes, a payoff that matches the promise.
5. Hard rules I must keep: Playgama 4.2.3-4.2.5 (no one else's brand, no pretending, no unrelated brands to attract an audience) means no MrBeast face/name/branding; 4.3.1 + its footnote (AI-made visuals perform worse) means the cover art comes from the game's own renderer, not generated images; YouTube design rule: no studio/platform logos in thumbnails.

## Phase 0 - see what the owner saw (read-only, first)
- Extract frames from the recording into the scratchpad (Playwright's bundled ffmpeg is at `%LOCALAPPDATA%\ms-playwright\ffmpeg-1011`) and read them; screenshot the console draft page in Chrome; `get_application` to list which form fields are empty.
- Output: a one-paragraph list of exactly what is wrong on screen.

## Phase 1 - the thumbnail study (new file set `docs/research/most-played/thumbnails/`)
Evidence grades as in the repo: MEASURED / REPORTED / INFERRED / UNPROVEN. No claim of cause; no CTR data exists outside the platforms.
1. **Playgama catalog first** (BYC lands there first): Chrome on playgama.com. Top ~40 by popularity plus the puzzle/draw category: tile shape, which cover slot shows (square icon vs vertical preview), lettering, face/threat/colour, and what the card prints around it (title, tags, description). Record the card's real pixel size.
2. **YouTube Playables hub**: reuse the 1,124-row snapshot (`docs/research/data/hub-snapshot-20261105-0701Z.csv`, `scrape-hub.js`). Download all tile images and compute OBJECTIVE features in Python (a scratchpad venv with Pillow/numpy; nothing committed from it): mean saturation, contrast, edge density (busyness), dominant hue, share of the tile occupied by the main subject. Compare top-100 vs the rest vs draw/rescue peers, with the stated confound (earlier finding: plays track publisher, time on platform, distribution, not look). Extend the 55-tile hand census to ~120 tiles with the same rubric, a second pass done blind to rank.
3. **The "why" for the draw games that rank high** (Thief Puzzle, DOP 2/4, Save The Pets, Draw Climber, Happy Glass): set tile beside the game's first screen and title. What does the tile promise, what does the game show, what is the one thing the eye lands on at 194x272.
4. **Grid-context test** (the practical one): paste candidate tiles into a real hub row and Playgama card row at true size and judge at arm's length: does it stand out or look cheap next to its neighbours.
5. **MrBeast second**: reuse the 44 measured thumbnails (`mrbeast-case-study.md` 3.3, vidIQ `get_images` is 0 credits; 60 credits left), add a small-size legibility pass on ~20 recent ones, and add the REPORTED guidance (his thumbnail lead's talk: legible small, one idea, promise delivered quickly). Split the result into **transfers to a game tile** vs **does not transfer / not allowed**.
6. Deliverable: `thumbnails/REPORT.md` (findings, table, limits) and a one-page **design brief** with rules a cover must meet (subject, expression, stakes, colour, lettering yes/no with the evidence, safe zone), plus what is UNVERIFIED.
Optional, needs the owner's OK: one sub-agent as an independent blind rater of the tile rubric (reduces my own bias).

## Phase 2 - concepts and production (only after Phase 1)
- 4 distinct concepts, built from the game's own art (examples to test against the brief: the scream + boulder; the rescue moment with the line holding and the line anchored to real ledges; a lettered-title version if the evidence supports it; a "before/after" split). Make the faults above impossible: full Milo in frame, line visibly anchored, no grid noise, no empty half, key content inside the central 71% (square) and the 5:7 crop (portrait).
- Reuse: `docs/launch/covers/generator/cover.html` (`renderCover`, options `scale/dx/dy/grade`), `cover-server.py`, the game's `drawScene`; extend it with transparent-background export so Milo/boulder/line can be composed over a designed backdrop, an outline "sticker" edge, and optional ledges. No generated imagery.
- Export all sizes (square 800x800, portrait 1080x1920, landscape 1920x1080), verify dimensions and bytes.

## Phase 3 - review gate (nothing is uploaded before this)
- One contact sheet showing each concept at 100% and at real tile size inside a mock hub row, saved in the repo and opened in the owner's Chrome. The owner picks one (or says redo). Only then: `start_cover_upload` -> PUT -> `confirm_cover_upload` for the chosen set, each asked first.
- Keep the runner-up set: the free traffic boost has 3 runs left, so the cover must be chosen BEFORE the boost; swapping a cover afterwards is possible but its effect cannot be isolated (UNVERIFIED that Playgama offers any cover A/B).

## Phase 4 - the empty page
- Explain to the owner why it is empty: the form (description, tags, languages, category) is BLOCKED until the zip passes QA.
- Draft the store text now from `docs/launch/STORE_PAGE.md` (title must match the game exactly, rule 3.5.1; no unverified claims; no brands), so it is ready to paste the moment the form unlocks.
- Then, each asked separately: re-read `get_game_checklist`, `start_archive_upload` / `confirm_archive_upload` with `dist/byc-playgama.zip` (492,072 B), `get_archive_qa_tool_link`, fill the form, `publish_sandbox`. The traffic boost stays off until the build is live and the owner says yes.

## What I will not do
Upload or replace any cover before Phase 3 approval; copy MrBeast's face, name, type or branding; use generated images; push `a977334` or anything else without a yes; start the boost.

## Verification
- Phase 0: frames read and described. Phase 1: row counts and image counts stated, feature table reproducible from a script saved in `thumbnails/`, every claim graded.
- Phase 2: exact pixel sizes and byte sizes printed; images read by me before showing.
- Phase 3: owner's pick recorded; after upload `get_application` shows the three slots with the new media ids.
- Phase 4: `get_launch_steps` after each step.
- Logged: studio D-20 (call-out, what was wrong, plan) and a game `DECISIONS.md` entry if the cover design brief changes a locked decision (none expected).
