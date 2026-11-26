"""Special 2 (internal EP=94, folder v101) — "Why Do We Pray for the Dead?"
Bible-based and fair to both traditions: what happens at death (with God now; resurrection and judgement at the end),
why Catholic/Orthodox Christians pray for the dead (2 Maccabees 12) and why many Protestants do not (Hebrews 9:27),
and why every Christian prays at a funeral. Gold line-art style like Special 1.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
T = "-"
END_LEAD = 1.7
LINES = [
    ("hook",     "When someone we love dies, we pray for them. But if judgement only comes at the end of time, why do we pray?", N, 0.92, 0.6, ["pray", "why"]),
    ("what",     "First, what does the Bible say happens when we die?",                                N, 0.92, 0.5, ["die"]),
    ("dust",     "The body returns to the dust, and the spirit returns to God who gave it.",          N, 0.9, 0.5, ["dust", "God"]),
    ("thief",    "On the cross, Jesus told the thief beside him:",                                    N, 0.92, 0.3, ["thief"]),
    ("paradise", "Today, you will be with me in paradise.",                                           J, 0.85, 0.6, ["paradise"]),
    ("home",     "And Paul wrote: to be away from the body is to be at home with the Lord.",          N, 0.92, 0.5, ["home"]),
    ("rise",     "But the story is not finished. One day, the dead will rise, and everyone will stand before God.", N, 0.9, 0.5, ["rise", "stand"]),
    ("sleep",    "That is why Paul calls death a sleep. Because one day, the dead will wake up.",     N, 0.9, 0.6, ["sleep", "wake"]),
    ("two",      "So the Bible speaks of both: rest with God now, and resurrection and judgement at the end.", N, 0.9, 0.6, ["now", "end"]),
    ("why",      "So why do we pray? Christians answer this in different ways.",                     N, 0.92, 0.5, ["different"]),
    ("catholic", "Catholic and Orthodox Christians pray for the dead, asking God to show them mercy. They follow Second Maccabees, where Judas prayed for fallen soldiers, so they would be freed from sin.", N, 0.93, 0.5, ["mercy", "freed"]),
    ("protest",  "Many Protestant Christians do not pray for the dead, because the Bible says: people die once, and after that comes judgement.", N, 0.93, 0.6, ["once", "judgement"]),
    ("all",      "But every Christian prays when someone dies. And here is why.",                    N, 0.9, 0.5, ["every"]),
    ("comfort",  "We pray for those who are left behind. Our God is the God of all comfort.",        N, 0.9, 0.5, ["comfort"]),
    ("hope",     "We pray because we do not grieve like people who have no hope.",                    N, 0.9, 0.5, ["hope"]),
    ("thanks",   "We pray to thank God for the life he gave us, and the time we shared.",            N, 0.9, 0.5, ["thank"]),
    ("life",     "I am the resurrection and the life. Whoever believes in me will live, even though they die.", J, 0.85, 0.7, ["resurrection", "live"]),
    ("living",   "God is not the God of the dead, but of the living. For to him, all are alive.",    N, 0.88, 0.7, ["living", "alive"]),
    ("love",     "So we pray in hope, in comfort, and in love. Because love never ends.",            N, 0.88, 0.9, ["hope", "comfort", "love"]),
    ("end",      "Share this with someone who is missing someone today.",                             N, 0.95, 1.0, ["missing"]),
]
