// THE DAILY DECK GATE — every level the daily can deal, played headless.
//
// The daily's first proof of fairness was "the shortest winning stroke fits the
// budget", and it passed while two of its levels were impossible: the stroke it
// relied on was an idealised one no finger reproduces, and at 110 units of ink
// DUCT and CRACK had not one winner that survives the hand model. So every
// level in the deck now carries a certificate from tools/levelgen/bake.js, and
// this replays them — cheap, so it runs in the fast suite, where the bake that
// produced them takes minutes and cannot.
//
// For every dealt level: its certificate was made at the budget the daily gives
// it TODAY (a campaign change moves the budget and stales the certificate), and
// the certified stroke still WINS the level as the daily deals it, where an
// over-long stroke is rejected outright. For every pool level, doing nothing
// still LOSES — no other gate plays those. And every campaign level is either
// dealt or held from the daily with a reason, so a new level cannot slip in
// uncertified.

import { playLevel, OUTCOME } from './lib/run-level.js';
import { LEVELS } from '../../js/levels.js';
import { POOL, HELD_FROM_DAILY } from '../../js/dailyPool.js';
import { DAILY, asDaily } from '../../js/daily.js';
import { DAILY_SOLUTIONS } from '../../js/dailySolutions.js';

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

console.log(`\nDAILY DECK — ${DAILY.length} levels dealt, ${Object.keys(HELD_FROM_DAILY).length} held`);

const dealt = new Set(DAILY.map((l) => l.id));
const unaccounted = LEVELS.filter((l) => !dealt.has(l.id) && !HELD_FROM_DAILY[l.id]).map((l) => l.id);
check('every campaign level is dealt or held with a reason', unaccounted.length === 0,
  unaccounted.length ? `${unaccounted.join(', ')} — run tools/levelgen/bake.js` : '');
const heldDealt = Object.keys(HELD_FROM_DAILY).filter((id) => dealt.has(id));
check('no held level is ever dealt', heldDealt.length === 0, heldDealt.join(', '));

const stale = [], lost = [], selfSolving = [];
for (const lvl of DAILY) {
  const cert = DAILY_SOLUTIONS[lvl.id];
  const daily = asDaily(lvl);
  if (!cert?.solution || cert.ink !== daily.drawing.maxLength) {
    stale.push(`${lvl.id} (${cert ? `certified at ${cert.ink}u, dealt at ${daily.drawing.maxLength}u` : 'no certificate'})`);
    continue;
  }
  const run = playLevel(daily, cert.solution.points);
  if (run.outcome !== OUTCOME.SUCCESS) lost.push(`${lvl.id} -> ${run.outcome}`);
}
for (const lvl of POOL) {
  if (playLevel(lvl, null).outcome === OUTCOME.SUCCESS) selfSolving.push(lvl.id);
}

check('every dealt level is certified at the budget it is dealt at', stale.length === 0,
  stale.length ? `${stale.join('; ')} — run tools/levelgen/bake.js` : '');
check('every certified stroke still wins the daily', lost.length === 0, lost.join('; '));
check('doing nothing loses on every pool level', selfSolving.length === 0, selfSolving.join(', '));

console.log(failed === 0 ? '\nDAILY DECK: PASS\n' : `\nDAILY DECK: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
