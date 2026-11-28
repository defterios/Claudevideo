"""dialogue track for the GTA-choice skit: per-shot clip audio (AI-denoised), the J-cut 'are you okay?',
and the curse word muted (the beep is added in Remotion). Usage: build_audio.py <timeline.json> <den_dir> <out.wav>"""
import json, sys, wave, numpy as np
T = json.load(open(sys.argv[1])); SR = 48000
def load(c):
    w = wave.open(f"{sys.argv[2]}/{c}.wav"); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
GAIN = {"256a7258": 7.0, "5d7f34d7": 5.0}  # speech clips are recorded quietly
starts, t = [], 0.0
for s in T["shots"]: starts.append(t); t += s["dur"]
out = np.zeros(int((t + 0.5) * SR), np.float32)
def put(sig, at):
    f = int(0.01 * SR)
    if len(sig) > 2 * f: r = np.linspace(0, 1, f); sig[:f] *= r; sig[-f:] *= r[::-1]
    i = int(at * SR); out[i:i + len(sig)] += sig[: len(out) - i]
for s, st in zip(T["shots"], starts):
    if s.get("mute"): continue
    a = load(s["clip"])[int(s["src"] * SR): int((s["src"] + s["dur"]) * SR)].copy() * GAIN.get(s["clip"], 2.0)
    c = T["curse"]
    if s["clip"] == c["clip"]:
        i0, i1 = int((c["src0"] - s["src"]) * SR), int((c["src1"] - s["src"]) * SR); a[i0:i1] = 0
    put(a, st)
for o in T["overlays"]:
    a = load(o["clip"])[int(o["src"] * SR): int((o["src"] + o["dur"]) * SR)].copy() * GAIN.get(o["clip"], 2.0)
    put(a, starts[o["shot"]] + o["at"])
peak = np.abs(out).max(); out *= min(1.0, 0.89 / max(peak, 1e-6))
w = wave.open(sys.argv[3], "w"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
print(f"{t:.2f}s peak {peak:.2f}")
