import React from 'react';
import {FRIENDS, INK, JESUS, Look} from '../v8/fig';
import {C3, Cam, Glow, SP, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Hand} from '../v11/anime';
import {Bean, RDEFS} from '../v11/room';
import {AP, Bust, Sky} from '../v12/scenes';
import {Street} from '../v15/scenes';

/** Episode 12 — "Who Do You Say I Am?" (Mark 8). Big moment: the blind man's blurred world snaps into focus on "clearly". */
export const BLIND: Look = {skin: '#C98E64', hair: '#4A3020', tunic: '#8A7A5A', sash: '#5A4A2A', style: 'short', beard: true};
const PETER = AP.simon;
const TOWN = (i: number): Look => ({...FRIENDS[i % 4], tunic: ['#A8794A', '#6A7A5A', '#8A5A5A', '#5A6A8A', '#9A8A5A', '#7A5A7A'][i % 6]});
const Loaf: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M -50 0 Q -46 -36 0 -38 Q 46 -36 50 0 Z" fill="#D99848" stroke="#5a2f12" strokeWidth={5} />
);
const Basket: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-30, 0, 30].map((dx, i) => <Loaf key={i} x={dx} y={-58 - (i === 1 ? 10 : 0)} s={0.55} />)}
    <path d="M -70 -60 L 70 -60 L 55 0 L -55 0 Z" fill="#B07A3A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {[-40, -20, 0, 20, 40].map((dx) => <line key={dx} x1={dx} y1={-58} x2={dx * 0.8} y2={-2} stroke="#7A4E20" strokeWidth={3} />)}
    <line x1={-66} y1={-30} x2={66} y2={-30} stroke="#7A4E20" strokeWidth={3} />
  </g>
);
const Hills: React.FC<{dusk?: number}> = ({dusk = 0}) => (
  <g>
    <Sky dusk={dusk} />
    <g filter="url(#dof)"><path d="M -3000 300 Q -1200 80 -300 220 Q 600 60 1600 240 Q 2400 120 3000 260 L 3000 3000 L -3000 3000 Z" fill="#8A9A6A" /></g>
    <rect x={-3000} y={330} width={6000} height={3000} fill="#A8A06A" />
    <path d="M -3000 330 L 3000 330" stroke="#6A6A3A" strokeWidth={6} />
  </g>
);
const Road: React.FC = () => (
  <g>
    <Sky dusk={0.1} />
    <g filter="url(#dof)"><path d="M -3000 280 Q -1500 40 -600 200 Q 0 100 700 210 Q 1600 60 3000 240 L 3000 3000 L -3000 3000 Z" fill="#9A8A7A" /></g>
    <rect x={-3000} y={330} width={6000} height={3000} fill="#C2A47A" />
    <path d="M -3000 900 Q 0 480 3000 900 L 3000 1100 Q 0 640 -3000 1100 Z" fill="#D8BC90" opacity={0.7} />
  </g>
);
const Rays: React.FC<{o: number; n?: number; col?: string}> = ({o, n = 7, col = '#FFF6D0'}) => (
  <g>{Array.from({length: n}).map((_, i) => <polygon key={i} points={`${-60 + i * 20},-1700 ${60 + i * 20},-1700 ${(i - (n - 1) / 2) * 360 + 170},1300 ${(i - (n - 1) / 2) * 360 - 170},1300`} fill={col} opacity={0.1 * o} />)}</g>
);
const Blur: React.FC<{v: number; children: React.ReactNode}> = ({v, children}) => (
  <g>
    <defs><filter id="pov" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={Math.max(0.01, v)} /></filter></defs>
    <g filter={v > 0.05 ? 'url(#pov)' : undefined}>{children}</g>
  </g>
);
/** what the blind man sees: people with leafy tree-tops, walking */
const Village: React.FC<{t: number; trees: number}> = ({t, trees}) => (
  <g>
    <Street t={t} />
    {Array.from({length: 6}).map((_, i) => {
      const x = -700 + ((i * 280 + t * (i % 2 ? 60 : -50)) % 1500 + 1500) % 1500;
      return (
        <g key={i}>
          <Bean x={x} y={700 + (i % 2) * 40} s={0.95} flip={i % 2 === 1} look={TOWN(i)} t={t + i} walk={1.4} face={{eyes: 'open', mouth: 'smile'}} />
          {trees > 0 ? <g opacity={trees}><rect x={x - 12} y={700 + (i % 2) * 40 - 560} width={24} height={300} fill="#5A3A20" /><circle cx={x} cy={700 + (i % 2) * 40 - 560} r={130} fill="#4E7A3A" /><circle cx={x - 70} cy={700 + (i % 2) * 40 - 500} r={90} fill="#5E8A44" /><circle cx={x + 75} cy={700 + (i % 2) * 40 - 510} r={95} fill="#467034" /></g> : null}
        </g>
      );
    })}
  </g>
);

/* 1 ------------------------------------------------------------------ the hungry crowd, three days */
const Crowd: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-100, 100, t / p.dur), y: 200, z: 1.0};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Hills dusk={0.25} />
      {Array.from({length: 14}).map((_, i) => <Bean key={i} x={-900 + (i % 7) * 300 + (i > 6 ? 150 : 0)} y={i > 6 ? 860 : 640} s={i > 6 ? 0.95 : 0.8} sit look={TOWN(i)} t={t + i} face={{eyes: 'half', mouth: i % 3 ? 'flat' : 'frown', brow: -0.3}} />)}
      <Bean x={0} y={560} s={0.85} look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', brow: 0.2}} />
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ "I have compassion…" */
const Pity: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.12, t / p.dur)}} p={p}>{RDEFS}<Hills dusk={0.25} /><g filter="url(#dof)"><Glow x={-300} y={-300} r={600} o={0.6} /></g><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t < p.dur - 0.5 && Math.sin(t * 12) > 0 ? 'open' : 'flat', brow: 0.6, look: [1, 0.3]}} /></Cam>;
};

/* 3 ------------------------------------------------------------------ seven loaves → four thousand eat */
const Seven: React.FC<SP> = (p) => {
  const {t} = p;
  const th = p.w('thousand', p.dur * 0.8);
  const fly = ko(t, th - 0.3, th + 1.2);
  return (
    <Cam c={{x: 0, y: lerp(260, 160, fly), z: lerp(1.5, 1.05, fly)}} p={p}>
      {RDEFS}<Hills dusk={0.15} />
      {fly > 0 ? Array.from({length: 12}).map((_, i) => <Bean key={i} x={[-1000, -720, -440, 440, 720, 1000][i % 6]} y={i > 5 ? 900 : 650} s={0.8} sit look={TOWN(i)} t={t + i} arms="offer" hold={<Loaf x={0} y={0} s={0.5} />} face={{eyes: Math.sin(t * 3 + i) > 0.5 ? 'closed' : 'open', mouth: 'smile'}} />) : null}
      <Bean x={0} y={720} s={1.05} look={JESUS} t={t} arms={t > p.dur * 0.35 ? 'up' : 'offer'} face={{eyes: t > p.dur * 0.35 && t < th ? 'closed' : 'open', mouth: 'smile', look: [0, -0.5]}} />
      <rect x={-330} y={770} width={660} height={34} rx={14} fill="#E8DCC0" stroke={INK} strokeWidth={5} />
      {Array.from({length: 7}).map((_, i) => <g key={i} opacity={1 - fly * 0.7}><Loaf x={-270 + i * 90} y={772} s={0.75} /></g>)}
      {fly > 0 && fly < 1 ? Array.from({length: 14}).map((_, i) => { const a = (i / 14) * Math.PI * 2; return <Loaf key={i} x={Math.cos(a) * 900 * fly} y={700 + Math.sin(a) * 300 * fly - 300 * Math.sin(Math.PI * fly)} s={0.5} />; }) : null}
      <Glow x={0} y={600} r={300 + fly * 600} o={fly * 0.4} />
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ seven baskets left over */
const Baskets: React.FC<SP> = (p) => {
  const {t} = p;
  const step = (p.dur - 0.8) / 7;
  return (
    <Cam c={{x: 0, y: 300, z: 1.3}} p={p}>
      {RDEFS}<Hills dusk={0.2} />
      {[-200, 180].map((x, i) => <Bean key={i} x={x} y={330} s={0.7} look={AP[i ? 'andrew' : 'john']} t={t + i} arms="offer" face={{eyes: 'wide', mouth: 'open', look: [0, 1]}} />)}
      {Array.from({length: 7}).map((_, i) => { const a = ko(t, 0.4 + i * step, 0.7 + i * step); return a > 0 ? <g key={i} transform={`translate(${-336 + i * 112} ${480 - (1 - a) * 80}) scale(${a})`}><Basket x={0} y={0} s={0.76} /><text x={0} y={-120} fontFamily="Fredoka" fontWeight={700} fontSize={50} fill="#FFDD33" stroke={INK} strokeWidth={8} paintOrder="stroke" textAnchor="middle">{i + 1}</text></g> : null; })}
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ Bethsaida: a blind man is brought */
const Blind: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-80, 60, t / p.dur), y: 220, z: 1.3};
  const walk = 1 - ko(t, p.dur * 0.55, p.dur * 0.75);
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Street t={t} />
      <Bean x={lerp(-700, -180, ko(t, 0, p.dur * 0.7))} y={700} s={0.95} look={TOWN(2)} t={t} walk={walk * 1.4} arms="reach" face={{eyes: 'open', mouth: 'open', look: [1, 0]}} />
      <Bean x={lerp(-880, -360, ko(t, 0, p.dur * 0.7))} y={700} s={1.0} look={BLIND} t={t + 1} walk={walk * 1.2} arms="reach" face={{eyes: 'closed', mouth: 'flat', brow: -0.3}} />
      <Bean x={lerp(-1060, -540, ko(t, 0, p.dur * 0.7))} y={700} s={0.95} look={TOWN(4)} t={t + 2} walk={walk * 1.4} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />
      <Bean x={260} y={700} s={1.0} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ hands on his eyes */
const Spit: React.FC<SP> = (p) => {
  const {t} = p;
  const ey = p.w('eyes', p.dur * 0.6);
  const reach = ko(t, ey - 0.8, ey);
  return (
    <Cam c={{x: 0, y: -30, z: 1.95}} p={p}>
      {RDEFS}<Hills dusk={0.2} /><g filter="url(#dof)"><Glow x={300} y={-300} r={600} o={0.5} /></g>
      <Bust x={0} y={0} look={BLIND} t={t} face={{eyes: 'closed', mouth: 'flat', brow: -0.2, look: [1, 0]}} />
      {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * lerp(520, 95, reach)} ${lerp(600, -110, reach)}) scale(0.7) rotate(${sd * -120})`}><Hand withered={0} curl={0.4} spread={0.5} skin="#E0A878" sleeve={JESUS.tunic} /></g>)}
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ "Do you see anything?" */
const Ask: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(2.0, 2.12, t / p.dur)}} p={p}>{RDEFS}<Hills dusk={0.2} /><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.3 ? 'open' : 'smile', brow: 0.5, look: [1, 0.2]}} /></Cam>;
};

/* 8 ------------------------------------------------------------------ POV: people like trees, walking */
const Trees: React.FC<SP> = (p) => {
  const {t} = p;
  const tr = ko(t, p.w('trees', p.dur * 0.5) - 0.4, p.w('trees', p.dur * 0.5) + 0.4);
  return (
    <Cam c={{x: Math.sin(t * 0.8) * 40, y: 160, z: 1.1}} p={p}>
      {RDEFS}
      <Blur v={14}><Village t={t} trees={0.35 + 0.5 * tr} /></Blur>
      <rect x={-3000} y={-3000} width={6000} height={6000} fill="#F4EEDC" opacity={0.22} />
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ second touch → everything clear (BIG MOMENT) */
const Clear: React.FC<SP> = (p) => {
  const {t} = p;
  const cl = p.w('clearly', p.dur * 0.8);
  const pov = t > cl - 1.6;
  if (!pov) {
    const reach = ko(t, 0.2, 1.2);
    return (
      <Cam c={{x: 0, y: -30, z: lerp(1.95, 2.1, t / cl)}} p={p}>
        {RDEFS}<Hills dusk={0.2} /><g filter="url(#dof)"><Glow x={300} y={-300} r={600} o={0.5} /></g>
        <Bust x={0} y={0} look={BLIND} t={t} face={{eyes: 'closed', mouth: 'flat', brow: 0.2, look: [1, 0]}} />
        {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * lerp(520, 95, reach)} ${lerp(600, -110, reach)}) scale(0.7) rotate(${sd * -120})`}><Hand withered={0} curl={0.4} spread={0.5} skin="#E0A878" sleeve={JESUS.tunic} /></g>)}
        <Glow x={0} y={-110} r={200 + reach * 200} o={reach * 0.5} id="gWhite" />
      </Cam>
    );
  }
  const f = k(t, cl - 1.6, cl);
  const flash = Math.max(0, 1 - Math.abs(t - cl) / 0.35);
  return (
    <Cam c={{x: 0, y: 160, z: lerp(1.2, 1.05, ko(t, cl, p.dur))}} p={p}>
      {RDEFS}
      <Blur v={14 * (1 - f)}><Village t={t + 3} trees={0.6 * (1 - f)} /></Blur>
      <rect x={-3000} y={-3000} width={6000} height={6000} fill="#F4EEDC" opacity={0.22 * (1 - f)} />
      <rect x={-3000} y={-3000} width={6000} height={6000} fill="#FFFBEA" opacity={flash * 0.7} />
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- on the road: "Who do people say I am?" */
const Who: React.FC<SP> = (p) => {
  const {t} = p;
  const stop = ko(t, p.dur * 0.35, p.dur * 0.55);
  return (
    <Cam c={{x: lerp(-60, 60, t / p.dur), y: 220, z: lerp(1.05, 1.3, stop)}} p={p}>
      {RDEFS}<Road />
      {['simon', 'andrew', 'james', 'john'].map((n, i) => <Bean key={n} x={-680 + i * 170 + (1 - stop) * t * 30} y={700 + (i % 2) * 30} s={0.9} look={AP[n]} t={t + i} walk={(1 - stop) * 1.3} face={{eyes: 'open', mouth: 'flat', look: [1, 0]}} />)}
      <Bean x={300 + (1 - stop) * t * 30} y={700} s={1.0} flip={stop > 0.5} look={JESUS} t={t} walk={(1 - stop) * 1.3} arms={stop > 0.5 ? 'offer' : 'none'} face={{eyes: 'open', mouth: stop > 0.5 && Math.sin(t * 11) > 0 ? 'open' : 'smile', look: [-1, 0]}} />
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- "John the Baptist… Elijah… a prophet" */
const Say: React.FC<SP> = (p) => {
  const {t} = p;
  const at = [p.w('john', p.dur * 0.2), p.w('elijah', p.dur * 0.5), p.w('prophets', p.dur * 0.82)];
  const icon = (i: number) => i === 0
    ? <g><path d="M -60 20 q 30 -30 60 0 t 60 0" fill="none" stroke="#3C8AD0" strokeWidth={10} strokeLinecap="round" /><path d="M 0 -60 Q 30 -20 22 0 Q 0 26 -22 0 Q -30 -20 0 -60 Z" fill="#7EC8F0" stroke={INK} strokeWidth={5} /></g>
    : i === 1
    ? <g>{[-1, 0, 1].map((j) => <path key={j} d={`M ${j * 26 - 18} 40 Q ${j * 26 - 10} -30 ${j * 26} -70 Q ${j * 26 + 10} -30 ${j * 26 + 18} 40 Z`} fill={j ? '#F08A3A' : '#FFD24A'} stroke={INK} strokeWidth={4} />)}</g>
    : <g><rect x={-60} y={-40} width={120} height={80} rx={10} fill="#F2E2B8" stroke={INK} strokeWidth={5} />{[-20, 0, 20].map((y) => <line key={y} x1={-38} y1={y} x2={38} y2={y} stroke="#8A6A3A" strokeWidth={4} />)}<circle cx={-62} cy={0} r={16} fill="#C89A5A" stroke={INK} strokeWidth={4} /><circle cx={62} cy={0} r={16} fill="#C89A5A" stroke={INK} strokeWidth={4} /></g>;
  return (
    <Cam c={{x: 0, y: -40, z: 1.9}} p={p}>
      {RDEFS}<Road />
      <Bust x={0} y={60} look={AP.john} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'smile', brow: 0.2, look: [0.3, -0.4]}} />
      {[-200, 0, 200].map((x, i) => { const a = ko(t, at[i] - 0.2, at[i] + 0.3); return a > 0 ? <g key={i} transform={`translate(${x} ${-300 - (i === 1 ? 50 : 0)}) scale(${a})`}><circle r={95} fill="#FFFBEA" stroke={INK} strokeWidth={7} />{icon(i)}</g> : null; })}
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- "But who do YOU say I am?" */
const You: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -60, z: lerp(2.1, 2.5, k(t, 0, p.dur))}} p={p}>
      {RDEFS}<Road /><rect x={-3000} y={-3000} width={6000} height={6000} fill="#1a1020" opacity={0.25} />
      <g filter="url(#dof)"><Glow x={0} y={-100} r={500} o={0.5} /></g>
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t < p.dur - 0.6 && Math.sin(t * 11) > 0 ? 'open' : 'flat', brow: 0.4, look: [0, 0.2]}} />
    </Cam>
  );
};

/* 13 ----------------------------------------------------------------- Peter: "You are the Messiah." */
const PeterSc: React.FC<SP> = (p) => {
  const {t} = p;
  const m = p.w('messiah', p.dur * 0.5);
  const g = ko(t, m - 0.1, m + 0.6);
  return (
    <Cam c={{x: 0, y: -30, z: lerp(2.0, 2.15, t / p.dur)}} p={p}>
      {RDEFS}<Road /><Rays o={g} />
      <Glow x={0} y={-60} r={300 + g * 500} o={0.2 + g * 0.5} id="gWhite" />
      <Bust x={0} y={0} look={PETER} t={t} face={{eyes: g > 0.3 ? 'wide' : 'open', mouth: Math.sin(t * 12) > 0 && t < m + 0.5 ? 'open' : 'smile', brow: 0.5, look: [0, -0.2]}} />
    </Cam>
  );
};

/* 14 ----------------------------------------------------------------- suffer, be killed, rise after three days */
const Suffer: React.FC<SP> = (p) => {
  const {t} = p;
  const r = p.w('rise', p.dur * 0.85);
  const sun = ko(t, r - 0.2, r + 1.0);
  return (
    <Cam c={{x: 0, y: 100, z: 1.15}} p={p}>
      {RDEFS}<Sky dusk={0.85 - 0.6 * sun} />
      <circle cx={0} cy={320} r={200} fill="#FFE2B0" opacity={sun} /><Glow x={0} y={300} r={300 + sun * 900} o={sun * 0.8} />
      <path d="M -3000 360 Q -400 180 0 200 Q 400 180 3000 360 L 3000 3000 L -3000 3000 Z" fill="#2A1A24" />
      {[-300, 0, 300].map((x, i) => <path key={i} d={`M ${x - 12} 200 L ${x - 12} ${-120 - (i === 1 ? 80 : 0)} M ${x - 90} ${-40 - (i === 1 ? 80 : 0)} L ${x + 66} ${-40 - (i === 1 ? 80 : 0)}`} stroke="#120A10" strokeWidth={26} strokeLinecap="round" opacity={0.95 - sun * 0.4} />)}
      {[0, 1, 2].map((i) => { const a = ko(t, r - 1.6 + i * 0.35, r - 1.3 + i * 0.35); return <text key={i} x={-160 + i * 160} y={720} fontFamily="Fredoka" fontWeight={700} fontSize={90} fill="#FFDD33" stroke={INK} strokeWidth={10} paintOrder="stroke" textAnchor="middle" opacity={a}>{i + 1}</text>; })}
    </Cam>
  );
};

/* 15 ----------------------------------------------------------------- Peter pulls him aside and rebukes him */
const Rebuke: React.FC<SP> = (p) => {
  const {t} = p;
  const pull = ko(t, 0.3, 1.6);
  return (
    <Cam c={{x: lerp(0, 120, pull), y: 220, z: 1.35}} p={p}>
      {RDEFS}<Road />
      {['andrew', 'james', 'john'].map((n, i) => <Bean key={n} x={-620 + i * 160} y={690} s={0.85} look={AP[n]} t={t + i} face={{eyes: 'open', mouth: 'flat', look: [1, 0]}} dim={0.25} />)}
      <Bean x={lerp(60, 300, pull)} y={700} s={1.0} flip look={JESUS} t={t} walk={pull < 1 ? 1 : 0} face={{eyes: 'open', mouth: 'flat', brow: -0.2, look: [-1, 0]}} />
      <Bean x={lerp(-120, 110, pull)} y={700} s={1.0} look={PETER} t={t} arms={pull > 0.9 ? 'point' : 'reach'} face={{eyes: 'open', mouth: Math.sin(t * 13) > 0 ? 'open' : 'frown', brow: -0.8, look: [1, 0]}} />
    </Cam>
  );
};

/* 16 ----------------------------------------------------------------- "Get behind me, Satan!" */
const Satan: React.FC<SP> = (p) => {
  const {t} = p;
  const s = p.w('satan', p.dur * 0.25);
  const hit = Math.max(0, 1 - Math.abs(t - s) / 0.5);
  return (
    <Cam c={{x: Math.sin(t * 40) * 6 * hit, y: -20, z: lerp(2.05, 2.2, t / p.dur)}} p={p}>
      {RDEFS}<Road /><rect x={-3000} y={-3000} width={6000} height={6000} fill="#3a0a10" opacity={0.15 + 0.35 * hit} />
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'frown', brow: -0.9, look: [-1, 0]}} />
    </Cam>
  );
};

/* 17 ----------------------------------------------------------------- take up your cross and follow me */
const CrossSc: React.FC<SP> = (p) => {
  const {t} = p;
  const cr = p.w('cross', p.dur * 0.6);
  const g = ko(t, cr - 0.2, cr + 0.6);
  return (
    <Cam c={{x: lerp(80, -80, t / p.dur), y: 220, z: 1.15}} p={p}>
      {RDEFS}<Road />
      <g opacity={g}><Glow x={250} y={300} r={500} o={0.5} /><path d="M 250 700 L 250 160 M 120 290 L 380 290" stroke="#6E4A30" strokeWidth={34} strokeLinecap="round" /><path d="M 250 700 L 250 160 M 120 290 L 380 290" stroke="#FFDD33" strokeWidth={8} strokeLinecap="round" opacity={0.6} /></g>
      <Bean x={250} y={720} s={1.05} look={JESUS} t={t} arms="offer" face={{eyes: 'open', mouth: Math.sin(t * 11) > 0 ? 'open' : 'smile', look: [-1, 0]}} />
      {Array.from({length: 5}).map((_, i) => <Bean key={i} x={-120 - i * 170} y={700 + (i % 2) * 30} s={0.9} look={i < 2 ? AP[['simon', 'john'][i]] : TOWN(i)} t={t + i} walk={1.2} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />)}
    </Cam>
  );
};

/* 18 ----------------------------------------------------------------- gain the whole world, lose your soul */
const Soul: React.FC<SP> = (p) => {
  const {t} = p;
  const w = p.w('world', p.dur * 0.4), so = p.w('soul', p.dur * 0.85);
  const gold = ko(t, w - 0.3, w + 0.6);
  const lost = ko(t, so - 0.1, so + 1.4);
  return (
    <Cam c={{x: 0, y: 150, z: 1.35}} p={p}>
      {RDEFS}<Sky dusk={0.35} />
      <g transform="translate(0 640)">
        <circle cx={0} cy={0} r={230} fill="#3C7BB0" stroke={INK} strokeWidth={8} />
        <path d="M -150 -100 q 60 -40 110 10 q 40 40 -20 80 q -60 10 -90 -30 Z M 40 -160 q 80 10 110 80 q -30 40 -90 10 Z M 30 60 q 70 -10 100 40 q -40 70 -100 40 Z" fill="#6AA05A" />
        {Array.from({length: 26}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 420} cy={-200 - rnd(i + 5) * 140 + (1 - gold) * 300} r={30} fill="#F2C24A" stroke="#8A5A10" strokeWidth={5} opacity={gold} />)}
      </g>
      <Bean x={0} y={330} s={0.95} look={TOWN(5)} t={t} arms={lost > 0.2 ? 'reach' : 'up'} face={{eyes: lost > 0.2 ? 'wide' : 'closed', mouth: lost > 0.2 ? 'open' : 'smile', brow: lost > 0.2 ? -0.8 : 0.4, look: [0.5, -1]}} />
      <g transform={`translate(${lost * 260} ${40 - lost * 700})`} opacity={1 - lost * 0.6}><Glow x={0} y={0} r={90} o={0.9} id="gWhite" /><circle cx={0} cy={0} r={22} fill="#FFFBEA" /></g>
    </Cam>
  );
};

/* 19 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 0, z: 1}} p={p}>
      {RDEFS}<Sky dusk={0.5} />
      <circle cx={0} cy={420} r={240} fill="#FFE2B0" /><Glow x={0} y={420} r={800} o={0.6} />
      <path d="M -3000 640 Q -300 560 0 580 Q 300 560 3000 640 L 3000 3000 L -3000 3000 Z" fill="#2a1a20" />
      {[-1, 0, 1].map((i) => <Bean key={i} x={i * 140} y={640} s={0.5} look={i ? AP[i < 0 ? 'simon' : 'john'] : JESUS} t={t + i} walk={1} dim={0.75} />)}
    </Cam>
  );
};

export const SCENES12: Record<string, React.FC<SP>> = {crowd: Crowd, pity: Pity, seven: Seven, baskets: Baskets, blind: Blind, spit: Spit, ask: Ask, trees: Trees, clear: Clear, who: Who, say: Say, you: You, peter: PeterSc, suffer: Suffer, rebuke: Rebuke, satan: Satan, cross: CrossSc, soul: Soul, end: End};
