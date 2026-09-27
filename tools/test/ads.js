// THE MONETIZATION SURFACE GATE.
//
// `requestRewardedAd` sat in the header of js/platform/sdk.js as part of the
// "verified SDK surface" from the day that file was written and was never
// implemented — the identical bug to saveData/loadData, which meant nothing a
// player did was ever remembered until somebody noticed. A surface that is
// documented but absent is invisible to every other gate in this repo, so it
// gets one of its own.
//
// Two things are checked, and they need two processes: sdk.js captures
// `globalThis.ytgame` once at module load, so a run cannot be both on and off
// the platform. This file spawns itself with --offline for the first half.
//
//   OFF-PLATFORM  every ad call is a silent no-op that resolves false. This is
//                 the one that would break the game EVERYWHERE if it were
//                 wrong — every filmstrip, every browser test, and the whole
//                 open-web build run with no ytgame present.
//   ON-PLATFORM   the interstitial fires at the cadence the code claims, the
//                 ENDING is never covered, and NO rewarded ad is ever
//                 requested. That last one is a design rule made
//                 machine-checkable: see the comment on requestRewardedAd.

import { spawnSync } from 'node:child_process';

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

// ── half one: no platform at all ────────────────────────────────────────
if (process.argv.includes('--offline')) {
  const sdk = await import('../../js/platform/sdk.js');
  console.log('\nADS — OFF PLATFORM (no ytgame, which is every test and the open web)');
  check('isPlayables is false', sdk.isPlayables === false);

  let threw = null;
  let inter, rew, bad;
  try {
    inter = await sdk.requestInterstitialAd();
    rew = await sdk.requestRewardedAd('reward-1');
    bad = await sdk.requestRewardedAd('');
  } catch (e) { threw = e; }

  check('no ad call throws', threw === null, threw ? String(threw) : '');
  check('interstitial resolves false', inter === false, String(inter));
  check('rewarded resolves false', rew === false, String(rew));
  check('a rewarded id must be a non-empty string', bad === false, String(bad));
  process.exit(failed === 0 ? 0 : 1);
}

const offline = spawnSync(process.execPath,
  ['--import', './tools/node-matter.js', 'tools/test/ads.js', '--offline'],
  { stdio: 'inherit' });
if (offline.status !== 0) failed++;

// ── half two: a mocked platform ─────────────────────────────────────────
//
// The mock goes up BEFORE the imports, because sdk.js reads globalThis.ytgame
// at module scope. Importing first would silently test the no-op path twice.
const requested = [];
globalThis.ytgame = {
  game: {
    firstFrameReady() {}, gameReady() {},
    saveData: () => Promise.resolve(), loadData: () => Promise.resolve(''),
  },
  system: { onPause() {}, onResume() {} },
  ads: {
    requestInterstitialAd: () => { requested.push('interstitial'); return Promise.resolve(); },
    requestRewardedAd: (id) => { requested.push('rewarded:' + id); return Promise.resolve(); },
  },
};

const { LEVELS } = await import('../../js/levels.js');
const { createGame, nextLevel, PHASE } = await import('../../js/game.js');
const sdk = await import('../../js/platform/sdk.js');

console.log('\nADS — ON PLATFORM');
check('isPlayables is true when ytgame exists', sdk.isPlayables === true);

const g = createGame(LEVELS[0]);
const adAt = [];          // which level's completion produced an ad
let endingHadAd = false;

for (let i = 0; i < LEVELS.length + 2; i++) {
  const before = requested.length;
  const finished = g.levelIndex + 1;
  nextLevel(g);
  const fired = requested.length > before;
  if (fired) adAt.push(finished);
  if (g.phase === PHASE.ENDING) { endingHadAd = fired; break; }
}

// A level here is about forty seconds. An ad after each one is the fastest way
// to lose a player we paid nothing to acquire, so the cadence is the point.
check('the first two levels are never interrupted',
  !adAt.includes(1) && !adAt.includes(2), `first ad after L${adAt[0]}`);
check('the first ad lands after level 3', adAt[0] === 3, `L${adAt[0]}`);
check('ads are spaced three levels apart',
  adAt.every((v, i) => i === 0 || v - adAt[i - 1] === 3), adAt.join(','));
check('a full run is not ad-saturated',
  adAt.length <= Math.ceil(LEVELS.length / 3),
  `${adAt.length} ads across ${LEVELS.length} levels`);

// The one screen that tells the player they finished the whole game.
check('the ENDING is never covered by an ad', endingHadAd === false);

// DESIGN RULE, MADE CHECKABLE. "One line. One shot." is the premise, so a paid
// undo sells the tension every level is built on, and a hint that obeys this
// project's own rule — name the PROBLEM, never the solution — is worth nothing
// to buy. The function is wired so the surface is honest; it has no call site
// on purpose, and this catches a future one arriving quietly.
check('no rewarded ad is requested anywhere in a full playthrough',
  requested.every((r) => !r.startsWith('rewarded')),
  requested.filter((r) => r.startsWith('rewarded')).join(',') || 'none');

console.log(failed === 0 ? '\nADS: PASS\n' : `\nADS: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
