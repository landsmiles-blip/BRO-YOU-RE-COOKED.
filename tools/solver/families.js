// Parametric stroke families.
//
// NOT random strokes. Random tells you nothing about human play — it samples a
// space nobody draws in, so its "solution breadth" number is meaningless. These
// are the shapes people actually draw in a game like this: a line, a slightly
// curved line, a bowl, a corner, a loop. Sweeping them across position, angle
// and size approximates the real space of plausible attempts.
//
// Every family is a pure function of its parameters, so a run is reproducible.

const TAU = Math.PI * 2;

/** Deterministic PRNG — the solver must give the same answer twice. */
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

const pt = (x, y) => ({ x, y });

/** A straight stroke through (cx,cy) at `angle`, of `len`. */
export function line(cx, cy, angle, len, segs = 3) {
  const dx = Math.cos(angle) * len / 2, dy = Math.sin(angle) * len / 2;
  const out = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    out.push(pt(cx - dx + dx * 2 * t, cy - dy + dy * 2 * t));
  }
  return out;
}

/** A bowed line — what a hand actually produces when aiming for straight. */
export function arc(cx, cy, angle, len, bow, segs = 6) {
  const out = [];
  const nx = -Math.sin(angle), ny = Math.cos(angle);
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, u = (t - 0.5) * 2;
    const b = (1 - u * u) * bow;
    out.push(pt(
      cx + Math.cos(angle) * len * (t - 0.5) + nx * b,
      cy + Math.sin(angle) * len * (t - 0.5) + ny * b,
    ));
  }
  return out;
}

/** An open U — the cradle/catch shape. Open side faces -y (upward). */
export function bowl(cx, cy, width, depth, segs = 8) {
  const out = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, u = (t - 0.5) * 2;
    out.push(pt(cx + u * width / 2, cy - (u * u) * depth + depth));
  }
  return out;
}

/** A corner — a wall on a base, or a ramp with a lip. */
export function corner(cx, cy, armA, armB, angle, turn) {
  const p0 = pt(cx, cy);
  const p1 = pt(cx + Math.cos(angle) * armA, cy + Math.sin(angle) * armA);
  const a2 = angle + turn;
  const p2 = pt(p1.x + Math.cos(a2) * armB, p1.y + Math.sin(a2) * armB);
  return [p0, pt((p0.x + p1.x) / 2, (p0.y + p1.y) / 2), p1,
          pt((p1.x + p2.x) / 2, (p1.y + p2.y) / 2), p2];
}

/** A closed loop — exercises the hollow-ring branch. */
export function ring(cx, cy, r, n = 14) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU;
    out.push(pt(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
  }
  return out;
}

/**
 * Perturb a stroke the way a HAND would, not the way a random number generator
 * would.
 *
 * The first version displaced every point independently, which produces a
 * zigzag nobody has ever drawn — and it made levels look far more fragile than
 * they are, because it was measuring robustness against noise rather than
 * against human variation. A person redrawing the same idea produces a
 * COHERENT variant: the whole stroke lands a bit off, tilted a bit, with a
 * smooth low-frequency waver along its length.
 *
 *   translation  — up to `amount`, the dominant term
 *   rotation     — small, about the stroke's own centroid
 *   waver        — smooth, low frequency, perpendicular to the path
 */
export function jitter(points, amount, rand) {
  const n = points.length;
  let cx = 0, cy = 0;
  for (const p of points) { cx += p.x; cy += p.y; }
  cx /= n; cy /= n;

  const ta = rand() * TAU, tm = (0.55 + rand() * 0.45) * amount;
  const dx = Math.cos(ta) * tm, dy = Math.sin(ta) * tm;
  const rot = (rand() - 0.5) * (amount / 260);          // radians
  const cos = Math.cos(rot), sin = Math.sin(rot);

  const phase = rand() * TAU;
  const waveAmp = amount * 0.35;

  return points.map((p, i) => {
    const rx = p.x - cx, ry = p.y - cy;
    const x = cx + rx * cos - ry * sin + dx;
    const y = cy + rx * sin + ry * cos + dy;
    // one smooth half-cycle of waver along the stroke, tapering at the ends
    const t = n > 1 ? i / (n - 1) : 0;
    const w = Math.sin(t * Math.PI + phase) * Math.sin(t * Math.PI) * waveAmp;
    const prev = points[Math.max(0, i - 1)], next = points[Math.min(n - 1, i + 1)];
    let tx = next.x - prev.x, ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    return pt(x - (ty / len) * w, y + (tx / len) * w);
  });
}

export const FAMILIES = ['line', 'arc', 'bowl', 'corner', 'ring', 'span'];

/**
 * Points a player would plausibly aim AT — the edges and mid-points of the
 * solid things they can see.
 */
export function anchorPoints(statics) {
  const pts = [];
  for (const s of statics) {
    pts.push(pt(s.x, s.y), pt(s.x + s.w / 2, s.y), pt(s.x + s.w, s.y));
  }
  return pts;
}

/**
 * SPAN — a stroke drawn between two visible solid features, with sag.
 *
 * This is the family that actually models how people play, and leaving it out
 * was the biggest flaw in the first version of this sweep. A person looking at
 * a level does not sample a grid of angles: they see "a ledge here, a platform
 * there" and draw between them. Without this, a level whose solution is a long
 * span between two anchors reads as unsolvable when it is merely un-swept.
 */
export function span(a, b, sag, segs = 7) {
  const out = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const bow = Math.sin(t * Math.PI) * sag;
    out.push(pt(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t + bow));
  }
  return out;
}

/**
 * Sweep the whole plausible space over a sampling region.
 * `density` scales the grid; the defaults land around 1,200 strokes per level,
 * which at ~6ms a simulation is a few seconds — cheap enough to run on every
 * physics change, which is the entire point of building it.
 */
export function* sweep(region, density = 1, statics = []) {
  const cols = Math.max(3, Math.round(6 * density));
  const rows = Math.max(3, Math.round(7 * density));
  const rand = rng(20260913);

  // Spans between visible features first — the way people actually play.
  const aps = anchorPoints(statics);
  for (let i = 0; i < aps.length; i++) {
    for (let j = i + 1; j < aps.length; j++) {
      const d = Math.hypot(aps[j].x - aps[i].x, aps[j].y - aps[i].y);
      if (d < 60 || d > 620) continue;
      for (const sag of [-70, -30, 0, 30, 70, 120]) {
        yield { family: 'span', points: span(aps[i], aps[j], sag), meta: { d, sag } };
      }
    }
  }

  for (let ix = 0; ix < cols; ix++) {
    for (let iy = 0; iy < rows; iy++) {
      const cx = region.x + ((ix + 0.5) / cols) * region.w;
      const cy = region.y + ((iy + 0.5) / rows) * region.h;

      for (const angle of [0, Math.PI / 6, Math.PI / 3, Math.PI / 2, (2 * Math.PI) / 3, (5 * Math.PI) / 6]) {
        for (const len of [110, 165, 230, 300, 390]) {
          yield { family: 'line', points: line(cx, cy, angle, len), meta: { cx, cy, angle, len } };
        }
        yield { family: 'arc', points: arc(cx, cy, angle, 260, 55), meta: { cx, cy, angle } };
        yield { family: 'arc', points: arc(cx, cy, angle, 260, -55), meta: { cx, cy, angle } };
      }
      for (const w of [140, 210, 290]) {
        for (const dep of [55, 95]) {
          yield { family: 'bowl', points: bowl(cx, cy, w, dep), meta: { cx, cy, w, dep } };
        }
      }
      for (const turn of [Math.PI / 2, -Math.PI / 2]) {
        yield { family: 'corner', points: corner(cx, cy, 130, 130, 0, turn), meta: { cx, cy, turn } };
      }
      for (const r of [55, 85]) yield { family: 'ring', points: ring(cx, cy, r), meta: { cx, cy, r } };
      void rand;
    }
  }
}
