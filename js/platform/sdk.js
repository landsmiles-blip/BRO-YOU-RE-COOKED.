// The ONLY file that touches the YouTube Playables SDK.
//
// Outside Playables every call is a safe no-op, so the game runs in a plain
// browser tab for the whole of development. Certification requires the SDK
// script to load BEFORE any game code (see index.html) and requires that
// onPause halts EVERYTHING — loop, physics, audio, input, rendering.
//
// Verified SDK surface: IN_PLAYABLES_ENV, firstFrameReady, gameReady,
// saveData, loadData, onPause, onResume, isAudioEnabled, onAudioEnabledChange,
// ads.requestInterstitialAd(), ads.requestRewardedAd(id).
// See docs/CERTIFICATION.md, which links Google's requirement pages.

const sdk = typeof globalThis.ytgame !== 'undefined' ? globalThis.ytgame : null;

export const isPlayables = sdk !== null;

// The SDK script can be on a page that is NOT inside Playables — the YouTube
// build opened in a plain tab — and it says so with IN_PLAYABLES_ENV, which
// Google's docs say to read together with a check that ytgame exists. A flag
// that is missing is read as "inside": the one thing that must never happen
// in Playables is a second save mechanism, so that is the side to err on.
const inPlayablesEnv = sdk !== null && sdk.IN_PLAYABLES_ENV !== false;

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

// ── YouTube's own sound setting ─────────────────────────────────────────
//
// THE GAME NEVER ASKED. The SDK reports whether game audio is enabled in
// YouTube's settings, and says to start the game's audio from it and follow
// it when it changes; Google's getting-started guide lists both calls among
// the required integrations. Until this, the only thing between a muted
// YouTube and this game's sound was the browser's autoplay policy. Off the
// platform there is no such setting, so audio is simply on.

export function isAudioEnabled() {
  try {
    const v = sdk?.system?.isAudioEnabled?.();
    return typeof v === 'boolean' ? v : true;
  } catch { return true; }
}

export function onAudioEnabledChange(fn) {
  try { sdk?.system?.onAudioEnabledChange?.((on) => fn(on !== false)); } catch { /* nothing to follow */ }
}

// ── Persistence ─────────────────────────────────────────────────────────
//
// These two were named in this file's own header from the beginning and never
// implemented, so nothing the player did was ever remembered — which is also a
// certification item, not just a nicety. Outside Playables they use
// localStorage so progress works in a plain tab during development and in the
// open-web build, which is a different product on the same code.
//
// INSIDE PLAYABLES THE CLOUD SAVE IS THE ONLY SAVE. "Game MUST NOT use any
// other mechanism to save user progress" is Google's wording, and this file
// used to mirror every save to localStorage anyway, as a backup — which is
// exactly another mechanism, and fails certification. Google's own sample
// does what this now does: the cloud inside Playables, localStorage outside,
// never both.
//
// AND NOTHING IS SAVED UNTIL THE LOAD HAS SUCCEEDED. The platform rejects a
// saveData that comes before loadData completes, and that rule is protecting
// the player: progress loads in the background (js/main.js), so a save made
// before it arrives would write a FRESH progress over their real one. A save
// asked for too early — or after a load that failed — resolves false without
// being sent; js/main.js folds that early play into the save when it arrives.
//
// The SDK's saveData is asynchronous and can reject (quota, signed-out user,
// transient failure). None of those are worth interrupting a game for, so every
// path here resolves and failure is silent to the player.

const LOCAL_KEY = 'byc.save.v1';

let loaded = false;

export function saveData(text) {
  if (!inPlayablesEnv) {
    try { globalThis.localStorage?.setItem(LOCAL_KEY, text); return Promise.resolve(true); } catch { /* private mode */ }
    return Promise.resolve(false);
  }
  if (!loaded || !sdk.game?.saveData) return Promise.resolve(false);
  try {
    return Promise.resolve(sdk.game.saveData(text)).then(() => true).catch(() => false);
  } catch { return Promise.resolve(false); }
}

export function loadData() {
  if (!inPlayablesEnv) {
    try { return Promise.resolve(globalThis.localStorage?.getItem(LOCAL_KEY) ?? null); } catch { /* private mode */ }
    return Promise.resolve(null);
  }
  if (!sdk.game?.loadData) return Promise.resolve(null);
  try {
    // An empty string is a player with no save yet: a fresh start.
    return Promise.resolve(sdk.game.loadData())
      .then((d) => { loaded = true; return typeof d === 'string' && d.length ? d : null; })
      .catch(() => null);
  } catch { return Promise.resolve(null); }
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
 * THE ONE REWARDED AD IS THE SKIP (js/game.js, docs/PLAN.md section 7) — read
 * this before adding a second call site.
 *
 * The obvious rewarded ads for a puzzle game are an undo and a hint, and this
 * game can have neither. "One line. One shot." is the whole premise, so a paid
 * undo sells the exact tension every level is built on. A paid hint is worse:
 * the rule here is that a hint names the PROBLEM and never the solution, so one
 * that obeys the rule is worth nothing to buy, and one worth buying breaks it.
 * A skip does neither, and it is granted whether or not an ad actually plays.
 * tools/test/ads.js fails on a rewarded request from anywhere else.
 */
export function requestRewardedAd(rewardId) {
  if (typeof rewardId !== 'string' || rewardId.length === 0) return Promise.resolve(false);
  if (!sdk?.ads?.requestRewardedAd) return Promise.resolve(false);
  try {
    return Promise.resolve(sdk.ads.requestRewardedAd(rewardId))
      .then(() => true).catch(() => false);
  } catch { return Promise.resolve(false); }
}
