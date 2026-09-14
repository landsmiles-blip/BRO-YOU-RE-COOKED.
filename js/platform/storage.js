// SDK-first with a guarded fallback. NEVER a bare localStorage call — it throws
// in private browsing and in sandboxed frames, which is exactly this game's
// deployment context.
//
// Amendment A.3: every payload is versioned and the loader migrates forward.
// A save written by v1 must load in v3, and an unknown future version degrades
// to a fresh save rather than throwing.

import { isPlayables } from './sdk.js';

export const SCHEMA_VERSION = 1;
const KEY = 'byc.save';

const MIGRATIONS = {
  // 1: (data) => ({ ...data, v: 2 }),   // add as the schema grows
};

function migrate(data) {
  if (!data || typeof data !== 'object') return null;
  let d = data;
  let guard = 0;
  while (typeof d.v === 'number' && d.v < SCHEMA_VERSION && guard++ < 64) {
    const step = MIGRATIONS[d.v];
    if (!step) return null;
    d = step(d);
  }
  if (d.v > SCHEMA_VERSION) return null;   // written by a newer build — start fresh
  return d;
}

export async function save(data) {
  const payload = JSON.stringify({ ...data, v: SCHEMA_VERSION });
  try {
    const sdk = globalThis.ytgame;
    if (isPlayables && sdk?.game?.saveData) { await sdk.game.saveData(payload); return true; }
  } catch (e) { console.warn('storage.save sdk', e); }
  try { localStorage.setItem(KEY, payload); return true; }
  catch (e) { console.warn('storage.save local', e); return false; }
}

export async function load() {
  let raw = null;
  try {
    const sdk = globalThis.ytgame;
    if (isPlayables && sdk?.game?.loadData) raw = await sdk.game.loadData();
  } catch (e) { console.warn('storage.load sdk', e); }
  if (raw == null) {
    try { raw = localStorage.getItem(KEY); } catch (e) { console.warn('storage.load local', e); }
  }
  if (raw == null) return null;
  try { return migrate(JSON.parse(raw)); } catch { return null; }
}
