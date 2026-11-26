"""Special 3 (internal EP=95, folder v102) — "Why Christmas? Why December 25?" Gold line-art style like Specials 1-2.
Facts: the Bible gives no date (Luke 2); earliest record of Dec 25 is the Roman Chronograph of 354 (for the year 336);
two scholarly explanations — the Roman sun festival (Sol Invictus, Dec 25) replaced by Christ the true light, and the
"calculation" theory (Jesus conceived on the date he died, March 25 → +9 months = Dec 25; March 25 = Annunciation).
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
A = "bm_daniel"   # the angel
T = "-"
END_LEAD = 1.7
LINES = [
    ("hook",     "Every December, Christians all over the world celebrate Christmas. But why? And was Jesus really born on the twenty-fifth of December?", N, 0.92, 0.6, ["why", "December"]),
    ("first",    "First: why do we celebrate?",                                                        N, 0.9, 0.4, ["why"]),
    ("became",   "Because on that night in Bethlehem, God became one of us.",                          N, 0.88, 0.5, ["God", "us"]),
    ("word",     "John wrote: The Word became flesh, and lived among us.",                             N, 0.88, 0.5, ["flesh"]),
    ("angel",    "Do not be afraid. I bring you good news of great joy for all the people. Today a Saviour has been born to you. He is Christ the Lord.", A, 0.86, 0.6, ["joy", "Saviour"]),
    ("emmanuel", "His name is Emmanuel, which means: God with us.",                                    N, 0.86, 0.6, ["Emmanuel"]),
    ("close",    "Christmas is not just a birthday. It is the day we remember that God did not stay far away. He came close.", N, 0.88, 0.7, ["close"]),
    ("date",     "Now, the date. Is the twenty-fifth of December really his birthday?",                N, 0.9, 0.5, ["date"]),
    ("never",    "The honest answer: the Bible never tells us the date.",                              N, 0.88, 0.5, ["never"]),
    ("rome",     "The oldest record of Christmas on the twenty-fifth of December comes from Rome, around the year three hundred and thirty-six.", N, 0.9, 0.5, ["Rome"]),
    ("two",      "So why that day? Historians give two main reasons.",                                 N, 0.9, 0.4, ["two"]),
    ("sun",      "One: the Romans held a festival for the sun god on that day. Many believe Christians chose it to celebrate the true light instead: Jesus.", N, 0.9, 0.5, ["sun", "light"]),
    ("march",    "Two: early Christians believed Jesus was conceived on the same date he died, the twenty-fifth of March. Count nine months, and you reach the twenty-fifth of December.", N, 0.9, 0.5, ["March", "nine", "December"]),
    ("annunc",   "That day in March is still celebrated as the Annunciation, when the angel came to Mary.", N, 0.9, 0.5, ["Annunciation"]),
    ("both",     "Many historians think both reasons played a part.",                                 N, 0.9, 0.5, ["both"]),
    ("false",    "So is the date false? The Church never said it was his exact birthday. It is the day Christians chose to celebrate his birth, together.", N, 0.88, 0.6, ["chose", "together"]),
    ("born",     "What matters is not the day he was born. What matters is that he was born.",        N, 0.85, 0.7, ["born"]),
    ("dark",     "And in the lands where Christmas began, it comes in the darkest time of the year, when the nights are longest. Because Jesus said:", N, 0.88, 0.3, ["darkest"]),
    ("light",    "I am the light of the world.",                                                       J, 0.82, 0.7, ["light"]),
    ("gift",     "For God so loved the world, that he gave his one and only Son. That was the first Christmas gift.", N, 0.86, 0.7, ["gave", "gift"]),
    ("end",      "Merry Christmas. Share this with someone you love.",                                 N, 0.95, 1.0, ["Merry"]),
]
