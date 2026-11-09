import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import edit from './data/edit.json';
import {Captions} from './components/Captions';
import {Overlays} from './components/Overlays';
import {FACE} from './theme';
import type {CaptionPage, Overlay, Segment, Sfx} from './data/types';

const segments = edit.segments as Segment[];
const pages = edit.pages as CaptionPage[];
const overlays = edit.overlays as Overlay[];
const sfx = edit.sfx as Sfx[];
const flashes = edit.flashes as number[];
const captionHidden = edit.captionHidden as [number, number][];

export const MAIN_DURATION_SEC: number = edit.duration;

const Shot: React.FC<{seg: Segment; src: string; durationInFrames: number}> = ({seg, src, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Punch-in on the cut (hides jump cuts) + slow drift so a static tripod shot feels alive.
  const punch = spring({frame, fps, config: {damping: 18, stiffness: 220}, durationInFrames: 8});
  const drift = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 0.025]);
  const scale = seg.zoom * interpolate(punch, [0, 1], [seg.zoom > 1.05 ? 0.97 : 1.02, 1]) + drift;
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo
        src={src}
        muted
        trimBefore={Math.round(seg.srcStart * fps)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
          transformOrigin: `${FACE.cx}px ${FACE.cy - 60}px`,
        }}
      />
    </AbsoluteFill>
  );
};

const Flash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = Math.round(at * fps);
  const o = interpolate(frame, [f - 2, f, f + 6], [0, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  return <AbsoluteFill style={{backgroundColor: '#fff', opacity: o, mixBlendMode: 'screen'}} />;
};

/** Subtle cinematic vignette + grade; keeps the centre (face) untouched. */
const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'radial-gradient(ellipse 75% 60% at 52% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)',
      pointerEvents: 'none',
    }}
  />
);

export const Main: React.FC<{videoSrc: string; musicVolume: number}> = ({videoSrc, musicVolume}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const src = staticFile(videoSrc);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {segments.map((seg, i) => {
        const from = Math.round(seg.outStart * fps);
        const next = i + 1 < segments.length ? Math.round(segments[i + 1].outStart * fps) : durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={next - from} layout="none">
            <Shot seg={seg} src={src} durationInFrames={next - from} />
          </Sequence>
        );
      })}
      <Grade />
      {flashes.map((t, i) => (
        <Flash key={i} at={t} />
      ))}
      <Overlays items={overlays} />
      <Captions pages={pages} hiddenRanges={captionHidden} />

      {/* Cleaned + edited voice (pre-cut with crossfades, see scripts/build_edit.py) */}
      <Audio src={staticFile('src/voice_edit.wav')} volume={1} />
      {/* Background music: sits ~22 dB under the voice, fades in/out */}
      <Audio
        src={staticFile('music/bgm.mp3')}
        loop
        volume={(f) =>
          musicVolume *
          interpolate(f, [0, fps * 1.5, durationInFrames - fps * 3, durationInFrames], [0.4, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />
      {sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} layout="none">
          <Audio src={staticFile(`sfx/${s.src}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
