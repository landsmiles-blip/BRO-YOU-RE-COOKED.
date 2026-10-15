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

const SCHEMA = 3;

/** Skip tokens held at most. Finishing the daily earns one. */
export const MAX_TOKENS = 3;

/**
 * Best stars per level id, plus the daily streak, the levels the player
 * skipped, and the skip tokens they hold.
 *
 * SCHEMA 3 ADDS THE SKIP (docs/PLAN.md section 7) and migrates 1 and 2 for the
 * same reason 2 migrated 1: an older save is fully understood — it simply has
 * skipped nothing and holds no tokens.
 *
 * SCHEMA 2 ADDS THE DAILY AND MIGRATES 1 RATHER THAN DISCARDING IT. The rule
 * above — anything unrecognised is thrown away rather than half-trusted — is
 * about saves this build cannot understand. A version 1 save is one this build
 * understands completely; it simply has no streak yet, which is indisputably
 * zero. Discarding it would take a player's stars away to avoid a risk that
 * does not exist.
 */
export function createProgress() {
  return { v: SCHEMA, best: {}, finishedAt: 0, streak: 0, lastDailyDay: 0, skipped: {}, tokens: 0,
           stats: freshStats(), muted: false, tries: {} };
}

// ── tries per level, for the playtest ───────────────────────────────────
//
// THE CURVE IS SIMULATED UNTIL A PERSON PLAYS IT. Every slot's target comes
// from tries = 1 / (breadth x hand rate), measured with random strokes and a
// model hand, and docs/PLAN.md says to refit it the day real attempt counts
// exist. This is where they come from: for each level, how many runs a person
// took before the first win, and how long they spent getting there. It never
// leaves the device — the playtest build shows it on the board and the tester
// screenshots it.
//
//   runs   every run that ended in a win or a loss (a refused stroke is not one)
//   won    runs taken to the FIRST win, 0 until there is one
//   ms     time on the level up to that first win, play and replay included
const freshTry = () => ({ runs: 0, won: 0, ms: 0 });

/** Count one finished run on a level. */
export function noteTry(p, levelId, won) {
  const t = (p.tries ??= {})[levelId] ??= freshTry();
  t.runs += 1;
  if (won && !t.won) t.won = t.runs;
}

/** Time spent on a level, counted only until it is first won. */
export function noteTime(p, levelId, ms) {
  const t = (p.tries ??= {})[levelId] ??= freshTry();
  if (!t.won) t.ms += ms;
}

export const triesOn = (p, levelId) => p.tries?.[levelId] ?? null;

// ── lifetime stats, for the ending's card ───────────────────────────────
//
// "Milo survived 60 disasters. You drew 1,284 m of line. He nearly died 212
// times." The screen people screenshot, and the reason it needs numbers that
// outlive a session. Cosmetic, so they are kept in memory every run and only
// written when something else is (a win, a skip, a daily) — a run of deaths
// is not worth a save of its own.
const freshStats = () => ({ wins: 0, deaths: 0, ink: 0, calls: 0 });

/** Count one finished run. `won` false is a death; an aborted run is neither. */
export function noteRun(p, { won = false, died = false, ink = 0, calls = 0 } = {}) {
  const st = p.stats ?? (p.stats = freshStats());
  if (won) st.wins += 1;
  if (died) st.deaths += 1;
  st.ink += Math.max(0, ink) || 0;
  st.calls += Math.max(0, calls) || 0;
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

/** First level the player has not yet cleared — where "go back for the stars" goes. */
export function firstUnclearedIndex(p) {
  const i = LEVELS.findIndex((l) => starsOn(p, l.id) === 0);
  return i === -1 ? 0 : i;
}

// ── the skip, and the lock it needs ───────────────────────────────────────
//
// A SKIP ONLY MEANS SOMETHING IN A GAME THAT LOCKS. With every level open on
// the board, the skip would sell what the board gives away, so levels now open
// in order: a level is open when it, or any level after it, has been beaten or
// skipped, or it is the one right after the furthest such level. Counting from
// the FURTHEST level rather than requiring every one before it is what keeps
// existing saves whole — a player who cleared level 14 on the old open board
// without clearing level 5 keeps level 5 open — and it means inserting a new
// level into a chapter can never lock a level somebody has already beaten.

/** Beaten or skipped: the level no longer stands between the player and the next. */
export const isDone = (p, id) => starsOn(p, id) > 0 || !!p.skipped?.[id];

/** Skipped and not since beaten: drawn hollow, scores nothing, still playable. */
export const isSkipped = (p, id) => !!p.skipped?.[id] && starsOn(p, id) === 0;

/** The furthest level index that is open. */
export function frontier(p) {
  let f = 0;
  LEVELS.forEach((l, i) => { if (isDone(p, l.id)) f = Math.max(f, i + 1); });
  return Math.min(f, LEVELS.length - 1);
}

export const isOpen = (p, index) => index >= 0 && index <= frontier(p);

/** Where the campaign continues: the first level neither beaten nor skipped. */
export function resumeIndex(p) {
  const i = LEVELS.findIndex((l) => !isDone(p, l.id));
  return i === -1 ? 0 : i;
}

/** Mark a level skipped. Returns false if there was nothing to skip. */
export function markSkipped(p, id) {
  if (isDone(p, id)) return false;
  p.skipped = { ...p.skipped, [id]: true };
  return true;
}

/** A token for finishing the daily. Returns false when the player holds the most allowed. */
export function grantToken(p) {
  if ((p.tokens || 0) >= MAX_TOKENS) return false;
  p.tokens = (p.tokens || 0) + 1;
  return true;
}

export function spendToken(p) {
  if (!((p.tokens || 0) > 0)) return false;
  p.tokens -= 1;
  return true;
}

// ── persistence ───────────────────────────────────────────────────────────

export function serialise(p) {
  return JSON.stringify({
    v: SCHEMA, best: p.best, finishedAt: p.finishedAt || 0,
    streak: p.streak || 0, lastDailyDay: p.lastDailyDay || 0,
    skipped: Object.keys(p.skipped || {}).filter((id) => p.skipped[id]), tokens: p.tokens || 0,
    stats: p.stats ?? freshStats(), muted: !!p.muted, tries: p.tries ?? {},
  });
}

// ── the daily ─────────────────────────────────────────────────────────────

/** Has today's challenge already been completed? */
export function dailyDone(p, day) {
  return (p.lastDailyDay || 0) === day;
}

/**
 * Record a daily completion. Returns true if anything changed.
 *
 * A streak counts CONSECUTIVE days: finishing yesterday's and then today's
 * extends it, and a gap of even one day starts again at one. Finishing the same
 * day twice does nothing, because the second run is a replay, not a second day.
 */
export function recordDaily(p, day) {
  if (!Number.isFinite(day) || dailyDone(p, day)) return false;
  p.streak = (p.lastDailyDay === day - 1) ? (p.streak || 0) + 1 : 1;
  p.lastDailyDay = day;
  return true;
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
  if (!raw || typeof raw !== 'object') return fresh;
  // Versions 1 and 2 are readable: same `best`; the daily fields (v1) and the
  // skip fields (v1 and v2) are simply absent, and default to nothing.
  if (raw.v !== SCHEMA && raw.v !== 1 && raw.v !== 2) return fresh;
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
  // Same reasoning as the star range above: a nonsensical streak is DROPPED to
  // zero rather than clamped, so corrupt data cannot hand out a record.
  const st = Math.floor(Number(raw.streak));
  const ld = Math.floor(Number(raw.lastDailyDay));
  fresh.streak = (Number.isFinite(st) && st >= 0 && st < 100000) ? st : 0;
  fresh.lastDailyDay = (Number.isFinite(ld) && ld > 0) ? ld : 0;
  if (!fresh.lastDailyDay) fresh.streak = 0;
  // Skips name levels, so the same rule as stars: ids that no longer exist are
  // dropped and the rest kept. Tokens outside 0..MAX_TOKENS are DROPPED to
  // zero, not clamped, so corrupt data cannot hand out free skips.
  if (Array.isArray(raw.skipped)) {
    for (const id of raw.skipped) if (typeof id === 'string' && known.has(id)) fresh.skipped[id] = true;
  }
  const tk = Number(raw.tokens);
  fresh.tokens = (Number.isInteger(tk) && tk >= 0 && tk <= MAX_TOKENS) ? tk : 0;
  fresh.muted = raw.muted === true;
  // Each stat on its own: one junk number costs that number, not the rest.
  for (const k of Object.keys(fresh.stats)) {
    const n = Number(raw.stats?.[k]);
    fresh.stats[k] = (Number.isFinite(n) && n >= 0 && n < 1e12) ? n : 0;
  }
  // Tries, the same way: unknown ids and nonsense entries are DROPPED whole,
  // and a first win can never be later than the runs it is counted in.
  for (const [id, t] of Object.entries(raw.tries && typeof raw.tries === 'object' ? raw.tries : {})) {
    if (!known.has(id) || !t || typeof t !== 'object') continue;
    const runs = Number(t.runs), won = Number(t.won), ms = Number(t.ms);
    if (!Number.isInteger(runs) || runs < 0 || runs > 1e6) continue;
    if (!Number.isInteger(won) || won < 0 || won > runs) continue;
    if (!Number.isFinite(ms) || ms < 0 || ms > 1e10) continue;
    fresh.tries[id] = { runs, won, ms };
  }
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
