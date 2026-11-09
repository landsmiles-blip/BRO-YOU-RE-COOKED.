# Brief for every research helper (thumbnail + store-page study), 9 Nov 2026

## Why this exists
The game: "BRO, YOU'RE COOKED." (BYC), a draw-one-line physics rescue puzzle (a stick figure, Milo, walks toward a falling boulder; the player draws a line to save him). It goes first to the Playgama Sandbox (real players, private draft) and later to YouTube Playables. The owner's goal: more and more people playing it. Their words: thumbnails and descriptions "play a very big role on the traffic to the game"; the covers made so far were "sloop". They want to LEARN why top games and top YouTubers package the way they do, not a list of tile descriptions, and they want the masters studied (the studio Supersonic, publisher of "Tall Man Run", the #1 tile on the YouTube Playables hub; MrBeast and other YouTubers).
Where BYC's cover will be seen: Playgama catalog cards (mostly LANDSCAPE 16:9 images, 448x252 served, boxes ~221x148 to 450x277; some vertical 500x820 and square 218x218 tiles), the YouTube Playables hub (PORTRAIT tiles, 194x272 CSS px, about 5:7, a square image is cropped to its middle 71%).

## Evidence rules (the repo's own, non-negotiable)
- Tag every claim: [MEASURED: how, when] (you computed or observed it yourself this session), [REPORTED: source] (a source you read says so), [INFERRED] (your reasoning), UNPROVEN/UNVERIFIED. Never put quotation marks around words you did not read this session. Quote at most one short phrase (under 15 words) per source; paraphrase the rest.
- No claim of cause. No click-through data exists outside the platforms; correlation in a hand-made sample is not proof. State confounds (publisher size, time on platform, distribution, personalisation) wherever you compare plays.
- Report counts exactly (n of N). If a number is an estimate, say so. If a tool failed or a page would not load, say that, do not fill the gap.
- Look at the actual images (the Read tool shows images). Do not describe a tile you did not look at.

## Hard limits
- READ-ONLY on the outside world: do not call any Playgama developer-cabinet write tool (create_application, update_application_form, start/confirm cover or archive upload, publish_sandbox, start_sandbox_traffic, send_playgama_catalog_update, apply_referral_code), do not post, upload, sign in, buy or accept anything. Do not spend vidIQ credits (vidiq_get_images costs 0 and is allowed; any tool that costs credits is not). Be polite to websites: slow requests (about one per second), a plain research User-Agent, no scraping behind logins.
- Do NOT edit any repo file except the single output file named in your task. Do not run git commit or git push. Do not touch `tools/`, `js/`, `docs/DECISIONS.md` or any level.
- Do not copy a person's face, brand or specific thumbnail into anything BYC will use; you are studying principles, not collecting art to reuse.
- Chrome is shared by several helpers and the owner: prefer WebSearch, WebFetch and curl. If you must use the Chrome tools, open your own new tab, never reuse another tab, close it when done, and avoid anything that triggers dialogs.

## Paths
- Repo: `C:\Users\BDE\Desktop\Logic-Misfit\byc-clone` (Git Bash style `/c/Users/BDE/Desktop/Logic-Misfit/byc-clone`). Study folder: `docs/research/most-played/thumbnails/` (call it THUMBS). Earlier research to build on and NOT repeat: `docs/research/most-played/tile-census.md` (55 hub tiles hand-coded), `mrbeast-case-study.md` (44 MrBeast thumbnails), `packaging-experiments.md`, `REPORT.md`, `red-team.md`.
- YouTube hub snapshot (1,124 tiles, 5 Nov 2026): `docs/research/data/hub-snapshot-20261105-0701Z.csv` (columns dom_rank, game_id, title, plays_text, plays_int, thumb_url, thumb_nat_w/h, tile_w/h). Tile images being downloaded to `THUMBS/img-youtube/NNNN.jpg` (NNNN = CSV row order, 1-based); Playgama tiles to `THUMBS/img-playgama/<slug>.jpg`; Playgama crawl lists in `THUMBS/data/playgama-lists-20261106.json`. Downloads may still be running when you start; check the file counts (expected: 1,124 and about 290) before relying on them.
- Python with Pillow and numpy: `C:\Users\BDE\AppData\Local\Temp\claude\151dc1432df872d4\f93359a5-ec63-4162-a799-ed0f23e209bc\scratchpad\venv\Scripts\python.exe` (run it with -I). Feature script: `THUMBS/scripts/features.py` (saturation, brightness, strongly-saturated share, contrast, edge density, pale-paper share, centre-vs-border difference).
- Scratch space for your own downloads: create `THUMBS/work/<your-agent-name>/` (git-ignored locally).

## What a finished report looks like
One markdown file at the path in your task. Start with a 10-line summary of what you FOUND (not what you did), each finding tagged. Then evidence tables, then "what this means for a BYC cover / store page" (separately labelled INFERRED), then limits and what you could not check. Final chat message: at most 250 words, naming the output file, the 5 most important findings and anything that needs the owner's decision.
