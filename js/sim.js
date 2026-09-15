// The simulation — builds a level into a physics world and steps it.
//
// Retry is a FULL teardown and rebuild from level data (Bible §5.3). No reused
// world, no accumulated state. That is what makes determinism real and what
// makes the ghost-stroke comparison meaningful: the only thing that differs
// between two attempts is the stroke.

import {
  createWorld, destroyWorld, addRect, addCircle, setVelocity, step as physStep,
  onCollisionStart, allBodies, getSpeed, getVelocity, applyAccel, addPivot, addCross,
  removeBody, setAngularVelocity,
} from './physics/adapter.js';
import { createMilo, updateMilo, updateDanger, stun, STATE } from './milo.js';
import { createRunState, checkRunEnd, kill, OUTCOME } from './run.js';
import { isFatal, normalSpeed, isHazardous } from './hazards.js';
import { createCausality, noteContact, explain } from './physics/causality.js';
import { createRecorder, record, reset as resetRec } from './physics/recorder.js';
import { validate } from './drawing/validate.js';
import { classify } from './drawing/classify.js';
import { buildStrokeBody } from './drawing/bodyFactory.js';
import { anchorStroke } from './physics/anchor.js';
import * as audio from './audio.js';
import { simplify } from './drawing/simplify.js';
import { PHYSICS_DT, LINE, MILO, SAFE_BOX, NEAR_MISS_DIST, CLOSE_CALL } from './constants.js';

export function buildSim(level) {
  const ctx = createWorld();
  const sim = {
    ctx, level,
    milo: null, goal: level.goal,
    objects: new Map(),      // gameId → { body, spec }
    statics: [],
    zones: level.zones ?? [],
    stroke: null,            // committed stroke body
    anchors: [],
    run: createRunState(),
    // Which gates have been opened. The schema carried `triggers` from the
    // start but nothing ever implemented it, so the design bible's own
    // headline moment — something hits a switch, a gate opens, Milo walks
    // through — was unbuildable. This is that.
    triggered: new Set(),
    causality: createCausality(),
    recorder: createRecorder(),
    simTime: 0,
    death: null,
    closeCalls: [],      // near misses this run — the game's whole personality
    _near: new Map(),    // per-hazard: is it currently inside the radius?
  };

  // ONE COORDINATE RULE, no exceptions:
  //   anything with w/h  → x,y is its TOP-LEFT corner
  //   anything with radius → x,y is its CENTRE
  //
  // This was two rules before — top-left for static geometry, centre for
  // objects — and it produced exactly the silent bug that kind of split
  // always produces: A9's gate was authored as top-left, built as centre, and
  // ended up hanging 70 units above the ground with Milo strolling underneath
  // it. Every test passed. The level simply was not a puzzle.
  for (const s of level.static) {
    const body = addRect(ctx, {
      id: s.id, x: s.x + s.w / 2, y: s.y + s.h / 2, w: s.w, h: s.h,
      angle: (s.angle ?? 0) * Math.PI / 180, isStatic: true,
      friction: s.friction ?? 0.7,
    });
    // MATTER SILENTLY ZEROES RESTITUTION ON EVERY STATIC BODY. Body.setStatic()
    // runs inside Bodies.rectangle() and forces restitution=0 and friction=1,
    // so passing `restitution` in the options above is discarded without a
    // word. Measured: a pad asked for 0.85 reported 0.00 and a ball dropped
    // 258u rebounded 2u. Assigning AFTER creation sticks — the same ball then
    // rebounds 119u — which is the only reason a springy surface can exist.
    //
    // ONLY RESTITUTION IS CORRECTED HERE. Static friction has always been 1 in
    // this game for exactly the same reason, and every measured star threshold
    // and solver breadth in js/solverData.js was produced under it. "Fixing" it
    // would silently re-tune thirteen shipped levels. Matter pairs friction
    // with Math.min(a, b) and every dynamic body here sits far below 1, so the
    // value is not observable anyway.
    if (s.restitution) body.restitution = s.restitution;

    // A PIVOT MAKES THIS STATIC INTO A MOVING PART. It is authored on `static`
    // because that is where the level's geometry lives and where the renderer
    // already looks, but a pinned piece is emphatically NOT static: it is a
    // dynamic body held at one point, so it must be built dynamic and pinned.
    //
    // `pivot` is {x, y} in world units — the point it turns about, usually its
    // own centre for a see-saw and one end for a swinging arm.
    if (s.pivot) {
      removeBody(ctx, body);
      const opts = {
        angle: (s.angle ?? 0) * Math.PI / 180,
        density: s.density ?? 0.008,
        friction: s.friction ?? 0.4,
        frictionAir: s.frictionAir ?? 0.01,
      };
      const geom = { id: s.id, x: s.x + s.w / 2, y: s.y + s.h / 2, w: s.w, h: s.h };
      // `blades` turns one bar into a paddle wheel. One blade is a lever.
      const moving = s.blades > 1
        ? addCross(ctx, { ...geom, ...opts, blades: s.blades })
        : addRect(ctx, { ...geom, ...opts });
      if (s.restitution) moving.restitution = s.restitution;
      addPivot(ctx, moving, s.pivot.x, s.pivot.y);

      // SPIN makes it a powered machine rather than a thing that waits to be
      // pushed. Raw Matter angular units, which is what the probe measured in:
      // 0.30 throws a ball 659 units and lands it within 17u from anywhere in
      // the feed zone; 0.12 is SLOWER and less consistent (228u spread), so do
      // not assume gentler is tamer here.
      if (s.spin) setAngularVelocity(moving, s.spin);

      sim.statics.push({ body: moving, spec: s, pivoted: true });
      continue;
    }
    sim.statics.push({ body, spec: s });
  }

  for (const o of level.objects) {
    let body;
    const cx = o.w ? o.x + o.w / 2 : o.x;      // top-left → centre for rects
    const cy = o.h ? o.y + o.h / 2 : o.y;
    if (o.type === 'switch') {
      // A pressure plate. Static and non-colliding: it detects, it never blocks.
      body = addRect(ctx, { id: o.id, x: cx, y: cy, w: o.w, h: o.h, isStatic: true });
      body.isSensor = true;
    } else if (o.type === 'gate') {
      // Solid until something opens it.
      body = addRect(ctx, { id: o.id, x: cx, y: cy, w: o.w, h: o.h, isStatic: true, friction: 0.6 });
    } else if (o.radius) {
      body = addCircle(ctx, {
        id: o.id, x: o.x, y: o.y, radius: o.radius,
        density: o.density, restitution: o.restitution, friction: o.friction ?? 0.4,
        ...(o.frictionAir != null ? { frictionAir: o.frictionAir } : {}),
      });
    } else {
      body = addRect(ctx, {
        id: o.id, x: cx, y: cy, w: o.w, h: o.h,
        angle: (o.angle ?? 0) * Math.PI / 180,
        density: o.density, restitution: o.restitution, friction: o.friction ?? 0.4,
      });
    }
    // Level-authored initial velocity — a roller that is already moving when
    // the world starts, so the freeze catches it mid-approach.
    if (o.vx || o.vy) setVelocity(body, o.vx ?? 0, o.vy ?? 0);
    sim.objects.set(o.id, { body, spec: o });
  }

  sim.milo = createMilo(ctx, level);

  onCollisionStart(ctx, (a, b, pair) => {
    const speed = normalSpeed(a, b, pair);
    noteContact(sim.causality, a, b, sim.simTime, speed);

    // The SAME number that decides lethality drives the sound, so what you hear
    // is what nearly killed him. Milo's own footsteps are excluded: he makes
    // ground contact every step at 220 u/s of tangential motion, and the normal
    // component of a footfall is small but not zero.
    if (a.gameId !== 'milo' && b.gameId !== 'milo') {
      audio.impact(speed, { heavy: (a.mass ?? 0) + (b.mass ?? 0) > 120 });
    } else if (speed > 140) {
      audio.impact(speed, { heavy: false });
    }

    // Switch → gate. Anything with mass can press a plate, which is the point:
    // the player does not touch the switch, they arrange for something else to.
    for (const [hit, other] of [[a, b], [b, a]]) {
      const entry = sim.objects.get(hit.gameId);
      if (!entry || entry.spec.type !== 'switch') continue;
      if (other.isSensor) continue;
      if (entry.spec.requires === 'heavy' && (other.mass ?? 0) < (entry.spec.minMass ?? 40)) continue;
      fireSwitch(sim, entry);
    }

    const miloBody = sim.milo.body;
    if (a !== miloBody && b !== miloBody) return;
    const other = a === miloBody ? b : a;

    const entry = sim.objects.get(other.gameId);
    if (entry && isFatal(miloBody, other, entry.spec.lethal, pair)) {
      kill(sim.run, other.gameId);
      return;
    }
    // Non-fatal but hard enough to stagger him.
    if (speed > MILO.stumbleSpeed && sim.milo.state !== STATE.STUNNED) {
      stun(sim.milo, sim.simTime);
    }
  });

  return sim;
}

/** Open every gate a switch points at. Idempotent — a switch fires once. */
function fireSwitch(sim, entry) {
  if (sim.triggered.has(entry.spec.id)) return;
  sim.triggered.add(entry.spec.id);
  audio.trigger();
  for (const targetId of entry.spec.triggers ?? []) {
    const target = sim.objects.get(targetId);
    if (!target) continue;
    sim.triggered.add(targetId);
    // The gate stops existing physically. Visually it swings away.
    target.body.collisionFilter.mask = 0;
    target.body.collisionFilter.category = 0;
  }
}

export function destroySim(sim) {
  if (sim) destroyWorld(sim.ctx);
}

/** One fixed physics step plus all game logic. */
export function stepSim(sim, worldH = SAFE_BOX.h) {
  if (sim.run.outcome !== OUTCOME.RUNNING) return sim.run.outcome;

  updateMilo(sim.ctx, sim.milo, sim.simTime);
  physStep(sim.ctx);
  sim.simTime += PHYSICS_DT;

  const hazardBodies = [...sim.objects.values()].map((o) => o.body);
  applyUpdrafts(sim);
  audio.setDanger(updateDanger(sim.milo, hazardBodies));
  detectCloseCalls(sim);
  record(sim.recorder, allBodies(sim.ctx));

  const outcome = checkRunEnd(
    sim.run, sim.milo, sim.level, worldH, sim.simTime, sim.causality.lastMiloContactAt,
  );

  if (outcome !== OUTCOME.RUNNING && outcome !== OUTCOME.SUCCESS && !sim.death) {
    sim.death = explain(sim.causality, outcome, sim.run.culpritId, strokeState(sim));
    audio.death();
  }
  return outcome;
}

/**
 * Commit the player's stroke. Returns { ok } or { ok:false, reason } — and a
 * rejection is a NO-OP, never a spent attempt.
 */
export function commitStroke(sim, rawPoints) {
  const pts = simplify(rawPoints, LINE.simplifyTol);
  const v = validate(pts, sim.level, sim.milo.body);
  if (!v.ok) return v;

  const classified = classify(pts);
  const body = buildStrokeBody(sim.ctx, classified);
  if (!body) return { ok: false, reason: 'degenerate' };

  sim.stroke = body;
  sim.strokePoints = pts;
  sim.strokeShape = classified.shape;
  sim.anchors = anchorStroke(sim.ctx, body, pts);
  // Remembered so a death can be explained as "nothing held it up".
  sim.strokeOrigin = { x: body.position.x, y: body.position.y };
  return { ok: true, length: v.length, anchors: sim.anchors.length, shape: classified.shape };
}


/**
 * UPDRAFT — a column of moving air that pushes whatever is inside it.
 *
 * The first thing in this game that acts on the world without being solid. It
 * exists because the level vocabulary had five nouns across thirteen levels —
 * platform, boulder, plate, gate, spikes — and the answer to "the game feels
 * basic" was being looked for in new RULES (a no-draw zone) rather than new
 * THINGS. A rule tells the player what they may not do. A thing gives them
 * something to think with, and it changes what a LINE means: over an updraft a
 * line is a lid, beside it a deflector, across it a shelf that something can be
 * parked on.
 *
 * Acceleration, not force, so how hard it blows does not silently change when
 * a density is retuned — the same reasoning that made lethality use minSpeed.
 * It pushes Milo too: while he is grounded his locomotion sets his velocity
 * every step and wins, and the moment he is airborne the air has him. That
 * asymmetry is not a bug, it is the feel — you can walk through a draught, you
 * cannot fall through one.
 */
function applyUpdrafts(sim) {
  for (const z of sim.zones) {
    if (z.kind !== 'updraft') continue;
    const a = z.accel ?? -2600;
    for (const b of allBodies(sim.ctx)) {
      if (b.isStatic) continue;
      const p = b.position;
      if (p.x < z.x || p.x > z.x + z.w || p.y < z.y || p.y > z.y + z.h) continue;
      applyAccel(b, z.ax ?? 0, a);
    }
  }
}

/**
 * A CLOSE CALL: something that could have killed him came within
 * NEAR_MISS_DIST and was moving fast enough to mean it.
 *
 * Fires on ENTRY into the radius, once per approach, not once per step — at
 * 120 Hz a single boulder would otherwise produce forty "moments" and the word
 * would stop meaning anything. And it never fires on the step he actually
 * dies: being hit is not a near miss, it is a miss of the other kind.
 */
function detectCloseCalls(sim) {
  if (sim.run.outcome !== OUTCOME.RUNNING) return;
  const b = sim.milo.body;
  const halfW = MILO.width / 2, halfH = MILO.height / 2;

  for (const [id, o] of sim.objects) {
    if (!isHazardous(o.spec.lethal)) continue;
    const v = getVelocity(o.body);
    const speed = Math.hypot(v.x, v.y);
    const p = o.body.position;

    // Nearest point of Milo's box to the hazard's centre, then back off by the
    // hazard's own size — a surface-to-surface gap rather than centre-to-centre,
    // which would call a huge slow boulder "close" while it was still far away.
    const cx = Math.max(b.position.x - halfW, Math.min(p.x, b.position.x + halfW));
    const cy = Math.max(b.position.y - halfH, Math.min(p.y, b.position.y + halfH));
    const reach = o.spec.radius ?? Math.max(o.spec.w ?? 0, o.spec.h ?? 0) / 2;
    const gap = Math.hypot(p.x - cx, p.y - cy) - reach;

    const inside = gap < NEAR_MISS_DIST && speed > CLOSE_CALL.minSpeed;
    const was = sim._near.get(id) ?? false;
    sim._near.set(id, inside);

    if (inside && !was) {
      const last = sim.closeCalls[sim.closeCalls.length - 1];
      if (last && sim.simTime - last.t < CLOSE_CALL.cooldownMs) continue;
      sim.closeCalls.push({
        id, t: sim.simTime, gap: Math.max(0, gap), speed,
        x: (p.x + b.position.x) / 2, y: (p.y + b.position.y) / 2,
      });
      audio.closeCall(speed);
    }
  }
}

/** What the player's line did, for the death explanation. */
function strokeState(sim) {
  const b = sim.stroke;
  if (!b) return { drawn: false, anchored: false, fell: 0 };
  const o = sim.strokeOrigin;
  return {
    drawn: true,
    anchored: (sim.anchors?.length ?? 0) > 0,
    fell: o ? Math.hypot(b.position.x - o.x, b.position.y - o.y) : 0,
  };
}

export function abort(sim) {
  if (sim.run.outcome === OUTCOME.RUNNING) sim.run.outcome = OUTCOME.ABORTED;
}

export { OUTCOME };
