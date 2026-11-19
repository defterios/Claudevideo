"""Episode 6 — "The Storm" (Mark 4). Lit-room cartoon style.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
D = "am_adam"     # a disciple
T = "-"           # no dark voice this episode
END_LEAD = 1.7
LINES = [
    ("shore",   "The crowd was so big, he sat in a boat, and taught them from the water.", N, 0.95, 0.4, ["crowd", "boat"]),
    ("sower",   "A farmer went out to sow his seed.",                                   J, 0.9, 0.3, ["farmer", "seed"]),
    ("seeds",   "Some fell on the path, and birds ate it. Some on rock, and it withered. Some among thorns, and it was choked.", J, 0.9, 0.4, ["path", "rock", "thorns"]),
    ("good",    "But some fell on good soil. And it grew. Thirty, sixty, a hundred times.", J, 0.9, 0.6, ["good", "hundred"]),
    ("mustard", "The kingdom of God is like a mustard seed. The smallest seed, that grows into the biggest tree.", J, 0.9, 0.7, ["smallest", "biggest"]),
    ("evening", "That evening he said: Let's go across to the other side.",            N, 0.95, 0.4, ["other"]),
    ("sleep",   "He lay down in the back of the boat, and fell asleep.",                N, 0.92, 0.8, ["asleep"]),
    ("storm",   "Then a furious storm came. Waves broke over the boat. It was filling with water.", N, 1.0, 0.2, ["storm", "water"]),
    ("wake",    "Teacher! Don't you care if we drown?",                                 D, 1.05, 0.5, ["drown"]),
    ("rebuke",  "Quiet. Be still.",                                                     J, 0.85, 1.4, ["still"]),
    ("calm",    "The wind died down. And it was completely calm.",                      N, 0.9, 0.8, ["calm"]),
    ("faith",   "Why are you so afraid? Do you still have no faith?",                   J, 0.9, 0.8, ["afraid", "faith"]),
    ("whois",   "They were terrified, and asked each other: Who is this? Even the wind and the waves obey him.", N, 0.92, 0.9, ["Who", "obey"]),
    ("end",     "Follow for part seven.",                                               N, 1.0, 1.0, ["Follow"]),
]
