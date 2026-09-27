// THE DAILY GATE.
//
// A daily challenge is the one feature in this game where a bug is invisible
// until a player has already been let down: a repeat two days running, a streak
// that silently resets, or — worst — a budget nothing can win inside, which
// would look exactly like a level that is simply too hard. None of those show
// up in a filmstrip, so they get asserted here.
//
// Pure logic, no physics and no browser, so it runs in the fast suite.

import { dayNumber, dailyFor, dailyLevel } from '../../js/daily.js';
import { createProgress, recordDaily, dailyDone, serialise, deserialise } from '../../js/progress.js';
import { LEVELS } from '../../js/levels.js';
import { SOLVER } from '../../js/solverData.js';

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

console.log('\nDAILY');

// ── determinism ───────────────────────────────────────────────────────────
const D = 20400;
check('the same day gives the same level',
  dailyFor(D).level.id === dailyFor(D).level.id && dailyFor(D).level.id === dailyFor(D).level.id);
check('the same day gives the same budget', dailyFor(D).ink === dailyFor(D).ink);
check('dayNumber is UTC, so a timezone cannot shift the challenge',
  dayNumber(new Date('2026-09-27T00:30:00Z')) === dayNumber(new Date('2026-09-27T23:30:00Z')));
check('a different day gives a different challenge',
  dailyFor(D).level.id !== dailyFor(D + 1).level.id);

// ── rotation, over a long run rather than a lucky window ──────────────────
const N = 1500;
let backToBack = 0, minGap = Infinity;
const lastSeen = new Map();
for (let i = 0; i < N; i++) {
  const id = dailyFor(D + i).level.id;
  if (i > 0 && id === dailyFor(D + i - 1).level.id) backToBack++;
  if (lastSeen.has(id)) minGap = Math.min(minGap, i - lastSeen.get(id));
  lastSeen.set(id, i);
}
check('never the same level two days running', backToBack === 0, `${backToBack} over ${N} days`);
check('no level comes back inside a week', minGap >= 7, `closest repeat ${minGap} days apart`);
check('every level is reachable', lastSeen.size === LEVELS.length, `${lastSeen.size}/${LEVELS.length}`);

// ── the budget must be a challenge, and must be beatable ──────────────────
//
// Beatable is the one that matters. The budget is the measured three-star
// length, a percentile of ACTUAL winning strokes, so a winner provably fits
// inside it — but if solverData ever goes stale against levels.js this is what
// catches it, and the failure it prevents is a player grinding at something
// impossible that looks merely hard.
let unwinnable = 0, notTighter = 0;
for (let i = 0; i < 400; i++) {
  const d = dailyFor(D + i);
  const s = SOLVER[d.level.id];
  if (!s || d.ink < s.shortestWin) unwinnable++;
  if (d.ink >= d.level.drawing.maxLength) notTighter++;
}
check('every daily budget fits a known winning stroke', unwinnable === 0, `${unwinnable} bad`);
check('every daily budget is TIGHTER than the level ships with', notTighter === 0, `${notTighter} bad`);

// ── the level object handed to the game ───────────────────────────────────
const shipped = LEVELS.find((l) => l.id === dailyFor(D).level.id);
const before = shipped.drawing.maxLength;
const dl = dailyLevel(D);
check('dailyLevel applies the tighter budget', dl.drawing.maxLength === dailyFor(D).ink);
check('and does NOT mutate the shipped level', shipped.drawing.maxLength === before,
  `${before} -> ${shipped.drawing.maxLength}`);

// ── the streak ────────────────────────────────────────────────────────────
const p = createProgress();
check('a fresh save has no streak', p.streak === 0 && !dailyDone(p, D));
recordDaily(p, D);
check('one day gives a streak of 1', p.streak === 1 && dailyDone(p, D));
recordDaily(p, D + 1); recordDaily(p, D + 2);
check('consecutive days extend it', p.streak === 3, String(p.streak));
check('replaying the same day changes nothing',
  recordDaily(p, D + 2) === false && p.streak === 3);
recordDaily(p, D + 5);
check('a gap RESETS it to 1', p.streak === 1, String(p.streak));

// ── persistence, including the version 1 migration ────────────────────────
const round = deserialise(serialise(p));
check('the streak survives a save/load round trip',
  round.streak === p.streak && round.lastDailyDay === p.lastDailyDay);

const v1 = JSON.stringify({ v: 1, best: { [LEVELS[0].id]: 3 }, finishedAt: 7 });
const migrated = deserialise(v1);
check('a version 1 save MIGRATES rather than being discarded',
  migrated.best[LEVELS[0].id] === 3 && migrated.finishedAt === 7,
  `stars ${migrated.best[LEVELS[0].id]}`);
check('a version 1 save starts with no streak', migrated.streak === 0);

const corrupt = deserialise(JSON.stringify({ v: 2, best: {}, streak: 99999999, lastDailyDay: -4 }));
check('a nonsensical streak is dropped, not clamped',
  corrupt.streak === 0 && corrupt.lastDailyDay === 0,
  `streak ${corrupt.streak}, day ${corrupt.lastDailyDay}`);

console.log(failed === 0 ? '\nDAILY: PASS\n' : `\nDAILY: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
