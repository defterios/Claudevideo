"""Score + sound cues for Episode 11 "Be Opened" (exec'd by build.py). Gentle mix. Big moment: sound returns on "opened"."""
W_ = lambda sid, word: S[sid]["start"] + S[sid]["w"][word]
D2, A2, D3, Fs3, A3, B2, E3, G3, Cs4, F3 = 73.42, 110.0, 146.83, 185.0, 220.0, 123.47, 164.81, 196.0, 277.18, 174.61
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
add(pad([D2, A2, D3, Fs3]) * slow * env(0, S["tyre"]["start"] + 0.3, 1.0, 0.6), 0.06)
add(crowd * env(0, S["rules"]["start"], 0.5, 0.5), 0.02)
add(pad([B2, D3, F3]) * env(S["tradition"]["start"], S["rules"]["start"] + 0.3, 0.3, 0.5), 0.05)
place(hit(44, 1.6, 0.3), W_("heart", "heart") + 0.1, 0.08); add(shim * env(W_("heart", "heart"), S["tyre"]["start"], 0.2, 0.6), 0.02)
add(pad([E3 * 0.5, B2, E3, G3]) * env(S["tyre"]["start"], S["home"]["start"], 0.8, 0.6), 0.06)
for k in range(7): place(knock(2600 + 300 * (k % 3)) * 0.4, W_("crumbs", "crumbs") + 0.15 + k * 0.08, 0.04, (k % 3 - 1) * 0.4)
add(pad([D2, A2, D3, Fs3, A3]) * env(S["reply"]["start"], S["deaf"]["start"], 0.5, 0.6), 0.06)
add(shim * env(W_("home", "gone"), S["deaf"]["start"], 0.2, 0.8), 0.025)
# the deaf man: muffled world (crowd under water) until "opened"
op = W_("open", "opened")
muff = lp(crowd, 280)
add(muff * env(S["deaf"]["start"], op, 0.6, 0.05), 0.05)
add(pad([D2 * 0.5, A2 * 0.5]) * env(S["deaf"]["start"], op, 0.6, 0.05), 0.05)
for k in np.arange(S["aside"]["start"] + 0.3, op, 0.9): heart(k, 0.05)
# "opened": the world floods in — birds, crowd, bright chord
place(swell(1.0, 200, 8000), op - 0.9, 0.05); place(hit(42, 2.4, 0.3), op + 0.05, 0.1)
add(crowd * env(op, S["well"]["end"], 0.05, 0.6), 0.02)
def chirp(f0=2600):
    n = int(0.18 * SR); x = np.arange(n) / SR
    return (np.sin(2 * np.pi * np.cumsum(f0 + 900 * x / 0.18 + 200 * np.sin(2 * np.pi * 30 * x)) / SR) * np.sin(np.pi * x / 0.18) ** 2).astype(np.float32)
for k in range(10): place(chirp(2300 + 250 * (k % 4)), op + 0.1 + k * 0.45, 0.025, (k % 3 - 1) * 0.5)
add(pad([D2, A2, D3, Fs3, A3, Cs4]) * env(op, DUR, 0.1, 2.0), 0.06)
add(shim * env(op, DUR - 1.0, 0.1, 1.5), 0.025)
ed = S["end"]["start"]
mel = [(293.66, 1), (369.99, 1), (440.0, 1), (587.33, 2), (554.37, 1), (440.0, 1), (493.88, 1), (587.33, 3)]
for k, (fq, d) in enumerate(mel):
    place(note(fq, d * 1.2), ed - 0.4 + sum(x for _, x in mel[:k]) * 0.5, 0.09, 0.15)
