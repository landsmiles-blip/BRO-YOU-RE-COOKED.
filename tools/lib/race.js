// THE RACE CHECK — for every winning stroke, how long after Milo reaches the
// goal would the dog have lived?
//
//   npm run race -- level-id [level-id ...]
//
// A run ends the moment Milo reaches the goal, so a level can "win" while the
// dog is already on its way to dying: the census found INCOMING's dog trotting
// off the end of the world, and HEADS UP's back into its spike pit, a few
// hundred milliseconds after the finish. Those wins are a race decided by
// fractions of a second, and a player redrawing the same line by hand loses
// half of them. Every gate passed. This replays each winner with the goal
// moved out of reach and reports any whose dog dies within a second.
//
// A dog that has done its job needs somewhere safe to be: a post to pace
// against, or a kennel to drop into.

import { pathToFileURL } from 'node:url';
import { LEVELS } from '../../js/levels.js';
import { buildSim, stepSim, commitStroke, destroySim, OUTCOME } from '../../js/sim.js';
import { FREEZE_AT } from '../../js/constants.js';
import { samplingRegion } from '../solver/solve.js';
import { sweep } from '../solver/families.js';

function play(level, points, until) {
  const sim = buildSim(level);
  let committed = null, out = OUTCOME.RUNNING;
  while (out === OUTCOME.RUNNING && sim.simTime < until) {
    if (!committed && sim.simTime >= (level.freezeAt ?? FREEZE_AT)) {
      committed = commitStroke(sim, points);
      if (!committed.ok) { destroySim(sim); return null; }
    }
    out = stepSim(sim);
  }
  const r = { out, t: sim.simTime, dogsAlive: sim.dogs.every((d) => d.alive) };
  destroySim(sim);
  return r;
}

/** Margins (ms) between each win and the dog's death; Infinity if it lives. */
export function raceMargins(level, window = 6000) {
  const unreachable = { ...level, goal: { ...level.goal, x: -5000 } };
  const margins = [];
  for (const cand of sweep(samplingRegion(level), 1, level.static)) {
    const won = play(level, cand.points, 60000);
    if (!won || won.out !== OUTCOME.SUCCESS) continue;
    const on = play(unreachable, cand.points, won.t + window);
    margins.push(on.dogsAlive ? Infinity : on.t - won.t);
  }
  return margins;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let bad = 0;
  for (const id of process.argv.slice(2)) {
    const level = LEVELS.find((l) => l.id === id);
    if (!level) { console.log(`${id}: no such level`); bad++; continue; }
    const m = raceMargins(level);
    const close = m.filter((x) => x < 1000).length;
    const share = m.length ? close / m.length : 0;
    console.log(`${id}: ${m.length} wins; the dog dies within 1s of the finish in ${close}` +
      ` (${(share * 100).toFixed(0)}%)${share > 0.05 ? '  — A RACE' : ''}`);
    if (share > 0.05) bad++;
  }
  process.exit(bad ? 1 : 0);
}
