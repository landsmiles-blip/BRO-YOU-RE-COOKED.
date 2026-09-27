# Locked Decisions

Every open item from `PRODUCTION_BIBLE_v1.0.md` Part 11, now closed. The user delegated these calls; each is recorded with its reasoning and its reversal cost, so any of them can be reopened deliberately rather than by drift.

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

## D6 — Content scale · **DEFERRED BY DESIGN, gated on data**

24 levels is the shippable game. Whether it becomes 16 or grows toward 60 is decided at the M1 gate on **measured authoring cost**, not on optimism. This is deliberately not decided now — deciding it early is precisely how projects end mid-air.

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

**Verification order, every time:** `npm test` → `node tools/solver/representative.js`
→ build → `node tools/test/filmstrip.js` → **read the images** → `npm run solver`
→ `npm run test:browser`.


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

**Also: no AI sub-agents.** The "assistant" here is a script. Parallel agents
would start with no memory of this project and re-derive the physics, the gates
and why A14 was a fraud, turning build time into coordination time. One owner,
one tool.
