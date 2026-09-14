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
      check(`"${lvl.id}" solution is ANCHORED (reproducible)`, s.solution.anchors > 0,
            `${s.solution.anchors} anchors`);
    }
  }
}

console.log(failed ? `\n${failed} level-data check(s) FAILED\n` : '\nlevel data OK\n');
process.exit(failed ? 1 : 0);
