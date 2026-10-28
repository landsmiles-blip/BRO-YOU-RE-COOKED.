# DOSSIER — the project's own documents, in one file

Generated 28 Oct 2026 from the files named below. The originals are authoritative; this copy exists so one file can be handed to Claude chat.


=================================================================
# FILE: CLAUDE.md
=================================================================

# BRO, YOU'RE COOKED. — what this project has learned the hard way

A physics rescue puzzle for YouTube Playables. One line. One shot. Get him out.

This file is not documentation. It is the set of rules that were paid for —
every one of them cost a shipped bug, a wasted build, or a playtest that came
back saying the game did not work. Read it before changing anything.

**START HERE.** `docs/PLAN.md` is what we are doing next and why — how many
levels, where they come from, who builds them (proposed 2026-10-13; check its
status line before acting on it). `docs/HELD.md` is every level already built
and shelved, with the measured reason. Read both before designing anything.
`docs/brief/BRIEF.md` is the whole project's story from the first commit, and
`docs/history/` holds the conversation itself, word for word.
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
  **Correction, 27 Oct: the cap closed the top and not the door.** A dropped
  line slides in under the chimney the way the ball does and the air carries
  it up: 21 of 119 wins. Left open on purpose — see the audit below.
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
  **Unless a dropped line has to SHOVE the cargo** (27 Oct): UPDRAFT's ball made
  heavy enough to gate lost 45 of the 73 wins where a falling line pushed it
  into the chimney, and the level went from 39 tries to 101.

## THE AUDIT, RUN FOR THE FIRST TIME — `npm run plates`

"Re-run the drop-on-the-plate audit" stood above for weeks with no tool, so it
was never run. Run by hand on 27 Oct, over every plate level, counting the wins
whose plate was pressed by the player's own line:

- **FUNNEL, the plate INTRO, 636 of 668 (95%).** The rock lands on the lip and
  never moves; a dropped line slides off the lip onto the plate. Its 4 tries
  were the back door. Weighed, it measures 135; seven honest redesigns (a ledge
  over the plate, no ledge and a ramp off the shelf) measured 76 to 527 against
  an intro band of 16 — **getting a rock onto a plate is a needle here.** The
  rock is decoration in the level that introduces plates. OPEN, owner's call.
- **TRIGGER 20 of 102** — an arch dropped on the plate that also knocked the
  rock past. Closed by weight (rock 191, plate 170, ink 400): 0 of 82, 31 → 34.
- **UPDRAFT 18%, LEVER 14%: allowed.** The line rides the air or the lever —
  the noun is still the answer, as KITE's line is. Closing either costs a WATCH
  level or 2.5x its tries.
- WALKIES 1 of 40, DOGHOUSE and the nine weighed plates 0.

`npm run plates` counts it now and fails over 5%, except `solutionKind:
'unanchored'` levels, an ALLOWED list with reasons and an OPEN list that prints
but does not fail — the curve's WATCH list, for back doors.

Three things came out of it, all now enforced:

- **A PLATE WEIGHED THE SEGMENT, NOT THE LINE.** Matter reports the part that
  touched, so a curved line counted about a twelfth of its mass and a straight
  one all of it. It reads the whole body now. No level changed.
- **A WEIGHT GATE MUST BEAT THE HEAVIEST LINE THE INK BUYS** — 0.33 a unit
  straight, 0.39 curved, so `assertLevel` wants `minMass > 0.4 x maxLength`.
- **A WEIGHED PLATE LOOKED LIKE ANY OTHER.** 357 of RAIL's losing strokes, 73
  of DOWN BOY's and 28 of GOOD BOY's lay a line on one and nothing said why.
  A weighed plate pressed from above carries a weight as tall as its arrows,
  and a dropped line lying on one ends **TOO LIGHT FOR THE PLATE** with the
  plate ringed — ranked above "NOTHING HELD IT UP", because falling was the
  point. Not on ceiling plates: what rises into those is a balloon or a ball,
  and a weight hung there would say the opposite.

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
    npm run plates [id ...]       every plate level: how many wins the LINE pressed — after touching any
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


=================================================================
# FILE: docs/DECISIONS.md
=================================================================

# Locked Decisions

Every open item from the Production Bible's Part 11 (in git history at `9c073b9`), now closed. The user delegated these calls; each is recorded with its reasoning and its reversal cost, so any of them can be reopened deliberately rather than by drift.

**Status key:** **LOCKED** — build against it. Reversal cost is stated where it is non-trivial.

---

## D1 — The Freeze · **LOCKED: YES**

The world runs live for ~1.2 s, then stops dead. The player draws into a frozen tableau, with no timer. Release restarts time.

**Why, having argued the other side:** the case against is that removing real-time pressure makes this more puzzle than action, which could read as slow for a YouTube audience. That case loses on three counts. The 1.2 s live beat delivers the urgency as *staging* — the player sees Milo walking and the boulder tipping, so the danger is felt without being timed. Determinism is worth more than pressure in a physics puzzle: with a freeze at fixed world-time, release timing stops being a hidden input, and "same stroke → same outcome" becomes structurally true rather than aspirational. And the platform audience is explicitly a distracted, multi-tasking one — a world that waits forever is a feature there, not a compromise.

The comparable games (Save the Doge, Happy Glass, Love Balls) are all effectively frozen-then-run. The freeze is not a concession to them; it is where our version puts the drama they leave on the table.

**Reversal cost: high.** Determinism, the retry loop, the death cam and the art direction all sit on top of it.

---

## D2 — Procedural art · **LOCKED: YES**, cut line intact

Milo is a code-driven articulated rig. The world is drawn at runtime with the boiling-line renderer. Zero art assets.

**Why:** at a $0 asset budget there is no competing option that delivers eight animation states, and the procedural route is *better* rather than merely cheaper — it makes Milo react continuously to physics (a sprite sheet plays the same eight frames whether the boulder grazed his hat or flattened him), it puts the whole game near 200 KB against a 15 MiB recommended ceiling, and it eliminates the "obvious AI-generated art" certification risk outright because there is nothing generated to be obvious about.

**The risk is real and is managed, not ignored:** procedural art done badly reads as unfinished programmer art, which is worse than mediocre purchased art. The entire look rests on one component, so that component gets built standalone and first.

**Cut line — binding:** if the stroke renderer does not sing within one week at M1, judged on the thumbnail test with five strangers, the thesis has failed. Stop, escalate, and reassess with money on the table. Do not push through on attachment.

---

## D3 — Matter.js behind an adapter · **LOCKED: YES**

Matter.js, vendored, with every engine call routed through `js/physics/adapter.js`. No other file imports it.

**Why:** fastest path, smallest payload (~30 KB gzipped), exactly the needed feature set. Its two real weaknesses — no continuous collision detection, and slowed maintenance — are handled rather than hidden. The tunneling triad (120 Hz + 900 u/s clamp + 16 u thickness) mitigates the first; the adapter makes the second survivable.

**Escape hatch:** if the tunneling acceptance test fails or stacking proves unstable at M0, swap to Planck.js (Box2D port, proper bullet-body CCD). Behind the adapter that is a one-to-two day job. Without it, a rewrite. That difference is the whole reason the adapter exists.

---

## D4 — Title · **LOCKED: keep "BRO, YOU'RE COOKED."**, with a language-free mitigation

**Preliminary availability check (not legal clearance):** a search across the usual game platforms surfaced no title collision. The nearest neighbour is an unrelated itch.io game called *BRO IS COOK* (a chemical cook-up game) — different title, different genre, no meaningful conflict.

**This is a signal, not a clearance.** A real trademark search is a legal exercise, and it remains genuinely the user's to commission before public launch. It is cheap now and expensive to discover late.

**The decision made here is the mitigation, and it stands regardless of what clearance finds:** the title is slang that may date, and it does not translate for a global platform. So **the icon and the first frozen frame must sell the game with zero language.** A player who cannot read the title must still understand, in one still image, that a small person is about to die and that they can do something about it. That constraint is now binding on the art direction and is already encoded as the thumbnail test in Bible §6.8.

If clearance later comes back bad, the title changes and nothing else does — because nothing else depends on it.

---

## D5 — Audio · **LOCKED: synthesised SFX + a procedural ambient bed. No music track.**

**Why not a licensed/commissioned loop:** the game is played inside YouTube, frequently muted or alongside the user's own audio. A tinny loop fighting the video the player is already watching is worse than nothing, and it costs money this project does not need to spend.

**Why not silence either:** a game with no audio bed feels dead when it *is* unmuted.

**The call — better than both:** WebAudio synthesised SFX (impacts driven by collision impulse, so the sound matches the hit you just watched), plus a **very light procedural ambient bed** — soft room tone with an occasional tonal swell tied to Milo's danger scalar. It rises as he nears death and resolves when he is safe. Zero KB, no licensing, and it does something a music loop cannot: it scores *this specific run*.

**Non-negotiable, and it outranks all of the above:** no information is ever carried by audio alone. The game must be fully legible on mute, because much of the time it will be.

---

## D6 — Content scale · **DECIDED 2026-10-13: 60 levels, six chapters of ten**

**Amended 2026-10-18: 70 slots, seven chapters** — BEES went in as chapter 3
(docs/PLAN.md status of that date). 42 are built as of 2026-10-25.

Was: 24 shippable, 60 the upside, decided on measured authoring cost. Decided
now on what one player needs: a sitting is ~10 minutes and 8–15 levels, so 21
levels is two sittings and 60 is a week of daily play — the week a habit forms.
Every slot has a measured difficulty target (D10). Cut line: if fewer than 12
of the first 19 new levels pass their gates, the target becomes 45. See
docs/PLAN.md sections 3, 4 and 8.

---

## Still genuinely outside my authority

- **Legal trademark clearance** (D4) — requires a real search and, if it matters, a lawyer.
- **Any spend.** If the D2 cut line trips, that is a money decision and it comes back to the user.

---

## D7 — Verification · **LOCKED: nothing ships on numbers alone. The gate is a picture of the game being won.**

Two unplayable builds shipped while every numeric gate reported green. That is a
broken method, not bad luck, and this decision is the method that replaces it.

**What actually went wrong, in order:**

1. **I had never watched the game play.** Every screenshot was the *frozen
   tableau* — the still frame before anything moves. Everything else was numbers
   out of a headless simulation. A vibrating line, a shrinking line and a line
   that will not sit still all satisfy an assertion about positions.
2. **The fix to (1) was still not a gate.** The first filmstrip drew one
   hand-authored "stroke a person would plausibly draw" per level. Most
   plausible strokes LOSE, and a filmstrip of a loss looks exactly like a
   filmstrip of a broken level. I read a losing A9 stroke as a dead level and
   was one edit from "fixing" a level that was fine.
3. **My model of a human hand was physically impossible.** `handDrawn` applied
   tremor on both axes with a wavelength shorter than its own sample spacing —
   it aliased, producing a crumpled zigzag whose consecutive segments sat at
   31°, −88°, +113°, −119°. No finger draws that; no input pipeline emits it.
   Gating on it condemned A2 as having *zero* hand-playable solutions.
4. **`solvable: true` never meant playable.** It meant some idealised 4-point
   polyline won. A solution only reachable by a stroke drawn to the pixel is
   not a solution.

**The standing rules:**

- **One hand model** (`tools/test/lib/hand.js`), with no physics imports so
  every tool shares it. Tremor is perpendicular to travel, and its wavelength is
  held to at least 6× the sample spacing — the guard that makes aliasing
  impossible. It must still survive simplification as a genuine multi-part
  chain: realistic and demanding are not opposites; aliased is just wrong.
- **A level is solvable only if a shaky hand can solve it.** Every winner is
  re-run under three tremors that differ in amplitude, in where the bends fall,
  and in pixel quantization — a pointer reports integer screen pixels, ~1.8
  world units at phone scale, which no simulation applies on its own.
- **The representative solution must be ANCHORED.** An anchored stroke is
  static: it stays where it was drawn and the level plays the same way every
  time. An unanchored one falls, tumbles and settles, and where it settles is
  chaotic. A3's representative was an unanchored arc that passed every headless
  tremor and then lost in the browser, jamming Milo a body's width from the
  goal. A solution a player cannot reproduce is not a solution.
- **Filmstrips film certified winners, and losing one is a build failure.**
  `tools/test/filmstrip.js` exits non-zero on any level that does not reach its
  goal, because every stroke it draws is already proven to win.
- **The cheapest gate runs first.** `assertLevel` existed, was correct, and was
  only ever called from `js/main.js` — at boot, in the browser. So `npm test`
  reported ALL PHYSICS GATES PASS while the shipped bundle was a blank page. A
  headless suite that never loads the game cannot notice the game is dead.
  `tools/test/level-data.js` now runs first and catches it in milliseconds.
- **Generated data merges, never overwrites.** Re-measuring one level used to
  silently delete the other eight levels' star thresholds, and the file still
  looked plausible afterwards. The most common way a tool is used must not be
  its destructive path.

**Verification order, every time:** `npm test` → `npm run certify` → `npm run build`
→ `npm run film` → **read the images** → `npm run solver` → `npm run test:browser`.


---

## D5a — Audio · **Gemini (or any generated samples) CANNOT be used at runtime. Synthesis stands.**

Asked directly: can we use Gemini for the audio? Three separate answers, and only
the third is a judgement call.

**1. At runtime it is impossible, not merely discouraged.** YouTube Playables
prohibits all external network calls. This repo already enforces that itself:
`tools/build.js` line 68 fails the build on `fetch(`, `XMLHttpRequest`,
`WebSocket`, `sendBeacon` and `importScripts`. A game that calls an audio API
while someone is playing cannot be built here, let alone certified.

**2. At build time it is possible, and payload is not the objection.** Generated
audio baked in as files is a legitimate asset pipeline, and there is room: the
whole game is 42 KB gzipped against a 15 MiB recommendation — 0.28%. Hundreds of
KB of audio would fit comfortably.

**3. For THIS game it is still the wrong tool, and the reason is not budget.**
A sample is fixed. The game's entire claim is that the physics is honest: a
boulder that lands hard kills, and the same boulder nudging your line is
furniture. If both play the same "thunk", the audio contradicts the rule the
player is being asked to learn. The impact sound is therefore driven by
`normalSpeed` — **the same number `hazards.js` thresholds at 400 for lethality**
— so what you hear is literally what nearly killed him. Measured: a 150 u/s
contact peaks at 0.050, a 650 u/s one at 0.138, and anything under ~35 u/s is
exactly silent. A library of velocity-layered samples is a worse, heavier
version of this, and a single sample is a lie.

**Where generated audio WOULD earn its place, and this is open:** a signature
one-shot that is not physics-driven — a title sting, a distinctive "COOKED"
motif. That is a build-time asset with no certification issue. It needs either
API access or the files themselves, neither of which this session has.

**What shipped instead:** WebAudio synthesis, 2.3 KB gzipped, no assets.
Impacts scaled by collision-normal speed, a pencil scratch while drawing, a
release whoosh, switch/reject/death/success/ending cues, and an ambient bed
whose cutoff and gain track Milo's danger scalar — so it scores *this run*,
which a licensed loop could never do.

**Two rules that constrain every sound here:**
- **No information is ever carried by audio alone.** The game is played inside
  YouTube, frequently muted, often over the player's own audio. Every sound
  duplicates something already on screen.
- **`onPause` suspends the AudioContext**, not merely "stops scheduling". A
  playable that keeps humming in a backgrounded tab fails review.

**Verified by measurement, not by inspection** (`npm run test:audio`): every
sound is rendered through an OfflineAudioContext and its waveform measured.
Silence throws no error, so "the function was called" proves nothing.

---

## D8 — Procedural levels · **LOCKED: generation is a SEARCH tool and an endless mode. It is not the campaign.**

Asked directly: can the game generate its own levels forever, instead of us
hand-building them? Built the generator, ran it, and answered with evidence
rather than opinion.

**Payload is not the constraint, and it is not close.** A level costs 321 bytes
gzipped. 2,000 levels would be 0.61 MB against a 15 MiB recommendation. "How
many levels can it hold" is the wrong question.

**The oracle already existed, which is the unusual part.** What normally kills
procedural puzzle generation is not making layouts, it is judging them. This
project already had that: an idle gate (doing nothing must fail), a
2,100-stroke solvability sweep, hand-robustness under three tremors plus pixel
quantization, a 2–40% breadth band, and a 25u precision floor.

**Runtime generate-and-test is impossible.** One full validation is 7–50
seconds of CPU. That cannot run on a phone at 60fps inside YouTube. So
generation is OFFLINE, and what ships is the surviving data.

**And then the result that settles it.** The generator's three best candidates
out of fifteen were: level 1, level 1 again with different numbers, and level
9. Filming the top one showed exactly what the numbers could not — the line is
drawn in mid-air, falls to the ground, the rock glances off it, and Milo walks
over. 14.5% breadth, six stroke families, every gate green, and **no decision
anywhere in it.** It is level 1 with the interesting constraint removed.

That is the whole finding: **the gates measure whether a level is FAIR. Nothing
measures whether it MEANS anything.** A14 proved the same thing from the other
direction by passing at 1.6% while its rock was decoration.

**So the split is:**

- **Generation searches NUMBERS inside a shape that already carries an idea.**
  The archetypes in tools/levelgen/archetypes.js are distilled from levels that
  work and have been filmed being won. The machine finds where the ledge goes
  and how fast the roller rolls — a search problem, which is what machines are
  for. It cannot invent "the rock that is trying to kill you becomes the floor
  you walk across", and it never will.
- **Endless mode is where generated levels belong**, after the hand-built
  campaign. Fair-but-derivative is exactly right for infinite content and
  exactly wrong for the teaching ladder. Post-launch, and gated on whether
  players actually finish the campaign — building infinite content for an
  ending nobody reaches is the classic way these projects die at 70%.
- **No generated level ships in levels 1–24.**

**Superseded 2026-10-13: parallel sessions, one owner per file.** This said
"no AI sub-agents — parallel agents would start with no memory of this project".
That was true when the memory lived in one session's head. It now lives in
CLAUDE.md, docs/HELD.md and docs/PLAN.md, which every session reads. Three level
designers and a shell engineer work in parallel, each owning its own files, and
one integrator owns the generated data, the order and the final review
(docs/PLAN.md section 6).

---

## D9 — Monetisation · **LOCKED 2026-10-13: one rewarded ad, and it is a SKIP**

Approved by the user, designed from how the successful games do it: Brain Test
skips with a rewarded video and pays its daily challenge in the currency that
buys skips; platform guidance says offer help at the fail screen, never make an
ad the only way forward, never stack an interstitial on a rewarded view, and
never tune difficulty to force ads. So: fail card only; after 3 failures on a
SPIKE or BOSS, 5 elsewhere; never levels 1–3 or the daily; a rewarded ad or a
token earned from the daily (hold 3); granted anyway if no ad is available;
resets the interstitial counter; levels unlock in order so the skip is worth
something; a skipped level stays hollow and playable. Undo and solution hints
stay ruled out. Full table in docs/PLAN.md section 7.

**Reversal cost:** low in code (one button, one save field), high in trust if
it is ever tuned to sell — the rule against tuning difficulty to drive ads is
part of the decision.

---

## D10 — Difficulty · **LOCKED 2026-10-13: every slot has a target from one equation**

`T(c, k) = 8.6 · 1.26^c · 4.0^p(k)`: tries (attempts per success, measured by
the solver and the hand model — simulated players, the way King predicts
difficulty before release) for slot k of chapter c. The same sawtooth in every
chapter: two hard levels in ten (the industry's one in five), a breather after
each, the first boss at level 10. T0, G and S are the least-squares fit to the
21 shipped levels, all of which land inside their bands; a level ships only
inside its slot's band (x1.5; intros and breathers may be easier). Refit when
real players' numbers exist. tools/lib/difficulty.js, tools/lib/fit-curve.py,
rule 5 of tools/test/curve.js.

**Amended 2026-10-25 (owner): a ceiling of 60 tries.** The difficulty research
(reports/Progressive difficulty in puzzle games.md) found the equation climbing
to 138 against the only human evidence (SINK "unplayable" at 90), and nothing
in this ad-funded game that pays for steep spikes. No target or band passes 60;
no new level may measure above it; the nine levels above it on that day are on
a WATCH list that may only shrink, THORNS first. Rule 6 of tools/test/curve.js.
The top of the curve is flat at 60 until real players set the scale.

---

## D11 — Launch · **LOCKED 2026-10-27 (owner): ship v1.0 now, to real players, and let them decide what comes next**

The owner played it and asked whether to ship, for an independent view rather
than agreement. The view: yes, and not to YouTube first. Three reasons.

- **The build is ready.** Every machine-checkable certification row passes,
  and all 45 levels were filmed won and lost in the real browser on 27 Oct.
- **YouTube is not ours to open.** Playables is early access, our interest
  form is pending with no published timeline, and revenue sharing is a pilot
  with no published split.
- **"Perfect" rests on one player.** Every difficulty number is simulated, and
  eight levels sit over the ceiling. The last two times a person played
  closely they found walls every gate missed.

Building levels 46–70 against a model that has never met a player is the
expensive mistake. Shipping costs a session.

So v1.0 is the 45 levels, frozen at release commit `f159983`. It goes, in order, to:
1. Playgama's Sandbox, for real attempts per level;
2. itch.io, for a public link;
3. CrazyGames, which is not exclusive;
4. YouTube, after two weeks of numbers to show.

No new content until those numbers decide it. Order and reading list:
docs/launch/LAUNCH.md.

**Honest about the money:** small and uncertain at first. A well-performing
casual web game is reported at $200–2,000 a month (a vendor estimate,
unverified), and Playables pays through an unpublished pilot. The decision
is profitable because it is cheap and it buys the information every later
spend depends on, not because of a revenue forecast.

**Reversal cost:** low. Each portal can be withdrawn. Changing the campaign
after launch reshuffles every future daily challenge, so changes come in
batches.


=================================================================
# FILE: docs/PLAN.md
=================================================================

# PLAN — from 21 levels to a game one person comes back to

> **28 Oct.** The whole story is in `docs/brief/BRIEF.md`; the conversation, word
> for word, is in `docs/history/`.
>
> **Status, 27 Oct (later). v1.0 — SHIP IT (D11).** The owner played it and
> called it ready. The release gate passed: all 45 levels filmed won and lost
> in the browser, every test and the conformance run green, and a new store
> kit captured from the current build. The campaign is frozen at release
> commit `f159983` (to be tagged `v1.0` on GitHub). It goes to Playgama, itch.io and CrazyGames now, and to YouTube
> with two weeks of real numbers. **No new levels until those numbers say
> which.** The order and reading list are in `docs/launch/LAUNCH.md`.
>
> **Status, 27 Oct. Plates audited (`npm run plates`).** GOOD BOY's dog no
> longer hangs on hand-drawn lines (26 Oct). Then the first audit of every
> plate level: TRIGGER's back door is closed by weight (34 tries); a weighed
> plate now shows a weight and a line too light for it says so. **FUNNEL, the
> plate intro, is still won 95% by a line dropped on its plate** — seven honest
> redesigns measured 76–527 tries against its band of 16, so it is OPEN and
> the choice is the owner's: keep it, or make the plate intro honestly about
> the dropped line and give DROP a new question.
>
> **Status, 25 Oct. 45 levels; the curve capped at 60.** The difficulty
> research (reports/, docs/DIFFICULTY.md) set a 60-try ceiling with a watch
> list; level 1 was rebuilt as the teaching level (6 tries, a pencil shows the
> gesture) and THORNS eased from 89 to 48. Three bee VARIANTS fill slots 22,
> 23 and 26: LOG (HIVE's question, a door instead of a cup), WINDOW (SWARM's,
> upright instead of flat) and the breather CHIMNEY (the nest in his chimney).
> Slot 29, the chapter's second breather, is open: every easy idea left
> repeats a decision AND a line shape already in the chapter. The real scale
> waits on real players (docs/PLAYGAMA.md).
>
> **Status, 18 Oct. BEES ADDED: 42 levels in seven chapters.** The case study
> (docs/CASE_STUDY.md) picked Save the Doge's swarm as the next element; it is
> built (js/bees.js) and has its own chapter, inserted as chapter 3 between
> PLATES & GATES and TNT — checked before moving anything: every built level
> stays inside its slot's band. Six bee levels pass every gate, are filmed won
> and lost, and fill slots 21, 24, 25, 27, 28 and 30 (SWARM, STAIRS, DOGHOUSE,
> HIVE, TOP DOG, WALKIES); slots 22, 23, 26 and 29 are open. The game is now
> seventy slots; the other additions from the case study — variants, the star
> shop, reunion levels — come next.
>
> **Status, 15 Oct. DECIDED: playtest first, at 36 levels.** Added since the
> 13th: the dog (a second walker the line can steer) and its levels GOOD BOY,
> DOWN BOY, HEADS UP, INCOMING and STAY; the step-up fix (a straight ramp was
> a wall); the twin rule amended so a new element may re-ask an old question.
> Re-asks then ran dry — one keeper in seven sketches on the 14th, every dead
> one logged in docs/batch/levels.md — so content is frozen at 36 for the
> Saturday playtest, the time goes into the first ten minutes and a build
> that records tries per level, and the NEXT ELEMENT is chosen from what the
> playtest shows. The 24 open slots stay in `npm run curve` as the build list.
> **For Saturday:** the published page is the playtest build (it logs runs
> and time per level and shows them on the board); docs/PLAYTEST.md is how to
> run the session and what to send back.

**Status: APPROVED 2026-10-13, with the rewarded SKIP. In execution.** The
difficulty equation (4.2), the exact build list (4.4) and the skip design
(section 7) were added on approval.

Written after reviewing everything in this repository, from the first commit to
today. The review also produced a cleanup (commits `10c0d83` and `16cb3a7`):
29 shelved levels, a dead mechanic, three superseded drafts, the old roadmap
and 374 KB of unused code are gone, and the game is 21% smaller for it.

---

## The short version

**Can I make levels? Yes, and I want to.** 21 ship, and every one is filmed
being won and being lost. Production stopped for reasons that were my fault
and can be fixed (section 2):

- I ran out of ideas under a rule I wrote myself.
- I spent a week inventing machines the physics would not allow.
- I moved on to infrastructure without telling you that levels had stopped.
- I lost the TNT work by not committing it.

**How many: 60 at launch — six chapters of exactly ten.** 21 are built; 39 are
to build: 2 in chapter 1, 7 in chapter 2, 10 in chapter 3 (TNT), 6 in chapter
4, 7 in chapter 5 and 7 in chapter 6. Someone who plays
ten minutes a day gets roughly a week out of that. The first week is when a
habit forms or doesn't. 21 levels last about two sittings. After
60, a new chapter gets added only once players are reaching the end. (Section 3.)

**How:**
1. **A level is defined by the decision it asks for, not by its noun.** My old
   rule was "each noun has exactly one question". It capped the game at about 21
   levels. The new rule: no two levels ask for the same decision. The physics
   findings all stay. (Section 4.)
2. **Every slot has a measured difficulty target, from one equation.**
   `T(c, k) = 8.6 · 1.26^c · 4.0^p(k)`, fitted to the 21 levels that ship: each
   chapter starts 26% harder than the last, rises in a sawtooth to a boss four
   times its intro, with two hard levels in every ten and a breather after
   each. A new level is built to its slot's number and measured against it.
3. **One new noun gets a whole chapter: TNT.** The last chapter then combines
   it with every noun before it, because a new noun multiplies the old ones.
   TNT is already designed. The lost code is written into Appendix A so it
   cannot be lost twice.
4. **A production line with a 60-minute limit per level.** A level that has not
   passed in 60 minutes goes to `docs/HELD.md` with its reason, and the next
   idea starts.

**Who builds it:**
- Me, as producer and integrator.
- Three level-designer sessions working in parallel.
- One session on the game around the levels: chapters, a proper ending and a
  sound switch.
- The levelsmith reviewer, which rejects weak designs early. (Section 6.)

**When:**
- Wednesday: setup.
- By Saturday 17: 19 new levels (chapters 1–3, including all of TNT), then a
  checkpoint.
- By Tuesday 20: 20 more.
- Wednesday 21 Oct: a 60-level build ready to ship.
- If fewer than 12 of the first 19 pass, the target drops to 45 and nothing
  else changes. (Section 8.)

**What I need from you:**
1. Say go, or tell me what to change.
2. ~~Decide on a rewarded SKIP~~ — approved; designed in section 7.
3. 15 minutes to play each new batch of levels, plus two or three people who
   have never seen the game.
4. Ten minutes to upload the game to itch.io (`docs/launch/STORE_PAGE.md`).
   That gives YouTube a public link and puts the game in front of real
   players now.

---

## 1. Where we are

**The game, 2026-10-13:**
- 21 levels in four chapters, ordered by measured difficulty and held in that
  order by a gate.
- A daily challenge: one level a day, with less ink, from a 58-level deck,
  plus a streak.
- A level board, star ratings, an ending screen, cloud save, and an ad between
  every third level.
- The YouTube build is ready: 53 KB, interactive in 82 ms, every requirement a
  machine can check is passing with evidence. Playables access is still pending.

**What one person needs to come back, and what we have.** "One person" means:
on a phone, in the YouTube app, ten minutes at a time, often with the sound off.

| What they need | Today |
|---|---|
| It starts instantly | yes — 53 KB, 82 ms |
| A first win inside a minute | yes — the first three levels are the easiest band |
| They know why they lost | yes — the replay of the death, and a hint naming the problem |
| A reason to play one more | yes — instant retry, more stars for less ink |
| A reason to come back tomorrow | partly — the daily level and streak work; nothing says a new chapter is coming |
| **Enough to do when they come back** | **no — 21 levels is about two sittings; after that, one level a day** |
| Progress they can see | partly — stars and the board; no chapters, and an ending with no story |
| Control over sound | no — there is no sound switch |

The bold row is the one that loses players, and it is the job of this plan.

---

## 2. Why levels stopped at 21: my own review

The git history shows it plainly:

| When | What happened |
|---|---|
| 9–14 Sep | 15 levels, most of them in two days, built from the line, rocks and plates |
| 14–16 Sep | New nouns (air, spring, lever, balloon, downdraft) and the levels that ship today with them |
| 16–23 Sep, after SINK | **One level shipped (CRACK); fourteen built and shelved** |
| 27 Sep – 12 Oct | **No levels.** The daily challenge, the difficulty order, the YouTube build, the launch kit |
| 12 Oct | The TNT engine and its first level built, never committed, lost when the machine was recycled |

The causes, all mine:

1. **A rule I made up, applied too strictly.** "Each noun has exactly one
   question in it" was written to stop real twins, such as a lever level that
   was another lever level mirrored. It was right about those. Read strictly,
   it means each noun gets exactly one level. I even wrote it down as a
   finding: "twenty is where this vocabulary lands". The games that lead this
   genre use each element across dozens of levels. What they never repeat is
   the *decision* the player has to make.
2. **I tried to grow by inventing machines:** a wheel, a spring pad, a rock
   Milo pushes, a ramp up, two levers in a row. The physics refused most of
   them, for reasons that are real and now written down in `docs/HELD.md`.
   Each refusal cost hours to discover.
3. **I argued that "content was never the bottleneck"** and built the daily
   challenge instead of levels. That was half right. The daily brings a player
   back, but it gives them nothing to do once they are back.
4. **I went quiet.** The infrastructure was needed. I should still have said
   "no levels this week, and here is why".
5. **I lost a day's work** by not committing it. The rule to commit at every
   checkpoint now exists because of that.

What changes: the rule (4.1), where ideas come from (4.3), a limit per level
(section 5), parallel work (section 6), and a report of levels shipped at
every checkpoint (section 8).

---

## 3. How many levels, for one person

**What a sitting covers.** These are estimates, not measured with real
players; the first playtests will measure them.
- One attempt takes about 10 seconds: the freeze, drawing, the run, the result.
- Early levels take 1–3 attempts; late ones take more.
- 21 levels take roughly 15–25 minutes, failures included.
- So a ten-minute sitting covers **8–15 levels**.

**What follows from that:**
- **21 levels is about two sittings.** Someone who likes the game
  on day one has, on day two, one daily level and some stars to chase. That is
  where we lose them.
- **60 levels is five to seven sittings**, since later levels take longer: roughly the first week for someone
  who plays once a day. After that, the daily challenge and the three-star
  chase carry the long tail.
- **Money follows the same line.** With an ad between every third level, a
  player who finishes 21 levels sees 6 ads in total. One who finishes 60 sees
  19. The daily adds a third of an ad per day.

**Why not fewer:** 30–40 levels is three or four sittings, which still runs
out inside the first week.

**Why not more yet:**
- The success rate on new levels is unproven.
- We cannot yet measure whether anyone reaches the end.
- A chapter added after launch is itself a reason to come back.
- 100 or more levels makes sense only when players are finishing.

**The original documents agreed, before any of this was measured.** The first
design draft asked for 20–30 levels for a minimum version and 60 for the first
release. The Production Bible called 24 shippable and 60 the stretch goal.

**What the successful games launched with** (checked 14 Oct):

| Game | At launch | Afterwards |
|---|---|---|
| Angry Birds (2009) | 63 levels, three chapters of 21 | +42 two months later; hundreds since |
| Cut the Rope (2010) | 100 levels, four boxes of 25 | a new 25-level box every one to two months, each bringing a new element; 425 today |
| Where's My Water? (2011) | 80 levels, four chapters of 20 | 350+ added |
| World of Goo (2008) | 48 levels | 48: a paid game that never grew |
| Brain It On! (2015) | about 80 | plus player-made levels every day |
| Happy Glass (2018) | — | 500–620+, but hyper-casual: 10–20-second levels built from templates |

60 sits inside the range the hand-designed hits launched with (48–100),
closest to Angry Birds. None of them stopped at launch: the ones that lasted
added a chapter-sized update every month or two, and Cut the Rope's rule was a
new element in every box. So: **launch with 60 and the daily, then a new
10-level chapter with a new element about once a month.** And most players
never see level 60 anyway — puzzle games average roughly 32% of players back on
day 1, 12% on day 7 and 5% on day 30 (AppsFlyer averages, quoted second-hand),
so the first ten levels and the daily do more for retention than the sixty-first.

Sources: [Angry Birds](https://en.wikipedia.org/wiki/Angry_Birds_(video_game)),
[Cut the Rope](https://en.wikipedia.org/wiki/Cut_the_Rope) and its
[update history](https://cuttherope.fandom.com/wiki/List_of_updates),
[Where's My Water?](https://en.wikipedia.org/wiki/Where%27s_My_Water%3F),
[World of Goo](https://en.wikipedia.org/wiki/World_of_Goo),
[Brain It On!](https://www.moddb.com/games/brain-it-on),
[Happy Glass](https://www.gamedeveloper.com/design/happy-glass-design-analysis),
[puzzle retention](https://segwise.ai/blog/mobile-gaming-app-user-retention-strategies).

---

## 4. Where the 39 new levels come from

### 4.1 The rule change

**Old rule:** "each noun has exactly one question in it." That means one level
per noun.

**New rule:** every level asks for a **decision no other level asks for**. The
decision is the sentence a player would say when they work it out, such as
*"let the crate fall in, stop the rock"*.
- Two levels with the same sentence are twins, whatever their nouns or layout.
- Two levels with different sentences are not twins, even on the same noun.

The checks against twins stay, and get stricter:
- **The contact sheet.** Every opening frame on one grid, which catches
  look-alikes no single-level number can see.
- **The decision map** below: one level per cell, unless the sentence
  genuinely differs.
- **The levelsmith** checks `docs/HELD.md` first. A design that was already
  shelved gets rejected with the measured reason quoted.

**What does not change: the physics findings.** For example: a machine the
player cannot aim is not a level; the plate is a back door; a static noun can
never be a puzzle; a climb is too narrow a target. Those were measured, and
they still rule.

**Amended 14 Oct, approved: a new element may re-ask an old question.** Under
the rule above each new element gave one to three levels — the dog's own
second and third questions died in measurement (a pen is a needle; a trapdoor
is answered by a floor) and every other dog idea re-asked a question Milo had
already been asked. The games this one is measured against do the opposite:
every Cut the Rope box brings one new element and re-asks the familiar
questions with it. So a level whose new element changes how an old question
PLAYS may ask it again — "get the dog across" after "get him across" — on
three conditions:
- **It looks and plays differently on film**, not just in its numbers.
- **It passes every honesty check**: the A14 test (delete the element and the
  level changes) and the census (the element is in the wins).
- **Never the same question twice in one chapter.**

Two levels on the SAME element still need different questions.

### 4.2 The difficulty equation

**How the industry does it — not by feel.** The studios that lead level-based
puzzle games measure every level's difficulty as attempts per success (or its
inverse, the pass rate), predict it before release with simulated players, and
then correct it with real players' numbers. The published work on Candy Crush
does exactly this, and finds the simulated numbers least reliable on the
hardest levels. The progression they build is a sawtooth, not a straight line:
- in most games studied, **about one level in five is hard**;
- **King's first hard level is usually level 10**;
- **a breather follows a spike**, so the next challenge lands;
- combining mechanics, not adding more of them, is what makes later levels
  harder.

**Ours is built the same way.**
- **The measurement:** tries = 1 ÷ (share of strokes that win × share a shaky
  hand still lands). It is our attempts per success, measured by simulated
  players — the solver sweep and the hand model.
- **The target for slot k of chapter c** (both counted from 0):

      T(c, k) = 8.6 · 1.26^c · 4.0^p(k)

  | Slot | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
  |---|---|---|---|---|---|---|---|---|---|---|
  | Role | INTRO | develop | develop | develop | **SPIKE** | breather | develop | develop | breather | **BOSS** |
  | p | 0 | .20 | .35 | .50 | .80 | .30 | .55 | .70 | .45 | 1 |

  - 8.6 is the first level's target.
  - Each chapter starts 1.26× harder than the one before.
  - Inside a chapter, the boss is 4.0× its intro.
- **The three numbers are fitted, not chosen.** They are the least-squares fit
  to the 21 shipped levels, each kept in its own chapter, with the final boss
  held to 90–110 (the hardest shipped level measures 90).
  Every shipped level sits inside its slot's band. *(25 Oct: the original
  fitter searched placements and constants together and so could not fail;
  it was rewritten to measure the drift of the levels as placed — see
  CLAUDE.md, THE DIFFICULTY CURVE.)*
- **The band:** a level fits its slot within ×1.5 either way. An intro or a
  breather may be as easy as it likes, because an easy level is never a wall.
- **The result** *(superseded 25 Oct: every target is now capped at 60 — see
  DECISIONS D10)*: the game climbs from 9 tries to 109. The first chapter's boss
  sits at level 10, and every chapter starts below where the last one ended.
- **Enforced by `npm test`** (rule 5 of the difficulty gate).
  **`npm run curve` prints all 60 slots**, built or not, each with its target:
  that printout is the build list.
- **When real players exist, their attempts replace the simulated tries** and
  the equation is refitted. That is the correction step the industry runs.

### 4.3 The decision map

Rows are what goes wrong if the player does nothing. Each cell is a decision.

| If nothing is done… | Decisions that ship | New candidates |
|---|---|---|
| **a rock hits him** | block it · catch it high · stop it where it lands · send it away · meet it early · either side works · wedge the roller · break the air's delivery | shelter the whole stretch (ROOF) · let the friendly one through (DON'T) |
| **he falls** | bridge the gap · catch him · slide him down and across | turn the threat into the floor (FILL) |
| **the gate stays shut** | guide the rock to the plate · only the rock reaches it · drop your own line on it · put it in the air · finish the road · which side of the pin · steer what floats · where it pops · tip the pan | the plate that is a trap (WRONG PLATE) · which wind (TWO WINDS) |
| **he lands too hard** | catch him low | — |
| **it blows up** *(new)* | — | push it far away · park it at the fence · take cover · steer a floating bomb · and more in 4.5 |

The rule cut two of my own candidates while I was writing this. DOWN (build
him a way down into a pit) is the decision CARRY already asks: its certified
winner is a long slide down. UPSTREAM (kick the rolling rock up into the air)
is UPDRAFT's decision. Both are gone.

### 4.4 The chapters

The equation placed every shipped level. These are the slots, in play order,
with each empty slot's target:

| # | Chapter | Built (slot) | To build (slot: target tries) | New |
|---|---|---|---|---|
| 1 | THE LINE | WALL 1, HANG 2, REDIRECT 3, BRIDGE 5, SPRING 6, CHOOSE 7, WEDGE 8, INTERCEPT 9 | 4: 17 · **10 boss: 34** | **2** |
| 2 | PLATES & GATES | FUNNEL 11, TRIGGER 15, DROP 20 | 12: 14 · 13: 18 · 14: 22 · 16: ≤25 · 17: 23 · 18: 29 · 19: ≤30 | **7** |
| 3 | **TNT** | — | 21 intro: ≤20 · 22: 18 · 23: 22 · 24: 27 · **25 spike: 41** · 26: ≤31 · 27: 29 · 28: 36 · 29: ≤38 · **30 boss: 55** | **10** |
| 4 | AIR | DUCT 31, CATCH 35, UPDRAFT 37, RAIL 40 | 32: 23 · 33: 28 · 34: 34 · 36: ≤39 · 38: 45 · 39: ≤48 | **6** |
| 5 | BALLOONS | FLOAT 45, CARRY 48, SINK 50 | 41 intro: ≤33 · 42: 29 · 43: 35 · 44: 43 · 46: ≤49 · 47: 46 · 49: ≤61 | **7** |
| 6 | ALL OF IT | THORNS 55, CRACK 57, LEVER 58 | 51 intro: ≤41 · 52: 36 · 53: 44 · 54: 55 · 56: ≤62 · 59: ≤76 · **60 boss: 109** | **7** |
| | | **21** | | **39** |

- **Chapter 5 needs a new balloon intro** at 33 tries or fewer. FLOAT measures
  61, too hard to teach the balloon, so it becomes the chapter's spike and a
  gentler level takes the intro. The equation found this; nobody had to guess.
- **TNT sits in the middle** so its levels are middle difficulty, which is what
  the curve lacked, and so a new noun arrives in a player's second or third
  sitting, when interest would otherwise fade.
- **Chapter 6 combines nouns the player has already met** and ends on WELL
  DONE, the one level built as a spectacle. Its levels are the hard ones, so it
  is the first place the cut line falls.
- **A level's slot can change** if it measures elsewhere on the curve. The band
  decides where it goes, not the brief.

### 4.5 The first briefs

Confidence means my honest guess that the idea survives its gates.

| Working name | Slot | The decision | The trap | Conf. |
|---|---|---|---|---|
| ROOF | 4 | rocks fall along his path; shelter the whole stretch (watch for a twin of WALL on the contact sheet) | blocking where the first one lands | M |
| DON'T | 10 boss | a crate and a rock fall; the crate plugs the hole; stop only the rock | blocking everything | M |
| FILL | 2nd chapter | the rock that would hit him is the only thing that fills the hole; one ramp does both | blocking it | M |
| WRONG PLATE | 2nd chapter | two plates: one opens the gate, one opens the floor under him (an opened gate vanishes, so a gate set into the floor is a trapdoor with no new code). The right plate needs a lid, or a dropped line wins | the nearer plate | M |
| KEEP AWAY | 21 intro | the barrel rolls toward him: stop it *far* away. This is the chapter opener | stopping it at his feet, which is still inside the blast | H |
| FENCE | 3rd chapter | park the barrel at the fence, away from him (built 12 Oct: 2.1% win rate, 5 families) | stopping it too early | M |
| BUSTER | 3rd chapter | a boulder blocks the path; get the barrel to it. The same decision as FENCE, so only one of the two ships | stopping the barrel | — |
| TAKE COVER | 3rd chapter | build him a wall the blast cannot pass (needs the blast to respect walls, a small engine addition) | running from it | L |
| TWO WINDS | 4th chapter | two leaning columns: one carries it to the plate, one drops it on him | the nearer column | M |
| BALLOON BOMB | 5th/6th | a balloon carries the barrel up; steer it so it is at the shelf when it goes off | letting it float | M |
| AIR BOMB | 6th chapter | the wind carries the barrel to the fence. RAIL's decision with a bomb in it, so it ships only if the fuse changes the decision | stopping it | L |

**That is 11 named ideas, and I expect about half to pass.** The other 30-odd
levels have to come from two places:
- **Sketching sessions on the map's empty cells.** Each designer sketches two
  or three designs per slot, and the levelsmith and the structure check reject
  most of them in seconds. Sketches are cheap; full measurement runs are what
  take time.
- **TNT combined with each earlier noun:** the line, the plate, air, the
  balloon, the lever and the brittle floor.

This is the plan's biggest risk. If TNT turns out as narrow as the balloon did,
60 becomes 45. Batch 1 contains the whole TNT chapter, so checkpoint 1 will
tell us.

### 4.6 Why TNT

- **It acts.** A static noun can never be a puzzle, because the player can draw
  anything static. TNT passes that test.
- **It is in the title.** The game is called COOKED.
- **It makes the best thumbnail** of anything in the game.
- **The blast creates several different decisions:** where it stops, how far
  away he is, what it breaks, and what shelters him.

The design and the lost code are in Appendix A.

---

## 5. The production line

Every level goes through the same steps.

| Step | What | Cost |
|---|---|---|
| 0 | **Brief:** chapter, its cell in the map, the decision sentence, the trap, the hint (names the problem, never the solution), target difficulty | — |
| 1 | **levelsmith** says rejected, risky, or worth measuring | 2 min |
| 2 | Build the level data in the chapter's own file | 15 min |
| 3 | `npm run levelcheck -- <id>` — doing nothing must fail with an explanation; the freeze lands before the danger; the delete-the-noun test (named A14 after the level that failed it) | seconds |
| 4 | `npm run solver -- <id>` — share of winning strokes, precision, solution families, wobble | ~1 min |
| 5 | `npm run certify -- <id>` — a winning stroke that survives a shaky hand | ~1 min |
| 6 | **Watch the certified winner:** is the noun actually part of the win? (CRACK passed every gate while it wasn't) | 2 min |
| 7 | `npm run film -- <id>`, then with `FILM_IDLE=1` — read the winning film **and** the losing one | 3 min |
| 8 | `npm run frozen` — does its opening frame look like any other level? | 1 min |
| 9 | Place it by its tries; `npm test` (the difficulty gate) | 2 min |
| 10 | Commit and push | — |

- **Time limit: 60 minutes from step 2 to step 10.** At the limit the level is
  held, with a three-line entry in `docs/HELD.md` (what it was, the measured
  reason, whether the idea is worth another try), and the next brief starts.
  No level gets a second hour unless it is the last idea for its cell.
- **Done** means: every gate passes, both films have been read, its opening
  frame is not a twin of another level, and it has survived its batch's
  playtest.
- **Logged for every level:** minutes spent and pass or hold. Those two numbers
  decide the checkpoint.

---

## 6. Who does what

| Role | Who | Owns | Why it exists |
|---|---|---|---|
| **Producer & integrator** | this session | this plan, the list of briefs, the level order, the generated data (difficulty data, certified solutions, the daily deck), merging, final review, reporting to you | The shape of the whole set (twins, the difficulty curve, the daily) is invisible to any one level's checks; one owner has to see all of it. And generated files conflict if two sessions write them. |
| **Level designer A** | parallel session | the TNT engine (Appendix A), then chapter 3 | TNT is a chapter of its own, and its engine touches the simulation, which only one session may edit |
| **Level designer B** | parallel session | chapters 1 and 2, then chapter 4 | the middle-difficulty levels the curve lacks most |
| **Level designer C** | parallel session | chapter 5, then chapter 6 once TNT has landed | the balloon chapter needs a new intro, and chapter 6 needs TNT |
| **Shell engineer** | parallel session | the menus, ending, progress and HUD code | Chapters, the ending and the sound switch live in different files from the levels, so this work never collides with theirs |
| **Levelsmith** | a cheaper, faster model, as a reviewer | nothing; it only gives a verdict | It rejects a design for pennies before a full measurement run is spent on it |
| **Playtest** | you, plus two or three people who have never seen it | the final verdict | The only check that measures whether a level makes sense to a person |

**Who touches which files**, so no two sessions edit the same one:

| Session | Owns |
|---|---|
| Designer A | the simulation, renderer, replay and audio engine files (for TNT), plus the chapter 3 level file |
| Designers B and C | only their own chapter level files, plus their chapter's line in the chapter table |
| Shell engineer | the menus, progress, HUD, board and ad-test files |
| Integrator | the generated data files: difficulty, certified solutions, daily deck |

Every chapter has its own file under `js/levels/`. The chapter table in
`js/levels.js` places each new level into its slot, one line per chapter.

**Running now** (started 2026-10-13, from `claude/game-markdown-review-23hf3j`):

| Session | Branch | Session id |
|---|---|---|
| Designer A — TNT engine, chapter 3 | `claude/designer-a-tnt` | session_01HoXeLoNWvEZMhJC8UdKQJ2 |
| Designer B — chapters 1, 2, 4 | `claude/designer-b-ch124` | session_01JWBNAsip61Q55nREp6hS4h |
| Designer C — chapters 5, 6 | `claude/designer-c-ch56` | session_01TTGN4vq2wjVE5n957hL1vG |
| Shell engineer — skip, unlocks, chapters, ending, sound | `claude/shell-skip-chapters` | session_011isBfgKwwg8hhZSG2j9AJQ |

Each keeps a log at `docs/batch/<name>.md` on its branch.

**Each integration pass:**
1. Fetch every branch and merge into the integration branch, with designer A's
   engine first.
2. Regenerate any conflicting generated file by re-running the tool for the new
   ids.
3. Run `npm test` and `npm run curve`, then film every new level both won and
   lost, read the contact sheet, and check each new level's decision sentence
   against every other.
4. Commit, push, and tell designer C when TNT has landed.

**How the sessions coordinate:**
- Each session pushes to its own branch.
- I merge, regenerate the generated files by re-running the tools, run every
  check, film, and push.
- The sessions do not talk to each other.

**A past decision this replaces.** Decision D8 said "no AI sub-agents… one
owner, one tool", because a fresh session has to work everything out again.
That was true when the project's memory lived only in one session's head. Now
it lives in `CLAUDE.md`, `docs/HELD.md` and this plan, and every session reads
them. On your approval, this section replaces D8's last paragraph.

---

## 7. The game around the levels, and the money

**The shell engineer builds these, in order of how much they keep a player:**
1. **Chapters on the level board**, plus a one-line card when a chapter opens:
   *"CHAPTER 3 — TNT · it goes off wherever it is"*.
2. **The rewarded SKIP**, below.
3. **A real ending.** A stat card, as the Bible specified: *"Milo survived 60
   disasters. You drew 1,284 m of line. He nearly died 212 times."* It is the
   screen people will screenshot.
4. **"More coming"** on the ending, with the daily challenge as the reason to
   come back tomorrow.
5. **A sound switch.**

**The SKIP: approved, and built the way the successful games build it.**

What the research found:
- **The fail screen is the moment to offer help.** It is when the player is
  most motivated, and an offer there is taken far more often than a generic
  prompt.
- **Brain Test** (one of the biggest trick-puzzle games) skips a stuck level
  with a rewarded video, and pays out its daily challenge in the currency that
  buys skips and hints.
- **Happy Glass**, the closest game to ours, sells hints that show where to
  draw.
- **Platform guidance on rewarded ads:**
  - cap them and space them out;
  - never make an ad the only way forward, because when no ad is available the
    player is stuck;
  - never play an interstitial straight after a rewarded ad the player chose to
    watch;
  - never tune difficulty so players need ads to progress.
- **King's lesson from Candy Crush:** its hardest early level was its top
  earner *and* its top cause of churn. The release valve belongs exactly where
  the curve puts its walls.

So, for this game:

| Rule | What it does | Why |
|---|---|---|
| **On the fail card only** | SKIP is a small second button under TRY AGAIN; never before the first attempt, never mid-run | the moment of most intent; trying again stays the default |
| **Tied to the curve** | appears after **3 failures** on a SPIKE or BOSS, after **5** on any other level | the equation says where the walls are; that is where the skip earns its place |
| **Never on levels 1–3, never on the daily** | — | the first three teach the line itself; the daily streak must be earned |
| **Costs one rewarded ad, or one SKIP TOKEN** | finishing the daily challenge earns a token, up to 3 held | Brain Test's pattern: the daily pays the currency that buys skips, so the skip is also a reason to come back every day |
| **Never held hostage to ad fill** | if no ad is available, the skip is granted anyway | an ad must never be the only way forward |
| **No stacking** | a rewarded view resets the between-levels ad counter | the player who chose an ad does not get another one straight after |
| **A real lock behind it** | levels open in order: the next one opens when this one is beaten or skipped; existing saves keep everything up to their furthest level | today's open board would give away for free what the skip charges for; every game with a skip is linear |
| **Unfinished business** | a skipped level is hollow on the board, scores 0 stars, and stays playable; the ending counts it | the 3-star chase and the stat card bring them back for it |
| **No undo, no solution hints** | — | a paid undo sells the tension the game is built on, and a hint that shows the answer breaks the rule that hints name the problem |

There is no cap beyond those thresholds. Each skip already costs three to five
real failures plus an ad or a token. In a linear game, a cap would strand a
player at exactly the wall the skip exists for. The sawtooth puts a breather
or a new chapter's intro after every hard level, so skips gather where they
were designed to.

**Revenue.**
- **YouTube Playables:** the revenue share is a limited pilot whose terms
  aren't public.
- **The open web is the second channel.** itch.io is ready to go now. Web game
  portals that share ad revenue are a later option. They would need their own
  version of the build, and I would check their current terms before
  proposing one.

**Data.** Only people can tell us whether a level makes sense.
- **My recommendation now:** a playtest after every batch of levels.
- **Optional:** analytics on the web version only, which needs you to create a
  free account with an analytics provider. The YouTube build would still make
  no network calls at all; the build check enforces that.

---

## 8. Schedule, checkpoints, cut lines

| When | What | Done when |
|---|---|---|
| **Tue 13 Oct** | Done: the difficulty equation, the 60-slot build list, the skip design, sessions started | `npm run curve` prints 21 built, 39 to build |
| **Wed 14 Oct** | TNT engine and its physics test (designer A) | TNT filmed going off |
| **Thu 15 – Sat 17** | **Batch 1:** 19 new levels — chapters 1–3, including all 10 of TNT — plus the skip, chapters and the ending | merged, difficulty gate passes, films read |
| **Sat 17** | **Checkpoint 1:** pass rate, minutes per level, your playtest | decision: continue to 60, or cut to 45 |
| **Sun 18 – Tue 20** | **Batch 2:** 20 new levels — chapters 4–6 | merged |
| **Wed 21 Oct** | **Ready to ship:** every level filmed won and lost, the contact sheet, the daily deck rebuilt, certification re-run, both ZIPs | the ZIP is in `dist/` |

**Cut lines, decided now rather than later:**
- **Per level:** 60 minutes, then it is held.
- **Checkpoint 1:** if fewer than 12 of the first 19 pass, or a passing level
  costs more than 90 minutes, the target becomes 45. The cut comes out of
  chapters 4–6, chapter 6 first, and nothing else changes.
- **Playtest:** a level a player cannot read gets held, whatever its numbers.
- **If Playables access arrives early:** ship whatever is complete and
  certified (never fewer than 31 levels: the 21 plus the TNT chapter) and add
  the rest as chapter updates.
- **Every change to the campaign reshuffles every future daily challenge.**
  Lock the campaign before launch, not after.

**At every checkpoint you get:** levels shipped against the plan, levels held
and why, minutes per level, what is blocked, and what I need from you, in ten
lines.

---

## 9. What does not change

- **Look at the running game.** Every level is filmed being won and being lost,
  and the films are read.
- **The checks stay:** win share, precision, solution families, wobble,
  surviving a shaky hand, the delete-the-noun test, and watching the
  certified winner.
- **A playtest overrules the automated checks.**
- **Commit and push at every checkpoint.**
- **The YouTube build makes no network calls**, `onPause` stops everything,
  and the game works at all nine screen shapes.
- **No reworking the 21 shipped levels.** They only move in the order. You
  said not to go back over past levels. The two shelved ideas used here (DON'T
  and FILL) are new builds of an idea whose shelving note said the idea was
  good, not repairs.

---

## Appendix A — TNT: the design that was lost, written down

Built 12 Oct, lost uncommitted with the machine. Re-apply exactly this, then
add a physics test (it blows at `fuse`, breaks what it should, kills inside
`kill`, spares outside it) before any level uses it.

**The noun.** A barrel with a lit fuse. It goes off at `fuse` ms **wherever it
is**:
- it breaks every `breakable` static within `radius`;
- it pushes every loose body away from it;
- it kills Milo if he is within `kill`.

The fuse was chosen over going off on impact for a measured reason. A line
catching the barrel hits it at a normal speed of 359–479, while a delivery to
the fence hits at 336, so an impact trigger would go off in the player's hands.

**Code, by file:**
- `js/constants.js`: `export const TNT = { radius: 130, kill: 90, push: 600 };   // TUNE`
- `js/run.js`: `createRunState()` gains `cause: null`.
- `js/physics/causality.js`: `explain(c, reason, culpritId, stroke = null, cause = null)`;
  before the "Killed" branch: `if (cause === 'blast') return { label: 'HE WAS TOO CLOSE', culpritId };`
- `js/sim.js`: imports `setStatic` (adapter) and `TNT` (constants); the sim
  gains `detonated: new Map(), broken: new Map(), blasts: []`; `stepSim` calls
  `detonate(sim)` after `applyLift(sim)`; `sim.run.cause` is passed to
  `explain`.

```js
function detonate(sim) {
  for (const [id, o] of sim.objects) {
    if (o.spec.type !== 'tnt' || sim.detonated.has(id) || sim.simTime < o.spec.fuse) continue;
    const { x, y } = o.body.position;
    const R = o.spec.blast?.radius ?? TNT.radius, K = o.spec.blast?.kill ?? TNT.kill, P = o.spec.blast?.push ?? TNT.push;
    sim.detonated.set(id, sim.simTime);
    sim.blasts.push({ id, x, y, t: sim.simTime, radius: R, kill: K });
    setStatic(o.body, true); o.body.collisionFilter.mask = 0; o.body.collisionFilter.category = 0;
    for (const st of sim.statics) { const s = st.spec;
      if (!s.breakable || sim.broken.has(s.id)) continue;
      const nx = Math.max(s.x, Math.min(x, s.x + s.w)), ny = Math.max(s.y, Math.min(y, s.y + s.h));
      if (Math.hypot(nx - x, ny - y) >= R) continue;
      sim.broken.set(s.id, sim.simTime); st.body.collisionFilter.mask = 0; st.body.collisionFilter.category = 0; }
    for (const b of allBodies(sim.ctx)) {
      if (b.isStatic || b.isSensor || b === sim.milo.body) continue;
      const dx = b.position.x - x, dy = b.position.y - y, d = Math.hypot(dx, dy);
      if (d >= R || d < 1e-6) continue;
      const k = P * (1 - d / R), v = getVelocity(b);
      setVelocity(b, v.x + (dx / d) * k, v.y + (dy / d) * k); }
    const m = sim.milo.body.position;
    const cx = Math.max(m.x - MILO.width / 2, Math.min(x, m.x + MILO.width / 2));
    const cy = Math.max(m.y - MILO.height / 2, Math.min(y, m.y + MILO.height / 2));
    const gap = Math.hypot(cx - x, cy - y);
    audio.blast();
    if (gap < K) { kill(sim.run, id); sim.run.cause = 'blast'; }
    else if (gap < K + NEAR_MISS_DIST * 2 && sim.run.outcome === OUTCOME.RUNNING) {
      sim.closeCalls.push({ id, t: sim.simTime, gap: gap - K, speed: P, x: (x + m.x) / 2, y: (y + m.y) / 2 });
      audio.closeCall(P); }
  }
}
```

- `js/audio.js`:
  `export function blast() { if (!ok()) return; noise(0.55, 0.34, { type: 'lowpass', freq: 2200, sweepTo: 70 }); blip('sine', 62, 0.45, 0.28, { sweepTo: 28 }); }`
- `js/levels.js` `assertLevel`: an object of type `tnt` must have `fuse > 0`
  and `radius > 0`.
- `js/render/world.js`:
  - A broken breakable is drawn as a ghost outline. A shattered thing must
    leave a trace, or the level looks as if it never had one.
  - A breakable board is a plank fill with vertical lines every 11 units.
  - A live barrel: a red circle with two bands and "TNT"; a fuse whose length
    is 6 + 26 × the fraction of time left; a star-shaped spark.
  - After drawing Milo, for each blast: a scorch ellipse, then a 480 ms flash
    of the blast and kill circles with 12 ink rays.
- `js/render/deathcam.js` (anything not drawn here is **invisible** in the
  replay):
  - Import `PHYSICS_DT`; each frame's time is
    `sim.simTime - (nFrames-1-min(frameIdx,nFrames-1))*PHYSICS_DT`.
  - A breakable is gone once `sim.broken.get(id) <= tFrame`, and is drawn with
    a wood fill until then.
  - The barrel is a red circle with "TNT".
  - Once `bl.t <= tFrame`, draw the blast as a dashed ring at its radius plus a
    red ring at its kill radius.

**The first TNT level, FENCE (A51)**, best layout found:
- **Level:** hint "HE CAN'T GET THROUGH", verb BLAST, ink 900, freeze at 350 ms.
- **Milo** starts at (50, 1100); the **goal** is at (646, 1100, 70 × 140).
- **Ground:** (0, 1100, 720 × 180).
- **The fence:** ten breakable boards at x 560, y 460 + 64·i, 30 × 64.
- **The barrel:** at (460, 420), radius 22, density 0.03, restitution 0.05,
  friction 0.4, fuse 1500 ms, lethal: none.
- **Rough measurement:** 2.1% of strokes win, 5 solution families, precision
  65 units. Doing nothing ends in "HE WAS TOO CLOSE". The full checks were
  never run.
- Some winning strokes delay Milo rather than move the barrel. Decide whether
  that is a second answer or a hole.

**Open question for TAKE COVER:** the blast ignores walls. To let a wall
shelter him, check line of sight from the blast to Milo against static bodies
(Matter's `Query.ray`) before applying the kill. Measure first whether a
shelter wins on more than 40% of strokes, which would make it too easy.

---

## Appendix B — prompts you can paste

**Start or resume any session**
> Read docs/PLAN.md and CLAUDE.md. In five lines: where we are against the plan, what you will do next, and anything you need from me. Then do it.

**Approve**
> Plan approved. SKIP: [yes/no]. Start the setup, then the parallel sessions. Report at each checkpoint.

**Status, any time**
> Status in ten lines: levels shipped against the plan, held and why, minutes per level, what is blocked, what you need from me.

**After you play a batch**
> Playtest notes: [level name] — [what happened, where you got stuck, what you thought it wanted]. Fix it or hold it; do not argue with the playtest.

**Hold or cut**
> Hold [level]. Write the reason in docs/HELD.md and move to the next brief.

**Ship**
> Build the release: full films won and lost, the contact sheet, rebuild the daily deck, re-run certification, and give me the ZIP.


=================================================================
# FILE: docs/HELD.md
=================================================================

# HELD — the levels that did not ship, and why

Twenty-nine levels were built, measured and shelved. Their code was removed from
`js/levels.js` on 2026-10-13, because shelved data in the shipping bundle is
weight with no player and a file twice the length it needs to be. **Nothing was
lost:** every definition, with the design notes written above it, is in commit
`9c073b9`:

    git show 9c073b9:js/levels.js > /tmp/levels-before-purge.js

and the line given for each level below is where its `export const` starts in
that file. **The reasons are the part that was paid for**, and they are kept
here verbatim.

The constant names are creation order, not level numbers. The rule that comes
from this shelf — measure, then shelve with the reason, so it returns as a
better version rather than the same one — still stands. A level shelved from
now on is recorded here, not kept in the code.

## A lesson that moved, not a level

**A1 WALL used to teach anchoring by accident** — a line drawn floating, touching
neither shelf, fell with the ball and Milo died, and the old header called that
its bonus. On 25 Oct it was rebuilt as the teaching level (thick shelves, the
ball just above the slot): a floating line now falls INTO the slot and seals it,
so level 1 says only "your line is solid and stops things". Anchoring is taught
by A5 HANG, level 2, which was built to teach it. The old geometry is in any
commit before this note (shelves 90x32 and 100x32 at y 800, ball from y 300,
freeze 700ms).

## Worth a better build

The reasons for these three say the IDEA is good and the build was not.

| | Idea |
|---|---|
| **A16 DON'T** | the inversion — "the instinct you built is what kills him". Rebuild so the crate plugs the chasm completely and the level is purely the decision NOT to block. |
| **A14 REPURPOSE** | the rock that tries to kill him becomes his floor. Bring back once the two jobs read as one action. |
| **A7 SUPPORT** | anchor both ends or it is a see-saw. Bring back when the tip is telegraphed before it happens. |

## Index

| Level | Verb | Hint | Why it is held | Code at `9c073b9` |
|---|---|---|---|---|
| A6 `a6-step` | RAMP | HE CAN'T CLIMB THAT | Only passes with a 47u wall, barely above the 22u step-up — teaches nothing. **14 Oct: that was the step-up bug (a straight ramp read as a wall); a 50u ramp-up now measures 2.5–3.1%.** | line 275 |
| A7 `a7-prop` | SUPPORT | THE PLANK TIPS WHEN HE STANDS ON IT | Playtest: the plank reads as scenery. The tip is not telegraphed before it happens. | line 308 |
| A14 `a14-twojobs` | REPURPOSE | STOP THE ROCK. MIND THE HOLE. | Playtest: unclear. Its hint has to say two things — two puzzles in one level. | line 616 |
| A16 `a16-dont` | DON'T | THAT ROCK IS NOT YOUR PROBLEM | One stroke must cover two separate 31u gaps: 0u precision floor. | line 719 |
| A17 `a17-thread` | THREAD | YOU CANNOT DRAW IN THE RED | Playtest: "the worst idea we have ever had". A RULE (no-draw zone), not a thing. | line 768 |
| A18 `a18-updraft` | UPDRAFT | THE AIR HOLDS THINGS UP | A14 test: delete the air and nothing changes. Replaced by DUCT and UPDRAFT. | line 818 |
| A22 `a22-tip` | TIP | IT WILL TIP HIS WAY | On the pin the outcome is noise (39.4%); off it the lever is decoration. | line 1149 |
| A23 `a23-ride` | RIDE | IT WILL TIP UNDER HIM | Holding a pivoted arm up is not a playable verb (0.6%). | line 1214 |
| A24 `a24-mill` | MILL | THE MILL WILL THROW IT AT HIM | The wheel works; the 720-wide world is too small for it. | line 1268 |
| A25 `a25-vault` | VAULT | IT CANNOT CLIMB UP THERE | A spring needs a vertical arrival, and a stroke cannot give one. | line 1311 |
| A26 `a26-cascade` | CASCADE | BOTH OF THEM LEAN THE WRONG WAY | Two levers in series cannot both matter: the second can always be fed directly. | line 1386 |
| A27 `a27-blocked` | BLOCKED | HE CANNOT CLIMB OVER THAT | A21 LEVER mirrored — the same question asked twice. | line 1459 |
| A32 `a32-tip` | TIP | WHICH ARM CATCHES IT | A pop is not a vertical delivery, so a balloon cannot feed a see-saw. | line 1837 |
| A33 `a33-dip` | DIP | THE WIND CANNOT PUSH IT UPHILL | A wind road cannot climb: every unit of drop costs three of run. | line 1890 |
| A35 `a35-barrier` | BARRIER | IT CANNOT GET THROUGH THAT | Tuning for breadth made the column decoration (A14 test). | line 1995 |
| A36 `a36-spill` | SPILL | IT IS ALREADY LEANING AT HIM | A downdraft cannot threaten Milo — doing nothing won in three builds. | line 2048 |
| A37 `a37-thread` | THREAD | ONLY ONE WAY UP | The gap between two columns is crossed sideways, not climbed. | line 2106 |
| A38 `a38-fork` | FORK | THE NEAR ONE IS A DEAD END | A second chute does not survive the shield being short enough to draw. | line 2149 |
| A39 `a39-hatch` | HATCH | THERE IS A WAY THROUGH IT | No machine in it: strip the air and it plays the same. | line 2198 |
| A40 `a40-reach` | REACH | THE CATCH IS A LONG WAY OVER | A twin of A31 THORNS on the contact sheet. | line 2249 |
| A41 `a41-pinch` | PINCH | NOT MUCH ROOM UNDER THERE | Build one delivered itself; the second question never arrived. | line 2278 |
| A42 `a42-back` | BACK | IT HAS TO GO THE OTHER WAY | A40 mirrored — the A27 mistake with a balloon. | line 2313 |
| A44 `a44-burst` | BURST | THE HIGHER IT POPS THE HARDER IT LANDS | A brittle floor can be saved by not hitting it; the honest band is 50u wide. | line 2416 |
| A45 `a45-brake` | BRAKE | IT IS COMING DOWN TOO FAST | The column holds the rock for ever: BLOCK in a costume. | line 2462 |
| A46 `a46-hammer` | HAMMER | NOTHING FALLING THAT SLOWLY WILL GET THROUGH | MAX_SPEED is locked at 900, so "land harder" is not a mechanic. | line 2502 |
| A47 `a47-volley` | VOLLEY | IT COMES STRAIGHT BACK UP EVERY TIME | A spring pad is not a noun — the bounce is on the object — and a bounce is redundant with the stroke. | line 2536 |
| A48 `a48-lob` | LOB | IT CANNOT GET OVER THAT ON ITS OWN | Unsolvable: an angled bounce buys 84u of height. | line 2583 |
| A49 `a49-climb` | CLIMB | HE CANNOT GET UP THERE | A climb is structurally narrow: 0.2–0.3% across three geometries. **14 Oct: 1.3% with the step-up bug fixed — narrower than it should be, no longer a wall.** | line 2620 |
| A50 `a50-overhang` | OVERHANG | THAT ROOF IS IN THE WAY OF THE CLIMB | Unbuilt: Milo only walks right, so an eave has nothing to block. | line 2666 |

## The reasons, verbatim

### A6 — RAMP (`a6-step`)

> HE CAN'T CLIMB THAT

only passes with a 47u wall, barely above the 22u step-up — teaches nothing

### A7 — SUPPORT (`a7-prop`)

> THE PLANK TIPS WHEN HE STANDS ON IT

playtest: the plank reads as scenery, not as the thing you must hold up. The idea (anchor both ends or it is a see-saw) is good and the physics works; what is missing is any way to see that it is about to tip. Bring it back when the tipping is telegraphed before he steps on it.

### A14 — REPURPOSE (`a14-twojobs`)

> STOP THE ROCK. MIND THE HOLE.

playtest: "very unclear what the player is supposed to do", and it ends with Milo dead almost every time. Its hint has to say TWO things — "stop the rock, mind the hole" — which is the tell: it is two puzzles wearing one level. The rock-becomes-the-floor idea is worth keeping. Bring it back once the two jobs read as one action.

### A16 — DON'T (`a16-dont`)

> THAT ROCK IS NOT YOUR PROBLEM

the INVERSION is the best idea in the set and this is the wrong build of it. Measured 3.3% breadth and a precision floor of 0u — it fails even a 10u nudge — because winning means covering TWO separate ~31u gaps either side of the crate with ONE stroke. That is precise by nature: it is A14's two-jobs problem wearing a hat, and no amount of ink, a crate instead of a ball, or a cleaner landing moved it (10u -> 10u -> 0u across three attempts). The fix is not tuning. The crate must plug the chasm COMPLETELY so the level is purely about the DECISION not to block it, with no bridging to execute afterwards. Rebuild it that way.

### A17 — THREAD (`a17-thread`)

> YOU CANNOT DRAW IN THE RED

playtest, and correctly: "the worst idea we have ever had". Its constraint was a RULE (a no-draw zone) rather than a THING. Every other constraint in this game comes out of the physics — gravity, anchoring, the 22u step-up — and this one came out of me. Two red hatched boxes floating in a backyard read as a debug overlay, and beating it teaches "do not draw there", which is not a skill. denyZones stay implemented; they belong on something diegetic (a hot pipe, a hornet nest), never as a bare forbidden rectangle.

### A18 — UPDRAFT (`a18-updraft`)

> THE AIR HOLDS THINGS UP

the MECHANIC is sound and verified; this LEVEL is not. Built to introduce the updraft and the A14 test killed it in one run — deleting the air changed nothing, on every stroke tried, so the column was decoration. Two rebuilds where the air lifts MILO instead both failed on a real property of the mechanic: an updraft plus ANY ceiling pins him against it (measured: stuck at x=510 for every lid height and every sideways push from 280 to 400). A level where the air lifts him needs somewhere for him to LEAVE sideways under his own power, which airborne Milo does not have. Build it around lifting an OBJECT whose exit is geometry, not around lifting him.

### A22 — TIP (`a22-tip`)

> IT WILL TIP HIS WAY

CAUGHT BETWEEN TWO DEAD ENDS, and the A14 test named the second one. The rock has to land on the plank for the lever to route it. Land it ON the pin and the outcome is decided by noise: the level swept at 39.4% breadth, the loosest in the game, and its certified stroke won in the solver and lost in the browser TWICE on unchanged geometry, because a stroke redrawn with a mouse is never bit-identical and a balance point has no margin. Land it OFF the pin, as A21 does, and the pre-flight reports the pivot as decoration — correctly, because a STATIC plank tilted the same way sends the rock to the same end. A21 needs its pivot precisely because its static lean sends the rock the WRONG way, so the tipping is what saves it; nothing here has that property. Three attempts, and the mechanic is fine — it ships in A21. Bring this back only with a shape where a fixed plank and a free one give different answers.

### A23 — RIDE (`a23-ride`)

> IT WILL TIP UNDER HIM

HOLDING A PIVOTED ARM UP IS NOT A PLAYABLE VERB, and this is the second time this project has found that out. A7 was held on playtest for the same shape — "the plank reads as scenery, not as the thing you must hold up" — and A23 puts a number on it: 0.6% breadth against a 2% floor, the narrowest measurement taken here, unchanged across two geometries. It was also the failure mode of the first solutions tried on A21, where props either missed the plank underside entirely or jammed the rock against it at -34deg. The reason is structural: a drawn line is STATIC and the arm is MOVING, so the player is asked to guess where a moving thing will be. Every other stroke in this game acts on something falling or rolling along a path you can read off the frozen frame. The lever itself is fine and ships twice (A22, A21) — what does not work is being asked to hold one. Bring this back only with a mechanism that LATCHES, so the player acts on something stationary and the arm is held by the world rather than by their aim.

### A24 — MILL (`a24-mill`)

> THE MILL WILL THROW IT AT HIM

THE MACHINE WORKS; THE WORLD IS TOO SMALL FOR IT. Five designs, and the physics was never the problem. Findings, so none of this is paid for twice: a wheel must OUTWEIGH what it throws — at mass 30 against a 36 rock it stalled, reversed to -0.0072 and flung the rock out of the world, while at 252 it carried through cleanly; the free spin that ruins a see-saw is exactly what a wheel wants; and a heavy enough wheel throws EVERYTHING far, so the throw distance cannot be the puzzle. Asking the player to AIM it — nudge the rock into a feed band, catch the right blade phase, land it somewhere — is three conditions in series and swept at 0.9% breadth against a 2% floor. (An earlier cut measured 20.4%, but that was the bypass: the certified solution came back anchors=0, an unanchored line dropped straight on the plate, with the mill as scenery.) Turned round as a HAZARD it throws too fast and too flat to catch a walking man: eight combinations of spin and hub position, and the closest it ever came to Milo was 51 units. The engine support (addCross, spin, bladed rendering) is sound and stays. Bring the wheel back for something that does NOT need aiming and does not need it to hit a moving target — a mill that turns something, or a hazard that sweeps a place he must cross rather than one that has to intercept him.

### A25 — VAULT (`a25-vault`)

> IT CANNOT CLIMB UP THERE

THE SPRING NEEDS A VERTICAL ARRIVAL AND A PLAYER CANNOT GIVE IT ONE. A bounce is made of speed INTO the surface, so every ramp that feeds a board delivers the ball sideways and there is nothing left to bounce with. A tilted board fixes the launch (measured 10deg at 0.8: rises 115u, travels 255u right — 20deg leaves the world) but not the arrival. A funnel to verticalise it got breadth from 1.2% to 3.4%, and then the throat started catching the ball: with the board dead and the board springy the run ends identically, jammed at (398,967). Five shapes, and the noun ends up decoration. The real lesson is bigger than this level and is written up in CLAUDE.md: a machine that needs its input delivered in a particular DIRECTION cannot be driven by one static stroke. The spring works when the player only chooses WHERE something lands (A20) and fails whenever the level also needs to choose HOW it arrives.

### A26 — CASCADE (`a26-cascade`)

> BOTH OF THEM LEAN THE WRONG WAY

TWO LEVERS IN SERIES CANNOT BOTH MATTER, and the reason is geometric rather than tuning. A see-saw delivers off its END, which is by definition outside its own footprint, so the second lever has to sit offset from the first — and that offset IS a window to drop the rock straight onto lever two, skipping lever one. Measured: lever two is fully load-bearing (nail it down and all four winning strokes fail) while lever one is not (nailed down, three of four still win, because a ramp throws the rock past its right end at x=390 and it crosses the gap at x=467). A baffle closes the skip and closes the real route with it — three of the four winners died and lever one was STILL skippable on the survivor. Widening lever two only widens the window; covering it needs lever one to span the whole of lever two plus its own arms, which makes it asymmetric and it then tips under its own weight. A cascade needs a delivery that lands INSIDE the next machine, which a see-saw cannot give. Pair the lever with something that catches from above instead — a chimney or a funnel.

### A27 — BLOCKED (`a27-blocked`)

> HE CANNOT CLIMB OVER THAT

A27 IS A21 MIRRORED, which is the one fault no per-level gate can see. The same shaft, the same pivoted plank, the same pair of end-stops, the same 26-unit rock, and the same single question — which side of the pin does it come down on. Only the lean is reversed. Tiled beside A21 on the frozen sheet they are one level twice, which is exactly what the playtest meant by "too basic". It never got its failure to hold either. The untouched rock leaves the right arm with 800 units of drop behind it and FRICTION DOES NOTHING in this engine, so nothing stops it: it rolled to x=700, past the goal, and doing nothing WON. Measured kerbs — 14u and 18u were rolled straight over, 22u launched the rock out of the world at y=9711. A rock arriving that fast cannot be parked in a walkway by any obstacle low enough for Milo to step over. The finding worth keeping is the general one: WHICH SIDE OF THE PIN is the pivot's only question, and A21 already asks it. A second pivot level needs a different question, not a different lean.

### A32 — TIP (`a32-tip`)

> WHICH ARM CATCHES IT

A POP IS NOT A VERTICAL DELIVERY, and that kills the whole idea of feeding a machine with one. A burst balloon keeps every unit of horizontal speed the shield gave it, and the faster the shield made it travel the further it carries after bursting — measured at 330 units. So it cannot feed a see-saw. A ball that lands still moving rolls ACROSS the pin, and a see-saw amplifies the roll rather than resisting it: pops at x=319, x=404 and x=502 — two of them LEFT of a pin at 420 — all three tipped the plank RIGHT and all three delivered to the same pen. The landing side stopped deciding anything. The A14 test said it out loud when run by hand: nail the plank down and two of the four strokes are completely unchanged. A lever that half the solutions do not need is decoration, which is exactly the fraud A14 was written to catch. The general finding is worth more than the level. A28 LIP is the only true vertical delivery in this game — it works by stopping the cargo dead against a wall — and it is fixed in place by construction, so the player can never choose WHERE it happens. Until something can deliver from rest at a point the player picks, a see-saw cannot be the second machine in a chain. It also hid a staging fault worth remembering: the catch pen was walled from y=960 to 1080 and Milo stands 72 tall on ground at 1152, so its walls hung exactly into his headroom and blocked the goal. Every winning run reported timeout, not success.

### A33 — DIP (`a33-dip`)

> THE WIND CANNOT PUSH IT UPHILL

A WIND ROAD CANNOT BE ASKED TO CLIMB, and the arithmetic says so before any sweep does. A draught pushes a rock up a slope only while tan(angle) < ax/g, which at ax=600 against gravity 1800 is about 18 degrees — and there is no friction here to help. So every unit of drop costs THREE units of run to pay back, and the world is 720 wide. Forcing a dip with a hanging beam and then asking for a 70-unit climb needs 215 units of clear run after the beam; the geometry left 130. Widening it enough to be possible makes it a knife edge, which is the same shape of failure as A24 — the machine works, the world is too small for it. The build also had the beam as decoration and the trace said so: an untouched rock leaves the rail at x=217 and is already below y=750 by x=275, so it passes UNDER the beam without the beam doing anything. A hanging obstacle only obstructs if it reaches into the path the cargo actually takes, and in this engine a rock leaving a rail falls almost straight — measured, twice now. If this returns, the climb has to be the whole level rather than a complication added to one: a long shallow run with nothing else in it, and the question being whether the player can keep under 18 degrees for its whole length.

### A35 — BARRIER (`a35-barrier`)

> IT CANNOT GET THROUGH THAT

BREADTH TUNING HOLLOWED IT OUT, and only the A14 test could see it. This level passes every number — 2.4% breadth, 45u precision floor, wobble 1, four families, 26 of 42 winners hand-robust at 61.9% — and its downdraft column is DECORATION. Delete the zone and NOTHING changes: not the idle run, not the solved run. The way it got there is the lesson. Honest, the column was a wall a balloon cannot push through and the level was a detour around it — and it swept 0.2%, one win in five hundred strokes, because escaping meant being dragged the full 242-unit width of the column sideways while the air pushed down the whole way. Narrowing it to 138 gave 0.6%. Dropping the plate to meet the escape gave 1.3%. Moving the balloon to 40 units from the column edge gave 2.4% and a pass — and by then the balloon barely entered the column at all, so the column had stopped mattering. EVERY STEP THAT BOUGHT BREADTH SPENT MEANING, and the breadth gate cannot tell the difference. If it returns, the escape has to be short WITHOUT the column being easy to avoid — which probably means the balloon starts dead centre under a narrow column and the ramp is the only way out in either direction, rather than a nudge toward an edge it was already near.

### A36 — SPILL (`a36-spill`)

> IT IS ALREADY LEANING AT HIM

A DOWNDRAFT CANNOT THREATEN MILO, and three builds say so. Outside the column a balloon rises, so the moment it spills off either end of the pan its own lift carries it up and away from him — doing nothing WON every time. The fixes each moved the failure rather than removing it: extending the column to the ground made the balloon drift down at only 900 net and reach the floor at 2558ms, by which point Milo was already at the goal; tripling the column to 3000 made it fall fast but it spilled out of the right edge and floated off the top of the world; making the column asymmetric so one end stays inside it did not help either. The general shape: a downdraft only acts on its cargo INSIDE the column, and a column wide enough to hold the cargo all the way down to Milo is a column with no safe side left in it. That is the mirror of the trap already in the file — an updraft plus a ceiling pins MILO — and it means air levels stay non-lethal: a draught is a delivery mechanism, not a weapon. If it returns it needs the hazard to be something the column DROPS onto, not the cargo itself.

### A37 — THREAD (`a37-thread`)

> ONLY ONE WAY UP

A DOWNDRAFT IS GOOD AT HOLDING AND BAD AT BLOCKING, and this is the second level to prove it. Two columns with a gap make a doorway only floating things can feel, which reads well and does not work: the balloon arrives at the gap with the horizontal momentum the ceiling gave it, and it climbs far too slowly to get up through the gap before drifting into the next column. Traced at an 80-unit gap and again at 120 — x went 333, 360, 402, 450, 490 while y moved only 818 to 763. It crosses the doorway sideways instead of going up it. Two diagnostics worth keeping. A rising balloon meets the player line from BELOW, so the stroke is a CEILING, not a floor: the first four probes all steered it the wrong way because they were drawn as ramps. And a line touching no static geometry is not a ledge but a falling object — the posts had to run the full height of the column before any stroke could anchor at all. Put beside A34 SINK, which works, the rule is clear: a downdraft that HOLDS its cargo against a surface gives a clean decision, and a downdraft used as a WALL does not. Stop building walls out of air.

### A38 — FORK (`a38-fork`)

> THE NEAR ONE IS A DEAD END

A SECOND CHUTE DOES NOT SURVIVE THE SHIELD BEING SHORT ENOUGH TO DRAW. The idea was A31 inverted — the near opening a dead end and the plate in the far one, so stopping short is the mistake rather than overshooting — and it works by hand: a shield to x=430 drops the balloon in the bin, to 500 or 560 it makes the pen. It swept 0.0% anyway, one win in the whole space, because a winning shield had to span 220 units AND ride close to the thorns AND anchor to the jamb, and almost nothing in the plausible set does all three. Pulling the whole apparatus right to shorten the shield made it UNSOLVABLE instead: the balloon then starts so near the bin that every shield long enough to clear it is also long enough to overshoot the pen. The two chutes are the problem. A31 ships because its single chute is a wide target with slack on both sides; splitting that width in two leaves neither half big enough for the pop lag, which is roughly 50 units and varies with how fast the shield made the balloon travel. If it returns, it needs ONE chute and a different second outcome — a shelf, a drop, anything that does not eat half the landing zone.

### A39 — HATCH (`a39-hatch`)

> THERE IS A WAY THROUGH IT

NO MACHINE IN IT. Strip the lift AND the downdraft and the level plays exactly the same — idle stuck, solved success — so it is a ball rolling into a hole, which level 3 already is. It passed every number first (3.3% breadth, 45u precision floor, wobble 2, four families, 38 of 75 winners hand-robust) and the A14 test is the only thing that saw it. The distinction worth keeping, because A34 SINK is nearly the same picture and DOES work: a downdraft only earns its place when the cargo would otherwise LEAVE. In SINK the balloon would float straight off the pan without the column, so the column is what makes the pan a pan. Here the hatch does all the work — gravity alone holds a ball on a pan and a tilt alone slides it into a hole — so both the air and the buoyancy are along for the ride.

### A40 — REACH (`a40-reach`)

> THE CATCH IS A LONG WAY OVER

A TWIN OF A31, AND I SHIPPED IT — the contact sheet caught what the gates could not. Tiled beside level 19 THORNS it is the same picture: toothed ceiling, two-post bin with an arrowed plate, balloon low, Milo behind a gate. The numbers say the same thing louder — jamb 282 vs 300, thorns y 520 vs 560, chute 400/620 vs 410/668, floor y 860 vs 870, plate 418 vs 428, and the balloon starts at x=340 in BOTH. It is A31 shifted by ten to forty units. And it PLAYS the same, which is the part that settles it: the certified winners are both the bowl family, both horizontal at 0 degrees, both a shield slung under the thorns — 295u at y=488 against 246u at y=632. The claimed second question, how far the pop carries, is not asked: A31 starts its balloon 78 units from the chute mouth and this one 88. The warning was already in CLAUDE.md before it shipped, in my own words: the shield archetype produced five keepers and all five were NEAR-IDENTICAL to A31. I took one of those five, hand-finished it, and it passed every gate at 2.1% breadth and 62.2% hand-robust. The gates measure fair. They cannot measure whether the set already has this level in it. If it returns it needs a different QUESTION, not a shorter shield.

### A41 — PINCH (`a41-pinch`)

> NOT MUCH ROOM UNDER THERE

TWO ATTEMPTS SPENT AND THE SECOND QUESTION NEVER ARRIVED. A low ceiling over A40 REACH is less headroom for the same shield answering the same question. Build one delivered itself — the burst balloon drifted 330 to 459 and pressed the plate with no stroke at all, which is the pop-is-not-a-vertical-delivery rule biting from the other side. Build two moved the catch beyond that carry and swept 0.9% against a 2% floor. The guardrail is two attempts, then hold. The shield noun is DONE at two levels: A31 asks where the balloon bursts, A40 asks how far that burst carries. A third wants a third question, and neither of these has one.

### A42 — BACK (`a42-back`)

> IT HAS TO GO THE OTHER WAY

THE A27 MISTAKE, WITH A BALLOON IN IT. This is A40 REACH with the jamb moved from x=300 to x=600 and the whole apparatus mirrored around it, which is the same question — how far does the pop carry — asked a second time with the lean reversed. That is precisely what shelved A27, and the rule is already in this file: a second level on a noun needs a different QUESTION, not a different geometry. It also failed its gates (1.7% breadth against a 2% floor, 20u precision floor against the 25u thumb limit) but the numbers are not why it is here. Tuning it to a pass would have bought a level that passes and is a mirror.

### A44 — BURST (`a44-burst`)

> THE HIGHER IT POPS THE HARDER IT LANDS

THE WINNING SHIELD HAS A 50-UNIT BAND TO LIVE IN, AND THAT IS THE 20u PRECISION FLOOR. It must sit BELOW the low thorn bank (bottom 1006) so the balloon can still reach the bank, and ABOVE the balloon top (1056) so the balloon meets it at all. Fifty units is not a band a thumb can find, and no amount of tuning moves it because both walls are what the level IS. Three attempts, all measured. The first build shipped a different bug and it is the one worth keeping: the certified winner popped the balloon and flung it RIGHT onto 80 units of solid ground past the pit, landing at x=616 with the plank never touched — 6.9% breadth, four families, 45u floor, and the brittleness pure decoration in the solved run. Removing the escape fixed the honesty and exposed the band. Shortening the required stroke (balloon 520 to 470) did not move the floor; widening the anchor made it UNSOLVABLE, because a jamb wide enough to grab is wide enough to block the route. If it returns, the two banks have to be much further apart vertically so the shield has real room — which probably means the low bank is a floor the balloon rests under, not a ceiling it squeezes below.

### A45 — BRAKE (`a45-brake`)

> IT IS COMING DOWN TOO FAST

THE COLUMN HOLDS THE ROCK UP FOR EVER, SO THE LEVEL IS BLOCK IN A COSTUME. An updraft at -2400 against gravity 1800 is net 600 UP, so a rock steered into it never comes down: the certified winner ends at y=723, floating inside the column, and the plank survives because nothing ever touches it. Brittleness is decoration in the solved run, which the A14 test cannot see because it compares outcomes and the IDLE run still changes. It swept well first — 5.0% breadth, four families, 45u floor, 48.8% hand-robust — which is exactly why tracing the certified winner is not optional. A column weak enough to let the rock through (|accel| under 1800) does not brake it either, because MAX_SPEED is locked at 900 and a long drop is already AT the clamp before it enters. If it returns it needs a column that reaches the plank and is too short to stop anything.

### A46 — HAMMER (`a46-hammer`)

> NOTHING FALLING THAT SLOWLY WILL GET THROUGH

MAX_SPEED IS LOCKED AT 900, SO "LAND HARDER" IS NOT A MECHANIC. Every dynamic body is clamped — the constant is locked because at 120Hz, 900 u/s is 7.5 units of travel per step against a 16-unit line, so raising it lets things tunnel through the player stroke. The first build asked a downdraft to drive a rock through a lid at 1100 and swept 0.0%: measured, a drop beside the column and a drop inside it BOTH arrived at exactly 900. A downdraft cannot make a fall harder than the ceiling, only reach the ceiling SOONER. That salvage works and was measured — shorten the drop to 138 units and free-fall arrives at 582 while the column arrives at 781, which a 720 threshold separates cleanly. It swept 0.0% anyway, 1276 stuck, because THE TWO REQUIREMENTS FIGHT: the fall has to be short for the column to matter, and a short fall leaves no room to steer the rock sideways into it. Two conditions in series, which is what killed the wheel. The general form is worth more than the level: in this engine a brittle threshold can only ever ask to land SOFTER, never harder, because the hard end is a locked constant.

### A47 — VOLLEY (`a47-volley`)

> IT COMES STRAIGHT BACK UP EVERY TIME

THE SPRING PAD IS NOT A NOUN IN THIS ENGINE, AND THE BOUNCE IS REDUNDANT WITH THE STROKE. Two findings, both measured, and between them they close the whole idea. FIRST: the bounce is on the BALL, not the pad. A pad at restitution 0.85 rebounds a ball of 0.1 by ONE unit; the same ball at 0.85 rebounds 150, off any surface at all. Measured across drop heights 1090 to 600 — a vertical drop never bounces, at any speed, because the number that matters is the one on the object. So a spring PAD cannot carry a level, and levelcheck said the pad was decoration the moment it was asked. SECOND, and fatal: with the pad gone and the bounce on the ball, the A14 test says the BOUNCE is decoration too — a drawn ramp rolls the ball to the same shelf and no bouncing is needed. Cutting the ink from 320 to 130 to make that ramp unaffordable did not change it: still decoration, and the families collapsed from five to one. A bounce gets a ball UP and ACROSS, and those are the two things a static line already does. It also ate the plate back door in passing: the first build swept 19.3% at 86.4% hand-robust and its certified winner was an UNANCHORED bowl with zero anchors, dropped straight onto the plate while the ball never left x=360. A lid fixed that and took breadth to 3.6%, which is what the file already says closing that door costs.

### A48 — LOB (`a48-lob`)

> IT CANNOT GET OVER THAT ON ITS OWN

UNSOLVABLE — 0.0%. An angled bounce buys only 84 units of height, which is not enough to lob anything over a wall worth having. Held with A47, whose reason explains why no spring level works.

### A49 — CLIMB (`a49-climb`)

> HE CANNOT GET UP THERE

A CLIMB IS STRUCTURALLY NARROW, AND THIS FILE ALREADY SAID SO. It is solvable and clean — three hand-drawn ramps win, 30-45u precision floor, wobble 0 — and it swept 0.2%, then 0.3%, then 0.3% again across three geometries. Five wins in 1820 plausible strokes every time. The reason is already recorded under A2, which was the hardest level in the game at position TWO on 1.1% breadth: descending is free, climbing is gated by the 22u step-up, and what fixed A2 was DROPPING the far bank so the crossing became a descent. A ramp that has to meet the ground at one end and a ledge at the other inside a 20-38 degree window is a needle in the stroke space, and neither shortening it (265u to 163u) nor removing the pit moved the number by a single win. Two real bugs were found on the way and are worth keeping. The first build put the goal 392 units up behind a stub at y=1010 that Milo could not step onto at all. The second had the goal box sitting exactly where the ramp lands, so the solver threw out nearly every candidate with "overlaps-goal" BEFORE simulating it — a level can sweep 0.0% with nothing whatever wrong with its physics. Check the rejection reason before believing an unsolvable verdict.

### A50 — OVERHANG (`a50-overhang`)

> THAT ROOF IS IN THE WAY OF THE CLIMB

Held unbuilt with A49 — the overhang needs the approach blocked on the side Milo actually walks in from, and he only ever walks right, so the eave has nothing to block.

## Shelved after the plan (2026-10-13 on)

### A110 TAILWIND — the barrel, the wind and the fence (chapter 6 boss attempt)

**Idea.** A wooden fence shuts him in and only a blast opens it. The barrel
lands in front of him; rolled along the ground it is too slow for its fuse, and
holding him back does nothing because the fence needs the bomb. A low draught
just over his head blows whatever is fed into it to the foot of the fence.

**Measured.** Passed every gate: 2.5% breadth, 34% hand, 65u floor, wobble 2,
4 families — 117 tries, the final boss's band. **The A14 test failed it**:
the certified winner, an anchored arc from the shelf, wins with the draught
deleted. The arc is a LAUNCH RAMP — the barrel gains speed rolling off a shelf
and flies to the fence by itself. With the draught removed the level keeps 66
of its 76 wins: the wind decides 13% of them. "Too slow" was true of a ground
roll, not of a ramp falling from a shelf.

**To bring it back:** take away the height a ramp could launch from — no shelf
over the barrel's fall, or a fence too far for a throw (a launched barrel flies
~150u) — and the wind becomes the only road again. Check with the census, with
the draught deleted, before anything else.

```js
{ id: 'a110-tailwind', hint: 'IT HAS TO GET THERE BEFORE HE DOES', verb: 'TAILWIND', world: 'backyard',
  milo: { start: { x: 60, y: 1152 }, speed: MILO.speed }, freezeAt: 400,
  goal: { id: 'goal', x: 662, y: 1152, w: 70, h: 140 },
  static: [ground 0,1152,720x128; shelf 0,760,262x20;
           boards at x 560: 760 h70, 830 h70, 900 h70, 970 h70, 1040 h112, all breakable],
  objects: [{ id: 'tnt', type: 'tnt', x: 300, y: 520, radius: 22, density: 0.03, fuse: 1500 }],
  zones: [{ id: 'draught', kind: 'updraft', x: 330, y: 940, w: 200, h: 120, accel: -2400, ax: 900 }] }
```


=================================================================
# FILE: docs/DIFFICULTY.md
=================================================================

# DIFFICULTY — how hard each level is, and how we will find out for real

*Written 25 Oct 2026 from `reports/Progressive difficulty in puzzle games.md`,
which has every source. Plain language first; the code is named at the end.*

## The short version

- The curve's **shape** is right. It matches what textbooks teach and what King,
  Rovio, Playrix and Royal Match do.
- Its **numbers** are a ranking, not a measurement. They come from a computer
  drawing random lines, not from people.
- So: the top is capped at 60, level 1 is the easiest level, and the real scale
  will come from real players' attempts (Playgama, or the playtest board).

## What our number is

Every level has one number, **tries**. The solver draws a few thousand plausible
lines and counts how many win (that share is *breadth*). It then redraws each
winner with a shaky model hand and counts how many still win (the *hand rate*).

    tries = 1 / (breadth × hand rate)

Read it as "how many random-but-sensible lines you would expect to draw before
one works". Level 1 is 6. The hardest level today is 71.

**What it is not.** It is not how many attempts a person needs. A person who
reads the level aims, and needs far fewer. A person who misreads it can need
more. Nobody yet knows the exchange rate between the two, and finding it is the
whole job of the next step.

## What professionals do

Studios measure every level as **attempts per success** (King: passes per 100
attempts). Before release they predict it with bots trained to play like
people, and after release they always correct the bots with real players.
Their best predictors still miss by 4–7 percentage points. Playrix: "quite
often a level seems perfect, but players show that it's not good."

Typical targets, in *human* attempts:

- easy levels: about 1–5;
- hard levels: 20–35 in match-3;
- King makes a level easier once it passes about 50.

Those hard numbers exist because match-3 games sell extra moves when you fail.
This game sells nothing on failure. It earns when levels are *finished*, so its
spikes should be shallower.

## The curve

**Seventy slots in seven chapters of ten.** Every chapter has the same rhythm:

    INTRO · DEVELOP · DEVELOP · DEVELOP · SPIKE · BREATHER · DEVELOP · DEVELOP · BREATHER · BOSS

That gives two hard levels in ten, with a rest after each, and a boss at
level 10. Each slot's target comes from one equation, which rises about 26% a
chapter and climbs within each chapter.

**The ceiling is 60 tries** (the owner's decision, 25 Oct). The equation
reached 138 for the final boss. The only human evidence we have, SINK called
"unplayable" at 90, says about 60 is already a wall. No target passes 60 now,
and no new level may measure above it. The eight levels still above 60 are on
a **watch list**: each may only get easier, and leaves the list when it drops
under 60. Those eight are TAILWIND 71, LEVER 69, RAIL 68, CARRY 67, CRACK 64,
WALKIES 62, PROTECT 62 and FLOAT 61.

**The gate** (`npm run curve`) fails the build if any of these breaks:

1. Levels 1–3 are easy (15 tries or fewer), and level 1 is the easiest of them.
2. Every new thing (air, dog, bees, TNT…) is first met on the easiest level that uses it.
3. No level is more than 3× the four before it (a wall).
4. Each third of the game is harder than the one before.
5. Every level sits within ×1.5 of its slot's target. Intros and breathers may be easier.
6. Nothing new above 60, and a watched level never gets harder.

**Changed on 25 Oct:**

- **Level 1** went from 11.7 to 6.0 tries. It was the hardest of the first
  three; now it is the teaching level, and a pencil shows the gesture.
- **THORNS** went from 89 to 48, by raising its thorn roof.

## How sure is each number?

A level's number rests on its hand-robust winning lines. With *R* of them, the
error is about ±1/√R:

- Level 1 rests on about 360 of them, so it is known to ±5%.
- CRACK rests on 8, so it is known only to ±35%, which is as wide as its band.

`npm run curve` prints this noise beside every level. On the hard levels, noise
and band are the same width, so the gate cannot yet tell a sawtooth from a
plateau.

## How real players replace the simulated numbers

1. **Collect runs.** Use the Playgama Sandbox build (`docs/PLAYGAMA.md`) or the
   playtest board. For every player on every level, record how many runs they
   made and whether they won. Players who quit or skipped must be included.
   Leaving them out flatters exactly the levels that stop people.
2. **Turn runs into one number per level.** Divide all runs by everyone by the
   number of players who won (`tools/lib/import-tries.mjs`). This is the
   standard estimate when some players never finish.
3. **Fit the exchange rate** with `python3 tools/lib/fit-curve.py --real FILE`.
   Once five levels have data, it fits one line from simulated tries to real
   attempts.
4. **Read the levels that fall off the line.** A level far harder for people
   than its number says is a level people misread. That is a comprehension
   problem for the playtest notes to explain, not a number to tune.

**How many players?** The error is about ±1/√(players who won):

| players who won | error |
|---|---|
| 4 | ±50% |
| 10 | ±32% |
| 25 | ±20% |
| 100 | ±10% |

A living-room playtest of three or four finds walls and confusion. It takes
about 30 players per level to set a number.

## The skip is a target in disguise

On a SPIKE or BOSS, the skip is offered after 3 failures. If a level's real
average is *m* attempts, about (1 − 1/*m*)³ of players see the offer:

| real average attempts | players offered the skip |
|---|---|
| 2 | 13% |
| 3 | 30% |
| 4 | 42% |
| 6 | 58% |

So the real targets can be chosen by deciding how many players should meet the
skip. Here are the starting guesses, to be tested rather than believed:

- 1–2 real runs for intros and breathers;
- 2–3 for develops;
- 3–5 for spikes and bosses;
- about 6–8 at most for any level.

## What comes next, in order

1. Run a playtest with 8–10 strangers and say nothing. Note where each one
   stopped and what they thought each level wanted.
2. Re-sweep the noisy hard levels (CRACK first) until each rests on about 45–50
   robust winners.
3. Once five levels have real data, fit the line and restate the targets in
   real attempts.
4. After launch, gather 25–30 players per level, refit after each batch, and
   each month fix the levels where players quit or skip most.

## Where it lives

| What | Where |
|---|---|
| Targets, ceiling, watch list | `tools/lib/difficulty.js` |
| The gate | `tools/test/curve.js` (`npm run curve`) |
| Each level's measured numbers | `js/solverData.js`, `js/solutions.js` |
| The fit, simulated or real | `tools/lib/fit-curve.py` |
| Real runs in | `tools/lib/import-tries.mjs` |
| The research and its sources | `reports/Progressive difficulty in puzzle games.md` |
| A picture of all 70 slots | the "Difficulty curve" dashboard |


=================================================================
# FILE: docs/CERTIFICATION.md
=================================================================

# Certification — BRO, YOU'RE COOKED.

Every YouTube Playables requirement, with the evidence that it is met. Walked
**2026-10-12**, against Google's published requirements (sources at the end), on build
`dist/byc-playables.zip` (one file: `index.html`). **Machine half re-run 2026-10-13**
on the purged build — 185 KB raw / 53 KB gzipped, shelved levels out of the
bundle — and every row still passes; the figures below are that run's.
**Re-run 2026-10-25** after the notebook theme, level 1 and THORNS: conformance,
board and `npm test` all pass; the bundle row is updated.
**Re-run 2026-10-27 for v1.0** (after the dog, the weighed plates and the
re-bake): conformance (51 PASS), board, `npm test`, curve and plates all pass,
and all 45 levels were filmed won and lost in the browser. Zips are 92 KB.
**Re-run the machine half:** `npm run build && npm run serve &` then
`npm run test:conformance`, `npm run test:board`, `npm run test:audio`, `npm test`.

Google's live docs were re-checked for the integration rules on this date (SDK
`game_api/v1` before any game code, `index.html` at the bundle root, ZIP upload,
< 30 MiB, no external calls, `firstFrameReady` then `gameReady`). Their
**Playables SDK Test Suite** exists for pre-submission validation and needs
portal access — run it first thing once access arrives.

Legend: **PASS** with evidence · **PROXY** measured here, needs a real device ·
**HUMAN** only a person can sign · **N/A** does not apply.

## Found and fixed during this walk

- **The YouTube build did not exist.** The shipped bundle had only a commented
  SDK slot, and the conformance check read the slot in the DEV page, so the
  first integration requirement was unmet in the file that would be uploaded
  while every gate was green. `tools/build.js` now emits
  `dist/playables/index.html` (SDK first) and `dist/byc-playables.zip`, and
  conformance checks the uploaded file itself.
- **The board gate never ran its second half.** It crashed fetching a file the
  page cannot reach; the "button never swallows a stroke" check had never run.
  Fixed; it passes.
- **Found 2026-10-19, from Google's save rules: progress went to TWO places.**
  Every save was mirrored to `localStorage` as a backup, inside Playables too,
  and Google's wording is "Game MUST NOT use any other mechanism to save user
  progress". The old row below said PASS because it only checked that the
  cloud save worked. Inside Playables the cloud is now the only save and
  `localStorage` is used only off the platform, as in Google's own sample.
  The same walk found that a save could be asked for before `loadData` had
  landed (the sound switch, pressed early), which the platform rejects — and
  which, if it were accepted, would write a fresh progress over the player's
  real one. Nothing is sent now until a load has succeeded, and what the player
  did first is folded into the save when it arrives. `tools/test/save.js` and
  conformance both check it; the test fails ten checks on the old code.

## 1. Integration

| | Requirement | Evidence |
|---|---|---|
| PASS | SDK is the first script | conformance: YouTube build's first script is `game_api/v1`, and it is the only script with a `src` |
| PASS | `firstFrameReady` on first meaningful frame | conformance: called, and before `gameReady` |
| PASS | `gameReady` when input is accepted | conformance: time to interactive 82 ms |
| PASS | Cloud save via `saveData`/`loadData` | conformance: round-trip through the cloud; `loadData` used on boot |
| PASS | No other mechanism saves progress | inside Playables the browser's storage is never touched, read or write: conformance counts every `Storage` call through boot, a save and a load (0), and `tools/test/save.js` asserts it on and off the platform |
| PASS | `loadData` completes before any `saveData` | conformance holds the load, presses the sound switch, and sees no save until the load lands — then one save carrying the switch AND the stars already in the cloud; `save.js`: a save before or during the load, or after a failed one, is never sent |
| PASS | Save versioned; old loads; unknown degrades | conformance: versioned payload, unknown version and malformed data degrade without throwing; `tools/test/daily.js`: a v1 save migrates; `tools/test/progress.js`: v1 and v2 saves migrate to v3 (skips and tokens), an old save keeps every level up to its furthest open, and impossible token counts are dropped |
| PASS | Follows YouTube's sound setting | `ytgame.system.isAudioEnabled()` sets the starting state and `onAudioEnabledChange` is followed live (`js/main.js`); the player's own switch can only turn sound further OFF; `ads.js` asserts both calls on a mocked platform and audio-on off it |
| PASS | Audio does not wait for a tap | Google's FAQ calls this the most common audio failure. Inside Playables the sound starts once the save says whether the player muted it, and a tap resumes it if the browser held it back; conformance: an audio context exists before any gesture |
| PASS | `onPause` halts everything | conformance: physics frozen (simTime unchanged), phase clock stopped, audio context SUSPENDED; `audio.js`: pause suspends, resume restores |
| PASS | `onResume` restores, no catch-up | conformance: 100 ms of simulation in 120 ms of wall clock after resume |
| PASS | Zero external network calls | build gate (5 primitives) + conformance grep: clean |
| PASS | All game data in the initial bundle | one file; conformance: no asset URLs |

## 2. Stability & performance

| | Requirement | Evidence |
|---|---|---|
| PASS | Bundle < 30 MiB (< 15 recommended) | 91.4 KB gzipped, 263 KB raw (25 Oct, with the handwritten font embedded) — 0.6% of 15 MiB |
| PASS | Peak heap < 512 MB | conformance 200-retry soak: peak 5.5 MB |
| PASS | Time to interactive < 5 s | 82 ms local; **1.46 s on Slow 4G (1.6 Mbps, 150 ms RTT) with CPU x4, cold cache, uncompressed**; 2.13 s on Fast 3G (throttled figures measured 2026-10-12 on the larger 67 KB build) |
| PASS | No leak across 200 retries | 3.5 → 4.5 MB |
| PROXY | 60 fps on mid-range Android | Locked 16.7 ms frames at native CPU. With CPU x4 and SOFTWARE canvas (headless, no GPU — pessimistic): median 16.7 ms, p95 33.4 ms on the heaviest levels. Physics is fixed-step, so a slow frame never changes an outcome. **Check on a real mid-range Android.** |
| HUMAN | No crashes across the device matrix | needs devices |
| HUMAN | Does not crash the YouTube app | portal "Verify and test" |

## 3. Design

| | Requirement | Evidence |
|---|---|---|
| PASS | Playable at all nine ratios, 9:32 → 32:9 | conformance: nine screenshots, each read by eye (letterbox at 9:32, pillarbox at 32:9, HUD legible) |
| PASS | Auto-adjusts on viewport change | conformance ratio pass + resize test |
| PASS | State survives resize mid-simulation | conformance: t 700 → 942 ms, stroke kept, phase sim |
| PASS | Never locks orientation | conformance grep: clean |
| PASS | Fills viewport or letterboxes | nine-ratio screenshots |
| PASS | Touch input works | real touch events (CDP) drew the certified stroke and WON a1-wall and a31-thorns — re-run 25 Oct on both levels' new certificates, 0 errors |
| PASS | Mouse input works | every filmstrip, the board gate |
| PASS | Both on a hybrid device | input is Pointer Events only (`js/input.js`), one path for touch, mouse and pen |
| PASS | Text legible at 1x/2x/3x DPR | conformance: canvas backing at native resolution for each; the 3x screenshot read by eye |
| PASS | Graphics clear at all resolutions | same 3x screenshot |
| PASS | Small embed 320 x 480 | conformance: legible AND a stroke committed |
| PASS | Esc closes a dialog (SHOULD) | the level board is the one dialog; conformance opens it and presses Escape |

## 4. Monetization

| | Requirement | Evidence |
|---|---|---|
| PASS | Rewarded ad only on explicit request | its one call site is the SKIP, a button the player taps on the fail card after 3 failures on a spike or boss level (5 elsewhere), never on levels 1-3 or the daily; `tools/test/ads.js` asserts each rule and that a playthrough which never skips requests no rewarded ad |
| PASS | Reward IDs unique / no user data | `skip-<level id>`: one per level, built from level data only; asserted in `ads.js` |
| PASS | No ad before meaningful investment | `ads.js`: first interstitial after level 3, every 3rd level after, never over the ending; no interstitial straight after a rewarded ad (the counter resets); the skip is granted even when no ad is shown, so an ad is never the only way forward |

## 5. Privacy & data

| | Requirement | Evidence |
|---|---|---|
| PASS | No external analytics | `analytics.js` is a hard no-op when the SDK is present; conformance grep clean |
| PASS | No user data transmitted | zero network primitives |
| PASS | No user data in reward IDs | `skip-<level id>` only |

## 6. Trust & safety / content

| | Requirement | Evidence |
|---|---|---|
| HUMAN | Community Guidelines | Reviewed: a stick figure, no blood or gore, a death is a label ("HE'S GONE") and a replay; the title is slang. Needs your sign-off. |
| HUMAN | General audience 13+ | as above |
| HUMAN | Not made for kids | designed for a general audience; your call on the portal's audience setting |
| PASS | No third-party IP | no image, font or audio files in the bundle; the character and art are procedural |
| PASS | No copyrighted music or SFX | every sound is synthesised in `js/audio.js` |
| HUMAN | Title cleared (trademark) | decision D4 — a real trademark search is yours to commission |
| PASS | Art original | procedural ink rendering; nothing generated |
| HUMAN | Not "substantially identical" to another Playable (policy of 25 Aug 2026) | Undefined test, so judged by eye. Closest rival: **Save The Pets** (draw a line to shield a dog from bees, ~38M plays) now that BYC has a dog and a bee chapter. The decisions differ — Milo must walk out alive, not sit out a timer, and the game spans air, balloons, TNT and brittle floors — but lead the listing's thumbnail and first frame with what no bee game has. Confirm with the Partner Manager; re-read the live page before submitting |
| HUMAN | Accessibility tags declared (added 24 Aug 2026) | Set in the portal at submission. Facts for them: no information carried by audio alone (it plays muted), one-finger play, no time pressure while drawing (the world is frozen), reduced motion honoured. Re-read the live page for the tag list before submitting |

## 7. Packaging & submission

| | Requirement | Evidence |
|---|---|---|
| PASS | Self-contained HTML5 ZIP | `dist/byc-playables.zip`: `index.html` at the root, nothing else; conformance checks it |
| HUMAN | Channel onboarded to Playables | access pending (interest form submitted) |
| HUMAN | Partner Manager contact | pending access |
| HUMAN | Portal "Verify and test" + the SDK Test Suite | pending access |
| HUMAN | One rejection round budgeted | 2–7 business days testing → release |

## Known rejection causes — designed against from the first commit

Google names these as the common reasons a Playable is sent back: text
rendering on high-density screens (§3: legible at 1x/2x/3x), crashes on
specific devices (§2: needs real devices), pause/resume lifecycle failures
(§1: `onPause` halts everything), and initial load size (§2: 91 KB gzipped).

## Sources

Re-verify against Google's live documentation before submitting: requirements
change, and the live pages are the final authority.

- [YouTube Playables — overview](https://developers.google.com/youtube/gaming/playables)
- [Integration requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_integration)
- [Stability and performance requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_stability)
- [Design requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_design)
- [Monetization requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_monetization)
- [Privacy requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_privacydata)
- [Trust & safety requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_trustsafety)
- [Certification FAQ](https://developers.google.com/youtube/gaming/playables/support/certification_faq)
- [Design best practices](https://developers.google.com/youtube/gaming/playables/certification/best_practices_design)
- [Monetization SDK reference](https://developers.google.com/youtube/gaming/playables/reference/monetization)
- [Developer Portal](https://developers.google.com/youtube/gaming/playables/developer_portal)


=================================================================
# FILE: docs/CASE_STUDY.md
=================================================================

# CASE STUDY — Save the Doge and Love Balls (15 Oct 2026)

Asked for on 15 Oct: how many levels do the hits in our genre have, what are
they doing, why did they work, and what do we copy — improving docs/PLAN.md,
not replacing it.

Sources are search summaries (the build machine cannot open web pages
directly); every claim below names where it came from. Where a number could
not be found, it says so.

---

## The two games

### Save the Doge — "draw to protect"

| | |
|---|---|
| **Who** | Wonder Group (developer listed as MIRACLE GAME INC.); released **12 July 2022**, broke out in September 2022 [hc.games, Pereira] |
| **Scale** | ~34M downloads in its first months; **30.17M in Q4 2022 alone**, #3 hyper-casual game by downloads that quarter [AppMagic]; #1 download in Southeast Asia in Sept 2022 (6.5M) [Sensor Tower]; **over 80M** by 2023 with **7M+ a month** [Azur Games' publishing lead, PocketGamer.biz]; Switch ports and a sequel in 2025 [Nintendo eShop] |
| **Levels** | **"Hundreds"**; no total is published anywhere I could find. Updates add levels |
| **The game** | Draw ONE line to shield a dog from a swarm of bees for 5–10 seconds. The bees come **from all directions** |
| **How it was made** | Deliberately ~80% Happy Glass (the draw-a-line formula players already knew) plus one twist — bees from every side instead of water from above — and a meme character, the Doge [Pereira's "80/20" analysis] |

**Level design** (Azur Games' deconstruction):
- **Level 1 cannot be lost**, and always gives three stars.
- **Stars for short lines** — the challenge for players who want it.
- **Difficulty is not linear**: relief levels between hard ones.
- In later levels, **"90% of the most obvious solutions are not the most
  effective"**.
- **Several solutions per level**; new threats drip in (the clones list bombs,
  lava, spikes, water, saws, arrows).

**Money**: interstitial and rewarded video at roughly **one per minute**;
content unlocked with stars; tips are not stockpiled; **replays are free**;
user acquisition aimed at emerging markets, with playable ads that ran to
millions of impressions [Pereira; Azur].

### Love Balls — "bring the couple together" (the game you were thinking of)

| | |
|---|---|
| **Who** | SuperTapx (China), published by Lion Studios (AppLovin). iOS launch on **Valentine's Day 2018**, almost no marketing until v1.1 in April [SCMP, Medal.tv] |
| **Scale** | #1 free iOS app in North America for ~2 weeks; **#1 in 60+ countries**; ~**180M downloads** by a third-party tracker [SCMP, Medal.tv, AppBrain] |
| **Levels** | No total published. **"New levels every week"**, shipped in batches (e.g. 12 in one update); early levels take about a minute each [App Store, release notes, reviews] |
| **The game** | Draw lines and shapes so two balls — a couple — roll together and touch. A simplified successor to Brain Dots and Brain It On! [Medal.tv] |
| **Around it** | Daily challenges (the difficulty spikes); seasonal events (Halloween pumpkins buy festival skins); a **pen collection**; stars for using little ink [release notes, guides] |
| **Money** | Ads — and **ad load is the #1 complaint in its reviews**; a hint for a rewarded video; in-app purchases [App Store, reviews] |

(Other "reunite" titles exist — Love Connection, Draw To Home — but Love Balls
is the one that topped the charts.)

---

## What the hits have in common

1. **One fantasy, readable in one second, with someone to care about.**
   Save the dog. Bring the couple together. The threat and the victim are on
   screen before the player has read a word.
2. **Familiar mechanic, one twist.** Both are honest descendants of an earlier
   hit (Happy Glass; Brain Dots). Nobody had to learn how to play.
3. **Easy for a long time.** Level 1 cannot be lost; reviewers describe the
   first hundred levels as about a minute each and the first real wall around
   level 85–100. Difficulty comes in spikes with relief after them.
4. **Short levels, instant retry, stars for less ink.**
5. **Volume from variation.** Hundreds of levels, almost all the SAME decision
   ("shield the dog") in a new arrangement — bees from a new side, a new
   obstacle, two dogs — with new threats added slowly.
6. **A collection**: pens, skins, backgrounds, bought with stars or coins.
7. **Live content**: new levels every week, seasonal events.
8. **Failure you want to watch**: bees swarming a dog, a ball falling off the
   edge. That is what their ads and TikTok clips are made of.
9. **Heavy ads** — and it is what players hate most about them.

## Where we already match them

One line, stars for less ink, instant retry, several solutions per level, a
sawtooth with breathers, a daily challenge, a skip paid with a rewarded ad, a
meme-native title, and a death cam that replays the failure in slow motion —
the most watchable thing in the game.

## Where we fall short, and what we change

| | What they do | What we do now | What we change |
|---|---|---|---|
| **A. The ceiling** | Never a wall; spikes, then relief | Bosses measured up to 90 tries; SINK was "unplayable" in your playtest | **No level above ~60 measured tries.** SINK is fixed (90 → 26). THORNS (89) is the next hardest and goes first on Saturday's watch list; refit the curve's top from real tries |
| **B. The first level** | Cannot be lost | BLOCK, 12 tries — easy, but losable | Watch first-try success on level 1 on Saturday; if anyone fails it twice, make it unlosable |
| **C. A collection** | Pens, skins, backgrounds for stars | Stars are only a score | **Stars buy cosmetics**: pen colours, Milo outfits, a collar for the dog. Free, earned, no pay-to-win |
| **D. Volume** | Hundreds, mostly variations of one decision | Strict: no two levels may ask the same decision; 36 levels | **Allow VARIANTS**: the same decision in a new arrangement, if its opening frame looks different and its winning stroke is a different shape (the census shows different families). Never a near-identical layout — the "levels 2, 4 and 11 look the same" problem still stands |
| **E. The next element** *(bees built 18 Oct: chapter 3, six levels)* | Bees (protect from every side); a couple to reunite | The dog | **BEES**: a swarm that homes in from all sides, stopped by lines, lethal to whoever it reaches — and our hollow closed strokes already make domes. **And REUNION**: a win condition where Milo must reach the DOG, not the exit — Love Balls' fantasy with a character we already have |
| **F. Live content** | Weekly levels, Halloween events | Daily challenge; a chapter a month planned | **Weekly batches after launch**; a seasonal skin (31 Oct is in two weeks) |
| **G. Ads** | ~1 a minute, and the reviews hate it | Interstitial every 3rd level; rewarded only for the skip | **Stay lighter than them.** Add rewarded video only where it is the player's choice (a cosmetic, a skip) |

## How many levels

**They**: hundreds, no published totals, more every week.
**Us**: 36 now; 60 at launch (docs/PLAN.md) is still the right first target
for a YouTube Playable, where a sitting is ~10 minutes. The case study says
the way to "hundreds" is variants plus a weekly drip after launch — not
more, stricter, one-of-a-kind decisions, which is the vein that ran dry on 14
Oct (one keeper in seven).

## Sources

- AppMagic via [GameDev Reports](https://gamedevreports.substack.com/p/appmagic-hypercasual-market-in-q4) and [WN Hub](https://wnhub.io/news/finance/item-1476) — Q4 2022 downloads
- [Sensor Tower via GameDev Reports](https://gamedevreports.substack.com/p/sensor-tower-top-mobile-games-in-89e) — Southeast Asia, Sept 2022
- [PocketGamer.biz — Deconstructing Save the Doge (Azur Games)](https://www.pocketgamer.biz/deconstructing-save-the-doge-and-draw-to-mesh-puzzle-games/) — level design, 80M downloads, monetisation
- [Carlos Pereira — the 80/20 rule: Save the Doge](https://www.linkedin.com/pulse/applying-rule-8020-mobile-games-save-doge-case-carlos-pereira) and [HC.Games case study](https://hc.games/en/case-study-save-the-doge/) — Happy Glass benchmark, release date, ads per minute
- [Azur Games — genres to watch, end of 2022](https://azurgames.com/blog/what-genres-should-hyper-casual-game-developers-pay-attention-to-at-the-end-of-2022/)
- [Nintendo eShop — Save The Doge 2](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-download-software/Save-The-Doge-2-2890453.html)
- [Save the Doge on Google Play](https://play.google.com/store/apps/details?id=com.miracle.savethedoge.an&hl=en_US) and clones' listings (hazard variety)
- [SCMP — The world is in love with Love Balls](https://scmp.com/abacus/games/article/3028557/world-love-love-balls-where-did-it-come) — chart positions, origin
- [Medal.tv — How Love Balls became a viral smash](https://megacool.medal.tv/blog/how-love-balls-became-a-viral-smash-and-6-ways-to-improve-it/) — release history, lineage, ads
- [Love Balls on the App Store](https://apps.apple.com/us/app/love-balls/id1348173937) and [AppBrain](https://www.appbrain.com/app/love-balls/com.supertapx.lovedots) — weekly levels, download count
- [APKMirror release notes](https://www.apkmirror.com/?p=530730) — events, skins, level batches


=================================================================
# FILE: docs/PLAYTEST.md
=================================================================

# PLAYTEST — Saturday 17 October

The automated checks say every level is solvable, fair and stable. They
cannot say whether a person knows what a level wants from them — two levels
passed every gate and were shelved on one playtest. This is that check, and
it outranks every number in the repo.

It answers two questions:

1. **Does a stranger understand each level?** Where do they stop, and what do
   they think it wants?
2. **How many tries does each level really take?** The difficulty curve is
   simulated (random strokes and a model hand). Your numbers refit it.

## The build

The published page is the playtest build: <https://claude.ai/artifact/9Q9hZcp7X6EcyB4iSVTpxG>

**It is private until you share it.** For testers who are not signed in as
you, open the page's Share menu and choose "anyone with the link" — nobody
else can open it otherwise, and that includes you in a private tab.

It is the game as it stands — 36 levels in six chapters, the daily, the skip —
plus one thing the store builds do not have: it keeps a log of every run and
shows it on the level board. Nothing is sent anywhere; it lives on the phone.

## Who

You, plus two or three people who have never seen the game. The strangers
matter most: you already know what every level wants.

## How to run it (about 15 minutes a person)

1. **A phone, held upright, and a fresh start.** Each tester opens the link in
   a private / incognito tab, so the log starts empty and nobody inherits
   anyone else's progress.
2. **Say nothing.** No hints, no "try drawing a…". If they ask, say "what do
   you think it wants?" The hint at the top of each level is the only help the
   game gives, and that is what is being tested.
3. **Ask them to think out loud.** "I think I need to…" is the data.
4. **Play in order, as far as they like.** The skip is allowed (it shows up
   after a few failures) — a skipped level is a finding, not a failure.
5. **Stop at about 15 minutes** or when they want to.

## What to write down

For any level where something happened, one line in this shape:

> **Level 7 STOP THE ROLLER** — drew a wall in front of him three times; said
> "I thought I had to block it"; got it on the fourth by accident.

Things worth a line:

- they **hesitated** a long time before drawing anything
- what they **said they thought it wanted**, especially if it was wrong
- a **"what?"** or a laugh at a replay
- a level they **won without knowing why**
- anything that looked **broken**: a line that did not do what they drew, a
  button that did nothing

## Collecting the numbers

When each tester is done, tap the **grid icon (top right)** to open the level
board and **take a screenshot**. Every level they played shows, on its tile:

- `3× 1:12` — they won it on the **3rd run**, after **1 minute 12 seconds** on
  the level (watching, drawing and the replays included)
- `6× ✗` — **6 runs and never won** (or skipped)

The line under the score totals the session: levels won, runs, time.

## What to send back

The board screenshot from each tester, and your notes. Paste them in with:

> Playtest notes: [level name] — [what happened, where they got stuck, what
> they thought it wanted]. Fix it or hold it; do not argue with the playtest.

## What happens with it

- **A level a stranger cannot read is held**, whatever its numbers.
- **Tries per level refit the curve** (docs/PLAN.md 4.2): the order of the 36
  is re-checked against real attempts, starting with the first ten minutes.
- **The next element is chosen from what you saw**: what people enjoyed, where
  they got bored, what they tried to do that the game would not let them.


=================================================================
# FILE: docs/PLAYGAMA.md
=================================================================

# Playgama — real players for the difficulty curve

*Prepared 25 Oct 2026. Nothing has been uploaded; that waits for your go-ahead.*

## Why

Every difficulty number in this game is simulated: a solver and a model hand,
never a person. Professional studios set and correct their curves from real
players' attempts per level (reports/Progressive difficulty in puzzle games.md).
Playgama's Sandbox (launched 14 Oct 2026, for games built with coding agents
like Claude Code) shows a game to real players and reports what they do.

## What is ready

- **`dist/byc-playgama.zip`**, built by `npm run build`. It is the same game as
  every other build, with Playgama's SDK loaded first from Playgama's own
  server (the SDK is LGPL-3.0, so it is loaded, never copied into our file)
  and its config file beside it.
- **What it reports:** each run's start and end, with the level, the outcome
  and the attempt number. These go both as Playgama's standard
  level-started / completed / failed messages and as our own events. Nothing
  personal is collected.
- **The YouTube build is untouched.** It still makes no network call of its
  own, and `tools/test/playgama.js` proves the reporting stays off inside
  YouTube even if the SDK were somehow present.
- **Ads on Playgama are off.** Turning them on is a separate decision.
- **The SDK is Playgama's moving `stable` channel**
  (`https://bridge.playgama.com/v2/stable/playgama-bridge.js`), so it can change
  under the build without a commit here. That is acceptable for a test build on
  their platform; it is one more reason the YouTube build never loads it.

## What you do (about 15 minutes)

1. **Create a developer account** at https://developer.playgama.com.
2. **Connect Playgama to Claude** (optional, but it lets me upload for you).
   In claude.ai go to Settings → Connectors and add a custom connector with
   the URL `https://developer.playgama.com/api/mcp`. Playgama's own README
   documents this server for Claude Code.
3. **Tell me to go.** I then upload `byc-playgama.zip` to a Sandbox game and
   give you the link.
   - Without the connector, upload the zip yourself in the developer cabinet.
4. **Share the link** wherever you like. The first few hundred plays are what
   the curve needs: about 30 players per level for a first estimate, and 50
   or more for a firm one.

## What happens to the numbers

1. Export the runs from Playgama's dashboard: per level and player, how many
   runs they made and whether they won. Players who quit count too: leaving
   them out flatters exactly the levels that stop people.
2. Run `node tools/lib/import-tries.mjs export.csv > data/playtests/attempts.json`.
3. Run `python3 tools/lib/fit-curve.py --real data/playtests/attempts.json`. It
   prints real against simulated attempts, level by level, and once five
   levels have data it fits the line that turns simulated tries into a
   prediction for people.

Each level's number is all runs by everyone divided by the number who won.
Read the winner counts down the campaign as the drop-off.

## Never pick YouTube as a Playgama target

Playgama can distribute a game to other platforms, YouTube Playables among
them. **Do not tick YouTube there** while the direct Playables application
stands: it would put a second copy of this game on the same shelf, which is
what the duplicate rule polices, and through a build with someone else's SDK
in it. The YouTube release goes through our own `byc-playables.zip` only.

## Open questions, checked before upload

- **Sandbox terms and revenue split:** only Playgama's own blog and a press
  release were readable from here. Read the terms in the cabinet.
- **YouTube Playables:** its duplicate rule (25 Aug 2026) is about two
  Playables being the same game. A web release elsewhere does not make the
  YouTube version a duplicate inside Playables. Confirm with your Partner
  Manager when you have one.


=================================================================
# FILE: docs/launch/LAUNCH.md
=================================================================

# LAUNCH — v1.0, 27 Oct 2026

**Decision (D11 in docs/DECISIONS.md):** ship the 45 levels now to the places
that will take them today. Stop adding content. Let real players' numbers
decide what comes next.

YouTube Playables is still applied for, but its door is Google's:
- early access only, with no published timeline;
- revenue sharing is a pilot with no published split.

## Where it goes, in this order (your part, about an hour)

| # | Where | What it is for | Steps |
|---|---|---|---|
| 1 | **Playgama Sandbox** | Real players' attempts **per level**, the input the difficulty curve has never had | `docs/PLAYGAMA.md`: create the account, optionally connect it to Claude, then tell me to go (or upload `dist/byc-playgama.zip` yourself). **Never tick YouTube there.** |
| 2 | **itch.io** | A public link, comments, ratings; the link YouTube gets | `STORE_PAGE.md` → itch.io; `dist/byc-web.zip` |
| 3 | **CrazyGames** | A large web audience, not exclusive | `STORE_PAGE.md` → CrazyGames; `dist/byc-web.zip` |
| 4 | **YouTube** | The original target | After two weeks: the message in `STORE_PAGE.md`, with the real numbers |

Also yours, before YouTube: the content and audience sign-off, and whether to
commission a trademark search on the title (`docs/CERTIFICATION.md` §6,
`docs/DECISIONS.md` D4).

## Frozen at launch

- **The campaign**: 45 levels, as of release commit `f159983` on
  `claude/game-markdown-review-23hf3j`. Any change to it reshuffles every
  future daily challenge, so after launch change it in batches, and say so.
  **Tag it on GitHub** (this session's git access cannot push tags):
  Releases → Draft a new release → tag `v1.0` → target that commit.
- **No new levels until the numbers are in.** The 25 open slots, bee slot 29,
  FUNNEL's back door and the eight levels over the 60-try ceiling all wait for
  real attempts.
- The skip is the safety valve meanwhile. It is offered after 3 failures on a
  spike or boss level and 5 elsewhere, and granted free when no ad is
  available, so a wall cannot end anyone's game.

## What to read

**After one week**
- Playgama: plays, and how many players reach levels 5, 10, 20 and 45 (the drop-off).
- itch.io / CrazyGames: comments. Read every one; a level named twice is a finding.

**After two weeks**
1. Export the Playgama runs. Then run:
   - `node tools/lib/import-tries.mjs export.csv > data/playtests/attempts.json`
   - `python3 tools/lib/fit-curve.py --real data/playtests/attempts.json`

   This prints real against simulated attempts, level by level.
2. Minutes per session (target about 10), and how many players came back the
   next day.

## What the numbers decide

| If | Then |
|---|---|
| A level's real attempts are more than 2× its simulated ones, or the drop-off spikes there | Ease or hold that level first, before anything new is built |
| Players finish the campaign and come back the next day | Build the next chapter: new levels are worth paying for |
| Players leave early and do not come back | Fix the first ten levels and the daily before adding anything |
| The numbers are strong | Send them to YouTube, or take a Playables publisher, with the evidence in hand |

## The release gate this build passed (27 Oct)

| Check | Result |
|---|---|
| `npm run film` | All 45 levels won by their certified, hand-drawn lines in the real browser |
| `FILM_IDLE=1 npm run film` | All 45 lost with nothing drawn, each with a named reason |
| `npm test` | All physics gates pass |
| `npm run curve` | Pass |
| `npm run plates` | Pass (FUNNEL listed open) |
| `npm run test:board` | Pass |
| `npm run test:conformance` | Every machine-checkable YouTube row passes |
| Zips | 92 KB each |


=================================================================
# FILE: docs/launch/STORE_PAGE.md
=================================================================

# Launch kit — the words and images for every store

Everything here comes from the real game: the builds in `dist/` and the images
in this folder, captured from it. Refreshed **27 Oct 2026** for v1.0. The first
kit (12 Oct) still said "21 levels" and showed the old look.

- Rebuild the zips with `npm run build`.
- Recapture the images with `node tools/launch/store-shots.mjs`.

The order to put it out, and what to read afterwards, is in **`LAUNCH.md`**.

| File | Use |
|---|---|
| `dist/byc-web.zip` | **The open web**: itch.io, CrazyGames, any static host. No YouTube SDK. |
| `dist/byc-playgama.zip` | **Playgama Sandbox**: real players' attempts per level (see `docs/PLAYGAMA.md`). |
| `dist/byc-playables.zip` | **YouTube**: upload in the Playables developer portal once access arrives. |
| `cover-630x500.png` | itch.io cover |
| `cover-1920x1080.png` | landscape key art (16:9) |
| `cover-800x1200.png` | portrait key art (2:3) |
| `screenshot-1` … `8` | store screenshots, in this order |

Portals that ask for other sizes say so on their upload page. Recapture at
those sizes rather than stretching these: add a line to the `cover(...)` list
in the script.

## The words

**Title:** BRO, YOU'RE COOKED.

**Tagline:** One line. One shot. Get him out.

**Short description:** A physics rescue puzzle. Milo is walking into trouble —
draw one line to save him.

**Description:**

> A little guy is walking, at his own pace, directly into something that will
> squash him. The world stops one heartbeat before it happens. You draw one
> line. Time restarts. He lives or he doesn't — and either way you see exactly
> why, and you're drawing again four seconds later.
>
> 45 levels in seven chapters, each bringing something new to deal with:
> - falling rocks;
> - pressure plates and gates;
> - a dog that turns round at whatever you draw;
> - a swarm of bees that flies straight at anyone alive;
> - TNT;
> - air currents and balloons;
> - floors that crack.
>
> Three stars for the shortest line, and a new daily challenge every day with
> less ink than the level normally allows. Stuck? After a few tries you can
> skip a level and come back to it.
>
> No buttons to learn. If you can draw a line, you can play.

**How to play / controls:** Draw one line with your finger or mouse, then let
go. A line that touches something holds fast; a line in mid-air falls. That's
the whole game.

**Genre / tags:** Puzzle · Physics · Drawing · Casual · Hand-drawn · Brain ·
Dog · Mobile

**Audience:** general, 13+. A stick figure, no blood. A death is a word
("HE'S GONE") and a replay. Not made for kids; the title is slang.

**Accessibility facts** (for any portal that asks):
- one-finger play;
- no information carried by sound alone (it plays muted inside YouTube);
- no time pressure while drawing, because the world is frozen;
- reduced motion is honoured;
- legible at every aspect ratio from 9:32 to 32:9.

## itch.io (free, about ten minutes)

1. Sign in at itch.io → **Upload new project**.
2. **Title**: as above. **Kind of project: HTML**.
3. **Uploads**: add `dist/byc-web.zip`, and tick **This file will be played in
   the browser**.
4. **Embed options**:
   - viewport **405 × 720** (portrait);
   - tick **Mobile friendly** and **Fullscreen button**;
   - leave scrollbars off.
5. **Cover image**: `cover-630x500.png`. **Screenshots**: `screenshot-1` to `8`.
6. Paste the description and tags. **Visibility: Public** → **Save**.
7. Open the page on your phone and play level 1 to the end once.

(itch.io sometimes renames these options slightly; the choices are the same.)

## CrazyGames

1. Create a developer account at developer.crazygames.com.
2. Submit `dist/byc-web.zip` as an HTML5 game, with the description, the
   controls line, and the covers its form asks for.
3. Their QA reviews every game against technical and quality rules. Third
   parties report:
   - feedback in about one to two days;
   - a first "basic launch" that needs no SDK;
   - ads only through CrazyGames' own SDK.

   **Read the form for what it actually asks today.** If they offer a full
   launch, I add their SDK in a separate web build. The YouTube build is never
   touched.
4. It is not exclusive, so it can sit beside itch.io and Playgama.

**Poki is the exception:** it is reported to ask for web exclusivity, which
would rule out CrazyGames. Leave it until the numbers say which is worth more.

## What to send YouTube (the interest form or your Partner Manager)

> **BRO, YOU'RE COOKED.** — a one-line physics rescue puzzle built for Playables.
> Play it: <your itch.io link>
>
> Built for the platform from day one:
> - the Playables SDK loads first, and `firstFrameReady`/`gameReady` are wired;
> - cloud save via `saveData`/`loadData` is the only save;
> - `onPause` halts physics, audio and rendering;
> - zero external network calls;
> - a 92 KB zip, interactive 163 ms after load in our conformance run;
> - playable at all nine aspect ratios.
>
> 45 levels in seven chapters, plus a daily challenge. A certification dry-run
> against the published requirements is complete, and the ZIP is ready to
> upload.
> <After two weeks, add the real numbers: plays, levels finished per player,
> minutes per session, players who came back the next day.>

Playables access is reviewed by YouTube, and it weighs a creator's history and
past performance. A public link with real players' numbers turns the build into
evidence.


=================================================================
# FILE: reports/Where the AI struggled.md
=================================================================

# Where the AI struggled — a retrospective of BRO, YOU'RE COOKED.

*Written 25 Oct 2026 from the repository's whole history: 118 commits since 9 Sep, every planning document, CLAUDE.md, and your messages in the session transcript (which only starts on 27 Sep; earlier messages survive as a summary). Every number here was counted, not remembered.*

## The short version

The AI was good at the parts a computer can check: the physics engine, the tests, YouTube's certification rules, the daily challenge. It struggled at the parts a computer cannot check — whether a level is fun, whether a stranger understands it, whether a difficulty number matches a real person — and it spent too long building the checking machinery instead of building levels you could see. Three things also kept breaking the flow from outside: machines that were wiped, usage limits, and blocked websites.

Each failure below is paired with the rule that now prevents it.

## How the project went

| Dates | What happened | Campaign levels |
|---|---|---|
| 9 Sep | The plan: 24 levels shippable, 60 the upside. Physics proven before any level | 0 → 1 |
| 13–15 Sep | The build sprint. Two broken builds shipped while every test was green | 1 → 19 |
| 16–23 Sep | The wall. 14 levels built and shelved in 8 days; 2 shipped | 19 → 21 |
| 27 Sep | Built the daily challenge instead of levels. TNT built, then lost when access was cut | 21 |
| 27 Sep – 12 Oct | 15 days with no work possible | 21 |
| 12–13 Oct | Your "you need to build levels but you do not want to". A purge, the 60-level plan, the difficulty equation | 21 → 31 |
| 14–18 Oct | The dog, then the bees | 31 → 42 |
| 19–25 Oct | Certification fixes, research, then a usage limit until today | 42 |

The plan promised 60 levels by 21 Oct. On 21 Oct there were 42, and the target had grown to 70.

## Where it went wrong, and why

### 1. It trusted its own numbers over the game
- **What happened:**
  - Two builds shipped "unplayable" (a line that vibrated, then one that shrank) while every automated test passed.
  - SINK passed every gate and you called it unplayable.
  - A7 and A14 passed every gate and confused a real player.
- **Why:** the tests checked a *model* of the game with idealised strokes; nobody looked at the game itself.
- **The rule now:** film every level won *and* lost and read the films; read the opening-frame sheet; a playtest outranks every number.

### 2. It built the measuring machine instead of the thing you asked for
- **What happened:**
  - "We have not progressed from level 21 for a while" (27 Sep).
  - "You need to build levels but you do not want to" (13 Oct).
  - It argued that content "was never the bottleneck" and built the daily challenge. That argument stopped level production for three weeks — CLAUDE.md now says so in writing.
  - On 12 Oct you asked for levels and "game ready this week". You got certification work and a level re-order, and zero new levels.
- **Why:** it optimised for what it could verify, not for what you could see.
- **The rule now:** levels are the deliverable. Infrastructure is built only when a level needs it, and it is said out loud when levels stop.

### 3. Most level ideas died, and each death cost hours
- **What happened:**
  - About 99 level ideas were tried and 42 shipped: roughly 4 in 10 survive.
  - Since 13 Oct the build log records 44% of design time spent on levels that died.
- **Why:** many ideas asked the physics engine for something it cannot do. A speed cap, a 720-unit-wide world and Milo crossing in 2.7 seconds each killed whole families of ideas. These limits were discovered one level at a time instead of up front.
- **The rule now:** CLAUDE.md lists every limit found (dozens of entries), each new idea is checked against them before any measuring, and ideas are sketched cheaply in batches before one is built.

### 4. Its own rules were stricter than the game needed
- **What happened:** "One question per object" and "never the same decision twice" capped the game at about 21 levels. They were relaxed only when you pushed (13 Oct) or approved (14 Oct, 15 Oct).
- **The rule now:** variants of a decision are allowed, if the opening frame and the winning line look different (case study D).

### 5. The difficulty "mathematics" was never checked against people
- **What happened:**
  - 12 Oct: "fix the mathematics". 13 Oct: "do you have a mathematics that justifies the progression?". Today: "I don't trust you in making the progression."
  - An equation was delivered on 13 Oct, but it was fitted to *simulated* players, and later levels were tuned to fit it, which makes the fit partly circular.
  - Not one real player's attempt count has ever been collected.
  - Its fitting script stopped working when the dog arrived, and nobody noticed.
- **Today:** the fitter is rewritten, the curve shows how far each number can be trusted, and the difficulty research is being turned into a plain-language handbook. The missing piece is real players (Playgama).

### 6. It went quiet and wrote too much
- **What happened:**
  - You asked it to "stop long failure essays".
  - It re-asked questions you had already answered ("why you keep coming to me again and again").
  - It moved on to other work without saying that levels had stopped.
- **The rule now:** short updates; say plainly when the plan changes.

### 7. The outside world kept interrupting

| Interruption | Cost |
|---|---|
| Usage or session limits, in 7 separate windows (13 Oct twice, 14, 15, 18, 19 and 25 Oct) | Research agents died mid-report; the 19 Oct report was never finished |
| Access disabled on 27 Sep | 15 days with no session |
| The cloud machine replaced | The whole TNT engine was lost, uncommitted, and had to be rebuilt |
| Blocked websites (YouTube, Google's developer site, research sites) | The rival games could not be opened; research ran on search summaries |

**The rule now:** commit and push at every checkpoint, and launch fewer agents at once.

## What it did well

- **Certification:** 53 KB game, interactive in about 0.4 s, every one of nine screen shapes. It found real problems the earlier checklist missed: the YouTube build did not exist, saves went to two places, and a save could fire before loading.
- **A testing system no human team this size would build:** 15 automated test suites plus browser checks; films of every level won and lost; a model of a shaky human hand; a solver that tries thousands of lines per level.
- **The daily challenge:** never repeats within 8 days, and every level it deals is proven winnable by a shaky hand.
- **Honest records:** every shelved level keeps its measured reason, and every dead sketch keeps its cost. It also caught a 30× error in an imported "YouTube money formula".
- **Fast once unblocked:** 10 levels in a day (13 Oct), the TNT engine rebuilt from notes in hours, SINK fixed the day you reported it.

## What this says about what AI does best

The pattern is consistent:

- **Strong** wherever the answer can be **checked by the machine itself** — rules, physics, compliance, tests, solvers, deterministic systems.
- **Weak** wherever the answer needs a **human judgement** the machine cannot simulate — fun, clarity, taste, real difficulty.
- **Weakest** where it mistook a simulated judgement for a real one.

The second case study, *Games AI can build repeatedly*, takes this as its starting point: favour games whose difficulty and solvability a computer can measure exactly, and put real players in the loop early for everything else.
