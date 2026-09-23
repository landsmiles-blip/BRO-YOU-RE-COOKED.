// THE LEVEL GENERATOR — a machine that proposes levels, and throws away the
// ones that are not fair. It does not decide what is GOOD. I do.
//
//   node --import ./tools/node-matter.js tools/levelgen/generate.js
//   node --import ./tools/node-matter.js tools/levelgen/generate.js --n 400 --archetype roller
//
// WHY A FUNNEL, AND NOT JUST "GENERATE AND CHECK"
//
// A full solver sweep is 2,100 simulated strokes — between 7 and 50 seconds per
// level. Run that on 500 candidates and it is a five-hour job for a handful of
// survivors, which means it never actually gets run.
//
// So candidates die as cheaply as possible. Each stage costs more than the last
// and only sees what survived the one before:
//
//   1. VALID           level data assertions            ~0 ms
//   2. NOT SELF-SOLVED doing nothing must FAIL          ~40 ms
//   3. COARSE          150 strokes: is it solvable?     ~1 s
//   4. FULL            the real sweep and its gates     ~10-40 s
//   5. HAND            does a shaky hand win?           ~20-40 s
//
// Stages 1 and 2 kill most of a batch for almost nothing, which is what makes
// generating hundreds practical.
//
// IT AUTO-TIMES THE FREEZE. Every level needs the world to stop BEFORE the
// danger lands, and picking that number by hand is how my first A12 shipped
// with the roller landing 300 units behind Milo — a level that solved itself.
// Here the idle run is measured and the freeze is set from it, so the mistake
// is not available.

import { writeFileSync, mkdirSync } from 'node:fs';
import { generate, ARCHETYPES } from './archetypes.js';
import { assertLevel } from '../../js/levels.js';
import { playLevel } from '../test/lib/run-level.js';
import { analyse, gradeLevel } from '../solver/solve.js';
import { representativeFor } from '../solver/representative.js';
import { OUTCOME } from '../../js/sim.js';

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const N = Number(flag('--n', 120));
const ONLY = flag('--archetype', null);
const SEED0 = Number(flag('--seed', 1));
const OUT = flag('--out', '/tmp/levelgen');

const names = ONLY ? [ONLY] : Object.keys(ARCHETYPES);
mkdirSync(OUT, { recursive: true });

const tally = { built: 0, invalid: 0, selfSolved: 0, unsolvable: 0, unfair: 0, handFailed: 0, kept: 0 };
const keepers = [];
const t0 = Date.now();

for (let i = 0; i < N; i++) {
  const name = names[i % names.length];
  const seed = SEED0 + i * 7919;
  let lvl;
  try { lvl = generate(name, seed); } catch { tally.invalid++; continue; }
  tally.built++;

  // ── 1. valid data ───────────────────────────────────────────────────────
  try { assertLevel(lvl); } catch { tally.invalid++; continue; }

  // ── 2. doing nothing must FAIL, and the freeze is derived from WHEN ─────
  // A generous freeze is a level with no urgency; a late one is a level the
  // player never gets to act in. 55% of the way to disaster is the shape the
  // hand-built levels settled on.
  const idle = playLevel(lvl, null);
  if (idle.outcome === OUTCOME.SUCCESS) { tally.selfSolved++; continue; }
  if (!idle.death?.label) { tally.selfSolved++; continue; }
  lvl.freezeAt = Math.max(300, Math.min(900, Math.round(idle.t * 0.55 / 10) * 10));
  if (lvl.freezeAt >= idle.t) { tally.selfSolved++; continue; }

  // ── 3. coarse sweep — is it solvable at ALL? ────────────────────────────
  const coarse = analyse(lvl, { density: 0.35 });
  if (!coarse.solvable || coarse.solutionBreadth < 0.015) { tally.unsolvable++; continue; }

  // ── 4. the real gates ───────────────────────────────────────────────────
  const full = analyse(lvl, { density: 1 });
  const issues = gradeLevel(full).filter((x) => x.hard);
  if (issues.length) { tally.unfair++; continue; }

  // ── 5. can a HAND win it? ───────────────────────────────────────────────
  const rep = representativeFor(lvl);
  if (!rep.solution) { tally.handFailed++; continue; }

  tally.kept++;
  keepers.push({ lvl, full, rep, idle });
  console.log(
    `  KEEP ${lvl.id.padEnd(26)} breadth ${(full.solutionBreadth * 100).toFixed(1).padStart(5)}%  ` +
    `${full.distinctFamilies} families  precision ${String(full.precisionFloor).padStart(3)}u  ` +
    `hand ${(rep.handRate * 100).toFixed(0).padStart(3)}%  idle "${idle.death.label}"`);
}

// Rank by how INTERESTING they look, not just how legal they are. Several
// distinct stroke families means several ways to win, which is the closest a
// number gets to "there is something to think about here". Breadth near the
// middle of the allowed band beats breadth scraping the floor.
const score = (k) =>
  k.full.distinctFamilies * 2
  + (1 - Math.abs(k.full.solutionBreadth - 0.12) / 0.28) * 3
  + k.rep.handRate * 2
  + Math.min(k.full.precisionFloor, 90) / 90;

keepers.sort((a, b) => score(b) - score(a));

const secs = ((Date.now() - t0) / 1000).toFixed(0);
console.log(`\n${N} candidates in ${secs}s`);
for (const [k, v] of Object.entries(tally)) console.log(`  ${k.padEnd(12)} ${v}`);

if (keepers.length) {
  const body =
    '// GENERATED by tools/levelgen — CANDIDATES, not shipping levels.\n' +
    '//\n' +
    '// Every level here passed the same gates the hand-built ones do: it fails\n' +
    '// when you do nothing, a hand can win it, and it is neither too tight nor\n' +
    '// trivial. That makes them FAIR. It does not make them INTERESTING — no\n' +
    '// gate can measure that, which is why these are a shortlist for a person to\n' +
    '// choose from and finish, not content to ship.\n\n' +
    'export const CANDIDATES = ' +
    JSON.stringify(keepers.map((k) => ({
      ...k.lvl,
      _measured: {
        breadth: +k.full.solutionBreadth.toFixed(4),
        families: k.full.distinctFamilies,
        precisionFloor: k.full.precisionFloor,
        handRate: k.rep.handRate,
        idleDeath: k.idle.death.label,
        score: +score(k).toFixed(2),
      },
      // The certified winning stroke travels WITH the candidate. Without it a
      // candidate cannot be filmed, and an unfilmed level is one whose only
      // evidence is headless numbers — which is precisely how this project
      // shipped two unplayable builds.
      _solution: k.rep.solution,
    })), null, 2) + ';\n';
  writeFileSync(`${OUT}/candidates.js`, body);
  console.log(`\n→ ${OUT}/candidates.js  (${keepers.length} ranked, best first)`);
}
