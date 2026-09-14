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
  const ids = [bodyA.gameId, bodyB.gameId];
  if (ids.includes('stroke')) {
    const other = bodyA.gameId === 'stroke' ? bodyB : bodyA;
    if (other.gameId) c.strokeTouched.add(other.gameId);
  }
  if (ids.includes('milo')) {
    const other = bodyA.gameId === 'milo' ? bodyB : bodyA;
    c.lastMiloContactAt = simTimeMs;
    c.contacts.push({ id: other.gameId ?? '?', t: simTimeMs, speed });
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
export function explain(c, reason, culpritId, stroke = null) {
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

  if (reason === 'stuck')   return { label: "HE'S STUCK",       culpritId: null };
  if (reason === 'timeout') return { label: 'STILL OUT THERE',  culpritId: null };
  if (reason === 'fell')    return { label: "HE'S GONE",        culpritId: null };

  // Killed. Was the player's own drawing implicated in what hit him?
  if (culpritId === 'stroke')                     return { label: 'YOUR OWN LINE',   culpritId };
  if (culpritId && c.strokeTouched.has(culpritId)) return { label: 'YOU SENT IT AT HIM', culpritId };
  if (c.strokeTouched.size === 0)                  return { label: 'NOTHING STOPPED IT', culpritId };
  return { label: 'IT GOT THROUGH', culpritId };
}
