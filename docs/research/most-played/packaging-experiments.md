# Packaging experiments: do thumbnail or title changes raise views? (Agent F, run 5 Nov 2026)

Tags used (owner's AGENTS.md rules): [DOC url] = page fetched this session. [MEASURED: tool, date] = data I pulled from that tool. [CALC] = arithmetic shown. [REPO file] = a file in this repo I read; its claims keep the grade its author gave them. INFERRED = my reasoning from tagged data, not confirmed (treat as UNVERIFIED). UNVERIFIED = not confirmed. Where I quote text, I read it this session (on a thumbnail, in a tool result, or on a fetched page); otherwise I paraphrase.

## 0. Short answer

- There is NO causal evidence in this data set. What exists is 12 hand-picked before/after pairs, every one of which was chosen because views per hour (VPH) rose at least 2x after a thumbnail change. The tool shows winners only: no losers, no flat changes, no count of how many changes were made. So it cannot say how often a thumbnail change helps, or by how much. [MEASURED: vidiq_title_thumbnail_wins #1 and #2, 2026-11-05; tool text says every row already has lift of at least 2]
- The biggest lifts (47x to 271x) all start from very low baselines (1.7 to 77 VPH, five of six at 30.6 or less). That is the signature of "video was not being shown, then was shown", which a thumbnail may have triggered or may not. [MEASURED: wins #2] [CALC: see section 6]
- The one randomised design that exists is YouTube's own Test and Compare, and its help page itself says winners are less likely when variants differ only slightly. [DOC https://support.google.com/youtube/answer/13861714] I ran no such test and the before/after tool is not one.
- The qualitative pattern that survives my reading of the 12 pictures is "repair an obvious defect and make one thing big and clear" (raw screenshot, hidden headline, four dark panels, tiny wide shot), not "add a magic ingredient". It is hypothesis-generating only, with no base rates. (section 7)
- Titles: this file has almost no evidence. The plan used no title-only call, and thumbnail-only rows do not return titles. The only title data is MrBeast's change log (section 5).
- 11 of the 12 winning thumbnails carry text. Nothing here says a text-free tile performs as well or worse. (section 7)

## 1. Question

Is there causal-ish evidence that changing a THUMBNAIL or TITLE raises views, and what kind of change? Why it matters: BYC needs a text-free game-tile thumbnail (16:9, 1:1, 9:16, no logos; [REPO docs/research/most-played/NEXT.md] item 4 of the queue), and Agent C listed the title and thumbnail question as an INFERRED risk with no measurement behind it [REPO docs/research/most-played/playables-autopsy.md section 6].

## 2. Method

1. Loaded vidiq_title_thumbnail_wins, vidiq_get_images, vidiq_video_change_history, vidiq_balance via ToolSearch. Read each tool's description for its cost first: wins = 5 credits, change_history = 5 credits, get_images = 0, balance = 0. [MEASURED: tool descriptions as loaded, 2026-11-05]
2. Call 1 (5 credits): topic search on mobile puzzle and casual gameplay, draw-to-rescue brain teasers, level walkthroughs; changeType thumbnail (cleanest case for a thumbnail effect, since the title is not meant to have changed); defaults for the rest (language en from the connected channel, last 3 months for both publish and change).
3. Call 2 (5 credits): no topic, changeType thumbnail, sort by views_ratio (biggest lift first), defaults for the rest.
4. Call 3 (5 credits): vidiq_video_change_history for _c2e1NcI3Sc (MrBeast "Beat Haaland" video). I did not need a web route to find the ID: Agent A and B already recorded it in [REPO docs/research/most-played/mrbeast-case-study.md] and [REPO docs/research/most-played/mrbeast-structure.md].
5. Looked at the pictures: the contact sheet each call returned (left cell, right cell per row) and vidiq_get_images for the 12 current thumbnails plus the two archived MrBeast snapshots. 0 credits. The right cell of every row is identical to the video's current thumbnail, so the right cell is the post-change picture and the left cell is the old one (left = old is INFERRED by elimination; the tool does not label the columns). [MEASURED: vidiq_get_images, 2026-11-05]
6. Fetched the YouTube Help page for Test and Compare, and the oEmbed JSON for the MrBeast video (current title). Free.
7. No Chrome used. No file edited except this one.

## 3. Credits spent

15 of the 15 allowed. 3 paid calls x 5 = 15 [CALC]. vidiq_balance before: 85 total (70 renewable + 15 add-on); after: 70 total (55 renewable + 15 add-on) [MEASURED: vidiq_balance, 2026-11-05, two readings]. The balance now is the project's remaining 70.

## 4. Per-change tables

Note the tool returned only 6 rows per call although it allows up to 10. Call 1 says only 1 of its 6 rows is on topic; the other 5 are marked related (same or neighbouring niche). The tool states it leaves out changes its quality check flags and does not say what that check is. [MEASURED: vidiq_title_thumbnail_wins #1 and #2, 2026-11-05] Why only 6 came back is UNVERIFIED (small tracked pool or strict filter).

Rows A1-A6 are call 1 in the tool's order (topic match). Rows B1-B6 are call 2 (lift, highest first). Subscribers and views are as of now, not at the change. Lift is after-VPH divided by before-VPH, each averaged over hours 12 to 84 on its own side of the change [MEASURED: tool text]. Recomputing after/before from the rounded VPH values agrees with the tool's lift within rounding in 12 of 12 (for example 458/1.7 = 269 against the tool's 270.9) [CALC].

### Table 1: the numbers [MEASURED: vidiq_title_thumbnail_wins #1 (A rows) and #2 (B rows), 2026-11-05]

| # | Video ID | Niche per tool | Subs | Views | VPH before > after | Lift | Published | Changed (days after publishing) | Peak VPH after (lag) | Before VPH per 1K subs [CALC] |
|---|---|---|---|---|---|---|---|---|---|---|
| A1 | T4t2Y3qAewI | on topic | 45 | 1.2K | 3.7 > 8.8 | 2.4x | 2026-08-22 | 2026-08-28 (6) | 14.1 (33 h) | 82 |
| A2 | 6_VXdItkDZI | related | 4.1K | 145.7K | 1.9 > 4.3 | 2.3x | 2026-09-22 | 2026-10-07 (15) | 6.5 (2.9 d) | 0.46 |
| A3 | klNbAZI7YR8 | related | 153K | 4M | 2.4K > 10.5K | 4.4x | 2026-08-26 | 2026-09-03 (8) | 16.8K (3.4 d) | 15.7 |
| A4 | AqidJQDvNhs | related | 224K | 13.5K | 20.8 > 46.5 | 2.2x | 2026-08-23 | 2026-08-28 (5) | 90.4 (15 h) | 0.09 |
| A5 | zeNLpBByI14 | related | 905K | 16.3K | 4.3 > 13.5 | 3.1x | 2026-09-19 | 2026-10-03 (14) | about 38.7 (2.4 d) | 0.005 |
| A6 | wXz2FRe1Y5g | related | 536K | 985.1K | 460 > 1K | 2.2x | 2026-10-02 | 2026-10-17 (15) | 1.9K (39 h) | 0.86 |
| B1 | pkFX4B32Za4 | all niches | 274K | 26.5K | 1.7 > 458 | 270.9x | 2026-10-23 | 2026-10-28 (5) | about 716 (2.9 d) | 0.006 |
| B2 | z5Ar0G1SaQ4 | all niches | 3.4K | 711.5K | 30.6 > 5.7K | 185.6x | 2026-09-29 | 2026-10-10 (11) | about 13.8K (2.4 d) | 9.0 |
| B3 | Vq25MOqtJao | all niches | 2.3M | 35.3K | 4.1 > 470 | 115.4x | 2026-09-23 | 2026-09-29 (6) | 1.3K (27 h) | 0.002 |
| B4 | cP7UFuoJmmc | all niches | 32K | 182.5K | 3 > 307 | 103.5x | 2026-09-08 | 2026-09-17 (9) | 545 (27 h) | 0.09 |
| B5 | qtS0hr5UXu8 | all niches | 176K | 8.9K | 2.2 > 124 | 57.5x | 2026-10-12 | 2026-10-18 (6) | about 276 (21 h) | 0.01 |
| B6 | LKUd9Bfdpzo | all niches | 214K | 614K | 77.2 > 3.6K | 47.0x | 2026-08-21 | 2026-10-30 (70) | 9.7K (2.1 d) | 0.36 |

Titles are not returned for thumbnail-only rows, so the table has no title column. Channel names are not returned either.

### Table 2: what changed in the picture (my reading of the images)

Source: contact sheets and current thumbnails [MEASURED: vidiq_get_images and the returned contact sheets, viewed 2026-11-05]. Old-side cells are about 250 px wide, so small details on the old side are uncertain; new-side descriptions are from 640 px previews. Descriptions were written after I knew each row was a winner, which biases what I noticed (see section 8).

| # | Old picture | New picture (= current) | Net change |
|---|---|---|---|
| A1 | Big orange cartoon fish with bulging eyes at left; a man with mouth open in shock at right; saturated blue-green background; small channel logo top-left; no headline. | Same shocked man now at left and large; one yellow, black-outlined word, ESCAPE, with a white arrow pointing at a fish bowl; a cat leaning over the bowl with a paw on the rim; bright window and wooden-table scene. | Added an explicit threat (cat) plus a one-word stake plus an arrow; brighter, simpler background. The reaction face stayed the same size. The only on-topic row. |
| A2 | Red top banner reading WHO FORGOT THEIR OWN BIRTHDAY?; three people labelled A, B, C at a cake marked 22. | Red top banner reading WHICH BABY ISN'T HERS?!; four women labelled A to D in hospital beds, each holding a newborn; one (C) wide-eyed, the others calm. | A different scenario and question in the same banner-plus-labelled-options format. Not a like-for-like edit; whether the video itself changed concept is UNVERIFIED. |
| A3 | Spanish header ELIGE TU REGALO over three gift boxes (red, purple, gold), each with a small figure at its base (a Spider-Man toy, a purple character, a poop emoji). | Same header and three-panel layout; boxes now red, gold and silver-diamond, with a fiery red monster, a sad poop emoji and a cute pink bun. | Swapped box materials and contents (licensed character gone); structure, header and panel colours unchanged. |
| A4 | Four dark gameplay panels in a 2x2 grid from a block-world game; no headline. | One full-frame gameplay shot down a corridor: about eight characters, a large fanged monster at centre, a red character at right, touch controls and a burned-in subtitle visible, a headline naming the horror franchise plus FULL MAP at upper right. | 4-up grid became one hero frame; headline added; a large toothy face at the centre. Still a HUD-visible screenshot. |
| A5 | Frame filled by an unlocked-all-achievements (100%) bar and a grid of achievement icons; the pipe-smoking captain's face centred beneath. | Huge 100% (white digits, green percent sign, thick black outline) on the left half; the captain's face enlarged and pushed to the right edge; plain blue sea; thin blue border. | About ten words of UI became one three-glyph token; face larger; background simplified. |
| A6 | A boy in a red shirt at left; a man in a yellow shirt facing him in profile; pool compound behind; muted sky. | Boy smaller at bottom-left, smiling; the man in green seen from behind, hand on head, looking over the compound from above; about ten red rings round cars, a helicopter and a spider-bodied train monster; bluer sky. | Face-to-face confrontation became a viewer's-eye scene with red rings marking things to find. Face got smaller, not bigger. No text before or after. |
| B1 | Raw screen-capture frame (app window, chat panel, a poster image); no person; no headline. | A woman pointing at a laptop showing the product screen; brand name in huge white italics with a blue glow; a three-benefit strip underneath; dark teal background blur. | Raw screenshot became a designed thumbnail: face, pointing gesture, two-word brand, benefits. Defect repair. |
| B2 | Wide sunlit street scene with a couple at small scale; decorative Hindi headline across the top; pastel palette. | Close, dark, warm portrait: the couple's faces fill the frame, the woman holds a wax-sealed envelope; heavy yellow Hindi headline at bottom left with a small label giving 1988 and retro love song; lamp glow behind. | Wide became close-up; bright pastel became dark and warm; headline moved, enlarged and given a genre and era label. |
| B3 | Two animated characters in a pink toy car, small in a wide street shot; small channel logo. | Close-up of the two characters holding ice-cream cones, both wide-eyed and worried, with a lion showing its teeth behind them; large logo bottom-left; gold star badge reading 1H at top right; red frame; blue sky. | Wide became tight close-up; fear expression; a threat (lion) added; duration badge added. |
| B4 | Dark room, two men seated, sponsor logos at top; the headline sits low and is partly lost under a dark shape; a secondary subtitle in a small box. | Brighter warm room; large white-and-green headline THE 100 CRORE MINDSET at lower left; EPISODE 01; a blue guest-name tag; two men at either side. | Legibility repair: contrast and size of the headline; brighter. |
| B5 | Man at centre with open hands; headline row on top; two green bullet panels either side; a row of icons at the bottom; roughly 25 words in total. | Man at centre holding two cards, one headed BA IGNOU (blue) and one headed PRIVATE UNIVERSITY (red), three bullets each; logos above; a black strip reading Which is Better? beneath. | Still text-heavy, but reorganised into a colour-coded side-by-side with one plain question. |
| B6 | Dark blue underwater cliff drop; a red skull marker on a dotted vertical line; the label 400FT DEEP in the centre. | Textured icy cliff at right, a diver hanging in deep blue at upper left; headline You've Been WARNED in white with a red last word across the top. | A depth-gauge label became a warning phrase; human scale added; no brighter (darker, more cinematic). Changed 70 days after publishing. |

## 5. MrBeast: the change log of the newest long video

Video _c2e1NcI3Sc. Every row below is [MEASURED: vidiq_video_change_history, 2026-11-05], times in UTC; the timestamps are when vidIQ recorded each change, and that they equal the creator's edit time is UNVERIFIED.

| Recorded at | Event |
|---|---|
| 2026-10-31 16:00:09 | Title: "Beat LeBron, Win $100,000" |
| 2026-10-31 18:49:57 | Thumbnail snapshot 1: MrBeast snarling with teeth, face to face with LeBron James in a Lakers jersey, ball in the foreground, basketball court and hoop behind. No text. |
| 2026-11-01 03:32:44 | Title: "Beat LeBron In Basketball, Win $100,000" |
| 2026-11-03 18:48:46 | Title: "Beat Haaland, Win $100,000" |
| 2026-11-03 18:59:04 | Thumbnail snapshot 2: MrBeast (red shirt) lunging toward the camera, hand outstretched, face to face with Haaland (sky-blue kit), football in the foreground, stadium behind. No text. Identical to the current thumbnail. |
| 2026-11-04 21:29:02 | Title: "Beat Professional Athlete, Win $100,000" |

The abTests list for this video is empty. [MEASURED: vidiq_video_change_history, 2026-11-05; the tool describes that field as observed thumbnail A/B tests] The oEmbed JSON today returns the title "Beat Professional Athlete, Win $100,000", matching the last log entry. [DOC https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=_c2e1NcI3Sc&format=json, fetched 2026-11-05]

What this does and does not show:
- Four distinct title strings and two thumbnails in 101.5 hours (2026-10-31 16:00:09 to 2026-11-04 21:29:02) [CALC: 4 days 5 h 29 min = 101.5 h]. The channel with the most resources on the platform kept editing packaging after launch. The reason is UNKNOWN.
- The 3 Nov repackage moved the title and thumbnail together from LeBron to Haaland; the thumbnail record came 618 s after the title record [CALC: 18:59:04 minus 18:48:46 = 10 min 18 s]. This is a coordinated manual repackage or a test result being applied. Which one is UNVERIFIED.
- The video's own order is Haaland first (first match from 0:31) and LeBron last (final boss from 20:28) [REPO mrbeast-structure.md, Agent B]. So the repackage moved from the last-segment star to the first-segment star, then generalised the title. Why is INFERRED at best.
- Reconciling Agent A's earlier observation: Agent A saw the "LeBron In Basketball" title on one load and the Haaland title on a later load on 4 Nov and inferred a live title test [REPO mrbeast-case-study.md line 60]. The log gives a sequential explanation for four strings, with "LeBron In Basketball" recorded as replaced on 3 Nov, so a 4 Nov page showing it is NOT explained by the log alone. Candidates: a stale cached page, vidIQ recording lag, or a title test serving variants. I could not resolve this (no browser, by instruction). The YouTube help page says up to three titles and/or thumbnails can be tested and that editing the title or thumbnail during a test stops it [DOC https://support.google.com/youtube/answer/13861714]; four strings in four days is not one three-variant test, but it could be successive edits or tests. The empty abTests does not rule out a title test, since it lists thumbnail tests. So: the live-title-test inference is neither confirmed nor refuted. Keep it labelled UNVERIFIED.
- I did not pull this video's VPH before and after, so there is no lift figure for it. It was not in either result list, which says nothing either way (the lists were capped at 6 rows each). [REPO mrbeast-structure.md] gives about 232k VPH at day 4 (Agent B, vidIQ).
- Both MrBeast thumbnails carry no text and a face-to-face, snarling-teeth, ball-in-foreground composition: the top of YouTube runs text-free thumbnails. This says nothing about lift. Agent A counted 19 of 30 recent long videos with no overlay text [REPO mrbeast-case-study.md].

## 6. Lift distribution

- Call 1 (ordered by topic match, not lift): 2.2, 2.2, 2.3, 2.4, 3.1, 4.4. Median 2.35, mean 2.77 [CALC]. Five of six sit between 2.2x and 3.1x, i.e. within 1.55x of the 2.0x floor [CALC: 3.1 / 2.0]. A pile-up just above a cut-off is what a filter on the outcome produces; with n = 6 it is a hint, not a test.
- Call 2 (ordered by lift): 47.0 to 270.9. Median 109.45, geometric mean 108.4 [CALC]. These are the top of whatever pool the tool searched after its quality filter, so they are extremes by construction.
- The two calls were ordered differently, so the empty range between 4.4x and 47x says nothing about a two-humped distribution; it is an artefact of my two queries.
- Lift is mostly a statement about the denominator. B1's after-VPH of 458 divided by B6's before-VPH of 77.2 would be 5.9x, not 270x [CALC: 458 / 77.2 = 5.93]. Five of the six call-2 rows had before-VPH of 30.6 or less, four of them 4.1 or less [MEASURED: wins #2].
- Nine of the 12 rows had before-VPH under 1 per 1,000 subscribers (values in Table 1 column 11) [CALC; subscriber counts are current, not at change time, and the channel's usual VPH is unknown, so this only hints that the old state was unusually low for the channel; INFERRED].
- Absolute stakes differ wildly. A1 (the one on-topic row) gained 5.1 VPH [CALC: 8.8 - 3.7], about 367 extra views over the 72-hour window [CALC: 5.1 x 72]. B2 gained about 5,669 VPH [CALC: 5,700 - 30.6 rounded], about 408K extra views over 72 hours at the window average [CALC: 5,669 x 72 = 408,168], 57% of its 711.5K total views [CALC: 408K / 711.5K].
- Timing: 11 of 12 changes were made 5 to 15 days after publishing; one at 70 days. Median 8.5 days [CALC from Table 1]. Every reported post-change peak falls between 15 h and 81.6 h after the change [CALC: 3.4 d x 24 = 81.6 h, 2.9 d x 24 = 69.6 h]. The longest lag, 81.6 h, sits just under the 84 h edge of the measuring window, so the peak search is probably capped to that window and the peak timing may carry no independent information (INFERRED).

## 7. Patterns in the 12 winning thumbnails (descriptive only)

Counts are my reading of Table 2, with a margin of one or two either way. They describe the winners; with no base rate for unchanged or failed thumbnails they do not show that any feature is associated with winning (a face or text is on most YouTube thumbnails anyway; UNVERIFIED, I measured no base rate).

| Feature in the NEW picture | Count of 12 | Rows | Caveat |
|---|---|---|---|
| Some face (human, character or creature) | 11 | all but B6 | |
| A large face (about a third of the frame height or more) | 8 to 9 | A1, A4, A5, A6 (borderline), B1, B2, B3, B4, B5 | |
| Subject tighter or larger than before | 7 | A4, A5, B1, B2, B3, B4, B5 | A1 same; A6 smaller; A2, A3, B6 not comparable |
| Visible clutter reduced (grid, UI, dark overlay, wide scene) | 5 | A4, A5, B1, B2, B4 | |
| Any text on the picture | 11 | all but A6 | the only text-free winner is also in the lowest lift bracket (2.2x); nothing follows from that |
| Text gained where there was none | 4 | A1, A4, B1, B3 (badge and larger logo) | |
| Text made bigger, more legible or replaced | 4 | A5, B2, B4, B6 | |
| A threat or danger cue added or made much larger | 5 | A1 (cat), A4 (fanged monster), A6 (monster), B3 (lion), B6 (WARNED headline, cliff) | |
| A question, choice or "find this" device | 6 | A1 (arrow), A2 (odd one out), A3 (choose one), A6 (red rings), B5 (versus), B6 (warning) | A2, A3 and B5 put the question in text |
| High-arousal expression (shock, fear, snarl, fangs) | 5 | A1, A2 (one of four), A4, A5, B3 | calm or warm faces in B1, B2, B4, B5, A6 |
| Brighter or cleaner after | 6 | A1, A4, A5, A6, B3, B4 | |
| Darker or moodier after | 2 | B2, B6 | two of the six biggest lifts went darker |

Repair or upgrade (my judgement): B1 (raw screenshot) and B4 (headline lost in shadow) fix a clear defect; A4, A5 and B5 declutter; B2, B3, B6 and A6 are composition upgrades; A2 and A3 swap content inside a fixed template (A3's change is not demonstrably an improvement at all).

Observations that cut against a tidy story:
- Brightness is not a rule (two darker winners), a close crop is not a rule (A6 got smaller), and a high-arousal face is not a rule (calm faces won in five rows).
- A4 won with an in-game screenshot with its touch controls showing, so a visible HUD is not disqualifying by itself.
- The row nearest BYC's niche (A1) won by adding a peril object plus a one-word stake plus an arrow. That is one channel of 45 subscribers with a 5-VPH gain.

## 8. Selection bias and other confounds

1. Selection on the outcome. The tool returns only changes with lift of at least 2x, so it shows winners and nothing about losses or no-ops. [MEASURED: tool text and results; lowest lift 2.2x] Even with zero true effect some changes would clear 2x from noise alone. Illustration, with the noise level ASSUMED and not measured: if the log of the after/before ratio has standard deviation s, the chance of at least 2x with no real effect is 1 minus the normal CDF of ln2/s. For s = 0.5, 0.8, 1.2 that is 8.3%, 19.3%, 28.2% [CALC: ln 2 = 0.693; z = 1.39, 0.87, 0.58]. So of 1,000 do-nothing changes, roughly 80 to 280 would appear in a winners list. I do not know the real s; the point is that the list cannot be read as an effect size.
2. The denominator is hidden. How many thumbnail changes vidIQ tracked is not exposed. A tracked pool may be a subset of YouTube (UNVERIFIED), and the quality filter's rule is not stated. Each call returned 6 of a possible 10.
3. Regression to the mean. Creators change thumbnails on videos that are doing badly. Seven rows had before-VPH of 4.3 or less (A1, A2, A5, B1, B3, B4, B5), nine of 12 were under 1 VPH per 1,000 subscribers, and 11 of 12 changes came 5 to 15 days after publishing. Low VPH tends to revert upward whatever happens. [CALC from Table 1] A fresh signal of any kind (a share, a re-test by the recommender) can restore a video that the first push missed. INFERRED.
4. Algorithm-push timing. The after window starts 12 hours after the change and runs to hour 84, which is where a recommender re-test, if it happens, would land. The data cannot separate "new thumbnail got more clicks" from "the system gave the video a second look". Any metadata edit may trigger that second look; INFERRED, not shown.
5. The before window sits in the decayed tail. For a change at day 5 to 15, hours 12 to 84 before it are days 2 to 14 of life, when most videos' VPH has fallen from launch levels. INFERRED (I measured no decay curve).
6. Concurrent changes. The tool does not say how it decides that only the thumbnail changed (UNVERIFIED). MrBeast's log shows a title edit 10 minutes before the thumbnail edit [MEASURED: vidiq_video_change_history, 2026-11-05], so a "thumbnail" label could hide a near-simultaneous title edit. Shares, trends, a series upload, a pinned comment or a new end screen would not appear in this data at all.
7. The metric is views per hour, not click-through rate, watch time or satisfaction. YouTube's own tool picks winners on watch-time share rather than clicks, saying click-optimised picks can differ [DOC https://support.google.com/youtube/answer/13861714]. A thumbnail that over-promises would score here as a win.
8. Description bias. I described the pictures knowing each had won, with the old side at 250 px. Features I listed are the ones I noticed. The counts have no controls, no second rater and n = 12.
9. Sample composition. One row is on topic (a 45-subscriber channel). The rest include a kids' cartoon channel with 2.3M subscribers, three Indian-audience education, podcast and music channels, and an AI-tool tutorial. Two rows (A3 Spanish, B2 Hindi) have non-English headline text although the title-language filter was en. None is a mobile puzzle game with a tile-sized thumbnail.
10. One date, last three months only. Everything was pulled on 2026-11-05 and covers changes since about 2026-08.
11. Dates are vidIQ's recording times, not creator edit times (UNVERIFIED).
12. What a causal design would look like: randomised, concurrent exposure to each variant, a control group, a stated significance rule. YouTube's Test and Compare is built that way (up to three variants; a small control group excluded from results; results labelled Winner, Performed Same or Inconclusive; desktop Studio only; Shorts, premieres and kids' videos excluded; tests can take days to two weeks). The page does not say how traffic is split. [DOC https://support.google.com/youtube/answer/13861714] I did not find or pull any aggregated outcomes of those tests, so I cannot report how often variants "win".

## 9. What the data can and cannot support

Can support (weakly):
- Repackaging after launch is normal and sometimes dramatic on tracked videos: 12 rows at 2.2x to 271x, and one top channel making four title and two thumbnail edits in about four days.
- The raw material for hypotheses: the repairs and additions in Table 2.
- A reminder that the cheapest lever BYC controls (a tile image) can be changed after launch, so the first tile need not be final.

Cannot support:
- That any change caused its lift.
- How often a change helps, how much it helps on average, or the odds that a given pattern helps.
- A ranking of change types (lifts are not comparable across rows with 1.7 and 2,400 VPH baselines).
- Whether text-free beats text, since 11 of 12 winners carry text and none of the evidence has a text-free control.
- Anything about titles, beyond MrBeast's log.
- Anything about a Playables tile: different surface, size, audience, no title overlay on the image (see section 10), no VPH.
- That the MrBeast edits were a live test, or that they lifted views.

## 10. What might transfer to a text-free game tile (PROPOSALS ONLY, none tested)

Context: Agent C reports the Playables hub tile shows a title and a play count under each tile and that peer rescue games use literal nouns with an animal in peril [REPO docs/research/most-played/playables-autopsy.md; its grades, not mine; I did not open the hub]. If the title sits under the image, the words that A1, A4, B1 and B6 put on the picture would be carried by the title instead (INFERRED). The tile's rendered size is UNKNOWN to me; measure it before designing.

| # | Proposal | Backing in this file | Strength |
|---|---|---|---|
| P1 | One dominant subject at a size that survives the smallest tile: Milo's face, or Milo plus the dog, large; no HUD, no grid of levels. | 7 of 12 got tighter or larger; 5 of 12 lost clutter; one counterexample (A6 got smaller). | Weak, consistent with general design practice |
| P2 | Put the threat and the thing it threatens in one frame, with the threat visibly aimed at the victim (the cat's paw on the bowl, the lion behind the kids). BYC candidates: bees, a rock or spikes against Milo or the dog. | 5 of 12 added a threat; A1, the on-topic row, is the cleanest case; peers do peril per Agent C. | Weak |
| P3 | Let a drawn stroke stand in for the arrow and the one-word label: BYC's verb is drawing a line, so a bright stroke between victim and threat could say what the game asks. | A1 used an arrow plus a word to say what the picture is about. Nothing here tests a stroke. | UNPROVEN idea of mine |
| P4 | Keep contrast high between subject and background; check the picture at the smallest size the hub shows. | B4 (headline lost in shadow) and A5 (clean sea behind the subject) are the rows that fix contrast or simplify. | Weak |
| P5 | Do not assume bright beats dark; test the palette by eye at tile size and on BYC's own screens rather than by rule. | B2 and B6 went darker and won; six went brighter. | Weak, mixed |
| P6 | Make Milo's expression readable at tile size. Whether it should be high-arousal is open. | 5 of 12 high-arousal, 5 calm; both MrBeast thumbnails snarl. | Mixed |
| P7 | One visible curiosity device, such as a single ring round the hazard or the goal. | A6 only (2.2x, lowest bracket); A2, A3 and B5 do it with text. | Very weak |
| P8 | Learning plan: one variable per change, a dated log of every tile change, and a comparison with the platform's own numbers over at least the 12 to 84 hour window the tool uses, noting that a single before/after cannot separate the tile from algorithm timing. Whether Playgama or Playables expose tile impressions or allow a split test is UNVERIFIED. | Section 8. | Method, not evidence |

Things the evidence argues against: believing that a change from a bad thumbnail to a good one will reproduce a 100x lift (those lifts started at 2 to 5 VPH); treating any single pattern above as a rule; treating the MrBeast pair as a test result.

## 11. Limits and what I did not do

- Spent the full 15 credits. No title-only call, no `both` call, no second page of results, no VPH for MrBeast's video (vidiq_video_stats was not in scope).
- 12 rows in total, 6 per call, both capped by the tool; one row on topic.
- No access to the old thumbnails at full resolution (the old side is a contact-sheet cell; vidiq_video_change_history for each row would cost 5 credits each and was not affordable).
- I did not open the Playables hub, so P1 to P8 are not checked against the real tile size or neighbours.
- I did not look for public aggregated A/B outcomes (YouTube, TubeBuddy, vidIQ) beyond the YouTube help page.
- Could not resolve whether the 4 Nov LeBron/Haaland flip was a live title test (section 5).
- Titles of the 12 videos are not in the tool's thumbnail rows, so I cannot say whether any title changed with the thumbnail; the tool's quality filter and its definition of a thumbnail-only change are not stated.
