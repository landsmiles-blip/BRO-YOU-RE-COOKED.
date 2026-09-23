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
import { starsFor } from './rating.js';
import { createStroke, begin, extend, end, remaining } from './drawing/capture.js';
import { FREEZE_AT, LINE, MAX_STEPS_PER_FRAME, CLOSE_CALL } from './constants.js';
import { DEATH_CAM_MS } from './render/deathcam.js';
import { track } from './platform/analytics.js';
import { createProgress, record, save, isComplete, firstUnclearedIndex } from './progress.js';
import * as audio from './audio.js';
import * as sdk from './platform/sdk.js';

export const PHASE = {
  LIVE: 'live', FROZEN: 'frozen', SIM: 'sim',
  DEATHCAM: 'deathcam', RESULT: 'result',
  // The run is over and there is no next level. Reached exactly once per
  // playthrough, and its absence is why the game used to end mid-air.
  ENDING: 'ending',
  // The level board. Openable from the freeze and from the ending — without
  // it the only route to level 14 was playing levels 1-13 in order, every
  // single session.
  SELECT: 'select',
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
    lastLength: 0,
    stars: 0,
    rejectReason: null,
    paused: false,
    progress: createProgress(),
    // Where to return to when the board is closed without choosing.
    selectFrom: null,
    // Wall-clock deadline for the close-call slow motion, and how many the
    // sim has reported so far, so the loop can notice a NEW one.
    slowUntil: 0,
    seenCalls: 0,
  };
  reset(g);
  return g;
}

export function reset(g) {
  g.slowUntil = 0;
  g.seenCalls = 0;
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
    // A new close call arms the slow motion. The SIM is untouched — it still
    // steps at a fixed PHYSICS_DT — only the wall-clock rate at which the loop
    // feeds it changes, so determinism and every headless gate are unaffected.
    if (g.sim.closeCalls.length > g.seenCalls) {
      g.seenCalls = g.sim.closeCalls.length;
      g.slowUntil = performance.now() + CLOSE_CALL.slowMs;
    }
    if (o !== OUTCOME.RUNNING) {
      track('run_end', { level: g.level.id, outcome: o, attempt: g.attempt });
      if (o === OUTCOME.SUCCESS) {
        g.stars = starsFor(g.level.id, g.lastLength);
        // Only a personal BEST is written, so replaying a cleared level to
        // experiment can never cost the player stars they already earned.
        if (record(g.progress, g.level.id, g.stars)) save(g.progress);
        audio.success(g.stars);
        g.phase = PHASE.RESULT;
        g.phaseTime = 0;
      }
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

/**
 * Advance. The LAST level does NOT wrap.
 *
 * `(levelIndex + 1) % LEVELS.length` sent the player who had just finished the
 * whole game back to level one with no acknowledgement of any kind. That is the
 * single thing that made the game read as a fragment, and it would have done so
 * at 24 levels exactly as much as at 9.
 */
export function nextLevel(g) {
  if (g.levelIndex >= LEVELS.length - 1) {
    g.phase = PHASE.ENDING; g.phaseTime = 0; audio.ending(); return;
  }
  // AN AD AT A LEVEL BOUNDARY, AND NOT AT EVERY ONE.
  //
  // This is the only breakpoint in the game that is a real pause rather than
  // an interruption: the player has already read RESCUED and tapped to move
  // on. The platform's own guidance is logical pauses between levels.
  //
  // The cap matters more than the call. A level here is about forty seconds,
  // so an ad after each one would be the fastest way to lose a player we paid
  // nothing to get, and the counter starts such that the first ad lands after
  // level THREE — a new player's first two levels are never interrupted.
  //
  // The counter lives on `g` rather than in this module on purpose: per-run
  // state in module scope is the same shape of bug as recording a balloon's
  // burst on its shared level spec.
  g.sinceAd = (g.sinceAd ?? 0) + 1;
  if (g.sinceAd >= LEVELS_PER_AD) { g.sinceAd = 0; sdk.requestInterstitialAd(); }
  goToLevel(g, g.levelIndex + 1);
}

/** Level boundaries between interstitials. See nextLevel. */
const LEVELS_PER_AD = 3;

/** Jump to a level by index — used by nextLevel, the ending, and level select. */
export function goToLevel(g, index) {
  g.levelIndex = Math.max(0, Math.min(LEVELS.length - 1, index));
  g.level = LEVELS[g.levelIndex];
  g.ghostPoints = null;
  g.attempt = 0;
  reset(g);
}

/** From the ending: back to the first level still missing stars, else level 1. */
export function playAgain(g) {
  goToLevel(g, isComplete(g.progress) ? 0 : firstUnclearedIndex(g.progress));
}

export function openSelect(g) {
  if (g.phase === PHASE.SELECT) return;
  g.selectFrom = g.phase;
  g.phase = PHASE.SELECT;
  g.phaseTime = 0;
}

/**
 * Close the board without picking. Returns to the FROZEN level rather than
 * wherever it was opened from: coming back to a half-run simulation the player
 * has since stopped thinking about is worse than restarting the level cleanly.
 */
export function closeSelect(g) {
  if (g.phase !== PHASE.SELECT) return;
  const from = g.selectFrom;
  g.selectFrom = null;
  if (from === PHASE.ENDING) { g.phase = PHASE.ENDING; g.phaseTime = 0; return; }
  reset(g);
}

// ── Input handlers ──────────────────────────────────────────────────────

export function onDown(g, x, y, pointerId) {
  // An AudioContext built before a user gesture starts suspended and stays
  // that way, so this is the ONLY place it can be created. Every frame before
  // the first touch is deliberately silent.
  audio.unlock();
  // The board consumes the whole gesture — main.js resolves the hit, because
  // only the renderer knows where the cards ended up at this viewport size.
  if (g.phase === PHASE.SELECT) return;
  if (g.phase === PHASE.SIM) { abort(g.sim); return; }          // tap = instant retry
  if (g.phase === PHASE.DEATHCAM) {
    if (g.phaseTime > 250) retry(g);                            // let them see it first
    return;
  }
  if (g.phase === PHASE.RESULT) { nextLevel(g); return; }
  // Hold the ending on screen long enough to be read before a stray tap
  // dismisses the one screen that says the player finished the game.
  if (g.phase === PHASE.ENDING) { if (g.phaseTime > 900) playAgain(g); return; }
  if (g.phase === PHASE.FROZEN) begin(g.stroke, x, y, pointerId, performance.now());
}

export function onMove(g, x, y) {
  if (g.phase !== PHASE.FROZEN || !g.stroke.active) return;
  const before = g.stroke.length;
  extend(g.stroke, x, y, performance.now());
  // Only when the line actually grew — a stationary finger is not drawing.
  if (g.stroke.length > before + 1) audio.scratch();
}

export function onUp(g) {
  if (g.phase !== PHASE.FROZEN || !g.stroke.active) return;
  const pts = end(g.stroke);
  const res = commitStroke(g.sim, pts);
  if (!res.ok) {
    // A rejection is a NO-OP, never a spent attempt.
    g.rejectFlash = 420;
    g.rejectReason = res.reason;
    audio.reject();
    g.stroke = createStroke();
    track('stroke_rejected', { level: g.level.id, reason: res.reason });
    return;
  }
  g.lastLength = res.length;
  audio.release();
  track('stroke_committed', { level: g.level.id, length: Math.round(res.length), anchors: res.anchors });
  g.phase = PHASE.SIM;
  g.phaseTime = 0;
}

export function inkUsed(g) { return g.stroke.length; }
export function inkMax(g) { return g.level.drawing?.maxLength ?? LINE.maxLengthDefault; }
export { OUTCOME, DEATH_CAM_MS, MAX_STEPS_PER_FRAME };
