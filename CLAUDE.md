# BRO, YOU'RE COOKED. — what this project has learned the hard way

A physics rescue puzzle for YouTube Playables. One line. One shot. Get him out.

This file is not documentation. It is the set of rules that were paid for —
every one of them cost a shipped bug, a wasted build, or a playtest that came
back saying the game did not work. Read it before changing anything.

---

## THE ONE RULE ABOVE ALL OTHERS

**Look at the running game. Numbers are not evidence.**

Two unplayable builds shipped while every gate reported green. Both times the
cause was the same: I was proving assertions about a MODEL of the game instead
of looking at the game. A vibrating line, a shrinking line and a line that will
not sit still all satisfy an assertion about positions.

    node tools/test/filmstrip.js        # films every level being WON, and READ them

**And film the FAILURES too.** Every filmstrip in this project's history filmed
a win. Nobody had ever looked at what a player sees when they LOSE — which is
what they see most of the time. One failure capture found a death cam that drew
the player's own line as a fixed 80-pixel dash, no lethal zones at all, and no
goal. The screen whose entire job is to explain was explaining nothing.

## THE GATES MEASURE FAIR. THEY CANNOT MEASURE MEANINGFUL.

Proved twice, from both directions:

- **A14 passed at 1.6% breadth and was a fraud.** Deleting its rock changed the
  outcome by 25 milliseconds. The rock was decoration. The level was level 2 in
  a costume, and every automated check was happy.
- **A7 and A14 passed every gate and still confused a real player.** They are on
  the HELD shelf now on playtest evidence alone.

A green suite means a level is solvable, fair and stable. It says nothing about
whether a person knows what it wants from them. Only playtesting says that, and
playtesting outranks the suite.

**Nor can they measure the SHAPE OF THE SET.** Seen one at a time every level
looked fine; tiled into one contact sheet, eleven of fourteen opening frames
were the same silhouette — grey ground, red ball, Milo bottom-left, goal
bottom-right — and levels 2, 4 and 11 were near-identical twins. That is what
the playtest meant by "too basic", and no per-level gate can see it.

**Nor can they measure STAGING.** A20 passed every gate — breadth, precision,
tension, hand-robustness — while its frozen frame spawned the ball that kills
Milo directly on top of the goal that saves him, because the freeze landed
25ms after the ball had already fallen into the goal's y-band. No number moved.
The screenshot showed it in one second. **Open the frozen frame of every new
level and ask what a stranger would think it wants.**

And beware of a tension score that is TOO good. A20 measured 5u closest
approach — a win passing five units from death — and that solution won in the
solver and LOST in the browser, because a stroke redrawn with a mouse is never
bit-identical. A filmstrip REGRESSION (certified winner, browser loss) is what
caught it.

## MEASURE BEFORE YOU TUNE

The temptation is always to change a number until the thing lights up. Do the
measurement first; the measurement is usually the finding.

- A2 was the hardest level in the game at position TWO (1.1% breadth). Three
  fixes were tried and MEASURED before one worked: narrowing the gap (2.3%), a
  pillar in the chasm (1.1%), and the theory that the metric punished the
  BRIDGE verb (disproved — anchored-only win rate was 1.5% vs 4–26% elsewhere).
  The actual cause was locomotion: **descending is free, climbing is gated by
  the 22u step-up.** Dropping the far bank gave 7.4%.
- The CLOSE CALL threshold was NOT widened until it fired. Measuring first
  showed hazards are neutralised 120–400u from Milo on winning runs — a level
  design finding, not a tuning problem.

## LEVEL DESIGN RULES

- **Doing nothing must FAIL, and the failure must be explained.** A level that
  wins itself is not a level. A8 and A12 both shipped with this flaw once.
- **The freeze must land before the danger.** Derive it from the idle run, do
  not guess it.
- **Tension: the hazard should still pass CLOSE on a winning run.** A level won
  by neutralising the threat five body-heights away feels safe and basic. This
  is measured — see `npm run solver`.
- **A hint per level names the PROBLEM, never the solution.** A verb in the
  corner is not communication. If a hint needs to say two things, the level is
  two puzzles wearing one costume — that is what put A14 on the shelf.
- **A held level is not a deleted one.** `HELD` in js/levels.js keeps the level
  and the reason, so it returns as a better version rather than the same one.

## ADD NOUNS, NOT RULES

Playtest on the THREAD IT level: "the worst idea we have ever had", and right.
Its constraint was a no-draw zone — a RULE. Every other constraint in this game
comes out of the physics (gravity, anchoring, the 22u step-up); that one came
out of the designer. Two red hatched boxes in a backyard read as a debug
overlay, and beating it teaches "do not draw there", which is not a skill.

The games that own this genre all do the same thing instead. Cut the Rope adds
bubbles that lift, spiders that steal, wheels that change trajectory; Happy
Glass adds blades and moving platforms. **Every one is a thing in the world that
obeys physics**, and its own design guidance is "each new box introduces a
mechanic, and new mechanics build on the same core idea" — plus the warning
that object overload creates chaos, not challenge.

So: when the game feels basic, the fix is a new NOUN, introduced alone before it
is ever combined. Not a new rule about drawing.

**And every new noun must pass the A14 test before it ships: DELETE IT and
re-run. If the outcome barely changes, it is decoration.** The updraft's first
level failed exactly this, on every stroke tried.

## A MACHINE THE PLAYER CANNOT AIM IS NOT A LEVEL

Three machine levels died in one session on the same thing, so it is a rule now,
not a coincidence. **One static stroke can choose WHERE something goes. It
cannot choose HOW that thing ARRIVES.**

- The **wheel** throws whatever falls into it — but which way depends on the
  quadrant it meets and the blade phase. Asking the player to feed it was three
  conditions in series: 0.9% breadth against a 2% floor.
- The **spring** needs speed INTO the surface. Every ramp that feeds a board
  delivers the ball sideways, which is exactly the component a bounce is made
  of, so the honest solution was 1.2%.
- Both "fixed" it with funnels and chambers, and both then had the geometry do
  so much of the work that the noun became decoration — which the A14 test said
  out loud.

The levels that DO work ask for one thing: which side of the pin (A21), where on
the board (A20), into the column or not (A19). **If the level needs the input
delivered in a particular direction, the machine belongs in the scenery, not in
the puzzle.**

**And a machine can only be chained if the next one CATCHES FROM ABOVE.** Two
levers in series was held for this: a see-saw delivers off its END, which is
outside its own footprint, so the second must sit offset — and that offset is a
window to drop the rock straight onto the second, skipping the first. Measured:
lever two load-bearing (nailed down, all four winners fail), lever one not
(nailed down, three of four still win). A baffle closes the skip and the real
route together. The general form: **a machine placed BEFORE the player's
delivery point can always be bypassed by delivering directly** — it has to be
somewhere the object cannot avoid, the way A21's shaft sits over its lever.

And the timing half of the same rule: **Milo crosses a level in about 2.7
seconds and a machine needs one and a half to two to act.** Three hazard levels
reported "doing nothing WINS" because by the time the machine delivered he had
walked past. That is what the plate-and-gate pattern is FOR — it holds him while
a slow machine takes its time. It is not a motif, it is load-bearing.

## THE PLATE IS A BACK DOOR

**Any level whose win condition is a plate can be won by dropping an unanchored
line on the plate**, skipping the machine entirely. Audited across the shipped
set: levels 7 (FUNNEL), 13 (UPDRAFT) and 15 (LEVER) are all bypassable this way.
(Level 9 DROP is not a bug — that IS its solution, and it is what teaches every
player the trick.)

This also inflates the solver: two new levels measured 20.4% and 26.3% breadth,
and closing the bypass took them to 0.9% and 1.2%. **A plate level's breadth is
not trustworthy until the drop-on-the-plate solution has been ruled out.**

**FIXED WITH GEOMETRY, NOT MASS.** `js/sim.js` supports `requires: 'heavy'` with
`minMass`, but the numbers rule it out: `maxLength` is 900, so a one-part line
can mass **288** against rocks of 42–161. Gating would need rocks ~7× heavier,
re-tuning every level they appear in.

A lid over the plate costs nothing instead, because the presser and a falling
line arrive from different directions:

- **Level 13** — the ball rises INSIDE the chimney and presses the plate from
  underneath, so a cap resting on top of it never touches the ball's path. Free.
- **Level 15** — the rock arrives ROLLING at y=854 (top edge 828), so a lid
  hanging to 796 leaves it 32 units of headroom and stops anything dropped.
- **Level 7 resists it** and is still open: its rock enters at y=771 and a line
  can be drawn at 748 — the same height, so no lid separates them.

Closing the door costs real breadth, because that breadth was never real:
level 13 went 11.1% → **4.9%** and level 15 14.9% → **4.3%**. Both still pass.
**Re-run the drop-on-the-plate audit after touching any plate level.**

## TRAPS THAT HAVE ALREADY BITTEN

- **Constant names are NOT level numbers.** `A13` is not level 13. The names are
  creation order; the number on screen is the position in `LEVELS`, and holding
  A6 shifted everything after it. A7 was level 6; A13 was level 12. Acting on a
  reported level number without resolving it through `LEVELS` removed the wrong
  level once. **Always confirm with the number AND the verb on screen.**
- **`inkPath` sets `globalAlpha` itself.** Wrapping a call in `ctx.save();
  globalAlpha = 0.4` does nothing, silently. Use its `alpha` option.
- **Input reports world coordinates AND css coordinates.** The game world is
  world units; the HUD is css pixels. Mixing them made every button on the level
  board dead on arrival while the drawing underneath worked perfectly.
- **A module that exports AND runs a CLI must guard the CLI**, or importing one
  function kicks off a multi-minute sweep as a side effect.
- **Generated data files must drop ids that no longer exist**, not merge for
  ever. Promoting a level to try it and then removing it left its measurements
  behind in a file whose header says it is generated.
- **Matter has no poly-decomp.** `Bodies.fromVertices` on a concave shape
  silently returns its convex hull. Closed strokes are hollow rings for this
  reason, and because a bowl must be hollow to hold anything.
- **An updraft plus any ceiling is a TRAP for Milo.** The air pins him against
  the underside and airborne Milo has no horizontal drive to escape with —
  measured stuck at x=510 for every lid height and every sideways push tried.
  Air levels must lift an OBJECT, whose exit is geometry, not lift him.
- **Anchored means STATIC, not constrained.** Eight rigid constraints on a
  28-part compound body produced 177,000 units of jitter and shipped that way.
- **Matter SILENTLY ZEROES `restitution` on every static body.** `Body.setStatic`
  runs inside `Bodies.rectangle` and forces `restitution: 0` and `friction: 1`,
  so passing them in the options is discarded without a word. A pad asked for
  0.85 reported 0.00 and a ball rebounded 2u instead of 119u. Assign AFTER
  creation. (Static `friction` has therefore ALWAYS been 1 here, and every
  measured threshold in `solverData.js` was produced under that — do not
  "fix" it without re-measuring all fourteen levels.)
- **A single PIVOT is stable; the constraint warning above is about COMPOUND
  bodies.** One revolute on a plain rectangle measures 0.00u of centre drift
  with a rock dropped on it. Do not inherit the fear without measuring.
- **A free pivot SPINS** — 0° to −246° and still going. Every pivot needs
  physical end-stops, which is geometry the player can see rather than a rule.
- **A see-saw cannot LAUNCH.** Anything sitting on the RISING arm rolls inward
  toward the pin, not up and off. Its one real property is deciding a
  direction: the loaded arm goes down and drops what it carries off that end.
- **HOLDING a pivoted arm up is not a playable verb.** Measured three times:
  as the first attempted solutions on A21 (props missed the underside or jammed
  the rock at −34°), as A23's entire premise (0.6% breadth against a 2% floor,
  unchanged across two geometries), and on playtest as A7. A drawn line is
  STATIC and the arm is MOVING, so the player must guess where a moving thing
  will be — unlike every other stroke here, which acts on something falling or
  rolling along a path readable from the frozen frame.
- **FRICTION DOES NOTHING in this engine.** A rolling body slid 221u at
  friction 1.0 and 224u at 0.02; Milo is identical at both. There is no ice and
  no tar to be had — do not design a level around a slippery surface.
- **A PENDULUM'S PERIOD IS ~2.8 SECONDS** (a 280u arm at 70°). Levels here run
  two to four seconds, so a pendulum gives ONE sweep, not a rhythm. Period goes
  as √length, so a swing fast enough to repeat is too short to threaten
  anything.
- **A WHEEL MUST OUTWEIGH WHAT IT THROWS.** At mass 30 against a 36 rock it
  stalled, reversed to an angular velocity of -0.0072, and flung the rock out of
  the world; at 252 it carried straight through. The free spin that ruins a
  see-saw is exactly what a wheel wants — and a wheel heavy enough to throw at
  all throws EVERYTHING far, so throw distance cannot be the puzzle.
- **Milo CAN walk a see-saw** whose near end is level or down, and is stopped
  dead by one whose near end is raised — at +6° he stood at x=185 until the
  clock ran out. That is A2's 22u step-up rule, applied to a moving part.
- **A LOCAL-SPACE PATH MUST BE UN-ROTATED, NOT JUST RE-CENTRED.**
  `body.strokePath` was stored as `point − body.position`, which leaves it in
  WORLD orientation. Both readers then rotate it by `body.angle` to place it,
  so the line was drawn at DOUBLE the angle it was drawn at: 45° rendered as
  90° (a flat line standing upright), 90° as 180° (pointing back the way it
  came), and 0° perfectly — which is why it was reported as an intermittent
  glitch rather than a constant one. A compound stroke has angle 0 and was
  always fine; only a near-straight drag, which simplifies to two points and
  ONE part carrying the segment's own angle, could show it.
  The PHYSICS was correct throughout — only the picture lied, which is the one
  class of bug no assertion about positions can catch. `tools/test/shapes.js`
  now asserts the picture: what they drew is what gets drawn.
- **A test that re-imports a game module gets a SECOND COPY.** Over http,
  `import('/js/audio.js')` from inside a page built from `dist/` loads a fresh
  module with its own uninitialised state. It cost two false alarms in one
  session: the level board "unreachable at every ratio" (a phantom `view` at
  0x0, so the test clicked empty space) and "onPause does not suspend audio"
  (a phantom AudioContext that had never existed). Both were fine. Expose the
  LIVE object on `globalThis.__byc` and read that — one source of truth, which
  is the same lesson the stroke renderer and the board already paid for.

## THE HAND MODEL

`tools/test/lib/hand.js` is the ONE definition of what a real stroke looks like.
It got this wrong twice:

1. **Too smooth** — a 1.2u waver that Douglas-Peucker flattened back to one
   rigid box, so every "hand-drawn" test was the sparse test in disguise.
2. **Aliased** — tremor with a wavelength SHORTER than its own sample spacing,
   producing a crumpled zigzag whose segments sat at 31°, −88°, +113°. No finger
   draws that. It condemned A2 as having zero playable solutions.

Tremor is perpendicular to travel, wavelength at least 6× the sample spacing.
There must never be a second hand model anywhere in the repo.

## PLATFORM CONSTRAINTS (non-negotiable)

- **Zero external network calls.** `tools/build.js` fails the build on `fetch`,
  `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `importScripts`. This is why no
  runtime AI/API call is possible, ever.
- **`onPause` halts everything** — loop, physics, rendering AND audio
  (`suspend()`, not "stop scheduling").
- **Nine aspect ratios, 9:32 to 32:9.** Never lock orientation.
- **No information carried by audio alone.** It is played inside YouTube, muted.
- **DPR is budgeted by pixel AREA, not capped.** A flat cap at 2 blurred 3x
  phones — a named rejection cause.

## COMMANDS

    node tools/levelcheck.js      STRUCTURE, in seconds — run BEFORE the solver
    npm test                      level data, physics, levels — fast, run always
    npm run solver                the gates, and writes measured star thresholds
    node tools/solver/representative.js   certifies a hand-robust solution per level
    node tools/test/filmstrip.js  films every level winning — READ THE IMAGES
    node tools/test/frozen.js     every opening frame in ONE grid — READ IT
    npm run test:audio            renders waveforms; silence throws no error
    npm run test:board            level board hit regions at four ratios
    npm run test:conformance      the automated half of certification
    node tools/levelgen/generate.js       proposes level candidates

Browser tests need `node tools/serve.js` running.

## WORKING AGREEMENT

- Credits are finite. Run the gates the change actually touches, not all of
  them out of habit. A render-only change does not need the physics suite.
- Do not rush. Most mistakes here would have been caught by sitting with the
  problem for one minute.
- Report failures plainly, with the output. Never claim something works without
  having looked at it.
