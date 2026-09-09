// Classified stroke → a real physics body.
//
// Open chain: a sequence of 16u-thick rectangles welded into ONE compound body,
// so the stroke behaves as a single rigid object rather than a loose chain.
// Closed shape: a filled polygon (a bowl you can catch things in).

import Matter from '../physics/matter.js';
import { LINE } from '../constants.js';
import { SHAPE } from './classify.js';

const { Bodies, Body, Composite } = Matter;

export function buildStrokeBody(ctx, classified) {
  const pts = classified.points;
  const opts = {
    density: LINE.density, friction: LINE.friction,
    restitution: LINE.restitution, frictionAir: 0.005,
  };

  let body = null;

  if (classified.shape === SHAPE.CLOSED) {
    const verts = pts.slice(0, -1);
    body = Bodies.fromVertices(
      centroid(verts).x, centroid(verts).y, [verts], opts, true,
    );
    // fromVertices can fail without a decomposition library — fall back rather
    // than lose the player's stroke.
    if (!body) body = buildChain(pts, opts);
  } else {
    body = buildChain(pts, opts);
  }

  if (!body) return null;
  body.gameId = 'stroke';
  Composite.add(ctx.world, body);
  return body;
}

function buildChain(pts, opts) {
  const parts = [];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 1) continue;
    parts.push(Bodies.rectangle(
      (a.x + b.x) / 2, (a.y + b.y) / 2,
      len + LINE.thickness * 0.5, LINE.thickness,
      { angle: Math.atan2(dy, dx), ...opts },
    ));
  }
  if (!parts.length) return null;
  if (parts.length === 1) return parts[0];
  return Body.create({ parts, ...opts });
}

function centroid(pts) {
  let x = 0, y = 0;
  for (const p of pts) { x += p.x; y += p.y; }
  return { x: x / pts.length, y: y / pts.length };
}
