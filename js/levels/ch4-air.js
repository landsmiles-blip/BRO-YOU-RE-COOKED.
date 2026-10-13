// CHAPTER 4 — AIR. The new levels for this chapter live in this file, and
// only this chapter's designer (designer B) edits it. js/levels.js places each
// level into its slot in CHAPTERS; `npm run curve` prints every slot's target.
//
// Level constants A90-A99 belong to this chapter, so parallel work never collides
// on an id. Before adding a level, read CLAUDE.md, docs/PLAN.md (the production
// line, and this chapter's slots in 4.4) and docs/HELD.md (what was already
// tried and why it was shelved).
//
// The schema is the one every level in js/levels.js uses; copy the closest
// shipped level rather than starting from nothing.

import { MILO } from '../constants.js';

// ─────────────────────────────────────────────────────────────────────────
// A90 — GUST.  The air carries whatever is in it — him included.
//
// The far side is 120 units higher than he is: no ramp the ink can pay for
// climbs it, and no bridge reaches it. Between them a draught rises out of the
// pit, leaning toward the far side. Walking, it cannot lift him — while his
// feet are on something they own his speed — and stepping off the edge he
// drops almost straight down, beside the air instead of in it. Give him
// somewhere to step off from INSIDE the gust and it takes him up and over.
//
// Measured: with the draught deleted, 0 wins of 764 plausible strokes. With
// it, every win walks him out over the air before he leaves the line —
// anchored (83%), or dropped across the edge as a step (17%). At 160 ink the
// line had to reach the gust at full stretch and no hand held it (0%); the
// gust now starts 80 units from the edge and the ink is 240.
// ─────────────────────────────────────────────────────────────────────────
export const A90 = {
  id: 'a90-gust',
  hint: "HE CAN'T GET UP THERE ON FOOT",
  world: 'backyard',
  verb: 'GUST',
  milo: { start: { x: 90, y: 800 }, speed: MILO.speed },
  freezeAt: 300,
  goal: { id: 'goal', x: 640, y: 680, w: 70, h: 140 },
  static: [
    { id: 'ledge', type: 'platform', x: 0,   y: 800, w: 220, h: 480 },
    { id: 'far',   type: 'platform', x: 500, y: 680, w: 220, h: 600 },
  ],
  objects: [],
  zones: [
    { id: 'pit',  kind: 'zone',    x: 220, y: 1240, w: 280, h: 40,  lethal: true },
    { id: 'gust', kind: 'updraft', x: 300, y: 560,  w: 200, h: 680, accel: -2400, ax: 700 },
  ],
  drawing: { maxLength: 240 },
  solver: null,
};
