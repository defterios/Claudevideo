"""Special 2 (internal EP=94, folder v101) — "Why Do We Pray for the Dead?" (Catholic answer, with Bible and history facts).
Answers the question directly: two judgements (particular at death, Last at the end), purgatory, the Bible and early-Church
basis for praying for the dead, and the communion of saints. Gold line-art style like Special 1.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
T = "-"
END_LEAD = 1.7
LINES = [
    ("hook",     "If no soul goes to heaven until Judgement Day, why do Catholics pray for the dead?",   N, 0.92, 0.6, ["pray", "dead"]),
    ("two",      "The answer starts with a fact many people miss. The Bible speaks of two judgements.", N, 0.92, 0.5, ["two"]),
    ("once",     "It is appointed for man to die once, and after that comes judgement. Right after death, each soul meets God. The Church calls this the particular judgement.", N, 0.92, 0.5, ["once", "particular"]),
    ("last",     "Then, at the end of time, comes the Last Judgement. The dead will rise in their bodies, and everything will be revealed.", N, 0.92, 0.5, ["Last", "rise"]),
    ("wait",     "So the soul does not simply wait. Jesus told the thief on the cross:",               N, 0.92, 0.3, ["wait"]),
    ("paradise", "Today, you will be with me in paradise.",                                            J, 0.85, 0.6, ["paradise"]),
    ("unclean",  "But the Bible also says: nothing unclean will ever enter heaven.",                  N, 0.9, 0.5, ["unclean"]),
    ("purgatory","Most people die loving God, but not yet perfect. The Church teaches that God finishes the cleansing after death. This is called purgatory.", N, 0.92, 0.5, ["cleansing", "purgatory"]),
    ("fire",     "Paul wrote that some will be saved, but only as through fire.",                     N, 0.9, 0.4, ["fire"]),
    ("age",      "And Jesus spoke of sins that will not be forgiven, in this age, or in the age to come. The Church reads this to mean some sins can be cleansed after this life.", N, 0.92, 0.6, ["come"]),
    ("prayers",  "This is where our prayers come in.",                                                N, 0.9, 0.5, ["prayers"]),
    ("judas",    "More than a hundred and fifty years before Jesus, Judas Maccabeus prayed and offered sacrifice for his fallen soldiers. The Bible says it was a holy thought, that they might be freed from sin.", N, 0.92, 0.5, ["holy", "freed"]),
    ("paul",     "Paul prayed for his friend Onesiphorus, who had most likely died: May the Lord grant him mercy on that day.", N, 0.92, 0.5, ["mercy"]),
    ("catacomb", "The first Christians did the same. Prayers for the dead are carved on the walls of the Roman catacombs.", N, 0.92, 0.5, ["catacombs"]),
    ("monica",   "And as Saint Monica was dying, she asked her son Augustine: Remember me at the altar of the Lord.", N, 0.9, 0.6, ["Remember"]),
    ("family",   "Why does it help? Because the Church is one family: those on earth, those being purified, and those in heaven.", N, 0.92, 0.5, ["earth", "purified", "heaven"]),
    ("separate", "Death cannot break that family. Nothing, not even death, can separate us from the love of God.", N, 0.9, 0.6, ["separate", "love"]),
    ("mercy",    "So when we pray for the dead, we ask God to finish his work of mercy in them, and bring them home.", N, 0.9, 0.6, ["mercy", "home"]),
    ("rest",     "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them.",    N, 0.85, 0.9, ["rest", "light"]),
    ("end",      "Share this with someone who is praying for a loved one today.",                     N, 0.95, 1.0, ["praying"]),
]
