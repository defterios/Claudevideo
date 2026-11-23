"""Episode 12 — "Who Do You Say I Am?" (Mark 8). Lit-room cartoon style.
Big moment: the blind man's blurred world comes into focus (two touches).
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
B = "am_adam"     # the blind man
D = "am_liam"     # disciples
P = "am_fenrir"   # Peter
T = "-"
END_LEAD = 1.7
LINES = [
    ("crowd",   "Once again a large crowd gathered. For three days, they had nothing to eat.",            N, 0.95, 0.3, ["three"]),
    ("pity",    "I have compassion for these people. If I send them home hungry, they will faint on the way.", J, 0.9, 0.5, ["compassion"]),
    ("seven",   "They had only seven loaves. Jesus gave thanks, broke them, and four thousand people ate.", N, 0.95, 0.4, ["seven", "thousand"]),
    ("baskets", "And they picked up seven basketfuls of leftovers.",                                     N, 0.95, 0.6, ["seven"]),
    ("blind",   "At Bethsaida, some people brought a blind man, and begged Jesus to touch him.",         N, 0.95, 0.3, ["blind"]),
    ("spit",    "Jesus led him out of the village, put spit on his eyes, and laid his hands on him.",    N, 0.92, 0.4, ["eyes"]),
    ("ask",     "Do you see anything?",                                                              J, 0.9, 0.4, ["see"]),
    ("trees",   "I see people. They look like trees, walking around.",                                B, 0.92, 0.6, ["trees"]),
    ("clear",   "Once more, Jesus put his hands on his eyes. Then his sight was restored, and he saw everything clearly.", N, 0.92, 0.8, ["clearly"]),
    ("who",     "On the road, Jesus asked his disciples: Who do people say I am?",                    J, 0.9, 0.4, ["Who"]),
    ("say",     "Some say John the Baptist. Others say Elijah. Others, one of the prophets.",          D, 0.95, 0.4, ["John", "Elijah"]),
    ("you",     "But what about you? Who do you say I am?",                                          J, 0.88, 0.7, ["you"]),
    ("peter",   "You are the Messiah.",                                                              P, 0.88, 0.9, ["Messiah"]),
    ("suffer",  "Then he began to teach them that he must suffer, be killed, and after three days, rise again.", N, 0.93, 0.4, ["suffer", "rise"]),
    ("rebuke",  "Peter took him aside, and began to rebuke him.",                                     N, 0.95, 0.3, ["rebuke"]),
    ("satan",   "Get behind me, Satan! You are not thinking of the things of God.",                   J, 0.9, 0.6, ["Satan", "God"]),
    ("cross",   "Whoever wants to follow me must deny themselves, take up their cross, and follow me.", J, 0.88, 0.5, ["cross"]),
    ("soul",    "What good is it to gain the whole world, yet lose your soul?",                       J, 0.86, 0.9, ["world", "soul"]),
    ("end",     "Follow for part thirteen.",                                                         N, 1.0, 1.0, ["Follow"]),
]
