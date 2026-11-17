"""Episode 1 — "The Wilderness" (Mark 1). Narration script.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
T = "am_onyx"     # the tempter's whisper
LINES = [
    ("river",    "For thirty years, he was just a carpenter. Nobody noticed him.", N, 1.0, 0.25, ["carpenter", "nobody"]),
    ("river",    "Then one morning, he stepped into a river.",                      N, 1.0, 0.35, ["river"]),
    ("sky",      "And the sky tore open.",                                          N, 0.95, 0.9, ["tore"]),
    ("voice",    "A voice said: You are my Son. I love you.",                       N, 0.95, 0.5, ["Son", "love"]),
    ("drive",    "And right after that? He was driven into the desert.",            N, 1.0, 0.35, ["driven", "desert"]),
    ("fast",     "Forty days. No food. Just heat, stone, and wild animals.",        N, 1.0, 0.45, ["Forty", "food", "wild"]),
    ("bread",    "Then came a whisper.",                                            N, 1.0, 0.25, ["whisper"]),
    ("bread",    "You're starving. Turn this stone into bread.",                    T, 0.88, 0.35, ["starving", "bread"]),
    ("bread",    "He said: man does not live on bread alone.",                      N, 1.0, 0.4, ["not", "alone"]),
    ("temple",   "Jump. Prove who you are.",                                        T, 0.88, 0.35, ["Jump", "Prove"]),
    ("temple",   "He said: do not test God.",                                       N, 1.0, 0.4, ["test"]),
    ("kingdoms", "Bow to me, and all of this is yours. No pain. No cross.",         T, 0.88, 0.5, ["Bow", "yours", "cross"]),
    ("go",       "He was starving. Shaking. Completely alone.",                     N, 1.0, 0.35, ["starving", "alone"]),
    ("go",       "And he said: Go.",                                                N, 0.92, 1.0, ["Go"]),
    ("angels",   "The whisper left. And angels came.",                              N, 0.95, 0.9, ["left", "angels"]),
    ("walk",     "He walked out of that desert thin, sunburnt, and unstoppable.",   N, 1.0, 0.35, ["unstoppable"]),
    ("walk",     "The time has come. The kingdom of God is near.",                  N, 0.95, 0.7, ["time", "kingdom", "near"]),
    ("end",      "Episode one: The Wilderness. Follow for part two.",               N, 1.0, 0.9, ["Wilderness", "Follow"]),
]
