// GATE TEST — where progress is saved, and when.
//
// Google's integration requirements say two things about a save, both MUSTs:
// inside Playables the game "MUST NOT use any other mechanism to save user
// progress", and it "MUST await loadData before calling saveData". This game
// broke the first from the day saving was written — every save was mirrored
// to localStorage as a backup, which is exactly another mechanism — and could
// break the second whenever the sound switch was pressed before the save had
// arrived. Neither shows on screen. Both fail certification.
//
// sdk.js reads globalThis.ytgame once, when it is first imported, so each
// platform below gets its own copy of the module: a query string on the import
// is a different module to Node.

let failed = 0;
const check = (label, cond, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

// A localStorage that counts every touch.
const storage = { data: new Map(), touched: 0 };
globalThis.localStorage = {
  getItem: (k) => { storage.touched++; return storage.data.has(k) ? storage.data.get(k) : null; },
  setItem: (k, v) => { storage.touched++; storage.data.set(k, String(v)); },
  removeItem: (k) => { storage.touched++; storage.data.delete(k); },
};

// A platform whose load can be held, released or failed.
function platform({ inEnv, cloud = '', failLoad = false }) {
  const calls = [];
  let release;
  const gate = new Promise((r) => { release = r; });
  const ytgame = {
    game: {
      saveData: (t) => { calls.push(['save', t]); cloud = t; return Promise.resolve(); },
      loadData: () => {
        calls.push(['load']);
        return gate.then(() => (failLoad ? Promise.reject(new Error('offline')) : cloud));
      },
    },
  };
  if (inEnv !== undefined) ytgame.IN_PLAYABLES_ENV = inEnv;
  return { ytgame, calls, release: () => release(), cloud: () => cloud };
}

let n = 0;
async function sdkOn(ytgame) {
  if (ytgame) globalThis.ytgame = ytgame; else delete globalThis.ytgame;
  const m = await import(`../../js/platform/sdk.js?copy=${++n}`);
  delete globalThis.ytgame;
  return m;
}

console.log('\nSAVE — the cloud inside Playables, the browser outside, never both');

// 1. Off the platform: the open web and every dev tab keep progress locally.
{
  storage.data.clear(); storage.touched = 0;
  const sdk = await sdkOn(null);
  const ok = await sdk.saveData('{"v":3}');
  check('off the platform, progress is kept in the browser', ok === true && storage.data.get('byc.save.v1') === '{"v":3}');
  check('and read back from it', (await sdk.loadData()) === '{"v":3}');
}

// 2. The SDK on a page that is not inside Playables says so, and is treated
//    the same as no SDK at all.
{
  storage.data.clear(); storage.touched = 0;
  const p = platform({ inEnv: false });
  const sdk = await sdkOn(p.ytgame);
  await sdk.saveData('{"v":3,"tab":1}');
  check('with the SDK but outside Playables, the browser is used', storage.data.get('byc.save.v1') === '{"v":3,"tab":1}' &&
    !p.calls.length, `${p.calls.length} platform calls`);
}

// 3. Inside Playables: the cloud only, and only after the load has landed.
{
  storage.data.clear(); storage.touched = 0;
  const p = platform({ inEnv: true, cloud: '{"v":3,"real":1}' });
  const sdk = await sdkOn(p.ytgame);
  const early = await sdk.saveData('{"v":3,"fresh":1}');
  check('a save before the load is never sent', early === false && !p.calls.some(([c]) => c === 'save'),
    p.calls.map(([c]) => c).join(','));
  const loading = sdk.loadData();
  const tooSoon = await sdk.saveData('{"v":3,"fresh":2}');
  check('nor one while the load is still on its way', tooSoon === false && !p.calls.some(([c]) => c === 'save'));
  p.release();
  const text = await loading;
  check('the load returns the cloud save', text === '{"v":3,"real":1}', String(text));
  check('and the real save is still there to load', p.cloud() === '{"v":3,"real":1}');
  const late = await sdk.saveData('{"v":3,"real":2}');
  check('once it has landed, a save goes to the cloud', late === true && p.cloud() === '{"v":3,"real":2}');
  check('and the browser storage is never touched, read or write', storage.touched === 0, `${storage.touched} touches`);
}

// 4. A load that FAILS leaves saving shut. The platform would reject the save
//    anyway, and if it did not, it would write a fresh progress over the real
//    one that simply could not be read this time.
{
  storage.data.clear(); storage.touched = 0;
  const p = platform({ inEnv: true, cloud: '{"v":3,"real":1}', failLoad: true });
  const sdk = await sdkOn(p.ytgame);
  const loading = sdk.loadData();
  p.release();
  const text = await loading;
  const after = await sdk.saveData('{"v":3,"fresh":1}');
  check('a failed load reads as no save, quietly', text === null);
  check('and nothing is saved over the real one', after === false && p.cloud() === '{"v":3,"real":1}' &&
    storage.touched === 0, `cloud ${p.cloud()}`);
}

// 5. A new player's empty cloud is a fresh start, not an error.
{
  const p = platform({ inEnv: true, cloud: '' });
  const sdk = await sdkOn(p.ytgame);
  const loading = sdk.loadData();
  p.release();
  check('an empty cloud save loads as nothing', (await loading) === null);
}

// 6. A platform that does not report the flag is treated as inside: the one
//    thing that must never happen in Playables is a second save.
{
  storage.data.clear(); storage.touched = 0;
  const p = platform({});
  const sdk = await sdkOn(p.ytgame);
  const loading = sdk.loadData();
  p.release();
  await loading;
  await sdk.saveData('{"v":3}');
  check('with no flag at all, the cloud is the only save', storage.touched === 0 && p.cloud() === '{"v":3}');
}

// 7. What the player did before the save arrived is folded into it, not lost.
{
  const { createProgress, absorb, record, starsOn } = await import('../../js/progress.js');
  const { LEVELS } = await import('../../js/levels.js');
  const [a, b] = [LEVELS[0].id, LEVELS[1].id];

  const saved = createProgress();
  record(saved, a, 1); record(saved, b, 3);
  saved.tokens = 2; saved.streak = 4; saved.muted = false;
  const session = createProgress();
  record(session, a, 3); record(session, b, 1);
  session.tokens = 3; session.muted = true;
  const changed = absorb(saved, session, { soundTouched: true });
  check('a star earned before the save arrived is kept', changed && starsOn(saved, a) === 3);
  check('and a better saved star is not lowered', starsOn(saved, b) === 3);
  check('the sound switch keeps the player\'s last word', saved.muted === true);
  check('tokens and the streak stay as saved', saved.tokens === 2 && saved.streak === 4);

  const quiet = createProgress(); quiet.muted = true;
  check('a switch the player never touched does not overrule the save',
    absorb(quiet, createProgress()) === false && quiet.muted === true);
}

console.log(failed === 0 ? '\nSAVE: PASS\n' : `\nSAVE: ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
