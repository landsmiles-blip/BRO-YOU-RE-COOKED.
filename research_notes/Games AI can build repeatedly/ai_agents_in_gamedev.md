# AI coding agents building games (2025–2026): evidence, failure modes, workflows, platforms, business models

*How these notes were gathered (2026-10-25):* WebFetch failed with DNS errors on every domain tried except github.com. That includes arxiv.org, huggingface.co, dev.to, levels.io, 404media.co, pocketgamer.biz, sdk.poki.com, vibej.am and gamespress.com. Unless a line says "fetched", each finding comes from **WebSearch result summaries**, not from reading the full page, so confidence is lower.

Confidence tags:
- **[H]** primary source, or several independent sources agree.
- **[M]** one secondary source, or a search summary of a primary source.
- **[L]** vendor or promotional, aggregator, or the figures conflict.

Pre-2025 sources are marked **[OLDER]**.

Model names such as "Opus-4.7", "GPT-5.5", "Claude-Opus-5" and "Kimi-K3" are reproduced exactly as the search summaries gave them from the papers. I could not open the papers to check them.

---

## 1. Published case studies and postmortems of games built mostly by AI agents

### Takeaway
The best-documented AI-built game success, Pieter Levels' fly.pieter.com, is an outlier. Its revenue came from ad slots sold to his own very large audience, not from the game's design, and its figures conflict and are self-reported. Jam evidence (about 1,170 entries in 2025 and 945 in 2026) shows that small, instantly playable browser games are what agents finish. The winners were praised for polish and "feel", which humans tuned. First-person accounts from developers keep showing the same split: agents plus bots handle code, numeric balancing and smoke tests well, while humans must supply feel, visual checking and design calls.

### Cited Findings

**fly.pieter.com (Pieter Levels, February 2025 onward)**
- **[M] Build.** Levels calls it his "first vibecoded flight simulator". He started it on 22 February 2025 and says it reached "$1M ARR in 17 days". That is an annualised run-rate, not cash collected. — [levels.io (search summary)](https://levels.io/full-multiplayer-python-websockets-game-ai)
- **[M] Stack.** Reported as Cursor, Three.js and Grok-3-generated server code. — [Indie Hackers roundup](https://www.indiehackers.com/post/2NUIOp80SUWuPmmfKoS9); [avgeekery](https://avgeekery.com/?p=39779)
- **[M] Revenue sources.** Mostly in-game ad slots sold to brands at about $5,000 per month each, plus paid planes (an F-16 at $29.99). — [Indie Hackers](https://www.indiehackers.com/post/2NUIOp80SUWuPmmfKoS9); [404 Media (search summary)](https://404media.co/this-game-created-by-ai-vibe-coding-makes-50-000-a-month-yours-probably-wont)
- **[L] The revenue figures conflict.** None is audited and all are self-reported or second-hand.

  | Figure | Source |
  |---|---|
  | $12,000 MRR / $144,000 ARR (May 2025) | [Indie Hackers](https://www.indiehackers.com/post/2NUIOp80SUWuPmmfKoS9) |
  | "more than $50,000 a month, its creator claims" | [404 Media](https://404media.co/this-game-created-by-ai-vibe-coding-makes-50-000-a-month-yours-probably-wont) |
  | About $5,000 per month (early figure) | [avgeekery](https://avgeekery.com/?p=39779) |
  | $38,360 MRR by day 10, $87,000 by day 17, about $138,000 per month by November 2025 | Aggregator, unverified: [sorceress.games](https://sorceress.games/blog/real-vibe-coding-apps-what-indies-built-in-2026); [bigideasdb](https://bigideasdb.com/how-to-make-money-vibe-coding) |

- **[M] Why it worked.** Coverage attributes the success to distribution: Levels has about 623k followers on X, and the game got a boost when Elon Musk shared it. 404 Media's headline makes the same point: "…yours probably won't". — [Indie Hackers](https://www.indiehackers.com/post/2NUIOp80SUWuPmmfKoS9); [404 Media](https://404media.co/this-game-created-by-ai-vibe-coding-makes-50-000-a-month-yours-probably-wont)
- **[L] Typical outcome.** One dataset found that the highest-earning app still on a vibe-coding subdomain makes $155 a month. The source warns this is a floor, because successful apps move to their own domains. — [bigideasdb (search summary)](https://bigideasdb.com/how-to-make-money-vibe-coding)
- **Not found.** No problem reports (cheating, server load, decline) turned up for fly.pieter.com. See Gaps.

**Vibe Coding Game Jam 2025 (organised by Levels)**
- **[M] Rules.** At least 80% AI-generated code and assets. Games had to be instantly playable on the web, with no login or heavy download, and teams had 1–4 people. Sponsors were Bolt.new, CodeRabbit and Lambda. — [Indie Hackers](https://www.indiehackers.com/post/Uz0wHG4pI3KBOiFhP5YR)
- **[M] Entries and winners.** Indie Hackers reports 1,170 entries. The winners were:
  - 1st ($10,000): *The Great Taxi Assignment* (Tomas Bencko), a GTA-like taxi game.
  - 2nd ($5,000): *Vibeware* (Matt Gordon).
  - 3rd ($2,500): *Vector Tango* ("Scoble"), an air-traffic-control game.

  — [Indie Hackers](https://www.indiehackers.com/post/Uz0wHG4pI3KBOiFhP5YR)
- **[L] Conflicting entry count, likely unreliable.** A CO/AI article claims "over 10,000 submissions". It exists as near-identical copies on many getcoai.com subdomains with inconsistent details. — [getcoai](https://getcoai.com/video/the-best-ai-made-videogames-2025-vibe-coding-game-jam/)
- **[M] What commentators valued.** The winning taxi game was praised for responsive controls, physics that "feel right" and loops that reward skill. A critic argued the tools "mostly remix existing ideas rather than inventing new ones". — [Indie Hackers](https://www.indiehackers.com/post/Uz0wHG4pI3KBOiFhP5YR)

**Vibe Jam 2026**
- **[M] Rules.** The jam ran 1 April to 1 May 2026. Entries had to be at least 90% AI-written, free and browser-playable with no login. Sponsors were Cursor, Bolt.new, Glif and Tripo AI. — [jam.pieter.com/2026](https://jam.pieter.com/2026/)
- **[L] Prize totals conflict.** The jam page says $20k/$10k/$5k, while the 8 May press release says $25k/$10k/$5k. — [jam page](https://jam.pieter.com/2026/); [press](https://vibej.am/2026/press)
- **[M] Entries.** Colyseus counted 945 submissions, 48 of them using Colyseus. Its title says "1 in 7 multiplayer games" used it. — [Colyseus blog](https://colyseus.io/blog/vibe-jam-2026/)
- The 2026 winners were not found. See Gaps.

**First-person developer accounts (2025–2026), all from search summaries**
- **[M] *Reptile Catcher*, a Godot incremental game built in one day.**
  - Workflow: Claude changes a number, then runs an automated bot to measure play length. This made balancing fast.
  - The bot was later split into five "player personalities".
  - The human did direction and playtesting.
  - Sprites were AI-generated, and the species were swapped to suit what the image tool drew well.

  — [dev.to/krenin88](https://dev.to/krenin88/building-a-game-demo-with-claude-code-in-one-day-215g)
- **[M] *Montanha: Zero Day*, a PWA platformer built in one day with Claude Opus 5.5 and Claude Code.**
  - Claude drove a headless-Chromium bot that jumped gaps and hit collision boxes, which caught more than a clean compile would.
  - A tester said one character felt more fluid. Claude found the physics parameters were identical and traced the difference to the animation sprites instead.

  — [dev.to/tiagovilasboas](https://dev.to/tiagovilasboas/i-built-a-full-pwa-game-in-one-day-with-claude-opus-55-and-claude-code-here-is-the-real-token-41p7)
- **[M] A Telegram RPG built by a non-coder.** Claude wrote the bot, deployed it, built analytics and ran "tens of thousands of simulated fights" to propose class rebalances. The author kept the design calls. — [RetroStyle Games case study](https://retrostylegames.com/blog/claude-code-game-dev-case-study/)
- **[M] Three weeks building a Python roguelike with Claude Code.** The author's lesson is to give the agent strong project patterns from the start and strong tests "at controlled choke points". — [liminalwarmth Substack](https://liminalwarmth.substack.com/p/claude-code-context-lessons)
- **[H, fetched] Claude-Code-Game-Studios, a framework of 49 agents and 72 skills.**
  - Four games were built from one brief at different `rigor` levels. The `minimal` build wrote 1 document before any code; the `standard` build wrote 30 documents over 58 minutes.
  - All four ran and passed tests. Two blind reviewers and a human playtest **ranked the 30-document build last**: "the extra 29 documents bought traceability, not a better game."
  - Its other rules: "a passing test says nothing about a menu drawn off-screen" and "A parse check is not a run". Any change that alters what the player sees needs a launched-game screenshot saved as evidence.
  - This is a single anecdote from the framework's own author, with no sample size.

  — [GitHub README](https://github.com/Donchitos/Claude-Code-Game-Studios)
- **[M, OLDER (Oct 2024 project)] NVIDIA researcher's game-jam case study (CVPR 2025 workshop).** A self-run, few-day game-jam-style project using generative AI tools. — [Spjut, CVPRW 2025](https://openaccess.thecvf.com/content/CVPR2025W/CV2/html/Spjut_A_Generative_AI_Game_Jam_Case_Study_from_October_2024_CVPRW_2025_paper.html)
- **[M] Post-game-jam student study (DiGRA 2025).** Students used generative AI for assets and hit limits of "asset reliability, quality, and creative customisation". 46% reported notable learning gains. — [Bezzina & Dingli, DiGRA 2025](https://dl.digra.org/index.php/dl/article/view/2438)
- **[H] This project's own record**, an AI agent building a physics puzzle for Playables:
  - "Two unplayable builds shipped while every gate reported green."
  - Two levels "passed every gate and still confused a real player".
  - A rendering bug drew lines at double their angle and was invisible to every positional assertion.
  - A whole feature (the TNT engine) was lost when a cloud machine was reclaimed before the work was committed.

  — [/home/user/BRO-YOU-RE-COOKED./CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md) (local file)

### Inferences
- The publicised "AI game makes $X" successes rest on the creator's distribution (audience, sponsors, ad slots), not on AI-specific quality. They are not evidence that a solo creator without an audience can repeat them.
- Every documented "finished" AI-built game is small, web-delivered and built on a well-known genre template: flight sim, GTA-like, platformer, incremental, roguelike. That fits the benchmark finding (section 2) that agents implement recognisable mechanics well.
- The repeated workflow in the success stories is: agent writes code → agent runs a bot or simulation that produces numbers → human plays and judges feel → agent chases the specific complaint. The human is the "fun sensor"; the bot is the regression net.

### Gaps
- No independent or audited revenue data exists for fly.pieter.com, and no reports of its later decline or problems were found. The levels.io and 404 Media pages could not be fetched.
- The Vibe Jam 2026 winners and any organiser postmortem (common failure types, judging criteria) were not found.
- No formal, multi-game postmortem of a commercial AI-agent-built game (with retention, plays, revenue, what broke) was found for 2025–2026.
- No Anthropic or OpenAI customer story specifically about game development was located in this pass.

---

## 2. Benchmarks and studies of LLM agents doing game-development tasks

### Takeaway
2026 brought a cluster of game-building agent benchmarks, and they agree:
- **Agents almost always produce a game that builds and runs** (93–100% build pass on GameCraft-Bench).
- **They fall to about 40–55% on full rubric scores.**
- The weakest dimensions are consistently **content depth, art and presentation, visual feedback, finding their own bugs, and preserving behaviour across edits**.
- **Visual feedback measurably helps:** GameDevBench reports +11 points for GPT-5.4 when it was given visual feedback.

Earlier level-generation work found LLMs make *playable* levels at high rates when a solver checks them (MarioGPT 88%, from 2023). Novelty is weaker and needs search or human-in-the-loop data. No study shows that LLMs can judge *fun*. One study shows LLM agents' performance tracks *relative* human difficulty.

### Cited Findings

**Game-building benchmarks (2025–2026)**
- **[M] GameDevBench** (Chi et al., arXiv 2602.11103, ICML 2026 poster).
  - Agents complete Godot 4 tasks built from 102 YouTube and 99 web tutorials. The first version had 132 tasks; the later version has 333.
  - The best agent solved 54.5% in v1 and 53.8% in the ICML version.
  - Average success falls from 51.4% on gameplay tasks to 33.0% on 2D-graphics tasks.
  - Simple visual feedback raised GPT-5.4 from 41.1% to 52.0%.

  — [alphaXiv](https://www.alphaxiv.org/abs/2602.11103); [ICML poster](https://icml.cc/virtual/2026/poster/64919); [Emergent Mind](https://www.emergentmind.com/papers/2602.11103)
- **[M] GameCraft-Bench** (arXiv 2606.17861).
  - Setup: 140 Godot 4 tasks across 15 game families. Agents submit a project plus replayable interaction traces. A verifier launches the game, replays the traces, records gameplay and scores it against a hidden rubric.
  - Best scores: Opus-4.7 (high) 41.46% and GPT-5.5 (high) 39.49%. Most agents score below 40%.
  - Build pass rates are 93.2–100%, but overall scores are low.
  - Weakest dimensions: Content Depth (39.48%) and Art & Presentation (36.86%). Core Mechanics scores higher.
  - The authors say agents "often implement recognizable mechanics" but "struggle to deliver complete games with sufficient content, functional visual feedback, and coherent presentation".
  - A secondary report says DeepSeek-V4-Pro scored 2.15%.

  — [arXiv](https://arxiv.org/abs/2606.17861); [alphaXiv overview](https://www.alphaxiv.org/overview/2606.17861); [benchmarklist](https://benchmarklist.com/benchmarks/gamecraft_bench/); [aiweekly](https://aiweekly.co/alerts/claude-code-tops-ai-game-building-benchmark-at-41)
- **[M] GameXpert-Bench** (arXiv 2608.21833), on browser-native JavaScript games.
  - Three tracks: GameGen (one request, empty workspace), GameFix (diagnose and repair) and GameOpt (six-turn optimisation).
  - Main finding: agents are better at "producing playable foundations and implementing explicit requirements" than at "discovering defects, verifying runtime behavior, or preserving functionality through changes".
  - GameFix: near-complete repair is uncommon when a task has several hidden bugs.
  - GameOpt: agents often keep the requested features across six turns, but "preservation of the core game loop and balanced improvement" is inconsistent.
  - GameGen scores per the search summary (could not verify): Claude-Opus-5 79.7, Claude-Fable-5 75.8, Kimi-K3 71.3, Claude-Opus-4.8 69.9, lowest Seed-2.1-pro 48.7.

  — [arXiv HTML](https://arxiv.org/html/2608.21833); [HF papers](https://huggingface.co/papers/2608.21833)
- **[M] V-GameGym** (arXiv 2509.20136, Findings of ACL 2026). 2,219 Pygame samples in 100 thematic clusters, 70 models evaluated, with a multimodal evaluation in a UI sandbox. Top models succeed about 45% of the time. Reported weaknesses are visual understanding and dynamic gameplay generation. — [arXiv](https://arxiv.org/abs/2509.20136v1)
- **[M] GameASG-Bench** (arXiv 2609.21293). A human writes an **evaluation-interface specification before generation**, and the agent must implement it alongside a self-contained `index.html` game. This makes testability part of the task. Its results were not retrieved. — [arXiv PDF](https://arxiv.org/pdf/2609.21293)
- **[L] WebGameBench.** Agents turn a frozen structured specification into a browser game. A runtime evaluator plays it in a real browser and labels it EXCELLENT, USABLE or UNUSABLE. Its numbers were not retrieved. — [benchmarklist](https://benchmarklist.com/benchmarks/webgamebench/)
- **[L] Other benchmarks**, existence only: GameEngineBench (Unreal C++), [arXiv 2607.03525](https://arxiv.org/pdf/2607.03525); CraftBench-UE, [arXiv 2609.23142](https://arxiv.org/html/2609.23142v1); "A2Z GameSpec-Bench", [arXiv 2609.39564](https://arxiv.org/html/2609.39564v1), which a follow-up search could not find details for (unverified). Survey: "AI for Games in the Foundation Model Era", [arXiv 2609.16679](https://arxiv.org/pdf/2609.16679).

**Agents as testers and difficulty raters**
- **[M] TITAN** (arXiv 2509.22170). LLM agents automated testing of two commercial MMORPGs with a 95% task-completion rate. This is QA, not creation. — [arXiv](https://arxiv.org/html/2509.22170v1)
- **[M] "LLMs May Not Be Human-Level Players, But They Can Be Testers"** (ACM, DOI 10.1145/3748634), on Wordle and Slay the Spire. LLM agents play worse than average humans, but their performance shows a "statistically significant and strong correlation" with human-reported difficulty. The correlation holds for *relative* difficulty between puzzles, not absolute counts. — [ACM DL](https://dl.acm.org/doi/10.1145/3748634); [ResearchGate](https://www.researchgate.net/publication/384680810_LLMs_May_Not_Be_Human-Level_Players_But_They_Can_Be_Testers_Measuring_Game_Difficulty_with_LLM_Agents)
- **[M] LLM-as-judge on situation puzzles (SPLAT).** Judges' agreement with humans varies by model, and for some models it "decreases dramatically" as puzzle difficulty rises. — [arXiv 2410.06733](https://arxiv.org/html/2410.06733v1)
- **[M] Screen understanding (Claude Plays Pokémon).** Anthropic's David Hershey said Claude is "not particularly good at understanding what's on the screen" and often walks into walls, which he attributes to sparse training data on low-resolution pixel art. A follow-up on Opus 4.5 says vision improved but "is still pretty bad". — [CO/AI summary](https://getcoai.com/news/pokemon-no-go-claudes-advanced-ai-struggles-to-navigate-pokemon-red-despite-3-7-upgrade/) (low-quality aggregator; quote widely reported); [LessWrong follow-up](https://www.lesswrong.com/posts/gogZyeistdaDFuhbG/claude-plays-pokemon-opus-4-5-follow-up)

**LLM level and game generation, with a solver as judge**
- **[M, OLDER (2023)] Todd et al., FDG 2023.** LLMs can generate Sokoban levels. Performance "scales dramatically with dataset size", and playability is checked by an A* solver. Exact percentages were not retrieved. — [arXiv 2302.05817](https://arxiv.org/pdf/2302.05817)
- **[M, OLDER (2023)] Nasir & Togelius, "Practical PCG Through LLMs".** Fine-tuning GPT-3 with human-in-the-loop rounds reached **37% playable-and-novel** levels from just 60 hand-designed rooms. — [arXiv 2305.18243](https://arxiv.org/html/2305.18243v3)
- **[M, OLDER (2023)] MarioGPT.** About **88.4%** of 250 generated levels were completable by an A* agent, against about 31% for an LSTM baseline. — [arXiv 2302.05981](https://arxiv.org/pdf/2302.05981); [TechCrunch](https://techcrunch.com/2023/02/14/mariogpt-hints-at-a-glorious-ai-generated-future-where-we-will-all-play-nintendo-forever)
- **[M] ScriptDoctor (2025), whole PuzzleScript games.** It runs a loop of human-authored examples, compiler errors and search-based agents that playtest. The authors themselves raise "the suspicion that the generated games are at best a minor variation on something it has already seen". Pass rates were not retrieved. — [arXiv 2506.06524](https://arxiv.org/html/2506.06524v1)
- **[L] SBGames 2025.** A fine-tuned LLM for Zelda-like levels reports high novelty, diversity and playability but weaker accuracy. — [SBGames](https://sol.sbc.org.br/index.php/sbgames/article/download/37377/37159)

### Inferences
- In every benchmark, the "builds and runs" bar is nearly solved, while the "complete, polished, content-rich, verified" bar sits at about 40–55%. For a solo owner, the agent will reliably deliver a working prototype. The missing half is content, presentation and self-verification, and that half needs a human or a dedicated verification harness.
- Two results point the same way: GameDevBench's gain from visual feedback, and GameASG-Bench's choice to make the test interface part of the specification. Giving the agent eyes (screenshots or films) and a testable interface written in advance are the two cheapest proven levers.
- The solver-checked level-generation literature (Sokoban, Mario, PuzzleScript) says **validity is cheap and novelty is hard**. That matches this project's finding that its generator "cannot produce a new-looking level" ([CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md)).
- LLM agents can serve as *relative* difficulty sensors for ordering levels, not as judges of fun.

### Gaps
- None of the 2026 benchmark PDFs could be opened, so per-model tables, task genres and failure taxonomies beyond the abstracts are unverified. The model names are as the search summaries reported them.
- **No study was found showing LLMs can reliably judge *fun* or engagement.** This is a real gap in the literature, not just in this search.
- The exact Todd et al. Sokoban percentages and the ScriptDoctor pass rates were not retrieved.
- Nothing measured agent performance on **multi-week** game projects (context loss over sessions). GameXpert's six-turn GameOpt track is the closest.

---

## 3. Recurring failure modes and the mitigations that work

### Takeaway
The failures that keep being reported:
- **The agent cannot see or feel the game.** Tests pass while the screen is wrong.
- **Weak content and art consistency**, which benchmarks score lowest.
- **No judgement of fun.**
- **Poor self-verification and regressions** across edits.
- **Remix-not-invent originality.**
- **Scaffolding or process bloat** that produces documents instead of better games.
- **Loss of work and context across sessions.**

The mitigations with evidence behind them:
- Screenshots and filmed play fed back to the agent.
- Automated play bots and solvers for balance and smoke tests.
- Simulation at scale for numeric balancing.
- Specifications that are testable before code is written.
- Small, known-genre scope.
- Frequent commits and persistent project rules.
- **A human playtest as the final arbiter.**

### Cited Findings
- **[H] "Cannot see the screen" or "tests pass, screen wrong".**
  - "A passing test says nothing about a menu drawn off-screen" and "A parse check is not a run". The fix: launch the game, observe it and save a screenshot as evidence for every change the player can see. — [Claude-Code-Game-Studios (fetched)](https://github.com/Donchitos/Claude-Code-Game-Studios)
  - GameDevBench: visual feedback took GPT-5.4 from 41.1% to 52.0%. — [alphaXiv](https://www.alphaxiv.org/abs/2602.11103)
  - This project: "Two unplayable builds shipped while every gate reported green… A vibrating line, a shrinking line and a line that will not sit still all satisfy an assertion about positions." — [CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md)
- **[M] Content and presentation.** GameCraft-Bench gives agents its lowest scores on Content Depth (39.48%) and Art & Presentation (36.86%) despite 93–100% build pass. — [benchmarklist](https://benchmarklist.com/benchmarks/gamecraft_bench/); [alphaXiv](https://www.alphaxiv.org/overview/2606.17861)
- **[M] Art consistency and asset quality.**
  - Students in a post-jam study cited "asset reliability, quality, and creative customisation". — [DiGRA 2025](https://dl.digra.org/index.php/dl/article/view/2438)
  - One developer changed the *game content* (which species appear) to match what the image tool could draw. — [dev.to/krenin88](https://dev.to/krenin88/building-a-game-demo-with-claude-code-in-one-day-215g)
  - Steam data shows about 60% of disclosed generative-AI use is visual assets. — [VGC](https://www.videogameschronicle.com/news/steam-games-disclosing-generative-ai-use-are-up-800-this-year/)
- **[M] Self-verification and regressions.** GameXpert-Bench: agents are weaker at "discovering defects, verifying runtime behavior, or preserving functionality through changes". Core-loop preservation across six optimisation turns is inconsistent. — [arXiv HTML](https://arxiv.org/html/2608.21833)
- **[M] Feel.** Feel complaints are invisible to the physics numbers. In one case a "feels more fluid" report turned out to be the animation sprites, with identical physics parameters. The agent was good at *investigating* once a human reported it. — [dev.to/tiagovilasboas](https://dev.to/tiagovilasboas/i-built-a-full-pwa-game-in-one-day-with-claude-opus-55-and-claude-code-here-is-the-real-token-41p7)
- **[M] Originality.**
  - "Tools mostly remix existing ideas rather than inventing new ones." — [Indie Hackers comment](https://www.indiehackers.com/post/Uz0wHG4pI3KBOiFhP5YR)
  - ScriptDoctor's authors suspect generated games are "minor variation[s]" of training data. — [arXiv 2506.06524](https://arxiv.org/html/2506.06524v1)
  - The Playables Builder's AI games got a "tepid reception… repetitive and uninspiring". — [Creative Bloq, via sibling notes](https://www.creativebloq.com/3d/video-game-design/you-can-now-play-ai-generated-games-in-youtube)
- **[H, fetched] Process bloat.** A 30-document "studio" process ranked last of four builds made from the same brief. — [Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios)
- **[H] Context and work loss across sessions.** This project lost its entire TNT engine, level and renderer when a cloud session's machine was reclaimed before the work was committed. Its rule now: "Commit and push at every checkpoint." — [CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md)
- **[M] Mitigation: strong patterns and tests at choke points.** A three-week roguelike author recommends giving the agent strong project patterns early and testing "at controlled choke points". — [liminalwarmth](https://liminalwarmth.substack.com/p/claude-code-context-lessons)

**Mitigations with evidence**
- **[M] Bots and simulation for balance.**
  - An agent changes a number, a bot measures play length, and the bot was split into five personas. — [dev.to/krenin88](https://dev.to/krenin88/building-a-game-demo-with-claude-code-in-one-day-215g)
  - "Tens of thousands of simulated fights" were used for RPG class balance. — [RetroStyle Games](https://retrostylegames.com/blog/claude-code-game-dev-case-study/)
  - A headless-Chromium bot was used for platformer collision. — [dev.to/tiagovilasboas](https://dev.to/tiagovilasboas/i-built-a-full-pwa-game-in-one-day-with-claude-opus-55-and-claude-code-here-is-the-real-token-41p7)
- **[M] Solvers as validity gates.** Playability in Sokoban, Mario and PuzzleScript generation is established by A* or search agents. — [Todd et al.](https://arxiv.org/pdf/2302.05817); [MarioGPT](https://arxiv.org/pdf/2302.05981); [ScriptDoctor](https://arxiv.org/html/2506.06524v1)
- **[M] Replayed traces and a hidden rubric**, as GameCraft-Bench's verifier does. — [arXiv](https://arxiv.org/abs/2606.17861)
- **[M] Test interface specified before generation**, as in GameASG-Bench. — [arXiv PDF](https://arxiv.org/pdf/2609.21293)
- **[M] LLM agents as relative difficulty sensors** (Wordle and Slay the Spire correlation). — [ACM](https://dl.acm.org/doi/10.1145/3748634)
- **[L, vendor] Telemetry loop through the agent.** Playgama's Sandbox and MCP pitch "game collects player data → agent analyses → publishes update". No independent outcome data exists. — [PocketGamer.biz (search summary)](https://www.pocketgamer.biz/playgama-launches-tools-for-ai-agents-to-publish-and-improve-games/); [GamesPress release](https://gamespress.com/Playgama-closes-the-iteration-loop-for-AI-built-games-agents-now-see-p)
- **[H] Limits of automated gates.** This project found that automated gates "measure fair, they cannot measure meaningful": two levels passed every gate and still confused a real player. Its answers were filming both wins and losses, a contact sheet of every opening frame, and tracing every winning solution ("census"). — [CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md)

### Inferences
- The strongest pattern across independent sources is to **close the perception gap** (screenshots or films the agent and human both look at) and **put numbers where numbers work** (solvers, bots, simulation for validity and balance). Fun, clarity and feel stay with a human playtest. Nobody has published evidence that an LLM can replace that last step.
- Process scaffolding helps when it is **verification** (evidence screenshots, replayable traces, tests at choke points). It hurts when it is **documentation volume**.
- Small scope and known genres are a mitigation in themselves. Agents score best on core mechanics of recognisable genres and worst on content depth, so a game whose content is *generated and validated by a solver* (puzzle levels, daily seeds) plays to the agent's strengths, as long as novelty is checked by eye.

### Gaps
- There is no controlled study comparing human-in-the-loop cadences (for example, a playtest every N changes) for AI-built games. The evidence is anecdotal plus this project's own record.
- There is no quantitative evidence on context loss across sessions in game projects specifically.
- No independent evidence was found that telemetry-driven agent iteration (Playgama's pitch) improves retention or revenue.

---

## 4. Platform policies toward AI-built games, and limits on publishing many similar games

### Takeaway
No major web platform bans AI-built games. What they police is **originality, IP clarity and near-duplicates**:
- **YouTube Playables** added a duplicate or "substantially identical" content rule on 2026-08-25 and reviews a creator's overall history. It has no AI-specific Playables rule that I could find.
- **Poki** accepts AI-assisted games but may ask for tools, process and prompts, and warns that games relying "too heavily on AI-generated content or templates" may not meet its standards.
- **CrazyGames** has no AI-specific rule, but rejects clones and asset flips.
- **itch.io** requires generative-AI tagging (at least for assets), and untagged AI assets are hidden from browse pages.
- **Steam** in 2026 narrowed disclosure to content players experience; code assistants are exempt.
- **Playgama** actively courts AI-agent-built games.

Industry sentiment among developers is strongly negative: in the GDC 2026 survey, 52% said generative AI harms the industry.

### Cited Findings

**YouTube Playables**
- **[H] Duplicate-content rule.** The revision history for 2026-08-25 reads: "Updated Trust and Safety requirements to add the duplicate content policy (Section 2.2)". A Playable must not be a duplicate upload or "substantially identical" to another Playable on the platform, and must be original, authorised or licensed. — [Trust & Safety requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements_trustsafety); [Revision history](https://developers.google.com/youtube/gaming/playables/certification/revisionhistory) (verified in this repo's earlier notes, [playables_platform.md](/home/user/BRO-YOU-RE-COOKED./research_notes/Free%20game%20tools%20and%20Playables%20rivals/playables_platform.md))
- **[H] Holistic review.** The review considers "the creator's overall history on YouTube and past Playables performance", and YouTube "reserves the right to reject any game". — [Certification requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements)
- **[M] Google's own AI game maker.** YouTube itself runs an AI game maker, the Playables Builder: a closed beta built on Gemini 3, announced 2025-12-16. Its games got a "tepid reception… repetitive and uninspiring" (Creative Bloq) or a "muted" response (Outlook Respawn). — [Outlook Respawn](https://respawn.outlookindia.com/gaming/gaming-news/youtube-launches-ai-playables-builder-for-creator-made-games); [Creative Bloq](https://www.creativebloq.com/3d/video-game-design/you-can-now-play-ai-generated-games-in-youtube)
- **[M] Video-only rules.** YouTube's Partner Program "inauthentic content" rules target "generic, repetitive, or template-based" videos and channels "that rely heavily on AI that produce near-identical content". They were updated in July 2025, and TechCrunch describes clarifications in July 2026. **These are video rules; I found no statement that they apply to Playables.** — [TechRepublic](https://techrepublic.com/article/news-youtube-ai-video-monetization-rules); [TechCrunch 2026-07-20](https://techcrunch.com/2026/07/20/youtube-clarifies-policies-around-ai-slop-and-upsetting-videos/)

**Poki**
- **[M] "Working With AI" page** (search summary; the page itself could not be fetched).
  - Poki accepts AI-assisted games, but games "(solely) created with the use of AI could create IP ownership issues".
  - Developers should be able to show which tools they used and give an overview of their process and prompts on request.
  - "Games that rely too heavily on AI-generated content or templates without adding distinct personality, polish, or innovation may not meet our standards. The more non-original material your game uses, the higher the risk."
  - Before submitting: remove AI watermarks and prompt text, review dialogue, and playtest everything.

  — [Poki SDK docs: Working With AI](https://sdk.poki.com/working-with-ai.html); [Poki content & player safety](https://developers.poki.com/guide/content-player-safety)
- **[L] Revenue terms (third-party).** Poki reportedly splits revenue 50/50 for players Poki brings, gives the developer 100% of players the developer brings, and asks for web exclusivity. — [Cinevva guide](https://app.cinevva.com/guides/publish-game-poki)

**CrazyGames**
- **[M] No AI rule.** A third-party audit of CrazyGames' requirements, FAQ and terms found no AI-specific rule as of 2026-09-30. — [portalready.world](https://portalready.world/portals/crazygames/)
- **[M] Rejection reasons.** The FAQ lists bugs, missing English, **clones or asset flips**, content aimed at kids and failing PEGI 12. — [CrazyGames FAQ](https://docs.crazygames.com/faq/)
- **[L] Payouts.** Ad-revenue share with the split not published, monthly payouts through Tipalti with a €100 minimum, and (per a 2026 vendor guide) no exclusivity. — [Cinevva CrazyGames guide](https://app.cinevva.com/guides/publish-game-crazygames)

**Playgama**
- **[L, promotional] Sandbox, launched 14 October 2026.**
  - Playgama Sandbox, Playgama MCP and Bridge SDK let an agent in **Claude Code or Codex publish a game "in minutes"** and get a shareable link.
  - Pitched features: player analytics the agent can read, "ad revenue from day one", a path to paid user acquisition, and reach to "a potential audience of 450 million monthly players".
  - Games that retain players are "recommended and highlighted".
  - No independent payout data, and no quality or duplicate policy, was found.

  — [PocketGamer.biz](https://www.pocketgamer.biz/playgama-launches-tools-for-ai-agents-to-publish-and-improve-games/); [GamesPress](https://gamespress.com/Playgama-closes-the-iteration-loop-for-AI-built-games-agents-now-see-p); [GameDev.net blog](https://gamedev.net/blogs/entry/2298379-built-a-game-with-ai-get-your-first-players-and-ad-revenue-with-playgama-mcp)
- **[L, vendor] Why portals reject AI games.** Playgama's own explainer says portals reject AI games for unclear IP ownership of AI output, low originality or quality, and visible AI artefacts, "rarely… just because AI was used". — [Playgama blog](https://playgama.com/blog/business-faqs/why-do-web-game-portals-reject-ai-generated-or-assisted-game/)
- **[L, vendor] Playables portfolio claims.** Playgama claims "50+ games, 200M+ gameplays on YouTube Playables". — [Playgama](https://playgama.com/publish-your-game-on-youtube-playables/)

**Steam**
- **[M] Disclosure rewrite.** Valve rewrote the disclosure form so it covers **only AI content players experience**. Behind-the-scenes efficiency tools such as code assistants are exempt.
  - Two categories remain: "AI to generate content for the game" (including the store page and marketing) and "AI content generated during gameplay".
  - Live generation requires guardrails, and players can report it through the overlay.
  - GameDiscoverCo's Simon Carless spotted the change. Coverage dates it to early 2026 (a stuff.co.za piece dated 2026-02-12); the exact date was not confirmed.

  — [VGC](https://www.videogameschronicle.com/news/valve-has-significantly-rewritten-steams-rules-for-how-developers-much-disclose-ai-use); [Game Developer](https://gamedeveloper.com/business/valve-tweaks-and-clarifies-ai-disclosure-rules-for-steam); [stuff.co.za](https://stuff.co.za/2026/02/12/are-video-game-developers-using-ai-players-want-to-know-but-the-rules-are-patchy/)
- **[M] How many Steam games disclose AI** (Totally Human Media):
  - 7,818 of about 114,126 Steam games (about 7%) disclosed generative AI as of 2025-07-13.
  - About 1 in 5 games released in 2025 disclose it, up about 700–800% on 2024 (outlets differ).
  - About 60% of disclosed uses are visual assets.
  - Disclosure is self-reported, so these are minimums.

  — [VGC](https://www.videogameschronicle.com/news/steam-games-disclosing-generative-ai-use-are-up-800-this-year/); [Insider Gaming](https://insider-gaming.com/nearly-20-of-new-steam-games-in-2025-use-generative-ai/); [GIGAZINE](https://gigazine.net/gsc_news/en/20250717-steam-games-that-use-generative-ai)

**itch.io**
- **[M, OLDER (Nov 2024)] Disclosure field.** A "Yes" answer applies an "AI Generated" tag, with sub-tags for graphics, sound, text and code. Assets using generative AI "must be tagged appropriately, or they will not appear in our browse pages". Sources disagree on whether the field is mandatory for **games** or only for asset packs. — [GamingOnLinux](https://gamingonlinux.com/2024/11/itchio-store-now-requires-ai-generated-content-disclosures-for-assets); [80.lv](https://80.lv/articles/asset-creators-on-itch-io-now-have-to-disclose-the-use-of-generative-ai/); [Games Market](https://www.gamesmarket.global/itchio-now-requires-gen-ai-content-to-be-tagged-in-all-games-and-asset-packs-711e824843d410eab51fcd9436836294/)

**Industry sentiment**
- **[H] GDC 2026 State of the Game Industry** (more than 2,300 respondents, released 2026-01-29):
  - 52% view generative AI's impact negatively, up from 30% in 2025 and 18% two years earlier. Only 7% view it positively.
  - The most negative groups: visual and technical artists 64%, designers and narrative staff 63%, programmers 59%.
  - 36% use generative AI at work: 30% at studios and 58% in business or support roles.

  — [Business Wire](https://www.businesswire.com/news/home/20260129438528/en/2026-State-of-the-Game-Industry-Report-Reveals-Widening-Effect-of-Layoffs-Broader-Perspectives-on-Generative-AI-Unionization-Tariffs-and-More); [GDC](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/); [GamesBeat](https://gamesbeat.com/state-of-game-industry-survey-sheds-light-on-layoffs-genai-views-unionization-and-tariffs-gdc-survey/)

### Inferences
- On every portal, the binding constraint for a "many small games" plan is **not** "made with AI". It is **near-duplication**: Playables' "substantially identical" rule, CrazyGames' "clones or asset flips" and Poki's "templates without distinct personality". Reskins of one template are exactly what these rules target.
- Playables' review of a creator's "overall history" and "past Playables performance" means a string of weak or near-identical submissions can plausibly hurt later ones. This is an inference; the weighting is not published.
- Code written by an agent is exempt from Steam disclosure. AI-generated *art, audio or text* is what gets labelled and scrutinised everywhere. A solo creator who uses AI for code and keeps art hand-made or procedural minimises disclosure and IP risk.
- Poki's request for "process and prompts on request" means keeping an auditable build record (commits, prompts, design notes) is a practical requirement, not just good hygiene.

### Gaps
- No YouTube statement was found on whether AI-built Playables get any different treatment. The Playables-specific T&S page has no AI clause in the sources seen.
- "Substantially identical" is not defined by YouTube. There is no guidance on whether a sequel or sister game on the same engine counts.
- The Poki and Playgama pages could not be fetched directly. Poki's quoted wording is from a search summary.
- No published acceptance or rejection rates for AI-built games exist on any portal.
- The exact date of Steam's 2026 disclosure rewrite was not confirmed.

---

## 5. A sustainable "many small games" strategy for a solo non-programmer creator

### Takeaway
The evidence base here is thin and largely vendor-written. Supported points:
- Small browser games built on a known genre template are what agents finish.
- Distribution, not build speed, decides revenue (fly.pieter.com).
- Typical earnings are low: a vibe-coded app's best-case subdomain earnings are about $155 a month, and most paid itch.io games make under $50 a month per vendor guides.
- Portals pay ad-revenue shares (Poki reportedly 50/50, CrazyGames an unpublished share).
- Every portal's duplicate and clone rules penalise a reskin portfolio.

The defensible strategy is **one reused engine with genuinely different decisions per game, plus daily or weekly content, plus analytics-driven iteration**. That last part is pitched by Playgama but not independently proven.

### Cited Findings
- **[M] Distribution beats build speed.** fly.pieter.com's revenue came from selling ad slots to brands reaching Levels' audience of about 623k X followers. — [Indie Hackers](https://www.indiehackers.com/post/2NUIOp80SUWuPmmfKoS9); [404 Media](https://404media.co/this-game-created-by-ai-vibe-coding-makes-50-000-a-month-yours-probably-wont)
- **[L] Typical earnings are low.** The best vibe-coding-subdomain app makes $155 a month (a floor). — [bigideasdb](https://bigideasdb.com/how-to-make-money-vibe-coding)
- **[L] Vendor earnings ranges.** One guide says most paid itch.io games earn under $50 a month, while top Poki studios reach about €1M a year. Another version of the same guide says a well-performing casual web game makes about $200–$2,000 a month. None of these were verified against primary data. — [Cinevva web game monetisation](https://app.cinevva.com/es/guides/web-game-monetization); [zh-CN version](https://app.cinevva.com/zh-CN/guides/web-game-monetization)
- **[L] Portal terms.** Poki 50/50 on Poki-sourced traffic with exclusivity. CrazyGames ad-revenue share with a €100 payout minimum. A forum report of zero ad revenue after a dispute with the aggregator GameDistribution shows payouts vary by aggregator. — [Cinevva Poki](https://app.cinevva.com/guides/publish-game-poki); [Cinevva CrazyGames](https://app.cinevva.com/guides/publish-game-crazygames); [html5gamedevs](https://html5gamedevs.com/topic/40362-monetising-html5-games)
- **[L, promotional] Agent-native portal.** Playgama Sandbox promises agent-driven publishing, analytics, day-one ad revenue and engagement-based promotion. — [PocketGamer.biz](https://www.pocketgamer.biz/playgama-launches-tools-for-ai-agents-to-publish-and-improve-games/)
- **[L, vendor] Playables as a portfolio channel.** A publisher (Playgama) claims 50+ games and 200M+ gameplays on Playables. Mediacube says "most developers who want to publish on Playables cannot get in directly", which pushes small creators toward publishers that take a revenue share (about 10–30% per the earlier notes). — [Playgama](https://playgama.com/publish-your-game-on-youtube-playables/); [Mediacube](https://mediacube.io/en/blog/youtube-playables-updates)
- **[M] AI-made Playables underwhelmed.** YouTube's own AI-made Playables were judged "repetitive and uninspiring", which is evidence that low-effort template games do not stand out even with platform backing. — [Creative Bloq](https://www.creativebloq.com/3d/video-game-design/you-can-now-play-ai-generated-games-in-youtube)
- **[M] Fit with agent strengths.** Agents do best on core mechanics of recognisable genres and worst on content depth and presentation (GameCraft-Bench). Validity of generated content is cheap with a solver (MarioGPT 88%), while novelty is not (Nasir & Togelius: 37% playable-and-novel even with human-in-the-loop data). — [GameCraft-Bench](https://www.alphaxiv.org/overview/2606.17861); [MarioGPT](https://arxiv.org/pdf/2302.05981); [Nasir & Togelius](https://arxiv.org/html/2305.18243v3)
- **[H] Daily content as a retention lever.** Google's Playables guidance (recorded in this project) is to aim for about 10-minute sessions, persist progress and "add a new challenge each day". The project's daily challenge reuses shipped levels at a tighter ink budget, so it is new content with no new physics. — [CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md)
- **[H] Reuse within one game.** This project found that a level generator built on its existing archetypes could only rebuild existing levels ("nine `crossing` were level 2…"). It now deals generated levels only through the daily, where the twist is the ink budget, and keeps them out of the campaign. That is a working example of using cheap AI-generated variation where a variant is acceptable (a daily) and not where it is not (a campaign, or new listings). — [CLAUDE.md](/home/user/BRO-YOU-RE-COOKED./CLAUDE.md)

### Inferences
- **One engine, many decisions.** Reusing one engine across games is efficient and matches agent strengths. But under the Playables, CrazyGames and Poki duplicate and clone rules, each new *listing* must differ in what the player decides, not only in skin. This project's "no two levels ask for the same DECISION" rule is the same test applied one level down.
- **Prefer more content inside one listing over more listings.** Daily challenges, generated or solver-validated level packs and weekly level drops inside a single game avoid the duplicate-listing risk entirely. They also give the agent the kind of work it does well: solver-validated content within a fixed engine.
- **Analytics loop.** Real player attempt counts or completion funnels should replace simulated difficulty where available. Playgama's MCP is the only tool found that pipes portal analytics directly to an agent, and it is unproven.
- **Budget the human's time for what agents demonstrably cannot do:** play the game, judge clarity and fun, look at the frozen frame and the failure screen, and approve or reject. Every source agrees this step cannot yet be delegated.
- **Expect low revenue per title.** All the credible numbers say a single small web game typically earns little without existing distribution. A portfolio or daily-content strategy is a bet on accumulation and retention, not on any single hit.

### Gaps
- No independent, published per-game revenue distribution for Poki, CrazyGames, Playgama or Playables was found. All figures are vendor guides or anecdotes.
- No case study was found of a solo non-programmer running a multi-game AI-built portfolio over months, with plays, retention and revenue.
- There is no evidence on whether portals treat several distinct games on the *same engine* by the same creator as duplicates. The policies are silent on it.
- No data was found on payout reliability or terms for Playgama Sandbox specifically.
