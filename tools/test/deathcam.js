// THE REPLAY SHOWS WHAT HAPPENED — its two newest promises, asserted.
//
// 1. THE PLAYER'S ANCHORED LINE IS IN IT. An anchored line is a STATIC body
//    and the recorder keeps only what moves, so until 26 Oct every loss with a
//    line that held replayed without it, on every level. The owner's GOOD BOY
//    replay showed the dog standing on nothing in mid-air. Drawn here through
//    a canvas that records every call, and the line's own path must be among
//    them, at the place it was welded.
// 2. A SHUT GATE IS NAMED. Most losing lines on every plate-and-gate level end
//    with Milo waiting at a gate nothing opened, and the caption used to be
//    "HE'S STUCK" — blaming him for the plate's failure.

import { buildSim, stepSim, commitStroke, destroySim, OUTCOME } from '../../js/sim.js';
import { LEVELS } from '../../js/levels.js';
import { drawReplay } from '../../js/render/deathcam.js';

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

/** A 2D context that does nothing and remembers every call. */
function recordingContext() {
  const calls = [];
  const target = { canvas: { width: 720, height: 1280 } };
  return {
    calls,
    ctx: new Proxy(target, {
      get(t, k) {
        if (k in t) return t[k];
        return (...args) => { calls.push([k, ...args]); return { addColorStop() {} }; };
      },
      set(t, k, v) { t[k] = v; calls.push(['set:' + String(k), v]); return true; },
    }),
  };
}

console.log('\nTHE REPLAY — draws the anchored line, names a shut gate');

// GOOD BOY lost with an anchored line that does nothing useful: a hook on the
// post behind the plate, which the dog never reaches — it runs off the
// shelf's open end as if nothing had been drawn.
{
  const L = LEVELS.find((l) => l.id === 'a80-good-boy');
  const sim = buildSim(L);
  while (sim.simTime < L.freezeAt) stepSim(sim);
  const c = commitStroke(sim, [{ x: 600, y: 700 }, { x: 600, y: 760 }, { x: 640, y: 760 }]);
  let out = OUTCOME.RUNNING;
  while (out === OUTCOME.RUNNING) out = stepSim(sim);
  check('the setup: an anchored line, and a loss', c.ok && sim.stroke?.isStatic && out !== OUTCOME.SUCCESS,
        `ok ${c.ok}, static ${sim.stroke?.isStatic}, outcome ${out}`);

  const { ctx, calls } = recordingContext();
  drawReplay(ctx, sim, sim.recorder.frames.length - 1, sim.death?.label, sim.death?.culpritId);
  const p = sim.stroke.position, path = sim.stroke.strokePath ?? [];
  const at = calls.findIndex((k) => k[0] === 'translate' && Math.abs(k[1] - p.x) < 1e-6 && Math.abs(k[2] - p.y) < 1e-6);
  const drawn = at >= 0 && path.length > 1 && calls.slice(at).some((k) => k[0] === 'moveTo' &&
    Math.abs(k[1] - path[0].x) < 1e-6 && Math.abs(k[2] - path[0].y) < 1e-6);
  check('the replay draws the anchored line where it was welded', drawn,
        drawn ? `${path.length} points` : 'not drawn');
  destroySim(sim);
}

// A plate-and-gate level with nothing drawn: he waits at the gate.
{
  const L = LEVELS.find((l) => l.id === 'a9-chute');
  const sim = buildSim(L);
  let out = OUTCOME.RUNNING;
  while (out === OUTCOME.RUNNING) out = stepSim(sim);
  const gate = L.objects.find((o) => o.type === 'gate');
  check('waiting at a gate nothing opened reads THE GATE STAYED SHUT',
        out === OUTCOME.STUCK && sim.death?.label === 'THE GATE STAYED SHUT' && sim.death?.culpritId === gate.id,
        `${out}: ${sim.death?.label} (${sim.death?.culpritId})`);
  destroySim(sim);
}

console.log(failed === 0 ? '\nDEATHCAM: PASS\n' : `\nDEATHCAM: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
