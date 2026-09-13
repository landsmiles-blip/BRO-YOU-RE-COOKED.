// The state machine and the phase logic — Bible §4.1.
//
//   LIVE_BEAT → FROZEN → (draw) → SIMULATION → { DEATH_CAM → retry | RESULT }
//
// THE FREEZE resolves a contradiction the source documents never noticed: §8.1
// describes a frozen world ("draw, THEN physics plays out") while §4.4 insists
// "Milo is moving, the environment is changing". Those are different games.
//
// The world runs live for a short beat — Milo steps, the ball falls, the danger
// reads as imminent — and then STOPS. Urgency is delivered as staging rather
// than as time pressure, which keeps determinism intact (release timing is not
// an input) and suits a distracted, multi-tasking audience: a frozen world is a
// game that waits for you forever without a pause menu.

import { buildSim, stepSim, commitStroke, abort, destroySim, OUTCOME } from './sim.js';
import { LEVELS } from './levels.js';
import { createStroke, begin, extend, end, remaining } from './drawing/capture.js';
import { FREEZE_AT, LINE, MAX_STEPS_PER_FRAME } from './constants.js';
import { DEATH_CAM_MS } from './render/deathcam.js';
import { track } from './platform/analytics.js';

export const PHASE = {
  LIVE: 'live', FROZEN: 'frozen', SIM: 'sim',
  DEATHCAM: 'deathcam', RESULT: 'result',
};

export function createGame(level) {
  const g = {
    level,
    levelIndex: Math.max(0, LEVELS.indexOf(level)),
    sim: null,
    phase: PHASE.LIVE,
    stroke: createStroke(),
    ghostPoints: null,     // previous attempt — turns redraw-blind into adjust
    attempt: 0,
    phaseTime: 0,
    rejectFlash: 0,
    rejectReason: null,
    paused: false,
  };
  reset(g);
  return g;
}

export function reset(g) {
  if (g.sim) destroySim(g.sim);
  g.sim = buildSim(g.level);
  g.phase = PHASE.LIVE;
  g.phaseTime = 0;
  g.stroke = createStroke();
  g.attempt++;
  track('attempt_start', { level: g.level.id, attempt: g.attempt });
}

/** One fixed physics step of game time. */
export function tick(g, dtMs) {
  g.phaseTime += dtMs;
  if (g.rejectFlash > 0) g.rejectFlash -= dtMs;

  if (g.phase === PHASE.LIVE) {
    stepSim(g.sim);
    if (g.sim.simTime >= (g.level.freezeAt ?? FREEZE_AT)) {
      g.phase = PHASE.FROZEN;
      g.phaseTime = 0;
      track('freeze', { level: g.level.id, t: g.sim.simTime });
    }
    return;
  }

  if (g.phase === PHASE.SIM) {
    const o = stepSim(g.sim);
    if (o !== OUTCOME.RUNNING) {
      track('run_end', { level: g.level.id, outcome: o, attempt: g.attempt });
      if (o === OUTCOME.SUCCESS) { g.phase = PHASE.RESULT; g.phaseTime = 0; }
      else if (o === OUTCOME.ABORTED) { retry(g); }
      else { g.phase = PHASE.DEATHCAM; g.phaseTime = 0; }
    }
  }
}

/** FROZEN holds forever — no timer, no pressure. */
export function isSteppingPhase(g) {
  return g.phase === PHASE.LIVE || g.phase === PHASE.SIM;
}

export function retry(g) {
  // Keep the stroke that just failed, to draw as a ghost behind the next one.
  if (g.sim?.strokePoints) g.ghostPoints = g.sim.strokePoints;
  reset(g);
}

/** Advance to the next level, wrapping at the end (M0 has no meta shell yet). */
export function nextLevel(g) {
  g.levelIndex = (g.levelIndex + 1) % LEVELS.length;
  g.level = LEVELS[g.levelIndex];
  g.ghostPoints = null;
  g.attempt = 0;
  reset(g);
}

// ── Input handlers ──────────────────────────────────────────────────────

export function onDown(g, x, y, pointerId) {
  if (g.phase === PHASE.SIM) { abort(g.sim); return; }          // tap = instant retry
  if (g.phase === PHASE.DEATHCAM) {
    if (g.phaseTime > 250) retry(g);                            // let them see it first
    return;
  }
  if (g.phase === PHASE.RESULT) { nextLevel(g); return; }
  if (g.phase === PHASE.FROZEN) begin(g.stroke, x, y, pointerId, performance.now());
}

export function onMove(g, x, y) {
  if (g.phase !== PHASE.FROZEN || !g.stroke.active) return;
  extend(g.stroke, x, y, performance.now());
}

export function onUp(g) {
  if (g.phase !== PHASE.FROZEN || !g.stroke.active) return;
  const pts = end(g.stroke);
  const res = commitStroke(g.sim, pts);
  if (!res.ok) {
    // A rejection is a NO-OP, never a spent attempt.
    g.rejectFlash = 420;
    g.rejectReason = res.reason;
    g.stroke = createStroke();
    track('stroke_rejected', { level: g.level.id, reason: res.reason });
    return;
  }
  track('stroke_committed', { level: g.level.id, length: Math.round(res.length), anchors: res.anchors });
  g.phase = PHASE.SIM;
  g.phaseTime = 0;
}

export function inkUsed(g) { return g.stroke.length; }
export function inkMax(g) { return g.level.drawing?.maxLength ?? LINE.maxLengthDefault; }
export { OUTCOME, DEATH_CAM_MS, MAX_STEPS_PER_FRAME };
