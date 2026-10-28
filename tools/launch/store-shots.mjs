// THE STORE IMAGES — from the real game, never a mockup.
//
//   npm run build && node tools/launch/store-shots.mjs [out dir]   (default docs/launch)
//
// Eight phone-size screenshots in the notebook theme — the first level with
// its pencil, then the dog, the bees, TNT, air and a balloon, an action shot
// and a rescue — and three covers drawn inside the game's own page, so the
// title is set in its handwritten font. The first kit (12 Oct) predated the
// notebook theme and said "21 levels"; it went stale without anything
// noticing, so this script is kept beside the build to be re-run instead.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { SOLUTIONS } from '../../js/solutions.js';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const OUT = resolve(process.argv[2] ?? `${ROOT}docs/launch`);
const BASE = process.env.BASE_URL ?? pathToFileURL(`${ROOT}dist/byc.html`).href;
mkdirSync(OUT, { recursive: true });

const EXE = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome',
  process.env.CHROME_PATH].filter(Boolean).find((p) => existsSync(p));
if (!EXE) { console.error('store shots: no Chromium found'); process.exit(1); }
let chromium;
try { ({ chromium } = await import('playwright-core')); }
catch { ({ chromium } = await import('/tmp/node_modules/playwright-core/index.mjs')); }

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 405, height: 720 }, deviceScaleFactor: 2 });
const errors = []; page.on('pageerror', (e) => errors.push(e.message));
await page.goto(BASE, { waitUntil: 'load' });
await page.waitForFunction(() => globalThis.__byc?.game, null, { timeout: 20000 });
await page.evaluate(() => document.fonts.ready);

const go = async (id, settle = 150) => {
  await page.evaluate((t) => { const B = globalThis.__byc; B.goToLevel(B.game, B.LEVELS.findIndex((l) => l.id === t)); }, id);
  await page.waitForFunction(() => globalThis.__byc.game.phase === 'frozen', null, { timeout: 20000 });
  await page.waitForTimeout(settle);
};
const draw = async (id) => {
  const pts = await page.evaluate((P) => {
    const V = globalThis.__byc.view;
    return P.map((p) => ({ x: (p.x + V.offsetX) * V.scale, y: (p.y + V.offsetY) * V.scale }));
  }, SOLUTIONS[id].solution.points);
  await page.mouse.move(pts[0].x, pts[0].y); await page.mouse.down();
  for (let i = 1; i < pts.length; i++) { await page.mouse.move(pts[i].x, pts[i].y); await page.waitForTimeout(10); }
  await page.mouse.up();
};

const shots = {};
const snap = async (name) => { const buf = await page.screenshot({ path: `${OUT}/screenshot-${name}.png` }); shots[name] = buf.toString('base64'); };

// 1. The first level, with the pencil showing the gesture (it appears after 2.5s).
await go('a1-wall', 3300); await snap('1-first-level');
// 2-6. One frozen frame per idea a stranger has not seen in a draw game.
await go('a80-good-boy'); await snap('2-dog');
await go('a120-swarm', 150); await snap('3-bees');
await go('a54-shelter'); await snap('4-tnt');
await go('a28-duct'); await snap('5-air');
await go('a30-float'); await snap('6-balloon');
// 7. TRIGGER's certified answer mid-run: a line, a rock, a plate.
await go('a10-switch');
await draw('a10-switch');
await page.waitForTimeout(650);
await snap('7-action');
await page.waitForFunction(() => ['result', 'deathcam'].includes(globalThis.__byc.game.phase), null, { timeout: 20000 });
// 8. GOOD BOY's, to its rescue card.
await go('a80-good-boy');
await draw('a80-good-boy');
await page.waitForFunction(() => ['result', 'deathcam'].includes(globalThis.__byc.game.phase), null, { timeout: 20000 });
await page.waitForTimeout(600);
await snap('8-rescued');
const outcome = await page.evaluate(() => globalThis.__byc.game.sim.run.outcome);

// Covers, drawn in the game's page so 'Patrick Hand' is available.
const PAL = { paper: '#F7F6F2', desk: '#E9E7E0', grid: '#D5DDE7', ink: '#33363B', danger: '#E0452B', margin: '#EBB1AC' };
const cover = (W, H, pick) => page.evaluate(async ({ W, H, imgs, PAL }) => {
  // exactly W x H: the portals ask for these sizes, not twice them
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = PAL.grid; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.strokeStyle = PAL.margin; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W * 0.06, 0); ctx.lineTo(W * 0.06, H); ctx.stroke();
  const load = (b64) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + b64; });
  // The title fills 84% of the width (capped by the height), and the title,
  // tagline and cards are centred as ONE block, so no cover has a dead band.
  const TITLE = "BRO, YOU'RE COOKED.", TAG = 'One line. One shot. Get him out.';
  ctx.font = "100px 'Patrick Hand'";
  const t = Math.min(H * 0.14, 100 * W * 0.84 / ctx.measureText(TITLE).width);
  const n = imgs.length, head = t * 2.2;
  const w = Math.min((H * 0.92 - head) * 405 / 720, (W * 0.9) / (n + (n - 1) * 0.08));
  const h = w * 720 / 405, gap = w * 0.08;
  const y0 = (H - head - h) / 2;
  ctx.fillStyle = PAL.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.font = `${t}px 'Patrick Hand'`;
  ctx.fillText(TITLE, W / 2, y0 + t * 0.95);
  ctx.fillStyle = PAL.danger;
  ctx.font = `${t * 0.42}px 'Patrick Hand'`;
  ctx.fillText(TAG, W / 2, y0 + t * 1.55);
  const x0 = (W - n * w - (n - 1) * gap) / 2;
  for (let k = 0; k < n; k++) {
    const im = await load(imgs[k]);
    const x = x0 + k * (w + gap), tilt = (k - (n - 1) / 2) * 0.03;
    ctx.save();
    ctx.translate(x + w / 2, y0 + head + h / 2); ctx.rotate(tilt);
    ctx.fillStyle = 'rgba(51,54,59,0.16)'; ctx.fillRect(-w / 2 + 5, -h / 2 + 7, w, h);
    ctx.drawImage(im, -w / 2, -h / 2, w, h);
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.5; ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
  return c.toDataURL('image/png').split(',')[1];
}, { W, H, imgs: pick.map((n) => shots[n]), PAL });

for (const [name, W, H, pick] of [
  ['cover-630x500', 630, 500, ['5-air', '2-dog', '3-bees']],
  ['cover-1920x1080', 1920, 1080, ['2-dog', '3-bees', '4-tnt']],
  ['cover-800x1200', 800, 1200, ['2-dog', '3-bees']],
]) writeFileSync(`${OUT}/${name}.png`, Buffer.from(await cover(W, H, pick), 'base64'));

console.log(`wrote ${OUT} — rescue shot: ${outcome}, page errors: ${errors.length ? errors.join('; ') : 'none'}`);
if (outcome !== 'success' || errors.length) process.exitCode = 1;
await browser.close();
