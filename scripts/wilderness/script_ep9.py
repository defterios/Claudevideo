"""Episode 9 — "A Prophet Without Honor" (Mark 6:1-29). Lit-room cartoon style.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
P = "bm_lewis"    # townspeople
H = "am_onyx"     # Herod
G = "af_sky"      # the girl
Q = "af_nicole"   # Herodias
T = "-"
END_LEAD = 1.7
LINES = [
    ("home",     "Jesus came home to Nazareth, and taught in the synagogue.",               N, 0.95, 0.4, ["Nazareth"]),
    ("whisper",  "Where did he get all this? Isn't this the carpenter? Mary's son?",        P, 0.95, 0.4, ["carpenter"]),
    ("offense",  "And they took offense at him.",                                           N, 0.95, 0.4, ["offense"]),
    ("prophet",  "A prophet has honor everywhere, except in his own hometown.",             J, 0.9, 0.5, ["honor", "hometown"]),
    ("unbelief", "He could do no great miracles there. And he was amazed at their unbelief.", N, 0.95, 0.6, ["unbelief"]),
    ("sent",     "Then he sent out the twelve, two by two. Take nothing but a staff. No bread. No bag. No money.", N, 0.95, 0.3, ["two", "staff"]),
    ("healed",   "They went out, drove out demons, and healed the sick.",                   N, 0.95, 0.6, ["healed"]),
    ("herod",    "King Herod heard about it, and was afraid.",                              N, 0.95, 0.3, ["Herod", "afraid"]),
    ("ghost",    "John, the man I beheaded, has come back from the dead!",                   H, 0.9, 0.6, ["John", "dead"]),
    ("prison",   "Herod had put John in prison, because John told him: It is not right for you to take your brother's wife.", N, 0.95, 0.5, ["prison", "right"]),
    ("feast",    "On Herod's birthday, there was a great feast. His wife's daughter danced, and pleased the king.", N, 0.95, 0.3, ["feast", "danced"]),
    ("oath",     "Ask me for anything, and I will give it to you. Up to half my kingdom.",  H, 0.9, 0.4, ["anything", "half"]),
    ("ask",      "What should I ask for?",                                                  G, 0.95, 0.4, ["ask"]),
    ("head",     "The head of John the Baptist.",                                           Q, 0.85, 1.0, ["John"]),
    ("sorry",    "The king was sorry. But he would not break his oath in front of his guests.", N, 0.92, 0.6, ["sorry", "oath"]),
    ("silent",   "That night, in the prison, the voice in the wilderness went silent.",     N, 0.88, 1.2, ["silent"]),
    ("tomb",     "His disciples came, took his body, and laid it in a tomb.",               N, 0.92, 0.8, ["tomb"]),
    ("end",      "Follow for part ten.",                                                    N, 1.0, 1.0, ["Follow"]),
]
