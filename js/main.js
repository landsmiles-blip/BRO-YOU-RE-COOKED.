// Boot, RAF loop, wiring.
//
// THE LOOP CONTRACT (Bible §3.10): physics runs on a FIXED timestep and steps
// are NEVER dropped during a simulation. If the accumulator blows past the cap,
// the tab was backgrounded — and that is handled as resume-from-pause, not as
// catch-up. Fabricating 400ms of physics in one frame to hide a stutter nobody
// was watching breaks determinism for nothing.

import { initView, view } from './view.js';
import { attachInput } from './input.js';
import {
  createGame, tick, onDown, onMove, onUp, retry, nextLevel, isSteppingPhase,
  PHASE, inkUsed, inkMax,
} from './game.js';
import { A1, LEVELS, assertLevel } from './levels.js';
import { PHYSICS_DT, MAX_STEPS_PER_FRAME, FREEZE_AT } from './constants.js';
import { clear, drawScene } from './render/world.js';
import { drawBanner, drawText, drawInk } from './render/hud.js';
import { drawReplay, replayFrame, DEATH_CAM_MS } from './render/deathcam.js';
import { C } from './render/palette.js';
import * as sdk from './platform/sdk.js';

for (const lvl of LEVELS) assertLevel(lvl);

const canvas = document.getElementById('stage');
initView(canvas);
const ctx = view.ctx;
const game = createGame(A1);

attachInput(canvas, {
  onDown: (x, y, id) => onDown(game, x, y, id),
  onMove: (x, y) => onMove(game, x, y),
  onUp: () => onUp(game),
});

// Certification: onPause MUST halt everything — loop, physics, rendering.
sdk.onPause(() => { game.paused = true; });
sdk.onResume(() => { game.paused = false; acc = 0; last = performance.now(); });

let last = performance.now();
let acc = 0;
let firstFrameDone = false;

function frame(now) {
  requestAnimationFrame(frame);

  const dt = now - last;
  last = now;

  if (game.paused) return;             // nothing steps, nothing renders

  if (isSteppingPhase(game)) {
    acc += dt;
    let steps = 0;
    while (acc >= PHYSICS_DT) {
      if (steps >= MAX_STEPS_PER_FRAME) { acc = 0; break; }   // resume-from-pause
      tick(game, PHYSICS_DT);
      acc -= PHYSICS_DT;
      steps++;
      if (!isSteppingPhase(game)) { acc = 0; break; }
    }
  } else {
    game.phaseTime += dt;
    acc = 0;
  }

  render();

  if (!firstFrameDone) {
    firstFrameDone = true;
    sdk.firstFrameReady();
    // Input is accepted from here, and bundle size is measured to gameReady —
    // so it is called now, before any deferrable warm-up (Amendment A.4).
    sdk.gameReady();
  }
}

function render() {
  clear(ctx);
  const g = game;

  if (g.phase === PHASE.DEATHCAM) {
    const idx = replayFrame(g.sim, g.phaseTime);
    drawReplay(ctx, g.sim, idx, g.sim.death?.label, g.sim.death?.culpritId ?? g.sim.run.culpritId);
    return;
  }

  drawScene(ctx, g.sim, {
    frozen: g.phase === PHASE.FROZEN,
    ghostPoints: g.phase === PHASE.FROZEN ? g.ghostPoints : null,
    livePoints: g.stroke.active ? g.stroke.points : null,
    anchors: g.phase === PHASE.SIM || g.phase === PHASE.RESULT ? g.sim.anchors : null,
  });

  if (g.phase === PHASE.FROZEN) {
    if (!g.stroke.active && !g.stroke.points.length) {
      // Clear of Milo — he stands near the bottom of the safe box, so a hint
      // "near his feet" lands on top of him at most aspect ratios.
      const hint = g.attempt > 1 ? 'DRAW AGAIN' : 'DRAW';
      drawText(ctx, hint, 0.5, 0.07, Math.max(18, view.cssH * 0.032), C.ink);
    }
    drawInk(ctx, inkUsed(g), inkMax(g));
  }

  if (g.phase === PHASE.RESULT) drawBanner(ctx, 'NAILED IT.', 'tap for the next one', 0.44);

  // Tiny progress marker. Deliberately unobtrusive — the puzzle owns the screen.
  if (g.phase === PHASE.FROZEN || g.phase === PHASE.SIM) {
    drawText(ctx, `${g.levelIndex + 1}/${LEVELS.length}  ${g.level.verb}`,
             0.06, 0.035, Math.max(11, view.cssH * 0.016), 'rgba(42,38,34,0.45)', 'left');
  }

  if (g.rejectFlash > 0) {
    drawText(ctx, rejectText(g.rejectReason), 0.5, 0.82,
             Math.max(14, view.cssH * 0.022), C.danger);
  }
}

function rejectText(reason) {
  switch (reason) {
    case 'too-short': return 'TOO SHORT';
    case 'too-long': return 'TOO MUCH INK';
    case 'overlaps-milo': return 'NOT THROUGH HIM';
    case 'overlaps-goal': return 'NOT OVER THE EXIT';
    case 'in-deny-zone': return 'NOT THERE';
    default: return 'TRY AGAIN';
  }
}

// Test hook — lets Playwright drive real strokes through the real pipeline.
globalThis.__byc = { game, view, PHASE, retry, nextLevel, LEVELS };

requestAnimationFrame(frame);
