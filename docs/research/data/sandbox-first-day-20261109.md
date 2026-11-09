# BYC on the Playgama Sandbox: first day of real data, 9 Nov 2026

Source: Playgama developer console (owner's screen recordings, 9 Nov about 15:00 +07) and the Playgama MCP telemetry tools read at 08:04 UTC. Sandbox live since 2026-11-09T04:05:01Z at https://playgama.ai/play/t527kwsjbecj3s (published by the owner in the console; build `byc-1.0.2-playgama`). SMALL SAMPLE: about 7 users, 10 sessions. Some of this traffic is probably the owner and testers (UNVERIFIED which). Nothing below is a conclusion about players in general.

## The Sandbox targets (read from the console, MEASURED)
For category Puzzle: 100 qualifying plays; average play time 5:00 (based on the last 200 qualifying plays); at least 0.30 ad shows per play (counted over all qualifying plays). "Qualifying" excludes anomalous and fraudulent sessions. Targets are recalculated once a day; the first count was due the next day. At the time of the recording: 9 launches, 3 plays, average play time 3m29s (all plays), 2 likes and 0 dislikes.

## Telemetry for 9 Nov (get_game_telemetry_analytics and event tools) [MEASURED]
- 695 events, 10 unique sessions, 7 unique users, 18 event types. Sessions with a drawn line: 4 sessions, 3 users. Mean session 72 s; median 0 s; longest 462 s (7 min 42 s). Eight sessions reached `game_ready`; half of the loaded sessions never committed a stroke.
- 89 runs (`run_end`): 50 success, 28 aborted, 10 killed, 1 stuck. Attempts per level: mean 3.2, up to 17. One user made 17 runs on `a51-fence`; `a20-spring` had 13 runs from 3 users. 41 different levels appear, most once, which looks like someone jumping around the level board rather than playing in order (UNVERIFIED who).
- Interstitials: 43 `advertisement_interstitial_failed`, 7 opened, 6 closed, across 50 `level_completed` messages (4 sessions). The game asks at every level boundary and the Bridge decides, so most requests being declined is consistent with its pacing; whether it is pacing or no ad fill is UNKNOWN (the console's Metrics page has the ad numbers).
- `performance_sample`, 17 windows from 3 users on build `byc-1.0.2`: fps average median 100 (min 50.6, 10th percentile 59.9); frame time median 10 to 17 ms, 95th percentile up to 34 ms; frames over 100 ms: 6 in total; over 500 ms: 1. No sign of a frame-rate problem on these three devices; no low-end phone is known to be among them.

## Reading it honestly
The one number below target is average play time (3m29s against 5:00), from 3 plays. Ad shows per play look above 0.30 on this sample. Whether the 'play' definition needs a minimum time is UNKNOWN. More plays are needed before any of this means anything; the targets themselves say 100.
