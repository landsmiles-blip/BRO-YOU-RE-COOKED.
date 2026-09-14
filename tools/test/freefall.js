// GATE TEST 1 — unit conversion.
//
// Asserts that the adapter's world units and seconds actually map onto Matter's
// pixels, milliseconds and displacement-per-step. If this fails, every physics
// constant in the game is meaningless and nothing downstream can be trusted.
//
// NOTE ON THE MODEL — this matters and cost a debugging round:
// Matter integrates semi-implicitly (velocity updated, THEN position), so after
// n steps a free-falling body has travelled
//
//     d = g · dt² · n(n+1)/2          NOT   d = ½gt²
//
// The two differ by exactly ½·g·dt·t. That is inherent to fixed-step
// integration, not an error — but it means continuous-formula trajectory maths
// (as used in the v0.4 addendum's A4 level spec) runs OPTIMISTIC by that
// amount. At 120Hz and g=1800 that is ~1.5u at t=0.2s, ~3u at t=0.4s. Level
// geometry derived analytically must be validated by the solver harness, never
// trusted from the closed-form alone.
//
// Bible §3.4 / Roadmap §7.

import { createWorld, addCircle, step, getSpeed, destroyWorld } from '../../js/physics/adapter.js';
import { GRAVITY_Y, PHYSICS_DT, PHYSICS_HZ, MAX_SPEED } from '../../js/constants.js';

let failures = 0;
const check = (label, actual, expected, tolPct) => {
  const err = Math.abs(actual - expected) / Math.abs(expected) * 100;
  const ok = err <= tolPct;
  if (!ok) failures++;
  console.log(
    `  ${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(40)} ` +
    `expect ${expected.toFixed(2).padStart(9)}  got ${actual.toFixed(2).padStart(9)}  (${err.toFixed(4)}%)`
  );
};

const dt = 1 / PHYSICS_HZ;
console.log(`\nFREE-FALL — gravity ${GRAVITY_Y} u/s² @ ${PHYSICS_HZ}Hz (dt ${PHYSICS_DT.toFixed(3)}ms)\n`);

const ctx = createWorld();
const startY = 0;
const ball = addCircle(ctx, { id: 'b', x: 0, y: startY, radius: 10, frictionAir: 0 });

// Sample below the clamp: v = gt reaches MAX_SPEED at t = 0.5s.
const targets = [0.20, 0.40];
const maxSteps = Math.round(Math.max(...targets) * PHYSICS_HZ);
const seen = new Map();

for (let n = 1; n <= maxSteps; n++) {
  step(ctx);
  for (const t of targets) {
    if (n === Math.round(t * PHYSICS_HZ)) {
      seen.set(t, { n, d: ball.position.y - startY, v: getSpeed(ball) });
    }
  }
}

for (const t of targets) {
  const { n, d, v } = seen.get(t);
  check(`distance @ t=${t}s  d = g·dt²·n(n+1)/2`, d, GRAVITY_Y * dt * dt * n * (n + 1) / 2, 0.1);
  check(`speed    @ t=${t}s  v = g·t`,            v, GRAVITY_Y * n * dt,                     0.1);
  const drift = d - 0.5 * GRAVITY_Y * (n * dt) ** 2;
  console.log(`        discrete-vs-continuous drift: ${drift.toFixed(3)}u (expected ${(0.5 * GRAVITY_Y * dt * n * dt).toFixed(3)}u)`);
}
destroyWorld(ctx);

// ── Clamp ───────────────────────────────────────────────────────────────
console.log(`\nSPEED CLAMP — the anti-tunneling guarantee\n`);
const ctx2 = createWorld();
const faller = addCircle(ctx2, { id: 'f', x: 0, y: 0, radius: 10, frictionAir: 0 });
let peak = 0;
for (let i = 0; i < PHYSICS_HZ * 3; i++) { step(ctx2); peak = Math.max(peak, getSpeed(faller)); }
const clampOk = peak <= MAX_SPEED * 1.001;
if (!clampOk) failures++;
console.log(`  ${clampOk ? 'PASS' : 'FAIL'}  peak speed over 3s free fall`.padEnd(50) +
            ` limit ${MAX_SPEED}  got ${peak.toFixed(2)} u/s`);
console.log(`        unclamped this would reach ${(GRAVITY_Y * 3).toFixed(0)} u/s`);
console.log(`        travel per step at clamp: ${(MAX_SPEED / PHYSICS_HZ).toFixed(2)}u vs 16u line (need ≤8u)`);
destroyWorld(ctx2);

console.log(failures === 0 ? '\nFREE-FALL: PASS\n' : `\nFREE-FALL: ${failures} FAILURE(S)\n`);
process.exit(failures === 0 ? 0 : 1);
