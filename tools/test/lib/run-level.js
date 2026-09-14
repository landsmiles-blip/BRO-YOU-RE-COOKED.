// Shared level runner.
//
// Every level from here on proves three things without a human:
//   1. doing NOTHING fails        — the level actually threatens Milo
//   2. the intended stroke WINS   — the level is solvable at all
//   3. the freeze lands BEFORE the danger — you get to think before you die
//
// This exists because the source spec's A1 satisfied none of them: it dropped a
// ball into Milo's walking path where it landed first and became a 56-unit
// obstacle against his 22-unit step-up, dead-ending in a stuck timeout even
// when the player blocked it perfectly. Nobody finds that by reading. You find
// it by running it.

import { buildSim, stepSim, commitStroke, destroySim, OUTCOME } from '../../../js/sim.js';
import { FREEZE_AT, RUN_TIMEOUT, PHYSICS_DT } from '../../../js/constants.js';

const MAX_STEPS = Math.ceil(RUN_TIMEOUT / PHYSICS_DT) + 600;

/**
 * Play a level headlessly. `strokePoints` is committed at the freeze, or null
 * to do nothing at all.
 */
export function playLevel(level, strokePoints = null) {
  const sim = buildSim(level);
  const freezeAt = level.freezeAt ?? FREEZE_AT;
  let committed = null;
  let strokeY0 = null;

  // STABILITY = PATH TRAVELLED vs NET DISPLACEMENT.
  //
  // Two wrong metrics preceded this one, and both mattered:
  //   - Net displacement alone is worthless: a line vibrating furiously in
  //     place nets zero, which is why `strokeFell < 4` passed on an
  //     unplayable build.
  //   - Total path alone is also wrong: a stroke that legitimately FALLS 500
  //     units racks up a huge path with nothing wrong, so it flags healthy
  //     levels as unstable.
  // The ratio separates them cleanly. A falling body travels roughly as far
  // as it displaces (ratio ~1). A vibrating body travels enormously further
  // than it displaces (ratio in the hundreds or thousands).
  let jitter = 0;
  let prevParts = null;
  let firstParts = null;

  for (let i = 0; i < MAX_STEPS; i++) {
    if (strokePoints && !committed && sim.simTime >= freezeAt) {
      committed = commitStroke(sim, strokePoints);
      if (!committed.ok) break;
      strokeY0 = sim.stroke.position.y;
      prevParts = partPositions(sim.stroke);
      firstParts = prevParts;
    }
    const o = stepSim(sim);
    if (prevParts) {
      const now = partPositions(sim.stroke);
      for (let k = 0; k < now.length; k++) {
        jitter += Math.hypot(now[k].x - prevParts[k].x, now[k].y - prevParts[k].y);
      }
      prevParts = now;
    }
    if (o !== OUTCOME.RUNNING) return finish(sim, o, committed, strokeY0, jitter, firstParts);
  }
  return finish(sim, 'never-ended', committed, strokeY0, jitter, firstParts);
}

function partPositions(body) {
  const parts = body.parts.length > 1 ? body.parts.slice(1) : [body];
  return parts.map((p) => ({ x: p.position.x, y: p.position.y }));
}

function finish(sim, outcome, committed, strokeY0, jitter = 0, firstParts = null) {
  // Net displacement summed over the same parts, for the ratio.
  let net = 0;
  if (firstParts && sim.stroke) {
    const last = partPositions(sim.stroke);
    for (let k = 0; k < last.length && k < firstParts.length; k++) {
      net += Math.hypot(last[k].x - firstParts[k].x, last[k].y - firstParts[k].y);
    }
  }
  const wobble = firstParts ? jitter / Math.max(20, net) : 0;
  const r = {
    outcome,
    t: sim.simTime,
    death: sim.death,
    committed,
    miloX: sim.milo.body.position.x,
    miloY: sim.milo.body.position.y,
    strokeFell: sim.stroke && strokeY0 != null ? sim.stroke.position.y - strokeY0 : 0,
    strokeJitter: jitter,
    strokeWobble: wobble,     // path / net — >8 means oscillating, not moving
    parts: sim.stroke ? (sim.stroke.parts.length > 1 ? sim.stroke.parts.length - 1 : 1) : 0,
    anchors: committed?.anchors ?? 0,
    // Where each hazard ENDED UP. For REDIRECT levels this is the whole point:
    // blocking leaves the rock on the walk line, redirecting sends it away.
    objects: Object.fromEntries(
      [...sim.objects.entries()].map(([id, o]) => [id, { x: o.body.position.x, y: o.body.position.y }]),
    ),
  };
  destroySim(sim);
  return r;
}

export { handDrawn } from './hand.js';
import { handDrawn } from './hand.js';

// ── tiny assertion helpers, shared by every level suite ─────────────────
export function makeAssert() {
  const state = { failures: 0 };
  const assert = (label, cond, detail = '') => {
    if (!cond) state.failures++;
    console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
  };
  return { assert, state };
}

/**
 * The three non-negotiables, run for any level.
 * Returns the solved result so a suite can make further level-specific claims.
 */
export function assertCore(assert, level, intendedStroke) {
  const idle = playLevel(level, null);
  assert('doing nothing FAILS', idle.outcome !== OUTCOME.SUCCESS,
         `${idle.outcome} @ ${idle.t.toFixed(0)}ms "${idle.death?.label ?? ''}"`);
  assert('the failure is explained', !!idle.death?.label, idle.death?.label ?? 'none');
  assert('the freeze lands BEFORE the danger',
         (level.freezeAt ?? FREEZE_AT) < idle.t,
         `freeze ${level.freezeAt ?? FREEZE_AT}ms vs end ${idle.t.toFixed(0)}ms`);

  const solved = playLevel(level, intendedStroke);
  assert('the intended stroke SUCCEEDS', solved.outcome === OUTCOME.SUCCESS,
         `${solved.outcome} @ ${solved.t.toFixed(0)}ms` +
         (solved.committed && !solved.committed.ok ? ` (rejected: ${solved.committed.reason})` : ''));

  // A HAND-SHAPED version of the same stroke. Sparse idealised strokes collapse
  // to a single rigid body and hide instability completely; this is what a
  // finger actually produces, and it is what shipped an unplayable build.
  const dense = playLevel(level, handDrawn(intendedStroke));
  // Guard the guard: if the stroke collapsed to one part, this proves nothing.
  assert('the hand-drawn stroke is really multi-part', dense.parts >= 5,
         `${dense.parts} parts (a 1-part stroke cannot expose the bug)`);
  assert('a HAND-DRAWN stroke is stable (no vibration)', dense.strokeWobble < 8,
         `${dense.parts} parts, path/net = ${dense.strokeWobble.toFixed(1)} (${dense.strokeJitter.toFixed(0)}u travelled)`);
  assert('a hand-drawn stroke still SUCCEEDS', dense.outcome === OUTCOME.SUCCESS,
         `${dense.outcome}`);
  return { idle, solved, dense };
}

export { OUTCOME };
