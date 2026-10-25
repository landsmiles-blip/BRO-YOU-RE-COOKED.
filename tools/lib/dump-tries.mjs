// Prints every shipped level's measured difficulty as JSON, for tools/lib/fit-curve.py:
// where it sits (chapter, slot, role), its simulated tries, and how many
// hand-robust winning strokes that number rests on — the count that says how
// much to trust it.
import { LEVELS, slotOf } from '../../js/levels.js';
import { triesOf, nounsOf } from './difficulty.js';
import { SOLUTIONS } from '../../js/solutions.js';

console.log(JSON.stringify(LEVELS.map((l) => {
  const s = slotOf(l.id);
  return {
    id: l.id, verb: l.verb, chapter: s?.chapter ?? null, k: s?.k ?? null, role: s?.role ?? null,
    tries: triesOf(l.id), robust: SOLUTIONS[l.id]?.robust ?? null, nouns: nounsOf(l),
  };
})));
