import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../v2/theme';
import data from './data.json';
import {REGISTRY as REG3} from '../v3/Scenes';
import {CX, Card, Chip, Heavy, K, SANS, SlateBg, ease, pop} from '../v3/ui';
import {REGISTRY4, HeroTub} from './Scenes4';
import {Tubs3D} from './Tub3D';

if (typeof document !== 'undefined') {
  const h = delayRender('mono');
  new FontFace('JetBrains Mono', `url(${staticFile('fonts/JetBrainsMono.woff2')}) format('woff2')`, {weight: '400 700'})
    .load()
    .then((f) => {
      document.fonts.add(f);
      continueRender(h);
    })
    .catch(() => continueRender(h));
}

type Scene = {kind: string; start: number; end: number; beats: number[]; props: Record<string, any>};
type Vid = {src: string; srcStart: number; outStart: number; dur: number};
const scenes = data.scenes as Scene[];
const vids = data.video as Vid[];
const pages = data.pages as {start: number; end: number; words: {text: string; start: number; end: number}[]}[];
export const V4_DURATION: number = data.duration;
const OPEN_END = scenes.find((s) => !s.kind.startsWith('open'))!.start;
const PUNCH_AT = scenes.find((s) => s.kind === 'openPunch')!.start;
const END_AT = vids.find((v) => v.src === 'c3')!.outStart;
const ALL: Record<string, React.FC<any>> = {...REG3, ...REGISTRY4};

const Clips: React.FC<{src: string; filter?: string}> = ({src, filter}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const list = vids.filter((v) => v.src === src);
  return (
    <>
      {list.map((v, i) => {
        const from = Math.round(v.outStart * fps);
        const last = i === list.length - 1;
        return (
          <Sequence key={i} from={from} durationInFrames={last && src === 'c3' ? durationInFrames - from : Math.max(1, Math.round(v.dur * fps))} layout="none">
            <AbsoluteFill>
              <OffthreadVideo src={staticFile(`v4/${src}.mp4`)} muted trimBefore={Math.round(v.srcStart * fps)} style={{width: '100%', height: '100%', objectFit: 'cover', filter}} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};

const GRADE = 'contrast(1.08) saturate(0.95) brightness(0.97)';

/** Opening speaker: split (bottom) → punch-in close-up. Face sits high in this clip. */
const OpenSpeaker: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t >= OPEN_END + 0.25) return null;
  const p = ease(t, PUNCH_AT - 0.05, PUNCH_AT + 0.25);
  const top = interpolate(p, [0, 1], [820, 0]);
  const k = 1;
  return (
    <div style={{position: 'absolute', left: 0, top, width: 1080, height: 1920 - top, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${interpolate(p, [0, 1], [-170, 0])}px) scale(${k})`, transformOrigin: '540px 520px'}}>
        <Clips src="c1" filter={GRADE} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 200, opacity: 1 - p, background: `linear-gradient(180deg, ${K.bg1}, rgba(53,61,73,0))`}} />
    </div>
  );
};

const EndSpeaker: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  if (t < END_AT - 0.01) return null;
  const inP = ease(t, END_AT, END_AT + 0.25);
  const k = interpolate(t, [END_AT, durationInFrames / fps], [1.03, 1.08]);
  return (
    <AbsoluteFill style={{opacity: inP, filter: inP < 1 ? `blur(${(1 - inP) * 16}px)` : undefined}}>
      <AbsoluteFill style={{transform: `scale(${k})`, transformOrigin: '540px 900px'}}>
        <Clips src="c3" filter={GRADE} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(27,32,39,0.7) 0%, rgba(27,32,39,0) 34%, rgba(27,32,39,0) 70%, rgba(27,32,39,0.5) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ---------- opening top-half content ---------- */
const OpenTop: React.FC<{sc: Scene; local: number}> = ({sc, local}) => {
  if (sc.kind === 'openTubs') {
    const vs = ['concentrate', 'isolate', 'hydro'] as const;
    const names = ['CONCENTRATE', 'ISOLATE', 'HYDROLYZED'];
    return (
      <>
        <div style={{position: 'absolute', left: -45, top: 200}}>
          <Tubs3D width={1080} height={500} camZ={9.4} items={vs.map((v, i) => {
            const p = pop(local, (sc.beats[i] ?? i * 0.4) - 0.2);
            return {variant: v, x: (i - 1) * 2.45, y: interpolate(p, [0, 1], [-2.5, -0.1]), rotY: -0.35 * (i - 1) + Math.sin(local * 1.3 + i) * 0.15, scale: 0.05 + 0.85 * p};
          })} />
        </div>
        {names.map((n, i) => (
          <div key={n} style={{position: 'absolute', left: CX - 45 + (i - 1) * 270 - 85, top: 690, width: 260, display: 'flex', justifyContent: 'center'}}>
            <Chip text={n} tone={i === 0 ? 'yellow' : i === 1 ? 'blue' : 'red'} size={22} p={pop(local, sc.beats[i] ?? 0.5)} />
          </div>
        ))}
      </>
    );
  }
  if (sc.kind === 'openTitle') {
    const [a, b] = sc.props.big as string[];
    return (
      <div style={{position: 'absolute', top: 330, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 44, color: K.dim, opacity: ease(local, 0, 0.25)}}>{sc.props.small}</div>
        <Heavy text={a} size={124} p={ease(local, 0.05, 0.3)} />
        <Heavy text={b} size={124} p={ease(local, 0.15, 0.4)} color={K.yellow} />
      </div>
    );
  }
  return (
    <div style={{position: 'absolute', top: 1180, width: 990, display: 'flex', justifyContent: 'center'}}>
      <Chip text={sc.props.chip} p={pop(local, 0.1)} dot={K.green} size={34} />
    </div>
  );
};

/* ---------- closing overlays (above the head, top zone 210..620) ---------- */
const EndTop: React.FC<{sc: Scene; local: number}> = ({sc, local}) => {
  if (sc.kind === 'endPick') {
    return (
      <Card local={local} at={0.05} style={{left: CX - 410, top: 230, width: 820, height: 330, background: 'rgba(24,29,36,0.9)', display: 'flex', alignItems: 'center'}}>
        <div style={{width: 300, height: 330, position: 'relative'}}>
          <HeroTub variant="concentrate" local={local + 0.6} w={300} h={330} camZ={6.6} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: K.dim}}>BEGINNER?</div>
          <Heavy text="CONCENTRATE" size={66} color={K.yellow} p={ease(local, sc.beats[0] - 0.1, sc.beats[0] + 0.25)} />
          <div style={{marginTop: 6}}>
            <Chip text="✓ COACH'S PICK" tone="green" size={28} p={pop(local, sc.beats[1] ?? 1.5)} />
          </div>
        </div>
      </Card>
    );
  }
  // endChips
  return (
    <div style={{position: 'absolute', top: 260, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
      <Heavy text="WHAT ACTUALLY WORKS" size={58} p={ease(local, 0, 0.3)} />
      <div style={{display: 'flex', gap: 14}}>
        <Chip text="✓ CONSISTENT TRAINING" tone="green" size={30} p={pop(local, sc.beats[0])} />
        <Chip text="✓ GOOD DIET" tone="yellow" size={30} p={pop(local, sc.beats[1])} />
      </div>
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
  if (sc.kind.startsWith('open') || sc.kind.startsWith('end')) return null;
  const C = ALL[sc.kind];
  const prev = i > 0 && ALL[scenes[i - 1].kind] ? scenes[i - 1] : null;
  const inP = ease(local, 0, 8 / fps);
  const P = prev ? ALL[prev.kind] : null;
  return (
    <AbsoluteFill style={{transform: 'translateY(40px)'}}>
      {P && inP < 1 ? (
        <AbsoluteFill style={{filter: `blur(${inP * 18}px)`, opacity: 1 - inP, transform: `translateY(${-inP * 60}px)`}}>
          <P local={t - prev!.start} dur={prev!.end - prev!.start} beats={prev!.beats} props={prev!.props} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{opacity: prev ? inP : ease(local, 0, 0.25)}}>
        <C local={local} dur={sc.end - sc.start} beats={sc.beats} props={sc.props} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** opening / closing overlays drawn above the speaker */
const TopLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sc = scenes.find((s) => t >= s.start && t < s.end);
  if (!sc) return null;
  if (sc.kind.startsWith('open')) return <OpenTop sc={sc} local={t - sc.start} />;
  if (sc.kind.startsWith('end')) return <EndTop sc={sc} local={t - sc.start} />;
  return null;
};

const KEY = /^(concentrate|isolate|hydrolyzed|whey|protein|lactose|fat|carbs|cheapest|expensive|stomach|absorption|filtering|beginner|diet|training|science)[,.?]?$/i;
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  const y = t >= END_AT ? 1370 : t < PUNCH_AT ? 770 : t < OPEN_END ? 1300 : 1265;
  return (
    <div style={{position: 'absolute', top: y, width: 990, display: 'flex', justifyContent: 'center', opacity: ease(t, page.start, page.start + 0.08)}}>
      <div style={{background: 'rgba(18,22,28,0.88)', borderRadius: 18, padding: '10px 22px 12px', fontFamily: SANS, fontWeight: 800, fontSize: 40, color: K.white, border: `1.5px solid ${K.line}`, boxShadow: '0 10px 30px rgba(0,0,0,0.35)', maxWidth: 820, textAlign: 'center'}}>
        {page.words.map((w, i) => (
          <span key={i} style={{color: KEY.test(w.text) ? K.dim : K.white, opacity: t >= w.start - 0.03 ? 1 : 0.4}}>
            {w.text}
            {i < page.words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export const WheyV4: React.FC<{musicVolume: number}> = ({musicVolume}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: K.bg2}}>
      <SlateBg />
      <OpenSpeaker />
      <SceneLayer />
      <EndSpeaker />
      <TopLayer />
      <Captions />
      <Audio src={staticFile('v4/voice_edit.wav')} />
      <Audio src={staticFile('music/bgm.mp3')} loop volume={(f) => musicVolume * interpolate(f, [0, fps, durationInFrames - fps * 1.5, durationInFrames], [0.5, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      {data.sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} layout="none">
          <Audio src={staticFile(`sfx/${s.src}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
