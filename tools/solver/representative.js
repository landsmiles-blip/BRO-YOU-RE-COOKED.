// REPRESENTATIVE SOLUTIONS — the stroke the filmstrip films, and the strongest
// solvability claim this project makes.
//
// WHY THIS EXISTS
//
// The filmstrip drew one hand-authored stroke per level, and I then read those
// images as evidence the levels worked. That is backwards twice over:
//
//   1. Most hand-picked strokes LOSE. A filmstrip of a loss is a picture of a
//      legitimate game state, and it looks identical to a picture of a broken
//      level. I read a losing A9 stroke as a dead level and was about to
//      "fix" a level that was fine.
//   2. `solvable: true` out of the sweep means SOME idealised 4-point polyline
//      wins. It does not mean a person can win. A solution only reachable by a
//      stroke drawn to the pixel is not a solution.
//
// So: sweep for winners, then re-run each winner as a HAND-DRAWN stroke under
// several independent tremors. A stroke that still wins every time is one a
// real hand can hit. Among those, take the median-length one — the typical
// solution, not the most exotic or the most miserly.
//
// A level with NO jitter-robust winner is a design failure even when the sweep
// says solvable, and this reports it as one.
//
//   node tools/solver/representative.js          # all levels -> js/solutions.js
//   node tools/solver/representative.js a9-chute # just one, printed

import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { LEVELS } from '../../js/levels.js';
import { OUTCOME } from '../../js/sim.js';
import { runStroke, samplingRegion } from './solve.js';
import { sweep } from './families.js';
import { handDrawn } from '../test/lib/run-level.js';

/**
 * Independent tremors. A winner must survive ALL of them to be representative.
 *
 * `undulations` varies too, not just amplitude: the first version changed only
 * spacing and waver, so all three tremors put their bends in the SAME PLACES
 * and a stroke could pass three highly correlated tests. `quantize` models the
 * one distortion every real device applies and no simulation does — a pointer
 * reports integer screen pixels, which at the phone scale is ~1.8 world units
 * of rounding on every point.
 */
const TREMORS = [
  { spacing: 8,  waver: 5.5, undulations: 2.3, quantize: 0 },
  { spacing: 7,  waver: 7.0, undulations: 1.4, quantize: 1.8 },
  { spacing: 10, waver: 4.5, undulations: 3.1, quantize: 1.8 },
];

/** Pointer events arrive on a pixel grid. Round to it. */
function quantized(points, step) {
  if (!step) return points;
  return points.map((p) => ({ x: Math.round(p.x / step) * step, y: Math.round(p.y / step) * step }));
}

const pathLength = (p) =>
  p.reduce((a, _, i) => (i ? a + Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y) : 0), 0);

export function representativeFor(level) {
  const region = samplingRegion(level);
  const winners = [];

  for (const cand of sweep(region, 1, level.static)) {
    const r = runStroke(level, cand.points);
    if (r.outcome !== OUTCOME.SUCCESS) continue;
    winners.push({ family: cand.family, points: cand.points, length: pathLength(cand.points) });
  }

  // Now the part that matters: does it survive a hand?
  const robust = [];
  for (const w of winners) {
    let parts = 0, anchors = 0;
    const survived = TREMORS.every((t) => {
      const pts = quantized(handDrawn(w.points, t.spacing, t.waver, t.undulations), t.quantize);
      const r = runStroke(level, pts);
      parts = Math.max(parts, r.parts ?? 0);
      anchors = Math.max(anchors, r.anchors ?? 0);
      return r.outcome === OUTCOME.SUCCESS;
    });
    // A stroke that collapses to a rigid box proves nothing about stability,
    // so it cannot represent the level either.
    if (survived && parts >= 5) robust.push({ ...w, parts, anchors });
  }

  // PREFER AN ANCHORED SOLUTION, and this is not a stylistic choice.
  //
  // An anchored stroke becomes static: it stays exactly where it was drawn, so
  // the level plays the same way every time. An UNANCHORED one falls, tumbles
  // and settles, and where it settles is chaotic — a change of half a pixel in
  // one input point changes the outcome.
  //
  // A3 is why this rule exists. Its representative was an unanchored arc that
  // fell to the ground and happened to settle into a usable hump. It passed
  // every headless tremor and then LOST in the browser, where pointer events
  // land on a pixel grid: the arc settled differently and jammed Milo against
  // it a body's width from the goal. A solution a player cannot reproduce is
  // not a solution, and the game's own rules already say so — anchoring is the
  // mechanic the whole level ladder teaches.
  const anchored = robust.filter((r) => r.anchors > 0);
  const pool = anchored.length ? anchored : robust;
  pool.sort((a, b) => a.length - b.length);
  const pick = pool[Math.floor(pool.length / 2)] ?? null;

  return {
    id: level.id,
    winners: winners.length,
    robust: robust.length,
    anchoredRobust: robust.filter((r) => r.anchors > 0).length,
    // Share of idealised winners a shaky hand can actually land. Low means the
    // level reads as solvable and plays as unfair.
    handRate: winners.length ? +(robust.length / winners.length).toFixed(3) : 0,
    solution: pick && {
      family: pick.family,
      length: Math.round(pick.length),
      parts: pick.parts,
      anchors: pick.anchors,
      points: pick.points.map((p) => ({ x: +p.x.toFixed(1), y: +p.y.toFixed(1) })),
    },
  };
}

// ── CLI ───────────────────────────────────────────────────────────────────
//
// Guarded, because this module EXPORTS representativeFor() and the generator
// imports it. Without the guard, importing one function would kick off a
// fourteen-level sweep as a side effect of the import — minutes of work nobody
// asked for, triggered by a line that looks like it only names a function.
const isEntryPoint = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isEntryPoint) {
  const only = process.argv.slice(2).find((a) => !a.startsWith('--'));
  const targets = only ? LEVELS.filter((l) => l.id === only) : LEVELS;
  const out = {};
  let failures = 0;

  for (const level of targets) {
    const r = representativeFor(level);
    out[r.id] = r;
    const ok = !!r.solution;
    if (!ok) failures++;
    console.log(
      `${r.id.padEnd(12)} winners=${String(r.winners).padStart(4)} ` +
      `hand-robust=${String(r.robust).padStart(4)} (${(r.handRate * 100).toFixed(1)}%) ` +
      (ok ? `-> ${r.solution.family} ${r.solution.length}u, ${r.solution.parts} parts, ` +
            `${r.solution.anchors} anchors${r.solution.anchors ? '' : '  <-- UNANCHORED, chaotic'}`
          : '-> NO HAND-ROBUST SOLUTION'),
    );
  }

  {
    // CARRY OVER WHAT THIS RUN DID NOT MEASURE, the same way tools/solver does.
    //
    // This used to be `if (!only)`, so naming a level printed a full success
    // line and then wrote NOTHING. Two levels sat there looking certified —
    // "hand-robust= 551 (59.5%)" and all — while js/solutions.js still held 14
    // entries and knew nothing about either. Caught only by counting the ids in
    // the file against LEVELS, which is not a thing anyone would think to do
    // after a command that just told them it succeeded.
    let merged = out;
    if (only) {
      try {
        const prev = (await import('../../js/solutions.js')).SOLUTIONS;
        merged = { ...prev, ...out };
      } catch { /* no previous file — the full run is the first one */ }
    }

    // A level that no longer exists must not leave its certified solution
    // behind — the filmstrip reads this file to decide what to film, and a
    // stale entry means it keeps trying to film a level that is gone. Found by
    // using the generator: promoting a candidate to try it, then removing it.
    for (const id of Object.keys(merged)) if (!LEVELS.some((l) => l.id === id)) delete merged[id];
    const carried = Object.keys(merged).length - Object.keys(out).length;

    const body =
      '// GENERATED by tools/solver/representative.js — do not edit by hand.\n' +
      '//\n' +
      '// One stroke per level that wins AND keeps winning when drawn by a shaky\n' +
      '// hand. This is what the filmstrip films, so the filmstrips show the game\n' +
      '// being WON rather than an arbitrary stroke that mostly loses.\n\n' +
      'export const SOLUTIONS = ' + JSON.stringify(merged, null, 2) + ';\n';
    writeFileSync(new URL('../../js/solutions.js', import.meta.url), body);
    console.log(`\n→ js/solutions.js — ${Object.keys(out).length} measured, ${carried} carried over`);
  }

  if (failures) { console.log(`\n${failures} level(s) with no hand-robust solution.`); process.exit(1); }
}
