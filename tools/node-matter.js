// Node preload: puts Matter on the global before any game module evaluates.
// Used via `node --import ./tools/node-matter.js <script>`, which mirrors what
// the <script> tag does in the browser.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
globalThis.Matter = require('../vendor/matter.min.js');
