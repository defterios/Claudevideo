import React from 'react';
import {Easing, interpolate, spring} from 'remotion';

export const C = {
  ink: '#151515', cream: '#F3E9D2', orange: '#F28C28', red: '#D7262E', blue: '#2E6FD8', green: '#3DBE5A', purple: '#7B3FA0',
  sky1: '#2B3A55', sky2: '#E8925B', gym1: '#3A404C', gym2: '#262A33', floor: '#55505A', canvas: '#E9E4DA', apron: '#1F2A44',
};
export const TITLE = 'Anton, "Noto Color Emoji", Impact, sans-serif';
export const BODY = '"Inter Tight", "Noto Color Emoji", sans-serif';
export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = (x: number, a: number, b: number) => interpolate(x, [a, b], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
export const eout = (x: number, a: number, b: number) => interpolate(x, [a, b], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
export const pop = (t: number, at: number) => spring({frame: Math.round((t - at) * 30), fps: 30, config: {damping: 11, stiffness: 190}});

/** comic text with thick black outline (SVG) */
export const OText: React.FC<{x: number; y: number; text: string; size: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; rot?: number; scale?: number; stroke?: number; font?: string; opacity?: number}> = ({x, y, text, size, fill = '#fff', anchor = 'middle', rot = 0, scale = 1, stroke, font = TITLE, opacity = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} opacity={opacity}>
    <text textAnchor={anchor} fontFamily={font} fontSize={size} fill={fill} stroke={C.ink} strokeWidth={stroke ?? size * 0.14} strokeLinejoin="round" paintOrder="stroke" letterSpacing={1}>
      {text}
    </text>
  </g>
);

/** comic impact burst */
export const Burst: React.FC<{x: number; y: number; r: number; p: number; text?: string; color?: string; rot?: number}> = ({x, y, r, p, text, color = '#FFD23F', rot = -8}) => {
  if (p <= 0.01) return null;
  const pts = Array.from({length: 24}).map((_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const rr = i % 2 ? r * 0.62 : r;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${p})`}>
      <polygon points={pts.join(' ')} fill={color} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      {text ? <OText x={0} y={r * 0.2} text={text} size={r * 0.55} fill={C.red} stroke={r * 0.07} /> : null}
    </g>
  );
};

export const SpeedLines: React.FC<{x: number; y: number; dir: number; o: number; n?: number; len?: number}> = ({x, y, dir, o, n = 6, len = 160}) => (
  <g opacity={o}>
    {Array.from({length: n}).map((_, i) => (
      <line key={i} x1={x - dir * (40 + (i % 3) * 30)} y1={y - 120 + i * 45} x2={x - dir * (40 + (i % 3) * 30 + len)} y2={y - 120 + i * 45} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    ))}
  </g>
);

export const Bubble: React.FC<{x: number; y: number; w: number; h: number; text: string; p: number; tail?: number; size?: number; color?: string; textColor?: string}> = ({x, y, w, h, text, p, tail = -1, size = 46, color = '#fff', textColor = C.ink}) => {
  if (p <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <path d={`M ${tail * 30} ${h / 2 - 4} L ${tail * 70} ${h / 2 + 50} L ${tail * 80 + (tail > 0 ? -60 : 60)} ${h / 2 - 4} Z`} fill={color} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.4} fill={color} stroke={C.ink} strokeWidth={7} />
      <rect x={-w / 2 + 40} y={h / 2 - 12} width={110} height={16} fill={color} />
      <text textAnchor="middle" y={size * 0.35} fontFamily={TITLE} fontSize={size} fill={textColor}>{text}</text>
    </g>
  );
};

/* ---------------- sets ---------------- */
export const Halftone: React.FC<{o?: number}> = ({o = 0.07}) => (
  <g opacity={o}>
    <defs>
      <pattern id="ht" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="9" cy="9" r="3.4" fill="#000" />
      </pattern>
    </defs>
    <rect width={1920} height={1080} fill="url(#ht)" />
  </g>
);

export const Gym: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill={C.gym1} />
    {/* big windows */}
    {Array.from({length: 6}).map((_, i) => (
      <g key={i}>
        <rect x={60 + i * 310} y={90} width={250} height={300} fill="#6E87A8" stroke={C.ink} strokeWidth={8} />
        <line x1={185 + i * 310} y1={90} x2={185 + i * 310} y2={390} stroke={C.ink} strokeWidth={6} />
        <line x1={60 + i * 310} y1={240} x2={310 + i * 310} y2={240} stroke={C.ink} strokeWidth={6} />
      </g>
    ))}
    {/* ceiling lights */}
    {Array.from({length: 5}).map((_, i) => (
      <g key={'l' + i}>
        <rect x={150 + i * 400} y={20} width={140} height={22} rx={6} fill="#FFF3B0" stroke={C.ink} strokeWidth={5} />
        <polygon points={`${150 + i * 400},42 ${290 + i * 400},42 ${330 + i * 400},460 ${110 + i * 400},460`} fill="#FFF3B0" opacity={0.08 + 0.02 * Math.sin(t * 3 + i)} />
      </g>
    ))}
    {/* distant rings */}
    {[220, 1180].map((x, i) => (
      <g key={'r' + i} opacity={0.75}>
        <rect x={x} y={500} width={520} height={90} fill="#2A3550" stroke={C.ink} strokeWidth={6} />
        {[0, 1, 2].map((k) => <line key={k} x1={x} y1={430 + k * 22} x2={x + 520} y2={430 + k * 22} stroke="#ddd" strokeWidth={5} />)}
        <rect x={x - 10} y={400} width={18} height={190} fill="#111" />
        <rect x={x + 512} y={400} width={18} height={190} fill="#111" />
      </g>
    ))}
    <rect y={590} width={1920} height={490} fill={C.floor} />
    <line x1={0} y1={590} x2={1920} y2={590} stroke={C.ink} strokeWidth={8} />
    {/* weights rack */}
    <g transform="translate(1560 470)">
      <rect x={0} y={0} width={300} height={14} fill="#888" stroke={C.ink} strokeWidth={5} />
      {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={30 + k * 60} cy={60} r={28 - k * 2} fill="#333" stroke={C.ink} strokeWidth={5} />)}
      <rect x={0} y={100} width={300} height={14} fill="#888" stroke={C.ink} strokeWidth={5} />
    </g>
  </g>
);

/** wrestling ring, side view. floorY = canvas surface height */
export const Ring: React.FC<{x: number; w: number; floorY: number; ropeWob?: number[]; label?: boolean}> = ({x, w, floorY, ropeWob = [0, 0, 0]}) => {
  const postH = 230;
  return (
    <g>
      <rect x={x} y={floorY} width={w} height={34} fill={C.canvas} stroke={C.ink} strokeWidth={7} />
      <rect x={x} y={floorY + 34} width={w} height={150} fill={C.apron} stroke={C.ink} strokeWidth={7} />
      <text x={x + w / 2} y={floorY + 112} textAnchor="middle" fontFamily={TITLE} fontSize={52} fill="#fff" opacity={0.45}>PERFORMANCE CENTER</text>
      {[x - 10, x + w - 14].map((px, i) => (
        <g key={i}>
          <rect x={px} y={floorY - postH} width={24} height={postH + 184} fill="#111" />
          {[0, 1, 2].map((k) => <rect key={k} x={px - 10} y={floorY - postH + 20 + k * 70} width={44} height={34} rx={8} fill={C.red} stroke={C.ink} strokeWidth={5} />)}
        </g>
      ))}
      {[0, 1, 2].map((k) => {
        const y = floorY - postH + 37 + k * 70;
        const wob = ropeWob[k] ?? 0;
        return <path key={k} d={`M ${x} ${y} Q ${x + w / 2} ${y + wob} ${x + w} ${y}`} fill="none" stroke={k === 1 ? '#fff' : C.red} strokeWidth={13} strokeLinecap="round" />;
      })}
    </g>
  );
};

export const Crowd: React.FC<{t: number; y: number; rows?: number; excite?: number}> = ({t, y, rows = 3, excite = 0.5}) => (
  <g>
    {Array.from({length: rows}).map((_, r) =>
      Array.from({length: 22}).map((__, i) => {
        const x = i * 92 + (r % 2) * 46 - 20;
        const bob = Math.max(0, Math.sin(t * (6 + (i % 5)) + i * 1.7 + r)) * 14 * excite;
        const yy = y + r * 70 - bob;
        const c = ['#141821', '#1B2130', '#222A3B'][r];
        return (
          <g key={r + '-' + i}>
            <circle cx={x} cy={yy} r={28} fill={c} />
            <rect x={x - 32} y={yy + 20} width={64} height={90} rx={24} fill={c} />
            {excite > 0.6 && i % 4 === r ? <line x1={x + 20} y1={yy + 20} x2={x + 40} y2={yy - 50} stroke={c} strokeWidth={14} strokeLinecap="round" /> : null}
          </g>
        );
      })
    )}
  </g>
);
