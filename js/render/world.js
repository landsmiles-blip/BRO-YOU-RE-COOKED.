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
import { isHazardous } from '../hazards.js';

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
    // Does the line currently being drawn reach something solid? null while
    // nothing is being drawn. See the live-stroke block at the bottom.
    liveHolds = null,
    // Draw the "you can attach here" marks. Only while the world is frozen and
    // the player is choosing where to draw.
    showAnchorable = false,
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
    if (s.pivoted) {
      // A PINNED PIECE MUST BE DRAWN FROM ITS BODY, NOT ITS SPEC. Everything
      // else here is drawn from the authored rectangle because it never moves;
      // a see-saw that tilts and a pendulum that swings would both be rendered
      // frozen in their starting pose, which is the exact class of bug that has
      // shipped twice in this project — a picture that disagrees with the sim.
      // Put the authored rect's centre at the body's position, turned by the
      // body's angle: translate to where it now is, rotate, then step back by
      // the authored centre so the rect draws around it.
      ctx.translate(s.body.position.x, s.body.position.y);
      ctx.rotate(s.body.angle);
      ctx.translate(-(b.x + b.w / 2), -(b.y + b.h / 2));
    } else if (b.angle) {
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

    // THE PIN ITSELF. A plank lying at an angle with nothing holding it is a
    // fallen plank; the same plank with a visible pin through it is a lever.
    // Drawn in the UNROTATED frame, because the pin does not turn with the arm.
    if (s.pivoted) {
      ctx.restore();
      ctx.save();
      const pv = b.pivot;
      const ink = drain(C.ink, freeze * 0.35);
      ctx.beginPath();
      ctx.arc(pv.x, pv.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = drain(C.pivot, freeze * 0.3);
      ctx.fill();
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = ink;
      ctx.stroke();
    }

    // A SPRINGBOARD MUST READ AS ONE BEFORE IT EVER MOVES. The player gets one
    // look at a frozen world, and "this ground is springy" is not something a
    // grey slab can say. A coil along the top edge says it in the only language
    // available at a standstill — and it has to, because the ball's first hop
    // happens after the freeze is released.
    if (b.restitution) {
      // Bigger than it looks like it needs to be. The first pass drew a 9-unit
      // coil at 3.2 wide, and the frozen frame showed a hairline scribble in
      // the dirt — a mechanic the player cannot see has not been introduced.
      const coil = drain(C.spring, freeze * 0.3);
      const step = 28, amp = 16, y0 = b.y - 4;
      const zig = [];
      for (let i = 0, x = b.x + 6; x <= b.x + b.w - 6; x += step / 2, i++) {
        zig.push({ x, y: y0 - (i % 2 ? amp : 0) });
      }
      if (zig.length > 1) {
        inkPath(ctx, zig, { now, colour: coil, width: 4.0, salt: b.y | 0, passes: 1 });
        // A solid rail over the coil: this is a BOARD on springs, and a zigzag
        // on its own reads as damage rather than as a mechanism.
        inkPath(ctx, [{ x: b.x + 2, y: y0 + 4 }, { x: b.x + b.w - 2, y: y0 + 4 }],
          { now, colour: coil, width: 5.0, salt: (b.x + 7) | 0, passes: 1 });
      }
    }
    ctx.restore();
  }


  // ── where you may NOT draw ────────────────────────────────────────────
  //
  // denyZones were implemented and enforced in drawing/validate.js from M0 and
  // drawn by NOTHING. The first level to use them shipped a hint reading "YOU
  // CANNOT DRAW IN THE RED" over a screen with no red on it — a rule the player
  // could only discover by breaking it.
  //
  // Hatched, not filled: a solid block reads as SOLID, and the one thing these
  // are not is something your line can rest on. Diagonal bars say "nothing
  // here" in a way a slab never can.
  if (showAnchorable) {
    for (const z of sim.level?.drawing?.denyZones ?? []) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(z.x, z.y, z.w, z.h);
      ctx.clip();
      ctx.globalAlpha = 0.13;
      ctx.fillStyle = C.danger;
      ctx.fillRect(z.x, z.y, z.w, z.h);
      ctx.globalAlpha = 0.30;
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 3;
      for (let x = z.x - z.h; x < z.x + z.w; x += 22) {
        ctx.beginPath();
        ctx.moveTo(x, z.y + z.h);
        ctx.lineTo(x + z.h, z.y);
        ctx.stroke();
      }
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 6]);
      ctx.strokeRect(z.x, z.y, z.w, z.h);
      ctx.restore();
    }
  }

  // ── what you can attach to ────────────────────────────────────────────
  //
  // The anchoring rule decides every single run: a stroke touching static
  // geometry is welded and holds, a stroke touching nothing falls. It was
  // invisible. Nothing in the frame distinguished "solid thing you can build
  // from" from "background", so the most natural action in the game — drawing
  // in mid-air, under the danger, where the danger is — failed silently and
  // taught nothing.
  //
  // These are deliberately faint hatch ticks rather than an outline or a glow:
  // they must read as "this edge is solid" at a glance and then disappear from
  // attention, because they are on screen while the player is composing. They
  // show only during the freeze, and only on the edges the anchor test
  // actually samples.
  if (showAnchorable) {
    ctx.save();
    ctx.strokeStyle = C.anchor;
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = 3.4;
    ctx.lineCap = 'round';
    for (const st of sim.statics) {
      const b = st.spec;
      if (b.angle) continue;                      // ticks would lie on a rotated edge
      const step = 22;
      const n = Math.max(2, Math.floor(b.w / step));
      for (let i = 0; i <= n; i++) {
        const x = b.x + (i / n) * b.w;
        ctx.beginPath();
        ctx.moveTo(x, b.y - 2);
        ctx.lineTo(x + 9, b.y - 13);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ── moving air ────────────────────────────────────────────────────────
  //
  // Chevrons climbing the column, on a loop tied to wall-clock time so the
  // thing is obviously MOVING even in a still frame — the one property that
  // separates it from a decorative pale rectangle. Never the danger accent:
  // it does not kill, it lifts, and the player has to be able to trust that
  // on sight.
  for (const z of sim.zones ?? []) {
    if (z.kind !== 'updraft') continue;
    ctx.save();
    ctx.beginPath(); ctx.rect(z.x, z.y, z.w, z.h); ctx.clip();
    ctx.fillStyle = C.air;
    ctx.globalAlpha = 0.10;
    ctx.fillRect(z.x, z.y, z.w, z.h);

    const period = 46;
    const drift = ((now / 9) % period + period) % period;
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = C.air;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let y = z.y + z.h + period - drift; y > z.y - period; y -= period) {
      for (const f of [0.3, 0.7]) {
        const cx = z.x + z.w * f;
        ctx.beginPath();
        ctx.moveTo(cx - z.w * 0.16, y + 11);
        ctx.lineTo(cx, y);
        ctx.lineTo(cx + z.w * 0.16, y + 11);
        ctx.stroke();
      }
    }
    ctx.restore();
    // Edges, so the column has a boundary you can aim at.
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = C.air;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(z.x, z.y); ctx.lineTo(z.x, z.y + z.h);
    ctx.moveTo(z.x + z.w, z.y); ctx.lineTo(z.x + z.w, z.y + z.h);
    ctx.stroke();
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

  // ── objects ───────────────────────────────────────────────────────────
  //
  // EVERY object type must draw. This loop used to be `if (spec.radius)` with
  // no else, so ONLY circles were ever rendered — which meant A7's plank and
  // the plate AND gate in both chain-reaction levels were completely
  // INVISIBLE. Milo walked off an empty ledge into spikes for no reason a
  // player could see, and the switch levels were unplayable by definition:
  // you cannot aim a rock at a target that is not drawn.
  //
  // The single-accent rule still holds: the danger colour marks what KILLS.
  // A plank you stand on and a gate that blocks you are obstacles, not
  // hazards, so they take neutral ink — and shape carries the meaning either
  // way, per the accessibility rule.
  const moving = [];
  for (const { body, spec } of sim.objects.values()) {
    // Danger accent iff this thing can actually kill by touch. Testing
    // `kind !== 'zone'` was wrong the moment a prop could declare
    // `kind: 'none'` — it would have painted the safe plank red again.
    const lethal = isHazardous(spec.lethal);
    const opened = sim.triggered?.has(spec.id);

    if (spec.radius) {
      inkShape(ctx, circlePoints(body.position.x, body.position.y, spec.radius), {
        now, fill: lethal ? C.danger : C.staticFill, ink: C.ink, width: 3.6, salt: 301,
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
      continue;
    }

    if (spec.type === 'switch') {
      drawPlate(ctx, spec, opened, now, freeze);
      continue;
    }
    if (spec.type === 'gate') {
      drawGate(ctx, spec, opened, now, freeze);
      continue;
    }

    // Any other rectangle — planks, crates, moving walls. Drawn from the
    // body's OWN vertices so rotation is honest.
    drawRectBody(ctx, body, lethal ? C.danger : C.plank, now, 331);
    moving.push({ body, radius: Math.max(spec.w ?? 20, spec.h ?? 20) / 2 });
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
  //
  // TWO INKS, AND THE DIFFERENCE IS THE WHOLE STABILITY MODEL.
  //
  // Solid ink: this line reaches something solid and will HOLD.
  // Hollow, dashed ink: it reaches nothing and WILL FALL the moment you let go.
  //
  // Measured on A1 before this existed: a stroke drawn in mid-air under the
  // ball — where the danger is, where anyone would draw — got zero anchors,
  // stayed dynamic, fell, and Milo died at 1017ms. Correct physics, correct
  // rule, and no way whatsoever for the player to know before committing.
  // Telling them DURING the drag costs one predicate and removes the only
  // unfair thing in the game.
  //
  // `liveHolds` comes from the same function that does the welding, so this
  // cannot drift out of agreement with what release actually does.
  if (livePoints?.length > 1) {
    const holds = liveHolds !== false;
    ctx.save();
    ctx.globalAlpha = 0.25;
    inkPath(ctx, livePoints, {
      now, colour: holds ? C.strokeGlow : C.dim,
      width: LINE.thickness + 10, salt: 3, passes: 1,
    });
    ctx.restore();

    if (holds) {
      inkPath(ctx, livePoints, { now, colour: C.stroke, width: LINE.thickness, salt: 3 });
    } else {
      // BROKEN ink at full line thickness: the line is the right size and
      // weight, but visibly not joined up. Shape carries the meaning, not
      // colour or opacity alone — the accessibility rule applies to feedback
      // as much as to hazards, and a player with the sound off and low
      // contrast still has to see it.
      inkPath(ctx, livePoints, {
        now, colour: C.stroke, width: LINE.thickness, salt: 3,
        passes: 1, alpha: 0.55, dash: [16, 13],
      });
    }
  }
}

/**
 * The committed stroke, drawn from ITS OWN geometry.
 *
 * `body.strokePath` is the simplified path the player drew, stored in local
 * space at build time and transformed here by the body's live position and
 * angle. Exact for static or dynamic, 1 part or 30 — and identical to what was
 * on screen a frame earlier while they were still drawing it.
 *
 * The previous version rebuilt the line from part centres (segment midpoints),
 * so it lost half a segment at each end and visibly SHRANK the instant it
 * committed. One geometry, one renderer, no special cases.
 */
function drawStrokeBody(ctx, body, now) {
  const local = body.strokePath;
  if (!local || local.length < 2) return;

  const cos = Math.cos(body.angle), sin = Math.sin(body.angle);
  const pts = local.map((p) => ({
    x: body.position.x + p.x * cos - p.y * sin,
    y: body.position.y + p.x * sin + p.y * cos,
  }));

  ctx.save();
  ctx.globalAlpha = 0.22;
  inkPath(ctx, pts, { now, colour: C.strokeGlow, width: LINE.thickness + 9, salt: 21, passes: 1 });
  ctx.restore();
  inkPath(ctx, pts, { now, colour: C.stroke, width: LINE.thickness, salt: 21 });
}

/** A rectangular body, drawn from its real vertices so rotation is honest. */
function drawRectBody(ctx, body, fill, now, salt) {
  const parts = body.parts.length > 1 ? body.parts.slice(1) : [body];
  for (const p of parts) {
    inkShape(ctx, p.vertices.map((v) => ({ x: v.x, y: v.y })),
             { now, fill, ink: C.ink, width: 3.2, salt });
  }
}

/** A pressure plate. Visibly depresses and lights once it has fired. */
function drawPlate(ctx, spec, fired, now, freeze) {
  const y = spec.y + (fired ? 8 : 0);
  inkShape(ctx, rectPoints(spec.x, y, spec.w, spec.h - (fired ? 8 : 0)), {
    now, fill: fired ? C.anchor : drain(C.plank, freeze * 0.3), ink: C.ink, width: 3.2, salt: 411,
  });
  // two arrows pressing down on it — reads as "put something heavy here"
  if (!fired) {
    for (const fx of [0.3, 0.7]) {
      const x = spec.x + spec.w * fx;
      inkPath(ctx, [{ x, y: y - 30 }, { x, y: y - 8 }],
              { now, colour: C.ink, width: 2.6, salt: 412, passes: 1 });
      inkPath(ctx, [{ x: x - 7, y: y - 16 }, { x, y: y - 6 }, { x: x + 7, y: y - 16 }],
              { now, colour: C.ink, width: 2.6, salt: 413, passes: 1 });
    }
  }
}

/** A gate. Barred when shut; swung aside and ghosted once open. */
function drawGate(ctx, spec, open, now, freeze) {
  ctx.save();
  if (open) {
    ctx.globalAlpha = 0.22;
    ctx.translate(spec.x + spec.w / 2, spec.y);
    ctx.rotate(-1.1);
    ctx.translate(-(spec.x + spec.w / 2), -spec.y);
  }
  inkShape(ctx, rectPoints(spec.x, spec.y, spec.w, spec.h), {
    now, fill: drain(C.plank, freeze * 0.3), ink: C.ink, width: 3.4, salt: 421,
  });
  for (let i = 1; i <= 3; i++) {
    const y = spec.y + (spec.h * i) / 4;
    inkPath(ctx, [{ x: spec.x, y }, { x: spec.x + spec.w, y }],
            { now, colour: C.ink, width: 2.4, salt: 422 + i, passes: 1 });
  }
  ctx.restore();
}

export { drawMilo };
