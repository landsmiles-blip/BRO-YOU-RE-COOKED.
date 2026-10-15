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
  openSelect, closeSelect, PHASE, inkUsed, inkMax, startDaily, loadLevel, skip, skipOffer,
} from './game.js';
import { dayNumber, dailyFor, asDaily } from './daily.js';
import { dailyDone } from './progress.js';
import { drawBoard, hitTest } from './render/levelselect.js';
import {
  load as loadProgress, save as saveProgress, totalStars, maxStars, perfect, starsOn, isOpen, isSkipped, resumeIndex,
  triesOn, noteTime,
} from './progress.js';
import { A1, LEVELS, assertLevel, chapterOf } from './levels.js';
import { POOL } from './dailyPool.js';
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

// The daily pool too: a malformed pool level would otherwise surface only on
// the one day it is dealt, as a blank page for everybody at once.
for (const lvl of [...LEVELS, ...POOL]) assertLevel(lvl);

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
// Where the skip button sits on the fail card, when one is offered. Same rule.
let skipBtn = null;
// Where the sound switch sits, beside the board button. Same rule.
let soundBtn = null;

// Progress loads ASYNCHRONOUSLY and never blocks the first frame. Bundle size
// is measured page-load → gameReady, so waiting on a platform round-trip here
// would be charged against the load-time budget for no gain: the only thing
// the save changes is which level "play again" returns to and what the ending
// screen totals, neither of which exists at t=0.
//
// A RETURNING PLAYER STARTS WHERE THEY ARE. The first frame is always level 1,
// because nothing is known yet; once the save arrives, a player with progress
// is moved to the first level they have neither beaten nor skipped — but only
// if they have not touched anything yet, so the save can never yank a level out
// from under a finger that is already drawing.
loadProgress().then((p) => {
  game.progress = p;
  applySound();
  const at = resumeIndex(p);
  const untouched = game.levelIndex === 0 && !game.isDaily && game.attempt <= 1 &&
    !game.stroke.active && !game.stroke.points.length &&
    (game.phase === PHASE.LIVE || game.phase === PHASE.FROZEN);
  if (at > 0 && untouched) { goToLevel(game, at); _resetPhase(); }
});

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
      else if (hit?.daily) { startDaily(game); game.selectFrom = null; }
      else if (hit && hit.index != null && !hit.locked) { goToLevel(game, hit.index); game.selectFrom = null; }
      _resetPhase();
      return;
    }
    // The skip lives on the fail card, under the death cam's banner. Checked
    // before the card's own tap-anywhere-to-retry, and only once the death has
    // had its quarter second on screen — the same grace the retry gets.
    if (game.phase === PHASE.DEATHCAM && skipBtn && game.phaseTime > 250 &&
        inside(skipBtn, pt.cssX, pt.cssY) && skipOffer(game)) {
      skip(game).then(_resetPhase);
      return;
    }
    // The sound switch, live wherever the board button is.
    if (soundBtn && inside(soundBtn, pt.cssX, pt.cssY) &&
        (game.phase === PHASE.FROZEN || game.phase === PHASE.RESULT || game.phase === PHASE.ENDING)) {
      game.progress.muted = !game.progress.muted;
      applySound();
      saveProgress(game.progress);
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

const inside = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
const insideBtn = (x, y) => inside(boardBtn, x, y);

// Certification: onPause MUST halt everything — loop, physics, rendering AND
// AUDIO. Suspending the AudioContext is the difference between a paused game
// and one that keeps humming in a backgrounded tab, which fails review.
sdk.onPause(() => { game.paused = true; audio.pause(); });
sdk.onResume(() => { game.paused = false; acc = 0; last = performance.now(); audio.resume(); });

// SOUND IS ON ONLY IF YOUTUBE SAYS SO AND THE PLAYER HAS NOT SWITCHED IT OFF.
// YouTube's setting comes first and is followed live; the switch, top right,
// is the player's own and is saved with their progress.
let platformAudio = sdk.isAudioEnabled();
const applySound = () => audio.setEnabled(platformAudio && !game.progress.muted);
applySound();
sdk.onAudioEnabledChange((on) => { platformAudio = on; applySound(); });

let last = performance.now();
let acc = 0;
let firstFrameDone = false;
let walkPhase = 0;          // DISTANCE-driven, so his feet never skate
let lastMiloX = null;

const ON_LEVEL = new Set([PHASE.LIVE, PHASE.FROZEN, PHASE.SIM, PHASE.DEATHCAM]);

function frame(now) {
  requestAnimationFrame(frame);

  const dt = now - last;
  last = now;

  if (game.paused) return;             // nothing steps, nothing renders

  // TIME ON THE LEVEL, for the playtest's minutes-per-level: wall-clock time
  // while a campaign level is on screen — watching, drawing, the run and its
  // replay — and not while the board, a result card or a pause is up.
  if (game.levelIndex >= 0 && !game.isDaily && ON_LEVEL.has(game.phase)) {
    noteTime(game.progress, game.level.id, Math.min(dt, 250));
  }

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
    const bannerY = drawReplay(ctx, g.sim, idx, g.sim.death?.label, g.sim.death?.culpritId ?? g.sim.run.culpritId);
    drawSkip(ctx, g, bannerY ?? 0.2);
    return;
  }
  skipBtn = null;

  if (g.phase === PHASE.SELECT) {
    boardBox = drawBoard(ctx, {
      levels: LEVELS,
      starsOf: (id) => starsOn(g.progress, id),
      openAt: (i) => isOpen(g.progress, i),
      chapterAt: (i) => chapterOf(i),
      skippedOf: (id) => isSkipped(g.progress, id),
      tokens: g.progress.tokens || 0,
      // Only the playtest build (the published page) shows what each level
      // took; the game itself shows stars.
      triesOf: globalThis.BYC_PLAYTEST ? (id) => triesOn(g.progress, id) : null,
      current: g.levelIndex,
      total: totalStars(g.progress),
      max: maxStars(),
      daily: (() => {
        const day = dayNumber();
        const d = dailyFor(day);
        return { verb: d.level.verb, ink: d.ink,
                 done: dailyDone(g.progress, day), streak: g.progress.streak || 0 };
      })(),
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
      // A NEW CHAPTER SAYS SO, once: on the first attempt at its first level.
      // A new noun arriving unannounced reads as the game changing its rules;
      // named, it reads as the game opening up.
      const ch = !g.isDaily && g.attempt <= 1 ? chapterOf(g.levelIndex) : null;
      if (ch?.first) {
        // The progress accent, not the danger red: red is reserved for what
        // can hurt him and for the near miss.
        drawText(ctx, `CHAPTER ${ch.n} — ${ch.name}  ·  ${ch.tag}`, 0.5, 0.148,
                 Math.max(11, view.cssH * 0.018), C.anchor);
      }
    }
    drawInk(ctx, inkUsed(g), inkMax(g));
  }

  if (g.phase === PHASE.SIM || g.phase === PHASE.RESULT) drawCloseCall(ctx, g, now);
  if (g.phase === PHASE.RESULT) drawResult(ctx, g);
  if (g.phase === PHASE.ENDING) drawEnding(ctx, g);
  if (g.phase === PHASE.FROZEN || g.phase === PHASE.RESULT || g.phase === PHASE.ENDING) {
    drawBoardButton(ctx, g.phase === PHASE.FROZEN);
    drawSoundButton(ctx, g.phase === PHASE.FROZEN, platformAudio && !g.progress.muted);
  } else {
    soundBtn = null;
  }

  // Tiny progress marker. Deliberately unobtrusive — the puzzle owns the screen.
  if (g.phase === PHASE.FROZEN || g.phase === PHASE.SIM) {
    // A daily is not a position in the campaign — a pool level has none, and
    // "0/21" is what it printed — so it says what it is instead. Keyed on the
    // index as well as the flag: a level with no campaign index can only ever
    // be a daily, however it was loaded.
    const daily = g.isDaily || g.levelIndex < 0;
    drawText(ctx, daily ? `DAILY  ${g.level.verb}` : `${g.levelIndex + 1}/${LEVELS.length}  ${g.level.verb}`,
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
  // After a daily there is no "next one" — the tap goes back to the board — and
  // this card is the moment the streak went up, so it says that instead.
  const onward = g.isDaily
    ? `daily done · ${g.progress.streak || 1}-day streak · tap for the board`
    : 'tap for the next one';
  drawText(ctx, onward, 0.5, (top + h * 0.90) / view.cssH,
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
 * THE SOUND SWITCH: a small speaker beside the board button, struck through
 * when off. Same size, same quietness during the freeze, same stored hit box.
 * It shows what the player will actually hear — so when YouTube's own setting
 * has the sound off, it is drawn off, whatever the switch says.
 */
function drawSoundButton(ctx, quiet, on) {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  const s = Math.max(22, Math.min(view.cssW, view.cssH) * 0.045);
  const pad = Math.max(8, Math.min(view.cssW, view.cssH) * 0.022);
  const x = view.cssW - pad - s - pad - 16 - s, y = pad;
  soundBtn = { x: x - 8, y: y - 8, w: s + 16, h: s + 16 };
  const col = quiet ? 'rgba(42,38,34,0.30)' : 'rgba(232,226,214,0.55)';
  ctx.fillStyle = col;
  ctx.strokeStyle = col;
  ctx.lineWidth = Math.max(1.6, s * 0.08);
  ctx.lineCap = 'round';
  // The speaker: a box and a cone.
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.36);
  ctx.lineTo(x + s * 0.22, y + s * 0.36);
  ctx.lineTo(x + s * 0.50, y + s * 0.10);
  ctx.lineTo(x + s * 0.50, y + s * 0.90);
  ctx.lineTo(x + s * 0.22, y + s * 0.64);
  ctx.lineTo(x, y + s * 0.64);
  ctx.closePath();
  ctx.fill();
  if (on) {
    for (const r of [0.22, 0.38]) {
      ctx.beginPath();
      ctx.arc(x + s * 0.50, y + s * 0.5, s * r, -0.75, 0.75);
      ctx.stroke();
    }
  } else {
    ctx.beginPath();
    ctx.moveTo(x + s * 0.64, y + s * 0.30); ctx.lineTo(x + s * 0.96, y + s * 0.70);
    ctx.moveTo(x + s * 0.96, y + s * 0.30); ctx.lineTo(x + s * 0.64, y + s * 0.70);
    ctx.stroke();
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
  const st = g.progress.stats ?? { wins: 0, deaths: 0, ink: 0, calls: 0 };
  const fmt = (n) => Math.round(n).toLocaleString('en-US');

  // Honest about the skip: a level skipped is a level he did not make.
  const skippedAny = LEVELS.some((l) => isSkipped(g.progress, l.id));
  drawText(ctx, all ? 'NOT A SINGLE WASTED LINE.' : skippedAny ? 'HE MADE IT. MOSTLY.' : 'HE MADE IT. EVERY TIME.',
           0.5, 0.17, Math.max(19, view.cssH * 0.034), C.paper);
  drawText(ctx, `${got} / ${max}`, 0.5, 0.28, Math.max(30, view.cssH * 0.064), C.anchor);
  drawText(ctx, all ? 'stars — all of them' : 'stars', 0.5, 0.345,
           Math.max(11, view.cssH * 0.018), 'rgba(232,226,214,0.6)');

  // A per-level star strip: the 3-star chase, made concrete. It shows exactly
  // WHICH levels still owe the player something, which a bare total cannot.
  const n = LEVELS.length;
  const w = Math.min(view.cssW * 0.82, n * Math.max(20, view.cssW * 0.055));
  const x0 = (view.cssW - w) / 2, y = view.cssH * 0.40, cw = w / n;
  for (let i = 0; i < n; i++) {
    const s = starsOn(g.progress, LEVELS[i].id);
    for (let k = 0; k < 3; k++) {
      ctx.fillStyle = k < s ? C.anchor : 'rgba(232,226,214,0.16)';
      ctx.fillRect(x0 + i * cw + cw * 0.18, y + k * 7, cw * 0.64, 4.5);
    }
  }

  // THE CARD PEOPLE SCREENSHOT. Lifetime numbers, so it is the player's own
  // story rather than a score: how many disasters he walked out of, how much
  // line it took, how close it was, and how often it went the other way.
  // A unit is about 1/60 of a metre: Milo is 72 units and roughly 1.2 m tall.
  // One fact per line: joined, they shrank to a smudge at 9:32.
  const small = Math.max(11, Math.min(view.cssH * 0.019, 20));
  drawText(ctx, `MILO SURVIVED ${fmt(st.wins)} DISASTERS`, 0.5, 0.51,
           Math.max(16, view.cssH * 0.030), C.paper);
  drawText(ctx, `you drew ${fmt(st.ink / 60)} m of line`, 0.5, 0.56, small, 'rgba(232,226,214,0.78)');
  drawText(ctx, `he nearly died ${fmt(st.calls)} times`, 0.5, 0.595, small, 'rgba(232,226,214,0.78)');
  drawText(ctx, `and he got cooked ${fmt(st.deaths)} times`, 0.5, 0.63, small, 'rgba(232,226,214,0.55)');

  // MORE COMING, and the reason to come back before it does.
  drawText(ctx, 'MORE LEVELS ARE COMING', 0.5, 0.715, Math.max(13, view.cssH * 0.024), C.anchor);
  drawText(ctx, 'and a new daily challenge every day', 0.5, 0.755,
           Math.max(10, Math.min(view.cssH * 0.017, 18)), 'rgba(232,226,214,0.6)');

  drawText(ctx,
    all ? 'tap to play it again' : 'tap to go back for the stars you left',
    0.5, 0.86, Math.max(11, view.cssH * 0.018), 'rgba(232,226,214,0.55)');
  drawText(ctx, 'or pick a level, top right', 0.5, 0.90,
           Math.max(10, view.cssH * 0.015), 'rgba(232,226,214,0.35)');
}

/**
 * THE SKIP, on the fail card: a small second button beside the banner. TRY
 * AGAIN stays the default — the banner still says "tap to try again" and the
 * whole card still does it — so the skip is the quiet option, never the loud
 * one. It sits on the banner's side of the screen, towards the middle, so it
 * never covers the replay of the death it is offering a way past.
 */
function drawSkip(ctx, g, bannerY) {
  skipBtn = null;
  const offer = skipOffer(g);
  if (!offer && !g.skipping) return;
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  const bannerH = Math.max(64, view.cssH * 0.13);
  // 44 css px is the accepted floor for a finger.
  const h = Math.max(44, view.cssH * 0.058);
  const w = Math.min(view.cssW * 0.78, Math.max(220, h * 5.6));
  const cy = bannerY < 0.5
    ? view.cssH * bannerY + bannerH / 2 + h * 0.75
    : view.cssH * bannerY - bannerH / 2 - h * 0.75;
  const x = (view.cssW - w) / 2;
  skipBtn = { x, y: cy - h / 2, w, h };
  ctx.fillStyle = 'rgba(42,38,34,0.80)';
  ctx.fillRect(x, cy - h / 2, w, h);
  ctx.strokeStyle = 'rgba(232,226,214,0.40)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, cy - h / 2, w, h);
  const label = g.skipping ? 'one moment…'
    : offer.via === 'token' ? `SKIP THIS ONE · use a token (${offer.tokens} held)`
    : 'SKIP THIS ONE · watch an ad';
  drawText(ctx, label, 0.5, cy / view.cssH, Math.max(12, view.cssH * 0.019),
           'rgba(232,226,214,0.85)', 'center', (w / view.cssW) * 0.9);
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
    case 'overlaps-dog': return 'NOT THROUGH THE DOG';
    case 'overlaps-goal': return 'NOT OVER THE EXIT';
    default: return 'TRY AGAIN';
  }
}

// Test hook — lets Playwright drive real strokes through the real pipeline.
// `boardBox` is exposed as a GETTER, and it is the live hit regions the
// renderer actually produced this frame — not a recomputation.
//
// The board gate used to `import('/js/render/levelselect.js')` and call
// layout() itself. Over http that fetches a SECOND copy of the module with its
// own `view` instance, which no one ever resizes, so it laid the board out for
// a 0x0 viewport and clicked empty space. The test reported the board broken
// while the board was fine — the same input-vs-rendering disagreement the board
// was written to catch, this time between the test and the game.
globalThis.__byc = {
  game, view, PHASE, retry, nextLevel, goToLevel, openSelect, closeSelect, LEVELS, reducedMotion,
  skip, skipOffer,
  get skipBtn() { return skipBtn; },
  get soundBtn() { return soundBtn; },
  // The daily pool is not in LEVELS, so films and gates reach it through these.
  POOL, loadLevel, startDaily, asDaily,
  get boardBox() { return boardBox; },
  // The RUNNING audio module, for the same reason boardBox is here. The
  // certification gate used to `import('/js/audio.js')` and read the state off
  // that, which over http is a second copy with no AudioContext in it — so it
  // reported "no context" while the real one was correctly suspended, and the
  // one platform constraint that is genuinely non-negotiable looked broken.
  audio,
};

requestAnimationFrame(frame);
