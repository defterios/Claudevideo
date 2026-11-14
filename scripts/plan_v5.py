"""Progressive overload — edited after the cream / rust "edited with Claude Code" reference."""
SOURCES = ["po"]
VIDEO_SOURCES = ["po"]
REMOVE = []
TAIL = 0.9

WORD_FIXES = [
    ("po", 3.56, "results"), ("po", 17.54, "overload"), ("po", 18.24, "means"),
    ("po", 40.60, "TikTok"), ("po", 58.42, "those"),
]

# punch-in close-ups on the eyes (source start, end, scale) — everything else is the normal selfie framing
ZOOMS = [
    ("po", 2.85, 4.45, 1.38), ("po", 6.15, 8.05, 1.35), ("po", 16.8, 21.3, 1.32),
    ("po", 24.4, 26.1, 1.4), ("po", 43.1, 45.2, 1.38), ("po", 59.8, 61.95, 1.35), ("po", 63.6, 66.45, 1.42),
]

def S(t, kind, beats=(), sfx=None, vol=None, **props):
    d = dict(at=("po", t), kind=kind, props=props, beats=[("po", b) for b in beats])
    if sfx: d["sfx"] = sfx
    if vol is not None: d["sfxVol"] = vol
    return d

SCENES = [
    S(0.0, "hookCount", beats=[3.56], sfx="whoosh_fast", vol=0.0),
    S(4.6, "glitchTitle", beats=[6.22], kicker="NEVER HEARD OF", lines=["PROGRESSIVE", "OVERLOAD"]),
    S(8.08, "terminal", file="muscles.js", lines=['muscles.status = "lazy";'], label="— YOUR MUSCLES", big="LAZY"),
    S(9.85, "logTable", beats=[14.06], label="— SAME WORKOUT, EVERY WEEK"),
    S(16.78, "tag", text="FORCE YOUR MUSCLES TO ADAPT"),
    S(21.35, "stairs", beats=[22.66], label="— A LITTLE MORE THAN LAST TIME"),
    S(24.42, "steps", beats=[26.94, 28.18, 30.38, 31.64, 33.98],
      items=["MORE WEIGHT", "+1 EXTRA REP", "ANOTHER SET", "SLOWER TEMPO"], last="PERFECT FORM"),
    S(37.38, "tag", text="COACH'S ADVICE"),
    S(39.6, "randomCards", beats=[40.2, 42.3], cards=["VIRAL ABS HACK", "10-MIN SHRED", "NEW WORKOUT DAILY"]),
    S(43.12, "myth", beats=[44.86], text="MUSCLE CONFUSION"),
    S(45.24, "weeks", beats=[48.24], n=6),
    S(50.84, "logType", beats=[52.72], label="— TRACK EVERYTHING", file="workout.log",
      lines=["14 NOV  ·  PUSH DAY", "BENCH    60.0kg x 8  ✓", "OHP      35.0kg x 10 ✓", "DIPS     BW     x 12 ✓"]),
    S(57.14, "beat", beats=[58.30, 59.86], prev=["60.0", "KG × 8"], now=["62.5", "KG × 8"]),
    S(61.95, "guess", beats=[64.38, 65.60]),
    S(66.48, "follow", sfx="whoosh_fast", vol=0.3),
]

# (source time, file, volume, offset)
SFX = [
    (("po", 0.62), "counter", 0.28, 0.0), (("po", 3.56), "thud", 0.45, 0.0), (("po", 3.56), "glitch", 0.2, 0.0),
    (("po", 6.22), "glitch", 0.28, -0.05), (("po", 6.70), "hit_organic", 0.3, 0.0),
    (("po", 8.4), "typing", 0.22, 0.0), (("po", 9.40), "thud", 0.4, 0.0),
    (("po", 10.5), "tick", 0.3, 0.0), (("po", 10.8), "tick", 0.3, 0.0), (("po", 11.1), "tick", 0.3, 0.0),
    (("po", 11.4), "tick", 0.3, 0.0), (("po", 11.7), "tick", 0.3, 0.0), (("po", 12.0), "tick", 0.3, 0.0),
    (("po", 14.88), "thud", 0.4, 0.0),
    (("po", 21.6), "riser", 0.2, 0.0), (("po", 22.66), "snap_glassy", 0.3, 0.0),
    (("po", 26.94), "clank", 0.42, 0.0), (("po", 28.18), "clank", 0.38, 0.0), (("po", 30.38), "clank", 0.38, 0.0),
    (("po", 31.64), "clank", 0.38, 0.0), (("po", 33.98), "snap_glassy", 0.32, 0.0),
    (("po", 40.2), "paper", 0.4, 0.0), (("po", 40.45), "paper", 0.4, 0.0), (("po", 40.7), "paper", 0.4, 0.0),
    (("po", 42.3), "thud", 0.5, 0.0), (("po", 42.3), "hit_organic", 0.3, 0.0),
    (("po", 44.86), "thud", 0.5, 0.0), (("po", 44.86), "glitch", 0.22, 0.0),
    (("po", 48.24), "counter", 0.25, 0.0),
    (("po", 52.72), "typing", 0.25, 0.0), (("po", 54.6), "typing", 0.2, 0.0),
    (("po", 58.30), "snap_glassy", 0.35, 0.0), (("po", 59.86), "clank", 0.35, 0.0),
    (("po", 64.38), "ping", 0.25, 0.0), (("po", 65.60), "glitch", 0.3, 0.0), (("po", 65.60), "thud", 0.4, 0.0),
    (("po", 66.54), "notif_gym", 0.4, 0.15),
]
