import React from 'react';
import {Face, Head, INK, Look} from '../v8/fig';

/** "Lit room" style (2nd reference): bean-bodied round-headed cartoon people in dim, warmly lit, depth-of-field sets. */
export const RDEFS = (
  <defs>
    <filter id="dof" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
    <filter id="dofS" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" /></filter>
    <filter id="softL" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28" /></filter>
    <radialGradient id="lampPool"><stop offset="0" stopColor="#FFC27A" stopOpacity={0.75} /><stop offset="0.5" stopColor="#FF9A4A" stopOpacity={0.22} /><stop offset="1" stopColor="#FF9A4A" stopOpacity={0} /></radialGradient>
    <linearGradient id="goldHour" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 -1300) scale(1 1700)">
      <stop offset="0" stopColor="#5E6E9A" /><stop offset="0.55" stopColor="#E8A870" /><stop offset="0.85" stopColor="#FFD9A0" />
    </linearGradient>
    <linearGradient id="nightSt" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 -1300) scale(1 2200)">
      <stop offset="0" stopColor="#0B0F1E" /><stop offset="0.6" stopColor="#1C2236" /><stop offset="1" stopColor="#2A2A3A" />
    </linearGradient>
  </defs>
);

export type Arms = 'none' | 'down' | 'reach' | 'point' | 'offer' | 'up' | 'cross';
const ARMS: Record<Arms, [number, number, number, number] | null> = { // [back angle, back elbow, front angle, front elbow] degrees from straight down, + = forward
  none: null, down: [-14, 4, 14, -4], reach: [-10, 6, 80, 6], point: [-14, 4, 95, 0], offer: [-30, 20, 70, 30], up: [-160, 0, 160, 0], cross: [40, 100, -40, -100],
};
/** Bean person, feet at (x, y). */
export const Bean: React.FC<{x: number; y: number; look: Look; face?: Face; s?: number; flip?: boolean; t?: number; arms?: Arms; sit?: boolean; walk?: number; shake?: number; hold?: React.ReactNode; shirt?: string; dim?: number}> = ({x, y, look, face = {}, s = 1, flip, t = 0, arms = 'none', sit, walk = 0, shake = 0, hold, shirt, dim = 0}) => {
  const sx = shake ? Math.sin(t * 61) * shake : 0;
  const ph = Math.sin(t * Math.PI * 1.7);
  const lift = sit ? 100 : walk ? Math.abs(ph) * 8 : 0;
  const body = shirt ?? look.tunic;
  const rad = (d: number) => (d * Math.PI) / 180;
  const arm = (side: number, a: number, el: number) => {
    const sh: [number, number] = [side * 62, -300 + lift];
    const e: [number, number] = [sh[0] + Math.sin(rad(a)) * 70 * (side < 0 ? -1 : 1) * (side < 0 ? -1 : 1), sh[1] + Math.cos(rad(a)) * 70];
    const h: [number, number] = [e[0] + Math.sin(rad(a + el)) * 66, e[1] + Math.cos(rad(a + el)) * 66];
    return {pts: [sh, e, h], h, ang: a + el};
  };
  const A = ARMS[arms];
  const back = A ? arm(-1, A[0], A[1]) : null, front = A ? arm(1, A[2], A[3]) : null;
  const L = (pts: number[][], w = 9) => (
    <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={INK} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );
  const legA = sit ? [[-30, -100], [-40, -70], [30, -60]] : [[-30, -110 + lift], [-30 - ph * 18 * walk, -50], [-26 - ph * 30 * walk, 0]];
  const legB = sit ? [[30, -100], [24, -70], [90, -60]] : [[30, -110 + lift], [30 + ph * 18 * walk, -50], [34 + ph * 30 * walk, 0]];
  return (
    <g transform={`translate(${x + sx} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      <ellipse cx={0} cy={0} rx={110} ry={18} fill="#000" opacity={0.28} filter="url(#dofS)" />
      {L(legA)}{L(legB)}
      {[legA[2], legB[2]].map((f, i) => <ellipse key={i} cx={f[0] + 10} cy={f[1] - 4} rx={18} ry={9} fill="#3a2a22" stroke={INK} strokeWidth={4} />)}
      {back ? L(back.pts) : null}
      <g transform={`translate(0 ${lift})`}>
        <path d="M -82 -150 Q -96 -290 -60 -350 Q 0 -390 60 -350 Q 96 -290 82 -150 Q 70 -100 0 -96 Q -70 -100 -82 -150 Z" fill={body} stroke={INK} strokeWidth={8} />
        <path d="M 30 -360 Q 92 -300 82 -150 Q 70 -100 0 -96 Q 60 -150 30 -360 Z" fill="#000" opacity={0.18} />
        {look.sash ? <path d="M -86 -200 Q 0 -186 86 -200 L 84 -176 Q 0 -162 -84 -176 Z" fill={look.sash} stroke={INK} strokeWidth={5} /> : null}
        {[-300, -260, -220].map((yy) => <circle key={yy} cx={0} cy={yy + 6} r={5} fill={INK} opacity={0.55} />)}
        <g transform={`translate(0 -440) rotate(${walk ? ph * 2 : 0})`}><Head look={look} face={face} t={t} /></g>
      </g>
      {front ? L(front.pts) : null}
      {front && hold ? <g transform={`translate(${front.h[0]} ${front.h[1]}) rotate(${-front.ang})`}>{hold}</g> : null}
      {dim ? <path d="M -100 -560 L 100 -560 L 100 20 L -100 20 Z" fill="#0a0612" opacity={dim} /> : null}
    </g>
  );
};

/** soft diagonal sunlight patch */
export const SunPatch: React.FC<{pts: string; o?: number; col?: string}> = ({pts, o = 0.35, col = '#FFE2A8'}) => (
  <polygon points={pts} fill={col} opacity={o} filter="url(#dofS)" style={{mixBlendMode: 'screen'}} />
);
/** oil lamp with a warm pool of light */
export const OilLamp: React.FC<{x: number; y: number; t: number; r?: number}> = ({x, y, t, r = 520}) => (
  <g>
    <circle cx={x} cy={y} r={r + Math.sin(t * 8) * 10} fill="url(#lampPool)" style={{mixBlendMode: 'screen'}} />
    <path d={`M ${x - 34} ${y + 6} Q ${x} ${y + 40} ${x + 40} ${y + 4} L ${x + 60} ${y - 4} L ${x + 30} ${y - 6} Z`} fill="#7a4a2a" stroke={INK} strokeWidth={4} />
    <path d={`M ${x + 46} ${y - 6} q -10 -20 0 -40 q 10 18 0 40`} fill="#FFD36A" />
  </g>
);
/** stone-and-plaster interior wall, wood floor, horizon at y */
export const Room: React.FC<{y?: number; wall?: string; floor?: string; t: number; win?: boolean; dark?: number}> = ({y = 300, wall = '#7A6656', floor = '#5A3E2C', win = true, dark = 0}) => (
  <g>
    <rect x={-3000} y={-3000} width={6000} height={3000 + y} fill={wall} />
    {Array.from({length: 26}).map((_, i) => <line key={i} x1={-2400 + i * 190} y1={-3000} x2={-2400 + i * 190} y2={y} stroke="#000" strokeWidth={3} opacity={0.1} />)}
    <rect x={-3000} y={y - 30} width={6000} height={30} fill="#3a2a20" />
    <rect x={-3000} y={y} width={6000} height={3000} fill={floor} />
    {Array.from({length: 18}).map((_, i) => <line key={'f' + i} x1={-200 + (i - 9) * 60} y1={y} x2={(i - 9) * 520} y2={y + 2200} stroke="#000" strokeWidth={4} opacity={0.18} />)}
    {win ? <g><rect x={-620} y={-760} width={260} height={360} fill="#FFE6B0" stroke="#3a2a20" strokeWidth={16} /><line x1={-490} y1={-760} x2={-490} y2={-400} stroke="#3a2a20" strokeWidth={10} /></g> : null}
    {dark ? <rect x={-3000} y={-3000} width={6000} height={6000} fill="#08060e" opacity={dark} /> : null}
  </g>
);
export const BenchR: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 520}) => (
  <g><rect x={x - w / 2} y={y - 120} width={w} height={34} rx={6} fill="#6E4A30" stroke={INK} strokeWidth={6} /><rect x={x - w / 2 + 30} y={y - 86} width={26} height={86} fill="#5a3a24" stroke={INK} strokeWidth={5} /><rect x={x + w / 2 - 56} y={y - 86} width={26} height={86} fill="#5a3a24" stroke={INK} strokeWidth={5} /></g>
);
