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

import { isPlayables } from './sdk.js';

const bridge = !isPlayables && typeof globalThis.bridge?.initialize === 'function' ? globalThis.bridge : null;

export const onPlaygama = bridge !== null;

let ready = Promise.resolve(false);

/** Start the SDK. Nothing waits for it: events queue behind it. */
export function initPlaygama() {
  if (!bridge) return ready;
  ready = Promise.resolve().then(() => bridge.initialize()).then(() => true, () => false);
  return ready;
}

const quietly = (f) => { try { const p = f(); p?.catch?.(() => {}); } catch { /* best effort */ } };

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
