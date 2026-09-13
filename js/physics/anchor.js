// Anchoring — Bible §3.2. The best idea in the design.
//
// The source spec described the stroke in nine words: "static-until-release,
// then dynamic-on-release". Read literally that means everything you draw falls
// over. The bible even presents this as a feature — "wall falls over, player
// learns: need an anchor" — but ANCHORING DOES NOT EXIST anywhere in any of the
// source documents. The player is told to learn a lesson the game has no
// mechanism to teach.
//
// THE RULE:
//   Any part of the stroke touching static level geometry at the moment of
//   release is welded to it. Anything touching nothing is a free dynamic body,
//   and it will fall, and it should.
//
// Why this is right:
//   - It teaches itself in one attempt. Draw floating, it falls, you saw it
//     fall. Complete lesson, zero text.
//   - Stability becomes a CHOICE THE PLAYER DRAWS, not a dice roll.
//   - Every verb survives: SUPPORT is a stroke you anchor on purpose,
//     COUNTERWEIGHT is one you deliberately do not.

import Matter from './matter.js';
import { setStatic } from './adapter.js';
import { LINE } from '../constants.js';

const { Composite, Query } = Matter;

/**
 * Weld the stroke to whatever static geometry it is touching.
 * Returns the anchor points, so the renderer can spark at each one — that
 * single VFX carries the whole stability model with no UI.
 */
export function anchorStroke(ctx, strokeBody, strokePoints) {
  const statics = Composite.allBodies(ctx.world).filter((b) => b.isStatic);
  if (!statics.length) return [];

  // Weld where the stroke actually TOUCHES, not at part centres.
  //
  // Welding at part centres is wrong and it is a subtle wrong: Douglas-Peucker
  // correctly collapses a straight span to two points, giving ONE segment and
  // therefore one weld at the beam's midpoint — and a beam pinned at a single
  // point is free to rotate about it. Sampling along the path instead puts
  // welds at both ends of a span, which is what actually holds it.
  const samples = samplePath(strokePoints, 10);
  const candidates = [];

  for (const pt of samples) {
    for (const s of statics) {
      if (nearBounds(pt, s.bounds, LINE.anchorTol + LINE.thickness / 2)) {
        candidates.push({ x: pt.x, y: pt.y, staticBody: s });
        break;
      }
    }
  }
  if (!candidates.length) return [];

  // ANCHORED MEANS STATIC.
  //
  // This used to attach the stroke with up to 8 rigid zero-length constraints,
  // which made the game unplayable and shipped that way. A stroke drawn by a
  // finger is dense, so after simplification it is a compound body of ~28
  // parts, and Matter's solver cannot resolve 8 redundant rigid constraints on
  // a body like that: it oscillates violently and dumps the energy into
  // whatever touches the line. Measured on the shipped bundle, one 40-point
  // stroke produced 177,000 units of jitter in 90 frames and could launch Milo
  // at ~1800 u/s. Making it static gives exactly 0.
  //
  // This is not a workaround for a solver quirk. Bible §3.2 specifies a weld as
  // "rigid, not springy; it does not break" — which IS a static body. The
  // constraints were an implementation detail that bought nothing and cost
  // stability. A breakable or springy anchor is a real future idea; it is not
  // this, and it would need a different mechanism anyway.
  //
  // Unanchored strokes are untouched: still dynamic, still fall, still teach.
  setStatic(strokeBody, true);

  return mostSeparated(candidates, LINE.maxAnchors).map((a) => ({ x: a.x, y: a.y }));
}

/** Points every `stepLen` units along the stroke, endpoints always included. */
function samplePath(points, stepLen) {
  if (!points || points.length < 2) return points ?? [];
  const out = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const n = Math.max(1, Math.ceil(len / stepLen));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

const nearBounds = (p, b, tol) =>
  p.x >= b.min.x - tol && p.x <= b.max.x + tol &&
  p.y >= b.min.y - tol && p.y <= b.max.y + tol;

const overlaps = (a, b) =>
  a.min.x <= b.max.x && a.max.x >= b.min.x && a.min.y <= b.max.y && a.max.y >= b.min.y;

/** Greedy farthest-point selection — spread anchors out so the weld set is
 *  stable and cheap rather than clustered at one end. */
function mostSeparated(items, max) {
  if (items.length <= max) return items;
  const picked = [items[0]];
  while (picked.length < max) {
    let best = null, bestDist = -1;
    for (const it of items) {
      if (picked.includes(it)) continue;
      let nearest = Infinity;
      for (const p of picked) nearest = Math.min(nearest, Math.hypot(it.x - p.x, it.y - p.y));
      if (nearest > bestDist) { bestDist = nearest; best = it; }
    }
    if (!best) break;
    picked.push(best);
  }
  return picked;
}
