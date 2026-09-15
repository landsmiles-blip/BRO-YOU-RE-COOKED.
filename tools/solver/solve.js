// The solver harness — Bible §3.8.
//
// Playing a level yourself proves only that YOU can solve it, and you designed
// it. With emergent physics and encouraged multiple solutions, three questions
// have no answer without this:
//
//   Is it solvable at all?
//   Is it solvable in a way a human hand could actually hit?
//   Where do the star thresholds come from, before any player has ever played?
//
// The source documents specified `twoStarLength: 620` and `threeStarLength:
// 420` as if they were data. They were invented. This measures them.
//
// It is also the regression suite: retune gravity and re-run everything in
// under a minute to see exactly which levels broke. Without that, every physics
// tune silently risks every level ever built, so the team stops tuning - which
// is the real reason these projects die at 70% done.

import { buildSim, stepSim, commitStroke, destroySim, OUTCOME } from '../../js/sim.js';
import { isHazardous } from '../../js/hazards.js';
import { getVelocity } from '../../js/physics/adapter.js';
import { FREEZE_AT, RUN_TIMEOUT, PHYSICS_DT, SAFE_BOX, MILO, CLOSE_CALL } from '../../js/constants.js';
import { sweep, jitter, rng } from './families.js';
import { handDrawn, playLevel } from '../test/lib/run-level.js';

const MAX_STEPS = Math.ceil(RUN_TIMEOUT / PHYSICS_DT) + 400;

/** Where a player plausibly draws: around the action, not the whole world. */
export function samplingRegion(level) {
  let x0 = level.milo.start.x, x1 = x0, y0 = level.milo.start.y, y1 = y0;
  const grow = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };

  grow(level.goal.x, level.goal.y - level.goal.h);
  for (const o of level.objects) grow(o.x, o.y);
  for (const s of level.static) { grow(s.x, s.y); grow(s.x + s.w, s.y); }
  for (const z of level.zones ?? []) { grow(z.x, z.y); grow(z.x + z.w, z.y); }

  const pad = 90;
  x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
  x1 = Math.min(SAFE_BOX.w, x1 + pad); y1 = Math.min(SAFE_BOX.h, y1 + pad);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** Play one candidate stroke to completion. `trackJitter` costs time; opt in. */
export function runStroke(level, points, trackJitter = false) {
  const sim = buildSim(level);
  const freezeAt = level.freezeAt ?? FREEZE_AT;
  let committed = null;
  let jit = 0, prev = null;

  for (let i = 0; i < MAX_STEPS; i++) {
    if (points && !committed && sim.simTime >= freezeAt) {
      committed = commitStroke(sim, points);
      if (!committed.ok) { destroySim(sim); return { rejected: true, reason: committed.reason }; }
      if (trackJitter) prev = partPos(sim.stroke);
    }
    const o = stepSim(sim);
    if (prev) {
      const now = partPos(sim.stroke);
      for (let k = 0; k < now.length; k++) jit += Math.hypot(now[k].x - prev[k].x, now[k].y - prev[k].y);
      prev = now;
    }
    if (o !== OUTCOME.RUNNING) {
      const res = {
        outcome: o, t: sim.simTime, length: committed?.length ?? 0,
        anchors: committed?.anchors ?? 0, jitter: jit,
        parts: sim.stroke ? (sim.stroke.parts.length > 1 ? sim.stroke.parts.length - 1 : 1) : 0,
      };
      destroySim(sim);
      return res;
    }
  }
  destroySim(sim);
  return { outcome: 'never-ended', t: RUN_TIMEOUT, length: committed?.length ?? 0, jitter: jit };
}

function partPos(body) {
  const parts = body.parts.length > 1 ? body.parts.slice(1) : [body];
  return parts.map((p) => ({ x: p.position.x, y: p.position.y }));
}

/**
 * Worst instability across a sample of WINNING strokes, redrawn hand-shaped.
 *
 * Stability is checked here rather than across the whole sweep for two
 * reasons: it is about how a stroke is BUILT, not which shape it is, and
 * densifying 1,500 strokes into 25-part compound bodies would make the sweep
 * far too slow to run on every physics change — which would mean it stopped
 * being run.
 */
export function worstJitter(level, winners, sampleCount = 8) {
  if (!winners.length) return 0;
  const sorted = [...winners].sort((a, b) => a.length - b.length);
  let worst = 0;
  for (let i = 0; i < sampleCount; i++) {
    const w = sorted[Math.min(sorted.length - 1, Math.round((i / Math.max(1, sampleCount - 1)) * (sorted.length - 1)))];
    const r = playLevel(level, handDrawn(w.points));
    if (!r.committed || r.committed.ok) worst = Math.max(worst, r.strokeWobble ?? 0);
  }
  return Math.round(worst * 10) / 10;
}

const percentile = (sorted, p) => {
  if (!sorted.length) return null;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.round((p / 100) * (sorted.length - 1))));
  return Math.round(sorted[i]);
};

/**
 * How far can a winning stroke be nudged and still win?
 *
 * This is the thumb test made machine-checkable. The puzzle is about 6cm wide
 * in a player's hand with their finger covering it, so a level that demands
 * better than ±25u is a BROKEN level, not a hard one.
 */
function robustnessOf(level, winner, trials = 10) {
  const rand = rng(424242);
  let best = 0;
  for (const amount of [10, 20, 30, 45, 65]) {
    let wins = 0, valid = 0;
    for (let i = 0; i < trials; i++) {
      const r = runStroke(level, jitter(winner, amount, rand));
      if (r.rejected) continue;
      valid++;
      if (r.outcome === OUTCOME.SUCCESS) wins++;
    }
    if (valid === 0 || wins / valid < 0.7) break;
    best = amount;
  }
  return best;
}

/**
 * The precision floor is the robustness of the MOST FORGIVING solution, not of
 * the shortest one.
 *
 * The first version tested the shortest winner, which is exactly backwards: the
 * shortest win is by definition the most marginal stroke in the space, so it
 * reported 0 for levels that are in fact comfortable to play. The question a
 * player cares about is "can I reliably hit SOME solution", so sample winners
 * across the length distribution and take the best.
 */
export function precisionFloor(level, winners, sampleCount = 6) {
  if (!winners.length) return 0;
  const sorted = [...winners].sort((a, b) => a.length - b.length);
  const picks = [];
  for (let i = 0; i < sampleCount; i++) {
    picks.push(sorted[Math.min(sorted.length - 1, Math.round((i / Math.max(1, sampleCount - 1)) * (sorted.length - 1)))]);
  }
  let best = 0;
  for (const p of new Set(picks)) best = Math.max(best, robustnessOf(level, p.points));
  return best;
}

/** Full analysis of one level. */
export function analyse(level, { density = 1, onProgress = null } = {}) {
  const region = samplingRegion(level);
  const winners = [];
  const byFamily = new Map();
  let total = 0, rejected = 0, killed = 0, stuck = 0, timeout = 0, fell = 0;

  for (const cand of sweep(region, density, level.static)) {
    total++;
    const r = runStroke(level, cand.points);
    if (r.rejected) { rejected++; continue; }
    if (r.outcome === OUTCOME.SUCCESS) {
      winners.push({ ...cand, length: r.length, t: r.t, anchors: r.anchors });
      byFamily.set(cand.family, (byFamily.get(cand.family) ?? 0) + 1);
    } else if (r.outcome === OUTCOME.KILLED) killed++;
    else if (r.outcome === OUTCOME.STUCK) stuck++;
    else if (r.outcome === OUTCOME.TIMEOUT) timeout++;
    else if (r.outcome === OUTCOME.FELL) fell++;
    if (onProgress && total % 200 === 0) onProgress(total);
  }

  const plausible = total - rejected;
  const lengths = winners.map((w) => w.length).sort((a, b) => a - b);
  const shortest = winners.length
    ? winners.reduce((a, b) => (a.length <= b.length ? a : b))
    : null;

  return {
    levelId: level.id,
    region,
    total, plausible, rejected,
    wins: winners.length,
    solvable: winners.length > 0,
    // % of plausible human-shaped strokes that win. <2% is "too hard" by the
    // bible's own definition; >40% is "too easy".
    solutionBreadth: plausible ? winners.length / plausible : 0,
    distinctFamilies: byFamily.size,
    familyBreakdown: Object.fromEntries(byFamily),
    outcomes: { killed, stuck, timeout, fell },
    // Measured, never typed by hand.
    twoStarLength: percentile(lengths, 60),
    threeStarLength: percentile(lengths, 20),
    shortestWin: shortest ? Math.round(shortest.length) : null,
    shortestWinFamily: shortest?.family ?? null,
    precisionFloor: precisionFloor(level, winners),
    // The gate that was missing when an unplayable build shipped.
    worstJitter: Math.round(worstJitter(level, winners)),
    // How close the danger gets when you WIN. See tension() above.
    tension: tension(level, winners),
  };
}


/**
 * TENSION — how close a fast hazard actually gets to Milo on a WINNING run.
 *
 * Every other gate here asks whether a level is FAIR. None of them ask whether
 * it is EXCITING, and measuring it exposed why the game played "too basic":
 * across the twelve shipping levels the hazard was neutralised between 120 and
 * 400 units away on a winning run, and on four of them nothing fast ever came
 * near him at all. Milo is 72 units tall. That is up to five body-heights of
 * safety, which is a level won by making the danger boring.
 *
 * Reported in UNITS — smaller is tenser. Infinity means nothing dangerous ever
 * moved near him, which is the flattest a level can be.
 */
export function tension(level, winners, sampleCount = 6) {
  if (!winners.length) return Infinity;
  const sorted = [...winners].sort((a, b) => a.length - b.length);
  const hw = MILO.width / 2, hh = MILO.height / 2;

  // SAMPLE THE MIDDLE BAND, and take the MEDIAN — not the minimum over every
  // winner. Almost any level has some extreme winner that cuts it fine, so
  // min-over-all reported ~0u for every level and distinguished nothing. The
  // question is not "how tense CAN this level be", it is "how tense IS it when
  // somebody plays it normally", which is the typical solve.
  const lo = Math.floor(sorted.length * 0.35), hi = Math.ceil(sorted.length * 0.65);
  const band = sorted.slice(lo, Math.max(hi, lo + 1));
  const gaps = [];

  for (let i = 0; i < sampleCount; i++) {
    const w = band[Math.min(band.length - 1, Math.round((i / Math.max(1, sampleCount - 1)) * (band.length - 1)))];
    let best = Infinity;
    const sim = buildSim(level);
    const freezeAt = level.freezeAt ?? FREEZE_AT;
    let committed = false;
    for (let n = 0; n < MAX_STEPS; n++) {
      if (!committed && sim.simTime >= freezeAt) {
        if (!commitStroke(sim, w.points).ok) break;
        committed = true;
      }
      const o = stepSim(sim);
      const b = sim.milo.body;
      for (const [, ob] of sim.objects) {
        if (!isHazardous(ob.spec.lethal)) continue;
        const v = getVelocity(ob.body);
        if (Math.hypot(v.x, v.y) < CLOSE_CALL.minSpeed) continue;
        const p = ob.body.position;
        const cx = Math.max(b.position.x - hw, Math.min(p.x, b.position.x + hw));
        const cy = Math.max(b.position.y - hh, Math.min(p.y, b.position.y + hh));
        const reach = ob.spec.radius ?? Math.max(ob.spec.w ?? 0, ob.spec.h ?? 0) / 2;
        best = Math.min(best, Math.hypot(p.x - cx, p.y - cy) - reach);
      }
      if (o !== OUTCOME.RUNNING) break;
    }
    destroySim(sim);
    gaps.push(best);
  }
  gaps.sort((a, b) => a - b);
  const med = gaps[Math.floor(gaps.length / 2)];
  return med === Infinity ? Infinity : Math.round(med);
}

/** The gates a level must clear to ship. */
export function gradeLevel(a) {
  const issues = [];
  // SOFT, deliberately. A flat level is not broken, it is just safe — and four
  // of the shipping twelve are flat. Blocking on it would hold levels that work.
  // It is a WARN so the number is in front of whoever is designing the next one.
  if (a.solvable && a.tension === Infinity) {
    issues.push({ hard: false, msg: 'FLAT — nothing dangerous ever moves near him on a win' });
  } else if (a.solvable && a.tension > 140) {
    issues.push({ hard: false, msg: `safe — the danger stays ${a.tension}u away when you win (tense is <90u)` });
  }
  if (!a.solvable) issues.push({ hard: true, msg: 'UNSOLVABLE — no stroke in the plausible space wins' });
  if (a.solvable && a.solutionBreadth < 0.02) {
    issues.push({ hard: true, msg: `too hard — only ${(a.solutionBreadth * 100).toFixed(1)}% of plausible strokes win (floor 2%)` });
  }
  if (a.solutionBreadth > 0.40) {
    issues.push({ hard: false, msg: `too easy — ${(a.solutionBreadth * 100).toFixed(1)}% of plausible strokes win (ceiling 40%)` });
  }
  if (a.solvable && a.precisionFloor < 25) {
    issues.push({ hard: true, msg: `precision floor ${a.precisionFloor}u — below the 25u thumb limit` });
  }
  if (a.worstJitter > 8) {
    issues.push({ hard: true, msg: `UNSTABLE — hand-drawn solution oscillates (path/net = ${a.worstJitter})` });
  }
  return issues;
}

export { OUTCOME };
