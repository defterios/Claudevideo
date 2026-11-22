import React from 'react';
import {FRIENDS, INK, JESUS, Look} from '../v8/fig';
import {C3, Cam, Fill, Glow, SP, k, ko, lerp, lin, rnd} from '../v8/scenes';
import {Hand} from '../v11/anime';
import {Bean, OilLamp, RDEFS, Room, SunPatch} from '../v11/room';
import {Bust, Sea, Sky} from '../v12/scenes';
import {BigBoat} from '../v13/scenes';

/** Episode 8 — "Talitha Koum" (Mark 5:21-43), lit-room cartoon style. Big moment: the girl rises on "get up". */
export const JAIRUS: Look = {skin: '#D2A07E', hair: '#2A2018', tunic: '#3E4E7A', sash: '#C9A35A', style: 'hood', wrap: '#2E3A5E', beard: true};
export const WOMAN: Look = {skin: '#C9A08A', hair: '#3A2A22', tunic: '#7A6A60', sash: '#5A4A40', style: 'hood', wrap: '#6A5A54', beard: false, gaunt: 0.7};
export const WOMAN_OK: Look = {...WOMAN, skin: '#E0A880', tunic: '#8A6A9A', wrap: '#6A4A7A', gaunt: 0};
export const GIRL: Look = {skin: '#E8B48C', hair: '#3A2418', tunic: '#E8D9B8', sash: '#C9705A', style: 'long', beard: false};
const MOTHER: Look = {skin: '#D9A07C', hair: '#3A2418', tunic: '#7A3E4A', sash: '#C9A35A', style: 'hood', wrap: '#5A2E3A', beard: false};
const SERVANT: Look = {...FRIENDS[2], tunic: '#8A7A5A', sash: '#5A4A30'};
const CROWD = (i: number): Look => ({...FRIENDS[i % 4], tunic: ['#A8794A', '#6A7A5A', '#8A5A5A', '#5A6A8A', '#9A8A5A', '#7A5A7A'][i % 6]});
const shake = (t: number, at: number, amp = 12, decay = 4) => (t > at ? Math.exp(-(t - at) * decay) * amp : 0);
export const Street: React.FC<{t: number; dusk?: number}> = ({dusk = 0}) => (
  <g>
    <Sky dusk={dusk} />
    <g filter="url(#dof)">{[-1100, -620, -140, 360, 860, 1340].map((x, i) => <rect key={i} x={x - 220} y={-360 + (i % 2) * 70} width={440} height={720} fill={['#D9B48C', '#CDA27A', '#E0C09A'][i % 3]} stroke="#8a6a4a" strokeWidth={6} />)}</g>
    <rect x={-3000} y={330} width={6000} height={3000} fill="#B8946A" />
  </g>
);
export const Packed: React.FC<{t: number; y: number; n?: number; s?: number; skip?: number; dim?: number}> = ({t, y, n = 12, s = 0.9, skip = 9999, dim = 0}) => (
  <g>{Array.from({length: n}).map((_, i) => i === skip ? null : <Bean key={i} x={-1100 + i * 190 + (i % 2) * 40} y={y + (i % 3) * 26} s={s} look={CROWD(i)} t={t + i} face={{eyes: 'open', mouth: i % 3 ? 'open' : 'flat', look: [i % 2 ? -1 : 1, 0]}} dim={dim} />)}</g>
);
/** a figure lying on a bed; x,y = bed centre */
export const Bed: React.FC<{x: number; y: number; t: number; look: Look; up?: number; face?: React.ComponentProps<typeof Bean>['face']}> = ({x, y, t, look, up = 0, face}) => (
  <g>
    <rect x={x - 300} y={y - 20} width={600} height={56} rx={14} fill="#C9B48A" stroke={INK} strokeWidth={6} />
    <rect x={x - 280} y={y + 36} width={30} height={90} fill="#6E4A30" stroke={INK} strokeWidth={5} /><rect x={x + 250} y={y + 36} width={30} height={90} fill="#6E4A30" stroke={INK} strokeWidth={5} />
    <g transform={`translate(${x + 200 - up * 160} ${y - 10}) rotate(${-90 + up * 90})`}><Bean x={0} y={0} s={0.72} look={look} t={t} face={face} sit={up > 0.3 && up < 0.95} /></g>
    {up < 0.3 ? <rect x={x - 10} y={y - 64} width={250} height={54} rx={22} fill="#E8DCC4" stroke={INK} strokeWidth={5} /> : null}
  </g>
);

/* 1 ------------------------------------------------------------------ Jairus pushes through */
const Lake: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-200, 120, k(t, 0, p.dur)), y: 220, z: 1.25};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky /><Sea t={t} y={-120} />
      <BigBoat x={700} y={240} sail><Bean x={-40} y={-100} s={0.85} look={JESUS} t={t} flip face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} /></BigBoat>
      <rect x={-3000} y={380} width={6000} height={3000} fill="#C9A47A" />
      <Packed t={t} y={720} n={10} s={0.95} skip={4} />
      <Bean x={lerp(-900, 220, k(t, 0.3, p.dur - 0.5))} y={760} s={1.05} look={JAIRUS} t={t} walk={1.6} arms="reach" face={{eyes: 'wide', mouth: 'open', brow: -0.8, look: [1, 0]}} />
    </Cam>
  );
};

/* 2 ------------------------------------------------------------------ "My little daughter is dying" */
const Plea: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: -20, z: lerp(1.95, 2.15, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky /><g filter="url(#dof)"><Glow x={300} y={-300} r={600} o={0.6} /><Sea t={t} y={260} /></g>
      <Bust x={0} y={0} look={JAIRUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'frown', brow: -0.9, look: [1, -0.3]}} />
      {[0, 1].map((i) => { const ph = (t * 0.5 + i * 0.5) % 1; return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${i ? 32 : -32} ${14 + ph * 60}) scale(1.4)`} fill="#BFE9F2" stroke={INK} strokeWidth={2.5} opacity={1 - ph} />; })}
    </Cam>
  );
};

/* 3 ------------------------------------------------------------------ the crowd presses in */
const Crowd: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(-60, 60, t / p.dur), y: 180, z: lerp(1.2, 1.35, t / p.dur)};
  const squeeze = ko(t, 0.5, p.dur);
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Street t={t} />
      {Array.from({length: 7}).map((_, i) => <Bean key={i} x={(i < 3 ? -1 : 1) * lerp(700, 300, squeeze) + (i % 3) * (i < 3 ? -160 : 160)} y={640 + (i % 2) * 30} s={0.92} flip={i >= 3} look={CROWD(i)} t={t + i} walk={1} face={{eyes: 'open', mouth: 'open', look: [i < 3 ? 1 : -1, 0]}} />)}
      <Bean x={-60} y={660} s={1.0} look={JESUS} t={t} walk={1} face={{eyes: 'open', mouth: 'flat', look: [1, 0]}} />
      <Bean x={110} y={670} s={0.95} look={JAIRUS} t={t + 0.4} walk={1} face={{eyes: 'open', mouth: 'frown', brow: -0.6, look: [1, 0]}} />
      <Packed t={t} y={980} n={8} s={1.15} />
    </Cam>
  );
};

/* 4 ------------------------------------------------------------------ the woman: 12 years */
const Woman: React.FC<SP> = (p) => {
  const {t} = p;
  const s1 = Math.max(2.4, p.dur * 0.5);
  if (t < s1) {
    const c: C3 = {x: 0, y: -20, z: lerp(1.9, 2.1, t / s1)};
    const n = Math.min(12, Math.floor(lin(t, 0.5, s1 - 0.3) * 12) + (t > 0.5 ? 1 : 0));
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Street t={t} dusk={0.2} />
        <Bust x={0} y={60} look={WOMAN} t={t} face={{eyes: 'half', mouth: 'frown', brow: -0.6, look: [0, 1]}} />
        {Array.from({length: n}).map((_, i) => { const g5 = Math.floor(i / 5), r = i % 5; const gx = -240 + g5 * 180, gy = -360; return r < 4 ? <line key={i} x1={gx + r * 26} y1={gy} x2={gx + r * 26} y2={gy + 80} stroke="#FBEFD9" strokeWidth={10} strokeLinecap="round" /> : <line key={i} x1={gx - 16} y1={gy + 66} x2={gx + 96} y2={gy + 10} stroke="#FBEFD9" strokeWidth={10} strokeLinecap="round" />; })}
      </Cam>
    );
  }
  const u = t - s1;
  const c: C3 = {x: 0, y: 160, z: 1.3};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Room t={t} wall="#6A5648" floor="#4A3426" win={false} /><OilLamp x={-380} y={-60} t={t} />
      <Bean x={-200} y={640} s={1.0} look={{...FRIENDS[3], tunic: '#EDE6D6', sash: '#8A3A3A'}} t={t} arms="offer" face={{eyes: 'half', mouth: 'flat', look: [1, 0]}} />
      <Bean x={220} y={640} s={0.95} look={WOMAN} t={t} flip arms="offer" face={{eyes: 'open', mouth: 'frown', brow: -0.5, look: [-1, 0]}} />
      {Array.from({length: 6}).map((_, i) => { const q = lin(u, i * 0.25, i * 0.25 + 0.6); return q > 0 && q < 1 ? <ellipse key={i} cx={lerp(130, -110, q)} cy={260 - Math.sin(q * Math.PI) * 120} rx={18} ry={7} fill="#E8B84A" stroke={INK} strokeWidth={3} /> : null; })}
    </Cam>
  );
};

/* 5 ------------------------------------------------------------------ "If I just touch his clothes…" */
const Thought: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: -20, z: lerp(2.1, 2.35, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Street t={t} />
      <g filter="url(#dofS)"><Glow x={0} y={0} r={500} o={0.3} /></g>
      <Bust x={0} y={0} look={WOMAN} t={t} face={{eyes: 'open', mouth: 'flat', brow: -0.3, look: [1, 0.6]}} />
    </Cam>
  );
};

/* 6 ------------------------------------------------------------------ the touch: everything stops */
const Touch: React.FC<SP> = (p) => {
  const {t} = p;
  const tc = p.w('touched', p.dur * 0.35), st = p.w('stopped', p.dur * 0.8);
  const reach = ko(t, 0.2, tc);
  const frozen = t > tc;
  const glow = ko(t, tc, tc + 0.8);
  if (t < st - 0.4) {
    const c: C3 = {x: 0, y: -60, z: lerp(1.15, 1.3, t / tc)};
    const tt = frozen ? tc : t;
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Street t={tt} />
        <path d="M -260 -900 L 260 -900 L 330 -100 Q 0 -50 -330 -100 Z" fill={JESUS.tunic} stroke={INK} strokeWidth={10} />
        <path d="M -330 -150 Q 0 -100 330 -150 L 330 -100 Q 0 -50 -330 -100 Z" fill={JESUS.sash} stroke={INK} strokeWidth={6} />
        {[-440, 420].map((x, i) => <Bean key={i} x={x} y={560} s={1.1} look={CROWD(i)} t={tt + i} walk={frozen ? 0 : 1} face={{eyes: 'open', mouth: 'open'}} />)}
        <Glow x={30} y={-110} r={200 + glow * 500} o={glow * 0.9} id="gWhite" />
        <g transform={`translate(${lerp(260, 60, reach)} ${lerp(900, 70, reach)}) scale(1.7) rotate(-14)`}><Hand withered={0} curl={0.2 + reach * 0.3} spread={0.9} skin="#C9A08A" sleeve={WOMAN.tunic} /></g>
        {frozen ? <Fill fill="#FFF6D8" o={glow * 0.15} /> : null}
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: -20, z: 2.1};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Street t={tc} /><Glow x={0} y={-60} r={700} o={0.6} id="gWhite" />
      <Bust x={0} y={0} look={WOMAN_OK} t={t} face={{eyes: 'wide', mouth: 'open', brow: -0.3, look: [0, -0.4]}} />
    </Cam>
  );
};

/* 7 ------------------------------------------------------------------ "Who touched my clothes?" */
const Who: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: -20, z: lerp(1.95, 2.1, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Street t={t} />
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: t > 0.3 && t < p.dur - 0.6 && Math.sin(t * 12) > 0 ? 'open' : 'flat', brow: 0.2, look: [Math.sin(t * 2) > 0 ? 1 : -1, 0]}} />
    </Cam>
  );
};

/* 8 ------------------------------------------------------------------ trembling at his feet */
const Feet: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 40, y: 200, z: 1.3};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Street t={t} />
      {[-560, -380, 560, 740].map((x, i) => <Bean key={i} x={x} y={620} s={0.95} flip={x > 0} look={CROWD(i + 2)} t={t + i} face={{eyes: 'wide', mouth: 'flat', look: [x > 0 ? -1 : 1, 0.3]}} />)}
      <Bean x={-160} y={650} s={1.0} look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [1, 0.6]}} />
      <Bean x={150} y={650} s={0.95} look={WOMAN_OK} t={t} flip sit shake={1.6} arms="up" face={{eyes: 'open', mouth: 'open', brow: -0.6, look: [-1, -0.6]}} />
    </Cam>
  );
};

/* 9 ------------------------------------------------------------------ "Go in peace" */
const Peace: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: -20, z: lerp(1.95, 2.15, t / p.dur)};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Street t={t} /><g filter="url(#dof)"><Glow x={-300} y={-300} r={600} o={0.7} /></g>
      <Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 12) > 0 ? 'open' : 'smile', brow: 0.3, look: [1, 0.5]}} />
    </Cam>
  );
};

/* 10 ----------------------------------------------------------------- the servant: "Your daughter is dead" */
const News: React.FC<SP> = (p) => {
  const {t} = p;
  const dead = p.w('dead', 1.0);
  if (t < dead + 0.4) {
    const c: C3 = {x: 100, y: 200, z: 1.25};
    return (
      <Cam c={c} p={p}>
        {RDEFS}<Street t={t} dusk={0.25} />
        <Bean x={-200} y={660} s={1.0} look={JAIRUS} t={t} face={{eyes: 'open', mouth: 'flat', look: [1, 0]}} />
        <Bean x={lerp(900, 260, ko(t, 0, dead))} y={660} s={1.0} flip look={SERVANT} t={t} walk={t < dead ? 2 : 0} face={{eyes: 'open', mouth: 'frown', brow: -0.7, look: [-1, 0]}} />
      </Cam>
    );
  }
  const c: C3 = {x: 0, y: -20, z: lerp(2.0, 2.2, k(t, dead, p.dur))};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Street t={t} dusk={0.35} />
      <Bust x={0} y={0} look={JAIRUS} t={t} face={{eyes: 'wide', mouth: 'open', brow: -1, look: [0, 0.4]}} />
    </Cam>
  );
};

/* 11 ----------------------------------------------------------------- "Don't be afraid. Just believe." */
const Believe: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 120, z: 1.55};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Street t={t} dusk={0.3} /><g filter="url(#dof)"><Glow x={0} y={-200} r={600} o={0.5} /></g>
      <Bean x={-150} y={620} s={1.05} look={JESUS} t={t} arms="offer" face={{eyes: 'open', mouth: Math.sin(t * 11) > 0 && t < p.dur - 0.6 ? 'open' : 'smile', brow: 0.3, look: [1, 0]}} />
      <Bean x={170} y={620} s={1.0} flip look={JAIRUS} t={t} face={{eyes: 'open', mouth: 'frown', brow: -0.6, look: [-1, 0]}} />
    </Cam>
  );
};

/* 12 ----------------------------------------------------------------- the house: wailing, then laughter */
const House: React.FC<SP> = (p) => {
  const {t} = p;
  const la = p.w('laughed', p.dur * 0.8);
  const c: C3 = {x: lerp(-60, 60, t / p.dur), y: 180, z: 1.2};
  const laughing = t > la - 0.1;
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Sky dusk={0.4} />
      <rect x={-520} y={-460} width={1040} height={780} fill="#D9B48C" stroke={INK} strokeWidth={9} />
      <path d="M -110 320 L -110 -60 Q 0 -150 110 -60 L 110 320 Z" fill="#3a2418" stroke={INK} strokeWidth={8} />
      <rect x={-3000} y={320} width={6000} height={3000} fill="#B8946A" />
      {[-640, -440, 440, 640].map((x, i) => <Bean key={i} x={x} y={640 + (i % 2) * 30} s={0.95} flip={x > 0} look={CROWD(i + 1)} t={t + i} arms={laughing ? 'point' : 'up'} face={laughing ? {eyes: 'closed', mouth: 'open', look: [x > 0 ? -1 : 1, 0]} : {eyes: 'closed', mouth: 'open', brow: -0.8}} />)}
      <Bean x={-90} y={680} s={1.0} look={JESUS} t={t} face={{eyes: 'open', mouth: 'flat', brow: 0.4, look: [1, 0]}} />
      <Bean x={110} y={690} s={0.95} look={JAIRUS} t={t} face={{eyes: 'open', mouth: 'frown', brow: -0.6, look: [-1, 0]}} />
      {!laughing ? [0, 1, 2].map((i) => { const ph = (t * 0.6 + i * 0.33) % 1; return <path key={i} d="M0 -10 Q 8 4 0 10 Q -8 4 0 -10 Z" transform={`translate(${[-640, 440, 640][i] + 20} ${180 + ph * 60}) scale(1.4)`} fill="#BFE9F2" stroke={INK} strokeWidth={2.5} opacity={1 - ph} />; }) : null}
    </Cam>
  );
};

/* the girl's room (13, 14) */
const GirlRoom: React.FC<{t: number; up: number; light: number; hold?: boolean}> = ({t, up, light, hold}) => (
  <g>
    <Room t={t} wall="#5A4A44" floor="#3E2E24" win={false} />
    <OilLamp x={-420} y={-80} t={t} r={500} />
    <SunPatch pts="200,-900 420,-900 700,700 300,700" o={0.25 + light * 0.3} />
    <Glow x={60} y={300} r={300 + light * 500} o={light * 0.8} id="gWhite" />
    <Bean x={-170} y={380} s={0.66} look={JAIRUS} t={t} face={{eyes: light > 0.5 ? 'wide' : 'half', mouth: light > 0.5 ? 'open' : 'frown', brow: -0.5, look: [1, 0]}} dim={0.2} />
    <Bean x={-30} y={385} s={0.64} look={MOTHER} t={t} face={{eyes: light > 0.5 ? 'wide' : 'closed', mouth: light > 0.5 ? 'open' : 'frown', look: [1, 0]}} dim={0.2} />
    <Bed x={0} y={480} t={t} look={GIRL} up={up} face={{eyes: up > 0.5 ? 'open' : 'closed', mouth: up > 0.5 ? 'smile' : 'flat', look: [-1, 0]}} />
    <Bean x={380} y={660} s={0.95} flip look={JESUS} t={t} arms={hold ? 'reach' : 'down'} face={{eyes: 'open', mouth: light > 0.3 ? 'smile' : 'flat', brow: 0.2, look: [-1, 0.5]}} />
  </g>
);
/* 13 ----------------------------------------------------------------- he takes her hand */
const HandSc: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: lerp(40, 100, t / p.dur), y: 220, z: lerp(1.2, 1.3, t / p.dur)};
  return <Cam c={c} p={p}>{RDEFS}<GirlRoom t={t} up={0} light={0} hold={t > p.w('hand', p.dur * 0.5) - 0.3} /></Cam>;
};

/* 14 ----------------------------------------------------------------- "Talitha koum… get up" */
const Rise: React.FC<SP> = (p) => {
  const {t} = p;
  const up = p.w('up', p.dur * 0.8);
  const cut = p.w('koum', 1.0) + 0.6;
  if (t < cut) {
    const c: C3 = {x: 0, y: -20, z: lerp(2.0, 2.15, t / cut)};
    return <Cam c={c} p={p}>{RDEFS}<Room t={t} wall="#5A4A44" floor="#3E2E24" win={false} /><OilLamp x={-380} y={-80} t={t} /><Bust x={0} y={0} look={JESUS} t={t} face={{eyes: 'open', mouth: Math.sin(t * 10) > 0 ? 'open' : 'smile', brow: 0.2, look: [-1, 0.5]}} /></Cam>;
  }
  const u = ko(t, up - 0.1, up + 0.9);
  const c: C3 = {x: 90, y: 220, z: lerp(1.35, 1.22, k(t, cut, p.dur))};
  return <Cam c={c} p={p}>{RDEFS}<GirlRoom t={t} up={u} light={ko(t, up - 0.2, up + 0.6) * (1 - lin(t, up + 1.4, Math.max(up + 1.5, p.dur)) * 0.5)} hold /></Cam>;
};

/* 15 ----------------------------------------------------------------- she walks; the parents */
const Walk: React.FC<SP> = (p) => {
  const {t} = p;
  const wk = p.w('walked', p.dur * 0.5);
  const c: C3 = {x: lerp(0, 120, t / p.dur), y: 180, z: 1.25};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Room t={t} wall="#6A5648" floor="#4A3426" win={false} /><OilLamp x={-420} y={-80} t={t} r={700} /><SunPatch pts="200,-900 420,-900 700,700 300,700" o={0.4} />
      <Bean x={lerp(-60, 220, lin(t, wk - 0.4, Math.max(wk, p.dur)))} y={660} s={0.75} look={GIRL} t={t} walk={t > wk - 0.4 ? 1 : 0} arms="up" face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />
      <Bean x={-420} y={660} s={0.95} look={JAIRUS} t={t} arms="up" face={{eyes: 'closed', mouth: 'smile'}} />
      <Bean x={-260} y={670} s={0.92} look={MOTHER} t={t} arms="up" face={{eyes: 'closed', mouth: 'open'}} />
      <Bean x={560} y={660} s={0.95} flip look={JESUS} t={t} face={{eyes: 'open', mouth: 'smile', look: [-1, 0.3]}} />
      <text x={-420} y={-300} fontFamily="Anton" fontSize={160} fill="#FFDD33" stroke="#1c0d16" strokeWidth={12} paintOrder="stroke" opacity={ko(t, p.w('twelve', p.dur * 0.8) - 0.1, p.w('twelve', p.dur * 0.8) + 0.3)}>12</text>
    </Cam>
  );
};

/* 16 ----------------------------------------------------------------- end card */
const End: React.FC<SP> = (p) => {
  const {t} = p;
  const c: C3 = {x: 0, y: 0, z: 1};
  return (
    <Cam c={c} p={p}>
      {RDEFS}<Fill fill="#1a1420" />
      <rect x={-260} y={60} width={520} height={560} fill="#FFC27A" stroke={INK} strokeWidth={10} /><Glow x={0} y={340} r={600} o={0.6} />
      <g transform="translate(0 600) scale(0.42)"><Bean x={-160} y={0} look={JAIRUS} t={t} face={{eyes: 'closed', mouth: 'smile'}} /><Bean x={160} y={0} look={MOTHER} t={t} face={{eyes: 'closed', mouth: 'smile'}} /><Bean x={0} y={20} s={0.75} look={GIRL} t={t} arms="up" face={{eyes: 'closed', mouth: 'smile'}} /></g>
      <rect x={-3000} y={620} width={6000} height={3000} fill="#120c16" />
    </Cam>
  );
};

export const SCENES8: Record<string, React.FC<SP>> = {lake: Lake, plea: Plea, crowd: Crowd, woman: Woman, thought: Thought, touch: Touch, who: Who, feet: Feet, peace: Peace, news: News, believe: Believe, house: House, hand: HandSc, rise: Rise, walk: Walk, end: End};
