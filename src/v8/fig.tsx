import React from 'react';

/** Big-head toon figure (flat fills, thick plum outline). Feet at (0,0), y up is negative.
 *  Angles in degrees: 0 = hanging straight down, positive swings towards +x. */
export const INK = '#2a1420';
export type Pose = {lean?: number; head?: number; aB?: [number, number]; aF?: [number, number]; lB?: [number, number]; lF?: [number, number]; drop?: number};
export type Face = {eyes?: 'open' | 'half' | 'closed' | 'wide'; brow?: number; mouth?: 'flat' | 'smile' | 'frown' | 'open' | 'grit' | 'none'; look?: [number, number]};
export type Look = {skin: string; hair: string; tunic: string; sash?: string; style?: 'long' | 'wild' | 'short' | 'hood'; beard?: boolean; gaunt?: number; shadow?: boolean; glow?: string; spots?: number; wrap?: string};

export const JESUS: Look = {skin: '#E9B48A', hair: '#4A2B1D', tunic: '#E8DCC2', sash: '#A6492E', style: 'long', beard: true};
export const JOHN: Look = {skin: '#D9A074', hair: '#2E1B14', tunic: '#8A5A33', sash: '#3B2618', style: 'wild', beard: true};
export const SIMON: Look = {skin: '#D69A6C', hair: '#3A2418', tunic: '#5F7C8A', sash: '#2F4550', style: 'short', beard: true};
export const ANDREW: Look = {skin: '#E0A77B', hair: '#6B3E22', tunic: '#A8754A', sash: '#5A3A22', style: 'short', beard: false};
export const JAMES: Look = {skin: '#D9A074', hair: '#1F1712', tunic: '#7E5C8A', sash: '#4A3352', style: 'short', beard: true};
export const JOHNZ: Look = {skin: '#E8B48C', hair: '#2A1A12', tunic: '#C79B4A', sash: '#7A5524', style: 'long', beard: false};
export const ZEBEDEE: Look = {skin: '#CF9670', hair: '#D9D4CC', tunic: '#6E6A5E', sash: '#3E3B33', style: 'short', beard: true};
export const MOTHER: Look = {skin: '#D9A07C', hair: '#3A2A22', tunic: '#8E4E5A', sash: '#C9A35A', style: 'hood', wrap: '#4F6B78', beard: false};
export const POSSESSED: Look = {skin: '#B9A08C', hair: '#2E2420', tunic: '#7D7468', sash: '#4A443C', style: 'wild', beard: true};
export const LEPER: Look = {skin: '#C9AFA0', hair: '#5A5048', tunic: '#9A9288', sash: '#6A6258', style: 'hood', wrap: '#8B8378', beard: true, spots: 1};
export const PARALYTIC: Look = {skin: '#D2A07E', hair: '#4A3426', tunic: '#B7AE9C', sash: '#7A705E', style: 'short', beard: true, gaunt: 0.4};
export const LEVI: Look = {skin: '#D8A27A', hair: '#2A1C14', tunic: '#6B3E8E', sash: '#D9A93A', style: 'short', beard: false};
export const SCRIBE: Look = {skin: '#D0A07C', hair: '#3A2E26', tunic: '#EDE6D6', sash: '#3E5C9A', style: 'hood', wrap: '#F2EEE4', beard: true};
export const FRIENDS: Look[] = [
  {skin: '#C98E64', hair: '#2E1E16', tunic: '#C0663A', sash: '#6E3218', style: 'short', beard: true},
  {skin: '#E0AC84', hair: '#5A3A22', tunic: '#5E8A5A', sash: '#2F4A2C', style: 'long', beard: false},
  {skin: '#B9845E', hair: '#1E1612', tunic: '#C9A04A', sash: '#6A5020', style: 'wild', beard: true},
  {skin: '#D9A07C', hair: '#3A2418', tunic: '#4F6F9A', sash: '#2A3C58', style: 'short', beard: false},
];
export const SHADOW: Look = {skin: '#150a12', hair: '#0b0509', tunic: '#150a12', style: 'long', beard: false, shadow: true};

export const P: Record<string, Pose> = {
  stand: {aB: [-8, 6], aF: [8, -6], lB: [-5, 0], lF: [5, 0]},
  walkA: {lean: 5, aB: [28, 18], aF: [-26, 12], lB: [-26, 16], lF: [26, 4]},
  walkB: {lean: 5, aB: [-26, 12], aF: [28, 18], lB: [26, 4], lF: [-26, 16]},
  stagger: {lean: 24, head: 10, aB: [40, 30], aF: [-50, 20], lB: [-34, 30], lF: [30, 6]},
  hammerUp: {lean: -4, aB: [10, 20], aF: [150, -40], lB: [-6, 0], lF: [8, 0]},
  hammerDn: {lean: 10, aB: [14, 24], aF: [62, 10], lB: [-6, 0], lF: [8, 0]},
  reach: {lean: 8, aB: [-6, 8], aF: [72, 8], lB: [-5, 0], lF: [6, 0]},
  fist: {lean: 0, aB: [-10, 10], aF: [20, 110], lB: [-5, 0], lF: [6, 0]},
  sit: {lean: 12, head: 14, aB: [30, 60], aF: [40, 70], lB: [80, -100], lF: [70, -110], drop: 96},
  kneel: {lean: 14, head: 16, aB: [10, 20], aF: [24, 30], lB: [10, -95], lF: [80, -80], drop: 62},
  armsOpen: {lean: -4, head: -8, aB: [-60, -20], aF: [60, 20], lB: [-6, 0], lF: [6, 0]},
  offer: {lean: 6, aB: [-20, 10], aF: [78, 20], lB: [-8, 0], lF: [10, 0]},
  teeter: {lean: 14, head: 12, aB: [-70, -10], aF: [80, 10], lB: [-4, 0], lF: [4, 0]},
  firm: {lean: -2, head: -4, aB: [-14, 6], aF: [14, -6], lB: [-9, 0], lF: [9, 0]},
  command: {lean: -3, head: -4, aB: [-16, 6], aF: [96, 0], lB: [-10, 0], lF: [10, 0]},
};
const l2 = (a: [number, number] | undefined, b: [number, number] | undefined, p: number): [number, number] => {
  const x = a ?? [0, 0], y = b ?? [0, 0];
  return [x[0] + (y[0] - x[0]) * p, x[1] + (y[1] - x[1]) * p];
};
export const mix = (a: Pose, b: Pose, p: number): Pose => ({
  lean: (a.lean ?? 0) + ((b.lean ?? 0) - (a.lean ?? 0)) * p,
  head: (a.head ?? 0) + ((b.head ?? 0) - (a.head ?? 0)) * p,
  drop: (a.drop ?? 0) + ((b.drop ?? 0) - (a.drop ?? 0)) * p,
  aB: l2(a.aB, b.aB, p), aF: l2(a.aF, b.aF, p), lB: l2(a.lB, b.lB, p), lF: l2(a.lF, b.lF, p),
});
export const walk = (t: number, hz = 1.6): Pose => mix(P.walkA, P.walkB, (Math.sin(t * Math.PI * 2 * hz) + 1) / 2);

const rad = (d: number) => (d * Math.PI) / 180;
const seg = (x: number, y: number, a: number, len: number): [number, number] => [x + Math.sin(rad(a)) * len, y + Math.cos(rad(a)) * len];
const lerpHex = (a: string, b: string, p: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = h(a), y = h(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * p).toString(16).padStart(2, '0')).join('');
};

const R = 82; // head radius
const HIP = -118, SHO = -268, HEADY = -338;

export const Head: React.FC<{look: Look; face: Face; t: number}> = ({look, face, t}) => {
  const g = look.gaunt ?? 0;
  const skin = look.shadow ? look.skin : lerpHex(look.skin, '#C9825F', g * 0.7);
  const eyes = face.eyes ?? 'half';
  const [lx, ly] = face.look ?? [0, 0];
  const blink = !look.shadow && Math.floor(t * 12) % 43 === 0;
  const brow = face.brow ?? 0;
  const ex = 30, ey = -2;
  const mouthY = 40;
  const ink = look.shadow ? '#000' : INK;
  let mouth: React.ReactNode = null;
  if (!look.shadow) {
    switch (face.mouth ?? 'flat') {
      case 'smile': mouth = <path d={`M -16 ${mouthY - 3} Q 0 ${mouthY + 13} 16 ${mouthY - 3}`} fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />; break;
      case 'frown': mouth = <path d={`M -14 ${mouthY + 5} Q 0 ${mouthY - 8} 14 ${mouthY + 5}`} fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />; break;
      case 'open': mouth = <ellipse cx={0} cy={mouthY + 2} rx={11} ry={13} fill="#4a1414" stroke={ink} strokeWidth={5} />; break;
      case 'grit': mouth = <g><rect x={-17} y={mouthY - 7} width={34} height={15} rx={4} fill="#f4ead8" stroke={ink} strokeWidth={5} /><line x1={-17} y1={mouthY + 0.5} x2={17} y2={mouthY + 0.5} stroke={ink} strokeWidth={3} /></g>; break;
      case 'none': break;
      default: mouth = <line x1={-12} y1={mouthY} x2={12} y2={mouthY} stroke={ink} strokeWidth={6} strokeLinecap="round" />;
    }
  }
  return (
    <g>
      {/* hair behind */}
      {look.style === 'long' ? <path d={`M ${-R - 6} -10 Q ${-R - 18} 70 ${-R + 8} 108 L ${R - 8} 108 Q ${R + 18} 70 ${R + 6} -10 Z`} fill={look.hair} stroke={ink} strokeWidth={8} strokeLinejoin="round" /> : null}
      {look.style === 'hood' ? <path d={`M ${-R - 16} -20 Q ${-R - 30} 80 ${-R - 6} 128 L ${R + 6} 128 Q ${R + 30} 80 ${R + 16} -20 Z`} fill={look.wrap ?? look.hair} stroke={ink} strokeWidth={8} strokeLinejoin="round" /> : null}
      {look.style === 'wild' ? (
        <path d={Array.from({length: 13}).map((_, i) => { const a = Math.PI * (1 + i / 12) + (i % 2 ? 0.06 : -0.06); const rr = R + (i % 2 ? 44 : 16); const a2 = a - Math.PI * 0.15 * (i === 0 ? -1 : 0); return `${i ? 'L' : 'M'} ${Math.cos(a2) * rr} ${Math.sin(a2) * rr + 6}`; }).join(' ') + ` L ${R + 20} 80 L ${-R - 20} 80 Z`} fill={look.hair} stroke={ink} strokeWidth={8} strokeLinejoin="round" />
      ) : null}
      <circle r={R} fill={skin} stroke={ink} strokeWidth={9} />
      {look.glow ? <circle r={R - 4} fill={look.glow} opacity={0.22} /> : null}
      {/* beard */}
      {look.beard ? <path d={`M ${-R + 5} 12 Q ${-R + 4} ${R + 14} 0 ${R + 16} Q ${R - 4} ${R + 14} ${R - 5} 12 Q ${R - 26} 62 20 30 Q 0 22 -20 30 Q ${-R + 26} 62 ${-R + 5} 12 Z`} fill={look.hair} stroke={ink} strokeWidth={7} strokeLinejoin="round" /> : null}
      {/* hair cap */}
      {look.style === 'long' || look.style === 'short' ? <path d={`M ${-R} -8 A ${R} ${R} 0 0 1 ${R} -8 Q ${R - 30} -44 6 -52 Q -4 -30 ${-R} -8 Z`} fill={look.hair} stroke={ink} strokeWidth={8} strokeLinejoin="round" /> : null}
      {look.style === 'wild' ? <path d={`M ${-R} -4 A ${R} ${R} 0 0 1 ${R} -4 Q ${R - 20} -30 30 -40 L 16 -22 L 0 -42 L -18 -22 L -34 -40 Q ${-R + 14} -30 ${-R} -4 Z`} fill={look.hair} stroke={ink} strokeWidth={8} strokeLinejoin="round" /> : null}
      {look.style === 'hood' ? <path d={`M ${-R - 14} 10 Q ${-R - 18} ${-R - 30} 0 ${-R - 22} Q ${R + 18} ${-R - 30} ${R + 14} 10 Q ${R - 6} -40 0 -46 Q ${-R + 6} -40 ${-R - 14} 10 Z`} fill={look.wrap ?? look.hair} stroke={ink} strokeWidth={8} strokeLinejoin="round" /> : null}
      {look.spots && !look.shadow ? <g opacity={look.spots}>{[[-44, -30, 11], [40, 22, 9], [-22, 48, 7], [52, -40, 8], [-58, 18, 10]].map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={q[2]} fill="#B98A86" stroke="#8a5a52" strokeWidth={2.5} />)}<path d={`M ${-R + 4} -30 L ${R - 4} -46 L ${R - 2} -26 L ${-R + 6} -10 Z`} fill="#E9E1CC" stroke={ink} strokeWidth={5} strokeLinejoin="round" /></g> : null}
      {/* gaunt: hollow cheeks + eye bags */}
      {g > 0.2 && !look.shadow ? (
        <g opacity={g}>
          {[-1, 1].map((s) => <path key={s} d={`M ${s * 58} 6 Q ${s * 46} 22 ${s * 54} 34`} fill="none" stroke="#8a4a36" strokeWidth={5} strokeLinecap="round" />)}
          {[-1, 1].map((s) => <path key={'b' + s} d={`M ${s * ex - 13} ${ey + 20} Q ${s * ex} ${ey + 26} ${s * ex + 13} ${ey + 20}`} fill="none" stroke="#8a4a36" strokeWidth={4} strokeLinecap="round" />)}
        </g>
      ) : null}
      {/* eyes */}
      {[-1, 1].map((s) => {
        const cx = s * ex + lx * 5, cy = ey + ly * 4;
        if (look.shadow) return <ellipse key={s} cx={s * ex} cy={ey} rx={13} ry={eyes === 'wide' ? 12 : 7} fill="#fff" opacity={0.95} />;
        if (blink || eyes === 'closed') return <path key={s} d={`M ${s * ex - 14} ${ey + 2} Q ${s * ex} ${ey + 12} ${s * ex + 14} ${ey + 2}`} fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" />;
        if (eyes === 'wide') return <g key={s}><circle cx={s * ex} cy={ey} r={19} fill="#fff" stroke={ink} strokeWidth={5} /><circle cx={cx} cy={cy} r={8} fill={ink} /></g>;
        if (eyes === 'open') return <ellipse key={s} cx={cx} cy={cy} rx={10} ry={13} fill={ink} />;
        return (
          <g key={s}>
            <path d={`M ${cx - 12} ${cy} A 12 13 0 0 0 ${cx + 12} ${cy} Z`} fill={ink} />
            <line x1={s * ex - 19} y1={ey - 1} x2={s * ex + 19} y2={ey - 1} stroke={ink} strokeWidth={8} strokeLinecap="round" />
          </g>
        );
      })}
      {!look.shadow ? [-1, 1].map((s) => <line key={'br' + s} x1={s * ex - 16} y1={ey - 30 - s * brow * -9} x2={s * ex + 16} y2={ey - 30 + s * brow * -9} stroke={ink} strokeWidth={7} strokeLinecap="round" />) : null}
      {mouth}
    </g>
  );
};

export const Fig: React.FC<{x: number; y: number; pose: Pose; face?: Face; look: Look; scale?: number; flip?: boolean; rot?: number; t?: number; hold?: React.ReactNode; opacity?: number; shake?: number}> = ({x, y, pose, face = {}, look, scale = 1, flip, rot = 0, t = 0, hold, opacity = 1, shake = 0}) => {
  const ink = look.shadow ? '#000' : INK;
  const g = look.gaunt ?? 0;
  const w = 58 - g * 12; // half shoulder width
  const lean = pose.lean ?? 0;
  const limbC = look.shadow ? look.skin : look.skin;
  const sx = shake ? Math.sin(t * 61) * shake : 0, sy = shake ? Math.cos(t * 53) * shake * 0.6 : 0;
  const leg = (a: [number, number], dx: number) => {
    const k = seg(dx, HIP, a[0], 60);
    const f = seg(k[0], k[1], a[0] + a[1], 60);
    return {k, f};
  };
  const lb = leg(pose.lB ?? [0, 0], -16), lf = leg(pose.lF ?? [0, 0], 16);
  const arm = (a: [number, number], dx: number) => {
    const e = seg(dx, SHO + 16, a[0], 62);
    const h = seg(e[0], e[1], a[0] + a[1], 60);
    return {e, h, ang: a[0] + a[1]};
  };
  const ab = arm(pose.aB ?? [0, 0], -w + 12), af = arm(pose.aF ?? [0, 0], w - 12);
  const L = (pts: number[][], c: string) => (
    <g>
      <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={ink} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={c} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  const foot = (f: number[]) => <ellipse cx={f[0] + 9} cy={f[1] - 2} rx={19} ry={10} fill={look.shadow ? look.skin : '#6b4a35'} stroke={ink} strokeWidth={6} />;
  return (
    <g transform={`translate(${x + sx} ${y + sy + (pose.drop ?? 0) * scale}) scale(${(flip ? -1 : 1) * scale} ${scale}) rotate(${rot})`} opacity={opacity}>
      {L([[-16, HIP], lb.k, lb.f], limbC)}{foot(lb.f)}
      <g transform={`rotate(${lean} 0 ${HIP})`}>
        {L([[-w + 12, SHO + 16], ab.e, ab.h], limbC)}
        {/* tunic */}
        <path d={`M ${-w} ${SHO + 8} Q 0 ${SHO - 22} ${w} ${SHO + 8} L ${w + 12 - g * 8} ${HIP + 56} Q 0 ${HIP + 70} ${-w - 12 + g * 8} ${HIP + 56} Z`} fill={look.tunic} stroke={ink} strokeWidth={9} strokeLinejoin="round" />
        {look.sash ? <path d={`M ${-w - 6 + g * 5} ${HIP - 28} Q 0 ${HIP - 18} ${w + 6 - g * 5} ${HIP - 28} L ${w + 8 - g * 5} ${HIP - 4} Q 0 ${HIP + 8} ${-w - 8 + g * 5} ${HIP - 4} Z`} fill={look.sash} stroke={ink} strokeWidth={7} strokeLinejoin="round" /> : null}
      </g>
      {L([[16, HIP], lf.k, lf.f], limbC)}{foot(lf.f)}
      <g transform={`rotate(${lean} 0 ${HIP})`}>
        <g transform={`translate(0 ${HEADY}) rotate(${pose.head ?? 0})`}><Head look={look} face={face} t={t} /></g>
        {L([[w - 12, SHO + 16], af.e, af.h], limbC)}
        {hold ? <g transform={`translate(${af.h[0]} ${af.h[1]}) rotate(${-af.ang})`}>{hold}</g> : null}
      </g>
    </g>
  );
};

/** Head-only close-up (centre at x,y). */
export const Bust: React.FC<{x: number; y: number; look: Look; face?: Face; scale?: number; t?: number; tilt?: number; shake?: number}> = ({x, y, look, face = {}, scale = 1, t = 0, tilt = 0, shake = 0}) => {
  const ink = look.shadow ? '#000' : INK;
  const sx = shake ? Math.sin(t * 61) * shake : 0, sy = shake ? Math.cos(t * 53) * shake * 0.6 : 0;
  return (
    <g transform={`translate(${x + sx} ${y + sy}) scale(${scale}) rotate(${tilt})`}>
      <path d={`M -86 150 Q 0 76 86 150 L 112 420 L -112 420 Z`} fill={look.tunic} stroke={ink} strokeWidth={9} strokeLinejoin="round" />
      <Head look={look} face={face} t={t} />
    </g>
  );
};
