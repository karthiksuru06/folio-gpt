#!/usr/bin/env python3
"""Measure how much of this repo still matches an upstream checkout.

    python3 scripts/upstream-similarity.py /path/to/upstream-checkout [--min-len 12] [--max-percent 3]

A line "matches" if the same trimmed line (at least --min-len characters, so
braces and imports do not count) appears anywhere in the upstream tree.
Exits 1 when the overall share is above --max-percent. This is a screening
tool for the re-licensing plan in docs/RELICENSE_PLAN.md, not legal advice.
"""
import argparse, collections, os, subprocess, sys

EXT = ('.ts', '.tsx', '.js', '.cjs', '.mjs', '.css', '.html', '.sql', '.yml', '.yaml', '.md', '.txt')
SKIP = ('package-lock.json', 'public/fonts/')

def tracked(root):
    out = subprocess.check_output(['git', '-C', root, 'ls-files']).decode().split('\n')
    return [f for f in out if f.endswith(EXT) and not f.startswith(SKIP) and 'package-lock' not in f]

def lines(path, min_len):
    try:
        with open(path, errors='ignore') as fh:
            return [l.strip() for l in fh if len(l.strip()) >= min_len]
    except OSError:
        return []

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('upstream')
    ap.add_argument('--ours', default='.')
    ap.add_argument('--min-len', type=int, default=12)
    ap.add_argument('--max-percent', type=float, default=3.0)
    a = ap.parse_args()

    up = collections.Counter()
    for f in tracked(a.upstream):
        up.update(lines(os.path.join(a.upstream, f), a.min_len))

    rows, total, same = [], 0, 0
    for f in tracked(a.ours):
        L = lines(os.path.join(a.ours, f), a.min_len)
        if not L:
            continue
        m = sum(1 for l in L if up[l] > 0)
        total += len(L); same += m
        rows.append((f, len(L), m))
    rows.sort(key=lambda r: -r[2])

    pct = 100 * same / total if total else 0
    print(f'| File | Lines | Matching | Share |\n|---|---:|---:|---:|')
    for f, n, m in rows:
        if m:
            print(f'| {f} | {n} | {m} | {100*m/n:.0f}% |')
    print(f'\nTOTAL {total} lines, {same} matching upstream = {pct:.1f}% (limit {a.max_percent}%)')
    sys.exit(0 if pct <= a.max_percent else 1)

if __name__ == '__main__':
    main()
