import React from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {BIBLE_SCENES} from './scenes';
import data from './data.json';

if (typeof document !== 'undefined') {
  const h = delayRender('rubik-b1');
  new FontFace('Rubik', `url(${staticFile('fonts/Rubik-Variable.woff2')}) format('woff2')`, {weight: '300 900'})
    .load()
    .then((f) => { document.fonts.add(f); continueRender(h); })
    .catch(() => continueRender(h));
}

type Line = {n: number; scene: string; bid: string; en: string; tempter: boolean; start: number; end: number};
type Sc = {id: string; start: number; end: number; lines: number[]};
type Pg = {line: number; start: number; end: number; words: {text: string; start: number}[]};
type D = {duration: number; lines: Line[]; scenes: Sc[]; pages: Pg[]; keywords: string[]};
const D0 = data as unknown as D;
export const BIBLE1_DUR = D0.duration;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const KW = new Set(D0.keywords.map((k) => k.toLowerCase()));
const isKey = (w: string) => KW.has(w.toLowerCase().replace(/[^a-z0-9]/g, ''));
const lineAt = (n: number) => D0.lines.find((l) => l.n === n)!;

const World: React.FC<{w: number; h: number}> = ({w, h}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = Math.max(0, D0.scenes.findIndex((s) => t >= s.start && t < s.end));
  const sc = D0.scenes[i];
  const local = t - sc.start;
  const C = BIBLE_SCENES[sc.id];
  const ls = sc.lines.map(lineAt);
  const wide = w > h;
  const dip = i > 0 ? 1 - interpolate(local, [0, 0.4], [0, 1], cl) : 0;
  const fadeIn = interpolate(t, [0, 0.6], [1, 0], cl);
  return (
    <AbsoluteFill>
      <ThreeCanvas key={sc.id} width={w} height={h} shadows camera={{fov: wide ? 30 : 34, position: [0, 2, 8]}} gl={{antialias: true, preserveDrawingBuffer: true}}>
        <C t={local} dur={sc.end - sc.start} ln={ls.map((l) => l.start - sc.start)} le={ls.map((l) => l.end - sc.start)} wide={wide} />
      </ThreeCanvas>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,6,14,0.5) 100%)'}} />
      {dip > 0 ? <AbsoluteFill style={{background: '#fff4e2', opacity: dip * 0.85}} /> : null}
      {fadeIn > 0 ? <AbsoluteFill style={{background: '#000', opacity: fadeIn}} /> : null}
    </AbsoluteFill>
  );
};

/** Bidayuh words (keywords in yellow CAPS) + small English line underneath */
const Captions: React.FC<{size: number; maxW: number}> = ({size, maxW}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = D0.pages.find((x) => t >= x.start && t < x.end);
  const ln = D0.lines.find((l) => t >= l.start - 0.1 && t < l.end + 0.35);
  if ((!p && !ln) || t >= D0.scenes[D0.scenes.length - 1].start) return null; // title card carries its own text
  const tem = ln?.tempter;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.22, maxWidth: maxW}}>
      {p ? (
        <div style={{background: tem ? 'rgba(60,8,16,0.62)' : 'rgba(20,16,24,0.55)', borderRadius: size * 0.28, padding: `${size * 0.14}px ${size * 0.4}px`, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.26, fontFamily: 'Rubik', fontWeight: 800, fontSize: size, color: '#fff', textShadow: '0 3px 10px rgba(0,0,0,0.5)', fontStyle: tem ? 'italic' : 'normal'}}>
          {p.words.map((w, i) => {
            const k = isKey(w.text);
            return <span key={i} style={{color: k ? '#FFD23F' : '#fff', opacity: t >= w.start - 0.03 ? 1 : 0.45}}>{k ? w.text.toUpperCase() : w.text}</span>;
          })}
        </div>
      ) : null}
      {ln ? <div style={{fontFamily: 'Rubik', fontWeight: 600, fontSize: size * 0.48, color: 'rgba(255,255,255,0.92)', textShadow: '0 2px 8px rgba(0,0,0,0.85)', textAlign: 'center', fontStyle: 'italic'}}>{ln.en}</div> : null}
    </div>
  );
};

const speaking = (t: number) => {
  let v = 0;
  for (const l of D0.lines) {
    const a = l.start - 0.2, b = l.end + 0.2;
    if (t >= a - 0.5 && t <= b + 0.5) v = Math.max(v, interpolate(t, [a - 0.5, a, b, b + 0.5], [0, 1, 1, 0], cl));
  }
  return v;
};

type Fx = {t: number; src: string; volume: number; dur?: number};
const S = (id: string) => D0.scenes.find((s) => s.id === id)!;
const L = (n: number) => lineAt(n).start;
const SFX: Fx[] = [
  ...D0.scenes.slice(1).map((s) => ({t: s.start - 0.25, src: 'whoosh_organic', volume: 0.22})),
  {t: S('river').start, src: 'river_loop', volume: 0.32, dur: S('river').end - S('river').start},
  {t: L(2) + 1.2, src: 'splash', volume: 0.35},
  {t: L(3) - 0.15, src: 'thunder', volume: 0.55},
  {t: L(4) - 0.1, src: 'heaven_bells', volume: 0.38},
  {t: S('desert').start, src: 'wind_loop', volume: 0.3, dur: S('bow').end - S('desert').start},
  {t: L(7) + 0.4, src: 'ghost_whoosh', volume: 0.45},
  {t: L(8) - 0.5, src: 'ghost_whoosh', volume: 0.3},
  {t: L(8) + 1.6, src: 'stone', volume: 0.5},
  {t: L(10) - 0.5, src: 'ghost_whoosh', volume: 0.3},
  {t: L(12) - 0.5, src: 'ghost_whoosh', volume: 0.35},
  {t: L(14) + 0.45, src: 'boom', volume: 0.42},
  {t: L(14) + 0.5, src: 'heaven_bells', volume: 0.3},
  {t: S('angels').start + 0.2, src: 'bowl_atmos', volume: 0.35},
  {t: S('title').start + 0.2, src: 'boom', volume: 0.25},
];

const Sound: React.FC<{music: number}> = ({music}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <>
      <Audio src={staticFile('b1/voice.wav')} />
      <Audio src={staticFile('music/ancient_rite.mp3')} loop volume={(f) => music * (1.7 - 0.7 * speaking(f / fps)) * interpolate(f, [0, fps * 1.5, durationInFrames - fps * 2.5, durationInFrames], [0.2, 1, 1, 0], cl)} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} durationInFrames={s.dur ? Math.round(s.dur * fps) : undefined} layout="none">
          <Audio src={staticFile(`sfx/${s.src}.mp3`)} loop={!!s.dur} volume={(f) => s.volume * (s.dur ? interpolate(f, [0, fps, s.dur * fps - fps, s.dur * fps], [0, 1, 1, 0], cl) : 1)} />
        </Sequence>
      ))}
    </>
  );
};

type Props = {music: number};
/** YouTube 16:9 */
export const BibleLong: React.FC<Props> = ({music}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <World w={1920} h={1080} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center'}}><Captions size={54} maxW={1500} /></div>
    <Sound music={music} />
  </AbsoluteFill>
);
/** TikTok 9:16 (captions kept inside the safe zone, above the UI) */
export const BibleTall: React.FC<Props> = ({music}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <World w={1080} h={1920} />
    <div style={{position: 'absolute', left: 90, right: 150, top: 1240, display: 'flex', justifyContent: 'center'}}><Captions size={58} maxW={840} /></div>
    <Sound music={music} />
  </AbsoluteFill>
);
