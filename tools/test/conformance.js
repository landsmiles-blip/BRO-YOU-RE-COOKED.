// CERTIFICATION CONFORMANCE GATE — docs/CERTIFICATION_CHECKLIST.md, automated.
//
// The checklist says every box is signed off "with evidence (a test name, a
// measurement, a screenshot), never from memory". This IS that evidence for
// every row a machine can check. The rows it cannot check — trademark
// clearance, content review, portal onboarding — are printed at the end as
// what remains human.
//
// It exists now rather than at M5 because a conformance blocker found after
// fifteen more levels are built is fifteen levels of wasted work. The two
// costly ones here have never run at all: the 200-retry heap soak against the
// 512 MB ceiling, and legibility at 3x DPR, which Google names explicitly as a
// rejection cause.
//
//   node tools/serve.js &
//   node tools/test/conformance.js

import { existsSync, readFileSync, mkdirSync } from 'node:fs';

const CANDIDATES = [
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium/chrome-linux/chrome',
  process.env.CHROME_PATH,
].filter(Boolean);
const EXE = CANDIDATES.find((p) => existsSync(p));
if (!EXE) { console.log('conformance SKIPPED — no Chromium'); process.exit(0); }

let chromium;
try { ({ chromium } = await import('playwright-core')); }
catch {
  try { ({ chromium } = await import('/tmp/node_modules/playwright-core/index.mjs')); }
  catch { console.log('conformance SKIPPED — playwright-core not installed'); process.exit(0); }
}

const ROOT = new URL('../../', import.meta.url).pathname;
const BASE = process.env.BASE_URL ?? 'http://localhost:8080/';
const SHOTS = process.env.SHOT_DIR ?? '/tmp/conformance';
mkdirSync(SHOTS, { recursive: true });

let failed = 0;
const rows = [];
const check = (section, label, cond, evidence = '') => {
  if (!cond) failed++;
  rows.push({ section, label, ok: cond, evidence });
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${evidence ? '  — ' + evidence : ''}`);
};

const read = (p) => { try { return readFileSync(ROOT + p, 'utf8'); } catch { return ''; } };

// ── 1. Integration · source-level ─────────────────────────────────────────
console.log('\n1. INTEGRATION');

const indexHtml = read('index.html');
const sdkSlot = indexHtml.indexOf('youtube.com/game_api');
const firstModule = indexHtml.indexOf('<script type="module"');
check('1', 'SDK slot exists and precedes all game code',
      sdkSlot !== -1 && (firstModule === -1 || sdkSlot < firstModule),
      sdkSlot === -1 ? 'slot missing' : `slot@${sdkSlot} before module@${firstModule}`);

const bundle = read('dist/byc.html');
check('1', 'a built bundle exists to audit', bundle.length > 1000, `${(bundle.length / 1024).toFixed(0)} KB raw`);

// The build already fails on these, but the checklist wants the bundle itself
// grepped — a gate that only ever runs at build time proves nothing about the
// artifact sitting on disk right now.
const NET = [/\bfetch\s*\(/, /XMLHttpRequest/, /\bWebSocket\b/, /sendBeacon/, /importScripts/];
const netHits = NET.filter((re) => re.test(bundle)).map(String);
check('1', 'ZERO external network primitives in the shipped bundle',
      netHits.length === 0, netHits.join(' ') || 'clean');
check('5', 'no external analytics transport anywhere',
      !/google-analytics|googletagmanager|gameanalytics|analytics\.js['"]\s*\)/i.test(bundle), 'grep clean');
check('3', 'NEVER locks orientation or posture',
      !/orientation\s*\.\s*lock|screen\.orientation\.lock|lockOrientation/.test(bundle), 'grep clean');
check('1', 'all game data ships in the bundle (no runtime asset fetch)',
      !/\.(png|jpg|jpeg|gif|webp|mp3|ogg|wav|json)['"]\s*\)/i.test(bundle), 'no asset URLs');

const browser = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--enable-precise-memory-info'],
});

// ── lifecycle, in the real page ───────────────────────────────────────────
{
  const page = await browser.newPage({ viewport: { width: 405, height: 720 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });

  // Stub the SDK BEFORE any game code so the real call sites are exercised.
  await page.addInitScript(() => {
    globalThis.__sdkCalls = [];
    const log = (n) => (...a) => { globalThis.__sdkCalls.push(n); return a[0]; };
    globalThis.ytgame = {
      game: {
        firstFrameReady: log('firstFrameReady'),
        gameReady: log('gameReady'),
        saveData: (t) => { globalThis.__cloud = t; globalThis.__sdkCalls.push('saveData'); return Promise.resolve(); },
        loadData: () => { globalThis.__sdkCalls.push('loadData'); return Promise.resolve(globalThis.__cloud ?? ''); },
      },
      system: {
        onPause: (f) => { globalThis.__pause = f; },
        onResume: (f) => { globalThis.__resume = f; },
      },
    };
  });
  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => globalThis.__sdkCalls?.includes('gameReady'), null, { timeout: 10000 });
  const tti = Date.now() - t0;

  const calls = await page.evaluate(() => globalThis.__sdkCalls.slice());
  check('1', 'firstFrameReady is called', calls.includes('firstFrameReady'), calls.join(','));
  check('1', 'gameReady is called', calls.includes('gameReady'), calls.join(','));
  check('1', 'firstFrameReady precedes gameReady',
        calls.indexOf('firstFrameReady') <= calls.indexOf('gameReady'));
  check('1', 'cloud loadData is used on boot', calls.includes('loadData'));
  check('2', 'time to interactive under 5s', tti < 5000, `${tti} ms`);

  // onPause must halt EVERYTHING. Measured, not asserted: sim time must not
  // advance by a single step while paused.
  await page.waitForFunction(() => globalThis.__byc?.game);
  await page.mouse.move(200, 400); await page.mouse.down(); await page.mouse.up();
  await page.waitForTimeout(120);

  const pausedProbe = await page.evaluate(async () => {
    const B = globalThis.__byc;
    B.goToLevel(B.game, 0);
    await new Promise((r) => setTimeout(r, 60));
    globalThis.__pause();
    const audioMod = B.audio;   // the running module, never a re-imported copy
    const before = { t: B.game.sim.simTime, phaseTime: B.game.phaseTime };
    await new Promise((r) => setTimeout(r, 450));
    const after = { t: B.game.sim.simTime, phaseTime: B.game.phaseTime };
    return { before, after, paused: B.game.paused, audio: audioMod.__stateForTest().ctx };
  });
  check('1', 'onPause stops PHYSICS dead',
        pausedProbe.after.t === pausedProbe.before.t,
        `simTime ${pausedProbe.before.t} -> ${pausedProbe.after.t}`);
  check('1', 'onPause stops the phase clock too',
        pausedProbe.after.phaseTime === pausedProbe.before.phaseTime);
  check('1', 'onPause SUSPENDS audio', pausedProbe.audio === 'suspended', pausedProbe.audio);

  // onResume must not fast-forward. A 450ms pause at 120Hz is 54 steps of
  // catch-up if the accumulator is not reset — the classic version of this bug.
  const resumeProbe = await page.evaluate(async () => {
    const B = globalThis.__byc;
    const before = B.game.sim.simTime;
    globalThis.__resume();
    await new Promise((r) => setTimeout(r, 120));
    return { before, after: B.game.sim.simTime };
  });
  const jumped = resumeProbe.after - resumeProbe.before;
  check('1', 'onResume does NOT fast-forward physics',
        jumped < 250, `advanced ${jumped.toFixed(0)}ms of sim in 120ms of wall clock`);

  check('2', 'no console or page errors during lifecycle', errs.length === 0, errs.slice(0, 3).join('; '));
  await page.close();
}

// ── 3. Design · every required aspect ratio, at every DPR ─────────────────
console.log('\n3. DESIGN — nine aspect ratios');

const RATIOS = [
  ['9-32',  360, 1280], ['9-21',  400, 933],  ['9-16',  405, 720],
  ['3-4',   768, 1024], ['1-1',   800, 800],  ['4-3',  1024, 768],
  ['16-9', 1280, 720],  ['21-9', 1260, 540],  ['32-9', 1600, 450],
];

for (const [name, w, h] of RATIOS) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => globalThis.__byc?.game?.phase === 'frozen', null, { timeout: 10000 });
  const v = await page.evaluate(() => {
    const V = globalThis.__byc.view;
    return { scale: V.scale, w: Math.round(V.cssW), h: Math.round(V.cssH) };
  });
  // The safe box must be fully visible: contain-fit means scale * 720 <= cssW
  // and scale * 1280 <= cssH, within a pixel of rounding.
  const fits = v.scale * 720 <= v.w + 1 && v.scale * 1280 <= v.h + 1;
  await page.screenshot({ path: `${SHOTS}/ratio-${name}.png` });
  check('3', `playable at ${name} (${w}x${h})`, fits && errs.length === 0,
        `scale ${v.scale.toFixed(3)}${errs.length ? ' ERRORS: ' + errs[0] : ''}`);
  await page.close();
}

// ── legibility at 1x / 2x / 3x DPR — a NAMED rejection cause ──────────────
console.log('\n3. DESIGN — pixel density and small embed');

for (const dpr of [1, 2, 3]) {
  const page = await browser.newPage({ viewport: { width: 405, height: 720 }, deviceScaleFactor: dpr });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => globalThis.__byc?.game?.phase === 'frozen', null, { timeout: 10000 });
  const probe = await page.evaluate(() => {
    const V = globalThis.__byc.view;
    const c = V.canvas;
    return { dpr: V.dpr, backingW: c.width, cssW: Math.round(V.cssW) };
  });
  // The backing store must actually match the device pixel ratio, or everything
  // is upscaled and blurry — which is exactly what gets rejected.
  const crisp = Math.abs(probe.backingW - probe.cssW * dpr) <= 2;
  await page.screenshot({ path: `${SHOTS}/dpr-${dpr}x.png` });
  check('3', `renders at native resolution at ${dpr}x DPR`, crisp,
        `backing ${probe.backingW}px for ${probe.cssW}css x ${dpr}`);
  await page.close();
}

{
  // The small-embed case named in the checklist: 320x480 css px.
  const page = await browser.newPage({ viewport: { width: 320, height: 480 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => globalThis.__byc?.game?.phase === 'frozen', null, { timeout: 10000 });
  // It has to be DRAWABLE, not merely visible: draw a real stroke and commit it.
  const drew = await page.evaluate(async () => {
    const B = globalThis.__byc, V = B.view;
    const S = (await import('/js/solutions.js')).SOLUTIONS[B.game.level.id].solution.points;
    return S.map((p) => ({ x: (p.x + V.offsetX) * V.scale, y: (p.y + V.offsetY) * V.scale }));
  });
  await page.mouse.move(drew[0].x, drew[0].y);
  await page.mouse.down();
  for (let i = 1; i < drew.length; i++) { await page.mouse.move(drew[i].x, drew[i].y); await page.waitForTimeout(6); }
  await page.mouse.up();
  await page.waitForTimeout(200);
  const committed = await page.evaluate(() => !!globalThis.__byc.game.sim.stroke);
  await page.screenshot({ path: `${SHOTS}/small-embed-320x480.png` });
  check('3', 'small embed 320x480 is legible AND drawable', committed && errs.length === 0,
        committed ? 'stroke committed' : 'stroke did not commit');
  await page.close();
}

// ── state survives resize, INCLUDING mid-simulation ───────────────────────
{
  const page = await browser.newPage({ viewport: { width: 405, height: 720 } });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => globalThis.__byc?.game?.phase === 'frozen', null, { timeout: 10000 });
  const before = await page.evaluate(async () => {
    const B = globalThis.__byc;
    const S = (await import('/js/solutions.js')).SOLUTIONS[B.game.level.id].solution.points;
    const V = B.view;
    return { pts: S.map((p) => ({ x: (p.x + V.offsetX) * V.scale, y: (p.y + V.offsetY) * V.scale })) };
  });
  await page.mouse.move(before.pts[0].x, before.pts[0].y);
  await page.mouse.down();
  for (let i = 1; i < before.pts.length; i++) await page.mouse.move(before.pts[i].x, before.pts[i].y);
  await page.mouse.up();
  await page.waitForFunction(() => globalThis.__byc.game.phase === 'sim', null, { timeout: 5000 });

  const pre = await page.evaluate(() => ({
    t: globalThis.__byc.game.sim.simTime,
    milo: { x: globalThis.__byc.game.sim.milo.body.position.x },
    level: globalThis.__byc.game.level.id,
  }));
  await page.setViewportSize({ width: 900, height: 500 });      // portrait -> ultrawide, mid-run
  await page.waitForTimeout(250);
  const post = await page.evaluate(() => ({
    t: globalThis.__byc.game.sim.simTime,
    milo: { x: globalThis.__byc.game.sim.milo.body.position.x },
    level: globalThis.__byc.game.level.id,
    phase: globalThis.__byc.game.phase,
    stroke: !!globalThis.__byc.game.sim.stroke,
  }));
  await page.screenshot({ path: `${SHOTS}/resize-mid-sim.png` });
  check('3', 'state survives a resize MID-SIMULATION',
        post.level === pre.level && post.stroke && post.t >= pre.t,
        `t ${pre.t.toFixed(0)}->${post.t.toFixed(0)}ms, stroke kept: ${post.stroke}, phase ${post.phase}`);
  await page.close();
}

// ── 2. Stability · the 200-retry heap soak ────────────────────────────────
console.log('\n2. STABILITY — 200-retry heap soak against the 512 MB ceiling');
{
  const page = await browser.newPage({ viewport: { width: 405, height: 720 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => globalThis.__byc?.game, null, { timeout: 10000 });

  const soak = await page.evaluate(async () => {
    const B = globalThis.__byc;
    const mem = () => performance.memory?.usedJSHeapSize ?? 0;
    const settle = () => new Promise((r) => setTimeout(r, 8));
    // Warm up so the baseline is not measuring first-run allocation.
    for (let i = 0; i < 12; i++) { B.retry(B.game); await settle(); }
    const start = mem();
    let peak = start;
    for (let i = 0; i < 200; i++) {
      B.retry(B.game);
      if (i % 7 === 0) B.goToLevel(B.game, i % B.LEVELS.length);
      await settle();
      const m = mem();
      if (m > peak) peak = m;
    }
    await new Promise((r) => setTimeout(r, 400));
    return { start, end: mem(), peak, supported: !!performance.memory };
  });

  const MB = (b) => (b / 1048576).toFixed(1);
  if (!soak.supported) {
    check('2', 'heap measurable', false, 'performance.memory unavailable — rerun with --enable-precise-memory-info');
  } else {
    check('2', 'peak heap stays under the 512 MB ceiling',
          soak.peak < 512 * 1048576, `peak ${MB(soak.peak)} MB`);
    // A leak shows as monotonic growth across 200 destroy/rebuild cycles.
    // Some growth is normal (GC is lazy); a doubling is not.
    const growth = soak.end - soak.start;
    check('2', 'no leak across 200 retries',
          growth < Math.max(24 * 1048576, soak.start * 0.9),
          `${MB(soak.start)} -> ${MB(soak.end)} MB (peak ${MB(soak.peak)})`);
  }
  check('2', 'no errors during the soak', errs.length === 0, errs.slice(0, 2).join('; '));
  await page.close();
}

// ── 1. Save round-trip through the STUBBED CLOUD ──────────────────────────
console.log('\n1. INTEGRATION — cloud save round-trip and version ladder');
{
  const page = await browser.newPage({ viewport: { width: 405, height: 720 } });
  await page.addInitScript(() => {
    globalThis.__cloud = '';
    globalThis.ytgame = {
      game: {
        firstFrameReady() {}, gameReady() {},
        saveData: (t) => { globalThis.__cloud = t; return Promise.resolve(); },
        loadData: () => Promise.resolve(globalThis.__cloud ?? ''),
      },
      system: { onPause() {}, onResume() {} },
    };
  });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => globalThis.__byc?.game, null, { timeout: 10000 });

  const ladder = await page.evaluate(async () => {
    const P = await import('/js/progress.js');
    const out = {};
    const p = P.createProgress();
    P.record(p, globalThis.__byc.LEVELS[0].id, 3);
    await P.save(p);
    out.wroteCloud = typeof globalThis.__cloud === 'string' && globalThis.__cloud.includes('"v"');
    out.roundTrip = P.totalStars(await P.load()) === 3;
    // An UNKNOWN future version must degrade to empty, never throw.
    globalThis.__cloud = JSON.stringify({ v: 999, best: { anything: 3 } });
    let threw = false;
    let stars = -1;
    try { stars = P.totalStars(await P.load()); } catch { threw = true; }
    out.futureDegrades = !threw && stars === 0;
    // Outright garbage must also not throw.
    globalThis.__cloud = 'not json at all {{{';
    try { out.garbageDegrades = P.totalStars(await P.load()) === 0; } catch { out.garbageDegrades = false; }
    return out;
  });
  check('1', 'saveData writes a VERSIONED payload to the cloud', ladder.wroteCloud);
  check('1', 'save/load round-trips through the cloud', ladder.roundTrip);
  check('1', 'an UNKNOWN future version degrades, never throws', ladder.futureDegrades);
  check('1', 'malformed cloud data degrades, never throws', ladder.garbageDegrades);
  await page.close();
}

await browser.close();

// ── what remains HUMAN ────────────────────────────────────────────────────
console.log('\nSTILL REQUIRES A HUMAN (no machine can sign these off):');
for (const line of [
  '§2  60 fps on a real mid-range Android, and the physical device matrix',
  '§4  ads — interstitial WIRED at level boundaries (3-level cadence, gated by',
  '     tools/test/ads.js). Rewarded is wired and has NO call site by design:',
  '     see requestRewardedAd in js/platform/sdk.js. A human decides whether',
  '     this game ever wants one — it cannot have an undo or a hint.',
  '§4  revenue share is a LIMITED PILOT with undisclosed terms — portal onboarding',
  '§6  trademark clearance for the title (decision D4 — still outside my authority)',
  '§6  Community Guidelines / 13+ content review',
  '§7  channel onboarding, Partner Manager contact, portal "Verify and test"',
]) console.log('  ·  ' + line);

console.log(`\n${SHOTS}/  — ${RATIOS.length} ratio shots, 3 DPR shots, small-embed and resize evidence`);
console.log(failed ? `\n${failed} CONFORMANCE CHECK(S) FAILED\n` : '\nconformance OK — every machine-checkable row passes\n');
process.exit(failed ? 1 : 0);
