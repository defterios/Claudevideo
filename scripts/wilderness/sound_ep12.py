"""Score + sound cues for Episode 12 "Who Do You Say I Am?" (exec'd by build.py).
Big moment: the blind man's sight comes into focus on "clearly". Second peak: Peter's "Messiah"."""
def W_(sid, word, fb=None):
    sc = S.get(sid)
    if sc is None: return fb
    return sc["start"] + sc["w"][word] if word in sc["w"] else (fb if fb is not None else sc["start"] + 0.5 * (sc["end"] - sc["start"]))
D2, A2, D3, F3, A3, G2, C3, E3, G3, Bb2 = 73.42, 110.0, 146.83, 174.61, 220.0, 98.0, 130.81, 164.81, 196.0, 116.54
wind = bp(noise, 300, 2000) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * tt))
crowd = bp(noise, 250, 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.43 * tt) * 3)))
# the hungry crowd and the loaves
add(pad([D2, A2, D3, F3]) * slow * env(0, S["blind"]["start"] + 0.3, 1.0, 0.8), 0.06)
add(wind * env(0, S["seven"]["start"], 0.8, 0.8), 0.015)
add(crowd * env(S["seven"]["start"], S["blind"]["start"], 0.6, 0.8), 0.015)
place(hit(44, 1.4, 0.3), W_("seven", "thousand") + 0.05, 0.07); add(shim * env(W_("seven", "thousand"), S["blind"]["start"], 0.3, 0.8), 0.02)
b0, b1 = S["baskets"]["start"], S["baskets"]["end"]
for k in range(7): place(knock(520 + 40 * k) * 0.6, b0 + 0.4 + k * (b1 - b0 - 0.8) / 7, 0.05, (k % 3 - 1) * 0.4)
# the blind man: hazy, muffled world until "clearly"
cl = W_("clear", "clearly")
add(pad([G2, D3, Bb2 * 2, F3]) * env(S["blind"]["start"], cl, 0.8, 0.05), 0.055)
add(lp(crowd, 350) * env(S["trees"]["start"], cl, 0.5, 0.05), 0.04)
for k in np.arange(S["trees"]["start"] + 0.2, S["trees"]["end"], 0.95): heart(k, 0.04)
place(swell(1.1, 200, 8000), cl - 1.05, 0.05); place(hit(42, 2.4, 0.3), cl + 0.03, 0.1)
add(pad([D2, A2, D3, F3 * 2 * 0.5 * 2 / 2, A3, D3 * 2]) * env(cl, S["who"]["start"] + 0.5, 0.05, 1.0), 0.06)
add(shim * env(cl, S["who"]["start"], 0.05, 0.8), 0.03)
# the road: who do you say I am?
add(pad([C3, G3, E3 * 0.5 * 2, G2]) * slow * env(S["who"]["start"], S["peter"]["start"], 1.0, 0.4), 0.05)
add(wind * env(S["who"]["start"], S["peter"]["start"], 1.0, 0.5), 0.012)
ms = W_("peter", "messiah")
place(swell(0.9, 300, 9000), ms - 0.85, 0.045); place(hit(46, 2.0, 0.25), ms + 0.03, 0.08)
add(pad([D2, A2, D3, A3, D3 * 2 * 1.26]) * env(ms, S["suffer"]["start"] + 0.5, 0.1, 0.8), 0.06)
add(shim * env(ms, S["suffer"]["start"], 0.1, 0.8), 0.025)
# suffering, death, rising
add(pad([D2, A2, D3, F3]) * env(S["suffer"]["start"], S["rebuke"]["start"], 0.6, 0.6), 0.055)
for k in np.arange(S["suffer"]["start"] + 0.3, W_("suffer", "rise") - 0.3, 1.1): heart(k, 0.045)
place(swell(0.9, 300, 8000), W_("suffer", "rise") - 0.85, 0.04)
add(pad([G2, D3, Bb2 * 2, D3 * 2]) * env(S["rebuke"]["start"], S["satan"]["start"] + 0.3, 0.4, 0.4), 0.05)
place(hit(36, 2.0, 0.4), W_("satan", "satan") + 0.02, 0.1)
add(lp(noise, 120) * env(W_("satan", "satan"), S["satan"]["end"], 0.05, 0.8), 0.03)
# take up your cross; the whole world vs the soul
add(pad([D2, A2, D3, F3, A3]) * slow * env(S["cross"]["start"], DUR, 1.0, 2.0), 0.06)
place(knock(300), W_("cross", "cross") + 0.05, 0.08); place(knock(260), W_("cross", "cross") + 0.3, 0.06)
place(hit(44, 1.2, 0.2), W_("soul", "world") + 0.05, 0.05)
place(note(880.0, 2.0), W_("soul", "soul") + 0.05, 0.05); add(shim * env(W_("soul", "soul"), DUR - 1, 0.3, 1.5), 0.02)
ed = S["end"]["start"]
for k, fq in enumerate([293.66, 349.23, 440.0, 587.33, 523.25, 440.0, 587.33]):
    place(note(fq, 2.0), ed + 0.1 + k * 0.42, 0.08, 0.15)
