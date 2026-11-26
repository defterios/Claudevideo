"""Score + sound cues for Special 2 "Why Do We Pray for the Dead?" (exec'd by build.py).
Gentle night-sky ambience like Special 1; soft bells on key words; warm light at "paradise", the rising, and the closing three."""
def W_(sid, word, f=0.5):
    sc = S.get(sid)
    if sc is None: return None
    return sc["start"] + sc["w"][word] if word in sc["w"] else sc["start"] + f * (sc["end"] - sc["start"])
def bell(f, d=2.2):
    n = int(d * SR); x = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * x) + 0.45 * np.sin(2 * np.pi * f * 2.76 * x) * np.exp(-x * 3) + 0.25 * np.sin(2 * np.pi * f * 5.4 * x) * np.exp(-x * 6))
            * np.minimum(x / 0.004, 1) * np.exp(-x * 1.6)).astype(np.float32)
TRI = [587.33, 739.99, 880.0]
CUES = {"dust": ["dust", "god"], "paradise": ["paradise"], "home": ["home"], "rise": ["rise", "stand"], "sleep": ["sleep", "wake"],
        "two": ["now", "end"], "catholic": ["mercy", "freed"], "protest": ["once", "judgement"], "comfort": ["comfort"], "hope": ["hope"],
        "thanks": ["thank"], "life": ["resurrection", "live"], "living": ["living", "alive"], "love": ["hope", "comfort", "love"]}
for sid, words in CUES.items():
    for k, w in enumerate(words):
        t0 = W_(sid, w, 0.3 + 0.3 * k)
        if t0 is not None: place(bell(TRI[k % 3]), t0 + 0.05, 0.045, (k % 3 - 1) * 0.35)
# low, tender drone; darker through the question, warmer from the answer on
add(pad([D2, A2, D3, F3]) * slow * env(0, S["all"]["start"] + 0.5, 2.0, 1.0), 0.055)
pr = W_("paradise", "paradise", 0.6)
place(swell(1.0, 300, 8000), pr - 0.95, 0.04); add(shim * env(pr, S["home"]["end"], 0.2, 0.8), 0.025)
rs = W_("rise", "rise", 0.6)
place(swell(1.0, 300, 8000), rs - 0.95, 0.04); place(hit(44, 2.0, 0.25), rs + 0.03, 0.06)
add(pad([D2, A2, D3, F3, A3]) * env(S["why"]["start"], S["all"]["start"] + 0.3, 0.8, 0.8), 0.03)
add(pad([D2, A2, D3, Fs4 * 0.5, A3]) * slow * env(S["all"]["start"], DUR, 1.0, 2.5), 0.06)
lf = W_("life", "resurrection", 0.3)
place(swell(1.0, 300, 9000), lf - 0.95, 0.04); add(shim * env(lf, DUR - 1.0, 0.3, 1.5), 0.025)
ed = S["end"]["start"]
for k, fq in enumerate([293.66, 369.99, 440.0, 587.33]):
    place(note(fq, 2.4), ed + 0.2 + k * 0.6, 0.08, 0.15)
