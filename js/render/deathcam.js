// Death cam — Bible §3.3b.
//
// Slow-motion alone only shows the player THAT they died, in slower motion.
// This replays the last 1.4s at 25% with the guilty body called out and one
// short label, so they can form a new hypothesis instead of guessing.

import { applyTransform } from '../view.js';
import { C } from './palette.js';
import { MILO, LINE, DEATH_CAM, SAFE_BOX } from '../constants.js';
import { drawBanner } from './hud.js';

export function drawReplay(ctx, sim, frameIdx, label, culpritId) {
  applyTransform(ctx);
  ctx.fillStyle = C.paper;
  ctx.fillRect(-2000, -2000, 8000, 8000);
  ctx.fillStyle = C.paperDark;
  ctx.fillRect(0, 0, SAFE_BOX.w, SAFE_BOX.h);

  // static geometry stays put
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(42,38,34,0.35)';
  ctx.fillStyle = 'rgba(198,188,169,0.5)';
  for (const s of sim.statics) {
    ctx.fillRect(s.spec.x, s.spec.y, s.spec.w, s.spec.h);
    ctx.strokeRect(s.spec.x, s.spec.y, s.spec.w, s.spec.h);
  }

  const frames = sim.recorder.frames;
  const frame = frames[Math.min(frameIdx, frames.length - 1)];
  if (!frame) return;

  for (const f of frame) {
    const guilty = f.id === culpritId;
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.a);
    if (f.id === 'milo') {
      ctx.fillStyle = C.milo; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.rect(-MILO.width / 2, -MILO.height / 2, MILO.width, MILO.height);
      ctx.fill(); ctx.stroke();
    } else if (f.id === 'stroke') {
      ctx.strokeStyle = guilty ? C.danger : 'rgba(42,38,34,0.5)';
      ctx.lineWidth = LINE.thickness;
      ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(40, 0); ctx.stroke();
    } else {
      const spec = sim.objects.get(f.id)?.spec;
      const r = spec?.radius ?? 20;
      // everything desaturates except the culprit
      ctx.fillStyle = guilty ? C.danger : 'rgba(160,150,140,0.7)';
      ctx.strokeStyle = guilty ? C.ink : 'rgba(42,38,34,0.4)';
      ctx.lineWidth = guilty ? 4 : 2;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (guilty) {
        ctx.strokeStyle = C.danger; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, r + 14, 0, Math.PI * 2); ctx.stroke();
      }
    }
    ctx.restore();
  }

  drawBanner(ctx, label ?? 'COOKED.', 'tap to try again', 0.5);
}

/** Which recorded frame to show, given elapsed ms since the death cam started. */
export function replayFrame(sim, elapsedMs) {
  const frames = sim.recorder.frames.length;
  if (!frames) return 0;
  if (elapsedMs < DEATH_CAM.holdMs) return frames - 1;      // hold on the fatal frame
  const t = (elapsedMs - DEATH_CAM.holdMs) / DEATH_CAM.replayMs;
  const start = Math.max(0, frames - Math.round(frames));
  return Math.min(frames - 1, start + Math.floor(t * (frames - start)));
}

export const DEATH_CAM_MS = DEATH_CAM.holdMs + DEATH_CAM.replayMs;
