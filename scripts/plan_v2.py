"""Creative plan for "Ozempic vs Mounjaro — my POV as a trainer". Times = (source, seconds in that recording)."""
SOURCES = ["open", "vo1", "vo2", "vo3"]
REMOVE = []          # no stutters / retakes found — only pauses are cut (see MERGE_GAP)
TAIL = 1.2           # hold after the last word for the CTA

WORD_FIXES = [
    ("vo1", 8.04, "mimics"), ("vo1", 19.58, "mimics"), ("vo1", 20.12, "hormones"),
    ("vo1", 24.26, "targets"), ("vo1", 25.46, "studies"), ("vo1", 25.70, "show"),
    ("vo3", 3.12, "a doctor's"),
]

def S(src, t, kind, beats=(), sfx=None, vol=None, **props):
    d = dict(at=(src, t), kind=kind, props=props, beats=list(beats))
    if sfx: d["sfx"] = sfx
    if vol is not None: d["sfxVol"] = vol
    return d

SCENES = [
    # ---------------- OPENING (face, text behind subject) ----------------
    S("open", 0.0, "opening", mode="green", kicker="A trainer's take", title="Ozempic", italic="vs Mounjaro"),
    S("open", 2.30, "opening", mode="real", kicker="The viral weight-loss drugs", title="Worth it?", italic="", strike=False, sfx="whoosh_organic", vol=0.35),
    S("open", 5.58, "opening", mode="real", kicker="My POV", title="Personal", italic="trainer", sfx="whoosh_slide"),
    # ---------------- VO 1 — the science ----------------
    S("vo1", 3.36, "title", bg="green", kicker="The science", title="Medically", italic="speaking.", sfx="whoosh_hit_a", vol=0.32),
    S("vo1", 4.80, "photo", img="ozempic_4", kicker="Active ingredient", tags=["Ozempic", "Semaglutide"]),
    S("vo1", 7.75, "hormone", drug="Ozempic", labels=["GLP-1"], note="mimics 1 hormone"),
    S("vo1", 10.95, "knob", label="Digestion", fromLabel="Normal", toLabel="Slow", value="Feel full longer"),
    S("vo1", 14.38, "photo", img="syringe_6", kicker="Newer generation", tags=["Mounjaro", "Tirzepatide"]),
    S("vo1", 17.60, "hormone", beats=[("vo1", 21.5), ("vo1", 22.2)], drug="Mounjaro", labels=["GLP-1", "GIP"], note="mimics 2 hormones at once"),
    S("vo1", 23.72, "chart", beats=[("vo1", 26.1)], title="Average weight lost",
      bars=[dict(label="Ozempic", value=13.7), dict(label="Mounjaro", value=20.2)], unit="%",
      note="SURMOUNT-5 head-to-head trial · 72 weeks · % of body weight"),
    # ---------------- VO 2 — the PT perspective ----------------
    S("vo2", 1.64, "title", bg="green", kicker="But listen up", title="My take", italic="as a PT.", sfx="whoosh_hit_a", vol=0.35),
    S("vo2", 5.60, "deficit", beats=[("vo2", 8.3), ("vo2", 9.6)], img="plate_4", label="Appetite", fromKcal=2400, toKcal=1600),
    S("vo2", 10.88, "full", beats=[("vo2", 12.4)], img="physique_3", kicker="These drugs will not", title="Build muscle", strike=True),
    S("vo2", 14.60, "fatmuscle", beats=[("vo2", 17.4)], kicker="Losing weight too fast"),
    S("vo2", 19.52, "title", beats=[("vo2", 21.2)], bg="cream", kicker="The result?", title="Skinny", italic="fat.", sfx="whoosh_organic"),
    S("vo2", 22.30, "crash", beats=[("vo2", 23.2)], label="Metabolism"),
    # ---------------- VO 3 — what to do ----------------
    S("vo3", 1.32, "photo", img="doctor_0", kicker="If you're on them", tags=["Under a doctor's", "supervision"]),
    S("vo3", 4.62, "checklist", beats=[("vo3", 5.16), ("vo3", 6.3), ("vo3", 7.0), ("vo3", 5.85)],
      imgs=["deadlift_3", "protein_4"], items=["Strength training", "Enough protein", "Protect your muscles"]),
    S("vo3", 8.46, "title", bg="green", kicker="Remember", title="Tools,", italic="not shortcuts.", sfx="whoosh_hit_a", vol=0.32),
    S("vo3", 10.96, "full", img="barbell_2", kicker="Exercise is still", title="Mandatory."),
    S("vo3", 14.06, "comment", beats=[("vo3", 14.5), ("vo3", 16.2)], kicker="Do you agree?", text="Agree coach, lifting is mandatory 💪"),
]

# (time, file, volume, offset)
SFX = [
    (("open", 0.0), "boom", 0.4, 0.05),
    (("open", 0.4), "snap_perc", 0.3, 0.0),
    (("vo1", 7.9), "ping", 0.25, 0.0),
    (("vo1", 11.3), "ui_blip", 0.3, 0.0), (("vo1", 11.8), "ui_blip", 0.25, 0.0), (("vo1", 12.3), "ui_blip", 0.22, 0.0),
    (("vo1", 21.5), "ping", 0.25, 0.0), (("vo1", 22.2), "ping", 0.25, 0.0),
    (("vo1", 26.1), "riser", 0.22, -0.4), (("vo1", 27.4), "snap_glassy", 0.4, 0.0),
    (("vo2", 6.4), "ui_blip", 0.3, 0.0), (("vo2", 9.6), "snap_glassy", 0.35, 0.0),
    (("vo2", 12.4), "glitch", 0.3, 0.0),
    (("vo2", 17.4), "snap_perc", 0.35, 0.0),
    (("vo2", 21.2), "boom", 0.35, 0.0),
    (("vo2", 23.2), "glitch", 0.3, 0.0), (("vo2", 23.25), "boom", 0.3, 0.0),
    (("vo3", 5.16), "click", 0.4, 0.05), (("vo3", 6.3), "click", 0.4, 0.05), (("vo3", 7.0), "click", 0.4, 0.05),
    (("vo3", 14.5), "click", 0.2, 0.0), (("vo3", 14.8), "click", 0.2, 0.0), (("vo3", 15.1), "click", 0.2, 0.0), (("vo3", 15.4), "click", 0.2, 0.0),
    (("vo3", 16.2), "notif_a", 0.35, 0.0),
]
