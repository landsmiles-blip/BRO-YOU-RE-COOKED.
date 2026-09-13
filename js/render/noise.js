// Deterministic value noise for the hand-drawn wobble.
//
// Deterministic matters: the boil must be reproducible from a seed so that a
// frozen tableau looks identical frame to frame, and so a screenshot test is
// stable. Math.random() here would make the world shimmer every frame, which
// reads as broken rather than as drawn.

/** Integer hash → [0,1). Cheap, no allocation, stable across runs. */
function hash(i, seed) {
  let h = (i * 374761393 + seed * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177 | 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const smooth = (t) => t * t * (3 - 2 * t);

/** 1-D value noise in [-1,1], smooth between integer lattice points. */
export function noise1(x, seed = 0) {
  const i = Math.floor(x);
  const f = x - i;
  const a = hash(i, seed);
  const b = hash(i + 1, seed);
  return (a + (b - a) * smooth(f)) * 2 - 1;
}

/**
 * The boil clock. The wobble is reseeded on a ~10fps beat while the game runs
 * at 60 — THIS is what makes the line read as *drawn* rather than as jittering
 * vectors, and it is the single most important parameter in the whole look.
 */
export const BOIL_MS = 100;
export function boilSeed(nowMs, salt = 0) {
  return Math.floor(nowMs / BOIL_MS) * 31 + salt;
}
