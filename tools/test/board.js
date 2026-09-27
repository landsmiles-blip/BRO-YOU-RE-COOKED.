// LEVEL BOARD GATE.
//
// The board is the first UI in this game with HIT REGIONS, which is a new class
// of bug: input and rendering can disagree about where a thing is, and the only
// symptom is a tap that does nothing. It is the same failure the stroke
// renderer had when it drew the line somewhere the physics was not.
//
// It also puts a BUTTON inside the drawing surface, so this proves the button
// cannot swallow a stroke the player meant to draw.

import { existsSync } from 'node:fs';
const CANDIDATES = [
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium/chrome-linux/chrome',
  process.env.CHROME_PATH,
].filter(Boolean);
const EXE = CANDIDATES.find((p) => existsSync(p));
if (!EXE) { console.log('board test SKIPPED — no Chromium'); process.exit(0); }
let chromium;
try { ({ chromium } = await import('playwright-core')); }
catch {
  try { ({ chromium } = await import('/tmp/node_modules/playwright-core/index.mjs')); }
  catch { console.log('board test SKIPPED — playwright-core not installed'); process.exit(0); }
}

const BASE = process.env.BASE_URL ?? 'file:///home/user/BRO-YOU-RE-COOKED./dist/byc.html';
let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
console.log('\nLEVEL BOARD');

const errors = [];
for (const [label, w, h] of [['9:16', 405, 720], ['9:32', 360, 1280], ['1:1', 800, 800], ['32:9', 1600, 450]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on('pageerror', (e) => errors.push(`${label}: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => globalThis.__byc?.game?.phase === 'frozen', null, { timeout: 10000 });

  // The button must OPEN the board — found by asking the page where it drew it.
  const btn = await page.evaluate(() => {
    const V = globalThis.__byc.view;
    const s = Math.max(22, Math.min(V.cssW, V.cssH) * 0.045);
    const pad = Math.max(8, Math.min(V.cssW, V.cssH) * 0.022);
    return { x: V.cssW - pad - s / 2, y: pad + s / 2 };
  });
  await page.mouse.click(btn.x, btn.y);
  await page.waitForTimeout(120);
  const opened = await page.evaluate(() => globalThis.__byc.game.phase);
  check(`${label}: the button opens the board`, opened === 'select', opened);

  // Every card must be reachable, and land on the level it shows.
  // Ask the PAGE where it drew the card. Importing levelselect.js here fetches
  // a second copy of the module whose `view` is still 0x0, which lays the board
  // out somewhere the board is not.
  const last = await page.evaluate(() => {
    const B = globalThis.__byc, box = B.boardBox;
    if (!box || !box.cards.length) return null;
    const c = box.cards[B.LEVELS.length - 1];
    if (!c) return null;
    return { x: c.x + c.w / 2, y: c.y + c.h / 2, id: B.LEVELS[B.LEVELS.length - 1].id, n: B.LEVELS.length };
  }).catch(() => null);

  if (!last) {
    check(`${label}: board layout is reachable`, false, 'could not import levelselect');
  } else {
    await page.mouse.click(last.x, last.y);
    await page.waitForTimeout(200);
    const now = await page.evaluate(() => ({
      id: globalThis.__byc.game.level.id, phase: globalThis.__byc.game.phase,
    }));
    check(`${label}: tapping the LAST card reaches level ${last.n}`,
          now.id === last.id && now.phase !== 'select', `${now.id} (${now.phase})`);
  }
  await page.close();
}

// The button lives inside the drawing surface. Prove it cannot eat a stroke.
{
  const page = await browser.newPage({ viewport: { width: 405, height: 720 } });
  page.on('pageerror', (e) => errors.push('draw: ' + e.message));
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => globalThis.__byc?.game?.phase === 'frozen', null, { timeout: 10000 });
  const pts = await page.evaluate(async () => {
    const B = globalThis.__byc, V = B.view;
    const S = (await import('/js/solutions.js')).SOLUTIONS[B.game.level.id].solution.points;
    return S.map((p) => ({ x: (p.x + V.offsetX) * V.scale, y: (p.y + V.offsetY) * V.scale }));
  });
  await page.mouse.move(pts[0].x, pts[0].y);
  await page.mouse.down();
  for (let i = 1; i < pts.length; i++) { await page.mouse.move(pts[i].x, pts[i].y); await page.waitForTimeout(5); }
  await page.mouse.up();
  await page.waitForTimeout(200);
  const st = await page.evaluate(() => ({ phase: globalThis.__byc.game.phase, stroke: !!globalThis.__byc.game.sim.stroke }));
  check('a normal stroke still draws — the button does not swallow it',
        st.stroke && st.phase !== 'select', `${st.phase}, stroke ${st.stroke}`);

  // And the certified solutions must not START under the button.
  const clash = await page.evaluate(async () => {
    const B = globalThis.__byc, V = B.view;
    const S = (await import('/js/solutions.js')).SOLUTIONS;
    const s = Math.max(22, Math.min(V.cssW, V.cssH) * 0.045);
    const pad = Math.max(8, Math.min(V.cssW, V.cssH) * 0.022);
    const box = { x: V.cssW - pad - s - 8, y: pad - 8, w: s + 16, h: s + 16 };
    const bad = [];
    for (const lvl of B.LEVELS) {
      const p = S[lvl.id]?.solution?.points?.[0];
      if (!p) continue;
      const sx = (p.x + V.offsetX) * V.scale, sy = (p.y + V.offsetY) * V.scale;
      if (sx >= box.x && sx <= box.x + box.w && sy >= box.y && sy <= box.y + box.h) bad.push(lvl.id);
    }
    return bad;
  });
  check('no certified solution STARTS under the button', clash.length === 0, clash.join(',') || 'none');
  await page.close();
}

check('no page errors', errors.length === 0, errors.slice(0, 3).join('; '));
await browser.close();
console.log(failed ? `\n${failed} board check(s) FAILED\n` : '\nboard OK\n');
process.exit(failed ? 1 : 0);
