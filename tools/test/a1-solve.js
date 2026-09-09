// GATE TEST 3 — A1 is a real puzzle.
//
// Proves, without a human, that:
//   (a) doing nothing KILLS Milo — so the level actually threatens him, and
//   (b) the intended stroke SAVES him — so the level is solvable at all.
//
// The source spec's A1 passed neither. It dropped a ball into Milo's walking
// path, where it landed first and came to rest as a 56-unit obstacle against a
// 22-unit step-up: the level dead-ended in a stuck timeout even when the player
// blocked correctly. Nobody would have found that without running it.
//
// This is the seed of M1's full solver harness (Bible §3.8).

import { buildSim, stepSim, commitStroke, destroySim, OUTCOME } from '../../js/sim.js';
import { A1 } from '../../js/levels.js';
import { FREEZE_AT, RUN_TIMEOUT } from '../../js/constants.js';

let failures = 0;
const assert = (label, cond, detail = '') => {
  if (!cond) failures++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

/** Run A1 to completion, optionally committing a stroke at the freeze. */
function run(strokePoints) {
  const sim = buildSim(A1);
  const freezeAt = A1.freezeAt ?? FREEZE_AT;
  let committed = null, strokeY0 = null;

  for (let i = 0; i < (RUN_TIMEOUT / 8.333) + 400; i++) {
    if (strokePoints && !committed && sim.simTime >= freezeAt) {
      committed = commitStroke(sim, strokePoints);
      if (!committed.ok) break;
      strokeY0 = sim.stroke.position.y;
    }
    const o = stepSim(sim);
    if (o !== OUTCOME.RUNNING) {
      const r = {
        outcome: o, t: sim.simTime, death: sim.death, committed,
        strokeFell: sim.stroke && strokeY0 != null ? sim.stroke.position.y - strokeY0 : 0,
      };
      destroySim(sim);
      return r;
    }
  }
  const r = {
    outcome: 'never-ended', t: sim.simTime, death: sim.death, committed,
    strokeFell: sim.stroke && strokeY0 != null ? sim.stroke.position.y - strokeY0 : 0,
  };
  destroySim(sim);
  return r;
}

console.log('\nA1 — WALL   (does nothing kill him? does the intended stroke save him?)\n');

// (a) No stroke — the level must actually be dangerous.
const doNothing = run(null);
assert('doing nothing KILLS Milo', doNothing.outcome === OUTCOME.KILLED,
       `${doNothing.outcome} @ ${doNothing.t.toFixed(0)}ms "${doNothing.death?.label ?? ''}"`);
assert('the death is explained', !!doNothing.death?.label, doNothing.death?.label ?? 'none');
assert('the freeze lands BEFORE the danger',
       (A1.freezeAt ?? FREEZE_AT) < doNothing.t,
       `freeze ${A1.freezeAt ?? FREEZE_AT}ms vs death ${doNothing.t.toFixed(0)}ms`);

// (b) The intended solution — a stroke spanning the gap, touching both shelves.
const span = [{ x: 300, y: 790 }, { x: 400, y: 790 }, { x: 510, y: 790 }];
const solved = run(span);
assert('the intended stroke SAVES Milo', solved.outcome === OUTCOME.SUCCESS,
       `${solved.outcome} @ ${solved.t.toFixed(0)}ms`);
assert('the stroke anchored to the shelves', (solved.committed?.anchors ?? 0) > 0,
       `${solved.committed?.anchors ?? 0} anchor(s)`);

// (c) THE ANCHORING MECHANIC — anchored strokes hold, unanchored ones fall.
//
//     Note what this deliberately does NOT assert: that a floating stroke must
//     kill Milo. An earlier version did, and it was testing a design opinion
//     rather than a correctness property. In A1 a floating stroke still saves
//     him — it falls, but it delays the ball enough that he walks past, taking
//     2342ms against the clean solution's 1925ms. That is a worse, messier
//     answer, not a broken one, and multiple solutions are explicitly wanted.
//     A1 teaches BLOCK; anchoring is taught outright at level 3 (HANG), and the
//     first world is meant to feel generous.
const floating = [{ x: 355, y: 700 }, { x: 400, y: 700 }, { x: 445, y: 700 }];
const floated = run(floating);
assert('an unanchored stroke anchors to nothing', (floated.committed?.anchors ?? 0) === 0,
       `${floated.committed?.anchors ?? 0} anchor(s)`);
assert('an unanchored stroke FALLS', floated.strokeFell > 200,
       `fell ${floated.strokeFell.toFixed(0)}u`);
assert('an anchored stroke HOLDS', solved.strokeFell < 4,
       `moved ${solved.strokeFell.toFixed(0)}u`);

console.log(failures === 0 ? '\nA1: PASS\n' : `\nA1: ${failures} FAILURE(S)\n`);
process.exit(failures === 0 ? 0 : 1);
