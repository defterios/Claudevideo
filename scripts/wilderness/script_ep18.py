"""Episode 18 — "It Is Finished" (Mark 15). Lit-room cartoon style, handled reverently (no gore).
Big moment: Jesus breathes his last and the temple curtain tears in two, top to bottom. Also: Pilate, Barabbas, thorns,
the cross, darkness at noon, the centurion, the tomb.
Each entry: (scene id, text, voice, speed, pause after in seconds, highlighted caption words)."""
N = "bm_george"   # narrator
J = "am_michael"  # Jesus
L = "bm_daniel"   # Pilate
C = "am_adam"     # the crowd
S = "am_onyx"     # the centurion
T = "-"
END_LEAD = 1.7
LINES = [
    ("morning",  "Very early in the morning, the chief priests tied up Jesus, and handed him over to Pilate.", N, 0.95, 0.3, ["Pilate"]),
    ("king",     "Are you the king of the Jews?",                                                      L, 0.92, 0.4, ["king"]),
    ("said",     "You have said so.",                                                                  J, 0.85, 0.5, ["said"]),
    ("silent",   "The chief priests accused him of many things. But Jesus made no reply, and Pilate was amazed.", N, 0.93, 0.5, ["reply"]),
    ("custom",   "At the festival, Pilate used to release one prisoner. A man called Barabbas was in prison for murder.", N, 0.93, 0.3, ["Barabbas"]),
    ("release",  "Do you want me to release to you the king of the Jews?",                             L, 0.92, 0.3, ["release"]),
    ("barabbas", "Give us Barabbas!",                                                                  C, 1.0, 0.4, ["Barabbas"]),
    ("what",     "Then what shall I do with the one you call the king of the Jews?",                  L, 0.92, 0.3, ["do"]),
    ("crucify",  "Crucify him!",                                                                       C, 1.0, 0.7, ["Crucify"]),
    ("handed",   "To please the crowd, Pilate released Barabbas. He had Jesus flogged, and handed him over to be crucified.", N, 0.92, 0.5, ["flogged"]),
    ("thorns",   "The soldiers put a purple robe on him, and a crown of thorns. They mocked him: Hail, king of the Jews!", N, 0.92, 0.5, ["thorns"]),
    ("simon",    "They forced a man passing by, Simon of Cyrene, to carry his cross. They brought Jesus to Golgotha, the place of the skull.", N, 0.92, 0.4, ["cross", "Golgotha"]),
    ("cross",    "It was nine in the morning when they crucified him. The sign above him read: The King of the Jews.", N, 0.88, 0.6, ["crucified", "King"]),
    ("dark",     "At noon, darkness came over the whole land, until three in the afternoon.",          N, 0.88, 0.6, ["darkness"]),
    ("eloi",     "Eloi, Eloi, lama sabachthani? My God, my God, why have you forsaken me?",            J, 0.8, 0.8, ["Eloi", "forsaken"]),
    ("torn",     "With a loud cry, Jesus breathed his last. And the curtain of the temple was torn in two, from top to bottom.", N, 0.86, 1.0, ["last", "torn"]),
    ("son",      "Surely this man was the Son of God!",                                                S, 0.88, 0.8, ["Son"]),
    ("tomb",     "Joseph of Arimathea took his body, wrapped it in linen, and laid it in a tomb cut out of rock. Then he rolled a stone against the entrance.", N, 0.9, 0.6, ["tomb", "stone"]),
    ("women",    "Mary Magdalene and Mary the mother of Joseph saw where he was laid.",                N, 0.88, 0.9, ["saw"]),
    ("end",      "Follow for the final part.",                                                         N, 1.0, 1.0, ["final"]),
]
