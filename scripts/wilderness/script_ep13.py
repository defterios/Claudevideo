"""Episode 13 — "Listen to Him" (Mark 9). Lit-room cartoon style.
Big moment: the Transfiguration — Jesus shines dazzling white on the mountain; then God's voice from the cloud.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
P = "am_fenrir"   # Peter
G = "bm_daniel"   # God's voice from the cloud
F = "am_eric"     # the boy's father
T = "-"
END_LEAD = 1.7
LINES = [
    ("climb",    "Six days later, Jesus took Peter, James, and John up a high mountain.",              N, 0.95, 0.4, ["mountain"]),
    ("shine",    "There, in front of them, he was transfigured. His clothes became dazzling white, whiter than anyone on earth could make them.", N, 0.9, 0.8, ["transfigured", "white"]),
    ("prophets", "Then Elijah and Moses appeared, talking with Jesus.",                               N, 0.93, 0.4, ["Elijah", "Moses"]),
    ("tents",    "Teacher, it is good for us to be here! Let us put up three shelters: one for you, one for Moses, and one for Elijah.", P, 1.0, 0.4, ["three"]),
    ("cloud",    "He did not know what to say, they were so afraid. Then a cloud covered them, and a voice came from the cloud:", N, 0.92, 0.4, ["cloud"]),
    ("voice",    "This is my Son, whom I love. Listen to him!",                                       G, 0.82, 0.9, ["Son", "Listen"]),
    ("alone",    "Suddenly, when they looked around, they saw no one with them, only Jesus.",         N, 0.9, 0.6, ["Jesus"]),
    ("foot",     "At the foot of the mountain, a father cried out from the crowd.",                   N, 0.95, 0.3, ["father"]),
    ("father",   "Teacher, my son has a spirit that throws him to the ground. Your disciples could not drive it out. If you can do anything, help us!", F, 0.98, 0.4, ["son"]),
    ("ifyoucan", "If you can? Everything is possible for one who believes.",                          J, 0.88, 0.5, ["possible", "believes"]),
    ("help",     "I do believe! Help me overcome my unbelief!",                                       F, 0.95, 0.7, ["believe", "unbelief"]),
    ("healed",   "Jesus rebuked the spirit. The boy shook, then lay still, like he was dead. But Jesus took him by the hand, and lifted him up.", N, 0.92, 0.7, ["hand", "lifted"]),
    ("argue",    "Later, on the road, the disciples argued about which of them was the greatest.",    N, 0.95, 0.4, ["greatest"]),
    ("first",    "Anyone who wants to be first must be the very last, and the servant of all.",       J, 0.88, 0.5, ["last", "servant"]),
    ("child",    "Then he took a little child, and held the child in his arms.",                      N, 0.9, 0.4, ["child"]),
    ("welcome",  "Whoever welcomes one of these little children in my name, welcomes me.",            J, 0.86, 0.5, ["welcomes", "me"]),
    ("water",    "Even a cup of water given in my name will not lose its reward.",                    J, 0.86, 0.9, ["water", "reward"]),
    ("end",      "Follow for part fourteen.",                                                          N, 1.0, 1.0, ["Follow"]),
]
