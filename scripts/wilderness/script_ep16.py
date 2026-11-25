"""Episode 16 — "Everything She Had" (Mark 12–13). Lit-room cartoon style.
Big moment: the widow's two tiny coins glow brighter than the rich men's heavy bags. Also: Caesar's coin, the greatest commandment,
the temple stones, "my words will never pass away".
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
Q = "bm_lewis"    # Pharisee
D = "am_liam"     # disciple
T = "-"
END_LEAD = 1.7
LINES = [
    ("trap",     "In the temple, the Pharisees tried to trap Jesus with a question.",                  N, 0.95, 0.3, ["trap"]),
    ("tax",      "Teacher, is it right to pay taxes to Caesar, or not?",                              Q, 0.95, 0.4, ["Caesar"]),
    ("coin",     "Bring me a coin. Whose face is this? And whose name?",                              J, 0.9, 0.4, ["coin"]),
    ("caesar",   "Caesar's.",                                                                          Q, 0.95, 0.4, ["Caesars"]),
    ("give",     "Then give back to Caesar what is Caesar's, and to God what is God's.",              J, 0.88, 0.7, ["God"]),
    ("which",    "Then a teacher of the law asked him: Which commandment is the most important?",     N, 0.95, 0.4, ["important"]),
    ("love",     "Love the Lord your God with all your heart, with all your soul, with all your mind, and with all your strength.", J, 0.86, 0.5, ["heart", "soul", "mind", "strength"]),
    ("second",   "The second is this: Love your neighbour as yourself. There is no commandment greater than these.", J, 0.86, 0.7, ["neighbour"]),
    ("treasury", "Jesus sat near the temple offering box, and watched. Many rich people threw in large amounts.", N, 0.93, 0.3, ["rich"]),
    ("widow",    "Then a poor widow came, and put in two very small coins.",                         N, 0.9, 0.6, ["two"]),
    ("more",     "Truly, this poor widow has put in more than all the others. They gave out of their wealth. But she, out of her poverty, gave everything she had.", J, 0.86, 0.8, ["more", "everything"]),
    ("left",     "As they were leaving the temple, one of his disciples said:",                       N, 0.95, 0.2, ["leaving"]),
    ("stones",   "Teacher, look! What massive stones! What beautiful buildings!",                    D, 1.0, 0.4, ["stones"]),
    ("down",     "Not one stone here will be left on another. Every one will be thrown down.",        J, 0.88, 0.6, ["thrown"]),
    ("words",    "Heaven and earth will pass away, but my words will never pass away.",               J, 0.85, 0.6, ["words", "never"]),
    ("watch",    "No one knows the day or the hour. So keep watch!",                                   J, 0.86, 0.9, ["watch"]),
    ("end",      "Follow for part seventeen.",                                                         N, 1.0, 1.0, ["Follow"]),
]
