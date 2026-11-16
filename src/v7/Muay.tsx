import React from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {SCENES3} from './scenes3d';
import longData from './long.json';
import shortData from './short.json';

if (typeof document !== 'undefined') {
  const h = delayRender('rubik');
  new FontFace('Rubik', `url(${staticFile('fonts/Rubik-Variable.woff2')}) format('woff2')`, {weight: '300 900'})
    .load()
    .then((f) => {
      document.fonts.add(f);
      continueRender(h);
    })
    .catch(() => continueRender(h));
}

type Sc = {id: string; start: number; end: number; cues: Record<string, number>};
type Pg = {start: number; end: number; words: {text: string; start: number}[]};
type D = {duration: number; scenes: Sc[]; pages: Pg[]; sfx: {t: number; src: string; volume: number}[]};
const L = longData as unknown as D;
const S = shortData as unknown as D;
export const MUAY_LONG_DUR = L.duration;
export const MUAY_SHORT_DUR = S.duration;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const World: React.FC<{d: D; w: number; h: number}> = ({d, w, h}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = Math.max(0, d.scenes.findIndex((s) => t >= s.start && t < s.end));
  const sc = d.scenes[i];
  const local = t - sc.start;
  const dur = sc.end - sc.start;
  const cue = (n: string, f = 0.5) => (sc.cues[n] !== undefined ? sc.cues[n] : f * dur);
  const C = SCENES3[sc.id];
  const wide = w > h;
  // soft dip-to-warm-white between scenes (like the reference's gentle cuts)
  const dip = i > 0 ? 1 - interpolate(local, [0, 0.35], [0, 1], cl) : 0;
  return (
    <AbsoluteFill>
      <ThreeCanvas key={sc.id + i} width={w} height={h} shadows camera={{fov: wide ? 30 : 34, position: [0, 2, 8]}} gl={{antialias: true, preserveDrawingBuffer: true}}>
        <C t={local} dur={dur} cue={cue} wide={wide} />
      </ThreeCanvas>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,6,14,0.45) 100%)'}} />
      {dip > 0 ? <AbsoluteFill style={{background: '#fff4e2', opacity: dip * 0.9}} /> : null}
    </AbsoluteFill>
  );
};

const KEY = /^(thailand|holiday|survive|six|thirty-degree|again|noodles|bruises|shin|tree|hurts|two|six|clinch|half|floor|sparring|guard|push|breathe|fight|three|fire|cardio|shins|discipline|heart|stop|comments|follow)[.,?!:…]*$/i;
const Captions: React.FC<{d: D; size: number}> = ({d, size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = d.pages.find((x) => t >= x.start && t < x.end);
  if (!p) return null;
  return (
    <div style={{background: 'rgba(20,16,24,0.55)', borderRadius: size * 0.28, padding: `${size * 0.14}px ${size * 0.4}px`, display: 'flex', gap: size * 0.28, fontFamily: 'Rubik', fontWeight: 800, fontSize: size, color: '#fff', textShadow: '0 3px 10px rgba(0,0,0,0.5)'}}>
      {p.words.map((w, i) => (
        <span key={i} style={{color: KEY.test(w.text) ? '#FFD23F' : '#fff', opacity: t >= w.start - 0.03 ? 1 : 0.45}}>{w.text}</span>
      ))}
    </div>
  );
};

const Sound: React.FC<{d: D; voice?: string; music: number}> = ({d, voice, music}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <>
      {voice ? <Audio src={staticFile(voice)} /> : null}
      <Audio src={staticFile('music/sneaky_snitch.mp3')} loop volume={(f) => music * interpolate(f, [0, fps, durationInFrames - fps * 2, durationInFrames], [0.4, 1, 1, 0], cl)} />
      {d.sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} layout="none">
          <Audio src={staticFile(`sfx/${s.src}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </>
  );
};

type Props = {music: number; voice?: string};
/** YouTube 16:9 */
export const MuayLong: React.FC<Props> = ({music, voice}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <World d={L} w={1920} h={1080} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center'}}><Captions d={L} size={58} /></div>
    <Sound d={L} voice={voice} music={music} />
  </AbsoluteFill>
);
/** TikTok / IG 9:16, full length (like the reference) */
export const MuayTall: React.FC<Props> = ({music, voice}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <World d={L} w={1080} h={1920} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center'}}><Captions d={L} size={64} /></div>
    <Sound d={L} voice={voice} music={music} />
  </AbsoluteFill>
);
/** TikTok / IG 9:16, short cut (⭐ lines) */
export const MuayShort: React.FC<Props> = ({music, voice}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <World d={S} w={1080} h={1920} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center'}}><Captions d={S} size={64} /></div>
    <Sound d={S} voice={voice} music={music} />
  </AbsoluteFill>
);
