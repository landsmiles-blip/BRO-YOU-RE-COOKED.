"""Crawl the Playgama category listing pages (server-rendered HTML, ?page=N) for tile order, title and image path.
Run from thumbnails/:  python scripts/playgama_crawl.py  -> data/playgama-lists-20261106.json (this run: top_playgama 62, trending_now 270, puzzle 270, new 270; 6 pages x 45 cap)."""
import re, json, time, urllib.request, os, html
UA={'User-Agent':'Mozilla/5.0 (research; one-off tile survey)'}
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30).read()
cats=['top_playgama','trending_now','puzzle','new']
out={}
for c in cats:
    seen=[]; 
    for p in range(1,7):
        u=f'https://playgama.com/category/{c}'+(f'?page={p}' if p>1 else '')
        try: h=get(u).decode('utf8','replace')
        except Exception as e: print(c,p,'ERR',e); break
        tiles=re.findall(r'<a href="/game/([^"]+)"[^>]*data-interface-target="game-number-(\d+)">(.*?)</a>',h,flags=re.S)
        new=0
        for slug,num,body in tiles:
            if slug in [s['slug'] for s in seen]: continue
            m=re.search(r'<img[^>]*alt="([^"]*)"[^>]*src="([^"?]+)',body)
            badge=re.search(r'aria-label="([a-z]+)"',body)
            seen.append({'slug':slug,'rank':len(seen)+1,'title':html.unescape(m.group(1)) if m else '', 'img':m.group(2) if m else '', 'badge':badge.group(1) if badge else ''}); new+=1
        print(c,'page',p,'tiles',len(tiles),'new',new)
        if new==0: break
        time.sleep(0.6)
    out[c]=seen
json.dump(out,open('data/playgama-lists-20261106.json','w'),indent=1)
print({k:len(v) for k,v in out.items()})
