# PLAN — from 21 levels to a game one person comes back to

**Status: PROPOSED, 2026-10-13. Nothing in it starts until you say go.**

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

**How many: 60 at launch, in six chapters of about ten.** Someone who plays
ten minutes a day gets roughly a week out of that. The first week is when a
habit forms or doesn't. 21 levels last about two sittings. After
60, a new chapter gets added only once players are reaching the end. (Section 3.)

**How:**
1. **A level is defined by the decision it asks for, not by its noun.** My old
   rule was "each noun has exactly one question". It capped the game at about 21
   levels. The new rule: no two levels ask for the same decision. The physics
   findings all stay. (Section 4.)
2. **Most new levels go in the middle of the difficulty range.** The first
   eight levels average 11 tries. From level 10 on, every level takes 39 or
   more, except the one that introduces air. There is almost nothing in
   between. Middle-difficulty levels are also the cheapest kind to get through
   the gates.
3. **One new noun gets a whole chapter: TNT.** The last chapter then combines
   it with every noun before it, because a new noun multiplies the old ones.
   TNT is already designed. The lost code is written into Appendix A so it
   cannot be lost twice.
4. **A production line with a 60-minute limit per level.** A level that has not
   passed in 60 minutes goes to `docs/HELD.md` with its reason, and the next
   idea starts.

**Who builds it:**
- Me, as producer and integrator.
- Two level-designer sessions working in parallel.
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
2. Decide on a rewarded **SKIP** button: yes or no (section 7).
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

### 4.2 What the difficulty curve needs

"Tries" = 1 ÷ (share of strokes that win × share that survive a shaky hand).
Measured tries per level, in play order:

    the line   12 10  6 11  8 19 21 28
    plates      4 40 41 56
    air         6 39 67 68 69
    finale     61 64 89 90

The first eight levels average 11 tries. From level 10 on, every level takes
39 or more, except DUCT, which introduces air. There is almost nothing in
between.
- **The new 39 should split roughly 12 easy (≤ 15 tries, mostly chapter
  openers), 17 medium (15–40) and 10 hard (40–90).**
- Medium levels win on 3–13% of strokes. That sits comfortably inside the
  2–40% gate, so they are the cheapest to get through.
- Hard levels sit near the 2% floor. That is where builds fail, and that band
  already has 8 levels.

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

| # | Chapter | Shipping now | New | Where the new ones come from |
|---|---|---|---|---|
| 1 | THE LINE | 8 | +3 | ROOF · DON'T · FILL — the line's own habits turned into traps |
| 2 | PLATES & GATES | 4 | +4 | WRONG PLATE, plus sketching |
| 3 | **TNT** | 0 | +12 | the noun on its own, then developed, then twisted |
| 4 | AIR | 4 | +4 | TWO WINDS, plus sketching — the thinnest supply |
| 5 | LIFT & LEVER | 5 | +3 | sketching |
| 6 | ALL OF IT | 0 | +13 | TNT combined with every earlier noun; ends on WELL DONE |
| | | **21** | **+39** | **= 60** |

- **Chapter sizes are targets; the total of 60 is the commitment.** If a
  chapter runs out of good ideas, its slots go to one that hasn't.
- **TNT goes in the middle, not at the end.** That way its levels can be of
  middle difficulty, which is what the curve lacks, and a new noun arrives in
  a player's second or third sitting, when interest would otherwise fade.
- **Chapter 6 combines nouns the player has already met.** It ends on WELL
  DONE, the one level built as a spectacle: a chain reaction the player starts
  with a single line. These are the hard levels, and hard levels are where
  builds fail, so chapter 6 is sized last and is the first place the cut line
  falls.
- **Every chapter starts easier than the previous one ended**, a sawtooth
  pattern. The difficulty gate allows this, and it is how the genre paces new
  ideas.

### 4.5 The first briefs

Confidence means my honest guess that the idea survives its gates.

| Working name | Ch | The decision | The trap | Conf. |
|---|---|---|---|---|
| ROOF | 1 | rocks fall along his path; shelter the whole stretch (watch for a twin of WALL on the contact sheet) | blocking where the first one lands | M |
| DON'T | 1 | a crate and a rock fall; the crate plugs the hole; stop only the rock | blocking everything | M |
| FILL | 1 | the rock that would hit him is the only thing that fills the hole; one ramp does both | blocking it | M |
| WRONG PLATE | 2 | two plates: one opens the gate, one opens the floor under him (an opened gate vanishes, so a gate set into the floor is a trapdoor with no new code). The right plate needs a lid, or a dropped line wins | the nearer plate | M |
| KEEP AWAY | 3 | the barrel rolls toward him: stop it *far* away. This is the chapter opener | stopping it at his feet, which is still inside the blast | H |
| FENCE | 3 | park the barrel at the fence, away from him (built 12 Oct: 2.1% win rate, 5 families) | stopping it too early | M |
| BUSTER | 3 | a boulder blocks the path; get the barrel to it. The same decision as FENCE, so only one of the two ships | stopping the barrel | — |
| TAKE COVER | 3 | build him a wall the blast cannot pass (needs the blast to respect walls, a small engine addition) | running from it | L |
| TWO WINDS | 4 | two leaning columns: one carries it to the plate, one drops it on him | the nearer column | M |
| BALLOON BOMB | 5/6 | a balloon carries the barrel up; steer it so it is at the shelf when it goes off | letting it float | M |
| AIR BOMB | 6 | the wind carries the barrel to the fence. RAIL's decision with a bomb in it, so it ships only if the fuse changes the decision | stopping it | L |

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
| **Level designer A** | parallel session | the TNT chapter, then the TNT combinations in chapter 6 | TNT is a chapter of its own, and the engine has to land first |
| **Level designer B** | parallel session | the new slots in chapters 1, 2, 4 and 5 | the middle-difficulty levels the curve is missing |
| **Shell engineer** | parallel session | the menus, ending, progress and HUD code | Chapters, the ending and the sound switch live in different files from the levels, so this work never collides with theirs |
| **Levelsmith** | a cheaper, faster model, as a reviewer | nothing; it only gives a verdict | It rejects a design for pennies before a full measurement run is spent on it |
| **Playtest** | you, plus two or three people who have never seen it | the final verdict | The only check that measures whether a level makes sense to a person |

**Before anyone starts, I do three things myself:**
1. Split `js/levels.js` into one file per chapter, so parallel sessions never
   edit the same file.
2. Put the TNT engine back, with a physics test and a film of it going off.
3. Write the briefs.

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
2. **A real ending.** A stat card, as the Bible specified: *"Milo survived 60
   disasters. You drew 1,284 m of line. He nearly died 212 times."* It is the
   screen people will screenshot.
3. **"More coming"** on the ending, with the daily challenge as the reason to
   come back tomorrow.
4. **A sound switch.**
5. **Rewarded SKIP**, only if you say yes.

**The SKIP decision.**
- What it is: after five failed attempts on one level, a SKIP button that
  plays a rewarded ad. The skipped level stays unstarred on the board, so the
  player can come back for it.
- What `CLAUDE.md` says today: no rewarded ads. A paid *undo* would sell
  exactly the tension the game is built on, and a paid *hint* would break the
  rule that hints name the problem, never the answer.
- Why a skip is different: it does neither of those things.
- Why it helps:
  - The hardest levels take 56–90 tries, and that is where a casual player
    leaves.
  - A skip keeps them playing, which also means more ads between levels.
  - Rewarded ads pay more per view than the ads between levels.
- The platform allows it, because the player asks for it by pressing the
  button.
- **My recommendation: yes.** It changes a rule I wrote, so it is your call.

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
| **Wed 14 Oct** | Setup: chapter files, TNT engine and its test, the 39 briefs, sessions started | tests pass, TNT filmed going off, briefs committed |
| **Thu 15 – Sat 17** | **Batch 1:** 19 new levels — chapters 1–3, including all 12 of TNT — plus chapters and the ending | merged, difficulty gate passes, films read |
| **Sat 17** | **Checkpoint 1:** pass rate, minutes per level, your playtest | decision: continue to 60, or cut to 45 |
| **Sun 18 – Tue 20** | **Batch 2:** 20 new levels — chapters 4–6 — plus SKIP if approved | merged |
| **Wed 21 Oct** | **Ready to ship:** every level filmed won and lost, the contact sheet, the daily deck rebuilt, certification re-run, both ZIPs | the ZIP is in `dist/` |

**Cut lines, decided now rather than later:**
- **Per level:** 60 minutes, then it is held.
- **Checkpoint 1:** if fewer than 12 of the first 19 pass, or a passing level
  costs more than 90 minutes, the target becomes 45. The cut comes out of
  chapters 4–6, chapter 6 first, and nothing else changes.
- **Playtest:** a level a player cannot read gets held, whatever its numbers.
- **If Playables access arrives early:** ship whatever is complete and
  certified (never fewer than 33 levels: the 21 plus the TNT chapter) and add
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
