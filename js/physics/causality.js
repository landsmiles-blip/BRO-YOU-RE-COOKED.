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
 */
export function explain(c, reason, culpritId) {
  if (reason === 'stuck')   return { label: "HE'S STUCK",       culpritId: null };
  if (reason === 'timeout') return { label: 'STILL OUT THERE',  culpritId: null };
  if (reason === 'fell')    return { label: "HE'S GONE",        culpritId: null };

  // Killed. Was the player's own drawing implicated in what hit him?
  if (culpritId === 'stroke')                     return { label: 'YOUR OWN LINE',   culpritId };
  if (culpritId && c.strokeTouched.has(culpritId)) return { label: 'YOU SENT IT AT HIM', culpritId };
  if (c.strokeTouched.size === 0)                  return { label: 'NOTHING STOPPED IT', culpritId };
  return { label: 'IT GOT THROUGH', culpritId };
}
