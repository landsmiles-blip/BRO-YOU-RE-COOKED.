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

  for (let i = 0; i < MAX_STEPS; i++) {
    if (strokePoints && !committed && sim.simTime >= freezeAt) {
      committed = commitStroke(sim, strokePoints);
      if (!committed.ok) break;
      strokeY0 = sim.stroke.position.y;
    }
    const o = stepSim(sim);
    if (o !== OUTCOME.RUNNING) return finish(sim, o, committed, strokeY0);
  }
  return finish(sim, 'never-ended', committed, strokeY0);
}

function finish(sim, outcome, committed, strokeY0) {
  const r = {
    outcome,
    t: sim.simTime,
    death: sim.death,
    committed,
    miloX: sim.milo.body.position.x,
    miloY: sim.milo.body.position.y,
    strokeFell: sim.stroke && strokeY0 != null ? sim.stroke.position.y - strokeY0 : 0,
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
  return { idle, solved };
}

export { OUTCOME };
