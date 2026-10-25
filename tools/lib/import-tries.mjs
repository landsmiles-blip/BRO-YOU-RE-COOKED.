// Real players' attempts in, one file out for `fit-curve.py --real`.
//
//   node tools/lib/import-tries.mjs rows.csv [more.csv ...] > data/playtests/attempts.json
//
// Each CSV row is one player's FIRST WIN on one level:  level,player,attempts
// (a header row is skipped; level is the id, e.g. a1-wall, the number on
// screen, e.g. 12 for "12/42", or the verb on the card when only one level
// carries it — two levels are called BLOCK, so that one is refused). Where the
// rows come from does not matter — a Playgama
// analytics export (run_end events where outcome is success: level, player,
// attempt), or a tester reading the playtest board — which is why the format
// is the plainest one there is.
//
// Out: per level, how many players won it and the mean and median attempts
// they took. A player who never won a level is not in it, so a level that
// stops people shows as FEW players rather than as many attempts — read the
// player counts down the campaign as the drop-off.

import { readFileSync } from 'node:fs';
import { LEVELS } from '../../js/levels.js';

const verbCount = new Map();
for (const l of LEVELS) verbCount.set(l.verb.toUpperCase(), (verbCount.get(l.verb.toUpperCase()) ?? 0) + 1);
const byVerb = new Map(LEVELS.filter((l) => verbCount.get(l.verb.toUpperCase()) === 1).map((l) => [l.verb.toUpperCase(), l.id]));
const byNumber = (s) => (/^\d+$/.test(s) ? LEVELS[Number(s) - 1]?.id : undefined);
const known = new Set(LEVELS.map((l) => l.id));
const per = new Map();   // id -> Map(player -> attempts)

for (const file of process.argv.slice(2)) {
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const [rawLevel, player, rawAttempts] = line.split(',').map((s) => s?.trim());
    const attempts = Number(rawAttempts);
    if (!rawLevel || !player || !Number.isInteger(attempts) || attempts < 1) continue;   // header, blanks, junk
    const id = known.has(rawLevel) ? rawLevel : byNumber(rawLevel) ?? byVerb.get(rawLevel.toUpperCase());
    if (!id) {
      console.error(verbCount.get(rawLevel.toUpperCase()) > 1
        ? `skipped "${rawLevel}": more than one level has that name — use its number or id`
        : `skipped unknown level "${rawLevel}"`);
      continue;
    }
    if (!per.has(id)) per.set(id, new Map());
    const m = per.get(id);
    // One number per player per level: their first win. A duplicate keeps the lower.
    m.set(player, Math.min(m.get(player) ?? Infinity, attempts));
  }
}

const out = {};
for (const [id, m] of per) {
  const xs = [...m.values()].sort((a, b) => a - b);
  out[id] = {
    players: xs.length,
    mean: xs.reduce((a, b) => a + b, 0) / xs.length,
    median: xs[xs.length >> 1],
  };
}
console.log(JSON.stringify(out, null, 2));
