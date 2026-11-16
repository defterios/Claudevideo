"""Generate narration with Kokoro-82M (ONNX). Usage: tts.py <LONG|SHORT> <model dir> <out.wav> <out.json> [voice] [speed]"""
import sys, json, wave, numpy as np, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kokoro_onnx import Kokoro
import script as SC

which, mdir, out_wav, out_json = sys.argv[1:5]
voice = sys.argv[5] if len(sys.argv) > 5 else "am_michael"
speed = float(sys.argv[6]) if len(sys.argv) > 6 else 1.0
k = Kokoro(os.path.join(mdir, "model.onnx"), os.path.join(mdir, "voices.npz"))
lines = getattr(SC, which)
audio, meta, t, sr = [], [], 0.35, 24000
audio.append(np.zeros(int(0.35 * sr), np.float32))
for scene, text, pause in lines:
    s, sr = k.create(text, voice=voice, speed=speed, lang="en-us")
    s = s.astype(np.float32)
    # trim leading/trailing near-silence the model adds
    nz = np.where(np.abs(s) > 0.01)[0]
    if len(nz):
        s = s[max(0, nz[0] - int(0.03 * sr)): nz[-1] + int(0.08 * sr)]
    meta.append({"scene": scene, "text": text, "start": round(t, 3), "end": round(t + len(s) / sr, 3)})
    audio += [s, np.zeros(int(pause * sr), np.float32)]
    t += len(s) / sr + pause
a = np.concatenate(audio)
a = a / max(1e-6, np.abs(a).max()) * 0.9
w = wave.open(out_wav, "w"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes((a * 32767).astype(np.int16).tobytes()); w.close()
json.dump({"duration": round(t, 3), "lines": meta}, open(out_json, "w"), indent=1)
print(which, voice, f"{t:.1f}s", len(meta), "lines")
