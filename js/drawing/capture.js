// Stroke capture — samples on a fixed interval, not on every raw pointer event,
// so a fast device doesn't produce a denser stroke than a slow one.

import { LINE } from '../constants.js';
import { pathLength } from './simplify.js';

const SAMPLE_MS = 16;

export function createStroke() {
  return { points: [], lastSampleAt: 0, length: 0, pointerId: null, active: false };
}

export function begin(stroke, x, y, pointerId, now) {
  stroke.points = [{ x, y }];
  stroke.lastSampleAt = now;
  stroke.length = 0;
  stroke.pointerId = pointerId;      // locked — every other touch is ignored
  stroke.active = true;
}

export function extend(stroke, x, y, now) {
  if (!stroke.active) return;
  if (now - stroke.lastSampleAt < SAMPLE_MS) return;
  const last = stroke.points[stroke.points.length - 1];
  if (Math.hypot(x - last.x, y - last.y) < 1) return;
  stroke.points.push({ x, y });
  stroke.lastSampleAt = now;
  stroke.length = pathLength(stroke.points);
}

export function end(stroke) {
  stroke.active = false;
  stroke.pointerId = null;
  return stroke.points;
}

/** Exposed every frame so the renderer can warn before the limit is hit —
 *  an invisible wall mid-stroke is exactly the surprise the release-time
 *  rules exist to prevent. */
export function remaining(stroke, maxLength) {
  return Math.max(0, (maxLength ?? LINE.maxLengthDefault) - stroke.length);
}
