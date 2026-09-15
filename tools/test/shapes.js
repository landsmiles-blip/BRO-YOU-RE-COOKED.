// GATE TEST 4 — the closed-stroke branch.
//
// This coverage exists separately from A4 on purpose. v0.4 §8.5 added A4 to
// exercise the closed branch, then specified a bowl that "can't be a fully
// sealed container" or Milo is trapped and trips the stuck timer. An unsealed
// bowl is an OPEN chain — so the level built to test the closed branch cannot
// test it. This does.
//
// A closed ring must RETAIN what falls into it. The same stroke left open must
// let it escape. If the closed branch ever regresses to a filled convex hull,
// the retain case fails immediately: a body cannot rest inside a solid lump.

import { createWorld, addRect, addCircle, step, destroyWorld } from '../../js/physics/adapter.js';
import { classify, SHAPE } from '../../js/drawing/classify.js';
import { buildStrokeBody } from '../../js/drawing/bodyFactory.js';
import { PHYSICS_HZ } from '../../js/constants.js';

let failures = 0;
const assert = (label, cond, detail = '') => {
  if (!cond) failures++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

/**
 * A hand-drawn circle of `n` points centred (cx,cy).
 *
 * `gapPts > 0` produces an OPEN arc whose two ENDPOINTS sit either side of a
 * gap at the BOTTOM — where a dropped ball actually lands.
 *
 * Both details were wrong in earlier versions of this helper and both produced
 * false results: a gap in the upper-right let the ball land on the intact floor
 * of the arc (containment "passed" when it should not have), and a gap in the
 * middle of the path left the endpoints coincident, which classifies as CLOSED
 * and is anyway something a single continuous stroke cannot draw.
 */
function ring(cx, cy, r, n = 16, gapPts = 0) {
  const pts = [];
  const bottom = n / 4;                      // index of the +y (downward) point
  const half = gapPts / 2;
  const start = bottom + half;               // just past the gap
  const count = n - gapPts;                  // all the way round, stopping before it
  const steps = gapPts > 0 ? count : n;
  for (let k = 0; k <= steps; k++) {
    const a = ((start + k) / n) * Math.PI * 2;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}

/** Drop a small ball at the centre of the stroke; report where it ends up. */
function dropInto(points, label) {
  const ctx = createWorld();
  addRect(ctx, { id: 'floor', x: 400, y: 1200, w: 900, h: 80, isStatic: true });

  const classified = classify(points);
  const body = buildStrokeBody(ctx, classified);
  // Pin the stroke so the test measures containment, not whether it falls.
  if (body) body.isStatic = true;

  const ball = addCircle(ctx, { id: 'ball', x: 400, y: 600, radius: 10, frictionAir: 0 });
  for (let i = 0; i < PHYSICS_HZ * 4; i++) step(ctx);

  const res = { shape: classified.shape, y: ball.position.y, parts: body?.parts.length ?? 0 };
  destroyWorld(ctx);
  return res;
}

console.log('\nCLOSED-STROKE BRANCH — a ring must hold what falls into it\n');

const closedPts = ring(400, 640, 90, 16, 0);
const closed = classify(closedPts);
assert('a drawn circle classifies as CLOSED', closed.shape === SHAPE.CLOSED, closed.shape);

const held = dropInto(closedPts, 'closed');
// Contained: the ball settles inside the ring, well above the floor at y≈1160.
assert('a closed ring RETAINS the ball', held.y < 800,
       `ball settled at y=${held.y.toFixed(0)} (floor is y≈1160)`);

const openPts = ring(400, 640, 90, 16, 5);   // same stroke, a chunk missing
const open = classify(openPts);
assert('the same stroke with a gap classifies as OPEN', open.shape === SHAPE.OPEN, open.shape);

const escaped = dropInto(openPts, 'open');
assert('an open arc lets the ball ESCAPE', escaped.y > 900,
       `ball fell to y=${escaped.y.toFixed(0)}`);

// A self-intersecting closed stroke must fall back to open-chain, never crash.
const figure8 = [
  { x: 340, y: 600 }, { x: 460, y: 700 }, { x: 460, y: 600 },
  { x: 340, y: 700 }, { x: 342, y: 602 },
];
const f8 = classify(figure8);
assert('a self-intersecting closed stroke falls back to OPEN', f8.shape === SHAPE.OPEN, f8.shape);

// ── THE LINE ON SCREEN IS THE LINE THEY DREW ────────────────────────────
//
// Reported from play: "you draw it flat but instead it stands erect; draw it
// right and it switches and faces left."
//
// `body.strokePath` was stored by subtracting the body position and nothing
// else, which leaves it in WORLD orientation. Both readers — the live renderer
// and the death cam — then rotate it by `body.angle` to place it, so the line
// was drawn at DOUBLE the angle it was drawn at. A compound stroke has angle 0
// and was always fine; a near-straight drag simplifies to two points and ONE
// part, and that part carries the segment's own angle. Flat looked perfect,
// which is exactly why it read as an intermittent glitch.
//
// The physics was never wrong. Only the picture was, which is the one kind of
// bug no assertion about positions can catch — so this asserts the PICTURE.
console.log('\nWHAT THEY DREW IS WHAT GETS DRAWN\n');
{
  // Exactly what js/render/world.js drawStrokeBody() does with strokePath.
  const asDrawn = (body) => {
    const cos = Math.cos(body.angle), sin = Math.sin(body.angle);
    return body.strokePath.map((p) => ({
      x: body.position.x + p.x * cos - p.y * sin,
      y: body.position.y + p.x * sin + p.y * cos,
    }));
  };
  const angleOf = (a, b) => Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;

  for (const deg of [0, 20, 45, 90, 135, 180, -60]) {
    const r = deg * Math.PI / 180;
    const a = { x: 360, y: 700 };
    const b = { x: 360 + Math.cos(r) * 120, y: 700 + Math.sin(r) * 120 };
    const w = createWorld();
    const body = buildStrokeBody(w, classify([a, b]));
    const shown = asDrawn(body);
    // Compare as a turn, so 180 and -180 are the same direction.
    let off = Math.abs(((angleOf(shown[0], shown[shown.length - 1]) - deg + 540) % 360) - 180);
    assert(`a ONE-PART stroke drawn at ${deg}deg is drawn at ${deg}deg`,
           off < 1, `off by ${off.toFixed(1)}deg`);
    destroyWorld(w);
  }

  // And the multi-part path, which was always correct, must stay correct.
  const w = createWorld();
  const pts = [{ x: 300, y: 640 }, { x: 350, y: 694 }, { x: 402, y: 742 }, { x: 452, y: 796 }];
  const body = buildStrokeBody(w, classify(pts));
  const shown = asDrawn(body);
  const drift = Math.max(...shown.map((s, i) => Math.hypot(s.x - pts[i].x, s.y - pts[i].y)));
  assert('a MULTI-PART stroke still lands on the points drawn',
         drift < 1, `worst point off by ${drift.toFixed(2)}u`);
  destroyWorld(w);
}

console.log(failures === 0 ? '\nSHAPES: PASS\n' : `\nSHAPES: ${failures} FAILURE(S)\n`);
process.exit(failures === 0 ? 0 : 1);
