"""Rebuild the Playgama audio bank: OGG sources -> loudness-normalised MP3 + manifest.json + LICENSES.md.

Not part of the game or the build: a one-off pipeline kept here so the files are reproducible.
Safari on iOS cannot play the Ogg container, hence MP3 (Playgama accepts OGG or MP3).

Needs (in a throwaway venv, never committed):   pip install av numpy
Sources (all CC0, licences read 5 Nov 2026):
  Kenney "Impact Sounds"    https://kenney.nl/assets/impact-sounds     -> its Audio/ folder
  Kenney "Interface Sounds" https://kenney.nl/assets/interface-sounds  -> its Audio/ folder
  hernandack "Short Loops Background Music Pack", file "Swinging Sweet.ogg"
                            https://opengameart.org/content/short-loops-background-music-pack

Usage:  python make_mp3.py <impact Audio dir> <interface Audio dir> "<Swinging Sweet.ogg>" <out dir>
Which recording stands for which game event is chosen by file name and duration, NOT by ear (nobody
has listened yet): swap entries in SFX below and rerun. See docs/DECISIONS.md D15.
"""
import json, os, sys, datetime
import av, numpy as np

IMP, UI, MUS, OUT = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
os.makedirs(OUT, exist_ok=True)

SFX = {  # event -> [(source file, pack label)]
    'impact_light':  [(f'{IMP}/impactGeneric_light_00{i}.ogg', 'Kenney Impact Sounds') for i in (0, 1, 2)],
    'impact_medium': [(f'{IMP}/impactWood_medium_00{i}.ogg', 'Kenney Impact Sounds') for i in (0, 1, 2)],
    'impact_heavy':  [(f'{IMP}/impactSoft_heavy_000.ogg', 'Kenney Impact Sounds'),
                      (f'{IMP}/impactSoft_heavy_001.ogg', 'Kenney Impact Sounds'),
                      (f'{IMP}/impactWood_heavy_000.ogg', 'Kenney Impact Sounds')],
    'scratch':       [(f'{UI}/scratch_00{i}.ogg', 'Kenney Interface Sounds') for i in (1, 2, 3)],
    'release':       [(f'{UI}/pluck_00{i}.ogg', 'Kenney Interface Sounds') for i in (1, 2)],
    'reject':        [(f'{UI}/error_001.ogg', 'Kenney Interface Sounds')],
    'trigger':       [(f'{UI}/toggle_00{i}.ogg', 'Kenney Interface Sounds') for i in (1, 2)],
    'death':         [(f'{IMP}/impactPunch_heavy_000.ogg', 'Kenney Impact Sounds')],
    'success1':      [(f'{UI}/confirmation_001.ogg', 'Kenney Interface Sounds')],
    'success2':      [(f'{UI}/confirmation_003.ogg', 'Kenney Interface Sounds')],
    'success3':      [(f'{UI}/confirmation_004.ogg', 'Kenney Interface Sounds')],
    'ending':        [(f'{IMP}/impactBell_heavy_000.ogg', 'Kenney Impact Sounds')],
    'blast':         [(f'{IMP}/impactMining_000.ogg', 'Kenney Impact Sounds')],
    'close_call':    [(f'{IMP}/impactSoft_medium_000.ogg', 'Kenney Impact Sounds')],
}

def decode(path):
    chunks, rate = [], 44100
    with av.open(path) as c:
        s = c.streams.audio[0]
        rate = s.rate
        rs = av.AudioResampler(format='fltp', layout='stereo', rate=rate)
        for fr in c.decode(s):
            for o in rs.resample(fr):
                chunks.append(o.to_ndarray())
        for o in rs.resample(None):
            chunks.append(o.to_ndarray())
    return np.concatenate(chunks, axis=1), rate          # (2, n) float32

def encode(arr, rate, path, bitrate, channels):
    layout = 'mono' if channels == 1 else 'stereo'
    with av.open(path, 'w', format='mp3') as out:
        st = out.add_stream('libmp3lame', rate=rate)
        st.bit_rate = bitrate
        st.layout = layout
        step = 1152 * 8
        for i in range(0, arr.shape[1], step):
            part = np.ascontiguousarray(arr[:channels, i:i + step], dtype=np.float32)
            fr = av.AudioFrame.from_ndarray(part, format='fltp', layout=layout)
            fr.sample_rate = rate
            for p in st.encode(fr):
                out.mux(p)
        for p in st.encode(None):
            out.mux(p)

manifest, lic, report = {}, [], []
for name, srcs in SFX.items():
    files = []
    for j, (src, pack) in enumerate(srcs):
        a, rate = decode(src)
        mono = a.mean(axis=0, keepdims=True)
        peak = float(np.abs(mono).max()) or 1.0
        mono = mono * (0.89 / peak)                       # peak-normalise to about -1 dBFS
        n = min(mono.shape[1], int(rate * 0.005)); mono[:, -n:] *= np.linspace(1, 0, n)   # 5 ms fade-out
        fn = f'{name}_{j + 1}.mp3'
        encode(mono, rate, os.path.join(OUT, fn), 96000, 1)
        files.append(fn)
        lic.append((fn, os.path.basename(src), pack))
        report.append((fn, round(mono.shape[1] / rate, 3), os.path.getsize(os.path.join(OUT, fn))))
    manifest[name] = files

a, rate = decode(MUS)
rms = float(np.sqrt((a ** 2).mean())) or 1.0
a = a * (0.10 / rms)                                      # about -20 dBFS RMS
pk = float(np.abs(a).max())
if pk > 0.95: a = a * (0.95 / pk)
encode(a, rate, os.path.join(OUT, 'music_1.mp3'), 96000, 2)
manifest['music'] = ['music_1.mp3']
report.append(('music_1.mp3', round(a.shape[1] / rate, 3), os.path.getsize(os.path.join(OUT, 'music_1.mp3'))))

json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
for r in report: print(f'{r[0]:22s} {r[1]:7.3f}s {r[2]:8d} B')
total = sum(r[2] for r in report)
print('TOTAL', total, 'bytes; base64 about', int(total * 4 / 3), 'bytes')

today = datetime.date.today().isoformat()
with open(os.path.join(OUT, 'LICENSES.md'), 'w', encoding='utf8') as f:
    f.write('# Audio for the Playgama build: sources and licences\n\n')
    f.write(f'Prepared {today}. All files are CC0 (public domain dedication). Attribution is not required; the authors are named anyway.\n'
            'Loudness-normalised and converted OGG -> MP3 (96 kbps; SFX mono) because Safari on iOS cannot play the Ogg container.\n\n')
    f.write('| Packed file | Source file | Pack | Author | Licence | Where read |\n|---|---|---|---|---|---|\n')
    for fn, srcname, pack in lic:
        url = 'https://kenney.nl/assets/impact-sounds' if 'Impact' in pack else 'https://kenney.nl/assets/interface-sounds'
        f.write(f'| {fn} | {srcname} | {pack} | Kenney (kenney.nl) | CC0 | pack License.txt and {url}, {today} |\n')
    f.write(f'| music_1.mp3 | Swinging Sweet.ogg | Short Loops Background Music Pack | hernandack | CC0 | https://opengameart.org/content/short-loops-background-music-pack (License(s): CC0), {today} |\n')
