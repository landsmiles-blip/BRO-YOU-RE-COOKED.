# Why the most-played Playables are the most played, and what BYC can use

Written 5 Nov 2026 by the main session, from seven agent reports plus my own checks. Every claim carries an `AGENTS.md` tag: [DOC url], [CODE path:line], [CALC] (arithmetic shown), [MEASURED: where, when], [FOUNDER], UNVERIFIED. Where an agent's earlier claim was refuted or weakened by the red team (`red-team.md`) I use the corrected version. Read `CHALLENGE-ME.md` first if you are auditing.

## 0. The honest short version

1. **Nobody can say from public data why a given Playable gets plays.** Google publishes no ranking or featuring criteria; the only documented ranking input is personalisation, and review weighs the creator's history [DOC https://developers.google.com/youtube/gaming/playables/certification/requirements, via distribution.md]. Impressions, click-through and retention are private. Everything below about "what causes plays" is correlation or inference unless tagged otherwise.
2. **What the data does show is route to market and time on platform.** Six of the top seven games come from publishers YouTube itself named; 16 of the 23 dated top games come from five publishers that list about 3.4% of titles [CALC: 16/23; 73 of about 2,133 games, red-team.md claim 16]. Reaching 100M plays at 138K a day needs about 725 days [CALC]. Age does not order the top (Spearman 0.08 across 23 games) but is needed to reach the very top.
3. **A draw/rescue look or title does not buy plays.** 54 matching titles run from rank 23 to rank 1,067, median 1.1M against 665.5K for the hub, with 24 of 54 below the hub median [CALC from hub snapshot, red-team.md §2a]. Near-identical clones sit 9x to 700x below the originals (Draw Path to Home 85K vs Home Rush 19M; Draw Bridge: Puzzle Challenge 297K vs Draw Bridge: Brain Game 26M) [MEASURED: hub CSV 5 Nov]. Cause unknown: design, age, publisher or featuring.
4. **For an indie, the realistic route is Playgama**, whose wiki says it submits only its best performers from its own platform and chooses with YouTube [DOC https://wiki.playgama.com/playgama/game-requirements/platform-specific-requirements.md]. Its own five launch-week showcase games reached 0.9M to 4.6M after about 68 days [CALC from distribution.md; red-team.md claim 19]. That, not 100M, is the evidence-based expectation for a first release by a small studio. UNVERIFIED for BYC specifically: nobody has played it.
5. **MrBeast is a packaging-and-structure case, and its effect on clicks and retention is unmeasurable from outside.** His public record is consistent (a stake stated inside about 16 s, a first consequence by about 0:49 in the Circle video, teasers paid off later, a face on 29 of 30 newest thumbnails, titles averaging 7 words) [MEASURED: transcripts and thumbnails, red-team.md claims 1-9]. Whether any device causes retention is UNPROVEN, and I found no credible data either way on copycats.

## 1. What each part of the study established

### 1.1 The catalogue (hub snapshot 1: 1,124 games, 5 Nov 07:01 UTC)
- Median 665,500 plays; 142 games at 10M or more, 475 at 1M or more, 264 under 100K [CALC, red-team.md §2a]. The top 10 hold 18.2% of plays and the top 10% of games hold 67.3% [CALC]; Dubit measured 17.9% and 76.6% on 23 Sep [DOC https://dubit.io/library/how-many-plays-does-a-youtube-playables-game-get].
- The hub shows plays rounded to 100K (1M-10M) and 1M (over 10M), 475 games in all, so plays per day cannot be read from a short gap [CALC]. A second snapshot needs about a week.
- Brain & Puzzle holds 37.3% of games but 23.6% of plays, median about 170K [DOC Dubit]. A crowded genre with a low median.

### 1.2 Tiles
- Every hub tile is 194x272 CSS px (5:7), image aspect-fill; a square upload is cropped to its middle 71% [MEASURED: 1,124 rows; CALC 194/272].
- Of 55 hand-read tiles, 37 carry lettering, mostly the title wordmark; the logo rule says developers must not include branding or logos in thumbnails, description or title [DOC https://developers.google.com/youtube/gaming/playables/certification/requirements_design, via WebFetch summary]. Whether a title wordmark counts is UNVERIFIED.
- The "readable worried face plus a visible threat" look is the current draw-genre convention (about 60% of 15 recent draw peers) but did NOT predict plays in the counter-cases above. It is a style, not a cause.

### 1.3 First minute
- BYC has no splash: the first frame is level 1, and drawing is accepted after 0.29 s (level 1) and 0.65 s (level 2) at normal frame rate [MEASURED: red-team.md §2i; CODE js/levels.js:76,274]. Peers show 1-3 splash/loader screens inside the YouTube shell; the numbers are not comparable (localhost vs shell) and are not used here.
- **Exposure:** the game loop caps catch-up at 8 physics steps per frame [CODE js/constants.js:20; js/main.js:208], so at about 5 fps the same wait stretches to 1-3 seconds with input ignored [MEASURED: red-team.md §2i, on a loaded PC]. Real-phone behaviour is UNVERIFIED.
- Top games start with one tap and no steering (Build a Queen auto-ran and won 47-52 s after one tap; a Snake Clash round ended within 11.8 s) and pitch a rewarded video at the first result [MEASURED: first-minute-measured.md, one Premium account, ad timing for ordinary players UNVERIFIED].

### 1.4 Layout (a rejection risk, not a theory)
- BYC draws a fixed 9:16 paper column. At 1:1 it fills 56.3% of the width and at 16:9 31.6%, with flat grey bars that accept strokes [MEASURED: first-minute-measured.md §5, confirmed by red-team claim 30; screenshots viewed].
- Playgama rule 1.6.8: a 1:1 window must fill with no empty bars; 1.6.1: fill the available area at any ratio [DOC https://wiki.playgama.com/playgama/game-requirements/technical-requirements.md]. YouTube's page allows centred padding [DOC requirements_design, summary]. So this binds the Playgama build, which is the route to YouTube.

### 1.5 Playgama pipeline
- Cover slots are exact: square 800x800, portrait 1080x1920, landscape 1920x1080, PNG or JPEG up to 10 MB [DOC: start_cover_upload tool description, 5 Nov]. YouTube's own thumbnail sizes are not public (Developer Portal, invitation only) [DOC distribution.md].
- The sandbox gate "100 plays at 5 minutes" in the owner's repo is not in any public Playgama page [CALC/absence: red-team.md claim 22]; the console card shows the real targets. UNVERIFIED. The platform's published target is average playtime ideally over 8 minutes for YouTube.
- Poof Poof's sandbox is live; 3 free traffic runs remain, each 3 days and about 50 expected gameplays [MEASURED: get_sandbox_traffic, 5 Nov]. The form step needs a certification QA tool [MEASURED: get_launch_steps].

## 2. What this means for BYC

See `translation-to-byc.md` for the table. In one paragraph: the evidence supports fixing what can get BYC rejected or lose a first-time player (layout fill, recorded sound, low-frame-rate start), and making a clear 5:7-safe tile with no text. It does not support any claim that a particular tile style, title or MrBeast-style device will raise plays. The decisive evidence will be real Sandbox plays and Playgama's answers about who chooses for YouTube.

## 3. What was wrong yesterday and is corrected here
- Median 988K and 92 games under 100K: wrong (partial scrape); full hub median 665.5K, 264 under 100K.
- "Draw titles are 3x over-represented at the top": true only at the top-50 cut with a keyword list that includes thief, dop and delete; 1.5x beyond top 100.
- "Cumulative rank mostly encodes age": not supported; age is necessary, it does not order the top.
- "Publisher size does not separate": true only of the few draw games opened; false of the top table.
- BYC "blocked 5 s on level 2": a low-frame-rate effect, 0.65 s at normal frame rate.
- "The Haaland/LeBron flip was a live title test": unknown; four title edits in 101.5 hours.
- vidIQ credits: 60 left (started 145).
- My own: I called the 5.0 s figure background-tab throttling; the red team showed it also happens in a foreground tab at low fps.

## 4. Limits
One Premium account and one machine under load; hub tiles read by one rater (the red team re-read 12, changed 3-4); Playgama and Google pages read through WebFetch summaries; plays are rounded; publisher and added-date fields are a third-party tracker's, for 23 games; no retention, click-through or featuring data exist publicly; MrBeast's device effects are not measurable from outside.
