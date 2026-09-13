// Scene rendering — every edge goes through the ink system in stroke.js.
//
// Zero image assets: the whole art budget is stroke.js + rig.js + this file,
// which is what keeps the game near 200 KB against a 15 MiB recommended
// ceiling in a programme that prioritises fast loading.

import { view, applyTransform, visibleBounds } from '../view.js';
import { C } from './palette.js';
import { LINE, SAFE_BOX } from '../constants.js';
import { inkPath, inkShape, rectPoints, circlePoints } from './stroke.js';
import { drawMilo } from './rig.js';
import { drain, drawMotionStreaks } from './freeze.js';

export function clear(ctx) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, view.canvas.width, view.canvas.height);
}

/** Paper grain — a few hundred faint specks, seeded so it never shimmers. */
function grain(ctx, vb) {
  ctx.save();
  ctx.globalAlpha = 0.045;
  ctx.fillStyle = '#6B5E4C';
  let s = 1337;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  for (let i = 0; i < 420; i++) {
    ctx.fillRect(vb.x0 + rnd() * (vb.x1 - vb.x0), vb.y0 + rnd() * (vb.y1 - vb.y0), 2, 2);
  }
  ctx.restore();
}

export function drawScene(ctx, sim, opts = {}) {
  const {
    now = 0, freeze = 0, ghostPoints = null, livePoints = null,
    anchors = null, walkPhase = 0,
  } = opts;

  applyTransform(ctx);
  const vb = visibleBounds();

  // Slack outside the safe box is background only — never puzzle geometry.
  ctx.fillStyle = drain(C.paperDark, freeze * 0.5);
  ctx.fillRect(vb.x0, vb.y0, vb.x1 - vb.x0, vb.y1 - vb.y0);
  ctx.fillStyle = drain(C.paper, freeze * 0.5);
  ctx.fillRect(0, 0, SAFE_BOX.w, SAFE_BOX.h);
  grain(ctx, vb);

  // ── static geometry ───────────────────────────────────────────────────
  for (const s of sim.statics) {
    const b = s.spec;
    ctx.save();
    if (b.angle) {
      ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
      ctx.rotate(b.angle * Math.PI / 180);
      ctx.translate(-(b.x + b.w / 2), -(b.y + b.h / 2));
    }
    inkShape(ctx, rectPoints(b.x, b.y, b.w, b.h), {
      now, fill: drain(C.staticFill, freeze * 0.55), ink: drain(C.ink, freeze * 0.35),
      width: 3.4, salt: b.x | 0,
    });
    // A thin shelf floating in mid-air reads as an unfinished placeholder.
    // Diagonal brackets cost nothing and make it read as a fixed structure —
    // which also tells the player, truthfully, that it is something solid to
    // anchor to. Never uses the danger accent.
    if (b.h <= 40 && b.y < 1000 && !b.angle) {
      const ink = drain(C.ink, 0.45 + freeze * 0.3);
      for (const sx of [b.x + 8, b.x + b.w - 8]) {
        const dir = sx < b.x + b.w / 2 ? 1 : -1;
        inkPath(ctx, [
          { x: sx, y: b.y + b.h },
          { x: sx + dir * 16, y: b.y + b.h + 20 },
        ], { now, colour: ink, width: 2.6, salt: (b.x + sx) | 0, passes: 1 });
      }
    }
    ctx.restore();
  }

  // ── lethal zones ──────────────────────────────────────────────────────
  // These were invisible until now, which is a readability bug, not a polish
  // gap: A2 and A4 both kill you with a zone, and a hazard the player cannot
  // see breaks the one rule the whole design rests on — that you can parse a
  // level in a glance without instruction.
  //
  // Drawn as spikes in the danger accent. SHAPE carries the meaning and colour
  // only reinforces it (§47): spiky silhouette = touch it and you die.
  for (const z of sim.zones ?? []) {
    if (!z.lethal) continue;
    const teeth = Math.max(3, Math.round(z.w / 34));
    const pts = [{ x: z.x, y: z.y + z.h }];
    for (let i = 0; i < teeth; i++) {
      const x0 = z.x + (i / teeth) * z.w;
      pts.push({ x: x0 + z.w / teeth / 2, y: z.y - 14 });
      pts.push({ x: x0 + z.w / teeth, y: z.y + 6 });
    }
    pts.push({ x: z.x + z.w, y: z.y + z.h });
    inkShape(ctx, pts, { now, fill: C.danger, ink: C.ink, width: 3, salt: 777 });
  }

  // ── goal — the only soft light in the scene ───────────────────────────
  const g = sim.goal;
  ctx.save();
  ctx.globalAlpha = 0.35 * (1 - freeze * 0.4);
  ctx.fillStyle = C.goalGlow;
  ctx.beginPath();
  ctx.ellipse(g.x, g.y - g.h / 2, g.w * 1.5, g.h * 1.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  inkShape(ctx, rectPoints(g.x - g.w / 2, g.y - g.h, g.w, g.h), {
    now, fill: drain(C.goal, freeze * 0.5), ink: drain(C.ink, freeze * 0.35),
    width: 3.4, salt: 991,
  });
  // a little flag, so the goal reads as "safety" rather than "green box"
  inkPath(ctx, [
    { x: g.x, y: g.y - g.h }, { x: g.x, y: g.y - g.h - 34 },
    { x: g.x + 26, y: g.y - g.h - 26 }, { x: g.x, y: g.y - g.h - 18 },
  ], { now, colour: drain(C.ink, freeze * 0.35), width: 3, salt: 992 });

  // ── ghost of the previous attempt ─────────────────────────────────────
  if (ghostPoints?.length > 1) {
    ctx.globalAlpha = 0.9;
    inkPath(ctx, ghostPoints, { now, colour: C.ghost, width: LINE.thickness * 0.7, salt: 55, passes: 1 });
    ctx.globalAlpha = 1;
  }

  // ── the committed stroke ──────────────────────────────────────────────
  if (sim.stroke) drawStrokeBody(ctx, sim.stroke, now);

  // ── hazards — THE accent, and nothing else may use it ─────────────────
  const moving = [];
  for (const { body, spec } of sim.objects.values()) {
    // Danger keeps its colour through the freeze: it is the thing that is
    // going to kill him, so it is the one thing that must not drain.
    const fill = C.danger;
    if (spec.radius) {
      inkShape(ctx, circlePoints(body.position.x, body.position.y, spec.radius), {
        now, fill, ink: C.ink, width: 3.6, salt: 301,
      });
      // orientation tick, so rolling is visible
      inkPath(ctx, [
        { x: body.position.x, y: body.position.y },
        {
          x: body.position.x + Math.cos(body.angle) * spec.radius * 0.8,
          y: body.position.y + Math.sin(body.angle) * spec.radius * 0.8,
        },
      ], { now, colour: C.ink, width: 2.6, salt: 302, passes: 1 });
      moving.push({ body, radius: spec.radius });
    }
  }

  drawMotionStreaks(ctx, moving, freeze);
  drawMilo(ctx, sim.milo, now, walkPhase);

  // ── anchor sparks — this one VFX carries the whole stability model ────
  if (anchors?.length) {
    ctx.save();
    for (const a of anchors) {
      ctx.strokeStyle = C.anchor;
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      for (let k = 0; k < 4; k++) {
        const ang = (k / 4) * Math.PI * 2 + 0.4;
        ctx.beginPath();
        ctx.moveTo(a.x + Math.cos(ang) * 4, a.y + Math.sin(ang) * 4);
        ctx.lineTo(a.x + Math.cos(ang) * 9, a.y + Math.sin(ang) * 9);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ── the stroke in progress ────────────────────────────────────────────
  if (livePoints?.length > 1) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    inkPath(ctx, livePoints, { now, colour: C.strokeGlow, width: LINE.thickness + 10, salt: 3, passes: 1 });
    ctx.restore();
    inkPath(ctx, livePoints, { now, colour: C.stroke, width: LINE.thickness, salt: 3 });
  }
}

/** A committed stroke is drawn from its physics parts, so it visibly moves. */
function drawStrokeBody(ctx, body, now) {
  const parts = body.parts.length > 1 ? body.parts.slice(1) : [body];
  const spine = parts.map((p) => ({ x: p.position.x, y: p.position.y }));
  if (spine.length < 2) {
    const v = parts[0].vertices;
    inkPath(ctx, [{ x: v[0].x, y: v[0].y }, { x: v[2].x, y: v[2].y }],
            { now, colour: C.stroke, width: LINE.thickness, salt: 21 });
    return;
  }
  ctx.save();
  ctx.globalAlpha = 0.22;
  inkPath(ctx, spine, { now, colour: C.strokeGlow, width: LINE.thickness + 9, salt: 21, passes: 1 });
  ctx.restore();
  inkPath(ctx, spine, { now, colour: C.stroke, width: LINE.thickness, salt: 21 });
}

export { drawMilo };
