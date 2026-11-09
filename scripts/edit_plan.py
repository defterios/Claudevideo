"""
Creative plan for the edit. All times are SOURCE times (seconds in the raw clip),
build_edit.py maps them onto the cut timeline automatically.
"""

# ---- cuts -------------------------------------------------------------------
# Long pauses are removed automatically (see MERGE_GAP in build_edit.py).
REMOVE = [
    (0.0, 1.03),      # "Alright, so" — slow start
    (328.3, 334.62),  # first take of "here's my final takeaway…" (retake follows right after)
]

# Cold open: strongest, most shocking line of the video, played first.
HOOK = [(125.40, 132.75)]  # "Up to 25-40% of the weight loss on GLP-1 medications can come from lean muscle mass, not fat."

ZOOM_CYCLE = [1.0, 1.1, 1.03, 1.13]

# ---- caption fixes (start time of word, corrected text; "" hides the word) ----
WORD_FIXES = [
    (14.72, "weight"), (15.08, "loss game."),
    (77.0, "emptying"),
    (157.48, "strip"), (159.68, "plateau"), (159.98, ""),
    (203.04, "shot"),
    (244.06, "to"), (244.74, "a"), (245.08, "mandatory"), (245.24, ""), (245.90, "shield."),
    (266.62, "resistance"),
    (271.34, "overload"), (271.66, ""),
    (307.98, "DEXA"), (308.82, "or InBody,"),
]

# ---- motion graphics ----------------------------------------------------------
# top zone = above the head, chip = left of the face. Nothing ever covers the face.
OVERLAYS = [
    # hook
    dict(kind="hook", type="hook", start=125.45, end=132.75, line1="⚠️ THE HIDDEN CATCH", line2="UP TO 40% = MUSCLE"),
    # intro
    dict(type="title", start=4.3, end=8.3, kicker="Biggest thing in fitness", text="Ozempic & Mounjaro"),
    dict(type="chip", start=8.6, end=15.4, emoji="💉", text="GLP-1 + GIP"),
    dict(type="stat", start=16.0, end=20.7, from_=0, to=30, suffix="KG", label="lost in record time"),
    dict(type="chip", start=21.0, end=26.0, emoji="🏋️", text="Coach's view"),
    dict(type="chip", start=38.0, end=41.5, emoji="✅", text="They work"),
    dict(type="title", start=42.4, end=48.4, kicker="The real question", text="What weight are you losing?", color="#FFD60A"),
    # science
    dict(type="compare", start=49.3, end=57.2, leftValue="OZEMPIC", leftLabel="semaglutide", rightValue="MOUNJARO", rightLabel="tirzepatide"),
    dict(type="title", start=67.9, end=72.7, kicker="Ozempic", text="1 hormone: GLP-1"),
    dict(type="chip", start=72.8, end=76.4, emoji="🧠", text="You feel full"),
    dict(type="chip", start=76.5, end=80.3, emoji="🍽️", text="Eat less"),
    dict(type="title", start=83.6, end=89.0, kicker="Mounjaro", text="2 receptors: GLP-1 + GIP"),
    dict(type="chip", start=89.2, end=96.9, emoji="📉", text="More weight lost"),
    dict(type="chip", start=99.0, end=103.2, emoji="👑", text="Scale winner"),
    dict(type="title", start=104.3, end=107.9, kicker="But trainers care about", text="Body composition", color="#FFD60A"),
    # the catch
    dict(type="title", start=116.2, end=120.3, kicker="The hidden catch", text="Muscle & bone loss", color="#FF3B30"),
    dict(type="stat", start=125.3, end=132.7, from_=0, to=40, suffix="%", label="of weight lost can be muscle", color="#FF3B30"),
    dict(type="compare", start=135.8, end=141.3, leftValue="10 KG", leftLabel="lost on the scale", rightValue="3-4 KG", rightLabel="was muscle"),
    dict(type="chip", start=143.2, end=146.4, emoji="⚙️", text="Metabolism wrecked"),
    dict(type="title", start=150.8, end=153.2, text="Metabolic slowdown"),
    dict(type="chip", start=162.7, end=166.2, emoji="📈", text="Weight regain"),
    dict(type="title", start=167.0, end=170.6, kicker="Risk", text="Sarcopenia", color="#FF3B30"),
    dict(type="chip", start=171.0, end=176.3, emoji="⏳", text="40+? Extra risk"),
    dict(type="title", start=180.8, end=185.5, text="Joint pain. Weakness. Less mobility.", color="#FFD60A"),
    # trainers
    dict(type="title", start=192.9, end=197.0, text="Are trainers out of a job?"),
    dict(type="chip", start=202.1, end=206.7, emoji="💉", text="Fat-melting shot?"),
    dict(type="title", start=208.3, end=213.2, kicker="Reality", text="More essential than ever", color="#FFD60A"),
    dict(type="compare", start=217.6, end=222.8, leftValue="APPETITE", leftLabel="drug handles", rightValue="BODY", rightLabel="we protect"),
    dict(type="title", start=223.3, end=230.0, text="You can't inject:"),
    dict(type="chip", start=223.6, end=225.0, emoji="💪", text="Muscle"),
    dict(type="chip", start=225.0, end=227.2, emoji="🦴", text="Bone density"),
    dict(type="chip", start=227.2, end=230.0, emoji="🏃", text="Movement"),
    dict(type="title", start=242.1, end=246.7, kicker="On GLP-1?", text="Lifting = mandatory", color="#FFD60A"),
    # playbook
    dict(type="title", start=252.5, end=256.6, kicker="GLP-1 clients", text="Trainer's game plan"),
    dict(type="title", start=261.8, end=264.6, text="Non-negotiable", color="#FF3B30"),
    dict(type="step", start=264.8, end=270.4, n=1, total=3, text="Heavy resistance training"),
    dict(type="chip", start=270.5, end=278.0, emoji="🏋️", text="2-3x / week"),
    dict(type="step", start=278.6, end=286.3, n=2, total=3, text="Aggressive protein"),
    dict(type="stat", start=291.2, end=296.0, from_=2000, to=800, suffix="KCAL", label="a day = starving muscle", color="#FF3B30"),
    dict(type="stat", start=296.0, end=304.0, from_=1.6, to=2.2, prefix="1.6–", suffix="G/KG", label="protein per kg bodyweight", color="#30D158"),
    dict(type="chip", start=304.0, end=306.4, emoji="🥩", text="Protect muscle"),
    dict(type="step", start=307.0, end=310.6, n=3, total=3, text="Track DEXA / InBody"),
    dict(type="compare", start=311.0, end=318.9, leftValue="LEAN", leftLabel="tissue", rightValue="FAT", rightLabel="mass"),
    # outro
    dict(type="title", start=334.7, end=338.4, kicker="Final takeaway", text="Not a magic eraser", color="#FFD60A"),
    dict(type="chip", start=338.66, end=340.1, emoji="🚫", text="Not cheating"),
    dict(type="chip", start=340.3, end=342.7, emoji="💊", text="Powerful tool"),
    dict(type="title", start=344.4, end=348.3, kicker="GLP-1 without lifting", text="Supercar. No oil.", color="#FF3B30"),
    dict(type="chip", start=349.4, end=351.6, emoji="💥", text="Breakdown"),
    dict(type="title", start=353.8, end=359.6, kicker="Your turn", text="Did your doctor mention lifting?"),
    dict(type="chip", start=360.2, end=361.8, emoji="🤔", text="Or just eat less?"),
    dict(type="cta", start=362.3, end=365.6, text="Comment below 👇", sub="Follow for more coaching tips"),
]
for o in OVERLAYS:  # 'from' is a python keyword
    if "from_" in o:
        o["from"] = o.pop("from_")

# ---- sound design ------------------------------------------------------------
# (source time, file, volume[, kind[, offset seconds]])
_AUTO = {"title": ("whoosh_slide", 0.42), "chip": ("pop", 0.38), "stat": ("snap_glassy", 0.45),
         "compare": ("whoosh_organic", 0.45), "step": ("snap_perc", 0.5), "cta": ("notif_a", 0.4),
         "hook": ("whoosh_hit_a", 0.5)}
SFX = []
for o in OVERLAYS:
    f, v = _AUTO[o["type"]]
    SFX.append((o["start"], f, v, o.get("kind", "main"), -0.05))

SFX += [
    (125.40, "boom", 0.55, "hook", 0.0),              # cold-open impact
    (132.10, "riser", 0.35, "hook", 0.0),             # build into the intro
    (1.05, "whoosh_short_a", 0.5, "main", -0.12),     # hook -> intro transition
    (16.3, "ui_blip", 0.35), (125.6, "ui_blip", 0.3),  # counters ticking
    (116.2, "boom", 0.35),                            # "hidden catch"
    (135.9, "glitch", 0.25), (143.3, "glitch", 0.3),  # wrecked metabolism
    (167.0, "ping", 0.35),
    (208.3, "whoosh_hit_a", 0.35),
    (223.6, "click", 0.4), (225.0, "click", 0.4), (227.2, "click", 0.4),
    (291.2, "glitch", 0.25), (296.0, "coins", 0.3),
    (344.4, "riser", 0.3, "main", -1.0), (349.4, "boom", 0.4),
    (307.0, "camera_a", 0.35),
]

# white flash on big section changes
FLASHES = [(1.05, "main"), (116.2, "main"), (252.5, "main"), (334.7, "main")]
