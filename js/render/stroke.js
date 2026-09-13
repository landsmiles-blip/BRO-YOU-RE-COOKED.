// The boiling-line renderer — the component the entire look rests on.
//
// Every visible edge in the game goes through here, including the player's own
// stroke. That is the thesis: the world is drawn in the same ink you draw with,
// so your line belongs to it rather than sitting on top of it like a foreign
// object. No competitor in this category can say that, because they all use
// purchased or generated art with the player's line laid over it.
//
// Zero image assets. The whole art budget is this file plus rig.js.

import { noise1, boilSeed } from './noise.js';

const WOBBLE = 2.0;      // world units of perpendicular jitter
const FREQ = 0.045;      // noise cycles per world unit — low = smooth, hand-like
const RESAMPLE = 14;     // sample spacing along a path

/**
 * Offset a path by smooth low-frequency noise along its own length.
 * Perpendicular offset only, so a straight line stays recognisably straight
 * while acquiring a drawn quality.
 */
export function boilPath(points, seed, amp = WOBBLE) {
  if (points.length < 2) return points;
  const out = [];
  let dist = 0;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const prev = points[i - 1] ?? points[i];
    const next = points[i + 1] ?? points[i];
    if (i > 0) dist += Math.hypot(p.x - prev.x, p.y - prev.y);

    let tx = next.x - prev.x, ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    tx /= len; ty /= len;
    const n = noise1(dist * FREQ, seed);
    // endpoints wobble less — a real pen is placed deliberately and lifted
    // deliberately; it wanders in the middle.
    const ease = (i === 0 || i === points.length - 1) ? 0.25 : 1;
    out.push({ x: p.x - ty * n * amp * ease, y: p.y + tx * n * amp * ease });
  }
  return out;
}

/** Resample a path so wobble is applied evenly regardless of vertex density. */
export function resample(points, spacing = RESAMPLE) {
  if (points.length < 2) return points;
  const out = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    const n = Math.max(1, Math.round(d / spacing));
    for (let k = 1; k <= n; k++) out.push({ x: a.x + (b.x - a.x) * k / n, y: a.y + (b.y - a.y) * k / n });
  }
  return out;
}

function trace(ctx, pts, close) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  if (close) ctx.closePath();
}

/**
 * Ink a path. Drawn TWICE with different seeds — a real pen line is never a
 * single perfect stroke, and the doubling is what sells "hand-drawn" more than
 * the wobble itself does.
 */
export function inkPath(ctx, points, {
  now = 0, colour = '#2A2622', width = 3, close = false, amp = WOBBLE, salt = 0, passes = 2,
} = {}) {
  if (points.length < 2) return;
  const src = resample(points);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = colour;
  for (let p = 0; p < passes; p++) {
    ctx.globalAlpha = p === 0 ? 1 : 0.45;
    ctx.lineWidth = width * (p === 0 ? 1 : 0.7);
    trace(ctx, boilPath(src, boilSeed(now, salt + p * 977), amp), close);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/**
 * Fill a shape with an OFF-REGISTER colour patch, then ink its outline.
 * The offset is what makes it read as *printed* rather than as vector-clean —
 * a cheap misprinted-comic cue that does an enormous amount of work.
 */
export function inkShape(ctx, points, {
  now = 0, fill = '#C6BCA9', ink = '#2A2622', width = 3, amp = WOBBLE, salt = 0,
  offset = { x: 2.5, y: 2.5 },
} = {}) {
  if (points.length < 3) return;
  const src = resample(points);

  ctx.save();
  ctx.translate(offset.x, offset.y);
  ctx.fillStyle = fill;
  trace(ctx, boilPath(src, boilSeed(now, salt + 4111), amp * 1.3), true);
  ctx.fill();
  ctx.restore();

  inkPath(ctx, src, { now, colour: ink, width, close: true, amp, salt });
}

/** Rectangle helper — most level geometry is rectangular. */
export function rectPoints(x, y, w, h) {
  return [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
}

/** Circle helper, as a polygon so it boils like everything else. */
export function circlePoints(cx, cy, r, n = 22) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}
