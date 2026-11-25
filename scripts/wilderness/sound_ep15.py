"""Score + sound cues for Episode 15 "Hosanna!" (exec'd by build.py).
Big moment: the tables crash over (impact, coins, wings). Opening: festive procession and cheering crowd."""
def W_(sid, word, f=0.5):
    sc = S[sid]
    return sc["start"] + sc["w"][word] if word in sc["w"] else sc["start"] + f * (sc["end"] - sc["start"])
D2, A2, D3, F3, A3, G2, C3, E3, G3, Bb2, Fs3 = 73.42, 110.0, 146.83, 174.61, 220.0, 98.0, 130.81, 164.81, 196.0, 116.54, 185.0
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
cheer = bp(noise, 500, 3000) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 2.3 * tt)))
def coin(f=2400):
    n = int(0.25 * SR); x = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * x) + 0.6 * np.sin(2 * np.pi * f * 1.5 * x)) * np.exp(-x * 14)).astype(np.float32)
def flap():
    n = int(0.12 * SR); x = np.arange(n) / SR
    return (bp(rng.standard_normal(n).astype(np.float32), 400, 3000) * np.sin(np.pi * x / 0.12) ** 2).astype(np.float32)
def clop(f=380):
    n = int(0.09 * SR); x = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * x) * np.exp(-x * 70) + 0.4 * rng.standard_normal(n) * np.exp(-x * 140)).astype(np.float32)
# the road to Jerusalem: festive
add(pad([D2, A2, D3, Fs3]) * slow * env(0, S["fig"]["start"] + 0.3, 1.0, 0.8), 0.055)
for k in np.arange(S["ride"]["start"] + 0.4, S["hosanna"]["end"], 0.42): place(clop(360 + 40 * (int(k * 10) % 2)), k, 0.03, 0.2)
add(crowd * env(S["branches"]["start"], S["fig"]["start"], 0.6, 0.6), 0.02)
add(cheer * env(S["hosanna"]["start"], S["hosanna"]["end"] + 0.3, 0.2, 0.5), 0.03)
ho = S["hosanna"]["start"]
for k, fq in enumerate([587.33, 739.99, 880.0, 1174.66]): place(note(fq, 2.0), ho + 0.1 + k * 0.22, 0.05, (k - 1.5) * 0.3)
add(shim * env(ho, S["hosanna"]["end"] + 0.5, 0.2, 0.6), 0.025)
# the fig tree
add(pad([G2, D3, Bb2 * 2, F3]) * env(S["fig"]["start"], S["temple"]["start"] + 0.3, 0.6, 0.5), 0.05)
place(hit(46, 1.2, 0.2), W_("curse", "ever", 0.5) + 0.05, 0.05)
# the temple market, then the tables crash (BIG MOMENT)
add(crowd * env(S["temple"]["start"], W_("tables", "overturned", 0.3), 0.4, 0.1), 0.035)
for k in range(8): place(coin(2000 + 250 * (k % 4)), S["temple"]["start"] + 0.5 + k * 0.4, 0.015, (k % 3 - 1) * 0.5)
ov = W_("tables", "overturned", 0.3)
place(swell(0.6, 300, 6000), ov - 0.55, 0.05); place(hit(40, 2.2, 0.35), ov + 0.02, 0.11); place(knock(160), ov + 0.05, 0.08)
for k in range(16): place(coin(1800 + 180 * (k % 7)), ov + 0.08 + k * 0.05 + 0.02 * rng.random(), 0.04, (k % 5 - 2) * 0.3)
dv = W_("tables", "doves", 0.85)
for k in range(10): place(flap(), dv + k * 0.09, 0.05, (k % 3 - 1) * 0.6)
add(pad([D2, A2, D3, F3, A3]) * env(ov, S["plot"]["end"], 0.1, 0.8), 0.06)
# plotting priests: low and dark
add(pad([D2 * 0.5, A2 * 0.5, D2]) * env(S["plot"]["start"], S["withered"]["start"] + 0.3, 0.6, 0.5), 0.05)
# withered tree, then faith that moves mountains
add(pad([G2, D3, Bb2 * 2]) * env(S["withered"]["start"], S["faith"]["start"] + 0.3, 0.6, 0.5), 0.045)
mt = W_("faith", "mountain", 0.6)
place(swell(1.2, 200, 7000), mt + 0.4, 0.04); place(hit(36, 2.4, 0.2), mt + 1.6, 0.08)
add(lp(noise, 300) * env(mt + 1.6, mt + 3.5, 0.05, 1.5), 0.04)
add(pad([D2, A2, D3, Fs3, A3, D3 * 2]) * slow * env(S["believe"]["start"], DUR, 0.8, 2.0), 0.06)
add(shim * env(W_("forgive", "forgive", 0.8), DUR - 1, 0.3, 1.5), 0.025)
ed = S["end"]["start"]
for k, fq in enumerate([293.66, 369.99, 440.0, 587.33, 554.37, 440.0, 587.33]):
    place(note(fq, 2.0), ed + 0.1 + k * 0.42, 0.08, 0.15)
