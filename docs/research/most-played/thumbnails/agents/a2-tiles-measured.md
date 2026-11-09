# A2: what winning tiles look like, measured (YouTube hub and Playgama), with BYC's covers beside them, 9 Nov 2026

Helper A2. Data: `THUMBS/data/tile-features-20261109.csv` (1,124 hub tiles from the 5 Nov snapshot plus 338 Playgama list entries, plus 13 extra draw-game covers I downloaded to `THUMBS/work/a2/`, appended with list names ending `_extra_downloaded_a2`). Features come from `THUMBS/scripts/features.py` run with the venv Python and `-I`. Legend: sat = mean HSV saturation, sat_hi = share of pixels with saturation above 0.6 and brightness above 0.5, contrast = luminance standard deviation, edge = mean luminance gradient (edge density), paper = share of near-white, near-grey pixels (the pale-paper share), val = mean brightness. All features are computed on the image shrunk to 256 px, so they are properties of the served tile, not of the original art.

## Findings (10 lines)

1. [MEASURED: features.py over 1,124 hub tiles, Spearman via numpy, 9 Nov 2026] No visual feature tracks hub plays strongly. The largest rank correlations are edge density (rho -0.23: busier tiles have slightly FEWER plays) and contrast (-0.16). Saturation is -0.10, share of strongly saturated pixels -0.03, pale-paper share +0.01. Each feature explains under 6% of the rank variance at best.
2. [MEASURED: same] The top 100 by plays are brighter, flatter and calmer than the tail, not louder: median saturation 0.51 (ranks 101-400: 0.55, rank 401 and below: 0.60), median edge density 0.029 (0.039, 0.044), median brightness 0.81 (0.76, 0.74).
3. [MEASURED: same, Playgama landscape tiles] On Playgama the pattern between "top" and "the rest" is almost absent. Medians for top_playgama, trending top 50 and trending ranks 51 to 90 are within 0.03 of each other on saturation and 0.002 on contrast; only edge density is lower for top_playgama (0.043 against 0.050 and 0.052).
4. [MEASURED: BYC crops vs tiles] BYC's pop-set cover is mid-pack on colour (saturation 0.55 to 0.65, 52nd to 69th percentile) but is flatter than almost every tile: edge density 0.013 to 0.016 is at the 0th percentile of Playgama landscape tiles and the 2nd to 9th percentile of hub tiles; landscape contrast is at the 4th to 7th percentile.
5. [MEASURED: same] The paper set (the earlier catch-paper covers) is the palest thing in either sample: 79 to 83% of its pixels are pale paper against a median of 3% (Playgama) and 4 to 5% (hub); saturation 0.08 to 0.11 sits at the 0th to 3rd percentile. It is paler than 99% or more of the tiles on both platforms, though 16 hub tiles (4 of them in the top 30) and 5 Playgama tiles are nearly as pale (section 6).
6. [MEASURED: 120 hand-coded tiles, my reading of each image] Baked-in lettering is on 39 of 60 hub tiles and 38 of 60 Playgama tiles; in 35 of 39 and 36 of 38 it is the game's own name, and it is usually large (dominant: 23 of 39 hub, 27 of 38 Playgama). Neither platform's winners are lettering-free, but the lettering is the title, not slogans.
7. [MEASURED: same] A moment of action or change (a swing, a splash, a hand mid-gesture, a before/after pair) is visible on 37 of 60 hub tiles and 33 of 60 Playgama tiles, and on 13 of the 14 hub tiles in ranks 41 to 100 that I coded. A face is shown on 30 of 60 and 29 of 60.
8. [MEASURED: same] The draw, rescue and pin-pull tiles on Playgama (18 coded) look unlike the rest: 17 of 18 show a face (12 of the other 42), 12 of 18 are 2D illustration (9 of 42), 12 of 18 have a visible or implied threat (12 of the other 42), and their median saturation is 0.39 against 0.60 for all landscape tiles; their pale-paper share is 0.09 against 0.03. [CALC over my own table]
9. [INFERRED] BYC's pop cover has the right subject structure (one worried face, one threat, one line, no lettering) but is under-detailed and has no lettering while 65% of both platforms' tiles carry the game name. The paper set should not be used as a store tile on either platform.
10. [UNPROVEN] None of this shows what makes a player click. Plays and rank are shaped by publisher, time on platform, distribution and personalised ordering; this is a description of what winning tiles look like.

## 1. Data and what was and was not measured

- [MEASURED: `ls`, 9 Nov 2026] `img-youtube/` reached 1,124 of 1,124 files. `img-playgama/` has 254 files, which is every slug the downloader's targets (62 top_playgama, first 90 trending_now, first 90 puzzle, first 45 new) resolve to. Not all 270 entries per list were downloaded, so "the rest of trending" below means trending ranks 51 to 90, not all 270.
- [MEASURED: aspect ratios in the CSV] YouTube: 1,122 portrait files and 2 squares (Find the Alien, Mechangelion). Playgama: all 338 list entries in the downloaded set are landscape (448 px wide). No portrait or square Playgama tiles were in the downloaded set, so the requested separation by shape could not be done on Playgama; the square (218x218) and vertical (500x820) formats exist on the site per the brief but were not sampled.
- Rank definition. Hub "rank" is the rank by `plays_int` (descending) over the snapshot, not the snapshot's `dom_rank` (which is page order, personalised). Plays are rounded text ("95m"), so many tiles tie; ties were broken by CSV order, which adds noise to rho of at most a few hundredths. Playgama `rank` is the order within that list on 6 Nov 2026; Playgama gives no play counts.
- A rule of thumb for reading rho at n = 1,124: |rho| below about 0.06 is indistinguishable from nothing; rho of 0.23 means the two rankings share about 5% of their variance.
- Playgama draw/puzzle titles beyond rank 90 were not in the downloaded set. I fetched 13 of them (one request per second, plain research User-Agent) to `THUMBS/work/a2/` so the draw-game look could be studied; they are in the CSV with list suffix `_extra_downloaded_a2`.

## 2. YouTube hub: top 100 against ranks 101 to 400 against the rest (portrait, n = 1,124)

[MEASURED: features.py, numpy percentiles, 9 Nov 2026] median [lower quartile to upper quartile].

| Feature | Top 100 (n=100) | Ranks 101-400 (n=300) | Rank 401+ (n=724) | Spearman rho vs plays (all 1,124) | rho within top 400 |
|---|---|---|---|---|---|
| saturation | 0.513 [0.342-0.670] | 0.554 [0.426-0.647] | 0.602 [0.470-0.717] | -0.097 | -0.117 |
| brightness | 0.810 [0.660-0.895] | 0.756 [0.645-0.837] | 0.742 [0.598-0.843] | +0.043 | +0.142 |
| strongly saturated share | 0.291 [0.114-0.582] | 0.343 [0.160-0.518] | 0.367 [0.197-0.545] | -0.034 | -0.101 |
| contrast | 0.200 [0.174-0.231] | 0.218 [0.192-0.247] | 0.231 [0.197-0.255] | -0.155 | -0.177 |
| edge density | 0.029 [0.023-0.039] | 0.039 [0.029-0.051] | 0.044 [0.033-0.055] | -0.231 | -0.280 |
| pale-paper share | 0.050 [0.022-0.148] | 0.040 [0.014-0.101] | 0.042 [0.016-0.090] | +0.006 | +0.087 |
| centre vs border difference | 0.358 [0.223-0.495] | 0.350 [0.248-0.529] | 0.363 [0.225-0.563] | -0.023 | -0.077 |

What this says, in plain words [MEASURED, then INFERRED where marked]:
- The only feature with a visible relationship is edge density, and its sign is the opposite of "busy tiles win": top-100 tiles carry about two thirds of the edge density of the tail. Brightness leans the other way (+0.14 inside the top 400). Both are weak.
- Saturation, strongly saturated share, pale-paper share and centre-vs-border difference do not track plays at all (|rho| under 0.12). The old claim in the census that BYC must be "more saturated than almost every tile" is not supported as a plays predictor: [INFERRED] hub winners are not distinguished by being louder.
- Confounds, all of which apply: publisher size and existing audience (a studio with a catalogue cross-promotes), time on the platform (older games had more weeks to accumulate plays; the hub shows cumulative plays), distribution (some games are featured on the hub shelves, which feeds plays), and the personalised ordering of the page. A tile may also have been redrawn after launch, so today's art is not the art that earned the early plays. None of this lets us say a feature causes plays.

## 3. Playgama landscape tiles (448x252)

[MEASURED: features.py, 9 Nov 2026] median [quartiles]. n is tiles with an image in the downloaded set; the same game can sit in two lists.

| Feature | top_playgama (62) | trending top 50 (50) | trending 51-90 (40) | puzzle list 1-90 (92) | new list (55) |
|---|---|---|---|---|---|
| saturation | 0.581 [0.467-0.679] | 0.579 [0.430-0.716] | 0.613 [0.522-0.691] | 0.582 [0.456-0.685] | 0.596 [0.405-0.692] |
| brightness | 0.680 [0.600-0.766] | 0.723 [0.600-0.801] | 0.742 [0.556-0.833] | 0.734 [0.536-0.826] | 0.762 [0.569-0.833] |
| strongly saturated share | 0.380 [0.190-0.551] | 0.397 [0.172-0.553] | 0.396 [0.223-0.574] | 0.279 [0.083-0.539] | 0.318 [0.125-0.487] |
| contrast | 0.219 [0.194-0.244] | 0.220 [0.199-0.248] | 0.221 [0.208-0.241] | 0.221 [0.194-0.255] | 0.221 [0.196-0.239] |
| edge density | 0.043 [0.037-0.052] | 0.050 [0.042-0.058] | 0.052 [0.045-0.061] | 0.047 [0.034-0.060] | 0.051 [0.042-0.062] |
| pale-paper share | 0.023 [0.007-0.054] | 0.029 [0.010-0.069] | 0.030 [0.015-0.055] | 0.030 [0.009-0.102] | 0.024 [0.013-0.082] |

Rank correlations inside a list (negative rank, so + means higher feature at better rank): trending_now n=129: saturation -0.14, edge +0.19, centre-vs-border -0.21; top_playgama n=62: edge +0.16, pale-paper +0.20, centre-vs-border +0.25; puzzle n=92: edge +0.19, everything else under 0.13. [MEASURED] None is large; signs flip between lists (edge is positive here, negative on the hub), so I treat them as noise.

Puzzle tiles against all other tiles (254 unique landscape tiles; 92 in the puzzle list): saturation 0.58 vs 0.60, strongly saturated share 0.28 vs 0.37, contrast 0.22 vs 0.22, edge 0.047 vs 0.049, pale-paper share 0.030 vs 0.025. [MEASURED] Puzzle covers are a little less loud (lower strongly saturated share) than other categories; otherwise indistinguishable.

Confounds on Playgama: list order is a mix of plays and Playgama's own promotion (hot and top badges), "top" is not defined publicly, rank within the list is from one crawl on 6 Nov, and I have no play counts. This sample cannot say whether any feature earns clicks.

## 4. Where BYC's covers sit

[MEASURED: each cover resized and centre-cropped to the real tile shape (landscape 448x252, portrait 366x512; the square cover cropped to its middle 71% and resized to 366x512 for the hub, and also resized to 218x218 for Playgama's square tile), then run through features.py; percentile = share of tiles below the BYC value.]

Pop set (`docs/launch/covers/byc-cover-*.png`):

| Cover as shown | sat | strong-sat share | contrast | edge | pale-paper | Percentiles vs comparison set (sat / strong-sat / contrast / edge / paper) |
|---|---|---|---|---|---|---|
| landscape 448x252 | 0.602 | 0.529 | 0.166 | 0.013 | 0.000 | vs Playgama top and trending-top-50 landscape: 57 / 71 / 4 / 0 / 0. vs all Playgama landscape: 52 / 73 / 7 / 0 / 0 |
| portrait 366x512 | 0.549 | 0.462 | 0.198 | 0.016 | 0.000 | vs hub top 100: 58 / 69 / 47 / 9 / 0. vs hub rank 101+: 41 / 66 / 27 / 2 / 0 |
| square, middle 71% (hub crop) | 0.602 | 0.613 | 0.199 | 0.016 | 0.000 | vs hub top 100: 65 / 80 / 47 / 9 / 0. vs rank 101+: 54 / 84 / 28 / 2 / 0 |
| square 218x218 | 0.646 | 0.702 | 0.174 | 0.015 | 0.000 | vs hub top 100: 69 / 87 / 26 / 9 / 0. vs rank 101+: 65 / 90 / 12 / 2 / 0 |

Paper set (`docs/launch/covers/alt/*-catch-paper.png`):

| Cover as shown | sat | strong-sat share | contrast | edge | pale-paper | Percentiles (sat / strong-sat / contrast / edge / paper) |
|---|---|---|---|---|---|---|
| landscape | 0.104 | 0.087 | 0.208 | 0.023 | 0.824 | vs Playgama top: 1 / 12 / 36 / 0 / 100. vs all Playgama: 2 / 18 / 35 / 4 / 99 |
| portrait | 0.075 | 0.042 | 0.165 | 0.037 | 0.812 | vs hub top 100: 0 / 8 / 20 / 70 / 99. vs rank 101+: 1 / 6 / 8 / 36 / 100 |
| square, middle 71% | 0.111 | 0.092 | 0.214 | 0.026 | 0.792 | vs hub top 100: 3 / 23 / 64 / 35 / 99. vs rank 101+: 2 / 12 / 38 / 14 / 99 |
| square 218x218 | 0.091 | 0.065 | 0.193 | 0.029 | 0.826 | vs hub top 100: 0 / 14 / 44 / 51 / 100. vs rank 101+: 1 / 9 / 23 / 20 / 100 |

I looked at the landscape pop crop, the landscape paper crop and the portrait pop crop. Pop: a sky-blue graph-paper background, a red boulder with a short dash for a face, a thick blue line under it, and a yellow Milo with an open shouting mouth at the bottom (the landscape crop cuts his body at the bottom edge). No lettering. Paper: the same subjects on near-white graph paper with a hatched ground line.

In words [MEASURED numbers, INFERRED reading]:
- The paper set is paler than 99% or more of the tiles on both platforms and less saturated than 97 to 100% of them. On the pale-paper measure only a handful of draw-game covers (see section 6) and a few puzzle covers come near it. [MEASURED]
- The pop set's colour is ordinary: saturation and strongly saturated share are in the middle to upper-middle of both platforms, so "more saturated" is not what it lacks. What it lacks is detail. Edge density is lower than 91% of top-100 hub tiles and lower than all 338 Playgama tiles, and on landscape its contrast is lower than 93 to 96% of Playgama tiles. [MEASURED] In pictures, that is: a large flat blue field with three drawn objects and no secondary shapes, textures, lettering or scenery. [INFERRED] That can read as clean or as empty; the numbers do not say which, but they say it is a rare look. Note the top-100 hub tiles are themselves flatter than the tail (finding 2), so flat is not by itself a fault.

## 5. Hand-coded sample: 120 tiles, rubric from the earlier census

Rubric reused from `tile-census.md`: subject, expression (a face shown, with emotion where readable), subjects count, dominant colours, lettering words (baked in, game name included; tiny UI numbers excluded), threat (Y = visible and readable, W = weak or implied, N = none), type (R = 3D or render-style, I = 2D illustration, S = flat UI or gameplay screenshot; P = a real photograph). Added columns: size of lettering relative to the tile (0 = none, S small, M medium, D dominant), Name (does the lettering say the game's name: Y, N, - for no lettering), Moment (Y if the tile shows a before or after pair or an action caught in progress, N for a static pose or a pure logo). All 120 were looked at on contact sheets of 20 tiles each, in this session; every code is my reading of an image and a second rater could differ, especially on W against N, R against I, and Moment.

Sampling. Hub 60: none of the old census's 55 titles are repeated; 14 from ranks 41 to 100, 24 from ranks 101 to 400, 22 from rank 401 down, spread evenly with a forced inclusion of draw, puzzle, rescue and escape titles (Brain Up, Brain Out, Hamster Escape, Help Me, Brain Bamboozle, ASMR Drawing game, Draw the Rest, Draw Crash Race, How To Loot, Draw the Path, Belt It, Escape from School, Sword Draw, Knot Off, Goat Escape, Save the Fish, Save The Guy, Draw Wheels, Draw The Road). The census already covered ranks 1 to 40, so this sample has no top-40 tile. Playgama 60: 18 draw, rescue, pin-pull and "save" games (including 13 not in the downloaded set), then 14 from top_playgama, 14 from trending top 50, 7 from trending 51 to 90, 7 from puzzle; all are landscape. The sample is neither random nor representative: the draw titles were chosen on purpose.

Table (Y = hub tile, P = Playgama tile; "hub rank" is rank by plays of 1,124; "list rank" is position in that list on 6 Nov).

**Hub tiles (60)**

| # | Tile (list, rank) | Subject | Face | Subj | Colours | Words | Size | Name? | Threat | Type | Moment |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Y1 | Epic Sword Battle! Fight in the Ragdoll Arena! (hub rank 41, 27m) | Two stick ragdolls crossing swords | - | 2 | red, yellow on blue | 0 | 0 | - | Y | R | Y |
| Y2 | Slice It All! (hub rank 46, 26m) | Smiley ball, knife icon, fence | smile | 2 | green, white, blue | 3 | D | Y | W | R | Y |
| Y3 | Color Match (hub rank 51, 24m) | Pig face, hand holding pink card | neutral | 1 | cyan, pink | 0 | 0 | - | N | R | Y |
| Y4 | Words of Wonders (hub rank 55, 23m) | Letter circles over mountains | - | 0 | blue, white | 3 | D | Y | N | S | N |
| Y5 | Clean It: Restaurant Cleanup (hub rank 59, 22m) | Delivery worker running with vacuum | smile | 1 | blue, purple, red | 2 | D | Y | N | R | Y |
| Y6 | Om Nom Run (hub rank 63, 21m) | Two green monsters running at barrier | mixed | 2 | green, blue | 3 | D | Y | W | R | Y |
| Y7 | Bazooka Boy (hub rank 68, 19m) | Blue stick figure aims at 3 red soldiers | - | 4 | sand, red, blue | 0 | 0 | - | Y | R | Y |
| Y8 | Stacky Dash (hub rank 72, 18m) | Blue figure on disc stack, pink path | - | 1 | yellow, magenta, blue | 0 | 0 | - | N | R | Y |
| Y9 | Shape Transforming: Shifting Run (hub rank 76, 17m) | Cars and boat on a road | - | 3 | blue, grey | 4 | D | Y | N | R | Y |
| Y10 | Knock'em All (hub rank 80, 17m) | Red ragdoll on blue ball hitting crates | - | 1 | blue, orange, red | 3 | D | Y | W | R | Y |
| Y11 | Downhill Racer (hub rank 84, 16m) | Rider on rocket skateboard | masked | 1 | grey, yellow, blue | 2 | D | Y | W | R | Y |
| Y12 | Stack Bounce (hub rank 88, 16m) | Ball above tower of bursting blocks | - | 0 | blue, orange, white | 2 | M | Y | N | R | Y |
| Y13 | The Egg Stealing Master (hub rank 92, 15m) | Blocky boy carrying egg, chicken chasing | neutral | 2 | green, blue, red | 0 | 0 | - | W | R | Y |
| Y14 | Wood Nuts & Bolts (hub rank 96, 15m) | Wooden bolt board, tapping finger, ad copy | - | 0 | brown, blue | 12 | M | N | N | S | Y |
| Y15 | Pick Me Up 3D: Taxi Game (hub rank 101, 14m) | Yellow taxi in city | - | 0 | blue, yellow | 4 | D | Y | N | R | N |
| Y16 | Brain Up: Tricky Quiz (hub rank 107, 13m) | Couple on a bed, rock-paper-scissors hands | neutral | 2 | pink, blue | 3 | M | N | N | I | Y |
| Y17 | Crazy Kick! (hub rank 128, 11m) | Red players, goal, ball | - | 8 | green, blue, red | 6 | M | Y | N | R | Y |
| Y18 | Helix Jump (hub rank 152, 8m) | Red ball above helix tower | - | 0 | red, white, orange | 2 | M | Y | W | R | N |
| Y19 | Brain Out (hub rank 176, 7m) | Three professor cartoon faces, logo | smile | 3 | blue, orange | 2 | M | Y | N | I | N |
| Y20 | Playground Man Ragdoll Show (hub rank 177, 7m) | Orange ragdoll mannequin flailing | - | 1 | orange, white | 0 | 0 | - | N | R | N |
| Y21 | Snowball Race 3D: Ice Bridge (hub rank 196, 6m) | Red leader pushing snowball, rivals | - | 3 | blue, orange | 0 | 0 | - | N | R | Y |
| Y22 | Donut Place (hub rank 202, 6m) | Donut tower, cash, worker | smile | 1 | orange, blue | 0 | 0 | - | N | R | Y |
| Y23 | Go Escape! (hub rank 221, 5m) | Line-drawn ball, circle, spikes, pink slope | - | 0 | pink, white, black | 2 | S | Y | W | S | N |
| Y24 | Jump in Rhythm to the Hit! Cat Disco! (hub rank 227, 5m) | Cat face on rhythm tiles | happy | 1 | purple, white | 0 | 0 | - | N | R | N |
| Y25 | Hamster Escape (hub rank 230, 5m) | Maze board with pipes, crying hamster | crying | 2 | purple, green, red | 1 | S | N | W | R | N |
| Y26 | Help Me: Tricky Story of Puzzles (hub rank 240, 4m) | Boy and man, pink and blue arms to burger and dumbbell | neutral | 2 | white, pink, blue | 0 | 0 | - | N | I | Y |
| Y27 | Brain Bamboozle (hub rank 241, 4m) | Bathroom scene, caption strip, prisoners | neutral | 7 | blue, white, orange | 8 | S | N | Y | I | N |
| Y28 | ASMR Drawing game (hub rank 242, 4m) | Blueberries, marker, caption | - | 0 | blue, yellow | 5 | D | Y | N | I | Y |
| Y29 | Airplane Manager (hub rank 255, 4m) | Pilot boy with luggage cart | smile | 1 | blue, red | 2 | M | Y | N | R | N |
| Y30 | Cross-Stitch Masters (hub rank 278, 3m) | Pixel husky face being stitched | calm | 1 | grey, brown | 0 | 0 | - | N | I | Y |
| Y31 | Gin Rummy (hub rank 302, 3m) | Man in turban holding cards | smile | 1 | purple, orange | 2 | M | Y | N | I | N |
| Y32 | Trash Master (hub rank 327, 2m) | Garbage truck and worker | smile | 1 | green, blue | 2 | D | Y | N | R | N |
| Y33 | Obby: Survive Lava for Brainrots! (hub rank 345, 2m) | Character on yellow road toward portal, lava | - | 1 | yellow, purple, blue | 0 | 0 | - | W | R | Y |
| Y34 | Draw the Rest (hub rank 347, 2m) | Five unfinished items, pencil | cute cat | 5 | cream, orange, pink | 3 | D | Y | N | I | Y |
| Y35 | Draw Crash Race (hub rank 348, 2m) | Orange scribble car with rider | - | 1 | blue, orange | 3 | D | Y | W | R | N |
| Y36 | FRAG Pro Shooter Lite (hub rank 353, 2m) | First-person gun, logo | - | 0 | green, white | 3 | D | Y | Y | R | N |
| Y37 | How To Loot - Pin Pull (hub rank 373, 1m) | Knight, pin to pull, coins, lava | determined | 1 | gold, orange | 0 | 0 | - | Y | I | Y |
| Y38 | Destructive Car Crash Simulator (hub rank 377, 1m) | Crashed cars and crane | - | 3 | orange, grey | 4 | D | Y | Y | R | Y |
| Y39 | Railroad Master (hub rank 401, 1m) | Conductor with ticket and crate | smile | 1 | blue, yellow | 0 | 0 | - | N | R | N |
| Y40 | Draw the Path (hub rank 410, 1m) | Hand draws line from red car to flag, graph paper | - | 1 | white, red, orange | 3 | M | Y | W | I | Y |
| Y41 | Belt It: Tangled Rope Puzzle (hub rank 417, 1m) | Scared woman in car, crossing belts, finger | scared | 1 | green, red | 2 | D | Y | Y | R | Y |
| Y42 | Escape from School (hub rank 418, 1m) | Boy shushing, angry teacher | shush, angry | 2 | yellow, red, green | 0 | 0 | - | Y | I | Y |
| Y43 | 3D Block Gladiator: Sword Draw (hub rank 440, 1m) | Blocky fighter, axes | smile | 1 | blue, white | 5 | M | Y | Y | R | Y |
| Y44 | Crystal Canvas (hub rank 465, 1m) | Pixel portrait of a girl | - | 1 | blue, yellow | 0 | 0 | - | N | S | N |
| Y45 | Knot Off: Rope Puzzle (hub rank 495, 927k) | Coloured ropes ring, mode badges | - | 0 | multi | 8 | M | Y | N | S | N |
| Y46 | 2048 Drop Balls (hub rank 525, 761k) | Number balls in a board | - | 0 | orange, purple | 0 | 0 | - | N | S | N |
| Y47 | Goat Escape (hub rank 577, 630k) | Chef chasing goats on a skateboard | angry | 3 | blue, brown | 2 | M | Y | Y | R | Y |
| Y48 | Logging Truck Simulator 3D (hub rank 584, 592k) | Log truck in snow | - | 0 | orange, blue | 4 | D | Y | N | R | N |
| Y49 | Save the Fish: Story of Dori (hub rank 617, 510k) | Fish and pink friend, splash | smile | 2 | blue, pink | 5 | D | Y | N | R | Y |
| Y50 | Figure Skating: On Ice (hub rank 644, 436k) | Skater mid-pose | neutral | 1 | pink on blue | 0 | 0 | - | N | R | Y |
| Y51 | Save The Guy (hub rank 663, 401k) | Burning stickman hanging between cliffs, water goal | worried | 1 | yellow, orange, green, blue | 3 | D | Y | Y | I | Y |
| Y52 | Bridge Builder (hub rank 677, 378k) | Golden Gate bridge with truck | - | 0 | blue, orange | 2 | M | Y | N | R | N |
| Y53 | Draw Wheels (hub rank 678, 377k) | Truck with star wheels, hand drawing | - | 1 | orange, blue | 2 | D | Y | N | R | Y |
| Y54 | Draw The Road (hub rank 706, 333k) | Biker, dashed drawn road, pencil, flag | - | 1 | blue, brown, red | 3 | D | Y | W | I | Y |
| Y55 | Secrets of Charmland (hub rank 766, 229k) | Coin cascade over match board | - | 0 | gold, purple | 0 | 0 | - | N | R | Y |
| Y56 | Magic Castle Invasion: Idle RPG (hub rank 825, 143k) | Anime sorceress with staff | fierce | 1 | pink, green | 0 | 0 | - | N | I | Y |
| Y57 | Letter Crossword (hub rank 883, 67k) | Crossword grid with label | - | 0 | white, grey | 2 | D | Y | N | S | N |
| Y58 | Halloween Nightmare Park Tycoon (hub rank 942, 25k) | Pumpkin showman, park | smile | 1 | orange, purple | 3 | D | Y | W | R | N |
| Y59 | Scrub Tycoon (hub rank 1000, 11k) | Raccoon scrubbing | happy | 1 | blue, purple | 2 | D | Y | N | R | Y |
| Y60 | Bubble Pop: Relaxing Anti Stress Toys ASMR Game (hub rank 1058, 3k) | Shelves of pop-it toys | - | 0 | rainbow | 0 | 0 | - | N | R | N |

**Playgama tiles (60)**

| # | Tile (list, rank) | Subject | Face | Subj | Colours | Words | Size | Name? | Threat | Type | Moment |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | Save The Pets: Draw to Save (puzzle 83) | Shiba in drawn dome, bees outside | worried | 6 | green, yellow, blue | 0 | 0 | - | Y | I | Y |
| P2 | Draw Animals (new 1) | Sketchbook fox being coloured | cute | 1 | pink, orange | 0 | 0 | - | N | I | Y |
| P3 | Home Pin (trending_now 65) | Mother with baby, pin pulled, thief | worried | 4 | brown, yellow | 2 | M | Y | Y | I | Y |
| P4 | Hook A Brainrot (trending_now 37) | Red blocky creature chained, boy pulling | smirk | 2 | red, green, yellow | 0 | 0 | - | W | R | Y |
| P5 | Egg Thief (trending_now 53) | Angry chicken, boy with egg | angry | 2 | blue, white | 2 | D | Y | W | R | Y |
| P6 | Draw Crash Race (trending_now 180) | Orange scribble car, rider | - | 1 | blue, orange | 3 | D | Y | W | R | N |
| P7 | Draw or Delete LoveStory (puzzle 106) | Before/after wedding panels | happy, panic | 4 | pink, blue | 0 | 0 | - | W | I | Y |
| P8 | DOP2: Draw Love (puzzle 160) | Cupid drawing, bride | neutral | 2 | white, red | 3 | D | Y | N | I | Y |
| P9 | Save Nemo (puzzle 172) | Shark open jaws, terrified fish | terror | 2 | blue, orange | 2 | D | Y | Y | R | Y |
| P10 | Save The Sheep Master (puzzle 216) | Sheep with pins, wheat | worried | 1 | brown, cream | 0 | 0 | - | W | I | N |
| P11 | Dop Stickman - Jailbreak (puzzle 218) | Prisoner in cell, pencil, tally marks | neutral | 1 | grey, yellow | 0 | 0 | - | W | I | Y |
| P12 | Happy Glass - Draw to Fill (puzzle 243) | Glass, pencil, water, logo | happy | 1 | white, blue, yellow | 5 | D | Y | N | I | Y |
| P13 | Draw path to home (puzzle 261) | Angry dog, two creatures, lines to houses | angry, scared | 3 | cream, yellow, blue | 0 | 0 | - | Y | I | Y |
| P14 | DOP Noob: Draw to Save (puzzle 265) | Noob vs Pro split, pencils, cart | smile | 2 | blue, red | 3 | D | N | N | I | Y |
| P15 | Mojicon Meadow Rescue (new 66) | Bunny, barn, tiles, logo | calm | 1 | green, blue | 3 | D | Y | N | R | N |
| P16 | Kitty Path: Draw to Save Cat (new 73) | Cat on drawn curve, hive, finger, logo | cute | 1 | green, orange | 8 | D | Y | W | R | Y |
| P17 | Save the Pets (new 110) | Dog in drawn dome, bees, hive, logo | worried | 1 | cream, orange | 3 | D | Y | Y | I | Y |
| P18 | Tricky Brain Master: IQ Puzzle (puzzle 220) | Three story panels, logo | neutral | 6 | blue, brown | 3 | M | Y | N | I | N |
| P19 | Piece of Cake: Merge & Bake (top_playgama 1) | Squeegee on pink frosting | - | 0 | pink | 0 | 0 | - | N | R | Y |
| P20 | Good Sort Master: Triple Match (top_playgama 5) | Shelves of bottles, finger | - | 0 | brown | 0 | 0 | - | N | R | Y |
| P21 | My Town Home: Family Playhouse (top_playgama 9) | House, family | smile | 6 | yellow, green | 0 | 0 | - | N | I | N |
| P22 | Bubble Blast (top_playgama 13) | Bubble grid, logo | - | 0 | multi | 2 | D | Y | N | R | N |
| P23 | Age of Tanks Warriors: TD War (top_playgama 17) | Huts, tank, logo | - | 0 | green, brown | 3 | D | Y | W | I | N |
| P24 | Vega Mix 2: Adventure (top_playgama 21) | Raccoon, raft, match board, finger | smile | 1 | blue, green | 4 | M | Y | N | R | Y |
| P25 | Italian Brainrot Find the Difference (top_playgama 25) | Two shark panels, red circles | - | 2 | orange | 3 | D | N | W | R | N |
| P26 | Word Solitaire (top_playgama 29) | Cards labelled Words, hand | - | 0 | green | 2 | D | Y | N | S | N |
| P27 | Millionaire Life (top_playgama 33) | Man in sunglasses with cash | smile | 1 | blue, orange | 2 | D | Y | N | I | N |
| P28 | Home Design: Decorate House (top_playgama 37) | Pink bedroom, logo | - | 0 | pink | 4 | D | Y | N | R | N |
| P29 | Tower Defense (top_playgama 41) | Towers on a path, logo | - | 0 | green, brown | 2 | D | Y | N | I | N |
| P30 | Detective Max Mystery: The Disappearance of Mr. Winters (top_playgama 45) | Man in hat, magnifier, title | stern | 1 | dark | 9 | M | Y | W | R | N |
| P31 | Get a screw: puzzle! (top_playgama 49) | Shop building, screw logo, finger | - | 0 | yellow, pink | 4 | D | Y | N | R | Y |
| P32 | Zombie Derby (top_playgama 53) | Armoured car, zombie | - | 2 | blue, red | 2 | M | Y | Y | R | Y |
| P33 | Arrow Puzzle (trending_now 2) | Maze arrows, finger drawing line | - | 0 | white, black, blue | 0 | 0 | - | N | S | Y |
| P34 | PVZ Fusion Cheats (trending_now 5) | Fused plant monsters, logo | - | 6 | green, red | 3 | D | Y | Y | R | N |
| P35 | Deadly Descent (trending_now 8) | Red car on mountain road | - | 0 | green, grey, red | 0 | 0 | - | W | R | Y |
| P36 | Steal an Egg! (trending_now 11) | T-rex, boy with egg, alert mark | scared | 2 | blue, green, orange | 0 | 0 | - | Y | R | Y |
| P37 | Idol Livestream: Doll Dress Up (trending_now 15) | Anime doll, logo | smile | 1 | pink | 2 | M | Y | N | I | N |
| P38 | Sprunki Sandbox: Ragdoll Playground Mode (trending_now 18) | Sidebar of icons, orange character | - | 1 | orange, grey | 0 | 0 | - | N | S | N |
| P39 | Hidden Objects: Island Secrets (trending_now 21) | Explorer, map, magnifier, logo | neutral | 1 | green, brown | 4 | M | Y | N | R | N |
| P40 | Numicolor (trending_now 24) | Lips and rose line-art with numbers | - | 0 | white, red | 0 | 0 | - | N | S | N |
| P41 | Stickman Rebirth (trending_now 27) | Neon stickman vs spiders, logo | - | 2 | blue, orange | 2 | M | Y | Y | I | Y |
| P42 | Soccer Random (trending_now 30) | Pixel players kicking, logo | - | 4 | green, white | 2 | D | Y | N | I | Y |
| P43 | Merge Defense: Army Behind the Wall (trending_now 33) | Three evolving archers, arrows, logo | smile | 3 | blue, green, gold | 6 | D | Y | N | R | Y |
| P44 | Bottle Jump 3D (trending_now 36) | Cola bottles, hand | - | 0 | blue, orange | 0 | 0 | - | N | R | Y |
| P45 | Master Chess (trending_now 40) | Chess pieces | - | 0 | brown, black | 0 | 0 | - | N | R | N |
| P46 | Food Story: Tile Match (trending_now 43) | Chef pointing, tile grid, finger | smile | 1 | green, brown | 4 | M | Y | N | I | Y |
| P47 | Pirate Raid (trending_now 51) | Pirate ship, boy, logo | - | 2 | blue, red | 2 | D | Y | W | R | Y |
| P48 | Veggie Cats: Idle Farm Tycoon (trending_now 57) | Cats on farm, logo | - | 4 | blue, green | 2 | D | Y | N | R | Y |
| P49 | Piggy Heist (trending_now 62) | Pig robber with gun, logo | - | 2 | blue, pink | 2 | D | Y | Y | R | Y |
| P50 | Obby Race Rumble (trending_now 68) | Blocky boxers, logo | - | 2 | blue, red | 3 | D | Y | Y | R | Y |
| P51 | Screw Nuts & Bolts: Wood Solve (trending_now 73) | Wood board, screwdriver, thread character | smile | 1 | brown, pink | 5 | D | Y | N | R | N |
| P52 | Coin Run (trending_now 78) | Money roll, +200/-50 gates | - | 0 | blue, green, red | 0 | 0 | - | W | R | Y |
| P53 | Paper Doll Makeover & Dress Up (trending_now 84) | Paper dolls and clothes | - | 3 | pink, purple | 5 | M | Y | N | I | N |
| P54 | Klondike Classic (1 or 3 cards) (puzzle 3) | Playing cards, logo | - | 0 | green | 6 | D | Y | N | S | N |
| P55 | Blockibo: Color Blocks (puzzle 19) | Block board | - | 0 | purple, red, green | 0 | 0 | - | N | R | N |
| P56 | Jigpic Solitaire (puzzle 30) | Puppy photo grid, cat surprised | surprise | 9 | orange, brown | 0 | 0 | - | N | P | N |
| P57 | Mahjong 3 (puzzle 41) | Mahjong tiles, logo | - | 0 | multi | 2 | D | Y | N | R | N |
| P58 | Cat Sudoku: Brain Meowdoku (puzzle 52) | Cat face over tiles | cute | 1 | pink, purple | 0 | 0 | - | N | R | N |
| P59 | Arrows: Escape - Tap Puzzle (puzzle 65) | Arrows art, copy lines | - | 0 | blue, purple | 9 | M | Y | N | S | Y |
| P60 | Find Match 3D (puzzle 76) | Candy, ducks, toy | - | 3 | multi | 0 | 0 | - | N | R | N |

Column key: Face = readable face (emotion if one, "-" if no face or a mask); Subj = number of focal subjects; Words = baked-in words; Size = lettering size (0 none, S, M, D dominant); Name = lettering is the game's name; Threat Y/W/N; Type R/I/S/P; Moment = before/after or action in progress.

## 5b. Counts from the 120 tiles [CALC over my own table, my own codes]

| Measure | Hub 60 | Playgama 60 | of which Playgama draw/rescue (18) | other Playgama (42) |
|---|---|---|---|---|
| Baked-in lettering | 39 of 60 | 38 of 60 | 11 of 18 | 27 of 42 |
| Lettering is the game's name | 35 of 39 | 36 of 38 | 10 of 11 | 26 of 27 |
| Lettering size (S / M / D) among lettered | 3 / 13 / 23 | 0 / 11 / 27 | 0 / 2 / 9 | 0 / 9 / 18 |
| Median words when lettered; 4 or more words | 3; 11 of 39 | 3; 13 of 38 | 3; 2 of 11 | 3; 11 of 27 |
| A face shown | 30 of 60 | 29 of 60 | 17 of 18 | 12 of 42 |
| Threat: Y / W / N | 11 / 13 / 36 | 11 / 13 / 36 | 5 / 7 / 6 | 6 / 6 / 30 |
| 3D render R / 2D illustration I / flat UI or screen S / photo P | 39 / 14 / 7 / 0 | 32 / 21 / 6 / 1 | 6 / 12 / 0 / 0 | 26 / 9 / 6 / 1 |
| Moment (before/after or action in progress) | 37 of 60 | 33 of 60 | 14 of 18 | 19 of 42 |
| 0 / 1 / 2 / 3+ focal subjects | 15 / 27 / 9 / 9 | 18 / 17 / 12 / 13 | 0 / 8 / 5 / 5 | 18 / 9 / 7 / 8 |

Hub by band (n = 14 / 24 / 22): face 6 of 14, 13 of 24, 11 of 22; moment 13 of 14, 11 of 24, 13 of 22; 3D render 12 of 14, 14 of 24, 13 of 22; lettering 9 of 14, 16 of 24, 14 of 22; threat Y or W 7 of 14, 9 of 24, 8 of 22. [CALC] The ranks 41 to 100 band is the most action-heavy; faces and threats do not change by band.

Typical lettering [MEASURED by eye on the sheets]: when present it is a styled wordmark of 2 to 3 words filling the upper or lower third of the tile ("dominant" in 23 of 39 hub and 27 of 38 Playgama cases). The exceptions with slogans or UI copy are the ad-like tiles (Wood Nuts & Bolts at 12 words, Arrows Escape at 9, Detective Max Mystery at 9, Brain Bamboozle with a caption strip). Four or more words appears in 11 of 39 and 13 of 38 lettered tiles.

## 6. Draw, puzzle and rescue tiles on both platforms

Hub, what I looked at this session [MEASURED: contact sheet `ytdraw`, features.py]: Thief Puzzle (rank 7), DOP 4 (23), Save The Pets (26), DOP 2 (28), Draw Climber (34), Draw Bridge (44), Home Rush (67), Doge Rescue (179), Save the Dog (211), Happy Glass (676). Other readings below come from my 60-tile table and from `tile-census.md` [REPORTED: that file, not re-checked].

| Tile | Hub rank (plays) | sat | pale-paper | edge | What the tile shows [MEASURED by eye] |
|---|---|---|---|---|---|
| Thief Puzzle | 7 (95m) | 0.39 | 0.04 | 0.035 | doodle stick figures on a sand-and-sky scene, a masked thief behind a title sign, a dog; two figures dangling |
| DOP 4 | 23 (41m) | 0.11 | 0.77 | 0.022 | pastel title lettering, two sticker cards (rocket, dog) with pencils, on near-white |
| Save The Pets | 26 (39m) | 0.31 | 0.00 | 0.023 | beige, a dog at the bottom of a pit with bees and hives above, title wordmark top |
| DOP 2 | 28 (35m) | 0.12 | 0.73 | 0.024 | same sticker-card layout with a llama and a magician |
| Draw Climber | 34 (29m) | 0.28 | 0.37 | 0.025 | title wordmark, a real gameplay screen of a blue cube on yellow platforms |
| Draw Bridge | 44 (26m) | 0.57 | 0.03 | 0.049 | title wordmark, a yellow car on a drawn arc between cliffs, a hand holding a pencil |
| Home Rush | 67 (19m) | 0.29 | 0.07 | 0.049 | pink, two parents with babies, two houses, drawn lines, large title lettering |
| Doge Rescue | 179 (7.4m) | 0.16 | 0.65 | 0.034 | a panicking stick figure with a shiba head, bees, hive, a pencil; title wordmark top |
| Save the Dog | 211 (6.1m) | 0.34 | 0.01 | 0.047 | a line-drawn helicopter around a husky in a pit above lava, bees, a timer |
| Happy Glass | 676 (378k) | 0.11 | 0.83 | 0.035 | graph paper, title lettering, a smiling glass, a pencil, a blue water stream |

Features for the whole draw-ish group on the hub (55 titles whose names contain draw, rescue, save the pets/dog/guy/fish/nemo, DOP, Happy Glass, Thief Puzzle, Doge, pin pull, escape or one part; "escape" also pulls in a few non-draw games, so treat it as a rough group) [MEASURED]: median saturation 0.49 (top 100: 0.51, all hub tiles: 0.58), edge density 0.043 (0.029, 0.041), pale-paper share 0.060 (0.050, 0.043). Of the 55, 9 are in the top 100 and the median rank is 426 of 1,124. So by features the group is a little less saturated than average and has more edge than the top 100; the difference from the top 100 is small and the group is a keyword pick, not a clean sample.

Playgama (18 draw/rescue/pin tiles, features and my reading) [MEASURED]: median saturation 0.39 against 0.60 for all Playgama landscape tiles; strongly saturated share 0.20 against 0.35; pale-paper share 0.09 against 0.03; edge density 0.047 against 0.049 (no difference); contrast 0.226 against 0.220. Looking at them: 8 show an animal or person in trouble (Save The Pets, Save the Pets, Save Nemo, Draw path to home, Home Pin, Kitty Path, Egg Thief, Draw or Delete LoveStory after-panel), 6 show a pencil or finger or drawn line (Happy Glass, Dop Stickman, Draw Animals, DOP2 Draw Love, DOP Noob, Kitty Path), and the two "Save The Pets" tiles put the dog inside a drawn dome with bees outside. None of the 18 are photographic. The three tiles with lettering over a pale ground (Happy Glass 0.75, DOP2 Draw Love 0.69, Draw path to home 0.55, in pale-paper share) are the closest in look to BYC's paper set.

How draw tiles differ from the hub top 100 overall [MEASURED, sample 8 of 14 high-rank hub draw titles seen on the sheet plus coded sample]:
- The draw titles that sit in the top 50 (Thief Puzzle, DOP 4, Save The Pets, DOP 2, Draw Climber, Draw Bridge) are less saturated (0.11 to 0.57) and lighter than the 3D-render majority of ranks 1 to 12, and 3 of the 10 I looked at are pale-paper tiles (DOP 4, DOP 2 and Happy Glass above 0.7).
- A pale tile is therefore not unknown at the top: 16 of the 1,124 hub tiles have a pale-paper share of 0.7 or more, and 4 of them (Color Page ASMR at rank 16, Emoji Puzzle 19, DOP 4 23, DOP 2 28) are in the top 30, which holds 2.7% of the tiles but 25% of the very pale ones; on Playgama 5 of 254 downloaded tiles reach 0.7, including Arrow Puzzle (trending rank 2). [MEASURED] Small numbers and the same confounds apply. What those top pale tiles show is a clear coloured focal subject on the white (emoji faces, a boba cup, pastel sticker cards, a blue arrow), mostly with a large wordmark; BYC's paper cover has a red boulder and a yellow figure on pale paper but no lettering and a hairline background grid, which I did not measure separately.
- Look does not line up with plays inside the group: Happy Glass has 378k plays at rank 676 with the palest tile in the group (0.83) while DOP 4 and DOP 2 (0.77 and 0.73) have 41m and 35m; Save the Dog and Doge Rescue (0.01 and 0.65) have 6.1m and 7.4m. [MEASURED plays; no cause claimed; who published each game was not checked]

## 7. Design rules for a BYC landscape Playgama card and a portrait YouTube tile

All [INFERRED] from the numbers above; none has been tested on a player.

1. Put one worried face and one visible threat in the frame, both readable at about 221x148. Rests on: 17 of 18 Playgama draw tiles show a face and 12 of 18 show a visible or implied threat (table 5b), against 12 and 12 of the other 42; BYC's pop cover already has Milo's shouting mouth and a boulder.
2. Make the threat look like a threat, not a ball. The boulder in the pop crop has a dash for a face and no motion cue; the readable threats in the sample are bees, a shark, a dog, a chicken, a teacher, i.e. something with intent or a clear path to the character (48 of 120 rows are Y or W; see rows P1, P9, P13, Y42, Y47). Add a speed streak, a shadow on Milo, or a crack.
3. Show a moment, not a pose: the line already drawn and the rock mid-fall. Rests on: 37 of 60 hub tiles and 33 of 60 Playgama tiles carry a moment, 13 of 14 in hub ranks 41 to 100, 14 of 18 Playgama draw tiles. BYC's cover already does this.
4. Give the tile one dominant piece of lettering, 2 to 3 words, large. Rests on: 39 of 60 and 38 of 60 tiles carry lettering, in 35 and 36 of those it is the game's name, in 23 and 27 it is dominant, median 3 words. The title "BRO, YOU'RE COOKED." is 3 words and fits, but it names no action; a short second line such as a verb ("Draw to save him") is not measured and is a hypothesis. Hub logo rules: UNVERIFIED (see `tile-census.md` section 4).
5. Do not chase louder colour. Rests on: rho for saturation and strongly saturated share vs hub plays is -0.10 and -0.03 (section 2), and the pop cover's colour already sits at the 52nd to 69th percentile. Keep it at about 0.5 to 0.65 saturation.
6. Add secondary detail so the cover is not the flattest tile on the platform. Rests on: pop cover edge density 0.013 to 0.016 is at the 0th percentile of Playgama tiles and 2nd to 9th of hub tiles; top-100 hub tiles have median 0.029 (lower quartile 0.023), and there is no sign that more edge means more plays (rho -0.23). A sensible target is 0.025 to 0.04 (inside the top-100 range), reached by adding a ground, a background object, a motion line and a title, not by crowding.
7. Raise contrast on the landscape card, which reads weakest. Rests on: contrast 0.166 is at the 4th to 7th percentile of Playgama landscape tiles (median 0.22, lower quartile about 0.19); the portrait pop cover is at the 27th to 47th. A darker ground band or a darker top corner would move it.
8. Do not use the paper set as a store tile unless it has big lettering. Rests on: pale-paper share 0.79 to 0.83, at the 99th to 100th percentile on both platforms; the pale tiles that sit high (Color Page ASMR, Emoji Puzzle, DOP 4, DOP 2, Arrow Puzzle; section 6) each have a clear coloured focal subject, and most have a big wordmark, while Happy Glass, equally pale, is at hub rank 676.
9. Match the draw genre's 2D look rather than faking a 3D render. Rests on: 12 of 18 Playgama draw tiles are 2D illustration versus 9 of 42 others; 39 of 60 hub tiles are 3D renders, but the draw titles in the hub top 50 (section 6) are mostly 2D or doodle. BYC's hand-drawn stick style is on-genre.
10. For the portrait hub tile keep Milo, boulder and line stacked in the middle 71% (the square crop rule) and test it at 194x272 next to real neighbours, because 1,122 of 1,124 hub tiles are 5:7 files and the pop portrait crop already fits. Rests on: geometry in `tile-census.md` section 2; the 800x800 pop cover's strongly saturated share is 0.61 at crop and 0.70 at 218 px, higher than 80 to 90% of hub tiles, so the square tile is the loudest of the formats.

## 8. What the numbers cannot tell us

- Whether any tile feature causes plays or clicks. Plays are cumulative and rounded; no click-through, impressions or conversion data exist outside the platforms, and Playgama gives no counts at all.
- Confounds I could not remove: publisher size and catalogue (cross-promotion), time on platform, hub shelf placement and personalised order, Playgama's own promotion (hot/top badges), and whether today's tile is the one that earned the plays.
- Playgama sample: only the first 90 of trending, 90 of puzzle and 45 of new were downloaded, 254 images; no portrait (500x820) or square (218x218) Playgama tile was sampled, so the "separate by shape" request is only half done. Beyond the first 90 entries of a list nothing was measured except the 13 extra draw tiles.
- The 120 hand codes are one reader's judgement of 120 images; 60 are not random (the draw titles were chosen) and none is from hub ranks 1 to 40 (the old census covers those).
- features.py is a crude proxy: it knows nothing about faces, lettering, subject size or composition, and it works on a 256 px copy; the edge measure counts lettering and texture alike.
- Ties in plays text were broken by CSV order. Spearman is a monotone measure and misses effects that appear only at one end.
- Whether BYC's crops match what the platforms actually serve: I cropped by rule (centre crop to the tile aspect; the square to the middle 71%), not from a live card.
- Not checked: video previews on either platform, the hover state, the title and description under the tile, and whether a title wordmark counts as a logo under YouTube's rule (UNVERIFIED).
