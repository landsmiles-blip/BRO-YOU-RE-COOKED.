"""How well does the difficulty equation describe the levels as they stand?

    python3 tools/lib/fit-curve.py                    the simulated numbers only
    python3 tools/lib/fit-curve.py --real FILE.json   with real players' attempts

The equation is T(c, k) = T0 · G^c · S^p(k) (tools/lib/difficulty.js). This
fits T0, G and S by least squares in log space to every built level IN THE
SLOT IT NOW OCCUPIES, and prints the fit next to the constants in use, so a
drift between the two shows up as a number rather than a feeling.

WHY IT WAS REWRITTEN (25 Oct). The first version, which produced the constants
on 13 Oct, searched slot placements and constants together and threw out any
fit that left a level outside its band — so "every level is in its band" was
true by construction, and it hard-coded the 21 level ids of that day. It
stopped running the day the dog arrived (KeyError: 'a80-good-boy'). Placing a
level is a design decision made one level at a time against the curve gate;
this script only measures how the curve and the placed levels agree.

WHAT IT WEIGHS. A level's simulated tries rest on its hand-robust winning
strokes R. Treated as a count, its relative error is about 1/sqrt(R): BLOCK
(R=188) is known to ±7%, CRACK (R=8) only to ±35%, which is as wide as the
band. Each level is weighted by R, so the curve is pinned by the levels whose
numbers can bear it. INTRO and BREATHER slots may sit below the curve by
design, so they are reported but not fitted.

REAL PLAYERS. --real takes the file tools/lib/import-tries.mjs writes: per
level, how many runs each tester took to the first win. Wherever a level has
real attempts, the script prints the ratio of real to simulated and fits one
calibration line ln(real) = a + b·ln(simulated) once five levels have data —
the published way simulated difficulty is turned into a prediction for people
(King's playtesting agents were mapped to human pass rates by regression).
"""
import json, math, re, subprocess, sys

ROLES = ['INTRO', 'DEVELOP', 'DEVELOP', 'DEVELOP', 'SPIKE', 'BREATHER', 'DEVELOP', 'DEVELOP', 'BREATHER', 'BOSS']
FITTED = ('DEVELOP', 'SPIKE', 'BOSS')
TOL = 1.5


def constants():
    src = open('tools/lib/difficulty.js').read()
    get = lambda n: float(re.search(rf'export const {n} = ([0-9.]+);', src).group(1))
    prof = [float(x) for x in re.search(r'PROFILE = \[([^\]]+)\]', src).group(1).split(',')]
    return get('T0'), get('G'), get('S'), prof, get('CEILING')


def solve3(A, b):
    """Gaussian elimination for a 3x3 system (no numpy on this machine)."""
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    for c in range(3):
        p = max(range(c, 3), key=lambda r: abs(M[r][c]))
        M[c], M[p] = M[p], M[c]
        for r in range(3):
            if r != c:
                f = M[r][c] / M[c][c]
                M[r] = [M[r][j] - f * M[c][j] for j in range(4)]
    return [M[i][3] / M[i][i] for i in range(3)]


def fit(levels, prof, key):
    """Weighted least squares: ln y = ln T0 + c ln G + p(k) ln S."""
    A = [[0.0] * 3 for _ in range(3)]
    b = [0.0] * 3
    for L in levels:
        x = [1.0, L['chapter'], prof[L['k']]]
        w = L['w']
        y = math.log(L[key])
        for i in range(3):
            b[i] += w * x[i] * y
            for j in range(3):
                A[i][j] += w * x[i] * x[j]
    a0, ag, as_ = solve3(A, b)
    return math.exp(a0), math.exp(ag), math.exp(as_)


def calibration(pairs):
    """ln(real) = a + b ln(sim), ordinary least squares."""
    n = len(pairs)
    xs = [math.log(s) for s, _ in pairs]
    ys = [math.log(r) for _, r in pairs]
    mx, my = sum(xs) / n, sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    b = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sxx if sxx else 0
    return my - b * mx, b


def main():
    real = {}
    if '--real' in sys.argv:
        real = json.load(open(sys.argv[sys.argv.index('--real') + 1]))
    out = subprocess.run(['node', '--import', './tools/node-matter.js', 'tools/lib/dump-tries.mjs'],
                         capture_output=True, text=True, check=True).stdout
    D = [L for L in json.loads(out) if L['tries'] and L['chapter'] is not None]
    T0, G, S, prof, CEILING = constants()
    for L in D:
        L['w'] = max(1, L['robust'] or 1)
        L['err'] = 1 / math.sqrt(L['w'])            # relative error, in log units
        # The slot's target as the curve gate uses it: the equation, capped at
        # the ceiling (25 Oct). The fit below studies the equation's shape.
        L['target'] = min(T0 * G ** L['chapter'] * S ** prof[L['k']], CEILING)
    core = [L for L in D if L['role'] in FITTED]
    fT0, fG, fS = fit(core, prof, 'tries')
    resid = [math.log(L['tries'] / (fT0 * fG ** L['chapter'] * fS ** prof[L['k']])) for L in core]
    rms = math.sqrt(sum(r * r for r in resid) / len(resid))

    print('DIFFICULTY FIT — simulated tries, each level in the slot it occupies')
    print(f'  in use   T0 = {T0:5.2f}   G = {G:.3f}   S = {S:.2f}   final boss {T0 * G ** 6 * S:6.1f}'
          f' (every target capped at {CEILING:.0f})')
    print(f'  fitted   T0 = {fT0:5.2f}   G = {fG:.3f}   S = {fS:.2f}   final boss {fT0 * fG ** 6 * fS:6.1f}'
          f'   ({len(core)} levels, typical miss x{math.exp(rms):.2f})')
    print()
    print('   ch slot role      level        tries   ±noise  target  x target  notes')
    for L in sorted(D, key=lambda L: (L['chapter'], L['k'])):
        r = L['tries'] / L['target']
        lo_ok = L['role'] in ('INTRO', 'BREATHER') or r >= 1 / TOL
        notes = []
        if r > TOL or not lo_ok:
            notes.append('OUTSIDE BAND')
        if L['tries'] > CEILING:
            notes.append(f'above {CEILING}')
        if L['err'] > math.log(TOL):
            notes.append('noise wider than the band')
        if L['id'] in real:
            notes.append(f"real {real[L['id']]['mean']:.1f} from {real[L['id']]['players']} players")
        print(f"   {L['chapter'] + 1}  {L['k']:>2}  {L['role']:8}  {L['verb'][:11]:11} {L['tries']:6.1f}  "
              f"±{(math.exp(L['err']) - 1) * 100:3.0f}%  {L['target']:6.1f}   x{r:4.2f}   {'; '.join(notes)}")

    pairs = [(L['tries'], real[L['id']]['mean']) for L in D if L['id'] in real]
    print()
    if not pairs:
        print('  REAL PLAYERS: none yet. Every number above is simulated: it measures how much of the')
        print('  space of plausible strokes wins and how often a model hand lands it, not what a person')
        print('  needs. Import playtest logs (tools/lib/import-tries.mjs) and rerun with --real.')
    elif len(pairs) < 5:
        ratio = math.exp(sum(math.log(r / s) for s, r in pairs) / len(pairs))
        print(f'  REAL PLAYERS on {len(pairs)} levels: real attempts ≈ x{ratio:.2f} the simulated tries'
              f' (needs 5 levels before a calibration line is fitted)')
    else:
        a, b = calibration(pairs)
        print(f'  CALIBRATION from {len(pairs)} levels: real ≈ {math.exp(a):.2f} · simulated^{b:.2f}')
        for L in sorted(D, key=lambda L: (L['chapter'], L['k'])):
            print(f"     {L['verb'][:11]:11} predicted real attempts {math.exp(a) * L['tries'] ** b:5.1f}")


if __name__ == '__main__':
    main()
