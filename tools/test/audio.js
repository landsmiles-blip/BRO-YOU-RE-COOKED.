// AUDIO GATE — proves the sounds are REAL, not merely that the code runs.
//
// Audio is the easiest thing in a game to ship broken, because silence throws
// no error. A mis-set envelope, a gain that never ramps, a node that is never
// connected, an AudioContext that stays suspended — every one of those is a
// silent pass for any test that only checks "did the function get called".
//
// So this renders the actual sounds through an OfflineAudioContext and
// measures the waveform: peak amplitude (it makes sound at all), and the
// RELATIONSHIP between inputs and output (a hard impact is genuinely louder
// than a soft one, which is the entire claim behind synthesising rather than
// sampling).
//
//   node tools/serve.js &
//   node tools/test/audio.js

import { existsSync } from 'node:fs';

const CANDIDATES = [
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium/chrome-linux/chrome',
  process.env.CHROME_PATH,
].filter(Boolean);
const EXE = CANDIDATES.find((p) => existsSync(p));
if (!EXE) { console.log('audio test SKIPPED — no Chromium'); process.exit(0); }

let chromium;
try { ({ chromium } = await import('playwright-core')); }
catch {
  try { ({ chromium } = await import('/tmp/node_modules/playwright-core/index.mjs')); }
  catch { console.log('audio test SKIPPED — playwright-core not installed'); process.exit(0); }
}

const BASE = process.env.BASE_URL ?? 'http://localhost:8080/';
const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 405, height: 720 } });

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

console.log('\nAUDIO — rendered and measured, not just called');

// ── Part A: measure the waveform, IN ISOLATION ────────────────────────────
//
// On a BLANK page, not the game.
//
// The first version of this test rendered inside the running game, and the
// numbers moved depending on what order the sounds were measured in. The cause
// is worth remembering: the game loop calls audio.setDanger() every physics
// step, so it was mutating the very module state being measured, and the
// "silent" baseline was picking up an ambient bed that the game was driving
// underneath the test. A measurement harness sharing module state with a live
// game is not a measurement.
const lab = await browser.newPage();
lab.on('pageerror', (e) => errors.push('lab: ' + e.message));
await lab.goto(BASE + 'tools/test/audio-lab.html', { waitUntil: 'load' });

const peaks = await lab.evaluate(async () => {
  const mod = await import('/js/audio.js');
  const DUR = 2.0, SR = 44100;
  const out = {};
  async function render(fn) {
    const off = new OfflineAudioContext(1, SR * DUR, SR);
    const realAC = globalThis.AudioContext;
    globalThis.AudioContext = function () { return off; };
    try {
      mod.__resetForTest();
      mod.unlock();
      fn(mod);
      const buf = await off.startRendering();
      const d = buf.getChannelData(0);
      let peak = 0, sum = 0;
      for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; sum += a * a; }
      return { peak, rms: Math.sqrt(sum / d.length) };
    } finally { globalThis.AudioContext = realAC; }
  }
  out.release    = await render((m) => m.release());
  out.reject     = await render((m) => m.reject());
  out.trigger    = await render((m) => m.trigger());
  out.death      = await render((m) => m.death());
  out.success1   = await render((m) => m.success(1));
  out.success3   = await render((m) => m.success(3));
  out.ending     = await render((m) => m.ending());
  out.scratch    = await render((m) => m.scratch());
  out.soft       = await render((m) => m.impact(150));
  out.hard       = await render((m) => m.impact(650));
  out.belowFloor = await render((m) => m.impact(20));
  out.idle       = await render(() => {});
  out.danger     = await render((m) => m.setDanger(1));
  return out;
});
await lab.close();

const AUDIBLE = 0.004;
for (const [name, v] of Object.entries(peaks)) {
  if (name === 'belowFloor' || name === 'idle') continue;
  check(`${name} makes sound`, v.peak > AUDIBLE, `peak ${v.peak.toFixed(4)}`);
}

// THE claim that justifies synthesising rather than sampling.
check('a hard impact is louder than a soft one',
      peaks.hard.peak > peaks.soft.peak * 1.4,
      `soft ${peaks.soft.peak.toFixed(4)} vs hard ${peaks.hard.peak.toFixed(4)}`);
check('a scuff below the floor is SILENT',
      peaks.belowFloor.peak <= AUDIBLE, `peak ${peaks.belowFloor.peak.toFixed(5)}`);
check('3 stars sounds bigger than 1',
      peaks.success3.rms > peaks.success1.rms,
      `${peaks.success1.rms.toFixed(5)} vs ${peaks.success3.rms.toFixed(5)}`);
check('an untouched bed is SILENT', peaks.idle.peak <= AUDIBLE, `peak ${peaks.idle.peak.toFixed(5)}`);
check('danger raises the bed', peaks.danger.peak > peaks.idle.peak * 4,
      `idle ${peaks.idle.peak.toFixed(5)} vs danger ${peaks.danger.peak.toFixed(5)}`);

// ── Part B: lifecycle, in the REAL game ───────────────────────────────────
await page.goto(BASE, { waitUntil: 'load' });
await page.waitForFunction(() => globalThis.__byc?.game);

const before = await page.evaluate(async () => (await import('/js/audio.js')).__stateForTest());
check('NOTHING is created before a user gesture', before.ctx === null, JSON.stringify(before));

await page.mouse.move(200, 400);
await page.mouse.down();
await page.mouse.up();
await page.waitForTimeout(200);
const after = await page.evaluate(async () => (await import('/js/audio.js')).__stateForTest());
check('a gesture creates a RUNNING context', after.ctx === 'running', JSON.stringify(after));

const paused = await page.evaluate(async () => {
  const m = await import('/js/audio.js');
  m.pause();
  await new Promise((r) => setTimeout(r, 150));
  return m.__stateForTest();
});
check('pause() SUSPENDS the context (certification)', paused.ctx === 'suspended', JSON.stringify(paused));

const resumed = await page.evaluate(async () => {
  const m = await import('/js/audio.js');
  m.resume();
  await new Promise((r) => setTimeout(r, 150));
  return m.__stateForTest();
});
check('resume() restores it', resumed.ctx === 'running', JSON.stringify(resumed));

check('no page errors', errors.length === 0, errors.join('; '));

await browser.close();
console.log(failed ? `\n${failed} audio check(s) FAILED\n` : '\naudio OK\n');
process.exit(failed ? 1 : 0);
