// The ONLY file that touches the YouTube Playables SDK.
//
// Outside Playables every call is a safe no-op, so the game runs in a plain
// browser tab for the whole of development. Certification requires the SDK
// script to load BEFORE any game code (see index.html) and requires that
// onPause halts EVERYTHING — loop, physics, audio, input, rendering.
//
// Verified SDK surface: firstFrameReady, gameReady, saveData, loadData,
// onPause, onResume, requestRewardedAd(id).  See docs/EXECUTION_ROADMAP §2.

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
