# Industry practice: how casual and mobile puzzle games set and tune level difficulty

**How these notes were gathered (read first).** Researched 2026-10-25. Every page fetch failed from this environment: WebFetch returned DNS errors, and curl through the proxy got `403 CONNECT tunnel failed` for arxiv.org, mobilegamer.biz, gamigion.com, naavik.co, deconstructoroffun.com, gamedeveloper.com, rovio.com, developers.google.com, docs.crazygames.com, developers.poki.com, media.gdcvault.com, medium.com and web.archive.org. Only github.com answered. **So every finding below comes from search-engine summaries of the cited page, not from reading the page itself.** Confidence is one notch lower than usual throughout. Where a number appears in only one summary, I say so. Labels used: **[1P]** a first-party studio or platform statement (a talk, paper, blog or interview by staff); **[ANALYST]** a third-party analyst or fan breakdown; **[VENDOR]** a vendor or consultancy blog with something to sell; **[PLAYER]** store reviews or forums. The age of each source is given where the search showed it.

## 1. Which per-level metrics do studios use, and how are they defined?

### Takeaway
The working metrics are **pass rate** (passes per attempt, quoted by King per 100 attempts) and its inverse, **average attempts per success**. Next to them sit **level churn** (share of players who quit after trying a level, e.g. gone 7 days), King's paired **"time to pass" / "time to abandon"**, and an automatically assigned **hard / super-hard label**. Designers think in **bands or classes** of these numbers, not exact targets.

### Cited Findings
- **[1P] King, 2025.** King's main metric is **pass rate: "how many times a player passes a level out of every 100 attempts"**. It also tracks how often a board gets **reshuffled**, plus "intangible" qualities such as whether a level is fun. AI does a first pass when King updates and reconfigures its **18,000+ levels**, which it says would otherwise be "extremely difficult". — AP story, May 2025, syndicated via [Yahoo Tech](https://tech.yahoo.com/gaming/articles/candy-crush-uses-ai-keep-112542105.html), [SFGate](https://www.sfgate.com/entertainment/article/how-candy-crush-uses-ai-to-keep-players-coming-20321525.php) and [TechXplore](https://techxplore.com/news/2025-05-ai-candy-players-difficult-puzzles.html)
- **[1P] King, GDC 2024**, "Sugary Statistics", Jan Wedekind (head of central insights) and Xavier Guardiola (senior director of data science). King judges a level with a **"time to abandon"** figure paired with a **"time to pass"** figure. Quote: *"'Time to abandon' tells us something about intrinsic motivation and the engagement of a level… what you find is that hard levels can be fun."* King also builds a **player-skill metric** from wins, losses and attempts. Per one summary, the talk said **harder levels should be shorter**, and that players engaged least with the more skill-based ("puzzly") levels. Summary only; the article's age (~922 days) fits GDC 2024. — [mobilegamer.biz](https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/)
- **[1P, academic, Rovio data]** In Roohi et al. (Aalto University with Rovio), **difficulty = pass rate**, "the probability of players completing a level". **Engagement = level churn rate**, "the portion of players quitting the game or leaving it for an extended duration after trying a level". Churn is defined as **not playing for 7 days**. Dataset: **168 levels, 95,266 players of Angry Birds Dream Blast**. — [arXiv 2107.12061 (CHI PLAY 2021)](https://arxiv.org/html/2107.12061v1); [arXiv 2008.12937 (2020)](https://arxiv.org/pdf/2008.12937)
- **[1P, academic, Tactile data]** The Lily's Garden papers define level difficulty as **"the average number of attempts that players require to complete a level"**. Win probability is the **completion rate**. They note that **"level designers typically work with ranges of the completion rate rather than point estimates"**, sorting levels into classes such as "easy" and "very hard". — [arXiv 2209.13495](https://arxiv.org/pdf/2209.13495); [arXiv 2107.03305](https://arxiv.org/html/2107.03305)
- **[ANALYST]** A widely copied DataCamp exercise on Candy Crush data computes **attempts per success = total attempts / total successes** per level, and uses win rate (successes / attempts) as the difficulty proxy. Each attempt is modelled as a Bernoulli trial. — [Medium, DataCamp project](https://medium.com/@boyangchen02/level-difficulty-in-candy-crush-saga-datacamp-data-science-project-28b979c402d7); [RPubs 2018](https://rstudio-pubs-static.s3.amazonaws.com/365042_2896d93686224b70a96ea517b64e2c60.html)
- **[ANALYST]** A Gamigion article built on Playliner research recommends tuning by **attempts rather than win rate**: easy is about **1–3 attempts** and hard about **20–35 attempts**. It also recommends visible tiers (**Easy / Hard / Super Hard**). About 656 days old. — [Gamigion](https://www.gamigion.com/how-to-design-difficulty-in-puzzle-games/)
- **[1P, platform behaviour; source is a fan wiki]** Candy Crush's in-game "super hard" label was tested in **December 2016** and released in **February 2017**. Later labels are "nightmarishly hard" and "legendary". A King community reply says labels are **"marked by a script and not manually"**. A fan wiki says **7.39% of levels** are labelled super hard (1,645 levels at that count). Not verified against King. — [Candy Crush wiki: Super Hard Level](https://candycrush.fandom.com/wiki/Super_Hard_Level); [Category](https://candycrush.fandom.com/wiki/Category:Super_hard_levels); [King Community](https://community.king.com/en/candy-crush-saga/discussion/504948/are-my-difficulty-labels-incorrect)
- **[1P]** Two Dots marks hard and ultra-hard levels with **fire icons** on the map nodes. — [Two Dots Help Center](https://dots.helpshift.com/hc/en/3-two-dots/section/10-game-guides/)
- **[1P, Rovio talk]** Rovio's bots record per-level statistics such as **goals cleared** and **moves left**, with pass rate as the difficulty measure. AWS re:Invent 2019. — [AWS slides, GAM301](https://d1.awsstatic.com/events/reinvent/2019/How_Rovio_teaches_Angry_Birds_to_fly_in_the_cloud_using_ML_GAM301.pdf)
- **[1P, Rovio job ads]** Rovio's level-designer listings (Angry Birds Friends, Dream Blast) describe ongoing work on **level performance metrics, A/B tests and content curation**. — [gamejobs.co](https://gamejobs.co/Expert-Level-Designer-ABF-at-Rovio)
- **[1P platform]** CrazyGames measures **average play time** (mean time per session) and **conversion to gameplay** (the share of players still playing one minute after starting), plus retention. Each is benchmarked against other games on the portal. — [CrazyGames docs: Basic Launch Guide](https://docs.crazygames.com/resources/basic-launch-metrics/)

### Inferences
- Pass rate per attempt (p) and attempts per success are near-inverses: if each attempt is an independent trial, mean attempts ≈ 1/p. So 80% ≈ 1.25 attempts, 25–40% ≈ 2.5–4, 3–5% ≈ 20–33, and 2% = 50. This project's TRIES = 1/(breadth × hand rate) is the same quantity, estimated from simulated strokes instead of players.
- King's "time to abandon" is the metric this project lacks entirely. It separates "hard and still engaging" from "hard and quit", which a pass rate cannot. The nearest proxy available before launch is whether a failure explains itself, which this project already checks by filming losses.
- Every studio that publishes a definition treats difficulty as a **per-attempt** rate measured on real players. None found treats "can it be solved" as the metric. That is why King and Rovio build bots that imitate humans rather than optimal solvers (section 3).

### Gaps
- No public definition was found for "booster/hint usage per level" as a difficulty signal, beyond King's reshuffle count and Royal Match's out-of-moves purchase (section 2).
- Could not read how King defines "time to abandon" numerically (wall-clock time, sessions, or attempts until quitting). The article was unreachable.
- No studio publishes "time per level" targets. The only time guidance found is King's summarised "harder levels should be shorter".

## 2. What target values do studios aim for, and how often do hard levels appear?

### Takeaway
Few target numbers are first-party. The best ones:
- **King designer (via WSJ):** an easy level takes **about 5 attempts**, a very hard one **30+**, and **over 50 gets made easier**.
- **Tactile, Lily's Garden player data:** **about 3.2 attempts per completion on average**, easy levels **1 attempt**, hard ones **7+**, some **30+**.
- **Playrix:** an example target of **80%**.

Hard-level frequency comes from analysts. The consistent pattern is **two hard levels per ten (one "hard", one "super hard")** in Royal Match, with the first hard labels near **level 45** (hard) and **level 59** (super hard). Toon Blast reportedly holds hard levels back until **level 60–100+**.

### Cited Findings
**First-party or near-first-party targets**
- **[1P via press repost] King level designer Damir Buco**, in a Wall Street Journal piece:
  - an **easy level should take about five attempts**;
  - a **very difficult level 30 or more**;
  - **above ~50 attempts he tweaks the level easier**.
  - King also uses **average attempts per level across millions of players** to retune old levels.

  Only a GameFAQs repost of the WSJ article could be reached; the original was not, and its date is unknown (likely 2013–2014). — [GameFAQs repost](https://gamefaqs.gamespot.com/boards/690722-candy-crush-saga/70046682?page=47)
- **[1P, academic, Tactile data]** Lily's Garden (player data 2021-06-01 to 2021-12-01): difficulty **"stabilises at around 3.2 attempts per completion"**. **Easier levels typically take one attempt**, and **more difficult levels "upwards of an average of 7 attempts"**. Some hard levels need **"upwards of 30 attempts or more"**. The dataset covers **4,000 levels** (negative-binomial model of in-level actions). — [arXiv 2401.17436 (2024)](https://arxiv.org/html/2401.17436v1); [arXiv 2107.03305](https://arxiv.org/html/2107.03305)
- **[1P, Playrix lead designer interview, 2019]** Aleksandr Shilyaev, lead game designer on Gardenscapes:
  - designers work from a **projected difficulty curve in a master document**;
  - they tune move count and similar settings to hit a target, **"for example 80%"**;
  - a **dedicated playtester team** plays as typical players would, and its stats adjust each level;
  - the final in-game difficulty **often differs** from the intended value;
  - **consecutive levels can end up with similar difficulty**, which the summary calls **"especially problematic at the 92–95% range"** (the summary does not say what this means).

  Scale given: **16 mechanics across 300 levels at soft launch (2016)**, then **29 mechanics across 1,300 levels** half a year later. Summary only. — [Game World Observer](https://gameworldobserver.com/2019/09/27/playrix-levels-elements-match-3)
- **[1P, EA academic]** In EA's match-3 dynamic-difficulty work, one level's random seeds ranged from a **win rate of 0.75 (easiest seed) to 0.15 (hardest seed)**. Choosing seeds to maximise engagement gave **"up to 9% improvement in player engagement with a neutral impact on monetization"** across multiple EA games. Xue et al., WWW '17 Companion. — [ACM DL](https://dl.acm.org/doi/abs/10.1145/3041021.3054170); [ResearchGate](https://www.researchgate.net/publication/322414816_Dynamic_Difficulty_Adjustment_for_Maximized_Engagement_in_Digital_Games)

**Hard-level frequency and placement (analyst figures)**
- **[ANALYST] Royal Match, first 100 levels (Gamigion):**
  - **hard** levels at **39, 45, 49, 55, 65, 75, 85, 95**;
  - **super hard** levels at **59, 69, 79, 89, 99**;
  - attempts: normal **≈1.2**, hard **≈1.6**;
  - moves shrink from **30–38 (levels 1–20)** to **23–27 (levels 61–100)**.

  Method not visible; the attempt counts look like one analyst's playthrough, not population data. — [Gamigion: Royal Match level design insights](https://www.gamigion.com/royal-match-level-design-insights/)
- **[ANALYST]** Royal Match typically includes **2 hard levels per 10**, a Hard and a Super Hard **every 10 levels**. It **first introduces the labels at level 45 (hard) and 59 (super hard)**. — [Royal Kingdom analysis (Medium)](https://medium.com/@chrisjameswallace/royal-kingdom-the-next-puzzle-hit-from-dream-games-c7395e26b185); [Funconomy](https://www.funconomy.com/post/unpacking-royal-kingdom-s-design)
- **[ANALYST]** Royal Match **bonus levels every 10 levels**, paying 300–450 coins (a later review says 300–700). — summarised from [Medium design deep dive](https://medium.com/@saravanan.gamedesign/design-deep-dive-02-royal-match-948f7af96f04) and [Gamigion playbook](https://www.gamigion.com/royal-match-4b-game-design-playbook/)
- **[ANALYST, Naavik]** Royal Match earns all its revenue through coins, spent on **extra moves and boosters to overcome challenging levels ("near-miss monetization")**. Challenging levels make up **"at best 30%–40% of levels completed by a player"**. — [Naavik deep dive](https://naavik.co/deep-dives/royal-match/)
- **[ANALYST, dated ~2020]** GameRefinery: in match-3, **hard levels generally don't arrive until after ~60 levels**. **Toon Blast** reportedly holds hard levels **until 100+**, though another article in the same series says **60+**, so the series contradicts itself. — [GameRefinery Part 2](https://www.gamerefinery.com/how-to-crack-the-match-3-code-part-2/); [ironSource LevelUp repost](https://medium.com/ironsource-levelup/how-to-crack-the-match-3-code-part-ii-c3722afd6c67)
- **[VENDOR, unverified]** A development-company blog claims Royal Match alternates **breather levels at 85–95% win rate** with **hard spikes at 25–40%**, about **one hard level per 5–8**. No primary source. The search summary did not name the blog; the likeliest match among the results is [raijinnstudio.com](https://raijinnstudio.com/blog/match-3-game-development-guide-royal-match), so the attribution is uncertain
- **[VENDOR/BLOG, unverified]** One guide claims King's simulation bots must win a level **at least 3–5% of the time** as an "average" player, or the level is redesigned. Single blog, no King source found. — [bugnet.io](https://bugnet.io/blog/how-to-design-a-puzzle-games-difficulty-curve) / [ludaxis.io](https://www.ludaxis.io/blog/level-design-puzzle-games-guide) (the summary did not say which of the two)
- **[ANALYST, Deconstructor of Fun, 2021]** A game with only about **600 levels tends to carry a steeper difficulty curve**. Rescue power-ups (bombs, dynamite) get a stuck level moving again. — [Deconstructor of Fun](https://www.deconstructoroffun.com/blog/2021/3/21/royal-match-the-new-king-from-turkey)
- **[1P anecdote] Candy Crush level 65** was meant to be the **last level** of an early update. It became the **highest-converting level** and **"has made the most revenue ever"**, and it also **caused the most churn** (section 3). — [mobilegamer.biz](https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/); [App Store story](https://apps.apple.com/us/story/id1297938529)

### Inferences
- The figures agree once converted:
  - easy ≈ 1–1.25 attempts (pass rate ~80–95%);
  - normal ≈ 2–4 (pass rate 25–50%);
  - hard ≈ 7–35;
  - beyond ~50, a studio intervenes.

  This project's "intro and breather may be easier" plus a ×1.5 band per slot sits inside that picture. Its target formula (8.6 tries at chapter 0, ×1.26 per chapter, ×4 at spikes and bosses) reaches 30+ tries only in late boss slots. That matches "very hard ≈ 30" but sits well above Royal Match's analyst-measured ≈1.6 attempts for "hard". Match-3 attempts include luck and paid boosters, so the numbers are not directly comparable to a deterministic draw puzzle.
- The analyst-reported Royal Match cadence (hard near the 5th of each ten, super hard near the 9th, bonus or relief at the 10th) has the **same shape as this project's sawtooth**: SPIKE at 5, BOSS at 10, breathers after each. Royal Match holds its first labelled spike back to about level 45. Toon Blast holds them back to 60–100. This project puts its first SPIKE at slot 5 and first BOSS at slot 10. That is far earlier than the match-3 leaders, although "level 10" is roughly where these games' first meaningful difficulty bump lands in analyst breakdowns.
- Hard levels are where match-3 games **make money**: near-miss "buy 5 moves" (Naavik, Deconstructor of Fun, and King's level-65 story). This project has no paid continue (CLAUDE.md rules out a paid undo or hint), so the commercial reason for frequent hard levels **does not apply** here. The retention reason does (section 7).

### Gaps
- **No first-party pass-rate bands** for easy, normal, hard and super hard were found from King, Playrix, Dream Games, Peak, Rovio or Playdots. The 85–95% / 25–40% figures are one unverified vendor blog.
- No first-party figure for "first hard level at N". Royal Match's 45 and 59, and Toon Blast's 60–100, are analyst readings, and the Toon Blast figure contradicts itself.
- Nothing found from Peak (Toon Blast) or Playdots (Two Dots) staff on numeric targets. No GDC talk by Playdots on level design was found.
- The "3–5% bot win floor" attributed to King has no traceable King source.

## 3. How do studios estimate difficulty before players see a level, and recalibrate it after?

### Takeaway
Before launch: **bots that imitate humans** (King, Rovio, Tactile), **in-house playtester teams** (Playrix, and King before its bots), **designer playtesting for star thresholds** (Rovio's original Angry Birds) and a **soft launch on a test audience** (CrazyGames' Basic Launch, 7–21 days). After launch: **player pass rates, attempts and churn per level** drive **retuning, relabelling and replacing** levels. King says it continuously fixes its **100 least-fun levels**, and its level-65 A/B test showed that **making a level easier lost short-term conversions but kept players longer**.

### Cited Findings
**Bots and simulation**
- **[1P, King, 2018]** "Human-Like Playtesting with Deep Learning" (Gudmundsson et al.) trains a CNN on player moves to **predict the difficulty of new levels** in Candy Crush Saga and Candy Crush Soda Saga. Quote: *"our playtesting aims to be human-like. Unlike DeepMind's AlphaGo… our goal is to mimic real players."* The reason given: human testers played a level about **20 times and wrote a report, taking about a week**, against a target of **15 new levels a week**. An earlier King deck said MCTS takes **about 5–10 minutes per level**. — [paper (gwern mirror)](https://gwern.net/doc/reinforcement-learning/imitation-learning/2018-gudmundsson.pdf); [ResearchGate](https://www.researchgate.net/publication/328307928_Human-Like_Playtesting_with_Deep_Learning); [ComputerWeekly](https://www.computerweekly.com/news/252456896/How-TensorFlow-makes-Candy-Crush-virtual-players); [King slides, SlideShare 2016](https://www.slideshare.net/slideshow/using-artificial-intelligence-to-test-the-candy-crush-saga-game/68918982)
- **[1P, King]** King runs **thousands of bots** trained to different skill levels to find levels that are too hard. **"The designers decide if that is an intended experience"** and then refine. — [Campaign](https://www.campaignlive.co.uk/article/king-games-keeps-crushing-candy-years/1440143); [mobilegamer.biz](https://mobilegamer.biz/how-king-balances-human-and-ai-powered-design-in-candy-crush-saga/)
- **[academic, KTH/King]** A deep network estimated level difficulty **comparably to MCTS in substantially shorter time**. — [KTH thesis](https://kth.diva-portal.org/smash/get/diva2:1154062/FULLTEXT01.pdf)
- **[1P, Rovio]** Rovio's Dream Blast team used **deep reinforcement learning bots, "set loose on new levels to predict how a human player would perform"**, to take over "time intensive things like difficulty balancing". — [Rovio: Machine Learning Meets Puzzle Game Design](https://www.rovio.com/articles/machine-learning-meets-puzzle-game-design/); [AWS re:Invent 2019 slides](https://d1.awsstatic.com/events/reinvent/2019/How_Rovio_teaches_Angry_Birds_to_fly_in_the_cloud_using_ML_GAM301.pdf)
- **[academic, Rovio data]** Roohi et al. compared **12 combinations** of DRL or MCTS agents with three feature-selection methods. **DRL plus MCTS, using features from the best agent runs, predicted pass rate most accurately**. A simulated player population improved predictions without retraining the agents. Exact error figures were not visible in the summaries. — [arXiv 2107.12061](https://arxiv.org/html/2107.12061v1); [ACM 2020](https://dl.acm.org/doi/abs/10.1145/3410404.3414235)
- **[academic, Tactile]** For Lily's Garden, a **CNN trained on player data beat state-of-the-art MCTS** at predicting difficulty, and trained faster. Prior models reach a **4.0–6.6% mean absolute error on pass rate**; the 2024 paper's own figure is garbled in the summary (~8%). — [arXiv 2401.17436](https://arxiv.org/html/2401.17436v1); [arXiv 2007.01542](https://ar5iv.labs.arxiv.org/html/2007.01542)

**Human playtesting**
- **[1P, Playrix]** A dedicated playtester team plays as typical players, and its stats adjust difficulty. A Playrix deck lists "All levels are handmade" and "Careful calibration with playtesting". In 2016 Playrix said: "quite often a level seems perfect, but players show that it's not good", and it gets changed. — [Game World Observer 2019](https://gameworldobserver.com/2019/09/27/playrix-levels-elements-match-3); [Playrix deck, SlideShare](https://www.slideshare.net/slideshow/game-design-at-playrix/239197742); [Game World Observer 2016](https://gameworldobserver.com/2016/11/23/gardenscapes)
- **[1P, Rovio, ~2010–2011]** In the original Angry Birds:
  - designers pick the **bird types before the structures**;
  - star thresholds ("Step 4 – Decide on the star ratings") come from **extensive playtesting**, each tied to the average score of a particular skill shot or method;
  - **"Level design in this case is always done by one individual."** — [Pocket Gamer, Arttu Mäki](https://www.pocketgamer.com/angry-birds/exclusive-the-making-of-an-angry-birds-level/)
- **[1P, King, GDC Europe 2016]** Jeremy Kang said King's levels blend designer feel with analytics, and that **a designer's sense of difficulty is skewed relative to players'**. — summarised via [pocketgamer.biz](https://www.pocketgamer.biz/king-on-finding-the-fun-in-candy-crush/)

**Soft launch and A/B tests**
- **[1P platform]** CrazyGames **Basic Launch**: a limited audience for **7 to 21 days**, ads off. Moving to Full Launch depends on **average playtime, conversion and retention** benchmarked against other games. — [CrazyGames docs](https://docs.crazygames.com/resources/basic-launch-metrics/)
- **[1P, Supersonic]** Recommends **A/B testing difficulty**, e.g. an easier configuration for a broad audience and a harder one for experienced puzzle players (hybrid-casual). — [Supersonic](https://supersonic.com/learn/blog/how-to-design-high-impact-playables-for-your-hybrid-casual-game)

**Live recalibration**
- **[1P, King GDC 2024]** Level 65 was **one of the first levels King A/B tested**. Raising difficulty **increased conversions short term**; **making it easier kept players longer**. Guardiola: *"you're saving players from churning… and those players, like compound interest, will start growing and in subsequent levels they may start spending"*, and *"be prepared for long A/B tests"*. King uses its metrics to **find the 100 least-fun levels and fix them** ("pruning"). — [mobilegamer.biz](https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/)
- **[1P, ZeptoLab]** Semyon Voinov: the team gets "more and more data about user behaviour". It can **see where people get stuck and which levels they skip**, then **adjusts or adds levels**. For Cut the Rope: Experiments, it combined **play metrics from the original game**, user feedback and prototypes, and iterated on every level. — [Pocket Gamer interview](https://www.pocketgamer.com/cut-the-rope/zeptolabs-semyon-voinov-on-bringing-cut-the-rope-to-new-formats-not-making-a-mov/); [Game Developer interview](https://www.gamedeveloper.com/business/interview-i-cut-the-rope-i-gets-a-not-sequel-with-i-experiments-i-)
- **[1P, Rovio ~2023]** Rovio's level-design craft lead says designers own the **difficulty curve and the timing of new level types and pieces** across the game. **Live events change how hard a level feels without editing it** (example: an event requiring first-attempt clears). — [Rovio: The Craft Behind the Levels](https://www.rovio.com/articles/the-craft-behind-the-levels-a-look-into-level-design-in-rovio-games/)
- **[PLAYER]** Gardenscapes reviewers report the game getting harder, and Playrix replies that it is **reviewing difficulty and progression**. One reviewer says **Homescapes adjusts difficulty for stuck players**. — [Google Play: Gardenscapes](https://play.google.com/store/apps/details?id=com.playrix.gardenscapes&hl=en)

### Inferences
- The industry's pre-launch tool is a **human-imitating** simulator, not a solver. This project's solver plus hand model (`tools/test/lib/hand.js`) is the same idea in miniature. The literature's caution applies to it directly: even purpose-built predictors miss real pass rates by about **4–8 percentage points**, and Playrix reports the final difficulty "often differs" from the designed one. CLAUDE.md's "refit when real players' attempt counts exist" is the industry's own conclusion.
- Every studio here treats live data as the authority: King's level 65, King's pruning, ZeptoLab's "where people get stuck and skip", Playrix's "players show it's not good". For a Playables game, the minimum live signal is per-level attempts and quits. Whether the platform exposes per-level analytics was not established (section 6).

### Gaps
- No public numbers on how many levels King or Playrix retune or replace per month. "100 least-fun levels" is the only figure.
- No evidence was found of studios A/B testing **level order** specifically, as opposed to a single level's difficulty. None found, but absence of evidence is weak here.
- No bot-versus-human accuracy figure for a **physics** game. Tactile's paper notes that simulation-heavy methods suit games where "it is not necessary to simulate physics", which implies physics games are harder to bot-test.

## 4. Sawtooth / difficulty waves / tension and release: documented examples with level numbers

### Takeaway
The sawtooth is the consensus shape. Documented level numbers come almost entirely from analyst breakdowns of **Royal Match**: hard at levels **45, 55, 65 … 95** (plus 39, 49), super hard at **59, 69, 79, 89, 99**, and bonus or relief every 10. Two further rules recur: **the level that introduces a new obstacle is deliberately easier**, and **an easier level follows a spike**. Candy Crush's 15-level episodes cluster their hard levels, but **not reliably at the end**.

### Cited Findings
- **[ANALYST]** Royal Match places hard levels at **39, 45, 49, 55, 65, 75, 85, 95** and super hard at **59, 69, 79, 89, 99** within the first 100. — [Gamigion](https://www.gamigion.com/royal-match-level-design-insights/)
- **[ANALYST]** In Royal Match, difficulty rises through a cycle **"with level fifth being the hardest"**, then **drops considerably**. When **a new obstacle is introduced, the level is intentionally easier**. — [Medium: Game analysis of Royal Match](https://medium.com/@ekinmelissezer/game-analysis-for-royal-match-and-toon-blast-9c4bff8ef48b)
- **[ANALYST]** In puzzle games generally, levels gradually rise until a **"hard" or "super hard" level appears, followed by an easier level that offers a breather**. A "roller coaster" curve. The summary named neither source; the likeliest are [gamedesignskills.com](https://gamedesignskills.com/game-design/casual/) and [Medium: designing killer levels](https://medium.com/@reza-h/the-secret-to-designing-killer-levels-in-puzzle-games-978242b6cb6)
- **[BLOG, partially unverified]** Each sawtooth "tooth" spans **5 to 15 levels** in modern puzzle games, and a flat or linear climb hurts retention. The same source's claim that the sawtooth **keeps players "20–40% longer"** cites no data, and its mention of a **2013 Zynga adaptive-sawtooth patent** was not verified. — [ludaxis.io](https://www.ludaxis.io/blog/level-design-puzzle-games-guide)
- **[1P, ex-Playrix data, academic]** Lily's Garden: easy levels take about 1 attempt, hard 7+, and "some" 30+. In other words, a small number of extreme spikes over a low baseline. — [arXiv 2401.17436](https://arxiv.org/html/2401.17436v1)
- **[FAN WIKI]** Candy Crush episodes hold **15 levels**. Peaks are spread through each one:
  - Soda Splash (episode 21): very hard levels **290, 292, 293, 294, 300**; extremely hard **297**, mid-episode;
  - Sugary Stage: hardest is its **first** level (2301);
  - Shake Street: six "nearly impossible" levels late in the episode (5753–5764).

  Fan difficulty ratings, not King data. — [Candy Crush Soda wiki: Episode 21](https://candycrushsoda.fandom.com/wiki/Episode_21); [Sugary Stage](https://candycrush.fandom.com/wiki/Sugary_Stage)
- **[PLAYER/fan]** Two Dots: "relatively more complex rise in difficulty at higher levels, **with easier stages between hard ones**". The curve "shifts again every few hundred levels". Community data names **level 242** as the most common sticking point (method unknown). — [Medium: Two Dots design](https://medium.com/@islahul/two-dots-a-great-game-design-56c33b46e50); [gamersunite](https://www.gamersunite.com/twodots)
- **[1P, CrazyLabs]** A staged hyper-casual plan:
  - **levels 1–2 teach the controls ("don't kill me yet" levels)**;
  - **levels 3–10 build visible progress**;
  - **from level 11, new elements arrive gradually, "with a level or two in between to practice each one"**. The summary said only "one CrazyLabs guide": [CrazyLabs: guide for nailing mobile game design](https://www.crazylabs.com/blog/guide-for-nailing-mobile-game-design/) or [CrazyLabs: level design in hyper-casual](https://www.crazylabs.com/blog/the-must-have-of-level-design-in-hyper-casual-mobile-games/)

### Inferences
- "Spike at 5, boss at 10, breather after each" (this project's `T(c,k)` sawtooth) is the documented Royal Match rhythm. The Royal Match numbers suggest the 9th slot (super hard) is the peak, with the 10th as a payoff level. This project puts its BOSS at slot 10 itself, which is a defensible variant, but the Royal Match pattern is **peak, then payoff**.
- "New obstacle on an easier level" (Royal Match) and "a level or two to practice each element" (CrazyLabs) are both the rule CLAUDE.md already has: "A NEW THING'S FIRST LEVEL MUST STAY ITS EASIEST" and "every noun first met at its EASIEST level".

### Gaps
- No **first-party** published level-by-level difficulty chart for any major title. All level-numbered evidence is analyst or fan data and may have changed with updates.
- No documented sawtooth level numbers were found for Cut the Rope, Angry Birds or any draw puzzle.
- The "never two hard levels in a row" rule was **not found stated anywhere** as a documented studio rule. It is implied by "breather after a spike" but not quoted.

## 5. Physics and draw puzzles: Cut the Rope, Angry Birds, hypercasual draw games

### Takeaway
The premium physics puzzles (Cut the Rope, Angry Birds) structure content as **themed boxes or episodes**: Cut the Rope uses **25 levels per box, 3 stars each, new elements per box**. They make difficulty **optional through stars** ("self-manageable difficulty", in Voinov's words). Hypercasual draw-to-save games (Save the Doge and clones, Love Balls, Brain It On) draw two complaints from reviewers: **too easy, with no rise for 85–100+ levels**, and **ads after every level or every failure**. Brain It On adds a third: **controls that make levels feel impossible**. No attempts-per-level data was found for any draw puzzle.

### Cited Findings
**Cut the Rope (ZeptoLab)**
- **[FAN WIKI / reference]**
  - Each box holds **25 levels**, each with **3 stars**, so **75 stars per box**, and each box **introduces a new feature**;
  - Cardboard Box (1st): ropes, bubbles, automatic ropes, spikes;
  - Fabric Box (2nd): air cushions, spiders, and spinning spikes from **level 2-8**, forcing timed cuts;
  - Foil Box: movable ropes, timed stars, electric sparks;
  - Mechanical Box: conveyor belts at **17-1**.

  Box counts differ by version: 8 boxes per Giant Bomb, 17 per the wiki. — [Cut the Rope wiki](https://cuttherope.fandom.com/wiki/Cut_the_Rope); [List of boxes](https://cuttherope.fandom.com/wiki/List_of_boxes); [Giant Bomb](https://giantbomb.com/wiki/Games/Cut_the_Rope)
- **[1P, GDC 2012, from slide text]** Semyon Voinov's Cut the Rope principles include:
  - **positive reinforcement**;
  - **self-manageable difficulty**;
  - **enabling planning rather than trial and error**;
  - **solutions that look logical and reproducible**;
  - **tutorial levels must not be passable without using the principle they teach**;
  - "It's OK to break those rules";
  - goals: make the player **feel smart** and keep them **hungry for more**. — [Voinov slides (GDC Vault)](https://media.gdcvault.com/gdc2012/slides/Design%20Track/Voinov_Semyon_Level_Design_Casestudies.pdf); [GDC Vault session](https://gdcvault.com/play/1015570/Level-Design-Case-Studies-Trainyard); [video](https://www.youtube.com/watch?v=zSUu_36SmlQ)
- **[1P, GDC 2012, same session]** Matt Rix (Trainyard): **level design is teaching**. Add elements **one at a time**, teach in small amounts per puzzle, and **once a combination of elements has been introduced, treat it as a new element**. — [Rix slides](https://media.gdcvault.com/gdc2012/slides/Design%20Track/Rix_Matt_Level_Design_Casestudies.pdf)
- **[REVIEWS]** In Cut the Rope the stars are the main difficulty lever. One review says difficulty "accelerates smoothly but doesn't reach its peak" and the game is easy **unless you chase three stars**. Another says late levels are a struggle for three stars. — [Photics review](https://photics.com/cut-the-rope-review/); [Wikipedia](https://en.wikipedia.org/wiki/Cut_the_Rope_(video_game))
- **[1P]** ZeptoLab saw where players got stuck or skipped, and adjusted or added levels (section 3). In 2010 it said it had one dedicated level designer, but many team members also made levels. — [Pocket Gamer](https://www.pocketgamer.com/cut-the-rope/zeptolabs-semyon-voinov-on-bringing-cut-the-rope-to-new-formats-not-making-a-mov/); [Capsule Computers 2010](https://www.capsulecomputers.com.au/2010/12/om-nom-cut-the-rope-interview-with-the-creators/)

**Angry Birds (Rovio)**
- **[1P, ~2010–2011]** One designer per level, birds chosen first, star thresholds from playtesting tied to particular skill shots (section 3). — [Pocket Gamer](https://www.pocketgamer.com/angry-birds/exclusive-the-making-of-an-angry-birds-level/); [pocketgamer.biz: Rovio reveals the secrets of their level design](https://www.pocketgamer.biz/rovio-reveals-the-secrets-of-their-level-design/)
- **[1P, academic]** Pass rate is the standard difficulty operationalisation, with Angry Birds cited as an example. Rovio's own studies use Dream Blast, not the slingshot games. — [arXiv 2401.17436](https://arxiv.org/html/2401.17436v1)

**Hypercasual draw-to-save (Save the Doge / Save the Dog clones, Love Balls, Brain It On, Draw Puzzle)**
- **[PLAYER] Save the Dog / Save the Doge listings:**
  - one player saw **little rise in difficulty across 100+ levels**, with **many levels solvable by drawing a circle**;
  - another found it **"very easy until level 85"**;
  - a third called puzzles near **level 100 meaningless**;
  - one **finished a 550-level version in about a week**;
  - ads: banners plus ads **between rounds and after failed attempts**, ads **after every level**, and "remove ads" not covering rewarded or pop-up ads.

  Several similarly named apps; reviews vary by listing. — [App Store: Save the Doge](https://apps.apple.com/us/app/save-the-doge-rescue-dog-game/id6468571577); [App Store: Save the Dog DOP](https://apps.apple.com/us/app/save-the-dog-draw-line-dop/id1662076281); [Google Play: Save the Dog – Draw to Save](https://play.google.com/store/apps/details?id=com.gameease.savethedoggy&hl=en_US); [Google Play: Save the Doge](https://play.google.com/store/apps/details?id=com.miracle.savethedoge.an&hl=en_US)
- **[PLAYER] Love Balls:** "seems like **25% of the time is actual gameplay and 75%… advertisements**". Common Sense Media notes a permanent banner and random full-screen ads after puzzles. Difficulty "gets more challenging the further you go". — [Google Play: Love Balls](https://play.google.com/store/apps/details?id=com.supertapx.lovedots&hl=en); [Common Sense Media](https://www.commonsensemedia.org/app-reviews/love-balls)
- **[PLAYER] Brain It On!:**
  - unskippable **ads after every level**;
  - **unresponsive controls making "most levels nigh-impossible"**;
  - shapes "just fall to the ground" when drawn as instructed;
  - drawing freezes near no-draw objects;
  - others call it genuinely challenging. — [App Store](https://apps.apple.com/us/app/brain-it-on/id985367692); [Google Play](https://play.google.com/store/apps/details?id=com.orbital.brainiton&hl=en_US)
- **[PLAYER] Draw Puzzle: Tricky Brain Test:** an ad **after every 2 puzzles**. Strict drawing recognition: "even when I drew along the line… it STILL wouldn't let me pass". — [Google Play](https://play.google.com/store/apps/details?id=com.matchingham.drawpuzzle.something&hl=en)
- **[1P, Voodoo guidance via GameAnalytics]** Games should be **snackable** (short sessions with a lot of reward), **intuitive** (understood in seconds) and **forgiving**. — [GameAnalytics: A Voodoo Guide to Game Design](https://www.gameanalytics.com/blog/voodoo-guide-mobile-game-design-keep-things-simple)

### Inferences
- Draw-to-save hits seem to have paced for **volume and ad impressions, not a curve**: hundreds of levels with a flat, low difficulty, and a circle often enough. The complaint that cost them is "too easy / meaningless". This project's breadth ceiling (40%) and its census of what actually happened in winning runs (e.g. "a line drawn through the object" as the real solution) guard against exactly that failure.
- Brain It On's complaint ("drawn as instructed, it just falls") is the physics-puzzle version of **fairness under hand noise**. It is what this project's hand model and its "precision floor" are for. Reviews suggest that is where draw games lose players to frustration, rather than to designed difficulty.
- Voinov's "**self-manageable difficulty**" through optional stars is the premium physics-puzzle answer to the sawtooth: the floor stays low and the stars carry the spike. This project's star thresholds (from `solverData.js`) can play that role, and its daily (three-star ink budget) already treats the three-star line as the "hard mode".

### Gaps
- **No attempts-per-level, pass-rate or churn data was found for any draw or physics puzzle**: Save the Doge, Love Balls, Brain It On, Draw Climber, Happy Glass, Thief Puzzle, DOP, Cut the Rope or Angry Birds.
- No publisher statement (Voodoo, Lion Studios, SayGames, Orbital Nine) on how draw puzzles order or tune levels.
- Nothing found for Draw Climber, Happy Glass, Thief Puzzle or DOP specifically, beyond the generic Save the Dog DOP listing.
- The Angry Birds episode structure (levels per theme) was not confirmed by the search.

## 6. Playables and web-portal specifics: session length, first-level success, short-session difficulty

### Takeaway
- **Google's official Playables pages, as far as the search could see them**, cover technical and certification rules: interactive in about 5 seconds, bundle limits, resume state, and signalling when content runs out. They say **nothing about difficulty or session length**.
- **The "~10-minute session" figure is from third-party guides, and contradicts other guides that say 5 minutes.**
- The portals that publish benchmarks put **10+ minutes of average playtime** as what successful titles see (CrazyGames). Poki uses **50% of players passing the first minute** as a pass/fail onboarding line. Both say: **start with levels players will easily finish**.

### Cited Findings
- **[1P, Google]** Playables are expected to **load and become interactive within 5 seconds**, with an **initial bundle limit of 15 MB** and a total of **250 MB**. A third-party summary instead gives an initial-bundle MUST of **<30 MiB** and SHOULD of **<15 MiB**; check the live docs. — [Google: stability and performance requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_stability); [portalready.world](https://portalready.world/portals/youtube-playables/)
- **[1P, Google]** Design requirements: *"We recommend not restarting or refreshing the game unless the user can quickly resume from the prior state"*. Games must signal when **no more content is available** (e.g. after the final level). — [Google: design requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_design)
- **[THIRD-PARTY, conflicting]** The "around 10 minutes of average playtime" figure for Playables appears on commercial guide sites as a performance guideline, **"not set in stone"**. Another guide says **at least 5 minutes**. A third says **2–5 minutes** if the mechanic is sticky. **No Google source was found for 10 minutes or for a daily challenge.** — [playables.in](https://playables.in/youtube-playables-developer-program-approval/); [Playgama](https://playgama.com/blog/2026/06/04/youtube-playables); [game-developers.org](https://game-developers.org/how-to-make-games-for-youtube-playables-the-complete-developers-guide)
- **[THIRD-PARTY]** Progress should go through the SDK's `saveData()`/`loadData()` (string up to **3 MB**), saving at meaningful milestones. Saving is only available to **signed-in** users. — [playables.in SDK tutorial](https://playables.in/playables-sdk/); [Playgama wiki](https://wiki.playgama.com/platforms/youtube-playables-requirements-for-games)
- **[1P, Poki]**
  - **Playtime** is the key test, and "if players engage with your game for multiple minutes, that's a good first sign";
  - if players leave in **under a minute**, onboarding needs work;
  - onboarding rules: **skip splash, title and level-select screens** for first-timers; **"start with levels players will easily finish"**; **in Subway Surfers players can't die during onboarding**; visuals over text; introduce mechanics gradually;
  - download only the first stage up front. — [Poki: Easy access & onboarding](https://developers.poki.com/guide/easy-access); [Poki: Playtesting](https://developers.poki.com/guide/playtesting); [Poki SDK playtesting](https://sdk.poki.com/playtesting)
- **[1P-hosted interview, Poki]** *"If fewer than 50% of players pass the first minute, the onboarding isn't good enough or the game isn't fun."* From a Poki developer spotlight (Blumgi), not a published standard. — [Poki blog: Blumgi spotlight](https://poki.com/blog/developer-spotlight-blumgi-games-part-1)
- **[1P, CrazyGames]** Successful titles **"often see 10+ minutes of average play time"**. Conversion = share of players playing **at least one minute**. Basic Launch runs **7–21 days**. — [CrazyGames docs](https://docs.crazygames.com/resources/basic-launch-metrics/)
- **[1P vendor data, GameAnalytics]** The 2025 benchmarks cover **11,600 games, 1.48 billion MAU**, classic retention:
  - median **D1 ≈ 22%**, bottom quartile **10–11.5%**, top quartile **25–27% (Android) / 31–33% (iOS)**;
  - median **D7 ≈ 3.4–3.9%**;
  - 2024 average session length: **median 5–6 minutes, top quartile 8–9 minutes**;
  - **Board, Card and Puzzle** games show the highest short- and long-term retention.

  A claimed "~40-minute puzzle session" from AppFollow conflicts with these and is unverified. Figures come via secondary coverage, because the report sits behind a lead form. — [GameAnalytics 2026 benchmarks page](https://www.gameanalytics.com/reports/2026-mobile-pc-gaming-benchmarks); [2025 report PDF mirror](https://files.gameindustrylibrary.com/documents/mobile-gaming-benchmarks-2025.pdf); [AppFollow](https://appfollow.io/blog/mobile-game-analytics-with-ioana-hreninciuc)

### Inferences
- **CLAUDE.md attributes "aim for ~10 minute sessions, persist progress, add a new challenge each day" to Google's own Playables guidance. This research could not trace the 10-minute or daily-challenge parts to Google.** Only "persist and resume progress" (design requirements) and "signal no more content" were found on Google pages. The 10-minute figure is consistent with **CrazyGames'** first-party "10+ minutes for successful titles" and with GameAnalytics' top-quartile 8–9 minutes. So the number is a reasonable target, but its stated source should be corrected or re-checked against developers.google.com.
- **Can level 1 be lost?** No source requires that it cannot. The consensus leans "**can't really lose the first level**": Poki ("easily finish", Subway Surfers can't die), CrazyLabs ("don't kill me yet" levels 1–2), Voodoo ("forgiving"). Voinov adds a constraint pulling the other way: a tutorial level **must not be passable without using the principle it teaches**. This project's rule "doing nothing must FAIL" fits Voinov. The portal guidance suggests level 1 should be **failable by doing nothing but trivially winnable by any reasonable attempt**, i.e. breadth near the top of the band (this project's levels 1–3 ≤ 15 tries already goes that way; the portal advice argues for nearer 1–2).
- At ~40 seconds per level (CLAUDE.md), a 10-minute sitting is about 15 levels. That puts the first SPIKE (slot 5) inside the first 3–4 minutes, and Poki and CrazyGames measure the **first minute** most heavily. The earliest slots matter most for portal promotion.

### Gaps
- Could not read Google's Playables design-requirements page in full. Whether it says anything about difficulty, tutorials or session length is unconfirmed.
- No YouTube Playables, Playgama, Poki or CrazyGames publication was found linking **difficulty** (as opposed to onboarding and playtime) to retention numerically.
- Whether YouTube Playables gives developers **per-level analytics** (attempts, quits) for live recalibration was not found.

## 7. How the numbers become rules a designer follows

### Takeaway
The rules that can be documented are:
- **attempt or pass-rate bands per difficulty class**, set in a **master curve document** (Playrix);
- **ceiling triggers** for intervention (King designer: retune above ~50 attempts; King: fix the 100 least-fun levels);
- **visible tier labels** assigned by script (King, Two Dots, Royal Match);
- **a cadence of about two hard levels per ten**, with breathers and payoff levels (Royal Match, from analysts);
- **easier intro levels for each new element** (Royal Match, CrazyLabs, Rix);
- **long A/B tests that judge a difficulty change on retention, not short-term conversion** (King).

"Never two hard levels in a row" is folk wisdom implied by these sources, not a quoted studio rule.

### Cited Findings
- **[1P via WSJ repost]** King designer rule of thumb: easy ≈ **5 attempts**, very hard ≈ **30+**, **>50 → make easier**; old levels retuned from population averages. — [GameFAQs repost](https://gamefaqs.gamespot.com/boards/690722-candy-crush-saga/70046682?page=47)
- **[1P, Playrix 2019]** A projected curve in a **master document** sets each level's target, e.g. **80%**. Designers set it, playtesters correct it, and the shipped value often drifts. Similar consecutive difficulties are flagged as a problem (summary cites the 92–95% range). — [Game World Observer](https://gameworldobserver.com/2019/09/27/playrix-levels-elements-match-3)
- **[1P, academic]** Designers use **ranges or classes of completion rate**, not point estimates. — [arXiv 2107.03305](https://arxiv.org/html/2107.03305)
- **[ANALYST]** Gamigion/Playliner: 1–3 attempts = easy, 20–35 = hard; use tiers **Easy / Hard / Super Hard**; start easy, then add a hard spike. — [Gamigion](https://www.gamigion.com/how-to-design-difficulty-in-puzzle-games/)
- **[ANALYST]** Royal Match: **2 hard per 10**, first labels at **45 / 59**; **new obstacle → easier level**; a **5-level rise then a drop**. — [Medium: Royal Kingdom](https://medium.com/@chrisjameswallace/royal-kingdom-the-next-puzzle-hit-from-dream-games-c7395e26b185); [Medium: Royal Match analysis](https://medium.com/@ekinmelissezer/game-analysis-for-royal-match-and-toon-blast-9c4bff8ef48b)
- **[1P, King GDC 2024]** Judge a difficulty change by its **ripple effect on the whole progression**; easier can beat harder over the long run; *"be prepared for long A/B tests"*. — [mobilegamer.biz](https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/)
- **[1P, GDC 2012]** Rix: one new element at a time, and a combination counts as a new element. Voinov: tutorial levels must require the principle they teach; difficulty should be self-manageable (optional stars); planning beats trial and error. — [Rix slides](https://media.gdcvault.com/gdc2012/slides/Design%20Track/Rix_Matt_Level_Design_Casestudies.pdf); [Voinov slides](https://media.gdcvault.com/gdc2012/slides/Design%20Track/Voinov_Semyon_Level_Design_Casestudies.pdf)
- **[1P, CrazyLabs]** Levels 1–2 "don't kill me yet"; 3–10 visible progress; 11+ one new element at a time with 1–2 practice levels each. — [CrazyLabs](https://www.crazylabs.com/blog/guide-for-nailing-mobile-game-design/)
- **[VENDOR, unverified]** Breathers at 85–95% win rate, spikes at 25–40%, about one hard level per 5–8. Attribution uncertain (likeliest: [raijinnstudio.com](https://raijinnstudio.com/blog/match-3-game-development-guide-royal-match))
- **[1P, EA]** Live per-player difficulty (choosing seeds by predicted win rate) gave **up to 9% more engagement** with neutral monetization. One studio's way of turning the curve into a per-player rule. — [ACM DL](https://dl.acm.org/doi/abs/10.1145/3041021.3054170)

### Inferences
- This project's curve gate (`tools/test/curve.js`) already encodes the industry rules that can be documented:
  - a band per slot (×1.5), like Playrix's targets and the Lily's Garden "classes";
  - a sawtooth with two hard slots per ten and breathers after each, like Royal Match;
  - each new element first met at its easiest level, like Royal Match, Rix and CrazyLabs;
  - a cap on spikes ("no level over 3× the median of the four before it"), like King's ">50 attempts → retune" ceiling.

  What it lacks compared with industry practice: **(a)** a time-to-abandon or quit signal; **(b)** a hard ceiling in absolute attempts, so that a late BOSS whose formula target exceeds ~30–50 tries is capped rather than shipped; **(c)** a live-data recalibration loop.
- The industry's absolute anchors (King: easy ≈ 5 attempts in a game with luck and boosters; Lily's Garden: average ≈ 3.2, easy ≈ 1) suggest this project's **8.6-tries chapter-0 baseline is on the hard side** for a portal audience measured on its first minute. But TRIES counts **plausible random strokes**, not human attempts: a person who understands the level needs far fewer tries than a random sweep. The units are not comparable without real player data. CLAUDE.md's own note says as much ("relative, not a prediction").
- Because there is **no paid continue**, the monetization case for frequent spikes (Royal Match's near-miss purchases, King's level-65 conversions) does not apply. King's own A/B result (easier kept players longer) argues for spikes that are **shallower than match-3 norms** in a game paid by ad impressions and daily actives.

### Gaps
- No first-party source states "never two hard levels in a row" or an exact breather rule. It is inferred from cadence data.
- No first-party published band table (pass rate per easy / normal / hard / super hard) from any of King, Playrix, Dream Games, Peak, Rovio or Playdots.
- No source was found on how studios set **per-chapter escalation** numerically (this project's ×1.26 per chapter). Royal Match's move budget shrinking from 30–38 to 23–27 over 100 levels is the only escalation figure found, and it is analyst-reported.
