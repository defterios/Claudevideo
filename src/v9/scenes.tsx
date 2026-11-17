import React from 'react';
import {ANDREW, Bust, Fig, INK, JAMES, JESUS, JOHNZ, LEPER, Look, MOTHER, P, POSSESSED, SHADOW, SIMON, ZEBEDEE, mix, walk} from '../v8/fig';
import {BIG, Boat, C3, Cam, Dust, FOOT, Fill, GREY, Glow, Ground, Mesa, Rock, SP, Sun, Wind, k, ko, lerp, lin, par, rnd} from '../v8/scenes';

/** Episode 2 — "Follow Me" (Mark 1:16-45). */
const Sea: React.FC<{c: C3; t: number; y?: number; sky?: string; dark?: number}> = ({c, t, y = 150, sky = 'skySea', dark = 0}) => (
  <>
    <Fill fill={`url(#${sky})`} />
    <g transform={par(c, 0.15)}><Sun x={480} y={y - 140} r={80} fill="#FFF0D0" /></g>
    <g transform={par(c, 0.3)}><path d={`M -1800 ${y} Q -1300 ${y - 120} -800 ${y - 30} Q -300 ${y - 140} 300 ${y - 40} Q 900 ${y - 130} 1800 ${y - 20} L 1800 ${y + 20} L -1800 ${y + 20} Z`} fill="#7E8FA6" opacity={0.85} /></g>
    <g transform={par(c, 0.55)}>
      <rect x={-BIG} y={y} width={BIG * 2} height={BIG} fill="#3F86A6" />
      <line x1={-BIG} y1={y} x2={BIG} y2={y} stroke="#D6F1F4" strokeWidth={6} />
      {Array.from({length: 30}).map((_, i) => { const yy = y + 30 + (i % 10) * 70 + rnd(i) * 20; const x = (rnd(i + 4) - 0.5) * 3000 + Math.sin(t * 1.1 + i) * 40; return <path key={i} d={`M ${x} ${yy} q 40 -12 80 0 t 80 0`} fill="none" stroke="#A9DCE4" strokeWidth={5} strokeLinecap="round" opacity={0.6} />; })}
    </g>
    {dark ? <Fill fill="#0d1028" o={dark} /> : null}
  </>
);
const Sand: React.FC<{y?: number; x?: number}> = ({y = FOOT, x = 200}) => (
  <path d={`M ${-BIG} ${y} L ${x} ${y} Q ${x + 160} ${y + 20} ${x + 260} ${y + 140} L ${x + 600} ${BIG} L ${-BIG} ${BIG} Z`} fill="#E6C795" stroke={INK} strokeWidth={8} />
);
const Shallows: React.FC<{y: number; t: number; o?: number; x0?: number}> = ({y, t, o = 0.86, x0}) => (
  <g clipPath={x0 !== undefined ? undefined : undefined}>
    {x0 !== undefined ? <defs><clipPath id={`sh${Math.round(x0)}`}><rect x={x0} y={-BIG} width={BIG * 2} height={BIG * 2} /></clipPath></defs> : null}
    <g clipPath={x0 !== undefined ? `url(#sh${Math.round(x0)})` : undefined}>
    <rect x={-BIG} y={y} width={BIG * 2} height={BIG} fill="#3F86A6" opacity={o} />
    <path d={`M ${-BIG} ${y} ${Array.from({length: 60}).map((_, i) => `Q ${-BIG + i * 107 + 26} ${y - 8 + Math.sin(t * 2 + i) * 4} ${-BIG + i * 107 + 53} ${y} T ${-BIG + (i + 1) * 107} ${y}`).join(' ')}`} fill="none" stroke="#D6F1F4" strokeWidth={6} />
    </g>
  </g>
);
/** a fishing net held between the hands (x0,y0)-(x1,y1), sagging by `sag`. */
const Net: React.FC<{x0: number; y0: number; x1: number; y1: number; sag: number; o?: number}> = ({x0, y0, x1, y1, sag, o = 1}) => {
  const rows = 6, cols = 9;
  const pt = (u: number, v: number): [number, number] => [lerp(x0, x1, u), lerp(y0, y1, u) + Math.sin(u * Math.PI) * sag * (0.3 + v) + v * 70];
  const lines: string[] = [];
  for (let r = 0; r <= rows; r++) lines.push(Array.from({length: cols + 1}).map((_, i) => { const p = pt(i / cols, r / rows); return `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`; }).join(' '));
  for (let i = 0; i <= cols; i++) lines.push(Array.from({length: rows + 1}).map((_, r) => { const p = pt(i / cols, r / rows); return `${r ? 'L' : 'M'} ${p[0]} ${p[1]}`; }).join(' '));
  return <g opacity={o}>{lines.map((d, i) => <path key={i} d={d} fill="none" stroke="#C8A86A" strokeWidth={4} />)}{Array.from({length: cols + 1}).map((_, i) => { const p = pt(i / cols, 1); return <circle key={i} cx={p[0]} cy={p[1]} r={7} fill="#6f7178" stroke={INK} strokeWidth={3} />; })}</g>;
};
const throwPose = (t: number) => { const ph = (t * 0.55) % 1; return mix(P.hammerDn, P.armsOpen, ph < 0.5 ? k(ph, 0.1, 0.4) : 1 - k(ph, 0.6, 0.95)); };
const Scroll = (<g transform="rotate(90)"><rect x={-60} y={-14} width={120} height={28} fill="#F3E3BC" stroke={INK} strokeWidth={5} /><rect x={-72} y={-20} width={16} height={40} rx={6} fill="#8a5f3a" stroke={INK} strokeWidth={4} /><rect x={56} y={-20} width={16} height={40} rx={6} fill="#8a5f3a" stroke={INK} strokeWidth={4} /></g>);
const Bowl = (<g transform="rotate(90)"><path d="M -40 -6 Q 0 46 40 -6 Z" fill="#B5683E" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d="M -10 -14 q 6 -12 0 -24 M 10 -14 q 6 -12 0 -24" fill="none" stroke="#fff" strokeWidth={4} opacity={0.6} /></g>);
const flash = (t: number, at: number, len = 0.12) => t > at && t < at + len;
const shakeAt = (t: number, at: number, amp = 26, decay = 3.2) => (t > at ? Math.exp(-(t - at) * decay) * amp : 0);
const Rings: React.FC<{t: number; at: number; x?: number; y?: number; col?: string}> = ({t, at, x = 0, y = -150, col = '#fff'}) => (
  <g>{[0, 1, 2].map((i) => { const r = (t - at - i * 0.12) * 2300; return r > 0 ? <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={col} strokeWidth={36 - i * 10} opacity={Math.max(0, 0.9 - (t - at) * 1.1)} /> : null; })}</g>
);
const Aura: React.FC<{x: number; y: number; t: number; o: number; s?: number}> = ({x, y, t, o, s = 1}) => (
  <g opacity={o}>{Array.from({length: 14}).map((_, i) => { const a = (i / 14) * Math.PI * 2 + t * 0.8; const r = (180 + Math.sin(t * 3 + i) * 50) * s; return <circle key={i} cx={x + Math.cos(a) * r * 0.6} cy={y + Math.sin(a) * r} r={(70 + rnd(i) * 60) * s} fill="#0b0510" opacity={0.55} />; })}</g>
);
const Lamp: React.FC<{x: number; y: number; t: number; i: number}> = ({x, y, t, i}) => (
  <g><line x1={x} y1={-BIG} x2={x} y2={y - 20} stroke={INK} strokeWidth={4} /><Glow x={x} y={y} r={220 + Math.sin(t * 7 + i) * 12} o={0.7} /><path d={`M ${x - 26} ${y - 14} Q ${x} ${y + 22} ${x + 26} ${y - 14} Z`} fill="#8a5a33" stroke={INK} strokeWidth={5} /><path d={`M ${x} ${y - 16} q -8 -16 0 -30 q 8 14 0 30`} fill="#FFD36A" /></g>
);
const Synagogue: React.FC<{c: C3; t: number; tint?: string; to?: number}> = ({c, t, tint, to = 0}) => (
  <>
    <Fill fill="url(#wallStone)" />
    <g transform={par(c, 0.6)}>
      {Array.from({length: 9}).map((_, i) => <rect key={i} x={-1700 + i * 420} y={-BIG} width={110} height={BIG + FOOT} fill="#C2A27C" stroke={INK} strokeWidth={8} />)}
      {Array.from({length: 9}).map((_, i) => <rect key={'c' + i} x={-1716 + i * 420} y={-560} width={142} height={40} fill="#D8BC94" stroke={INK} strokeWidth={6} />)}
      {[-1200, -360, 480, 1320].map((x, i) => <Lamp key={i} x={x} y={-330} t={t} i={i} />)}
    </g>
    <Ground fill="#8C6C52" />
    {tint ? <Fill fill={tint} o={to} /> : null}
  </>
);
const Crowd: React.FC<{t: number; xs: number[]; y?: number; face?: 'half' | 'wide'; lookTo?: number; scale?: number; lean?: number}> = ({t, xs, y = FOOT + 150, face = 'half', lookTo = 0, scale = 1, lean = 0}) => (
  <g>{xs.map((x, i) => <Fig key={i} x={x} y={y} pose={{...P.sit, lean: (P.sit.lean ?? 0) + lean}} look={GREY(i + 1)} t={t + i} scale={scale} flip={x > lookTo} face={{eyes: face, mouth: face === 'wide' ? 'open' : 'flat', look: [1, 0]}} />)}</g>
);

/* 1 ------------------------------------------------------------------ the shore */
const Shore: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = p.segs[1] - 0.12;
  if (t < cut) {
    const c: C3 = {x: lerp(-60, 170, k(t, 0, cut)), y: 60, z: lerp(1.12, 1.22, t / cut)};
    const jx = lerp(-480, -240, k(t, 0, cut - 0.6));
    const th = (t * 0.55) % 1;
    return (
      <Cam c={c} p={p}>
        <Sea c={c} t={t} />
        <Sand x={-140} />
        <Fig x={jx} y={FOOT} pose={jx > -330 ? P.stand : walk(t, 1.4)} look={JESUS} t={t} face={{eyes: 'half', mouth: 'smile', look: [1, 0]}} />
        <Fig x={330} y={FOOT + 60} pose={throwPose(t)} look={SIMON} t={t} scale={0.95} face={{eyes: 'half', mouth: 'frown', brow: -0.3, look: [1, 0]}} />
        <Fig x={640} y={FOOT + 60} pose={throwPose(t + 0.7)} look={ANDREW} t={t} scale={0.9} face={{eyes: 'half', mouth: 'flat', look: [1, 0]}} />
        <Net x0={440} y0={FOOT - 200 + 260 * th} x1={lerp(500, 980, ko(th, 0.2, 0.5))} y1={lerp(-60, FOOT + 60, k(th, 0.3, 0.8))} sag={60} o={th < 0.9 ? 0.9 : 0} />
        <Shallows y={FOOT - 40} t={t} x0={60} />
      </Cam>
    );
  }
  // up all night, and nothing: two tired faces, an empty net
  const u = t - cut;
  const c: C3 = {x: 0, y: -40, z: lerp(1.25, 1.4, u / (p.dur - cut))};
  const empty = ko(t, p.w('nothing') - 0.2, p.w('nothing') + 0.4);
  return (
    <Cam c={c} p={p}>
      <Sea c={c} t={t} y={90} sky="skyDusk" dark={0.25 * (1 - u / 3)} />
      <Bust x={-200} y={-60} look={SIMON} t={t} tilt={-4} face={{eyes: empty > 0.5 ? 'open' : 'half', mouth: 'frown', brow: -0.6, look: [1, 1]}} />
      <Bust x={210} y={-30} look={ANDREW} t={t + 1} tilt={5} scale={0.92} face={{eyes: empty > 0.5 ? 'open' : 'half', mouth: 'frown', brow: -0.4, look: [-1, 1]}} />
      <g transform={`translate(0 ${lerp(320, 60, empty)})`}><Net x0={-360} y0={80} x1={360} y1={80} sag={90} /></g>
      <Shallows y={340} t={t} o={0.9} />
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ "Follow me" */
const Call: React.FC<SP> = (p) => {
  const {t} = p;
  const f = p.w('follow');
  const cut = p.w('fishers', p.dur * 0.6) - 0.15;
  const pulse = t > f ? Math.exp(-(t - f) * 4) : 0;
  if (t < cut) {
    const c: C3 = {x: 30, y: lerp(10, -90, k(t, 0, cut)), z: lerp(1.05, 1.5, k(t, 0, cut))};
    return (
      <Cam c={c} p={p}>
        <Sea c={c} t={t} />
        <Sand x={300} />
        {Array.from({length: 6}).map((_, i) => <polygon key={i} points={`${-500 + i * 40},-1600 ${-440 + i * 40},-1600 ${(i - 2) * 300 + 120},1300 ${(i - 2) * 300 - 120},1300`} fill="#FFF3D0" opacity={0.08 + pulse * 0.12} />)}
        <Glow x={0} y={-180} r={420 + pulse * 200} o={0.25 + pulse * 0.4} />
        <Fig x={0} y={FOOT} pose={mix(P.stand, P.offer, k(t, f - 0.4, f + 0.2))} look={JESUS} t={t} face={{eyes: 'open', mouth: t > f ? 'smile' : 'flat', brow: 0.2, look: [1, 0]}} />
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: 0, y: -30, z: lerp(1.6, 1.75, u / (p.dur - cut))};
  return (
    <Cam c={c} p={p}>
      <Sea c={c} t={t} y={60} />
      <Bust x={0} y={0} look={SIMON} t={t} face={{eyes: 'wide', mouth: u > 0.6 ? 'smile' : 'open', brow: -0.6, look: [-1, 0]}} />
      <Glow x={-600} y={-100} r={500} o={0.5} />
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ the nets drop */
const Drop: React.FC<SP> = (p) => {
  const {t} = p;
  const d = p.w('dropped');
  const fall = ko(t, d, d + 0.7);
  const turn = t > d + 0.9;
  const c: C3 = {x: lerp(80, 0, t / p.dur), y: lerp(60, 30, t / p.dur), z: lerp(1.3, 1.15, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      <Sea c={c} t={t} />
      <Fig x={turn ? lerp(-140, -600, lin(t, d + 0.9, p.dur)) : -140} y={FOOT + 60} flip={turn} pose={turn ? walk(t, 1.5) : mix(P.reach, P.stand, fall)} look={SIMON} t={t} face={{eyes: 'open', mouth: 'smile', brow: 0.2, look: [-1, 0]}} />
      <Fig x={turn ? lerp(190, -280, lin(t, d + 1.05, p.dur)) : 190} y={FOOT + 60} flip={turn} pose={turn ? walk(t + 0.3, 1.5) : mix(P.reach, P.stand, fall)} look={ANDREW} t={t} scale={0.95} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
      <g opacity={1 - lin(t, d + 0.5, d + 1.2)}><Net x0={-80} y0={lerp(40, FOOT + 40, fall)} x1={250} y1={lerp(40, FOOT + 50, fall)} sag={lerp(60, 10, fall)} /></g>
      <Shallows y={FOOT - 40} t={t} />
      {t > d + 0.55 ? [0, 1].map((i) => { const r = (t - d - 0.55 - i * 0.2) * 420; return r > 0 ? <ellipse key={i} cx={80} cy={FOOT - 30} rx={140 + r} ry={18 + r * 0.06} fill="none" stroke="#E6FBF6" strokeWidth={6} opacity={Math.max(0, 0.9 - r / 700)} /> : null; }) : null}
      {t > d + 0.5 && t < d + 1.1 ? Array.from({length: 12}).map((_, i) => { const u = t - d - 0.5; return <circle key={i} cx={80 + (rnd(i) - 0.5) * 300 + (rnd(i) - 0.5) * 400 * u} cy={FOOT - 40 - 500 * u + 900 * u * u} r={8} fill="#D6F1F4" stroke={INK} strokeWidth={3} />; }) : null}
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ Zebedee's boat */
const BigBoat: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 1.1) * 1.2})`}>
    <path d="M -420 -120 L 420 -120 Q 380 40 200 60 L -220 60 Q -400 40 -420 -120 Z" fill="#8a5a33" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    {[-70, -20].map((yy, i) => <line key={i} x1={-400} y1={yy} x2={400} y2={yy} stroke={INK} strokeWidth={4} opacity={0.35} />)}
    <line x1={40} y1={-120} x2={40} y2={-760} stroke={INK} strokeWidth={14} />
    <path d="M 52 -740 Q 260 -520 52 -240 Z" fill="#EFE2C2" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  </g>
);
const Zebedee: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  const called = p.w('called', s1 + 0.3), left = p.w('left', s1 + 1.2);
  const go = ko(t, left, left + 1.6);
  const proc = p.w('everything', p.dur - 1) + 0.4;
  if (t > proc) {
    // the five walk on together
    const u = t - proc;
    const c: C3 = {x: u * 260, y: 10, z: 0.9};
    return (
      <Cam c={c} p={p}>
        <Sea c={c} t={t} sky="skyDusk" />
        <Sand x={2600} />
        {[JESUS, SIMON, ANDREW, JAMES, JOHNZ].map((L, i) => <Fig key={i} x={u * 260 + 380 - i * 210} y={FOOT} pose={walk(t + i * 0.27, 1.4)} look={L} t={t + i} scale={0.9 - i * 0.02} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />)}
      </Cam>
    );
  }
  const c: C3 = {x: lerp(-260, 160, k(t, 0, s1)) + (t > s1 ? lerp(0, -200, k(t, s1, proc)) : 0), y: 30, z: 1.0};
  const out = (i: number) => ko(t, left + i * 0.25, left + 0.6 + i * 0.25);
  return (
    <Cam c={c} p={p}>
      <Sea c={c} t={t} />
      <Sand x={700} />
      <Fig x={lerp(-700, -420, k(t, 0, 2.2))} y={FOOT} pose={t < 2.2 ? walk(t, 1.3) : t > called - 0.1 && t < left + 1 ? P.command : P.stand} look={JESUS} t={t} face={{eyes: 'open', mouth: t > called ? 'smile' : 'flat', look: [1, 0]}} />
      {[[-680, ANDREW], [-860, SIMON]].map(([x, L], i) => <Fig key={i} x={x as number} y={FOOT} pose={t < 2.2 ? walk(t + i, 1.3) : P.stand} look={L as Look} t={t} scale={0.92} face={{eyes: 'open', mouth: 'flat', look: [1, 0]}} />)}
      {/* James & John step out of the boat and walk to him */}
      {[JAMES, JOHNZ].map((L, i) => {
        const o = out(i);
        const x = lerp(260 + i * 210, -150 + i * 150, ko(t, left + 0.5 + i * 0.25, left + 2.2 + i * 0.25));
        return <Fig key={i} x={x} y={lerp(FOOT - 120, FOOT, o)} flip={o > 0.3} pose={o > 0.3 && o < 1 ? walk(t, 1.6) : t > left + 2.2 ? P.stand : mix(P.hammerDn, P.stand, o)} look={L} t={t + i} scale={0.9} face={{eyes: t > called ? 'wide' : 'half', mouth: t > called ? 'smile' : 'flat', look: [-1, 0]}} />;
      })}
      <Fig x={640} y={FOOT - 120} flip pose={t > left + 0.8 ? mix(P.hammerDn, P.armsOpen, k(t, left + 0.8, left + 1.4)) : P.hammerDn} look={ZEBEDEE} t={t} scale={0.9} face={{eyes: t > left + 0.6 ? 'open' : 'half', mouth: t > left + 1.2 ? 'smile' : 'flat', brow: -0.2, look: [-1, 0]}} />
      <BigBoat x={480} y={FOOT + 20} t={t} />
      <Net x0={300} y0={FOOT - 140} x1={620} y1={FOOT - 140} sag={40} o={1 - go * 0.2} />
      <Shallows y={FOOT + 30} t={t} o={0.75} />
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ teaching in the synagogue */
const Teach: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  if (t < s1) {
    const c: C3 = {x: 0, y: lerp(120, 0, k(t, 0, s1)), z: lerp(0.78, 0.98, k(t, 0, s1))};
    return (
      <Cam c={c} p={p}>
        <Synagogue c={c} t={t} />
        <Fig x={0} y={FOOT - 30} pose={mix(P.offer, P.armsOpen, 0.5 + 0.5 * Math.sin(t * 2))} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 9) > 0 ? 'open' : 'flat', look: [0, 0]}} hold={Scroll} />
        <rect x={-150} y={FOOT - 30} width={300} height={40} fill="#B08A64" stroke={INK} strokeWidth={7} />
        <Crowd t={t} xs={[-800, -560, -320, 330, 570, 810]} y={FOOT + 330} lookTo={0} />
      </Cam>
    );
  }
  const like2 = p.w('someone', s1 + 1.4) - 0.25;
  if (t < like2) {
    // the scholars: dry, grey, reading
    const c: C3 = {x: 0, y: 0, z: 1.15};
    return (
      <Cam c={c} p={p}>
        <Synagogue c={c} t={t} tint="#3a3640" to={0.45} />
        {[-210, 210].map((x, i) => <Fig key={i} x={x} y={FOOT} flip={i === 1} pose={P.reach} look={{...GREY(i + 4), tunic: '#EDE6D6', sash: '#5B6EA0'}} t={t + i} face={{eyes: 'half', mouth: 'flat', look: [0, 1]}} hold={Scroll} />)}
      </Cam>
    );
  }
  const u = t - like2;
  const c: C3 = {x: 0, y: -20, z: lerp(1.55, 1.75, u / (p.dur - like2))};
  return (
    <Cam c={c} p={p}>
      <Synagogue c={c} t={t} />
      {Array.from({length: 7}).map((_, i) => <polygon key={i} points={`${-60 + i * 20},-1700 ${60 + i * 20},-1700 ${(i - 3) * 360 + 170},1300 ${(i - 3) * 360 - 170},1300`} fill="#FFF6D0" opacity={0.12} />)}
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', brow: 0.6}} />
      <Bust x={-430} y={300} look={GREY(1)} t={t + 1} scale={0.8} face={{eyes: 'wide', mouth: 'open', look: [1, -1]}} />
      <Bust x={430} y={320} look={GREY(2)} t={t + 2} scale={0.8} face={{eyes: 'wide', mouth: 'open', look: [-1, -1]}} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ the man screams */
const Demon: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  const sc = p.w('screaming');
  if (t < s1) {
    const up = ko(t, sc - 0.1, sc + 0.3);
    const sh = up * 6 + shakeAt(t, sc, 22);
    const c: C3 = {x: Math.sin(t * 70) * shakeAt(t, sc, 22), y: 40, z: lerp(0.95, 1.1, up)};
    return (
      <Cam c={c} p={p}>
        <Synagogue c={c} t={t} tint="#5a0e14" to={up * 0.45} />
        <Aura x={150} y={-140} t={t} o={up} />
        <Crowd t={t} xs={[-760, -520, -280, 600, 840]} y={FOOT + 260} lookTo={150} face={up > 0.5 ? 'wide' : 'half'} lean={-up * 20} />
        <Fig x={150} y={FOOT + 260} pose={mix(P.sit, P.armsOpen, up)} look={POSSESSED} t={t} shake={sh} face={up > 0.5 ? {eyes: 'wide', mouth: 'open', brow: -1} : {eyes: 'half', mouth: 'flat'}} />
      </Cam>
    );
  }
  const u = t - s1;
  const c: C3 = {x: Math.sin(t * 50) * 5, y: -10, z: lerp(1.6, 1.95, u / (p.dur - s1))};
  return (
    <Cam c={c} p={p}>
      <Fill fill="#1a0610" /><Glow x={0} y={600} r={900} o={0.35} id="gGold" /><Fill fill="#7a0d14" o={0.35} />
      <Aura x={0} y={-60} t={t} o={1} s={1.4} />
      <Bust x={0} y={0} look={POSSESSED} t={t} shake={4} tilt={Math.sin(t * 3) * 6} face={{eyes: 'wide', mouth: 'grit', brow: -1}} />
      {[-30, 30].map((x, i) => <g key={i}><ellipse cx={x} cy={-2} rx={22} ry={18} fill="#fff" /><circle cx={x} cy={-2} r={60} fill="url(#gWhite)" opacity={0.6} /></g>)}
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ "Be quiet. Come out of him." */
const Rebuke: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  const q = p.w('quiet'), o = p.w('out') + 0.1;
  if (t < s1) {
    const sh = shakeAt(t, o, 30);
    const c: C3 = {x: Math.sin(t * 71) * sh, y: Math.cos(t * 83) * sh, z: 1.0};
    const rip = ko(t, o, o + 1.2);
    return (
      <Cam c={c} p={p}>
        <Synagogue c={c} t={t} tint="#5a0e14" to={0.4 * (1 - rip)} />
        <Aura x={260} y={-140} t={t} o={1 - rip} />
        <Fig x={-280} y={FOOT} pose={t > q - 0.2 ? P.command : P.firm} look={JESUS} t={t} face={{eyes: 'open', brow: 0.9, mouth: t > q - 0.1 ? 'open' : 'flat', look: [1, 0]}} />
        <Fig x={260} y={FOOT} flip pose={mix(P.armsOpen, P.stagger, 0.5 + 0.5 * Math.sin(t * 9))} look={POSSESSED} t={t} shake={(1 - rip) * 10 + 3} face={{eyes: 'wide', mouth: 'open', brow: -1}} />
        {t > o ? <Fig x={260 + rip * 500} y={FOOT - rip * 1400} pose={P.armsOpen} look={SHADOW} t={t} rot={rip * 70} opacity={1 - rip} scale={1 + rip * 0.6} face={{eyes: 'wide'}} /> : null}
        <Rings t={t} at={o} x={260} />
        {flash(t, o) || flash(t, q, 0.06) ? <Fill fill="#fff" o={0.85} /> : null}
      </Cam>
    );
  }
  const g = p.w('gone');
  const calm = ko(t, g, g + 0.6);
  const c: C3 = {x: 120, y: lerp(30, -20, k(t, s1, p.dur)), z: lerp(1.15, 1.35, k(t, s1, p.dur))};
  return (
    <Cam c={c} p={p}>
      <Synagogue c={c} t={t} />
      <Glow x={200} y={-80} r={500} o={calm * 0.8} />
      <Fig x={-300} y={FOOT} pose={P.firm} look={JESUS} t={t} face={{eyes: 'open', mouth: calm > 0.5 ? 'smile' : 'flat', look: [1, 0.5]}} />
      <Fig x={220} y={FOOT} flip pose={calm > 0 ? mix(P.kneel, P.kneel, 1) : mix(P.stagger, P.kneel, k(t, s1, g))} look={POSSESSED} t={t} shake={(1 - calm) * 6} face={calm > 0.4 ? {eyes: 'open', mouth: 'smile', brow: 0.2, look: [-1, -1]} : {eyes: 'closed', mouth: 'open', brow: -0.8}} />
    </Cam>
  );
};

/* 8 ------------------------------------------------------------------ Simon's mother-in-law */
const House: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  const hand = p.w('hand', s1 + 0.8), left = p.w('left', s1 + 2);
  const heal = ko(t, left - 0.1, left + 0.6);
  const Room: React.FC<{c: C3}> = ({c}) => (
    <>
      <Fill fill="url(#roomNight)" />
      <g transform={par(c, 0.7)}>
        <rect x={-1700} y={-700} width={3400} height={FOOT + 700} fill="#6A4A3A" opacity={0.6} />
        <rect x={-860} y={-420} width={240} height={300} fill="#1a1630" stroke={INK} strokeWidth={8} />
        <circle cx={-740} cy={-330} r={30} fill="#E8ECF5" />
      </g>
      <Lamp x={520} y={-90} t={t} i={0} />
      <Ground fill="#5A3E30" />
    </>
  );
  if (t < s1) {
    const c: C3 = {x: lerp(-100, 60, k(t, 0, s1)), y: 80, z: lerp(1.05, 1.2, k(t, 0, s1))};
    return (
      <Cam c={c} p={p}>
        <Room c={c} />
        <rect x={-260} y={FOOT - 8} width={560} height={36} rx={10} fill="#C9B48A" stroke={INK} strokeWidth={6} />
        <Fig x={240} y={FOOT - 46} rot={-90} pose={{aB: [10, 20], aF: [30, 20], lB: [-4, 0], lF: [4, 0]}} look={MOTHER} t={0.05} shake={1.5} face={{eyes: 'closed', mouth: 'frown', brow: -0.6}} />
        <Fig x={-420} y={FOOT} pose={P.kneel} look={SIMON} t={t} face={{eyes: 'open', mouth: 'frown', brow: -0.6, look: [1, 1]}} />
        <Fill fill="#FF3B1F" o={0.12 + 0.06 * Math.sin(t * 5)} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${-200 + i * 120} ${FOOT - 40} q 20 -40 0 -80 q -20 -40 0 -80`} fill="none" stroke="#FF8A5C" strokeWidth={6} opacity={0.5} transform={`translate(0 ${-((t * 60 + i * 30) % 60)})`} />)}
      </Cam>
    );
  }
  const c: C3 = {x: lerp(0, 60, k(t, s1, p.dur)), y: 80, z: lerp(1.25, 1.1, k(t, s1, p.dur))};
  const up = ko(t, left + 0.4, left + 1.2);
  return (
    <Cam c={c} p={p}>
      <Room c={c} />
      <Glow x={160} y={-60} r={600} o={heal * 0.7} />
      <rect x={-260} y={FOOT - 8} width={560} height={36} rx={10} fill="#C9B48A" stroke={INK} strokeWidth={6} />
      <Fig x={-260} y={FOOT} pose={t > hand - 0.3 ? mix(P.kneel, {...P.kneel, aF: [80, 0]}, k(t, hand - 0.3, hand + 0.2)) : P.kneel} look={JESUS} t={t} face={{eyes: 'open', mouth: heal > 0.5 ? 'smile' : 'flat', look: [1, 1]}} />
      {up < 0.5 ? (
        <Fig x={240} y={FOOT - 46} rot={-90} opacity={1 - up * 2} pose={{aB: [10, 20], aF: [t > hand ? 160 : 30, 20], lB: [-4, 0], lF: [4, 0]}} look={MOTHER} t={0.05} face={heal > 0.3 ? {eyes: 'open', mouth: 'smile'} : {eyes: 'closed', mouth: 'frown', brow: -0.6}} />
      ) : (
        <Fig x={160} y={FOOT} flip pose={t > left + 1.8 ? P.offer : P.sit} look={MOTHER} t={t} opacity={Math.min(1, (up - 0.5) * 2 + 0.3)} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} hold={t > left + 1.8 ? Bowl : undefined} />
      )}
      <Fill fill="#FF3B1F" o={(1 - heal) * (0.12 + 0.06 * Math.sin(t * 5))} />
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ the whole town at the door */
const Door: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: lerp(-20, -120, k(t, 0, p.dur)), z: lerp(1.1, 0.62, k(t, 0, p.dur))};
  const n = Math.floor(lerp(4, 26, k(t, 0.2, p.dur - 0.6)));
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyDusk)" />
      <g transform={par(c, 0.2)}><Sun x={-420} y={60} r={90} fill="#FFD9A0" /></g>
      <g transform={par(c, 0.5)}>{[-1300, -800, 800, 1300].map((x, i) => <rect key={i} x={x - 200} y={FOOT - 300 - (i % 2) * 60} width={400} height={360 + (i % 2) * 60} fill="#B58B6A" stroke={INK} strokeWidth={7} />)}</g>
      <rect x={-330} y={-260} width={660} height={FOOT + 260} fill="#D9B48C" stroke={INK} strokeWidth={9} />
      <path d={`M -90 ${FOOT} L -90 -10 Q 0 -90 90 -10 L 90 ${FOOT} Z`} fill="#3a2418" stroke={INK} strokeWidth={8} />
      <Glow x={0} y={120} r={260} o={0.9} />
      <Ground fill="#9C7A5C" />
      {Array.from({length: n}).map((_, i) => {
        const side = i % 2 ? 1 : -1, row = Math.floor(i / 6);
        const x = side * (180 + (Math.floor(i / 2) % 3) * 170 + rnd(i) * 60), y = FOOT + 60 + row * 110;
        return i % 5 === 3
          ? <g key={i}><rect x={x - 110} y={y - 30} width={220} height={30} rx={8} fill="#C9B48A" stroke={INK} strokeWidth={5} /><Fig x={x + 60} y={y - 40} rot={-90} scale={0.7} pose={P.stand} look={GREY(i)} t={0.05} face={{eyes: 'closed', mouth: 'frown'}} /></g>
          : <Fig key={i} x={x} y={y} scale={0.82} flip={side > 0} pose={P.stand} look={GREY(i)} t={t + i} face={{eyes: 'open', mouth: 'flat', look: [1, -0.3]}} />;
      })}
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- the leper */
const Road: React.FC<{c: C3; t: number}> = ({c, t}) => (
  <>
    <Fill fill="url(#skyDesert)" />
    <g transform={par(c, 0.2)}><Sun x={420} y={-500} r={90} fill="#FFFBEA" /></g>
    <g transform={par(c, 0.5)}><Mesa x={-700} y={FOOT} w={520} h={300} fill="#C58A5C" shade="#A56C45" /><Mesa x={900} y={FOOT} w={480} h={260} fill="#C58A5C" shade="#A56C45" /></g>
    <Ground fill="#E3BD8C" />
    <Dust t={t} o={0.45} />
  </>
);
const Leper: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  const kn = p.w('knees');
  if (t < s1) {
    const c: C3 = {x: 0, y: 40, z: lerp(0.95, 1.1, k(t, 0, s1))};
    const fall = ko(t, kn - 0.3, kn + 0.2);
    return (
      <Cam c={c} p={p}>
        <Road c={c} t={t} />
        {[-760, -560, 560, 760].map((x, i) => <Fig key={i} x={x} y={FOOT + 40} flip={x > 0} pose={{...P.stand, lean: -14 * ko(t, 0.2, 0.8)}} look={GREY(i + 2)} t={t + i} scale={0.9} face={{eyes: 'wide', mouth: 'open', look: [x > 0 ? 1 : -1, 0]}} />)}
        <Fig x={-260} y={FOOT} pose={P.firm} look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', look: [1, 0.4]}} />
        <Fig x={lerp(380, 200, k(t, 0, kn))} y={FOOT} flip pose={fall > 0 ? mix(walk(t, 1), P.kneel, fall) : walk(t, 1)} look={LEPER} t={t} face={{eyes: 'open', mouth: 'frown', brow: -0.5, look: [-1, -1]}} />
        <Wind t={t} o={0.4} col="#FFF2D8" />
      </Cam>
    );
  }
  const u = t - s1;
  const c: C3 = {x: 0, y: -40, z: lerp(1.55, 1.8, u / (p.dur - s1))};
  return (
    <Cam c={c} p={p}>
      <Road c={c} t={t} />
      <Bust x={0} y={0} look={LEPER} t={t} tilt={-6} face={{eyes: 'open', mouth: 'frown', brow: -0.7, look: [0, -1]}} />
      {[0, 1].map((i) => { const ph = (t * 0.5 + i * 0.5) % 1; return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${i ? 34 : -34} ${10 + ph * 60}) scale(1.4)`} fill="#BFE9F2" stroke={INK} strokeWidth={2.5} opacity={1 - ph} />; })}
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- the touch */
const Touch: React.FC<SP> = (p) => {
  const {t} = p;
  const tc = p.w('touched'), cl = p.w('clean');
  const reach = k(t, tc - 0.8, tc);
  const heal = ko(t, cl, cl + 0.8);
  const sh = shakeAt(t, cl, 14);
  const c: C3 = {x: lerp(-40, 0, t / p.dur) + Math.sin(t * 61) * sh, y: lerp(40, 0, t / p.dur), z: lerp(1.15, 1.0, k(t, cl, p.dur))};
  return (
    <Cam c={c} p={p}>
      <Road c={c} t={t} />
      <Glow x={60} y={-120} r={700} o={heal * 0.9} id="gWhite" />
      {[-720, -540, 560, 740].map((x, i) => <Fig key={i} x={x} y={FOOT + 40} flip={x > 0} pose={{...P.stand, lean: t > tc ? -18 : -8}} look={GREY(i + 2)} t={t + i} scale={0.9} face={{eyes: t > tc ? 'wide' : 'half', mouth: t > tc ? 'open' : 'flat', look: [x > 0 ? -1 : 1, 0]}} />)}
      <Fig x={-200} y={FOOT} pose={mix(P.firm, {...P.reach, aF: [100, -10]}, reach)} look={JESUS} t={t} face={{eyes: 'open', mouth: t > cl - 0.2 ? 'smile' : 'flat', brow: 0.3, look: [1, 0.6]}} />
      <Fig x={200} y={FOOT} flip pose={heal > 0.6 ? mix(P.kneel, P.armsOpen, k(t, cl + 0.6, cl + 1.4)) : P.kneel} look={{...LEPER, spots: 1 - heal, skin: heal > 0.5 ? '#D9A07C' : LEPER.skin}} t={t} face={heal > 0.4 ? {eyes: 'open', mouth: 'smile', brow: 0.2, look: [-1, -1]} : {eyes: t > tc ? 'wide' : 'closed', mouth: 'open', brow: -0.5}} />
      <Rings t={t} at={cl} x={160} y={-200} col="#FFF6D8" />
      {heal > 0 ? <Dust t={t} o={heal} col="#FFF6DC" up n={50} /> : null}
      {flash(t, cl) ? <Fill fill="#fff" o={0.8} /> : null}
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 0, z: 1};
  const sil: Look = {skin: '#1b1016', hair: '#1b1016', tunic: '#1b1016', style: 'long', beard: false};
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyDusk)" /><Fill fill="#1a0d1c" o={0.3} />
      <Sun x={0} y={420} r={150} fill="#FFE2B0" />
      <rect x={-BIG} y={470} width={BIG * 2} height={BIG} fill="#2b2a44" />
      <Boat x={420} y={480} s={1.2} t={t} />
      <path d={`M ${-BIG} 540 Q -600 470 0 520 Q 700 460 ${BIG} 540 L ${BIG} ${BIG} L ${-BIG} ${BIG} Z`} fill="#1b1016" />
      {[0, 1, 2, 3, 4].map((i) => <Fig key={i} x={lerp(-60, 140, t / p.dur) - i * 80} y={520} pose={walk(t + i * 0.3, 1.2)} look={sil} t={0.05} face={{eyes: 'closed', mouth: 'none'}} scale={0.42 - i * 0.015} />)}
    </Cam>
  );
};

export const SCENES2: Record<string, React.FC<SP>> = {shore: Shore, call: Call, drop: Drop, zebedee: Zebedee, synagogue: Teach, demon: Demon, rebuke: Rebuke, house: House, door: Door, leper: Leper, touch: Touch, end: End};
