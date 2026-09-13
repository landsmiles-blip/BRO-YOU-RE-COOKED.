// The freeze, as a visual event — Bible §6.5.
//
// The moment the world stops is this game's signature and its whole marketing
// asset: every level generates a frozen disaster tableau automatically, which
// is exactly the "how is he getting out of that?" still the platform rewards.
// It deserves real craft rather than a hard cut.
//
//   - time eases to 0 over ~120ms. A hard cut reads as a bug; a fast ease reads
//     as drama.
//   - everything desaturates EXCEPT the danger accent, which is the thing that
//     is going to kill him.
//   - motion freezes as ink streaks showing where things WERE GOING, which is
//     genuinely useful puzzle information delivered as style.

export const FREEZE_MS = 120;
export const UNFREEZE_MS = 80;

export const reducedMotion = (() => {
  try { return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false; }
  catch { return false; }
})();

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/** Lerp a hex colour toward its own greyscale. t=1 is fully drained. */
export function drain(colour, t) {
  if (t <= 0) return colour;
  const [r, g, b] = hex(colour);
  const l = 0.299 * r + 0.587 * g + 0.114 * b;
  const m = (c) => Math.round(c + (l * 1.06 - c) * t);
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}

/** 0 → live, 1 → fully frozen. Instant when the viewer asked for less motion. */
export function freezeAmount(phase, phaseTime, frozenPhase) {
  if (phase !== frozenPhase) return 0;
  if (reducedMotion) return 1;
  return Math.min(1, phaseTime / FREEZE_MS);
}

/**
 * Ink streaks behind moving bodies at the instant of the freeze.
 * Tapered, short, and only for things actually moving — clutter would defeat
 * the purpose, which is to make trajectories readable at a glance.
 */
export function drawMotionStreaks(ctx, bodies, amount) {
  if (amount <= 0.05) return;
  ctx.save();
  ctx.lineCap = 'round';
  for (const { body, radius } of bodies) {
    const vx = body.velocity.x, vy = body.velocity.y;
    const speed = Math.hypot(vx, vy);
    if (speed < 0.6) continue;
    const len = Math.min(70, speed * 9) * amount;
    const nx = vx / speed, ny = vy / speed;
    for (let k = 0; k < 3; k++) {
      const off = (k - 1) * (radius ?? 12) * 0.55;
      ctx.globalAlpha = 0.16 * amount * (1 - Math.abs(k - 1) * 0.3);
      ctx.strokeStyle = '#2A2622';
      ctx.lineWidth = 3.5 - Math.abs(k - 1);
      ctx.beginPath();
      ctx.moveTo(body.position.x - ny * off, body.position.y + nx * off);
      ctx.lineTo(body.position.x - nx * len - ny * off, body.position.y - ny * len + nx * off);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}
