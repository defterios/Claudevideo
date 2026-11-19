import React from 'react';
import {ANDREW, FRIENDS, INK, JAMES, JESUS, JOHNZ, LEVI, Look, POSSESSED, SIMON} from '../v8/fig';
import {C3, Cam, Fill, Glow, SP, Boat, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Hand, Wheat} from '../v11/anime';
import {Bean, OilLamp, RDEFS, Room, SunPatch} from '../v11/room';
import {Hall, PH} from '../v11/scenes_room';

/** Episode 5 — "The Twelve" (Mark 3:7-35), lit-room cartoon style. */
export const MARY: Look = {skin: '#E0A880', hair: '#3A2418', tunic: '#3E5C8A', sash: '#C9A35A', style: 'hood', wrap: '#2F4A7A', beard: false};
const BRO = (i: number): Look => ({...FRIENDS[i % 4], beard: i !== 1});
export const AP: Record<string, Look> = {
  simon: SIMON, andrew: ANDREW, james: JAMES, john: JOHNZ,
  philip: {skin: '#D9A07C', hair: '#4A3020', tunic: '#7A8A4A', sash: '#4A5A2A', style: 'short', beard: false},
  bartholomew: {skin: '#C98E64', hair: '#2A1C14', tunic: '#8A4A6A', sash: '#5A2A40', style: 'long', beard: true},
  matthew: LEVI,
  thomas: {skin: '#D69A6C', hair: '#3A2418', tunic: '#4A7A8A', sash: '#2A4A58', style: 'wild', beard: true},
  james2: {skin: '#E0AC84', hair: '#5A3A22', tunic: '#9A7A4A', sash: '#5A4428', style: 'short', beard: true},
  thaddaeus: {skin: '#C7946E', hair: '#1E1612', tunic: '#6A5A8A', sash: '#3A2E5A', style: 'long', beard: false},
  simon2: {skin: '#D2966A', hair: '#2E1E16', tunic: '#A84A3A', sash: '#5A2418', style: 'short', beard: true},
  judas: {skin: '#C8926C', hair: '#1A120E', tunic: '#5A4E3A', sash: '#2A2418', style: 'short', beard: true},
};
export const TWELVE = ['simon', 'andrew', 'james', 'john', 'philip', 'bartholomew', 'matthew', 'thomas', 'james2', 'thaddaeus', 'simon2', 'judas'];
const Bust: React.FC<{x: number; y: number; look: Look; face?: React.ComponentProps<typeof Bean>['face']; t?: number; s?: number; dim?: number}> = ({x, y, look, face, t = 0, s = 1.5, dim}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><Bean x={0} y={440} look={look} face={face} t={t} dim={dim} /></g>
);
const shake = (t: number, at: number, amp = 12, decay = 4) => (t > at ? Math.exp(-(t - at) * decay) * amp : 0);
const Sky: React.FC<{dusk?: number}> = ({dusk = 0}) => (<><Fill fill="url(#goldHour)" />{dusk ? <Fill fill="#2a1a3a" o={dusk} /> : null}</>);
const Sea: React.FC<{t: number; y?: number; blur?: boolean}> = ({t, y = 120, blur = true}) => (
  <g filter={blur ? 'url(#dof)' : undefined}>
    <circle cx={300} cy={y - 220} r={140} fill="#FFF0C8" /><Glow x={300} y={y - 220} r={600} o={0.7} />
    <path d={`M -1600 ${y} Q -900 ${y - 120} -300 ${y - 30} Q 400 ${y - 130} 1600 ${y - 20} L 1600 ${y + 20} L -1600 ${y + 20} Z`} fill="#7A7A9A" />
    <rect x={-3000} y={y} width={6000} height={3000} fill="#3F7A9A" />
    {Array.from({length: 24}).map((_, i) => <path key={i} d={`M ${(rnd(i) - 0.5) * 2600 + Math.sin(t + i) * 30} ${y + 30 + (i % 8) * 70} q 40 -12 80 0 t 80 0`} fill="none" stroke="#A9DCE4" strokeWidth={5} opacity={0.6} />)}
  </g>
);
const NameCard: React.FC<{name: string; sub?: string; o: number; x?: number; y?: number}> = ({name, sub, o, x = 0, y = -520}) => (
  <g opacity={o} transform={`translate(${x} ${y + (1 - o) * 30})`}>
    <text textAnchor="middle" fontFamily="Anton" fontSize={84} fill="#FBEFD9" stroke="#1c0d16" strokeWidth={14} paintOrder="stroke" letterSpacing={4}>{name}</text>
    {sub ? <text y={52} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={40} fill="#FFDD33" stroke="#1c0d16" strokeWidth={10} paintOrder="stroke">{sub}</text> : null}
  </g>
);

/* 1 ------------------------------------------------------------------ the crowd at the sea */
const Crowd: React.FC<SP> = (p) => {
  const {t} = p;
  const cutB = 2.6, cutC = p.segs[1] - 0.15;
  if (t < cutB) {
    // frame one: a finished picture — hands reaching for the hem of his robe
    const c: C3 = {x: 0, y: -100, z: lerp(1.15, 1.25, t / cutB)};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Sky />
        <g filter="url(#dof)">{Array.from({length: 14}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 1400} cy={-200 + (rnd(i + 3) - 0.5) * 300} r={70} fill={['#C9A27A', '#8A6A5A', '#B98A6A'][i % 3]} opacity={0.6} />)}</g>
        <path d="M -260 -900 L 260 -900 L 330 -280 Q 0 -230 -330 -280 Z" fill={JESUS.tunic} stroke={INK} strokeWidth={10} />
        <path d="M -330 -330 Q 0 -280 330 -330 L 330 -280 Q 0 -230 -330 -280 Z" fill={JESUS.sash} stroke={INK} strokeWidth={6} />
        {[-420, -150, 140, 420, -300, 300].map((x, i) => {
          const reach = 0.6 + 0.4 * Math.sin(t * 3 + i);
          return <g key={i} transform={`translate(${x + Math.sin(t * 5 + i) * 8} ${lerp(900, 300 - (i < 4 ? 0 : 120), reach)}) scale(1.6) rotate(${(x > 0 ? -1 : 1) * (8 + i * 2)})`}><Hand withered={0} curl={0.15} spread={1.1} t={t} skin={['#E0A878', '#C98E64', '#D9A07A', '#B9845E', '#E8B48C', '#C7946E'][i]} sleeve={['#C0663A', '#5E8A5A', '#4F6F9A', '#C9A04A', '#8A4A6A', '#7A8A4A'][i]} /></g>;
        })}
      </Cam>
    );
  }
  if (t < cutC) {
    const u = (t - cutB) / (cutC - cutB);
    const c: C3 = {x: 0, y: 80, z: lerp(1.0, 1.15, u)};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Sky /><Sea t={t} y={-60} />
        <rect x={-3000} y={240} width={6000} height={3000} fill="#C9A47A" />
        <Bean x={0} y={520} s={0.95} look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [0, 0]}} shake={1} />
        {Array.from({length: 16}).map((_, i) => { const row = i % 3, side = i % 2 ? 1 : -1; const x = side * (lerp(520, 200, u) + (i >> 1) * 70 + row * 40); return <Bean key={i} x={x} y={560 + row * 110} s={0.85 + row * 0.08} flip={side > 0} look={FRIENDS[i % 4]} shirt={['#C0663A', '#5E8A5A', '#4F6F9A', '#C9A04A', '#8A6A9A', '#9A7A5A'][i % 6]} t={t + i} face={{eyes: 'open', mouth: i % 3 ? 'open' : 'smile', look: [-side, -0.3]}} arms={i % 2 ? 'reach' : 'none'} />; })}
      </Cam>
    );
  }
  const u = t - cutC;
  const c: C3 = {x: 0, y: 40, z: 1.05};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.1} /><Sea t={t} y={-200} blur={false} />
      <g transform={`translate(${lerp(-80, 120, ko(u, 0, p.dur - cutC))} 330)`}><Boat x={0} y={0} s={4} t={t} /><Bean x={0} y={-30} s={0.8} look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [-1, 0.2]}} /></g>
      <rect x={-3000} y={620} width={6000} height={3000} fill="#C9A47A" />
      {Array.from({length: 9}).map((_, i) => <Bean key={i} x={-560 + i * 140} y={980 + (i % 2) * 50} s={0.9} look={FRIENDS[i % 4]} shirt={['#C0663A', '#5E8A5A', '#4F6F9A', '#C9A04A'][i % 4]} t={t + i} face={{eyes: 'open', mouth: 'open', look: [0, -1]}} arms={i % 3 === 0 ? 'up' : 'reach'} />)}
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ the spirits fall */
const Spirits: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  if (t < s1) {
    const c: C3 = {x: 0, y: 60, z: lerp(1.05, 1.2, t / s1)};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Sky dusk={0.55} /><Sea t={t} y={-80} />
        <rect x={-3000} y={240} width={6000} height={3000} fill="#7A6450" />
        {[-330, 0, 330].map((x, i) => { const f = ko(t, 0.8 + i * 0.45, 1.3 + i * 0.45); return <Bean key={i} x={x} y={640} s={0.95} sit={f > 0.5} look={{...POSSESSED, tunic: ['#6E6A5E', '#5A5248', '#7A7064'][i]}} t={t + i} face={{eyes: 'wide', mouth: 'open', brow: -0.9}} shake={f > 0.5 ? 3 : 0} arms={f > 0.5 ? 'up' : 'none'} dim={0.25} />; })}
      </Cam>
    );
  }
  const u = t - s1;
  const c: C3 = {x: Math.sin(t * 60) * shake(u, 0.1, 10), y: -30, z: lerp(2.1, 2.3, u / (p.dur - s1))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="#140c18" /><Glow x={0} y={600} r={800} o={0.35} />
      <Bust x={0} y={0} look={POSSESSED} t={t} face={{eyes: 'wide', mouth: 'open', brow: -1}} />
      <Fill fill="#3a0a14" o={0.2} />
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ up the mountain */
const Mountain: React.FC<SP> = (p) => {
  const {t} = p;
  const call = p.w('called', p.dur * 0.6);
  const c: C3 = {x: 0, y: lerp(260, -60, k(t, 0, p.dur)), z: lerp(0.9, 1.1, k(t, 0, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky />
      <g filter="url(#dof)"><circle cx={-280} cy={-500} r={150} fill="#FFF0C8" /><Glow x={-280} y={-500} r={700} o={0.8} />
        <path d="M -1600 300 L -700 -200 L -200 100 L 400 -300 L 1600 200 L 1600 1500 L -1600 1500 Z" fill="#9A7A8A" /></g>
      <path d="M -1600 1200 Q -600 700 -80 360 Q 120 300 400 420 Q 900 700 1600 1100 L 1600 3000 L -1600 3000 Z" fill="#7A6A4A" stroke={INK} strokeWidth={8} />
      <Bean x={60} y={380} s={0.9} look={JESUS} t={t} face={{eyes: 'open', mouth: t > call ? 'open' : 'smile', look: [-0.6, 0.4]}} arms={t > call - 0.2 ? 'offer' : 'none'} flip />
      {[0, 1, 2, 3].map((i) => { const a = lin(t, 0.3 + i * 0.3, p.dur); return <Bean key={i} x={lerp(-700 + i * 60, -260 + i * 70, a)} y={lerp(1150, 620 - i * 30, a)} s={0.75} look={AP[TWELVE[i]]} t={t + i * 0.3} walk={1} face={{eyes: 'open', mouth: 'smile', look: [1, -0.4]}} />; })}
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ the names, one per beat */
const Names: React.FC<SP> = (p) => {
  const {t} = p;
  const ws = p.ws ?? [];
  const bdy = ws.some(([w]) => w === 'peter');
  const order: [string, string, string?, string?][] = [['simon', 'SIMON', bdy ? '"PETER"' : '"THE ROCK"'], ['james', 'JAMES & JOHN', bdy ? 'ONAK ZEBEDEE' : '"SONS OF THUNDER"', 'john'], ['andrew', 'ANDREW'], ['philip', 'PHILIP'], ['bartholomew', 'BARTHOLOMEW'], ['matthew', 'MATTHEW'], ['thomas', 'THOMAS'], ['james2', 'JAMES', bdy ? 'ONAK ALPHAEUS' : 'SON OF ALPHAEUS'], ['thaddaeus', bdy ? 'THADDEUS' : 'THADDAEUS'], ['simon2', 'SIMON', bdy ? undefined : 'THE ZEALOT']];
  // name start times, in order (the second James / Simon come from the per-word list)
  const names = ws.filter(([w]) => ['simon', 'james', 'andrew', 'philip', 'bartholomew', 'matthew', 'thomas', 'thaddaeus', 'thaddeus'].includes(w)).map(([, tm]) => tm);
  const times = order.map((_, i) => names[i] ?? i * 0.9);
  let i = 0;
  for (let j = 0; j < times.length; j++) if (t >= times[j] - 0.12) i = j;
  const [key, label, sub, pair] = order[i];
  const u = t - (times[i] - 0.12);
  const side = i % 2 ? -1 : 1;
  const tint = ['#E8A870', '#C9887A', '#9A8AB0', '#E0B07A', '#8AA0B0', '#D0907A', '#A0A07A', '#B08A9A', '#E0A070', '#9AB0A0'][i];
  const c: C3 = {x: side * lerp(30, 0, ko(u, 0, 0.5)), y: -40, z: lerp(1.9, 1.95, ko(u, 0, 0.8))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}
      <Fill fill={tint} /><g filter="url(#dof)"><Glow x={-side * 400} y={-300} r={700} o={0.7} /><path d="M -1600 300 L -700 -100 L -200 160 L 400 -200 L 1600 250 L 1600 1500 L -1600 1500 Z" fill="#000" opacity={0.18} /></g>
      {pair
        ? <g><Bust x={-200} y={60} s={1.2} look={AP[key]} t={t} face={{eyes: 'open', mouth: 'grit', brow: -0.6, look: [1, 0]}} /><Bust x={200} y={60} s={1.2} look={AP[pair]} t={t + 1} face={{eyes: 'open', mouth: 'open', brow: -0.6, look: [-1, 0]}} /></g>
        : <Bust x={0} y={0} look={AP[key]} t={t} face={{eyes: 'open', mouth: 'smile', look: [-side * 0.5, 0]}} />}
      <NameCard name={label} sub={sub} o={ko(u, 0, 0.2)} y={pair ? -300 : -330} />
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ Judas */
const Judas: React.FC<SP> = (p) => {
  const {t} = p;
  const b = p.w('betray', p.dur * 0.6);
  const shadowX = lerp(-600, 0, k(t, b - 0.3, b + 0.6));
  const c: C3 = {x: 0, y: -20, z: lerp(1.9, 2.15, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="#2a2030" /><OilLamp x={-260} y={520} t={t} r={700} />
      <Bust x={0} y={0} look={AP.judas} t={t} face={{eyes: 'half', mouth: 'flat', brow: -0.3, look: [1, 0.4]}} />
      <rect x={shadowX - 1400} y={-1200} width={1400} height={2600} fill="#06040a" opacity={0.7} filter="url(#dofS)" />
      <NameCard name="JUDAS" sub="ISCARIOT" o={1 - lin(t, b - 0.4, b)} y={-320} />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={230 + i * 30} cy={330 - i * 10} rx={18} ry={7} fill="#E8B84A" stroke={INK} strokeWidth={3} opacity={k(t, b, b + 0.5)} />)}
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ twelve ordinary men */
const Twelve: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: lerp(-80, 120, k(t, 0, p.dur)), z: lerp(1.35, 0.85, k(t, 0, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.15} />
      <g filter="url(#dof)"><circle cx={0} cy={-260} r={220} fill="#FFE6B0" /><Glow x={0} y={-260} r={900} o={0.8} /></g>
      <path d="M -1600 900 Q -600 420 0 360 Q 600 420 1600 900 L 1600 3000 L -1600 3000 Z" fill="#6A5A3A" stroke={INK} strokeWidth={8} />
      {TWELVE.slice(0, 6).map((n, i) => <Bean key={n} x={-560 + i * 224} y={520} s={0.75} look={AP[n]} t={t + i} face={{eyes: 'open', mouth: 'smile', look: [0, 0]}} dim={n === 'judas' ? 0.3 : 0} />)}
      {TWELVE.slice(6).map((n, i) => <Bean key={n} x={-470 + i * 190} y={680} s={0.85} look={AP[n]} t={t + i + 6} face={{eyes: n === 'judas' ? 'half' : 'open', mouth: n === 'judas' ? 'flat' : 'smile', look: [0, 0]}} dim={n === 'judas' ? 0.35 : 0} />)}
      <Bean x={0} y={860} s={1.0} look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile'}} arms="offer" />
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ his family comes */
const Family: React.FC<SP> = (p) => {
  const {t} = p;
  const said = p.w('said', p.dur * 0.6) - 0.2;
  if (t < said) {
    const c: C3 = {x: lerp(-200, 100, t / said), y: 60, z: 1.1};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Sky />
        <g filter="url(#dof)">{[-900, -300, 400, 1000].map((x, i) => <rect key={i} x={x - 240} y={-420 + (i % 2) * 60} width={480} height={700} fill="#D9B48C" stroke="#7a5a3a" strokeWidth={6} />)}</g>
        <rect x={-3000} y={300} width={6000} height={3000} fill="#C9A47A" />
        {[MARY, BRO(0), BRO(1), BRO(2)].map((L, i) => <Bean key={i} x={lerp(-900, 300, lin(t, 0, said)) - i * 190} y={600 + (i % 2) * 30} s={0.9} look={L} t={t + i * 0.3} walk={1} face={{eyes: 'open', mouth: 'frown', brow: -0.7, look: [1, 0]}} />)}
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: -20, z: lerp(1.9, 2.05, k(t, said, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky /><g filter="url(#dof)"><Glow x={300} y={-300} r={600} o={0.6} /></g>
      <Bust x={-120} y={0} look={BRO(0)} t={t} face={{eyes: 'open', mouth: Math.sin(t * 13) > 0 ? 'open' : 'frown', brow: -0.8, look: [1, 0]}} />
      <Bust x={340} y={140} s={1.2} look={MARY} t={t} face={{eyes: 'half', mouth: 'frown', brow: -0.5, look: [-1, 0]}} />
    </Cam>
  );
};

/* 8 ------------------------------------------------------------------ the scholars accuse */
const Scholars: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = Math.min(1.1, p.dur * 0.35);
  if (t < cut) {
    const c: C3 = {x: 0, y: 120, z: 1.25};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Hall t={t} dark={0.35} />
        {[-300, 0, 300].map((x, i) => <Bean key={i} x={x} y={620} s={0.95} look={PH(i)} t={t + i} face={{eyes: 'half', mouth: 'open', brow: -1, look: [1, 0]}} arms="point" />)}
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: -20, z: lerp(2.0, 2.2, k(t, cut, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Hall t={t} dark={0.45} />
      <Bust x={0} y={0} look={PH(1)} t={t} face={{eyes: 'half', mouth: Math.sin(t * 14) > 0 ? 'open' : 'grit', brow: -1.2, look: [1, 0]}} />
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ "A house divided cannot stand" — the one big moment */
const Divided: React.FC<SP> = (p) => {
  const {t} = p;
  const dv = p.w('divided', p.dur * 0.5), st = p.w('stand', p.dur * 0.8);
  if (t < dv - 0.15) {
    const c: C3 = {x: 0, y: -20, z: lerp(1.9, 2.1, t / dv)};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Hall t={t} />
        <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'flat', brow: 0.6}} />
      </Cam>
    );
  }
  const split = ko(t, dv, st - 0.2) * 70;
  const fall = k(t, st + 0.05, st + 1.0);
  const c: C3 = {x: Math.sin(t * 55) * shake(t, st + 0.05, 14, 3), y: 40, z: 1.05};
  const half = (s: number) => (
    <g transform={`translate(${s * (split + fall * 140)} ${fall * 420}) rotate(${s * fall * 24} ${s * 10} 300)`}>
      <clipPath id={`hh${s}`}><path d={s < 0 ? 'M -600 -900 L 6 -900 L -14 -400 L 14 -50 L -10 300 L -600 300 Z' : 'M 600 -900 L 6 -900 L -14 -400 L 14 -50 L -10 300 L 600 300 Z'} /></clipPath>
      <g clipPath={`url(#hh${s})`}>
        <path d="M -380 300 L -380 -320 L 0 -620 L 380 -320 L 380 300 Z" fill="#D9B48C" stroke={INK} strokeWidth={10} />
        <path d="M -430 -300 L 0 -660 L 430 -300" fill="none" stroke="#8A4A3A" strokeWidth={36} strokeLinejoin="round" />
        <rect x={-260} y={-160} width={130} height={130} fill="#FFC27A" stroke={INK} strokeWidth={8} /><rect x={130} y={-160} width={130} height={130} fill="#FFC27A" stroke={INK} strokeWidth={8} />
        <path d="M -70 300 L -70 60 Q 0 0 70 60 L 70 300 Z" fill="#5a3a24" stroke={INK} strokeWidth={8} />
      </g>
    </g>
  );
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.4} />
      <rect x={-3000} y={300} width={6000} height={3000} fill="#6A5440" />
      {half(-1)}{half(1)}
      {t > dv ? <path d={`M 6 -660 L -14 -400 L 14 -50 L -10 300`} fill="none" stroke="#1a0f0a" strokeWidth={6 + split * 0.2} opacity={1 - fall} /> : null}
      {fall > 0 ? <g filter="url(#softL)" opacity={Math.min(1, fall * 1.5) * (1 - lin(t, st + 1.2, p.dur))}>{Array.from({length: 10}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 1100} cy={260 - rnd(i + 2) * 300 * fall} r={140 + rnd(i + 3) * 120} fill="#C9A47A" opacity={0.7} />)}</g> : null}
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- his mother and brothers at the door */
const Door: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-60, 60, t / p.dur), y: 100, z: 1.15};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.2} />
      <rect x={-520} y={-500} width={1040} height={820} fill="#D9B48C" stroke={INK} strokeWidth={9} />
      <path d="M -110 320 L -110 -60 Q 0 -150 110 -60 L 110 320 Z" fill="#FFC27A" stroke={INK} strokeWidth={8} />
      <Glow x={0} y={100} r={400} o={0.7} />
      {[-60, 60].map((x, i) => <Bean key={i} x={x} y={330} s={0.7} look={FRIENDS[i + 1]} t={t + i} face={{eyes: 'half', look: [0, 0]}} dim={0.4} />)}
      <rect x={-3000} y={320} width={6000} height={3000} fill="#B8946A" />
      {[MARY, BRO(0), BRO(1), BRO(2)].map((L, i) => <Bean key={i} x={-460 + i * 300 + (i === 0 ? 0 : 60)} y={760 + (i % 2) * 40} s={i === 0 ? 1.0 : 0.92} look={L} t={t + i} face={{eyes: 'open', mouth: 'flat', brow: -0.3, look: [i === 0 ? 1 : 0.4, -0.4]}} />)}
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- "Who are my mother and my brothers?" */
const Answer: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: -20, z: lerp(2.0, 2.15, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Room t={t} wall="#7A6050" floor="#5A3E2C" win={false} /><OilLamp x={-400} y={-80} t={t} />
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t < p.dur - 1 && Math.sin(t * 12) > 0 ? 'open' : 'smile', brow: 0.2, look: [Math.sin(t * 1.4) * 1, 0]}} />
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- the circle: "my brother, and sister, and mother" */
const Circle: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: lerp(60, 180, k(t, 0, p.dur)), z: lerp(1.35, 1.0, k(t, 0, p.dur))};
  const ring: [number, number][] = Array.from({length: 10}).map((_, i) => { const a = (i / 10) * Math.PI * 2 + 0.3; return [Math.cos(a) * 520, 560 + Math.sin(a) * 170]; });
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Room t={t} wall="#8A6A50" floor="#6A4A30" win={false} />
      <OilLamp x={0} y={380} t={t} r={900} />
      <SunPatch pts="-200,-900 200,-900 600,900 -600,900" o={0.25} />
      {ring.filter(([, y]) => y < 560).map(([x, y], i) => <Bean key={'b' + i} x={x} y={y} s={0.75} sit look={i % 3 === 0 ? MARY : FRIENDS[i % 4]} shirt={['#C0663A', '#5E8A5A', '#4F6F9A', '#C9A04A', '#8A6A9A'][i % 5]} t={t + i} face={{eyes: 'closed', mouth: 'smile', look: [0, 0]}} />)}
      <Bean x={0} y={560} s={0.9} look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile'}} arms="offer" />
      {ring.filter(([, y]) => y >= 560).map(([x, y], i) => <Bean key={'f' + i} x={x} y={y} s={0.9} sit look={FRIENDS[(i + 2) % 4]} shirt={['#A84A3A', '#3E6A5A', '#7A5A8A', '#9A7A4A', '#4A6A9A'][i % 5]} t={t + i + 5} face={{eyes: 'closed', mouth: 'smile', look: [0, -0.4]}} />)}
    </Cam>
  );
};

/* 13 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 0, z: 1};
  const sil: Look = {...JESUS, skin: '#0b0c14', hair: '#0b0c14', tunic: '#0b0c14', sash: '#0b0c14'};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" />
      <circle cx={0} cy={330} r={240} fill="#FFE2B0" /><Glow x={0} y={330} r={700} o={0.5} />
      <path d="M -3000 680 Q -300 540 0 560 Q 300 540 3000 680 L 3000 3000 L -3000 3000 Z" fill="#0b0c14" />
      {Array.from({length: 13}).map((_, i) => <Bean key={i} x={-480 + i * 80} y={575 + Math.abs(i - 6) * 6} s={i === 6 ? 0.3 : 0.24} look={sil} t={t} face={{eyes: 'closed', mouth: 'none'}} />)}
    </Cam>
  );
};

export const SCENES5: Record<string, React.FC<SP>> = {crowd: Crowd, spirits: Spirits, mountain: Mountain, names: Names, judas: Judas, twelve: Twelve, family: Family, scholars: Scholars, divided: Divided, door: Door, answer: Answer, circle: Circle, end: End};
