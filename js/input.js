// Pointer input — unified mouse and touch (both are certification requirements).
//
// Rules that exist because the player must NEVER be punished by an input event:
//   - lock to the first pointer id; every other touch is ignored until release
//   - pointer leaving the canvas is an IMPLICIT RELEASE, validated normally,
//     not a silent discard
//   - a tap anywhere during simulation is an instant retry — the most-pressed
//     button in the game should be the whole screen

import { screenToWorld } from './view.js';

export function attachInput(canvas, handlers) {
  let activeId = null;

  const pt = (e) => screenToWorld(e.clientX, e.clientY);

  canvas.addEventListener('pointerdown', (e) => {
    if (activeId !== null) return;              // multi-touch lock
    activeId = e.pointerId;
    canvas.setPointerCapture?.(e.pointerId);
    const p = pt(e);
    handlers.onDown?.(p.x, p.y, e.pointerId);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerId !== activeId) return;
    const p = pt(e);
    handlers.onMove?.(p.x, p.y);
  });

  const release = (e) => {
    if (e.pointerId !== activeId) return;
    activeId = null;
    try { canvas.releasePointerCapture?.(e.pointerId); } catch { /* already gone */ }
    handlers.onUp?.();
  };

  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', release);   // implicit release, never a discard

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
}
