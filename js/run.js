// The complete set of run-end conditions — Bible §5.7.
//
// A doomed run must always end, and the player must always be able to skip it:
// 90% of the time they know they have failed inside the first second, and
// forcing them to watch is a tax on the exact loop the game is built around.

import { STUCK, RUN_TIMEOUT, GOAL_MAX_SPEED, MILO } from './constants.js';
import { getSpeed } from './physics/adapter.js';
import { inLethalZone } from './hazards.js';

export const OUTCOME = {
  RUNNING: 'running', SUCCESS: 'success', KILLED: 'killed',
  FELL: 'fell', STUCK: 'stuck', TIMEOUT: 'timeout', ABORTED: 'aborted',
};

export function createRunState() {
  return { outcome: OUTCOME.RUNNING, culpritId: null, slowSince: -1, simTime: 0 };
}

export function checkRunEnd(run, milo, level, worldH, simTimeMs, lastContactAt) {
  if (run.outcome !== OUTCOME.RUNNING) return run.outcome;
  const b = milo.body;

  // Success — but not if he was fired through the goal at lethal speed; that
  // looks like a bug even when the player caused it.
  const g = level.goal;
  const inGoal = b.position.x > g.x - g.w / 2 && b.position.x < g.x + g.w / 2 &&
                 b.position.y + MILO.height / 2 > g.y - g.h &&
                 b.position.y - MILO.height / 2 < g.y;
  if (inGoal && getSpeed(b) < GOAL_MAX_SPEED) return (run.outcome = OUTCOME.SUCCESS);

  // Out of the world, or in a lethal zone.
  if (b.position.y - MILO.height > worldH + 200) return (run.outcome = OUTCOME.FELL);
  if (inLethalZone(b, level.zones)) return (run.outcome = OUTCOME.FELL);

  // Stuck — slow for long enough, and not merely mid-landing.
  const speed = getSpeed(b);
  if (speed < STUCK.speedUnder && simTimeMs - lastContactAt > STUCK.sinceContactMs) {
    if (run.slowSince < 0) run.slowSince = simTimeMs;
    else if (simTimeMs - run.slowSince > STUCK.forMs) return (run.outcome = OUTCOME.STUCK);
  } else {
    run.slowSince = -1;
  }

  // Hard cap. A run can be non-stuck and non-terminating for a long time.
  if (simTimeMs > RUN_TIMEOUT) return (run.outcome = OUTCOME.TIMEOUT);

  return OUTCOME.RUNNING;
}

export function kill(run, culpritId) {
  if (run.outcome === OUTCOME.RUNNING) {
    run.outcome = OUTCOME.KILLED;
    run.culpritId = culpritId;
  }
}
