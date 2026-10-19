# YouTube Playables for a small independent developer (as of 2026-10-19)

*How these notes were made: developers.google.com, support.google.com, youtube.com and every third-party site could not be reached from this environment. WebFetch and curl both failed with DNS or proxy refusals when tested on 2026-10-18. So every finding about an official page comes from WebSearch summaries of that page, run on 2026-10-18/19, and was not read from the page itself. Quoted official wording is as the search summaries reproduced it. Only registry.npmjs.org (npm tarballs) and this repository were read directly. Tags: **[H]** = official page, consistent across two or more independent searches or corroborated elsewhere. **[M]** = official page seen in only one summary, or two or more non-official sources agree. **[L]** = one non-official source. **[VENDOR]** = a company that sells Playables publishing or services and so has a stake in what it says. **[STALE?]** = source older than 12 months (before 2025-10-19). **[1-SRC]** = only one source found.*

*Sibling note checked: (a) developer access is "early access" through an interest form, and a Playable is tied to an onboarded YouTube channel: CONFIRMED. (b) Revenue sharing is a pilot with a small group: CONFIRMED. (c) Playables Builder (Dec 2025, Gemini 3, closed beta): CONFIRMED. Some outlets wrongly call it an "open beta". Sources are in the sections below.*

## 1. What official Playables developer resources exist (docs, SDK, certification checklist, test suite, samples, policies), and are they free and current?

### Takeaway
Everything official sits under one tree on Google for Developers: `developers.google.com/youtube/gaming/playables/...`. It holds an overview, an SDK getting-started page and reference, a certification hub split into seven requirement pages, two FAQs, a contact page with a Discord link, a Developer Portal guide, a hosted SDK Test Suite and "experimental" Unity, Godot and Flutter wrappers plus a bundle analyzer. Another page, the YouTube Help article, is aimed at players.

There is no official npm package. The SDK is a single script served from `https://www.youtube.com/game_api/v1`. No source mentions any fee. The requirements were last revised in August 2026 (accessibility tags and a duplicate-content policy).

### Cited Findings
**Core documentation**
- **[H] Overview page.** It describes Playables as "interactive games and experiences published to YouTube, playable through our apps and website". It supports engines that export web builds using standard rendering APIs (WebGL, Canvas), and names Godot, Unity, Phaser and PlayCanvas. It says "developer access for Playables is in an early access stage" and sends developers to a Playables interest form. After onboarding, developers get the SDK, the test-suite guide and the certification requirements. — [Playables overview](https://developers.google.com/youtube/gaming/playables)
- **[H] SDK getting started.** "The SDK **MUST** be loaded before any of your game code", and this is checked during publishing. The import goes in the root `index.html`. The SDK does nothing when a game is served locally. The SDK URL moved from v0 to v1 in September 2023 [STALE? for the date, but v1 is still current]. — [Getting started](https://developers.google.com/youtube/gaming/playables/reference/getting_started); [Revision history](https://developers.google.com/youtube/gaming/playables/certification/revisionhistory)
- **[H] The SDK URL is `https://www.youtube.com/game_api/v1`, confirmed independently of Google's pages.** Two community npm packages read directly from the registry on 2026-10-18 load exactly this URL: `@maoyugames/phaser-platform-youtube@1.0.0-rc.0` and `@trempel/kit@2.5.0`. This repo's YouTube build also loads it as its first script (`dist/playables/index.html`). — [@maoyugames/phaser-platform-youtube](https://registry.npmjs.org/@maoyugames%2fphaser-platform-youtube); [@trempel/kit](https://registry.npmjs.org/@trempel%2fkit)
- **[H/M] SDK reference: the `ytgame` namespace.**
  - Flags: `IN_PLAYABLES_ENV` (added February 2024; the docs say to combine it with a check that `ytgame` exists) and `SDK_VERSION`.
  - `game`: `firstFrameReady`, `gameReady`, `saveData`, `loadData`.
  - `system`: `onPause`, `onResume`, `isAudioEnabled`, `onAudioEnabledChange`, `getLanguage`. `getLanguage` returns a BCP-47 tag such as "en-US". The docs say not to work out the language any other way and not to store it in the cloud save.
  - `engagement.sendScore`: one dimension of progress; YouTube shows the highest score it receives; values above MAX_SAFE_INTEGER are rejected.
  - `health.logError` and `health.logWarning`: best-effort and rate-limited.
  - `ads.requestInterstitialAd` and `ads.requestRewardedAd`.

  — [SDK reference](https://developers.google.com/youtube/gaming/playables/reference/sdk); [Getting started](https://developers.google.com/youtube/gaming/playables/reference/getting_started)
- **[H] Monetization reference.** Ad formats are pre-roll (automatic, run by YouTube), interstitial and rewarded. Revenue sharing is "piloting... with a select number of Playable creators". The page links an official Discord: "Want to discuss monetization, get help with your integration, or give feedback? Join our Discord community." — [Monetization reference](https://developers.google.com/youtube/gaming/playables/reference/monetization)

**Certification hub and requirement pages**
- **[H] Certification hub.** It uses RFC 2119 wording (MUST, SHOULD, MAY). "If a Playable cannot meet any of such requirements, it will not be allowed to publish on YouTube." — [Certification](https://developers.google.com/youtube/gaming/playables/certification/requirements)
- **The seven requirement pages:**
  - [Integration](https://developers.google.com/youtube/gaming/playables/certification/requirements_integration)
  - [Stability & performance](https://developers.google.com/youtube/gaming/playables/certification/requirements_stability)
  - [Design](https://developers.google.com/youtube/gaming/playables/certification/requirements_design)
  - [Monetization](https://developers.google.com/youtube/gaming/playables/certification/requirements_monetization)
  - [Privacy](https://developers.google.com/youtube/gaming/playables/certification/requirements_privacydata)
  - [Trust & Safety](https://developers.google.com/youtube/gaming/playables/certification/requirements_trustsafety)
  - [i18n/L10n](https://developers.google.com/youtube/gaming/playables/certification/requirements_i18n_l10n)

  There is also a [Design best practices](https://developers.google.com/youtube/gaming/playables/certification/best_practices_design) page, whose content was not retrieved. — [Search listing of pages, 2026-10-18](https://developers.google.com/youtube/gaming/playables/certification/requirements)
- **[M] Revision history, newest entries:**
  - 2026-08-25: "Updated Trust and Safety requirements to add the duplicate content policy (Section 2.2)".
  - 2026-08-24: "Added Game accessibility tags (Sections 2 and 2.1)".

  Older entries [STALE?]:
  - March 2023: technical requirements first published (2023-03-24).
  - 2023: pause/resume section (2023-07-20) and file names section (2023-08-11).
  - February 2024: `IN_PLAYABLES_ENV` added.
  - March 2024: per-file limit raised from 10 to 30 MiB.
  - June 2024: total bundle limit raised from 100 to 250 MiB, and lazy-loading guidance added.
  - July 2024: requirements split into several pages.

  One search summary reported page-age metadata ("829 days") that does not match the August 2026 entries, so the dates should be checked on the page itself. — [Revision history](https://developers.google.com/youtube/gaming/playables/certification/revisionhistory)

**Support, portal and testing**
- **[H] Support pages:**
  - [Certification FAQ](https://developers.google.com/youtube/gaming/playables/support/certification_faq) covers common failures (section 2).
  - [General FAQ](https://developers.google.com/youtube/gaming/playables/support/faq) covers staged rollouts (section 5).
  - [Contact page](https://developers.google.com/youtube/gaming/playables/support/contact) links the interest form and Discord. Release procedures "involve communication with a designated Partner Manager".

  — [Certification](https://developers.google.com/youtube/gaming/playables/certification/requirements)
- **[M] Developer Portal guide.** It requires channel-manager permission on a channel that has been onboarded to Playables; other users need Editor or Manager access in YouTube Studio. One search's metadata dated this page at about a year old [STALE?]. The workflow:
  1. "Add a new game", then enter metadata, upload a ZIP and add thumbnails and monetization settings.
  2. "Create release", which shows "Release Creation in Progress" for several minutes.
  3. A "Verify and test" tab appears, with a **YouTube Dev Link** and a **Test Suite Link**.
  4. "Submit for Certification". Only one release can be under review at a time; to replace one, ask the Playables Ops team to reject the staging release.
  5. Test on YouTube desktop web, mobile web, Android and iOS. Dev and staging links must not be shared outside certification testing.

  — [Developer Portal](https://developers.google.com/youtube/gaming/playables/developer_portal)
- **[M] SDK Test Suite** [STALE? for most dates]:
  - A hosted suite replaced the downloadable bundle in November 2023.
  - A check for unsupported filename characters and a mock loading screen were added in December 2023.
  - Since June 2024 games no longer need HTTPS and can be served from localhost.
  - The guide explains how to override the Content-Security-Policy header on `index.html` with Chrome DevTools local overrides, using a supplied CSP string that allows `game_api/v0` and `v1`.

  A page titled "Playables" exists at `/youtube/gaming/playables/test_suite`. It may be the hosted suite itself, but whether it can be used before onboarding is unconfirmed. — [Test Suite guide](https://developers.google.com/youtube/gaming/playables/reference/test_suite_guide); [test_suite page (title only seen)](https://developers.google.com/youtube/gaming/playables/test_suite); [Revision history](https://developers.google.com/youtube/gaming/playables/certification/revisionhistory)

**Samples and player-facing help**
- **[M] Samples, all labelled "Experimental":**
  - Unity wrapper: `GoogleYTGameWrapper.unitypackage` and a `-with-sample` variant; the platform must be set to WebGL, and a GameObject named `YTGameWrapper` talks to the JS bridge.
  - Godot wrapper.
  - Flutter Web SDK.
  - Bundle analyzer: reports files that are too large, invalid filenames and total-size overruns.

  — [Unity wrapper](https://developers.google.com/youtube/gaming/playables/samples/unity_wrapper); [Godot wrapper](https://developers.google.com/youtube/gaming/playables/samples/godot_wrapper); [Flutter Web SDK](https://developers.google.com/youtube/gaming/playables/samples/flutter_wrapper); [Bundle analyzer](https://developers.google.com/youtube/gaming/playables/samples/bundle_analyzer)
- **[H] YouTube Help article for players.** It explains where players find Playables, includes an "Interest form for Playables" section ("If you're interested in having your games on YouTube, please fill up this form") and calls Playables "an experimental feature rolled out to select users in eligible countries/regions". — [Playables on YouTube (Help)](https://support.google.com/youtube/answer/14328604?hl=en)
- **[M] Do not confuse GameSnacks with Playables.** GameSnacks is a separate Google HTML5 programme with its own requirements page, and it explicitly bans cookies, localStorage, sessionStorage and IndexedDB. Several third-party "Playables" guides seem to have copied GameSnacks rules. — [GameSnacks requirements](https://developers.google.com/gamesnacks/developer/requirements)

**Cost and npm packages**
- **[M] Cost.** No official page or third-party source found mentions any fee for the SDK, portal, Test Suite or certification. Third-party publishers charge a revenue share instead: Playgama gives 10–30% or 25% depending on the page [VENDOR, contradictory]. — [Playgama publish page](https://playgama.com/publish-your-game-on-youtube-playables/); [Mediacube monetization guide](https://mediacube.io/en/blog/youtube-playables-monetization)
- **[H] npm (registry checked directly, 2026-10-18).** None of these names exist on npm: `ytgame`, `@types/ytgame`, `@types/youtube-playables`, `youtube-playables`, `youtube-playables-sdk`, `ytgame-sdk`, `@google/ytgame`, `@youtube/playables`, `playables-sdk`, `@playables/sdk`, `yt-playables`, `youtube-playables-types`. Only community packages exist:
  - `@maoyugames/phaser-platform-youtube` 1.0.0-rc.0: created 2026-07-14, maintainer `thkhxm`, no repository listed.
  - `@trempel/kit` 2.5.0: created 2026-10-05, maintainer `jackfromchaos`, repository `github.com/trempel-dev/trempel`; a game kit with a Playables adapter.
  - `@types/youtube` 0.3.0 (DefinitelyTyped) is typings for the old IFrame **player** API (`declare namespace YT`, "@see .../iframe_api_reference") and has no Playables content.
  - `ytgame-object-system` (2025-06-25, description in Chinese, "game object and item system") only shares the name.

  — [npm search "ytgame"](https://registry.npmjs.org/-/v1/search?text=ytgame&size=20); [@types/youtube](https://registry.npmjs.org/@types%2fyoutube)

### Inferences
- The project's `docs/CERTIFICATION.md` already lists the right official URLs and the v1 SDK. The one free official tool it has not used is the **hosted Test Suite**. It is reached through the portal's "Verify and test" tab after a release is created, so in practice it probably needs onboarding (unconfirmed). Run it first when access arrives.
- `docs/CERTIFICATION.md` was walked on 2026-10-12, after the August 2026 additions. Still, explicitly check that the **duplicate-content policy (T&S 2.2)** and the **accessibility tags (new portal metadata)** were covered, because both are recent and easy to miss.
- Join the official Discord. It is the only official developer channel besides the Partner Manager and the interest form.

### Gaps
- No official page could be opened directly, so the "last updated" footers are unknown. The exact interest-form URL and Discord invite were not retrieved, only their existence.
- Whether the hosted Test Suite can be used without an onboarded channel is not stated in any summary.
- Whether Google publishes TypeScript typings for `ytgame` anywhere: none on npm, and nothing found in search.

## 2. What are the hard requirements to be accepted and stay live, and which of them commonly cause rejection?

### Takeaway
The MUSTs a vanilla JS game can actually trip are these:
- The SDK must load first.
- `firstFrameReady` must come before `gameReady`, and `gameReady` only once the game is interactive.
- Cloud save only through the SDK, with "MUST NOT use any other mechanism to save user progress".
- `loadData` must be awaited before `saveData`.
- No external calls of any kind, analytics included.
- Touch AND mouse for every interaction, every aspect ratio, and no orientation lock.
- English supported, and `navigator.language` not used.
- No PII, no login screens, no obfuscation.
- Ads only through YouTube's functions.
- Content suitable for ages 13+, with all IP cleared, and no duplicates of another Playable.

The certification FAQ singles out two failure classes. One is a zero-size viewport at start in the Android WebView. The other is a game that waits for a user tap before starting audio, which the FAQ calls "the most common audio issue".

**This repo has one probable violation:** it mirrors progress to localStorage inside Playables.

### Cited Findings
**Integration**
- **[H]** The SDK MUST load before any game code. `firstFrameReady()` MUST be called before `gameReady()`. `gameReady` must not be called while a loading screen is still showing ("Otherwise, the game fails the YouTube certification process"). — [Stability](https://developers.google.com/youtube/gaming/playables/certification/requirements_stability); [Getting started](https://developers.google.com/youtube/gaming/playables/reference/getting_started)
- **[M→H] Saving:**
  - "Saved game size MUST be less than 3 MiB … SHOULD be less than 500 KiB."
  - The string must be well-formed UTF-16 (check with `String.isWellFormed()`).
  - "**Game MUST NOT use any other mechanism to save user progress.**"
  - "Game MUST await loadData before calling saveData. If saveData is called before loadData completes successfully, the request will be rejected."
  - The final flush save on exit is best-effort and capped at 64 KiB.
  - The official SDK sample uses localStorage **only when not in Playables**: `if (ytgame?.IN_PLAYABLES_ENV) { ytgame.game.saveData(...) } else { window.localStorage.setItem(...) }`.
  - If `sendScore` is used, the best score sent must match the best score in the save.

  — [Integration](https://developers.google.com/youtube/gaming/playables/certification/requirements_integration); [SDK reference](https://developers.google.com/youtube/gaming/playables/reference/sdk)

**Size, load time, memory and crashes**
- **[H] Size limits:**
  - Initial bundle "MUST be less than 30 MiB, and SHOULD be less than 15 MiB", measured from page load to `gameReady`, after compression.
  - Total bundle MUST be under 250 MiB.
  - Each file must be under 30 MiB (512 KiB recommended).
  - At most 8,000 files.

  **Conflict:** other summaries of the same pages give "initial bundle under 15 MB, ideally 5 MB" and "under 15 MB and total under 250 MB, ideally 5 MB / 15 MB". This looks like page-summary text against the normative MiB text; trust the normative figures. — [Stability](https://developers.google.com/youtube/gaming/playables/certification/requirements_stability); [Certification FAQ](https://developers.google.com/youtube/gaming/playables/support/certification_faq)
- **[H] Load time:** the game "**SHOULD** finish loading and allow user interaction in under 5 seconds". This is a SHOULD, not a MUST. — [Stability](https://developers.google.com/youtube/gaming/playables/certification/requirements_stability)
- **[H] Memory and crashes:** "Game **MUST NOT** exceed a peak JavaScript heap size of 512 MB"; the FAQ says this is the iOS Safari crash threshold. The game MUST NOT have consistently reproducible crashes, and MUST NOT crash the YouTube app, the website or other software. No frame-rate requirement was found. — [Stability](https://developers.google.com/youtube/gaming/playables/certification/requirements_stability); [Certification FAQ](https://developers.google.com/youtube/gaming/playables/support/certification_faq)

**Design and language**
- **[H] Design:**
  - The game must be playable at all aspect ratios and adjust automatically ("9:32, 9:21, 9:16, 3:4, 1:1, 4:3, 16:9, 21:9, 32:9" as non-exhaustive examples). Letterboxing or pillarboxing is allowed.
  - "Game MUST NOT lock device orientation or device posture."
  - "Game MUST support touch input for all interactions" and "MUST support mouse input for all interactions".
  - The game "SHOULD allow users to close modals or dialogs using the Esc key".
  - State must be kept through resizes.
  - No in-game exit or quit button, and no icons that imitate platform controls near them.
  - All metadata fields required in the portal must be provided.
  - In 2023 portrait play was made a MUST and landscape a SHOULD [STALE?].

  — [Design](https://developers.google.com/youtube/gaming/playables/certification/requirements_design); [Certification FAQ](https://developers.google.com/youtube/gaming/playables/support/certification_faq)
- **[H] Language:** "Game MUST support the English language." The game MAY use `getLanguage`, and "MUST NOT use web localization APIs, such as navigator.languages or navigator.language". No requirement for translated metadata was found. — [i18n/L10n](https://developers.google.com/youtube/gaming/playables/certification/requirements_i18n_l10n); [SDK reference](https://developers.google.com/youtube/gaming/playables/reference/sdk)

**Privacy and code**
- **[H] Privacy:**
  - "Game MUST NOT make external calls to any URLs or services, except where explicitly required" by other requirements, and must not try to get around this.
  - The FAQ says internal analytics get no exemption: "No. Playables must not make any external calls at this time." Developers should tell their Partner Manager which analytics they want instead.
  - No collecting names, ages, locations, usernames or passwords, and no screen that looks like a login or account-creation screen.
  - Clipboard access only after an explicit paste.

  — [Privacy](https://developers.google.com/youtube/gaming/playables/certification/requirements_privacydata); [Certification FAQ](https://developers.google.com/youtube/gaming/playables/support/certification_faq)
- **[M] Code:**
  - "Creators MUST NOT obfuscate code"; minification is allowed, and plain TypeScript-to-JavaScript transpilation is fine.
  - Code size and complexity are limited to what YouTube's tooling can scan.
  - YouTube **may decline games it cannot evaluate** because of WebAssembly, `eval()` or web workers. These are not banned outright.

  — [Privacy / technical requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_privacydata)

**Monetization and content**
- **[H] Monetization:**
  - "Game MUST NOT implement monetization using off-platform services."
  - The game "MAY display in-game advertising using YouTube-provided ads functions", must still respect mute and pause/resume around ads, and must configure monetization settings in the portal.
  - Interstitials go at "a natural breakpoint… such as level completion".
  - Rewarded ads are opt-in, requested when a player explicitly asks, and the reward ID must not contain user data.
  - Interstitials must not be used to reward the player.
  - **Conflict:** the same page's summary reportedly says "In-game purchases are not allowed" and even that in-game advertising is "strictly prohibited", which contradicts its own detailed MAY clause. The detailed clauses are the operative text.

  — [Monetization requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_monetization); [Monetization reference](https://developers.google.com/youtube/gaming/playables/reference/monetization)
- **[H] Trust & Safety:**
  - Content must follow the YouTube Community Guidelines and suit "a general audience aged 13 and older".
  - All third-party IP, trademark, music and personality rights must be cleared.
  - Since 2026-08-25, a Playable must not be a duplicate upload or "substantially identical" to another Playable already on the platform, and must be original, authorized or licensed.

  — [Trust & Safety](https://developers.google.com/youtube/gaming/playables/certification/requirements_trustsafety); [Revision history](https://developers.google.com/youtube/gaming/playables/certification/revisionhistory)
- **[H] The review is holistic.** YouTube checks API and technical compliance, Trust & Safety and privacy, and also "the creator's overall history on YouTube and past Playables performance". It "reserves the right to reject any game". — [Certification](https://developers.google.com/youtube/gaming/playables/certification/requirements)

**Common rejection causes**
- **[H] Named in the official certification FAQ:**
  - **Zero-size viewport.** A game that renders in the Test Suite but not in the Android WebView usually broke because the WebView starts at 0×0. The game must run without waiting for a non-zero viewport, listen for `resize`, and set its height only when `innerHeight` is non-zero.
  - **Audio.** "Games that are expecting user interaction before starting playback are the most common audio issue. YouTube Playables may be given focus automatically, so the game must handle this case."

  — [Certification FAQ](https://developers.google.com/youtube/gaming/playables/support/certification_faq)
- **[L/VENDOR] Listed by publishers:**
  - Mediacube's first of "8 common build errors" is that the SDK pause does not really pause animations, physics, input and timers; it advises testing with the Test Suite rather than the game's own pause button.
  - A third-party guide adds: a rewarded-ad button that requests nothing, layouts that only work full screen, login screens, obfuscation, off-platform ads, external calls, and localStorage or external save servers.
  - That last one matches GameSnacks rules. The official Playables wording is the "no other mechanism to save progress" rule above.

  — [Mediacube: 8 certification errors](https://mediacube.io/en/blog/youtube-playables-errors); [playables.in rejection reasons](https://playables.in/common-reasons-youtube-playables-games-get-rejected/)
- **[H] What happens after a rejection.** The certification hub says a game failing a MUST is not published. The fix-and-resubmit path is described by third parties: fix the issues, create a new release, resubmit. "A successful upload or release creation is not the same as certification approval." — [Certification](https://developers.google.com/youtube/gaming/playables/certification/requirements); [playables.in](https://playables.in/youtube-playables-game-rejection-reasons/)

**Checks on this repo (read directly, 2026-10-18)**
- **Clean:** the built `dist/playables/index.html` (234,187 bytes raw) has 0 occurrences of `eval(`, `new Function`, `Worker`, `WebAssembly`, `sessionStorage`, `indexedDB`, `document.cookie`, `navigator.language` or `requestFullscreen`. Its only network URL is the SDK script; the other two are an SVG namespace and the Matter.js licence comment.
- **Not clean:** `js/platform/sdk.js` lines 82–101 **always** write progress to `localStorage` (key `byc.save.v1`), even when the SDK is present. `loadData` falls back to that local copy when the cloud save is empty or fails.
- **Edge case:** the sound switch can call `saveProgress` (`js/main.js:106`) before the asynchronous `loadProgress()` started at `js/main.js:67` has resolved.
- **Audio:** the AudioContext is built only on the first user gesture (`js/audio.js` lines 27–31 and 46–60).
- **Keyboard:** there is no keyboard handling anywhere (no `keydown` or `Escape` in `js/`).

— [js/platform/sdk.js](/home/user/BRO-YOU-RE-COOKED./js/platform/sdk.js); [js/main.js](/home/user/BRO-YOU-RE-COOKED./js/main.js); [js/audio.js](/home/user/BRO-YOU-RE-COOKED./js/audio.js)

### Inferences
- **Fix before certification (likely flag):** the always-on localStorage mirror conflicts with "MUST NOT use any other mechanism to save user progress", and it departs from Google's own sample, which uses localStorage only when `IN_PLAYABLES_ENV` is false. Gate both the write and the fallback read on `!ytgame?.IN_PLAYABLES_ENV`.
- **Side effect of the mirror:** on a shared device, a second YouTube account with an empty cloud save would silently inherit the first account's progress. That is a privacy-shaped bug, not only a certification one.
- **Low-cost fix:** do not call `saveData` until `loadData` has settled; skip or queue the sound-toggle save. The platform says it rejects early saves, so today the mute choice is simply lost.
- **Audio risk (medium):** the game deliberately waits for a gesture before creating audio, which is exactly what the FAQ calls the most common audio failure. Safer: try to create and resume the context at boot when `isAudioEnabled()` is true, and fall back to unlocking on a gesture if the browser keeps it suspended. The game's audio carries no information, so this is about passing review, not about gameplay.
- **Viewport risk (low, unverified):** `js/view.js` reads `innerWidth`/`innerHeight` at boot and listens for `resize` and `orientationchange`, so it probably recovers from a 0×0 start. A one-off test that boots at 0×0 and then resizes would settle it.
- **Duplicate-content policy:** never upload a second listing of this game (a "lite" build, a publisher's copy plus your own copy, a re-skin). Apply through ONE route only.
- **Esc to close modals** (a SHOULD, cheap to add): close the level board on Escape.
- **Already comfortable:** bundle size (0.23 MB raw against a 15 MiB SHOULD), no external calls, no eval/workers/WASM, English-only text (allowed; localization is optional), and both mouse and touch through Pointer Events.

### Gaps
- No normative frequency cap for interstitials, and no rule for a first-session ad grace period, was found in any summary. The project's every-third-level rule is its own choice and is neither required nor forbidden.
- Whether localStorage is acceptable for non-progress data (for example a settings cache) is not addressed in the summaries seen.
- What reviewers count as "substantially identical" under the duplicate policy is not defined.
- No first-person account of a rejection, with the reviewer's actual wording, was found.

## 3. How does a developer get in today: open or invite-only, eligible countries, waiting time, and what happens after acceptance? Have independent developers been accepted?

### Takeaway
There is no open sign-up. The official route is the **Playables interest form** ("early access"), after which YouTube onboards a **YouTube channel** that publishes through the Developer Portal with a Partner Manager. Nothing official gives a timeline or developer-country eligibility.

The alternative is a **publisher that is already onboarded** (Playgama, Mediacube, Famobi and others). They promise 2–4 weeks for a revenue share; all such timelines are vendor claims. Player availability went from 4, to 7, to "50+" markets on 2026-09-28, but no official country list exists.

### Cited Findings
**The official route**
- **[H] Application:** "fill out the Playables interest form to be considered for submitting a game or company". The same form is linked from the YouTube Help page. — [Overview](https://developers.google.com/youtube/gaming/playables); [Help](https://support.google.com/youtube/answer/14328604?hl=en); [Contact](https://developers.google.com/youtube/gaming/playables/support/contact)
- **[H] A Playable is tied to a channel:** the portal requires "channel manager permission on a channel that has been onboarded to YouTube Playables"; teammates need Editor or Manager access in YouTube Studio. — [Developer Portal](https://developers.google.com/youtube/gaming/playables/developer_portal)
- **[H] After acceptance:**
  1. Portal release: metadata, ZIP, thumbnails, monetization settings.
  2. "Verify and test" with a Dev Link and the Test Suite.
  3. "Submit for Certification", working with a designated Partner Manager.
  4. A holistic review that also weighs the channel's YouTube history.
  5. **Staged exposure** after launch: "various stages of Playables validation … which may include limited access, staged rollouts, or adjustments through automated systems".

  — [Developer Portal](https://developers.google.com/youtube/gaming/playables/developer_portal); [Certification](https://developers.google.com/youtube/gaming/playables/certification/requirements); [FAQ](https://developers.google.com/youtube/gaming/playables/support/faq)
- **[M] No eligibility criteria are published.** Searches found no official list of developer countries and no criteria for how forms are judged. — [Search summary of official pages](https://developers.google.com/youtube/gaming/playables/support/faq)

**Waiting times (all vendor claims)**
- **[L/VENDOR]** Mediacube: direct access is hard, "the approval queue is long, documentation is sparse, and the platform updates faster than public-facing resources can keep up" (July 2026); elsewhere it gives a wait of "3 to 6 months… no guarantee of approval". — [Mediacube updates](https://mediacube.io/en/blog/youtube-playables-updates); [Mediacube monetization](https://mediacube.io/en/blog/youtube-playables-monetization)
- **[L/VENDOR]** Playgama's wiki: the direct route "can take weeks or even months" and needs Channel Manager rights. Through Playgama: "Average time to publish: 2–4 weeks". The developer integrates Playgama's Bridge SDK, uploads to developer.playgama.com, and Playgama runs QA with the official Test Suite before submitting. Playgama calls itself an official partner, has no upfront cost and claims no exclusivity. — [Playgama wiki](https://wiki.playgama.com/platforms/how-to-publish-your-game-on-youtube-playables); [Playgama publish page](https://playgama.com/publish-your-game-on-youtube-playables/)

**Publishers already on the platform**
- **[M] Early publishers [STALE?]:**
  - The 2023 soft launch featured Rovio, Voodoo, Homa and Azur. Famobi had 7 games in the trial (including ZeptoLab's Om Nom Run), alongside GameSnacks and Arkadium.
  - Famobi now says it is "one of the first partners of YouTube with 10 games" [VENDOR].
  - Trackers list Famobi with 43 games and about 388M plays [L].

  — [mobilegamer.biz 2023 soft launch](https://mobilegamer.biz/google-has-quietly-soft-launched-youtube-playables-with-games-from-rovio-voodoo-homa-azur-and-more/); [Famobi](https://famobi.com/); [Fandom wiki](https://youtube-playables.fandom.com/wiki/Playables)
- **[L] Catalogue size:** a tracker counts about 280 publishers on the platform (1,654 games, 2026-09-20). For small studios, the trackers show Pupu Studios with 3 games. This shows publishers far beyond the launch partners, but not whether they came in directly or through a publisher. — [playables.games](https://playables.games/); [Pupu Studios page](https://playables.games/publishers/pupu-studios/)

**Examples of independent developers getting in**
- **[L][STALE?][1-SRC]** ChennaiGames (India) announced on LinkedIn that "MR RACER Stunt Mania" launched on Playables with Playgama's help, roughly March 2025. — [Mohan Doss / ChennaiGames, LinkedIn](https://www.linkedin.com/in/mohanrdoss/)
- **[L]** A YouTube video titled "I Published 3 Indie Games on YouTube Playables… Here's What Happened" exists. Only its intro was visible ("to see if it's a real opportunity for solo developers"); its conclusions could not be read. — [YouTube video](https://www.youtube.com/watch?v=0ZaimnthfvE)

**Player-facing availability**
- **[H] Timeline [STALE? up to 2024]:**
  - 2023-09: YouTube confirms it is testing Playables.
  - 2023-11: offered to YouTube Premium.
  - 2024-05-28: rolling out "to all users", with 75+ games.
  - The initial markets were the US, Great Britain, Canada and Australia.

  — [TechCrunch 2023-09-06](https://techcrunch.com/2023/09/06/youtube-confirms-its-testing-a-games-offering-called-playables/); [9to5Google 2023-11-28](https://9to5google.com/2023/11/28/youtube-testing-playables-gaming-effort/); [TechCrunch 2024-05-28](https://techcrunch.com/2024/05/28/youtubes-free-games-catalog-playables-rolls-out-to-all-users/); [YouTube community post](https://www.youtube.com/post/UgkxXzuKN3ShQVkVahs6FqzcOeBvmjPhukJk)
- **[M] Expansion to "over 50 markets":** before September 2026 the official markets were the US, UK, Canada, Australia, India, Malaysia and Türkiye. On or about 2026-09-28, YouTube gaming partnerships manager **Joel Jansson** said on LinkedIn that Playables "have now been rolled out to over 50 markets, now including the Nordics and EU". This was a LinkedIn post, not a press release, and no country list was published. — [mobilegamer.biz](https://mobilegamer.biz/youtube-has-quietly-rolled-out-playables-across-europe/); [PocketGamer.biz](https://www.pocketgamer.biz/youtube-playables-expands-to-more-than-50-markets-including-the-eu-and-nordics/); [tech-insider.org](https://tech-insider.org/youtube-playables-50-markets-eu-nordics-2026/)
- **Conflict:** one search summary says a version of the Help page lists 60+ countries, "Argentina to Vietnam". Another version says "select users in eligible countries/regions" and that some users can reach Playables only through shared links. — [Help](https://support.google.com/youtube/answer/14328604?hl=en)

**Multiplayer**
- **[M] Multiplayer [STALE?]:** testing began in December 2024 with Ludo Club and Magic Tiles 3. — [TechCrunch 2024-12-10](https://techcrunch.com/2024/12/10/youtube-is-testing-multiplayer-mini-games); [Engadget](https://www.engadget.com/gaming/youtube-introduces-multiplayer-mini-games-on-playables-133056235.html)
- **[L/VENDOR][1-SRC]** Mediacube says developers of multiplayer or PvP games can apply through its form, which it forwards to YouTube's multiplayer testing programme. — [Mediacube updates](https://mediacube.io/en/blog/youtube-playables-updates)

### Inferences
- While the application is pending, there is **nothing official the team can do to speed it up**. The levers are the quality of the interest-form answers, the web demo link, and the channel's standing ("creator's overall history on YouTube" is part of review).
- The **publisher route** is a legitimate parallel option: published, non-exclusive (claimed), with a revenue share of about 10–30%. But both routes must not end up with the same game on Playables (duplicate policy). If a direct answer arrives after a publisher has submitted, one of them must be withdrawn. Get any publisher's terms in writing.
- The jump from 7 to 50+ markets (late September 2026) and the catalogue roughly doubling in summer 2026 (section 5) suggest the gate is opening. That is an inference, not a statement from YouTube.

### Gaps
- No official waiting time, acceptance rate or developer-country list.
- No first-person, verifiable account of a solo developer accepted through the **direct** form in 2025–2026 (Reddit could not be searched; see section 6).
- The exact list of 50+ markets is unpublished.

## 4. How are games monetized and how are developers paid? Are there published numbers or credible earnings reports?

### Takeaway
Officially: YouTube runs pre-roll ads itself, developers may add interstitial and rewarded ads through the SDK, and **revenue sharing is a pilot with "a select number of Playable creators"**. No split, payment method, schedule or threshold is published anywhere official. In-app purchases do not exist; a YouTube partnerships manager said on LinkedIn that Google aims to "test IAP solutions during 2027".

Every earnings figure in circulation is self-reported by a publisher ($10–15k first month for top titles; about $3.1k/month average) and cannot be verified. A directly onboarded indie should plan on **$0 ad share** until it is admitted to the pilot.

### Cited Findings
**Official position**
- **[H] Ad formats and the pilot:** "YouTube handles pre-roll ads automatically—no integration work is required on your end". Interstitial and rewarded ads are added through the SDK. YouTube is "piloting revenue sharing with a select number of Playable creators" and aims "to align with the broader YouTube monetization programs over time". Ad slots are seen by "a subset of users in Playables-eligible regions and platforms". — [Monetization reference](https://developers.google.com/youtube/gaming/playables/reference/monetization)
- **[M][STALE?]** The Developer Portal guide says monetization settings will not change the end-user ads experience "for now". — [Developer Portal](https://developers.google.com/youtube/gaming/playables/developer_portal)
- **[M] Nothing published on payment:** an independent audit of the monetization guide, requirements, portal guide and FAQs found no payout method, schedule or threshold, and "no rate published" for the revenue share. Searches found no confirmation that payouts go through AdSense. — [portalready.world](https://portalready.world/portals/youtube-playables/); [Monetization reference](https://developers.google.com/youtube/gaming/playables/reference/monetization)
- **[M][1-SRC original, reported by 3+ outlets] In-app purchases:** Jansson's LinkedIn comment that Google aims to "test IAP solutions during 2027". It is a plan, not a policy. — [mobilegamer.biz](https://mobilegamer.biz/youtube-has-quietly-rolled-out-playables-across-europe/); [shattered.io](https://shattered.io/youtube-playables-50-markets-zero-iap-2026/); [36Kr](https://eu.36kr.com/en/p/4027861725614465)

**Vendor earnings claims**
- **[L/VENDOR] Playgama:**
  - "Strongest" titles earned $10,000–15,000 in their first month.
  - Its games average about $3,100/month in a closed beta that started March 2026.
  - Publishers see only total daily revenue across their whole portfolio, with a 48-hour delay, not per game.
  - Playgama's own split is quoted as developer keeps 70–90% on one page and Playgama keeps 25% on another.

  shattered.io notes these figures come from the developer side, not from YouTube. — [Playgama blog](https://playgama.com/blog/2026/06/04/youtube-playables/); [Playgama monetization](https://playgama.com/blog/main/youtube-playables-monetization/); [shattered.io](https://shattered.io/youtube-playables-50-markets-zero-iap-2026/)
- **[L/VENDOR] Mediacube:** says it was "among the first accepted into the monetization pilot", has had every game in its portfolio monetized since April 2026, and that revenue "usually starts appearing within days". It also says "only selected publishers (including Mediacube) can monetize". — [Mediacube updates](https://mediacube.io/en/blog/youtube-playables-updates); [Mediacube: What are Playables](https://mediacube.io/en/blog/youtube-playables)
- **[L]** Ad revenue depends on geography because inventory is auctioned; high-CPM regions pay more per impression [VENDOR]. — [Playgama monetization](https://playgama.com/blog/main/youtube-playables-monetization/)

**The live-stream route (separate from the developer pilot)**
- **[M]** Creators can play Playables during their own live streams and monetize the stream as usual. This pays the streamer, not the game's developer. — [YouTube Blog: Live updates](https://blog.youtube/news-and-events/live-updates/)

### Inferences
- The two vendor claims, "publishers are in the pilot" and "only selected publishers can monetize", together suggest that **the fastest route to any revenue today may be a publisher already in the pilot**. That rests entirely on vendor statements.
- The game's ad design matches the documented rules: rewarded only on an explicit tap (the SKIP), reward IDs `skip-<level id>` with no user data, and interstitials at level boundaries. No published frequency rule is broken by every-third-level.
- Do not build a revenue projection. There is no official rate, and vendor averages come from portfolios selected for success.

### Gaps
- The revenue split, payment rails (AdSense? YouTube Partner Program? a direct contract?), thresholds, currencies and tax handling are all unknown.
- Whether pilot membership depends on channel YPP status is unknown.
- No independent (non-vendor) earnings report was found.

## 5. How are Playables discovered and ranked, and what drives plays and retention?

### Takeaway
Officially, players find Playables through:
- a **Playables shelf on Home**;
- the **Playables destination under Explore**;
- **Search**;
- the **You tab** for games they saved;
- shared links;
- live streams, where streamers can play them. Mobile vertical live streams, select games, started March 2026.

There is also a standalone Google **Instant Games** Android app (June 2025). Ranking is undocumented. The only official hints are staged rollouts and "adjustments through automated systems", plus past Playables performance counting in review.

Third-party trackers show a fast-growing catalogue: about 1,650–1,850 games and 4.8–5.3B cumulative plays as of September–October 2026, dominated by hypercasual titles. A publisher analysis (one source, vendor) ranks **"Draw & Escape Puzzle" as the top-performing new mechanic of summer 2026**, which is this game's genre.

### Cited Findings
**Official discovery surfaces**
- **[H] Help page:** Playables are found "on the Playables shelf on the YouTube Home page or directly on the Playables destination page, which is reachable from the Explore menu", and also through Search and in the You tab after saving a game. Some users who cannot see Playables in discovery "may still be able to access them through shareable links". A fan wiki agrees and gives the catalogue URL as youtube.com/playables. — [Help](https://support.google.com/youtube/answer/14328604?hl=en); [Fandom wiki](https://youtube-playables.fandom.com/wiki/Playables)
- **[M] No official Shorts entry point** was found. Claims about Shorts, channel pages and live-page surfacing come only from vendor pages. — [Help](https://support.google.com/youtube/answer/14328604?hl=en)
- **[H] Live streams:**
  - 2025-09-16: Playables in live streams, from "a library of 75+ games" [STALE?].
  - March 2026: Playables as an activity in mobile **vertical** live streams, "available in certain countries for select Playables". Viewers cannot join the game.

  — [TechCrunch 2025-09-16](https://techcrunch.com/2025/09/16/youtube-live-gets-a-major-update-introduces-dual-format-streaming-minigames-and-more/); [YouTube Blog](https://blog.youtube/news-and-events/live-updates/); [Creator updates](https://support.google.com/youtube/answer/9072033?hl=en)
- **[M][STALE?] Instant Games app:** a standalone Android app quietly launched on 2025-06-17 that hosts the Playables catalogue (Om Nom Run, Chess Classic, 8 Ball Billiards Classic, Tall Man Run, Crossy Road, Cut the Rope…). AppMagic counted 44 countries, and it has an "Available Offline" section. Reports conflicted on which devices could get it. — [PocketGamer.biz](https://www.pocketgamer.biz/google-quietly-launches-html5-games-hub-instant-games-on-select-android-devices/); [mobilegamer.biz](https://mobilegamer.biz/google-has-quietly-released-its-own-standalone-instant-games-app/)
- **[H] Ranking signals:** the general FAQ mentions "limited access, staged rollouts, or adjustments through automated systems". The certification hub weighs "past Playables performance". No ranking documentation was found. — [FAQ](https://developers.google.com/youtube/gaming/playables/support/faq); [Certification](https://developers.google.com/youtube/gaming/playables/certification/requirements)
- **[L][1-SRC]** A Hacker News user (around May 2026) complained about "cards between videos promoting YouTube Playables". This suggests in-feed promotion units. — [HN thread](https://news.ycombinator.com/item?id=47982967)

**Third-party traffic data**
- **[L] Tracker data (not official; scraped public play counts):**
  - TubeGames (playables.games), as reported by a fan-wiki page citing it: 1,654 games from about 280 publishers, more than 4.8B total plays and about 17M plays a day (2026-09-20 snapshot). The TubeGames homepage later showed 1,851 games.
  - playables.online: 5.31B plays, 270+ publishers.
  - Leader: Tall Man Run (Supersonic Studios), about 104–109M plays, then Build a Queen and Snake Clash!.

  — [Fandom wiki](https://youtube-playables.fandom.com/wiki/Playables); [playables.games](https://playables.games/); [playables.online](https://playables.online/)
- **[L/VENDOR][1-SRC] Mediacube (2026-09-08):**
  - The catalogue grew from 788 to 1,477 titles between 2026-07-01 and 2026-09-04, with "+1B new plays".
  - Its top-ranked new mechanic is **"Draw & Escape Puzzle"** (draw a path, pull a pin, steer a character through a spatial puzzle).
  - The most-played new game was **Tricky Twist: Brain Puzzle at about 394,000 plays/day**.
  - The other five mechanics on its list were not retrieved.

  — [Mediacube: 6 mechanics winning in 2026](https://mediacube.io/en/blog/youtube-playables-game-mechanics)
- **[L]** PocketGamer.com's headline on the expansion: "YouTube Playables turns all those dodgy mobile game adverts into actual games". It describes the catalogue as ad-style hypercasual. — [PocketGamer.com](https://www.pocketgamer.com/youtube-playables/50-plus-markets-expansion/)
- **[L/VENDOR]** Mediacube's theory: "session depth beats session count", with retention feeding discovery. It is a model, not a documented mechanism. — [Mediacube monetization](https://mediacube.io/en/blog/youtube-playables-monetization)

**Analytics available to developers**
- **[L/VENDOR]** Until mid-July 2026 publishers had "exactly one metric per game: total game plays". Age, geography and gender filters were added then. Developers are still waiting for DAU/MAU, unique players, retention curves and per-game crash reporting. — [Mediacube updates](https://mediacube.io/en/blog/youtube-playables-updates)

### Inferences
- **Demand and competition both exist for this game's genre.** If the vendor data is right, draw-to-escape puzzles are what the new audience plays most. The same data means direct twins (draw-to-save / pin-pull games) are already there. The T&S duplicate rule, and the "lightning in a bottle" of shelf placement, both favour **looking unlike them in the first frame and in the thumbnail**. That matches the project's own "shape of the set" finding.
- Staged rollout plus "past Playables performance" means **the first release's early numbers probably shape all later exposure.** Ship the most polished first ten minutes, not the most levels.
- Because developer analytics are thin (plays plus demographics), the game's own attempt log and stars are the only retention data the team will have. Do not plan on platform funnels.

### Gaps
- No official ranking factors, featuring process or editorial contact.
- No retention or session-length data from any non-vendor source.
- Whether Playables appear inside the Shorts feed is unconfirmed.

## 6. What do real developers and publishers report (Reddit, Hacker News, blogs, talks, publisher posts, LinkedIn)?

### Takeaway
Independent, first-person developer experience is **scarce in reachable sources**. Reddit could not be searched (domain refused by the search tool), and the one indie "here's what happened" video could not be read. What is left is mostly publisher marketing, which says direct access is slow and documentation thin while publishers do well. There are also Hacker News threads that are sceptical of Playables as a product, and a tepid reception for the AI Playables Builder. No GDC or I/O talk with official Playables metrics was found.

### Cited Findings
**Hacker News**
- **[M][STALE?] 2023:** reaction to the first tests was sceptical: comparisons with Stadia, and games described as "small puzzle types" like Facebook games. — [HN 2023](https://news.ycombinator.com/item?id=36487885)
- **[L] Late 2025:** a "YouTube Playables Builder Beta" post had no visible discussion. — [HN](https://news.ycombinator.com/item?id=46357197)
- **[L] Around May 2026:** complaints about Playables cards between videos, and "YouTube is a video site, not a game site". — [HN](https://news.ycombinator.com/item?id=47982967)

**Playables Builder (AI game maker for creators)**
- **[H] What it is:** announced 2025-12-16 as a **closed** beta of a prototype web app "built using Gemini 3 where users create games with short text, video or image prompts". It is open to approved creators in the US, Canada, Great Britain and Australia, with launch creators @sambucha, @AyChristene, @goharsguide and @Mogswamp. Engadget and Dataconomy wrongly call it an "open beta". — [YouTube Gaming on X](https://x.com/YouTubeGaming/status/2000989303086649637); [GIGAZINE](https://gigazine.net/gsc_news/en/20251217-youtube-game-playables-builder/); [Engadget](https://www.engadget.com/ai/youtube-is-letting-creators-make-playable-games-with-a-gemini-3-tool-195500318.html); [Dataconomy](https://dataconomy.com/2025/12/17/youtube-gaming-opens-playables-builder-beta-with-gemini-3/)
- **[M] Reception:** Creative Bloq says it received a "tepid reception, with many finding the games to be repetitive and uninspiring" and counted six AI games live at the time. Outlook Respawn calls the response muted. Playgama names Sambucha's BUCHA BLOCKS and Mogswamp's DIRT RUNNER. — [Creative Bloq](https://www.creativebloq.com/3d/video-game-design/you-can-now-play-ai-generated-games-in-youtube); [Outlook Respawn](https://respawn.outlookindia.com/gaming/gaming-news/youtube-launches-ai-playables-builder-for-creator-made-games); [Playgama on Builder](https://playgama.com/blog/main/youtube-playables-builder/)

**Individual developers and publishers**
- **[L][STALE?]** A 2024 Medium post by a developer with access presents Playables as free distribution for games. — [Medium, 2024](https://medium.com/@anulagarwal12/youtube-playables-is-here-play-games-on-youtube-without-installing-6fadc1861d1f)
- **[L/VENDOR] Publisher accounts:**
  - Mediacube: "most developers who want to publish on Playables cannot get in directly" (July 2026).
  - Playgama: "20+ games" on one page, and "50+ games, 200M+ gameplays on YouTube Playables" on another.
  - A Playgama co-founder's LinkedIn post (reported by a tracker) claims about 50 active games, the largest portfolio, as of July 2026.

  — [Mediacube updates](https://mediacube.io/en/blog/youtube-playables-updates); [Playgama publish page](https://playgama.com/publish-your-game-on-youtube-playables/); [playables.games](https://playables.games/)
- **[M] YouTube staff on LinkedIn:** Joel Jansson (partnerships) is the de facto public voice on platform changes. Besides the 50+ markets and IAP 2027 comments, he has promoted third-party launches such as GeoGuessr's Daily Game. — [Joel Jansson, LinkedIn](https://www.linkedin.com/in/joeljansson/); [mobilegamer.biz](https://mobilegamer.biz/youtube-has-quietly-rolled-out-playables-across-europe/)
- **[L]** Two indie-oriented videos exist ("How YouTube Playables Could Make Indie Game Devs Rich" and "I Published 3 Indie Games… Here's What Happened"), but their content was not readable. — [Video 1](https://www.youtube.com/watch?v=p0z8j7T0GH4); [Video 2](https://www.youtube.com/watch?v=0ZaimnthfvE)

### Inferences
- The developer voice is so thin because, until recently, few independents had access. Most catalogue growth appears to come through publishers. The official Discord is probably where onboarded developers actually talk, and it is worth joining.
- Treat "Playables made us rich" videos and vendor earnings posts as marketing until a developer publishes their portal numbers.

### Gaps
- **Reddit (r/gamedev, r/html5, r/IndieDev, r/godot, r/phaser) could not be searched.** The search tool returned "domains not accessible" for reddit.com. A person should search these by hand.
- No GDC 2025/2026 or Google I/O session with Playables metrics was found.
- CrazyGames, Poki and Azerion statements about Playables were not found. GameSnacks appears only as an early trial supplier.

## 7. Which circulating claims about Playables are false or unverifiable?

### Takeaway
There is **no official Playables npm package**. The SDK is a script on youtube.com, and every plausible "official" npm name is unregistered as of 2026-10-18. **No "guaranteed acceptance" offer** was found. Publishers sell speed, not guarantees, and YouTube certifies every game either way.

The unreliable material is mostly:
- SEO "2026 guide" sites (playables.in) whose operator is unknown;
- vendor statistics (YouTube-wide user counts presented as Playables audience, portfolio earnings averages);
- GameSnacks rules relabelled as Playables rules;
- any revenue-per-play formula, because no official rate exists to build one from.

### Cited Findings
**SDK packages**
- **[H] No official npm SDK:** every likely name checked does not exist (list in section 1). The only Playables-related packages are two community adapters that load the real `youtube.com/game_api/v1` script: `@maoyugames/phaser-platform-youtube` (rc, no repository listed) and `@trempel/kit`. `@types/youtube` is the IFrame player API, not Playables. **Integrity check:** a scan of the URLs inside both adapters' tarballs found only YouTube, Google docs and their own project domains. This does not audit their code. — [npm search](https://registry.npmjs.org/-/v1/search?text=youtube-playables&size=20); [@types/youtube](https://registry.npmjs.org/@types%2fyoutube)

**Third-party guide sites**
- **[L] playables.in:** a site of "2026 guide" articles (approval, portal, SDK, requirements, rejections, monetization, interest form). Its operator and any affiliation could not be found. Some of its statements are recommendations dressed as rules, such as "keep the initial load bundle size strictly below 5 MB" (the official MUST is 30 MiB). Others seem to come from GameSnacks, such as "does not allow … localStorage". — [playables.in requirements](https://playables.in/youtube-playables-requirements/); [playables.in approval guide](https://playables.in/youtube-playables-developer-program-approval/); [GameSnacks requirements](https://developers.google.com/gamesnacks/developer/requirements)
- **[L/VENDOR] Mediacube's "McPlay — YouTube Playables certification portal" (mcplay.mediacube.io).** This is a publisher's own portal. Its name could be mistaken for YouTube's certification; YouTube certifies every game itself. — [McPlay](https://mcplay.mediacube.io/); [Certification](https://developers.google.com/youtube/gaming/playables/certification/requirements)

**Publisher offers**
- **[M] No guarantees:** none found. Mediacube itself says direct access has "no guarantee of approval, and no timeline certainty". Playgama promises "2–4 weeks" for "most games", not acceptance. — [Mediacube monetization](https://mediacube.io/en/blog/youtube-playables-monetization); [Playgama publish page](https://playgama.com/publish-your-game-on-youtube-playables/)

**Numbers that do not mean what they seem**
- **[M] Audience:** a vendor blog frames Playables around "2.7+ billion registered users, around 122 million daily visitors". These are YouTube-wide figures, not Playables players. YouTube has published no Playables-specific user metrics. — [Mediacube monetization](https://mediacube.io/en/blog/youtube-playables-monetization); [tech-insider.org](https://tech-insider.org/youtube-playables-50-markets-eu-nordics-2026/)
- **[M] Play counts:** cumulative plays are not unique players or revenue (shattered.io). Mediacube's "not a single one [of 783 games] lost plays" is empty, because a cumulative counter cannot fall (my reading). — [shattered.io](https://shattered.io/youtube-playables-50-markets-zero-iap-2026/); [Mediacube mechanics](https://mediacube.io/en/blog/youtube-playables-game-mechanics)
- **[M] Reach:** "50+ markets" may overstate real reach given staggered rollouts (36Kr/shattered analysis). Nor is any country list official. — [36Kr](https://eu.36kr.com/en/p/4027861725614465); [shattered.io](https://shattered.io/youtube-playables-50-markets-zero-iap-2026/)
- **[L]** Engagement figures in Builder coverage (for example "20% watch-time increase") have no verifiable source. — [Search summary of Blockchain.news/Quasa coverage](https://blockchain.news/ainews/youtube-playables-builder-empowers-game-creation-with-gemini-3-ai-transforming-content-with-text-video-and-image-prompts)

**Revenue claims**
- **[H] Revenue formulas:** the only official word is a pilot with no published rate. So **any** formula of "revenue per play/DAU" for Playables is invented. This repo's CLAUDE.md already documents and rejects one such imported "YouTube money formula": it mislabels a daily ARPDAU as monthly, a 30× error, and its engine has no surface inside Playables. — [Monetization reference](https://developers.google.com/youtube/gaming/playables/reference/monetization); [CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md)
- **[M] Revenue splits:** claims that the split "beats the industry average" come from companies selling monetization services and could not be checked against an official source. — [Mediacube monetization](https://mediacube.io/en/blog/youtube-playables-monetization); [Playgama monetization](https://playgama.com/blog/main/youtube-playables-monetization/)

### Inferences
- Use only the `developers.google.com/youtube/gaming/playables` tree and the YouTube Help article as rules. Treat everything else as commentary.
- When a third-party "rule" is stricter than Google's (5 MB, no localStorage at all), it usually comes from GameSnacks or from caution. Following it is harmless, but do not cite it as a reason in a certification dispute.

### Gaps
- No evidence was found either way about paid "guaranteed acceptance" scams or fake "Playables SDK" packages outside npm (for example on GitHub, Unity Asset Store or Gumroad). GitHub search was blocked here.
- The operator of playables.in is unknown. A WHOIS lookup was not possible from this environment.
