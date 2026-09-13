// Milo — three-state locomotion.
//
// The source documents specified Milo's body (36x72, chamfer 16) and that he
// "moves toward the goal", but never HOW. That gap hid three problems:
//
//  (a) A dynamic body pushed by force tips over and behaves like a crate.
//      A kinematic body ignores the physics the whole game is made of.
//  (b) He cannot get onto the bridge he was just drawn. The drawn line is 16u
//      thick; a capsule walking into a 16u lip at 220 u/s stops dead or trips.
//      maxStepUp (22) MUST exceed LINE.thickness (16) or the "your line is
//      terrain" lesson is unlearnable. That inequality lives across two
//      different constants and only arithmetic catches it.
//  (c) Slopes were undefined — climb, slide, or stall into the stuck timer?

import {
  addCapsule, setVelocity, getVelocity, raycast, setAngle, setAngularVelocity, setPosition,
} from './physics/adapter.js';
import { MILO } from './constants.js';

export const STATE = { WALKING: 'walking', AIRBORNE: 'airborne', STUNNED: 'stunned' };

export function createMilo(ctx, level) {
  const { x, y } = level.milo.start;                 // y = FEET
  const body = addCapsule(ctx, {
    id: 'milo',
    x, y: y - MILO.height / 2,                       // → body centre
    w: MILO.width, h: MILO.height, chamfer: MILO.chamfer,
    density: MILO.density, friction: MILO.friction, restitution: MILO.restitution,
    frictionAir: 0.01,
  });
  return {
    body,
    state: STATE.WALKING,
    dir: 1,
    speed: level.milo.speed ?? MILO.speed,
    stunUntil: 0,
    grounded: true,
    groundNormal: { x: 0, y: -1 },
    danger: 0,          // 0..1, drives expression + audio (Bible §6.2)
    alive: true,
  };
}

/**
 * Ground probe. Also captures the SURFACE NORMAL, which is what makes slopes
 * work — see updateMilo.
 */
function groundCheck(ctx, milo) {
  const b = milo.body;
  const feetY = b.position.y + MILO.height / 2;
  const hits = raycast(
    ctx, b.position.x, feetY - 4, b.position.x, feetY + MILO.groundProbe,
    (o) => o !== b,
  );
  if (!hits.length) { milo.groundNormal = null; return false; }

  // Matter's ray normals can point either way; force it to face upward.
  let n = hits[0].normal ?? { x: 0, y: -1 };
  if (n.y > 0) n = { x: -n.x, y: -n.y };
  milo.groundNormal = n;
  return true;
}

/**
 * Step-up assist. Not a jump — an invisible lift, standard platformer practice.
 * This is what stops him tripping over the edge of his own bridge.
 */
function tryStepUp(ctx, milo) {
  const b = milo.body;
  const halfW = MILO.width / 2;
  const feetY = b.position.y + MILO.height / 2;
  const aheadX = b.position.x + milo.dir * (halfW + 4);

  // Is something blocking at foot height?
  const blocked = raycast(ctx, b.position.x, feetY - 6, aheadX, feetY - 6, (o) => o !== b);
  if (!blocked.length) return false;

  // Is its top within reach?
  const probe = raycast(
    ctx, aheadX, feetY - MILO.maxStepUp, aheadX, feetY + 2, (o) => o !== b,
  );
  if (!probe.length) return false;

  let topY = Infinity;
  for (const h of probe) topY = Math.min(topY, h.body.bounds.min.y);
  const rise = feetY - topY;
  if (rise <= 0 || rise > MILO.maxStepUp) return false;

  setPosition(b, b.position.x, b.position.y - rise - 1);
  return true;
}

export function updateMilo(ctx, milo, simTimeMs) {
  const b = milo.body;
  milo.grounded = groundCheck(ctx, milo);

  if (milo.state === STATE.STUNNED) {
    if (simTimeMs >= milo.stunUntil && milo.grounded) milo.state = STATE.WALKING;
    else return;
  }

  if (!milo.grounded) {
    milo.state = STATE.AIRBORNE;                    // physics owns him; he tumbles
    return;
  }

  milo.state = STATE.WALKING;
  setAngle(b, 0);                                   // stays upright while walking
  setAngularVelocity(b, 0);

  const v = getVelocity(b);

  // Walk ALONG the surface, not horizontally across it.
  //
  // MILO.maxWalkSlope was a dead constant until now: declared, documented,
  // quoted in a level comment, and never read. Milo's climbing was whatever
  // emerged from shoving a body sideways into a hill, so ramps barely worked
  // and the RAMP verb — which the level ladder leans on repeatedly — was
  // effectively unbuildable. The solver found it by failing A6 at every rise
  // from 112u down to 72u, which is the signature of a mechanic that is
  // missing rather than mistuned.
  const n = milo.groundNormal ?? { x: 0, y: -1 };
  const slopeDeg = Math.acos(Math.min(1, Math.abs(n.y))) * 180 / Math.PI;

  if (slopeDeg <= MILO.maxWalkSlope) {
    // Tangent to the surface, pointing the way he is walking.
    const tx = -n.y * milo.dir, ty = n.x * milo.dir;
    setVelocity(b, tx * milo.speed, ty * milo.speed + Math.max(0, v.y));
  } else {
    // Too steep to climb: he scrabbles and loses most of his drive. Gravity
    // does the rest, which reads as slipping back rather than as a bug.
    setVelocity(b, milo.dir * milo.speed * 0.25, v.y);
  }

  if (Math.abs(v.x) < milo.speed * 0.35) tryStepUp(ctx, milo);
}

export function stun(milo, simTimeMs) {
  milo.state = STATE.STUNNED;
  milo.stunUntil = simTimeMs + MILO.stunMs;
}

/**
 * Danger scalar — one number, computed every step, that drives face, pose and
 * audio (Bible §6.2). Produces the near-miss comedy as an emergent property in
 * every level, with zero per-level authoring.
 */
export function updateDanger(milo, hazardBodies) {
  const b = milo.body;
  let worst = 0;
  for (const h of hazardBodies) {
    const dx = h.position.x - b.position.x;
    const dy = h.position.y - b.position.y;
    const dist = Math.max(1, Math.hypot(dx, dy));
    const proximity = Math.max(0, 1 - dist / 420);
    worst = Math.max(worst, proximity);
  }
  milo.danger += (worst - milo.danger) * 0.15;      // smoothed
  return milo.danger;
}
