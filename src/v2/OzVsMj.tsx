import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import data from './data.json';
import {Captions} from './Captions';
import {Kicker, REGISTRY} from './Scenes';
import {P, SERIF} from './theme';

type Scene = {kind: string; start: number; end: number; beats: number[]; props: Record<string, any>};
const scenes = data.scenes as Scene[];
const video = data.video as {srcStart: number; outStart: number; dur: number}[];
export const V2_DURATION: number = data.duration;
const CUT_FRAMES = 247;

/** source time of the opening clip shown at output time t */
const srcAt = (t: number) => {
  let v = video[0];
  for (const s of video) if (t >= s.outStart) v = s;
  return v.srcStart + Math.min(Math.max(0, t - v.outStart), v.dur - 1 / 30);
};

const OpeningFootage: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <>
      {video.map((v, i) => (
        <Sequence key={i} from={Math.round(v.outStart * fps)} durationInFrames={Math.max(1, Math.round(v.dur * fps))} layout="none">
          <AbsoluteFill>
            <OffthreadVideo
              src={staticFile('v2/opening.mp4')}
              muted
              trimBefore={Math.round(v.srcStart * fps)}
              style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.16) saturate(0.88) contrast(1.06) brightness(1.02)'}}
            />
          </AbsoluteFill>
        </Sequence>
      ))}
    </>
  );
};

/** Opening: big serif title sits BEHIND the speaker (person cut-out composited on top). */
const Opening: React.FC<{sc: Scene}> = ({sc}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const local = t - sc.start;
  const idx = Math.min(CUT_FRAMES - 1, Math.max(0, Math.round(srcAt(t) * 30)));
  const green = sc.props.mode === 'green';
  const p1 = interpolate(local, [0.05, 0.45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const p2 = interpolate(local, [0.25, 0.7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(local, [0, 3], [1.06, 1.0], {extrapolateRight: 'clamp'});
  const fg = green ? P.cream : '#FFFFFF';
  return (
    <AbsoluteFill>
      {green ? <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 70% at 50% 40%, ${P.green}, ${P.greenDeep})`}} /> : <OpeningFootage />}
      {!green ? <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,38,25,0.45), rgba(0,0,0,0) 45%)'}} /> : null}
      <div style={{position: 'absolute', top: 236, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${scale})`}}>
        <Kicker text={sc.props.kicker} p={p1} color={green ? P.sage : P.cream} />
        <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: sc.props.title.length > 7 ? 180 : 215, lineHeight: 0.95, letterSpacing: -5, color: fg, marginTop: 10, opacity: p1, filter: `blur(${(1 - p1) * 12}px)`, textShadow: green ? 'none' : '0 6px 40px rgba(0,0,0,0.35)'}}>
          {sc.props.title}
        </div>
        {sc.props.italic ? (
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 118, lineHeight: 1, color: green ? P.sage : P.cream, opacity: p2, filter: `blur(${(1 - p2) * 12}px)`, textShadow: green ? 'none' : '0 6px 40px rgba(0,0,0,0.35)'}}>
            {sc.props.italic}
          </div>
        ) : null}
      </div>
      {/* the speaker, cut out, in front of the title */}
      <Img src={staticFile(`v2/cut/${String(idx).padStart(4, '0')}.webp`)} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, filter: 'sepia(0.16) saturate(0.88) contrast(1.06) brightness(1.02)'}} />
    </AbsoluteFill>
  );
};

const SceneLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = scenes.findIndex((s) => t >= s.start && t < s.end);
  if (i < 0) return null;
  const draw = (sc: Scene, enter: boolean) => {
    if (sc.kind === 'opening') return <Opening sc={sc} />;
    const C = REGISTRY[sc.kind];
    return <C local={t - sc.start} dur={sc.end - sc.start} fps={fps} beats={sc.beats} props={sc.props} />;
  };
  const sc = scenes[i];
  const local = t - sc.start;
  // incoming scene blurs/zooms in over the previous one (7 frames)
  const inP = interpolate(local, [0, 7 / fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const prev = i > 0 && inP < 1 ? scenes[i - 1] : null;
  return (
    <AbsoluteFill>
      {prev ? <AbsoluteFill style={{filter: `blur(${inP * 16}px)`, transform: `scale(${1 + inP * 0.06})`}}>{draw(prev, false)}</AbsoluteFill> : null}
      <AbsoluteFill style={{opacity: i === 0 ? 1 : inP, filter: inP < 1 && i > 0 ? `blur(${(1 - inP) * 16}px)` : undefined, transform: `scale(${1.04 - 0.04 * inP})`}}>{draw(sc, true)}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** fine film grain + vignette for the editorial look */
const Finish: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 60%, rgba(10,20,14,0.28) 100%)'}} />
);

export const OzVsMj: React.FC<{musicVolume: number}> = ({musicVolume}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: P.greenDeep}}>
      <SceneLayer />
      <Finish />
      <Captions pages={data.pages as any} />
      <Audio src={staticFile('v2/voice_edit.wav')} />
      <Audio
        src={staticFile('music/bgm.mp3')}
        loop
        volume={(f) =>
          musicVolume * interpolate(f, [0, fps, durationInFrames - fps * 2, durationInFrames], [0.5, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
        }
      />
      {data.sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} layout="none">
          <Audio src={staticFile(`sfx/${s.src}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
