// Runs every physics gate. Nothing downstream of these is trustworthy if they fail.
import { spawnSync } from 'node:child_process';

// Level data FIRST: it is the cheapest suite and it is the one that catches a
// bundle that will not boot. Everything after it assumes the levels load.
const suites = ['tools/test/level-data.js', 'tools/test/progress.js', 'tools/test/freefall.js', 'tools/test/tunnel.js', 'tools/test/shapes.js', 'tools/test/levels-solve.js'];
let failed = 0;

for (const s of suites) {
  const r = spawnSync('node', ['--import', './tools/node-matter.js', s], { stdio: 'inherit' });
  if (r.status !== 0) failed++;
}

console.log(failed === 0
  ? '═══ ALL PHYSICS GATES PASS ═══\n'
  : `═══ ${failed} SUITE(S) FAILED ═══\n`);
process.exit(failed === 0 ? 0 : 1);
