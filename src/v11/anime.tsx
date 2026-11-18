import React from 'react';

/** 80s-anime style pieces: cel-shaded close-up heads, hands, wheat. Local units; place with a transform. */
export const LINE = '#1a0f1c';
export type Who = 'jesus' | 'man' | 'pharisee' | 'disciple';
export type Eyes = 'open' | 'narrow' | 'wide' | 'closed' | 'glint';
type Pal = {skin: string; shade: string; hair: string; hairHi: string; iris: string; cloth: string; clothShade: string; mantle?: string};
const PAL: Record<Who, Pal> = {
  jesus: {skin: '#E8AD84', shade: '#B4705A', hair: '#3A2219', hairHi: '#6E4430', iris: '#7A4320', cloth: '#E3D5BA', clothShade: '#A99A82', mantle: '#8A2E2A'},
  man: {skin: '#D9A07A', shade: '#A4664F', hair: '#221713', hairHi: '#4A3226', iris: '#3E2A1E', cloth: '#6F6A86', clothShade: '#47425E'},
  pharisee: {skin: '#C58E6C', shade: '#80503E', hair: '#2A2420', hairHi: '#4A4038', iris: '#2A1A12', cloth: '#E8E2D2', clothShade: '#9C9484', mantle: '#2E4A7A'},
  disciple: {skin: '#D69A6C', shade: '#9A5E44', hair: '#2E1C14', hairHi: '#5A3A28', iris: '#4A2A18', cloth: '#7A5A3A', clothShade: '#4E3824'},
};
const lerpHex = (a: string, b: string, p: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = h(a), y = h(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * p).toString(16).padStart(2, '0')).join('');
};
let uid = 0;

const FACE = 'M -112 -70 Q -122 40 -84 108 Q -48 160 0 176 Q 48 160 84 108 Q 122 40 112 -70 Q 100 -178 0 -186 Q -100 -178 -112 -70 Z';

/** Anime head + shoulders. Light comes from `light` side (-1 left / 1 right) with a coloured rim. `night` darkens. */
export const AnimeHead: React.FC<{who: Who; eyes?: Eyes; mouth?: 'flat' | 'open' | 'smile' | 'grit' | 'frown'; brow?: number; look?: [number, number]; light?: number; rim?: string; night?: number; tear?: number; hood?: boolean; t?: number; blink?: boolean; id?: string}> = ({who, eyes = 'open', mouth = 'flat', brow = 0, look = [0, 0], light = -1, rim = '#FFB45A', night = 0, tear = 0, hood, t = 0, blink, id}) => {
  const P0 = PAL[who];
  const dk = (c: string, k = 1) => lerpHex(c, '#1c1430', night * 0.55 * k);
  const P = {...P0, skin: dk(P0.skin), shade: dk(P0.shade), hair: dk(P0.hair), hairHi: dk(P0.hairHi), cloth: dk(P0.cloth), clothShade: dk(P0.clothShade), mantle: P0.mantle ? dk(P0.mantle) : undefined};
  const cid = React.useMemo(() => id ?? `ah${uid++}`, [id]);
  const isHood = hood ?? who === 'pharisee';
  const ex = 54, ey = 6;
  const sway = Math.sin(t * 1.3) * 3;
  const shut = blink || eyes === 'closed';
  const eye = (s: number) => {
    const cx = s * ex, cy = ey;
    const ix = cx + look[0] * 7, iy = cy + 4 + look[1] * 5;
    if (shut) return <path key={s} d={`M ${cx - 34} ${cy + 2} Q ${cx} ${cy + 16} ${cx + 34} ${cy + 2}`} fill="none" stroke={LINE} strokeWidth={7} strokeLinecap="round" />;
    if (eyes === 'glint') return <g key={s}><path d={`M ${cx - 36} ${cy - 2} L ${cx + 36} ${cy - 10} L ${cx + 30} ${cy + 6} L ${cx - 32} ${cy + 8} Z`} fill="#0b0610" /><ellipse cx={ix} cy={cy} rx={9} ry={4} fill="#FFE7A0" /><circle cx={ix} cy={cy} r={18} fill="#FFD27A" opacity={0.35} /></g>;
    const wide = eyes === 'wide';
    const narrow = eyes === 'narrow';
    const ry = wide ? 18 : 24, rx = wide ? 14 : 18;
    return (
      <g key={s}>
        <path d={`M ${cx - 36} ${cy} Q ${cx} ${cy - 30} ${cx + 36} ${cy - 2} Q ${cx + 30} ${cy + 30} ${cx} ${cy + 32} Q ${cx - 30} ${cy + 30} ${cx - 36} ${cy} Z`} fill="#FBF3E8" />
        <clipPath id={`${cid}e${s}`}><path d={`M ${cx - 36} ${cy} Q ${cx} ${cy - 30} ${cx + 36} ${cy - 2} Q ${cx + 30} ${cy + 30} ${cx} ${cy + 32} Q ${cx - 30} ${cy + 30} ${cx - 36} ${cy} Z`} /></clipPath>
        <g clipPath={`url(#${cid}e${s})`}>
          <ellipse cx={ix} cy={iy} rx={rx} ry={ry} fill={P.iris} />
          <ellipse cx={ix} cy={iy - ry * 0.45} rx={rx} ry={ry * 0.55} fill={LINE} opacity={0.45} />
          <ellipse cx={ix} cy={iy + 2} rx={rx * 0.45} ry={ry * 0.5} fill={LINE} />
          <circle cx={ix - rx * 0.35} cy={iy - ry * 0.35} r={wide ? 4 : 6} fill="#fff" />
          <circle cx={ix + rx * 0.4} cy={iy + ry * 0.35} r={3} fill="#fff" opacity={0.8} />
          {narrow ? <rect x={cx - 40} y={cy - 34} width={80} height={30} fill={P.skin} /> : null}
        </g>
        <path d={`M ${cx - 40} ${cy + (narrow ? 8 : 2)} Q ${cx} ${cy - (narrow ? 8 : 30)} ${cx + 38} ${cy - (narrow ? 2 : 4)} L ${cx + 44 * s * s} ${cy - (narrow ? 4 : 10)}`} fill="none" stroke={LINE} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${cx - 20} ${cy + 33} Q ${cx} ${cy + 36} ${cx + 22} ${cy + 30}`} fill="none" stroke={LINE} strokeWidth={3} strokeLinecap="round" />
        {tear > 0 && s === -light ? <path d={`M ${cx + 12} ${cy + 30} Q ${cx + 18} ${cy + 30 + 50 * tear} ${cx + 10} ${cy + 40 + 70 * tear}`} fill="none" stroke="#CFF4FF" strokeWidth={5} strokeLinecap="round" opacity={0.9} /> : null}
      </g>
    );
  };
  let m: React.ReactNode;
  const my = 118;
  switch (mouth) {
    case 'open': m = <path d={`M -20 ${my - 4} Q 0 ${my - 8} 20 ${my - 4} Q 14 ${my + 18} 0 ${my + 18} Q -14 ${my + 18} -20 ${my - 4} Z`} fill="#4a1a1a" stroke={LINE} strokeWidth={4} />; break;
    case 'smile': m = <path d={`M -24 ${my - 4} Q 0 ${my + 10} 24 ${my - 4}`} fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round" />; break;
    case 'grit': m = <g><path d={`M -26 ${my - 4} L 26 ${my - 6} L 22 ${my + 8} L -22 ${my + 8} Z`} fill="#F3EBDD" stroke={LINE} strokeWidth={4} strokeLinejoin="round" /><line x1={-24} y1={my + 2} x2={24} y2={my + 1} stroke={LINE} strokeWidth={2} /></g>; break;
    case 'frown': m = <path d={`M -20 ${my + 4} Q 0 ${my - 6} 20 ${my + 4}`} fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round" />; break;
    default: m = <line x1={-16} y1={my} x2={16} y2={my - 1} stroke={LINE} strokeWidth={5} strokeLinecap="round" />;
  }
  const strands = (n: number, x0: number, x1: number, y0: number, len: number, jit: number) => Array.from({length: n}).map((_, i) => {
    const xa = x0 + ((x1 - x0) * i) / n, xb = x0 + ((x1 - x0) * (i + 1)) / n;
    const tip = (xa + xb) / 2 + (((i * 37) % 7) - 3) * jit + sway;
    return `L ${xa} ${y0} L ${tip} ${y0 + len * (0.75 + ((i * 53) % 5) * 0.08)} L ${xb} ${y0}`;
  }).join(' ');
  return (
    <g>
      {/* back hair / hood */}
      {who === 'jesus' ? <path d={`M -150 -90 Q -170 -230 0 -232 Q 170 -230 150 -90 L 168 200 ${strands(8, 168, -168, 200, 70, 6).replace(/^L/, 'L')} Z`} fill={P.hair} stroke={LINE} strokeWidth={6} strokeLinejoin="round" /> : null}
      {isHood ? <path d="M -190 330 Q -200 -80 -120 -200 Q 0 -280 120 -200 Q 200 -80 190 330 Z" fill={P.mantle ?? P.cloth} stroke={LINE} strokeWidth={6} /> : null}
      {/* neck + shoulders */}
      <path d="M -46 110 L -50 230 L 50 230 L 46 110 Z" fill={P.shade} stroke={LINE} strokeWidth={5} />
      <path d={`M -300 520 Q -290 300 -150 250 Q -60 222 0 240 Q 60 222 150 250 Q 290 300 300 520 Z`} fill={P.cloth} stroke={LINE} strokeWidth={6} />
      <path d={`M ${light > 0 ? -300 : 300} 520 Q ${light > 0 ? -290 : 290} 300 ${light > 0 ? -150 : 150} 250 L ${light > 0 ? -60 : 60} 300 L ${light > 0 ? -120 : 120} 520 Z`} fill={P.clothShade} opacity={0.8} />
      <path d="M -60 236 L 0 300 L 60 236" fill="none" stroke={LINE} strokeWidth={5} />
      {P.mantle && !isHood ? <path d={`M 300 520 Q 290 300 150 250 Q 110 240 90 250 Q 170 330 140 520 Z`} fill={P.mantle} stroke={LINE} strokeWidth={6} /> : null}
      {/* face */}
      <clipPath id={`${cid}f`}><path d={FACE} /></clipPath>
      <path d={FACE} fill={P.skin} />
      <g clipPath={`url(#${cid}f)`}>
        <path d={light < 0 ? 'M 30 -200 Q 60 -40 20 60 Q 10 120 -10 200 L 200 200 L 200 -200 Z' : 'M -30 -200 Q -60 -40 -20 60 Q -10 120 10 200 L -200 200 L -200 -200 Z'} fill={P.shade} opacity={0.75} />
        <rect x={-130} y={-200} width={260} height={90} fill={P.shade} opacity={isHood ? 0.85 : 0.25} />
        <path d={light < 0 ? 'M -120 -100 Q -128 40 -86 110 L -108 110 L -130 -100 Z' : 'M 120 -100 Q 128 40 86 110 L 108 110 L 130 -100 Z'} fill={rim} opacity={0.85} />
      </g>
      <path d={FACE} fill="none" stroke={LINE} strokeWidth={7} strokeLinejoin="round" />
      {/* ears */}
      {[-1, 1].map((s) => <path key={s} d={`M ${s * 110} -10 Q ${s * 136} 0 ${s * 128} 40 Q ${s * 118} 60 ${s * 106} 50`} fill={s === light ? P.skin : P.shade} stroke={LINE} strokeWidth={5} />)}
      {/* nose */}
      <path d={`M ${-light * 4} 40 L ${-light * 16} 82 L ${light * 2} 84`} fill="none" stroke={LINE} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M ${-light * 6} 46 L ${-light * 16} 80 L ${-light * 4} 80 Z`} fill={P.shade} opacity={0.8} />
      {[-1, 1].map(eye)}
      {/* brows */}
      {[-1, 1].map((s) => <path key={'b' + s} d={`M ${s * 20} ${-40 + brow * 10} Q ${s * 50} ${-56 - brow * 4} ${s * 92} ${-48 - brow * 10}`} fill="none" stroke={LINE} strokeWidth={10} strokeLinecap="round" />)}
      {m}
      {/* beard */}
      {who === 'jesus' || who === 'pharisee' ? (
        <path d={`M -104 40 Q -100 140 -40 176 L -28 196 L -10 184 L 0 204 L 12 184 L 30 196 L 42 176 Q 100 140 104 40 Q 90 110 50 128 Q 26 104 0 104 Q -26 104 -50 128 Q -90 110 -104 40 Z`} fill={who === 'pharisee' ? '#3A3430' : P.hair} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
      ) : null}
      {who === 'jesus' || who === 'pharisee' ? <path d="M -40 100 Q 0 86 40 100 Q 20 108 0 104 Q -20 108 -40 100 Z" fill={who === 'pharisee' ? '#3A3430' : P.hair} stroke={LINE} strokeWidth={4} /> : null}
      {/* front hair */}
      {!isHood ? (
        <path d={`M -126 -40 Q -140 -200 0 -206 Q 140 -200 126 -40 L 120 -60 ${strands(9, 120, -120, -110, 70, who === 'man' ? 10 : 5)} Z`} fill={P.hair} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
      ) : (
        <path d="M -150 -40 Q -160 -230 0 -234 Q 160 -230 150 -40 Q 120 -150 0 -150 Q -120 -150 -150 -40 Z" fill={P.mantle ?? P.cloth} stroke={LINE} strokeWidth={6} />
      )}
      {!isHood ? <path d={`M -70 -170 Q -20 -190 40 -176`} fill="none" stroke={P.hairHi} strokeWidth={8} strokeLinecap="round" opacity={0.8} /> : null}
    </g>
  );
};

/** A hand, wrist at (0,0), fingers pointing up (-y). withered: 0 = healthy, 1 = withered. */
export const Hand: React.FC<{withered: number; curl?: number; spread?: number; skin?: string; t?: number; sleeve?: string}> = ({withered: w, curl: c0, spread = 1, skin = '#D9A07A', t = 0, sleeve = '#6F6A86'}) => {
  const cw = c0 ?? w;
  const col = lerpHex(skin, '#8E8270', w * 0.85);
  const shade = lerpHex(col, '#2a1a20', 0.35);
  const rad = (d: number) => (d * Math.PI) / 180;
  const fingers = [-24, -8, 8, 24].map((a, i) => {
    const base: [number, number] = [-42 + i * 28, -150];
    const ang = a * spread * (1 - cw * 0.5);
    const curl = 10 + cw * 62 + Math.sin(t * 9 + i) * w * 3;
    const L1 = (i === 0 || i === 3 ? 44 : 54) * (1 - w * 0.2), L2 = (i === 0 || i === 3 ? 36 : 44) * (1 - w * 0.25);
    const p1: [number, number] = [base[0] + Math.sin(rad(ang)) * L1, base[1] - Math.cos(rad(ang)) * L1];
    const a2 = ang + curl * (i < 2 ? 1 : 0.9);
    const p2: [number, number] = [p1[0] + Math.sin(rad(a2)) * L2, p1[1] - Math.cos(rad(a2)) * L2 * (1 - w * 0.2)];
    return [base, p1, p2];
  });
  const thumb: [number, number][] = [[-56, -70], [-96 + cw * 30, -118 + cw * 10], [-104 + cw * 52, -150 + cw * 30]];
  const width = 26 - w * 8;
  const S_ = (pts: [number, number][], key: string | number) => (
    <g key={key}>
      <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={LINE} strokeWidth={width + 10} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={col} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  return (
    <g>
      <path d="M -60 120 L -52 0 L 52 0 L 60 120 Z" fill={sleeve} stroke={LINE} strokeWidth={6} />
      <path d="M -50 0 Q -64 -80 -56 -150 L 56 -150 Q 64 -80 50 0 Z" fill={col} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
      <path d="M 10 -150 L 56 -150 Q 64 -80 50 0 L 20 0 Q 34 -70 10 -150 Z" fill={shade} opacity={0.6} />
      {fingers.map((f, i) => S_(f as [number, number][], i))}
      {S_(thumb, 't')}
      {w > 0.2 ? <g opacity={w}>{[[-30, -40], [0, -60], [24, -36], [-14, -100]].map((q, i) => <path key={i} d={`M ${q[0] - 14} ${q[1]} q 14 -6 28 0`} fill="none" stroke={LINE} strokeWidth={3} />)}</g> : null}
    </g>
  );
};

/** one wheat stalk rooted at (x, y), height h, swaying */
export const Wheat: React.FC<{x: number; y: number; h: number; t: number; s?: number; col?: string; dark?: boolean}> = ({x, y, h, t, s = 1, col = '#F2B64A', dark}) => {
  const sw = Math.sin(t * 1.4 + x * 0.013) * 10 * s;
  const tx = x + sw, ty = y - h;
  const c = dark ? '#2a1830' : col;
  return (
    <g>
      <path d={`M ${x} ${y} Q ${x + sw * 0.3} ${y - h * 0.6} ${tx} ${ty}`} fill="none" stroke={dark ? '#2a1830' : '#B57A2E'} strokeWidth={4 * s} />
      {Array.from({length: 7}).map((_, i) => [-1, 1].map((d) => (
        <g key={i + '' + d}>
          <ellipse cx={tx + d * 7 * s + sw * 0.05 * i} cy={ty - i * 13 * s} rx={7 * s} ry={11 * s} transform={`rotate(${d * 22} ${tx + d * 7 * s} ${ty - i * 13 * s})`} fill={c} stroke={dark ? 'none' : LINE} strokeWidth={2} />
          <line x1={tx + d * 9 * s} y1={ty - i * 13 * s - 6 * s} x2={tx + d * 26 * s} y2={ty - i * 13 * s - 34 * s} stroke={c} strokeWidth={1.5 * s} />
        </g>
      )))}
    </g>
  );
};

/** slender robed silhouette, feet at (x, y), height ~520*s. */
export const Sil: React.FC<{x: number; y: number; s?: number; t?: number; walk?: number; hood?: boolean; col?: string; flip?: boolean; rim?: string; staff?: boolean; lean?: number}> = ({x, y, s = 1, t = 0, walk = 0, hood, col = '#140b18', flip, rim, staff, lean = 0}) => {
  const bob = walk ? Math.abs(Math.sin(t * Math.PI * 1.6)) * 8 * walk : 0;
  const hem = walk ? Math.sin(t * Math.PI * 1.6) * 16 * walk : 0;
  return (
    <g transform={`translate(${x} ${y - bob * s}) scale(${(flip ? -1 : 1) * s} ${s}) rotate(${lean})`}>
      {staff ? <line x1={70} y1={0} x2={86} y2={-560} stroke={col} strokeWidth={10} /> : null}
      <path d={`M ${-70 + hem} 0 L -58 -300 Q -60 -380 0 -400 Q 60 -380 58 -300 L ${74 + hem} 0 Z`} fill={col} />
      <path d={`M -58 -360 Q -110 -330 -96 -200 L -64 -210 Z M 58 -360 Q 104 -320 92 -210 L 62 -220 Z`} fill={col} />
      {hood ? <path d="M -52 -400 Q -50 -500 0 -506 Q 50 -500 52 -400 Q 30 -380 0 -380 Q -30 -380 -52 -400 Z" fill={col} /> : <circle cx={0} cy={-440} r={42} fill={col} />}
      {!hood ? <path d="M -46 -450 Q -60 -380 -44 -340 L 44 -340 Q 60 -380 46 -450 Z" fill={col} /> : null}
      {rim ? <path d={`M 58 -300 Q 60 -380 0 -400 M ${74 + hem} 0 L 58 -300`} fill="none" stroke={rim} strokeWidth={4} opacity={0.8} /> : null}
    </g>
  );
};
