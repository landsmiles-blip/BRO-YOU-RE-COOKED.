// Classified stroke → a real physics body.
//
// A stroke is a LINE OF CONSTANT THICKNESS. Both branches build the same thing:
// a chain of 16u rectangles welded into one compound body. The only difference
// is that a closed stroke's chain joins back to its own start.
//
// WHY NOT A FILLED POLYGON (Bible §4.4 says closed strokes should be one):
//
//  1. Matter does not bundle poly-decomp — `Common._decomp` is null — so
//     `Bodies.fromVertices` on a CONCAVE shape silently returns its CONVEX
//     HULL. A hand-drawn bowl would become a solid lump, with no error.
//
//  2. Even with decomposition it would be wrong. §4.4 justifies the filled
//     polygon as "what makes a cradle/CATCH possible — you can draw a bowl".
//     A filled polygon is precisely what makes a cradle IMPOSSIBLE: things come
//     to rest ON a solid disc, never IN it. A bowl has to be hollow to hold
//     anything.
//
//  3. And drawing a circle draws a RIM, not a disc. A ring is what the player
//     thinks they drew.
//
// So: closed ⇒ hollow ring. It needs no dependency, matches the player's mental
// model, and yields real utility — containers, wheels, sealed loops. CATCH is
// served by an open U, which this has always supported.

import Matter from '../physics/matter.js';
import { LINE } from '../constants.js';
import { SHAPE } from './classify.js';

const { Bodies, Body, Composite } = Matter;

export function buildStrokeBody(ctx, classified) {
  const pts = classified.points.slice();

  // A closed stroke joins back to its own start. That single line is the whole
  // difference between the two branches.
  if (classified.shape === SHAPE.CLOSED) {
    const a = pts[0], b = pts[pts.length - 1];
    if (Math.hypot(b.x - a.x, b.y - a.y) > 0.5) pts.push({ x: a.x, y: a.y });
  }

  const body = buildChain(pts, {
    density: LINE.density, friction: LINE.friction,
    restitution: LINE.restitution, frictionAir: 0.005,
  });
  if (!body) return null;

  body.gameId = 'stroke';

  // THE STROKE'S OWN GEOMETRY, in local space, so the renderer can draw the
  // line the player actually drew.
  //
  // Without this the renderer rebuilt the line from PART CENTRES — which are
  // segment MIDPOINTS — so the drawn line was short by half a segment at each
  // end and visibly snapped inwards the moment it committed. A near-straight
  // drag simplifies to 2 points and 1 part, which hit a third code path again
  // (opposite corners of a rectangle). Three renderings of one object, none of
  // them the thing the player drew.
  body.strokePath = pts.map((p) => ({ x: p.x - body.position.x, y: p.y - body.position.y }));

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
      // Overlap each joint by half a thickness so corners weld solidly and a
      // ring has no gaps for a small body to squeeze through.
      len + LINE.thickness * 0.5, LINE.thickness,
      { angle: Math.atan2(dy, dx), ...opts },
    ));
  }
  if (!parts.length) return null;
  if (parts.length === 1) return parts[0];
  return Body.create({ parts, ...opts });
}
