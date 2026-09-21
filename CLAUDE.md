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
    FILM_IDLE=1 node tools/test/filmstrip.js   # films it being LOST

**And film the FAILURES too.** Every filmstrip in this project's history filmed
a win. Nobody had ever looked at what a player sees when they LOSE — which is
what they see most of the time. One failure capture found a death cam that drew
the player's own line as a fixed 80-pixel dash, no lethal zones at all, and no
goal. The screen whose entire job is to explain was explaining nothing.

It happened AGAIN the very next time a loss was filmed, which is why there is
now a flag for it rather than a heroic one-off. The duct's death cam drew no
AIR: a roof, two posts and a falling rock, with nothing to say that air was what
carried it — the replay explained the wrong mechanism. Every new kind of thing
added to the world has to be added to `deathcam.js` too; it draws its own
subset, and the default for anything new is INVISIBLE.

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

**And TUNING FOR BREADTH CAN SPEND THE MEANING.** A35 was a balloon trapped
under a column of falling air, with the stroke as the detour around it. Honest,
it swept 0.2%. Narrowing the column gave 0.6%; dropping the plate to meet the
escape gave 1.3%; starting the balloon 40 units from the column's edge gave
2.4% and a pass on every gate — 45u floor, 61.9% hand-robust, four families —
at which point the balloon barely entered the column at all and **the A14 test
said the column was decoration: delete it and neither the idle run nor the
solved run changes.** Every step that bought breadth spent meaning, and the
breadth gate cannot see the difference. **Re-run the A14 test after tuning, not
just after building.**

**THE MACHINE LEVELS ARE NEEDLES, NOT FAMILIES — measured across 200
generated candidates.** The generator works: 61 of 120 cleared the fair funnel,
against roughly one in four for levels designed by hand. But all 61 had NO
MACHINE in them and every verb already shipped, because its five archetypes were
distilled before any machine existed. Two more were then written from levels
that DO have machines, and both failed in their own way:

- **`tilt`, from A34 SINK: 0 keepers in 40.** 17 unsolvable, 23 unfair, none
  self-solving. The shape is sound and its fair window is a needle — which
  matches what A34 cost by hand (260-unit pan 1.3%, 200 1.8%, 160 a pass).
- **`shield`, from A31 THORNS: 5 keepers in 40**, all fair, all with a real
  machine — and all NEAR-IDENTICAL to A31. Widest difference across the five
  was 40 units of ceiling height.

So a generator can search the numbers inside a shape, and for these shapes the
fair region is either empty or it is the level you already shipped. **More
levels need a new NOUN, not more search.** Twenty is where this vocabulary
lands; going further is a second wave with a new thing in it, not a grind.

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

## A STATIC LINE CAN BE ANY STATIC GEOMETRY

Which means **no new STATIC noun can ever be a puzzle.** Whatever the thing
would become, the player can simply draw it: a pillar that topples across a
chasm to make a bridge is redundant with the stroke by construction, and it
fails the A14 test before it is built. The same goes for every ramp, shelf,
wall, funnel and lid that a level might "give" the player.

So the only nouns that can carry a level are the ones that **move or act** —
air, springs, pivots. That is not a coincidence about what got built; it is the
reason those three are the only ones that worked. Check a new noun against this
first. It costs nothing and it has already saved a build.

The corollary, and it is the expensive half: **each of those nouns has exactly
one question in it.**

- The pivot's is WHICH SIDE OF THE PIN, and A21 already asks it. A27 was built,
  measured and shelved for asking it a second time with the lean reversed.
- The updraft's is IN THE COLUMN OR NOT (A19).
- The spring's is WHERE ON THE BOARD (A20).
- The balloon's is WHERE DOES IT LET GO (A31) — its first level, A30, gets the
  other one, WHERE DOES IT GO, because a ceiling is a new thing to aim it with.

A second level on a noun needs a different QUESTION, not a different geometry.
A28 got one — *interrupt the run* — only because leaning the air changed what
the noun does, not how it is arranged.

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

## ...AND A WEIGHT GATE CLOSES IT, IF THE INK BUDGET IS SMALL

**`minMass` DOES work — when the ink budget is small enough.** The dismissal
above assumed `maxLength` 900, where one part can mass 288. A LINE'S MASS SCALES
WITH THE BUDGET, so a level that pays 320 can only buy a 103-unit line
(measured), and a rock at density 0.09 masses 189. A29 gates its plate at
`minMass: 150` and no stroke it can afford will ever press it. Two other things
came out of proving it:

- **An ANCHORED line cannot press a plate at all, at any weight.** It goes
  static, and Matter reports no collision between two static bodies. The
  threshold only ever has to beat a DROPPED line.
- **Density is free where the forces are accelerations.** Gravity and the
  updraft are both accelerations, so making that rock three times denser did not
  move it by a unit. Weight-gating costs nothing in a level built on air.

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
- **A VERTICAL UPDRAFT CANNOT DELIVER.** Traced: a rock fired out of a vertical
  flue coasts up, stops, and falls straight back down the same flue — forever.
  Nothing pushes it sideways, so a column can only ever hand its cargo back.
  **Air can only deliver if it LEANS**, which is what `z.ax` is for. It had been
  in `applyUpdrafts` since updrafts were added and nothing had ever used it.
- **THE AIR RENDERER IGNORED `ax`**, so the first level to lean its draught
  would have shipped a picture that lied about the physics — the same class as
  the stroke angle below, and just as invisible to every assertion. And the
  chevrons were sized as a FRACTION of the zone's width, which no one could see
  while the only zone in the game was A19's 160-unit chimney: at 270 wide each
  mark stretched to 98x11 and the filmstrip came back reading as flat wavy
  strata. It looked like WATER. A mark that means "flowing" has to keep its
  shape — fixed size, spread to fit, more of them in a wider flow.
- **A CEILING STEERS WHAT FLOATS, the way a ramp steers what falls.** Measured
  before the balloon's first level was written: under a FLAT roof a rising body
  meets it and sits at the same x for the rest of the level; tilt that roof 8
  degrees and it travels 79 units, at 16 it clears the end entirely. That flat
  case is a gift — it is a failure state that needs no hazard, and it is why
  doing nothing on a balloon level is a DEAD END rather than a death.
- **A BALLOON'S SECOND QUESTION IS WHERE IT STOPS RISING.** Cut the Rope pops
  its bubble with a tap and we have no tap, so the level supplies the thorn and
  the player's line is the SHIELD: where their line ends is where it bursts,
  and where it bursts is where it falls. Do not put the pop point in the
  level's hands — the first build of A31 had a safe roof that became a sharp
  one, which fixed the burst at the seam and left the player only "make it move
  at all".
- **PER-RUN STATE GOES ON THE SIM, NEVER ON THE SPEC.** Level data is shared
  across every run of a solver sweep, so recording a burst by mutating the
  object's spec would leak one run's pop into the next 2500. `sim.burst` is a
  Set on the sim for the same reason `sim.triggered` is.
- **BREADTH HAS TWO FILTERS, AND WIDENING THE TARGET ONLY FIXES ONE.** A31 swept
  0.1% — two wins in 2400 strokes. Widening the catch from 110 to 200 units took
  it to 1.2%, still under the floor. The other half was STROKE LENGTH: the
  shield had to span 300 units, which is a rare thing for a hand to draw and ate
  the whole ink budget. Moving the balloon 80 units closer, so a 60–220 unit
  shield does the job, took it to 2.0%. **Ask how long the winning stroke has to
  be, not just how big the target is.**
- **A POP IS NOT A VERTICAL DELIVERY.** A burst balloon keeps every unit of
  horizontal speed its shield gave it and carries up to 330 units after
  bursting — measured. So it cannot feed a see-saw: a ball that lands still
  moving rolls ACROSS the pin, and a see-saw AMPLIFIES the roll rather than
  resisting it. Pops at x=319, 404 and 502, two of them left of a pin at 420,
  all tipped the plank RIGHT and all delivered to the same place. **A28's lip is
  the only true vertical delivery in this game** — it works by stopping the
  cargo dead against a wall — and it is fixed in place by construction, so the
  player can never choose where it happens. Until something delivers FROM REST
  at a point the player picks, a see-saw cannot be the second machine in a
  chain, and the combine tier stays limited to machine → container.
- **A WIND ROAD CANNOT BE ASKED TO CLIMB.** A draught pushes a rock uphill only
  while tan(angle) < ax/g — about 18 degrees at ax=600 against gravity 1800,
  with no friction to help. **Every unit of drop costs three units of run to pay
  back**, and the world is 720 wide. Forcing a dip and then asking for a 70-unit
  climb needed 215 units of clear run and the geometry had 130. Same shape as
  A24: the machine works, the world is too small for it.
- **A FLOOR STEERS WHAT SINKS, the way a ceiling steers what floats.** A
  DOWNDRAFT is free: `applyUpdrafts` reads `z.accel ?? -2600`, so a POSITIVE
  accel pushes down with no code change, and both renderers derive their
  chevrons from the flow vector, so the column already draws itself pointing
  the right way in play AND in the replay. At 1500 it beats a lift of 2400 once
  gravity is on its side. Measured: on a FLAT pan the balloon sinks to (370,796)
  and sits there for the rest of the level; tilt the pan 8 degrees and it slides
  out at x=498 and floats free; -12 and it leaves the other end.
- **A BIGGER TARGET IS NOT AUTOMATICALLY A BETTER ONE.** A34 at 1.8% breadth,
  deepening its plate from 100 to 220 units added exactly one win and dropped
  the precision floor from 45u to 20u — the extra area was all knife-edge. What
  cleared the gate was shortening the PAN from 200 units to 160, so the winning
  tilt is a short ordinary stroke. Length, again.
- **A DOWNDRAFT ONLY EARNS ITS PLACE WHEN THE CARGO WOULD OTHERWISE LEAVE.**
  A34 SINK works because without the column the balloon floats straight off the
  pan — the column is what makes the pan a pan. A39 HATCH put the same column
  over a pan with a hole in it and passed every number (3.3% breadth, 45u floor,
  four families) while being a ball rolling into a hole: strip the lift AND the
  air and it plays identically, because gravity already holds a ball on a pan
  and a tilt already slides it. **Ask what the machine is preventing, not what
  it is doing.**
- **A DOWNDRAFT HOLDS WELL AND BLOCKS BADLY.** A34 SINK works because the column
  presses its cargo onto a surface and the player tilts that surface — a clean
  decision. Three levels tried to use one as a WALL instead and all three died:
  escaping a column sideways is nearly impossible (A35, 0.2% breadth), a column
  cannot threaten Milo because outside it the balloon just rises away (A36,
  doing nothing won in three builds), and a gap between two columns is crossed
  SIDEWAYS rather than climbed (A37 — x went 333→490 while y moved only
  818→763). **Stop building walls out of air.**
- **A RISING BALLOON MEETS YOUR LINE FROM BELOW**, so the stroke is a CEILING,
  not a floor, and a slope that would steer a falling thing right steers a
  floating thing LEFT. Four probes in a row were drawn upside down before this
  was noticed. Related: a line touching no static geometry is not a ledge, it is
  a falling object — a level whose answer is a ramp must give the ramp something
  to start from, at the height the cargo actually sits.
- **An updraft plus any ceiling is a TRAP for Milo.** The air pins him against
  the underside and airborne Milo has no horizontal drive to escape with —
  measured stuck at x=510 for every lid height and every sideways push tried.
  Air levels must lift an OBJECT, whose exit is geometry, not lift him.
- **A BRITTLE SURFACE ASKS THE ONE QUESTION THAT IS NOT SPATIAL.** Every verb
  here asks WHERE — which side of the pin, in the column or not, where on the
  board, where it lets go. A pane with a `brittle` normal-speed threshold asks
  HOW HARD IT ARRIVES, and the player answers with a WHERE anyway: the height
  they catch it at. Measured before any level was built — a body caught on a
  shelf and released again lands at normal speed 267/289/317 from y=880,
  464/473/500 from y=830 and 879/882/892 from y=500, the three figures being
  shelf angles of 12, 20 and 30 degrees. **The landing speed tracks the HEIGHT
  of the catch across a 3.3x range and barely moves with its ANGLE**, which is
  what makes it drawable: it depends on what the player chooses and ignores
  what a shaky hand gets wrong. Catching high measures the same as not catching
  at all, so the mistake reads honestly. Use `normalSpeed`, not |v|: a ramp
  trades vertical speed for horizontal and the component INTO the surface is
  the honest one.
- **A ROCK FALLING STRAIGHT DOWN CAN ALWAYS BE PARKED ON A STATIC LINE**, so a
  level asking how hard something lands can always be answered with "it does not
  land at all". Two builds of A43 passed every gate while being exactly that
  fraud: the certified winner caught the rock on the stroke at (568,975) and it
  sat there for the whole level, the pane never touched, its brittleness pure
  decoration in the solved run. **The A14 test cannot see this** — it compares
  outcomes, not mechanisms, and the outcomes differ because the IDLE run still
  changes. Trace the certified solution and ask whether the noun is in it.
  **MILO IS THE ONLY BODY HERE THAT CANNOT BE PARKED.** He walks off whatever
  you give him, and a line that stops him dead is a stuck timeout, which is a
  loss and not a bypass. That is what makes him the honest cargo for this
  question, and it is a general tool: when a noun can be dodged by holding its
  cargo still, make the cargo the one thing that will not hold still.
- **A CLEAN DROP TOPS OUT NEAR 950.** Raising the rock does not make it land
  harder — measured identical at start heights 640, 440, 300 and 200, because
  `frictionAir` caps it. So that is the ceiling on any brittle threshold, and
  the soft band it buys is about 195 units of catch height.
- **`frictionAir` IS NOT THE "FRICTION DOES NOTHING" FINDING.** That one is
  about SURFACE friction. Air drag is a separate 0.01 per base frame, which
  over two seconds is a factor of four: a rock rolled along a flat shelf at
  vx 200 ground to a halt 140 units later, and a runway tilted 7 degrees only
  reached a terminal 90 u/s. **A rolling delivery over any distance needs
  gravity doing the work, and even then it is slow.**
- **A BRITTLE FLOOR FLUSH WITH ITS HAZARD READS AS THE HAZARD'S RIM.** A43's
  plank sat directly on the spike zone and the filmstrip showed the cost: the
  hint named a plank a stranger could not find in the frozen frame. Sixty units
  of daylight under it makes it a bridge. And a shattered pane must leave a
  GHOST rather than nothing — drawing nothing shows a level that never had a
  floor instead of one the player just broke.
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
    FILM_IDLE=1 node tools/test/filmstrip.js   films it LOSING — read those too
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
