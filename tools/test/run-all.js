// Runs every physics gate. Nothing downstream of these is trustworthy if they fail.
import { spawnSync } from 'node:child_process';

const suites = ['tools/test/freefall.js', 'tools/test/tunnel.js'];
let failed = 0;

for (const s of suites) {
  const r = spawnSync('node', [s], { stdio: 'inherit' });
  if (r.status !== 0) failed++;
}

console.log(failed === 0
  ? '═══ ALL PHYSICS GATES PASS ═══\n'
  : `═══ ${failed} SUITE(S) FAILED ═══\n`);
process.exit(failed === 0 ? 0 : 1);
