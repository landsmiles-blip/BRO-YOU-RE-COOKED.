// Real on the open web. HARD NO-OP inside Playables — external network calls
// are prohibited outright, with Google Analytics and GameAnalytics named
// explicitly. The Playables build is grepped at build time for fetch /
// XMLHttpRequest / WebSocket / sendBeacon and the build FAILS on any hit.
//
// Consequence (Bible §3.13): the open-web build is the only instrumented
// version of this game that will ever exist.

import { isPlayables } from './sdk.js';

const buffer = [];

export function track(event, props = {}) {
  if (isPlayables) return;                     // no-op, no network, no exceptions
  buffer.push({ event, props, t: Date.now() });
  if (buffer.length > 500) buffer.shift();
}

/** Dev/test hook — never ships a transport. */
export function _drain() { return buffer.splice(0, buffer.length); }
