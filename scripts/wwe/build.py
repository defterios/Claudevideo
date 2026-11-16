"""Build timeline JSON for the WWE survival video. Usage: build.py <lines.json> <whisper.json> <out.json>"""
import json, re, sys

lines = json.load(open(sys.argv[1]))
words = [{"text": w["w"].strip(), "s": w["s"], "e": w["e"]} for seg in json.load(open(sys.argv[2])) for w in seg["words"] if w["w"].strip()]
dur = lines["duration"] + 0.6
norm = lambda s: re.sub(r"[^a-z0-9-]", "", s.lower())

# scenes = runs of lines with the same scene id
scenes = []
for ln in lines["lines"]:
    if scenes and scenes[-1]["id"] == ln["scene"]:
        scenes[-1]["lineEnd"] = ln["end"]
    else:
        scenes.append({"id": ln["scene"], "start": ln["start"] - (0.15 if scenes else ln["start"]), "lineEnd": ln["end"]})
for i, s in enumerate(scenes):
    s["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else dur

CUES = {
    "hook": ["call", "tryout", "never", "survive"],
    "pc": ["Orlando", "bigger", "College", "Olympians", "Bodybuilders", "there's"],
    "bump": ["fall", "bump", "Chin", "arms", "flat", "spreads"],
    "ring": ["hit", "trampoline", "steel", "wooden", "foam", "table"],
    "bumps": ["dozens", "purple", "sit", "groaning"],
    "ropes": ["ropes", "steel", "rubber", "tape", "ten", "bruises", "bruised"],
    "cardio": ["cardio", "fifteen", "twenty", "thirty", "fire", "again", "smile"],
    "promo": ["promo", "microphone", "mic", "camera", "care", "shakes", "forget", "stare"],
    "live": ["live", "music", "mistake", "heart", "fans"],
    "road": ["main", "road", "city", "Airports", "hotel", "gyms", "arenas", "off-season"],
    "takes": ["body", "Cardio", "confidence", "mindset", "back"],
    "cta": ["survive", "comments", "comment", "follow"],
}
for s in scenes:
    s["cues"] = {}
    for c in CUES.get(s["id"], []):
        for w in words:
            if s["start"] - 0.05 <= w["s"] < s["end"] and norm(w["text"]).startswith(norm(c)):
                s["cues"][c] = round(w["s"] - s["start"], 3)
                break
    # aliases used by short script wording
    al = {"bruises": "bruised", "microphone": "mic", "comments": "comment", "music": "fans"}
    for a, b in al.items():
        if a not in s["cues"] and b in s["cues"]:
            s["cues"][a] = s["cues"][b]

# captions
pages, cur = [], []
for i, w in enumerate(words):
    cur.append(w)
    nxt = words[i + 1] if i + 1 < len(words) else None
    if nxt is None or len(cur) >= 4 or sum(len(x["text"]) for x in cur) >= 22 or re.search(r"[.,?!:]$", w["text"]) or nxt["s"] - w["e"] > 0.3:
        pages.append({"start": cur[0]["s"], "end": cur[-1]["e"], "words": [{"text": x["text"], "start": x["s"], "end": x["e"]} for x in cur]})
        cur = []
for i, p in enumerate(pages):
    p["end"] = round(min(pages[i + 1]["start"] if i + 1 < len(pages) else dur, p["end"] + 0.4), 3)

# sound design
SFX = {
    "hook": [(0.0, "ringtone", 0.45), ("tryout", "pop", 0.4), ("never", "cartoon_down", 0.45), ("survive", "ring_bell", 0.5), ("survive", "boom", 0.35)],
    "pc": [(0.0, "whoosh_slide", 0.3), ("Orlando", "whoosh_slide", 0.35), ("College", "pop", 0.35), ("Olympians", "pop", 0.35), ("Bodybuilders", "pop", 0.35), ("there's", "cartoon_impact", 0.35)],
    "bump": [("fall", "whistle", 0.35), ("Chin", "click", 0.4), ("arms", "click", 0.4), ("flat", "slam", 0.6), ("flat", "punch_deep", 0.4)],
    "ring": [("hit", "body_hit", 0.55), ("hit", "boom", 0.4), ("trampoline", "cartoon_down", 0.35), ("steel", "pop", 0.35), ("wooden", "pop", 0.35), ("foam", "pop", 0.35), ("table", "thud", 0.5)],
    "bumps": [("purple", "dizzy", 0.4), ("groaning", "punch_deep", 0.4), ("groaning", "cartoon_impact", 0.3)],
    "ropes": [("steel", "pop", 0.3), ("rubber", "pop", 0.3), ("tape", "pop", 0.3), ("ten", "tick", 0.4), ("bruises", "body_hit", 0.5)],
    "cardio": [("fifteen", "pop", 0.35), ("twenty", "pop", 0.35), ("thirty", "pop", 0.4), ("fire", "whoosh_fast", 0.4), ("again", "whistle", 0.45), ("smile", "ping", 0.35)],
    "promo": [("microphone", "click", 0.4), ("camera", "ui_blip", 0.35), ("shakes", "mic_feedback", 0.22), ("forget", "cartoon_down", 0.35)],
    "live": [("music", "crowd_cheer", 0.32), ("mistake", "slam", 0.55), ("mistake", "cartoon_impact", 0.3)],
    "road": [("main", "ring_bell", 0.4), ("city", "airplane", 0.3), ("Airports", "pop", 0.35), ("hotel", "pop", 0.35), ("gyms", "pop", 0.35), ("arenas", "pop", 0.35), ("off-season", "thud", 0.5)],
    "takes": [("body", "pop", 0.35), ("Cardio", "pop", 0.35), ("confidence", "pop", 0.35), ("mindset", "pop", 0.35), ("back", "whoosh_hit_a", 0.35)],
    "cta": [("survive", "ring_bell", 0.45), ("comments", "notif_a", 0.4), ("follow", "pop", 0.35)],
}
sfx = []
for s in scenes:
    for at, f, v in SFX.get(s["id"], []):
        t = at if isinstance(at, float) else s["cues"].get(at)
        if t is not None:
            sfx.append({"t": round(s["start"] + t, 3), "src": f, "volume": v})
    if s["id"] != "hook":
        sfx.append({"t": round(s["start"] - 0.08, 3), "src": "whoosh_organic", "volume": 0.25})
    local_end = s["end"] - s["start"]
    if s["id"] == "bumps":  # one slam per bump in the loop (matches Bumps component math)
        stop = s["cues"].get("purple", 0.55 * local_end) - 0.3
        n = 0
        while (n + 0.4) / 1.25 < stop:
            sfx.append({"t": round(s["start"] + (n + 0.4) / 1.25, 3), "src": "slam", "volume": 0.4}); n += 1
    if s["id"] == "ropes":  # rope bounces (matches Ropes component math)
        stop = s["cues"].get("bruises", 0.88 * local_end) - 0.4
        n = 0
        while True:
            hits = [(n + 0.44) * 1.6, (n + 0.94) * 1.6]
            if hits[0] > stop: break
            for h in hits:
                if h < stop: sfx.append({"t": round(s["start"] + h, 3), "src": "boing", "volume": 0.3})
            n += 1
    if s["id"] == "live" and "heart" in s["cues"]:  # heartbeat
        for k in range(8):
            sfx.append({"t": round(s["start"] + s["cues"]["heart"] + k * 0.36, 3), "src": "thud", "volume": 0.35 if k % 2 == 0 else 0.22})

json.dump({"duration": round(dur, 3), "scenes": scenes, "pages": pages, "sfx": sorted(sfx, key=lambda x: x["t"])}, open(sys.argv[3], "w"), indent=1)
print(f"{dur:.1f}s  {len(scenes)} scenes  {len(pages)} pages  {len(sfx)} sfx")
for s in scenes:
    missing = [c for c in CUES.get(s["id"], []) if c not in s["cues"]]
    print(f"  {s['id']:7s} {s['start']:6.2f}-{s['end']:6.2f}  missing cues: {missing}")
