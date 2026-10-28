// CHAPTER 3 — BEES. The new levels for this chapter live in this file, and
// only this chapter's designer edits it. js/levels.js places each level into
// its slot in CHAPTERS; `npm run curve` prints every slot's target.
//
// Level constants A120-A139 belong to this chapter, so parallel work never
// collides on an id. Before adding a level, read CLAUDE.md (THE BEES), docs/
// CASE_STUDY.md (why this element) and docs/HELD.md.
//
// THE SWARM (js/bees.js): a hive releases bees that fly straight at the
// nearest living walker and kill by touch. They are dumb homers — they press
// against whatever is between them and him and only get round it by sliding
// along it as he moves — so every level here is a question about WHERE the
// line has to stand between them. Measured before any of these was built: a
// gap to close in THIN geometry is a needle for a shaky hand (146 tries); the
// same gap in THICK geometry, where any line laid in it seals it, is not (18).
// Every gap in this chapter is in something thick for that reason.
//
// VARIANTS. This chapter applies the case study's one big lesson (docs/
// CASE_STUDY.md, D): the hits get their volume from the SAME decision in new
// arrangements. Where two levels here ask the same thing, each says so, and
// each looks different on the opening frame and is won with a differently
// shaped line.

import { MILO } from '../constants.js';

const ground = { id: 'ground', type: 'platform', x: 0, y: 1152, w: 720, h: 128 };

// ─────────────────────────────────────────────────────────────────────────
// A120 — SWARM.  Introduces: bees.
//
// A porch over his start, a shed over the door, and a gap in the roof between
// them right under the hive. The swarm is already coming down when the world
// stops; do nothing and they come through the gap and find him on his way.
// Close the roof.
//
// The roof is 60 thick so any line laid across the gap, at any height in it,
// seals it, and a line dropped above it falls in and seals it too — that is
// what makes this an introduction rather than a needle. Six bees, not twelve:
// fewer, and still a swarm.
// ─────────────────────────────────────────────────────────────────────────
export const A120 = {
  id: 'a120-swarm',
  hint: 'THE SWARM IS COMING',
  world: 'backyard',
  verb: 'SWARM',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 500,
  goal: { id: 'goal', x: 440, y: 1152, w: 70, h: 140 },
  static: [
    ground,
    { id: 'post', type: 'platform', x: 0, y: 960, w: 20, h: 192 },
    { id: 'porch', type: 'platform', x: 0, y: 960, w: 220, h: 60 },
    { id: 'shed', type: 'platform', x: 340, y: 960, w: 180, h: 60 },
    { id: 'shedWall', type: 'platform', x: 500, y: 960, w: 20, h: 192 },
    { id: 'branch', type: 'platform', x: 200, y: 694, w: 160, h: 16 },
  ],
  objects: [{ id: 'hive', type: 'hive', x: 280, y: 740, radius: 26, bees: 6 }],
  zones: [],
  drawing: { maxLength: 420 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A122 — DOGHOUSE.  Bees and the dog: shut it in.
//
// The dog is trotting out of its house along the deck, into the open under the
// hive. They go for the NEAREST living thing, and Milo is safe under the deck,
// so it is the dog they want. A line across the house's long front, anywhere
// ahead of the dog, turns it back inside and shuts the swarm out at once.
//
// The house's awning is the dial — a longer one is more room ahead of the dog
// to draw in — and it measures as this chapter's spike, not an early level:
// honest (below), 46 tries at 480 units with the freeze at 300ms. There is
// a post at the deck's far end so a dog that gets out still has somewhere to
// pace rather than walking off the world.
//
// MILO WAITS AT A GATE, AND THE DOG OPENS IT ON ITS WAY BACK IN. The first
// build had him walk straight home, and the race check found 19% of its wins
// were a dog still out in the swarm when he reached the door, stung a moment
// later — a win a player redrawing the same line loses half the time. The
// plate at the back of the house fires only for a dog the line has turned
// round, so a dog left outside never lets him out. It cost the level its easy
// wins: 29 tries with the races counted, 46-55 without. The gate is right by
// his start so his walk home is long: with it 120 units further on, a line
// that leaked slowly still lost the dog after the finish in 6% of the wins.
// ─────────────────────────────────────────────────────────────────────────
export const A122 = {
  id: 'a122-doghouse',
  hint: 'THE DOG IS HEADING OUT',
  world: 'backyard',
  verb: 'DOGHOUSE',
  milo: { start: { x: 40, y: 1152 }, speed: MILO.speed },
  freezeAt: 300,
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  static: [
    ground,
    { id: 'deck', type: 'platform', x: 0, y: 800, w: 720, h: 60 },
    { id: 'back', type: 'platform', x: 0, y: 650, w: 30, h: 150 },
    { id: 'house', type: 'platform', x: 0, y: 650, w: 480, h: 50 },
    { id: 'end', type: 'platform', x: 700, y: 700, w: 20, h: 100 },
    { id: 'branch', type: 'platform', x: 490, y: 474, w: 160, h: 16 },
  ],
  objects: [
    { id: 'hive', type: 'hive', x: 570, y: 520, radius: 26, bees: 8 },
    { id: 'dog', type: 'dog', x: 130, y: 800, dir: 1 },
    { id: 'plate', type: 'switch', x: 35, y: 788, w: 70, h: 12, triggers: ['gate'] },
    { id: 'gate', type: 'gate', x: 80, y: 1012, w: 20, h: 140 },
  ],
  zones: [],
  drawing: { maxLength: 260 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A123 — HIVE.  Stop them where they start.
//
// The hive hangs from a bough over the middle of an open walk, with nothing to
// shelter under anywhere, and the swarm is circling it, about to come out. A
// line hung under the hive from either of its two hooks holds all of them for
// the whole walk: they press straight down at him and never work out the way
// round. Measured before this was built — a flat line under a hive held eight
// bees while he crossed the level.
//
// One hook measured 40-58 tries (the swarm's weave decides how soon they slide
// off a short lid); two, a lid can hang from either and they are 140 apart.
// Their length is the dial: 110 units, 45 tries; 150, 39.
// ─────────────────────────────────────────────────────────────────────────
export const A123 = {
  id: 'a123-hive',
  hint: "THEY'RE ABOUT TO COME OUT",
  world: 'backyard',
  verb: 'HIVE',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 400,
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  static: [
    ground,
    { id: 'bough', type: 'platform', x: 240, y: 560, w: 240, h: 18 },
    { id: 'hookL', type: 'platform', x: 282, y: 578, w: 16, h: 150 },
    { id: 'hookR', type: 'platform', x: 422, y: 578, w: 16, h: 150 },
  ],
  objects: [{ id: 'hive', type: 'hive', x: 360, y: 620, radius: 24, bees: 8, attackAt: 700, guard: 34 }],
  zones: [],
  drawing: { maxLength: 360 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A124 — TOP DOG.  Bees and the dog: cover the pen.
//
// Milo walks home under a long shelf where nothing can reach him. On top of it
// the dog paces between two posts, right under the hive — so the dog is what
// they come for. Put a lid on the pen: across the posts, or a dropped line
// that lands on them. DOGHOUSE asks the player to shut a door the dog walks
// into; this one is a lid over a dog that cannot leave.
// ─────────────────────────────────────────────────────────────────────────
export const A124 = {
  id: 'a124-top-dog',
  hint: "THEY'RE AFTER THE DOG",
  world: 'backyard',
  verb: 'TOP DOG',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 400,
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  static: [
    ground,
    { id: 'shelf', type: 'platform', x: 0, y: 880, w: 720, h: 20 },
    { id: 'postL', type: 'platform', x: 236, y: 820, w: 24, h: 60 },
    { id: 'postR', type: 'platform', x: 460, y: 820, w: 24, h: 60 },
    { id: 'branch', type: 'platform', x: 280, y: 520, w: 160, h: 16 },
  ],
  objects: [
    { id: 'hive', type: 'hive', x: 360, y: 566, radius: 26, bees: 8 },
    { id: 'dog', type: 'dog', x: 330, y: 880, dir: 1 },
  ],
  zones: [],
  drawing: { maxLength: 320 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A125 — STAIRS.  SWARM's question on the way down.
//
// He walks down two steps under a roof with a gap over the first step, and
// the hive over the gap. A variant of SWARM: the same decision, but the walk
// drops away underneath the roof, so the line that closes the gap is drawn
// with a lot of open air beneath it — and he takes longer to get home, so the
// roof has to hold for longer. The gap is 100 units: at 120 it measured 51
// tries, past the band of the slot it was built for.
// ─────────────────────────────────────────────────────────────────────────
export const A125 = {
  id: 'a125-stairs',
  hint: 'THEY CAN GET IN',
  world: 'backyard',
  verb: 'STAIRS',
  milo: { start: { x: 60, y: 1000 }, speed: MILO.speed },
  freezeAt: 500,
  goal: { id: 'goal', x: 640, y: 1152, w: 70, h: 140 },
  static: [
    { id: 'step1', type: 'platform', x: 0, y: 1000, w: 260, h: 280 },
    { id: 'step2', type: 'platform', x: 260, y: 1076, w: 200, h: 204 },
    { id: 'floor', type: 'platform', x: 460, y: 1152, w: 260, h: 128 },
    { id: 'post', type: 'platform', x: 0, y: 860, w: 20, h: 140 },
    { id: 'roofL', type: 'platform', x: 0, y: 860, w: 260, h: 60 },
    { id: 'roofR', type: 'platform', x: 360, y: 860, w: 360, h: 60 },
    { id: 'wall', type: 'platform', x: 700, y: 920, w: 20, h: 232 },
    { id: 'branch', type: 'platform', x: 240, y: 600, w: 160, h: 16 },
  ],
  objects: [{ id: 'hive', type: 'hive', x: 320, y: 646, radius: 26, bees: 6 }],
  zones: [],
  drawing: { maxLength: 380 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A126 — WALKIES.  Bees, the dog and a plate: the chapter's boss.
//
// Milo waits at a shut gate under the deck, out of the swarm's reach. The only
// thing that opens it is the dog, trotting out of its house along the deck to
// the plate — through the open stretch under the hive. They go for the dog.
// Roof its walk: close the gap between its house and the awning that covers
// the plate. Shutting it in its house, DOGHOUSE's answer, keeps the dog alive
// and Milo behind the gate for ever.
//
// The gap is the dial: 220 units, 176 tries; 180, 121; 140, 113; 120, 64.
// A plate is a back door to any gate, but not here: a line dropped on the
// plate lets Milo out and leaves the dog in the open.
// ─────────────────────────────────────────────────────────────────────────
export const A126 = {
  id: 'a126-walkies',
  hint: 'THE DOG HAS TO GET THERE',
  world: 'backyard',
  verb: 'WALKIES',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 400,
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  static: [
    ground,
    { id: 'deck', type: 'platform', x: 0, y: 800, w: 720, h: 60 },
    { id: 'back', type: 'platform', x: 0, y: 650, w: 30, h: 150 },
    { id: 'house', type: 'platform', x: 0, y: 650, w: 200, h: 50 },
    { id: 'awning', type: 'platform', x: 320, y: 650, w: 400, h: 50 },
    { id: 'post', type: 'platform', x: 640, y: 700, w: 20, h: 100 },
    { id: 'branch', type: 'platform', x: 250, y: 454, w: 160, h: 16 },
  ],
  objects: [
    { id: 'hive', type: 'hive', x: 330, y: 500, radius: 26, bees: 8 },
    { id: 'dog', type: 'dog', x: 110, y: 800, dir: 1 },
    { id: 'plate', type: 'switch', x: 450, y: 788, w: 90, h: 12, triggers: ['gate'] },
    { id: 'gate', type: 'gate', x: 200, y: 1012, w: 20, h: 140 },
  ],
  zones: [],
  drawing: { maxLength: 320 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A127 — LOG.  A variant of HIVE's question: stop them where they start.
//
// The nest is inside a hollow log lying over his walk, its mouth facing him.
// HIVE is won with a cup hung under the hive; this is won with a DOOR — a
// short upright line across the mouth, between two thick lips — and the
// opening frame is a log, not a branch (the case study's variant rule, D).
//
// THE MOUTH FACES HIM, because they are dumb homers. Sketched first with the
// mouth facing him but the log right over his start: by the time they came
// out he was already under it, and the swarm sat pressed against the log's
// floor, directly above him, for the whole run — doing nothing won. With the
// log further on and the swarm let out at 500ms, they come out while he is
// still in the open in front of it: the danger is ahead of him, never behind.
//
// Measured 25 Oct under this id (the id seeds the swarm): 19 tries, hand rate
// 65%, five families. Of 140 winning strokes, 83 keep all six bees in the
// log and 134 keep at least half of them in.
// ─────────────────────────────────────────────────────────────────────────
export const A127 = {
  id: 'a127-log',
  hint: 'THE LOG IS FULL OF BEES',
  world: 'backyard',
  verb: 'LOG',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 400,
  goal: { id: 'goal', x: 640, y: 1152, w: 70, h: 140 },
  static: [
    ground,
    { id: 'logTop', type: 'platform', x: 300, y: 700, w: 420, h: 60 },
    { id: 'logBottom', type: 'platform', x: 300, y: 840, w: 420, h: 60 },
    { id: 'logEnd', type: 'platform', x: 500, y: 760, w: 220, h: 80 },
  ],
  objects: [{ id: 'hive', type: 'hive', x: 400, y: 800, radius: 22, bees: 6, attackAt: 500, guard: 30 }],
  zones: [],
  drawing: { maxLength: 300 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A129 — WINDOW.  A variant of SWARM's question: close the way in.
//
// SWARM's gap is in his roof and the hive is above it; here the nest hangs
// outside the end wall of his house and the way in is a window in that wall,
// so the line that closes it stands UPRIGHT instead of lying flat. Different
// frame, differently shaped line (the census families are spans and arcs
// standing in the window, not lids).
//
// THE WINDOW IS 200 TALL. At 100 it measured 11 tries — easier than SWARM,
// which must stay the easiest bee level — and at 160 it measured 15; at 200
// it measures 23, this slot's target. The wall either side is 60 thick, so
// any line laid in the window seals it.
//
// Of 133 winning strokes, 75 shut every bee out of the house. Most of the
// rest are a line dropped inside the room that falls between him and the
// swarm long enough for him to reach the door — a shield, which is this
// chapter's other answer, not a bypass.
// ─────────────────────────────────────────────────────────────────────────
export const A129 = {
  id: 'a129-window',
  hint: "THEY'LL COME IN THE WINDOW",
  world: 'backyard',
  verb: 'WINDOW',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 400,
  goal: { id: 'goal', x: 470, y: 1152, w: 70, h: 140 },
  static: [
    ground,
    { id: 'roof', type: 'platform', x: 120, y: 700, w: 500, h: 60 },
    { id: 'wallTop', type: 'platform', x: 560, y: 760, w: 60, h: 60 },
    { id: 'wallBottom', type: 'platform', x: 560, y: 1020, w: 60, h: 132 },
    { id: 'branch', type: 'platform', x: 630, y: 700, w: 90, h: 16 },
  ],
  objects: [{ id: 'hive', type: 'hive', x: 676, y: 746, radius: 24, bees: 6 }],
  zones: [],
  drawing: { maxLength: 320 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A130 — CHIMNEY.  A breather: the nest is in his chimney.
//
// The only way out of the chimney is down, into his house, ahead of him; any
// line across the shaft below the nest shuts it, and the shaft's walls are 40
// thick, so a line laid anywhere in it holds (CLAUDE.md, a slot in thick
// geometry). A variant of LOG's question — stop them where they start — in a
// frame that stands up instead of lying down.
//
// Sketched first with the hive hung ABOVE the chimney: the swarm slid off its
// walls onto the roof beside it and sat there for the whole run, because the
// walls stand above the roof and they are dumb homers — doing nothing won.
// The nest had to be inside. Measured 25 Oct under this id: a TALL shaft is
// the easy one — 220 tall, 20 tries — because there is more of it to lay a
// line in (180 measured 29, and 140 measured 31 with a 30u precision floor).
// Of 144 winning strokes, 89 keep five or six bees in the chimney; most of
// the rest are a line in the house shielding him to the door.
// ─────────────────────────────────────────────────────────────────────────
export const A130 = {
  id: 'a130-chimney',
  hint: "THERE'S A NEST IN THE CHIMNEY",
  world: 'backyard',
  verb: 'CHIMNEY',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed },
  freezeAt: 400,
  goal: { id: 'goal', x: 560, y: 1152, w: 70, h: 140 },
  static: [
    ground,
    { id: 'roofL', type: 'platform', x: 100, y: 760, w: 180, h: 60 },
    { id: 'chimL', type: 'platform', x: 280, y: 600, w: 40, h: 220 },
    { id: 'chimR', type: 'platform', x: 400, y: 600, w: 40, h: 220 },
    { id: 'roofR', type: 'platform', x: 440, y: 760, w: 220, h: 60 },
    { id: 'wallR', type: 'platform', x: 640, y: 820, w: 20, h: 332 },
  ],
  objects: [{ id: 'hive', type: 'hive', x: 360, y: 650, radius: 24, bees: 6, attackAt: 500, guard: 30 }],
  zones: [],
  drawing: { maxLength: 300 },
  solver: null,
};
