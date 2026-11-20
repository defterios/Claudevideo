"""Score + sound cues for Episode 7 "Legion" (exec'd by build.py). Big moment: the herd rushes into the sea."""
W_ = lambda sid, word: S[sid]["start"] + S[sid]["w"][word]
D2, A2, D3, F3, Eb2, Bb2, G2, B2, Fs3, A3 = 73.42, 110.0, 146.83, 174.61, 77.78, 116.54, 98.0, 123.47, 185.0, 220.0
night_end = S["town"]["start"]
wind = bp(noise, 200, 1200) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.15 * tt + 1))
add(wind * env(0, night_end + 0.3, 1.0, 0.6), 0.05, 0.2)
waves = lp(noise, 500) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.13 * tt) ** 2)
add(waves * env(0, S["tombs"]["start"] + 0.5, 0.8, 0.8), 0.08, -0.2)
add(pad([D2, A2, D3, F3]) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.2 * tt)) * env(0, S["pigs"]["start"], 2.0, 0.6), 0.12)
# a distant scream (falling, filtered)
def scream(d=1.4, f0=900):
    n = int(d * SR); x = np.arange(n) / SR
    f = f0 * (1 - 0.35 * x / d) + 40 * np.sin(2 * np.pi * 6 * x)
    v = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.6 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    return bp((v * np.sin(np.pi * x / d) ** 0.7).astype(np.float32), 500, 3000)
place(scream(), W_("landing", "screaming"), 0.05, 0.5)
# chains
def clank(f=2100):
    n = int(0.5 * SR); x = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * x) + 0.7 * np.sin(2 * np.pi * f * 1.41 * x) + 0.5 * np.sin(2 * np.pi * f * 2.3 * x)) * np.exp(-x * 9)).astype(np.float32)
for k in range(3): place(clank(1800 + 300 * k), W_("landing", "chains") + k * 0.12, 0.05, 0.3)
place(clank(1500), W_("tombs", "chain") + 0.2, 0.045); place(clank(2400), W_("tombs", "chain") + 0.3, 0.04); place(hit(60, 0.5, 0.2), W_("tombs", "chain") + 0.2, 0.15)
for k in np.arange(S["run"]["start"] + 0.3, W_("run", "feet"), 0.3): place(knock(170 + 20 * (int(k * 10) % 2)), k, 0.09)  # running feet
place(hit(46, 1.4, 0.3), W_("run", "feet") + 0.1, 0.25)
# the demons: dissonant drone + a crowd of whispers ("we are many")
dem0 = S["run"]["start"] + S["run"]["segs"][1]
add(pad([D2 * 0.5, Eb2, A2 * 0.5]) * (0.6 + 0.4 * np.sin(2 * np.pi * 5 * tt)) * env(dem0, S["rush"]["start"] + 0.5, 0.4, 0.4), 0.08)
whisp = bp(noise, 1500, 6000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 3.3 * tt) * np.sin(2 * np.pi * 1.7 * tt + 1)))
add(whisp * env(S["legion"]["start"], S["pigs"]["start"] + 0.2, 0.6, 0.3), 0.022, 0.3)
place(hit(36, 2.6, 0.8), W_("legion", "legion"), 0.22)
# pigs grunting on the hill
def grunt():
    n = int(0.25 * SR); x = np.arange(n) / SR
    return (lp(rng.standard_normal(n).astype(np.float32), 400) * np.sin(np.pi * x / 0.25) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * x)) * 6).astype(np.float32)
for k in np.arange(S["pigs"]["start"] + 0.3, S["rush"]["start"] + 0.5, 0.55): place(grunt(), k + (int(k * 7) % 3) * 0.1, 0.04, (int(k * 3) % 3 - 1) * 0.4)
# THE RUSH: stampede rumble + hooves, then the splash
rs = W_("rush", "rushed"); sea = W_("rush", "sea")
rumble = lp(rng.standard_normal(int((sea - rs + 0.6) * SR)).astype(np.float32), 180) * 3
place(rumble * np.minimum(np.arange(len(rumble)) / SR / 0.3, 1), rs - 0.1, 0.05)
for k in np.arange(rs - 0.1, sea + 0.3, 0.09): place(knock(110 + (int(k * 50) % 4) * 25), k, 0.035, (int(k * 37) % 5 - 2) * 0.25)
splash = bp(rng.standard_normal(int(2.0 * SR)).astype(np.float32), 300, 7000) * np.exp(-np.arange(int(2.0 * SR)) / SR * 2.2)
place(splash, sea + 0.15, 0.16); place(hit(40, 2.2, 0.5), sea + 0.15, 0.3); place(swell(0.7), sea - 0.55, 0.1)
add(pad([D3, A3, D3 * 2]) * env(sea + 0.6, S["town"]["start"] + 0.4, 0.8, 0.4), 0.05)
# morning: birds, warm D major
def chirp(f0=2600):
    n = int(0.18 * SR); x = np.arange(n) / SR
    return (np.sin(2 * np.pi * np.cumsum(f0 + 900 * x / 0.18 + 200 * np.sin(2 * np.pi * 30 * x)) / SR) * np.sin(np.pi * x / 0.18) ** 2).astype(np.float32)
for k in range(8): place(chirp(2300 + 250 * (k % 4)), S["town"]["start"] + 0.6 + k * 0.7 + (k % 2) * 0.2, 0.035, (k % 3 - 1) * 0.5)
add(pad([D2, A2, D3, Fs3, A3]) * slow * env(S["town"]["start"], S["afraid"]["start"] + 0.3, 1.0, 0.5), 0.15)
add(pad([B2, D3, Fs3]) * env(S["afraid"]["start"], S["home"]["start"] + 0.2, 0.5, 0.5), 0.13)
add(pad([D2, A2, D3, Fs3, A3, D3 * 2]) * env(S["home"]["start"], DUR, 0.8, 2.0), 0.055)
add(shim * env(W_("home", "done") - 0.4, DUR - 1.0, 0.8, 1.5), 0.03)
ed = S["end"]["start"]
mel = [(293.66, 1), (369.99, 1), (440.0, 1), (587.33, 2), (554.37, 1), (440.0, 1), (493.88, 1), (587.33, 3)]
for k, (fq, d) in enumerate(mel):
    place(note(fq, d * 1.2), ed - 0.4 + sum(x for _, x in mel[:k]) * 0.5, 0.11, 0.15)
