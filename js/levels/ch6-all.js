// CHAPTER 6 — ALL OF IT. The new levels for this chapter live in this file, and
// only this chapter's designer (designer C) edits it. js/levels.js places each
// level into its slot in CHAPTERS; `npm run curve` prints every slot's target.
//
// Level constants A110-A129 belong to this chapter, so parallel work never collides
// on an id. Before adding a level, read CLAUDE.md, docs/PLAN.md (the production
// line, and this chapter's slots in 4.4) and docs/HELD.md (what was already
// tried and why it was shelved).
//
// The schema is the one every level in js/levels.js uses; copy the closest
// shipped level rather than starting from nothing.

import { MILO, LINE } from '../constants.js';

// ─────────────────────────────────────────────────────────────────────────
// A111 — TAILWIND.  The barrel, the wind and the fence at once.
//
// A wooden fence shuts him in, and only a blast opens it. The barrel drops a
// short way and lands in front of him; left there he walks into it and pushes
// it, and it goes off in his face. Rolled along the ground it is far too slow
// for its fuse. Holding him back does nothing: the fence stays shut unless the
// barrel reaches it. The one thing fast enough is the draught just over his
// head, which blows whatever is fed into it to the fence. Put the bomb in the
// wind.
//
// THE SECOND BUILD. The first (A110, docs/HELD.md) dropped the barrel from
// high over a shelf, and a ramp off that shelf LAUNCHED it to the fence with
// no wind at all — 66 of its 76 wins survived the draught being deleted. Here
// the barrel drops from low, the only anchor is a post beside its fall, and
// the fence is 340 units away: a ramp cannot throw it there. Measured with the
// draught deleted, the level keeps 18 of its 69 wins, mostly dropped lines
// that happen to bounce it along — the wind decides three in four.
//
// The draught rides 128 units over his head: a barrel in it can never reach
// him, and it reaches the fence low enough to take the bottom board.
// ─────────────────────────────────────────────────────────────────────────
export const A111 = {
  id: 'a111-tailwind',
  hint: 'IT HAS TO GET THERE BEFORE HE DOES',
  world: 'backyard',
  verb: 'TAILWIND',
  milo: { start: { x: 50, y: 1152 }, speed: MILO.speed },
  freezeAt: 250,
  goal: { id: 'goal', x: 672, y: 1152, w: 60, h: 140 },
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    { id: 'post',   type: 'platform', x: 90,  y: 930,  w: 100, h: 16 },
    { id: 'board0', type: 'platform', x: 600, y: 900,  w: 30,  h: 70,  breakable: true },
    { id: 'board1', type: 'platform', x: 600, y: 970,  w: 30,  h: 70,  breakable: true },
    { id: 'board2', type: 'platform', x: 600, y: 1040, w: 30,  h: 112, breakable: true },
  ],
  objects: [
    { id: 'tnt', type: 'tnt', x: 220, y: 800, radius: 22,
      density: 0.03, restitution: 0.05, friction: 0.4, fuse: 1600, lethal: { kind: 'none' } },
  ],
  zones: [
    { id: 'draught', kind: 'updraft', x: 230, y: 940, w: 350, h: 128, accel: -2400, ax: 900 },
  ],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};
