// Lethality — Bible §3.7.
//
// The source schema carried `"hazards": []`, empty and never once specified.
// Nothing anywhere said what makes something lethal, which decides whether the
// game is fair: if any contact with a boulder kills, then the player BLOCKS the
// boulder successfully, Milo walks into the resting rock, and dies for solving
// the puzzle.
//
// THREE KINDS:
//   contact — any touch kills. Spikes, fire, saws. Always spiky in silhouette.
//   impact  — kills only above a relative-speed threshold. THIS is the one that
//             makes BLOCK a real verb: a falling boulder kills, the same
//             boulder at rest is furniture.
//   zone    — an area rather than a body. Pit floors, out of bounds.
//
// CHANGED FROM THE BIBLE: the field is `minSpeed` (u/s), not `minImpulse`.
// The Bible's `minImpulse: 55` had no derivation. Working it through with
// mass-based impulse (reducedMass x relative speed), Milo walking into a
// resting ball scores ~4200 — so a threshold of 55 kills him for winning.
// Relative speed is mass-independent (retuning densities can't silently break
// lethality), directly meaningful, and checkable against the unit scale:
// Milo walks at 220 u/s, the speed clamp is 900 u/s, so 400 cleanly separates
// "I bumped into it" from "it fell on me".

import { getVelocity } from './physics/adapter.js';
import { MILO } from './constants.js';

export const DEFAULT_MIN_SPEED = 400;

/** Total relative speed between two bodies, in u/s. */
export function relativeSpeed(a, b) {
  const va = getVelocity(a), vb = getVelocity(b);
  return Math.hypot(va.x - vb.x, va.y - vb.y);
}

/**
 * Relative speed ALONG THE COLLISION NORMAL — how hard the two bodies actually
 * hit each other, as opposed to how fast they are sliding past one another.
 *
 * This distinction is not academic; using total relative speed here is a real
 * bug that this project hit. Milo walks at 220 u/s, so every footstep is a
 * ground contact with 220 u/s of TANGENTIAL relative speed — which stunned him
 * on his own first step and left him sliding on friction instead of walking.
 *
 * It matters just as much for lethality: a boulder rolling PAST Milo should not
 * kill him, while the same boulder falling ONTO him should. Normal speed says
 * which is which. Tangential speed cannot.
 */
export function normalSpeed(a, b, pair) {
  const va = getVelocity(a), vb = getVelocity(b);
  const rx = va.x - vb.x, ry = va.y - vb.y;
  const n = pair?.collision?.normal;
  if (!n) return Math.hypot(rx, ry);
  return Math.abs(rx * n.x + ry * n.y);
}

/**
 * Is this contact fatal to Milo?
 * `graceRadius` shrinks Milo's effective hitbox — the concrete mechanism for
 * "Milo should not die because his toe touched a hazard by one pixel", which
 * the source documents stated as a wish and implemented nowhere.
 */
export function isFatal(miloBody, otherBody, spec, pair) {
  if (!spec) return false;

  if (spec.kind === 'contact') return withinGrace(miloBody, pair, spec);
  if (spec.kind === 'impact') {
    const speed = normalSpeed(miloBody, otherBody, pair);
    if (speed < (spec.minSpeed ?? DEFAULT_MIN_SPEED)) return false;
    return withinGrace(miloBody, pair, spec);
  }
  return false;
}

/** Contact must be inside Milo's shrunk hitbox to count. */
function withinGrace(miloBody, pair, spec) {
  const grace = spec.graceRadius ?? MILO.graceShrink;
  if (!pair?.collision) return true;
  const supports = pair.collision.supports ?? [];
  if (!supports.length) return true;
  const halfW = MILO.width / 2 - grace;
  const halfH = MILO.height / 2 - grace;
  for (const s of supports) {
    if (!s) continue;
    const dx = Math.abs(s.x - miloBody.position.x);
    const dy = Math.abs(s.y - miloBody.position.y);
    if (dx <= halfW + grace && dy <= halfH + grace) return true;
  }
  return false;
}

/** Is Milo inside a lethal zone? */
export function inLethalZone(miloBody, zones) {
  const g = MILO.graceShrink;
  const x = miloBody.position.x, y = miloBody.position.y;
  const hw = MILO.width / 2 - g, hh = MILO.height / 2 - g;
  for (const z of zones ?? []) {
    if (!z.lethal) continue;
    if (x + hw > z.x && x - hw < z.x + z.w && y + hh > z.y && y - hh < z.y + z.h) return z;
  }
  return null;
}
