// THE DOG — a second walker that turns around where Milo would stop.
//
// Everything a dog level is built on, asserted against real simulations so it
// cannot quietly stop being true:
//
//   - it walks at its own speed, the way it is facing;
//   - a wall it cannot step over TURNS it around — a stone one, and the
//     player's own anchored line;
//   - a line lying flat is a 16-unit lip it steps straight over, like Milo;
//   - it presses a weighed plate that no line the ink can buy will press;
//   - it is lost when it walks out of the world, falls into a lethal zone or
//     is caught by a blast, and the run ends with a label saying so;
//   - a line cannot be released through it, even between two far points;
//   - it does not stagger Milo when they meet, and it turns at him;
//   - and Milo walks exactly as he did before the dog shared his legs (the
//     daily deck replays every certificate and would fail if he did not).

import { buildSim, stepSim, commitStroke, destroySim, OUTCOME } from '../../js/sim.js';
import { DOG, LINE, MILO } from '../../js/constants.js';
import { assertLevel } from '../../js/levels.js';
import { STATE } from '../../js/milo.js';

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

const dog = (over = {}) => ({ id: 'dog', type: 'dog', x: 400, y: 1152, dir: -1, ...over });
const level = (over = {}) => ({
  id: 'dog-test', hint: 'TEST', world: 'backyard', verb: 'TEST',
  milo: { start: { x: 60, y: 760 }, speed: MILO.speed },
  freezeAt: 300,
  goal: { id: 'goal', x: 690, y: 760, w: 50, h: 140 },
  // Milo is parked on a ledge of his own, out of the dog's way, unless a test
  // wants them to meet.
  static: [
    { id: 'ground', type: 'platform', x: 0, y: 1152, w: 720, h: 128 },
    { id: 'perch', type: 'platform', x: 0, y: 760, w: 140, h: 20 },
    { id: 'stop', type: 'platform', x: 120, y: 700, w: 20, h: 60 },
  ],
  objects: [dog()],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
  ...over,
});

function runTo(sim, ms) {
  while (sim.simTime < ms && stepSim(sim) === OUTCOME.RUNNING) { /* step */ }
  return sim;
}
const dogOf = (sim) => sim.dogs[0];

console.log('\nTHE DOG — walks, turns at walls, presses plates, can be lost');

// 0. Data.
{
  let err = null;
  try { assertLevel(level({ objects: [dog({ dir: 0 })] })); } catch (e) { err = e.message; }
  check('a dog with no direction is rejected', !!err && /needs dir/.test(err), err ?? 'accepted');
  check('a dog needs no lethal spec of its own', (() => { try { return assertLevel(level()); } catch { return false; } })());
}

// 1. It walks the way it faces, at its own speed.
{
  const sim = runTo(buildSim(level()), 1000);
  const d = dogOf(sim);
  const v = (400 - d.body.position.x) / 1.0;
  check('it walks the way it faces, at about its own speed', d.dir === -1 && Math.abs(v - DOG.speed) < 30,
        `${v.toFixed(0)} u/s against ${DOG.speed}`);
  destroySim(sim);
}

// 2. A stone wall turns it around.
{
  const sim = buildSim(level({ static: [...level().static, { id: 'wall', type: 'platform', x: 300, y: 1060, w: 20, h: 92 }] }));
  runTo(sim, 1600);
  const d = dogOf(sim);
  check('a wall it cannot step over turns it around', d.dir === 1 && d.turns === 1 && d.body.position.x > 340,
        `dir ${d.dir}, turns ${d.turns}, x ${d.body.position.x.toFixed(0)}`);
  destroySim(sim);
}

// 3. The player's anchored line is a wall too.
{
  const sim = buildSim(level());
  runTo(sim, 300);
  const c = commitStroke(sim, [{ x: 250, y: 1060 }, { x: 250, y: 1150 }]);
  runTo(sim, 1800);
  const d = dogOf(sim);
  check("the player's anchored line turns it around", c.ok && c.anchors > 0 && d.turns >= 1 && d.dir === 1,
        `ok ${c.ok}, turns ${d.turns}, dir ${d.dir}`);
  destroySim(sim);
}

// 4. A line lying flat is a lip it steps over.
{
  const sim = buildSim(level());
  runTo(sim, 300);
  const c = commitStroke(sim, [{ x: 160, y: 1144 }, { x: 260, y: 1144 }]);
  runTo(sim, 1800);
  const d = dogOf(sim);
  check('a line lying flat is a step it walks straight over', c.ok && d.turns === 0 && d.body.position.x < 150,
        `turns ${d.turns}, x ${d.body.position.x.toFixed(0)}`);
  destroySim(sim);
}

// 5. A weighed plate: the dog presses it; no affordable line does.
{
  const plateLevel = (objects) => level({
    objects: [
      ...objects,
      { id: 'plate', type: 'switch', x: 200, y: 1126, w: 90, h: 26, triggers: ['gate'], requires: 'heavy', minMass: 150 },
      { id: 'gate', type: 'gate', x: 600, y: 960, w: 34, h: 192 },
    ],
    drawing: { maxLength: 400 },
  });
  const sim = runTo(buildSim(plateLevel([dog()])), 1600);
  check('it presses a weighed plate (minMass 150)', sim.triggered.has('plate') && sim.pressedBy.get('plate') === 'dog',
        `mass ${dogOf(sim).body.mass.toFixed(0)}, pressed by ${sim.pressedBy.get('plate') ?? 'nothing'}`);
  destroySim(sim);

  // The heaviest line 400 units of ink can buy, dropped flat on the plate.
  const s2 = buildSim(plateLevel([]));
  runTo(s2, 300);
  const c = commitStroke(s2, [{ x: 40, y: 1000 }, { x: 435, y: 1000 }]);
  runTo(s2, 2500);
  check('a line dropped on it never presses it', c.ok && !s2.triggered.has('plate'),
        `line mass ${s2.stroke?.mass.toFixed(0)}`);
  destroySim(s2);
}

// 6. Lost: out of the world, and into a lethal zone.
{
  const sim = buildSim(level());
  while (stepSim(sim) === OUTCOME.RUNNING) { /* run */ }
  check('walking out of the world ends the run: THE DOG RAN OFF',
        sim.run.outcome === OUTCOME.KILLED && sim.death?.label === 'THE DOG RAN OFF', sim.death?.label);
  destroySim(sim);

  const s2 = buildSim(level({ zones: [{ id: 'pit', kind: 'zone', x: 200, y: 1100, w: 80, h: 52, lethal: true }] }));
  while (stepSim(s2) === OUTCOME.RUNNING) { /* run */ }
  check('walking into a lethal zone ends the run: NOT THE DOG!',
        s2.run.outcome === OUTCOME.KILLED && s2.death?.label === 'NOT THE DOG!', s2.death?.label);
  destroySim(s2);
}

// 7. A blast takes it, unless something solid is in the way.
{
  const bomb = { id: 'tnt', type: 'tnt', x: 300, y: 1130, radius: 22, density: 0.03,
                 restitution: 0.05, friction: 0.4, fuse: 400, lethal: { kind: 'none' } };
  const sim = buildSim(level({ objects: [dog({ x: 380 }), bomb] }));
  while (stepSim(sim) === OUTCOME.RUNNING) { /* run */ }
  check('a blast it is inside ends the run: NOT THE DOG!', sim.death?.label === 'NOT THE DOG!', sim.death?.label);
  destroySim(sim);
}

// 8. No line through the dog — not even between two far-apart points.
{
  const sim = buildSim(level());
  runTo(sim, 300);
  const d = dogOf(sim).body.position;
  const c = commitStroke(sim, [{ x: d.x - 150, y: d.y }, { x: d.x + 150, y: d.y }]);
  check('a line cannot be released through it', !c.ok && c.reason === 'overlaps-dog', c.reason ?? 'accepted');
  destroySim(sim);
}

// 9. Meeting Milo: it turns at him and does not stagger him.
{
  const sim = buildSim(level({
    milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
    goal: { id: 'goal', x: 690, y: 1152, w: 50, h: 140 },
    static: [{ id: 'ground', type: 'platform', x: 0, y: 1152, w: 720, h: 128 }],
  }));
  let stunned = false;
  while (sim.simTime < 2500 && stepSim(sim) === OUTCOME.RUNNING) {
    if (sim.milo.state === STATE.STUNNED) stunned = true;
  }
  const d = dogOf(sim);
  check('it turns when it meets Milo', d.turns >= 1 && d.dir === 1, `turns ${d.turns}`);
  check('and Milo is not staggered by it', !stunned);
  destroySim(sim);
}

console.log(failed === 0 ? '\nDOG: PASS\n' : `\nDOG: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
