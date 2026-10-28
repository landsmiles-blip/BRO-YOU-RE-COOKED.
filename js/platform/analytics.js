// Real on the open web. HARD NO-OP inside Playables — external network calls
// are prohibited outright, with Google Analytics and GameAnalytics named
// explicitly. The Playables build is grepped at build time for fetch /
// XMLHttpRequest / WebSocket / sendBeacon and the build FAILS on any hit.
//
// Consequence (Bible §3.13): an open-web build is the only instrumented
// version of this game that will ever exist — and since 25 Oct 2026 that is
// the Playgama build, the first one with a transport.

import { isPlayables } from './sdk.js';
import { onPlaygama, report } from './playgama.js';

const buffer = [];

export function track(event, props = {}) {
  if (isPlayables) return;                     // no-op, no network, no exceptions
  // The Playgama build is the one transport: it carries real players'
  // attempts back for the difficulty curve (js/platform/playgama.js).
  if (onPlaygama) report(event, props);
  buffer.push({ event, props, t: Date.now() });
  if (buffer.length > 500) buffer.shift();
}

/** Dev/test hook — never ships a transport. */
export function _drain() { return buffer.splice(0, buffer.length); }
