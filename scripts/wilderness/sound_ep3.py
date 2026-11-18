"""Score + sound cues for Episode 3 "Through the Roof" (exec'd by build.py, which provides the helpers)."""
W_ = lambda sid, word: S[sid]["start"] + S[sid]["w"][word]
A2, E3, A3, Cs4, E4, F3, C3, G3, D3, Bb2 = 110.0, 164.81, 220.0, 277.18, 329.63, 174.61, 130.81, 196.0, 146.83, 116.54
# A major, warm; a darker turn for the scholars; festive for the party
add(pad([A2, E3, A3]) * slow * env(0, S["scholars"]["start"] + 0.3, 1.2, 0.8), 0.17)
add(pad([A3, Cs4, E4]) * env(W_("forgive", "forgiven") - 0.2, S["scholars"]["start"] + 0.2, 0.6, 0.6), 0.12)
add(shim * env(W_("forgive", "forgiven"), S["scholars"]["start"] + 0.4, 0.4, 0.8), 0.05)
add(pad([D3 * 0.5, Bb2, F3]) * env(S["scholars"]["start"], S["rise"]["start"] + 0.4, 0.6, 0.6), 0.2)
add(pad([A2, E3, A3, Cs4]) * env(S["rise"]["start"], S["levi"]["start"] + 0.5, 0.6, 1.0), 0.16)
add(shim * env(W_("rise", "stood"), S["amazed"]["end"], 0.3, 1.0), 0.05)
add(pad([C3, G3, E3 * 2]) * env(S["levi"]["start"], S["feast"]["start"] + 0.3, 1.0, 0.5), 0.13)
add(pad([D3 * 0.5, Bb2, F3]) * env(S["feast"]["start"] + S["feast"]["segs"][1] - 0.2, S["doctor"]["start"] + 0.2, 0.3, 0.5), 0.17)
add(pad([A2, E3, A3, Cs4, E4]) * env(S["doctor"]["start"], DUR, 1.0, 2.0), 0.17)
# crowds
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
add(crowd * env(0, S["roof"]["start"] + 0.2, 1.0, 0.5), 0.08)
add(crowd * env(S["lower"]["start"], S["scholars"]["start"], 0.3, 0.6), 0.04)
gasp = bp(rng.standard_normal(int(1.2 * SR)).astype(np.float32), 400, 3000) * np.exp(-np.arange(int(1.2 * SR)) / SR * 3) * np.minimum(np.arange(int(1.2 * SR)) / SR / 0.08, 1)
place(gasp, W_("rise", "stood") + 0.1, 0.25); place(gasp, S["amazed"]["start"] + 0.2, 0.2)
# footsteps carrying the mat, then digging
for k, b in enumerate(np.arange(S["friends"]["start"] + 0.3, S["friends"]["start"] + S["friends"]["segs"][1], 0.42)): place(knock(160 + 20 * (k % 2)), b, 0.25, -0.2)
d0 = W_("roof", "dug")
for k, b in enumerate(np.arange(d0 - 0.4, W_("roof", "through"), 0.28)): place(knock(260 + 40 * (k % 3)), b, 0.32)
crumble = bp(rng.standard_normal(int(1.4 * SR)).astype(np.float32), 300, 5000) * np.exp(-np.arange(int(1.4 * SR)) / SR * 2.5)
th = W_("roof", "through")
place(crumble, th + 0.05, 0.45); place(hit(48, 1.6, 0.6), th + 0.05, 0.7); place(swell(0.6, 300, 6000), th - 0.55, 0.25)
# rope creak while lowering
n_ = int(2.2 * SR); x_ = np.arange(n_) / SR
creak = (np.sin(2 * np.pi * np.cumsum(180 + 40 * np.sin(2 * np.pi * 0.8 * x_)) / SR) * (np.sin(2 * np.pi * 7 * x_) > 0.6) * 0.5).astype(np.float32)
place(creak, W_("lower", "lowered") - 0.2, 0.06)
place(hit(44, 2.0, 0.3), W_("forgive", "forgiven"), 0.55); place(swell(0.8, 200, 7000), W_("forgive", "forgiven") - 0.75, 0.25)
place(hit(36, 2.4, 0.4), S["scholars"]["start"] + 0.1, 0.6)
# the scholars thinking to themselves: a suspicious "hmm" sting, a ticking clock and a held breath of tension
sc0 = S["scholars"]["start"]; th0 = sc0 + S["scholars"]["segs"][1]; th1 = S["rise"]["start"]
place(swell(1.0, 150, 4000), th0 - 1.0, 0.35)
for k, f in enumerate([233.08, 277.18, 311.13]): place(note(f, 2.6), th0 - 0.05 + k * 0.09, 0.09, (k - 1) * 0.3)  # minor "uh-oh" chord
for k, b in enumerate(np.arange(sc0 + 0.3, th1 - 0.2, 0.5)):
    n_ = int(0.05 * SR); x_ = np.arange(n_) / SR
    tick = (np.sin(2 * np.pi * (2400 if k % 2 else 1900) * x_) * np.exp(-x_ * 90)).astype(np.float32)
    place(tick, b, 0.12, 0.35 if k % 2 else -0.35)
n_ = int((th1 - th0) * SR); x_ = np.arange(n_) / SR
whis = bp(rng.standard_normal(n_).astype(np.float32), 2500, 9000) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.9 * x_)) * np.minimum(x_ / 0.5, 1) * np.minimum((x_[-1] - x_) / 0.5, 1)
place(whis, th0, 0.04)
place(hit(44, 1.4, 0.2), th1 - 0.35, 0.4)
place(hit(52, 1.0, 0.3), W_("rise", "up"), 0.55)
place(swell(0.9), W_("rise", "stood") - 0.85, 0.3); place(hit(36, 3.0, 1.4), W_("rise", "stood") + 0.05, 1.0); place(hit(90, 1.0, 1.0), W_("rise", "stood") + 0.05, 0.4)
# coins
def coin(f=3200):
    n = int(0.35 * SR); x = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * x) + 0.6 * np.sin(2 * np.pi * f * 1.48 * x)) * np.exp(-x * 14)).astype(np.float32)
for k in range(5): place(coin(2900 + 300 * (k % 3)), S["levi"]["start"] + 0.5 + k * 0.35, 0.05, 0.3)
place(hit(50, 1.4, 0.3), W_("levi", "follow"), 0.5)
for k in range(9): place(coin(2600 + 211 * k), W_("levi", "followed") - 0.6 + k * 0.07, 0.06, (k % 3 - 1) * 0.4)
# the party: frame drum + plucked lute
fs = S["feast"]["start"]; fe = fs + S["feast"]["segs"][1] - 0.2
for k, b in enumerate(np.arange(fs + 0.2, fe, 0.3)):
    place(hit(70 if k % 4 else 58, 0.4, 0.2), b, 0.25 if k % 2 else 0.35)
def pluck(f):
    n = int(0.6 * SR); x = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * x) + 0.5 * np.sin(4 * np.pi * f * x) + 0.25 * np.sin(6 * np.pi * f * x)) * np.exp(-x * 7)).astype(np.float32)
riff = [440, 554.37, 659.26, 554.37, 493.88, 440, 493.88, 554.37]
for k, b in enumerate(np.arange(fs + 0.2, fe, 0.3)): place(pluck(riff[k % 8]), b, 0.09, 0.2)
add(crowd * env(fs, fe + 0.2, 0.4, 0.2), 0.06)
place(hit(40, 1.6, 0.3), fe + 0.15, 0.5)
place(swell(0.7), W_("doctor", "came") - 0.65, 0.25); place(hit(40, 2.2, 0.6), W_("doctor", "came") + 0.05, 0.7)
# closing: frame drum + rising line in A
ed = S["end"]["start"]
for k, b in enumerate(np.arange(ed - 1.6, DUR - 1.6, 0.5)):
    place(hit(62 if k % 4 else 50, 0.6, 0.3), b, 0.3 if k % 4 else 0.45)
mel = [(440.0, 1), (554.37, 1), (659.26, 1), (880.0, 2), (830.61, 1), (659.26, 1), (739.99, 1), (880.0, 3)]
for k, (fq, d) in enumerate(mel):
    place(note(fq, d * 1.2), ed - 1.6 + sum(x for _, x in mel[:k]) * 0.5, 0.14, 0.15)
