// M0 render — capsules and circles. NO ART BUDGET (Bible §1).
//
// The boiling-line renderer, Milo's rig and the frozen tableau's colour drain
// are M1 and have their own cut line. This exists to make the level legible
// enough to evaluate the mechanic, and no more.

import { view, applyTransform, visibleBounds } from '../view.js';
import { C } from './palette.js';
import { MILO, LINE, SAFE_BOX } from '../constants.js';
import { STATE } from '../milo.js';

export function clear(ctx) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, view.canvas.width, view.canvas.height);
}

export function drawScene(ctx, sim, opts = {}) {
  const { frozen = false, ghostPoints = null, livePoints = null, anchors = null } = opts;
  applyTransform(ctx);

  const vb = visibleBounds();
  // Slack outside the safe box is background only — never puzzle geometry.
  ctx.fillStyle = C.paperDark;
  ctx.fillRect(vb.x0, vb.y0, vb.x1 - vb.x0, vb.y1 - vb.y0);
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, SAFE_BOX.w, SAFE_BOX.h);

  // Static geometry
  ctx.lineWidth = 3;
  ctx.strokeStyle = C.ink;
  for (const s of sim.statics) {
    const b = s.spec;
    ctx.fillStyle = C.staticFill;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeRect(b.x, b.y, b.w, b.h);
  }

  // Goal — the only soft light in the scene
  const g = sim.goal;
  ctx.fillStyle = C.goalGlow;
  ctx.fillRect(g.x - g.w / 2 - 10, g.y - g.h - 10, g.w + 20, g.h + 20);
  ctx.fillStyle = C.goal;
  ctx.fillRect(g.x - g.w / 2, g.y - g.h, g.w, g.h);
  ctx.strokeStyle = C.ink;
  ctx.strokeRect(g.x - g.w / 2, g.y - g.h, g.w, g.h);

  // Ghost of the previous attempt — turns "redraw blind" into "adjust"
  if (ghostPoints?.length > 1) drawPath(ctx, ghostPoints, C.ghost, LINE.thickness, false);

  // The committed stroke
  if (sim.stroke) drawBody(ctx, sim.stroke, C.stroke, true);

  // Hazards — THE accent, and nothing else in the scene may use it
  for (const { body, spec } of sim.objects.values()) {
    ctx.fillStyle = C.danger;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 3;
    if (spec.radius) {
      ctx.beginPath();
      ctx.arc(body.position.x, body.position.y, spec.radius, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // orientation tick, so rolling is visible
      ctx.beginPath();
      ctx.moveTo(body.position.x, body.position.y);
      ctx.lineTo(body.position.x + Math.cos(body.angle) * spec.radius,
                 body.position.y + Math.sin(body.angle) * spec.radius);
      ctx.stroke();
    } else drawBody(ctx, body, C.danger, false);
  }

  drawMilo(ctx, sim.milo);

  // Anchor sparks — this one VFX carries the entire stability model, no UI
  if (anchors?.length) {
    ctx.fillStyle = C.anchor;
    for (const a of anchors) {
      ctx.beginPath(); ctx.arc(a.x, a.y, 5, 0, Math.PI * 2); ctx.fill();
    }
  }

  // The stroke in progress
  if (livePoints?.length > 1) drawPath(ctx, livePoints, C.stroke, LINE.thickness, true);

  if (frozen) {
    ctx.fillStyle = C.dim;
    ctx.fillRect(vb.x0, vb.y0, vb.x1 - vb.x0, vb.y1 - vb.y0);

    // Puzzle-critical geometry is redrawn ON TOP of the drain. The shelves are
    // the thing the player has to draw between; washing them out hides the
    // solution, not the noise. The drain exists to suppress decoration.
    ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.fillStyle = C.staticFill;
    for (const s of sim.statics) {
      ctx.fillRect(s.spec.x, s.spec.y, s.spec.w, s.spec.h);
      ctx.strokeRect(s.spec.x, s.spec.y, s.spec.w, s.spec.h);
    }
    ctx.fillStyle = C.goal;
    ctx.fillRect(g.x - g.w / 2, g.y - g.h, g.w, g.h);
    ctx.strokeRect(g.x - g.w / 2, g.y - g.h, g.w, g.h);
    if (ghostPoints?.length > 1) drawPath(ctx, ghostPoints, C.ghost, LINE.thickness, false);

    // danger survives the drain — it is the thing that is going to kill him
    for (const { body, spec } of sim.objects.values()) {
      if (!spec.radius) continue;
      ctx.fillStyle = C.danger;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(body.position.x, body.position.y, spec.radius, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }
    drawMilo(ctx, sim.milo);
    if (livePoints?.length > 1) drawPath(ctx, livePoints, C.stroke, LINE.thickness, true);
  }
}

export function drawMilo(ctx, milo) {
  const b = milo.body;
  ctx.save();
  ctx.translate(b.position.x, b.position.y);
  ctx.rotate(b.angle);
  ctx.fillStyle = C.milo;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  roundRect(ctx, -MILO.width / 2, -MILO.height / 2, MILO.width, MILO.height, MILO.chamfer);
  ctx.fill(); ctx.stroke();

  // Face — the danger scalar already drives it, even as a placeholder
  const alarmed = milo.danger > 0.45;
  ctx.fillStyle = C.ink;
  const eyeY = -MILO.height / 2 + 18;
  const r = alarmed ? 5 : 3;
  ctx.beginPath(); ctx.arc(-7, eyeY, r, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(7, eyeY, r, 0, Math.PI * 2); ctx.fill();
  if (alarmed) {
    ctx.beginPath(); ctx.arc(0, eyeY + 16, 6, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-5, eyeY + 14); ctx.lineTo(5, eyeY + 14); ctx.stroke();
  }
  ctx.restore();
}

function drawBody(ctx, body, colour, glow) {
  const parts = body.parts.length > 1 ? body.parts.slice(1) : [body];
  if (glow) {
    ctx.strokeStyle = C.strokeGlow;
    ctx.lineWidth = LINE.thickness + 10;
    ctx.lineCap = 'round';
  }
  for (const pass of glow ? [0, 1] : [1]) {
    ctx.fillStyle = colour;
    ctx.strokeStyle = pass === 0 ? C.strokeGlow : C.ink;
    ctx.lineWidth = pass === 0 ? 8 : 2;
    for (const p of parts) {
      ctx.beginPath();
      const v = p.vertices;
      ctx.moveTo(v[0].x, v[0].y);
      for (let i = 1; i < v.length; i++) ctx.lineTo(v[i].x, v[i].y);
      ctx.closePath();
      if (pass === 0) ctx.stroke(); else { ctx.fill(); ctx.stroke(); }
    }
  }
}

function drawPath(ctx, pts, colour, width, glow) {
  if (glow) {
    ctx.strokeStyle = C.strokeGlow;
    ctx.lineWidth = width + 10;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    stroke(ctx, pts);
  }
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  stroke(ctx, pts);
}

function stroke(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
