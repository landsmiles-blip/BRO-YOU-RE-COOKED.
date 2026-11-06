// Single-file build.
//
// Produces dist/byc.html — the whole game as ONE file with no external
// requests at all. That matters for three separate reasons:
//
//  1. It is the only way to put this in front of a stranger, which is the gate
//     that decides whether the mechanic is real. A game on localhost is a game
//     nobody can test.
//  2. Playables requires a self-contained bundle with NO external network
//     calls. Building that way from the start means certification is a check,
//     not a port.
//  3. The bundle is the payload measurement. If it is small here, it is small
//     on the platform.
//
// Usage:  node tools/build.js
//         node tools/build.js --check   (verify, do not write)
//
// THREE FLAVOURS OF ONE GAME:
//   dist/byc.html                 the open web and every test: NO SDK tag, so
//                                 nothing is ever requested from anywhere
//   dist/artifact.html            the same, as page contents for the publisher
//   dist/playables/index.html     the YouTube build: the Playables SDK as the
//   dist/byc-playables.zip        FIRST script, zipped with index.html at the
//                                 root — the shape the developer portal takes
//
// THE YOUTUBE BUILD DID NOT EXIST, and every gate was green. The bundle carried
// only a COMMENTED slot where the SDK goes, and the conformance check read the
// slot in the dev page rather than the file that would be uploaded — so the
// first integration requirement on Google's list ("MUST load the YouTube
// Playables SDK before any of the game code") was unmet in the only file that
// mattered, and nothing said so.

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { gzipSync, deflateRawSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

// A zip written in plain Node, so `npm run build` works on Windows, macOS and
// Linux with no `zip` binary (6 Nov 2026: this PC has none, and the old
// spawnSync('zip') call archived nothing there). Entry names are bare file
// names with forward slashes only (Playgama and YouTube both reject a
// backslash path), timestamps are fixed so the same build gives the same
// bytes, and index.html always comes first.
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function makeZip(entries) {            // entries: [{ name, data: Buffer }]
  const parts = [], central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    if (name.includes('\\') || name.includes('/') || name.startsWith('.')) {
      throw new Error(`zip entry "${name}" must be a bare file name with no path separators`);
    }
    const nameBuf = Buffer.from(name, 'utf8');
    const packed = deflateRawSync(data, { level: 9 });
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8); local.writeUInt16LE(0, 10); local.writeUInt16LE(0x21, 12);   // 1980-01-01 00:00
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(packed.length, 18); local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26); local.writeUInt16LE(0, 28);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt16LE(8, 10); cen.writeUInt16LE(0, 12); cen.writeUInt16LE(0x21, 14);
    cen.writeUInt32LE(crc, 16); cen.writeUInt32LE(packed.length, 20); cen.writeUInt32LE(data.length, 24);
    cen.writeUInt16LE(nameBuf.length, 28); cen.writeUInt32LE(offset, 42);
    parts.push(local, nameBuf, packed);
    central.push(cen, nameBuf);
    offset += local.length + nameBuf.length + packed.length;
  }
  const cdSize = central.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cdSize, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, ...central, end]);
}

const require = createRequire(import.meta.url);
let esbuild;
for (const p of ['esbuild', '/tmp/node_modules/esbuild/lib/main.js']) {
  try { esbuild = require(p); break; } catch { /* keep looking */ }
}
if (!esbuild) {
  console.error('esbuild not found. npm install esbuild');
  process.exit(1);
}

const root = new URL('..', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

const result = await esbuild.build({
  entryPoints: [fileURLToPath(new URL('js/main.js', root))],
  bundle: true, write: false, format: 'iife', target: 'es2020',
  minify: true, legalComments: 'none',
});
const gameJs = result.outputFiles[0].text;

// Matter is a UMD global the modules expect on globalThis, so it goes first.
const matter = read('vendor/matter.min.js');
const css = read('css/style.css');

// The SDK slot stays FIRST, exactly as in index.html — certification requires
// the Playables SDK to load before any game code, and the shape of the file
// should not change between the dev page and the shipped bundle.
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<title>BRO, YOU'RE COOKED.</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23F7F6F2'/%3E%3Ccircle cx='16' cy='10' r='6' fill='%23E0452B'/%3E%3Crect x='11' y='19' width='10' height='10' rx='4' fill='%2333363B'/%3E%3C/svg%3E">
<style>${css}</style>
<!-- Playables SDK slot — must precede all game code. -->
</head>
<body>
<canvas id="stage"></canvas>
<script>${matter}</script>
<script>${gameJs}</script>
</body>
</html>
`;

// ── the compliance check that makes accidental non-compliance impossible ──
const BANNED = [/\bfetch\s*\(/, /XMLHttpRequest/, /\bWebSocket\b/, /sendBeacon/, /importScripts/];
const hits = BANNED.filter((re) => re.test(gameJs)).map((re) => String(re));
if (hits.length) {
  console.error('\nBUILD FAILED — external network primitives in the bundle:');
  for (const h of hits) console.error('  ' + h);
  console.error('Playables prohibits ALL external calls, analytics included.\n');
  process.exit(1);
}

// The YouTube build: identical, except the SDK slot is filled. It is a <script
// src>, not a fetch, and it is the one load Google REQUIRES — the banned-
// primitive check above guards the game code, which this does not touch.
export const SDK_TAG = '<script src="https://www.youtube.com/game_api/v1"></script>';
const SLOT = '<!-- Playables SDK slot — must precede all game code. -->';
if (!html.includes(SLOT)) { console.error('BUILD FAILED — the SDK slot is missing from the template'); process.exit(1); }
const playables = html.replace(SLOT, SDK_TAG);

// The Playgama build: identical again, with Playgama Bridge in the same slot,
// loaded from Playgama's CDN (it is LGPL-3.0, so it is loaded, never bundled).
// It is the one build that reports runs anywhere — real players' attempts per
// level, for the difficulty curve (js/platform/playgama.js). The game code is
// unchanged, so the banned-primitive check above still holds for it; the
// network calls are the SDK's own, on a portal that expects them.
export const PLAYGAMA_TAG = '<script src="https://bridge.playgama.com/v2/stable/playgama-bridge.js"></script>';
let playgama = html.replace(SLOT, PLAYGAMA_TAG);

// RECORDED SOUND, PLAYGAMA BUILD ONLY (D15, 5 Nov 2026). Playgama refuses sound
// synthesised in code (rules 3.3.1/3.3.2), so this flavour alone carries the CC0
// recordings in assets/audio/playgama, base64 in a script ahead of the game
// (js/audio.js plays them when globalThis.BYC_SAMPLES exists). The YouTube and
// web builds never get it. The bank is data, not code, so the banned-primitive
// check above still covers everything that runs.
let audioNote = '';
const AUDIO_DIR = new URL('assets/audio/playgama/', root);
if (existsSync(new URL('manifest.json', AUDIO_DIR))) {
  const manifest = JSON.parse(readFileSync(new URL('manifest.json', AUDIO_DIR), 'utf8'));
  const bank = {};
  let audioBytes = 0;
  for (const [name, files] of Object.entries(manifest)) {
    bank[name] = files.map((f) => {
      const b = readFileSync(new URL(f, AUDIO_DIR));
      audioBytes += b.length;
      return b.toString('base64');
    });
  }
  const marker = `<script>${gameJs}</script>`;
  const at = playgama.indexOf(marker);
  if (at < 0) { console.error('BUILD FAILED — the game script is missing from the Playgama template'); process.exit(1); }
  playgama = playgama.slice(0, at) + `<script>globalThis.BYC_SAMPLES=${JSON.stringify(bank)};</script>\n` + playgama.slice(at);
  audioNote = `  playgama audio bank    ${Object.keys(bank).length} sounds, ${(audioBytes / 1024).toFixed(0)} KB (Playgama build only)\n`;
}
// The SDK reads this from beside index.html. Its own analytics on; nothing
// else configured, so ads and the rest stay off until the owner chooses.
const PLAYGAMA_CONFIG = JSON.stringify({ sendAnalyticsEvents: true }, null, 2) + '\n';

const raw = Buffer.byteLength(html);
const gz = gzipSync(html).length;

// Artifact flavour: the publish wrapper supplies <!doctype>, <head> and <body>,
// so this variant ships the page CONTENTS only. Same game, same bundle, same
// zero-request guarantee — just no outer tags to collide with the wrapper.
//
// IT IS ALSO THE PLAYTEST BUILD. The published page is what people are handed
// to play, so it sets BYC_PLAYTEST: every run is saved, losses included, and
// the level board shows runs to the first win and the time it took on each
// level, for the tester to screenshot. Nothing leaves the device.
//
// Deliberately single-theme: this is a paper-and-ink world, so every colour is
// painted explicitly (including the body ground) rather than inheriting the
// host's, which is what keeps it holding on a light or a dark host.
const artifact = `<title>BRO, YOU'RE COOKED.</title>
<style>
html, body {
  width: 100%; height: 100%;
  margin: 0; padding: 0;
  overflow: hidden;
  background: #F7F6F2;
  overscroll-behavior: none;
  touch-action: none;
  -webkit-user-select: none; user-select: none;
  -webkit-tap-highlight-color: transparent;
}
#stage { display: block; width: 100%; height: 100%; background: #F7F6F2; }
</style>
<canvas id="stage"></canvas>
<script>globalThis.BYC_PLAYTEST = true;</script>
<script>${matter}</script>
<script>${gameJs}</script>
`;

let zipNote = '';
if (!process.argv.includes('--check')) {
  mkdirSync(new URL('dist/playables/', root), { recursive: true });
  mkdirSync(new URL('dist/web/', root), { recursive: true });
  mkdirSync(new URL('dist/playgama/', root), { recursive: true });
  writeFileSync(new URL('dist/playgama/index.html', root), playgama);
  writeFileSync(new URL('dist/playgama/playgama-bridge-config.json', root), PLAYGAMA_CONFIG);
  writeFileSync(new URL('dist/byc.html', root), html);
  writeFileSync(new URL('dist/artifact.html', root), artifact);
  writeFileSync(new URL('dist/playables/index.html', root), playables);
  // The open web (itch.io, any static host): the standalone page, named the
  // way every HTML5 host expects. No SDK — off YouTube it would only be a
  // request to a page that has no ytgame to give.
  writeFileSync(new URL('dist/web/index.html', root), html);

  // index.html at the ROOT of each archive, nothing else in it: the whole game
  // is one file (the Playgama one adds its config). makeZip writes bare names
  // and fixed timestamps, so the same build always produces the same archive.
  for (const [name, dir, what] of [
    ['byc-playables.zip', 'playables', 'YouTube upload'],
    ['byc-web.zip', 'web', 'open web: itch.io or any static host'],
    ['byc-playgama.zip', 'playgama', 'Playgama: real players\' attempts'],
  ]) {
    const zip = new URL(`dist/${name}`, root);
    if (existsSync(zip)) rmSync(zip);
    const names = ['index.html'];
    if (dir === 'playgama') names.push('playgama-bridge-config.json');
    const entries = names.map((n) => ({ name: n, data: readFileSync(new URL(`dist/${dir}/${n}`, root)) }));
    writeFileSync(zip, makeZip(entries));
    zipNote += `  → dist/${name} (${what}: index.html at the root, ${statSync(zip).size} bytes)\n`;
  }
}

console.log(`\nsingle-file build`);
console.log(`  no external requests   verified (${BANNED.length} primitives checked)`);
console.log(`  raw                    ${(raw / 1024).toFixed(1)} KB`);
console.log(`  gzipped                ${(gz / 1024).toFixed(1)} KB`);
console.log(`  vs 15 MiB recommended  ${((gz / (15 * 1024 * 1024)) * 100).toFixed(2)}%`);
if (audioNote) process.stdout.write(audioNote);
console.log(process.argv.includes('--check')
  ? '  (check only, nothing written)\n'
  : '  → dist/byc.html (standalone)\n  → dist/artifact.html (publish flavour)\n'
    + '  → dist/playables/index.html (YouTube: SDK first)\n'
    + '  → dist/playgama/ (Playgama Bridge first, + its config)\n' + zipNote);
