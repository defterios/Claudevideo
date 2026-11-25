"""Score + sound cues for Episode 14 "What Do You Want?" (exec'd by build.py).
Big moment: the camel stuck in the needle (comic boings), then light on "possible". Finale: Bartimaeus sees."""
def W_(sid, word, f=0.5):
    sc = S[sid]
    return sc["start"] + sc["w"][word] if word in sc["w"] else sc["start"] + f * (sc["end"] - sc["start"])
D2, A2, D3, F3, A3, G2, C3, E3, G3, Bb2, Fs3 = 73.42, 110.0, 146.83, 174.61, 220.0, 98.0, 130.81, 164.81, 196.0, 116.54, 185.0
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
wind = bp(noise, 300, 2000) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * tt))
def coin(f=2400):
    n = int(0.25 * SR); x = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * x) + 0.6 * np.sin(2 * np.pi * f * 1.5 * x)) * np.exp(-x * 14)).astype(np.float32)
def boing(f0=180):
    n = int(0.5 * SR); x = np.arange(n) / SR
    return (np.sin(2 * np.pi * np.cumsum(f0 * (1 + 0.6 * np.sin(2 * np.pi * 9 * x) * np.exp(-x * 4))) / SR) * np.exp(-x * 5)).astype(np.float32)
# the rich young man
add(wind * env(0, S["jericho"]["start"], 1.0, 0.8), 0.012)
add(pad([D2, A2, D3, F3]) * slow * env(0, S["sell"]["start"] + 0.3, 1.0, 0.6), 0.055)
for k in range(4): place(coin(2200 + 300 * (k % 2)), S["run"]["start"] + 0.6 + k * 0.32, 0.03, 0.3)
lv = W_("loved", "loved", 0.6); add(shim * env(lv, S["sell"]["start"] + 1.0, 0.4, 0.8), 0.025)
tr = W_("sell", "treasure", 0.55)
for k in range(6): place(coin(2600 + 200 * (k % 3)), tr + 0.05 + k * 0.09, 0.035, (k % 3 - 1) * 0.4)
add(pad([G2, D3, Bb2 * 2, F3]) * env(S["sad"]["start"], S["camel"]["start"] + 0.3, 0.6, 0.4), 0.055)
# the camel and the needle (comic)
cm = W_("camel", "camel", 0.7); nd = W_("camel", "needle", 0.9)
add(pad([C3, G3, E3, G2]) * slow * env(S["camel"]["start"], S["possible"]["start"], 0.5, 0.3), 0.05)
for k in range(3): place(boing(170 + 30 * k), nd + 0.2 + k * 0.45, 0.06, (k - 1) * 0.3)
place(knock(240), nd + 1.6, 0.06)
ps = W_("possible", "possible", 0.8)
place(swell(1.0, 300, 9000), ps - 0.95, 0.05); place(hit(44, 2.2, 0.3), ps + 0.03, 0.09)
add(pad([D2, A2, D3, Fs3, A3, D3 * 2]) * env(ps, S["seats"]["start"] + 0.5, 0.05, 0.8), 0.065)
add(shim * env(ps, S["seats"]["start"], 0.05, 0.8), 0.03)
# the seats and the servant
add(pad([D2, A2, D3, F3, A3]) * slow * env(S["seats"]["start"], S["jericho"]["start"] + 0.3, 0.8, 0.6), 0.055)
place(hit(48, 1.2, 0.2), W_("serve", "life", 0.85) + 0.05, 0.05)
# Jericho: crowd, shouting, the cloak, sight
add(crowd * env(S["jericho"]["start"], S["want"]["start"], 0.8, 0.6), 0.025)
add(pad([G2, D3, Bb2 * 2, F3]) * env(S["jericho"]["start"], W_("faith", "faith", 0.5), 0.8, 0.2), 0.055)
place(hit(52, 0.8, 0.2), S["mercy"]["start"] + 0.1, 0.05); place(hit(50, 1.0, 0.2), W_("louder", "louder", 0.4) + 0.05, 0.06)
place(swell(0.5, 500, 6000), W_("cloak", "cloak", 0.3) - 0.2, 0.05)
fa = W_("faith", "faith", 0.5)
place(swell(1.0, 200, 9000), fa - 0.95, 0.05); place(hit(42, 2.4, 0.3), fa + 0.03, 0.09)
add(pad([D2, A2, D3, Fs3, A3, D3 * 2]) * env(fa, DUR, 0.05, 2.0), 0.065)
add(shim * env(fa, DUR - 1.0, 0.05, 1.5), 0.03)
ed = S["end"]["start"]
for k, fq in enumerate([293.66, 369.99, 440.0, 587.33, 554.37, 440.0, 587.33]):
    place(note(fq, 2.0), ed + 0.1 + k * 0.42, 0.08, 0.15)
