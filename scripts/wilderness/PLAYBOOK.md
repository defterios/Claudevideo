# Video playbook (Jesus series)

Lessons distilled from the code-rendered video prompts in `yihui-dev/awesome-opus5-5-videos`
(703 prompts for videos built as code — Remotion / Canvas / SVG / GSAP / Three.js), applied to this series.
Use this as the checklist for every new episode.

## Before building
- **Story first.** Write a storyboard table: time · what's on screen · what the moment is for · how it leaves · what carries into the next shot.
- **12–15 compositions per 30 s**, each ~1.4–3.5 s. Vary scale every shot: close → wide → overhead → full-frame type. Never repeat a layout twice in a row.
- **Frame one is a finished picture**, never a word halfway through flying in. It is also the TikTok thumbnail.
- **Name three signature moments** you can describe without effect names (e.g. "the hand opens in the light").
- **It must make sense with the sound off.**

## Motion
- One main movement leads, smaller ones layered under it, overlapping; the frame never freezes all at once.
  Quality bar: ≤ ~1 s of frozen screen per 30 s, no still stretch > ~0.5 s.
- Speed always changes: land slowly enough to read, leave fast. No linear motion.
- **Carried objects / match cuts**: one object keeps its identity across shots and lands on the same pixels on both sides of a cut (e.g. the hand, the mat, the lamp).
- Cut only when size, direction and subject match — or cut on the music.
- Every action has a visible result.
- **Use sparingly** (pro prompts ban them outright): shockwave rings, particle bursts, camera shake, lens flares, white flashes, bouncy easing.
  Keep at most one such accent per episode, for its single biggest beat.

## Text
- Captions measured in the real font and shrunk to fit the **9:16 safe zone** (nothing under TikTok's buttons: keep y < ~1500 and x within 60–960).
- Text never sits over busy picture without something behind it; ≥ 4.5:1 contrast.

## Sound
- **Cut scene changes on a beat grid** (pick a BPM for the score, snap scene boundaries to it).
- One soft whoosh per real scene change; small clicks/pops only on real on-screen actions.
- Place each effect so its *measured peak* (not file start) lands on the event.
- Effects never louder than the music; music ducks under voice; master to −14 LUFS, true peak ≤ −1 dBTP, no clipping.

## Review loop
- Render ~20 stills → one contact sheet → check the whole cut before any full render.
- Dense frames (16–20 fps) around every transition.
- Review with fresh eyes against the reference: ranked list of problems with timestamps, fix the biggest first, keep a ledger of rounds.
- "No bugs" is not the same as "good": compare side by side with the reference.

## Optional upgrades
- Real motion blur: render 3 sub-frames per frame (t − 1/240, t, t + 1/240) and blend (ffmpeg `tmix`).
- Multiple cuts from one codebase: the 60 s / 30 s / 15 s versions are just different scene lists.
