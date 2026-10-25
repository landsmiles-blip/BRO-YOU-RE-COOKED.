# Playgama — real players for the difficulty curve

*Prepared 25 Oct 2026. Nothing has been uploaded; that waits for your go-ahead.*

## Why

Every difficulty number in this game is simulated: a solver and a model hand,
never a person. Professional studios set and correct their curves from real
players' attempts per level (reports/Progressive difficulty in puzzle games.md).
Playgama's Sandbox (launched 14 Oct 2026, for games built with coding agents
like Claude Code) shows a game to real players and reports what they do.

## What is ready

- **`dist/byc-playgama.zip`**, built by `npm run build`. It is the same game as
  every other build, with Playgama's SDK loaded first from Playgama's own
  server (the SDK is LGPL-3.0, so it is loaded, never copied into our file)
  and its config file beside it.
- **What it reports:** each run's start and end, with the level, the outcome
  and the attempt number. These go both as Playgama's standard
  level-started / completed / failed messages and as our own events. Nothing
  personal is collected.
- **The YouTube build is untouched.** It still makes no network call of its
  own, and `tools/test/playgama.js` proves the reporting stays off inside
  YouTube even if the SDK were somehow present.
- **Ads on Playgama are off.** Turning them on is a separate decision.
- **The SDK is Playgama's moving `stable` channel**
  (`https://bridge.playgama.com/v2/stable/playgama-bridge.js`), so it can change
  under the build without a commit here. That is acceptable for a test build on
  their platform; it is one more reason the YouTube build never loads it.

## What you do (about 15 minutes)

1. **Create a developer account** at https://developer.playgama.com.
2. **Connect Playgama to Claude** (optional, but it lets me upload for you).
   In claude.ai go to Settings → Connectors and add a custom connector with
   the URL `https://developer.playgama.com/api/mcp`. Playgama's own README
   documents this server for Claude Code.
3. **Tell me to go.** I then upload `byc-playgama.zip` to a Sandbox game and
   give you the link.
   - Without the connector, upload the zip yourself in the developer cabinet.
4. **Share the link** wherever you like. The first few hundred plays are what
   the curve needs: about 30 players per level for a first estimate, and 50
   or more for a firm one.

## What happens to the numbers

1. Export the runs from Playgama's dashboard: per level and player, how many
   runs they made and whether they won. Players who quit count too: leaving
   them out flatters exactly the levels that stop people.
2. Run `node tools/lib/import-tries.mjs export.csv > data/playtests/attempts.json`.
3. Run `python3 tools/lib/fit-curve.py --real data/playtests/attempts.json`. It
   prints real against simulated attempts, level by level, and once five
   levels have data it fits the line that turns simulated tries into a
   prediction for people.

Each level's number is all runs by everyone divided by the number who won.
Read the winner counts down the campaign as the drop-off.

## Never pick YouTube as a Playgama target

Playgama can distribute a game to other platforms, YouTube Playables among
them. **Do not tick YouTube there** while the direct Playables application
stands: it would put a second copy of this game on the same shelf, which is
what the duplicate rule polices, and through a build with someone else's SDK
in it. The YouTube release goes through our own `byc-playables.zip` only.

## Open questions, checked before upload

- **Sandbox terms and revenue split:** only Playgama's own blog and a press
  release were readable from here. Read the terms in the cabinet.
- **YouTube Playables:** its duplicate rule (25 Aug 2026) is about two
  Playables being the same game. A web release elsewhere does not make the
  YouTube version a duplicate inside Playables. Confirm with your Partner
  Manager when you have one.
