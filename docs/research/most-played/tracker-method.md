# TubeGames tracker: collection method and limits

Collected 2026-11-05, about 07:30 to 07:42 UTC (CSV scrape_utc is the file-write time, 07:42Z; per-row read times were not logged). Site: https://playables.games/ (TubeGames, third party, says it is independent of YouTube and Google). Output: docs/research/data/tracker-20261105-0742Z.csv.

## What was allowed
- robots.txt: allows all user agents on all paths and lists a sitemap. [MEASURED: playables.games/robots.txt, 2026-11-05 ~07:20Z, via WebFetch summary]
- About page: no terms of use and no rule on automated access; the site describes its own daily automated reading of YouTube's catalog. No terms or privacy link was found in the footer of /best/. [MEASURED: playables.games/about/ and /best/, via WebFetch summaries, 2026-11-05] So automated collection is not prohibited that I could find; I did not find a terms page at all (UNVERIFIED that none exists).

## How collected
- Chrome, one tab, no sign-in, no forms. Read rendered DOM with javascript_tool.
- Page loads: /games/ (x2), /games/tall-man-run/, /best/ (x2, one reload), and same-origin fetches of 27 game pages spaced 2.6 s apart, plus an earlier aborted run of about 3 game fetches. About 36 requests in total. No rate limit, captcha or block seen.
- Ranks 1 to 50 come from the /best/ page (rank, title, genre, total plays text, slug). Added date and publisher come from each game page for ranks 1 to 28 only. Ranks 29 to 50 have those two fields empty.

## Row count and fields
- 50 rows [MEASURED: /best/, 2026-11-05]. The catalog is stated as 2,133 games. [MEASURED: /games/ header, "updated 2026-11-04"]
- The 100 rows asked for were not reachable: /best/ stops at 50, and /games/ A-Z is titles only (no plays). Plays for the other ~2,080 games exist only on per-game pages, which would be far over the ~40-load budget.
- Plays per day: NOT shown on any page I read (list, /best/, game page). Trending lists say rising fastest today but give no rate. The about page says daily snapshots are kept to compute deltas, so the site holds the data but does not publish it as a field I could see. plays_per_day_if_shown is empty. Age-adjusted rates must be computed: plays / days since added. [CALC, see below]
- Total plays are rounded: 3 significant digits in English per the about page (the /best/ page shows 2 to 3 digits, e.g. 112M, 99M). total_plays_int is the text times 1,000,000 and is only that precise.
- Publisher is the first item in the game page sub-header (a publisher label, sometimes followed by a developer after the word by). Genre is the site's own category (one per game).

## Is added date a launch date?
- Site wording on game pages: On YouTube Playables since <date>, separate from Released <month year> and On the web since <month year>. The about page does not define how the added date is set. UNVERIFIED how it is determined.
- Checks I could do: Tall Man Run shows Playables since Feb 20, 2024 with Released Feb 2024 [MEASURED: game page]. Playables launched with a few dozen games in 2024 per press coverage [DOC support.google.com/youtube/answer/14328604 search snippet, not re-read]. The 2024 dates for ranks 1, 5, 6, 9, 11, 16, 18, 28 fit that. Several dates are suspect as a launch: Hole.io shows Nov 5, 2025, though the game has long existed on the web; Mini Relaxing Game shows Sep 29, 2026 yet 39M plays, about 1.08M/day [CALC: 39M / 36 days]. That is possible but outlier-high and may be a first-seen date or a re-listing. Earlier in distribution.md, TubeGames dates for five games differ from a dated Playgama article by about two weeks.
- Read: looks like first appearance in the public catalog (or the tracker's first sighting), not a developer's launch date. Not proven. Treat age as an upper bound on how old the game is on YouTube, with ±weeks error, and larger error for games that appeared before the tracker began daily snapshots (UNVERIFIED when it began).
- Age-adjusted example [CALC, as of 2026-11-05]: Save The Pets 39M / 282 days (Jan 27 to Nov 5, 2026) = about 138K per day; Tall Man Run 112M / 989 days (Feb 20, 2024 to Nov 5, 2026) = about 113K per day.

## Match against hub snapshot
- Hub: docs/research/data/hub-snapshot-20261105-0701Z.csv, 1,124 data rows, 1,114 unique normalised titles (lowercase, non-alphanumerics removed). Not modified.
- Tracker top 50 matched to a hub row: 50 of 50 (100%) [CALC]. Unmatched top 50: none.
- Hub rows count is 1,124 versus the 2,133 tracker catalog, so the hub snapshot is a partial view; matching beyond the top 50 was not possible since I have no tracker plays below rank 50.
- Plays agree within one rounding step: the hub rounds 100K to 1M below 10M and to 1M above, the tracker shows 2 to 3 digits. Hub vs tracker text differ by 1M on 4 of 50 (Snake Clash 105M vs 104M, Dessert DIY 96M vs 95M, Phone Case DIY 84M vs 83M, Mini Relaxing Game 40M vs 39M) [CALC from the two files]. Likely rounding or a day apart (tracker 2026-11-04, hub 2026-11-05).

## Limits
- 50 rows, not 100; added date and publisher only for ranks 1 to 28; Released month not captured in the CSV.
- No plays per day from the site.
- Added date semantics unconfirmed. Publisher is the tracker's attribution, not YouTube's.
- Selection: top by all-time plays only, so survivors; no age-adjusted ranking of the long tail.
