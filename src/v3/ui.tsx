import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';

export const SANS = '"Inter Tight", "Noto Color Emoji", sans-serif';
export const MONO = '"JetBrains Mono", monospace';
export const K = {
  bg1: '#353D49',
  bg2: '#1B2027',
  card: '#20262E',
  line: 'rgba(255,255,255,0.08)',
  white: '#F4F6F8',
  dim: '#98A2AF',
  green: '#3DDC84',
  blue: '#2F80ED',
  yellow: '#F5C518',
  red: '#FF3B3B',
};
/** Light (white) palette — same keys; `white` = primary text colour, `dim` = secondary. */
export const KL: typeof K = {
  bg1: '#FFFFFF',
  bg2: '#E9EDF2',
  card: '#FFFFFF',
  line: 'rgba(15,23,42,0.09)',
  white: '#11161C',
  dim: '#6B7480',
  green: '#16A34A',
  blue: '#2563EB',
  yellow: '#E6A700',
  red: '#E5383B',
};
export const ThemeCtx = React.createContext<typeof K>(K);
/** Optional photo background (public path) used by SlateBg in the light theme. */
export const BgImageCtx = React.createContext<string | null>(null);
export const useK = () => React.useContext(ThemeCtx);
const isLight = (t: typeof K) => t.bg1 === '#FFFFFF';
export const CX = 495; // centre of the TikTok/IG safe zone (x 60..930)
export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = (x: number, a: number, b: number) => interpolate(x, [a, b], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
export const pop = (local: number, at = 0) => spring({frame: Math.round((local - at) * 30), fps: 30, config: {damping: 14, stiffness: 170, mass: 0.9}});

export const SlateBg: React.FC = () => {
  const T = useK();
  const bg = React.useContext(BgImageCtx);
  const frame = useCurrentFrame();
  if (bg && isLight(T)) {
    // photo background: blurred + washed bright so dark text / white cards stay readable
    const k = 1.12 + frame * 0.00008;
    return (
      <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#F4F1EC'}}>
        <Img src={staticFile(bg)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${k})`, filter: 'blur(14px) brightness(1.22) saturate(1.15)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,248,238,0.56) 0%, rgba(255,248,238,0.46) 45%, rgba(255,248,238,0.62) 100%)'}} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        background: isLight(T)
          ? 'radial-gradient(ellipse 85% 60% at 50% 35%, #FFFFFF 0%, #F6F7F9 55%, #E6EAF0 100%)'
          : `radial-gradient(ellipse 80% 45% at 50% 18%, rgba(120,140,170,0.22), rgba(0,0,0,0) 70%), linear-gradient(180deg, ${K.bg1} 0%, ${K.bg2} 100%)`,
      }}
    />
  );
};

/** Floating card: springs up from below with a slight 3D tilt + blur. */
export const Card: React.FC<{local: number; at?: number; style?: React.CSSProperties; children?: React.ReactNode; tilt?: number}> = ({local, at = 0, style, children, tilt = 0}) => {
  const T = useK();
  const p = pop(local, at);
  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: 26,
        overflow: 'hidden',
        background: T.card,
        border: `1.5px solid ${T.line}`,
        boxShadow: isLight(T) ? '0 30px 70px rgba(15,23,42,0.13), 0 6px 16px rgba(15,23,42,0.06)' : '0 40px 90px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.3)',
        opacity: Math.min(1, p * 1.6),
        filter: p < 0.98 ? `blur(${(1 - p) * 10}px)` : undefined,
        transform: `perspective(1400px) translateY(${(1 - p) * 120}px) rotateX(${(1 - p) * 18}deg) rotate(${tilt}deg) scale(${0.92 + 0.08 * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Photo: React.FC<{img: string; local: number; dur: number; zoom?: 'in' | 'out'}> = ({img, local, dur, zoom = 'in'}) => {
  const k = interpolate(local, [0, Math.max(dur, 0.1)], zoom === 'in' ? [1.03, 1.12] : [1.12, 1.03], cl);
  return <Img src={staticFile(`broll/${img}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${k})`, filter: 'saturate(0.9) contrast(1.06)'}} />;
};

type Tone = 'dim' | 'green' | 'blue' | 'yellow' | 'red';
const CHIP: Record<Tone, [string, string]> = {
  dim: ['rgba(32,38,46,0.92)', K.white],
  green: [K.green, '#0E1A12'],
  blue: [K.blue, '#fff'],
  yellow: [K.yellow, '#1A1500'],
  red: [K.red, '#fff'],
};
export const Chip: React.FC<{text: string; tone?: Tone; p?: number; dot?: string; size?: number}> = ({text, tone = 'dim', p = 1, dot, size = 30}) => {
  const T = useK();
  const light = isLight(T) && tone === 'dim';
  return (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 2,
      background: light ? '#FFFFFF' : CHIP[tone][0],
      color: light ? T.white : CHIP[tone][1],
      borderRadius: 999,
      padding: `${size * 0.35}px ${size * 0.8}px`,
      border: tone === 'dim' ? `1.5px solid ${T.line}` : 'none',
      boxShadow: isLight(T) ? '0 10px 24px rgba(15,23,42,0.12)' : '0 12px 30px rgba(0,0,0,0.35)',
      opacity: p,
      transform: `translateY(${(1 - p) * 24}px) scale(${0.9 + 0.1 * p})`,
    }}
  >
    {dot ? <span style={{width: size * 0.4, height: size * 0.4, borderRadius: 99, background: dot}} /> : null}
    {text}
  </div>
  );
};

/** Heavy sans headline; one word/line can take the yellow accent. */
export const Heavy: React.FC<{text: string; size: number; color?: string; p: number; style?: React.CSSProperties}> = ({text, size, color, p, style}) => {
  const T = useK();
  return (
  <div
    style={{
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: -size * 0.02,
      color: color ?? T.white,
      opacity: p,
      filter: `blur(${(1 - p) * 10}px)`,
      transform: `translateY(${(1 - p) * 30}px)`,
      textShadow: isLight(T) ? 'none' : '0 10px 40px rgba(0,0,0,0.35)',
      ...style,
    }}
  >
    {text}
  </div>
  );
};
