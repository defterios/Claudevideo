"""Snap the names-montage cue times to the real spoken names (whisper word timestamps on the final voice track).
Usage: align_names.py <voice.wav> <data.json>   (patches the 'names' scene 'ws' entries in place)"""
import sys, json, re, difflib, wave
import numpy as np
from faster_whisper import WhisperModel
vw, dj = sys.argv[1], sys.argv[2]
d = json.load(open(dj))
sc = next(s for s in d["scenes"] if s["id"] == "names")
w = wave.open(vw); sr = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
seg = a[int(sc["start"] * sr): int(sc["end"] * sr)]
a16 = np.interp(np.arange(0, len(seg), sr / 16000), np.arange(len(seg)), seg).astype(np.float32)
m = WhisperModel("small", device="cpu", compute_type="int8")
ss, _ = m.transcribe(a16, language="ms", word_timestamps=True, condition_on_previous_text=False)
hw = [(re.sub(r"[^a-z]", "", x.word.lower()), x.start) for s in ss for x in s.words]
NAMES = ["simon", "james", "john", "andrew", "philip", "bartholomew", "matthew", "thomas", "thaddeus", "thaddaeus"]
j = 0; fixed = 0
for e in sc["ws"]:
    if e[0] not in NAMES: continue
    best = None
    for k in range(j, min(j + 8, len(hw))):
        r = difflib.SequenceMatcher(None, e[0], hw[k][0]).ratio()
        if r > 0.45 and (best is None or r > best[0] + 0.15): best = (r, k)
    if best:
        print(f"{e[0]:12s} {e[1]:6.2f} -> {hw[best[1]][1]:6.2f}  ({hw[best[1]][0]})")
        e[1] = round(float(hw[best[1]][1]), 3); j = best[1] + 1; fixed += 1
json.dump(d, open(dj, "w"), indent=1, ensure_ascii=False)
print("fixed", fixed)
