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

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { gzipSync } from 'node:zlib';

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
  entryPoints: [new URL('js/main.js', root).pathname],
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
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23E8E2D6'/%3E%3Ccircle cx='16' cy='10' r='6' fill='%23E0452B'/%3E%3Crect x='11' y='19' width='10' height='10' rx='4' fill='%232A2622'/%3E%3C/svg%3E">
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

const raw = Buffer.byteLength(html);
const gz = gzipSync(html).length;

// Artifact flavour: the publish wrapper supplies <!doctype>, <head> and <body>,
// so this variant ships the page CONTENTS only. Same game, same bundle, same
// zero-request guarantee — just no outer tags to collide with the wrapper.
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
  background: #E8E2D6;
  overscroll-behavior: none;
  touch-action: none;
  -webkit-user-select: none; user-select: none;
  -webkit-tap-highlight-color: transparent;
}
#stage { display: block; width: 100%; height: 100%; background: #E8E2D6; }
</style>
<canvas id="stage"></canvas>
<script>${matter}</script>
<script>${gameJs}</script>
`;

if (!process.argv.includes('--check')) {
  mkdirSync(new URL('dist/', root), { recursive: true });
  writeFileSync(new URL('dist/byc.html', root), html);
  writeFileSync(new URL('dist/artifact.html', root), artifact);
}

console.log(`\nsingle-file build`);
console.log(`  no external requests   verified (${BANNED.length} primitives checked)`);
console.log(`  raw                    ${(raw / 1024).toFixed(1)} KB`);
console.log(`  gzipped                ${(gz / 1024).toFixed(1)} KB`);
console.log(`  vs 15 MiB recommended  ${((gz / (15 * 1024 * 1024)) * 100).toFixed(2)}%`);
console.log(process.argv.includes('--check')
  ? '  (check only, nothing written)\n'
  : '  → dist/byc.html (standalone)\n  → dist/artifact.html (publish flavour)\n');
