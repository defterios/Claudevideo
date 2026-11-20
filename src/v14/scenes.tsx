import React from 'react';
import {FRIENDS, INK, JESUS, Look} from '../v8/fig';
import {C3, Cam, Fill, Glow, SP, Stars, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {AP, Bust, Sea, Sky} from '../v12/scenes';
import {BigBoat, Moon} from '../v13/scenes';

/** Episode 7 — "Legion" (Mark 5:1-20), lit-room cartoon style. Big moment: the herd rushes into the sea. */
export const WILDMAN: Look = {skin: '#B9977E', hair: '#1E1612', tunic: '#5A544C', sash: '#3A342C', style: 'wild', beard: true, gaunt: 0.8};
export const HEALED: Look = {skin: '#D2A07E', hair: '#2E2018', tunic: '#D9C9A8', sash: '#8A6A3A', style: 'short', beard: true};
const TOWN = (i: number): Look => ({...FRIENDS[i % 4], tunic: ['#A8794A', '#6A7A5A', '#8A5A5A', '#5A6A8A', '#9A8A5A'][i % 5]});
const shake = (t: number, at: number, amp = 12, decay = 4) => (t > at ? Math.exp(-(t - at) * decay) * amp : 0);

const Night: React.FC<{t: number; moonX?: number}> = ({t, moonX = 380}) => (<><Fill fill="url(#nightSt)" /><Stars t={t} n={70} /><Moon x={moonX} y={-700} /></>);
const Fog: React.FC<{t: number; y: number; o?: number}> = ({t, y, o = 0.4}) => (
  <g filter="url(#softL)" opacity={o}>{Array.from({length: 7}).map((_, i) => <ellipse key={i} cx={(rnd(i) - 0.5) * 2600 + Math.sin(t * 0.3 + i) * 100} cy={y + (rnd(i + 2) - 0.5) * 160} rx={460} ry={90} fill="#8A90B0" />)}</g>
);
/** cliff with tomb openings; x = left edge of the cliff face */
const Tombs: React.FC<{x: number; top?: number; base?: number}> = ({x, top = -700, base = 400}) => (
  <g>
    <path d={`M ${x} ${base} L ${x + 60} ${top} L 3000 ${top - 100} L 3000 ${base} Z`} fill="#3A3444" stroke={INK} strokeWidth={8} />
    {[[x + 200, -380], [x + 460, -200], [x + 260, 80], [x + 620, 150], [x + 760, -460]].map(([tx, ty], i) => <path key={i} d={`M ${tx - 70} ${ty + 110} L ${tx - 70} ${ty} Q ${tx} ${ty - 80} ${tx + 70} ${ty} L ${tx + 70} ${ty + 110} Z`} fill="#0b0912" stroke="#5A5068" strokeWidth={6} />)}
    {[[x - 160, base], [x - 320, base + 40], [x - 520, base + 10]].map(([gx, gy], i) => <path key={'g' + i} d={`M ${gx - 40} ${gy} L ${gx - 40} ${gy - 120} Q ${gx} ${gy - 160} ${gx + 40} ${gy - 120} L ${gx + 40} ${gy} Z`} fill="#4A4458" stroke={INK} strokeWidth={6} />)}
  </g>
);
const Chain: React.FC<{x: number; y: number; n?: number; ang?: number; broken?: boolean}> = ({x, y, n = 5, ang = 90, broken}) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`}>{Array.from({length: n}).map((_, i) => <ellipse key={i} cx={i * 30} cy={0} rx={18} ry={10} fill="none" stroke="#8A8A94" strokeWidth={7} transform={`rotate(${i % 2 ? 60 : 0} ${i * 30} 0)`} />)}{broken ? <path d={`M ${n * 30 - 6} -10 l 14 6 l -10 8`} fill="none" stroke="#8A8A94" strokeWidth={6} /> : null}</g>
);
export const Pig: React.FC<{x: number; y: number; s?: number; flip?: boolean; t?: number; run?: number; fall?: number}> = ({x, y, s = 1, flip, t = 0, run = 0, fall = 0}) => {
  const leg = (lx: number, ph: number) => <line x1={lx} y1={-34} x2={lx + Math.sin(t * 16 * run + ph) * 14 * run} y2={0} stroke={INK} strokeWidth={10} strokeLinecap="round" />;
  return (
    <g transform={`translate(${x} ${y + fall * fall * 900}) scale(${(flip ? -1 : 1) * s} ${s}) rotate(${fall * 70 + (run ? Math.sin(t * 16) * 3 : 0)})`}>
      {leg(-40, 0)}{leg(34, 2)}{leg(-20, 3)}{leg(52, 5)}
      <ellipse cx={0} cy={-70} rx={88} ry={54} fill="#E8A8A0" stroke={INK} strokeWidth={7} />
      <path d="M -86 -86 q -26 -10 -18 14 q 8 14 -10 16" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <circle cx={84} cy={-82} r={38} fill="#E8A8A0" stroke={INK} strokeWidth={7} />
      <path d="M 70 -116 l 10 -26 l 18 22 Z" fill="#D88A84" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <ellipse cx={118} cy={-76} rx={16} ry={20} fill="#D88A84" stroke={INK} strokeWidth={5} />
      <circle cx={116} cy={-80} r={3} fill={INK} /><circle cx={121} cy={-70} r={3} fill={INK} />
      <circle cx={92} cy={-94} r={5} fill={INK} />
    </g>
  );
};
const Shadows: React.FC<{t: number; from: [number, number]; to: [number, number]; p: number}> = ({t, from, to, p}) => (
  <g opacity={p > 0 && p < 1 ? 1 : 0}>{Array.from({length: 16}).map((_, i) => { const q = Math.min(1, Math.max(0, p * 1.4 - rnd(i) * 0.4)); const x = lerp(from[0], to[0] + (rnd(i + 1) - 0.5) * 500, q) + Math.sin(t * 6 + i) * 30; const y = lerp(from[1], to[1], q) - Math.sin(q * Math.PI) * (200 + rnd(i + 2) * 200); return <g key={i} opacity={q > 0 && q < 1 ? 0.85 : 0}><ellipse cx={x} cy={y} rx={46} ry={30} fill="#0b0612" filter="url(#dofS)" /><circle cx={x - 10} cy={y - 4} r={4} fill="#FFE27A" /><circle cx={x + 10} cy={y - 4} r={4} fill="#FFE27A" /></g>; })}</g>
);

/* 1 ------------------------------------------------------------------ night landing below the tombs */
const Landing: React.FC<SP> = (p) => {
  const {t} = p;
  const sc = p.w('screaming', p.dur - 1.5);
  const c: C3 = {x: lerp(-380, 60, k(t, 0, p.dur)) + Math.sin(t * 50) * shake(t, sc, 6, 3), y: lerp(140, 20, k(t, 0, p.dur)), z: lerp(1.2, 1.1, k(t, 0, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Night t={t} moonX={-300} />
      <rect x={-3000} y={300} width={6000} height={3000} fill="#1A2238" />
      <Tombs x={160} base={420} />
      <rect x={-3000} y={420} width={6000} height={3000} fill="#3A3448" />
      <g transform={`translate(${lerp(-900, -560, ko(t, 0, 2.2))} 0)`}><BigBoat x={0} y={470} night sail={false}>{[-260, -60, 140].map((x, i) => <Bean key={i} x={x} y={-100} s={0.75} look={i === 2 ? JESUS : AP[['simon', 'john'][i]]} t={t + i} face={{eyes: 'open', mouth: 'flat', look: [1, -0.3]}} dim={0.35} />)}</BigBoat></g>
      <Fog t={t} y={380} o={0.45} />
      <Fill fill="#0a0818" o={0.15} />
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ the man among the graves */
const TombsSc: React.FC<SP> = (p) => {
  const {t} = p;
  const ch = p.w('chain', p.dur * 0.6) + 0.1;
  const snap = t > ch;
  const c: C3 = {x: 120 + Math.sin(t * 55) * shake(t, ch, 10), y: 100, z: 1.25};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Night t={t} moonX={-420} />
      <Tombs x={-300} base={560} />
      <rect x={-3000} y={560} width={6000} height={3000} fill="#2E2A3A" />
      <Bean x={160} y={640} s={1.05} look={WILDMAN} t={t} shake={snap ? 2 : 1} sit={!snap} arms={snap ? 'up' : 'none'} face={{eyes: 'wide', mouth: snap ? 'open' : 'grit', brow: -0.9, look: [-1, 0]}} />
      {snap
        ? <g><Chain x={20} y={140} n={3} ang={-120} broken /><Chain x={300} y={140} n={3} ang={-60} broken />{Array.from({length: 5}).map((_, i) => { const u = t - ch; return <ellipse key={i} cx={160 + (i - 2) * 80 * u * 3} cy={120 - 300 * u + 900 * u * u} rx={14} ry={8} fill="none" stroke="#8A8A94" strokeWidth={6} />; })}</g>
        : <g><Chain x={60} y={460} n={7} ang={0} /><Chain x={60} y={480} n={6} ang={20} /></g>}
      <Fog t={t} y={600} o={0.35} />
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ he runs and falls at Jesus' feet; the demon speaks */
const Run: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  const feet = p.w('feet', s1 - 0.6);
  if (t < s1) {
    const fell = t > feet;
    const c: C3 = {x: lerp(-60, 180, k(t, 0, feet)), y: 280, z: 1.3};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Night t={t} moonX={300} />
        <rect x={-3000} y={300} width={6000} height={3000} fill="#1A2238" />
        <rect x={-3000} y={500} width={6000} height={3000} fill="#3A3448" />
        <Bean x={320} y={640} s={1.0} look={JESUS} t={t} flip face={{eyes: 'open', mouth: 'flat', look: [-1, 0.3]}} />
        <Bean x={fell ? 90 : lerp(-900, 60, lin(t, 0.2, feet))} y={640} s={0.95} look={WILDMAN} t={t} walk={fell ? 0 : 2} sit={fell} arms={fell ? 'up' : 'reach'} face={{eyes: 'wide', mouth: 'open', brow: -0.8, look: [1, fell ? -1 : 0]}} />
        <Fog t={t} y={620} o={0.3} />
      </Cam>
    );
  }
  const c: C3 = {x: Math.sin(t * 40) * 4, y: -20, z: lerp(2.0, 2.25, k(t, s1, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="#0c0812" /><Glow x={0} y={600} r={800} o={0.25} />
      {Array.from({length: 10}).map((_, i) => { const a = (i / 10) * Math.PI * 2 + t * 0.6; return <circle key={i} cx={Math.cos(a) * 260} cy={-60 + Math.sin(a) * 300} r={110} fill="#05030a" opacity={0.6} filter="url(#dofS)" />; })}
      <Bust x={0} y={0} look={WILDMAN} t={t} face={{eyes: 'wide', mouth: 'open', brow: -1, look: [1, 0]}} />
      <Fill fill="#3a0a14" o={0.25} />
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ "What is your name?" */
const Name: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: -20, z: lerp(2.0, 2.15, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Night t={t} moonX={-380} />
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t > 0.3 && t < p.dur - 0.5 && Math.sin(t * 12) > 0 ? 'open' : 'flat', brow: 0.4, look: [1, 0.3]}} />
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ "My name is Legion, for we are many" */
const Legion: React.FC<SP> = (p) => {
  const {t} = p;
  const lg = p.w('legion', 0.8), many = p.w('many', p.dur * 0.7);
  const n = Math.floor(lerp(2, 60, ko(t, lg, many + 0.4)));
  const c: C3 = {x: 0, y: -20, z: lerp(2.1, 1.7, k(t, 0, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="#06040a" />
      {Array.from({length: n}).map((_, i) => { const x = (rnd(i) - 0.5) * 1300, y = (rnd(i + 7) - 0.62) * 1500; return Math.abs(x) < 170 && y > -260 && y < 600 ? null : <g key={i} opacity={0.5 + 0.5 * Math.sin(t * 3 + i)}>{[-1, 1].map((d) => <ellipse key={d} cx={x + d * 18} cy={y} rx={9} ry={4} fill="#FFE27A" />)}</g>; })}
      <Bust x={0} y={0} look={WILDMAN} t={t} face={{eyes: 'wide', mouth: Math.sin(t * 10) > 0 ? 'open' : 'grit', brow: -1, look: [0, 0]}} />
      <Fill fill="#2a0612" o={0.2} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ the herd on the hill; "Send us into the pigs" */
const Hill: React.FC<{t: number}> = ({t}) => (
  <g>
    <Night t={t} moonX={-200} />
    <rect x={-3000} y={360} width={6000} height={3000} fill="#1A2238" />
    <path d="M -3000 900 L -3000 120 Q -600 0 300 120 L 520 160 L 600 900 Z" fill="#3E4A3E" stroke={INK} strokeWidth={8} />
  </g>
);
const PIGS: [number, number, number][] = Array.from({length: 13}).map((_, i) => [-860 + (i % 7) * 175 + (i >= 7 ? 90 : 0), 150 + (i >= 7 ? 90 : 0) + (i % 2) * 14, 0.7 + (i % 3) * 0.08]);
const PigsSc: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  if (t < s1) {
    const c: C3 = {x: lerp(-480, -260, t / s1), y: 140, z: 1.55};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Hill t={t} />
        {PIGS.map(([x, y, s], i) => <Pig key={i} x={x + Math.sin(t * 0.7 + i) * 10} y={y} s={s} flip={i % 3 === 0} t={t} />)}
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: -20, z: lerp(2.1, 2.25, k(t, s1, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="#08060e" />
      <Bust x={0} y={0} look={WILDMAN} t={t} face={{eyes: 'half', mouth: Math.sin(t * 10) > 0 ? 'open' : 'flat', brow: -1, look: [1, 0]}} />
      {Array.from({length: 14}).map((_, i) => <ellipse key={i} cx={-300 + (rnd(i) - 0.5) * 700} cy={-200 + (rnd(i + 3) - 0.5) * 900} rx={8} ry={4} fill="#FFE27A" opacity={0.6} />)}
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ THE RUSH: the herd off the cliff into the sea */
const Rush: React.FC<SP> = (p) => {
  const {t} = p;
  const rs = p.w('rushed', p.dur * 0.4), sea = p.w('sea', p.dur * 0.75);
  const fly = ko(t, 0.2, rs);
  const c: C3 = {x: lerp(-700, 420, k(t, 0.2, sea)) + Math.sin(t * 50) * shake(t, sea + 0.15, 14, 3), y: lerp(140, 420, k(t, rs, sea + 0.4)), z: lerp(1.35, 1.05, k(t, rs, sea))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Hill t={t} />
      <Bean x={-1150} y={150} s={0.8} look={WILDMAN} t={t} sit face={{eyes: t > rs ? 'closed' : 'wide', mouth: 'open', brow: -0.5}} />
      <Bean x={-1000} y={150} s={0.85} look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', look: [1, 0]}} arms={t < rs ? 'point' : 'down'} />
      <Shadows t={t} from={[-1150, -150]} to={[-300, 60]} p={fly} />
      {PIGS.map(([x, y, s], i) => {
        const go = lin(t, rs - 0.1 + i * 0.05, rs + 0.4 + i * 0.05);
        const px = x + go * (900 + i * 60) * Math.min(1, lin(t, rs, sea + 0.3) * 1.3);
        const fall = px > 560 ? Math.min(1.2, (px - 560) / 500) : 0;
        return <Pig key={i} x={Math.min(px, 640 + fall * 120)} y={y} s={s} t={t} run={go > 0 ? 1 : 0} fall={fall} />;
      })}
      {t > sea ? Array.from({length: 26}).map((_, i) => { const u = t - sea - rnd(i) * 0.3; if (u < 0) return null; return <circle key={i} cx={760 + (rnd(i + 1) - 0.5) * 500 + (rnd(i + 2) - 0.5) * 500 * u} cy={800 - 900 * u + 1500 * u * u} r={10 + rnd(i) * 16} fill="#BFDCEF" stroke={INK} strokeWidth={3} opacity={Math.max(0, 1 - u)} />; }) : null}
      <rect x={-3000} y={820} width={6000} height={3000} fill="#16203A" />
    </Cam>
  );
};

/* 8 ------------------------------------------------------------------ morning: sitting, dressed, in his right mind */
const Town: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-220, 100, k(t, 0, p.dur)), y: 200, z: 1.2};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky /><Sea t={t} y={-80} />
      <rect x={-3000} y={300} width={6000} height={3000} fill="#C9A47A" />
      <Bean x={120} y={640} s={0.95} look={HEALED} t={t} sit face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />
      <Bean x={380} y={640} s={1.0} look={JESUS} t={t} flip face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
      {Array.from({length: 5}).map((_, i) => <Bean key={i} x={lerp(-1100, -560, ko(t, 0.2 + i * 0.25, 2.5 + i * 0.25)) - i * 150} y={660 + (i % 2) * 30} s={0.9} look={TOWN(i)} t={t + i * 0.3} walk={t < 2.5 + i * 0.25 ? 1.5 : 0} face={{eyes: 'wide', mouth: 'open', brow: -0.4, look: [1, 0]}} />)}
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ afraid; they beg him to leave */
const Afraid: React.FC<SP> = (p) => {
  const {t} = p;
  const lv = p.w('leave', p.dur * 0.7);
  const c: C3 = {x: 0, y: 250, z: 1.4};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky /><Sea t={t} y={-200} />
      <rect x={-3000} y={300} width={6000} height={3000} fill="#C9A47A" />
      {[-380, -130, 130, 380].map((x, i) => <Bean key={i} x={x + (t > lv ? (x > 0 ? 1 : -1) * 0 : 0)} y={640 + (i % 2) * 20} s={0.98} look={TOWN(i + 1)} t={t + i} arms={t > lv - 0.2 && i % 2 ? 'point' : 'cross'} face={{eyes: 'open', mouth: t > lv ? 'open' : 'frown', brow: -0.8, look: [i < 2 ? 1 : -1, 0]}} />)}
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- "Let me come with you" */
const Come: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 60, y: 260, z: 1.35};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky /><Sea t={t} y={-120} />
      <BigBoat x={380} y={420} sail><Bean x={-60} y={-100} s={0.85} look={JESUS} t={t} flip face={{eyes: 'open', mouth: 'flat', look: [-1, 0.3]}} /></BigBoat>
      <rect x={-3000} y={560} width={6000} height={3000} fill="#C9A47A" />
      <Bean x={-260} y={700} s={1.0} look={HEALED} t={t} arms="reach" face={{eyes: 'open', mouth: 'open', brow: -0.6, look: [1, -0.3]}} />
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- "Go home. Tell them…" */
const Home: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = p.w('tell', p.dur * 0.35) - 0.1;
  if (t < cut) {
    const c: C3 = {x: 0, y: -20, z: lerp(1.9, 2.05, t / cut)};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Sky /><g filter="url(#dof)"><Glow x={-300} y={-300} r={600} o={0.7} /></g>
        <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'smile', brow: 0.2, look: [-1, 0]}} />
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: lerp(0, 380, k(u, 0, p.dur - cut)), y: 280, z: lerp(1.45, 1.25, k(u, 0, p.dur - cut))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky />
      <g filter="url(#dof)"><circle cx={600} cy={-200} r={150} fill="#FFF0C8" /><Glow x={600} y={-200} r={700} o={0.8} />{[300, 560, 820, 1080].map((x, i) => <rect key={i} x={x} y={-80 - (i % 2) * 60} width={220} height={400} fill="#D9B48C" />)}</g>
      <rect x={-3000} y={320} width={6000} height={3000} fill="#B8946A" />
      <Bean x={lerp(-100, 520, lin(u, 0, p.dur - cut))} y={660} s={0.95} look={HEALED} t={t} walk={1.2} arms={Math.sin(t * 3) > 0.5 ? 'up' : 'none'} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 0, z: 1};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.5} />
      <circle cx={0} cy={420} r={240} fill="#FFE2B0" /><Glow x={0} y={420} r={800} o={0.6} />
      <rect x={-3000} y={580} width={6000} height={3000} fill="#3A4A6A" />
      <g transform={`translate(${lerp(-120, 60, t / p.dur)} 600) scale(0.32)`}><BigBoat x={0} y={0} sail /></g>
    </Cam>
  );
};

export const SCENES7: Record<string, React.FC<SP>> = {landing: Landing, tombs: TombsSc, run: Run, name: Name, legion: Legion, pigs: PigsSc, rush: Rush, town: Town, afraid: Afraid, come: Come, home: Home, end: End};
