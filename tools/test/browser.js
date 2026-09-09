// BROWSER VERIFICATION — drives the real page with real pointer events.
//
// Not part of `npm test` because it needs a browser and a running server.
//   node tools/serve.js &
//   npm run test:browser
//
// Covers the things a headless physics test cannot: that the game actually
// boots, that the contain-fit viewport holds at every certification-required
// aspect ratio, that a real drawn stroke goes through the whole pipeline, that
// the death cam appears, and that resizing mid-simulation does not perturb the
// run. Requires playwright-core; skips cleanly if it is not installed.

import { existsSync } from 'node:fs';

const CANDIDATES = [
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium/chrome-linux/chrome',
  process.env.CHROME_PATH,
].filter(Boolean);

const EXE = CANDIDATES.find((p) => existsSync(p));
if (!EXE) { console.log('browser test SKIPPED — no Chromium found'); process.exit(0); }

let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  try { ({ chromium } = await import('/tmp/node_modules/playwright-core/index.mjs')); }
  catch { console.log('browser test SKIPPED — playwright-core not installed'); process.exit(0); }
}

const BASE = process.env.BASE_URL ?? 'http://localhost:8080/';
const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });

// Certification requires playability from 9:32 to 32:9.
const RATIOS = [
  ['9-32',  360, 1280], ['9-16',  405,  720], ['3-4',   768, 1024],
  ['1-1',   800,  800], ['16-9', 1280,  720], ['32-9', 1600,  450],
];

const errors = [];
for (const [name, w, h] of RATIOS) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  page.on('pageerror', e => errors.push(`${name}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${name}: ${m.text()}`); });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => globalThis.__byc?.game, null, { timeout: 5000 });
  await page.waitForFunction(() => globalThis.__byc.game.phase === 'frozen', null, { timeout: 5000 });
  const info = await page.evaluate(() => ({
    scale: +globalThis.__byc.view.scale.toFixed(3),
    worldW: Math.round(globalThis.__byc.view.worldW),
    worldH: Math.round(globalThis.__byc.view.worldH),
    phase: globalThis.__byc.game.phase,
  }));
  const fits = info.worldW >= 719.5 && info.worldH >= 1279.5;
  console.log(`  ${fits ? 'PASS' : 'FAIL'}  ${name.padEnd(5)} ${String(w).padStart(4)}x${String(h).padStart(4)}  world ${String(info.worldW).padStart(4)}x${String(info.worldH).padStart(4)}  scale ${info.scale}  phase=${info.phase}`);
  if (!fits) errors.push(`${name}: safe box does not fit`);
  await page.screenshot({ path: `/tmp/shot-${name}.png` });
  await page.close();
}

console.log('\nPLAYTHROUGH (real pointer events through the real pipeline)\n');
const page = await browser.newPage({ viewport: { width: 405, height: 720 }, deviceScaleFactor: 2 });
page.on('pageerror', e => errors.push(`play: ${e.message}`));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForFunction(() => globalThis.__byc?.game.phase === 'frozen', null, { timeout: 5000 });
await page.screenshot({ path: '/tmp/shot-frozen.png' });
console.log('  frozen tableau reached — captured');

// world → screen, so we can draw with a real finger
const toScreen = async (wx, wy) => page.evaluate(([x, y]) => {
  const v = globalThis.__byc.view;
  return { x: (x + v.offsetX) * v.scale, y: (y + v.offsetY) * v.scale };
}, [wx, wy]);

// 1) Draw the intended span across the gap.
const a = await toScreen(300, 790), b = await toScreen(510, 790);
await page.mouse.move(a.x, a.y);
await page.mouse.down();
for (let i = 1; i <= 12; i++) {
  await page.mouse.move(a.x + (b.x - a.x) * i / 12, a.y + (b.y - a.y) * i / 12);
  await page.waitForTimeout(18);
}
await page.mouse.up();
const afterDraw = await page.evaluate(() => ({ phase: globalThis.__byc.game.phase, anchors: globalThis.__byc.game.sim.anchors.length }));
console.log(`  drew span → phase=${afterDraw.phase}  anchors=${afterDraw.anchors}`);
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/shot-sim.png' });

await page.waitForFunction(() => ['result','deathcam'].includes(globalThis.__byc.game.phase), null, { timeout: 12000 });
const outcome = await page.evaluate(() => ({ phase: globalThis.__byc.game.phase, o: globalThis.__byc.game.sim.run.outcome }));
console.log(`  ${outcome.o === 'success' ? 'PASS' : 'FAIL'}  intended stroke → ${outcome.o}`);
if (outcome.o !== 'success') errors.push('playthrough did not succeed');
await page.screenshot({ path: '/tmp/shot-result.png' });

// 2) Do nothing → death cam must appear with a label.
await page.evaluate(() => globalThis.__byc.retry(globalThis.__byc.game));
await page.waitForFunction(() => globalThis.__byc.game.phase === 'frozen', null, { timeout: 5000 });
await page.evaluate(() => { const g = globalThis.__byc.game; g.phase = 'sim'; g.phaseTime = 0; });
await page.waitForFunction(() => globalThis.__byc.game.phase === 'deathcam', null, { timeout: 12000 });
await page.waitForTimeout(400);
const death = await page.evaluate(() => globalThis.__byc.game.sim.death);
console.log(`  ${death?.label ? 'PASS' : 'FAIL'}  no stroke → death cam: "${death?.label ?? 'none'}"`);
await page.screenshot({ path: '/tmp/shot-death.png' });

// 3) Resize mid-simulation must not perturb the run.
await page.evaluate(() => globalThis.__byc.retry(globalThis.__byc.game));
await page.waitForFunction(() => globalThis.__byc.game.phase === 'frozen', null, { timeout: 5000 });
const a2 = await toScreen(300, 790), b2 = await toScreen(510, 790);
await page.mouse.move(a2.x, a2.y); await page.mouse.down();
for (let i = 1; i <= 12; i++) { await page.mouse.move(a2.x + (b2.x-a2.x)*i/12, a2.y); await page.waitForTimeout(18); }
await page.mouse.up();
await page.waitForTimeout(200);
await page.setViewportSize({ width: 900, height: 500 });   // violent ratio change mid-run
await page.waitForTimeout(200);
await page.setViewportSize({ width: 405, height: 720 });
await page.waitForFunction(() => ['result','deathcam'].includes(globalThis.__byc.game.phase), null, { timeout: 12000 });
const resized = await page.evaluate(() => globalThis.__byc.game.sim.run.outcome);
console.log(`  ${resized === 'success' ? 'PASS' : 'FAIL'}  resize mid-simulation → ${resized}`);
if (resized !== 'success') errors.push('resize perturbed the run');

await browser.close();
console.log(errors.length ? `\nERRORS:\n  ${errors.join('\n  ')}\n` : '\nNo console errors, no page errors.\n');
process.exit(errors.length ? 1 : 0);
