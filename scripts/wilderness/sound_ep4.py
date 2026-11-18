"""Score + sound cues for Episode 4 "Lord of the Sabbath" (exec'd by build.py). Moody 80s-anime synth score."""
W_ = lambda sid, word: S[sid]["start"] + S[sid]["w"][word]
D2, F2, A2, C3, D3, E3, F3, G3, A3, Bb2, Cs3 = 73.42, 87.31, 110.0, 130.81, 146.83, 164.81, 174.61, 196.0, 220.0, 116.54, 138.59
# warm field (D dorian), dark synagogue drone, tension, release in D major, night dread
def saw(freqs, cut=1200, det=0.006):
    o = np.zeros(N, np.float32)
    for f in freqs:
        for d in (-det, 0, det):
            ph = (f * (1 + d) * tt + rng.uniform(0, 1)) % 1.0
            o += (2 * ph - 1).astype(np.float32)
    return lp(o / (len(freqs) * 3), cut)
fs, fe = 0, S["hand"]["start"]
add(saw([D2, A2, D3, F3, A3], 900) * slow * env(0, fe + 0.3, 2.5, 1.0), 0.22)
arp = [D3 * 2, F3 * 2, A3 * 2, C3 * 4, A3 * 2, F3 * 2]
for k, b in enumerate(np.arange(0.4, fe - 0.4, 0.375)): place(note(arp[k % 6], 0.9), b, 0.06, 0.25 if k % 2 else -0.25)
wind = bp(noise, 300, 2500) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.17 * tt + 1))
add(wind * env(0, fe, 1.5, 0.6), 0.07, 0.2)
place(hit(40, 2.6, 0.5), S["watchers"]["start"] + 0.05, 0.75); place(swell(0.9, 150, 3000), S["watchers"]["start"] - 0.85, 0.3)
place(note(F3, 3.0), S["reply"]["start"] + 0.2, 0.08); place(note(A3, 3.0), S["reply"]["start"] + 0.2, 0.08)
# synagogue: low drone + dust ambience + far heartbeat
add(saw([D2 * 0.5, A2 * 0.5, D2], 400) * env(S["hand"]["start"], S["stretch"]["start"] + 0.5, 1.0, 0.4), 0.28)
add(saw([Bb2, F3, A3 * 0.5], 700) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.25 * tt)) * env(S["watch"]["start"], S["silence"]["start"] + 0.3, 1.0, 0.2), 0.15)
for k in np.arange(S["watch"]["start"] + 0.3, S["silence"]["start"], 0.9): heart(k, 0.3)
place(hit(46, 1.6, 0.4), S["stand"]["start"] + 0.1, 0.55)
for w in ("good", "life", "kill"): place(hit(52, 0.9, 0.3), W_("question", w), 0.4)
# silence: everything drops out, a single high tone
sil = S["silence"]["start"]
n_ = int(2.4 * SR); x_ = np.arange(n_) / SR
place((np.sin(2 * np.pi * 2093 * x_) * np.minimum(x_ / 0.4, 1) * np.exp(-x_ * 0.9)).astype(np.float32), sil + 0.2, 0.03)
for k in np.arange(sil + 0.1, S["stretch"]["start"] + S["stretch"]["w"]["hand"], 0.55): heart(k, 0.55)
# the healing: reverse swell into a bright major chord + shimmer
hl = S["heal"]["start"]
place(swell(1.6, 200, 9000), hl - 1.5, 0.45); place(hit(34, 3.4, 1.4), hl + 0.05, 1.1); place(hit(100, 1.2, 1.0), hl + 0.05, 0.4)
add(saw([D3, Fs3 := 185.0, A3, D3 * 2], 2400) * env(hl, S["plot"]["start"] + 0.2, 0.1, 1.2), 0.2)
add(shim * env(hl, S["plot"]["start"], 0.2, 1.2), 0.08)
# night plot: fog wind, crickets, low brass-ish stabs, the whisper
pl = S["plot"]["start"]
add(wind * env(pl, S["end"]["start"] + 0.3, 0.6, 0.6), 0.1, -0.2)
cr = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 28 * tt) > 0.3) * (np.sin(2 * np.pi * 1.1 * tt) > 0.2)
add(cr.astype(np.float32) * env(pl, S["end"]["start"], 0.6, 0.6), 0.012, 0.4)
add(saw([D2, Eb2 := 77.78, A2 * 0.5], 600) * env(pl, S["end"]["start"] + 0.5, 0.8, 0.5), 0.26)
die = W_("plot", "die")
place(swell(0.8), die - 0.75, 0.35); place(hit(30, 3.6, 1.2), die + 0.4, 1.2)
# end: the opening arp returns, softer
ed = S["end"]["start"]
for k, b in enumerate(np.arange(ed - 1.2, DUR - 1.2, 0.375)): place(note(arp[k % 6], 0.9), b, 0.07, 0.25 if k % 2 else -0.25)
add(saw([D2, A2, D3, F3], 900) * env(ed - 1.2, DUR, 1.0, 1.5), 0.2)
