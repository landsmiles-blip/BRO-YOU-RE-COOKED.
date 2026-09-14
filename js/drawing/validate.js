// Stroke validation.
//
// CRITICAL RULE: rejection is NEVER a failed attempt. It is a no-op — the
// stroke snaps back, the player keeps drawing, nothing is spent. The player
// must never be punished for a technical input event.

import { LINE, MILO } from '../constants.js';
import { pathLength } from './simplify.js';

export const REJECT = {
  TOO_FEW: 'too-few-points',
  TOO_SHORT: 'too-short',
  TOO_LONG: 'too-long',
  OVERLAPS_MILO: 'overlaps-milo',
  OVERLAPS_GOAL: 'overlaps-goal',
  IN_DENY_ZONE: 'in-deny-zone',
};

export function validate(points, level, miloBody) {
  if (points.length < 2) return { ok: false, reason: REJECT.TOO_FEW };

  const len = pathLength(points);
  if (len < LINE.minLength) return { ok: false, reason: REJECT.TOO_SHORT };
  if (len > (level.drawing?.maxLength ?? LINE.maxLengthDefault)) {
    return { ok: false, reason: REJECT.TOO_LONG };
  }

  // Can't release a stroke through Milo. This single rule kills the
  // "I accidentally drew through my own guy" complaint before it exists,
  // without weakening the physics anywhere else — the stroke still collides
  // with him once the simulation is running.
  const pad = LINE.thickness / 2;
  const mx = miloBody.position.x, my = miloBody.position.y;
  const hw = MILO.width / 2 + pad, hh = MILO.height / 2 + pad;
  for (const p of points) {
    if (Math.abs(p.x - mx) < hw && Math.abs(p.y - my) < hh) {
      return { ok: false, reason: REJECT.OVERLAPS_MILO };
    }
  }

  const g = level.goal;
  for (const p of points) {
    if (p.x > g.x - g.w / 2 - pad && p.x < g.x + g.w / 2 + pad &&
        p.y > g.y - g.h - pad && p.y < g.y + pad) {
      return { ok: false, reason: REJECT.OVERLAPS_GOAL };
    }
  }

  for (const z of level.drawing?.denyZones ?? []) {
    for (const p of points) {
      if (p.x > z.x && p.x < z.x + z.w && p.y > z.y && p.y < z.y + z.h) {
        return { ok: false, reason: REJECT.IN_DENY_ZONE };
      }
    }
  }

  return { ok: true, length: len };
}
