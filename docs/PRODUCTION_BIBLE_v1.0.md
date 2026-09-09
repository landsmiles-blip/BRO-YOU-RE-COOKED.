# BRO, YOU'RE COOKED.
## Production Bible v1.0 — The Rebuild

**Status:** Pre-production. No code is authorised by this document except the Phase 0 build described in Part 9.

**Supersedes:** v0.2 (Design Bible), v0.3 (Spine & Build Spec), v0.4 (Addendum). All three are preserved in `docs/source/` and remain readable as lineage. Where this document contradicts them, this document wins.

**Tags used throughout:**
- **LOCKED** — build against this. Changing it changes the game.
- **TUNE** — a real starting number, expected to move during playtest. Owned by the build, not by debate.
- **YOURS** — a creative or business call engineering cannot make. Listed in Part 11.

---

# PART 0 — HOW THIS DOCUMENT CAME TO EXIST

Three documents were written before this one:

| Doc | Author | Length | What it is | What it's worth |
|---|---|---|---|---|
| v0.2 Design Bible | ChatGPT | ~3,400 lines | Philosophy, market case, principles, 105 numbered sections | The *why* is genuinely good. The game's identity is in here. |
| v0.3 Spine & Build Spec | Claude | 237 lines | Gap audit + first concrete numbers, schema, file layout | The *how* starts here. Correctly diagnosed that v0.2 is unbuildable as written. |
| v0.4 Addendum | Claude | 110 lines | Second-pass gap audit | Genuinely sharp. Found Milo's missing body, the missing fixed timestep, the missing camera rule. |

**What this document does that they did not:** it resolves the contradiction sitting at the centre of the design that all three walked past, it fixes a physics bug that would have broken the game in week one, and it answers the question the whole project actually turns on — *why would anyone want to look at this?*

## 0.1 An honest verdict on each

**v0.2 is 60% padding and 40% the best thinking in the pile.** Sections 85 through 90 restate a single principle six times under six headings. Section 24 lists ten worlds nobody asked for. Section 60 lists five game modes marked "do not build." That bulk is not free — it buries the parts that matter (§11 Fair Physics, §17 the verb grammar, §69 kill criteria, §83 shareability) under enough restatement that a builder skims and misses them. But the core instinct — *the player fixes the world, not the character* — is correct and differentiated, and §99's "HELL YES test" is the single best paragraph anyone wrote about this game.

**v0.3 did the hard, unglamorous job well.** It caught that the schema couldn't express the game's own headline marketing example, that "Canvas/WebGL" and "lightweight 2D physics" were non-decisions dressed as decisions, and that "expand horizontally" was a wish. Its numbers are the first buildable numbers in the project. Its `id`/`triggers` fix is correct and I have kept it.

**v0.4 is the sharpest document of the three per line.** Milo had no physics body — nobody had noticed. There was no fixed timestep — nobody had noticed. It also did real arithmetic on the A4 fall trajectory instead of eyeballing it, and I re-ran that arithmetic independently: **it is correct** (x≈354 at y=1000, x≈406 at the pit floor). That is the standard the rest of the project should hold.

## 0.2 What I am overriding, and why

| # | v0.3/v0.4 said | v1.0 says | Why |
|---|---|---|---|
| 1 | Silent on whether the world is frozen while drawing | **The Freeze** — hard, explicit, and it is the game's signature | v0.2 §8.1 and §4.4 flatly contradict each other. Nobody resolved it. Part 3.1 |
| 2 | Stroke is "static-until-release, dynamic-on-release" | **Anchored-dynamic** — strokes weld to geometry they touch | Fully-dynamic strokes topple unpredictably; that is the fairness bug the whole Fair Physics section fears. Part 3.2 |
| 3 | Physics at 60 Hz, line thickness 14 | **120 Hz + global 900 u/s speed clamp + thickness 16** | At the spec's own gravity, hazards tunnel *straight through the player's drawing*. Verified arithmetic. Part 3.4 |
| 4 | Slow-motion on failure | Slow-mo **plus** death-cam attribution **plus** ghost-of-last-stroke on retry | Slow-mo shows *that* you died. The game must show *why*, and let you adjust rather than redraw blind. Part 3.3 |
| 5 | Art is a NEEDS-YOU resourcing question | Art is a **rendering-system decision**, resolved here | 8 animation states as sprite sheets is a contractor and a schedule. As a code rig it is free, reactive, and dodges the AI-art certification risk. Part 6 |
| 6 | "60 carefully authored levels" | **24 levels is the shippable game.** 60 is upside | Unsized content targets are how projects end mid-air. Part 9 |
| 7 | Star thresholds "data-driven per level" | Derived by a **headless solver harness** | There is no data before launch. The solver is the data. Part 7.3 |
| 8 | `"hazards": []` in the schema | A real **lethality model** with three kinds and a grace radius | The schema had a hazards array that was never once populated or specified. Part 5.6 |

---

# PART 1 — THE SPINE

Everything else in this document is in service of the following. If a decision does not make this better, it is not a decision, it is a distraction.

> A little guy is walking, at his own pace, directly into something that will kill him.
> The world stops one heartbeat before it happens.
> You draw **one line**.
> Time restarts.
> He lives or he doesn't, and either way you understand exactly why within one second.
> You are drawing again four seconds later.

Six facts follow from that and none of them are negotiable:

1. **The player never controls Milo.** They control the world. This is the entire differentiation. (v0.2 §86 is right.)
2. **One stroke. Once.** Not a budget of strokes, not a redraw during simulation. The constraint is what converts a doodle into a decision.
3. **The stroke becomes real matter.** Not a trigger, not a path, not a hint — a physical body with mass that other bodies collide with.
4. **Failure must be legible in under one second.** Not "eventually understandable." Legible.
5. **Retry is under one second away, always, including mid-simulation.**
6. **The whole problem is visible at once.** No camera movement, ever. If the puzzle doesn't fit on the screen, the puzzle is wrong.

**The eight-second test:** if this loop is not fun with a capsule for Milo and a grey circle for a boulder, no art, no level count, and no monetisation will save it. That is not a motivational slogan, it is the Phase 0 gate in Part 9.

---

# PART 2 — WHAT THE GAME IS COMPETING WITH, HONESTLY

v0.2 §3 surveys Save the Doge, Love Balls, Happy Glass, Draw Climber and draws the right lesson. One thing it soft-pedals that should be said plainly:

**The draw-a-line-to-save-something category is saturated, and most entrants in it are bad.** That is the opportunity and the trap in one sentence. The opportunity: the bar for *feel* is on the floor — most of these games have mushy physics, unreadable failure, and art that looks like a template. The trap: a player scrolling YouTube Playables has seen four of these already this month and will pattern-match yours to them in about 400 milliseconds.

Therefore the differentiation cannot be a design-document argument. It has to be **visible in a single still frame**, before any interaction happens. That is why Part 6 (art direction) is not downstream polish in this document — it is load-bearing, and it is why The Freeze in Part 3.1 matters twice over: the frozen disaster tableau *is* the differentiating still frame.

Three things distinguish this game from the category, and all three are visible without playing:
1. **Milo is mid-stride, not sitting still.** Every competitor's protagonist is a static target.
2. **The world is stopped mid-catastrophe.** Boulder in the air, dust suspended. Nobody else does this.
3. **The world looks hand-drawn in the same ink the player draws with.** Your line is not a foreign object placed on a stock-art background; it belongs to the world.

---

# PART 3 — THE BLIND SPOTS

Fourteen things all three documents missed, in order of how badly each would have hurt.

## 3.1 The contradiction at the dead centre of the design

v0.2 says both of these things, roughly 300 lines apart, and never notices:

> §8.1 — `ENTER LEVEL → SEE MILO + HAZARD + GOAL → DRAW ONE CONTINUOUS STROKE → RELEASE → PHYSICS / MOVEMENT PLAYS OUT`
> **This describes a frozen world. You draw, then things move.**

> §4.4 — "Time matters. The player does not have infinite contemplation. **Milo is moving. The environment is changing.**"
> **This describes a live world. Things move while you draw.**

These are different games. v0.3 quietly assumed the first ("one drawn stroke, once, *before the run plays out*"). v0.4 never revisited it. So the project's most consequential mechanical question was settled by an unexamined assumption in a document that was only trying to add `id` fields to a schema.

It matters because **"time matters" is one of the five stated differentiators (§4.1–4.5)**. Freeze the world and Milo's walking becomes presentation, not mechanics — you are now much closer to Love Balls than the bible admits, and one of your five pillars is decorative.

But going live is worse:
- Drawing accurately with a thumb while objects move is stressful in the bad way.
- Release *timing* becomes a hidden input variable, which destroys "same input → same outcome" (§11 Rule 1) at the root. Two players drawing the identical shape get different results because one was half a second slower. That is precisely the "the engine screwed me" feeling §11 Rule 2 exists to prevent.
- It makes the game hostile to the platform's actual audience: someone half-watching a video who looks away for four seconds.

### THE FIX — **THE FREEZE** — LOCKED

The level opens **live** for a short beat, then **stops**.

```
t = 0.0s   Level loads already in motion. Milo takes his first step.
           The boulder starts to tip. Dust kicks up.
t ≈ 1.2s   THE FREEZE. World time → 0. Everything holds.
           Milo is mid-stride. The boulder hangs in the air.
           A single dust mote stops halfway through its arc.
           Colour drains ~35% toward monochrome. One accent colour survives:
           the thing that is going to kill him.
[ ∞ ]      The freeze holds forever. No timer. No pressure to be fast.
           The player draws whenever they like — now or after
           they finish the video they were watching.
RELEASE →  Colour floods back. Time resumes at 100%. The run plays out.
```

**Why this is the right answer and not a compromise:**

1. **It keeps both halves of the contradiction.** You *see* a live, moving, urgent world — the walk, the tip, the dust — so the danger reads as imminent and Milo reads as alive. Then you get to think. Urgency is delivered as *staging*, not as time pressure.
2. **It restores full determinism.** The freeze happens at a fixed world-time. Release timing is not an input. Same stroke → same outcome, always. §11 Rule 1 is satisfied at the architecture level rather than hoped for.
3. **It is platform-fit, which is the part nobody would have found by thinking about the game alone.** v0.2 §2 correctly identifies that this audience is *distracted and multi-tasking*. A frozen world is a game that waits for you infinitely without a pause menu. The core mechanic and the platform's ugliest constraint turn out to be the same shape. That is rare and it should be exploited, not just tolerated.
4. **It is the marketing asset.** v0.2 §81 asks for a thumbnail that raises "how is he getting out of that?" The freeze *is* that image, generated automatically by every single level, every single time. You do not have to art-direct a thumbnail — the game is permanently paused on one.
5. **It gives the game a name for its own mechanic.** "Bullet-time drawing." Categories are easier to escape when you have your own noun.

**Later-world variant (not V1):** a *soft* freeze where world time runs at 3–5% instead of 0 — the boulder creeps downward while you draw. Reserve this for a Challenge mode. It is a genuine difficulty axis that costs nothing to build once the freeze exists, and it is the correct home for the "time pressure" instinct that made §4.4 want a live world in the first place.

---

## 3.2 Nobody said whether the player's line is allowed to fall over

v0.3 §4.4 step 5, in nine words: "static-until-release, then dynamic-on-release." That is the entire specification of the physical behaviour of the object the whole game is about.

Read it literally and it means: **whatever you draw, if it isn't resting on something, falls down.** Draw a wall in mid-air — it drops. Draw a wall on the ground — it topples the instant the boulder touches it, because it is a tall thin rectangle with a high centre of mass and nothing holding it.

v0.2 §87 actually presents this as a *feature*, its model learning loop being "wall falls over → player learns: need an anchor." That is a nice story, but read it again — **the doc invented the word "anchor" for a system that does not exist anywhere in any of the three documents.** There is no anchoring. There is no way to anchor. The player is told to learn a lesson the game has no mechanism to teach.

This is the fairness bug that the entire Fair Physics Principles section (§11) is nervous about, and it went unspecified in all three passes.

The options:

- **Fully dynamic.** Maximum emergence, maximum frustration. Every level becomes a structural-engineering problem on top of the puzzle. The player's failure is usually "my thing fell over," which is legible but *boring* and not the puzzle you designed.
- **Fully static** (drawn line is immovable terrain). Perfectly predictable, but you delete four verbs from §17 outright — WEDGE, SUPPORT, COUNTERWEIGHT, and half of LAUNCH — and floating immovable matter looks like a bug.

### THE FIX — **ANCHORED-DYNAMIC** — LOCKED

> **Any part of the stroke that is touching static level geometry at the moment of release is welded to it. Anything not touching anything is a free dynamic body.**

Implementation: at release, test the stroke's geometry against all static bodies. Every contact point becomes a fixed constraint (a weld). Zero contacts → ordinary dynamic body, and it will fall, and it should.

Why this is the best idea in this document:

- **It teaches itself in one attempt.** Draw floating, it falls, you saw it fall — next time you touch the ground. That is a complete lesson delivered by consequence with zero text, which is exactly what §56 asks for and never explains how to achieve.
- **It gives the player deliberate control over stability instead of random toppling.** Stability becomes a *choice you draw*, not a dice roll.
- **It preserves every verb.** A SUPPORT is a stroke you deliberately anchor. A COUNTERWEIGHT is a stroke you deliberately do *not* anchor. The mechanic gives the player both, from one rule.
- **It makes A1 (the wall) work reliably** — people naturally draw a wall starting from the ground, so the tutorial level succeeds for the right reason instead of by luck.
- **It creates the "this is now real" moment §45 asks for, with actual information in it.** On release, anchor points flash and spark. The player instantly sees whether their structure is attached. That single VFX carries the entire stability model with no UI.

**Anchor rules — LOCKED:**
- Welds attach only to **static** geometry (ground, walls, platforms). Never to dynamic objects, never to Milo, never to the goal.
- A weld is rigid, not springy. It does not break. (A breakable-anchor / structural-stress system is a real World-2+ idea. It is not V1.)
- Maximum 8 weld points per stroke, chosen as the most-separated contacts, to keep the constraint solver cheap and stable.
- Anchor state is computed **once**, at release. A stroke that later comes to rest against the ground does not become anchored.

---

## 3.3 The game has no way to tell the player why they died

This is the difference between a puzzle and a guessing game, and all three documents treat it as a principle rather than a system.

v0.2 §11 Rule 2: "Failure must have an obvious cause." §89: "Visible causality." Both correct. Neither is a mechanism. v0.4 proposes 300 ms of 20% slow-motion on failure, which is a genuine improvement and still only tells the player *that* they died, in slower motion.

The attribution problem here is much harder than in the games being copied. In Save the Doge the scene is static and there is one threat. Here, at the moment of death, **three independent things are in motion**: Milo (walking), the hazard (falling/rolling), and the player's own drawing (which has mass and may have moved). When it goes wrong, the player has to work out which of the three betrayed them — and they only saw it once, at full speed, in about 200 ms.

If they can't attribute failure, they can't form a new hypothesis, and §8.2's micro-loop ("evaluate → adjust mental model → retry") silently degrades into "draw something slightly different and hope." That is the exact failure mode that makes physics games feel random, and it is listed as Risk 2 and as a kill criterion in v0.2 — with no countermeasure attached.

### THE FIX — three systems, all LOCKED

**(a) Causality tracking.** The simulation records, continuously and cheaply: the last body Milo touched, the impulse of that contact, and whether that body was itself set in motion by the player's stroke. On death the game therefore knows the *chain*, not just the outcome: `stroke → deflected boulder → boulder hit Milo`. This costs one collision handler and a small ring buffer.

**(b) The death cam.** On failure: freeze at the fatal frame. Hold 250 ms. Then replay the last **1.4 seconds** at 25% speed, with the guilty body outlined in the danger accent colour and everything else desaturated, and a single short label — `TOO SHALLOW`, `IT FELL`, `IT WENT UNDER`, `MISSED THE EDGE`, `TOO LATE`. Nine or ten labels cover essentially every failure in the game. Then straight to retry. Total: ~1.8 s. That is the cost of *understanding*, and it is worth more than the 1.8 s it spends.

**(c) The ghost stroke — the single highest-leverage feature in this document.** On retry, **the player's previous stroke is drawn faintly behind the level.** It does not collide. It is just there.

This converts the loop from *redraw blind* into *adjust*. The player can see their last ramp was too shallow and draw a steeper one **relative to a visible reference**, instead of re-guessing an angle from memory. It is the physical substrate for §8.2's "adjust mental model," and without it that step happens purely in the player's head with nothing to hold on to.

It also turns out to be free content: the ghost gives the player a visible record of their own learning, which is exactly the "I know what to do, I just need to do it better" feeling §57 identifies as healthy difficulty.

*Tuning note:* ghost shows the last attempt only, at ~18% opacity, and clears on success. A toggle is not needed; nobody has ever wanted less information after failing.

---

## 3.4 The physics, as specified, is broken — and it is arithmetic, not opinion

This one is not a design judgement. I ran the numbers.

The spec sets gravity at 1800 u/s² (v0.3 §4.6) in a world 1280 units tall (v0.3 §4.2), with a drawn line 14 units thick (v0.3 §4.6), stepped at 60 Hz (v0.4 §8.2).

```
Object falling the height of the world:
  t = sqrt(2 × 1280 / 1800)  = 1.193 s
  v = 1800 × 1.193           = 2,147 units/s

Distance travelled per physics step:
  at  60 Hz →  35.8 units   ← v0.3 + v0.4 as written
  at 120 Hz →  17.9 units   ← v0.4's own proposed fix
  at 240 Hz →   8.9 units

Drawn line thickness: 14 units.
```

**At 60 Hz the boulder moves 35.8 units per step through a 14-unit-thick line. It does not collide with it. It passes through it.** Matter.js has no continuous collision detection — no swept tests, no bullet bodies — so a body that starts one side of a thin obstacle and ends the other side in a single step simply never generates a contact.

The player draws a perfect wall. The boulder goes through it like it isn't there. There is no error, no warning, nothing in the logs. It looks exactly like a physics engine being flaky, which is the single most demoralising bug class to debug and the one most likely to make a team conclude "the mechanic doesn't work" when in fact the mechanic was never tested.

**v0.4's 120 Hz fix does not solve it** — 17.9 units per step is still wider than the 14-unit line.

### THE FIX — LOCKED, three parts, all three required

```js
export const PHYSICS_HZ   = 120;   // fixed timestep, 8.333 ms
export const MAX_SPEED    = 900;   // units/s, hard clamp on EVERY dynamic body
export const LINE_THICKNESS = 16;  // up from 14
```

The safety condition is `displacement_per_step ≤ 0.5 × thickness`, the half-thickness margin being what lets the solver actually build a stable contact manifold rather than catching the very edge of one:

```
900 u/s ÷ 120 Hz = 7.5 units/step   ≤   0.5 × 16 = 8 units   ✓
```

The speed clamp is applied after every step, to every dynamic body, including Milo. Anything exceeding 900 u/s has its velocity vector rescaled to 900.

**The clamp is not a hack — it improves the game.** It is a terminal velocity, which is a normal and invisible game convention, and it directly serves §11 Rule 5 ("prefer dramatic readable physics over microscopic accuracy"). Objects moving faster than 900 u/s cross the entire 720-unit puzzle column in under 0.8 seconds — far too fast to read anyway. The clamp bites only in the regime where the game had already stopped being legible.

Free fall reaches the clamp in 0.5 s after dropping 225 units, so anything falling from more than ~225 units is travelling at a constant, predictable, *learnable* speed by the time it matters. That is better for the puzzle than true acceleration.

**Acceptance test (must exist before A1 is built):** drop a body from y=100 with no obstacles and assert its position at t=0.25 s and t=0.50 s matches the analytic prediction within 1%, and assert its speed never exceeds 900. Then fire a body at 900 u/s at a 16-unit static line 20 times from 20 angles and assert 20 collisions. **If that second test fails, stop and swap the engine** (see Part 5.4). Do not proceed to level building on an engine that leaks.

---

## 3.5 There is no unit scale, so no constant in the project can be sanity-checked

Not one of the three documents says what a world unit *is*. So `GRAVITY_Y = 1800` cannot be evaluated as right or wrong by anyone, ever — it is an unfalsifiable number, and every constant downstream of it inherits that.

### THE FIX — LOCKED

> **Milo is 72 units tall and represents a person 1.73 m tall. Therefore 1 world unit = 2.4 cm.**

Immediately everything becomes checkable:

| Quantity | World units | Real-world equivalent | Verdict |
|---|---|---|---|
| World height 1280 | 1280 u | 30.7 m | A tall building. Right for a level of dramatic falls. |
| Safe column 720 | 720 u | 17.3 m | A generous backyard. Correct. |
| Real gravity | 408 u/s² | 9.81 m/s² | reference |
| **Spec gravity 1800** | 1800 u/s² | **4.4 × real** | Snappy-arcade. Defensible, at the top of the normal band (games use 1.5–3×). **TUNE: try 1400 (3.4×) in Phase 0.** |
| Milo's walk 220 u/s | 220 u/s | 5.3 m/s | A jog, not a walk. Fine — he should look eager to die. |
| Speed clamp 900 u/s | 900 u/s | 21.6 m/s ≈ 78 km/h | Correct for "a boulder you must not be under." |

This table is not decoration. It is the thing that lets a person other than the author look at a constant and say "that's wrong."

---

## 3.6 Milo cannot actually walk

Milo is a physics body (v0.4 §8.1: 36×72, chamfer 16) that must "move toward the goal" (v0.2 §12.1). **How** is never specified anywhere. That gap contains three separate unsolved problems:

**(a) Locomotion model.** If Milo is a dynamic body pushed by force, he tips over, spins, and behaves like a crate. If he's kinematic, he ignores the physics that the entire game is made of. Neither works alone.

**(b) He cannot get onto the bridge he was just drawn.** The drawn line is 16 units thick. Milo is 72 tall. A2 (GAP) asks him to walk from flat ground onto a bridge whose edge is a 16-unit vertical lip. A capsule body walking at 220 u/s into a 16-unit step either stops dead against it or catches on it and tips. **The tutorial level for "your line becomes terrain" does not work without a step-up rule, and no document has one.**

**(c) Slopes.** A3 wants a 30–40° deflector. If the player instead draws a 55° ramp under Milo, does he climb it? Slide? Stall halfway and trip the stuck timer? Undefined.

### THE FIX — LOCKED: three-state locomotion

```
WALKING   — grounded. Horizontal velocity is SET to ±speed each step.
            Vertical velocity owned by physics. Rotation locked upright.
AIRBORNE  — not grounded. Full physics. Rotation unlocked.
            He tumbles, and it is funny, and that is the point.
STUNNED   — after any impact above the stumble threshold.
            Full physics + rotation for STUN_MS, then re-stand if grounded.
```

```js
export const MILO = {
  speed:        220,   // u/s — TUNE
  maxStepUp:     22,   // u — auto-assisted; > LINE_THICKNESS(16) so bridges work
  maxWalkSlope:  40,   // deg — steeper: he slides back and stumbles
  groundProbe:    6,   // u below feet
  stumbleImpulse: 40,  // TUNE — below this he staggers; above, STUNNED
  stunMs:       700,   // TUNE
};
```

`maxStepUp: 22` is deliberately larger than `LINE_THICKNESS: 16`. **That single inequality is what makes A2 work at all**, and it is the kind of relationship between two constants in different files that no amount of prose review catches — only arithmetic does.

Step-up is a teleport-assist, not a jump: when grounded, moving, and blocked by an obstacle whose top is ≤22 u above the feet, lift the body to stand on it. Standard platformer practice, invisible to the player, and the reason he doesn't trip on his own bridge.

---

## 3.7 The schema has an empty `hazards` array that is never once specified

v0.3 §4.3's schema contains `"hazards": []`. It is empty in the example, empty in A1–A4, and never defined in any of the three documents. **Nothing in the entire project says what makes something lethal.**

This is not pedantry. It decides whether the game is fair. Consider: the player successfully blocks the boulder. It rolls to a stop, resting against their wall, on Milo's path. Milo walks into it at 220 u/s. Does he die?

If any contact with a boulder is lethal — **the player solved the puzzle and was killed for it**, which is the worst possible outcome in a game whose stated principles are about fairness.

### THE FIX — LOCKED: three lethality kinds + a grace radius

```jsonc
{ "id": "spike1",   "lethal": { "kind": "contact" } },
{ "id": "boulder1", "lethal": { "kind": "impact", "minImpulse": 55 } },
{ "id": "pitfloor", "lethal": { "kind": "zone" } }
```

- **`contact`** — any touch kills. Spikes, fire, lava, saw blades. Unambiguous, and read as unambiguous by the art (spiky, red, obviously bad).
- **`impact`** — kills only above a relative-impulse threshold. **This is the important one.** A boulder screaming down at 900 u/s kills. The same boulder at rest is furniture Milo bumps into. This makes "block it, then walk past it" a legitimate, satisfying, physically-honest solution — and it is what makes BLOCK a real verb rather than a euphemism for "delay your death."
- **`zone`** — an area, not a body. Pit floors, out-of-bounds, water. Used for A2's fall failure.

**`graceRadius`** (default 6 u, on every hazard): the lethal test uses a Milo hitbox shrunk by this much. This is the concrete mechanism for v0.2 §54's "Milo should not die because his toe touched a hazard by one pixel," which was stated as a wish in one document and implemented in none.

**Fairness rule — LOCKED:** every `contact` hazard must be visually distinct from every `impact` hazard at a glance. Spikes look like spikes. Boulders look like rocks. The player must never have to learn by dying which category an object is in. This constrains art direction, and Part 6 honours it.

---

## 3.8 There is no way to know whether a level is solvable, or what its star thresholds are

v0.2 §22.1 says star thresholds "should be data-driven per level." v0.3's schema duly contains `twoStarLength: 620` and `threeStarLength: 420`. **Where do those numbers come from?** There is no data. The game hasn't shipped. They were invented.

And the deeper problem underneath: with emergent physics and multiple encouraged solutions, **how does the designer know a level is solvable at all** — or that it isn't solvable in a way that trivialises it, or that it doesn't demand a pixel-perfect stroke (which v0.2 §58 defines as "too hard")? Playing it yourself proves only that *you* can solve it, and you designed it.

v0.2 lists the content treadmill as Risk 4 and offers "data-driven levels + reusable components" as the mitigation. That is not a mitigation, it is a file format.

### THE FIX — LOCKED: the solver harness (Phase 1 deliverable, not optional)

Matter.js runs headless in Node. The renderer is not required to simulate. So:

> Generate thousands of candidate strokes per level. Simulate each one at the real fixed timestep. Record the outcome.

Stroke families are parametric, not random — random strokes tell you nothing about human play:
- straight segments swept across angle × position × length
- arcs swept across curvature × position
- bowls/closed shapes swept across width × depth × position
- L-shapes and steps (the "wall on a base" family real players draw)

Each family is also jittered ±8 units to simulate an imprecise human hand.

**What it outputs per level:**

| Output | Meaning | Gate |
|---|---|---|
| `solvable` | ≥1 stroke succeeds | **Hard fail if false.** Level cannot ship. |
| `solutionBreadth` | % of plausible strokes that succeed | **< 2% = too hard** (v0.2 §58). **> 40% = too easy** (§57). |
| `precisionFloor` | how far a winning stroke can be jittered and still win | **Hard fail if < 25 units.** See 3.14. |
| `distinctFamilies` | how many *different* stroke families win | ≥2 for levels intended to have multiple solutions (§21) |
| `starThresholds` | 2★ = 60th pct of winning stroke lengths, 3★ = 20th pct | Replaces guessed numbers with measured ones |
| `unintendedSolutions` | winning families the designer didn't predict | Read these. Some are better than your intended solution. |

**And the thing that makes the whole project survivable:** it is a **regression suite**. When you retune gravity in month three, re-run all 24 levels in ninety seconds and see exactly which ones broke. Without it, every physics tune is a silent risk to every level ever built, and the team stops tuning — which means the game stops improving — which is the real reason these projects die at 70% done.

This is cheap. It is the same engine with no renderer, a few hundred lines. It is the highest return-per-line-of-code in the entire project.

---

## 3.9 Art is treated as a purchasing problem when it is a rendering problem

v0.3 §2.7 calls this "the biggest real gap in the whole document" and it is right, but it then files it as a resourcing question — hire someone, or use AI and clean it up — and hands it back to the user unanswered. v0.4 doesn't touch it.

The constraints in play are genuinely tight, and they are in tension:
1. Eight animation states minimum (v0.2 §7.2).
2. A ≤15 MB payload target, and payload is startup time, and startup time is abandonment (§37, §2).
3. "Obvious AI-generated art" is a stated certification risk (§44).
4. The character must carry the entire comedy of the game with no dialogue (§6, §27).
5. And the user's actual requirement, stated plainly: it has to look good enough that someone *wants* to play it.

Sprite sheets satisfy 1 and fail 4 outright — a sprite of Milo being hit by a boulder is the same 8 frames whether the boulder grazes his hat or flattens him. The comedy in §27 is *reactive*, and sprite sheets cannot react.

### THE FIX — LOCKED: everything is drawn at runtime

The answer to all five constraints simultaneously is to make art a **rendering system** rather than an asset pipeline. Full specification in Part 6. In summary:

- **Milo is a code-driven articulated rig** — head, torso, two arms, two legs as vector shapes, posed by an animation state machine and blended with live physics. The eight named states become poses and blends, not sheets. Cost: ~0 KB. Benefit: he reacts *continuously* to danger rather than playing one of eight canned clips.
- **The world is drawn with a "boiling line" renderer** — hand-drawn-looking strokes with per-frame jitter, on paper-grain. Every rock, platform and hazard is code-drawn.
- **Therefore the player's stroke is made of exactly the same ink as the world.** This is the thematic payoff and it is worth stating loudly: *the world is drawn, so your drawing belongs to it.* No competitor in this category has that, because they all use stock or purchased art with the player's line laid on top as a foreign object.
- Certification risk 3 evaporates — there is no generated art to be obvious about. It is original code.

---

## 3.10 A doomed run cannot be skipped, and might never end

Three related holes:

- **No abort.** Once released, the player watches. v0.2 §30 warns that a 15-second restart damages the game — but the *simulation itself* can run that long, and 90% of the time the player knows they've failed within the first second. Forcing them to watch is a tax on the exact loop the game is built around.
- **No hard timeout.** v0.4 gives a 3-second stuck timer, but a run can be non-stuck and non-terminating for a long time — a slow roll, a gentle oscillation, Milo pinned but jittering. §14 lists "a required objective becomes physically impossible" as a failure condition with no detection whatsoever.
- **The step cap is a silent determinism leak.** v0.4's `MAX_STEPS_PER_FRAME = 5` means a hitch *drops physics steps* — the simulation quietly diverges from what it should have been, in a game whose first principle is that the same input gives the same outcome.

### THE FIX — LOCKED

- **Tap anywhere during simulation → instant retry.** No confirm, no menu. The most-pressed button in the game should be the whole screen.
- **`RUN_TIMEOUT = 12 s` of simulated time**, always. Ends the run as `timeout`, which reads to the player as a fail with the label `HE'S STILL OUT THERE`.
- **Never drop physics steps during an active simulation.** If the accumulator exceeds ~8 steps, the tab was backgrounded — and the platform pause should already have fired. Handle it as *resume-from-pause*, not as catch-up. Fabricating 400 ms of physics in one frame is worse than a visible hitch, and it breaks determinism to hide a stutter nobody was watching.

---

## 3.11 The first eight seconds — the thing the platform judges — are not designed

v0.2 §49 says the right thing ("Milo is already visible. The danger is already visible") and §1.4 lists what the first ten seconds must communicate. Neither is a script, and nobody wrote one. For a Playables title this is the single highest-stakes ten seconds in the product.

### THE FIX — LOCKED: the boot script

```
0.0 s  First frame. Level 1's frozen tableau is ALREADY on screen.
       No logo. No studio card. No loading bar. No "tap to start."
       Milo mid-stride, boulder hanging, everything held.
0.0 s  Signal first-frame-ready to the host immediately.
0.3 s  The danger accent colour pulses once on the boulder. Once.
1.5 s  The word "DRAW" fades in near Milo's feet at low opacity.
       It is one word. It is not a tutorial.
4.0 s  If untouched: a ghost hand draws a short stroke in the air,
       from the ground upward, and dissolves. Loops every 3 s.
       Level 1 only. Never again.
  ∞    Wait. Forever. The freeze does not expire.
```

**Target: first stroke begun within 5 seconds of load, with zero taps spent on menus.** The main menu exists but is reached *from* the game, not before it. Nobody has ever quit a game because the menu was one tap further away; plenty have quit at a splash screen.

---

## 3.12 "60 levels" is not a plan, and unsized plans are how games end mid-air

v0.2 §52 asks for 20–30 for MVP, 60 for first release, 100+ after. No hours attached to any of them. This is the actual mechanism by which the thing you're afraid of happens: the prototype works, everyone's excited, content production starts, each level turns out to cost three hours to author-tune-and-verify, sixty levels is a hundred and eighty hours, and the project quietly stops at level 22 with no shippable build — because nothing was ever *defined* as shippable.

### THE FIX — LOCKED: name the shippable game, then measure the cost of everything past it

> **The shippable game is 24 levels in one world, with a complete meta shell. That is a finished product. Everything beyond it is upside.**

"Complete meta shell" is doing real work in that sentence and is defined in Part 7.5 — it is what stops the game *ending mid-air* in the literal sense of a player finishing level 24 and getting a blank screen.

And **level authoring cost becomes a tracked metric from the first level of Phase 1.** Target ≤ 45 minutes per level including tuning, solver verification and star thresholds. If real cost lands at 3 hours, you do not push through — you cut to 20 excellent levels and spend the difference on feel. A level that makes someone quit is negative inventory (v0.2 §52 says this well); twenty-four good ones beat sixty tired ones, and the decision must be made on measured cost rather than optimism at month three.

---

## 3.13 There will be no analytics on the platform, which changes what the open-web build is for

v0.2 §73 correctly notes no external analytics backend inside the closed sandbox. It does not state the consequence: **on Playables you are flying blind.** No funnels, no retention curves, no A/B tests. Every number in v0.2 §68's excellent metrics list is unobtainable there.

Therefore the open-web build (§71 Phase 3) is not a warm-up — **it is the only instrumented version of this game that will ever exist**, and it is where every one of the design questions in §94 and §95 actually gets answered. That is an architecture requirement, not a scheduling note: analytics sits behind the same adapter pattern as storage, fully no-op in the Playables build, real on open web. Build it in from the first commit, because retrofitting instrumentation into a finished game is how you end up shipping on vibes.

---

## 3.14 The player is drawing with a thumb, on top of the thing they are drawing

Never mentioned once in ~3,700 lines across three documents. The safe column is 720 units of a 1280-tall world — on a portrait phone that is essentially the full screen width, so the puzzle is roughly 6 cm across in the player's hand, and **their finger is covering the part they are drawing on.**

### THE FIX — LOCKED

- **The precision floor:** *no level may require a stroke placed more accurately than ±25 world units to succeed.* Any level that does is a broken level, not a hard level. This is machine-checkable — it is the `precisionFloor` output of the solver harness in 3.8, and it is a hard gate.
- The stroke renders with a **crisp bright core and a soft outer glow** so its position is readable from the few millimetres visible around a fingertip.
- Nothing puzzle-critical in the bottom 90 units of the world (thumb-rest zone) or under the top-right HUD.
- The drawn line snaps to nothing and requires no target. Anchoring (3.2) is by *contact*, with a 6-unit tolerance — so "close enough to the ground" counts as touching the ground. Forgiveness lives in the systems, not in the player's aim.

---

# PART 4 — THE GAME, LOCKED

## 4.1 The loop

```
LOAD ─────► LIVE BEAT (1.2 s) ─────► THE FREEZE ─────► [player draws] ─────► RELEASE
                                          ▲                                     │
                                          │                                     ▼
                                          │                                 SIMULATION
                                          │                              (≤ 12 s, tap = abort)
                                          │                                     │
                                    ┌─────┴──────┐                    ┌─────────┴─────────┐
                                    │   RETRY    │◄───────────────────┤  DEATH CAM (1.8s) │
                                    │ +ghost     │      failure       └───────────────────┘
                                    └────────────┘                              │ success
                                                                                ▼
                                                                      RESULT ─► NEXT LEVEL
```

State machine (extends v0.2 §74, which was already good enough to code against):

`BOOT → FIRST_FRAME → LIVE_BEAT → FROZEN → DRAWING → COMMITTED → SIMULATION → {DEATH_CAM → RETRY} | {SUCCESS → RESULT → next}`

`PAUSED` is orthogonal and can be entered from any state; it restores exactly, with no physics catch-up.

## 4.2 The one-stroke contract — LOCKED

- One stroke per attempt. Pointer-down to pointer-up. No exceptions in the core mode.
- The stroke is rejected (snap back, no penalty, keep drawing) if:
  - fewer than 2 points survive simplification, or
  - total length < 20 u (accidental tap), or
  - total length > `drawing.maxLength`, or
  - it overlaps Milo's frozen position, or
  - it overlaps the goal, or
  - it enters a `denyZone`.
- Rejection is **never** a failed attempt. It is a no-op with a short buzz and a red flash on the offending part. The player is never punished for a technical input event (v0.2 §75, which is right and which this makes concrete).
- The pointer leaving the canvas is an **implicit release**, validated normally (v0.4 §8.6 — correct, kept).
- Multi-touch: lock to the first pointer id at stroke start; ignore all others until it ends (v0.4 §8.6 — correct, kept).
- Closed shape if start and end are within 24 u → filled polygon. Otherwise open chain of welded 16-u segments. Self-intersecting closed strokes fall back to open chain (v0.3 §4.4 — correct, kept).

## 4.3 Rating — LOCKED (thresholds measured, not guessed)

| | Name | Condition |
|---|---|---|
| ★ | RESCUED | Milo reaches the goal alive |
| ★★ | CLEAN | Stroke length ≤ 2★ threshold (60th pct of measured winning strokes) |
| ★★★ | COOKED NO MORE | Stroke length ≤ 3★ threshold (20th pct) |

Length is the only rating axis in V1. v0.2 §95-D wonders about time and elegance; both are worse — time is mostly determined by the level, and "elegance" cannot be measured, only argued about. Length is honest, legible, immediately understood, and the solver measures it for you.

## 4.4 What we are not building in V1

Carried from v0.2 §64, still correct, plus additions from this document: no multiplayer, no accounts, no backend, no inventory, no currency, no energy, no dialogue, no direct control, no procedural levels. **And new:** no camera movement, no breakable anchors, no material system, no undo-during-simulation, no level editor exposed to players.

---

# PART 5 — PHYSICS & SIMULATION SPEC

## 5.1 Units — LOCKED

1 unit = 2.4 cm. Milo = 72 u = 1.73 m. World height = 1280 u = 30.7 m. See 3.5.

## 5.2 Constants — `js/constants.js`

```js
// ── World ────────────────────────────────────────────────
export const WORLD_H      = 1280;   // LOCKED — fixed logical height
export const SAFE_COL_W   = 720;    // LOCKED — puzzle geometry lives here only
export const GRAVITY_Y    = 1800;   // TUNE — 4.4× real; try 1400 in Phase 0

// ── Simulation ───────────────────────────────────────────
export const PHYSICS_HZ   = 120;    // LOCKED — see 3.4
export const PHYSICS_DT   = 1000 / PHYSICS_HZ;
export const MAX_SPEED    = 900;    // LOCKED — anti-tunnel clamp, all bodies
export const RUN_TIMEOUT  = 12000;  // LOCKED — ms of simulated time
export const SOLVER_ITER  = { position: 6, velocity: 4 };  // LOCKED — fixed for determinism

// ── The drawn line ───────────────────────────────────────
export const LINE = {
  thickness:   16,    // LOCKED — see 3.4
  density:     0.02,  // TUNE
  friction:    0.6,   // TUNE
  restitution: 0.05,  // TUNE — reads as solid terrain, not a trampoline
  minLength:   20,    // LOCKED — accidental-tap floor
  simplifyTol: 3,     // LOCKED — Douglas-Peucker; verified not to distort ramp angles (v0.4 §8.8)
  closeDist:   24,    // LOCKED — start/end within this ⇒ closed shape
  anchorTol:   6,     // LOCKED — contact tolerance for welding
  maxAnchors:  8,     // LOCKED
};

// ── Milo ─────────────────────────────────────────────────
export const MILO = {
  width: 36, height: 72, chamfer: 16,   // LOCKED (v0.4 §8.1 — correct)
  density: 0.01, friction: 0.3, restitution: 0.1, angularDamping: 0.9,
  speed: 220,           // TUNE — level-overridable
  maxStepUp: 22,        // LOCKED — MUST exceed LINE.thickness. See 3.6
  maxWalkSlope: 40,     // deg — TUNE
  groundProbe: 6,
  stumbleImpulse: 40,   // TUNE
  stunMs: 700,          // TUNE
  graceShrink: 6,       // LOCKED — hitbox shrink for lethal tests
};

// ── Run-end detection ────────────────────────────────────
export const STUCK = { speedUnder: 12, forMs: 3000, sinceContactMs: 500 };  // TUNE (v0.4 §4.5)
export const NEAR_MISS_DIST = 30;   // TUNE — < Milo's 36u width. (v0.4 §8.4)

// ── Presentation ─────────────────────────────────────────
export const FREEZE_AT     = 1200;  // ms of live beat before the world stops
export const DEATH_CAM     = { holdMs: 250, replayMs: 1400, rate: 0.25 };
export const GHOST_OPACITY = 0.18;
```

`milo.start.y` is the **feet**, not the body centre; the loader offsets by `height/2` (v0.4 §8.1 — correct and kept, because it matches how a designer thinks).

## 5.3 The determinism contract — LOCKED

Say precisely what is promised, so nobody over-engineers and nobody under-delivers:

> **Within one device and one session, an identical stroke on an identical level produces an identical outcome, always.**
> Cross-device bit-identical determinism is **not** promised and **not** required — there is no replay validation, no leaderboard verification, and no cross-device feature that would need it.

Requirements that follow:
- Fixed timestep, never variable. Never drop steps during simulation (3.10).
- Fixed solver iteration counts (`SOLVER_ITER`) — do not let the engine adapt them.
- **Body sleeping disabled** for all gameplay-relevant bodies. Sleep thresholds are a classic source of "it worked last time."
- Deterministic body insertion order: always in level-data order, then the stroke last.
- Any randomness (dust, debris, later challenge modes) uses a seeded PRNG, seeded per *attempt* from the level id + attempt number. Purely cosmetic randomness uses a separate stream that can never touch simulation.
- Retry is a **full teardown and rebuild** from level data. No reused world, no accumulated state. This is what makes the ghost-stroke comparison meaningful.

## 5.4 Engine choice — Matter.js, behind an adapter — LOCKED with an escape hatch

v0.3 was right that hand-rolling a rigid-body solver is a multi-week trap. Matter.js is the right first choice: ~30 KB gzipped, mature, exactly the needed feature set (compound bodies, welds via constraints, collision events).

**But be honest about its two real weaknesses:**
1. **No continuous collision detection.** This is the tunneling issue in 3.4, mitigated by the 120 Hz + clamp + thickness triad — mitigated, not eliminated.
2. **Maintenance has slowed.** Not a blocker for a game this size, but not a thing to build a studio's core technology on without a plan.

**Therefore: all engine access goes through `js/physics/adapter.js`.** Nothing else in the codebase imports Matter directly — not `milo.js`, not `bodyFactory.js`, not `render.js`. The adapter exposes: `createWorld`, `addBody`, `addWeld`, `step`, `queryContacts`, `raycast`, `setVelocity`, `destroy`.

**The escape hatch:** if the tunneling acceptance test in 3.4 fails, or stacking proves unstable in Phase 0, swap to **Planck.js** (Box2D port, has proper bullet-body CCD, ~45 KB gzipped). Behind the adapter that is a one-to-two day swap. Without the adapter it is a rewrite, and that difference is the difference between a bad week and a dead project.

**Adapter note that will otherwise cost a day:** Matter.js does not take SI-style units — gravity is applied via `engine.gravity.y × gravityScale` with delta in ms, on its own internal scale. Do not assume the mapping from our `GRAVITY_Y = 1800 u/s²`. The adapter converts, and a unit test asserts free-fall distance matches `d = ½gt²` within 1% before anything else is built.

## 5.5 The drawing pipeline

```
pointerdown
  └─► sample at fixed 16 ms interval (not per raw event)
        └─► live length accumulation ─► remainingLength ─► render (v0.4 §8.7)
pointerup / pointerleave
  └─► Douglas-Peucker simplify (tol 3)
        └─► VALIDATE (4.2 reject rules) ── fail ─► snap back, buzz, no penalty
              └─► CLASSIFY: closed polygon | open chain
                    └─► BUILD compound body (16 u segments, welded joints)
                          └─► ANCHOR PASS: contacts vs static geometry
                                within anchorTol → up to 8 welds  ◄── see 3.2
                                └─► spark VFX at each anchor
                                      └─► unfreeze, SIMULATION begins
```

## 5.6 Lethality — LOCKED

Three kinds (`contact` / `impact` / `zone`) plus `graceRadius`, fully specified in 3.7. Every hazard in every level must declare one. The level loader **asserts** this at load and throws in dev if a hazard has no lethality declaration — a hazard that isn't lethal is either a bug or a prop, and the schema should force the author to say which.

## 5.7 Run-end conditions — the complete set

| Outcome | Trigger | Player-facing |
|---|---|---|
| `success` | Milo's centre enters the goal trigger, alive, `speed < 400` | NAILED IT |
| `killed` | Lethal event per 5.6 | Death cam + specific label |
| `fell` | Milo below world bounds or in a `zone` hazard | HE'S GONE |
| `stuck` | `STUCK` thresholds met | Death cam, `HE'S STUCK` |
| `timeout` | `RUN_TIMEOUT` reached | `HE'S STILL OUT THERE` |
| `aborted` | Player tapped during simulation | Straight to retry, no death cam, no ceremony |

The `speed < 400` condition on success stops the degenerate case of Milo being fired through the goal at lethal speed and counting as a rescue, which looks like a bug even when the player caused it.

---

# PART 6 — ART DIRECTION & RENDERING

This part exists because the game has to be *wanted*, not just played. On a platform where the player decides in under half a second whether to tap, the look is not the last 10% of the work — it is the first thing that happens.

## 6.1 The thesis

> **Everything in the world is drawn, in the same ink the player draws with.**

Not "hand-drawn style." Literally drawn at runtime, with the same stroke renderer that draws the player's line. The rock is a scribbled rock. The platform is a scribbled platform. The player's ramp joins a world made of the same material.

Why this is the correct decision and not just an aesthetic preference:

| Constraint | How this satisfies it |
|---|---|
| ≤15 MB payload, startup = retention (§37, §2) | Art payload ≈ **0 KB**. Entire game plausibly under 400 KB. Near-instant start on a slow connection. |
| 8 animation states (§7.2) | Poses and blends, not sheets. Adding a ninth is a function, not a commission. |
| "Obvious AI art" is a cert risk (§44) | Nothing generated. Original code. Risk gone. |
| Comedy must come from simulation (§27) | The rig reacts *continuously* to physics. Sprites cannot. |
| Must not look like a Save-the-Doge clone (§3.1, §70 R1) | Nobody in this category renders like this. It reads as *made*, not assembled. |
| Player's line must feel like it belongs (§45) | It is made of the same ink as everything else. |

The risk, stated honestly: **a procedural look done badly reads as "unfinished programmer art," which is worse than mediocre purchased art.** The mitigation is that the entire look rests on one component — the stroke renderer in 6.3 — and that component either sings or it doesn't. It is therefore built and judged **first**, in Phase 1, as a standalone test on a static scene before any level art depends on it. If it doesn't sing after a week, we know early and cheaply, and the fallback (commissioned 2D art, sprite Milo, heavier payload) is still open. See the Phase 1 cut line in Part 9.

## 6.2 Milo — the rig

Nine parts, all vector primitives: head (oversized — §7.1 wants this), torso, upper/lower arm ×2, upper/lower leg ×2. Plus a silhouette accessory (a too-small helmet, slightly crooked, permanently). Drawn back-to-front with the boiling-line renderer.

**Posing:**
- **Procedural walk** — hips and shoulders on offset sines, limbs following, a slight forward lean and a small vertical bob. Roughly forty lines of code, and it reads as *character*.
- **Physics blend** — on AIRBORNE and STUNNED, limbs blend toward a loose trailing simulation (verlet points, gravity + damping, no collision). This is the whole comedy engine: he flails *in proportion to what happened to him*, and every failure looks slightly different because it *was* slightly different.
- **The danger scalar** — this is the piece that makes him feel alive and no document proposed it:

```
danger = f(distance to nearest lethal body, closing speed)   // 0 … 1, every frame
```

One number, continuously computed, driving everything expressive:

| danger | Face | Body | Audio |
|---|---|---|---|
| 0.0–0.3 | oblivious, cheerful | normal walk, whistling bob | footsteps |
| 0.3–0.6 | eyes widen, glance up | slight flinch, arms tense | a small "hm?" |
| 0.6–0.9 | full alarm, mouth open | duck, arms up, lean away | inhale |
| 0.9–1.0 | eyes closed, braced | curl | squeak |

This produces §27's comedy — the near-miss where he stops, looks up, and carries on — **as an emergent property of one scalar**, in every level, with no per-level authoring. It is also what sells the frozen tableau: at the freeze, Milo is caught mid-flinch, and the *pose itself* tells the player how bad this is.

**The eight required states are then trivial:** idle / run (procedural), stumble (walk + noise + stagger), fall (physics blend), impact (stun pose), near-miss (danger scalar peak + a beat), victory (a scripted 12-frame pose sequence), defeat (ragdoll settle).

## 6.3 The boiling-line renderer — the component everything rests on

```
For each vector path:
  offset every point by low-frequency noise, amplitude ~1.5 u
  re-roll the noise seed every 100 ms (≈ 10 fps "boil")   ← the hand-drawn life
  stroke with a slightly variable-width dark ink line
  fill with an off-register colour patch, offset 2–3 u    ← misprinted-comic feel
  fills are flat. no gradients anywhere.
```

That is essentially the whole look. Two details carry it:
- **The boil is on a 10 fps clock while the game runs at 60.** This is what makes it read as *drawn* rather than as *jittering vectors*, and it is the single most important parameter in the renderer.
- **Off-register fill** is what makes it read as *printed* rather than *vector-clean*.

**Freeze it, and the boil is what keeps the frozen tableau alive** — a static image that still breathes. That is the difference between "the game is paused" and "the world is holding its breath."

## 6.4 Colour and hierarchy — LOCKED

v0.2 §44.3 is right and this is the concrete version:

| Layer | Treatment |
|---|---|
| Paper ground | warm off-white, subtle grain, one flat wash |
| Background | 15% opacity ink, no fill, never competes |
| Static geometry | full ink outline, muted flat fill |
| **Danger** | the **single accent** — one saturated colour, used nowhere else, ever |
| Milo | strongest ink weight, highest-contrast fill |
| **Player's stroke** | bright core + soft glow, the only glowing thing in the game |
| Goal | calm, warm, the only *soft* light source |

**The single-accent rule is absolute.** If the danger colour appears on a decorative element, the level is wrong. This is what lets a player parse a level in 400 ms with no tutorial, and it is machine-checkable in the level linter.

Accessibility (v0.2 §47): danger is **never** carried by colour alone. Every `contact` hazard is spiky in silhouette; every `impact` hazard is heavy and round. Shape carries the meaning; colour reinforces it.

## 6.5 The freeze, as a visual event

The moment the world stops is the game's signature and deserves real craft:

1. Time → 0 over ~120 ms, not instantly (a hard cut reads as a bug; a fast ease reads as *drama*).
2. Saturation drops ~35% everywhere **except** the danger accent, which stays full and pulses once.
3. Motion trails freeze as short ink streaks behind moving objects — showing *where things were going*, which is genuinely useful puzzle information delivered as style.
4. A dust mote hangs mid-arc.
5. The boil keeps boiling.
6. Vignette closes very slightly.

Then on release, all of it snaps back over ~80 ms and the world lurches into motion. That contrast — held breath, then chaos — is the eight seconds the entire game is selling.

## 6.6 Effects budget

Small, deliberate, and mostly in service of legibility:
- **Anchor sparks** on release — carries the entire stability model (3.2).
- **Impact bursts** — radial ink flecks, scaled by impulse, so a big hit *looks* big.
- **Near-miss** — a single arc of accent colour swiping past Milo (v0.4 §9 asks for this; kept).
- **Success** — the goal blooms warm; Milo does his one scripted celebration.
- **Screen shake** — proportional to impulse, capped hard, **and gated on `prefers-reduced-motion`** (v0.4 §9 — correct, kept, and extended to cover the death-cam slow-motion and the freeze desaturation).

No particles beyond flecks. No gradients. No blur. No bloom. The look is ink and paper; every effect must be something you could do with a pen.

## 6.7 Audio — procedural, and it must be omissible

The sourcing gap (v0.3 §2.8) dissolves the same way the art gap did: **synthesise the SFX with WebAudio.** Impacts, whooshes, the stroke-release *thunk*, the anchor snap, UI ticks, Milo's squeaks — all are short synthesised envelopes. 0 KB, no licensing, no contractor, and impact sounds can be **driven by collision impulse**, so they match what you just watched instead of being one canned thud.

Honest limit: **procedural music generally sounds cheap.** So: SFX are synthesised and ship in V1; music is either one commissioned/licensed loop or **nothing at all**. Nothing is a legitimate choice here — this game is played inside YouTube, often alongside other audio, and a game that is silent-by-default and *comfortable* about it is better than one with a tinny loop fighting the video the player is watching.

**Absolute rule (v0.2 §46, and it is right):** no information is ever carried by audio alone. The game must be fully playable and fully legible on mute, because much of the time it will be.

## 6.8 The acceptance test for the entire art direction

> **Take any single frozen frame from any level. Crop it 16:9. Show it to someone who has never heard of this game, with no title and no text on it. If they don't ask "what happens next?", the art direction is not finished.**

Brutal, checkable, and exactly the bar the platform sets (v0.2 §81 asks for precisely this and provides no way to test it). Run it at the end of Phase 1 on five separate people. It is a gate, not a vibe.

---

# PART 7 — THE LEVEL SYSTEM

## 7.1 Schema v1 — LOCKED

Extends v0.3 §4.3 (whose `id`/`triggers` fix was correct) with lethality, anchoring surfaces, and the fields the solver needs.

```jsonc
{
  "id": "backyard-01",
  "world": "backyard",
  "verb": "WALL",                     // primary teaching verb — for the linter and the curve audit
  "milo": { "start": { "x": 100, "y": 1080 }, "speed": 220 },   // y = FEET
  "goal": { "id": "goal", "x": 620, "y": 1080, "w": 80, "h": 140 },

  "static": [                          // level geometry. anchorable. never moves.
    { "id": "ground", "type": "platform", "x": 0, "y": 1152, "w": 720, "h": 128 }
  ],

  "objects": [                         // dynamic bodies
    { "id": "ball1", "type": "boulder", "x": 400, "y": 200, "radius": 30,
      "density": 0.03, "restitution": 0.3,
      "lethal": { "kind": "impact", "minImpulse": 55, "graceRadius": 6 } }
  ],

  "zones": [                           // non-body lethal / logical regions
    { "id": "pit", "kind": "zone", "x": 300, "y": 1250, "w": 200, "h": 60, "lethal": true }
  ],

  "drawing": {
    "maxLength": 900,
    "denyZones": [],
    "requiredAnchorZones": []
  },

  "solver": {                          // filled BY the harness, not by hand — see 7.3
    "solvable": true,
    "solutionBreadth": 0.14,
    "precisionFloor": 41,
    "distinctFamilies": 2,
    "twoStarLength": 620,
    "threeStarLength": 420
  }
}
```

Two rules about this schema:
- **`solver` is machine-written.** A human typing star thresholds by hand is the thing 3.8 exists to abolish. The harness writes this block back into the level file.
- **The loader asserts** on load, in dev: every object inside world bounds and the safe column (v0.4 §8.3 — correct, kept); every hazard declares lethality; every `triggers` target exists; `maxLength` ≥ the 3★ threshold.

## 7.2 The verb grammar

v0.2 §17's twelve verbs are a genuinely good, reusable vocabulary — the best structural idea in that document. Kept intact: BLOCK, BRIDGE, RAMP, CATCH, SHIELD, REDIRECT, WEDGE, SUPPORT, COUNTERWEIGHT, FUNNEL, TRIGGER, LAUNCH.

Anchoring (3.2) adds a thirteenth that falls out of the mechanic for free, and it's the most interesting one:

> **13. UNANCHOR** — deliberately drawing something that *will* fall, because you want its mass in motion. A counterweight, a dropped plug, a swinging arm.

Every level declares its primary `verb`. That is not bookkeeping — it lets the linter audit the difficulty curve mechanically and catch "we accidentally shipped four BLOCK levels in a row," which is the actual texture of a boring content run.

## 7.3 The solver harness — Phase 1 deliverable

Fully specified in 3.8. Restating the hard gates, because these are what a level must pass to ship:

| Gate | Rule |
|---|---|
| Solvable | ≥ 1 winning stroke, or the level cannot ship |
| Not too hard | `solutionBreadth` ≥ 2% |
| Not too easy | `solutionBreadth` ≤ 40% |
| Thumb-playable | `precisionFloor` ≥ 25 u (see 3.14) |
| Multi-solution (where intended) | `distinctFamilies` ≥ 2 |
| Stars | measured percentiles, never hand-typed |

Runs as a regression suite across all levels after any physics change. Ninety seconds, headless, no renderer.

## 7.4 The 24 levels — the shippable game

One world (Backyard Chaos). New idea every second or third level; consolidation between. Every level names the verb it teaches and the *specific* thing the player learns.

| # | Name | Verb | Introduces | The lesson |
|---|---|---|---|---|
| 1 | WALL | BLOCK | — | The line is real matter and it stops things |
| 2 | GAP | BRIDGE | pit / `zone` lethality | The line is terrain he can walk on |
| 3 | HANG | BLOCK + anchor | **anchoring** | Touch something solid or it falls |
| 4 | SLANT | REDIRECT | angle | *Shape* matters, not just presence |
| 5 | BOWL | CATCH | **closed shapes** | You can catch him — and leave the exit open |
| 6 | STEP | RAMP | slope | The line helps Milo *move*, not just stops threats |
| 7 | PROP | SUPPORT | collapsing platform | Anchor both ends, or it's a see-saw |
| 8 | JAM | WEDGE | rolling hazard | Geometry as a mechanism, not a barrier |
| 9 | CHUTE | FUNNEL | guiding | Sometimes you steer it instead of stopping it |
| 10 | THE SWITCH | TRIGGER | switch → gate | **One stroke, several consequences** (the bible's headline moment) |
| 11 | DEAD WEIGHT | UNANCHOR | free-falling stroke | Not anchoring is also a tool |
| 12 | ON TIME | timing | moving hazard | *When* matters as much as *where* |
| 13 | YEET | LAUNCH | launching Milo | You can throw him to safety |
| 14 | TWO JOBS | BLOCK + BRIDGE | one stroke, two roles | Efficiency starts here |
| 15 | EITHER WAY | CHOICE | two clean solutions | There isn't one right answer |
| 16 | LET IT GO | SACRIFICE | destructible prop | Sometimes you lose something to win |
| 17 | THREAD IT | constrained | `denyZones` | Placement under constraint |
| 18 | SWING | timing | pendulum | Read a rhythm before you commit |
| 19 | DOMINO | chain | object → object | Objects act on each other, not just on Milo |
| 20 | DON'T | inversion | — | Blocking it **kills him**. Let it through |
| 21 | RUBE | TRIGGER ×3 | 3-step chain | The full chain-reaction payoff |
| 22 | LESS | mastery | tight `maxLength` | Say it with less ink |
| 23 | ALL OF IT | combined | — | Everything at once |
| 24 | WELL DONE | finale | spectacle | The one they'll screenshot |

Level 20 (DON'T) is the most important level in the set and the one most likely to be cut for being awkward — **don't cut it.** It is the level that proves the game is about *thinking* rather than about drawing walls, it inverts the habit built by the previous nineteen, and it is the level people will talk about.

Hazard introduction is deliberately slow: rolling ball (1) → pit (2) → falling object (3) → boulder (4) → collapsing platform (7) → switch/gate (10) → moving hazard (12) → pendulum (18). Eight hazard types across 24 levels. v0.2 §25 lists five tiers of hazards; **most of them are not needed and adding them would be the content treadmill starting early.**

## 7.5 The meta shell — this is what stops the game ending mid-air

A player who finishes level 24 and gets a blank screen has played an unfinished game, no matter how good levels 1–24 were. "Complete" means all of the following exist:

- **Level select** — a single scrollable board showing all 24 with their stars. It is also the progress fantasy; it should look like a wall of polaroids of Milo's near-death experiences.
- **Star totals** — /72, visible, with a meaningful threshold.
- **A real ending.** Finishing 24 gives a payoff screen: a stat card — *"Milo survived 24 disasters. You drew 6,412 metres of line. He was nearly killed 61 times."* Those numbers are cheap to track and they are the thing people screenshot.
- **Post-ending content that exists on day one** — the 3★ chase across all 24 levels, which is real content the mastery loop (§33) already generates for free.
- **Settings** — sound, reduced motion, reset progress.
- **Save/restore** that survives a killed tab, mid-run.
- **A clean "more coming" state** rather than a dead end, if more is coming.

This list is not polish. **It is the definition of "finished," and it is scheduled in Phase 2, not left to the end** — because the things left to the end are the things that don't happen.

---

# PART 8 — ARCHITECTURE & PLATFORM

## 8.1 File layout

Extends v0.3 §4.7 (a sound module split) with the systems this document adds.

```
index.html
css/style.css
vendor/matter.min.js

js/constants.js          every tunable number, nothing else
js/main.js               boot, RAF loop, wiring
js/state.js              state machine (Part 4.1)

js/physics/adapter.js    ★ the ONLY file that imports Matter. See 5.4
js/physics/world.js      world build/teardown, fixed-step accumulator, speed clamp
js/physics/anchor.js     ★ release-time weld pass (3.2)
js/physics/causality.js  ★ contact history + death attribution (3.3)

js/drawing/capture.js    sampling, live length
js/drawing/simplify.js   Douglas-Peucker
js/drawing/validate.js   reject rules (4.2)
js/drawing/classify.js   open chain vs closed polygon
js/drawing/bodyFactory.js  geometry → bodies

js/milo.js               3-state locomotion, step-up, danger scalar (3.6, 6.2)
js/hazards.js            lethality kinds, grace radius (5.6)
js/levels.js             data, loader, dev assertions
js/rating.js             stars from measured thresholds

js/render/stroke.js      ★ boiling-line renderer — the look lives here (6.3)
js/render/rig.js         ★ Milo's articulated rig (6.2)
js/render/world.js       scene draw
js/render/freeze.js      ★ the freeze/unfreeze transition (6.5)
js/render/deathcam.js    ★ replay + attribution overlay (3.3)
js/render/hud.js

js/input.js              pointer unification, multi-touch lock, tap-to-abort
js/ui.js                 DOM overlays: level select, result, settings
js/audio.js              WebAudio synthesis, impulse-driven (6.7)

js/platform/sdk.js       ★ lifecycle adapter — no-op outside Playables
js/platform/storage.js   ★ SDK-first, try/catch fallback, never bare localStorage
js/platform/analytics.js ★ no-op in Playables, real on open web (3.13)

tools/solver/            ★ headless harness (3.8) — Node, no renderer
tools/lint-levels.js     ★ schema + curve + single-accent audit
```

★ = added by this document.

## 8.2 The three adapters

Everything platform-shaped hides behind one of three files, all of which must work with the platform entirely absent:

- **`sdk.js`** — lifecycle. First-frame-ready, game-ready, pause, resume, mute. **A no-op stub outside Playables so the game runs in a plain browser tab all through development.** Wired into the RAF loop from the first commit, not retrofitted.
- **`storage.js`** — SDK-first, try/catch fallback, never a bare `localStorage.getItem`. (v0.3 §4.8 states this rule and v0.4 §7.1 corrects the anecdote attached to it. **The rule is right regardless of the anecdote** — it is right because `localStorage` throws in private browsing and in sandboxed frames, which is exactly this game's deployment context.)
- **`analytics.js`** — no-op in Playables, real on open web. See 3.13.

**Carried-forward caveat, and it still stands:** exact Playables SDK method names, signatures and lifecycle timing must come from Google's own current developer documentation at implementation time, **not from this document and not from any third-party guide.** The *shape* of the requirement is solid; the literal function names in any of these four documents are not verified. Confirming them against the official docs is a named pre-production task in Part 11.

## 8.3 Responsive — extends v0.3 §4.2 with a tested matrix

Fixed logical height 1280. Width computed from the live viewport ratio. All puzzle geometry inside the 720-unit centre column; extra width is background only. Backing store = CSS px × DPR, capped at 2×. **Static camera, always, for the whole game** (v0.4 §8.3 — correct, kept, and it is a hard constraint on level geometry, not a rendering preference).

What v0.3 and v0.4 don't give is what "responsive" must actually be *tested against*. Playables run in an embedded frame of unpredictable size, sometimes small, sometimes beside a video:

| Case | Ratio | Must hold |
|---|---|---|
| Tall phone portrait | 9:19.5 | Full puzzle visible, HUD clear of notch |
| Standard portrait | 3:4 | Baseline |
| Square | 1:1 | Background fills, puzzle unchanged |
| Landscape | 16:9 | Background fills laterally, puzzle unchanged |
| Ultra-wide | 21:9 | Does not break |
| **Small embed** | **320 × 480 css px** | **Still legible, still drawable with a finger** |

The last row is the one that gets skipped and the one most likely to be the real deployment. Test it from day one.

## 8.4 Payload budget

| Item | Budget |
|---|---|
| Matter.js (vendored, gzipped) | ~30 KB |
| All game JS | ~150 KB |
| CSS + HTML | ~10 KB |
| Fonts | **0 KB** — system stack, or one tiny subset if the title demands it |
| Art | **0 KB** — all procedural (Part 6) |
| Audio | **0 KB** — synthesised (6.7), + one optional music loop if commissioned |
| **Total** | **≈ 200 KB, versus a 15 MB target and a 30 MB ceiling** |

Roughly 1.3% of the internal target. That is not a nice-to-have — startup time is the single biggest lever on the abandonment rate this platform punishes (v0.2 §1.4, §2), and the art decision in Part 6 is what buys it.

---

# PART 9 — PHASES, GATES AND CUT LINES

Phases follow v0.2 §71's structure, which was right. What is added is what the phases were missing: **a gate that can fail, and a cut line that says what happens when it does.** A phase plan without cut lines is a wish list, and a wish list is how a project ends mid-air.

## Phase 0 — Mechanical proof
**Build:** boot skeleton → adapter + fixed step → **tunneling acceptance test (3.4)** → drawing pipeline → anchoring → Milo locomotion → A1 WALL, A2 GAP, A3 REDIRECT, A4 CATCH.
**No art. No menu. No stars. No sound.** Capsules and grey circles.

A4 is included on v0.4's reasoning (§8.5), which is correct: A1–A3 never exercise the closed-shape branch, so Phase 0 could otherwise pass with a third of the drawing pipeline never having run. Its trajectory numbers were independently re-verified (3.4 preamble) and are sound.

**Gate — all six, on someone who has never seen any of these documents, with no coaching beyond "play":**
1. They draw something within 10 seconds, unprompted.
2. When it becomes physical, they visibly react.
3. After failing, they change the drawing *for a stated reason*.
4. They retry without being asked.
5. At least one moment surprises them in a good way.
6. **They can say out loud why they died, every time.** ← new, and it is the one that matters most, because it is the one measuring 3.3.

**Cut line:** if gates 1–4 fail, the mechanic is wrong. Redesign or kill (v0.2 §69). Do not add content. If only gate 6 fails, the death cam and ghost stroke are under-built — fix those before anything else, because everything downstream compounds off attribution.

## Phase 1 — Feel and look
**Build:** the boiling-line renderer **first, standalone**; Milo's rig; the freeze transition; death cam; ghost stroke; synthesised audio; the solver harness; 10 levels.

**Gate:**
- The thumbnail test (6.8) on five people who don't know the game.
- The solver harness passes all 10 levels on all six gates in 7.3.
- **Measured level authoring cost** (3.12).
- Playable at 60 fps on a mid-range Android phone, in a 320-px-wide frame.

**Cut line — and this is the real one:** if the stroke renderer doesn't sing after one week, **stop and switch to commissioned 2D art.** Budget: one week, decided on the thumbnail test, not on attachment to the idea. The whole procedural-art thesis is the highest-variance decision in this document and it gets exactly one week to prove itself while the fallback is still cheap.

Second cut line: if authoring cost > 90 min/level, the shippable game becomes 16 levels, not 24. Decide it here, on measured data, not at month three on optimism.

## Phase 2 — The complete game
**Build:** levels 11–24. **The entire meta shell (7.5) — scheduled here, not at the end.** Save/restore. Responsive matrix. Rewarded-ad placeholders (not live ads).

**Gate:** a stranger plays from cold boot to the ending screen without help and without hitting a broken state. If anything about that sentence isn't true, the game is not finished.

## Phase 3 — Open-web validation (the only real data you will ever get)
Ship instrumented to an open portal. Measure v0.2 §68's list — first-interaction rate, time to first input, L1/L3 completion, retry rate after failure, attempts per level, session length, % reaching 10+ minutes.

**This is where the open questions get answered**, not by argument: v0.2 §94's Q1–Q10 and §95's A–G are all measurable here and nowhere else. Line mass, Milo speed, draw limits, star basis, failure-animation length — all of it.

**Gate:** retry-after-failure rate is the single most diagnostic number in the whole project. If people fail once and leave, the loop is not addictive and no amount of levels fixes it.

## Phase 4 — Playables preparation
SDK compliance against the current official docs; payload; lifecycle; pause/mute; touch and mouse; the responsive matrix; save/load; brand and IP compliance; monetisation per current rules.

## Phase 5 — Submission.

## 9.1 Monetisation — deferred on purpose, and here is the shape

v0.2 §34 is right that the rewarded moment should be something the player already desperately wants, and right that **UNDO DRAW** is the natural one — it is exactly the feeling the game manufactures every eight seconds.

But note what the freeze does to it: with an infinite freeze and an instant retry, the player's cost of failure is already very low, which *weakens* the undo offer. That is a good trade — retention over ARPU, per v0.2 §98 — but it should be a conscious one, and the honest read is that this game's monetisation will lean on **hints on hard levels** (17, 20, 21, 23) more than on undo. Build placeholders in Phase 2, live ads only after Phase 3 data, per current platform rules. No interstitial before real investment (§35).

---

# PART 10 — RISK REGISTER

| # | Risk | Severity | Early warning sign | Mitigation | Owned by |
|---|---|---|---|---|---|
| 1 | **Failure is illegible; game feels random** | **Kill-level** | Phase 0 gate 6 fails; testers say "I don't know, it just died" | Death cam + causality + ghost stroke (3.3) | Phase 0 |
| 2 | **Tunneling / physics leaks** | **Kill-level** | Objects pass through drawings intermittently | 120 Hz + clamp + thickness (3.4); acceptance test before A1; adapter escape hatch to Planck.js | Phase 0 |
| 3 | Procedural art reads as programmer art | High | Thumbnail test fails; it looks "unfinished" not "drawn" | One-week cut line to commissioned art (Phase 1) | Phase 1 |
| 4 | Content treadmill: levels cost too much | High | Authoring cost > 90 min | Solver harness; cut to 16 levels on measured data | Phase 1 |
| 5 | Novelty wears off in 5 minutes | High | Session length collapses after L6 | Verb ladder (7.4): a new idea every 2–3 levels through L21 | Phase 3 |
| 6 | Reads as another Save-the-Doge clone | High | Testers name a competitor unprompted | The freeze + the moving character + the drawn world (Part 2) | Phase 1 |
| 7 | Anchoring feels magical or arbitrary | Medium | Testers surprised by what stuck | Anchor sparks (6.6); 6 u tolerance; test explicitly in Phase 0 | Phase 0 |
| 8 | Drawing is fiddly with a thumb | Medium | Testers redraw repeatedly before releasing | 25 u precision floor, machine-checked (3.14) | Phase 1 |
| 9 | Playables SDK details wrong in all four docs | Medium | Certification rejection | Verify against official docs before Phase 4 — named task, Part 11 | Pre-production |
| 10 | Title unavailable / dates badly | Medium | — | Clearance search now; icon and first frame carry the pitch without language (Part 11) | Pre-production |
| 11 | Blind on Playables (no analytics) | Medium | — | Open-web build is the instrumented one (3.13) | Phase 0 architecture |
| 12 | Matter.js unmaintained | Low | Stacking instability | Adapter isolates it (5.4) | Phase 0 |

Risks 1 and 2 are the two that kill this project, and **both are invisible until you build them and both were absent from all three prior documents.**

---

# PART 11 — WHAT IS GENUINELY YOURS TO DECIDE

Engineering judgement cannot close these. Everything else in this document is decided.

1. **Do you accept the Freeze?** (3.1) This is the biggest single call in the document. It resolves a real contradiction, it is platform-fit, and it gives the game its own noun — but it does convert "time pressure" from a mechanic into staging. If you want live time pressure in the core mode instead, say so now, because determinism, the retry loop and the whole art direction are all built on top of the freeze.

2. **Do you accept procedural art?** (Part 6) Highest-variance decision here. It buys a ~200 KB payload, free animation states, reactive comedy and no certification risk. It costs a week of risk and it demands genuine craft in one component. The alternative is commissioned 2D art: safer look, real money, real schedule, bigger payload, and Milo stops reacting.

3. **Matter.js as the dependency.** (5.4) Behind an adapter, with a documented swap to Planck.js. v0.3 asked for an explicit yes on this and that was the right thing to ask.

4. **Title clearance.** (v0.2 §5.4, flagged twice across two documents with no action attached either time.) Do the search now — it is cheap now and expensive later. Two separate things to check: legal/trademark collision, and platform naming policy on slang. Related and worth a real thought: *"cooked"* is current slang that may date quickly, and it does not translate for a global platform. The mitigation is not to change the title — it is to make sure **the icon and the first frozen frame sell the game with no language at all.**

5. **Music: one commissioned loop, or none?** (6.7) SFX are solved procedurally. "None" is a legitimate, defensible answer for a game living inside YouTube.

6. **The 24 vs 60 question** — do not decide it now. It is decided by measured authoring cost at the Phase 1 gate (3.12, Phase 1 cut line).

---

# PART 12 — WHAT HAPPENS NEXT

Pre-production is complete when these are answered. Nothing below requires code.

**This week, in parallel with nothing else:**
1. Answer Part 11 items 1, 2 and 3 — they are architectural and everything waits on them.
2. Start the title clearance search (item 4). It runs in the background.
3. Retrieve Google's current Playables SDK documentation and verify the lifecycle method names none of these four documents can vouch for (Risk 9).

**Then Phase 0, in strict order — and the order is the point:**
1. Boot skeleton: state machine + RAF loop, a capsule on a static ground. No physics.
2. `physics/adapter.js` + fixed 120 Hz step + speed clamp.
3. **The free-fall unit test and the tunneling acceptance test (3.4). Do not proceed until both pass.** This is the single most important instruction in this document — everything after it is built on the assumption that collisions actually happen.
4. Drawing pipeline on an empty level: draw, watch shapes fall and settle. No Milo, no hazards.
5. Anchoring: draw touching the ground, it sticks; draw floating, it falls. Sparks on release.
6. Milo: three-state locomotion, step-up, walks to a goal on flat ground. No hazards.
7. A1, A2, A3, A4.
8. Death cam + ghost stroke — **inside Phase 0, not after it**, because gate 6 measures them.
9. Run the six gates on a real stranger. Their reaction is the verdict. Not "does it run clean."

---

## CLOSING

The prior documents got the philosophy right and left the game unbuildable; the second and third got it buildable and left two bugs in it that would have looked like the mechanic failing rather than the spec failing.

What this version adds is the answer to the question underneath all of them — *why would anyone want to play this?* — and the machinery to keep answering it: a world that stops one heartbeat before disaster, a line that sticks where you put it, a game that tells you exactly why you died, and a look that costs nothing and belongs to nobody else.

The rest is discipline. Build the four levels. Show them to someone who owes you nothing. Believe what they do, not what they say.

> **One line. One shot. Get him out.**
