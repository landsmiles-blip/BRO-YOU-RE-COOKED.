// GATE TEST — a slope is a road and a steep line is a wall, for anything that
// walks.
//
// The step-up used to read how tall a thing was from its whole bounding box.
// For a level's own platforms that is their top and nothing changes. For the
// player's LINE it was wrong in the way that matters most: a straight line
// drawn rising at 20 degrees simplifies to ONE part, and that part's box top
// is its FAR end. Begun 2 units above the floor, its near end was a lip a
// third of a step high, and Milo stopped dead in front of it because the box
// said 60. Begun 2 units lower — buried in the floor — the same line was a
// road. Four units of where a finger happened to land decided whether a ramp
// was a ramp, and nothing on screen said so.
//
// Measured when it was fixed: the held CLIMB level went from 0.3% of strokes
// winning to 1.3%, a plain ramp-up level from 0.8% to 2.5%, and no shipped
// level's certified stroke changed at all. These assert the rule itself, for
// Milo and the dog, so it cannot quietly come back.

import { buildSim, stepSim, commitStroke, destroySim, OUTCOME } from '../../js/sim.js';
import { MILO, LINE } from '../../js/constants.js';

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

const level = (over = {}) => ({
  id: 'walk-test', hint: 'TEST', world: 'backyard', verb: 'TEST',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 300,
  goal: { id: 'goal', x: 690, y: 900, w: 50, h: 140 },
  static: [
    { id: 'ground', type: 'platform', x: 0, y: 1152, w: 720, h: 128 },
    // Somewhere for him to stand when nothing about the test is about him.
    { id: 'perch', type: 'platform', x: 0, y: 700, w: 140, h: 20 },
  ],
  objects: [],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
  ...over,
});

/**
 * Run with one stroke committed at the freeze. Returns the sim, still alive,
 * and the highest point the walker's centre reached — a ramp that leads
 * nowhere is walked up and then off its end, so where he ENDS proves nothing.
 */
function play(lvl, points, ms, walker = (sim) => sim.milo.body) {
  const sim = buildSim(lvl);
  let c = null, top = Infinity;
  while (sim.simTime < ms) {
    if (points && !c && sim.simTime >= lvl.freezeAt) c = commitStroke(sim, points);
    if (stepSim(sim) !== OUTCOME.RUNNING) break;
    top = Math.min(top, walker(sim).position.y);
  }
  return { sim, c, top };
}

// One straight line from (200, 1152 - lift) rising at `deg` for 180 units.
const ramp = (lift, deg, x0 = 200, len = 180) => {
  const r = deg * Math.PI / 180;
  return [{ x: x0, y: 1152 - lift }, { x: x0 + Math.cos(r) * len, y: 1152 - lift - Math.sin(r) * len }];
};

console.log('\nWALKING — a slope is a road, a steep line is a wall');

// 1. Milo, a 20-degree line begun 2 units ABOVE the floor: he walks up it.
{
  const { sim, c, top } = play(level(), ramp(2, 20), 2400);
  check('a gentle line begun just above the floor is a ramp, not a wall', c.ok && top < 1080,
        `he climbed to y ${top.toFixed(0)} (standing is 1116)`);
  destroySim(sim);
}

// 2. The control: the same line begun 2 units BELOW the floor always worked.
{
  const { sim, c, top } = play(level(), ramp(-2, 20), 2400);
  check('and the same line begun just below the floor is the same ramp', c.ok && top < 1080,
        `he climbed to y ${top.toFixed(0)}`);
  destroySim(sim);
}

// 3. A line steeper than he can walk is still a wall.
{
  const { sim, c, top } = play(level(), ramp(2, 60, 200, 140), 2400);
  const m = sim.milo.body.position;
  check('a line steeper than he can walk is still a wall', c.ok && m.x < 200 && top > 1100,
        `he stopped at x ${m.x.toFixed(0)}, never above y ${top.toFixed(0)}`);
  destroySim(sim);
}

// 4. The dog walks up the same gentle line instead of turning at it ...
{
  const dogLevel = level({ objects: [{ id: 'dog', type: 'dog', x: 120, y: 1152, dir: 1 }],
                           milo: { start: { x: 60, y: 700 }, speed: MILO.speed } });
  const dogBody = (sim) => sim.dogs[0].body;
  const { sim, c, top } = play(dogLevel, ramp(2, 20, 230), 2600, dogBody);
  const d = sim.dogs[0];
  check('the dog walks up a gentle line rather than turning at it', c.ok && d.turns === 0 && top < 1100,
        `turns ${d.turns}, climbed to y ${top.toFixed(0)} (standing is 1137)`);
  destroySim(sim);

  // ... and turns at a steep one.
  const s2 = play(dogLevel, ramp(2, 60, 230, 140), 2200, dogBody);
  const d2 = s2.sim.dogs[0];
  check('and turns at a steep one', s2.c.ok && d2.turns >= 1 && d2.dir === -1,
        `turns ${d2.turns}, dir ${d2.dir}`);
  destroySim(s2.sim);
}

// 5. Only the LINE is read this way. A rock in his path is still pushed, not
//    climbed, even one small enough that its near side is under a step.
{
  const rockLevel = level({ objects: [{ id: 'rock', type: 'boulder', x: 260, y: 1140, radius: 12,
                                        density: 0.05, restitution: 0.1, friction: 0.4,
                                        lethal: { kind: 'none' } }] });
  const { sim } = play(rockLevel, null, 2400);
  const m = sim.milo.body.position, r = sim.objects.get('rock').body.position;
  check('a rock in his path is pushed, not climbed', m.y > 1100 && r.x > m.x,
        `Milo (${m.x.toFixed(0)}, ${m.y.toFixed(0)}), rock x ${r.x.toFixed(0)}`);
  destroySim(sim);
}

console.log(failed === 0 ? '\nWALK: PASS\n' : `\nWALK: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
