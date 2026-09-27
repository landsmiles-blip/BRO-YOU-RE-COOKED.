// THE DAILY GATE.
//
// A daily challenge is the one feature in this game where a bug is invisible
// until a player has already been let down: a repeat two days running, a streak
// that silently resets, or — worst — a budget nothing can win inside, which
// would look exactly like a level that is simply too hard. None of those show
// up in a filmstrip, so they get asserted here.
//
// Pure logic, no physics and no browser, so it runs in the fast suite.

import { dayNumber, dailyFor, dailyLevel, DAILY, asDaily } from '../../js/daily.js';
import { createProgress, recordDaily, dailyDone, serialise, deserialise } from '../../js/progress.js';
import { LEVELS } from '../../js/levels.js';
import { POOL } from '../../js/dailyPool.js';
import { measured, starsFor } from '../../js/rating.js';
import { createGame, startDaily, loadLevel, nextLevel, closeSelect, PHASE } from '../../js/game.js';

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
check('every level in the deck is reachable', lastSeen.size === DAILY.length,
  `${lastSeen.size}/${DAILY.length}`);
check('the pool is dealt, not just baked', POOL.length > 0 && POOL.every((l) => lastSeen.has(l.id)),
  `${POOL.length} pool levels`);

// ── the mix: one campaign day in every three, exactly ─────────────────────
//
// One shuffle over both halves got the ratio right and the spread wrong — it
// went sixteen days running without a campaign level. Every aligned run of
// three days must hold exactly one.
const T0 = Math.ceil(D / 3) * 3;
let badThirds = 0;
for (let t = 0; t < 500; t++) {
  const campaignDays = [0, 1, 2].filter((r) => !POOL.includes(dailyFor(T0 + t * 3 + r).level)).length;
  if (campaignDays !== 1) badThirds++;
}
check('exactly one campaign level in every three days', badThirds === 0, `${badThirds} of 500 bad`);

// ── the budget must be a challenge, and must be beatable ──────────────────
//
// Beatable is the one that matters. The budget is the measured three-star
// length, a percentile of ACTUAL winning strokes, so a winner provably fits
// inside it — but if solverData ever goes stale against levels.js this is what
// catches it, and the failure it prevents is a player grinding at something
// impossible that looks merely hard.
let unwinnable = 0, notTighter = 0, notThree = 0;
for (let i = 0; i < 400; i++) {
  const d = dailyFor(D + i);
  const s = measured(d.level.id);
  if (!s || d.ink < s.shortestWin) unwinnable++;
  if (d.ink >= d.level.drawing.maxLength) notTighter++;
  // Clearing the daily at all is a three-star line, by construction — and a
  // pool level must be RATED that way too, not fall through to one star.
  if (starsFor(d.level.id, d.ink) !== 3) notThree++;
}
check('every daily budget fits a known winning stroke', unwinnable === 0, `${unwinnable} bad`);
check('every daily budget is TIGHTER than the level ships with', notTighter === 0, `${notTighter} bad`);
check('a win inside any daily budget rates three stars', notThree === 0, `${notThree} bad`);

// ── the level object handed to the game ───────────────────────────────────
const shipped = DAILY.find((l) => l.id === dailyFor(D).level.id);
const before = shipped.drawing.maxLength;
const dl = dailyLevel(D);
check('dailyLevel applies the tighter budget', dl.drawing.maxLength === dailyFor(D).ink);
check('and does NOT mutate the shipped level', shipped.drawing.maxLength === before,
  `${before} -> ${shipped.drawing.maxLength}`);

// ── where a daily goes when it is over ────────────────────────────────────
//
// A daily is not a step on the ladder. "Next" used to be levelIndex + 1, which
// sent a pool daily (index -1) to level 1, and put up the ENDING — "you
// finished the game" — after a daily that happened to be the last level.
const dayWhere = (pred) => {
  for (let i = 0; i < 2000; i++) if (pred(dailyFor(D + i))) return D + i;
  return null;
};
const poolDay = dayWhere((d) => POOL.includes(d.level));

const g = createGame(LEVELS[0]);
startDaily(g, poolDay);
check('a pool daily is not a campaign level', g.isDaily && g.levelIndex === -1, `index ${g.levelIndex}`);
check('and it plays at the daily budget', g.level.drawing.maxLength === dailyFor(poolDay).ink);
nextLevel(g);
check('a finished daily returns to the BOARD', g.phase === PHASE.SELECT && !g.isDaily, g.phase);
closeSelect(g);
check('and closing the board resumes the campaign',
  g.phase === PHASE.LIVE && !g.isDaily && LEVELS[g.levelIndex]?.id === g.level.id,
  `${g.phase}, level ${g.levelIndex + 1}`);

// Set up directly rather than by date: the last level may be held from the
// daily, and the bug was "a daily that is the last level", not a day.
const g2 = createGame(LEVELS[0]);
loadLevel(g2, asDaily(LEVELS[LEVELS.length - 1]));
g2.isDaily = true;
nextLevel(g2);
check('a daily on the LAST level does not put up the ending', g2.phase === PHASE.SELECT, g2.phase);

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
