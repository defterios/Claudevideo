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

# ---- motion graphics (reference style) -------------------------------------
# kinetic = blur-reveal type in the negative space above the head
# scene   = navy stage + speaker in a PiP card (face always visible) + animated graphic below
def K(start, end, *lines, kind="main"):
    return dict(kind=kind, type="kinetic", start=start, end=end,
                lines=[dict(t=t, s=sz, **({"c": c} if c else {})) for sz, t, c in lines])

def S(start, end, scene, beats=(), **props):
    return dict(type="scene", start=start, end=end, scene=scene, beats=list(beats), props=props)

sm = lambda t, c=None: ("sm", t, c)
lg = lambda t, c=None: ("lg", t, c)
xl = lambda t, c=None: ("xl", t, c)

PLAYBOOK = [
    dict(icon="1", label="Heavy lifting", sub="2–3× / week", color="red"),
    dict(icon="2", label="Protein", sub="1.6–2.2 g/kg", color="gold"),
    dict(icon="3", label="Track body", sub="DEXA / InBody", color="cyan"),
]

OVERLAYS = [
    # cold open
    K(125.6, 132.75, xl("40%", "red"), sm("of GLP-1 weight loss can be"), lg("muscle."), kind="hook"),
    # intro
    K(4.3, 8.0, sm("The biggest thing in fitness"), lg("Ozempic &"), lg("Mounjaro", "cyan")),
    K(8.6, 15.4, sm("GLP-1 + dual-action GIP"), lg("changing"), lg("the game.", "gold")),
    K(16.0, 20.6, sm("People are dropping"), xl("30 KG", "gold"), sm("in record time")),
    K(29.6, 33.3, sm("As a coach, my reaction"), lg("isn't hate.")),
    K(38.0, 41.6, sm("The clinical data says"), lg("they work.", "green")),
    K(42.4, 48.4, sm("The real question"), lg("what weight are"), lg("you losing?", "red")),
    # science
    S(49.3, 63.0, "cards", heading="semaglutide vs tirzepatide",
      cards=[dict(icon="1", label="Ozempic", sub="1 receptor", color="cyan"),
             dict(icon="2", label="Mounjaro", sub="2 receptors", color="gold")]),
    S(67.9, 80.3, "receptors", beats=[74.5], drug="Ozempic", sub="semaglutide", lit=["GLP-1"], result="You feel full"),
    S(83.6, 96.9, "receptors", beats=[92.0], drug="Mounjaro", sub="tirzepatide", lit=["GLP-1", "GIP"], result="More weight lost"),
    K(97.6, 103.2, sm("On the scale"), lg("Mounjaro", "gold"), lg("wins.")),
    K(103.3, 107.9, sm("But trainers care about"), lg("body"), lg("composition.", "cyan")),
    # the catch
    K(116.2, 120.3, sm("The hidden catch"), lg("muscle & bone"), lg("loss.", "red")),
    K(120.8, 124.7, sm("What most doctors"), lg("don't explain.")),
    S(125.3, 133.2, "weightbar", beats=[127.8], heading="weight lost on GLP-1", foot="lean muscle — not fat"),
    K(133.3, 135.3, lg("Think about"), lg("that.", "gold")),
    S(135.8, 146.4, "blocks", beats=[138.3]),
    S(150.8, 166.2, "gears", beats=[158.4], kicker="your metabolic engine", title="Metabolism", after="slowing down"),
    K(167.0, 170.6, sm("This raises your risk of"), lg("sarcopenia.", "red")),
    K(170.9, 176.3, sm("Over 40 or 50?"), lg("you're already"), lg("losing muscle.", "gold")),
    K(180.7, 185.6, sm("A fast track to"), lg("joint pain"), lg("& weakness.", "red")),
    # trainers
    K(192.9, 197.0, sm("So are trainers"), lg("out of a job?")),
    K(202.1, 206.7, sm("If a shot can melt fat..."), lg("why hire"), lg("a coach?", "cyan")),
    K(207.3, 213.2, sm("Reality"), lg("more essential"), lg("than ever.", "gold")),
    K(217.6, 222.8, sm("The drug handles appetite"), lg("we protect"), lg("the body.", "cyan")),
    S(223.3, 230.0, "cards", beats=[223.4, 225.0, 227.3], heading="you can't inject",
      cards=[dict(icon="x", label="Muscle", color="red"), dict(icon="x", label="Bone density", color="red"),
             dict(icon="x", label="Movement", color="red")]),
    K(239.1, 246.7, sm("On GLP-1, strength training is"), lg("mandatory.", "red"), sm("your medical shield")),
    # playbook
    K(252.5, 256.6, sm("GLP-1 clients"), lg("the game plan.")),
    K(261.8, 264.6, sm("Here's the"), lg("non-negotiable", "red"), lg("playbook.")),
    S(264.8, 270.4, "cards", beats=[264.9, 265.2, 265.5], heading="the playbook", cards=PLAYBOOK, active=0),
    K(270.4, 278.0, sm("Not just cardio"), lg("progressive"), lg("overload.", "gold")),
    S(278.6, 286.3, "cards", beats=[278.6, 278.6, 278.6], heading="the playbook", cards=PLAYBOOK, active=1),
    K(286.7, 295.9, sm("People end up eating"), xl("800", "red"), sm("calories a day")),
    S(296.0, 306.4, "gauge", beats=[297.5], kicker="daily protein target", title="1.6–2.2", unit="g per kg bodyweight",
      min=0, max=3, from_=0, to=1.9, band=[1.6, 2.2], color="green"),
    S(307.0, 318.9, "cards", beats=[307.0, 307.0, 307.0], heading="the playbook", cards=PLAYBOOK, active=2),
    # outro
    K(334.7, 338.3, sm("Final takeaway"), lg("not a magic"), lg("eraser.", "gold")),
    K(338.66, 342.7, sm("Not cheating either"), lg("a powerful"), lg("tool.", "cyan")),
    S(343.1, 351.6, "gauge", beats=[346.0], kicker="GLP-1 without lifting", title="No oil.", unit="engine warning",
      min=0, max=100, minLabel="E", maxLabel="F", from_=85, to=2, color="red"),
    K(352.1, 359.5, sm("Your turn"), lg("did your doctor"), lg("mention lifting?", "cyan")),
    K(360.2, 362.0, lg("Or just"), lg("eat less?", "red")),
    dict(type="cta", start=362.3, end=365.6, text="Comment below", sub="Follow for more"),
]
for o in OVERLAYS:  # 'from' is a python keyword
    if "from_" in o.get("props", {}):
        o["props"]["from"] = o["props"].pop("from_")

# ---- sound design (subtle, like the reference) --------------------------------
# (source time, file, volume[, kind[, offset seconds]])
SFX = []
for o in OVERLAYS:
    if o["type"] == "kinetic":
        hot = any(l.get("c") == "red" or l["s"] == "xl" for l in o["lines"])
        SFX.append((o["start"], "snap_perc" if hot else "whoosh_slide", 0.32 if hot else 0.24, o["kind"], -0.03))
    if o["type"] == "scene" and o["scene"] == "cards":
        for b in o["beats"][:len(o["props"]["cards"])] if "active" not in o["props"] else o["beats"][:1]:
            SFX.append((b, "click", 0.35, "main", 0.08))
    if o["type"] == "cta":
        SFX.append((o["start"], "notif_a", 0.35, "main", 0.1))

SFX += [
    (125.40, "boom", 0.5, "hook", 0.0),               # cold-open impact
    (131.6, "riser", 0.3, "hook", 0.0),               # build into the intro
    (127.8, "riser", 0.2), (138.3, "glitch", 0.22),   # weight bar split / blocks turn red
    (158.4, "ui_blip", 0.25),                         # gears stall
    (74.5, "ping", 0.25), (92.0, "ping", 0.25),       # receptor results
    (297.5, "ui_blip", 0.25), (346.0, "glitch", 0.25), (349.4, "boom", 0.3),
]

# blur-whip transitions on section changes
WHIPS = [(1.05, "main"), (116.2, "main"), (192.9, "main"), (252.5, "main"), (334.7, "main")]
