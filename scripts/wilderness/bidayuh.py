"""Bidayuh (Bau) version: cut the creator's voiceover into the 18 script lines and write timing.json + voice.wav
in the same format as tts.py, so build.py can be reused.   Usage: bidayuh.py <voice.wav 24k mono> <out dir>
Each line: (scene, Bidayuh text, tempter?, start/end in the raw recording, caption keywords, {english cue: bidayuh word})."""
import sys, json, os, re, wave, subprocess, tempfile
import numpy as np
import importlib
EP = int(os.environ.get("EP", "1"))
SC = importlib.import_module("script" if EP == 1 else f"script_ep{EP}")

LINES = [  # episode 1
    ("Slama 30 sowa, yeh jek eh tukang koyuh. Doi nyaa piruh eh.", 6.35, 10.95, ["tukang", "koyuh", "Doi"], {"nobody": "Doi"}),
    ("Jadi daang 1 pagi, yeh meh muun ke sungi.", 11.95, 14.9, ["sungi"], {}),
    ("Longit pun meh tibuka.", 15.25, 17.4, ["Longit", "tibuka"], {"tore": "tibuka"}),
    ("Ogi suara nang: Muu onak Ku, Oku nyayang muu.", 17.85, 23.35, ["onak", "nyayang"], {"you": "Muu", "son": "onak", "love": "nyayang"}),
    ("Mokuo de munu tia? Yeh meh toban dep eh ke padang pasir.", 24.2, 28.45, ["toban", "padang", "pasir"], {"desert": "padang"}),
    ("40 onu. Doi pinguman. Jek eh bonguh, batuh, duoh binatang buas.", 29.5, 35.25, ["40", "pinguman", "buas"], {"forty": "40", "no": "Doi", "just": "Jek", "wild": "binatang"}),
    ("Mokuo inuh meh ogi suara nang.", 36.15, 38.5, ["suara"], {"whisper": "suara"}),
    ("Muu neh pirai. Duok tukar batuh itih jadi ruti.", 39.8, 43.65, ["pirai", "ruti"], {"turn": "tukar", "bread": "ruti"}),
    ("Yeh meh nang: Misia ideh di eh idip pakai pinguman sija.", 44.2, 49.15, ["ideh", "sija"], {"man": "Misia", "live": "idip"}),
    ("Bitabung. Pikirien mu onak Topa.", 50.8, 53.8, ["Bitabung", "Pikirien"], {}),
    ("Yeh nang in eh: Ma mu suba Topa.", 54.8, 58.1, ["suba"], {}),
    ("Sujud tudu oku, tie suo de muti jadi tu dimu. Doi monam, doi salip.", 58.55, 66.1, ["Sujud", "dimu", "salip"], {"all": "tie", "yours": "dimu", "cross": "salip"}),
    ("Yeh de meh pirai, kowek, sadi eh ade.", 67.88, None, ["pirai", "sadi"], {"alone": "sadi"}),
    ("Meh in eh: Buu.", None, 72.9, ["Buu"], {"go": "Buu"}),
    ("Muot pun meh buu. Ju Malaikat meh neg.", 74.38, 76.95, ["buu", "Malaikat"], {"angels": "Malaikat"}),
    ("Jesus ruah suo padang pasir inuh romah, kowek tapi masih gogah mun pimonu eh.", 78.1, 83.5, ["gogah"], {}),
    ("Masa meh rie neg, Pritah Topa meh sinek.", 83.95, 87.8, ["Masa", "Pritah", "sinek"], {}),
    ("Follow suo part 2.", 93.2, 94.75, ["Follow"], {}),  # spoken "Bidayuh, Episod 1: Padang Pasir" removed; title card shows it
]
LINES2 = [  # episode 2 (alias "word#2" = second occurrence of that word)
    ("Takar Jesus ponu de pang laut Galilee. Yeh kirin 2 sikie sudi ngijaring.", 5.15, 9.45, ["Galilee", "ngijaring"], {}),
    ("Simon duoh Andrew. De kroja takap kien, masih doi koyuh de daped eh.", 9.7, 14.85, ["Simon", "Andrew", "doi"], {"nothing": "doi"}),
    ("Yeh nang: Nuna Oku. Oku rie ngajar ingan ngijaring misia da jagin rayat Ku.", 15.45, 20.95, ["Nuna", "Oku", "misia"], {"follow": "Nuna", "fishers": "ngijaring"}),
    ("Torus nya munu posan jaring eh.", 21.45, 23.45, ["posan", "jaring"], {"dropped": "posan"}),
    ("Doi juo suo kanu, James duoh John dowoh orud duoh sama eh.", 24.7, 29.3, ["James", "John", "sama"], {}),
    ("Yeh mogan nya munu. Nya munu sua geh supieh orud, sama, duoh suo de boken.", 30.35, 35.35, ["mogan", "boken"], {"called": "mogan", "left": "supieh", "everything": "boken"}),
    ("Daang Capernaum. Yeh meh ngajar dang synagogue.", 36.15, 39.5, ["Capernaum", "ngajar"], {}),
    ("Ideh di koda guru, tapi koda nya'a de ogi kiasa eh.", 40.3, 43.5, ["kiasa"], {"someone": "tapi"}),
    ("Mokuo inuh meh ogi nyaa ngrais.", 44.0, 46.1, ["ngrais"], {"screaming": "ngrais"}),
    ("Oni de ran mu duoh koih? Oku puan osi Ingan!", 47.3, 50.8, ["puan", "Ingan"], {}),
    ("Yeh meh in eh: Ngorok nya. Ruah suo gonan yeh.", 51.4, 55.7, ["Ngorok", "Ruah"], {"quiet": "Ngorok", "out": "Ruah"}),
    ("Nya inuh meh gogeh, ngam ngrais, ju muot meh ruah.", 56.8, 60.8, ["gogeh", "ruah"], {"gone": "ruah"}),
    ("Dang ngumi inuh, Tua Simon meh bonguh da aen.", 63.15, 66.85, ["bonguh", "aen"], {}),
    ("Yeh meh mit tongan eh. Aen inuh meh musuop.", 67.55, 70.55, ["tongan", "musuop"], {"hand": "tongan", "left": "musuop"}),
    ("Sibayuh boten onu rabu, ni kupuo inuh meh kajen de dopan tiban.", 71.95, 75.6, ["kupuo", "tiban"], {}),
    ("Ju dari de ogi onam eh meh guru ngoruob dopan yeh.", 76.45, 79.05, ["onam", "ngoruob"], {"knees": "ngoruob"}),
    ("Asa Ingan raan, Ingan daped da oku bait.", 80.1, 82.9, ["bait"], {}),
    ("Doi nya toma nya de ogi onam inuh. Yeh meh toma eh duoh sobut: Raan Ku. Bait negeh.", 83.35, 90.7, ["Doi", "toma", "Bait"], {"touched": "toma#2", "clean": "Bait"}),
    ("Follow suo part 3.", 92.05, 94.3, ["Follow"], {}),
]
LINES3 = [  # episode 3 (line 19 was not recorded: start None = silent line)
    ("Takar de Capernaum, Nyaa meh laju puan brita. Jesus meh pari ke bori.", 4.8, 10.45, ["Capernaum", "bori"], {}),
    ("Punuo nya de bori eh. Doi sukup topat. Bidodat neg ke tiban.", 11.1, 15.5, ["Punuo", "tiban"], {}),
    ("4 urang nyaa toban dingan eh de pirie pakai tawiek.", 16.0, 19.85, ["4", "pirie"], {}),
    ("Dari de 4 inuh doi daped moret. Ju meh maad ke bung bori inuh.", 20.75, 24.3, ["moret", "bung"], {"roof": "bung"}),
    ("Ju meh ngirokang bungan eh.", 24.5, 26.75, ["ngirokang", "bungan"], {"dug": "ngirokang", "through": "bungan"}),
    ("Dari inuh meh obuoh pimuun, rimongan Jesus mujuog.", 27.7, 30.9, ["pimuun", "Jesus"], {"lowered": "obuoh"}),
    ("Jesus puan nya munu bisaya, yeh meh nang: Oo madih, dusa mu meh obuoh apun.", 31.5, 37.6, ["bisaya", "apun"], {"son": "madih", "forgiven": "apun"}),
    ("Guru adat de guru danu meh pikir:", 38.7, 40.5, ["Guru"], {}),
    ("Oni nya itih pak nang koyuh de in ninu? Jek eh Topa sija de daped ngapun dusa nya neh.", 40.85, 46.05, ["Topa", "dusa"], {}),
    ("Jesus sobut nudu dari de pirie inuh. Mokat. Mit omek mu. Maad tia.", 46.75, 53.2, ["Mokat", "omek"], {"up": "Mokat"}),
    ("Dari de pirie inuh meh mujuog. De dopan suo nya.", 53.9, 58.1, ["mujuog", "suo"], {"stood": "mujuog"}),
    ("Nyaa de boge tia meh gogeh. Tiboon manah-manah geh nya kirin koyuh de watitih neh!", 58.45, 62.85, ["gogeh", "Tiboon"], {}),
    ("Sodang tian ade, Jesus bidaped duoh nyaa de koja mit sukie. Levi. Nyaa de boge rakyat doi suka eh.", 64.0, 71.45, ["Levi", "suka"], {}),
    ("Jesus nang: Get nuna Oku. Levi meh mokat nuna Jesus.", 72.35, 77.4, ["nuna", "mokat"], {"follow": "nuna", "followed": "mokat"}),
    ("Ngaruom inuh, Levi ngija nya biayuo de bori eh. Nyaa de kroja mit sukie. Duoh bara de gia nya nang bidusa. Duoh Jesus, ogi de tongah eh.", 78.3, 88.4, ["biayuo", "bidusa", "tongah"], {}),
    ("Oni yeh pak bisapur de nya de gia bidusa?", 89.95, 92.4, ["bidusa"], {}),
    ("Jesus meh nang: Nya de gogah ideh di karik doktor. Nya de monam sija.", 93.45, 98.95, ["doktor", "monam"], {}),
    ("Oku neg ideh ku rie mogan nya de pikir yeh paguh de otin eh. Oku neg suo nyaa de bidusa.", 99.85, 106.15, ["neg", "bidusa"], {"came": "neg#2"}),
    ("", None, None, [], {}),
]
LINES4 = [  # episode 4 (line 13 not recorded)
    ("Dang onu Sabbath, Jesus biayuo de onak murid eh ponu nuna tota gondom.", 3.3, 7.8, ["Sabbath", "gondom"], {}),
    ("Ninga. Nya munu bitupas de gondom.", 8.8, 10.65, ["bitupas"], {"breaking": "bitupas"}),
    ("Topa nai Sabbath suo misia. Ideh nai misia suo Sabbath.", 12.15, 15.8, ["misia"], {}),
    ("Sodang tian ade de synagogue, tonga ni dari noman tongan eh de nawa.", 17.35, 21.4, ["nawa"], {"withered": "nawa"}),
    ("Bara Farisi prati Jesus. Rie kajen yeh doi nuna pritah onu Sabbath.", 22.45, 27.2, ["prati"], {}),
    ("Mokat nya. Get ke tongah itih.", 28.4, 30.5, ["tongah"], {"come": "Get"}),
    ("Patut keh ideh dang onu Sabbath otte nai koyuh de paguh, atau koyuh de jaat? Te ngramat nyawa, ato katod eh?", 32.2, 39.5, ["paguh", "jaat", "nyawa", "katod"], {"good": "paguh", "life": "nyawa", "kill": "katod"}),
    ("Suo nya meh ngorek.", 40.25, 41.3, ["ngorek"], {}),
    ("Nongon tongan mu.", 42.55, 43.75, ["tongan"], {"hand": "tongan"}),
    ("Tongan eh meh bait.", 44.45, 45.45, ["bait"], {}),
    ("Ngaruom inuh, bala Farisi meh bipokat dupan dep eh.", 46.4, 49.15, ["Farisi"], {}),
    ("Yeh inuh mesti rie kobes.", 49.75, 51.85, ["kobes"], {"die": "kobes"}),
    ("", None, None, [], {}),
]
LINES5 = [  # episode 5 (denoised take; line 16 not recorded). Lines with characters speaking are split in PARTS.
    ("Nyaa meh puan pasal Jesus. Sapai meh bogo nuna yeh kati kanih. Brobut rie toma Yeh.", 1.45, 7.3, ["Jesus", "toma"], {}),
    ("Yeh meh da onak murit eh sidia orud, sa eh di pisiet da nyaa.", 8.0, 11.85, ["orud"], {}),
    ("Nyaa de ogi muot de gonan eh sapai toru duoh ngrais.", 12.9, 16.15, ["muot", "ngrais"], {}),
    ("Muu en eh Onak Topa!", 16.2, 18.4, ["Onak", "Topa"], {}),
    ("Mokuo nuh yeh meh maad ke pungu, duoh mogan bara de rie da Eh nuna Dep eh.", 19.05, 23.4, ["pungu", "mogan"], {"called": "mogan"}),
    ("Simon, Jesus praden yeh Peter. James duoh John, onak Zebedee, yaa de koda dudu. Andrew. Philip. Bartholomew.", 24.6, 30.95, ["Peter", "dudu"], {}),
    ("Matthew. Thomas. James. Thaddeus. Simon.", 31.3, 36.15, ["Matthew", "Thomas"], {}),
    ("Duoh Judas Iscariot. Nyaa de rie jua Jesus.", 36.2, 39.75, ["Judas", "jua"], {"betray": "jua"}),
    ("12 urang rasol eh. Rie da ponu magah Gah de Paguh, duoh kasig pibuu muot.", 41.3, 46.8, ["12", "rasol"], {}),
    ("", 48.5, 54.95, ["madis", "gira"], {"said": "nang"}),
    ("", 55.9, 58.65, ["raja"], {}),
    ("", 59.6, 68.0, ["bisamah", "mujuog"], {"divided": "bisamah", "stand": "mujuog"}),
    ("Sino duoh sikie sudi Jesus meh neg, kajen de ruar ju meh sobut duoh nya da Jesus ruah.", 69.1, 75.25, ["Sino", "ruar"], {}),
    ("", 76.0, 79.45, ["sino", "sikie"], {}),
    ("", 80.9, 87.0, ["sikie", "sino"], {}),
    ("", None, None, [], {}),
]
# (episode, line index) -> parts: (text, raw start, raw end, voice effect or None for the narrator)
PARTS = {
    (5, 9): [("Takar madis ayuo eh meh puan, nya munu meh neg rie toban Jesus pari. Nya munu nang:", 48.5, 53.8, None), ("Yeh meh gira.", 53.83, 54.95, "family")],
    (5, 10): [("Yeh kasig muot pakai kuasa raja muot!", 55.9, 58.65, "scholar")],
    (5, 11): [("Jesus nang:", 59.6, 61.1, None), ("Watki Sitan kasig pibuu Sitan? Bori de doi bisamah otin eh, ideh di daped mujuog tuui.", 61.6, 68.0, "jesus")],
    (5, 13): [("Jesus meh in eh:", 76.0, 77.1, None), ("Osi sino duoh sikie sudi ku?", 77.9, 79.45, "jesus")],
    (5, 14): [("Osi de raan idip nuna de nang Topa, de munu leh sikie sudi ku, de munu leh sino ku.", 80.9, 87.0, "jesus")],
    (5, 3): [("Muu en eh Onak Topa!", 16.2, 18.4, "spirit")],
}
VOICE_FX = {  # character voices (ffmpeg chains); the narrator stays natural
    "jesus": "aecho=0.9:0.7:90|180|320:0.22|0.13|0.07",  # the creator's own voice, untouched, with a gentle echo
    "spirit": "rubberband=pitch=0.72:formant=shifted,lowpass=f=3500,aecho=0.8:0.75:80|160|260:0.4|0.28|0.16,acrusher=bits=10:mix=0.15",
    "scholar": "rubberband=pitch=1.08:formant=preserved,highpass=f=280,lowpass=f=5200,equalizer=f=1400:t=q:w=1.2:g=5",
    "family": "rubberband=pitch=1.06:formant=preserved,highpass=f=160,equalizer=f=2600:t=q:w=1:g=3",
}
EXTRA_PAUSE = {}  # line index -> extra seconds after it, so a visual payoff has room
if EP == 2:
    LINES = LINES2
    EXTRA_PAUSE = {5: 1.0, 13: 1.3}
if EP == 4:
    LINES = LINES4
    EXTRA_PAUSE = {9: 0.9}
if EP == 5:
    LINES = LINES5
    TH = -43
if EP == 3:
    LINES = LINES3
    EXTRA_PAUSE = {3: 0.4, 4: 0.8, 6: 0.8}
assert len(LINES) == len(SC.LINES)

src, out = sys.argv[1], sys.argv[2]
with wave.open(src) as w:
    SR = w.getframerate()
    a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
H = int(0.01 * SR)
def env_db(x):
    n = len(x) // H
    return 20 * np.log10(np.sqrt((x[: n * H].reshape(n, H) ** 2).mean(1)) + 1e-9)
DB = env_db(a)
TH = -45  # speech vs room tone (gaps sit at about -65 dB)
if EP == 5:
    TH = -43
# Episode 1, second recording (TAKE=2): denoised first (ffmpeg highpass=f=90,afftdn=nr=18:nf=-38:tn=1), noisier room,
# no "Follow suo part 2" in it, so that last line comes from the first recording (argv[3]).
TAKE = int(os.environ.get("TAKE", "1"))
TIMES_EP1_TAKE2 = [(20.1, 23.9), (24.7, 26.85), (27.35, 28.7), (29.5, 33.4), (34.0, 37.5), (37.8, 44.1), (44.45, 45.95),
                   (46.8, 50.1), (51.2, 55.4), (57.15, 59.6), (60.9, 64.25), (65.05, 70.8), (72.25, 75.15), (75.25, 77.4),
                   (78.55, 81.6), (82.8, 88.1), (88.65, 92.2), (93.2, 94.75)]
if EP == 1 and TAKE == 2:
    TH = -40
    with wave.open(sys.argv[3]) as w:
        a_first = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768

# EP1 only: split point between lines 13 and 14: longest quiet run in 69.5–71.6 s
q = DB[int(69.5 * 100): int(71.6 * 100)] < TH
best, run, bs = (0, 0), 0, 0
for i, v in enumerate(q):
    if v:
        run += 1
        if run > best[0]: best = (run, i - run + 1)
    else:
        run = 0
cut = 69.5 + (best[1] + best[0] / 2) / 100
L = [list(x) for x in LINES]
if EP == 1 and TAKE == 2:
  for i, (s_, e_) in enumerate(TIMES_EP1_TAKE2): L[i][1], L[i][2] = s_, e_
elif EP == 1:
  L[12][2] = cut; L[13][1] = cut
  print(f"line 13/14 split at {cut:.2f}s (quiet run {best[0] * 10} ms)")

def tighten(x, cap=0.42):
    """shorten internal pauses longer than `cap` (keeps breaths natural)"""
    d = env_db(x); quiet = d < TH; keep = np.ones(len(x), bool)
    i = 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            if (j - i) / 100 > cap and i > 0 and j < len(quiet):
                s = i * H + int(cap / 2 * SR); e = j * H - int(cap / 2 * SR)
                keep[s:e] = False
            i = j
        else:
            i += 1
    return x[keep]

def fade(x, ms=12):
    n = int(ms / 1000 * SR); f = np.linspace(0, 1, n, dtype=np.float32)
    x = x.copy(); x[:n] *= f; x[-n:] *= f[::-1]; return x

def clip(s, e, src=None):
    x = (a if src is None else src)[int((s - 0.06) * SR): int((e + 0.1) * SR)]
    d = env_db(x); v = np.nonzero(d > TH)[0]  # trim to first/last voiced frame
    x = x[max(0, v[0] * H - int(0.05 * SR)): min(len(x), (v[-1] + 1) * H + int(0.12 * SR))]
    return fade(tighten(x))

def thought_voice(x):
    """Inner monologue: band-limited, close slap-back echoes, slightly doubled."""
    with tempfile.TemporaryDirectory() as td:
        i, o = os.path.join(td, "i.wav"), os.path.join(td, "o.wav")
        x2 = np.concatenate([x, np.zeros(int(0.8 * SR), np.float32)])
        with wave.open(i, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x2, -1, 1) * 32767).astype(np.int16).tobytes())
        fc = ("highpass=f=220,lowpass=f=4200,"
              "chorus=0.6:0.9:40|55:0.35|0.3:0.25|0.4:2|2.5,"
              "aecho=0.85:0.7:110|220|380:0.35|0.22|0.12,alimiter=limit=0.9")
        subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-i", i, "-af", fc, "-ar", str(SR), "-ac", "1", o])
        with wave.open(o) as w:
            y = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    y = y / max(1e-6, np.abs(y).max()) * 0.9
    d = env_db(y); v = np.nonzero(d > -50)[0]
    return fade(y[: (v[-1] + 1) * H], 30)

THOUGHT = {(3, 8)}  # (episode, line index) read as an inner thought

def char_voice(x, kind):
    """apply a character voice chain; returns (audio, length of the dry voice)"""
    if not kind:
        return x, len(x) / SR
    with tempfile.TemporaryDirectory() as td:
        i, o = os.path.join(td, "i.wav"), os.path.join(td, "o.wav")
        x2 = np.concatenate([x, np.zeros(int(0.9 * SR), np.float32)])
        with wave.open(i, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x2, -1, 1) * 32767).astype(np.int16).tobytes())
        subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-i", i, "-af", VOICE_FX[kind] + ",alimiter=limit=0.9", "-ar", str(SR), "-ac", "1", o])
        with wave.open(o) as w:
            y = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    y = y / max(1e-6, np.abs(y).max()) * float(np.abs(x).max())
    d = env_db(y); v = np.nonzero(d > -50)[0]
    return fade(y[: (v[-1] + 1) * H], 30), len(x) / SR

def god_voice(x):
    """God's words: an octave-down double, a fifth-down double and a long hall echo. Returns (audio, length of the dry voice)."""
    with tempfile.TemporaryDirectory() as td:
        i, o = os.path.join(td, "i.wav"), os.path.join(td, "o.wav")
        x2 = np.concatenate([x, np.zeros(int(2.2 * SR), np.float32)])
        with wave.open(i, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x2, -1, 1) * 32767).astype(np.int16).tobytes())
        fc = ("[0:a]asplit=3[a][b][c];"
              "[b]rubberband=pitch=0.5:formant=preserved,lowpass=f=2500,volume=0.55[b2];"
              "[c]rubberband=pitch=0.667:formant=preserved,volume=0.30[c2];"
              "[a][b2][c2]amix=inputs=3:normalize=0,"
              "aecho=0.8:0.75:70|160|290|460|700:0.42|0.33|0.25|0.18|0.12,"
              "lowshelf=f=140:g=4,highshelf=f=6000:g=-3,alimiter=limit=0.9")
        subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-i", i, "-filter_complex", fc, "-ar", str(SR), "-ac", "1", o])
        with wave.open(o) as w:
            y = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    y = y / max(1e-6, np.abs(y).max()) * 0.9
    # trim the echo tail to where it falls below -50 dB
    d = env_db(y); v = np.nonzero(d > -50)[0]
    return fade(y[: (v[-1] + 1) * H], 40), len(x) / SR

GOD_SPLIT = (19.5, 20.05) if TAKE == 1 else (30.5, 30.98)  # line 4: "Ogi suara nang:" | "Muu onak Ku, Oku nyayang muu."
END_LEAD = 1.7              # line 18 starts after the title card has landed

LEAD0 = getattr(SC, "LEAD", 0.5)
buf = [np.zeros(int(LEAD0 * SR), np.float32)]
t = LEAD0
segs = []
def words_for(x, text, keys, alias, t0, voiced_len=None):
    xx = x[: int(voiced_len * SR)] if voiced_len else x
    d = env_db(xx); voiced = (d > TH).astype(float); cum = np.cumsum(voiced); cum /= cum[-1]
    words = text.split()
    wts = [len(re.sub(r"[^\w]", "", w)) + 1.2 for w in words]
    tot = sum(wts); acc = 0; wl = []
    inv = {(b.split("#")[0].lower(), int(b.split("#")[1]) if "#" in b else 1): k for k, b in alias.items()}
    seen = {}
    for w, wt in zip(words, wts):
        fr = int(np.searchsorted(cum, acc / tot + 1e-6))
        bare = re.sub(r"[^\w]", "", w)
        seen[bare.lower()] = seen.get(bare.lower(), 0) + 1
        wl.append({"text": w, "start": round(t0 + fr / 100, 3), "key": bare in keys, "alias": inv.get((bare.lower(), seen[bare.lower()]))})
        acc += wt
    return wl

for n, ((scene, _en, voice, _sp, pause, _k), (text, s, e, keys, alias)) in enumerate(zip(SC.LINES, L)):
    if EP == 1 and n == 3:  # narrator intro, then God's voice
        ta, tb = text.split(": ", 1)
        xa = clip(s, GOD_SPLIT[0])
        segs.append({"scene": scene, "text": ta + ":", "tempter": False, "start": round(t, 3), "end": round(t + len(xa) / SR, 3), "words": words_for(xa, ta + ":", keys, alias, t)})
        print(f"{t:6.2f} {len(xa) / SR:5.2f}  {ta}:")
        gap = np.zeros(int(0.35 * SR), np.float32)
        buf += [xa, gap]; t += (len(xa) + len(gap)) / SR
        xb, dry = god_voice(clip(GOD_SPLIT[1], e))
        segs.append({"scene": scene, "text": tb, "tempter": False, "god": True, "start": round(t, 3), "end": round(t + dry, 3), "words": words_for(xb, tb, keys, alias, t, dry)})
        print(f"{t:6.2f} {len(xb) / SR:5.2f}  (God) {tb}")
        buf += [xb, np.zeros(int(0.15 * SR), np.float32)]; t += len(xb) / SR + 0.15
        continue
    if (EP, n) in PARTS:
        for k_, (ptxt, ps, pe, fx) in enumerate(PARTS[(EP, n)]):
            xp, dry = char_voice(clip(ps, pe), fx)
            segs.append({"scene": scene, "text": ptxt, "tempter": fx == "spirit", "start": round(t, 3), "end": round(t + dry, 3), "words": words_for(xp, ptxt, keys, alias, t, dry)})
            print(f"{t:6.2f} {len(xp) / SR:5.2f}  [{fx or 'narr'}] {ptxt}")
            gap = pause + EXTRA_PAUSE.get(n, 0) if k_ == len(PARTS[(EP, n)]) - 1 else 0.22
            buf += [xp, np.zeros(int(gap * SR), np.float32)]; t += len(xp) / SR + int(gap * SR) / SR
        continue
    x = np.zeros(int(1.0 * SR), np.float32) if s is None else clip(s, e, a_first if (EP == 1 and TAKE == 2 and n == len(L) - 1) else None)
    if n == len(L) - 1:
        x = np.concatenate([np.zeros(int(END_LEAD * SR), np.float32), x])
    tempter = voice == SC.T
    if (EP, n) in THOUGHT:
        x = thought_voice(x)
    if tempter:  # same voice, with a faint doubled echo so the tempter feels "other"
        dl = int(0.085 * SR)
        y = np.zeros(len(x) + dl * 2, np.float32)
        y[: len(x)] += x; y[dl: dl + len(x)] += 0.28 * x; y[2 * dl:] += 0.12 * x
        x = y
    dur = len(x) / SR
    lead = END_LEAD if n == len(L) - 1 else 0
    wl = words_for(x[int(lead * SR):], text, keys, alias, t + lead) if text else []
    segs.append({"scene": scene, "text": text, "tempter": tempter, "start": round(t, 3), "end": round(t + dur, 3), "words": wl})
    print(f"{t:6.2f} {dur:5.2f}  {text}")
    pause += EXTRA_PAUSE.get(n, 0)
    buf.append(x); buf.append(np.zeros(int(pause * SR), np.float32))
    t += dur + int(pause * SR) / SR
y = np.concatenate(buf)
y = y / np.abs(y).max() * 0.89
with wave.open(os.path.join(out, "voice.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype(np.int16).tobytes())
json.dump({"duration": round(len(y) / SR, 3), "segments": segs}, open(os.path.join(out, "timing.json"), "w"), indent=1, ensure_ascii=False)
print("total", len(y) / SR)
