// THE SKETCH FUNNEL — measure several level ideas in one go, before any of
// them is placed in the game.
//
//   npm run sketch -- path/to/sketches.js [slot]
//
// The file exports candidate levels (any export with an `id` and `static`).
// For each one this runs the structure check (doing nothing must fail, and say
// why), the full sweep, and the hand-robust certification, and prints the one
// number the curve needs — TRIES — next to the band of the slot it is meant
// for. Sketches are cheap and most should die here; only the survivors get
// written into a chapter file and taken through the films.

import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { assertLevel } from '../../js/levels.js';
import { analyse, gradeLevel } from '../solver/solve.js';
import { representativeFor } from '../solver/representative.js';
import { checkLevel } from '../levelcheck.js';
import { band } from './difficulty.js';

const [file, slotArg] = process.argv.slice(2);
if (!file) {
  console.error('usage: npm run sketch -- <file exporting candidate levels> [slot number 1-60]');
  process.exit(1);
}
const slot = slotArg ? Number(slotArg) - 1 : null;
const b = slot != null ? band(Math.floor(slot / 10), slot % 10) : null;

const mod = await import(pathToFileURL(resolve(file)).href);
const candidates = Object.values(mod).filter((v) => v && typeof v === 'object' && v.id && v.static);
console.log(`\nSKETCHES — ${candidates.length} from ${file}` +
  (b ? `, for slot ${slot + 1}: target ${b.t.toFixed(0)} tries [${b.lo.toFixed(0)}-${b.hi.toFixed(0)}]` : ''));

for (const lvl of candidates) {
  const t0 = Date.now();
  let err = null;
  try { assertLevel(lvl); } catch (e) { err = e.message.replace(/\s+/g, ' '); }
  if (err) { console.log(`\n  ${lvl.id}  SCHEMA  ${err}`); continue; }

  const pre = checkLevel(lvl);
  const hard = pre.issues.filter((i) => i.hard).map((i) => i.m);
  const notes = pre.notes.join('; ');
  if (hard.length) {
    console.log(`\n  ${lvl.id}  DEAD   ${hard.join('; ')}${notes ? `  (${notes})` : ''}`);
    continue;
  }
  const a = analyse(lvl);
  const rep = representativeFor(lvl);
  const tries = a.solutionBreadth > 0 && rep.handRate > 0 ? 1 / (a.solutionBreadth * rep.handRate) : Infinity;
  const fit = b ? (tries >= b.lo && tries <= b.hi ? 'IN BAND' : 'OFF') : '';
  const fails = gradeLevel(a).filter((i) => i.hard).map((i) => i.msg);
  console.log(`\n  ${lvl.id}  tries ${Number.isFinite(tries) ? tries.toFixed(0) : '∞'} ${fit}` +
    `  breadth ${(a.solutionBreadth * 100).toFixed(1)}%  hand ${(rep.handRate * 100).toFixed(0)}%` +
    `  precision ${a.precisionFloor}u  wobble ${a.worstJitter}  families ${a.distinctFamilies}` +
    `  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  console.log(`      ${notes}`);
  if (fails.length) console.log(`      GATES: ${fails.join('; ')}`);
  if (rep.solution) console.log(`      certified: ${rep.solution.family} ${rep.solution.length}u, ${rep.solution.anchors} anchors`);
}
console.log('');
