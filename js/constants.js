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
  stumbleImpulse: 40,  // TUNE
  stunMs: 700,         // TUNE
  graceShrink: 6,      // LOCKED — hitbox shrink for lethal tests
};

// ── Run-end detection ───────────────────────────────────────────────────
export const STUCK = { speedUnder: 12, forMs: 3000, sinceContactMs: 500 };  // TUNE
export const NEAR_MISS_DIST = 30;   // TUNE — less than Milo's 36u width
export const GOAL_MAX_SPEED = 400;  // LOCKED — faster than this through the goal is not a rescue

// ── Presentation ────────────────────────────────────────────────────────
export const FREEZE_AT = 1200;      // ms of live beat before the world stops
export const DEATH_CAM = { holdMs: 250, replayMs: 1400, rate: 0.25 };
export const GHOST_OPACITY = 0.18;

// ── Platform ────────────────────────────────────────────────────────────
export const MAX_HEAP_MB = 512;     // LOCKED — certification ceiling
