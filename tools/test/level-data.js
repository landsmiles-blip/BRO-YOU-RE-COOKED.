// LEVEL DATA GATE — the check that runs before anything is simulated.
//
// WHY IT IS ITS OWN SUITE, first in the list:
//
// assertLevel() existed and was correct, but it was only ever called from
// js/main.js — that is, at BOOT, IN THE BROWSER. So `npm test` ran four
// physics suites, reported ALL PHYSICS GATES PASS, and the shipped bundle did
// not start at all: one object had lost its lethality declaration, assertLevel
// threw during module evaluation, and the whole game was a blank page.
//
// A headless suite that never loads the game cannot notice that the game is
// dead. This is the cheapest possible fix — the validator is pure data, needs
// no browser and no physics, and runs in milliseconds.
//
// It also checks the things that make a level PLAYABLE rather than merely
// well-formed, which nothing checked anywhere: that its verified solution
// still exists, and that the constants the levels silently depend on hold.

import { LEVELS, ALL_LEVELS, assertLevel } from '../../js/levels.js';
import { MILO, LINE } from '../../js/constants.js';
import { LETHAL_KINDS } from '../../js/hazards.js';

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

console.log('\nLEVEL DATA');

// The exact failure that shipped a blank page.
for (const lvl of ALL_LEVELS) {
  let err = null;
  try { assertLevel(lvl); } catch (e) { err = e.message.replace(/\n\s*/g, ' '); }
  check(`"${lvl.id}" is valid`, !err, err ?? '');
}

// Cross-file inequalities that no single file can enforce. Both are marked
// LOCKED in constants.js with the reason written next to them; this is what
// makes the comment true rather than aspirational.
check('maxStepUp exceeds line thickness (or bridges are unwalkable)',
      MILO.maxStepUp > LINE.thickness, `${MILO.maxStepUp} vs ${LINE.thickness}`);
check('the hand model can outrun simplification',
      LINE.simplifyTol < 5.5, `simplifyTol ${LINE.simplifyTol} vs 5.5u waver`);
check('every lethality kind is known', LETHAL_KINDS.size >= 4, [...LETHAL_KINDS].join(','));

// Verified solutions must exist for every SHIPPING level, or the filmstrip
// gate silently skips it and stops being a gate.
let SOLUTIONS = null;
try { ({ SOLUTIONS } = await import('../../js/solutions.js')); } catch { /* not generated yet */ }
if (!SOLUTIONS) {
  console.log('  SKIP  verified solutions — run `node tools/solver/representative.js`');
} else {
  for (const lvl of LEVELS) {
    const s = SOLUTIONS[lvl.id];
    check(`"${lvl.id}" has a hand-robust solution`, !!s?.solution,
          s ? `${s.robust}/${s.winners} winners survive a hand` : 'not measured');
    if (s?.solution) {
      if (lvl.solutionKind === 'unanchored') {
        // A level that is ABOUT not anchoring cannot be held to the anchored
        // rule. It is held to a stricter one instead: without staticness to
        // guarantee reproducibility, the solution has to be demonstrably easy
        // to land — a majority of its idealised winners must survive a hand.
        check(`"${lvl.id}" is a declared UNANCHORED level`, s.solution.anchors === 0,
              `${s.solution.anchors} anchors — if this anchored, the level stopped teaching its lesson`);
        check(`"${lvl.id}" unanchored solution is reliably hittable`, s.handRate >= 0.5,
              `${(s.handRate * 100).toFixed(0)}% of winners survive a hand (needs >= 50%)`);
      } else {
        check(`"${lvl.id}" solution is ANCHORED (reproducible)`, s.solution.anchors > 0,
              `${s.solution.anchors} anchors`);
      }
    }
  }
}

// ── the daily pool ────────────────────────────────────────────────────────
//
// Forty generated levels that no one placed by hand, dealt only by the daily.
// Each is held to the campaign's standard: valid data, a hint, measured star
// thresholds that leave the daily budget winnable, and a certified stroke that
// is reproducible. Checked in aggregate so a bad one is named, not buried.
const { POOL, POOL_SOLVER } = await import('../../js/dailyPool.js');
const { DAILY_SOLUTIONS } = await import('../../js/dailySolutions.js');
// Every pool level must satisfy `pred`; the ones that do not are named.
const each = (label, pred) => {
  const bad = POOL.filter((l) => !pred(l)).map((l) => l.id);
  check(label, bad.length === 0, bad.join(', '));
};

console.log('\nDAILY POOL');
check('the pool is baked', POOL.length >= 40, `${POOL.length} levels`);
each('every pool level is valid level data', (l) => { try { assertLevel(l); return true; } catch { return false; } });

const campaign = new Set(ALL_LEVELS.map((l) => l.id));
const poolIds = POOL.map((l) => l.id);
check('pool ids are unique, and none is a campaign id',
  new Set(poolIds).size === poolIds.length && poolIds.every((id) => !campaign.has(id)));
each('every pool level names its problem (hint) and its verb', (l) => !!l.hint && !!l.verb);

// The daily budget IS threeStarLength. Above the shortest win means it can be
// won; below the level's own budget means it is actually a challenge.
each('every pool budget is winnable and tighter than the level', (l) => {
  const m = POOL_SOLVER[l.id];
  return !!m && m.shortestWin <= m.threeStarLength && m.threeStarLength < l.drawing.maxLength;
});

// The campaign's reproducibility rule, applied at the DAILY budget — the only
// one a pool level is ever played at: anchored, or a hand lands it half the time.
each('every pool level has a reproducible certificate', (l) => {
  const c = DAILY_SOLUTIONS[l.id];
  return !!c?.solution && (c.solution.anchors > 0 || c.handRate >= 0.5);
});

// Generated files must drop ids that no longer exist, not merge for ever.
const { DAILY } = await import('../../js/daily.js');
const dealt = new Set(DAILY.map((l) => l.id));
const inPool = new Set(poolIds);
const stale = [
  ...Object.keys(POOL_SOLVER).filter((id) => !inPool.has(id)),
  ...Object.keys(DAILY_SOLUTIONS).filter((id) => !dealt.has(id)),
];
check('no stale measurements for levels the deck no longer holds', stale.length === 0, stale.join(', '));

console.log(failed ? `\n${failed} level-data check(s) FAILED\n` : '\nlevel data OK\n');
process.exit(failed ? 1 : 0);
