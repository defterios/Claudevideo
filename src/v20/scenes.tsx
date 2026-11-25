import React from 'react';
import {FRIENDS, INK, JESUS, Look} from '../v8/fig';
import {C3, Cam, Glow, SP, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {AP, Bust, Sky} from '../v12/scenes';
import {GIRL} from '../v15/scenes';

/** Episode 13 — "Listen to Him" (Mark 9). Big moment: the Transfiguration — Jesus turns dazzling white on "white". */
const PETER = AP.simon;
export const MOSES: Look = {skin: '#D6A27A', hair: '#E8E4DC', tunic: '#8A5A3A', sash: '#D9A93A', style: 'long', beard: true};
export const ELIJAH: Look = {skin: '#C98E64', hair: '#5A4030', tunic: '#6A5A3A', sash: '#3A2A1A', style: 'long', beard: true};
const FATHER: Look = {skin: '#C98E64', hair: '#2A1C14', tunic: '#5A6A8A', sash: '#2A3A5A', style: 'short', beard: true};
const BOY: Look = {...GIRL, hair: '#2A1C14', style: 'short', tunic: '#9A7A4A', sash: '#5A4A2A'};
const KID: Look = {...GIRL, tunic: '#D98A5A', sash: '#8A4A2A'};
const WHITE: Look = {...JESUS, tunic: '#FFFFFF', sash: '#FFE9A8'};
const TOWN = (i: number): Look => ({...FRIENDS[i % 4], tunic: ['#A8794A', '#6A7A5A', '#8A5A5A', '#5A6A8A', '#9A8A5A', '#7A5A7A'][i % 6]});

const Peak: React.FC<{dusk?: number; top?: boolean}> = ({dusk = 0, top = true}) => (
  <g>
    <Sky dusk={dusk} />
    <g filter="url(#dof)">
      <path d="M -3000 400 L -1500 -200 L -900 120 L -300 -500 L 300 60 L 900 -300 L 1600 180 L 3000 -100 L 3000 3000 L -3000 3000 Z" fill="#8A8098" opacity={0.7} />
      {top ? null : <path d="M -500 400 L 0 -700 L 500 400 Z" fill="#7A7088" />}
    </g>
    <rect x={-3000} y={330} width={6000} height={3000} fill={top ? '#A89A88' : '#B8A47A'} />
    <path d="M -3000 330 L 3000 330" stroke="#6A5A4A" strokeWidth={6} />
    {top ? [-700, -250, 380, 820].map((x, i) => <path key={i} d={`M ${x - 80} 360 Q ${x} 300 ${x + 90} 360 Z`} fill="#8A7A6A" stroke={INK} strokeWidth={5} />) : null}
  </g>
);
const Rays: React.FC<{o: number; n?: number; x?: number}> = ({o, n = 9, x = 0}) => (
  <g>{Array.from({length: n}).map((_, i) => <polygon key={i} points={`${x - 40 + i * 10},-1700 ${x + 40 + i * 10},-1700 ${x + (i - (n - 1) / 2) * 330 + 160},1300 ${x + (i - (n - 1) / 2) * 330 - 160},1300`} fill="#FFFBEA" opacity={0.12 * o} />)}</g>
);
const Cloud: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    {[[-260, 20, 170], [-90, -40, 210], [110, -20, 200], [280, 30, 160], [0, 60, 220]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#F2F0F6" />)}
  </g>
);
const Tent: React.FC<{x: number; y: number; s?: number; a?: number}> = ({x, y, s = 1, a = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s * a})`} opacity={a}>
    <path d="M -110 0 L 0 -170 L 110 0 Z" fill="#D9C49A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 0 -170 L -24 0 L 24 0 Z" fill="#8A6A3A" stroke={INK} strokeWidth={4} />
  </g>
);

/* 1 ------------------------------------------------------------------ up the mountain */
const Climb: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-180, 0, t / p.dur), y: lerp(260, 180, t / p.dur), z: 1.1};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Peak top={false} />
      <path d="M -3000 1000 L -400 700 L 200 560 L 3000 330 L 3000 3000 L -3000 3000 Z" fill="#A08A6A" />
      {[['simon', -260], ['james', -100], ['john', 60]].map(([n, x], i) => <Bean key={n} x={(x as number) - 200 + t * 18} y={760 - ((x as number) - 200 + t * 18) * 0.25} s={0.85} look={AP[n as string]} t={t + i} walk={1.3} face={{eyes: 'open', mouth: 'flat', look: [1, -0.3]}} />)}
      <Bean x={60 + t * 18} y={700 - (60 + t * 18) * 0.25} s={0.95} look={JESUS} t={t} walk={1.3} face={{eyes: 'open', mouth: 'smile', look: [1, -0.4]}} />
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ TRANSFIGURED (BIG MOMENT) */
const Shine: React.FC<SP> = (p) => {
  const {t} = p;
  const wt = p.w('white', p.dur * 0.6);
  const g = ko(t, wt - 0.4, wt + 0.6);
  const flash = Math.max(0, 1 - Math.abs(t - wt) / 0.45);
  return (
    <Cam c={{x: 0, y: lerp(240, 180, g), z: lerp(1.2, 1.35, k(t, 0, p.dur))}} p={p}>
      {RDEFS}<Peak dusk={0.35 * (1 - g)} />
      <Rays o={g} x={0} />
      <Glow x={0} y={380} r={250 + g * 900} o={0.2 + g * 0.8} id="gWhite" />
      <Bean x={0} y={720} s={1.15} look={g > 0.5 ? WHITE : JESUS} t={t} arms={g > 0.3 ? 'up' : 'none'} face={{eyes: g > 0.3 ? 'closed' : 'open', mouth: 'smile', brow: 0.3, look: [0, -0.4]}} />
      {[-560, -380, 400].map((x, i) => <Bean key={i} x={x} y={760} s={0.85} flip={x > 0} look={AP[['simon', 'james', 'john'][i]]} t={t + i} sit={g > 0.5} arms={g > 0.5 ? 'up' : 'none'} face={{eyes: g > 0.5 ? 'wide' : 'open', mouth: g > 0.5 ? 'open' : 'flat', brow: -0.5, look: [x > 0 ? -1 : 1, -0.3]}} />)}
      <rect x={-3000} y={-3000} width={6000} height={6000} fill="#FFFFFF" opacity={flash * 0.75} />
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ Elijah and Moses appear */
const Prophets: React.FC<SP> = (p) => {
  const {t} = p;
  const e = ko(t, p.w('elijah', p.dur * 0.25) - 0.2, p.w('elijah', p.dur * 0.25) + 0.7);
  const m = ko(t, p.w('moses', p.dur * 0.45) - 0.2, p.w('moses', p.dur * 0.45) + 0.7);
  return (
    <Cam c={{x: 0, y: 220, z: 1.2}} p={p}>
      {RDEFS}<Peak dusk={0.1} /><Rays o={0.7} />
      <Glow x={0} y={380} r={900} o={0.7} id="gWhite" />
      <g opacity={e}><Glow x={-330} y={460} r={300} o={0.7} id="gWhite" /><Bean x={-330} y={720} s={1.0} look={ELIJAH} t={t} face={{eyes: 'open', mouth: Math.sin(t * 9) > 0.3 ? 'open' : 'smile', look: [1, 0]}} /></g>
      <g opacity={m}><Glow x={330} y={460} r={300} o={0.7} id="gWhite" /><Bean x={330} y={720} s={1.0} flip look={MOSES} t={t + 1} arms="offer" hold={<g><rect x={-30} y={-60} width={60} height={80} rx={20} fill="#C8C0B0" stroke={INK} strokeWidth={5} /></g>} face={{eyes: 'open', mouth: Math.sin(t * 9 + 1) > 0.3 ? 'open' : 'smile', look: [-1, 0]}} /></g>
      <Bean x={0} y={720} s={1.1} look={WHITE} t={t} face={{eyes: 'open', mouth: Math.sin(t * 8) > 0.2 ? 'open' : 'smile', look: [Math.sin(t) > 0 ? 1 : -1, 0]}} />
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ Peter: three shelters */
const Tents: React.FC<SP> = (p) => {
  const {t} = p;
  const st = p.dur * 0.45;
  return (
    <Cam c={{x: 0, y: 120, z: 1.55}} p={p}>
      {RDEFS}<Peak dusk={0.1} /><Glow x={300} y={200} r={700} o={0.6} id="gWhite" />
      {[0, 1, 2].map((i) => <Tent key={i} x={-260 + i * 260} y={330} s={0.9} a={ko(t, st + i * 0.7, st + i * 0.7 + 0.4)} />)}
      <Bean x={0} y={720} s={1.05} look={PETER} t={t} arms={Math.sin(t * 3) > 0 ? 'up' : 'offer'} shake={0.4} face={{eyes: 'wide', mouth: Math.sin(t * 13) > 0 ? 'open' : 'smile', brow: 0.6}} />
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ afraid; the cloud rolls in */
const CloudSc: React.FC<SP> = (p) => {
  const {t} = p;
  const c = ko(t, p.w('cloud', p.dur * 0.55) - 0.5, p.w('cloud', p.dur * 0.55) + 1.4);
  return (
    <Cam c={{x: 0, y: 220, z: 1.2}} p={p}>
      {RDEFS}<Peak dusk={0.1 + 0.4 * c} />
      <Glow x={0} y={380} r={700} o={0.6 * (1 - c * 0.5)} id="gWhite" />
      {[-460, -300, 320].map((x, i) => <Bean key={i} x={x} y={760} s={0.85} flip={x > 0} sit look={AP[['simon', 'james', 'john'][i]]} t={t + i} shake={0.6} arms="up" face={{eyes: 'wide', mouth: 'open', brow: -0.8, look: [x > 0 ? -1 : 1, -0.3]}} />)}
      <Bean x={0} y={720} s={1.05} look={WHITE} t={t} face={{eyes: 'open', mouth: 'smile', look: [0, -0.5]}} />
      <Cloud x={lerp(-1400, -520, c)} y={lerp(-200, 300, c)} s={1.6} o={c * 0.8} />
      <Cloud x={lerp(1400, 560, c)} y={lerp(-100, 360, c)} s={1.6} o={c * 0.8} />
      <rect x={-3000} y={-3000} width={6000} height={6000} fill="#EDEBF2" opacity={c * 0.35} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ the Voice: "This is my Son… Listen to him!" */
const Voice: React.FC<SP> = (p) => {
  const {t} = p;
  const l = ko(t, p.w('listen', p.dur * 0.65) - 0.1, p.w('listen', p.dur * 0.65) + 0.6);
  return (
    <Cam c={{x: 0, y: -100, z: lerp(1.0, 1.12, t / p.dur)}} p={p}>
      {RDEFS}<rect x={-3000} y={-3000} width={6000} height={6000} fill="#DCD8E6" />
      <Glow x={0} y={-250} r={700 + l * 400} o={0.8} id="gWhite" /><Rays o={0.8 + 0.4 * l} x={0} />
      {[[-500, -400, 2.0], [450, -350, 2.2], [-200, 300, 2.4], [400, 400, 2.0], [-650, 250, 1.6]].map(([x, y, s], i) => <Cloud key={i} x={x + Math.sin(t * 0.4 + i) * 40} y={y} s={s} o={0.9} />)}
      <g opacity={0.9}><Bean x={0} y={560} s={0.9} look={WHITE} t={t} face={{eyes: 'open', mouth: 'smile', look: [0, -0.4]}} /></g>
      {[0, 1, 2].map((i) => { const r = ((t * 260 + i * 260) % 780); return <circle key={i} cx={0} cy={-250} r={r} fill="none" stroke="#FFFBEA" strokeWidth={10} opacity={Math.max(0, 0.6 - r / 1300)} />; })}
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ only Jesus */
const Alone: React.FC<SP> = (p) => {
  const {t} = p;
  const clr = ko(t, 0, 1.6);
  return (
    <Cam c={{x: 0, y: 220, z: 1.25}} p={p}>
      {RDEFS}<Peak dusk={0.15} />
      {[-460, -300, 320].map((x, i) => <Bean key={i} x={x} y={760} s={0.85} flip={x > 0} look={AP[['simon', 'james', 'john'][i]]} t={t + i} face={{eyes: 'open', mouth: 'open', brow: -0.2, look: [x > 0 ? 1 : -1, 0]}} />)}
      <Bean x={0} y={720} s={1.05} look={JESUS} t={t} arms="offer" face={{eyes: 'open', mouth: 'smile', look: [-1, 0.2]}} />
      <Cloud x={lerp(-300, -1600, clr)} y={380} s={1.8} o={1 - clr} /><Cloud x={lerp(300, 1600, clr)} y={440} s={1.9} o={1 - clr} />
    </Cam>
  );
};

/* 8 ------------------------------------------------------------------ the foot of the mountain: a father cries out */
const Foot: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: lerp(-60, 60, t / p.dur), y: 220, z: 1.1}} p={p}>
      {RDEFS}<Peak top={false} dusk={0.1} />
      {Array.from({length: 7}).map((_, i) => <Bean key={i} x={-760 + i * 230} y={700 + (i % 2) * 40} s={0.85} flip={i > 3} look={TOWN(i)} t={t + i} face={{eyes: 'open', mouth: 'flat', look: [i > 3 ? -1 : 1, 0]}} dim={0.15} />)}
      <Bean x={-80} y={780} s={1.05} look={FATHER} t={t} arms="up" shake={0.4} face={{eyes: 'open', mouth: 'open', brow: -0.9, look: [1, -0.4]}} />
      <Bean x={340} y={760} s={1.0} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', look: [-1, 0]}} />
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ "my son has a spirit…" */
const Father: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.15, t / p.dur)}} p={p}>
      {RDEFS}<Peak top={false} dusk={0.15} />
      <Bust x={0} y={0} look={FATHER} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'frown', brow: -0.9, look: [1, -0.3]}} />
      {[0, 1].map((i) => { const ph = (t * 0.5 + i * 0.5) % 1; return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${i ? 32 : -32} ${14 + ph * 60}) scale(1.4)`} fill="#BFE9F2" stroke={INK} strokeWidth={2.5} opacity={1 - ph} />; })}
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- "If you can? Everything is possible…" */
const IfYouCan: React.FC<SP> = (p) => {
  const {t} = p;
  const b = ko(t, p.w('believes', p.dur * 0.8) - 0.2, p.w('believes', p.dur * 0.8) + 0.5);
  return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>{RDEFS}<Peak top={false} dusk={0.15} /><Glow x={-200} y={-300} r={500 + b * 300} o={0.3 + b * 0.4} /><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'smile', brow: 0.5, look: [-1, 0.2]}} /></Cam>;
};

/* 11 ----------------------------------------------------------------- "I believe! Help my unbelief!" */
const Help: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -10, z: lerp(2.0, 2.3, t / p.dur)}} p={p}>
      {RDEFS}<Peak top={false} dusk={0.2} />
      <Bust x={0} y={0} look={FATHER} t={t} face={{eyes: Math.sin(t * 2) > 0.6 ? 'closed' : 'open', mouth: 'open', brow: -1, look: [0, -0.5]}} />
      {[0, 1, 2].map((i) => { const ph = (t * 0.7 + i * 0.33) % 1; return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${i % 2 ? 32 : -32} ${14 + ph * 70}) scale(1.5)`} fill="#BFE9F2" stroke={INK} strokeWidth={2.5} opacity={1 - ph} />; })}
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- the boy lies still; Jesus lifts him up */
const Healed: React.FC<SP> = (p) => {
  const {t} = p;
  const hd = p.w('hand', p.dur * 0.65), lf = p.w('lifted', p.dur * 0.85);
  const up = ko(t, lf - 0.3, lf + 0.9);
  const shake = t < p.dur * 0.3 ? 1.2 : 0;
  return (
    <Cam c={{x: 0, y: 260, z: 1.3}} p={p}>
      {RDEFS}<Peak top={false} dusk={0.2 * (1 - up)} />
      <Glow x={-60} y={520} r={200 + up * 600} o={up * 0.7} id="gWhite" />
      <Bean x={-420} y={740} s={0.95} look={FATHER} t={t} arms="up" face={{eyes: up > 0.5 ? 'open' : 'wide', mouth: up > 0.5 ? 'smile' : 'open', brow: -0.5, look: [1, 0]}} />
      {up < 0.5
        ? <g transform={`translate(-60 ${760}) rotate(-90)`}><Bean x={0} y={0} s={0.75} look={BOY} t={t} shake={shake} face={{eyes: 'closed', mouth: 'flat'}} /></g>
        : <Bean x={-40} y={760} s={0.75} look={BOY} t={t} arms="up" face={{eyes: 'open', mouth: 'smile', look: [1, -0.3]}} />}
      <Bean x={200} y={740} s={1.05} flip look={JESUS} t={t} arms={t > hd - 0.3 ? 'reach' : 'none'} face={{eyes: 'open', mouth: 'smile', look: [-1, 0.5]}} />
    </Cam>
  );
};

/* 13 ----------------------------------------------------------------- the disciples argue */
const Argue: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: lerp(-60, 60, t / p.dur), y: 220, z: 1.2}} p={p}>
      {RDEFS}<Peak top={false} dusk={0.25} />
      {['simon', 'andrew', 'james', 'john'].map((n, i) => <g key={n}><Bean x={-480 + i * 220} y={720 + (i % 2) * 30} s={0.9} flip={i % 2 === 1} look={AP[n]} t={t + i} arms={(Math.floor(t * 3) + i) % 2 ? 'point' : 'up'} face={{eyes: 'open', mouth: Math.sin(t * 14 + i) > 0 ? 'open' : 'frown', brow: -0.9, look: [i % 2 ? -1 : 1, 0]}} />
        <path d={`M ${-500 + i * 220} ${380} q 15 -30 30 0 t 30 0 t 30 0`} fill="none" stroke="#E0473C" strokeWidth={6} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t * 8 + i)} /></g>)}
      <Bean x={520} y={720} s={1.0} flip look={JESUS} t={t} face={{eyes: 'half', mouth: 'flat', look: [-1, 0]}} />
    </Cam>
  );
};

/* 14 ----------------------------------------------------------------- "first … last … servant of all" */
const First: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>{RDEFS}<Peak top={false} dusk={0.25} /><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'smile', brow: 0.4, look: [1, 0.2]}} /></Cam>;
};

/* 15 ----------------------------------------------------------------- he takes a little child in his arms */
const Child: React.FC<SP> = (p) => {
  const {t} = p;
  const up = ko(t, p.dur * 0.55, p.dur * 0.85);
  return (
    <Cam c={{x: 0, y: 240, z: 1.35}} p={p}>
      {RDEFS}<Peak top={false} dusk={0.2} /><Glow x={60} y={420} r={500 + up * 300} o={0.4 + up * 0.3} />
      {[-560, -400, 520].map((x, i) => <Bean key={i} x={x} y={740} s={0.85} flip={x > 0} look={AP[['simon', 'james', 'john'][i]]} t={t + i} face={{eyes: 'open', mouth: 'open', look: [x > 0 ? -1 : 1, 0]}} />)}
      <Bean x={60} y={740} s={1.05} look={JESUS} t={t} arms={up > 0.3 ? 'offer' : 'reach'} face={{eyes: 'open', mouth: 'smile', look: [1, 0.5]}} />
      <Bean x={lerp(260, 120, up)} y={lerp(760, 560, up)} s={0.55} flip look={KID} t={t} arms={up > 0.5 ? 'up' : 'none'} face={{eyes: up > 0.5 ? 'closed' : 'open', mouth: 'smile', look: [-1, -0.4]}} />
    </Cam>
  );
};

/* 16 ----------------------------------------------------------------- "whoever welcomes one of these…" */
const Welcome: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 40, z: lerp(1.75, 1.9, t / p.dur)}} p={p}>
      {RDEFS}<Peak top={false} dusk={0.2} /><g filter="url(#dof)"><Glow x={-300} y={-300} r={600} o={0.6} /></g>
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'smile', brow: 0.4, look: [0.5, 0.3]}} />
      <Bean x={190} y={700} s={0.8} flip look={KID} t={t} face={{eyes: 'closed', mouth: 'smile', look: [-1, -0.3]}} />
    </Cam>
  );
};

/* 17 ----------------------------------------------------------------- a cup of water */
const Water: React.FC<SP> = (p) => {
  const {t} = p;
  const w = ko(t, p.w('water', p.dur * 0.35) - 0.3, p.w('water', p.dur * 0.35) + 0.6);
  return (
    <Cam c={{x: 0, y: 260, z: 1.45}} p={p}>
      {RDEFS}<Peak top={false} dusk={0.25} />
      <Bean x={-230} y={740} s={0.95} look={KID} t={t} arms="offer" hold={<g><path d="M -30 -60 L 30 -60 L 22 10 L -22 10 Z" fill="#B8B0A0" stroke={INK} strokeWidth={5} /><rect x={-26} y={-52} width={52} height={14} fill="#7EC8F0" /></g>} face={{eyes: 'open', mouth: 'smile', look: [1, -0.4]}} />
      <Bean x={230} y={740} s={1.0} flip look={TOWN(3)} t={t + 2} face={{eyes: w > 0.5 ? 'closed' : 'open', mouth: 'smile', look: [-1, 0.3]}} />
      <Glow x={-130} y={560} r={160 + w * 300} o={w * 0.8} />
      {w > 0 ? Array.from({length: 8}).map((_, i) => { const a = (i / 8) * Math.PI * 2 + t; return <circle key={i} cx={-130 + Math.cos(a) * 120 * w} cy={560 + Math.sin(a) * 120 * w} r={6} fill="#FFF6D0" opacity={w} />; }) : null}
    </Cam>
  );
};

/* 18 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 0, z: 1}} p={p}>
      {RDEFS}<Sky dusk={0.5} />
      <path d="M -900 640 L 0 160 L 900 640 Z" fill="#3a2a34" />
      <circle cx={0} cy={240} r={160} fill="#FFFBEA" /><Glow x={0} y={260} r={700} o={0.7} id="gWhite" />
      <path d="M -3000 640 Q -300 560 0 580 Q 300 560 3000 640 L 3000 3000 L -3000 3000 Z" fill="#2a1a20" />
      {Array.from({length: 18}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 1600} cy={-600 + rnd(i + 9) * 700} r={2 + rnd(i) * 3} fill="#FFFBEA" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
    </Cam>
  );
};

export const SCENES13: Record<string, React.FC<SP>> = {climb: Climb, shine: Shine, prophets: Prophets, tents: Tents, cloud: CloudSc, voice: Voice, alone: Alone, foot: Foot, father: Father, ifyoucan: IfYouCan, help: Help, healed: Healed, argue: Argue, first: First, child: Child, welcome: Welcome, water: Water, end: End};
