"""Score + sound cues for Episode 9 "A Prophet Without Honor" (exec'd by build.py). Gentle mix; quiet, dark ending."""
W_ = lambda sid, word: S[sid]["start"] + S[sid]["w"][word]
D2, A2, D3, F3, A3, E3, G2, Bb2, C3, Fs3 = 73.42, 110.0, 146.83, 174.61, 220.0, 164.81, 98.0, 116.54, 130.81, 185.0
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
add(pad([D2, A2, D3, Fs3]) * slow * env(0, S["whisper"]["start"] + 0.3, 1.0, 0.6), 0.07)
add(crowd * env(S["whisper"]["start"], S["prophet"]["start"], 0.5, 0.5), 0.02)
for k in range(4): place(knock(380 + 30 * (k % 2)), W_("whisper", "carpenter") + k * 0.35, 0.05, -0.2)   # hammer echo of Ep1
add(pad([D2, F3 * 0.5, A2]) * env(S["offense"]["start"], S["sent"]["start"] + 0.3, 0.5, 0.6), 0.07)
# sent out: walking drum, hopeful
add(pad([D2, A2, D3, Fs3, A3]) * env(S["sent"]["start"], S["herod"]["start"] + 0.3, 0.8, 0.6), 0.045)
for k, b in enumerate(np.arange(S["sent"]["start"] + 0.3, S["herod"]["start"] - 0.3, 0.5)): place(hit(64, 0.4, 0.2), b, 0.035 if k % 2 else 0.055)
place(knock(240), W_("sent", "staff") + 0.05, 0.07)
add(shim * env(W_("healed", "healed") - 0.3, S["herod"]["start"], 0.3, 0.8), 0.02)
# Herod: dark, heavy
add(pad([G2 * 0.5, D2, Bb2 * 0.5]) * env(S["herod"]["start"], S["feast"]["start"] + 0.3, 0.5, 0.6), 0.08)
place(hit(34, 2.4, 0.5), S["ghost"]["start"] + 0.1, 0.16)
for k in np.arange(S["prison"]["start"] + 0.3, S["feast"]["start"], 1.1): place(knock(140), k, 0.05, 0.3)   # dripping cell
# the feast: lute + frame drum + tambourine, until the request
fs = S["feast"]["start"]; fe = S["ask"]["start"] + 0.2
def pluck(f):
    n = int(0.6 * SR); x = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * x) + 0.5 * np.sin(4 * np.pi * f * x) + 0.25 * np.sin(6 * np.pi * f * x)) * np.exp(-x * 7)).astype(np.float32)
riff = [293.66, 311.13, 369.99, 392.0, 440.0, 392.0, 369.99, 311.13]
for k, b in enumerate(np.arange(fs + 0.2, fe, 0.28)):
    place(pluck(riff[k % 8]), b, 0.018, 0.2); place(hit(70 if k % 2 else 56, 0.35, 0.2), b, 0.035 if k % 2 else 0.05)
    if k % 2: place(bp(rng.standard_normal(int(0.1 * SR)).astype(np.float32), 5000, 11000) * np.exp(-np.arange(int(0.1 * SR)) / SR * 40), b + 0.14, 0.03, -0.3)
add(crowd * env(fs, fe, 0.5, 0.2), 0.02)
# "The head of John": the music stops dead
jn = W_("head", "john")
place(hit(30, 3.0, 0.4), S["head"]["end"] + 0.1, 0.16)
add(pad([D2 * 0.5, A2 * 0.5]) * env(jn, S["silent"]["end"], 0.3, 1.0), 0.045)
for k in np.arange(S["sorry"]["start"] + 0.3, S["silent"]["start"] + S["silent"]["w"]["silent"], 0.9): heart(k, 0.05)
# silence: candle out, then a single low note; the tomb: a soft, grieving chord
n_ = int(3.0 * SR); x_ = np.arange(n_) / SR
place((np.sin(2 * np.pi * 220 * x_) * np.minimum(x_ / 0.4, 1) * np.exp(-x_ * 0.8)).astype(np.float32), W_("silent", "silent") + 0.2, 0.04)
add(pad([D3, F3, A3]) * env(S["tomb"]["start"], DUR, 1.0, 2.0), 0.06)
ed = S["end"]["start"]
mel = [(293.66, 1), (349.23, 1), (440.0, 2), (392.0, 1), (349.23, 1), (293.66, 3)]
for k, (fq, d) in enumerate(mel):
    place(note(fq, d * 1.2), ed - 0.4 + sum(x for _, x in mel[:k]) * 0.55, 0.09, 0.15)
