import React from 'react';
import {AnimeHead, Hand, LINE, Sil, Wheat} from './anime';
import {BIG, C3, Cam, Fill, Glow, SP, k, ko, lerp, lin, rnd} from '../v8/scenes';

/** Episode 4 — "Lord of the Sabbath" (Mark 2:23-3:6), late-80s anime look. */
const H = (x: number, y: number, s: number, el: React.ReactNode) => <g transform={`translate(${x} ${y}) scale(${s})`}>{el}</g>;
const GRAD = (
  <defs>
    <linearGradient id="a80dusk" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 -1200) scale(1 1600)">
      <stop offset="0" stopColor="#1E1538" /><stop offset="0.45" stopColor="#6A2E5E" /><stop offset="0.72" stopColor="#E0703A" /><stop offset="0.9" stopColor="#FFC56A" />
    </linearGradient>
    <linearGradient id="a80night" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 -1200) scale(1 2200)">
      <stop offset="0" stopColor="#0B0A1E" /><stop offset="0.5" stopColor="#2A1E4A" /><stop offset="0.8" stopColor="#4A2A5A" />
    </linearGradient>
    <linearGradient id="a80syn" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 -1200) scale(1 2400)">
      <stop offset="0" stopColor="#120C22" /><stop offset="0.6" stopColor="#2E1E3E" /><stop offset="1" stopColor="#4A2A38" />
    </linearGradient>
    <filter id="fogb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="45" /></filter>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
  </defs>
);
const Fog: React.FC<{t: number; y: number; col?: string; o?: number; n?: number}> = ({t, y, col = '#9A7ACF', o = 0.35, n = 8}) => (
  <g filter="url(#fogb)" opacity={o}>{Array.from({length: n}).map((_, i) => <ellipse key={i} cx={(rnd(i) - 0.5) * 2600 + Math.sin(t * 0.3 + i) * 120} cy={y + (rnd(i + 3) - 0.5) * 300} rx={420 + rnd(i + 1) * 300} ry={110 + rnd(i + 2) * 80} fill={col} />)}</g>
);
const Motes: React.FC<{t: number; o?: number; frozen?: boolean; x0?: number; w?: number}> = ({t, o = 0.8, frozen, x0 = 0, w = 900}) => (
  <g opacity={o}>{Array.from({length: 46}).map((_, i) => { const tt = frozen ? 1.5 : t; const ph = (tt * (0.03 + rnd(i) * 0.05) + rnd(i + 2)) % 1; return <circle key={i} cx={x0 + (rnd(i + 5) - 0.5) * w + Math.sin(tt * 0.8 + i) * 20} cy={-900 + ph * 1900} r={2 + rnd(i + 1) * 4} fill="#FFD8A0" opacity={0.3 + rnd(i + 9) * 0.6} />; })}</g>
);
const Rays: React.FC<{x: number; y: number; t: number; o?: number; spread?: number}> = ({x, y, t, o = 1, spread = 1}) => (
  <g opacity={o}>{Array.from({length: 6}).map((_, i) => <polygon key={i} points={`${x - 60 + i * 24},${y} ${x - 30 + i * 24},${y} ${x + (i - 2.5) * 220 * spread + 300},${y + 2200} ${x + (i - 2.5) * 220 * spread + 140},${y + 2200}`} fill="#FFB866" opacity={0.08 + 0.03 * Math.sin(t * 2 + i)} />)}</g>
);
const flash = (t: number, at: number, len = 0.1) => t > at && t < at + len;

/* 1 ------------------------------------------------------------------ the grain fields at sunset */
const Field: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = 3.35;
  if (t < cut) {
    const c: C3 = {x: lerp(-80, 80, t / cut), y: -120, z: 1.0};
    const reach = ko(t, 1.2, 2.0), grab = k(t, 2.1, 2.5), pull = k(t, 2.6, 3.3);
    return (
      <Cam c={c} p={p}>
        {GRAD}
        <Fill fill="url(#a80dusk)" />
        <Glow x={120} y={260} r={900} o={0.9} />
        <circle cx={120} cy={260} r={260} fill="#FFE3A0" />
        {Array.from({length: 22}).map((_, i) => <Wheat key={i} x={-1000 + i * 95 + (i % 3) * 20} y={1300} h={1100 + (i % 4) * 140} t={t} s={2.2} col="#F2A84A" />)}
        {H(lerp(220, 120, reach), lerp(1500, 460, reach) + pull * 260, 2.4, <Hand withered={0} curl={grab * 0.8} skin="#D69A6C" sleeve="#7A5A3A" t={t} />)}
        {Array.from({length: 10}).map((_, i) => <Wheat key={'f' + i} x={-1100 + i * 230} y={1500} h={900 + (i % 3) * 200} t={t + 1} s={3.2} dark />)}
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: lerp(-80, 80, u / (p.dur - cut)), y: 80, z: 1.25};
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Fill fill="url(#a80dusk)" />
      <Glow x={0} y={180} r={1100} o={0.95} />
      <circle cx={0} cy={180} r={380} fill="#FFE3A0" />
      <rect x={-BIG} y={260} width={BIG * 2} height={BIG} fill="#2A1428" />
      {Array.from({length: 40}).map((_, i) => <Wheat key={i} x={-1400 + i * 72} y={420} h={200 + (i % 4) * 30} t={t} s={0.9} dark />)}
      {[0, 1, 2, 3, 4].map((i) => <Sil key={i} x={-520 + i * 230 + u * 90} y={560} s={0.95 - (i === 0 ? 0 : 0.06)} t={t + i * 0.3} walk={1} rim="#FFB45A" />)}
      {Array.from({length: 18}).map((_, i) => <Wheat key={'g' + i} x={-1300 + i * 160} y={1200} h={520 + (i % 3) * 90} t={t + 2} s={2} dark />)}
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ watchers on the ridge */
const Watchers: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = Math.min(1.0, p.w('breaking', 1.0) - 0.4);
  if (t < cut) {
    const c: C3 = {x: 0, y: -200, z: lerp(0.95, 1.05, t / cut)};
    return (
      <Cam c={c} p={p}>
        {GRAD}
        <Fill fill="url(#a80dusk)" />
        <Glow x={380} y={-40} r={700} o={0.8} />
        <path d={`M ${-BIG} 260 Q -300 120 200 180 Q 600 220 ${BIG} 160 L ${BIG} ${BIG} L ${-BIG} ${BIG} Z`} fill="#140b18" />
        {[-260, 0, 260].map((x, i) => <Sil key={i} x={x} y={200 - (i % 2) * 20} s={0.95} hood rim="#FFB45A" t={t} />)}
        {[-260, 0, 260].map((x, i) => <g key={'e' + i}>{[-1, 1].map((d) => <ellipse key={d} cx={x + d * 14} cy={200 - (i % 2) * 20 - 470} rx={7} ry={3} fill="#FFE7A0" />)}</g>)}
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: 0, y: -40, z: lerp(2.3, 2.55, u / (p.dur - cut))};
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Fill fill="url(#a80dusk)" /><Fill fill="#1a0f22" o={0.35} />
      <Glow x={300} y={-200} r={500} o={0.6} />
      <AnimeHead who="pharisee" eyes="narrow" mouth={Math.sin(t * 14) > 0 ? 'open' : 'frown'} brow={1} light={1} rim="#FFB45A" night={0.35} look={[-0.6, 0]} />
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ "The Sabbath was made for people" */
const Reply: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(30, 0, t / p.dur), y: lerp(10, -20, t / p.dur), z: lerp(2.1, 2.4, t / p.dur)};
  const talking = t > 0.3 && t < p.dur - 1.2 && Math.sin(t * 13) > 0;
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Fill fill="url(#a80dusk)" />
      <g filter="url(#soft)">{Array.from({length: 9}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 900} cy={(rnd(i + 2) - 0.2) * 500} r={40 + rnd(i + 4) * 50} fill="#FFD27A" opacity={0.35} />)}</g>
      <Glow x={-380} y={60} r={600} o={0.7} />
      <AnimeHead who="jesus" eyes={Math.floor(t * 10) % 31 === 0 ? 'closed' : 'open'} mouth={talking ? 'open' : 'flat'} look={[0.6, 0]} light={-1} rim="#FFB45A" t={t} />
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ the synagogue, the withered hand */
const Synagogue: React.FC<{t: number; frozen?: boolean; manX?: number; manStand?: number}> = ({t, frozen, manX = 260, manStand = 0}) => (
  <g>
    <Fill fill="url(#a80syn)" />
    {[-700, -250, 250, 700].map((x, i) => <rect key={i} x={x - 70} y={-BIG} width={140} height={BIG + 400} fill="#0f0a1a" />)}
    <rect x={150} y={-900} width={220} height={300} fill="#FFB866" />
    <Rays x={260} y={-760} t={frozen ? 1 : t} spread={0.6} />
    <rect x={-BIG} y={380} width={BIG * 2} height={BIG} fill="#1a1024" />
    {[-760, -560, -360, 520, 720].map((x, i) => <Sil key={i} x={x} y={430} s={0.7} t={t} hood={i % 2 === 0} />)}
    <Sil x={manX} y={430} s={0.7 + manStand * 0.05} t={t} rim="#FFB866" />
    <Motes t={t} frozen={frozen} x0={260} w={700} />
  </g>
);
const HandSc: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = p.w('withered', 2.4) - 0.35;
  if (t < cut) {
    const c: C3 = {x: lerp(-60, 80, t / cut), y: -120, z: lerp(0.85, 0.95, t / cut)};
    return <Cam c={c} p={p}>{GRAD}<Synagogue t={t} /></Cam>;
  }
  const c: C3 = {x: 40, y: 60, z: lerp(1.9, 2.1, k(t, cut, p.dur))};
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Fill fill="#1a1024" />
      <polygon points="-400,-900 -120,-900 380,600 -100,600" fill="#FFB866" opacity={0.16} />
      <path d="M -500 200 Q -200 60 400 120 L 500 600 L -500 600 Z" fill="#3A3050" stroke={LINE} strokeWidth={6} />
      {H(230, 130, 1.5, <g transform={`rotate(${-80 + Math.sin(t * 20) * 1.2})`}><Hand withered={1} t={t} /></g>)}
      <Motes t={t} o={0.6} />
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ eyes in the dark */
const Watch: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = Math.max(2.4, p.dur - 1.7);
  if (t < cut) {
    const c: C3 = {x: 0, y: 0, z: lerp(1.0, 1.15, t / cut)};
    const pairs = [[-300, -420], [260, -300], [-80, -120], [380, 80], [-380, 160], [100, 320], [-200, 520]];
    return (
      <Cam c={c} p={p}>
        {GRAD}
        <Fill fill="#08050f" />
        <Fog t={t} y={300} col="#3A2A5A" o={0.5} />
        {pairs.map(([x, y], i) => { const o = ko(t, 0.2 + i * 0.32, 0.6 + i * 0.32); return o > 0 ? <g key={i} opacity={o}>{[-1, 1].map((d) => <g key={d}><path d={`M ${x + d * 34 - 22} ${y} L ${x + d * 34 + 22} ${y - 6} L ${x + d * 34 + 18} ${y + 6} L ${x + d * 34 - 18} ${y + 7} Z`} fill="#FFE7A0" /><circle cx={x + d * 34} cy={y} r={30} fill="#FFC56A" opacity={0.18} /></g>)}</g> : null; })}
      </Cam>
    );
  }
  const c: C3 = {x: -54, y: 6, z: lerp(5.0, 5.6, k(t, cut, p.dur))};
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Fill fill="#08050f" />
      <AnimeHead who="pharisee" eyes="narrow" brow={1.2} night={0.75} light={1} rim="#FFB45A" look={[0.8, 0]} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ "Stand up. Come to the middle." */
const Stand: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = p.w('come', 1.2) - 0.1;
  if (t < cut) {
    const c: C3 = {x: -40, y: -20, z: lerp(2.2, 2.35, t / cut)};
    return (
      <Cam c={c} p={p}>
        {GRAD}
        <Fill fill="url(#a80syn)" /><Glow x={-500} y={-200} r={600} o={0.45} />
        <AnimeHead who="jesus" eyes="open" mouth={Math.sin(t * 13) > 0 ? 'open' : 'flat'} brow={0.4} look={[0.8, 0]} light={-1} rim="#FFB866" night={0.3} t={t} />
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: 0, y: -10, z: lerp(2.3, 2.15, u / (p.dur - cut))};
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Fill fill="url(#a80syn)" />
      <polygon points="-120,-900 120,-900 520,700 -520,700" fill="#FFB866" opacity={0.14 + 0.1 * ko(u, 0, 0.5)} />
      <AnimeHead who="man" eyes="wide" mouth="open" brow={-0.7} look={[-0.6, 0]} light={1} rim="#FFB866" night={0.35 - 0.25 * ko(u, 0, 0.5)} />
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ the question */
const Question: React.FC<SP> = (p) => {
  const {t} = p;
  const cuts = ['good', 'life', 'kill'].map((w) => p.w(w, -10));
  const ci = cuts.findIndex((a) => t > a + 0.05 && t < a + 0.6);
  if (ci >= 0) {
    const c: C3 = {x: 0, y: -20, z: 2.5};
    return (
      <Cam c={c} p={p}>
        {GRAD}
        <Fill fill="#0d0816" /><Glow x={ci % 2 ? -300 : 300} y={0} r={500} o={0.4} />
        <AnimeHead who="pharisee" eyes={ci === 2 ? 'wide' : 'narrow'} mouth="frown" brow={0.8} night={0.6} light={ci % 2 ? -1 : 1} rim="#FFB45A" look={[ci % 2 ? 0.6 : -0.6, 0]} />
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: lerp(0, -30, t / p.dur), z: lerp(2.25, 2.8, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Fill fill="url(#a80syn)" /><Glow x={-450} y={-100} r={650} o={0.45} />
      <AnimeHead who="jesus" eyes="open" mouth={Math.sin(t * 12) > 0 ? 'open' : 'flat'} brow={0.9} look={[0, 0]} light={-1} rim="#FFB866" night={0.25} t={t} />
    </Cam>
  );
};

/* 8 ------------------------------------------------------------------ silence */
const Silence: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 120, y: -120, z: lerp(0.9, 0.98, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Synagogue t={1} frozen manX={260} manStand={1} />
      <Sil x={-120} y={430} s={0.74} t={1} rim="#FFB866" />
      <Fill fill="#000" o={0.15} />
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ "Stretch out your hand." */
const Stretch: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = Math.min(1.25, p.dur * 0.45);
  if (t < cut) {
    const c: C3 = {x: 0, y: 4, z: lerp(4.2, 4.6, t / cut)};
    return (
      <Cam c={c} p={p}>
        {GRAD}
        <Fill fill="#120a1c" />
        <AnimeHead who="jesus" eyes="narrow" mouth="grit" brow={1.1} tear={ko(t, 0.1, 1.0)} light={1} rim="#B88CFF" night={0.35} />
      </Cam>
    );
  }
  const u = t - cut;
  const reach = ko(u, 0, p.dur - cut);
  const c: C3 = {x: 0, y: -100, z: 1.0};
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Fill fill="url(#a80syn)" />
      <polygon points="-140,-900 140,-900 560,900 -560,900" fill="#FFB866" opacity={0.18} />
      {H(Math.sin(t * 24) * 4, lerp(900, 250, reach), lerp(1.2, 3.2, reach), <Hand withered={1} t={t} />)}
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- made whole */
const Heal: React.FC<SP> = (p) => {
  const {t} = p;
  const st = 0.05;
  const h = k(t, st + 0.15, st + 1.3);
  const cut = Math.max(2.0, p.dur - 1.3);
  if (t < cut) {
    const c: C3 = {x: Math.sin(t * 60) * (t > st ? Math.exp(-(t - st) * 4) * 18 : 0), y: -100, z: 1.0};
    return (
      <Cam c={c} p={p}>
        {GRAD}
        <Fill fill="url(#a80syn)" />
        <Glow x={0} y={-80} r={500 + h * 700} o={0.4 + h * 0.6} id="gWhite" />
        {Array.from({length: 12}).map((_, i) => <polygon key={i} points={`0,-80 ${Math.cos((i / 12) * 6.28) * 1400},${-80 + Math.sin((i / 12) * 6.28) * 1400} ${Math.cos((i / 12 + 0.02) * 6.28) * 1400},${-80 + Math.sin((i / 12 + 0.02) * 6.28) * 1400}`} fill="#FFF3D0" opacity={0.15 * h} />)}
        {H(0, 250, 3.2, <Hand withered={1 - h} curl={(1 - h) * 1} spread={1 + h * 0.4} t={t} />)}
        {[0, 1, 2].map((i) => { const r = (t - st - 0.2 - i * 0.15) * 1600; return r > 0 ? <circle key={i} cx={0} cy={-80} r={r} fill="none" stroke="#FFF6D8" strokeWidth={26 - i * 7} opacity={Math.max(0, 0.9 - (t - st) * 0.8)} /> : null; })}
        {Array.from({length: 30}).map((_, i) => { const ph = (t * 0.5 + rnd(i)) % 1; return h > 0.2 ? <circle key={'s' + i} cx={(rnd(i + 3) - 0.5) * 900} cy={300 - ph * 1200} r={3 + rnd(i) * 5} fill="#FFF3D0" opacity={(1 - ph) * h} /> : null; })}
        {flash(t, st + 0.2, 0.12) ? <Fill fill="#fff" o={0.8} /> : null}
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: 0, y: -10, z: lerp(2.3, 2.45, u / (p.dur - cut))};
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Fill fill="url(#a80syn)" /><Glow x={0} y={-300} r={800} o={0.6} />
      <AnimeHead who="man" eyes="open" mouth="smile" brow={-0.3} look={[0, -0.6]} light={1} rim="#FFE0A0" tear={0.9} />
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- the plot at night */
const Lantern: React.FC<{x: number; y: number; t: number; o?: number}> = ({x, y, t, o = 1}) => (
  <g opacity={o}><line x1={x} y1={y - 140} x2={x} y2={y - 40} stroke={LINE} strokeWidth={4} /><Glow x={x} y={y} r={260 + Math.sin(t * 9) * 12} o={0.8} /><rect x={x - 22} y={y - 40} width={44} height={60} rx={8} fill="#FFB45A" stroke={LINE} strokeWidth={5} /></g>
);
const Plot: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.15;
  const die = p.w('die', p.dur - 1.5);
  if (t < s1) {
    const c: C3 = {x: lerp(-100, 60, t / s1), y: -80, z: lerp(0.95, 1.05, t / s1)};
    return (
      <Cam c={c} p={p}>
        {GRAD}
        <Fill fill="url(#a80night)" />
        <circle cx={380} cy={-700} r={90} fill="#E8E4FF" /><Glow x={380} y={-700} r={300} o={0.4} id="gWhite" />
        {[-900, -560, 560, 900].map((x, i) => <path key={i} d={`M ${x - 220} 500 L ${x - 220} ${-300 - (i % 2) * 120} L ${x} ${-420 - (i % 2) * 120} L ${x + 220} ${-300 - (i % 2) * 120} L ${x + 220} 500 Z`} fill="#120c22" stroke="#2a1e44" strokeWidth={4} />)}
        {[-560, 560].map((x, i) => <rect key={'w' + i} x={x - 50} y={-180} width={100} height={130} fill="#FFB45A" opacity={0.85} />)}
        <Lantern x={-380} y={-40} t={t} /><Lantern x={420} y={-80} t={t + 1} />
        <rect x={-BIG} y={480} width={BIG * 2} height={BIG} fill="#0d0a18" />
        {[0, 1, 2].map((i) => <Sil key={i} x={lerp(-80 + i * 140, -40 + i * 90, t / s1)} y={lerp(700, 520, t / s1)} s={lerp(0.9, 0.55, t / s1)} hood t={t + i * 0.4} walk={1} rim="#B88CFF" />)}
        <Fog t={t} y={420} o={0.45} />
      </Cam>
    );
  }
  const out = ko(t, die + 0.35, die + 0.7);
  const c: C3 = {x: 0, y: 20, z: lerp(2.3, 2.6, k(t, s1, p.dur))};
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Fill fill="#06040c" />
      <Glow x={0} y={420} r={600} o={0.9 * (1 - out)} />
      <AnimeHead who="pharisee" eyes={t > die - 0.1 ? 'glint' : 'narrow'} mouth={t > die - 0.2 && t < die + 0.4 ? 'open' : 'frown'} brow={1.2} night={0.55 + out * 0.4} light={1} rim="#FFB45A" look={[0, 0.3]} />
      <Fill fill="#000" o={out * 0.85} />
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 0, z: 1};
  return (
    <Cam c={c} p={p}>
      {GRAD}
      <Fill fill="url(#a80night)" />
      <circle cx={0} cy={330} r={260} fill="#F4EEFF" /><Glow x={0} y={330} r={700} o={0.5} id="gWhite" />
      <path d={`M ${-BIG} 640 Q -300 520 0 560 Q 300 520 ${BIG} 640 L ${BIG} ${BIG} L ${-BIG} ${BIG} Z`} fill="#0b0814" />
      <Sil x={0} y={570} s={0.4} t={t} />
      <Fog t={t} y={660} o={0.5} />
    </Cam>
  );
};

export const SCENES4: Record<string, React.FC<SP>> = {field: Field, watchers: Watchers, reply: Reply, hand: HandSc, watch: Watch, stand: Stand, question: Question, silence: Silence, stretch: Stretch, heal: Heal, plot: Plot, end: End};
