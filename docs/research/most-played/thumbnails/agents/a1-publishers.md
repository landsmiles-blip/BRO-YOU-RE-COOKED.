# A1: who makes the top games, and how and why they package them (9 Nov 2026)

Helper A1. Read-only study; no Playgama write tool, no vidIQ credit, no login used. Scratch files (iTunes JSON, App Store icons and screenshots) are in `THUMBS/work/a1/` (git-ignored). Tags per BRIEF.md.

## Correction to the task statement first
The task says "rank order = row order" in the hub CSV. That is wrong: `dom_rank` / row order is the order tiles sat in the page DOM, not plays. Tall Man Run is row 183, Build a Queen row 268, Going Balls row 106. [MEASURED: sorted `plays_int` of all 1,124 rows, 9 Nov] So "top 40" below means top 40 BY PLAYS (112m down to 27m). Plays are the snapshot's rounded counters from 5 Nov; the tracker's counters are from 8 Nov (small drift, e.g. Skincare Time 68m vs 69M).

## Summary (what I found)
1. [MEASURED + REPORTED] All 40 of the top 40 by plays are attributed to a publisher (40 of 40), but only 5 of the 40 attributions are first-party-confirmed by me (App Store seller field = SUPERSONIC STUDIOS LTD for Tall Man Run, Build A Queen, Going Balls, Bridge Race, Emoji Puzzle). The other 35 rest on one third-party tracker (playables.games / TubeGames publisher pages and per-game pages). Details in table 1.
2. [REPORTED: tracker, and CALC] Seven publishers hold 31 of the top 40: SayGames 9, Supersonic 7, CrazyLabs 5, Voodoo 3, Azur 3, Famobi 2, Supercent 2. The other 9 are Playgama (1) and 8 single-title companies.
3. [MEASURED: hand-read of 13 Supersonic hub tiles] Supersonic's hub tiles almost never carry the game's name: 1 of 13 (Build a Queen). SayGames 12 of 13, Voodoo 12 of 13 (one matched row is ambiguous), Supercent 7 of 7 carry a big title; CrazyLabs 0 of 8. So the top publishers do NOT share one rule on lettering.
4. [MEASURED] What Supersonic's tiles share instead: ONE big, round, glossy 3D clay-like subject or character, shown big and close, saturated bright background (sky blue, cyan, white track), and a visible choice or contrast (Tall Man Run: devil gate against angel gate; Build a Queen: dirty gate against clean gate; Bridge Race: two rivals on two staircases).
5. [REPORTED: Supersonic blog, first-party, 10 Jan 2023] Supersonic tests store icons for conversion and publishes the results. Its own examples include Tall Man Run (+15% CVR for showing real game elements, the multiplier gates and the actual character) and Emoji Puzzle (+30% for replacing a laughing emoji with a drawn line connecting emojis from the real gameplay). Numbers are Supersonic's own, with no sample sizes; they are selected wins.
6. [REPORTED: Supersonic blog, 22 Jul 2020] Supersonic validates a game by running video ads and measuring CPI before full development; it prefers CPI to CTR because a high CTR once came with a much higher CPI; it names a CTR above 4% and a CPI near $0.30 as marks; it advises no on-screen instructions in ads.
7. [REPORTED: third-party] Voodoo and others are reported to run fake-ad CTR tests before building, and Voodoo to test about 1,500 prototypes a year. I did not read a first-party Voodoo page that says this.
8. [MEASURED: looked at both] Tall Man Run's store icon (a small orange figure beside a huge muscled one, red "!") is a different picture from its YouTube hub tile (a gate pair and a big yellow figure from behind). Same publisher, same game, two compositions, both title-free.
9. [MEASURED] The closest thing to BYC in Supersonic's catalogue is Emoji Puzzle: its hub tile shows a drawn line plus a hand cursor on a plain white-grey background (no title); its icon shows a thick red line linking emojis. The tile shows the verb itself.
10. [INFERRED] I found no evidence that any of these look choices CAUSE plays. Plays here follow publisher, age and distribution; see confounds.

## 1. Who made the top 40 (by plays)
Source codes: AS = App Store seller field via iTunes search API (first-party store data) [MEASURED, 9 Nov]; TR = playables.games publisher page or game page, listing the publisher (third-party tracker; its attribution, not YouTube's). Confidence: HIGH = AS, or TR page plus a second source in the repo (`distribution.md`); MED = TR only.

| # | Title (CSV row) | Plays | Publisher | Found by | Conf. |
|---|---|---|---|---|---|
| 1 | Tall Man Run (183) | 112m | Supersonic | AS + TR | HIGH |
| 2 | Build a Queen (268) | 107m | Supersonic | AS + TR (distribution.md names dev Bartoo) | HIGH |
| 3 | Snake Clash! (41) | 105m | Supercent | TR | MED (repo notes a Supercent splash) |
| 4 | Going Balls (106) | 102m | Supersonic | AS + TR (dev Pronetis per distribution.md) | HIGH |
| 5 | Stealth Master (2) | 99m | SayGames | TR | MED |
| 6 | Dessert DIY (52) | 96m | CrazyLabs | TR | MED |
| 7 | Thief Puzzle (94) | 95m | Famobi | TR + distribution.md | MED-HIGH |
| 8 | Race Master 3D (10) | 88m | SayGames | TR | MED |
| 9 | Phone Case DIY (251) | 84m | CrazyLabs | TR | MED |
| 10 | Hole.io (166) | 75m | Voodoo | TR | MED |
| 11 | Hide N Seek (39) | 74m | Supersonic | TR | MED |
| 12 | Magic Tiles 3 (689) | 71m | Amanotes | TR game page | MED |
| 13 | Bridge Race (42) | 70m | Supersonic | AS + TR | HIGH |
| 14 | Skincare Time: Makeover ASMR (241) | 68m | Cone Limited | TR game page | MED |
| 15 | My Mini Mart (402) | 62m | Supersonic | TR | MED |
| 16 | Color Page ASMR (20) | 61m | SayGames | TR | MED |
| 17 | Sculpt People (302) | 58m | CrazyLabs | TR | MED |
| 18 | Find the Alien (79) | 54m | Moonee Publishing | TR game page | MED |
| 19 | Emoji Puzzle (132) | 42m | Supersonic | AS + TR | HIGH |
| 20 | Aquapark.io (236) | 42m | Voodoo | TR | MED |
| 21 | Vehicle Masters (15) | 41m | SayGames | TR | MED |
| 22 | Fork N Sausage (359) | 41m | SayGames | TR | MED |
| 23 | DOP 4: Draw One Part (766) | 41m | SayGames | TR + distribution.md | MED-HIGH |
| 24 | Mini Relaxing Game- pop it (174) | 40m | Game District LLC | TR game page | MED |
| 25 | Decor Life (36) | 39m | SayGames | TR | MED |
| 26 | Save The Pets (109) | 39m | SUN.STUDIO | TR + distribution.md | MED-HIGH |
| 27 | Running Pet Dec Room (68) | 35m | IVYMOBILE International | TR game page | MED |
| 28 | DOP 2: Delete One Part (706) | 35m | SayGames | TR | MED |
| 29 | Solar Smash (62) | 33m | Paradyme Games | TR game page | MED |
| 30 | Zoo - Happy Animals (63) | 33m | SayGames | TR | MED |
| 31 | Fashion Battle (323) | 33m | Famobi | TR | MED |
| 32 | Prison Life: Idle Game (78) | 32m | Supercent | TR | MED |
| 33 | State.io (304) | 30m | Azur Interactive Games | TR game page | MED |
| 34 | Draw Climber (499) | 29m | Voodoo | TR | MED |
| 35 | Hill Climb Racing Lite (568) | 29m | Fingersoft | TR game page | MED |
| 36 | Dig Deep (22) | 28m | CrazyLabs | TR | MED |
| 37 | Flow Legends (149) | 28m | Azur Interactive Games | TR game page | MED |
| 38 | Sword Play (547) | 28m | Azur Games | TR | MED |
| 39 | Drawing Carnival (683) | 28m | CrazyLabs | TR | MED |
| 40 | Fashion Princess (29) | 27m | Playgama | TR | MED |

Recurrence [CALC from table]: SayGames 9, Supersonic 7, CrazyLabs 5, Voodoo 3, Azur (Games or Interactive) 3, Famobi 2, Supercent 2, Playgama 1, single-title others 8 (Amanotes, Cone, Moonee, Game District, SUN.STUDIO, IVYMOBILE, Paradyme, Fingersoft). Total 40.
Publisher totals on the tracker's list (8 Nov) [REPORTED: playables.games/publishers/]: Supersonic 692M over 14 titles, Playgama 568M over 175, SayGames 541M over 14, Famobi 414M over 50, CrazyLabs 353M over 9, Voodoo 303M over 18, Mediacube 239M over 250, GameSnacks 202M over 33, Supercent 180M over 19.
Caveats: (a) the tracker shows the publisher, not the developer: "Supersonic" is a publisher whose developers differ per game (distribution.md: Bartoo, Pronetis). (b) "Publisher" here can be the account that submitted to YouTube. (c) Not on this list but named by the owner: Kwalee, Rollic (7 titles, 46M), Lion Studios; none is in the top 40, so I did not study them. Ruby Game Studio: not found in the top 40 or the tracker's top 60 publishers by my reading; not verified further.

## 2. Design coding (all by looking at the images this session)
Images looked at: hub tiles for 13 Supersonic titles (Draw The Line, listed by the tracker, has no title match in the CSV, so 13 not 14), 13 SayGames, 8 CrazyLabs, 13 Voodoo, 7 Supercent; App Store icon plus screenshots for Tall Man Run, Emoji Puzzle, Bridge Race, Going Balls, Build A Queen; the first 24 Playgama "top" tiles (1920x1080 landscape). Playgama's crawled catalog holds none of Supersonic's titles (grep of 254 downloaded filenames for Tall/Bridge/Emoji/Going/Hole: no hit; partial crawl, so NOT proof of absence).

### Supersonic hub tiles (portrait, ~194x272)
| Title | Subject and camera | Face or expression | Colour and ground | Name on tile | Stakes or choice shown |
|---|---|---|---|---|---|
| Tall Man Run | one big yellow-orange blob figure, seen from behind, lower two thirds | none (back) | white striped track, pale blue | no | two gates: devil face on red, halo face on green |
| Build a Queen | one doll figure from front, centre | calm | white track, cyan sky | YES, pink script, top | two gates: muddy red vs clean blue |
| Going Balls | one huge ball, close, from behind | none | blue water, wooden bridge | no | narrow bridge over water |
| Hide N Seek | top-down maze, two chibi runners, red "!" | none | green, yellow walls, blue | no | "!" and a chase |
| Bridge Race | two rival figures, each pushing a ball up own staircase | none (backs) | blue, red and green steps | no | race of two |
| My Mini Mart | pink figure at a register, mountains of melons and cash | none | white-grey floor, green and cash | no | abundance |
| Emoji Puzzle | five-six emojis, a thin line, a hand cursor | emoji faces | near-white | no | the verb (draw a line) |
| Color Match | giant pig emoji face, hand, two paint colours | smug | cyan | no | match task |
| Basket Battle | two bean figures, hoop | big eyes | blue-violet | no | duel |
| Bazooka Boy | a row of red enemies on a block, aim reticle, small blue shooter | none | cyan sky, sand | no | aim and a threat |
| Stacky Dash | blue figure on a stack of discs | none | yellow and magenta | no | path |
| Merge Miners | pick on grey rock, light beam | none | grey, violet | no | - |
| Family Life | three round portrait photos joined by a coloured line | photo faces | cyan | no | - |
[MEASURED: hand-read 9 Nov; the rubric is mine, one rater, no second pass.]

Pattern across the 13 [MEASURED count, then INFERRED reading]:
- Title lettering on tile: 1 of 13 (Build a Queen).
- A figure or object that is the single subject, large: about 11 of 13 (Family Life and Merge Miners are the exceptions).
- Faces visible and expressive: only 5 of 13 (Emoji Puzzle, Color Match, Basket Battle, Family Life, Build a Queen); most characters are faceless blobs or seen from behind.
- Background bright and saturated or near-white: 12 of 13 (Merge Miners is grey).
- 3D render look (soft clay shapes, simple lighting): 10 of 13; flat 2D or emoji: Emoji Puzzle, Family Life, Color Match (emoji render).
- Light backgrounds, no dark tiles among the 13.
- Consistency: Supersonic tiles are NOT one house style; they share traits (glossy toy shapes, light background, one subject) but there is no common logo, frame or font. Two portraits differ most: Going Balls (dark-green, photographic-style) and Emoji Puzzle (flat white).
- The mechanic or a choice is frequently the picture: gates (2 of 13), two-lane race (1), drawn line (2).

### Same game, two formats (App Store vs hub) [MEASURED: viewed both]
- Tall Man Run icon: tiny orange figure left, giant muscular orange figure right, red "!" on a blue sunburst. No gates, no name. Hub tile: gate pair plus big figure, no name. The store icon sells "get huge"; the hub tile sells "choose a gate".
- Emoji Puzzle icon: thick red line from a smiling emoji to a burger, light-blue radial ground, no hand, no name. Hub tile: near-white, thin line, hand cursor.
- Bridge Race icon: two figures pushing balls up steps on bright blue; screenshots carry a caption bar with 2 to 3 words ("BUILD FASTER", "RACE TO VICTORY") on a blue strip.
- Going Balls: icon is a close ball on a bridge; screenshots are real gameplay with HUD.
- Screenshots in all five are real gameplay frames (levels, gates, HUD), on bright sky backgrounds.

### Other publishers (hub tiles)
- SayGames [12 of 13 carry the name]: bold 3D title wordmark top third, one character or vehicle below, saturated dark or bright ground (Stealth Master purple, Race Master magenta, Turbo Stars green). The DOP and Color Page tiles are white with a rounded logo and small hand-drawn pictures.
- CrazyLabs [0 of 8 carry a title]: macro close-up of ONE tool touching ONE satisfying material (roller on pink icing, marker on a phone case, needle on a clay face). ASMR objects, no characters. Pink, cyan or rainbow.
- Voodoo [12 of 13]: chunky outlined wordmark, frequently an in-game 3D scene behind it; more than half carry a gameplay-style action image.
- Supercent [7 of 7]: big rounded title plus a round-headed faceless character in the job (police, doctor, pizza cook). Palette blue and white or pastel.
- Playgama's own top-24 catalog tiles (landscape): title on art 13 of 24; characters or hands in 17 of 24; Gym Simulator uses an arrow from a "+1" small man to a "+100000" huge man: a before/after promise. Mixed styles, less consistent than Supersonic. [MEASURED: hand-read]

## 3. What the publishers say (sources and grades)
First-party = the publisher or platform wrote it. All claims [REPORTED].

| Source | Who / date | First or third party | What it says (paraphrase) | Limits |
|---|---|---|---|---|
| supersonic.com/learn/blog/5-design-tips-for-hyper-casual-icons-to-improve-your-app-store-cvr | Supersonic, 10 Jan 2023 | FIRST | Five icon tips: keep contrast high (dark red-brown-yellow to bright blue: +3% CVR, Arm Simulator; Color Match +8%); make it relevant to the mechanic (Emoji Puzzle +30%, Tall Man Run +15% for showing the gates and the actual character); say it with simplicity, enlarge the key element (Get the Supercar +22%, Perfect Lie +10%); take cues from top-performing ad creatives (String Art +8%); test different styles (cartoon, emoji, realistic, sketch). Extra: My Mini Mart darker outline +7%; First to Life emoji instead of numbers in gates +15%. | Selected wins, no sample sizes or confidence intervals; "CVR" is store-page conversion on a mobile store, not the YouTube hub. |
| supersonic.com blog (id 55611, marketability testing) | Supersonic, 22 Jul 2020 | FIRST | Test several video ads at once; prefer CPI to CTR (a strong CTR once came with a much higher CPI); CTR above 4% = possible fit; CPI near $0.30 = hit mark; if CPI is over $1 art changes alone will hardly fix it; avoid on-screen instructions (they lower engagement; needing them means the gameplay is not intuitive). | Fetched via a summariser; I did not read the full text. |
| supersonic.com/case-studies/emoji-puzzle | Supersonic, undated | FIRST | Its in-house creative studio made the video that showed levels and mechanics and helped lower CPI; CPI $0.22, D1 47%, prototype to publishing about one month; previous publishers took 5 to 6 months for the first marketability step. | Marketing copy. Mentions nothing about the icon. |
| supersonic.com/learn/webinars/how-to-make-killer-creatives... | Supersonic creative team leader, about late 2021 (my inference from image dates) | FIRST (thin) | Landing page only: principles, player psychology, out-of-the-box ideas. | No content beyond the topic list. |
| learn.unity.com marketability-tests tutorial | Unity/ironSource | FIRST (thin) | Says prototypes go through marketability tests and lists a creatives-tips section. | Page text gave no numbers. |
| Voodoo interview via search summary (not opened by me) | Voodoo | FIRST per summary | Studios can launch free test campaigns for prototypes from day 1; artists test a lot of creatives daily. | Unread by me; search-engine summary only. UNVERIFIED. |
| newsletter.failory.com "Ad-Driven Validation" | Failory | THIRD | Says Voodoo and others run fake-ad CTR tests before building. | Secondary; search summary only. |
| Clicksflyer post | third-party blog | THIRD | 5 to 10 test videos from a prototype, CPI under $0.30 as go-ahead. | Secondary. |
| Google Play Console help (store listing experiments) | Google | FIRST | Play lets developers A/B test icon, feature graphic and screenshots. | Google Play only; I did not open the page, so details UNVERIFIED. It tells us nothing about Playgama or YouTube. |
| Playgama business FAQ (thumbnails) | Playgama | FIRST | Covers come as square, portrait and landscape; sizes differ per portal; the thumbnail affects first impressions. | No design rules. |
| Deconstructor of Fun on Voodoo | third party | THIRD | Fetched; says nothing about creatives. | Negative result. |

Things I could NOT find: any Playgama or YouTube Playables page giving thumbnail DESIGN guidance (search returned only general YouTube video advice; one Google URL guessed returned 404). One search snippet said a Supersonic "Bazooka Boy" video that showed a level failing repeatedly reached a CPI of 15 cents; the Supersonic page I fetched does not mention Bazooka Boy, so I treat that as UNVERIFIED and unused.

## 4. Why do these tiles look the way they do?
[REPORTED] (first-party, Supersonic):
- Supersonic's icon and creatives come out of a test loop. Games are judged by ad video CPI before full development (2020 post); icons are then A/B tested for store conversion and the winners are written up with percentages (2023 post). Its in-house creative studio makes the videos (case study).
- The tested levers it names: contrast, relevance to the actual mechanic and characters, fewer larger elements, borrowing from the best-performing ads, and style variation.
- Its advice is to show the real thing (gates, the actual character, the drawn line) and not to explain with text.

[INFERRED] (my reading, not stated by anyone):
- The hub tiles look like store icons and ad frames because the same art team and the same test loop produce them. The tile is probably a cut from the same creative pool: one subject, readable at thumbnail size, bright.
- The absence of a title on most Supersonic tiles is consistent with a game whose store page, name text and icon sit together elsewhere, but on the YouTube hub the name is shown below the tile by the platform in at least some layouts (UNVERIFIED), which could make a title on the art redundant. I have not checked this layout this session. SayGames, Voodoo and Supercent put the title on the art; both groups have games at 100m plays, so title-on-art does not separate winners from non-winners here.
- Choice-and-consequence (two gates, devil or angel, dirty or clean, small or huge) gives a viewer a mini question before any play: "which one?". [INFERRED]
- Faceless blobs from behind, plus bright backgrounds, make each tile read at 194x272 and keep production cheap; but it is also the common look of the genre, so a tile that looks like that blends into 1,124 others. [INFERRED]

Confounds when comparing plays [stated per BRIEF]: Supersonic, SayGames, CrazyLabs and Voodoo are big publishers with a promoted route (YouTube itself named several of them as among the most popular); Tall Man Run has been live about 988 days and Build a Queen 533 (distribution.md, tracker's first-seen dates); the hub is personalised; no click-through data exists outside YouTube or Google. So none of the above shows that any tile design earns plays.

### What would these publishers do with BYC? [INFERRED]
They would keep the mechanic as the picture, not an illustration of the title: Milo small and obviously doomed, a boulder huge and obviously about to hit, the one drawn line as the only high-contrast stroke, background a flat saturated colour, almost no words, and they would make 3 to 6 versions and test them (a different background colour, a different crop, with and without a face) before choosing. They would not put an instruction on the art.

## 5. Five checkable design rules for BYC
Each is from evidence above; the BYC application is INFERRED. Check at the real display sizes: Playgama landscape ~221x148 to 450x277 (1920x1080 source) and the hub portrait 194x272 (5:7), with the 71% middle crop in mind for any square.

1. ONE subject, enlarged. Supersonic: "say it all with simplicity" (+22%, +10% examples). Check: at 194x272 and at 221x124, no more than three distinct elements (Milo, boulder, line); Milo's head at least one fifth of tile height; no grid, UI or small decoration.
2. SHOW THE VERB AS THE PICTURE. Emoji Puzzle's tested icon is the drawn line; Tall Man Run's real gates and character beat a generic one. Check: the player's line is visibly drawn, thicker than the outline of anything else, in the highest-contrast hue, and runs between the threat and Milo; a stranger can say "draw a line to save him" from the image with the title covered.
3. SHOW THE STAKES AS A CHOICE OR A BEFORE/AFTER. Tall Man (small vs huge, devil vs angel), Build a Queen (dirty vs clean), Gym Simulator on Playgama (+1 to +100000 with an arrow). Check: boulder occupies roughly a quarter or more of the tile area, and sits clearly above Milo, with the gap between them readable at the small size; Milo's face shows alarm (Milo is a face character; most Supersonic tiles are faceless, so this is where BYC can differ).
4. HIGH CONTRAST, BRIGHT, AND NOT LIKE ITS NEIGHBOURS. Supersonic reports a bright blue background beating dark red-brown-yellow (+3%); 12 of 13 of its tiles are saturated or near-white. Check: subject-to-background luminance difference is large when the image is turned to grey; then place it in a mock grid of real neighbours and see whether it pops (note that most hub tiles are saturated blue/pink, so a pale or inverted palette might stand out more: test, do not assume).
5. NAME IT AS A TEST, NOT AS A RULE; AND MAKE VARIANTS. Title-on-art is split among the winners (SayGames/Voodoo/Supercent yes, Supersonic/CrazyLabs no), and Playgama catalog tiles are 13 of 24. Check: build one title-on-art and one title-free variant per format; if the title goes on, it is big (about a quarter of the width or more), thick, outlined, in the top third, and short (the full "BRO, YOU'RE COOKED." in two lines); no instruction text on any variant (Supersonic's on-screen-instruction advice).

How to test: Playgama's sandbox gives real players and telemetry, but I found no documented cover A/B facility on Playgama or YouTube (Google Play has one; Playgama and YouTube: UNVERIFIED). Any variant test must be sequential and will be confounded by time.

## 6. Rules that limit copying
- Playgama 4.2.3 to 4.2.5 (per the repo's PLAN.md/STATUS.md; I did not re-read the Playgama terms): no one else's brand, names, characters or logos, no pretending, no unrelated brands to attract an audience. So: no Tall Man blob, devil/angel gate pair, Supersonic wordmark, MrBeast or emoji-set art; use only the principle (one subject, the verb on the art, a before/after).
- YouTube Playables design rule (per tile-census.md and distribution.md, source developers.google.com ... requirements_design, read through a summariser, not by me this session): no branding or logos of studios or platforms in the thumbnail, description or title; no misleading titles or thumbnails. So no studio or platform splash or badge on the art, and the picture must be what the game is (a boulder and a drawn line, not a fake gameplay frame the game does not have).
- Playgama 4.3.1 footnote per STATUS.md: AI-made visuals perform worse, so build from the game's own renderer.
- The principles are from other people's tiles; do not trace, crop or reuse any of them.

## 7. Limits
- Publisher attribution rests mostly on one third-party tracker; 35 of 40 are single-source. Tracker fields are its own attributions.
- Hand-coded design coding by one rater, no second pass, on 13 + 13 + 8 + 13 + 7 hub tiles and 24 Playgama tiles; the ambiguity in the Voodoo "Knock" row (three CSV matches; I used the first) is not resolved.
- CVR percentages come from Supersonic's marketing copy, on app-store icons in 2023, not on YouTube or Playgama, and without sample sizes.
- Voodoo's first-party description of its testing, Google's Play experiments page and Playgama's cover rules were not read in full by me.
- I did not check whether the hub shows the game name under the tile.
- No retention, click-through or per-tile impression data exists to me; nothing here is a causal claim.
