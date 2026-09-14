// The simulation — builds a level into a physics world and steps it.
//
// Retry is a FULL teardown and rebuild from level data (Bible §5.3). No reused
// world, no accumulated state. That is what makes determinism real and what
// makes the ghost-stroke comparison meaningful: the only thing that differs
// between two attempts is the stroke.

import {
  createWorld, destroyWorld, addRect, addCircle, setVelocity, step as physStep,
  onCollisionStart, allBodies, getSpeed,
} from './physics/adapter.js';
import { createMilo, updateMilo, updateDanger, stun, STATE } from './milo.js';
import { createRunState, checkRunEnd, kill, OUTCOME } from './run.js';
import { isFatal, normalSpeed } from './hazards.js';
import { createCausality, noteContact, explain } from './physics/causality.js';
import { createRecorder, record, reset as resetRec } from './physics/recorder.js';
import { validate } from './drawing/validate.js';
import { classify } from './drawing/classify.js';
import { buildStrokeBody } from './drawing/bodyFactory.js';
import { anchorStroke } from './physics/anchor.js';
import { simplify } from './drawing/simplify.js';
import { PHYSICS_DT, LINE, MILO, SAFE_BOX } from './constants.js';

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
      angle: (s.angle ?? 0) * Math.PI / 180, isStatic: true, friction: 0.7,
    });
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
  updateDanger(sim.milo, hazardBodies);
  record(sim.recorder, allBodies(sim.ctx));

  const outcome = checkRunEnd(
    sim.run, sim.milo, sim.level, worldH, sim.simTime, sim.causality.lastMiloContactAt,
  );

  if (outcome !== OUTCOME.RUNNING && outcome !== OUTCOME.SUCCESS && !sim.death) {
    sim.death = explain(sim.causality, outcome, sim.run.culpritId, strokeState(sim));
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
