import React from 'react';
import {Face, FRIENDS, JESUS, Look, SCRIBE} from '../v8/fig';
import {C3, Cam, Fill, Glow, SP, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Hand, Wheat} from './anime';
import {BenchR, Bean, OilLamp, RDEFS, Room, SunPatch} from './room';

/** Episode 4 — "Lord of the Sabbath", 2nd reference: narrated cartoon people in dim, lit, depth-of-field sets. */
const MAN: Look = {skin: '#D9A07C', hair: '#2E2018', tunic: '#5E7C6A', sash: '#3A4E40', style: 'short', beard: true};
const PH = (i: number): Look => ({...SCRIBE, sash: ['#3E5C9A', '#6A3E3E', '#3E6A5A', '#5A4A7A'][i % 4]});
const H = (x: number, y: number, s: number, el: React.ReactNode, rot = 0) => <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>{el}</g>;
const Bust: React.FC<{x: number; y: number; look: Look; face?: Face; t?: number}> = ({x, y, look, face, t = 0}) => <g transform={`translate(${x} ${y}) scale(1.5)`}><Bean x={0} y={440} look={look} face={face} t={t} /></g>;
const flash = (t: number, at: number, len = 0.1) => t > at && t < at + len;
const Dust: React.FC<{t: number; frozen?: boolean; o?: number}> = ({t, frozen, o = 0.7}) => (
  <g opacity={o}>{Array.from({length: 40}).map((_, i) => { const tt = frozen ? 1.2 : t; const ph = (tt * (0.03 + rnd(i) * 0.04) + rnd(i + 2)) % 1; return <circle key={i} cx={(rnd(i + 5) - 0.5) * 1400 + Math.sin(tt + i) * 20} cy={-1000 + ph * 2000} r={2 + rnd(i + 1) * 4} fill="#FFE2B0" opacity={0.3 + rnd(i + 9) * 0.5} />; })}</g>
);

/* the synagogue: dim stone hall, one high window throwing a hard diagonal patch */
const Hall: React.FC<{t: number; frozen?: boolean; blur?: boolean; dark?: number}> = ({t, frozen, blur = true, dark = 0}) => (
  <g filter={blur ? 'url(#dof)' : undefined}>
    <Room t={t} wall="#6A5A50" floor="#4A3426" win={false} />
    {[-900, -380, 380, 900].map((x) => <rect key={x} x={x - 60} y={-3000} width={120} height={3300} fill="#5A4A40" stroke="#2a201a" strokeWidth={6} />)}
    <rect x={120} y={-980} width={200} height={260} fill="#FFE6B0" />
    <SunPatch pts="120,-720 320,-720 760,300 360,300" o={0.45} />
    <SunPatch pts="360,300 760,300 980,700 420,700" o={0.35} />
    <OilLamp x={-560} y={-120} t={t} />
    <Dust t={t} frozen={frozen} />
    {dark ? <rect x={-3000} y={-3000} width={6000} height={6000} fill="#08060e" opacity={dark} /> : null}
  </g>
);

/* 1 ------------------------------------------------------------------ the grain fields */
const Field: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = 3.35;
  if (t < cut) {
    const reach = ko(t, 1.0, 1.9), grab = k(t, 2.0, 2.4), pull = k(t, 2.5, 3.2);
    const c: C3 = {x: lerp(-40, 40, t / cut), y: -140, z: 1.05};
    return (
      <Cam c={c} p={p}>
        {RDEFS}
        <Fill fill="url(#goldHour)" />
        <g filter="url(#dof)"><circle cx={260} cy={120} r={170} fill="#FFF0C8" /><Glow x={260} y={120} r={700} o={0.8} />
          {Array.from({length: 30}).map((_, i) => <Wheat key={i} x={-1300 + i * 90} y={600} h={420 + (i % 4) * 60} t={t} s={1.2} col="#D9A050" />)}</g>
        {Array.from({length: 12}).map((_, i) => <Wheat key={'n' + i} x={-900 + i * 170} y={1400} h={1250 + (i % 3) * 120} t={t + 1} s={2.6} col="#F2B65A" />)}
        {H(lerp(320, 160, reach), lerp(1500, 420, reach) + pull * 220, 2.2, <Hand withered={0} curl={grab * 0.85} skin="#E0A878" sleeve="#C0663A" t={t} />, -8)}
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: lerp(-80, 80, u / (p.dur - cut)), y: 40, z: 1.05};
  return (
    <Cam c={c} p={p}>
      {RDEFS}
      <Fill fill="url(#goldHour)" />
      <g filter="url(#dof)"><circle cx={-300} cy={-120} r={130} fill="#FFF0C8" /><Glow x={-300} y={-120} r={600} o={0.7} />
        <path d="M -1500 120 Q -800 -60 -200 80 Q 500 -40 1500 100 L 1500 400 L -1500 400 Z" fill="#9A7A5A" /></g>
      <rect x={-3000} y={250} width={6000} height={2000} fill="#B8894E" />
      {Array.from({length: 26}).map((_, i) => <Wheat key={'b' + i} x={-1400 + i * 110} y={330} h={260 + (i % 3) * 40} t={t} s={1} col="#D9A050" />)}
      {[JESUS, FRIENDS[0], FRIENDS[1], FRIENDS[2]].map((L, i) => <Bean key={i} x={-480 + i * 300 + u * 70} y={470 + (i % 2) * 20} s={0.78} look={L} t={t + i * 0.3} walk={1} face={{eyes: 'half', mouth: i === 0 ? 'smile' : 'flat', look: [1, 0]}} arms={i === 1 ? 'reach' : 'none'} />)}
      {Array.from({length: 14}).map((_, i) => <Wheat key={'f' + i} x={-1200 + i * 180} y={1100} h={520 + (i % 3) * 80} t={t + 2} s={1.9} col="#E8AE58" />)}
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ the Pharisees notice */
const Watchers: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = Math.min(1.1, p.w('breaking', 1.1) - 0.4);
  if (t < cut) {
    const c: C3 = {x: 0, y: -60, z: 1.0};
    return (
      <Cam c={c} p={p}>
        {RDEFS}
        <Fill fill="url(#goldHour)" />
        <g filter="url(#dof)"><Glow x={300} y={-200} r={700} o={0.7} />{Array.from({length: 20}).map((_, i) => <Wheat key={i} x={-1200 + i * 130} y={500} h={300} t={t} s={1.1} col="#D9A050" />)}</g>
        {[-300, 0, 300].map((x, i) => <Bean key={i} x={x} y={460} s={0.9} look={PH(i)} t={t + i} face={{eyes: 'half', mouth: 'frown', brow: -0.9, look: [i === 2 ? -1 : 1, 0]}} arms={i === 1 ? 'cross' : 'none'} />)}
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: -60, z: lerp(1.75, 1.95, k(t, cut, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}
      <Fill fill="url(#goldHour)" /><g filter="url(#dof)"><Glow x={-300} y={-300} r={600} o={0.7} />{Array.from({length: 20}).map((_, i) => <Wheat key={i} x={-1200 + i * 130} y={300} h={300} t={t} s={1.1} col="#D9A050" />)}</g>
      <Bust x={0} y={0} look={PH(0)} t={t} face={{eyes: 'half', mouth: Math.sin(t * 14) > 0 ? 'open' : 'frown', brow: -1, look: [1, 0]}} />
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ Jesus answers */
const Reply: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: lerp(0, -30, t / p.dur), z: lerp(1.75, 2.0, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}
      <Fill fill="url(#goldHour)" />
      <g filter="url(#dof)"><circle cx={-420} cy={-120} r={150} fill="#FFF0C8" /><Glow x={-420} y={-120} r={700} o={0.8} />{Array.from({length: 9}).map((_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 1100} cy={(rnd(i + 2) - 0.3) * 600} r={30 + rnd(i + 4) * 40} fill="#FFE2A0" opacity={0.4} />)}</g>
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'half', mouth: t > 0.3 && t < p.dur - 1.2 && Math.sin(t * 13) > 0 ? 'open' : 'smile', brow: 0.3, look: [-1, 0]}} />
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ the synagogue, the withered hand */
const HandSc: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = p.w('withered', 2.4) - 0.35;
  if (t < cut) {
    const c: C3 = {x: lerp(-40, 160, t / cut), y: 120, z: lerp(1.3, 1.4, t / cut)};
    return (
      <Cam c={c} p={p}>
        {RDEFS}
        <Hall t={t} />
        <BenchR x={-420} y={560} w={700} /><BenchR x={460} y={560} w={600} />
        {[-640, -380, 640].map((x, i) => <Bean key={i} x={x} y={520} s={0.8} sit look={i === 2 ? PH(1) : {...FRIENDS[i + 1], beard: true}} t={t + i} face={{eyes: 'half', look: [1, 0]}} dim={0.25} />)}
        <Bean x={360} y={520} s={0.85} sit look={MAN} t={t} face={{eyes: 'half', mouth: 'frown', brow: -0.4, look: [0, 1]}} />
      </Cam>
    );
  }
  const c: C3 = {x: 60, y: 40, z: lerp(1.9, 2.1, k(t, cut, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}
      <Hall t={t} />
      <path d="M -600 300 Q -100 160 600 220 L 700 900 L -700 900 Z" fill={MAN.tunic} stroke="#2a1420" strokeWidth={8} />
      <SunPatch pts="-300,-900 0,-900 420,900 20,900" o={0.3} />
      {H(230, 140, 1.5, <Hand withered={1} t={t} sleeve={MAN.tunic} />, -80 + Math.sin(t * 20) * 1.2)}
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ they watched */
const Watch: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = Math.max(2.4, p.dur - 1.6);
  if (t < cut) {
    const c: C3 = {x: lerp(-60, 60, t / cut), y: -40, z: 1.25};
    return (
      <Cam c={c} p={p}>
        {RDEFS}
        <Hall t={t} dark={0.55} />
        {[-420, -140, 140, 420].map((x, i) => <Bean key={i} x={x} y={560 + (i % 2) * 40} s={0.95} look={PH(i)} t={t + i} face={{eyes: 'half', mouth: 'frown', brow: -1, look: [0.6 - i * 0.3, 0]}} arms={i % 2 ? 'cross' : 'none'} dim={0.35 - 0.3 * ko(t, i * 0.4, i * 0.4 + 0.6)} />)}
        <OilLamp x={0} y={700} t={t} r={700} />
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: -20, z: lerp(2.9, 3.2, k(t, cut, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}
      <Hall t={t} dark={0.6} />
      <Bust x={0} y={0} look={PH(2)} t={t} face={{eyes: 'half', mouth: 'flat', brow: -1, look: [1, 0]}} />
      <OilLamp x={160} y={420} t={t} r={500} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ "Stand up. Come to the middle." */
const Stand: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = p.w('come', 1.2) - 0.1;
  if (t < cut) {
    const c: C3 = {x: -20, y: -10, z: lerp(1.8, 1.95, t / cut)};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Hall t={t} />
        <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 13) > 0 ? 'open' : 'flat', brow: 0.3, look: [1, 0]}} />
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: 260, y: 0, z: 1.15};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Hall t={t} />
      <BenchR x={-160} y={560} w={600} />
      <Bean x={lerp(360, 300, ko(u, 0, 0.8))} y={560} s={1} sit={u < 0.35} look={MAN} t={t} face={{eyes: 'wide', mouth: 'open', brow: -0.6, look: [-1, 0]}} shake={1.5} />
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ the question */
const Question: React.FC<SP> = (p) => {
  const {t} = p;
  const cuts = ['good', 'life', 'kill'].map((w) => p.w(w, -10));
  const ci = cuts.findIndex((a) => t > a + 0.05 && t < a + 0.6);
  if (ci >= 0) {
    const c: C3 = {x: 0, y: -10, z: 2.0};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Hall t={t} dark={0.45} />
        <Bust x={0} y={0} look={PH(ci)} t={t} face={{eyes: ci === 2 ? 'open' : 'half', mouth: 'frown', brow: -1, look: [ci % 2 ? 1 : -1, 0]}} />
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: lerp(0, -20, t / p.dur), z: lerp(1.9, 2.3, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Hall t={t} />
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'flat', brow: 0.8, look: [0, 0]}} />
    </Cam>
  );
};

/* 8 ------------------------------------------------------------------ silence */
const Silence: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 140, z: lerp(1.2, 1.28, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Hall t={1} frozen />
      {[-700, -480, 520, 740].map((x, i) => <Bean key={i} x={x} y={580} s={0.82} look={PH(i)} t={1 + i} face={{eyes: 'half', mouth: 'flat', brow: -0.8, look: [x > 0 ? -1 : 1, 0]}} dim={0.2} />)}
      <Bean x={-200} y={560} s={0.9} look={JESUS} t={1} face={{eyes: 'open', mouth: 'flat', brow: 0.6, look: [1, 0]}} />
      <Bean x={200} y={560} s={0.9} look={MAN} t={1} face={{eyes: 'wide', mouth: 'flat', look: [-1, 0]}} />
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ "Stretch out your hand." */
const Stretch: React.FC<SP> = (p) => {
  const {t} = p;
  const cut = Math.min(1.25, p.dur * 0.45);
  if (t < cut) {
    const c: C3 = {x: 0, y: -40, z: lerp(2.6, 2.9, t / cut)};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Hall t={t} dark={0.3} />
        <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: 'grit', brow: 0.9, look: [1, 0]}} />
      </Cam>
    );
  }
  const reach = ko(t - cut, 0, p.dur - cut);
  const c: C3 = {x: 0, y: -60, z: 1.0};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Hall t={t} />
      <g filter="url(#dof)"><Bean x={0} y={560} s={1.0} look={MAN} t={t} face={{eyes: 'wide', mouth: 'flat', look: [0, 1]}} /></g>
      {H(Math.sin(t * 24) * 4, lerp(900, 260, reach), lerp(1.2, 3.0, reach), <Hand withered={1} t={t} sleeve={MAN.tunic} />)}
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- made whole */
const Heal: React.FC<SP> = (p) => {
  const {t} = p;
  const st = 0.05;
  const h = k(t, st + 0.15, st + 1.3);
  const cut = Math.max(2.0, p.dur - 1.3);
  if (t < cut) {
    const c: C3 = {x: Math.sin(t * 60) * (t > st ? Math.exp(-(t - st) * 4) * 16 : 0), y: -60, z: 1.0};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Hall t={t} />
        <Glow x={0} y={-60} r={500 + h * 700} o={0.35 + h * 0.6} id="gWhite" />
        {H(0, 260, 3.0, <Hand withered={1 - h} curl={1 - h} spread={1 + h * 0.4} t={t} sleeve={MAN.tunic} />)}
        {[0, 1, 2].map((i) => { const r = (t - st - 0.2 - i * 0.15) * 1500; return r > 0 ? <circle key={i} cx={0} cy={-60} r={r} fill="none" stroke="#FFF6D8" strokeWidth={24 - i * 7} opacity={Math.max(0, 0.9 - (t - st) * 0.8)} /> : null; })}
        {flash(t, st + 0.2, 0.12) ? <Fill fill="#fff" o={0.75} /> : null}
      </Cam>
    );
  }
  const u = t - cut;
  const c: C3 = {x: 0, y: -10, z: lerp(1.9, 2.05, u / (p.dur - cut))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Hall t={t} /><Glow x={0} y={-200} r={700} o={0.5} />
      <Bust x={0} y={0} look={MAN} t={t} face={{eyes: 'closed', mouth: 'smile', brow: 0.2}} />
      {[0, 1].map((i) => { const ph = (t * 0.6 + i * 0.5) % 1; return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${i ? 32 : -32} ${14 + ph * 60}) scale(1.4)`} fill="#BFE9F2" stroke="#2a1420" strokeWidth={2.5} opacity={1 - ph} />; })}
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- the plot at night */
const Plot: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = p.segs[1] - 0.15;
  const die = p.w('die', p.dur - 1.5);
  if (t < s1) {
    const c: C3 = {x: lerp(-60, 60, t / s1), y: 20, z: 1.05};
    return (
      <Cam c={c} p={p}>
        {RDEFS}
        <Fill fill="url(#nightSt)" />
        <g filter="url(#dof)">
          {[-760, 0, 760].map((x, i) => <rect key={i} x={x - 330} y={-700 + (i % 2) * 80} width={660} height={1100} fill="#24283a" stroke="#141826" strokeWidth={8} />)}
          {[-760, 760].map((x, i) => <g key={'w' + i}><rect x={x - 80} y={-360} width={160} height={200} fill="#FFB866" /><Glow x={x} y={-260} r={300} o={0.6} /></g>)}
        </g>
        <rect x={-3000} y={400} width={6000} height={2000} fill="#14161f" />
        <path d="M -140 400 L -140 -140 Q 0 -260 140 -140 L 140 400 Z" fill="#FFB866" />
        <SunPatch pts="-140,400 140,400 420,1300 -420,1300" o={0.5} col="#FFB866" />
        {[0, 1, 2].map((i) => <Bean key={i} x={lerp(-260 + i * 260, -120 + i * 120, t / s1)} y={lerp(1000, 420, t / s1)} s={lerp(1.0, 0.55, t / s1)} look={PH(i)} t={t + i * 0.4} walk={1} face={{eyes: 'half', mouth: 'frown', brow: -1}} dim={0.7} />)}
      </Cam>
    );
  }
  const out = ko(t, die + 0.35, die + 0.7);
  const c: C3 = {x: 0, y: 30, z: lerp(2.3, 2.6, k(t, s1, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}
      <Fill fill="#07080e" />
      <OilLamp x={-40} y={300} t={t} r={650 * (1 - out) + 1} />
      <Bust x={0} y={0} look={PH(1)} t={t} face={{eyes: 'half', mouth: t > die - 0.2 && t < die + 0.4 ? 'open' : 'frown', brow: -1.2, look: [0, 0.4]}} />
      <Fill fill="#000" o={0.35 + out * 0.6} />
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 0, z: 1};
  return (
    <Cam c={c} p={p}>
      {RDEFS}
      <Fill fill="url(#nightSt)" />
      <circle cx={0} cy={300} r={220} fill="#F2EEDF" /><Glow x={0} y={300} r={700} o={0.45} id="gWhite" />
      <path d="M -3000 640 Q -300 520 0 560 Q 300 520 3000 640 L 3000 3000 L -3000 3000 Z" fill="#0b0c14" />
      <Bean x={0} y={570} s={0.35} look={{...JESUS, skin: '#0b0c14', hair: '#0b0c14', tunic: '#0b0c14', sash: '#0b0c14'}} t={t} face={{eyes: 'closed', mouth: 'none'}} />
    </Cam>
  );
};

export const SCENES4R: Record<string, React.FC<SP>> = {field: Field, watchers: Watchers, reply: Reply, hand: HandSc, watch: Watch, stand: Stand, question: Question, silence: Silence, stretch: Stretch, heal: Heal, plot: Plot, end: End};
