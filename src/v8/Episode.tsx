import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Defs, SP} from './scenes';

/** Shared player for the Jesus series: scene switcher, film look, kinetic captions, title card, sound. */
if (typeof document !== 'undefined') {
  for (const [fam, file, wt] of [['Fredoka', 'Fredoka-700.woff2', '700'], ['Anton', 'Anton-400.woff2', '400'], ['JetBrains Mono', 'JetBrainsMono.woff2', '100 900']] as const) {
    const h = delayRender('font ' + fam);
    new FontFace(fam, `url(${staticFile('fonts/' + file)}) format('woff2')`, {weight: wt})
      .load()
      .then((f) => { document.fonts.add(f); continueRender(h); })
      .catch(() => continueRender(h));
  }
}

export type Sc = {id: string; start: number; end: number; segs: number[]; w: Record<string, number>; ws?: [string, number][]};
export type Pg = {start: number; end: number; tempter: boolean; god?: boolean; words: {text: string; start: number; key: boolean}[]};
export type Data = {duration: number; scenes: Sc[]; pages: Pg[]; lines?: {start: number; end: number; text: string; tempter: boolean}[]};
export type Text = {ep: string; title: [string, string]; ref: string; follow: string; voice: string; bed: string};
type Ep = {D: Data; scenes: Record<string, React.FC<SP>>; X: Text; film?: boolean; room?: boolean};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const World: React.FC<Ep & {W: number; H: number}> = ({W, H, D, scenes, film, room}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = Math.max(0, D.scenes.findIndex((s) => t >= s.start && t < s.end));
  const sc = D.scenes[i];
  const local = t - sc.start;
  const S = scenes[sc.id];
  const dip = i > 0 ? 1 - interpolate(local, [0, 0.16], [0, 1], cl) : 0;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Defs />
        <S t={local} dur={sc.end - sc.start} w={(word, fb = 0) => sc.w[word] ?? fb} segs={sc.segs} ws={sc.ws} wide={W > H} W={W} H={H} />
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 7} /><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.55 0" /></filter>
        <rect width={W} height={H} filter="url(#grain)" opacity={film ? 0.3 : room ? 0.2 : 0.16} style={{mixBlendMode: 'overlay'}} />
      </svg>
      {film ? <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(70,40,140,0.35) 0%, rgba(0,0,0,0) 45%, rgba(255,120,40,0.18) 100%)', mixBlendMode: 'soft-light'}} /> : null}
      {film ? <AbsoluteFill style={{background: `rgba(255,220,180,${0.025 + 0.02 * Math.sin(frame * 1.7)})`}} /> : null}
      <AbsoluteFill style={{background: film || room ? 'radial-gradient(ellipse 80% 70% at 50% 46%, rgba(0,0,0,0) 45%, rgba(10,4,16,0.75) 100%)' : 'radial-gradient(ellipse 85% 75% at 50% 48%, rgba(0,0,0,0) 52%, rgba(20,6,14,0.55) 100%)'}} />
      {dip > 0 ? <AbsoluteFill style={{background: '#120810', opacity: dip * 0.85}} /> : null}
    </AbsoluteFill>
  );
};

const Captions: React.FC<{size: number; D: Data; plain?: boolean}> = ({size, D, plain}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const end = D.scenes[D.scenes.length - 1];
  if (t >= end.start) return null;
  if (plain && D.scenes.some((sc) => sc.id === 'names' && t >= sc.start && t < sc.end)) return null; // the name cards are the captions there
  const p = D.pages.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!p) return null;
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', gap: `0 ${size * 0.26}px`, maxWidth: size * 13, fontFamily: 'Fredoka', fontWeight: 700, lineHeight: 1.12, textAlign: 'center'}}>
      {p.words.map((w, i) => {
        const s = spring({frame: frame - Math.round((w.start - 0.04) * fps), fps, config: {damping: 13, stiffness: 240}});
        const on = t >= w.start - 0.04;
        if (plain) return <span key={i} style={{fontSize: size, color: w.key ? '#FFDD33' : '#fff', opacity: on ? 1 : 0, transform: `scale(${0.75 + 0.25 * s})`, display: 'inline-block', fontFamily: 'Fredoka', WebkitTextStroke: `${size * 0.16}px #0a0608`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.06}px ${size * 0.2}px rgba(0,0,0,0.6)`}}>{w.key ? w.text.toUpperCase() : w.text}</span>;
        const col = p.god ? (w.key ? '#FFD24A' : '#FFF6D8') : w.key ? (p.tempter ? '#FF6A55' : '#FFDD33') : p.tempter ? '#E9D9F2' : '#fff';
        const glow = p.god ? `, 0 0 ${size * 0.5}px rgba(255,214,110,0.95), 0 0 ${size * 1.1}px rgba(255,200,90,0.6)` : '';
        return (
          <span key={i} style={{fontSize: size * (w.key ? 1.42 : 1), color: col, opacity: on ? 1 : 0, transform: `scale(${0.6 + 0.4 * s}) rotate(${w.key ? -2 : 0}deg)`, display: 'inline-block', margin: w.key ? `0 ${size * 0.12}px` : 0, WebkitTextStroke: `${size * 0.2}px #1c0d16`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.08}px 0 #1c0d16, 0 ${size * 0.14}px ${size * 0.3}px rgba(0,0,0,0.45)${glow}`, fontStyle: p.tempter ? 'italic' : 'normal'}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/** film-style subtitles: whole line, fade in/out, bottom of frame (like the 80s-anime reference) */
const FilmSubs: React.FC<{D: Data; size: number}> = ({D, size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const end = D.scenes[D.scenes.length - 1];
  if (t >= end.start || !D.lines) return null;
  const l = D.lines.find((x) => t >= x.start - 0.05 && t < x.end + 0.35);
  if (!l) return null;
  const o = interpolate(t, [l.start - 0.05, l.start + 0.15, l.end + 0.15, l.end + 0.35], [0, 1, 1, 0], cl);
  return (
    <div style={{opacity: o, maxWidth: size * 17, textAlign: 'center', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: size, lineHeight: 1.3, color: l.tempter ? '#FFB0A0' : '#FFFFFF', letterSpacing: 1, WebkitTextStroke: `${size * 0.16}px #0a0610`, paintOrder: 'stroke fill', textShadow: '0 3px 10px rgba(0,0,0,0.8)'}}>
      {l.text}
    </div>
  );
};

const Title: React.FC<{W: number; H: number; D: Data; X: Text}> = ({W, H, D, X}) => {
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

/** TikTok / Shorts / Reels 9:16 */
export const EpisodeTall: React.FC<Ep & {bed: number}> = (p) => (
  <AbsoluteFill style={{background: '#000'}}>
    <World {...p} W={1080} H={1920} />
    {p.room
      ? <div style={{position: 'absolute', left: 80, right: 80, top: 1250, height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Captions size={72} D={p.D} plain /></div>
      : p.film
      ? <div style={{position: 'absolute', left: 70, right: 70, top: 1290, height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><FilmSubs size={46} D={p.D} /></div>
      : <div style={{position: 'absolute', left: 60, right: 60, top: 300, height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Captions size={76} D={p.D} /></div>}
    <Title W={1080} H={1920} D={p.D} X={p.X} />
    <Audio src={staticFile(p.X.voice)} />
    <Audio src={staticFile(p.X.bed)} volume={p.bed} />
  </AbsoluteFill>
);
/** YouTube 16:9 */
export const EpisodeWide: React.FC<Ep & {bed: number}> = (p) => (
  <AbsoluteFill style={{background: '#000'}}>
    <World {...p} W={1920} H={1080} />
    <div style={{position: 'absolute', left: 200, right: 200, top: 60, height: 190, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Captions size={70} D={p.D} /></div>
    <Title W={1920} H={1080} D={p.D} X={p.X} />
    <Audio src={staticFile(p.X.voice)} />
    <Audio src={staticFile(p.X.bed)} volume={p.bed} />
  </AbsoluteFill>
);
