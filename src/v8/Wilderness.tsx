import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Defs, SCENES} from './scenes';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 1 — "The Wilderness" (Mark 1). Toon figures on painted sets, narrated, kinetic captions. */
if (typeof document !== 'undefined') {
  for (const [fam, file, wt] of [['Fredoka', 'Fredoka-700.woff2', '700'], ['Anton', 'Anton-400.woff2', '400']] as const) {
    const h = delayRender('font ' + fam);
    new FontFace(fam, `url(${staticFile('fonts/' + file)}) format('woff2')`, {weight: wt})
      .load()
      .then((f) => { document.fonts.add(f); continueRender(h); })
      .catch(() => continueRender(h));
  }
}

type Sc = {id: string; start: number; end: number; segs: number[]; w: Record<string, number>};
type Pg = {start: number; end: number; tempter: boolean; words: {text: string; start: number; key: boolean}[]};
type Data = {duration: number; scenes: Sc[]; pages: Pg[]};
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, {ep: string; title: [string, string]; ref: string; follow: string; voice: string; bed: string}> = {
  en: {ep: 'EPISODE 1', title: ['THE', 'WILDERNESS'], ref: 'MARK 1', follow: 'Follow for Part 2 →', voice: 'v8/voice.mp3', bed: 'v8/bed.mp3'},
  bdy: {ep: 'EPISOD 1', title: ['PADANG', 'PASIR'], ref: 'MARK 1', follow: 'Follow suo Part 2 →', voice: 'v8/voice_bdy.mp3', bed: 'v8/bed_bdy.mp3'},
};
export const WILD_DUR = DATA.en.duration;
export const WILD_DUR_BDY = DATA.bdy.duration;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const World: React.FC<{W: number; H: number; D: Data}> = ({W, H, D}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = Math.max(0, D.scenes.findIndex((s) => t >= s.start && t < s.end));
  const sc = D.scenes[i];
  const local = t - sc.start;
  const S = SCENES[sc.id];
  const dip = i > 0 ? 1 - interpolate(local, [0, 0.16], [0, 1], cl) : 0;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Defs />
        <S t={local} dur={sc.end - sc.start} w={(word, fb = 0) => sc.w[word] ?? fb} segs={sc.segs} wide={W > H} W={W} H={H} />
        {/* film grain */}
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 7} /><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.55 0" /></filter>
        <rect width={W} height={H} filter="url(#grain)" opacity={0.16} style={{mixBlendMode: 'overlay'}} />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 48%, rgba(0,0,0,0) 52%, rgba(20,6,14,0.55) 100%)'}} />
      {dip > 0 ? <AbsoluteFill style={{background: '#120810', opacity: dip * 0.85}} /> : null}
    </AbsoluteFill>
  );
};

const Captions: React.FC<{size: number; D: Data}> = ({size, D}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const end = D.scenes[D.scenes.length - 1];
  if (t >= end.start) return null;
  const p = D.pages.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!p) return null;
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', gap: `0 ${size * 0.26}px`, maxWidth: size * 13, fontFamily: 'Fredoka', fontWeight: 700, lineHeight: 1.12, textAlign: 'center'}}>
      {p.words.map((w, i) => {
        const s = spring({frame: frame - Math.round((w.start - 0.04) * fps), fps, config: {damping: 13, stiffness: 240}});
        const on = t >= w.start - 0.04;
        const col = w.key ? (p.tempter ? '#FF6A55' : '#FFDD33') : p.tempter ? '#E9D9F2' : '#fff';
        return (
          <span key={i} style={{fontSize: size * (w.key ? 1.42 : 1), color: col, opacity: on ? 1 : 0, transform: `scale(${0.6 + 0.4 * s}) rotate(${w.key ? -2 : 0}deg)`, display: 'inline-block', margin: w.key ? `0 ${size * 0.12}px` : 0, WebkitTextStroke: `${size * 0.2}px #1c0d16`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.08}px 0 #1c0d16, 0 ${size * 0.14}px ${size * 0.3}px rgba(0,0,0,0.45)`, fontStyle: p.tempter ? 'italic' : 'normal'}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const Title: React.FC<{W: number; H: number; D: Data; lang: Lang}> = ({W, H, D, lang}) => {
  const X = TXT[lang];
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const end = D.scenes[D.scenes.length - 1];
  const u = t - end.start;
  if (u < 0) return null;
  const wide = W > H;
  const a = (at: number) => spring({frame: Math.round((u - at) * fps), fps, config: {damping: 14, stiffness: 120}});
  const s = wide ? 0.8 : 1;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingBottom: H * (wide ? 0.2 : 0.22)}}>
      <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 54 * s, letterSpacing: 14 * s, color: '#FFDD33', opacity: a(0.15), transform: `translateY(${(1 - a(0.15)) * 30}px)`}}>{X.ep}</div>
      <div style={{fontFamily: 'Anton', fontSize: 190 * s, lineHeight: 1.02, color: '#FBEFD9', textAlign: 'center', letterSpacing: 4, opacity: a(0.5), transform: `scale(${0.9 + 0.1 * a(0.5)})`, textShadow: '0 10px 0 #1c0d16, 0 0 80px rgba(255,180,90,0.55)'}}>{X.title[0]}{wide ? ' ' : <br />}{X.title[1]}</div>
      <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 40 * s, color: '#fff', opacity: 0.85 * a(0.9), marginTop: 18 * s, letterSpacing: 3}}>{X.ref}</div>
      <div style={{marginTop: 70 * s, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 56 * s, color: '#1c0d16', background: '#FFDD33', padding: `${14 * s}px ${44 * s}px`, borderRadius: 60, border: '6px solid #1c0d16', opacity: a(2.0), transform: `scale(${a(2.0)})`}}>{X.follow}</div>
    </AbsoluteFill>
  );
};

const Sound: React.FC<{bed: number; lang: Lang}> = ({bed, lang}) => (
  <>
    <Audio src={staticFile(TXT[lang].voice)} />
    <Audio src={staticFile(TXT[lang].bed)} volume={bed} />
  </>
);

type Props = {bed: number; lang?: Lang};
/** TikTok / Shorts / Reels 9:16 */
export const WildernessTall: React.FC<Props> = ({bed, lang = 'en'}) => {
  const D = DATA[lang];
  return (
  <AbsoluteFill style={{background: '#000'}}>
    <World W={1080} H={1920} D={D} />
    <div style={{position: 'absolute', left: 60, right: 60, top: 300, height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Captions size={76} D={D} /></div>
    <Title W={1080} H={1920} D={D} lang={lang} />
    <Sound bed={bed} lang={lang} />
  </AbsoluteFill>
  );
};
/** YouTube 16:9 */
export const WildernessWide: React.FC<Props> = ({bed, lang = 'en'}) => {
  const D = DATA[lang];
  return (
  <AbsoluteFill style={{background: '#000'}}>
    <World W={1920} H={1080} D={D} />
    <div style={{position: 'absolute', left: 200, right: 200, top: 60, height: 190, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Captions size={70} D={D} /></div>
    <Title W={1920} H={1080} D={D} lang={lang} />
    <Sound bed={bed} lang={lang} />
  </AbsoluteFill>
  );
};
