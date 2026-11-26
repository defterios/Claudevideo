"""OPPO Watch 5 TikTok: align takes to the spoken text, cut pauses, write voice.wav + data.json.
Usage: build.py <whisper tr.json> <dir with st_<clip>.wav> <public_out_dir> <out_json>"""
import json, re, sys, wave, difflib
import numpy as np

TAKES = [
    ("27e47e4e", "This OPPO Watch 5 honestly just fixed the most annoying part about doing cardio at the gym. You know when you're on the treadmill watching something on your phone and you have to keep looking down at your wrist just to check your heart rate? Now with UltraBurn Mode, it literally floats your live heart rate right over your phone screen, so you stay locked in your personal zone without even breaking focus. And it is not just for running. It covers 35 different cardio modes. Plus, when you finish, it doesn't just throw some random calorie numbers at you. It actually converts your workout into the exact grams of fat you burn."),
    ("31c6f753", "Oh, and if you never know whether to push or take a rest day tomorrow, its AI Personal Trainer reads your recovery, just for you."),
    ("870eaf7c", "It is super thin at 9.2 millimeters, so it will never get in the way of your workout."),
    ("994d26dd", "This watch also can last you 7 to 10 days of battery, so you don't have to worry about charging them every day."),
    ("a8bbac80", "Since this watch works both on iOS and Android, this is the perfect chance for you to try them out."),
]
GAP_CUT, PAD_IN, PAD_OUT, TAKE_GAP = 0.3, 0.08, 0.14, 0.12
SIL_DB, SIL_MIN, KEEP = -40.0, 0.25, 0.07
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower().replace("ultraburn", "ultraburn"))
tr = json.load(open(sys.argv[1]))
SR = 48000
segs, words, out_t = [], [], 0.0
buf = []
for ti, (clip, text) in enumerate(TAKES):
    hyp = [w for s in tr[clip] for w in s["words"] if w["w"].strip()]
    ref = text.split()
    H, R = [norm(w["w"]) for w in hyp], [norm(x) for x in ref]
    times = [None] * len(ref)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, R, H, autojunk=False).get_opcodes():
        if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
            for k in range(i2 - i1): times[i1 + k] = (hyp[j1 + k]["s"], hyp[j1 + k]["e"])
        elif tag == "replace":
            s0, e0 = hyp[j1]["s"], hyp[j2 - 1]["e"]
            for k in range(i2 - i1): times[i1 + k] = (s0 + (e0 - s0) * k / (i2 - i1), s0 + (e0 - s0) * (k + 1) / (i2 - i1))
    for i in range(len(times)):
        if times[i] is None:
            p = next((times[j] for j in range(i - 1, -1, -1) if times[j]), (0, 0))
            times[i] = (p[1], p[1] + 0.2)
    # group words into spans split by pauses
    spans, cur = [], [0]
    for i in range(1, len(ref)):
        if times[i][0] - times[i - 1][1] > GAP_CUT: spans.append(cur); cur = []
        cur.append(i)
    spans.append(cur)
    w = wave.open(f"{sys.argv[2]}/st_{clip}.wav"); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
    # 10 ms energy envelope: catches silences whisper hides inside word timings (e.g. "fat ... you burn")
    hop = SR // 100
    env = 20 * np.log10(np.sqrt((a[: len(a) // hop * hop] / 32768).reshape(-1, hop).__pow__(2).mean(1)) + 1e-9)
    def parts_of(s, e):
        out, start, k0, k1 = [], s, int(s * 100), int(e * 100)
        k = k0
        while k < k1:
            if env[k] < SIL_DB:
                j = k
                while j < k1 and env[j] < SIL_DB: j += 1
                if (j - k) / 100 >= SIL_MIN and k > k0 + 5 and j < k1 - 5:
                    out.append((start, k / 100 + KEEP)); start = j / 100 - KEEP
                k = j
            else:
                k += 1
        out.append((start, e))
        return out
    for si, sp in enumerate(spans):
        s = max(0, times[sp[0]][0] - (PAD_IN + (0.1 if si == 0 else 0)))
        e = times[sp[-1]][1] + PAD_OUT
        if si + 1 < len(spans): e = min(e, times[spans[si + 1][0]][0] - 0.05)
        pts = parts_of(s, e)
        def to_out(x, base=out_t):
            off = base
            for ps, pe in pts:
                if x < pe: return off + max(0, x - ps)
                off += pe - ps
            return off
        for ps, pe in pts:
            seg = a[int(ps * SR): int(pe * SR)].copy(); f = int(0.012 * SR)
            r = np.linspace(0, 1, f); seg[:f] *= r; seg[-f:] *= r[::-1]
            buf.append(seg)
            segs.append({"clip": clip, "take": ti, "src": round(ps, 3), "out": round(out_t, 3), "dur": round(pe - ps, 3)})
            out_t += pe - ps
        base = out_t - sum(pe - ps for ps, pe in pts)
        for i in sp:
            words.append({"w": ref[i], "take": ti, "s": round(to_out(times[i][0], base), 3), "e": round(to_out(times[i][1], base), 3)})
    if ti + 1 < len(TAKES):
        buf.append(np.zeros(int(TAKE_GAP * SR), np.float32)); segs[-1]["dur"] = round(segs[-1]["dur"] + TAKE_GAP, 3); out_t += TAKE_GAP
v = np.concatenate(buf)
ow = wave.open(f"{sys.argv[3]}/voice.wav", "w"); ow.setnchannels(1); ow.setsampwidth(2); ow.setframerate(SR)
ow.writeframes(np.clip(v, -32768, 32767).astype(np.int16).tobytes()); ow.close()
# caption pages: up to 3 words / 16 chars, break on punctuation
pages, cur = [], []
for i, x in enumerate(words):
    cur.append(x); nx = words[i + 1] if i + 1 < len(words) else None
    if nx is None or len(cur) >= 3 or sum(len(y["w"]) for y in cur) >= 14 or re.search(r"[.,?!]$", x["w"]) or nx["s"] - x["e"] > 0.25 or nx["take"] != x["take"]:
        pages.append({"s": cur[0]["s"], "e": cur[-1]["e"], "words": [{"w": y["w"], "s": y["s"]} for y in cur]}); cur = []
for i, p in enumerate(pages):
    p["e"] = round(min(pages[i + 1]["s"] if i + 1 < len(pages) else out_t, p["e"] + 0.3), 3)
json.dump({"voiceDur": round(out_t, 3), "segs": segs, "words": words, "pages": pages}, open(sys.argv[4], "w"), indent=1)
print(f"voice {out_t:.2f}s, {len(segs)} segments, {len(words)} words, {len(pages)} pages")
