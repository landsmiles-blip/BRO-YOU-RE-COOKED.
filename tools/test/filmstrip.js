// FILMSTRIP — renders real gameplay to images a human (or I) can look at.
//
// This exists because two unplayable builds shipped while every numeric gate
// reported green. The reason is simple and was entirely my fault: every
// screenshot I had ever taken was of the FROZEN TABLEAU, the still frame
// before anything moves, and everything else was numbers out of a headless
// simulation. A vibrating line, a line that shrinks on release, and a line
// that will not sit still all satisfy an assertion about positions. None of
// them survive one glance at the running game.
//
// So: drive the built bundle, play each level with a PLAYER-SHAPED stroke
// (dense and wavering, not the 3-point ideal that collapses to a single rigid
// box), capture frames across the SIMULATION, and tile them into one image per
// level. Then read those images before claiming anything works.
//
//   node tools/serve.js &
//   node tools/test/filmstrip.js            # all shipping levels
//   node tools/test/filmstrip.js a1-wall    # just one
//
// Output: /tmp/film-<level>.png

import { existsSync, mkdirSync } from 'node:fs';
import { handDrawn } from './lib/hand.js';
import { SOLUTIONS } from '../../js/solutions.js';

const OUT = process.env.FILM_DIR ?? '/tmp';
const BASE = process.env.BASE_URL ?? 'file:///home/user/BRO-YOU-RE-COOKED./dist/byc.html';
// Capture has to outlast the run. At 8 x 230ms it covered 1.4s while verified
// solutions take up to 4.5s, so every filmstrip cut away before the ending and
// reported "running" — the tool could not show me a win even when one happened.
const FRAMES = 8;
const STEP_MS = 620;          // 8 frames -> ~3.7s after the draw
const MAX_WAIT_MS = 9000;
const VIEW = { width: 405, height: 720 };

const CANDIDATES = [
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium/chrome-linux/chrome',
  process.env.CHROME_PATH,
].filter(Boolean);

const EXE = CANDIDATES.find((p) => existsSync(p));
if (!EXE) { console.log('filmstrip SKIPPED — no Chromium'); process.exit(0); }

let chromium;
try { ({ chromium } = await import('playwright-core')); }
catch {
  try { ({ chromium } = await import('/tmp/node_modules/playwright-core/index.mjs')); }
  catch { console.log('filmstrip SKIPPED — playwright-core not installed'); process.exit(0); }
}

mkdirSync(OUT, { recursive: true });

/**
 * The stroke this filmstrip draws, per level.
 *
 * It used to be a hand-authored table of "the stroke a person would plausibly
 * draw". That was the second-biggest flaw in this tool, and it nearly cost two
 * working levels: MOST PLAUSIBLE STROKES LOSE. A filmstrip of a loss is a
 * picture of a legitimate game state and looks exactly like a picture of a
 * broken level. I read a losing A9 stroke as a dead level and was one edit away
 * from "fixing" a level that was fine.
 *
 * So the stroke comes from tools/solver/representative.js: a stroke the sweep
 * proved wins AND that keeps winning under three independent hand tremors.
 * These filmstrips therefore show the game being WON. A level that does not
 * reach its goal in one of them is a real regression, not a bad guess by me.
 */
/**
 * FILM_IDLE=1 films the LOSS instead of the win.
 *
 * Every filmstrip in this project's history filmed a win, and the losing screen
 * is what a player sees most of the time. The one failure capture anybody ever
 * took found a death cam drawing the player's own line as a fixed 80-pixel dash
 * with no lethal zones and no goal — the screen whose whole job is to explain,
 * explaining nothing. There was no way to ask for that capture; now there is.
 */
const IDLE = process.env.FILM_IDLE === '1';

function strokeFor(id) {
  if (IDLE) return null;
  const sol = SOLUTIONS[id]?.solution;
  if (!sol) return null;
  // Same hand model the solver used to certify it — see tools/test/lib/hand.js.
  return handDrawn(sol.points, 8, 5.5);
}

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const only = process.argv.slice(2).find((a) => !a.startsWith('--'));

const regressions = [];
const page = await browser.newPage({ viewport: VIEW, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(BASE, { waitUntil: 'load' });
await page.waitForFunction(() => globalThis.__byc?.game, null, { timeout: 10000 });

const levelIds = await page.evaluate(() => globalThis.__byc.LEVELS.map((l) => l.id));
const targets = only ? levelIds.filter((id) => id === only) : levelIds;

const toScreen = (wx, wy) => page.evaluate(([x, y]) => {
  const v = globalThis.__byc.view;
  return { x: (x + v.offsetX) * v.scale, y: (y + v.offsetY) * v.scale };
}, [wx, wy]);

for (const id of targets) {
  // Jump to the level and wait for the freeze.
  // goToLevel, not repeated nextLevel: the last level deliberately no longer
  // wraps to the first, so walking the list by nextLevel now dead-ends on the
  // ending screen instead of cycling round.
  await page.evaluate((target) => {
    const B = globalThis.__byc;
    B.goToLevel(B.game, B.LEVELS.findIndex((l) => l.id === target));
  }, id);
  await page.waitForFunction(() => globalThis.__byc.game.phase === 'frozen', null, { timeout: 10000 });

  const shots = [];
  shots.push({ label: 'frozen', buf: await page.screenshot() });

  // Draw it the way a finger would.
  const world = strokeFor(id);
  if (!world && !IDLE) { console.log(`${id.padEnd(12)} SKIPPED — no verified solution; run tools/solver/representative.js`); continue; }
  if (IDLE) {
    // The idle run has no stroke to release, and `release()` in game.js is the
    // commit path — it cannot run without one. PHASE is already exported on
    // __byc for the board gate, so the same LIVE object does it here: this is
    // the real frozen-to-running transition, not a simulation of one.
    await page.evaluate(() => {
      const b = globalThis.__byc;
      b.game.phase = b.PHASE.SIM;
      b.game.phaseTime = 0;
    });
    shots.push({ label: 'released', buf: await page.screenshot() });
  }
  const pts = [];
  if (world) {
    for (const w of world) pts.push(await toScreen(w.x, w.y));
    await page.mouse.move(pts[0].x, pts[0].y);
    await page.mouse.down();
    for (let i = 1; i < pts.length; i++) { await page.mouse.move(pts[i].x, pts[i].y); await page.waitForTimeout(10); }
    shots.push({ label: 'drawing', buf: await page.screenshot() });
    await page.mouse.up();
  }

  const info = await page.evaluate(() => {
    const g = globalThis.__byc.game;
    const b = g.sim.stroke;
    return {
      committed: !!b,
      parts: b ? (b.parts.length > 1 ? b.parts.length - 1 : 1) : 0,
      anchors: g.sim.anchors.length,
      isStatic: b ? b.isStatic : null,
    };
  });

  // Frames across the actual run, stopping as soon as it concludes so the last
  // frame is always the ENDING rather than an arbitrary moment mid-flight.
  const readOutcome = () => page.evaluate(() => ({
    outcome: globalThis.__byc.game.sim.run.outcome,
    phase: globalThis.__byc.game.phase,
    death: globalThis.__byc.game.sim.death?.label ?? null,
  }));

  let outcome = await readOutcome();
  let waited = 0;
  for (let i = 0; i < FRAMES - 2 && outcome.outcome === 'running' && waited < MAX_WAIT_MS; i++) {
    await page.waitForTimeout(STEP_MS);
    waited += STEP_MS;
    outcome = await readOutcome();
    shots.push({ label: `t+${(waited / 1000).toFixed(1)}s`, buf: await page.screenshot() });
  }
  // If it is still going, keep waiting without filming, then film the ending.
  while (outcome.outcome === 'running' && waited < MAX_WAIT_MS) {
    await page.waitForTimeout(STEP_MS);
    waited += STEP_MS;
    outcome = await readOutcome();
  }
  shots.push({ label: `END ${outcome.outcome}`, buf: await page.screenshot() });

  // Tile the frames into one contact sheet, using a throwaway page as a canvas.
  const sheet = await browser.newPage({ viewport: { width: VIEW.width * shots.length, height: VIEW.height + 26 } });
  await sheet.setContent('<canvas id="c"></canvas><style>body{margin:0;background:#111}</style>');
  await sheet.evaluate(async ({ frames, w, h }) => {
    const c = document.getElementById('c');
    c.width = w * frames.length; c.height = h + 26;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < frames.length; i++) {
      const img = new Image();
      await new Promise((r) => { img.onload = r; img.src = 'data:image/png;base64,' + frames[i].b64; });
      ctx.drawImage(img, i * w, 26, w, h);
      ctx.fillStyle = '#fff';
      ctx.font = '600 14px system-ui, sans-serif';
      ctx.fillText(frames[i].label, i * w + 8, 18);
      ctx.strokeStyle = '#444';
      ctx.strokeRect(i * w, 26, w, h);
    }
  }, { frames: shots.map((s) => ({ label: s.label, b64: s.buf.toString('base64') })), w: VIEW.width, h: VIEW.height });

  const file = `${OUT}/film-${id}.png`;
  await sheet.locator('#c').screenshot({ path: file });
  await sheet.close();

  const won = outcome.outcome === 'success';
  if (!won && !IDLE) regressions.push(`${id} -> ${outcome.outcome}${outcome.death ? ' "' + outcome.death + '"' : ''}`);
  console.log(
    `${won ? 'WIN ' : 'FAIL'} ${id.padEnd(12)} parts=${String(info.parts).padStart(2)} ` +
    `anchors=${String(info.anchors).padStart(2)} static=${String(info.isStatic).padEnd(5)} ` +
    `-> ${outcome.outcome}${outcome.death ? ' "' + outcome.death + '"' : ''}   ${file}`,
  );
}

await browser.close();
if (errors.length) { console.log('\nPAGE ERRORS: ' + errors.join('; ')); process.exit(1); }
if (regressions.length) {
  // Every stroke filmed here is a CERTIFIED winner: the sweep found it and it
  // survived three independent hand tremors. Losing one in the real browser
  // means the browser build and the simulation have diverged.
  console.log('\nREGRESSIONS (certified winners that lost in the browser):');
  for (const r of regressions) console.log('  ' + r);
  process.exit(1);
}
console.log(`\nall ${targets.length} filmed levels WON`);
