"""Bidayuh (Bau) version: cut the creator's voiceover into the 18 script lines and write timing.json + voice.wav
in the same format as tts.py, so build.py can be reused.   Usage: bidayuh.py <voice.wav 24k mono> <out dir>
Each line: (scene, Bidayuh text, tempter?, start/end in the raw recording, caption keywords, {english cue: bidayuh word})."""
import sys, json, os, re, wave
import numpy as np
import script as SC

LINES = [
    ("Slama 30 sowa, yeh jek eh tukang koyuh. Doi nyaa piruh eh.", 6.35, 10.95, ["tukang", "koyuh", "Doi"], {"nobody": "Doi"}),
    ("Jadi daang 1 pagi, yeh meh muun ke sungi.", 11.95, 14.9, ["sungi"], {}),
    ("Longit pun meh tibuka.", 15.25, 17.4, ["Longit", "tibuka"], {"tore": "tibuka"}),
    ("Ogi suara nang: Muu onak Ku, Oku nyayang muu.", 17.85, 23.35, ["onak", "nyayang"], {"you": "Muu", "son": "onak", "love": "nyayang"}),
    ("Mokuo de munu tia? Yeh meh toban dep eh ke padang pasir.", 24.2, 28.45, ["toban", "padang", "pasir"], {"desert": "padang"}),
    ("40 onu. Doi pinguman. Jek eh bonguh, batuh, duoh binatang buas.", 29.5, 35.25, ["40", "pinguman", "buas"], {"forty": "40", "no": "Doi", "just": "Jek", "wild": "binatang"}),
    ("Mokuo inuh meh ogi suara nang.", 36.15, 38.5, ["suara"], {"whisper": "suara"}),
    ("Muu neh pirai. Duok tukar batuh itih jadi ruti.", 39.8, 43.65, ["pirai", "ruti"], {"turn": "tukar", "bread": "ruti"}),
    ("Yeh meh nang: Misia ideh di eh idip pakai pinguman sija.", 44.2, 49.15, ["ideh", "sija"], {"man": "Misia", "live": "idip"}),
    ("Bitabung. Pikirien mu onak Topa.", 50.8, 53.8, ["Bitabung", "Pikirien"], {}),
    ("Yeh nang in eh: Ma mu suba Topa.", 54.8, 58.1, ["suba"], {}),
    ("Sujud tudu oku, tie suo de muti jadi tu dimu. Doi monam, doi salip.", 58.55, 66.1, ["Sujud", "dimu", "salip"], {"all": "tie", "yours": "dimu", "cross": "salip"}),
    ("Yeh de meh pirai, kowek, sadi eh ade.", 67.88, None, ["pirai", "sadi"], {"alone": "sadi"}),
    ("Meh in eh: Buu.", None, 72.9, ["Buu"], {"go": "Buu"}),
    ("Muot pun meh buu. Ju Malaikat meh neg.", 74.38, 76.95, ["buu", "Malaikat"], {"angels": "Malaikat"}),
    ("Jesus ruah suo padang pasir inuh romah, kowek tapi masih gogah mun pimonu eh.", 78.1, 83.5, ["gogah"], {}),
    ("Masa meh rie neg, Pritah Topa meh sinek.", 83.95, 87.8, ["Masa", "Pritah", "sinek"], {}),
    ("Episod 1: Padang Pasir. Follow suo part 2.", 89.95, 94.75, ["Padang", "Follow"], {}),
]
assert len(LINES) == len(SC.LINES)

src, out = sys.argv[1], sys.argv[2]
with wave.open(src) as w:
    SR = w.getframerate()
    a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
H = int(0.01 * SR)
def env_db(x):
    n = len(x) // H
    return 20 * np.log10(np.sqrt((x[: n * H].reshape(n, H) ** 2).mean(1)) + 1e-9)
DB = env_db(a)
TH = -45  # speech vs room tone (gaps sit at about -65 dB)

# split point between lines 13 and 14: longest quiet run in 69.5–71.6 s
q = DB[int(69.5 * 100): int(71.6 * 100)] < TH
best, run, bs = (0, 0), 0, 0
for i, v in enumerate(q):
    if v:
        run += 1
        if run > best[0]: best = (run, i - run + 1)
    else:
        run = 0
cut = 69.5 + (best[1] + best[0] / 2) / 100
L = [list(x) for x in LINES]
L[12][2] = cut; L[13][1] = cut
print(f"line 13/14 split at {cut:.2f}s (quiet run {best[0] * 10} ms)")

def tighten(x, cap=0.42):
    """shorten internal pauses longer than `cap` (keeps breaths natural)"""
    d = env_db(x); quiet = d < TH; keep = np.ones(len(x), bool)
    i = 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            if (j - i) / 100 > cap and i > 0 and j < len(quiet):
                s = i * H + int(cap / 2 * SR); e = j * H - int(cap / 2 * SR)
                keep[s:e] = False
            i = j
        else:
            i += 1
    return x[keep]

def fade(x, ms=12):
    n = int(ms / 1000 * SR); f = np.linspace(0, 1, n, dtype=np.float32)
    x = x.copy(); x[:n] *= f; x[-n:] *= f[::-1]; return x

buf = [np.zeros(int(0.5 * SR), np.float32)]
t = 0.5
segs = []
for (scene, _en, voice, _sp, pause, _k), (text, s, e, keys, alias) in zip(SC.LINES, L):
    x = a[int((s - 0.06) * SR): int((e + 0.1) * SR)]
    # trim to first/last voiced frame
    d = env_db(x); v = np.nonzero(d > TH)[0]
    x = x[max(0, v[0] * H - int(0.05 * SR)): min(len(x), (v[-1] + 1) * H + int(0.12 * SR))]
    x = fade(tighten(x))
    tempter = voice == SC.T
    if tempter:  # same voice, with a faint doubled echo so the tempter feels "other"
        dl = int(0.085 * SR)
        y = np.zeros(len(x) + dl * 2, np.float32)
        y[: len(x)] += x; y[dl: dl + len(x)] += 0.28 * x; y[2 * dl:] += 0.12 * x
        x = y
    dur = len(x) / SR
    # word timings: spread the written words over the *voiced* time of the clip, weighted by letters
    d = env_db(x); voiced = (d > TH).astype(float); cum = np.cumsum(voiced); cum /= cum[-1]
    words = text.replace(" :", ":").split()
    wts = [len(re.sub(r"[^\w]", "", w)) + 1.2 for w in words]
    tot = sum(wts); acc = 0; wl = []
    inv = {b.lower(): k for k, b in alias.items()}
    for w, wt in zip(words, wts):
        fr = int(np.searchsorted(cum, acc / tot + 1e-6))
        bare = re.sub(r"[^\w]", "", w)
        wl.append({"text": w, "start": round(t + fr / 100, 3), "key": bare in keys, "alias": inv.get(bare.lower())})
        acc += wt
    segs.append({"scene": scene, "text": text, "tempter": tempter, "start": round(t, 3), "end": round(t + dur, 3), "words": wl})
    print(f"{t:6.2f} {dur:5.2f}  {text}")
    buf.append(x); buf.append(np.zeros(int(pause * SR), np.float32))
    t += dur + int(pause * SR) / SR
y = np.concatenate(buf)
y = y / np.abs(y).max() * 0.89
with wave.open(os.path.join(out, "voice.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype(np.int16).tobytes())
json.dump({"duration": round(len(y) / SR, 3), "segments": segs}, open(os.path.join(out, "timing.json"), "w"), indent=1, ensure_ascii=False)
print("total", len(y) / SR)
