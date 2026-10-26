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
  for (const h of probe) topY = Math.min(topY, topAt(h.body, aheadX, dims));
  const rise = feetY - topY;
  if (rise <= 0 || rise > dims.maxStepUp) return false;

  setPosition(b, b.position.x, b.position.y - rise - 1);
  return true;
}

/**
 * How high the thing in front of him is, where his foot would go.
 *
 * For anything the level built, that is its top. For the player's LINE it is
 * the line's own surface at that x — unless the line is steeper than he can
 * walk, and then it is a wall and its top is its top.
 *
 * Reading the whole bounding box made every straight ramp a wall. A line drawn
 * rising at 20 degrees simplifies to ONE part, and that part's box top is its
 * FAR end: begun 2 units above the floor, its near lip was a third of a step
 * and measured 60 high, so he stopped dead in front of it — while the same
 * line begun 2 units lower, buried in the floor, was a road. Measured when it
 * was fixed: the held CLIMB went from 0.3% of strokes winning to 1.3%, a plain
 * ramp-up from 0.8% to 2.5%, and no shipped level's certified stroke changed.
 * tools/test/walk.js holds the rule, for Milo and the dog.
 */
function topAt(part, x, dims) {
  if ((part.parent ?? part).gameId !== 'stroke' && part.gameId !== 'stroke') return part.bounds.min.y;
  const vs = part.vertices;
  // A stroke part is a thin rectangle, so its longest edge is the line itself.
  let longest = 0, slope = 0;
  for (let i = 0; i < vs.length; i++) {
    const a = vs[i], b = vs[(i + 1) % vs.length];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len > longest) { longest = len; slope = Math.abs(Math.atan2(b.y - a.y, b.x - a.x)) * 180 / Math.PI; }
  }
  if (slope > 90) slope = 180 - slope;
  if (slope > dims.maxWalkSlope) return part.bounds.min.y;
  // The highest point where the vertical line at x crosses the outline.
  let top = Infinity;
  for (let i = 0; i < vs.length; i++) {
    const a = vs[i], b = vs[(i + 1) % vs.length];
    if ((a.x - x) * (b.x - x) > 0) continue;
    const y = a.x === b.x ? Math.min(a.y, b.y) : a.y + (b.y - a.y) * (x - a.x) / (b.x - a.x);
    top = Math.min(top, y);
  }
  return Number.isFinite(top) ? top : part.bounds.min.y;
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
    progressX: null,    // where it last got somewhere, and when (the stall watch)
    progressAt: 0,
    groundAt: 0,        // when it was last held up: standing, or at rest
    restSince: null,    // when it came to rest, while it is at rest
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
  const vel = getVelocity(dog.body);
  const atRest = Math.hypot(vel.x, vel.y) < DOG.restSpeed;
  if (dog.grounded || atRest) dog.groundAt = simTimeMs;

  // A DOG KNOCKED OVER GETS BACK UP. In the air physics owns it and it can
  // tumble, and one bump off the foot of a line stood it on its end (92
  // degrees): lying like that its feet-ray never reached the floor, so it
  // counted as airborne for the rest of the run. Milo knocked flat is a loss;
  // the dog's whole job is to keep walking. Only once it has lain still: it
  // tips while rocking on a lip, and righting it mid-rock changed how that
  // came out. (Locking its rotation instead stopped it tipping off the edge
  // of its own shelf into HEADS UP's kennel — it slid off slowly and landed
  // on the rock already lying there: 45 races where there had been one.)
  if (!atRest) dog.restSince = null;
  else dog.restSince ??= simTimeMs;
  const tilt = Math.atan2(Math.sin(dog.body.angle), Math.cos(dog.body.angle));
  if (!dog.grounded && dog.restSince != null && simTimeMs - dog.restSince > DOG.restMs &&
      Math.abs(tilt) > 1.2) {                 // on its side or end (~70°+), not teetering
    setAngle(dog.body, 0);
    setAngularVelocity(dog.body, 0);
  }

  // A DOG THAT GETS NOWHERE TURNS, WHATEVER STOPPED IT. The turn below needs
  // a grounded step that stalled AND a wall the rays can see, and a line can
  // beat both. A hand-drawn line has a rounded foot: the dog walked onto it
  // with its front feet and came to rest propped up, its middle over air —
  // airborne by the rules — so it never walked or turned again. An upright
  // wall, GOOD BOY's most natural answer, won 12 times in 36 by hand, and the
  // owner's own curve did the same at its tip (26 Oct; five other dog levels
  // too). Where Milo would stop, the dog turns: held up by something
  // (standing, or at rest — nothing in free fall is at rest) and getting
  // nowhere for stallMs is enough.
  //
  // Not by giving it front feet to stand on: that fixed the hang too, but it
  // walked the dog off edges it used to hang on, and DOWN BOY and STAY
  // became races (6% of wins with the dog dead a moment after the finish).
  if (dog.progressX == null || (x - dog.progressX) * dog.dir > DOG.stallStep) {
    dog.progressX = x;
    dog.progressAt = simTimeMs;
  } else if (simTimeMs - dog.groundAt < DOG.supportMs &&
             simTimeMs - dog.progressAt > DOG.stallMs && simTimeMs >= dog.turnAfter) {
    turnDog(dog, simTimeMs);
    return;
  }

  if (!dog.grounded) { dog.state = STATE.AIRBORNE; return; }
  dog.state = STATE.WALKING;
  const v = walk(dog, DOG);
  const stalled = Math.abs(v.x) < dog.speed * 0.35 || moved < dog.speed * (PHYSICS_DT / 1000) * 0.35;
  if (!stalled || tryStepUp(ctx, dog, DOG)) return;
  if (simTimeMs < dog.turnAfter || !blockedAhead(ctx, dog, DOG)) return;
  turnDog(dog, simTimeMs);
}

function turnDog(dog, simTimeMs) {
  dog.dir = -dog.dir;
  dog.turnAfter = simTimeMs + DOG.turnMs;
  dog.turns += 1;
  dog.progressX = dog.body.position.x;
  dog.progressAt = simTimeMs;
}

/**
 * Is there something solid right in front of it — at its feet, its middle or
 * its head? Sensors (plates) and things that have stopped existing physically
 * (an open gate, a broken board) are not walls.
 *
 * THE HEAD COUNTS. With only feet and middle tested, a line sloping down in
 * front of it met it above its middle: it stood wedged under the slope, pushing
 * for ever, and the census of the pen level found every one of its wins was
 * the dog stuck like that rather than turned. A dog that bumps its head turns.
 */
function blockedAhead(ctx, w, dims) {
  const b = w.body;
  const ahead = b.position.x + w.dir * (dims.width / 2 + 6);
  const solid = (o) => {
    const p = o.parent ?? o;
    return p !== b && !o.isSensor && !p.isSensor &&
           o.collisionFilter.mask !== 0 && p.collisionFilter.mask !== 0;
  };
  for (const dy of [dims.height / 2 - 6, 0, -dims.height / 2 + 4]) {
    const y = b.position.y + dy;
    if (raycast(ctx, b.position.x, y, ahead, y, solid).length) return true;
  }
  return false;
}
