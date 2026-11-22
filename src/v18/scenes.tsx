import React from 'react';
import {FRIENDS, INK, JESUS, Look} from '../v8/fig';
import {C3, Cam, Fill, Glow, SP, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Hand} from '../v11/anime';
import {Bean, OilLamp, RDEFS, Room} from '../v11/room';
import {PH} from '../v11/scenes_room';
import {AP, Bust, Sky} from '../v12/scenes';
import {Bed, GIRL, Street} from '../v15/scenes';

/** Episode 11 — "Be Opened" (Mark 7). Big moment: "Ephphatha" — the muffled world opens. */
export const MOTHER_T: Look = {skin: '#C98E64', hair: '#1E1612', tunic: '#2E7A7A', sash: '#D9A93A', style: 'hood', wrap: '#1E5A5A', beard: false};
export const DEAF: Look = {skin: '#D2A07E', hair: '#3A2418', tunic: '#7A8A5A', sash: '#4A5A2A', style: 'short', beard: true};
const TOWN = (i: number): Look => ({...FRIENDS[i % 4], tunic: ['#A8794A', '#6A7A5A', '#8A5A5A', '#5A6A8A', '#9A8A5A'][i % 5]});
const Loaf: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M -50 0 Q -46 -36 0 -38 Q 46 -36 50 0 Z" fill="#D99848" stroke="#5a2f12" strokeWidth={5} />
);
const Dog: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-40, -10, 30, 56].map((lx, i) => <line key={i} x1={lx} y1={-40} x2={lx} y2={0} stroke={INK} strokeWidth={10} strokeLinecap="round" />)}
    <ellipse cx={10} cy={-62} rx={70} ry={34} fill="#B8864A" stroke={INK} strokeWidth={6} />
    <path d={`M -58 -70 q -26 ${-20 + Math.sin(t * 12) * 10} -34 -40`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
    <circle cx={86} cy={-90} r={30} fill="#B8864A" stroke={INK} strokeWidth={6} />
    <path d="M 70 -112 q -14 -10 -10 18 Z" fill="#8A5A2A" stroke={INK} strokeWidth={4} />
    <ellipse cx={112} cy={-84} rx={14} ry={10} fill="#B8864A" stroke={INK} strokeWidth={5} /><circle cx={124} cy={-86} r={5} fill={INK} />
    <circle cx={92} cy={-98} r={4} fill={INK} />
  </g>
);
const muffled = (on: boolean) => (on ? <rect x={-3000} y={-3000} width={6000} height={6000} fill="#1a1420" opacity={0.18} /> : null);

/* 1 ------------------------------------------------------------------ eating with unwashed hands */
const Hands: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-80, 80, t / p.dur), y: 220, z: 1.25};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Street t={t} />
      {['simon', 'andrew', 'john'].map((n, i) => <Bean key={n} x={-380 + i * 190} y={700} s={0.9} sit look={AP[n]} t={t + i} arms="offer" hold={<Loaf x={0} y={0} s={0.6} />} face={{eyes: 'open', mouth: Math.sin(t * 6 + i) > 0 ? 'open' : 'smile', look: [1, 0]}} />)}
      {[300, 480].map((x, i) => <Bean key={i} x={x} y={690} s={0.95} flip look={PH(i)} t={t + i} arms={i ? 'cross' : 'point'} face={{eyes: 'half', mouth: 'frown', brow: -1, look: [-1, 0.3]}} />)}
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ "Why don't your disciples follow the tradition?" */
const Tradition: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>{RDEFS}<Street t={t} /><Bust x={0} y={0} look={PH(0)} t={t} face={{eyes: 'half', mouth: Math.sin(t * 13) > 0 ? 'open' : 'frown', brow: -1, look: [1, 0]}} /></Cam>;
};

/* 3 ------------------------------------------------------------------ "You hold on to human rules…" */
const Rules: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>{RDEFS}<Street t={t} /><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t < p.dur - 0.6 && Math.sin(t * 12) > 0 ? 'open' : 'flat', brow: 0.6, look: [-1, 0]}} /></Cam>;
};

/* 4 ------------------------------------------------------------------ "…what comes out of the heart" */
const Heart: React.FC<SP> = (p) => {
  const {t} = p;
  const h = p.w('heart', p.dur * 0.8);
  const g = ko(t, h - 0.1, h + 0.5);
  return (
    <Cam c={{x: 0, y: 120, z: 1.45}} p={p}>
      {RDEFS}<Street t={t} dusk={0.2} />
      <Bean x={0} y={720} s={1.1} look={JESUS} t={t} arms="offer" face={{eyes: 'open', mouth: Math.sin(t * 11) > 0 && t < p.dur - 0.5 ? 'open' : 'smile', brow: 0.3}} />
      <g opacity={g} transform={`translate(0 ${720 - 290 * 1.1}) scale(${0.6 + 0.4 * g})`}>
        <Glow x={0} y={0} r={240} o={0.6} />
        <path d="M 0 40 C -90 -20 -70 -90 -20 -80 C 0 -76 0 -60 0 -52 C 0 -60 0 -76 20 -80 C 70 -90 90 -20 0 40 Z" fill="#E8605A" stroke="#FFE2B0" strokeWidth={8} opacity={0.9} />
      </g>
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ Tyre: a foreign woman falls at his feet */
const Tyre: React.FC<SP> = (p) => {
  const {t} = p;
  const fell = t > p.dur * 0.65;
  const c: C3 = {x: lerp(-80, 80, t / p.dur), y: 220, z: 1.3};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.15} />
      <g filter="url(#dof)">{[-900, -400, 100, 600].map((x, i) => <rect key={i} x={x} y={-300 - (i % 2) * 60} width={380} height={620} fill={['#E0D4C0', '#D0C4B0'][i % 2]} stroke="#8a7a6a" strokeWidth={6} />)}</g>
      <rect x={-3000} y={330} width={6000} height={3000} fill="#C8B49A" />
      <Bean x={320} y={700} s={1.0} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', look: [-1, 0.4]}} />
      <Bean x={fell ? 100 : lerp(-700, 80, lin(t, 0.3, p.dur * 0.65))} y={700} s={0.95} look={MOTHER_T} t={t} walk={fell ? 0 : 1.8} sit={fell} arms={fell ? 'up' : 'reach'} face={{eyes: 'open', mouth: 'open', brow: -0.8, look: [1, fell ? -1 : 0]}} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ "My little daughter has an evil spirit." */
const Plea: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.15, t / p.dur)}} p={p}>
      {RDEFS}<Sky dusk={0.15} />
      <Bust x={0} y={0} look={MOTHER_T} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'frown', brow: -0.9, look: [1, -0.4]}} />
      {[0, 1].map((i) => { const ph = (t * 0.5 + i * 0.5) % 1; return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${i ? 32 : -32} ${14 + ph * 60}) scale(1.4)`} fill="#BFE9F2" stroke={INK} strokeWidth={2.5} opacity={1 - ph} />; })}
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ "the children's bread… to the dogs" */
const BreadSc: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>{RDEFS}<Sky dusk={0.15} /><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t < p.dur - 0.5 && Math.sin(t * 12) > 0 ? 'open' : 'flat', brow: 0.1, look: [-1, 0.4]}} /></Cam>;
};

/* 8 ------------------------------------------------------------------ "even the dogs eat the crumbs" */
const Crumbs: React.FC<SP> = (p) => {
  const {t} = p;
  const cr = p.w('crumbs', p.dur * 0.8);
  const c: C3 = {x: 0, y: 200, z: 1.4};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Room t={t} wall="#7A6050" floor="#5A3E2C" win={false} /><OilLamp x={-380} y={-100} t={t} />
      <rect x={-460} y={360} width={920} height={40} rx={8} fill="#8a5a33" stroke={INK} strokeWidth={7} />
      {[-420, 400].map((x) => <rect key={x} x={x} y={400} width={30} height={260} fill="#6E4A30" stroke={INK} strokeWidth={5} />)}
      {[-240, 0, 240].map((x, i) => <Loaf key={i} x={x} y={360} s={0.9} />)}
      {[-180, 160].map((x, i) => <Bean key={i} x={x} y={360} s={0.55} sit look={TOWN(i + 1)} t={t + i} face={{eyes: 'closed', mouth: 'open'}} />)}
      <Dog x={-80} y={660} s={1.1} t={t} />
      {t > cr - 0.1 ? Array.from({length: 10}).map((_, i) => { const u = t - cr + 0.1 - rnd(i) * 0.3; if (u < 0) return null; return <circle key={i} cx={-60 + (rnd(i + 1) - 0.5) * 300} cy={Math.min(600, 400 + 900 * u * u)} r={6 + rnd(i) * 5} fill="#D99848" stroke="#5a2f12" strokeWidth={2} />; }) : null}
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ "For such a reply, you may go." */
const Reply: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>{RDEFS}<Sky dusk={0.15} /><g filter="url(#dof)"><Glow x={-300} y={-300} r={600} o={0.7} /></g><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'smile', brow: 0.3, look: [-1, 0.4]}} /></Cam>;
};

/* 10 ----------------------------------------------------------------- home: the girl is well */
const Home: React.FC<SP> = (p) => {
  const {t} = p;
  const gn = p.w('gone', p.dur * 0.75);
  const up = ko(t, gn - 0.2, gn + 0.8);
  return (
    <Cam c={{x: 60, y: 220, z: 1.3}} p={p}>
      {RDEFS}<Room t={t} wall="#6A5648" floor="#4A3426" win /><OilLamp x={-420} y={-80} t={t} />
      <Glow x={60} y={300} r={200 + up * 500} o={up * 0.6} id="gWhite" />
      <Bed x={0} y={480} t={t} look={GIRL} up={up} face={{eyes: up > 0.5 ? 'open' : 'closed', mouth: up > 0.5 ? 'smile' : 'flat', look: [1, 0]}} />
      <Bean x={lerp(700, 400, ko(t, 0, 1.8))} y={680} s={0.95} flip look={MOTHER_T} t={t} walk={t < 1.8 ? 1.3 : 0} arms={up > 0.5 ? 'up' : 'reach'} face={{eyes: 'open', mouth: up > 0.5 ? 'open' : 'flat', brow: -0.3, look: [-1, 0.4]}} />
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- the deaf man is brought (muffled world) */
const Deaf: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-60, 60, t / p.dur), y: 220, z: 1.3};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Street t={t} />
      {[-560, -380, 380, 560].map((x, i) => <Bean key={i} x={x} y={690} s={0.9} flip={x > 0} look={TOWN(i)} t={t + i} face={{eyes: 'open', mouth: 'open', look: [x > 0 ? -1 : 1, 0]}} />)}
      <Bean x={-150} y={700} s={1.0} look={DEAF} t={t} arms="up" face={{eyes: 'open', mouth: 'flat', brow: -0.5, look: [1, 0]}} />
      <Bean x={200} y={700} s={1.0} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
      {muffled(true)}
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- aside: fingers in his ears, touches his tongue */
const Aside: React.FC<SP> = (p) => {
  const {t} = p;
  const ears = p.w('ears', p.dur * 0.7);
  const reach = ko(t, ears - 0.8, ears);
  return (
    <Cam c={{x: 0, y: -30, z: 1.95}} p={p}>
      {RDEFS}<Sky dusk={0.25} /><g filter="url(#dof)"><Glow x={300} y={-300} r={600} o={0.5} /></g>
      <Bust x={0} y={0} look={DEAF} t={t} face={{eyes: t > ears ? 'closed' : 'open', mouth: 'flat', brow: -0.3, look: [1, 0]}} />
      {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * lerp(520, 250, reach)} ${lerp(600, -40, reach)}) scale(0.75) rotate(${sd * -100})`}><Hand withered={0} curl={0.6} spread={0.6} skin="#E0A878" sleeve={JESUS.tunic} /></g>)}
      {muffled(true)}
    </Cam>
  );
};

/* 13 ----------------------------------------------------------------- he looks up and sighs */
const Sigh: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.15, t / p.dur)}} p={p}>
      {RDEFS}<Sky dusk={0.25} />
      {Array.from({length: 6}).map((_, i) => <polygon key={i} points={`${-60 + i * 20},-1700 ${60 + i * 20},-1700 ${(i - 3) * 360 + 170},1300 ${(i - 3) * 360 - 170},1300`} fill="#FFF6D0" opacity={0.1} />)}
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: t > p.dur * 0.5 ? 'closed' : 'open', mouth: 'flat', brow: -0.2, look: [0, -1]}} />
      {muffled(true)}
    </Cam>
  );
};

/* 14 ----------------------------------------------------------------- "Ephphatha. Be opened." */
const Open: React.FC<SP> = (p) => {
  const {t} = p;
  const op = p.w('opened', p.dur * 0.6) + 0.05;
  const on = t > op;
  const g = ko(t, op, op + 0.6);
  if (!on) {
    return <Cam c={{x: 0, y: -20, z: lerp(2.0, 2.2, t / op)}} p={p}>{RDEFS}<Sky dusk={0.25} /><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 9) > 0 ? 'open' : 'flat', brow: 0.6, look: [1, 0.2]}} />{muffled(true)}</Cam>;
  }
  return (
    <Cam c={{x: 0, y: -20, z: lerp(2.0, 1.85, k(t, op, p.dur))}} p={p}>
      {RDEFS}<Sky />
      <Glow x={0} y={-60} r={400 + g * 600} o={0.3 + g * 0.5} id="gWhite" />
      {[0, 1, 2].map((i) => { const r = (t - op - i * 0.12) * 1400; return r > 0 ? <circle key={i} cx={0} cy={-80} r={r} fill="none" stroke="#FFF6D8" strokeWidth={22 - i * 6} opacity={Math.max(0, 0.8 - (t - op) * 0.9)} /> : null; })}
      <Bust x={0} y={0} look={DEAF} t={t} face={{eyes: 'wide', mouth: 'open', brow: -0.3, look: [0, -0.3]}} />
    </Cam>
  );
};

/* 15 ----------------------------------------------------------------- he speaks */
const Speak: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 220, z: 1.35}} p={p}>
      {RDEFS}<Sky />
      <rect x={-3000} y={330} width={6000} height={3000} fill="#B8946A" />
      <Bean x={-120} y={700} s={1.05} look={DEAF} t={t} arms="up" face={{eyes: 'open', mouth: Math.sin(t * 10) > 0 ? 'open' : 'smile', brow: 0.3, look: [1, 0]}} />
      <Bean x={230} y={700} s={1.0} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
      {Array.from({length: 4}).map((_, i) => { const ph = (t * 0.8 + i * 0.25) % 1; return <path key={i} d={`M ${-60 + ph * 120} ${300 - ph * 160} q 20 -10 40 0`} fill="none" stroke="#FFDD33" strokeWidth={8} strokeLinecap="round" opacity={1 - ph} />; })}
    </Cam>
  );
};

/* 16 ----------------------------------------------------------------- "He has done everything well!" */
const Well: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: lerp(-60, 60, t / p.dur), y: 220, z: 1.15}} p={p}>
      {RDEFS}<Street t={t} />
      {Array.from({length: 8}).map((_, i) => <Bean key={i} x={-660 + i * 190} y={690 + (i % 2) * 30} s={0.92} flip={i > 3} look={TOWN(i)} t={t + i} arms={(i + Math.floor(t * 3)) % 2 ? 'up' : 'offer'} face={{eyes: Math.sin(t * 4 + i) > 0.4 ? 'closed' : 'open', mouth: 'open', look: [i > 3 ? -1 : 1, 0]}} />)}
    </Cam>
  );
};

/* 17 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 0, z: 1}} p={p}>
      {RDEFS}<Sky dusk={0.5} />
      <circle cx={0} cy={420} r={240} fill="#FFE2B0" /><Glow x={0} y={420} r={800} o={0.6} />
      <path d="M -3000 640 Q -300 560 0 580 Q 300 560 3000 640 L 3000 3000 L -3000 3000 Z" fill="#2a1a20" />
      {[0, 1, 2].map((i) => { const r = 120 + ((t * 120 + i * 140) % 420); return <circle key={i} cx={0} cy={420} r={r} fill="none" stroke="#FFF6D8" strokeWidth={4} opacity={Math.max(0, 0.5 - r / 900)} />; })}
    </Cam>
  );
};

export const SCENES11: Record<string, React.FC<SP>> = {hands: Hands, tradition: Tradition, rules: Rules, heart: Heart, tyre: Tyre, plea: Plea, bread: BreadSc, crumbs: Crumbs, reply: Reply, home: Home, deaf: Deaf, aside: Aside, sigh: Sigh, open: Open, speak: Speak, well: Well, end: End};
