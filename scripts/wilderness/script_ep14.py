"""Episode 14 — "What Do You Want?" (Mark 10). Lit-room cartoon style.
Big moment: "a camel through the eye of a needle" (a comic camel squeezing through a giant needle). Finale: Bartimaeus sees.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
R = "am_puck"     # the rich young man
D = "am_liam"     # disciples
B = "am_echo"     # Bartimaeus
T = "-"
END_LEAD = 1.7
LINES = [
    ("run",      "As Jesus set out on the road, a rich young man ran up and fell on his knees before him.", N, 0.95, 0.3, ["rich"]),
    ("ask",      "Good teacher, what must I do to inherit eternal life?",                              R, 0.95, 0.4, ["eternal"]),
    ("laws",     "You know the commandments: do not murder, do not steal, do not lie, honour your father and mother.", J, 0.9, 0.4, ["commandments"]),
    ("kept",     "Teacher, all these I have kept since I was a boy.",                                  R, 0.95, 0.4, ["kept"]),
    ("loved",    "Jesus looked at him, and loved him.",                                                N, 0.86, 0.5, ["loved"]),
    ("sell",     "One thing you lack. Go, sell everything you have, and give to the poor, and you will have treasure in heaven. Then come, follow me.", J, 0.88, 0.5, ["treasure", "follow"]),
    ("sad",      "The man's face fell. He went away sad, because he had great wealth.",              N, 0.9, 0.6, ["sad"]),
    ("camel",    "How hard it is for the rich to enter the kingdom of God! It is easier for a camel to go through the eye of a needle.", J, 0.9, 0.7, ["camel", "needle"]),
    ("saved",    "Then who can be saved?",                                                             D, 0.95, 0.4, ["saved"]),
    ("possible", "With man this is impossible, but not with God. All things are possible with God.", J, 0.86, 0.7, ["impossible", "possible"]),
    ("seats",    "Later, James and John asked to sit at his right and his left in his glory.",        N, 0.95, 0.4, ["right", "left"]),
    ("serve",    "Whoever wants to be great among you must be your servant. For even the Son of Man did not come to be served, but to serve, and to give his life for many.", J, 0.88, 0.6, ["serve", "life"]),
    ("jericho",  "At Jericho, a blind beggar named Bartimaeus sat by the road. When he heard it was Jesus, he began to shout:", N, 0.95, 0.3, ["Bartimaeus"]),
    ("mercy",    "Jesus, Son of David, have mercy on me!",                                            B, 1.0, 0.4, ["mercy"]),
    ("louder",   "Many told him to be quiet. But he shouted even louder. Jesus stopped, and said: Call him.", N, 0.93, 0.4, ["louder", "Call"]),
    ("cloak",    "Throwing his cloak aside, he jumped up and came to Jesus.",                         N, 0.95, 0.4, ["cloak"]),
    ("want",     "What do you want me to do for you?",                                                 J, 0.88, 0.4, ["want"]),
    ("see",      "Teacher, I want to see.",                                                            B, 0.92, 0.5, ["see"]),
    ("faith",    "Go. Your faith has healed you.",                                                     J, 0.86, 0.7, ["faith"]),
    ("follow",   "Immediately he could see, and he followed Jesus along the road.",                   N, 0.9, 0.9, ["followed"]),
    ("end",      "Follow for part fifteen.",                                                           N, 1.0, 1.0, ["Follow"]),
]
