// AUDIO — Bible §6.2, decision D5.
//
// EVERY SOUND IN THIS GAME IS SYNTHESISED AT RUNTIME. There are no audio
// files, and that is a design decision rather than a budget one — the payload
// headroom is enormous (40 KB used against a 15 MiB recommendation).
//
// WHY SYNTHESIS AND NOT RECORDED/GENERATED SAMPLES
//
// A sample is fixed. This game's entire claim is that the physics is honest:
// a boulder that lands hard kills, and the same boulder nudging your line is
// furniture. If both play the same "thunk", the audio contradicts the rule the
// player is being asked to learn. Here the impact sound is driven by
// normalSpeed — THE SAME NUMBER hazards.js uses to decide lethality — so what
// you hear is literally what nearly killed him. A sample cannot do that, and a
// library of twenty velocity-layered samples is a worse version of this.
//
// TWO CONSTRAINTS THAT SHAPE EVERYTHING HERE
//
//   1. NO INFORMATION IS EVER CARRIED BY AUDIO ALONE. The game is played
//      inside YouTube, frequently muted, often alongside the player's own
//      audio. Every sound here duplicates something already visible.
//
//   2. AUDIO MUST DIE INSTANTLY ON PAUSE. Certification requires onPause to
//      halt everything, audio included — suspend(), not "stop scheduling new
//      sounds". A playable that keeps humming in a backgrounded tab fails.
//
// And a third, from the browser rather than the platform: an AudioContext
// created before a user gesture starts suspended. So the context is built
// lazily on the first real input, and nothing before that makes a sound. That
// is correct behaviour, not a bug: a game that blares on load is a game people
// close.

let ctx = null;
let master = null;
let bed = null;
let enabled = true;
let suspended = false;

/** Last time each sound kind fired, to stop a 120 Hz physics step machine-gunning. */
const lastAt = new Map();

/**
 * Build the context. MUST be called from inside a user-gesture handler.
 * Safe to call repeatedly; safe to call in environments with no WebAudio.
 */
export function unlock() {
  if (ctx || !enabled) return;
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AC) { enabled = false; return; }
  try {
    ctx = new AC();
    master = ctx.createGain();
    // Deliberately conservative. This plays over whatever the person is
    // already listening to; it is a garnish, not a soundtrack.
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    startBed();
  } catch { enabled = false; ctx = null; }
  resume();
}

export function setEnabled(on) {
  enabled = on;
  if (master) master.gain.setTargetAtTime(on ? 0.5 : 0, now(), 0.02);
}

export const isEnabled = () => enabled;

// suspend() and resume() return PROMISES that can REJECT — a context that is
// closed, one that was never started, a browser refusing to resume without a
// fresh gesture. A bare try/catch catches the throw and misses the rejection
// entirely, which surfaces as an unhandled rejection in the console: exactly
// the noise that fails a Playables review, and it is invisible until someone
// looks. Swallow both paths.
const quietly = (p) => { try { p?.catch?.(() => {}); } catch { /* not a promise */ } };

export function pause() {
  suspended = true;
  try { quietly(ctx?.suspend?.()); } catch { /* nothing to do */ }
}

export function resume() {
  suspended = false;
  try { quietly(ctx?.resume?.()); } catch { /* nothing to do */ }
}

const now = () => (ctx ? ctx.currentTime : 0);
const ok = () => !!ctx && enabled && !suspended;

/** Rate-limit a sound kind. The physics runs at 120 Hz; ears do not. */
function throttled(kind, minGapMs) {
  const t = (ctx?.currentTime ?? 0) * 1000;
  const prev = lastAt.get(kind) ?? -1e9;
  if (t - prev < minGapMs) return false;
  lastAt.set(kind, t);
  return true;
}

// ── primitives ────────────────────────────────────────────────────────────

/** One short enveloped oscillator. The building block for nearly everything. */
function blip(type, freq, dur, gain, { sweepTo = null, delay = 0, detune = 0 } = {}) {
  if (!ok()) return;
  const t0 = now() + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (sweepTo) o.frequency.exponentialRampToValueAtTime(Math.max(1, sweepTo), t0 + dur);
  if (detune) o.detune.setValueAtTime(detune, t0);
  // A tiny attack rather than an instant one: a hard edge on a sine reads as a
  // click on small phone speakers.
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(master);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

/** Filtered noise — the body of every impact, scratch and whoosh. */
function noise(dur, gain, { type = 'lowpass', freq = 1200, q = 1, sweepTo = null, delay = 0 } = {}) {
  if (!ok()) return;
  const t0 = now() + delay;
  const n = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t0);
  f.Q.value = q;
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(Math.max(40, sweepTo), t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(Math.max(0.0002, gain), t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t0);
  src.stop(t0 + dur + 0.02);
}

// ── the ambient bed ───────────────────────────────────────────────────────
//
// Two detuned oscillators through a lowpass, near silent at rest. Its cutoff
// and gain are driven by Milo's danger scalar, so the room tightens as he gets
// closer to dying and relaxes when he is safe. It scores THIS run, which is
// the one thing a licensed loop could never do.

function startBed() {
  if (!ok()) return;
  const g = ctx.createGain();
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 220;
  g.gain.value = 0.0;
  const a = ctx.createOscillator(), b = ctx.createOscillator();
  a.type = 'sine'; a.frequency.value = 55;
  b.type = 'sine'; b.frequency.value = 55; b.detune.value = 9;   // slow beat
  a.connect(g); b.connect(g);
  g.connect(f).connect(master);
  a.start(); b.start();
  bed = { gain: g, filter: f };
}

/** Call once a frame with Milo's danger scalar (0..1). */
export function setDanger(danger) {
  if (!ok() || !bed) return;
  const d = Math.max(0, Math.min(1, danger || 0));
  bed.gain.gain.setTargetAtTime(0.012 + d * 0.10, now(), 0.25);
  bed.filter.frequency.setTargetAtTime(180 + d * 950, now(), 0.25);
}

// ── game sounds ───────────────────────────────────────────────────────────

/**
 * An impact, scaled by how hard it actually was.
 *
 * `speed` is the collision-normal relative speed in u/s — the same value
 * hazards.js thresholds at 400 for lethality. So a fatal hit is audibly a
 * different event from a bump, with no special-casing: the mapping does it.
 */
export function impact(speed, { heavy = false } = {}) {
  if (!ok()) return;
  const s = Math.max(0, Math.min(1, speed / 700));
  if (s < 0.05) return;                       // below this it is a scuff, not a hit
  if (!throttled('impact', 45)) return;
  const gain = 0.05 + s * 0.30;
  // Harder hits are LOWER and longer — the way mass actually sounds.
  noise(0.05 + s * 0.13, gain, {
    type: 'lowpass', freq: 900 + (1 - s) * 2600, sweepTo: 130 + (1 - s) * 400,
  });
  blip('sine', heavy ? 74 - s * 20 : 128 - s * 42, 0.10 + s * 0.12, gain * 0.75,
       { sweepTo: heavy ? 34 : 52 });
}

/** Pencil on paper, while the finger is down. Called as the stroke extends. */
export function scratch() {
  if (!ok() || !throttled('scratch', 34)) return;
  noise(0.035, 0.035, { type: 'bandpass', freq: 1900 + Math.random() * 1400, q: 1.2 });
}

/** The line commits and the world starts moving again. */
export function release() {
  if (!ok()) return;
  noise(0.09, 0.09, { type: 'highpass', freq: 700, sweepTo: 2600 });
  blip('triangle', 300, 0.14, 0.09, { sweepTo: 560 });
}

/** A stroke was refused — too long, too far, degenerate. Not a death. */
export function reject() {
  blip('square', 190, 0.09, 0.055, { sweepTo: 130 });
}

/** A switch fires. Deliberately bright and mechanical: this is a GOOD event. */
export function trigger() {
  blip('square', 620, 0.05, 0.05);
  blip('square', 930, 0.07, 0.045, { delay: 0.05 });
}

/** Milo dies. Falling, final, and short — it is followed by the death cam. */
export function death() {
  noise(0.30, 0.16, { type: 'lowpass', freq: 1500, sweepTo: 90 });
  blip('sawtooth', 210, 0.42, 0.11, { sweepTo: 48 });
}

/** Milo is out. Rising, resolved, and sized to the rating. */
export function success(stars = 1) {
  const root = 392;                                   // G4
  const steps = [0, 4, 7, 12].slice(0, Math.max(2, stars + 1));
  steps.forEach((semi, i) => {
    blip('triangle', root * Math.pow(2, semi / 12), 0.30, 0.085, { delay: i * 0.085 });
  });
  noise(0.22, 0.05, { type: 'highpass', freq: 1800, sweepTo: 5200 });
}

/**
 * A CLOSE CALL. A doppler whoosh past the ear, then one heartbeat thump.
 *
 * Pitched by how fast the thing was going, so a boulder at terminal velocity
 * and a ball drifting past do not sound alike — the same principle as impact().
 */
export function closeCall(speed = 400) {
  if (!ok() || !throttled('closeCall', 200)) return;
  const s = Math.max(0, Math.min(1, speed / 800));
  // The pass: a band of noise sweeping down past you.
  noise(0.26, 0.07 + s * 0.10, {
    type: 'bandpass', freq: 900 + s * 1800, sweepTo: 260, q: 2.2,
  });
  // The heart: one low thump, just after, because the fright lands late.
  blip('sine', 62, 0.22, 0.10, { sweepTo: 40, delay: 0.13 });
}

/** The whole game is finished. The only sound that is allowed to be big. */
export function ending() {
  [0, 7, 12, 16, 19].forEach((semi, i) => {
    blip('triangle', 261.6 * Math.pow(2, semi / 12), 1.1, 0.075, { delay: i * 0.12 });
  });
}

// ── test seam ─────────────────────────────────────────────────────────────
//
// Audio is the easiest subsystem in a game to ship broken, because silence
// throws no error. tools/test/audio.js renders these sounds through an
// OfflineAudioContext and measures the waveform, which needs two things it
// cannot get from the outside: the ability to rebuild the module's context
// against the offline one, and a look at the context's real state. Both are
// read-only or reset-only, and neither is reachable from gameplay.

export function __resetForTest() {
  ctx = null; master = null; bed = null; enabled = true; suspended = false;
  lastAt.clear();
}

export function __stateForTest() {
  return { ctx: ctx ? ctx.state : null, enabled, suspended, hasBed: !!bed };
}
