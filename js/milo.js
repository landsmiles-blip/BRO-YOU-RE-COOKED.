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
import { MILO, DOG, PHYSICS_DT } from './constants.js';

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
function groundCheck(ctx, milo, dims = MILO) {
  const b = milo.body;
  const feetY = b.position.y + dims.height / 2;
  const hits = raycast(
    ctx, b.position.x, feetY - 4, b.position.x, feetY + dims.groundProbe,
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
function tryStepUp(ctx, milo, dims = MILO) {
  const b = milo.body;
  const halfW = dims.width / 2;
  const feetY = b.position.y + dims.height / 2;
  const aheadX = b.position.x + milo.dir * (halfW + 4);

  // Is something blocking at foot height?
  const blocked = raycast(ctx, b.position.x, feetY - 6, aheadX, feetY - 6, (o) => o !== b);
  if (!blocked.length) return false;

  // Is its top within reach?
  const probe = raycast(
    ctx, aheadX, feetY - dims.maxStepUp, aheadX, feetY + 2, (o) => o !== b,
  );
  if (!probe.length) return false;

  let topY = Infinity;
  for (const h of probe) topY = Math.min(topY, h.body.bounds.min.y);
  const rise = feetY - topY;
  if (rise <= 0 || rise > dims.maxStepUp) return false;

  setPosition(b, b.position.x, b.position.y - rise - 1);
  return true;
}

export function updateMilo(ctx, milo, simTimeMs) {
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
  const v = walk(milo, MILO);
  if (Math.abs(v.x) < milo.speed * 0.35) tryStepUp(ctx, milo);
}

/**
 * One grounded step of walking, shared by Milo and the dog: stand upright and
 * drive along the surface. Returns the velocity the walker ARRIVED with —
 * read before this step's drive — which is what tells a caller it was blocked.
 */
function walk(milo, dims) {
  const b = milo.body;
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

  if (slopeDeg <= dims.maxWalkSlope) {
    // Tangent to the surface, pointing the way he is walking.
    const tx = -n.y * milo.dir, ty = n.x * milo.dir;
    setVelocity(b, tx * milo.speed, ty * milo.speed + Math.max(0, v.y));
  } else {
    // Too steep to climb: he scrabbles and loses most of his drive. Gravity
    // does the rest, which reads as slipping back rather than as a bug.
    setVelocity(b, milo.dir * milo.speed * 0.25, v.y);
  }

  return v;
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

// ── THE DOG ───────────────────────────────────────────────────────────────
//
// A second walker on Milo's own legs — the same ground probe, slope rule and
// step-up, sized by DOG — with one difference that makes it a noun: blocked by
// anything it cannot step over, it TURNS AROUND. Milo, blocked, stands there
// until the stuck timer runs out; the dog paces. So a line drawn in its way is
// a steering wheel, which no stroke in this game has been until now.
//
// It presses plates like anything with mass, the air carries it when it is
// off the ground, and it can be lost — the run ends the moment it is.

export function createDog(ctx, spec) {
  const body = addCapsule(ctx, {
    id: spec.id,
    x: spec.x, y: spec.y - DOG.height / 2,          // y = FEET, as for Milo
    w: DOG.width, h: DOG.height, chamfer: DOG.chamfer,
    density: DOG.density, friction: DOG.friction, restitution: DOG.restitution,
    frictionAir: 0.01,
  });
  return {
    body, spec,
    state: STATE.WALKING,
    dir: spec.dir ?? 1,
    speed: spec.speed ?? DOG.speed,
    grounded: true,
    groundNormal: { x: 0, y: -1 },
    lastX: null,        // where it was last step, to tell walking from being held
    turnAfter: 0,       // simTime before which it may not turn again
    turns: 0,           // how many times it has turned, for the census
    alive: true,
  };
}

export function updateDog(ctx, dog, simTimeMs) {
  if (!dog.alive) return;
  // How far it ACTUALLY got last step, the way it is facing. Its velocity
  // alone cannot say it is blocked: meeting Milo head-on, both of them set
  // their walking speed every step and the dog reported -138 u/s while Milo
  // was shoving it backwards, so it never turned and the pair crept across
  // the level in a pushing match. Distance travelled does not lie.
  const x = dog.body.position.x;
  const moved = dog.lastX == null ? Infinity : (x - dog.lastX) * dog.dir;
  dog.lastX = x;
  dog.grounded = groundCheck(ctx, dog, DOG);
  if (!dog.grounded) { dog.state = STATE.AIRBORNE; return; }
  dog.state = STATE.WALKING;
  const v = walk(dog, DOG);
  const stalled = Math.abs(v.x) < dog.speed * 0.35 || moved < dog.speed * (PHYSICS_DT / 1000) * 0.35;
  if (!stalled || tryStepUp(ctx, dog, DOG)) return;
  if (simTimeMs < dog.turnAfter || !blockedAhead(ctx, dog, DOG)) return;
  dog.dir = -dog.dir;
  dog.turnAfter = simTimeMs + DOG.turnMs;
  dog.turns += 1;
}

/**
 * Is there something solid right in front of it, at its feet or its middle?
 * Sensors (plates) and things that have stopped existing physically (an open
 * gate, a broken board) are not walls.
 */
function blockedAhead(ctx, w, dims) {
  const b = w.body;
  const ahead = b.position.x + w.dir * (dims.width / 2 + 6);
  const solid = (o) => {
    const p = o.parent ?? o;
    return p !== b && !o.isSensor && !p.isSensor &&
           o.collisionFilter.mask !== 0 && p.collisionFilter.mask !== 0;
  };
  for (const dy of [dims.height / 2 - 6, 0]) {
    const y = b.position.y + dy;
    if (raycast(ctx, b.position.x, y, ahead, y, solid).length) return true;
  }
  return false;
}
