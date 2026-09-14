// Open chain vs closed shape.
//
// The closed branch is what makes CATCH possible — you can draw a bowl.
// Self-intersecting closed strokes fall back to open-chain treatment: reliable
// triangulation of arbitrary self-intersecting paths is a rabbit hole, and the
// fallback is never wrong, only less useful.

import { LINE } from '../constants.js';

export const SHAPE = { OPEN: 'open', CLOSED: 'closed' };

export function classify(points) {
  const a = points[0], b = points[points.length - 1];
  const closed = points.length >= 3 && Math.hypot(b.x - a.x, b.y - a.y) <= LINE.closeDist;
  if (closed && !selfIntersects(points)) return { shape: SHAPE.CLOSED, points };
  return { shape: SHAPE.OPEN, points };
}

function selfIntersects(pts) {
  for (let i = 0; i < pts.length - 1; i++) {
    for (let j = i + 2; j < pts.length - 1; j++) {
      if (i === 0 && j === pts.length - 2) continue;   // shared endpoint on a closed loop
      if (segmentsCross(pts[i], pts[i + 1], pts[j], pts[j + 1])) return true;
    }
  }
  return false;
}

const ccw = (a, b, c) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
const segmentsCross = (p1, p2, p3, p4) =>
  ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
