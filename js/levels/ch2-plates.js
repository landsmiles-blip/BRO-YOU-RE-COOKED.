// CHAPTER 2 — PLATES & GATES. The new levels for this chapter live in this file, and
// only this chapter's designer (designer B) edits it. js/levels.js places each
// level into its slot in CHAPTERS; `npm run curve` prints every slot's target.
//
// Level constants A80-A89 belong to this chapter, so parallel work never collides
// on an id. Before adding a level, read CLAUDE.md, docs/PLAN.md (the production
// line, and this chapter's slots in 4.4) and docs/HELD.md (what was already
// tried and why it was shelved).
//
// The schema is the one every level in js/levels.js uses; copy the closest
// shipped level rather than starting from nothing.

import { MILO } from '../constants.js';

// ─────────────────────────────────────────────────────────────────────────
// A80 — GOOD BOY.  Introduces: the dog, on its own.
//
// The plate that opens his gate is at the right-hand end of a long shelf, and
// the only thing on that shelf heavy enough to press it is the dog — walking
// the other way. Left alone it trots off the open end of the shelf and out of
// the backyard. The dog walks like Milo but turns around wherever it is
// blocked, so a line standing in its way sends it back along the shelf, over
// the plate, until the post at the far end turns it again and it paces there.
//
// The first thing a stroke has ever steered. Every win in the census is the
// dog pressing the plate after being turned (157 of 157); with the dog deleted
// there are none. The shelf is long and low on purpose: on a short one the
// wall had a 120-unit stretch to land in and the level measured 48 tries, far
// too hard to meet a new thing on. Starting it at 60 measured 17, which left
// TRIGGER and DROP more than three times the levels before them while chapter
// 2 is still half empty; at 120 it is 20, inside its band.
// ─────────────────────────────────────────────────────────────────────────
export const A80 = {
  id: 'a80-good-boy',
  hint: 'THE DOG IS GOING THE WRONG WAY',
  world: 'backyard',
  verb: 'GOOD BOY',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  freezeAt: 300,
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    { id: 'shelf',  type: 'platform', x: 120, y: 800,  w: 470, h: 20 },
    { id: 'post',   type: 'platform', x: 570, y: 740,  w: 20,  h: 60 },
  ],
  objects: [
    { id: 'dog',   type: 'dog',    x: 440, y: 800, dir: -1 },
    // Weighed: the dog masses about 206, and no line 300 units of ink can buy
    // comes near 150, so a dropped stroke cannot press it instead.
    { id: 'plate', type: 'switch', x: 480, y: 774, w: 86, h: 26, triggers: ['gate'],
      requires: 'heavy', minMass: 150 },
    { id: 'gate',  type: 'gate',   x: 560, y: 960, w: 34, h: 192 },
  ],
  zones: [],
  drawing: { maxLength: 300 },
  solver: null,
};
