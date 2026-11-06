import av, sys
src, out, every = sys.argv[1], sys.argv[2], float(sys.argv[3])
c = av.open(src); s = c.streams.video[0]
print('duration s', float(c.duration)/1e6 if c.duration else None, 'size', s.width, s.height)
nxt = 0.0; n = 0
for fr in c.decode(s):
    t = float(fr.pts * s.time_base)
    if t >= nxt:
        img = fr.to_image(); img.thumbnail((1280, 1280)); img.save(f'{out}/f_{n:03d}_{int(t):03d}s.jpg', quality=85); n += 1; nxt = t + every
print('frames', n)
