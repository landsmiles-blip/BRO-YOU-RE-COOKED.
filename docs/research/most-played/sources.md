# Sources index (5 Nov 2026)

Each agent file ends with its own full source list (URL, date fetched, grade). This is the index plus the primary documents the synthesis leans on.

## Our own data
- `docs/research/data/hub-snapshot-20261105-0701Z.csv` (1,124 hub tiles, scraped 2026-11-05T07:01:05Z) and `scrape-hub.js` (the method)
- `docs/research/data/tracker-20261105-0742Z.csv` + `most-played/tracker-method.md` (50 rows, TubeGames at playables.games; publisher/added date for 28)

## Agent reports (each has its own sources)
- `mrbeast-case-study.md` (A), `mrbeast-structure.md` (B), `playables-autopsy.md` (C, 4 Nov, partly corrected by the red team), `distribution.md` (E), `packaging-experiments.md` (F), `tile-census.md` and `first-minute-measured.md` (G), `tracker-method.md` (H), `red-team.md` (D)

## Primary documents used directly
- Playgama requirements, read raw via the MCP `get_game_checklist` on 4 and 5 Nov: technical (1.2.5, 1.6.1, 1.6.8, 1.7), advertising (2.1-2.2), user experience (3.1-3.5), platform-specific (YouTube row, GameSnacks row) - https://wiki.playgama.com/playgama/game-requirements.md
- Playgama Bridge SDK Required steps, storage, platform, interstitial, rewarded pages via the MCP `get_bridge_sdk_docs` (4 Nov)
- Playgama guides, read raw via `get_game_guides`: first-session and monetization/best-practices (5 Nov)
- Playgama telemetry guide v1.1.2 via `get_game_telemetry_guide` (5 Nov)
- Playgama cover slots: `start_cover_upload` tool description (800x800, 1080x1920, 1920x1080)
- Playgama account state read-only: `list_applications`, `get_launch_steps`, `get_sandbox_state`, `get_sandbox_traffic` for Poof Poof (5 Nov)
- Google Playables certification requirements and design page (via WebFetch summaries, by agents E and G): https://developers.google.com/youtube/gaming/playables/certification/requirements and .../requirements_design
- Dubit census: https://dubit.io/library/how-many-plays-does-a-youtube-playables-game-get (23 Sep 2026)
- Kenney Impact Sounds and Interface Sounds, CC0 per each pack's `License.txt` (read 5 Nov): https://kenney.nl/assets/impact-sounds , https://kenney.nl/assets/interface-sounds
- vidIQ: `vidiq_title_thumbnail_wins`, `vidiq_video_change_history`, transcripts (credits: started 145, now 60)

## Not used as evidence
- Any leaked MrBeast handbook file or mirror (not opened).
- `youtube_playables_forensic_analysis_2026.md` (Gemini's report, untracked): its claims were fact-checked on 4 Nov and none is relied on here unless re-proved above.
