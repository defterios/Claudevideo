"""Align the creator's voice-over to the Ep2 script and build edited voice tracks.
Usage: align_ep2.py <whisper.json> <studio.wav> <out_dir>
Writes: words_long.json, words_short.json (script words with EDITED times + line no.), voice_long.wav, voice_short.wav"""
import json, re, sys, os, wave, difflib
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib
SC = importlib.import_module(os.environ.get("SCRIPT", "script_ep2"))

# spans to drop (source seconds) and caption fixes for mis-heard words — per recording, via env
REMOVE = json.loads(os.environ.get("REMOVE", "[]"))
CAPFIX = json.loads(os.environ.get("CAPFIX", "{}"))
MERGE, PAD_IN, PAD_OUT = 0.34, 0.06, 0.14
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower().replace("six", "6").replace("thirty", "30").replace("one", "1").replace("two", "2").replace("three", "3").replace("four", "4").replace("ten", "10").replace("fifteen", "15").replace("twenty", "20"))

hyp = [w for s in json.load(open(sys.argv[1])) for w in s["words"] if w["w"].strip() and not any(a <= w["s"] < b for a, b in REMOVE)]
ref = []  # (line, word)
for n, (_, text, _) in enumerate(SC.LONG, 1):
    ref += [(n, x) for x in text.replace("...", "… ").replace(":", ": ").split()]
H = [norm(w["w"]) for w in hyp]
R = [norm(x) for _, x in ref]
times = [None] * len(ref)
spoken = [None] * len(ref)  # what was actually said at that script position (for captions)
used_hyp = set()
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, R, H, autojunk=False).get_opcodes():
    if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
        for k in range(i2 - i1):
            times[i1 + k] = (hyp[j1 + k]["s"], hyp[j1 + k]["e"])
            sp = hyp[j1 + k]["w"].strip()
            core = re.sub(r"[^A-Za-z0-9-]", "", sp)
            spoken[i1 + k] = sp.replace(core, CAPFIX[core.lower()]) if core.lower() in CAPFIX else sp
            used_hyp.add(j1 + k)
    elif tag == "replace":  # unequal blocks: spread the spoken span over the script words
        used_hyp.update(range(j1, j2))
        s0, e0 = hyp[j1]["s"], hyp[j2 - 1]["e"]
        for k in range(i2 - i1):
            times[i1 + k] = (s0 + (e0 - s0) * k / (i2 - i1), s0 + (e0 - s0) * (k + 1) / (i2 - i1))
# interpolate anything still missing between neighbours
for i, t in enumerate(times):
    if t is None:
        prev = next((times[j] for j in range(i - 1, -1, -1) if times[j]), (0, 0))
        nxt = next((times[j] for j in range(i + 1, len(times)) if times[j]), (prev[1] + 0.3, prev[1] + 0.3))
        times[i] = (prev[1], min(nxt[0], prev[1] + 0.3))
matched = sum(1 for t in times if t)
print(f"aligned {matched}/{len(ref)} script words")

w = wave.open(sys.argv[2]); SR = w.getframerate()
audio = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32)

# 10 ms energy envelope of the studio track, used to find silences INSIDE spoken spans
_mono = audio.mean(1) / 32768
_hop = int(0.01 * SR)
_env = 20 * np.log10(np.sqrt(np.convolve(_mono[: len(_mono) // _hop * _hop].reshape(-1, _hop).__pow__(2).mean(1), np.ones(3) / 3, "same")) + 1e-9)
SIL_DB, SIL_MIN, KEEP = -36.0, 0.2, 0.07

def split_silence(ps, pe):
    """split [ps,pe] at internal silences longer than SIL_MIN, keeping KEEP s of air each side"""
    i0, i1 = int(ps / 0.01), int(pe / 0.01)
    quiet = _env[i0:i1] < SIL_DB
    parts, start, k = [], ps, 0
    while k < len(quiet):
        if quiet[k]:
            j = k
            while j < len(quiet) and quiet[j]: j += 1
            a, b2 = ps + k * 0.01, ps + j * 0.01
            if b2 - a >= SIL_MIN and a > ps + 0.05 and b2 < pe - 0.05:
                parts.append((start, a + KEEP)); start = b2 - 0.12  # generous pre-roll so consonant onsets survive
            k = j
        else:
            k += 1
    parts.append((start, pe))
    return parts

def trim(ps, pe):
    """snap span edges to where the voice really starts/ends: grow outward over adjacent voiced frames
    (whisper word starts are often late), then shrink inward over leading/trailing silence"""
    i0, i1 = int(ps / 0.01), int(pe / 0.01)
    lo = i0
    while lo > max(0, i0 - 45) and _env[lo - 1] > SIL_DB:  # voiced right before the span -> include it
        lo -= 1
    hi = i1
    while hi < min(len(_env), i1 + 30) and _env[hi] > SIL_DB:
        hi += 1
    loud = np.where(_env[lo:hi] > SIL_DB)[0]
    if len(loud) == 0: return ps, pe
    return lo * 0.01 + loud[0] * 0.01 - 0.09, lo * 0.01 + loud[-1] * 0.01 + 0.1

def edit(lines, name):
    out_words, pieces, t = [], [], 0.12
    prev_scene = None
    for n in lines:
        scene = SC.LONG[n - 1][0]
        if prev_scene is not None:
            t += 0.2 if scene != prev_scene else 0.08   # gap between sentences
        prev_scene = scene
        idx = [i for i, (ln, _) in enumerate(ref) if ln == n]
        items = [(times[i][0], times[i][1], spoken[i] or ref[i][1], ref[i][1]) for i in idx]
        le0 = max(x[1] for x in items)
        # extra spoken words right after the line (e.g. the shouted "Again!") belong to it
        for j, hw in enumerate(hyp):
            if j not in used_hyp and le0 - 0.05 < hw["s"] < le0 + 0.9:
                items.append((hw["s"], hw["e"], hw["w"].strip(), "")); used_hyp.add(j)
        ls = min(x[0] for x in items) - PAD_IN
        le = max(x[1] for x in items) + PAD_OUT
        ls, le = trim(ls, le)
        parts = split_silence(ls, le)
        for ws, we, txt, cue in items:  # each word goes to the part it overlaps most (never dropped)
            k = max(range(len(parts)), key=lambda q: min(we, parts[q][1]) - max(ws, parts[q][0]))
            ps = parts[k][0]
            off = t + sum(p2 - p1 for p1, p2 in parts[:k])
            out_words.append({"line": n, "w": txt, "cue": cue, "s": round(off + max(0, ws - ps), 3), "e": round(off + max(0.05, min(parts[k][1], we) - ps), 3)})
        for ps, pe in parts:
            pieces.append((ps, pe, t)); t += pe - ps
    total = t + 0.9
    buf = np.zeros((int(total * SR), 2), np.float32); xf = int(0.012 * SR)
    for ps, pe, at in pieces:
        seg = audio[int(ps * SR): int(pe * SR)].copy()
        if len(seg) > 2 * xf:
            r = np.linspace(0, 1, xf)[:, None]; seg[:xf] *= r; seg[-xf:] *= r[::-1]
        i0 = int(at * SR); buf[i0:i0 + len(seg)] += seg[: len(buf) - i0]
    ow = wave.open(os.path.join(sys.argv[3], f"voice_{name}.wav"), "w"); ow.setnchannels(2); ow.setsampwidth(2); ow.setframerate(SR)
    ow.writeframes(np.clip(buf, -32768, 32767).astype(np.int16).tobytes()); ow.close()
    out_words.sort(key=lambda w: w["s"])
    json.dump(out_words, open(os.path.join(sys.argv[3], f"words_{name}.json"), "w"))
    print(name, f"{total:.1f}s", len(out_words), "words", len(pieces), "pieces")

edit(list(range(1, len(SC.LONG) + 1)), "long")
if hasattr(SC, "SHORT_LINES"): edit(SC.SHORT_LINES, "short")
