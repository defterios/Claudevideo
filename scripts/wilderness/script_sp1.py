"""Special (filler) episode — "Why Always 3?" The number three across the story of Jesus.
Visual idea: a big "3" counter at the top; every example shows its three items lighting up one by one,
scripture tags on each; the big moment is the third-day sunrise at the empty tomb.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
T = "-"
END_LEAD = 1.7
LINES = [
    ("hook",     "Have you noticed? In the story of Jesus, the number three keeps coming back.",        N, 0.93, 0.5, ["three"]),
    ("gifts",    "Three gifts from the wise men: gold, frankincense, and myrrh.",                       N, 0.93, 0.4, ["gold", "frankincense", "myrrh"]),
    ("temple",   "At twelve years old, Jesus was lost, and found in the temple after three days.",     N, 0.93, 0.4, ["three"]),
    ("tempt",    "In the wilderness, Satan tempted him three times. Three times, Jesus answered with the word of God.", N, 0.93, 0.4, ["three", "word"]),
    ("baptism",  "At his baptism: the Son in the water, the Spirit like a dove, and the Father's voice from heaven.", N, 0.93, 0.5, ["Son", "Spirit", "Father"]),
    ("mountain", "He took three friends up the mountain: Peter, James, and John.",                     N, 0.93, 0.4, ["Peter", "James", "John"]),
    ("pray",     "In Gethsemane, he prayed three times:",                                               N, 0.93, 0.3, ["three"]),
    ("will",     "Father, not my will, but yours.",                                                     J, 0.85, 0.6, ["yours"]),
    ("deny",     "That night, Peter denied him three times.",                                           N, 0.93, 0.4, ["three"]),
    ("crosses",  "On the hill there were three crosses, and the sign above him was written in three languages.", N, 0.93, 0.4, ["crosses", "languages"]),
    ("dark",     "From noon, darkness covered the land for three hours.",                               N, 0.9, 0.5, ["darkness"]),
    ("jonah",    "As Jonah was three days and three nights in the belly of the fish, so the Son of Man will be in the heart of the earth.", J, 0.9, 0.5, ["Jonah"]),
    ("third",    "And on the third day, the tomb was empty.",                                           N, 0.86, 1.0, ["third", "empty"]),
    ("love",     "Later, on the beach, Jesus asked Peter three times: Do you love me? One for every denial.", N, 0.93, 0.6, ["love", "every"]),
    ("why",      "So why three?",                                                                       N, 0.9, 0.6, ["why"]),
    ("holy",     "In Hebrew, saying something three times makes it as strong as it can be. That is why the angels cry: Holy, holy, holy.", N, 0.93, 0.5, ["Holy"]),
    ("witness",  "And the law said: by two or three witnesses, a matter is settled.",                  N, 0.93, 0.4, ["witnesses", "settled"]),
    ("certain",  "So when God does something three times, he is saying: this is certain. This is complete.", N, 0.9, 0.6, ["certain", "complete"]),
    ("remain",   "Faith, hope, and love. These three remain. But the greatest of these is love.",       N, 0.88, 0.9, ["love"]),
    ("end",      "Follow for more.",                                                                    N, 1.0, 1.0, ["Follow"]),
]
