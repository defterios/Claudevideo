"""Score + sound cues for Episode 16 "Everything She Had" (exec'd by build.py).
Big moment: the widow's two coins — two tiny clinks, then a warm swell and glow on "everything"."""
def W_(sid, word, f=0.5):
    sc = S[sid]
    return sc["start"] + sc["w"][word] if word in sc["w"] else sc["start"] + f * (sc["end"] - sc["start"])
D2, A2, D3, F3, A3, G2, C3, E3, G3, Bb2, Fs3 = 73.42, 110.0, 146.83, 174.61, 220.0, 98.0, 130.81, 164.81, 196.0, 116.54, 185.0
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
def coin(f=2400, d=0.25):
    n = int(d * SR); x = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * x) + 0.6 * np.sin(2 * np.pi * f * 1.5 * x)) * np.exp(-x * 14)).astype(np.float32)
# the trap: tense
add(crowd * env(0, S["which"]["start"], 0.6, 0.6), 0.015)
add(pad([D2, A2, D3, F3]) * slow * env(0, S["give"]["start"] + 0.3, 1.0, 0.5), 0.055)
place(coin(2600), W_("coin", "coin", 0.3) + 0.05, 0.05)
place(hit(46, 1.4, 0.2), W_("give", "god", 0.85) + 0.05, 0.05)
add(pad([D2, A2, D3, Fs3, A3]) * env(S["give"]["start"], S["which"]["start"] + 0.3, 0.4, 0.5), 0.05)
# the greatest commandment: warm, one bell per word
add(pad([D2, A2, D3, Fs3, A3]) * slow * env(S["which"]["start"], S["treasury"]["start"] + 0.3, 0.8, 0.6), 0.055)
for k, w in enumerate(["heart", "soul", "mind", "strength"]): place(note([587.33, 739.99, 880.0, 1174.66][k], 1.8), W_("love", w, 0.2 + 0.2 * k) + 0.05, 0.04, (k - 1.5) * 0.3)
add(shim * env(W_("second", "neighbour", 0.4), S["treasury"]["start"], 0.3, 0.6), 0.02)
# the offering box: rich clatter vs two tiny clinks
add(crowd * env(S["treasury"]["start"], S["more"]["start"], 0.5, 0.5), 0.018)
r0 = W_("treasury", "rich", 0.6)
for k in range(14): place(coin(1700 + 160 * (k % 6), 0.3), r0 + 0.1 + k * 0.06, 0.035, (k % 3 - 1) * 0.4)
add(pad([G2, D3, Bb2 * 2, F3]) * env(S["widow"]["start"], S["more"]["start"] + 0.3, 0.6, 0.4), 0.045)
tw = W_("widow", "two", 0.75)
place(coin(3200, 0.6), tw + 0.25, 0.06, -0.2); place(coin(3400, 0.6), tw + 0.75, 0.06, 0.2)
ev = W_("more", "everything", 0.85)
place(swell(1.2, 300, 9000), ev - 1.15, 0.05); place(hit(46, 2.2, 0.25), ev + 0.03, 0.07)
add(pad([D2, A2, D3, Fs3, A3, D3 * 2]) * env(W_("more", "more", 0.2), S["left"]["start"] + 0.5, 0.8, 1.0), 0.065)
add(shim * env(ev, S["left"]["start"] + 0.3, 0.1, 0.8), 0.03)
# the temple stones fall; words that never pass away; keep watch
add(pad([C3, G3, E3, G2]) * env(S["left"]["start"], S["down"]["start"] + 0.3, 0.5, 0.4), 0.05)
th = W_("down", "thrown", 0.85)
place(hit(36, 2.4, 0.3), th + 0.05, 0.1); add(lp(noise, 250) * env(th, th + 2.0, 0.05, 1.5), 0.05)
for k in range(5): place(knock(160 + 20 * k), th + 0.15 + k * 0.18, 0.06, (k % 3 - 1) * 0.4)
add(pad([D2, A2, D3, F3, A3]) * slow * env(S["words"]["start"], DUR, 0.8, 2.0), 0.06)
add(shim * env(W_("words", "never", 0.8), DUR - 1, 0.3, 1.5), 0.02)
for k in np.arange(S["watch"]["start"] + 0.2, S["watch"]["end"], 0.6): place(knock(900) * 0.4, k, 0.02)
ed = S["end"]["start"]
for k, fq in enumerate([293.66, 369.99, 440.0, 587.33, 554.37, 440.0, 587.33]):
    place(note(fq, 2.0), ed + 0.1 + k * 0.42, 0.08, 0.15)
