// GATE TEST 5 — every level is a real puzzle.
//
// Each level must prove: nothing = failure, intended stroke = success, and the
// freeze lands before the danger. Beyond that each asserts the specific
// mechanic it exists to exercise.

import { playLevel, assertCore, makeAssert, OUTCOME } from './lib/run-level.js';
import { A1, A2, A3, A4 } from '../../js/levels.js';

const { assert, state } = makeAssert();

// ── A1 — WALL · your line is solid matter ───────────────────────────────
console.log('\nA1 — WALL   (the line is real, solid matter)\n');
{
  const span = [{ x: 300, y: 790 }, { x: 400, y: 790 }, { x: 510, y: 790 }];
  const { solved } = assertCore(assert, A1, span);
  assert('the span anchors to both shelves', solved.anchors > 0, `${solved.anchors} anchor(s)`);
  assert('an anchored stroke HOLDS', solved.strokeFell < 4, `moved ${solved.strokeFell.toFixed(0)}u`);

  // The anchoring MECHANIC, not a design opinion: A1 is generous on purpose,
  // so a floating stroke may still save him by delaying the ball. What must be
  // true is that it anchors to nothing and falls.
  const floating = playLevel(A1, [{ x: 355, y: 700 }, { x: 400, y: 700 }, { x: 445, y: 700 }]);
  assert('an unanchored stroke anchors to nothing', floating.anchors === 0, `${floating.anchors}`);
  assert('an unanchored stroke FALLS', floating.strokeFell > 200,
         `fell ${floating.strokeFell.toFixed(0)}u`);
}

// ── A2 — GAP · your line is terrain he can walk on ──────────────────────
console.log('\nA2 — GAP   (the line becomes terrain — and he must STEP UP onto it)\n');
{
  const bridge = [{ x: 285, y: 878 }, { x: 400, y: 878 }, { x: 515, y: 878 }];
  const { idle, solved } = assertCore(assert, A2, bridge);
  assert('with no bridge he falls in the PIT', idle.outcome === OUTCOME.FELL, idle.outcome);
  assert('the bridge anchors to both banks', solved.anchors > 0, `${solved.anchors} anchor(s)`);
  assert('the bridge HOLDS his weight', solved.strokeFell < 6, `moved ${solved.strokeFell.toFixed(0)}u`);
  // The whole point: a 16u lip against a 72u body. maxStepUp(22) > thickness(16).
  assert('he got ONTO the bridge and across',
         solved.miloX > A2.goal.x - A2.goal.w / 2 - 10,
         `ended at x=${solved.miloX.toFixed(0)}`);
}

// ── A3 — REDIRECT · send it away, do not park it on his path ────────────
console.log('\nA3 — REDIRECT   (the rock must end up somewhere harmless)\n');
{
  // The shelves are at different heights, so the stroke joining them is a slope.
  const slope = [{ x: 425, y: 730 }, { x: 370, y: 800 }, { x: 315, y: 872 }];
  const { idle, solved } = assertCore(assert, A3, slope);
  assert('the slope anchors to both shelves', solved.anchors >= 2, `${solved.anchors} anchor(s)`);

  // THE redirect property, measured rather than assumed: with nothing drawn the
  // boulder ends up on top of Milo; redirected, it rolls off the left edge of
  // the world (ground starts at x=60) and is gone.
  assert('undrawn, the boulder ends ON his path', idle.objects.boulder1.x > 300,
         `boulder ended x=${idle.objects.boulder1.x.toFixed(0)}`);
  assert('redirected, the boulder leaves the world', solved.objects.boulder1.x < 60,
         `boulder ended x=${solved.objects.boulder1.x.toFixed(0)}`);
}

// ── A4 — CATCH · the stroke bears MILO'S weight ─────────────────────────
console.log("\nA4 — CATCH   (the first level where the stroke holds HIM)\n");
{
  // Catch engages before x=415 (the discretely re-derived death line), dips,
  // then rises to meet the platform so a caught Milo keeps moving.
  // A gentle slide from the ledge down to the platform. The entry has to be
  // roughly tangent to his fall: a steep catching face stuns him on impact at
  // ~900 u/s, he loses walking control, and slides back off into the pit.
  const slide = [
    { x: 245, y: 808 }, { x: 300, y: 880 }, { x: 355, y: 950 },
    { x: 400, y: 995 }, { x: 450, y: 1006 },
  ];
  const { idle, solved } = assertCore(assert, A4, slide);
  assert('with no cradle he falls in the PIT', idle.outcome === OUTCOME.FELL, idle.outcome);
  assert('the cradle anchors at BOTH ends', solved.anchors >= 2, `${solved.anchors} anchor(s)`);
  assert('the cradle HOLDS his weight', solved.strokeFell < 8, `moved ${solved.strokeFell.toFixed(0)}u`);
  // Derived from the level, not hardcoded — a hardcoded threshold silently
  // goes stale the moment the geometry is tuned, which is exactly what
  // happened when the solver moved this goal.
  assert('he reaches the goal on the far platform',
         solved.miloX > A4.goal.x - A4.goal.w / 2 - 10,
         `ended at x=${solved.miloX.toFixed(0)}, goal spans ${A4.goal.x - A4.goal.w / 2}–${A4.goal.x + A4.goal.w / 2}`);

  // v0.4 §8.5 warned that a SEALED bowl catches him and never lets go, tripping
  // the stuck timer instead of winning. That warning is real — this proves it,
  // and it is why the goal-facing side of a cradle must stay open.
  const sealed = playLevel(A4, [
    { x: 245, y: 808 }, { x: 300, y: 940 }, { x: 350, y: 1060 },
    { x: 400, y: 1090 }, { x: 445, y: 1004 },
  ]);
  assert('a SEALED bowl traps him instead of saving him',
         sealed.outcome !== OUTCOME.SUCCESS,
         `${sealed.outcome} @ ${sealed.t.toFixed(0)}ms, stranded at x=${sealed.miloX.toFixed(0)}`);
}

console.log(state.failures === 0 ? '\nLEVELS: PASS\n' : `\nLEVELS: ${state.failures} FAILURE(S)\n`);
process.exit(state.failures === 0 ? 0 : 1);
