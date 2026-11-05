# Red team (Agent D), run 5 Nov 2026

Tags: [DOC url] = page fetched this session (WebFetch returns a small model's summary, not raw text). [CODE path:line] = repo file read this session. [MEASURED: where, UTC] = number I read or timed. [CALC] = arithmetic shown. UNVERIFIED = could not confirm. I put no quotation marks around words I did not read; short quoted phrases are marked. Edited nothing except this file. Chrome: 1 tab at a time, closed. Local server started and stopped (my node process 15368 killed; another node process, 10092 from 07:57, is not mine and was left alone).

Scripts and images are in the session scratchpad C:\Users\BDE\AppData\Local\Temp\claude\151dc1432df872d4\f93359a5-ec63-4162-a799-ed0f23e209bc\scratchpad (an.py, an3.py, an4.py, an5.py, pick.py, tt.py, tile_*.jpg, mb_*.jpg, cc_*.jpg).

vidIQ credits: spent 10 (two transcripts at 5 each; cost text read first: "Cost: 5 credit(s) per call") of my 15. Balance before 70, after 60 [MEASURED: vidiq_balance, 2026-11-05, three readings]. get_images not needed (I pulled thumbnails from i.ytimg.com with curl, free).

## 1. Claim-by-claim table (33 claims)

Verdict counts: CONFIRMED 17, WEAKENED 10, REFUTED 2, CANNOT CHECK 4.

| # | File | Claim | Verdict | Evidence |
|---|---|---|---|---|
| 1 | A | 30/30 newest long thumbnails have a face | WEAKENED | Re-looked at 10 real thumbnails (ranks 3, 6, 7, 13, 17, 18, 20, 24, 28, 29): all show a face [MEASURED: i.ytimg.com mqdefault, 2026-11-05]. But A's own row 11 says the face is not readable (tiny figure), and row 28 is a 2017-era webcam frame reused. So 29 of 30 readable. No base rate for non-MrBeast videos, and A's own flops (0.4x-0.5x outlier) also have faces |
| 2 | A | 25/30 titles contain a number | CONFIRMED | Re-fetched all 30 titles from YouTube oEmbed [MEASURED: youtube.com/oembed, 2026-11-05 ~14:40 UTC]; regex for a digit: 25 of 30. Five without: items 4, 5, 7, 16, 24. (Item 1 has since been renamed, see #6; I used A's string) |
| 3 | A | 17/30 titles contain a dollar amount | CONFIRMED | Same pull: 17 titles contain a dollar sign [CALC] |
| 4 | A | 11/30 have overlay text of 1-2 words | CONFIRMED (10 of 10 spot checks agree) | Items 3 (DAY 201), 6 (100 COPS), 7 (DAY 111), 17 (DAY 29) have text; 13, 18, 20, 24, 28, 29 have none, as A says (item 18 has the word SCHOOL on a building sign, which A labels in-scene) |
| 5 | A | Mean title length 7.0 words, range 4-11 | CONFIRMED | 6.97, 4 to 11 [CALC from same pull] |
| 6 | A | Haaland vs LeBron flip was a live title test | WEAKENED | F's vidIQ change log shows four title strings in 101.5 h and an empty abTests list; oEmbed today returns a fourth title, Beat Professional Athlete, Win $100,000 [MEASURED: oEmbed 2026-11-05]. A's observation is explained by sequential edits as easily as by a test. UNVERIFIED either way |
| 7 | A, B | Handbook claims: first minute matters, CTR/AVD/AVP metrics, re-engagement at minutes 3 and 6, 70% retention | CANNOT CHECK | By rule I did not open any leaked-file mirror. All are second-hand (see section 6) |
| 8 | B | Ronaldo: teaser at 5:24 for Lyles vs IShowSpeed, payoff at 16:06-18:20 | CONFIRMED | Transcript [MEASURED: vidiq_video_transcript 0BjlBnfHcHM, 2026-11-05]: the 5:24 block says Noah Lyles returns later to race IShowSpeed; the 16:06 block opens the payoff and the race result is at ~17:47; Yahoo ad starts 12:47; Beast Games promo 18:20; $1M win 21:52. All B timestamps I checked match to the transcript's 15 s blocks |
| 9 | B | Circle: first elimination about 0:49 | CONFIRMED (within the 15 s block) | Transcript [MEASURED: zajUgQLviwk, 2026-11-05]: stake and rule by 0:16; "first elimination" is announced inside the 0:32 block and the reaction is at 0:49; winner at 37:55; Shopify read 16:21-17:09; "half of you are going home" at 7:31 |
| 10 | B | Payoff placement at 82-98% of runtime is a device | WEAKENED | Arithmetic holds: 37:55/38:38 = 98%; 21:52/22:45 = 96%; 18:37 (start of climax)/22:45 = 82% [CALC]. But that is true of any contest edit, n = 3 videos, no comparison. "On purpose" is not shown |
| 11 | B | Most replayed peak positions | CANNOT CHECK | Needs the live graph, read by eye by B at +/-15-20 s; I did not re-view. B itself says it is replay density, not retention |
| 12 | B | Cut cadence 1.3-1.5 s | CANNOT CHECK | Second-hand (Gigazine summary of a Washington Post piece); not measurable from transcripts |
| 13 | C | Median plays about 988k; 140 / 477 / 92 of 959 games at >=10m / >=1m / <100k | REFUTED as a catalogue statistic | Hub CSV (1,124 rows) gives median 665,500; counts 142 / 475 / 264 [CALC, section 2a]. The >=10m and >=1m counts agree; <100k is 264, not 92: C's first pass lacked about 170 low-play tiles, so its median was biased up |
| 14 | C | Top-30 list and plays | CONFIRMED | CSV top 30 order and plays match C's list (1M rounding differences: Snake Clash 105m, Dessert DIY 96m vs C's 104m, 95m) |
| 15 | C | Draw/rescue titles are about 3x over-represented (8 of top 50 vs 51 of 1,091) | WEAKENED | Reproducible only with a keyword list that includes thief, dop and delete (section 2a): 8/50 = 16% vs 54/1,124 = 4.8%, 3.3x. Literal draw/rescue/escape/save gives 6/50 = 12% vs 50/1,124 = 4.4%, 2.7x. At top 100 it is 1.57x, top 150 1.50x, top 200 1.35x; the top-50 window is chosen after the fact. Family median plays 1.1m vs 665.5k overall (1.65x); 24 of 54 matches are below the hub median |
| 16 | C | Publisher size does not separate draw games | WEAKENED | True of the 3 to 5 draw games C opened. At the top it fails: 16 of the 23 dated top games are from five publishers (Supersonic 6, SayGames 5, CrazyLabs 2, Voodoo 2, Supercent 1) that together list 73 games of about 2,133 [CALC from tracker CSV and DOC playables.games/publishers/]. 7 of 23 are from others (Save The Pets, Mini Relaxing Game, Find the Alien, Magic Tiles 3, Skincare Time, Running Pet, Thief Puzzle/Famobi) |
| 17 | C | Cumulative rank mostly encodes age | WEAKENED | Within the dated top 23, Spearman correlation of age and plays is 0.08 [CALC]; median age 779 d, but ages span 37 d to 1,031 d, and per-day rates span 35K to 1,054K. Age is a necessary condition for the very top (100M at 138K/day needs about 725 d [CALC]) but is not what orders the top; "mostly" is unsupported |
| 18 | E | Dubit: top 10% hold 76.6%; 167 of 1,669 games | CONFIRMED | Refetched [DOC https://dubit.io/library/how-many-plays-does-a-youtube-playables-game-get, 2026-11-05]: 23 Sep 2026, 1,669 live games, 76.6%, 167 games, top 10 hold 17.9%, median about 290K, mean about 2.9m, about 4.8bn total |
| 19 | E | Playgama five games 5.558M first week, 11.74M now, 47% | CONFIRMED (arithmetic and one source) | 2.0 + 1.2 + 0.968 + 0.887 + 0.503 = 5.558; 4.6 + 2.3 + 2.2 + 1.7 + 0.942 = 11.742; 5.558 / 11.742 = 47.3% [CALC]. Draw Crash Race page: about 2.2M, added 28 Aug 2026, publisher Playgama [DOC https://playables.games/games/draw-crash-race/]. I did not re-read the Playgama article |
| 20 | E | Top seven are from established publishers | CONFIRMED | Tracker top 7: Supersonic x3, Supercent, SayGames, CrazyLabs, Famobi [DOC tracker CSV; playables.games/games/thief-puzzle/ gives Famobi, 13 Aug 2024]. YouTube's highlighted list is SayGames, Supercent, Supersonic, Voodoo, Playgama, TapNation, CrazyLabs; Famobi is not on it [DOC https://mobilegamer.biz/youtube-has-quietly-rolled-out-playables-across-europe/, 24 Sep 2026]. 6 of 7 on it. Attribution is the tracker's |
| 21 | E | Playgama wiki: submits only best performers, picks fit with YouTube; average playtime above 8 min | CONFIRMED | [DOC https://wiki.playgama.com/playgama/game-requirements/platform-specific-requirements.md, 2026-11-05, summary]: best performers on its platform and partners, then chosen with YouTube; YouTube takes limited numbers; target average playtime ideally over 8 minutes |
| 22 | E | Sandbox gate "100 plays at 5 minutes" is not public | CONFIRMED (not found) | Not in the platform-requirements page, nor in the whole MCP tools page (first 100,000 characters and the remainder) [DOC https://wiki.playgama.com/playgama/mcp/tools.md]. It says targets sit on the sandbox card in the console and are not listed. The only public 100 is a free sandbox campaign aimed at about 100 gameplays (referral bonus). The owner's repo claim stays UNVERIFIED. A search snippet of a third-party listing says ad types unlock after an unspecified session threshold (not a number) |
| 23 | E | Save The Pets (138.8K/day) shows design beat publisher size | WEAKENED | Arithmetic fine [CALC 39M / 282 d = 138K]. But it is one survivor; its route to YouTube is unknown; its "added" date is the tracker's first sighting; and the genre page rates it #5 in Brain & Puzzle, which is not evidence of cause [DOC playables.games/games/save-the-pets/] |
| 24 | F | Selection-bias arithmetic (80 to 280 per 1,000 do-nothing changes; lift medians) | CONFIRMED | ln 2 = 0.693; z = 1.39, 0.87, 0.58 gives 8.3%, 19.3%, 28.2% [CALC]. Call 1 median (2.3 + 2.4) / 2 = 2.35, mean 16.6 / 6 = 2.77; call 2 median 109.45, geometric mean e^(28.115/6) = 108.4; 458 / 77.2 = 5.93; 5,669 x 72 = 408,168; 408K / 711.5K = 57%; 4 d 5 h 29 m = 101.5 h; 18:59:04 minus 18:48:46 = 618 s. Counts of 9 of 12 under 1 VPH per 1K subs and 7 of 12 under 4.3 VPH both recount from F's Table 1 |
| 25 | F | Pattern: repair a defect, make one thing big and clear | WEAKENED | F already says winners-only and no base rate. It should not be treated as a finding: 12 hand-picked rows at lift of at least 2x, one on topic, descriptions written knowing they won |
| 26 | G | Tile classifications (subject, threat, type, words) | WEAKENED | Re-looked at 12 randomly chosen tiles (seed 20261105; ranks 7, 9, 10, 11, 27, 28, 39, 40, 44, 106, 247, 314). I agree with most cells; I would change 4 tiles (see 2b), mainly the threat column |
| 27 | G | Tiles all 194x272; 1,021 of 1,124 images round to 0.71 | CONFIRMED | CSV: tile_w/tile_h 194/272 on all 1,124; aspect counts 0.71: 1,021; 0.67: 34; 0.72: 24; 0.75: 18; 0.56: 14 [MEASURED: hub CSV] |
| 28 | G / NEXT | Hub rounds to 100K for 1M-10M and 1M above 10M; 475 of 1,124 affected | CONFIRMED | 333 games from 1m to under 10m (all multiples of 100K), 142 at 10m or more (all multiples of 1M): 333 + 142 = 475. Below 1m the text is 3 significant figures (548 of 649 are multiples of 1,000) [CALC, section 2a] |
| 29 | G | BYC draw input blocked 0.17 s on level 1 and 5.0 s on level 2 | REFUTED as design values | Section 3: foreground tab, healthy frame rate, level 1 freezes at 285-294 ms and level 2 at 642-661 ms (code says 280 and 650). 5.0 s reproduces only at about 5 fps because of an 8-step cap per frame. 0.17 s is below the 280 ms code value, so G's poller most likely started after the phase began |
| 30 | G | The empty side bars are live input | CONFIRMED | A 19-point stroke started at x = 300 on the 1920-wide page was accepted (phase went to sim, no reject reason) [MEASURED: __byc.game, 2026-11-05 ~14:55 UTC]. A press during the live phase was ignored (stroke not started) |
| 31 | G | Playgama rule 1.6.8; BYC fails at 16:9 and 1:1 | CONFIRMED with a correction | 1.6.8 exists: a 1:1 window must be filled with no empty bars. 16:9 is not covered by 1.6.8; 1.6.1 requires filling the available area on any aspect ratio, which is a broader rule [DOC https://wiki.playgama.com/playgama/game-requirements/technical-requirements.md, summary]. It binds the Playgama build, not YouTube |
| 32 | G | Shell overlay times and peer load times | CANNOT CHECK | Not re-measured. My own machine ran this game at 2 to 6 fps at times, with the same browser (section 3), so G's timings (and the Doge Rescue 17.9 s) may be inflated by load from other agents. UNVERIFIED |
| 33 | G | BYC first paint 0.23-0.38 s vs peers 2.5-51 s | WEAKENED | G labels it as not comparable (localhost, no shell vs shell). It should not appear in any BYC-versus-peers sentence |

## 2. Stress tests

### 2a. Hub CSV, recomputed (Python 3.14, read-only, `python -I`)

Source: docs/research/data/hub-snapshot-20261105-0701Z.csv, scraped 2026-11-05T07:01:05Z.

```
rows 1124 ; unique ids 1124 ; rows without plays 0
median 665500.0 ; mean 4707162.6 ; total 5,290,850,807
>=10m 142 ; >=1m 475 ; <100k 264 ; quartiles [120000, 665500, 3775000]
top 12: Tall Man Run 112m, Build a Queen 107m, Snake Clash! 105m, Going Balls 102m,
 Stealth Master 99m, Dessert DIY 96m, Thief Puzzle 95m, Race Master 3D 88m,
 Phone Case DIY 84m, Hole.io 75m, Hide N Seek 74m, Magic Tiles 3 71m
bands: '<1m': 649, '1m-10m': 333, '>=10m': 142
>=10m multiple of 1e6: 142 of 142 ; 1m-10m multiple of 1e5: 333 of 333 ; <1m multiple of 1000: 548 of 649
top 10 share of plays 18.2% ; top 112 (10%) share 67.3% ; 90th percentile 12m
```

Notes. The hub holds 1,124 of the tracker's 2,133 games [DOC tracker-method.md], so its percentiles are not Dubit's (Dubit's 90th percentile was about 7m on 23 Sep). The ties at the top-50 boundary are real (the 45th to 56th rows are 26m, 25m, 24m, 23m): rank 50 is arbitrary within a 1M rounding step.

Title-keyword census. Regexes tried (case-insensitive, on `title`):

```
A  draw|rescue|escap|save                                   50 of 1124 (4.4%)  top50: 6 (12%)  ratio 2.70
B  draw|rescue|escap|save|thief|dop |delete                 54 of 1124 (4.8%)  top50: 8 (16%)  ratio 3.33   <- reproduces C's 8 of top 50
C  B plus \bpuzzle\b                                        112 of 1124 (10.0%) top50: 10 (20%) ratio 2.01
window sensitivity for A: top30 2 (1.50x), top50 6 (2.70x), top100 7 (1.57x), top150 10 (1.50x), top200 12 (1.35x)
binomial tail P(X>=6 | n=50, p=0.0445) = 2.3% ; P(X>=8 | p=0.048) = 0.15%  (not corrected for choosing the window)
```

So "8 of top 50 vs 51 of 1,091 = about 3x" is arithmetically fine (16% / 4.7%), but only because B adds Thief Puzzle (rank 7) and DOP 2: Delete One Part (rank 28), whose titles do not contain draw, rescue, escape or save.

Over-matching (regex A hits that are not obviously draw-a-line rescue games): Cat Escape (50), Go Escape! (221), Hamster Escape (230), ASMR Escape on the Keyboard (351), Gym Simulator: Escape (426), Snake Escape Puzzle (530), Goat Escape (577), Sheep Escape (660), Obby +1 Speed Controller Escape (687), Bus Escape: Clear Jam (726), Arrow Frenzy - Escape Puzzle (750), 3D Block Gladiator: Sword Draw (440), Draw Crash Race (348, racing), Drawing Carnival (39, colouring), ASMR Drawing game (242). Under-matching (draw-puzzle games with none of the words): Brain Out (176), Tricky Twist (139), Tricky Minds (66), Help Me: Tricky Story (240), Cut The Rope (60), Doodle titles. A Cat Escape tile (G #42) shows a crying kitten and arrow blocks, so it is a different genre from BYC.

Family level: matches B have median plays 1,100,000 vs 665,500 for the hub (1.65x); 28 of 54 (52%) reach 1m against 42% of all games; 12 of 54 reach 10m against 142 of 1,124 overall (22% vs 12.6%) [CALC]; 8 of 54 are under 100k. The label gives a fat top and an average middle.

Save/Rescue titled games (regex `\b(save|rescue)\b`), plays by rank: Save The Pets 26 (39m), Fish Story: Save the Nemo 106 (13m), Doge Rescue 179 (7.4m), Save the Dog-Puzzle 211 (6.1m), Girl Rescue: Dragon Out! 493 (933k), Save the Fish: Story of Dori 617 (510k), Save The Guy 663 (401k), Animal Rescue 1004 (11k). A 3,500x spread inside one title pattern.

Display rounding: confirmed (claim 28).

### 2b. G's tile census, 12 random tiles re-looked

Method: drew 12 of the 55 table ranks with `random.seed(20261105)`; downloaded each `thumb_url` from the CSV with curl; viewed the image files [MEASURED: yt3.ggpht.com images, 2026-11-05 ~14:42 UTC].

| Tile (rank) | G's reading | My reading | Change? |
|---|---|---|---|
| Thief Puzzle (7) | illustration, doodle, 2 words, 4 subjects, weak threat | same (stick figures on a rope and ring, masked thief, chained dog) | no |
| Phone Case DIY (9) | render, 0 words, no threat | same | no |
| Hole.io (10) | render, 1 word, no threat | same, but a cat-mouth hole swallowing a train is arguably a weak threat | borderline N to W |
| Hide N Seek (11) | clear threat (alerted seeker) | an exclamation mark above a runner and no weapon or hazard | yes, Y to W |
| Running Pet (27) | render, 2 words, weak threat (barrier), happy | same | no |
| DOP 2 (28) | 4 words, 2 cards | 5 lettered tokens (DOP, 2, Delete, One, Part); two small faces on the cards | trivial |
| Drawing Carnival (39) | flat/gameplay-like, 0 words, no threat | same (marker, swatches, half-coloured avocado) | no |
| Fashion Princess (40) | render, 0 words | same | no |
| Draw Bridge (44) | clear threat (gap, car about to fall), painted | a sunny valley, the arc is already drawn and the car sits safely on it; AI-glossy look | yes, Y to W |
| Save Nemo (106) | illustration (3D-style), clear threat | glossy 3D-looking render; shark and a terrified fish, threat clear | type I to R (borderline) |
| Draw Puzzle (247) | 5 words, bulging eyes, no threat | same | no |
| Draw Action (314) | 2 words, fight threat | same | no |

Result: 3 to 4 of 12 tiles would change, about 5 of roughly 108 cells (about 5%), almost all on the threat or type columns. The threat column is the least repeatable: with my re-read, draw peers with a clear threat drop from 10 of 15 to about 9 of 15 (60%) and the top 40 from 6 to about 5 (12.5%). The direction of G's table survives; the numbers carry more uncertainty than G's 67% vs 15% suggests, and G had one rater.

### 2c. A's counts

Done in claims 1 to 5: titles pulled live for all 30; 10 thumbnails viewed. All counts hold except that 30/30 faces should read 29/30 readable.

### 2d. B's timestamps

Done in claims 8 to 10 with two vidIQ transcripts (10 credits). Ronaldo 5:24 teaser and 16:06 payoff, Circle 0:49 and 37:55 all match. I did not re-view any Most replayed graph.

### 2e. E's numbers

Dubit, five-games arithmetic, top-seven publishers, publisher table (Supersonic 14 games 688M; SayGames 14, 538M; CrazyLabs 9, 351M; Voodoo 18, 302M; Supercent 18, 176M; Famobi 48, 413M; Playgama 182, 559M; Mediacube 244, 226M [DOC https://playables.games/publishers/, 2026-11-05]) all agree with E. Means: 688/14 = 49.1M; 559/182 = 3.07M; 226/244 = 0.93M [CALC]. The publishers page lists only studios with 3 or more games.

### 2f. F's selection-bias arithmetic

Confirmed (claim 24).

### 2g. Handbook claims

See section 6.

### 2h. Playgama claims

Wiki selection and 8 minute claims: confirmed (claim 21). Sandbox gate: not public (claim 22). Rule 1.6.8: exists (claim 31). Caveat: all via WebFetch summaries.

### 2i. BYC first-attempt blocked time

Server: `node tools/serve.js` (package.json "serve"), started and later stopped. Tab: my own, visible, document.hasFocus() true, 1920x945 viewport, DPR 1 [MEASURED: javascript_tool, 2026-11-05 ~14:44-14:58 UTC]. I polled `__byc.game.phase` every 1 to 2 ms after calling `__byc.goToLevel(game, i)`.

First finding: this page's frame rate is unstable on this machine. A blank page in the same tab gave 200 requestAnimationFrame calls in 2 s. The game page gave 4 in 2 s (2 fps), later 14 in 2.5 s (6 fps), later 100 fps. The canvas is 1920x945 and the loop caps catch-up at 8 physics steps per frame [CODE js/constants.js:20 MAX_STEPS_PER_FRAME = 8; js/main.js:208 `if (steps >= MAX_STEPS_PER_FRAME) { acc = 0; break; }`; PHYSICS_HZ = 120 at js/constants.js:17]. At 8 steps of 8.33 ms, one slow frame advances only 66.7 ms of simulation, however long it took.

Runs at a healthy frame rate (about 100 fps, 10 ms per frame; 6 repeats per level):

```
a1-wall  (level 1): live to frozen 291, 285, 294, 290, 290, 292 ms   (CODE freezeAt: 280, js/levels.js:76)
a5-hang  (level 2): live to frozen 661, 652, 661, 661, 653, 642 ms   (CODE freezeAt: 650, js/levels.js:274)
```

Runs while the page was at 5 fps (same tab, foreground, other agents likely using the machine):

```
a1-wall 1037 ms, 1554 ms (5.2 and 4.8 fps)    a5-hang 2623 ms, 3392 ms (5.1 and 8 fps)
earlier, 2 fps run: a1-wall 2145, 2428, 2193 ms; a5-hang not frozen after 2,500 ms
```

So: level 1 blocks drawing for 0.29 s, level 2 for 0.65 s at normal frame rate (matching the code), and the time stretches roughly in inverse proportion to frame rate below about 15 fps. G's 5.0 s is the frame-cap effect at roughly 5 fps, not the design value, and the tab in my runs was foreground (so my brief's "background throttling" guess is not the only cause; a loaded machine does the same). Whether real phones hit low frame rates on this canvas is UNVERIFIED, but it is a real exposure: on a slow device the first level's "live" beat could last seconds with input ignored.

Input during the live phase: a pointerdown at 30 ms after loading level 1 left `phase` as live and no stroke started [MEASURED]. Side bars: after the freeze, a 19-point PointerEvent stroke from (300, 500) to (360, 700), left of the 694 to 1226 paper column G reported, was accepted and `phase` became sim (claim 30).

## 3. Survivorship bias: counter-cases

Games with the top-game look (readable worried face, visible threat, hand-drawn pencil style, per G) ranking low, from the hub CSV and tile images [MEASURED: yt3.ggpht.com thumbnails, 2026-11-05]:

1. Draw Bridge: Puzzle Challenge, rank 721, 297k plays. Tile: a stick rider with a sweat drop and terrified face on a motorbike, a pencil, a blue drawn arc across a gap, a checkered flag. Same genre and name as Draw Bridge: Brain Game (rank 44, 26m): about 88x apart [CALC 26m / 297k].
2. Draw Path to Home, rank 867, 85k plays. Tile: two characters with drawn paths to houses and a snarling spiked-collar dog in between: readable emotion, visible threat, drawn line. Home Rush - Draw to Home is rank 67 (19m): about 220x apart [CALC].
3. Girl Rescue: Dragon Out!, rank 493, 933k (G #54): distressed heroine, skeletal fire dragon, promo art.
4. DOP clones: Draw Puzzle: Complete One Part 247 (4.4m), Draw the Rest 347 (2.2m), Delete it: Erase One Part 893 (57k), against DOP 4 at 23 (41m) and DOP 2 at 28 (35m).
5. Draw To Smash Classic, rank 437 (1.1m): angry egg with a pencil line (G #53).
6. Save the Fish: Story of Dori, rank 617, 510k: big readable faces, vivid colour, a title wordmark (no threat).

Top games without the look: Phone Case DIY (9), Dessert DIY (6), Hole.io (10), Magic Tiles 3 (12), Hide N Seek (11) have no readable face and no real threat (my re-look of 9, 10, 11).

I did not control for age or publisher for these (the tracker has dates for only the top 50), so they show that the look does not guarantee plays, not that it does not help.

MrBeast-style packaging copycat failures: I could not find three credible, data-backed ones. Two web searches (5 Nov 2026) returned opinion pieces and quotes of MrBeast complaining about clones, a Yahoo piece in which experts predict clones will not succeed, and a report that one imitator gained millions of followers; the search summary stated that no source shows a pattern of imitators flopping. The Beast Reacts channel in A is a dormant sister channel, not a copycat. A New York Times reprint (A's source) shows creators growing without his rules, so packaging is not necessary. Verdict: UNPROVEN in both directions, and A's own limit stands. In the game domain the clone cases above are the closest evidence.

## 4. Alternative explanations for rank

Evidence by factor (cumulative plays; hub CSV and tracker CSV, 5 Nov 2026):

- Publisher size. For: 16 of the 23 dated top games are from five publishers that list 73 of about 2,133 games (3.4%) [CALC]; top seven include none from a solo studio [claim 20]; per-title mean plays are 49.1M (Supersonic), 39.0M (CrazyLabs), 38.4M (SayGames), 3.07M (Playgama, 182 games) and 0.93M (MediaCube, 244 games) against a platform mean of 2.69M [DOC playables.games/publishers/; CALC]. Against: Save The Pets (SUN.STUDIO), Find the Alien (Moonee), Skincare Time (Cone Limited), Magic Tiles 3 (Amanotes), Running Pet (Ivymobile) and Mini Relaxing Game (Game District) are in the top 25 from non-highlighted names; SayGames' DOP 4 averages 40.6K per day, below Save The Pets' 138K.
- Age. For: the top 23 median 779 days live; 100M at 138K/day needs about 725 days [CALC]. Against: age does not order the top (Spearman 0.08, range-restricted); the fastest per-day rates are Going Balls (324 d, 315K/day), Snake Clash (450 d, 231K/day), Hole.io (365 d, 205K/day), Build a Queen (534 d, 200K/day). The dated top 23 contains no game younger than 282 days except Mini Relaxing Game.
- Platform featuring. No data. Official docs give no ranking or featuring statement [DOC distribution.md and my claim 20]. The only indirect evidence is shape: Playgama's five launches took 43% to 53% of their first 68 days' plays in week one, then fell 7x to 10x [CALC from E]. That is consistent with a launch exposure window, a publisher push, or ordinary novelty decay, and cannot separate them. Mini Relaxing Game shows 39M plays in 37 days (1.05M/day, 3.3x the next fastest, Going Balls at 315K/day [CALC]) [CALC from tracker]; either the tracker's added date is a re-listing or the game got a very large push; its tile title does not match its lettering (G #24). UNVERIFIED which.
- Design. Evidence is correlation only: clones of DOP and of Home Rush and Draw Bridge rank far lower with near-identical mechanics and looks (section 3), which supports "something other than label and look decides", and the cause could be design, age, publisher or featuring. Dubit's genre ratios (plays share over games share) put Brain & Puzzle at 0.63, Racing at 2.33 [CALC from DOC dubit], so genre alone does not carry rank.
- How much each explains cannot be computed: only 23 rows have dates and publishers, the plays text is rounded to 2 to 3 significant digits, and featuring has no field. Any "x% explained by publisher" would be invented.

## 5. Claims stated more confidently than the evidence allows, with honest rewrites

1. A: thumbnails all have a face (30/30). Rewrite: 29 of his 30 newest long videos show a readable face, with no comparison against channels that do not use faces.
2. C: draw/rescue titles are about 3x over-represented at the top. Rewrite: the family is 2.7x over-represented at the top-50 cut but 1.5x at top 100 to 150, its median plays are 1.65x the hub's, and age and publisher are uncontrolled.
3. C: median 988k and 92 games under 100k. Rewrite: the full hub median is 665.5k with 264 games under 100k (1,124 tiles); C's figures came from a partial first scrape.
4. C: publisher size does not separate the groups. Rewrite: among the few draw games C opened it did not; among the top 23 five publishers hold 16 places.
5. C: cumulative plays mostly encode age. Rewrite: age is needed to reach about 100M plays, but within the top 23 it hardly orders them.
6. G: draw peers have a clear threat 67% of the time vs 15% of the top 40. Rewrite: about 60% vs about 12% on a second reading of a hand-picked set; threat is the least repeatable column and one rater coded all of it.
7. G: BYC blocks drawing for 0.17 s on level 1 and 5.0 s on level 2. Rewrite: 0.29 s and 0.65 s at normal frame rate (code 280 and 650 ms); longer, in proportion, when the game runs at a few frames per second.
8. G: BYC first paint is 0.23-0.38 s vs peers 2.5-51 s. Rewrite: not comparable: a local server without the YouTube shell against shell-hosted games.
9. G: BYC fails Playgama rule 1.6.8 at 16:9. Rewrite: 1.6.8 covers a 1:1 window only; 16:9 falls under 1.6.1 (fill the available area); neither binds the YouTube build.
10. A and B: the packaging and structure devices cause the click and the long session. Rewrite: they are observed in titles, thumbnails and transcripts; click-through and retention are private and were not measured.
11. A: the Haaland/LeBron title change was a live test. Rewrite: the title changed four times in 101.5 hours; whether a test ran is unknown.
12. B: payoff placement at 82-98% is a device. Rewrite: in three contest videos the winner reveal lands near the end, which any contest edit does.
13. E: Save The Pets shows design beat publisher size. Rewrite: one genre-matched game reached 39M in about 282 days; its route and real launch date are unknown.
14. F: repair a defect and make one thing big. Rewrite: among 12 hand-picked winners, 3 fixed an obviously weak thumbnail; no base rate or control exists.
15. E and NEXT: top-decile entry is about 7M plays. Rewrite: about 7M in Dubit's 1,669 games on 23 Sep; about 12M in today's 1,124-tile hub.
16. NEXT: Playgama rule 1.6.8 "fetched 4 Nov" while G says unfetched. Rewrite: the rule text was fetched by me on 5 Nov (summary): 1:1 window, no empty bars.
17. The brief and G: 5.0 s is "background-tab throttling". Rewrite: it reproduces as low frame rate on a foreground tab on this PC; cause of the load is UNVERIFIED.

## 6. Leaked-handbook claims (every one is second-hand)

- A cites Fortune (26 Sep 2024: authenticity checked with ex-staff by Business Insider; MrBeast did not comment) and Dexerto (16 Sep 2024: guide names click-through, average view duration, average view percentage, first minute). Both are mainstream or trade outlets, but A and E read them through search summaries; A says the content came from reporting only. Grade: REPORTED, second-hand, authenticity not confirmed by MrBeast.
- B's handbook items rest on search snippets of netinfluencer.com, cybernews.com (HTTP 403) and vidpros.com. These are not mainstream outlets and B read no full page. Grade: second-hand, snippet only. The re-engagement at about minutes 3 and 6 and the retention thresholds should be treated as UNVERIFIED.
- The 35%-vs-20% retention quote (Cutback blog) B already marked UNPROVEN; it stays so.
- I opened no leaked file or mirror and did not re-fetch any of these pages.

## 7. Ranked list of the 12 strongest SURVIVING findings

Grades: A = measured by me or recomputed from data with the arithmetic shown; B = documented by a primary or named source I fetched; C = consistent but second-hand, correlational or vendor.

1. Plays are heavily concentrated: in the hub the top 10 games hold 18.2% of plays and the top 112 (10%) hold 67.3% [CALC hub CSV]; Dubit found 17.9% and 76.6% in 1,669 games on 23 Sep [DOC]. Grade A/B.
2. A draw/rescue/escape/save title does not predict plays: 54 matching titles spread from rank 23 to 1,067, median 1.1m vs 665.5k, 24 below the hub median, and Save/Rescue titles span 11k to 39m. Grade A.
3. Near-identical clones of the top draw games rank 9x to 700x lower (Draw Path to Home 85k, Draw Bridge: Puzzle Challenge 297k, Delete it 57k vs 19m, 26m, 35m to 41m). Grade A for the plays, C for cause.
4. Route to market is visible at the top: 6 of the top 7 are from publishers YouTube itself named; 16 of 23 dated top games come from five publishers holding about 3.4% of titles. Grade A/B (publisher labels are the tracker's).
5. Cumulative plays cannot be read as quality: the top games are 282 to 1,031 days old (except one), and early-week concentration is large for new launches (43-53% in week one, then 7-10x decay). Grade A (CALC).
6. Playgama's public pages do not publish the sandbox gate; they publish the 8-minute average playtime target and curated selection for YouTube. Grade B.
7. Hub display is rounded to 2 to 3 significant digits (333 games at 100K steps, 142 at 1M steps), so short-interval velocity is unreadable for 475 games. Grade A.
8. Hub tile geometry is fixed 194x272 (5:7) for all 1,124 tiles; 91% of images are 0.71. Grade A.
9. MrBeast titles in the newest 30 long videos: 25 with a number, 17 with a dollar amount, mean 7 words. Grade A (descriptive of one channel).
10. MrBeast long videos state stake and rule inside about 16 s and show a first consequence by about 0:49 (Circle) or about 0:20 (Squid per B); Ronaldo's 5:24 teaser is paid off at 16:06. Grade A for the transcripts checked, C for any effect on watch time.
11. BYC's drawing is blocked for 0.29 s (level 1) and 0.65 s (level 2) at normal frame rate; stroke input outside the paper column is accepted; at about 5 fps the block stretches to seconds. Grade A.
12. Playgama requires a 1:1 window to be filled with no empty bars (1.6.8) and any size to fill the available area (1.6.1); YouTube's own page, per G's summary, allows centred padding. Grade B (WebFetch summaries).

## 8. Findings that did NOT survive (or need rewriting)

- C's median 988k and 92 below 100k (refuted by the full snapshot).
- The 3x over-representation as a general statement (window- and regex-dependent; about 1.5x beyond the top 50).
- C's "publisher size does not separate" (true for 3 to 5 draw games, false for the top table).
- "Rank mostly encodes age" (age barely orders the top).
- G's blocked times 0.17 s and 5.0 s.
- G's 67% draw-peer threat rate as stated (about 60% on re-read, single rater).
- The idea that a readable face plus a visible threat is what works on a tile: counter-cases at ranks 493, 721, 867.
- A's live-title-test inference (UNVERIFIED).
- The click and session-length attribution for any MrBeast device (B's D1-D16 [C/S] tags): unmeasurable from public data.
- F's repair-a-defect pattern as guidance (no base rate).
- Any statement that MrBeast-style packaging copycats fail (no credible data found) or succeed.
- BYC-versus-peer load comparison (different conditions) and G's peer load times (machine load unknown).
- The owner's repo claim that the sandbox gate is 100 plays at 5 minutes (not in public docs; UNVERIFIED).

## 9. Limits of this red team

- Rank 1 to 55 tile re-look used 12 tiles and one rater (me); the 15 draw peers in G's table were never an unbiased sample.
- WebFetch gave summaries; the Playgama rules and Dubit page were read that way.
- I did not re-view any Most replayed graph, the shell overlay timings, the Playgama launch article, A's channel counts, or YouTube's design-page wording on logos.
- The BYC timing machine was loaded by other work at times; I report both the healthy-fps and low-fps results.
- Tracker data (agent H) cover 50 rows with dates and publishers for 23 and an unconfirmed meaning of added date; I used them only for publisher attribution and rough per-day rates.
- I did not call get_sandbox_state (read-only Playgama console call that would show the real gate); that stays the owner's call.

## 10. Sources (fetched 2026-11-05 unless noted)

- https://wiki.playgama.com/playgama/game-requirements/platform-specific-requirements.md (summary)
- https://wiki.playgama.com/playgama/game-requirements/technical-requirements.md (summary; rules 1.6.1 and 1.6.8)
- https://wiki.playgama.com/playgama/game-requirements.md (index only)
- https://wiki.playgama.com/playgama/mcp/tools.md (summary, both halves)
- https://dubit.io/library/how-many-plays-does-a-youtube-playables-game-get (dated 23 Sep 2026)
- https://mobilegamer.biz/youtube-has-quietly-rolled-out-playables-across-europe/ (24 Sep 2026)
- https://playables.games/publishers/ ; /games/thief-puzzle/ ; /games/save-the-pets/ ; /games/draw-crash-race/ (data as of 4 Nov 2026)
- https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json for the 30 MrBeast ids in mrbeast-case-study.md
- https://i.ytimg.com/vi/<id>/mqdefault.jpg for 10 thumbnails
- yt3.ggpht.com tile images listed in the hub CSV (12 census tiles, 3 counter-case tiles)
- vidIQ video transcripts for 0BjlBnfHcHM and zajUgQLviwk (10 credits)
- Two WebSearch queries on Playgama's sandbox targets and on MrBeast copycats; one on copycat thumbnail effects (search summaries only)
- docs/research/data/hub-snapshot-20261105-0701Z.csv, tracker-20261105-0742Z.csv, tracker-method.md (agent H, read only)
- Repo files: js/game.js:80-96, js/constants.js:17-20, js/main.js:205-213, js/levels.js:67-76 and 270-274, package.json:20
