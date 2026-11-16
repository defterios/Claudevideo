import React from 'react';

/** Comic stick-figure rig. Angles in degrees, 0 = hanging straight down, positive = rotate towards +x (forward). */
export type Pose = {
  lean: number; // torso lean
  head: number; // head tilt
  ua: [number, number]; // upper arms (back, front)
  fa: [number, number]; // forearms (relative)
  th: [number, number]; // thighs
  sh: [number, number]; // shins (relative)
};
export type Face = 'happy' | 'neutral' | 'scared' | 'pain' | 'tired' | 'grin' | 'shock' | 'determined' | 'nervous';

export const POSES: Record<string, Pose> = {
  stand: {lean: 0, head: 0, ua: [-12, 12], fa: [-8, 8], th: [-8, 8], sh: [0, 0]},
  nervous: {lean: -4, head: -6, ua: [25, -25], fa: [80, -80], th: [-5, 5], sh: [2, -2]},
  walkA: {lean: 4, head: 0, ua: [30, -30], fa: [20, 10], th: [-25, 25], sh: [20, 5]},
  walkB: {lean: 4, head: 0, ua: [-30, 30], fa: [10, 20], th: [25, -25], sh: [5, 20]},
  runA: {lean: 16, head: 4, ua: [55, -45], fa: [70, 80], th: [-40, 45], sh: [70, 10]},
  runB: {lean: 16, head: 4, ua: [-45, 55], fa: [80, 70], th: [45, -40], sh: [10, 70]},
  cheer: {lean: 0, head: -8, ua: [-155, 155], fa: [-10, 10], th: [-12, 12], sh: [0, 0]},
  jump: {lean: -4, head: -10, ua: [-150, 150], fa: [-20, 20], th: [-25, 25], sh: [40, 40]},
  armsOut: {lean: 0, head: 0, ua: [-80, 80], fa: [0, 0], th: [-10, 10], sh: [0, 0]},
  tired: {lean: 38, head: 10, ua: [20, 30], fa: [-30, -20], th: [-12, 18], sh: [10, 18]},
  sit: {lean: -6, head: 0, ua: [10, 20], fa: [30, 40], th: [85, 80], sh: [-85, -80]},
  sitOuch: {lean: 14, head: 10, ua: [-30, 40], fa: [-90, 30], th: [85, 80], sh: [-85, -80]},
  mic: {lean: 0, head: 0, ua: [-12, 40], fa: [-8, 115], th: [-8, 8], sh: [0, 0]},
  point: {lean: 0, head: 0, ua: [-12, 92], fa: [-8, 0], th: [-8, 8], sh: [0, 0]},
  ropeLean: {lean: -28, head: -10, ua: [-60, -100], fa: [0, 0], th: [-20, 15], sh: [10, 5]},
  flex: {lean: 0, head: 0, ua: [-95, 95], fa: [-100, 100], th: [-14, 14], sh: [0, 0]},
  arms: {lean: 0, head: 0, ua: [40, -40], fa: [95, -95], th: [-8, 8], sh: [0, 0]}, // arms crossed-ish
};

export const lerpPose = (a: Pose, b: Pose, p: number): Pose => {
  const l = (x: number, y: number) => x + (y - x) * p;
  const l2 = (x: [number, number], y: [number, number]): [number, number] => [l(x[0], y[0]), l(x[1], y[1])];
  return {lean: l(a.lean, b.lean), head: l(a.head, b.head), ua: l2(a.ua, b.ua), fa: l2(a.fa, b.fa), th: l2(a.th, b.th), sh: l2(a.sh, b.sh)};
};

/** cycle between two poses (walk / run) */
export const cyclePose = (a: string, b: string, t: number, hz: number) => {
  const p = (Math.sin(t * Math.PI * 2 * hz) + 1) / 2;
  return lerpPose(POSES[a], POSES[b], p);
};

const rad = (d: number) => (d * Math.PI) / 180;
const seg = (x: number, y: number, ang: number, len: number) => [x + Math.sin(rad(ang)) * len, y + Math.cos(rad(ang)) * len];

const FaceDraw: React.FC<{face: Face; r: number; blink?: boolean}> = ({face, r, blink}) => {
  const eY = -r * 0.12;
  const ex = r * 0.32;
  const big = face === 'scared' || face === 'shock';
  const eyeR = big ? r * 0.17 : r * 0.1;
  const brows: Record<Face, number> = {happy: 0, neutral: 0, scared: -18, pain: 22, tired: 10, grin: 0, shock: -24, determined: 20, nervous: -12};
  const b = brows[face];
  const mouthY = r * 0.42;
  let mouth: React.ReactNode;
  switch (face) {
    case 'happy':
    case 'grin':
      mouth = <path d={`M ${-r * 0.35} ${mouthY - 6} Q 0 ${mouthY + r * 0.32} ${r * 0.35} ${mouthY - 6}`} fill={face === 'grin' ? '#fff' : 'none'} stroke="#111" strokeWidth={5} strokeLinejoin="round" />;
      break;
    case 'scared':
    case 'shock':
      mouth = <ellipse cx={0} cy={mouthY} rx={r * 0.17} ry={r * 0.24} fill="#5a1414" stroke="#111" strokeWidth={4} />;
      break;
    case 'pain':
      mouth = (
        <g>
          <rect x={-r * 0.32} y={mouthY - r * 0.12} width={r * 0.64} height={r * 0.24} rx={4} fill="#fff" stroke="#111" strokeWidth={4} />
          <line x1={-r * 0.32} y1={mouthY} x2={r * 0.32} y2={mouthY} stroke="#111" strokeWidth={3} />
        </g>
      );
      break;
    case 'tired':
      mouth = <ellipse cx={0} cy={mouthY + 4} rx={r * 0.22} ry={r * 0.14} fill="#5a1414" stroke="#111" strokeWidth={4} />;
      break;
    case 'nervous':
      mouth = <path d={`M ${-r * 0.32} ${mouthY} q ${r * 0.08} -8 ${r * 0.16} 0 t ${r * 0.16} 0 t ${r * 0.16} 0 t ${r * 0.16} 0`} fill="none" stroke="#111" strokeWidth={4.5} />;
      break;
    case 'determined':
      mouth = <line x1={-r * 0.28} y1={mouthY} x2={r * 0.28} y2={mouthY - 3} stroke="#111" strokeWidth={5} strokeLinecap="round" />;
      break;
    default:
      mouth = <line x1={-r * 0.22} y1={mouthY} x2={r * 0.22} y2={mouthY} stroke="#111" strokeWidth={5} strokeLinecap="round" />;
  }
  return (
    <g>
      {[-1, 1].map((s) =>
        blink || face === 'tired' ? (
          <line key={s} x1={s * ex - eyeR} y1={eY} x2={s * ex + eyeR} y2={eY} stroke="#111" strokeWidth={5} strokeLinecap="round" />
        ) : (
          <g key={s}>
            {big ? <circle cx={s * ex} cy={eY} r={eyeR * 1.3} fill="#fff" stroke="#111" strokeWidth={3} /> : null}
            <circle cx={s * ex} cy={eY} r={eyeR} fill="#111" />
          </g>
        )
      )}
      {[-1, 1].map((s) => (
        <line key={'b' + s} x1={s * ex - r * 0.16} y1={eY - r * 0.3 + (s === 1 ? 1 : -1) * Math.sin(rad(b)) * 8} x2={s * ex + r * 0.16} y2={eY - r * 0.3 - (s === 1 ? 1 : -1) * Math.sin(rad(b)) * 8} stroke="#111" strokeWidth={5} strokeLinecap="round" />
      ))}
      {mouth}
    </g>
  );
};

export type Gear = {headband?: string; cap?: string; whistle?: boolean; mic?: boolean; clipboard?: boolean; bulky?: boolean; shirt?: string; sweat?: number; bruise?: number};

/** Draws a stick figure standing with feet at (x, y). */
export const Stick: React.FC<{x: number; y: number; pose: Pose; face?: Face; scale?: number; flip?: boolean; gear?: Gear; rot?: number; t?: number}> = ({x, y, pose, face = 'neutral', scale = 1, flip, gear = {}, rot = 0, t = 0}) => {
  const W = gear.bulky ? 22 : 13;
  const TOR = 125;
  const UA = 66, FA = 62, TH = 82, SH = 82, R = 48;
  // hips at origin, feet ~ +164 below
  const hip: [number, number] = [0, 0];
  const neck = seg(0, 0, 180 + pose.lean, TOR);
  const headC = seg(neck[0], neck[1], 180 + pose.lean + pose.head, R + 6);
  const sho = seg(0, 0, 180 + pose.lean, TOR - 14);
  const arms = [0, 1].map((i) => {
    const a = pose.ua[i] + pose.lean * 0.3;
    const e = seg(sho[0], sho[1], a, UA);
    const h = seg(e[0], e[1], a + pose.fa[i], FA);
    return {e, h, a};
  });
  const legs = [0, 1].map((i) => {
    const k = seg(hip[0], hip[1], pose.th[i], TH);
    const f = seg(k[0], k[1], pose.th[i] + pose.sh[i], SH);
    return {k, f};
  });
  const footY = Math.max(legs[0].f[1], legs[1].f[1]);
  const blink = Math.floor(t * 10) % 37 === 0;
  const L = (p: number[][], c = '#111', w = W) => <polyline points={p.map((q) => q.join(',')).join(' ')} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * scale} ${scale}) rotate(${rot}) translate(0 ${-footY})`}>
      {/* back limbs slightly lighter for depth */}
      {L([hip, legs[0].k, legs[0].f], '#2a2a2a')}
      {L([sho, arms[0].e, arms[0].h], '#2a2a2a')}
      {gear.bulky ? <path d={`M ${sho[0] - 34} ${sho[1] + 6} Q ${neck[0]} ${neck[1] + 40} ${sho[0] + 34} ${sho[1] + 6} L 18 0 L -18 0 Z`} fill="#222" stroke="#111" strokeWidth={6} /> : null}
      {gear.shirt ? <path d={`M ${sho[0] - 22} ${sho[1]} L ${sho[0] + 22} ${sho[1]} L 16 6 L -16 6 Z`} fill={gear.shirt} stroke="#111" strokeWidth={5} /> : null}
      {L([hip, neck])}
      {/* trunks */}
      <path d="M -20 -12 L 20 -12 L 24 16 L -24 16 Z" fill={gear.headband ?? '#333'} stroke="#111" strokeWidth={5} />
      {L([hip, legs[1].k, legs[1].f])}
      {L([sho, arms[1].e, arms[1].h])}
      {gear.bruise ? <ellipse cx={sho[0] + 10} cy={sho[1] + 50} rx={20} ry={14} fill="#7B3FA0" opacity={gear.bruise} /> : null}
      {gear.mic ? (
        <g transform={`translate(${arms[1].h[0]} ${arms[1].h[1]}) rotate(${-arms[1].a - pose.fa[1] + 180})`}>
          <rect x={-7} y={-8} width={14} height={42} rx={5} fill="#222" />
          <circle cx={0} cy={-14} r={13} fill="#555" stroke="#111" strokeWidth={4} />
        </g>
      ) : null}
      {gear.clipboard ? <rect x={arms[0].h[0] - 26} y={arms[0].h[1] - 40} width={52} height={66} rx={4} fill="#C9A26B" stroke="#111" strokeWidth={5} /> : null}
      {/* head */}
      <g transform={`translate(${headC[0]} ${headC[1]}) rotate(${pose.lean + pose.head})`}>
        <circle r={R} fill="#fff" stroke="#111" strokeWidth={7} />
        {gear.headband ? <rect x={-R + 2} y={-R * 0.62} width={R * 2 - 4} height={14} fill={gear.headband} stroke="#111" strokeWidth={4} rx={3} /> : null}
        {gear.cap ? (
          <g>
            <path d={`M ${-R} ${-R * 0.25} A ${R} ${R} 0 0 1 ${R} ${-R * 0.25} Z`} fill={gear.cap} stroke="#111" strokeWidth={6} />
            <rect x={R * 0.2} y={-R * 0.32} width={R * 1.1} height={12} rx={6} fill={gear.cap} stroke="#111" strokeWidth={5} />
          </g>
        ) : null}
        <FaceDraw face={face} r={R} blink={blink} />
        {gear.sweat
          ? [0, 1].map((i) => {
              const ph = ((t * 1.3 + i * 0.5) % 1);
              return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${R * (0.75 + i * 0.25)} ${-R * 0.5 + ph * 60}) scale(${1.4})`} fill="#7EC8F0" stroke="#111" strokeWidth={2.5} opacity={(1 - ph) * gear.sweat!} />;
            })
          : null}
      </g>
      {gear.whistle ? <g transform={`translate(${neck[0] + 14} ${neck[1] + 30})`}><line x1={-14} y1={-30} x2={0} y2={0} stroke="#111" strokeWidth={3} /><rect x={-6} y={-4} width={22} height={12} rx={5} fill="#C0C0C0" stroke="#111" strokeWidth={3} /></g> : null}
    </g>
  );
};
