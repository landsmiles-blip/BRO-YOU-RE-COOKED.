# Certify First, Then Outdraw Save The Pets

Only a short list of free tools genuinely moves "BRO, YOU'RE COOKED." (BYC), because the game already owns the expensive parts: a vendored Matter.js engine, its own solver and census, a pinned Playwright filming harness, and sound synthesised at runtime. Most libraries, plugins and connectors on offer are therefore redundant, oversized, stale or unsafe. What earns a place is one render-only library (perfect-freehand, about 2 KB gzipped), a handful of dev tools that never ship (features of the already-installed Playwright, pixelmatch, fast-check, Node worker threads, lil-gui), HeyGen's Apache-2.0 HyperFrames skills for trailers, and four rationed connectors (vidIQ, Canva, Google Drive, Metricool). The traps are an "official" Playables npm SDK that does not exist, a GitHub neighbourhood of ripped games and an unexplained Phaser re-upload, vendor folklore presented as rules, and an unpinned supply chain that includes the project's own session hook. Playables' rules are strict, and they are confirmed only through consistent summaries of Google's pages, none of which could be opened from this environment. BYC now meets almost all of them: the four certification risks found during research were fixed and committed on 19 October, and their tests pass. Two items are still open: a zero-size viewport at start is unguarded, and the certification checklist does not yet mention the August 2026 duplicate-content and accessibility-tag rules. Access is still early access through an interest form, revenue sharing is a pilot with no published rate, and in-app purchases do not exist, so the honest revenue plan is zero until the game is admitted. Of the user's three links, one is resolved: `UgkxRJM_UQffOTWCkiLTJZUZstzIX0ciqi08` is **Save The Pets** (SUN.STUDIO), a game where you draw a line to shield a dog from bees. It has about **38M plays**, ranks #24 of roughly 1,850 Playables, and gains about 70K plays a day. The other two links could not be resolved, because youtube.com is blocked from this environment and neither ID appears in any index. The rival shelf punishes exactly what BYC's gates and ad rules prevent: ad walls, repetition after about 100 levels, and physics that betray a correct line. But BYC trails it badly on volume (42 levels against hundreds), on a premise a stranger reads in one glance, and on earned cosmetics.

## Playables' rules leave little slack, and BYC now fails only two of them

**What can be confirmed, and how.** Every official rule lives under one Google for Developers tree, plus a player-facing YouTube Help article ([Playables overview](https://developers.google.com/youtube/gaming/playables); [Certification](https://developers.google.com/youtube/gaming/playables/certification/requirements); [YouTube Help](https://support.google.com/youtube/answer/14328604?hl=en)). The tree holds an overview, the SDK reference, a certification hub split into seven requirement pages, two FAQs and a Developer Portal guide.

**None of those pages could be opened from this environment.** Every rule below comes from search-engine summaries of them, kept only where two or more searches agreed and corroborated where possible. The firmest fact is the SDK's address, **https://www.youtube.com/game_api/v1**. Two community npm packages read directly from the registry load it, and so does the repo's own YouTube build ([@trempel/kit](https://registry.npmjs.org/@trempel%2fkit); [@maoyugames/phaser-platform-youtube](https://registry.npmjs.org/@maoyugames%2fphaser-platform-youtube)).

Google last revised the requirements in **August 2026**. It added game accessibility tags on 24 August and a duplicate-content policy on 25 August ([Revision history](https://developers.google.com/youtube/gaming/playables/certification/revisionhistory)).

Some third-party "rules" are stricter than Google's, such as a 5 MB bundle ceiling or a blanket ban on localStorage. These usually come from GameSnacks, a separate Google HTML5 programme whose requirements do ban localStorage. Following them is harmless, but they carry no weight in a certification dispute ([GameSnacks requirements](https://developers.google.com/gamesnacks/developer/requirements); [playables.in](https://playables.in/youtube-playables-requirements/)).

The table below lists the requirements a vanilla-JS game can realistically break. The right-hand column shows where BYC stands after reading the repo directly on 25 October.

| Area | What Google requires | BYC, 25 October |
|---|---|---|
| Load order | SDK MUST load before any game code; `firstFrameReady` before `gameReady`; `gameReady` only once the game is interactive ([Getting started](https://developers.google.com/youtube/gaming/playables/reference/getting_started); [Stability](https://developers.google.com/youtube/gaming/playables/certification/requirements_stability)) | Google's SDK is the first and only external script in `dist/playables/index.html` |
| Saving | "MUST NOT use any other mechanism to save user progress"; MUST await `loadData` before `saveData`; save under 3 MiB, SHOULD be under 500 KiB ([Integration](https://developers.google.com/youtube/gaming/playables/certification/requirements_integration)) | **Fixed and committed 19 Oct**: localStorage only when `IN_PLAYABLES_ENV` is false; nothing saved before a successful load; early play folded in by `absorb()` |
| Size and memory | Initial bundle under 30 MiB (SHOULD be under 15); total under 250 MiB; at most 8,000 files; peak heap under 512 MB; SHOULD be interactive in under 5 s ([Stability](https://developers.google.com/youtube/gaming/playables/certification/requirements_stability)) | 65 KB gzipped page, 66 KB ZIP |
| Screens and input | Every aspect ratio from 9:32 to 32:9; no orientation lock; touch AND mouse for every interaction; SHOULD close dialogs on Esc ([Design](https://developers.google.com/youtube/gaming/playables/certification/requirements_design)) | Nine-ratio conformance gate; Pointer Events; Esc closes the level board (committed 19 Oct) |
| Android start-up | Per the FAQ, the WebView can start at 0×0: run without waiting, listen for `resize`, and set height only when `innerHeight` is non-zero ([Certification FAQ](https://developers.google.com/youtube/gaming/playables/support/certification_faq)) | **Open**: `js/view.js` listens for resize, but a 0×0 start computes a zero scale and a NaN world width, and sets the canvas height to 0 |
| Audio | Per the FAQ, waiting for a tap before starting audio is "the most common audio issue" ([Certification FAQ](https://developers.google.com/youtube/gaming/playables/support/certification_faq)) | **Fixed and committed 19 Oct**: inside Playables, sound starts once the save says whether the player muted it |
| Network and privacy | No external calls, analytics included; no PII; no screens that resemble a login ([Privacy](https://developers.google.com/youtube/gaming/playables/certification/requirements_privacydata)) | The build fails on `fetch`, XHR, WebSocket, `sendBeacon` and `importScripts` |
| Code | No obfuscation (minification is fine); `eval`, WebAssembly or workers MAY get a game declined ([Privacy](https://developers.google.com/youtube/gaming/playables/certification/requirements_privacydata)) | None of those three appear in the bundle |
| Language | MUST support English; MUST NOT use `navigator.language` ([i18n/L10n](https://developers.google.com/youtube/gaming/playables/certification/requirements_i18n_l10n)) | English only; `navigator.language` is not used |
| Money | Ads only through YouTube's functions; interstitials at natural breaks and never as rewards; rewarded ads opt-in, with no user data in the reward ID ([Monetization](https://developers.google.com/youtube/gaming/playables/certification/requirements_monetization)) | First interstitial after level 3, then every third level, never over the ending; one opt-in rewarded skip; `tools/test/ads.js` passes |
| Content | 13+ audience; IP cleared; not "substantially identical" to another Playable (since 25 Aug 2026); accessibility tags (since 24 Aug 2026) ([Trust & Safety](https://developers.google.com/youtube/gaming/playables/certification/requirements_trustsafety)) | **Open**: neither August rule appears in `docs/CERTIFICATION.md` |

**The four breaches research found are fixed and tested.** Research on 18 October found that BYC mirrored every save to localStorage even inside Playables. That is exactly the "other mechanism" Google forbids, and it departs from Google's own sample, which writes localStorage only when `IN_PLAYABLES_ENV` is false. The mirror also let a second YouTube account on a shared device silently inherit the first account's progress. Three further gaps sat alongside it: the sound switch could request a save before the load landed, audio waited for a tap, and nothing closed a dialog on Escape.

All four were fixed in commit 192eb16 on 19 October ([js/platform/sdk.js](/home/user/BRO-YOU-RE-COOKED./js/platform/sdk.js); [js/progress.js](/home/user/BRO-YOU-RE-COOKED./js/progress.js)). The save, ads and Playgama test suites all pass when re-run today.

Three items remain:

1. **Zero-size start.** Add a one-line guard and a browser test that boots at 0×0, for the Android WebView case.
2. **Checklist.** Add the duplicate-content policy and the accessibility tags to `docs/CERTIFICATION.md`.
3. **Hosted SDK Test Suite.** The portal exposes it on its "Verify and test" tab only after a release is created, so in practice it is available only after onboarding ([Developer Portal](https://developers.google.com/youtube/gaming/playables/developer_portal); [Test Suite guide](https://developers.google.com/youtube/gaming/playables/reference/test_suite_guide)).

The rest of the free official toolkit costs nothing: the SDK, an experimental bundle analyzer, and an official Discord linked from the monetization page ([Bundle analyzer](https://developers.google.com/youtube/gaming/playables/samples/bundle_analyzer); [Monetization reference](https://developers.google.com/youtube/gaming/playables/reference/monetization)).

The game also has a separate Playgama build as of 25 October (commit ce576dc). It loads Playgama Bridge from Playgama's CDN instead of bundling it, but from the moving `v2/stable` URL rather than a pinned version. The YouTube build still carries Google's SDK as its only external script, and `tools/test/playgama.js` confirms that nothing is forwarded inside Playables ([js/platform/playgama.js](/home/user/BRO-YOU-RE-COOKED./js/platform/playgama.js)).

**Getting in is slow, and only one route is allowed.** There is no open sign-up. Developers apply through the Playables interest form ("early access"). A Playable is bound to an onboarded YouTube channel, and that channel's manager publishes through the Developer Portal with a designated Partner Manager ([Overview](https://developers.google.com/youtube/gaming/playables); [Developer Portal](https://developers.google.com/youtube/gaming/playables/developer_portal); [Contact](https://developers.google.com/youtube/gaming/playables/support/contact)).

Review is holistic. YouTube weighs "the creator's overall history on YouTube and past Playables performance" and "reserves the right to reject any game". Launches go through "limited access, staged rollouts, or adjustments through automated systems" ([Certification](https://developers.google.com/youtube/gaming/playables/certification/requirements); [FAQ](https://developers.google.com/youtube/gaming/playables/support/faq)). No timeline, acceptance rate or list of eligible developer countries is published.

Publishers that are already onboarded sell speed, not certainty. Playgama quotes 2–4 weeks in exchange for a revenue share. Mediacube describes the direct queue as 3–6 months with "no guarantee of approval". Both are vendor claims ([Playgama wiki](https://wiki.playgama.com/platforms/how-to-publish-your-game-on-youtube-playables); [Mediacube](https://mediacube.io/en/blog/youtube-playables-monetization)).

The duplicate-content rule forbids a second listing of the same game, so **BYC can take one route only**. The new Playgama build makes this concrete: Bridge's own README lists YouTube among its platforms. Any upload to Playgama must therefore keep that build out of Playables while the direct application is pending ([Playgama Bridge README](https://raw.githubusercontent.com/playgama/bridge/main/README.md)).

**The money is thinner than the marketing suggests.** YouTube runs pre-roll ads itself, and developers may add interstitial and rewarded ads. But **revenue sharing is a pilot "with a select number of Playable creators"**, with no published split, payout method or threshold. In-app purchases do not exist: a YouTube partnerships manager wrote on LinkedIn that Google aims to "test IAP solutions during 2027" ([Monetization reference](https://developers.google.com/youtube/gaming/playables/reference/monetization); [mobilegamer.biz](https://mobilegamer.biz/youtube-has-quietly-rolled-out-playables-across-europe/)). Publisher figures, such as $10,000–15,000 for a strong title's first month or about $3,100 a month on average, are self-reported and drawn from portfolios selected for success ([Playgama blog](https://playgama.com/blog/2026/06/04/youtube-playables/); [shattered.io](https://shattered.io/youtube-playables-50-markets-zero-iap-2026/)). Player reach did widen: around 28 September 2026 Playables reached "over 50 markets, now including the Nordics and EU", though no country list exists ([PocketGamer.biz](https://www.pocketgamer.biz/youtube-playables-expands-to-more-than-50-markets-including-the-eu-and-nordics/)).

## Save The Pets, the one link resolved, proves the fantasy and crowds the shelf

**One of the three links is Save The Pets; the other two are unresolved.** `UgkxRJM_UQffOTWCkiLTJZUZstzIX0ciqi08` is Save The Pets, confirmed two independent ways. First, a search engine's index of the page titles it "Save The Pets", with a "Protect the pups!" headline. Second, a GitHub scrape of the Playables catalogue maps that title to exactly this URL and to CDN asset 17110381678225835747 ([Playables page](https://www.youtube.com/playables/UgkxRJM_UQffOTWCkiLTJZUZstzIX0ciqi08); [yt-playables-scraper](https://github.com/CoderandHacker69/yt-playables-scraper/blob/main/youtube_playables_scraped.json)).

**The other two, `UgkxyJVjyxY8OjASFapaoEnL3wyAkLY6JfOj` and `UgkxtMgWRgSpxyGz5yNZD0ma8GC2GjaYIcKS`, remain unresolved.** Neither appears in the 170-game or 456-game catalogue mirrors, and GitHub code search returns nothing ([bubbls mirror](https://github.com/bubbls/youtube-playables/blob/main/all-playables-formatted.json)). Searches restricted to youtube.com, TubeGames and the fan wiki found nothing either. Fresh exact-ID searches on 19 October returned only unrelated pages, and youtube.com refuses connections from this environment.

Fifteen known draw and physics Playables are ruled out because their IDs are known and differ. They include Thief Puzzle, DOP 4, Draw Bridge — Brain Game, Cut The Rope and Dog Escape.

Being absent from every index fits a very recent listing. That makes the early-October additions the likeliest candidates: Love Doge: Draw Puzzle, Happy Glass - Draw to Fill and Draw Bridge: Puzzle Challenge. Doge Rescue - Save The Dog is the likeliest older candidate. **This is a guess, not a finding** ([TubeGames New](https://playables.games/new/)). Opening both links in an ordinary browser settles it in ten seconds.

**The shelf is large, skewed, and heavy with draw puzzles.** TubeGames re-counts public play counters daily. In mid-October 2026 it listed about **1,850 games and 5.38 billion cumulative plays**, and the fan wiki, citing it, put daily volume near 17 million plays in September ([TubeGames](https://playables.games/); [Playables wiki](https://youtube-playables.fandom.com/wiki/Playables)). These are cumulative plays scraped by third parties, not unique players or revenue. Within that catalogue, draw-input puzzles are among the biggest games on the platform:

| Game on Playables | Maker on Playables | Plays (Oct 2026) | What the player draws |
|---|---|---|---|
| Thief Puzzle | TapNation / Famobi | ~90–95M, #1 in Brain & Puzzle | a path for a stretchy arm to the loot |
| DOP 4: Draw One Part | PLAYSTROM / SayGames | ~41M | the missing part of a picture (no physics) |
| **Save The Pets** | **SUN.STUDIO** | **~38M, #24 overall** | a line shielding a dog from bees and hazards |
| Draw Climber | Voodoo | ~28M | legs for a racer |
| Draw Bridge — Brain Game | Playgama | ~21M | roads that carry a car to its goal |
| Doge Rescue - Save The Dog | BAZOOKA LIMITED | ~6.1M | presumed draw-to-save (title only) |
| Save the Dog-Puzzle game | PUZZLE LOFT | ~3.5M | presumed draw-to-save (title only) |
| Happy Glass - Draw to Fill; Love Doge: Draw Puzzle; Draw Bridge: Puzzle Challenge | not shown | 5K–13K (added 6–7 Oct 2026) | a glass to fill; unknown; bridges |

Sources: [TubeGames Best](https://playables.games/best/); [TubeGames Brain & Puzzle](https://playables.games/genres/brain-puzzle/); [Playables wiki](https://youtube-playables.fandom.com/wiki/Playables); [catalogue mirror](https://github.com/bubbls/youtube-playables/blob/main/all-playables-formatted.json).

The genre's best-known originals were not found on Playables: Save the Doge, Love Balls and Lion Studios' Happy Glass. One publisher, Mediacube, ranks "Draw & Escape Puzzle" as the top new mechanic of summer 2026. That is a single vendor source, and the same article contains an obvious arithmetic error ([Mediacube](https://mediacube.io/en/blog/youtube-playables-game-mechanics)).

**Save The Pets is Save the Doge's formula with Bravestars' content pipeline behind it.** The Playables listing belongs to SUN.STUDIO. The mobile original is Bravestars' (`com.bravestars.savethedog.drawgame`), so both names in circulation are correct, for different builds ([SUN.STUDIO Playables channel](https://www.youtube.com/@SUN.STUDIOPlayables); [Google Play](https://play.google.com/store/apps/details?id=com.bravestars.savethedog.drawgame)).

The rules are on the store listing: "Touch and drag to draw a protective line. Keep the dog safe for at least 10 seconds. The shorter your line, the more stars you earn." Lava, water, spikes and bombs join the bees.

On mobile it claims "unlimited levels" and **50M+ Android downloads at 4.2–4.3 stars**, and fan walkthroughs reach level 280. Reviewers complain about four things:

- **repeated levels** after roughly level 100–200;
- **a hint behind an ad** around level 43 that "didn't help";
- **a progress bug** at level 300;
- **ad load**, above all.

An iOS build also ran a Halloween event with vampire and mummy costumes ([App Store](https://apps.apple.com/us/app/save-the-pets-save-dog/id6443538544); [walkthrough playlist](https://www.youtube.com/playlist?list=PL7buRgWZeZ2nDAELrplbfYgy0LAbnycVY)).

Its momentum on Playables is real. It went from 36M plays at #25 on 20 September to 38M at #24 on 18 October, about **70K plays a day** if the two trackers count the same way ([Playables wiki](https://youtube-playables.fandom.com/wiki/Playables); [TubeGames Best](https://playables.games/best/)). What its Playables build actually contains is unknown: level count, ad cadence, hints, skips, a daily mode or events. No source describes it, and the page cannot be opened from here.

**Players reward and punish the same things across all four rivals.** Across the four mobile originals, players punish four things, in roughly this order:

1. an ad after every level ("1.5 seconds to solve, 2 minutes of ads", said of Save the Doge);
2. progress walls that only an ad can open;
3. repetition from about the hundredth level;
4. failures that feel like the game's fault, such as Save the Doge's "buggy bees that clip through walls" or DOP 4 rejecting "a slightly wonky shape".

Sources: [Save the Doge reviews](https://play.google.com/store/apps/details?id=com.miracle.savethedoge.an&hl=en_US); [DOP 4 reviews](https://play.google.com/store/apps/details?id=com.playstrom.dop4&hl=en).

Players praise cuteness, a relaxed pace, a generous hint system and a visible difficulty ramp. TapNation reports two numbers for Thief Puzzle. A level-completion meter lifted completion by **15%**, and a shop paid in rewarded videos lifted ad engagement by **21%**. It also ran a daily rewards calendar and automatic level generation. These figures are self-reported and partly drawn from its general blog ([TapNation case study](https://www.tap-nation.io/blog/thief-puzzle-a-case-study-of-a-hyper-casual-puzzle-mobile-game/)). Critics describe most Playables as the games "that other apps on our phones advertise" ([Tom's Guide](https://www.tomsguide.com/computing/social-media/youtube-gets-into-gaming-with-playables-75-games-you-can-try-right-now)).

**BYC leads where reviewers complain, and trails where the shelf competes.** Against that shelf, BYC already leads on everything reviewers punish ([CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md)):

- no two levels ask the same decision;
- no level is sold;
- an interstitial lands only every third level;
- the one rewarded ad is an opt-in skip, granted anyway when no ad loads;
- fairness gates and bee tests exist precisely so a correct line cannot lose;
- the death cam explains every failure.

It trails in five places:

- **volume**: 42 shipped levels, against "hundreds" or "unlimited";
- **a premise readable in one glance**: a cute victim, a visible swarm, a ten-second clock;
- **earned cosmetics and seasonal events**;
- **a visible progress meter**;
- **search words**: every rival title contains "Save" or "Draw", and "BRO, YOU'RE COOKED." contains neither.

Playables bans IAP and off-platform monetization, so no rival can sell skins, hints or an ad-free mode there. Anything they offer must be earned or paid for with a YouTube rewarded ad, which levels the field for an earned star shop.

The overlap that matters most is new. BYC now has a dog and a bee chapter, which puts its closest frames near Save The Pets, on the same shelf the duplicate-content rule polices. The core decisions differ. Milo must walk out alive rather than sit out ten seconds, and the game also spans air, balloons, TNT and brittle floors. But "substantially identical" is undefined.

When the two unresolved links are opened, play each game for ten minutes and record:

- the premise on the first frame;
- the time to the first failure;
- the level count and how progress is shown;
- the ad cadence;
- any hint or skip offers;
- any daily mode or event;
- whether a failure is explained.

This research could not reach any of those facts for any rival's Playables build.

## The engine stays, and one 2 KB library plus a few dev tools earn a place

**Matter.js stays.** It is in maintenance mode: **0.20.0, from June 2024, is still the latest release, with one npm maintainer and 279 open issues**, though the repository was pushed to in September 2026 ([npm](https://registry.npmjs.org/matter-js); [GitHub](https://github.com/liabru/matter-js)). That matters less than it sounds. The game ships a frozen copy, byte-identical to the npm 0.20.0 build at 25.8 KB gzipped. Every measured number in the project rests on that exact behaviour: breadth, tries, star thresholds, daily certificates and the `MAX_SPEED` lock.

Every alternative costs more than it buys:

- **Planck.js** is active (1.5.1, October 2026) but **2.1x Matter's size**. As pure JavaScript it is no more deterministic across browsers.
- **Rapier's** cross-platform deterministic build ships a **919 KB gzipped wasm, 14x the size of the whole game**.
- **Box2D v3, through box2d3-wasm,** adds continuous collision detection, which could lift the 900 u/s tunnelling lock. It costs about 179 KB gzipped, has one maintainer and 576 weekly downloads, and its threaded build needs cross-origin isolation that a YouTube iframe probably cannot grant.

Sources: [Planck](https://registry.npmjs.org/planck); [Rapier deterministic](https://registry.npmjs.org/@dimforge/rapier2d-deterministic); [box2d3-wasm](https://registry.npmjs.org/box2d3-wasm); [Box2D](https://github.com/erincatto/box2d).

Keep the vendored engine, and revisit Box2D only if a concrete blocker appears. poly-decomp, Matter's opt-in concave decomposer, also stays out, because closed strokes are hollow rings by design.

**Whether physics matches across browsers is untested.** It is the one physics question worth testing. MDN warns that many `Math` functions have "implementation-dependent" precision, so different browsers "can give a different result" ([MDN Math](https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/javascript/reference/global_objects/math/index.md)). The solver and the films both run on V8, but an iPhone runs JavaScriptCore, and nobody has measured whether a daily certificate that wins in V8 still wins there.

The notes call replaying certificates in Playwright's WebKit and Firefox builds a zero-cost test, but it is not zero-cost here. **Only Chromium build 1194 is preinstalled in this container**, and Playwright's browser download host is not on the cloud environment's default allowlist ([Cloud environments](https://code.claude.com/docs/en/cloud-environments)). Run the replay on a local machine, or better, on a real iPhone.

**Most testing gains are already installed.** Playwright's **clock API** has existed since 1.45, so the pinned 1.56.1 has it. It controls `requestAnimationFrame` and `performance.now`, which would make every filmstrip frame reproducible regardless of machine load ([Playwright clock](https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/clock.md)). The Chrome DevTools Protocol's **vision-deficiency emulation** (deuteranopia, protanopia, achromatopsia and others) runs on the existing Chromium. It would let `npm run film` show what a colour-blind player sees of red hazards and green goals ([Emulation.pdl](https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/pdl/domains/Emulation.pdl)).

Four small additions fill real gaps:

- **pixelmatch** (ISC, 8.0.0, 6.25M weekly downloads) to diff frozen frames and contact sheets against approved baselines without adopting Playwright Test ([pixelmatch](https://registry.npmjs.org/pixelmatch)).
- **fast-check** (MIT, 4.10.2) for property tests with shrinking, on invariants such as "what they drew is what gets drawn" and "an over-budget stroke is rejected, not truncated" ([fast-check](https://registry.npmjs.org/fast-check)).
- **Node's built-in `worker_threads`**, to spread the single-threaded solver, census and bake sweeps across the machine's four cores. Bring in piscina only if pool management grows ([piscina](https://registry.npmjs.org/piscina)).
- **lil-gui** (7.9 KB gzipped) as a live-tuning panel in a debug build that never reaches the ZIP ([lil-gui](https://registry.npmjs.org/lil-gui)).

Pixel baselines complement reading the films; they never replace it.

On the build side:

- **esbuild** (0.28.2, MIT): keep it, but pin it exactly and add its `metafile` analysis ([esbuild](https://registry.npmjs.org/esbuild)).
- **Gzip budget**: assert it with `node:zlib` instead of adding size-limit.
- **terser**: skip it. Measured on the shipped script, it saves only **1.7 KB gzipped** ([terser](https://registry.npmjs.org/terser)).
- **Eruda** (an on-phone console): only in a locally bundled debug build.
- **Lighthouse**: only as an occasional page-load audit.

**One art library earns a trial, and art, audio and language need nothing else.** **perfect-freehand** is the one shipping library worth trying. It is MIT-licensed, last released in February 2026, and about **2 KB gzipped**. It turns stroke points into a tapered, variable-width ink outline, and its output depends only on its inputs. The player's line could therefore look hand-inked while the physics keeps the simplified polyline ([perfect-freehand](https://registry.npmjs.org/perfect-freehand)). It ships only if it passes `tools/test/shapes.js` and the death cam draws the same line the player drew.

Rough.js is the cautionary contrast. Its sketchiness comes from randomness, which is exactly the "vibrating line" bug this project shipped once. It adds 8.9 KB gzipped (+14%) and has not had a release in 35 months ([roughjs](https://registry.npmjs.org/roughjs)). GSAP is free of charge, but it uses a custom, non-OSI licence, weighs 28 KB gzipped, and runs its own ticker that would have to obey `onPause` ([gsap](https://registry.npmjs.org/gsap)). Tween and particle libraries do what ten lines already do, driven by the fixed 120 Hz clock and the existing seeded mulberry32 generator.

Audio needs no library. The game synthesises every sound, and since it is played muted inside YouTube, sound must never carry information. If the sound set is ever rewritten, ZzFXMicro (MIT, 1.9 KB gzipped) is the right size. Any recorded asset must be CC0, and never one of Freesound's CC BY-NC clips ([ZzFX](https://github.com/KilledByAPixel/ZzFX); [Freesound](https://en.wikipedia.org/wiki/Freesound)).

Two zero-byte browser features complete the list. The `prefers-reduced-motion` media query can damp the screen shake and the close-call slow-motion ([MDN prefers-reduced-motion](https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/reference/at-rules/@media/prefers-reduced-motion/index.md)). Native `Intl` plus a plain string table covers localisation if it is ever wanted, although English alone satisfies certification.

**Level editors fail this project structurally, not technically.** Tiled fits the data model best, with ellipses, polygons, rotation and custom properties. It released as recently as May 2026, and its GPL covers only the editor ([Tiled](https://github.com/mapeditor/tiled)). But no editor can see breadth, tension, the A14 test or the frozen frame, and a converter is one more place for the picture to lie.

**Two repositories are worth reading, not adopting.** **google/web-game-samples** (Google, Apache-2.0) and **phaserjs/template-youtube-playables** (Phaser Studio, MIT) are the genuinely useful repositories. The Phaser template's sample game "demonstrates every available feature of the YouTube Playables SDK" ([google/web-game-samples](https://github.com/google/web-game-samples); [Phaser template](https://github.com/phaserjs/template-youtube-playables)). Both are worth diffing against `js/platform/sdk.js`.

**No off-the-shelf solver exists for draw-a-line physics puzzles.** Ropossum's Cut the Rope generator reached the project's own finding, that generation without a solvability check yields unsolvable levels. PHYRE is archived, so both are methods to learn from, not code to reuse ([Ropossum](https://ojs.aaai.org/index.php/AIIDE/article/view/12690); [PHYRE](https://github.com/facebookresearch/phyre)).

## Claude's catalog yields one real install, and every connector is rationed

**What "install" means in a cloud session.** How a tool reaches a cloud session decides this. A committed `.claude/skills/` folder and a committed `.mcp.json` carry into cloud sessions, and so do skills and connectors enabled on claude.ai. **Plugins declared in `.claude/settings.json` do not load, and `/plugin` is unavailable** ([Cloud environments](https://code.claude.com/docs/en/cloud-environments); [Install plugins](https://code.claude.com/docs/en/discover-plugins)). Installing a plugin here therefore means vendoring its skills at a pinned commit. Every committed MCP server is a standing risk, because cloud sessions start a project's `.mcp.json` servers **without an approval prompt** ([MCP docs](https://code.claude.com/docs/en/mcp)). The repo has neither a `.claude/skills/` folder nor an `.mcp.json` today, so the first addition sets the precedent.

Anthropic's catalogs are real and active. They comprise `anthropics/skills`, the marketplace inside `anthropics/claude-code`, and `anthropics/claude-plugins-official` with 315 plugins. The official catalog contains no Phaser, Pixi, three.js or Matter.js plugin ([claude-plugins-official manifest](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json); [anthropics/skills](https://github.com/anthropics/skills)).

**HyperFrames is the one install worth making.** HeyGen's open-source video framework is Apache-2.0, "with no per-render fees or commercial-use thresholds". It renders HTML compositions by seeking each frame in headless Chrome and encoding with FFmpeg, ships 21 skills, and appears in Anthropic's official marketplace with HeyGen named as author ([HyperFrames README](https://raw.githubusercontent.com/heygen-com/hyperframes/main/README.md); [GitHub](https://github.com/heygen-com/hyperframes)). Its requirements, Node 22+ and FFmpeg, are met here: Node 22.22.0 and FFmpeg 6.1.1. The hosted HyperFrames connector is different: it disables `compose` and `render_video` from Claude Code, and its cloud render is paid. So skip the connector and use the local skills.

No end-to-end render has been tried yet, and its Puppeteer may try to download its own Chrome. `npx skills add` can lag `main` by hours, so review each skill's `allowed-tools` and commit the skills at a recorded commit. Remotion does the same job but requires a company licence above three employees ([Remotion licence](https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md)).

**Three Claude-side tools are occasional uses:**

- **frontend-design** (Anthropic): copy it into `.claude/skills/` only when the public web page or press kit is built.
- **skill-creator**: already enabled. It can package the project's own procedures, such as film-and-read, as committed skills.
- **Chrome DevTools MCP** (Apache-2.0): add it temporarily, pinned and never committed, for a frame-rate or memory investigation ([Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)).

**Playgama's MCP server is an option only with the owner's go-ahead.** Since 25 October one more vendor server is on the table. Playgama's own README documents an official MCP server for Claude Code at `https://developer.playgama.com/api/mcp`. It can upload builds and covers and publish sandbox links, and the same README confirms that `@playgama/bridge` is LGPL-3.0 ([Playgama Bridge README](https://raw.githubusercontent.com/playgama/bridge/main/README.md)). Because it acts on the owner's account, add it only on the owner's go-ahead, per user, and never commit it to `.mcp.json`.

**Most of the rest of the catalog is a skip:**

- **Microsoft's Playwright MCP, plugin and CLI** duplicate the pinned harness. At `@latest` they would expect a newer Chromium than build 1194 ([Playwright MCP README](https://raw.githubusercontent.com/microsoft/playwright-mcp/main/README.md)).
- **`webapp-testing`** is Python.
- **canvas-design, algorithmic-art and theme-factory** would fight a code-drawn look whose best marketing frames are real game frames.
- **superpowers** duplicates CLAUDE.md's methodology.
- **The Unity, Unreal and Godot entries** do not apply.

**Only four of the ten connected connectors do real work, and each has a ceiling:**

- **vidIQ** is the only route to YouTube's own data. Each research call costs 5 credits against **150 renewable credits a cycle**, about 30 calls a month. The balance ran dry on 18 October and was scheduled to reset on 24 October. Never call its generators (22 credits a thumbnail, 25 a music track) or its account-acting tools ([vidIQ connector balance check](https://vidiq.com/)).
- **Canva** handles thumbnails, the channel banner and social cards built around real frames. Its licence says Canva elements, including AI images, "cannot be used as part of a trademark, logo, or service mark", so the logo must be made elsewhere ([Canva Content License Agreement](https://www.canva.com/policies/content-license-agreement/)).
- **Metricool's** free plan gives one brand and 20 published posts a month, and it can do nothing until a social network is connected ([Metricool help](https://help.metricool.com/main-differences-between-free-and-paid-plans-bl0v9)).
- **Google Drive** distributes playtest and press kits.

The rest are skips:

- **Figma** allows about six MCP tool calls a month on a Starter plan with a View seat ([Figma MCP plans](https://developers.figma.com/docs/figma-mcp-server/plans-access-and-permissions/)).
- **Gmail** exposes only `delete_draft` in this session.
- **Viberate** is music-industry analytics, with purchase tools that must never be called.
- **Unsplash** photos clash with code-drawn art; use it for marketing mood boards only.
- **The remove-ai-marks skill** should stay unused on marketing media, because YouTube asks channel owners to declare realistic synthetic content.

**The growth funnel has an unmeasured middle.** The documented ways into a Playable are the Home shelf, the Explore → Playables destination, Search, the You tab, shared links and live streams. **The Shorts feed is not an official entry point** ([YouTube Help](https://support.google.com/youtube/answer/14328604); [YouTube Blog](https://blog.youtube/news-and-events/live-updates/)).

Draw-to-save is still a proven Shorts format. The genre's top Short, a dog threatened by lava, a crocodile and bees, has **130M views**. In October 2026 a channel with 571 subscribers passed **1M views in about eight days** with a 20-second clip framed as a challenge ([YesGamerz Short](https://www.youtube.com/shorts/ypMF_KSDHIw); [Aura Plays Short](https://www.youtube.com/shorts/9s0t-gf10q0)). "Draw to save the dog" draws about 3.8K monthly YouTube searches ([vidIQ keyword research](https://vidiq.com/)). But those examples were picked by "most viewed" and "outlier" filters. When Chris Zukowski traced viral moments back to their games, he usually found about **twenty wishlists** behind each one ([Freaking Cool Indies](https://freakingcoolindies.com/chris-z-teaches-indie-devs-to-build-an-audience-heres-how-he-built-his/)). No public data links Shorts views to Playables plays.

The cheap, honest pipeline uses what is already here:

1. **Capture** with Playwright's `recordVideo` on a vertical viewport.
2. **Edit** with FFmpeg, and make title and end cards with HyperFrames.
3. **Sound**: use the game's own synthesised audio. Standard YouTube Audio Library tracks are reportedly licensed for YouTube only ([Lickd](https://lickd.co/youtube-audio-library/)).
4. **Thumbnails** in Canva.
5. **Schedule drafts** in Metricool, posted from the channel that will own the Playable.

The solver's measured breadth also gives BYC a hook no rival can honestly use: "only 3 lines in 100 save him here" is literally true.

Web portals are a second channel, with one trap:

- **itch.io**: no conflict with Playables. The median game gets **590 lifetime browser plays** ([How To Market A Game](https://howtomarketagame.com/2025/05/12/benchmark-itch-io-traffic/)).
- **CrazyGames**: non-exclusive by default, but pays nothing during Basic Launch ([CrazyGames terms](https://files.crazygames.com/documents/developer_terms_20210211.pdf)).
- **Poki**: its preferred **Web Exclusive deal explicitly treats YouTube Playables as a conflicting web platform** ([Poki deals](https://sdk.poki.com/deals.html)).

## No official npm SDK exists, and the real danger is the supply chain

**Any "official" Playables npm package is fake.** The cleanest test of a Playables tool is that **Google publishes no npm package at all**. The SDK is a script on youtube.com. On 18 October, twelve plausible names were unregistered on npm, among them `ytgame`, `@types/ytgame`, `youtube-playables-sdk`, `@google/ytgame` and `@youtube/playables` ([npm search](https://registry.npmjs.org/-/v1/search?text=ytgame&size=20)). Anything claiming to be the official package is therefore fake by construction.

What exists is community code:

- **`@maoyugames/phaser-platform-youtube`**: a release candidate with four weekly downloads and no repository listed.
- **`@trempel/kit`**: created on 5 October 2026.
- **`ytgame-object-system`**: an unrelated item system that only shares the name.
- **`@types/youtube`**: typings for the old IFrame player API, with nothing to do with Playables ([@types/youtube](https://registry.npmjs.org/@types%2fyoutube)).

A scan of the two adapters found only YouTube, Google and their own domains. Their code itself was not audited, and an SDK adapter from an unknown publisher is exactly where a supply-chain attack would sit.

**The GitHub results for "youtube playables" are mostly a warning:**

- **`bubbls/youtube-playables`** (35 stars, 76 forks) says outright that "all these games are taken from YouTube Playables".
- **`phexus23/phexus23.github.io`** advertises "reverse engineering gate kept games".
- **`kakao74/phaser`** is **not a fork**, yet it carries Phaser's README and claims to be Phaser 3.87.0. That is the shape of the re-upload campaigns that spread malware.

Sources: [bubbls](https://github.com/bubbls/youtube-playables); [phexus23](https://github.com/phexus23/phexus23.github.io); [kakao74/phaser](https://github.com/kakao74/phaser).

No malicious code was found, because none was run, and that is the right practice. Catalogue mirrors are fine to read as data (this research used two of them) but never to execute. They also show that shipped Playables bundles get scraped and re-hosted, so treat BYC's code as public from the day it ships. The legitimate Playables repositories are few, and all come from known organisations: Google's samples, Phaser Studio's template, and the Scirra and Defold plugins.

**Stars are a weak trust signal, and both npm and the agent ecosystem have been attacked.**

- **Fake stars.** The StarScout study, accepted to ICSE 2026, found about **6 million suspected fake GitHub stars**, mostly promoting short-lived phishing and malware repositories ([arXiv](https://arxiv.org/abs/2412.13459)).
- **Fake game-tool repositories.** Kaspersky's GitVenom report documented more than 200 of them ([The Hacker News](https://thehackernews.com/2025/02/gitvenom-malware-steals-456k-in-bitcoin.html)).
- **npm worm.** The registry carried the **Shai-Hulud** worm in September and November 2025, spread through malicious `postinstall` scripts ([Invicti](https://www.invicti.com/blog/web-security/shai-hulud-2-worm-supply-chain-attack-on-npm-dependencies)).
- **Agent ecosystem.** A typosquatted postmark-mcp server BCC'd every email it sent. 341 malicious OpenClaw skills used fake "YouTube utilities" as bait. Three now-patched Claude Code flaws let malicious project files run code or approve MCP servers before the trust dialog appeared ([The Hacker News: postmark-mcp](https://thehackernews.com/2025/09/first-malicious-mcp-server-found.html); [The Hacker News: ClawHub](https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html); [Check Point Research](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/)).

Anthropic's documentation says an installed plugin "can execute arbitrary code on your machine with your user privileges" ([Plugin security](https://code.claude.com/docs/en/plugins/security)).

**BYC's real exposure is its Node tooling, and it has a live gap.** The shipped bundle is nearly immune: it has one vendored dependency and a build gate that bans network calls. The exposure is the Node tooling. **`.claude/hooks/session-start.sh` installs `esbuild` with no version at all, and `playwright-core@1.56` as a version range. Install scripts are enabled and there is no lockfile.** Today these resolve to 0.28.2 and 1.56.1. Pinning both exactly closes the gap. The new Playgama build's moving `v2/stable` CDN URL is the same kind of exposure, on a channel where a remote script is permitted.

**The other traps are informational:**

- **playables.in**, a guide site with an unidentified operator, presents recommendations as rules. For example, it says "strictly below 5 MB" where Google's MUST is 30 MiB ([playables.in](https://playables.in/youtube-playables-requirements/)).
- **Mediacube's "McPlay — YouTube Playables certification portal"** is a publisher's own portal. YouTube certifies every game itself ([McPlay](https://mcplay.mediacube.io/)).
- **Vendor posts** frame Playables around YouTube-wide user numbers, which are not Playables players ([shattered.io](https://shattered.io/youtube-playables-50-markets-zero-iap-2026/)).
- **Revenue-per-play formulas** are invented, because no official rate exists. The "YouTube money formula" this project already rejected labelled a daily figure as monthly, a 30x error ([CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md)).
- **The Playables Builder**, Google's Gemini 3 game maker, is widely misreported as an "open beta". It is a closed beta ([YouTube Gaming on X](https://x.com/YouTubeGaming/status/2000989303086649637)).

**Growth has its own scams.** YouTube's fake-engagement policy bans bought views, subscribers and "sub4sub". It warns of "content removal or a channel takedown, whether it's an action taken by you or someone you've hired", and a Playable is bound to its channel ([YouTube Help: Fake engagement](https://support.google.com/youtube/answer/3399767)). In the US, the FTC rule that took effect on 21 October 2024 bans knowingly buying fake indicators of social-media influence for commercial use, at up to $51,744 per violation ([Manatt](https://manatt.com/insights/newsletters/client-alert/ftc-issues-final-rule-banning-fake-reviews-and-tes)). Indie developers have long been targeted with fake-creator outreach ([bit-tech](https://www.bit-tech.net/news/gaming/indie-dev-scammed-by-fake-youtubers/1)). Bought traffic would also destroy the only measurement the YouTube build has, because that build sends no analytics.

## Conclusion

The pattern across all five questions is that BYC's measurement stack is both its edge on the rival shelf and the reason most free tools are redundant. The libraries worth adding are the ones that make the existing films reproducible, true to colour-blind players, and faster to produce. The most consequential tool decision in the repo is not an addition but a pin. Certification has moved from "probable violations" to two small open items: the 0×0 guard and the August rules in the checklist. That leaves the cheapest unresolved task the most important one: opening two links in an ordinary browser, a ten-second job that a whole research pass could not do from inside this environment.

Save The Pets exposes a tension the project has not yet faced. Off-platform, dog-and-bee imagery is the genre's proven hook. On the Playables shelf, the same imagery is BYC's closest resemblance to a 38M-play rival, judged by players scrolling past and by an undefined "substantially identical" test. The way through is to split the roles. Use the dog and bee clips as advertising, but make the listing's thumbnail and first frame show what no bee game can: air, balloons, TNT, and a line that becomes a bridge. And since review weighs "past Playables performance" and launches are staged, judge the first release by its first ten minutes, not by its level count.

## The vetted list: what goes in, what stays out, and what is still unconfirmed

Every item below is free. Every "integrate" verdict assumes exact version pins and that the project's existing gates still pass.

**Ships in the game**

| Item | Verdict | Condition | Confidence |
|---|---|---|---|
| Matter.js 0.20.0 (vendored) | Keep; never upgrade or migrate | Every measurement depends on its exact behaviour | High |
| perfect-freehand 1.2.3 | Integrate as a render-only trial | Passes `tools/test/shapes.js`; the death cam draws the same line; the films are read | Medium |
| `prefers-reduced-motion` | Integrate (0 bytes) | Damps screen shake and the close-call slow-motion | Medium |
| Native `Intl` and a string table | Only if localising (0 bytes) | English alone meets certification | Medium |

**Build and certify (never ships)**

| Item | Verdict | Condition | Confidence |
|---|---|---|---|
| Save, audio and Esc fixes (commit 192eb16) | Done | save, ads and Playgama suites pass (re-run 25 Oct) | High |
| Zero-size viewport guard and a test that boots at 0×0 | Add | Uses the existing playwright-core | Medium |
| Duplicate-content and accessibility entries in `docs/CERTIFICATION.md` | Add | Re-read the live pages first | High |
| Official Playables docs, hosted Test Suite, Discord | Use | Test Suite only after onboarding | High (docs); unconfirmed (Test Suite) |
| Playwright clock API; CDP vision-deficiency emulation | Use (already installed) | Chromium 1194 | High |
| Playwright WebKit/Firefox certificate replay | Run off this machine | Browsers not installed here; download host not allowlisted | High that it is needed; untested |
| pixelmatch 8.0.0; fast-check 4.10.2 | Add, pinned | Pixel baselines from one machine only | High |
| `node:worker_threads` (piscina 5.3.2 later) | Add | Merge results in stroke order | Medium |
| lil-gui 0.21.0; Eruda 3.4.3 | Debug build only | Never in the ZIP; Eruda never from a CDN | Medium |
| esbuild 0.28.2 with `metafile` and a `node:zlib` budget | Keep and pin exactly | Fix the unpinned session hook; commit a lockfile | High |
| Lighthouse 13.5.0 | Occasional | Measures page load only | Medium |
| google/web-game-samples; phaserjs/template-youtube-playables | Read, do not adopt | Cross-check the SDK lifecycle | High |

**Claude skills, MCP, connectors and channels**

| Item | Verdict | Condition | Confidence |
|---|---|---|---|
| HyperFrames skills (heygen-com/hyperframes) | Install | Vendor into `.claude/skills/` at a recorded commit; review `allowed-tools`; first render untested | Medium-high |
| FFmpeg 6.1.1 with Playwright `recordVideo` | Use (already present) | Vertical viewport | High |
| frontend-design; skill-creator | Occasional | Web page, press kit and project procedures only | Medium |
| Chrome DevTools MCP | Occasional | Temporary and pinned; never committed | Medium |
| Playgama MCP server (`developer.playgama.com/api/mcp`) | Only on the owner's go-ahead | Can upload and publish; per user, never committed | Medium |
| vidIQ | Occasional | Research only; at most 30 calls a cycle; no generation or account tools | High |
| Canva | Occasional | Listing and social art; never the logo | Medium-high |
| Metricool | After a network is connected | Drafts only; at most 20 posts a month | High |
| Google Drive; Calendar | Occasional | Share or book only when asked | High |
| Unsplash | Marketing mood boards only | No in-game use | Medium-high |
| YouTube Data API script | Only if vidIQ runs short | The user's own key as a secret; 10,000 units a day | Medium |
| Playgama build (`dist/byc-playgama.zip`) | Keep as a separate build | Bridge (LGPL-3.0) loaded, not bundled; keep it out of Playables while the direct application stands; pin a versioned URL if one exists | Medium |
| itch.io; CrazyGames non-exclusive | Second channel | Decline CrazyGames' exclusivity bonus until checked against Playables | Medium |

**Will not integrate**

| Group | Items | Why not |
|---|---|---|
| Physics | Planck.js, Rapier, box2d3-wasm, Phaser Box2D, p2, p2-es, box2d-wasm, box2d.js, @box2d/core, poly-decomp | 2–14x the game's size plus a full re-measurement, or abandoned; poly-decomp would change every closed stroke |
| Level editors | Tiled, LDtk, Ogmo, Tweakpane | Bypass the measure-and-film loop, or stale |
| Testing | odiff, BackstopJS, reg-suit, lost-pixel, looks-same, seedrandom, pure-rand, tinypool, mitata, tinybench; PHYRE and Science Birds as code | Duplicates, archived, native binaries, or unlicensed |
| Art and motion | Rough.js, GSAP, anime.js, tween.js, Proton, simplex-noise, eases, simplify-js, bezier-easing | Random jitter, a non-OSI licence, their own tickers, or 5–41 KB for what ten lines do |
| Audio | ZzFX (unless audio is rewritten), jsfxr, Tone.js, howler, ZzFXM, SoundBox, BeepBox, recorded sound packs | Sound is synthesised by design; never CC BY-NC |
| Build | terser, Roadroller, html-minifier-terser, source-map-explorer, size-limit, vConsole, stats.js, playwright-lighthouse | A 1.7 KB saving, built on `eval`, or stale |
| i18n and a11y | rosetta, i18next, typesafe-i18n, intl-messageformat, axe-core | Too big, stale, tied to TypeScript, or blind to canvas content |
| Other engines | Scirra and Defold plugins, LittleJS, kontra, Godot/Unity/Unreal MCPs | Built for different engines |
| Claude catalog | Playwright MCP/plugin/CLI, webapp-testing, canvas-design, algorithmic-art, slack-gif-creator, theme-factory, brand-guidelines, superpowers, context7, playground, claude-code-setup, security-guidance, claude-security, figma and canva plugins, Remotion, runway-api, adobe-for-creativity, superdesign, cloudinary, postiz, ElevenLabs, Hugging Face MCP, Google Analytics MCP, community YouTube MCPs, TinyFish | Redundant, paid, behind a licence threshold, unvetted, or needing runtime network access |
| Connectors | HyperFrames hosted connector, Figma, Gmail, Viberate; the remove-ai-marks skill | Disabled here, about 6 calls a month, delete-only, irrelevant, or working against disclosure |
| Channels | Poki Web Exclusive, GameDistribution | Poki's deal conflicts with Playables; GameDistribution pays the developer about 33% and makes mid-roll ads mandatory ([BountyBoard](https://www.bountyboard.gg/blog/how-to-monetize-an-html5-game)) |

**Traps: never touch**

| Trap | Why |
|---|---|
| Any "official Playables SDK" package on npm | Google publishes none |
| @maoyugames/phaser-platform-youtube, @trempel/kit, ytgame-object-system | Unvetted adapters or name-alikes |
| bubbls/youtube-playables, phexus23.github.io | Ripped Playables builds (read as data only) |
| kakao74/phaser | A non-fork re-upload of Phaser |
| playables.in "rules", McPlay "certification", vendor earnings and audience figures, revenue formulas | Folklore, vendor interests, or arithmetic errors |
| Bought views, subscribers or upvotes; sub4sub; "guaranteed views"; paid promotion DMs | Risk of channel takedown; the FTC rule |
| Unpinned installs, `@latest` MCP servers in `.mcp.json`, unreviewed skills | Supply-chain risk |

**What can and cannot be confirmed from here**

| Question | Status, 25 October | What settles it |
|---|---|---|
| Link `UgkxRJM_UQffOTWCkiLTJZUZstzIX0ciqi08` | Confirmed: Save The Pets (SUN.STUDIO) | — |
| Links `UgkxyJVjyxY8OjASFapaoEnL3wyAkLY6JfOj` and `UgkxtMgWRgSpxyGz5yNZD0ma8GC2GjaYIcKS` | Unresolved | Open them in a browser and record title, publisher and plays |
| Playables MUSTs and SHOULDs | High confidence from consistent summaries; no page opened directly | Re-read the live pages before submission |
| BYC's certification fixes | Committed 19 Oct; save, ads and Playgama suites pass | — |
| Zero-size viewport behaviour | Untested | A browser test that boots at 0×0 |
| Hosted Test Suite before onboarding | Unknown | Portal access |
| Revenue split, payout method, pilot criteria | Unpublished | Partner Manager |
| What rivals' Playables builds contain | Unknown; this analysis rests on the mobile originals | Ten minutes of play per game |
| View counts and comments on rival videos | vidIQ credits were due to reset on 24 Oct | Rationed research calls |
| Shorts-to-Playables conversion | Unknown | BYC's own numbers after launch |
| Matter.js drift between V8 and JavaScriptCore | Untested | Replay certificates on WebKit or a real iPhone |
| HyperFrames end-to-end render here | Untested | The first install |
| Whether Playgama's distribution of the Playgama build would reach Playables | Unknown | The Playgama contract and cabinet settings |
| CrazyGames' exclusivity bonus versus Playables | Unknown | The live terms |
| First-hand reports from independent developers (Reddit) | Not searchable from here | A manual search |
