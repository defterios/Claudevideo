"""Score + sound cues for the special "The Number 3" (exec'd by build.py).
Night-sky ambient pad; a soft bell on every item of each three (a rising triad: 1-3-5); big moment: the third-day sunrise."""
def W_(sid, word):
    sc = S.get(sid)
    if sc is None or word not in sc["w"]: return None
    return sc["start"] + sc["w"][word]
def bell(f, d=2.2):
    n = int(d * SR); x = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * x) + 0.45 * np.sin(2 * np.pi * f * 2.76 * x) * np.exp(-x * 3) + 0.25 * np.sin(2 * np.pi * f * 5.4 * x) * np.exp(-x * 6))
            * np.minimum(x / 0.004, 1) * np.exp(-x * 1.6)).astype(np.float32)
TRI = [587.33, 739.99, 880.0]  # D5 F#5 A5: one note per item, so every three sounds like a chord being built
CUES = {
    "age": ["thirtythree", "three"], "rose": ["died", "buried", "third"], "women": ["magdalene", "james", "salome"],
    "ministry": ["three"], "world": ["one", "three"], "asked": ["three"], "love": ["love", "love2", "love3"],
    "trinity": ["father", "son", "spirit"], "colours": ["red", "yellow", "blue"],
    "life": ["birth", "life", "death", "past", "present", "future"], "matter": ["time", "space", "matter", "ice", "water", "steam"],
    "depth": ["height", "width", "depth", "body", "soul", "spirit"], "family": ["father", "mother", "child"],
    "garden": ["three"], "asleep": ["peter", "james", "john"], "saved": ["death", "burial", "resurrection"],
    "complete": ["completeness", "settled"], "holy": ["holy", "holy2", "holy3"], "blessing": ["three"],
    "bless": ["father", "son", "spirit", "amen"], "end": ["friends", "family", "word"],
}
for sid, words in CUES.items():
    for k, w in enumerate(words):
        t0 = W_(sid, w)
        if t0 is not None: place(bell(TRI[k % 3]), t0 + 0.05, 0.05, (k % 3 - 1) * 0.35)
# three crosses / three denials: bells at fixed beats inside the scene
for sid in ("crosses", "deny"):
    a, b = S[sid]["start"], S[sid]["end"]
    for k in range(3): place(bell(TRI[k] * 0.5), a + 0.4 + k * (b - a - 0.8) / 3, 0.06, (k - 1) * 0.4)
# ambient: low drone under everything, darker until the empty tomb, warm after
third = W_("rose", "third") or S["rose"]["end"] - 1
add(pad([D2, A2, D3, F3]) * slow * env(0, third + 0.2, 1.5, 0.8), 0.06)
place(swell(1.2, 300, 7000), third - 1.15, 0.05); place(hit(40, 2.6, 0.25), third + 0.03, 0.09)
add(pad([D2, A2, D3, Fs4 * 0.5, A3]) * slow * env(third, S["deny"]["start"], 0.2, 1.0), 0.06)
add(shim * env(third, S["women"]["end"], 0.2, 1.2), 0.02)
add(pad([D2, A2, D3, F3, A3]) * slow * env(S["deny"]["start"] - 0.5, S["trinity"]["start"] + 0.5, 1.0, 1.0), 0.055)
# the world of threes: a gently pulsing triad
pulse = 0.7 + 0.3 * np.sin(2 * np.pi * 0.5 * tt)
add(pad([D3, Fs4 * 0.5, A3, D4]) * pulse * env(S["trinity"]["start"], S["garden"]["start"] + 0.3, 1.0, 1.0), 0.05)
add(shim * env(S["trinity"]["start"], S["family"]["end"], 1.0, 1.0), 0.015)
# Gethsemane: night, low and still
add(pad([G2, D3, F3 * 0.5 * 2]) * env(S["garden"]["start"], S["saved"]["start"] + 0.3, 0.8, 0.8), 0.055)
# the answer: warm, rising to the end
add(pad([D2, A2, D3, Fs4 * 0.5, A3, D4]) * slow * env(S["saved"]["start"], DUR, 1.0, 2.0), 0.06)
hl = W_("holy", "holy") or S["holy"]["start"]
place(swell(1.0, 400, 9000), hl - 1.0, 0.04)
add(shim * env(hl, DUR - 1.0, 0.3, 1.5), 0.025)
ed = S["end"]["start"]
for k, fq in enumerate([293.66, 369.99, 440.0, 587.33]):
    place(note(fq, 2.4), ed + 0.2 + k * 0.6, 0.08, 0.15)
