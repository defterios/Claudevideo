"""Ozempic vs Mounjaro — v3, edited after the "slate / floating media cards" reference."""
from plan_v2 import WORD_FIXES  # same recordings, same cuts

# The closing line of vo3 ("If you agree with me, let me know in the comments") is replaced by
# a new on-camera clip (end): "So if you agree with me, comment down below."
SOURCES = ["open", "vo1", "vo2", "vo3", "end"]
VIDEO_SOURCES = ["open", "end"]
REMOVE = [("vo3", 14.0, 17.0)]
TAIL = 0.55  # the end clip only has ~0.7 s of picture after the last word

def S(src, t, kind, beats=(), sfx=None, vol=None, **props):
    d = dict(at=(src, t), kind=kind, props=props, beats=list(beats))
    if sfx: d["sfx"] = sfx
    if vol is not None: d["sfxVol"] = vol
    return d

SCENES = [
    # ---------- OPENING: split screen (cards on top, speaker below) ----------
    S("open", 0.0, "openSplit", beats=[("open", 2.4)], imgs=["ozempic_3", "syringe_6"], labels=["Ozempic", "Mounjaro"]),
    S("open", 3.50, "openTitle", small="everyone's asking about", big=["OZEMPIC", "vs", "MOUNJARO"], sfx="whoosh_slide"),
    S("open", 5.58, "openPunch", chip="MY POV · PERSONAL TRAINER", sfx="whoosh_short_a", vol=0.3),
    # ---------- VO1: the science ----------
    S("vo1", 3.36, "section", n=1, title="THE SCIENCE", accent="SCIENCE", sfx="whoosh_hit_a", vol=0.3),
    S("vo1", 4.80, "mediaCard", img="ozempic_4", chips=[("ACTIVE INGREDIENT", "dim"), ("SEMAGLUTIDE", "green")]),
    S("vo1", 7.75, "code", beats=[("vo1", 8.5), ("vo1", 9.6)], file="ozempic.js",
      lines=["// Ozempic", 'drug: "Semaglutide",', 'mimics: ["GLP-1"],', "hormones: 1,"], hl=2),
    S("vo1", 10.95, "progress", label="DIGESTION", status="SLOWING", timer="FULL LONGER", toPct=28),
    S("vo1", 14.38, "mediaCard", img="syringe_6", tag="#2", chips=[("NEWER GENERATION", "dim"), ("TIRZEPATIDE", "blue")]),
    S("vo1", 17.60, "code", beats=[("vo1", 18.2), ("vo1", 21.4)], file="mounjaro.js",
      lines=["// Mounjaro", 'drug: "Tirzepatide",', 'mimics: ["GLP-1", "GIP"],', "hormones: 2,"], hl=2),
    S("vo1", 23.72, "numbers", beats=[("vo1", 26.1)],
      items=[dict(label="OZEMPIC", value=13.7), dict(label="MOUNJARO", value=20.2)],
      note="SURMOUNT-5 · head-to-head · 72 weeks · avg % body weight lost"),
    # ---------- VO2: PT perspective ----------
    S("vo2", 1.64, "section", n=3, title="THE PT TAKE", accent="PT", sfx="whoosh_hit_a", vol=0.32),
    S("vo2", 5.60, "deficit", beats=[("vo2", 8.3), ("vo2", 9.6)], fromKcal=2400, toKcal=1600),
    S("vo2", 10.88, "mediaX", beats=[("vo2", 12.4)], img="physique_3", caption="BUILDS MUSCLE?"),
    S("vo2", 14.60, "bars", beats=[("vo2", 15.4), ("vo2", 17.4)], title="LOSING WEIGHT TOO FAST"),
    S("vo2", 19.52, "bigText", beats=[("vo2", 21.2)], small="the result?", big=["SKINNY", "FAT."], accentIdx=1),
    S("vo2", 22.30, "crash", beats=[("vo2", 23.2)], label="metabolism.js"),
    # ---------- VO3: what to do ----------
    S("vo3", 1.32, "mediaCard", img="doctor_0", chips=[("UNDER A DOCTOR'S", "dim"), ("SUPERVISION", "green")]),
    S("vo3", 4.62, "popCards", beats=[("vo3", 5.16), ("vo3", 6.3), ("vo3", 7.0)],
      cards=[dict(img="deadlift_3", label="STRENGTH"), dict(img="protein_4", label="PROTEIN"), dict(img="barbell_2", label="MUSCLE")]),
    S("vo3", 8.46, "bigText", beats=[("vo3", 9.7)], small="remember", big=["TOOLS,", "NOT SHORTCUTS."], strikeIdx=1),
    S("vo3", 10.96, "mediaCard", img="barbell_2", chips=[("EXERCISE IS", "dim"), ("MANDATORY", "yellow")], zoom="out"),
    S("end", 0.70, "endCta", beats=[("end", 1.0), ("end", 2.6)], text="DO YOU AGREE?", sfx="whoosh_short_a", vol=0.32),
]

# (time, file, volume, offset)
SFX = [
    (("open", 0.0), "whoosh_organic", 0.35, 0.0), (("open", 0.15), "pop", 0.3, 0.0), (("open", 0.45), "pop", 0.3, 0.0),
    (("open", 2.4), "snap_glassy", 0.3, 0.0),
    (("open", 3.6), "snap_perc", 0.3, 0.0),
    (("vo1", 5.2), "ui_blip", 0.25, 0.0),
    (("vo1", 8.5), "click", 0.18, 0.0), (("vo1", 8.8), "click", 0.18, 0.0), (("vo1", 9.1), "click", 0.18, 0.0), (("vo1", 9.6), "ping", 0.25, 0.0),
    (("vo1", 11.4), "ui_blip", 0.25, 0.0),
    (("vo1", 18.2), "click", 0.18, 0.0), (("vo1", 18.5), "click", 0.18, 0.0), (("vo1", 21.4), "ping", 0.3, 0.0),
    (("vo1", 26.1), "riser", 0.22, -0.4), (("vo1", 27.2), "snap_glassy", 0.4, 0.0),
    (("vo2", 6.3), "ui_blip", 0.3, 0.0), (("vo2", 9.6), "snap_glassy", 0.35, 0.0),
    (("vo2", 12.4), "boom", 0.3, 0.0), (("vo2", 12.4), "glitch", 0.22, 0.0),
    (("vo2", 17.4), "snap_perc", 0.35, 0.0),
    (("vo2", 21.2), "boom", 0.3, 0.0),
    (("vo2", 23.2), "glitch", 0.3, 0.0), (("vo2", 23.25), "boom", 0.3, 0.0),
    (("vo3", 5.16), "pop", 0.35, 0.0), (("vo3", 6.3), "pop", 0.35, 0.0), (("vo3", 7.0), "pop", 0.35, 0.0),
    (("vo3", 9.7), "glitch", 0.22, 0.0),
    (("end", 1.0), "click", 0.18, 0.0), (("end", 1.25), "click", 0.18, 0.0), (("end", 1.5), "click", 0.18, 0.0), (("end", 1.75), "click", 0.18, 0.0),
    (("end", 2.6), "notif_a", 0.35, 0.0),
]
