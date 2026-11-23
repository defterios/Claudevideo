"""Special (filler) episode — "Do You Love Me?" Peter's three denials and three restorations
(Matthew 10:33, Mark 14:27-72, Luke 22:61, John 18 & 21). Lit-room cartoon style with speech bubbles,
a ✗✗✗ denial counter that turns into ✓✓✓, scripture tags and a modern-day cutaway (lunch / work).
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
P = "am_fenrir"   # Peter
G = "af_bella"    # servant girl
S = "am_liam"     # bystander
T = "-"
END_LEAD = 1.7
LINES = [
    ("warn",   "Whoever denies me before others, I will deny before my Father in heaven.",       J, 0.9, 0.5, ["denies"]),
    ("boast",  "Even if I have to die with you, I will never deny you!",                          P, 0.95, 0.4, ["never"]),
    ("rooster","Peter, before the rooster crows twice, you will deny me three times.",           J, 0.9, 0.6, ["three"]),
    ("arrest", "That same night, soldiers arrested Jesus. Peter followed, far behind.",          N, 0.95, 0.4, ["far"]),
    ("fire",   "He sat in the courtyard, warming himself by a fire of coals.",                   N, 0.93, 0.5, ["coals"]),
    ("girl",   "You were with that man from Nazareth!",                                          G, 0.95, 0.3, ["Nazareth"]),
    ("deny1",  "I don't know what you're talking about.",                                        P, 1.0, 0.6, ["know"]),
    ("girl2",  "This man is one of them!",                                                       G, 0.95, 0.3, ["one"]),
    ("deny2",  "I am not!",                                                                      P, 1.0, 0.6, ["not"]),
    ("accent", "Surely you are one of them. Your accent gives you away.",                        S, 0.95, 0.3, ["accent"]),
    ("deny3",  "I do not know the man!",                                                         P, 1.0, 0.8, ["man"]),
    ("crow",   "Right then, the rooster crowed. And the Lord turned, and looked at Peter.",      N, 0.9, 0.6, ["looked"]),
    ("wept",   "Peter went outside, and wept bitterly.",                                         N, 0.88, 0.9, ["bitterly"]),
    ("us",     "Peter never planned to deny him. He only wanted to stay warm. We do the same. A joke at lunch, a question at work, and we go quiet.", N, 0.93, 0.6, ["warm", "quiet"]),
    ("cross",  "Jesus died. Three days later, the tomb was empty.",                              N, 0.9, 0.7, ["died", "empty"]),
    ("beach",  "Then, on a beach at sunrise, Jesus made breakfast on another fire of coals.",    N, 0.93, 0.5, ["another"]),
    ("love",   "Simon, do you love me?",                                                         J, 0.86, 0.5, ["love"]),
    ("yes",    "Yes, Lord. You know that I love you.",                                           P, 0.92, 0.5, ["love"]),
    ("three",  "Three times Jesus asked. Three denials. Three chances to say it again.",         N, 0.92, 0.6, ["chances"]),
    ("feed",   "Feed my sheep. Follow me.",                                                      J, 0.86, 0.9, ["Follow"]),
    ("end",    "If you have gone quiet, he is still asking. Follow for more.",                   N, 0.95, 1.0, ["asking"]),
]
