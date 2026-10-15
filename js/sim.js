// The simulation — builds a level into a physics world and steps it.
//
// Retry is a FULL teardown and rebuild from level data (Bible §5.3). No reused
// world, no accumulated state. That is what makes determinism real and what
// makes the ghost-stroke comparison meaningful: the only thing that differs
// between two attempts is the stroke.

import {
  createWorld, destroyWorld, addRect, addCircle, setVelocity, step as physStep,
  onCollisionStart, allBodies, getSpeed, getVelocity, applyAccel, addPivot, addCross,
  removeBody, setAngularVelocity, setStatic, raycast,
} from './physics/adapter.js';
import { createMilo, updateMilo, updateDanger, stun, STATE, createDog, updateDog } from './milo.js';
import { createRunState, checkRunEnd, kill, OUTCOME } from './run.js';
import { isFatal, normalSpeed, isHazardous, inLethalZone } from './hazards.js';
import { createCausality, noteContact, explain } from './physics/causality.js';
import { createRecorder, record, reset as resetRec } from './physics/recorder.js';
import { validate } from './drawing/validate.js';
import { classify } from './drawing/classify.js';
import { buildStrokeBody } from './drawing/bodyFactory.js';
import { anchorStroke } from './physics/anchor.js';
import * as audio from './audio.js';
import { simplify } from './drawing/simplify.js';
import { createSwarms, stepBees, isBee } from './bees.js';
import { PHYSICS_DT, LINE, MILO, DOG, SAFE_BOX, NEAR_MISS_DIST, CLOSE_CALL, TNT } from './constants.js';

export function buildSim(level) {
  const ctx = createWorld();
  const sim = {
    ctx, level,
    milo: null, goal: level.goal,
    objects: new Map(),      // gameId → { body, spec }
    dogs: [],                // walk state for each dog (js/milo.js); also in `objects`
    statics: [],
    zones: level.zones ?? [],
    stroke: null,            // committed stroke body
    anchors: [],
    run: createRunState(),
    // Which gates have been opened. The schema carried `triggers` from the
    // start but nothing ever implemented it, so the design bible's own
    // headline moment — something hits a switch, a gate opens, Milo walks
    // through — was unbuildable. This is that.
    triggered: new Set(),
    // Who pressed each plate first — the census reads it to tell a plate the
    // dog pressed from one a dropped line pressed.
    pressedBy: new Map(),
    // Which balloons have been burst. On the SIM and never on the spec: level
    // data is shared across every run in a solver sweep, so mutating a spec
    // would leak one run's pop into the next 2500.
    burst: new Set(),
    // Which brittle panes have shattered. Same reasoning as `burst` above, and
    // the same trap avoided: a sweep shares one level object across 2,500 runs,
    // so a pane that recorded its own break on the spec would arrive already
    // broken for every run after the first.
    shattered: new Set(),
    // TNT, per run for the same reason: which barrels have gone off and when,
    // which breakable boards they broke and when (the death cam replays the
    // past, so it needs the TIME, not just the fact), and where each blast was.
    detonated: new Map(),
    broken: new Map(),
    blasts: [],
    // Barrels another blast has lit: id -> the time it goes off, if that is
    // sooner than its own fuse.
    lit: new Map(),
    causality: createCausality(),
    recorder: createRecorder(),
    simTime: 0,
    death: null,
    closeCalls: [],      // near misses this run — the game's whole personality
    _near: new Map(),    // per-hazard: is it currently inside the radius?
  };

  // ONE COORDINATE RULE, no exceptions:
  //   anything with w/h  → x,y is its TOP-LEFT corner
  //   anything with radius → x,y is its CENTRE
  //
  // This was two rules before — top-left for static geometry, centre for
  // objects — and it produced exactly the silent bug that kind of split
  // always produces: A9's gate was authored as top-left, built as centre, and
  // ended up hanging 70 units above the ground with Milo strolling underneath
  // it. Every test passed. The level simply was not a puzzle.
  for (const s of level.static) {
    const body = addRect(ctx, {
      id: s.id, x: s.x + s.w / 2, y: s.y + s.h / 2, w: s.w, h: s.h,
      angle: (s.angle ?? 0) * Math.PI / 180, isStatic: true,
      friction: s.friction ?? 0.7,
    });
    // MATTER SILENTLY ZEROES RESTITUTION ON EVERY STATIC BODY. Body.setStatic()
    // runs inside Bodies.rectangle() and forces restitution=0 and friction=1,
    // so passing `restitution` in the options above is discarded without a
    // word. Measured: a pad asked for 0.85 reported 0.00 and a ball dropped
    // 258u rebounded 2u. Assigning AFTER creation sticks — the same ball then
    // rebounds 119u — which is the only reason a springy surface can exist.
    //
    // ONLY RESTITUTION IS CORRECTED HERE. Static friction has always been 1 in
    // this game for exactly the same reason, and every measured star threshold
    // and solver breadth in js/solverData.js was produced under it. "Fixing" it
    // would silently re-tune thirteen shipped levels. Matter pairs friction
    // with Math.min(a, b) and every dynamic body here sits far below 1, so the
    // value is not observable anyway.
    if (s.restitution) body.restitution = s.restitution;

    // A PIVOT MAKES THIS STATIC INTO A MOVING PART. It is authored on `static`
    // because that is where the level's geometry lives and where the renderer
    // already looks, but a pinned piece is emphatically NOT static: it is a
    // dynamic body held at one point, so it must be built dynamic and pinned.
    //
    // `pivot` is {x, y} in world units — the point it turns about, usually its
    // own centre for a see-saw and one end for a swinging arm.
    if (s.pivot) {
      removeBody(ctx, body);
      const opts = {
        angle: (s.angle ?? 0) * Math.PI / 180,
        density: s.density ?? 0.008,
        friction: s.friction ?? 0.4,
        frictionAir: s.frictionAir ?? 0.01,
      };
      const geom = { id: s.id, x: s.x + s.w / 2, y: s.y + s.h / 2, w: s.w, h: s.h };
      // `blades` turns one bar into a paddle wheel. One blade is a lever.
      const moving = s.blades > 1
        ? addCross(ctx, { ...geom, ...opts, blades: s.blades })
        : addRect(ctx, { ...geom, ...opts });
      if (s.restitution) moving.restitution = s.restitution;
      addPivot(ctx, moving, s.pivot.x, s.pivot.y);

      // SPIN makes it a powered machine rather than a thing that waits to be
      // pushed. Raw Matter angular units, which is what the probe measured in:
      // 0.30 throws a ball 659 units and lands it within 17u from anywhere in
      // the feed zone; 0.12 is SLOWER and less consistent (228u spread), so do
      // not assume gentler is tamer here.
      if (s.spin) setAngularVelocity(moving, s.spin);

      sim.statics.push({ body: moving, spec: s, pivoted: true });
      continue;
    }
    sim.statics.push({ body, spec: s });
  }

  for (const o of level.objects) {
    // A HIVE HAS NO BODY. It is where bees come from (js/bees.js builds them
    // as they leave it), and both renderers draw it from its spec.
    if (o.type === 'hive') continue;
    // THE DOG walks on Milo's legs (js/milo.js), so it is built there and its
    // walk state kept in sim.dogs — and it is registered as an object like any
    // other, so plates, the recorder and both renderers find it by its id.
    if (o.type === 'dog') {
      const dog = createDog(ctx, o);
      sim.dogs.push(dog);
      sim.objects.set(o.id, { body: dog.body, spec: o });
      continue;
    }
    let body;
    const cx = o.w ? o.x + o.w / 2 : o.x;      // top-left → centre for rects
    const cy = o.h ? o.y + o.h / 2 : o.y;
    if (o.type === 'switch') {
      // A pressure plate. Static and non-colliding: it detects, it never blocks.
      body = addRect(ctx, { id: o.id, x: cx, y: cy, w: o.w, h: o.h, isStatic: true });
      body.isSensor = true;
    } else if (o.type === 'gate') {
      // Solid until something opens it.
      body = addRect(ctx, { id: o.id, x: cx, y: cy, w: o.w, h: o.h, isStatic: true, friction: 0.6 });
    } else if (o.radius) {
      body = addCircle(ctx, {
        id: o.id, x: o.x, y: o.y, radius: o.radius,
        density: o.density, restitution: o.restitution, friction: o.friction ?? 0.4,
        ...(o.frictionAir != null ? { frictionAir: o.frictionAir } : {}),
      });
    } else {
      body = addRect(ctx, {
        id: o.id, x: cx, y: cy, w: o.w, h: o.h,
        angle: (o.angle ?? 0) * Math.PI / 180,
        density: o.density, restitution: o.restitution, friction: o.friction ?? 0.4,
      });
    }
    // Level-authored initial velocity — a roller that is already moving when
    // the world starts, so the freeze catches it mid-approach.
    if (o.vx || o.vy) setVelocity(body, o.vx ?? 0, o.vy ?? 0);
    sim.objects.set(o.id, { body, spec: o });
  }

  sim.milo = createMilo(ctx, level);
  createSwarms(sim, level);

  onCollisionStart(ctx, (a, b, pair) => {
    const speed = normalSpeed(a, b, pair);
    noteContact(sim.causality, a, b, sim.simTime, speed);

    // The SAME number that decides lethality drives the sound, so what you hear
    // is what nearly killed him. Milo's own footsteps are excluded: he makes
    // ground contact every step at 220 u/s of tangential motion, and the normal
    // component of a footfall is small but not zero.
    // A bee is not an impact: a swarm pressing on a line would be a drum roll.
    const bee = isBee(sim.objects.get(a.gameId)?.spec) || isBee(sim.objects.get(b.gameId)?.spec);
    if (bee) {
      audio.buzz();
    } else if (a.gameId !== 'milo' && b.gameId !== 'milo') {
      audio.impact(speed, { heavy: (a.mass ?? 0) + (b.mass ?? 0) > 120 });
    } else if (speed > 140) {
      audio.impact(speed, { heavy: false });
    }

    // Switch → gate. Anything with mass can press a plate, which is the point:
    // the player does not touch the switch, they arrange for something else to.
    for (const [hit, other] of [[a, b], [b, a]]) {
      const entry = sim.objects.get(hit.gameId);
      if (!entry || entry.spec.type !== 'switch') continue;
      if (other.isSensor) continue;
      // A bee weighs nothing. A plate it could press would be one the swarm
      // decides, not the player.
      if (isBee(sim.objects.get(other.gameId)?.spec)) continue;
      if (entry.spec.requires === 'heavy' && (other.mass ?? 0) < (entry.spec.minMass ?? 40)) continue;
      fireSwitch(sim, entry, (other.parent ?? other).gameId ?? other.gameId);
    }

    // SHARP → POP. The other half of the balloon, and the thing that gives it
    // a second question. FLOAT asks where a rising thing goes; a thorn asks
    // where it STOPS rising, which is a different decision made with the same
    // one stroke. Cut the Rope's bubble is defined by being popped; ours has
    // no tap to pop it with, so the level supplies the thorn and the player
    // decides whether the balloon ever reaches it.
    for (const [hit, other] of [[a, b], [b, a]]) {
      const entry = sim.objects.get(hit.gameId);
      if (!entry?.spec.lift || sim.burst.has(entry.spec.id)) continue;
      const spike = sim.statics.find((st) => st.body === other && st.spec.sharp);
      if (!spike) continue;
      sim.burst.add(entry.spec.id);
      audio.impact(220, { heavy: false });
    }

    // BRITTLE → SHATTER. The noun's whole question is HOW HARD IT ARRIVES,
    // which is the first question in this game that is not spatial. Measured
    // before it was built: a rock caught at y=880 lands at normal speed ~290
    // and one caught at y=500 lands at ~880, while the ANGLE of the catch moves
    // that number by under 55 across an 18-degree spread. So the outcome tracks
    // the thing the player chooses — where the line goes — and ignores the
    // thing a shaky hand gets wrong.
    //
    // `normalSpeed` and not |v| on purpose: a ramp trades vertical speed for
    // horizontal, and the component INTO the surface is the honest one. It is
    // also the same number that decides lethality and drives the impact sound,
    // so what the player hears is what broke it.
    for (const [hit, other] of [[a, b], [b, a]]) {
      // MILO COUNTS. He is the only body here that cannot be parked on a
      // static line — he walks off whatever you give him — which is what makes
      // him the honest cargo for this question. His footfalls are nowhere near
      // any sane threshold: a step is 220 u/s of TANGENTIAL motion and the
      // normal component of it is small.
      if (other.isSensor) continue;
      if (isBee(sim.objects.get(other.gameId)?.spec)) continue;    // weighs nothing
      const pane = sim.statics.find((st) => st.body === hit && st.spec.brittle);
      if (!pane || sim.shattered.has(pane.spec.id)) continue;
      if (speed <= pane.spec.brittle) continue;
      sim.shattered.add(pane.spec.id);
      // Stops existing physically, exactly as an opened gate does, rather than
      // being removed — the renderers still need it to draw the break.
      hit.collisionFilter.mask = 0;
      hit.collisionFilter.category = 0;
      audio.impact(speed, { heavy: true });
    }

    // Whatever would kill Milo kills the dog.
    for (const dog of sim.dogs) {
      if (!dog.alive || (a !== dog.body && b !== dog.body)) continue;
      const hit = a === dog.body ? b : a;
      const e = sim.objects.get(hit.gameId);
      if (e && e !== sim.objects.get(dog.spec.id) && isFatal(dog.body, hit, e.spec.lethal, pair, DOG)) {
        loseDog(sim, dog, 'dog');
      }
    }

    const miloBody = sim.milo.body;
    if (a !== miloBody && b !== miloBody) return;
    const other = a === miloBody ? b : a;

    const entry = sim.objects.get(other.gameId);
    if (entry && isFatal(miloBody, other, entry.spec.lethal, pair)) {
      const running = sim.run.outcome === OUTCOME.RUNNING;
      kill(sim.run, other.gameId);
      // Nothing hit him hard: a bee got to him, and the label has to say so.
      if (running && isBee(entry.spec)) sim.run.cause = 'stung';
      return;
    }
    // Non-fatal but hard enough to stagger him — unless it is the dog, which
    // bumps into him at walking pace from the other way and is a friend.
    if (entry?.spec.type === 'dog') return;
    if (speed > MILO.stumbleSpeed && sim.milo.state !== STATE.STUNNED) {
      stun(sim.milo, sim.simTime);
    }
  });

  return sim;
}

/** Open every gate a switch points at. Idempotent — a switch fires once. */
function fireSwitch(sim, entry, by = null) {
  if (sim.triggered.has(entry.spec.id)) return;
  sim.triggered.add(entry.spec.id);
  if (by) sim.pressedBy.set(entry.spec.id, by);
  audio.trigger();
  for (const targetId of entry.spec.triggers ?? []) {
    const target = sim.objects.get(targetId);
    if (!target) continue;
    sim.triggered.add(targetId);
    // The gate stops existing physically. Visually it swings away.
    target.body.collisionFilter.mask = 0;
    target.body.collisionFilter.category = 0;
  }
}

export function destroySim(sim) {
  if (sim) destroyWorld(sim.ctx);
}

/** One fixed physics step plus all game logic. */
export function stepSim(sim, worldH = SAFE_BOX.h) {
  if (sim.run.outcome !== OUTCOME.RUNNING) return sim.run.outcome;

  updateMilo(sim.ctx, sim.milo, sim.simTime);
  for (const dog of sim.dogs) updateDog(sim.ctx, dog, sim.simTime);
  stepBees(sim);
  physStep(sim.ctx);
  sim.simTime += PHYSICS_DT;

  // The dog is not a danger to him, so it does not frighten him.
  const hazardBodies = [...sim.objects.values()].filter((o) => o.spec.type !== 'dog').map((o) => o.body);
  applyUpdrafts(sim);
  applyLift(sim);
  detonate(sim);
  audio.setDanger(updateDanger(sim.milo, hazardBodies));
  detectCloseCalls(sim);
  checkDogs(sim, worldH);
  record(sim.recorder, allBodies(sim.ctx));

  const outcome = checkRunEnd(
    sim.run, sim.milo, sim.level, worldH, sim.simTime, sim.causality.lastMiloContactAt,
  );

  if (outcome !== OUTCOME.RUNNING && outcome !== OUTCOME.SUCCESS && !sim.death) {
    sim.death = explain(sim.causality, outcome, sim.run.culpritId, strokeState(sim), sim.run.cause);
    audio.death();
  }
  return outcome;
}

/**
 * Commit the player's stroke. Returns { ok } or { ok:false, reason } — and a
 * rejection is a NO-OP, never a spent attempt.
 */
export function commitStroke(sim, rawPoints) {
  const pts = simplify(rawPoints, LINE.simplifyTol);
  const v = validate(pts, sim.level, sim.milo.body, sim.dogs.map((d) => d.body));
  if (!v.ok) return v;

  const classified = classify(pts);
  const body = buildStrokeBody(sim.ctx, classified);
  if (!body) return { ok: false, reason: 'degenerate' };

  sim.stroke = body;
  sim.strokePoints = pts;
  sim.strokeShape = classified.shape;
  sim.anchors = anchorStroke(sim.ctx, body, pts);
  // Remembered so a death can be explained as "nothing held it up".
  sim.strokeOrigin = { x: body.position.x, y: body.position.y };
  return { ok: true, length: v.length, anchors: sim.anchors.length, shape: classified.shape };
}


/**
 * UPDRAFT — a column of moving air that pushes whatever is inside it.
 *
 * The first thing in this game that acts on the world without being solid. It
 * exists because the level vocabulary had five nouns across thirteen levels —
 * platform, boulder, plate, gate, spikes — and the answer to "the game feels
 * basic" was being looked for in new RULES (a no-draw zone) rather than new
 * THINGS. A rule tells the player what they may not do. A thing gives them
 * something to think with, and it changes what a LINE means: over an updraft a
 * line is a lid, beside it a deflector, across it a shelf that something can be
 * parked on.
 *
 * Acceleration, not force, so how hard it blows does not silently change when
 * a density is retuned — the same reasoning that made lethality use minSpeed.
 * It pushes Milo too: while he is grounded his locomotion sets his velocity
 * every step and wins, and the moment he is airborne the air has him. That
 * asymmetry is not a bug, it is the feel — you can walk through a draught, you
 * cannot fall through one.
 */
/**
 * BUOYANCY — a thing that falls UP.
 *
 * The fourth noun, and the first one borrowed from outside: it is Cut the
 * Rope's bubble. It earns its place by clearing the tests the other borrowings
 * failed. A rocket is a fixed thrust the player cannot aim; a teleport is a
 * rule rather than physics; an air cushion is the draught we already have. A
 * balloon MOVES AND ACTS, which no static noun can, and its question is not one
 * of the three already spent.
 *
 * It is an OBJECT and not a zone, and that distinction is the whole reason it
 * is safe. An updraft plus any ceiling is a measured TRAP for Milo — the air
 * pins him against the underside and airborne Milo has no horizontal drive to
 * get out with. A balloon lifts a THING; Milo is never inside it.
 *
 * Acceleration, not force, for the same reason the updraft uses one: how hard
 * it pulls does not quietly change when a density is retuned. It also makes
 * lift mass-independent, so a balloon's cargo can be made heavy enough to beat
 * a plate's weight gate without moving the balloon's behaviour at all.
 */
function applyLift(sim) {
  for (const { body, spec } of sim.objects.values()) {
    if (!spec.lift || body.isStatic) continue;
    if (sim.burst.has(spec.id)) continue;      // popped: it is just a weight now
    applyAccel(body, 0, -spec.lift);
  }
}

/**
 * TNT. A barrel goes off at its `fuse` WHEREVER IT IS — the player's line
 * decides where that is, never when. Inside the blast radius every breakable
 * board breaks and every loose body is shoved away from the barrel, harder the
 * closer it is; Milo dies if any part of him is inside the kill radius, and a
 * miss by less than a body's width is a close call.
 *
 * The barrel itself stops existing physically the instant it goes off (made
 * static and non-colliding, not removed, so the renderers can still find it).
 * The player's anchored line is static, so the shove never moves it — the
 * blast is a thing that happens TO the world the player built, not to the line.
 */
function detonate(sim) {
  for (const [id, o] of sim.objects) {
    if (o.spec.type !== 'tnt' || sim.detonated.has(id)) continue;
    if (sim.simTime < Math.min(o.spec.fuse, sim.lit.get(id) ?? Infinity)) continue;
    const { x, y } = o.body.position;
    const R = o.spec.blast?.radius ?? TNT.radius;
    const K = o.spec.blast?.kill ?? TNT.kill;
    const P = o.spec.blast?.push ?? TNT.push;
    sim.detonated.set(id, sim.simTime);
    setStatic(o.body, true);
    o.body.collisionFilter.mask = 0;
    o.body.collisionFilter.category = 0;

    // Boards first, so a board the blast breaks no longer shields anything
    // behind it. Boards never shield each other: a fence shatters as one.
    const boards = new Set(sim.statics.filter((st) => st.spec.breakable).map((st) => st.body));
    for (const st of sim.statics) {
      const s = st.spec;
      if (!s.breakable || sim.broken.has(s.id)) continue;
      const nx = Math.max(s.x, Math.min(x, s.x + s.w));
      const ny = Math.max(s.y, Math.min(y, s.y + s.h));
      if (Math.hypot(nx - x, ny - y) >= R) continue;
      if (shielded(sim, x, y, nx, ny, (b) => boards.has(b))) continue;
      sim.broken.set(s.id, sim.simTime);
      st.body.collisionFilter.mask = 0;
      st.body.collisionFilter.category = 0;
    }

    // Another barrel inside the reach is lit, and goes off a beat later.
    for (const [oid, other] of sim.objects) {
      if (other.spec.type !== 'tnt' || oid === id || sim.detonated.has(oid)) continue;
      const p = other.body.position;
      if (Math.hypot(p.x - x, p.y - y) - other.spec.radius >= R) continue;
      if (shielded(sim, x, y, p.x, p.y, (b) => b === other.body)) continue;
      const at = sim.simTime + TNT.chain;
      if (!(sim.lit.get(oid) <= at)) sim.lit.set(oid, at);
    }

    for (const b of allBodies(sim.ctx)) {
      if (b.isStatic || b.isSensor || b === sim.milo.body) continue;
      const dx = b.position.x - x, dy = b.position.y - y, d = Math.hypot(dx, dy);
      if (d >= R || d < 1e-6) continue;
      if (shielded(sim, x, y, b.position.x, b.position.y, (q) => q === b)) continue;
      const k = P * (1 - d / R), v = getVelocity(b);
      setVelocity(b, v.x + (dx / d) * k, v.y + (dy / d) * k);
    }

    // Distance to the nearest point of Milo's body, not his centre: a blast
    // that reaches his feet reaches him — unless something solid is in between.
    const m = sim.milo.body.position;
    const cx = Math.max(m.x - MILO.width / 2, Math.min(x, m.x + MILO.width / 2));
    const cy = Math.max(m.y - MILO.height / 2, Math.min(y, m.y + MILO.height / 2));
    const gap = Math.hypot(cx - x, cy - y);
    const cover = gap < K + NEAR_MISS_DIST * 2 && shielded(sim, x, y, cx, cy, () => false);
    // Where it actually reached, for the renderers: the flash and the replay
    // stop at the wall, so a player can SEE what saved him.
    sim.blasts.push({ id, x, y, t: sim.simTime, radius: R, kill: K, reach: blastReach(sim, x, y, R) });
    audio.blast();
    // The dog first: a blast that takes both is reported as the dog, which is
    // the one the player was trying to keep out of it.
    for (const dog of sim.dogs) {
      if (!dog.alive) continue;
      const p = dog.body.position;
      const dx = Math.max(p.x - DOG.width / 2, Math.min(x, p.x + DOG.width / 2));
      const dy = Math.max(p.y - DOG.height / 2, Math.min(y, p.y + DOG.height / 2));
      if (Math.hypot(dx - x, dy - y) < K && !shielded(sim, x, y, dx, dy, (q) => q === dog.body)) {
        loseDog(sim, dog, 'dog');
      }
    }
    if (gap < K && !cover) {
      kill(sim.run, id);
      sim.run.cause = 'blast';
    } else if (gap < K + NEAR_MISS_DIST * 2 && sim.run.outcome === OUTCOME.RUNNING) {
      sim.closeCalls.push({ id, t: sim.simTime, gap: Math.max(0, gap - K), speed: P, x: (x + m.x) / 2, y: (y + m.y) / 2 });
      audio.closeCall(P);
    }
  }
}

/**
 * Is something solid between the blast at (x, y) and the point (tx, ty)?
 * `skip(body)` names the bodies that cannot shield this target — the target
 * itself, and for a board every other board. Milo, sensors and anything that
 * has stopped existing physically (a spent barrel, a broken board, an opened
 * gate) never shield.
 */
function shielded(sim, x, y, tx, ty, skip) {
  const dx = tx - x, dy = ty - y, d = Math.hypot(dx, dy);
  if (d < 1) return false;
  // Half a unit short: a ray ending exactly on the target's edge can graze
  // whatever the target rests against, and that is not cover.
  const ex = tx - (dx / d) * 0.5, ey = ty - (dy / d) * 0.5;
  return raycast(sim.ctx, x, y, ex, ey, (part) => {
    const b = part.parent ?? part;
    if (b === sim.milo.body || part.isSensor || b.isSensor) return false;
    if (part.collisionFilter.mask === 0 || b.collisionFilter.mask === 0) return false;
    return !skip(b);
  }).length > 0;
}

/** How far the blast got in each of REACH_RAYS directions, up to R. */
const REACH_RAYS = 24;
function blastReach(sim, x, y, R) {
  const out = [];
  for (let k = 0; k < REACH_RAYS; k++) {
    const a = (k / REACH_RAYS) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    const blocked = (r) => shielded(sim, x, y, x + c * r, y + s * r, () => false);
    if (!blocked(R)) { out.push(R); continue; }
    let lo = 0, hi = R;
    for (let i = 0; i < 7; i++) { const mid = (lo + hi) / 2; if (blocked(mid)) hi = mid; else lo = mid; }
    out.push(lo);
  }
  return out;
}

function applyUpdrafts(sim) {
  for (const z of sim.zones) {
    if (z.kind !== 'updraft') continue;
    const a = z.accel ?? -2600;
    for (const b of allBodies(sim.ctx)) {
      if (b.isStatic) continue;
      const p = b.position;
      if (p.x < z.x || p.x > z.x + z.w || p.y < z.y || p.y > z.y + z.h) continue;
      applyAccel(b, z.ax ?? 0, a);
    }
  }
}

/**
 * A CLOSE CALL: something that could have killed him came within
 * NEAR_MISS_DIST and was moving fast enough to mean it.
 *
 * Fires on ENTRY into the radius, once per approach, not once per step — at
 * 120 Hz a single boulder would otherwise produce forty "moments" and the word
 * would stop meaning anything. And it never fires on the step he actually
 * dies: being hit is not a near miss, it is a miss of the other kind.
 */
function detectCloseCalls(sim) {
  if (sim.run.outcome !== OUTCOME.RUNNING) return;
  const b = sim.milo.body;
  const halfW = MILO.width / 2, halfH = MILO.height / 2;

  for (const [id, o] of sim.objects) {
    if (!isHazardous(o.spec.lethal)) continue;
    const v = getVelocity(o.body);
    const speed = Math.hypot(v.x, v.y);
    const p = o.body.position;

    // Nearest point of Milo's box to the hazard's centre, then back off by the
    // hazard's own size — a surface-to-surface gap rather than centre-to-centre,
    // which would call a huge slow boulder "close" while it was still far away.
    const cx = Math.max(b.position.x - halfW, Math.min(p.x, b.position.x + halfW));
    const cy = Math.max(b.position.y - halfH, Math.min(p.y, b.position.y + halfH));
    const reach = o.spec.radius ?? Math.max(o.spec.w ?? 0, o.spec.h ?? 0) / 2;
    const gap = Math.hypot(p.x - cx, p.y - cy) - reach;

    const inside = gap < NEAR_MISS_DIST && speed > CLOSE_CALL.minSpeed;
    const was = sim._near.get(id) ?? false;
    sim._near.set(id, inside);

    if (inside && !was) {
      const last = sim.closeCalls[sim.closeCalls.length - 1];
      if (last && sim.simTime - last.t < CLOSE_CALL.cooldownMs) continue;
      sim.closeCalls.push({
        id, t: sim.simTime, gap: Math.max(0, gap), speed,
        x: (p.x + b.position.x) / 2, y: (p.y + b.position.y) / 2,
      });
      audio.closeCall(speed);
    }
  }
}

/** What the player's line did, for the death explanation. */
/**
 * THE DOG IS LOST: the run ends there, whatever Milo is doing. `why` is
 * 'dog' when something killed it and 'dog-ran' when it simply walked out of
 * the world — the label says which.
 */
function loseDog(sim, dog, why) {
  if (!dog.alive) return;
  dog.alive = false;
  if (sim.run.outcome !== OUTCOME.RUNNING) return;
  kill(sim.run, dog.spec.id);
  sim.run.cause = why;
}

/** Out of the world, or in a lethal zone: the same tests Milo gets. */
function checkDogs(sim, worldH) {
  for (const dog of sim.dogs) {
    if (!dog.alive) continue;
    const p = dog.body.position;
    if (p.x < -DOG.width || p.x > SAFE_BOX.w + DOG.width) loseDog(sim, dog, 'dog-ran');
    else if (p.y - DOG.height > worldH + 200 || inLethalZone(dog.body, sim.zones, DOG)) loseDog(sim, dog, 'dog');
  }
}

function strokeState(sim) {
  const b = sim.stroke;
  if (!b) return { drawn: false, anchored: false, fell: 0 };
  const o = sim.strokeOrigin;
  return {
    drawn: true,
    anchored: (sim.anchors?.length ?? 0) > 0,
    fell: o ? Math.hypot(b.position.x - o.x, b.position.y - o.y) : 0,
  };
}

export function abort(sim) {
  if (sim.run.outcome === OUTCOME.RUNNING) sim.run.outcome = OUTCOME.ABORTED;
}

export { OUTCOME };
