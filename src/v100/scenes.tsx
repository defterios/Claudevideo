import React from 'react';
import {SP, k, ko, lerp, lin, rnd} from '../v8/scenes';

/** Special — "The Number 3". New look: thin white line art on black that turns gold as each item of a three is
 * spoken; mono verse tags; triangles with three labelled corners. Screen coordinates (1080x1920);
 * captions sit at y 1250-1470, so the art lives in y 150-1200. */
export type Lang = 'en' | 'bdy';
export const WH = '#ECE7DC', GD = '#F4B942', BG = '#0B0A0C';
export const CX = 540, CY = 680;
export const lit = (t: number, at: number) => ko(t, at, at + 0.4);

export const Defs3 = () => (
  <defs>
    <filter id="l3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    <filter id="l3big" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18" /></filter>
    <radialGradient id="g3"><stop offset="0" stopColor="#FFD873" stopOpacity="0.9" /><stop offset="0.4" stopColor="#F4B942" stopOpacity="0.35" /><stop offset="1" stopColor="#F4B942" stopOpacity="0" /></radialGradient>
  </defs>
);
export const Back: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1080} height={1920} fill={BG} />
    {Array.from({length: 70}).map((_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 99) * 1920} r={0.8 + rnd(i + 7) * 1.6} fill={WH} opacity={(0.12 + 0.25 * rnd(i + 3)) * (0.6 + 0.4 * Math.sin(t * (0.6 + rnd(i)) + i))} />)}
  </g>
);
/** a line that draws itself (p 0..1) and turns gold (l 0..1) */
export const Ln: React.FC<{d: string; p?: number; l?: number; w?: number; fill?: string}> = ({d, p = 1, l = 0, w = 3.5, fill = 'none'}) => (
  <g>
    <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} fill={fill} stroke={WH} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={0.8 * (1 - 0.7 * l)} />
    {l > 0 ? <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} fill="none" stroke={GD} strokeWidth={w + 1} strokeLinecap="round" strokeLinejoin="round" opacity={l} filter="url(#l3)" /> : null}
  </g>
);
export const Dot: React.FC<{x: number; y: number; l: number; r?: number}> = ({x, y, l, r = 9}) => (
  <g>
    <circle cx={x} cy={y} r={r + 9} fill="none" stroke={WH} strokeWidth={2} opacity={0.35 + 0.4 * l} />
    <circle cx={x} cy={y} r={r * (0.5 + 0.5 * l)} fill={l > 0.05 ? GD : WH} opacity={0.5 + 0.5 * l} filter={l > 0.05 ? 'url(#l3)' : undefined} />
    {l > 0 ? <circle cx={x} cy={y} r={60} fill="url(#g3)" opacity={l * 0.7} /> : null}
  </g>
);
export const Mono: React.FC<{x: number; y: number; s?: number; c?: string; o?: number; a?: 'start' | 'middle' | 'end'; children: React.ReactNode}> = ({x, y, s = 30, c = WH, o = 1, a = 'middle', children}) => (
  <text x={x} y={y} fontFamily="JetBrains Mono" fontWeight={700} fontSize={s} fill={c} opacity={o} textAnchor={a} letterSpacing={s * 0.12}>{children}</text>
);
export const Tag: React.FC<{t: number; txt: string; y?: number}> = ({t, txt, y = 230}) => <Mono x={CX} y={y} s={30} c={GD} o={ko(t, 0.3, 0.9)}>{txt}</Mono>;
/** standing figure outline, feet at (x, y), height ~ 330*s */
export const fig = (x: number, y: number, s = 1) => `M ${x - 36 * s} ${y - 232 * s} Q ${x - 64 * s} ${y - 218 * s} ${x - 60 * s} ${y - 150 * s} L ${x - 50 * s} ${y} L ${x + 50 * s} ${y} L ${x + 60 * s} ${y - 150 * s} Q ${x + 64 * s} ${y - 218 * s} ${x + 36 * s} ${y - 232 * s} Q ${x} ${y - 244 * s} ${x - 36 * s} ${y - 232 * s} Z M ${x} ${y - 305 * s} m -32 0 a ${32 * s} ${32 * s} 0 1 0 ${64 * s} 0 a ${32 * s} ${32 * s} 0 1 0 ${-64 * s} 0`;
export const Fig: React.FC<{x: number; y: number; s?: number; p?: number; l?: number; rot?: number}> = ({x, y, s = 1, p = 1, l = 0, rot = 0}) => (
  <g transform={`rotate(${rot} ${x} ${y})`}><Ln d={fig(x, y, s)} p={p} l={l} w={3} /></g>
);
export const cross = (x: number, y: number, s = 1) => `M ${x} ${y} L ${x} ${y - 330 * s} M ${x - 95 * s} ${y - 250 * s} L ${x + 95 * s} ${y - 250 * s}`;
export const Fire: React.FC<{x: number; y: number; t: number; s?: number}> = ({x, y, t, s = 1}) => (
  <g>
    <circle cx={x} cy={y - 20 * s} r={170 * s} fill="url(#g3)" opacity={0.55 + 0.1 * Math.sin(t * 9)} />
    {Array.from({length: 9}).map((_, i) => { const a = (i / 9) * Math.PI; return <Ln key={i} d={`M ${x + Math.cos(a) * 90 * s} ${y} l ${-20 * s} ${-18 * s} l ${40 * s} 0 Z`} l={0.5 + 0.5 * Math.sin(t * 5 + i)} w={2.5} />; })}
    {[-1, 0, 1].map((i) => { const h = (70 + 25 * Math.sin(t * 8 + i * 2)) * s; return <Ln key={i} d={`M ${x + i * 28 * s - 18 * s} ${y - 10 * s} Q ${x + i * 28 * s} ${y - h} ${x + i * 28 * s + 4 * s} ${y - h - 20 * s} Q ${x + i * 28 * s + 10 * s} ${y - h * 0.6} ${x + i * 28 * s + 18 * s} ${y - 10 * s}`} l={1} w={3} />; })}
  </g>
);
/** the "three" triangle: corners lit at a, b, c; labels in the active language */
const Tri: React.FC<{t: number; at: number[]; lab: string[]; head: string; draw?: number; children?: React.ReactNode}> = ({t, at, lab, head, draw = 1, children}) => {
  const P = [[CX - 330, CY - 250], [CX + 330, CY - 250], [CX, CY + 330]];
  const L = at.map((a) => lit(t, a));
  return (
    <g>
      <Ln d={`M ${P[0][0]} ${P[0][1]} L ${P[1][0]} ${P[1][1]} L ${P[2][0]} ${P[2][1]} Z`} p={draw} l={Math.min(...L) * 0.8} w={3} />
      <Mono x={CX} y={CY - 268} s={26} o={0.7 * draw}>{head}</Mono>
      {P.map(([x, y], i) => <Dot key={i} x={x} y={y} l={L[i]} />)}
      <Mono x={P[0][0] - 10} y={P[0][1] - 40} s={34} a="start" c={L[0] > 0.5 ? GD : WH} o={0.4 + 0.6 * L[0]}>{lab[0]}</Mono>
      <Mono x={P[1][0] + 10} y={P[1][1] - 40} s={34} a="end" c={L[1] > 0.5 ? GD : WH} o={0.4 + 0.6 * L[1]}>{lab[1]}</Mono>
      <Mono x={P[2][0]} y={P[2][1] + 70} s={34} c={L[2] > 0.5 ? GD : WH} o={0.4 + 0.6 * L[2]}>{lab[2]}</Mono>
      {children}
    </g>
  );
};
/** a scene that shows two triangles in a row (the second set starts at `swap`) */
const Tri2: React.FC<{p: SP; a: string[]; b: string[]; la: string[]; lb: string[]; head: string[]; icon: (t: number, second: boolean) => React.ReactNode}> = ({p, a, b, la, lb, head, icon}) => {
  const {t} = p;
  const swap = p.w(b[0], p.dur * 0.55) - 0.35;
  const second = t > swap;
  const ats = (second ? b : a).map((x, i) => p.w(x, (second ? p.dur * 0.6 : 0.2) + i * 0.5));
  const fade = second ? ko(t, swap, swap + 0.3) : 1 - ko(t, swap - 0.3, swap);
  return (
    <g opacity={Math.max(0.15, fade)}>
      <Tri t={t} at={ats} lab={second ? lb : la} head={second ? head[1] : head[0]} draw={second ? 1 : lin(t, 0, 0.6)}>{icon(t, second)}</Tri>
    </g>
  );
};

type Labels = Record<string, string[]>;
const LAB: Record<Lang, Labels> = {
  en: {
    rose: ['FRI', 'SAT', 'SUN'], trinity: ['FATHER', 'SON', 'SPIRIT', 'GOD'], colours: ['RED', 'YELLOW', 'BLUE'],
    life: ['BIRTH', 'LIFE', 'DEATH'], time: ['PAST', 'NOW', 'FUTURE'], matter: ['TIME', 'SPACE', 'MATTER'], water: ['ICE', 'WATER', 'STEAM'],
    depth: ['HEIGHT', 'WIDTH', 'DEPTH'], person: ['BODY', 'SOUL', 'SPIRIT'], family: ['FATHER', 'MOTHER', 'CHILD'],
    saved: ['DEATH', 'BURIAL', 'RISEN'], bless: ['FATHER', 'SON', 'SPIRIT'], end: ['FRIENDS', 'FAMILY', 'NEIGHBOURS'],
    holy: ['HOLY', 'HOLY', 'HOLY'], deny: ['DENIAL'], pray: ['PRAYER'], of: ['OF'], asleep: ['ASLEEP'], year: ['YEAR'], world: ['1 IN 3'],
    complete: ['COMPLETE'], women: ['MARY MAGDALENE', 'MARY, MOTHER OF JAMES', 'SALOME'],
  },
  bdy: {
    rose: ['JUMAAT', 'SABTU', 'MINGGU'], trinity: ['SAMA', 'ONAK', 'ROH KUDUS', 'TOPA'], colours: ['BIRIEH', 'SIA', 'BIRU'],
    life: ['BRANAK', 'IDIP', 'KOBES'], time: ['SODI', 'ADIN', 'SIJE'], matter: ['MASA', 'RUANG', 'JIRIM'], water: ['AIS', 'PIIN', 'GAS'],
    depth: ['OMU', 'AYUH', 'DOWOH'], person: ['GONAN', 'SMONGI', 'ROH'], family: ['SAMA', 'SINE', 'ONAK'],
    saved: ['KOBES', 'NGUBUR', 'MOKAT'], bless: ['SAMA', 'ONAK', 'ROH KUDUS'], end: ['PINGOMA', 'MADIS AYUO', 'DINGAN'],
    holy: ['KUDUS', 'KUDUS', 'KUDUS'], deny: ['DOI PIRUH'], pray: ['SMAYANG'], of: ['/'], asleep: ['BEES'], year: ['SOWA'], world: ['1 SUO 3'],
    complete: ['SUKUP'], women: ['MARY MAGDALENE', 'MARY SINE JAMES', 'SALOME'],
  },
};
const counter = (t: number, dur: number) => Math.min(3, 1 + Math.floor((t - 0.3) / ((dur - 0.6) / 3)));

export const scenes3 = (lang: Lang): Record<string, React.FC<SP>> => {
  const X = LAB[lang];
  const S: Record<string, React.FC<SP>> = {
    /* 1 ------------------------------------------------------------ 33, 3 p.m. */
    age: (p) => {
      const {t} = p;
      const a = p.w('thirtythree', 1.2), b = p.w('three', p.dur * 0.75);
      return (
        <g><Defs3 /><Back t={t} />
          <Mono x={CX} y={330} s={110} c={t > a ? GD : WH} o={ko(t, a - 0.3, a + 0.2)}>33</Mono>
          <Ln d={`M 120 1000 Q 540 820 960 1000`} p={lin(t, 0, 0.8)} w={3} />
          {[-260, 0, 260].map((dx, i) => <Ln key={i} d={cross(CX + dx, 960 - (i === 1 ? 70 : 20), i === 1 ? 1.05 : 0.8)} p={lin(t, 0.2 + i * 0.25, 1.0 + i * 0.25)} l={i === 1 ? lit(t, a) : lit(t, b) * 0.5} />)}
          <g opacity={ko(t, b - 0.2, b + 0.3)}>
            <circle cx={CX} cy={1100} r={52} fill="none" stroke={GD} strokeWidth={3} filter="url(#l3)" />
            <line x1={CX} y1={1100} x2={CX} y2={1062} stroke={GD} strokeWidth={4} strokeLinecap="round" /><line x1={CX} y1={1100} x2={CX + 30} y2={1100} stroke={GD} strokeWidth={4} strokeLinecap="round" />
            <Mono x={CX + 80} y={1110} s={30} a="start" c={GD}>15:00</Mono>
          </g>
          <Tag t={t - b + 0.6} txt="MARK 15:34" y={1180} />
        </g>
      );
    },
    /* 2 ------------------------------------------------------------ three crosses */
    crosses: (p) => {
      const {t} = p;
      const st = (i: number) => 0.2 + i * (p.dur - 0.6) / 3;
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="LUKE 23:33" />
          <Ln d="M 80 1060 Q 540 860 1000 1060" w={3} />
          {[-300, 0, 300].map((dx, i) => <g key={i}><Ln d={cross(CX + dx, 1000 - (i === 1 ? 110 : 40), i === 1 ? 1.25 : 0.95)} p={lin(t, st(i), st(i) + 0.5)} l={lit(t, st(i) + 0.3) * (i === 1 ? 1 : 0.6)} /><Mono x={CX + dx} y={1150} s={40} c={GD} o={ko(t, st(i), st(i) + 0.3)}>{i + 1}</Mono></g>)}
        </g>
      );
    },
    /* 3 ------------------------------------------------------------ died, buried, rose (big moment: the sunrise) */
    rose: (p) => {
      const {t} = p;
      const at = [p.w('died', 0.4), p.w('buried', 1.6), p.w('third', p.dur * 0.75)];
      const L = at.map((a) => lit(t, a));
      const sun = ko(t, at[2], at[2] + 1.2);
      return (
        <g><Defs3 /><Back t={t} />
          <circle cx={CX} cy={760} r={120 + sun * 700} fill="url(#g3)" opacity={sun} />
          <Ln d="M 100 900 Q 200 560 540 540 Q 880 560 980 900 Z" w={3} l={sun * 0.6} />
          <Ln d="M 460 900 L 460 760 Q 540 680 620 760 L 620 900" w={3} l={L[1]} />
          <g transform={`translate(${sun * 190} 0) rotate(${sun * 120} 700 830)`}><Ln d="M 700 830 m -75 0 a 75 75 0 1 0 150 0 a 75 75 0 1 0 -150 0" w={3} l={L[2]} /></g>
          <Ln d="M 60 900 L 1020 900" w={3} />
          {[0, 1, 2].map((i) => <g key={i}><Dot x={300 + i * 240} y={1030} l={L[i]} /><Mono x={300 + i * 240} y={1110} s={30} c={L[i] > 0.5 ? GD : WH} o={0.4 + 0.6 * L[i]}>{X.rose[i]}</Mono></g>)}
          <Tag t={t} txt="1 CORINTHIANS 15:4" y={300} />
        </g>
      );
    },
    /* 4 ------------------------------------------------------------ three women */
    women: (p) => {
      const {t} = p;
      const at = [p.w('magdalene', p.dur * 0.45), p.w('james', p.dur * 0.65), p.w('salome', p.dur * 0.85)];
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="MARK 16:1" />
          {X.women.map((n, i) => <Mono key={i} x={180} y={310 + i * 46} s={28} a="start" c={lit(t, at[i]) > 0.5 ? GD : WH} o={0.35 + 0.65 * lit(t, at[i])}>{`${i + 1}  ${n}`}</Mono>)}
          <Ln d="M 640 1000 Q 700 700 900 690 Q 1060 700 1080 1000" w={3} /><Ln d="M 760 1000 L 760 880 Q 820 820 880 880 L 880 1000" w={3} />
          <Ln d="M 40 1000 L 1040 1000" w={3} />
          {[0, 1, 2].map((i) => <g key={i}><Fig x={170 + i * 170} y={1000} s={0.95} p={lin(t, 0.1 + i * 0.2, 0.9 + i * 0.2)} l={lit(t, at[i])} /><Mono x={170 + i * 170} y={1070} s={32} c={GD} o={lit(t, at[i])}>{i + 1}</Mono></g>)}
        </g>
      );
    },
    /* 5 ------------------------------------------------------------ three years */
    ministry: (p) => {
      const {t} = p;
      const a = p.w('three', p.dur * 0.5);
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="JOHN 2:13 · 6:4 · 11:55" />
          <Ln d="M 140 700 L 940 700" p={lin(t, 0, 1.2)} w={3} />
          {[0, 1, 2].map((i) => { const l = lit(t, a + i * 0.35); return <g key={i}><Ln d={`M ${140 + i * 267 + 20} 700 L ${140 + (i + 1) * 267 - 20} 700`} l={l} w={6} /><Dot x={140 + i * 267 + 133} y={700} l={l} /><Mono x={140 + i * 267 + 133} y={790} s={30} c={l > 0.5 ? GD : WH} o={0.4 + 0.6 * l}>{`${X.year[0]} ${i + 1}`}</Mono></g>; })}
          <Fig x={140 + lerp(0, 800, lin(t, 0.3, p.dur - 0.3))} y={640} s={0.55} />
        </g>
      );
    },
    /* 6 ------------------------------------------------------------ one in three */
    world: (p) => {
      const {t} = p;
      const a = p.w('three', p.dur * 0.6);
      const third = ko(t, a, a + 0.8);
      const R = 300, rot = t * 18;
      return (
        <g><Defs3 /><Back t={t} />
          <Mono x={200} y={300} s={56} a="start" c={GD} o={ko(t, a - 0.2, a + 0.3)}>33%</Mono><Mono x={200} y={345} s={26} a="start" o={ko(t, a, a + 0.4)}>{X.world[0]}</Mono>
          <Ln d={`M ${CX} ${CY} m ${-R} 0 a ${R} ${R} 0 1 0 ${2 * R} 0 a ${R} ${R} 0 1 0 ${-2 * R} 0`} p={lin(t, 0, 1)} w={3} />
          {[0, 1, 2, 3].map((i) => { const rx = Math.abs(Math.cos(((rot + i * 45) * Math.PI) / 180)) * R; return <ellipse key={i} cx={CX} cy={CY} rx={rx} ry={R} fill="none" stroke={WH} strokeWidth={1.5} opacity={0.35} />; })}
          {[-150, 0, 150].map((dy, i) => <ellipse key={i} cx={CX} cy={CY + dy} rx={Math.sqrt(R * R - dy * dy)} ry={22} fill="none" stroke={WH} strokeWidth={1.5} opacity={0.3} />)}
          <path d={`M ${CX} ${CY} L ${CX} ${CY - R} A ${R} ${R} 0 0 1 ${CX + R * Math.sin((2 * Math.PI / 3) * third)} ${CY - R * Math.cos((2 * Math.PI / 3) * third)} Z`} fill={GD} opacity={0.28 * third} />
          <path d={`M ${CX} ${CY - R} A ${R} ${R} 0 0 1 ${CX + R * Math.sin((2 * Math.PI / 3) * third)} ${CY - R * Math.cos((2 * Math.PI / 3) * third)}`} fill="none" stroke={GD} strokeWidth={6} filter="url(#l3)" opacity={third} />
        </g>
      );
    },
    /* 7 ------------------------------------------------------------ three denials by the fire */
    deny: (p) => {
      const {t} = p;
      const n = counter(t, p.dur);
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="MARK 14:72" />
          <Mono x={CX} y={300} s={34} c="#FF6A55">{`${X.deny[0]} ${n} ${X.of[0]} 3`}</Mono>
          <Ln d="M 60 1000 L 1020 1000" w={3} />
          <Ln d="M 80 820 L 420 820 L 420 1000 M 80 760 L 420 760" w={2} />
          <Fire x={600} y={990} t={t} />
          <Fig x={820} y={1000} s={1.05} p={lin(t, 0, 0.8)} />
          <g opacity={ko(t, p.dur * 0.7, p.dur * 0.8)}><Ln d="M 230 760 q -30 -60 0 -90 q 20 -20 40 0 l 30 -10 l -20 25 q 40 30 10 75 Z M 250 680 l -10 -25 l 20 10" l={0.6} w={3} /></g>
        </g>
      );
    },
    /* 8 ------------------------------------------------------------ three questions on the beach */
    asked: (p) => {
      const {t} = p;
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="JOHN 21:15-17" />
          <circle cx={CX} cy={840} r={150} fill="url(#g3)" opacity={0.6} />
          <Ln d="M 60 840 L 1020 840" w={2} />
          {[0, 1, 2, 3].map((i) => <Ln key={i} d={`M ${120 + i * 60} ${880 + i * 22} q 40 -8 80 0 t 80 0`} w={1.5} p={0.5 + 0.5 * Math.sin(t + i)} />)}
          <Fire x={CX} y={1000} t={t} s={0.8} />
          <Fig x={300} y={1000} s={1.05} p={lin(t, 0, 0.8)} /><Fig x={780} y={1000} s={1.05} p={lin(t, 0.2, 1.0)} l={0.6} />
        </g>
      );
    },
    /* 9 ------------------------------------------------------------ "Do you love me?" x3 */
    love: (p) => {
      const {t} = p;
      const at = [p.w('love', 0.5), p.w('love2', p.dur * 0.42), p.w('love3', p.dur * 0.72)];
      const heart = (x: number, y: number, s: number) => `M ${x} ${y + 60 * s} C ${x - 120 * s} ${y - 10 * s} ${x - 90 * s} ${y - 110 * s} ${x - 30 * s} ${y - 100 * s} C ${x - 5 * s} ${y - 96 * s} ${x} ${y - 75 * s} ${x} ${y - 65 * s} C ${x} ${y - 75 * s} ${x + 5 * s} ${y - 96 * s} ${x + 30 * s} ${y - 100 * s} C ${x + 90 * s} ${y - 110 * s} ${x + 120 * s} ${y - 10 * s} ${x} ${y + 60 * s} Z`;
      return (
        <g><Defs3 /><Back t={t} />
          <Mono x={CX} y={300} s={32} c={GD}>{`${at.filter((a) => t > a).length} / 3`}</Mono>
          {[0, 1, 2].map((i) => { const l = lit(t, at[i]); return <g key={i}>{l > 0 ? <circle cx={240 + i * 300} cy={690} r={150} fill="url(#g3)" opacity={l * 0.7} /> : null}<Ln d={heart(240 + i * 300, 690, 1.2)} p={ko(t, at[i] - 0.3, at[i] + 0.3)} l={l} w={4} /></g>; })}
        </g>
      );
    },
    /* 10 ----------------------------------------------------------- Father, Son, Holy Spirit */
    trinity: (p) => {
      const {t} = p;
      const at = [p.w('father', p.dur * 0.3), p.w('son', p.dur * 0.5), p.w('spirit', p.dur * 0.75)];
      const P = [[CX - 230, CY - 150], [CX + 230, CY - 150], [CX, CY + 250]];
      const L = at.map((a) => lit(t, a));
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="MATTHEW 28:19" />
          {P.map(([x, y], i) => <g key={i}><Ln d={`M ${x} ${y} m -125 0 a 125 125 0 1 0 250 0 a 125 125 0 1 0 -250 0`} p={lin(t, i * 0.2, 0.8 + i * 0.2)} l={L[i]} /><Mono x={x} y={y + 12} s={32} c={L[i] > 0.5 ? GD : WH} o={0.4 + 0.6 * L[i]}>{X.trinity[i]}</Mono></g>)}
          <circle cx={CX} cy={CY} r={70} fill="none" stroke={GD} strokeWidth={3} opacity={Math.min(...L)} filter="url(#l3)" />
          <Mono x={CX} y={CY + 12} s={34} c={GD} o={Math.min(...L)}>{X.trinity[3]}</Mono>
        </g>
      );
    },
    /* 11 ----------------------------------------------------------- red, yellow, blue */
    colours: (p) => {
      const {t} = p;
      const at = [p.w('red', p.dur * 0.6), p.w('yellow', p.dur * 0.72), p.w('blue', p.dur * 0.85)];
      const C = [['#E0473C', CX - 120, CY - 90], ['#F4C542', CX + 120, CY - 90], ['#3C7BE0', CX, CY + 120]] as const;
      return (
        <g><Defs3 /><Back t={t} />
          <g style={{mixBlendMode: 'screen'}}>{C.map(([c, x, y], i) => <circle key={i} cx={x} cy={y} r={200} fill={c} opacity={0.55 * lit(t, at[i])} />)}</g>
          {C.map(([c, x, y], i) => <g key={i}><Ln d={`M ${x} ${y} m -200 0 a 200 200 0 1 0 400 0 a 200 200 0 1 0 -400 0`} p={lin(t, i * 0.3, 1 + i * 0.3)} w={3} /><Mono x={x + (i === 0 ? -120 : i === 1 ? 120 : 0)} y={y + (i === 2 ? 140 : -100)} s={30} c={WH} o={0.3 + 0.7 * lit(t, at[i])}>{X.colours[i]}</Mono></g>)}
        </g>
      );
    },
    /* 12 ----------------------------------------------------------- birth, life, death / past, present, future */
    life: (p) => <g><Defs3 /><Back t={p.t} /><Tri2 p={p} a={['birth', 'life', 'death']} b={['past', 'present', 'future']} la={X.life} lb={X.time} head={['3 · 01', '3 · 02']}
      icon={(t, second) => second
        ? <g>{[0, 1, 2].map((i) => <circle key={i} cx={CX - 120 + i * 120} cy={CY - 20} r={18 + i * 6} fill="none" stroke={WH} strokeWidth={2.5} opacity={0.6} />)}</g>
        : <Ln d={`M ${CX - 200} ${CY - 20} L ${CX - 90} ${CY - 20} L ${CX - 50} ${CY - 120} L ${CX} ${CY + 60} L ${CX + 40} ${CY - 20} L ${CX + 200} ${CY - 20}`} p={lin(t, 0.4, p.dur * 0.5)} l={0.7} w={3} />} /></g>,
    /* 13 ----------------------------------------------------------- time, space, matter / ice, water, steam */
    matter: (p) => <g><Defs3 /><Back t={p.t} /><Tri2 p={p} a={['time', 'space', 'matter']} b={['ice', 'water', 'steam']} la={X.matter} lb={X.water} head={['3 · 03', '3 · 04']}
      icon={(t, second) => second
        ? <g><Ln d={`M ${CX} ${CY - 110} Q ${CX + 70} ${CY - 10} ${CX + 55} ${CY + 30} Q ${CX} ${CY + 90} ${CX - 55} ${CY + 30} Q ${CX - 70} ${CY - 10} ${CX} ${CY - 110} Z`} l={0.5} w={3} />{[0, 1, 2].map((i) => <Ln key={i} d={`M ${CX - 30 + i * 30} ${CY - 140 - ((t * 40 + i * 20) % 60)} q 10 -15 0 -30`} w={2} />)}</g>
        : <g>{Array.from({length: 6}).map((_, i) => <line key={i} x1={CX - 150 + i * 60} y1={CY - 100} x2={CX - 150 + i * 60 + 40} y2={CY + 60} stroke="#4A7BD8" strokeWidth={2} opacity={0.7} />)}{Array.from({length: 5}).map((_, i) => <line key={i} x1={CX - 150 + i * 8} y1={CY - 100 + i * 40} x2={CX + 150 + i * 8} y2={CY - 100 + i * 40} stroke="#4A7BD8" strokeWidth={2} opacity={0.7} />)}</g>} /></g>,
    /* 14 ----------------------------------------------------------- height, width, depth / body, soul, spirit */
    depth: (p) => <g><Defs3 /><Back t={p.t} /><Tri2 p={p} a={['height', 'width', 'depth']} b={['body', 'soul', 'spirit']} la={X.depth} lb={X.person} head={['3 · 05', '3 · 06']}
      icon={(t, second) => second
        ? <g><Fig x={CX} y={CY + 130} s={0.75} l={0.3} /><circle cx={CX} cy={CY - 20} r={12} fill={GD} filter="url(#l3)" opacity={0.6 + 0.4 * Math.sin(t * 4)} /></g>
        : <Ln d={`M ${CX - 90} ${CY - 40} l 120 0 l 0 120 l -120 0 Z m 0 0 l 60 -50 l 120 0 l -60 50 m 60 -50 l 0 120 l -60 50`} l={0.5} w={3} p={lin(t, 0.3, 1.5)} />} /></g>,
    /* 15 ----------------------------------------------------------- father, mother, child */
    family: (p) => {
      const {t} = p;
      const at = [p.w('father', 0.3), p.w('mother', p.dur * 0.4), p.w('child', p.dur * 0.7)];
      const L = at.map((a) => lit(t, a));
      return (
        <g><Defs3 /><Back t={t} />
          <Ln d={`M 300 560 L 780 560 L 540 830 Z`} p={lin(t, 0, 1)} l={Math.min(...L) * 0.8} w={2} />
          <Fig x={300} y={980} s={1.1} l={L[0]} /><Fig x={780} y={980} s={1.0} l={L[1]} /><Fig x={540} y={1080} s={0.65} l={L[2]} />
          {[[300, 1050], [780, 1050], [540, 1150]].map(([x, y], i) => <Mono key={i} x={x} y={y} s={30} c={L[i] > 0.5 ? GD : WH} o={0.3 + 0.7 * L[i]}>{X.family[i]}</Mono>)}
        </g>
      );
    },
    /* 16 ----------------------------------------------------------- Gethsemane: prayed three times */
    garden: (p) => {
      const {t} = p;
      const n = counter(t, p.dur);
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="MARK 14:35-41" />
          <Mono x={CX} y={300} s={34} c={GD}>{`${X.pray[0]} ${n} ${X.of[0]} 3`}</Mono>
          <circle cx={240} cy={470} r={70} fill="#E8E2D0" opacity={0.85} /><circle cx={240} cy={470} r={170} fill="url(#g3)" opacity={0.25} />
          <Ln d="M 60 1000 L 1020 1000" w={2} />
          <Ln d="M 860 1000 Q 850 800 880 700 M 880 700 q -80 -40 -130 -10 M 880 700 q 70 -60 120 -30 M 870 760 q -60 0 -90 30" w={2.5} />
          <g transform={`translate(${CX - 40} 1000)`}><Ln d="M -150 0 Q -120 -60 -40 -70 Q 40 -75 90 -30 L 110 0 M 130 -40 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0" l={0.5} w={3} /></g>
          <Ln d="M 300 1000 Q 320 940 400 950 Q 440 960 450 1000" w={2} />
        </g>
      );
    },
    /* 17 ----------------------------------------------------------- Peter, James, John asleep */
    asleep: (p) => {
      const {t} = p;
      const at = [p.w('peter', 0.5), p.w('james', 1.0), p.w('john', 1.5)];
      const zz = p.w('asleep', p.dur * 0.8);
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="MARK 14:37-41" />
          <Mono x={CX} y={300} s={34} c={GD} o={ko(t, zz - 0.2, zz + 0.3)}>{`${X.asleep[0]} 1 · 2 · 3`}</Mono>
          <Ln d="M 60 1000 L 1020 1000" w={2} />
          {['PETER', 'JAMES', 'JOHN'].map((nm, i) => { const l = lit(t, at[i]); return <g key={i}><Fig x={250 + i * 290} y={985} s={0.6} rot={-80} l={l} /><Mono x={250 + i * 290 - 30} y={1060} s={28} c={l > 0.5 ? GD : WH} o={0.4 + 0.6 * l}>{nm}</Mono>{t > zz ? <Mono x={250 + i * 290 + 20} y={880 - ((t * 30 + i * 15) % 60)} s={30} o={0.7}>z</Mono> : null}</g>; })}
        </g>
      );
    },
    /* 18 ----------------------------------------------------------- death, burial, resurrection */
    saved: (p) => {
      const {t} = p;
      const at = [p.w('death', p.dur * 0.6), p.w('burial', p.dur * 0.72), p.w('resurrection', p.dur * 0.86)];
      return <g><Defs3 /><Back t={t} /><Tag t={t} txt="1 CORINTHIANS 15:3-4" y={300} /><Tri t={t} at={at} lab={X.saved} head="3 · 07" draw={lin(t, 0, 1)}><Ln d={cross(CX, CY + 120, 0.6)} l={lit(t, at[2])} w={4} /></Tri></g>;
    },
    /* 19 ----------------------------------------------------------- completeness */
    complete: (p) => {
      const {t} = p;
      const a = p.w('completeness', p.dur * 0.35), b = p.w('settled', p.dur * 0.85);
      const P = [[CX, CY - 300], [CX + 300, CY + 220], [CX - 300, CY + 220]];
      const side = (i: number) => lin(t, 0.3 + i * (a - 0.3) / 3, 0.3 + (i + 1) * (a - 0.3) / 3);
      return (
        <g><Defs3 /><Back t={t} />
          {[0, 1, 2].map((i) => <Ln key={i} d={`M ${P[i][0]} ${P[i][1]} L ${P[(i + 1) % 3][0]} ${P[(i + 1) % 3][1]}`} p={side(i)} l={lit(t, a)} w={4} />)}
          {P.map(([x, y], i) => <Dot key={i} x={x} y={y} l={lit(t, a)} />)}
          <Ln d={`M ${CX} ${CY + 47} m -173 0 a 173 173 0 1 0 346 0 a 173 173 0 1 0 -346 0`} p={ko(t, b - 0.3, b + 0.6)} l={lit(t, b)} w={3} />
          <Mono x={CX} y={CY + 62} s={44} c={GD} o={lit(t, b)}>{X.complete[0]}</Mono>
        </g>
      );
    },
    /* 20 ----------------------------------------------------------- Holy, holy, holy */
    holy: (p) => {
      const {t} = p;
      const at = [p.w('holy', p.dur * 0.5), p.w('holy2', p.dur * 0.65), p.w('holy3', p.dur * 0.8)];
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="ISAIAH 6:3" />
          {Array.from({length: 7}).map((_, i) => <polygon key={i} points={`${CX - 12 + i * 4},120 ${CX + 12 + i * 4},120 ${CX + (i - 3) * 170 + 60},1100 ${CX + (i - 3) * 170 - 60},1100`} fill={GD} opacity={0.05 + 0.05 * lit(t, at[2])} />)}
          {[0, 1, 2].map((i) => { const l = lit(t, at[i]); return <g key={i}><circle cx={CX} cy={480 + i * 210} r={90 + l * 40} fill="url(#g3)" opacity={l * 0.6} /><Mono x={CX} y={500 + i * 210} s={70} c={l > 0.5 ? GD : WH} o={0.15 + 0.85 * l}>{X.holy[i]}</Mono></g>; })}
        </g>
      );
    },
    /* 21 ----------------------------------------------------------- a blessing in three */
    blessing: (p) => {
      const {t} = p;
      const a = p.w('three', p.dur * 0.4);
      return (
        <g><Defs3 /><Back t={t} />
          <Ln d="M 120 1000 L 960 1000" w={2} />
          <Fig x={CX} y={1000} s={1.1} p={lin(t, 0, 1.2)} />
          {[-160, 0, 160].map((dx, i) => <Dot key={i} x={CX + dx} y={400 - (i === 1 ? 60 : 0)} l={lit(t, a + i * 0.3)} r={7} />)}
        </g>
      );
    },
    /* 22 ----------------------------------------------------------- In the name of the Father, the Son, the Holy Spirit. Amen. */
    bless: (p) => {
      const {t} = p;
      const at = [p.w('father', p.dur * 0.3), p.w('son', p.dur * 0.45), p.w('spirit', p.dur * 0.65)];
      const amen = p.w('amen', p.dur * 0.85);
      const L = at.map((a) => lit(t, a));
      const A = lit(t, amen);
      const top: [number, number] = [CX, 330], bl: [number, number] = [160, 1000], br: [number, number] = [920, 1000];
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="MATTHEW 28:19" y={260} />
          <Ln d={`M 120 1000 A 420 600 0 0 1 960 1000`} p={lin(t, 0, 1.2)} w={2} l={A * 0.5} />
          {[0.25, 0.5, 0.75].map((f, i) => <ellipse key={i} cx={CX} cy={1000} rx={420} ry={600 * f} fill="none" stroke={WH} strokeWidth={1} opacity={0.15} />)}
          <Ln d={`M ${bl[0]} ${bl[1]} L ${top[0]} ${top[1]} L ${br[0]} ${br[1]}`} p={lin(t, 0.4, 1.6)} l={Math.min(...L) * 0.8} w={2.5} />
          <Dot x={top[0]} y={top[1]} l={L[0]} /><Dot x={bl[0]} y={bl[1]} l={L[1]} /><Dot x={br[0]} y={br[1]} l={L[2]} />
          <Mono x={top[0]} y={top[1] - 40} s={30} c={L[0] > 0.5 ? GD : WH} o={0.4 + 0.6 * L[0]}>{X.bless[0]}</Mono>
          <Mono x={bl[0]} y={bl[1] + 60} s={30} a="start" c={L[1] > 0.5 ? GD : WH} o={0.4 + 0.6 * L[1]}>{X.bless[1]}</Mono>
          <Mono x={br[0]} y={br[1] + 60} s={30} a="end" c={L[2] > 0.5 ? GD : WH} o={0.4 + 0.6 * L[2]}>{X.bless[2]}</Mono>
          <circle cx={CX} cy={760} r={120 + A * 380} fill="url(#g3)" opacity={A * 0.8} />
          <Fig x={CX} y={1000} s={1.0} l={Math.max(A, 0.2)} />
        </g>
      );
    },
    /* 23 ----------------------------------------------------------- end card: share it with three (art sits under the title) */
    end: (p) => {
      const {t} = p;
      const at = [p.w('friends', p.dur * 0.35), p.w('family', p.dur * 0.5), p.w('word', p.dur * 0.8)];
      const C: [number, number] = [CX, 1500];
      const P = [[200, 1470], [880, 1470], [540, 1830]];
      return (
        <g><Defs3 /><Back t={t} />
          <circle cx={C[0]} cy={C[1]} r={130} fill="url(#g3)" opacity={0.7} /><Fig x={C[0]} y={C[1] + 70} s={0.4} l={1} />
          {P.map(([x, y], i) => { const l = lit(t, at[i]); return <g key={i}><Ln d={`M ${C[0]} ${C[1]} L ${x} ${y - 70}`} p={l} l={l} w={2.5} /><Fig x={x} y={y} s={0.32} l={l} /><Mono x={x} y={y + 40} s={24} c={l > 0.5 ? GD : WH} o={0.3 + 0.7 * l}>{X.end[i]}</Mono></g>; })}
        </g>
      );
    },
  };
  return S;
};
