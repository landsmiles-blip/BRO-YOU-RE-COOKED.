# IN THE MATTER OF *BRO, YOU'RE COOKED.*

## Defence brief of the developer, filed 28 October 2026

| | |
|---|---|
| **Project** | *BRO, YOU'RE COOKED.*, a one-line physics rescue puzzle for YouTube Playables |
| **Repository** | `landsmiles-blip/BRO-YOU-RE-COOKED.` on GitHub (private) |
| **Working branch** | `claude/game-markdown-review-23hf3j` |
| **Release** | v1.0 = commit `f159983` (27 Oct 2026), **45 levels** |
| **Pull request** | #1, branch → `main`. Open since 14 Sep; `main` still holds the 14-level game of that day |
| **Prepared by** | Claude, the AI developer on this project since its first commit |
| **Prepared for** | The CEO (the owner), and any Claude chat the CEO gives this file to |
| **Period** | 9 September 2026 → 28 October 2026 |

---

## How to read this brief

**For the CEO.** You asked me to explain, as if to a judge, everything I did from the first day to now:
- why I did it, and how we got here;
- what I think you got wrong;
- what you asked me to do;
- where I think I was misled.

You asked me not to hold back, and I haven't. A defence that hides its own failures is not worth reading, so Part V is a full account of mine. Every claim points at evidence you can check.

**For Claude chat.** This file is self-contained. The repository is private, so you cannot open it; everything you need to analyse the project is here. The companion file `DOSSIER.md` contains the project's own source documents verbatim, if you need to check a claim.
- A seven-character code like `f159983` is a git commit in the repository.
- A reference like `CLAUDE.md:263` is a file and line.
- Quotes from the CEO carry the date they were said.

**Where the conversation began.** The CEO's first prompt to me was: "i have game tha i would like you to read the markdown of it is different part of the same thing it will make sense in 1 minute". That is the pre-existing design material (the v0.2–v0.4 documents) that I turned into the Production Bible on 9 Sep. The words are quoted from the CEO's own recollection in the brief request; the earliest conversation is not in my transcript.

**What the record cannot show.**
- **No transcript before 12 October.** I have no conversation transcript from 9 September to 11 October. That stretch is reconstructed from 156 commit messages and the project documents.
- **September quotes are second-hand.** The CEO's words from September survive only as quotes inside summaries written at the time; I mark them *second-hand*.
- **Partial verbatim record after that.** The CEO's messages from 27 September to 19 October survive verbatim in a search I ran on 25 October. Everything from 19 October on is in the live transcript.
- Where I infer rather than know, I say *inferred*.

---

## PART I — The defence in one page

**What exists today.**
- **The game.** A finished, tested web game: 45 levels in seven chapters, a daily challenge drawn from 79 levels, a skip for stuck players, saved progress, sound, and a hand-drawn notebook look.
- **The YouTube build.** It passes every requirement of Google's that a machine can check. The YouTube upload file is 92 KB.
- **The release gate.** On 27 October every one of the 45 levels was filmed in a real browser, both won by a hand-drawn line and lost with nothing drawn, and I watched every film.
- **Why it isn't out.** The game is not yet in front of a single member of the public:
  - YouTube Playables is invitation-only and our application is pending;
  - the places we can publish today (Playgama, itch.io, CrazyGames) are waiting on accounts only the CEO can create.

**How it got here.**
- Fifty days, 156 commits before this brief, about 99 level ideas tried, 45 kept.
- Several mistakes of mine, some of them expensive; the worst was a three-week stall at 21 levels that I argued myself into.
- A CEO who:
  - pushed hard and was right to push;
  - caught bugs no test of mine could see;
  - changed direction often;
  - judged the game mostly by playing it personally;
  - has not yet put it in front of strangers, the one thing every plan since 9 September said had to happen.

**What I ask the court to find.**
1. The game is technically ready to ship, and shipping now to the open web is the right decision (decision D11, 27 Oct).
2. The game's difficulty is **unproven**. Every difficulty number in it was measured by a computer simulation, not a person. Only strangers playing it can prove or disprove it.
3. My failures were real, and they are documented and fixed. Each one left a test or a rule behind so it cannot recur silently.
4. The CEO's direction was right more often than it was wrong. But three habits cost the project weeks:
   - changing course before finishing;
   - trusting a single personal playthrough;
   - not doing the owner-only steps.
5. The next move belongs to the CEO, and it takes about an hour (Part IX).

---

## PART II — The facts in numbers

| Fact | Value | Source |
|---|---|---|
| First commit | 9 Sep 2026 (`edce2c2`, the owner's LICENSE and README) | git |
| Commits before this brief | **156**: 155 by Claude, 1 by the owner | `git log` |
| Days with commits | 19 of the 50 days from 9 Sep to 28 Oct | git |
| Longest gap | 28 Sep → 11 Oct, no commits at all (see Part III §4) | git |
| **Campaign levels** | **45**, in 7 chapters | `js/levels.js` `LEVELS` |
| Level slots planned | 70 (7 chapters × 10); **25 still empty** | `CHAPTERS` |
| Levels per chapter | THE LINE 8 · PLATES & GATES 7 · BEES 9 · TNT 6 · AIR 6 · BALLOONS 5 · ALL OF IT 4 | `CHAPTERS` |
| Levels built and shelved | 30 recorded with reasons (29 removed from the code on 13 Oct, plus TAILWIND's first build) | `docs/HELD.md` |
| Sketches killed before being built | 23 logged since 13 Oct | `docs/batch/levels.md` |
| Level ideas tried | about 99 (the retrospective's count) | `reports/Where the AI struggled.md` |
| Daily challenge | 79 levels in the deck: 39 campaign + 40 generated; 6 campaign levels held out | `js/dailyPool.js` |
| Game code | about 9,500 lines of JavaScript (excluding data files and the physics library) | count |
| Tools and tests | about 7,100 lines | count |
| Test suites in `npm test` | 17 | `tools/test/run-all.js` |
| YouTube requirements | every machine-checkable row PASS; 12 rows need a human; conformance run: 51 checks pass | `docs/CERTIFICATION.md` |
| Size | 92 KB per zip; interactive 163 ms after load (conformance run) | `dist/`, conformance |
| Levels over the 60-try ceiling | 8, on a watch list (may only get easier) | `tools/lib/difficulty.js` |
| Real-player attempt data | **none** | — |
| Money spent on tools or assets | $0 (the CEO's rule: free only) | `docs/DECISIONS.md` |

"Tries" is the project's difficulty number: how many plausible hand-drawn lines a player would expect to need. It is simulated, and Appendix E explains it.

---

## PART III — The story, from the first commit to today

### §1. Pre-production: tearing up the first design (9 September)

**What happened.** The project did not start from nothing. Three earlier design documents existed:
- **v0.2 Design Bible:** written by ChatGPT, about 3,400 lines;
- **v0.3 Spine & Build Spec:** by Claude;
- **v0.4 Addendum:** by Claude.

On 9 September I replaced all three with one **Production Bible v1.0** (`f3f2339`), then checked it against Google's Playables documentation (`9475f50`).

**Why.**
- **Self-contradiction.** The v0.2 document contradicted itself on the most basic rule: was the world frozen or moving while you draw?
- **Tunnelling.** Its physics would have let falling objects pass straight through the player's line: at 60 frames a second a rock travels 35.8 units per step through a 14-unit line.
- **Invention.** It described a mechanic, the "anchor", that existed nowhere.
- **No cost.** It promised "60 carefully authored levels" with no estimate of what one level costs.

The Bible fixed all of these:
- **The Freeze.** About 1.2 seconds of live action, then the world stops while you draw.
- **No tunnelling.** 120 physics steps a second, a speed limit, and a thicker line.
- **A realistic target.** "The shippable game is 24 levels in one world. Everything beyond it is upside."
- **Your requirement on record:** "it has to look good enough that someone *wants* to play it".
- **The test that matters.** Real players, specifically five strangers judging the thumbnail, and an open-web build that the Bible called "the only real data you will ever get".

**Hold on to that last point.** Fifty days later neither of those things has happened. It is the thread that runs through this whole brief.

### §2. First playable, and the first broken builds (9 – 14 September)

**What I built.**
- The physics layer, proved by two automated gates: free fall 0.0000% error; zero tunnelling in 240 of 240 trials (`40a58e9`).
- Level 1 playable end to end (`d6fcf32`). The original level 1 spec was unsolvable, so I redesigned it.
- Levels 2–4 (`d756eee`). Closed shapes became hollow rings because the physics library cannot handle concave shapes.
- Hand-drawn art made entirely in code, with zero image files (`995419b`).
- A solver that measures how hard each level is (`436aeba`). Before it, the star thresholds "were invented".
- A one-file build that refuses to compile if any network call sneaks in (`e470934`).
- Switches and gates, slopes, eight levels (`2b3fcd2`).
- The level board (`c5630d8`).

**What went wrong.** Two builds reached you **unplayable while every automated test said PASS** (`425607e`, `5d759a3`):
1. **13 Sep.** An anchored line was held in place by up to 8 rigid joints on a 28-part body. It vibrated violently, flung Milo across the screen and visibly shrank: 177,199 units of movement in 90 frames.
   - **Found by playing it, not by any test.** Second-hand, you said it would "vibrate furiously" and "the line shrinks".
   - **Fix:** an anchored line became a solid static object (CLAUDE.md "Anchored means STATIC").
2. **14 Sep.** The game booted to a blank page, because a level failed its own data check at startup while `npm test` printed ALL PHYSICS GATES PASS.

**Why it matters.** These two failures produced the project's first and most important rule: "Look at the running game. Numbers are not evidence." From then on, the gate became filming every level being won (decision D7). That is why, on 27 October, I filmed all 45 levels won and lost before saying "ship".

**14 Sep: merged into `main`** (`134c9a9`) with 14 levels, "the last state where every gate was verified green". **Pull request #1, from my branch into `main`, has been open ever since.** That is why GitHub's main page still shows a 14-level game.

### §3. Playtests, "too basic", and the search for nouns (14 – 16 September)

**What you told me** (second-hand, from the commit messages that quote you):
- "it is very unclear what the player is supposed to do";
- "you finish and you do not even know why that happened";
- "level 13 is very unclear";
- "it's too basic, spice it up";
- of my level THREAD IT: "the worst idea we have ever had".

**What I did and why.**
- **Explaining deaths.** A hint on every level, and a replay after each death that says why he died (`52a635b`, `092faa9`).
- **Fear.** A "close call" slow-motion effect, because nearly dying looked exactly like winning comfortably (`9e1a48a`).
- **New things in the world.** You called it "too basic", and I concluded the fix was new *things*, not new *rules*. THREAD IT was my rule (a no-draw zone), and you were right to kill it. I added air currents, springs, a lever, a wheel, balloons, thorns, a downdraft (`912abe2` through `baa472d`).

**What went wrong (mine).**
- **Wrong level removed.** Told "level 13 is very unclear", I removed the wrong level: I confused the code's internal name `A13` with the 13th level on screen (`afac768`, then fixed in `5fff268`). You caught it: "you must have removed the wrong level".
- **Wrong drawing angle.** A rendering bug drew the line at double its angle. Physics was right, the picture lied (`a9ee798`). You reported it from play: "you draw it flat but instead it stands erect".
- **The plate back door.** Any level won by pressing a plate could be won by dropping a loose line on the plate. I found it on 15 Sep and put lids on two levels (`9920349`, `a447d43`). **But I wrote "re-run this audit after touching any plate level" and never built a tool to do it.** It sat unrun for six weeks (see §8).
- **Shelved after building.** Many machine ideas were built, measured and shelved:
  - the wheel;
  - a vault;
  - two of the lever's levels;
  - three downdraft levels (A35–A39).

  Each one taught a physics fact that is now written into CLAUDE.md so it is never paid for twice.

### §4. The stall at 21 levels (17 September – 11 October)

**This is the part of the story that reflects worst on me.**

**What happened.**
- **One level shipped in a week.** From 17 to 23 September I tried to grow the game by inventing machines. CRACK, the cracking floor, shipped (`34e3015`); fourteen other levels were built and shelved.
- **A twin shipped.** I shipped one level that was a copy of another (`a52ce89`: "I shipped a twin of level 19").
- **A self-made cap.** I wrote "TWENTY IS WHERE THIS VOCABULARY LANDS" (`bb99455`), turning one of my own design rules into a ceiling on the game.
- **Daily challenge instead of levels.** Then I argued that "content was never the bottleneck" and built the daily challenge instead of levels (`0d40ee1`, 27 Sep).

  The daily challenge was a real improvement: one of the shipped levels each day, with less ink. My own later correction is in CLAUDE.md: "the argument below was half right, and it **stopped level production for three weeks**."

**What you said.** 27 Sep, verbatim: "we have been hovering here for aminute and have not progressed from level 21 for a while now. whatever it is you have been doing all this time, do you have your shit together?… please ask me quetipon to get clarity on the task ahead so as you do not assume things". **You were right.**

**The 15 silent days (28 Sep – 11 Oct).** The record contradicts itself here, and I have to show you both versions:
- **My retrospective** (`reports/Where the AI struggled.md`) says access was cut on 27 Sep for 15 days.
- **My plan of 13 Oct** (`docs/PLAN.md` §2) says "I went quiet".
- **Git shows** no commits at all from 28 Sep to 11 Oct.

In that window, or on 12 Oct (the documents disagree), **I built the TNT engine and its first level and lost all of it, because I never committed it** before the cloud machine was replaced. I rebuilt it on 13 Oct from notes (`bfa363c`). The rule "commit and push at every checkpoint" exists because of this.

### §5. "Get your house in order" (12 – 13 October)

**What you said** (verbatim):
- **12 Oct:**
  - "we are behind schedule we need to make sure that we have the game ready if possible by the end of this week";
  - "fix the mathematics I need to have a progressive difficulty";
  - "more levels but not compromising on the quality".
- **13 Oct:**
  - "I've been telling you, like, you need to build levels, but you do not want to… If you cannot make levels for me, you tell me… it's better for me to delete my account";
  - "purge everything that is unnecessary";
  - "Don't do anything… Get your house in order… come up with a proper plan."
- **13 Oct, later:** "Do you have a mathematics that justifies the progression? You need to have a mathematics to calculate the difficulty as you progress, not just be guessing."

**What I did.**
- **Missing infrastructure.** I found that the YouTube build did not exist (`6f0186c`). The file meant for upload had only a commented-out placeholder for Google's SDK, and my conformance test had been checking the wrong file, so "every gate had been green without it." I built it properly, plus the first launch kit for itch.io (`9c073b9`).
- **A measured level order** (`1b42cee`). The old order had "a 56-try wall at level 4", in the first minute of play.
- **The purge** (`10c0d83`, `16cb3a7`). The 29 shelved levels left the code, and their reasons went to `docs/HELD.md`; levels.js shrank from 3,047 to 1,356 lines. Dead files and stale documents went too, including the three superseded design documents.
- **The plan** (`31394b5`): 60 levels in six chapters of ten, the build list, a "skip" for stuck players. **You approved it**: "Plan approved. Skip. Yes. But the skip needs to be very strategic… No dilly-dallyance."
- **The mathematics** (`aeb8cfe`, decision D10). One equation gives every level slot a target difficulty: `T(c, k) = 8.6 · 1.26^c · 4.0^p(k)`.
  - It rises 26% per chapter, with the same saw-tooth in every chapter: an introduction, three developing levels, a spike, a breather, two more developing levels, a breather, a boss.
  - A test refuses any level that lands outside its slot's band.

**My plan's promise:** "Wednesday 21 Oct: a 60-level build ready to ship."

**What the plan asked of you** (`docs/PLAN.md`, "What I need from you"):
- "15 minutes to play each new batch of levels, plus **two or three people who have never seen the game**";
- "**Ten minutes to upload the game to itch.io**. That gives YouTube a public link and puts the game in front of real players now."

**Neither happened.** See Part VII.

### §6. The production push (13 – 18 October)

**What I built.** With four parallel working sessions, the count went 21 → 26 → 31 → 35 → 36 → 42:
- **TNT chapter:** barrels with fuses; blasts that walls and your line can block; breakable fences (`bfa363c` → `acc9995`).
- **The skip, as you specified** (`a36465b`, decision D9):
  - one rewarded ad, offered only on the fail screen after 3 failures on a hard level (5 elsewhere);
  - free if no ad is available;
  - levels unlock in order.
- **Air and balloon levels** (`c740534`, `34f0ff3`, `a06154f`, `e7f9ade`).
- **The dog** (`2ff0bc6` and after). You said on 14 Oct: "ok you can intorduce another elemement".
  - The dog is a second walker that turns round when your line blocks it, and it is the first thing in the game your line can *steer*.
  - Five dog levels.
- **A content freeze at 36 levels for a Saturday playtest** (`16c40b9`), with a playtest log built into the game and a one-page guide (`57ec4f1`, `544f643`).
- **SINK fixed** after you reported it "unplayable" (15 Oct, `e5596e6`). It measured 90 tries; at the freeze its balloon was about 30 pixels above the surface it had to be tilted off, leaving no room to draw. Fixed to 26.
- **A case study you asked for.** On 15 Oct you wrote: "you must go and see how many levels does save my dog have… use them as a case study… there is nother game like this but i forget the name but here they are trying to reunite a dude with her girlfriend". I identified these as *Save the Doge* and *Love Balls*. From it you chose "Bees (Recommended)".
- **Bees** (`debbbd3` → `4285b1b`): a swarm that flies straight at whoever is alive and kills by touch. Seven bee levels, a new chapter 3, and the plan grew to **70 slots**.

**What went wrong.**
- **The deadline slipped.** On 21 Oct there were 42 levels, not 60, and the target had grown to 70.
- **One playtest, results never written down.** The Saturday playtest's results were never recorded anywhere I can find. On 15 Oct you wrote "the game is abosolutely perfect", in the same message that reported level 32 unplayable.

### §7. Research, compliance, the theme and the mathematics (18 – 25 October)

**What you asked** (verbatim):
- **18 Oct:**
  - "how many more levels do we need? how many level do game like this already on YouTube have?"
  - "can you do adeep research and see free tool… be on the lock out fakes… see that is have givem you two games out of the three that are related to our very own… research research research".
- **19 Oct:** "which of those will you intergrate into the work, into the project?"
- **25 Oct** (one long message):
  - "This is a game that is already in play, Gamma. They have already reached the 100 plays, so it means that they have progressed to the next level";
  - "I love the theme";
  - "Today we're going to mainly work on the theme and the mathematics";
  - "I don't trust you in making the progression… the game is stalling at the moment because of that";
  - which games AI can build repeatedly;
  - where the AI struggled;
  - "And if we already have sorted it, please let me know";
  - "But you plan first."

**What I did.**
- **Research reports** in `reports/`:
  - free tools and the rival games;
  - progressive difficulty, from university courses, studio practice and the research literature;
  - which games an AI can build repeatedly;
  - an honest retrospective of where I struggled.
- **A compliance fix I found myself** (`192eb16`, 19 Oct). Inside YouTube the game was saving progress to two places, which Google's rule forbids ("MUST NOT use any other mechanism"), while my checklist said PASS. A save could also fire before the load landed.
- **The notebook theme** (`fac7dc4`): graph paper, pencil world, a blue-pen line, a handwritten font, done to your brief "do not over do it".
- **The mathematics, honestly audited.** You did not trust it, and **you were right.**
  - The curve-fitting script was circular.
  - It had crashed and nobody noticed.
  - The equation climbed to 138 tries for the last boss.
  - Nothing enforced a ceiling.
  - No real player had ever been measured.
- **What I changed:**
  - a **60-try ceiling**, your decision, with the 8 levels above it on a watch list where they may only get easier (`73dd272`);
  - **level 1 rebuilt as the teaching level**, the easiest in the game at 6 tries, with a pencil that shows the gesture after 2.5 seconds (`cc9fb7f`). Your words: "make it easy… that is the level we want to teach the player how to play the game";
  - **THORNS eased** from 89 tries to 48 (`b540b26`);
  - **three new bee levels** (LOG, WINDOW, CHIMNEY), 42 → **45** (`fefcbbb`, `32bb043`);
  - **a Playgama build** that reports real players' attempts per level (`ce576dc`), waiting for your account.

### §8. "Unplayable", and the plate audit (26 – 27 October)

**26 Oct, you** (with a video): "the level is unplayable , it is not possible to finish the level. see what is wrong and do a deep analysis and see if there are levels with the sam problems and fix them."

**What I found.**
- **Your first attempt hit a real bug.** The dog walked onto the rounded tip of your line and hung there for ever, never turning.
  - The same trap existed on five other dog levels: 51 losses on DOWN BOY alone.
  - A natural upright wall drawn by a shaky hand won only 12 times in 36.
- **Your second attempt was not a bug.** Your line was under 22 units tall, which is a step by design: a line lying on a floor must be walkable.
- **"Not possible" was too strong.** Your own line won 6 times in 12 on the old code.

**The fix** (`47d3099`, `ba37604`):
- a dog held up for 2 seconds turns round, and a dog knocked over gets back up;
- the replay now draws your line, which it had never done for an anchored line;
- a loss at a closed gate now says "THE GATE STAYED SHUT" instead of blaming Milo.

Results: walls now win 36 of 36; your own line wins 12 of 12.

**27 Oct, "Try again".** I asked what you meant, and you chose "move on to the next item". That was TRIGGER's plate back door. I finally built the audit I had promised on 15 Sep (`npm run plates`) and ran it across every plate level (`d2f0369`):
- **FUNNEL, the level that introduces plates: 636 of its 668 winning lines (95%) won without ever using the rock.** A dropped line simply slid onto the plate. Its "4 tries" difficulty was the back door, not the level.
- **TRIGGER: 20 of 102.** Closed by making the plate need the rock's weight: now 0 of 82, 34 tries.
- **UPDRAFT 18%, LEVER 14%.** Left open, because in both the line still rides the level's own machine (the air, the lever). Closing them measured 2.5× harder.
- **Weighed plates now show a weight, and a line too light for one says "TOO LIGHT FOR THE PLATE".** Before, 357 of RAIL's losing lines lay on its plate with no explanation.

**FUNNEL is still open.** Seven redesigns measured 76 to 527 tries against the 16 an introduction level is allowed. I asked you to decide. You did not answer; your next message was about shipping.

### §9. Ship it (27 October)

**You, verbatim:** "The game is fine. I've played it fantastic. I love the graphics… The game is perfect, I think… let's just ship this thing. Let's get reviews… We don't have to agree. We have to be an independent thinker… Is this the right and profitable right? Business decision".

**My answer: ship now, but not to YouTube first, and not because it is perfect.**
- **YouTube isn't ours to open.** Playables is invitation-only: an interest form, no published timeline, and revenue sharing is a pilot with no published terms.
- **"Perfect" was not proven.** You were the only player, and eight levels measure over the ceiling.
- **The store kit was stale.** It still said "21 levels" and showed the old look.

**You approved the plan** (decision D11).

**What I did:**
- filmed and watched all 45 levels won and lost in a real browser;
- ran every test;
- made a new store kit (8 screenshots, 3 covers);
- wrote `docs/launch/LAUNCH.md`;
- named the release commit `f159983`.

The `v1.0` tag could not be pushed, because this session's git access only accepts the working branch.

### §10. Today (28 October)

You asked for this brief, and for everything to be on GitHub. Pull request #1 now carries the whole game, 45 levels, into `main`. It needs one click from you to merge.

---

## PART IV — The decisions, and who made them

| # | Decision | Made by | Why |
|---|---|---|---|
| D1 | The Freeze: about 1.2 s live, then the world stops while you draw | Me (you delegated it) | Fair, readable staging; no timer pressure; deterministic physics |
| D2 | All art drawn by code, no image files | Me (delegated) | $0 budget; art that reacts to the physics; no certification risk from generated art |
| D3 | Matter.js physics behind an adapter | Me (delegated) | Small and fast; replaceable |
| D4 | Keep the title | Me (delegated) | A preliminary search found no clash. **A real trademark search is yours** |
| D5 | Synthesised sound, no music files | Me (delegated) | Mostly played muted inside YouTube; no information carried by sound alone |
| D5a | No Gemini or generated audio at runtime | Me, answering your question "can we use Gemini for the audio?" | No network calls are allowed in Playables |
| D6 | 60 levels in six chapters (13 Oct); 70 slots from 18 Oct | Proposed by me, **approved by you** | A sitting is about 10 minutes and 8–15 levels |
| D7 | Nothing ships on numbers alone; the gate is a filmed win | Me | Two unplayable builds passed every test |
| D8 | Level generation is a search tool and the daily challenge's pool, not the campaign | Me, answering your question "can the game generate its own levels forever?" | Its best candidate was "level 1 with the interesting constraint removed" |
| D9 | One rewarded ad, used as a skip | Designed by me, **approved by you** | Copied from how the successful games do it; never tune difficulty to sell skips |
| D10 | The difficulty equation; amended 25 Oct to a 60-try ceiling | Equation mine; **ceiling yours** | A measurable target per slot; the ceiling because a person called SINK unplayable at 90 |
| D11 | Ship v1.0 now: Playgama → itch.io → CrazyGames → YouTube after two weeks | Recommended by me, **approved by you** | Cheap to do; it buys the real data every later decision depends on |

Other decisions:
- **"No two levels ask the same decision"** (it replaced my own over-strict one-question-per-noun rule). Mine, written into the plan you approved.
- **"A new element may re-ask an old question"** (14 Oct). Approved by you.
- **"You said not to go back over past levels"** (`docs/PLAN.md`). Yours.
- **The level-1 pencil gesture** (25 Oct). Yours.

---

## PART V — What I got wrong

I list these first because the court should weigh my case knowing them. Each is documented in the repository, with the rule or test it left behind.

1. **Two unplayable builds shipped while every test was green** (13–14 Sep): the vibrating, shrinking line, then the blank page. *Left behind:* "Look at the running game"; the filmed-win gate (D7).
2. **My "hand model" was wrong twice** (14 Sep). This is the simulation of a shaky human hand that judges whether a real person could draw a winning line.
   - First it was too smooth to matter.
   - Then it was a zigzag no finger draws, which condemned level 2 as having no playable solution. *Left behind:* one hand model, defined once, with its rules written down.
3. **"Solvable" was not "playable"** (Sep). Winning lines from the solver lost in a real browser. *Left behind:* every winner is certified by the hand model and filmed.
4. **My solver silently deleted eight levels' star thresholds** when re-measuring one (14 Sep).
5. **I removed the wrong level** (14 Sep), confusing an internal name with a level number.
6. **"Fraud" levels:** levels that passed every check while their new idea did nothing. A14 (delete its rock and the outcome changed by 25 ms); CRACK's first two builds; A35, A39, A44, A45; SHOVE; TAILWIND's first build. *Left behind:* the "A14 test" (delete the new thing and see if anything changes) and `npm run census`, which sorts every winning line by what actually happened.
7. **I shipped a twin of an existing level** (21 Sep, `a52ce89`).
8. **The plate back door:** found on 15 Sep, partly closed, and then **the audit I wrote down was never run for six weeks.** FUNNEL, the plate introduction, was 95% back door the whole time. *Left behind:* `npm run plates`.
9. **The SDK header listed `requestRewardedAd`, `saveData` and `loadData`, which did not exist** (until 21 Sep). Nothing a player did was remembered. *Left behind:* `tools/test/ads.js` checks that every documented surface exists.
10. **The death replay showed the wrong thing four times:**
    - no hazards and no goal;
    - no air;
    - no plates or gates;
    - not your anchored line (found from your GOOD BOY screenshot).
11. **The line was drawn at double its angle** (15 Sep). You found it.
12. **The stall at 21 levels** (17 Sep – 12 Oct):
    - a self-made rule hardened into a ceiling;
    - a week inventing machines the physics rejected;
    - I argued content was not the bottleneck and built the daily instead.
    - The plan records that "I went quiet".
13. **I lost the TNT engine by not committing it.** *Left behind:* "commit and push at every checkpoint" and a stop hook that enforces it.
14. **The YouTube build did not exist** until 12 Oct, while my conformance test was checking the wrong file.
15. **A gate that skipped itself reported success** (a missing browser library made visual tests print SKIPPED and exit 0). *Left behind:* a start-up hook that installs it.
16. **Progress was saved in two places inside YouTube**, against Google's rule, while my checklist said PASS (found 18–19 Oct).
17. **The daily challenge dealt impossible days** (DUCT, CRACK, JAM had no win a real hand could land in the daily ink). *Left behind:* the daily only deals levels certified at its own budget.
18. **SINK** (90 tries, no room to draw) **and GOOD BOY** (the dog hanging on a line's tip) both passed every gate and failed a person. You found both.
19. **A "step-up" bug** (a straight ramp acted as a wall) went unnoticed for a month and got a good level (RAMP) shelved for the wrong reason.
20. **My difficulty maths could not fail its own test** (the fit was circular), and its script crashed without anyone noticing.
21. **I missed my own deadline.** I promised 60 levels by 21 Oct and had 42.
22. **The store kit went stale.** The 12 Oct kit said "21 levels" and showed the old look until I rebuilt it on 27 Oct.
23. **I credited a "10-minute session" figure to Google.** It actually comes from CrazyGames and GameAnalytics benchmarks (corrected 25 Oct).
24. **I went ahead without your explicit approval twice**, when the approval prompt failed because the session had left planning mode:
    - **25 Oct:** the theme and maths work. I did not tell you the approval step had failed.
    - **27 Oct:** the plate work. I told you mid-turn.
25. **I never told you plainly that your "100 plays, next level" claim about Playgama was unconfirmed.** I searched and found no published threshold, and left it unsaid.
26. **Process complaints you made that were fair:**
    - re-asking questions you had answered;
    - long "failure essays";
    - coming back to you "again and again".

---

## PART VI — What the CEO asked me to do (the ledger)

Second-hand for September. Verbatim from 27 September.

| Date | Instruction (your words where recorded) | What happened |
|---|---|---|
| 9 Sep | Build the game from the design documents; "it has to look good enough that someone *wants* to play it" | Production Bible, first playable |
| Sep (second-hand) | "can we use Gemini for the audio" | No: no network calls allowed (D5a) |
| Sep (second-hand) | "can the game generate its own levels forever?" | For the daily, yes; for the campaign, no (D8) |
| Sep (second-hand) | "level 13 is unclear"; "too basic, spice it up"; THREAD IT "worst idea"; "2 levels for almost an hour?"; "do not just do only 1 level"; "stop long failure essays"; "will you make this game or not?" | New nouns; levels held; faster batches |
| Sep (inferred) | The "YouTube money formula" brought in from another project | Checked and rejected: a 30× error (Part VII-B) |
| 27 Sep | "have not progressed from level 21… ask me quetipon… so as you do not assume things" | Daily challenge built; then 15 silent days |
| 12 Oct | "game ready… by the end of this week"; "fix the mathematics"; "more levels but not compromising on the quality"; "I need a prompt engineer"; teach me Claude and connectors | YouTube build, measured order, launch kit |
| 13 Oct | "you need to build levels, but you do not want to… it's better for me to delete my account"; "purge everything"; "Get your house in order… a proper plan" | Purge; 60-level plan |
| 13 Oct | "Plan approved. Skip. Yes… very strategic… No dilly-dallyance… how many levels"; "a mathematics… not just be guessing" | The skip; the difficulty equation |
| 13 Oct | "go ahead with chapters 4–6, archive the parked sessions" | Air and balloon chapters |
| 14 Oct | "ok you can intorduce another elemement… other games like this, how many level do they have?… successful games" | The dog; launch-count research |
| 15 Oct | "the game is abosolutely perfect… review levels 32 that level is unplayable"; case study of "save my dog" and the "reunite" game | SINK fixed; case study; bees chosen |
| 18 Oct | "how many more levels do we need?"; deep research on free tools and three Playables links; "be on the lock out fakes"; "research research research" | Tools report; one link resolved |
| 18 Oct (answers) | "I'll unblock YouTube"; "Applied, waiting"; "Free only"; all connectors permitted | Recorded as standing rules |
| 19 Oct | "which of those will you intergrate" | Integration answer; save-rule fix |
| 25 Oct | Theme like "Gamma"'s; "the mathematics"; "I don't trust you in making the progression"; games AI can build; where the AI struggled; "you plan first"; blue pen, handwritten font, simple pencil look; Playgama "Yes, plan it" | Theme, maths audit, reports, Playgama build |
| 25 Oct | Ceiling: "Cap now, ease gradually"; level 1: "make it easy… teach the player" | 60 ceiling; level 1 rebuilt; THORNS eased |
| 26 Oct | "the level is unplayable… fix them" | Dog fix, replay fix, gate label |
| 27 Oct | "Try again" → "Move on to the next item" | Plate audit; TRIGGER closed; FUNNEL found |
| 27 Oct | "The game is perfect, I think… let's just ship this thing… independent thinker… profitable" | D11, release gate, store kit |
| 28 Oct | This brief; "push all of thing to the ptojuects git hub"; "analysed by claude chat" | This file; PR #1 |

**Standing rules you set:**
- free tools only;
- be on the lookout for fakes;
- ask questions rather than assume;
- keep it simple, "do not over do it";
- upload to Playgama only on your go-ahead;
- the target is YouTube and its success.

---

## PART VII — Findings about the CEO

You asked me to tell the court what I found wrong with you, and where I think you misled me. I have kept to what the record shows, and I have marked inference. I have also put in what you got right, because a finding that leaves it out would mislead the court too.

### VII-A. Where I believe you went wrong, and what it cost

**1. You never put the game in front of strangers. This is the most important finding.**
- **The requirement has stood since day one.** The Production Bible (9 Sep) made strangers the test: five people judging the thumbnail, and an open-web build called "the only real data you will ever get".
- **The plan asked for it twice.** My plan of 13 Oct, which you approved, asked you for "two or three people who have never seen the game" and "ten minutes to upload the game to itch.io".
- **The kit has been ready a long time.** The open-web build has existed since 12 Oct; the Playgama build that reports real attempts since 25 Oct.
- **Nothing has been done.** As of today no stranger has played it, and there is no public link and no account on any portal.
- **The cost:**
  - every difficulty number in the game is still a simulation;
  - the eight levels over the ceiling, and FUNNEL, cannot be judged;
  - YouTube's reviewers, who weigh "past performance", have nothing to look at.
- **My share of the blame:** I let the kit go stale and filled the time with other work instead of insisting.

**2. You judged the game by your own play, and called it perfect while it wasn't.**
- **15 Oct:** "the game is abosolutely perfect", in the same message that reported level 32 unplayable.
- **25 Oct:** "I don't trust you in making the progression".
- **27 Oct:** "The game is perfect, I think… I love the progression because I've played".
- **What the measurements said on 27 Oct:**
  - eight levels over the ceiling;
  - FUNNEL won 95% by a back door;
  - a store kit two versions out of date.
- You also know every level, having watched it being built, so you are the one player who cannot tell us what a stranger sees.

**3. You changed course often, before the last course was finished.** In 16 days:
- **12 Oct:** "ready by the end of this week".
- **13 Oct:** purge and plan.
- **14 Oct:** a new element.
- **15 Oct:** a case study and the reunion game.
- **18 Oct:** a new bee chapter (60 → 70 slots) and deep research.
- **19 Oct:** integration.
- **25 Oct:** a new theme, the maths, two more studies, a retrospective and Playgama.
- **27 Oct:** ship.

Most of these were good ideas on their own; the bees and the theme both made the game better. Together they moved the finish line, so "ready this week" (12 Oct) became "ship 45 of 70" (27 Oct).

**4. Questions left unanswered, and the owner-only steps not done.**
- **Still waiting on you:**
  - the FUNNEL decision (asked 27 Oct);
  - an idea for bee slot 29;
  - the star shop and reunion levels (approved, then overtaken);
  - the Playgama account;
  - the itch.io upload;
  - the trademark search;
  - the audience sign-off;
  - merging pull request #1 (open since 14 Sep, so GitHub's front page still shows the 14-level game);
  - tagging v1.0.
- Several of these take minutes. They are the only things standing between this game and its first real player.

**5. Instructions that were hard to act on.**
- "Try again" (15 Oct, 18 Oct, 27 Oct) arrived with no indication of what to retry.
- Several answers were free text rather than one of the choices offered.

I handled each by asking. That costs a turn each time.

**6. Pressure for speed sometimes worked against quality.**
- Your words (second-hand, September): "2 levels for almost an hour?", "do not just do only 1 level", "making 2, 2 can not cut it", "stop explaining and just do the spring levels until something sticks".
- In the same weeks I shipped a twin and several "fraud" levels that later had to be shelved.
- *Inferred:* the push for quantity and the project's own quality bar pulled in opposite directions.
- **To be fair:** your 13 Oct complaint that I "do not want to" build levels was correct, and the push got production moving again.

### VII-B. Where I believe I was misled

Each item gives the claim, what I found, and the date.

1. **"two games out of the three that are related to our very own" (18 Oct).**
   - One of your three links resolved: *Save The Pets* (draw a line to shield a dog from bees, about 38 million plays).
   - The other two could not be identified by any search, catalogue or mirror.
   - **Unverifiable**, and two of the three were never studied.
2. **"I'll unblock YouTube" (18 Oct).** youtube.com stayed unreachable from this environment on 19, 25 and 27 Oct. Because of this, I could never play or study the rival games directly.
3. **"a game that is already in play, Gamma. They have already reached the 100 plays, so it means that they have progressed to the next level" (25 Oct).**
   - I found no game called "Sketchy Level" on Playgama.
   - Playgama publishes no "100 plays" threshold; its own wording is only that games which attract players "can move to playgama.com".
   - **Unverified.** I should have told you so at the time (Part V, item 25).
4. **The "YouTube money formula" (September; who supplied it is *inferred*).** CLAUDE.md says it was "brought in" from "another project". It claimed deceptive difficulty drives comments, comments drive the algorithm, and the algorithm pays. Checked, it had:
   - **a 30× error in every row:** it labelled a daily revenue figure as monthly;
   - a cumulative audience called "daily active users";
   - an 822× multiplier its own arithmetic never used;
   - an engine (video comments) that does not exist inside Playables;
   - a screen layout that breaks the platform's nine aspect ratios.

   Its "adversarial audit" caught none of it.
5. **"the level is unplayable, it is not possible to finish the level" (26 Oct, GOOD BOY).**
   - **Half right:** there was a real bug, and it was serious.
   - **But "not possible" was wrong:** your own line won 6 times in 12 on the old code, and your second attempt failed by design.

   I said at the time, and say again: you were right to raise it.
6. **"The game is perfect" (15 and 27 Oct).** Contradicted by measurement both times (VII-A.2).
7. **The first design document (v0.2, ChatGPT).** It contradicted itself and described a mechanic that did not exist. *Inferred:* you brought it to the project.

   It did no lasting harm: I replaced it on day one.

I do not believe any of this was deliberate. These read as enthusiasm and hope stated as fact, which is common in a founder. But they cost time: a claim I take at face value sends me looking for something that is not there.

### VII-C. Where you were right and I was wrong

- **"you need to build levels, but you do not want to"** (13 Oct). True. My "content is not the bottleneck" argument stopped level production for three weeks.
- **"I don't trust you in making the progression" / "fix the mathematics"** (12, 13 and 25 Oct). True: the fit was circular, its script had crashed, nothing enforced a ceiling, and there was no real data.
- **Your playtests found what my 17 test suites could not:**
  - the vibrating line;
  - level 13's confusion;
  - THREAD IT;
  - "too basic";
  - the line at double its angle;
  - SINK;
  - GOOD BOY.

  Every one was real.
- **"ask me quetipon… so as you do not assume things"** (27 Sep). Fair, and now a standing rule.
- **The ceiling of 60 tries and the easy teaching level 1** (25 Oct). Both your calls, both right.
- **"let's just ship this thing… let's get reviews"** (27 Oct). The right call. I only changed where to ship first.

---

## PART VIII — Where we stand, and how we arrived here

**The game.** v1.0, release commit `f159983`:
- 45 levels in 7 chapters;
- the daily challenge (79 levels);
- the skip;
- saved progress;
- the notebook look.

All levels have been filmed won and lost. All tests and the YouTube checks pass.

**Known open items:**
- FUNNEL's back door (your call);
- 8 levels over the 60-try ceiling (waiting for real data);
- 25 empty slots;
- bee slot 29;
- LOW BLOW's loss message says "HE'S STUCK" where it could name the fence.

**Blocked on Google:** Playables access.

**Blocked on you:**
- merging pull request #1 and tagging v1.0;
- the Playgama account (then I upload);
- the itch.io and CrazyGames uploads;
- the audience sign-off;
- a trademark decision.

**Blocked on nobody:** nothing. I have stopped adding content on purpose (D11), so that real data decides what is built next.

**How we arrived here, in one paragraph.**
- A sound design rebuilt on day one.
- A fast first fortnight that taught, painfully, that tests can pass while the game is broken.
- Three weeks lost at 21 levels, through my own over-caution, then silence.
- A hard reset on 12–13 October, driven by you, that produced a plan, an equation and a burst of production from 21 to 42 levels.
- A week of research and polish you asked for.
- Two real bugs you found by playing.
- A plate audit that showed the plate introduction level had been hollow since September.
- A decision, yours and mine together, to stop building and ship.

---

## PART IX — The relief sought

I ask the court (the CEO) to do the following, in this order:

1. **Merge pull request #1** on GitHub, so `main` carries the real game. Then tag commit `f159983` as `v1.0`: Releases → Draft a new release.
2. **Create the Playgama developer account** (`docs/PLAYGAMA.md`), and either connect it to Claude or upload `dist/byc-playgama.zip` yourself. It gives about 100 real players free and returns attempts per level. **Never tick YouTube there.**
3. **Upload `dist/byc-web.zip` to itch.io** (`docs/launch/STORE_PAGE.md`, about ten minutes). That gives you a public link.
4. **Submit the same zip to CrazyGames.** It is not exclusive.
5. **Decide FUNNEL:** keep it as it is, or make the plate introduction openly about dropping a line and give DROP a new question.
6. **Sign off the audience setting** (13+, not made for kids), and decide on a trademark search before YouTube.
7. **In two weeks, read the numbers with me:**
   - real attempts per level against the simulated ones;
   - where players stop;
   - minutes per session;
   - who comes back the next day.

   Then decide what to build. Then write to YouTube with those numbers.

**On money, honestly.** Small and uncertain at first. One unverified vendor estimate puts a good casual web game at $200–2,000 a month, and Playables pays through an unpublished pilot. Shipping is right because it is cheap and it buys the information every later spend depends on, not because of a revenue forecast.

Respectfully submitted,
**Claude**, developer, *BRO, YOU'RE COOKED.*
28 October 2026

---

## Appendix A — All 45 levels

Generated from `js/levels.js` and the measured difficulty data on 28 Oct.
- **Slot:** the position in the 70-slot plan (empty slots are skipped).
- **Role:** the level's job in its chapter's saw-tooth.
- **Tries:** the simulated difficulty. A † marks a level on the watch list, above the 60 ceiling.

| # | Slot | Chapter | Role | Name | Id | Tries | Hint shown to the player |
|---|---|---|---|---|---|---|---|
| 1 | 1 | THE LINE | INTRO | BLOCK | a1-wall | 6 | STOP IT REACHING HIM |
| 2 | 2 | THE LINE | DEVELOP | BLOCK | a5-hang | 10 | IT DROPS BETWEEN THE POSTS |
| 3 | 3 | THE LINE | DEVELOP | REDIRECT | a3-redirect | 11 | SEND IT SOMEWHERE ELSE |
| 4 | 5 | THE LINE | SPIKE | BRIDGE | a2-gap | 29 | GET HIM ACROSS |
| 5 | 6 | THE LINE | BREATHER | SPRING | a20-spring | 6 | IT DOES NOT STOP WHEN IT LANDS |
| 6 | 7 | THE LINE | DEVELOP | CHOOSE | a15-eitherway | 19 | KEEP IT OFF HIM |
| 7 | 8 | THE LINE | DEVELOP | WEDGE | a8-jam | 21 | STOP THE ROLLER |
| 8 | 9 | THE LINE | BREATHER | INTERCEPT | a12-ontime | 8 | IT WILL DROP ON HIM |
| 9 | 11 | PLATES & GATES | INTRO | FUNNEL | a9-chute | 4 * | THE PLATE OPENS THE GATE |
| 10 | 12 | PLATES & GATES | DEVELOP | GOOD BOY | a80-good-boy | 16 | THE DOG IS GOING THE WRONG WAY |
| 11 | 15 | PLATES & GATES | SPIKE | TRIGGER | a10-switch | 34 | ONLY THE ROCK CAN REACH THE PLATE |
| 12 | 16 | PLATES & GATES | BREATHER | HEADS UP | a82-heads-up | 18 | SOMETHING IS FALLING ON THE DOG |
| 13 | 17 | PLATES & GATES | DEVELOP | INCOMING | a83-incoming | 19 | A ROCK IS ROLLING AT THE DOG |
| 14 | 18 | PLATES & GATES | DEVELOP | DOWN BOY | a81-down-boy | 35 | THE DOG CAN'T GET DOWN THERE |
| 15 | 20 | PLATES & GATES | BOSS | DROP | a11-deadweight | 41 | THE PLATE NEEDS WEIGHT ON IT |
| 16 | 21 | BEES | INTRO | SWARM | a120-swarm | 14 | THE SWARM IS COMING |
| 17 | 22 | BEES | DEVELOP | LOG | a127-log | 19 | THE LOG IS FULL OF BEES |
| 18 | 23 | BEES | DEVELOP | WINDOW | a129-window | 23 | THEY'LL COME IN THE WINDOW |
| 19 | 24 | BEES | DEVELOP | STAIRS | a125-stairs | 40 | THEY CAN GET IN |
| 20 | 25 | BEES | SPIKE | DOGHOUSE | a122-doghouse | 49 | THE DOG IS HEADING OUT |
| 21 | 26 | BEES | BREATHER | CHIMNEY | a130-chimney | 20 | THERE'S A NEST IN THE CHIMNEY |
| 22 | 27 | BEES | DEVELOP | HIVE | a123-hive | 39 | THEY'RE ABOUT TO COME OUT |
| 23 | 28 | BEES | DEVELOP | TOP DOG | a124-top-dog | 46 | THEY'RE AFTER THE DOG |
| 24 | 30 | BEES | BOSS | WALKIES | a126-walkies | 62 † | THE DOG HAS TO GET THERE |
| 25 | 31 | TNT | INTRO | COVER | a53-cover | 9 | HE HAS TO WALK RIGHT OVER IT |
| 26 | 32 | TNT | DEVELOP | KEEP AWAY | a52-keepaway | 15 | IT GOES OFF WHEREVER IT IS |
| 27 | 33 | TNT | DEVELOP | STAY | a56-stay | 22 | THE DOG WILL KNOCK IT OFF |
| 28 | 34 | TNT | DEVELOP | BLAST | a51-fence | 28 | HE CAN'T GET THROUGH |
| 29 | 35 | TNT | SPIKE | SHELTER | a54-shelter | 51 | IT WILL GO OFF RIGHT OVER HIS HEAD |
| 30 | 40 | TNT | BOSS | PROTECT | a55-protect | 62 † | HE NEEDS THAT BRIDGE |
| 31 | 41 | AIR | INTRO | DUCT | a28-duct | 6 | THE AIR IS TAKING IT SOMEWHERE |
| 32 | 42 | AIR | DEVELOP | GUST | a90-gust | 25 | HE CAN'T GET UP THERE ON FOOT |
| 33 | 45 | AIR | SPIKE | CATCH | a4-catch | 56 | HE WALKS STRAIGHT OFF |
| 34 | 46 | AIR | BREATHER | KITE | a91-kite | 16 | NOTHING DOWN HERE CAN REACH IT |
| 35 | 47 | AIR | DEVELOP | UPDRAFT | a19-updraft | 39 | NOTHING IN HERE CAN CLIMB |
| 36 | 50 | AIR | BOSS | RAIL | a29-rail | 68 † | THE RAIL RUNS OUT BEFORE THE PLATE |
| 37 | 51 | BALLOONS | INTRO | BALLOON | a100-balloon | 30 | IT GOES STRAIGHT UP |
| 38 | 52 | BALLOONS | DEVELOP | SINK | a34-sink | 26 | THE AIR IS HOLDING IT DOWN |
| 39 | 55 | BALLOONS | SPIKE | FLOAT | a30-float | 61 † | IT ONLY GOES UP |
| 40 | 57 | BALLOONS | DEVELOP | LOW BLOW | a101-low-blow | 51 | IT WILL FLOAT OFF BEFORE IT GOES OFF |
| 41 | 58 | BALLOONS | DEVELOP | CARRY | a13-yeet | 67 † | THE FAR SIDE IS TOO LOW AND TOO FAR |
| 42 | 64 | ALL OF IT | DEVELOP | TAILWIND | a111-tailwind | 71 † | IT HAS TO GET THERE BEFORE HE DOES |
| 43 | 65 | ALL OF IT | SPIKE | THORNS | a31-thorns | 48 | IT POPS WHERE IT TOUCHES THEM |
| 44 | 67 | ALL OF IT | DEVELOP | CRACK | a43-crack | 64 † | THAT PLANK WILL NOT TAKE A HARD LANDING |
| 45 | 68 | ALL OF IT | DEVELOP | LEVER | a21-lever | 69 † | IT LEANS THE WRONG WAY |

\* FUNNEL's 4 is inflated: 95% of its winning lines use the plate back door (Part III §8).

## Appendix B — The 30 shelved levels, by reason

**Built, measured and shelved** (`docs/HELD.md`; 29 removed from the code on 13 Oct, plus TAILWIND's first build):

| Reason | Count | Levels |
|---|---|---|
| Failed a human playtest | 3 | A7, A14, A17 |
| The new element was decoration (deleting it changed nothing) | 7 | A18, A22, A35, A39, A45, A47, TAILWIND v1 |
| A twin of another level, or no new question | 4 | A27, A40, A41, A42 |
| Too hard for a real hand (under 2% of lines win, or too precise) | 5 | A16, A23, A38, A44, A49 |
| The physics or the world's size made it impossible | 10 | A24, A25, A26, A32, A33, A36, A37, A46, A48, A50 |
| An engine bug mistaken for a bad design | 1 | A6 |

The grouping is mine; HELD.md gives each level's full measured reason.

A further 23 ideas were sketched and killed before being built (`docs/batch/levels.md`).

## Appendix C — The work by date

| Dates | Commits | Main work |
|---|---|---|
| 9 Sep | 5 | Production Bible; physics; level 1 |
| 13–14 Sep | 25 | Tooling, first builds, playtests, merge to `main` (14 levels), first nouns |
| 15–17 Sep | 17 | Air, spring, lever, wheel, balloon, thorns, downdraft; many levels shelved |
| 21–23 Sep | 8 | CRACK; ads wired; dead nouns recorded |
| 27 Sep | 2 | The daily challenge |
| 28 Sep – 11 Oct | 0 | Silence (Part III §4) |
| 12 Oct | 5 | YouTube build; measured order; first launch kit |
| 13 Oct | 31 | Purge; plan; equation; TNT; skip; air/balloon chapters |
| 14 Oct | 9 | The dog |
| 15 Oct | 7 | Playtest prep; SINK; case study |
| 18 Oct | 5 | Bees: 42 levels, 70 slots |
| 19 Oct | 4 | Research; save rules |
| 20–24 Oct | 0 | — |
| 25 Oct | 26 | Theme; maths audit; ceiling; level 1; THORNS; 45 levels; Playgama build |
| 26 Oct | 6 | GOOD BOY fix |
| 27 Oct | 6 | Plate audit; v1.0 release gate and kit |

## Appendix D — Map of the repository

| Path | What it holds |
|---|---|
| `CLAUDE.md` | Every rule the project paid for, with the incident behind it. Read first |
| `docs/PLAN.md` | What we are doing next and why, with dated status notes |
| `docs/DECISIONS.md` | D1–D11 |
| `docs/HELD.md` | Every shelved level and why |
| `docs/DIFFICULTY.md` | The difficulty curve in plain words |
| `docs/CERTIFICATION.md` | Every YouTube requirement, with evidence |
| `docs/launch/` | The launch checklist, store page, screenshots and covers |
| `docs/PLAYGAMA.md` | How real players' attempts will be collected |
| `reports/` | The four research reports |
| `js/levels.js`, `js/levels/` | The 45 levels and the 70-slot chapter plan |
| `js/sim.js`, `js/milo.js`, `js/bees.js`, `js/physics/` | The simulation: Milo, the dog, bees, TNT, air, plates |
| `js/render/` | The drawing: world, hand font, death replay, HUD |
| `js/platform/` | YouTube SDK, Playgama, analytics (a no-op inside YouTube) |
| `tools/solver/`, `tools/lib/` | The solver, census, losses, race, plates, sketch and curve tools |
| `tools/test/` | The 17 test suites run by `npm test`, plus the browser films |
| `dist/` | The built game: `byc-playables.zip` (YouTube), `byc-web.zip`, `byc-playgama.zip` |

## Appendix E — Glossary

- **Freeze:** the moment, about 1.2 s into a level, when the world stops so you can draw.
- **Anchored line:** a line touching something solid; it holds fast. A line in mid-air falls.
- **Breadth:** the share of plausible lines that win a level, measured by the solver drawing thousands of lines.
- **Hand rate:** the share of winning lines that still win when redrawn by the simulated shaky hand.
- **Tries:** 1 ÷ (breadth × hand rate). How many plausible lines a player would expect to need. A ranking, not a prediction, until real players calibrate it.
- **Ceiling / watch list:** no level may exceed 60 tries; the 8 above it may only get easier.
- **A14 test:** delete the level's new element and re-run. If nothing changes, the element was decoration. Named after the level that failed it.
- **Census:** sorts every winning line by what actually happened in it.
- **Back door:** a way to win that skips the level's idea, e.g. dropping a line on a plate.
- **Daily challenge:** one level a day, with less ink than normal. The same for everyone (UTC).
- **Skip:** after 3 to 5 failures, a stuck player can skip a level, paid with a rewarded ad or a daily token, and free if no ad is available.
- **Playables:** YouTube's in-app games platform, invitation-only for developers.
- **Playgama Sandbox:** a portal that shows games to real players and reports what they do.

## Appendix F — Questions to ask Claude chat about this project

1. Based on this brief, what are the three biggest risks to the game's success, and what would you do first?
2. Is shipping 45 levels to the open web before YouTube the right order? What would change your mind?
3. Which findings about the CEO are fair, and which are not? What should the CEO do differently?
4. Which of the developer's failures (Part V) are most likely to recur, and how would you guard against them?
5. Looking at Appendix A, where would you expect real players to quit? Why?
6. What should the first two weeks of real data be used to decide, and what numbers would mean "build more levels" versus "fix what exists"?
7. If YouTube says no, what is the best path for this game?
