"""Timeline for Episode 2 (Muay Thai camp, 3D style).
Usage:
  build_ep2.py estimate <out_long.json> <out_short.json>            -> placeholder timing (no audio yet)
  build_ep2.py align <words_long.json> <words_short.json> <out_long.json> <out_short.json> -> timing from the recording
words.json = [{"line": n (1-based), "w": text, "s": sec, "e": sec}, ...] produced by align_ep2.py
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib
SC = importlib.import_module(os.environ.get("SCRIPT", "script_ep2"))

norm = lambda s: re.sub(r"[^a-z0-9-]", "", s.lower())
CUES = {
    "hook": ["Thailand", "beaches", "arrive", "holiday", "survive"],
    "run": ["Six", "alarm", "trainers", "run", "thirty-degree", "towel"],
    "pads": ["pads", "again", "kicks", "knees", "elbows", "noodles"],
    "shins": ["bruises", "shin", "foot", "tree", "tougher", "hurts"],
    "schedule": ["morning", "Eat", "Sleep", "afternoon", "Two", "tired"],
    "clinch": ["clinch", "lock", "knees", "neck", "half", "floor"],
    "spar": ["sparring", "controlled", "back", "guard", "push", "breathe"],
    "fight": ["fight", "stadium", "music", "Three", "short", "fire"],
    "takes": ["survive", "Cardio", "Shins", "discipline", "heart", "stop"],
    "cta": ["honest", "survive", "comments", "follow"],
}
SFX = {
    "hook": [("Thailand", "whoosh_slide", 0.3), ("holiday", "cartoon_down", 0.4), ("survive", "ring_bell", 0.45), ("survive", "boom", 0.3)],
    "run": [("Six", "tick", 0.5), ("alarm", "ringtone", 0.35), ("thirty-degree", "pop", 0.35), ("towel", "cartoon_impact", 0.3)],
    "pads": [("again", "whistle", 0.4), ("noodles", "cartoon_down", 0.35)],
    "shins": [("bruises", "punch_deep", 0.35), ("shin", "pop", 0.3), ("tree", "thud", 0.45), ("hurts", "body_hit", 0.4)],
    "schedule": [("morning", "pop", 0.3), ("Eat", "pop", 0.3), ("Sleep", "pop", 0.3), ("afternoon", "pop", 0.3), ("Two", "snap_glassy", 0.35)],
    "clinch": [("clinch", "whoosh_slide", 0.3), ("floor", "slam", 0.55)],
    "spar": [("sparring", "ring_bell", 0.35), ("push", "punch_deep", 0.55), ("breathe", "dizzy", 0.35)],
    "fight": [("stadium", "crowd_cheer", 0.32), ("Three", "ring_bell", 0.4), ("fire", "whoosh_fast", 0.35)],
    "takes": [("Cardio", "pop", 0.35), ("Shins", "pop", 0.35), ("discipline", "pop", 0.35), ("heart", "pop", 0.35)],
    "cta": [("survive", "ring_bell", 0.4), ("comments", "notif_a", 0.4), ("follow", "pop", 0.35)],
}

CUES = getattr(SC, "CUES", CUES)
SFX = getattr(SC, "SFX", SFX)

def estimate_words(lines):
    """placeholder: 2.55 words/s, line pauses from the script"""
    t, out = 0.4, []
    for n, (scene, text, pause) in enumerate(lines, 1):
        ws = text.split()
        for w in ws:
            d = 0.12 + 0.055 * len(w)
            out.append({"line": n, "w": w, "s": round(t, 3), "e": round(t + d, 3)})
            t += d + (0.25 if re.search(r"[.,?!:]$", w) else 0.04)
        t += pause
    return out

def build(lines, words, out_path):
    # map words to scenes via their line number
    by_line = {}
    for w in words:
        by_line.setdefault(w["line"], []).append(w)
    scenes = []
    for n, (scene, text, pause) in enumerate(lines, 1):
        ws = by_line.get(n, [])
        if not ws:
            continue
        if scenes and scenes[-1]["id"] == scene:
            scenes[-1]["words"] += ws
        else:
            scenes.append({"id": scene, "words": list(ws)})
    for i, s in enumerate(scenes):
        s["start"] = 0.0 if i == 0 else round(s["words"][0]["s"] - 0.2, 3)
    dur = round(words[-1]["e"] + 1.2, 3)
    for i, s in enumerate(scenes):
        s["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else dur
        s["cues"] = {}
        for c in CUES.get(s["id"], []):
            for w in s["words"]:
                if norm(w.get("cue", w["w"])).startswith(norm(c)):
                    s["cues"][c] = round(w["s"] - s["start"], 3)
                    break
    flat = [w for s in scenes for w in s["words"]]
    pages, cur = [], []
    for i, w in enumerate(flat):
        cur.append(w)
        nxt = flat[i + 1] if i + 1 < len(flat) else None
        if nxt is None or len(cur) >= 3 or sum(len(x["w"]) for x in cur) >= 18 or re.search(r"[.,?!:]$", w["w"]) or nxt["s"] - w["e"] > 0.3:
            pages.append({"start": cur[0]["s"], "end": cur[-1]["e"], "words": [{"text": x["w"], "start": x["s"], "end": x["e"]} for x in cur]})
            cur = []
    for i, p in enumerate(pages):
        p["end"] = round(min(pages[i + 1]["start"] if i + 1 < len(pages) else dur, p["end"] + 0.4), 3)
    sfx = []
    for s in scenes:
        for c, f, v in SFX.get(s["id"], []):
            if c in s["cues"]:
                sfx.append({"t": round(s["start"] + s["cues"][c], 3), "src": f, "volume": v})
        if s["start"] > 0:
            sfx.append({"t": round(s["start"] - 0.08, 3), "src": "whoosh_organic", "volume": 0.25})
        if s["id"] == "pads" and "pads" in CUES and "again" in CUES["pads"]:  # pad impacts on the kick loop (matches the Pads scene: kick every 0.8 s)
            k = 0.5
            while k < s["end"] - s["start"] - 0.6:
                sfx.append({"t": round(s["start"] + k + 0.22, 3), "src": "punch_deep", "volume": 0.35}); k += 0.8
    for s in scenes:
        s.pop("words")
    json.dump({"duration": dur, "scenes": scenes, "pages": pages, "sfx": sorted(sfx, key=lambda x: x["t"])}, open(out_path, "w"), indent=1)
    return dur, len(scenes), [(s["id"], [c for c in CUES[s["id"]] if c not in s["cues"]]) for s in scenes]

if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "estimate":
        wl = estimate_words(SC.LONG)
        out_long, out_short = sys.argv[2], sys.argv[3]
    else:  # align <words_long.json> <words_short.json> <out_long> <out_short>  (already edited timelines)
        wl = json.load(open(sys.argv[2]))
        print("long", build(SC.LONG, wl, sys.argv[4]))
        if len(sys.argv) > 5:
            print("short", build(SC.LONG, json.load(open(sys.argv[3])), sys.argv[5]))
        sys.exit(0)
    print("long", build(SC.LONG, wl, out_long))
    # short: keep only SHORT_LINES, re-timed back-to-back
    keep = set(SC.SHORT_LINES)
    sw, t = [], 0.4
    for n in SC.SHORT_LINES:
        ws = [w for w in wl if w["line"] == n]
        if not ws: continue
        off = t - ws[0]["s"]
        for w in ws:
            sw.append({**w, "s": round(w["s"] + off, 3), "e": round(w["e"] + off, 3), "src_s": w["s"]})
        t = sw[-1]["e"] + SC.LONG[n - 1][2] * 0.8
    json.dump(sw, open(out_short + ".words.json", "w"))
    print("short", build(SC.LONG, sw, out_short))
