"""Score + sound cues for Episode 8 "Talitha Koum" (exec'd by build.py). Big moment: the girl rises on "up".
Mixed gently — voice stays well above the bed."""
W_ = lambda sid, word: S[sid]["start"] + S[sid]["w"][word]
D2, A2, D3, Fs3, A3, B2, E3, G3, B3, Cs4, F3, C3 = 73.42, 110.0, 146.83, 185.0, 220.0, 123.47, 164.81, 196.0, 246.94, 277.18, 174.61, 130.81
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
waves = lp(noise, 500) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.13 * tt) ** 2)
tc = W_("touch", "touched")
add(waves * env(0, S["plea"]["start"] + 0.3, 0.6, 0.5), 0.05, -0.2)
add(crowd * env(0, tc, 0.6, 0.05), 0.035)                      # crowd noise cuts out on the touch
add(crowd * env(S["feet"]["start"], S["news"]["start"], 0.6, 0.4), 0.02)
add(pad([D2, A2, D3, Fs3]) * slow * env(0, S["woman"]["start"] + 0.3, 1.0, 0.5), 0.09)
add(pad([B2, D3, Fs3]) * env(S["woman"]["start"], tc, 0.8, 0.1), 0.08)
for k in np.arange(S["thought"]["start"] + 0.2, tc, 0.75): heart(k, 0.06)
# the touch: everything stops, a warm glow
place(swell(1.0, 200, 6000), tc - 0.9, 0.06); place(hit(44, 2.0, 0.3), tc + 0.05, 0.1)
add(shim * env(tc, S["who"]["start"] + 0.5, 0.2, 1.0), 0.018)
add(pad([D3, Fs3, A3]) * env(tc, S["who"]["start"] + 0.3, 0.3, 0.5), 0.035)
place(hit(50, 1.0, 0.2), S["who"]["start"] + 0.15, 0.18)
add(pad([D2, A2, D3, Fs3, A3]) * env(S["feet"]["start"], S["news"]["start"], 0.8, 0.3), 0.07)
# bad news: low hit, minor drone, slow heartbeat
place(hit(36, 2.4, 0.4), W_("news", "dead") + 0.4, 0.1)
add(pad([B2, D3, F3]) * env(S["news"]["start"], S["hand"]["start"], 0.3, 0.6), 0.045)
add(pad([D3, A3]) * env(S["believe"]["start"], S["house"]["start"] + 0.2, 0.5, 0.4), 0.05)
# wailing at the house (soft vowel-like tones), then silence inside
wail = sum(np.sin(2 * np.pi * (f + 25 * np.sin(2 * np.pi * r * tt + p)) * tt) for f, r, p in [(440, 0.6, 0), (392, 0.45, 2), (523, 0.7, 4)]).astype(np.float32) / 3
add(bp(wail, 300, 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.35 * tt)) * env(S["house"]["start"], W_("house", "laughed") + 0.3, 0.6, 0.6), 0.025, 0.3)
add(crowd * env(S["house"]["start"], S["hand"]["start"], 0.5, 0.5), 0.02)
# the room: one high held note, then the rising
hd = S["hand"]["start"]; up = W_("rise", "up")
n_ = int(4.0 * SR); x_ = np.arange(n_) / SR
place((np.sin(2 * np.pi * 1174.66 * x_) * np.minimum(x_ / 0.8, 1) * np.exp(-x_ * 0.5)).astype(np.float32), hd + 0.3, 0.02)
place(swell(1.4, 200, 7000), up - 1.3, 0.05); place(hit(40, 2.4, 0.4), up + 0.05, 0.12)
add(pad([D2, A2, D3, Fs3, A3, Cs4]) * env(up, DUR, 0.4, 2.0), 0.05)
add(shim * env(up, DUR - 1.0, 0.3, 1.5), 0.035)
ed = S["end"]["start"]
mel = [(293.66, 1), (369.99, 1), (440.0, 1), (587.33, 2), (554.37, 1), (440.0, 1), (493.88, 1), (587.33, 3)]
for k, (fq, d) in enumerate(mel):
    place(note(fq, d * 1.2), ed - 0.4 + sum(x for _, x in mel[:k]) * 0.5, 0.1, 0.15)
