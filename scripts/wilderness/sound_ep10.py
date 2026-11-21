"""Score + sound cues for Episode 10 "Walking on Water" (exec'd by build.py). Gentle mix. Big moment: "It is I"."""
W_ = lambda sid, word: S[sid]["start"] + S[sid]["w"][word]
G2, D3, G3, B3, D4, E3, C3, A2, Fs3, Bb2 = 98.0, 146.83, 196.0, 246.94, 293.66, 164.81, 130.81, 110.0, 185.0, 116.54
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
waves = lp(noise, 500) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.13 * tt) ** 2)
day_end = S["pray"]["start"]
add(pad([G2, D3, G3, B3]) * slow * env(0, S["sheep"]["start"] + 0.3, 1.0, 0.6), 0.07)
add(waves * env(0, S["run"]["start"], 0.6, 0.5), 0.04, -0.2)
add(crowd * env(S["run"]["start"], S["bless"]["start"], 0.6, 0.6), 0.025)
place(hit(44, 1.6, 0.3), S["run"]["start"] + S["run"]["w"]["thousand"] + 0.2, 0.08)
add(pad([E3 * 0.5, B3 * 0.5, E3, G3]) * env(S["sheep"]["start"], S["bless"]["start"], 0.6, 0.4), 0.06)
place(note(587.33, 1.2), W_("loaves", "five"), 0.035); place(note(739.99, 1.2), W_("loaves", "two"), 0.035)
# blessing and the bread that keeps going
bk = W_("bless", "broke")
place(swell(1.2, 200, 7000), bk - 1.1, 0.05); place(hit(46, 1.8, 0.3), bk + 0.05, 0.1)
add(shim * env(bk, S["pray"]["start"], 0.3, 0.8), 0.025)
add(pad([G2, D3, G3, B3, D4]) * env(bk, day_end + 0.3, 0.6, 0.8), 0.06)
for k in range(12): place(note([587.33, 659.26, 739.99, 783.99][k % 4], 0.6), W_("baskets", "twelve") + 0.2 + k * 0.11, 0.02, (k % 3 - 1) * 0.4)
# night on the lake: wind, rowing creaks, low drone
nt = S["row"]["start"]
wind = bp(noise, 200, 1200) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 0.21 * tt + 1)))
add(wind * env(S["pray"]["start"] + 1.0, W_("calm", "stopped") + 0.1, 1.0, 0.05), 0.035, 0.2)
add(waves * env(nt, W_("calm", "stopped") + 0.1, 0.6, 0.05), 0.05)
add(pad([E3 * 0.5, Bb2, E3]) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.3 * tt)) * env(nt, S["courage"]["start"], 0.6, 0.4), 0.06)
for k in np.arange(nt + 0.3, S["walk"]["end"], 1.25): place(knock(150 + 20 * (int(k) % 2)), k, 0.04, 0.3)   # oars
wt = W_("walk", "water")
place(swell(1.0, 200, 6000), wt - 0.9, 0.05)
n_ = int(3.0 * SR); x_ = np.arange(n_) / SR
place((np.sin(2 * np.pi * 1318.5 * x_) * np.minimum(x_ / 0.6, 1) * np.exp(-x_ * 0.7)).astype(np.float32), wt, 0.02)
place(hit(38, 1.6, 0.4), S["ghost"]["start"] + 0.05, 0.09)
# "It is I": warm reveal; the wind stops on "stopped"
iam = W_("courage", "i")
place(swell(0.8, 200, 7000), iam - 0.7, 0.05); place(hit(42, 2.4, 0.3), iam + 0.05, 0.1)
add(pad([G2, D3, G3, B3, D4]) * env(iam, DUR, 0.4, 2.0), 0.06)
add(shim * env(W_("calm", "stopped"), DUR - 1.0, 0.3, 1.5), 0.03)
ed = S["end"]["start"]
mel = [(392.0, 1), (493.88, 1), (587.33, 1), (783.99, 2), (739.99, 1), (587.33, 1), (659.26, 1), (783.99, 3)]
for k, (fq, d) in enumerate(mel):
    place(note(fq, d * 1.2), ed - 0.4 + sum(x for _, x in mel[:k]) * 0.5, 0.09, 0.15)
