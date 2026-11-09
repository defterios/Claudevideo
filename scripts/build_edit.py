"""
Build the edit decision list for the Remotion composition.

Inputs : transcript JSON (faster-whisper, word timestamps) + scripts/edit_plan.py
Outputs: src/data/edit.json            (segments, caption pages, overlays, sfx — all in OUTPUT time)
         public/src/voice_edit.wav     (cleaned voice, cut + crossfaded to match the video segments)

Usage: python3 scripts/build_edit.py <transcript.json>
"""
import json, os, re, sys, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import edit_plan as P  # noqa: E402

FPS = 30
MERGE_GAP = 0.42   # pauses shorter than this stay untouched (natural rhythm)
PAD_IN = 0.07      # breath before a phrase
PAD_OUT = 0.16     # tail after a phrase (whisper word ends are early-ish)

def q(t):  # snap to frame grid so audio + video cuts line up exactly
    return round(t * FPS) / FPS

words = []
for seg in json.load(open(sys.argv[1])):
    for w in seg["words"]:
        raw = w["w"]
        # whisper splits "25-40%" into "25" "-40" "%": glue tokens that carry no leading space
        if words and raw and not raw.startswith(" ") and raw.strip():
            words[-1]["text"] += raw.strip()
            words[-1]["e"] = w["e"]
        elif raw.strip():
            words.append({"text": raw.strip(), "s": w["s"], "e": w["e"]})
# caption text fixes, anchored by the word start time (audio is never touched)
for at, new in P.WORD_FIXES:
    w = min(words, key=lambda x: abs(x["s"] - at))
    assert abs(w["s"] - at) < 0.05, (at, new, w)
    w["text"] = new

def removed(s, e):
    return any(s < re_ and e > rs for rs, re_ in P.REMOVE)

# 1) speech islands
islands = []
for w in words:
    if removed(w["s"], w["e"]):
        continue
    if islands and w["s"] - islands[-1]["e"] < MERGE_GAP and not removed(islands[-1]["e"], w["s"]):
        islands[-1]["e"] = w["e"]
        islands[-1]["words"].append(w)
    else:
        islands.append({"s": w["s"], "e": w["e"], "words": [w]})

def padded(isl, prev_e, next_s):
    s = max(isl["s"] - PAD_IN, (prev_e + isl["s"]) / 2 if prev_e is not None else 0)
    e = min(isl["e"] + PAD_OUT, (isl["e"] + next_s) / 2 if next_s is not None else 1e9)
    return q(s), q(e)

pieces = []  # (srcStart, srcEnd, words, kind)
for i, isl in enumerate(islands):
    pe = islands[i - 1]["e"] if i else None
    ns = islands[i + 1]["s"] if i + 1 < len(islands) else None
    s, e = padded(isl, pe, ns)
    for rs, re_ in P.REMOVE:  # never let padding leak back into a removed range
        if rs <= s < re_:
            s = q(re_ + 0.01)
        if rs < e <= re_:
            e = q(rs)
    if e - s > 0.1:
        pieces.append([s, e, isl["words"], "main"])

# 2) hook (cold open) pieces go first, cut from the same source
hook_pieces = []
for hs, he in P.HOOK:
    ws = [w for w in words if w["s"] >= hs - 0.01 and w["e"] <= he + 0.01]
    hook_pieces.append([q(hs), q(he), ws, "hook"])
ordered = hook_pieces + pieces

# 3) lay out on the output timeline
segments, out_words, t = [], [], 0.0
zoom_cycle = P.ZOOM_CYCLE
zi = 0
for k, (s, e, ws, kind) in enumerate(ordered):
    jump = k == 0 or kind != ordered[k - 1][3] or abs(s - ordered[k - 1][1]) > 0.02
    if jump and k:
        zi += 1
    z = zoom_cycle[zi % len(zoom_cycle)]
    if segments and not jump:
        segments[-1]["srcEnd"] = e  # contiguous: extend previous shot
    else:
        segments.append({"srcStart": s, "srcEnd": e, "outStart": round(t, 4), "zoom": z, "kind": kind})
    for w in ws:
        if not w["text"]:
            continue
        out_words.append({"text": w["text"], "start": round(t + (w["s"] - s), 3), "end": round(t + (w["e"] - s), 3)})
    ordered[k].append(t)
    t += e - s
duration = round(t, 3)

def to_out(src_t, kind="main"):
    """Map a source timestamp to output time (nearest kept piece)."""
    best = None
    for s, e, _, k, o in ordered:
        if k != kind:
            continue
        if s - 0.001 <= src_t <= e + 0.001:
            return round(o + (src_t - s), 3)
        d = min(abs(src_t - s), abs(src_t - e))
        cand = o if src_t < s else o + (e - s)
        if best is None or d < best[0]:
            best = (d, cand)
    return round(best[1], 3)

# 4) caption pages (≤ 3 words / 16 chars, break on punctuation or gaps)
pages, cur = [], []
for i, w in enumerate(out_words):
    cur.append(w)
    nxt = out_words[i + 1] if i + 1 < len(out_words) else None
    chars = sum(len(x["text"]) for x in cur)
    brk = (nxt is None or len(cur) >= 3 or chars >= 16 or re.search(r"[.,?!]$", w["text"])
           or (nxt and nxt["start"] - w["end"] > 0.3))
    if brk:
        pages.append({"start": cur[0]["start"], "end": cur[-1]["end"], "words": [dict(x) for x in cur]})
        cur = []
for i, p in enumerate(pages):  # hold each page until the next one starts (no flicker)
    nxt = pages[i + 1]["start"] if i + 1 < len(pages) else duration
    p["end"] = round(min(nxt, p["end"] + 0.6), 3)
    for w in p["words"]:
        w["text"] = re.sub(r"[,.]$", "", w["text"])

# 5) overlays / sfx / flashes authored in SOURCE time -> output time
overlays = []
for o in P.OVERLAYS:
    o = dict(o)
    kind = o.pop("kind", "main")
    st = to_out(o["start"], kind)
    en = to_out(o["end"], kind) if "end" in o else st + o.pop("dur")
    o["start"], o["end"] = st, round(en, 3)
    overlays.append(o)
sfx = []
for s in P.SFX:
    sfx.append({"t": round(to_out(s[0], s[3] if len(s) > 3 else "main") + (s[4] if len(s) > 4 else 0), 3), "src": s[1], "volume": s[2]})
# automatic: soft whoosh on the cold-open -> intro cut
flashes = [to_out(t, k) for t, k in P.FLASHES]
caption_hidden = [[o["start"], o["end"]] for o in overlays if o["type"] == "cta"]

json.dump({"duration": duration, "segments": segments, "pages": pages, "overlays": overlays, "sfx": sfx,
           "flashes": flashes, "captionHidden": caption_hidden},
          open(os.path.join(ROOT, "src/data/edit.json"), "w"), ensure_ascii=False, indent=1)

# 6) render the voice track with 12 ms crossfades at every cut
w = wave.open(os.path.join(ROOT, "public/src/voice.wav"))
sr, ch = w.getframerate(), w.getnchannels()
a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, ch).astype(np.float32)
xf = int(0.012 * sr)
out = np.zeros((int(duration * sr) + sr, ch), np.float32)
for s, e, _, k, o in ordered:
    seg = a[int(s * sr): int(e * sr)].copy()
    n = len(seg)
    if n > 2 * xf:
        ramp = np.linspace(0, 1, xf)[:, None]
        seg[:xf] *= ramp
        seg[-xf:] *= ramp[::-1]
    i0 = int(round(o * sr))
    out[i0:i0 + n] += seg[: len(out) - i0]
out = out[: int(duration * sr)]
ow = wave.open(os.path.join(ROOT, "public/src/voice_edit.wav"), "w")
ow.setnchannels(ch); ow.setsampwidth(2); ow.setframerate(sr)
ow.writeframes(np.clip(out, -32768, 32767).astype(np.int16).tobytes())
ow.close()

src_total = words[-1]["e"]
print(f"source {src_total:.1f}s -> edit {duration:.1f}s  ({len(segments)} shots, {len(pages)} caption pages, "
      f"{len(overlays)} overlays, {len(sfx)} sfx)")
