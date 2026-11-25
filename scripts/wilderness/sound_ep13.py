"""Score + sound cues for Episode 13 "Listen to Him" (exec'd by build.py).
Big moment: the Transfiguration on "white" (swell, impact, bright chord, shimmer). Then the cloud and the Voice."""
def W_(sid, word, f=0.5):
    sc = S[sid]
    return sc["start"] + sc["w"][word] if word in sc["w"] else sc["start"] + f * (sc["end"] - sc["start"])
D2, A2, D3, F3, A3, G2, C3, E3, G3, Bb2, Fs3 = 73.42, 110.0, 146.83, 174.61, 220.0, 98.0, 130.81, 164.81, 196.0, 116.54, 185.0
wind = bp(noise, 300, 2400) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.09 * tt + np.sin(2 * np.pi * 0.31 * tt)))
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
# climbing the mountain
add(wind * env(0, S["foot"]["start"], 1.0, 0.8), 0.022)
add(pad([D2, A2, D3, F3]) * slow * env(0, W_("shine", "white", 0.6) + 0.1, 1.0, 0.3), 0.06)
# TRANSFIGURATION
wt = W_("shine", "white", 0.6)
place(swell(1.4, 200, 9000), wt - 1.35, 0.06); place(hit(42, 2.8, 0.3), wt + 0.03, 0.1)
add(pad([D2, A2, D3, Fs3, A3, D3 * 2, Fs3 * 2]) * env(wt, S["cloud"]["start"] + 0.5, 0.05, 1.0), 0.07)
add(shim * env(wt, S["cloud"]["start"], 0.05, 0.8), 0.035)
for k, fq in enumerate([587.33, 739.99, 880.0, 1174.66]): place(note(fq, 2.6), W_("prophets", "elijah", 0.2) + k * 0.25, 0.05, (k - 1.5) * 0.3)
# Peter's tents: three soft knocks
for k in range(3): place(knock(700 + 80 * k) * 0.5, S["tents"]["start"] + 0.6 * (S["tents"]["end"] - S["tents"]["start"]) + k * 0.6, 0.05)
# the cloud and the Voice
cl = W_("cloud", "cloud", 0.6)
add(lp(noise, 160) * env(cl - 0.5, S["alone"]["start"] + 0.3, 1.0, 1.0), 0.06)
add(pad([D2 * 0.5, A2 * 0.5, D2]) * env(cl, S["alone"]["start"] + 0.3, 1.0, 1.0), 0.07)
place(hit(34, 3.0, 0.2), S["voice"]["start"] + 0.1, 0.08)
add(pad([D3, A3, Fs3 * 2]) * env(S["alone"]["start"], S["foot"]["start"], 0.6, 0.8), 0.04)
# the father and the boy
add(crowd * env(S["foot"]["start"], S["healed"]["start"], 0.6, 0.6), 0.02)
add(pad([G2, D3, Bb2 * 2, F3]) * env(S["foot"]["start"], W_("healed", "lifted", 0.85), 0.8, 0.3), 0.055)
for k in np.arange(S["healed"]["start"] + 0.3, W_("healed", "hand", 0.7) - 0.3, 0.9): heart(k, 0.045)
lf = W_("healed", "lifted", 0.85)
place(swell(0.8, 300, 8000), lf - 0.8, 0.04); place(hit(48, 1.6, 0.2), lf + 0.03, 0.06)
add(pad([D2, A2, D3, Fs3, A3]) * env(lf, S["argue"]["start"] + 0.3, 0.1, 0.8), 0.06)
# the road argument, then the child
add(crowd * env(S["argue"]["start"], S["first"]["start"], 0.3, 0.4), 0.025)
add(pad([C3, G3, E3, G2]) * slow * env(S["argue"]["start"], S["child"]["start"] + 0.3, 0.6, 0.6), 0.05)
add(pad([D2, A2, D3, Fs3, A3]) * slow * env(S["child"]["start"], DUR, 0.8, 2.0), 0.06)
ch = S["child"]["start"]
for k, fq in enumerate([587.33, 739.99, 880.0, 739.99, 987.77, 880.0]): place(note(fq * 1.0, 1.4), ch + 0.4 + k * 0.55, 0.035, 0.2)
wa = W_("water", "water", 0.5)
def drop():
    n = int(0.25 * SR); x = np.arange(n) / SR
    return (np.sin(2 * np.pi * np.cumsum(900 + 1400 * x / 0.25) / SR) * np.exp(-x * 18)).astype(np.float32)
place(drop(), wa + 0.05, 0.08); place(drop(), wa + 0.35, 0.05)
add(shim * env(wa, DUR - 1, 0.3, 1.5), 0.02)
ed = S["end"]["start"]
for k, fq in enumerate([293.66, 369.99, 440.0, 587.33, 554.37, 440.0, 587.33]):
    place(note(fq, 2.0), ed + 0.1 + k * 0.42, 0.08, 0.15)
