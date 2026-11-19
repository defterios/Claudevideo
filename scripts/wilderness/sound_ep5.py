"""Score + sound cues for Episode 5 "The Twelve" (exec'd by build.py). Warm score, one big moment: the divided house."""
W_ = lambda sid, word: S[sid]["start"] + S[sid]["w"][word]
D2, A2, D3, Fs3, A3, B2, G2, E3, Cs4, F3 = 73.42, 110.0, 146.83, 185.0, 220.0, 123.47, 98.0, 164.81, 277.18, 174.61
add(pad([D2, A2, D3, Fs3]) * slow * env(0, S["spirits"]["start"] + 0.2, 1.0, 0.4), 0.16)
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
add(crowd * env(0, S["spirits"]["start"], 0.5, 0.4), 0.09)
waves = lp(noise, 500) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.13 * tt) ** 2)
add(waves * env(0, S["spirits"]["start"], 1.0, 0.6), 0.1, -0.2)
# spirits: dark drone, the scream lands on one low hit
add(pad([D2 * 0.5, Eb := 77.78, A2 * 0.5]) * (0.6 + 0.4 * np.sin(2 * np.pi * 6 * tt)) * env(S["spirits"]["start"], S["mountain"]["start"] + 0.2, 0.4, 0.4), 0.24)
sg = S["spirits"]["start"] + S["spirits"]["segs"][1]
place(swell(0.7, 150, 4000), sg - 0.65, 0.3); place(hit(34, 2.6, 1.0), sg + 0.05, 0.9)
# mountain: wind + open fifths rising into the names
wind = bp(noise, 200, 1200) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.17 * tt + 1))
add(wind * env(S["mountain"]["start"], S["names"]["start"] + 1.0, 0.6, 1.0), 0.12, 0.2)
add(pad([D3, A3, D3 * 2]) * env(S["mountain"]["start"] + 0.5, S["judas"]["start"], 1.5, 0.3), 0.15)
# the names: a soft frame-drum tap on every name
for nm, tm in S["names"].get("ws", []):
    if nm in ("simon", "james", "john", "andrew", "philip", "bartholomew", "matthew", "thomas", "thaddaeus"):
        place(hit(68, 0.5, 0.2), S["names"]["start"] + tm, 0.35); place(note(587.33 if nm != "simon" else 440.0, 0.8), S["names"]["start"] + tm, 0.05)
# Judas: everything drops to a low minor chord
add(pad([D2, F3 * 0.5, A2]) * env(S["judas"]["start"], S["twelve"]["start"] + 0.2, 0.2, 0.4), 0.22)
place(hit(40, 2.0, 0.3), W_("judas", "betray"), 0.5)
# the twelve: warm swell
add(pad([D2, A2, D3, Fs3, A3]) * env(S["twelve"]["start"], S["family"]["start"] + 0.3, 0.8, 0.6), 0.18)
add(shim * env(S["twelve"]["start"] + 0.3, S["family"]["start"], 0.8, 0.6), 0.045)
# family + scholars: tension
add(pad([B2, D3, F3]) * env(S["family"]["start"], S["divided"]["start"] + 0.3, 0.6, 0.5), 0.15)
for k in np.arange(S["scholars"]["start"] + 0.2, S["divided"]["start"], 0.6): heart(k, 0.3)
place(hit(44, 1.6, 0.4), S["scholars"]["start"] + 0.1, 0.6)
# THE DIVIDED HOUSE: crack + collapse rumble (the episode's one big moment)
dv = W_("divided", "divided")
crack = bp(rng.standard_normal(int(0.5 * SR)).astype(np.float32), 1500, 9000) * np.exp(-np.arange(int(0.5 * SR)) / SR * 9)
place(crack, dv + 0.05, 0.55); place(hit(60, 0.6, 0.4), dv + 0.05, 0.4)
fall = W_("divided", "stand")
rumble = lp(rng.standard_normal(int(2.6 * SR)).astype(np.float32), 160) * np.exp(-np.arange(int(2.6 * SR)) / SR * 1.4) * 4
place(rumble, fall + 0.1, 0.45); place(hit(32, 3.0, 0.8), fall + 0.1, 1.0)
place(bp(rng.standard_normal(int(1.6 * SR)).astype(np.float32), 300, 4000) * np.exp(-np.arange(int(1.6 * SR)) / SR * 2.2), fall + 0.3, 0.25)
# outside the door: crowd again, then hush for the question
add(crowd * env(S["door"]["start"], S["answer"]["start"] + 0.2, 0.5, 0.5), 0.07)
add(pad([D3, A3]) * env(S["answer"]["start"], S["circle"]["start"], 0.5, 0.2), 0.1)
# the circle: full warm chord, shimmer — family
add(pad([D2, A2, D3, Fs3, A3, Cs4]) * env(S["circle"]["start"], DUR, 0.6, 2.0), 0.2)
add(shim * env(S["circle"]["start"] + 0.5, DUR - 1.0, 1.0, 1.5), 0.06)
# closing frame-drum + rising line (D major)
ed = S["end"]["start"]
for k, b in enumerate(np.arange(ed - 1.6, DUR - 1.6, 0.5)):
    place(hit(62 if k % 4 else 50, 0.6, 0.3), b, 0.3 if k % 4 else 0.45)
mel = [(293.66, 1), (369.99, 1), (440.0, 1), (587.33, 2), (554.37, 1), (440.0, 1), (493.88, 1), (587.33, 3)]
for k, (fq, d) in enumerate(mel):
    place(note(fq, d * 1.2), ed - 1.6 + sum(x for _, x in mel[:k]) * 0.5, 0.14, 0.15)
