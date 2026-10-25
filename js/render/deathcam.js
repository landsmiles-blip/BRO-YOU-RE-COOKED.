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
import { C, HAND } from './palette.js';
import { MILO, LINE, DEATH_CAM, SAFE_BOX, PHYSICS_DT } from '../constants.js';
import { drawBanner } from './hud.js';
import { blastPath, plateShape, drawPaper } from './world.js';
import { hatchRect } from './stroke.js';

export function drawReplay(ctx, sim, frameIdx, label, culpritId) {
  applyTransform(ctx);
  // The same page as the level, a shade greyer, so a replay reads as one.
  drawPaper(ctx, { x0: -2000, y0: -2000, x1: 6000, y1: 6000 }, 0.6);

  // The sim time this frame shows. The recorder keeps every step, newest
  // last, so frame i is (n-1-i) steps before the end of the run. Anything that
  // CHANGES during a run — a board a blast broke, the blast itself — has to be
  // drawn as it was at this moment, not as it ended up.
  const nFrames = sim.recorder.frames.length;
  const tFrame = sim.simTime - (nFrames - 1 - Math.min(frameIdx, nFrames - 1)) * PHYSICS_DT;

  // static geometry stays put
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(51,54,59,0.45)';
  ctx.fillStyle = C.staticFill;
  for (const s of sim.statics) {
    // EVERY NEW KIND OF THING HAS TO BE ADDED HERE TOO. The default for
    // anything new is INVISIBLE, and that has now cost two replays that
    // explained the wrong mechanism — a death cam with no air in it, and one
    // that drew the player's own line as a fixed dash. A pane that broke must
    // read as broken, or the replay says the floor held.
    const brokenAt = s.spec.breakable ? sim.broken?.get(s.spec.id) : undefined;
    const gone = (s.spec.brittle && sim.shattered?.has(s.spec.id))
      || (brokenAt !== undefined && brokenAt <= tFrame);
    if (gone) {
      ctx.setLineDash([7, 9]);
      ctx.strokeRect(s.spec.x, s.spec.y, s.spec.w, s.spec.h);
      ctx.setLineDash([]);
      continue;
    }
    // A breakable board is wood here too: the replay must say which part of
    // the wall a blast could take down.
    if (s.spec.breakable) ctx.fillStyle = 'rgba(203,174,130,0.75)';
    ctx.fillRect(s.spec.x, s.spec.y, s.spec.w, s.spec.h);
    if (!s.spec.breakable) hatchRect(ctx, s.spec.x, s.spec.y, s.spec.w, s.spec.h, C.hatch);
    ctx.strokeRect(s.spec.x, s.spec.y, s.spec.w, s.spec.h);
    if (s.spec.breakable) ctx.fillStyle = C.staticFill;
    if (s.spec.brittle) {
      const n = Math.max(2, Math.round(s.spec.w / 58));
      for (let c = 0; c < n; c++) {
        const x0 = s.spec.x + ((c + 0.5) / n) * s.spec.w;
        ctx.beginPath();
        ctx.moveTo(x0 - 7, s.spec.y);
        ctx.lineTo(x0 + 2, s.spec.y + s.spec.h * 0.5);
        ctx.lineTo(x0 - 4, s.spec.y + s.spec.h);
        ctx.stroke();
      }
    }
  }

  // PLATES AND GATES. Both are STATIC bodies, and the recorder keeps only what
  // moves — so neither was ever drawn here, on any level. Found by filming a
  // LOSS on a trigger level: Milo walked into a shut gate and the replay showed
  // him stopped by empty air, with no plate to say what would have opened it.
  // The same shapes as live play — arrows on a plate that has not fired, a lit
  // and sunken plate that has, bars on a shut gate, a ghost of an open one —
  // drawn flat, because the replay is scrubbed by frame.
  for (const { spec } of sim.objects.values()) {
    if (spec.type !== 'switch' && spec.type !== 'gate') continue;
    const fired = sim.triggered?.has(spec.id);
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(51,54,59,0.55)';
    ctx.fillStyle = C.plank;
    if (spec.type === 'switch') {
      // The same shape and arrows as live play, from the one definition —
      // including which side a plate is pressed from.
      const { y, h, arrows } = plateShape(spec, fired);
      if (fired) ctx.fillStyle = C.anchor;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(spec.x, y, spec.w, h);
      ctx.strokeRect(spec.x, y, spec.w, h);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const a of arrows) {
        ctx.beginPath();
        a.shaft.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        a.head.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();
      }
    } else {
      ctx.globalAlpha = fired ? 0.22 : 0.8;
      if (fired) {
        ctx.translate(spec.x + spec.w / 2, spec.y);
        ctx.rotate(-1.1);
        ctx.translate(-(spec.x + spec.w / 2), -spec.y);
      }
      ctx.fillRect(spec.x, spec.y, spec.w, spec.h);
      ctx.strokeRect(spec.x, spec.y, spec.w, spec.h);
      ctx.beginPath();
      for (let i = 1; i <= 3; i++) {
        const y = spec.y + (spec.h * i) / 4;
        ctx.moveTo(spec.x, y); ctx.lineTo(spec.x + spec.w, y);
      }
      ctx.stroke();
    }
    ctx.restore();
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

  // MOVING AIR. Same omission as the spikes above, found the same way — by
  // finally filming a LOSS instead of a win. On the duct level the replay
  // showed a roof, two posts and a falling rock, with no hint that AIR is what
  // carried it up and along. The one screen whose job is to explain was
  // explaining the wrong mechanism: it looked like the rock had simply fallen.
  //
  // Drawn flat rather than animated, because the replay is scrubbed by frame
  // and a wall-clock animation would slide around underneath it. The chevrons
  // still point along the real flow vector, for the reason world.js does.
  for (const z of sim.level?.zones ?? []) {
    if (z.kind !== 'updraft') continue;
    const ang = Math.atan2(z.ax ?? 0, -(z.accel ?? -2600));
    const across = z.w * Math.abs(Math.cos(ang)) + z.h * Math.abs(Math.sin(ang));
    const along = z.w * Math.abs(Math.sin(ang)) + z.h * Math.abs(Math.cos(ang));
    ctx.save();
    ctx.beginPath(); ctx.rect(z.x, z.y, z.w, z.h); ctx.clip();
    ctx.fillStyle = C.air; ctx.globalAlpha = 0.14;
    ctx.fillRect(z.x, z.y, z.w, z.h);
    ctx.translate(z.x + z.w / 2, z.y + z.h / 2);
    ctx.rotate(ang);
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = C.air; ctx.lineWidth = 3;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const cols = Math.max(2, Math.round(across / 76));
    for (let y = along / 2; y > -along / 2 - 46; y -= 46) {
      for (let i = 0; i < cols; i++) {
        const cx = across * ((i + 0.5) / cols - 0.5);
        ctx.beginPath();
        ctx.moveTo(cx - 22, y + 11); ctx.lineTo(cx, y); ctx.lineTo(cx + 22, y + 11);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // HIVES. Static and bodiless, so the recorder never sees them — the same
  // trap as the plates. A swarm replayed with no hive is bees from nowhere.
  for (const h of sim.hives ?? []) {
    const r = h.radius, base = h.y + r * 0.3;
    ctx.save();
    ctx.fillStyle = C.plank; ctx.globalAlpha = 0.8;
    ctx.strokeStyle = 'rgba(51,54,59,0.55)'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(h.x, base, r, r * 1.2, 0, Math.PI, Math.PI * 2);
    ctx.lineTo(h.x + r * 0.9, h.y + r * 0.8); ctx.lineTo(h.x - r * 0.9, h.y + r * 0.8);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.ink;
    ctx.beginPath(); ctx.ellipse(h.x, h.y + r * 0.58, r * 0.3, r * 0.17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // WHERE HE WAS TRYING TO GET TO. Without it there is no sense of direction
  // or of how close he came.
  const g = sim.level?.goal;
  if (g) {
    ctx.fillStyle = 'rgba(76,179,119,0.45)';
    ctx.fillRect(g.x - g.w / 2, g.y - g.h, g.w, g.h);
    ctx.strokeStyle = 'rgba(51,54,59,0.35)';
    ctx.strokeRect(g.x - g.w / 2, g.y - g.h, g.w, g.h);
  }

  // THE BLAST, once it has happened in this frame: the reach as a dashed ring
  // and the kill radius in red — the replay of a blast death has to show the
  // ring he was standing inside, or it explains nothing. Both are drawn where
  // the blast actually REACHED, so a wall that stopped it shows as the place
  // the ring stops.
  for (const bl of sim.blasts ?? []) {
    if (bl.t > tFrame) continue;
    ctx.save();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'rgba(51,54,59,0.45)'; ctx.lineWidth = 2;
    blastPath(ctx, bl, bl.radius); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = C.danger; ctx.lineWidth = 4;
    blastPath(ctx, bl, bl.kill); ctx.stroke();
    ctx.restore();
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
      ctx.strokeStyle = guilty ? C.danger : 'rgba(51,54,59,0.55)';
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
    } else if (sim.objects.get(f.id)?.spec.type === 'bee') {
      // A BEE replays as a bee — red, striped, winged — and side-on as in
      // play, so it is drawn upright whatever its body has spun to. The one
      // that got him is ringed: in a swarm of twelve, "which one" is the
      // question the replay exists to answer.
      ctx.rotate(-f.a);
      const back = frames[Math.max(0, Math.min(frameIdx, frames.length - 1) - 4)]?.find((q) => q.id === f.id);
      const r = sim.objects.get(f.id).spec.radius;
      if (back && f.x < back.x - 0.3) ctx.scale(-1, 1);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.ellipse(-1, -r * 1.05, r * 0.55, r * 0.6, -0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.danger; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, 0, r * 1.3, r * 0.9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      for (const sx of [-r * 0.45, r * 0.2]) { ctx.moveTo(sx, -r * 0.82); ctx.lineTo(sx, r * 0.82); }
      ctx.stroke();
      if (guilty) {
        ctx.strokeStyle = C.danger; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, r + 12, 0, Math.PI * 2); ctx.stroke();
      }
    } else if (sim.objects.get(f.id)?.spec.type === 'dog') {
      // THE DOG, flat like everything here, facing the way it was going —
      // read from where it was a few frames earlier, since which way it walks
      // is the whole of the dog. Never in the danger colour, even when it is
      // what the run lost: it is the victim, not the threat. A ring says it.
      const back = frames[Math.max(0, Math.min(frameIdx, frames.length - 1) - 6)]?.find((q) => q.id === f.id);
      const spec = sim.objects.get(f.id).spec;
      const dir = back && Math.abs(f.x - back.x) > 0.5 ? Math.sign(f.x - back.x) : (spec.dir ?? 1);
      ctx.scale(dir, 1);
      ctx.fillStyle = C.dog; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (const x of [11, 5, -9, -15]) { ctx.moveTo(x, 1); ctx.lineTo(x, 15); }
      ctx.moveTo(-18, -4); ctx.lineTo(-25, -16);
      ctx.stroke();
      ctx.beginPath(); ctx.rect(-20, -10, 34, 15); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(15, -13, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.ink;
      ctx.beginPath(); ctx.moveTo(8, -21); ctx.lineTo(14, -22); ctx.lineTo(11, -8); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(28, -12, 2.5, 0, Math.PI * 2); ctx.fill();
      if (guilty) {
        ctx.setLineDash([6, 6]); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(2, -4, 40, 0, Math.PI * 2); ctx.stroke();
      }
    } else {
      const spec = sim.objects.get(f.id)?.spec;
      // everything desaturates except the culprit
      ctx.fillStyle = guilty ? C.danger : 'rgba(160,150,140,0.7)';
      // A BALLOON KEEPS ITS TAIL HERE TOO. Same rule the air just paid for:
      // deathcam draws its own subset and the default for anything new is
      // INVISIBLE, so a thing that falls upwards would replay as a grey ball
      // dropping — the replay explaining the opposite of what happened.
      if (spec?.lift) {
        ctx.strokeStyle = guilty ? C.ink : 'rgba(51,54,59,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, spec.radius);
        ctx.lineTo(-5, spec.radius + 9);
        ctx.lineTo(5, spec.radius + 18);
        ctx.lineTo(-3, spec.radius + 26);
        ctx.stroke();
      }
      ctx.strokeStyle = guilty ? C.ink : 'rgba(51,54,59,0.4)';
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
      } else if (spec?.type === 'tnt') {
        // A barrel replays as a barrel — red, banded, named — never as a ball.
        const r = spec.radius;
        ctx.fillStyle = C.danger;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = C.paper;
        ctx.font = `900 ${Math.round(r * 0.62)}px ${HAND}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('TNT', 0, 1);
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
  const bannerY = miloFrac < 0.5 ? 0.82 : 0.20;
  drawBanner(ctx, label ?? 'COOKED.', 'tap to try again', bannerY);
  // Where the banner went, so anything that belongs beside it (the skip) can
  // sit next to it rather than on top of the death.
  return bannerY;
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
