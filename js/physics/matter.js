// Matter comes from the global, in every environment.
//
// This file used to detect its environment and lazily require() Matter under
// Node, which meant top-level await and a node: import inside a browser
// module — so it could not be bundled at all. Bundling is not optional: the
// Playables build must be one self-contained file with no external requests.
//
// One job instead: read the global. Whoever boots is responsible for putting
// it there — a <script> tag in the browser, tools/node-matter.js under Node.

const Matter = globalThis.Matter;

if (!Matter) {
  throw new Error(
    'Matter.js not loaded. Browser: include vendor/matter.min.js before the ' +
    'game. Node: run with --import ./tools/node-matter.js',
  );
}

export default Matter;
