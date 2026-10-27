// THE PLATE AUDIT — is the plate pressed by what the level is about?
//
//   npm run plates -- [level-id ...]     (no ids: every level with a plate)
//
// CLAUDE.md has said since the lids went on A19 and A21: "re-run the
// drop-on-the-plate audit after touching any plate level". Nothing ran it, so
// nobody did, and on 27 Oct, run by hand for the first time across the whole
// set, it found the plate INTRO won by its back door: 636 of FUNNEL's 668
// winning strokes were a dropped line sliding off the lip onto the plate while
// the rock sat where it landed. Every gate was green, because a back door is a
// fair, stable, solvable answer. It is just not the level.
//
// For every winning stroke of the solver's sweep, the census records who
// pressed each plate; this counts the wins where it was the player's own line.
// Over LIMIT fails, unless the level's answer IS the line (`solutionKind:
// 'unanchored'`, DROP and KITE) or it is allowed below with its reason.

import { LEVELS } from '../../js/levels.js';
import { census } from './census.js';

const LIMIT = 0.05;

// Levels whose line presses the plate in more than LIMIT of wins, and why that
// is not a back door. Each entry is a measurement, not a waiver.
const ALLOWED = {
  // 23 of 162 wins (27 Oct): the dropped line falls down the shaft onto the
  // lever, which tips and delivers the LINE under the lid instead of the rock.
  // The machine is used and the decision is the same — which side of the pin —
  // and LEVER is on WATCH, which may only get easier.
  'a21-lever': 'the line rides the lever: the machine is still the answer',
};

const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const plated = LEVELS.filter((l) => l.objects.some((o) => o.type === 'switch'));
const levels = ids.length ? plated.filter((l) => ids.includes(l.id)) : plated;
if (ids.length && levels.length !== ids.length) {
  console.error(`not a plate level: ${ids.filter((id) => !plated.some((l) => l.id === id)).join(', ')}`);
  process.exit(1);
}

let failed = 0;
for (const level of levels) {
  const t0 = Date.now();
  const { wins, tally } = census(level);
  let byLine = 0;
  for (const [words, e] of tally) if (/<-stroke\b/.test(words)) byLine += e.n;
  const share = wins ? byLine / wins : 0;
  const intended = level.solutionKind === 'unanchored';
  const why = intended ? 'its answer is the line' : ALLOWED[level.id];
  const bad = share > LIMIT && !why;
  if (bad) failed++;
  console.log(`  ${bad ? 'FAIL' : 'ok  '}  ${level.id.padEnd(18)} ${String(byLine).padStart(4)} of ${String(wins).padStart(4)} wins pressed by the line`
    + `  ${(100 * share).toFixed(0).padStart(3)}%${share > LIMIT && why ? `  — ${why}` : ''}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
if (failed) {
  console.log(`\n${failed} level(s) can be won by dropping a line on the plate — CLAUDE.md, THE PLATE IS A BACK DOOR`);
  process.exit(1);
}
console.log('\nPLATES: PASS');
