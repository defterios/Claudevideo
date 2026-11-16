"""Episode 2 — 'Would You Survive a Muay Thai Fight Camp?' (same format as script.py: (scene, text, pause)).
Voice-over: recorded by the creator. Scene timing is taken from the recording (per-line alignment)."""

TITLE = "Would You Survive a Muay Thai Fight Camp?"
THUMBNAIL = ("30 DAYS IN A", "MUAY THAI CAMP")

LONG = [
    ("hook", "You just booked a one-month trip to a Muay Thai camp in Thailand. Sun, beaches, maybe a little training.", 0.3),
    ("hook", "But the moment you arrive, you realize... this is not a holiday.", 0.3),
    ("hook", "So... would you survive a Muay Thai fight camp?", 0.7),
    ("run", "Day one. Six a.m. Your alarm goes off, and the trainers are already waiting outside.", 0.25),
    ("run", "Before you even touch a glove, there's a morning run. In thirty-degree heat, with humidity so thick it feels like breathing through a wet towel.", 0.6),
    ("pads", "Then come the pads. Your trainer holds them up and yells one word, over and over: again!", 0.25),
    ("pads", "Round after round of kicks, knees, and elbows, until your arms feel like noodles.", 0.6),
    ("shins", "By the evening, your shins are covered in bruises. Muay Thai fighters kick with the shin, not the foot.", 0.25),
    ("shins", "And the heavy bags feel like kicking a tree. Over the months, your shins get tougher. But for now? Every kick hurts.", 0.7),
    ("schedule", "Week one: you learn the real schedule. Train in the morning. Eat. Sleep. Then train again in the afternoon.", 0.25),
    ("schedule", "Two sessions a day, six days a week. Your body has never been this tired.", 0.7),
    ("clinch", "Week two: the clinch. Two fighters lock up, fighting for head position and throwing knees.", 0.25),
    ("clinch", "Your neck burns, your legs shake, and someone half your size keeps throwing you to the floor.", 0.7),
    ("spar", "Week three: your first sparring. It's controlled, but now someone is actually hitting back.", 0.25),
    ("spar", "You drop your guard. You eat a push kick to the stomach. And for a second, you can't breathe.", 0.7),
    ("fight", "Week four: fight night. The stadium is loud, and the traditional music starts as you walk to the ring.", 0.25),
    ("fight", "Three rounds. Three minutes each. It sounds short... until the first round ends, and your lungs are already on fire.", 0.7),
    ("takes", "So what does it take to survive? Cardio for the heat. Shins that can take the pain.", 0.2),
    ("takes", "The discipline to wake up at six, every single day. And the heart to keep going when your body says stop.", 0.7),
    ("cta", "So be honest... would you survive a Muay Thai fight camp? Tell me in the comments, and follow for more.", 0.8),
]

# Narration is recorded by the creator (no AI voice). The 9:16 version is cut from the SAME recording:
# 1-based line numbers of LONG used in the short version.
SHORT_LINES = [1, 3, 5, 7, 8, 11, 13, 15, 17, 20]
SHORT = [LONG[i - 1] for i in SHORT_LINES]
