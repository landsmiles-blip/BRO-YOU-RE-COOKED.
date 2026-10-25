#!/bin/bash
# SessionStart hook — make a fresh cloud session able to BUILD and to LOOK.
#
# Every cloud session starts on a new machine, and two tools live outside the
# repo: esbuild (tools/build.js) and playwright-core (every browser test). Both
# are resolved from /tmp/node_modules, which a new machine does not have.
#
# THE DANGEROUS HALF IS THE SILENT ONE. Without playwright-core, filmstrip,
# frozen, conformance, board and audio all print "SKIPPED" and exit 0 — so on a
# fresh machine the visual gates read as green while looking at nothing. This
# hook is what keeps "look at the running game" true from the first minute.
#
# playwright-core is pinned to 1.56: that release drives Chromium build 1194,
# which is the browser preinstalled in /opt/pw-browsers. A different minor
# expects a different build and would try to download one.
#
# esbuild is pinned too (0.28.2, the version every build so far was made with):
# unpinned, a fresh machine took whatever was newest that day, so two sessions
# could ship byte-different bundles from the same commit.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PREFIX=/tmp
ESBUILD=0.28.2
have() { [ -f "$PREFIX/node_modules/$1/package.json" ]; }
esb_ok() {
  have esbuild && node -e "process.exit(require('$PREFIX/node_modules/esbuild/package.json').version === '$ESBUILD' ? 0 : 1)"
}
pw_ok() {
  have playwright-core && node -e "process.exit(require('$PREFIX/node_modules/playwright-core/package.json').version.startsWith('1.56.') ? 0 : 1)"
}

if esb_ok && pw_ok; then
  echo "session-start: esbuild $ESBUILD + playwright-core 1.56 already present"
  exit 0
fi

npm install --prefix "$PREFIX" --no-audit --no-fund --loglevel=error "esbuild@$ESBUILD" playwright-core@1.56
echo "session-start: installed esbuild $ESBUILD + playwright-core 1.56 into $PREFIX/node_modules"
