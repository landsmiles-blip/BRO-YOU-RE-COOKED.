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
