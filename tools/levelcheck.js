// LEVEL PRE-FLIGHT — the cheap questions, asked before the expensive ones.
//
// A solver sweep costs ~50s per level and representative.js another ~55s. Both
// were spent twice on A20 for faults that took milliseconds to detect:
//
//   · the ball spawned INSIDE the goal's box, so the frozen frame showed the
//     thing that kills Milo sitting on the thing that saves him. Every numeric
//     gate passed. Only the screenshot showed it.
//   · the freeze landed 25ms AFTER the first contact, so the player never saw
//     the hazard move.
//
// Neither is a physics question, and neither needed a sweep. This runs every
// structural check that can be answered in one idle run, and refuses to let a
// dead design reach the gates.
//
// This does NOT replace the solver. It cannot tell you a level is fair, broad
// or tense — only that it is not obviously broken. Green here means "worth
// measuring", nothing more.
//
//   node tools/levelcheck.js            every shipping level
//   node tools/levelcheck.js a21-lever  just one

import { pathToFileURL } from 'node:url';
import { LEVELS, assertLevel } from '../js/levels.js';
import { buildSim, stepSim, destroySim } from '../js/sim.js';
import { playLevel, OUTCOME } from './test/lib/run-level.js';

const SAFE = { w: 720, h: 1280 };

/** The goal is authored as x=CENTRE, y=BASE — not as a top-left rect. */
function goalBox(level) {
  const g = level.goal;
  return { x0: g.x - g.w / 2, x1: g.x + g.w / 2, y0: g.y - g.h, y1: g.y };
}

/** Where a spec sits and how big it is, in one shape the checks can share. */
function objBox(spec, pos) {
  const r = spec.radius ?? 0;
  if (r) return { x0: pos.x - r, x1: pos.x + r, y0: pos.y - r, y1: pos.y + r };
  const w = spec.w ?? 0, h = spec.h ?? 0;
  return { x0: pos.x - w / 2, x1: pos.x + w / 2, y0: pos.y - h / 2, y1: pos.y + h / 2 };
}

const overlaps = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

/**
 * Where everything is standing the moment the world stops — the one frame the
 * player judges the whole level from.
 *
 * It has to be the position AT THE FREEZE, not the authored spawn. A20 was
 * authored at y=950, comfortably above a goal whose box starts at y=1012, and
 * still showed the ball sitting in the goal: by the time the world stopped it
 * had fallen to y=1103. Checking the spec would have called that level clean.
 */
function atFreeze(level) {
  const sim = buildSim(level);
  const until = level.freezeAt ?? 600;
  while (sim.simTime < until) stepSim(sim);
  const out = new Map();
  for (const [id, o] of sim.objects) out.set(id, { x: o.body.position.x, y: o.body.position.y });
  destroySim(sim);
  return out;
}

/**
 * Every noun this level owns that could be deleted for the A14 test.
 *
 * A PLAIN LETHAL ZONE IS NOT ONE. `kind: 'zone'` with `lethal: true` is a pit —
 * a marker that names a death, not a mechanism that causes one. Delete A4's pit
 * and the outcome is identical, because he falls out of the world regardless;
 * the pit exists so the screen says "HE'S GONE" over a drawn hazard instead of
 * over empty space. Testing those as mechanisms flagged three shipped, filmed,
 * playtested levels as decoration, which is the check being wrong.
 *
 * Only things that ACT on the physics belong here: air, springs, pivots.
 */
function nounsOf(level) {
  const out = [];
  for (const z of level.zones ?? []) {
    if (z.kind === 'zone') continue;
    out.push({ what: `zone "${z.id}" (${z.kind})`, drop: (l) => ({ ...l, zones: l.zones.filter((q) => q.id !== z.id) }) });
  }
  for (const s of level.static ?? []) {
    if (s.restitution) out.push({ what: `spring "${s.id}"`, drop: (l) => ({ ...l, static: l.static.map((q) => (q.id === s.id ? { ...q, restitution: 0 } : q)) }) });
    if (s.pivot) out.push({ what: `pivot "${s.id}"`, drop: (l) => ({ ...l, static: l.static.map((q) => (q.id === s.id ? { ...q, pivot: null } : q)) }) });
  }
  return out;
}

export function checkLevel(level, solution = null) {
  const issues = [];
  const notes = [];
  const hard = (m) => issues.push({ hard: true, m });
  const soft = (m) => issues.push({ hard: false, m });

  // 1. Schema.
  let err = null;
  try { assertLevel(level); } catch (e) { err = e.message; }
  if (err) { hard(`schema: ${err}`); return { issues, notes }; }

  // 2. Everything inside the safe box, at rest.
  for (const s of level.static ?? []) {
    if (s.x < 0 || s.y < 0 || s.x + s.w > SAFE.w || s.y + s.h > SAFE.h) {
      soft(`static "${s.id}" reaches outside the safe box — invisible at some ratio`);
    }
  }

  // 3. Doing nothing must FAIL, and say why.
  const idle = playLevel(level, null);
  if (idle.outcome === OUTCOME.SUCCESS) {
    hard('doing nothing WINS — this is not a level');
  } else if (!idle.death?.label) {
    soft(`doing nothing fails (${idle.outcome}) but the failure has no label to show the player`);
  } else {
    notes.push(`idle: ${idle.outcome} @${Math.round(idle.t)}ms "${idle.death.label}"`);
  }

  // 4. The freeze must land BEFORE the danger, with room to see it coming.
  const freeze = level.freezeAt ?? 600;
  if (idle.outcome !== OUTCOME.SUCCESS && idle.t <= freeze) {
    hard(`the freeze (${freeze}ms) lands AFTER the level is already over (${Math.round(idle.t)}ms)`);
  } else if (idle.t - freeze < 250) {
    soft(`only ${Math.round(idle.t - freeze)}ms between the freeze and the failure — the player cannot read it`);
  }

  // 5. SPAWN OVERLAP — the A20 fault. Nothing may sit inside the goal, or on
  //    top of Milo, in the frame the player is handed.
  const gb = goalBox(level);
  const mStart = level.milo.start;
  const mBox = { x0: mStart.x - 18, x1: mStart.x + 18, y0: mStart.y - 72, y1: mStart.y };
  const posAtFreeze = atFreeze(level);
  for (const o of level.objects ?? []) {
    if (o.type === 'gate' || o.type === 'switch') continue;
    const b = objBox(o, posAtFreeze.get(o.id) ?? { x: o.x, y: o.y });
    if (overlaps(b, gb)) hard(`"${o.id}" spawns INSIDE the goal box — the hazard is sitting on the exit`);
    if (overlaps(b, mBox)) hard(`"${o.id}" spawns on top of Milo`);
  }

  // 6. THE A14 TEST, automated: delete each noun and see whether anything moves.
  //    On the idle run alone this is only decisive when the noun is what kills
  //    him; with a certified solution it is decisive both ways, which is why
  //    the solution is passed in when one exists.
  for (const n of nounsOf(level)) {
    const without = n.drop(level);
    const idleOut = playLevel(without, null).outcome;
    let verdict = idleOut === idle.outcome ? 'idle unchanged' : `idle ${idle.outcome} -> ${idleOut}`;
    if (solution) {
      const withIt = playLevel(level, solution).outcome;
      const withoutIt = playLevel(without, solution).outcome;
      if (withIt === withoutIt && idleOut === idle.outcome) {
        hard(`A14: deleting ${n.what} changes NOTHING (idle and solved both identical) — it is decoration`);
        continue;
      }
      verdict += `, solved ${withIt} -> ${withoutIt}`;
    } else if (idleOut === idle.outcome) {
      soft(`A14: deleting ${n.what} leaves the idle run identical — re-check once it has a certified solution`);
      continue;
    }
    notes.push(`A14 ${n.what}: ${verdict}`);
  }

  return { issues, notes };
}

const isEntryPoint = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isEntryPoint) {
  const only = process.argv.slice(2).find((a) => !a.startsWith('--'));
  let SOLUTIONS = {};
  try { ({ SOLUTIONS } = await import('../js/solutions.js')); } catch { /* none yet */ }

  const targets = only ? LEVELS.filter((l) => l.id === only) : LEVELS;
  if (!targets.length) { console.log(`no level "${only}" in LEVELS`); process.exit(1); }

  console.log('\nLEVEL PRE-FLIGHT  (structure only — the solver still decides fair)\n');
  let hardCount = 0, softCount = 0;
  for (const lvl of targets) {
    const sol = SOLUTIONS[lvl.id]?.solution?.points ?? null;
    const { issues, notes } = checkLevel(lvl, sol);
    const n = LEVELS.indexOf(lvl) + 1;
    const bad = issues.filter((i) => i.hard).length;
    const meh = issues.length - bad;
    hardCount += bad; softCount += meh;
    const tag = bad ? 'FAIL' : meh ? 'warn' : ' ok ';
    console.log(`  ${tag}  ${String(n).padStart(2)}. ${lvl.id.padEnd(15)} ${lvl.verb}${sol ? '' : '   (no certified solution yet)'}`);
    for (const note of notes) console.log(`          ${note}`);
    for (const i of issues) console.log(`        ${i.hard ? '!!' : ' ·'} ${i.m}`);
  }
  console.log(hardCount ? `\n${hardCount} HARD failure(s), ${softCount} warning(s) — do not spend solver time yet\n`
                        : `\npre-flight OK${softCount ? ` (${softCount} warning(s))` : ''} — worth measuring\n`);
  process.exit(hardCount ? 1 : 0);
}
