import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {STRAP, Studio, Watch} from './Watch3D';
import data from './data.json';

if (typeof document !== 'undefined') {
  const h = delayRender('op fonts');
  Promise.all([
    new FontFace('Inter Tight', `url(${staticFile('fonts/InterTight-Variable.woff2')}) format('woff2')`, {weight: '100 900'}).load(),
  ]).then((l) => { l.forEach((f) => document.fonts.add(f)); continueRender(h); }).catch(() => continueRender(h));
}

type Seg = {clip: string; take: number; src: number; out: number; dur: number};
type Wd = {w: string; take: number; s: number; e: number};
type Pg = {s: number; e: number; words: {w: string; s: number}[]};
const D = data as unknown as {voiceDur: number; segs: Seg[]; words: Wd[]; pages: Pg[]};
const END = 3.4;
export const OPPO_DUR = D.voiceDur + END;
const FPS = 30;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ORANGE = '#FF8A1F';
const FONT = '"Inter Tight", sans-serif';
const eio = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {...cl, easing: Easing.bezier(0.65, 0, 0.35, 1)});
const eout = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
const sp = (t: number, at: number, damping = 14) => spring({frame: Math.round((t - at) * FPS), fps: FPS, config: {damping, stiffness: 170}});
/** time of the n-th occurrence of a word (case/punct-insensitive) */
const at = (w: string, n = 0) => {
  const k = w.toLowerCase();
  const hits = D.words.filter((x) => x.w.toLowerCase().replace(/[^a-z0-9.]/g, '').replace(/\.$/, '') === k);
  return (hits[n] ?? hits[0])?.s ?? 0;
};
const FACE: Record<string, [number, number]> = {'27e47e4e': [0.464, 0.455], '31c6f753': [0.385, 0.404], '870eaf7c': [0.431, 0.426], '994d26dd': [0.598, 0.397], 'a8bbac80': [0.44, 0.428]};

/* ───────────── base: talking-head jump cuts with alternating punch-in ───────────── */
const PULSES = () => ['oppo', 'honestly', 'super', 'thin', 'watch', 'perfect', 'try'].flatMap((w) => D.words.filter((x) => x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w).map((x) => x.s));
const Talking: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const pulses = PULSES();
  // punch in on emphasis words, ease back out
  const punch = pulses.reduce((acc, p) => acc + (t >= p - 0.05 ? 0.14 * sp(t, p - 0.05, 12) * Math.exp(-Math.max(0, t - p - 0.35) * 2.2) : 0), 0);
  return (
    <>
      {D.segs.map((s, i) => {
        const [fx, fy] = FACE[s.clip];
        const z0 = i % 2 ? 1.2 : 1.1; // >=1.08 also crops the corner of the source clips
        const lt = t - s.out;
        const breathe = 0.05 * Math.sin((lt / Math.max(1.5, s.dur)) * Math.PI); // slow zoom in then out
        const drift = Math.sin(lt * 0.9 + i) * 10;
        return (
          <Sequence key={i} from={Math.round(s.out * FPS)} durationInFrames={Math.round(s.dur * FPS) + 1}>
            <AbsoluteFill style={{transform: `translateX(${drift}px) scale(${z0 + breathe + punch})`, transformOrigin: `${fx * 100}% ${fy * 100}%`}}>
              <OffthreadVideo src={staticFile(`op/${s.clip}.mp4`)} startFrom={Math.round(s.src * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};

/* ───────────── cutaway wrapper: premium zoom-blur in / out ───────────── */
const CutInner: React.FC<{d: number; children: (t: number, d: number) => React.ReactNode; flash?: boolean}> = ({d, children, flash}) => {
  const lt = useCurrentFrame() / FPS;
  const inP = eout(lt, 0, 0.28), outP = eio(lt, d - 0.2, d);
  const sc = interpolate(inP, [0, 1], [1.12, 1]) * interpolate(outP, [0, 1], [1, 1.06]);
  const blur = (1 - inP) * 14 + outP * 10;
  return (
    <AbsoluteFill style={{opacity: Math.min(inP * 1.6, 1 - outP), transform: `scale(${sc})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>
      {children(lt, d)}
      {flash && lt < 0.25 ? <AbsoluteFill style={{background: '#fff', opacity: 0.55 * (1 - lt / 0.25)}} /> : null}
    </AbsoluteFill>
  );
};
const Cut: React.FC<{from: number; to: number; children: (t: number, d: number) => React.ReactNode; flash?: boolean}> = ({from, to, children, flash}) => (
  <Sequence from={Math.round(from * FPS)} durationInFrames={Math.max(1, Math.round((to - from) * FPS))}>
    <CutInner d={to - from} flash={flash}>{children}</CutInner>
  </Sequence>
);
const Broll: React.FC<{src: string; start: number; lt: number; zoom?: number}> = ({src, start, lt, zoom = 1.08}) => (
  <AbsoluteFill style={{transform: `scale(${zoom + lt * 0.02})`}}>
    <OffthreadVideo src={staticFile(`op/${src}.mp4`)} startFrom={Math.round(start * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
  </AbsoluteFill>
);
const BrollText: React.FC<{src: string; start: number; lt: number; d: number; kicker?: string; text: string; hi?: string; zoom?: number}> = ({src, start, lt, d, kicker, text, hi, zoom}) => (
  <AbsoluteFill>
    <Broll src={src} start={start} lt={lt} zoom={zoom} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.45) 100%)'}} />
    <Title lt={lt} at0={0.12} kicker={kicker} big={text} hi={hi} y={190} size={92} out={d - 0.05} />
  </AbsoluteFill>
);
const DarkBG: React.FC<{lt: number; tint?: string}> = ({lt, tint = 'rgba(255,120,30,0.28)'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 55% at 50% ${42 + Math.sin(lt * 1.5) * 3}%, ${tint} 0%, rgba(20,10,6,0) 70%), linear-gradient(180deg,#120b08,#050505)`}} />
);
/** kinetic typography: each word rises in with blur + overshoot, keeps floating, leaves upward */
const KWords: React.FC<{text: string; lt: number; at0: number; out?: number; size: number; color?: string; hi?: string; weight?: number; stagger?: number}> = ({text, lt, at0, out = 1e9, size, color = '#fff', hi, weight = 850, stagger = 0.07}) => (
  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.26, perspective: 800}}>
    {text.split(' ').map((w, i) => {
      const p = sp(lt, at0 + i * stagger, 11);
      const o = eio(lt, out - 0.25 + i * 0.03, out + i * 0.03);
      const isHi = hi && w.replace(/[^\w.]/g, '').toLowerCase() === hi.toLowerCase();
      return (
        <span key={i} style={{display: 'inline-block', fontSize: size, fontWeight: weight, letterSpacing: -size * 0.02, lineHeight: 1.05, color: isHi ? ORANGE : color,
          opacity: Math.min(1, p * 1.4) * (1 - o),
          transform: `translateY(${(1 - p) * size * 0.9 - o * size * 0.6 + Math.sin(lt * 2.2 + i) * 3}px) rotateX(${(1 - p) * 70}deg) scale(${0.7 + 0.3 * p + (isHi ? 0.05 * Math.sin(lt * 5) : 0)})`,
          filter: p < 0.98 || o > 0.02 ? `blur(${(1 - Math.min(1, p)) * 10 + o * 8}px)` : undefined,
          textShadow: isHi ? '0 0 28px rgba(255,138,31,0.65)' : '0 6px 30px rgba(0,0,0,0.5)'}}>{w}</span>
      );
    })}
  </div>
);
const Title: React.FC<{lt: number; at0?: number; kicker?: string; big: string; y?: number; color?: string; size?: number; hi?: string; out?: number}> = ({lt, at0 = 0.1, kicker, big, y = 230, color = '#fff', size = 108, hi, out}) => {
  const kp = eout(lt, at0, at0 + 0.35);
  return (
    <div style={{position: 'absolute', top: y, left: 60, right: 140, textAlign: 'center', fontFamily: FONT}}>
      {kicker ? <div style={{fontSize: 38, fontWeight: 700, letterSpacing: interpolate(kp, [0, 1], [24, 8]), color: ORANGE, textTransform: 'uppercase', marginBottom: 10, opacity: kp * (out ? 1 - eio(lt, out - 0.25, out) : 1)}}>{kicker}</div> : null}
      <KWords text={big} lt={lt} at0={at0 + 0.08} out={out} size={size} color={color} hi={hi} />
    </div>
  );
};
const Watch3D: React.FC<{children: React.ReactNode}> = ({children}) => (
  <ThreeCanvas width={1080} height={1920} camera={{fov: 30, position: [0, 0, 6]}} gl={{antialias: true, preserveDrawingBuffer: true, toneMapping: 4 as never}}>
    <Studio />
    {children}
  </ThreeCanvas>
);

/* ───────────── motion-graphic scenes ───────────── */
const UltraBurnCard: React.FC<{lt: number}> = ({lt}) => {
  const pulse = 1 + Math.max(0, Math.sin(lt * 7)) * 0.05;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={staticFile('op/img/heart.png')} style={{position: 'absolute', left: 40, top: 330, width: 1000, opacity: eout(lt, 0, 0.5) * 0.95, transform: `scale(${pulse * interpolate(lt, [0, 2.2], [0.9, 1.08])})`, filter: 'blur(6px)'}} />
      <Img src={staticFile('op/img/fatmax.png')} style={{position: 'absolute', left: 290, top: 700, width: 500, opacity: eout(lt, 0.15, 0.5), transform: `translateY(${(1 - eout(lt, 0.15, 0.5)) * 30}px)`}} />
      <div style={{position: 'absolute', top: 880, width: 1080, textAlign: 'center', fontFamily: FONT}}>
        <div style={{fontSize: 46, color: '#fff', fontWeight: 500, letterSpacing: 6, opacity: eout(lt, 0.3, 0.6)}}>OPPO INDUSTRY FIRST</div>
        <div style={{fontSize: 132, fontWeight: 850, letterSpacing: -3, marginTop: 6, background: 'linear-gradient(90deg,#ffd08a,#ff8a1f)', WebkitBackgroundClip: 'text', color: 'transparent', transform: `scale(${0.85 + 0.15 * sp(lt, 0.35)})`, opacity: sp(lt, 0.35)}}>UltraBurn Mode</div>
      </div>
    </AbsoluteFill>
  );
};

const PhoneFloat: React.FC<{lt: number}> = ({lt}) => {
  const p = sp(lt, 0.05, 16);
  const pill = sp(lt, 0.7, 11);
  const hr = Math.round(interpolate(lt, [0.7, 2.6], [124, 131], cl));
  return (
    <AbsoluteFill>
      <DarkBG lt={lt} />
      <div style={{position: 'absolute', left: 250, top: 160, width: 580, height: 1110, borderRadius: 80, background: '#0b0b0d', boxShadow: '0 0 0 10px #2a2a30, 0 40px 120px rgba(0,0,0,0.7), 0 0 120px rgba(255,138,31,0.25)', overflow: 'hidden', transform: `translateY(${(1 - p) * 300}px) rotate(${(1 - p) * -6}deg)`}}>
        <OffthreadVideo src={staticFile('op/22abf2a2.mp4')} startFrom={30} muted style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', transformOrigin: '40% 40%'}} />
        <div style={{position: 'absolute', top: 22, left: 210, width: 160, height: 40, borderRadius: 20, background: '#000'}} />
        {/* floating heart-rate bubble over the phone screen */}
        <div style={{position: 'absolute', top: 110, left: 40, right: 40, height: 150, borderRadius: 75, background: 'linear-gradient(90deg, rgba(60,22,6,0.88), rgba(120,50,10,0.82))', border: '2px solid rgba(255,170,90,0.7)', boxShadow: '0 10px 40px rgba(255,120,20,0.45)', display: 'flex', alignItems: 'center', gap: 22, padding: '0 34px', fontFamily: FONT, color: '#fff', transform: `translateY(${(1 - pill) * -60 + Math.sin(lt * 2.4) * 6}px) scale(${0.6 + 0.4 * pill})`, opacity: pill}}>
          <div style={{fontSize: 70, color: '#ff4b5c', transform: `scale(${1 + Math.max(0, Math.sin(lt * 8)) * 0.15})`}}>♥</div>
          <div>
            <div style={{fontSize: 68, fontWeight: 850, lineHeight: 1}}>{hr} <span style={{fontSize: 30, fontWeight: 600}}>BPM</span></div>
            <div style={{fontSize: 26, fontWeight: 700, color: '#ffc27a', letterSpacing: 2}}>FATMAX · 115–136</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ZoneScene: React.FC<{lt: number; d: number}> = ({lt, d}) => {
  const mix = eio(lt, 1.0, 1.6);
  const marker = interpolate(lt, [0.4, 1.3, 2.2, d], [0.12, 0.55, 0.48, 0.52], cl);
  return (
    <AbsoluteFill>
      <DarkBG lt={lt} />
      <Watch3D>
        <Watch screen="op/img/scr_below.png" screen2="op/img/scr_fatmax.png" mix={mix} rot={[0.15 - lt * 0.02, -0.55 + eio(lt, 0, 1.4) * 0.5, 0.05]} pos={[0, 0.38, 0]} scale={1.0} glow={mix} />
      </Watch3D>
      <Title lt={lt} kicker="Your personal" big="Fat-Burn Zone" hi="Zone" y={110} size={96} />
      <div style={{position: 'absolute', top: 1150, left: 140, width: 800, height: 26, borderRadius: 13, background: 'linear-gradient(90deg,#3d6bff,#2fd47a 35%,#ffb02e 50%,#ff6a1f 70%,#ff2f4b)', opacity: eout(lt, 0.3, 0.6)}} />
      <div style={{position: 'absolute', top: 1116, left: 140 + 800 * 0.42, width: 800 * 0.16, height: 94, borderRadius: 18, border: '4px solid #fff', boxShadow: '0 0 30px rgba(255,160,60,0.9)', opacity: eout(lt, 0.5, 0.8)}} />
      <div style={{position: 'absolute', top: 1068, left: 140 + 800 * marker - 22, fontSize: 40, color: '#fff', transition: 'none'}}>▼</div>
      <div style={{position: 'absolute', top: 1222, left: 0, width: 1080, textAlign: 'center', fontFamily: FONT, fontSize: 40, fontWeight: 700, color: mix > 0.5 ? '#ffc27a' : '#9aa', letterSpacing: 2}}>{mix > 0.5 ? '✓ IN THE ZONE · 115–136 BPM' : 'BELOW TARGET · SPEED UP'}</div>
    </AbsoluteFill>
  );
};

const ModesGrid: React.FC<{lt: number}> = ({lt}) => {
  const n = Math.round(interpolate(lt, [0.1, 1.2], [0, 35], {...cl, easing: Easing.out(Easing.cubic)}));
  const names = ['Outdoor run', 'Indoor run', 'Track run', 'Walking', 'Treadmill', 'Cycling', 'Rope skip', 'Elliptical', 'Rowing', 'Aerobics', 'Swimming'];
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1a0f08,#060606)'}}>
      <div style={{position: 'absolute', top: 120, left: 60, right: 60, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18}}>
        {cells.map((i) => {
          const p = sp(lt, 0.05 + i * 0.06, 15);
          return i === 4 ? (
            <div key={i} style={{height: 252, borderRadius: 34, background: 'linear-gradient(135deg,#ffb35c,#ff6a1f)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: '#1a0a00', transform: `scale(${0.6 + 0.4 * sp(lt, 0.1)})`, boxShadow: '0 0 60px rgba(255,138,31,0.6)'}}>
              <div style={{fontSize: 130, fontWeight: 900, lineHeight: 0.9}}>{n}</div>
              <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 2}}>CARDIO MODES</div>
            </div>
          ) : (
            <div key={i} style={{height: 252, borderRadius: 34, overflow: 'hidden', position: 'relative', transform: `scale(${0.7 + 0.3 * p})`, opacity: p}}>
              <Img src={staticFile(`op/img/sp${(i > 4 ? i - 1 : i) + 1}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.1 - lt * 0.03})`}} />
              <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 14px 12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.75))', fontFamily: FONT, fontSize: 28, fontWeight: 700, color: '#fff'}}>{names[i > 4 ? i - 1 : i]}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FatGrams: React.FC<{lt: number}> = ({lt}) => {
  const g = interpolate(lt, [0.9, 2.4], [0, 10.5], {...cl, easing: Easing.out(Easing.cubic)});
  const app = sp(lt, 1.4, 16);
  return (
    <AbsoluteFill>
      <DarkBG lt={lt} />
      <Watch3D>
        <Watch screen="op/img/scr_fat.png" rot={[0.1, -1.2 + eio(lt, 0, 1.2) * 1.45, -0.05]} pos={[-0.5, 0.75, 0]} scale={0.95} />
      </Watch3D>
      <Img src={staticFile('op/img/app_fat.png')} style={{position: 'absolute', left: 610, top: 260, width: 390, borderRadius: 34, boxShadow: '0 30px 80px rgba(0,0,0,0.6)', transform: `translateX(${(1 - app) * 500}px) rotate(${(1 - app) * 8 + 3}deg)`}} />
      <div style={{position: 'absolute', top: 900, left: 0, width: 1080, textAlign: 'center', fontFamily: FONT, color: '#fff'}}>
        <div style={{fontSize: 210, fontWeight: 900, letterSpacing: -6, lineHeight: 1, color: ORANGE, textShadow: '0 0 50px rgba(255,138,31,0.5)'}}>{g.toFixed(1)}<span style={{fontSize: 110}}>g</span></div>
        <div style={{fontSize: 46, fontWeight: 700, letterSpacing: 6}}>OF FAT BURNED</div>
      </div>
    </AbsoluteFill>
  );
};

const AITrainer: React.FC<{lt: number}> = ({lt}) => (
  <AbsoluteFill>
    <DarkBG lt={lt} tint="rgba(120,140,255,0.3)" />
    <Watch3D>
      <Watch screen="op/img/scr_ai.png" rot={[0.12, 0.6 - eio(lt, 0, 1.2) * 0.75, 0.04]} pos={[0, 0.3, 0]} scale={1.0} />
    </Watch3D>
    <Title lt={lt} kicker="AI Personal Trainer" big="Push or rest?" hi="rest" y={110} size={96} />
    <div style={{position: 'absolute', top: 1150, left: 0, width: 1080, display: 'flex', justifyContent: 'center', gap: 30, fontFamily: FONT}}>
      {['💪 PUSH', '😴 REST'].map((s, i) => {
        const p = sp(lt, 0.8 + i * 0.25);
        const on = i === (lt > 2.0 ? 1 : 0);
        return <div key={s} style={{fontSize: 48, fontWeight: 800, padding: '18px 40px', borderRadius: 60, background: on ? ORANGE : 'rgba(255,255,255,0.12)', color: on ? '#160800' : '#fff', transform: `scale(${p})`}}>{s}</div>;
      })}
    </div>
  </AbsoluteFill>
);

const Slim: React.FC<{lt: number}> = ({lt}) => {
  const turn = eio(lt, 0.1, 1.1);
  const lineP = eout(lt, 1.0, 1.5);
  const PX = 597, SC = 1.2, thick = (9.2 / 37.27) * SC * PX; // 597 px per unit at this camera
  return (
    <AbsoluteFill>
      <DarkBG lt={lt} tint="rgba(200,190,255,0.25)" />
      <Watch3D>
        <Watch screen="op/img/scr_fatmax.png" rot={[0.05, -turn * (Math.PI / 2 - 0.02), 0]} pos={[-0.25, 0.17, 0]} scale={SC} />
      </Watch3D>
      {/* dimension line across the 9.2 mm edge */}
      <div style={{position: 'absolute', top: 420, left: 540 - 0.25 * PX - thick / 2, width: thick, height: 4, background: ORANGE, transform: `scaleX(${lineP})`, opacity: lineP}} />
      {[-1, 1].map((s) => <div key={s} style={{position: 'absolute', top: 400, left: 540 - 0.25 * PX + (s * thick) / 2 - 2, width: 4, height: 44, background: ORANGE, opacity: lineP}} />)}
      <div style={{position: 'absolute', top: 640, left: 560, fontFamily: FONT, opacity: lineP, transform: `translateX(${(1 - lineP) * 60}px)`}}>
        <div style={{fontSize: 190, fontWeight: 900, color: '#fff', letterSpacing: -6, lineHeight: 1}}>9.2</div>
        <div style={{fontSize: 90, fontWeight: 800, color: ORANGE, lineHeight: 1}}>mm</div>
        <div style={{fontSize: 36, fontWeight: 600, color: '#ccc', marginTop: 16, letterSpacing: 3}}>ULTRA-SLIM</div>
      </div>
      <Title lt={lt} kicker="Lift without it" big="Never in the way" hi="Never" y={150} size={90} />
    </AbsoluteFill>
  );
};

const Battery: React.FC<{lt: number}> = ({lt}) => {
  const fill = eio(lt, 0.2, 1.4);
  return (
    <AbsoluteFill>
      <DarkBG lt={lt} tint="rgba(60,220,120,0.22)" />
      <div style={{position: 'absolute', top: 420, left: 310, width: 420, height: 740, borderRadius: 70, border: '14px solid #f2f2f2', padding: 22, boxSizing: 'border-box', transform: `scale(${0.8 + 0.2 * sp(lt, 0)})`}}>
        <div style={{position: 'absolute', top: -64, left: 150, width: 132, height: 44, borderRadius: 16, background: '#f2f2f2'}} />
        <div style={{position: 'absolute', left: 22, right: 22, bottom: 22, height: `${fill * 96}%`, borderRadius: 44, background: 'linear-gradient(0deg,#16c172,#7cf0a8)', boxShadow: '0 0 60px rgba(40,220,120,0.6)'}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 120, color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.5)'}}>⚡</div>
      </div>
      <Title lt={lt} kicker="351 mAh battery" big="7–10 days" hi="7–10" y={150} size={120} />
    </AbsoluteFill>
  );
};

const Compat: React.FC<{lt: number}> = ({lt}) => (
  <AbsoluteFill>
    <DarkBG lt={lt} tint="rgba(140,200,255,0.22)" />
    <Watch3D>
      <Watch screen="op/img/scr_ub.png" rot={[0.1, Math.sin(lt * 1.2) * 0.35, 0]} pos={[0, 0.3, 0]} scale={1.0} />
    </Watch3D>
    {[['Android 10+', '#3ddc84', -1, 0.45], ['iOS 16+', '#ffffff', 1, 0.7]].map(([txt, c, side, at0]) => {
      const p = sp(lt, at0 as number, 12);
      return (
        <div key={txt as string} style={{position: 'absolute', top: side === -1 ? 380 : 1130, left: side === -1 ? 50 : undefined, right: side === 1 ? 150 : undefined, padding: '20px 40px', borderRadius: 50, background: 'rgba(20,20,24,0.8)', border: `3px solid ${c}`, boxShadow: `0 0 40px ${c}55`, fontFamily: FONT, fontSize: 56, fontWeight: 850, color: c as string,
          transform: `translateX(${(1 - p) * (side as number) * 700}px) rotate(${(1 - p) * (side as number) * 10}deg) translateY(${Math.sin(lt * 2 + (side as number)) * 8}px)`}}>{txt as string}</div>
      );
    })}
    <Title lt={lt} kicker="Works with" big="Both phones" hi="Both" y={150} size={96} />
  </AbsoluteFill>
);

const EndCard: React.FC<{lt: number}> = ({lt}) => {
  const ws = [['w_purple', 'Twinkle Purple'], ['w_green', 'Mint Green'], ['w_black', 'Cool Black']];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #f1ecff 0%, #d9d2f6 55%, #c3bdf0 100%)'}}>
      <Img src={staticFile('op/img/logo_oppo.png')} style={{position: 'absolute', left: 150, top: 170, width: 520, filter: 'drop-shadow(0 4px 12px rgba(80,60,160,0.45))', opacity: eout(lt, 0.1, 0.6)}} />
      <Img src={staticFile('op/img/logo_watch5.png')} style={{position: 'absolute', left: 380, top: 330, width: 560, filter: 'drop-shadow(0 4px 12px rgba(80,60,160,0.45))', opacity: eout(lt, 0.3, 0.8)}} />
      {ws.map(([f, n], i) => {
        const p = sp(lt, 0.2 + i * 0.15, 15);
        return (
          <div key={f} style={{position: 'absolute', top: 640 + (i === 1 ? -40 : 0), left: 40 + i * 330, width: 340, textAlign: 'center', transform: `translateY(${(1 - p) * 200}px)`, opacity: p}}>
            <Img src={staticFile(`op/img/${f}.png`)} style={{width: 420, marginLeft: -40, filter: 'drop-shadow(0 30px 40px rgba(60,40,120,0.35))'}} />
            <div style={{fontFamily: FONT, fontSize: 34, fontWeight: 700, color: '#3a2f6b'}}>{n}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 1300, width: 1080, textAlign: 'center', fontFamily: FONT, color: '#3a2f6b', opacity: eout(lt, 0.7, 1.1)}}>
        <div style={{fontSize: 44, fontWeight: 800}}>UltraBurn Mode · AI Trainer · 9.2 mm</div>
        <div style={{fontSize: 40, fontWeight: 600, marginTop: 14}}>Android & iOS · up to 10 days</div>
        <div style={{fontSize: 46, fontWeight: 900, marginTop: 30, color: ORANGE}}>#OPPOSARAWAK</div>
      </div>
    </AbsoluteFill>
  );
};

/* top-of-frame overlays (kept above the face): glass pill that slides in, words animate inside */
const TopTag: React.FC<{from: number; to: number; kicker?: string; text: string; strike?: boolean; hi?: string}> = ({from, to, kicker, text, strike, hi}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (t < from || t > to) return null;
  const lt = t - from, d = to - from;
  const p = sp(lt, 0, 13), o = eio(lt, d - 0.25, d);
  const strikeP = strike ? eout(lt, 0.7, 1.0) : 0;
  return (
    <div style={{position: 'absolute', top: 190, left: 60, right: 140, display: 'flex', justifyContent: 'center', opacity: 1 - o}}>
      <div style={{position: 'relative', padding: '22px 46px', borderRadius: 44, background: 'rgba(14,10,8,0.62)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(255,255,255,0.18)', fontFamily: FONT, textAlign: 'center', overflow: 'hidden',
        transform: `translateY(${(1 - p) * -120 - o * 60}px) scale(${0.7 + 0.3 * p}) rotate(${(1 - p) * -4}deg)`}}>
        {/* light sweep */}
        <div style={{position: 'absolute', top: 0, bottom: 0, width: 120, left: interpolate(lt, [0.3, 1.1], [-160, 900], cl), background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)', transform: 'skewX(-20deg)'}} />
        {kicker ? <div style={{fontSize: 30, fontWeight: 700, letterSpacing: interpolate(eout(lt, 0.05, 0.4), [0, 1], [18, 5]), color: ORANGE, opacity: eout(lt, 0.05, 0.4)}}>{kicker}</div> : null}
        <div style={{position: 'relative'}}>
          <KWords text={text} lt={lt} at0={0.12} size={64} hi={hi} stagger={0.08} />
          {strike ? <div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 7, borderRadius: 4, background: '#ff3b3b', transformOrigin: 'left', transform: `scaleX(${strikeP}) rotate(-3deg)`}} /> : null}
        </div>
      </div>
    </div>
  );
};

/* ───────────── captions: word-by-word, active word in OPPO orange ───────────── */
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = D.pages.find((x) => t >= x.s - 0.05 && t < x.e);
  if (!p) return null;
  const pp = sp(t, p.s - 0.05, 18);
  return (
    <div style={{position: 'absolute', top: 1330, left: 60, right: 140, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', columnGap: 20, fontFamily: FONT, fontWeight: 850, fontSize: 76, letterSpacing: -1, transform: `scale(${0.9 + 0.1 * pp})`}}>
      {p.words.map((w, i) => {
        const nx = p.words[i + 1]?.s ?? p.e;
        const active = t >= w.s - 0.03 && t < nx;
        return <span key={i} style={{color: active ? ORANGE : '#fff', opacity: t >= w.s - 0.03 ? 1 : 0.55, WebkitTextStroke: '10px rgba(0,0,0,0.85)', paintOrder: 'stroke fill', textShadow: '0 6px 18px rgba(0,0,0,0.55)', transform: active ? 'translateY(-4px)' : undefined}}>{w.w}</span>;
      })}
    </div>
  );
};

/* ───────────── timeline ───────────── */
type Ct = {a: number; b: number; el: (lt: number, d: number) => React.ReactNode; sfx?: string; flash?: boolean; txt?: boolean};
const take2 = () => D.segs.find((x) => x.take === 2)!.out;
const CUTS: Ct[] = [
  {a: at('most') - 0.1, b: at('looking') - 0.05, el: (lt, d) => <BrollText src="136c198d" start={0.5} lt={lt} d={d} kicker="Cardio at the gym" text="The most annoying part" hi="annoying" />, sfx: 'whoosh_short_a', txt: true},
  {a: at('looking') - 0.05, b: at('now') - 0.1, el: (lt, d) => <BrollText src="14b03806" start={1} lt={lt} d={d} kicker="Every. Single. Time." text="Looking down at your wrist" hi="wrist" zoom={1.14} />, sfx: 'whoosh_short_b', txt: true},
  {a: at('now') - 0.1, b: at('literally') - 0.05, el: (lt) => <UltraBurnCard lt={lt} />, sfx: 'boom', flash: true},
  {a: at('literally') - 0.05, b: at('so', 0) - 0.05, el: (lt) => <PhoneFloat lt={lt} />, sfx: 'whoosh_slide'},
  {a: at('so', 0) - 0.05, b: at('and', 1) - 0.1, el: (lt, d) => <ZoneScene lt={lt} d={d} />, sfx: 'whoosh_organic', txt: true},
  {a: at('and', 1) - 0.1, b: at('covers') - 0.25, el: (lt, d) => <BrollText src="22abf2a2" start={0.3} lt={lt} d={d} kicker="Air bike? Covered." text="Not just running" hi="running" />, sfx: 'whoosh_short_b', txt: true},
  {a: at('covers') - 0.25, b: at('plus') - 0.1, el: (lt) => <ModesGrid lt={lt} />, sfx: 'counter', flash: true},
  {a: at('plus') - 0.1, b: at('actually') - 0.1, el: (lt, d) => <BrollText src="f46e66f5" start={0.4} lt={lt} d={d} kicker="After your workout" text="No more random kcal" hi="random" zoom={1.12} />, sfx: 'whoosh_short_a', txt: true},
  {a: at('actually') - 0.1, b: at('oh') - 0.1, el: (lt) => <FatGrams lt={lt} />, sfx: 'whoosh_organic'},
  {a: at('oh') - 0.1, b: at('ai') - 0.15, el: (lt, d) => <BrollText src="7010ed08" start={0.5} lt={lt} d={d} kicker="Tomorrow?" text="Push or rest day?" hi="rest" />, sfx: 'whoosh_short_b', txt: true},
  {a: at('ai') - 0.15, b: take2() - 0.02, el: (lt) => <AITrainer lt={lt} />, sfx: 'whoosh_slide', txt: true},
  {a: at('9.2') - 0.2, b: at('workout', 1) + 0.25, el: (lt) => <Slim lt={lt} />, sfx: 'whoosh_organic', txt: true},
  {a: at('7') - 0.3, b: at('worry') - 0.1, el: (lt) => <Battery lt={lt} />, sfx: 'whoosh_short_a', txt: true},
  {a: at('worry') - 0.1, b: at('since') - 0.1, el: (lt, d) => <BrollText src="136c198d" start={12} lt={lt} d={d} kicker="Forget the charger" text="No daily charging" hi="charging" />, sfx: 'whoosh_short_b', txt: true},
  {a: at('since') - 0.1, b: at('this', 3) - 0.05, el: (lt) => <Compat lt={lt} />, sfx: 'whoosh_slide', txt: true},
  {a: D.voiceDur - 0.05, b: OPPO_DUR + 0.1, el: (lt) => <EndCard lt={lt} />, sfx: 'whoosh_slide', flash: true},
];
const TAGS = [
  {a: 0.3, b: at('most') - 0.1, kicker: 'OPPO Watch 5', text: 'Cardio, fixed. 🔥', hi: 'fixed'},
  {a: take2() + 0.1, b: at('9.2') - 0.2, kicker: 'OPPO Watch 5', text: 'Super thin', hi: 'thin'},
  {a: at('this', 1) - 0.05, b: at('7') - 0.3, kicker: 'Battery life', text: 'Lasts all week', hi: 'week'},
  {a: at('this', 3) - 0.05, b: D.voiceDur - 0.1, kicker: 'Your sign to', text: 'Try it out ✨', hi: 'Try'},
];
/** every animated headline gets a whoosh + soft pop as its words land */
const TEXT_SFX: number[] = [...CUTS.filter((c) => c.txt).map((c) => c.a + 0.12), ...TAGS.map((g) => g.a)];

const speaking = (t: number) => {
  let v = 0;
  for (const p of D.pages) if (t >= p.s - 0.6 && t <= p.e + 0.6) v = Math.max(v, interpolate(t, [p.s - 0.6, p.s - 0.1, p.e, p.e + 0.6], [0, 1, 1, 0], cl));
  return v;
};

export const OppoTT: React.FC<{music: number}> = ({music}) => {
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Talking />
      {CUTS.map((c, i) => {
        // back-to-back cutaways overlap so the next one fades in over the last (no flash of the talking head)
        const nx = CUTS[i + 1];
        const to = nx && nx.a - c.b < 0.06 ? nx.a + 0.32 : c.b;
        return <Cut key={i} from={c.a} to={to} flash={c.flash}>{(lt, d) => c.el(lt, to === c.b ? d : c.b - c.a)}</Cut>;
      })}
      {TAGS.map((g, i) => <TopTag key={i} from={g.a} to={g.b} kicker={g.kicker} text={g.text} hi={g.hi} />)}
      <Captions />
      <Audio src={staticFile('op/voice.wav')} />
      <Audio src={staticFile('music/voxel_revolution.mp3')} volume={(f) => music * (1.8 - 0.8 * speaking(f / FPS)) * interpolate(f, [0, 15, durationInFrames - 40, durationInFrames], [0.3, 1, 1, 0], cl)} />
      {CUTS.filter((c) => c.sfx).map((c, i) => (
        <Sequence key={i} from={Math.max(0, Math.round((c.a - 0.12) * FPS))} layout="none">
          <Audio src={staticFile(`sfx/${c.sfx}.mp3`)} volume={c.sfx === 'boom' ? 0.35 : c.sfx === 'counter' ? 0.3 : 0.28} />
        </Sequence>
      ))}
      <Sequence from={Math.round((at('now') - 1.0) * FPS)} layout="none"><Audio src={staticFile('sfx/riser.mp3')} volume={0.22} /></Sequence>
      {TEXT_SFX.map((t0, i) => (
        <React.Fragment key={'tx' + i}>
          <Sequence from={Math.round(t0 * FPS)} layout="none"><Audio src={staticFile(`sfx/${i % 2 ? 'whoosh_short_a' : 'whoosh_short_b'}.mp3`)} volume={0.2} /></Sequence>
          <Sequence from={Math.round((t0 + 0.22) * FPS)} layout="none"><Audio src={staticFile('sfx/pop.mp3')} volume={0.22} /></Sequence>
        </React.Fragment>
      ))}
      <Sequence from={Math.round((at('actually') + 0.9) * FPS)} layout="none"><Audio src={staticFile('sfx/counter.mp3')} volume={0.28} /></Sequence>
      <Sequence from={Math.round((at('9.2') + 0.9) * FPS)} layout="none"><Audio src={staticFile('sfx/snap_glassy.mp3')} volume={0.3} /></Sequence>
      <Sequence from={Math.round((D.voiceDur + 0.6) * FPS)} layout="none"><Audio src={staticFile('sfx/ping.mp3')} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};
