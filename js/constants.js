// Every tunable number in the game. Nothing else belongs in this file.
//
// Tags:  LOCKED — changing it changes the game or breaks a guarantee.
//        TUNE   — a real starting value, expected to move during playtest.
//
// Unit scale (Bible §3.5): Milo is 72 units tall and represents 1.73 m,
// therefore 1 world unit = 2.4 cm. Every constant below is checkable
// against reality through that relationship.

// ── World ───────────────────────────────────────────────────────────────
// Amendment A.1: the safe box is CONTAIN-FIT into the viewport. All puzzle
// geometry lives inside it at every aspect ratio from 9:32 to 32:9.
export const SAFE_BOX = { w: 720, h: 1280 };   // LOCKED
export const GRAVITY_Y = 1800;                  // TUNE — u/s², 4.4x real

// ── Simulation ──────────────────────────────────────────────────────────
export const PHYSICS_HZ = 120;                  // LOCKED — anti-tunnel, see Bible §3.4
export const PHYSICS_DT = 1000 / PHYSICS_HZ;    // ms
export const MAX_SPEED = 900;                   // LOCKED — u/s, hard clamp on every dynamic body
export const MAX_STEPS_PER_FRAME = 8;           // beyond this, treat as resume-from-pause
export const RUN_TIMEOUT = 12000;               // LOCKED — ms of simulated time
export const SOLVER_ITER = { position: 6, velocity: 4 };  // LOCKED — fixed for determinism

// ── The drawn line ──────────────────────────────────────────────────────
export const LINE = {
  thickness: 16,      // LOCKED — with 120Hz + MAX_SPEED gives 7.5u/step vs 8u margin
  density: 0.02,      // TUNE
  friction: 0.6,      // TUNE
  restitution: 0.05,  // TUNE — reads as solid terrain, not a trampoline
  minLength: 20,      // LOCKED — accidental-tap floor
  maxLengthDefault: 900,
  simplifyTol: 3,     // LOCKED — Douglas-Peucker
  closeDist: 24,      // LOCKED — start/end within this ⇒ closed shape
  anchorTol: 6,       // LOCKED — contact tolerance for welding
  maxAnchors: 8,      // LOCKED
};

// ── Milo ────────────────────────────────────────────────────────────────
export const MILO = {
  width: 36, height: 72, chamfer: 16,   // LOCKED
  density: 0.01, friction: 0.3, restitution: 0.1, angularDamping: 0.9,
  speed: 220,          // TUNE — level-overridable
  maxStepUp: 22,       // LOCKED — MUST exceed LINE.thickness or bridges are unwalkable
  maxWalkSlope: 40,    // TUNE — degrees
  groundProbe: 6,
  stumbleSpeed: 260,   // TUNE — u/s ALONG THE COLLISION NORMAL, not total
                       //   relative speed. Walking is 220 u/s of tangential motion
                       //   against the ground; measuring that stuns him every step.
  stunMs: 700,         // TUNE
  graceShrink: 6,      // LOCKED — hitbox shrink for lethal tests
};

// THE DOG — a second walker. It walks like Milo, on the same ground probe,
// slope rule and step-up, but it TURNS AROUND when something blocks it where
// Milo would stand there until the stuck timer ran out. That one difference is
// the whole noun: a line can now steer something that walks.
//
// Heavier than any line the player can afford to drop on a weighed plate
// (a 400-unit budget buys about 130), so a plate that wants the dog gets it
// with `requires: 'heavy', minMass: 150`. Slower than Milo so a stranger can
// follow it, and low enough to read as a dog beside him.
export const DOG = {
  width: 44, height: 30, chamfer: 10,
  density: 0.17, friction: 0.3, restitution: 0.1,
  speed: 180,
  maxStepUp: 22,       // the same lip Milo can take, so a drawn line is a floor to it too
  maxWalkSlope: 40,
  groundProbe: 6,      // Milo's: 12 walked it off the tip of a ramp instead of turning
  turnMs: 250,         // after turning, it walks this long before it may turn again
  // A dog held up by something that gets nowhere for stallMs turns round
  // (js/milo.js). Held up means standing, or at rest — under restSpeed u/s —
  // within the last supportMs, so a dog in free fall is never turned.
  stallMs: 1000,
  supportMs: 400,
  restSpeed: 15,       // u/s; Milo's stuck test uses 12
  stallStep: 10,       // units forward that count as getting somewhere
};

// ── Run-end detection ───────────────────────────────────────────────────
export const STUCK = { speedUnder: 12, forMs: 3000, sinceContactMs: 500 };  // TUNE
export const NEAR_MISS_DIST = 30;   // TUNE — less than Milo's 36u width

// TNT: a barrel with a lit fuse that goes off at `fuse` ms WHEREVER IT IS.
// Inside `radius` it breaks every `breakable` static and shoves every loose body
// away from it; inside `kill` of Milo's body it kills him. A level may override
// any of the three per barrel with `blast: { radius, kill, push }`.
// A FUSE, NOT AN IMPACT, because an impact cannot tell a catch from a delivery:
// measured, a line catching the barrel hits it at a normal speed of 359-479
// while a delivery to a fence hits at 336 — an impact trigger would go off in
// the player's hands.
// SOLID THINGS STOP IT. A wall, a shelf, the player's line or a rock standing
// between the barrel and a target shields that target — Milo, a board, a loose
// body, another barrel — because that is what every explosion a player has
// ever seen does, and what the genre's shield levels teach them to expect.
// Breakable boards never shield one another: a fence shatters as one thing.
// A blast that reaches another barrel LIGHTS it, and it goes off `chain` ms
// later — a beat apart, so a chain reads as two bangs and not one.
export const TNT = { radius: 130, kill: 90, push: 600, chain: 150 };   // TUNE

// BEES (js/bees.js): a swarm from a hive that flies at the nearest living
// walker, weaving up to `wander` radians either side of the straight line to
// it, and kills by touch. `steer` is how much of the gap between the velocity
// it has and the one it wants it closes each step — at 120 Hz, 0.12 turns it
// round in under a tenth of a second. Measured on the first probe: at 260 u/s a
// swarm released over him never caught a walking Milo, at 340 it caught him a
// stride from the door, at 420 in the middle of the level. Fast enough that
// outrunning it is never the answer; a line between them is.
export const BEE = {
  radius: 7, density: 0.001,
  speed: 400,        // TUNE — u/s; Milo walks at 220
  steer: 0.12,       // TUNE
  wander: 0.6,       // TUNE — radians
  every: 70,         // TUNE — ms between bees leaving the hive
  group: -7,         // LOCKED — the collision group every bee shares: bees pass through bees
};

// THE CLOSE CALL. The game is called BRO, YOU'RE COOKED and it is about nearly
// dying — and until now nearly dying looked and sounded EXACTLY like winning
// comfortably. NEAR_MISS_DIST sat in this file, declared and read by nothing.
export const CLOSE_CALL = {
  minSpeed: 240,     // TUNE — a resting boulder beside him is furniture, not a scare
  slowRate: 0.22,    // TUNE — wall-clock rate during the moment; the sim's dt never changes
  slowMs: 420,       // TUNE — long enough to register, short enough not to drag
  cooldownMs: 260,   // TUNE — one approach is one moment, not forty
};
export const GOAL_MAX_SPEED = 400;  // LOCKED — faster than this through the goal is not a rescue

// ── Presentation ────────────────────────────────────────────────────────
export const FREEZE_AT = 1200;      // ms of live beat before the world stops
export const DEATH_CAM = { holdMs: 250, replayMs: 1400, rate: 0.25 };
export const GHOST_OPACITY = 0.18;

// ── Platform ────────────────────────────────────────────────────────────
export const MAX_HEAP_MB = 512;     // LOCKED — certification ceiling
