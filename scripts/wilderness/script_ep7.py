"""Episode 7 — "Legion" (Mark 5:1-20). Lit-room cartoon style.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
T = "am_onyx"     # the demons (dark echo)
M = "am_echo"     # the man, healed
END_LEAD = 1.7
LEAD = 2.2        # visual-only opening
LINES = [
    ("landing", "They landed on the other side. Tombs. Chains. And screaming in the dark.", N, 0.92, 0.5, ["Tombs", "screaming"]),
    ("tombs",   "A man lived among the graves. No chain could hold him.",            N, 0.92, 0.4, ["graves", "chain"]),
    ("run",     "When he saw Jesus, he ran, and fell at his feet.",                  N, 0.95, 0.3, ["ran", "feet"]),
    ("run",     "What do you want with me, Jesus, Son of the Most High God?",        T, 0.86, 0.5, ["Most", "High"]),
    ("name",    "What is your name?",                                                J, 0.88, 0.6, ["name"]),
    ("legion",  "My name is Legion. For we are many.",                               T, 0.82, 0.8, ["Legion", "many"]),
    ("pigs",    "On the hill, a great herd of pigs was feeding.",                    N, 0.95, 0.2, ["pigs"]),
    ("pigs",    "Send us into the pigs.",                                            T, 0.84, 0.5, ["Send"]),
    ("rush",    "He let them go. The whole herd rushed down the cliff, into the sea.", N, 0.95, 1.2, ["rushed", "sea"]),
    ("town",    "The town came running, and found the man sitting there, dressed, and in his right mind.", N, 0.95, 0.4, ["sitting", "right"]),
    ("afraid",  "They were afraid. And they begged Jesus to leave.",                 N, 0.95, 0.5, ["afraid", "leave"]),
    ("come",    "Let me come with you.",                                             M, 0.9, 0.5, ["come"]),
    ("home",    "Go home. Tell them how much the Lord has done for you.",            J, 0.9, 0.9, ["home", "done"]),
    ("end",     "Follow for part eight.",                                            N, 1.0, 1.0, ["Follow"]),
]
