// The ONLY file that touches the YouTube Playables SDK.
//
// Outside Playables every call is a safe no-op, so the game runs in a plain
// browser tab for the whole of development. Certification requires the SDK
// script to load BEFORE any game code (see index.html) and requires that
// onPause halts EVERYTHING — loop, physics, audio, input, rendering.
//
// Verified SDK surface: firstFrameReady, gameReady, saveData, loadData,
// onPause, onResume, ads.requestInterstitialAd(), ads.requestRewardedAd(id).
// See docs/EXECUTION_ROADMAP §2.

const sdk = typeof globalThis.ytgame !== 'undefined' ? globalThis.ytgame : null;

export const isPlayables = sdk !== null;

let firstFrameSent = false;
let gameReadySent = false;

export function firstFrameReady() {
  if (firstFrameSent) return;
  firstFrameSent = true;
  try { sdk?.game?.firstFrameReady?.(); } catch (e) { console.warn('sdk.firstFrameReady', e); }
}

/** Bundle size is measured page-load → gameReady, so call this the INSTANT
 *  input is accepted — before any deferrable warm-up. Amendment A.4. */
export function gameReady() {
  if (gameReadySent) return;
  gameReadySent = true;
  try { sdk?.game?.gameReady?.(); } catch (e) { console.warn('sdk.gameReady', e); }
}

export function onPause(fn) {
  if (sdk?.system?.onPause) { try { sdk.system.onPause(fn); return; } catch { /* fall through */ } }
  document.addEventListener('visibilitychange', () => { if (document.hidden) fn(); });
  window.addEventListener('blur', fn);
}

export function onResume(fn) {
  if (sdk?.system?.onResume) { try { sdk.system.onResume(fn); return; } catch { /* fall through */ } }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) fn(); });
  window.addEventListener('focus', fn);
}

// ── Persistence ─────────────────────────────────────────────────────────
//
// These two were named in this file's own header from the beginning and never
// implemented, so nothing the player did was ever remembered — which is also a
// certification item, not just a nicety. Outside Playables they fall back to
// localStorage so progress works in a plain tab during development and in the
// open-web build, which is a different product on the same code (roadmap §1.1).
//
// The SDK's saveData is asynchronous and can reject (quota, signed-out user,
// transient failure). None of those are worth interrupting a game for, so every
// path here resolves and failure is silent to the player — but the write is
// mirrored to localStorage regardless, so a failed cloud save still survives a
// reload on the same device.

const LOCAL_KEY = 'byc.save.v1';

export function saveData(text) {
  try { globalThis.localStorage?.setItem(LOCAL_KEY, text); } catch { /* private mode */ }
  if (!sdk?.game?.saveData) return Promise.resolve(false);
  try {
    return Promise.resolve(sdk.game.saveData(text)).then(() => true).catch(() => false);
  } catch { return Promise.resolve(false); }
}

export function loadData() {
  const local = (() => {
    try { return globalThis.localStorage?.getItem(LOCAL_KEY) ?? null; } catch { return null; }
  })();
  if (!sdk?.game?.loadData) return Promise.resolve(local);
  try {
    // Prefer the platform's copy — it follows the player across devices — but
    // fall back rather than lose a local save when the call fails or is empty.
    return Promise.resolve(sdk.game.loadData())
      .then((d) => (typeof d === 'string' && d.length ? d : local))
      .catch(() => local);
  } catch { return Promise.resolve(local); }
}

// ── Ads ─────────────────────────────────────────────────────────────────
//
// `requestRewardedAd` was listed in this file's header as part of the verified
// SDK surface from the day the file was written, and was never implemented —
// the identical bug to saveData/loadData above, which meant nothing a player
// did was ever remembered until somebody noticed. There was no ad call
// anywhere in this repo, so the game had no monetization surface at all.
//
// Both calls are best-effort BY DESIGN, not by laziness: the platform
// documents that a request "makes no guarantees about whether the ad was
// shown". So neither rejects, neither throws, and neither blocks a frame. An
// ad that fails to load must cost the player exactly nothing.
//
// Nothing here pauses the game. YouTube fires its own system pause and resume
// around an ad, and main.js already wires those to halt the loop, physics,
// rendering AND audio — which is a certification item in its own right.

/** Best-effort interstitial at a level boundary. Resolves false if not shown. */
export function requestInterstitialAd() {
  if (!sdk?.ads?.requestInterstitialAd) return Promise.resolve(false);
  try {
    return Promise.resolve(sdk.ads.requestInterstitialAd())
      .then(() => true).catch(() => false);
  } catch { return Promise.resolve(false); }
}

/**
 * WIRED AND DELIBERATELY UNCALLED — read this before adding a call site.
 *
 * The obvious rewarded ads for a puzzle game are an undo and a hint, and this
 * game can have neither. "One line. One shot." is the whole premise, so a paid
 * undo sells the exact tension every level is built on. A paid hint is worse:
 * the rule here is that a hint names the PROBLEM and never the solution, so one
 * that obeys the rule is worth nothing to buy, and one worth buying breaks it.
 *
 * It exists because the header above claimed it existed, and a surface that is
 * documented but absent is how saveData stayed broken. If a level skip or a
 * cosmetic ever wants it, the wiring is done and no second SDK pass is needed.
 */
export function requestRewardedAd(rewardId) {
  if (typeof rewardId !== 'string' || rewardId.length === 0) return Promise.resolve(false);
  if (!sdk?.ads?.requestRewardedAd) return Promise.resolve(false);
  try {
    return Promise.resolve(sdk.ads.requestRewardedAd(rewardId))
      .then(() => true).catch(() => false);
  } catch { return Promise.resolve(false); }
}
