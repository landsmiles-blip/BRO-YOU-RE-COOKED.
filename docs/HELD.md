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
