"""Timeline + sound bed for "The Wilderness".  Usage: build.py <build dir with voice.wav/timing.json>
Writes src/v8/data.json, public/v8/voice.mp3 and public/v8/bed.mp3 (synthesised score + ambience, ducked under the voice)."""
import sys, json, os, re, wave, subprocess
import numpy as np

bd = sys.argv[1]
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
T = json.load(open(os.path.join(bd, "timing.json")))
segs, DUR = T["segments"], T["duration"]

# ---------- scenes ----------
scenes = []
for s in segs:
    if not scenes or scenes[-1]["id"] != s["scene"]:
        scenes.append({"id": s["scene"], "start": 0.0 if not scenes else round(s["start"] - 0.28, 3), "segs": [], "w": {}})
    scenes[-1]["segs"].append(s)
for i, sc in enumerate(scenes):
    sc["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else DUR
    st = sc["start"]
    for s in sc["segs"]:
        for w in s["words"]:
            sc["w"].setdefault(re.sub(r"[^a-z']", "", w["text"].lower()), round(w["start"] - st, 3))
    sc["segs"] = [round(s["start"] - st, 3) for s in sc["segs"]]

# ---------- caption pages (2-4 words, break on punctuation) ----------
pages = []
for s in segs:
    cur = []
    ws = s["words"]
    for i, w in enumerate(ws):
        cur.append(w)
        last = i == len(ws) - 1
        brk = re.search(r"[.?!:,]$", w["text"]) is not None
        if last or (brk and len(cur) >= 2) or len(cur) >= 4:
            if not last and len(ws) - i - 1 == 1 and not brk:  # don't orphan a single word
                continue
            pages.append({"start": cur[0]["start"], "end": s["end"] + 0.25 if last else ws[i + 1]["start"], "tempter": s["tempter"],
                          "words": [{"text": x["text"], "start": x["start"], "key": x["key"]} for x in cur]})
            cur = []
json.dump({"duration": DUR, "scenes": scenes, "pages": pages}, open(os.path.join(ROOT, "src/v8/data.json"), "w"), indent=1)
for sc in scenes: print(f"{sc['id']:9s} {sc['start']:6.2f} {sc['end']:6.2f}")

# ---------- sound bed ----------
SR = 44100
N = int(DUR * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(7)
bed = np.zeros((N, 2), np.float32)
S = {sc["id"]: sc for sc in scenes}
def env(a, b, fi=0.6, fo=0.8):
    return np.clip((tt - a) / fi, 0, 1) * np.clip((b - tt) / fo, 0, 1)
def lp(x, a):
    # cheap low-pass by cumulative smoothing in the frequency domain
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (f / a) ** 4), len(x)).astype(np.float32)
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X * (1 / (1 + (f / hi) ** 4)) * (1 - 1 / (1 + (f / lo) ** 4)), len(x)).astype(np.float32)
def add(x, g=1.0, pan=0.0):
    bed[:, 0] += x * g * (1 - max(0, pan)); bed[:, 1] += x * g * (1 + min(0, pan))
def place(x, at, g=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i < 0: return
    x = x[: N - i]
    bed[i:i + len(x), 0] += x * g * (1 - max(0, pan)); bed[i:i + len(x), 1] += x * g * (1 + min(0, pan))
noise = rng.standard_normal(N).astype(np.float32)

# drone: D minor pad, darkest in the desert, opens to D major for the ending
def pad(freqs, det=0.004):
    o = np.zeros(N, np.float32)
    for f in freqs:
        for d in (-det, 0, det):
            o += np.sin(2 * np.pi * f * (1 + d) * tt + rng.uniform(0, 6.28)).astype(np.float32)
    return o / (len(freqs) * 3)
D2, A2, D3, F3, A3, D4, Fs4, A4, Cs3, G2 = 73.42, 110.0, 146.83, 174.61, 220.0, 293.66, 369.99, 440.0, 138.59, 98.0
slow = 0.75 + 0.25 * np.sin(2 * np.pi * 0.07 * tt)
add(pad([D2, A2, D3]) * slow * env(0, S["angels"]["start"], 2.5, 1.2), 0.20)
add(pad([D3, F3, A3]) * env(S["drive"]["start"], S["go"]["end"], 2.0, 0.6) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * tt)), 0.11)
add(pad([D2 * 0.5, Cs3 * 0.5, G2]) * env(S["bread"]["start"], S["go"]["end"] - 0.6, 3.0, 0.5), 0.17)  # tempter dissonance
add(pad([D3, A3, D4, Fs4]) * env(S["angels"]["start"], DUR, 1.2, 2.0), 0.19)
add(pad([D2, A2]) * env(S["angels"]["start"], DUR, 1.5, 2.0), 0.20)
shim = sum(np.sin(2 * np.pi * f * tt) * (0.5 + 0.5 * np.sin(2 * np.pi * r * tt + p)) for f, r, p in [(1174.7, 0.9, 0), (1480, 1.3, 2), (1760, 0.7, 4), (2349, 1.1, 1)]).astype(np.float32) / 4
add(shim * env(S["angels"]["start"] + 0.3, S["walk"]["start"] + 1.5, 1.0, 2.5), 0.055)
add(shim * env(S["sky"]["start"] + 0.6, S["drive"]["start"], 0.5, 1.2), 0.05)

# ambience: river, desert wind, night
water = bp(noise, 500, 3500) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.6 * tt + np.sin(2 * np.pi * 0.23 * tt) * 3))
add(water * env(2.2, S["drive"]["start"] + 0.3, 1.0, 1.0), 0.05)
wind = bp(noise, 180, 900) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.13 * tt + 1) * np.sin(2 * np.pi * 0.31 * tt))
add(wind * env(S["drive"]["start"], S["angels"]["start"], 0.5, 1.0), 0.16, 0.2)
add(np.roll(wind, SR * 3) * env(S["walk"]["start"], DUR, 1.0, 2.0), 0.05, -0.2)

def hit(f=55, d=1.6, drop=0.5):  # low drum / impact
    n = int(d * SR); x = np.arange(n) / SR
    ph = 2 * np.pi * (f * x + f * drop * (1 - np.exp(-x * 9)) / 9)
    return (np.sin(ph) * np.exp(-x * 3.2) + 0.25 * rng.standard_normal(n) * np.exp(-x * 30)).astype(np.float32)
def knock(f=420):
    n = int(0.12 * SR); x = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * x) * np.exp(-x * 60) + 0.5 * rng.standard_normal(n) * np.exp(-x * 120)).astype(np.float32)
def heart(at, g=0.5):
    place(hit(48, 0.5, 0.2), at, g); place(hit(44, 0.5, 0.2), at + 0.22, g * 0.7)
def swell(d, lo=200, hi=5000):  # reverse-style noise riser
    n = int(d * SR); x = np.arange(n) / SR
    return bp(rng.standard_normal(n).astype(np.float32), lo, hi) * (x / d) ** 3

r = S["river"]
for k in range(4): place(knock(380 + 30 * (k % 2)), 0.62 + k * 0.62, 0.30, -0.2)       # carpenter hammering
sk = S["sky"]["start"]
place(swell(1.3), sk + 0.05, 0.35)
place(hit(38, 3.0, 1.2), sk + 1.35, 1.0); place(hit(70, 1.2, 0.8), sk + 1.35, 0.5)      # the sky tears
place(hit(34, 2.4, 0.3), S["voice"]["start"] + 0.3, 0.55)
place(swell(0.5, 300, 6000), S["drive"]["start"] - 0.3, 0.3); place(hit(50, 1.2), S["drive"]["start"] + 0.2, 0.6)
f = S["fast"]
for w in ("forty", "no", "just"): place(hit(46, 1.4), f["start"] + f["w"][w], 0.55)
for k in np.arange(S["bread"]["start"] + 0.5, S["go"]["start"], 1.05): heart(k, 0.26)       # heartbeat under the temptations
for k in np.arange(S["go"]["start"], S["go"]["start"] + S["go"]["w"]["go"] - 0.2, 0.7): heart(k, 0.5)
for sid in ("temple", "kingdoms"): place(swell(0.5, 300, 6000), S[sid]["start"] - 0.35, 0.3); place(hit(42, 2.0), S[sid]["start"] + 0.1, 0.7)
place(hit(60, 0.4), S["kingdoms"]["start"] + S["kingdoms"]["w"]["cross"], 0.5)
go = S["go"]["start"] + S["go"]["w"]["go"]
place(swell(0.6), go - 0.5, 0.3); place(hit(36, 3.2, 1.5), go + 0.12, 1.1); place(hit(90, 1.0, 1.0), go + 0.12, 0.5)
# closing march: frame drum + simple rising line (D major)
wk = S["walk"]["start"]
for k, b in enumerate(np.arange(wk + 0.2, DUR - 2.2, 0.5)):
    place(hit(62 if k % 4 else 50, 0.6, 0.3), b, 0.34 if k % 4 else 0.5)
def note(f, d):
    n = int(d * SR); x = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * x) + 0.3 * np.sin(4 * np.pi * f * x) + 0.12 * np.sin(6 * np.pi * f * x)) * np.minimum(x / 0.08, 1) * np.exp(-x * 1.4) * (1 + 0.004 * np.sin(2 * np.pi * 5 * x))).astype(np.float32)
for k, (fq, d) in enumerate([(D4, 1), (Fs4, 1), (A4, 1), (587.33, 2), (493.88, 1), (A4, 1), (587.33, 1), (739.99, 3)]):
    place(note(fq, d * 1.6), wk + 0.2 + sum(x for _, x in [(D4, 1), (Fs4, 1), (A4, 1), (587.33, 2), (493.88, 1), (A4, 1), (587.33, 1), (739.99, 3)][:k]) * 1.0, 0.16, 0.15)

# duck under the voice
with wave.open(os.path.join(bd, "voice.wav")) as w:
    v = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
vsr = 24000
e = np.abs(v); k = int(0.25 * vsr); e = np.convolve(e, np.ones(k) / k, "same")
e = np.interp(tt, np.arange(len(e)) / vsr, e)
duck = 1 - 0.45 * np.clip(e / 0.08, 0, 1)
bed *= duck[:, None].astype(np.float32)
bed *= (np.clip(tt / 0.4, 0, 1) * np.clip((DUR - tt) / 1.5, 0, 1))[:, None].astype(np.float32)
bed = np.tanh(bed * 1.6) * 0.8
os.makedirs(os.path.join(ROOT, "public/v8"), exist_ok=True)
tmp = os.path.join(bd, "bed.wav")
with wave.open(tmp, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((bed * 32767).astype(np.int16).tobytes())
subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-i", tmp, "-b:a", "160k", os.path.join(ROOT, "public/v8/bed.mp3")])
subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-i", os.path.join(bd, "voice.wav"), "-af",
    "highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=8:release=120:makeup=3,loudnorm=I=-14:TP=-1.5:LRA=7", "-ar", "44100", "-b:a", "160k", os.path.join(ROOT, "public/v8/voice.mp3")])
print("ok", DUR)
