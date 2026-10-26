# BRO, YOU'RE COOKED. — what this project has learned the hard way

A physics rescue puzzle for YouTube Playables. One line. One shot. Get him out.

This file is not documentation. It is the set of rules that were paid for —
every one of them cost a shipped bug, a wasted build, or a playtest that came
back saying the game did not work. Read it before changing anything.

**START HERE.** `docs/PLAN.md` is what we are doing next and why — how many
levels, where they come from, who builds them (proposed 2026-10-13; check its
status line before acting on it). `docs/HELD.md` is every level already built
and shelved, with the measured reason. Read both before designing anything.
`docs/DIFFICULTY.md` is the difficulty curve in plain words: what a level's
number means, the 60 ceiling, and how real players' attempts will replace it.

---

## THE ONE RULE ABOVE ALL OTHERS

**Look at the running game. Numbers are not evidence.**

Two unplayable builds shipped while every gate reported green. Both times the
cause was the same: I was proving assertions about a MODEL of the game instead
of looking at the game. A vibrating line, a shrinking line and a line that will
not sit still all satisfy an assertion about positions.

    npm run film                 # films every level being WON, and READ them
    FILM_IDLE=1 npm run film     # films it being LOST

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

A THIRD time, filming the daily pool's losses: **no death cam in this game had
ever drawn a plate or a gate.** Both are STATIC bodies, and the recorder keeps
only what moves, so every plate-and-gate level replayed Milo "HE'S STUCK"
against empty air, with nothing to say what shut him out or what would have
opened it. It was invisible in every capture until a loss was filmed on a level
whose whole puzzle is the gate. Anything STATIC that is not in `sim.statics` —
a switch, a gate — must be drawn from its spec.

A FOURTH time, from the owner's own screenshot of GOOD BOY (26 Oct): **the
player's line was missing from every replay in which it had held.** An anchored
line is STATIC, so the recorder skipped it, and the replay showed the dog
standing on nothing in mid-air. It is drawn from `sim.stroke` now, from the
moment it was put down. And a run that ends with Milo waiting at a gate nothing
opened — the commonest loss in the game, 3,242 of LEVER's 3,717 swept strokes —
reads **THE GATE STAYED SHUT** with the gate ringed, not "HE'S STUCK", which
blamed him for the plate's failure. `tools/test/deathcam.js` holds both.

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
levels need a new NOUN or a new DECISION, not more search.** I once wrote
"twenty is where this vocabulary lands" — true only under the old
one-question-per-noun rule, which is now replaced (see below).

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
  **One written exception (25 Oct, the owner): level 1 shows the GESTURE.**
  After 2.5s of looking at the frozen frame without touching, a pencil traces
  the line across its slot (`tutorial` on A1, drawn in js/main.js, never in the
  daily or the death cam). Level 1's job is to teach drawing itself, which is
  what every draw game's first level does. No other level gets one.
- **A held level is not a deleted one.** `docs/HELD.md` keeps every shelved
  level's measured reason and the commit where its code lives, so it returns as
  a better version rather than the same one. Shelved code does not stay in
  `js/levels.js`: it shipped in the bundle and doubled the file.

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

The corollary used to be **"each of those nouns has exactly one question in
it"**, and it capped the game at one level per noun — production stopped at 21
because of it. **The rule now is: no two levels ask for the same DECISION** —
the sentence a player would say when they get it ("let the crate fall in, stop
the rock"). Same sentence = twin, whatever the noun or layout; different
sentence = not a twin, even on the same noun. The games that own this genre
reuse every element across dozens of levels; what they never repeat is the
decision. What the old rule got right, and still holds, is below: the
questions already spent are spent.

**AMENDED 2026-10-14 (approved): A NEW ELEMENT MAY RE-ASK AN OLD QUESTION.**
The strict rule capped each new element at one to three levels — the dog's
pen and trapdoor died in measurement and everything else it could do had been
asked of Milo. So "get the dog across" may follow "get him across", if the
element changes how it PLAYS on film, it passes the A14 test and the census,
and the question is not asked twice in one chapter (docs/PLAN.md 4.1). Two
levels on the same element still need different questions, and everything
below about what is spent applies to that.

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
set: A9 FUNNEL, A19 UPDRAFT and A21 LEVER are all bypassable this way.
(A11 DROP is not a bug — that IS its solution, and it is what teaches every
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

- **A19 UPDRAFT** — the ball rises INSIDE the chimney and presses the plate from
  underneath, so a cap resting on top of it never touches the ball's path. Free.
- **A21 LEVER** — the rock arrives ROLLING at y=854 (top edge 828), so a lid
  hanging to 796 leaves it 32 units of headroom and stops anything dropped.
- **A9 FUNNEL resists it** and is still open: its rock enters at y=771 and a line
  can be drawn at 748 — the same height, so no lid separates them.

Closing the door costs real breadth, because that breadth was never real:
A19 went 11.1% → **4.9%** and A21 14.9% → **4.3%**. Both still pass.
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
  And the numbers are not stable: the measured re-order of 2026-10-12 moved
  most of them (see THE DIFFICULTY CURVE). A level number elsewhere in this file
  means the order at the time it was written; the id is the only stable name.
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
  **And the same two levers did nothing the second time (25 Oct, easing it from
  89 tries under the 60 ceiling): 81–119 tries.** Sorting every stroke by what
  the balloon did showed why — 81% never meet it, and that share did not move —
  while raising the thorn roof 70 units took it to 48: more headroom under the
  teeth turned short pops into deliveries (hand rate 55% → 70%). **Sort the
  losing strokes by what happened before choosing a lever** (the census idea,
  applied to losses).
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
- **MILO AND A ROCK HE PUSHES ARE RIGIDLY COUPLED — there is no level in it.**
  He is velocity-driven (`js/milo.js` calls `setVelocity` every frame), so he
  pushes regardless of mass: ~26 against rocks of 137-163. "Too heavy to push"
  does not exist. What killed it is that the rock goes nowhere he does not go.
  Five probes, and every one closes a door:
  - The push itself is excellent — contact settles at a **40u gap** and holds it
    for the whole run at ~215 u/s against his 220. It is the most reliable
    horizontal delivery in this game, which is exactly what the spring and the
    wheel never had.
  - **A ramp lifts them equally.** Rock rise vs MILO rise: 49/59 at 8 degrees,
    106/111 at 20, 156/161 at 30. He walks up whatever ramp he built, so "lift
    it out of his reach" is not available. Above ~30-35 degrees the push stalls
    and he stops dead, which is a stuck timeout and a legitimate loss.
  - **A wall stops both** (he parks 40u behind his own rock) and **a gap
    swallows both** — even a 60u gap takes a 44u rock and then takes him.
  - **A rock cannot climb ANY lip.** Measured 20, 30, 40, 50 and 60 units at
    189 and 236 u/s: it stops dead against the face every time. So even a 20u
    step, which Milo himself can climb, leaves him blocked BEHIND his own rock.
  - **A ramp does not launch it.** It lands 10-24u ahead of where Milo lands
    across every length and angle, and steeper ramps separate them LESS. There
    is no projectile and no aim.
  The one real separation is a **descent over ~20 degrees**, which lets the rock
  outrun him and opens the gap to ~180-200u (at 10 degrees he overtakes it
  instead). Nothing in this game needs a rock that arrives 0.8s early, because a
  gate opens instantly and a 40u lead already covers it.
  The general form, and it is the same shape as the vertical updraft: **a
  delivery the player cannot aim is not a mechanic.** Milo is a perfect conveyor
  and the player has no steering wheel.

- **A BRITTLE FLOOR CAN ALWAYS BE SAVED BY NOT HITTING IT.** This is why CRACK
  works and why three combination levels built on it died in one session. The
  brittle question is "how hard does it arrive", and the player's answer is
  always allowed to be "it does not arrive". Measured, and every one passed
  gates first:
  - **A44 BURST** swept 6.9% with four families and a 45u floor, and its
    certified winner popped the balloon and flung it RIGHT onto 80 units of
    solid ground past the pit — landing at x=616, plank never touched.
  - **A45 BRAKE** swept 5.0%, four families, 45u floor, 48.8% hand-robust, and
    its winner parked the rock at y=723 floating inside the updraft for ever.
  **The cargo has to be unable to go anywhere else.** Milo is that cargo because
  he must cross; a rock or a balloon is not, unless the brittle surface is
  literally the only floor in reach. Removing A44's escape fixed the honesty in
  one edit — and then exposed the real fault underneath, which is next.
- **MAX_SPEED IS LOCKED AT 900, SO "LAND HARDER" IS NOT A MECHANIC.** Every
  dynamic body is clamped in `js/physics/adapter.js`, and the constant is LOCKED
  because at 120Hz 900 u/s is 7.5 units of travel per step against a 16-unit
  line — raise it and things tunnel through the player's own stroke. A46 asked a
  downdraft to drive a rock through a lid at 1100 and swept 0.0%: a drop beside
  the column and a drop inside it **both arrived at exactly 900**. A downdraft
  can only reach the ceiling SOONER, never pass it. Shortening the fall does
  separate them — 582 free against 781 in the column over 138 units — but then
  the two requirements fight, because a fall short enough for the column to
  matter is too short to steer the cargo into it. **A brittle threshold can only
  ever ask for a SOFTER landing.**
- **AN UPDRAFT STRONG ENOUGH TO BRAKE IS STRONG ENOUGH TO HOLD FOR EVER.** At
  -2400 against gravity 1800 the net is 600 UP, so anything steered in never
  comes down and the level is BLOCK in a costume. Weaker than 1800 does not
  brake at all, because a long drop is already AT the clamp before it enters.
  The only shape left is a column that reaches the floor and is too short to
  stop anything — untested.
- **A GATE PASSING AND A LEVEL BEING HONEST ARE DIFFERENT QUESTIONS, and only
  one of them is automated.** Both frauds above cleared breadth, families,
  precision and hand-robustness. What caught them was tracing the certified
  winner and asking whether the noun is in it. **Do that for every new level**,
  not just the ones that look suspicious.

- **A SPRING PAD IS NOT A NOUN. THE BOUNCE IS ON THE OBJECT.** Measured: a pad
  at `restitution: 0.85` rebounds a ball of 0.1 by **one unit**; the same ball
  at 0.85 rebounds **150**, off any surface. A vertical drop never bounces at
  any height — 1090, 1040, 980, 900, 800, 700 and 600 all gave 0-2u — because
  the number Matter moves the ball with is the one on the BALL. So the pad in
  A20 SPRING is doing something other than springing, and no new level can be
  built on a bouncy floor. `tools/levelcheck.js` now A14-tests object
  restitution, because a noun no tool can check gets to be decoration unnoticed.
- **AND A BOUNCE IS REDUNDANT WITH THE STROKE ANYWAY.** With the bounce moved
  onto the ball and working, the A14 test still called it decoration: a drawn
  ramp rolls the ball to the same shelf and no bouncing happens. Cutting the ink
  from 320 to 130 so that ramp was unaffordable did not change the verdict and
  collapsed the families from five to one. **A bounce gets a thing UP and
  ACROSS, and those are precisely the two things a static line already does** —
  the same rule that says no static noun can be a puzzle, arriving from the
  other side. Springs are scenery here.

- **A CLIMB IS STRUCTURALLY NARROW — A2 ALREADY PROVED IT AND I REBUILT IT.**
  A49 asked the player to draw a ramp up to a ledge. Solvable, clean, three
  hand-drawn ramps win, 30-45u precision floor, wobble 0 — and 0.2%, 0.3%, 0.3%
  across three geometries, five wins in 1820 strokes every time. Shortening the
  required ramp from 265u to 163u moved it by nothing; removing the pit moved it
  by nothing. **A ramp that must meet the ground at one end and a ledge at the
  other inside a 20-38 degree window is a needle in the stroke space.** This is
  the same finding as A2 — the hardest level in the game at position two, 1.1%,
  fixed by DROPPING the far bank so the crossing became a descent. Climbing is
  gated by the 22u step-up; descending is free. Do not design a level whose
  answer is a ramp UP.
  **Correction, 14 Oct: part of that needle was a bug** (next entry but one).
  With it fixed CLIMB measures 1.3% and a plain 50u ramp-up 2.5–3.1% — still
  narrow, because a sweep rarely draws a ramp, but no longer a wall a player
  can hit by starting their line two units too high.
  Two bugs found on the way, both worth keeping:
  - **A stub the ramp starts from must be within 22 units of where Milo is.**
    The first build anchored it 142u up, which he can never reach.
  - **A GOAL BOX SITTING WHERE THE STROKE MUST GO MAKES A LEVEL READ AS
    UNSOLVABLE.** The solver rejected nearly every candidate with
    `overlaps-goal` before simulating it: 0.0% breadth with nothing whatever
    wrong with the physics. **Check the rejection reason before believing an
    unsolvable verdict.**
- **THE STEP-UP READ A LINE'S WHOLE BOX, SO EVERY STRAIGHT RAMP WAS A WALL.**
  `tryStepUp` judged how tall the thing in front of a walker was from the hit
  part's bounding box. For a level's own platforms that is their top. For the
  player's line it is not: a straight drag simplifies to ONE part, and a rising
  line's box top is its FAR end. A 20-degree line begun 2 units above the floor
  has a lip a third of a step high and measured 60 — Milo stopped dead, the dog
  turned round — while the same line begun 2 units lower, buried in the floor,
  was a road. Four units of where a finger lands decided whether a ramp was a
  ramp, and nothing on screen said so. Found when the dog turned around at a
  gentle line in a sketch. Fixed for STROKE parts only: a slope he can walk is
  read at his foot, a steeper one is still a wall, rocks and planks unchanged.
  Measured before adopting it: no certified stroke in 35 levels changed, 33
  swept identical, GOOD BOY 8.6% to 7.8% (the dog now walks up lines it used to
  turn at — retuned) and CRACK 4.1% to 4.5%. **A6 RAMP was held for "only
  passes with a 47u wall" — that was this bug, not the idea.**
  `tools/test/walk.js` holds the rule and fails without the fix.
- **A PRECISION FLOOR FROM SIX SAMPLES IS A LOTTERY.** The floor is the most
  forgiving winner's robustness, estimated from six winners spread across the
  lengths. The fix above added two winners to CRACK, the six picks moved, missed
  its one 45u stroke, and a level that had not got one unit less forgiving read
  20u — a hard gate failure. Levels with 40 winners or fewer are now measured
  whole (a superset of the six, so no floor can drop because of it).
- **AND THE GENERATOR CANNOT PRODUCE A NEW-LOOKING LEVEL — confirmed a second
  time, by eye.** 24 fresh candidates through the cheap funnel, rendered as one
  contact sheet: nine `crossing` were level 2, five `drop` were level 3, four
  `trigger` were levels 7-9, three `chimney` were level 5, three `roller` were
  level 6. Its five archetypes were distilled FROM levels 1-12, so rebuilding
  them is all it can do. Stop going back to it.

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

- **TRACE EVERY WINNER, NOT ONE: `npm run census`.** It sorts every winning
  stroke of a sweep by what happened in it — which barrels went off and when,
  cover, broken boards, opened gates, lines drawn THROUGH an object. Tracing
  the certified winner shows one story out of hundreds; the census showed a
  chain level whose chain was used by 0 of 319 wins, and a bomb-on-the-plate
  level that was FUNNEL with a fuse. Run it on every new level.
- **A LINE DRAWN THROUGH A RESTING OBJECT POPS IT OUT.** The engine shoves a
  body out of a stroke drawn through it, so a level whose noun must MOVE a
  resting object can be won by drawing through the object. SHOVE passed every
  gate that way (3.0%, 65u, 4 families) with its barrel lying on the ground —
  36 of 57 wins survived the barrel being made inert. Most levels take 0-16%
  of their wins through objects, incidentally (a ramp drawn where the frozen
  rock is), which is why no rule bans it: LEVER's most natural stroke does it.
- **A FUSE ASKS WHEN, AND HOLDING HIM BACK ANSWERS IT.** A fallen line that
  stops Milo until the blast clears it away wins nearly every TNT design, at a
  hand rate of 20-30%, and buries the designed decision: 60-77% of wins in
  the cover-plus-keep-away combination, all of FENCE's top families, every
  chain level. SHELTER survives it only because its fuse is LONG — he waits at
  the fence anyway, so delaying him changes nothing. Design TNT around that.
- **A BARREL ON A SHELF CANNOT REACH WHAT IS UNDER THE SHELF.** The shelf is
  solid, so it shields everything below it — STAY's first fence stood under the
  barrel's shelf and never broke. Put what the blast must reach in its line of
  sight, past the shelf's corner.
- **SOLID THINGS STOP A BLAST, AND THE PICTURE SAYS SO.** Cover is physics
  now (`detonate` in js/sim.js): the player's line, a shelf, a rock or a wall
  between a barrel and a target shields it; boards never shield boards; the
  sim records how far each blast reached in 24 directions and both renderers
  draw that, so the fire visibly stops at the wall. A blast also lights any
  barrel it reaches, 150ms later — consistent, and so far no level's answer.
- **A CRATE PLUGS A HOLE ONLY WHEN IT ARRIVES FLAT AND CENTRED** (within ~5u,
  with 10u of play), and Milo PUSHES a crate lying on flat ground into a hole
  and seats it every time. But a ramp-delivered crate tumbles or overshoots:
  at friction 0.6 it will not slide down a 23-degree ramp, at 0.1 it flies
  past. FILL died on the delivery, not the plug.

- **WHEN THE NOUNS RUN DRY, CHANGE THE CARGO.** Every air level used to carry
  a rock. Two new decisions came from asking what ELSE the air acts on — it
  pushes every dynamic body, so it carries MILO (A90 GUST) and the player's own
  free LINE (A91 KITE), and neither is a twin of anything. Ask it of every noun:
  what does it act on that no level has used it on yet?
- **MILO IS AIR CARGO ONLY WHILE HE IS AIRBORNE.** While his feet are on
  something the walk controller sets his velocity every step and throws away
  any upward part, so air under a walking Milo does nothing. And stepping off
  an edge he loses his walk and drops almost straight down — beside a gust
  that starts 80 units out, not in it. GUST is built on both facts.
- **A WALKER CANNOT STAND IN AIR THAT BEATS GRAVITY FOR LONG.** The walk
  controller discards upward VELOCITY each step, but the upward drift inside
  each step still integrates: at -2600 (net 800 up) a dog walking a slide
  through a column creeps up ~7 units a second, its ground probe loses the
  line after about one second and the air takes it. Crossing a column on foot
  works if it takes under ~0.6 s; standing or walking in one does not. (DRIFT,
  14 Oct.)
- **THE FREEZE MUST LEAVE ROOM TO DRAW, AND SOMETHING TO DRAW FROM.** SINK
  passed every gate at 90 tries and a person called it unplayable: at the
  freeze its balloon was 55 units — about 30 pixels on a phone — above the pan
  it had to be tilted off, and a slope drawn in that open air touched nothing,
  fell flat and did nothing. The solver drew the few strokes that happened to
  start on the pan; a person draws where the problem looks like it is. Ask of
  every frozen frame: is there a finger's width of room where the answer goes,
  and does a line drawn there touch something that holds it?
- **A FREE LINE IS A THING, AND A LEVEL ABOUT IT SAYS SO.** KITE's answer is a
  dropped line, so it declares `solutionKind: 'unanchored'` like DROP and is
  held to the stricter rule (most winners must survive a hand) instead of the
  anchored one.
- **A FLOATING BOMB HAS A HEIGHT WINDOW.** Too high does nothing, too low
  kills him, and it falls out of TNT plus lift with no new code: A101 LOW
  BLOW's lid must hold the barrel within reach of the fence's bottom board and
  outside the kill radius of Milo waiting at it. The window was 127 units and
  a 20u precision floor until the bottom board was made taller to meet it.
- **A PLATE IS PRESSED FROM ONE SIDE, AND THE PICTURE MUST SAY WHICH.** Every
  plate was drawn with arrows on its top and sank when it fired, so the four
  ceiling plates (UPDRAFT, BALLOON, FLOAT, SINK) told players to load the roof.
  `from: 'below'` turns them over in both renderers, and assertLevel refuses a
  plate under a roof that does not say it.
- **TENSION COUNTS BLASTS.** It only watched lethal moving objects, so every
  TNT level read FLAT. A blast's edge against his nearest point now counts.
- **A CLIMBING BRIDGE IS STILL A CLIMB.** UNDERSIDE asked for one stroke to be
  his bridge and a balloon's ceiling at once; the physics worked and the
  winning bridge — one that climbs from a 25-unit window at the bank edge —
  measured 0.0–0.1% across seven geometries. The A2/A49 finding, again.

## THE DOG — a second walker, added 2026-10-14

- **IT WALKS ON MILO'S LEGS AND TURNS WHERE HE WOULD STOP.** Shared ground
  probe, slope rule and step-up (measured identical for Milo: three levels
  re-swept to the same numbers, every daily certificate replays); blocked by
  anything it cannot step over, it turns around. That one difference is the
  noun: the first thing in this game a line can STEER.
- **"BLOCKED" IS DISTANCE MOVED, NOT VELOCITY.** Meeting Milo head-on, both
  set their walking speed every step and the dog read -138 u/s while being
  shoved backwards — it never turned. And it must test its HEAD as well as its
  feet and middle, or a slope meeting it above its middle wedges it in place
  for ever (the pen level's census found every win was that).
- **A DOG THAT HAS DONE ITS JOB NEEDS SOMEWHERE SAFE TO BE.** A run ends when
  Milo reaches the goal, so a level can "win" while the dog is already
  trotting to its death: HEADS UP's dog turned at the far post and walked back
  into the spike pit behind it, INCOMING's walked off the end of the world,
  each a few hundred milliseconds after the finish — a race a player redrawing
  the same line loses half the time, invisible to every gate. `npm run race`
  replays every winner with the goal out of reach and fails a level where the
  dog dies within a second of the finish. The fix is a post to pace against
  or a KENNEL to drop into: it fails "turn the dog back early" exactly as
  spikes did (a dog in its kennel presses nothing) and keeps the dog alive.
- **A HAND-DRAWN LINE HAS A ROUNDED FOOT, AND THE DOG HUNG ON IT.** The owner
  called GOOD BOY unplayable (26 Oct, a video of two attempts), and by hand it
  nearly was: an upright wall in front of the dog — its most natural answer —
  won 12 times in 36 when the hand model drew it. The dog walked onto the
  line's rounded foot with its front feet, came to rest propped a few units up
  with its middle over air (airborne, because the probe looks under the middle
  only), and never walked or turned again; the run ended "HE'S STUCK". The
  owner's curve did the same at its TIP. None of it showed in any gate,
  because the sweep draws ideal lines and the hand rate only re-draws winners.
  Fixed for the dog alone: held up by something (standing, or at rest) and
  getting nowhere for 2s, it turns — where Milo would stop, the dog turns —
  and knocked onto its side, it gets back up. Upright, leaning and hooked
  walls now win 36 of 36 by hand, the owner's own line 12 of 12. Two
  stronger fixes were measured and rejected: letting its FRONT feet count as
  standing walked it off edges it used to hang on (DOWN BOY and STAY became
  races, 6%), and locking its rotation slid it slowly off HEADS UP's shelf
  onto the rock in its kennel (45 races where there had been one). Two
  seconds, not one, because a dog rocking on the rounded foot of a ramp it is
  about to climb settles within 1.8s. **Measure the natural answer drawn by a
  HAND, not just the sweep's, and re-run `npm run race` after touching how
  the dog walks** — `npm run losses` now fails any level where a dog is held
  still for 3s or more.
- **HOLD MILO AT A GATE BY HIS START** on a dog level, so that a lost dog is
  always lost before he could have finished.
- **NO LINE THROUGH THE DOG, TESTED ALONG THE SEGMENTS** — a simplified
  stroke can have two points 300 units apart either side of it.
- **A NEW THING'S FIRST LEVEL MUST STAY ITS EASIEST**, and with chapter 2 half
  empty that pins it from both sides: GOOD BOY low enough to stay under every
  dog level after it, high enough that TRIGGER is not 3x the four before it.
  When the hang fix took GOOD BOY from 19 tries to 16 (26 Oct), TRIGGER at 40
  broke the wall rule, and TRIGGER was eased to 31 — the spike moved, not the
  first dog level, which a person had just called unplayable. Filling slots
  13–14 frees it.
- **WHAT DIED: a pen is a needle** (two feet in two windows: 2 wins in 1,900),
  **and a trapdoor is answered by a floor** (draw under the hatch and let the
  dog press the trap plate — the KEEP OFF finding). A dog BRIDGE measured as a
  needle too, but every bridge drawn by hand wins: the sweep's winners are
  edge-to-edge spans in a small corner of a big level. Parked, not dead.

## THE BEES — a swarm, added 2026-10-15

The case study's element (docs/CASE_STUDY.md): Save the Doge's twist on the
draw-a-line formula. A hive releases bees that fly at the NEAREST living walker
(Milo or a dog), weaving either side of the straight line to it, and kill by
touch. js/bees.js; tools/test/bees.js holds the rules.

- **THEY ARE DUMB HOMERS, AND THAT IS THE NOUN.** A bee flies straight at him
  and has no idea how to get round anything. Measured: a hive in a pot below
  him never came out — the swarm pressed against the pot's floor toward him
  for the whole run — and a flat line hung right under a hive held all eight
  bees while he walked the whole level. They only find a way round a line by
  SLIDING along it as he moves, so a shield works while it stays between them
  and him, and fails at its END. A window off their straight line is never
  found (the window sketch: doing nothing won).
- **A SEAL IN THIN GEOMETRY IS A NEEDLE; A SLOT IN THICK GEOMETRY IS NOT.**
  Eight to twelve chaotic bees find any gap a shaky line leaves. Closing a 340u
  gap between two 20u roofs measured 146 tries; a 120u slot in a 60u-thick roof
  measured 18, because any line laid in the slot, at any height in it, seals it,
  and a line dropped above it falls in and seals it too. Bee size changed
  nothing (radius 7 and 10 measured identical). **Put the gap the line must
  close in something thick.**
- **THE SOLVER AIMS AT TOP CORNERS.** Its span family draws between the top
  edges of visible things, so a seal whose ends are BOTTOM corners (a cork under
  a hollow's mouth) is never proposed and measures 275 tries however easy it
  looks. Design the answer to start and end on something's top.
- **IN A CORRIDOR THEY ARE SLOW.** Weaving off the walls, a swarm chasing him
  down a tunnel closes at ~140 u/s, not the 180 its speed promises, so "shut
  them in behind him" either never catches him or leaves a window to draw in
  narrower than the solver's grid. Dead.
- **A BEE BEHIND A LINE IS NOT A NEAR MISS.** A swarm pressed under the bridge
  he walks on passes within a body's width of him all the way across; counted
  as close calls, it filmed five CLOSE banners and five slow-motions in one run.
  Close calls now need a clear line of sight from the bee to him.
- **IT WEIGHS NOTHING.** No plate, no pane: a plate a bee could press would be
  one the swarm decides, not the player.
- **A SWARM BEHIND HIM NEVER CATCHES HIM.** Bees fly at ~1.8x his speed but
  weave, and a swarm that is behind him when he passes closes too slowly to
  reach him before the door. TWO HOLES died of it: the hole nearer the door
  was never lethal, even with a hive over each hole. **The danger must be
  AHEAD of him or above him on the way, never behind.**
- **A BEE LEVEL'S ID IS ITS SEED.** The weave comes from a generator seeded
  from the level id, so renaming a level re-rolls its swarm: HIVE measured 35
  tries as a sketch and 46 under its real id. **Sketch bee levels under their
  final id** (spread a shipped level and change one thing, as the bee sketches
  in docs/batch/levels.md did).
- **THE DOG RACES THE SWARM.** A dog the line has not saved can still be alive
  when Milo reaches the door — DOGHOUSE's first build "won" 19% of the time
  with the dog stung a moment after the finish. Hold Milo at a gate the dog
  opens, so a dog that is not saved never lets him out (the dog section's own
  rule, which the bees made urgent).
- **A LINE'S CONTACTS ARE THE BODY'S, NOT THE PART'S** — found while counting
  bees on the line. Matter reports a compound body's contacts on the PART that
  touched, and only the whole stroke carries a game id, so a line of more than
  one segment touched nothing as far as the death explanation knew: a rock it
  had deflected into him replayed as "NOTHING STOPPED IT". Read through
  `part.parent`.

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

## MONETIZATION

**A DOCUMENTED SURFACE THAT DOES NOT EXIST IS INVISIBLE TO EVERY GATE.**
`js/platform/sdk.js` listed `requestRewardedAd(id)` in its own header as part of
the "verified SDK surface" from the day it was written, and never implemented
it. `saveData`/`loadData` were named in that same header and were also missing,
which meant nothing a player did was ever remembered. Twice is a pattern: a
header is a claim, and nothing in this repo checked the claims. **`tools/test/ads.js`
now does**, and it runs in `npm test`.

The surface is `ytgame.ads.requestInterstitialAd()` and
`ytgame.ads.requestRewardedAd(id)`, both Promise-returning, and the platform
documents that a request **makes no guarantee the ad was shown** — so every call
here resolves rather than rejects and never blocks a frame. None of them trip
the build's banned-primitive gate; they are not `fetch` or `XHR`. YouTube fires
its own pause/resume around an ad, which `onPause` already handles.

**THE INTERSTITIAL FIRES EVERY THIRD LEVEL, NOT EVERY LEVEL.** A level here is
about forty seconds. The counter starts so the first two are never interrupted
and the first ad lands after level 3, and the ENDING — the one screen that tells
a player they finished the game — is never covered, because `nextLevel` returns
before the counter. All four of those are asserted.

**THE ONE REWARDED AD IS A SKIP — approved 2026-10-13, designed in
docs/PLAN.md section 7.** A paid *undo* is still ruled out (it sells the exact
tension every level is built on) and so is a paid *hint* (a hint names the
PROBLEM, never the solution, so one worth buying breaks the rule). A skip does
neither. Its rules, from how the successful games do it: offered only on the
fail card, after 3 failures on a SPIKE or BOSS slot and 5 elsewhere; never on
levels 1–3 or the daily; paid with a rewarded ad OR a token earned by finishing
the daily (hold 3); GRANTED ANYWAY if no ad is available; a rewarded view resets
the interstitial counter; levels unlock in order, because an open board gives
away what a skip sells; a skipped level stays hollow and playable. The ads gate
asserts every one of those, and fails on any rewarded call site outside the
skip.

**AND DO NOT IMPORT A "YOUTUBE MONEY FORMULA" FROM ANOTHER PROJECT.** One was
brought in proposing that deceptive difficulty drives comment velocity, which
drives the algorithm, which pays. Checked rather than adopted:

- Its tier table computes `DAU x ARPDAU` and labels the result MONTHLY. ARPDAU
  is a daily rate: 200,000 x $0.0411 = $8,220 is one day. A 30x error in every
  row, and an "adversarial audit" of it caught none of them.
- It calls a cumulative click-through cohort "Daily Active Users".
- Its headline 822x multiplier divides dollars-per-user-per-day by
  dollars-per-view and is never used by its own arithmetic.
- **Its engine has no surface in Playables at all** — there is no creator, no
  video and no comment section inside the player. It describes marketing for
  videos ABOUT a game.
- Its 9:16 "safe zone" work contradicts nine aspect ratios, never lock
  orientation.

The part that survived is one sentence — easy games have no suspense,
impossible ones get abandoned — and **this project already measures both ends
better than the formula does**: breadth 2-40% locates the line it calls critical
and cannot find, and `tension` is its near-miss idea with a number on it. The
deeper objection is that it optimises for the SPECTATOR and not the player, and
A7 and A14 already proved those are different people: both passed every gate and
were shelved because a real person could not tell what they wanted.

## THE DAILY — A REASON TO COME BACK (CONTENT IS THE OTHER HALF)

**Correction, 2026-10-13: the argument below was half right, and it stopped
level production for three weeks.** The daily brings a player back; it gives
them nothing to do once they are back — one level, a third of an ad. A sitting
is ~10 minutes and 8–15 levels, so 21 levels is two sittings and 60 is a week.
Both halves are needed: the daily and the campaign. See docs/PLAN.md section 3.


**Twenty-one levels is fourteen minutes, played once.** Revenue here is daily
actives x sessions x ad impressions, so with nothing to come back FOR the
audience decays to zero after day one no matter how many levels exist. Four
sessions of chasing level 22 did not move that number, because three more
minutes of content in a game nobody reopens is worth nothing. The portals say
the same thing from the other end: aim for ~10 minute sessions, persist
progress, and **add a new challenge each day**. *(Corrected 25 Oct: this was
credited to Google's Playables guidance; the difficulty research could not
trace the ~10 minutes to any Google page — it comes from CrazyGames and
GameAnalytics benchmarks. Persisting progress IS a Google requirement.)*

**THE TWIST IS THE INK, NOT A NEW LEVEL.** The daily runs one of the shipped
levels at its measured THREE-STAR length from `js/solverData.js` — the 20th
percentile of real winning strokes, so a winner provably fits, while the line
that normally clears the level does not. Measured on day one: the certified
winner for that level is 288u against a 226u budget. A stroke over the budget
is REJECTED at release — "TOO MUCH INK", a no-op rather than a spent attempt —
and the ink meter is what shows the player they are over; nothing cuts the
stroke short. No new physics, no new tuning, no new gates.

- **UTC, not local midnight.** Local time would give Auckland and Los Angeles
  different challenges for most of the day, which defeats the point.
- **A shuffle bag, not `hash(day) % n`.** Random picking repeats by birthday
  collision — roughly once a fortnight — and yesterday's level again is what
  makes a daily feel worthless. Measured over 1000 days: never the same level
  two days running, and **no level returns inside 8 days**. The worst rolling
  21-day window holds 14 distinct levels, not 21, which no pair of independent
  permutations can fix; 8 days of separation is the number a player feels.
- **Schema 2 MIGRATES version 1 rather than discarding it.** The discard rule is
  for saves this build cannot understand. A v1 save is understood completely —
  it simply has no streak, which is indisputably zero. Throwing it away would
  cost a player their stars to avoid a risk that does not exist.
- **The strip clashed with the close button at the three widest ratios.** 16:9,
  21:9 and 32:9 are short enough that the band rode up into the X, and since
  `hitTest` checks close first the strip's corner was dead. Caught by checking
  the geometry at all nine ratios, not by looking at one. **Check a new HUD
  element at every ratio, not at the one you developed on.**

**THE POOL — forty generated levels, dealt only by the daily.** Twenty-one
levels meant the daily came round every three weeks. The generator's levels are
twins of 1-12, which keeps them out of the campaign and costs nothing in a
challenge whose twist is the ink, so `js/dailyPool.js` holds forty of them and
`LEVELS` never sees them: not the board, not the stars, not `nextLevel`.

- **The generator measured the star thresholds and threw them away.** The daily
  budget IS `threeStarLength`, so every baked level would have fallen back to
  an invented 540u. `generate.js` keeps them now.
- **THE FIRST FAIRNESS PROOF WAS WRONG, AND THE SHIPPED DAILY HAD IMPOSSIBLE
  DAYS.** "The shortest winning stroke fits the budget" is satisfied by an
  idealised three-point stroke no finger reproduces. Measured with the hand
  model at the daily budget: DUCT and CRACK had 110 units and not one winner
  that survives a hand, 0 of 23 and 0 of 5. JAM's only survivors at 165u are
  dropped lines a hand lands 32% of the time, under the 50% an unanchored
  solution needs. On those days the daily looked merely hard, was impossible,
  and broke the streak of everyone who tried. **The daily now deals only what
  `tools/levelgen/bake.js` can certify**: a hand-robust win inside the daily
  budget, by the campaign's own reproducibility rule. The three are in
  `HELD_FROM_DAILY` with the measurement and stay in the campaign untouched.
- **An over-budget stroke is REJECTED, not cut short** — "TOO MUCH INK". Every
  generator certificate was 288-346u against a 230u budget, so certified at 900u
  they said nothing about the daily. A pool level is only ever played as a
  daily; the daily budget is the only place its certificate means anything.
- **One shuffle over both halves got the ratio right and the spread wrong.**
  Campaign levels came up 31% of days — and sixteen days running with none: two
  weeks of basic verbs and no air, balloons or brittle floor. Two decks
  interleaved make it exact: one campaign day in every three, never more than
  two days without one. Repeats widened too — 12 days for a pool level, 18 for
  a campaign level.
- **Most daily budgets are 230u**, because the sweep's stroke lengths come in
  steps. The strip says "in 230 of ink" most days. Not fixed.
- **Re-bake after ANY campaign, solverData or physics change** — `bake.js` with
  no arguments keeps the pool and re-certifies the deck. `tools/test/daily-deck.js`
  replays every certificate at the budget it is dealt at and fails when one goes
  stale; it cannot re-certify (minutes), only notice.
- **Any change to the deck reshuffles every future day.** Before launch, not
  after.
- **THE DAILY DEALS ONLY WHAT THE LAST BAKE CERTIFIED** (`DAILY_CAMPAIGN` in
  js/dailyPool.js). It used to deal every campaign level not held, so the first
  new level of the 60-level push turned `npm test` red until a multi-minute bake
  ran. Now a new level is simply not dealt until the next bake, `npm test` says
  WAIT and names it, and it can never reach a player uncertified. Bake once per
  batch of new levels, and always before launch.

## THE DIFFICULTY CURVE — MEASURED, NOT REMEMBERED

**The order of LEVELS was creation order, and it showed.** Every level carries
two measured numbers — breadth (the share of plausible strokes that win) and
hand rate (the share of those a shaky hand still lands) — and one over their
product is TRIES: how many plausible hand-drawn strokes a player would expect
to need. It is relative, not a prediction, and it measures search and
execution, not comprehension. Measured on 2026-10-12, the shipped order had:

- **CATCH at level 4 taking 56 tries** among levels of about 11 — a wall in the
  first minute, which is where a new player decides whether to stay.
- **Air introduced by UPDRAFT (39) while DUCT (6) waited three levels behind.**
- **BRIDGE at level 2 (28)** above the two levels after it.

`tools/test/curve.js` now holds the order to six rules (the fifth: every level inside its slot's band; the sixth: the ceiling below), each a principle and
not a fitted number: levels 1-3 in the easiest band (<=15), and level 1 the
easiest of the three — it is the teaching level (25 Oct: rebuilt from 11.7
tries, the hardest of the three, to 6.0); every noun first
met at its EASIEST level (nouns detected from the data — a new level is held to
it the moment it uses one); no level over 3x the median of the four before it;
each third harder than the last. The re-order passes all four with no level's
ink touched: the line 12->28, plate & gate 4->56, air 6->69, finale 61->90.

- **Any moving air is AIR.** A29's draught is purely sideways (accel 0, ax
  600); a detector that asked "up or down" missed it entirely.
- **Ink is NOT a reliable difficulty dial — measured.** Breadth is wins over
  PLAUSIBLE strokes, and an over-budget stroke is rejected before it counts, so
  cutting the ink shrinks the numerator and the denominator together. A20
  SPRING at ink 460 / 300 / 200 / 140 swept 35.4% / 32.7% / 23.4% / 26.7%: a
  70% cut bought 1.3x the difficulty, and not even monotonically. To make a
  level harder, change what it asks, not what it pays.
- **A new level must fit the curve, not just pass its own gates.** Place it,
  run the curve gate, and move it until it passes.
- **EVERY SLOT HAS A TARGET NOW, FROM ONE EQUATION** (tools/lib/difficulty.js):
  `T(c, k) = 8.6 · 1.26^c · 4.0^p(k)` over seven chapters of ten (six until
  BEES was inserted as chapter 3 on 18 Oct — checked first: every built level
  stays in its band when the later chapters move up one), the same
  sawtooth in each (INTRO, three DEVELOPs, SPIKE, BREATHER, two DEVELOPs,
  BREATHER, BOSS) — two hard levels in ten, a breather after each, the first
  boss at level 10, which is where the industry puts them. T0, G and S were
  fitted on 13 Oct to the 21 levels of that day; `python3 tools/lib/fit-curve.py`
  now fits them to every level where it sits, weighted by how many winning
  strokes each number rests on, and prints the drift (25 Oct: T0 7.06, G 1.22,
  S 5.52, typical miss x1.21 — the constants are NOT yet changed, pending the
  difficulty research); a level must measure within x1.5 of its slot's target
  (intros and breathers may be easier). `npm run curve` prints all seventy slots
  with their targets: it is the build list. Refit when real players' attempt
  counts exist — simulated difficulty is least accurate on the hardest levels.
- **THE CEILING IS 60 TRIES (25 Oct, the owner, on the difficulty research).**
  The equation climbed to 138 for the final boss while the only human evidence
  — SINK, "unplayable" at 90 — says ~60 is already a wall; King eases any
  level past ~50 real attempts; this game sells no continues, so nothing pays
  for steep spikes. No target or band passes 60 and no new level may measure
  above it (rule 6). The nine levels above it that day are on `WATCH` in
  tools/lib/difficulty.js: each may only get easier, and comes off the list
  when it drops below 60. The top of the curve is a stated plateau at 60
  until real players set the scale. **The research's other finding stands
  behind it: these numbers are a ranking, not a measurement** — a spike is
  only 1.52x the level before it while the band is x1.5 and the hard levels'
  noise is ±15–42%, so the gate cannot tell a sawtooth from a plateau. Real
  attempts (docs/PLAYGAMA.md, `fit-curve.py --real`) are the fix, not a
  cleverer formula.

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
- **Inside Playables the cloud save is the ONLY save.** Google: "Game MUST NOT
  use any other mechanism to save user progress". Every save was mirrored to
  localStorage as a "backup" — exactly another mechanism — while the checklist
  read PASS, because it only asked whether the cloud worked. localStorage is
  for off the platform only, decided by `IN_PLAYABLES_ENV`. `tools/test/save.js`.
- **Nothing is saved until a load has LANDED.** The platform rejects an early
  save, and the rule protects the player: progress loads in the background, so
  a save sent first writes a fresh progress over the real one. What the player
  did before it arrived is folded in (`absorb` in js/progress.js), not lost.
- **Sound does not wait for a tap inside Playables** — the FAQ's most common
  audio failure. It starts once the save says whether the player muted it.

## COMMANDS

    npm run levelcheck [id]       STRUCTURE, in seconds — run BEFORE the solver
    npm test                      level data, physics, levels, curve, daily — fast, run always
    npm run solver [id ...]       the gates, and writes measured star thresholds
    npm run certify [id]          certifies a hand-robust solution per level
    npm run curve                 all 70 slots: each target, what is built, what is left
    npm run sketch -- f.js [slot] measure several candidate levels against a slot's band
    npm run census -- f.js [EXP]  sort every winning stroke by WHAT HAPPENED in it
    npm run race -- id ...        a dog level: does the dog die just after the finish?
    npm run losses -- id ...      sort every LOSING stroke by why it lost — run beside census
    npm run film                  films every level being WON — READ THE IMAGES
    FILM_IDLE=1 npm run film      films it being LOST — read those too
    npm run frozen                every opening frame in ONE grid — READ IT
    npm run test:audio            renders waveforms; silence throws no error
    npm run test:board            level board hit regions at four ratios
    npm run test:conformance      the automated half of certification
    npm run build                 dist/: the web page, the YouTube ZIP, the web ZIP
    npm run generate              DAILY POOL candidates only — it cannot make a campaign level
    npm run bake [candidates.js ...]   bakes the DAILY DECK; no args re-certifies
                                  it — after ANY campaign/solver/physics change
    FILM_POOL=1 npm run film      (and frozen) the daily pool, on its budget

`npm run x -- args` passes flags through. Every tool that simulates needs the
Matter import that these scripts add; `node tools/levelcheck.js` on its own
throws "Matter.js not loaded".

Browser tests need `npm run serve` running.

## WORKING AGREEMENT

- Credits are finite. Run the gates the change actually touches, not all of
  them out of habit. A render-only change does not need the physics suite.
- Do not rush. Most mistakes here would have been caught by sitting with the
  problem for one minute.
- Report failures plainly, with the output. Never claim something works without
  having looked at it.
- **Commit and push at every checkpoint, never only at the end.** A cloud
  session's machine is reclaimed when it goes idle, and the next one starts
  fresh. The whole TNT engine — fuse, blast, breakable fence, its renderer, its
  death cam and level A51 — was lost that way, uncommitted when the machine was
  replaced. Work on the branch is safe; work only on the machine is a loan.
- **A skipped browser gate exits 0.** Without playwright-core every visual test
  prints SKIPPED and passes, so on a fresh machine the gates read green while
  looking at nothing. `.claude/hooks/session-start.sh` installs it (pinned to
  1.56, the release that drives the preinstalled Chromium 1194). If a gate says
  SKIPPED, it did not look.
