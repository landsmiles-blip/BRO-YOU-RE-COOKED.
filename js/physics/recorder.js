// Ring buffer of body transforms, for the death-cam replay (Bible §3.3b).
//
// Cheap: the last 1.4s at 120Hz is 168 frames of {x,y,angle} per body, and
// this scene has a handful of bodies. Recording beats re-simulating because
// the replay is guaranteed to be what the player actually just watched.

import { DEATH_CAM, PHYSICS_HZ } from '../constants.js';

const CAPACITY = Math.ceil((DEATH_CAM.replayMs / 1000) * PHYSICS_HZ) + 8;

export function createRecorder() {
  return { frames: [], capacity: CAPACITY };
}

export function record(rec, bodies) {
  const frame = [];
  for (const b of bodies) {
    if (b.isStatic) continue;
    frame.push({ id: b.gameId, x: b.position.x, y: b.position.y, a: b.angle });
  }
  rec.frames.push(frame);
  if (rec.frames.length > rec.capacity) rec.frames.shift();
}

export function reset(rec) { rec.frames.length = 0; }
