// Level data + loader.
//
// EVERY LEVEL CARRIES A `hint`: one short line naming the PROBLEM, never the
// solution. Playtesting was blunt about why this exists — "it is very unclear
// what the player is supposed to do" and "you finish and you do not even know
// why that happened". A verb in 45%-opacity 11px type in the corner is not
// communication. "HE WALKS STRAIGHT OFF THE EDGE" tells you what is about to
// go wrong and leaves the entire puzzle intact.
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
import { LETHAL_KINDS } from './hazards.js';
// One file of new levels per chapter, so parallel sessions never edit the same
// file. Each is placed into its slot in CHAPTERS below as CH3.A51 and so on.
import * as CH1 from './levels/ch1-line.js';
import * as CH2 from './levels/ch2-plates.js';
import * as CH3 from './levels/ch3-tnt.js';
import * as CH4 from './levels/ch4-air.js';
import * as CH5 from './levels/ch5-balloons.js';
import * as CH6 from './levels/ch6-all.js';

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
  hint: 'STOP IT REACHING HIM',
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
      // minSpeed, not the Bible's minImpulse — see hazards.js. The old key
      // was dead weight here: isFatal reads minSpeed and fell back to the
      // default, so the number in the data described nothing.
      lethal: { kind: 'impact', minSpeed: 400, graceRadius: 6 },
    },
  ],

  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },

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
  hint: 'GET HIM ACROSS',
  world: 'backyard',
  verb: 'BRIDGE',
  milo: { start: { x: 120, y: 880 }, speed: MILO.speed },
  goal: { id: 'goal', x: 620, y: 1080, w: 80, h: 140 },
  freezeAt: 500,                       // he reaches the edge at t≈0.93s

  // COMPOSITION: the first pass put the ground at y=1152 with a 64u pit, which
  // is correct physics and a dead frame — the whole level lived in the bottom
  // fifth of a portrait screen and the "pit" was a shallow notch. The banks
  // now sit high with a real chasm below them, so the drop reads as a drop.
  //
  // THE FAR BANK IS 200u LOWER THAN THE NEAR ONE, and that asymmetry is the
  // whole fix for this level. With both banks level, A2 was measured at 1.1%
  // solution breadth — the hardest level in the game, at position TWO, against
  // 12.7% for level one. 85% of every stroke a player could draw ended with
  // Milo in the pit.
  //
  // The cause is a real asymmetry in the locomotion, not bad luck: DESCENDING
  // IS FREE, CLIMBING IS GATED. Milo can drop any distance onto a surface, but
  // he can only rise MILO.maxStepUp (22u) onto one. With level banks, a bridge
  // had to land inside a ~22u window or it was useless — and 1,462 of the
  // strokes that DID anchor to the banks still failed, because anchoring to a
  // 400u-tall cliff face is easy and landing in that window is not.
  //
  // Dropping the far bank turns the whole crossing into a descent: every
  // bridge that spans the gap at any height between the two banks now works.
  // Measured: 1.1% -> 7.4% breadth, which puts level two back in the same band
  // as level one instead of far below every level that ships. Raising the pit
  // floor tightens the composition for the same reason — it stops half the
  // frame being chasm nobody can usefully draw into.
  static: [
    { id: 'groundL', type: 'platform', x: 0,   y: 880,  w: 325, h: 400 },
    { id: 'groundR', type: 'platform', x: 475, y: 1080, w: 245, h: 200 },
  ],
  objects: [],
  zones: [
    { id: 'pit', kind: 'zone', x: 330, y: 1100, w: 145, h: 180, lethal: true },
  ],
  drawing: { maxLength: LINE.maxLengthDefault },
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
  hint: 'SEND IT SOMEWHERE ELSE',
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
  drawing: { maxLength: LINE.maxLengthDefault },
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
  hint: 'HE WALKS STRAIGHT OFF',
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
  drawing: { maxLength: LINE.maxLengthDefault },
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
  id: 'a5-hang',
  hint: 'IT DROPS BETWEEN THE POSTS', world: 'backyard', verb: 'BLOCK',
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
  drawing: { maxLength: LINE.maxLengthDefault },
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
  id: 'a8-jam',
  hint: 'STOP THE ROLLER', world: 'backyard', verb: 'WEDGE',
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
  drawing: { maxLength: 420 },
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
  id: 'a9-chute',
  hint: 'THE PLATE OPENS THE GATE', world: 'backyard', verb: 'FUNNEL',
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
  drawing: { maxLength: 560 },
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
  id: 'a10-switch',
  hint: 'ONLY THE ROCK CAN REACH THE PLATE', world: 'backyard', verb: 'TRIGGER',
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
    // The plate sits ON THE LEFT SHELF, out of Milo's reach. It was on the
    // ground across his walking line, so he pressed it himself during the live
    // beat and the gate was already open before the player drew anything — the
    // identical flaw I fixed in A9 and never re-checked for here. The filmstrip
    // showed it instantly: the plate renders gold (fired) in frame one.
    { id: 'plate', type: 'switch', x: 160, y: 674, w: 120, h: 26, triggers: ['gate'] },
    { id: 'gate',  type: 'gate',   x: 470, y: 1012, w: 34, h: 140 },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A level that fails its solver gates does not ship. A4 was held once for a
// precision floor of 10u, which turned out to be a SYMPTOM, not the level:
// rigid weld constraints made every drawn line oscillate, and a catch is
// exactly where that shows up. With anchoring made static it measures 65u
// precision and zero wobble. Holding it was right; the diagnosis was wrong,
// and only fixing the real bug revealed that.
// ─────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────
// A11 — DEAD WEIGHT.  Teaches: NOT anchoring is also a tool.
//
// Every level so far has punished a floating stroke. This one requires it, and
// it is the first level where the drawing feedback's "WILL FALL" ink is the
// state you are AIMING for rather than the warning you are heeding.
//
// The plate sits on a shelf far above Milo's head, with nothing in the world
// able to reach it — no rock, no ball, no slope. The only mass available is the
// player's own line. Anchor it to the shelf and it hangs there for ever; draw
// it clear in the air and it drops onto the plate and opens the gate.
//
// The naive read of the level is "bridge to the shelf", which is both possible
// and useless: Milo has no reason to go up there and cannot reach the goal from
// it. The level is won by dropping, not by building.
// ─────────────────────────────────────────────────────────────────────────
export const A11 = {
  id: 'a11-deadweight',
  hint: 'THE PLATE NEEDS WEIGHT ON IT', world: 'backyard', verb: 'DROP',
  // DECLARED, not inferred. Every other level's certified solution must be
  // anchored, because an anchored stroke is static and therefore reproducible,
  // while an unanchored one falls and settles chaotically. This level inverts
  // that on purpose, so it has to say so — otherwise the gate either fails a
  // correct level or, far worse, is weakened for every level to accommodate
  // this one. The gate demands a higher hand-robustness rate in exchange.
  solutionKind: 'unanchored',
  milo: { start: { x: 80, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  freezeAt: 700,
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    // The shelf is deliberately NARROW and high. It is an anchor the player is
    // meant to reject, not use.
    { id: 'shelf',  type: 'platform', x: 250, y: 800,  w: 200, h: 26  },
  ],
  objects: [
    { id: 'plate', type: 'switch', x: 275, y: 768, w: 150, h: 32, triggers: ['gate'] },
    { id: 'gate',  type: 'gate',   x: 545, y: 1012, w: 34, h: 140 },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A12 — ON TIME.  Teaches: WHERE you intercept decides WHEN it arrives.
//
// The first moving hazard. A roller is already travelling when the world
// freezes, so the frame the player reads is a snapshot of something in flight —
// they are not blocking a thing, they are heading one off.
//
// It runs along an upper ledge and drops off its left end onto Milo's walking
// line. Verified timing is the whole level: left alone it lands on him. Stop it
// short and it never reaches the drop. Speed it past and it lands behind him.
// Both are wins, which is the point — there is no single correct wall, there is
// a window, and where you draw decides which side of the window you land on.
// ─────────────────────────────────────────────────────────────────────────
export const A12 = {
  id: 'a12-ontime',
  hint: 'IT WILL DROP ON HIM', world: 'backyard', verb: 'INTERCEPT',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  // The freeze lands while the roller is still ON the ledge, which is what
  // makes "stop it short" a real option rather than a description. Timing here
  // was found by sweeping, not by algebra: the first version had the roller
  // land 300u BEHIND Milo, so the level solved itself — the same flaw A8 shipped
  // with once already, and the reason the idle run is a hard gate.
  freezeAt: 400,
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    // The ledge stops short of the goal, so the roller must leave it somewhere.
    { id: 'ledge',  type: 'platform', x: 500, y: 880,  w: 220, h: 30  },
  ],
  objects: [
    { id: 'roller', type: 'boulder', x: 660, y: 846, radius: 34,
      density: 0.04, restitution: 0.05, friction: 0.15, frictionAir: 0, vx: -240,
      lethal: { kind: 'impact', minSpeed: 400, graceRadius: 6 } },
  ],
  zones: [],
  drawing: { maxLength: 460 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A13 — YEET.  Teaches: the line can move HIM, not just stop things.
//
// REBUILT. The first version put a 310u pit in front of him with 380u of ink,
// and the solver was blunt about it: 0.3% breadth, ONE stroke family, and a
// 20u precision floor — below what a thumb can hit. Worse, the five strokes
// that did win were all spans. It was not a launch level at all, it was a
// precision BRIDGE, which is level two with the tolerance removed.
//
// The reason is physics, not taste. Milo walks at 260 u/s, so a flat launch
// gives a ballistic range of v²/g ≈ 38u — he cannot be thrown anywhere from
// walking speed. A LAUNCH REQUIRES GRAVITY ASSIST: he has to fall first.
// Dropping 300u brings him to ~900 u/s (the global clamp), and redirecting
// even a fraction of that horizontally throws him across the map.
//
// So the level drops him. He walks off the high ledge whatever the player
// does; the only question is what he lands in.
//
// THE VERB IS "CARRY", NOT "LAUNCH", and that is a correction rather than a
// softening. The ladder asked for a throw, and the filmstrip showed what the
// certified solution actually is: a long diagonal he SLIDES down. Scoop
// launches genuinely win too — the bowl family scores on this level — but they
// are not the reliable route. I tried to force a true launch by raising the
// far platform out of sliding range, and measured the answer: 1080 -> 3.1%,
// 1000 -> 2.7%, 940 -> 2.5%, 880 -> 2.0%, with span (bridge) strokes still
// dominating every variant. Forcing it makes the level worse and still does
// not make it a launch.
//
// So it is named for what it does. The lesson survives intact and is the one
// that matters: this is the first level where the line MOVES him rather than
// stopping something — twelve levels of the line as a barrier, and now it is
// transport. That is the new idea, not the specific trajectory.
// ─────────────────────────────────────────────────────────────────────────
export const A13 = {
  id: 'a13-yeet',
  hint: 'THE FAR SIDE IS TOO LOW AND TOO FAR', world: 'backyard', verb: 'CARRY',
  milo: { start: { x: 80, y: 520 }, speed: MILO.speed },
  goal: { id: 'goal', x: 640, y: 940, w: 80, h: 140 },
  freezeAt: 450,
  // COMPOSITION. Everything used to sit below y=700, so the top 45% of the
  // frame was empty sky and Milo was a speck in a corner — playtested as
  // "very unclear what the player is supposed to do". Raising the start ledge
  // and deepening the chasm makes the drop the subject of the picture instead
  // of a detail at the bottom of it, which is the whole point of the level.
  static: [
    { id: 'ledge', type: 'platform', x: 0,   y: 520, w: 220, h: 760 },
    { id: 'far',   type: 'platform', x: 480, y: 940, w: 240, h: 340 },
  ],
  objects: [],
  zones: [{ id: 'pit', kind: 'zone', x: 225, y: 1215, w: 250, h: 65, lethal: true }],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A15 — EITHER WAY.  Teaches: there is no single right answer.
//
// REBUILT, because the first version was not a choice at all — and the way it
// failed is the useful part. It had a falling rock AND a gap, two hazards, and
// I called that "two solutions". The player had to solve BOTH, so the routes
// were not alternatives, they were halves. Measured 0.6% breadth with both
// routes needle-thin: two solutions that exist on paper and neither of which a
// hand can hit is not a choice, it is two traps.
//
// A real fork needs ONE problem with two dissimilar answers. The rock comes
// down a chimney and out onto Milo's line. Either:
//
//   PLUG IT — a line anywhere across the chimney, anchored to both walls. The
//             target is 400 units tall, so this is the forgiving route.
//   SEND IT — a deflector under the chimney mouth that throws the rock onto
//             the side shelf, where it is harmless. Smaller target, less ink.
//
// Different places, different shapes, different ideas, both clean. The claim is
// checkable rather than asserted: the solver reports distinct stroke families,
// and a level that promises choice and measures one family is lying.
// ─────────────────────────────────────────────────────────────────────────
export const A15 = {
  id: 'a15-eitherway',
  hint: 'KEEP IT OFF HIM', world: 'backyard', verb: 'CHOOSE',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 660, y: 1152, w: 70, h: 140 },
  freezeAt: 600,
  static: [
    { id: 'ground',  type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    // The chimney. Its walls are the anchors for the PLUG route.
    { id: 'chimL',   type: 'platform', x: 236, y: 380,  w: 30,  h: 420 },
    { id: 'chimR',   type: 'platform', x: 400, y: 380,  w: 30,  h: 420 },
    // Somewhere harmless to put a rock, for the SEND route.
    { id: 'shelf',   type: 'platform', x: 520, y: 1000, w: 200, h: 26  },
  ],
  objects: [
    { id: 'rock', type: 'boulder', x: 322, y: 430, radius: 26,
      density: 0.03, restitution: 0.06, friction: 0.35,
      lethal: { kind: 'impact', minSpeed: 400, graceRadius: 6 } },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A19 — UPDRAFT.  Introduces: AIR. The first thing in this world that acts on
// it without being solid.
//
// The noun is introduced ALONE — the pattern every game in this genre follows
// and the one the previous attempt broke. Its predecessor put the air beside a
// falling rock as somewhere to deflect it, and the A14 test killed it in a
// single run: delete the air, re-run, nothing changed. Decoration.
//
// Here the air is load-bearing BY CONSTRUCTION. The plate is at the top of the
// column and nothing in the world can reach it — no ledge leads there, the ball
// cannot climb, and Milo is on the floor behind a shut gate. The only lift that
// exists is the draught. Delete it and the ball sits on the column floor for
// ever.
//
// AND THE AIR ABSORBS THE PRECISION, which is what a good noun is for. The
// player's job is to roll the ball off its shelf into a 150-unit-wide column —
// a target you could hit with your elbow. Everything delicate after that is
// done by the air. Compare A16, held for demanding that a line be threaded
// between two 31-unit gaps.
// ─────────────────────────────────────────────────────────────────────────
export const A19 = {
  id: 'a19-updraft',
  hint: 'NOTHING IN HERE CAN CLIMB',
  world: 'backyard', verb: 'UPDRAFT',
  milo: { start: { x: 70, y: 1120 }, speed: MILO.speed },
  goal: { id: 'goal', x: 660, y: 1120, w: 70, h: 140 },
  freezeAt: 600,
  // THE BALL FALLS. It was first authored at rest on a shelf, and the trace was
  // unambiguous: it sat at (185,804) for the entire run, every time. A drawn
  // line is STATIC once anchored — it cannot shove anything. Everything this
  // game has ever asked the player to do is REDIRECT something already moving,
  // and a resource is no different from a hazard in that respect.
  // A CHIMNEY ON A DECK, ABOVE HIS HEAD. Three traced findings built this
  // shape, and each one killed the version before it:
  //
  //  1. An OPEN column does not work. The ball came off the ramp fast and flew
  //     STRAIGHT THROUGH the air (x=272 -> 461 -> 600 -> 826) and out of the
  //     world. An updraft gets a fraction of a second on something moving
  //     horizontally; it can only lift what is already contained.
  //  2. A chimney at GROUND LEVEL contains the ball and traps MILO. The plate
  //     fired at 4550ms and the gate opened — and he had walked in under the
  //     left wall and was pinned between the two of them at x=441 until the
  //     clock ran out. The apparatus was standing on his only path.
  //  3. The ball must arrive ROLLING, not flying. The letterbox under the left
  //     wall is 70 units and the ball is 52 across; threading that in mid-air
  //     is the knife-edge that put A16 on the shelf. Resting on the deck its
  //     centre is pinned at y=854 by the floor under it, so it passes every
  //     time — the geometry does the precise part, not the player's thumb.
  //
  // So the apparatus stands on a deck over Milo's head. He walks beneath it
  // with 216 units of clearance and never touches it, and the deck is a
  // 320-unit-wide table. THE PLAYER'S TARGET IS THE TABLE, NOT THE LETTERBOX:
  // land the ball anywhere on it moving right and the rest is automatic — too
  // fast and it simply stops against the solid right wall, still inside the air.
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1120, w: 720, h: 160 },
    { id: 'deck',   type: 'platform', x: 120, y: 880,  w: 400, h: 24  },
    // Stops 70 units short of the deck. A ball rolling on the deck has its top
    // at y=828 and goes under; anything still airborne is stopped.
    { id: 'chimL',  type: 'platform', x: 300, y: 420,  w: 20,  h: 390 },
    // Solid all the way down, so the far side is a wall and not an exit.
    { id: 'chimR',  type: 'platform', x: 480, y: 420,  w: 20,  h: 484 },
    // A CAP OVER THE PLATE, and it costs this level nothing. The ball rises
    // INSIDE the chimney and presses the plate from underneath at y=420, so a
    // lid resting on top of it at 374..390 never touches the ball's path.
    //
    // It is here because the level could be won without the air at all: drop an
    // unanchored line straight onto the plate and the gate opens, with the whole
    // chimney as scenery. A11 teaches that a falling line is a weight, so every
    // player eventually tries it. Measured across the shipped set, this level and
    // two others were open that way.
    { id: 'cap',    type: 'platform', x: 300, y: 374,  w: 200, h: 16  },
  ],
  objects: [
    { id: 'ball',  type: 'boulder', x: 200, y: 260, radius: 26,
      density: 0.02, restitution: 0.1, friction: 0.06,
      lethal: { kind: 'none' } },
    { id: 'plate', type: 'switch', x: 320, y: 390, w: 160, h: 30, triggers: ['gate'] },
    { id: 'gate',  type: 'gate',   x: 585, y: 980, w: 34, h: 140 },
  ],
  // Gravity is 1800 u/s², so -2400 is a net 600 up: strong enough to carry a
  // light ball the full height, not so strong it is flung out of the world.
  zones: [{ id: 'draft', kind: 'updraft', x: 320, y: 420, w: 160, h: 460, accel: -2400 }],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A20 — SPRING.  Introduces: a surface that GIVES ENERGY BACK.
//
// Every other surface in this world takes energy away. Statics were built with
// no restitution at all, so a thing that lands stays landed, and the player has
// only ever had to deal with hazards that roll or fall ONCE. This one comes
// back, and it arrives AIRBORNE.
//
// THREE DESIGNS DIED TO MEASUREMENT BEFORE THIS ONE:
//
//  1. "the line catches the bounce" is geometrically impossible. Any line drawn
//     above a pad is hit by the FALLING ball before it ever reaches the pad —
//     the line cannot be the second thing the ball meets if it is in the way of
//     the first.
//  2. "a hazard that never stops" is not what a bouncer is. Measured off a
//     688-unit drop: the first bounce recovers only ~30% of the height and it
//     is dead in three or four hops. Useful for a few seconds, not for ever —
//     which is exactly long enough for one crossing.
//  3. "bounce it over a wall" flings it clean out of a 720-wide world at any
//     tilt past 35°. The energy a bouncer returns is large and hard to aim.
//
// So the spring's job here is the one thing it does that nothing else can: it
// keeps the hazard OFF THE GROUND. A wall stops a roller wherever you put it.
// It stops this only where the arc is low, and the player has to read the arc
// to find that place — a new demand built out of the same old idea that the
// line is solid matter.
// ─────────────────────────────────────────────────────────────────────────
export const A20 = {
  id: 'a20-spring',
  hint: 'IT DOES NOT STOP WHEN IT LANDS',
  world: 'backyard', verb: 'SPRING',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  // FREEZE AT 300, NOT 400. Derived from the idle run, not guessed: the ball's
  // first contact with the board is at t=425, so 400 froze the world 25ms after
  // it had already landed and the player never saw it fall. At 300 it is caught
  // in the air 121 units up, which is the only frame in which the level gets to
  // say what is about to happen.
  freezeAt: 300,
  // ONE SPRINGBOARD, NOT A SPRINGY FLOOR. The first cut made the middle 420
  // units of the ground springy, and Milo walks over that — he does NOT bounce
  // (measured: identical outcomes at restitution 0 and 1.0, because his
  // locomotion overwrites velocity the moment he is grounded), so half the
  // floor would have been visibly springy and visibly inert under him. A single
  // board reads as a prop instead of as a broken floor.
  //
  // It is also placed where the whole arc is OVER by the time he arrives: the
  // ball's first contact is at x=549 and it is coming down on him at x=347
  // while he is still well left of the board, so he never walks on a springy
  // surface while it matters.
  //
  // Flush with the ground on both sides, so there is no step-up to climb.
  static: [
    //
    // THE BOARD STAYED PUT, AND THAT WAS THE FIX FOR THE WRONG BUG. The frozen
    // frame showed the ball sitting on top of the goal, so the apparatus was
    // moved 80 units left — which cost half the winning ramps and left the
    // certified solution passing 5 units from death. It then won in the solver
    // and LOST in the browser, because a stroke redrawn with a mouse is never
    // bit-identical and 5 units is not a margin.
    //
    // The overlap was never about x. At the old freeze of 400 the ball had
    // already fallen to y=1103, which is inside the goal's 1012..1152 band.
    // Freezing at 300 catches it at y=1031 and the overlap goes away on its
    // own. Measured clearances on winning runs here are 50-74u; 80 units left
    // of here they were 50-64u and there were half as many of them.
    { id: 'groundL', type: 'platform', x: 0,   y: 1152, w: 380, h: 128 },
    // 0.70, NOT 0.85. Measured: at 0.85 the ball arcs 143u up and the only
    // ramps that turn it away are 39° ones — and Milo's walk limit is 40°, so
    // every winning stroke sat 1.4° from a cliff. The solver caught it exactly:
    // jitter a 200u ramp by 20u and its slope swings ~11°, so robustness was
    // 10u against a 25u thumb. A lower arc is turned away by a SHALLOW ramp,
    // and the win band then runs unbroken from 11° to 39° with nothing to fall
    // off. Softer is not easier here; it is the difference between a level and
    // a knife-edge.
    //
    // It is NOT softer than that, either. 0.60 is flatter still and even more
    // forgiving, but the ball then skips only 39u — less than its own diameter
    // — and a noun the player cannot SEE is not introduced at all. 0.70 clears
    // 80u, which reads as a bounce, and keeps a win band that runs 240..440 at
    // 22° and 240..460 at 28°.
    { id: 'spring',  type: 'platform', x: 380, y: 1152, w: 240, h: 128,
      restitution: 0.70, friction: 0.3 },
    { id: 'groundR', type: 'platform', x: 620, y: 1152, w: 100, h: 128 },
  ],
  objects: [
    // Dropped from y=900 to y=950 for the same reason: less fall in means less
    // arc out. It still kills on the idle run, which is the only thing the
    // height was ever load-bearing for.
    { id: 'hopper', type: 'boulder', x: 660, y: 950, radius: 30,
      density: 0.04, restitution: 0.1, friction: 0.15, frictionAir: 0, vx: -260,
      lethal: { kind: 'impact', minSpeed: 400, graceRadius: 6 } },
  ],
  zones: [],
  drawing: { maxLength: 460 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A21 — LEVER.  The lever again, with the rule turned into a puzzle.
//
// A22 was built to teach that the loaded arm goes down and is held (see
// docs/HELD.md), so this level introduces the lever AND asks the player to use
// it: the rock's landing point has to be moved across the pin, and the target
// is an arm rather than a point. Every other piece of geometry in this game is
// nailed down; this one turns, and what it does is decided by where the weight
// lands — the first time anything here produces an effect somewhere other than
// where the force was applied.
//
// WHAT A SEE-SAW CANNOT DO, measured before the level was drawn: it cannot
// launch. A plank tipping 12° lowers one end; anything sitting on the RISING
// end rolls inward toward the pin, not up and off. Every "catapult" idea died
// on that. What it can do is decide a direction — the rock rolls downhill, and
// the player chooses which way downhill points.
//
// A FREE PIVOT SPINS. Measured: an unstopped plank went 0° to -246° and kept
// going, like a propeller. The two blocks under its ends are what make it a
// see-saw instead, and they are geometry the player can see rather than a rule
// they have to be told.
//
// THE APPARATUS IS ON A DECK, over Milo's head — the same staging A19 had to
// learn. A rock that goes the wrong way has to be disposed of somewhere, and
// the floor is the one place it cannot go, because that is where he is walking.
// ─────────────────────────────────────────────────────────────────────────
export const A21 = {
  id: 'a21-lever',
  hint: 'IT LEANS THE WRONG WAY',
  world: 'backyard', verb: 'LEVER',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  freezeAt: 500,
  // WHICHEVER SIDE YOU LAND ON GOES DOWN, AND DROPS YOU OFF THERE. That is the
  // whole rule, and it took a wrong level to find it. The first version asked
  // the player to PROP the plank level with a post — and propping a body that
  // is already moving is fiddly, invisible, and it failed every way it was
  // tried: the posts either missed the underside entirely or jammed the rock
  // against the plank at -34°. The lever does not want to be held. It wants to
  // be FED, and the only question worth asking the player is which side of the
  // pin the rock comes down on.
  //
  // So the rock falls 30 units LEFT of the pin and the level answers itself
  // wrongly: left goes down, the rock rolls off that end and is gone. The
  // stroke's job is to move the landing point across the pin — and the target
  // is the plank's whole right arm, not a point.
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    // The shaft: the rock's only way down, and wide enough to build a ramp in.
    //
    // THE SHAFT IS TALL BECAUSE THE PLAYER NEEDS ROOM TO ACT. At 260 units the
    // rock had already fallen past its bottom by the time the world stopped —
    // free fall covers 225 units in the first 500ms — so every ramp drawn in it
    // was above the rock and did nothing at all. Six completely different
    // strokes returned byte-identical results to doing nothing, which is what
    // sent me looking. 480 units leaves it high in the shaft at the freeze.
    { id: 'shaftL', type: 'platform', x: 200, y: 300, w: 16, h: 480 },
    // THE RIGHT WALL STOPS SHORT, and that is the door. With both walls running
    // the full height, a deflected rock rolled down the stroke and wedged in
    // the corner between ramp and wall at x=334 — every ramp tried, same jam.
    // Ending this one at y=660 gives the rock somewhere to GO once it has been
    // sent right, while the left wall still runs full height so a rock nobody
    // touched has no choice but to drop straight onto the losing arm.
    { id: 'shaftR', type: 'platform', x: 360, y: 300, w: 16, h: 360 },
    // THE LEVER. `pivot` makes this a dynamic body held at one point — it is
    // authored under `static` because that is where geometry lives, but it is
    // the one piece here that is not.
    { id: 'plank',  type: 'platform', x: 180, y: 830, w: 240, h: 18,
      pivot: { x: 300, y: 839 }, angle: -8, density: 0.01 },
    // The stops. Without these it is a propeller, not a see-saw: a free plank
    // measured 0deg to -246deg and kept turning.
    { id: 'stopL',  type: 'platform', x: 186, y: 876, w: 26, h: 20 },
    { id: 'stopR',  type: 'platform', x: 394, y: 876, w: 26, h: 20 },
    // Where a rock that went the RIGHT way lands. Ten units from the plank's
    // end, so a 52-unit rock rolls across the seam instead of down it. Milo
    // walks underneath with 252 units of clearance and never touches it.
    { id: 'deck',   type: 'platform', x: 430, y: 880, w: 240, h: 20 },
    // A LID OVER THE PLATE, flush with the lintel so there is no seam to fall
    // through. Without it the lever is optional: drop an unanchored line onto
    // the plate and the gate opens with the see-saw untouched.
    //
    // Sized from the rock, not from taste. It arrives ROLLING at y=854, so its
    // top edge is at 828; the lid hangs to 796 and leaves it 32 units of
    // headroom. Anything falling from above lands on the lid instead.
    { id: 'lid',    type: 'platform', x: 440, y: 780, w: 230, h: 16 },
    // THE LINTEL, and it is what stops the lever being decoration. Without it a
    // steep enough ramp throws the rock clean OVER the plank and straight onto
    // the deck — measured: a win at 2558ms with the plank still sitting at its
    // starting -8.0deg, never having moved. That is a solution that treats the
    // level's only new idea as scenery.
    //
    // It hangs down to y=790. The plank's raised end reaches y=805, so the
    // lever still swings free underneath; anything arriving through the air is
    // stopped and dropped onto the arm where it belongs.
    { id: 'lintel', type: 'platform', x: 424, y: 560, w: 16, h: 230 },
  ],
  objects: [
    { id: 'rock',  type: 'boulder', x: 270, y: 340, radius: 26,
      density: 0.03, restitution: 0.05, friction: 0.08,
      lethal: { kind: 'none' } },
    { id: 'plate', type: 'switch', x: 470, y: 850, w: 170, h: 30, triggers: ['gate'] },
    { id: 'gate',  type: 'gate',   x: 580, y: 1012, w: 34, h: 140 },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A28 — THE DUCT. Air that goes somewhere, rather than air that only lifts.
//
// A19 taught one thing about air and it only has one question: nothing in a
// column can climb out of it, so put something IN and the air does the rest.
// In, or not in. That is the whole level, and a second one asking it again
// would be A27's mistake with a different noun.
//
// This is the other half of the same thing. The zone has ALWAYS had a sideways
// component — `z.ax`, read by applyUpdrafts since the day updrafts were added
// — and nothing had ever used it, because a flue that only blows up can only
// ever hand its cargo back. Traced it: a rock fired out of a vertical column
// coasts up, stops, and falls straight back down the same column, forever.
// AIR CAN ONLY DELIVER IF IT LEANS.
//
// So the flue turns. The rock rides up the column, meets the roof, and is
// driven ALONG the underside of it — pinned there, because the lift beats
// gravity — until the roof runs out, directly over the walk.
//
// What that does to the STROKE is the point. In every other level the line
// catches, blocks or routes something that is falling past it once. Here the
// air holds the rock against whatever it meets, so the line does not have to
// catch anything: it only has to INTERRUPT. Stop the rock anywhere in the run
// and the draught pins it there and keeps it pinned.
// ─────────────────────────────────────────────────────────────────────────
export const A28 = {
  id: 'a28-duct',
  hint: 'THE AIR IS TAKING IT SOMEWHERE',
  world: 'backyard', verb: 'DUCT',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  freezeAt: 600,
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    // The column is closed on the right only as far as the bend. Above y=700
    // the rock is free to go where the air is pushing it.
    { id: 'colL',   type: 'platform', x: 260, y: 800,  w: 20,  h: 260 },
    { id: 'colR',   type: 'platform', x: 420, y: 920,  w: 20,  h: 140 },
    // Reaches all the way to the lip. At w=300 it stopped 20 units short and
    // the frozen sheet showed the lip as a free-floating post beside the duct
    // rather than its mouth — two objects where there is one machine.
    { id: 'roof',   type: 'platform', x: 260, y: 740,  w: 340, h: 20  },
    // THE LIP IS THE CLOCK. Without it the rock leaves the roof still moving
    // sideways and throws itself 98 units downrange — measured — which lands
    // it at x=648, on top of the goal, the exact staging fault A20 shipped.
    // Stopped dead at the mouth it falls straight, and a straight fall from
    // the roof takes 630ms, which is the walk from x=550 to the goal. The
    // duct is not timed by tuning; it is timed by where it ends.
    { id: 'lip',    type: 'platform', x: 580, y: 740,  w: 20,  h: 180 },
  ],
  objects: [
    { id: 'rock',  type: 'boulder', x: 310, y: 1020, radius: 26,
      density: 0.03, restitution: 0.1, friction: 0.06,
      lethal: { kind: 'impact', minSpeed: 380, graceRadius: 6 } },
  ],
  zones: [
    { id: 'duct', kind: 'updraft', x: 280, y: 760, w: 270, h: 300, accel: -2400, ax: 300 },
  ],
  // A TIGHT BUDGET, because the first measurement said the level was too kind.
  // At the default it swept 26.0% breadth — six times A19's and A21's, and
  // the easiest level in the game sitting at the end of it. The reason is the
  // duct's own generosity: the air pins ANYTHING that is not static, so a
  // scribble dropped in the run gets held against the roof and plugs it.
  // That is not a back door — it does not skip the machine, it IS the machine,
  // and it is the thing the level is teaching. It just must not be free.
  // 220 units still spans the column (140) and still walls the run (160). It
  // does not pay for a bowl, a ring, or a fence across the whole thing.
  drawing: { maxLength: 220 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A29 — THE RAIL. The first level where the stroke is a ROAD.
//
// Every other level in this game asks the player to STOP something: block it,
// catch it, wedge it, redirect it away. Even A28, which was the newest thing
// here, is won by interrupting a run. That is one verb wearing eleven costumes.
//
// This one cannot be won by stopping anything, and that is the whole design.
// The gate is shut and the only thing that opens it is the plate; neutralising
// the rock leaves Milo exactly as stuck as doing nothing. **The level demands
// DELIVERY, and delivery is the one thing a static line cannot do by itself.**
//
// Which is what the wind is for. `accel: 0` with a sideways `ax` is a draught
// that carries rather than lifts — the other half of the noun A28 opened up.
// The rock is already rolling when the world stops; the rail simply runs out
// before the plate does, and the player's line is the missing span.
//
// The wind is also what stops a lazy catch from working. Anywhere the player
// puts a floor, the rock keeps going: there is no friction in this engine and
// the air never lets up, so a shelf is not a resting place, it is more road.
// The only way to end the journey is to end it ON the plate.
//
// The lid is the plate back door, closed the way A21's was: the rock arrives
// ROLLING at centre y=754, top edge 728, so a lid hanging to 696 leaves it the
// same 32 units of headroom that worked there and stops anything dropped from
// above. Gate-and-plate is also what buys the wind its time — Milo crosses in
// 2.7 seconds and the draught needs longer, so he has to be held.
// ─────────────────────────────────────────────────────────────────────────
export const A29 = {
  id: 'a29-rail',
  hint: 'THE RAIL RUNS OUT BEFORE THE PLATE',
  world: 'backyard', verb: 'RAIL',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  freezeAt: 300,
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    { id: 'rail',   type: 'platform', x: 100, y: 760,  w: 160, h: 20  },
    // The far bank sits 20 units LOWER than the rail. A draught can only push
    // a rock up a slope shallower than atan(ax/g) — 18 degrees at ax=600 — so
    // a road that has to climb is a road that stalls. Downhill is free.
    // 120 UNITS BELOW THE RAIL, NOT 20. At 20 the level measured a precision
    // floor of 20u — under the 25u thumb limit, a HARD fail — because a road
    // that ended a hair too low put the rock under the deck instead of on it.
    // The margin is not horizontal, it is vertical: give the cargo a long drop
    // onto a wide bank and any road pointing the right way delivers. Same
    // finding as A2, where dropping the far bank took it from 1.1% to 7.4%:
    // descending is free, climbing is what costs.
    { id: 'deck',   type: 'platform', x: 440, y: 880,  w: 240, h: 20  },
    // NO LID, AND THE BANK IS WIDE. Four sweeps to find this. A lid hanging to
    // 796 (the trick that closed A21's back door) raised the precision floor
    // to 30u by filtering out the knife-edge wins, but took breadth to 1.6%,
    // under the floor. The weight gate on the plate makes it redundant anyway:
    // nothing dropped can press this plate at any height, lid or no lid.
    //
    // The knife-edge is not really the lid's fault, it is the FALL's: an
    // untouched rock drops almost straight, crossing the bank's height at
    // x=414 — measured — only a few units left of where the bank starts. So a
    // road that barely helps lands the rock right on the lip. The fix is to
    // make the landing zone big enough that "barely helps" still lands well
    // inside it, not to filter the fussy wins out afterwards.
    // The far end of the bank, so the delivered rock stays delivered instead
    // of coasting off the end — there is no friction here to stop it.
    { id: 'kerb',   type: 'platform', x: 680, y: 840,  w: 20,  h: 40  },
  ],
  objects: [
    // DENSE, AND IT COSTS NOTHING. The wind is an ACCELERATION and so is
    // gravity, so this rock's path is identical at any density — the mass is
    // here purely to be heavier than a line, and it buys the plate below.
    { id: 'rock',  type: 'boulder', x: 130, y: 734, radius: 26,
      density: 0.09, restitution: 0.1, friction: 0.06,
      lethal: { kind: 'none' } },
    // THE FIRST USE OF `requires: 'heavy'`, and the reason it works HERE when
    // it was ruled out everywhere else: a line's mass scales with the ink
    // budget. At the default maxLength of 900 one part can mass 288, which is
    // why gating by weight would have needed rocks seven times denser. This
    // level pays 320, and the heaviest DYNAMIC line 320 units buys is 103.4 —
    // measured, not assumed. The rock masses 189.3.
    //
    // (An ANCHORED line cannot press a plate at all, at any weight: it goes
    // static, and Matter reports no collision between two static bodies. So
    // the only thing the threshold has to beat is a dropped one.)
    { id: 'plate', type: 'switch', x: 450, y: 850, w: 230, h: 30, triggers: ['gate'],
      requires: 'heavy', minMass: 150 },
    { id: 'gate',  type: 'gate',   x: 230, y: 1012, w: 34, h: 140 },
  ],
  zones: [
    // Reaches down over the bank as well as the rail, so the draught walks the
    // rock the last few units onto the plate rather than leaving it just short.
    { id: 'draught', kind: 'updraft', x: 100, y: 620, w: 440, h: 260, accel: 0, ax: 600 },
  ],
  drawing: { maxLength: 320 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A30 — FLOAT. The first thing in this world that falls UP.
//
// Borrowed, and the borrowing is the point. Cut the Rope's bubble is the one
// element from that game that survives this repo's own rules: a rocket is a
// fixed thrust nobody can aim, a teleport is a rule rather than physics, and
// an air cushion is the draught levels 13/16/17 already have. A balloon MOVES
// AND ACTS — which no static noun can, because the player could simply draw it
// — and its question is none of the three already spent.
//
// It is an OBJECT and not a zone, and that is what makes it safe. An updraft
// plus any ceiling is a measured TRAP for Milo: the air pins him against the
// underside and airborne Milo has no horizontal drive to escape with. A
// balloon lifts a thing. Milo is never inside it.
//
// WHAT IT DOES TO THE STROKE is the reason to build it. Every line in this
// game so far has been something to land ON — a shelf, a ramp, a road, a
// floor. A rising body turns the line over: it is something to slide UNDER.
// Measured before any of this was written: under a FLAT roof the balloon rises,
// meets it, and sits at the same x for the rest of the level; tilt that roof 8
// degrees and it travels 79 units, at 16 it clears the end entirely. A ceiling
// steers what floats the way a ramp steers what falls.
//
// So doing nothing is not a death, it is a DEAD END — it parks in the pocket
// and stays there, and the gate it was supposed to open never opens. The stroke
// is the slope that gets it out.
// ─────────────────────────────────────────────────────────────────────────
export const A30 = {
  id: 'a30-float',
  hint: 'IT ONLY GOES UP',
  world: 'backyard', verb: 'FLOAT',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  freezeAt: 300,
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    // ONE CEILING, END TO END. It was two — a flat pocket and a separate shade
    // over the plate — and the 20-unit gap between them was a chimney: the
    // balloon steered out of the pocket rose straight through it and left the
    // level. A ceiling with a hole in it is not a ceiling.
    //
    // Flat, so it holds the balloon exactly where it found it, and so that
    // every unit of sideways travel has to come from the player.
    { id: 'roof',   type: 'platform', x: 180, y: 560,  w: 440, h: 18  },
    // The far wall of the pocket, so the balloon cannot simply drift out.
    { id: 'jamb',   type: 'platform', x: 162, y: 560,  w: 18,  h: 150 },
  ],
  objects: [
    // DENSE, AND IT COSTS NOTHING — the same finding level 17 paid for. Lift is
    // an ACCELERATION, so this balloon rises identically at any mass; the
    // density is here only so it outweighs a line. Without it the plate has a
    // back door: the roof sits directly on the plate, but a short line drawn in
    // the band just below is not touching either, so it falls unanchored
    // straight through the switch and opens the gate with no balloon involved.
    { id: 'balloon', type: 'boulder', x: 250, y: 1000, radius: 24,
      density: 0.30, restitution: 0.05, friction: 0.1, lift: 2400,
      lethal: { kind: 'none' } },
    // Directly under the roof, so the balloon travelling along the underside
    // runs into it. 300 units of ink cannot buy a line heavier than ~97.
    { id: 'plate', type: 'switch', x: 440, y: 578, w: 180, h: 30, triggers: ['gate'],
      requires: 'heavy', minMass: 200 },
    { id: 'gate',  type: 'gate',   x: 330, y: 1012, w: 34, h: 140 },
  ],
  zones: [],
  drawing: { maxLength: 300 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A31 — THORNS. The balloon's second question.
//
// FLOAT asks where a rising thing GOES. This asks where it STOPS rising, which
// is a different decision taken with the same one stroke — and it is the half
// of Cut the Rope's bubble that makes it a mechanic rather than a lift. There
// a tap pops it; here there is no tap, so the level supplies the thorn and the
// player decides whether the balloon ever gets to it, and with how much travel
// left when it does.
//
// The run is a safe roof that turns into a spiked one. Under the flat part the
// balloon parks where it started — measured on FLOAT: a level ceiling holds it
// at the same x for the rest of the level. Tilt it and the balloon walks right
// along the underside until the teeth take it, and WHERE IT POPS IS WHERE IT
// FALLS. Too little slope and it never reaches the thorns at all; too much and
// it is still travelling when it bursts and overshoots the chute.
//
// The plate is weight-gated for the third time and free for the third time:
// lift is an acceleration, so a balloon at 537 mass rises exactly like one at
// 36, and no line this level's ink can buy comes close to 200.
// ─────────────────────────────────────────────────────────────────────────
export const A31 = {
  id: 'a31-thorns',
  hint: 'IT POPS WHERE IT TOUCHES THEM',
  world: 'backyard', verb: 'THORNS',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  freezeAt: 300,
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    { id: 'jamb',   type: 'platform', x: 282, y: 520,  w: 18,  h: 160 },
    // SHARP END TO END, and that is the whole level. The first build split the
    // ceiling into a safe half and a sharp half, which put the pop point in the
    // LEVEL's hands rather than the player's: the balloon popped wherever the
    // safe roof happened to stop, so the only decision left was "make it move
    // at all". With teeth the whole way the player's line IS the shield, and
    // where their line ends is where it bursts. That is the decision.
    { id: 'thorns', type: 'platform', x: 220, y: 520,  w: 380, h: 16, sharp: true },
    // AND IT STARTS CLOSE. Widening the mouth took breadth from 0.1% to 1.2%
    // and it was still under the floor, because the other half of the filter is
    // stroke LENGTH: a shield spanning 300 units is a rare thing for a hand to
    // draw and it eats the whole ink budget. Starting the balloon 80 units
    // nearer means a shield of 60 to 220 units does the job, which is the
    // shape most real strokes already are. The judgement is untouched — it
    // still pops short of the mouth if the shield stops too soon.
    //
    // A WIDE MOUTH, because the first build was unplayable. At 110 units it
    // swept 0.1% breadth against a 2% floor — two wins in 2400 strokes. Both
    // halves of that were the same mistake: the shield had to run 300 units
    // from the jamb AND finish inside a narrow window, so almost nothing a
    // real hand draws qualified. The balloon now starts 80 units closer and
    // the mouth is 200 wide, which leaves the judgement intact (too short and
    // it never arrives, too long and it sails past) without demanding a
    // draughtsman.
    { id: 'chuteL', type: 'platform', x: 400, y: 660,  w: 18,  h: 200 },
    { id: 'chuteR', type: 'platform', x: 620, y: 660,  w: 18,  h: 200 },
    { id: 'floor',  type: 'platform', x: 400, y: 860,  w: 238, h: 18  },
  ],
  objects: [
    { id: 'balloon', type: 'boulder', x: 340, y: 1000, radius: 24,
      density: 0.30, restitution: 0.05, friction: 0.1, lift: 2400,
      lethal: { kind: 'none' } },
    { id: 'plate', type: 'switch', x: 418, y: 830, w: 200, h: 30, triggers: ['gate'],
      requires: 'heavy', minMass: 200 },
    { id: 'gate',  type: 'gate',   x: 300, y: 1012, w: 34, h: 140 },
  ],
  zones: [],
  // 400, NOT 320. A shield long enough to matter runs from the jamb to past
  // x=440, and at 320 three of the four candidate solutions came back REJECTED
  // too-long — the level was unsolvable by the only route it is built around.
  // The weight gate is unaffected: 400 units buys a line of about 129 against
  // a threshold of 200.
  drawing: { maxLength: 400 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A34 — SINK. A floor steers what sinks, the way a ceiling steers what floats.
//
// The exact mirror of level 18, and free: `applyUpdrafts` reads
// `z.accel ?? -2600`, so a POSITIVE accel pushes DOWN with no code change, and
// both renderers derive their chevrons from the flow vector, so the column
// draws itself pointing the right way in play and in the replay.
//
// A downdraft of 1500 beats a lift of 2400 once gravity's 1800 is on its side,
// so the balloon is held on the pan instead of rising off it. Measured before
// any geometry was written: on a FLAT pan it sinks to (370,796) and sits there
// for the rest of the level; tilt the pan 8 degrees and it slides out at x=498
// and floats free; tilt it -12 and it leaves at the other end. The slope
// chooses the side, and the column does the rest.
//
// So doing nothing is a DEAD END rather than a death, the same shape level 18
// uses, and the stroke is the tilted floor underneath.
//
// The plate is weight-gated rather than lidded because the gap under a lid is
// wide enough to draw a line in and drop it — the fault A30 caught. Density is
// free here for the third time running: the column and gravity are both
// ACCELERATIONS, so a balloon at 543 mass sinks exactly like one at 90.
// ─────────────────────────────────────────────────────────────────────────
export const A34 = {
  id: 'a34-sink',
  hint: 'THE AIR IS HOLDING IT DOWN',
  world: 'backyard', verb: 'SINK',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  freezeAt: 300,
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    // The pan. FLAT, so every unit of sideways travel is the player's.
    // A SHORT PAN AND A BIG PLATE. Three sweeps to settle, and the finding is
    // the one A31 paid for: breadth has two filters and stroke LENGTH is the
    // one that bites. 260-unit pan = 1.3%. 200-unit pan and a wider plate =
    // 1.8%. Deepening the plate instead ADDED knife-edge wins and dropped the
    // precision floor to 20u, under the thumb limit — a bigger target is not
    // automatically a better one. 160 is where a short, ordinary stroke does
    // the job.
    { id: 'pan',    type: 'platform', x: 300, y: 820, w: 160, h: 18 },
  ],
  objects: [
    { id: 'balloon', type: 'boulder', x: 380, y: 700, radius: 24,
      density: 0.30, restitution: 0.05, friction: 0.1, lift: 2400,
      lethal: { kind: 'none' } },
    // Off to the right and high, so it is only reachable by a balloon that got
    // out of the column on that side and then floated up.
    { id: 'plate', type: 'switch', x: 470, y: 500, w: 220, h: 100, triggers: ['gate'],
      requires: 'heavy', minMass: 200 },
    { id: 'gate',  type: 'gate',   x: 300, y: 1012, w: 34, h: 140 },
  ],
  zones: [
    { id: 'down', kind: 'updraft', x: 310, y: 400, w: 140, h: 420, accel: 1500, ax: 0 },
  ],
  drawing: { maxLength: 320 },
  solver: null,
};

/**
 * A43 — CRACK. The first question in this game that is not spatial.
 *
 * Every verb so far asks WHERE: which side of the pin, in the column or not,
 * where on the board, where it lets go. This one asks HOW HARD HE LANDS.
 *
 * MEASURED BEFORE A LINE OF IT WAS BUILT. A body caught on a shelf and let go
 * again lands at normal speed 267/289/317 from y=880, 464/473/500 from y=830
 * and 879/882/892 from y=500 — the three numbers in each group being shelf
 * angles of 12, 20 and 30 degrees. The landing speed tracks the HEIGHT of the
 * catch across a 3.3x range and barely moves with its ANGLE, which is the
 * property that makes it drawable: it depends on what the player chooses and
 * ignores what a shaky hand gets wrong. Catching high measures the same as not
 * catching at all, so the mistake reads honestly.
 *
 * WHY MILO IS THE CARGO, AND NOT A ROCK. The first two builds dropped a rock
 * down a chute onto this plank and BOTH passed every gate while being a fraud:
 * the certified winner caught the rock on the stroke at (568,975) and it sat
 * there for the rest of the level, so the plank was never touched and its
 * brittleness was decoration in the solved run. That is the A14 fraud the gates
 * cannot see, because they compare outcomes and not mechanisms.
 *
 * The cause is structural and worth keeping: A ROCK FALLING STRAIGHT DOWN CAN
 * ALWAYS BE PARKED ON A STATIC LINE, so any level that asks how hard it lands
 * can be answered with "it does not land at all". Milo cannot be parked — he
 * walks off whatever you give him, and a line that stops him dead is a stuck
 * timeout, which is a loss and not a bypass. He is the only body in this game
 * with that property.
 */
export const A43 = {
  id: 'a43-crack',
  hint: 'THAT PLANK WILL NOT TAKE A HARD LANDING',
  world: 'backyard', verb: 'CRACK',
  milo: { start: { x: 60, y: 700 }, speed: MILO.speed },
  goal: { id: 'goal', x: 646, y: 1136, w: 70, h: 140 },
  freezeAt: 900,
  static: [
    // The ledge he walks off. Nothing here stops him doing it.
    { id: 'ledge',   type: 'platform', x: 0,   y: 700,  w: 340, h: 60 },
    { id: 'groundR', type: 'platform', x: 640, y: 1136, w: 80,  h: 144 },
    // The plank over the pit, and the only way across. It takes a soft landing
    // and not a hard one, and 436 units of free fall is not a soft landing.
    { id: 'plank',   type: 'platform', x: 340, y: 1136, w: 300, h: 20, brittle: 600 },
  ],
  objects: [],
  zones: [
    // THE SPIKES SIT LOW ON PURPOSE. At y=1160 they touched the underside of
    // the plank and the filmstrip showed why that is wrong: with no daylight
    // under it the plank read as the RIM of the pit, so the hint named a thing
    // a stranger could not find in the frozen frame. Dropping them 60 units
    // puts air under the plank and makes it a bridge.
    { id: 'pit', kind: 'zone', x: 340, y: 1200, w: 300, h: 80, lethal: true },
  ],
  drawing: { maxLength: 220 },
  solver: null,
};

// THE GAME IS SIX CHAPTERS OF TEN, AND EVERY SLOT HAS A MEASURED TARGET.
//
// The order is not taste and it is not creation order. Each chapter follows the
// same sawtooth (SLOT_ROLES): an INTRO that teaches the chapter's new thing on
// its own, three levels that develop it, a SPIKE, a BREATHER, two more, a
// breather before the BOSS. tools/lib/difficulty.js turns slot k of chapter c
// into a target number of tries,
//
//     T(c, k) = 8.6 · 1.26^c · 4.0^p(k)
//
// fitted to the 21 levels that ship, and tools/test/curve.js holds every level
// inside its slot's band. A null slot is a level still to build; LEVELS skips
// it, so the game always ships whatever is complete, in its final order.
//
// New levels live in their own chapter file under js/levels/ (one file per
// chapter, so parallel work never edits the same file) and are placed here.
//
// The numbers cannot see silhouettes, so the contact sheet still has a vote:
// an earlier order put HANG and CHOOSE side by side — two tall posts with a
// ball between them, twice — and no number moved. Keep look-alikes apart.
export const SLOT_ROLES = [
  'INTRO', 'DEVELOP', 'DEVELOP', 'DEVELOP', 'SPIKE',
  'BREATHER', 'DEVELOP', 'DEVELOP', 'BREATHER', 'BOSS',
];

export const CHAPTERS = [
  { name: 'THE LINE',       slots: [A1,   A5,   A3,   null, A2,   A20,  A15,  A8,   A12,  null] },
  { name: 'PLATES & GATES', slots: [A9,   null, null, null, A10,  null, null, null, null, A11] },
  { name: 'TNT',            slots: [null, null, null, null, null, null, null, null, null, null] },
  { name: 'AIR',            slots: [A28,  null, null, null, A4,   null, A19,  null, null, A29] },
  { name: 'BALLOONS',       slots: [null, null, null, null, A30,  null, null, A13,  null, A34] },
  { name: 'ALL OF IT',      slots: [null, null, null, null, A31,  null, A43,  A21,  null, null] },
];

export const LEVELS = CHAPTERS.flatMap((ch) => ch.slots.filter(Boolean));

/** Where a level sits: its chapter, its slot and that slot's role. */
export function slotOf(id) {
  for (let c = 0; c < CHAPTERS.length; c++) {
    const k = CHAPTERS[c].slots.findIndex((l) => l?.id === id);
    if (k >= 0) return { chapter: c, k, role: SLOT_ROLES[k] };
  }
  return null;
}

// Levels that were built and did not ship are recorded in docs/HELD.md, with
// the measured reason for each and the commit where the code still lives.

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
      problems.push(`object "${o.id}" declares no lethality — give it a lethal spec `
        + `({ kind: 'none' } for a prop), or add its type to MECHANISM_TYPES`);
    }
    // A typo in `kind` used to produce an object that silently could not kill
    // anyone, because isFatal falls through unknown kinds to false. Catch it
    // here, where it is one line, instead of in playtesting.
    if (o.lethal && !LETHAL_KINDS.has(o.lethal.kind)) {
      problems.push(`object "${o.id}" has unknown lethal kind "${o.lethal.kind}"`);
    }
    // TNT must have a fuse and a body; a barrel that never goes off, or one
    // with no size to be caught by, is a bug and not a level.
    if (o.type === 'tnt' && !(o.fuse > 0)) problems.push(`tnt "${o.id}" has no fuse`);
    if (o.type === 'tnt' && !(o.radius > 0)) problems.push(`tnt "${o.id}" has no radius`);
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
