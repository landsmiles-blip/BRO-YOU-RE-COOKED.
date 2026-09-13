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

/** Objects that act on the world rather than threatening Milo. */
const MECHANISM_TYPES = new Set(['switch', 'gate']);

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
  goal: { id: 'goal', x: 570, y: 970, w: 80, h: 140 },
  freezeAt: 500,                       // he steps off the ledge at t≈0.68s

  // TUNED BY THE SOLVER, not by eye. The first geometry (platform at y=1100,
  // a 220u gap) measured a precision floor of 10u — a level demanding better
  // than ±25u from a thumb is broken, not hard. The cause: Milo hits the 900
  // u/s clamp after only 225u of fall, so a deep drop makes EVERY catch a
  // high-speed impact that stuns him and costs him his footing, and only a
  // sliver of shapes survive it. Raising the platform and closing the gap took
  // the precision floor to 30u at 4.3% breadth.
  static: [
    { id: 'ledge',    type: 'platform', x: 0,   y: 800,  w: 250, h: 60  },
    { id: 'platform', type: 'platform', x: 420, y: 970, w: 300, h: 310 },
  ],
  objects: [],
  zones: [
    { id: 'pit', kind: 'zone', x: 250, y: 1240, w: 170, h: 40, lethal: true },
  ],
  drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A5 — HANG.  Teaches: touch something solid, or it falls.
//
// The anchoring lesson, taught outright. A1 lets a floating stroke succeed by
// accident; here there is nothing to land on, so a stroke that touches no
// static geometry drops with the rock and Milo dies anyway. One attempt, no
// text, lesson delivered by consequence.
// ─────────────────────────────────────────────────────────────────────────
export const A5 = {
  id: 'a5-hang', world: 'backyard', verb: 'BLOCK',
  milo: { start: { x: 130, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 630, y: 1152, w: 80, h: 140 },
  freezeAt: 650,
  static: [
    { id: 'ground', type: 'platform', x: 0, y: 1152, w: 720, h: 128 },
    // The posts HANG from above. The first version stood them on the ground,
    // where they were 592-unit walls against a 22-unit step-up — Milo could
    // never pass them, and the level was unsolvable by construction. The
    // solver found it in one sweep: zero wins out of ~580 strokes.
    { id: 'postL', type: 'platform', x: 250, y: 300, w: 46, h: 460 },
    { id: 'postR', type: 'platform', x: 470, y: 300, w: 46, h: 460 },
  ],
  objects: [
    { id: 'rock', type: 'boulder', x: 383, y: 120, radius: 30,
      density: 0.03, restitution: 0.12, friction: 0.4,
      lethal: { kind: 'impact', minSpeed: 400, graceRadius: 6 } },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A6 — STEP.  Teaches: the line helps MILO move, it is not only for threats.
//
// Every level so far used the stroke against something. Here nothing is
// chasing him — the goal simply sits above a wall he cannot climb, because
// maxStepUp is 22 units and the wall is far taller. The only answer is a ramp.
// ─────────────────────────────────────────────────────────────────────────
export const A6 = {
  id: 'a6-step', world: 'backyard', verb: 'RAMP',
  milo: { start: { x: 90, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 620, y: 1030, w: 80, h: 140 },
  freezeAt: 450,
  // MILO.maxWalkSlope is 40 degrees, so a rise needs run >= rise/tan(40) =
  // 1.19x. The first version asked him to climb 332 units against a 40-unit
  // run — an 83-degree wall. Zero wins. Now a 152-unit rise with room for a
  // ~190-unit run, which is a ramp a person would actually draw.
  // No gap. The first version left a 50-unit void between the ground and the
  // shelf, so a ramp had to bridge AND climb, and the hand-off at the shelf
  // lip was a knife edge — Milo would climb the ramp, reach the shelf's own
  // height, and stall 18 units short of it. A pure climb against a flush wall
  // is the lesson this level is for; bridging is A2's job.
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 400, h: 128 },
    { id: 'shelf',  type: 'platform', x: 400, y: 1030, w: 320, h: 250 },
  ],
  objects: [],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A7 — PROP.  Teaches: structural thinking — hold something UP.
//
// The walkway is a free body resting on one edge. Milo's own weight tips it
// and he rides it into the pit. The stroke has to become a leg under the far
// end, which is the first time the player builds a support rather than a
// barrier or a path.
// ─────────────────────────────────────────────────────────────────────────
export const A7 = {
  id: 'a7-prop', world: 'backyard', verb: 'SUPPORT',
  milo: { start: { x: 90, y: 900 }, speed: MILO.speed },
  goal: { id: 'goal', x: 630, y: 900, w: 80, h: 140 },
  freezeAt: 450,
  static: [
    { id: 'bankL', type: 'platform', x: 0,   y: 900, w: 250, h: 380 },
    { id: 'bankR', type: 'platform', x: 520, y: 900, w: 200, h: 380 },
  ],
  objects: [
    // Rests on the left bank, overhangs the gap. Unsupported, it pivots.
    { id: 'plank', type: 'plank', x: 170, y: 884, w: 360, h: 22,
      density: 0.005, restitution: 0.05, friction: 0.8,
      lethal: { kind: 'impact', minSpeed: 900, graceRadius: 6 } },
  ],
  zones: [{ id: 'pit', kind: 'zone', x: 250, y: 1240, w: 270, h: 40, lethal: true }],
  drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A8 — JAM.  Teaches: geometry as a mechanism, not a wall.
//
// A heavy roller comes down a static ramp. A flat barrier just holds it there,
// still on the walk line. Wedged into the corner between ramp and ground it
// stops for good and leaves the path clear underneath.
// ─────────────────────────────────────────────────────────────────────────
export const A8 = {
  id: 'a8-jam', world: 'backyard', verb: 'WEDGE',
  milo: { start: { x: 80, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 660, y: 1152, w: 70, h: 140 },
  freezeAt: 550,
  // The first version dropped the roller off a high ledge behind Milo, where
  // it never reached him at all: the idle run SUCCEEDED, so 78% of strokes
  // "won" a level that won itself. It now comes straight down his line, and
  // the overhang gives a corner worth wedging into.
  static: [
    { id: 'ground',   type: 'platform', x: 40,  y: 1152, w: 680, h: 128 },
    { id: 'overhang', type: 'platform', x: 330, y: 960,  w: 200, h: 34  },
  ],
  objects: [
    { id: 'roller', type: 'boulder', x: 655, y: 1118, radius: 32,
      density: 0.05, restitution: 0.06, friction: 0.12, frictionAir: 0, vx: -420,
      lethal: { kind: 'impact', minSpeed: 400, graceRadius: 6 } },
  ],
  zones: [],
  // Tight ink: a sprawling barrier is not a wedge. Efficiency pressure is the
  // difficulty axis here, not more hazards.
  drawing: { maxLength: 420, denyZones: [] },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A9 — CHUTE.  Teaches: guide it, do not fight it.
//
// The rock has to reach the plate on the right. Blocking it achieves nothing —
// the gate stays shut and Milo walks into it. A funnel steers the fall onto
// the plate, and the gate opens.
// ─────────────────────────────────────────────────────────────────────────
export const A9 = {
  id: 'a9-chute', world: 'backyard', verb: 'FUNNEL',
  milo: { start: { x: 80, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  freezeAt: 600,
  // The plate is ELEVATED and out of Milo's reach. The first version laid it
  // flat on the ground across his walking line, so he pressed it himself on
  // the way past and the gate opened whatever the player did — a level that
  // solved itself. Only the rock can reach it now, and only if it is steered.
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    { id: 'lip',    type: 'platform', x: 230, y: 700,  w: 120, h: 26  },
    { id: 'shelf',  type: 'platform', x: 470, y: 900,  w: 180, h: 30  },
  ],
  objects: [
    { id: 'rock', type: 'boulder', x: 290, y: 200, radius: 26,
      density: 0.03, restitution: 0.08, friction: 0.4,
      lethal: { kind: 'impact', minSpeed: 400, graceRadius: 6 } },
    { id: 'plate', type: 'switch', x: 480, y: 868, w: 160, h: 32, triggers: ['gate'] },
    { id: 'gate',  type: 'gate',   x: 545, y: 1012, w: 34, h: 140 },
  ],
  zones: [],
  drawing: { maxLength: 560, denyZones: [] },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A10 — THE SWITCH.  One stroke, several consequences.
//
// The design bible's headline example, finally buildable: something hits a
// switch, a gate opens, Milo walks through. The rock must be redirected ACROSS
// the level onto a plate, and the stroke never touches the gate or Milo — it
// only sets up the chain.
// ─────────────────────────────────────────────────────────────────────────
export const A10 = {
  id: 'a10-switch', world: 'backyard', verb: 'TRIGGER',
  milo: { start: { x: 80, y: 1152 }, speed: 190 },
  goal: { id: 'goal', x: 655, y: 1152, w: 70, h: 140 },
  freezeAt: 700,
  static: [
    { id: 'ground', type: 'platform', x: 0, y: 1152, w: 720, h: 128 },
    { id: 'shelfL', type: 'platform', x: 150, y: 700, w: 130, h: 26 },
    { id: 'shelfR', type: 'platform', x: 380, y: 620, w: 130, h: 26 },
  ],
  objects: [
    { id: 'rock', type: 'boulder', x: 330, y: 170, radius: 26,
      density: 0.03, restitution: 0.12, friction: 0.35,
      lethal: { kind: 'impact', minSpeed: 400, graceRadius: 6 } },
    { id: 'plate', type: 'switch', x: 180, y: 1120, w: 150, h: 32, triggers: ['gate'] },
    { id: 'gate',  type: 'gate',   x: 470, y: 1012, w: 34, h: 140 },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// SHIPPING SET vs HELD BACK
//
// A level that fails its solver gates does not ship. It is not deleted — the
// work and the reason are kept — but it stays out of the player's hands until
// it clears the bar, because a level that makes someone quit is negative
// inventory.
//
// A4 WAS HELD AND IS NOW SHIPPING. It was held for a precision floor of 10u,
// which turned out to be a SYMPTOM, not the level: rigid weld constraints made
// every drawn line oscillate, and a catch is exactly where that shows up. With
// anchoring made static it measures 65u precision and zero wobble. Holding it
// was right; the diagnosis was wrong, and only fixing the real bug revealed
// that.
//
// STILL HELD:
//   A6 RAMP — genuinely too hard, and not for physics reasons: 0.2% breadth,
//     and it only clears the gates with a 47u wall, barely above Milo's own
//     22u step-up. A level that passes while teaching nothing is worse than
//     no level.
// ─────────────────────────────────────────────────────────────────────────
export const LEVELS = [A1, A2, A3, A4, A5, A7, A8, A9, A10];

export const HELD = [
  { level: A6, reason: 'only passes with a 47u wall, barely above the 22u step-up — teaches nothing' },
];

export const ALL_LEVELS = [...LEVELS, ...HELD.map((h) => h.level)];

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
    // MECHANISMS are not hazards. The rule that every object must declare its
    // lethality is right — an object that is neither is a bug or a prop, and
    // the author should have to say which — but a switch and a gate are a
    // third category the first version of this check had no room for.
    if (!o.lethal && !MECHANISM_TYPES.has(o.type)) {
      problems.push(`object "${o.id}" declares no lethality — hazard, or add its type to MECHANISM_TYPES`);
    }
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
