import React from 'react';
import {FRIENDS, INK, JESUS, Look} from '../v8/fig';
import {C3, Cam, Fill, Glow, SP, Stars, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Hand, Wheat} from '../v11/anime';
import {Bean, RDEFS} from '../v11/room';
import {AP, Bust, Sea, Sky} from '../v12/scenes';

/** Episode 6 — "The Storm" (Mark 4), lit-room cartoon style. */
const FARMER: Look = {skin: '#C98E64', hair: '#3A2418', tunic: '#9A7A4A', sash: '#5A4428', style: 'short', beard: true};
export const CREW = ['simon', 'andrew', 'james', 'john'];
const shake = (t: number, at: number, amp = 12, decay = 4) => (t > at ? Math.exp(-(t - at) * decay) * amp : 0);

/** big boat, side view; people drawn inside appear cut at the gunwale. x,y = waterline centre */
export const BigBoat: React.FC<{x: number; y: number; tilt?: number; children?: React.ReactNode; night?: boolean; sail?: boolean}> = ({x, y, tilt = 0, children, night, sail = true}) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
    {sail ? <g><line x1={-40} y1={-150} x2={-40} y2={-900} stroke={INK} strokeWidth={16} /><path d="M -28 -880 Q 220 -620 -28 -240 Z" fill={night ? '#3A3E54' : '#EFE2C2'} stroke={INK} strokeWidth={7} /></g> : null}
    {children}
    <path d="M -560 -170 L 560 -170 Q 520 40 300 70 L -320 70 Q -540 40 -560 -170 Z" fill={night ? '#4A3A30' : '#8a5a33'} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    {[-110, -40].map((yy) => <line key={yy} x1={-540} y1={yy} x2={540} y2={yy} stroke={INK} strokeWidth={4} opacity={0.35} />)}
  </g>
);
export const Waves: React.FC<{t: number; y: number; amp: number; col: string; speed?: number; o?: number; ph?: number}> = ({t, y, amp, col, speed = 1, o = 1, ph = 0}) => {
  const pts = Array.from({length: 41}).map((_, i) => { const x = -2000 + i * 100; return `${x},${y + Math.sin(x * 0.006 + t * 2.2 * speed + ph) * amp + Math.sin(x * 0.013 - t * 3.1 * speed) * amp * 0.4}`; });
  return <polygon points={`-2000,3000 ${pts.join(' ')} 2000,3000`} fill={col} stroke={INK} strokeWidth={6} opacity={o} />;
};
export const Rain: React.FC<{t: number; o?: number}> = ({t, o = 1}) => (
  <g opacity={o}>{Array.from({length: 90}).map((_, i) => { const sp = 1800 + rnd(i) * 900; const y = ((t * sp + rnd(i + 1) * 3000) % 3000) - 1500; const x = (rnd(i + 2) - 0.5) * 2600 + y * 0.35; return <line key={i} x1={x} y1={y} x2={x - 40} y2={y - 120} stroke="#BFD6F0" strokeWidth={3} opacity={0.5} />; })}</g>
);
export const Moon: React.FC<{x: number; y: number}> = ({x, y}) => (<g><circle cx={x} cy={y} r={110} fill="#F4F0E2" /><Glow x={x} y={y} r={420} o={0.45} id="gWhite" /></g>);
const Seed: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => <ellipse cx={x} cy={y} rx={9 * s} ry={6 * s} fill="#C9A060" stroke={INK} strokeWidth={2.5} />;
const Sprout: React.FC<{x: number; y: number; g: number; wilt?: number; s?: number}> = ({x, y, g, wilt = 0, s = 1}) => {
  const col = wilt > 0.5 ? '#B39A4A' : '#5E9A4A';
  const h = 120 * g * s;
  return (
    <g>
      <path d={`M ${x} ${y} Q ${x + wilt * 40 * s} ${y - h * 0.6} ${x + wilt * 90 * s} ${y - h + wilt * 60 * s}`} fill="none" stroke={col} strokeWidth={8 * s} strokeLinecap="round" />
      {g > 0.4 ? [-1, 1].map((d) => <ellipse key={d} cx={x + d * 26 * s + wilt * 70 * s} cy={y - h * 0.75 + wilt * 50 * s} rx={26 * s} ry={11 * s} transform={`rotate(${d * (-30 + wilt * 60)} ${x + d * 26 * s + wilt * 70 * s} ${y - h * 0.75 + wilt * 50 * s})`} fill={col} stroke={INK} strokeWidth={3} />) : null}
    </g>
  );
};

/* 1 ------------------------------------------------------------------ teaching from the boat */
const Shore: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-40, 40, t / p.dur), y: 60, z: lerp(1.05, 1.18, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky /><Sea t={t} y={-120} />
      <BigBoat x={0} y={260} tilt={Math.sin(t * 1.2) * 2}><Bean x={60} y={-70} s={0.95} sit look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'smile', look: [0, 0.3]}} arms="offer" /></BigBoat>
      <rect x={-3000} y={700} width={6000} height={3000} fill="#C9A47A" />
      <g filter="url(#dofS)">{Array.from({length: 7}).map((_, i) => <Bean key={i} x={-600 + i * 200} y={1180 + (i % 2) * 40} s={1.1} look={FRIENDS[i % 4]} shirt={['#C0663A', '#5E8A5A', '#4F6F9A', '#C9A04A', '#8A6A9A'][i % 5]} t={t + i} face={{eyes: 'open', mouth: 'flat', look: [0, -1]}} />)}</g>
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ the sower */
const Sower: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-100, 100, t / p.dur), y: 60, z: 1.1};
  const fx = lerp(-300, 200, t / p.dur);
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky />
      <g filter="url(#dof)"><circle cx={300} cy={-320} r={150} fill="#FFF0C8" /><Glow x={300} y={-320} r={700} o={0.8} /><path d="M -1600 260 Q -700 120 0 220 Q 700 120 1600 240 L 1600 600 L -1600 600 Z" fill="#9A8A6A" /></g>
      <rect x={-3000} y={330} width={6000} height={3000} fill="#8A6A44" />
      {Array.from({length: 14}).map((_, i) => <line key={i} x1={-1400 + i * 200} y1={330} x2={-1400 + i * 260} y2={1600} stroke="#6A4E30" strokeWidth={6} />)}
      <Bean x={fx} y={600} s={1.0} look={FARMER} t={t} walk={1} arms={Math.sin(t * 5) > 0 ? 'offer' : 'down'} face={{eyes: 'open', mouth: 'smile', look: [1, 0.3]}} />
      {Array.from({length: 24}).map((_, i) => { const u = ((t * 1.4 + rnd(i)) % 1); const sx = fx + 120 + u * (200 + rnd(i + 1) * 300); const sy = 180 - 220 * u + 600 * u * u; return u < 0.95 ? <Seed key={i} x={sx} y={Math.min(sy, 620)} s={1.3} /> : null; })}
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ path, rock, thorns */
const Seeds: React.FC<SP> = (p) => {
  const {t} = p;
  const a = p.w('path', 0.3), b = p.w('rock', 2.5), cth = p.w('thorns', 5);
  const which = t < b - 0.15 ? 0 : t < cth - 0.15 ? 1 : 2;
  const u = t - [a, b, cth][which] + 0.15;
  const c: C3 = {x: 0, y: 120, z: lerp(1.6, 1.75, ko(u, 0, 2))};
  const bg = ['#C9A47A', '#A89A8A', '#7A6A4A'][which];
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={which === 2 ? 0.3 : 0} />
      <rect x={-3000} y={250} width={6000} height={3000} fill={bg} />
      {which === 0 ? (
        <g>
          {Array.from({length: 7}).map((_, i) => <Seed key={i} x={-240 + i * 80} y={330 + (i % 2) * 20} s={1.4} />)}
          {[0, 1, 2].map((i) => { const peck = Math.max(0, Math.sin(t * 9 + i * 2)); const bx = lerp(-700 + i * 200, -220 + i * 200, ko(u, 0.2 + i * 0.2, 1.2 + i * 0.2)); return (
            <g key={i} transform={`translate(${bx} ${300 + peck * 20}) rotate(${peck * 25})`}>
              <ellipse cx={0} cy={-30} rx={46} ry={32} fill="#5A4A3A" stroke={INK} strokeWidth={5} />
              <circle cx={38} cy={-58} r={22} fill="#5A4A3A" stroke={INK} strokeWidth={5} /><path d="M 56 -60 L 84 -54 L 56 -48 Z" fill="#E8B84A" stroke={INK} strokeWidth={3} />
              <circle cx={44} cy={-64} r={4} fill={INK} />
            </g>
          ); })}
        </g>
      ) : which === 1 ? (
        <g>
          <circle cx={360} cy={-560} r={150} fill="#FFFBEA" /><Glow x={360} y={-560} r={700} o={0.9} />
          <path d="M -500 340 Q -400 140 -100 120 Q 200 100 420 200 Q 520 280 520 340 Z" fill="#9A8E86" stroke={INK} strokeWidth={8} />
          <Sprout x={0} y={140} g={ko(u, 0, 0.6)} wilt={k(u, 1.0, 2.0)} s={1.6} />
        </g>
      ) : (
        <g>
          <Sprout x={0} y={330} g={ko(u, 0, 0.5)} wilt={k(u, 1.2, 2.2) * 0.6} s={1.5} />
          {Array.from({length: 7}).map((_, i) => { const gr = ko(u, 0.3 + i * 0.1, 1.6 + i * 0.1); const sx = -420 + i * 140; return <path key={i} d={`M ${sx} 340 Q ${sx + (i % 2 ? 80 : -80) * gr} ${340 - 260 * gr} ${sx + (i % 2 ? -30 : 30)} ${340 - 420 * gr}`} fill="none" stroke="#3A4A2A" strokeWidth={12} strokeDasharray="18 10" />; })}
          {Array.from({length: 26}).map((_, i) => { const gr = ko(u, 0.4, 1.8); return <path key={'t' + i} d={`M ${(rnd(i) - 0.5) * 900} ${340 - rnd(i + 1) * 380 * gr} l 14 -22 l 8 26 Z`} fill="#2A3A1A" opacity={gr} />; })}
        </g>
      )}
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ good soil: 30, 60, 100 */
const Good: React.FC<SP> = (p) => {
  const {t} = p;
  const nums: [string, number][] = [['30×', p.w('thirty', 3)], ['60×', p.w('sixty', 3.8)], ['100×', p.w('hundred', 4.6)]];
  const grow = (i: number) => ko(t, 0.8 + (i % 9) * 0.12, 2.6 + (i % 9) * 0.12);
  const n = t < nums[1][1] ? 14 : t < nums[2][1] ? 24 : 36;
  const c: C3 = {x: 0, y: lerp(160, 40, k(t, 0, p.dur)), z: lerp(1.35, 1.0, k(t, 0, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky />
      <g filter="url(#dof)"><circle cx={-300} cy={-400} r={160} fill="#FFF0C8" /><Glow x={-300} y={-400} r={700} o={0.8} /></g>
      <rect x={-3000} y={400} width={6000} height={3000} fill="#5A3E26" />
      {Array.from({length: n}).map((_, i) => <Wheat key={i} x={-900 + (i % 18) * 105 + (i >= 18 ? 50 : 0)} y={430 + (i >= 18 ? 60 : 0)} h={Math.max(4, 520 * grow(i))} t={t} s={1.5} col="#F2B65A" />)}
      {nums.map(([s, at], i) => { const o = ko(t, at - 0.05, at + 0.25); return o > 0 && (i === 2 || t < nums[i + 1][1] - 0.05) ? <text key={s} x={0} y={-260 + (1 - o) * 40} textAnchor="middle" fontFamily="Anton" fontSize={220} fill="#FFDD33" stroke="#1c0d16" strokeWidth={16} paintOrder="stroke" opacity={o}>{s}</text> : null; })}
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ the mustard seed */
const Mustard: React.FC<SP> = (p) => {
  const {t} = p;
  const big = p.w('biggest', p.dur * 0.7);
  if (t < big - 0.6) {
    const c: C3 = {x: 0, y: lerp(380, 470, k(t, 0, big - 0.6)), z: lerp(1.4, 2.6, k(t, 0, big - 0.6))};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Sky /><g filter="url(#dof)"><Glow x={0} y={-200} r={700} o={0.7} /></g>
        <g transform="translate(0 760) scale(2.4)"><Hand withered={0} curl={0.3} spread={1.25} skin="#E0A878" sleeve={JESUS.tunic} /></g>
        <circle cx={0} cy={500} r={7} fill="#3A2A18" stroke={INK} strokeWidth={2} />
        <circle cx={0} cy={500} r={40} fill="none" stroke="#FFDD33" strokeWidth={4} opacity={0.5 + 0.5 * Math.sin(t * 5)} />
      </Cam>
    );
  }
  const u = t - (big - 0.6);
  const g = ko(u, 0, 1.8);
  const c: C3 = {x: 0, y: lerp(120, -260, g), z: lerp(1.3, 0.75, g)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky />
      <rect x={-3000} y={420} width={6000} height={3000} fill="#7A6A3A" />
      <path d={`M -30 420 L -40 ${420 - 600 * g} L 40 ${420 - 600 * g} L 30 420 Z`} fill="#6A4A2A" stroke={INK} strokeWidth={8} />
      {[[-260, -420, -1], [240, -480, 1], [0, -620, 0]].map(([bx, by, d], i) => <path key={i} d={`M 0 ${420 - 420 * g} Q ${bx * 0.5 * g} ${420 + (by - 100) * g * 0.8} ${bx * g} ${420 + by * g}`} fill="none" stroke="#6A4A2A" strokeWidth={22 - i * 4} strokeLinecap="round" />)}
      {Array.from({length: 22}).map((_, i) => { const a = (i / 22) * Math.PI * 2; const r = 380 * g * (0.6 + rnd(i) * 0.5); return <circle key={i} cx={Math.cos(a) * r} cy={420 - 700 * g + Math.sin(a) * r * 0.6} r={(130 + rnd(i + 2) * 60) * g} fill={['#5E9A4A', '#4E8A3E', '#6EAA52'][i % 3]} stroke={INK} strokeWidth={6} />; })}
      {g > 0.8 ? Array.from({length: 5}).map((_, i) => { const f = Math.sin(t * 12 + i) * 10; const bx = (rnd(i) - 0.5) * 600 + Math.sin(t + i) * 40, by = -520 + rnd(i + 1) * 300; return <path key={i} d={`M ${bx - 26} ${by + f} L ${bx} ${by} L ${bx + 26} ${by + f}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />; }) : null}
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ evening: across to the other side */
const Evening: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-60, 60, t / p.dur), y: 80, z: 1.05};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.45} /><Sea t={t} y={-80} />
      <BigBoat x={lerp(120, 380, k(t, 0, p.dur))} y={330} sail>
        <Bean x={-200} y={-90} s={0.85} look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
        <Bean x={120} y={-90} s={0.8} look={AP.simon} t={t} face={{eyes: 'open', mouth: 'smile'}} />
      </BigBoat>
      <rect x={-3000} y={720} width={6000} height={3000} fill="#A48460" />
      {[-560, -340].map((x, i) => <Bean key={i} x={x} y={900} s={1.0} look={AP[CREW[i + 1]]} t={t + i} face={{eyes: 'open', mouth: 'grit', look: [1, 0]}} arms="reach" />)}
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ asleep in the stern */
const Sleep: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 220, y: 60, z: lerp(1.35, 1.5, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" /><Stars t={t} n={70} /><Moon x={-300} y={-620} />
      <rect x={-3000} y={220} width={6000} height={3000} fill="#1E2A44" />
      <BigBoat x={0} y={300} tilt={Math.sin(t * 0.9) * 1.5} night sail={false}>
        <g transform="translate(330 -150) rotate(-90)"><Bean x={0} y={0} s={0.85} look={JESUS} t={0.3} face={{eyes: 'closed', mouth: 'smile'}} /></g>
        <rect x={250} y={-200} width={140} height={44} rx={20} fill="#B8A07A" stroke={INK} strokeWidth={5} />
        {[-300, -100].map((x, i) => <Bean key={i} x={x} y={-80} s={0.8} look={AP[CREW[i]]} t={t + i} face={{eyes: 'half', mouth: 'flat', look: [1, 0]}} dim={0.25} />)}
      </BigBoat>
      <Waves t={t} y={320} amp={8} col="#24345A" speed={0.4} />
    </Cam>
  );
};

/* the storm stage, used by storm / wake / rebuke — `calm` 0..1 switches to the still night */
const StormStage: React.FC<{t: number; calm: number; children?: React.ReactNode; boatTilt: number; flash: boolean}> = ({t, calm, children, boatTilt, flash}) => {
  const amp = 120 * (1 - calm), sp = 1;
  return (
    <g>
      <Fill fill="url(#nightSt)" />
      {calm > 0 ? <g opacity={calm}><Stars t={t} n={90} /><Moon x={-320} y={-640} /></g> : null}
      {calm < 1 ? <g opacity={1 - calm}>{Array.from({length: 6}).map((_, i) => <ellipse key={i} cx={(rnd(i) - 0.5) * 2400 + Math.sin(t * 0.6 + i) * 120} cy={-700 + rnd(i + 1) * 300} rx={600} ry={200} fill="#2A2E44" filter="url(#softL)" />)}</g> : null}
      <Waves t={t} y={260} amp={amp + 6} col={calm > 0.5 ? '#1E2A44' : '#24304A'} speed={sp} ph={1} />
      <BigBoat x={0} y={300} tilt={boatTilt * (1 - calm)} night sail={false}>{children}</BigBoat>
      <Waves t={t + 0.7} y={380} amp={amp * 1.3 + 4} col={calm > 0.5 ? '#1A2440' : '#1C2840'} speed={sp * 1.2} ph={2.5} o={0.95} />
      {calm < 1 ? <Rain t={t} o={1 - calm} /> : null}
      {calm < 1 && Math.sin(t * 7) > 0.3 ? Array.from({length: 10}).map((_, i) => <circle key={i} cx={(rnd(i + Math.floor(t * 7)) - 0.5) * 1100} cy={180 - rnd(i + 3) * 260} r={10 + rnd(i) * 14} fill="#BFD6F0" opacity={0.6 * (1 - calm)} />) : null}
      {flash ? <Fill fill="#DDE8FF" o={0.55} /> : null}
    </g>
  );
};
const flashAt = (abs: number, list: number[]) => list.some((x) => abs > x && abs < x + 0.08);

/* 8 ------------------------------------------------------------------ the storm */
const Storm: React.FC<SP> = (p) => {
  const {t} = p;
  const tilt = Math.sin(t * 2.6) * 16;
  const c: C3 = {x: Math.sin(t * 9) * 10, y: 40 + Math.cos(t * 7) * 8, z: lerp(1.0, 1.1, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}
      <StormStage t={t} calm={0} boatTilt={tilt} flash={flashAt(t, [0.6, 2.4, 4.1])}>
        <g transform="translate(330 -150) rotate(-90)"><Bean x={0} y={0} s={0.85} look={JESUS} t={0.3} face={{eyes: 'closed', mouth: 'smile'}} /></g>
        {[-360, -180, 0].map((x, i) => <Bean key={i} x={x} y={-80} s={0.8} look={AP[CREW[i]]} t={t + i} arms={Math.sin(t * 6 + i) > 0 ? 'up' : 'down'} face={{eyes: 'wide', mouth: 'open', brow: -0.8, look: [i === 2 ? 1 : -1, 0]}} />)}
      </StormStage>
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ "Teacher! Don't you care if we drown?" */
const Wake: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: Math.sin(t * 13) * 14, y: -20 + Math.cos(t * 11) * 10, z: 1.9};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="#1C2236" />{flashAt(t, [0.2]) ? <Fill fill="#DDE8FF" o={0.5} /> : null}
      <Bust x={0} y={0} look={AP.simon} t={t} face={{eyes: 'wide', mouth: 'open', brow: -1, look: [1, 0.3]}} />
      <Rain t={t} />
      {Array.from({length: 8}).map((_, i) => { const ph = (t * 1.2 + rnd(i)) % 1; return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${(rnd(i + 4) - 0.5) * 200} ${-120 + ph * 200}) scale(1.6)`} fill="#BFE9F2" stroke={INK} strokeWidth={2} opacity={1 - ph} />; })}
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- "Quiet. Be still." — match cut into stillness */
const Rebuke: React.FC<SP> = (p) => {
  const {t} = p;
  const still = p.w('still', p.dur * 0.6) + 0.25;
  const calm = t > still ? 1 : 0;
  const tilt = Math.sin(t * 2.6) * 16;
  const c: C3 = calm ? {x: 0, y: 60, z: 1.05} : {x: Math.sin(t * 9) * 10, y: 60 + Math.cos(t * 7) * 8, z: 1.05};
  return (
    <Cam c={c} p={p}>
      {RDEFS}
      <StormStage t={calm ? still + (t - still) * 0.1 : t} calm={calm} boatTilt={tilt} flash={!calm && flashAt(t, [0.1])}>
        <Bean x={140} y={-110} s={0.95} look={JESUS} t={t} face={{eyes: 'open', mouth: calm ? 'flat' : 'open', brow: 0.6, look: [-0.5, -0.3]}} arms={calm ? 'down' : 'point'} flip />
        {[-360, -180].map((x, i) => <Bean key={i} x={x} y={-80} s={0.8} look={AP[CREW[i]]} t={calm ? 1 + i : t + i} arms={calm ? 'none' : 'up'} face={{eyes: 'wide', mouth: calm ? 'flat' : 'open', brow: -0.6, look: [1, 0]}} />)}
      </StormStage>
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- completely calm */
const Calm: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: lerp(-60, -160, t / p.dur), z: lerp(0.75, 0.68, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" /><Stars t={t * 0.3} n={140} /><Moon x={0} y={-700} />
      <rect x={-3000} y={220} width={6000} height={3000} fill="#1A2440" />
      <polygon points="-60,230 60,230 140,1500 -140,1500" fill="#F4F0E2" opacity={0.18} />
      <BigBoat x={0} y={260} night sail={false}><Bean x={140} y={-110} s={0.95} look={JESUS} t={1} face={{eyes: 'open', mouth: 'flat'}} flip />{[-360, -180].map((x, i) => <Bean key={i} x={x} y={-80} s={0.8} look={AP[CREW[i]]} t={1 + i} face={{eyes: 'wide', mouth: 'flat', look: [1, 0]}} />)}</BigBoat>
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- "Why are you so afraid?" */
const Faith: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: -20, z: lerp(1.9, 2.1, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" /><Moon x={-420} y={-620} />
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t < p.dur - 1 && Math.sin(t * 12) > 0 ? 'open' : 'smile', brow: 0.2, look: [1, 0]}} />
    </Cam>
  );
};

/* 13 ----------------------------------------------------------------- "Who is this?" */
const WhoIs: React.FC<SP> = (p) => {
  const {t} = p;
  const ob = p.w('obey', p.dur * 0.75) - 0.4;
  if (t < ob) {
    const look = Math.sin(t * 1.6);
    const c: C3 = {x: 0, y: 60, z: lerp(1.45, 1.55, t / ob)};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Fill fill="url(#nightSt)" /><Moon x={380} y={-640} />
        {[-260, 260].map((x, i) => <Bust key={i} x={x} y={i * 40} s={1.15} look={AP[CREW[i * 3]]} t={t + i} face={{eyes: 'wide', mouth: 'open', brow: -0.7, look: [i ? -1 : 1 * (look > 0 ? 1 : 0.4), 0]}} />)}
      </Cam>
    );
  }
  const u = t - ob;
  const g = ko(u, 0, p.dur - ob);
  const c: C3 = {x: 0, y: lerp(100, -300, g), z: lerp(1.0, 0.35, g)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" /><Stars t={t * 0.3} n={160} /><Moon x={0} y={-1200} />
      <rect x={-6000} y={220} width={12000} height={6000} fill="#1A2440" />
      <polygon points="-60,230 60,230 400,3000 -400,3000" fill="#F4F0E2" opacity={0.15} />
      <BigBoat x={0} y={260} night sail={false}><Bean x={140} y={-110} s={0.95} look={JESUS} t={1} face={{eyes: 'open', mouth: 'smile'}} flip />{[-360, -180].map((x, i) => <Bean key={i} x={x} y={-80} s={0.8} look={AP[CREW[i]]} t={1 + i} face={{eyes: 'wide', mouth: 'flat'}} />)}</BigBoat>
    </Cam>
  );
};

/* 14 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 0, z: 1};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="url(#nightSt)" /><Stars t={t} n={80} />
      <circle cx={0} cy={330} r={240} fill="#F4F0E2" /><Glow x={0} y={330} r={700} o={0.45} id="gWhite" />
      <rect x={-3000} y={560} width={6000} height={3000} fill="#0F1628" />
      <polygon points="-50,565 50,565 160,1500 -160,1500" fill="#F4F0E2" opacity={0.15} />
      <g transform="translate(0 560) scale(0.3)"><BigBoat x={0} y={0} night sail /></g>
    </Cam>
  );
};

export const SCENES6: Record<string, React.FC<SP>> = {shore: Shore, sower: Sower, seeds: Seeds, good: Good, mustard: Mustard, evening: Evening, sleep: Sleep, storm: Storm, wake: Wake, rebuke: Rebuke, calm: Calm, faith: Faith, whois: WhoIs, end: End};
