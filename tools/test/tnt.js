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
//   - it never moves the player's anchored line;
//   - anything solid between it and a target shields that target — a wall or
//     the player's line saves Milo and saves a board — and the flash the
//     renderers draw stops at the wall too;
//   - it lights any other barrel it reaches, which goes off a beat later.

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

// 6. Cover: something solid between the barrel and Milo saves him.
{
  // He stands still 72u from a barrel that goes off: inside the kill radius.
  const stand = { milo: { start: { x: 230, y: 1152 }, speed: 0 }, objects: [barrel({ x: 320, fuse: 300 })] };
  const open = buildSim(level(stand));
  runTo(open, 500);
  check('in the open, the same blast kills him', open.run.outcome === OUTCOME.KILLED, open.run.outcome);
  destroySim(open);

  const wall = { id: 'wall', type: 'platform', x: 262, y: 1000, w: 16, h: 152 };
  const sim = buildSim(level({ ...stand, static: [...level().static, wall] }));
  runTo(sim, 500);
  check('behind a wall, he is shielded', sim.run.outcome === OUTCOME.RUNNING && sim.run.cause === null,
    `${sim.run.outcome}, cause ${sim.run.cause}`);
  check('and it counts as a close call', sim.closeCalls.some((c) => c.id === 'tnt'));
  const bl = sim.blasts[0];
  const towardHim = bl.reach[12];             // ray 12 of 24 points left, at him
  const away = bl.reach[0];                   // ray 0 points right, into open air
  check('the drawn blast stops at the wall', towardHim < 60 && away === bl.radius,
    `reach toward him ${towardHim.toFixed(0)}u, away ${away.toFixed(0)}u`);
  destroySim(sim);
}
{
  // The player's own line is cover too: that is the whole of TAKE COVER.
  const sim = buildSim(level({ milo: { start: { x: 230, y: 1152 }, speed: 0 }, objects: [barrel({ x: 320, fuse: 600 })] }));
  runTo(sim, 300);
  const res = commitStroke(sim, [{ x: 272, y: 1150 }, { x: 272, y: 1080 }, { x: 272, y: 1010 }]);
  check('a stroke between them commits', res.ok, res.ok ? '' : res.reason);
  runTo(sim, 800);
  check('the player\'s line shields him', sim.run.outcome === OUTCOME.RUNNING, sim.run.outcome);
  destroySim(sim);
}
{
  // A board behind a shelf is shielded; boards in a row never shield each other.
  const shelf = { id: 'shelf', type: 'platform', x: 330, y: 1060, w: 140, h: 16 };
  const under = { id: 'under', type: 'platform', x: 380, y: 1100, w: 40, h: 52, breakable: true };
  const sim = buildSim(level({
    milo: { start: { x: 60, y: 1152 }, speed: 0 },
    static: [...level().static, shelf, under],
    objects: [barrel({ x: 400, y: 1000, fuse: 300 })],
  }));
  runTo(sim, 500);
  check('a board under a shelf survives a blast on the shelf', sim.detonated.has('tnt') && !sim.broken.has('under'));
  destroySim(sim);
}
{
  // b2 stands directly behind b1 on the line from the barrel: if boards
  // shielded each other, b2 would survive.
  const b1 = { id: 'b1', type: 'platform', x: 440, y: 1088, w: 16, h: 64, breakable: true };
  const b2 = { id: 'b2', type: 'platform', x: 456, y: 1088, w: 30, h: 64, breakable: true };
  const sim = buildSim(level({
    milo: { start: { x: 60, y: 1152 }, speed: 0 },
    static: [...level().static, b2, b1],   // b2 first: checked while b1 still stands
  }));
  runTo(sim, 800);
  check('a board behind another board still breaks', sim.broken.has('b1') && sim.broken.has('b2'),
    `b1 ${sim.broken.has('b1')}, b2 ${sim.broken.has('b2')}`);
  destroySim(sim);
}

// 7. The chain: a blast lights the barrels it reaches.
{
  const sim = buildSim(level({
    milo: { start: { x: 60, y: 1152 }, speed: 0 },
    objects: [barrel({ id: 'a', x: 400, fuse: 600 }), barrel({ id: 'b', x: 480, fuse: 5000 }),
      barrel({ id: 'c', x: 690, fuse: 5000 })],
  }));
  runTo(sim, 1200);
  const a = sim.detonated.get('a'), b = sim.detonated.get('b');
  check('a barrel the blast reaches goes off a beat later', b !== undefined && b - a >= TNT.chain && b - a < TNT.chain + 10,
    `a ${a?.toFixed(0)}ms, b ${b?.toFixed(0)}ms`);
  check('a barrel out of reach does not', !sim.detonated.has('c'));
  destroySim(sim);
}
{
  const wall = { id: 'wall', type: 'platform', x: 432, y: 1000, w: 16, h: 152 };
  const sim = buildSim(level({
    milo: { start: { x: 60, y: 1152 }, speed: 0 },
    static: [...level().static, wall],
    objects: [barrel({ id: 'a', x: 400, fuse: 600 }), barrel({ id: 'b', x: 480, fuse: 5000 })],
  }));
  runTo(sim, 1200);
  check('a wall between them stops the chain', sim.detonated.has('a') && !sim.detonated.has('b'));
  destroySim(sim);
}

check('the default radii are the ones the levels are built on',
  TNT.radius === 130 && TNT.kill === 90 && TNT.push === 600 && TNT.chain === 150, JSON.stringify(TNT));

console.log(failed === 0 ? '\nTNT: PASS\n' : `\nTNT: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
