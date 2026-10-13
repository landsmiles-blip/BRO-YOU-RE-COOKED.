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

// ─────────────────────────────────────────────────────────────────────────
// A51 — FENCE.  TNT as the tool, not the threat.
//
// A wooden fence stands between him and the way out, and nothing in the world
// can open it but the barrel. Left alone, the barrel lands short of the fence,
// he walks up to it, and it goes off with him beside it. The decision: get the
// bomb to the fence — and him nowhere near it when it goes. KEEP AWAY asked
// for distance; this asks for a delivery and distance at once.
//
// Built once on 12 Oct and lost uncommitted; this is the layout recorded in
// docs/PLAN.md Appendix A.
// ─────────────────────────────────────────────────────────────────────────
export const A51 = {
  id: 'a51-fence',
  hint: "HE CAN'T GET THROUGH",
  world: 'backyard',
  verb: 'BLAST',
  milo: { start: { x: 50, y: 1100 }, speed: MILO.speed },
  freezeAt: 350,
  goal: { id: 'goal', x: 646, y: 1100, w: 70, h: 140 },
  static: [
    { id: 'ground', type: 'platform', x: 0, y: 1100, w: 720, h: 180 },
    ...Array.from({ length: 10 }, (_, i) => (
      { id: `board${i}`, type: 'platform', x: 560, y: 460 + i * 64, w: 30, h: 64, breakable: true })),
  ],
  objects: [
    { id: 'tnt', type: 'tnt', x: 460, y: 420, radius: 22,
      density: 0.03, restitution: 0.05, friction: 0.4, fuse: 1500, lethal: { kind: 'none' } },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};
