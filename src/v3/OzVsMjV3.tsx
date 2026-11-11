import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../v2/theme'; // loads Inter Tight / serif faces
import data from './data.json';
import {REGISTRY} from './Scenes';
import {CX, Card, Chip, Heavy, K, Photo, SANS, SlateBg, ease, pop} from './ui';

if (typeof document !== 'undefined') {
  const h = delayRender('mono font');
  new FontFace('JetBrains Mono', `url(${staticFile('fonts/JetBrainsMono.woff2')}) format('woff2')`, {weight: '400 700'})
    .load()
    .then((f) => {
      document.fonts.add(f);
      continueRender(h);
    })
    .catch(() => continueRender(h));
}

type Scene = {kind: string; start: number; end: number; beats: number[]; props: Record<string, any>};
type Word = {text: string; start: number; end: number};
const scenes = data.scenes as Scene[];
const video = data.video as {srcStart: number; outStart: number; dur: number}[];
const pages = data.pages as {start: number; end: number; words: Word[]}[];
export const V3_DURATION: number = data.duration;
const OPEN_END = scenes.find((s) => !s.kind.startsWith('open'))!.start;
const PUNCH_AT = scenes.find((s) => s.kind === 'openPunch')!.start;

/* ---------- speaker (opening only): split-screen bottom half, then punch-in close-up ---------- */
const Speaker: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t >= OPEN_END + 0.25) return null;
  const p = ease(t, PUNCH_AT - 0.05, PUNCH_AT + 0.25);
  const top = interpolate(p, [0, 1], [820, 0]);
  const off = interpolate(p, [0, 1], [-360, 0]);
  const k = interpolate(p, [0, 1], [1, 1.32]) + interpolate(t, [PUNCH_AT, OPEN_END], [0, 0.04], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 0, top, width: 1080, height: 1920 - top, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: off, width: 1080, height: 1920, transform: `scale(${k})`, transformOrigin: '540px 820px'}}>
        {video.map((v, i) => (
          <Sequence key={i} from={Math.round(v.outStart * fps)} durationInFrames={Math.max(1, Math.round(v.dur * fps))} layout="none">
            <AbsoluteFill>
              <OffthreadVideo src={staticFile('v2/opening.mp4')} muted trimBefore={Math.round(v.srcStart * fps)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.08) saturate(0.92) brightness(0.96)'}} />
            </AbsoluteFill>
          </Sequence>
        ))}
      </div>
      {/* soft seam into the slate background (split mode only) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 220, opacity: 1 - p, background: `linear-gradient(180deg, ${K.bg1}, rgba(53,61,73,0))`}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,12,16,0.45) 100%)'}} />
    </div>
  );
};

/* ---------- opening top-half content ---------- */
const OpenTop: React.FC<{sc: Scene; local: number; dur: number}> = ({sc, local, dur}) => {
  if (sc.kind === 'openSplit') {
    const imgs: string[] = sc.props.imgs;
    const labels: string[] = sc.props.labels;
    return (
      <>
        {imgs.map((im, i) => (
          <React.Fragment key={i}>
            <Card local={local} at={0.05 + i * 0.25} tilt={i ? 5 : -5} style={{left: i ? 520 : 80, top: 250, width: 390, height: 440}}>
              <Photo img={im} local={local} dur={dur} />
            </Card>
            <div style={{position: 'absolute', left: i ? 520 : 80, width: 390, top: 660, display: 'flex', justifyContent: 'center'}}>
              <Chip text={labels[i].toUpperCase()} tone={i ? 'yellow' : 'dim'} p={pop(local, 0.4 + i * 0.25)} />
            </div>
          </React.Fragment>
        ))}
        <div style={{position: 'absolute', left: CX - 60, top: 410, width: 120, height: 120, borderRadius: 60, background: K.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 48, color: K.bg2, boxShadow: '0 16px 40px rgba(0,0,0,0.5)', transform: `scale(${pop(local, sc.beats[0] ?? 1)})`}}>VS</div>
      </>
    );
  }
  if (sc.kind === 'openTitle') {
    const [a, vs, b] = sc.props.big as string[];
    return (
      <div style={{position: 'absolute', top: 270, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 44, color: K.dim, opacity: ease(local, 0, 0.3)}}>{sc.props.small}</div>
        <Heavy text={a} size={140} p={ease(local, 0.08, 0.4)} />
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 52, color: K.dim, opacity: ease(local, 0.2, 0.5)}}>{vs}</div>
        <Heavy text={b} size={140} p={ease(local, 0.3, 0.65)} color={K.yellow} />
      </div>
    );
  }
  // openPunch
  return (
    <div style={{position: 'absolute', top: 300, width: 990, display: 'flex', justifyContent: 'center'}}>
      <Chip text={sc.props.chip} p={pop(local, 0.15)} dot={K.green} size={32} />
    </div>
  );
};

const SceneLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = scenes.findIndex((s) => t >= s.start && t < s.end);
  if (i < 0) return null;
  const sc = scenes[i];
  const local = t - sc.start;
  const dur = sc.end - sc.start;
  if (sc.kind.startsWith('open')) return <OpenTop sc={sc} local={local} dur={dur} />;
  const C = REGISTRY[sc.kind];
  // previous scene blurs out quickly under the new one
  const prev = i > 0 && !scenes[i - 1].kind.startsWith('open') ? scenes[i - 1] : null;
  const inP = ease(local, 0, 8 / fps);
  const P = prev ? REGISTRY[prev.kind] : null;
  return (
    <AbsoluteFill style={{transform: 'translateY(90px)'}}>
      {P && inP < 1 ? (
        <AbsoluteFill style={{filter: `blur(${inP * 18}px)`, opacity: 1 - inP, transform: `translateY(${-inP * 60}px)`}}>
          <P local={t - prev!.start} dur={prev!.end - prev!.start} beats={prev!.beats} props={prev!.props} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{opacity: prev ? inP : ease(local, 0, 0.3)}}>
        <C local={local} dur={dur} beats={sc.beats} props={sc.props} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const KEY = /^(with|ozempic|mounjaro|semaglutide|tirzepatide|glp-1|gip|muscle|muscles|fat|protein|strength|mandatory|deficit|metabolism|crash|skinny|shortcuts|tools|full|appetite|pt|trainer|comments|view)$/i;
/** Caption pill: white bold sans, keywords in muted slate-blue (like the reference). */
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  const y = t < PUNCH_AT ? 735 : t < OPEN_END ? 1350 : 1225;
  return (
    <div style={{position: 'absolute', top: y, width: 990, display: 'flex', justifyContent: 'center', opacity: ease(t, page.start, page.start + 0.08)}}>
      <div style={{background: 'rgba(18,22,28,0.88)', borderRadius: 18, padding: '10px 22px 12px', fontFamily: SANS, fontWeight: 800, fontSize: 40, color: K.white, border: `1.5px solid ${K.line}`, boxShadow: '0 10px 30px rgba(0,0,0,0.35)', maxWidth: 820, textAlign: 'center'}}>
        {page.words.map((w, i) => (
          <span key={i} style={{color: KEY.test(w.text.replace(/[^A-Za-z0-9-]/g, '')) ? K.dim : K.white, opacity: t >= w.start - 0.03 ? 1 : 0.4}}>
            {w.text}
            {i < page.words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export const OzVsMjV3: React.FC<{musicVolume: number}> = ({musicVolume}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: K.bg2}}>
      <SlateBg />
      <Speaker />
      <SceneLayer />
      <Captions />
      <Audio src={staticFile('v2/voice_edit.wav')} />
      <Audio
        src={staticFile('music/bgm.mp3')}
        loop
        volume={(f) => musicVolume * interpolate(f, [0, fps, durationInFrames - fps * 2, durationInFrames], [0.5, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
      {data.sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} layout="none">
          <Audio src={staticFile(`sfx/${s.src}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
