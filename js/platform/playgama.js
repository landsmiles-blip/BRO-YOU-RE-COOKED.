// The ONLY file that touches Playgama Bridge — the SDK of Playgama's portals
// and of its Sandbox, launched 14 Oct 2026 for games built with coding agents.
//
// WHY THIS BUILD EXISTS. The difficulty curve has never met a real player:
// every number behind it is simulated (tools/lib/fit-curve.py says so at the
// bottom of its output). The game already reports each run's end — level,
// outcome, attempt number — through js/platform/analytics.js. On Playgama
// those reports reach the developer dashboard, and attempts to the first win,
// level by level, is exactly what `fit-curve.py --real` calibrates against.
//
// Present ONLY in dist/playgama/, which loads the SDK from Playgama's CDN
// before the game. The SDK is LGPL-3.0, so it is loaded, never bundled.
// Everywhere else `globalThis.bridge` is absent and every call here does
// nothing — and inside YouTube Playables, where no external call is allowed,
// it is ignored even if something put it there.
//
// API checked against @playgama/bridge 2.3.1's own type definitions
// (initialize, analytics.send, platform.sendMessage with game_ready /
// level_started / level_completed / level_failed), 25 Oct 2026.

import { isPlayables, setBackend } from './sdk.js';

const bridge = !isPlayables && typeof globalThis.bridge?.initialize === 'function' ? globalThis.bridge : null;

export const onPlaygama = bridge !== null;

let ready = Promise.resolve(false);

const quietly = (f) => { try { const p = f(); p?.catch?.(() => {}); } catch { /* best effort */ } };

// ── Playgama's Required steps (wiki: Bridge SDK > API), 4 Nov 2026 ──────────
//
//   4  progress ONLY through bridge.storage, never localStorage  -> saveData/loadData
//   5  start muted if platform.isAudioEnabled is false, follow the audio and
//      pause events                                               -> audio + pause below
//   7  showInterstitial() at every natural pause, no own timers   -> game.js adBreak
//   3  platform.language: read once after init. BYC ships English only and
//      declares English only in the publication form (rule 3.4.1/3.4.3), so it is
//      read, exported and sent with the first analytics event, not used to switch.
//
// All of it is registered with sdk.js's backend slot, and only when the Bridge
// is on the page, so YouTube and the web build are unchanged.

const SAVE_KEY = 'byc_save_v1';
// Playgama Required step 5: start muted if the platform says so. Until the Bridge
// has answered we do not know, so the safe start is MUTED; initPlaygama() sets the
// real state the moment initialize() resolves (or turns sound on if it fails).
let audioOn = false;
let loaded = false;                  // nothing is saved until a load has landed (see sdk.js)
export let language = 'en';
const audioFns = [];
const pauseFns = [];
const resumeFns = [];

if (bridge) {
  const loadSave = () => ready.then((ok) => {
    if (!ok) return null;
    return Promise.resolve(bridge.storage.get([SAVE_KEY])).then((d) => {
      loaded = true;
      const v = Array.isArray(d) ? d[0] : d?.[SAVE_KEY];
      return typeof v === 'string' && v.length ? v : null;
    });
  }).catch(() => { loaded = true; return null; });   // a failed read is a fresh start, as in Playables

  setBackend({
    pacedAds: true,
    loadData: loadSave,
    saveData: (text) => {
      if (!loaded) return Promise.resolve(false);
      return ready.then((ok) => (ok
        ? Promise.resolve(bridge.storage.set([SAVE_KEY], [text])).then(() => true)
        : false)).catch(() => false);
    },
    isAudioEnabled: () => audioOn,
    onAudioEnabledChange: (fn) => { audioFns.push(fn); },
    onPause: (fn) => { pauseFns.push(fn); },
    onResume: (fn) => { resumeFns.push(fn); },
    // Playgama 2.2.5 / Bridge "Reward ONLY in the rewarded state": resolves true
    // only if the ad was watched to the end. game.js grants the skip on that and
    // nothing else here (YouTube keeps its grant-anyway rule).
    rewardedSupported: () => bridge.advertisement?.isRewardedSupported !== false,
    requestRewardedAd: () => ready.then((ok) => new Promise((resolve) => {
      if (!ok || bridge.advertisement?.isRewardedSupported === false) { resolve(false); return; }
      let done = false;
      const finish = (v) => { if (done) return; done = true; quietly(() => bridge.advertisement.off?.(bridge.EVENT_NAME.REWARDED_STATE_CHANGED, onState)); resolve(v); };
      const onState = (s) => { if (s === 'rewarded') finish(true); else if (s === 'closed' || s === 'failed') finish(false); };
      bridge.advertisement.on(bridge.EVENT_NAME.REWARDED_STATE_CHANGED, onState);
      setTimeout(() => finish(false), 180000);
      quietly(() => bridge.advertisement.showRewarded());
    })).catch(() => false),
    requestInterstitialAd: () => ready.then((ok) => {
      if (!ok || bridge.advertisement?.isInterstitialSupported === false) return false;
      quietly(() => bridge.advertisement.showInterstitial());
      return true;
    }).catch(() => false),
  });
}

/** Start the SDK. Nothing waits for it: events queue behind it. */
export function initPlaygama() {
  if (!bridge) return ready;
  ready = Promise.resolve().then(() => bridge.initialize()).then(() => {
    quietly(() => { language = bridge.platform.language || 'en'; });
    // The initial state must be applied by hand: the event only fires on change.
    const apply = (on) => { audioOn = on !== false; audioFns.forEach((f) => quietly(() => f(audioOn))); };
    quietly(() => bridge.platform.on(bridge.EVENT_NAME.AUDIO_STATE_CHANGED, apply));
    quietly(() => bridge.platform.on(bridge.EVENT_NAME.PAUSE_STATE_CHANGED,
      (p) => (p ? pauseFns : resumeFns).forEach((f) => quietly(f))));
    apply(bridge.platform.isAudioEnabled !== false);
    return true;
  }, () => {
    // No Bridge answer: behave like the open web rather than stay silent for ever.
    audioOn = true;
    audioFns.forEach((f) => quietly(() => f(true)));
    return false;
  });
  return ready;
}

// ── performance_sample (Playgama telemetry guide v1.1.2, 5 Nov 2026) ────────
//
// WHY: nobody has played this game on a real device. The loop caps catch-up at
// 8 physics steps a frame (js/constants.js MAX_STEPS_PER_FRAME), so a slow
// device stretches the "live" beat and ignores input meanwhile. On the one PC it
// was measured on the page ran at 1-6 fps for stretches (docs/research/
// most-played/red-team.md 2i); a 30 s sample taken the same way showed every
// frame at about 1010 ms, which looks like Chrome throttling an automated tab
// to ~1 fps rather than a slow game — UNVERIFIED either way. The Sandbox's own
// players will say how common low frame rates really are, at no cost to them.
// (A visible but occluded window is not "hidden", so such frames are counted.)
//
// One aggregated event about every 30 s of ACTIVE, VISIBLE gameplay, sent as a
// custom event (the guide's transport until Bridge has system events). Frames
// from loading, menus, pause, a hidden page and the first frame after any of
// those are never counted: a background gap must not become a frozen frame.
// Inert off Playgama. Nothing personal; stable, bounded field names.

export const BUILD_VERSION = 'byc-1.0.2';
const PERF_WINDOW_MS = 30000;
const PERF_TARGET_FPS = 60;      // the display's requestAnimationFrame rate, which is all the loop asks for
let perf = null;
let perfSkip = true;

/** Call once per animation frame with the frame's duration and whether gameplay is active. */
export function perfFrame(dtMs, active) {
  if (!bridge) return;
  if (!active || (typeof document !== 'undefined' && document.hidden)) { perfSkip = true; return; }
  if (perfSkip) { perfSkip = false; return; }
  if (!(dtMs > 0)) return;
  if (!perf) perf = { start: performance.now(), dts: [], active: 0 };
  perf.dts.push(dtMs);
  perf.active += dtMs;
  if (perf.active >= PERF_WINDOW_MS) flushPerf();
}

export function perfSample({ start, dts, active }, endMs) {
  const sorted = dts.slice().sort((a, b) => a - b);
  const n = sorted.length;
  const at = (q) => sorted[Math.min(n - 1, Math.floor(q * n))];
  const r = (x) => Math.round(x * 10) / 10;
  const over = (ms) => dts.reduce((c, d) => c + (d > ms ? 1 : 0), 0);
  return {
    target_fps: PERF_TARGET_FPS,
    window_ms: Math.round(endMs - start),
    active_ms: Math.round(active),
    frame_count: n,
    fps_avg: r(n / (active / 1000)),
    fps_p10: r(1000 / at(0.9)),            // 10th percentile of fps = the slowest tenth of frames
    frame_time_p50_ms: r(at(0.5)),
    frame_time_p95_ms: r(at(0.95)),
    frame_time_p99_ms: r(at(0.99)),
    frame_time_max_ms: r(sorted[n - 1]),
    frames_over_50ms: over(50),
    frames_over_100ms: over(100),
    frames_over_250ms: over(250),
    frames_over_500ms: over(500),
    frames_over_1000ms: over(1000),
    build_version: BUILD_VERSION,
  };
}

function flushPerf() {
  const p = perf;
  perf = null;
  if (!p || p.dts.length < 2) return;
  const sample = perfSample(p, performance.now());
  ready.then((ok) => { if (ok) quietly(() => bridge.analytics.send('performance_sample', sample)); });
}

/** Tell the portal the game is interactive (their equivalent of gameReady). */
export function playgamaGameReady() {
  ready.then((ok) => { if (ok) quietly(() => bridge.platform.sendMessage('game_ready')); });
}

/**
 * One analytics event, from js/platform/analytics.js. Every event goes as a
 * custom event; the start and end of a run also go as the portal's own level
 * messages, so its standard per-level funnel works with no setup.
 */
export function report(event, props = {}) {
  if (!bridge) return;
  ready.then((ok) => {
    if (!ok) return;
    quietly(() => bridge.analytics.send(event, props));
    if (event === 'attempt_start') {
      quietly(() => bridge.platform.sendMessage('level_started', { level: props.level }));
    } else if (event === 'run_end' && props.outcome !== 'aborted') {
      const won = props.outcome === 'success';
      quietly(() => bridge.platform.sendMessage(won ? 'level_completed' : 'level_failed', { level: props.level }));
    }
  });
}
