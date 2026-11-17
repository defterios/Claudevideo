"""Build the voice track + timeline for Bible Ep1 (Bidayuh).
Usage: build_ep1.py <denoised48.wav> <out_dir_public> <out_json>
Line windows were found from silence detection + a script-prompted Whisper pass (Bidayuh isn't a Whisper language,
so word timings inside a line are spread over the voiced frames by word length)."""
import json, os, re, subprocess, sys, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ep1 as EP

WINDOWS = [(6.30, 11.10), (11.90, 17.25), (18.25, 19.55), (20.02, 23.30), (24.90, 28.87), (29.44, 35.31), (36.35, 38.53),
           (39.73, 43.69), (44.10, 49.18), (51.17, 53.86), (54.76, 57.99), (59.71, 66.11), (67.82, 70.82), (70.82, 72.92),
           (74.33, 76.99), (78.04, 83.51), (83.98, 87.83), (90.21, 94.74)]
assert len(WINDOWS) == len(EP.LINES)
den, pub, out_json = sys.argv[1:4]
tmp = os.path.join(pub, "_tmp")
os.makedirs(tmp, exist_ok=True)
CH = ("highpass=f=75,agate=threshold=0.012:ratio=2:attack=4:release=180:range=0.3:knee=3,equalizer=f=120:t=q:w=1:g=2.5,"
      "equalizer=f=320:t=q:w=1.2:g=-3,equalizer=f=3800:t=q:w=1.5:g=3,equalizer=f=11000:t=h:w=0.7:g=1.5,deesser=i=0.35,"
      "acompressor=threshold=-26dB:ratio=4:attack=4:release=90:makeup=4:knee=4,acompressor=threshold=-14dB:ratio=2.5:attack=2:release=50,"
      "alimiter=limit=0.89:attack=2:release=40,loudnorm=I=-12:TP=-1.5:LRA=7")
# Tempter: 3 semitones lower (same speed), darker, faint echo
TEMPT = "asetrate=48000*0.8409,aresample=48000,atempo=1.1892,lowpass=f=5200,aecho=0.7:0.6:70|140:0.25|0.15,volume=1.15"
studio = os.path.join(tmp, "studio.wav"); dark = os.path.join(tmp, "tempter.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", den, "-af", CH, "-ar", "48000", "-ac", "2", studio], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", studio, "-af", TEMPT, "-ar", "48000", "-ac", "2", dark], check=True)

def load(p):
    w = wave.open(p); return w.getframerate(), np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32)
SR, A = load(studio); _, D = load(dark)
mono = A.mean(1) / 32768; hop = int(0.01 * SR)
env = 20 * np.log10(np.sqrt((mono[: len(mono) // hop * hop].reshape(-1, hop) ** 2).mean(1)) + 1e-9)
SIL = -38

def voiced_parts(s, e):
    """split a line window at internal pauses > 0.4 s (keep 0.15 s of air each side)"""
    i0, i1 = int(s / 0.01), int(e / 0.01)
    q = env[i0:i1] < SIL
    loud = np.where(~q)[0]
    if len(loud) == 0: return [(s, e)]
    a, b = s + loud[0] * 0.01 - 0.08, s + loud[-1] * 0.01 + 0.15
    parts, start, k = [], a, int((a - s) / 0.01)
    end_k = min(len(q), int((b - s) / 0.01))
    while k < end_k:
        if q[k]:
            j = k
            while j < end_k and q[j]: j += 1
            if (j - k) * 0.01 > 0.4:
                parts.append((start, s + k * 0.01 + 0.15)); start = s + j * 0.01 - 0.15
            k = j
        else: k += 1
    parts.append((start, b))
    return parts

out = np.zeros((int(140 * SR), 2), np.float32); xf = int(0.015 * SR)
t, lines, words = 0.25, [], []
prev_scene = None
for n, ((s, e), (scene, bid, en, tempter)) in enumerate(zip(WINDOWS, EP.LINES), 1):
    if n > 1:
        t += 0.75 if tempter else (0.6 if scene != prev_scene else 0.42)   # storytelling pace, longer before the Tempter speaks
    prev_scene = scene
    src = D if tempter else A
    parts = voiced_parts(s, e)
    l_start = t
    spans = []
    for ps, pe in parts:
        seg = src[int(ps * SR): int(pe * SR)].copy()
        r = np.linspace(0, 1, xf)[:, None]; seg[:xf] *= r; seg[-xf:] *= r[::-1]
        out[int(t * SR): int(t * SR) + len(seg)] += seg
        spans.append((t, t + (pe - ps), ps))
        t += pe - ps
        if (ps, pe) != parts[-1]: t += 0.3
    # word timing: spread script words over voiced output time by length
    toks = bid.replace(":", ": ").split()
    voiced = []
    for os_, oe, ps in spans:
        fi0, fi1 = int(ps / 0.01), int((ps + oe - os_) / 0.01)
        for k in range(fi0, fi1):
            if env[k] > SIL: voiced.append(os_ + (k - fi0) * 0.01)
    if not voiced: voiced = [l_start, t]
    wl = np.array([max(2, len(re.sub(r"[^\w]", "", x))) + 1.5 for x in toks], float)
    cs = np.concatenate([[0], np.cumsum(wl)]) / wl.sum()
    for k, tok in enumerate(toks):
        i0 = int(cs[k] * (len(voiced) - 1)); i1 = max(i0, int(cs[k + 1] * (len(voiced) - 1)))
        words.append({"line": n, "text": tok, "start": round(voiced[i0], 3), "end": round(voiced[i1], 3)})
    lines.append({"n": n, "scene": scene, "bid": bid, "en": en, "tempter": tempter, "start": round(l_start, 3), "end": round(t, 3)})
total = t + 2.2
out = out[: int(total * SR)]
ow = wave.open(os.path.join(pub, "voice.wav"), "w"); ow.setnchannels(2); ow.setsampwidth(2); ow.setframerate(SR)
ow.writeframes(np.clip(out, -32768, 32767).astype(np.int16).tobytes()); ow.close()

# scenes = runs of lines; captions = 2-4 word pages, never across lines
scenes = []
for L in lines:
    if scenes and scenes[-1]["id"] == L["scene"]: scenes[-1]["lines"].append(L["n"])
    else: scenes.append({"id": L["scene"], "start": 0 if not scenes else round(L["start"] - 0.3, 3), "lines": [L["n"]]})
for i, sc in enumerate(scenes):
    sc["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else round(total, 3)
pages = []
for L in lines:
    ws = [w for w in words if w["line"] == L["n"]]
    cur = []
    for i, w in enumerate(ws):
        cur.append(w)
        if len(cur) >= 3 or re.search(r"[.,?!:]$", w["text"]) or i == len(ws) - 1:
            pages.append({"line": L["n"], "start": cur[0]["start"], "end": cur[-1]["end"], "words": [dict(text=x["text"], start=x["start"]) for x in cur]}); cur = []
for i, p in enumerate(pages):
    nxt = pages[i + 1]["start"] if i + 1 < len(pages) else total
    p["end"] = round(min(nxt, p["end"] + 0.5), 3)
json.dump({"duration": round(total, 3), "lines": lines, "scenes": scenes, "pages": pages, "keywords": sorted(EP.KEYWORDS)}, open(out_json, "w"), indent=1)
print(f"{total:.1f}s  {len(lines)} lines  {len(scenes)} scenes  {len(pages)} caption pages")
for sc in scenes: print(f"  {sc['id']:10s} {sc['start']:6.2f}-{sc['end']:6.2f} lines {sc['lines']}")
