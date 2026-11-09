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

## Layout rules
- Safe zone (TikTok + IG): x 60–930, y 210–1440 (`src/theme.ts`).
- Face box measured from footage: x 380–760, y 610–1110 — no graphic enters it.
- Titles/stats live above the head, chips left of the face, captions on the chest.

## Audio
- Voice: high-pass, denoise, compression, loudnorm −14 LUFS.
- Music: "Chill Wave" – Kevin MacLeod (incompetech.com), CC BY 4.0 → **credit required in the post caption**.
- SFX: Sonniss GDC Game Audio Bundle (royalty-free, commercial use, no attribution).
