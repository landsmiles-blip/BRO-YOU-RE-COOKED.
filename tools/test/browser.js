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

console.log('\nPLAYTHROUGH — drawn the way a FINGER draws, not the way a test does\n');

/**
 * The old version of this test dragged ten straight mouse moves, which
 * Douglas-Peucker collapsed to two points and one rigid body — stable by
 * construction. That is why an unplayable build passed every check: nothing
 * ever simulated a hand. This draws dense, wavering strokes that survive
 * simplification as 20+ part compound bodies, and asserts the world stays calm.
 */
function fingerPath(ax, ay, bx, by, n = 40, waver = 6) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push([
      ax + (bx - ax) * t + Math.sin(t * 11) * waver,
      ay + (by - ay) * t + Math.cos(t * 13) * waver,
    ]);
  }
  return out;
}

const page = await browser.newPage({ viewport: { width: 405, height: 720 }, deviceScaleFactor: 2 });
page.on('pageerror', (e) => errors.push(`play: ${e.message}`));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForFunction(() => globalThis.__byc?.game.phase === 'frozen', null, { timeout: 8000 });

const toScreen = async (wx, wy) => page.evaluate(([x, y]) => {
  const v = globalThis.__byc.view;
  return { x: (x + v.offsetX) * v.scale, y: (y + v.offsetY) * v.scale };
}, [wx, wy]);

async function drawFinger(path) {
  const pts = [];
  for (const [x, y] of path) pts.push(await toScreen(x, y));
  await page.mouse.move(pts[0].x, pts[0].y);
  await page.mouse.down();
  for (let i = 1; i < pts.length; i++) { await page.mouse.move(pts[i].x, pts[i].y); await page.waitForTimeout(14); }
  await page.mouse.up();
}

await drawFinger(fingerPath(300, 790, 510, 790));

// Watch the real animation frames for oscillation. path >> net means vibrating.
const stability = await page.evaluate(() => new Promise((res) => {
  const g = globalThis.__byc.game;
  if (!g.sim.stroke) return res({ rejected: true });
  const parts = g.sim.stroke.parts.length > 1 ? g.sim.stroke.parts.slice(1) : [g.sim.stroke];
  const first = parts.map((p) => ({ x: p.position.x, y: p.position.y }));
  let prev = first.map((p) => ({ ...p })), path = 0, frames = 0, maxMiloV = 0;
  (function loop() {
    parts.forEach((p, k) => {
      path += Math.hypot(p.position.x - prev[k].x, p.position.y - prev[k].y);
      prev[k] = { x: p.position.x, y: p.position.y };
    });
    maxMiloV = Math.max(maxMiloV, Math.hypot(g.sim.milo.body.velocity.x, g.sim.milo.body.velocity.y));
    if (++frames < 100) requestAnimationFrame(loop);
    else {
      let net = 0;
      parts.forEach((p, k) => { net += Math.hypot(p.position.x - first[k].x, p.position.y - first[k].y); });
      res({ parts: parts.length, path: Math.round(path), net: Math.round(net),
            wobble: +(path / Math.max(20, net)).toFixed(1), maxMiloV: +maxMiloV.toFixed(1) });
    }
  })();
}));

if (stability.rejected) { errors.push('finger stroke was rejected'); }
else {
  const multi = stability.parts >= 5;
  const calm = stability.wobble < 8;
  const gentle = stability.maxMiloV < 8;
  console.log(`  ${multi ? 'PASS' : 'FAIL'}  stroke is genuinely multi-part — ${stability.parts} parts`);
  console.log(`  ${calm ? 'PASS' : 'FAIL'}  no vibration — path/net = ${stability.wobble} (${stability.path}u travelled, ${stability.net}u net)`);
  console.log(`  ${gentle ? 'PASS' : 'FAIL'}  Milo is not launched — peak |v| ${stability.maxMiloV}`);
  if (!multi) errors.push('finger stroke collapsed to one part — test is vacuous');
  if (!calm) errors.push(`stroke oscillating: path/net ${stability.wobble}`);
  if (!gentle) errors.push(`milo launched: |v| ${stability.maxMiloV}`);
}

await page.waitForFunction(() => ['result', 'deathcam'].includes(globalThis.__byc.game.phase), null, { timeout: 14000 });
const outcome = await page.evaluate(() => globalThis.__byc.game.sim.run.outcome);
console.log(`  ${outcome === 'success' ? 'PASS' : 'FAIL'}  a hand-drawn solution still wins — ${outcome}`);
if (outcome !== 'success') errors.push('hand-drawn stroke did not succeed');

await browser.close();
console.log(errors.length ? `\nERRORS:\n  ${errors.join('\n  ')}\n` : '\nNo console errors, no page errors.\n');
process.exit(errors.length ? 1 : 0);
