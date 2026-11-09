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
