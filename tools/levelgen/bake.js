// THE DAILY DECK BAKE — decides every level the daily can deal, and proves each
// one can be won by a HAND inside the budget the daily gives it.
//
//   node --import ./tools/node-matter.js tools/levelgen/bake.js <candidates.js> [more ...]
//       choose a new POOL from generator candidates, then certify the whole deck
//   node --import ./tools/node-matter.js tools/levelgen/bake.js
//       keep the current POOL and re-certify the whole deck. Run this after ANY
//       change to a campaign level, to js/solverData.js, or to the physics —
//       tools/test/daily-deck.js fails until you do.
//
// THE RULE: THE DAILY ONLY DEALS A LEVEL IT CAN CERTIFY.
//
// The daily budget is a level's three-star length, and the first version of the
// daily proved it winnable by checking that the shortest winning stroke the
// solver found fits inside it. That stroke is idealised — three points, no
// tremor. Measured at the daily budget with the hand model, DUCT and CRACK
// (levels 16 and 21) each had a 110-unit budget and NOT ONE winning stroke that
// survives a hand: 0 of 23 and 0 of 5. On their days the daily was impossible,
// it looked merely hard, and it broke the streak of everyone who tried.
//
// So a level is dealt only with a CERTIFICATE: a stroke the sweep proves wins
// inside the daily budget, that survives the hand model, and that is anchored or
// lands for a hand at least half the time — the campaign's own reproducibility
// rule from tools/test/level-data.js, applied at the budget the daily actually
// hands out. A campaign level without one is HELD FROM THE DAILY with its
// measured reason. It stays in the campaign exactly as it is; only the daily
// stops dealing it.
//
// THE POOL, and why generated levels are fine here and nowhere else.
//
// The generator's archetypes were distilled from levels 1-12, so everything it
// makes is a twin of something already in the campaign — confirmed twice, the
// second time by eye on a contact sheet. That keeps them out of the campaign,
// and it does not matter in the daily, where the twist is the INK. They never
// enter LEVELS: not on the board, not in the star total, not a step in
// nextLevel. They exist so the daily does not repeat every three weeks.
//
// A candidate joins the pool only if it has a hint and valid data, if
// shortestWin <= threeStarLength < its own budget, if it earns a certificate,
// and if it is not a TWIN — two of one archetype whose widest difference is 40
// units or less are the same level to a player, the criterion that held A40 as
// a copy of A31. Candidates are ranked by how many winning strokes a hand can
// land at the daily budget, so of two twins the fairer one stays, and the pool
// is dealt round-robin across archetypes so no one kind dominates it. None of
// this is ever loosened to reach the count: short means another generator batch.
//
// Writes js/dailyPool.js (POOL, POOL_SOLVER, HELD_FROM_DAILY — the game reads
// these) and js/dailySolutions.js (every dealt level's certificate — tools only).

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { assertLevel, LEVELS, ALL_LEVELS } from '../../js/levels.js';
import { SOLVER } from '../../js/solverData.js';
import { inkFor } from '../../js/daily.js';
import { representativeFor } from '../solver/representative.js';

const TARGET = 40;
const TWIN_U = 40;

const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));

// ── the certificate ───────────────────────────────────────────────────────
//
// The level exactly as the daily deals it: a copy on inkFor() — the function
// the game itself uses — applied to the level's measured numbers.
function certify(level, measuredNumbers) {
  const ink = inkFor(measuredNumbers);
  const rep = representativeFor({ ...level, drawing: { ...level.drawing, maxLength: ink } });
  const sol = rep.solution;
  const ok = !!sol && (sol.anchors > 0 || rep.handRate >= 0.5);
  return { ok, ink, rep };
}

// Why a level has no certificate, in the two ways it can fail: nothing survives
// a hand at all, or all that survives is DROPPED lines too unreliable to count —
// an unanchored stroke settles chaotically, which is the A3 lesson, so the
// campaign demands a hand land one at least half the time.
const whyNot = (c) => c.rep.robust === 0
  ? `not one of ${c.rep.winners} winning strokes inside ${c.ink}u of ink survives a hand`
  : `inside ${c.ink}u of ink the only wins a hand can land are dropped lines, and it lands ` +
    `${Math.round(c.rep.handRate * 100)}% of them (${c.rep.robust}/${c.rep.winners}) — under the 50% ` +
    `an unanchored solution needs`;

const describe = (c) => c.ok
  ? `${c.rep.solution.family} ${c.rep.solution.length}u, ${c.rep.robust}/${c.rep.winners} survive a hand`
  : `NO CERTIFICATE — ${whyNot(c)}`;

// ── the pool ──────────────────────────────────────────────────────────────
const rejected = {};
const reject = (why) => { rejected[why] = (rejected[why] ?? 0) + 1; };
let pool;          // [{ level, s (SOLVER-shaped), cert, archetype }]
let twins = 0;

if (files.length) {
  const candidates = [];
  for (const f of files) {
    const { CANDIDATES } = await import(pathToFileURL(resolve(f)).href);
    candidates.push(...CANDIDATES);
  }
  console.log(`${candidates.length} candidates — certifying each at its daily budget`);

  const campaignIds = new Set(ALL_LEVELS.map((l) => l.id));
  const seen = new Set();
  const certified = [];
  for (const c of candidates) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    const { _measured: m = {}, _solution, ...level } = c;
    let valid = true;
    try { assertLevel(level); } catch { valid = false; }
    if (!valid) { reject('invalid level data'); continue; }
    if (campaignIds.has(level.id)) { reject('id collides with the campaign'); continue; }
    if (!level.hint) { reject('no hint'); continue; }
    if (m.threeStarLength == null || m.shortestWin == null) {
      reject('no star thresholds (made by the old generator)'); continue;
    }
    if (!(m.shortestWin <= m.threeStarLength)) { reject('budget below the shortest win'); continue; }
    if (!(m.threeStarLength < level.drawing.maxLength)) { reject('budget not tighter than the level'); continue; }

    // The same shape as js/solverData.js, so one lookup reads both.
    const s = {
      solvable: true,
      solutionBreadth: m.breadth,
      precisionFloor: m.precisionFloor,
      worstJitter: m.worstJitter,
      distinctFamilies: m.families,
      twoStarLength: m.twoStarLength,
      threeStarLength: m.threeStarLength,
      shortestWin: m.shortestWin,
      measuredAt: m.measuredAt,
    };
    const cert = certify(level, s);
    console.log(`  ${level.id.padEnd(26)} ${String(cert.ink).padStart(4)}u  ${describe(cert)}`);
    if (!cert.ok) { reject('no certificate at the daily budget'); continue; }
    certified.push({ level, s, cert, score: m.score ?? 0, archetype: level.generated?.archetype ?? 'unknown' });
  }

  // Fairest first: the most winning strokes a hand can land at the daily
  // budget. The generator's own score breaks ties.
  const byArchetype = new Map();
  for (const c of certified) {
    if (!byArchetype.has(c.archetype)) byArchetype.set(c.archetype, []);
    byArchetype.get(c.archetype).push(c);
  }
  const names = [...byArchetype.keys()].sort();
  const queues = names.map((n) => {
    const list = byArchetype.get(n).sort((a, b) =>
      (b.cert.rep.robust - a.cert.rep.robust) || (b.score - a.score));
    const mine = [];
    for (const c of list) {
      if (mine.some((k) => widest(k.level, c.level) <= TWIN_U)) { twins++; continue; }
      mine.push(c);
    }
    return mine;
  });

  // Round-robin across archetypes, because a pool that is two thirds bridges
  // is a daily that feels like one level.
  pool = [];
  for (let round = 0; pool.length < TARGET; round++) {
    let took = false;
    for (const q of queues) {
      if (q[round] && pool.length < TARGET) { pool.push(q[round]); took = true; }
    }
    if (!took) break;
  }
  console.log('');
  for (const [i, n] of names.entries()) {
    console.log(`  ${n.padEnd(10)} ${String(queues[i].length).padStart(3)} distinct and certified, ` +
      `${pool.filter((p) => p.archetype === n).length} in the pool`);
  }
} else {
  // Keep the pool, re-prove it. A pool level that has lost its certificate is
  // dropped rather than dealt, and the pool gate reports the shortfall.
  const { POOL, POOL_SOLVER } = await import('../../js/dailyPool.js');
  console.log(`re-certifying the current pool of ${POOL.length}`);
  pool = [];
  for (const level of POOL) {
    const s = POOL_SOLVER[level.id];
    const cert = certify(level, s);
    console.log(`  ${level.id.padEnd(26)} ${String(cert.ink).padStart(4)}u  ${describe(cert)}`);
    if (cert.ok) pool.push({ level, s, cert, archetype: level.generated?.archetype });
    else reject('pool level lost its certificate');
  }
}

// ── twins ─────────────────────────────────────────────────────────────────
//
// Every thing in a level as a list of numbers, keyed by id, so two levels of
// one archetype compare part for part. A part present in one and not the other
// (a trigger with a rock against one without) is a different level outright.
function parts(lvl) {
  const out = new Map();
  const put = (id, o) => out.set(id, [o.x ?? 0, o.y ?? 0, o.w ?? 0, o.h ?? 0, o.radius ?? 0, o.vx ?? 0]);
  put('milo', lvl.milo.start);
  put('goal', lvl.goal);
  for (const s of lvl.static ?? []) put('s:' + s.id, s);
  for (const o of lvl.objects ?? []) put('o:' + o.id, o);
  for (const z of lvl.zones ?? []) put('z:' + z.id, z);
  return out;
}

function widest(a, b) {
  const pa = parts(a), pb = parts(b);
  if (pa.size !== pb.size) return Infinity;
  let w = 0;
  for (const [id, va] of pa) {
    const vb = pb.get(id);
    if (!vb) return Infinity;
    for (let i = 0; i < va.length; i++) w = Math.max(w, Math.abs(va[i] - vb[i]));
  }
  return w;
}

// ── the campaign ──────────────────────────────────────────────────────────
console.log('\ncertifying the campaign at its daily budgets');
const held = {};
const campaignCerts = [];
for (const [i, level] of LEVELS.entries()) {
  const cert = certify(level, SOLVER[level.id]);
  console.log(`  ${String(i + 1).padStart(2)}. ${level.id.padEnd(22)} ${String(cert.ink).padStart(4)}u  ${describe(cert)}`);
  if (cert.ok) campaignCerts.push({ level, cert });
  else held[level.id] = whyNot(cert);
}

// ── write ─────────────────────────────────────────────────────────────────
const poolSolver = {};
for (const { level, s } of pool) poolSolver[level.id] = s;

// The same shape as js/solutions.js, so the filmstrip films either — measured
// at the daily budget, which each entry records so a stale one can be spotted.
const solutions = {};
for (const { level, cert } of [...campaignCerts, ...pool]) {
  solutions[level.id] = {
    id: level.id,
    ink: cert.ink,
    winners: cert.rep.winners,
    robust: cert.rep.robust,
    anchoredRobust: cert.rep.anchoredRobust,
    handRate: cert.rep.handRate,
    solution: cert.rep.solution,
  };
}

const poolBody =
  '// GENERATED by tools/levelgen/bake.js — do not edit by hand.\n' +
  '//\n' +
  '// The DAILY DECK\'s generated half. POOL: levels dealt only by the daily —\n' +
  '// twins of levels 1-12 by construction, which is why they are not in LEVELS\n' +
  '// and why that does not matter where the challenge is the ink. POOL_SOLVER:\n' +
  '// their numbers, measured by the same sweep that writes js/solverData.js.\n' +
  '// HELD_FROM_DAILY: campaign levels with no hand-drawn win inside their daily\n' +
  '// budget, and the measurement that says so. They stay in the campaign.\n' +
  '//\n' +
  '// Re-bake after any physics change or campaign change: none of this\n' +
  '// re-measures itself, and tools/test/daily-deck.js fails until it is redone.\n' +
  '// Re-baking can change which levels the deck holds, and any change to the\n' +
  '// deck reshuffles EVERY future day. Do it before launch, not after.\n\n' +
  'export const POOL = ' + JSON.stringify(pool.map((p) => p.level), null, 2) + ';\n\n' +
  'export const POOL_SOLVER = ' + JSON.stringify(poolSolver, null, 2) + ';\n\n' +
  'export const HELD_FROM_DAILY = ' + JSON.stringify(held, null, 2) + ';\n';

const solBody =
  '// GENERATED by tools/levelgen/bake.js — do not edit by hand.\n' +
  '//\n' +
  '// The certificate for every level the daily deals, campaign and pool: a\n' +
  '// stroke the sweep proved wins INSIDE THE DAILY BUDGET (`ink`) and that a\n' +
  '// shaky hand keeps winning, with the counts measured at that budget. Tools\n' +
  '// only — the game never imports this, so it costs the bundle nothing.\n\n' +
  'export const DAILY_SOLUTIONS = ' + JSON.stringify(solutions, null, 2) + ';\n';

writeFileSync(new URL('../../js/dailyPool.js', import.meta.url), poolBody);
writeFileSync(new URL('../../js/dailySolutions.js', import.meta.url), solBody);

// ── report ────────────────────────────────────────────────────────────────
console.log('');
for (const [why, n] of Object.entries(rejected)) console.log(`  rejected ${String(n).padStart(3)}  ${why}`);
if (twins) console.log(`  twins    ${String(twins).padStart(3)}  dropped for a fairer twin`);
console.log('\n  pool                        archetype  breadth  daily ink  certified         hand at daily');
for (const { level, s, cert, archetype } of pool) {
  const sol = cert.rep.solution;
  console.log(
    `  ${level.id.padEnd(26)}  ${String(archetype).padEnd(9)} ${(s.solutionBreadth * 100).toFixed(1).padStart(6)}%  ` +
    `${String(cert.ink).padStart(7)}u  ${String(sol.length).padStart(4)}u ${sol.family.padEnd(5)} ${sol.anchors ? 'anchored' : 'dropped '}  ` +
    `${(cert.rep.handRate * 100).toFixed(0).padStart(3)}% (${cert.rep.robust}/${cert.rep.winners})`);
}
const heldIds = Object.keys(held);
console.log(`\n  campaign: ${campaignCerts.length} certified, ${heldIds.length} held from the daily` +
  (heldIds.length ? ` — ${heldIds.join(', ')}` : ''));
console.log(`\n→ js/dailyPool.js, js/dailySolutions.js — deck of ${campaignCerts.length + pool.length} ` +
  `(${campaignCerts.length} campaign + ${pool.length} pool)`);
if (pool.length < TARGET) {
  console.log(`\nSHORT: ${pool.length} of ${TARGET} pool levels. Run the generator again with a new --seed; do not loosen a filter.`);
  process.exit(1);
}
