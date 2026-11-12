"""
Ozempic vs Mounjaro (v2) timeline builder.
Sources: opening video (open) + three voice-over recordings (vo1..vo3).
Cuts pauses > MERGE_GAP, concatenates, writes src/v2/data.json + public/v2/voice_edit.wav.
Usage: python3 scripts/build_v2.py <dir with tr_open.json, tr_vo1.json ...>
"""
import json, os, re, sys, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import importlib
P = importlib.import_module(os.environ.get('PLAN', 'plan_v2'))  # noqa: E402
OUT_JSON = os.environ.get('OUT', 'src/v2/data.json')

FPS, SR = 30, 48000
MERGE_GAP, PAD_IN, PAD_OUT, SOURCE_GAP = 0.26, 0.05, 0.12, 0.10
q = lambda t: round(t * FPS) / FPS

def load_words(name):
    words = []
    for seg in json.load(open(os.path.join(sys.argv[1], f"tr_{name}.json"))):
        for w in seg["words"]:
            raw = w["w"]
            if words and raw and not raw.startswith(" ") and raw.strip():
                words[-1]["text"] += raw.strip(); words[-1]["e"] = w["e"]
            elif raw.strip():
                words.append({"text": raw.strip(), "s": w["s"], "e": w["e"]})
    for src, at, new in P.WORD_FIXES:
        if src == name:
            w = min(words, key=lambda x: abs(x["s"] - at)); assert abs(w["s"] - at) < 0.05, (src, at); w["text"] = new
    return words

pieces, t = [], 0.0
for name in P.SOURCES:
    words = [w for w in load_words(name) if not any(a <= w["s"] < b for s, a, b in P.REMOVE if s == name)]
    if not words:
        continue
    isl = []
    for w in words:
        if isl and w["s"] - isl[-1]["e"] < MERGE_GAP:
            isl[-1]["e"] = w["e"]; isl[-1]["words"].append(w)
        else:
            isl.append({"s": w["s"], "e": w["e"], "words": [w]})
    for i, x in enumerate(isl):
        pe = isl[i - 1]["e"] if i else None
        ns = isl[i + 1]["s"] if i + 1 < len(isl) else None
        s = q(max(x["s"] - PAD_IN, (pe + x["s"]) / 2 if pe is not None else 0))
        e = q(min(x["e"] + PAD_OUT, (x["e"] + ns) / 2 if ns is not None else 1e9))
        pieces.append({"src": name, "s": s, "e": e, "words": x["words"], "out": t})
        t += e - s
    t += SOURCE_GAP
duration = round(t + P.TAIL, 3)

def to_out(name, st):
    best = None
    for p in pieces:
        if p["src"] != name: continue
        if p["s"] - 0.001 <= st <= p["e"] + 0.001: return round(p["out"] + st - p["s"], 3)
        d = min(abs(st - p["s"]), abs(st - p["e"]))
        c = p["out"] if st < p["s"] else p["out"] + p["e"] - p["s"]
        if best is None or d < best[0]: best = (d, c)
    return round(best[1], 3)

# opening video segments (only the "open" source has picture)
VIDEO_SOURCES = getattr(P, "VIDEO_SOURCES", ["open"])
video = [{"src": p["src"], "srcStart": p["s"], "outStart": round(p["out"], 4), "dur": round(p["e"] - p["s"], 4)} for p in pieces if p["src"] in VIDEO_SOURCES]

out_words = []
for p in pieces:
    for w in p["words"]:
        if w["text"]:
            out_words.append({"text": w["text"], "start": round(p["out"] + w["s"] - p["s"], 3), "end": round(p["out"] + w["e"] - p["s"], 3)})
pages, cur = [], []
for i, w in enumerate(out_words):
    cur.append(w); nxt = out_words[i + 1] if i + 1 < len(out_words) else None
    if (nxt is None or len(cur) >= 4 or sum(len(x["text"]) for x in cur) >= 20 or re.search(r"[.,?!]$", w["text"])
            or nxt["start"] - w["end"] > 0.25):
        pages.append({"start": cur[0]["start"], "end": cur[-1]["end"], "words": [dict(x) for x in cur]}); cur = []
for i, p in enumerate(pages):
    nxt = pages[i + 1]["start"] if i + 1 < len(pages) else duration
    p["end"] = round(min(nxt, p["end"] + 0.5), 3)

# scenes: each starts at (source, time); ends where the next one starts
scenes = []
for i, sc in enumerate(P.SCENES):
    sc = dict(sc); src, st = sc.pop("at")
    sc["start"] = to_out(src, st)
    scenes.append(sc)
for i, sc in enumerate(scenes):
    sc["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else duration
    sc["beats"] = [round(to_out(s, b) - sc["start"], 3) for s, b in sc.get("beats", [])]
sfx = [{"t": round(to_out(s, b) + off, 3), "src": f, "volume": v} for (s, b), f, v, off in P.SFX]
for sc in scenes:  # default transition whoosh on every scene change
    if sc["start"] > 0.1:
        sfx.append({"t": round(sc["start"] - 0.1, 3), "src": sc.get("sfx", "whoosh_slide"), "volume": sc.get("sfxVol", 0.3)})

json.dump({"duration": duration, "video": video, "pages": pages, "scenes": scenes, "sfx": sfx},
          open(os.path.join(ROOT, OUT_JSON), "w"), indent=1)

# voice track: 10 ms crossfades at every cut
out = np.zeros((int(duration * SR) + SR, 2), np.float32); xf = int(0.010 * SR)
cache = {}
for p in pieces:
    if p["src"] not in cache:
        w = wave.open(os.path.join(ROOT, os.environ.get("MEDIA", "public/v2"), f"{p['src']}.wav"))
        cache[p["src"]] = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32)
    a = cache[p["src"]][int(p["s"] * SR): int(p["e"] * SR)].copy()
    if len(a) > 2 * xf:
        r = np.linspace(0, 1, xf)[:, None]; a[:xf] *= r; a[-xf:] *= r[::-1]
    i0 = int(round(p["out"] * SR)); out[i0:i0 + len(a)] += a
ow = wave.open(os.path.join(ROOT, os.environ.get("MEDIA", "public/v2"), "voice_edit.wav"), "w"); ow.setnchannels(2); ow.setsampwidth(2); ow.setframerate(SR)
ow.writeframes(np.clip(out[: int(duration * SR)], -32768, 32767).astype(np.int16).tobytes()); ow.close()
print(f"edit {duration:.1f}s  open video {sum(v['dur'] for v in video):.1f}s  {len(pages)} caption pages  {len(scenes)} scenes  {len(sfx)} sfx")
print("source boundaries:", {p["src"]: round(p["out"], 2) for p in pieces[::-1]})
