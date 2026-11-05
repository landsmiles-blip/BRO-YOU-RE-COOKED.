// scrape-hub.js - the exact method used for hub snapshot 1 (hub-snapshot-20261105-0701Z.csv).
// A later snapshot must use these same four steps unchanged so the two CSVs are comparable.
// Each STEP block is pasted into javascript_tool on a tab showing https://www.youtube.com/playables
// (REPL semantics: top-level await works; the value of the last expression is returned).
// The hub order is personalised ("For you"), NOT a ranking: join snapshots on game_id, never on dom_rank.
//
// Columns: dom_rank (1-based position of ytd-rich-item-renderer in the DOM), game_id (the /playables/<id>
//   path with the query string removed), title, plays_text (exact text of span.ytMiniGameCardViewModelGenre,
//   e.g. "112m plays"), plays_int (parsed from that rounded text: 296k -> 296000, 99m -> 99000000),
//   badge_text (innerText of div.ytMiniGameCardViewModelBadgeContainer, empty if none), thumb_url (img.src,
//   query string removed), thumb_nat_w/h (natural image size), tile_w/h (rendered thumbnail box, CSS px),
//   card_class (portrait modifier classes), scrape_utc.
//
// badge_text caveat (DOM checked on 2026-11-05 for ONE tile, Draw Bridge, badge "1"): its badge element had the class
//   ytMiniGameCardViewModelBadgeHighScore (an icon plus the number), which reads as the signed-in account's own high score.
//   22 of 1124 rows in snapshot 1 have a purely numeric badge (the other 21 were not inspected, so "high score" is inferred
//   for them). If that reading is right the numbers are account-specific and must not be differenced or compared across
//   accounts. The text "New" (198 rows) is the platform's new-game badge. Treat badge_text as untrusted except "New".
//
// Gotchas found on snapshot 1:
//  - A bare async IIFE returns {} (the Promise is not awaited): write `await (async () => {...})()`.
//  - The thumbnails are lazy: after scrolling straight to the bottom, 666 of 1124 <img> had an empty src.
//    STEP 1b walks the page in 0.8-viewport steps until none are missing. Scrape only after it says missing:0.
//  - The page cannot write the clipboard from a CDP-driven tab (execCommand('copy') returned false) and the
//    youtube.com page cannot fetch() to http://127.0.0.1 (Failed to fetch). What worked is STEP 3: gzip the CSV,
//    base64 it, navigate the tab to http://127.0.0.1:8099/#<b64>; a local one-shot node receiver (source at the
//    bottom of this file) serves a page that gunzips the hash and POSTs it back to its own origin, and writes it
//    to disk. The tab ends up on 127.0.0.1:8099, so navigate it back to the hub afterwards.

// ---------- STEP 1: scroll the Browse grid to the end; repeat until done:true ----------
await (async () => {
  const t0 = Date.now(); let last = -1, same = 0; const log = [];
  while (Date.now() - t0 < 24000) {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise(r => setTimeout(r, 1200));
    const n = document.querySelectorAll('ytd-rich-item-renderer').length;
    log.push(n);
    if (n === last) { same++; if (same >= 5) break; } else { same = 0; last = n; }
  }
  const n = document.querySelectorAll('ytd-rich-item-renderer').length;
  const cont = document.querySelectorAll('ytd-continuation-item-renderer').length;
  return JSON.stringify({ n, cont, done: same >= 5 && cont === 0, tail: log.slice(-8), secs: (Date.now() - t0) / 1000 });
})()

// ---------- STEP 1b: force every lazy thumbnail to load; repeat until missing:0 ----------
await (async () => {
  const t0 = Date.now();
  const missing = () => [...document.querySelectorAll('ytd-rich-item-renderer img.ytMiniGameCardViewModelThumbnailImage')].filter(i => !i.src).length;
  const step = Math.max(300, Math.floor(window.innerHeight * 0.8));
  let y = 0; const startMissing = missing();
  while (Date.now() - t0 < 24000 && y < document.documentElement.scrollHeight) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 120));
    y += step;
  }
  await new Promise(r => setTimeout(r, 800));
  return JSON.stringify({ startMissing, missing: missing(), y, docH: document.documentElement.scrollHeight, step, secs: (Date.now() - t0) / 1000 });
})()

// ---------- STEP 2: build the CSV into window.__bycCsv and return a summary ----------
// (The keydown listener at the end was an attempt to copy on a real key press; it never produced a
//  clipboard write and is inert. Kept only because it is part of what ran.)
(() => {
  const scrapeUtc = new Date().toISOString();
  const parsePlays = (s) => {
    const m = /([\d.,]+)\s*([kKmMbB]?)/.exec(s || '');
    if (!m) return '';
    const num = parseFloat(m[1].replace(/,/g, ''));
    const mult = { '': 1, k: 1e3, m: 1e6, b: 1e9 }[m[2].toLowerCase()];
    return Math.round(num * mult);
  };
  const csvCell = (v) => {
    const s = String(v == null ? '' : v);
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const items = [...document.querySelectorAll('ytd-rich-item-renderer')];
  const rows = [];
  let skipped = 0;
  items.forEach((it, i) => {
    const card = it.querySelector('mini-game-card-view-model');
    if (!card) { skipped++; return; }
    const link = card.querySelector('a.ytMiniGameCardViewModelThumbnailWrapper') || card.querySelector('a[href*="/playables/"]');
    const href = ((link && link.getAttribute('href')) || '').split('?')[0];
    const id = href.split('/playables/')[1] || '';
    const title = (card.querySelector('.ytMiniGameCardViewModelTitle') || {}).innerText || '';
    const playsText = ((card.querySelector('.ytMiniGameCardViewModelGenre') || {}).innerText || '').trim();
    const badge = ((card.querySelector('.ytMiniGameCardViewModelBadgeContainer') || {}).innerText || '').replace(/\s+/g, ' ').trim();
    const img = card.querySelector('img.ytMiniGameCardViewModelThumbnailImage') || card.querySelector('img');
    const thumb = ((img && img.src) || '').split('?')[0];
    const r = img ? img.getBoundingClientRect() : { width: 0, height: 0 };
    const host = card.querySelector('.ytMiniGameCardViewModelHost');
    const cls = host ? [...host.classList].filter(c => /Portrait|Landscape|Square/i.test(c)).join(' ') : '';
    rows.push([i + 1, id, title.trim(), playsText, parsePlays(playsText), badge, thumb,
      img ? img.naturalWidth : '', img ? img.naturalHeight : '', Math.round(r.width), Math.round(r.height), cls, scrapeUtc]);
  });
  const header = ['dom_rank', 'game_id', 'title', 'plays_text', 'plays_int', 'badge_text', 'thumb_url',
    'thumb_nat_w', 'thumb_nat_h', 'tile_w', 'tile_h', 'card_class', 'scrape_utc'];
  const csv = [header, ...rows].map(r => r.map(csvCell).join(',')).join('\n') + '\n';
  window.__bycCsv = csv; window.__bycCopied = 'armed';
  document.addEventListener('keydown', () => {
    const ta = document.createElement('textarea');
    ta.value = window.__bycCsv; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { window.__bycCopied = document.execCommand('copy') ? 'copied' : 'copy-false'; } catch (e) { window.__bycCopied = 'ERR ' + e.message; }
    ta.remove();
  }, { once: true, capture: true });
  const ids = new Set(rows.map(r => r[1]));
  const titles = new Set(rows.map(r => r[2]));
  return JSON.stringify({
    scrapeUtc, domItems: items.length, rows: rows.length, skippedNonGame: skipped, csvChars: csv.length,
    uniqueIds: ids.size, uniqueTitles: titles.size, emptyId: rows.filter(r => !r[1]).length,
    emptyThumb: rows.filter(r => !r[6]).length, emptyPlays: rows.filter(r => r[4] === '').length,
    withBadge: rows.filter(r => r[5]).length, thumbNat0: rows.filter(r => !r[7]).length,
    cardClasses: [...new Set(rows.map(r => r[11]))],
  });
})()

// ---------- STEP 3: ship the CSV to disk (start the receiver below first: node recv.mjs <out.csv>) ----------
await (async()=>{ const bytes=new TextEncoder().encode(window.__bycCsv); const cs=new CompressionStream('gzip'); const buf=await new Response(new Blob([bytes]).stream().pipeThrough(cs)).arrayBuffer(); const u=new Uint8Array(buf); let s=''; for(let i=0;i<u.length;i+=8192){ s+=String.fromCharCode.apply(null,u.subarray(i,i+8192)); } const b64=btoa(s); window.__bycB64=b64; setTimeout(()=>{ location.href='http://127.0.0.1:8099/#'+encodeURIComponent(b64); }, 300); return 'csvBytes='+bytes.length+' gz='+u.length+' b64='+b64.length; })()

/* ---------- recv.mjs (the one-shot receiver used with STEP 3; run `node recv.mjs <out.csv>`) ----------
import http from 'node:http';
import fs from 'node:fs';
const out = process.argv[2];
const page = `<!doctype html><meta charset=utf-8><title>recv</title><body>waiting<script>
(async()=>{
  try{
    const b64=decodeURIComponent(location.hash.slice(1));
    if(!b64){document.body.textContent='no hash';return;}
    const bin=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    const ds=new DecompressionStream('gzip');
    const text=await new Response(new Blob([bin]).stream().pipeThrough(ds)).text();
    const r=await fetch('/up',{method:'POST',headers:{'Content-Type':'text/plain; charset=utf-8'},body:text});
    document.body.textContent='posted '+text.length+' chars -> '+await r.text();
  }catch(e){document.body.textContent='ERR '+e.message;}
})();
</script>`;
const srv = http.createServer((req, res) => {
  if (req.method === 'GET') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(page); return; }
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const buf = Buffer.concat(chunks);
    fs.writeFileSync(out, buf);
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('ok ' + buf.length + ' bytes');
    console.log('received bytes', buf.length);
    setTimeout(() => process.exit(0), 300);
  });
});
srv.listen(8099, '127.0.0.1', () => console.log('listening 8099'));
setTimeout(() => { console.log('timeout'); process.exit(1); }, 600000);
*/
