// PROGRESS + PERSISTENCE GATE.
//
// Pure logic, no physics and no browser, so it runs in the fast suite. It
// exists because the failure it guards is silent: a save that half-applies
// leaves the player unable to tell which of their stars are real, and a save
// that never loads looks exactly like a player who has not played yet.

import {
  createProgress, record, starsOn, totalStars, maxStars, cleared, isComplete,
  perfect, firstUnclearedIndex, serialise, deserialise,
  frontier, isOpen, isDone, isSkipped, markSkipped, resumeIndex, grantToken, spendToken, MAX_TOKENS,
  noteRun, noteTry, noteTime, triesOn,
} from '../../js/progress.js';
import { LEVELS } from '../../js/levels.js';

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

console.log('\nPROGRESS');

const ids = LEVELS.map((l) => l.id);
const p = createProgress();
check('a fresh save has no stars', totalStars(p) === 0 && cleared(p) === 0);
check('max stars is 3 per level', maxStars() === LEVELS.length * 3, `${maxStars()}`);
check('an unplayed game resumes at level 1', firstUnclearedIndex(p) === 0);

check('a win is recorded', record(p, ids[0], 2) === true && starsOn(p, ids[0]) === 2);

// The rule that protects the player: replaying a cleared level to experiment
// must never be able to take stars away.
check('a WORSE replay does not overwrite a best',
      record(p, ids[0], 1) === false && starsOn(p, ids[0]) === 2, `${starsOn(p, ids[0])}`);
check('a BETTER replay does overwrite',
      record(p, ids[0], 3) === true && starsOn(p, ids[0]) === 3);
check('resume skips a cleared level', firstUnclearedIndex(p) === 1);

// Round-trip.
for (const id of ids) record(p, id, 3);
check('a complete game is complete', isComplete(p) && perfect(p), `${totalStars(p)}/${maxStars()}`);
const back = deserialise(serialise(p));
check('a save round-trips exactly', totalStars(back) === totalStars(p), `${totalStars(back)}`);

// Every way a save can be wrong. Each must yield a CLEAN progress, never a
// half-applied one — the player must not see stars they did not earn.
for (const [label, text] of [
  ['null',             null],
  ['empty string',     ''],
  ['not JSON',         '{oh no'],
  ['JSON but not an object', '42'],
  ['no schema version', JSON.stringify({ best: { [ids[0]]: 3 } })],
  ['a FUTURE schema',   JSON.stringify({ v: 99, best: { [ids[0]]: 3 } })],
  ['best is not an object', JSON.stringify({ v: 1, best: 'nope' })],
]) {
  check(`rejects ${label}`, totalStars(deserialise(text)) === 0);
}

// Values that are individually junk inside an otherwise valid save.
const dirty = deserialise(JSON.stringify({
  v: 1,
  best: {
    [ids[0]]: 3,
    [ids[1]]: 99,          // out of range — clamped, not trusted blindly
    [ids[2]]: -1,          // impossible
    [ids[3]]: 'three',     // wrong type
    'a-level-that-was-cut': 3,
  },
}));
// DROPPED, not clamped: clamping 99 to 3 would grant a perfect score from
// corrupt data. Losing one level's stars is recoverable; inventing them is not.
check('drops an impossible star count rather than clamping it',
      starsOn(dirty, ids[1]) === 0, `${starsOn(dirty, ids[1])}`);
check('drops a negative star count', starsOn(dirty, ids[2]) === 0);
check('drops a non-numeric star count', starsOn(dirty, ids[3]) === 0);
check('drops a level that no longer exists', !('a-level-that-was-cut' in dirty.best));
check('keeps the valid stars alongside the junk', starsOn(dirty, ids[0]) === 3);

// ── THE LOCK AND THE SKIP ───────────────────────────────────────────────
// A skip only means something in a game that locks, and the lock must never
// take away anything a player already had.
{
  const q = createProgress();
  check('a new player has only level 1 open', isOpen(q, 0) && !isOpen(q, 1), `frontier ${frontier(q)}`);
  record(q, ids[0], 1);
  check('beating a level opens the next one, and only that one', isOpen(q, 1) && !isOpen(q, 2));
  check('a skip is refused on a level already beaten', markSkipped(q, ids[0]) === false);
  check('skipping a level opens the next one', markSkipped(q, ids[1]) === true && isOpen(q, 2) && !isOpen(q, 3));
  check('a skipped level scores nothing and is not cleared',
        starsOn(q, ids[1]) === 0 && cleared(q) === 1 && isSkipped(q, ids[1]) && isDone(q, ids[1]));
  check('the campaign resumes past a skip, not back at it', resumeIndex(q) === 2, `${resumeIndex(q)}`);
  check('"go back for the stars" does return to it', firstUnclearedIndex(q) === 1);
  record(q, ids[1], 2);
  check('beating a skipped level fills it in', !isSkipped(q, ids[1]) && starsOn(q, ids[1]) === 2);
}
{
  // An OLD save, from when the board was open: level 14 cleared, level 5 never.
  const legacy = deserialise(JSON.stringify({ v: 2, best: { [ids[13]]: 2 }, finishedAt: 0, streak: 0, lastDailyDay: 0 }));
  check('an old save keeps every level up to its furthest open',
        isOpen(legacy, 4) && isOpen(legacy, 13) && isOpen(legacy, 14) && !isOpen(legacy, 15), `frontier ${frontier(legacy)}`);
  check('an old save migrates with no skips and no tokens',
        Object.keys(legacy.skipped).length === 0 && legacy.tokens === 0);
  const v1 = deserialise(JSON.stringify({ v: 1, best: { [ids[0]]: 3 } }));
  check('a version 1 save still migrates', starsOn(v1, ids[0]) === 3 && v1.tokens === 0);
}
{
  const t = createProgress();
  let granted = 0;
  for (let i = 0; i < MAX_TOKENS + 2; i++) if (grantToken(t)) granted++;
  check(`tokens are held to ${MAX_TOKENS}`, granted === MAX_TOKENS && t.tokens === MAX_TOKENS);
  check('spending a token takes one', spendToken(t) && t.tokens === MAX_TOKENS - 1);
  t.tokens = 0;
  check('no token, no spend', spendToken(t) === false && t.tokens === 0);
  t.tokens = 2;
  markSkipped(t, ids[5]);
  const rt = deserialise(serialise(t));
  check('skips and tokens round-trip', rt.tokens === 2 && isSkipped(rt, ids[5]));
  const junk = deserialise(JSON.stringify({ v: 3, best: {}, tokens: 99, skipped: ['not-a-level', ids[6], 7] }));
  check('an impossible token count is DROPPED, not clamped', junk.tokens === 0, `${junk.tokens}`);
  check('a skip naming no real level is dropped, the rest kept',
        !('not-a-level' in junk.skipped) && isSkipped(junk, ids[6]) && Object.keys(junk.skipped).length === 1);
}

// ── lifetime stats, for the ending's card ───────────────────────────────
{
  const sp = createProgress();
  noteRun(sp, { won: true, ink: 300, calls: 2 });
  noteRun(sp, { died: true, ink: 120, calls: 1 });
  noteRun(sp, { ink: 80 });                       // aborted: neither a win nor a death
  check('a run counts its win, death, ink and close calls',
        sp.stats.wins === 1 && sp.stats.deaths === 1 && sp.stats.ink === 500 && sp.stats.calls === 3,
        JSON.stringify(sp.stats));
  const rs = deserialise(serialise(sp));
  check('stats round-trip', JSON.stringify(rs.stats) === JSON.stringify(sp.stats));
  sp.muted = true;
  check('the sound switch is remembered', deserialise(serialise(sp)).muted === true &&
        deserialise(JSON.stringify({ v: 3, best: {}, muted: 'yes' })).muted === false);
  const old = deserialise(JSON.stringify({ v: 2, best: {} }));
  check('an old save starts its stats at zero', old.stats.wins === 0 && old.stats.ink === 0);
  const bad = deserialise(JSON.stringify({ v: 3, best: {}, stats: { wins: -4, deaths: 'lots', ink: 1e99, calls: 7 } }));
  check('a junk stat is dropped on its own; the rest are kept',
        bad.stats.wins === 0 && bad.stats.deaths === 0 && bad.stats.ink === 0 && bad.stats.calls === 7,
        JSON.stringify(bad.stats));
}

// ── tries per level, for the playtest ───────────────────────────────────
// The numbers a playtest sends back to refit the curve. Runs to the FIRST win
// and the time to it; anything after that win is the player replaying.
{
  const q = createProgress();
  check('a fresh save has tried nothing', triesOn(q, ids[0]) === null);
  noteTime(q, ids[0], 1500);
  noteTry(q, ids[0], false); noteTry(q, ids[0], false);
  noteTime(q, ids[0], 2500);
  noteTry(q, ids[0], true);
  noteTime(q, ids[0], 9999);          // after the first win: not counted
  noteTry(q, ids[0], true);           // a replay: counted as a run, the first win stays at 3
  const t = triesOn(q, ids[0]);
  check('runs to the first win and the time to it are kept', t.runs === 4 && t.won === 3 && t.ms === 4000,
        JSON.stringify(t));
  noteTry(q, ids[1], false);
  const back = deserialise(serialise(q));
  check('tries survive a save and a load', JSON.stringify(back.tries) === JSON.stringify(q.tries),
        JSON.stringify(back.tries));

  // Junk in the tries is dropped entry by entry, never clamped, and never
  // takes the rest of the save with it.
  const raw = JSON.parse(serialise(q));
  raw.tries[ids[2]] = { runs: 2, won: 5, ms: 10 };          // a first win after more runs than there were
  raw.tries[ids[3]] = { runs: -1, won: 0, ms: 0 };
  raw.tries[ids[4]] = { runs: 3, won: 1, ms: 'soon' };
  raw.tries['not-a-level'] = { runs: 1, won: 1, ms: 1 };
  const j = deserialise(JSON.stringify(raw));
  check('a nonsense tries entry is dropped, not clamped',
        !j.tries[ids[2]] && !j.tries[ids[3]] && !j.tries[ids[4]] && !j.tries['not-a-level']
        && j.tries[ids[0]]?.won === 3 && starsOn(j, ids[0]) === starsOn(back, ids[0]),
        Object.keys(j.tries).join(','));
  const old = deserialise(JSON.stringify({ v: 3, best: { [ids[0]]: 2 } }));
  check('a save from before tries existed loads with none', JSON.stringify(old.tries) === '{}' && starsOn(old, ids[0]) === 2);
}

console.log(failed ? `\n${failed} progress check(s) FAILED\n` : '\nprogress OK\n');
process.exit(failed ? 1 : 0);
