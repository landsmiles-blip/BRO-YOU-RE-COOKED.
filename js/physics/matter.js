// Loads Matter.js in both environments:
//   browser — from the global installed by <script src="vendor/matter.min.js">
//   node    — required directly, so the solver harness and physics tests run headless
//
// This is the ONLY place that knows how Matter arrives. See adapter.js for the
// only place that knows what Matter *is*.

let Matter;

if (typeof globalThis.Matter !== 'undefined') {
  Matter = globalThis.Matter;
} else {
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  Matter = require('../../vendor/matter.min.js');
}

export default Matter;
