// Minimal HUD. Text is drawn in SCREEN space, not world space, so it stays
// legible at every scale — text rendering on high-density screens is a named
// certification rejection cause.

import { view } from '../view.js';
import { C } from './palette.js';

/**
 * Draw text, shrinking it until it fits.
 *
 * "Text and graphics must render clearly across all resolutions and aspect
 * ratios" is a certification requirement AND a named rejection cause. A label
 * that fits on a 1280px viewport and runs off the edge of a 360px one is
 * exactly that failure — and this game must be legible from 9:32 to 32:9.
 */
export function drawText(ctx, text, xFrac, yFrac, sizePx, colour = C.ink, align = 'center', maxFrac = 0.92) {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  const maxW = view.cssW * maxFrac;
  let size = sizePx;
  const font = (px) => `700 ${px}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
  ctx.font = font(size);
  let guard = 0;
  while (ctx.measureText(text).width > maxW && size > 8 && guard++ < 60) {
    size -= Math.max(1, size * 0.06);
    ctx.font = font(size);
  }
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = colour;
  ctx.fillText(text, view.cssW * xFrac, view.cssH * yFrac);
  return size;
}

export function drawBanner(ctx, text, sub, yFrac = 0.5) {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  const h = Math.max(64, view.cssH * 0.13);
  ctx.fillStyle = 'rgba(42,38,34,0.86)';
  ctx.fillRect(0, view.cssH * yFrac - h / 2, view.cssW, h);
  drawText(ctx, text, 0.5, yFrac - 0.018, Math.max(20, view.cssH * 0.035), C.paper);
  if (sub) drawText(ctx, sub, 0.5, yFrac + 0.032, Math.max(12, view.cssH * 0.018), 'rgba(232,226,214,0.75)');
}

/** Remaining-ink meter. Nothing should hit an invisible wall mid-stroke. */
export function drawInk(ctx, used, max) {
  if (used <= 0) return;
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  const w = view.cssW * 0.34, x = view.cssW * 0.5 - w / 2, y = view.cssH * 0.035;
  const frac = Math.max(0, Math.min(1, 1 - used / max));
  ctx.fillStyle = 'rgba(42,38,34,0.15)';
  ctx.fillRect(x, y, w, 6);
  ctx.fillStyle = frac < 0.2 ? C.danger : C.ink;
  ctx.fillRect(x, y, w * frac, 6);
}
