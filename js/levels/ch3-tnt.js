// CHAPTER 3 — TNT. The new levels for this chapter live in this file, and
// only this chapter's designer edits it. js/levels.js places each level into
// its slot in CHAPTERS; `npm run curve` prints every slot's target.
//
// Level constants A51-A69 belong to this chapter, so parallel work never
// collides on an id. Before adding a level, read CLAUDE.md, docs/PLAN.md (the
// production line, and this chapter's slots in 4.4) and docs/HELD.md (what was
// already tried and why it was shelved).
//
// The schema is the one every level in js/levels.js uses; copy the closest
// shipped level rather than starting from nothing.

import { MILO, LINE } from '../constants.js';

// ─────────────────────────────────────────────────────────────────────────
// A52 — KEEP AWAY.  Introduces: TNT, on its own.
//
// A barrel with a lit fuse drops onto the path in front of him. Do nothing and
// he walks into it, pushes it along ahead of him — Milo pushes anything at his
// own pace — and is standing right behind it when the fuse runs out. The
// barrel is not the danger; WHERE IT IS when it goes off is.
//
// The decision: put it somewhere he is not going. He only ever walks right,
// so behind him is the safest place in the world. The trap is the instinct
// eight levels of blocking have built — stop it in front of him — which parks
// a bomb on the one path he has to take.
// ─────────────────────────────────────────────────────────────────────────
export const A52 = {
  id: 'a52-keepaway',
  hint: 'IT GOES OFF WHEREVER IT IS',
  world: 'backyard',
  verb: 'KEEP AWAY',
  milo: { start: { x: 140, y: 1152 }, speed: MILO.speed },
  freezeAt: 500,
  goal: { id: 'goal', x: 640, y: 1152, w: 80, h: 140 },
  static: [
    { id: 'ground', type: 'platform', x: 0, y: 1152, w: 720, h: 128 },
    { id: 'shelf', type: 'platform', x: 510, y: 900, w: 210, h: 28 },
  ],
  objects: [
    { id: 'tnt', type: 'tnt', x: 480, y: 520, radius: 22,
      density: 0.03, restitution: 0.05, friction: 0.4, fuse: 1700, lethal: { kind: 'none' } },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};
