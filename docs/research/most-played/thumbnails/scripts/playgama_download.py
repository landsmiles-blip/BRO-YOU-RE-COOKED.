"""Download the Playgama tile images named in data/playgama-lists-20261106.json.
Run from this folder's parent (thumbnails/):  python scripts/playgama_download.py   -> img-playgama/
Scratch tool for the thumbnail study; images are NOT committed (re-download them)."""
import json, urllib.request, os, time
UA = {'User-Agent': 'Mozilla/5.0 (research; one-off tile survey)'}
L = json.load(open('data/playgama-lists-20261106.json'))
want = {}
for cat, n in [('top_playgama', 62), ('trending_now', 90), ('puzzle', 90), ('new', 45)]:
    for t in L[cat][:n]:
        want.setdefault(t['slug'], t)
os.makedirs('img-playgama', exist_ok=True)
ok = 0
for s, t in want.items():
    f = f'img-playgama/{s}.jpg'
    if os.path.exists(f): ok += 1; continue
    try:
        open(f, 'wb').write(urllib.request.urlopen(urllib.request.Request(t['img'] + '?width=448', headers=UA), timeout=30).read()); ok += 1; time.sleep(0.12)
    except Exception as e: print('ERR', s, e)
print('have', ok, 'of', len(want))
