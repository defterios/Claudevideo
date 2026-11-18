"""Episode 4 — "Lord of the Sabbath" (Mark 2:23-3:6). Sparse, mostly visual (80s-anime reference).
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator (few lines)
J = "am_michael"  # Jesus
P = "bm_lewis"    # Pharisee
T = "am_onyx"     # the plotting whisper (dark echo)
END_LEAD = 1.7
LEAD = 3.2       # visual-only opening
LINES = [
    ("field",    "One Sabbath, they walked through the grain fields.",                N, 0.92, 1.6, ["Sabbath"]),
    ("watchers", "Look. They are breaking the Sabbath.",                              P, 0.9, 0.9, ["breaking"]),
    ("reply",    "The Sabbath was made for people. Not people for the Sabbath.",      J, 0.9, 1.6, ["people"]),
    ("hand",     "Later, in the synagogue, a man sat with a withered hand.",          N, 0.92, 1.0, ["withered"]),
    ("watch",    "And they watched. Waiting for him to break the rule.",              N, 0.92, 1.2, ["watched"]),
    ("stand",    "Stand up. Come to the middle.",                                     J, 0.9, 1.0, ["middle"]),
    ("question", "Is it right on the Sabbath to do good, or to do evil? To save a life, or to kill?", J, 0.9, 0.6, ["good", "life", "kill"]),
    ("silence",  "Silence.",                                                          N, 0.85, 1.6, ["Silence"]),
    ("stretch",  "Stretch out your hand.",                                            J, 0.88, 1.8, ["hand"]),
    ("heal",     "And it was made whole.",                                            N, 0.9, 1.8, ["whole"]),
    ("plot",     "That night, they went out into the dark, and made a plan.",         N, 0.92, 0.6, ["plan"]),
    ("plot",     "He has to die.",                                                    T, 0.82, 1.8, ["die"]),
    ("end",      "Follow for part five.",                                             N, 1.0, 1.0, ["Follow"]),
]
