"""Refits the difficulty equation T(c, k) = T0 · G^c · S^p(k) to the shipped levels.

    python3 tools/lib/fit-curve.py

Prints the least-squares T0, G and S and where each shipped level lands. The
numbers in tools/lib/difficulty.js came from this. Rerun it when the shipped
set changes, or when real players' attempt counts replace the simulated tries:
the published finding on simulated difficulty is that it is least accurate on
the hardest levels, which is exactly where a refit earns its keep.

Each shipped level may only go where HOME allows: its own chapter (a level is
not scattered into a chapter whose nouns it does not use), the chapter's INTRO
slot only for the level that teaches that chapter's noun, and FLOAT before the
other balloon levels so the balloon is met at its easiest. A level must land
inside its slot's band: a factor of 1.5 either way, or any amount easier for
an INTRO or a BREATHER.
"""
import json, math, subprocess, sys

ROLES = ['INTRO', 'DEVELOP', 'DEVELOP', 'DEVELOP', 'SPIKE', 'BREATHER', 'DEVELOP', 'DEVELOP', 'BREATHER', 'BOSS']
P = [0.00, 0.20, 0.35, 0.50, 0.80, 0.30, 0.55, 0.70, 0.45, 1.00]
CH = ['THE LINE', 'PLATES & GATES', 'TNT', 'AIR', 'BALLOONS', 'ALL OF IT']
TOL = math.log(1.5)
FINAL = (90, 110)        # the final boss: at least the hardest shipped level (90)
INF = 1e9
HOME = {  # id: (chapters it may go in, 'k0only' | 'k0ok' | None)
    'a1-wall': ((0,), 'k0only'),
    'a5-hang': ((0,), None), 'a20-spring': ((0,), None), 'a3-redirect': ((0,), None),
    'a12-ontime': ((0,), None), 'a15-eitherway': ((0,), None), 'a8-jam': ((0,), None), 'a2-gap': ((0,), None),
    'a9-chute': ((1,), 'k0only'), 'a10-switch': ((1,), None), 'a11-deadweight': ((1,), None),
    'a4-catch': ((1, 3, 4, 5), None), 'a13-yeet': ((1, 3, 4, 5), None),   # the line, mastered: never in TNT
    'a28-duct': ((3,), 'k0only'), 'a19-updraft': ((3,), None), 'a29-rail': ((3,), None),
    'a30-float': ((4,), 'k0ok'), 'a31-thorns': ((4, 5), None), 'a34-sink': ((4, 5), None),
    'a21-lever': ((5,), None), 'a43-crack': ((5,), None),
}


def target(T0, G, S, c, k):
    return T0 * G ** c * S ** P[k]


def hungarian(cost):
    n, m = len(cost), len(cost[0])
    u, v, p, way = [0] * (n + 1), [0] * (m + 1), [0] * (m + 1), [0] * (m + 1)
    for i in range(1, n + 1):
        p[0], j0 = i, 0
        minv, used = [INF] * (m + 1), [False] * (m + 1)
        while True:
            used[j0] = True
            i0, delta, j1 = p[j0], INF, 0
            for j in range(1, m + 1):
                if not used[j]:
                    cur = cost[i0 - 1][j - 1] - u[i0] - v[j]
                    if cur < minv[j]:
                        minv[j], way[j] = cur, j0
                    if minv[j] < delta:
                        delta, j1 = minv[j], j
            for j in range(m + 1):
                if used[j]:
                    u[p[j]] += delta
                    v[j] -= delta
                else:
                    minv[j] -= delta
            j0 = j1
            if p[j0] == 0:
                break
        while True:
            j1 = way[j0]
            p[j0] = p[j1]
            j0 = j1
            if j0 == 0:
                break
    ans = [0] * n
    for j in range(1, m + 1):
        if p[j]:
            ans[p[j] - 1] = j - 1
    return ans


def fit(D, T0, G, S):
    slots = [(c, k) for c in range(6) for k in range(10)]
    cost = []
    for L in D:
        chs, mode = HOME[L['id']]
        lt, row = math.log(L['tries']), []
        for (c, k) in slots:
            if (c not in chs or (mode == 'k0only' and k != 0) or (k == 0 and mode not in ('k0only', 'k0ok'))
                    or (L['id'] == 'a30-float' and k > 4) or (L['id'] in ('a31-thorns', 'a34-sink') and c == 4 and k < 5)):
                row.append(INF)
                continue
            e = lt - math.log(target(T0, G, S, c, k))
            if ROLES[k] in ('INTRO', 'BREATHER'):
                if e > TOL:
                    row.append(INF)
                    continue
                cst = max(e, 0) ** 2 + 0.05 * e * e
            else:
                if abs(e) > TOL:
                    row.append(INF)
                    continue
                cst = e * e
            row.append(cst + 0.02 * (c - chs[0]))
        cost.append(row)
    a = hungarian(cost)
    return sum(cost[i][a[i]] for i in range(len(D))), [slots[j] for j in a]


def search(D, T0s, Gs, Ss):
    best = None
    for T0 in T0s:
        for G in Gs:
            for S in Ss:
                if not (FINAL[0] <= target(T0, G, S, 5, 9) <= FINAL[1]):
                    continue
                tot, asg = fit(D, T0, G, S)
                if tot < INF / 2 and (best is None or tot < best[0]):
                    best = (tot, T0, G, S, asg)
    return best


def fr(a, b, s):
    return [a + s * i for i in range(int(round((b - a) / s)) + 1)]


if __name__ == '__main__':
    out = subprocess.run(['node', '--import', './tools/node-matter.js', 'tools/lib/dump-tries.mjs'],
                         capture_output=True, text=True, check=True).stdout
    D = json.loads(out)
    b = search(D, fr(7.8, 12, 0.6), fr(1.15, 1.45, 0.05), fr(2.5, 6, 0.5))
    if not b:
        sys.exit('no fit puts every shipped level inside its band')
    _, T0, G, S, _ = b
    tot, T0, G, S, asg = search(D, fr(T0 - 0.6, T0 + 0.6, 0.2), fr(G - 0.05, G + 0.05, 0.01), fr(S - 0.5, S + 0.5, 0.1))
    print(f'T0 = {T0:.2f}   G = {G:.3f}   S = {S:.2f}   (cost {tot:.3f}, final boss {target(T0, G, S, 5, 9):.0f})')
    for L, (c, k) in sorted(zip(D, asg), key=lambda x: x[1]):
        t = target(T0, G, S, c, k)
        print(f'  ch{c + 1} slot {k} {ROLES[k]:8} target {t:5.1f}   {L["verb"]:10} {L["tries"]:5.1f}  x{L["tries"] / t:.2f}')
