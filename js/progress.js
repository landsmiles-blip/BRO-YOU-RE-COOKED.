// PROGRESS — what the player has actually achieved, and the only thing in the
// game that outlives a reload.
//
// WHY THIS EXISTS
//
// nextLevel() was `(levelIndex + 1) % LEVELS.length`. Finish the last level and
// it silently wrapped to level one: no ending, no total, no acknowledgement
// that you had just completed the game. That is precisely the "game that ends
// mid-air" this project was told not to build, and it would make a 24-level
// game feel like a fragment exactly as much as a 9-level one. Level count was
// never the problem; the missing ending was.
//
// SCHEMA VERSIONING IS NOT OPTIONAL. A save written by this build will be read
// by a build with more levels, renamed levels, and a rating axis that may have
// changed. `v` is checked on load and anything unrecognised is discarded rather
// than half-trusted — a save that silently half-applies is worse than a lost
// one, because the player cannot tell which of their stars are real.

import { LEVELS } from './levels.js';
import { saveData, loadData } from './platform/sdk.js';

const SCHEMA = 1;

/** Best stars per level id. Unplayed levels are simply absent. */
export function createProgress() {
  return { v: SCHEMA, best: {}, finishedAt: 0 };
}

export function starsOn(p, levelId) {
  return p.best[levelId] ?? 0;
}

/** Record a result. Returns true if this was a personal best worth saving. */
export function record(p, levelId, stars) {
  if (!stars || stars <= (p.best[levelId] ?? 0)) return false;
  p.best[levelId] = stars;
  return true;
}

export const totalStars = (p) => LEVELS.reduce((n, l) => n + starsOn(p, l.id), 0);
export const maxStars = () => LEVELS.length * 3;
export const cleared = (p) => LEVELS.filter((l) => starsOn(p, l.id) > 0).length;
export const isComplete = (p) => cleared(p) === LEVELS.length;
export const perfect = (p) => totalStars(p) === maxStars();

/** First level the player has not yet cleared — where "continue" resumes. */
export function firstUnclearedIndex(p) {
  const i = LEVELS.findIndex((l) => starsOn(p, l.id) === 0);
  return i === -1 ? 0 : i;
}

// ── persistence ───────────────────────────────────────────────────────────

export function serialise(p) {
  return JSON.stringify({ v: SCHEMA, best: p.best, finishedAt: p.finishedAt || 0 });
}

/**
 * Parse a save. ANY doubt returns a fresh progress rather than a partial one:
 * unknown schema version, malformed JSON, a `best` that is not an object, or a
 * star value outside 1..3. Levels that no longer exist are dropped silently,
 * which is the one case where partial IS correct — the player's other stars are
 * still theirs.
 */
export function deserialise(text) {
  const fresh = createProgress();
  if (!text) return fresh;
  let raw;
  try { raw = JSON.parse(text); } catch { return fresh; }
  if (!raw || typeof raw !== 'object' || raw.v !== SCHEMA) return fresh;
  if (!raw.best || typeof raw.best !== 'object') return fresh;

  const known = new Set(LEVELS.map((l) => l.id));
  for (const [id, stars] of Object.entries(raw.best)) {
    if (!known.has(id)) continue;
    // Out of range is DROPPED, not clamped. Clamping 99 down to 3 would hand
    // the player a perfect score off the back of corrupt data; dropping it
    // costs them one level's stars, which they can simply re-earn.
    const n = Math.floor(Number(stars));
    if (Number.isFinite(n) && n >= 1 && n <= 3) fresh.best[id] = n;
  }
  fresh.finishedAt = Number.isFinite(raw.finishedAt) ? raw.finishedAt : 0;
  return fresh;
}

export function load() {
  return Promise.resolve(loadData()).then(deserialise).catch(createProgress);
}

// Writes are coalesced: a 3-star run can record a best, finish a level and
// complete the game in the same frame, and that is one save, not three.
let pending = null;
export function save(p) {
  if (pending) return pending;
  pending = Promise.resolve().then(() => {
    pending = null;
    return saveData(serialise(p));
  });
  return pending;
}
