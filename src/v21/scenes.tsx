import React from 'react';
import {FRIENDS, INK, JESUS, Look} from '../v8/fig';
import {C3, Cam, Glow, SP, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {AP, Bust, Sky} from '../v12/scenes';
import {Street} from '../v15/scenes';

/** Episode 14 — "What Do You Want?" (Mark 10). Big moment: a camel stuck in the eye of a needle, then "possible with God". */
export const RICH: Look = {skin: '#E0AE88', hair: '#2A1C14', tunic: '#7A2A6A', sash: '#E8B83A', style: 'short', beard: false};
export const BART: Look = {skin: '#C98E64', hair: '#5A4030', tunic: '#8A7A60', sash: '#5A4A3A', style: 'long', beard: true};
const TOWN = (i: number): Look => ({...FRIENDS[i % 4], tunic: ['#A8794A', '#6A7A5A', '#8A5A5A', '#5A6A8A', '#9A8A5A', '#7A5A7A'][i % 6]});

const Road: React.FC<{dusk?: number}> = ({dusk = 0}) => (
  <g>
    <Sky dusk={dusk} />
    <g filter="url(#dof)"><path d="M -3000 280 Q -1500 40 -600 200 Q 0 100 700 210 Q 1600 60 3000 240 L 3000 3000 L -3000 3000 Z" fill="#9A8A7A" /></g>
    <rect x={-3000} y={330} width={6000} height={3000} fill="#C2A47A" />
    <path d="M -3000 900 Q 0 480 3000 900 L 3000 1100 Q 0 640 -3000 1100 Z" fill="#D8BC90" opacity={0.7} />
  </g>
);
const Bag: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M -45 -10 Q -60 -70 -20 -80 L 20 -80 Q 60 -70 45 -10 Q 0 20 -45 -10 Z" fill="#C8A040" stroke={INK} strokeWidth={6} />
    <path d="M -22 -80 Q 0 -100 22 -80" fill="none" stroke={INK} strokeWidth={6} />
    <text x={0} y={-30} fontFamily="Fredoka" fontWeight={700} fontSize={40} fill="#6A4A10" textAnchor="middle">$</text>
  </g>
);
const Coin: React.FC<{x: number; y: number; r?: number; o?: number}> = ({x, y, r = 26, o = 1}) => (
  <g opacity={o}><circle cx={x} cy={y} r={r} fill="#F2C24A" stroke="#8A5A10" strokeWidth={5} /><circle cx={x} cy={y} r={r * 0.6} fill="none" stroke="#C8962A" strokeWidth={3} /></g>
);
export const Camel: React.FC<{x: number; y: number; s?: number; t: number; squish?: number}> = ({x, y, s = 1, t, squish = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s * (1 - squish * 0.25)} ${s * (1 + squish * 0.15)})`}>
    {[-70, -30, 40, 80].map((lx, i) => <line key={i} x1={lx} y1={-60} x2={lx + Math.sin(t * 10 + i) * 6} y2={60} stroke={INK} strokeWidth={14} strokeLinecap="round" />)}
    <ellipse cx={0} cy={-90} rx={130} ry={70} fill="#D2A060" stroke={INK} strokeWidth={7} />
    <path d="M -70 -150 Q -40 -230 -5 -150 Q 30 -230 65 -150" fill="#D2A060" stroke={INK} strokeWidth={7} />
    <path d="M 110 -110 Q 160 -170 150 -250" fill="none" stroke={INK} strokeWidth={42} strokeLinecap="round" /><path d="M 110 -110 Q 160 -170 150 -250" fill="none" stroke="#D2A060" strokeWidth={30} strokeLinecap="round" />
    <ellipse cx={175} cy={-262} rx={52} ry={34} fill="#D2A060" stroke={INK} strokeWidth={7} />
    <circle cx={180} cy={-275} r={8} fill={INK} /><path d="M 210 -250 q 10 6 18 0" stroke={INK} strokeWidth={5} fill="none" />
    <path d="M 140 -290 l -10 -22 l 22 12 Z" fill="#B8864A" stroke={INK} strokeWidth={5} />
    <path d="M -130 -90 q -40 10 -50 50" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
  </g>
);
export const Needle: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -34 -600 Q -34 -660 0 -660 Q 34 -660 34 -600 L 14 560 L 0 640 L -14 560 Z" fill="#C8D0D8" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <ellipse cx={0} cy={-560} rx={12} ry={60} fill="#2a2030" stroke={INK} strokeWidth={4} />
    <path d="M -22 -600 L -18 500" stroke="#FFFFFF" strokeWidth={6} opacity={0.5} />
  </g>
);
const Throne: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -70 0 L -70 -260 Q 0 -320 70 -260 L 70 0 Z" fill="#E8B83A" stroke={INK} strokeWidth={7} />
    <rect x={-90} y={-120} width={180} height={40} rx={10} fill="#A02A3A" stroke={INK} strokeWidth={6} />
    <circle cx={0} cy={-240} r={16} fill="#E04A5A" stroke={INK} strokeWidth={4} />
  </g>
);
const Waves: React.FC<{x: number; y: number; t: number; a: number}> = ({x, y, t, a}) => (
  <g>{[0, 1, 2].map((i) => { const r = ((t * 200 + i * 80) % 240) + 40; return <path key={i} d={`M ${x + r * 0.7} ${y - r * 0.7} A ${r} ${r} 0 0 1 ${x + r * 0.7} ${y + r * 0.7}`} fill="none" stroke="#FFDD33" strokeWidth={8 * a} strokeLinecap="round" opacity={a * (1 - r / 300)} />; })}</g>
);

/* 1 ------------------------------------------------------------------ the rich young man runs and kneels */
const Run: React.FC<SP> = (p) => {
  const {t} = p;
  const kneel = ko(t, p.dur * 0.55, p.dur * 0.8);
  return (
    <Cam c={{x: lerp(-60, 60, t / p.dur), y: 220, z: 1.2}} p={p}>
      {RDEFS}<Road />
      {['simon', 'john'].map((n, i) => <Bean key={n} x={400 + i * 170} y={690} s={0.85} flip look={AP[n]} t={t + i} face={{eyes: 'open', mouth: 'flat', look: [-1, 0]}} />)}
      <Bean x={260} y={700} s={1.0} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [-1, 0.3]}} />
      <Bean x={lerp(-800, -40, ko(t, 0, p.dur * 0.6))} y={720} s={0.95} look={RICH} t={t} walk={kneel > 0.5 ? 0 : 2.2} sit={kneel > 0.5} arms={kneel > 0.5 ? 'up' : 'none'} hold={<Bag s={0.6} />} face={{eyes: 'open', mouth: 'open', brow: 0.3, look: [1, -0.4]}} />
    </Cam>
  );
};

/* 2 / 4 ------------------------------------------------------------- the rich young man speaks */
const RichBust: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>
      {RDEFS}<Road />
      <Bust x={0} y={0} look={RICH} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'smile', brow: 0.5, look: [1, -0.3]}} />
      {[-160, 150].map((x, i) => <Coin key={i} x={x} y={330 + Math.sin(t * 2 + i) * 6} r={22} />)}
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ the commandments */
const Laws: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>
      {RDEFS}<Road />
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'smile', brow: 0.3, look: [-1, 0.2]}} />
      <g transform={`translate(0 -400) rotate(-4) scale(${0.6 * ko(t, 0.3, 0.9)})`}>
        {[-70, 70].map((x) => <path key={x} d={`M ${x - 60} 90 L ${x - 60} -40 Q ${x} -110 ${x + 60} -40 L ${x + 60} 90 Z`} fill="#C8C0B0" stroke={INK} strokeWidth={6} />)}
        {[-70, 70].map((x) => [-20, 10, 40, 65].map((y) => <line key={`${x}${y}`} x1={x - 36} y1={y} x2={x + 36} y2={y} stroke="#7A7060" strokeWidth={5} />))}
      </g>
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ Jesus looked at him and loved him */
const Loved: React.FC<SP> = (p) => {
  const {t} = p;
  const lv = ko(t, p.w('loved', p.dur * 0.6) - 0.2, p.w('loved', p.dur * 0.6) + 0.7);
  return (
    <Cam c={{x: 0, y: 160, z: lerp(1.5, 1.7, t / p.dur)}} p={p}>
      {RDEFS}<Road dusk={0.1} />
      <Glow x={60} y={420} r={300 + lv * 400} o={0.3 + lv * 0.5} />
      <Bean x={-200} y={720} s={0.95} sit look={RICH} t={t} arms="up" face={{eyes: 'open', mouth: 'smile', look: [1, -0.5]}} />
      <Bean x={200} y={700} s={1.05} flip look={JESUS} t={t} arms={lv > 0.3 ? 'reach' : 'none'} face={{eyes: 'open', mouth: 'smile', brow: 0.6, look: [-1, 0.4]}} />
      <path transform={`translate(10 ${260 - lv * 60}) scale(${lv * 1.2})`} d="M 0 40 C -90 -20 -70 -90 -20 -80 C 0 -76 0 -60 0 -52 C 0 -60 0 -76 20 -80 C 70 -90 90 -20 0 40 Z" fill="#E8605A" stroke="#FFE2B0" strokeWidth={8} opacity={lv * 0.9} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ "sell everything… treasure in heaven… follow me" */
const Sell: React.FC<SP> = (p) => {
  const {t} = p;
  const tr = ko(t, p.w('treasure', p.dur * 0.55) - 0.2, p.w('treasure', p.dur * 0.55) + 0.7);
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>
      {RDEFS}<Road />
      <g transform={`translate(0 ${-400 - tr * 30}) scale(${0.65 * tr})`} opacity={tr}>
        <Glow x={0} y={0} r={200} o={0.8} />
        <rect x={-90} y={-30} width={180} height={100} rx={12} fill="#9A5A2A" stroke={INK} strokeWidth={7} />
        <path d="M -90 -30 Q 0 -110 90 -30 Z" fill="#B06A32" stroke={INK} strokeWidth={7} />
        {[-50, -10, 30, 60].map((x, i) => <Coin key={i} x={x} y={-40 - (i % 2) * 20} r={20} />)}
      </g>
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'smile', brow: 0.6, look: [-1, 0.2]}} />
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ he went away sad */
const Sad: React.FC<SP> = (p) => {
  const {t} = p;
  const go = ko(t, p.dur * 0.25, p.dur);
  return (
    <Cam c={{x: lerp(0, -200, go), y: 220, z: 1.2}} p={p}>
      {RDEFS}<Road dusk={0.35 * go} />
      <Bean x={300} y={700} s={1.0} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', brow: 0.6, look: [-1, 0]}} />
      <Bean x={lerp(-80, -760, go)} y={720} s={0.95} flip look={RICH} t={t} walk={go > 0 && go < 1 ? 0.9 : 0} arms="cross" hold={<Bag s={0.7} />} face={{eyes: 'half', mouth: 'frown', brow: -0.8, look: [-1, 0.4]}} />
    </Cam>
  );
};

/* 8 ------------------------------------------------------------------ the camel and the needle (BIG MOMENT, comic) */
const CamelSc: React.FC<SP> = (p) => {
  const {t} = p;
  const cm = p.w('camel', p.dur * 0.75), nd = p.w('needle', p.dur * 0.9);
  const show = t > cm - 0.4;
  const push = ko(t, nd - 0.2, nd + 1.2);
  const wob = t > nd ? Math.sin((t - nd) * 14) * Math.exp(-(t - nd) * 1.5) : 0;
  if (!show) return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / cm)}} p={p}>{RDEFS}<Road /><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'flat', brow: 0.3, look: [1, 0.2]}} /></Cam>;
  return (
    <Cam c={{x: 0, y: 260, z: 1.0}} p={p}>
      {RDEFS}<Road />
      <Needle x={260} y={330} s={1.05} />
      <Camel x={lerp(-900, -60, ko(t, cm - 0.4, cm + 0.9))} y={620} s={1.45} t={t} squish={push * 0.6 + wob * 0.2} />
      {t > nd + 0.3 ? <text x={-80} y={-140} fontFamily="Fredoka" fontWeight={700} fontSize={110} fill="#FFDD33" stroke={INK} strokeWidth={12} paintOrder="stroke" textAnchor="middle" transform={`rotate(${wob * 8} -80 -140)`}>?!</text> : null}
      <Bean x={-560} y={760} s={0.8} look={AP.john} t={t} face={{eyes: 'wide', mouth: 'open', look: [1, -0.3]}} />
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ "Then who can be saved?" */
const Saved: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: 200, z: 1.35}} p={p}>{RDEFS}<Road />{['simon', 'andrew', 'james', 'john'].map((n, i) => <Bean key={n} x={-420 + i * 280} y={720} s={0.95} flip={i > 1} look={AP[n]} t={t + i} arms="up" face={{eyes: 'wide', mouth: 'open', brow: -0.6, look: [i > 1 ? -1 : 1, -0.2]}} />)}</Cam>;
};

/* 10 ----------------------------------------------------------------- "possible with God" */
const Possible: React.FC<SP> = (p) => {
  const {t} = p;
  const ps = p.w('possible', p.dur * 0.8);
  const g = ko(t, ps - 0.1, ps + 0.8);
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.15, t / p.dur)}} p={p}>
      {RDEFS}<Road />
      {Array.from({length: 7}).map((_, i) => <polygon key={i} points={`${-60 + i * 20},-1700 ${60 + i * 20},-1700 ${(i - 3) * 360 + 170},1300 ${(i - 3) * 360 - 170},1300`} fill="#FFF6D0" opacity={0.12 * g} />)}
      <Glow x={0} y={-80} r={300 + g * 700} o={0.2 + g * 0.6} id="gWhite" />
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.5 ? 'open' : 'smile', brow: 0.6, look: [0, -0.2]}} />
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- James and John want the best seats */
const Seats: React.FC<SP> = (p) => {
  const {t} = p;
  const th = ko(t, p.w('right', p.dur * 0.6) - 0.3, p.w('right', p.dur * 0.6) + 0.4);
  return (
    <Cam c={{x: 0, y: 160, z: 1.25}} p={p}>
      {RDEFS}<Road />
      <g opacity={th}><Glow x={0} y={200} r={500} o={0.5} /><Throne x={-260} y={420} s={0.8} /><Throne x={260} y={420} s={0.8} /><Throne x={0} y={380} s={1.0} /></g>
      <Bean x={-300} y={720} s={0.95} look={AP.james} t={t} arms="point" face={{eyes: 'open', mouth: Math.sin(t * 11) > 0 ? 'open' : 'smile', brow: 0.6, look: [1, -0.5]}} />
      <Bean x={-120} y={730} s={0.9} look={AP.john} t={t + 1} arms="up" face={{eyes: 'open', mouth: 'smile', brow: 0.6, look: [1, -0.5]}} />
      <Bean x={300} y={720} s={1.0} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', brow: 0.3, look: [-1, 0]}} />
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- not to be served, but to serve */
const Serve: React.FC<SP> = (p) => {
  const {t} = p;
  const sv = ko(t, p.dur * 0.5, p.dur * 0.7);
  return (
    <Cam c={{x: 0, y: 220, z: 1.3}} p={p}>
      {RDEFS}<Road dusk={0.15} /><Glow x={0} y={420} r={500} o={0.4 + sv * 0.3} />
      {['simon', 'james', 'john'].map((n, i) => <Bean key={n} x={-380 + i * 190} y={720} s={0.9} look={AP[n]} t={t + i} face={{eyes: sv > 0.5 ? 'wide' : 'open', mouth: sv > 0.5 ? 'open' : 'flat', look: [1, 0.3]}} />)}
      <Bean x={300} y={720} s={1.05} flip look={JESUS} t={t} sit={sv > 0.5} arms="offer" hold={<g><path d="M -30 -60 L 30 -60 L 22 10 L -22 10 Z" fill="#B8B0A0" stroke={INK} strokeWidth={5} /><rect x={-26} y={-52} width={52} height={14} fill="#7EC8F0" /></g>} face={{eyes: 'open', mouth: Math.sin(t * 11) > 0 && t < p.dur - 0.4 ? 'open' : 'smile', look: [-1, 0.2]}} />
    </Cam>
  );
};

/* 13 ----------------------------------------------------------------- Jericho: blind Bartimaeus by the road */
const Jericho: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: lerp(-80, 60, t / p.dur), y: 220, z: 1.15}} p={p}>
      {RDEFS}<Street t={t} />
      {Array.from({length: 6}).map((_, i) => <Bean key={i} x={-200 + i * 190} y={700 + (i % 2) * 30} s={0.85} look={i === 5 ? JESUS : TOWN(i)} t={t + i} walk={1.1} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />)}
      <Bean x={-560} y={800} s={0.95} sit look={BART} t={t} arms={t > p.dur * 0.75 ? 'up' : 'offer'} face={{eyes: 'closed', mouth: t > p.dur * 0.75 ? 'open' : 'flat', brow: -0.2, look: [1, 0]}} />
      <path d="M -470 820 q 40 -30 80 0" fill="#8A6A3A" stroke={INK} strokeWidth={5} />
    </Cam>
  );
};

/* 14 ----------------------------------------------------------------- "Jesus, Son of David, have mercy on me!" */
const Mercy: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: Math.sin(t * 30) * 4, y: -20, z: lerp(2.0, 2.2, t / p.dur)}} p={p}>
      {RDEFS}<Street t={t} />
      <Bust x={0} y={0} look={BART} t={t} face={{eyes: 'closed', mouth: 'open', brow: -0.6, look: [0, -0.5]}} />
      <Waves x={90} y={-90} t={t} a={1} />
    </Cam>
  );
};

/* 15 ----------------------------------------------------------------- "be quiet!" — he shouts louder; "Call him." */
const Louder: React.FC<SP> = (p) => {
  const {t} = p;
  const lo = p.w('louder', p.dur * 0.45), cl = p.w('call', p.dur * 0.85);
  const stop = ko(t, cl - 1.0, cl - 0.4);
  return (
    <Cam c={{x: 0, y: 220, z: 1.2}} p={p}>
      {RDEFS}<Street t={t} />
      {[0, 170].map((x, i) => <Bean key={i} x={x} y={700} s={0.9} flip look={TOWN(i + 1)} t={t + i} arms="point" face={{eyes: 'open', mouth: 'open', brow: -0.8, look: [-1, 0.3]}} />)}
      <Bean x={-300} y={800} s={0.95} sit look={BART} t={t} arms="up" face={{eyes: 'closed', mouth: 'open', brow: -0.6, look: [1, -0.4]}} />
      <Waves x={-220} y={430} t={t} a={t > lo ? 1.6 : 0.8} />
      <Bean x={lerp(640, 370, 1 - stop)} y={700} s={1.0} flip look={JESUS} t={t} walk={1 - stop} arms={t > cl - 0.2 ? 'offer' : 'none'} face={{eyes: 'open', mouth: t > cl - 0.3 && t < cl + 0.6 ? 'open' : 'smile', look: [-1, 0]}} />
    </Cam>
  );
};

/* 16 ----------------------------------------------------------------- the cloak flies off; he jumps up */
const Cloak: React.FC<SP> = (p) => {
  const {t} = p;
  const ck = p.w('cloak', p.dur * 0.3);
  const fly = ko(t, ck - 0.1, ck + 1.0);
  const up = ko(t, ck + 0.3, ck + 0.9);
  return (
    <Cam c={{x: lerp(-320, -60, up), y: 220, z: 1.2}} p={p}>
      {RDEFS}<Street t={t} />
      <g transform={`translate(${-500 - fly * 400} ${560 - Math.sin(fly * Math.PI) * 400}) rotate(${fly * -300})`} opacity={1 - fly * 0.3}>
        <path d="M -90 -60 Q 0 -110 90 -60 L 110 80 Q 0 120 -110 80 Z" fill="#6A5A3A" stroke={INK} strokeWidth={7} />
      </g>
      <Bean x={lerp(-500, -100, ko(t, ck + 0.6, p.dur))} y={lerp(800, 720, up)} s={0.95} sit={up < 0.5} look={{...BART, tunic: '#C8B898'}} t={t} walk={up > 0.9 ? 1.6 : 0} arms="up" face={{eyes: 'closed', mouth: 'open', brow: 0.4, look: [1, 0]}} />
      <Bean x={350} y={700} s={1.0} flip look={JESUS} t={t} arms="offer" face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
    </Cam>
  );
};

/* 17 ----------------------------------------------------------------- "What do you want me to do for you?" */
const Want: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(2.0, 2.15, t / p.dur)}} p={p}>{RDEFS}<Street t={t} /><g filter="url(#dof)"><Glow x={-300} y={-300} r={600} o={0.6} /></g><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'smile', brow: 0.6, look: [-1, 0.2]}} /></Cam>;
};

/* 18 ----------------------------------------------------------------- "Teacher, I want to see." */
const See: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(2.0, 2.2, t / p.dur)}} p={p}>{RDEFS}<Street t={t} /><Bust x={0} y={0} look={{...BART, tunic: '#C8B898'}} t={t} face={{eyes: 'closed', mouth: Math.sin(t * 10) > 0 && t < p.dur - 0.4 ? 'open' : 'flat', brow: 0.3, look: [1, -0.3]}} /></Cam>;
};

/* 19 ----------------------------------------------------------------- "Your faith has healed you." (sight) */
const Faith: React.FC<SP> = (p) => {
  const {t} = p;
  const fa = p.w('faith', p.dur * 0.55);
  const g = ko(t, fa - 0.1, fa + 0.6);
  const flash = Math.max(0, 1 - Math.abs(t - fa) / 0.4);
  return (
    <Cam c={{x: 0, y: 200, z: lerp(1.5, 1.35, g)}} p={p}>
      {RDEFS}<Street t={t} /><rect x={-3000} y={-3000} width={6000} height={6000} fill="#3a2a30" opacity={0.35 * (1 - g)} />
      <Glow x={-150} y={420} r={200 + g * 700} o={g * 0.8} id="gWhite" />
      <Bean x={-150} y={720} s={1.0} look={{...BART, tunic: '#C8B898'}} t={t} arms={g > 0.5 ? 'up' : 'none'} face={{eyes: g > 0.4 ? 'wide' : 'closed', mouth: g > 0.4 ? 'open' : 'flat', brow: 0.5, look: [1, -0.2]}} />
      <Bean x={240} y={700} s={1.05} flip look={JESUS} t={t} arms="reach" face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
      <rect x={-3000} y={-3000} width={6000} height={6000} fill="#FFFBEA" opacity={flash * 0.6} />
    </Cam>
  );
};

/* 20 ----------------------------------------------------------------- he follows Jesus along the road */
const Follow: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: lerp(-100, 200, t / p.dur), y: 220, z: 1.1}} p={p}>
      {RDEFS}<Road />
      <Bean x={200 + t * 60} y={700} s={1.0} look={JESUS} t={t} walk={1.2} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
      <Bean x={-40 + t * 60} y={720} s={0.95} look={{...BART, tunic: '#C8B898'}} t={t} walk={1.6} arms={Math.sin(t * 3) > 0 ? 'up' : 'none'} face={{eyes: 'open', mouth: 'open', brow: 0.5, look: [1, -0.3]}} />
      {['simon', 'john', 'james'].map((n, i) => <Bean key={n} x={-280 - i * 170 + t * 60} y={700 + (i % 2) * 30} s={0.85} look={AP[n]} t={t + i} walk={1.2} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />)}
    </Cam>
  );
};

/* 21 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 0, z: 1}} p={p}>
      {RDEFS}<Sky dusk={0.5} />
      <circle cx={0} cy={420} r={240} fill="#FFE2B0" /><Glow x={0} y={420} r={800} o={0.6} />
      <path d="M -3000 640 Q -300 560 0 580 Q 300 560 3000 640 L 3000 3000 L -3000 3000 Z" fill="#2a1a20" />
      {[-1, 0, 1].map((i) => <Bean key={i} x={i * 140 + t * 10} y={640} s={0.5} look={i < 0 ? BART : i ? AP.john : JESUS} t={t + i} walk={1} dim={0.75} />)}
      {Array.from({length: 14}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 1600} cy={-600 + rnd(i + 9) * 700} r={2 + rnd(i) * 3} fill="#FFFBEA" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
    </Cam>
  );
};

export const SCENES14: Record<string, React.FC<SP>> = {run: Run, ask: RichBust, laws: Laws, kept: RichBust, loved: Loved, sell: Sell, sad: Sad, camel: CamelSc, saved: Saved, possible: Possible, seats: Seats, serve: Serve, jericho: Jericho, mercy: Mercy, louder: Louder, cloak: Cloak, want: Want, see: See, faith: Faith, follow: Follow, end: End};
