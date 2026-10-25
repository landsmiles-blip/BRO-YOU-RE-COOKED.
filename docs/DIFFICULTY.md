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
