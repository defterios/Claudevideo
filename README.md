# GLP-1 talking-head edit (Remotion)

Vertical 1080x1920 edit for TikTok / IG Reels.

## Pipeline
1. **Transcribe** – faster-whisper `medium`, English, word timestamps.
2. **Plan** – `scripts/edit_plan.py`: cold-open hook, removed retake, caption fixes, every motion graphic + SFX (authored in *source* time).
3. **Build** – `python3 scripts/build_edit.py transcript.json` cuts pauses > 0.42 s, maps everything to the edited timeline and writes
   `src/data/edit.json` + `public/src/voice_edit.wav` (cleaned voice, crossfaded cuts).
4. **Render** – `npm run preview` (half-res, proxy) / final: 
   `npx remotion render Main out/final.mp4 --props='{"videoSrc":"src/original.mp4","musicVolume":0.085}'`

`public/src/` (source video, proxy, voice) is git-ignored — regenerate with ffmpeg (see build notes in the script).

## Style (v2 — cinematic, after reference edit)
- Cinematic grade (desaturated, contrast, teal shadows, vignette), blur-whip transitions on section changes.
- Kinetic typography (blur-reveal, word by word) in the negative space above the head.
- Motion-graphics scenes on a navy stage with the speaker in a PiP card (face stays visible):
  cards, receptor diagram, fat/muscle bar, 10 kg blocks, metabolism gears, gauges.
- Small clean captions, upcoming words dimmed, keywords in red.

## B-roll (v3)
- Photos (CC via Openverse/Flickr, see CREDITS.md) cover ~55 % of the runtime: topic moments + every span where
  gaze analysis (MediaPipe face landmarks: eye look-down/side, head yaw/pitch) shows reading off-camera.
- Portrait photos: full-bleed Ken Burns. Landscape: framed card over a blurred copy. During scenes: swapped into the PiP card.

## Layout rules
- Safe zone (TikTok + IG): x 60–930, y 210–1440 (`src/theme.ts`).
- Face box measured from footage: x 380–760, y 610–1110 — no graphic enters it.
- Titles/stats live above the head, chips left of the face, captions on the chest.

## Audio
- Voice (studio chain): high-pass 75 Hz, denoise, +2.5 dB warmth @120 Hz, −3.5 dB mud @320 Hz, +3.5 dB presence @3.8 kHz, air shelf, de-esser, 2-stage compression, limiter, −12 LUFS.
- Master: `scripts/master.sh in.mp4 out.mp4` (limiter + −12 LUFS / −1 dBTP).
- Music: "Chill Wave" – Kevin MacLeod (incompetech.com), CC BY 4.0 → **credit required in the post caption**.
- SFX: Sonniss GDC Game Audio Bundle (royalty-free, commercial use, no attribution).

---
# Video 2 — Ozempic vs Mounjaro (trainer POV)
Composition `OzVsMj` (`src/v2/`). Opening selfie clip + 3 voice-over recordings, editorial style after the reference
(forest green / cream, Bodoni Moda titles, serif captions in green boxes, UI-card animations, title behind the speaker).

1. Voice: studio chain per file (see above), −12 LUFS each.
2. `python3 scripts/segment_person.py public/v2/opening.mp4 public/v2/cut` → person cut-outs (MediaPipe selfie multiclass) for text-behind-subject.
3. `python3 scripts/build_v2.py <transcripts dir>` → cuts pauses > 0.26 s, writes `src/v2/data.json` + `public/v2/voice_edit.wav`.
   Creative plan lives in `scripts/plan_v2.py` (scenes anchored to spoken words).
4. `npx remotion render OzVsMj out/ozvsmj.mp4` then `scripts/master.sh`.

## Video 2 — v3 edit (slate / floating-cards reference)
Composition `OzVsMjV3` (`src/v3/`), same recordings + cuts as v2, plan in `scripts/plan_v3.py`:
split-screen opening (media cards on top, speaker below) → punch-in close-up; VO scenes as floating cards on a slate
background — code windows, UI chips (timer, progress, CALORIE DEFICIT ✓), big counters, red X, popping cards, comment bar.
Build: `PLAN=plan_v3 OUT=src/v3/data.json python3 scripts/build_v2.py <transcripts dir>`.

---
# Video 4 — Progressive Overload (cream / rust reference)
Composition `ProgressiveOverload` (`src/v5/PO.tsx`), plan in `scripts/plan_v5.py`.
Single selfie take → pauses cut, studio voice, eye-anchored punch-ins (MediaPipe face track → `src/v5/face.json`),
cream cut-aways (terminal, training log, stair chart, STOP cards, workout.log, last-week vs this-week), squared
Chakra Petch numbers/captions with rust keyword boxes, Sonniss SFX (plate clank, typing, ticks, thuds, paper).
Build: `PLAN=plan_v5 OUT=src/v5/data.json MEDIA=public/v5 python3 scripts/build_v2.py <transcripts dir>`.

---
# Jesus series, Episode 1 — "The Wilderness" (Mark 1)
Compositions `WildernessTall` (9:16, TikTok/Shorts) and `WildernessWide` (16:9, YouTube), `src/v8/`.
Style after the reference (narrated parable, big-head toon figures, warm flat sets, pop-in captions with a yellow keyword).

1. Script: `scripts/wilderness/script.py` (scene id, line, voice, pause, caption keywords).
2. Voice: `python3 scripts/wilderness/tts.py <kokoro model dir> <build dir>` — Kokoro-82M ONNX (`bm_george` narrator, `am_onyx` tempter).
3. Timeline + sound: `python3 scripts/wilderness/build.py <build dir>` → `src/v8/data.json`, `public/v8/voice.mp3`,
   `public/v8/bed.mp3` (score, ambience and impacts are synthesised in numpy — no third-party audio, no credit needed).
4. Render: `npx remotion render WildernessTall out/wilderness_tiktok_9x16.mp4 --crf=18` (same for `WildernessWide`).

Figures are a 2D SVG rig (`src/v8/fig.tsx`); every scene has its own camera with parallax (`src/v8/scenes.tsx`).
Caption word timings are estimated from line length, not aligned to the audio.

## Bidayuh (Bau) version — "Padang Pasir"
Compositions `WildernessTallBdy` / `WildernessWideBdy` (same scenes, `lang: 'bdy'`), creator voiceover.
1. `ffmpeg -i Bible_ep1.m4a -ac 1 -ar 24000 raw.wav`
2. `cd scripts/wilderness && python3 bidayuh.py raw.wav <build dir>` — cuts the recording into the 18 lines (start/end per line
   in `LINES`), shortens pauses > 0.42 s, faint echo on tempter lines, captions = the written Bidayuh text, and maps the
   English cue words the scenes use ("bread", "cross", "go", …) to their Bidayuh words.
3. `python3 scripts/wilderness/build.py <build dir> _bdy` → `src/v8/data_bdy.json`, `public/v8/voice_bdy.mp3`, `public/v8/bed_bdy.mp3`.

---
# Jesus series, Episode 2 — "Follow Me" (Mark 1:16-45)
Compositions `FollowTall` / `FollowWide` (`src/v9/`), sharing the player in `src/v8/Episode.tsx` and the figure rig / set pieces in `src/v8`.
1. Script: `scripts/wilderness/script_ep2.py`
2. Voice: `cd scripts/wilderness && SCRIPT=script_ep2 python3 tts.py <kokoro model dir> <build dir>`
3. Timeline + sound: `EP=2 python3 scripts/wilderness/build.py <build dir>` (cues in `scripts/wilderness/sound_ep2.py`) → `src/v9/data.json`, `public/v9/`.
4. `npx remotion render FollowTall out/follow_me_tiktok_9x16.mp4 --crf=18` (and `FollowWide`).

## Episode 2 Bidayuh — "Nuna Oku"
`cd scripts/wilderness && EP=2 python3 bidayuh.py raw.wav <build dir>` (lines + cue-word aliases in `LINES2`, extra pauses in `EXTRA_PAUSE`),
then `EP=2 python3 scripts/wilderness/build.py <build dir> _bdy`; compositions `FollowTallBdy` / `FollowWideBdy`.

---
# Jesus series, Episode 3 — "Through the Roof" (Mark 2:1-17), TikTok only
Composition `RoofTall` (`src/v10/`). Script `scripts/wilderness/script_ep3.py`, cues `scripts/wilderness/sound_ep3.py`.
`SCRIPT=script_ep3 python3 tts.py …` → `EP=3 python3 scripts/wilderness/build.py <build dir>` → `npx remotion render RoofTall out/through_the_roof_tiktok_9x16.mp4 --crf=18`.

---
# Jesus series, Episode 4 — "Lord of the Sabbath" (Mark 2:23-3:6), TikTok only, 80s-anime look
Composition `SabbathTall` (`src/v11/`): cel-shaded anime close-up heads, hands, wheat, robed silhouettes (`src/v11/anime.tsx`),
film mode in the shared player (bottom subtitles, purple/orange grade, heavier grain). Sparse dialogue, visual-first.
`SCRIPT=script_ep4 python3 tts.py …` → `EP=4 python3 scripts/wilderness/build.py <build dir>` → `npx remotion render SabbathTall out/lord_of_the_sabbath_tiktok_9x16.mp4 --crf=18`.
