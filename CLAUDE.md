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

    npm test                      level data, physics, levels — fast, run always
    npm run solver                the gates, and writes measured star thresholds
    node tools/solver/representative.js   certifies a hand-robust solution per level
    node tools/test/filmstrip.js  films every level winning — READ THE IMAGES
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
