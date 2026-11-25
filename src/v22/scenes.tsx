import React from 'react';
import {FRIENDS, INK, JESUS, Look} from '../v8/fig';
import {C3, Cam, Glow, SP, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {Hall, PH} from '../v11/scenes_room';
import {AP, Bust, Sky} from '../v12/scenes';
import {Street} from '../v15/scenes';

/** Episode 15 — "Hosanna!" (Mark 11). Big moment: the tables crash over in the temple (coins fly, doves burst free). */
const TOWN = (i: number): Look => ({...FRIENDS[i % 4], tunic: ['#A8794A', '#6A7A5A', '#8A5A5A', '#5A6A8A', '#9A8A5A', '#7A5A7A'][i % 6]});
const PETER = AP.simon;

export const Donkey: React.FC<{x: number; y: number; s?: number; t: number; walk?: number; rider?: boolean}> = ({x, y, s = 1, t, walk = 0, rider}) => {
  const sw = Math.sin(t * 9) * 10 * walk;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-80, -40, 50, 90].map((lx, i) => <line key={i} x1={lx} y1={-90} x2={lx + (i % 2 ? sw : -sw)} y2={0} stroke={INK} strokeWidth={14} strokeLinecap="round" />)}
      <ellipse cx={0} cy={-120} rx={130} ry={60} fill="#8A8A90" stroke={INK} strokeWidth={7} />
      {rider ? <path d="M -60 -170 Q 0 -200 60 -170 L 70 -110 L -70 -110 Z" fill="#B03A3A" stroke={INK} strokeWidth={5} /> : null}
      <path d="M 100 -140 Q 150 -190 150 -230" fill="none" stroke={INK} strokeWidth={46} strokeLinecap="round" /><path d="M 100 -140 Q 150 -190 150 -230" fill="none" stroke="#8A8A90" strokeWidth={34} strokeLinecap="round" />
      <ellipse cx={178} cy={-238} rx={50} ry={34} fill="#8A8A90" stroke={INK} strokeWidth={7} /><ellipse cx={214} cy={-230} rx={18} ry={16} fill="#C8C8CC" stroke={INK} strokeWidth={4} />
      <circle cx={180} cy={-250} r={7} fill={INK} />
      {[-10, 20].map((dx, i) => <path key={i} d={`M ${150 + dx} -262 l ${-14 + i * 8} -60 l 20 50 Z`} fill="#8A8A90" stroke={INK} strokeWidth={5} />)}
      <path d="M -130 -130 q -30 20 -26 60" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
};
export const Palm: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 0 L 0 -200" stroke="#5A7A2A" strokeWidth={8} />
    {Array.from({length: 7}).map((_, i) => <g key={i}><path d={`M 0 ${-30 - i * 24} q -50 -6 -70 26`} fill="none" stroke="#4E8A3A" strokeWidth={10} strokeLinecap="round" /><path d={`M 0 ${-30 - i * 24} q 50 -6 70 26`} fill="none" stroke="#5E9A44" strokeWidth={10} strokeLinecap="round" /></g>)}
  </g>
);
const FigTree: React.FC<{x: number; y: number; s?: number; dead?: number}> = ({x, y, s = 1, dead = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -30 0 Q -20 -150 -10 -260 L 10 -260 Q 20 -150 30 0 Z" fill="#6E4A30" stroke={INK} strokeWidth={6} />
    {[[-80, -300], [70, -310], [0, -360]].map(([bx, by], i) => <path key={i} d={`M 0 -240 Q ${bx / 2} ${by + 40} ${bx} ${by}`} stroke="#6E4A30" strokeWidth={14} fill="none" strokeLinecap="round" />)}
    <g opacity={1 - dead}>{[[-120, -320, 110], [100, -330, 120], [0, -400, 130], [-40, -280, 90], [60, -270, 90]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? '#5E8A44' : '#4E7A3A'} stroke={INK} strokeWidth={5} />)}</g>
    {dead > 0 ? <g opacity={dead}>{Array.from({length: 7}).map((_, i) => <path key={i} d={`M ${-140 + i * 45} ${-120 + (i % 3) * 30} q 14 -8 26 4 q -12 14 -26 -4 Z`} fill="#8A6A3A" stroke={INK} strokeWidth={3} />)}</g> : null}
  </g>
);
const Table: React.FC<{x: number; y: number; s?: number; tip?: number; t: number}> = ({x, y, s = 1, tip = 0, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${tip * 100} ${tip > 0 ? 160 : -160} 0)`}>
    <rect x={-160} y={-120} width={320} height={30} rx={6} fill="#8a5a33" stroke={INK} strokeWidth={7} />
    {[-130, 110].map((lx) => <rect key={lx} x={lx} y={-90} width={22} height={90} fill="#6E4A30" stroke={INK} strokeWidth={5} />)}
    {tip < 0.2 ? [-90, -40, 10, 60, 100].map((cx, i) => <circle key={i} cx={cx} cy={-132 - (i % 2) * 8} r={14} fill="#F2C24A" stroke="#8A5A10" strokeWidth={4} />) : null}
  </g>
);
const Dove: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={34} ry={20} fill="#F4F2EC" stroke={INK} strokeWidth={4} /><circle cx={30} cy={-12} r={14} fill="#F4F2EC" stroke={INK} strokeWidth={4} />
    <path d={`M -6 -8 Q -20 ${-50 - Math.sin(t * 20) * 25} -50 ${-30 - Math.sin(t * 20) * 25}`} fill="#E8E4DA" stroke={INK} strokeWidth={4} />
    <path d="M 42 -12 l 10 3 l -10 3 Z" fill="#E8A040" />
  </g>
);
const Cage: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}><rect x={-60} y={-100} width={120} height={100} fill="none" stroke="#8a5a33" strokeWidth={6} />{[-30, 0, 30].map((dx) => <line key={dx} x1={dx} y1={-100} x2={dx} y2={0} stroke="#8a5a33" strokeWidth={4} />)}<path d="M -60 -100 Q 0 -150 60 -100" fill="none" stroke="#8a5a33" strokeWidth={6} /></g>
);
const Road: React.FC<{dusk?: number}> = ({dusk = 0}) => (
  <g>
    <Sky dusk={dusk} />
    <g filter="url(#dof)"><path d="M -3000 260 L -900 260 L -900 60 L -700 60 L -700 -40 L -500 -40 L -500 60 L 300 60 L 300 -80 L 420 -140 L 540 -80 L 540 60 L 1100 60 L 1100 260 L 3000 260 L 3000 3000 L -3000 3000 Z" fill="#D8C8A8" opacity={0.85} /></g>
    <rect x={-3000} y={330} width={6000} height={3000} fill="#C2A47A" />
    <path d="M -3000 900 Q 0 480 3000 900 L 3000 1100 Q 0 640 -3000 1100 Z" fill="#D8BC90" opacity={0.7} />
  </g>
);

/* 1 ------------------------------------------------------------------ near Jerusalem; two disciples sent ahead */
const Near: React.FC<SP> = (p) => {
  const {t} = p;
  const go = ko(t, p.dur * 0.4, p.dur);
  return (
    <Cam c={{x: lerp(-80, 80, t / p.dur), y: 220, z: 1.15}} p={p}>
      {RDEFS}<Road />
      <Bean x={-320} y={700} s={1.0} look={JESUS} t={t} arms="point" face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />
      {['andrew', 'philip'].map((n, i) => <Bean key={n} x={-60 + i * 160 + go * 500} y={710} s={0.9} look={AP[n]} t={t + i} walk={go > 0 && go < 1 ? 1.4 : 0} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />)}
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ "you will find a young donkey…" */
const DonkeySc: React.FC<SP> = (p) => {
  const {t} = p;
  const d = ko(t, p.w('donkey', p.dur * 0.35) - 0.2, p.w('donkey', p.dur * 0.35) + 0.5);
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>
      {RDEFS}<Road />
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'smile', brow: 0.3, look: [-1, 0.2]}} />
      <g transform={`translate(0 -270) scale(${0.45 * d})`} opacity={d}><circle cx={60} cy={-120} r={230} fill="#FFFBEA" stroke={INK} strokeWidth={10} /><Donkey x={-20} y={0} s={0.9} t={t} /></g>
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ cloaks on the donkey; Jesus rides */
const Ride: React.FC<SP> = (p) => {
  const {t} = p;
  const sit = ko(t, p.dur * 0.65, p.dur * 0.85);
  return (
    <Cam c={{x: 0, y: 220, z: 1.25}} p={p}>
      {RDEFS}<Road />
      <Donkey x={-40} y={760} s={1.1} t={t} rider={t > p.dur * 0.35} />
      {sit > 0.5 ? <Bean x={-40} y={600} s={0.95} sit look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} /> : <Bean x={380} y={720} s={1.0} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />}
      {['andrew', 'philip'].map((n, i) => <Bean key={n} x={-440 + i * 150} y={730} s={0.9} look={AP[n]} t={t + i} arms={t < p.dur * 0.4 ? 'offer' : 'up'} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />)}
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ cloaks and branches on the road */
const Branches: React.FC<SP> = (p) => {
  const {t} = p;
  const br = ko(t, p.w('branches', p.dur * 0.7) - 0.4, p.w('branches', p.dur * 0.7) + 0.4);
  return (
    <Cam c={{x: lerp(-200, 100, t / p.dur), y: 220, z: 1.05}} p={p}>
      {RDEFS}<Road />
      {Array.from({length: 7}).map((_, i) => <path key={i} d={`M ${-900 + i * 280} 860 q 90 -30 200 0 q -90 40 -200 0 Z`} fill={['#B03A3A', '#3A6AA0', '#C8A040', '#5A8A4A'][i % 4]} stroke={INK} strokeWidth={4} />)}
      {Array.from({length: 8}).map((_, i) => <g key={i} opacity={br}><Palm x={-1000 + i * 260} y={900} s={0.6} rot={80 + (i % 2) * 20} /></g>)}
      {Array.from({length: 8}).map((_, i) => <Bean key={i} x={-1000 + i * 290 + (i > 3 ? 120 : 0)} y={680 + (i % 2) * 30} s={0.85} flip={i > 3} look={TOWN(i)} t={t + i} arms="up" hold={i % 2 ? <Palm x={0} y={0} s={0.5} /> : undefined} face={{eyes: 'open', mouth: 'open', look: [i > 3 ? -1 : 1, -0.3]}} />)}
      <Donkey x={lerp(-500, 100, t / p.dur)} y={800} s={0.95} t={t} walk={1} rider /><Bean x={lerp(-500, 100, t / p.dur)} y={660} s={0.85} sit look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ "Hosanna!" */
const Hosanna: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 160, z: lerp(1.2, 1.35, t / p.dur)}} p={p}>
      {RDEFS}<Road /><Glow x={0} y={300} r={700} o={0.5} />
      {Array.from({length: 22}).map((_, i) => { const u = (t * 0.6 + rnd(i)) % 1; return <path key={i} d="M 0 0 q 12 -6 24 0 q -12 8 -24 0 Z" transform={`translate(${(rnd(i + 3) - 0.5) * 1400} ${-500 + u * 1400}) rotate(${t * 80 + i * 40})`} fill="#5E9A44" opacity={0.8} />; })}
      {Array.from({length: 6}).map((_, i) => <Bean key={i} x={-700 + i * 280} y={700 + (i % 2) * 40} s={0.9} flip={i > 2} look={TOWN(i + 2)} t={t + i} arms="up" hold={<Palm x={0} y={0} s={0.5} rot={Math.sin(t * 6 + i) * 20} />} face={{eyes: Math.sin(t * 4 + i) > 0.3 ? 'closed' : 'open', mouth: 'open', look: [i > 2 ? -1 : 1, -0.4]}} />)}
      <Donkey x={-20} y={820} s={0.9} t={t} walk={0.6} rider /><Bean x={-20} y={690} s={0.85} sit look={JESUS} t={t} arms="offer" face={{eyes: 'open', mouth: 'smile', look: [0, 0.2]}} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ the fig tree: only leaves */
const Fig: React.FC<SP> = (p) => {
  const {t} = p;
  const lv = ko(t, p.w('leaves', p.dur * 0.85) - 0.4, p.w('leaves', p.dur * 0.85) + 0.2);
  return (
    <Cam c={{x: 0, y: 220, z: 1.25}} p={p}>
      {RDEFS}<Road />
      <FigTree x={180} y={760} s={1.1} />
      <Bean x={-200} y={740} s={1.0} look={JESUS} t={t} walk={t < p.dur * 0.3 ? 1 : 0} arms={t > p.dur * 0.4 ? 'reach' : 'none'} face={{eyes: 'open', mouth: lv > 0.5 ? 'frown' : 'flat', brow: lv > 0.5 ? -0.4 : 0, look: [1, -0.6]}} />
      {lv > 0 ? <text x={180} y={150} fontFamily="Fredoka" fontWeight={700} fontSize={120} fill="#FFDD33" stroke={INK} strokeWidth={12} paintOrder="stroke" textAnchor="middle" opacity={lv}>?</text> : null}
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ "May no one ever eat fruit from you again." */
const Curse: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>{RDEFS}<Road /><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'flat', brow: -0.5, look: [1, -0.3]}} /></Cam>;
};

/* 8 ------------------------------------------------------------------ the temple full of buying and selling */
const Temple: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: lerp(-120, 120, t / p.dur), y: 220, z: 1.1}} p={p}>
      {RDEFS}<Hall t={t} />
      <Table x={-420} y={820} s={0.9} t={t} /><Table x={300} y={820} s={0.9} t={t} />
      <Cage x={720} y={820} /><Dove x={720} y={760} s={0.8} t={0} />
      {Array.from({length: 6}).map((_, i) => <Bean key={i} x={-760 + i * 300} y={700 + (i % 2) * 30} s={0.85} flip={i % 2 === 1} look={i % 3 === 0 ? PH(i) : TOWN(i)} t={t + i} arms={i % 2 ? 'offer' : 'point'} face={{eyes: 'open', mouth: Math.sin(t * 10 + i) > 0 ? 'open' : 'smile', look: [i % 2 ? -1 : 1, 0]}} />)}
      <Bean x={lerp(-900, -620, ko(t, 0, p.dur))} y={720} s={1.0} look={JESUS} t={t} walk={t < p.dur * 0.8 ? 1 : 0} face={{eyes: 'open', mouth: 'frown', brow: -0.7, look: [1, 0]}} />
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ TABLES OVERTURNED (BIG MOMENT) */
const Tables: React.FC<SP> = (p) => {
  const {t} = p;
  const ov = p.w('overturned', p.dur * 0.25), dv = p.w('doves', p.dur * 0.85);
  const tip = ko(t, ov - 0.1, ov + 0.4);
  const shake = Math.max(0, 1 - Math.abs(t - ov) / 0.5);
  return (
    <Cam c={{x: -80 + Math.sin(t * 40) * 12 * shake, y: 400, z: lerp(1.45, 1.38, tip)}} p={p}>
      {RDEFS}<Hall t={t} />
      <Table x={-40} y={820} s={1.2} t={t} tip={tip} />
      {t > ov ? Array.from({length: 18}).map((_, i) => { const u = t - ov; const vx = (rnd(i) - 0.3) * 900, vy = -500 - rnd(i + 5) * 600; return <circle key={i} cx={-40 + vx * u} cy={Math.min(860, 680 + vy * u + 1600 * u * u)} r={14} fill="#F2C24A" stroke="#8A5A10" strokeWidth={4} />; }) : null}
      <Cage x={520} y={820} />
      {t > dv - 0.3 ? Array.from({length: 5}).map((_, i) => { const u = Math.max(0, t - dv + 0.3 - i * 0.08); return <Dove key={i} x={520 + u * (200 + i * 120) * (i % 2 ? -1 : 1)} y={760 - u * 500 - i * 20} s={0.8} t={t + i} />; }) : <Dove x={520} y={760} s={0.8} t={0} />}
      <Bean x={-360} y={740} s={1.1} look={JESUS} t={t} arms={tip > 0.1 && tip < 0.9 ? 'up' : 'reach'} face={{eyes: 'open', mouth: 'open', brow: -0.9, look: [1, 0]}} />
      {[260, 720].map((x, i) => <Bean key={i} x={x} y={720} s={0.9} flip look={i ? TOWN(1) : PH(2)} t={t + i} arms={t > ov ? 'up' : 'none'} face={{eyes: t > ov ? 'wide' : 'open', mouth: t > ov ? 'open' : 'smile', brow: -0.5, look: [-1, 0]}} />)}
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- "a house of prayer… a den of robbers!" */
const Prayer: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.2, t / p.dur)}} p={p}>{RDEFS}<Hall t={t} /><rect x={-3000} y={-3000} width={6000} height={6000} fill="#3a0a10" opacity={0.15} /><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'frown', brow: -0.8, look: [1, 0]}} /></Cam>;
};

/* 11 ----------------------------------------------------------------- the chief priests plot */
const Plot: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 220, z: 1.3}} p={p}>
      {RDEFS}<Hall t={t} dark={0.5} />
      {[-300, -100, 120].map((x, i) => <Bean key={i} x={x} y={720} s={0.95} flip={i === 2} look={PH(i)} t={t + i} face={{eyes: 'half', mouth: Math.sin(t * 11 + i) > 0.4 ? 'open' : 'frown', brow: -1, look: [i === 2 ? -1 : 1, 0]}} />)}
      <g opacity={ko(t, p.dur * 0.6, p.dur * 0.75)}><Glow x={560} y={420} r={300} o={0.5} />{[0, 1, 2].map((i) => <Bean key={i} x={460 + i * 110} y={700} s={0.6} look={TOWN(i)} t={t + i} face={{eyes: 'wide', mouth: 'open', look: [-1, -0.4]}} />)}</g>
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- the fig tree withered from the roots */
const Withered: React.FC<SP> = (p) => {
  const {t} = p;
  const dd = ko(t, p.w('withered', p.dur * 0.75) - 0.6, p.w('withered', p.dur * 0.75) + 0.6);
  return (
    <Cam c={{x: 0, y: 220, z: 1.25}} p={p}>
      {RDEFS}<Road dusk={0.15} />
      <FigTree x={180} y={760} s={1.1} dead={Math.max(0.6, dd)} />
      {['simon', 'john'].map((n, i) => <Bean key={n} x={-360 + i * 160} y={740} s={0.95} look={AP[n]} t={t + i} walk={t < p.dur * 0.4 ? 1 : 0} face={{eyes: dd > 0.5 ? 'wide' : 'open', mouth: dd > 0.5 ? 'open' : 'flat', look: [1, -0.5]}} />)}
    </Cam>
  );
};

/* 13 ----------------------------------------------------------------- Peter: "Look!" */
const Look13: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(2.0, 2.15, t / p.dur)}} p={p}>{RDEFS}<Road dusk={0.15} /><Bust x={0} y={0} look={PETER} t={t} face={{eyes: 'wide', mouth: Math.sin(t * 13) > 0 ? 'open' : 'smile', brow: 0.6, look: [-1, 0]}} /></Cam>;
};

/* 14 ----------------------------------------------------------------- faith that moves mountains */
const Faith: React.FC<SP> = (p) => {
  const {t} = p;
  const mt = p.w('mountain', p.dur * 0.4);
  const fly = ko(t, mt + 0.4, mt + 1.8);
  const splash = ko(t, mt + 1.6, mt + 2.4);
  return (
    <Cam c={{x: 0, y: 250, z: 1.0}} p={p}>
      {RDEFS}<Sky dusk={0.1} />
      <rect x={-3000} y={300} width={6000} height={3000} fill="#3C7BB0" />
      {[0, 1, 2].map((i) => <path key={i} d={`M -3000 ${330 + i * 60} q 150 -20 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0 t 300 0`} fill="none" stroke="#7EC8F0" strokeWidth={5} opacity={0.6} transform={`translate(${(t * 60 + i * 100) % 300} 0)`} />)}
      <path d="M -3000 330 L -60 330 L -60 3000 L -3000 3000 Z" fill="#B8A47A" />
      <g transform={`translate(${lerp(-180, 380, fly)} ${lerp(80, 300, fly * fly) - Math.sin(fly * Math.PI) * 350}) rotate(${fly * 30}) scale(0.7)`} opacity={1 - splash * 0.8}>
        <path d="M -320 330 L -60 -160 L 40 -40 L 140 -220 L 360 330 Z" fill="#8A8098" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M -60 -160 L -10 -90 L 40 -40 L 100 -150 L 140 -220 L 180 -140 L 120 -100 Z" fill="#FFFFFF" opacity={0.85} />
      </g>
      {splash > 0 ? Array.from({length: 14}).map((_, i) => { const a = -Math.PI * (0.1 + 0.8 * rnd(i)); return <circle key={i} cx={380 + Math.cos(a) * 400 * splash} cy={330 + Math.sin(a) * 500 * splash + 600 * splash * splash} r={20} fill="#BFE9F2" opacity={1 - splash * 0.8} />; }) : null}
      <Bean x={-360} y={780} s={0.9} look={JESUS} t={t} arms="point" face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'smile', look: [1, -0.3]}} />
    </Cam>
  );
};

/* 15 ----------------------------------------------------------------- ask in prayer, believe */
const Believe: React.FC<SP> = (p) => {
  const {t} = p;
  const b = ko(t, p.w('believe', p.dur * 0.45) - 0.2, p.w('believe', p.dur * 0.45) + 0.6);
  return (
    <Cam c={{x: 0, y: 200, z: 1.4}} p={p}>
      {RDEFS}<Sky dusk={0.35} /><rect x={-3000} y={330} width={6000} height={3000} fill="#8A7A6A" />
      {Array.from({length: 6}).map((_, i) => <polygon key={i} points={`${-60 + i * 20},-1700 ${60 + i * 20},-1700 ${(i - 2.5) * 260 + 120},1300 ${(i - 2.5) * 260 - 120},1300`} fill="#FFF6D0" opacity={0.1 * b} />)}
      <Glow x={0} y={420} r={300 + b * 400} o={0.3 + b * 0.5} />
      <Bean x={0} y={760} s={1.1} sit look={TOWN(3)} t={t} arms="up" face={{eyes: 'closed', mouth: 'smile', brow: 0.4, look: [0, -0.5]}} />
    </Cam>
  );
};

/* 16 ----------------------------------------------------------------- forgive */
const Forgive: React.FC<SP> = (p) => {
  const {t} = p;
  const f = ko(t, p.w('forgive', p.dur * 0.85) - 0.4, p.w('forgive', p.dur * 0.85) + 0.6);
  return (
    <Cam c={{x: 0, y: 220, z: 1.3}} p={p}>
      {RDEFS}<Road dusk={0.3} /><Glow x={0} y={420} r={200 + f * 500} o={f * 0.6} />
      <Bean x={lerp(-380, -150, f)} y={740} s={1.0} look={TOWN(1)} t={t} arms={f > 0.5 ? 'offer' : 'cross'} face={{eyes: 'open', mouth: f > 0.5 ? 'smile' : 'frown', brow: f > 0.5 ? 0.4 : -0.8, look: [1, 0]}} />
      <Bean x={lerp(380, 150, f)} y={740} s={1.0} flip look={TOWN(4)} t={t + 1} arms={f > 0.5 ? 'offer' : 'cross'} face={{eyes: 'open', mouth: f > 0.5 ? 'smile' : 'frown', brow: f > 0.5 ? 0.4 : -0.8, look: [-1, 0]}} />
      {f > 0.5 ? <path transform={`translate(0 ${330 - f * 40}) scale(${f})`} d="M 0 40 C -90 -20 -70 -90 -20 -80 C 0 -76 0 -60 0 -52 C 0 -60 0 -76 20 -80 C 70 -90 90 -20 0 40 Z" fill="#E8605A" stroke="#FFE2B0" strokeWidth={8} /> : null}
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
      <path d="M -3000 640 L -700 640 L -700 480 L -500 480 L -500 400 L -300 400 L -300 480 L 300 480 L 300 380 L 420 330 L 540 380 L 540 480 L 3000 480 L 3000 640 Z" fill="#3a2a34" />
      <path d="M -3000 640 Q -300 560 0 580 Q 300 560 3000 640 L 3000 3000 L -3000 3000 Z" fill="#2a1a20" />
      {Array.from({length: 14}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 1600} cy={-600 + rnd(i + 9) * 700} r={2 + rnd(i) * 3} fill="#FFFBEA" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
    </Cam>
  );
};

export const SCENES15: Record<string, React.FC<SP>> = {near: Near, donkey: DonkeySc, ride: Ride, branches: Branches, hosanna: Hosanna, fig: Fig, curse: Curse, temple: Temple, tables: Tables, prayer: Prayer, plot: Plot, withered: Withered, look: Look13, faith: Faith, believe: Believe, forgive: Forgive, end: End};
