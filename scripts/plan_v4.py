"""Whey protein explainer (concentrate vs isolate vs hydrolyzed) — reference: slate / floating cards."""
SOURCES = ["c1", "c2", "c3"]          # c1 opening (video), c2 voice-over (audio only), c3 closing (video)
VIDEO_SOURCES = ["c1", "c3"]
REMOVE = []
TAIL = 0.6                            # c3 has ~1 s of picture after the last word before the CapCut outro

WORD_FIXES = [
    ("c1", 3.34, "hydrolyzed,"),
    ("c2", 9.16, ""), ("c2", 27.86, "absorption"), ("c2", 7.72, "fat"), ("c2", 17.36, "fat,"),
    ("c3", 9.66, "gets"), ("c3", 9.80, "you"), ("c3", 9.92, "that"), ("c3", 10.00, ""),
]

def S(src, t, kind, beats=(), sfx=None, vol=None, **props):
    d = dict(at=(src, t), kind=kind, props=props, beats=list(beats))
    if sfx: d["sfx"] = sfx
    if vol is not None: d["sfxVol"] = vol
    return d

SCENES = [
    # ---------- opening (c1): 3D tubs on top, speaker below → punch-in ----------
    S("c1", 0.0, "openTubs", beats=[("c1", 2.28), ("c1", 2.78), ("c1", 3.34)]),
    S("c1", 4.0, "openTitle", small="which one do you think?", big=["WHICH WHEY", "IS BEST?"], sfx="whoosh_slide"),
    S("c1", 5.12, "openPunch", chip="LET'S BREAK IT DOWN", sfx="whoosh_short_a", vol=0.3),
    # ---------- voice-over (c2) ----------
    S("c2", 0.0, "section", n=None, title="THE SIMPLE SCIENCE", accent="SCIENCE", sfx="whoosh_hit_a", vol=0.3),
    S("c2", 2.36, "tubHero", beats=[("c2", 3.5)], variant="concentrate", n=1, name="WHEY CONCENTRATE", chip="THE STANDARD", tone="yellow"),
    S("c2", 4.10, "macro", beats=[("c2", 4.62), ("c2", 7.72), ("c2", 8.18)], variant="concentrate",
      pct="70–80%", protein=75, fat=8, carbs=7, color="#E6A700"),
    S("c2", 8.96, "ratings", beats=[("c2", 9.52), ("c2", 11.12)], variant="concentrate",
      rows=[["TASTE", "★★★★★", "BEST"], ["PRICE", "$", "CHEAPEST"]]),
    S("c2", 12.54, "tubCode", beats=[("c2", 13.6), ("c2", 14.2)], variant="isolate", n=2, file="isolate.js",
      lines=["// Whey Isolate", "filter([", '  "fat", "carbs",', '  "lactose"', "]);"]),
    S("c2", 15.16, "macro", beats=[("c2", 15.68), ("c2", 17.36), ("c2", 17.94), ("c2", 18.52)], variant="isolate",
      pct="90%+", protein=92, fat=1, carbs=1, color="#2F80ED", zeros=["FAT ≈ 0", "CARBS ≈ 0", "LACTOSE ≈ 0"]),
    S("c2", 19.44, "ratings", beats=[("c2", 19.66), ("c2", 20.74)], variant="isolate",
      rows=[["PRICE", "$$", "COSTS MORE"], ["SENSITIVE STOMACH", "✓", "DAIRY-FRIENDLY"]]),
    S("c2", 23.64, "tubHero", beats=[("c2", 26.3)], variant="hydro", n=3, name="HYDROLYZED WHEY", chip="PRE-DIGESTED", tone="red"),
    S("c2", 27.10, "race", beats=[("c2", 27.4)]),
    S("c2", 29.05, "shelf", beats=[("c2", 29.4), ("c2", 29.66), ("c2", 30.1)]),
    # ---------- closing (c3): full-frame speaker, overlays above the head ----------
    S("c3", 0.70, "endPick", beats=[("c3", 3.34), ("c3", 4.82)]),
    S("c3", 5.36, "endChips", beats=[("c3", 6.92), ("c3", 8.76)], sfx="whoosh_slide", vol=0.22),
]

# (time, file, volume, offset)
SFX = [
    (("c1", 0.0), "whoosh_organic", 0.35, 0.0),
    (("c1", 2.28), "pop", 0.32, 0.0), (("c1", 2.78), "pop", 0.32, 0.0), (("c1", 3.34), "pop", 0.32, 0.0),
    (("c1", 4.1), "snap_perc", 0.3, 0.0),
    (("c2", 3.5), "snap_glassy", 0.35, 0.0),
    (("c2", 4.62), "riser", 0.18, -0.3), (("c2", 5.5), "ui_blip", 0.3, 0.0), (("c2", 7.72), "click", 0.3, 0.0), (("c2", 8.18), "click", 0.3, 0.0),
    (("c2", 9.52), "ping", 0.25, 0.0), (("c2", 11.12), "coins", 0.3, 0.0),
    (("c2", 13.6), "click", 0.16, 0.0), (("c2", 13.85), "click", 0.16, 0.0), (("c2", 14.1), "click", 0.16, 0.0), (("c2", 14.35), "click", 0.16, 0.0),
    (("c2", 15.68), "ui_blip", 0.3, 0.0), (("c2", 17.36), "pop", 0.3, 0.0), (("c2", 17.94), "pop", 0.3, 0.0), (("c2", 18.52), "pop", 0.3, 0.0),
    (("c2", 19.66), "coins", 0.3, 0.0), (("c2", 20.74), "snap_glassy", 0.32, 0.0),
    (("c2", 26.3), "glitch", 0.2, 0.0),
    (("c2", 27.4), "riser", 0.25, -0.2), (("c2", 28.3), "whoosh_hit_a", 0.3, 0.0),
    (("c2", 29.4), "pop", 0.3, 0.0), (("c2", 29.66), "pop", 0.3, 0.0), (("c2", 30.1), "boom", 0.3, 0.0),
    (("c3", 3.34), "snap_glassy", 0.35, 0.0), (("c3", 6.92), "click", 0.35, 0.0), (("c3", 8.76), "click", 0.35, 0.0),
]
