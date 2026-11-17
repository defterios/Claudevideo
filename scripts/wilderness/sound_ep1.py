"""Score + sound cues for Episode 1 (exec'd by build.py, which provides the helpers)."""
# drone: D minor pad, darkest in the desert, opens to D major for the ending
D2, A2, D3, F3, A3, D4, Fs4, A4, Cs3, G2 = 73.42, 110.0, 146.83, 174.61, 220.0, 293.66, 369.99, 440.0, 138.59, 98.0
slow = 0.75 + 0.25 * np.sin(2 * np.pi * 0.07 * tt)
add(pad([D2, A2, D3]) * slow * env(0, S["angels"]["start"], 2.5, 1.2), 0.20)
add(pad([D3, F3, A3]) * env(S["drive"]["start"], S["go"]["end"], 2.0, 0.6) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * tt)), 0.11)
add(pad([D2 * 0.5, Cs3 * 0.5, G2]) * env(S["bread"]["start"], S["go"]["end"] - 0.6, 3.0, 0.5), 0.17)  # tempter dissonance
add(pad([D3, A3, D4, Fs4]) * env(S["angels"]["start"], DUR, 1.2, 2.0), 0.19)
add(pad([D2, A2]) * env(S["angels"]["start"], DUR, 1.5, 2.0), 0.20)
shim = sum(np.sin(2 * np.pi * f * tt) * (0.5 + 0.5 * np.sin(2 * np.pi * r * tt + p)) for f, r, p in [(1174.7, 0.9, 0), (1480, 1.3, 2), (1760, 0.7, 4), (2349, 1.1, 1)]).astype(np.float32) / 4
add(shim * env(S["angels"]["start"] + 0.3, S["walk"]["start"] + 1.5, 1.0, 2.5), 0.055)
add(shim * env(S["sky"]["start"] + 0.6, S["drive"]["start"], 0.5, 1.2), 0.05)

# ambience: river, desert wind, night
water = bp(noise, 500, 3500) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.6 * tt + np.sin(2 * np.pi * 0.23 * tt) * 3))
add(water * env(2.2, S["drive"]["start"] + 0.3, 1.0, 1.0), 0.05)
wind = bp(noise, 180, 900) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.13 * tt + 1) * np.sin(2 * np.pi * 0.31 * tt))
add(wind * env(S["drive"]["start"], S["angels"]["start"], 0.5, 1.0), 0.16, 0.2)
add(np.roll(wind, SR * 3) * env(S["walk"]["start"], DUR, 1.0, 2.0), 0.05, -0.2)


r = S["river"]
for k in range(4): place(knock(380 + 30 * (k % 2)), 0.62 + k * 0.62, 0.30, -0.2)       # carpenter hammering
sk = S["sky"]["start"]
place(swell(1.3), sk + 0.05, 0.35)
place(hit(38, 3.0, 1.2), sk + 1.35, 1.0); place(hit(70, 1.2, 0.8), sk + 1.35, 0.5)      # the sky tears
place(hit(34, 2.4, 0.3), S["voice"]["start"] + 0.3, 0.55)
place(swell(0.5, 300, 6000), S["drive"]["start"] - 0.3, 0.3); place(hit(50, 1.2), S["drive"]["start"] + 0.2, 0.6)
f = S["fast"]
for w in ("forty", "no", "just"): place(hit(46, 1.4), f["start"] + f["w"][w], 0.55)
for k in np.arange(S["bread"]["start"] + 0.5, S["go"]["start"], 1.05): heart(k, 0.26)       # heartbeat under the temptations
for k in np.arange(S["go"]["start"], S["go"]["start"] + S["go"]["w"]["go"] - 0.2, 0.7): heart(k, 0.5)
for sid in ("temple", "kingdoms"): place(swell(0.5, 300, 6000), S[sid]["start"] - 0.35, 0.3); place(hit(42, 2.0), S[sid]["start"] + 0.1, 0.7)
place(hit(60, 0.4), S["kingdoms"]["start"] + S["kingdoms"]["w"]["cross"], 0.5)
go = S["go"]["start"] + S["go"]["w"]["go"]
place(swell(0.6), go - 0.5, 0.3); place(hit(36, 3.2, 1.5), go + 0.12, 1.1); place(hit(90, 1.0, 1.0), go + 0.12, 0.5)
# closing march: frame drum + simple rising line (D major)
wk = S["walk"]["start"]
for k, b in enumerate(np.arange(wk + 0.2, DUR - 2.2, 0.5)):
    place(hit(62 if k % 4 else 50, 0.6, 0.3), b, 0.34 if k % 4 else 0.5)
for k, (fq, d) in enumerate([(D4, 1), (Fs4, 1), (A4, 1), (587.33, 2), (493.88, 1), (A4, 1), (587.33, 1), (739.99, 3)]):
    place(note(fq, d * 1.6), wk + 0.2 + sum(x for _, x in [(D4, 1), (Fs4, 1), (A4, 1), (587.33, 2), (493.88, 1), (A4, 1), (587.33, 1), (739.99, 3)][:k]) * 1.0, 0.16, 0.15)

