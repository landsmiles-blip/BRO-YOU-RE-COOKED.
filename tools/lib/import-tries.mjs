// Real players' attempts in, one file out for `fit-curve.py --real`.
//
//   node tools/lib/import-tries.mjs rows.csv [more.csv ...] > data/playtests/attempts.json
//
// Each CSV row is one player on one level:  level,player,runs[,won]
// runs = how many runs they made (up to and including their first win, if
// any); won = 1 if they won it, 0 if they quit or skipped (default 1).
// (a header row is skipped; level is the id, e.g. a1-wall, the number on
// screen, e.g. 12 for "12/42", or the verb on the card when only one level
// carries it — two levels are called BLOCK, so that one is refused). Where the
// rows come from does not matter — a Playgama
// analytics export (run_end events where outcome is success: level, player,
// attempt), or a tester reading the playtest board — which is why the format
// is the plainest one there is.
//
// Out: per level, `mean` = ALL runs by everyone ÷ the number who won. That is
// the censored estimate the difficulty research calls for: averaging only
// the winners flatters exactly the levels that stop people, because the
// players it stopped drop out of the average. A level nobody won has no
// estimate and says so. `players`, `winners` and `median` (of the winners'
// runs) come with it; read `winners` down the campaign as the drop-off.

import { readFileSync } from 'node:fs';
import { LEVELS } from '../../js/levels.js';

const verbCount = new Map();
for (const l of LEVELS) verbCount.set(l.verb.toUpperCase(), (verbCount.get(l.verb.toUpperCase()) ?? 0) + 1);
const byVerb = new Map(LEVELS.filter((l) => verbCount.get(l.verb.toUpperCase()) === 1).map((l) => [l.verb.toUpperCase(), l.id]));
const byNumber = (s) => (/^\d+$/.test(s) ? LEVELS[Number(s) - 1]?.id : undefined);
const known = new Set(LEVELS.map((l) => l.id));
const per = new Map();   // id -> Map(player -> { runs, won })

for (const file of process.argv.slice(2)) {
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const [rawLevel, player, rawRuns, rawWon] = line.split(',').map((s) => s?.trim());
    const runs = Number(rawRuns);
    const won = rawWon === undefined || rawWon === '' ? true : rawWon === '1' || /^(true|yes|won)$/i.test(rawWon);
    if (!rawLevel || !player || !Number.isInteger(runs) || runs < 1) continue;   // header, blanks, junk
    const id = known.has(rawLevel) ? rawLevel : byNumber(rawLevel) ?? byVerb.get(rawLevel.toUpperCase());
    if (!id) {
      console.error(verbCount.get(rawLevel.toUpperCase()) > 1
        ? `skipped "${rawLevel}": more than one level has that name — use its number or id`
        : `skipped unknown level "${rawLevel}"`);
      continue;
    }
    if (!per.has(id)) per.set(id, new Map());
    const m = per.get(id);
    // One entry per player per level. A duplicate keeps the row that won,
    // else the longer one: a player's runs only ever grow.
    const prev = m.get(player);
    if (!prev || (won && !prev.won) || (won === prev.won && runs > prev.runs)) m.set(player, { runs, won });
  }
}

const out = {};
for (const [id, m] of per) {
  const all = [...m.values()];
  const winners = all.filter((p) => p.won).map((p) => p.runs).sort((a, b) => a - b);
  const runs = all.reduce((n, p) => n + p.runs, 0);
  if (!winners.length) { console.error(`${id}: ${all.length} players, nobody won — no estimate`); continue; }
  out[id] = {
    players: all.length, winners: winners.length,
    mean: runs / winners.length,
    median: winners[winners.length >> 1],
  };
}
console.log(JSON.stringify(out, null, 2));
