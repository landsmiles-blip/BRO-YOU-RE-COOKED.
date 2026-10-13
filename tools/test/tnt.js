// TNT — the blast does exactly what the levels will be built on.
//
// The engine was built once, before this file existed, and was lost
// uncommitted with the machine it was on. Everything a TNT level depends on is
// asserted here against real simulations, so it can never silently go missing
// or change again:
//
//   - it goes off at its fuse, wherever it is, and not a step before;
//   - it breaks breakable boards inside its radius and none outside it;
//   - it kills Milo inside the kill radius, with its own label, and spares him
//     outside it;
//   - it shoves loose bodies away from itself;
//   - it never moves the player's anchored line.

import { buildSim, stepSim, commitStroke, destroySim, OUTCOME } from '../../js/sim.js';
import { getVelocity } from '../../js/physics/adapter.js';
import { TNT, LINE, MILO } from '../../js/constants.js';
import { assertLevel } from '../../js/levels.js';

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

const barrel = (over = {}) => ({
  id: 'tnt', type: 'tnt', x: 400, y: 1130, radius: 22,
  density: 0.03, restitution: 0.05, friction: 0.4, fuse: 600, lethal: { kind: 'none' }, ...over,
});

const level = (over = {}) => ({
  id: 'tnt-test', hint: 'TEST', world: 'backyard', verb: 'TEST',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 300,
  goal: { id: 'goal', x: 690, y: 1152, w: 50, h: 140 },
  static: [{ id: 'ground', type: 'platform', x: 0, y: 1152, w: 720, h: 128 }],
  objects: [barrel()],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
  ...over,
});

/** Step until `ms` of sim time (or the run ends). */
function runTo(sim, ms) {
  while (sim.simTime < ms && stepSim(sim) === OUTCOME.RUNNING) { /* step */ }
  return sim;
}

console.log('\nTNT — fuse, blast, boards, kill radius, shove, the line');

// 0. The data rules.
{
  let err = null;
  try { assertLevel(level({ objects: [barrel({ fuse: 0 })] })); } catch (e) { err = e.message; }
  check('a barrel with no fuse is rejected as a bug', !!err && /no fuse/.test(err), err ?? 'accepted');
  let ok = true;
  try { assertLevel(level()); } catch { ok = false; }
  check('a well-formed TNT level passes assertLevel', ok);
}

// 1. The fuse: not a step early, and on time.
{
  const sim = buildSim(level({ milo: { start: { x: 60, y: 1152 }, speed: 0 } }));
  runTo(sim, 590);
  check('it has not gone off before its fuse', !sim.detonated.has('tnt'), `t=${sim.simTime.toFixed(0)}ms`);
  runTo(sim, 612);
  const at = sim.detonated.get('tnt');
  check('it goes off at its fuse', at !== undefined && at >= 600 && at < 612, `at ${at?.toFixed(1)}ms`);
  check('the blast is recorded where the barrel was', sim.blasts.length === 1 && Math.abs(sim.blasts[0].x - 400) < 30,
    sim.blasts[0] ? `(${sim.blasts[0].x.toFixed(0)}, ${sim.blasts[0].y.toFixed(0)})` : 'none');
  check('the barrel stops existing physically', sim.objects.get('tnt').body.collisionFilter.mask === 0);
  destroySim(sim);
}

// 2. Breakable boards: inside the radius break, outside do not.
{
  const near = { id: 'near', type: 'platform', x: 470, y: 1000, w: 30, h: 152, breakable: true };
  const far = { id: 'far', type: 'platform', x: 600, y: 1000, w: 30, h: 152, breakable: true };
  const sim = buildSim(level({
    milo: { start: { x: 60, y: 1152 }, speed: 0 },
    static: [...level().static, near, far],
  }));
  runTo(sim, 700);
  check('a breakable board inside the radius breaks', sim.broken.has('near'));
  check('a breakable board outside the radius does not', !sim.broken.has('far'));
  const nb = sim.statics.find((s) => s.spec.id === 'near').body;
  check('a broken board no longer collides', nb.collisionFilter.mask === 0);
  destroySim(sim);
}

// 3. The kill radius: inside dies with its own label, outside lives.
{
  // He walks right at his own speed; the barrel sits on his path ahead of him
  // and goes off as he reaches it.
  const sim = buildSim(level({ objects: [barrel({ x: 300, fuse: 900 })] }));
  runTo(sim, 1200);
  check('Milo inside the kill radius dies', sim.run.outcome === OUTCOME.KILLED, sim.run.outcome);
  check('the death is the blast\'s', sim.run.cause === 'blast', String(sim.run.cause));
  check('and the death cam says so', sim.death?.label === 'HE WAS TOO CLOSE', sim.death?.label ?? 'no label');
  destroySim(sim);
}
{
  const sim = buildSim(level({ milo: { start: { x: 60, y: 1152 }, speed: 0 }, objects: [barrel({ x: 600, fuse: 300 })] }));
  runTo(sim, 700);
  check('Milo outside the kill radius is spared', sim.run.outcome === OUTCOME.RUNNING && sim.run.cause === null,
    `${sim.run.outcome}, cause ${sim.run.cause}`);
  destroySim(sim);
}

// 4. The shove: a loose rock near the barrel is thrown away from it.
{
  const rock = { id: 'rock', type: 'boulder', x: 470, y: 1124, radius: 26, density: 0.03,
    restitution: 0.1, friction: 0.4, lethal: { kind: 'none' } };
  const sim = buildSim(level({ milo: { start: { x: 60, y: 1152 }, speed: 0 }, objects: [barrel(), rock] }));
  runTo(sim, 590);
  const before = getVelocity(sim.objects.get('rock').body).x;
  runTo(sim, 625);
  const after = getVelocity(sim.objects.get('rock').body).x;
  check('a loose body inside the radius is shoved away from the barrel', after > before + 100,
    `vx ${before.toFixed(0)} -> ${after.toFixed(0)} u/s`);
  destroySim(sim);
}

// 5. The player's anchored line is never moved by a blast.
{
  const sim = buildSim(level({ milo: { start: { x: 60, y: 1152 }, speed: 0 } }));
  runTo(sim, 300);
  const res = commitStroke(sim, [{ x: 330, y: 1150 }, { x: 345, y: 1080 }, { x: 360, y: 1010 }]);
  check('a stroke touching the ground commits and anchors', res.ok && sim.stroke?.isStatic === true,
    res.ok ? `static ${sim.stroke?.isStatic}` : res.reason);
  const x0 = sim.stroke?.position.x, y0 = sim.stroke?.position.y;
  runTo(sim, 900);
  const moved = sim.stroke ? Math.hypot(sim.stroke.position.x - x0, sim.stroke.position.y - y0) : NaN;
  check('the blast never moves the anchored line', moved < 0.01, `moved ${moved.toFixed(3)}u`);
  destroySim(sim);
}

check('the default radii are the ones the levels are built on', TNT.radius === 130 && TNT.kill === 90 && TNT.push === 600,
  JSON.stringify(TNT));

console.log(failed === 0 ? '\nTNT: PASS\n' : `\nTNT: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
