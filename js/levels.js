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

// ─────────────────────────────────────────────────────────────────────────
// A2 — GAP.  Teaches: your line becomes terrain he can walk on.
//
// Forces two code paths nothing else has executed: `zone` lethality (the pit)
// and — the real target — MILO STEPPING UP ONTO DRAWN GEOMETRY. The bridge
// presents a 16u lip to a 72u body, and MILO.maxStepUp (22) exceeds
// LINE.thickness (16) precisely so that works. Those two constants live in
// different parts of the file and only running it proves the inequality holds.
// ─────────────────────────────────────────────────────────────────────────
export const A2 = {
  id: 'a2-gap',
  world: 'backyard',
  verb: 'BRIDGE',
  milo: { start: { x: 120, y: 880 }, speed: MILO.speed },
  goal: { id: 'goal', x: 620, y: 880, w: 80, h: 140 },
  freezeAt: 500,                       // he reaches the edge at t≈0.82s

  // COMPOSITION: the first pass put the ground at y=1152 with a 64u pit,
  // which is correct physics and a dead frame — the whole level lived in the
  // bottom fifth of a portrait screen and the "pit" was a shallow notch. The
  // banks now sit at y=880 with a real chasm below them, so the drop reads as
  // a drop and the frame actually has something in it.
  static: [
    { id: 'groundL', type: 'platform', x: 0,   y: 880, w: 300, h: 400 },
    { id: 'groundR', type: 'platform', x: 500, y: 880, w: 220, h: 400 },
  ],
  objects: [],
  zones: [
    { id: 'pit', kind: 'zone', x: 300, y: 1210, w: 200, h: 70, lethal: true },
  ],
  drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A3 — REDIRECT.  Teaches: sometimes you steer it instead of stopping it.
//
// Blocking the boulder flat merely parks a 68u-tall rock on the walk line,
// against a 22u step-up — the exact dead-end that made the source spec's A1
// unsolvable. Here that failure is the LESSON rather than a bug: block it and
// Milo is stuck; angle it and the boulder rolls off the left edge of the world
// and is gone.
//
// Also forces the `strokeTouched` causality chain, so a player who deflects the
// boulder INTO Milo is told "YOU SENT IT AT HIM" rather than something generic.
// ─────────────────────────────────────────────────────────────────────────
export const A3 = {
  id: 'a3-redirect',
  world: 'backyard',
  verb: 'REDIRECT',
  milo: { start: { x: 105, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 640, y: 1152, w: 80, h: 140 },
  freezeAt: 600,

  static: [
    // Ground starts at x=60. A boulder sent left rolls off the edge of the
    // world and is gone — which is what makes REDIRECT a real answer rather
    // than a slower way of blocking.
    { id: 'ground', type: 'platform', x: 60,  y: 1152, w: 660, h: 128 },
    // The two shelves sit at DIFFERENT heights on purpose, so any stroke
    // joining them is a SLOPE and the boulder rolls off rather than resting.
    //
    // HONEST LIMITATION: this does not *force* redirect over block. With the
    // shelves fixed, the slope direction is fixed too — a stroke drawn left-to-
    // right and right-to-left produce the identical body, so the player has no
    // directional choice here. What the level does prove is that the boulder
    // ends up OFF THE WORLD instead of parked on the walk line. Measuring
    // whether a genuine block also succeeds is a job for the M1 solver harness
    // (solution breadth), not for a hand-written assertion pretending otherwise.
    { id: 'shelfLow',  type: 'platform', x: 240, y: 880, w: 80, h: 28 },
    { id: 'shelfHigh', type: 'platform', x: 420, y: 740, w: 80, h: 28 },
  ],
  objects: [
    {
      id: 'boulder1', type: 'boulder', x: 370, y: 180, radius: 28,
      density: 0.03, restitution: 0.15, friction: 0.4,
      lethal: { kind: 'impact', minSpeed: 400, graceRadius: 6 },
    },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A4 — CATCH.  Teaches: you can catch HIM, not just the thing chasing him.
//
// The first level where the stroke bears MILO'S OWN WEIGHT — every earlier
// level only ever loaded it with a ball.
//
// Trajectory re-derived DISCRETELY. v0.4 computed this continuously and got
// x=406 for the pit floor; our 900 u/s clamp makes him fall slower and drift
// further, so the real death line is x=415. Catch geometry must engage before
// that. Measured, walking off the ledge at 220 u/s:
//     y=1000 → x=354   y=1050 → x=366   y=1250 → x=415
//
// The bowl must reach static geometry at BOTH ends. A stroke touching at one
// point has a single weld and pivots about it — the catch collapses. And the
// goal-facing side has to stay open, or a successful catch traps him and trips
// the stuck timer instead of winning.
// ─────────────────────────────────────────────────────────────────────────
export const A4 = {
  id: 'a4-catch',
  world: 'backyard',
  verb: 'CATCH',
  milo: { start: { x: 100, y: 800 }, speed: MILO.speed },
  goal: { id: 'goal', x: 620, y: 1100, w: 80, h: 140 },
  freezeAt: 500,                       // he steps off the ledge at t≈0.68s

  static: [
    { id: 'ledge',    type: 'platform', x: 0,   y: 800,  w: 250, h: 60  },
    { id: 'platform', type: 'platform', x: 470, y: 1100, w: 250, h: 180 },
  ],
  objects: [],
  zones: [
    { id: 'pit', kind: 'zone', x: 250, y: 1240, w: 220, h: 40, lethal: true },
  ],
  drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  solver: null,
};

export const LEVELS = [A1, A2, A3, A4];

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
