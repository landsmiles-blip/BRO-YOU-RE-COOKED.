// THE FROZEN CONTACT SHEET — every level's opening frame, in one image.
//
// The frozen tableau is the entire brief. The player gets one still picture and
// a six-word hint, and from that has to work out what the level wants. Every
// other gate in this repo measures what happens AFTER they decide; nothing
// measures whether the picture they decide from makes sense.
//
// It cost two full re-measures to learn that. A20 passed breadth, precision,
// tension and hand-robustness while its opening frame showed the ball that
// kills Milo sitting on top of the goal that saves him. No number moved. The
// screenshot showed it instantly — but only because I happened to take one.
//
// filmstrip.js already captures a `frozen` frame per level, buried as the first
// cell of twenty separate images. This pulls just those frames into one grid so
// staging faults show up in a single look, side by side, where an odd one out
// is obvious in a way it never is one level at a time.
//
//   node tools/test/frozen.js         (needs: node tools/serve.js)
//
// READ THE IMAGE. That is the whole point of the tool.

import { existsSync, mkdirSync } from 'node:fs';

const OUT = process.env.FILM_DIR ?? '/tmp';
const BASE = process.env.BASE_URL ?? 'file:///home/user/BRO-YOU-RE-COOKED./dist/byc.html';
const VIEW = { width: 405, height: 720 };
const COLS = 5;
const CELL = { w: 264, h: 469 };   // scaled down; 5 across stays legible
const LABEL = 24;

const CANDIDATES = [
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium/chrome-linux/chrome',
  process.env.CHROME_PATH,
].filter(Boolean);
const EXE = CANDIDATES.find((p) => existsSync(p));
if (!EXE) { console.log('frozen sheet SKIPPED — no Chromium'); process.exit(0); }

let chromium;
try { ({ chromium } = await import('playwright-core')); }
catch {
  try { ({ chromium } = await import('/tmp/node_modules/playwright-core/index.mjs')); }
  catch { console.log('frozen sheet SKIPPED — playwright-core not installed'); process.exit(0); }
}

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: VIEW });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(BASE, { waitUntil: 'load' });
await page.waitForFunction(() => globalThis.__byc?.game, null, { timeout: 10000 });

const levels = await page.evaluate(() =>
  globalThis.__byc.LEVELS.map((l) => ({ id: l.id, verb: l.verb, hint: l.hint })));

console.log(`\nFROZEN TABLEAUX — ${levels.length} levels\n`);

const shots = [];
for (let i = 0; i < levels.length; i++) {
  // goToLevel by index, not repeated nextLevel: the last level deliberately
  // ends the run rather than wrapping round to the first.
  await page.evaluate((n) => globalThis.__byc.goToLevel(globalThis.__byc.game, n), i);
  await page.waitForFunction(() => globalThis.__byc.game.phase === 'frozen', null, { timeout: 10000 });
  await page.waitForTimeout(90);   // let the freeze settle so the frame is the real one
  shots.push({ label: `${i + 1}. ${levels[i].verb}`, buf: await page.screenshot() });
  console.log(`  ${String(i + 1).padStart(2)}. ${levels[i].id.padEnd(15)} ${levels[i].verb.padEnd(10)} ${levels[i].hint}`);
}

const rows = Math.ceil(shots.length / COLS);
const sheet = await browser.newPage({
  viewport: { width: COLS * CELL.w, height: rows * (CELL.h + LABEL) },
});
await sheet.setContent('<canvas id="c"></canvas><style>body{margin:0;background:#111}</style>');
await sheet.evaluate(async ({ frames, cols, cell, label }) => {
  const c = document.getElementById('c');
  const rows = Math.ceil(frames.length / cols);
  c.width = cols * cell.w;
  c.height = rows * (cell.h + label);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < frames.length; i++) {
    const cx = (i % cols) * cell.w;
    const cy = Math.floor(i / cols) * (cell.h + label);
    const img = new Image();
    await new Promise((r) => { img.onload = r; img.src = 'data:image/png;base64,' + frames[i].b64; });
    ctx.drawImage(img, cx, cy + label, cell.w, cell.h);
    ctx.fillStyle = '#fff';
    ctx.font = '600 15px system-ui, sans-serif';
    ctx.fillText(frames[i].label, cx + 8, cy + 17);
    ctx.strokeStyle = '#444';
    ctx.strokeRect(cx, cy + label, cell.w, cell.h);
  }
}, { frames: shots.map((s) => ({ label: s.label, b64: s.buf.toString('base64') })), cols: COLS, cell: CELL, label: LABEL });

const file = `${OUT}/frozen-sheet.png`;
await sheet.locator('#c').screenshot({ path: file });
await browser.close();

console.log(`\n  -> ${file}`);
if (errors.length) {
  console.log(`\n${errors.length} page error(s):`);
  for (const e of errors.slice(0, 5)) console.log('  ' + e);
}
console.log('\nNow LOOK AT IT. For each frame ask what a stranger would think it wants,');
console.log('and whether anything is standing where it must not be.\n');
process.exit(errors.length ? 1 : 0);
