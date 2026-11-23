"""Special episode — "I Know Not the Man" (Peter's three denials and the two fires of coals).
Follows the beats of the creator's reference video in original narration; Bible quotes are KJV (public domain).
Visual: ✗ counter at top (one per denial), speech bubbles for the accusations, scripture tags,
modern cutaway (lunch / work), second fire of coals on the beach where ✗✗✗ turn into ✓✓✓.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
P = "am_fenrir"   # Peter
G = "af_bella"    # servant girl
S = "am_liam"     # bystander
T = "-"
END_LEAD = 1.7
LINES = [
    ("warn",    "Jesus warned: whoever denies me before people, I will deny before my Father.",        N, 0.93, 0.4, ["denies"]),
    ("hook",    "One of his closest friends did it three times, in a single night. And his words are words we still say today.", N, 0.95, 0.4, ["three"]),
    ("peter",   "His name was Peter. That evening, he made a promise:",                                N, 0.95, 0.3, ["Peter"]),
    ("promise", "Though I should die with thee, yet will I not deny thee.",                            P, 0.92, 0.5, ["not"]),
    ("arrest",  "Hours later, soldiers took Jesus away. Peter followed, but far behind.",              N, 0.95, 0.4, ["far"]),
    ("fire",    "In the cold courtyard, the guards lit a fire of coals. Peter stepped close to warm his hands.", N, 0.93, 0.4, ["coals"]),
    ("girl",    "This man was also with him.",                                                         G, 0.95, 0.3, ["with"]),
    ("deny1",   "Woman, I know him not.",                                                              P, 1.0, 0.6, ["not"]),
    ("later",   "A little later, someone else noticed him.",                                           N, 0.95, 0.2, ["else"]),
    ("other",   "Thou art also of them.",                                                              S, 0.95, 0.3, ["them"]),
    ("deny2",   "Man, I am not.",                                                                      P, 1.0, 0.6, ["not"]),
    ("hour",    "About an hour later, a third. Peter began to curse and swear:",                      N, 0.95, 0.2, ["third"]),
    ("deny3",   "I know not the man.",                                                                 P, 0.95, 0.8, ["man"]),
    ("rooster", "Before he finished speaking, the rooster crowed. But Luke adds one more detail.",    N, 0.93, 0.5, ["rooster"]),
    ("looked",  "And the Lord turned, and looked upon Peter.",                                         N, 0.85, 0.8, ["looked"]),
    ("wept",    "Jesus was near enough to see him. Peter went out, and wept bitterly.",               N, 0.9, 0.8, ["bitterly"]),
    ("warm",    "Peter never meant to deny him. He just wanted to stay warm by the fire.",            N, 0.93, 0.4, ["warm"]),
    ("us",      "And we do the same. A joke at lunch. A question at work. And we say nothing.",       N, 0.93, 0.6, ["lunch", "work", "nothing"]),
    ("cross",   "Jesus was crucified. The last thing Peter said about him was: I know not the man.",  N, 0.9, 0.7, ["crucified"]),
    ("tomb",    "Three days later, the tomb was empty.",                                               N, 0.88, 0.8, ["empty"]),
    ("beach",   "Then one morning, by the sea, Jesus was waiting for Peter, beside another fire of coals.", N, 0.92, 0.5, ["another"]),
    ("lovest",  "Simon, son of Jonas, lovest thou me?",                                                J, 0.86, 0.6, ["lovest"]),
    ("third",   "He asked again. And a third time. Three denials, three chances to answer.",          N, 0.92, 0.6, ["three"]),
    ("bfast",   "Jesus did not reject Peter. He cooked him breakfast.",                                N, 0.92, 0.6, ["breakfast"]),
    ("calling", "So if you have gone silent about Jesus, remember: he is still calling your name.",   N, 0.9, 0.6, ["calling"]),
    ("end",     "Share this with someone who needs a second chance.",                                 N, 0.95, 1.0, ["second"]),
]
