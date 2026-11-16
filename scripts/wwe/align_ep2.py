"""Align the creator's voice-over to the Ep2 script and build edited voice tracks.
Usage: align_ep2.py <whisper.json> <studio.wav> <out_dir>
Writes: words_long.json, words_short.json (script words with EDITED times + line no.), voice_long.wav, voice_short.wav"""
import json, re, sys, os, wave, difflib
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import script_ep2 as SC

REMOVE = [(35.0, 36.3), (57.2, 58.9)]  # profanity in a flubbed take; false start "Then comes the pad."
MERGE, PAD_IN, PAD_OUT = 0.34, 0.06, 0.14
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower().replace("six", "6").replace("thirty", "30").replace("one", "1").replace("two", "2").replace("three", "3").replace("four", "4"))

hyp = [w for s in json.load(open(sys.argv[1])) for w in s["words"] if w["w"].strip() and not any(a <= w["s"] < b for a, b in REMOVE)]
ref = []  # (line, word)
for n, (_, text, _) in enumerate(SC.LONG, 1):
    ref += [(n, x) for x in text.replace("...", "… ").replace(":", ": ").split()]
H = [norm(w["w"]) for w in hyp]
R = [norm(x) for _, x in ref]
times = [None] * len(ref)
spoken = [None] * len(ref)  # what was actually said at that script position (for captions)
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, R, H, autojunk=False).get_opcodes():
    if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
        for k in range(i2 - i1):
            times[i1 + k] = (hyp[j1 + k]["s"], hyp[j1 + k]["e"])
            spoken[i1 + k] = hyp[j1 + k]["w"].strip()
    elif tag == "replace":  # unequal blocks: spread the spoken span over the script words
        s0, e0 = hyp[j1]["s"], hyp[j2 - 1]["e"]
        for k in range(i2 - i1):
            times[i1 + k] = (s0 + (e0 - s0) * k / (i2 - i1), s0 + (e0 - s0) * (k + 1) / (i2 - i1))
# interpolate anything still missing between neighbours
for i, t in enumerate(times):
    if t is None:
        prev = next((times[j] for j in range(i - 1, -1, -1) if times[j]), (0, 0))
        nxt = next((times[j] for j in range(i + 1, len(times)) if times[j]), (prev[1] + 0.3, prev[1] + 0.3))
        times[i] = (prev[1], min(nxt[0], prev[1] + 0.3))
matched = sum(1 for t in times if t)
print(f"aligned {matched}/{len(ref)} script words")

w = wave.open(sys.argv[2]); SR = w.getframerate()
audio = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32)

def edit(lines, name):
    out_words, pieces, t = [], [], 0.35
    for n in lines:
        idx = [i for i, (ln, _) in enumerate(ref) if ln == n]
        isl = []
        for i in idx:
            s, e = times[i]
            if isl and s - isl[-1][1] < MERGE: isl[-1][1] = max(isl[-1][1], e); isl[-1][2].append(i)
            else: isl.append([s, e, [i]])
        for k, (s, e, ids) in enumerate(isl):
            ps = s - PAD_IN if k == 0 else max(s - PAD_IN, (isl[k - 1][1] + s) / 2)
            pe = e + PAD_OUT if k == len(isl) - 1 else min(e + PAD_OUT, (e + isl[k + 1][0]) / 2)
            for i in ids:
                out_words.append({"line": n, "w": spoken[i] or ref[i][1], "cue": ref[i][1], "s": round(t + times[i][0] - ps, 3), "e": round(t + times[i][1] - ps, 3)})
            pieces.append((ps, pe, t)); t += pe - ps
            if k < len(isl) - 1: t += 0.08
        t += max(0.25, SC.LONG[n - 1][2] * 0.85)
    total = t + 0.8
    buf = np.zeros((int(total * SR), 2), np.float32); xf = int(0.012 * SR)
    for ps, pe, at in pieces:
        seg = audio[int(ps * SR): int(pe * SR)].copy()
        if len(seg) > 2 * xf:
            r = np.linspace(0, 1, xf)[:, None]; seg[:xf] *= r; seg[-xf:] *= r[::-1]
        i0 = int(at * SR); buf[i0:i0 + len(seg)] += seg[: len(buf) - i0]
    ow = wave.open(os.path.join(sys.argv[3], f"voice_{name}.wav"), "w"); ow.setnchannels(2); ow.setsampwidth(2); ow.setframerate(SR)
    ow.writeframes(np.clip(buf, -32768, 32767).astype(np.int16).tobytes()); ow.close()
    json.dump(out_words, open(os.path.join(sys.argv[3], f"words_{name}.json"), "w"))
    print(name, f"{total:.1f}s", len(out_words), "words")

edit(list(range(1, len(SC.LONG) + 1)), "long")
edit(SC.SHORT_LINES, "short")
