// LEVEL ARCHETYPES — the shapes the generator is allowed to build.
//
// THE DIVISION OF LABOUR THIS FILE ENCODES:
//
// A machine cannot have an idea. "The rock that is trying to kill you becomes
// the floor you walk across" is a thought, and no amount of sampling finds it —
// A14 proved that the other way round, by PASSING every automated gate while
// being a fraud with a decorative rock in it. The gates measure whether a level
// is FAIR. Nothing measures whether it MEANS anything.
//
// So the generator is not allowed to invent levels. It is given a shape that
// already carries an idea — a falling hazard, a crossing, a chimney with two
// ways out — and its job is to search the NUMBERS inside that shape: where the
// ledge goes, how wide the gap is, how fast the roller rolls. That is a search
// problem, which is what machines are for.
//
// Every archetype here is distilled from a level that already works and has
// been filmed being won. They are not guesses.

import { MILO, LINE, SAFE_BOX } from '../../js/constants.js';

/** Deterministic RNG — a generated batch must be reproducible from its seed. */
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const between = (r, lo, hi) => lo + r() * (hi - lo);
const step = (r, lo, hi, by) => Math.round(between(r, lo, hi) / by) * by;

const IMPACT = { kind: 'impact', minSpeed: 400, graceRadius: 6 };

/**
 * DROP — something falls on his walking line. Distilled from A1 and A5.
 * The idea: block it, or steer it somewhere harmless. The search: where the
 * anchors are, and how much room there is between them.
 */
function drop(r) {
  const groundY = step(r, 1040, 1160, 8);
  const rockX = step(r, 300, 470, 10);
  const shelfGap = step(r, 90, 210, 10);       // the hole the rock falls through
  const shelfY = step(r, 720, 880, 10);
  const shelfW = step(r, 80, 150, 10);
  const leftX = rockX - shelfGap / 2 - shelfW;
  return {
    verb: 'BLOCK',
    milo: { start: { x: step(r, 70, 150, 10), y: groundY }, speed: MILO.speed },
    goal: { id: 'goal', x: step(r, 600, 660, 10), y: groundY, w: 70, h: 140 },
    static: [
      { id: 'ground', type: 'platform', x: 0, y: groundY, w: SAFE_BOX.w, h: SAFE_BOX.h - groundY },
      { id: 'shelfL', type: 'platform', x: leftX, y: shelfY, w: shelfW, h: 28 },
      { id: 'shelfR', type: 'platform', x: rockX + shelfGap / 2, y: shelfY, w: shelfW, h: 28 },
    ],
    objects: [
      { id: 'rock', type: 'boulder', x: rockX, y: step(r, 220, 360, 10),
        radius: step(r, 22, 32, 2), density: 0.03, restitution: 0.06,
        friction: 0.4, lethal: IMPACT },
    ],
    zones: [],
    drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  };
}

/**
 * CROSSING — a hole between him and the goal. Distilled from A2 and A4.
 * The idea: the line is terrain. The search: how wide, and how much of the
 * crossing is a descent (free) versus a climb (gated by the 22u step-up).
 */
function crossing(r) {
  const nearY = step(r, 860, 1000, 10);
  const drop = step(r, 0, 220, 20);            // far bank lower by this much
  const farY = Math.min(1140, nearY + drop);
  const gap = step(r, 130, 240, 10);
  const nearW = step(r, 280, 360, 10);
  const farX = nearW + gap;
  return {
    verb: 'BRIDGE',
    milo: { start: { x: step(r, 70, 140, 10), y: nearY }, speed: MILO.speed },
    goal: { id: 'goal', x: Math.min(670, farX + 130), y: farY, w: 70, h: 140 },
    static: [
      { id: 'bankL', type: 'platform', x: 0, y: nearY, w: nearW, h: SAFE_BOX.h - nearY },
      { id: 'bankR', type: 'platform', x: farX, y: farY, w: SAFE_BOX.w - farX, h: SAFE_BOX.h - farY },
    ],
    objects: [],
    zones: [{ id: 'pit', kind: 'zone', x: nearW + 5, y: 1215, w: gap - 10, h: 65, lethal: true }],
    drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  };
}

/**
 * CHIMNEY — a hazard comes down a shaft with somewhere harmless beside it.
 * Distilled from A15, the level that finally became a real fork.
 * The idea: plug it high, or send it sideways. Two answers, one problem.
 */
function chimney(r) {
  const groundY = step(r, 1100, 1160, 8);
  const chimX = step(r, 200, 300, 10);
  const chimW = step(r, 120, 200, 10);
  const chimTop = step(r, 340, 440, 10);
  const chimH = step(r, 360, 460, 10);
  const shelfX = Math.min(560, chimX + chimW + step(r, 60, 140, 10));
  return {
    verb: 'CHOOSE',
    milo: { start: { x: step(r, 60, 110, 10), y: groundY }, speed: MILO.speed },
    goal: { id: 'goal', x: 660, y: groundY, w: 70, h: 140 },
    static: [
      { id: 'ground', type: 'platform', x: 0, y: groundY, w: SAFE_BOX.w, h: SAFE_BOX.h - groundY },
      { id: 'chimL', type: 'platform', x: chimX, y: chimTop, w: 30, h: chimH },
      { id: 'chimR', type: 'platform', x: chimX + chimW, y: chimTop, w: 30, h: chimH },
      { id: 'shelf', type: 'platform', x: shelfX, y: step(r, 960, 1040, 10),
        w: Math.min(200, SAFE_BOX.w - shelfX), h: 26 },
    ],
    objects: [
      { id: 'rock', type: 'boulder', x: chimX + chimW / 2 + step(r, -20, 20, 5),
        y: chimTop + step(r, 40, 90, 10), radius: step(r, 22, 28, 2),
        density: 0.03, restitution: 0.06, friction: 0.35, lethal: IMPACT },
    ],
    zones: [],
    drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  };
}

/**
 * ROLLER — a hazard already in motion when the world freezes.
 * Distilled from A8 and A12. The idea: you are heading something off, not
 * blocking it. The search is TIMING, which is the part I got wrong by hand:
 * my first A12 had the roller land 300 units behind Milo, so the level solved
 * itself. A machine sweeping speeds and ledge lengths does not make that
 * mistake, because the idle gate catches every one.
 */
function roller(r) {
  const groundY = step(r, 1100, 1160, 8);
  const ledgeY = step(r, 840, 940, 10);
  const ledgeX = step(r, 420, 560, 20);
  const speed = -step(r, 180, 380, 20);
  return {
    verb: 'INTERCEPT',
    milo: { start: { x: step(r, 60, 110, 10), y: groundY }, speed: MILO.speed },
    goal: { id: 'goal', x: 665, y: groundY, w: 70, h: 140 },
    static: [
      { id: 'ground', type: 'platform', x: 0, y: groundY, w: SAFE_BOX.w, h: SAFE_BOX.h - groundY },
      { id: 'ledge', type: 'platform', x: ledgeX, y: ledgeY, w: SAFE_BOX.w - ledgeX, h: 30 },
    ],
    objects: [
      { id: 'roller', type: 'boulder', x: step(r, 620, 680, 10), y: ledgeY - 34, radius: 34,
        density: 0.04, restitution: 0.05, friction: 0.15, frictionAir: 0,
        vx: speed, lethal: IMPACT },
    ],
    zones: [],
    drawing: { maxLength: step(r, 400, 560, 20), denyZones: [] },
  };
}

/**
 * TRIGGER — a plate opens a gate, and only something ELSE can press it.
 * Distilled from A9, A10 and A11. The idea: one stroke, several consequences.
 */
function trigger(r) {
  const groundY = step(r, 1120, 1160, 8);
  const plateX = step(r, 230, 330, 10);
  const plateY = step(r, 700, 900, 20);
  const withRock = r() > 0.35;
  const objects = [
    { id: 'plate', type: 'switch', x: plateX, y: plateY - 32, w: step(r, 130, 170, 10), h: 32,
      triggers: ['gate'] },
    { id: 'gate', type: 'gate', x: step(r, 520, 570, 10), y: groundY - 140, w: 34, h: 140 },
  ];
  if (withRock) {
    objects.unshift({ id: 'rock', type: 'boulder', x: step(r, 250, 420, 10), y: step(r, 180, 280, 10),
      radius: 26, density: 0.03, restitution: 0.08, friction: 0.4, lethal: IMPACT });
  }
  const statics = [
    { id: 'ground', type: 'platform', x: 0, y: groundY, w: SAFE_BOX.w, h: SAFE_BOX.h - groundY },
    { id: 'shelf', type: 'platform', x: plateX - 20, y: plateY, w: step(r, 180, 220, 10), h: 26 },
  ];
  if (withRock) {
    statics.push({ id: 'lip', type: 'platform', x: step(r, 120, 220, 10), y: step(r, 620, 700, 10),
      w: step(r, 100, 140, 10), h: 26 });
  }
  return {
    verb: 'TRIGGER',
    milo: { start: { x: step(r, 60, 110, 10), y: groundY }, speed: step(r, 180, 220, 10) },
    goal: { id: 'goal', x: 665, y: groundY, w: 70, h: 140 },
    static: statics,
    objects,
    zones: [],
    drawing: { maxLength: LINE.maxLengthDefault, denyZones: [] },
  };
}

export const ARCHETYPES = { drop, crossing, chimney, roller, trigger };

/** Build one candidate. freezeAt is filled in later, from its own idle run. */
export function generate(name, seed) {
  const r = rng(seed);
  const make = ARCHETYPES[name];
  if (!make) throw new Error(`unknown archetype "${name}"`);
  const lvl = make(r);
  lvl.id = `gen-${name}-${seed}`;
  lvl.world = 'backyard';
  lvl.solver = null;
  lvl.freezeAt = 600;                // provisional; generate.js re-derives it
  lvl.generated = { archetype: name, seed };
  return lvl;
}
