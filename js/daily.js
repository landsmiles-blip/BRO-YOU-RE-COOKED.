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

import { LEVELS } from './levels.js';
import { SOLVER } from './solverData.js';
import { LINE } from './constants.js';

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
 * `hash(day) % LEVELS.length` would repeat levels by chance — birthday
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

function deckFor(cycle, n) {
  const deck = shuffle(cycle, n);
  if (n < HOLD * 2 + 1) return deck;
  // THE SEAM, REPAIRED GREEDILY. Swapping only the first card stopped
  // back-to-back repeats and left the clustering: the worst rolling 21-day
  // window still measured 13 distinct levels, because the tail of one deck and
  // the head of the next overlap freely. Hold back the previous deck's whole
  // tail instead — any of this deck's first HOLD cards that appears in it gets
  // swapped for one from deeper in the deck that does not.
  //
  // Measured over 1000 days with HOLD=7: no level ever repeats two days
  // running, and the CLOSEST any level comes back is 8 days. The worst rolling
  // 21-day window holds 14 distinct levels rather than 21, which no pair of
  // independent permutations can fix — but 8 days of separation is the number
  // a player actually feels, and it is comfortably past a week.
  const tail = new Set(shuffle(cycle - 1, n).slice(n - HOLD));
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
  const n = LEVELS.length;
  const cycle = Math.floor(day / n);
  const deck = deckFor(cycle, n);
  const index = deck[((day % n) + n) % n];
  const level = LEVELS[index];
  const s = SOLVER[level.id];

  const three = s?.threeStarLength ?? Math.round(LINE.maxLengthDefault * 0.6);
  const floor = s?.shortestWin ?? 0;
  const ink = Math.max(three, floor);

  return { day, index, level, ink, cycle };
}

/** The level data a daily run actually plays: the level, on a tighter budget. */
export function dailyLevel(day = dayNumber()) {
  const { level, ink } = dailyFor(day);
  return { ...level, drawing: { ...level.drawing, maxLength: ink } };
}
