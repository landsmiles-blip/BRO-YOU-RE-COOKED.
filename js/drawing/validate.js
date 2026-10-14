// Stroke validation.
//
// CRITICAL RULE: rejection is NEVER a failed attempt. It is a no-op — the
// stroke snaps back, the player keeps drawing, nothing is spent. The player
// must never be punished for a technical input event.

import { LINE, MILO, DOG } from '../constants.js';
import { pathLength } from './simplify.js';

export const REJECT = {
  TOO_FEW: 'too-few-points',
  TOO_SHORT: 'too-short',
  TOO_LONG: 'too-long',
  OVERLAPS_MILO: 'overlaps-milo',
  OVERLAPS_DOG: 'overlaps-dog',
  OVERLAPS_GOAL: 'overlaps-goal',
};

export function validate(points, level, miloBody, dogBodies = []) {
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

  // The same for the dog: a line drawn through it would shove it out of the
  // stroke, which is not a thing the player meant to do to a dog. Tested along
  // the SEGMENTS, not just at the points: a simplified stroke can have two
  // points 300 units apart, and the census found winners drawn straight
  // through the dog between them.
  for (const d of dogBodies) {
    const dw = DOG.width / 2 + pad, dh = DOG.height / 2 + pad;
    for (let k = 0; k < points.length; k++) {
      const a = points[k], b = points[k + 1] ?? a;
      const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 6));
      for (let i = 0; i <= n; i++) {
        const x = a.x + ((b.x - a.x) * i) / n, y = a.y + ((b.y - a.y) * i) / n;
        if (Math.abs(x - d.position.x) < dw && Math.abs(y - d.position.y) < dh) {
          return { ok: false, reason: REJECT.OVERLAPS_DOG };
        }
      }
    }
  }

  const g = level.goal;
  for (const p of points) {
    if (p.x > g.x - g.w / 2 - pad && p.x < g.x + g.w / 2 + pad &&
        p.y > g.y - g.h - pad && p.y < g.y + pad) {
      return { ok: false, reason: REJECT.OVERLAPS_GOAL };
    }
  }

  return { ok: true, length: len };
}
