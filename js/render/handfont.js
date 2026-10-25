// The handwriting every label is written in (palette.js HAND).
//
// It ships INSIDE the bundle and is handed to the browser as bytes, never as a
// URL: a Playable may make no request, and every flavour of the build is one
// self-contained file. Nothing waits for it. Text is drawn in the system sans
// for the few frames it takes to decode, then in the hand — the first frame and
// gameReady are never held back by a font.
//
// Browser-only, and called from main.js alone: render modules are imported by
// Node tests, where there is no FontFace and no document.

import { HAND_WOFF2 } from './handfont-data.js';

export function loadHandFont() {
  const FontFaceCtor = globalThis.FontFace;
  const fonts = globalThis.document?.fonts;
  if (!FontFaceCtor || !fonts || typeof atob !== 'function') return Promise.resolve(false);
  try {
    const raw = atob(HAND_WOFF2);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    const face = new FontFaceCtor('Patrick Hand', bytes.buffer);
    fonts.add(face);
    return face.load().then(() => true, () => false);
  } catch {
    return Promise.resolve(false);
  }
}
