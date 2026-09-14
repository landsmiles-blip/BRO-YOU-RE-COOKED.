// Death cam — Bible §3.3b.
//
// Slow-motion alone only shows the player THAT they died, in slower motion.
// This replays the last 1.4s at 25% with the guilty body called out and one
// short label, so they can form a new hypothesis instead of guessing.
//
// IT WAS SHOWING ALMOST NONE OF THAT, and playtesting caught it: "you finish
// and you do not even know why that happened."
//
// Three things were missing from the one screen whose entire job is to explain:
//
//   1. THE PLAYER'S OWN LINE was replayed as a fixed 80-unit dash — literally
//      `moveTo(-40,0); lineTo(40,0)` — whatever they had actually drawn. The
//      single object they need to learn from was a meaningless stub.
//   2. LETHAL ZONES were not drawn AT ALL. On a level whose hazard IS a pit of
//      spikes, the thing that killed him was invisible in the explanation of
//      how he died.
//   3. THE GOAL was not drawn, so there was no way to see how close he got or
//      which way he was going.
//
// What remained was grey boxes and a red dash. Every fix below exists to make
// the replay show the same LEVEL the player was just looking at.

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

  // THE HAZARD HE DIED IN. Spikes, in the danger accent, drawn as spikes —
  // the same silhouette as during play, so the replay reads as the same place.
  for (const z of sim.level?.zones ?? []) {
    if (!z.lethal) continue;
    ctx.fillStyle = C.danger;
    ctx.beginPath();
    const teeth = Math.max(3, Math.round(z.w / 26));
    ctx.moveTo(z.x, z.y + z.h);
    for (let i = 0; i < teeth; i++) {
      const x0 = z.x + (i / teeth) * z.w;
      ctx.lineTo(x0 + z.w / teeth / 2, z.y);
      ctx.lineTo(x0 + z.w / teeth, z.y + z.h);
    }
    ctx.closePath();
    ctx.fill();
  }

  // WHERE HE WAS TRYING TO GET TO. Without it there is no sense of direction
  // or of how close he came.
  const g = sim.level?.goal;
  if (g) {
    ctx.fillStyle = 'rgba(63,169,107,0.45)';
    ctx.fillRect(g.x - g.w / 2, g.y - g.h, g.w, g.h);
    ctx.strokeStyle = 'rgba(42,38,34,0.35)';
    ctx.strokeRect(g.x - g.w / 2, g.y - g.h, g.w, g.h);
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
      // The shape the player actually drew, in the body's own local space —
      // the same geometry the live renderer uses, so the replay shows THEIR
      // line rather than a stand-in for it.
      const path = sim.stroke?.strokePath;
      ctx.strokeStyle = guilty ? C.danger : 'rgba(42,38,34,0.55)';
      ctx.lineWidth = LINE.thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (path && path.length > 1) {
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
      } else {
        ctx.moveTo(-40, 0); ctx.lineTo(40, 0);
      }
      ctx.stroke();
    } else {
      const spec = sim.objects.get(f.id)?.spec;
      // everything desaturates except the culprit
      ctx.fillStyle = guilty ? C.danger : 'rgba(160,150,140,0.7)';
      ctx.strokeStyle = guilty ? C.ink : 'rgba(42,38,34,0.4)';
      ctx.lineWidth = guilty ? 4 : 2;
      // Rectangles were being replayed as radius-20 circles, so a plank or a
      // gate turned into a small ball in the replay — the one moment the
      // player is being shown WHY they died.
      if (spec && !spec.radius && spec.w) {
        ctx.beginPath();
        ctx.rect(-spec.w / 2, -spec.h / 2, spec.w, spec.h);
        ctx.fill(); ctx.stroke();
        if (guilty) {
          ctx.strokeStyle = C.danger; ctx.lineWidth = 3;
          ctx.strokeRect(-spec.w / 2 - 10, -spec.h / 2 - 10, spec.w + 20, spec.h + 20);
        }
      } else {
        const r = spec?.radius ?? 20;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (guilty) {
          ctx.strokeStyle = C.danger; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(0, 0, r + 14, 0, Math.PI * 2); ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  // PUT THE LABEL WHERE MILO IS NOT.
  //
  // It was pinned at mid-screen, which is where the action usually is — so the
  // banner explaining the death could sit directly on top of the death. Moving
  // it to the opposite half costs three lines and never covers him.
  const me = frame.find((f) => f.id === 'milo');
  const miloFrac = me ? me.y / SAFE_BOX.h : 0.5;
  drawBanner(ctx, label ?? 'COOKED.', 'tap to try again', miloFrac < 0.5 ? 0.82 : 0.20);
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
