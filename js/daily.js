// THE DAILY CHALLENGE — the reason to come back tomorrow.
//
// WHY THIS EXISTS, and it is not a level-count problem.
//
// Twenty-one levels is about fourteen minutes, played once. Revenue on this
// platform is daily actives times sessions times ad impressions, so with
// nothing to return FOR, the audience decays to zero after day one no matter
// how many levels get added. Four sessions of chasing level 22 did not move
// that number at all, because three more minutes of content in a game nobody
// reopens is worth nothing. A daily turns the levels we already have into weeks
// of return visits.
//
// THE TWIST IS THE INK, NOT A NEW LEVEL.
//
// The daily runs a level you may already know at its measured THREE-STAR
// length — the 20th percentile of winning stroke lengths across the plausible
// space, computed by the solver and stored in js/solverData.js. That number is
// not invented, which matters: a fifth of all winning strokes fit inside it, so
// the challenge is provably beatable while still demanding a much better line
// than simply clearing the level. Clearing a level and clearing it in 110 units
// are different problems.
//
// EVERYTHING HERE IS PURE AND DETERMINISTIC. The date goes in, the challenge
// comes out. No network — `tools/build.js` fails the build on any of it — and
// no stored server state, so every player on the same UTC day gets the same
// challenge and can compare it without anything being fetched.
//
// THE POOL. Twenty-one levels meant the daily came round again every three
// weeks. js/dailyPool.js adds generated levels that are dealt ONLY here: they
// are twins of levels 1-12, which keeps them out of the campaign and costs
// nothing in a challenge whose twist is the ink. Their thresholds were measured
// by the same sweep as the campaign's, so the budget rule below holds for both.
//
// THE DAILY ONLY DEALS WHAT IT CAN CERTIFY. "The shortest winning stroke fits
// the budget" was the first proof of fairness, and it is satisfied by an
// idealised solver stroke no finger can reproduce: DUCT and CRACK had budgets
// of 110 units and not one winning stroke that survives the hand model. Every
// level in the deck now carries a certificate from tools/levelgen/bake.js — a
// hand-robust win inside its daily budget — and a campaign level without one is
// in HELD_FROM_DAILY with the measurement. It stays in the campaign.

import { LEVELS } from './levels.js';
import { POOL, HELD_FROM_DAILY } from './dailyPool.js';
import { measured } from './rating.js';
import { LINE } from './constants.js';

/** The campaign levels the daily deals: every one it can certify. */
const CAMPAIGN = LEVELS.filter((l) => !HELD_FROM_DAILY[l.id]);

/** Every level the daily can deal: the certified campaign, then the pool. */
export const DAILY = [...CAMPAIGN, ...POOL];

/**
 * Days since the epoch, in UTC.
 *
 * UTC AND NOT LOCAL TIME, deliberately. Local midnight would give a player in
 * Auckland a different challenge from one in Los Angeles for most of the day,
 * and the whole point of a daily is that it is the same one for everybody.
 */
export function dayNumber(date = new Date()) {
  return Math.floor(date.getTime() / 86400000);
}

/** Deterministic 32-bit scramble. Same day in, same challenge out, for ever. */
function hash(n) {
  let h = (n ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x21f0aaad) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x735a2d97) >>> 0;
  return (h ^ (h >>> 15)) >>> 0;
}

/**
 * A SHUFFLED DECK, not a random pick.
 *
 * `hash(day) % DAILY.length` would repeat levels by chance — birthday
 * collisions mean roughly one repeat inside any two weeks, and getting
 * yesterday's level again is exactly the thing that makes a daily feel
 * worthless. A fresh permutation per cycle deals every level once before any
 * comes up twice.
 *
 * WHAT THAT DOES AND DOES NOT GUARANTEE, measured rather than assumed. Within
 * one cycle it is a perfect permutation. Across the SEAM between two
 * independently shuffled cycles it is not: a rolling 21-day window that
 * straddles a boundary measured 18 distinct levels, not 21, because the two
 * decks know nothing about each other. The fix below is the one a shuffle bag
 * uses — hold back the previous deck's tail so the next deck cannot open with
 * it. That buys the guarantee that actually matters to a player, which is
 * never the same level two days running, and it cannot buy full 21-window
 * uniqueness, which no pair of independent permutations can.
 */
function shuffle(seed, n) {
  const deck = Array.from({ length: n }, (_, i) => i);
  let s = hash(seed);
  for (let i = n - 1; i > 0; i--) {
    s = hash(s);
    const j = s % (i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const HOLD = 7;

// Two decks are dealt (see dailyFor), and they must never share a shuffle, or
// the campaign and the pool would move in lockstep.
const seedOf = (cycle, salt) => cycle * 2 + salt;

function deckFor(cycle, n, salt) {
  const deck = shuffle(seedOf(cycle, salt), n);
  if (n < HOLD * 2 + 1) return deck;
  // THE SEAM, REPAIRED GREEDILY. Swapping only the first card stopped
  // back-to-back repeats and left the clustering: the worst rolling 21-day
  // window still measured 13 distinct levels, because the tail of one deck and
  // the head of the next overlap freely. Hold back the previous deck's whole
  // tail instead — any of this deck's first HOLD cards that appears in it gets
  // swapped for one from deeper in the deck that does not.
  //
  // Measured with HOLD=7 on the single 21-level deck: no level ever repeated
  // two days running, and the closest any came back was 8 days. With the
  // campaign and the pool dealt as two interleaved decks (see dailyFor) it is
  // wider, over 3000 days: a pool level returns no sooner than 12 days, a
  // campaign level no sooner than 18. Full uniqueness inside a rolling window
  // is not something two independent permutations can give — separation is
  // the number a player actually feels, and it is comfortably past a week.
  const tail = new Set(shuffle(seedOf(cycle - 1, salt), n).slice(n - HOLD));
  for (let i = 0; i < HOLD; i++) {
    if (!tail.has(deck[i])) continue;
    for (let j = HOLD; j < n; j++) {
      if (tail.has(deck[j])) continue;
      [deck[i], deck[j]] = [deck[j], deck[i]];
      break;
    }
  }
  return deck;
}

/**
 * The challenge for a given day: which level, and how much ink.
 *
 * The budget is clamped to at least the shortest winning stroke the solver
 * found. The three-star length should already exceed it by construction — it
 * is a higher percentile of the same distribution — but a level whose data is
 * missing or stale must never hand out a budget nothing can win inside.
 */
export function dailyFor(day = dayNumber()) {
  // ONE CAMPAIGN DAY IN EVERY THREE, EXACTLY — two decks, interleaved.
  //
  // One shuffle over campaign and pool together got the RATIO right, 31% of
  // days, and the SPREAD wrong: measured over 3000 days it went sixteen days
  // running without a single campaign level. That is two weeks of the basic
  // generated verbs and none of the air, the balloons or the brittle floor —
  // the "too basic" playtest complaint, delivered by a shuffle. Dealing each
  // half from its own deck and interleaving them makes the promise exact.
  const t = Math.floor(day / 3), r = day - t * 3;
  const both = CAMPAIGN.length > 0 && POOL.length > 0;
  const { level, cycle } = (both ? r === 0 : !POOL.length)
    ? deal(CAMPAIGN, both ? t : day, 0)
    : deal(POOL, both ? t * 2 + r - 1 : day, 1);
  const ink = inkFor(measured(level.id));
  return { day, index: DAILY.indexOf(level), level, ink, cycle };
}

/** The k-th card of one deck's endless stream of shuffle-bag cycles. */
function deal(levels, k, salt) {
  const n = levels.length;
  const cycle = Math.floor(k / n);
  const deck = deckFor(cycle, n, salt);
  return { level: levels[deck[((k % n) + n) % n]], cycle };
}

/**
 * The daily budget, from a level's measured numbers (a SOLVER-shaped entry).
 * Pure, so the pool bake can apply the exact rule the game will, to numbers
 * that are not in any data file yet.
 */
export function inkFor(s) {
  const three = s?.threeStarLength ?? Math.round(LINE.maxLengthDefault * 0.6);
  const floor = s?.shortestWin ?? 0;
  return Math.max(three, floor);
}

/**
 * A level as the daily plays it: a COPY, on the daily budget. Nothing mutates
 * the shipped level data — the same rule that keeps a solver sweep from
 * leaking one run's state into the next 2,500.
 */
export function asDaily(level) {
  return { ...level, drawing: { ...level.drawing, maxLength: inkFor(measured(level.id)) } };
}

/** The level data a daily run actually plays: the day's level, on its budget. */
export function dailyLevel(day = dayNumber()) {
  return asDaily(dailyFor(day).level);
}
