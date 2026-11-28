import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import T from './timeline.json';
import MOUTH from './mouth.json';

if (typeof document !== 'undefined') {
  const h = delayRender('g6 fonts');
  Promise.all([
    new FontFace('Anton', `url(${staticFile('fonts/Anton-400.woff2')}) format('woff2')`, {weight: '400'}).load(),
    new FontFace('Inter Tight', `url(${staticFile('fonts/InterTight-Variable.woff2')}) format('woff2')`, {weight: '100 900'}).load(),
  ]).then((l) => { l.forEach((f) => document.fonts.add(f)); continueRender(h); }).catch(() => continueRender(h));
}

const FPS = 30;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type Shot = {clip: string; src: number; dur: number; fx?: string; mute?: boolean};
const SHOTS = T.shots as Shot[];
const START: number[] = [];
SHOTS.reduce((t, s) => { START.push(t); return t + s.dur; }, 0);
export const GTA_DUR = SHOTS.reduce((t, s) => t + s.dur, 0);
const sp = (t: number, at: number, damping = 13) => spring({frame: Math.round((t - at) * FPS), fps: FPS, config: {damping, stiffness: 220}});
const UI = 'Anton, "Inter Tight", sans-serif';
const shadow = '0 3px 10px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.6)';

/* ── game-style button glyphs (original drawings) ── */
const Btn: React.FC<{k: 'square' | 'circle' | 'lt' | 'tri' | 'x'; size: number; fill?: string; ring?: string}> = ({k, size, fill = 'none', ring = '#fff'}) => {
  const s = size, sw = s * 0.09;
  if (k === 'lt')
    return (
      <svg width={s * 1.05} height={s} viewBox="0 0 105 100">
        <path d="M10 22 Q10 8 26 8 L80 8 Q96 8 96 24 L96 84 Q96 92 88 92 L18 92 Q10 92 10 84 Z" fill="none" stroke={ring} strokeWidth={9} />
        <text x="53" y="70" textAnchor="middle" fontFamily="Anton" fontSize="50" fill={ring}>LT</text>
      </svg>
    );
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill={fill} stroke={ring} strokeWidth={(sw / s) * 100} />
      {k === 'square' ? <rect x="31" y="31" width="38" height="38" rx="4" fill="none" stroke={ring} strokeWidth={8} /> : null}
      {k === 'circle' ? <circle cx="50" cy="50" r="20" fill="none" stroke={ring} strokeWidth={8} /> : null}
      {k === 'tri' ? <path d="M50 28 L72 66 L28 66 Z" fill="none" stroke={ring} strokeWidth={7} strokeLinejoin="round" /> : null}
      {k === 'x' ? <path d="M33 33 L67 67 M67 33 L33 67" stroke={ring} strokeWidth={8} strokeLinecap="round" /> : null}
    </svg>
  );
};

const Title: React.FC<{lt: number}> = ({lt}) => (
  <div style={{position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: '#fff', borderRadius: 22, padding: '14px 30px', fontFamily: '"Inter Tight"', fontWeight: 600, fontSize: 62, lineHeight: 1.12, color: '#111', textAlign: 'center', boxShadow: '0 4px 18px rgba(0,0,0,0.25)', transform: `scale(${0.9 + 0.1 * sp(lt, 0, 16)})`}}>
      How life feels after<br />Playing GTA VI
    </div>
  </div>
);

const PourPrompt: React.FC<{lt: number}> = ({lt}) => {
  const p = sp(lt, 0.15, 15);
  return (
    <div style={{position: 'absolute', top: 640, left: 70, display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `translateX(${(1 - p) * -30}px)`, filter: `drop-shadow(${shadow})`}}>
      <Btn k="tri" size={66} />
      <svg width={66} height={66} viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#7CFF6B" strokeWidth={8} /><path d="M56 20 L34 55 L50 55 L44 82 L68 44 L52 44 Z" fill="#7CFF6B" /></svg>
      <svg width={66} height={66} viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#C77DFF" strokeWidth={8} /><circle cx="50" cy="50" r="22" fill="none" stroke="#C77DFF" strokeWidth={8} /></svg>
      <div style={{fontFamily: UI, fontSize: 64, color: '#fff', letterSpacing: 1, marginLeft: 6, textShadow: shadow}}>POUR COFFEE</div>
    </div>
  );
};

const ITEMS: {label: string; k: 'square' | 'circle' | 'lt'}[] = [{label: 'GREET', k: 'square'}, {label: 'TAUNT', k: 'circle'}, {label: 'LOCAL', k: 'lt'}];
const Menu: React.FC<{lt: number; size: number; x: number; y: number; sel?: number; appear?: number}> = ({lt, size, x, y, sel = -1, appear = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'flex', flexDirection: 'column', gap: size * 0.22}}>
    {ITEMS.map((it, i) => {
      const p = sp(lt, appear + i * 0.06, 14);
      const on = i === 1 && sel >= 0 && lt >= sel;
      const flash = on ? sp(lt, sel, 9) : 0;
      return (
        <div key={it.label} style={{display: 'flex', alignItems: 'center', gap: size * 0.25, padding: `${size * 0.06}px ${size * 0.22}px ${size * 0.06}px ${size * 0.28}px`, borderRadius: size,
          background: on ? 'rgba(245,245,235,0.95)' : 'rgba(20,20,24,0.35)', opacity: p, transform: `translateX(${(1 - p) * -20}px) scale(${1 + (on ? 0.06 * flash : 0)})`, transformOrigin: 'left center', filter: `drop-shadow(${shadow})`}}>
          <div style={{fontFamily: UI, fontSize: size, lineHeight: 1.1, color: on ? '#111' : '#fff', letterSpacing: 1, minWidth: size * 2.6}}>{it.label}</div>
          <Btn k={it.k} size={size * 0.95} ring={on ? '#c8e600' : '#fff'} fill={on ? 'rgba(200,230,0,0.25)' : 'none'} />
        </div>
      );
    })}
  </div>
);

const Sub: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', top: 1400, left: 80, right: 160, textAlign: 'center', fontFamily: '"Inter Tight"', fontWeight: 500, fontSize: 56, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 2px #000'}}>{text}</div>
);

/** black bar over the mouth while the curse is bleeped */
const MouthCover: React.FC<{srcT: number}> = ({srcT}) => {
  const c = T.curse;
  if (srcT < c.src0 - 0.08 || srcT > c.src1 + 0.08) return null;
  const m = (MOUTH as number[][]).reduce((b, r) => (Math.abs(r[0] - srcT) < Math.abs(b[0] - srcT) && r.length > 1 ? r : b), MOUTH[0] as number[]);
  if (m.length < 5) return null;
  const [, x1, x2, y1, y2] = m;
  const cx = ((x1 + x2) / 2) * 1080, cy = ((y1 + y2) / 2) * 1920, w = (x2 - x1) * 1080 * 1.9, h = Math.max((y2 - y1) * 1920 * 2.0, w * 0.42);
  return <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, background: '#000', borderRadius: 8, transform: 'rotate(-4deg)', boxShadow: '0 0 0 3px rgba(255,255,255,0.15)'}} />;
};

const ShotView: React.FC<{s: Shot; i: number}> = ({s, i}) => {
  const lt = useCurrentFrame() / FPS;
  const push = s.fx === 'menuBig' ? interpolate(lt, [0, 0.35], [1.25, 1.05], {...cl, easing: Easing.out(Easing.cubic)}) + lt * 0.01 : 1 + lt * 0.012;
  const subs = T.subs.filter((x) => x.shot === i && lt >= x.from && lt < x.to);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <OffthreadVideo src={staticFile(`g6/${s.clip}.mp4`)} startFrom={Math.round(s.src * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        {s.fx === 'curse' ? <MouthCover srcT={s.src + lt} /> : null}
      </AbsoluteFill>
      {s.fx === 'title' ? <Title lt={lt} /> : null}
      {s.fx === 'pour' ? <PourPrompt lt={lt} /> : null}
      {s.fx === 'menuSmall' ? <Menu lt={lt} size={40} x={640} y={1050} appear={0.35} /> : null}
      {s.fx === 'menuBig' ? <Menu lt={lt} size={100} x={70} y={620} appear={0.0} sel={1.65} /> : null}
      {subs.map((x) => <Sub key={x.text} text={x.text} />)}
    </AbsoluteFill>
  );
};

const at = (shot: number, off: number) => Math.round((START[shot] + off) * FPS);
const SFX: {f: number; src: string; v: number}[] = [
  {f: at(1, 0.15), src: 'ui_blip', v: 0.4},
  {f: at(4, 0.33), src: 'click', v: 0.45},
  {f: at(5, 0.0) - 3, src: 'whoosh_short_a', v: 0.35},
  {f: at(5, 0.02), src: 'ui_blip', v: 0.35},
  {f: at(5, 1.65), src: 'snap_glassy', v: 0.5},
  {f: at(5, 1.65), src: 'click', v: 0.5},
  {f: at(7, T.curse.src0 - SHOTS[7].src), src: 'beep', v: 0.55},
];

export const GtaChoice: React.FC<{music: number}> = ({music}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={Math.round(START[i] * FPS)} durationInFrames={Math.round(s.dur * FPS)}>
          <ShotView s={s} i={i} />
        </Sequence>
      ))}
      <Audio src={staticFile('g6/voice.wav')} />
      <Audio src={staticFile('music/hitman.mp3')} volume={() => music * interpolate(t, [0, 0.3, GTA_DUR - 0.6, GTA_DUR], [0.6, 1, 1, 0.2], cl) * (t > START[5] + 1.6 && t < START[7] + 1.0 ? 0.55 : 1)} />
      {SFX.map((x, i) => (
        <Sequence key={i} from={Math.max(0, x.f)} layout="none"><Audio src={staticFile(`sfx/${x.src}.mp3`)} volume={x.v} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
