// The ONLY file in the project that imports Matter.js.
//
// Why this boundary exists (Bible §5.4): Matter has no continuous collision
// detection and its maintenance has slowed. If the tunneling gate fails or
// stacking proves unstable, we swap to Planck.js. Behind this adapter that is
// a one-to-two day job. Without it, a rewrite.
//
// UNITS — this adapter's entire public surface speaks world units and SECONDS.
// Matter internally speaks pixels, milliseconds, and displacement-per-step.
// All conversion happens here and nowhere else.
//
//   Matter integrates as:  velocity += (force/mass) * dt²      [dt in ms]
//   with gravity force:    force.y = mass * gravity.y * gravity.scale
//   therefore accel        a = gravity.y * gravity.scale        [px/ms²]
//   in u/s²                a * 1e6
//   so for GRAVITY_Y:      gravity.y = GRAVITY_Y / 1000  (at scale 0.001)
//
//   body.velocity is displacement per step, normalised by Body._baseDelta
//   (1000/60 ms) through get/setVelocity — so u/s converts by ÷60 and ×60.
//
// These relationships are asserted by tools/test/freefall.js. Do not trust
// this comment; trust the test.

import Matter from './matter.js';
import { GRAVITY_Y, PHYSICS_DT, MAX_SPEED, SOLVER_ITER } from '../constants.js';

const { Engine, World, Bodies, Body, Composite, Events, Constraint } = Matter;

const GRAVITY_SCALE = 0.001;
const BASE_DELTA = 1000 / 60;

/** u/s → Matter's velocity units (displacement per _baseDelta). */
const toMatterVel = (unitsPerSec) => unitsPerSec * (BASE_DELTA / 1000);
/** Matter's velocity units → u/s. */
const toUnitsPerSec = (matterVel) => matterVel * (1000 / BASE_DELTA);

export function createWorld({ gravityY = GRAVITY_Y } = {}) {
  const engine = Engine.create({
    positionIterations: SOLVER_ITER.position,
    velocityIterations: SOLVER_ITER.velocity,
    // Determinism: never let the engine adapt its own timestep.
    enableSleeping: false,
  });
  engine.gravity.scale = GRAVITY_SCALE;
  engine.gravity.y = gravityY / 1000;
  engine.gravity.x = 0;
  return { engine, world: engine.world, _contacts: [] };
}

export function destroyWorld(ctx) {
  if (!ctx) return;
  World.clear(ctx.world, false);
  Engine.clear(ctx.engine);
  ctx._contacts.length = 0;
}

// ── Body creation ───────────────────────────────────────────────────────

export function addRect(ctx, { id, x, y, w, h, isStatic = false, angle = 0, ...opts }) {
  const body = Bodies.rectangle(x, y, w, h, { isStatic, angle, ...opts });
  body.gameId = id;
  Composite.add(ctx.world, body);
  return body;
}

export function addCircle(ctx, { id, x, y, radius, isStatic = false, ...opts }) {
  const body = Bodies.circle(x, y, radius, { isStatic, ...opts });
  body.gameId = id;
  Composite.add(ctx.world, body);
  return body;
}

export function addCapsule(ctx, { id, x, y, w, h, chamfer, ...opts }) {
  const body = Bodies.rectangle(x, y, w, h, { chamfer: { radius: chamfer }, ...opts });
  body.gameId = id;
  Composite.add(ctx.world, body);
  return body;
}

/** Rigid weld between a body and static geometry — the anchoring model, Bible §3.2. */
export function addWeld(ctx, bodyA, bodyB, pointA, pointB) {
  const c = Constraint.create({
    bodyA, bodyB, pointA, pointB,
    stiffness: 1, damping: 0.1, length: 0,
  });
  Composite.add(ctx.world, c);
  return c;
}

export function removeBody(ctx, body) {
  Composite.remove(ctx.world, body);
}

// ── Velocity (u/s at the boundary) ──────────────────────────────────────

export function setVelocity(body, vxPerSec, vyPerSec) {
  Body.setVelocity(body, { x: toMatterVel(vxPerSec), y: toMatterVel(vyPerSec) });
}

export function getVelocity(body) {
  const v = Body.getVelocity(body);
  return { x: toUnitsPerSec(v.x), y: toUnitsPerSec(v.y) };
}

export function getSpeed(body) {
  const v = getVelocity(body);
  return Math.hypot(v.x, v.y);
}

// ── Stepping ────────────────────────────────────────────────────────────

/**
 * Clamp every dynamic body to MAX_SPEED.
 *
 * This is not a hack — it is the anti-tunneling guarantee (Bible §3.4).
 * At 120 Hz, 900 u/s is 7.5 units of travel per step against a 16-unit line:
 * inside the half-thickness margin the solver needs to build a real contact
 * manifold. It also reads as terminal velocity, which is better for the
 * puzzle than true acceleration.
 */
function clampSpeeds(ctx) {
  const bodies = Composite.allBodies(ctx.world);
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    if (b.isStatic || b.isSleeping) continue;
    const v = Body.getVelocity(b);
    const speed = toUnitsPerSec(Math.hypot(v.x, v.y));
    if (speed > MAX_SPEED) {
      const k = MAX_SPEED / speed;
      Body.setVelocity(b, { x: v.x * k, y: v.y * k });
    }
  }
}

/** One fixed physics step. Never called with a variable delta. */
export function step(ctx) {
  Engine.update(ctx.engine, PHYSICS_DT);
  clampSpeeds(ctx);
}

// ── Collision events ────────────────────────────────────────────────────

export function onCollisionStart(ctx, handler) {
  Events.on(ctx.engine, 'collisionStart', (evt) => {
    for (const pair of evt.pairs) handler(pair.bodyA, pair.bodyB, pair);
  });
}

export function allBodies(ctx) {
  return Composite.allBodies(ctx.world);
}

/** Ray query. Returns hit bodies, optionally filtered. */
export function raycast(ctx, x1, y1, x2, y2, filter = null) {
  const bodies = Composite.allBodies(ctx.world);
  const hits = Matter.Query.ray(bodies, { x: x1, y: y1 }, { x: x2, y: y2 });
  return filter ? hits.filter((h) => filter(h.body)) : hits;
}

/** Axis-aligned region query. */
export function queryRegion(ctx, x, y, w, h, filter = null) {
  const bounds = { min: { x, y }, max: { x: x + w, y: y + h } };
  const hits = Matter.Query.region(Composite.allBodies(ctx.world), bounds);
  return filter ? hits.filter(filter) : hits;
}

export function setPosition(body, x, y) { Body.setPosition(body, { x, y }); }
export function setAngle(body, a) { Body.setAngle(body, a); }
export function setAngularVelocity(body, w) { Body.setAngularVelocity(body, w); }
export function setStatic(body, isStatic) { Body.setStatic(body, isStatic); }

export { Matter as _matter };
