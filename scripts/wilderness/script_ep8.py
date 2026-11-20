"""Episode 8 — "Talitha Koum" (Mark 5:21-43). Lit-room cartoon style.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
R = "am_adam"     # Jairus
W = "af_heart"    # the woman
S = "bm_lewis"    # servant
T = "-"
END_LEAD = 1.7
LINES = [
    ("lake",    "Back across the lake, a man pushed through the crowd. Jairus, a leader of the synagogue.", N, 0.95, 0.3, ["Jairus"]),
    ("plea",    "My little daughter is dying. Please, come and put your hands on her, so she will live.", R, 0.95, 0.5, ["dying", "live"]),
    ("crowd",   "Jesus went with him. And the crowd pressed in on every side.",            N, 0.95, 0.3, ["crowd"]),
    ("woman",   "In the crowd was a woman who had been bleeding for twelve years. She had spent everything on doctors, and only got worse.", N, 0.95, 0.3, ["twelve", "worse"]),
    ("thought", "If I just touch his clothes, I will be healed.",                         W, 0.9, 0.4, ["touch", "healed"]),
    ("touch",   "She reached out, and touched his robe. Immediately, the bleeding stopped.", N, 0.92, 0.8, ["touched", "stopped"]),
    ("who",     "Who touched my clothes?",                                                 J, 0.9, 0.6, ["Who"]),
    ("feet",    "Trembling, she fell at his feet, and told him everything.",               N, 0.95, 0.4, ["Trembling"]),
    ("peace",   "Daughter, your faith has healed you. Go in peace.",                       J, 0.9, 0.7, ["faith", "peace"]),
    ("news",    "Your daughter is dead. Why bother the teacher anymore?",                  S, 0.95, 0.6, ["dead"]),
    ("believe", "Don't be afraid. Just believe.",                                          J, 0.88, 0.8, ["believe"]),
    ("house",   "At the house, people were crying and wailing. He said: She is not dead, only asleep. They laughed at him.", N, 0.95, 0.5, ["asleep", "laughed"]),
    ("hand",    "He took her by the hand, and said:",                                      N, 0.9, 0.4, ["hand"]),
    ("rise",    "Talitha koum. Little girl, I say to you, get up.",                        J, 0.85, 1.0, ["koum", "up"]),
    ("walk",    "Immediately, she stood up and walked around. She was twelve years old.",  N, 0.95, 0.9, ["walked", "twelve"]),
    ("end",     "Follow for part nine.",                                                   N, 1.0, 1.0, ["Follow"]),
]
