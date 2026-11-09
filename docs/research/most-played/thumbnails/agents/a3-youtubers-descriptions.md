# A3: why thumbnails and titles work, how other YouTubers package, and what Playgama descriptions look like (run 9 Nov 2026)

Tags (the repo's rules): [MEASURED: how, date] = I fetched or viewed it myself this session. [REPORTED: source] = a source I read says so (I grade first-party vs second-hand). [INFERRED] = my reasoning. UNVERIFIED = could not confirm. No claim of cause anywhere; no click-through data exists outside the platforms.

## 0. Summary: what I FOUND

1. YouTube's own help pages say very little about HOW to design a thumbnail. They say it should give a quick snapshot of the video, give size and ratio (16:9, 3840x2160 recommended, 640 px minimum width), ban malicious clickbait, and say CTR can be read only after many impressions. There is nothing official on faces, colour or small-size legibility. [MEASURED: 4 help pages fetched 9 Nov; see 1.1]
2. YouTube's Test & Compare (help page titled "A/B test titles & thumbnails") picks the winner on WATCH TIME, not clicks, tests up to three variants, desktop only, and says variants should be meaningfully different. A thumbnail that over-promises is therefore the thing the tool is built to punish. [MEASURED: help page 13861714, 9 Nov]
3. The MrBeast principles that are FIRST-PARTY (his own words in print): he sketches thumbnails before filming ("I'd rather have that existential crisis before I make the video", TechCrunch/VidCon 2022), makes people "feel something" and says a strong reaction forces the click (Time, Feb 2024). The rest (simple, small-size check, trust, 50 concepts, closed-mouth test) come from his thumbnail lead Chucky Appleby, in a YouTube-hosted talk, via secondary write-ups only. The leaked guide is NOT first-party confirmed. [REPORTED, see 1.2]
4. Across 70 thumbnails of 7 creator sets I looked at (200x112 px), the packaging that works in each niche is NOT MrBeast's. Challenge and gaming channels use a big reaction face plus one threat; the puzzle channel (Cracking the Cryptic) uses the puzzle plus a 1-3 word label; the marble channel uses no face and a logo. In the "save the dog from bees" draw-puzzle genre, the five biggest items (11M to 130M views) are Shorts with RAW gameplay stills as the thumbnail, and the five long videos have designed tiles with the game's own character close up, the bees, and a reaction face. [MEASURED: viewed contact sheets, 9 Nov; counts +/-1]
5. Published thumbnail research is thin and all of it is about video, not game tiles. The one large-sample study I could open (Thumbnail Bench, 11,223 covers, vendor-funded) found top performers barely differ from the rest on face use (72% vs 70%) and it could not measure CTR. [REPORTED, see 1.4]
6. Playgama game pages: the description text is a fixed template (About, How to Play, Controls, Key Features, FAQ) in 60 of 60 pages. Median length is about 320 words (top 25), 342 (20 puzzle), 317 (15 trending). A "How to Play" heading is present on 57 of 60 pages. [MEASURED: 60 pages fetched 9 Nov]
7. The page `<title>` and meta description are formulaic on all 60 pages (all have "Name: Descriptor | Playgama" shape; all 60 meta descriptions say "online" and "free"). The developer cabinet form has no field for them. [MEASURED; the "templated by Playgama" reading is INFERRED]
8. 27 of 60 pages contain screenshot-caption-like sentences ("One scene shows ..."). Playgama's own Wrap guide says screenshot captions count as page text. [MEASURED count; link to captions INFERRED]
9. Playgama's own words: the recommended content fields "affect search ranking and conversion" (Wrap guide, first-party, but written for own-domain Wrap sites, not for the catalog page). The wiki says NOTHING about cover or description rules in the moderation requirements; the only rules that touch them are brand/misleading rules 4.2.3-4.2.5 and 3.5.1 (title matches). [MEASURED: wiki pages fetched 9 Nov]
10. BYC's cabinet form today has description, how-to-play, story and category all empty (null), so the page would publish with no text and sandbox publication is refused without a category. Decision needed from the owner (see 8). [MEASURED: get_application, 9 Nov]

---

## 1. WHY thumbnails and titles work

### 1.1 YouTube's own guidance (first-party; fetched 9 Nov 2026)

| Page | What it says (paraphrase) | Gap |
|---|---|---|
| support.google.com/youtube/answer/72431 (custom thumbnails) [MEASURED] | Use the largest image; 3840x2160 recommended, minimum width 640 px; 16:9 for videos, 9:16 for Shorts, 1:1 for podcasts; JPG or PNG; 2 MB limit on mobile upload, 50 MB desktop; a thumbnail "should give viewers a quick snapshot of the content" (that is the only design sentence). Vertical videos given a 16:9 thumbnail are replaced by an auto 4:5 one on home/explore. Strikes for nudity, hate, violence, harmful content. | Page does not mention misleading thumbnails, faces, colour, text or legibility. |
| support.google.com/youtube/answer/13861714 (A/B test titles and thumbnails = Test & Compare) [MEASURED] | Up to 3 titles and/or thumbnails; winner = highest WATCH TIME (the page says watch time is optimised over other metrics); desktop Studio only; not for Shorts, premieres, kids, private; takes days to two weeks; labels Winner / Performed Same / Inconclusive; make variants meaningfully different; upload 1280x720 or larger (if any is smaller all get downscaled to 854x480); test older videos first. | No data on how often variants win. |
| support.google.com/youtube/answer/7628154 (impressions and CTR) [MEASURED] | CTR = how often viewers watch after a registered impression; "can range between 2% and 10%" for half of channels and videos; do not judge CTR right after upload; act only on statistically significant changes; avoid clickbait (high CTR with low average view duration lowers recommendation); testing several thumbnails on one video can mislead because traffic sources differ. | The page says suggestions are aggregate and not a guarantee. |
| support.google.com/youtube/answer/2801973 (spam and deceptive practices) [MEASURED] | "Malicious clickbait" bans titles, thumbnails, descriptions or imagery that mislead viewers into clicking a video that does not deliver what was promised. | |
| techcrunch.com/2022/06/24/... [REPORTED, second-hand] | YouTube's Todd Beaupré is reported saying titles and descriptions give the recommender only limited information. | Paraphrase of an article; not a YouTube page. |

What YouTube therefore officially says WHY packaging matters: the thumbnail and title are what is shown on an impression; CTR (clicks over impressions) is the visible result; but the system rewards watch time and punishes a mismatch between promise and video. [MEASURED pages; the sentence joining them is INFERRED]

NOT found on any official page: a statement that faces, high contrast, big text or small-size legibility raise CTR. Everything of that kind comes from creators and vendors (1.2, 1.4). [MEASURED: searched; one WebSearch for official creator-blog advice returned only third-party blogs]

### 1.2 MrBeast and his team: first-party vs second-hand

| Statement (principle) | Who, where | Grade |
|---|---|---|
| He usually sketches the thumbnail BEFORE making the video, preferring to settle that decision early | MrBeast, VidCon 2022; TechCrunch reports it as his remark (24 Jun 2022) [MEASURED: article fetched 9 Nov] | [REPORTED: first-party words, via journalist] |
| Every few years he updates thumbnails on older videos so viewers can tell what each is about; it "usually does help quite a bit" | Same TechCrunch article | [REPORTED: first-party via journalist] |
| He pays most attention to retention, not CTR; urges storytelling over gaming the algorithm | Same article | [REPORTED: first-party via journalist] |
| Thumbnail design question is "how can we make people feel something"; with one of those reactions "you have to click" | MrBeast quotes in Time interview (15 Feb 2024) [MEASURED: article fetched 9 Nov] | [REPORTED: first-party via journalist] |
| His thumbnails usually show his mouth open, smiling or grimacing; he leans more on gut than analytics lately; he tells viewers what to expect in the first 10 seconds | Time, journalist's description, not his quote | [REPORTED: journalist] |
| Thumbnails must deliver on the promise (trust); match the video's intro; make the thumbnail easy to understand fast; check it at phone size; about 50 thumbnail/title concepts per video; closed-mouth faces beat open mouths in a 30-video A/B (the size of the gap is described as small by one write-up and "much higher" by another) | Chucky Appleby (the thumbnail lead), a roughly 47-minute YouTube-hosted talk (video ID HP-rqigfw2s; the same page says he spoke with YouTube's Todd Beaupré). I could NOT open the talk or a transcript; I read Social Media Today (8 Mar 2024) and a win.gg write-up (15 Jul 2026, by Khizar Mundia) [MEASURED: both fetched 9 Nov] | [REPORTED: second-hand, spoken by a team member, not by MrBeast] |
| About $10,000 per thumbnail; up to 20 variations per upload | Social Media Today cites another outlet for these | [REPORTED: third-hand]. Treat as UNVERIFIED |
| Title and thumbnail developed before shooting; if no viable packaging, idea scrapped | Social Media Today author and a transcript summary | [REPORTED: second-hand, partly the author's reading] |
| Leaked guide "How to Succeed in MrBeast Production": CTR, average view duration and average view percentage are the three metrics; titles and thumbnails should "lean into virality" (ketchup-vs-front-yard example) | Dexerto (16 Sep 2024) says it is leaked and unverified; Fortune (26 Sep 2024) says Business Insider verified it with former staff, MrBeast did not comment, and its summary says nothing about thumbnails [MEASURED: both fetched 9 Nov] | [REPORTED: authenticity not confirmed by him]. Do not treat as first-party |
| "Thumbnails are irrelevant" (a remark to Colin and Samir) | A creator-handbook article only | UNVERIFIED. I could not find the original |

PRINCIPLES extracted, with source grade:
1. One idea, instantly legible ("easy to understand") [REPORTED, Appleby via 2 write-ups; second-hand].
2. Checked at small / phone size [REPORTED, Appleby; second-hand].
3. A strong emotional reaction is the click trigger [REPORTED, MrBeast in Time; first-party via journalist].
4. Curiosity / stakes: make people "curious, shocked or intrigued" [REPORTED, win.gg write-up of Appleby; second-hand]. Whether this is a "curiosity gap" in the strict sense is my reading, not his word [INFERRED].
5. Contrast and saturated colour: no first-party statement found. Colours in the 44 thumbnails are from the earlier case study [MEASURED earlier, mrbeast-case-study.md]. The principle is [INFERRED] from those images only.
6. Packaging before production; the video must deliver the promise [REPORTED: sketches first = first-party via TechCrunch; "delivers on the promise" = Appleby second-hand].
7. Trust through consistency (his face on every thumbnail since 2019) [REPORTED, Appleby second-hand].
8. Test volume: ~50 concepts, A/B tests [REPORTED, Appleby second-hand; the closed-mouth result conflicts with Time's description of open-mouth thumbnails, which I leave unresolved].

Where the earlier case study already said something (section 3.3, 44 thumbnails) I did not redo it.

### 1.3 Other creators: what I looked at and what I saw

Method [MEASURED, 9 Nov 2026]: video lists came from YouTube's own channel and search result pages with a plain research User-Agent (no login, about one request per second; YouTube's page format changed so I parsed its embedded data). Thumbnails came from i.ytimg.com (public). I did not use vidIQ at all. I built one contact sheet per set, 10 thumbnails each at 200x112 px (about the size of a phone feed card), and looked at each sheet. Selection rule: channels known for strong packaging in challenge, kids-gaming, puzzle and the exact "draw to save the dog" genre; for the first five I took the 10 most recent long videos on the /videos tab, which is a hand-made sample and shows the CURRENT style, not what built the channel. Subscriber counts are as YouTube's search page displayed them. All counts below are my eyeball counts, +/-1.

| Set | Channel (subs shown) | What the 10 thumbnails do | Differs from MrBeast |
|---|---|---|---|
| Stokes Twins (challenge) | @StokesTwins (page shows 150M) | The presenter's face 10/10, wide eyes or fear, the scene is a set (corridor, huge food wall, police, bull, hospital). In-scene words only ("RUN" painted on walls, about 4/10), no added overlay text. Same blue/orange/red jumpsuit repeated. | Closest relative. No money, no counter. Threat is a creature or place. |
| Hafu Go (builds, puzzles) | @hafu (19.2M) | Face 6/10, otherwise the object being made, often with a hand and a flame/match. A "LEVEL n" label on 3/10. Bright, clean backgrounds. | Object-first, not face-first. The product of the video is the hero. |
| Techno Gamerz (gaming) | @TechnoGamerzOfficial (53.6M) | Face on the right third 9/10 beside a game scene; 1-3 word label on about 8/10 ("DAY 1", "999 IQ", "#171", "2 YEARS LATER"); uses game franchise logos. | The face sits right, text is more common than for MrBeast, and it leans on other companies' game brands (which Playgama forbids for BYC, 4.2.3). |
| BriannaPlayz (family gaming) | @BriannaPlayz (6.48M) | Face 10/10, mouth wide open about 8/10, a red circle, yellow ring or arrow pointing at the threat on 4/10, a parodied familiar logo on 3/10. | A callout (ring/arrow) is used to say "look here". |
| Save the Dog set (the genre, 10 top-viewed videos from a search, all channels) | YesGamerz, PART TIME GAMER, zhang zhang x2, FACT OF GAMING, BriannaPlayz, Luky, Mythpat, Sokher Gamer, Tyler & Snowi (views 4.4M to 130.3M) | 5/10 are Shorts (0:18 to 0:26) with a raw gameplay still as the image (a stick figure or a dog beside crocodiles or fire); the five long videos (10 to 22 minutes) have designed tiles: the dog or the character close up with a big expression, a swarm of bees or a hive, an arrow, a short label ("HELP!", "NOOB / PRO / HACKER"), often a reaction face. | The designed tiles put the GAME's character, not a person, as the hero in 3-4 of 5. |
| Cracking the Cryptic (puzzle) | @CrackingTheCryptic (709K) | The puzzle grid fills half the frame 10/10; the two hosts' faces (webcam) small on 8/10; a 1-3 word label on about 6/10 ("Foggy Kropki", "Devilish Forks"); coloured gradient backgrounds and a logo top left. | No spectacle: the puzzle itself is the hero, and the words do the curiosity work. |
| Jelle's Marble Runs (physics) | @JellesMarbleRuns (1.52M) | No face 10/10; a macro photo of marbles on a track; a series logo or word on about 7/10. | No person at all; the brand is the logo and the tactile scene. |

Video IDs, so any claim can be re-checked: Stokes: -YWR0zFho6M qTim1iIQbwA TQmwAmCsj_I kbRvNp8kwA0 wkeK8LnHogU lFOw4ZuxK4I WsVilT2koiM fkM9izJdKGM vJ1ycA7fn68 A8E6HyBgZ1s. Hafu: 9yokNhSsF2M vL9sryYtJ-0 HhTHSf2cvr0 2qujcS3b87Y c0U7Iuo6JGE anqIffKgPtY 3cNe06zJOD0 R0jL1DjamRA 74d1I3mPKT8 fP8Z5TdMAhc. Techno: OVgNvkHGOlE lqNFrFPX8jg TIZzc3h0mBg I6q9q2ZZX_Y xqP6w8Sn3EI FZQylFVLGjM dn5_p5jaJn0 t-wlfZW6mpc RHxyCfnHYPg eFqUJuDmIaA. Brianna: 7LKCDSaAEzA wdPoETvgqDg icJU7FrsHn8 AvdWd96sZn4 E1affm5vE-A tAp_-yiya3c BX4VndzPQRI YVvuZ0cVW_I 09N-n_ROGns 7EFGZvXuJ4o. Cryptic: cfww7T7b6pw ppw8JnNcpTw U8AIRNUMnzw _7vUNhgHMvI 2dxalq_8az0 -dHPY7QpYZA 5MkEceZCiFc YWg19oiRqXA XUru-t7MVEw u6E39nrPUog. Jelle: DCqabiPotzM 5cXqPl2ZnyY bMjwIGhFULY 3ZzUL8H71I0 Se_yPMWbtJk 4lOSYDjQQUw mIXpymfNl5w 5U_8baIhwzA jXEeRomoYNw OuagYK0es9Y. Save the Dog: ypMF_KSDHIw LUzuUeqUlOs Ttf_mOaVA9U j1q7jS8XaVA SzvawPc_8wU HgiWaDBSo7s oSLIabYY1Gc RYl_G-2fngY eglvF0XBEqw 2Jq1vka6UK0. Images are in `THUMBS/work/a3/thumbs/` (git-ignored scratch), contact sheets `sheet_*.png`.

Patterns that recur across the creators [MEASURED by eye; the reading is INFERRED]:
1. ONE focal subject that is large: a face (Stokes, Techno, BriannaPlayz), the made object (Hafu), the puzzle (Cryptic), the scene (Jelle). Never a busy mix.
2. A readable emotion or a readable stake in 5 of the 7 sets. The two without a person (Cryptic mostly, Jelle) do it with the puzzle or with scale instead.
3. A deliberate pointer when the cause is small: a ring, arrow or glow (BriannaPlayz 4/10, genre tiles).
4. Very little text: 0 to 3 words, and where there is more it is a label or a number, never a sentence.
5. Saturated, flat or clean backgrounds; the subject separates from the background.
6. The genre's biggest numbers sit on formats where the image hardly matters (Shorts autoplay), so view counts in that genre say little about tile design. [INFERRED]

Where they differ from MrBeast: no money amounts or "$" on any of the 70; no photoreal spectacle outside Stokes; the puzzle and marble channels have no face; the Techno set borrows other companies' game logos. [MEASURED by eye]

Confounds (must be said): each channel's recent videos are a sample of what survived; the genre set picks the top by VIEWS, so it favours old and Shorts-driven items; channel size, language and audience differ; thumbnails do not cause the views shown.

### 1.4 Published research and large-sample analyses (all about VIDEO thumbnails, none about game tiles)

| Study | Who, sample | Funded or sold by | Finding | Grade and limits |
|---|---|---|---|---|
| Thumbnail Bench (Net Influencer, 21 Sep 2026) [MEASURED: article fetched 9 Nov] | 11,223 long-form covers from 1,043 channels with 100K+ subs, 11 niches; 609 channels for top-vs-rest | An AI thumbnail-generation company | 71% of covers show a face (Gaming 47%); 77% have text, median 4 words; faces on 72% of top covers vs 70% of the rest; metric was views per day, NOT click-through; labels from an AI model with about 88% agreement between two runs | [REPORTED: vendor]. Descriptive, no causal claim; the authors say so |
| Kapwing with NeoMam Studios (Tubefilter, 24 Oct 2024) [MEASURED: article fetched 9 Nov] | Thumbnails of "some of YouTube's biggest stars"; sample size NOT stated | Kapwing sells a video editor | Positive emotions (surprise, happy about 27% each) most common; MrBeast uses all seven emotion classes | [REPORTED: vendor]. Describes use, not performance |
| Weismueller and Harrigan, "Organic Reach on YouTube" (Springer, 2021) [MEASURED: abstract page fetched 9 Nov] | About 50,000 thumbnails and titles from 1,000 influencers in 10 categories (via the YouTube API) | Academic | Tests colour, people in the image, capitals and emotion words in titles, the verification badge; the abstract page does not report results | [REPORTED: abstract only]. I could not read the result |
| mer.vin blog on 3,200 song-video thumbnails (Sep 2026) | Claims a face lift of about 33% (6.4% vs 4.8% CTR) | A blog | Methodology not verifiable; figures differ between its own pages | UNVERIFIED, do not use |
| Netflix artwork personalisation (RecSys 2018 talk and blog) | The primary post returned HTTP 403 for me; I have only secondary write-ups | Netflix | Artwork is chosen per member by contextual bandits; reward = minutes played from the impression; reported that recognisable faces and expressive images beat tidier ones in some tests | [REPORTED: secondary only]. This is a catalog tile, the nearest analogue to a game card, but not a game |
| vidIQ "wins" data in packaging-experiments.md | 12 hand-picked before/after pairs, winners only | vidIQ sells the tool | No causal evidence | Already graded in the earlier file; not repeated |

My finding: I did NOT find a peer-reviewed paper with real CTR data from a randomised thumbnail test; I did not find any study of game tiles. [MEASURED: three searches, 9 Nov; absence of evidence, not proof of absence]

### 1.5 What TRANSFERS to a small game tile (every row [INFERRED])

| Principle | Source grade | Transfers to BYC tile (landscape 16:9 card or portrait 5:7)? | Why / what changes |
|---|---|---|---|
| One idea, one focal subject | Appleby, second-hand; all 7 sets | YES | A 194x272 or 221x148 box holds one idea. Milo and the thing about to hit him. |
| Legible at small size | Appleby, second-hand | YES, strongest | The tile is smaller than a phone feed card. Check at 194 px wide. |
| Visible stakes: the threat and the victim in one frame, aimed at each other | Stokes, Brianna, genre tiles [MEASURED] | YES | The boulder above Milo, the bees on the dog. Matches "BRO, YOU'RE COOKED." |
| Strong emotion on a character | MrBeast in Time (first-party) | PARTLY | Use Milo's drawn face. NOT a person's face. |
| A pointer (ring, arrow) at the small cause | Brianna and genre tiles | MAYBE | One bright line from victim toward threat could do it (idea P3 in packaging-experiments.md is UNPROVEN). |
| Saturated colour, separation from background | no first-party; all sets | YES | Contrast, not a rule: earlier file found two darker winners. |
| Title states the premise, image shows the danger | MrBeast pattern (case study) | PARTLY | Tile title is the game name; the tile must carry the danger. |
| The video (game) delivers on the cover | Appleby; YouTube policy | YES | Cover must show real BYC art; YouTube's misleading rule and Playgama 4.2.5 are the guard rails. |
| Test many variants, A/B | Appleby; YouTube Test & Compare | PARTLY | Playgama split-testing of tiles: UNVERIFIED. Use one change at a time and a dated log (see packaging-experiments.md P8). |
| Text overlay of 0 to 3 words | all sets | MAYBE | Unknown if the Playgama card shows the title under the image; if it does, the cover needs no words. |
| Counters ("DAY n", "LEVEL n") | Stokes none; Hafu, Techno yes | MAYBE | "45 levels" is a possible number but nothing here tests it. |
| A person's face on every thumbnail for trust | Appleby | NO (video-specific and brand-specific) | The trust is in a person subscribers know. BYC has no such person; Milo as a recurring character is the nearest thing. |
| Open vs closed mouth, referee shirt, "$" amounts, celebrity faces | MrBeast specifics | NO | Face-specific or prize-specific. |
| Watch-time optimisation, Shorts autoplay, post-publish thumbnail swaps | YouTube | NO | A Playables or Playgama tile has no watch-time test; the tile is static. |

MUST NOT be copied: a real person's face (MrBeast's or anyone's), their name, logo, series wording ("Beast", "Last To Leave", "$ vs $") or a franchise's characters or logos (as in the Techno set). Playgama 4.2.3 bans other people's names, logos and characters in the title and gameplay, 4.2.4 forbids posing as an official product, 4.2.5 forbids unrelated brands used to attract an audience [MEASURED: game-requirements wiki page read through get_game_checklist, 9 Nov]. The rules name title and gameplay; applying them to the cover is [INFERRED], and the safe reading is to apply them. Also do not copy any specific thumbnail from the sets above; I studied principles only.

---

## 2. Descriptions and how-to-play on Playgama

### 2.1 Method [MEASURED, 9 Nov 2026]

- Slugs from `THUMBS/data/playgama-lists-20261106.json` (lists dated 6 Nov). 60 pages: the top 25 of `top_playgama`; 20 from `puzzle`; 15 from `trending_now` (not already used). The `puzzle` list is mostly arrow, sort, mahjong and sudoku games and has only ONE draw game (Save The Pets: Draw to Save, rank 83 of 270 on that list). I took the first 20 not already used whose title or slug matched draw, puzzle, brain, line, rescue, save, trick, logic, riddle, physics, and filled up in list order; so "puzzle" here means "this list's puzzle games".
- `curl`-style fetch with a plain research User-Agent, 1.1 seconds between requests. 60 of 60 returned HTTP 200. I ran the whole fetch twice (first run did not save the HTML), so Playgama saw about 120 requests over about 2 minutes each time; I disclose this as a slightly heavier load than the brief's one-per-game.
- I parsed the server-rendered block that starts at `<h2>About ...` and ends before "Games You Might Like", the `<h1>`, the `<title>`, the meta description, the details table (developer, orientation, platforms, categories), and the rating. Words are counted on visible text after removing tags. The raw HTML is in `THUMBS/work/a3/raw/` (git-ignored scratch).
- Not done: I did not open the pages in a browser, so what is above the fold on desktop and mobile is read from the DOM order only (see 2.4).

### 2.2 What the pages contain (n = 60)

| Measure | top 25 | puzzle 20 | trending 15 |
|---|---|---|---|
| Median words in the description block (including FAQ, excluding the cross-links) | 320 (range 99 to 1,151) | 342 (114 to 934) | 317 (173 to 679) |
| Has a "How to Play" heading | 24/25 | 18/20 | 15/15 |
| Median words in the How-to-Play section | 139 | 136 | 87 |
| Has a "Controls" heading | 17/25 | 17/20 | 14/15 |
| Median words in the Controls list (0 where absent) | 13 (8 absent) | 16 (3 absent) | 26 (1 absent) |
| Has an FAQ (usually 5 Q and A with FAQPage markup) | 10/25 | 10/20 | 5/15 |
| Median `<h2>` count | 3 | 4 | 3 |
| Median list items | 7 | 5.5 | 8 |
| First sentence shape: "X drops/puts/throws you into ..." | 13 | 3 | 7 |
| First sentence shape: "X is a/an ..." | 8 | 13 | 4 |
| First sentence is only 5 words or fewer (a slogan or question) | 1 | 3 | 3 |
| Body contains "free" | 9 | 13 | 7 |
| Body contains "online" | 7 | 5 | 2 |
| Body contains "puzzle" | 10 | 20 | 3 |
| Body contains "brain" | 4 | 11 | 1 |
| Body contains "mobile" | 13 | 7 | 7 |
| Meta description contains "free" and "online" | 25/25 | 20/20 | 15/15 |
| Page title shaped "Name: Descriptor | Playgama" | 25/25 | 20/20 | 15/15 |

The top-ten pages of the top-25 are longer than ranks 11 to 25 (median 434 vs 304 words). Confound: top rank, popularity, and any editorial effort may all go together; length does not cause rank. [MEASURED; no causal reading]

Structure [MEASURED]:
- Fixed order: `About <Name>` (2 to 3 sentences), then often a story or levels section, then `How to Play <Name>[: subtitle]` (40 of 57 headings have a subtitle after a colon), then `Controls` (a bulleted list "Input: what it does", with a Desktop/Mobile split on only 7 of 60 pages by my pattern), then `Key Features` (21 pages), then an FAQ (25 pages), then "Games You Might Like" links.
- How-to-play style: goal-first ("The goal is ..."), 10 of 57 sections; imperative-first ("Tap ..., Start with ..."), 13; the remaining 34 start with the core loop or a mechanic description. Almost none is a numbered list; it is prose of one or two paragraphs. [MEASURED, my regex, +/-3]
- Controls are one line per input, short: for example the one draw-the-line competitor writes touch and drag to draw a protective line. [MEASURED]

Draw/puzzle versus the rest: the puzzle set is a little longer at the median (342 vs 320 and 317), uses "free" more (13/20 vs 9/25), "brain" far more (11/20 vs 4/25 and 1/15), starts "X is a ..." much more (13/20 vs 8/25 and 4/15) and "drops you into" much less (3/20 vs 13/25 and 7/15). The top-25 and trending groups look alike. [MEASURED; groups are small, so treat the differences as hints]

The nearest competitor page: `save-the-pets-draw-to-save` (developer Bravestars, rating 4.5 from 209 votes, orientation shown on page, 226 words, three headings: About, How to Play, Controls). It states the one-line goal (keep the dog safe for at least 10 seconds), names the hazards (bees, lava, water, spikes, bombs), the star rule (shorter line, more stars) and one control line. It also carries caption-like sentences that describe its screenshots. [MEASURED] This is also a near-twin of BYC (a dog, bees, draw a line, stars for a shorter line), so the BYC page must say what is different (the freeze, Milo, the 45 levels). [INFERRED]

### 2.3 Who writes these pages (what the evidence says)

- The cabinet's form has fields description, how-to-play, story, developer comment and category [MEASURED: get_application output], and the wiki's MCP page lists "title, description, how-to-play, supported devices and languages" as editable [MEASURED: wiki mcp.md]. The public headings (About, How to Play, Story / Setting, Controls, Key Features, FAQ) line up with those fields and with the Wrap guide's list (About Game, How to Play, Game Features, FAQ) [MEASURED: wiki deploy-with-playgama-wrap.md].
- Some headings look machine-written ("How to Play X: Draw Lines, Earn Stars", "The Gameplay Vibe", "Quick Verdict", "Technical Check" on 5 pages), and 27 of 60 pages contain caption-like sentences ("One scene shows ..."). The Wrap guide says screenshot captions count as page text and recommends real-gameplay captions. [MEASURED counts; INFERRED: Playgama rewrites or expands developer text and folds in screenshot captions. I cannot prove who wrote each page.] Practical reading: what the developer supplies shapes the page, but do not expect it to appear word for word.
- The meta description and the `<title>` have no field in the cabinet, are formulaic on all 60 pages and always say "online" and "free". [MEASURED; INFERRED: Playgama generates them.]

### 2.4 Above the fold [UNVERIFIED, read from DOM order]

In the page HTML the order is: breadcrumb, H1 (game name), star rating and votes, a details list (developer, orientation, platforms, release date, categories, collections, engine, supported languages), then a ranked list of other games, and only then the About block. The description therefore sits BELOW the game frame and the details in the source order. The H1, rating, developer and category tags are what a visitor sees first. I did not take a screenshot, so I cannot say what fits on a desktop or phone screen without scrolling. [INFERRED from DOM order]

### 2.5 Why descriptions matter on Playgama: evidence

| Statement | Source | Grade |
|---|---|---|
| Recommended content fields (feature list, FAQ, genres) and screenshot captions "affect search ranking and conversion"; HTML title under 65 characters, description under 160 | Playgama wiki, Deploy with Playgama Wrap [MEASURED: fetched 9 Nov] | [REPORTED: first-party] but for Wrap sites (a developer's own domain), not for the catalog page |
| Wrap guide fields: About (core loop and audience), How to Play (desktop and mobile), Features (at least 3), FAQ (at least 3 Q and A), three or more screenshots with captions | Same page | [REPORTED: first-party] |
| Sandbox pages are public web pages and skip moderation; publication needs title, description/how-to-play form fields, three covers and a category | Wiki mcp.md [MEASURED] | [REPORTED: first-party] |
| Required covers: square 800x800, portrait 1080x1920, landscape 1920x1080, PNG or JPEG, 10 MB each | Same page | [REPORTED: first-party] |
| Game requirements: the game must teach controls and goal "through a tutorial or onboarding rather than a wall of text" (3.1.3); the title in the game must match the title in the request (3.5.1); no one else's names, logos or characters (4.2.3), no posing as an official product (4.2.4), no unrelated brands (4.2.5); AI-made-only games rejected (4.3.1) | game-requirements pages via get_game_checklist [MEASURED] | [REPORTED: first-party] |
| Wiki says NOTHING about description wording, length, cover design or how-to-play text in the moderation requirements; the moderation FAQ speaks only of compatibility checks, order and timing (3 to 5 business days) | Wiki game-requirements, FAQ game-moderation [MEASURED] | [MEASURED: absence on those pages; `llms.txt` index also has no page on descriptions, covers or the game page] |
| Public Playgama pages are crawlable and carry FAQPage markup, so descriptions are search-engine text | 60 pages [MEASURED for the markup] | Why that helps ranking: INFERRED; I found no Playgama statement about its own catalog's search ranking |

So: first-party Playgama text says content fields affect search ranking and conversion only on its Wrap documentation. For the catalog page, my reasoning is [INFERRED]: the page is a public web page with an H1, a title, a meta description and about 300 words, a cover is the visible hook, and the text is what a search engine and a hesitating visitor can read. No conversion or search figure was found anywhere, so how much it matters is UNKNOWN.

---

## 3. DRAFT description and how-to-play for the owner (INFERRED from findings above; a draft, not final)

Not decided. For the owner to edit and approve. English only. Title exactly **BRO, YOU'RE COOKED.** Category Puzzle (the form has category empty; the console list of options was not checked by me). No brand names. Claims drawn only from the facts given by the owner and from the game's own code (phases live, freeze, draw, run; tap to retry during a run; `js/game.js`). Things for the owner to confirm are marked CONFIRM.

How the draft uses the findings:
- Structure mirrors the template on 60 of 60 pages (About, How to Play, Controls, Key Features), so the Playgama page layout reads normally. [MEASURED]
- Length: variant A totals about 257 words, B about 260, close to the 268 to 320 word medians. [MEASURED medians]
- A "How to Play" with the goal and the star rule in the first sentences, like the nearest competitor and the 13 goal-first pages. [MEASURED]
- Controls are one line per input, with a desktop and a mobile line because the brief wants one-finger play and Playgama requires both control schemes if both are supported (1.5.3). [MEASURED]
- A direct "you" opening is the commonest shape in the top 25 (13 "drops you into" openers). Variant B uses a character-first sentence; variant A a benefit sentence. [MEASURED]
- I did not stuff the keywords "free", "online" or "brain": the page title and meta already carry "free" and "online" on every page I saw, and "brain" is not honest for BYC. "Puzzle" and "physics" are kept because they are true and are the category words. [INFERRED]
- Only one idea per section; the hazard list is the "what will I meet" line that the competitor also uses. [INFERRED]
- I leave out "free", "no ads", "instant restarts", "tutorial" because I have not verified them. CONFIRM before adding "free".

### Variant A: benefit-first

**About BRO, YOU'RE COOKED.** (description field, 75 words)
> Draw one line and get Milo out alive. BRO, YOU'RE COOKED. is a physics rescue puzzle where every level freezes a heartbeat before disaster. Read the scene, draw a single line with one finger, and watch the world play out. Block the boulder, steer the rock, hold the gate open. Clear all 45 levels across seven chapters, then come back for the daily challenge and chase three stars with the shortest line you can draw.

**How to Play BRO, YOU'RE COOKED.: Draw One Line, Earn Three Stars** (how-to-play field, 99 words)
> Every level starts moving, then freezes a heartbeat before things go wrong. Look at the scene and work out what will hurt Milo. Draw one line to stop it, block it or steer it. When you finish the line, time starts again. Get Milo to the exit alive to clear the level. The shorter your line, the more stars you earn, up to three. Along the way you will meet falling rocks, pressure plates that open gates, a dog who needs rescuing too, angry bees, TNT, air currents and cracking floors. If it goes wrong, tap to try again.

**Controls** (29 words)
> - Touch and drag: Draw your line (one finger is all you need)
> - Click and drag (desktop): Draw your line with the mouse
> - Tap: Try again after a failed attempt

**Key Features** (54 words; only if the form has a field for it)
> - 45 levels in seven chapters
> - One line, one chance to change the outcome
> - Three stars for the shortest line
> - A new daily challenge
> - Falling rocks, plates and gates, bees, TNT, air currents and cracking floors
> - A dog to rescue as well as Milo
> - Made for one-finger play on phones, and works with a mouse

### Variant B: story-first

**Story / Setting** (story field, 46 words)
> Milo is having the worst day of his life, and it is about to get worse. A boulder is rolling his way, bees are on the hunt, the floor is cracking, and the only thing standing between him and disaster is you. Luckily, you can draw.

**About BRO, YOU'RE COOKED.** (78 words)
> Milo is walking straight into trouble, and BRO, YOU'RE COOKED. gives you exactly one line to get him out of it. Each level plays out for a few seconds and then freezes a heartbeat before disaster. That is your moment: draw a single line with one finger, and see whether the rock, the dog, the bees and the gates do what you hoped. 45 levels across seven chapters, a daily challenge, and three stars for the shortest line.

**How to Play BRO, YOU'RE COOKED.: Watch, Freeze, Draw** (82 words)
> Watch the level move, then freeze just before it goes wrong. Spot the danger, then draw one line to block it, steer it or hold it back. Finish the line and the world runs on: if Milo reaches the exit alive, you win. Shorter lines earn more stars, up to three. New dangers keep arriving: falling rocks, pressure plates that open gates, a dog to bring home, bees that chase, TNT, air currents and floors that crack. Tap to retry straight away.

Controls and Key Features: use the same as variant A.

**Optional FAQ (the competitor pages with an FAQ use 4 to 6 Q and A; the Wrap guide recommends at least 3 when there is a field)** [INFERRED]
> Q: How many levels are there? A: 45 levels in seven chapters, plus a daily challenge.
> Q: How do I earn three stars? A: Finish the level with the shortest line you can draw.
> Q: Do I need sound? A: CONFIRM before publishing; the repo's rule is that no information is carried by audio alone, but I did not test the build with sound off.
> Q: What is the daily challenge? A: CONFIRM wording; the repo describes it as a shipped level at a tighter ink budget each day (UTC).

Facts I used and where they come from: 45 levels, seven chapters, one-finger play, daily challenge, three stars for the shortest line (the owner's task text, plus CLAUDE.md for stars and ink); falling rocks, plates and gates, dog, bees, TNT, air, cracking floors (owner's list); "freezes before disaster", "tap to retry" (js/game.js phases LIVE, FROZEN, SIM and the retry comment). I did not run the game; whether every hazard appears within the 45 levels in the shipped build is the owner's to confirm.

---

## 4. What this means for a BYC cover and store page (INFERRED)

1. A cover is a one-second decision at a tile smaller than a feed card: one idea, large, high contrast (consistent across all 7 sets). Show Milo and the thing about to hit him, aimed at him, nothing else. [INFERRED from 1.3 and 1.5]
2. The genre's most-viewed items are raw-gameplay Shorts, which says little about tile design; the designed long-video tiles in the same genre show the CHARACTER large with the swarm. BYC's character is Milo and the dog; there is no human-face equivalent to copy and none to copy from. [MEASURED images; INFERRED reading]
3. Do not use MrBeast's face, name, branding, referee shirts, "$" amounts or series wording; do not use other games' logos (Techno set). Playgama 4.2.3 to 4.2.5. [MEASURED rules]
4. The description is public search text and the page body is a templated 300-word block; the draft above fills it with accurate, specific text. How much traffic it brings is UNKNOWN. [INFERRED]
5. The competitor page already says "draw a line, dog, bees, stars"; the BYC text should lead with what is different (one line, the freeze before disaster, Milo, 45 levels, the daily). [INFERRED]

## 5. Decisions for the owner

1. The cabinet form is empty (description, how-to-play, story, category all null; devices and languages empty). Do you want these drafts, edited, put into the form? That is an `update_application_form` write, which I did not touch.
2. Variant A or B (or mix)?
3. Can the page say "free"? Is the daily and the no-audio-only claim true in the shipped build?
4. Category: Puzzle only, or also another tag (the catalog auto-classifies too, per the wiki)?

## 6. Limits and what I could not check

- YouTube's own thumbnail-design guidance: none exists on the pages I fetched; I could not find a YouTube creator-blog post or video transcript. The Appleby talk (HP-rqigfw2s) was not opened; I used write-ups, so his exact words are unverified. The Forbes and Netflix primary pages returned 403 or 404 for me.
- The leaked guide: I did not open the document or any mirror; only Dexerto and Fortune summaries.
- Creator sets: hand-picked, recent-video samples, eyeball counts at 200x112, the genre set picks by view count; the mapping of individual tiles to channels inside the genre contact sheet has +/-1 uncertainty and I describe the set, not tile by tile. No view data on CTR exists.
- Playgama pages: fetched on 9 Nov, lists from 6 Nov; the page template can change; no browser rendering, no screenshot, so above-the-fold is UNVERIFIED; the keyword and shape counts come from my own regexes (+/-3). I cannot see whether Playgama or the developer wrote any given text.
- Playgama wiki: I read game-requirements (all 7 sub-pages), guides index, mcp.md, deploy-with-playgama-wrap.md, the moderation FAQ and llms.txt (via a summarising fetch tool, so paraphrase). The Wrap guide is for own-domain sites; its ranking and conversion statement is not about the catalog.
- No Playgama write tool was called; only get_game_guides, get_game_checklist, list_applications and get_application (read-only).
