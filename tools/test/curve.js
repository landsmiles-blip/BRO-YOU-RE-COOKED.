// THE DIFFICULTY CURVE GATE — the order of LEVELS, held to measured numbers.
//
// Every level already carries two measurements: `solutionBreadth` (the share
// of plausible strokes that win, js/solverData.js) and `handRate` (the share of
// those winners a shaky hand still lands, js/solutions.js). Their product is the
// chance that one plausible, hand-drawn stroke wins, so its inverse is TRIES:
// how many such strokes a player would expect to need. A real player aims and
// needs far fewer — tries is a RELATIVE measure, which is all an ordering needs.
// It measures search and execution, not comprehension; whether a stranger knows
// what a level wants is still a playtest question.
//
// THE ORDER WAS NEVER MEASURED, and it showed. Level 4 CATCH took 56 tries
// against ~11 for the levels around it — a wall in the first minute, where a
// new player decides whether to stay. Air was introduced by UPDRAFT (39) while
// DUCT (6) waited three levels behind it. Four rules, each a principle rather
// than a fitted number, catch all of that:
//
//   1. GENTLE START   levels 1-3 sit in the easiest band.
//   2. GENTLE INTRO   the first level that uses a noun is the easiest level that
//                     uses it — a mechanic is met before it is tested.
//   3. NO WALLS       no level is more than 3x the median of the four before it.
//                     A drop is fine (a new noun, a breather); a cliff is not.
//   4. RISING WAVES   each third of the game is harder than the one before.
//
// Nouns are detected from the level data, not declared, so a new level is held
// to rule 2 the moment it uses one.
//
//   node --import ./tools/node-matter.js tools/test/curve.js     prints the curve

import { LEVELS } from '../../js/levels.js';
import { SOLVER } from '../../js/solverData.js';
import { SOLUTIONS } from '../../js/solutions.js';

const START_MAX = 15;      // rule 1: tries for each of the first three levels
const INTRO_SLACK = 1.25;  // rule 2: measurement noise between near-equal levels
const WALL = 3;            // rule 3: x the median of the previous four

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
  if (l.objects.some((o) => o.vx || o.vy)) n.push('moving');
  return n;
}

export function triesOf(id) {
  const s = SOLVER[id], h = SOLUTIONS[id];
  if (!s || !h || !(s.solutionBreadth > 0) || !(h.handRate > 0)) return null;
  return 1 / (s.solutionBreadth * h.handRate);
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

console.log('\nDIFFICULTY CURVE — tries = 1 / (breadth x hand rate)\n');
const T = LEVELS.map((l) => triesOf(l.id));
const missing = LEVELS.filter((_, i) => T[i] == null).map((l) => l.id);
check('every level has measured breadth and hand rate', missing.length === 0, missing.join(', '));
if (missing.length) process.exit(1);

const seen = new Set();
LEVELS.forEach((l, i) => {
  const intro = nounsOf(l).filter((n) => !seen.has(n));
  intro.forEach((n) => seen.add(n));
  const bar = '#'.repeat(Math.max(1, Math.round(Math.log2(T[i]) * 6)));
  console.log(`  ${String(i + 1).padStart(2)}  ${l.verb.padEnd(10)} ${T[i].toFixed(0).padStart(4)}  ${bar.padEnd(42)}` +
    (intro.length ? `new: ${intro.join(', ')}` : ''));
});
console.log('');

// 1. gentle start
const start = T.slice(0, 3);
check(`levels 1-3 are in the easiest band (<= ${START_MAX} tries)`, start.every((t) => t <= START_MAX),
  start.map((t) => t.toFixed(0)).join(', '));

// 2. gentle intro, for every noun the campaign uses
const bad2 = [];
const nouns = [...new Set(LEVELS.flatMap(nounsOf))];
for (const n of nouns) {
  const idx = LEVELS.map((l, i) => (nounsOf(l).includes(n) ? i : -1)).filter((i) => i >= 0);
  const first = idx[0];
  const easiestLater = Math.min(...idx.slice(1).map((i) => T[i]));
  if (idx.length > 1 && T[first] > easiestLater * INTRO_SLACK) {
    bad2.push(`${n}: introduced by ${LEVELS[first].verb} (${T[first].toFixed(0)}) but ` +
      `${LEVELS[idx.find((i) => T[i] === easiestLater)].verb} (${easiestLater.toFixed(0)}) comes later`);
  }
}
check('every noun is introduced by the easiest level that uses it', bad2.length === 0, bad2.join('; '));

// 3. no walls
const bad3 = [];
for (let i = 1; i < T.length; i++) {
  const base = median(T.slice(Math.max(0, i - 4), i));
  if (T[i] > base * WALL) bad3.push(`${i + 1} ${LEVELS[i].verb} ${T[i].toFixed(0)} vs ${base.toFixed(0)}`);
}
check(`no level is more than ${WALL}x the four before it`, bad3.length === 0, bad3.join('; '));

// 4. rising waves
const third = Math.floor(T.length / 3);
const parts = [T.slice(0, third), T.slice(third, T.length - third), T.slice(T.length - third)].map(median);
check('each third of the game is harder than the one before',
  parts[0] < parts[1] && parts[1] < parts[2], parts.map((m) => m.toFixed(0)).join(' -> '));

console.log(failed === 0 ? '\nCURVE: PASS\n' : `\nCURVE: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
