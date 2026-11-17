"""Narration with Kokoro-82M (ONNX).  Usage: tts.py <model dir> <out dir>
Writes voice.wav (24 kHz mono) and timing.json (segments + estimated word times)."""
import sys, json, os, re, wave
import numpy as np
from kokoro_onnx import Kokoro
import script as SC

mdir, out = sys.argv[1], sys.argv[2]
k = Kokoro(os.path.join(mdir, "kokoro-v1.0.onnx"), os.path.join(mdir, "voices-v1.0.bin"))
SR = 24000
LEAD = 0.5
buf = [np.zeros(int(LEAD * SR), np.float32)]
t = LEAD
segs = []
for scene, text, voice, speed, pause, keys in SC.LINES:
    s, sr = k.create(text, voice=voice, speed=speed, lang="en-gb" if voice.startswith("b") else "en-us")
    assert sr == SR
    s = s.astype(np.float32)
    env = np.abs(s) > 0.012
    idx = np.nonzero(env)[0]
    s = s[max(0, idx[0] - 600): idx[-1] + 2400]
    s /= max(1e-6, np.abs(s).max()) / 0.85
    if voice == SC.T:  # tempter: darker + a quiet doubled echo
        d = int(0.085 * SR)
        e = np.zeros(len(s) + d * 2, np.float32)
        e[:len(s)] += s; e[d:d + len(s)] += 0.35 * s; e[2 * d:] += 0.15 * s
        s = e
        # one-pole low-pass
        o = np.empty_like(s); a = 0.38; y = 0.0
        for i, x in enumerate(s):
            y += a * (x - y); o[i] = y
        s = o / max(1e-6, np.abs(o).max()) * 0.85
    dur = len(s) / SR
    # estimated word timings: weight by letters, extra weight after punctuation (pauses)
    words = text.split()
    wts = [len(re.sub(r"[^A-Za-z']", "", w)) + 1.5 + (4.5 if re.search(r"[.?!:]$", w) else 2.0 if w.endswith(",") else 0) for w in words]
    tot = sum(wts); acc = 0; wl = []
    for w, wt in zip(words, wts):
        wl.append({"text": w, "start": round(t + (dur - 0.1) * acc / tot, 3), "key": re.sub(r"[^A-Za-z']", "", w) in keys})
        acc += wt
    segs.append({"scene": scene, "text": text, "tempter": voice == SC.T, "start": round(t, 3), "end": round(t + dur, 3), "words": wl})
    buf.append(s); buf.append(np.zeros(int(pause * SR), np.float32))
    t += dur + int(pause * SR) / SR
    print(f"{segs[-1]['start']:6.2f} {dur:5.2f}  {text}")
a = np.concatenate(buf)
with wave.open(os.path.join(out, "voice.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())
json.dump({"duration": round(len(a) / SR, 3), "segments": segs}, open(os.path.join(out, "timing.json"), "w"), indent=1)
print("total", len(a) / SR)
