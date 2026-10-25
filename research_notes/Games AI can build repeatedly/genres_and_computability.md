# Games AI can build repeatedly: which casual genres sell, and which ones a computer can generate and verify

**How these notes were gathered (read first).** Researched 2026-10-25. Most sites could not be opened. WebFetch returned DNS errors, and curl through the proxy got `403 CONNECT tunnel failed` for mediacube.io, naavik.co, playgama.com, playables.games, pocketgamer.biz, 80.lv, gamesbeat.com, gamespress.com, arxiv.org, crazygames.com, poki.com, gameanalytics.com and Simon Tatham's site. Only github.com and raw.githubusercontent.com answered.

Each finding is tagged by how it was obtained:
- **[CODE]**: read directly from a GitHub file. These are the strongest.
- **[SEARCH]**: a search engine's summary of a page that could not be opened. Confidence is lower, and the numbers are as the summary reported them.
- **[PRIOR]**: taken from this repo's earlier research notes (dated 2026-10-18/19 and 2026-10-25), which cite their own sources.
- **[REPO]**: this project's own measured experience, from `CLAUDE.md`.

Findings are also tagged by source type and confidence:
- **Source type:** [1P] is a company or platform speaking about itself. [VENDOR] is a seller of publishing or ads services. [ANALYST] is a market-data firm or newsletter. [ACADEMIC] is a paper. [PROMO] is self-reported or promotional.
- **Confidence:** H, M or L.

---

## Q1. Which genres top YouTube Playables and the web portals (Playgama, Poki, CrazyGames) in 2025–2026?

### Takeaway
**Playables.** The biggest all-time play counts belong to two groups:
- **3D hypercasual action and runners:** Tall Man Run 110M, Build a Queen 103M, Snake Clash! 99M, Stealth Master 96M and Going Balls 96M.
- **Draw-input puzzles:** Thief Puzzle 92M is #1 in Brain & Puzzle. One publisher names "Draw & Escape" as the strongest new mechanic of summer 2026.

The catalogue holds many sort, jam/parking, tile-match, merge and solitaire titles, but most sit mid-table or in the long tail. The exceptions are the parking games, at about 21–23M plays.

**Mobile.** Mobile is where the logic-puzzle subgenres are proven. In 2025 the growth came from Sort, Screw and Block subgenres, with Block Blast as the top download.

**Web portals.** No official genre charts exist for Poki, CrazyGames or Playgama. What the portals show publicly is action, runner and .io games, plus troll platformers such as Level Devil.

### Cited Findings
**Playables: overall ranking (third-party tracker; YouTube publishes no chart)**
- [M][SEARCH] TubeGames ranks "all 1,939 live games", updated 22 Oct 2026. The top six are Tall Man Run (110M), Build a Queen (103M), Snake Clash! (99M), Stealth Master (96M), Going Balls (96M) and Thief Puzzle (92M). The same site's homepage gave slightly different counts that day: Build a Queen 104M, Snake Clash! 101M. TubeGames is independent and re-reads YouTube's public play counter. — [TubeGames Best](https://playables.games/best/); [TubeGames home](https://playables.games/)
- [M][SEARCH] TubeGames reports platform scale of about 17M plays/day (20 Sep 2026) and a catalogue of 1,893 games (20 Oct 2026). A fan wiki gave Tall Man Run 104M in September 2026. — [TubeGames](https://playables.games/); [Playables wiki](https://youtube-playables.fandom.com/wiki/Playables)
- [L][SEARCH] **Brain & Puzzle** (4 Oct 2026) has 611 games and 1.1B combined plays. The search summary called the page text "jumbled", so these readings are rough:
  - Parking Rush ~23M, Parking Jam ~21M (about rank 17), Parking Jam Bus ~398K.
  - Hexa Sort ~698K, Water Sort Quest ~233K.
  - Color Water Sort 3D (Famobi) near rank 13, count unreadable.
  - Goods Puzzle: Sort Challenge near the top.

  — [TubeGames Brain & Puzzle](https://playables.games/genres/brain-puzzle/)
- [M][SEARCH] Simulation has 230 games and 1.2B combined plays. — [TubeGames Simulation](https://playables.games/genres/simulation/)
- [M][PRIOR] Draw-input puzzles on Playables:
  - Thief Puzzle 87–95M (#1 in Brain & Puzzle; TapNation dev, Famobi publisher).
  - DOP 4: Draw One Part 41–42M (SayGames).
  - Save The Pets ~38M, #24 of ~1,850 (18 Oct 2026).
  - Draw Climber ~28M (Voodoo), Draw Bridge ~21M.

  — [rivals.md](file:///home/user/BRO-YOU-RE-COOKED./research_notes/Free%20game%20tools%20and%20Playables%20rivals/rivals.md), citing [TubeGames Brain & Puzzle](https://playables.games/genres/brain-puzzle/) and [Playables wiki](https://youtube-playables.fandom.com/wiki/Playables)
- [L][VENDOR][SEARCH] Mediacube ranks titles that launched between 1 Jul and 4 Sep 2026 by plays per day:
  - "Draw & Escape Puzzle" is the strongest category. Its leaders are Tricky Twist: Brain Puzzle (~394K/day), Dog Escape (~274K/day) and Home Rush ("Draw to Home", ~243K/day).
  - Mechanic #2 is "Car Physics & Crash Sandbox". Mechanics #3–6 were not visible in any summary.
  - The catalogue grew from 788 to 1,477 titles in that window.
  - Mediacube is a Playables publisher, so it is not neutral.

  — [Mediacube, "6 YouTube Playables Game Mechanics Winning in 2026"](https://mediacube.io/en/blog/youtube-playables-game-mechanics)

**Playables: catalogue composition (my own count of a GitHub scrape)**
- [M][CODE] I counted title keywords in a scrape of 456 Playables titles. The repo was created on 16 May 2026, so treat it as a May 2026 snapshot. Titles can match more than one group, and a title count is not a play count. Counts, with example titles:
  - **Tile, mahjong and match: 23.** Match Triple 3D, Tile Match Puzzle, Mahjong Royal and others.
  - **Sort family: 20.** Ball Sort Puzzle, Color Water Sort 3D, Hexa Sort, Screw Jam – Bolts Nuts Puzzle, Wood Nuts & Bolts, Goods Puzzle: Sort Challenge, Cake Sort, Bus Sort Jam, Sort The Blocks 3D.
  - **Merge: 17.**
  - **Solitaire: 16.**
  - **Jam, parking and unblock puzzles: about 14.** Parking Jam, Parking Jam Bus, Bus Jam, Unpark Jam, Snake Unjam, Traffic Tap Puzzle, Wood Blocks Jam. I left out four "Traffic Racer" driving games.
  - **Draw or line: 13.** Includes Flow Line Draw, Flow Line Hex, Flow Line Puzzles and Save The Pets.
  - **Word: 10.** Daily Crossword, Word Search, Words of Wonders and others.
  - **Arrow and tap-away: 8.** Arrow Frenzy – Escape Puzzle, Arrow IQ: Logic Puzzle, Arrows Slide Puzzle, Tap Away, Wool Weave – Block Escape.
  - **2048: 6.**
  - **Idle or tycoon: 4.**
  - **Sudoku: 1. Minesweeper: 1** ("Classic Mine Sweeper").
  - **None** has nonogram, picross or sokoban in its title.

  — [yt-playables-scraper JSON](https://github.com/CoderandHacker69/yt-playables-scraper/blob/main/youtube_playables_scraped.json)
- [M][CODE][STALE: games published Jun 2023–May 2025] An older mirror of YouTube's own catalogue fields (170 games) has this genre split: Brain & Puzzle 45, Arcade 33, Simulation 22, Action 22, Sports 14, Board & Card 11, Racing 8, RPG & Strategy 7, Trivia & Word 7, Music 1. — [bubbls/youtube-playables](https://github.com/bubbls/youtube-playables/blob/main/all-playables-formatted.json)
- [L][PRIOR] A 2026 blog names the studios with titles in rotation: SayGames, Supercent, Supersonic, Voodoo, Playgama, TapNation and CrazyLabs. PocketGamer describes the catalogue as ad-style hypercasual. — [playables_platform.md](file:///home/user/BRO-YOU-RE-COOKED./research_notes/Free%20game%20tools%20and%20Playables%20rivals/playables_platform.md); [PocketGamer](https://www.pocketgamer.com/youtube-playables/50-plus-markets-expansion/)

**Mobile, where these puzzle subgenres were proven in 2025–26**
- [M][ANALYST][SEARCH] Naavik on mobile puzzle games in 2025:
  - More than 9.7B downloads and $10B in IAP revenue, up 14% year on year.
  - "The remaining 40% was driven by fast-emerging niche subgenres such as Sort, Screw, and Block." The summary does not say what the 40% is a share of.
  - Match Swap revenue was flat. Hidden Objects and Word declined in both revenue and installs.

  — [Naavik](https://naavik.co/digest/how-niche-subgenres-are-reshaping-the-mobile-puzzle-market/)
- [M][ANALYST][SEARCH] Block Blast (Hungry Studio), per mobilegamer.biz using AppMagic data:
  - About six months at the top of the download charts.
  - More than 38M installs in Dec 2025, against a record 42.5M in Apr 2025.

  [L][1P PR] The publisher also claims #1 worldwide downloads in Jan and Feb 2026, citing AppMagic. — [mobilegamer.biz Dec](https://mobilegamer.biz/decembers-top-mobile-game-downloads-2/); [mobilegamer.biz 2025 YTD](https://mobilegamer.biz/2025s-top-mobile-game-downloads-so-far/); [BusinessWire](https://www.businesswire.com/news/home/20260312302688/en)
- [M][ANALYST][SEARCH] Color Block Jam (Rollic):
  - About 43M year-to-date installs in mobilegamer.biz's mid-2025 chart. The summary also gave "42", apparently a chart position.
  - US weekly downloads rose from 21.4K to more than 512K in Q1 2025 (Sensor Tower).

  Magic Sort was in Sensor Tower's US Q4 2025 top five puzzle games by downloads, at 381K weekly by the end of the quarter. — [mobilegamer.biz](https://mobilegamer.biz/2025s-top-mobile-game-downloads-so-far/); [Sensor Tower US Q4 2025](https://sensortower.com/blog/2025-q4-unified-top-5-puzzle-games-units-us-64bc1644e1714cfff1e615fc)
- [L][ANALYST][SEARCH] Arrows – Puzzle Escape (Lessmore, under Miniclip) grew downloads 130% month on month in Dec 2025, by Insightrackr's own estimates. The App Store is full of near-clones: Arrow Puzzle – Tap Away, Arrows: Logic Puzzle Game, Arrow Jam Escape, Tap Away: Zen Escape. — [Insightrackr Dec 2025](https://blog.insightrackr.com/en/docs/2025-December-Top-Mobile-Games); [App Store example](https://apps.apple.com/app/id6755482314)
- [L][ANALYST][SEARCH] Gamigion names "conveyor-ized" sort games (Pixel Flow, Sand Loop, Marble Sort, Yarn Loop) as the 2026 outliers within Queue Sort. — [Gamigion](https://www.gamigion.com/retention-benchmark-for-sort-puzzle-games-in-2026/)

**Web portals**
- [L][1P via mirror][SEARCH] Poki says more than 90 million people play each month. Its About page names Subway Surfers, Temple Run 2, Stickman Hook and Rodeo Stampede as its most popular games. — [About Poki (mirror)](https://scriptagc.wasmer.app/https_poki_com)
- [M][1P][SEARCH] Level Devil (a troll platformer) has "over 3 million Poki players" upvoting it. That is an upvote count, not plays. One weak source credits a solo developer, Unept. — [Poki: Level Devil](https://poki.com/en/g/level-devil)
- [L][SEARCH] No official CrazyGames ranking for 2025 was found. Listicles name Shell Shockers, and Zombie Launcher X "#1 for 6 weeks". CrazyGames does have a "Sorting" tag and hosts screw-sort games. — [Analytics Insight](https://www.analyticsinsight.net/amp/story/games/most-popular-crazy-games-in-2025); [CrazyGames Sorting tag](https://www.crazygames.com/t/sorting); [Screw Sort on CrazyGames](https://www.crazygames.com/game/screw-sort---fix-match-puzzle)
- No Playgama catalogue chart or genre breakdown was found.

### Inferences
- Commercial success on Playables comes in two shapes:
  - **Top of the all-time chart:** studio-made 3D hypercasual action and runners, plus a handful of draw-input puzzles.
  - **Inside Brain & Puzzle:** logic puzzles (sort, jam, tile-match, arrow) are many titles with modest plays each. Parking Jam and Parking Rush at about 21–23M are the strongest found.

  So the evidence says **"proven demand, crowded, mid-sized hits"** for the computable genres, and **"blockbusters, but art- and reflex-heavy"** for runners.
- The mobile 2025–26 winners are Block Blast, sort, screw, Color Block Jam (a jam/escape variant) and Arrows. They are the same subgenres that already have many Playables clones, so Playables looks like it is catching up on mobile trends through publishers who port their hits (Famobi, SayGames, TapNation). This is my inference. Any new entrant in these subgenres enters a crowded field.
- The portals show their public face as action, runner and troll platformer games. Puzzles are present (a CrazyGames sorting tag, screw sort), but they were not visible as chart-toppers in any source I could reach.

### Gaps
- There is no official chart for YouTube, Poki, CrazyGames or Playgama. Every Playables count comes from TubeGames or a wiki, re-read from YouTube's public counter, and could not be opened directly.
- Plays for nonogram, sokoban, minesweeper, flow or arrow titles on Playables were not found. My title counts are a May 2026 snapshot.
- Mediacube's mechanics #3–6 are unknown.
- Naavik's "40%" has an unclear referent.
- No 2025 AppMagic figures were found for Royal Match, Screw Jam or Hexa Sort.

---

## Q2. For each genre: is there an exact solver, a published generator with guaranteed solvability, and an exact difficulty measure?

### Takeaway
Deterministic, discrete, full-information puzzles are the strongest case. That covers sort, Rush Hour and parking jam, arrow/tap-away, flow, nonograms, no-guess minesweeper and other logic grids, sokoban, and tile-match with a known layout. For these genres:
- **Exact solvers exist** as open code. BFS, A*, SAT and line solvers solve typical casual sizes in under a second.
- **Hardness is known.** Several are NP-complete or PSPACE-complete in general, which does not matter at casual board sizes.
- **Difficulty can be measured exactly**: minimum moves, line-solver steps, technique depth, number of dead ends.

Match-3 and block puzzles are NP-hard even without randomness. They also have random refills and piece draws, so difficulty is a *distribution*, estimated by agents as a pass rate (King, EA, Rovio).

For physics games (Cut the Rope, Angry Birds, draw-to-save, pin-pull), research generators had to bolt on simulation, stability and solvability agents. They still could not control difficulty. This project's own experience shows that passing automated gates does not make a level meaningful.

### Cited Findings
**Sort puzzles (water, ball, and by extension stack-based nuts-and-bolts)**
- [H][ACADEMIC][SEARCH] Ito et al., "Sorting Balls and Water: Equivalence and Computational Complexity" (arXiv 2202.09495; FUN 2022; Theoretical Computer Science 978, 2023):
  - Ball sort and water sort have the same solvability.
  - Both are **NP-complete**.
  - Finding a **shortest** sorting sequence is NP-complete "even for trivial" water-sort instances.
  - There are polynomial algorithms for special cases, and bounds on how many empty bins make every instance solvable.

  — [arXiv 2202.09495](https://arxiv.org/abs/2202.09495v1); [Dagstuhl LIPIcs](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.FUN.2022.16)
- [H][CODE] Kociemba's **optimal** solver (41★, updated Jan 2026) covers "Water Sort", "Ball Sort", "Sort Hoop" and "Sort It 3D":
  - The algorithm "resembles both A* and breadth first search", with a 2^32-bit hash table.
  - "Optimal solutions … are found within less than a second". With up to 14 colours and 6 blocks per column, the optimum takes seconds.
  - It also generates random positions.

  — [hkociemba/WaterBallSortPuzzleOptimalSolver](https://github.com/hkociemba/WaterBallSortPuzzleOptimalSolver)
- [M][CODE] Other small DFS/BFS solvers: kuking/WaterSortPuzzleSolver (Go, 24★), cemasma/water-sort-puzzle-solver (Go, 22★, updated Sep 2026), pkositsyn (Go, 18★), tanjuntao (Python, DFS and BFS, 17★). GitHub returned 233 results for "water sort solver". — [kuking](https://github.com/kuking/WaterSortPuzzleSolver); [cemasma](https://github.com/cemasma/water-sort-puzzle-solver); [pkositsyn](https://github.com/pkositsyn/water-sort-puzzle-solver); [tanjuntao](https://github.com/tanjuntao/water-sort-puzzle)
- [M][CODE] The AI-built game **Sortaballs** advertises "ten board modes and over 1,000 levels, each benchmarked against an optimal solver". It was built with DeepSeek and OpenCode. — [awesome-ai-built-games README](https://github.com/lappemic/awesome-ai-built-games)
- [L] No public solver or generator turned up on GitHub for **screw/nuts-and-bolts** or **hexa sort**. A search for "screw puzzle nuts bolts solver" returned 0 repos. — [GitHub search](https://github.com/search?q=screw+puzzle+nuts+bolts+solver&type=repositories)

**Rush Hour, Unblock Me, sliding parking jam**
- [H][SEARCH] Generalised Rush Hour is **PSPACE-complete** (Flake & Baum). Sokoban and Rush Hour are both on Wikipedia's PSPACE-complete list. — [Wikipedia: PSPACE-complete](https://en.wikipedia.org/wiki/PSPACE-complete); [Demaine & Hearn, NCL](https://erikdemaine.org/papers/NCL_TCS)
- [H][CODE] Fogleman (2018, MIT-style licence):
  - The Go code "can solve puzzles, render puzzles to PNG, generate puzzles".
  - The C++ code "'solves' the entire game – identifying all 'interesting' puzzles that are possible".
  - "A database of puzzles is available."

  — [fogleman/rush README](https://github.com/fogleman/rush); [article](https://www.michaelfogleman.com/rush/)
- [M][SEARCH] The hardest 6×6 start takes **93 steps**, or **51 moves** if moves are counted instead of steps. FlowingData reports Fogleman's database at about 1.5 million puzzles; I could not verify that number. — [Wikipedia: Rush Hour](https://en.wikipedia.org/wiki/Rush_Hour_(puzzle)); [FlowingData](https://flowingdata.com/2018/07/13/rush-hour-puzzle-solver-and-generator)
- [M][CODE] zwegner/slidey-blocky-thingy is a React Unblock Me clone "with Python solver/puzzle generator" (7★). — [GitHub](https://github.com/zwegner/slidey-blocky-thingy)
- [L][CODE] Searches for a "parking jam" solver found only one: car-jam-solver, created Sep 2026 with 0★. — [OfferPk/car-jam-solver](https://github.com/OfferPk/car-jam-solver)

**Arrow, tap-away and "car out" escape puzzles**
- [L] The GitHub search "arrow puzzle tap away generator" returned **0 repos**. No paper was found either. The commercial evidence is in Q1. — [GitHub search](https://github.com/search?q=arrow+puzzle+tap+away+generator&type=repositories)

**Flow Free / Numberlink**
- [H][CODE] thomasahle/numberlink (110★, AGPL-3.0):
  - It generates and solves "large instances". "40x40 are casually solved and generated", and the "270 puzzles at Janko.at" are solved "in 0.14 seconds".
  - Its generator makes "pseudo-unique" puzzles by rejecting paths that touch themselves.
  - Its own caveat: "You can't use numberlink for checking if a puzzle is unique". It points to imos's solver for counting solutions.

  — [README](https://github.com/thomasahle/numberlink); [gen/gen.py](https://github.com/thomasahle/numberlink/blob/master/gen/gen.py)
- [H][CODE] mzucker/flow_solver (58★) is a "Fast automated solver for Flow Free". The C version is a heuristic search; the Python version uses SAT through pycosat. Its licence is **Creative Commons Attribution-NonCommercial 2.0**, so it cannot ship in a commercial game. — [README](https://github.com/mzucker/flow_solver); [LICENSE](https://github.com/mzucker/flow_solver/blob/master/LICENSE)
- [L][SEARCH] The complexity of plain Numberlink was not confirmed. A variant, "Zig-Zag Numberlink", is proven NP-complete. — [arXiv 1410.5845](https://arxiv.org/pdf/1410.5845)

**Nonograms (picross)**
- [H][ACADEMIC][SEARCH] Batenburg & Kosters work with "simple" nonograms, those solvable by line-by-line reasoning:
  - A polynomial-time line algorithm either solves a nonogram or decides that it is not simple.
  - Difficulty is defined as "the number of steps required to reconstruct the image".
  - **Deciding uniqueness is NP-hard in general.**
  - "Constructing Simple Nonograms of Varying Difficulty" (Batenburg, Henstra, Kosters, Palenstijn) builds puzzles at a chosen difficulty.

  — [Kosters NVTI 2012](https://liacs.leidenuniv.nl/home/kosters/nvti2012.pdf); [Constructing simple nonograms](https://liacs.leidenuniv.nl/home/kosters/constru.pdf); [Henstra thesis](https://liacs.leidenuniv.nl/assets/Masterscripties/2011-04SjoerdHenstra.pdf)
- [M][SEARCH] OEIS A391619 counts n×n nonograms that line analysis solves uniquely: 1, 2, 14, 384, 51234. — [OEIS A391619](https://oeis.org/A391619)
- [H][CODE] Simon Tatham's Pattern (nonogram) generator: "it seemed important to me to ensure a unique solution. I do this the brute-force way, by having a solver algorithm alongside the generator, and repeatedly generating a random grid until I find one whose solution is unique… provided you keep grid size below around 30." The catch is that this "limits the available puzzles to those solvable by the algorithm I've used". — [pattern.c (ghewgill mirror)](https://github.com/ghewgill/puzzles/blob/master/pattern.c)
- [M][CODE] Open solvers:
  - HandsomeOne/Nonogram: TypeScript editor and solver, 152★.
  - Izaron/Nonograms: a "very fast" C++ solver and generator that converts an image into a puzzle, 62★.
  - tsionyx/nonogrid: Rust, 34★.
  - SmilingWayne/puzzlekit: "100+ solvers for logic puzzles with ortools, 41k+ datasets for 130+ puzzles", 37★, updated 25 Oct 2026.

  — [HandsomeOne](https://github.com/HandsomeOne/Nonogram); [Izaron](https://github.com/Izaron/Nonograms); [nonogrid](https://github.com/tsionyx/nonogrid); [puzzlekit](https://github.com/SmilingWayne/puzzlekit)

**Minesweeper and logic grids (Tatham's collection as an existence proof)**
- [H][CODE] Tatham's Mines "will generate its mine positions in such a way as to ensure that you never need to *guess*". Its built-in "Minesweeper solver [is] used to ensure the generated grids are solvable without having to take risks." — [puzzles.but](https://github.com/ghewgill/puzzles/blob/master/puzzles.but); [mines.c](https://github.com/ghewgill/puzzles/blob/master/mines.c)
- [H][CODE] The collection has **40 puzzle types**. Examples: Net, Pattern, Solo (sudoku), Mines, Bridges, Light Up, Loopy, Unruly, Signpost, Tracks and Flood.
  - Each has a generator plus solver.
  - Many expose a "Difficulty" setting. For Solo, "Difficulty levels are judged by the complexity of the techniques" needed.
  - Licence: MIT.
  - Mirrors: ghewgill/puzzles (224★), and an Android port, chrisboyle/sgtpuzzles (746★, updated Oct 2026).

  — [puzzles.but](https://github.com/ghewgill/puzzles/blob/master/puzzles.but); [LICENCE](https://github.com/ghewgill/puzzles/blob/master/LICENCE); [sgtpuzzles](https://github.com/chrisboyle/sgtpuzzles)
- [L][CODE] Standalone no-guess generators: sam-gc/minesweeper-generator-solver ("can guarantee a no-guess game", 1★, 2022) and FairSweeper (Sep 2026). — [sam-gc](https://github.com/sam-gc/minesweeper-generator-solver)

**Sokoban-likes**
- [H][SEARCH] Sokoban is PSPACE-complete (Culberson; Dor & Zwick). It stays PSPACE-complete "even if no barriers are allowed" (Demaine & Hearn). — [Wikipedia](https://en.wikipedia.org/wiki/PSPACE-complete); [Demaine NCL paper](https://erikdemaine.org/papers/NCL_ICALP2002); [Culberson notes](https://webdocs.cs.ualberta.ca/~joe/Preprints/Sokoban/node5.html)
- [H][ACADEMIC][SEARCH] Kartal, Sohre & Guy, "Data-Driven Sokoban Puzzle Generation with Monte Carlo Tree Search" (AIIDE 2016):
  - MCTS generates by simulated play, so every puzzle is solvable.
  - A user study picked cheap features that track perceived difficulty. A second study found the scores "correlate strongly" with perceived difficulty.
  - I did not read the exact features.

  — [AAAI](https://ojs.aaai.org/index.php/AIIDE/article/view/12859); [project page](https://motion.cs.umn.edu/r/sokoban-pcg/)
- [H][CODE] AlliBalliBaba/Sokoban-Level-Generator (60★) admits its "main problem … is that it cannot really distinguish if a level is difficult or not. Occasionally very easy levels with an obvious solution are being created." It also notes that trying every box-to-goal assignment grows as n!. — [README](https://github.com/AlliBalliBaba/Sokoban-Level-Generator). See also [miki151/sokoban](https://github.com/miki151/sokoban) (40★).
- [M][ACADEMIC][SEARCH] Todd, Earle, Nasir, Green & Togelius (FDG 2023) find LLMs "capable" of generating Sokoban levels, and "their performance scales dramatically with dataset size". The exact playable rate was not seen. — [arXiv 2302.05817](https://arxiv.org/pdf/2302.05817)

**Tile match (triple) and mahjong solitaire**
- [L][SEARCH] Wikipedia's PSPACE-complete article lists "Mahjong" among PSPACE-complete solitaire games. I did not see the primary source, and other claims call it NP-complete, so this is unresolved. — [Wikipedia](https://en.wikipedia.org/wiki/PSPACE-complete)
- [L][SEARCH] No published guaranteed-solvable triple-tile generator was found:
  - One itch.io developer "originally was going to … reverse solv[e]" daily puzzles, never built it, and "can't guarantee it's always solvable".
  - App descriptions suggest difficulty comes mainly from the limited tray slots.

  GitHub searches for solvable mahjong layout generators returned 0. — [itch.io post](https://itch.io/post/16833216)

**Match-3**
- [H][ACADEMIC][SEARCH] Walsh, "Candy Crush is NP-hard" (2014): reaching a target score in a fixed number of swaps is NP-hard, and later game modes are too. — [arXiv 1403.1911](https://arxiv.org/pdf/1403.1911)
- [H][ACADEMIC][SEARCH] King's line of work on difficulty:
  - Poromaa (2017 thesis) used **MCTS to predict players' average pass rate** per level.
  - Gudmundsson et al. (2018) used a CNN trained on player moves. It correlates better with level difficulty than MCTS "at a fraction" of the compute.
  - A 2021 follow-up combined deep RL with MCTS and was best on the hardest levels.
  - A 2024 King announcement says the bot can auto-adjust levels that miss their target.

  — [Gudmundsson 2018](https://www.Gwern.net/doc/reinforcement-learning/imitation-learning/2018-gudmundsson.pdf); [arXiv 2107.12061](https://arxiv.org/pdf/2107.12061); [arXiv 2008.12937](https://arxiv.org/pdf/2008.12937)
- [M][ACADEMIC][SEARCH] Earlier GAN-based match-3 generators only checked that levels were not "unstartable" or corrupt. A 2024 paper adds automated validation. — [arXiv 2409.06349](https://arxiv.org/pdf/2409.06349)
- [M][PRIOR] Industry figures on difficulty spread and testing:
  - In EA's match-3 work, one level's random seeds ranged from a 0.75 to a 0.15 win rate.
  - Rovio uses deep-RL bots to predict human performance on new Dream Blast levels.
  - Playrix: "All levels are handmade", with playtester calibration.

  — [industry_practice.md](file:///home/user/BRO-YOU-RE-COOKED./research_notes/Progressive%20difficulty%20in%20puzzle%20games/industry_practice.md)

**Block puzzle (1010! / Block Blast) and 2048**
- [M][SEARCH] Walsh cites Demaine, Hohenberger & Liben-Nowell, "Tetris is hard, even to approximate" (COCOON 2003). I did not read it directly. — [arXiv 1403.1911 references](https://arxiv.org/pdf/1403.1911)
- [M][CODE] Block Blast solvers exist: rshk941/block-blast-solver ("RL (exhaustive search + value network)", Sep 2026, 8★) and tommyothen/BlockBlastML (PyTorch, archived). — [rshk941](https://github.com/rshk941/block-blast-solver); [BlockBlastML](https://github.com/tommyothen/BlockBlastML)
- [H][CODE] nneonneo/2048-ai (MIT) uses expectimax with a bitboard, searching "upwards of 10 million moves per second". — [README](https://github.com/nneonneo/2048-ai)

**Word puzzles**
- [H][ACADEMIC][SEARCH] Wordle:
  - "An Exact Solution to Wordle" (Operations Research) gives a certified optimal policy: start with SALET, average **3.421** guesses, every word in at most 5.
  - Lokshtanov & Subercaseaux proved Wordle **NP-hard** (FUN 2022).
  - A later paper shows finding a winning strategy is NP-complete.

  — [Operations Research](https://pubsonline.informs.org/doi/fpi/10.1287/opre.2022.0434); [Dagstuhl FUN 2022](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.FUN.2022.19); [arXiv 2204.04104](https://arxiv.org/pdf/2204.04104)
- No source was found on crossword or word-search generator quality for casual games. See Gaps.

**Physics puzzles (Cut the Rope, Angry Birds, draw-to-save, pin-pull)**
- [H][ACADEMIC][SEARCH] Ropossum (Shaker, Shaker & Togelius, AIIDE 2013) is a Cut the Rope tool that combines a physics engine, evolution (grammatical evolution) and a reasoning agent to check playability.
  - The follow-up says the earlier approach "did not strictly guarantee that they were solvable". It added a Prolog agent that prunes moves so a depth-first search becomes feasible.
  - A literature review notes "no way to influence difficulty" in the generated levels.

  — [Ropossum](https://ojs.aaai.org/index.php/AIIDE/article/view/12611); [Evolving playable content for CTR](https://ojs.aaai.org/index.php/AIIDE/article/view/12690)
- [H][ACADEMIC][SEARCH] Angry Birds (Stephenson & Renz, CIG 2016, AIIDE 2016, TOG 2019):
  - The core problem was **structural stability**.
  - Difficulty estimation and solvability checks were added only in the later version.
  - A 2025 AIIDE paper exists solely to **repair unstable levels** that existing generators produce.

  — [CIG16](https://users.cecs.anu.edu.au/~jrenz/papers/stephenson-renz-cig16.pdf); [TOG19](https://users.cecs.anu.edu.au/~jrenz/papers/stephenson-et-al-tog19.pdf); [AIIDE 2025](https://cspages.ucalgary.ca/~richard.zhao1/publications/2025aiide-stabilizing_angry_birds_levels.pdf)
- [H][REPO] This project (a draw-a-line physics rescue puzzle) has measured the same problem first-hand:
  - Its generator cleared the fair funnel for 61 of 120 candidates, against about 1 in 4 for levels designed by hand. All 61 had no machine in them and repeated verbs already shipped.
  - Two machine archetypes gave **0 keepers in 40** (tilt) and **5 in 40**. The 5 were all near-identical to an existing level.
  - Level A14 "passed at 1.6% breadth and was a fraud": deleting its rock changed the outcome by 25 ms.
  - "Two unplayable builds shipped while every gate reported green."
  - A solver-certified win with 5u clearance **lost in the browser**, because a hand-redrawn stroke is never bit-identical.
  - The project's conclusion: "THE GATES MEASURE FAIR. THEY CANNOT MEASURE MEANINGFUL".

  — [CLAUDE.md](file:///home/user/BRO-YOU-RE-COOKED./CLAUDE.md)
- [L] No public pin-pull generator or solver was found.

**Surveys**
- [H][ACADEMIC][SEARCH] De Kegel & Haahr, "Procedural Puzzle Generation: A Survey" (IEEE Transactions on Games 12(1), 2020, pp. 21–40), reviews 32 methods across 11 puzzle categories. Open-access copies are at TCD TARA. — [TARA](https://www.tara.tcd.ie/items/58270d70-f98a-462e-bdf3-5a21672dd3ba)
- [M][SEARCH] Kendall, Parkes & Spoerer, "A Survey of NP-Complete Puzzles" (ICGA Journal 31(1):13–34, 2008). Only the abstract was seen. — [IOS Press](https://content.iospress.com/articles/icga-journal/icg31103)

### Inferences
**Comparison matrix (my synthesis of Q1–Q3; ratings are judgements, not measurements).**

Column meanings:
- **Commercial:** evidence of success, strongest first, with the platform it was seen on.
- **Solver:** whether an exact solver exists and how fast it is.
- **Difficulty measure:** what exact number is available.
- **Generator / code:** published generators and their licences.
- **Physics / reflex / art:** dependence on any of these.
- **Score:** AI repeatability, from A (an agent can generate, verify and grade many levels unattended) to D (it cannot).

| Genre | Commercial evidence | Exact solver | Exact difficulty measure | Published generator / code | Physics / reflex / art | Score |
|---|---|---|---|---|---|---|
| **Water / ball sort** | Mobile: Sort is a growth subgenre (Naavik); Magic Sort US top 5. Playables: many titles, individually small (Hexa Sort ~0.7M). | Yes: BFS/A*, optimal in under 1 s (Kociemba). NP-complete in general. | Minimum moves; number of dead-end states; empty-bin slack (Ito et al.) | Random plus solver filter is trivial; Sortaballs ships 1,000+ solver-benchmarked levels. | None; art is flat colours. | **A** |
| **Nuts & bolts / screw, hexa, goods / queue sort** | Mobile 2025 growth (Naavik; Gamigion: queue sort 52% D1). Playables: Screw Jam, Goods Puzzle near the top of Brain & Puzzle. | Stack-based nut sort is ball sort (my inference). Hexa / queue / goods variants: state search is feasible if fully visible. | Minimum moves; tray or slot slack | None public | 3D look expected; some screw variants use falling plates (light physics). | **A–B** |
| **Rush Hour / Unblock Me** | Mobile classic; parking titles ~21–23M on Playables | Yes: BFS. PSPACE-complete in general. The whole 6×6 game is enumerated (Fogleman). | Minimum moves (max 51 moves / 93 steps); size of the state cluster | Fogleman (MIT) | None | **A** |
| **Parking jam / car-out / arrow tap-away** | Arrows +130% MoM (Dec 2025); Color Block Jam ~43M YTD; Parking Jam ~21M on Playables; 8+ arrow titles on Playables. | Probably trivial: see the inference below the table. | Depth of the blocking graph; pieces free at start; layout size | None public, but simple | None; art light | **A** (difficulty ceiling is low) |
| **Flow / Numberlink** | Flow Line Draw / Hex / Puzzles on Playables; mobile classic (not measured here) | Yes: SAT or heuristic search. Ahle solves 40×40. | Solver backtracks / forced-move depth. Uniqueness needs a separate counter. | Ahle (AGPL-3.0); Zucker (CC BY-NC, unusable commercially) | None | **A** (mind the licences) |
| **Nonogram** | Weak on Playables (no titles found) | Yes: line solver plus backtracking | Line-solver step count (Batenburg & Kosters); "simple" vs not | Tatham Pattern (MIT); Izaron image-to-puzzle | Picture-reveal art is the appeal, so it needs images | **A** for logic, **B** for content |
| **Minesweeper / sudoku / logic grids** | Small on Playables (1 title each); the broader web market was not measured | Yes | Hardest technique required (Tatham "Difficulty") | Tatham's 40 puzzles (MIT), no-guess Mines | None | **A** |
| **Sokoban-likes** | Weak (no Playables titles found) | Yes, but PSPACE-complete; large levels can be slow | Pushes, box lines; learned difficulty (Kartal 2016) | Several; difficulty control is weak (AlliBalliBaba's admission) | None | **A–B** |
| **Tile match (triple) / mahjong** | 23 tile/mahjong/match titles on Playables; mobile staple | Yes if every tile is known (DFS); PSPACE / NP status unverified | Tray-slot slack; branching at each step; dead ends | None public; reverse construction is the obvious method (inference) | Tile art sets needed | **A–B** |
| **Block puzzle (1010 / Block Blast)** | Mobile #1 downloads 2025–26 | Per-turn exhaustive search is easy; the game is NP-hard and random | Survival distribution under the piece generator, not an exact number | Solvers exist; endless mode needs no levels | None | **B** (no levels to make; tuning is the RNG) |
| **Match-3** | Mobile mega-genre, but Match Swap revenue flat (Naavik) | NP-hard even deterministic; random refills | Pass rate from agent simulation (MCTS / CNN / DRL) | Research GANs, validity weak; industry is hand-made plus bots | Heavy art, blockers, boosters, meta | **C** |
| **Merge (meta) / 2048 / Suika** | 17 merge + 6 2048 titles on Playables | 2048: expectimax AI. Merge-meta: economy, not puzzles. | None useful (score, or economy pacing) | n/a | Suika is a physics jar; merge-meta is art-heavy | **C** |
| **Word (crossword, wordle-like, search)** | 10 word titles on Playables; mobile Word declining (Naavik) | Wordle exactly solved (3.421). Crossword filling is constraint satisfaction. | Wordle: guesses under the optimal policy; crossword: fill constraints | Not researched here | Needs a curated dictionary, clues, localisation; no art | **B** |
| **Draw-to-save / physics line puzzles** | **Strongest puzzle demand on Playables** (Thief Puzzle 92M, Draw & Escape top mechanic) | Simulation only; continuous stroke space | Sampled breadth, hand-robustness (this repo); no exact measure | Ropossum, Angry Birds generators: stability first, no difficulty control | Physics tuning dominant; meaning not machine-checkable | **C–D** |
| **Pin-pull** | Exists on mobile (not measured); none on Playables found | Simulation (fluids, gravity) | None found | None found | Physics | **C–D** |
| **Idle / clicker** | 4 titles on Playables | No puzzle to solve | Economy curves (not researched) | n/a | Art and numbers balance | **C** |
| **Runner / hypercasual action** | **Top Playables plays** (Tall Man Run 110M etc.); Poki's most-popular list | No; outcome depends on human reflex | None exact; playtest | n/a | Reflex timing plus heavy 3D art and animation | **D** |
| **Troll platformer (Level Devil)** | Poki: >3M upvotes | Reachability can be simulated | The surprise is the content, and it cannot be measured | None | Timing plus authored tricks | **D** |

**Arrow / tap-away inference (no source found).** If a piece leaves whenever its exit path is clear, and removing a piece never blocks another, then a level is solvable exactly when the "blocks" relation has no cycle. Removing any free piece is always safe. A generator only has to place pieces in reverse removal order. Difficulty is therefore shallow: the depth of the blocking graph, plus any penalty for wrong taps. The same reasoning probably applies to car-out parking jams, unlike sliding Rush Hour.

**Further inferences**
- The genres that are both **commercially proven in 2025–26** and **A-grade computable** are sort (water/ball/nut), the jam/escape family (parking, arrows, Color Block Jam-style) and tile-match. Flow, nonogram and logic grids are just as computable, but their commercial evidence on Playables is weaker.
- A low worst-case complexity class does not buy much: Rush Hour is PSPACE-complete, and its full 6×6 space is still enumerated. What matters for an agent is a **fast exact solver at casual sizes**, plus a **difficulty number that tracks human experience**. For the solver-based genres the usual numbers are minimum moves, line-solver steps, technique depth and dead-end count. Only Sokoban (Kartal 2016) and match-3 (King) have published evidence that the number correlates with human-perceived difficulty or pass rate.
- **Licences matter for reuse.** Fogleman's Rush Hour code and nneonneo's 2048 AI are MIT, Tatham's collection is MIT, Ahle's numberlink is AGPL-3.0, and Zucker's flow solver is non-commercial. These solvers are small enough that an agent could reimplement them rather than import them.

### Gaps
- No paper or code was found for arrow/tap-away, car-out parking jam, screw/hexa/goods sort, pin-pull or triple-tile generation. The matrix rows for these rest on my inference from their rules.
- Mahjong solitaire's complexity class is unresolved: PSPACE per Wikipedia, NP-complete per other claims. The primary paper was not read.
- Plain Numberlink's complexity was not confirmed.
- Fogleman's database size is unverified: about 1.5M per FlowingData, and I could not open the article.
- No study was found that validates minimum-moves (or any exact measure) against **human** difficulty for sort, jam or arrow games.
- Crossword and word-search generator quality was not researched.

---

## Q3. Which genres need physics tuning, timing/reflex tuning or heavy art, making AI generation and difficulty control unreliable?

### Takeaway
Physics, reflex and art are the three things that break dependable generation:
- **Physics** (draw-to-save, pin-pull, Cut the Rope-likes, Angry Birds-likes, Suika merge) makes solvability a simulation question that is sensitive to tiny input changes. Research generators spend most of their effort on stability or playability and cannot steer difficulty.
- **Reflex timing** (runners, hypercasual action, troll platformers) puts difficulty in human motor skill, which no solver measures.
- **Heavy art and meta** (match-3, merge-meta, 3D hypercasual) are a production bottleneck rather than a verification one.

Deterministic grid puzzles avoid all three.

### Cited Findings
- [H][ACADEMIC][SEARCH] Cut the Rope generation needed a physics engine plus evolution plus a reasoning agent. Early levels were "not strictly guarantee[d]" solvable, and there was "no way to influence difficulty". — [Ropossum](https://ojs.aaai.org/index.php/AIIDE/article/view/12611); [CTR follow-up](https://ojs.aaai.org/index.php/AIIDE/article/view/12690)
- [H][ACADEMIC][SEARCH] For Angry Birds generation, **stability** was the main obstacle. In 2025 researchers were still publishing a repair method for unstable generated levels. — [Stephenson & Renz CIG16](https://users.cecs.anu.edu.au/~jrenz/papers/stephenson-renz-cig16.pdf); [AIIDE 2025](https://cspages.ucalgary.ca/~richard.zhao1/publications/2025aiide-stabilizing_angry_birds_levels.pdf)
- [H][REPO] In this project's physics game, every automated gate is green and levels can still be wrong:
  - Bodies are clamped at MAX_SPEED 900 so they do not tunnel through strokes.
  - `frictionAir` caps fall speed.
  - A win with 5u clearance won in the solver and lost in the browser.
  - "A green suite means a level is solvable, fair and stable. It says nothing about whether a person knows what it wants from them."
  - Generated candidates were "twins" of earlier levels (24 of 24 in one contact sheet).

  — [CLAUDE.md](file:///home/user/BRO-YOU-RE-COOKED./CLAUDE.md)
- [H][ACADEMIC][SEARCH] Match-3 difficulty needs many simulated plays with agents trained to act like humans (MCTS, CNN, DRL), because outcomes are random and agent skill differs from human skill. — [Gudmundsson 2018](https://www.Gwern.net/doc/reinforcement-learning/imitation-learning/2018-gudmundsson.pdf); [arXiv 2107.12061](https://arxiv.org/pdf/2107.12061)
- [M][PRIOR] Playrix states "All levels are handmade" with "Careful calibration with playtesting". Rovio uses deep-RL bots for balancing. — [industry_practice.md](file:///home/user/BRO-YOU-RE-COOKED./research_notes/Progressive%20difficulty%20in%20puzzle%20games/industry_practice.md)
- [M][SEARCH] The top Playables titles by plays are 3D action and runner games (Tall Man Run, Build a Queen, Stealth Master, Going Balls) from established studios. — [TubeGames Best](https://playables.games/best/)
- [L][SEARCH] Level Devil's appeal is that it "tricks you at every turn": traps, disappearing platforms, flipped controls. That is authored surprise, not search. — [Poki: Level Devil](https://poki.com/en/g/level-devil); [mograph](https://mograph.com/renders/level-devil-the-platformer-that-tricks-you-at-every-turn/)
- [M][CODE] Suika Game is listed among AI-built games as a Matter.js physics merge game. It shows that physics merge games can be built by agents. It says nothing about whether their difficulty can be controlled. — [awesome-ai-built-games](https://github.com/lappemic/awesome-ai-built-games)

### Inferences
- **Two tests separate the reliable genres from the unreliable ones.**
  - Does the outcome depend only on the player's discrete choices, not on timing or float precision?
  - Can a computer state the whole game state?

  If both answers are yes, a solver gives an exact verdict and an exact difficulty number. Physics games fail the first test: this repo shows a hand-redrawn stroke flips the outcome. Runner and troll games fail it too, on timing.
- **Art cost is the second axis, and it is separable.** Sort, jam, arrow, flow and logic grids can be drawn with flat geometric styling. Nonograms need pictures, tile-match needs tile sets, and match-3 and merge-meta need extensive themed art. 3D hypercasual needs models and animation.
- The most commercially proven Playables puzzle type, draw-input, is the one this repo shows is least automatable. Its biggest hits are themselves non-physics in places: DOP 4 is shape recognition, and Thief Puzzle is a path for an arm (from PRIOR notes). So "draw" is not one genre for computability purposes.

### Gaps
- No quantitative study was found comparing generator failure rates between physics and grid puzzle genres. The contrast rests on separate papers plus this repo's own measurements.
- The art production cost for each genre was not measured.

---

## Q4. Evidence that games built by AI coding agents get published and earn plays (Playgama Sandbox, Rosebud, others)

### Takeaway
**Playgama** launched tools for AI agents around 14 Oct 2026: an MCP server, a "Sandbox" discovery channel and Bridge SDK telemetry. They let Claude Code or Codex publish an HTML5 game, get a public link, receive its first ~100 real players free, and graduate in steps (200 → 500 → 1,000 players) on "strong metrics". Ads switch on only after an unpublished session threshold.

Self-reported Playgama figures say 1,600+ AI-built games and 420,000 launches, with Claude-built games averaging about 6–6.6 minutes per play. These are promotional. No genre breakdown and no revenue per game were published.

Elsewhere, AI-built games are mostly action, simulation and racing showcases. A few puzzle games already use solvers (Sortaballs) or autonomous design (daily logic puzzles). The best-known earnings story, fly.pieter.com, is self-reported and fame-driven.

### Cited Findings
**Playgama Sandbox and MCP (launched October 2026)**
- [M][SEARCH] Playgama launched the MCP, the Sandbox and the Bridge SDK update in mid-October 2026; one source gives 14 Oct 2026.
  - The Sandbox is "a discovery channel for AI-built games".
  - Games that attract players "can move to playgama.com" for wider distribution.
  - Playgama cites "450 million monthly players" [PROMO].

  Coverage: GamesBeat, PocketGamer.biz, 80.lv and Games Press, mostly drawn from Playgama's own press release. — [GamesBeat](https://gamesbeat.com/playgama-launches-a-suite-of-tools-that-lets-ai-agents-analyze-refine-and-update-games-on-their-own/); [PocketGamer.biz](https://www.pocketgamer.biz/playgama-launches-tools-for-ai-agents-to-publish-and-improve-games/); [80.lv](https://80.lv/articles/playgama-sandbox-creates-a-faster-route-from-prototype-to-players); [Games Press](https://www.gamespress.com/pl/Playgama-closes-the-iteration-loop-for-AI-built-games-agents-now-see-p); [Playgama MCP](https://playgama.com/mcp/)
- [L][PROMO][SEARCH] Graduation, per a founder's LinkedIn post:
  - "Every uploaded game gets its first ~100 real players for free. If the metrics are strong, it unlocks access to 200, 500, and then 1,000 players."
  - The metrics tracked are playtime, performance and retention, plus custom events.
  - **No numeric threshold has been published.**
  - Games that do not advance can buy more test players.

  — [Dmitry Kachmar, LinkedIn](https://www.linkedin.com/in/dmitry-kachmar-84392725/); [Playgama MCP](https://playgama.com/mcp/)
- [M][CODE] How the Sandbox works, from Playgama's own plugin repo and a third-party MCP wrapper repo:
  - `publish_sandbox` "makes a build playable by anyone with the link, without moderation".
  - A publish is refused without the Bridge SDK (at least v2.2.0), three covers (1080×1920 or 1920×1080) and a complete form.
  - `start_sandbox_traffic` starts a DSP campaign; "share the game first and the boost is free".
  - Ads (rewarded, interstitial, banner) switch on "once the game clears the session threshold (access by request)".
  - "Payouts start at 100 USD".
  - Agents read aggregated telemetry; playtime, retention and revenue reports stay in the dashboard.

  — [Playgama/playgama-plugins](https://github.com/Playgama/playgama-plugins); [zhukovRoman/developer-cabinet-mcp](https://github.com/zhukovRoman/developer-cabinet-mcp)
- [L][PROMO][SEARCH] The Playgama founder's "AI Game Index":
  - 1,600+ games and 420,000 launches.
  - Average time per play: about 6.6 minutes for games built in the Claude app, 6.4 for Claude Code, 6.0 for Codex. A correction says the 6.8-minute figure is a *median*.
  - Codex games lead on likes, at 69 per 1,000 plays.
  - Share of games built through the publish flow: Anthropic 68%, OpenAI 30%; Claude Opus alone 47%.
  - No genre breakdown was found.

  — [LinkedIn via search](https://www.linkedin.com/in/dmitry-kachmar-84392725/); [PocketGamer.biz](https://www.pocketgamer.biz/playgama-launches-tools-for-ai-agents-to-publish-and-improve-games/)
- [L] **Flag.** The search tool reported that some Playgama pages mention model names it could not confirm ("GPT-6 Astra", "Claude Fable"). Treat Playgama's model-attribution figures as unverified. — [search summary of Playgama pages](https://playgama.com/blog/main/built-a-game-with-ai-get-your-first-players-and-ad-revenue-with-playgama-mcp/)

**Other AI-built-game evidence**
- [M][CODE] The awesome-ai-built-games list ("AI wrote most of each game's code") had 86 games across six headings when read: Simulation & Strategy 20, Action & Shooters 15, Puzzle, Word & Trivia 15, Racing & Vehicles 13, Adventure 13, Arcade 10. Puzzle examples:
  - **Sortaballs**: 1,000+ ball-sort levels "each benchmarked against an optimal solver".
  - **Ink Side Down** and **One Step Late**: daily logic puzzles "designed and coded end-to-end by an autonomous AI agent" (Claude Code).
  - **Suika Game**: Cursor plus Claude, Matter.js.

  It also lists Vibe Jam 2026 awards: WenWare took "3rd place and Most Played"; BeetleJump took "Rage-Quit award". The list gives no play counts. — [lappemic/awesome-ai-built-games](https://github.com/lappemic/awesome-ai-built-games)
- [L][PROMO][SEARCH] fly.pieter.com (Pieter Levels, built with Cursor and Claude 3.7 Sonnet, launched 28 Feb 2025):
  - Self-reported $0 → $1M ARR in 17 days and $87K MRR, from in-game ad slots, branded blimps and a $29.99 F-16.
  - Other outlets report about $5K/month from ads.
  - A DEV piece says the revenue "went to zero".
  - Coverage credits his audience reach, including praise from Elon Musk.

  — [404 Media](https://404media.co/this-game-created-by-ai-vibe-coding-makes-50-000-a-month-yours-probably-wont); [vgtimes](https://vgtimes.com/tech-and-hardware/122582-dutch-startup-founder-creates-game-using-ai-in-180-minutes-and-earns-87000-in-one-month.html); [avgeekery](https://avgeekery.com/new-flight-simulator-made-with-ai-earns-creator-5000-per-month/); [DEV](https://dev.to/promptway/he-built-a-flight-simulator-in-three-hours-and-hit-1m-a-year-in-17-days-then-it-went-to-zero-1b1l)
- [M][PRIOR] YouTube's own **Playables Builder** (Gemini 3, closed beta announced 16 Dec 2025, for approved creators):
  - Creative Bloq called the reception "tepid", with games found "repetitive and uninspiring", and counted six AI games live.
  - Named titles: BUCHA BLOCKS (Sambucha) and DIRT RUNNER (Mogswamp).

  — [playables_platform.md](file:///home/user/BRO-YOU-RE-COOKED./research_notes/Free%20game%20tools%20and%20Playables%20rivals/playables_platform.md); [Creative Bloq](https://www.creativebloq.com/3d/video-game-design/you-can-now-play-ai-generated-games-in-youtube)
- Rosebud AI: no play-count or earnings data was found in this session.

### Inferences
- The Playgama path is real and agent-native: MCP publish, a link without moderation, about 100 free players, telemetry back to the agent. It **rewards playtime and retention**, which favours genres with many short levels and measurable progression (sort, jam, logic) over one-off showcase games.
- The reported ~6 minutes per play is below CrazyGames' "10+ minutes" bar for successful titles (Q5). It is also self-reported. An AI-built game should not be assumed to clear portal thresholds without a deep level supply, which is exactly what solver-generated genres provide.
- Most AI-built games in the curated list are action and simulation showcases. Solver-backed level generation (Sortaballs) is rare, so it is a possible differentiator rather than the norm (inference from one list).

### Gaps
- There is no published Sandbox graduation threshold, and no data on how many AI-built games graduated to playgama.com or reached YouTube Playables.
- No genre breakdown of the AI Game Index was found.
- No revenue per AI-built game from any portal was found.
- No Rosebud data was found.
- No data was found on AI-built games on Poki or CrazyGames, or on those portals' policies toward them.

---

## Q5. What do publishers and benchmarks say about which casual and hypercasual puzzle genres retain players best (D1, session length)?

### Takeaway
Across mobile, GameAnalytics finds **puzzle, board and card games retain best over the medium and long term**, while arcade and hypercasual lead D1 and then decay:
- **Median D1 is about 22%**, with the top quartile at 25–27% on Android and 31–33% on iOS.
- **Median D7 is about 3.4–3.9%.**
- **Sessions run a median 5–6 minutes, with the top quartile at 8–9 minutes.**

**Sort games, especially "queue" and conveyor sort, show unusually strong retention.** One analyst estimates 52% D1 / 27% D7 / 14% D30 install-weighted.

Portal bars: CrazyGames says successful titles "often see 10+ minutes" of average playtime. Voodoo's older bars were 45–55% D1, with a higher D7 bar for puzzle games.

### Cited Findings
- [M][1P vendor data][SEARCH/PRIOR] GameAnalytics 2025 benchmarks (11,600 games, 1.48B MAU):
  - D1: median about 22%; bottom quartile 10–11.5%; top quartile 25–27% (Android) and 31–33% (iOS).
  - D7: median about 3.4–3.9%.
  - 2024 sessions: median 5–6 minutes; top quartile 8–9 minutes.
  - "Board, Card and Puzzle" show the highest medium- and long-term retention. Arcade leads D1 but is weak long-term.

  — [GameAnalytics 2025](https://www.gameanalytics.com/reports/2025-mobile-gaming-benchmarks); [PDF mirror](https://files.gameindustrylibrary.com/documents/mobile-gaming-benchmarks-2025.pdf); [industry_practice.md](file:///home/user/BRO-YOU-RE-COOKED./research_notes/Progressive%20difficulty%20in%20puzzle%20games/industry_practice.md)
- [M][ANALYST][SEARCH] Gamigion, using Sensor Tower and AppMagic estimates for US Android:
  - It gives install-weighted D1/D7/D30 for four top Sort subgenres.
  - Queue sort sits at **52% D1 / 27% D7 / 14% D30**, pulled up by conveyor-style outliers (Pixel Flow, Sand Loop, Marble Sort, Yarn Loop) that lift D30 above 10%.
  - The other three subgenres' numbers were not visible.

  — [Gamigion 2026](https://www.gamigion.com/retention-benchmark-for-sort-puzzle-games-in-2026/)
- [M][1P][PRIOR] CrazyGames:
  - Successful titles "often see 10+ minutes of average play time".
  - It measures **conversion**, the share of players still playing after one minute.
  - Basic Launch runs 7–21 days with ads off. Full Launch depends on playtime, conversion and retention benchmarked against other games.

  — [CrazyGames docs](https://docs.crazygames.com/resources/basic-launch-metrics/)
- [M][1P-hosted][PRIOR] On Poki, a developer spotlight: "If fewer than 50% of players pass the first minute, the onboarding isn't good enough or the game isn't fun." — [Poki blog: Blumgi](https://poki.com/blog/developer-spotlight-blumgi-games-part-1)
- [L][1P][STALE ~2020][SEARCH] Voodoo:
  - Earlier minimum bars were **55% D1 and 22% D7**.
  - A later, looser set was **45% D1, 15% D7 (20% for puzzle titles) and 10% D30**.
  - CPI targets were "below 20 cents" at launch.
  - Voodoo itself later called hard thresholds short-sighted.
  - Hybrid-casual is expected to show "much higher retention and overall playtime" at a higher CPI.

  — [GameAnalytics: How Voodoo diversified KPIs](https://www.gameanalytics.com/blog/how-voodoo-diversified-and-lowered-game-product-kpis); [PocketGamer.biz: Corentin Selz](https://www.pocketgamer.biz/corentin-selz-voodoo-from-hypercasual-to-hybrid-casual); [Voodoo news](https://voodoo.io/news/voodoo-s-secret-sauce-from-0-to-250m-hybridcasual-revenue-in-3-years)
- [L][VENDOR][PRIOR] TapNation: "90% of players don't get to experience up to 90% of a game's content". Releasing late-game content earlier improved early retention. — [TapNation](https://wnk.tap-nation.io/?p=706)
- [L][VENDOR][PRIOR] Playables publishers say that until mid-July 2026 developers saw only total plays per game. Age, geography and gender filters came then; there is no retention curve. — [playables_platform.md](file:///home/user/BRO-YOU-RE-COOKED./research_notes/Free%20game%20tools%20and%20Playables%20rivals/playables_platform.md)
- [L][SEARCH] Third-party pages quote casual or puzzle D1 of 28–32% and D7 of 9–12%, which trace to **AppsFlyer data from 2022**, and hypercasual D1 of 25–35% with **no source**. Treat both as unverified. — [appagent](https://appagent.com/blog/mobile-game-retention-benchmarks/); [gamegrowthadvisor](https://gamegrowthadvisor.com/blog/2026-03-17-mobile-game-kpis-benchmarks-2026/)

### Inferences
- Retention evidence and computability point the same way. **Puzzle genres retain best long-term, and within puzzles the sort and queue/conveyor variants are the 2026 retention outliers.** Those are among the most solver-friendly genres in Q2.
- Hypercasual action wins D1 and cumulative plays on Playables but decays. Its numbers come from scale and studio UA, not from level supply, which is the thing an AI agent can cheaply provide.
- Portal bars set the content requirement. At a typical casual level length of 30–60 seconds (my assumption), CrazyGames' "10+ minutes" means about 10–20 levels per session. A daily or returning player needs hundreds of levels, which is exactly where solver-verified generation pays off.

### Gaps
- No Playables-, Poki- or Playgama-published retention by genre. YouTube exposes only plays.
- GameAnalytics' genre-level puzzle and hypercasual tables were not readable; only the overall medians were.
- Gamigion's other three sort subgenres were not visible.
- Voodoo figures are around 2020 and not dated precisely.
- No D1 figure was found for screw, arrow, parking-jam, nonogram or flow games specifically.
