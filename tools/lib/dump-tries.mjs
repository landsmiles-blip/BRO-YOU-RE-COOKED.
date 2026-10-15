// Prints every shipped level's measured tries as JSON, for tools/lib/fit-curve.py.
import { LEVELS } from '../../js/levels.js';
import { triesOf, nounsOf } from './difficulty.js';

console.log(JSON.stringify(LEVELS.map((l) => ({ id: l.id, verb: l.verb, tries: triesOf(l.id), nouns: nounsOf(l) }))));
