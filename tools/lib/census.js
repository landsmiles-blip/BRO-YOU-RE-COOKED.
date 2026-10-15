// THE MECHANISM CENSUS — HOW does each winning stroke win?
//
//   npm run census -- path/to/sketches.js [EXPORT ...]
//
// The gates count winners; they never ask what the winners DID. Two TNT
// levels passed every gate while their certified answer never used the noun
// at all (CLAUDE.md: "trace the certified winner and ask whether the noun is
// in it"), and tracing ONE winner shows one story out of hundreds. This runs
// the same sweep the solver does and sorts every winner by what happened in
// it — which barrels went off, early or on their fuse; whether a blast that
// had him in range was stopped by cover; which boards broke; which gates
// opened — so a level whose noun is missing from most of its wins shows up as
// a number, not a hunch.

import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { buildSim, stepSim, commitStroke, destroySim, OUTCOME } from '../../js/sim.js';
import { raycast } from '../../js/physics/adapter.js';
import { FREEZE_AT, RUN_TIMEOUT, PHYSICS_DT, TNT } from '../../js/constants.js';
import { samplingRegion } from '../solver/solve.js';
import { sweep } from '../solver/families.js';

const MAX_STEPS = Math.ceil(RUN_TIMEOUT / PHYSICS_DT) + 600;

/** Play one stroke and describe what happened, in words that can be counted. */
export function story(level, points) {
  const sim = buildSim(level);
  const freezeAt = level.freezeAt ?? FREEZE_AT;
  let committed = null, through = false;
  let out = OUTCOME.RUNNING;
  for (let i = 0; i < MAX_STEPS && out === OUTCOME.RUNNING; i++) {
    if (!committed && sim.simTime >= freezeAt) {
      // THROUGH: the stroke is drawn straight through a loose object. The
      // engine then shoves the object out of the line, which can win a level
      // without its puzzle ever being played.
      for (let k = 1; k < points.length && !through; k++) {
        const a = points[k - 1], b = points[k];
        through = raycast(sim.ctx, a.x, a.y, b.x, b.y, (part) => {
          const body = part.parent ?? part;
          return !body.isStatic && !body.isSensor && body !== sim.milo.body;
        }).length > 0;
      }
      committed = commitStroke(sim, points);
      if (!committed.ok) { destroySim(sim); return null; }
    }
    out = stepSim(sim);
  }
  const words = [];
  for (const [id, o] of sim.objects) {
    if (o.spec.type !== 'tnt') continue;
    const at = sim.detonated.get(id);
    if (at === undefined) words.push(`${id}:never`);
    else words.push(`${id}:${at < o.spec.fuse - 1 ? 'EARLY' : 'fuse'}`);
  }
  if (sim.closeCalls.some((c) => sim.blasts.some((b) => b.id === c.id) && c.gap === 0)) words.push('COVER');
  const broken = [...sim.broken.keys()];
  if (broken.length) words.push(`broke:${broken.length}`);
  const gates = level.objects.filter((o) => o.type === 'gate' && sim.triggered.has(o.id)).map((o) => o.id);
  if (gates.length) words.push(`opened:${gates.join(',')}`);
  // Who pressed each plate, and how often each dog turned: a plate the dog
  // was steered onto and one a dropped line fell on are different levels.
  for (const [plate, by] of sim.pressedBy) words.push(`${plate}<-${by}`);
  for (const dog of sim.dogs) words.push(`${dog.spec.id}:${dog.turns ? `turned${dog.turns}` : 'straight'}${dog.alive ? '' : ':LOST'}`);
  // THE SWARM: how much of it the line actually stopped. A bee level won with
  // no bee ever touching the line was won by something other than a shield.
  if (sim.bees?.length) {
    const hit = sim.bees.filter((b) => sim.causality.strokeTouched.has(b.id)).length;
    words.push(`bees:${hit === 0 ? 'NONE-ON-LINE' : hit * 2 >= sim.bees.length ? 'most-on-line' : 'some-on-line'}`);
  }
  words.push(committed.anchors ? 'anchored' : 'dropped');
  if (through) words.push('THROUGH');
  destroySim(sim);
  return { outcome: out, words: words.join(' ') };
}

export function census(level) {
  const tally = new Map();
  let wins = 0, tried = 0;
  for (const cand of sweep(samplingRegion(level), 1, level.static)) {
    const s = story(level, cand.points);
    if (!s) continue;
    tried++;
    if (s.outcome !== OUTCOME.SUCCESS) continue;
    wins++;
    const k = s.words;
    const e = tally.get(k) ?? { n: 0, families: new Map(), example: cand.points };
    e.n++;
    e.families.set(cand.family, (e.families.get(cand.family) ?? 0) + 1);
    tally.set(k, e);
  }
  return { wins, tried, tally: [...tally].sort((a, b) => b[1].n - a[1].n) };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [file, ...names] = process.argv.slice(2);
  const mod = await import(pathToFileURL(resolve(file)).href);
  const levels = Object.entries(mod).filter(([k, v]) => v?.id && v.static && (!names.length || names.includes(k)));
  for (const [, lvl] of levels) {
    const t0 = Date.now();
    const { wins, tried, tally } = census(lvl);
    console.log(`\n${lvl.id}: ${wins} wins of ${tried} plausible strokes  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    for (const [k, e] of tally) {
      const fam = [...e.families].map(([f, n]) => `${f} ${n}`).join(', ');
      const ex = e.example.map((p) => `${p.x.toFixed(0)},${p.y.toFixed(0)}`).join(' ');
      console.log(`  ${String(e.n).padStart(4)}  ${(100 * e.n / wins).toFixed(0).padStart(3)}%  ${k.padEnd(44)} [${fam}]  e.g. ${ex}`);
    }
  }
}
