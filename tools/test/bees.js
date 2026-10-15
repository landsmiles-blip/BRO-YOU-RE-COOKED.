// GATE TEST — the swarm (js/bees.js).
//
// Bees are the case study's element: a threat that comes from every side and
// follows its victim, stopped only by something solid in the way. These hold
// the rules each level is built on, so a later change to the engine cannot
// quietly turn a swarm into something else — a swarm that presses plates, one
// that falls, one that piles up into a ramp of its own bodies, or one that
// plays out differently on the second run of the same stroke.

import { buildSim, stepSim, commitStroke, destroySim, OUTCOME } from '../../js/sim.js';
import { assertLevel } from '../../js/levels.js';
import { MILO, LINE, BEE } from '../../js/constants.js';

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

// A walk to a door, with a hive hanging over the middle of it.
const level = (over = {}) => ({
  id: 'bees-test', hint: 'TEST', world: 'backyard', verb: 'TEST',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 600,
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  static: [
    { id: 'ground', type: 'platform', x: 0, y: 1152, w: 720, h: 128 },
    { id: 'wall', type: 'platform', x: 0, y: 900, w: 20, h: 252 },
    { id: 'shed', type: 'platform', x: 620, y: 990, w: 100, h: 20 },
    { id: 'branch', type: 'platform', x: 300, y: 600, w: 160, h: 16 },
  ],
  objects: [{ id: 'hive', type: 'hive', x: 380, y: 646, radius: 26, bees: 12 }],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
  ...over,
});

const line = (...pts) => pts.map(([x, y]) => ({ x, y }));
// A roof from the shed back over his walk, high enough to walk under.
const ROOF = line([630, 1000], [400, 1000], [150, 1000]);

function play(lvl, points, ms = 9000, each = null) {
  const sim = buildSim(lvl);
  let c = null;
  while (sim.simTime < ms) {
    if (points && !c && sim.simTime >= lvl.freezeAt) c = commitStroke(sim, points);
    const o = stepSim(sim);
    if (each) each(sim);
    if (o !== OUTCOME.RUNNING) break;
  }
  return { sim, c };
}

console.log('\nBEES — a swarm from a hive, stopped only by something solid');

// 1. Nothing drawn: the swarm gets him, and the label says how.
{
  const { sim } = play(level(), null);
  check('with nothing drawn, the swarm stings him', sim.run.outcome === OUTCOME.KILLED && sim.run.cause === 'stung',
    `${sim.run.outcome} at ${sim.simTime.toFixed(0)}ms, cause ${sim.run.cause}`);
  check('and the death is explained as a sting', sim.death?.label === 'STUNG!', `"${sim.death?.label}"`);
  check('by a bee, which the replay can ring', sim.objects.get(sim.run.culpritId)?.spec.type === 'bee',
    `culprit ${sim.run.culpritId}`);
  destroySim(sim);
}

// 2. A roof over his walk, reaching the door: the swarm lands on it and he
//    walks home underneath.
{
  const { sim, c } = play(level(), ROOF);
  const onLine = [...sim.causality.strokeTouched].filter((id) => sim.objects.get(id)?.spec.type === 'bee').length;
  check('a roof that reaches the door gets him home', c.ok && sim.run.outcome === OUTCOME.SUCCESS,
    `${sim.run.outcome}`);
  check('because the swarm was stopped by the line', onLine >= 6, `${onLine} of 12 bees touched it`);
  destroySim(sim);
}

// 3. A roof that stops short: they come round the end of it.
{
  const { sim } = play(level(), line([10, 1000], [200, 1000], [400, 1000]));
  check('a roof that stops short is not enough — they come round the end', sim.run.cause === 'stung',
    `${sim.run.outcome} at ${sim.simTime.toFixed(0)}ms with Milo at x ${sim.milo.body.position.x.toFixed(0)}`);
  destroySim(sim);
}

// 4. The same stroke gives the same swarm, step for step.
{
  const trace = () => {
    const out = [];
    const { sim } = play(level(), ROOF, 2000, (s) => { for (const b of s.bees) out.push(b.body.position.x, b.body.position.y); });
    destroySim(sim);
    return out;
  };
  const a = trace(), b = trace();
  const same = a.length === b.length && a.every((v, i) => v === b[i]);
  check('the same stroke gives the same swarm, bit for bit', same, `${a.length / 2} bee-steps compared`);
}

// 5. Bees pass through bees: no swarm piles into a ramp of its own bodies.
{
  const sim = buildSim(level());
  let beeOnBee = 0;
  const { _matter: M } = await import('../../js/physics/adapter.js');
  M.Events.on(sim.ctx.engine, 'collisionStart', (e) => {
    for (const p of e.pairs) {
      if (sim.objects.get(p.bodyA.gameId)?.spec.type === 'bee' && sim.objects.get(p.bodyB.gameId)?.spec.type === 'bee') beeOnBee++;
    }
  });
  while (sim.simTime < 1500 && stepSim(sim) === OUTCOME.RUNNING);
  check('bees never collide with bees', beeOnBee === 0 && sim.bees.length === 12, `${beeOnBee} bee-on-bee contacts`);
  destroySim(sim);
}

// 6. A bee weighs nothing: it flies through a plate without pressing it.
{
  const lvl = level({
    objects: [
      { id: 'hive', type: 'hive', x: 380, y: 646, radius: 26, bees: 12 },
      // A plate hanging square in the swarm's way, and the gate it would open.
      { id: 'plate', type: 'switch', x: 200, y: 820, w: 220, h: 14, triggers: ['gate'] },
      { id: 'gate', type: 'gate', x: 560, y: 1032, w: 20, h: 120 },
    ],
  });
  let crossed = 0;
  const { sim } = play(lvl, null, 9000, (s) => {
    for (const b of s.bees) if (b.body.position.y > 834 && b.body.position.x > 200 && b.body.position.x < 420) crossed++;
  });
  check('a bee cannot press a plate', crossed > 0 && !sim.triggered.has('plate'),
    `bees were past it ${crossed} bee-steps; plate ${sim.triggered.has('plate') ? 'PRESSED' : 'untouched'}`);
  destroySim(sim);
}

// 7. Or break a pane, however fast it is going.
{
  const lvl = level({
    static: [...level().static, { id: 'pane', type: 'platform', x: 200, y: 900, w: 300, h: 14, brittle: 150 }],
  });
  const sim = buildSim(lvl);
  const pane = sim.statics.find((st) => st.spec.id === 'pane').body;
  let hits = 0;
  const { _matter: M } = await import('../../js/physics/adapter.js');
  M.Events.on(sim.ctx.engine, 'collisionStart', (e) => {
    for (const p of e.pairs) {
      const bee = [p.bodyA, p.bodyB].some((b) => sim.objects.get(b.gameId)?.spec.type === 'bee');
      if (bee && (p.bodyA === pane || p.bodyB === pane)) hits++;
    }
  });
  while (sim.simTime < 4000 && stepSim(sim) === OUTCOME.RUNNING);
  check('a bee cannot break a pane', hits > 0 && !sim.shattered.has('pane'),
    `${hits} bee hits; pane ${sim.shattered.has('pane') ? 'SHATTERED' : 'whole'}`);
  destroySim(sim);
}

// 8. They go for the NEAREST living thing: a dog under the hive is stung first.
{
  const lvl = level({
    // Milo well out of the way and standing still, the dog walking under a
    // low hive: from the hive the dog is 240 away and Milo 600.
    milo: { start: { x: 60, y: 400 }, speed: 0 },
    static: [...level().static, { id: 'perch', type: 'platform', x: 0, y: 400, w: 120, h: 20 }],
    objects: [
      { id: 'hive', type: 'hive', x: 380, y: 900, radius: 26, bees: 12 },
      { id: 'dog', type: 'dog', x: 380, y: 1152, dir: 1 },
    ],
  });
  const { sim } = play(lvl, null);
  check('they go for whatever is nearest — here, the dog', sim.run.cause === 'dog' && sim.death?.label === 'NOT THE DOG!',
    `${sim.run.outcome}, cause ${sim.run.cause}, "${sim.death?.label}"`);
  destroySim(sim);
}

// 9. They fly. With the weave taken out, a swarm level with Milo flies level
//    at him; with gravity acting on it, it would sag about 60 units in half a
//    second while the steering fought it.
{
  const lvl = level({
    milo: { start: { x: 60, y: 668 }, speed: 0 },
    static: [...level().static, { id: 'perch', type: 'platform', x: 0, y: 668, w: 120, h: 20 }],
    objects: [{ id: 'hive', type: 'hive', x: 600, y: 632, radius: 26, bees: 4 }],
  });
  const wander = BEE.wander;
  BEE.wander = 0;
  let sum = 0, n = 0;
  const { sim } = play(lvl, null, 1000, (s) => {
    if (s.simTime < 300) return;
    for (const b of s.bees) { sum += b.body.position.y; n++; }
  });
  BEE.wander = wander;
  const sag = sum / n - 632;
  check('gravity does not apply to a bee', Math.abs(sag) < 8, `mean height ${sag.toFixed(1)} units from his`);
  destroySim(sim);
}

// 10. A hive is checked like any other object.
{
  let threw = false;
  try { assertLevel(level({ objects: [{ id: 'hive', type: 'hive', x: 380, y: 646, radius: 26, bees: 0 }] })); } catch { threw = true; }
  check('a hive that releases no bees is refused', threw);
}

console.log(`  (a bee: radius ${BEE.radius}, ${BEE.speed} u/s, weaving ${BEE.wander} rad)`);
console.log(failed === 0 ? '\nBEES: PASS\n' : `\nBEES: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
