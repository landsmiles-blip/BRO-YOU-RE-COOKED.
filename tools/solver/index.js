// Solver CLI.
//
//   node tools/solver            analyse every level, write measured thresholds
//   node tools/solver a2-gap     analyse one
//   node tools/solver --density 0.6   coarser sweep (faster)
//   node tools/solver --check    gates only, no write — the regression mode
//
// Exits non-zero if any level fails a HARD gate, so it can sit in CI or in
// `npm test` as the thing that catches a physics tune breaking a level.

import { writeFileSync } from 'node:fs';
import { LEVELS, HELD, ALL_LEVELS, getLevel } from '../../js/levels.js';
import { analyse, gradeLevel } from './solve.js';

const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf(name);
  return i >= 0 ? (argv[i + 1] ?? true) : def;
};
const density = Number(flag('--density', 1));
const checkOnly = argv.includes('--check');
// Accept SEVERAL level ids, not one. Authoring happens in batches — five new
// levels meant five separate multi-minute sweeps, and the first version
// silently swept only the first id and ignored the rest.
const targets = argv.filter((a) => !a.startsWith('--') && !/^[\d.]+$/.test(a));
const levels = targets.length ? targets.map(getLevel) : ALL_LEVELS;
const heldIds = new Set(HELD.map((h) => h.level.id));

const pct = (v) => `${(v * 100).toFixed(1)}%`;
let hardFailures = 0;
const results = {};

for (const level of levels) {
  const t0 = Date.now();
  process.stdout.write(`\n${level.id}  (${level.verb})  sweeping… `);
  const a = analyse(level, { density });
  results[level.id] = a;
  process.stdout.write(`${((Date.now() - t0) / 1000).toFixed(1)}s\n`);

  console.log(`  region          ${Math.round(a.region.w)}x${Math.round(a.region.h)} at (${Math.round(a.region.x)},${Math.round(a.region.y)})`);
  console.log(`  strokes         ${a.total} tried, ${a.rejected} rejected, ${a.plausible} plausible`);
  console.log(`  wins            ${a.wins}  →  breadth ${pct(a.solutionBreadth)}   [gate 2%–40%]`);
  console.log(`  families        ${a.distinctFamilies} distinct: ${JSON.stringify(a.familyBreakdown)}`);
  console.log(`  failures        ${JSON.stringify(a.outcomes)}`);
  console.log(`  shortest win    ${a.shortestWin}u (${a.shortestWinFamily})`);
  console.log(`  precision floor ${a.precisionFloor}u   [gate ≥25u]`);
  console.log(`  hand-drawn wobble ${a.worstJitter} (path/net)   [gate ≤8]`);
  console.log(`  tension         ${a.tension === Infinity ? 'FLAT — nothing comes near him' : a.tension + 'u closest approach on a win'}   [tense <90u]`);
  console.log(`  ★★ / ★★★        ${a.twoStarLength}u / ${a.threeStarLength}u   (60th/20th pct, MEASURED)`);

  const issues = gradeLevel(a);
  const held = heldIds.has(level.id);
  if (!issues.length) console.log(`  VERDICT         PASS${held ? ' (held — now clears, consider shipping)' : ''}`);
  for (const i of issues) {
    // A held level is expected to fail. It is reported, not counted: the suite
    // stays honest about the shipping set without going permanently red.
    const tag = held ? 'HELD     ' : (i.hard ? 'HARD FAIL' : 'WARN     ');
    console.log(`  ${tag}       ${i.msg}`);
    if (i.hard && !held) hardFailures++;
  }
}

if (!checkOnly) {
  // MERGE, never overwrite.
  //
  // `node tools/solver a2-gap` used to rewrite js/solverData.js containing ONLY
  // a2-gap, silently deleting the measured star thresholds for the other eight
  // levels — no warning, and the file still looked plausible. Re-running one
  // level after a tweak is the single most common way this tool is used, so
  // the common path was the destructive one.
  let prior = {};
  try { ({ SOLVER: prior } = await import('../../js/solverData.js?t=' + Date.now())); }
  catch { /* first run */ }

  const measured = Object.fromEntries(Object.entries(results).filter(([id]) => !heldIds.has(id)).map(([id, a]) => [id, {
    solvable: a.solvable,
    solutionBreadth: Number(a.solutionBreadth.toFixed(4)),
    precisionFloor: a.precisionFloor,
    worstJitter: a.worstJitter,
    distinctFamilies: a.distinctFamilies,
    twoStarLength: a.twoStarLength,
    threeStarLength: a.threeStarLength,
    shortestWin: a.shortestWin,
    measuredAt: new Date().toISOString().slice(0, 10),
  }]));

  // Levels measured this run win; everything else keeps its last measurement.
  // A level that is now HELD, or that NO LONGER EXISTS, is dropped outright —
  // stale data for a level that does not ship is worse than none.
  //
  // The "no longer exists" half was missing, and using the generator found it:
  // promoting a generated candidate to try it out, then removing it, left its
  // measurements behind in a file that says at the top it is generated and
  // should not be edited by hand. Merging is right; merging forever is not.
  const live = new Set(ALL_LEVELS.map((l) => l.id));
  const out = { ...prior, ...measured };
  for (const id of Object.keys(out)) if (heldIds.has(id) || !live.has(id)) delete out[id];

  const carried = Object.keys(out).length - Object.keys(measured).length;
  const body = `// GENERATED by tools/solver — do not edit by hand.
//
// Star thresholds here are MEASURED percentiles of winning stroke lengths
// across the plausible stroke space, not guesses. Re-run after any physics
// change: \`node tools/solver\`.

export const SOLVER = ${JSON.stringify(out, null, 2)};
`;
  writeFileSync(new URL('../../js/solverData.js', import.meta.url), body);
  console.log(`\nwrote js/solverData.js — ${Object.keys(measured).length} re-measured` +
              (carried > 0 ? `, ${carried} carried over from the previous run` : ''));
}

console.log(hardFailures ? `\n${hardFailures} HARD GATE FAILURE(S)\n` : '\nALL LEVELS PASS THE GATES\n');
process.exit(hardFailures ? 1 : 0);
