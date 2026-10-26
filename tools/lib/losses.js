// THE LOSS CENSUS — for every LOSING stroke of a sweep, why did it lose?
//
//   npm run losses -- level-id [level-id ...]     (no ids: every level)
//
// The census sorts winners by what happened in them; this sorts the losers,
// which is what a player sees most of the time. It exists because of a level a
// person called unplayable while every gate was green. On GOOD BOY (26 Oct)
// the dog walked onto the rounded foot of the player's line and hung there,
// propped up, never walking or turning, until the run ended "HE'S STUCK" — and
// nothing in the gates looked at HOW lines lose. Sorted this way it was a
// number: dozens of losses per dog level where the dog never moved again.
//
// Each losing stroke is filed under its death label (what the player reads),
// and two things no label says are counted beside it:
//   - DOG HELD: a dog standing still on something for 3s or more without
//     turning — the trap above; the dog now turns after 2s (DOG.stallMs), so
//     any of these is a regression;
//   - and the share of losses that are THE GATE STAYED SHUT, the commonest
//     loss on every plate-and-gate level, where what failed is whatever was
//     meant to press the plate.
//
// It is the losing half of "sort the strokes by what happened before choosing
// a lever" (CLAUDE.md). Run it on every new level beside the census.

import { LEVELS } from '../../js/levels.js';
import { buildSim, stepSim, commitStroke, destroySim, OUTCOME } from '../../js/sim.js';
import { FREEZE_AT, RUN_TIMEOUT, PHYSICS_DT } from '../../js/constants.js';
import { samplingRegion } from '../solver/solve.js';
import { sweep } from '../solver/families.js';

const MAX_STEPS = Math.ceil(RUN_TIMEOUT / PHYSICS_DT) + 600;
const HELD_MS = 3000;

const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const levels = ids.length ? LEVELS.filter((l) => ids.includes(l.id)) : LEVELS;
if (ids.length && levels.length !== ids.length) {
  console.error(`unknown level id: ${ids.filter((id) => !LEVELS.some((l) => l.id === id)).join(', ')}`);
  process.exit(1);
}

let regressions = 0;
for (const level of levels) {
  const tally = new Map();
  let plausible = 0, wins = 0, held = 0;
  for (const cand of sweep(samplingRegion(level), 1, level.static)) {
    const sim = buildSim(level);
    const freezeAt = level.freezeAt ?? FREEZE_AT;
    let committed = null, out = OUTCOME.RUNNING, worst = 0;
    const watch = sim.dogs.map(() => ({ x: null, at: 0, turns: 0, landed: 0 }));
    for (let i = 0; i < MAX_STEPS; i++) {
      if (!committed && sim.simTime >= freezeAt) {
        committed = commitStroke(sim, cand.points);
        if (!committed.ok) break;
      }
      out = stepSim(sim);
      sim.dogs.forEach((d, k) => {
        const w = watch[k], x = d.body.position.x;
        if (d.grounded) w.landed = sim.simTime;
        if (w.x == null || d.turns !== w.turns || (x - w.x) * d.dir > 10) {
          w.x = x; w.at = sim.simTime; w.turns = d.turns;
        } else if (committed && d.alive && sim.simTime - w.landed < 400) {
          worst = Math.max(worst, sim.simTime - w.at);
        }
      });
      if (out !== OUTCOME.RUNNING) break;
    }
    if (committed?.ok) {
      plausible++;
      if (worst >= HELD_MS) held++;
      if (out === OUTCOME.SUCCESS) wins++;
      else {
        const label = sim.death?.label ?? out;
        tally.set(label, (tally.get(label) ?? 0) + 1);
      }
    }
    destroySim(sim);
  }
  const losses = plausible - wins;
  const rows = [...tally].sort((a, b) => b[1] - a[1])
    .map(([label, n]) => `${String(n).padStart(5)}  ${(100 * n / Math.max(1, losses)).toFixed(0).padStart(3)}%  ${label}`);
  console.log(`\n${level.id}  — ${plausible} plausible strokes, ${wins} win, ${losses} lose`);
  for (const r of rows) console.log(`  ${r}`);
  if (held) {
    regressions++;
    console.log(`  DOG HELD ${HELD_MS / 1000}s+ WITHOUT TURNING in ${held} run(s) — the GOOD BOY trap is back`);
  }
}
if (regressions) {
  console.log(`\n${regressions} level(s) hold a dog still — see js/milo.js, updateDog`);
  process.exit(1);
}
