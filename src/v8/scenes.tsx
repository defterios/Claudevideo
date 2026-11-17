import React from 'react';
import {Easing, interpolate} from 'remotion';
import {Bust, Fig, INK, JESUS, JOHN, Look, P, SHADOW, mix, walk} from './fig';

export type SP = {t: number; dur: number; w: (word: string, fallback?: number) => number; segs: number[]; wide: boolean; W: number; H: number};
export type C3 = {x: number; y: number; z: number; rot?: number};
export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const k = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
export const ko = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
export const lin = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], cl);
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const BIG = 3200;
export const FOOT = 300;

export const Cam: React.FC<{c: C3; p: SP; children: React.ReactNode}> = ({c, p, children}) => (
  <g transform={`translate(${p.W / 2} ${p.H / 2}) scale(${(p.wide ? 0.78 : 1) * c.z}) rotate(${c.rot ?? 0}) translate(${-c.x} ${-c.y})`}>{children}</g>
);
/** parallax: d=1 moves with the world, d=0 is glued to the camera */
export const par = (c: C3, d: number) => `translate(${c.x * (1 - d)} ${c.y * (1 - d)})`;
export const Fill: React.FC<{fill: string; o?: number}> = ({fill, o = 1}) => <rect x={-BIG} y={-BIG} width={BIG * 2} height={BIG * 2} fill={fill} opacity={o} />;
export const Ground: React.FC<{y?: number; fill: string; line?: boolean}> = ({y = FOOT, fill, line = true}) => (
  <g><rect x={-BIG} y={y} width={BIG * 2} height={BIG} fill={fill} />{line ? <line x1={-BIG} y1={y} x2={BIG} y2={y} stroke={INK} strokeWidth={8} /> : null}</g>
);
export const Glow: React.FC<{x: number; y: number; r: number; o?: number; id?: string}> = ({x, y, r, o = 1, id = 'gGold'}) => <circle cx={x} cy={y} r={r} fill={`url(#${id})`} opacity={o} />;
export const Mesa: React.FC<{x: number; y: number; w: number; h: number; fill: string; shade?: string; stroke?: boolean}> = ({x, y, w, h, fill, shade, stroke = true}) => (
  <g>
    <path d={`M ${x - w / 2 - h * 0.22} ${y} L ${x - w / 2} ${y - h} L ${x + w / 2} ${y - h} L ${x + w / 2 + h * 0.22} ${y} Z`} fill={fill} stroke={stroke ? INK : 'none'} strokeWidth={7} strokeLinejoin="round" />
    {shade ? <path d={`M ${x + w * 0.12} ${y - h} L ${x + w / 2} ${y - h} L ${x + w / 2 + h * 0.22} ${y} L ${x + w * 0.2} ${y} Z`} fill={shade} opacity={0.6} /> : null}
    {[0.3, 0.55, 0.78].map((f, i) => <line key={i} x1={x - w / 2 - h * 0.22 * f + 6} y1={y - h * (1 - f)} x2={x + w / 2 + h * 0.22 * f - 6} y2={y - h * (1 - f)} stroke={INK} strokeWidth={3} opacity={0.22} />)}
  </g>
);
export const Rock: React.FC<{x: number; y: number; s?: number; fill?: string}> = ({x, y, s = 1, fill = '#B79A7C'}) => (
  <path d={`M ${x - 46 * s} ${y} Q ${x - 50 * s} ${y - 40 * s} ${x - 14 * s} ${y - 52 * s} Q ${x + 34 * s} ${y - 58 * s} ${x + 48 * s} ${y - 18 * s} L ${x + 52 * s} ${y} Z`} fill={fill} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
);
export const Stars: React.FC<{n?: number; t: number; o?: number}> = ({n = 90, t, o = 1}) => (
  <g opacity={o}>{Array.from({length: n}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 3000} cy={(rnd(i + 99) - 0.5) * 2400 - 300} r={1.5 + rnd(i + 7) * 3.2} fill="#fff" opacity={0.45 + 0.5 * Math.sin(t * (1.5 + rnd(i) * 3) + i)} />)}</g>
);
export const Sun: React.FC<{x: number; y: number; r: number; fill?: string}> = ({x, y, r, fill = '#FFF1C9'}) => (<g><Glow x={x} y={y} r={r * 4.5} o={0.75} /><circle cx={x} cy={y} r={r} fill={fill} /></g>);
export const Wind: React.FC<{t: number; o: number; n?: number; col?: string}> = ({t, o, n = 12, col = '#fff'}) => (
  <g opacity={o}>{Array.from({length: n}).map((_, i) => { const sp = 900 + rnd(i) * 900; const x = (((t * sp + rnd(i + 3) * 3000) % 3000) + 3000) % 3000 - 1500; const y = (rnd(i + 11) - 0.5) * 1700; return <line key={i} x1={-x} y1={y} x2={-x + 150 + rnd(i) * 220} y2={y} stroke={col} strokeWidth={4} strokeLinecap="round" opacity={0.25 + rnd(i + 5) * 0.4} />; })}</g>
);
export const Dust: React.FC<{t: number; o: number; col?: string; n?: number; up?: boolean}> = ({t, o, col = '#F5D9A8', n = 40, up}) => (
  <g opacity={o}>{Array.from({length: n}).map((_, i) => { const ph = (t * (0.12 + rnd(i) * 0.2) + rnd(i + 2)) % 1; const x = (rnd(i + 5) - 0.5) * 2400 + Math.sin(t + i) * 30; const y = up ? FOOT - ph * 900 : (rnd(i + 9) - 0.5) * 1800 + Math.sin(t * 0.7 + i) * 20; return <circle key={i} cx={x} cy={y} r={2 + rnd(i + 1) * 4} fill={col} opacity={up ? (1 - ph) * 0.8 : 0.35} />; })}</g>
);

export const GREY = (i: number): Look => ({skin: ['#B9997F', '#A98C74', '#C2A389'][i % 3], hair: ['#3a302c', '#2e2826', '#4a3e38'][i % 3], tunic: ['#8C8377', '#7B7469', '#9A9184'][i % 3], sash: '#5c554d', style: i % 2 ? 'short' : 'long', beard: i % 2 === 0});
export const Hammer = (<g><rect x={-6} y={-8} width={12} height={92} rx={4} fill="#7a5233" stroke={INK} strokeWidth={5} /><rect x={-28} y={74} width={56} height={32} rx={5} fill="#6f7178" stroke={INK} strokeWidth={6} /></g>);

/* ------------------------------------------------------------------ 1. river */
const River: React.FC<SP> = (p) => {
  const {t} = p;
  const cutB = p.w('nobody') - 0.18, cutC = p.segs[1] - 0.12;
  if (t < cutB) {
    // carpenter's shop: open on a close-up, ease out
    const z = lerp(2.5, 1.2, ko(t, 0.2, 2.4));
    const c: C3 = {x: lerp(30, 60, ko(t, 0.2, 2.4)), y: lerp(-70, 60, ko(t, 0.2, 2.4)), z};
    const ph = ((t - 0.62) / 0.62) % 1;
    const sw = t < 0.3 ? 0 : ph < 0 ? 0 : ph < 0.72 ? k(ph, 0, 0.72) : 1 - ko(ph, 0.72, 1);
    const hit = t > 0.62 && (ph < 0.14 || ph > 0.97);
    return (
      <Cam c={c} p={p}>
        <Fill fill="#A97C52" />
        <g transform={par(c, 0.85)}>
          {Array.from({length: 9}).map((_, i) => <rect key={i} x={-1700 + i * 400} y={-BIG} width={46} height={BIG * 2} fill="#8E6540" opacity={0.55} />)}
          <rect x={-700} y={-420} width={330} height={380} rx={10} fill="#F7D9A0" stroke={INK} strokeWidth={9} />
          <polygon points="-700,-40 -370,-40 -40,520 -880,520" fill="#F7D9A0" opacity={0.16} />
          {[0, 1, 2, 3].map((i) => <g key={i}><rect x={420 + i * 110} y={-360} width={20} height={170 + (i % 2) * 40} rx={5} fill="#6f4a2d" stroke={INK} strokeWidth={5} /></g>)}
          <rect x={380} y={-380} width={500} height={22} fill="#5c3d25" stroke={INK} strokeWidth={6} />
        </g>
        <Ground fill="#7C5636" />
        <Fig x={-40} y={FOOT} pose={mix(P.hammerDn, P.hammerUp, sw)} look={JESUS} t={t} face={{eyes: 'half', mouth: 'flat'}} hold={Hammer} />
        {/* bench + plank */}
        <rect x={60} y={132} width={470} height={36} rx={6} fill="#C99A62" stroke={INK} strokeWidth={8} />
        <rect x={100} y={168} width={34} height={132} fill="#8a5f3a" stroke={INK} strokeWidth={7} /><rect x={456} y={168} width={34} height={132} fill="#8a5f3a" stroke={INK} strokeWidth={7} />
        <rect x={86} y={104} width={380} height={28} rx={4} fill="#E3BE86" stroke={INK} strokeWidth={7} />
        {hit ? <g transform="translate(150 100)">{Array.from({length: 8}).map((_, i) => <line key={i} x1={Math.cos(i * 0.78) * 16} y1={Math.sin(i * 0.78) * 16} x2={Math.cos(i * 0.78) * 46} y2={Math.sin(i * 0.78) * 46} stroke="#FFE9A8" strokeWidth={6} strokeLinecap="round" />)}</g> : null}
      </Cam>
    );
  }
  const dawn = (c: C3) => (
    <>
      <Fill fill="url(#skyDawn)" />
      <g transform={par(c, 0.25)}><Sun x={520} y={-90} r={70} /><path d="M -1700 120 Q -1200 -60 -700 60 Q -300 -80 200 40 Q 700 -70 1200 50 Q 1500 0 1800 80 L 1800 400 L -1700 400 Z" fill="#6D7F8C" opacity={0.75} /></g>
      <g transform={par(c, 0.55)}><path d="M -1700 190 Q -1000 60 -400 170 Q 300 60 900 160 Q 1400 90 1800 180 L 1800 500 L -1700 500 Z" fill="#55705F" stroke={INK} strokeWidth={6} /></g>
    </>
  );
  const Water: React.FC<{y: number}> = ({y}) => (
    <g>
      <rect x={-BIG} y={y} width={BIG * 2} height={BIG} fill="#3E7480" opacity={0.9} />
      <line x1={-BIG} y1={y} x2={BIG} y2={y} stroke="#BFE6E0" strokeWidth={7} />
      {Array.from({length: 26}).map((_, i) => { const yy = y + 40 + (i % 9) * 95 + rnd(i) * 30; const x = (rnd(i + 4) - 0.5) * 2600 + Math.sin(t * 1.2 + i) * 40; return <path key={i} d={`M ${x} ${yy} q 40 -14 80 0 t 80 0`} fill="none" stroke="#9FD3CF" strokeWidth={5} strokeLinecap="round" opacity={0.55} />; })}
    </g>
  );
  if (t < cutC) {
    // the queue on the bank: nobody looks at him
    const u = t - cutB;
    const c: C3 = {x: lerp(-60, 0, u / 1.8), y: 30, z: lerp(1.05, 1.22, u / 1.8)};
    return (
      <Cam c={c} p={p}>
        {dawn(c)}
        <Ground fill="#9B8B6B" />
        {[-620, -330, 300, 590, 880, -910].map((x, i) => <Fig key={i} x={x} y={FOOT} pose={P.stand} look={GREY(i)} t={t + i} face={{eyes: 'half', mouth: i % 2 ? 'flat' : 'frown', look: [1, 0]}} scale={0.94} />)}
        <Fig x={0} y={FOOT} pose={P.stand} look={JESUS} t={t} face={{eyes: 'half', mouth: 'flat', look: [1, 0]}} />
      </Cam>
    );
  }
  const u = t - cutC;
  const c: C3 = {x: lerp(-80, 60, k(u, 0, 2.8)), y: 70, z: lerp(0.95, 1.12, k(u, 0, 2.8))};
  const jx = lerp(-520, -60, k(u, 0, 2.3));
  const depth = lerp(0, 150, k(u, 0.2, 1.7));
  return (
    <Cam c={c} p={p}>
      {dawn(c)}
      <path d={`M ${-BIG} 250 L -560 250 Q -420 255 -330 330 L ${-BIG} 330 Z`} fill="#9B8B6B" stroke={INK} strokeWidth={8} />
      {[-860, -1090].map((x, i) => <Fig key={i} x={x} y={250} pose={P.stand} look={GREY(i)} t={t + i} face={{eyes: 'half', look: [1, 0]}} scale={0.9} />)}
      <Fig x={jx} y={FOOT + depth} pose={u < 2.3 ? walk(t, 1.3) : P.stand} look={JESUS} t={t} face={{eyes: 'half', mouth: 'flat', look: [1, 0]}} />
      <Fig x={230} y={FOOT + 150} flip pose={mix(P.stand, P.armsOpen, k(u, 1.0, 2.0))} look={JOHN} t={t} face={{eyes: u > 0.9 ? 'wide' : 'open', mouth: u > 0.9 ? 'open' : 'flat', brow: -0.5}} />
      <Water y={262} />
      {[jx, 230].map((x, i) => <ellipse key={i} cx={x} cy={270} rx={110 + Math.sin(t * 5 + i) * 14} ry={16} fill="none" stroke="#DDF5F0" strokeWidth={5} opacity={i === 0 ? k(u, 0.3, 0.9) : 0.9} />)}
    </Cam>
  );
};

/* ------------------------------------------------------------------ 2. the sky tears */
const Sky: React.FC<SP> = (p) => {
  const {t} = p;
  const rip = p.w('tore') + 0.28; // the boom
  const o = ko(t, rip, rip + 0.5);
  const sh = t > rip ? Math.exp(-(t - rip) * 3) * 26 : 0;
  const c: C3 = {x: Math.sin(t * 70) * sh, y: lerp(110, -330, k(t, 0.2, rip + 0.2)) + Math.cos(t * 83) * sh, z: lerp(1.15, 0.86, k(t, 0.2, rip + 0.4))};
  const rise = ko(t, 0.15, 0.8);
  const tear = Array.from({length: 15}).map((_, i) => { const y = -1500 + i * 95; const wdt = (18 + rnd(i) * 90) * o * (1 - Math.abs(i - 7) / 9); const j = (rnd(i + 20) - 0.5) * 90; return [j - wdt, j + wdt, y]; });
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skySlate)" />
      <Fill fill="#FFE8B0" o={o * 0.35} />
      <g transform={par(c, 0.4)}>
        {o > 0 ? <g>
          <Glow x={0} y={-800} r={1100 * o} o={0.9} id="gWhite" />
          {Array.from({length: 9}).map((_, i) => <polygon key={i} points={`${-30 + i * 8},-900 ${30 + i * 8},-900 ${(i - 4) * 330 + 130},1300 ${(i - 4) * 330 - 130},1300`} fill="#FFF3C4" opacity={0.10 * o + 0.03 * Math.sin(t * 9 + i)} />)}
          <path d={'M ' + tear.map((q) => `${q[0]} ${q[2]}`).join(' L ') + ' L ' + tear.slice().reverse().map((q) => `${q[1]} ${q[2]}`).join(' L ') + ' Z'} fill="#fff" stroke="#FFD76A" strokeWidth={14} strokeLinejoin="round" />
        </g> : null}
        {Array.from({length: 9}).map((_, i) => { const u = Math.max(0, t - rip); const x = (rnd(i) - 0.5) * 900 + (rnd(i) - 0.5) * 1500 * u, y = -250 - rnd(i + 3) * 300 - u * 420; const f = Math.sin(t * 22 + i) * 12; return <path key={i} d={`M ${x - 22} ${y + f} L ${x} ${y} L ${x + 22} ${y + f}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.8} />; })}
      </g>
      <g transform={par(c, 0.55)}><path d="M -1700 210 Q -900 90 -300 190 Q 400 80 1000 180 Q 1400 110 1800 190 L 1800 500 L -1700 500 Z" fill="#3F5560" /></g>
      <Fig x={0} y={FOOT + lerp(520, 150, rise)} pose={mix(P.stand, P.armsOpen, o * 0.6)} look={JESUS} t={t} face={{eyes: t > rip ? 'wide' : t < 0.9 ? 'closed' : 'open', mouth: t > rip ? 'open' : 'flat', look: [0, -1], brow: -0.4}} />
      <rect x={-BIG} y={262} width={BIG * 2} height={BIG} fill={o > 0 ? '#5C9AA0' : '#35606B'} opacity={0.92} />
      <line x1={-BIG} y1={262} x2={BIG} y2={262} stroke="#CDEFE8" strokeWidth={7} />
      {[0, 1, 2, 3].map((i) => { const u = (t - 0.3 - i * 0.28) * 0.9; const u2 = t - rip - i * 0.12; const r = u2 > 0 ? u2 * 1500 : Math.max(0, u) * 420; return r > 0 ? <ellipse key={i} cx={0} cy={272} rx={110 + r} ry={16 + r * 0.07} fill="none" stroke="#E6FBF6" strokeWidth={6} opacity={Math.max(0, 0.9 - r / 1700)} /> : null; })}
      {t > rip && t < rip + 0.12 ? <Fill fill="#fff" o={0.85} /> : null}
    </Cam>
  );
};

/* ------------------------------------------------------------------ 3. the voice */
const Voice: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: lerp(-30, -60, t / p.dur), z: lerp(1.5, 1.85, t / p.dur)};
  const land = ko(t, 0.3, p.w('you'));
  const dx = lerp(420, 150, land), dy = lerp(-900, -205, land);
  const open = t > p.w('son');
  const pulse = ['you', 'are', 'my', 'son', 'i', 'love'].reduce((a, wd) => Math.max(a, Math.exp(-Math.max(0, t - p.w(wd)) * 7) * (t >= p.w(wd) ? 1 : 0)), 0);
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyGoldDawn)" />
      {Array.from({length: 7}).map((_, i) => <polygon key={i} points={`${-60 + i * 20},-1700 ${60 + i * 20},-1700 ${(i - 3) * 360 + 170},1300 ${(i - 3) * 360 - 170},1300`} fill="#FFF6D0" opacity={0.13 + 0.04 * Math.sin(t * 5 + i) + pulse * 0.08} />)}
      <Bust x={0} y={0} look={{...JESUS, glow: '#FFE7A0'}} t={t} scale={1 + pulse * 0.012} face={{eyes: open ? 'open' : 'closed', mouth: t > p.w('love') ? 'smile' : 'flat', look: [0, -1], brow: -0.5}} />
      {/* water drops */}
      {[-52, 38, 70, -20].map((x, i) => { const ph = (t * 0.9 + i * 0.27) % 1; return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${x} ${-70 + ph * 150}) scale(1.5)`} fill="#BFE9F2" stroke={INK} strokeWidth={2.5} opacity={1 - ph} />; })}
      {/* the dove, made of light */}
      <g transform={`translate(${dx} ${dy}) rotate(${lerp(-25, 0, land)})`}>
        <Glow x={0} y={0} r={230 + pulse * 60} o={0.95} id="gWhite" />
        <path d={`M -70 0 Q -20 -34 44 -12 L 82 -22 L 62 4 Q 30 34 -30 22 Z`} fill="#fff" stroke="#FFD76A" strokeWidth={5} strokeLinejoin="round" />
        <path d={`M -20 -8 Q -60 ${-110 + Math.sin(t * 14) * 40 * (1 - land)} 30 -14 Z`} fill="#fff" stroke="#FFD76A" strokeWidth={5} strokeLinejoin="round" />
      </g>
      {[0, 1, 2].map((i) => <ellipse key={i} cx={0} cy={470} rx={260 + i * 190 + pulse * 120} ry={30 + i * 16} fill="none" stroke="#fff" strokeWidth={6} opacity={0.5 - i * 0.13 + pulse * 0.3} />)}
    </Cam>
  );
};

/* ------------------------------------------------------------------ 4. driven out */
const DesertBack: React.FC<{c: C3; t: number; tint?: number}> = ({c}) => (
  <>
    <Fill fill="url(#skyDesert)" />
    <g transform={par(c, 0.12)}><Sun x={-380} y={-560} r={90} fill="#FFFBEA" /></g>
    <g transform={par(c, 0.3)}><Mesa x={-900} y={FOOT} w={520} h={420} fill="#D9A77C" stroke={false} /><Mesa x={380} y={FOOT} w={760} h={560} fill="#D39F74" stroke={false} /><Mesa x={1350} y={FOOT} w={420} h={330} fill="#D9A77C" stroke={false} /></g>
    <g transform={par(c, 0.6)}><Mesa x={-420} y={FOOT} w={380} h={250} fill="#C58A5C" shade="#A56C45" /><Mesa x={980} y={FOOT} w={520} h={340} fill="#C58A5C" shade="#A56C45" /><Mesa x={-1500} y={FOOT} w={460} h={300} fill="#C58A5C" shade="#A56C45" /></g>
  </>
);
const Drive: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = p.w('desert') - 0.2;
  if (t < cut) {
    const scroll = t * 620;
    const mixD = k(t, 0.7, 2.3);
    const c: C3 = {x: scroll, y: 40 + Math.sin(t * 9) * 6, z: 1.12, rot: -2};
    return (
      <Cam c={c} p={p}>
        <Fill fill="url(#skyDawn)" /><Fill fill="url(#skyDesert)" o={mixD} />
        <g transform={par(c, 0.2)}><Sun x={scroll * 0.2 + 300} y={-420} r={80} /></g>
        <g transform={par(c, 0.45)}>
          <path d="M -800 200 Q -200 60 400 180 Q 800 110 1100 200 L 1100 600 L -800 600 Z" fill="#55705F" opacity={1 - mixD} />
          {[900, 1700, 2500, 3300].map((x, i) => <Mesa key={i} x={x * 0.62 + 300} y={FOOT} w={380 + (i % 2) * 180} h={300 + (i % 3) * 110} fill="#C58A5C" shade="#A56C45" />)}
        </g>
        <Ground fill="#9B8B6B" /><rect x={-BIG + scroll} y={FOOT + 4} width={BIG * 2} height={BIG} fill="#E3BD8C" opacity={mixD} />
        {[200, 760, 1250, 1900, 2380].map((x, i) => (x < 900 ? <g key={i}>{[0, 1, 2, 3].map((j) => <line key={j} x1={x + j * 16} y1={FOOT} x2={x + j * 16 + (j - 1.5) * 12} y2={FOOT - 110 - j * 12} stroke="#3F6B4B" strokeWidth={9} strokeLinecap="round" />)}</g> : <Rock key={i} x={x} y={FOOT} s={1 + (i % 2) * 0.6} fill="#C99C73" />))}
        <Fig x={scroll - 40} y={FOOT} pose={mix(walk(t, 2.3), P.stagger, 0.45 + 0.25 * Math.sin(t * 6))} look={JESUS} t={t} face={{eyes: 'wide', mouth: 'open', brow: -0.6, look: [1, 0]}} />
        <g transform={`translate(${scroll} 0)`}><Wind t={t} o={0.9} /></g>
        {/* the push: light at his back */}
        <Glow x={scroll - 330} y={-20} r={420} o={0.55 * (1 - k(t, 1.4, 2.6))} id="gWhite" />
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: 0, y: lerp(-250, -330, u / 1.2), z: lerp(0.5, 0.44, u / 1.2)};
  return (
    <Cam c={c} p={p}>
      <DesertBack c={c} t={t} />
      <Ground fill="#E3BD8C" />
      <path d={`M ${-BIG} 300 L -900 300 L -700 120 L 260 120 L 420 300 L ${BIG} 300 L ${BIG} ${BIG} L ${-BIG} ${BIG} Z`} fill="#B97E52" stroke={INK} strokeWidth={10} />
      <path d="M -40 120 L 60 700 L -10 1500 L 120 1500 L 150 700 L 40 120 Z" fill="#6E4226" opacity={0.6} />
      <Fig x={-520 + u * 140} y={120} pose={walk(t, 1.5)} look={JESUS} t={t} scale={0.5} face={{eyes: 'half'}} />
      <Wind t={t} o={0.6} col="#FFF2D8" />
      <Fill fill="#FFE9C0" o={0.12 + 0.04 * Math.sin(t * 6)} />
    </Cam>
  );
};

/* ------------------------------------------------------------------ 5. forty days */
export const Hyena: React.FC<{x: number; y: number; s?: number; flip?: boolean; t: number; lie?: boolean; dark?: boolean}> = ({x, y, s = 1, flip, t, lie, dark}) => {
  const f = dark ? '#120c14' : '#A58A66';
  const st = dark ? '#000' : INK;
  const leg = (lx: number, ph: number) => lie ? null : <line x1={lx} y1={-60} x2={lx + Math.sin(t * 7 + ph) * 22} y2={0} stroke={st} strokeWidth={18} strokeLinecap="round" />;
  return (
    <g transform={`translate(${x} ${y + (lie ? 38 : 0)}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      {leg(-70, 0)}{leg(60, 2)}{leg(-44, 3.1)}{leg(86, 5)}
      <path d="M -110 -70 Q -90 -150 20 -160 Q 110 -170 130 -110 L 120 -60 Q 20 -40 -110 -60 Z" fill={f} stroke={st} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 96 -150 L 150 -196 L 214 -178 L 232 -140 L 176 -118 L 120 -112 Z" fill={f} stroke={st} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 150 -196 L 150 -236 L 178 -200 Z" fill={f} stroke={st} strokeWidth={7} strokeLinejoin="round" />
      <path d="M -110 -70 Q -150 -60 -140 -20" fill="none" stroke={st} strokeWidth={14} strokeLinecap="round" />
      {dark ? null : [[-40, -120], [10, -130], [50, -112], [-70, -96]].map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={9} fill="#6B553B" />)}
      <circle cx={186} cy={-166} r={dark ? 9 : 6} fill={dark ? '#FFE27A' : INK} />
      {dark ? <circle cx={186} cy={-166} r={30} fill="url(#gGold)" opacity={0.8} /> : null}
    </g>
  );
};
const Fast: React.FC<SP> = (p) => {
  const {t} = p;
  const cutB = p.w('no') - 0.12, cutC = p.w('wild') - 0.2;
  if (t < cutB) {
    // time-lapse: the sun wheels, tally marks pile up
    const day = Math.min(40, Math.floor(1 + (t / cutB) * 39.99));
    const ph = (t * 3.4) % 1;
    const night = ph > 0.5 ? 1 : 0;
    const a = Math.PI * (ph % 0.5) * 2;
    const c: C3 = {x: 0, y: -40, z: 0.92};
    return (
      <Cam c={c} p={p}>
        <Fill fill="url(#skyDesert)" /><Fill fill="url(#skyNight)" o={night * 0.92} />
        {night ? <Stars t={t * 3} n={60} /> : null}
        <g transform={par(c, 0.2)}>{night ? <circle cx={-Math.cos(a) * 900} cy={300 - Math.sin(a) * 900} r={54} fill="#E8ECF5" /> : <Sun x={-Math.cos(a) * 900} y={300 - Math.sin(a) * 900} r={74} />}</g>
        <g transform={par(c, 0.5)}><Mesa x={520} y={FOOT} w={620} h={470} fill={night ? '#3d3350' : '#C58A5C'} shade={night ? '#241d33' : '#A56C45'} /></g>
        <Ground fill={night ? '#4a3d55' : '#E3BD8C'} />
        <Fig x={90} y={FOOT} pose={P.kneel} look={{...JESUS, gaunt: day / 60}} t={t} face={{eyes: 'closed'}} scale={0.92} />
        {/* cave wall with tallies */}
        <path d={`M ${-BIG} ${-BIG} L -230 ${-BIG} Q -330 -200 -260 ${FOOT} L ${-BIG} ${FOOT} Z`} fill={night ? '#2c2438' : '#8E5E3C'} stroke={INK} strokeWidth={9} />
        {Array.from({length: day}).map((_, i) => { const g5 = Math.floor(i / 5), r = i % 5; const gx = -540 + (g5 % 2) * 150, gy = -330 + Math.floor(g5 / 2) * 140; return r < 4 ? <line key={i} x1={gx + r * 28} y1={gy} x2={gx + r * 28} y2={gy + 90} stroke="#F6E2C0" strokeWidth={10} strokeLinecap="round" /> : <line key={i} x1={gx - 18} y1={gy + 76} x2={gx + 104} y2={gy + 14} stroke="#F6E2C0" strokeWidth={10} strokeLinecap="round" />; })}
      </Cam>
    );
  }
  if (t < cutC) {
    const u = (t - cutB) / (cutC - cutB);
    const c: C3 = {x: 0, y: -10, z: lerp(1.55, 1.9, u)};
    return (
      <Cam c={c} p={p}>
        <Fill fill="url(#skyDesert)" /><Sun x={300} y={-520} r={130} fill="#fff" />
        <Bust x={0} y={0} look={{...JESUS, gaunt: lerp(0.55, 1, u)}} t={t} shake={2.5} tilt={4} face={{eyes: 'half', mouth: 'frown', brow: -0.7, look: [0, 1]}} />
        {[-1, 1].map((s) => <path key={s} d={`M ${s * 6} 36 l ${s * 4} 8`} stroke="#6b2a22" strokeWidth={3} />)}
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-BIG} ${-400 + i * 230 + Math.sin(t * 3 + i) * 20} q 200 ${30 * Math.sin(t * 4 + i)} 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0`} fill="none" stroke="#fff" strokeWidth={10} opacity={0.12} />)}
        <Fill fill="#FF9A3C" o={0.14} />
      </Cam>
    );
  }
  const u = t - cutC;
  const c: C3 = {x: lerp(-60, 40, u / 1.6), y: 20, z: 1.05};
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyNight)" /><Stars t={t} />
      <g transform={par(c, 0.2)}><circle cx={420} cy={-520} r={90} fill="#E8ECF5" /><circle cx={420} cy={-520} r={300} fill="url(#gWhite)" opacity={0.4} /></g>
      <g transform={par(c, 0.6)}><Mesa x={-520} y={FOOT} w={900} h={640} fill="#2c2438" shade="#1b1626" /><path d="M -560 300 Q -560 20 -400 0 Q -240 20 -240 300 Z" fill="#0f0b16" stroke={INK} strokeWidth={8} /></g>
      <Ground fill="#3c3148" />
      <Fig x={-250} y={FOOT} pose={P.sit} look={{...JESUS, gaunt: 1, skin: '#B99A8E', tunic: '#A9A3B5'}} t={t} face={{eyes: 'open', look: [1, 0], brow: -0.3}} />
      <g transform={par(c, 1.5)}><Hyena x={lerp(1050, 330, ko(u, 0, 1.5))} y={FOOT + 150} s={1.5} flip t={u < 1.5 ? t : 0} dark /><Hyena x={lerp(-1300, -800, ko(u, 0.2, 1.5))} y={FOOT + 330} s={1.9} t={u < 1.5 ? t + 1 : 1} dark /></g>
    </Cam>
  );
};

/* ------------------------------------------------------------------ 6. bread */
export const Stone: React.FC<{bread: number; t: number}> = ({bread, t}) => (
  <g>
    {bread > 0 ? <Glow x={0} y={0} r={190 * bread} o={0.9} /> : null}
    <path d="M -46 10 Q -52 -30 -10 -38 Q 40 -42 50 -4 Q 52 24 0 28 Q -40 28 -46 10 Z" fill={bread > 0.5 ? '#D99848' : '#9C968E'} stroke={bread > 0.5 ? '#5a2f12' : INK} strokeWidth={7} strokeLinejoin="round" />
    {bread > 0.5 ? <g>{[-22, 0, 22].map((x) => <path key={x} d={`M ${x - 6} -28 q 8 12 12 26`} fill="none" stroke="#8a4f1c" strokeWidth={5} strokeLinecap="round" />)}{[-18, 12].map((x, i) => <path key={i} d={`M ${x} -50 q -14 -22 0 -44 q 14 -22 0 -44`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.3 * Math.sin(t * 6 + i)} transform={`translate(0 ${-((t * 30) % 20)})`} />)}</g> : null}
  </g>
);
const StoneField: React.FC<{c: C3; t: number; dark?: number}> = ({c, t, dark = 0}) => (
  <>
    <Fill fill="url(#skyEmber)" /><Fill fill="#1a0d1c" o={dark * 0.55} />
    <g transform={par(c, 0.2)}><Sun x={-520} y={150} r={86} fill="#FFD9A0" /></g>
    <g transform={par(c, 0.5)}><Mesa x={700} y={FOOT} w={640} h={420} fill="#8A4B3A" shade="#5E2F28" /><Mesa x={-1100} y={FOOT} w={520} h={300} fill="#8A4B3A" shade="#5E2F28" /></g>
    <Ground fill="#B8734A" />
    {[-700, -480, 120, 560, 820, 1100, -980].map((x, i) => <Rock key={i} x={x} y={FOOT + 30 + (i % 3) * 60} s={0.7 + (i % 3) * 0.3} fill="#9C7A66" />)}
    <Dust t={t} o={0.5} />
  </>
);
const Bread: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1, s2 = p.segs[2] - 0.12;
  const whisper = p.w('whisper');
  if (t < s1) {
    // his shadow sits up
    const up = ko(t, whisper - 0.1, whisper + 0.8);
    const c: C3 = {x: lerp(-120, 80, k(t, 0, s1)), y: 60, z: lerp(1.1, 1.0, k(t, 0, s1))};
    return (
      <Cam c={c} p={p}>
        <StoneField c={c} t={t} dark={up} />
        <path d={`M -300 ${FOOT} L 380 ${FOOT + 26} L 400 ${FOOT + 70} L -280 ${FOOT + 40} Z`} fill="#1a0d1c" opacity={0.75 * (1 - up)} />
        <Fig x={-330} y={FOOT} pose={P.sit} look={{...JESUS, gaunt: 1}} t={t} shake={1.2} face={{eyes: up > 0.5 ? 'wide' : 'closed', mouth: 'frown', brow: -0.6, look: [1, 0]}} />
        <g transform={`translate(330 ${FOOT}) scale(1 ${Math.max(0.02, up)}) skewX(${(1 - up) * -50})`}><Fig x={0} y={0} flip pose={mix(P.sit, P.stand, up)} look={SHADOW} t={t} face={{eyes: 'half'}} /></g>
      </Cam>
    );
  }
  if (t < s2) {
    const br = ko(t, p.w('bread') - 0.25, p.w('bread') + 0.25);
    const reach = k(t, p.w('turn'), p.w('bread') + 0.5);
    const c: C3 = {x: 10, y: lerp(30, -10, k(t, s1, s2)), z: lerp(1.25, 1.55, k(t, s1, s2))};
    return (
      <Cam c={c} p={p}>
        <StoneField c={c} t={t} dark={1} />
        <Fig x={-260} y={FOOT} pose={mix(P.stand, P.reach, reach)} look={{...JESUS, gaunt: 1}} t={t} shake={2 + reach * 3} face={{eyes: 'wide', mouth: reach > 0.3 ? 'open' : 'frown', brow: -0.7, look: [1, 0.3]}} />
        <Fig x={280} y={FOOT} flip pose={P.offer} look={SHADOW} t={t} face={{eyes: 'half'}} hold={<g transform="translate(0 20)"><Stone bread={br} t={t} /></g>} />
      </Cam>
    );
  }
  const cutBack = p.w('live') - 0.05;
  if (t < cutBack) {
    const c: C3 = {x: 0, y: -20, z: lerp(1.7, 1.95, k(t, s2, cutBack))};
    return (
      <Cam c={c} p={p}>
        <Fill fill="url(#skyEmber)" /><Fill fill="#1a0d1c" o={0.45} /><Glow x={500} y={200} r={600} o={0.5} />
        <Bust x={0} y={0} look={{...JESUS, gaunt: 1}} t={t} shake={1.2} face={{eyes: t > p.w('man') - 0.2 ? 'open' : 'closed', mouth: 'flat', brow: lerp(-0.4, 0.7, k(t, s2, p.w('man')))}} />
      </Cam>
    );
  }
  const u = t - cutBack;
  const c: C3 = {x: 10, y: 20, z: 1.3};
  return (
    <Cam c={c} p={p}>
      <StoneField c={c} t={t} dark={lerp(1, 0.5, k(u, 0, 1))} />
      <Fig x={-260} y={FOOT} pose={mix(P.reach, P.fist, ko(u, 0, 0.35))} look={{...JESUS, gaunt: 1}} t={t} face={{eyes: 'open', mouth: 'flat', brow: 0.7, look: [1, 0]}} />
      <Fig x={280} y={FOOT} flip pose={P.offer} look={SHADOW} t={t} face={{eyes: 'half'}} hold={<g transform="translate(0 20)"><Stone bread={1 - ko(u, 0.15, 0.4)} t={t} /></g>} />
    </Cam>
  );
};

/* ------------------------------------------------------------------ 7. the pinnacle */
const Temple: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  const dive = k(t, 0.1, 1.2) * (1 - k(t, s1 - 0.5, s1 + 0.3));
  const c: C3 = {x: lerp(60, 200, dive), y: lerp(-20, 700, dive), z: lerp(1.25, 0.46, dive), rot: lerp(0, 9, dive) + Math.sin(t * 2.2) * 1.2};
  const back = k(t, s1, s1 + 0.5);
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyGold)" />
      <g transform={par(c, 0.25)}><Sun x={500} y={-500} r={120} fill="#fff" /></g>
      {/* city far below */}
      <g transform={par(c, 0.8)}>
        <rect x={-BIG} y={1700} width={BIG * 2} height={BIG} fill="#C98F4E" />
        {Array.from({length: 70}).map((_, i) => { const x = (rnd(i) - 0.5) * 3200, y = 1720 + rnd(i + 2) * 1200, s = 60 + rnd(i + 5) * 130; return <g key={i}><rect x={x} y={y} width={s} height={s * 0.7} fill={['#F2D9A6', '#E8C489', '#D9A765'][i % 3]} stroke={INK} strokeWidth={4} />{i % 4 === 0 ? <circle cx={x + s / 2} cy={y} r={s * 0.3} fill="#F2D9A6" stroke={INK} strokeWidth={4} /> : null}</g>; })}
        {Array.from({length: 60}).map((_, i) => <circle key={'c' + i} cx={(rnd(i + 40) - 0.5) * 900 + 500} cy={2100 + rnd(i + 41) * 500} r={9} fill={INK} opacity={0.7} />)}
      </g>
      {/* tower */}
      <path d={`M -330 ${FOOT} L 110 ${FOOT} L 190 ${BIG} L -520 ${BIG} Z`} fill="#EBCB8E" stroke={INK} strokeWidth={10} />
      <path d={`M 10 ${FOOT} L 110 ${FOOT} L 190 ${BIG} L 60 ${BIG} Z`} fill="#B98B4E" opacity={0.6} />
      {Array.from({length: 18}).map((_, i) => <line key={i} x1={-340 - i * 9} y1={FOOT + 160 + i * 160} x2={118 + i * 4} y2={FOOT + 160 + i * 160} stroke={INK} strokeWidth={4} opacity={0.3} />)}
      <rect x={-380} y={FOOT - 6} width={530} height={40} rx={6} fill="#F6DDA8" stroke={INK} strokeWidth={9} />
      {/* pebbles */}
      {[0, 1, 2, 3].map((i) => { const u = t - 0.9 - i * 0.12; return u > 0 ? <circle key={i} cx={150 + i * 16} cy={FOOT + 40 + u * u * 900} r={9 - i} fill="#8a6a44" stroke={INK} strokeWidth={3} /> : null; })}
      <Fig x={lerp(70, -90, back)} y={FOOT} pose={mix(P.teeter, P.firm, back)} look={{...JESUS, gaunt: 1}} t={t} shake={(1 - back) * 3} face={back > 0.5 ? {eyes: 'open', brow: 0.7, mouth: 'flat', look: [1, 0]} : {eyes: 'wide', mouth: 'grit', brow: -0.6, look: [1, 1]}} />
      <Fig x={520} y={FOOT + Math.sin(t * 1.6) * 14} flip pose={mix(P.offer, P.armsOpen, 0.3)} look={SHADOW} t={t} face={{eyes: 'half'}} />
      <g opacity={(1 - back) * 0.9}>{Array.from({length: 10}).map((_, i) => { const x = (rnd(i) - 0.5) * 1500 + 200; const y = ((t * (900 + rnd(i + 2) * 700) + rnd(i + 3) * 2600) % 2600) - 300; return <line key={i} x1={x} y1={y} x2={x} y2={y - 220} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.45} />; })}</g>
    </Cam>
  );
};

/* ------------------------------------------------------------------ 8. the kingdoms */
export const Skyline: React.FC<{y: number; seed: number; col: string; t: number; h: number}> = ({y, seed, col, t, h}) => (
  <g>
    {Array.from({length: 46}).map((_, i) => { const x = -1700 + i * 76 + rnd(i + seed) * 30; const hh = h * (0.35 + rnd(i + seed * 3)); const kind = Math.floor(rnd(i + seed * 7) * 4); const fl = 0.75 + 0.25 * Math.sin(t * 3 + i + seed);
      return <g key={i} opacity={fl} stroke={col} strokeWidth={5} fill="none" strokeLinejoin="round">
        <path d={`M ${x} ${y} L ${x} ${y - hh} ${kind === 0 ? `L ${x + 28} ${y - hh - 40} L ${x + 56} ${y - hh}` : kind === 1 ? `A 28 28 0 0 1 ${x + 56} ${y - hh}` : `L ${x + 56} ${y - hh}`} L ${x + 56} ${y}`} />
        {kind === 3 ? <line x1={x + 28} y1={y - hh} x2={x + 28} y2={y - hh - 70} /> : null}
        {kind === 2 ? [0, 1, 2].map((j) => <line key={j} x1={x + 12 + j * 16} y1={y} x2={x + 12 + j * 16} y2={y - hh + 14} strokeWidth={3} />) : null}
      </g>; })}
    <line x1={-BIG} y1={y} x2={BIG} y2={y} stroke={col} strokeWidth={5} />
  </g>
);
export const Giant: React.FC<{t: number; o?: number; eyes?: number}> = ({t, o = 1, eyes = 1}) => (
  <g opacity={o}>
    <path d={`M -1500 ${BIG} L -1400 -200 Q -1200 -520 -640 -560 Q -620 -1250 0 -1280 Q 620 -1250 640 -560 Q 1200 -520 1400 -200 L 1500 ${BIG} Z`} fill="#050208" />
    {[-1, 1].map((s) => <g key={s}><ellipse cx={s * 250} cy={-900} rx={130} ry={46 * eyes + Math.sin(t * 2) * 4} fill="#fff" /><ellipse cx={s * 250} cy={-900} rx={260} ry={150} fill="url(#gWhite)" opacity={0.35} /></g>)}
  </g>
);
const Kingdoms: React.FC<SP> = (p) => {
  const {t} = p;
  const cross = p.w('cross');
  if (t >= cross + 0.02 && t < cross + 0.2) {
    return (
      <Cam c={{x: 0, y: 0, z: 1}} p={p}>
        <Fill fill="#C8201E" /><Glow x={0} y={-150} r={900} o={0.9} id="gWhite" />
        <path d="M -1700 700 Q -400 250 0 260 Q 400 250 1700 700 L 1700 2000 L -1700 2000 Z" fill="#090308" />
        <rect x={-26} y={-420} width={52} height={700} fill="#090308" /><rect x={-190} y={-270} width={380} height={52} fill="#090308" />
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: lerp(120, -120, k(t, 0, p.dur)), z: lerp(0.8, 0.66, k(t, 0, p.dur))};
  const grow = ko(t, p.w('all', 1) - 0.2, p.w('yours', 2) + 0.2);
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyNight)" /><Stars t={t} n={140} />
      <g transform={par(c, 0.3)}><Giant t={t} /></g>
      <g transform={par(c, 0.55)} opacity={0.35 + grow * 0.65}>
        <rect x={-BIG} y={300} width={BIG * 2} height={900} fill="url(#gFloor)" opacity={0.6} />
        <Skyline y={420} seed={1} col="#FFB347" t={t} h={200 * (0.4 + 0.6 * grow)} /><Skyline y={600} seed={5} col="#FFD76A" t={t} h={260 * (0.4 + 0.6 * grow)} /><Skyline y={820} seed={9} col="#FFF0B8" t={t} h={330 * (0.4 + 0.6 * grow)} />
      </g>
      <path d={`M -900 ${BIG} L -260 360 L -90 ${FOOT} L 110 ${FOOT} L 300 420 L 1000 ${BIG} Z`} fill="#1b1424" stroke="#000" strokeWidth={10} strokeLinejoin="round" />
      <Fig x={0} y={FOOT} pose={P.stand} look={{...JESUS, gaunt: 1, skin: '#B99A8E', tunic: '#C9C2CF'}} t={t} shake={1.5} scale={0.8} face={{eyes: 'open', brow: -0.4, mouth: 'frown', look: [0, 1]}} />
    </Cam>
  );
};

/* ------------------------------------------------------------------ 9. "Go." */
const Go: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.15, go = p.w('go') + 0.12;
  if (t < s1) {
    const c: C3 = {x: 0, y: -20, z: lerp(1.75, 2.15, t / s1)};
    const beat = Math.exp(-((t % 0.7)) * 7);
    return (
      <Cam c={c} p={p}>
        <Fill fill="url(#skyNight)" /><Glow x={0} y={900} r={1100} o={0.35} />
        <Bust x={0} y={0} look={{...JESUS, gaunt: 1, skin: '#C9A08C', tunic: '#C9C2CF'}} t={t} shake={3.5} tilt={-3} face={{eyes: t > p.w('alone') ? 'closed' : 'half', mouth: 'grit', brow: -0.8, look: [0, 1]}} />
        {[-70, 62].map((x, i) => { const ph = (t * 0.8 + i * 0.4) % 1; return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${x} ${-40 + ph * 110}) scale(1.6)`} fill="#BFE9F2" stroke={INK} strokeWidth={2.5} opacity={1 - ph} />; })}
        <Fill fill="#000" o={0.18 + beat * 0.16} />
      </Cam>
    );
  }
  const u = t - go;
  const sh = u > 0 ? Math.exp(-u * 3.5) * 30 : 0;
  const stand = ko(t, s1, s1 + 0.9);
  const c: C3 = {x: Math.sin(t * 71) * sh, y: lerp(40, -60, k(t, s1, go)) + Math.cos(t * 87) * sh, z: lerp(1.0, 0.82, k(t, s1, go + 0.4))};
  const dawn = k(u, 0, 1.0);
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyNight)" /><Stars t={t} n={120} o={1 - dawn} /><Fill fill="url(#skyRose)" o={dawn} />
      <g transform={par(c, 0.3)}>
        {u <= 0 ? <Giant t={t} eyes={0.6} /> : Array.from({length: 46}).map((_, i) => { const a = rnd(i) * Math.PI * 2, d = 200 + rnd(i + 1) * 900; const x = Math.cos(a) * d * (1 + u * 3.2), y = -500 + Math.sin(a) * d * 0.8 * (1 + u * 3.2); const s = 60 + rnd(i + 2) * 190; return <polygon key={i} points={`0,${-s} ${s * 0.8},${s * 0.6} ${-s * 0.7},${s * 0.4}`} transform={`translate(${x} ${y}) rotate(${rnd(i + 3) * 360 + u * 300 * (rnd(i + 4) - 0.5)})`} fill="#050208" opacity={Math.max(0, 1 - u * 1.3)} />; })}
      </g>
      <path d={`M -900 ${BIG} L -260 360 L -90 ${FOOT} L 110 ${FOOT} L 300 420 L 1000 ${BIG} Z`} fill="#1b1424" stroke="#000" strokeWidth={10} strokeLinejoin="round" />
      {u > 0 ? [0, 1, 2].map((i) => { const r = (u - i * 0.12) * 2300; return r > 0 ? <circle key={i} cx={0} cy={0} r={r} fill="none" stroke="#fff" strokeWidth={36 - i * 10} opacity={Math.max(0, 0.9 - u * 1.1)} /> : null; }) : null}
      <Fig x={0} y={FOOT} pose={u > 0 ? P.command : mix(P.kneel, P.firm, stand)} look={{...JESUS, gaunt: 1, skin: u > 0 ? '#D9A07C' : '#C9A08C'}} t={t} shake={u > 0 ? 0 : 2.5 * (1 - stand * 0.6)} face={u > 0 ? {eyes: 'open', brow: 0.9, mouth: 'open', look: [1, -0.5]} : {eyes: stand > 0.8 ? 'open' : 'closed', brow: 0.6, mouth: 'grit'}} />
      {u > 0 && u < 0.14 ? <Fill fill="#fff" o={0.9} /> : null}
    </Cam>
  );
};

/* ------------------------------------------------------------------ 10. angels */
export const Angel: React.FC<{x: number; y: number; s: number; o: number; t: number; i: number; bow?: number}> = ({x, y, s, o, t, i, bow = 0}) => (
  <g transform={`translate(${x} ${y + Math.sin(t * 1.3 + i) * 10}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={-330} rx={520} ry={640} fill="url(#gWhite)" opacity={0.75} />
    {[-1, 1].map((sd) => <path key={sd} d={`M ${sd * 30} -480 Q ${sd * (330 + Math.sin(t * 2 + i) * 30)} -760 ${sd * 250} -260 Q ${sd * 140} -330 ${sd * 30} -330 Z`} fill="#FFF8DC" stroke="#F2B64E" strokeWidth={5} opacity={0.75} />)}
    <g transform={`rotate(${bow} 0 0)`}>
      <path d="M -70 0 Q -110 -360 0 -520 Q 110 -360 70 0 Q 0 26 -70 0 Z" fill="#FFFDF2" stroke="#F2B64E" strokeWidth={7} opacity={0.95} />
      <circle cx={0} cy={-590} r={74} fill="#fff" stroke="#F2B64E" strokeWidth={7} />
    </g>
  </g>
);
const Angels: React.FC<SP> = (p) => {
  const {t} = p;
  const a = p.w('angels') - 0.1;
  const o = ko(t, a, a + 0.9);
  const c: C3 = {x: lerp(-40, 30, t / p.dur), y: lerp(120, 10, k(t, 0, p.dur)), z: lerp(1.3, 0.98, k(t, 0.2, p.dur))};
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyRose)" />
      <g transform={par(c, 0.2)}><Sun x={-460} y={170} r={90} fill="#FFE9C9" /></g>
      <g transform={par(c, 0.5)}><Mesa x={820} y={FOOT} w={560} h={360} fill="#C98A7A" shade="#9E6259" /><Mesa x={-1050} y={FOOT} w={480} h={260} fill="#C98A7A" shade="#9E6259" /></g>
      <g transform={par(c, 0.75)}><Angel x={-520} y={FOOT + 20} s={0.95} o={o * 0.8} t={t} i={0} /><Angel x={560} y={FOOT + 20} s={1.1} o={o * 0.8} t={t} i={1} /></g>
      <Ground fill="#E2B08E" />
      {[-640, 520, 860].map((x, i) => <Rock key={i} x={x} y={FOOT + 40 + i * 30} s={0.8} fill="#C9A090" />)}
      <ellipse cx={-10} cy={FOOT + 8} rx={300} ry={26} fill="#7a4a3c" opacity={0.35} />
      <Fig x={190} y={FOOT - 46} rot={-90} pose={{aB: [20, 40], aF: [150, 20], lB: [-6, 4], lF: [8, 10], head: -8}} look={{...JESUS, gaunt: 1}} t={0.05} face={{eyes: 'closed', mouth: o > 0.7 ? 'smile' : 'flat'}} />
      <Hyena x={610} y={FOOT + 10} s={0.8} t={0} lie flip />
      <Angel x={120} y={FOOT + 80} s={0.82} o={o} t={t} i={2} bow={-16} />
      <Dust t={t} o={0.3 + o * 0.6} col="#FFF6DC" up n={60} />
      <Fill fill="#FFF3D6" o={o * 0.14} />
    </Cam>
  );
};

/* ------------------------------------------------------------------ 11. out of the desert */
export const Boat: React.FC<{x: number; y: number; s: number; t: number}> = ({x, y, s, t}) => (
  <g transform={`translate(${x} ${y + Math.sin(t * 1.5 + x) * 5}) scale(${s}) rotate(${Math.sin(t * 1.2 + x) * 2})`}>
    <path d="M -80 0 Q 0 46 80 0 L 60 -6 L -60 -6 Z" fill="#7a4f2f" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <line x1={0} y1={-6} x2={0} y2={-120} stroke={INK} strokeWidth={6} /><path d="M 6 -116 L 70 -30 L 6 -24 Z" fill="#F3E6C8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </g>
);
const Walk: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = p.segs[1] - 0.15;
  const J: Look = {...JESUS, gaunt: 0.9};
  if (t < cut) {
    const scroll = t * 330;
    const g = k(t, 1.2, cut);
    const c: C3 = {x: scroll + lerp(-60, 60, t / cut), y: lerp(-10, 40, k(t, 0, 1.5)), z: lerp(1.5, 1.08, ko(t, 0, 1.8))};
    return (
      <Cam c={c} p={p}>
        <Fill fill="url(#skyRose)" /><Fill fill="url(#skyDay)" o={g} />
        <g transform={par(c, 0.15)}><Sun x={scroll * 0.15 + 420} y={-360} r={90} fill="#FFF6DC" /></g>
        <g transform={par(c, 0.4)}>
          {[0, 1, 2].map((i) => <Mesa key={i} x={-200 + i * 620} y={FOOT} w={420} h={300 + (i % 2) * 120} fill="#C98A7A" shade="#9E6259" stroke={false} />)}
          <path d="M 900 320 Q 1300 60 1700 240 Q 2100 80 2500 260 L 2500 600 L 900 600 Z" fill="#6E9A62" />
        </g>
        <Ground fill="#E2B08E" /><rect x={scroll - BIG} y={FOOT + 4} width={BIG * 2} height={BIG} fill="#8DB56B" opacity={g} />
        {Array.from({length: 16}).map((_, i) => { const x = 100 + i * 190; return x < 1000 ? <Rock key={i} x={x} y={FOOT + 4} s={0.5 + (i % 3) * 0.25} fill="#C9A090" /> : <g key={i}>{[0, 1, 2].map((j) => <line key={j} x1={x + j * 14} y1={FOOT} x2={x + j * 14 + (j - 1) * 14} y2={FOOT - 46 - (j % 2) * 20} stroke="#4E8246" strokeWidth={8} strokeLinecap="round" />)}{i % 3 === 0 ? <circle cx={x + 40} cy={FOOT - 30} r={10} fill="#F6D24A" stroke={INK} strokeWidth={4} /> : null}</g>; })}
        <Fig x={scroll} y={FOOT} pose={walk(t, 1.45)} look={J} t={t} face={{eyes: 'open', brow: 0.55, mouth: 'flat', look: [1, 0]}} />
        <g transform={par(c, 1.6)}>{[300, 1400, 2300, 3200].map((x, i) => <Rock key={i} x={x} y={FOOT + 420} s={2.6} fill={i < 2 ? '#8E5E50' : '#3F6B3A'} />)}</g>
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: lerp(-200, 0, k(u, 0, 3.6)), y: lerp(60, -140, k(u, 0, 3.6)), z: lerp(1.05, 0.62, k(u, 0, 3.6))};
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyDay)" />
      <g transform={par(c, 0.15)}><Sun x={360} y={-520} r={120} fill="#fff" /></g>
      <g transform={par(c, 0.35)}><path d="M -1800 420 Q -1200 180 -600 360 Q 0 200 600 340 Q 1200 200 1800 400 L 1800 900 L -1800 900 Z" fill="#7FA6B5" /></g>
      <g transform={par(c, 0.55)}>
        <rect x={-BIG} y={520} width={BIG * 2} height={700} fill="#3F8FB0" /><line x1={-BIG} y1={520} x2={BIG} y2={520} stroke="#CDEFF5" strokeWidth={6} />
        {Array.from({length: 18}).map((_, i) => <path key={i} d={`M ${(rnd(i) - 0.5) * 2600 + Math.sin(t + i) * 30} ${570 + (i % 6) * 90} q 40 -12 80 0 t 80 0`} fill="none" stroke="#BDE6F0" strokeWidth={5} opacity={0.6} />)}
        <Boat x={280} y={640} s={1.3} t={t} /><Boat x={760} y={760} s={1.7} t={t} /><Boat x={-150} y={580} s={0.9} t={t} />
        {[[-900, 540], [-760, 560], [-640, 536], [1150, 548], [1280, 566]].map((q, i) => <g key={i}><rect x={q[0]} y={q[1] - 70} width={110} height={70} fill="#F1E3C6" stroke={INK} strokeWidth={5} /><rect x={q[0] + 40} y={q[1] - 34} width={26} height={34} fill="#6b4630" /></g>)}
      </g>
      <path d={`M ${-BIG} ${BIG} L ${-BIG} 420 Q -700 330 -420 ${FOOT} Q -200 280 60 430 Q 500 760 700 ${BIG} Z`} fill="#7BAF5E" stroke={INK} strokeWidth={10} />
      {[-1200, -940, -700, -150].map((x, i) => <g key={i}>{[0, 1, 2].map((j) => <line key={j} x1={x + j * 14} y1={380 + i * 16} x2={x + j * 14 + (j - 1) * 14} y2={330 + i * 16} stroke="#4E8246" strokeWidth={8} strokeLinecap="round" />)}</g>)}
      <Fig x={-390} y={FOOT + 2} pose={mix(P.stand, P.firm, 1)} look={J} t={t} face={{eyes: 'open', brow: 0.4, mouth: u > 1.2 ? 'smile' : 'flat', look: [1, 0.4]}} />
      {Array.from({length: 7}).map((_, i) => { const x = -700 + i * 160 + u * 120, y = -420 - (i % 3) * 70 - u * 20; const f = Math.sin(t * 9 + i) * 12; return <path key={i} d={`M ${x - 20} ${y + f} L ${x} ${y} L ${x + 20} ${y + f}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />; })}
    </Cam>
  );
};

/* ------------------------------------------------------------------ 12. end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 0, z: 1};
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyEmber)" /><Fill fill="#1a0d1c" o={0.35} />
      <Sun x={0} y={420} r={150} fill="#FFE2B0" />
      <path d={`M ${-BIG} 520 Q -600 430 0 500 Q 700 420 ${BIG} 520 L ${BIG} ${BIG} L ${-BIG} ${BIG} Z`} fill="#1b1016" />
      <Fig x={lerp(-140, 60, t / p.dur)} y={492} pose={walk(t, 1.2)} look={{...SHADOW, shadow: false, skin: '#1b1016', hair: '#1b1016', tunic: '#1b1016'}} t={0.05} face={{eyes: 'closed', mouth: 'none'}} scale={0.5} />
    </Cam>
  );
};

export const SCENES: Record<string, React.FC<SP>> = {river: River, sky: Sky, voice: Voice, drive: Drive, fast: Fast, bread: Bread, temple: Temple, kingdoms: Kingdoms, go: Go, angels: Angels, walk: Walk, end: End};

export const Defs: React.FC = () => {
  const lg = (id: string, stops: [number, string][]) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 -1100) scale(1 2000)">{stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)}</linearGradient>
  );
  const rg = (id: string, c: string) => (<radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity={0.95} /><stop offset="0.45" stopColor={c} stopOpacity={0.35} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient>);
  return (
    <defs>
      {lg('skyDawn', [[0, '#5B6E8C'], [0.5, '#B6A9A6'], [0.72, '#F3C9A0']])}
      {lg('skySlate', [[0, '#27303F'], [0.5, '#4A5B6B'], [0.75, '#7E8D92']])}
      {lg('skyGoldDawn', [[0, '#FFF4CF'], [0.45, '#F7C987'], [0.8, '#C98E6B']])}
      {lg('skyDesert', [[0, '#F7D7A0'], [0.5, '#F5E3C2'], [0.72, '#F9EEDC']])}
      {lg('skyNight', [[0, '#0D0A1E'], [0.5, '#1E1838'], [0.75, '#3A2A52']])}
      {lg('skyEmber', [[0, '#3A1A2E'], [0.4, '#8E3B33'], [0.7, '#E88A48']])}
      {lg('skyGold', [[0, '#FFB52E'], [0.45, '#FFD469'], [0.75, '#FFEBA8']])}
      {lg('skyRose', [[0, '#7E6A9A'], [0.4, '#E39A93'], [0.7, '#FFD3A8']])}
      {lg('skyDay', [[0, '#3E8FD0'], [0.45, '#8CC6EA'], [0.72, '#DDF0F4']])}
      {lg('skySea', [[0, '#6C86B8'], [0.45, '#E7B59A'], [0.7, '#FCE3BE']])}
      {lg('skyDusk', [[0, '#2E3466'], [0.45, '#B4607A'], [0.72, '#F4A867']])}
      {lg('wallStone', [[0, '#7A6250'], [0.5, '#A8876A'], [0.75, '#C9A884']])}
      {lg('roomNight', [[0, '#1B1426'], [0.5, '#3A2838'], [0.75, '#5A3C3A']])}
      <linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFB347" stopOpacity={0.7} /><stop offset="1" stopColor="#FFB347" stopOpacity={0} /></linearGradient>
      {rg('gGold', '#FFD98A')}
      {rg('gWhite', '#FFFFFF')}
    </defs>
  );
};
