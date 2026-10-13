// CHAPTER 5 — BALLOONS. The new levels for this chapter live in this file, and
// only this chapter's designer (designer C) edits it. js/levels.js places each
// level into its slot in CHAPTERS; `npm run curve` prints every slot's target.
//
// Level constants A100-A109 belong to this chapter, so parallel work never collides
// on an id. Before adding a level, read CLAUDE.md, docs/PLAN.md (the production
// line, and this chapter's slots in 4.4) and docs/HELD.md (what was already
// tried and why it was shelved).
//
// The schema is the one every level in js/levels.js uses; copy the closest
// shipped level rather than starting from nothing.

import { MILO, LINE } from '../constants.js';

// ─────────────────────────────────────────────────────────────────────────
// A100 — BALLOON.  Introduces: the balloon, on its own.
//
// A balloon on the floor will go straight up into the roof and sit there for
// the rest of the level — a flat roof holds a rising thing exactly where it
// arrives. The plate that opens his gate is under the same roof, a few
// units to the right of where it will stop. So the first thing the chapter
// teaches is the one fact everything after it uses: your line is a CEILING
// to a balloon, and a ceiling that slopes up steers it.
//
// FLOAT (A30) asks the same question from further away and measures 61 tries,
// too hard to meet the balloon on, which is what the plan said: a gentler
// level takes the intro and FLOAT becomes the chapter's spike. This is that
// level — the plate starts 26 units from where the balloon stops, and the ink
// is 400 (at 300 the same layout measured 46).
//
// The gate is taller than FLOAT's on purpose: at 140 a ramp over it was 2% of
// the wins, a climb that skips the balloon entirely.
// ─────────────────────────────────────────────────────────────────────────
export const A100 = {
  id: 'a100-balloon',
  hint: 'IT GOES STRAIGHT UP',
  world: 'backyard',
  verb: 'BALLOON',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  freezeAt: 300,
  goal: { id: 'goal', x: 665, y: 1152, w: 70, h: 140 },
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    { id: 'roof',   type: 'platform', x: 180, y: 560,  w: 440, h: 18 },
    { id: 'jamb',   type: 'platform', x: 162, y: 560,  w: 18,  h: 150 },
  ],
  objects: [
    { id: 'balloon', type: 'boulder', x: 250, y: 1000, radius: 24,
      density: 0.3, restitution: 0.05, friction: 0.1, lift: 2400, lethal: { kind: 'none' } },
    // Weighed, like FLOAT's: 400 units of ink buys no line heavy enough to
    // press it, so a dropped stroke cannot skip the balloon.
    { id: 'plate', type: 'switch', x: 300, y: 578, w: 180, h: 30, triggers: ['gate'],
      requires: 'heavy', minMass: 200, from: 'below' },
    { id: 'gate', type: 'gate', x: 560, y: 960, w: 34, h: 192 },
  ],
  zones: [],
  drawing: { maxLength: 400 },
  solver: null,
};

// ─────────────────────────────────────────────────────────────────────────
// A101 — LOW BLOW.  The balloon and the barrel at once: a barrel that floats.
//
// The wooden fence that shuts him in opens only to a blast, and the barrel
// that could blow it starts right behind it — but this barrel floats. Left
// alone it is long gone by the time the fuse runs out, and it goes off at the
// top of the sky with the fence untouched. Hold it down. Not too low, though:
// he is waiting at the fence when it goes, and a lid at his head height keeps
// it close enough to take him with the fence.
//
// Measured with a flat lid from the fence: at 880 to 960 he wins (a close
// call at 960, 26 units), at 1000 the blast takes him, and with nothing drawn
// he is stuck. The bottom board is 172 tall so that the band that opens the
// fence reaches up to meet the band that spares him: at 132 the window was
// 127 units and the precision floor 20u, under the thumb limit; at 172 it is
// 65u.
//
// The census: every win is an anchored line holding the barrel down. Holding
// HIM back does nothing — the barrel floats off whatever he does — and no win
// draws through it.
// ─────────────────────────────────────────────────────────────────────────
export const A101 = {
  id: 'a101-low-blow',
  hint: 'IT WILL FLOAT OFF BEFORE IT GOES OFF',
  world: 'backyard',
  verb: 'LOW BLOW',
  milo: { start: { x: 70, y: 1152 }, speed: MILO.speed },
  freezeAt: 300,
  goal: { id: 'goal', x: 665, y: 1152, w: 60, h: 140 },
  static: [
    { id: 'ground', type: 'platform', x: 0,   y: 1152, w: 720, h: 128 },
    { id: 'board0', type: 'platform', x: 520, y: 840,  w: 30,  h: 70,  breakable: true },
    { id: 'board1', type: 'platform', x: 520, y: 910,  w: 30,  h: 70,  breakable: true },
    { id: 'board2', type: 'platform', x: 520, y: 980,  w: 30,  h: 172, breakable: true },
  ],
  objects: [
    { id: 'tnt', type: 'tnt', x: 590, y: 1110, radius: 22,
      density: 0.3, restitution: 0.05, friction: 0.1, fuse: 2400, lift: 2400, lethal: { kind: 'none' } },
  ],
  zones: [],
  drawing: { maxLength: LINE.maxLengthDefault },
  solver: null,
};
