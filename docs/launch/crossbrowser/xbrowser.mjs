// Cross-browser smoke test of dist/playgama/index.html (the page Playgama runs), 9 Nov 2026.
// Run from the repo root with `node tools/serve.js` already running on :8080 and `npm run build` done:
//   node node_modules/playwright-core/cli.js install firefox webkit      (once)
//   CHROME_PATH=<chrome.exe> node docs/launch/crossbrowser/xbrowser.mjs <screenshot dir>
// Not part of `npm test` (needs browsers and a server); lives here, not in tools/, on purpose.
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const { chromium, firefox, webkit } = require('playwright-core');
import { mkdirSync } from 'node:fs';
const OUT = process.argv[2] ?? '.';
mkdirSync(OUT, { recursive: true });
const URL = process.env.URL ?? 'http://127.0.0.1:8080/dist/playgama/index.html';
const engines = (process.env.ENGINES ?? 'chromium,firefox,webkit').split(',');
const VIEWS = [['portrait', 405, 720], ['landscape', 1280, 720], ['square', 800, 800]];
const rows = [];
for (const name of engines) {
  const type = { chromium, firefox, webkit }[name];
  let browser;
  try {
    const opts = { headless: process.env.HEADED ? false : true };
    if (name === 'chromium' && process.env.CHROME_PATH) opts.executablePath = process.env.CHROME_PATH;
    browser = await type.launch(opts);
  }
  catch (e) { rows.push({ engine: name, error: 'launch failed: ' + e.message.split('\n')[0] }); continue; }
  for (const [vn, w, h] of VIEWS) {
    const r = { engine: name, view: vn, size: `${w}x${h}` };
    const errs = [], failed = [];
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message.split('\n')[0]));
    page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });
    page.on('requestfailed', (q) => failed.push(q.url().slice(0, 90)));
    try {
      await page.goto(URL, { waitUntil: 'load', timeout: 30000 });
      await page.waitForFunction(() => globalThis.__byc?.game?.phase === 'frozen', null, { timeout: 20000 });
      r.boot = 'frozen';
      // frame rate over 3 s of rAF
      r.fps = await page.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else res(+(n / ((performance.now() - t0) / 1000)).toFixed(1)); }; requestAnimationFrame(f); }));
      r.audioBefore = await page.evaluate(() => JSON.stringify(globalThis.__byc.audio.__stateForTest()));
      await page.screenshot({ path: `${OUT}/${name}-${vn}-frozen.png` });
      // draw a finger-like stroke across the middle, then watch the run
      const cx = w / 2, cy = h * 0.55;
      await page.mouse.move(cx - 90, cy); await page.mouse.down();
      for (let i = 1; i <= 30; i++) await page.mouse.move(cx - 90 + i * 6, cy + Math.sin(i / 3) * 4, { steps: 1 });
      await page.mouse.up();
      await page.waitForTimeout(6000);
      r.phaseAfter = await page.evaluate(() => globalThis.__byc.game.phase);
      r.audioAfter = await page.evaluate(() => JSON.stringify(globalThis.__byc.audio.__stateForTest()));
      await page.screenshot({ path: `${OUT}/${name}-${vn}-after.png` });
    } catch (e) { r.error = e.message.split('\n')[0]; }
    r.errors = errs.length ? errs.slice(0, 4) : 'none';
    r.failedRequests = failed.length ? failed.slice(0, 3) : 'none';
    rows.push(r);
    await page.close();
  }
  await browser.close();
}
console.log(JSON.stringify(rows, null, 1));
