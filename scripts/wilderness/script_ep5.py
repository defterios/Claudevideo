"""Episode 5 — "The Twelve" (Mark 3:7-35). Narrated, lit-room cartoon style.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
P = "bm_lewis"    # the scholars
T = "am_onyx"     # the spirits (dark echo)
END_LEAD = 1.7
LINES = [
    ("crowd",    "Word spread. Thousands came from every town, pushing just to touch him.", N, 0.95, 0.3, ["Thousands", "touch"]),
    ("crowd",    "So he kept a boat ready, in case the crowd crushed him.",              N, 0.95, 0.5, ["boat"]),
    ("spirits",  "Even the unclean spirits fell down and screamed:",                     N, 0.95, 0.2, ["spirits"]),
    ("spirits",  "You are the Son of God!",                                              T, 0.85, 0.8, ["Son", "God"]),
    ("mountain", "Then he climbed a mountain, and called the ones he wanted.",           N, 0.92, 0.6, ["mountain", "wanted"]),
    ("names",    "Simon, the Rock. James and John, the Sons of Thunder. Andrew. Philip. Bartholomew.", N, 0.92, 0.25, ["Rock", "Thunder"]),
    ("names",    "Matthew. Thomas. James. Thaddaeus. Simon.",                            N, 0.92, 0.35, ["Matthew", "Thomas"]),
    ("judas",    "And Judas Iscariot. The one who would betray him.",                   N, 0.88, 0.7, ["Judas", "betray"]),
    ("twelve",   "Twelve ordinary men. Sent out to preach, and to drive out demons.",   N, 0.92, 0.6, ["Twelve", "ordinary"]),
    ("family",   "When his own family heard, they came to take him home. They said: He has lost his mind.", N, 0.95, 0.5, ["family", "mind"]),
    ("scholars", "He drives out demons by the prince of demons!",                       P, 0.9, 0.4, ["prince"]),
    ("divided",  "How can Satan drive out Satan? A house divided against itself cannot stand.", J, 0.9, 0.9, ["divided", "stand"]),
    ("door",     "Then his mother and brothers came, and stood outside, and sent for him.", N, 0.95, 0.4, ["mother", "outside"]),
    ("answer",   "Who are my mother and my brothers?",                                   J, 0.88, 0.8, ["mother", "brothers"]),
    ("circle",   "Whoever does the will of God is my brother, and sister, and mother.", J, 0.88, 0.9, ["brother", "sister", "mother"]),
    ("end",      "Follow for part six.",                                                 N, 1.0, 1.0, ["Follow"]),
]
