// THE DIFFICULTY CURVE GATE — every level held to its measured target.
//
// Every level carries two measurements: `solutionBreadth` (the share of
// plausible strokes that win, js/solverData.js) and `handRate` (the share of
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
// DUCT (6) waited three levels behind it. Five rules now hold the order:
//
//   1. GENTLE START   levels 1-3 sit in the easiest band.
//   2. GENTLE INTRO   the first level that uses a noun is the easiest level that
//                     uses it — a mechanic is met before it is tested.
//   3. NO WALLS       no level is more than 3x the median of the four before it.
//                     A drop is fine (a new noun, a breather); a cliff is not.
//   4. RISING WAVES   each third of the game is harder than the one before.
//   5. ON TARGET      every level measures inside the band of its chapter slot,
//                     from the difficulty equation in tools/lib/difficulty.js.
//
// It also prints all seventy slots, built or not, with each one's target: the
// list of what is left to build, and how hard each one has to be.
//
//   npm run curve

import { LEVELS, CHAPTERS, SLOT_ROLES } from '../../js/levels.js';
import { band, nounsOf, triesOf, noiseOf } from '../lib/difficulty.js';

const START_MAX = 15;      // rule 1: tries for each of the first three levels
const INTRO_SLACK = 1.25;  // rule 2: measurement noise between near-equal levels
const WALL = 3;            // rule 3: x the median of the previous four

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
const tries = new Map(LEVELS.map((l, i) => [l.id, T[i]]));

// The seventy slots, in play order. A built slot shows its measurement against
// its band; an empty one shows what the level that fills it has to measure.
const seen = new Set();
const offTarget = [];
let n = 0, built = 0;
CHAPTERS.forEach((ch, c) => {
  console.log(`  CHAPTER ${c + 1} — ${ch.name}`);
  ch.slots.forEach((l, k) => {
    n++;
    const b = band(c, k);
    const range = `${b.lo ? b.lo.toFixed(0) : '0'}-${b.hi.toFixed(0)}`.padStart(7);
    const head = `   ${String(n).padStart(2)}  ${SLOT_ROLES[k].padEnd(8)} target ${b.t.toFixed(0).padStart(3)} [${range}]`;
    if (!l) { console.log(`${head}   ·· to build ··`); return; }
    built++;
    const t = tries.get(l.id);
    const inBand = t >= b.lo && t <= b.hi;
    if (!inBand) offTarget.push(`${l.verb} ${t.toFixed(0)} in slot ${n} [${range.trim()}]`);
    const intro = nounsOf(l).filter((x) => !seen.has(x));
    intro.forEach((x) => seen.add(x));
    // ± is how far this number can be trusted (difficulty.js noiseOf). Where
    // it is wider than the band, the level's place on the curve is a guess.
    const noise = noiseOf(l.id);
    const pm = `±${Math.round(noise * 100)}%`.padStart(5);
    console.log(`${head}   ${l.verb.padEnd(10)} ${t.toFixed(0).padStart(3)} ${pm}${inBand ? '' : '  OFF TARGET'}` +
      (noise > Math.log(1.5) ? '  noisy' : '') + (intro.length ? `   new: ${intro.join(', ')}` : ''));
  });
});
console.log(`\n  ${built} of ${n} slots built, ${n - built} to build\n`);

// 1. gentle start
const start = T.slice(0, 3);
check(`levels 1-3 are in the easiest band (<= ${START_MAX} tries)`, start.every((t) => t <= START_MAX),
  start.map((t) => t.toFixed(0)).join(', '));

// 2. gentle intro, for every noun the campaign uses
const bad2 = [];
const nouns = [...new Set(LEVELS.flatMap(nounsOf))];
for (const x of nouns) {
  const idx = LEVELS.map((l, i) => (nounsOf(l).includes(x) ? i : -1)).filter((i) => i >= 0);
  const first = idx[0];
  const easiestLater = Math.min(...idx.slice(1).map((i) => T[i]));
  if (idx.length > 1 && T[first] > easiestLater * INTRO_SLACK) {
    bad2.push(`${x}: introduced by ${LEVELS[first].verb} (${T[first].toFixed(0)}) but ` +
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

// 5. on target
check('every level measures inside its slot\'s band', offTarget.length === 0, offTarget.join('; '));

console.log(failed === 0 ? '\nCURVE: PASS\n' : `\nCURVE: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
