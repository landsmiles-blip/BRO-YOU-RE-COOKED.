// Causality tracking — Bible §3.3.
//
// The difference between a puzzle and a guessing game. At the moment of death
// THREE things are in motion: Milo, the hazard, and the player's own drawing,
// which has mass and may have moved. If the player cannot attribute failure
// they cannot form a new hypothesis, and the learn-retry loop silently
// degrades into "draw something different and hope".
//
// This records the chain, not just the outcome:  stroke -> ball -> Milo.

const HISTORY = 64;

export function createCausality() {
  return { contacts: [], strokeTouched: new Set(), lastMiloContactAt: -Infinity };
}

/** Record every contact involving Milo or the player's stroke. */
export function noteContact(c, bodyA, bodyB, simTimeMs, speed) {
  // BY THE BODY, NOT THE PART. Matter reports a compound body's contacts on
  // the PART that touched, and only the whole body carries a game id — so a
  // line of more than one segment, which is nearly every line a hand draws,
  // touched nothing as far as this file knew, and a rock it had deflected
  // into him replayed as "NOTHING STOPPED IT".
  const idA = (bodyA.parent ?? bodyA).gameId, idB = (bodyB.parent ?? bodyB).gameId;
  if (idA === 'stroke' || idB === 'stroke') {
    const other = idA === 'stroke' ? idB : idA;
    if (other) c.strokeTouched.add(other);
  }
  if (idA === 'milo' || idB === 'milo') {
    const other = idA === 'milo' ? idB : idA;
    c.lastMiloContactAt = simTimeMs;
    c.contacts.push({ id: other ?? '?', t: simTimeMs, speed });
    if (c.contacts.length > HISTORY) c.contacts.shift();
  }
}

/**
 * Explain a death in one short label the player can act on.
 * Nine or ten of these cover essentially every failure in the game.
 *
 * `stroke` is { drawn, anchored, fell } — whether the player drew at all,
 * whether it welded to anything, and how far it has since travelled.
 */
export function explain(c, reason, culpritId, stroke = null, cause = null) {
  // A LOST DOG OUTRANKS EVERY EXPLANATION BELOW, the unanchored line
  // included: whatever the line did, the run ended because the dog was lost,
  // and that is the thing the player has to fix.
  if (cause === 'dog')     return { label: 'NOT THE DOG!',    culpritId };
  if (cause === 'dog-ran') return { label: 'THE DOG RAN OFF', culpritId };

  // THE UNANCHORED DEATH OUTRANKS EVERY OTHER EXPLANATION.
  //
  // If the line was never attached to anything, it fell, and nothing it might
  // otherwise have done matters — the player needs to know THAT, not that the
  // rock got through. Measured on A1: a stroke drawn in mid-air under the ball,
  // which is where anyone would draw, gets zero anchors and Milo dies at
  // 1017ms. The game's most natural action failed with no explanation, so the
  // player's next hypothesis was "draw somewhere else" when the correct one is
  // "draw touching something".
  //
  // Gated on the stroke having actually MOVED, so a deliberately unanchored
  // stroke that did its job before toppling is not mislabelled.
  if (stroke?.drawn && !stroke.anchored && stroke.fell > 40) {
    return { label: 'NOTHING HELD IT UP', culpritId: 'stroke' };
  }

  // HE WAITED AT A GATE NOTHING OPENED. The commonest loss on every
  // plate-and-gate level, and it used to read "HE'S STUCK" — blaming him, when
  // what failed is whatever was meant to press the plate (sim.js, shutGateAt).
  if (cause === 'gate')     return { label: 'THE GATE STAYED SHUT', culpritId };
  if (reason === 'stuck')   return { label: "HE'S STUCK",       culpritId: null };
  if (reason === 'timeout') return { label: 'STILL OUT THERE',  culpritId: null };
  if (reason === 'fell')    return { label: "HE'S GONE",        culpritId: null };

  // A blast reaches him through the air, so nothing "got through": he was
  // simply standing too near the barrel when the fuse ran out.
  if (cause === 'blast') return { label: 'HE WAS TOO CLOSE', culpritId };
  // A bee does not hit him, it finds him: "it got through" would send the
  // player looking for a gap in a wall, when the swarm came round the end.
  if (cause === 'stung') return { label: 'STUNG!', culpritId };

  // Killed. Was the player's own drawing implicated in what hit him?
  if (culpritId === 'stroke')                     return { label: 'YOUR OWN LINE',   culpritId };
  if (culpritId && c.strokeTouched.has(culpritId)) return { label: 'YOU SENT IT AT HIM', culpritId };
  if (c.strokeTouched.size === 0)                  return { label: 'NOTHING STOPPED IT', culpritId };
  return { label: 'IT GOT THROUGH', culpritId };
}
