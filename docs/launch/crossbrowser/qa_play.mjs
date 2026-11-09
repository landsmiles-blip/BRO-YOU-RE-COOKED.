// Plays level 1 through Playgama's QA tool (developer.playgama.com/qa-tool) and prints its Requirements List ticks and log, 9 Nov 2026.
// The QA link comes from the Playgama MCP tool get_local_game_qa_tool_link (never build one by hand); the game is served by
// `node tools/serve.js` on :8080. Needs CHROME_PATH. The two --disable-features flags let the https harness frame an http://localhost
// game (the owner's own Chrome shows a blank frame for that: Chrome's local-network protection; cause UNVERIFIED).
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const { chromium } = require('playwright-core');
const OUT = process.argv[2];
const LINK = 'https://developer.playgama.com/qa-tool/link?url=http%253A%252F%252Flocalhost%253A8080%252Fdist%252Fplaygama%252Findex.html&sessionId=byc-qa-play';
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH, args: ['--disable-features=LocalNetworkAccessChecks,BlockInsecurePrivateNetworkRequests'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const page = await ctx.newPage();
await page.goto(LINK, { waitUntil: 'load', timeout: 45000 });
await page.waitForTimeout(8000);
const sel = page.locator('select').first();
const game = page.frames().find((f) => f.url().includes('/dist/playgama/'));
const NL = String.fromCharCode(10);
const state = async () => await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('input[type=checkbox]').forEach((c) => { const t = (c.closest('label') || c.parentElement)?.innerText?.trim().replace(/\s+/g, ' ').slice(0, 70); out.push((c.checked ? '[x] ' : '[ ] ') + t); });
  return out;
});
await sel.selectOption({ label: 'Requirements List' });
await page.waitForTimeout(1500);
console.log('START' + NL + (await state()).filter((l) => l.startsWith('[x]')).join(NL));
const gs = async () => game ? await game.evaluate(() => globalThis.__byc ? globalThis.__byc.game.phase + ' lvl=' + globalThis.__byc.game.level?.id : 'no __byc') : 'no frame';
console.log('phase', await gs());
async function stroke() {
  await page.mouse.move(535, 572); await page.mouse.down();
  for (let i = 1; i <= 28; i++) await page.mouse.move(535 + i * 6.2, 572 + Math.sin(i / 3) * 3);
  await page.mouse.up();
}
for (let round = 1; round <= 4; round++) {
  await stroke();
  await page.waitForTimeout(6500);
  console.log('round', round, 'phase after stroke:', await gs());
  await page.screenshot({ path: OUT + '/qaplay-' + round + '.png' });
  await page.mouse.click(590, 450);          // tap the result card for the next level
  await page.waitForTimeout(3000);
  console.log('round', round, 'phase after tap:', await gs());
}
const st = await state();
console.log(NL + 'CHECKLIST NOW' + NL + st.join(NL));
await sel.selectOption({ label: 'Logs' });
await page.waitForTimeout(1000);
const logs = (await page.evaluate(() => document.body.innerText)).split(NL).filter((l) => /\[(bridge|platform|storage|advertisement|ads?)/i.test(l) || /ad|interstitial|reward/i.test(l)).slice(-40);
console.log(NL + 'LOG LINES' + NL + logs.join(NL));
await browser.close();
