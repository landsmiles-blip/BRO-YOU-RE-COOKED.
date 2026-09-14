// Pointer input — unified mouse and touch (both are certification requirements).
//
// Rules that exist because the player must NEVER be punished by an input event:
//   - lock to the first pointer id; every other touch is ignored until release
//   - pointer leaving the canvas is an IMPLICIT RELEASE, validated normally,
//     not a silent discard
//   - a tap anywhere during simulation is an instant retry — the most-pressed
//     button in the game should be the whole screen
//
// IT REPORTS BOTH COORDINATE SPACES, and that is not convenience. The game
// world is in world units and the HUD is in CSS pixels, and the level board was
// built hit-testing CSS rectangles against world coordinates — so every button
// on it was silently dead while the drawing underneath kept working perfectly.
// Handing UI code a css point it did not have to derive is what stops the next
// piece of UI making the same mistake.

import { screenToWorld } from './view.js';

export function attachInput(canvas, handlers) {
  let activeId = null;

  const pt = (e) => {
    const w = screenToWorld(e.clientX, e.clientY);
    return { x: w.x, y: w.y, cssX: e.clientX, cssY: e.clientY };
  };

  canvas.addEventListener('pointerdown', (e) => {
    if (activeId !== null) return;              // multi-touch lock
    activeId = e.pointerId;
    canvas.setPointerCapture?.(e.pointerId);
    const p = pt(e);
    handlers.onDown?.(p.x, p.y, e.pointerId, p);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerId !== activeId) return;
    const p = pt(e);
    handlers.onMove?.(p.x, p.y, p);
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
