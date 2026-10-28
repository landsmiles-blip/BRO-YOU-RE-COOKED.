# CASE STUDY — Save the Doge and Love Balls (15 Oct 2026)

Asked for on 15 Oct: how many levels do the hits in our genre have, what are
they doing, why did they work, and what do we copy — improving docs/PLAN.md,
not replacing it.

Sources are search summaries (the build machine cannot open web pages
directly); every claim below names where it came from. Where a number could
not be found, it says so.

---

## The two games

### Save the Doge — "draw to protect"

| | |
|---|---|
| **Who** | Wonder Group (developer listed as MIRACLE GAME INC.); released **12 July 2022**, broke out in September 2022 [hc.games, Pereira] |
| **Scale** | ~34M downloads in its first months; **30.17M in Q4 2022 alone**, #3 hyper-casual game by downloads that quarter [AppMagic]; #1 download in Southeast Asia in Sept 2022 (6.5M) [Sensor Tower]; **over 80M** by 2023 with **7M+ a month** [Azur Games' publishing lead, PocketGamer.biz]; Switch ports and a sequel in 2025 [Nintendo eShop] |
| **Levels** | **"Hundreds"**; no total is published anywhere I could find. Updates add levels |
| **The game** | Draw ONE line to shield a dog from a swarm of bees for 5–10 seconds. The bees come **from all directions** |
| **How it was made** | Deliberately ~80% Happy Glass (the draw-a-line formula players already knew) plus one twist — bees from every side instead of water from above — and a meme character, the Doge [Pereira's "80/20" analysis] |

**Level design** (Azur Games' deconstruction):
- **Level 1 cannot be lost**, and always gives three stars.
- **Stars for short lines** — the challenge for players who want it.
- **Difficulty is not linear**: relief levels between hard ones.
- In later levels, **"90% of the most obvious solutions are not the most
  effective"**.
- **Several solutions per level**; new threats drip in (the clones list bombs,
  lava, spikes, water, saws, arrows).

**Money**: interstitial and rewarded video at roughly **one per minute**;
content unlocked with stars; tips are not stockpiled; **replays are free**;
user acquisition aimed at emerging markets, with playable ads that ran to
millions of impressions [Pereira; Azur].

### Love Balls — "bring the couple together" (the game you were thinking of)

| | |
|---|---|
| **Who** | SuperTapx (China), published by Lion Studios (AppLovin). iOS launch on **Valentine's Day 2018**, almost no marketing until v1.1 in April [SCMP, Medal.tv] |
| **Scale** | #1 free iOS app in North America for ~2 weeks; **#1 in 60+ countries**; ~**180M downloads** by a third-party tracker [SCMP, Medal.tv, AppBrain] |
| **Levels** | No total published. **"New levels every week"**, shipped in batches (e.g. 12 in one update); early levels take about a minute each [App Store, release notes, reviews] |
| **The game** | Draw lines and shapes so two balls — a couple — roll together and touch. A simplified successor to Brain Dots and Brain It On! [Medal.tv] |
| **Around it** | Daily challenges (the difficulty spikes); seasonal events (Halloween pumpkins buy festival skins); a **pen collection**; stars for using little ink [release notes, guides] |
| **Money** | Ads — and **ad load is the #1 complaint in its reviews**; a hint for a rewarded video; in-app purchases [App Store, reviews] |

(Other "reunite" titles exist — Love Connection, Draw To Home — but Love Balls
is the one that topped the charts.)

---

## What the hits have in common

1. **One fantasy, readable in one second, with someone to care about.**
   Save the dog. Bring the couple together. The threat and the victim are on
   screen before the player has read a word.
2. **Familiar mechanic, one twist.** Both are honest descendants of an earlier
   hit (Happy Glass; Brain Dots). Nobody had to learn how to play.
3. **Easy for a long time.** Level 1 cannot be lost; reviewers describe the
   first hundred levels as about a minute each and the first real wall around
   level 85–100. Difficulty comes in spikes with relief after them.
4. **Short levels, instant retry, stars for less ink.**
5. **Volume from variation.** Hundreds of levels, almost all the SAME decision
   ("shield the dog") in a new arrangement — bees from a new side, a new
   obstacle, two dogs — with new threats added slowly.
6. **A collection**: pens, skins, backgrounds, bought with stars or coins.
7. **Live content**: new levels every week, seasonal events.
8. **Failure you want to watch**: bees swarming a dog, a ball falling off the
   edge. That is what their ads and TikTok clips are made of.
9. **Heavy ads** — and it is what players hate most about them.

## Where we already match them

One line, stars for less ink, instant retry, several solutions per level, a
sawtooth with breathers, a daily challenge, a skip paid with a rewarded ad, a
meme-native title, and a death cam that replays the failure in slow motion —
the most watchable thing in the game.

## Where we fall short, and what we change

| | What they do | What we do now | What we change |
|---|---|---|---|
| **A. The ceiling** | Never a wall; spikes, then relief | Bosses measured up to 90 tries; SINK was "unplayable" in your playtest | **No level above ~60 measured tries.** SINK is fixed (90 → 26). THORNS (89) is the next hardest and goes first on Saturday's watch list; refit the curve's top from real tries |
| **B. The first level** | Cannot be lost | BLOCK, 12 tries — easy, but losable | Watch first-try success on level 1 on Saturday; if anyone fails it twice, make it unlosable |
| **C. A collection** | Pens, skins, backgrounds for stars | Stars are only a score | **Stars buy cosmetics**: pen colours, Milo outfits, a collar for the dog. Free, earned, no pay-to-win |
| **D. Volume** | Hundreds, mostly variations of one decision | Strict: no two levels may ask the same decision; 36 levels | **Allow VARIANTS**: the same decision in a new arrangement, if its opening frame looks different and its winning stroke is a different shape (the census shows different families). Never a near-identical layout — the "levels 2, 4 and 11 look the same" problem still stands |
| **E. The next element** *(bees built 18 Oct: chapter 3, six levels)* | Bees (protect from every side); a couple to reunite | The dog | **BEES**: a swarm that homes in from all sides, stopped by lines, lethal to whoever it reaches — and our hollow closed strokes already make domes. **And REUNION**: a win condition where Milo must reach the DOG, not the exit — Love Balls' fantasy with a character we already have |
| **F. Live content** | Weekly levels, Halloween events | Daily challenge; a chapter a month planned | **Weekly batches after launch**; a seasonal skin (31 Oct is in two weeks) |
| **G. Ads** | ~1 a minute, and the reviews hate it | Interstitial every 3rd level; rewarded only for the skip | **Stay lighter than them.** Add rewarded video only where it is the player's choice (a cosmetic, a skip) |

## How many levels

**They**: hundreds, no published totals, more every week.
**Us**: 36 now; 60 at launch (docs/PLAN.md) is still the right first target
for a YouTube Playable, where a sitting is ~10 minutes. The case study says
the way to "hundreds" is variants plus a weekly drip after launch — not
more, stricter, one-of-a-kind decisions, which is the vein that ran dry on 14
Oct (one keeper in seven).

## Sources

- AppMagic via [GameDev Reports](https://gamedevreports.substack.com/p/appmagic-hypercasual-market-in-q4) and [WN Hub](https://wnhub.io/news/finance/item-1476) — Q4 2022 downloads
- [Sensor Tower via GameDev Reports](https://gamedevreports.substack.com/p/sensor-tower-top-mobile-games-in-89e) — Southeast Asia, Sept 2022
- [PocketGamer.biz — Deconstructing Save the Doge (Azur Games)](https://www.pocketgamer.biz/deconstructing-save-the-doge-and-draw-to-mesh-puzzle-games/) — level design, 80M downloads, monetisation
- [Carlos Pereira — the 80/20 rule: Save the Doge](https://www.linkedin.com/pulse/applying-rule-8020-mobile-games-save-doge-case-carlos-pereira) and [HC.Games case study](https://hc.games/en/case-study-save-the-doge/) — Happy Glass benchmark, release date, ads per minute
- [Azur Games — genres to watch, end of 2022](https://azurgames.com/blog/what-genres-should-hyper-casual-game-developers-pay-attention-to-at-the-end-of-2022/)
- [Nintendo eShop — Save The Doge 2](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-download-software/Save-The-Doge-2-2890453.html)
- [Save the Doge on Google Play](https://play.google.com/store/apps/details?id=com.miracle.savethedoge.an&hl=en_US) and clones' listings (hazard variety)
- [SCMP — The world is in love with Love Balls](https://scmp.com/abacus/games/article/3028557/world-love-love-balls-where-did-it-come) — chart positions, origin
- [Medal.tv — How Love Balls became a viral smash](https://megacool.medal.tv/blog/how-love-balls-became-a-viral-smash-and-6-ways-to-improve-it/) — release history, lineage, ads
- [Love Balls on the App Store](https://apps.apple.com/us/app/love-balls/id1348173937) and [AppBrain](https://www.appbrain.com/app/love-balls/com.supertapx.lovedots) — weekly levels, download count
- [APKMirror release notes](https://www.apkmirror.com/?p=530730) — events, skins, level batches
