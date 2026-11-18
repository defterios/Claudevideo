import React from 'react';
import {Bust, FRIENDS, Fig, INK, JESUS, LEVI, Look, P, PARALYTIC, Pose, SCRIBE, mix, walk} from '../v8/fig';
import {BIG, C3, Cam, Dust, FOOT, Fill, GREY, Glow, Ground, SP, Stars, Sun, k, ko, lerp, lin, par, rnd} from '../v8/scenes';

/** Episode 3 — "Through the Roof" (Mark 2:1-17). */
export const ROOF = -260; // roof line of the house
const CARRY: Pose = {lean: 2, aB: [-176, 0], aF: [176, 0], lB: [-6, 0], lF: [6, 0]};
const LIE: Pose = {aB: [8, 6], aF: [-8, -6], lB: [-3, 0], lF: [3, 0]};
const flash = (t: number, at: number, len = 0.12) => t > at && t < at + len;
const shakeAt = (t: number, at: number, amp = 24, decay = 3.2) => (t > at ? Math.exp(-(t - at) * decay) * amp : 0);

export const Mat: React.FC<{x: number; y: number; t: number; face?: 'closed' | 'open' | 'wide'; smile?: boolean; glow?: number}> = ({x, y, t, face = 'open', smile, glow = 0}) => (
  <g>
    {glow > 0 ? <Glow x={x - 60} y={y - 40} r={360} o={glow} id="gWhite" /> : null}
    <Fig x={x + 200} y={y - 44} rot={-90} pose={LIE} look={PARALYTIC} t={0.05} face={{eyes: face, mouth: smile ? 'smile' : 'flat', look: [0, -1]}} scale={0.95} />
    <rect x={x - 250} y={y - 8} width={500} height={26} rx={8} fill="#C9B07A" stroke={INK} strokeWidth={6} />
    {[-220, -110, 0, 110, 220].map((d, i) => <line key={i} x1={x + d} y1={y - 6} x2={x + d} y2={y + 16} stroke="#8a6a3a" strokeWidth={4} />)}
  </g>
);
const Street: React.FC<{c: C3; t: number; sky?: string; dark?: number}> = ({c, t, sky = 'skyDesert', dark = 0}) => (
  <>
    <Fill fill={`url(#${sky})`} />
    <g transform={par(c, 0.15)}><Sun x={-460} y={-560} r={80} fill="#FFFBEA" /></g>
    <g transform={par(c, 0.45)}>{[-1500, -1000, 1000, 1500, 2000].map((x, i) => <rect key={i} x={x - 200} y={ROOF - 60 + (i % 2) * 70} width={400} height={FOOT - ROOF + 60} fill="#CDAE88" stroke={INK} strokeWidth={7} />)}</g>
    {dark ? <Fill fill="#0d1028" o={dark} /> : null}
  </>
);
/** the house, front view; x = centre */
const House: React.FC<{x?: number; hole?: number; stairs?: boolean}> = ({x = 0, hole = 0, stairs = true}) => (
  <g>
    <rect x={x - 420} y={ROOF} width={840} height={FOOT - ROOF} fill="#E2C49C" stroke={INK} strokeWidth={9} />
    <rect x={x - 440} y={ROOF - 30} width={880} height={36} fill="#B9936A" stroke={INK} strokeWidth={8} />
    {[-300, 300].map((d) => <rect key={d} x={x + d - 50} y={-120} width={100} height={90} fill="#3a2418" stroke={INK} strokeWidth={7} />)}
    <path d={`M ${x - 95} ${FOOT} L ${x - 95} ${20} Q ${x} ${-50} ${x + 95} ${20} L ${x + 95} ${FOOT} Z`} fill="#3a2418" stroke={INK} strokeWidth={8} />
    {hole > 0 ? <ellipse cx={x} cy={ROOF - 12} rx={130 * hole} ry={16} fill="#2a1a10" /> : null}
    {stairs ? Array.from({length: 8}).map((_, i) => <rect key={i} x={x + 420 + i * 36} y={ROOF + i * ((FOOT - ROOF) / 8)} width={300 - i * 36} height={(FOOT - ROOF) / 8} fill="#D2B28A" stroke={INK} strokeWidth={5} />) : null}
  </g>
);
export const Interior: React.FC<{c: C3; t: number; holeX?: number; hole?: number; beam?: number}> = ({c, t, holeX = 0, hole = 0, beam = 0}) => (
  <>
    <Fill fill="#7A5A44" />
    <g transform={par(c, 0.8)}>
      <rect x={-BIG} y={-BIG} width={BIG * 2} height={BIG + ROOF - 120} fill="#4A3426" />
      {Array.from({length: 14}).map((_, i) => <rect key={i} x={-1800 + i * 260} y={ROOF - 170} width={46} height={60} fill="#3a2418" stroke={INK} strokeWidth={4} />)}
      <rect x={-BIG} y={ROOF - 120} width={BIG * 2} height={26} fill="#5E4230" stroke={INK} strokeWidth={6} />
      {hole > 0 ? <g><ellipse cx={holeX} cy={ROOF - 150} rx={150 * hole} ry={40 * hole} fill="#FFF3D0" stroke={INK} strokeWidth={6} />
        <polygon points={`${holeX - 140 * hole},${ROOF - 150} ${holeX + 140 * hole},${ROOF - 150} ${holeX + 330},${FOOT + 200} ${holeX - 330},${FOOT + 200}`} fill="#FFF3D0" opacity={0.22 * beam + 0.04 * Math.sin(t * 6)} /></g> : null}
    </g>
    <Ground fill="#6A4C38" />
  </>
);
export const Crowd: React.FC<{t: number; xs: number[]; y?: number; scale?: number; face?: 'half' | 'wide' | 'open'; lookUp?: boolean; lookTo?: number; flipAt?: number; lean?: number}> = ({t, xs, y = FOOT + 120, scale = 0.95, face = 'half', lookUp, lookTo, flipAt = 0, lean = 0}) => (
  <g>{xs.map((x, i) => <Fig key={i} x={x} y={y + (i % 2) * 30} scale={scale} flip={x > flipAt} pose={{...P.stand, lean}} look={GREY(i)} t={t + i} face={{eyes: face, mouth: face === 'wide' ? 'open' : 'flat', look: lookUp ? [x > flipAt ? -0.3 : 0.3, -1] : [lookTo ?? 1, 0]}} />)}</g>
);
const Coins: React.FC<{x: number; y: number; n?: number}> = ({x, y, n = 5}) => (
  <g>{Array.from({length: n}).map((_, s) => Array.from({length: 3 + (s % 3)}).map((__, j) => <ellipse key={s + '-' + j} cx={x + s * 46} cy={y - j * 10} rx={20} ry={7} fill="#E8B84A" stroke={INK} strokeWidth={3} />))}</g>
);

/* 1 ------------------------------------------------------------------ the packed house */
const HouseSc: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = p.segs[1] - 0.12;
  if (t < cut) {
    const c: C3 = {x: lerp(-150, 0, k(t, 0, cut)), y: lerp(-20, 60, k(t, 0, cut)), z: lerp(1.0, 1.2, k(t, 0, cut))};
    return (
      <Cam c={c} p={p}>
        <Street c={c} t={t} />
        <House />
        <Ground fill="#C9A47A" />
        {Array.from({length: 8}).map((_, i) => { const u = lin(t, i * 0.3, i * 0.3 + 2.4); const side = i % 2 ? 1 : -1; const x = side * lerp(1100, 160 + (i >> 1) * 90, u); return <Fig key={i} x={x} y={FOOT + 60 + (i % 3) * 30} flip={side > 0} scale={0.85} pose={u < 1 ? walk(t + i, 1.8) : P.stand} look={GREY(i)} t={t + i} face={{eyes: 'open', mouth: 'smile', look: [-side, 0]}} />; })}
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: 0, y: lerp(-40, 0, u / (p.dur - cut)), z: lerp(1.25, 1.4, u / (p.dur - cut))};
  return (
    <Cam c={c} p={p}>
      <Street c={c} t={t} />
      <House stairs={false} />
      <Ground fill="#C9A47A" />
      {Array.from({length: 14}).map((_, i) => { const row = Math.floor(i / 5); const x = -480 + (i % 5) * 240 + row * 110 - 110; return <Fig key={i} x={x} y={FOOT + 30 + row * 90} scale={0.95 - row * 0.02} flip={i % 2 === 0} pose={{...P.stand, lean: (i % 3 - 1) * 4}} look={GREY(i + 3)} t={t + i} face={{eyes: 'half', mouth: 'flat', look: [0, -0.3]}} />; })}
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ four friends, a mat, the stairs */
const Friends: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  const roof = p.w('roof', p.dur - 1) - 0.4;
  if (t < s1) {
    const x0 = lerp(-900, -60, ko(t, 0, s1));
    const c: C3 = {x: x0 + 40, y: -120, z: 1.15};
    const bob = Math.sin(t * 7) * 6;
    return (
      <Cam c={c} p={p}>
        <Street c={c} t={t} />
        <Ground fill="#C9A47A" />
        {[1, 3].map((i, j) => <Fig key={i} x={x0 - 170 + j * 340 + 40} y={FOOT - 20} scale={0.92} pose={mix(CARRY, {...CARRY, lB: [-20, 10], lF: [20, 4]}, (Math.sin(t * 7 + j) + 1) / 2)} look={{...FRIENDS[i], skin: '#9b7a62'}} t={t} face={{eyes: 'half'}} opacity={0.85} />)}
        <Mat x={x0} y={FOOT - 395 + bob} t={t} face="open" />
        {[0, 2].map((i, j) => <Fig key={i} x={x0 - 200 + j * 400} y={FOOT + 20} pose={mix(CARRY, {...CARRY, lB: [-20, 10], lF: [20, 4]}, (Math.sin(t * 7 + j + 1) + 1) / 2)} look={FRIENDS[i]} t={t} face={{eyes: 'open', mouth: 'grit', brow: -0.3, look: [1, 0]}} />)}
      </Cam>
    );
  }
  if (t < roof) {
    // blocked: a wall of backs
    const c: C3 = {x: 20, y: -20, z: 1.15};
    return (
      <Cam c={c} p={p}>
        <Street c={c} t={t} />
        <House x={500} />
        <Ground fill="#C9A47A" />
        {Array.from({length: 7}).map((_, i) => <Fig key={i} x={250 + i * 110} y={FOOT + 40 + (i % 2) * 20} pose={P.stand} look={GREY(i + 2)} t={t + i} face={{eyes: 'half', look: [1, 0]}} scale={0.9} />)}
        {[0, 2].map((i, j) => <Fig key={i} x={-460 + j * 380} y={FOOT + 30} pose={CARRY} look={FRIENDS[i]} t={t} face={{eyes: 'open', mouth: 'frown', brow: -0.6, look: [1, -0.3]}} />)}
        <Mat x={-270} y={FOOT - 365} t={t} face="closed" />
      </Cam>
    );
  }
  // up the stairs onto the roof
  const u = t - roof;
  const climb = ko(u, 0, 1.4);
  const c: C3 = {x: lerp(560, 420, climb), y: lerp(-40, -360, climb), z: 1.0};
  return (
    <Cam c={c} p={p}>
      <Street c={c} t={t} />
      <House x={0} />
      <Ground fill="#C9A47A" />
      {Array.from({length: 7}).map((_, i) => <Fig key={i} x={-300 + i * 100} y={FOOT + 40} pose={P.stand} look={GREY(i + 2)} t={t + i} face={{eyes: 'half'}} scale={0.85} />)}
      {[0, 2].map((i, j) => <Fig key={i} x={lerp(980, 220, climb) + j * 300} y={lerp(FOOT, ROOF - 30, climb)} flip pose={walk(t + j, 1.6)} look={FRIENDS[i]} t={t} face={{eyes: 'open', mouth: 'grit', look: [-1, 0]}} scale={0.9} />)}
      <Mat x={lerp(1120, 370, climb)} y={lerp(FOOT - 360, ROOF - 390, climb)} t={t} face="open" />
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ digging through */
const RoofSc: React.FC<SP> = (p) => {
  const {t} = p;
  const th = p.w('through') + 0.05;
  const open = ko(t, th, th + 0.4);
  const sh = shakeAt(t, th, 20);
  const c: C3 = {x: Math.sin(t * 61) * sh, y: lerp(-340, -260, k(t, 0, p.dur)), z: lerp(1.2, 1.12, k(t, 0, p.dur))};
  const dig = (ph: number) => mix(P.hammerUp, P.hammerDn, (Math.sin(t * 11 + ph) + 1) / 2);
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyDesert)" />
      {/* cut-away: room below */}
      <rect x={-900} y={ROOF + 20} width={1800} height={FOOT - ROOF + 400} fill="#6A4C38" stroke={INK} strokeWidth={9} />
      {open > 0 ? <polygon points={`-110,${ROOF + 20} 110,${ROOF + 20} 300,${FOOT + 300} -300,${FOOT + 300}`} fill="#FFF3D0" opacity={0.3 * open} /> : null}
      {[-520, -330, 330, 520].map((x, i) => <Fig key={i} x={x} y={FOOT + 140} scale={0.8} flip={x > 0} pose={P.stand} look={GREY(i)} t={t + i} face={{eyes: open > 0 ? 'wide' : 'half', mouth: open > 0 ? 'open' : 'flat', look: [x > 0 ? -0.3 : 0.3, -1]}} />)}
      <Fig x={-60} y={FOOT + 140} scale={0.85} pose={P.stand} look={JESUS} t={t} face={{eyes: 'open', mouth: open > 0 ? 'smile' : 'flat', look: [0, -1]}} />
      {/* roof slab */}
      <path d={`M -940 ${ROOF - 20} L ${-120 * open - 2} ${ROOF - 20} L ${-120 * open - 2} ${ROOF + 26} L -940 ${ROOF + 26} Z`} fill="#B9936A" stroke={INK} strokeWidth={8} />
      <path d={`M 940 ${ROOF - 20} L ${120 * open + 2} ${ROOF - 20} L ${120 * open + 2} ${ROOF + 26} L 940 ${ROOF + 26} Z`} fill="#B9936A" stroke={INK} strokeWidth={8} />
      {[0, 1, 2].map((i) => <line key={i} x1={-40 + i * 40} y1={ROOF - 18} x2={-60 + i * 50} y2={ROOF + 24} stroke={INK} strokeWidth={4} opacity={t > th - 0.8 ? 1 : 0} />)}
      {[0, 1, 2, 3].map((i) => <Fig key={i} x={[-380, -210, 210, 380][i]} y={ROOF - 20} flip={i > 1} pose={{...P.kneel, ...dig(i)}} look={FRIENDS[i]} t={t + i} face={{eyes: 'open', mouth: 'grit', brow: -0.5, look: [i > 1 ? 1 : -1, 1]}} scale={0.75} />)}
      {/* debris */}
      {Array.from({length: 22}).map((_, i) => { const u = t - th - rnd(i) * 0.3; if (u < 0) return null; const x = (rnd(i + 1) - 0.5) * 220 + (rnd(i + 2) - 0.5) * 200 * u; const y = ROOF + 20 + 1200 * u * u; return y < FOOT + 150 ? <rect key={i} x={x} y={y} width={14 + rnd(i) * 20} height={12 + rnd(i + 3) * 14} fill="#A07A54" stroke={INK} strokeWidth={3} transform={`rotate(${u * 300 * (rnd(i) - 0.5)} ${x} ${y})`} /> : null; })}
      {Array.from({length: 26}).map((_, i) => { const ph = (t * 0.8 + rnd(i)) % 1; return t > th - 1.2 ? <circle key={'d' + i} cx={(rnd(i + 7) - 0.5) * 300} cy={ROOF - 30 - ph * 200} r={4 + rnd(i) * 6} fill="#E6CFA8" opacity={(1 - ph) * 0.7} /> : null; })}
      {flash(t, th, 0.08) ? <Fill fill="#fff" o={0.6} /> : null}
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ lowered down */
const Lower: React.FC<SP> = (p) => {
  const {t} = p;
  const lw = p.w('lowered') - 0.2;
  const d = ko(t, lw, p.w('jesus', p.dur - 0.6) + 0.2);
  const matY = lerp(ROOF - 120, FOOT - 10, d);
  const c: C3 = {x: 40, y: lerp(-200, 40, k(t, 0, p.dur)), z: 1.15};
  return (
    <Cam c={c} p={p}>
      <Interior c={c} t={t} holeX={140} hole={1} beam={1} />
      <Crowd t={t} xs={[-760, -560, 560, 780]} y={FOOT + 60} lookUp={d < 0.9} face="wide" flipAt={0} />
      <Fig x={-260} y={FOOT} pose={P.stand} look={JESUS} t={t} face={{eyes: 'open', mouth: d > 0.9 ? 'smile' : 'flat', look: d > 0.9 ? [1, 0.6] : [0.4, -1]}} />
      {[-200, 200].map((dx, i) => <line key={i} x1={140 + dx * 0.4} y1={ROOF - 300} x2={140 + dx} y2={matY - 4} stroke="#C8A86A" strokeWidth={5} />)}
      <Mat x={140} y={matY} t={t} face="open" />
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ "your sins are forgiven" */
const Forgive: React.FC<SP> = (p) => {
  const {t} = p;
  const f = p.w('forgiven');
  const cut = p.w('son', p.dur * 0.6) - 0.15;
  const g = ko(t, f, f + 0.8);
  if (t < cut) {
    const c: C3 = {x: 0, y: -20, z: lerp(1.5, 1.7, t / cut)};
    return (
      <Cam c={c} p={p}>
        <Interior c={c} t={t} holeX={400} hole={1} beam={0.8} />
        <Glow x={300} y={-300} r={500} o={0.4} />
        <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', brow: 0.2, look: [1, 0.6]}} />
        {[-1, 1].map((s) => <Bust key={s} x={s * 430} y={360} look={FRIENDS[s > 0 ? 1 : 0]} t={t} scale={0.75} face={{eyes: 'open', mouth: 'open', look: [-s, -1]}} />)}
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: -20, z: lerp(1.6, 1.85, k(t, cut, p.dur))};
  return (
    <Cam c={c} p={p}>
      <Interior c={c} t={t} holeX={0} hole={1} beam={1} />
      <Glow x={0} y={-60} r={500 + g * 200} o={0.3 + g * 0.6} id="gWhite" />
      {Array.from({length: 7}).map((_, i) => <polygon key={i} points={`${-60 + i * 20},-1700 ${60 + i * 20},-1700 ${(i - 3) * 360 + 170},1300 ${(i - 3) * 360 - 170},1300`} fill="#FFF6D0" opacity={0.06 + g * 0.1} />)}
      <Bust x={0} y={0} look={PARALYTIC} t={t} tilt={-4} face={{eyes: g > 0.3 ? 'closed' : 'open', mouth: g > 0.3 ? 'smile' : 'flat', brow: -0.3, look: [0, -1]}} />
      {g > 0.3 ? [0, 1].map((i) => { const ph = (t * 0.6 + i * 0.5) % 1; return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${i ? 34 : -34} ${14 + ph * 60}) scale(1.4)`} fill="#BFE9F2" stroke={INK} strokeWidth={2.5} opacity={1 - ph} />; }) : null}
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ the scholars */
const Scholars: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  if (t < s1) {
    const c: C3 = {x: 0, y: 0, z: lerp(1.0, 1.15, t / s1)};
    return (
      <Cam c={c} p={p}>
        <Interior c={c} t={t} />
        <Fill fill="#1b1430" o={0.35} />
        {[-300, 0, 300].map((x, i) => <Fig key={i} x={x} y={FOOT + 20 - (i % 2) * 20} pose={P.sit} look={{...SCRIBE, sash: ['#3E5C9A', '#6A3E3E', '#3E6A5A'][i]}} t={t + i} face={{eyes: 'half', mouth: 'frown', brow: -0.8, look: [i === 2 ? -1 : 1, 0]}} />)}
      </Cam>
    );
  }
  const u = t - s1;
  const c: C3 = {x: 0, y: -10, z: lerp(1.65, 1.95, u / (p.dur - s1))};
  return (
    <Cam c={c} p={p}>
      <Fill fill="#2a2036" /><Glow x={0} y={700} r={900} o={0.3} />
      <Bust x={0} y={0} look={SCRIBE} t={t} tilt={-5} face={{eyes: 'half', mouth: 'frown', brow: -1, look: [1, 0]}} />
      <Bust x={-420} y={250} look={{...SCRIBE, sash: '#6A3E3E'}} t={t + 1} scale={0.7} face={{eyes: 'half', mouth: 'frown', brow: -0.9, look: [1, 0]}} />
      <Fill fill="#3a1030" o={0.18} />
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ "Get up" — he stands */
const Rise: React.FC<SP> = (p) => {
  const {t} = p;
  const up = p.w('up'), st = p.w('stood') + 0.05;
  const stood = t > st;
  const sh = shakeAt(t, st, 22);
  const c: C3 = {x: Math.sin(t * 67) * sh + 0, y: lerp(30, -10, k(t, 0, p.dur)), z: stood ? lerp(1.3, 1.15, ko(t, st, st + 1)) : 1.3};
  return (
    <Cam c={c} p={p}>
      <Interior c={c} t={t} holeX={200} hole={1} beam={1} />
      <Glow x={200} y={-120} r={600} o={stood ? 0.9 * (1 - lin(t, st + 0.4, p.dur)) + 0.3 : 0.15} id="gWhite" />
      <Crowd t={t} xs={[-780, -600, 640, 820]} y={FOOT + 60} face={stood ? 'wide' : 'half'} flipAt={0} lookTo={stood ? 0.6 : 0.3} lean={stood ? -14 : 0} />
      <Fig x={-260} y={FOOT} pose={t > up - 0.3 && !stood ? P.command : P.firm} look={JESUS} t={t} face={{eyes: 'open', mouth: stood ? 'smile' : t > up - 0.2 ? 'open' : 'flat', brow: 0.4, look: [1, 0.4]}} />
      {stood
        ? <g><Fig x={240} y={FOOT} flip pose={mix(P.kneel, P.armsOpen, ko(t, st, st + 0.6))} look={PARALYTIC} t={t} face={{eyes: 'wide', mouth: 'open', brow: -0.4, look: [-1, -0.5]}} />
            <rect x={340} y={FOOT - 26} width={240} height={26} rx={8} fill="#C9B07A" stroke={INK} strokeWidth={6} /></g>
        : <Mat x={250} y={FOOT - 10} t={t} face={t > up ? 'wide' : 'open'} />}
      {stood ? [0, 1, 2].map((i) => { const r = (t - st - i * 0.12) * 1800; return r > 0 ? <circle key={i} cx={240} cy={-120} r={r} fill="none" stroke="#FFF6D8" strokeWidth={30 - i * 8} opacity={Math.max(0, 0.9 - (t - st) * 1.2)} /> : null; }) : null}
      {flash(t, st, 0.1) ? <Fill fill="#fff" o={0.75} /> : null}
    </Cam>
  );
};

/* 8 ------------------------------------------------------------------ "never seen anything like this" */
const Amazed: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-60, 60, t / p.dur), y: -30, z: 1.15};
  const MatRoll = <g transform="rotate(90)"><rect x={-80} y={-22} width={160} height={44} rx={20} fill="#C9B07A" stroke={INK} strokeWidth={5} /></g>;
  return (
    <Cam c={c} p={p}>
      <Street c={c} t={t} />
      <House stairs={false} hole={1} />
      <Ground fill="#C9A47A" />
      <Fig x={lerp(-60, 520, lin(t, 0.2, p.dur))} y={FOOT + 60} pose={walk(t, 1.6)} look={PARALYTIC} t={t} face={{eyes: 'open', mouth: 'smile', brow: 0.3, look: [1, 0]}} hold={MatRoll} />
      {[-560, -380, -200, 640, 820].map((x, i) => <Bust key={i} x={x} y={360 + (i % 2) * 40} look={GREY(i + 1)} t={t + i} scale={0.8} face={{eyes: 'wide', mouth: 'open', brow: -0.5, look: [x > 0 ? -1 : 1, -0.2]}} />)}
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ Levi at the tax booth */
const Levi: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  const fol = p.w('follow', s1 + 0.6), fd = p.w('followed', p.dur - 0.8);
  const standUp = ko(t, fd - 0.9, fd - 0.3);
  const c: C3 = {x: t < s1 ? lerp(180, 280, k(t, 0, s1)) : lerp(180, 0, k(t, s1, p.dur)), y: 30, z: t < s1 ? 1.35 : 1.15};
  return (
    <Cam c={c} p={p}>
      <Street c={c} t={t} />
      <Ground fill="#C9A47A" />
      {/* booth */}
      <path d={`M 40 ${-280} L 640 ${-280} L 600 ${-220} L 80 ${-220} Z`} fill="#A84A3A" stroke={INK} strokeWidth={7} />
      {[90, 590].map((x) => <rect key={x} x={x - 10} y={-220} width={20} height={FOOT + 220} fill="#7a5233" stroke={INK} strokeWidth={5} />)}
      {t < s1 ? Array.from({length: 4}).map((_, i) => { const x = lerp(-900, 1100, lin(t, i * 0.9, i * 0.9 + 3.2)); return <Fig key={i} x={x} y={FOOT + 90} scale={0.85} pose={walk(t + i, 1.5)} look={GREY(i + 4)} t={t + i} face={{eyes: 'half', mouth: 'frown', brow: -0.8, look: [0.6, -0.2]}} />; }) : null}
      {standUp < 0.5
        ? <Fig x={340} y={FOOT - 10} flip={t > s1} pose={t > fol ? P.sit : mix(P.sit, {...P.sit, aF: [70, 40]}, (Math.sin(t * 5) + 1) / 2)} look={LEVI} t={t} face={{eyes: t > fol ? 'wide' : 'half', mouth: t > fol ? 'open' : 'flat', look: t > s1 ? [-1, 0] : [0, 1]}} />
        : <Fig x={lerp(340, -100, lin(t, fd - 0.3, p.dur))} y={FOOT} flip pose={t > fd - 0.2 ? walk(t, 1.5) : P.stand} look={LEVI} t={t} face={{eyes: 'open', mouth: 'smile', brow: 0.3, look: [-1, 0]}} />}
      <rect x={140} y={FOOT - 140} width={420} height={40} fill="#8a5a33" stroke={INK} strokeWidth={7} />
      <rect x={180} y={FOOT - 100} width={30} height={100} fill="#6f4a2d" stroke={INK} strokeWidth={5} /><rect x={490} y={FOOT - 100} width={30} height={100} fill="#6f4a2d" stroke={INK} strokeWidth={5} />
      <Coins x={190} y={FOOT - 148} n={standUp > 0.3 ? 2 : 6} />
      {standUp > 0.3 ? Array.from({length: 12}).map((_, i) => { const u = t - (fd - 0.6) - rnd(i) * 0.2; if (u < 0) return null; const x = 300 + (rnd(i) - 0.3) * 300 + (rnd(i + 1) - 0.5) * 300 * u; const y = Math.min(FOOT + 10, FOOT - 150 - 300 * u + 1600 * u * u); return <ellipse key={i} cx={x} cy={y} rx={18} ry={7} fill="#E8B84A" stroke={INK} strokeWidth={3} />; }) : null}
      {t > s1 ? <Fig x={lerp(-900, -320, ko(t, s1, fol))} y={FOOT} pose={t < fol - 0.2 ? walk(t, 1.4) : t < fd ? P.offer : P.stand} look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} /> : null}
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- the party */
const Table: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x={-900} y={FOOT - 60} width={1800} height={50} rx={10} fill="#8a5a33" stroke={INK} strokeWidth={8} />
    {[-720, -420, -120, 180, 480, 760].map((x, i) => <g key={i}>
      {i % 2 ? <ellipse cx={x} cy={FOOT - 70} rx={60} ry={18} fill="#E0B070" stroke={INK} strokeWidth={4} /> : <path d={`M ${x - 60} ${FOOT - 64} q 60 -40 120 0 Z`} fill="#9FB6C8" stroke={INK} strokeWidth={4} />}
      <rect x={x + 70} y={FOOT - 110} width={30} height={50} rx={6} fill="#B5683E" stroke={INK} strokeWidth={4} />
    </g>)}
    {[-560, 0, 560].map((x, i) => <g key={'l' + i}><Glow x={x} y={FOOT - 120} r={200 + Math.sin(t * 7 + i) * 10} o={0.7} /><path d={`M ${x} ${FOOT - 92} q -9 -18 0 -34 q 9 16 0 34`} fill="#FFD36A" /></g>)}
  </g>
);
const Feast: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.15;
  const guests: [number, Look, number][] = [[-760, GREY(1), 1], [-560, {...GREY(2), tunic: '#9A4A5A'}, 0], [-200, LEVI, 0], [200, {...GREY(3), tunic: '#4A7A8A'}, 1], [420, GREY(5), 1], [640, {...GREY(6), tunic: '#8A7A3A'}, 1]];
  if (t < s1) {
    const c: C3 = {x: lerp(-100, 0, k(t, 0, s1)), y: lerp(60, 20, k(t, 0, s1)), z: lerp(1.25, 1.4, k(t, 0, s1))};
    const laugh = (i: number) => Math.sin(t * 6 + i) > 0.2;
    return (
      <Cam c={c} p={p}>
        <Fill fill="url(#roomNight)" />
        <g transform={par(c, 0.7)}><rect x={-1700} y={-700} width={3400} height={FOOT + 700} fill="#6A4A3A" opacity={0.7} />{[-900, 900].map((x) => <rect key={x} x={x - 120} y={-420} width={240} height={300} fill="#141028" stroke={INK} strokeWidth={8} />)}</g>
        <Ground fill="#5A3E30" />
        {guests.map(([x, L, f], i) => <Fig key={i} x={x} y={FOOT - 10} flip={!!f} pose={mix(P.sit, {...P.sit, aF: [100, 30]}, (Math.sin(t * 3 + i) + 1) / 2)} look={L} t={t + i} face={{eyes: laugh(i) ? 'closed' : 'open', mouth: laugh(i) ? 'open' : 'smile', look: [f ? -1 : 1, 0]}} />)}
        <Fig x={0} y={FOOT - 10} pose={mix(P.sit, {...P.sit, aB: [-60, 20], aF: [60, -20]}, (Math.sin(t * 2.5) + 1) / 2)} look={JESUS} t={t} face={{eyes: Math.sin(t * 4) > 0.4 ? 'closed' : 'open', mouth: 'open', look: [0, 0]}} />
        <Table t={t} />
      </Cam>
    );
  }
  // outside the window: the scholars watching
  const u = t - s1;
  const c: C3 = {x: 0, y: -20, z: lerp(1.25, 1.4, u / (p.dur - s1))};
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyNight)" /><Stars t={t} n={70} />
      <rect x={-BIG} y={-500} width={BIG * 2} height={BIG} fill="#3A2C2A" />
      <rect x={-330} y={-360} width={660} height={360} fill="#FFC27A" stroke={INK} strokeWidth={10} />
      <Glow x={0} y={-180} r={480} o={0.6} />
      <g opacity={0.55}>{[-200, 0, 200].map((x, i) => <circle key={i} cx={x} cy={-200 + Math.sin(t * 5 + i) * 10} r={60} fill="#5a3020" />)}</g>
      <Bust x={-300} y={160} look={SCRIBE} t={t} scale={0.95} face={{eyes: 'half', mouth: 'frown', brow: -1, look: [1, -0.4]}} />
      <Bust x={300} y={190} look={{...SCRIBE, sash: '#6A3E3E'}} t={t + 1} scale={0.9} face={{eyes: 'half', mouth: 'frown', brow: -1, look: [-1, -0.4]}} />
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- the doctor */
const Doctor: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.1;
  const came = p.w('came', p.dur - 1.5);
  if (t < s1) {
    const c: C3 = {x: lerp(-100, 60, k(t, 0, s1)), y: 20, z: 1.2};
    return (
      <Cam c={c} p={p}>
        <Fill fill="url(#skyNight)" /><Stars t={t} n={60} />
        <rect x={-BIG} y={-560} width={BIG * 2} height={BIG} fill="#3A2C2A" />
        <path d={`M -460 ${FOOT} L -460 -160 Q -300 -300 -140 -160 L -140 ${FOOT} Z`} fill="#FFC27A" stroke={INK} strokeWidth={9} />
        <Glow x={-300} y={0} r={500} o={0.7} />
        <Ground fill="#3c3148" />
        <Fig x={-300} y={FOOT} pose={P.offer} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 9) > 0 ? 'open' : 'smile', brow: 0.3, look: [1, 0]}} />
        {[260, 500].map((x, i) => <Fig key={i} x={x} y={FOOT + 20} flip pose={{...P.stand, lean: -4}} look={i ? {...SCRIBE, sash: '#6A3E3E'} : SCRIBE} t={t + i} face={{eyes: 'half', mouth: 'frown', brow: -0.8, look: [-1, 0]}} />)}
      </Cam>
    );
  }
  const g = ko(t, came, came + 0.6);
  if (t < came + 0.25) {
    const c: C3 = {x: 0, y: -20, z: lerp(1.6, 1.8, k(t, s1, came))};
    return (
      <Cam c={c} p={p}>
        <Fill fill="#3A2C2A" /><Glow x={-200} y={100} r={800} o={0.6} />
        <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', brow: 0.6}} />
      </Cam>
    );
  }
  // back at the table: everyone with him
  const c: C3 = {x: 0, y: 20, z: lerp(1.4, 1.25, k(t, came, p.dur))};
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#roomNight)" />
      <Glow x={0} y={-100} r={900} o={0.5 * g} />
      <Ground fill="#5A3E30" />
      {[-640, -420, -200, 200, 420, 640].map((x, i) => <Fig key={i} x={x} y={FOOT - 10} flip={x > 0} pose={{...P.sit, aF: [130, 20]}} look={i === 2 ? LEVI : GREY(i + 1)} t={t + i} face={{eyes: 'closed', mouth: 'open', look: [x > 0 ? -1 : 1, 0]}} />)}
      <Fig x={0} y={FOOT - 10} pose={{...P.sit, aB: [-120, 20], aF: [120, -20]}} look={JESUS} t={t} face={{eyes: 'closed', mouth: 'open'}} />
      <Table t={t} />
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 0, z: 1};
  return (
    <Cam c={c} p={p}>
      <Fill fill="url(#skyDusk)" /><Fill fill="#1a0d1c" o={0.3} />
      <Sun x={0} y={420} r={150} fill="#FFE2B0" />
      {[-700, -300, 300, 700].map((x, i) => <rect key={i} x={x - 160} y={300 + (i % 2) * 50} width={320} height={500} fill="#1b1016" />)}
      <rect x={-200} y={330} width={400} height={500} fill="#1b1016" />
      <ellipse cx={0} cy={332} rx={70} ry={10} fill="#FFE2B0" />
      <polygon points="-60,332 60,332 140,900 -140,900" fill="#FFE2B0" opacity={0.18} />
      <rect x={-BIG} y={560} width={BIG * 2} height={BIG} fill="#1b1016" />
      <Dust t={t} o={0.25} col="#FFE2B0" up n={20} />
    </Cam>
  );
};

export const SCENES3: Record<string, React.FC<SP>> = {house: HouseSc, friends: Friends, roof: RoofSc, lower: Lower, forgive: Forgive, scholars: Scholars, rise: Rise, amazed: Amazed, levi: Levi, feast: Feast, doctor: Doctor, end: End};
