// GATE TEST 2 — the one the project hinges on.
//
// Matter.js has NO continuous collision detection. A body that starts one side
// of a thin obstacle and ends the other side within a single step generates no
// contact at all — silently. In this game that means the player draws a perfect
// wall and the boulder passes straight through it, with no error and nothing in
// the console. It looks exactly like the mechanic failing.
//
// The guarantee (Bible §3.4): travel-per-step ≤ ½ × line thickness.
//     MAX_SPEED / PHYSICS_HZ  ≤  LINE.thickness / 2
//     900 / 120 = 7.5u        ≤  16 / 2 = 8u        ✓
//
// This test fires a small fast body perpendicularly at a drawn-line-thickness
// barrier at 20 orientations and asserts 20 contacts. The CONTROL below
// reproduces the original v0.3/v0.4 spec (60Hz, 14u line, unclamped) to
// demonstrate that the bug was real and that these constants are what closed it.
//
// Roadmap §7.

import Matter from '../../js/physics/matter.js';
import { createWorld, addRect, addCircle, setVelocity, step, onCollisionStart, destroyWorld }
  from '../../js/physics/adapter.js';
import { MAX_SPEED, PHYSICS_HZ, LINE, GRAVITY_Y } from '../../js/constants.js';

const ORIENTATIONS = 20;
const PHASES = 12;        // whether a body skips an obstacle depends on WHERE its
                          // discrete steps land relative to it. Testing one standoff
                          // tests one phase and can pass by luck. Sweep it.
const BASE_STANDOFF = 150;
const PROJECTILE_R = 6;   // small = worst case

// ── Main: the shipping configuration, through the real adapter ───────────
console.log(`\nTUNNELING — ${MAX_SPEED} u/s into a ${LINE.thickness}u barrier @ ${PHYSICS_HZ}Hz`);
console.log(`  travel/step ${(MAX_SPEED / PHYSICS_HZ).toFixed(2)}u  vs  half-thickness ${(LINE.thickness / 2).toFixed(1)}u\n`);

const stepLen = MAX_SPEED / PHYSICS_HZ;
let hits = 0, trials = 0;
const misses = [];

for (let i = 0; i < ORIENTATIONS; i++) {
  const phi = (Math.PI * i) / ORIENTATIONS;          // barrier orientation
  const nx = -Math.sin(phi), ny = Math.cos(phi);     // barrier normal

  for (let k = 0; k < PHASES; k++) {
    const standoff = BASE_STANDOFF + (stepLen * k) / PHASES;   // sub-step phase offset
    trials++;

    const ctx = createWorld({ gravityY: 0 });        // isolate the variable
    addRect(ctx, { id: 'barrier', x: 0, y: 0, w: 400, h: LINE.thickness, angle: phi, isStatic: true });
    const p = addCircle(ctx, {
      id: 'p', x: -nx * standoff, y: -ny * standoff, radius: PROJECTILE_R, frictionAir: 0,
    });

    let hit = false;
    onCollisionStart(ctx, (a, b) => {
      if (a.gameId === 'barrier' || b.gameId === 'barrier') hit = true;
    });

    for (let s = 0; s < 80 && !hit; s++) {
      setVelocity(p, nx * MAX_SPEED, ny * MAX_SPEED); // maintain approach speed
      step(ctx);
    }

    if (hit) hits++;
    else misses.push(`${(phi * 180 / Math.PI).toFixed(0)}°/p${k}`);
    destroyWorld(ctx);
  }
}

const pass = hits === trials;
console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${hits}/${trials} contacts (${ORIENTATIONS} orientations x ${PHASES} phases)`);
if (!pass) console.log(`        tunnelled at: ${misses.slice(0, 12).join(', ')}`);

// ── Control: the spec this replaced ─────────────────────────────────────
// Raw Matter, deliberately NOT the adapter — this is the configuration the
// v0.3 spec and the v0.4 addendum described, reproduced to show it leaks.
console.log(`\nCONTROL — original spec (60Hz, 14u line, unclamped free fall)`);
{
  const { Engine, Bodies, Composite, Body, Events } = Matter;
  const fallHeight = 1280;
  const vImpact = Math.sqrt(2 * GRAVITY_Y * fallHeight);
  console.log(`  a body falling the world height reaches ${vImpact.toFixed(0)} u/s`);
  console.log(`  at 60Hz that is ${(vImpact / 60).toFixed(1)}u per step through a 14u line\n`);

  const ctlStep = vImpact / 60;
  let ctlHits = 0, ctlTrials = 0;
  for (let i = 0; i < ORIENTATIONS; i++) {
    const phi = (Math.PI * i) / ORIENTATIONS;
    const nx = -Math.sin(phi), ny = Math.cos(phi);

    for (let k = 0; k < PHASES; k++) {
      const standoff = BASE_STANDOFF + (ctlStep * k) / PHASES;
      ctlTrials++;

      const engine = Engine.create({ enableSleeping: false });
      engine.gravity.y = 0;
      const barrier = Bodies.rectangle(0, 0, 400, 14, { angle: phi, isStatic: true });
      const p = Bodies.circle(-nx * standoff, -ny * standoff, PROJECTILE_R, { frictionAir: 0 });
      Composite.add(engine.world, [barrier, p]);

      let hit = false;
      Events.on(engine, 'collisionStart', () => { hit = true; });

      const vM = vImpact * (1000 / 60) / 1000;   // u/s → Matter velocity units
      for (let s = 0; s < 80 && !hit; s++) {
        Body.setVelocity(p, { x: nx * vM, y: ny * vM });
        Engine.update(engine, 1000 / 60);
      }
      if (hit) ctlHits++;
      Engine.clear(engine);
    }
  }
  const leaks = ctlTrials - ctlHits;
  const pct = (leaks / ctlTrials * 100).toFixed(0);
  console.log(`  ${leaks > 0 ? 'CONFIRMED' : 'no leak'}  original spec tunnelled ${leaks}/${ctlTrials} trials (${pct}%)`);
  if (leaks > 0) {
    console.log(`        INTERMITTENT, not total — it depends on step phase, which is`);
    console.log(`        worse: the wall works most times and fails unpredictably.`);
  }
}

console.log(pass ? '\nTUNNELING: PASS\n' : '\nTUNNELING: FAIL\n');
process.exit(pass ? 0 : 1);
