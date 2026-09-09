// The simulation — builds a level into a physics world and steps it.
//
// Retry is a FULL teardown and rebuild from level data (Bible §5.3). No reused
// world, no accumulated state. That is what makes determinism real and what
// makes the ghost-stroke comparison meaningful: the only thing that differs
// between two attempts is the stroke.

import {
  createWorld, destroyWorld, addRect, addCircle, step as physStep,
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
    stroke: null,            // committed stroke body
    anchors: [],
    run: createRunState(),
    causality: createCausality(),
    recorder: createRecorder(),
    simTime: 0,
    death: null,
  };

  for (const s of level.static) {
    // Authoring uses top-left; Matter uses centre.
    const body = addRect(ctx, {
      id: s.id, x: s.x + s.w / 2, y: s.y + s.h / 2, w: s.w, h: s.h, isStatic: true,
      friction: 0.7,
    });
    sim.statics.push({ body, spec: s });
  }

  for (const o of level.objects) {
    const body = o.radius
      ? addCircle(ctx, {
          id: o.id, x: o.x, y: o.y, radius: o.radius,
          density: o.density, restitution: o.restitution, friction: o.friction ?? 0.4,
        })
      : addRect(ctx, {
          id: o.id, x: o.x, y: o.y, w: o.w, h: o.h,
          density: o.density, restitution: o.restitution, friction: o.friction ?? 0.4,
        });
    sim.objects.set(o.id, { body, spec: o });
  }

  sim.milo = createMilo(ctx, level);

  onCollisionStart(ctx, (a, b, pair) => {
    const speed = normalSpeed(a, b, pair);
    noteContact(sim.causality, a, b, sim.simTime, speed);

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
    sim.death = explain(sim.causality, outcome, sim.run.culpritId);
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
  return { ok: true, length: v.length, anchors: sim.anchors.length, shape: classified.shape };
}

export function abort(sim) {
  if (sim.run.outcome === OUTCOME.RUNNING) sim.run.outcome = OUTCOME.ABORTED;
}

export { OUTCOME };
