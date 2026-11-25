"""Bidayuh (Bau) version: cut the creator's voiceover into the 18 script lines and write timing.json + voice.wav
in the same format as tts.py, so build.py can be reused.   Usage: bidayuh.py <voice.wav 24k mono> <out dir>
Each line: (scene, Bidayuh text, tempter?, start/end in the raw recording, caption keywords, {english cue: bidayuh word})."""
import sys, json, os, re, wave, subprocess, tempfile
import numpy as np
import importlib
EP = int(os.environ.get("EP", "1"))
TAKE = int(os.environ.get("TAKE", "1"))
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
LINES6 = [  # episode 6 (heavily denoised take)
    ("Meh boge nya tia rie ngojit Jesus. Ju yeh meh odi guru ke orud, ngajar nyaa suo kanu.", 1.3, 8.35, ["orud"], {}),
    ("", 8.4, 11.3, ["ruang"], {}),
    ("", 11.3, 26.3, ["oran", "batuh", "roja"], {"path": "oran", "birds": "manuk", "rock": "batuh", "thorns": "roja"}),
    ("", 26.35, 34.6, ["bibua", "100"], {"good": "buogmamuo", "grew": "bibua", "thirty": "30", "sixty": "60", "hundred": "100"}),
    ("", 34.95, 40.95, ["sit", "ayuh"], {"smallest": "sit", "biggest": "ayuh"}),
    ("", 41.0, 45.0, ["pirad"], {"other": "pirad"}),
    ("Yeh me guring de punuok orud, ju meh bees.", 45.05, 49.1, ["bees"], {"asleep": "bees"}),
    ("Sobak ribut tia meh gogeh-gogeh neg. Ju piin grumang meh moret kang orud.", 49.2, 53.9, ["ribut", "grumang"], {}),
    ("", 53.95, 57.7, ["kuom"], {}),
    ("", 57.75, 61.4, ["Tono"], {"still": "Tono"}),
    ("Sobak ribut meh roo. Ju raut meh tono.", 62.1, 65.4, ["tono"], {"calm": "tono"}),
    ("", 65.6, 69.2, ["toru", "bisaya"], {}),
    ("", 69.25, 77.5, ["Osiosi", "ngojit"], {"who": "Osiosi", "obey": "ngojit"}),
    ("Nuna koih suo part 7.", 77.55, 81.5, ["Nuna"], {}),
]
LINES7 = [  # episode 7 (clean take, used as is)
    ("Ngan Jesus meh nog ke sborang. Topat jier. Deng rate. Duoh deng nya ngrais.", 3.5, 9.3, ["jier", "ngrais"], {"chains": "rate", "screaming": "ngrais"}),
    ("Ogi dari de ree de jier inuh. Doi nya daped pasung eh tia.", 9.4, 13.85, ["jier", "pasung"], {"chain": "pasung"}),
    ("Takar yeh meh kirin Jesus, yeh meh bikoduh nudu Eh, ju meh ngoruob de peen Jesus.", 13.9, 19.5, ["bikoduh", "ngoruob"], {"feet": "ngoruob"}),
    ("", 19.6, 24.0, ["Ayuh", "Kiasa"], {}),
    ("", 24.1, 26.9, ["aden"], {}),
    ("", 27.1, 29.8, ["Legion", "boge"], {"legion": "Legion", "many": "boge"}),
    ("De tun pungu, ogi kaban oyuo tongah man.", 29.85, 33.3, ["oyuo"], {"pigs": "oyuo"}),
    ("", 33.35, 36.15, ["oyuo"], {}),
    ("Jesus meh da eh. Oyuo de munu meh trajak bidasuor suo pungu, nuju ke laut.", 36.2, 43.45, ["trajak", "laut"], {"rushed": "trajak", "sea": "laut"}),
    ("Ayuo de kirin koyuh de munu, meh kruti ninga dari inuh, meh ideh di mun nya de nawa.", 43.5, 48.4, ["kruti", "nawa"], {}),
    ("Nya munu meh toru. Bripotak da Jesus buu suo inuh.", 49.85, 53.1, ["toru", "buu"], {"leave": "buu"}),
    ("", 54.0, 56.05, ["nuna"], {}),
    ("", 57.2, 63.0, ["bori", "Topa"], {"tell": "Tanen", "done": "nai"}),
    ("Nuna koih suo part 8.", 63.9, 66.0, ["Nuna"], {}),
]
LINES8 = [  # episode 8 (clean take)
    ("Jesus meh pari motas orad, ogi ni dari biturak duoh nya rie ninga Jesus. Jairus, kitua bori synagogue.", 6.7, 15.45, ["Jairus"], {}),
    ("", 16.35, 22.25, ["monam", "bait"], {}),
    ("Jesus meh nuna yeh. Ju nya de kiang kiang inuh meh nuna geh dep eh duoh.", 23.05, 27.65, ["kiang"], {}),
    ("Daang ayuo nya de munu ogi dayung de obuoh onam bubu sapai meh 12 sowa. Puas yeh odi brubat, pak eh makin bitamah onam eh.", 28.7, 38.0, ["12", "bitamah"], {}),
    ("", 39.0, 43.35, ["toma", "onam"], {}),
    ("Yeh pruah tongan eh, toma jubah Eh. Rasu danu geh, yeh meh sai onam eh meh doi.", 44.1, 50.3, ["toma", "doi"], {"touched": "toma", "stopped": "doi"}),
    ("", 51.0, 53.15, ["Osi"], {}),
    ("Yeh meh kimotor tia, ju ju meh pubap de peen Jesus, dang eh tanen oni de nai eh.", 53.95, 60.7, ["kimotor"], {}),
    ("", 61.6, 67.55, ["bisaya", "sonang"], {}),
    ("", 68.6, 72.4, ["kobes"], {"dead": "kobes"}),
    ("", 73.85, 75.95, ["Bisaya"], {}),
    ("Takar de bori inuh, nyaa kiak kaung sien. Yeh meh nang: Yeh ideh di eh kobes, jek eh bees. Nya munu meh toweh yeh.", 77.0, 86.2, ["bees", "toweh"], {"laughed": "toweh"}),
    ("Yeh meh geng tongan onak dayung inuh, ju meh in Eh:", 86.75, 89.85, ["tongan"], {"hand": "tongan"}),
    ("", 90.4, 95.05, ["koum", "mokat"], {"up": "mokat"}),
    ("Onak dayung inuh de 12 umur eh, meh rasu mokat ju meh ponu.", 95.8, 100.65, ["mokat", "ponu"], {"walked": "ponu"}),
    ("Nuna koih suo part 9.", 101.8, 103.5, ["Nuna"], {}),
]
LINES9 = [  # episode 9 (clean take)
    ("Jesus meh mori ke Nazareth, ju meh ngajar de synagogue.", 2.75, 6.5, ["Nazareth"], {}),
    ("", 7.05, 12.55, ["tukang"], {"carpenter": "tukang"}),
    ("Nya danu meh dorie bisaya duoh Yeh.", 13.65, 15.75, ["dorie"], {}),
    ("", 16.1, 21.55, ["Nabi", "hormat"], {}),
    ("Jesus meh doi daped pikirien kiasa Eh danu. Boyo iran Eh ninga rayat danu doi bisaya duoh Yeh.", 22.1, 28.25, ["kiasa", "doi"], {}),
    ("Jadi yeh meh pait rasol eh de 12 inuh, da nga duoh nga duoh. Ma toban oni-oni. Toban sikuud meh geh. Ngan pinguman. Ngan duit isah nya toban eh.", 28.85, 39.8, ["12", "sikuud"], {"two": "duoh", "staff": "sikuud"}),
    ("Nya munu meh ponu. Kasig muot kati kanih, ngubat nya da bait.", 40.95, 45.55, ["bait"], {"healed": "bait"}),
    ("King Herod meh ngojit brita itih, ju yeh meh toru.", 47.05, 50.3, ["Herod", "toru"], {}),
    ("", 51.95, 55.5, ["Joanis", "idip"], {}),
    ("Herod pronah gan Joanis de jier, sobab Joanis tanen nang: Porih ingan mit sowen sudi ingan neh.", 56.35, 63.95, ["jier", "Porih"], {}),
    ("Takar onu branak Herod, yeh mogan nya bruman. Onak dayung Herodias meh mokat bitana. Herod meh rami ninga eh.", 65.85, 73.35, ["bruman", "bitana"], {"danced": "bitana"}),
    ("", 74.1, 78.8, ["Simunmun", "stongah"], {}),
    ("", 79.65, 81.75, ["mitie"], {}),
    ("", 82.35, 84.85, ["Joanis"], {"john": "Joanis"}),
    ("Raja Herod meh susah otin. Tapi yeh dorie rie nurak pimitie dayung inuh sobap yeh meh bisupah dopan nya.", 85.8, 92.6, ["susah", "bisupah"], {}),
    ("Ngaruom inuh, dowoh jier, meh ngorok eh tia.", 93.2, 97.2, ["ngorok"], {"silent": "ngorok"}),
    ("Onak murit Joanis meh neg, mit gonan eh, ju meh ngubur.", 97.9, 102.6, ["ngubur"], {"tomb": "ngubur"}),
    ("Nuna koih suo part 10.", 103.6, 105.3, ["Nuna"], {}),
]
LINES10 = [  # episode 10 (clean take)
    ("Para Rasul meh pari ju meh tanon nudu Jesus suo kroja de meh nai nya munu.", 2.15, 7.65, ["Rasul"], {}),
    ("", 8.0, 14.05, ["motug"], {}),
    ("Pak eh bogo nyaa kirin eh, jadi nyaa munu meh die ponu poon ke topat inuh. 5000 urang manusia.", 15.0, 22.45, ["5000"], {"five": "5000", "thousand": "5000"}),
    ("Takar Jesus meh kirin nyaa kajen yeh, meh ruop nyam otin eh masi ninga nya munu. De meh koda koming de doi gembara eh.", 23.3, 31.2, ["masi", "gembara"], {}),
    ("", 31.95, 35.55, ["ramat"], {}),
    ("", 36.1, 38.5, ["Dop"], {}),
    ("", 39.25, 43.0, ["5", "2"], {"five": "5", "two": "2"}),
    ("Yeh meh bigaeng ke rongit, ngin trima kasih de Topa, ju meh nyipiek ruti de munu.", 43.65, 49.2, ["rongit", "nyipiek"], {"broke": "nyipiek"}),
    ("Meh doi poted-poted tia pinguman. Suo nya daped geh man, meh sukup busuoh. Gi ogi geh 12 ade bakur de masih punuo da pinguman.", 50.7, 59.5, ["potedpoted", "12"], {"going": "poted-poted", "twelve": "12"}),
    ("Ngaruom inuh, Jesus rasu da onak murid eh maad pakai orud, ju Yeh meh jikeh pungu sadi eh ngan Eh rie smayang.", 60.7, 67.75, ["smayang"], {}),
    ("Sobak ribut skia doras. Bijam jam nya munu bikayuh.", 68.45, 72.15, ["ribut", "bikayuh"], {}),
    ("Ngaran pukul 3 sipagi, nya munu meh kirin sibamie ponu de tun piin.", 73.0, 78.1, ["ponu", "piin"], {"walking": "ponu", "water": "piin"}),
    ("", 78.5, 80.5, ["munuo"], {"ghost": "munuo"}),
    ("", 81.45, 85.9, ["itih", "toru"], {"i": "itih"}),
    ("Jesus meh maad kang orud, ju sobak rasu re. Nya munu meh gogeh ninga Kiasa Eh.", 87.0, 92.85, ["re", "Kiasa"], {"stopped": "re"}),
    ("Nuna koih suo part 11.", 94.2, 96.5, ["Nuna"], {}),
]
LINES11 = [  # episode 11 (steady low room hum about 25 dB under the voice; threshold raised to -34)
    ("Bara Farisi meh kirin onak murid Jesus man pakai tongan de doi eh mamie bonar-bonar.", 4.2, 9.1, ["Farisi", "tongan"], {"unwashed": "mamie"}),
    ("", 9.8, 13.0, ["adat"], {}),
    ("", 13.9, 18.3, ["Topa", "aturan"], {}),
    ("", 19.4, 24.2, ["otin"], {"heart": "otin"}),
    ("Ju Jesus meh buu suo kanu odi kaang purou Tyrus. Rasu ogi dayung pubap odep eh de peen Jesus.", 25.0, 30.9, ["Tyrus", "pubap"], {}),
    ("", 31.45, 35.6, ["muot"], {}),
    ("", 36.4, 42.95, ["opet", "kosuong"], {}),
    ("", 43.7, 49.3, ["kosuong", "ruruh"], {"crumbs": "ruruh"}),
    ("", 50.0, 55.4, ["ruah"], {}),
    ("Yeh meh maad ke bori, ju meh daped onak eh guring de topat bees. Meh doi tia muot daang eh.", 56.3, 61.9, ["tia"], {"gone": "tia"}),
    ("Mokuo inuh nyaa meh ogi toban dari de bibie bongam nudu Jesus.", 63.2, 66.95, ["bongam"], {}),
    ("Jesus meh toban yeh buu, mua juan eh suo nyaa de boge. Gan tongan Eh de kojit dari inuh, ju meh toma jora eh.", 67.45, 74.35, ["kojit", "jora"], {"ears": "kojit"}),
    ("Yeh meh bigaeng ke rongit, narik napas, ju meh in eh:", 75.85, 79.55, ["rongit"], {}),
    ("", 80.05, 82.3, ["Effata", "Tibuka"], {"opened": "Tibuka"}),
    ("Danu geh yeh meh rasu ponai ngojit, jora eh meh ponai dodot. Ju yeh meh ponai sina torang-torang eh.", 84.1, 89.9, ["dodot", "sina"], {}),
    ("", 91.0, 96.8, ["ngojit", "sina"], {"hear": "ngojit"}),
    ("Nuna koih suo part 12.", 98.25, 100.1, ["Nuna"], {}),
]
LINES93 = [  # special: The Number 3 (clean take, all narration; Jesus line 9 natural)
    ("Umur Jesus 33 sowa takar yeh meh obuoh nyalip. Yeh meh kobos pukul 3 singumi.", 5.8, 10.95, ["33", "3"], {"thirtythree": "33", "three": "3"}),
    ("3 botang salip de tun pungu.", 11.45, 13.2, ["3"], {"three": "3"}),
    ("Yeh meh kobes, meh obuoh ngubur, duoh mokat idip bauh dang onu ke 3.", 13.95, 17.75, ["3"], {"died": "kobes", "buried": "ngubur", "third": "3"}),
    ("3 dayung odi nudu makam Eh: Mary Magdalene, Mary sine James, duoh Salome.", 18.4, 23.65, ["3"], {"three": "3"}),
    ("Suo de muti takar meh sukup 3 sowa Jesus ngajar.", 24.35, 27.3, ["3"], {"three": "3"}),
    ("Adin, kira-kira ogi 1 urang misia suo 3 urang de dunya de ngaku dep eh Christian.", 27.8, 32.3, ["1", "3"], {"one": "1", "three": "3"}),
    ("3 sideh Peter nang dep eh doi piruh Jesus.", 32.8, 35.3, ["3"], {"three": "3"}),
    ("Takar Yeh meh mokat idip bauh, Jesus sikien duoh yeh 3 sideh:", 35.8, 39.05, ["3"], {"three": "3"}),
    ("Muu nyayang oku keh? Mu nyayang oku keh? Mu nyayang oku keh?", 39.6, 42.95, ["nyayang"], {"love": "nyayang", "love2": "nyayang#2", "love3": "nyayang#3"}),
    ("Topa yeh leh Sama, Onak duoh Roh Kudus.", 43.4, 45.95, ["Sama", "Onak", "Kudus"], {"father": "Sama", "son": "Onak", "spirit": "Kudus"}),
    ("Suo koyuh de dunya mokat suo 3 koyuh geh. Warna de paring ayuh neg suo 3 itih: birieh, sia, duoh biru.", 46.45, 53.25, ["birieh", "sia", "biru"], {"red": "birieh", "yellow": "sia", "blue": "biru"}),
    ("Meh branak, meh idip, meh kobes. Do sodi eh, de adin, duoh tie sije.", 53.7, 58.8, ["branak", "idip", "kobes"], {"birth": "branak", "life": "idip", "death": "kobes", "past": "sodi", "present": "adin", "future": "sije"}),
    ("Masa, ruang, duoh jirim. Ais, piin, duoh gas.", 59.4, 63.6, ["Masa", "ruang", "jirim"], {"time": "Masa", "space": "ruang", "matter": "jirim", "ice": "Ais", "water": "piin", "steam": "gas"}),
    ("Omu, ayuh, dowoh. Gonan, smongi, duoh roh.", 64.3, 68.85, ["Gonan", "smongi", "roh"], {"height": "Omu", "width": "ayuh", "depth": "dowoh", "body": "Gonan", "soul": "smongi", "spirit": "roh"}),
    ("Sama, sine, duoh onak.", 69.5, 71.5, ["Sama", "sine", "onak"], {"father": "Sama", "mother": "sine", "child": "onak"}),
    ("Takar dang Gethsemane, Jesus gan jowin eh ke tana, duoh smayang 3 sideh.", 72.25, 76.4, ["3"], {"three": "3"}),
    ("Yeh pari ninga Peter, James duoh John. 3 sideh geh, Yeh daped nya munu bees.", 76.8, 82.1, ["3", "bees"], {"three": "3", "asleep": "bees"}),
    ("Watki Bible tanen nang otte daped obuoh ngramat? Asa te bisaya nang Yeh meh kobes, meh ngubur, ju meh mokat idip bauh.", 83.45, 90.0, ["kobes", "ngubur", "mokat"], {"death": "kobes", "burial": "ngubur", "resurrection": "mokat"}),
    ("Dang Bible, numur 3 inuh numur de meh sukup. Asa Topa sobut koyuh 3 sideh, koyuh inuh meh jadi.", 90.7, 96.85, ["sukup", "jadi"], {"completeness": "sukup", "settled": "jadi"}),
    ("Itih leh ruban malaikat nang: Kudus, kudus, kudus.", 97.6, 100.55, ["Kudus", "kudus"], {"holy": "Kudus", "holy2": "kudus#2", "holy3": "kudus#3"}),
    ("Topa ngin brokat eh duoh otte pakai 3 koyuh. Nuna oku sobut:", 101.3, 105.2, ["3"], {"three": "3"}),
    ("Dang aden Sama, duoh Onak, duoh Roh Kudus. Amen.", 105.3, 109.1, ["Sama", "Onak", "Kudus"], {"father": "Sama", "son": "Onak", "spirit": "Kudus"}),
    ("Share itih nudu pingoma, madis ayuo, duoh dingan ingan ngan te puan Kiasa Topa.", 109.7, 113.85, ["pingoma", "ayuo", "Kiasa"], {"friends": "pingoma", "family": "ayuo", "word": "Kiasa"}),
]
LINES12 = [  # episode 12 (clean take)
    ("Bogo nyaa meh bigupur ade bauh. Selama 3 onu, doi pinguman suo nya munu.", 2.85, 7.3, ["3"], {"three": "3"}),
    ("Masi Ku ninga nya muti. Asa Ku da pari ke bori duoh toin de pirai, tie meh gurang pisan de tongah oran.", 7.9, 14.1, ["Masi"], {"compassion": "Masi"}),
    ("Jek 7 kiping ruti sija de ogi supieh. Jesus meh ngin trima kasih, nyipiek ruti inuh, ju meh 4000 urang manusia meh daped man.", 15.1, 23.0, ["7", "4000"], {"seven": "7", "thousand": "4000"}),
    ("Inuh pun masih ogi supieh 7 bakul punuo da pinguman.", 23.9, 26.6, ["7"], {"seven": "7"}),
    ("Daang Bethsaida, ogi nyaa meh toban dari de buta, yeh meh mitie turung Jesus toma dep eh.", 27.95, 33.75, ["buta"], {"blind": "buta"}),
    ("Jesus meh toban yeh ruah suo kupuo inuh, gan royang Eh de boten dari inuh, ju meh kuob pakai tongan Eh.", 34.95, 40.65, ["boten"], {"eyes": "boten"}),
    ("Oni de kirin mu?", 41.8, 42.95, ["kirin"], {"see": "kirin"}),
    ("", 44.15, 48.4, ["tongen"], {"trees": "tongen", "walking": "ponu"}),
    ("Ni sideh ade, Jesus gan tongan Eh de boten dari inuh. Ju meh boten eh meh makin torang, suo koyuh meh daped geh yeh kirin eh.", 49.75, 56.9, ["torang"], {"clearly": "torang"}),
    ("Takar daang oran, Jesus sikien duoh onak murid eh: Osi Oku in nyaa nang eh yeh?", 58.1, 63.2, ["Osi"], {"who": "Osi"}),
    ("", 64.4, 71.3, ["Joanis", "Elijah"], {"john": "Joanis", "prophets": "nabi"}),
    ("Odop ingan neh? Osi Oku in ingan nang?", 72.4, 75.6, ["ingan"], {"you": "ingan"}),
    ("", 76.5, 77.95, ["Pinubuos"], {"messiah": "Pinubuos"}),
    ("Mokuo inuh Yeh meh tanen duoh bara onak murid Eh nang Onak Misia rie obuoh sengsara de tok tok baat, rie obuoh ngabes, mokuo 3 onu, Yeh rie mokat idip bauh.", 79.7, 88.85, ["sengsara", "mokat"], {"suffer": "sengsara", "rise": "mokat"}),
    ("Peter meh narik Yeh ke topat de boken, jaman da sobut koyuh de in ninu.", 89.9, 93.6, ["sobut"], {"rebuke": "sobut"}),
    ("Buu kanih sitan eh! Koyuh de pikir mu ideh di eh neg suo Topa.", 94.35, 98.3, ["sitan", "Topa"], {"satan": "sitan", "god": "Topa"}),
    ("Asa ingan rie nuna Oku, ingan mesti nuah odep ingan, gorong sarip ingan, ju nya meh nuna Oku.", 99.6, 105.7, ["sarip"], {"cross": "sarip"}),
    ("Oni utung nya asa suo koyuh de dunya itih ingan daped, pak eh simongi ingan meh moyap?", 106.4, 112.1, ["dunya", "simongi"], {"world": "dunya", "soul": "simongi"}),
    ("Nuna koih suo part 13.", 112.65, 114.75, ["Nuna"], {}),
]
LINES13 = [  # episode 13 (very clean take, gated silence)
    ("6 onu mokuo inuh, Jesus meh toban Peter, James duoh John nuna yeh ke tun dored.", 2.35, 9.0, ["dored"], {"mountain": "dored"}),
    ("Danu, rupa Jesus meh brubah de dopan nya munu. Pimakai Eh meh ponai ngokab mopu bikirat, ideh di mun koyuh de obuoh nai de dunya itih.", 9.35, 18.3, ["brubah", "bikirat"], {"transfigured": "brubah", "white": "bikirat"}),
    ("Mokuo inuh Elijah duoh Moses meh pitonga dep eh, sina duoh Jesus.", 19.05, 23.25, ["Elijah", "Moses"], {}),
    ("", 24.35, 33.3, ["kati"], {"one": "ni"}),
    ("Peter in ninu sobab yeh doi puan oni de rie nang eh. Dep eh de munu meh skia toru. Mokuo inuh abun meh mun kuob suo dep eh, ju meh ogi suara sina suo abun inuh:", 34.5, 45.0, ["abun"], {"cloud": "abun"}),
    ("", 46.2, 50.6, ["Onak", "Ngojit"], {"son": "Onak", "listen": "Ngojit"}),
    ("Tojoh tojoh, takar onak murid eh kurang kurieh ninga, doi osi-osi danu duoh nya munu, jek eh Jesus.", 52.2, 58.55, ["Jesus"], {"jesus": "Jesus"}),
    ("Takar meh de dou dored inuh, ogi ni urang dari dang ayuo nya de boge meh nang in eh.", 60.4, 65.0, ["dari"], {"father": "dari"}),
    ("", 65.95, 75.0, ["onak"], {"son": "onak"}),
    ("Bisaya mu keh? Sobab suo koyuh daped geh morui asa ingan bisaya.", 76.25, 80.45, ["morui", "bisaya"], {"possible": "morui", "believes": "bisaya#2"}),
    ("", 81.25, 84.0, ["Bisaya"], {"believe": "Bisaya"}),
    ("Jesus meh kasig muot inuh. Onak opet inuh meh poreng poreng eh tia. Pak eh Jesus meh mit tongan onak opet inuh, ju meh turung kakat yeh.", 84.95, 92.9, ["tongan", "kakat"], {"hand": "tongan", "lifted": "kakat"}),
    ("Ropas inuh, takar dang oran, onak murid Eh meh krakar pasal osi dang odep eh de kasen ayuh.", 94.15, 100.0, ["ayuh"], {"greatest": "ayuh"}),
    ("Osi-osi de ran rie kasen die, yeh mesti da dep eh kasen sunis, mesti eh jagin kuri suo nyaa.", 101.5, 107.65, ["sunis", "kuri"], {"last": "sunis", "servant": "kuri"}),
    ("Mokuo inuh Jesus meh mit onak opet de mujuog sinek dep eh, ju meh dokuop onak opet inuh.", 108.9, 114.35, ["dokuop"], {"child": "onak"}),
    ("Osi-osi de ngrima onak opet de koda de muti dang aden Oku, ngrima Oku geh.", 114.95, 119.3, ["ngrima"], {"welcomes": "ngrima"}),
    ("Koyuh de sit koda piin dowoh sakir de ngin ingan daang aden Oku, ngrima Oku geh.", 120.0, 124.85, ["piin"], {"water": "piin"}),
    ("Nuna koih suo part 14.", 125.85, 127.7, ["Nuna"], {}),
]
LINES14 = [  # episode 14 (very clean take, gated silence)
    ("Takar Jesus meh ponu ade, ogi ni dari muda de kaya meh bikoduh nudu Yeh ju meh ngoruob de dopan Eh.", 3.2, 9.7, ["kaya"], {"rich": "kaya"}),
    ("", 10.05, 14.6, ["adu"], {"eternal": "adu"}),
    ("Muu puan sibaya Topa: ma ngabos nyaa, ma noku, ma ngakar, brupa bipama duoh sino sama mu.", 15.2, 23.5, ["sibaya"], {"commandments": "sibaya"}),
    ("", 24.2, 27.5, ["nai"], {"kept": "nai"}),
    ("Jesus meh ninga yeh, ju meh mua nyam otin Eh nudu dari inuh.", 28.15, 32.2, ["otin"], {"loved": "otin"}),
    ("Ogi ni koyuh de aruo mu nai. Odi jua suo rota mu, ju ngin tudu nya de sutuok, moke mu rie ogi rota daang sorga. Mokuo inuh, nya meh nuna Oku.", 32.9, 43.5, ["sorga", "nuna"], {"treasure": "rota#2", "follow": "nuna"}),
    ("Jowin dari inuh meh ruop mun eh masuom. Yeh meh buu toban otin de boye susah, sobab yeh tek-tek boge rota eh.", 44.95, 51.4, ["susah"], {"sad": "susah"}),
    ("Nyaa de kaya tek-tek rorah rie moret kang pritah Topa. Sonang ade ingan kibaret unta moret ke rubang tuos.", 52.65, 59.65, ["unta", "tuos"], {"camel": "unta", "needle": "tuos"}),
    ("", 60.7, 62.35, ["sramat"], {"saved": "sramat"}),
    ("Duoh misia memang doi daped, pak eh duoh Topa daped. Suo koyuh daped geh da Topa.", 63.85, 69.65, ["Topa"], {"impossible": "doi", "possible": "daped#3"}),
    ("Mokuo inuh, James duoh John meh mitie de Jesus da dep eh duoh daped guru ngopid tura kiri duoh touh Jesus.", 71.3, 78.05, ["tura", "kiri"], {"right": "tura", "left": "kiri"}),
    ("Osi-osi mun dep ingan de rie jadi ayuh berkuasa misti rie jagin kuri die. Inuh ruban Onak Misia neg ke dunia itih ideh di mitie nyomah, pak eh rie nyomah, duoh ngin asung Eh nudu suo dep ingan de boge.", 80.45, 93.5, ["nyomah", "asung"], {"serve": "nyomah#2", "life": "asung"}),
    ("Takar dang Jericho, ogi nikan dari de buta de den Bartimaeus, guru tugu-tugu eh de oran. Takar yeh meh ngojit suara Jesus, yeh meh mogan doras-doras:", 95.35, 104.82, ["Bartimaeus"], {}),
    ("", 105.35, 108.1, ["masi"], {"mercy": "masi"}),
    ("Bogo nya da yeh ngorek. Pak eh makin doras yeh mogan Jesus. Jesus meh roo ju in Eh: Mogan yeh da odi kati.", 108.95, 116.3, ["doras", "Mogan"], {"louder": "doras", "call": "mogan#2"}),
    ("Yeh meh ngamur jubah eh, gangur wat eh mokat ju meh odi nudu Jesus.", 117.35, 121.65, ["jubah"], {"cloak": "jubah"}),
    ("Oni de ran mu Oku nai suo dep mu?", 122.75, 124.85, ["ran"], {"want": "ran"}),
    ("", 126.05, 128.0, ["kirin"], {"see": "kirin"}),
    ("Ponu negeh. Sobab mu bisaya, mu meh ponai kirin.", 128.8, 132.65, ["bisaya"], {"faith": "bisaya"}),
    ("Danu-danu geh boten eh meh tonga, ju yeh meh ponu nuna Jesus.", 133.35, 137.25, ["nuna"], {"followed": "nuna"}),
    ("Nuna koih suo part 15.", 138.45, 140.2, ["Nuna"], {}),
]
LINES15 = [  # episode 15 (very clean take, gated silence)
    ("Takar ngan Jesus meh rie neg Jerusalem, Yeh meh da 2 onak murid eh die ponu.", 5.85, 10.65, ["Jerusalem"], {}),
    ("Odi ke kupuo inuh. Tie asa ingan kirin dongki muda dang sringuo, de doi pronah nya nungang eh. Buka sringuo eh, ju nya toban kati.", 11.1, 18.35, ["dongki"], {"donkey": "dongki"}),
    ("Nya de 2 inuh meh toban dongki inuh nudu Jesus, ju meh nopas dongki inuh ngan jubah eh, ju Jesus meh mad ke tun eh.", 19.2, 25.5, ["jubah"], {"cloaks": "jubah"}),
    ("Kiang oni kiang nya meh naruh jubah de oran, ogi geh dep eh de bikopek duoh koyuh ngan eh gan de oran.", 26.2, 31.95, ["bikopek"], {"branches": "bikopek"}),
    ("", 32.6, 35.95, ["Hosanna", "brokat"], {"blessed": "brokat"}),
    ("Onu de nikan, Jesus meh pirai. Yeh meh kirin tongen fig de robat dowen eh, pak doi bua eh.", 37.3, 42.9, ["fig", "dowen"], {"leaves": "dowen"}),
    ("Sa nyaa doi tia man bua suo tongen mu.", 43.5, 46.0, ["tia"], {"ever": "tia"}),
    ("Dang Jerusalem, Jesus meh moret kang romin Topa. Pak eh punuo da nyaa bidagang duoh bijua danu.", 47.3, 53.05, ["romin"], {"temple": "romin"}),
    ("Yeh meh ngibirak mija nyaa de nukar duit, ngibirak ade mija nya de bijua manuk asang.", 53.5, 58.4, ["ngibirak", "asang"], {"overturned": "ngibirak", "doves": "asang"}),
    ("Kitab nang: Romin Ku neh aden romin smayang suo suo bangsa. Pak ingan meh nai da jagin sorin pinoku duoh prupak!", 59.4, 66.6, ["smayang", "prupak"], {"prayer": "smayang", "robbers": "prupak"}),
    ("Kipara padri meh ngojit oni de braku, yeh de munu meh karik oran ngan eh rie ngabes Jesus. Ruban nya boye gonget ngojit pingajar Jesus.", 67.6, 76.1, ["ngabes", "gonget"], {"kill": "ngabes", "amazed": "gonget"}),
    ("Pagi de nikan, takar bara de munu meh ngrusu tongon fig de samah. Tongon eh meh pisek neg puun eh.", 77.7, 83.95, ["pisek"], {"withered": "pisek"}),
    ("", 84.6, 88.15, ["ninga"], {"look": "ninga"}),
    ("Bisaya dang Topa. Asa ingan tanen duoh pungu itih da mokat toran dep eh ke raut, dang ingan bonar-bonar bisaya, totap eh akan braku.", 88.9, 97.4, ["Bisaya", "pungu"], {"faith": "Bisaya", "mountain": "pungu"}),
    ("Oni-oni de mitie ingan dang smayang, asa ingan meh bisaya nang meh dang tongan ingan, totap ingan rie daped eh.", 98.0, 104.3, ["bisaya"], {"believe": "bisaya"}),
    ("Ju asa ingan smayang, asa ingan tiwas duoh osi-osi keh, ngapun nya sarah nya munu.", 105.4, 110.7, ["ngapun"], {"forgive": "ngapun"}),
    ("Nuna koih suo part 16.", 112.3, 114.05, ["Nuna"], {}),
]
# (episode, line index) -> parts: (text, raw start, raw end, voice effect or None for the narrator)
PARTS = {
    (15, 4): [("Hosanna! Obuoh brokat Yeh de neg dang aden Tuhan!", 32.6, 35.95, "crowd")],
    (15, 12): [("Mistar, duok ninga! Tongon fig de nyupah Ingan meh kobes!", 84.6, 88.15, "peter")],
    (14, 1): [("Mistar de paguh, oni de perlu ku nai ngan ku rie idip adu-adu?", 10.05, 14.6, "young")],
    (14, 3): [("Mistar, suo de muti nai ku geh suo ku ogi onak opet geh.", 24.2, 27.5, "young")],
    (14, 8): [("Osi beneh de rie daped sramat?", 60.7, 62.35, "disciple")],
    (14, 13): [("Jesus, onak David, masi duoh oku!", 105.35, 108.1, "blind")],
    (14, 17): [("Mistar, da boten ku ponai kirin.", 126.05, 128.0, "blind")],
    (13, 3): [("Mistar, tek tek kona koih ogi dati neh! Da kois kajuog bori mota kati: ni suo Ingan, ni suo Moses, ni ade suo Elijah.", 24.35, 33.3, "peter")],
    (13, 5): [("Itih Onak Ku, de boye Ku rinu eh. Ngojit nya sina Yeh!", 46.2, 50.6, "god")],
    (13, 8): [("Mistar, ogi muot dowoh gonan onak dari ku de gia da yeh rabu gurang. Onak murid ingan doi ponai pruah muot inuh. Turung die asa ingan daped.", 65.95, 75.0, "family")],
    (13, 10): [("Bisaya! Turung nguat bisaya ku ade!", 81.25, 84.0, "family")],
    (12, 7): [("Oku kirin manusia. Rie mun tongen koyuh mun eh, ponu kati kanih.", 44.15, 48.4, "blind")],
    (12, 10): [("Ogi nya nang ingan Joanis Baptista. Ogi de nang Elijah. Ogi geh nyaa de nang Ingan nabi de boken.", 64.4, 71.3, "disciple")],
    (12, 12): [("Ingan Pinubuos.", 76.5, 77.95, "peter")],
    (11, 1): [("Oni onak murid mu pak doi nuna adat de pakai sumuk babai te?", 9.8, 13.0, "scholar")],
    (11, 2): [("Ingan posan sibaya Topa, ngan ingan nuna adat aturan de meh nai misia.", 13.9, 18.3, "jesus")],
    (11, 3): [("Ideh di koyuh de morot kang gonan nya de bikais odop nya. Pak eh koyuh daang otin nya.", 19.4, 24.2, "jesus")],
    (11, 5): [("Mitie masi duoh ingan. Kodi muot dowoh gonan onak dayung ku.", 31.45, 35.6, "woman")],
    (11, 6): [("Onak opet de patut nya ngin maan die neh. Doi nya patut mit pinguman suo yeh de munu ju meh ngin duoh kosuong.", 36.4, 42.95, "jesus")],
    (11, 7): [("Bonar Tuan. Pak eh kosuong de ribuo mija seen geh man pinguman de ruruh da onak opet.", 43.7, 49.3, "woman")],
    (11, 8): [("Paguh saut muu neh, maad negeh. Muot inuh meh ruah suo gonan onak mu.", 50.0, 55.4, "jesus")],
    (11, 13): [("Effata. Tibuka nih.", 80.05, 82.3, "jesus")],
    (11, 15): [("Tek-tek paguh koyuh de nai Nyaa itih neh. Nyaa de bongam ponai ngojit, nya de bibie ponai sina!", 91.0, 96.8, "disciple")],
    (5, 9): [("Takar madis ayuo eh meh puan, nya munu meh neg rie toban Jesus pari. Nya munu nang:", 48.5, 53.8, None), ("Yeh meh gira.", 53.83, 54.95, "family")],
    (5, 10): [("Yeh kasig muot pakai kuasa raja muot!", 55.9, 58.65, "scholar")],
    (5, 11): [("Jesus nang:", 59.6, 61.1, None), ("Watki Sitan kasig pibuu Sitan? Bori de doi bisamah otin eh, ideh di daped mujuog tuui.", 61.6, 68.0, "jesus")],
    (5, 13): [("Jesus meh in eh:", 76.0, 77.1, None), ("Osi sino duoh sikie sudi ku?", 77.9, 79.45, "jesus")],
    (5, 14): [("Osi de raan idip nuna de nang Topa, de munu leh sikie sudi ku, de munu leh sino ku.", 80.9, 87.0, "jesus")],
    (5, 3): [("Muu en eh Onak Topa!", 16.2, 18.4, "spirit")],
    (7, 3): [("Oni de raan Ingan duoh oku, Jesus, Onak Topa de Ayuh Manah Kiasa?", 19.6, 24.0, "spirit")],
    (7, 4): [("Osi aden mu?", 24.1, 26.9, "jesus")],
    (7, 5): [("Aden koih Legion. Nya koih boge.", 27.1, 29.8, "spirit")],
    (7, 7): [("Da koih moret kang oyuo de munu.", 33.35, 36.15, "spirit")],
    (7, 11): [("Ja oku rie nuna Ingan.", 54.0, 56.05, "disciple")],
    (7, 12): [("Pari negeh ke bori mu. Tanen duoh nyaa oni koyuh de meh nai Topa suo mu.", 57.2, 63.0, "jesus")],
    (8, 1): [("Onak dayungku doras monam. Mitie masi duoh Ingan, odi toma gonan eh da yeh bait.", 16.35, 22.25, "disciple")],
    (8, 4): [("Komo ku meh daped kadu toma jubah Eh, mokuo onam ku neh.", 39.0, 43.35, "woman")],
    (8, 6): [("Osi de toma jubah Ku?", 51.0, 53.15, "jesus")],
    (8, 8): [("Oo madis, mu meh bait sobab mu bisaya. Maad toban otin mu de sonang.", 61.6, 67.55, "jesus")],
    (8, 9): [("Onak ingan meh kobes. Dusah nya gaguo Mistar tia.", 68.6, 72.4, "scholar")],
    (8, 10): [("Ma toru. Bisaya negeh.", 73.85, 75.95, "jesus")],
    (8, 13): [("Talitha koum. Onak dayung, Oku da muu mokat.", 90.4, 95.05, "jesus")],
    (9, 1): [("Suo ki Yeh daped suo koyuh de in niti? Abah tukang koyuh sija? Onak Mary?", 7.05, 12.55, "scholar")],
    (9, 3): [("Nabi neh kati kanih nya hormat eh, jek eh de topat dep eh sija nya doi hormat eh.", 16.1, 21.55, "jesus")],
    (9, 8): [("Joanis, nya de notek ku bak eh, meh mokat idip bauh!", 51.95, 55.5, "herod")],
    (9, 11): [("Simun-mun koyuh de mitie mu ngin ku geh. Aropun stongah negri ku.", 74.1, 78.8, "herod")],
    (9, 12): [("Oni de rie mitie ku yeh?", 79.65, 81.75, "girl")],
    (9, 13): [("Oku ran bak Joanis Baptista.", 82.35, 84.85, "queen")],
    (10, 1): [("Get nuna Oku ke topat de motug de doi nyaa dang eh, sa te daped re'e ni tirie.", 8.0, 14.05, "jesus")],
    (10, 4): [("Onu meh ramat. Da nya muti pari die karik pinguman.", 31.95, 35.55, "disciple")],
    (10, 5): [("Dop ingan ngin pinguman duoh eh.", 36.1, 38.5, "jesus")],
    (10, 6): [("Otto jek ogi 5 kruang ruti, 2 porong kien.", 39.25, 43.0, "disciple")],
    (10, 12): [("Ai munuo tu inuh neh!", 78.5, 80.5, "disciple")],
    (10, 13): [("Ma naru dep ingan. Oku itih neh. Ma toru.", 81.45, 85.9, "jesus")],
    (6, 1): [("Ogi nyaa motak dabur ruang koyuh de rie puruh eh.", 8.4, 11.3, "jesus")],
    (6, 2): [("Ogi ruang de rabu dang oran, ju manuk meh neg man eh. Ogi de rabu de batuh, asa onu meh putiek yeh meh korong. Ogi geh de rabu de tana de boge koyuh de roja, ju meh obuoh kup meh doi ponai rie bibua.", 11.3, 26.3, "jesus")],
    (6, 3): [("Pak ogi geh de rabu de tana de buog-mamuo. Ju meh bibua. 30, 60, 100 sideh.", 26.35, 34.6, "jesus")],
    (6, 4): [("Pritah Topa itih koda ruang koyuh, ruang de sit geh, rie bibua jadi tongon de ayuh.", 34.95, 40.95, "jesus")],
    (6, 5): [("Singumi inuh Yeh meh nang:", 41.0, 43.15, None), ("Ja te motas ke pirad kanih.", 43.2, 45.0, "jesus")],
    (6, 8): [("Mistar! Ideh keh ingan gaguo otte meh rie kuom?", 53.95, 57.7, "disciple")],
    (6, 9): [("Ngorek nya. Tono tia.", 57.75, 61.4, "jesus")],
    (6, 11): [("Oni ingan pak skia toru? Aruo keh di ingan bisaya?", 65.6, 69.2, "jesus")],
    (6, 12): [("Onak murid eh meh sikubuon toru, ju meh in eh:", 69.25, 73.4, None), ("Osi-osi Nyaa itih? Sapai sobak ribut duoh grumang ngojit sina Eh.", 73.45, 77.5, "disciple")],
}
VOICE_FX = {  # character voices (ffmpeg chains); the narrator stays natural
    "jesus": "aecho=0.9:0.7:90|180|320:0.22|0.13|0.07",  # the creator's own voice, untouched, with a gentle echo (ep5)
    "spirit": "rubberband=pitch=0.72:formant=shifted,lowpass=f=3500,aecho=0.8:0.75:80|160|260:0.4|0.28|0.16,acrusher=bits=10:mix=0.15",
    "scholar": "rubberband=pitch=1.08:formant=preserved,highpass=f=280,lowpass=f=5200,equalizer=f=1400:t=q:w=1.2:g=5",
    "family": "rubberband=pitch=1.06:formant=preserved,highpass=f=160,equalizer=f=2600:t=q:w=1:g=3",
    "woman": "rubberband=pitch=1.16:formant=preserved,highpass=f=200,equalizer=f=3000:t=q:w=1:g=3",
    "herod": "rubberband=pitch=0.86:formant=preserved,lowshelf=f=150:g=3",
    "girl": "rubberband=pitch=1.22:formant=preserved,highpass=f=220,equalizer=f=3200:t=q:w=1:g=3",
    "queen": "rubberband=pitch=1.12:formant=preserved,highpass=f=200,equalizer=f=1800:t=q:w=1:g=4,aecho=0.8:0.5:60:0.15",
    "blind": "rubberband=pitch=1.1:formant=preserved,highpass=f=180,equalizer=f=2200:t=q:w=1:g=3",
    "peter": "rubberband=pitch=0.94:formant=preserved,lowshelf=f=160:g=2,equalizer=f=2400:t=q:w=1:g=2",
    "young": "rubberband=pitch=1.12:formant=preserved,highpass=f=200,equalizer=f=3000:t=q:w=1:g=2",
    "crowd": "asplit=3[a][b][c];[b]rubberband=pitch=0.92:formant=preserved,adelay=35,volume=0.55[b2];[c]rubberband=pitch=1.08:formant=preserved,adelay=60,volume=0.5[c2];[a][b2][c2]amix=inputs=3:normalize=0,aecho=0.8:0.5:70:0.2",
    "disciple": "rubberband=pitch=1.06:formant=preserved,highpass=f=160,equalizer=f=2600:t=q:w=1:g=3",
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
if EP == 6:
    LINES = LINES6
if EP == 7:
    LINES = LINES7
if EP == 8:
    LINES = LINES8
if EP == 9:
    LINES = LINES9
if EP == 10:
    LINES = LINES10
    if TAKE == 2:  # second recording (Bible_part_10.m4a): new start/end per line
        T2 = [(1.95, 5.9), (6.95, 12.05), (13.2, 19.3), (20.5, 27.6), (29.1, 32.2), (33.6, 35.4), (36.55, 39.4), (40.85, 45.0),
              (45.05, 53.95), (54.85, 60.75), (62.35, 65.85), (66.8, 70.7), (71.5, 72.8), (74.0, 77.55), (78.85, 83.9), (85.1, 86.7)]
        LINES = [(tx, a_, b_, k_, al) for (tx, _, _, k_, al), (a_, b_) in zip(LINES10, T2)]
        for (ep_, n_), parts in list(PARTS.items()):
            if ep_ == 10:
                PARTS[(ep_, n_)] = [(pt, T2[n_][0], T2[n_][1], fx) for (pt, _, _, fx) in parts]
if EP == 11:
    LINES = LINES11
if EP == 93:
    LINES = LINES93
if EP == 12:
    LINES = LINES12
if EP == 13:
    LINES = LINES13
if EP == 14:
    LINES = LINES14
if EP == 15:
    LINES = LINES15
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
if EP == 6:
    TH = -35
if EP == 11:
    TH = -34
if EP == 93:
    TH = -43
if EP == 12:
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

CUTS = {15: [(74.76, 75.36)]}  # raw-time pauses the creator asked to remove (ep 15: "ngojit … pingajar")
def clip(s, e, src=None):
    x = (a if src is None else src)[int((s - 0.06) * SR): int((e + 0.1) * SR)]
    for cs, ce in reversed(CUTS.get(EP, [])):
        if src is None and s - 0.06 < cs and ce < e + 0.1:
            i0, i1 = int((cs - s + 0.06) * SR), int((ce - s + 0.06) * SR)
            x = np.concatenate([x[:i0], x[i1:]])
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
    if kind == "jesus" and EP >= 6:
        kind = None  # creator's request: Jesus in the natural voice, no echo
    if kind == "god":
        return god_voice(x)
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
