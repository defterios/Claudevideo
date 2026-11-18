"""Episode 1 (remake) — 'Would You Survive WWE Training?' — creator-recorded voice-over, 3D style.
Format: (scene, text, pause). Outputs: YouTube 16:9 + TikTok 9:16 (full length, no short cut)."""

TITLE = "Would You Survive WWE Training?"
THUMBNAIL = ("WILL YOU SURVIVE", "WWE TRAINING?")

LONG = [
    ("hook", "You just got the call. WWE wants you at a tryout.", 0.35),
    ("hook", "But here's the thing: most people who walk through those doors never make it to TV.", 0.3),
    ("hook", "So... would you survive WWE training?", 0.7),
    ("pc", "Day one. You walk into the WWE Performance Center in Orlando, Florida.", 0.3),
    ("pc", "It's a giant warehouse full of wrestling rings, weights, and people way bigger than you.", 0.25),
    ("pc", "College athletes. Olympians. Bodybuilders. And then... there's you.", 0.6),
    ("bump", "Your first lesson isn't a cool move. It's learning how to fall.", 0.25),
    ("bump", "Wrestlers call it taking a bump. Chin tucked, arms out, land flat on your back.", 0.5),
    ("ring", "Sounds easy... until you hit the mat for the first time.", 0.25),
    ("ring", "Because a wrestling ring isn't a trampoline. It's a steel frame, wooden boards, and a thin layer of foam.", 0.25),
    ("ring", "Every bump feels like falling onto a table.", 0.5),
    ("bumps", "And you'll take dozens of them. Then dozens more.", 0.25),
    ("bumps", "By the end of the day, your back is purple, and you can't even sit down without groaning.", 0.7),
    ("ropes", "Day two: the ropes. You've seen wrestlers bounce off them like it's nothing.", 0.25),
    ("ropes", "Then you find out the ropes are steel cables, wrapped in rubber hose and tape.", 0.25),
    ("ropes", "Run them for ten minutes, and you'll have bruises across your ribs.", 0.7),
    ("cardio", "Week two: cardio. A wrestling match is a sprint that can last fifteen, twenty, even thirty minutes.", 0.25),
    ("cardio", "Coaches make you run drills until your lungs are on fire...", 0.2),
    ("cardio", "then tell you to do it again. But this time... smile for the crowd.", 0.7),
    ("promo", "Month two: promo class. Turns out being athletic isn't enough.", 0.25),
    ("promo", "You have to grab a microphone, look into a camera, and make people care about you.", 0.25),
    ("promo", "Your voice shakes. You forget your lines. The coaches just stare... in silence.", 0.7),
    ("live", "Month six: your first live event. A few hundred fans, a small building, and you.", 0.25),
    ("live", "The music hits, the crowd is watching, and every mistake happens in front of real people.", 0.25),
    ("live", "Your heart is pounding harder than any workout.", 0.7),
    ("road", "And if you're one of the few who make it to the main roster?", 0.25),
    ("road", "Now you're on the road for most of the year. A different city almost every night.", 0.25),
    ("road", "Airports, hotel rooms, gyms, and arenas. No off-season.", 0.7),
    ("takes", "So what does it take to survive? A body that can take punishment.", 0.2),
    ("takes", "Cardio that never quits. The confidence to talk in front of millions.", 0.2),
    ("takes", "And the mindset to get back up, after every single bump.", 0.7),
    ("cta", "So be honest... would you survive WWE training? Tell me in the comments, and follow for more.", 0.8),
]

# cue words (scene-local timing for animation) and sound effects at those cues
CUES = {
    "hook": ["call", "WWE", "doors", "survive"],
    "pc": ["Day", "Performance", "warehouse", "College", "Olympians", "Bodybuilders", "there's"],
    "bump": ["lesson", "fall", "bump", "Chin", "land"],
    "ring": ["mat", "trampoline", "steel", "foam", "table"],
    "bumps": ["dozens", "more", "purple", "groaning"],
    "ropes": ["ropes", "bounce", "steel", "ten", "bruises"],
    "cardio": ["cardio", "sprint", "fifteen", "drills", "fire", "again", "smile"],
    "promo": ["promo", "microphone", "camera", "shakes", "forget", "stare"],
    "live": ["live", "hundred", "music", "mistake", "heart"],
    "road": ["main", "road", "city", "Airports", "off-season"],
    "takes": ["take", "body", "Cardio", "confidence", "mindset", "bump"],
    "cta": ["honest", "survive", "comments", "follow"],
}
SFX = {
    "hook": [("call", "ringtone", 0.3), ("WWE", "whoosh_slide", 0.3), ("doors", "slam", 0.35), ("survive", "ring_bell", 0.45), ("survive", "boom", 0.3)],
    "pc": [("Performance", "whoosh_slide", 0.3), ("College", "pop", 0.3), ("Olympians", "pop", 0.3), ("Bodybuilders", "pop", 0.3), ("there's", "cartoon_down", 0.35)],
    "bump": [("fall", "whoosh_fast", 0.3), ("land", "slam", 0.55)],
    "ring": [("mat", "slam", 0.6), ("steel", "clank", 0.35), ("table", "thud", 0.5)],
    "bumps": [("dozens", "slam", 0.4), ("more", "slam", 0.45), ("purple", "pop", 0.3), ("groaning", "cartoon_down", 0.3)],
    "ropes": [("bounce", "boing", 0.3), ("steel", "clank", 0.35), ("bruises", "body_hit", 0.45)],
    "cardio": [("sprint", "whistle", 0.35), ("fire", "whoosh_fast", 0.3), ("again", "whistle", 0.4), ("smile", "snap_glassy", 0.35)],
    "promo": [("microphone", "mic_feedback", 0.25), ("camera", "shutter", 0.35), ("forget", "dizzy", 0.3), ("stare", "tick", 0.35)],
    "live": [("live", "crowd_cheer", 0.3), ("music", "riser", 0.3), ("heart", "thud", 0.45)],
    "road": [("road", "whoosh_slide", 0.3), ("Airports", "airplane", 0.35), ("off-season", "pop", 0.3)],
    "takes": [("body", "pop", 0.35), ("Cardio", "pop", 0.35), ("confidence", "pop", 0.35), ("mindset", "pop", 0.35), ("bump", "slam", 0.4)],
    "cta": [("survive", "ring_bell", 0.4), ("comments", "notif_a", 0.4), ("follow", "pop", 0.35)],
}
