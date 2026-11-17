"""Score + sound cues for Episode 2 "Follow Me" (exec'd by build.py, which provides the helpers)."""
W_ = lambda sid, word: S[sid]["start"] + S[sid]["w"][word]
G2, D3, G3, B3, D4, E3, C3, Eb3, Ab2, Bb2 = 98.0, 146.83, 196.0, 246.94, 293.66, 164.81, 130.81, 155.56, 103.83, 116.54
# warm G major at the lake, darkens in the synagogue, back to G for the healings
add(pad([G2, D3, G3, B3]) * slow * env(0, S["synagogue"]["start"] + 0.5, 1.5, 1.2), 0.17)
add(pad([E3 * 0.5, B3 * 0.5, E3]) * env(S["synagogue"]["start"], S["demon"]["start"] + 0.4, 1.0, 0.4), 0.18)
trem = 0.6 + 0.4 * np.sin(2 * np.pi * 6.5 * tt)
add(pad([G2 * 0.5, Ab2 * 0.5, D3 * 0.5, Eb3 * 0.5]) * trem * env(S["demon"]["start"], W_("rebuke", "out") + 0.1, 0.4, 0.15), 0.22)  # the spirit
add(pad([C3, G3, E3 * 2]) * env(S["house"]["start"], S["leper"]["start"], 1.2, 1.0), 0.14)
add(pad([G2, D3, B3, D4]) * env(W_("rebuke", "gone") - 0.2, S["house"]["start"] + 0.5, 0.6, 1.0), 0.15)
add(pad([G2, D3, G3, B3, D4]) * env(S["touch"]["start"] + 1.0, DUR, 1.5, 2.0), 0.19)
add(shim * env(W_("rebuke", "gone"), S["house"]["start"], 0.3, 1.5), 0.05)
add(shim * env(W_("house", "hand"), S["door"]["start"] + 0.5, 0.5, 1.5), 0.045)
add(shim * env(W_("touch", "touched"), DUR - 1.5, 0.6, 2.0), 0.06)

# lake: waves + gulls
waves = lp(noise, 500) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.13 * tt) ** 2)
add(waves * env(0, S["synagogue"]["start"] + 0.3, 0.6, 0.6), 0.16, -0.15)
def gull():
    n = int(0.45 * SR); x = np.arange(n) / SR
    f = 1900 - 900 * x / 0.45 + 120 * np.sin(2 * np.pi * 14 * x)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * x / 0.45) ** 2).astype(np.float32)
for at, pan in [(1.4, 0.6), (2.1, 0.5), (6.0, -0.5), (S["zebedee"]["start"] + 0.8, 0.4), (S["zebedee"]["start"] + 1.4, 0.5)]:
    place(gull(), at, 0.05, pan)
# "Follow me": low swell; nets hit the water
place(swell(0.8, 150, 3000), W_("call", "follow") - 0.7, 0.25); place(hit(44, 2.2, 0.4), W_("call", "follow") + 0.05, 0.6)
splash = bp(rng.standard_normal(int(0.9 * SR)).astype(np.float32), 400, 6000) * np.exp(-np.arange(int(0.9 * SR)) / SR * 6)
place(splash, W_("drop", "dropped") + 0.15, 0.5); place(hit(60, 0.8, 0.2), W_("drop", "dropped") + 0.12, 0.4)
place(hit(50, 1.4, 0.3), W_("zebedee", "called"), 0.45)
# synagogue: room tone and a murmur
mur = bp(noise, 180, 700) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * tt + np.sin(2 * np.pi * 0.31 * tt) * 2))
add(mur * env(S["synagogue"]["start"], W_("demon", "screaming"), 0.5, 0.3), 0.05)
place(swell(0.6, 300, 8000), W_("demon", "screaming") - 0.55, 0.45)
place(hit(36, 2.6, 1.6), W_("demon", "screaming") + 0.05, 1.0); place(hit(80, 0.9, 1.2), W_("demon", "screaming") + 0.05, 0.4)
for k in np.arange(W_("demon", "screaming") + 0.6, S["rebuke"]["start"] + S["rebuke"]["w"]["out"], 0.62): heart(k, 0.35)
place(hit(48, 0.8), W_("rebuke", "quiet"), 0.55)
o = W_("rebuke", "out")
place(swell(0.7), o - 0.6, 0.35); place(hit(34, 3.2, 1.6), o + 0.1, 1.1); place(hit(95, 1.0, 1.0), o + 0.1, 0.5)
# evening house: crickets, fever heartbeat, release on "left"
cr = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 28 * tt) > 0.3) * (np.sin(2 * np.pi * 1.1 * tt) > 0.2)
add(cr.astype(np.float32) * env(S["house"]["start"], S["door"]["start"] + 0.4, 0.5, 0.5), 0.012, 0.4)
for k in np.arange(S["house"]["start"] + 0.4, W_("house", "hand"), 0.55): heart(k, 0.3)
place(note(587.33, 2.0), W_("house", "hand"), 0.12); place(note(739.99, 2.4), W_("house", "left"), 0.12)
# the town at the door: crowd swell
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
add(crowd * env(S["door"]["start"], S["leper"]["start"] + 0.3, 2.0, 0.4), 0.09)
# leper: wind, the touch, "clean"
wind = bp(noise, 180, 900) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.13 * tt + 1))
add(wind * env(S["leper"]["start"], W_("touch", "touched") + 0.6, 0.5, 1.2), 0.13, 0.2)
place(hit(55, 1.0, 0.3), W_("leper", "knees"), 0.5)
place(swell(1.0, 200, 6000), W_("touch", "touched") - 0.9, 0.25); place(hit(40, 2.4, 0.4), W_("touch", "touched") + 0.05, 0.65)
place(swell(0.8), W_("touch", "clean") - 0.7, 0.3); place(hit(38, 3.0, 1.0), W_("touch", "clean") + 0.05, 0.8)
# closing: frame drum + rising line in G
ed = S["end"]["start"]
for k, b in enumerate(np.arange(ed - 1.6, DUR - 1.6, 0.5)):
    place(hit(62 if k % 4 else 50, 0.6, 0.3), b, 0.3 if k % 4 else 0.45)
mel = [(392.0, 1), (493.88, 1), (587.33, 1), (783.99, 2), (739.99, 1), (587.33, 1), (659.26, 1), (783.99, 3)]
for k, (fq, d) in enumerate(mel):
    place(note(fq, d * 1.2), ed - 1.6 + sum(x for _, x in mel[:k]) * 0.5, 0.15, 0.15)
