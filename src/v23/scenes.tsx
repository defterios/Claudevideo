import React from 'react';
import {FRIENDS, INK, JESUS, Look} from '../v8/fig';
import {C3, Cam, Glow, SP, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Bean, OilLamp, RDEFS} from '../v11/room';
import {Hall, PH} from '../v11/scenes_room';
import {AP, Bust, Sky} from '../v12/scenes';

/** Episode 16 — "Everything She Had" (Mark 12–13). Big moment: the widow's two tiny coins outshine the rich men's bags. */
export const WIDOW: Look = {skin: '#C98E64', hair: '#5A5048', tunic: '#5A5A6A', sash: '#3A3A4A', style: 'hood', wrap: '#4A4A5A', beard: false};
export const RICHM = (i: number): Look => ({...FRIENDS[i % 4], tunic: ['#7A2A6A', '#2A4A8A', '#8A2A2A'][i % 3], sash: '#E8B83A'});
const TOWN = (i: number): Look => ({...FRIENDS[i % 4], tunic: ['#A8794A', '#6A7A5A', '#8A5A5A', '#5A6A8A', '#9A8A5A', '#7A5A7A'][i % 6]});

export const Coin: React.FC<{x: number; y: number; r?: number; face?: boolean; copper?: boolean}> = ({x, y, r = 26, face, copper}) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={copper ? '#C8783A' : '#F2C24A'} stroke={copper ? '#6A3A10' : '#8A5A10'} strokeWidth={Math.max(3, r * 0.08)} />
    <circle cx={x} cy={y} r={r * 0.8} fill="none" stroke={copper ? '#9A5A2A' : '#C8962A'} strokeWidth={Math.max(2, r * 0.05)} />
    {face ? <g transform={`translate(${x} ${y}) scale(${r / 100})`}><path d="M -20 -60 Q 30 -70 40 -20 Q 44 0 34 10 L 46 22 L 30 26 Q 30 50 0 56 L -10 70 L -40 70 Q -46 20 -40 -20 Q -36 -50 -20 -60 Z" fill="#C8962A" stroke="#8A5A10" strokeWidth={5} /><path d="M -40 -40 q 20 -40 70 -24" fill="none" stroke="#6A8A2A" strokeWidth={10} strokeDasharray="10 8" /></g> : null}
  </g>
);
export const Bag: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M -45 -10 Q -60 -70 -20 -80 L 20 -80 Q 60 -70 45 -10 Q 0 20 -45 -10 Z" fill="#C8A040" stroke={INK} strokeWidth={6} />
    <path d="M -22 -80 Q 0 -100 22 -80" fill="none" stroke={INK} strokeWidth={6} />
  </g>
);
const Box: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 -40 L -70 -160 L 70 -160 L 110 -40 Z" fill="#B08A3A" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <rect x={-110} y={-40} width={220} height={140} rx={10} fill="#8a5a33" stroke={INK} strokeWidth={7} />
    <rect x={-40} y={-168} width={80} height={14} rx={6} fill="#2a1a10" />
  </g>
);
const Stones: React.FC<{fall?: number; t: number}> = ({fall = 0, t}) => (
  <g>
    {Array.from({length: 4}).map((_, row) => Array.from({length: 4}).map((__, c) => {
      const i = row * 4 + c; const f = Math.max(0, fall - rnd(i) * 0.4) / 0.6;
      const x = -540 + c * 270 + (row % 2) * 135, y = 520 - row * 180;
      return <rect key={i} x={x + f * (rnd(i + 3) - 0.5) * 400} y={y + Math.min(1, f) * (600 + row * 180) * f} width={260} height={170} rx={8} fill={['#D8C8A8', '#CDBB98', '#E0D2B4'][i % 3]} stroke={INK} strokeWidth={7} transform={`rotate(${f * (rnd(i) - 0.5) * 80} ${x + 130} ${y + 85})`} />;
    }))}
  </g>
);

/* 1 ------------------------------------------------------------------ the trap */
const Trap: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: lerp(-30, 30, t / p.dur), y: 220, z: 1.2}} p={p}>
      {RDEFS}<Hall t={t} />
      {[-330, -170].map((x, i) => <Bean key={i} x={x} y={720} s={0.95} look={PH(i)} t={t + i} arms={i ? 'cross' : 'point'} face={{eyes: 'half', mouth: Math.sin(t * 9 + i) > 0.5 ? 'open' : 'smile', brow: -0.9, look: [1, 0]}} />)}
      <Bean x={260} y={720} s={1.05} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', look: [-1, 0]}} />
    </Cam>
  );
};
/* 2 / 4 -------------------------------------------------------------- the Pharisee speaks */
const PhBust: React.FC<SP> = (p) => {
  const {t} = p;
  return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>{RDEFS}<Hall t={t} /><Bust x={0} y={0} look={PH(0)} t={t} face={{eyes: 'half', mouth: Math.sin(t * 13) > 0 && t < p.dur - 0.2 ? 'open' : 'smile', brow: -0.8, look: [1, 0]}} /></Cam>;
};
/* 3 ------------------------------------------------------------------ "Bring me a coin. Whose face?" */
const CoinSc: React.FC<SP> = (p) => {
  const {t} = p;
  const c = ko(t, p.w('coin', p.dur * 0.2) - 0.1, p.w('coin', p.dur * 0.2) + 0.6);
  return (
    <Cam c={{x: 0, y: 0, z: 1.6}} p={p}>
      {RDEFS}<Hall t={t} /><Glow x={0} y={-100} r={400} o={0.5 * c} />
      <g transform={`translate(0 ${lerp(200, -120, c)}) scale(${0.4 + 0.6 * c}) rotate(${(1 - c) * 120})`}><Coin x={0} y={0} r={220} face /></g>
      <Bean x={-260} y={600} s={0.8} look={JESUS} t={t} arms="offer" face={{eyes: 'open', mouth: Math.sin(t * 11) > 0 ? 'open' : 'smile', look: [1, -0.4]}} />
    </Cam>
  );
};
/* 5 ------------------------------------------------------------------ give to Caesar / to God */
const Give: React.FC<SP> = (p) => {
  const {t} = p;
  const g = ko(t, p.w('god', p.dur * 0.8) - 0.2, p.w('god', p.dur * 0.8) + 0.6);
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>
      {RDEFS}<Hall t={t} />
      <g transform="translate(-175 -385)"><Coin x={0} y={0} r={52} face /></g>
      <g transform="translate(175 -385) scale(0.55)" opacity={g}><Glow x={0} y={0} r={220} o={0.8} id="gWhite" /><path d="M 0 -60 C -60 -100 -100 -20 0 60 C 100 -20 60 -100 0 -60 Z" fill="#E8605A" stroke="#FFE2B0" strokeWidth={8} /></g>
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'smile', brow: 0.4, look: [1, 0.2]}} />
    </Cam>
  );
};
/* 6 ------------------------------------------------------------------ which commandment is greatest? */
const Which: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 220, z: 1.3}} p={p}>
      {RDEFS}<Hall t={t} />
      <Bean x={-260} y={720} s={1.0} look={PH(2)} t={t} arms="offer" hold={<g><rect x={-40} y={-60} width={80} height={70} rx={8} fill="#F2E2B8" stroke={INK} strokeWidth={5} /></g>} face={{eyes: 'open', mouth: Math.sin(t * 11) > 0 ? 'open' : 'smile', brow: 0.3, look: [1, -0.2]}} />
      <Bean x={260} y={720} s={1.05} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
      <text x={0} y={260} fontFamily="Fredoka" fontWeight={700} fontSize={130} fill="#FFDD33" stroke={INK} strokeWidth={12} paintOrder="stroke" textAnchor="middle" opacity={ko(t, p.dur * 0.6, p.dur * 0.8)}>1?</text>
    </Cam>
  );
};
/* 7 ------------------------------------------------------------------ heart, soul, mind, strength */
const Love: React.FC<SP> = (p) => {
  const {t} = p;
  const ws = ['heart', 'soul', 'mind', 'strength'].map((w, i) => ko(t, p.w(w, p.dur * (0.25 + 0.18 * i)) - 0.1, p.w(w, p.dur * (0.25 + 0.18 * i)) + 0.4));
  const ic = [
    <path key="h" d="M 0 30 C -70 -15 -55 -70 -15 -62 C 0 -60 0 -48 0 -42 C 0 -48 0 -60 15 -62 C 55 -70 70 -15 0 30 Z" fill="#E8605A" stroke={INK} strokeWidth={6} />,
    <g key="s"><circle cx={0} cy={0} r={46} fill="#FFFBEA" stroke={INK} strokeWidth={6} /><circle cx={0} cy={0} r={16} fill="#F4C542" /></g>,
    <g key="m"><path d="M -40 30 Q -60 -40 0 -50 Q 60 -40 40 30 Z" fill="#E8B0C8" stroke={INK} strokeWidth={6} /><path d="M 0 -45 L 0 25 M -25 -20 q 12 10 0 24 M 25 -20 q -12 10 0 24" fill="none" stroke={INK} strokeWidth={4} /></g>,
    <g key="f"><path d="M -40 20 Q -50 -30 -20 -40 Q 0 -60 20 -40 Q 50 -30 40 20 Z" fill="#E0A878" stroke={INK} strokeWidth={6} /><path d="M -20 -10 q 20 -16 40 0" fill="none" stroke={INK} strokeWidth={4} /></g>,
  ];
  return (
    <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.05, t / p.dur)}} p={p}>
      {RDEFS}<Hall t={t} /><Glow x={0} y={-80} r={400} o={0.4} />
      {ic.map((node, i) => <g key={i} transform={`translate(${-195 + i * 130} ${-390}) scale(${0.7 * ws[i]})`} opacity={ws[i]}>{node}</g>)}
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 && t < p.dur - 0.4 ? 'open' : 'smile', brow: 0.5, look: [0, 0.2]}} />
    </Cam>
  );
};
/* 8 ------------------------------------------------------------------ love your neighbour */
const Second: React.FC<SP> = (p) => {
  const {t} = p;
  const n = ko(t, p.w('neighbour', p.dur * 0.35) - 0.2, p.w('neighbour', p.dur * 0.35) + 0.8);
  return (
    <Cam c={{x: 0, y: 220, z: 1.3}} p={p}>
      {RDEFS}<Sky dusk={0.1} /><rect x={-3000} y={330} width={6000} height={3000} fill="#C2A47A" />
      <Glow x={0} y={420} r={200 + n * 500} o={0.3 + n * 0.5} />
      <Bean x={lerp(-420, -140, n)} y={720} s={1.0} look={TOWN(1)} t={t} arms={n > 0.5 ? 'offer' : 'none'} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />
      <Bean x={lerp(420, 140, n)} y={720} s={0.95} flip look={TOWN(4)} t={t + 1} arms={n > 0.5 ? 'offer' : 'none'} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
      {n > 0.6 ? <path transform={`translate(0 ${330 - n * 40}) scale(${n})`} d="M 0 40 C -90 -20 -70 -90 -20 -80 C 0 -76 0 -60 0 -52 C 0 -60 0 -76 20 -80 C 70 -90 90 -20 0 40 Z" fill="#E8605A" stroke="#FFE2B0" strokeWidth={8} /> : null}
    </Cam>
  );
};
/* 9 ------------------------------------------------------------------ the rich pour in large amounts */
const Treasury: React.FC<SP> = (p) => {
  const {t} = p;
  const r = p.w('rich', p.dur * 0.65);
  return (
    <Cam c={{x: 0, y: 260, z: 1.3}} p={p}>
      {RDEFS}<Hall t={t} />
      <Box x={-20} y={760} s={1.0} />
      <Bean x={-290} y={740} s={0.8} sit look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', look: [1, 0]}} />
      {[0, 1].map((i) => <Bean key={i} x={190 + i * 170} y={720} s={0.9} flip look={RICHM(i)} t={t + i} arms={t > r + i * 0.4 ? 'reach' : 'none'} hold={<Bag s={0.7} />} face={{eyes: 'half', mouth: 'smile', brow: 0.6, look: [-1, 0]}} />)}
      {t > r ? Array.from({length: 14}).map((_, i) => { const u = Math.min(1, (t - r - i * 0.05) * 1.6); return u > 0 ? <circle key={i} cx={lerp(160, -20, u) + (rnd(i) - 0.5) * 40} cy={lerp(540, 600, u) - Math.sin(u * Math.PI) * 80} r={14} fill="#F2C24A" stroke="#8A5A10" strokeWidth={4} opacity={1 - u * 0.6} /> : null; }) : null}
    </Cam>
  );
};
/* 10 ----------------------------------------------------------------- the poor widow: two small coins */
const Widow: React.FC<SP> = (p) => {
  const {t} = p;
  const tw = p.w('two', p.dur * 0.75);
  const c = ko(t, tw - 0.2, tw + 0.5);
  return (
    <Cam c={{x: 0, y: lerp(260, 120, c), z: lerp(1.3, 1.9, c)}} p={p}>
      {RDEFS}<Hall t={t} />
      <Box x={180} y={760} s={1.1} />
      <Bean x={lerp(-500, -60, ko(t, 0, p.dur * 0.5))} y={740} s={0.9} look={WIDOW} t={t} walk={t < p.dur * 0.5 ? 0.8 : 0} arms={c > 0.2 ? 'reach' : 'none'} face={{eyes: 'open', mouth: 'smile', brow: 0.2, look: [1, 0.3]}} />
      {c > 0 ? [0, 1].map((i) => <g key={i}><Glow x={40 + i * 40} y={560} r={70} o={c * 0.8} /><Coin x={40 + i * 40} y={560 + c * 10} r={14} copper /></g>) : null}
    </Cam>
  );
};
/* 11 ----------------------------------------------------------------- "she gave everything she had" (BIG MOMENT) */
const More: React.FC<SP> = (p) => {
  const {t} = p;
  const ev = p.w('everything', p.dur * 0.85);
  const g = ko(t, ev - 0.3, ev + 0.8);
  if (t < p.dur * 0.35) return <Cam c={{x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)}} p={p}>{RDEFS}<Hall t={t} /><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'smile', brow: 0.6, look: [-1, 0.3]}} /></Cam>;
  return (
    <Cam c={{x: 0, y: 220, z: 1.25}} p={p}>
      {RDEFS}<Hall t={t} dark={0.4 * g} />
      {[-480, -300].map((x, i) => <g key={i} opacity={1 - g * 0.6}><Bean x={x} y={720} s={0.9} look={RICHM(i)} t={t + i} hold={<Bag s={0.8} />} arms="offer" face={{eyes: 'half', mouth: 'smile', look: [1, 0]}} /></g>)}
      <Glow x={240} y={460} r={200 + g * 700} o={0.3 + g * 0.7} id="gWhite" />
      {Array.from({length: 8}).map((_, i) => <polygon key={i} points={`${240 - 20 + i * 5},-1700 ${240 + 20 + i * 5},-1700 ${240 + (i - 3.5) * 220 + 90},1300 ${240 + (i - 3.5) * 220 - 90},1300`} fill="#FFF6D0" opacity={0.1 * g} />)}
      <Bean x={240} y={720} s={1.0} look={WIDOW} t={t} arms="offer" face={{eyes: g > 0.5 ? 'closed' : 'open', mouth: 'smile', brow: 0.4, look: [0, -0.3]}} />
      {[0, 1].map((i) => <g key={i}><Glow x={210 + i * 60} y={500 - g * 60} r={50 + g * 60} o={0.9} /><Coin x={210 + i * 60} y={500 - g * 60} r={18 + g * 10} copper /></g>)}
    </Cam>
  );
};
/* 12 ----------------------------------------------------------------- leaving the temple */
const Left: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: lerp(-100, 100, t / p.dur), y: 220, z: 1.1}} p={p}>
      {RDEFS}<Sky />
      <g filter="url(#dof)"><rect x={-800} y={-400} width={1600} height={720} fill="#E0D2B4" stroke="#8a7a6a" strokeWidth={8} />{[-600, -300, 0, 300, 600].map((x) => <rect key={x} x={x - 40} y={-300} width={80} height={620} fill="#D0C0A0" stroke="#8a7a6a" strokeWidth={6} />)}<path d="M -900 -400 L 0 -700 L 900 -400 Z" fill="#E8DAC0" stroke="#8a7a6a" strokeWidth={8} /></g>
      <rect x={-3000} y={330} width={6000} height={3000} fill="#C2A47A" />
      {['simon', 'john', 'andrew'].map((n, i) => <Bean key={n} x={-400 + i * 170 + t * 40} y={720} s={0.9} look={AP[n]} t={t + i} walk={1.1} face={{eyes: 'open', mouth: i === 1 ? 'open' : 'smile', look: [1, -0.3]}} />)}
      <Bean x={220 + t * 40} y={710} s={1.0} look={JESUS} t={t} walk={1.1} face={{eyes: 'open', mouth: 'flat', look: [1, 0]}} />
    </Cam>
  );
};
/* 13 ----------------------------------------------------------------- "what massive stones!" */
const StonesSc: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: lerp(220, 120, t / p.dur), z: 1.15}} p={p}>
      {RDEFS}<Sky /><Stones t={t} />
      <rect x={-3000} y={700} width={6000} height={3000} fill="#C2A47A" />
      <Bean x={-200} y={900} s={1.0} look={AP.john} t={t} arms="up" face={{eyes: 'wide', mouth: 'open', brow: 0.6, look: [0.4, -1]}} />
      <Bean x={220} y={900} s={1.05} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', look: [-1, 0]}} />
    </Cam>
  );
};
/* 14 ----------------------------------------------------------------- not one stone left on another */
const Down: React.FC<SP> = (p) => {
  const {t} = p;
  const th = p.w('thrown', p.dur * 0.85);
  const f = ko(t, th - 0.6, th + 1.0);
  return (
    <Cam c={{x: Math.sin(t * 40) * 10 * Math.max(0, 1 - Math.abs(t - th) / 0.8), y: 150, z: 1.15}} p={p}>
      {RDEFS}<Sky dusk={0.4 * f} /><Stones t={t} fall={f} />
      <rect x={-3000} y={700} width={6000} height={3000} fill="#C2A47A" />
      {f > 0.3 ? Array.from({length: 16}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 1400} cy={680 - rnd(i + 2) * 200 * f} r={40 + rnd(i) * 60} fill="#B8A88A" opacity={0.5 * f * (1 - f * 0.5)} />) : null}
    </Cam>
  );
};
/* 15 ----------------------------------------------------------------- heaven and earth pass away; my words never */
const Words: React.FC<SP> = (p) => {
  const {t} = p;
  const fade = ko(t, 0.4, p.w('never', p.dur * 0.6) - 0.3);
  const w = ko(t, p.w('words', p.dur * 0.55) - 0.2, p.w('words', p.dur * 0.55) + 0.6);
  return (
    <Cam c={{x: 0, y: 0, z: 1.1}} p={p}>
      {RDEFS}<Sky dusk={0.6} />
      <g opacity={1 - fade * 0.85} transform={`translate(0 ${fade * 80}) scale(${1 - fade * 0.2})`}>
        <circle cx={0} cy={500} r={260} fill="#3C7BB0" stroke={INK} strokeWidth={8} />
        <path d="M -170 420 q 60 -40 110 10 q 40 40 -20 80 q -60 10 -90 -30 Z M 40 360 q 80 10 110 80 q -30 40 -90 10 Z M 30 580 q 70 -10 100 40 q -40 70 -100 40 Z" fill="#6AA05A" />
        {Array.from({length: 30}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 1600} cy={-800 + rnd(i + 4) * 900} r={2 + rnd(i) * 3} fill="#FFFBEA" opacity={0.6} />)}
      </g>
      <g transform={`translate(0 ${-150}) scale(${0.6 + 0.4 * w})`} opacity={w}>
        <Glow x={0} y={0} r={420} o={0.9} id="gWhite" />
        <rect x={-210} y={-130} width={420} height={260} rx={20} fill="#F2E2B8" stroke={INK} strokeWidth={8} />
        {[-80, -40, 0, 40, 80].map((y) => <line key={y} x1={-160} y1={y} x2={160} y2={y} stroke="#8A6A3A" strokeWidth={6} />)}
        <circle cx={-215} cy={0} r={34} fill="#C89A5A" stroke={INK} strokeWidth={6} /><circle cx={215} cy={0} r={34} fill="#C89A5A" stroke={INK} strokeWidth={6} />
      </g>
    </Cam>
  );
};
/* 16 ----------------------------------------------------------------- keep watch */
const Watch: React.FC<SP> = (p) => {
  const {t} = p;
  return (
    <Cam c={{x: 0, y: 220, z: lerp(1.3, 1.45, t / p.dur)}} p={p}>
      {RDEFS}<Sky dusk={0.85} />
      {Array.from({length: 30}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 1600} cy={-700 + rnd(i + 4) * 900} r={2 + rnd(i) * 3} fill="#FFFBEA" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
      <rect x={-3000} y={330} width={6000} height={3000} fill="#3A2A24" />
      <OilLamp x={-180} y={560} t={t} r={360} />
      <Bean x={60} y={740} s={1.05} look={AP.john} t={t} face={{eyes: 'open', mouth: 'flat', brow: 0.4, look: [Math.sin(t * 0.8), -0.4]}} />
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
      {[0, 1].map((i) => <g key={i}><Glow x={-30 + i * 60} y={760} r={60} o={0.8} /><Coin x={-30 + i * 60} y={760} r={22} copper /></g>)}
      {Array.from({length: 14}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 1600} cy={-600 + rnd(i + 9) * 700} r={2 + rnd(i) * 3} fill="#FFFBEA" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
    </Cam>
  );
};

export const SCENES16: Record<string, React.FC<SP>> = {trap: Trap, tax: PhBust, coin: CoinSc, caesar: PhBust, give: Give, which: Which, love: Love, second: Second, treasury: Treasury, widow: Widow, more: More, left: Left, stones: StonesSc, down: Down, words: Words, watch: Watch, end: End};
