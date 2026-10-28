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
