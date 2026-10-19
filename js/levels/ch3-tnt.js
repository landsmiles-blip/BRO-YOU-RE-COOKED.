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
// A53 — COVER.  Introduces: TNT — and that solid things stop a blast.
//
// A barrel sits in a cellar under his path, and the only way across is over
// the slot right above it. Do nothing and he is standing on the slot when the
// fuse runs out. Nothing can move the barrel, so the question is not where the
// bomb goes but what stands between it and him: cover the hole.
//
// THE EASIEST TNT LEVEL IN THE GAME, so it opens the chapter: one barrel that
// cannot move, one fuse, one hole. It was meant to be the chapter's breather,
// and measured 9-10 tries in every variant tried — a wider slot, an earlier
// fuse, a wooden grate over it — because nearly any line laid over the slot is
// cover. The curve's own rule (a noun is introduced by its easiest level)
// moved it to the front. Measured: 64% of winning strokes are an anchored
// lid, 9% a dropped one; most of the rest make him late.
//
// The slot is 24 units: he crosses anything up to 28 unaided, and is stuck in
// anything from 32 — measured, so the hole is a threat and not a trap.
// ─────────────────────────────────────────────────────────────────────────
export const A53 = {
  id: 'a53-cover',
  hint: 'HE HAS TO WALK RIGHT OVER IT',
  world: 'backyard',
  verb: 'COVER',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 500,
  goal: { id: 'goal', x: 662, y: 1152, w: 70, h: 140 },
  static: [
    { id: 'slabL', type: 'platform', x: 0, y: 1152, w: 398, h: 20 },
    { id: 'slabR', type: 'platform', x: 422, y: 1152, w: 298, h: 20 },
    { id: 'earthL', type: 'platform', x: 0, y: 1172, w: 368, h: 108 },
    { id: 'earthR', type: 'platform', x: 452, y: 1172, w: 268, h: 108 },
    { id: 'cellarFloor', type: 'platform', x: 368, y: 1232, w: 84, h: 48 },
  ],
  objects: [
    { id: 'tnt', type: 'tnt', x: 410, y: 1210, radius: 22,
      density: 0.03, restitution: 0.05, friction: 0.4, fuse: 1800, lethal: { kind: 'none' } },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A52 — KEEP AWAY.  The barrel that moves.
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
// MEASURED, AND LESS OF A DELIVERY THAN IT LOOKS. Left alone the barrel lands
// 110 units from the fence — inside its 130 reach, so it would break the
// bottom boards by itself. What kills him is that he is standing beside it. So
// most winning strokes either nudge it on toward the fence (the certified one
// moves it 56 units) or hold him back with a dropped line until it has gone
// off. Both answer "not with him next to it", which is the point; neither is
// the long delivery the layout suggests.
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

// ─────────────────────────────────────────────────────────────────────────
// A54 — SHELTER.  The barrel that opens the way is right above his head.
//
// The fence is short and wooden, and the barrel that will open it sits on top
// of it. He walks up, stops at the fence, and waits — right underneath. When
// the fuse runs out it breaks the fence and him with it. The barrel cannot be
// moved somewhere useful (knock it off and it lands in his path), and he
// cannot get through until it goes. So the decision is what is over his head
// when it does: give him cover, or keep him back until it has gone.
//
// THE FUSE IS LONG ON PURPOSE. He reaches the fence at 2.0 s and it goes at
// 3.0: a dropped line can hold him back for half a second, not a whole one,
// so the hold-back that wins the other TNT levels only wins here if it holds
// him far enough back for the whole wait. Measured: 60% of winning strokes
// hold him back with a fallen line until the blast clears it away, 30% are
// cover. Both answer the hint.
// ─────────────────────────────────────────────────────────────────────────
export const A54 = {
  id: 'a54-shelter',
  hint: 'IT WILL GO OFF RIGHT OVER HIS HEAD',
  world: 'backyard',
  verb: 'SHELTER',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 600,
  goal: { id: 'goal', x: 662, y: 1152, w: 70, h: 140 },
  static: [
    { id: 'ground', type: 'platform', x: 0, y: 1152, w: 720, h: 128 },
    { id: 'board0', type: 'platform', x: 520, y: 1052, w: 30, h: 50, breakable: true },
    { id: 'board1', type: 'platform', x: 520, y: 1102, w: 30, h: 50, breakable: true },
    { id: 'cap', type: 'platform', x: 506, y: 1040, w: 58, h: 12, breakable: true },
  ],
  objects: [
    { id: 'tnt', type: 'tnt', x: 535, y: 1018, radius: 22,
      density: 0.03, restitution: 0.05, friction: 0.4, fuse: 3000, lethal: { kind: 'none' } },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A55 — PROTECT.  The chapter's boss: the wood is his, this time.
//
// He has to cross a wooden bridge over a pit, and the barrel drops straight
// onto it. Left alone it sits on the planks, goes off as he reaches them, and
// takes him and the bridge together. FENCE taught that a blast breaks wood;
// here that is the danger. The decision: keep the bomb off the bridge he
// needs — up onto the shelf, or back behind him — or give him a way across
// that the blast cannot take.
//
// Measured: 41% of winning strokes send it up to the shelf, 25% knock it
// clear with a dropped line, and about 30% build him his own crossing.
// ─────────────────────────────────────────────────────────────────────────
export const A55 = {
  id: 'a55-protect',
  hint: 'HE NEEDS THAT BRIDGE',
  world: 'backyard',
  verb: 'PROTECT',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 450,
  goal: { id: 'goal', x: 662, y: 1152, w: 70, h: 140 },
  static: [
    { id: 'groundL', type: 'platform', x: 0, y: 1152, w: 260, h: 128 },
    { id: 'groundR', type: 'platform', x: 460, y: 1152, w: 260, h: 128 },
    ...Array.from({ length: 5 }, (_, i) => (
      { id: `plank${i}`, type: 'platform', x: 260 + i * 40, y: 1152, w: 40, h: 22, breakable: true })),
    { id: 'shelf', type: 'platform', x: 420, y: 880, w: 300, h: 28 },
  ],
  objects: [
    { id: 'tnt', type: 'tnt', x: 360, y: 560, radius: 22,
      density: 0.03, restitution: 0.05, friction: 0.4, fuse: 1500, lethal: { kind: 'none' } },
  ],
  zones: [
    { id: 'pit', kind: 'zone', x: 262, y: 1200, w: 196, h: 80, lethal: true },
  ],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A56 — STAY.  The dog, re-asking GOOD BOY's question with a fuse lit.
//
// The barrel that will open his fence sits at the end of the dog's shelf, and
// the dog is trotting straight at it. Left alone it noses the barrel off the
// end; the barrel drops beside the fence where he is waiting and goes off
// with him next to it. Turn the dog back and the barrel stays where it was
// put — high enough to spare him, close enough to take the fence.
//
// The dog turned by a wall paces between it and the post for the rest of the
// level, so it is never near the barrel again. A wall at the shelf's END does
// not do it: the dog keeps shoving the barrel against it and is still there
// when it goes. Measured: 85% of wins turn the dog with a line on its shelf,
// about 10% shield him instead; with the dog deleted doing nothing wins, and
// with the barrel deleted nothing opens the fence. The shelf's length is the
// dial — starting at 200 it measured 50 tries, at 140 28, at 100 22.
// ─────────────────────────────────────────────────────────────────────────
export const A56 = {
  id: 'a56-stay',
  hint: 'THE DOG WILL KNOCK IT OFF',
  world: 'backyard',
  verb: 'STAY',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 300,
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    // Over his head: he walks under it to the fence.
    { id: 'shelf',  type: 'platform', x: 100, y: 1000, w: 370, h: 20 },
    { id: 'post',   type: 'platform', x: 100, y: 940,  w: 20,  h: 60 },
    // One tall board, in the barrel's line of sight past the shelf's corner.
    // A shorter one is shielded by the shelf it sits on.
    { id: 'board0', type: 'platform', x: 560, y: 1032, w: 30, h: 120, breakable: true },
  ],
  objects: [
    { id: 'dog', type: 'dog', x: 160, y: 1000, dir: 1 },
    { id: 'tnt', type: 'tnt', x: 455, y: 978, radius: 22,
      density: 0.03, restitution: 0.05, friction: 0.4, fuse: 3000, lethal: { kind: 'none' } },
  ],
  zones: [],
  drawing: { maxLength: 300 },
  solver: null,
};
