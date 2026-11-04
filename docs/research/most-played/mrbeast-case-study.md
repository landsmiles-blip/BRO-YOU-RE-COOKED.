# MrBeast ecosystem and packaging: case study (Agent A)

Prepared 2026-11-04. Evidence grades: MEASURED (I saw the data myself), REPORTED (named third party), INFERRED (my reasoning), UNPROVEN, UNKNOWN (not found).

## 1. Question

What does MrBeast's operation do on purpose that yields (1) a click and (2) a long session, and which of those moves can a small indie puzzle game ("BRO, YOU'RE COOKED.", draw-one-line physics rescue puzzle) reuse? This file covers channel ecosystem, series vs standalone, packaging (thumbnails and titles), persona, and reported process.

## 2. Method and what was fetched (all 2026-11-04)

- Chrome (own tab, since closed): youtube.com/@MrBeast/videos, /shorts, and the /videos pages of @MrBeast2, @MrBeastGaming, @BeastReacts, @BeastPhilanthropy. Read the rendered grid text (title, duration, views, age, vidIQ-extension VPH and outlier multiple). Same-origin YouTube oembed and /about page fetches for titles and subscriber counts. Search-result fetch to find 2017-2019 video IDs.
- vidIQ: `channel_videos` (long, popular=true) = 5 credits; `get_videos_by_ids` for the 34 newest long videos = 5 credits (exact publish dates, views, VPH). `get_images` (0 credits) to view 44 real thumbnails at 640 px. **Total vidIQ spend: 10 of 60 allowed.**
- Web: TechCrunch (VidCon 2022), Time (Feb 2024), Fortune (Sep 2024, Apr 2026), Dexerto (Sep 2024), Social Media Today (Mar 2024), Forbes snippet (Oct 2024), Sherwood (Aug 2024), The Star/NYT reprint (May 2024), UNILAD (Jan 2025), plus search summaries. No leaked-file mirrors were opened or downloaded; handbook claims below come only from mainstream reporting.
- Caveat on the tool pages: WebFetch returns a small model's summary, so reporting details are paraphrase-of-summary; verify before quoting publicly.

## 3. Findings

### 3.1 Channel ecosystem (MEASURED, 2026-11-04, from YouTube pages)

| Channel | Subs | Videos | Role / format mix | Recent cadence |
|---|---|---|---|---|
| MrBeast (@MrBeast) | 525m | ~1,011 | Flagship long-form stunts 14-58 min, plus separate Shorts feed | 34 long videos from 2025-07-19 to 2026-10-31 = about 2 per month (roughly every 14 days). Shorts about weekly in the visible grid (4 days, 1 wk, 2 wk, 3 wk, 1 mo ago) |
| MrBeast 2 (@MrBeast2) | 63m | 249 | Behind-the-scenes, "how it was made" explainers (e.g. "How 1 Person Solved A $1,000,000 Puzzle!" 58m), Beast Games episodes, sponsor/brand tie-ins, collabs | About 1 upload per month or less on the visible grid (2 mo, 2 mo, 6 mo, 8 mo ago ...) |
| MrBeast Gaming (@MrBeastGaming) | 61.1m | 187 | Minecraft and game-challenge videos with the same "$ / survive / 100 days" frames (e.g. "$10,000 Every Day You Survive In Minecraft" 72m views; "If You Escape, You Win $1,000,000" with Call of Duty 57m) | About 2 per month (2 wk, 3 wk, 1 mo, 1 mo, 2 mo, 2 mo ...). Views 31m-101m |
| Beast Reacts (@BeastReacts) | 37.3m | 233 | Short (8-10 min) compilation/reaction clips ("Impossible Moments...", "Funniest Fails...") | **Dormant:** newest visible upload "3 yr ago". Views 28m-106m each |
| Beast Philanthropy (@BeastPhilanthropy) | 30.6m | 74 | Charity builds and giveaways, 5-19 min | Irregular: 9 days, 6 mo, 9 mo, then roughly 1 yr+ gaps. Views 4.8m-26m |
| Beast Games | UNKNOWN | UNKNOWN | The show is an Amazon Prime Video series (REPORTED, Forbes AU/Time/Fortune). I found no official Beast Games YouTube channel: the "Beast Games" and "Brand is Beast Games" handles I found have 277 and 50 subscribers and are unrelated game-dev accounts. Season 2 full episodes sit on @MrBeast2 | n/a |
| Other | Beast Hacks (@BeastHacks): 175 subscribers, 19 videos (MEASURED, not meaningful). Feastables and MrBeast Burger YouTube channels: not checked (handles 404 or no count) | | |

Notes:
- Short vs long (MEASURED): the main channel has a Shorts tab with its own hits. Examples: "Don't Pop the Balloon" 300m views, "$1 vs $10,000 Cake" 208m, "Last To Fall Wins" 144m, "Paying For Food With My Car" 150m, "What's Inside My Briefcase?" 124m. A few Shorts flopped by his own standard (0.1x-0.3x outlier multiple: "Read My Book, You Could Win $1,000,000" 30m, "World's Largest Tennis Match" 23m, "Can We Build an Entire Village?" 32m). No separate "Shorts output" channel exists on the handles I tested (@MrBeastShorts returned 404). Which channel hosts the daily Shorts reported by Sherwood: main channel, per the visible Shorts tab (MEASURED).
- INFERRED: The ecosystem is a hub with spokes: each spoke serves a different viewing intent (long stunt, behind-the-scenes, game, short clip, charity). Spokes that depend on a different content engine (Beast Reacts: low-cost compilations) went dormant.

### 3.2 Series vs standalone (MIXED)

- MEASURED: The main channel is mostly standalone episodes that reuse a small set of repeatable frames ("Survive N days, win $X", "Last To Leave...", "N people fight for $X", "$1 vs $X", "Ages 1-100", "Beat [celebrity], win $X"). Within the 34 newest long videos: 10 titles use "Win $X", 8 use "Survive ... Days", 4 are "N [group] Fight For $X". Several have numbered sequels (the "Chained To..." / "Stranded With Your Ex" / "Island With Your Ex" trio; "Last To Leave" grocery store, mansion, plane). INFERRED from titles: these are format families, not strict ordered series; each episode is watchable cold.
- Day counters ("DAY 201", "DAY 111", "DAY #6") on thumbnails are a within-video progress device, not a series number (MEASURED on thumbnails).
- REPORTED (UNILAD, 9 Jan 2025, summarising his chat with Samir Chaudry): he said he stopped making "$1 vs ..." videos and prefers to end a format while it still works, because formats fade; he did not want another five. The last one I can see was "$1 vs $1,000,000,000 Futuristic Tech!" (2026-01-24 per vidIQ date, so he did make more later; INFERRED: the "stopped" statement was not a permanent ban). Also REPORTED (search-summary of the Jon Youshaei interview, low-confidence): he aims to retire formats before they go stale.
- REPORTED (TechCrunch, 24 Jun 2022): he compared a channel's audience to a show's audience and warned that abrupt content pivots can confuse viewers.
- REPORTED: The $456,000 Squid Game video (MEASURED 981m views, 2021-11-24, the highest in the popular list I pulled) was later turned into Amazon's Beast Games (Time TIME100 2025; Forbes AU). Standalone viral hit became a series. WHY (his reported reason): the format worked on YouTube; Amazon's pitch was to mirror his fast, high-production style. Critics panned the simplicity and editing speed (REPORTED via search summary; weak source). He admitted too many self-elimination games and promised more skill-based ones in season 2 (REPORTED, Dexerto/esports.gg summaries).
- UNPROVEN: any claim that he chooses series for retention reasons. I found no first-party statement on that.

### 3.3 Packaging: thumbnails and titles (MEASURED from 44 thumbnails, see table section 4)

Of the 30 newest long videos (2025-07 to 2026-10, all 30 viewed; four more of the 34 not viewed):
- Face present: 30/30 (the Arctic one has a tiny full-body figure; the face is not readable at small size). Face almost always on the left third, large, looking toward camera. Usually one hero face, a secondary person on about 12/30.
- Emotion is high-arousal: grimace or snarl with teeth about 10/30; wide grin with teeth about 9/30; shock or wide eyes about 6/30; exhausted/hurt (dirt, scratches, torn clothes) about 8/30 (overlaps exist). Neutral or smug: rare (Haaland and Ronaldo thumbnails put him in a face-to-face scream).
- Text overlay: only 11/30 have added text, and it is 1-2 words: "DAY n" / "DAY #n" (9), "BEFORE / AFTER" (1), "100 COPS" (1), "ANIMAL #967" (1). 19/30 have no added text; the title carries the message. Plus in-scene words ("SCHOOL", "HOLLYWOOD", "POLICE").
- Colours: saturated primary palette. Frequent red outfits or red accents (jumpsuits), blue/cyan (sky, sea, tracksuits), yellow (buses, banknote bands, snake, ice-cream), gold. Backgrounds are real, high-detail and bright; thumbnails read as photographs of a scene with a clearly lit hero subject (INFERRED: they are heavily composited or AI-assisted; several look synthetic, I cannot verify method).
- Subjects: 1 main subject + 1 big prop/threat is the dominant structure: cops, spikes, snake and scorpion, robot, lion, giant wave, plane. About half are "one person vs overwhelming scale" (100 cops, 50 pilots on a pyramid, a crowd around a jet).
- Titles (MEASURED, my word counts): 30 titles averaged 7.0 words (range 4-11). 25/30 contain a number. 17/30 contain a dollar amount. Typical grammar: a premise plus a prize or condition ("Beat Haaland, Win $100,000").
- Curiosity gap: not a "mystery" gap. The title states the whole premise; the gap is "will he/they succeed?" and "how?" This is an INFERRED reading; he sells the outcome as uncertain, not hidden.
- Stakes: money is explicit in 17/30 titles; physical danger or deprivation is explicit in the thumbnail for about 14/30.
- Thumbnail-title redundancy is low by design (INFERRED): the title says "what/prize", the image shows "how bad/big" (distress, scale).

Change across time (MEASURED):
- 2017: raw webcam still, no stylisation ("I Counted To 100,000!", "Saying Logan Paul 100,000 Times"), unfocused text, bedroom background. 2017-18: yellow/white outlined text, huge words ("GIVING RANDOM PEOPLE $1000!" in 4 stacked words, green dollar). 2018: close-up of recipient and cash. 2019: first branded look: bold number ("#801" drive-thru) and face of him. 2021: Squid Game: face cropped by a broken mask, almost no text. 2022+: polished composites, face large, minimal text. 2023: split layouts and corner price labels ("$1" vs "$1B") with centered smiling face. 2025-26: rawer distress shots (dirty, exhausted faces) plus "DAY n" counters and giant-scale sets.
- REPORTED (Social Media Today, 8 Mar 2024, YouTube-hosted talk with his thumbnail lead): his face has been in thumbnails since 2019; a closed-mouth test over about 30 videos reportedly raised watch time slightly; the team brainstorms about 50 thumbnail/title concepts per video; the title and thumbnail are developed before filming; thumbnails must be legible at small size and the video must deliver on the promise quickly. Figures like "$10,000 per thumbnail" and "20 variations" are in that article but are second-hand.
- REPORTED (Time, 15 Feb 2024): he favours mouth-open faces (smile or grimace) and said he relies more on instinct than analytics for thumbnails. This slightly contradicts the "closed-mouth" finding and the "data-driven" reporting (conflict kept unresolved: INFERRED that the team tests heavily but Jimmy reportedly judges by gut).
- MEASURED live A/B signal: on 2026-11-04 the channel page showed the newest video as "Beat LeBron In Basketball, Win $100,000" in one load and as "Beat Haaland, Win $100,000" on a later load (oembed and vidIQ both say "Beat Haaland"; the thumbnail is the Haaland football one). Same video ID, different titles. INFERRED: a title test (YouTube Test & Compare) was running, but I cannot prove it. This is the only direct evidence I saw of title testing in the wild.

### 3.4 Persona and hook style

- REPORTED (Time, Feb 2024): eager-to-please, ambitious; about 300 employees on the creator side; says he can make almost anything go viral; spends heavily (about 12,000 hours of footage for a 15-minute video, per the article); changes plans until the last minute.
- REPORTED (Time): he tells viewers what will happen in the first 10 seconds.
- REPORTED (Fortune, 8 Apr 2026): his schedule is mapped to the minute and a body double stages and tests thumbnail concepts; 15-hour days; Beast Games season 2 filmed alongside YouTube production.
- MEASURED (titles/thumbnails): on-camera role varies by format: participant (survivor, challenger), referee in a striped shirt (Hollywood, robot, strongest-man, pilots thumbnails), host/benefactor in a suit smiling (schools, mansion, gold busts), narrator. The referee costume appears in 6 of 30 recent thumbnails (INFERRED: it signals "fair contest" and clarifies he is not a contestant).
- Collaborators: the grid shows named collaborators in titles or thumbnails: Mark Rober (water video), Jon Youshaei (MrBeast 2), Call of Duty and Salesforce (brand tie-ins), celebrities and streamers as contestants, an unnamed female co-star in the "Ex" series. I did not verify names of the people in thumbnails beyond the titles.
- REPORTED: his own description of a persona shift: Sherwood (Aug 2024) notes he said in March 2024 he was adding more personality after saying in 2023 he had removed it. The newest videos have him in front of camera in most thumbnails (MEASURED).

### 3.5 Deliberate process (retention obsession)

- REPORTED, first party: TechCrunch (24 Jun 2022, VidCon) says he watches retention drop-off graphs, treats holding 70% retention on a 30-minute video as the harder, more meaningful goal, and sketches thumbnails before filming. He also said he has never seen evidence that longer is better. Time (2024) says he is preoccupied with keeping viewers watching.
- REPORTED, mainstream: a leaked 36-37 page internal guide ("How to Succeed in MrBeast Production") surfaced in Sep 2024. Fortune (26 Sep 2024) says Business Insider verified with ex-staff that it came from MrBeast; MrBeast did not comment to Fortune; Fortune's piece covers work ethic, escalating difficulty, finding cheaper ways to get the same shock, working on many videos in parallel. Dexerto (16 Sep 2024) says the guide, written as an informal brain dump, names click-through rate, average view duration and average view percentage as the metrics he cares about, stresses the first minute for retention, and says titles pair with thumbnails to win the click. Authenticity: not confirmed by him in these reports; treat as REPORTED, not MEASURED. The thumbnail-title-first workflow also appears in the YouTube-hosted talk (above) and was echoed at VidSummit 2024 per Forbes snippet.
- REPORTED (Forbes snippet, Oct 2024): the team ensures the intro delivers on the thumbnail's promise.
- UNPROVEN: specific claims circulating in secondary blogs ("first sentence matches the title, first shot matches the thumbnail"; "re-engagement at minutes 3 and 6"; "about 70% retention on all videos"). I only saw them in low-grade summaries.

## 4. Thumbnails and titles analysed (MEASURED: thumbnails viewed via vidIQ get_images at 640x360; views/dates from vidIQ and YouTube grid, 2026-11-04)

Legend: Face = emotion; Subj = people/main objects; Col = dominant colours; Txt = overlay words; T = title words; # = number or $ in title; Gap/Stakes = my reading.

### 4a. 30 most recent long uploads (newest first)

| # | ID | Title | Pub | Views | Face/emotion | Subj | Colours | Txt overlay | T | #/$ | Stakes/gap |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | _c2e1NcI3Sc | Beat Haaland, Win $100,000 (also served as "Beat LeBron..." on one load) | 2026-10-31 | 62m | snarl, teeth, grabbing | 2 faces + ball | red/sky blue/green pitch | none | 4 | $ | duel vs star; prize |
| 2 | RE3_PGwDwhw | Lose 150 Lbs Together, Win $250,000 | 2026-10-17 | 178m | smile after, tired before | 2 people x2 | blue wall / red wall | BEFORE, AFTER | 6 | $,# | transformation, prize |
| 3 | plN7JMbadRg | Eat Everything In A Grocery Store, Win $1,000,000 | 2026-10-03 | 324m | exhausted, milk dripping | 1 + food | grey shelves, red watermelon | DAY 201 | 8 | $ | long endurance, 58 min |
| 4 | v9QtM6qnG50 | I Built A City To Save Kids From Illegal Labor | 2026-09-19 | 122m | wide grin, hi-vis vest | 1 + town | green, orange vest | none (SCHOOL sign) | 10 | none | charity, no prize |
| 5 | gTKS8SAwUzE | I Survived The Most Extreme Places On Earth | 2026-09-05 | 140m | battered, slack face | 1 + scorpion + snake | red jacket, snow, sand, green | none | 8 | none | survival, split biomes |
| 6 | Qtl8lJwbd4g | Escape 100 Cops, Win $500,000 | 2026-08-22 | 126m | grimace, driving | 1 + police lines | red car, black police | 100 COPS | 5 | $,# | chase, prize |
| 7 | Af6i6ChAVTw | Last To Leave Mansion, Keeps It | 2026-08-08 | 138m | big smile, suit | 1 + 20 people on house | blue sky, red suits | DAY 111 | 6 | none | winner keeps house |
| 8 | lVylRtlPOIE | I Granted 100 Kids Their Biggest Wish! | 2026-07-25 | 73m | smiles, 3 people incl. a celebrity | 3 | blue backdrop, pink lei | none | 7 | # | charity, lowest outlier (0.5x) |
| 9 | iYlODtkyw_I | Survive 30 Days Chained To A Stranger, Win $250,000 | 2026-06-27 | 111m | grimace, two angry women pulling | 3 | blue/red/white | none | 9 | $,# | conflict |
| 10 | __fmDj0ZJ1Q | 50 YouTube Legends Fight For $1,000,000 | 2026-06-13 | 96m | big smile | 1 + gold busts | gold/black, red jacket | none | 7 | $,# | celebrity bait |
| 11 | GpQSUjNsNm0 | 7 Days Stranded in The Arctic | 2026-05-30 | 146m | not readable (tiny figure on ice) | 1 tiny | deep blue, white, red suit | DAY #6 | 6 | # | isolation |
| 12 | AaMdXZMvT3w | Survive 30 Days On An Island With Your Ex, Win $250,000 | 2026-05-16 | 121m | grimace, hair pulled | 2 + stone knife | sand, blue, pink | DAY 28 | 11 | $,# | relationship conflict |
| 13 | 6Zy5VLcEbZc | I Stranded 100 People In The Wilderness For $250,000 | 2026-05-02 | 199m | calm, emerging from hut | 1 + shelter | green, red jacket | none | 9 | $,# | scale + build |
| 14 | zRtGL0-5rg4 | Last To Leave Grocery Store, Wins $250,000 | 2026-04-18 | 210m | tired, near-neutral (twin faces) | 2 | red/blue aprons, brown sign | DAY 30 | 7 | $ | endurance |
| 15 | DXVHmGoCTco | 50 Streamers Fight for $1,000,000 | 2026-04-04 | 133m | grimace, panic, hands on glass | 6+ | purple tracksuits | none | 6 | $,# | trapped crowd |
| 16 | JFtlf8RoPZY | Trapped On An Island Until I Build A Boat | 2026-03-21 | 178m | fear, teeth | 1 + wave | teal sea, white, bamboo | DAY #3 | 8 | none | survival |
| 17 | AoN1K4c7VKE | Survive 30 Days Stranded With Your Ex, Win $250,000 | 2026-03-07 | 142m | grin vs disgust | 2 | blue / pink bags | DAY 29 | 9 | $,# | humor / conflict |
| 18 | 5OLs1GWB4OA | I Built 10 Schools Around The World | 2026-02-21 | 87m | big smile, pointing | 1 + school + bus | brick, yellow | none (SCHOOL sign) | 7 | # | charity |
| 19 | 9WEQts7b8Pw | Ages 1 - 100 Race For $250,000! | 2026-02-07 | 178m | baby, grandma, him stern | 4+ | red tracksuits, blue track | bibs only | 6 | $,# | absurd lineup |
| 20 | pAnGwRiQ4-4 | $1 vs $1,000,000,000 Futuristic Tech! | 2026-01-24 | 220m | big smile | 1 + rocket car | blue, white, red neon | none | 5 | $,# | spectacle |
| 21 | QJI0an6irrA | 30 Celebrities Fight For $1,000,000! | 2026-01-07 | 144m | smile, referee shirt | 5+ celebs | blue tracksuits | HOLLYWOOD (sign) | 6 | $,# | celebrities |
| 22 | ZFoNBxpXen4 | Survive 30 Days Trapped In The Sky, Win $250,000 | 2025-12-20 | 235m | weary | 1 + platform + helicopter | sky blue, yellow/black hazard, red | none | 9 | $,# | extreme isolation |
| 23 | 8bMh8azh3CY | 100 Pilots Fight For A Private Jet | 2025-12-06 | 171m | shock, wide eyes, referee | 1 + 25 red climbers + jet | blue, grey, red | none | 7 | # | scale |
| 24 | Ah_uuTwGOYU | World's Strongest Man Vs Robot | 2025-11-22 | 151m | surprise, small centered | 3 | green hills, grey robot, red | none | 5 | none | monster vs monster |
| 25 | 3RmOvxilbPM | 100 People Vs World's Biggest Trap! | 2025-11-08 | 141m | scream, scratched | 3-5 + spikes | silver, red | none | 6 | # | physical danger |
| 26 | Oo9EbArcQ1c | I Saved 1,000 Animals From Dying | 2025-10-25 | 253m | shock, wide eyes | 1 + injured lion | tan, blue bandage | ANIMAL #967 | 6 | # | emotional rescue |
| 27 | oBXSvS2QKxU | 100 Kids Vs World's Strongest Man! | 2025-10-11 | 203m | shock, referee | 1 + man + kids | red, blue, green grass | none | 6 | # | absurd mismatch |
| 28 | F0OkwXKcPSE | Hi Me In 10 Years | 2025-10-04 | 76m | deadpan webcam still (2017 era) | 1 | beige, navy | none | 5 | # | nostalgia, 3 min |
| 29 | zo7i8VTpfNM | How Much Would You Risk For $500,000? | 2025-09-27 | 162m | grimace, hanging | 1 + cash stacks + helicopter | red, green cash | none | 7 | $ | danger for cash |
| 30 | 4l97aNza_Zc | Survive 30 Days Chained To Your Ex, Win $250,000 | 2025-09-13 | 261m | grimace, tight 2-face crop | 2 | blue pajamas, pink mask | DAY 29 | 9 | $,# | forced proximity |

Summary stats (MEASURED, my counts): 30/30 face; 11/30 overlay text (1-2 words); mean title 7.0 words; 25/30 titles with a number; 17/30 with a dollar amount; 6/30 with referee shirt.

### 4b. All-time most viewed (from vidIQ popular list of about 50; the list is not strictly sorted, so "top" here = highest views among those returned)

| ID | Title | Pub | Views | Face/emotion | Subj | Colours | Txt | T | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 0e3GPea1Tyg | $456,000 Squid Game In Real Life! | 2021-11-24 | 981m | hurt, half-cracked mask | 1 + mask | red/black/steel blue | none | 6 | highest in set; IP hook (Squid Game) |
| 1WEAJ-DFkHE | $1 vs $500,000 Plane Ticket! | 2023-04-01 | 611m | shock vs smile | 2 views | blue/gold split | none | 6 | split-screen "poor vs rich" |
| KrLj6nc516A | $1 vs $100,000,000 Car! | 2023-09-16 | 588m | wide smile | 1 + 2 cars | grey/yellow | $1, $100M | 6 | first-gen corner price labels |
| 48h57PspBec | $1 vs $1,000,000,000 Yacht! | 2023-06-10 | 582m | wide smile, captain | 1 + 2 boats | grey/gold | $1, $1B | 5 | same template |
| zxYjTTXc-J8 | Last To Leave Circle Wins $500,000 | 2021-08-31 | 566m | smile, edge of frame | 1 + 50 people in red ring | green, red/blue/yellow | none | 6 | crowd in circle |
| tnTPaLOaHz8 | $10,000 Every Day You Survive In A Grocery Store | 2023-12-02 | 554m | exhausted reaching | 1 + cart | blue/white | DAY #150 | 9 | day counter |
| erLbbextvlY | 7 Days Stranded On An Island | 2024-03-30 | 537m | soaked, torn shirt | 1 | grey sea, black shirt | DAY 6 | 6 | day counter |
| 0BjlBnfHcHM | Beat Ronaldo, Win $1,000,000 | 2024-11-30 | 413m | head-to-head snarl | 2 + ball | red/blue | none | 4 | celebrity duel (same frame as Haaland) |

### 4c. 2017-2019 samples (age from YouTube "x yr ago" or vidIQ date)

| ID | Title | Age | Face | Text | Style |
|---|---|---|---|---|---|
| xWcldHxHFpo | I Counted To 100,000! | ~9 yr ago | pointing finger, webcam | none (part of wall poster) | raw webcam frame |
| _FX6rml2Yjs | Saying Logan Paul 100,000 Times | ~9 yr ago | bored, half-eyed | none | raw webcam |
| 4KVmSG6KS2k | Giving Homeless People $1,000 (Not Clickbait) | ~9 yr ago | hugging recipient | GIVING RANDOM PEOPLE $1000! (4 words, white/green) | text takes up half the frame |
| rPXmbM2UEbU | Giving $100,000 To A Homeless Person | ~7 yr ago | recipient with cash | none | cash fan, no MrBeast face |
| 9cCpZl8euLI | I Gave A Homeless Man A Home | ~7 yr ago | recipient hands on head, MrBeast small | HOMELESS MAN | reaction as hero |
| QxGVgXf_LNk | Going Through The Same Drive Thru 1,000 Times | 2019-10-05, 325m views | deadpan face, cashier smiling | #801 (1 token) | early counter style, bags |

Packaging shift (INFERRED from the above): 2017 = raw self; 2018 = big words plus other people's faces; 2019 = counter token plus the first on-brand look; 2021-2026 = single polished scene with a dominant hero face, 0-2 words, and an escalating or absurd setting.

## 5. Counter-evidence and limits of the packaging story

- MEASURED flops (relative to his own baseline): "I Granted 100 Kids Their Biggest Wish!" 73m views, outlier 0.5x; "I Built 10 Schools Around The World" 87m, 0.5x; "Hi Me In 10 Years" 76m, 0.4x; Shorts at 0.1x-0.3x ("Read My Book..." 30m; "Can We Build an Entire Village?" 32m; "World's Largest Tennis Match" 23m). Charity or emotional videos with smiling thumbnails tend to underperform his survival/competition videos in the 2025-26 window (INFERRED, small sample, not controlled). A 10-minute charity upload ("2,000,000 People Get Clean Water...", 140m) shows the pattern is not absolute.
- MEASURED: On the dormant channel Beast Reacts (3 years since last upload), packaging did not rescue the channel; his name and thumbnails did not guarantee continued investment or audience (audience still 37m subscribers).
- Distribution: views per video on the main channel in the grid range from 62m to 324m, but the newest uploads are still accumulating (MEASURED).
- REPORTED (Sherwood, 28 Aug 2024): his overall and daily view counts were roughly flat in 2024, rival channels (Stokes Twins, A4, Topper Guild) gained subscribers faster in some months, while he also had record subscriber months. Mixed evidence; the article offers little proof of flops.
- REPORTED (The Star, reprinting an NYT story, 27 May 2024): creators growing without his rules: Sam Sulek (3m+, plain titles, unedited screenshot thumbnails), Eddy Burback (about 2m, months between posts, long essays), SungWon Cho (about 4m, no edited thumbnails). So his packaging is a sufficient, not a necessary, route to growth.
- REPORTED (search summaries of EssentiallySports, Yahoo, Sherwood): imitators exist; MrBeast says some get results quickly; he also says copycats will not succeed (Yahoo). I found NO study measuring how many copycat channels failed. Survivorship bias is therefore UNPROVEN either way; we only see the survivors.
- Survivorship caveat: every packaging element above is also present on videos that did far worse; I did not measure it systematically. Top-view videos also have a 5-9 year head start; a high count may reflect age, not packaging. The vidIQ "outlier multiple" is relative to his own channel baseline.
- BIG CAVEAT FOR USE: his thumbnails depend on real, expensive, photographed spectacle and a famous face. A small puzzle game cannot copy that; copy the structure (clear premise, one hero, stakes visible at 120 px), not the production.

## 6. What an indie puzzle game can plausibly reuse (INFERRED, flagged)

1. State the whole premise in the title and show the danger in the image; leave only "will it work?" open (BRO, YOU'RE COOKED = a stakes line). INFERRED from 4a.
2. One hero subject, one threat, one face or character with a readable emotion; big, left-weighted; 0-2 overlay words or none. INFERRED.
3. Number plus stakes: "Save N" or "Day n/Level n" counters; progress counters were present on 9/30 recent thumbnails, 3 of the top 8. INFERRED to transfer as level counters.
4. Test packaging before building; use YouTube Test & Compare for thumbnails/titles if the game gets a video presence (REPORTED: YouTube added title testing in 2025, Tubefilter 16 Jul 2025; rollout scope unconfirmed).
5. Delivery of the promise within seconds: the game's first screen should match the thumbnail (REPORTED principle from Social Media Today/Forbes).
6. Reuse a small number of formats and retire them while they still work (REPORTED, UNILAD Jan 2025).
7. Shorts as format tests: his Shorts frequently are game-like single-premise challenges ("Don't Pop the Balloon" 300m, "Last To Fall Wins" 144m) with big variance; use them as cheap probes (MEASURED variance, INFERRED use).

## 7. Limits

- Subscriber/view counts are as shown on 2026-11-04; the vidIQ 'breakout score' and the extension's multiple are different measures.
- Thumbnail description is from my own viewing of 640 px previews; "emotion" and "colour" are subjective, counts approximate (about plus or minus 2).
- Title A/B (Haaland vs LeBron) is a single observation.
- No Beast Games YouTube channel confirmed; no data on Beast Games viewership.
- Click-through rate, retention, and session length for MrBeast were not observable (those are private analytics). Everything about "yields a click" or "long session" is inferred from packaging and from reported statements, never measured.
- The leaked-handbook content was taken only from mainstream reporting (Fortune, Dexerto, a Variety/Time context note); authenticity is not confirmed by MrBeast in those articles.
- I could not access NYT, New Yorker, Business Insider, The Verge, Wired through the search tool.
- Collaborator identities beyond the titles were not verified.

## 8. Sources (all fetched 2026-11-04 unless noted)

| URL | Grade | Use |
|---|---|---|
| https://www.youtube.com/@MrBeast/videos and /shorts | MEASURED | grid, cadence, sub count |
| https://www.youtube.com/@MrBeast2/videos, /@MrBeastGaming/videos, /@BeastReacts/videos, /@BeastPhilanthropy/videos | MEASURED | channel lists |
| https://www.youtube.com/@{handle}/about (several) | MEASURED | sub and video counts |
| vidIQ channel_videos (popular) and get_videos_by_ids, get_images | MEASURED | views, dates, thumbnails (10 credits) |
| https://techcrunch.com/2022/06/24/mrbeast-explain-algorithm-youtube-vidcon/ | REPORTED | retention, sketching thumbnails, series expectations |
| https://time.com/collections/time100-leadership-series/6693255/mrbeast-interview/ (Feb 15, 2024) | REPORTED | persona, process, first 10 seconds |
| https://fortune.com/2024/09/26/youtube-mrbeast-jimmy-donaldson-leaked-business-handbook-advice/ | REPORTED | handbook contents, verification note |
| https://www.dexerto.com/youtube/leaked-mrbeast-pdf-reveals-youtubers-secrets-to-video-success-2900841/ | REPORTED | metrics, first minute, titles |
| https://fortune.com/2026/04/08/mrbeast-jimmy-donaldson-self-made-billionaire-no-work-life-balance-live-to-work-15-hour-days-beast-games/ | REPORTED | body double, 15-hour days |
| https://www.socialmediatoday.com/news/youtube-shares-insights-into-how-mrbeasts-team-creates-compelling-thumnail/709817/ (Mar 8, 2024) | REPORTED | thumbnail process, closed-mouth test |
| https://www.forbes.com/sites/ianshepherd/2024/10/18/the-8-data-driven-secrets-behind-mrbeasts-youtube-empire/ | REPORTED (403 on fetch; search snippet only) | thumbnail testing, intro delivers promise |
| https://www.uniladtech.com/social-media/youtube/mrbeast-dollar-videos-081656-20250108 | REPORTED | ending $1 vs formats |
| https://sherwood.news/tech/mrbeast-youtube-jimmy-donaldson-losing-his-edge (Aug 28, 2024) | REPORTED | decline narrative, rival growth |
| https://www.thestar.com.my/tech/tech-news/2024/05/27/theyre-ignoring-mrbeasts-rules-of-youtube-and-thriving (NYT reprint) | REPORTED | counter-examples |
| https://www.tubefilter.com/2025/07/16/youtube-feature-test-and-compare-titles-thumbnails/ | REPORTED (search summary only) | title testing rollout |
| https://www.forbes.com.au/life/entertainment/mrbeast-game-show-jackpot/, https://time.com/collections/time100-creators-2025/7299135/mrbeast/, https://esports.gg/news/entertainment/mrbeast-confirms-beast-games-season-2-for-season-2-im-definitely-going-to-get-the-numbers-down-way-faster-and-have-more-skill-based-games/ | REPORTED (search summaries only) | Squid Game to Beast Games, season 2 changes |
| https://recapio.com/digest/why-every-mrbeast-video-gets-200m-views-interview-by-jon-youshaei and https://rosetta.to/u/colinandsamir/a-brutally-honest-conversation-with-mrbeast | UNPROVEN (third-party transcripts or summaries; not opened) | seen only as search results |
