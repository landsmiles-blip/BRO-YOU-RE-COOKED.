// Milo — an articulated rig, not a sprite sheet.
//
// This is the decision that pays for itself three times over. Sprite sheets
// would need eight authored animation states (Bible §7.2), cost real payload
// against a budget where load time is our competitive weapon, and carry the
// "obvious AI-generated art" certification risk. Worse, they CANNOT REACT: a
// sheet plays the same frames whether the boulder grazed his hat or flattened
// him, and this game's entire comedy is Milo reacting in proportion to what
// happened to him.
//
// The rig costs ~0 KB, and the eight states fall out of two inputs:
//   - a procedural walk cycle driven by distance travelled
//   - the DANGER SCALAR already computed every step in js/milo.js
//
// That scalar is the whole expression system: one number, continuously
// updated, driving face, flinch and brace — so the near-miss comedy emerges in
// every level with zero per-level authoring.

import { inkPath, inkShape, circlePoints } from './stroke.js';
import { C } from './palette.js';
import { MILO } from '../constants.js';
import { STATE } from '../milo.js';

// Proportions matter more than detail at this scale. The first pass used a
// 17px head on a 20x24 torso with thin limbs and read as a generic stick
// figure — legible, but not a character. Big head, stubby body, thick ink.
const HEAD_R = 21;          // oversized on purpose — §7.1
const TORSO_W = 26;
const TORSO_H = 21;

/** Limb as two bones, drawn as one tapering ink stroke. */
function limb(ctx, now, ox, oy, a1, a2, l1, l2, w, salt) {
  const x1 = ox + Math.cos(a1) * l1, y1 = oy + Math.sin(a1) * l1;
  const x2 = x1 + Math.cos(a2) * l2, y2 = y1 + Math.sin(a2) * l2;
  inkPath(ctx, [{ x: ox, y: oy }, { x: x1, y: y1 }, { x: x2, y: y2 }],
          { now, colour: C.ink, width: w, amp: 1.2, salt });
  return { x: x2, y: y2 };
}

/**
 * Draw Milo.
 * @param phase  walk cycle phase in radians (distance-driven, not time-driven,
 *               so his feet do not skate when his speed changes)
 */
export function drawMilo(ctx, milo, now, phase) {
  const b = milo.body;
  const d = Math.max(0, Math.min(1, milo.danger));
  const airborne = milo.state === STATE.AIRBORNE || milo.state === STATE.STUNNED;

  ctx.save();
  ctx.translate(b.position.x, b.position.y);
  ctx.rotate(b.angle);

  // Forward lean grows with speed and with alarm — he is always slightly ahead
  // of himself, which is most of why he reads as "eager to die".
  const lean = (airborne ? 0 : 0.10) + d * 0.16;
  ctx.rotate(lean * milo.dir);

  const hipY = MILO.height / 2 - 26;
  const bob = airborne ? 0 : Math.sin(phase * 2) * 1.6;
  const shoulderY = hipY - TORSO_H + bob;

  // ── legs ──────────────────────────────────────────────────────────────
  const swing = airborne ? 0.5 : 0.85;
  for (const [side, sign] of [['L', 1], ['R', -1]]) {
    const p = phase + (side === 'L' ? 0 : Math.PI);
    const hipA = airborne
      ? Math.PI / 2 + sign * 0.55 + d * 0.25          // tucked up when falling
      : Math.PI / 2 + Math.sin(p) * swing * 0.55;
    const kneeA = airborne
      ? Math.PI / 2 + sign * 0.9
      : Math.PI / 2 + Math.max(0, Math.sin(p + 0.8)) * 0.7;
    limb(ctx, now, sign * 6, hipY + bob, hipA, kneeA, 11, 11, 5.2, 100 + sign);
  }

  // ── torso ─────────────────────────────────────────────────────────────
  inkShape(ctx, [
    { x: -TORSO_W / 2, y: shoulderY }, { x: TORSO_W / 2, y: shoulderY },
    { x: TORSO_W / 2 - 2, y: hipY + bob }, { x: -TORSO_W / 2 + 2, y: hipY + bob },
  ], { now, fill: C.milo, ink: C.ink, width: 3.2, amp: 1.1, salt: 7 });

  // ── arms ──────────────────────────────────────────────────────────────
  // At high danger both arms go UP — the universal "oh no" silhouette, and it
  // is readable at thumbnail size, which is the point.
  for (const [side, sign] of [['L', 1], ['R', -1]]) {
    const p = phase + (side === 'L' ? Math.PI : 0);
    let shoulderA, elbowA;
    if (d > 0.55 || airborne) {
      const flail = Math.sin(now / 70 + sign) * 0.3 * (airborne ? 1 : d);
      shoulderA = -Math.PI / 2 + sign * (0.5 + flail);
      elbowA = -Math.PI / 2 + sign * (0.9 + flail);
    } else {
      shoulderA = Math.PI / 2 + Math.sin(p) * 0.38;
      elbowA = Math.PI / 2 + Math.sin(p + 0.6) * 0.3;
    }
    limb(ctx, now, sign * (TORSO_W / 2 - 3), shoulderY + 5, shoulderA, elbowA, 9, 9, 4.6, 200 + sign);
  }

  // ── head ──────────────────────────────────────────────────────────────
  const headY = shoulderY - HEAD_R + 2;
  const lookUp = d * 0.35;                       // he glances at what will kill him
  ctx.save();
  ctx.translate(0, headY);
  ctx.rotate(-lookUp * milo.dir);
  inkShape(ctx, circlePoints(0, 0, HEAD_R), {
    now, fill: C.milo, ink: C.ink, width: 3.2, amp: 1.0, salt: 11,
  });
  drawFace(ctx, now, d, airborne);

  // helmet — a distinctive accessory, permanently slightly crooked
  inkPath(ctx, [
    { x: -HEAD_R - 1, y: -5 }, { x: -HEAD_R + 3, y: -HEAD_R - 2 },
    { x: HEAD_R - 5, y: -HEAD_R - 3 }, { x: HEAD_R + 1, y: -7 },
  ], { now, colour: C.ink, width: 3.4, amp: 1.0, salt: 13 });
  ctx.restore();

  ctx.restore();
}

/** The face is a pure function of the danger scalar. Four states, no authoring. */
function drawFace(ctx, now, d, airborne) {
  ctx.fillStyle = C.ink;
  ctx.strokeStyle = C.ink;
  ctx.lineCap = 'round';

  const eyeR = d > 0.55 ? 5 : d > 0.3 ? 4 : 3;
  const eyeY = -3;

  if (d > 0.85 || airborne) {
    // eyes screwed shut — braced for it
    ctx.lineWidth = 2.4;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(s * 7 - 4, eyeY); ctx.lineTo(s * 7 + 4, eyeY);
      ctx.stroke();
    }
  } else {
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.arc(s * 7, eyeY, eyeR, 0, Math.PI * 2); ctx.fill();
    }
  }

  // mouth: a content line → a small o → a full yell
  if (d > 0.55) {
    ctx.beginPath();
    ctx.ellipse(0, 7, 3 + d * 3, 4 + d * 4, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 5, 5.5, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  }

  // sweat bead, only when it is genuinely bad
  if (d > 0.7) {
    ctx.beginPath();
    ctx.ellipse(HEAD_R - 4, -8, 2.2, 3.2, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}
