// THE HAND MODEL — the one place in this project that decides what a stroke a
// person actually draws looks like.
//
// It lives alone, with no physics imports, for two reasons: the filmstrip
// drives a browser and cannot load the Node physics shim, and there must be
// exactly ONE model. There used to be two — an aliased zigzag in the test lib
// and a gentler curve in the filmstrip — which is how a level could be
// condemned as unsolvable by one and filmed crossing comfortably by the other.

/**
 * Resample a stroke the way a finger draws it.
 *
 * TWO WAYS TO GET THIS WRONG, AND THIS PROJECT HIT BOTH.
 *
 * 1. TOO SMOOTH. The first version used a 1.2-unit waver, and Douglas-Peucker
 *    — correctly — flattened it straight back to two points and one rigid
 *    body, so the "hand-drawn" case was the sparse case in disguise and the
 *    gate could never catch the bug it exists to catch.
 *
 * 2. ALIASED. The fix over-corrected: offsets of +/-5.5u on BOTH axes, driven
 *    by sin(d * 0.42) and cos(d * 0.55) where d is distance travelled. Those
 *    have wavelengths of ~15u and ~11u, sampled every 7-8u — UNDER two samples
 *    per cycle. The result was not a wavy line, it was a crumpled zigzag whose
 *    consecutive segments sat at 31 deg, -88 deg, +113 deg, -119 deg: a path
 *    that doubled back on itself repeatedly. No finger can draw that, and no
 *    input pipeline can emit it. Gating the project on it condemned A2 as
 *    unsolvable when a real hand crosses it comfortably.
 *
 * SO: model the hand. A person drawing a "straight" line freehand deviates
 * PERPENDICULAR to their direction of travel, by a few percent of its length,
 * over one to three slow undulations — plus a smaller, faster tremor that is
 * still well inside the sample rate. Offsetting perpendicular to the local
 * direction is what guarantees the path never reverses: with wavelength >= 60u
 * and amplitude <= 8u the deviation angle stays under ~40 deg.
 *
 * It must still survive simplification as a genuine multi-part chain — every
 * caller asserts that — because a 1-part stroke proves nothing about
 * stability. Realistic and demanding are not opposites; aliased is just wrong.
 */
export function handDrawn(points, spacing = 8, waver = 5.5, undulations = 2.3) {
  if (points.length < 2) return points;

  const segLen = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const l = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    segLen.push(l); total += l;
  }
  if (total < 1) return points;

  // Keep the slow undulation well above the sample spacing no matter how
  // short the stroke is — this is the guard that makes aliasing impossible.
  const wavelength = Math.max(total / undulations, spacing * 6);
  const k = (Math.PI * 2) / wavelength;
  const phase = 0.7;

  const out = [];
  let d = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const len = segLen[i - 1];
    if (len < 1e-6) continue;
    // Unit normal to this segment: the only direction the hand may stray.
    const nx = -(b.y - a.y) / len, ny = (b.x - a.x) / len;
    const n = Math.max(1, Math.round(len / spacing));
    for (let j = 0; j < n; j++) {
      const t = j / n;
      const off = Math.sin(d * k + phase) * waver
                + Math.sin(d * k * 3 + 2.1) * waver * 0.33;
      out.push({
        x: a.x + (b.x - a.x) * t + nx * off,
        y: a.y + (b.y - a.y) * t + ny * off,
      });
      d += len / n;
    }
  }
  const last = points[points.length - 1];
  out.push({ x: last.x, y: last.y });
  return out;
}
