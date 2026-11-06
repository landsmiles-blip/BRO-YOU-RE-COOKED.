"""Objective tile features. Usage: python features.py <image> ...  -> prints CSV rows (path,w,h,sat,val,sat_hi,contrast,edge,paper,center_diff)"""
import sys, numpy as np
from PIL import Image
def feats(path):
    im = Image.open(path).convert('RGB'); w, h = im.size
    im.thumbnail((256, 256)); a = np.asarray(im, dtype=np.float32) / 255.0
    mx, mn = a.max(2), a.min(2); v = mx; s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    gx = np.abs(np.diff(lum, axis=1)).mean(); gy = np.abs(np.diff(lum, axis=0)).mean()
    H, W = lum.shape; c = a[H // 4:3 * H // 4, W // 4:3 * W // 4].reshape(-1, 3).mean(0)
    border = np.concatenate([a[:H // 8].reshape(-1, 3), a[-H // 8:].reshape(-1, 3), a[:, :W // 8].reshape(-1, 3), a[:, -W // 8:].reshape(-1, 3)]).mean(0)
    return dict(path=path, w=w, h=h, sat=float(s.mean()), val=float(v.mean()),
                sat_hi=float(((s > 0.6) & (v > 0.5)).mean()), contrast=float(lum.std()),
                edge=float((gx + gy) / 2), paper=float(((v > 0.88) & (s < 0.12)).mean()),
                center_diff=float(np.abs(c - border).sum()))
if __name__ == '__main__':
    print('path,w,h,sat,val,sat_hi,contrast,edge,paper,center_diff')
    for p in sys.argv[1:]:
        f = feats(p); print(','.join(str(round(f[k], 4)) if isinstance(f[k], float) else str(f[k]) for k in ['path','w','h','sat','val','sat_hi','contrast','edge','paper','center_diff']))
