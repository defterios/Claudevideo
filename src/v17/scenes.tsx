import React from 'react';
import {FRIENDS, INK, JESUS, Look} from '../v8/fig';
import {C3, Cam, Fill, Glow, SP, Stars, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {AP, Bust, Sea, Sky} from '../v12/scenes';
import {BigBoat, Moon, Waves} from '../v13/scenes';

/** Episode 10 — "Walking on Water" (Mark 6:30-56). Big moment: "It is I" on the water. */
const CROWD = (i: number): Look => ({...FRIENDS[i % 4], tunic: ['#A8794A', '#6A7A5A', '#8A5A5A', '#5A6A8A', '#9A8A5A', '#7A5A7A'][i % 6]});
const CREW = ['simon', 'andrew', 'james', 'john'];
const Bread: React.FC<{x: number; y: number; s?: number; half?: number}> = ({x, y, s = 1, half = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((d) => <g key={d} transform={`translate(${d * half * 40} ${-half * 20}) rotate(${d * half * 15})`}><path d={d < 0 ? 'M 0 -34 Q -60 -40 -64 0 Q -60 26 0 26 Z' : 'M 0 -34 Q 60 -40 64 0 Q 60 26 0 26 Z'} fill="#D99848" stroke="#5a2f12" strokeWidth={6} strokeLinejoin="round" /></g>)}
    {half < 0.1 ? [-24, 0, 24].map((d) => <path key={d} d={`M ${d - 6} -24 q 8 12 12 26`} fill="none" stroke="#8a4f1c" strokeWidth={5} strokeLinecap="round" />) : null}
  </g>
);
const Fish: React.FC<{x: number; y: number; s?: number; flip?: boolean}> = ({x, y, s = 1, flip}) => (
  <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
    <path d="M -70 0 Q -10 -40 50 0 Q -10 40 -70 0 Z M 50 0 L 86 -28 L 80 0 L 86 28 Z" fill="#9AB0C0" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={-40} cy={-6} r={6} fill={INK} />
  </g>
);
const Basket: React.FC<{x: number; y: number; s?: number; full?: boolean}> = ({x, y, s = 1, full = true}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {full ? <g><Bread x={-24} y={-62} s={0.55} /><Bread x={26} y={-58} s={0.5} /><Fish x={0} y={-74} s={0.45} /></g> : null}
    <path d="M -80 -50 L 80 -50 L 60 30 L -60 30 Z" fill="#B88A4A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {[-30, -10].map((yy) => <line key={yy} x1={-74} y1={yy} x2={74} y2={yy} stroke="#7A5A2A" strokeWidth={4} />)}
  </g>
);
const Grass: React.FC<{y: number}> = ({y}) => (<rect x={-3000} y={y} width={6000} height={3000} fill="#7BAF5E" />);

/* 1 ------------------------------------------------------------------ the apostles come back */
const Back: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-100, 60, t / p.dur), y: 220, z: 1.3};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky /><Sea t={t} y={-120} />
      <rect x={-3000} y={360} width={6000} height={3000} fill="#C9A47A" />
      <Bean x={300} y={680} s={1.0} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
      {CREW.map((n, i) => <Bean key={n} x={lerp(-900, -300, ko(t, 0, 2.2)) + i * 150} y={690 + (i % 2) * 20} s={0.9} look={AP[n]} t={t + i} walk={t < 2.2 ? 1.4 : 0} arms={i === 3 ? 'up' : 'offer'} face={{eyes: 'open', mouth: Math.sin(t * 9 + i) > 0 ? 'open' : 'smile', look: [1, 0]}} />)}
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ "Come away… and rest a while" */
const Rest: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>
      {RDEFS}<Sky /><g filter="url(#dof)"><Sea t={t} y={200} /></g>
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t < p.dur - 0.6 && Math.sin(t * 11) > 0 ? 'open' : 'smile', brow: 0.2, look: [1, 0]}} />
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ the crowd runs ahead: 5000 */
const Run: React.FC<SP> = (p) => {
  const {t} = p;
  const th = p.w('thousand', p.dur * 0.8);
  const n = Math.floor(lerp(16, 40, k(t, 0.3, th)));
  const c: C3 = {x: lerp(-200, 200, t / p.dur), y: lerp(240, 60, k(t, 0, p.dur)), z: lerp(1.25, 0.8, k(t, 0, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky /><Sea t={t} y={-220} />
      <g transform={`translate(${lerp(-600, 600, t / p.dur)} 0)`}><BigBoat x={0} y={-150} sail /></g>
      <rect x={-3000} y={80} width={6000} height={3000} fill="#C9A47A" />
      {Array.from({length: n}).map((_, i) => { const row = i % 4; return <Bean key={i} x={-1400 + (i * 137) % 2800 + (t * 220) % 140} y={420 + row * 130} s={0.6 + row * 0.08} look={CROWD(i)} t={t + i} walk={2} face={{eyes: 'open', mouth: 'open', look: [1, 0]}} />; })}
      <text x={c.x} y={c.y - 520} textAnchor="middle" fontFamily="Anton" fontSize={300} fill="#FFDD33" stroke="#1c0d16" strokeWidth={20} paintOrder="stroke" opacity={ko(t, th - 0.1, th + 0.3)}>5000</text>
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ compassion: sheep without a shepherd */
const Sheep: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 160, z: lerp(1.15, 1.3, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky /><Grass y={360} />
      <Bean x={0} y={560} s={1.0} look={JESUS} t={t} arms="offer" face={{eyes: 'open', mouth: 'flat', brow: -0.3, look: [0, 0.5]}} />
      {Array.from({length: 14}).map((_, i) => <Bean key={i} x={-620 + (i % 7) * 205} y={780 + Math.floor(i / 7) * 150} s={0.85 + Math.floor(i / 7) * 0.1} sit look={CROWD(i)} t={t + i} face={{eyes: 'open', mouth: 'flat', look: [0, -0.6]}} />)}
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ "It's late. Send them away." */
const Late: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>
      {RDEFS}<Sky dusk={0.35} /><g filter="url(#dof)"><Grass y={200} /></g>
      <Bust x={0} y={0} look={AP.philip} t={t} face={{eyes: 'open', mouth: Math.sin(t * 13) > 0 ? 'open' : 'frown', brow: -0.5, look: [1, 0]}} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ "You give them something to eat." */
const You: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>
      {RDEFS}<Sky dusk={0.35} /><g filter="url(#dof)"><Grass y={200} /></g>
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t < p.dur - 0.5 && Math.sin(t * 12) > 0 ? 'open' : 'smile', brow: 0.4, look: [1, 0]}} />
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ five loaves, two fish */
const Loaves: React.FC<SP> = (p) => {
  const {t} = p;
  const f5 = p.w('five', p.dur * 0.35), f2 = p.w('two', p.dur * 0.7);
  return (
    <Cam c={{x: 0, y: 0, z: 1.55}} p={p}>
      {RDEFS}<Sky dusk={0.35} /><g filter="url(#dof)"><Grass y={-60} /></g>
      <ellipse cx={0} cy={140} rx={420} ry={90} fill="#B88A4A" stroke={INK} strokeWidth={8} />
      {[0, 1, 2, 3, 4].map((i) => { const o = ko(t, f5 + i * 0.08, f5 + 0.2 + i * 0.08); return o > 0 ? <g key={i} transform={`translate(0 ${(1 - o) * -60})`} opacity={o}><Bread x={-250 + i * 125} y={30} s={0.95} /></g> : null; })}
      {[0, 1].map((i) => { const o = ko(t, f2 + i * 0.1, f2 + 0.25 + i * 0.1); return o > 0 ? <g key={i} transform={`translate(0 ${(1 - o) * -60})`} opacity={o}><Fish x={-110 + i * 220} y={150} s={1.2} flip={i === 1} /></g> : null; })}
      <text x={-170} y={-150} textAnchor="middle" fontFamily="Anton" fontSize={200} fill="#FFDD33" stroke="#1c0d16" strokeWidth={14} paintOrder="stroke" opacity={ko(t, f5, f5 + 0.2)}>5</text>
      <text x={170} y={-150} textAnchor="middle" fontFamily="Anton" fontSize={200} fill="#FFDD33" stroke="#1c0d16" strokeWidth={14} paintOrder="stroke" opacity={ko(t, f2, f2 + 0.2)}>2</text>
    </Cam>
  );
};

/* 8 ------------------------------------------------------------------ he looks up, gives thanks, breaks the bread */
const Bless: React.FC<SP> = (p) => {
  const {t} = p;
  const bk = p.w('broke', p.dur * 0.7);
  const half = ko(t, bk, bk + 0.5);
  const c: C3 = {x: 0, y: lerp(100, -40, k(t, 0, p.dur)), z: lerp(1.5, 1.8, k(t, 0, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.3} />
      {Array.from({length: 7}).map((_, i) => <polygon key={i} points={`${-60 + i * 20},-1700 ${60 + i * 20},-1700 ${(i - 3) * 360 + 170},1300 ${(i - 3) * 360 - 170},1300`} fill="#FFF6D0" opacity={0.1 + half * 0.08} />)}
      <Glow x={0} y={-220} r={300 + half * 600} o={0.4 + half * 0.5} id="gWhite" />
      <Bean x={0} y={560} s={1.1} look={JESUS} t={t} arms="up" face={{eyes: t > bk - 1.5 ? 'closed' : 'open', mouth: 'smile', look: [0, -1]}} />
      <Bread x={0} y={-150} s={1.4} half={half} />
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ everyone eats; twelve baskets */
const Baskets: React.FC<SP> = (p) => {
  const {t} = p;
  const tw = p.w('twelve', p.dur * 0.75);
  const c: C3 = {x: 0, y: 200, z: lerp(1.0, 1.1, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.4} /><Grass y={240} />
      {Array.from({length: 15}).map((_, i) => { const row = Math.floor(i / 5); return <Bean key={i} x={-640 + (i % 5) * 320 + (row % 2) * 100} y={500 + row * 170} s={0.75 + row * 0.08} sit look={CROWD(i)} t={t + i} arms={Math.sin(t * 4 + i) > 0 ? 'offer' : 'none'} face={{eyes: Math.sin(t * 3 + i) > 0.6 ? 'closed' : 'open', mouth: 'smile', look: [i % 2 ? 1 : -1, 0]}} hold={<Bread x={0} y={0} s={0.4} />} />; })}
      {Array.from({length: 12}).map((_, i) => { const o = ko(t, tw + 0.1 + i * 0.1, tw + 0.3 + i * 0.1); return o > 0 ? <g key={i} transform={`translate(${-660 + (i % 6) * 264} ${(1 - o) * -50 + (i < 6 ? -40 : 90)})`} opacity={o}><Basket x={0} y={0} s={0.9} /></g> : null; })}
      <text x={0} y={-250} textAnchor="middle" fontFamily="Anton" fontSize={220} fill="#FFDD33" stroke="#1c0d16" strokeWidth={16} paintOrder="stroke" opacity={ko(t, tw, tw + 0.3)}>12</text>
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- he sends them off, prays on the mountain */
const Pray: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-150, 100, t / p.dur), y: 120, z: 1.1};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.7} /><Stars t={t} n={40} />
      <rect x={-3000} y={300} width={6000} height={3000} fill="#2A3454" />
      <g transform={`translate(${lerp(500, 900, t / p.dur)} 0)`}><BigBoat x={0} y={330} night sail={false}>{CREW.slice(0, 3).map((n, i) => <Bean key={n} x={-300 + i * 180} y={-90} s={0.7} look={AP[n]} t={t + i} face={{eyes: 'open', mouth: 'flat'}} dim={0.3} />)}</BigBoat></g>
      <path d="M -3000 700 L -3000 -100 Q -700 -400 -180 -200 Q 120 0 220 700 Z" fill="#3A3444" stroke={INK} strokeWidth={8} />
      <Bean x={-250} y={-180} s={0.9} sit look={JESUS} t={t} arms="up" face={{eyes: 'closed', mouth: 'flat', look: [0, -1]}} />
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- rowing against the wind */
const Row: React.FC<SP> = (p) => {
  const {t} = p;
  const tilt = Math.sin(t * 1.8) * 7;
  const c: C3 = {x: Math.sin(t * 6) * 6, y: 60, z: 1.15};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" /><Stars t={t} n={50} /><Moon x={-360} y={-620} />
      <Waves t={t} y={260} amp={40} col="#24304A" ph={1} />
      <BigBoat x={0} y={300} tilt={tilt} night sail={false}>
        {CREW.map((n, i) => <Bean key={n} x={-380 + i * 200} y={-80} s={0.78} look={AP[n]} t={t + i} arms={Math.sin(t * 3 + i) > 0 ? 'reach' : 'offer'} face={{eyes: 'half', mouth: 'grit', brow: -0.5, look: [-1, 0]}} />)}
        {[-280, 120].map((x, i) => <line key={i} x1={x} y1={-150} x2={x - 260 + Math.sin(t * 3 + i) * 80} y2={200} stroke="#7a5233" strokeWidth={12} strokeLinecap="round" />)}
      </BigBoat>
      <Waves t={t + 0.7} y={360} amp={55} col="#1C2840" ph={2.5} />
      {Array.from({length: 12}).map((_, i) => { const x = ((t * (900 + rnd(i) * 500) + rnd(i + 1) * 3000) % 3000) - 1500; return <line key={i} x1={-x} y1={(rnd(i + 2) - 0.5) * 1400} x2={-x + 180} y2={(rnd(i + 2) - 0.5) * 1400} stroke="#AEC4E0" strokeWidth={3} opacity={0.35} />; })}
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- someone walking on the water */
const Walk: React.FC<SP> = (p) => {
  const {t} = p;
  const wt = p.w('water', p.dur * 0.75);
  const o = ko(t, wt - 0.6, wt + 0.4);
  const c: C3 = {x: 0, y: 40, z: lerp(1.0, 1.15, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" /><Stars t={t} n={70} />
      <rect x={-3000} y={200} width={6000} height={3000} fill="#1C2840" />
      {Array.from({length: 20}).map((_, i) => <path key={i} d={`M ${(rnd(i) - 0.5) * 2600 + Math.sin(t + i) * 30} ${240 + (i % 7) * 90} q 40 -10 80 0 t 80 0`} fill="none" stroke="#5A6A90" strokeWidth={5} opacity={0.6} />)}
      <g opacity={o}>
        <Glow x={0} y={60} r={360} o={0.7} id="gWhite" />
        <ellipse cx={0} cy={262} rx={120} ry={16} fill="#E8F0FF" opacity={0.5} />
        <Bean x={0} y={260} s={0.62} look={JESUS} t={t} walk={1} face={{eyes: 'open', mouth: 'flat'}} />
      </g>
      <g transform="translate(0 760) scale(1.3)"><BigBoat x={0} y={0} night sail={false}>{CREW.slice(0, 3).map((n, i) => <Bean key={n} x={-260 + i * 200} y={-90} s={0.8} flip look={AP[n]} t={t + i} face={{eyes: o > 0.5 ? 'wide' : 'half', mouth: 'open', brow: -0.6, look: [0, -1]}} />)}</BigBoat></g>
    </Cam>
  );
};

/* 13 ----------------------------------------------------------------- "It's a ghost!" */
const Ghost: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: Math.sin(t * 40) * 6, y: 60, z: 1.5};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" />
      {[-260, 0, 260].map((x, i) => <g key={i} transform={`translate(${x} ${i === 1 ? -30 : 20}) scale(1.15)`}><Bean x={0} y={440} look={AP[CREW[i]]} t={t + i} arms="up" shake={3} face={{eyes: 'wide', mouth: 'open', brow: -1, look: [0, -0.5]}} /></g>)}
    </Cam>
  );
};

/* 14 ----------------------------------------------------------------- "Take courage. It is I." */
const Courage: React.FC<SP> = (p) => {
  const {t} = p;
  const iam = p.w('i', p.dur * 0.5);
  const g = ko(t, iam - 0.1, iam + 0.6);
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.9, 2.1, t / p.dur)}} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" /><Stars t={t} n={40} />
      <Glow x={0} y={-60} r={420 + g * 500} o={0.35 + g * 0.5} id="gWhite" />
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t < p.dur - 0.5 && Math.sin(t * 11) > 0 ? 'open' : 'smile', brow: 0.3, look: [0, 0]}} />
    </Cam>
  );
};

/* 15 ----------------------------------------------------------------- he steps into the boat; the wind stops */
const Calm: React.FC<SP> = (p) => {
  const {t} = p;
  const st = p.w('stopped', p.dur * 0.45);
  const calm = t > st;
  const c: C3 = {x: 0, y: calm ? lerp(60, -60, k(t, st, p.dur)) : 60, z: calm ? lerp(1.15, 0.85, k(t, st, p.dur)) : 1.15};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" /><Stars t={t} n={calm ? 120 : 40} />{calm ? <Moon x={-300} y={-680} /> : null}
      <Waves t={calm ? st : t} y={260} amp={calm ? 6 : 36} col="#1E2A44" ph={1} />
      <BigBoat x={0} y={300} tilt={calm ? 0 : Math.sin(t * 1.8) * 6} night sail={false}>
        <Bean x={lerp(520, 160, ko(t, 0, st - 0.2))} y={-110} s={0.95} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
        {CREW.slice(0, 3).map((n, i) => <Bean key={n} x={-380 + i * 170} y={-80} s={0.78} look={AP[n]} t={calm ? 1 + i : t + i} arms={calm && i === 1 ? 'up' : 'none'} face={{eyes: 'wide', mouth: 'open', brow: -0.3, look: [1, 0]}} />)}
      </BigBoat>
      {calm ? <polygon points="-50,270 50,270 200,1500 -200,1500" fill="#F4F0E2" opacity={0.15} /> : null}
    </Cam>
  );
};

/* 16 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 0, z: 1}} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" /><Stars t={t} n={80} />
      <circle cx={0} cy={330} r={220} fill="#F4F0E2" /><Glow x={0} y={330} r={700} o={0.45} id="gWhite" />
      <rect x={-3000} y={560} width={6000} height={3000} fill="#0F1628" />
      <polygon points="-50,565 50,565 160,1500 -160,1500" fill="#F4F0E2" opacity={0.15} />
      <g transform={`translate(${lerp(-80, 80, t / p.dur)} 568) scale(0.25)`}><Bean x={0} y={0} look={{...JESUS, skin: '#0b0c14', hair: '#0b0c14', tunic: '#0b0c14', sash: '#0b0c14'}} t={t} walk={1} face={{eyes: 'closed', mouth: 'none'}} /></g>
    </Cam>
  );
};

export const SCENES10: Record<string, React.FC<SP>> = {back: Back, rest: Rest, run: Run, sheep: Sheep, late: Late, you: You, loaves: Loaves, bless: Bless, baskets: Baskets, pray: Pray, row: Row, walk: Walk, ghost: Ghost, courage: Courage, calm: Calm, end: End};
