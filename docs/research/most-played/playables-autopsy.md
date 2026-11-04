# YouTube Playables autopsy (Agent C), run 4 Nov 2026

Grades: MEASURED = I saw or played it in Chrome on 4 Nov 2026. REPORTED = a named third party. INFERRED = my reasoning, labelled. UNPROVEN = plausible, no evidence.

## 1. Method and honest scope

- Chrome reached youtube.com/playables and the game pages (logged-in Premium account; I did not sign in, buy anything or touch ad pages). Hub tiles show a play count under every title, so I scrolled the Browse grid to the end and scraped title + plays for every tile (MEASURED).
- I opened 14 games and logged first screens: Thief Puzzle, Save The Pets, Draw Bridge, Home Rush, Dog Escape, Tricky Twist, Single Line Drawing Puzzle, Doge Rescue, Draw To Smash Classic, Draw Puzzle: Complete One Part, Tall Man Run, Build a Queen, Going Balls, Snake Clash. The brief asked for about 25; I did not reach it. I drew in only 3 (Save The Pets, Draw Bridge, Home Rush) and only Save The Pets gave a real fail/retry cycle.
- Tool limits that hurt: (a) click-drag sends a fast 2-point drag, so most drawing gestures did not register; (b) 12+ game tabs open at once made the Supersonic/Supercent games sit on "taking longer than expected" for 30+ s, so their load times are NOT valid; (c) the browser is shared with other agents; (d) a game tab cannot be navigated away from (leave-site dialog), so each game needed a fresh tab; (e) Thief Puzzle's Play button animated on click but never started in about 40 s; (f) the account is Premium, so ad behaviour may be suppressed. I saw NO interstitial in about 20 minutes, which is not evidence that non-Premium players see none.
- Hub order is "For you" (personalised), not a ranking. I sorted by plays myself.

## 2. Data and source quality

| Item | Number | Date | Grade / note |
|---|---|---|---|
| Tiles scraped, first pass | 959 | 4 Nov 2026 | MEASURED |
| Tiles scraped, second pass | 1,091 | 4 Nov 2026, ~40 min later | MEASURED. Conflicts with 959: lazy loading or growth. Catalogue is at least 1,091 |
| Median plays | about 988k (Speed Master - Racing Game) | 4 Nov | MEASURED, first pass |
| Games >=10m / >=1m / <100k | 140 / 477 / 92 of 959 | 4 Nov | MEASURED |
| Catalogue size | 788 to 1,477 (Jul 1 to Sep 4) | 8 Sep | REPORTED, MediaCube blog. Differs from my scrape (mine may be incomplete) |
| Plays/day, 2026 additions | Tricky Twist 394K, Draw Fly 255K, Dog Escape 274K, Home Rush 243K | as of 4 Sep | REPORTED, MediaCube/MC Play, a vendor that also publishes games (self-interested). 15-row subset only |

Conflict worth stating: MediaCube per-day rates do not match today's cumulative hub counts. Tricky Twist: 394K/day over 17 days live by 4 Sep is about 6.7m; hub now says 10m, so only about 3.3m in 61 days (about 54K/day). Dog Escape: 274K x 35 days is about 9.6m; hub says 11m, so about 23K/day since. INFERRED: new games get a big launch push and then decay hard. Cumulative plays therefore reward age, not quality.

Top 30 by cumulative plays (MEASURED, 4 Nov): 1 Tall Man Run 112m; 2 Build a Queen 107m; 3 Snake Clash! 104m; 4 Going Balls 102m; 5 Stealth Master 99m; 6 Dessert DIY 95m; 7 Thief Puzzle 95m; 8 Race Master 3D 88m; 9 Phone Case DIY 83m; 10 Hole.io 75m; 11 Hide N Seek 74m; 12 Magic Tiles 3 71m; 13 Bridge Race 70m; 14 Skincare Time: Makeover ASMR 68m; 15 My Mini Mart 62m; 16 Color Page ASMR 61m; 17 Sculpt People 58m; 18 Find the Alien 54m; 19 Emoji Puzzle 42m; 20 Aquapark.io 42m; 21 Vehicle Masters 41m; 22 DOP 4: Draw One Part 41m; 23 Fork N Sausage 41m; 24 Mini Relaxing Game pop it 39m; 25 Decor Life 39m; 26 Save The Pets 39m; 27 Running Pet Dec Room 35m; 28 DOP 2 35m; 29 Solar Smash 33m; 30 Zoo Happy Animals 33m.

Draw / rescue / escape / save titled games and rank (MEASURED): Thief Puzzle 7 (95m); DOP 4 22 (41m); Save The Pets 26 (39m); DOP 2 28 (35m); Draw Climber 34 (29m); Drawing Carnival 38 (28m); Draw Bridge 44 (26m); Cat Escape 50 (25m); Home Rush 66 (19m); Draw Fly 123 (11m); Dog Escape 124 (11m); Tricky Twist 138 (10m); Single Line Drawing 152 (8.7m); Doge Rescue 178 (7.4m); Save the Dog-Puzzle 211 (6.1m); Draw Puzzle: Complete One Part 250 (4.3m); Draw Action 313 (2.9m); Draw To Smash Classic 453 (1.1m).

Title-keyword census (my crude regex, 1,091 titles): 51 match. 8 of the top 50 (16%) versus 4.7% overall, so the draw/rescue family is over-represented at the top by about 3x. But slots 1-6 are runners, snake, balls, stealth and DIY/makeover, not drawing games. Bucket counts of matches by rank: 1-50: 8; 51-150: 4; 151-300: 7; 301-500: 10; 501-800: 14; 801+: 8.

## 3. Per-game log (first view only; blank means not observed)

Load times are in a busy shared browser, so inflated for background tabs.

| Game (rank, plays) | Splash / look | Title pattern | Load to playable | Tutorial | Fail / retry | Ads seen | Hooks | Layout |
|---|---|---|---|---|---|---|---|---|
| Thief Puzzle (7, 95m) | cartoon thief peeking over a pink sign, blue bubble letters, big Play button | noun + "Puzzle" | splash at about 6 s; Play did not start for me | not reached | not reached | none | not reached | portrait-ish, centred |
| Save The Pets (26, 39m) | Shiba dog under bees in a brick shaft, water below | "Save The [animals]" | about 10-15 s, no title screen, straight to Level 16 (account save or default, UNKNOWN) | none visible | visible countdown (about 6 s) after the line; fail about 9 s; crying-dog card with one big Retry; second retry instant; no ad | none | 3-star bar, pause, hint (ad icon), skip (ad icon), restart | portrait |
| Draw Bridge (44, 26m) | red car, grey cliff, flag | "Draw Bridge - Brain Game" | about 12 s, straight to Level 12 | none | not tested (draw did not register) | none | Store button with red badge, level counter, settings | wide |
| Home Rush (66, 19m) | pink baby-and-mum theme | "Home Rush - Draw to Home" | about 14 s | Level 1: dashed pink guide line from baby to house, no text | not reached | none | skip (ad icon), restart, home | narrow portrait column with pattern side bars |
| Dog Escape (124, 11m) | splash: terrified puppy fleeing two cops with nets and red vision cones | "Dog Escape" | about 12 s | Level 1 with a WASD/arrows "PRESS TO MOVE" card (desktop prompt) | not reached | none | coin and gem counters | 3D maze, not a draw game |
| Tricky Twist (138, 10m) | photo-style rooms with padlocks | "Tricky Twist: Brain Puzzle" | about 12 s | opens on a 7-day Daily Reward modal (hints, chest on day 7, "claim x2" ad button) before any level, then a locked level grid. Level 1: "Improve grandparents' lives", 59 s timer, a pile of cash in the picture, Hint (3) and Skip (ad) | not reached | none | daily reward, locked grid, stars, gift icon, "SPECIAL" row | portrait |
| Single Line Drawing Puzzle (152, 8.7m) | purple gradient, orange/white logo | descriptive | about 15 s | written tutorial screen with a ghost hand on a diamond, one sentence, LET'S PLAY | not reached | none | not reached | portrait |
| Doge Rescue (178, 7.4m) | bone-shaped logo, Shiba | "X Rescue - Save The Dog" | about 20 s ("Still loading") | Level 1 shows a dotted arc and a hand, no text | not reached | none | 3-star bar, skip, hint, pause | portrait: two hives above a pit with the dog |
| Draw To Smash Classic (453, 1.1m) | angry orange face on a brick under a grid | "Draw To [verb] Classic" | about 25 s | none seen | not reached | none | settings only | minimal |
| Draw Puzzle: Complete One Part (250, 4.3m) | MJAM logo then pencil logo | DOP clone | 20+ s, still black at 25 s | not reached | not reached | none | not reached | UNKNOWN |
| Tall Man Run (1), Build a Queen (2), Going Balls (4), Snake Clash! (3) | Unity / Supersonic / Supercent shells | short noun phrases | NOT valid: stuck on "taking longer than expected" for 30+ s in my overloaded browser | not reached | not reached | not reached | not reached | not reached |

The "Level 16" and "Level 12" starts may be this account's saved progress. Do not read them as the game skipping levels.

Not opened (no data, nothing guessed): Hole.io, Hide N Seek, Stealth Master, DOP 2 and 4, Draw Climber, Save the Dog-Puzzle, Cat Escape, Draw Fly, Draw Action, Ladder Master, Brain Out. Hub tiles seen only at the top of the grid: My Mini Mart (isometric pile of cash), Brain Up: Tricky Quiz ("Help him win!" cartoon couple), Coin Match (pirate and gems).

## 4. Patterns (thin sample)

Shared by top AND mid-table draw games I opened (MEASURED; not a differentiator):
- 10-25 s from tap to playable behind a branded loading screen. No game was faster than about 10 s.
- No text-heavy tutorial for the draw verb: a ghost hand or dotted guide (Doge Rescue, Home Rush) or one sentence plus a hand (Single Line). Under about 10 s.
- Reward-ad buttons for hint and skip on screen from level 1 (Save The Pets, Doge Rescue, Home Rush, Tricky Twist). Same corners.
- Cartoon animal or person in peril; bright flat colour.
- No interstitial before play (Premium caveat).

Seen at the top but not in the mid-table sample (weak, small n, UNPROVEN as a cause):
- Save The Pets (#26) makes every attempt a visible countdown, so a try ends in 6-9 s with a one-tap Retry. I did not fail any mid-table game, so I cannot say they lack it.
- Publisher size does not separate the groups: Thief Puzzle's studio has about 150k subscribers, Save The Pets' about 69k, Bazooka (Home Rush, Tricky Twist, Doge Rescue) about 135k, Playgama (Draw Bridge, Single Line) about 945k.

Not established: ad timing, second-level hook, fail speed for any top-3 game, and the first minute of the runner/snake games.

REPORTED, MediaCube/MC Play, Sep 2026 (self-interested, untested): Draw and Escape is the strongest new category; a one-finger mechanic understood in about 10 s; a tutorial over 30 s "fights the platform"; complex RPG/strategy/multiplayer does worst. My scrape agrees in direction (about 3x over-representation in the top 50) but not in dominance.

## 5. Counter-evidence

- Fits "draw" but ranks low: Draw To Smash Classic (#453, 1.1m), Draw Action (#313), Draw Puzzle: Complete One Part (#250). Fits "Save the Dog" but only 6-7m: Doge Rescue, Save the Dog-Puzzle. A draw-and-rescue label alone buys nothing.
- Breaks the pattern but ranks #1-#6: runners, snake, balls, stealth, DIY and makeover ASMR.
- Brand-new games with great launch rates (Tricky Twist, 394K/day reported) are only #138 cumulatively and decay sharply (INFERRED). Cumulative rank mostly encodes age and shelf time.
- Dog Escape is a high-velocity new game but is a 3D maze, not a draw game.

## 6. BYC first minute versus the peers

Source: js/levels.js (A1 WALL, A5 HANG, A3 REDIRECT), CLAUDE.md, docs/PLAN.md. I did not run dist/web/index.html; this is design intent from source, not my playthrough.

Stronger (INFERRED from design):
- No title wall. It starts on a frozen frame of the problem with a one-line hint naming it ("STOP IT REACHING HIM") after a 280 ms run-up; peers spend 10-25 s on loading and sometimes a modal (Tricky Twist's Daily Reward) first.
- Level 1 shows the gesture (pencil after 2.5 s idle), the same move as Doge Rescue and Home Rush, with no text beyond the hint.
- No ad before level 3 (interstitial every third level, ending never covered); skip only after 3-5 fails and never on levels 1-3. Peers put reward-ad hint/skip buttons on screen from level 1.
- The fail screen is a death replay with a stated reason, richer than the crying-dog card in Save The Pets. Retry: described as instant, and Save The Pets is also instant (MEASURED), so parity.

Weaker or unknown:
- BYC load time and first-frame art are unmeasured by me. UNKNOWN.
- Title and thumbnail: peers use literal nouns with an animal in peril ("Save The Pets", "Doge Rescue", "Dog Escape"; top-30 titles are all literal). "BRO, YOU'RE COOKED." names no subject or verb. No measurement shows a vague title is penalised. INFERRED risk.
- A1 is untimed; Save The Pets runs a visible clock per attempt. Whether the clock matters is UNPROVEN.
- No reward or streak hook inside the first minute. Tricky Twist front-loads a 7-day calendar. BYC's daily and streak exist but are not first-minute.
- BYC levels 1-5 share one backyard + boulder + Milo look (the project's own notes say opening frames are near-identical). Two peers I drew in (Home Rush, Draw Bridge) are also mono-themed, so this is not shown to hurt.

## 7. Limits

14 of 25 games opened; 3 drawn in; 1 fail cycle; no non-Premium ad data; top-4 games unobserved past loading; hub thumbnails not systematically catalogued; the Home tab redirected to the same grid so no shelf data; play counts are cumulative, not per-day; the catalogue grew during my session.

## 8. Sources

- https://www.youtube.com/playables and game pages, fetched 4 Nov 2026, MEASURED.
- https://mediacube.io/en/blog/youtube-playables-game-mechanics, fetched 4 Nov 2026 (published 8 Sep, updated 23 Sep 2026), REPORTED, vendor-interested.
- C:\Users\BDE\Desktop\Logic-Misfit\byc-clone\js\levels.js, CLAUDE.md, docs\PLAN.md, read 4 Nov 2026.
