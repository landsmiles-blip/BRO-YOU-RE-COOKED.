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
//                 ENDING is never covered, and the ONE rewarded ad — the skip —
//                 keeps every rule docs/PLAN.md section 7 gives it: only on the
//                 fail card, only after the curve's walls (3 failures on a
//                 spike or boss, 5 elsewhere), never on levels 1-3 or the
//                 daily, a token before an ad, never an interstitial straight
//                 after it, and no rewarded request from anywhere else.

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
  check('off the platform there is no sound setting, so audio is on', sdk.isAudioEnabled() === true);

  // NEVER HELD HOSTAGE TO AD FILL. Off the platform there is no ad at all —
  // the open web, and any day YouTube has nothing to show — and a stuck player
  // who asks for the skip still gets it.
  const { LEVELS, slotOf } = await import('../../js/levels.js');
  const { createGame, skip, skipOffer, PHASE } = await import('../../js/game.js');
  const g = createGame(LEVELS[0]);
  const i = LEVELS.findIndex((l, k) => k >= 3 && slotOf(l.id)?.role === 'DEVELOP');
  const { goToLevel } = await import('../../js/game.js');
  goToLevel(g, i);
  g.phase = PHASE.DEATHCAM; g.fails = 5;
  const offer = skipOffer(g);
  check('with no ad and no token, the skip is still offered', offer?.via === 'ad', JSON.stringify(offer));
  const done = await skip(g);
  check('and taking it moves him on, with no ad to show', done === true && g.levelIndex === i + 1 &&
        g.progress.skipped[LEVELS[i].id] === true, `now at ${g.levelIndex + 1}`);
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
const audioListeners = [];
globalThis.ytgame = {
  game: {
    firstFrameReady() {}, gameReady() {},
    saveData: () => Promise.resolve(), loadData: () => Promise.resolve(''),
  },
  system: {
    onPause() {}, onResume() {},
    isAudioEnabled: () => false,
    onAudioEnabledChange: (cb) => { audioListeners.push(cb); },
  },
  ads: {
    requestInterstitialAd: () => { requested.push('interstitial'); return Promise.resolve(); },
    requestRewardedAd: (id) => { requested.push('rewarded:' + id); return Promise.resolve(); },
  },
};

const { LEVELS, slotOf } = await import('../../js/levels.js');
const { createGame, nextLevel, goToLevel, skip, skipOffer, startDaily, dailyWon, PHASE, SKIP_AFTER } =
  await import('../../js/game.js');
const { record } = await import('../../js/progress.js');
const sdk = await import('../../js/platform/sdk.js');

console.log('\nADS — ON PLATFORM');
check('isPlayables is true when ytgame exists', sdk.isPlayables === true);

// YOUTUBE'S OWN SOUND SETTING: read at start, followed when it changes.
check("the game reads YouTube's sound setting", sdk.isAudioEnabled() === false);
{
  const heard = [];
  sdk.onAudioEnabledChange((on) => heard.push(on));
  audioListeners.forEach((cb) => cb(true));
  check('and follows it when it changes', audioListeners.length === 1 && heard.join() === 'true', heard.join());
}

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
// to buy. The skip is the one rewarded ad, and a playthrough that never asks
// for it must never see one.
check('no rewarded ad is requested by a playthrough that never skips',
  requested.every((r) => !r.startsWith('rewarded')),
  requested.filter((r) => r.startsWith('rewarded')).join(',') || 'none');

// ── THE SKIP ────────────────────────────────────────────────────────────
console.log('\nTHE SKIP — docs/PLAN.md section 7');
const wallAt = LEVELS.findIndex((l, k) => k >= 3 && ['SPIKE', 'BOSS'].includes(slotOf(l.id)?.role));
const plainAt = LEVELS.findIndex((l, k) => k >= 3 && slotOf(l.id)?.role === 'DEVELOP');
const failOn = (index, fails, setup = () => {}) => {
  const s = createGame(LEVELS[0]);
  goToLevel(s, index);
  setup(s);
  s.phase = PHASE.DEATHCAM;
  s.fails = fails;
  return s;
};

check('never on levels 1-3, however many failures',
  [0, 1, 2].every((k) => skipOffer(failOn(k, 99)) === null));
check(`a SPIKE or BOSS offers it after ${SKIP_AFTER.wall} failures, not before`,
  skipOffer(failOn(wallAt, SKIP_AFTER.wall - 1)) === null && skipOffer(failOn(wallAt, SKIP_AFTER.wall)) !== null,
  `${LEVELS[wallAt].verb}, slot ${slotOf(LEVELS[wallAt].id).role}`);
check(`any other level offers it after ${SKIP_AFTER.other}, not before`,
  skipOffer(failOn(plainAt, SKIP_AFTER.other - 1)) === null && skipOffer(failOn(plainAt, SKIP_AFTER.other)) !== null,
  `${LEVELS[plainAt].verb}, slot ${slotOf(LEVELS[plainAt].id).role}`);
check('only on the fail card — never during the freeze or the run',
  skipOffer(failOn(plainAt, 99, (s) => {})) !== null &&
  [PHASE.FROZEN, PHASE.SIM, PHASE.RESULT].every((ph) => { const s = failOn(plainAt, 99); s.phase = ph; return skipOffer(s) === null; }));
check('never on the daily', (() => { const s = failOn(plainAt, 99); startDaily(s); s.phase = PHASE.DEATHCAM; s.fails = 99; return skipOffer(s) === null; })());
check('never on a level already beaten',
  skipOffer(failOn(plainAt, 99, (s) => record(s.progress, LEVELS[plainAt].id, 1))) === null);

{
  // Paid with an ad: exactly one rewarded request, named for the level; the
  // level is marked skipped; he moves on; and the between-levels counter is
  // reset, so no interstitial follows the ad the player chose to watch.
  const s = failOn(plainAt, SKIP_AFTER.other);
  s.sinceAd = 2;
  const before = requested.length;
  await skip(s);
  const asked = requested.slice(before);
  check('with no token, it costs one rewarded ad, named for the level',
    asked.length === 1 && asked[0] === `rewarded:skip-${LEVELS[plainAt].id}`, asked.join(',') || 'none');
  check('the level is marked skipped and he moves on',
    s.progress.skipped[LEVELS[plainAt].id] === true && s.levelIndex === plainAt + 1);
  check('no interstitial straight after a rewarded ad', s.sinceAd === 0 && !asked.includes('interstitial'));
}
{
  // Paid with a token: no ad at all.
  const s = failOn(plainAt, SKIP_AFTER.other);
  s.progress.tokens = 2;
  const before = requested.length;
  const offer = skipOffer(s);
  await skip(s);
  check('a held token is spent instead of showing an ad',
    offer.via === 'token' && s.progress.tokens === 1 && !requested.slice(before).some((r) => r.startsWith('rewarded')));
}
{
  // Skipping the LAST level ends the game — and no ad covers the ending.
  const s = failOn(LEVELS.length - 1, 99);
  const before = requested.length;
  await skip(s);
  check('skipping the last level reaches the ending, uncovered',
    s.phase === PHASE.ENDING && !requested.slice(before).includes('interstitial'));
}
{
  // The daily pays the currency: a token per daily won, held to three.
  const s = createGame(LEVELS[0]);
  let paid = 0;
  for (let day = 20000; day < 20005; day++) { s.isDaily = true; s.dailyDay = day; if (dailyWon(s)) paid++; }
  s.dailyDay = 20004;
  check('each daily won pays a token, held to three',
    paid === 5 && s.progress.tokens === 3 && dailyWon(s) === false, `tokens ${s.progress.tokens}`);
}

console.log(failed === 0 ? '\nADS: PASS\n' : `\nADS: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
