"""Score + sound cues for Episode 6 "The Storm" (exec'd by build.py). One big moment: the storm stops dead on "still"."""
W_ = lambda sid, word: S[sid]["start"] + S[sid]["w"][word]
G2, D3, G3, B3, D4, E3, C3, A2, Fs3 = 98.0, 146.83, 196.0, 246.94, 293.66, 164.81, 130.81, 110.0, 185.0
st0 = S["storm"]["start"]; still = W_("rebuke", "still") + 0.25
# daylight parables: warm G major, lake waves, birds
add(pad([G2, D3, G3, B3]) * slow * env(0, S["evening"]["start"] + 0.5, 1.0, 1.2), 0.16)
waves = lp(noise, 500) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.13 * tt) ** 2)
add(waves * env(0, S["sower"]["start"] + 0.3, 0.6, 0.5), 0.12, -0.2)
def chirp(f0=2600):
    n = int(0.18 * SR); x = np.arange(n) / SR
    return (np.sin(2 * np.pi * np.cumsum(f0 + 900 * x / 0.18 + 200 * np.sin(2 * np.pi * 30 * x)) / SR) * np.sin(np.pi * x / 0.18) ** 2).astype(np.float32)
for k in range(5): place(chirp(2400 + 300 * (k % 3)), W_("seeds", "birds") - 0.2 + k * 0.17, 0.05, 0.4 - 0.2 * k)
place(note(392.0, 1.0), W_("seeds", "path"), 0.06); place(note(349.23, 1.0), W_("seeds", "rock"), 0.06); place(note(311.13, 1.2), W_("seeds", "thorns"), 0.06)
place(swell(1.2, 200, 6000), W_("good", "grew") - 0.6, 0.2)
for w in ("thirty", "sixty", "hundred"): place(note({"thirty": 587.33, "sixty": 739.99, "hundred": 880.0}[w], 1.2), W_("good", w), 0.08)
add(shim * env(W_("mustard", "biggest") - 0.5, S["evening"]["start"], 0.8, 0.6), 0.05)
place(swell(1.0, 200, 6000), W_("mustard", "biggest") - 0.9, 0.22); place(hit(44, 1.8, 0.3), W_("mustard", "biggest") + 0.1, 0.45)
# evening + sleep: soft, low, gentle lapping
add(pad([E3 * 0.5, B3 * 0.5, E3, G3]) * env(S["evening"]["start"], st0 + 0.3, 1.0, 0.3), 0.14)
add(waves * env(S["evening"]["start"], st0, 0.6, 0.3), 0.07, 0.2)
cr = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 28 * tt) > 0.3) * (np.sin(2 * np.pi * 1.1 * tt) > 0.2)
add(cr.astype(np.float32) * env(S["sleep"]["start"], st0, 0.5, 0.2), 0.01, 0.4)
# THE STORM: rain, howling wind, crashing waves, thunder, creaking — cut dead at "still"
storm_env = env(st0, still, 0.4, 0.02)
rain = bp(noise, 2000, 10000) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.7 * tt))
howl = bp(noise, 300, 1500) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 0.23 * tt + np.sin(2 * np.pi * 0.11 * tt) * 2)))
surf = lp(noise, 700) * (0.3 + 0.7 * (np.sin(2 * np.pi * 0.45 * tt) > 0.2))
add(rain * storm_env, 0.02, 0.25); add(howl * storm_env, 0.025, -0.3); add(surf * storm_env, 0.03)
add(pad([C3 * 0.5, Fs3 * 0.5, C3]) * (0.6 + 0.4 * np.sin(2 * np.pi * 4 * tt)) * storm_env, 0.05)
for k, b in enumerate([st0 + 0.6, st0 + 2.4, st0 + 4.1, S["wake"]["start"] + 0.2, S["rebuke"]["start"] - 0.3]):
    place(hit(30 + k * 3, 2.6, 1.0), b, 0.2); place(bp(rng.standard_normal(int(0.4 * SR)).astype(np.float32), 1500, 9000) * np.exp(-np.arange(int(0.4 * SR)) / SR * 8), b, 0.08)
for b in np.arange(st0 + 0.3, still - 0.2, 1.3):
    n_ = int(0.6 * SR); x_ = np.arange(n_) / SR
    place((np.sin(2 * np.pi * np.cumsum(140 + 60 * np.sin(2 * np.pi * 2 * x_)) / SR) * np.exp(-x_ * 4) * (np.sin(2 * np.pi * 18 * x_) > 0)).astype(np.float32), b, 0.035)  # creak
# the silence: a single held high note, then a gentle G major as the moon comes out
n_ = int(3.0 * SR); x_ = np.arange(n_) / SR
place((np.sin(2 * np.pi * 1567.98 * x_) * np.minimum(x_ / 0.6, 1) * np.exp(-x_ * 0.6)).astype(np.float32), still + 0.3, 0.035)
add(pad([G2, D3, G3, B3, D4]) * env(still + 1.0, S["whois"]["start"] + 1.0, 2.0, 1.0), 0.15)
add(waves * env(still + 0.8, DUR, 2.0, 1.0), 0.04)
add(pad([E3 * 0.5, B3 * 0.5, E3, G3, B3]) * env(S["whois"]["start"], DUR, 1.0, 2.0), 0.16)
place(hit(40, 2.2, 0.3), W_("whois", "who"), 0.5)
# closing
ed = S["end"]["start"]
mel = [(392.0, 1), (493.88, 1), (587.33, 1), (783.99, 2), (739.99, 1), (587.33, 1), (659.26, 1), (783.99, 3)]
for k, (fq, d) in enumerate(mel):
    place(note(fq, d * 1.2), ed - 1.6 + sum(x for _, x in mel[:k]) * 0.5, 0.13, 0.15)
