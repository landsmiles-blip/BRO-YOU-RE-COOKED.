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
import { freezeAmount, reducedMotion } from './render/freeze.js';
import { drawBanner, drawText, drawInk } from './render/hud.js';
import { drawReplay, replayFrame, DEATH_CAM_MS } from './render/deathcam.js';
import { C } from './render/palette.js';
import { STAR_NAME, thresholds } from './rating.js';
import * as sdk from './platform/sdk.js';

for (const lvl of LEVELS) assertLevel(lvl);

const canvas = document.getElementById('stage');
initView(canvas);
const ctx = view.ctx;
const game = createGame(A1);

// Walk phase must reset with the sim, or a retry starts mid-stride.
const _resetPhase = () => { walkPhase = 0; lastMiloX = null; };

attachInput(canvas, {
  onDown: (x, y, id) => { const p = game.phase; onDown(game, x, y, id); if (game.phase !== p) _resetPhase(); },
  onMove: (x, y) => onMove(game, x, y),
  onUp: () => onUp(game),
});

// Certification: onPause MUST halt everything — loop, physics, rendering.
sdk.onPause(() => { game.paused = true; });
sdk.onResume(() => { game.paused = false; acc = 0; last = performance.now(); });

let last = performance.now();
let acc = 0;
let firstFrameDone = false;
let walkPhase = 0;          // DISTANCE-driven, so his feet never skate
let lastMiloX = null;

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
      advanceWalkPhase();
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

/** Walk cycle advances with distance travelled, not with wall time. */
function advanceWalkPhase() {
  const x = game.sim.milo.body.position.x;
  if (lastMiloX !== null) walkPhase += Math.abs(x - lastMiloX) / 15;
  lastMiloX = x;
}

function render() {
  clear(ctx);
  const g = game;
  const now = reducedMotion ? 0 : performance.now();

  if (g.phase === PHASE.DEATHCAM) {
    const idx = replayFrame(g.sim, g.phaseTime);
    drawReplay(ctx, g.sim, idx, g.sim.death?.label, g.sim.death?.culpritId ?? g.sim.run.culpritId);
    return;
  }

  drawScene(ctx, g.sim, {
    now,
    freeze: freezeAmount(g.phase, g.phaseTime, PHASE.FROZEN),
    ghostPoints: g.phase === PHASE.FROZEN ? g.ghostPoints : null,
    livePoints: g.stroke.active ? g.stroke.points : null,
    anchors: g.phase === PHASE.SIM || g.phase === PHASE.RESULT ? g.sim.anchors : null,
    walkPhase,
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

  if (g.phase === PHASE.RESULT) drawResult(ctx, g);

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

/**
 * The result as ONE panel.
 *
 * The first version scattered a banner, a star row and a detail line across
 * three different heights, so the text ran straight over the scene and the
 * hardest thing to read was the number the player most wants — how much ink
 * they spent. A single card keeps it legible over any level geometry.
 */
function drawResult(ctx, g) {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  const h = Math.max(150, view.cssH * 0.30);
  const top = view.cssH * 0.36;
  ctx.fillStyle = 'rgba(42,38,34,0.92)';
  ctx.fillRect(0, top, view.cssW, h);

  const mid = (top + h * 0.22) / view.cssH;
  drawText(ctx, STAR_NAME[g.stars] ?? 'NAILED IT.', 0.5, mid,
           Math.max(20, view.cssH * 0.036), C.paper);
  drawStars(ctx, g.stars, top + h * 0.50);

  const th = thresholds(g.level.id);
  const next = g.stars < 3
    ? `${g.stars === 1 ? th.two : th.three}u for the next star`
    : 'nothing left to cut';
  drawText(ctx, `${Math.round(g.lastLength)}u of ink · ${next}`, 0.5, (top + h * 0.74) / view.cssH,
           Math.max(11, view.cssH * 0.018), 'rgba(232,226,214,0.72)');
  drawText(ctx, 'tap for the next one', 0.5, (top + h * 0.90) / view.cssH,
           Math.max(10, view.cssH * 0.016), 'rgba(232,226,214,0.45)');
}

/** Three ink stars, filled to the rating. Drawn, like everything else. */
function drawStars(ctx, stars, cyPx) {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  const r = Math.max(11, view.cssH * 0.022);
  const gap = r * 2.9;
  for (let i = 0; i < 3; i++) {
    const cx = view.cssW / 2 + (i - 1) * gap;
    const cy = cyPx;
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      const rad = k % 2 === 0 ? r : r * 0.44;
      const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad;
      k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = i < stars ? C.ink : 'rgba(232,226,214,0.4)';
    if (i < stars) { ctx.fillStyle = C.anchor; ctx.fill(); }
    ctx.stroke();
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
globalThis.__byc = { game, view, PHASE, retry, nextLevel, LEVELS, reducedMotion };

requestAnimationFrame(frame);
