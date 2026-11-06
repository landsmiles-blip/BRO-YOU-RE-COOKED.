"""Download the YouTube Playables hub tile images listed in docs/research/data/hub-snapshot-20261105-0701Z.csv (1,124 rows).
Run from this folder (thumbnails/):  python scripts/youtube_download.py   -> img-youtube/NNNN.jpg (NNNN = row order in the CSV)
Scratch tool; images are NOT committed."""
import csv, urllib.request, os, time
UA = {'User-Agent': 'Mozilla/5.0 (research; one-off tile survey)'}
rows = list(csv.DictReader(open('../../data/hub-snapshot-20261105-0701Z.csv', encoding='utf8')))
os.makedirs('img-youtube', exist_ok=True)
ok = 0
for i, r in enumerate(rows, 1):
    f = f'img-youtube/{i:04d}.jpg'
    if os.path.exists(f): ok += 1; continue
    try: open(f, 'wb').write(urllib.request.urlopen(urllib.request.Request(r['thumb_url'], headers=UA), timeout=30).read()); ok += 1
    except Exception as e: print('ERR', i, e)
    time.sleep(0.05)
print('have', ok, 'of', len(rows))
