// PROGRESS + PERSISTENCE GATE.
//
// Pure logic, no physics and no browser, so it runs in the fast suite. It
// exists because the failure it guards is silent: a save that half-applies
// leaves the player unable to tell which of their stars are real, and a save
// that never loads looks exactly like a player who has not played yet.

import {
  createProgress, record, starsOn, totalStars, maxStars, cleared, isComplete,
  perfect, firstUnclearedIndex, serialise, deserialise,
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

console.log(failed ? `\n${failed} progress check(s) FAILED\n` : '\nprogress OK\n');
process.exit(failed ? 1 : 0);
