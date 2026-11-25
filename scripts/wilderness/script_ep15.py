"""Episode 15 — "Hosanna!" (Mark 11). Lit-room cartoon style.
Big moment: Jesus overturns the money changers' tables (coins scatter, doves burst free). Opening: the donkey ride and palm branches.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
C = "am_adam"     # the crowd
P = "am_fenrir"   # Peter
T = "-"
END_LEAD = 1.7
LINES = [
    ("near",     "As they came near Jerusalem, Jesus sent two of his disciples ahead.",               N, 0.95, 0.3, ["Jerusalem"]),
    ("donkey",   "Go into the village. You will find a young donkey tied there, that no one has ever ridden. Untie it, and bring it here.", J, 0.9, 0.4, ["donkey"]),
    ("ride",     "They brought the donkey to Jesus, threw their cloaks over it, and he sat on it.",   N, 0.95, 0.3, ["cloaks"]),
    ("branches", "Many spread their cloaks on the road, and others spread branches they had cut in the fields.", N, 0.95, 0.3, ["branches"]),
    ("hosanna",  "Hosanna! Blessed is he who comes in the name of the Lord!",                         C, 1.0, 0.8, ["Hosanna", "Blessed"]),
    ("fig",      "The next day, Jesus was hungry. He saw a fig tree in leaf, but found nothing on it, only leaves.", N, 0.93, 0.4, ["fig", "leaves"]),
    ("curse",    "May no one ever eat fruit from you again.",                                         J, 0.88, 0.6, ["ever"]),
    ("temple",   "In Jerusalem, Jesus entered the temple. It was full of people buying and selling.", N, 0.93, 0.3, ["temple"]),
    ("tables",   "He overturned the tables of the money changers, and the benches of those selling doves.", N, 0.95, 0.7, ["overturned", "doves"]),
    ("prayer",   "Is it not written: My house will be called a house of prayer for all nations? But you have made it a den of robbers!", J, 0.9, 0.6, ["prayer", "robbers"]),
    ("plot",     "The chief priests heard this, and began looking for a way to kill him. For the whole crowd was amazed at his teaching.", N, 0.93, 0.5, ["kill", "amazed"]),
    ("withered", "The next morning, they passed the fig tree. It had withered, from the roots.",     N, 0.92, 0.3, ["withered"]),
    ("look",     "Teacher, look! The fig tree you cursed has withered!",                              P, 1.0, 0.4, ["look"]),
    ("faith",    "Have faith in God. If anyone says to this mountain: Go, throw yourself into the sea, and does not doubt, it will be done.", J, 0.88, 0.6, ["faith", "mountain"]),
    ("believe",  "Whatever you ask for in prayer, believe that you have received it, and it will be yours.", J, 0.86, 0.5, ["believe"]),
    ("forgive",  "And when you stand praying, if you hold anything against anyone, forgive them.",   J, 0.86, 0.9, ["forgive"]),
    ("end",      "Follow for part sixteen.",                                                           N, 1.0, 1.0, ["Follow"]),
]
