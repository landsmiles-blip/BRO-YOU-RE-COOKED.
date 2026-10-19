# Free, open-source tools for building, testing, polishing and shipping "BRO, YOU'RE COOKED." (as of 2026-10-19)

**How the data was gathered (read this before trusting a number).**
- **npm data** (latest version, publish dates, licence field, maintainers, unpacked size, deprecation) comes from the npm registry documents at `https://registry.npmjs.org/<pkg>`, fetched 2026-10-18. The npm downloads API (api.npmjs.org) was blocked from this machine. **Weekly downloads** and **dependents** therefore come from the `downloads` and `dependents` fields of the registry search endpoint, `https://registry.npmjs.org/-/v1/search?text=<pkg>`.
- **GitHub stars, forks, open issues, last push, licence and archived flag** come from the GitHub search API (via the GitHub MCP tool), fetched 2026-10-18/19. The GitHub website and the per-repo REST API were blocked, so these are API values, not page scrapes. Note that `pushed_at` is the last push to any branch, not the last release.
- **Sizes are my own measurements.** For each package I downloaded its tarball from registry.npmjs.org into an isolated folder and ran `gzip -9` over the shipped file, without executing any package code. Files I could not re-minify (the esbuild install in the scratchpad failed) are marked "unminified", and their figures are upper bounds.
- **WebFetch could not resolve any external host.** Primary docs were therefore read from their GitHub source repositories through raw.githubusercontent.com: MDN, Playwright, the Chrome DevTools Protocol, Tiled, Box2D, LDtk and Rapier's changelog. Claims marked "(search summary)" come from WebSearch result summaries of pages I could not open. Treat those as medium confidence.
- **Reference points from this repo.** `dist/byc.html` is 234,187 B raw and **65,191 B gzipped**. Its main game script is 149,355 B raw and 38,974 B gzipped. The YouTube ZIP is 65,843 B. The vendored `vendor/matter.min.js` is 83,476 B raw and 25,784 B gzipped, the same byte count as the npm `matter-js@0.20.0` build. All figures were measured in this session.

**Verdict index.** Details and sources are in the sections below. The three verdicts:
- **INTEGRATE**: ships in the game bundle.
- **DEV TOOL**: used only during development; never ships.
- **SKIP**: not adopted.

| Job | Tool | Verdict | One-line reason | Conf. |
|---|---|---|---|---|
| Physics | Matter.js 0.20.0 (already vendored) | INTEGRATE (keep as is) | Already ships. Every measured number in the game rests on it. No release in 28 months, but a frozen vendored copy is not affected | High |
| Physics | Planck.js | SKIP | 2.1x Matter's gzip size. Means a full rewrite and re-measurement. It is pure JS, so it has the same Math-precision exposure | High |
| Physics | Rapier 2D deterministic (wasm) | SKIP | The wasm is 919 KB gzipped, 14x the whole game. Best determinism story, wrong size class | High |
| Physics | Box2D v3 via box2d3-wasm | SKIP (revisit only if continuous collision detection or cross-engine determinism becomes a blocker) | About 179 KB gzipped, one maintainer, 576 downloads a week. The threaded build needs COOP/COEP headers | Med |
| Physics | Phaser Box2D | SKIP | No push since April 2025, 2 npm versions ever, 69 KB gzipped | High |
| Physics | p2 / p2-es / box2d-wasm / box2d.js / @box2d/core | SKIP | Abandoned or no release in 26 to 131 months | High |
| Physics | poly-decomp | SKIP | Hollow rings for closed strokes are deliberate. Adding it changes every closed stroke's physics | High |
| Levels | Tiled | SKIP for now (DEV TOOL only if non-programmers start laying out levels) | Its object model fits, but it adds a converter and bypasses the measure-first loop | Med |
| Levels | LDtk | SKIP | Grid/tile-centric, and no release since January 2024 | Med |
| Levels | Ogmo Editor 3 | SKIP | No push in 28 months | High |
| Levels | lil-gui | DEV TOOL | 7.9 KB gzipped live-tuning panel for a debug build. Active | Med |
| Levels | Tweakpane | SKIP | lil-gui is 4x smaller. No release in 23 months | Med |
| Testing | Playwright (already used): clock API, WebKit/Firefox, CDP | DEV TOOL (extend the existing use) | Deterministic rAF stepping, cross-engine certificate replay, colour-blind filming | High |
| Testing | pixelmatch | DEV TOOL | Tiny ISC-licensed pixel diff for frozen-frame/filmstrip baselines with playwright-core | High |
| Testing | fast-check | DEV TOOL | Property tests with shrinking for engine invariants | High |
| Testing | piscina (or the built-in `node:worker_threads`) | DEV TOOL | The solver, census and bake sweeps are single-threaded. This machine has 4 cores | Med |
| Testing | odiff, BackstopJS, reg-suit, lost-pixel, looks-same | SKIP | Native binary, DOM/CI-service focus, or archived/stale. pixelmatch covers the need | High |
| Testing | seedrandom, pure-rand | SKIP | The repo already has seeded mulberry32 generators | High |
| Testing | tinypool, mitata, tinybench | SKIP | Duplicates or not needed | Med |
| Testing | PHYRE, Science Birds, Ropossum | SKIP as code; read as method | Archived, unlicensed, or paper-only | High |
| Art | perfect-freehand | INTEGRATE (trial, render-only) | About 2 KB gzipped, MIT, active. Variable-width ink for the player's stroke, with physics untouched | Med |
| Art | Rough.js | SKIP | The style already exists, and it adds 8.9 KB gzipped (+14%). No release in 35 months. Random jitter risks the "vibrating line" bug | Med |
| Art | GSAP | SKIP | Custom non-OSI "no charge" licence, 28 KB gzipped, and its own ticker | High |
| Art | anime.js, tween.js, Proton, simplex-noise, eases, simplify-js | SKIP | 4.7 to 41 KB gzipped, or stale. A few lines of hand-rolled code do the same | High |
| Art | bezier-easing | SKIP (acceptable if CSS-style curves are ever wanted) | 0.8 KB gzipped, active, but not needed | Med |
| Audio | ZzFX | SKIP (switch to ZzFXMicro, 1.9 KB gzipped, only if `js/audio.js` is ever rewritten) | The game already synthesizes its sounds, and audio cannot carry information | Med |
| Audio | jsfxr, Tone.js, Howler, ZzFXM, SoundBox, BeepBox | SKIP | Too large (Tone is 79 KB gzipped), built for sample files, stale, or GPL editor | High |
| Audio | Kenney, Freesound and Sonniss sound packs | SKIP (zero-asset design) | If ever needed, use CC0 only and never CC BY-NC | Med |
| Build | esbuild 0.28.2 (already used) | DEV TOOL (keep, pin) | Active, MIT. Add a metafile analysis | High |
| Build | terser | SKIP | Measured: only 1.7 KB gzipped saved over the shipped esbuild output | High |
| Build | Roadroller, html-minifier-terser, source-map-explorer, size-limit | SKIP | Abandoned or stale, or replaceable by a three-line `node:zlib` budget check | High |
| Build | Lighthouse (CLI) | DEV TOOL (occasional) | Audits page load only, not gameplay. The playwright-lighthouse wrapper is stale | Med |
| Build | Eruda | DEV TOOL (debug build only, bundled locally) | On-phone console. Must never ship or load from a CDN | Med |
| Build | vConsole, stats.js | SKIP | No release in 40 and 120 months. DevTools and traces cover the same ground | Med |
| i18n/a11y | Native `Intl` + a plain string table | INTEGRATE (0 bytes) | Built in. No library needed for a few dozen strings | Med |
| i18n/a11y | `prefers-reduced-motion` | INTEGRATE (0 bytes) | Standard media query. Use it to damp shake and slow-motion | Med |
| i18n/a11y | CDP vision-deficiency emulation via Playwright | DEV TOOL | Films levels as a colour-blind player sees them | High |
| i18n/a11y | rosetta, i18next, typesafe-i18n, intl-messageformat, axe-core | SKIP | Stale, too large, TypeScript-oriented, or blind to canvas content | Med |
| Templates | phaserjs/template-youtube-playables, google/web-game-samples | DEV TOOL (reference reading only) | Legitimate (Phaser Studio and Google). Use them to cross-check the SDK lifecycle in `js/platform/sdk.js` | High |
| Templates | Scirra and Defold Playables plugins | SKIP | Legitimate but tied to other engines | High |
| Templates | bubbls/youtube-playables, phexus23.github.io, kakao74/phaser, and the low-use npm "playables" packages | SKIP, red flag | Ripped games, an unexplained re-upload of Phaser, or near-zero usage | High |

---

## Physics: is there a better-maintained or more deterministic 2D engine than Matter.js (Planck.js, Rapier, Box2D v3 wasm, p2.js)? Is Matter.js itself still maintained?

### Takeaway
Matter.js is in maintenance mode: its last release was June 2024, it has one maintainer and 279 open issues, though pushes continue. Better-maintained engines exist: Rapier and Box2D v3 are very active, and Planck.js released in October 2026. Rapier's `-deterministic` builds and Box2D v3 both document cross-platform determinism. But every alternative is 2x (Planck) to 14x (Rapier's deterministic wasm) the gzip size of the whole current game. Migrating would also invalidate every measured number (breadth, tries, star thresholds, daily certificates). **Keep the vendored Matter.js 0.20.0.** The one cheap, high-value action is a dev test: replay the daily certificates in WebKit and Firefox to measure whether Matter.js actually diverges across JS engines.

### Cited Findings
**Matter.js (current engine)**
- Latest npm release 0.20.0, published 2024-06-23. That is about 28 months without a release, over the 18-month flag. Package created 2014. MIT. Single npm maintainer (`liabru`). 241,062 weekly downloads and 188 dependents — [npm registry](https://registry.npmjs.org/matter-js); [npm search](https://registry.npmjs.org/-/v1/search?text=matter-js)
- GitHub: 18,480 stars, 1,996 forks, 279 open issues, last push 2026-09-30, MIT — [GitHub liabru/matter-js](https://github.com/liabru/matter-js)
- CHANGELOG release cadence: 0.20.0 (2024-06-23), 0.19.0 (2023-02-16), 0.18.0 (2021-12-15) — [CHANGELOG.md](https://raw.githubusercontent.com/liabru/matter-js/master/CHANGELOG.md)
- Measured size of `build/matter.min.js`: 83,476 B raw and 25,784 B gzipped. The repo's vendored file is the same 83,476 B, so the game ships the 0.20.0 build — [npm tarball 0.20.0](https://registry.npmjs.org/matter-js/-/matter-js-0.20.0.tgz); repo file `vendor/matter.min.js`
- Concave decomposition is opt-in. The build's own doc comment says to "Provide the poly-decomp library module to enable concave vertex decomposition support when using `Bodies.fromVertices` e.g. `Common.setDecomp(require('poly-decomp'))`" — [matter.js build source](https://registry.npmjs.org/matter-js/-/matter-js-0.20.0.tgz) (`build/matter.js` around line 704)
- No built-in continuous collision detection (CCD). Forum reports call tunnelling one of Matter.js's oldest issues, tracked in GitHub issue #5. Substepping helps, but fast objects and thin walls remain a problem (forum posts; medium confidence) — [Tumult forum](https://forums.tumult.com/t/matter-js-constant-collision-detection-ccd-fix/23433); [html5gamedevs](https://www.html5gamedevs.com/topic/41091-matterjs-collision-breaks-at-high-speed/); [Phaser Discourse](https://phaser.discourse.group/t/sometimes-collision-detection-fails-while-using-matter-js/6165)

**Why pure-JS engines are not bit-identical across browsers**
- MDN: "Many `Math` functions have a precision that's *implementation-dependent*. This means that different browsers can give a different result. Even the same JavaScript engine on a different OS or architecture can give different results!" — [MDN Math (source)](https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/javascript/reference/global_objects/math/index.md)

**Planck.js**
- npm `planck` 1.5.1 published 2026-10-12. MIT. Maintainers `shakiba` and `zoadt`. 140,567 weekly downloads. The old `planck-js` package is deprecated: "Please use 'planck' package instead of 'planck-js'" — [npm planck](https://registry.npmjs.org/planck); [npm planck-js](https://registry.npmjs.org/planck-js)
- GitHub: 5,298 stars, 256 forks, 32 open issues, last push 2026-10-18 — [GitHub piqnt/planck.js](https://github.com/piqnt/planck.js)
- README: "Planck.js is JavaScript/TypeScript rewrite of Box2D physics engine for cross-platform HTML5 game development" — [README](https://raw.githubusercontent.com/piqnt/planck.js/master/README.md)
- Measured `dist/planck.min.js`: 297,211 B raw and 54,798 B gzipped (2.1x Matter's 25,784) — [npm planck](https://registry.npmjs.org/planck)

**Rapier (Rust compiled to wasm, with JS bindings)**
- npm `@dimforge/rapier2d` 0.21.0 published 2026-09-25, Apache-2.0. Flavours and weekly downloads: `rapier2d` 34,647; `-compat` 37,060; `-simd-compat` 112,664; `-deterministic` 3,513; `-deterministic-compat` 5,930. The `-deterministic` packages were created 2025-03-06 — [npm rapier2d](https://registry.npmjs.org/@dimforge/rapier2d); [npm rapier2d-deterministic](https://registry.npmjs.org/@dimforge/rapier2d-deterministic)
- rapier.js 0.15.0 (06 March 2025) introduced the `-deterministic` flavours. Its changelog says: "existing packages `rapier2d` and `rapier3d` are now built without `enhanced-determinism` feature enabled, so if you rely on that feature, you should migrate to the new `-deterministic` flavor" — [rapier.js CHANGELOG](https://raw.githubusercontent.com/dimforge/rapier.js/master/CHANGELOG.md)
- The JS bindings repo is archived: "This repository has been merged into the main Rapier repository: https://github.com/dimforge/rapier (into the `typescript` directory)". It had 698 stars when archived — [rapier.js README](https://raw.githubusercontent.com/dimforge/rapier.js/master/README.md); [GitHub dimforge/rapier.js](https://github.com/dimforge/rapier.js)
- Rapier's docs say the `-deterministic` JS variants are cross-platform deterministic, while the standard builds are only deterministic on one machine. They suggest checking this by hashing `world.createSnapshot()`, and warn that inputs computed with `Math.sin`/`Math.cos` can still differ between platforms (search summary; page not opened; medium confidence) — [rapier.rs determinism guide](https://rapier.rs/docs/user_guides/javascript/determinism)
- Measured `@dimforge/rapier2d-deterministic` wasm (`rapier_wasm2d_bg.wasm`): **2,436,321 B raw and 919,151 B gzipped**. The `-deterministic-compat` package unpacks to 12.2 MB, and its JS glue `dist/rapier_wasm2d.js` is 302,815 B raw and 31,091 B gzipped — [npm rapier2d-deterministic](https://registry.npmjs.org/@dimforge/rapier2d-deterministic); [npm rapier2d-deterministic-compat](https://registry.npmjs.org/@dimforge/rapier2d-deterministic-compat)

**Box2D v3 (C) and its web builds**
- erincatto/box2d: 10,424 stars, 1,824 forks, 8 open issues, last push 2026-10-18, MIT — [GitHub erincatto/box2d](https://github.com/erincatto/box2d)
- Its README lists "Continuous collision detection", "Continuous physics for fast translations and rotations", "Extensive multithreading and SIMD" and "Cross platform determinism" — [README](https://raw.githubusercontent.com/erincatto/box2d/main/README.md)
- Its docs: "Box2D is designed to be deterministic across thread counts and platforms … Cross-platform determinism is achieved on 64-bit platforms by using compiler flags and by avoiding non-deterministic library functions" — [docs/simulation.md](https://raw.githubusercontent.com/erincatto/box2d/main/docs/simulation.md)
- **box2d3-wasm** (Birch-san):
  - npm 5.2.0 (2026-02-16); the npm licence field says MIT, and the tarball contains a LICENSE file (contents not inspected). One maintainer. 576 weekly downloads, 2 dependents — [npm box2d3-wasm](https://registry.npmjs.org/box2d3-wasm)
  - GitHub: 66 stars, 11 forks, 8 issues, last push 2026-02-16. The API detected no licence at the repo root — [GitHub Birch-san/box2d3-wasm](https://github.com/Birch-san/box2d3-wasm)
  - Measured: "compat" wasm 417,253 B (153,120 gzipped) + glue 97,360 B (26,087 gzipped), about **179 KB gzipped**. "deluxe" wasm 427,805 B (156,963 gzipped) + glue 135,536 B (37,262 gzipped) — [npm box2d3-wasm](https://registry.npmjs.org/box2d3-wasm)
  - Its README (from the tarball) says threading needs `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin`, "because it uses the SharedArrayBuffer feature which requires an isolated context" — [npm box2d3-wasm](https://registry.npmjs.org/box2d3-wasm)
- **Phaser Box2D**: npm `phaser-box2d` 1.1.0 (2025-01-01), only 2 versions ever, MIT, 180 weekly downloads. GitHub: 164 stars, 22 issues, last push 2025-04-03 (18.5 months ago). Measured `PhaserBox2D.min.js`: 276,173 B raw and 69,462 B gzipped — [npm](https://registry.npmjs.org/phaser-box2d); [GitHub phaserjs/phaser-box2d](https://github.com/phaserjs/phaser-box2d)

**Older or abandoned engines**
- `p2` 0.7.1, published 2015-11-21 (about 131 months ago); the npm licence field is empty. Repo: 2,693 stars, 106 issues, last push 2022-07-09. Its LICENSE file is MIT — [npm p2](https://registry.npmjs.org/p2); [GitHub schteppe/p2.js](https://github.com/schteppe/p2.js); [LICENSE](https://raw.githubusercontent.com/schteppe/p2.js/master/LICENSE)
- `p2-es` (pmndrs fork) 1.2.3, published 2023-11-01 (35.5 months ago), MIT. Measured: unminified `dist/p2-es.js` is 302,534 B raw and 66,235 B gzipped — [npm p2-es](https://registry.npmjs.org/p2-es)
- `box2d-wasm` (Box2D v2.4) 7.0.0, published 2021-11-28 (58.6 months ago), Zlib. Repo: 306 stars, last push 2024-12-29 — [npm](https://registry.npmjs.org/box2d-wasm); [README](https://raw.githubusercontent.com/Birch-san/box2d-wasm/master/README.md)
- kripken/box2d.js: 1,382 stars, last push 2020-07-09. Its README says "box2d.js is zlib licensed, just like Box2D" — [GitHub](https://github.com/kripken/box2d.js); [README](https://raw.githubusercontent.com/kripken/box2d.js/master/README.markdown)
- `@box2d/core` (a TypeScript port of Box2D v2) 0.11.0, published 2024-08-17 (26 months ago), MIT, 1,155 weekly downloads — [npm](https://registry.npmjs.org/@box2d/core)
- `poly-decomp` 0.3.0, published 2018-07-24, MIT, 14,320 weekly downloads. Measured `decomp.min.js`: 5,609 B raw and 2,249 B gzipped. Repo: 468 stars, last push 2023-08-08 — [npm](https://registry.npmjs.org/poly-decomp); [GitHub](https://github.com/schteppe/poly-decomp.js)

**Repo context that sets the migration cost**
- The project's own rules record Matter-specific behaviour that every measurement depends on, and forbid "fixing" it without re-measuring every level:
  - static `friction` is forced to 1 and `restitution` to 0;
  - `fromVertices` returns the convex hull;
  - `MAX_SPEED` is locked at 900 to prevent tunnelling.

  Source: [repo CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md)

### Inferences
- **Is Matter.js maintained?** Releases have stopped: the last was 28 months ago, and it has one maintainer. The repo is not dead (a push on 2026-09-30), but I could not see what was pushed. The game vendors a fixed file and has tuned every level against its exact behaviour, so upstream inactivity costs almost nothing. An upgrade would be the risky act. **Verdict: INTEGRATE (keep 0.20.0, vendored, pinned). Do not upgrade or migrate. Confidence: high.**
- **Determinism, in practice.**
  - Node (the solver, census and bake) and Chromium (films and browser tests) both run V8, so they agree with each other.
  - Phones on iOS run JavaScriptCore, which MDN says may round `Math.sin`/`cos`/`atan2` differently. In a chaotic simulation, a last-bit difference can grow.
  - The game's fairness rests on breadth plus a hand-robust precision floor rather than exact replay, so a few-ULP drift probably does not flip a certified level. That is **untested**.
  - The cheap test is to run the existing certificate replays under Playwright's WebKit and Firefox engines (Playwright drives Chromium, Firefox and WebKit; see the testing section).
  - Only if that shows real divergence would a deterministic engine be worth its cost.
- **Planck.js — SKIP (high confidence).**
  - It is actively maintained, but 2.1x the gzipped size.
  - It means a rewrite of `js/physics/adapter.js` and every Matter-specific workaround, plus re-measuring every level.
  - As a pure-JS engine it has the same `Math`-precision exposure, so it buys no cross-browser determinism.
- **Rapier `-deterministic` — SKIP (high confidence).**
  - It has the strongest documented cross-platform determinism.
  - Its 919 KB gzipped wasm is about 14x the entire current game (65 KB gzipped), and wasm needs asynchronous initialisation.
  - The `-compat` flavours that inline the wasm unpack to 12 MB.
- **Box2D v3 via box2d3-wasm — SKIP now; revisit only on a concrete blocker (medium confidence).** Its real attractions:
  - continuous collision detection, which would lift the `MAX_SPEED`-at-900 lock that exists because Matter tunnels;
  - documented cross-platform determinism in C.

  Its costs:
  - about 179 KB gzipped, nearly 3x the whole game;
  - one maintainer and 576 weekly downloads;
  - the threaded "deluxe" build needs COOP/COEP isolation, which a game embedded in YouTube's iframe probably cannot rely on (unverified for Playables).

  Whether its wasm build keeps Box2D's cross-platform determinism is not documented in what I read.
- **Phaser Box2D — SKIP.** It has stalled (last push April 2025, two npm versions) and is 69 KB gzipped.
- **p2, p2-es, box2d-wasm, box2d.js, @box2d/core — SKIP.** All have gone 26 to 131 months without a release.
- **poly-decomp — SKIP (high confidence).** It would let Matter build solid concave bodies. But the game deliberately makes closed strokes hollow rings, because "a bowl must be hollow to hold anything" (CLAUDE.md). Turning on decomposition would change the physics of every closed stroke and invalidate the solver data.

### Gaps
- Star counts for the main `dimforge/rapier` repo and for `Lusito/box2d.ts` were not returned by the search API (renamed or moved).
- I could not see Matter.js's post-0.20.0 commits: the per-repo commit API was blocked for repos outside this session.
- The Rapier determinism page and Box2D's determinism blog post could not be opened (DNS failure in WebFetch). The Rapier claims come from a search summary.
- No measurement has been made of whether Matter.js 0.20.0 actually diverges between V8, SpiderMonkey and JavaScriptCore on this game's levels.
- The current Box2D v3 release number was not captured.

---

## Level design: can free level editors or formats (Tiled, LDtk, Ogmo Editor) work with a custom JS engine whose levels are rectangles, circles and special objects in JSON?

### Takeaway
Tiled fits the data model best and is the healthiest of the three:
- object layers support rectangles, ellipses, polygons, points, rotation, a `class` and arbitrary custom properties;
- releases have continued through 2026;
- the GPL covers only the editor, not the maps.

LDtk is entity- and grid-oriented and has not released since January 2024. Ogmo 3 has had no push in 28 months. For this game, though, an editor would add a converter while bypassing the measure-and-film loop that actually decides level quality. The more useful free tool is a live tuning panel (lil-gui) in a debug build.

### Cited Findings
- **Tiled**
  - 12,969 stars, 1,980 forks, 840 open issues, last push 2026-10-18 — [GitHub mapeditor/tiled](https://github.com/mapeditor/tiled)
  - Releases: Tiled 1.12.2 (27 May 2026), 1.12.1 (25 March 2026), 1.12.0 (13 March 2026), 1.11.2 (28 January 2025) — [NEWS.md](https://raw.githubusercontent.com/mapeditor/tiled/master/NEWS.md)
  - Licensing by component: Tiled itself (`src/tiled`) and its plugins are GPL; `libtiled`, `libtiled-java` and `tmxrasterizer` are BSD 2-clause — [README](https://raw.githubusercontent.com/mapeditor/tiled/master/README.md)
  - Its JSON object format has `ellipse` (bool, "Used to mark an object as an ellipse"), `polygon` (an array of points), `properties` (an array of custom properties), `rotation` ("Angle in degrees clockwise") and `class`, with worked Ellipse and Point examples — [json-map-format.rst](https://raw.githubusercontent.com/mapeditor/tiled/master/docs/reference/json-map-format.rst)
- **LDtk**
  - 4,332 stars, 293 forks, 386 open issues, last push 2026-10-15, MIT — [GitHub deepnight/ldtk](https://github.com/deepnight/ldtk)
  - The latest version in its changelog is 1.5.3 — [docs/CHANGELOG.md](https://raw.githubusercontent.com/deepnight/ldtk/master/docs/CHANGELOG.md)
  - 1.5.3 was released 15 January 2024, about 33 months ago (search summary of the developer's itch.io devlog) — [itch.io devlog](https://deepnight.itch.io/ldtk/devlog/666042/153)
  - LDtk JSON entity instances carry `px` ("Pixel coordinates (`[x,y]` format) in current level coordinate space"), `__worldX` and `fieldInstances` ("An array of all custom fields and their values") — [JSON_DOC.md](https://raw.githubusercontent.com/deepnight/ldtk/master/docs/JSON_DOC.md)
- **Ogmo Editor 3 CE**
  - 591 stars, 53 forks, 75 open issues, last push 2024-06-19 (28 months ago), MIT — [GitHub Ogmo-Editor-3/OgmoEditor3-CE](https://github.com/Ogmo-Editor-3/OgmoEditor3-CE)
  - README: "Open Source 2D level editor written in Haxe!", with downloads hosted on itch.io — [README](https://raw.githubusercontent.com/Ogmo-Editor-3/OgmoEditor3-CE/master/README.md)
- **lil-gui**
  - npm 0.21.0 (2025-10-12), MIT, 138,125 weekly downloads. Measured `lil-gui.esm.min.js`: 29,398 B raw and 7,859 B gzipped — [npm](https://registry.npmjs.org/lil-gui)
  - GitHub: 1,648 stars, last push 2025-10-12. Described as a "drop-in replacement for dat.gui" — [GitHub georgealways/lil-gui](https://github.com/georgealways/lil-gui)
- **Tweakpane**: npm 4.0.5 (2024-11-03, 23 months ago), MIT, 238,027 weekly downloads. Measured `tweakpane.min.js`: 152,084 B raw and 30,814 B gzipped. GitHub: 4,607 stars, last push 2026-03-15 — [npm](https://registry.npmjs.org/tweakpane); [GitHub cocopon/tweakpane](https://github.com/cocopon/tweakpane)

### Inferences
- **Tiled — SKIP for now; DEV TOOL only if level layout moves to non-programmers (medium confidence).**
  - Rectangles map to rectangle objects and circles to ellipse objects; special objects (plates `from: 'below'`, updraft `ax`/`accel`, hives, kennels) map to `class` plus custom properties.
  - The editor's GPL does not touch the game: the game would only read exported JSON, and Tiled's library parts are BSD.
  - The editor cannot show anything the game's own gates measure: breadth, tension, the A14 test, the frozen frame.
  - A converter is one more place for the "picture lies" class of bug that CLAUDE.md records several times.
- **LDtk — SKIP.** Its model is tiles plus entities on a level grid, a weaker fit for free-placed rotated rectangles and circles, and it has not released in 33 months.
- **Ogmo Editor 3 — SKIP.** It has been inactive for 28 months.
- **lil-gui — DEV TOOL.**
  - A floating panel in a debug build to nudge a level's numbers (positions, `ax`, `accel`, ink) while the game runs, then copy the result back into `js/levels.js` and run the gates.
  - It fits the "look at the running game" rule.
  - Keep it out of the shipped bundle with a build-time flag; it is 7.9 KB gzipped if it leaks.
- **Tweakpane — SKIP.** It is 4x larger than lil-gui and has gone 23 months without a release.

### Gaps
- I found no explicit Tiled statement that maps made with Tiled are not covered by the GPL. The "editor licence does not reach the output" point is an inference from the component licence table.
- I did not check whether any existing Tiled or LDtk importer for Matter.js is maintained. Given the custom semantics, one would have to be written anyway.

---

## Automated playtesting and solving: libraries or published approaches for solving and measuring physics-puzzle levels, procedural generation, difficulty estimation; Playwright utilities for canvas games; visual-regression tools

### Takeaway
No off-the-shelf library solves draw-a-line physics puzzles. The project's sweep-and-measure solver is already ahead of what is published as reusable code; the published approaches (Ropossum, PHYRE) are methods, not drop-in tools. The free tools that would genuinely help are:
- **Playwright features the project does not yet use**:
  - the clock API, which drives `requestAnimationFrame` deterministically;
  - WebKit and Firefox engines, for cross-engine certificate replay;
  - Chrome DevTools Protocol (CDP) vision-deficiency emulation.
- **pixelmatch**, for frame-diff regression with playwright-core;
- **fast-check**, for property-based invariant tests;
- **a worker pool** (piscina, or plain `node:worker_threads`) to parallelise the currently single-threaded sweeps.

### Cited Findings
**Playwright (already in use as playwright-core, pinned to 1.56 per CLAUDE.md)**
- npm `playwright-core` 1.64.1 (2026-10-14), Apache-2.0, 76.6M weekly downloads — [npm](https://registry.npmjs.org/playwright-core)
- GitHub: 98,008 stars; it "allows testing Chromium, Firefox and WebKit" — [GitHub microsoft/playwright](https://github.com/microsoft/playwright)
- The Clock API exists "since: v1.45" — [class-clock.md](https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/api/class-clock.md)
- Its guide lists `Date`, `requestAnimationFrame`, `cancelAnimationFrame` and `performance` among the APIs it controls, and documents `install`, `pauseAt`, `fastForward`, `runFor`, `resume`, `setFixedTime` and `setSystemTime` — [clock.md](https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/clock.md)
- Screenshot comparison: "Playwright Test includes the ability to produce and visually compare screenshots using `await expect(page).toHaveScreenshot()`". It warns that "Browser rendering can vary based on the host OS, version, settings, hardware, power source … headless mode", and stores snapshots per browser and platform — [test-snapshots-js.md](https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/test-snapshots-js.md)
- CDP `Emulation.setEmulatedVisionDeficiency` accepts `none`, `blurredVision`, `reducedContrast`, `achromatopsia`, `deuteranopia`, `protanopia` and `tritanopia` — [Emulation.pdl](https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/pdl/domains/Emulation.pdl)

**Visual diff tools**
- **pixelmatch**: npm 8.0.0 (2026-10-06), ISC, 6.25M weekly downloads, 949 dependents. GitHub: 6,994 stars, 6 open issues, last push 2026-10-06. Tagline: "The smallest, simplest and fastest JavaScript pixel-level image comparison library" — [npm](https://registry.npmjs.org/pixelmatch); [GitHub mapbox/pixelmatch](https://github.com/mapbox/pixelmatch)
- **odiff**: `odiff-bin` 4.5.0 (2026-07-23), MIT, 82,164 weekly downloads. GitHub: 3,273 stars; "A very fast SIMD-first image comparison library (with nodejs API)" — [npm](https://registry.npmjs.org/odiff-bin); [GitHub dmtrKovalenko/odiff](https://github.com/dmtrKovalenko/odiff)
- **BackstopJS** 6.3.25 (2024-09-07, 25 months without a release), MIT. GitHub: 7,186 stars, 576 open issues, last push 2026-10-10 — [npm](https://registry.npmjs.org/backstopjs); [GitHub garris/BackstopJS](https://github.com/garris/BackstopJS)
- **reg-suit** 0.14.5 (2025-08-26), MIT. GitHub: 1,301 stars — [npm](https://registry.npmjs.org/reg-suit); [GitHub reg-viz/reg-suit](https://github.com/reg-viz/reg-suit)
- **lost-pixel**: repo **archived** (last push 2026-04-22); last npm release 3.22.0 (2024-11-14) — [GitHub lost-pixel/lost-pixel](https://github.com/lost-pixel/lost-pixel); [npm](https://registry.npmjs.org/lost-pixel)
- **looks-same** 10.0.1 (2025-08-18), MIT. GitHub: 828 stars — [npm](https://registry.npmjs.org/looks-same)

**Test, parallelism and randomness libraries**
- **fast-check**: npm 4.10.2 (2026-09-19), MIT, 42.6M weekly downloads, 201 dependents. GitHub: 5,204 stars, last push 2026-10-18. "Property based testing framework for JavaScript (like QuickCheck)" — [npm](https://registry.npmjs.org/fast-check); [GitHub dubzzz/fast-check](https://github.com/dubzzz/fast-check)
- **piscina**: npm 5.3.2 (2026-08-28), MIT (LICENSE: "Copyright (c) 2020 James M Snell and the Piscina contributors"). Its maintainers include `matteo.collina` and `jasnell`. 6.7M weekly downloads. GitHub: 5,228 stars, 6 open issues. "A fast, efficient Node.js Worker Thread Pool implementation" — [npm](https://registry.npmjs.org/piscina); [GitHub piscinajs/piscina](https://github.com/piscinajs/piscina); [LICENSE](https://raw.githubusercontent.com/piscinajs/piscina/master/LICENSE)
- **tinypool** 2.2.0 (2026-09-13), MIT per npm, 29.6M weekly downloads, 1,603 stars — [npm](https://registry.npmjs.org/tinypool); [GitHub](https://github.com/tinylibs/tinypool)
- **seedrandom** 3.0.5 (2019-09-17, 85 months ago), MIT per README. **pure-rand** 8.4.2 (2026-07-10), MIT — [npm seedrandom](https://registry.npmjs.org/seedrandom); [README](https://raw.githubusercontent.com/davidbau/seedrandom/master/README.md); [npm pure-rand](https://registry.npmjs.org/pure-rand)
- **mitata** 1.0.34 (2025-02-04, 20 months ago). **tinybench** 6.2.2 (2026-10-10). Both MIT — [npm mitata](https://registry.npmjs.org/mitata); [npm tinybench](https://registry.npmjs.org/tinybench)

**This repo**
- Machine: 4 cores (`nproc`).
- `grep` for `worker_threads|child_process` under `tools/` matches only `tools/build.js`, `tools/test/ads.js`, `tools/test/run-all.js` and `tools/test/conformance.js` — nothing in `tools/solver`, `tools/levelgen` or `tools/lib`.
- Seeded generators already exist: `js/bees.js:41` "A small fast deterministic generator (mulberry32)"; `js/daily.js:96` `shuffle(seed, n)`.

Sources: repo files [js/bees.js](/home/user/BRO-YOU-RE-COOKED./js/bees.js) and [js/daily.js](/home/user/BRO-YOU-RE-COOKED./js/daily.js).

**Published approaches to automatic solving and generation**
- **Ropossum** (AIIDE 2013): a Cut the Rope authoring tool that combines a physics engine, an evolutionary content generator and an AI reasoning agent that checks playability. A follow-up paper notes that grammatical evolution with a heuristic fitness function did not guarantee solvability, and fixes it with depth-first search over game states, pruned by a Prolog-based agent that proposes only sensible moves (search summary) — [AIIDE demo paper](https://ojs.aaai.org/index.php/AIIDE/article/view/12611); [AIIDE full paper](https://ojs.aaai.org/index.php/AIIDE/article/view/12690)
- **PHYRE** (facebookresearch): "a benchmark for physical reasoning". Repo **archived**, last push 2023-07-08, Apache-2.0, 460 stars — [GitHub facebookresearch/phyre](https://github.com/facebookresearch/phyre)
- **Science Birds**: "A cover version of the 'Angry Birds' game used for research purposes". 46 stars, last push 2019-11-06, **no licence detected** — [GitHub lucasnfe/science-birds](https://github.com/lucasnfe/science-birds)

### Inferences
- **Playwright clock API — DEV TOOL (high confidence).**
  - `page.clock.install()` followed by `runFor(...)` steps `requestAnimationFrame` and `performance.now` deterministically.
  - That makes `npm run film` frames exactly reproducible regardless of machine load. It removes a source of flaky filmstrips and would enable pixel-level regression baselines.
  - It needs Playwright 1.45 or later; the pinned 1.56 qualifies.
- **Playwright WebKit and Firefox — DEV TOOL (high confidence).** Replay the daily-deck certificates (the existing `tools/test/daily-deck.js` logic) inside WebKit (JavaScriptCore) and Firefox (SpiderMonkey) pages. This directly answers the cross-engine determinism question from the physics section, at zero cost.
- **CDP vision-deficiency emulation — DEV TOOL (high confidence).** Film the frozen frames and death cams under `deuteranopia`, `protanopia` and `achromatopsia` (via `page.context().newCDPSession(page)`) and read them like any other film. A red hazard against a green goal is exactly what these modes test.
- **pixelmatch — DEV TOOL (high confidence).**
  - `toHaveScreenshot` belongs to Playwright Test, but the project drives playwright-core directly.
  - pixelmatch (ISC, pure JS, tiny, active) is the lightweight way to diff the `npm run frozen` contact sheet and filmstrip frames against approved baselines.
  - Baselines must be produced on one machine and browser build: Playwright's own docs say rendering varies by OS, hardware and headless mode.
  - It complements, never replaces, reading the films (CLAUDE.md's first rule).
- **fast-check — DEV TOOL (high confidence).** Property-based tests with automatic shrinking suit the engine invariants CLAUDE.md lists, for example:
  - "what they drew is what gets drawn";
  - no line through the dog, tested along the segments;
  - an over-budget stroke is rejected, not truncated;
  - doing nothing never wins.

  It also prints a reproducible seed when a test fails.
- **piscina or `node:worker_threads` — DEV TOOL (medium confidence).**
  - Sweeps are embarrassingly parallel, since each stroke is an independent simulation, and nothing under `tools/solver`, `tools/levelgen` or `tools/lib` uses workers.
  - On this 4-core machine a pool could cut solver, census and bake wall-time to roughly a quarter to a third, less overhead.
  - Start with built-in `worker_threads` (zero dependencies); adopt piscina only if pool management grows.
  - Results must be merged in stroke order to keep outputs byte-stable.
- **SKIP:**
  - odiff: a native binary, where pixelmatch suffices.
  - BackstopJS, reg-suit, looks-same and lost-pixel: DOM and CI-service oriented; lost-pixel is archived and BackstopJS has not released in 25 months.
  - tinypool: duplicates piscina.
  - seedrandom and pure-rand: the repo already has mulberry32.
  - mitata and tinybench: no need identified.
- **Published approaches — SKIP as code, read as method.** Ropossum's lesson matches the project's own finding: generation without a solver-backed solvability check produces unsolvable levels, and a domain agent that proposes only "sensible moves" is what makes search tractable. PHYRE is archived and Science Birds has no licence, so neither can be reused as code.

### Gaps
- I did not find a maintained, published library for difficulty estimation of physics puzzles. The project's tries (one over breadth times hand rate) and tension metrics appear more specific than anything reusable I found.
- `toHaveScreenshot`'s internal comparator was not confirmed from source in this session.

---

## Art and feel: free libraries for a hand-drawn look (Rough.js, perfect-freehand), particles, tweening/juice and screen shake, with no asset files and a tiny size budget

### Takeaway
One library earns its bytes: **perfect-freehand** (about 2 KB gzipped, MIT, released February 2026). It turns the player's stroke points into a variable-width, tapered ink outline, render-only, leaving the physics polyline untouched. Everything else either duplicates what the procedural renderer already does or costs 4.7 to 41 KB gzipped. That includes Rough.js (8.9 KB gzipped, no release in 35 months), the tween engines and the particle libraries. GSAP is free of charge, but under a custom, non-OSI licence.

### Cited Findings
- **perfect-freehand**
  - npm 1.2.3 (2026-02-01), MIT, 1.76M weekly downloads, 326 dependents. GitHub: 5,761 stars, 22 open issues, last push 2026-04-13. "Draw perfect pressure-sensitive freehand lines" — [npm](https://registry.npmjs.org/perfect-freehand); [GitHub steveruizok/perfect-freehand](https://github.com/steveruizok/perfect-freehand)
  - Measured `dist/esm/index.mjs`: 4,532 B raw and 2,004 B gzipped — [npm](https://registry.npmjs.org/perfect-freehand)
  - README: you "**render** your stroke points using your technology of choice … examples in SVG and HTML Canvas"; for Canvas, pass the path string to `new Path2D(pathData)` — README in the [npm tarball](https://registry.npmjs.org/perfect-freehand)
- **Rough.js**
  - npm `roughjs` 4.6.6 (2023-11-20, about 35 months ago), MIT, 10.9M weekly downloads. GitHub: 21,283 stars, 42 open issues, last push 2024-07-28 (26.7 months ago) — [npm](https://registry.npmjs.org/roughjs); [GitHub rough-stuff/rough](https://github.com/rough-stuff/rough)
  - README: "Rough.js is a small (<9 kB) graphics library that lets you draw in a sketchy, hand-drawn-like, style". Measured `bundled/rough.esm.js`: 27,748 B raw and 8,927 B gzipped — [README](https://raw.githubusercontent.com/rough-stuff/rough/master/README.md)
- **GSAP**
  - npm `gsap` 3.15.0 (2026-04-13). Its licence field reads "Standard 'no charge' license: https://gsap.com/standard-license". 3.66M weekly downloads — [npm](https://registry.npmjs.org/gsap)
  - README: "Thanks to Webflow, GSAP is now 100% FREE including ALL of the bonus plugins". The GitHub API reports no detected licence — [README](https://raw.githubusercontent.com/greensock/GSAP/master/README.md); [GitHub greensock/GSAP](https://github.com/greensock/GSAP)
  - Measured `dist/gsap.min.js`: 72,927 B raw and 28,268 B gzipped
- **anime.js**: npm `animejs` 4.5.0 (2026-06-22), MIT. GitHub: 73,691 stars. Measured `anime.esm.min.js`: 118,678 B raw and 40,836 B gzipped — [npm](https://registry.npmjs.org/animejs); [GitHub juliangarnier/anime](https://github.com/juliangarnier/anime)
- **tween.js**: npm `@tweenjs/tween.js` 25.0.0 (2024-07-26, 26.7 months ago), MIT. GitHub: 10,148 stars, last push 2026-10-06. Measured unminified `dist/tween.esm.js`: 43,418 B raw and 7,000 B gzipped — [npm](https://registry.npmjs.org/@tweenjs/tween.js); [GitHub tweenjs/tween.js](https://github.com/tweenjs/tween.js)
- **Proton** (particles): npm `proton-engine` 7.1.5 (2025-03-24, 18.8 months ago), MIT, 2,281 weekly downloads. GitHub: 2,476 stars. Measured `proton.min.js`: 64,768 B raw and 17,009 B gzipped — [npm](https://registry.npmjs.org/proton-engine); [GitHub drawcall/Proton](https://github.com/drawcall/Proton)
- **simplex-noise** 4.0.3 (2024-07-26), MIT. Measured unminified ESM file: 18,735 B raw and 4,698 B gzipped — [npm](https://registry.npmjs.org/simplex-noise)
- **bezier-easing** 3.2.0 (2026-10-07), MIT. Measured min file: 1,414 B raw and 801 B gzipped — [npm](https://registry.npmjs.org/bezier-easing)
- **eases** 1.0.8 (2015-10-07; repo last pushed 2017) — [npm](https://registry.npmjs.org/eases); [GitHub mattdesl/eases](https://github.com/mattdesl/eases)
- **simplify-js** 1.2.4 (2020-02-03), BSD-2-Clause. Measured: 3,195 B raw and 1,149 B gzipped — [npm](https://registry.npmjs.org/simplify-js)
- **This repo** already seeds its procedural texture: `js/render/world.js:21` "Paper grain — a few hundred faint specks, seeded so it never shimmers". CLAUDE.md records a shipped "vibrating line" bug. Sources: [js/render/world.js](/home/user/BRO-YOU-RE-COOKED./js/render/world.js); [CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md)

### Inferences
- **perfect-freehand — INTEGRATE, as a trial, render-only (medium confidence).**
  - Use it only for drawing the player's line, both live and frozen.
  - Physics keeps using the simplified polyline, so no measured number moves.
  - Output depends only on the input points (nothing in the README suggests randomness), so the line will not boil frame to frame.
  - Costs: about 2 KB gzipped (3% of the bundle); MIT; active.
  - Conditions: it must pass `tools/test/shapes.js` ("what they drew is what gets drawn"), and the films must be read before it ships.
  - `inkPath`'s `alpha` option and the death-cam renderer (`deathcam.js`) would need the same treatment, or the replay will draw a different line from play.
- **Rough.js — SKIP (medium confidence).**
  - The hand-inked look already exists procedurally.
  - It adds about 8.9 KB gzipped (+14%).
  - It has not released in 35 months.
  - Its sketchiness comes from randomness. Unless every shape is seeded and cached, it recreates exactly the "vibrating line" failure CLAUDE.md warns about. I did not confirm a `seed` option from the README.
- **GSAP — SKIP (high confidence).**
  - Its licence is a custom "no charge" licence, not an OSI licence. I could not open the terms page, so its restrictions are unverified.
  - 28 KB gzipped.
  - It runs its own ticker, which would have to be wired into `onPause` and into deterministic filming.
- **anime.js, tween.js and Proton — SKIP.** Each brings its own update loop and 7 to 41 KB gzipped. A ten-line easing table driven by the game's fixed 120 Hz clock is deterministic, pausable and free.
- **simplex-noise and eases — SKIP.**
  - Screen shake should be decaying "trauma" noise driven by the existing seeded mulberry32, which keeps films reproducible. That is a few lines.
  - Tie its amplitude to `prefers-reduced-motion` (see the accessibility section).
- **simplify-js — SKIP.** The project already applies Douglas–Peucker to strokes (CLAUDE.md).
- **bezier-easing — SKIP by default.** It is fine (0.8 KB gzipped, active) if CSS-style cubic curves are ever needed.

### Gaps
- I could not open the GSAP licence page, so its specific restrictions are not verified here.
- I did not confirm whether Rough.js exposes a seed option.
- No published size-versus-feel comparison of particle libraries was found.

---

## Audio: tiny procedural sound libraries (ZzFX, jsfxr) and free sound/music sources whose licences allow commercial use

### Takeaway
The game already synthesizes its sounds with Web Audio, and on Playables it is often muted, so audio cannot carry information. No audio library is needed. If the sound set is ever rewritten, ZzFX (MIT, 1.4.0 released October 2026, ZzFXMicro 1.9 KB gzipped) is the right size class. jsfxr is public-domain (Unlicense) but 8.7 KB gzipped. Tone.js (79 KB gzipped) and Howler (sample playback) do not fit. For recorded sound, Kenney packs are CC0. Freesound licences vary per clip and include CC BY-NC, which cannot be used commercially. Sonniss GDC bundles are reported royalty-free with no attribution, but check each year's terms.

### Cited Findings
- **ZzFX**
  - npm `zzfx` 1.4.0 (2026-10-01), MIT, 4,960 weekly downloads. GitHub: 803 stars, 7 open issues, last push 2026-10-01 — [npm](https://registry.npmjs.org/zzfx); [GitHub KilledByAPixel/ZzFX](https://github.com/KilledByAPixel/ZzFX)
  - README: "Open Source: MIT licensed, use it anywhere!", aimed at "size-limited competitions like JS13K", with js13k game credits — [README](https://raw.githubusercontent.com/KilledByAPixel/ZzFX/master/README.md)
  - Measured: `ZzFX.js` 10,301 B raw and 3,566 B gzipped; `ZzFXMicro.js` 5,715 B raw and 1,915 B gzipped
- **ZzFXM** (music): 473 stars, MIT, last push 2023-12-25 (33.8 months ago); not on npm — [GitHub keithclark/ZzFXM](https://github.com/keithclark/ZzFXM)
- **jsfxr**
  - npm 1.4.1 (2026-05-05), 2,932 weekly downloads. The npm licence field is empty, but the tarball ships an `UNLICENSE` file (a public-domain dedication) — [npm](https://registry.npmjs.org/jsfxr)
  - Measured: `sfxr.js` 35,898 B raw and 8,659 B gzipped, plus `riffwave.js` at 2,070 B gzipped
- **Tone.js**: npm `tone` 15.1.22 (latest tag 2025-04-27; newer publishes up to 2026-10-04), MIT. GitHub: 14,779 stars. Measured `build/Tone.js`: 345,500 B raw and 79,210 B gzipped — [npm](https://registry.npmjs.org/tone); [GitHub Tonejs/Tone.js](https://github.com/Tonejs/Tone.js)
- **howler.js** 2.2.4 (2023-09-19, 37 months without a release), MIT. GitHub: 25,396 stars, 420 open issues. Measured `howler.core.min.js`: 26,924 B raw and 7,951 B gzipped — [npm](https://registry.npmjs.org/howler); [GitHub goldfire/howler.js](https://github.com/goldfire/howler.js)
- **SoundBox**: the GitHub repo is archived and says "This repository has moved to: https://gitlab.com/mbitsnbites/soundbox". "The SoundBox editor is licensed under the GNU General Public License version 3"; the player is "released under the zlib/libpng license" — [README](https://raw.githubusercontent.com/mbitsnbites/soundbox/master/README.md)
- **BeepBox**: 1,197 stars, MIT, last push 2026-08-07. "An online tool for sketching and sharing instrumental melodies" — [GitHub johnnesky/beepbox](https://github.com/johnnesky/beepbox)
- **Kenney** sound packs are listed as CC0 on OpenGameArt, with crediting described as "not mandatory" (search summary of OpenGameArt mirrors, not kenney.nl itself) — [OpenGameArt: Kenney UI SFX](https://opengameart.org/content/51-ui-sound-effects-buttons-switches-and-clicks)
- **Freesound** sounds carry CC0, CC BY or CC BY-NC per clip. CC0 and CC BY allow commercial use; CC BY-NC does not. Older Sampling+ clips should be treated as CC BY-NC (search summary) — [Wikipedia: Freesound](https://en.wikipedia.org/wiki/Freesound)
- **Sonniss GDC bundles** are reported as royalty-free for commercial use, with no attribution and unlimited projects. The 2024 bundle reportedly adds a no-AI-training clause (secondary reporting; licence text not retrieved) — [GameFromScratch: GDC 2024 bundle](https://gamefromscratch.com/sonniss-27-5gb-sound-effect-giveaway-at-gdc-2024/); [Cinevva guide](https://app.cinevva.com/guides/free-sound-effects-music)

### Inferences
- **ZzFX — SKIP (medium confidence).** The working synthesizer in `js/audio.js` already meets the "zero assets, suspend on pause" rules. Replacing it is churn with no gameplay gain, since audio must not carry information on a muted platform. If the sound set is redesigned, ZzFXMicro (1.9 KB gzipped, MIT, active) is the one to ship, and its parameter-array format makes sounds easy to tune by ear.
- **jsfxr — SKIP.** It is public domain, but about 4.5x ZzFXMicro's gzipped size (8,659 B against 1,915 B) for the same job.
- **Tone.js — SKIP.** At 79 KB gzipped it is bigger than the whole game.
- **Howler — SKIP.** It plays sample files, which the game does not have.
- **ZzFXM, SoundBox and BeepBox — SKIP.** No music system is planned. ZzFXM is inactive; SoundBox has moved to GitLab and its editor is GPL-3.
- **Recorded audio sources — SKIP; the zero-asset design stands.** If recorded sound is ever wanted, accept only CC0 (Kenney, CC0-filtered Freesound) or a licence read at source (Sonniss, per year). Never accept CC BY-NC, and avoid share-alike or GPL assets in a closed game.

### Gaps
- I did not open Kenney's own licence page, Freesound's licence pages or the Sonniss licence text; these claims rest on mirrors and secondary sources.
- jsfxr's GitHub star count is unknown: chr15m/jsfxr appears to be a fork, which GitHub search excludes.
- OpenGameArt's licence mix (CC BY-SA, GPL and others) was not verified beyond the Kenney entries.

---

## Build, size and performance: bundlers and minifiers, compression, profiling for mobile browsers, Lighthouse-style checks for iframe games

### Takeaway
The build is already on the best free option: esbuild 0.28.2, MIT, released August 2026, 183M weekly downloads. The shipped bundle is 65 KB gzipped. I measured terser on the shipped game script: it saves only 1,700 B gzipped (about 2.6% of the total), not worth a second minifier. Roadroller, html-minifier-terser and source-map-explorer are abandoned or stale. Use instead:
- esbuild's metafile plus `analyzeMetafile`;
- a gzip budget assertion in `tools/build.js` using `node:zlib`;
- Lighthouse only occasionally;
- Eruda, in a local debug build only, for console access on a phone.

### Cited Findings
- **esbuild**
  - npm 0.28.2 (2026-08-08), MIT, 183M weekly downloads. GitHub: 40,098 stars, 634 open issues, last push 2026-08-09 — [npm](https://registry.npmjs.org/esbuild); [GitHub evanw/esbuild](https://github.com/evanw/esbuild)
  - The project's build loads esbuild from `esbuild` or `/tmp/node_modules/esbuild` (installed version 0.28.2) with `bundle: true, format: 'iife', target: 'es2020', minify: true, legalComments: 'none'` — [repo tools/build.js](/home/user/BRO-YOU-RE-COOKED./tools/build.js) (lines 39–54)
  - `esbuild.analyzeMetafile(result.metafile, …)` is documented in esbuild's 2021 changelog — [CHANGELOG-2021.md](https://raw.githubusercontent.com/evanw/esbuild/main/CHANGELOG-2021.md)
- **terser**: npm 5.51.2 (2026-08-27), BSD-2-Clause, 48.8M weekly downloads, 9,345 stars — [npm](https://registry.npmjs.org/terser); [LICENSE](https://raw.githubusercontent.com/terser/terser/master/LICENSE)
  - **Measured in this session**: terser 5.51.2 (`--compress passes=2 --mangle`) on the shipped esbuild-minified game script (the largest `<script>` in `dist/byc.html`) took it from 149,355 B to 145,664 B raw, and from **38,974 B to 37,274 B gzipped (−1,700 B)**. The output was not run.
- **Roadroller**
  - npm 2.1.0 (2021-09-13, 61 months ago), 701 weekly downloads. GitHub: 361 stars, last push 2022-07-24 — [npm](https://registry.npmjs.org/roadroller); [GitHub lifthrasiir/roadroller](https://github.com/lifthrasiir/roadroller)
  - README: "Roadroller is considered 'heavyweight' … it is quite resource intensive and requires both a considerable amount of memory and a non-negligible run time", and "By default the decompressed data immediately goes through `eval`" — [README](https://raw.githubusercontent.com/lifthrasiir/roadroller/main/README.md)
- **html-minifier-terser** 7.2.0 (2023-04-11, 42 months ago) — [npm](https://registry.npmjs.org/html-minifier-terser)
- **source-map-explorer** 2.5.3 (2022-09-26, 48.7 months ago), Apache-2.0; last push 2023-03-14 — [npm](https://registry.npmjs.org/source-map-explorer); [GitHub](https://github.com/danvk/source-map-explorer)
- **size-limit** 14.2.0 (2026-10-07), MIT, 7,033 stars — [npm](https://registry.npmjs.org/size-limit); [GitHub ai/size-limit](https://github.com/ai/size-limit)
- **Lighthouse** 13.5.0 (latest tag 2026-09-18), Apache-2.0, 3.19M weekly downloads. GitHub: 30,905 stars — [npm](https://registry.npmjs.org/lighthouse); [GitHub GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse)
  - The `playwright-lighthouse` wrapper's last release was 4.0.0 (2024-01-15, 33 months ago); 40 open issues — [npm](https://registry.npmjs.org/playwright-lighthouse); [GitHub](https://github.com/abhinaba-ghosh/playwright-lighthouse)
- **Eruda**: npm 3.4.3 (2025-06-15, 16 months ago), MIT. GitHub: 21,217 stars, last push 2025-08-01. "Console for mobile browsers" — [npm](https://registry.npmjs.org/eruda); [GitHub liriliri/eruda](https://github.com/liriliri/eruda)
- **vConsole**: npm 3.15.1 (2023-06-01, 40 months ago), MIT per npm. GitHub: 17,532 stars, last push 2026-03-27 — [npm](https://registry.npmjs.org/vconsole); [GitHub Tencent/vConsole](https://github.com/Tencent/vConsole)
- **stats.js**: npm 0.17.0 (2016-10-29, about 120 months ago), MIT. Measured: 1,965 B raw and 1,053 B gzipped. Repo last pushed 2024-10-11 — [npm](https://registry.npmjs.org/stats.js); [GitHub mrdoob/stats.js](https://github.com/mrdoob/stats.js)

### Inferences
- **esbuild — DEV TOOL (keep). Pin the exact version (high confidence).**
  - Today the build silently prefers whatever `esbuild` resolves to, before `/tmp/node_modules`.
  - Add `metafile: true` and print `analyzeMetafile` output when the size changes. That replaces source-map-explorer at zero cost.
- **terser — SKIP (high confidence).** 1.7 KB gzipped is too small to justify a second minifier pass plus the risk of a compress-pass bug in an untested output, especially since the YouTube ZIP is already about 66 KB.
- **Roadroller — SKIP (high confidence).**
  - Abandoned since 2021.
  - It is built on `eval` and costs startup time and memory on phones. Whether `eval` is even allowed inside the Playables iframe is unverified.
  - It solves a js13k problem this game does not have.
- **size-limit — SKIP.** Assert a gzip budget directly in `tools/build.js` with `zlib.gzipSync` (three lines, no dependency). Fail the build if, say, `byc.html` grows past a chosen limit.
- **html-minifier-terser and source-map-explorer — SKIP.** Both are stale. The HTML shell is small, and esbuild's metafile analysis covers the bundle breakdown.
- **Lighthouse CLI — DEV TOOL, occasional (medium confidence).** Run it against the web build's page for load metrics and best practices. It audits page load, not gameplay frame time, and it does not model YouTube's iframe. Skip the stale `playwright-lighthouse` wrapper.
- **Eruda — DEV TOOL (medium confidence).**
  - For on-phone console debugging, inject it only into a separate debug build.
  - Bundle it locally, never from a CDN, because of the zero-network rule. The build's banned-primitive gate would not catch a script tag.
  - It must never reach `byc-playables.zip`.
- **vConsole and stats.js — SKIP.** Both have gone 40+ months without a release. Chrome DevTools' remote debugging and Playwright traces cover frame timing.

### Gaps
- Whether the Playables iframe imposes a content security policy (on `eval`, `new Function` or `blob:` URLs) was not checked: developers.google.com was unreachable from this machine.
- No free tool was found that profiles frame time *inside* YouTube's own iframe on a real phone. Manual remote debugging (Chrome for Android, Safari Web Inspector) is the standard route, but I did not retrieve a citation for it in this session.

---

## Localization and accessibility helpers suitable for a tiny bundle

### Takeaway
No library is needed. A plain string table plus the browser's built-in `Intl` APIs covers a few dozen short UI strings at zero bytes. The `prefers-reduced-motion` media query (zero bytes) is the right switch for damping screen shake and slow-motion. The most valuable free accessibility tool is a development one: CDP's vision-deficiency emulation, driven from the existing Playwright film tools.

### Cited Findings
- **rosetta**: "A general purpose internationalization library in 292 bytes". npm 1.1.0 (2020-06-29, 75.6 months ago), MIT. Measured `dist/index.mjs`: 528 B raw and 278 B gzipped. GitHub: 796 stars, last push 2024-01-20 — [npm](https://registry.npmjs.org/rosetta); [GitHub lukeed/rosetta](https://github.com/lukeed/rosetta)
- **i18next** 26.5.2 (2026-10-17), MIT, 13.9M weekly downloads. Measured unminified `dist/esm/i18next.js`: 83,876 B raw and 18,955 B gzipped — [npm](https://registry.npmjs.org/i18next)
- **typesafe-i18n** 5.27.1 (2026-02-11), MIT, maintained by the `codingcommons` organisation. GitHub: 2,479 stars — [npm](https://registry.npmjs.org/typesafe-i18n); [GitHub codingcommons/typesafe-i18n](https://github.com/codingcommons/typesafe-i18n)
- **intl-messageformat** 12.1.3 (2026-10-05), BSD-3-Clause, 12.8M weekly downloads — [npm](https://registry.npmjs.org/intl-messageformat)
- **axe-core** 4.14.0 (2026-10-05), MPL-2.0, 47.5M weekly downloads. GitHub: 7,666 stars. `@axe-core/playwright` 4.14.0 is also MPL-2.0 — [npm axe-core](https://registry.npmjs.org/axe-core); [npm @axe-core/playwright](https://registry.npmjs.org/@axe-core/playwright)
- **MDN on `prefers-reduced-motion`**: it "is used to detect if a user has enabled a setting on their device to minimize the amount of non-essential motion". Animations such as "scaling or panning large objects can be vestibular motion triggers" — [MDN prefers-reduced-motion (source)](https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/reference/at-rules/@media/prefers-reduced-motion/index.md)
- **CDP vision-deficiency emulation** supports `deuteranopia`, `protanopia`, `tritanopia`, `achromatopsia`, `blurredVision` and `reducedContrast` — [Emulation.pdl](https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/pdl/domains/Emulation.pdl)

### Inferences
- **Native `Intl` and a string table — INTEGRATE, 0 bytes (medium confidence).**
  - The game's text is short and banner-like ("HE'S STUCK", "TOO MUCH INK", the hints).
  - A `{lang: {key: string}}` table with `Intl.PluralRules` and `Intl.NumberFormat` for counts and ink numbers covers it.
  - rosetta's whole API is about 20 lines and could be copied, but it has not released since 2020, so copying the idea beats adding the dependency.
- **`prefers-reduced-motion` — INTEGRATE, 0 bytes (medium confidence).** Scale screen-shake amplitude and the CLOSE CALL slow-motion down when it matches.
- **CDP vision-deficiency emulation — DEV TOOL (high confidence).** Add a `FILM_VISION=deuteranopia` style option to `npm run film` and `npm run frozen`.
- **SKIP:**
  - i18next: 19 KB gzipped unminified, 29% of the bundle.
  - typesafe-i18n: TypeScript code generation, which does not fit a vanilla-JS build.
  - intl-messageformat: not needed for this string volume.
  - axe-core: it audits DOM semantics and cannot see canvas-drawn content. Its MPL-2.0 licence would be fine for a dev tool.

### Gaps
- I did not verify how the YouTube Playables SDK reports the player's language (developers.google.com was blocked), nor whether `matchMedia('(prefers-reduced-motion: reduce)')` reflects the host OS setting inside YouTube's app webviews.
- No authoritative game-accessibility checklist was retrieved in this session.

---

## Templates and starter kits claiming "YouTube Playables" or "HTML5 game": legitimate and useful, or spam?

### Takeaway
There are only a handful of legitimate Playables repos, all from known organisations:
- **google/web-game-samples** (Google, Apache-2.0, titled "YouTube Playables - Web game samples");
- **phaserjs/template-youtube-playables** (Phaser Studio, MIT, a sample game that "demonstrates every available feature of the YouTube Playables SDK");
- official **Scirra (Construct)** and **Defold** plugins.

They are useful as reference reading for the SDK lifecycle, not as code to adopt (Phaser 3 + Vite; other engines). The rest of what turns up under "youtube playables" is ripped-game mirrors ("unblocked games"), an unexplained non-fork copy of Phaser, and near-zero-usage npm packages.

### Cited Findings
- **google/web-game-samples**
  - 131 stars, 31 forks, 6 open issues, created 2023-10-23 — [GitHub google/web-game-samples](https://github.com/google/web-game-samples)
  - README title "YouTube Playables - Web game samples". It says Playables "supports standard web platform APIs" and links the Playables developer documentation — [README](https://raw.githubusercontent.com/google/web-game-samples/main/README.md)
  - Licence: Apache 2.0 — [LICENSE](https://raw.githubusercontent.com/google/web-game-samples/main/LICENSE)
- **phaserjs/template-youtube-playables**
  - 21 stars, 0 forks, created 2024-07-24. Description: "A Phaser 3 sample game that demonstrates all aspects of the YouTube Playables SDK" — [GitHub](https://github.com/phaserjs/template-youtube-playables)
  - README: "a Phaser 3 project template for creating YouTube Playables that uses Vite"; its sample game "**Basketball Shoot Out** … demonstrates every available feature of the YouTube Playables SDK"; updated for Phaser 3.86.0, "YouTube Playables API v1" and Vite 5.4.8 — [README](https://raw.githubusercontent.com/phaserjs/template-youtube-playables/main/README.md)
  - LICENSE: MIT, "Copyright (c) 2024 Phaser Studio Inc" — [LICENSE](https://raw.githubusercontent.com/phaserjs/template-youtube-playables/main/LICENSE)
- The Phaser repo (40,505 stars) carries the GitHub topic `youtube-playables`; npm `phaser` is at 4.2.1 (2026-07-09) — [GitHub phaserjs/phaser](https://github.com/phaserjs/phaser); [npm](https://registry.npmjs.org/phaser)
- **Scirra/Construct-Plugin-YouTube-Playables**: "A Construct plugin for integrating with the YouTube Playables SDK"; 2 stars, created 2024-09-05 — [GitHub](https://github.com/Scirra/Construct-Plugin-YouTube-Playables)
- **defold/extension-playables**: "Defold native extension for the YouTube Playables SDK"; 2 stars, created 2026-09-03 — [GitHub](https://github.com/defold/extension-playables)
- **npm search for "youtube playables"**:
  - `@maoyugames/phaser-platform-youtube` 1.0.0-rc.0 (2026-07-14): "YouTube Playables runtime adapter and build definition for PhaserFramework", **4 weekly downloads**
  - `ytgame-object-system` 1.0.0 (2025-06-25): **0 weekly downloads**; its description, 游戏对象与物品系统, means "game object and item system", unrelated to the SDK

  A search for "ytgame playables sdk" on GitHub returned 0 repositories — [npm search](https://registry.npmjs.org/-/v1/search?text=youtube%20playables); [npm search](https://registry.npmjs.org/-/v1/search?text=ytgame)
- **Red-flag repos found by the same search**:
  - `bubbls/youtube-playables`: 35 stars but 76 forks, created 2025-03-11. README: "All these games are taken from YouTube Playables and developed by their respected developers", "made for minion games" — [GitHub](https://github.com/bubbls/youtube-playables); [README](https://raw.githubusercontent.com/bubbls/youtube-playables/main/README.md)
  - `phexus23/phexus23.github.io`: description "Aims to make a name for itself by reverse engineering gate kept games". README advertises "Over a 100 games", "Tab Cloak" and "About Blank Cloak – Gatekeep the url"; topics include `unblocked-games` — [GitHub](https://github.com/phexus23/phexus23.github.io); [README](https://raw.githubusercontent.com/phexus23/phexus23.github.io/main/README.md)
  - `kakao74/phaser`: **not a fork**, yet its README is Phaser's and its `package.json` says `"name": "phaser"`, `"version": "3.87.0"`. 10 stars, created 2024-12-24 — [GitHub](https://github.com/kakao74/phaser); [package.json](https://raw.githubusercontent.com/kakao74/phaser/master/package.json)
- **Engines that also turn up as "HTML5 game templates"**, for size reference:
  - LittleJS: npm 1.27.2 (2026-10-15), MIT, 4,301 stars. Measured `littlejs.esm.min.js`: 595,005 B raw and 168,380 B gzipped. Its README says its Box2D integration uses "Box2D v2.3.1 wasm" from kripken/box2d.js — [npm](https://registry.npmjs.org/littlejsengine); [README](https://raw.githubusercontent.com/KilledByAPixel/LittleJS/main/README.md)
  - kontra: 10.0.2 (2024-08-25), MIT. Measured: 41,182 B raw and 13,768 B gzipped — [npm](https://registry.npmjs.org/kontra)

### Inferences
- **google/web-game-samples and the Phaser template — DEV TOOL, reference reading only (high confidence).**
  - Both are legitimate, from Google and Phaser Studio, under permissive licences.
  - Diff their handling of the SDK's ready, pause/resume, save/load and ads calls against `js/platform/sdk.js` and the ads gate in `tools/test/ads.js`.
  - Do not adopt either as a base: the game is vanilla ES modules with its own engine. The Phaser template targets Phaser 3.86, while npm Phaser is now 4.2.1, so it may lag the current SDK.
- **Scirra and Defold plugins — SKIP.** They are legitimate but engine-specific.
- **`@maoyugames/phaser-platform-youtube` and `ytgame-object-system` — SKIP.** Near-zero usage and unknown publishers. An "SDK adapter" from an unknown publisher is precisely the supply-chain risk described in the red-flags section.
- **bubbls/youtube-playables and phexus23.github.io — SKIP, red flag.** They re-host other studios' Playables builds, which is a copyright problem. They are also a signal that shipped Playables bundles get scraped and mirrored, so the game's code should be treated as public.
- **kakao74/phaser — SKIP, red flag.**
  - An unexplained non-fork re-upload of a popular project is a pattern used by malware campaigns (see the red-flags section).
  - I did not find malicious code; I only checked that `package.json` claims to be Phaser 3.87.0.
  - Use `phaserjs/phaser` if Phaser is ever needed.
- **LittleJS and kontra — SKIP.** They are engines, not tools. The game already has its own, and LittleJS alone is 168 KB gzipped, 2.6x the whole game.

### Gaps
- The Phaser template's last push date was not retrieved (the minimal search output gives only `updated_at`, which also changes when someone stars a repo).
- I did not inspect the contents of google/web-game-samples beyond its README.
- The official Playables developer documentation (developers.google.com) was unreachable, so no template's SDK usage was checked against the current SDK reference.

---

## Red flags: abandoned repos, licence traps (non-commercial, GPL in a closed game), malware-laden fake repos, inflated stars

### Takeaway
GitHub stars are a weak trust signal:
- A peer-reviewed study (ICSE 2026) found about 6 million suspected fake stars, mostly promoting short-lived phishing and malware repositories.
- Kaspersky documented 200+ fake "game tool" repos ("GitVenom") with polished READMEs and inflated commit counts.
- The npm registry itself suffered the self-propagating "Shai-Hulud" worm in September and November 2025, through malicious `postinstall` scripts.

For this project the practical rules are:
- trust packages by maintainer identity and registry history, not stars;
- pin exact versions and install with `--ignore-scripts` where possible;
- never run code from unvetted game repos.

Licence traps in this shortlist: GSAP (custom, non-OSI), the GPL Tiled and SoundBox editors (editor-only), Freesound CC BY-NC clips, and unlicensed research code (Science Birds).

### Cited Findings
- **Fake stars**: the StarScout study (Carnegie Mellon, Socket, NC State), "Six Million (Suspected) Fake Stars on GitHub", accepted to ICSE 2026, analysed GH Archive data for 2019–2024 (search summary):
  - about 6.0 million suspected fake stars across 18,617 repositories in v2 (the v1 preprint said 4.5 million);
  - a filtered subset of 3.1 million stars from 278,000 accounts across 15,835 repositories;
  - campaigns surged in 2024, and most fake stars promote short-lived phishing and malware repositories;
  - the boost lasts under about two months and becomes a liability long term.

  Sources: [arXiv 2412.13459](https://arxiv.org/abs/2412.13459); [ICSE 2026 listing](https://conf.researchr.org/details/icse-2026/icse-2026-research-track/14/Six-Million-Suspected-Fake-Stars-on-GitHub-A-Growing-Spiral-of-Popularity-Contests); [heise](https://heise.de/-10223665)
- **GitVenom** (Kaspersky, February 2025), per the search summary:
  - 200+ fake repositories, including a Valorant crack tool, with polished READMEs and "tens of thousands of commits" inflated by timestamp files updated every few minutes;
  - payloads included a Node.js stealer, AsyncRAT and Quasar RAT, and a clipboard hijacker;
  - about 5 BTC (roughly $456k–$485k) stolen.

  Sources: [The Hacker News](https://thehackernews.com/2025/02/gitvenom-malware-steals-456k-in-bitcoin.html); [Kaspersky blog](https://kaspersky.com/blog/malicious-code-in-github/53085)
- **Shai-Hulud npm worm**, per the search summaries of security-vendor reports (counts differ by source):
  - first wave in mid-September 2025: over 500 npm packages compromised through a malicious `postinstall` script that harvested GitHub, npm and cloud tokens;
  - second wave ("Shai-Hulud 2.0", around 21–24 November 2025): roughly 600–800 packages, with 25,000+ GitHub repositories publishing stolen secrets.

  Sources: [Ampcus Cyber](https://www.ampcuscyber.com/shadowopsintel/500-npm-packages-poisoned-in-shai-hulud-worm-attack/); [ThaiCERT](https://www.thaicert.or.th/en/2025/09/18/shai-hulud-worm-spreads-via-npm-packages-to-steal-data-and-self-propagate/); [Invicti](https://www.invicti.com/blog/web-security/shai-hulud-2-worm-supply-chain-attack-on-npm-dependencies); [Hackmag](https://hackmag.com/news/shai-hulud-2-0)
- **Licence traps verified in this shortlist:**
  - GSAP: custom "Standard 'no charge' license" — [npm](https://registry.npmjs.org/gsap)
  - Tiled: the editor and plugins are GPL; libtiled is BSD 2-clause — [README](https://raw.githubusercontent.com/mapeditor/tiled/master/README.md)
  - SoundBox: the editor is GPL-3, the player zlib — [README](https://raw.githubusercontent.com/mbitsnbites/soundbox/master/README.md)
  - Freesound: CC BY-NC clips are excluded from commercial use — [Wikipedia](https://en.wikipedia.org/wiki/Freesound)
  - Science Birds: no licence detected — [GitHub](https://github.com/lucasnfe/science-birds)
  - jsfxr: empty npm licence field, but an `UNLICENSE` file in the tarball — [npm](https://registry.npmjs.org/jsfxr)
  - p2: empty npm licence field, but an MIT LICENSE file in the repo — [LICENSE](https://raw.githubusercontent.com/schteppe/p2.js/master/LICENSE)
  - axe-core: MPL-2.0, a file-level copyleft, fine for dev tooling — [npm](https://registry.npmjs.org/axe-core)
- **Abandoned or stale (more than 18 months without a release, as of 2026-10-19), all from the npm and GitHub data above:**
  - Physics:
    - p2: 131 months
    - poly-decomp: 99 months
    - box2d-wasm: 59 months
    - p2-es: 35.5 months
    - matter-js: 28 months (repo still pushed)
    - @box2d/core: 26 months
    - phaser-box2d: 21.5 months (last push 18.5 months ago)
  - Editors:
    - LDtk: about 33 months since 1.5.3 (repo still pushed)
    - Ogmo: last push 28 months ago
  - Art:
    - eases: 132 months
    - roughjs: 35 months
    - tween.js: 27 months (repo still pushed)
    - simplex-noise: 27 months
    - Proton: 18.8 months
  - Audio:
    - howler: 37 months
    - ZzFXM: last push 34 months ago
    - SoundBox: archived and moved to GitLab
  - Build:
    - stats.js: 120 months
    - roadroller: 61 months
    - source-map-explorer: 49 months
    - html-minifier-terser: 42 months
    - vConsole: 40 months
    - playwright-lighthouse: 33 months
    - Tweakpane: 23 months
    - mitata: 20 months
  - i18n:
    - rosetta: 76 months
  - Testing:
    - BackstopJS: 25 months
    - lost-pixel and PHYRE: archived
  - Note: the rapier.js repo is archived but moved; its npm packages are active.

### Inferences
- **Supply chain is the real risk for this project, not the shipped bundle.**
  - The game ships one vendored dependency (Matter.js) and has a zero-network runtime rule.
  - The exposure is in the Node tooling: Playwright, esbuild, and anything added from this list.
  - Practices:
    - pin exact versions;
    - commit a lockfile;
    - install with `npm ci --ignore-scripts` where the package allows it (esbuild needs its install script to fetch its platform binary, so allow it there);
    - prefer packages with long registry histories and known maintainers. On the data above: Playwright (Microsoft), fast-check (`ndubien`, 212 versions since 2017), pixelmatch (Mapbox), piscina (maintainers include `matteo.collina` and `jasnell`).
- **Star counts in this document are corroborated, not trusted alone.** Every tool recommended here also has large, consistent npm download counts and multi-year registry histories. The StarScout findings mean a high-star, low-download, young repo should be treated as suspect.
- **Never clone and run "game hack", "unblocked games" or re-uploaded engine repos.** The ripped-games and re-uploaded-Phaser results in the Playables search sit in exactly the neighbourhood GitVenom exploited.
- **Licence verdict for the closed-source game.** Every library marked INTEGRATE is MIT (perfect-freehand, Matter.js) or a built-in web API. Nothing GPL, copyleft or NC would ship. GPL editors (Tiled, SoundBox) are safe to use as tools, because their output is not a derivative of the program. That last point is an inference, not a statement either project made in what I read.

### Gaps
- I did not independently verify the Shai-Hulud or GitVenom figures against the original vendor reports; they come from search summaries, and the counts vary between sources.
- I did not audit the code of any red-flag repo; the flags rest on their READMEs and metadata.
- Repository-level download and dependent data for GitHub-only tools (Tiled, LDtk, Ogmo, Box2D C) was not available.
