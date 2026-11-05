# Covers for the Playgama form (text-free)

Made 5 Nov 2026 from the game's OWN renderer, not drawn separately: `generator/cover.html` imports `js/sim.js`, `js/levels.js` (level A1) and `js/render/world.js`, steps the real sim to 700 ms (the boulder is about to land), forces Milo's `danger` to 0.95 so his real face shows full fright, and draws a half-finished pencil line between the boulder and Milo with the game's own live-stroke renderer. No lettering, no logo, no platform mark.

| File | Size (Playgama cover slot) |
|---|---|
| `byc-cover-square-800x800.png` | square 800x800 |
| `byc-cover-portrait-1080x1920.png` | portrait 1080x1920 |
| `byc-cover-landscape-1920x1080.png` | landscape 1920x1080 |
| `alt/*-noline.png` | same frames without the half-drawn line |

Subject sits in the middle ~70% of every frame: the YouTube hub tile is 194x272 (about 5:7) and crops a square to its middle 71% (docs/research/most-played/tile-census.md).

Rebuild: `python generator/cover-server.py <repo root>` (binds 127.0.0.1:8102), open http://127.0.0.1:8102/ in Chrome and run `window.saveCover(name, {w, h, ms: 700, zoom, line})` from the console; PNGs land in `generator/out/`. The server is a scratch tool, not part of the game.

Honest limit: the look follows the draw-genre convention (a scared character under a visible threat). No data says it earns clicks; the red-team found near-identical tiles far lower in plays (docs/research/most-played/red-team.md section 3).
