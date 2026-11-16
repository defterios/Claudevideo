import React from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CHAPTER, SCENES} from './scenes';
import {BODY, C, Halftone, TITLE, cl, ease, pop} from './kit';
import longData from './long.json';
import shortData from './short.json';

if (typeof document !== 'undefined') {
  const h = delayRender('wwe fonts');
  Promise.all([
    new FontFace('Anton', `url(${staticFile('fonts/Anton-400.woff2')}) format('woff2')`, {weight: '400'}).load(),
    new FontFace('Inter Tight', `url(${staticFile('fonts/InterTight-Variable.woff2')}) format('woff2')`, {weight: '100 900'}).load(),
  ])
    .then((l) => {
      l.forEach((f) => document.fonts.add(f));
      continueRender(h);
    })
    .catch(() => continueRender(h));
}

type Data = {duration: number; scenes: unknown[]; pages: unknown[]; sfx: unknown[]};
type Sc = {id: string; start: number; end: number; cues: Record<string, number>};
export const WWE_LONG_DUR = longData.duration;
export const WWE_SHORT_DUR = shortData.duration;

const useScene = (data: Data) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const scenes = data.scenes as unknown as Sc[];
  const i = Math.max(0, scenes.findIndex((s) => t >= s.start && t < s.end));
  return {t, sc: scenes[i], prev: i > 0 ? scenes[i - 1] : null};
};

/** the animated 1920x1080 stage, with a comic diagonal wipe between scenes */
const Stage: React.FC<{data: Data}> = ({data}) => {
  const {t, sc, prev} = useScene(data);
  const local = t - sc.start;
  const dur = sc.end - sc.start;
  const cue = (name: string, frac = 0.5) => (sc.cues[name] !== undefined ? sc.cues[name] : frac * dur);
  const S = SCENES[sc.id];
  const w = ease(local, 0, 0.32); // wipe progress
  const P = prev ? SCENES[prev.id] : null;
  const pcue = (name: string, frac = 0.5) => (prev && prev.cues[name] !== undefined ? prev.cues[name] : frac * ((prev?.end ?? 1) - (prev?.start ?? 0)));
  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{display: 'block'}}>
      <defs>
        <clipPath id={`wipe`}>
          <polygon points={`${-400 + w * 2800},0 ${-400 + w * 2800 - 400},1080 -500,1080 -500,0`} />
        </clipPath>
      </defs>
      {P && w < 1 ? (
        <g>
          <P t={t - prev!.start} dur={prev!.end - prev!.start} cue={pcue} />
        </g>
      ) : null}
      <g clipPath={P && w < 1 ? 'url(#wipe)' : undefined}>
        <S t={local} dur={dur} cue={cue} has={(n) => sc.cues[n] !== undefined} />
      </g>
      {P && w < 1 ? <line x1={-400 + w * 2800} y1={0} x2={-400 + w * 2800 - 400} y2={1080} stroke={C.orange} strokeWidth={36} /> : null}
      <Halftone o={0.05} />
    </svg>
  );
};

const HUD: React.FC<{data: Data; scale?: number}> = ({data, scale = 1}) => {
  const {t, sc} = useScene(data);
  const [a, b] = CHAPTER[sc.id] ?? ['', ''];
  if (!a) return null;
  const p = pop(t, sc.start + 0.2);
  return (
    <div style={{display: 'flex', alignItems: 'stretch', transform: `scale(${scale * (0.6 + 0.4 * p)})`, transformOrigin: 'left top', opacity: p}}>
      <div style={{fontFamily: TITLE, fontSize: 64, color: '#fff', background: C.orange, border: `6px solid ${C.ink}`, padding: '2px 22px', WebkitTextStroke: `3px ${C.ink}`, paintOrder: 'stroke fill'}}>{a}</div>
      {b ? <div style={{fontFamily: TITLE, fontSize: 44, color: C.ink, background: '#fff', border: `6px solid ${C.ink}`, borderLeft: 'none', padding: '12px 22px'}}>{b}</div> : null}
    </div>
  );
};

const KEY = /^(wwe|tryout|survive|training|fall|bump|steel|wooden|foam|table|purple|ropes|bruises|bruised|cardio|fire|again|smile|promo|microphone|mic|camera|live|mistake|heart|road|off-season|body|confidence|mindset|comments|comment|follow|trampoline|olympians|bodybuilders)[.,?!:…]*$/i;
const Captions: React.FC<{data: Data; size: number}> = ({data, size}) => {
  const {t} = useScene(data);
  const page = (data.pages as unknown as {start: number; end: number; words: {text: string; start: number}[]}[]).find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.36}px`, maxWidth: size * 16}}>
      {page.words.map((w, i) => {
        const on = t >= w.start - 0.02;
        const key = KEY.test(w.text);
        return (
          <span key={i} style={{fontFamily: BODY, fontWeight: 900, fontSize: size, color: key ? '#FFD23F' : '#fff', WebkitTextStroke: `${size * 0.16}px ${C.ink}`, paintOrder: 'stroke fill', textTransform: 'uppercase', opacity: on ? 1 : 0.45, transform: `scale(${on && t - w.start < 0.12 ? 1.08 : 1})`, display: 'inline-block'}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const Sound: React.FC<{data: Data; voice: string; music: number}> = ({data, voice, music}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <>
      <Audio src={staticFile(voice)} />
      <Audio src={staticFile('music/sneaky_snitch.mp3')} loop volume={(f) => music * interpolate(f, [0, fps, durationInFrames - fps * 2, durationInFrames], [0.4, 1, 1, 0], cl)} />
      {(data.sfx as unknown as {t: number; src: string; volume: number}[]).map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} layout="none">
          <Audio src={staticFile(`sfx/${s.src}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </>
  );
};

/** YouTube 16:9 */
export const WweLong: React.FC<{music: number}> = ({music}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Stage data={longData as unknown as Data} />
    <div style={{position: 'absolute', left: 40, top: 36}}>
      <HUD data={longData as unknown as Data} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center'}}>
      <Captions data={longData as unknown as Data} size={62} />
    </div>
    <Sound data={longData as unknown as Data} voice="v6/long.wav" music={music} />
  </AbsoluteFill>
);

/** TikTok / IG 9:16: stage in the middle, blurred copy behind, title on top, captions below */
export const WweShort: React.FC<{music: number}> = ({music}) => {
  const frame = useCurrentFrame();
  const S = 0.62;
  const W = 1920 * S, H = 1080 * S;
  return (
    <AbsoluteFill style={{background: '#111'}}>
      <div style={{position: 'absolute', left: (1080 - 1920 * 1.78) / 2, top: 0, width: 1920 * 1.78, height: 1920, filter: 'blur(28px) brightness(0.55) saturate(1.2)'}}>
        <Stage data={shortData as unknown as Data} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{fontFamily: TITLE, fontSize: 92, lineHeight: 1, color: '#fff', WebkitTextStroke: `10px ${C.ink}`, paintOrder: 'stroke fill', transform: `rotate(-2deg)`}}>WILL YOU SURVIVE</div>
        <div style={{fontFamily: TITLE, fontSize: 112, lineHeight: 1.05, color: C.orange, WebkitTextStroke: `12px ${C.ink}`, paintOrder: 'stroke fill', transform: `rotate(-2deg) scale(${1 + 0.02 * Math.sin(frame / 8)})`}}>WWE TRAINING?</div>
      </div>
      <div style={{position: 'absolute', left: (1080 - W) / 2, top: 560, width: W, height: H, border: `8px solid ${C.ink}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
        <div style={{width: 1920, height: 1080, transform: `scale(${S})`, transformOrigin: '0 0'}}>
          <Stage data={shortData as unknown as Data} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, top: 470}}>
        <HUD data={shortData as unknown as Data} scale={0.85} />
      </div>
      <div style={{position: 'absolute', left: 50, right: 50, top: 1270, display: 'flex', justifyContent: 'center'}}>
        <Captions data={shortData as unknown as Data} size={64} />
      </div>
      <Sound data={shortData as unknown as Data} voice="v6/short.wav" music={music} />
    </AbsoluteFill>
  );
};
