# Distribution: how YouTube Playables actually get plays (Agent E)

Run 5 Nov 2026. WebSearch and WebFetch only; no Chrome, no Playgama console calls, no edits outside this file.

Tags: [DOC url] = a page fetched this session. [CALC] = arithmetic shown. [MEASURED: where, when] = a number I read off a live page. UNVERIFIED = could not confirm. VENDOR = a self-interested source (it sells publishing, ads or research). INFERRED = my reasoning, not a source's claim.

Reading note: WebFetch returns a summary written by a small model, not raw page text. Every figure below is as that summary reported it. I paraphrase throughout and put no source text in quotation marks.

## 1. Question

How do Playables get plays (distribution, not design)? Which surfaces serve them, what decides who is featured, what is the path in for an indie, and what does that mean for BYC, a draw-one-line physics rescue puzzle that wants to be one of the most-played?

## 2. Method

1. Primary first: Google's Playables developer docs (home, Developer Portal guide, requirements, design requirements, trust and safety, integration, FAQ, getting started, monetization, SDK), the YouTube Help page on Playables, the YouTube blog, then Playgama's wiki (requirements, submission, MCP/sandbox pages) and Playgama's publish and blog pages.
2. Press second: mobilegamer.biz, pocketgamer.biz, TechCrunch, Tubefilter, Android Authority, Android Headlines, 9to5Google.
3. Vendors last, labelled VENDOR: MediaCube, Playgama blog, FRVR docs, Dubit (research consultancy), TubeGames (play-count tracker, third-party, not affiliated with Google).
4. For the case-study and age questions I pulled per-game pages from the TubeGames tracker (publisher, date added, plays) and did the arithmetic myself. The tracker's publisher and date fields are its own attributions, not YouTube's.

## 3. Findings

### Section 1. Every surface that serves Playables, and how each picks games

**Documented surfaces (primary sources)**

| Surface | What the source says | Tag |
|---|---|---|
| Home page shelf | A Playables shelf on the Home page | [DOC support.google.com/youtube/answer/14328604] |
| Search results | Games can be found by searching; Google's own FAQ lists Search as a place Playables appear | [DOC support.google.com/youtube/answer/14328604], [DOC developers.google.com/youtube/gaming/playables/support/faq] |
| Playables destination | youtube.com/playables, also reachable from the Explore menu | [DOC support.google.com/youtube/answer/14328604] |
| Channel Playables tab | Each publishing channel has a Playables tab with a subscribe link | [DOC developers.google.com/youtube/gaming/playables/support/faq] |
| You tab | Games saved to play later appear there | [DOC support.google.com/youtube/answer/14328604] |
| Live streams | Eligible creators can offer Playables while live streaming vertically on mobile; the Sep 2025 YouTube Live update put the Playables catalogue into live as a creator tool. No usage figures were given | [DOC support.google.com/youtube/answer/14328604], [DOC techcrunch.com/2025/09/16/youtube-live-gets-a-major-update-introduces-dual-format-streaming-minigames-and-more/] |
| Share links | A game can be shared from its card or from the in-game More menu; Play Pages have comments | [DOC support.google.com/youtube/answer/14328604] |
| Accessibility-tag filter | Announced 3 Nov 2026 per a secondary report: tags such as keyboard controls let users filter the Playables section. The report does not say search ranking changes | [DOC androidheadlines.com/2026/11/youtube-playables-is-getting-tags-so-you-can-find-games-easier.html] |

**Not documented anywhere I could fetch**
- Shorts as a Playables surface: no official page lists it. The only Shorts hits were creator videos pointing at youtube.com/playables, which I could not open as video. UNVERIFIED.
- A Gaming tab: not mentioned on the YouTube Help page or the YouTube blog posts I fetched. UNVERIFIED. [DOC support.google.com/youtube/answer/14328604]
- TV and consoles: no official statement. TubeGames (third party) says the Playables section is absent from YouTube's TV apps and the console apps, and that casting is unsupported; its own claim, checked by it on 4 Nov 2026. [DOC playables.games/how-to-play/tv/] Treat as UNVERIFIED by Google.
- Region coverage is inconsistent across sources and dates: Google's developer page says live in over 100 countries and regions [DOC developers.google.com/youtube/gaming/playables]; mobilegamer.biz (24 Sep 2026) says over 50 markets, up from seven at the May 2024 launch [DOC mobilegamer.biz/youtube-has-quietly-rolled-out-playables-across-europe/]; Android Authority (28 Oct 2026) says over 80 countries [DOC androidauthority.com/youtube-playables-educational-games-3729351/]. The Playgama blog still lists seven (older) [DOC playgama.com/blog/2026/06/04/youtube-playables/]. Which is current: UNVERIFIED; prefer Google's own page.

**How each surface ranks or picks**
- Personalisation is the only documented mechanism: with Playables history turned on, YouTube uses it to recommend relevant games; game progress does not feed recommendations; users can demote the shelf or a single game with Not interested. [DOC support.google.com/youtube/answer/14328604]
- The hub tile order is personalised, not a leaderboard. Agent C saw order labelled For you and every tile shows a play count. [DOC C:\Users\BDE\Desktop\Logic-Misfit\byc-clone\docs\research\most-played\playables-autopsy.md] (MEASURED by Agent C in Chrome, 4 Nov 2026.)
- Nothing official says how the shelf, search or destination page rank games. Neither the Google docs nor the Help page nor the YouTube blog gives any ranking or featuring statement. [DOC developers.google.com/youtube/gaming/playables], [DOC blog.youtube/news-and-events/youtube-playables/], [DOC blog.youtube/news-and-events/puzzles-beats-trivia-new-youtube-playables/]
- The Google FAQ says a newly published game may go through staged validation (limited access, staged rollouts, or automated adjustments) before full usage. [DOC developers.google.com/youtube/gaming/playables/support/faq] INFERRED: new games may get a controlled exposure ramp; the doc does not describe the ramp or its trigger.

### Section 2. Any official statement of ranking or featuring signals

DOCUMENTED, and thin:
- Review covers the API and technical rules, Trust and Safety, Privacy, other policies, the creator's overall YouTube history, and past Playables performance. [DOC developers.google.com/youtube/gaming/playables/certification/requirements] INFERRED: a channel with no history or a weak earlier Playable may be judged differently; the doc gives no weighting.
- Items marked SHOULD in the requirements are optional, but Google says doing them helps a Playable get better visibility. [DOC developers.google.com/youtube/gaming/playables/certification/requirements] This is the only official sentence linking behaviour to visibility.
- A Partner Manager supplies release details. [DOC developers.google.com/youtube/gaming/playables/certification/requirements] The Developer Portal guide does not mention a Partner Manager or the interest form. [DOC developers.google.com/youtube/gaming/playables/developer_portal]
- The Portal has an Analytics tab with retention and crash data. [DOC developers.google.com/youtube/gaming/playables/support/faq] VENDOR (MediaCube): before mid-July 2026 publishers saw only total plays (7-day, 28-day, all-time); age, geography and gender filters arrived in July 2026; average session time and retention were expected but not confirmed. [DOC mediacube.io/en/blog/youtube-playables-updates]
- No official statement mentions playtime, session length, click-through rate, retention thresholds or a quality bar as ranking inputs. NOT FOUND in any Google or YouTube page I fetched.

What is not Google's: Playgama's wiki asks for an average playtime above 8 minutes on YouTube [DOC wiki.playgama.com/playgama/game-requirements/platform-specific-requirements.md]; Playgama's blog says it looks for about 10 minutes per session [DOC playgama.com/blog/2026/06/04/youtube-playables/]. Those are Playgama's own intake filters.

**The Sandbox gate (100 plays at a 5-minute average): NOT CONFIRMED from public pages.** The public Playgama MCP page says a game that never reached moderation, or was rejected or postponed, can reopen moderation once its sandbox reaches the targets shown on its sandbox card in the developer console, checked once a day, and does not state the targets. [DOC wiki.playgama.com/playgama/mcp/tools.md] The only public 100 I found is different: a free sandbox traffic bonus aimed at about 100 gameplays, explicitly not a guaranteed count. [DOC wiki.playgama.com/playgama/mcp/tools.md] It is possible the earlier finding conflated the two. UNVERIFIED. The read-only console call get_sandbox_state would show the real targets (I did not use the MCP; owner's call).

### Section 3. Routes into Playables, and which route the top games used

**Routes**

| Route | What is documented | Timeline | Tag |
|---|---|---|---|
| Direct Google | An interest form; developer access is early access. The Developer Portal is in Private Preview: participation is by invitation and may need extra agreements. You need manager permission on a channel that has been onboarded to Playables. Limit of 200 games per channel | Google publishes none | [DOC developers.google.com/youtube/gaming/playables], [DOC developers.google.com/youtube/gaming/playables/developer_portal], [DOC developers.google.com/youtube/gaming/playables/support/faq]; pocketgamer.biz (28 Sep 2026) says access is still early access via the form [DOC pocketgamer.biz/youtube-playables-expands-to-more-than-50-markets-including-the-eu-and-nordics/] |
| Playgama | Integrate Bridge SDK, upload ZIP, Playgama runs QA and certification. Its wiki says YouTube accepts games in limited numbers, and Playgama submits only its best-performing titles, choosing with YouTube the ones that fit | Playgama says 2 to 4 weeks overall, of which YouTube review 3 to 7 days, and 24-hour review feedback on its console. VENDOR | [DOC playgama.com/publish-your-game-on-youtube-playables/], [DOC wiki.playgama.com/playgama/game-requirements/platform-specific-requirements.md], [DOC playgama.com/blog/?p=14168] |
| MediaCube | Says it opens a slot, builds, certifies, promotes, pays out; claims it guarantees a Playables release if technical requirements are met. VENDOR | 2 to 7 business days from testing to release. VENDOR | [DOC mediacube.io/en/blog/youtube-playables] |
| Big casual publishers | YouTube's gaming partnerships manager, via a LinkedIn post reported by mobilegamer.biz, highlighted SayGames, Supercent, Supersonic, Voodoo, Playgama, TapNation and CrazyLabs as among the most popular in the Playables selection. The 2023 trial group included Rovio, Voodoo, Zeptolab, Homa, Azur and FRVR | n/a | [DOC mobilegamer.biz/youtube-has-quietly-rolled-out-playables-across-europe/]. pocketgamer.biz's article did not name publishers in my fetch. Intake terms for these publishers: not researched, UNVERIFIED |
| YouTube-curated partnerships | On 28 Oct 2026 YouTube said it teamed up with Khan Academy, TED-Ed, Veritasium and others for six educational Playables; how they were chosen is not stated. Electrify Video Partners says YouTube approached it earlier in 2026 about tie-ins | n/a | [DOC blog.youtube/news-and-events/puzzles-beats-trivia-new-youtube-playables/], [DOC tubefilter.com/2026/11/03/youtube-educational-games-playables-veritasium/] |
| Creator-built | The AI Playables Builder (Gemini 3) is a closed beta through a trusted-tester form in select markets | n/a | [DOC 9to5google.com/2025/12/23/youtube-playables-builder/] |
| Other aggregators | FRVR docs mirror Google's rules and say submissions go through the YouTube Developer Portal [DOC docs.frvr.com/requirements/channels/youtube/]. GameSnacks: Playgama's wiki lists it as a separate Google platform it reviews quarterly [DOC wiki.playgama.com/playgama/game-requirements/platform-specific-requirements.md]; TubeGames attributes 33 Playables to GameSnacks [DOC playables.games/publishers/]. Its link to Playables onboarding: UNVERIFIED | n/a | |

Direct timeline claims (3 to 6 months from Playgama, 5 to 6 months from MediaCube) are VENDOR and unsourced. [DOC playgama.com/blog/uncategorized/how-to-launch-html5-game-on-youtube/], [DOC mediacube.io/en/blog/youtube-playables-monetization] Google gives no figure.

Playgama's own pages disagree on the split: 75/25 on its publish page; a progressive 70 to 90 percent (plus a fixed 50 percent for plays on its own portal network) on its blog. [DOC playgama.com/publish-your-game-on-youtube-playables/], [DOC playgama.com/blog/?p=14168] No exclusivity on either.

**Which route the top games used (MEASURED: playables.games, 4 Nov 2026; publisher and date are TubeGames attributions)**

| Game | Publisher | Added | Days live | Plays | Avg plays/day [CALC] |
|---|---|---|---|---|---|
| Tall Man Run | Supersonic | 20 Feb 2024 | 988 | 112M | 112M / 988 = 113.4K |
| Build a Queen | Supersonic (dev Bartoo) | 20 May 2025 | 533 | 107M | 107M / 533 = 200.8K |
| Snake Clash | Supercent | 12 Aug 2025 | 449 | 104M | 104M / 449 = 231.6K |
| Going Balls | Supersonic (dev Pronetis) | 16 Dec 2025 | 323 | 102M | 102M / 323 = 315.8K |
| Stealth Master | SayGames (dev Highcore) | 18 Apr 2024 | 930 | 99M | 99M / 930 = 106.5K |
| Dessert DIY | CrazyLabs | 25 Jun 2024 | 862 | 95M | 95M / 862 = 110.2K |
| Thief Puzzle | Famobi | 13 Aug 2024 | 813 | 95M | 95M / 813 = 116.9K |
| DOP 4 | SayGames | 30 Jan 2024 | 1,009 | 41M | 41M / 1,009 = 40.6K |
| Save The Pets | SUN.STUDIO | 27 Jan 2026 | 281 | 39M | 39M / 281 = 138.8K |
| Dog Escape | Sunday GmbH | 31 Mar 2026 | 218 | 11M | 11M / 218 = 50.5K |
| Tricky Twist | Bazooka | 10 Aug 2026 | 86 | 10M | 10M / 86 = 116.3K |

Sources for the rows: [DOC playables.games/games/tall-man-run/], [DOC playables.games/games/build-a-queen/], [DOC playables.games/games/snake-clash/], [DOC playables.games/games/going-balls/], [DOC playables.games/games/stealth-master/], [DOC playables.games/games/dessert-diy/], [DOC playables.games/games/thief-puzzle/], [DOC playables.games/games/dop-4-draw-one-part/], [DOC playables.games/games/save-the-pets/], [DOC playables.games/games/dog-escape/], [DOC playables.games/games/tricky-twist-brain-puzzle/].

- All seven of the top seven are from established publishers: Supersonic x3, Supercent, SayGames, CrazyLabs, Famobi. Six of the seven are from publishers on the list YouTube highlighted [CALC: Supersonic x3 + Supercent + SayGames + CrazyLabs = 6 of 7; Famobi is not on that list]. Direct-route indie entries in the top seven: none that I could identify. UNVERIFIED for any game whose route the tracker does not state.
- Publisher totals [MEASURED: playables.games/publishers/, 4 Nov 2026] and my per-title means [CALC]: Supersonic 688M over 14 titles = 49.1M each; CrazyLabs 351M / 9 = 39.0M; SayGames 538M / 14 = 38.4M; Voodoo 302M / 18 = 16.8M; Supercent 176M / 18 = 9.8M; Famobi 413M / 48 = 8.6M; Azur 129M / 19 = 6.8M; GameSnacks 201M / 33 = 6.1M; Playgama 559M / 182 = 3.07M; MediaCube 226M / 244 = 0.93M. [DOC playables.games/publishers/] The all-catalogue mean is 5.74B / 2,133 = 2.69M [CALC; totals from DOC playables.games/]. So Playgama's catalogue averages about the platform mean (3.07 / 2.69 = 1.14x) and MediaCube's about a third of it (0.93 / 2.69 = 0.35x [CALC]). Caveats: means are hit-skewed, 2026 additions have had less time, and the attribution is the tracker's. INFERRED: volume publishing does not buy plays; a few curated hits do.

### Section 4. Playgama's launch case study (5.5M plays in 7 days)

Page: Playgama blog, by its community lead, published 11 Sep 2026. [DOC playgama.com/blog/main/5-5m-plays-in-7-days-five-playgama-games-that-took-off-on-youtube-playables/] VENDOR.

What it claims:
- Five games launched in the same week and drew about 5.5M plays in roughly their first seven days: Crime and Vice City Police 2M, Camo Sniper 3D 1.2M, Draw Crash Race 968K, Destructive Car Crash Simulator 887K, Slope 3D 503K. Sum [CALC]: 2.0 + 1.2 + 0.968 + 0.887 + 0.503 = 5.558M.
- Shared traits it names: understood at once with no tutorial, familiar mechanics (Draw Crash Race mixes drawing and racing), short pick-up sessions; three of five involve cars.
- The author says five games do not make a formula and that the numbers are first-week figures, not lifetime, and not picked from months of data.

What it does not say: whether YouTube featured any of them; how they were placed; how many Playgama games launched that week (so the five could be the best of a larger cohort); what promotion Playgama ran (Playgama elsewhere says it adds traffic from its player base and paid user acquisition [DOC playgama.com/blog/uncategorized/how-to-launch-html5-game-on-youtube/]); anything about retention.

What it implies (INFERRED): that quick legibility is why they took off. The page's own evidence is five games and no control group.

**What happened next (MEASURED: playables.games, 4 Nov 2026, TubeGames added dates 27 to 29 Aug 2026, 67 to 69 days live)**

| Game | First-7-day plays (Playgama) | Plays 4 Nov | First week as share of now [CALC] | Launch rate/day [CALC] | Rate since [CALC] | Rank of 2,133 |
|---|---|---|---|---|---|---|
| Crime and Vice City Police | 2.0M | 4.6M | 2.0 / 4.6 = 43% | 2.0M / 7 = 286K | (4.6 - 2.0)M / 62 = 42K | 257 |
| Camo Sniper 3D | 1.2M | 2.3M | 1.2 / 2.3 = 52% | 1.2M / 7 = 171K | (2.3 - 1.2)M / 62 = 17.7K | 367 |
| Draw Crash Race | 0.968M | 2.2M | 0.968 / 2.2 = 44% | 0.968M / 7 = 138K | (2.2 - 0.968)M / 61 = 20.2K | 372 |
| Destructive Car Crash | 0.887M | 1.7M | 0.887 / 1.7 = 52% | 0.887M / 7 = 127K | (1.7 - 0.887)M / 60 = 13.6K | 414 |
| Slope 3D | 0.503M | 0.942M | 0.503 / 0.942 = 53% | 0.503M / 7 = 71.9K | (0.942 - 0.503)M / 62 = 7.1K | 560 |

Sources: [DOC playables.games/games/crime-and-vice-city-police/], [DOC playables.games/games/camo-sniper-3d-color-shooter/], [DOC playables.games/games/draw-crash-race/], [DOC playables.games/games/destructive-car-crash-simulator/], [DOC playables.games/games/slope-3d/]. The remaining-window day counts are my approximation (days live minus 7). YouTube rounds counters to about two significant figures, so each plays figure is approximate.

- Five-game total now: 4.6 + 2.3 + 2.2 + 1.7 + 0.942 = 11.74M [CALC]; first week 5.558 / 11.742 = 47% [CALC].
- The daily rate fell about 7x to 10x after launch week [CALC: 286/42 = 6.8; 171/17.7 = 9.7; 138/20.2 = 6.8; 127/13.6 = 9.3; 72/7.1 = 10.1].
- None of the five is near the top-decile line (see Section 5: about 7M in September). Ranks 257 to 560 of 2,133 are 12% to 26% of the way down [CALC: 257 / 2,133 = 12.0%; 560 / 2,133 = 26.3%]. So took off means roughly top quartile for a new game, not top 10%.
- Date caveat: Playgama's article is dated 11 Sep and speaks of last week; TubeGames shows the five added 27 to 29 Aug. The two sources differ by about two weeks. Either the tracker's added date is its first sighting or Playgama's wording is loose. UNVERIFIED which.

Other launch evidence: PlayZap (self-reported, eGamers.io, 16 Oct 2026) says its first two Playables passed 500K plays and that it submitted its first game for review in July; route not stated. [DOC egamers.io/playzap-teases-rush-party-trailer-as-second-game-in-five-title-youtube-playables-push/] Playgama's publish page lists no formal case studies, four developer testimonials, and a claim that its strongest titles earned $10,000 to $15,000 in a first month (VENDOR, unsourced). [DOC playgama.com/publish-your-game-on-youtube-playables/]

### Section 5. The Dubit claim: top 10% of games hold about 76.6% of plays

VERIFIED at source. Dubit library page: How many plays does a YouTube Playables game get, written by Dubit's CEO, dated 23 Sep 2026. [DOC dubit.io/library/how-many-plays-does-a-youtube-playables-game-get]

What it measures:
- A share of cumulative lifetime plays, not plays per day, from YouTube's public per-game play counters, taken from Dubit's own tracker on 23 Sep 2026 across 1,669 live games. Removed games are excluded.
- The counters count plays, not unique people; YouTube rounds them to about two significant figures; older games have had longer to accumulate, so the figure mixes popularity with age.
- Reported shape: the top 10 games hold 17.9% of about 4.8bn plays; 57 games hold half; the top 10% (167 games) hold 76.6%; median about 290K; quartiles about 110K and 1.1M; mean about 2.9M; one game in ten is above about 7M.
- Genre table (share of plays / share of games / median plays per game): Brain & Puzzle 23.6% / 37.3% (622 games) / about 170K; Simulation 22.3% / 11.8% / about 650K; Action 17.1% / 9.9% / about 420K; Arcade 14.3% / 19.9% / about 250K; Racing 13.3% / 5.7% / about 1M.

Consistency checks [CALC]: 167 / 1,669 = 10.0%; 4.8bn / 1,669 = 2.88M, matching the stated mean of 2.9M; mean / median = 2.9M / 0.29M = 10x, matching the stated ratio; 0.766 x 4.8bn / 167 = 22.0M average per top-decile game; the rest: (0.234 x 4.8bn) / 1,502 = 0.75M each. I could not recompute the 76.6% itself because Dubit's per-game data is not public.

Cross-check with a second tracker (MEASURED: playables.games, 4 Nov 2026): the top 10 sum to 112 + 107 + 104 + 102 + 99 + 95 + 95 + 88 + 83 + 75 = 960M, which is 960M / 5.74bn = 16.7% [CALC], close to Dubit's 17.9% six weeks earlier. [DOC playables.games/], [DOC playables.games/best/] Counts differ (2,133 vs 1,669); Dubit excludes removed games and TubeGames lists some REMOVED entries, so I cannot say which catalogue count is right. UNVERIFIED.

Genre read [CALC: share of plays divided by share of games]: Brain & Puzzle 23.6 / 37.3 = 0.63; Arcade 14.3 / 19.9 = 0.72; Action 17.1 / 9.9 = 1.73; Simulation 22.3 / 11.8 = 1.89; Racing 13.3 / 5.7 = 2.33. Brain & Puzzle, BYC's shelf, is the most crowded and gets less than its share per game. Dubit notes that the tracker cannot show unmet demand.

Dubit sells youth research, so treat it as VENDOR; the 76.6% is a descriptive count, not a causal claim.

### Section 6. Platform featuring versus organic discovery

No source quantifies the split. NOT FOUND.

What exists:
- DOCUMENTED: YouTube itself highlights a short named list of publishers as among the most popular, and runs its own curated pushes (educational creators, Oct 2026). [DOC mobilegamer.biz/youtube-has-quietly-rolled-out-playables-across-europe/], [DOC blog.youtube/news-and-events/puzzles-beats-trivia-new-youtube-playables/]
- VENDOR: Playgama describes traffic as organic reach from native discovery [DOC playgama.com/blog/2026/06/04/youtube-playables/]; MediaCube describes a loop where strong retention leads to more surfacing and more sessions, which it labels its own inference from limited data [DOC mediacube.io/en/blog/youtube-playables-monetization]; MediaCube also says traffic is free, which it calls organic. None is evidence.
- INFERRED from Section 4: five games from one publisher shipped together, took about 47% of their first 68 days' plays in week one, then fell 7x to 10x. That fits a new-release exposure window or a publisher push, and cannot separate them.
- INFERRED from Section 3: four of the top seven (Tall Man Run, Stealth Master, Dessert DIY, Thief Puzzle) have been live 813 to 988 days and the other three 323 to 533 days [DOC per-game pages in Section 3], so featuring, publisher traffic and age are tangled; the plays counter cannot separate them.

Counter-evidence, in both directions:
- Design or product beat publisher size: Save The Pets, from SUN.STUDIO (listed as developer and publisher), reached 39M and rank 24 in 281 days, an average of 138.8K per day [CALC above], higher than the lifetime averages of Tall Man Run, Stealth Master, Dessert DIY and Thief Puzzle (106K to 117K). It is a draw-a-line rescue puzzle, BYC's genre. How it got onto Playables (direct or through a publisher) is not stated. UNVERIFIED. [DOC playables.games/games/save-the-pets/]
- Dog Escape (Sunday GmbH) reached 11M in 218 days and Tricky Twist (Bazooka) 10M in 86 days. [DOC playables.games/games/dog-escape/], [DOC playables.games/games/tricky-twist-brain-puzzle/]
- Publisher backing did not guarantee speed: DOP 4 from SayGames averages 40.6K per day over 1,009 days [CALC above]. And Playgama's own five launches, the publisher's best, sit at 0.9M to 4.6M after about 68 days.
- Agent C (4 Nov) found no separation by publisher size among draw games opened; Playgama (about 945K subscribers) sat beside studios with 69K to 150K. [DOC playables-autopsy.md]
- VENDOR contrary claim on genre: MediaCube says draw-and-escape puzzles are its strongest new category on plays per day, but the metric is total plays divided by days in catalogue, so it blends launch spike with decay, and it publishes no raw data. [DOC mediacube.io/en/blog/youtube-playables-game-mechanics]

### Section 7. Creators and influencers driving traffic into Playables

NOT FOUND for the thing asked. No source I fetched documents a creator linking a Playable from a video, Short, description or pinned comment, and none reports that it moves plays.
- The Google SDK has an open-content call that games use to open a YouTube video or another Playable from inside a game; it documents no way for a video to deep-link into a Playable. [DOC developers.google.com/youtube/gaming/playables/reference/sdk]
- Documented creator touchpoints are narrow: the channel Playables tab, and offering Playables while live streaming vertically on mobile. [DOC developers.google.com/youtube/gaming/playables/support/faq], [DOC support.google.com/youtube/answer/14328604]
- The educational tie-ins with Veritasium and others are the only creator-linked traffic story. Electrify says orders for a physical tabletop game spiked as Veritasium fans shared high scores; no play counts are reported. [DOC tubefilter.com/2026/11/03/youtube-educational-games-playables-veritasium/], [DOC wersm.com/youtube-uses-educational-creators-to-give-playables-a-reason-to-matter/]
- VENDOR: MediaCube says creators can monetise by sending their channel audience to their own game on Playables; no traffic data. [DOC mediacube.io/en/blog/youtube-playables]. A Playgama guide predicts native video-to-game linking tools; that is a forecast. 
- MrBeast-style traffic: searches found nothing. UNVERIFIED either way.

### Section 8. Thumbnail and branding rules, and required sizes

- Thumbnails must be supplied in several aspect ratios; the public pages do not name the ratios or give pixel sizes. [DOC developers.google.com/youtube/gaming/playables/certification/requirements_design?hl=en]
- Rule: no branding or logos in thumbnails, description or title. [DOC developers.google.com/youtube/gaming/playables/certification/requirements_design?hl=en] Rule: no misleading title, thumbnail or description. [DOC developers.google.com/youtube/gaming/playables/certification/requirements_trustsafety] Metadata and thumbnail updates go through review. [DOC developers.google.com/youtube/gaming/playables/support/faq]
- The same design page says full metadata detail is in the Developer Portal. [DOC developers.google.com/youtube/gaming/playables/certification/requirements_design?hl=en] The Portal guide says to upload one thumbnail in each aspect ratio and points back to the design page. [DOC developers.google.com/youtube/gaming/playables/developer_portal]
- Verdict on what the owner was told: CONSISTENT, NOT PROVEN. Google's public docs do not publish pixel sizes and point to the Developer Portal for them, which fits the claim. I could not read the Portal (Private Preview, invitation only), so I cannot confirm that sizes are given there. A web search for Playables thumbnail sizes returned only generic YouTube video thumbnail sizes, which do not apply (search results only, no page fetched, so no DOC tag). playables.in, a third-party guide, gives only game aspect ratios and no thumbnail sizes. [DOC playables.in/youtube-playables-requirements/]
- Do not confuse two lists. The nine ratios 9:32 through 32:9 on the design page are for the game canvas, not thumbnails. [DOC developers.google.com/youtube/gaming/playables/certification/requirements_design?hl=en]
- Playgama's sandbox does publish cover sizes: square 800x800, portrait 1080x1920, landscape 1920x1080, PNG or JPEG, all three required. [DOC wiki.playgama.com/playgama/mcp.md] That is Playgama's, not YouTube's. Playgama's blog says it supplies YouTube-specific creatives [DOC playgama.com/blog/2026/06/04/youtube-playables/].
- Open question: whether a stylised game-title wordmark inside a thumbnail counts as a logo. The rule text is short and I found no reviewer guidance. UNVERIFIED.

## 4. What it means for BYC (proposals only)

1. **Set the target by the data, not the label.** Top-decile entry was about 7M cumulative plays in September (Dubit); the top 50 starts near 25M (TubeGames, 4 Nov). [DOC dubit.io/library/how-many-plays-does-a-youtube-playables-game-get], [DOC playables.games/best/] Pace to reach them in a year [CALC]: 7M / 365 = 19.2K per day; 25M / 365 = 68.5K per day. Save The Pets averaged 138.8K per day for 281 days, so the genre can do it, but that game is a survivor.
2. **Treat the route as the main lever, and the main unknown.** Direct Google access is invitation-only with no stated timeline. Playgama is curated (its wiki says it picks best performers) and its own five launches ended at 0.9M to 4.6M after about 68 days, around the platform mean per title. The big publishers own the top of the table and are the only route with a record of 38M to 49M per title, but I found nothing on how they take on a solo game. Proposal: ask Playgama three things in writing before building anything more: who decides what goes to YouTube, which channel hosts the game, and whether a game can be shown to YouTube on the strength of sandbox telemetry.
3. **Use the sandbox as the pitch.** Playgama's gate is a console-side target (Section 2). Real session data from the sandbox is what a publisher or Playgama will weigh. This matches the existing plan to wait for real telemetry. Confirm the real targets with the read-only sandbox state call, with the owner's yes.
4. **Plan for a launch week that is half the story.** The five Playgama games took 43% to 53% of their first 68 days in week one. Proposal: do not go live before sound, thumbnails and the title question are settled; every metadata or thumbnail change after launch needs review. [DOC developers.google.com/youtube/gaming/playables/support/faq]
5. **Thumbnails.** Proposal: prepare 16:9, 1:1 and 9:16 at generous size, no logos, no wordmark, nothing that misleads. Get exact pixel sizes from Playgama's console or the Portal before cutting final art; do not assume Playgama's 800x800, 1080x1920, 1920x1080 are YouTube's.
6. **Do not budget for influencer traffic.** No documented link path exists from a video or Short into a Playable. The owner's own channel could still help in ways no source documents: any such effect is UNVERIFIED.
7. **Genre crowding.** Brain & Puzzle is the most crowded shelf and under-indexes per game (0.63 [CALC]), while the genre's best (Thief Puzzle, Save The Pets, DOP) are in the top 30. So being a draw puzzle is not a plus by itself; Agent C reached the same conclusion from tile data. [DOC playables-autopsy.md] What differs for BYC (the death replay with a stated reason, the first-minute design) has no evidence either way as a ranking factor. UNPROVEN.
8. **Keep a public yardstick.** Proposal: log BYC's plays against the TubeGames tracker weekly, as plays per day, not cumulative, so age does not mislead.

## 5. Limits

- Fetch summaries are second-hand; I could not read raw pages, and a few short sources contradicted each other by date or count.
- The Developer Portal, Playgama console and YouTube Studio are gated; the Portal's real thumbnail specs, the real Sandbox targets and any Partner Manager terms stay unread.
- TubeGames publisher, added-date and play figures are a third-party tracker's; YouTube rounds counters to two significant figures; days live may be first-seen dates. Catalogue size conflicts across 1,091 (Agent C hub scrape), 1,669 (Dubit, 23 Sep), 2,133 (TubeGames, 4 Nov) and about 1,477 (MediaCube, 4 Sep). UNVERIFIED which is right.
- Cumulative plays encode age; I only used per-day averages as a rough control, and those blend launch spike with decay.
- I did not watch YouTube videos (an indie developer's three-game account was only a search snippet), could not open the Medium indie-developer post (certificate error), and did not research publisher intake terms.
- No source quantifies featuring versus organic; Section 6 is inference where marked.

## 6. Sources (all fetched 5 Nov 2026 unless marked)

Primary (Google and YouTube)
- https://developers.google.com/youtube/gaming/playables
- https://developers.google.com/youtube/gaming/playables/developer_portal
- https://developers.google.com/youtube/gaming/playables/certification/requirements
- https://developers.google.com/youtube/gaming/playables/certification/requirements_design?hl=en (also fetched without the language parameter)
- https://developers.google.com/youtube/gaming/playables/certification/requirements_trustsafety
- https://developers.google.com/youtube/gaming/playables/certification/requirements_integration
- https://developers.google.com/youtube/gaming/playables/certification/best_practices_design
- https://developers.google.com/youtube/gaming/playables/certification/faq
- https://developers.google.com/youtube/gaming/playables/support/faq
- https://developers.google.com/youtube/gaming/playables/reference/getting_started
- https://developers.google.com/youtube/gaming/playables/reference/monetization
- https://developers.google.com/youtube/gaming/playables/reference/sdk
- https://support.google.com/youtube/answer/14328604
- https://blog.youtube/news-and-events/youtube-playables/ (28 May 2024)
- https://blog.youtube/news-and-events/puzzles-beats-trivia-new-youtube-playables/ (28 Oct 2026)

Playgama (vendor and publisher)
- https://wiki.playgama.com/playgama/game-requirements/platform-specific-requirements.md
- https://wiki.playgama.com/playgama/game-requirements (index), https://wiki.playgama.com/playgama/llms.txt
- https://wiki.playgama.com/playgama/submitting-a-game.md, /faq/submitting-a-game.md, /faq/game-moderation.md, /faq/general.md, /guides/platform-launch.md, /quick-start.md
- https://wiki.playgama.com/playgama/mcp.md and /mcp/tools.md
- https://playgama.com/publish-your-game-on-youtube-playables/
- https://playgama.com/blog/main/5-5m-plays-in-7-days-five-playgama-games-that-took-off-on-youtube-playables/ and https://playgama.com/blog/?p=14275
- https://playgama.com/blog/2026/06/04/youtube-playables/ (dated 4 Jun 2026, updated 22 Oct 2026)
- https://playgama.com/blog/?p=14168 (dated 9 Sep 2026)
- https://playgama.com/blog/uncategorized/how-to-launch-html5-game-on-youtube/ (24 Apr 2026, updated 22 Oct 2026)
- https://dev.to/playgama/youtube-playables-might-become-one-of-the-most-important-platforms-for-web-games-144h

Press
- https://mobilegamer.biz/youtube-has-quietly-rolled-out-playables-across-europe/ (24 Sep 2026)
- https://www.pocketgamer.biz/youtube-playables-expands-to-more-than-50-markets-including-the-eu-and-nordics/ (28 Sep 2026)
- https://techcrunch.com/2025/09/16/youtube-live-gets-a-major-update-introduces-dual-format-streaming-minigames-and-more/
- https://www.tubefilter.com/2026/11/03/youtube-educational-games-playables-veritasium/
- https://www.androidauthority.com/youtube-playables-educational-games-3729351/ (28 Oct 2026)
- https://www.androidheadlines.com/2026/11/youtube-playables-is-getting-tags-so-you-can-find-games-easier.html (3 Nov 2026)
- https://9to5google.com/2025/12/23/youtube-playables-builder/
- https://wersm.com/youtube-uses-educational-creators-to-give-playables-a-reason-to-matter/ (commentary)
- https://egamers.io/playzap-teases-rush-party-trailer-as-second-game-in-five-title-youtube-playables-push/
- https://tech-insider.org/youtube-playables-50-markets-eu-nordics-2026/ (low-grade aggregator, used only for cross-checking)

Vendors and trackers (self-interested or third party)
- Dubit: https://dubit.io/library/how-many-plays-does-a-youtube-playables-game-get (23 Sep 2026); also https://www.dubit.io, /blog, /reports, /library, /blog/roblox-top-20-rfy (checked for the 76.6% and not found there)
- MediaCube: https://mediacube.io/en/blog/youtube-playables, /youtube-playables-updates, /youtube-playables-monetization, /youtube-playables-game-mechanics
- FRVR: https://docs.frvr.com/requirements/channels/youtube/
- TubeGames: https://playables.games/, /best/, /publishers/, /games/, /how-to-play/tv/, and per-game pages under /games/ for the 16 titles named above
- playables.in (unaffiliated third-party guide; promotes Playgama): /youtube-playables-requirements/, /youtube-playables-interest-form/
- Agent C: C:\Users\BDE\Desktop\Logic-Misfit\byc-clone\docs\research\most-played\playables-autopsy.md (read this session)

Searched but not fetched or unreachable: Medium indie-developer post (certificate expired); a YouTube video about publishing three indie games (not viewable); pulse.bot and shattered.io items (search snippets only).
