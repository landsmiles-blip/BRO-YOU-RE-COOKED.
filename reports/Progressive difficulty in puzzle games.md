# Real players must recalibrate the curve

Professional puzzle studios build difficulty the way this project already does on paper. They measure each level as attempts per success, predict that number before release with simulated players, lay levels out as a rising sawtooth with a breather after each hard one, and introduce every new element on an easy level. But none of them trusts the prediction. King, Rovio, Playrix and Tactile all correct it with real players' pass rates, and even their purpose-built predictors miss by several percentage points. "BRO, YOU'RE COOKED." has the first three parts and lacks the fourth, which is the part that makes the other three trustworthy.

The curve's skeleton is sound: its shape, the rule that a new element arrives on its easiest level, the wall check and the gentle start all match the textbooks and the published industry practice. Its numbers are uncalibrated, for four reasons:

- "Tries" counts random plausible strokes, not human attempts, and nobody knows how one converts to the other.
- The constants were fitted to levels that were then tuned to the constants, so the fit is circular.
- The target equation climbs to 138 simulated tries, while the project's only human anchor (SINK at 90, called "unplayable") says about 60 is already too high.
- On the hardest levels the measurement noise is as wide as the tolerance band.

The game earns from ads on completed levels and sells no continues, so the commercial reason match-3 games use steep spikes does not apply here. The controlled evidence (players stay longer on easier versions unless they chose the difficulty themselves) points toward shallower spikes. The fix is not a new formula:

- cap the top at 60 now;
- make level 1 the easiest of the first three;
- collect runs-to-first-win from strangers, using the logging the playtest build already has;
- refit the curve in human units.

A caution on sources: the research team could not open any full text. Every source below was read through abstracts and search-result summaries, so check exact figures before quoting them outside this project.

## Degrees teach the playtest loop; studios teach the curve

Most game and level designers come from dedicated game-design degrees, and what those degrees have in common is a **process, not a model of difficulty**:

- **USC.** Every interactive-entertainment major takes CTIN 488 *Game Design Workshop*, which covers "prototyping, playtesting, and managing an iterative and playcentric design process" ([USC syllabus](https://web-app.usc.edu/soc/syllabus/20253/18358.pdf)).
- **MIT.** CMS.608 has students "design, develop, and thoroughly test" their games ([MIT OCW](https://ocw.mit.edu/courses/cms-608-game-design-spring-2014/pages/syllabus)).
- **Carnegie Mellon.** The Entertainment Technology Center (ETC) still builds its curriculum around rapid-round *Building Virtual Worlds* ([CMU](https://www.cmu.edu/news/stories/archives/2025/september/achievement-unlocked-future-loading-etc-turns-25)).
- **NYU.** *Level Design Studio* teaches 3D spaces, architecture and lighting, and does not name pacing or difficulty in its description ([NYU](https://itp.nyu.edu/exchange/interchange/?p=648)).
- **DigiPen** offers a level-design concentration ([DigiPen](https://digipen.edu/showcase/news/digipen-game-design-disciplines-explained-level-design)), and **Uppsala** a full bachelor's in Game Design and Level Design ([Uppsala](https://www.uu.se/en/study/programme/bachelors-programme-game-design-and-level-design)).
- **Abertay** makes Quality Assurance and User Experience a core module ([Abertay](https://www.abertay.ac.uk/media/7431/ba-with-honours-in-game-design-and-production.pdf)).
- **ITU Copenhagen** requires *Data-Driven Design and Development* on its MSc games track ([ITU](https://en.itu.dk/Programmes/MSc-Programmes/Games)). This is the clearest analytics content found in any curriculum.

Balance as a subject barely exists. Full Sail runs a four-week, three-credit *Game Balancing* course ([Full Sail](https://catalog.fullsail.edu/node/947)). Ian Schreiber opened a 2016 GDC talk by saying there are "no textbooks, few writings, and even fewer classes" on it ([GDC Vault](https://gdcvault.com/play/1023349/A-Course-About-Game)). **No syllabus the research could see teaches a pass-rate target or an attempts-per-level band.**

So the craft of tuning thousands of small puzzle levels is learned in studios, and their job ads show what they screen for:

- **Playrix** asks junior applicants to state how many match-3 levels they have completed; an older posting set the bar at **500** ([Hitmarker](https://hitmarker.net/jobs/playrix-junior-game-designer-1259432)).
- **King** wants juniors with "a solid grasp of game balancing and pacing" ([Hitmarker](https://hitmarker.net/jobs/king-junior-level-designer-candy-crush-saga-841578)), and seniors who are "building, assessing, rebalancing and tuning new and existing levels" while "analyzing real-time feedback and metrics" ([Hitmarker](https://hitmarker.net/jobs/king-senior-level-designer-901935)).
- **Voodoo**'s puzzle level designer sets up A/B tests and tunes difficulty curves ([Hitmarker](https://hitmarker.net/jobs/voodoo-level-designer-puzzle-games-4460789)).
- **CrazyLabs** names completion rates, fail rates, retries and churn points ([IxDF](https://ixdf.org/jobs/game-level-designer-live-operations-remote)).
- **SayGames** reads fail rate, churn, attempts, booster use and rewarded-ad views ([SayGames](https://blog.say.games/posts/how-to-work-with-difficulty-in-hybrid-puzzles-so-players-dont-leave--but-stay-and-pay)).

At scale the work is divided:

- **The lead level designer owns the curve as a framework.** Rovio's posting for that role reads "defining clear frameworks for difficulty curves and power-up systems" and "reviewing daily player data" ([Lever](https://jobs.lever.co/rovio-2/a7f7688d-faa3-4de3-923c-dcae8ddcaac7)).
- **Data science sets how success is judged.** King's data-science leads tell designers to judge a level within the whole progression and to "be prepared for long A/B tests" ([MobileGamer.biz](https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/)).
- **User research and economy design are separate jobs.**
- **Bots inform but do not decide.** King runs thousands of skill-graded bots, and "the designers decide if that is an intended experience" ([Campaign](https://www.campaignlive.co.uk/article/king-games-keeps-crushing-candy-years/1440143)).

The mapping onto this project:

| Studio role | Who or what plays it here |
|---|---|
| Lead level designer, who owns and signs off the curve | the owner |
| Studio bots | the solver sweep and the hand model |
| User research | playtests |
| Data science | `tools/lib/fit-curve.py` |

Signing off the curve needs judgement, not programming. **The role this project lacks is the data-science one fed by real players**, and every studio treats it as the authority.

## The canon agrees on shape and teaching order, and leaves the numbers to playtests

The standard texts give a consistent picture of the curve's **shape**:

- **Schell's interest curve** (*The Art of Game Design*, Lens #61): a hook, then rising peaks and valleys, then a climax. The same shape repeats at every scale, which he calls a "fractal interest curve" ([Game Developer](https://gamedeveloper.com/design/book-review-the-art-of-game-design)). One of the lens's questions is "If I ask playtesters to draw an interest curve, what does it look like?" ([CGDC](https://cgdc.org/?p=3902)), which turns the curve into a playtest instrument rather than a plan.
- **The flow channel**, from Jenova Chen's USC thesis and popularised through Schell: give a new skill while easing difficulty, raise difficulty once the player is comfortable, then lower it again ([Game Developer](https://www.gamedeveloper.com/design/understanding-the-flow-channel-in-game-design)).
- **Koster**: fun is learning, and a game stops being fun when it is too simple or too complex ([Engadget](https://www.engadget.com/2012-10-10-gdc-online-2012-raph-kosters-keynote-on-a-theory-of-fun-10-ye.html)).

The canon is just as consistent about **teaching order**:

- **Dan Cook's skill atoms** chain basic skills before advanced ones ([Lostgarden](https://lostgarden.com/2007/07/19/the-chemistry-of-game-design/)).
- **Nintendo's four-step method** (*kishōtenketsu*, from Koichi Hayashida's *Super Mario 3D World*): introduce a mechanic safely, develop it, twist it, then combine it ([MCV](https://www.mcvuk.com/development/video-nintendos-level-design-secrets-in-four-steps)).
- **Linehan et al. (CHI PLAY 2014)** analysed Portal, Portal 2, Braid and Lemmings. All four introduce each skill separately, start with puzzles that need only that skill, leave room to practise it and combine it with earlier ones, and raise complexity until the next skill arrives ([UCC](https://cora.ucc.ie/handle/10468/3461)).
- **Matt Rix (Trainyard)** adds that once two elements have been combined, the combination counts as a new element ([GDC slides](https://media.gdcvault.com/gdc2012/slides/Design%20Track/Rix_Matt_Level_Design_Casestudies.pdf)).
- **Semyon Voinov (Cut the Rope)**, closest to this game in genre, lists these principles ([GDC slides](https://media.gdcvault.com/gdc2012/slides/Design%20Track/Voinov_Semyon_Level_Design_Casestudies.pdf)):
  - "self-manageable difficulty";
  - "enabling planning rather than trial and error";
  - solutions that look logical and reproducible;
  - tutorial levels that cannot be passed without the principle they teach.

What the canon does **not** give is a number for how hard a level should be:

- **Schreiber and Romero's *Game Balance* (2021)** defines balance as making a game fair while giving "just the right amount of difficulty" ([Routledge](https://www.routledge.com/Game-Balance/Schreiber-Romero/p/book/9781498799577)). Its curves are linear, exponential, triangular and logarithmic relationships for costs, power and progression, offered as "starting points, not fixed rules" ([UserWise](https://blog.userwise.io/blog/the-mathematics-of-game-balance)). They describe how numbers grow, not how hard a puzzle is.
- **Scott Rogers' pacing tool is a beat chart** ([Packt](https://subscription.packtpub.com/book/game-development/9781118877166/15)). The term "sawtooth" appears only in unattributed practitioner blogs ([Bugnet](https://bugnet.io/blog/difficulty-curves-how-to-get-them-right)).
- **Fullerton's playcentric method** answers the question "is the curve right?" with a loop: set experience goals and playtest until the design meets them ([Game Developer](https://gamedeveloper.com/design/book-excerpt-game-design-workshop)).

Two consequences for this project follow:

- The 10-slot profile (INTRO, three DEVELOPs, SPIKE, BREATHER, two DEVELOPs, BREATHER, BOSS) is a faithful version of the canon.
- The two growth constants (×1.26 per chapter, boss ×4 its intro) have **no textbook source**. The claim in `tools/lib/difficulty.js` that exponential growth is "the slow exponential rise every successful level-based game climbs" is not supported by anything the research found.

## Experiments reward peaks and easiness, and none proves the sawtooth

Controlled studies support **oscillation over flat balance**:

- **Chen (2007)** framed the flow zone as challenge matched to ability, showed that novices and hardcore players have different zones, and favoured choices built into the game over hidden adjustment ([CACM PDF](https://khoury.northeastern.edu/~lieber/courses/csu670/f08/materials/p31-chen-flow-in-games.pdf)). He said players "felt cheated" by hidden adjustment ([Engadget](https://www.engadget.com/2006-09-18-joystiq-qanda-jenova-chen.html)).
- **Baumann, Lürig and Engeser (2016)** found that constant skill–demand balance gave **neither the most flow nor the most enjoyment**. Demand that rose and fell with short breaks did better, and slight overload maximised enjoyment ([Uni Trier PDF](https://www.uni-trier.de/fileadmin/fb1/prof/PSY/PGA/unterlagen/BaumannL%C3%BCrigEngeser_Flow_MOEM_2016.pdf)).
- **An ICEC 2022 study** of 67 players found "curves with peaks have the strongest impact on players' motivation" ([HAL](https://hal.archives-ouvertes.fr/hal-03847459)).
- **Sarkar and Cooper** reshaped a puzzle game's curve for **400 players** and found some curves dominated others ([NSF PAR](https://par.nsf.gov/servlets/purl/10133937)). Separately, ordering levels by difficulty produced more attempted and completed levels than random order ([AAAI](https://ojs.aaai.org/index.php/AIIDE/article/view/12948)). That supports the measured re-order this project made on 12 Oct.

But **no peer-reviewed study found compares a sawtooth with a smooth ramp, or derives a spike frequency or spike height.** The shape is defensible; its parameters are not established by research.

The evidence is stronger, and less comfortable, on **easiness**:

- **Lomas et al. (CHI 2013)** ran two experiments in an online maths game, with 10,000 and 70,000 players. "In almost all cases, subjects were more engaged and played longer when the game was **easier**" ([DOI](https://dx.doi.org/10.1145/2470654.2470668)).
- **Their 2017 follow-up** covered more than 20,000 sessions. When difficulty was randomly assigned rather than chosen, the **easiest version was the most motivating**. The recommendation was "easy but interesting" ([CMU HCII](https://hcii.cmu.edu/news/chi-preview-researchers-hcii-believe-difficulty-can-be-overrated-games)).
- **A 2023 Icy Tower study** found involvement "drops rapidly when a task is so difficult that it cannot be completed" ([PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10004480/)).
- **Constant et al. (2017)** found players "strongly underestimate high levels of difficulty" ([Springer](https://link.springer.com/chapter/10.1007/978-3-319-67684-5_8)). A spike may not draw complaints; its cost shows up as quitting.
- **Later CNAM work** frames optimal difficulty as about a **50% chance of success** per attempt ([ACM](https://dl.acm.org/doi/fullHtml/10.1145/3290605.3300693)).

Put together, erring easy costs little and erring into "impossible-feeling" costs a lot. In this game nobody chooses their difficulty, so the Lomas condition applies directly.

The scholarship also says **what difficulty is**:

- **Aponte, Levieux and Natkin** define it as the probability that a player fails a challenge, estimated statistically while allowing for learning ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1875952111000231)). They split it into three kinds ([ACM](https://dl.acm.org/doi/10.1145/2071423.2071484)):
  - **sensory**: reading the game state;
  - **logical**: working out the solution;
  - **motor**: executing it.
- In this project, **breadth approximates logical (search) difficulty and hand rate approximates motor difficulty. Nothing measures sensory difficulty**: whether a stranger can read the frozen frame. That axis is what shelved A7 and A14 and part of what sank SINK.
- **Isaksen's dexterity-game work** predicts difficulty with Monte-Carlo runs of a **motor-noise player model** ([FDG 2015](http://www.nealen.net/papers/exploring-game-space-FDG2015.pdf)), the academic twin of this project's hand model. It adds that "when a designer talks about the 'difficulty curve' for a game, they are talking about a **hazard function**": the chance of failing or quitting at each point ([AAAI](https://ojs.aaai.org/index.php/AIIDE/article/view/12846)).
- **Juul** found that players "clearly prefer feeling responsible for failing", and that failure works by making them readjust their understanding of the game ([Juul](https://jesperjuul.net/text/fearoffailing/)). That is the theoretical case for this project's explanatory death cam.
- **Physics-puzzle research** solves the same problem this project does: Cut the Rope restricted to "sensible moves" ([AAAI](https://ojs.aaai.org/index.php/AIIDE/article/view/12690)), and Angry Birds agent portfolios ([arXiv](https://arxiv.org/pdf/1902.02518)). **None of it calibrates against human pass rates, and no work at all was found on draw-a-line puzzles.** There is no published draw-puzzle method to borrow: this project's simulation already combines the two nearest approaches, and its calibration has to be built from the match-3 recipe.

## Studios steer by attempts per success and always correct the bots with players

### Prediction before release is good and never final

The industry's working unit is **pass rate per attempt, or its inverse, attempts per success**:

- **King** counts "how many times a player passes a level out of every 100 attempts" ([TechXplore](https://techxplore.com/news/2025-05-ai-candy-players-difficult-puzzles.html)). It pairs a "time to pass" with a "time to abandon", because "hard levels can be fun" ([MobileGamer.biz](https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/)).
- **Rovio's academic partners** define difficulty as pass rate and engagement as churn: no play for seven days after trying a level ([arXiv](https://arxiv.org/abs/2008.12937)).
- **Tactile's papers on Lily's Garden** note that "level designers typically work with ranges of the completion rate rather than point estimates" ([arXiv](https://arxiv.org/abs/2107.03305v1)).

This project's `tries` is the same quantity, simulated. Before release, the studios predict it with bots that **imitate humans rather than solve optimally**:

- **King's convolutional network** (a deep-learning model) was trained on real players' moves to "mimic real players". It replaced a process in which human testers played each level about 20 times and reported back within a week ([Gudmundsson et al.](https://dl.acm.org/doi/10.1109/CIG.2018.8490442); [koaning.io](https://koaning.io/posts/playtesting)).
- **Rovio and Aalto University** (Roohi et al.) used reinforcement-learning agents plus a simple population model with skill, persistence and boredom. Their data covered **168 levels and 95,266 players**, and the population model "significantly improved" pass-rate and churn predictions ([arXiv](https://arxiv.org/abs/2008.12937)).
- **Roohi et al.'s 2021 follow-up** found that "an AI agent's **best-case performance** can yield stronger correlations with human data than the agent's average performance" ([arXiv](https://arxiv.org/abs/2107.12061v1)).
- **Kristensen and Burelli (ITU, on Tactile's data)** found that **combining real-player statistics with simulated data** beat either alone ([Wiley](https://onlinelibrary.wiley.com/doi/10.1155/2024/5592373)). Earlier predictors still missed real pass rates by about **4.0–6.6 percentage points** on average ([arXiv](https://arxiv.org/html/2401.17436v1)).

People who make these levels say the same thing in plainer words:

- Playrix: "quite often a level seems perfect, but players show that it's not good", and the shipped difficulty "often differs" from the designed value ([Game World Observer](https://gameworldobserver.com/2019/09/27/playrix-levels-elements-match-3)).
- A King designer said **a designer's sense of difficulty is skewed relative to players'** ([PocketGamer.biz](https://www.pocketgamer.biz/king-on-finding-the-fun-in-candy-crush)).

After release, live data rules:

- King A/B-tested **level 65**: harder raised short-term conversion, easier kept players longer.
- King continually finds and fixes its **100 least-fun levels** ([MobileGamer.biz](https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/)).
- ZeptoLab watches "where people get stuck and which levels they skip" and adjusts ([Pocket Gamer](https://www.pocketgamer.com/cut-the-rope/zeptolabs-semyon-voinov-on-bringing-cut-the-rope-to-new-formats-not-making-a-mov/)).

The owner's distrust of a curve that has never met a player is therefore the professional position, not a lack of faith.

### Targets cluster low, with rare spikes, and money explains the spikes

| Source | Easy | Typical | Hard | Intervene |
|---|---|---|---|---|
| King designer, via WSJ ([repost](https://gamefaqs.gamespot.com/boards/690722-candy-crush-saga/70046682?page=47)) | ~5 attempts | — | 30+ | above ~50, made easier |
| Lily's Garden player data ([arXiv](https://arxiv.org/html/2401.17436v1)) | 1 | ~3.2 average | 7+, some 30+ | — |
| Playliner via Gamigion ([Gamigion](https://www.gamigion.com/how-to-design-difficulty-in-puzzle-games/)) | 1–3 | — | 20–35 | — |
| Math Garden adaptive item targeting ([MDPI](https://www.mdpi.com/2079-3200/8/1/10)) | — | ~75% success (≈1.3) | — | — |
| CNAM "optimal" difficulty ([ACM](https://dl.acm.org/doi/fullHtml/10.1145/3290605.3300693)) | — | ~50% success (≈2) | — | — |

These are **human attempts in games with luck and paid boosters**, so they are not in this project's units. Note why match-3 hard levels exist at all:

- Royal Match earns its revenue from coins spent on extra moves and boosters to get past challenging levels ([Naavik](https://naavik.co/deep-dives/royal-match/)).
- King's level 65 was both its highest-revenue level and its biggest churn point ([MobileGamer.biz](https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/)).

This game sells no continue, shows an interstitial every third *completed* level, and pays for one rewarded skip. **Its revenue grows with levels finished, so its commercial interest points the same way as Lomas and King's own A/B result: shallower spikes.**

The industry cadence supports this project's structure:

- Analysts of the match-3 top-grossing chart put **about one level in five** as hard (one in four in Candy Crush Soda Saga), with King's first hard level usually **level 10** ([WN Hub](https://wnhub.io/news/game-design/item-14053)).
- Royal Match runs **two hard levels per ten** and holds its first labelled hard level back to **level 45** ([Medium](https://medium.com/@chrisjameswallace/royal-kingdom-the-next-puzzle-hit-from-dream-games-c7395e26b185)).
- Royal Match makes the fifth level of each cycle the hardest, with a drop after it, and places a new obstacle on an **easier** level ([Medium](https://medium.com/@ekinmelissezer/game-analysis-for-royal-match-and-toon-blast-9c4bff8ef48b)).

Draw puzzles fail at both ends:

- Save the Doge reviewers call it "very easy until level 85", with many levels solvable by drawing a circle ([App Store](https://apps.apple.com/us/app/save-the-doge-rescue-dog-game/id6468571577)).
- Brain It On reviewers blame controls that make "most levels nigh-impossible" ([App Store](https://apps.apple.com/us/app/brain-it-on/id985367692)). That is a fairness-under-hand-noise failure, which this project's hand model exists to prevent.

The web portals measure early play hardest:

- Poki: "start with levels players will easily finish" ([Poki](https://developers.poki.com/guide/easy-access)).
- CrazyGames: successful titles often see 10+ minutes of average playtime ([CrazyGames](https://docs.crazygames.com/resources/basic-launch-metrics/)).
- Google's Playables requirement pages, as far as they could be seen, say **nothing about difficulty or session length** ([Google](https://developers.google.com/youtube/gaming/playables/certification/requirements_design)). The "~10 minute sessions" that CLAUDE.md attributes to Google should be re-sourced to the CrazyGames and GameAnalytics benchmarks ([GameAnalytics](https://www.gameanalytics.com/reports/2026-mobile-pc-gaming-benchmarks)).

### A handful of strangers finds walls; about thirty per level sets a number

Attempts to a first win follow roughly a **geometric distribution**: the number of tries until the first success when each try has the same chance of working. Real data are "similar (but not equal)", because players learn and differ in skill ([Wiley](https://onlinelibrary.wiley.com/doi/10.1155/2024/5592373)). Standard statistics then give the precision. For a hard level, the relative error of its average attempts is about **1 ÷ √(number of players who won it)**:

| Winners on the level | Relative error |
|---|---|
| 4 | ±50% |
| 10 | ±32% |
| 25 | ±20% |
| 100 | ±10% |

Real differences between players only widen these. Other rules of thumb point the same way:

- Rasch measurement (a standard way of scoring how hard test items are) gives **30 people as enough for a pilot**, 50 for ±1 logit (a log-odds unit) at 99% confidence, and **200 for ±0.5 logit** ([Rasch.org](https://www.rasch.org/rmt/rmt74m.htm)).
- Lichess puzzle ratings reportedly settle after 20–30 attempts ([Lichess docs mirror](https://mintlify.com/lichess-org/lila/features/puzzles)). This source is low-confidence.

So a living-room playtest of three or four people **cannot refit the constants**: its error is as wide as the band. It can find walls, comprehension failures and order problems, which is what playtests are for.

Two traps matter more than sample size:

- **Survivor bias.** Later levels are played only by the testers who got that far, so they are measured on stronger players.
- **Censoring.** A tester who skips or quits has not given an attempt count; they have given a lower bound on one.

The standard estimators handle both:

- **For censoring:** a level's real tries = **all runs anyone spent on it (winners up to their first win, plus every run by those who skipped or quit) ÷ the number who won**. This is the maximum-likelihood estimate (the value that best explains the observed data) for geometric attempts.
- **For survivor bias:** player-plus-level rating systems such as Elo or Glicko-2, which treat each attempt as a match between player and level. They were applied to a puzzle game's levels by Sarkar and Cooper ([AAAI](https://ojs.aaai.org/index.php/AIIDE/article/view/12948)), and Pelánek describes Elo for item difficulty ([Pelánek](https://www.fi.muni.cz/~xpelanek/publications/CAE-elo.pdf)). They correct for who reached which level.

## BRO's curve has a sound skeleton and uncalibrated numbers

| Project rule (`tools/lib/difficulty.js`, `tools/test/curve.js`) | What the research says | Verdict |
|---|---|---|
| tries = 1/(breadth × hand rate) | The industry's attempts per success, predicted with simulated players; motor-noise models are the right tool for continuous action | **Sound as a ranking, uncalibrated as a quantity** |
| 10-slot sawtooth, two hard slots in ten, BOSS at 10 | Matches Playliner's one in five, Royal Match's two per ten, King's first hard level at 10; peaks beat flat in experiments | **Sound shape**, not proven against a ramp |
| A new element first appears on its easiest level | Linehan, Rix, Royal Match and CrazyLabs all agree | **Sound** |
| Levels 1–3 at most 15 tries | Poki's "easily finish"; Voinov's "tutorial must require the principle" | **Sound rule, but level 1 breaks its spirit** (see below) |
| No level above 3× the median of the four before it | A relative wall check; King also uses an absolute "above ~50, make easier" | **Sound but incomplete**: no absolute ceiling |
| ×1.26 per chapter, boss ×4 its intro | No source; Schreiber's curves are "starting points" | **Unsupported, and fitted circularly** |
| Band of ×1.5 per slot | Designers work in ranges (Tactile) | **Sound idea; narrower than the noise on hard levels** |
| Final boss target 138 | The case study's ceiling of ~60; King intervenes above 50 (different units) | **Must change** |
| "Real attempts replace simulated tries" (PLAN 4.2) | Combining real and simulated data beats either alone | **Right instinct: blend, do not replace** |

**The units are unknown, and readability decides them.** A tries figure counts random plausible strokes, which makes it a pure trial-and-error measure. Voinov designs for "planning rather than trial and error". A player who reads a level aims, and should need far fewer real attempts than its simulated tries. A player who misreads it can need more. So each level's ratio of real to simulated tries is effectively a **readability index**, and the levels that fall far off the calibration line will be the comprehension failures that no gate in this repository can see. Until real data exists, the only anchor is one tester calling SINK "unplayable" at 90 simulated tries, and SINK also had a staging flaw: no room to draw at the freeze.

**The fit is circular.** The constants were fitted on 13 Oct to 21 levels, and the later levels were tuned until they landed in the resulting bands. Today's refit of the 32 non-intro, non-breather levels gives T0 7.06, G 1.22, S 5.52 with a typical miss of ×1.21 (run `python3 tools/lib/fit-curve.py`). That proves the levels hit their targets. It says nothing about whether the targets suit a person.

**The equation contradicts the ceiling.** Twelve of seventy slot targets exceed 60 simulated tries (slots 40, 45, 50, 55, 58, 60, 64, 65, 67, 68, 69 and 70), rising to 138 for the final boss. Even the breather at slot 69 is targeted at 64. Nine built levels already sit above 60:

| Slot | Level | Simulated tries | Robust winners | Noise |
|---|---|---|---|---|
| 30 | WALKIES | 62 | 31 | ±20% |
| 40 | PROTECT | 62 | 53 | ±15% |
| 50 | RAIL | 68 | 26 | ±22% |
| 55 | FLOAT | 61 | 27 | ±21% |
| 58 | CARRY | 67 | 31 | ±20% |
| 64 | TAILWIND | 71 | 34 | ±19% |
| 65 | THORNS | 89 | 28 | ±21% |
| 67 | CRACK | 64 | 8 | ±42% |
| 68 | LEVER | 69 | 54 | ±15% |

`fit-curve.py` prints "above 60" beside these levels, but the curve gate passes them, so the case study's ceiling has never been enforced. The 60 itself rests on one tester and one level. It is still the only human evidence, and the research says the easy-side error is the cheap one.

**The noise is as wide as the band, and the band is as wide as the sawtooth.** A level's relative error is about 1 ÷ √(robust winning strokes), where a robust winning stroke is one that still wins when the model hand redraws it. Most of the hard levels rest on 8–34 of them. Reaching ±15% would take about 45–50 each, which means 1.5–6 times larger sweeps on those levels.

Worse, the sawtooth's step is the same size as the band:

- A SPIKE's target is 4^0.3 ≈ **1.52×** the DEVELOP before it, and the BOSS is 1.52× the DEVELOP before it.
- The tolerance is ×1.5 either way, so a DEVELOP at the top of its band is harder than a SPIKE at the bottom of its.
- **The gate cannot tell a sawtooth from a plateau.**

The data show that plateau forming:

- Chapter 3 runs STAIRS 40, DOGHOUSE 49 (the spike, ±24%), HIVE 39, TOP DOG 46, WALKIES 62.
- Chapter 7 runs TAILWIND 71, THORNS 89, CRACK 64, LEVER 69.

The early chapters do have real teeth: BRIDGE at 29 among levels near 10, TRIGGER at 40 followed by HEADS UP at 18, CATCH at 56 followed by KITE at 16. Chapter resets also work (WALKIES 62 then COVER 9; RAIL 68 then BALLOON 30), as Schell's fractal curve asks.

**Level 1 is the hardest of the first three.** Level 1 (BLOCK, id `a1-wall`) measures 11.7 (±8%), against 9.5 (±7%) for level 2 and 10.5 for level 3. The gap to level 2 is larger than the noise, and it sits in the one slot the portals and CrazyLabs' "don't kill me yet" advice ([CrazyLabs](https://www.crazylabs.com/blog/guide-for-nailing-mobile-game-design/)) say must be easiest.

**The calibration path has a hole.** `fit-curve.py --real` expects a file written by `tools/lib/import-tries.mjs`, and **that file does not exist**. Its expected per-level "mean", if computed only over testers who won, would bias the hardest levels low; it should use the censored estimator above. The game makes zero network calls (CLAUDE.md), and the notes could not establish whether YouTube Playables exposes per-level analytics. So real numbers can come only from on-device playtest logs (`js/progress.js` already records runs, runs to first win and time per level), or from an off-platform release such as the planned Playgama Sandbox. Whether that platform reports per-level attempts, rather than only playtime and retention as CrazyGames does, still needs checking.

**The skip rule is a difficulty target in disguise.** The skip is offered after 3 failures on a SPIKE or BOSS and after 5 elsewhere. If a level's real average is *m* attempts, about (1 − 1/*m*)³ of players see the offer on a spike:

| Real average attempts on a SPIKE or BOSS | Players who see the skip offer |
|---|---|
| 2 | 13% |
| 3 | 30% |
| 4 | 42% |
| 6 | 58% |

So the owner can set real-attempt targets by deciding how many players should meet the skip. From the anchors above, with spikes made shallower because nothing is sold on failure, reasonable **starting hypotheses** are:

- about 1–2 real runs for INTRO and BREATHER slots;
- 2–3 for DEVELOP;
- 3–5 for SPIKE and BOSS (a third to a half of players offered the skip);
- a provisional ceiling of about 6–8 for any level.

These are hypotheses to test, not findings.

## Conclusion and verdict

**What is sound.** The idea of measuring each level as attempts per success, the simulated players that estimate it, the sawtooth with breathers, introducing each new element on an easy level, the wall rule and the ordering by measured difficulty all match what textbooks teach and what King, Rovio, Playrix and Royal Match do. No published difficulty method exists for draw-a-line puzzles, so the simulation here is not behind anything. Its rule that playtesting outranks the suite is the industry's own rule that the designer decides. The daily's three-star ink budget already gives players optional extra difficulty, which is what Voinov's "self-manageable difficulty" asks for.

**What must change.** The curve's numbers are a well-made ranking presented as if they were a measurement:

- Their unit has never been converted into what a person experiences.
- The constants were fitted to levels that were then tuned to them.
- The top of the curve climbs past the only human evidence there is.
- On the hard levels, noise and band are the same width, so the gate cannot tell a sawtooth from a plateau.

The cure is calibration, not a cleverer formula. Set the curve's shape by stated intent, set its scale from real runs, and let real data fold into the simulation rather than replace it.

Steps, in the order to do them:

1. **Cap the top now.** Add a hard ceiling of 60 simulated tries to the curve gate, and clamp every slot target to it until real data says otherwise. Mark the nine levels above 60 as a watch list, ease THORNS (89) first, and build nothing new into a slot whose target exceeds 60.
2. **Make level 1 the easiest level in the game.** It must still fail if the player does nothing, but any deliberate stroke should win it. Swap or ease BLOCK so that it measures below levels 2 and 3.
3. **Build the missing importer.** `tools/lib/import-tries.mjs` should turn each tester's board numbers into per-level real tries using the censored estimator: all runs ÷ winners, with skips and quits counted as runs that did not win.
4. **Run a calibration playtest with strangers.** Use the existing playtest build, aim for 8–10 people, and say nothing. Write down where each one stopped and what they thought each level wanted. Run a second session that starts testers at the chapters holding the hardest levels, so the levels above 60 get data despite survivor bias.
5. **Re-sweep the noisy levels** until each rests on about 45–50 robust winning strokes, so that "in band" means something. CRACK, at 8, comes first.
6. **Fit the calibration line** (`fit-curve.py --real`) once five or more levels have data. Treat levels far off the line as comprehension problems for the playtest notes to explain, not as numbers to tune. Test whether the best winner's robustness, such as the precision floor, predicts people better than breadth, as Roohi's best-case finding suggests it may.
7. **Re-state the curve in human units.** Write the real-attempt targets per slot role, using the hypotheses above or whatever the data supports. Then add a contrast check so that each SPIKE and BOSS must measure clearly above the DEVELOPs around it, beyond the noise. This replaces fitting constants to whatever levels exist.
8. **Keep the loop running after launch.** Gather 25–30 players per level from an off-platform release before trusting any single level's number. Refit after each batch, and each month review the handful of levels where players quit or skip most, which is King's "100 least-fun levels" scaled to this game.
