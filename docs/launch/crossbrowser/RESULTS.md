# Cross-browser smoke test, 9 Nov 2026 (Playgama rule 1.7.3)

What: `dist/playgama/index.html` (the exact page Playgama will run, with the real Bridge script loading from its CDN, which answers as a mock off Playgama) loaded in three engines at three window shapes (405x720, 1280x720, 800x800). Per run: boot to the frozen frame, frame rate over 3 s, a finger-like stroke drawn with the mouse, 6 s of play, console and page errors, failed requests, audio state. Raw numbers: `results-20261109.json`. Script: `xbrowser.mjs`.

| Engine (Playwright build) | Boots | Errors | fps (headless) | Run completes | Sound |
|---|---|---|---|---|---|
| Chromium 1234 (Chrome engine) | 3 of 3 | none | about 100 | yes | context running, 15 samples decoded, music started |
| Firefox 157 | 3 of 3 | none | about 100 | yes | context running, 15 samples decoded, music started |
| WebKit 27 (Safari's engine, Windows port) | 3 of 3 | none | 88 to 176 | yes | NOT TESTABLE: this build has no AudioContext at all |

Findings
- [MEASURED] No console errors, page errors or failed requests in 9 of 9 runs; every window shape fills the page and a stroke is drawn, simulated and scored (screenshots read: Firefox landscape frozen frame, WebKit square result card with two stars).
- [MEASURED] The earlier "about 1 fps" reading was NOT reproduced: about 100 fps in Chromium and Firefox, 88 to 176 in WebKit. [INFERRED] it was a background-throttled automated tab, not the game. Real devices are still unmeasured; the `performance_sample` events from Sandbox players will say.
- [MEASURED] In WebKit the game found neither `AudioContext` nor `webkitAudioContext`, switched sound off, and carried on with no error (`js/audio.js` line 67-68). That is graceful degradation. It is a limit of Playwright's Windows WebKit, not evidence about real Safari, which has Web Audio. `decodeAudioData` is called in both promise and callback form (`js/audio.js` line 133-136), so older Safari should also decode the MP3 bank. Real Safari sound is UNVERIFIED.
- Not tested: Opera, Edge (both Chromium-based, so Chromium is a proxy [INFERRED]), macOS, real Android and iOS touch input, real Safari sound.
