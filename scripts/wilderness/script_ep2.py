"""Episode 2 — "Follow Me" (Mark 1:16-45). Narration script.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
T = "am_onyx"     # the unclean spirit (gets the dark echo in tts.py)
L = "am_echo"     # the leper
END_LEAD = 1.7    # last line waits for the title card
LINES = [
    ("shore",     "He walked along the Sea of Galilee. Two brothers were throwing their nets.", N, 1.0, 0.3, ["Galilee", "nets"]),
    ("shore",     "Simon and Andrew. Fishermen. Up all night, and nothing.",           N, 1.0, 0.35, ["Simon", "Andrew", "nothing"]),
    ("call",      "He said: Follow me. I will make you fishers of people.",            N, 0.95, 0.45, ["Follow", "people"]),
    ("drop",      "And right away, they dropped their nets.",                          N, 1.0, 0.45, ["dropped"]),
    ("zebedee",   "A little further, James and John were in the boat with their father.", N, 1.0, 0.25, ["James", "John", "father"]),
    ("zebedee",   "He called them. They left the boat, their father, everything.",     N, 1.0, 0.5, ["called", "everything"]),
    ("synagogue", "In Capernaum, he stood up in the synagogue and taught.",            N, 1.0, 0.25, ["Capernaum", "taught"]),
    ("synagogue", "Not like the scholars. Like someone with authority.",               N, 1.0, 0.35, ["authority"]),
    ("demon",     "Then a man started screaming.",                                     N, 1.0, 0.2, ["screaming"]),
    ("demon",     "What do you want with us? I know who you are!",                     T, 0.88, 0.4, ["know", "are"]),
    ("rebuke",    "He said: Be quiet. Come out of him.",                               N, 0.95, 0.35, ["quiet", "out"]),
    ("rebuke",    "The man shook, cried out, and it was gone.",                        N, 1.0, 0.6, ["gone"]),
    ("house",     "That evening, Simon's mother-in-law was burning with fever.",       N, 1.0, 0.3, ["burning", "fever"]),
    ("house",     "He took her by the hand. The fever left her.",                      N, 1.0, 0.5, ["hand", "left"]),
    ("door",      "By sunset, the whole town was at the door.",                        N, 1.0, 0.5, ["whole", "door"]),
    ("leper",     "Then a leper fell to his knees.",                                   N, 1.0, 0.25, ["leper"]),
    ("leper",     "If you want to, you can make me clean.",                            L, 0.9, 0.4, ["clean"]),
    ("touch",     "Nobody touched lepers. He touched him and said: I want to. Be clean.", N, 0.95, 0.9, ["Nobody", "touched", "clean"]),
    ("end",       "Follow for part three.",                                            N, 1.0, 0.9, ["Follow"]),
]
