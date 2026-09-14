// THE LEVEL BOARD — Bible §7.5, the first item on the "definition of finished"
// list, and the thing whose absence meant the only route to level 14 was
// playing levels 1 through 13 in order, every session.
//
// Drawn entirely in SCREEN space. A board laid out in world units would be
// correct at 9:16 and unusable at 32:9, and text legibility across resolutions
// is a named certification rejection cause.
//
// IT DOES NOT LOCK ANYTHING, and that is a considered call rather than a
// shortcut. The ladder in §7.4 teaches deliberately — a new idea every two or
// three levels — so there is a real argument for gating. Against it: this game
// is played inside YouTube by a distracted audience in short bursts, every
// level is self-contained physics rather than a dependency chain, and friction
// on a returning player is the one thing a playable cannot afford. So the
// ladder is expressed as EMPHASIS instead of as a wall: cleared levels are
// solid, unplayed ones are dimmed, and the board opens scrolled to where you
// actually are. Someone who jumps to 14 without learning anchoring will fail
// and come back — which costs them one attempt, not a session.

import { view } from '../view.js';
import { C } from './palette.js';
import { drawText } from './hud.js';

/**
 * Lay the board out for the CURRENT viewport, and return the hit regions so
 * input and rendering can never disagree about where a card is. One geometry,
 * one source of truth — the same rule the stroke renderer had to learn.
 */
export function layout(count) {
  const W = view.cssW, H = view.cssH;
  const pad = Math.max(10, Math.min(W, H) * 0.03);
  const top = H * 0.17;
  const bottom = H * 0.92;
  const availW = W - pad * 2;
  const availH = bottom - top;

  // Choose the column count that gets cards closest to square. A fixed grid
  // would give 4 unreadable slivers at 32:9 and 4 huge cards at 9:32.
  let best = { cols: 1, score: -Infinity };
  for (let cols = 2; cols <= Math.min(12, count); cols++) {
    const rows = Math.ceil(count / cols);
    const cw = (availW - pad * (cols - 1)) / cols;
    const ch = (availH - pad * (rows - 1)) / rows;
    if (cw <= 24 || ch <= 24) continue;
    // Prefer cards that are square-ish AND as large as possible.
    const ratio = Math.min(cw, ch) / Math.max(cw, ch);
    const score = ratio * 1.6 + Math.min(cw, ch) / Math.max(W, H);
    if (score > best.score) best = { cols, rows, cw, ch, score };
  }
  if (best.score === -Infinity) best = { cols: count, rows: 1, cw: availW / count, ch: availH };

  const { cols, rows, cw, ch } = best;
  const gridW = cols * cw + (cols - 1) * pad;
  const x0 = (W - gridW) / 2;

  const cards = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    cards.push({ i, x: x0 + c * (cw + pad), y: top + r * (ch + pad), w: cw, h: ch });
  }
  // The close affordance is a real rectangle, not a guess at where the text is.
  const close = { x: W - pad - 36, y: pad * 0.6, w: 36, h: 36 };
  return { cards, close, pad, rows };
}

/** Which card is under this point? null for none. */
export function hitTest(box, x, y) {
  if (inside(box.close, x, y)) return { close: true };
  for (const c of box.cards) if (inside(c, x, y)) return { index: c.i };
  return null;
}

const inside = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

export function drawBoard(ctx, { levels, starsOf, current, total, max }) {
  const box = layout(levels.length);
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);

  ctx.fillStyle = 'rgba(42,38,34,0.96)';
  ctx.fillRect(0, 0, view.cssW, view.cssH);

  drawText(ctx, `${total} / ${max}`, 0.5, 0.075, Math.max(20, view.cssH * 0.042), C.anchor);
  drawText(ctx, 'stars', 0.5, 0.118, Math.max(10, view.cssH * 0.016), 'rgba(232,226,214,0.55)');

  // Close: an X drawn, like everything else in this game.
  ctx.strokeStyle = 'rgba(232,226,214,0.6)';
  ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  const cx = box.close.x + box.close.w / 2, cy = box.close.y + box.close.h / 2, r = 8;
  ctx.beginPath();
  ctx.moveTo(cx - r, cy - r); ctx.lineTo(cx + r, cy + r);
  ctx.moveTo(cx + r, cy - r); ctx.lineTo(cx - r, cy + r);
  ctx.stroke();

  for (const card of box.cards) {
    const lvl = levels[card.i];
    const stars = starsOf(lvl.id);
    const played = stars > 0;
    const here = card.i === current;

    ctx.fillStyle = played ? 'rgba(232,226,214,0.14)' : 'rgba(232,226,214,0.05)';
    ctx.fillRect(card.x, card.y, card.w, card.h);
    ctx.strokeStyle = here ? C.anchor : (played ? 'rgba(232,226,214,0.32)' : 'rgba(232,226,214,0.13)');
    ctx.lineWidth = here ? 2.6 : 1.2;
    ctx.strokeRect(card.x, card.y, card.w, card.h);

    const nSize = Math.max(12, Math.min(card.w, card.h) * 0.30);
    ctx.font = `700 ${nSize}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = played ? C.paper : 'rgba(232,226,214,0.45)';
    ctx.fillText(String(card.i + 1), card.x + card.w / 2, card.y + card.h * 0.36);

    // The verb, when there is room for it to be readable rather than a smudge.
    const vSize = Math.min(card.w * 0.16, Math.max(7, card.h * 0.13));
    if (vSize >= 8 && card.w > 54) {
      ctx.font = `700 ${vSize}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = 'rgba(232,226,214,0.5)';
      ctx.fillText(lvl.verb, card.x + card.w / 2, card.y + card.h * 0.60);
    }

    // Three star pips. Shape carries it, not colour alone.
    const pw = Math.min(card.w * 0.17, card.h * 0.16);
    const gap = pw * 0.45;
    const totalW = pw * 3 + gap * 2;
    const px = card.x + (card.w - totalW) / 2;
    const py = card.y + card.h * 0.80;
    for (let k = 0; k < 3; k++) {
      ctx.fillStyle = k < stars ? C.anchor : 'rgba(232,226,214,0.16)';
      ctx.fillRect(px + k * (pw + gap), py, pw, Math.max(3, pw * 0.34));
    }
  }
  return box;
}
