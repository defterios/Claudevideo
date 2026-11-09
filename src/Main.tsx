import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import edit from './data/edit.json';
import {Captions} from './components/Captions';
import {Overlays} from './components/Overlays';
import {BRollFull, BRollPip} from './components/BRoll';
import {C, FACE, PIP} from './theme';
import type {CaptionPage, Overlay, Segment, Sfx} from './data/types';

const segments = edit.segments as Segment[];
const pages = edit.pages as CaptionPage[];
const overlays = edit.overlays as Overlay[];
const sfx = edit.sfx as Sfx[];
const whips = edit.whips as number[];
const captionHidden = edit.captionHidden as [number, number][];
const scenes = overlays.filter((o) => o.type === 'scene');
const brolls = overlays.filter((o): o is Extract<Overlay, {type: 'broll'}> => o.type === 'broll');

export const MAIN_DURATION_SEC: number = edit.duration;

/** 0 = full-frame talking head, 1 = picture-in-picture card over the navy stage. */
const usePip = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let p = 0;
  for (const s of scenes) {
    const a = s.start * fps;
    const b = s.end * fps;
    if (frame < a - 2 || frame > b + 14) continue;
    const inn = spring({frame: frame - a, fps, config: {damping: 20, stiffness: 140}, durationInFrames: 14});
    const out = spring({frame: frame - b, fps, config: {damping: 20, stiffness: 140}, durationInFrames: 12});
    p = Math.max(p, inn - out);
  }
  return p;
};

const Shot: React.FC<{seg: Segment; src: string; durationInFrames: number}> = ({seg, src, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const punch = spring({frame, fps, config: {damping: 18, stiffness: 220}, durationInFrames: 8});
  const drift = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 0.03]);
  const scale = seg.zoom * interpolate(punch, [0, 1], [seg.zoom > 1.05 ? 0.97 : 1.02, 1]) + drift;
  return (
    <AbsoluteFill>
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
          // cinematic grade: lower saturation, deeper contrast, slightly cool
          filter: 'contrast(1.12) saturate(0.78) brightness(0.9) hue-rotate(-4deg)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Blur-whip transition: motion-blur zoom for a few frames around each cut point. */
const useWhip = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let w = 0;
  for (const t of whips) {
    const f = t * fps;
    if (Math.abs(frame - f) > 6) continue;
    w = Math.max(w, interpolate(frame, [f - 5, f, f + 6], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  }
  return w;
};

const Footage: React.FC<{src: string}> = ({src}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const p = usePip();
  const whip = useWhip();
  // PiP geometry: card rect lerps from full frame; footage inside scales so the face sits centred in the card.
  const x = interpolate(p, [0, 1], [0, PIP.x]);
  const y = interpolate(p, [0, 1], [0, PIP.y]);
  const w = interpolate(p, [0, 1], [1080, PIP.w]);
  const h = interpolate(p, [0, 1], [1920, PIP.h]);
  const k = interpolate(p, [0, 1], [1, PIP.scale]);
  const fx = interpolate(p, [0, 1], [0, PIP.w / 2 - FACE.cx * PIP.scale]);
  const fy = interpolate(p, [0, 1], [0, PIP.h / 2 - (FACE.cy - 40) * PIP.scale]);
  const transitionBlur = Math.sin(Math.PI * p) * 10 + whip * 22;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        overflow: 'hidden',
        borderRadius: interpolate(p, [0, 1], [0, PIP.radius]),
        boxShadow: p > 0.01 ? `0 40px 80px rgba(0,0,0,${0.6 * p})` : 'none',
        transform: `scale(${1 + whip * 0.12})`,
        filter: transitionBlur > 0.3 ? `blur(${transitionBlur}px)` : undefined,
      }}
    >
      <div style={{position: 'absolute', left: fx, top: fy, width: 1080, height: 1920, transform: `scale(${k})`, transformOrigin: '0 0'}}>
        {segments.map((seg, i) => {
          const from = Math.round(seg.outStart * fps);
          const next = i + 1 < segments.length ? Math.round(segments[i + 1].outStart * fps) : durationInFrames;
          return (
            <Sequence key={i} from={from} durationInFrames={next - from} layout="none">
              <Shot seg={seg} src={src} durationInFrames={next - from} />
            </Sequence>
          );
        })}
        {/* vignette + teal shadows on the footage itself */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 52% 45%, rgba(0,0,0,0) 45%, rgba(4,10,20,0.55) 100%), linear-gradient(180deg, rgba(8,24,32,0.25), rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.45))',
          }}
        />
      </div>
    </div>
  );
};

const Stage: React.FC = () => {
  const p = usePip();
  if (p <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, p * 1.5),
        background: `radial-gradient(ellipse 90% 60% at 50% 35%, ${C.navy1} 0%, ${C.navy2} 75%)`,
      }}
    />
  );
};

export const Main: React.FC<{videoSrc: string; musicVolume: number}> = ({videoSrc, musicVolume}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: C.navy2}}>
      <Stage />
      <Footage src={staticFile(videoSrc)} />
      <BRollPip items={brolls} />
      <BRollFull items={brolls} />
      <Overlays items={overlays.filter((o) => o.type !== 'broll')} />
      <Captions pages={pages} hiddenRanges={captionHidden} />

      <Audio src={staticFile('src/voice_edit.wav')} volume={1} />
      <Audio
        src={staticFile('music/bgm.mp3')}
        loop
        volume={(f) =>
          musicVolume *
          interpolate(f, [0, fps * 1.5, durationInFrames - fps * 3, durationInFrames], [0.4, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
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
