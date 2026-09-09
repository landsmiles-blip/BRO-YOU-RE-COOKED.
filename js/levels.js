// Level data + loader.
//
// AUTHORING CONVENTIONS (chosen to match how a designer thinks, not how a
// physics engine thinks — the loader converts):
//   static rect : x,y = TOP-LEFT corner,  w,h = size
//   milo        : x,y = FEET (ground-contact point), not body centre
//   goal        : x = centre, y = BASE
//   ball        : x,y = CENTRE
//
// All puzzle geometry must sit inside the 720x1280 safe box. The loader
// asserts this, because a level that reaches outside it is invisible at some
// required aspect ratio.

import { SAFE_BOX, MILO, LINE } from './constants.js';

// ─────────────────────────────────────────────────────────────────────────
// A1 — WALL.  Teaches: your line is real, solid matter.
//
// REDESIGNED from the v0.3/v1.0 spec, which was unsolvable. That version drops
// a ball into Milo's walking path; verified timing shows it lands at t=1.166s
// while Milo arrives at t=1.409s, so it comes to rest as a 56-unit obstacle on
// the walk line. Milo's step-up is 22 units. He can never reach the goal — the
// level dead-ends in a STUCK timeout EVEN WHEN THE PLAYER BLOCKS IT CORRECTLY.
//
// Here the ball falls through a gap between two shelves and never reaches the
// walk line at all. Caught, it rests ~280 units above Milo's head and he walks
// under it. Uncaught, it lands on him at t≈1.086s, when he is at x≈399 and the
// ball is at x=400. Dead-centre.
//
// The bonus: a stroke drawn floating, touching neither shelf, falls WITH the
// ball and Milo still dies. That teaches anchoring in a single attempt, by
// consequence, with no text — on level one.
// ─────────────────────────────────────────────────────────────────────────
export const A1 = {
  id: 'a1-wall',
  world: 'backyard',
  verb: 'BLOCK',
  milo: { start: { x: 160, y: 1152 }, speed: MILO.speed },

  // THE FREEZE must land before the danger does — "one heartbeat before it
  // happens". Measured: uncaught, the ball kills Milo at t=1108ms. The global
  // default of 1200ms would freeze the world AFTER he is already dead. At 700ms
  // the ball hangs just above the gap and Milo is mid-stride at x=313: the
  // problem and the solution are both visible, with 400ms of dramatic margin.
  // Per-level, because every level's beat is different.
  freezeAt: 700,
  goal: { id: 'goal', x: 620, y: 1152, w: 80, h: 140 },

  static: [
    { id: 'ground',  type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    { id: 'shelfL',  type: 'platform', x: 250, y: 800,  w: 90,  h: 32  },
    { id: 'shelfR',  type: 'platform', x: 460, y: 800,  w: 100, h: 32  },
  ],

  objects: [
    {
      id: 'ball1', type: 'boulder', x: 400, y: 300, radius: 28,
      density: 0.03, restitution: 0.15, friction: 0.4,
      lethal: { kind: 'impact', minImpulse: 55, graceRadius: 6 },
    },
  ],

  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },

  // Written by the solver harness at M1 — never typed by hand (Bible §3.8).
  solver: null,
};

export const LEVELS = [A1];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}

/** Dev-time assertions. A level that fails these is a bug, not a hard level. */
export function assertLevel(level) {
  const problems = [];
  const inBox = (x, y, w = 0, h = 0) =>
    x >= 0 && y >= 0 && x + w <= SAFE_BOX.w && y + h <= SAFE_BOX.h;

  for (const s of level.static) {
    if (!inBox(s.x, s.y, s.w, s.h)) problems.push(`static "${s.id}" outside safe box`);
  }
  for (const o of level.objects) {
    const r = o.radius ?? 0;
    if (!inBox(o.x - r, o.y - r, r * 2, r * 2)) problems.push(`object "${o.id}" outside safe box`);
    if (!o.lethal) problems.push(`object "${o.id}" declares no lethality — hazard or prop?`);
    for (const t of o.triggers ?? []) {
      const exists = level.objects.some((x) => x.id === t) || level.static.some((x) => x.id === t);
      if (!exists) problems.push(`"${o.id}" triggers missing target "${t}"`);
    }
  }
  if (!inBox(level.milo.start.x - MILO.width / 2, level.milo.start.y - MILO.height,
             MILO.width, MILO.height)) problems.push('milo start outside safe box');

  if (problems.length) throw new Error(`Level "${level.id}":\n  - ${problems.join('\n  - ')}`);
  return true;
}
