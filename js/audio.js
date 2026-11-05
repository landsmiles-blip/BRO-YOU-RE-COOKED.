// AUDIO — Bible §6.2, decision D5.
//
// EVERY SOUND IN THE YOUTUBE AND WEB BUILDS IS SYNTHESISED AT RUNTIME. There
// are no audio files there, and that is a design decision rather than a budget
// one — the payload headroom is enormous (40 KB used against a 15 MiB
// recommendation).
//
// AMENDED 5 Nov 2026 (D15), FOR THE PLAYGAMA BUILD ONLY. Playgama's rules
// (3.3.1, 3.3.2) require recorded sound and music and refuse "sound
// synthesised in code", so that build ships a bank of CC0 recordings
// (assets/audio/playgama, embedded by tools/build.js as globalThis.BYC_SAMPLES)
// and this module plays those instead. Nothing is synthesised in that mode: no
// oscillator is created. The principle of D5a survives: an impact still picks
// its recording (light, medium, heavy) and its volume from normalSpeed — the
// same number hazards.js thresholds at 400 — so a fatal hit is still audibly a
// different event from a bump. Where no recording exists (the bee buzz) the
// game is silent there. The two builds without BYC_SAMPLES are unchanged.
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
 * Build the context. Called from every user gesture, and inside Playables
 * also at start (js/main.js), where YouTube may already allow sound and a
 * game that waits for a tap is the commonest audio failure in certification.
 * A context built before the browser allows sound starts suspended, so a
 * gesture resumes one that already exists. Never while paused: onPause holds
 * the sound down, and onResume comes first.
 * Safe to call repeatedly; safe to call in environments with no WebAudio.
 */
export function unlock() {
  if (suspended) return;
  if (ctx) { if (ctx.state === 'suspended') quietly(ctx.resume?.()); return; }
  if (!enabled) return;
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AC) { enabled = false; return; }
  try {
    ctx = new AC();
    master = ctx.createGain();
    // Deliberately conservative. This plays over whatever the person is
    // already listening to; it is a garnish, not a soundtrack.
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    if (sampleMode()) loadSamples(); else startBed();
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
  if (bank && !musicChain) startMusic();      // the loop could not start while paused
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

// ── sample mode (Playgama build only, D15) ────────────────────────────────

const sampleMode = () => typeof globalThis.BYC_SAMPLES === 'object' && globalThis.BYC_SAMPLES !== null;
let bank = null;           // name -> AudioBuffer[]; null until every file has decoded
let musicChain = null;     // { src, gain, filter } once the loop is running
const lastPick = new Map();

const b64ToBuffer = (b64) => {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8.buffer;
};

// decodeAudioData returns a promise in current browsers and takes callbacks in
// older Safari; pass both. Resolving twice is harmless.
const decode = (buf) => new Promise((res, rej) => {
  try { const p = ctx.decodeAudioData(buf, res, rej); p?.then?.(res, rej); } catch (e) { rej(e); }
});

/** Decode the bank once the context exists (first gesture), then start the loop. */
function loadSamples() {
  const data = globalThis.BYC_SAMPLES;
  const c = ctx;
  const next = {};
  const jobs = [];
  for (const [name, list] of Object.entries(data)) {
    next[name] = [];
    for (const b64 of list) {
      jobs.push(decode(b64ToBuffer(b64)).then((buf) => { if (ctx === c) next[name].push(buf); }, () => { /* a file that will not decode is simply missing */ }));
    }
  }
  Promise.all(jobs).then(() => { if (ctx !== c) return; bank = next; startMusic(); });
}

/** Play one recording from the bank: a random variant (never the same twice running), a touch of pitch spread. */
function play(name, gain = 1, spread = 0.05) {
  const list = bank?.[name];
  if (!ok() || !list?.length) return;
  let i = Math.floor(Math.random() * list.length);
  if (list.length > 1 && i === lastPick.get(name)) i = (i + 1) % list.length;
  lastPick.set(name, i);
  const src = ctx.createBufferSource();
  src.buffer = list[i];
  src.playbackRate.value = 1 + (Math.random() * 2 - 1) * spread;
  const g = ctx.createGain();
  g.gain.value = Math.max(0, Math.min(1.5, gain));
  src.connect(g).connect(master);
  src.start();
}

/** The music loop: one recorded track, looped, with a lowpass and gain that follow Milo's danger. */
function startMusic() {
  const list = bank?.music;
  if (!ok() || !list?.length || musicChain) return;
  const src = ctx.createBufferSource();
  src.buffer = list[0];
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 2400;
  const g = ctx.createGain();
  g.gain.value = 0.0001;
  src.connect(f).connect(g).connect(master);
  src.start();
  g.gain.setTargetAtTime(0.7, ctx.currentTime, 0.8);       // fade in, never an instant edge
  musicChain = { src, gain: g, filter: f };
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
  if (!ok()) return;
  const d = Math.max(0, Math.min(1, danger || 0));
  if (musicChain) {                       // sample mode: the recorded loop tightens with him too
    musicChain.gain.gain.setTargetAtTime(0.65 + d * 0.30, now(), 0.25);
    musicChain.filter.frequency.setTargetAtTime(2000 + d * 5000, now(), 0.25);
    return;
  }
  if (!bed) return;
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
  if (sampleMode()) {
    // Same number, same thresholds as the synthesis below: speed picks the
    // recording (light, medium, heavy) and scales its volume. A heavy body
    // (a boulder) always uses the heavy set.
    const tier = heavy || s >= 0.62 ? 'impact_heavy' : s >= 0.28 ? 'impact_medium' : 'impact_light';
    play(tier, 0.30 + s * 0.70);
    return;
  }
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
  if (sampleMode()) { if (ok() && throttled('scratch', 80)) play('scratch', 0.35, 0.10); return; }
  if (!ok() || !throttled('scratch', 34)) return;
  noise(0.035, 0.035, { type: 'bandpass', freq: 1900 + Math.random() * 1400, q: 1.2 });
}

/** The line commits and the world starts moving again. */
export function release() {
  if (!ok()) return;
  if (sampleMode()) { play('release', 0.8); return; }
  noise(0.09, 0.09, { type: 'highpass', freq: 700, sweepTo: 2600 });
  blip('triangle', 300, 0.14, 0.09, { sweepTo: 560 });
}

/** A stroke was refused — too long, too far, degenerate. Not a death. */
export function reject() {
  if (sampleMode()) { play('reject', 0.6); return; }
  blip('square', 190, 0.09, 0.055, { sweepTo: 130 });
}

/** A switch fires. Deliberately bright and mechanical: this is a GOOD event. */
export function trigger() {
  if (sampleMode()) { play('trigger', 0.8); return; }
  blip('square', 620, 0.05, 0.05);
  blip('square', 930, 0.07, 0.045, { delay: 0.05 });
}

/** Milo dies. Falling, final, and short — it is followed by the death cam. */
export function death() {
  if (sampleMode()) { play('death', 1.0); return; }
  noise(0.30, 0.16, { type: 'lowpass', freq: 1500, sweepTo: 90 });
  blip('sawtooth', 210, 0.42, 0.11, { sweepTo: 48 });
}

/** Milo is out. Rising, resolved, and sized to the rating. */
export function success(stars = 1) {
  if (sampleMode()) { play('success' + Math.max(1, Math.min(3, Math.round(stars) || 1)), 0.9, 0.02); return; }
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
/** The barrel going off: a low thump under a falling roar. */
export function blast() {
  if (!ok()) return;
  if (sampleMode()) { play('blast', 1.0); return; }
  noise(0.55, 0.34, { type: 'lowpass', freq: 2200, sweepTo: 70 });
  blip('sine', 62, 0.45, 0.28, { sweepTo: 28 });
}

/** A bee hitting something: a short dry buzz, throttled so a swarm hums. */
export function buzz() {
  if (sampleMode()) return;                 // no recording of a bee: silent here, never synthesised
  if (!ok() || !throttled('buzz', 70)) return;
  blip('sawtooth', 210 + Math.random() * 60, 0.06, 0.035, { sweepTo: 180 });
}

export function closeCall(speed = 400) {
  if (!ok() || !throttled('closeCall', 200)) return;
  const s = Math.max(0, Math.min(1, speed / 800));
  if (sampleMode()) { play('close_call', 0.4 + s * 0.6); return; }
  // The pass: a band of noise sweeping down past you.
  noise(0.26, 0.07 + s * 0.10, {
    type: 'bandpass', freq: 900 + s * 1800, sweepTo: 260, q: 2.2,
  });
  // The heart: one low thump, just after, because the fright lands late.
  blip('sine', 62, 0.22, 0.10, { sweepTo: 40, delay: 0.13 });
}

/** The whole game is finished. The only sound that is allowed to be big. */
export function ending() {
  if (sampleMode()) { play('ending', 0.9, 0.02); return; }
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
  bank = null; musicChain = null;
  lastAt.clear(); lastPick.clear();
}

export function __stateForTest() {
  return {
    ctx: ctx ? ctx.state : null, enabled, suspended, hasBed: !!bed,
    sampleMode: sampleMode(), samples: bank ? Object.keys(bank).length : 0, music: !!musicChain,
  };
}
