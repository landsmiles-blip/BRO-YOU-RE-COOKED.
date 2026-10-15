// THE DIFFICULTY EQUATION — where every level's target comes from.
//
// DIFFICULTY IS MEASURED, NOT GUESSED. A level's difficulty is TRIES:
//
//     tries = 1 / (breadth x hand rate)
//
// breadth is the share of plausible strokes that win (js/solverData.js) and
// hand rate the share of those a shaky hand still lands (js/solutions.js), so
// tries is how many plausible hand-drawn strokes a player would expect to need.
// It is this game's version of the number the industry steers by — attempts per
// success, the inverse of the pass rate — and it is measured the way King
// predicts it before a level reaches players: with simulated players. Ours are
// the solver sweep and the hand model. It is RELATIVE: a person aims, and needs
// far fewer attempts than a random stroke would. Real players' data replaces
// it the day there is any; until then it is the best measurement there is.
//
// WHERE A LEVEL SHOULD SIT. The game is six chapters of ten. Slot k of chapter c
// (both counted from 0) has a target:
//
//     T(c, k) = T0 · G^c · S^p(k)
//
//   T0  the first level's target.
//   G   each chapter starts G times harder than the one before — the slow
//       exponential rise every successful level-based game climbs.
//   S   inside a chapter, the boss is S times its intro.
//   p   the SAWTOOTH, the same in every chapter (PROFILE below): an easy intro
//       that teaches the chapter's new thing alone, three levels developing it,
//       a SPIKE (the twist), a BREATHER, two more, a breather before the boss,
//       and the BOSS. Two hard levels in ten is the industry's measured norm of
//       about one hard level in five; a breather after every hard one is the
//       sawtooth every design guide recommends; and the first boss lands at
//       level 10, where King puts the first hard level of a Candy Crush game.
//
// T0, G and S ARE FITTED, NOT CHOSEN. They are the least-squares fit of this
// equation to the 21 levels that ship (tools/lib/fit-curve.py reproduces it),
// with each shipped level kept in its own chapter and the final boss held to
// 90–110, because the hardest shipped level measures 90. Every one of the 21
// sits inside its slot's band. Refit when real players' numbers exist: the
// simulated numbers are least accurate on the hardest levels, which is the
// published finding on simulated difficulty and the reason to recalibrate.
//
// THE BAND. A level fits its slot within a factor of 1.5 either way. An INTRO
// or a BREATHER may be as easy as it likes — an easy level is never a wall —
// but never more than 1.5x its target.

import { SLOT_ROLES } from '../../js/levels.js';
import { SOLVER } from '../../js/solverData.js';
import { SOLUTIONS } from '../../js/solutions.js';

export const T0 = 8.6;
export const G = 1.26;
export const S = 4.0;
export const PROFILE = [0, 0.20, 0.35, 0.50, 0.80, 0.30, 0.55, 0.70, 0.45, 1];
export const TOLERANCE = 1.5;

export function target(c, k) {
  return T0 * G ** c * S ** PROFILE[k];
}

/** The band a level must measure inside to take slot k of chapter c. */
export function band(c, k) {
  const t = target(c, k);
  const easyOk = SLOT_ROLES[k] === 'INTRO' || SLOT_ROLES[k] === 'BREATHER';
  return { t, lo: easyOk ? 0 : t / TOLERANCE, hi: t * TOLERANCE };
}

/** Measured tries for a level id, or null if it has not been measured. */
export function triesOf(id) {
  const s = SOLVER[id], h = SOLUTIONS[id];
  if (!s || !h || !(s.solutionBreadth > 0) || !(h.handRate > 0)) return null;
  return 1 / (s.solutionBreadth * h.handRate);
}

/**
 * The nouns a level uses, detected from its data rather than declared, so a
 * new level is held to the noun-introduction rule the moment it uses one.
 */
export function nounsOf(l) {
  const n = [];
  const zones = l.zones ?? [];
  if (l.objects.some((o) => o.type === 'switch')) n.push('plate');
  // Any moving air is AIR, whichever way it blows: A29's draught is purely
  // sideways (accel 0, ax 600), and an up/down test alone missed it entirely.
  // A downdraft is also its own noun — it presses things down, which is a
  // different promise from lifting them.
  if (zones.some((z) => z.kind === 'updraft')) n.push('air');
  if (zones.some((z) => z.kind === 'updraft' && (z.accel ?? -2600) > 0)) n.push('downdraft');
  if (l.objects.some((o) => o.lift)) n.push('balloon');
  if (l.static.some((s) => s.sharp)) n.push('thorns');
  if (l.static.some((s) => s.pivot)) n.push('pivot');
  if (l.static.some((s) => s.brittle)) n.push('brittle');
  if (l.static.some((s) => s.breakable)) n.push('breakable');
  if (l.objects.some((o) => o.type === 'tnt')) n.push('tnt');
  if (l.objects.some((o) => o.type === 'dog')) n.push('dog');
  if (l.objects.some((o) => o.type === 'hive')) n.push('bees');
  if (l.objects.some((o) => o.vx || o.vy)) n.push('moving');
  return n;
}
