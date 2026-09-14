// Viewport — Amendment A.1.
//
// Certification requires playability from 9:32 to 32:9 and forbids locking
// orientation. A FIXED WORLD HEIGHT (the original v1.0 spec) fails outright:
// at 9:32 it yields only 360 units of width against a 720-unit safe column,
// so the puzzle physically does not fit.
//
// Instead the 720x1280 SAFE BOX is CONTAIN-FIT into the viewport. Whichever
// axis has slack becomes background. The safe box always fits, at every ratio.
//
// This also makes "game state survives resize" structural rather than
// defensive: a resize changes `scale` only. World units never change, so a
// resize mid-simulation cannot perturb the physics.

import { SAFE_BOX } from './constants.js';

export const view = {
  canvas: null, ctx: null,
  scale: 1, dpr: 1,
  offsetX: 0, offsetY: 0,     // world units of slack on each side of the safe box
  worldW: SAFE_BOX.w, worldH: SAFE_BOX.h,
  cssW: 0, cssH: 0,
};

export function initView(canvas) {
  view.canvas = canvas;
  view.ctx = canvas.getContext('2d', { alpha: false });
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  return view;
}

export function resize() {
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;
  // PIXEL BUDGET, not a flat DPR cap.
  //
  // This was `Math.min(devicePixelRatio, 2)`, which is a real performance guard
  // aimed at a real problem — fill rate is this renderer's only meaningful cost
  // — but a flat cap is the wrong instrument. It blurred a 3x PHONE, where the
  // full backing store is 2.6M pixels and entirely affordable, in order to
  // protect a 3x ULTRAWIDE, where it would be 8M+ and genuinely is not.
  //
  // "Text legible at 1x / 2x / 3x DPR" is a NAMED rejection cause for
  // Playables, and a 3x device was getting a 2x buffer upscaled by the
  // compositor — soft edges on every line of type, on exactly the high-density
  // phones most of the audience is holding. The conformance gate caught it:
  // 810 backing pixels where 1215 were asked for.
  //
  // Budgeting by AREA gives both: full density wherever the total is
  // affordable, graceful reduction only where it is not. 3.5M is roughly a
  // 3x phone (405x720 -> 2.6M, comfortably inside) while a 1280x720 embed at
  // 3x (8.3M) reduces to ~1.95x rather than blowing the frame budget.
  const MAX_BACKING_PX = 3_500_000;
  const wanted = window.devicePixelRatio || 1;
  const affordable = Math.sqrt(MAX_BACKING_PX / Math.max(1, cssW * cssH));
  // Never below 1 (that would be worse than any cap), never above 3 (beyond
  // that the extra pixels are invisible and the cost is not).
  const dpr = Math.max(1, Math.min(wanted, affordable, 3));

  view.cssW = cssW; view.cssH = cssH; view.dpr = dpr;
  view.scale = Math.min(cssW / SAFE_BOX.w, cssH / SAFE_BOX.h);
  view.worldW = cssW / view.scale;
  view.worldH = cssH / view.scale;
  view.offsetX = (view.worldW - SAFE_BOX.w) / 2;
  view.offsetY = (view.worldH - SAFE_BOX.h) / 2;

  if (view.canvas) {
    view.canvas.width = Math.round(cssW * dpr);
    view.canvas.height = Math.round(cssH * dpr);
    view.canvas.style.width = cssW + 'px';
    view.canvas.style.height = cssH + 'px';
  }
}

/** Apply the world transform. After this, draw in world units with (0,0) at the
 *  safe box's top-left corner. */
export function applyTransform(ctx) {
  const k = view.scale * view.dpr;
  ctx.setTransform(k, 0, 0, k, view.offsetX * k, view.offsetY * k);
}

export function screenToWorld(sx, sy) {
  return { x: sx / view.scale - view.offsetX, y: sy / view.scale - view.offsetY };
}

/** World-space bounds of what is actually visible, for background fill. */
export function visibleBounds() {
  return {
    x0: -view.offsetX, y0: -view.offsetY,
    x1: SAFE_BOX.w + view.offsetX, y1: SAFE_BOX.h + view.offsetY,
  };
}
