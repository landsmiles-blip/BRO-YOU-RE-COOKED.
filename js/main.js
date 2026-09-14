// Boot, RAF loop, wiring.
//
// THE LOOP CONTRACT (Bible §3.10): physics runs on a FIXED timestep and steps
// are NEVER dropped during a simulation. If the accumulator blows past the cap,
// the tab was backgrounded — and that is handled as resume-from-pause, not as
// catch-up. Fabricating 400ms of physics in one frame to hide a stutter nobody
// was watching breaks determinism for nothing.

import { initView, view, applyTransform } from './view.js';
import { attachInput } from './input.js';
import {
  createGame, tick, onDown, onMove, onUp, retry, nextLevel, goToLevel, isSteppingPhase,
  openSelect, closeSelect, PHASE, inkUsed, inkMax,
} from './game.js';
import { drawBoard, hitTest } from './render/levelselect.js';
import { load as loadProgress, totalStars, maxStars, perfect, starsOn } from './progress.js';
import { A1, LEVELS, ALL_LEVELS, assertLevel } from './levels.js';
import { PHYSICS_DT, MAX_STEPS_PER_FRAME, FREEZE_AT, CLOSE_CALL, NEAR_MISS_DIST } from './constants.js';
import { clear, drawScene } from './render/world.js';
import { wouldAnchor } from './physics/anchor.js';
import { freezeAmount, reducedMotion } from './render/freeze.js';
import { drawBanner, drawText, drawInk } from './render/hud.js';
import { drawReplay, replayFrame, DEATH_CAM_MS } from './render/deathcam.js';
import { C } from './render/palette.js';
import { STAR_NAME, thresholds } from './rating.js';
import * as sdk from './platform/sdk.js';
import * as audio from './audio.js';

for (const lvl of ALL_LEVELS) assertLevel(lvl);

const canvas = document.getElementById('stage');
initView(canvas);
const ctx = view.ctx;
const game = createGame(A1);

// The board's layout depends on the viewport, so the only honest source of
// truth for where a card is, is the box the renderer just produced. Storing it
// is what stops input and rendering drifting apart — the same class of bug as
// the stroke that was drawn in one place and simulated in another.
let boardBox = null;
// Where the level-board button sits. Also set by the renderer.
let boardBtn = null;

// Progress loads ASYNCHRONOUSLY and never blocks the first frame. Bundle size
// is measured page-load → gameReady, so waiting on a platform round-trip here
// would be charged against the load-time budget for no gain: the only thing
// the save changes is which level "play again" returns to and what the ending
// screen totals, neither of which exists at t=0.
loadProgress().then((p) => { game.progress = p; });

// Walk phase must reset with the sim, or a retry starts mid-stride.
const _resetPhase = () => { walkPhase = 0; lastMiloX = null; };

attachInput(canvas, {
  // `pt` carries BOTH spaces. The world coords drive the game; the css ones
  // drive the HUD. Mixing them is what made every board button dead on arrival.
  onDown: (x, y, id, pt) => {
    const p = game.phase;
    if (game.phase === PHASE.SELECT) {
      const hit = boardBox && hitTest(boardBox, pt.cssX, pt.cssY);
      if (hit?.close) closeSelect(game);
      else if (hit && hit.index != null) { goToLevel(game, hit.index); game.selectFrom = null; }
      _resetPhase();
      return;
    }
    // The board button is live during the freeze, on the result card and at the
    // ending — the moments the player is not mid-decision.
    if (boardBtn && insideBtn(pt.cssX, pt.cssY) &&
        (game.phase === PHASE.FROZEN || game.phase === PHASE.RESULT || game.phase === PHASE.ENDING)) {
      openSelect(game);
      return;
    }
    onDown(game, x, y, id);
    if (game.phase !== p) _resetPhase();
  },
  onMove: (x, y) => onMove(game, x, y),
  onUp: () => onUp(game),
});

const insideBtn = (x, y) =>
  x >= boardBtn.x && x <= boardBtn.x + boardBtn.w && y >= boardBtn.y && y <= boardBtn.y + boardBtn.h;

// Certification: onPause MUST halt everything — loop, physics, rendering AND
// AUDIO. Suspending the AudioContext is the difference between a paused game
// and one that keeps humming in a backgrounded tab, which fails review.
sdk.onPause(() => { game.paused = true; audio.pause(); });
sdk.onResume(() => { game.paused = false; acc = 0; last = performance.now(); audio.resume(); });

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
    // TIME DILATION. The sim keeps its fixed PHYSICS_DT; only the rate at which
    // wall-clock time is handed to it changes. Determinism is untouched, the
    // solver and every headless gate are unaffected, and the player gets to
    // actually SEE the boulder miss instead of it being over in three frames.
    const slow = now < game.slowUntil;
    acc += slow ? dt * CLOSE_CALL.slowRate : dt;
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

  if (g.phase === PHASE.SELECT) {
    boardBox = drawBoard(ctx, {
      levels: LEVELS,
      starsOf: (id) => starsOn(g.progress, id),
      current: g.levelIndex,
      total: totalStars(g.progress),
      max: maxStars(),
    });
    return;
  }

  drawScene(ctx, g.sim, {
    now,
    freeze: freezeAmount(g.phase, g.phaseTime, PHASE.FROZEN),
    ghostPoints: g.phase === PHASE.FROZEN ? g.ghostPoints : null,
    livePoints: g.stroke.active ? g.stroke.points : null,
    // Asked every frame of the drag, by the SAME function that does the
    // welding on release — so the preview cannot lie about the outcome.
    liveHolds: g.stroke.active && g.stroke.points.length > 1
      ? wouldAnchor(g.sim.ctx, g.stroke.points)
      : null,
    // Only while they are choosing where to draw, never during the run.
    showAnchorable: g.phase === PHASE.FROZEN,
    anchors: g.phase === PHASE.SIM || g.phase === PHASE.RESULT ? g.sim.anchors : null,
    walkPhase,
  });

  if (g.phase === PHASE.FROZEN) {
    if (!g.stroke.active && !g.stroke.points.length) {
      // THE PROBLEM, then the instruction.
      //
      // This used to say "DRAW" and nothing else, which tells a new player what
      // to do with their finger and nothing about what the level wants. The
      // level's own one-line hint names what is about to go wrong — it does not
      // hand over the solution, and on a retry it is the more useful half, so
      // it stays while the instruction shrinks to "DRAW AGAIN".
      // THE PROBLEM LEADS. The instruction follows.
      //
      // The first version had this the other way round — "DRAW" large, and the
      // level's hint under it in 11px grey at 62% opacity. That is a whisper,
      // and a whisper does not answer "I do not know what I am supposed to do".
      // Everyone already knows to draw; the screen says so, and they have been
      // doing it for twelve levels. What they do not know is what is about to
      // go wrong. So that goes first, and big.
      const lead = g.attempt > 1 ? 'DRAW AGAIN' : 'DRAW';
      if (g.level.hint) {
        drawText(ctx, g.level.hint, 0.5, 0.062, Math.max(15, view.cssH * 0.029), C.ink);
        drawText(ctx, lead, 0.5, 0.105, Math.max(11, view.cssH * 0.019), 'rgba(42,38,34,0.55)');
      } else {
        drawText(ctx, lead, 0.5, 0.07, Math.max(17, view.cssH * 0.032), C.ink);
      }
    }
    drawInk(ctx, inkUsed(g), inkMax(g));
  }

  if (g.phase === PHASE.SIM || g.phase === PHASE.RESULT) drawCloseCall(ctx, g, now);
  if (g.phase === PHASE.RESULT) drawResult(ctx, g);
  if (g.phase === PHASE.ENDING) drawEnding(ctx, g);
  if (g.phase === PHASE.FROZEN || g.phase === PHASE.RESULT || g.phase === PHASE.ENDING) {
    drawBoardButton(ctx, g.phase === PHASE.FROZEN);
  }

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
  const calls = g.sim.closeCalls.length;
  const line = calls
    ? `${Math.round(g.lastLength)}u of ink · ${calls} close call${calls > 1 ? 's' : ''}`
    : `${Math.round(g.lastLength)}u of ink · ${next}`;
  drawText(ctx, line, 0.5, (top + h * 0.74) / view.cssH,
           Math.max(11, view.cssH * 0.018),
           calls ? C.danger : 'rgba(232,226,214,0.72)');
  drawText(ctx, 'tap for the next one', 0.5, (top + h * 0.90) / view.cssH,
           Math.max(10, view.cssH * 0.016), 'rgba(232,226,214,0.45)');
}

/**
 * THE CLOSE CALL — the moment this game is named after.
 *
 * A ring blows out from the point where it nearly happened, the frame edges
 * flush with the danger accent, and one word lands. It reads in a quarter of a
 * second, which is all it gets, and it is the only time the accent is allowed
 * anywhere but on a hazard — because for that quarter second the near miss IS
 * the hazard.
 */
function drawCloseCall(ctx, g, now) {
  const calls = g.sim.closeCalls;
  if (!calls.length) return;
  const last = calls[calls.length - 1];
  const age = CLOSE_CALL.slowMs - (g.slowUntil - now);
  if (age < 0 || age > CLOSE_CALL.slowMs) return;
  const t = age / CLOSE_CALL.slowMs;            // 0 -> 1 across the moment

  applyTransform(ctx);
  ctx.save();
  // The ring: fast out, fading.
  const r = NEAR_MISS_DIST + t * 150;
  ctx.globalAlpha = (1 - t) * 0.85;
  ctx.strokeStyle = C.danger;
  ctx.lineWidth = 7 * (1 - t) + 1.5;
  ctx.beginPath(); ctx.arc(last.x, last.y, r, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = (1 - t) * 0.35;
  ctx.beginPath(); ctx.arc(last.x, last.y, r * 0.55, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // Frame flush — screen space, so it hugs the viewport at every ratio.
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  const edge = Math.min(view.cssW, view.cssH) * 0.16;
  const grad = ctx.createLinearGradient(0, 0, 0, view.cssH);
  const a = (1 - t) * 0.5;
  grad.addColorStop(0, `rgba(224,69,43,${a})`);
  grad.addColorStop(edge / view.cssH, 'rgba(224,69,43,0)');
  grad.addColorStop(1 - edge / view.cssH, 'rgba(224,69,43,0)');
  grad.addColorStop(1, `rgba(224,69,43,${a})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, view.cssW, view.cssH);

  // The word. Rises and fades — it must never outstay the moment.
  if (t < 0.85) {
    ctx.globalAlpha = Math.min(1, (1 - t) * 1.6);
    drawText(ctx, last.gap < 8 ? 'THAT close' : 'CLOSE', 0.5, 0.30 - t * 0.04,
             Math.max(22, view.cssH * 0.052), C.danger);
    ctx.globalAlpha = 1;
  }
}

/**
 * The way IN to the level board: four small bars, top-right.
 *
 * Deliberately tiny and low-contrast during the freeze — the puzzle owns the
 * screen and this must never compete with the thing the player is reading. It
 * brightens on the result card and the ending, where navigating is the point.
 * Its rectangle is stored rather than recomputed at the tap, so the hit region
 * cannot drift from the drawing.
 */
function drawBoardButton(ctx, quiet) {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  const s = Math.max(22, Math.min(view.cssW, view.cssH) * 0.045);
  const pad = Math.max(8, Math.min(view.cssW, view.cssH) * 0.022);
  const x = view.cssW - pad - s, y = pad;
  // A generous touch target around a small glyph: 44px is the accepted floor
  // for a finger, and the glyph itself should stay visually quiet.
  boardBtn = { x: x - 8, y: y - 8, w: s + 16, h: s + 16 };
  const cell = s / 2 - 2;
  ctx.fillStyle = quiet ? 'rgba(42,38,34,0.30)' : 'rgba(232,226,214,0.55)';
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) ctx.fillRect(x + c * (cell + 4), y + r * (cell + 4), cell, cell);
  }
}

/**
 * THE ENDING. The screen whose absence made this a demo rather than a game.
 *
 * It states three things and no more: that it is over, what the player scored
 * across the whole game, and that there is a reason to come back. The star
 * total is the 3-star chase made visible — without it, "nothing left to cut" on
 * an individual level is advice with nowhere to go.
 */
function drawEnding(ctx, g) {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.fillStyle = 'rgba(42,38,34,0.95)';
  ctx.fillRect(0, 0, view.cssW, view.cssH);

  const got = totalStars(g.progress), max = maxStars();
  const all = perfect(g.progress);

  drawText(ctx, all ? 'NOT A SINGLE WASTED LINE.' : 'HE MADE IT. EVERY TIME.',
           0.5, 0.30, Math.max(19, view.cssH * 0.034), C.paper);
  drawText(ctx, `${got} / ${max}`, 0.5, 0.44, Math.max(34, view.cssH * 0.072), C.anchor);
  drawText(ctx, all ? 'stars — all of them' : 'stars', 0.5, 0.51,
           Math.max(11, view.cssH * 0.018), 'rgba(232,226,214,0.6)');

  // A per-level star strip: the 3-star chase, made concrete. It shows exactly
  // WHICH levels still owe the player something, which a bare total cannot.
  const n = LEVELS.length;
  const w = Math.min(view.cssW * 0.82, n * Math.max(20, view.cssW * 0.055));
  const x0 = (view.cssW - w) / 2, y = view.cssH * 0.62, cw = w / n;
  for (let i = 0; i < n; i++) {
    const st = starsOn(g.progress, LEVELS[i].id);
    for (let k = 0; k < 3; k++) {
      ctx.fillStyle = k < st ? C.anchor : 'rgba(232,226,214,0.16)';
      ctx.fillRect(x0 + i * cw + cw * 0.18, y + k * 7, cw * 0.64, 4.5);
    }
  }

  drawText(ctx,
    all ? 'tap to play it again' : 'tap to go back for the stars you left',
    0.5, 0.80, Math.max(11, view.cssH * 0.018), 'rgba(232,226,214,0.55)');
  drawText(ctx, 'or pick a level, top right', 0.5, 0.845,
           Math.max(10, view.cssH * 0.015), 'rgba(232,226,214,0.35)');
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
globalThis.__byc = { game, view, PHASE, retry, nextLevel, goToLevel, openSelect, closeSelect, LEVELS, reducedMotion };

requestAnimationFrame(frame);
