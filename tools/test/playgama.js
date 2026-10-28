// GATE TEST — the Playgama build reports runs; nothing else ever does.
//
// js/platform/playgama.js is the one transport this game has: on Playgama it
// forwards every run's end (level, outcome, attempt) so real players' attempts
// can calibrate the difficulty curve. The same code is in every build, so two
// things must hold: with the SDK present it forwards, and inside YouTube
// Playables — where no external call is allowed — it forwards NOTHING, even if
// something defines a `bridge` global. sdk.js and playgama.js read their
// globals once at import, so the Playables half runs in its own process.

import { spawnSync } from 'node:child_process';

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

const sent = [];
const fakeBridge = () => ({
  initialize: () => Promise.resolve(),
  analytics: { send: (name, data) => sent.push(['event', name, data]) },
  platform: { sendMessage: (m, o) => { sent.push(['message', m, o]); return Promise.resolve(); } },
});
const settle = () => new Promise((r) => setTimeout(r, 20));

if (process.argv.includes('--inside-playables')) {
  globalThis.ytgame = { game: {}, system: {} };
  globalThis.bridge = fakeBridge();
  const P = await import('../../js/platform/playgama.js');
  const { track } = await import('../../js/platform/analytics.js');
  P.initPlaygama();
  track('run_end', { level: 'a1-wall', outcome: 'success', attempt: 1 });
  P.playgamaGameReady();
  await settle();
  check('inside YouTube Playables nothing is forwarded, even with a bridge present',
    !P.onPlaygama && sent.length === 0, `${sent.length} calls`);
  process.exit(failed ? 1 : 0);
}

console.log('\nPLAYGAMA — real players\' attempts, from one build only');

// 1. No SDK at all: the open web, every test, the playtest artifact.
{
  const P = await import('../../js/platform/playgama.js?none');
  check('with no SDK on the page, the adapter is off', P.onPlaygama === false);
}

// 2. On Playgama: every run's start and end reach the SDK.
{
  globalThis.bridge = fakeBridge();
  const P = await import('../../js/platform/playgama.js?on');
  P.initPlaygama();
  P.report('attempt_start', { level: 'a1-wall', attempt: 1 });
  P.report('run_end', { level: 'a1-wall', outcome: 'killed', attempt: 1 });
  P.report('run_end', { level: 'a1-wall', outcome: 'success', attempt: 2 });
  P.report('run_end', { level: 'a1-wall', outcome: 'aborted', attempt: 3 });
  P.playgamaGameReady();
  await settle();
  const events = sent.filter(([k]) => k === 'event').map(([, n, d]) => `${n}:${d.outcome ?? ''}`);
  const messages = sent.filter(([k]) => k === 'message').map(([, m]) => m);
  check('on Playgama the adapter is on', P.onPlaygama === true);
  check('every run event is sent as a custom event, with its attempt number',
    events.length === 4 && sent.find(([k, n, d]) => k === 'event' && n === 'run_end' && d.outcome === 'success')?.[2].attempt === 2,
    events.join(', '));
  check('and the portal\'s own level messages: started, failed, completed',
    ['level_started', 'level_failed', 'level_completed'].every((m) => messages.includes(m)), messages.join(', '));
  check('an aborted run is not called a failure', messages.filter((m) => m === 'level_failed').length === 1);
  check('the game tells the portal when it is ready', messages.includes('game_ready'));
  delete globalThis.bridge;
}

const inside = spawnSync(process.execPath,
  ['--import', './tools/node-matter.js', 'tools/test/playgama.js', '--inside-playables'], { stdio: 'inherit' });
if (inside.status !== 0) failed++;

console.log(failed === 0 ? '\nPLAYGAMA: PASS\n' : `\nPLAYGAMA: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
