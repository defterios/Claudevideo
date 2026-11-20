import React from 'react';
import {FRIENDS, INK, JESUS, JOHN, Look} from '../v8/fig';
import {C3, Cam, Fill, Glow, Hammer, SP, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Bean, OilLamp, RDEFS, Room, SunPatch} from '../v11/room';
import {Hall} from '../v11/scenes_room';
import {AP, Bust, Sky, TWELVE} from '../v12/scenes';

/** Episode 9 — "A Prophet Without Honor" (Mark 6:1-29). John's death is shown only as a candle going out. */
export const HEROD: Look = {skin: '#D2A07E', hair: '#2A1E16', tunic: '#7A2E4A', sash: '#D9A93A', style: 'short', beard: true};
export const HERODIAS: Look = {skin: '#E0A880', hair: '#1E1612', tunic: '#5A2E6A', sash: '#D9A93A', style: 'hood', wrap: '#3E1E4E', beard: false};
export const DANCER: Look = {skin: '#E8B48C', hair: '#2A1A12', tunic: '#C9705A', sash: '#E8C46A', style: 'long', beard: false};
const TOWN = (i: number): Look => ({...FRIENDS[i % 4], tunic: ['#A8794A', '#6A7A5A', '#8A5A5A', '#5A6A8A', '#9A8A5A'][i % 5]});
export const Crown: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M -70 0 L -70 -50 L -35 -20 L 0 -64 L 35 -20 L 70 -50 L 70 0 Z" fill="#E8C04A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />{[-35, 0, 35].map((d) => <circle key={d} cx={d} cy={-14} r={7} fill="#C9303A" />)}</g>
);
/** a bean with a crown (Herod); feet at x,y */
export const King: React.FC<React.ComponentProps<typeof Bean>> = (p) => (<g><Bean {...p} /><Crown x={p.x} y={p.y + ((p.sit ? 100 : 0) - 505) * (p.s ?? 1)} s={(p.s ?? 1) * 0.9} /></g>);
const KingBust: React.FC<{x: number; y: number; t: number; face?: React.ComponentProps<typeof Bean>['face']}> = ({x, y, t, face}) => (
  <g><Bust x={x} y={y} look={HEROD} t={t} face={face} /><Crown x={x} y={y - 135} s={1.35} /></g>
);
export const Palace: React.FC<{t: number; dark?: number}> = ({t, dark = 0}) => (
  <g>
    <Room t={t} wall="#6A3E3E" floor="#4A2A24" win={false} />
    {[-900, -450, 450, 900].map((x) => <rect key={x} x={x - 60} y={-3000} width={120} height={3300} fill="#8A5A4A" stroke="#3a1a14" strokeWidth={6} />)}
    {[-640, 0, 640].map((x, i) => <path key={i} d={`M ${x - 140} 300 L ${x - 140} -380 Q ${x} -540 ${x + 140} -380 L ${x + 140} 300`} fill="none" stroke="#C9A35A" strokeWidth={10} opacity={0.6} />)}
    <OilLamp x={-560} y={-120} t={t} /><OilLamp x={560} y={-120} t={t + 1} />
    {dark ? <rect x={-3000} y={-3000} width={6000} height={6000} fill="#08040a" opacity={dark} /> : null}
  </g>
);
export const Cell: React.FC<{t: number; candle?: number}> = ({t, candle = 1}) => (
  <g>
    <rect x={-3000} y={-3000} width={6000} height={6000} fill="#1A1820" />
    <rect x={-3000} y={300} width={6000} height={3000} fill="#24222A" />
    {Array.from({length: 18}).map((_, i) => <rect key={i} x={-1300 + i * 150 + (i % 2) * 40} y={-900 + (i % 5) * 220} width={130} height={90} fill="#2A2832" stroke="#141218" strokeWidth={5} />)}
    <rect x={-300} y={-720} width={220} height={150} fill="#2E3450" stroke="#0e0c12" strokeWidth={8} />
    {[-260, -210, -160, -110].map((x) => <line key={x} x1={x} y1={-720} x2={x} y2={-570} stroke="#0e0c12" strokeWidth={10} />)}
    {candle > 0 ? <g><Glow x={330} y={140} r={480 * candle + Math.sin(t * 9) * 10} o={0.75 * candle} /><path d={`M 330 ${130} q -9 -18 0 -34 q 9 16 0 34`} fill="#FFD36A" opacity={candle} /></g> : null}
    <rect x={312} y={140} width={36} height={50} fill="#E8DCC4" stroke={INK} strokeWidth={4} />
    <rect x={270} y={190} width={120} height={20} fill="#3a2a22" stroke={INK} strokeWidth={4} />
  </g>
);

/* 1 ------------------------------------------------------------------ teaching in the Nazareth synagogue */
const Home: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: lerp(260, 160, k(t, 0, p.dur)), z: lerp(1.15, 1.3, k(t, 0, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Hall t={t} />
      <Bean x={0} y={560} s={1.0} look={JESUS} t={t} arms="offer" face={{eyes: 'open', mouth: Math.sin(t * 11) > 0 ? 'open' : 'smile'}} />
      {[-560, -330, 330, 560].map((x, i) => <Bean key={i} x={x} y={760} s={0.95} sit flip={x > 0} look={TOWN(i)} t={t + i} face={{eyes: 'open', mouth: 'flat', look: [x > 0 ? -1 : 1, -0.3]}} />)}
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ "Isn't this the carpenter?" — flashback */
const Whisper: React.FC<SP> = (p) => {
  const {t} = p;
  const cp = p.w('carpenter', p.dur * 0.5);
  const fb = t > cp - 0.15 && t < cp + 1.4;
  if (fb) {
    const u = t - cp;
    const ph = ((u * 2.8) % 1);
    return (
      <Cam c={{x: 0, y: 160, z: 1.35}} p={p}>
        {RDEFS}<Room t={t} wall="#8A6A4A" floor="#6A4A30" win />
        <rect x={60} y={500} width={420} height={34} rx={6} fill="#C99A62" stroke={INK} strokeWidth={7} />
        <Bean x={-80} y={660} s={1.0} look={JESUS} t={t} arms={ph < 0.5 ? 'up' : 'offer'} hold={Hammer} face={{eyes: 'half', mouth: 'flat', look: [1, 0.4]}} />
        <Fill fill="#C9A060" o={0.32} />
        <rect x={-3000} y={-3000} width={6000} height={6000} fill="none" stroke="#1c0d16" strokeWidth={2400} opacity={0.4} />
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: 40, z: lerp(1.45, 1.6, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Hall t={t} dark={0.3} />
      <Bust x={-230} y={0} look={TOWN(1)} t={t} face={{eyes: 'half', mouth: Math.sin(t * 13) > 0 ? 'open' : 'flat', brow: -0.6, look: [1, 0]}} />
      <Bust x={260} y={60} look={TOWN(3)} t={t + 1} face={{eyes: 'half', mouth: 'frown', brow: -0.6, look: [-1, 0]}} />
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ they took offense */
const Offense: React.FC<SP> = (p) => {
  const {t} = p;
  const turn = ko(t, 0.3, 1.2);
  const c: C3 = {x: 0, y: 200, z: 1.3};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Hall t={t} dark={0.2} />
      {[-480, -240, 240, 480].map((x, i) => <Bean key={i} x={x + (x > 0 ? 1 : -1) * turn * 60} y={660} s={1.0} flip={turn > 0.5 ? x < 0 : x > 0} look={TOWN(i)} t={t + i} arms="cross" face={{eyes: 'half', mouth: 'frown', brow: -0.9, look: [0, 0]}} />)}
      <Bean x={0} y={640} s={1.0} look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', brow: -0.2, look: [0, 0]}} />
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ "A prophet has honor everywhere…" */
const Prophet: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.15, t / p.dur)}} p={p}>
      {RDEFS}<Hall t={t} />
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t < p.dur - 0.8 && Math.sin(t * 12) > 0 ? 'open' : 'flat', brow: -0.2, look: [1, 0]}} />
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ amazed at their unbelief */
const Unbelief: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-80, 80, t / p.dur), y: 200, z: 1.2};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.5} />
      <g filter="url(#dof)">{[-900, -420, 60, 540].map((x, i) => <rect key={i} x={x} y={-200 - (i % 2) * 60} width={380} height={520} fill="#B8946A" stroke="#7a5a3a" strokeWidth={6} />)}</g>
      <rect x={-3000} y={330} width={6000} height={3000} fill="#A8865E" />
      {[-520, -360].map((x, i) => <Bean key={i} x={x} y={600} s={0.9} look={TOWN(i + 2)} t={t + i} arms="cross" face={{eyes: 'half', mouth: 'frown'}} dim={0.25} />)}
      <Bean x={lerp(-60, 260, lin(t, 0.3, p.dur))} y={660} s={1.0} flip={false} look={JESUS} t={t} walk={1} face={{eyes: 'half', mouth: 'frown', brow: -0.3, look: [-1, 0]}} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ the twelve sent out, two by two */
const Staff = (<g transform="rotate(90)"><line x1={-180} y1={0} x2={120} y2={0} stroke="#7a5233" strokeWidth={12} strokeLinecap="round" /></g>);
const Sent: React.FC<SP> = (p) => {
  const {t} = p;
  const st = p.w('staff', p.dur * 0.55);
  if (t > st - 0.1 && t < st + 1.6) {
    const u = t - st;
    return (
      <Cam c={{x: 0, y: 0, z: 1.6}} p={p}>
        {RDEFS}<Sky />
        <g transform={`translate(0 ${lerp(700, 0, ko(u, 0, 0.5))}) rotate(-8)`}><line x1={0} y1={-520} x2={0} y2={520} stroke="#7a5233" strokeWidth={30} strokeLinecap="round" /><line x1={0} y1={-520} x2={0} y2={520} stroke="#9a7243" strokeWidth={12} strokeLinecap="round" /></g>
        {['NO BREAD', 'NO BAG', 'NO MONEY'].map((w, i) => { const o = ko(u, 0.5 + i * 0.3, 0.7 + i * 0.3); return <text key={w} x={0} y={-300 + i * 120} textAnchor="middle" fontFamily="Anton" fontSize={90} fill="#FBEFD9" stroke="#1c0d16" strokeWidth={10} paintOrder="stroke" opacity={o * 0}>{w}</text>; })}
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: lerp(260, 120, k(t, 0, p.dur)), z: lerp(1.25, 0.95, k(t, 0, p.dur))};
  const go = lin(t, 1.0, p.dur);
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky />
      <g filter="url(#dof)"><path d="M -1600 300 L -700 -100 L -200 160 L 400 -200 L 1600 250 L 1600 1500 L -1600 1500 Z" fill="#9A8A6A" /></g>
      <rect x={-3000} y={320} width={6000} height={3000} fill="#B8946A" />
      <Bean x={0} y={560} s={0.95} look={JESUS} t={t} arms="offer" face={{eyes: 'open', mouth: 'smile'}} />
      {[0, 1, 2, 3, 4, 5].map((pi) => { const ang = (pi - 2.5) * 0.55; const dx = Math.sin(ang) * 1300 * go, dy = (1 - Math.cos(ang)) * 200 * go; return [0, 1].map((m) => <Bean key={pi + '-' + m} x={(pi - 2.5) * 190 + m * 70 + dx} y={760 + (pi % 2) * 30 + dy} s={0.82} flip={dx < 0} look={AP[TWELVE[pi * 2 + m]]} t={t + pi + m * 0.3} walk={go > 0 ? 1 : 0} hold={m === 0 ? Staff : undefined} arms={m === 0 ? 'reach' : 'none'} face={{eyes: 'open', mouth: 'smile', look: [dx < 0 ? -1 : 1, 0]}} />); })}
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ they healed the sick */
const Healed: React.FC<SP> = (p) => {
  const {t} = p;
  const hl = p.w('healed', p.dur * 0.7);
  const g = ko(t, hl - 0.2, hl + 0.6);
  const c: C3 = {x: 0, y: 200, z: 1.35};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky />
      <g filter="url(#dof)">{[-700, -200, 300, 800].map((x, i) => <rect key={i} x={x - 200} y={-260 + (i % 2) * 60} width={400} height={600} fill="#D9B48C" />)}</g>
      <rect x={-3000} y={320} width={6000} height={3000} fill="#B8946A" />
      <Glow x={120} y={260} r={200 + g * 500} o={g * 0.7} id="gWhite" />
      <Bean x={-200} y={660} s={1.0} look={AP.john} t={t} arms="reach" face={{eyes: 'open', mouth: 'smile', look: [1, 0.3]}} />
      <Bean x={-420} y={660} s={0.95} look={AP.james} t={t + 1} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />
      <Bean x={160} y={660} s={0.95} flip sit={g < 0.5} look={TOWN(2)} t={t} arms={g > 0.5 ? 'up' : 'none'} face={g > 0.5 ? {eyes: 'open', mouth: 'open'} : {eyes: 'closed', mouth: 'frown', brow: -0.6}} />
    </Cam>
  );
};

/* 8 ------------------------------------------------------------------ Herod hears, and is afraid */
const Herod: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 70, y: 330, z: lerp(1.6, 1.8, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Palace t={t} dark={0.3} />
      <path d="M -190 720 L -190 160 Q 0 40 190 160 L 190 720 Z" fill="#8A2E3A" stroke="#D9A93A" strokeWidth={12} />
      <King x={0} y={700} s={1.0} sit look={HEROD} t={t} face={{eyes: t > p.w('afraid', p.dur * 0.7) - 0.2 ? 'wide' : 'half', mouth: 'flat', brow: -0.5, look: [1, 0]}} />
      <Bean x={420} y={720} s={0.9} flip look={TOWN(4)} t={t} arms="offer" face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'flat', look: [-1, -0.3]}} />
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ "John… has come back from the dead!" */
const Ghost: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: Math.sin(t * 30) * 3, y: -20, z: lerp(1.9, 2.05, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Palace t={t} dark={0.6} />
      <g opacity={0.25 + 0.1 * Math.sin(t * 3)} filter="url(#dofS)"><Bust x={260} y={-120} look={JOHN} t={t} face={{eyes: 'open', mouth: 'flat'}} /></g>
      <KingBust x={-60} y={40} t={t} face={{eyes: 'wide', mouth: 'open', brow: -1, look: [1, -0.4]}} />
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- John in prison: "It is not right…" */
const Prison: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-40, 40, t / p.dur), y: 260, z: 1.75};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Cell t={t} />
      <Bean x={-60} y={600} s={1.0} sit look={JOHN} t={t} face={{eyes: 'open', mouth: Math.sin(t * 11) > 0.3 ? 'open' : 'flat', brow: 0.4, look: [1, -0.3]}} />
      <g>{Array.from({length: 7}).map((_, i) => <rect key={i} x={-560 + i * 170} y={-1200} width={26} height={2000} fill="#0e0c12" />)}</g>
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- the feast and the dance */
const Feast: React.FC<SP> = (p) => {
  const {t} = p;
  const dn = p.w('danced', p.dur * 0.6);
  const dancing = t > dn - 0.4;
  const c: C3 = {x: lerp(-120, 120, t / p.dur), y: 420, z: lerp(1.35, 1.5, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Palace t={t} />
      <rect x={-900} y={460} width={1800} height={40} rx={8} fill="#6E3A2A" stroke={INK} strokeWidth={6} />
      {[-640, -440, 440, 640].map((x, i) => <Bean key={i} x={x} y={560} s={0.82} sit flip={x > 0} look={TOWN(i + 1)} t={t + i} arms={dancing && i % 2 ? 'up' : 'offer'} face={{eyes: dancing ? 'closed' : 'open', mouth: 'open', look: [x > 0 ? -1 : 1, 0]}} />)}
      <King x={-180} y={560} s={0.9} sit look={HEROD} t={t} arms={dancing ? 'up' : 'offer'} face={{eyes: 'open', mouth: dancing ? 'open' : 'smile', look: [1, 0.3]}} />
      <Bean x={-30} y={565} s={0.84} sit look={HERODIAS} t={t} face={{eyes: 'half', mouth: 'flat', look: [1, 0.3]}} />
      {dancing ? <g transform={`translate(${120 + Math.sin(t * 3) * 100} 0)`}><Bean x={0} y={820} s={0.95} flip={Math.sin(t * 6) > 0} look={DANCER} t={t} walk={1.5} arms={Math.sin(t * 6) > 0 ? 'up' : 'offer'} face={{eyes: 'closed', mouth: 'smile'}} /></g> : null}
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- the oath */
const Oath: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.9, 2.1, t / p.dur)}} p={p}>
      {RDEFS}<Palace t={t} />
      <KingBust x={0} y={40} t={t} face={{eyes: 'open', mouth: Math.sin(t * 11) > 0 ? 'open' : 'smile', brow: 0.3, look: [1, 0]}} />
    </Cam>
  );
};

/* 13 ----------------------------------------------------------------- "What should I ask for?" */
const Ask: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 160, z: 1.6}} p={p}>
      {RDEFS}<Palace t={t} dark={0.25} />
      <Bean x={-220} y={640} s={0.9} look={DANCER} t={t} face={{eyes: 'open', mouth: 'open', look: [1, -0.3]}} />
      <Bean x={200} y={660} s={1.0} flip look={HERODIAS} t={t} face={{eyes: 'half', mouth: 'flat', brow: -0.6, look: [-1, 0.3]}} />
    </Cam>
  );
};

/* 14 ----------------------------------------------------------------- "The head of John the Baptist." — silence */
const Head: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -20, z: lerp(2.0, 2.25, t / p.dur)}} p={p}>
      {RDEFS}<Palace t={1} dark={0.55} />
      <Bust x={0} y={0} look={HERODIAS} t={t} face={{eyes: 'half', mouth: Math.sin(t * 9) > 0.2 && t < p.dur - 1 ? 'open' : 'flat', brow: -1, look: [1, 0]}} />
      <Fill fill="#2a0612" o={0.18} />
    </Cam>
  );
};

/* 15 ----------------------------------------------------------------- the king was sorry */
const Sorry: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = p.dur * 0.45;
  if (t < cut) {
    return (
      <Cam c={{x: 0, y: -20, z: lerp(1.9, 2.05, t / cut)}} p={p}>
        {RDEFS}<Palace t={1} dark={0.45} />
        <KingBust x={0} y={40} t={t} face={{eyes: 'half', mouth: 'frown', brow: -0.8, look: [0, 0.5]}} />
      </Cam>
    );
  }
  return (
    <Cam c={{x: 0, y: 330, z: 1.4}} p={p}>
      {RDEFS}<Palace t={1} dark={0.4} />
      {[-640, -420, 420, 640].map((x, i) => <Bean key={i} x={x} y={600} s={0.9} flip={x > 0} look={TOWN(i + 1)} t={1 + i} face={{eyes: 'open', mouth: 'flat', look: [x > 0 ? -1 : 1, 0]}} dim={0.3} />)}
      <King x={0} y={620} s={1.0} look={HEROD} t={t} arms="down" face={{eyes: 'half', mouth: 'frown', brow: -0.7, look: [0, 0.4]}} />
    </Cam>
  );
};

/* 16 ----------------------------------------------------------------- the voice in the wilderness goes silent */
const Silent: React.FC<SP> = (p) => {
  const {t} = p;
  const sl = p.w('silent', p.dur * 0.7) + 0.15;
  const candle = 1 - ko(t, sl, sl + 0.25);
  const c: C3 = {x: 120, y: 260, z: lerp(1.6, 1.8, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Cell t={t} candle={candle} />
      <Bean x={-80} y={600} s={1.0} sit look={JOHN} t={t} face={{eyes: 'closed', mouth: 'flat'}} dim={0.2 + 0.5 * (1 - candle)} />
      {Array.from({length: 7}).map((_, i) => <rect key={i} x={-560 + i * 170} y={-1200} width={26} height={2000} fill="#0e0c12" />)}
      {candle < 1 ? Array.from({length: 6}).map((_, i) => { const u = t - sl; return <circle key={i} cx={330 + Math.sin(u * 3 + i) * 20} cy={100 - u * 160 - i * 30} r={10 + i * 3} fill="#8A8A94" opacity={Math.max(0, 0.4 - u * 0.15 - i * 0.05)} />; }) : null}
      <Fill fill="#000" o={0.35 * (1 - candle)} />
    </Cam>
  );
};

/* 17 ----------------------------------------------------------------- laid in a tomb */
const Tomb: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-120, 160, t / p.dur), y: 300, z: 1.4};
  const go = lin(t, 0.2, p.dur);
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.55} />
      <path d="M 200 380 L 260 -320 L 1600 -360 L 1600 380 Z" fill="#6A5A54" stroke={INK} strokeWidth={8} />
      <path d="M 360 380 L 360 140 Q 450 60 540 140 L 540 380 Z" fill="#100c12" stroke={INK} strokeWidth={6} />
      <circle cx={700} cy={300} r={110} fill="#7A6A64" stroke={INK} strokeWidth={8} />
      <rect x={-3000} y={380} width={6000} height={3000} fill="#7A6A4A" />
      <g transform={`translate(${lerp(-500, 120, go)} 0)`}>
        {[-160, 160].map((x, i) => <Bean key={i} x={x} y={640} s={0.9} look={TOWN(i + 2)} t={t + i * 0.3} walk={1} arms="reach" face={{eyes: 'closed', mouth: 'frown', brow: -0.6}} />)}
        <rect x={-230} y={380} width={460} height={60} rx={26} fill="#E8DCC4" stroke={INK} strokeWidth={6} />
      </g>
    </Cam>
  );
};

/* 18 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 0, z: 1}} p={p}>
      {RDEFS}<Fill fill="#0e0c14" />
      <Glow x={0} y={420} r={500} o={0.25 + 0.05 * Math.sin(t * 2)} />
      <path d="M -3000 640 Q -300 560 0 580 Q 300 560 3000 640 L 3000 3000 L -3000 3000 Z" fill="#06050a" />
      <path d={`M 0 ${520} q -9 -18 0 -34 q 9 16 0 34`} fill="#FFD36A" opacity={ko(t, 1.0, 2.5)} />
      <rect x={-18} y={520} width={36} height={50} fill="#E8DCC4" stroke={INK} strokeWidth={4} />
    </Cam>
  );
};

export const SCENES9: Record<string, React.FC<SP>> = {home: Home, whisper: Whisper, offense: Offense, prophet: Prophet, unbelief: Unbelief, sent: Sent, healed: Healed, herod: Herod, ghost: Ghost, prison: Prison, feast: Feast, oath: Oath, ask: Ask, head: Head, sorry: Sorry, silent: Silent, tomb: Tomb, end: End};
