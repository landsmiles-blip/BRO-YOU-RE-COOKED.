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

/**
 * TILT — a balloon held on a pan by a column of falling air. Distilled from
 * A34 SINK, filmed being won.
 *
 * The idea: a floor steers what sinks, so the stroke is the tilt. The search
 * is the one number that decided that level three sweeps running — HOW LONG
 * the pan is, and therefore how long the winning stroke has to be. Measured
 * on A34: a 260-unit pan swept 1.3%, 200 gave 1.8%, 160 passed at 2.0%. The
 * range below stays inside that envelope rather than exploring outside it.
 *
 * The column sits INSIDE the pan on purpose. Outside it the balloon's own lift
 * carries it away, so the two ends of the pan are not equivalent — which is
 * the whole decision, and why A36 failed when the column reached past the pan.
 */
function tilt(r) {
  const groundY = step(r, 1120, 1160, 8);
  const panW = step(r, 140, 190, 10);
  const panX = step(r, 280, 330, 10);
  const panY = step(r, 780, 850, 10);
  const colInset = step(r, 8, 16, 2);          // column narrower than the pan
  const colX = panX + colInset;
  const colW = panW - colInset * 2;
  return {
    verb: 'SINK',
    milo: { start: { x: step(r, 70, 120, 10), y: groundY }, speed: MILO.speed },
    goal: { id: 'goal', x: step(r, 640, 680, 10), y: groundY, w: 70, h: 140 },
    static: [
      { id: 'ground', type: 'platform', x: 0, y: groundY, w: SAFE_BOX.w, h: SAFE_BOX.h - groundY },
      { id: 'pan', type: 'platform', x: panX, y: panY, w: panW, h: 18 },
    ],
    objects: [
      // Dense so the plate's weight gate can never be pressed by a line. Free:
      // lift and the column are both ACCELERATIONS, so mass does not move it.
      { id: 'balloon', type: 'boulder', x: panX + panW / 2, y: panY - step(r, 100, 160, 10),
        radius: 24, density: 0.30, restitution: 0.05, friction: 0.1,
        lift: 2400, lethal: { kind: 'none' } },
      { id: 'plate', type: 'switch', x: panX + panW + step(r, 10, 40, 10),
        y: step(r, 470, 560, 10), w: step(r, 190, 240, 10), h: 100,
        triggers: ['gate'], requires: 'heavy', minMass: 200 },
      { id: 'gate', type: 'gate', x: step(r, 260, 330, 10), y: groundY - 140, w: 34, h: 140 },
    ],
    zones: [
      { id: 'down', kind: 'updraft', x: colX, y: step(r, 380, 440, 20),
        w: colW, h: step(r, 380, 440, 20), accel: step(r, 1400, 1700, 50), ax: 0 },
    ],
    drawing: { maxLength: step(r, 300, 340, 10), denyZones: [] },
  };
}

/**
 * SHIELD — a balloon rising into a ceiling of thorns, with a bin underneath.
 * Distilled from A31 THORNS, filmed being won.
 *
 * The idea: the player's line is the shield, so where their line ends is where
 * it bursts, and where it bursts is where it falls. The search is the catch
 * width and how far the balloon starts from it — the two numbers that took
 * that level from 0.1% to 2.0%. A 110-unit mouth was unplayable; 200 works.
 */
function shield(r) {
  const groundY = step(r, 1120, 1160, 8);
  const ceilY = step(r, 490, 560, 10);
  const jambX = step(r, 260, 300, 10);
  const mouthW = step(r, 190, 240, 10);
  const chuteX = step(r, 390, 430, 10);        // left wall of the catch
  const floorY = step(r, 840, 890, 10);
  return {
    verb: 'THORNS',
    milo: { start: { x: step(r, 70, 120, 10), y: groundY }, speed: MILO.speed },
    goal: { id: 'goal', x: step(r, 640, 680, 10), y: groundY, w: 70, h: 140 },
    static: [
      { id: 'ground', type: 'platform', x: 0, y: groundY, w: SAFE_BOX.w, h: SAFE_BOX.h - groundY },
      { id: 'jamb', type: 'platform', x: jambX, y: ceilY, w: 18, h: 160 },
      // Sharp end to end: the pop point belongs to the player, not the level.
      { id: 'thorns', type: 'platform', x: jambX + 18, y: ceilY,
        w: Math.min(SAFE_BOX.w - 60, chuteX + mouthW + 60) - (jambX + 18), h: 16, sharp: true },
      { id: 'chuteL', type: 'platform', x: chuteX, y: ceilY + 140, w: 18, h: floorY - ceilY - 140 },
      { id: 'chuteR', type: 'platform', x: chuteX + mouthW + 18, y: ceilY + 140, w: 18, h: floorY - ceilY - 140 },
      { id: 'floor', type: 'platform', x: chuteX, y: floorY, w: mouthW + 36, h: 18 },
    ],
    objects: [
      { id: 'balloon', type: 'boulder', x: jambX + step(r, 40, 90, 10), y: groundY - step(r, 120, 180, 10),
        radius: 24, density: 0.30, restitution: 0.05, friction: 0.1,
        lift: 2400, lethal: { kind: 'none' } },
      { id: 'plate', type: 'switch', x: chuteX + 18, y: floorY - 30, w: mouthW, h: 30,
        triggers: ['gate'], requires: 'heavy', minMass: 200 },
      { id: 'gate', type: 'gate', x: step(r, 230, 300, 10), y: groundY - 140, w: 34, h: 140 },
    ],
    zones: [],
    drawing: { maxLength: step(r, 360, 420, 20), denyZones: [] },
  };
}

export const ARCHETYPES = { drop, crossing, chimney, roller, trigger, tilt, shield };

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
