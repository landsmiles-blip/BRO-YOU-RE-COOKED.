// BEES — a swarm from a hive that goes for whatever is alive.
//
// The element the case study picked (docs/CASE_STUDY.md). Save the Doge's one
// twist on the draw-a-line formula was a threat that comes from every side and
// FOLLOWS its victim. Everything else in this game falls, rolls or blows along
// a path the frozen frame already shows, so a line can be put where that path
// goes. A swarm has no path. It goes where HE goes, so the line has to stand
// between them for as long as he is out in the open.
//
// THE RULES, and why each one is the way it is:
//
//  - A bee flies at a steady speed toward the NEAREST living walker — Milo or
//    a dog — weaving either side of the straight line to it. The weave is what
//    makes a swarm find the end of a line instead of queueing behind one point
//    of it, which is the whole of the genre's tension: they slide along the
//    shield looking for a way round.
//  - Nothing about it is random at run time. The weave comes from a generator
//    seeded from the level and the hive, kept on the SIM, so the same stroke
//    gives the same swarm every time — the solver, the certificates and the
//    daily all replay a run and expect the same ending.
//  - Gravity does not apply to it: it flies.
//  - It is stopped by anything solid — the player's line, the level, a rock —
//    and passes through other bees, so a swarm spreads along a line rather than
//    piling into a ramp of its own bodies.
//  - One touch kills (lethal 'contact'), Milo or the dog alike.
//  - It weighs nothing, so it presses no plate and breaks no pane. A plate a
//    bee could press would be a plate the swarm decides, not the player.
//
// A hive is authored like any other object, x,y at its CENTRE because it has a
// radius:  { id, type: 'hive', x, y, radius, bees, releaseAt?, every? }
// It has no body. It is where bees come from, drawn from its spec by both
// renderers, and nothing can touch it.

import { addCircle, setVelocity, getVelocity, applyAccel } from './physics/adapter.js';
import { BEE, GRAVITY_Y } from './constants.js';

/** A small fast deterministic generator (mulberry32). */
function generator(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export const isBee = (spec) => spec?.type === 'bee';

/** Called once from buildSim, after Milo and the dogs exist. */
export function createSwarms(sim, level) {
  sim.hives = level.objects.filter((o) => o.type === 'hive');
  sim.bees = [];
  sim.beesOut = new Map();     // hive id -> how many it has released so far
  sim.beeRng = generator(hash(`${level.id}|${sim.hives.map((h) => h.id).join(',')}`));
}

/** The nearest thing a bee can sting. null when nothing is alive. */
function nearestTarget(sim, p) {
  let best = null, bd = Infinity;
  const consider = (body) => {
    const d = Math.hypot(body.position.x - p.x, body.position.y - p.y);
    if (d < bd) { bd = d; best = body; }
  };
  consider(sim.milo.body);
  for (const dog of sim.dogs) if (dog.alive) consider(dog.body);
  return best;
}

function release(sim, hive, k) {
  const R = sim.beeRng;
  const id = `${hive.id}#${k}`;
  const a = R() * Math.PI * 2;
  const r = (hive.radius ?? 24) * 0.35;
  const body = addCircle(sim.ctx, {
    id, x: hive.x + Math.cos(a) * r, y: hive.y + Math.sin(a) * r, radius: BEE.radius,
    density: BEE.density, friction: 0, frictionAir: 0, restitution: 0.3,
    // One negative group for every bee: Matter never collides two bodies that
    // share a negative group, and collides them with everything else as usual.
    collisionFilter: { group: BEE.group },
  });
  const spec = { id, type: 'bee', radius: BEE.radius, lethal: { kind: 'contact' }, hive: hive.id };
  sim.objects.set(id, { body, spec });
  // Out of the hive in a random direction, then the swarm turns on its own.
  setVelocity(body, Math.cos(a) * BEE.speed * 0.6, Math.sin(a) * BEE.speed * 0.6);
  sim.bees.push({ id, body, born: sim.simTime, phase: R() * Math.PI * 2, rate: 0.6 + R() * 0.8 });
}

/**
 * One step of the swarm: release whoever is due, then steer every bee. Runs
 * BEFORE the physics step so its velocities and its anti-gravity are what that
 * step integrates.
 */
export function stepBees(sim) {
  if (!sim.hives.length) return;
  const t = sim.simTime;
  for (const hive of sim.hives) {
    const every = hive.every ?? BEE.every;
    const from = hive.releaseAt ?? 0;
    let out = sim.beesOut.get(hive.id) ?? 0;
    while (out < hive.bees && t >= from + out * every) release(sim, hive, out++);
    sim.beesOut.set(hive.id, out);
  }
  for (const bee of sim.bees) {
    const p = bee.body.position;
    const target = nearestTarget(sim, p);
    let dx = 0, dy = 0;
    if (target) {
      dx = target.position.x - p.x; dy = target.position.y - p.y;
      const d = Math.hypot(dx, dy) || 1;
      dx /= d; dy /= d;
    }
    const weave = BEE.wander * Math.sin((t / 1000) * Math.PI * 2 * bee.rate + bee.phase);
    const c = Math.cos(weave), s = Math.sin(weave);
    const ux = dx * c - dy * s, uy = dx * s + dy * c;
    const v = getVelocity(bee.body);
    setVelocity(bee.body,
      v.x + (ux * BEE.speed - v.x) * BEE.steer,
      v.y + (uy * BEE.speed - v.y) * BEE.steer);
    applyAccel(bee.body, 0, -GRAVITY_Y);
  }
}
