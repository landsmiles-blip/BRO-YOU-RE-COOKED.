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
// 2 is still half empty, so the shelf starts at 180: 20 tries, inside its band.
// (It was 120 until the dog learned to turn when it bumps its head, which made
// more strokes turn it.)
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
    { id: 'shelf',  type: 'platform', x: 180, y: 800,  w: 410, h: 20 },
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

// ─────────────────────────────────────────────────────────────────────────
// A81 — DOWN BOY.  The dog, re-asking CARRY's question: take it down.
//
// The plate is on the low floor, past a spike pit, and the dog is up on the
// high shelf trotting toward the drop. Walking off an edge it falls almost
// straight down — into the pit, not across it. A slide from the shelf's end
// to the low floor takes it down and over; once there it presses the plate,
// turns at the post and paces, back up the slide and down again.
//
// Allowed by the amended rule (docs/PLAN.md 4.1): CARRY asks it of Milo in
// the balloon chapter; here it is the dog, on a shelf over his head, while he
// waits at the gate. Census: every win is the dog pressing the plate (69 of
// 69), almost all down a slide and one caught by a floor laid over the pit;
// with the dog deleted, nothing presses it.
// ─────────────────────────────────────────────────────────────────────────
export const A81 = {
  id: 'a81-down-boy',
  hint: "THE DOG CAN'T GET DOWN THERE",
  world: 'backyard',
  verb: 'DOWN BOY',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  freezeAt: 300,
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    { id: 'postL',  type: 'platform', x: 160, y: 680,  w: 20,  h: 60 },
    { id: 'high',   type: 'platform', x: 160, y: 740,  w: 220, h: 20 },
    { id: 'low',    type: 'platform', x: 470, y: 920,  w: 150, h: 20 },
    { id: 'postR',  type: 'platform', x: 600, y: 860,  w: 20,  h: 60 },
    // the pit: a stone box with spikes in the bottom
    { id: 'pitL',   type: 'platform', x: 320, y: 940,  w: 20,  h: 90 },
    { id: 'pitR',   type: 'platform', x: 470, y: 940,  w: 20,  h: 90 },
    { id: 'pitF',   type: 'platform', x: 320, y: 1030, w: 170, h: 20 },
  ],
  objects: [
    { id: 'dog',   type: 'dog',    x: 240, y: 740, dir: 1 },
    // Weighed, as GOOD BOY's: only the dog presses it, never a dropped line.
    { id: 'plate', type: 'switch', x: 520, y: 894, w: 80, h: 26, triggers: ['gate'],
      requires: 'heavy', minMass: 150 },
    // His gate is at his start, so a dog lost in the pit is always lost before
    // he could have reached the goal: no race between the two.
    { id: 'gate',  type: 'gate',   x: 140, y: 960, w: 34, h: 192 },
  ],
  zones: [
    { id: 'spikes', kind: 'zone', x: 340, y: 1000, w: 130, h: 30, lethal: true },
  ],
  drawing: { maxLength: 260 },
  solver: null,
};
