import React from 'react';
import {interpolate} from 'remotion';
import {POSES, Stick, cyclePose, lerpPose} from './stick';
import {BODY, Bubble, Burst, C, Crowd, Gym, OText, Ring, SpeedLines, TITLE, cl, ease, eout, pop} from './kit';

export type SceneProps = {t: number; dur: number; cue: (name: string, frac?: number) => number; has?: (name: string) => boolean};
const YOU = {headband: C.red};
const shake = (t: number, at: number, amp = 18, len = 0.35) => {
  const d = t - at;
  if (d < 0 || d > len) return '';
  const k = (1 - d / len) * amp;
  return `translate(${Math.sin(d * 90) * k} ${Math.cos(d * 70) * k})`;
};

/* 1 ─ the call + title */
export const Hook: React.FC<SceneProps> = ({t, dur, cue, has}) => {
  const call = cue('call', 0.05), tryout = cue('tryout', 0.25), surv = cue('survive', 0.85);
  const never = has && !has('never') ? 1e9 : cue('never', 0.45);
  const jumpP = Math.max(0, Math.sin(Math.min(1, (t - tryout) / 0.6) * Math.PI));
  const happy = t > tryout && t < never;
  const titleP = pop(t, surv - 0.15);
  const vib = t < tryout ? Math.sin(t * 60) * 6 : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill={C.cream} />
      <rect y={760} width={1920} height={320} fill="#C9B79A" />
      <line y1={760} y2={760} x2={1920} stroke={C.ink} strokeWidth={8} />
      {/* bedroom: bed + poster + window */}
      <rect x={1180} y={640} width={560} height={130} rx={18} fill="#6C8BC4" stroke={C.ink} strokeWidth={8} />
      <rect x={1180} y={600} width={150} height={80} rx={20} fill="#fff" stroke={C.ink} strokeWidth={7} />
      <rect x={180} y={170} width={300} height={240} fill="#9CC9F0" stroke={C.ink} strokeWidth={8} />
      <line x1={330} y1={170} x2={330} y2={410} stroke={C.ink} strokeWidth={6} />
      <g transform="translate(1420 200) rotate(4)" opacity={t > never - 0.15 ? 0 : 1}>
        <rect width={260} height={340} fill={C.orange} stroke={C.ink} strokeWidth={8} />
        <OText x={130} y={150} text="TRAIN" size={70} />
        <OText x={130} y={240} text="HARD" size={70} fill="#FFD23F" />
      </g>
      <g transform={`translate(0 ${-jumpP * 160})`}>
        <Stick x={900} y={770} pose={t > tryout ? lerpPose(POSES.point, POSES.jump, jumpP) : t > call ? POSES.point : POSES.stand} face={t > never ? 'shock' : happy ? 'grin' : 'neutral'} gear={{...YOU, sweat: t > never ? 1 : 0}} t={t} scale={1.25} />
      </g>
      {/* phone */}
      <g transform={`translate(${1060 + vib} 470) scale(${t > call - 0.3 ? 1 : 0})`}>
        <rect x={-50} y={-90} width={100} height={180} rx={18} fill="#222" stroke={C.ink} strokeWidth={6} />
        <rect x={-38} y={-72} width={76} height={136} rx={8} fill={t < tryout ? C.green : '#9CC9F0'} />
        <text x={0} y={8} textAnchor="middle" fontFamily={TITLE} fontSize={28} fill="#fff">WWE</text>
        {t < tryout ? [1, 2].map((k) => <path key={k} d={`M ${60 + k * 18} -40 q 14 40 0 80`} fill="none" stroke={C.ink} strokeWidth={6} />) : null}
      </g>
      <Bubble x={1300} y={330} w={460} h={130} text="YOU'RE INVITED!" p={pop(t, tryout - 0.1) * (t < never ? 1 : 0)} tail={-1} size={52} />
      {/* most never make it */}
      {t > never - 0.1 && t < surv - 0.2 ? (
        <g transform={`translate(1350 350) scale(${pop(t, never)})`}>
          <rect x={-170} y={-120} width={340} height={230} rx={20} fill="#333" stroke={C.ink} strokeWidth={8} />
          <rect x={-140} y={-92} width={280} height={170} rx={10} fill="#7FB3E8" />
          <OText x={0} y={20} text="TV" size={90} />
          <line x1={-200} y1={-150} x2={200} y2={140} stroke={C.red} strokeWidth={26} strokeLinecap="round" />
          <OText x={0} y={210} text="MOST NEVER MAKE IT" size={58} fill={C.red} />
        </g>
      ) : null}
      {/* title card */}
      {t > surv - 0.2 ? (
        <g>
          <rect width={1920} height={1080} fill={C.ink} opacity={0.55 * titleP} />
          <g transform={`translate(960 470) scale(${0.6 + 0.4 * titleP}) rotate(-3)`}>
            <OText x={0} y={-30} text="WILL YOU SURVIVE" size={150} stroke={22} />
            <OText x={0} y={150} text="WWE TRAINING?" size={180} fill={C.orange} stroke={26} />
          </g>
        </g>
      ) : null}
    </g>
  );
};

/* 2 ─ the Performance Center */
export const PC: React.FC<SceneProps> = ({t, cue}) => {
  const orl = cue('Orlando', 0.25), big = cue('bigger', 0.45), col = cue('College', 0.62), oly = cue('Olympians', 0.72), bb = cue('Bodybuilders', 0.82), you = cue("there's", 0.92);
  const walkX = interpolate(t, [0, Math.max(1, orl + 1)], [-150, 520], cl);
  const walking = t < orl + 1;
  const camZ = t > you - 0.2 ? 1 + 0.35 * ease(t, you - 0.2, you + 0.4) : 1;
  const giants = [
    {x: 1080, at: col, label: 'COLLEGE ATHLETE'},
    {x: 1380, at: oly, label: 'OLYMPIAN'},
    {x: 1680, at: bb, label: 'BODYBUILDER'},
  ];
  return (
    <g transform={`translate(${520 - 520 * camZ} ${700 - 700 * camZ}) scale(${camZ})`}>
      <Gym t={t} />
      <g transform={`translate(960 120) scale(${pop(t, orl - 0.1)}) translate(-960 -120)`}>
        <rect x={720} y={60} width={480} height={110} rx={14} fill={C.orange} stroke={C.ink} strokeWidth={8} />
        <OText x={960} y={140} text="ORLANDO, FL" size={74} />
      </g>
      {giants.map((g, i) => (
        <g key={i} opacity={ease(t, big - 0.2 + i * 0.15, big + 0.2 + i * 0.15)}>
          <Stick x={g.x} y={930} pose={lerpPose(POSES.arms, POSES.flex, Math.max(0, Math.sin(t * 1.5 + i)) * 0.6)} face="determined" gear={{bulky: true, headband: ['#555', '#2E6FD8', '#333'][i]}} scale={1.55} t={t} />
          <g transform={`translate(${g.x} 290) scale(${pop(t, g.at)})`}>
            <rect x={-150} y={-46} width={300} height={70} rx={12} fill="#fff" stroke={C.ink} strokeWidth={6} />
            <text y={4} textAnchor="middle" fontFamily={TITLE} fontSize={38} fill={C.ink}>{g.label}</text>
          </g>
        </g>
      ))}
      <Stick x={walkX} y={930} pose={walking ? cyclePose('walkA', 'walkB', t, 1.6) : POSES.nervous} face={t > big ? 'nervous' : 'neutral'} gear={{...YOU, sweat: t > big ? 1 : 0}} t={t} scale={1.05} />
      <g transform={`translate(${walkX} 560) scale(${pop(t, you)})`}>
        <rect x={-90} y={-60} width={180} height={80} rx={14} fill={C.red} stroke={C.ink} strokeWidth={6} />
        <text y={2} textAnchor="middle" fontFamily={TITLE} fontSize={52} fill="#fff">YOU</text>
        <polygon points="-18,24 18,24 0,56" fill={C.red} stroke={C.ink} strokeWidth={6} />
      </g>
    </g>
  );
};

/* 3 ─ learning to bump */
export const Bump: React.FC<SceneProps> = ({t, cue}) => {
  const fall = cue('fall', 0.12), bump = cue('bump', 0.3), chin = cue('Chin', 0.45), arms = cue('arms', 0.58), flat = cue('flat', 0.72), spread = cue('spreads', 0.85);
  const fallP = ease(t, flat - 0.55, flat);
  const items = [
    {at: chin, txt: 'CHIN TUCKED'},
    {at: arms, txt: 'ARMS OUT'},
    {at: flat, txt: 'LAND FLAT'},
  ];
  const pose = t < arms ? POSES.stand : lerpPose(POSES.stand, POSES.armsOut, ease(t, arms, arms + 0.3));
  return (
    <g transform={shake(t, flat, 14)}>
      <Gym t={t} />
      <Ring x={160} w={1600} floorY={700} />
      <Stick x={420} y={700} pose={POSES.arms} face="neutral" gear={{cap: '#555', whistle: true, clipboard: true, shirt: '#444'}} t={t} scale={1.05} />
      <Bubble x={560} y={330} w={460} h={120} text="LESSON 1: FALL" p={pop(t, fall - 0.1)} tail={-1} size={52} />
      <Stick x={1080} y={700} pose={pose} face={t < chin ? 'nervous' : 'determined'} gear={{...YOU}} t={t} scale={1.05} rot={-90 * fallP} />
      {t > spread - 0.1
        ? [0, 1, 2].map((k) => {
            const ph = ((t - spread) * 1.2 + k / 3) % 1;
            return <ellipse key={k} cx={940} cy={690} rx={60 + ph * 260} ry={14 + ph * 26} fill="none" stroke={C.orange} strokeWidth={10 * (1 - ph)} />;
          })
        : null}
      <g transform="translate(1340 150)">
        <rect x={0} y={0} width={500} height={330} rx={20} fill="#fff" stroke={C.ink} strokeWidth={8} opacity={ease(t, bump - 0.2, bump + 0.1)} />
        <text x={30} y={62} fontFamily={TITLE} fontSize={48} fill={C.ink} opacity={ease(t, bump - 0.2, bump + 0.1)}>HOW TO BUMP</text>
        {items.map((it, i) => (
          <g key={i} transform={`translate(30 ${118 + i * 72})`} opacity={ease(t, it.at - 0.1, it.at + 0.15)}>
            <rect width={44} height={44} rx={8} fill={C.green} stroke={C.ink} strokeWidth={5} />
            <path d="M 9 22 L 19 33 L 36 11" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" />
            <text x={64} y={36} fontFamily={TITLE} fontSize={44} fill={C.ink}>{it.txt}</text>
          </g>
        ))}
      </g>
      <OText x={940} y={560} text="IMPACT SPREADS OUT" size={54} fill={C.orange} opacity={ease(t, spread, spread + 0.2)} />
    </g>
  );
};

/* 4 ─ the ring is not a trampoline */
export const RingScene: React.FC<SceneProps> = ({t, cue}) => {
  const hit = cue('hit', 0.1), tramp = cue('trampoline', 0.3), steel = cue('steel', 0.45), wood = cue('wooden', 0.55), foam = cue('foam', 0.65), table = cue('table', 0.85);
  const fallP = ease(t, hit - 0.25, hit);
  const zoom = 1 + 0.25 * ease(t, steel - 0.4, steel);
  const layers = [
    {at: foam, label: 'THIN FOAM', h: 16, fill: '#F4D35E'},
    {at: wood, label: 'WOODEN BOARDS', h: 46, fill: '#A86A3D'},
    {at: steel, label: 'STEEL FRAME', h: 60, fill: '#8C939D'},
  ];
  return (
    <g transform={shake(t, hit, 26, 0.45)}>
      <g transform={`translate(${960 - 960 * zoom} ${700 - 700 * zoom}) scale(${zoom})`}>
        <Gym t={t} />
        <Ring x={160} w={1600} floorY={640} />
        <Stick x={760} y={640} pose={lerpPose(POSES.stand, POSES.armsOut, fallP)} face={t > hit ? 'pain' : 'scared'} gear={{...YOU, sweat: 1}} t={t} rot={-90 * fallP} />
        <Burst x={620} y={560} r={130} p={pop(t, hit) * (t < tramp + 0.3 ? 1 : 0)} text="THUD!" />
      </g>
      {/* trampoline crossed */}
      <g transform={`translate(1500 250) scale(${pop(t, tramp - 0.1) * (t < steel - 0.2 ? 1 : 0)})`}>
        <ellipse cx={0} cy={0} rx={150} ry={40} fill="#333" stroke={C.ink} strokeWidth={8} />
        <line x1={-120} y1={20} x2={-140} y2={110} stroke={C.ink} strokeWidth={10} />
        <line x1={120} y1={20} x2={140} y2={110} stroke={C.ink} strokeWidth={10} />
        <line x1={-170} y1={-80} x2={170} y2={130} stroke={C.red} strokeWidth={24} strokeLinecap="round" />
        <OText x={0} y={-80} text="NOT A TRAMPOLINE" size={52} />
      </g>
      {/* cross-section */}
      {t > steel - 0.3 ? (
        <g transform="translate(1180 140)">
          <rect x={-20} y={-20} width={680} height={430} rx={22} fill="#fff" stroke={C.ink} strokeWidth={8} opacity={ease(t, steel - 0.3, steel)} />
          <text x={20} y={40} fontFamily={TITLE} fontSize={46} fill={C.ink} opacity={ease(t, steel - 0.3, steel)}>INSIDE A RING</text>
          <rect x={20} y={70} width={260} height={22} fill={C.canvas} stroke={C.ink} strokeWidth={5} opacity={ease(t, steel - 0.3, steel)} />
          <text x={300} y={90} fontFamily={TITLE} fontSize={34} fill={C.ink} opacity={ease(t, steel - 0.3, steel)}>CANVAS</text>
          {layers.map((L, i) => {
            const y = 102 + [0, 26, 82][i];
            return (
              <g key={i} opacity={ease(t, L.at - 0.15, L.at + 0.15)} transform={`translate(${(1 - eout(t, L.at - 0.15, L.at + 0.2)) * 80} 0)`}>
                <rect x={20} y={y} width={260} height={L.h} fill={L.fill} stroke={C.ink} strokeWidth={5} />
                {L.label === 'WOODEN BOARDS' ? [1, 2, 3].map((k) => <line key={k} x1={20 + k * 65} y1={y} x2={20 + k * 65} y2={y + L.h} stroke={C.ink} strokeWidth={4} />) : null}
                <text x={300} y={y + L.h / 2 + 14} fontFamily={TITLE} fontSize={40} fill={i === 0 ? '#B38600' : C.ink}>{L.label}</text>
              </g>
            );
          })}
          <g opacity={ease(t, table - 0.15, table + 0.15)}>
            <text x={20} y={340} fontFamily={TITLE} fontSize={50} fill={C.red}>= FALLING ON A TABLE</text>
            <rect x={520} y={296} width={110} height={16} fill="#A86A3D" stroke={C.ink} strokeWidth={4} />
            <line x1={535} y1={312} x2={535} y2={360} stroke={C.ink} strokeWidth={8} />
            <line x1={615} y1={312} x2={615} y2={360} stroke={C.ink} strokeWidth={8} />
          </g>
        </g>
      ) : null}
    </g>
  );
};

/* 5 ─ dozens of bumps */
export const Bumps: React.FC<SceneProps> = ({t, dur, cue}) => {
  const doz = cue('dozens', 0.08), purple = cue('purple', 0.55), sit = cue('sit', 0.75), groan = cue('groaning', 0.9);
  const cycling = t < purple - 0.3;
  const cyc = (t * 1.25) % 1;
  const fallP = cycling ? (cyc < 0.45 ? ease(cyc, 0.05, 0.4) : 1 - ease(cyc, 0.6, 0.95)) : 0;
  const count = Math.round(interpolate(t, [0, purple - 0.3], [1, 87], cl));
  const bruise = ease(t, purple - 0.2, purple + 0.4);
  const sitting = t > sit - 0.2;
  return (
    <g>
      <Gym t={t} />
      <Ring x={160} w={1600} floorY={700} />
      {cycling ? <Burst x={700} y={640} r={90} p={cyc > 0.38 && cyc < 0.55 ? 1 : 0} text="BAM" /> : null}
      {!sitting ? (
        <Stick x={860} y={700} pose={lerpPose(POSES.stand, POSES.armsOut, fallP)} face={fallP > 0.5 ? 'pain' : 'tired'} gear={{...YOU, sweat: 1}} t={t} rot={-90 * fallP} />
      ) : (
        <g>
          <rect x={720} y={760} width={360} height={40} rx={8} fill="#A86A3D" stroke={C.ink} strokeWidth={6} transform="translate(0 -60)" />
          <Stick x={880} y={880} pose={POSES.sitOuch} face="pain" gear={{...YOU, sweat: 1}} t={t} />
        </g>
      )}
      <g transform="translate(150 190)">
        <rect width={460} height={150} rx={20} fill="#fff" stroke={C.ink} strokeWidth={8} />
        <text x={30} y={62} fontFamily={TITLE} fontSize={44} fill={C.ink}>BUMPS TODAY</text>
        <text x={30} y={132} fontFamily={TITLE} fontSize={70} fill={C.red}>{count}</text>
      </g>
      <g transform="translate(1290 120)" opacity={ease(t, purple - 0.3, purple)}>
        <rect width={480} height={150} rx={20} fill="#fff" stroke={C.ink} strokeWidth={8} />
        <text x={30} y={62} fontFamily={TITLE} fontSize={44} fill={C.ink}>BACK STATUS</text>
        <rect x={30} y={88} width={420} height={36} rx={10} fill="#eee" stroke={C.ink} strokeWidth={5} />
        <rect x={30} y={88} width={420 * bruise} height={36} rx={10} fill={C.purple} />
        <text x={460} y={62} textAnchor="end" fontFamily={TITLE} fontSize={40} fill={C.purple}>PURPLE</text>
      </g>
      <Burst x={1120} y={560} r={150} p={pop(t, groan - 0.1)} text="OUCH!!" color="#FF9DB0" />
    </g>
  );
};

/* 6 ─ running the ropes */
export const Ropes: React.FC<SceneProps> = ({t, cue}) => {
  const steel = cue('steel', 0.4), rub = cue('rubber', 0.5), tape = cue('tape', 0.58), ten = cue('ten', 0.72), bruises = cue('bruises', 0.88);
  const stop = bruises - 0.4;
  const period = 1.6;
  const ph = (Math.min(t, stop) / period) % 1;
  const dir = ph < 0.5 ? 1 : -1;
  const x = ph < 0.5 ? interpolate(ph, [0, 0.42], [400, 1510], cl) : interpolate(ph, [0.5, 0.92], [1510, 400], cl);
  const atRope = (ph > 0.42 && ph < 0.5) || ph > 0.92;
  const wob = atRope ? 60 * Math.sin(((ph % 0.5) - 0.42) / 0.08 * Math.PI) : 0;
  const pose = t > stop ? POSES.tired : atRope ? POSES.ropeLean : cyclePose('runA', 'runB', t, 3);
  const mins = Math.min(10, Math.floor(interpolate(t, [ten - 0.2, ten + 2], [0, 10], cl)));
  const rings = [
    {at: steel, r: 40, fill: '#8C939D', label: 'STEEL CABLE'},
    {at: rub, r: 68, fill: '#222', label: 'RUBBER HOSE'},
    {at: tape, r: 86, fill: C.red, label: 'TAPE'},
  ];
  return (
    <g>
      <Gym t={t} />
      <Ring x={260} w={1400} floorY={720} ropeWob={x > 960 ? [0, wob, wob * 0.6] : [0, -wob, -wob * 0.6].map((v) => v)} />
      <Stick x={x} y={720} pose={pose} face={t > bruises ? 'pain' : 'determined'} flip={dir < 0} gear={{...YOU, sweat: 1, bruise: ease(t, bruises - 0.1, bruises + 0.3)}} t={t} />
      <SpeedLines x={x} y={560} dir={dir} o={atRope || t > stop ? 0 : 0.7} />
      {atRope && t < stop ? <OText x={x + dir * 80} y={420} text="BOING!" size={64} fill="#FFD23F" rot={dir * 8} /> : null}
      {/* magnified rope cross-section */}
      <g transform={`translate(1600 240) scale(${pop(t, steel - 0.2)})`}>
        <circle r={150} fill="#fff" stroke={C.ink} strokeWidth={10} />
        {rings.slice().reverse().map((r) => <circle key={r.label} r={r.r * ease(t, r.at - 0.1, r.at + 0.2)} fill={r.fill} stroke={C.ink} strokeWidth={5} />)}
        {rings.map((r, i) => (
          <g key={'l' + i} opacity={ease(t, r.at - 0.1, r.at + 0.2)}>
            <line x1={-r.r + 10} y1={0} x2={-260} y2={-80 + i * 80} stroke={C.ink} strokeWidth={5} />
            <text x={-270} y={-68 + i * 80} textAnchor="end" fontFamily={TITLE} fontSize={42} fill="#fff" stroke={C.ink} strokeWidth={8} paintOrder="stroke">{r.label}</text>
          </g>
        ))}
        <rect x={-240} y={-210} width={480} height={60} fill="none" />
      </g>
      <g transform="translate(150 180)" opacity={ease(t, ten - 0.3, ten)}>
        <rect width={300} height={130} rx={20} fill="#111" stroke={C.ink} strokeWidth={6} />
        <text x={150} y={92} textAnchor="middle" fontFamily={TITLE} fontSize={84} fill={C.red}>{String(mins).padStart(2, '0')}:00</text>
      </g>
      <Burst x={x + 120} y={520} r={120} p={pop(t, bruises)} text="BRUISED" color="#C9A2E6" />
    </g>
  );
};

/* 7 ─ cardio */
export const Cardio: React.FC<SceneProps> = ({t, cue}) => {
  const c15 = cue('fifteen', 0.25), c20 = cue('twenty', 0.32), c30 = cue('thirty', 0.4), fire = cue('fire', 0.6), again = cue('again', 0.78), smile = cue('smile', 0.92);
  const stamina = interpolate(t, [0.5, fire + 0.3], [100, 6], cl);
  const recovering = t > again;
  const x = 760 + Math.sin(t * 1.2) * 80;
  return (
    <g>
      <Gym t={t} />
      <rect x={0} y={860} width={1920} height={40} fill="#B84B3A" />
      {[0, 1, 2, 3].map((k) => <line key={k} x1={((k * 520 - t * 900) % 2080 + 2080) % 2080 - 80} y1={880} x2={((k * 520 - t * 900) % 2080 + 2080) % 2080 + 80} y2={880} stroke="#fff" strokeWidth={6} />)}
      <Stick x={x} y={870} pose={t > smile - 0.2 ? POSES.tired : cyclePose('runA', 'runB', t, 2.6)} face={t > smile - 0.1 ? 'grin' : t > fire ? 'tired' : 'determined'} gear={{...YOU, sweat: 1}} t={t} scale={1.1} />
      <SpeedLines x={x - 40} y={720} dir={1} o={t < smile - 0.2 ? 0.6 : 0} />
      {/* lungs on fire */}
      <g transform={`translate(${x + 30} 560) scale(${pop(t, fire - 0.1)})`}>
        <text textAnchor="middle" fontSize={130}>🔥</text>
      </g>
      {[{at: c15, txt: '15 MIN'}, {at: c20, txt: '20 MIN'}, {at: c30, txt: '30 MIN'}].map((m, i) => (
        <g key={i} transform={`translate(${1250 + i * 190} ${300 + i * 60}) rotate(${-6 + i * 5}) scale(${pop(t, m.at) * (t < fire ? 1 : 0)})`}>
          <rect x={-100} y={-60} width={200} height={90} rx={14} fill={i === 2 ? C.red : '#fff'} stroke={C.ink} strokeWidth={7} />
          <text y={10} textAnchor="middle" fontFamily={TITLE} fontSize={56} fill={i === 2 ? '#fff' : C.ink}>{m.txt}</text>
        </g>
      ))}
      <g opacity={t > again - 0.4 ? 1 : 0}>
        <Stick x={1500} y={870} pose={POSES.point} flip face="determined" gear={{cap: '#555', whistle: true, shirt: '#444'}} t={t} scale={1.05} />
        <Bubble x={1450} y={430} w={320} h={130} text="AGAIN!" p={pop(t, again - 0.1)} tail={1} size={70} />
        <Bubble x={1420} y={260} w={500} h={110} text="...AND SMILE 😁" p={pop(t, smile - 0.15)} tail={1} size={50} />
      </g>
      {/* stamina HUD */}
      <g transform="translate(150 200)">
        <text fontFamily={TITLE} fontSize={46} fill="#fff" stroke={C.ink} strokeWidth={7} paintOrder="stroke">STAMINA</text>
        <rect y={20} width={560} height={50} rx={14} fill="#222" stroke={C.ink} strokeWidth={6} />
        <rect x={6} y={26} width={548 * stamina / 100} height={38} rx={10} fill={stamina > 50 ? C.green : stamina > 20 ? C.orange : C.red} />
        <text x={580} y={62} fontFamily={TITLE} fontSize={46} fill="#fff" stroke={C.ink} strokeWidth={7} paintOrder="stroke">{Math.round(recovering ? stamina : stamina)}%</text>
      </g>
    </g>
  );
};

/* 8 ─ promo class */
export const Promo: React.FC<SceneProps> = ({t, cue}) => {
  const mic = cue('microphone', 0.3), cam = cue('camera', 0.4), shakes = cue('shakes', 0.6), forget = cue('forget', 0.72), stare = cue('stare', 0.86);
  const jit = t > shakes - 0.1 && t < stare ? Math.sin(t * 70) * 5 : 0;
  const rec = Math.floor(t * 2) % 2 === 0 && t > cam - 0.2;
  return (
    <g>
      <rect width={1920} height={1080} fill="#2B2F3A" />
      <polygon points="560,0 760,0 1000,1080 200,1080" fill="#FFF3B0" opacity={0.12} />
      <rect y={820} width={1920} height={260} fill="#3A3F4D" />
      <line y1={820} y2={820} x2={1920} stroke={C.ink} strokeWidth={8} />
      <g transform={`translate(${jit} 0)`}>
        <Stick x={560} y={860} pose={t > mic - 0.3 ? POSES.mic : POSES.nervous} face={t > shakes - 0.1 ? 'nervous' : 'neutral'} gear={{...YOU, mic: t > mic - 0.3, sweat: t > shakes ? 1 : 0}} t={t} scale={1.15} />
      </g>
      {/* camera on tripod */}
      <g transform="translate(980 560)">
        <line x1={0} y1={60} x2={-70} y2={300} stroke={C.ink} strokeWidth={10} />
        <line x1={0} y1={60} x2={70} y2={300} stroke={C.ink} strokeWidth={10} />
        <line x1={0} y1={60} x2={0} y2={300} stroke={C.ink} strokeWidth={10} />
        <rect x={-90} y={-50} width={180} height={110} rx={14} fill="#222" stroke={C.ink} strokeWidth={7} />
        <rect x={-150} y={-30} width={70} height={70} rx={10} fill="#444" stroke={C.ink} strokeWidth={6} />
        <circle cx={60} cy={-30} r={12} fill={rec ? C.red : '#511'} />
        {t > cam - 0.2 ? <text x={20} y={-70} fontFamily={TITLE} fontSize={40} fill={C.red}>● REC</text> : null}
      </g>
      {/* coaches table */}
      <rect x={1240} y={700} width={600} height={40} fill="#6B4A2E" stroke={C.ink} strokeWidth={7} />
      <rect x={1260} y={740} width={20} height={120} fill="#6B4A2E" />
      <rect x={1800} y={740} width={20} height={120} fill="#6B4A2E" />
      {[1390, 1650].map((x, i) => (
        <Stick key={i} x={x} y={790} pose={POSES.arms} flip face={t > stare - 0.2 ? 'neutral' : 'neutral'} gear={{cap: i ? '#333' : '#555', shirt: '#444'}} t={t} scale={0.95} />
      ))}
      <Bubble x={720} y={330} w={420} h={130} text="UHH... I, UH..." p={pop(t, shakes - 0.1) * (t < forget - 0.1 ? 1 : 0)} tail={-1} size={52} />
      <Bubble x={720} y={330} w={300} h={130} text="???" p={pop(t, forget - 0.1) * (t < stare - 0.1 ? 1 : 0)} tail={-1} size={80} />
      {t > stare - 0.15 ? <OText x={1520} y={480} text="..." size={180} scale={pop(t, stare - 0.15)} /> : null}
    </g>
  );
};

/* 9 ─ first live event */
export const Live: React.FC<SceneProps> = ({t, cue}) => {
  const music = cue('music', 0.3), mistake = cue('mistake', 0.62), heart = cue('heart', 0.85);
  const entr = interpolate(t, [music - 0.2, music + 1.6], [560, 900], cl);
  const slip = ease(t, mistake - 0.15, mistake + 0.15) * (t < heart - 0.2 ? 1 : 0);
  const bpm = Math.round(interpolate(t, [heart - 0.4, heart + 1], [90, 180], cl));
  const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * (bpm / 60))), 8);
  return (
    <g>
      <rect width={1920} height={1080} fill="#121726" />
      {[0, 1, 2].map((k) => {
        const a = Math.sin(t * 0.9 + k * 2) * 18;
        return <polygon key={k} points={`${400 + k * 560},0 ${440 + k * 560},0 ${600 + k * 560 + a * 10},860 ${240 + k * 560 + a * 10},860`} fill={['#F28C28', '#2E6FD8', '#D7262E'][k]} opacity={t > music - 0.2 ? 0.16 : 0.05} />;
      })}
      <Ring x={460} w={1000} floorY={620} />
      <Stick x={entr} y={620} pose={slip > 0.5 ? lerpPose(POSES.stand, POSES.armsOut, slip) : t > music ? (entr < 890 ? cyclePose('walkA', 'walkB', t, 1.8) : POSES.cheer) : POSES.nervous} face={t > heart - 0.3 ? 'scared' : slip > 0.5 ? 'shock' : 'grin'} gear={{...YOU, sweat: t > mistake ? 1 : 0}} t={t} rot={-80 * slip} />
      {t > music - 0.2 && t < mistake ? ['♪', '♫', '♪'].map((n, i) => <OText key={i} x={300 + i * 600 + Math.sin(t * 2 + i) * 30} y={300 - ((t * 120 + i * 80) % 200)} text={n} size={90} fill="#FFD23F" />) : null}
      <Crowd t={t} y={830} excite={t > music ? 1 : 0.3} />
      <OText x={960} y={240} text="OOOOH!" size={110} fill="#FFD23F" scale={pop(t, mistake) * (t < heart - 0.2 ? 1 : 0)} />
      {/* heart monitor */}
      <g transform={`translate(1500 200) scale(${pop(t, heart - 0.2)})`}>
        <rect x={-220} y={-110} width={440} height={220} rx={20} fill="#111" stroke={C.ink} strokeWidth={8} />
        <polyline points={Array.from({length: 40}).map((_, i) => { const p = ((i / 40 + t * 1.6) % 1); const y = p > 0.45 && p < 0.5 ? -70 : p > 0.5 && p < 0.55 ? 50 : 0; return `${-200 + i * 10},${y}`; }).join(' ')} fill="none" stroke={C.green} strokeWidth={6} />
        <text x={-200} y={90} fontFamily={TITLE} fontSize={48} fill={C.green}>{bpm} BPM</text>
        <text x={160} y={-40} textAnchor="middle" fontSize={70 + beat * 26}>❤️</text>
      </g>
    </g>
  );
};

/* 10 ─ life on the road */
export const Road: React.FC<SceneProps> = ({t, cue}) => {
  const main = cue('main', 0.1), road = cue('road', 0.3), city = cue('city', 0.48), air = cue('Airports', 0.62), hotel = cue('hotel', 0.7), gyms = cue('gyms', 0.77), arenas = cue('arenas', 0.83), off = cue('off-season', 0.93);
  const days = Math.round(interpolate(t, [road, off], [1, 300], cl));
  const cards = [
    {at: air, e: '✈️', txt: 'AIRPORTS'},
    {at: hotel, e: '🛏️', txt: 'HOTELS'},
    {at: gyms, e: '🏋️', txt: 'GYMS'},
    {at: arenas, e: '🏟️', txt: 'ARENAS'},
  ];
  const walkX = interpolate(t, [road, road + 6], [200, 760], cl);
  return (
    <g>
      <rect width={1920} height={1080} fill="#F3E9D2" />
      <g opacity={0.35}>
        {Array.from({length: 9}).map((_, i) => <circle key={i} cx={200 + (i * 211) % 1600} cy={160 + ((i * 137) % 300)} r={12} fill={C.red} />)}
        <path d="M 200 200 Q 600 80 900 260 T 1700 220" fill="none" stroke={C.ink} strokeWidth={6} strokeDasharray="20 18" />
      </g>
      <g transform={`translate(${200 + ((t - road) * 160) % 1500} ${180 + Math.sin(t) * 20})`} opacity={t > city - 0.3 ? 1 : 0}>
        <text fontSize={80}>✈️</text>
      </g>
      <rect y={820} width={1920} height={260} fill="#C9B79A" />
      <line y1={820} y2={820} x2={1920} stroke={C.ink} strokeWidth={8} />
      {/* main roster banner */}
      <g transform={`translate(960 330) scale(${pop(t, main - 0.1) * (t < road - 0.1 ? 1 : 0)})`}>
        <rect x={-380} y={-90} width={760} height={150} rx={20} fill={C.orange} stroke={C.ink} strokeWidth={9} />
        <OText x={0} y={30} text="MAIN ROSTER!" size={110} />
      </g>
      <Stick x={t > road ? walkX : 960} y={830} pose={t > road ? cyclePose('walkA', 'walkB', t, 1.8) : POSES.cheer} face={t > city ? 'tired' : 'grin'} gear={{...YOU, sweat: t > gyms ? 1 : 0}} t={t} />
      {t > road ? (
        <g transform={`translate(${walkX + 70} 760)`}>
          <rect x={0} y={0} width={90} height={70} rx={10} fill="#3B5BA9" stroke={C.ink} strokeWidth={6} />
          <rect x={30} y={-18} width={30} height={20} rx={6} fill="none" stroke={C.ink} strokeWidth={6} />
        </g>
      ) : null}
      {cards.map((c, i) => (
        <g key={i} transform={`translate(${1060 + (i % 2) * 380} ${330 + Math.floor(i / 2) * 250}) scale(${pop(t, c.at)})`}>
          <rect x={-170} y={-100} width={340} height={200} rx={22} fill="#fff" stroke={C.ink} strokeWidth={8} />
          <text y={10} textAnchor="middle" fontSize={84}>{c.e}</text>
          <text y={80} textAnchor="middle" fontFamily={TITLE} fontSize={44} fill={C.ink}>{c.txt}</text>
        </g>
      ))}
      <g transform="translate(150 190)" opacity={ease(t, road - 0.2, road + 0.2)}>
        <rect width={360} height={130} rx={18} fill="#fff" stroke={C.ink} strokeWidth={8} />
        <text x={24} y={52} fontFamily={TITLE} fontSize={36} fill={C.ink}>DAYS ON THE ROAD</text>
        <text x={24} y={116} fontFamily={TITLE} fontSize={64} fill={C.red}>{days}+</text>
      </g>
      <g transform={`translate(1250 900) rotate(-6) scale(${pop(t, off - 0.2)})`}>
        <rect x={-330} y={-80} width={660} height={130} rx={14} fill={C.red} stroke={C.ink} strokeWidth={9} />
        <OText x={0} y={30} text="NO OFF-SEASON" size={96} />
      </g>
    </g>
  );
};

/* 11 ─ what it takes */
export const Takes: React.FC<SceneProps> = ({t, cue}) => {
  const body = cue('body', 0.15), cardio = cue('Cardio', 0.35), conf = cue('confidence', 0.52), mind = cue('mindset', 0.75), back = cue('back', 0.85);
  const cards = [
    {at: body, e: '💪', txt: 'TOUGH BODY'},
    {at: cardio, e: '🫁', txt: 'ENDLESS CARDIO'},
    {at: conf, e: '🎤', txt: 'CONFIDENCE'},
    {at: mind, e: '🧠', txt: 'MINDSET'},
  ];
  const up = ease(t, back - 0.1, back + 0.7);
  return (
    <g>
      <Gym t={t} />
      <rect width={1920} height={1080} fill="#000" opacity={0.25} />
      <OText x={960} y={160} text="SURVIVAL KIT" size={110} fill={C.orange} />
      {cards.map((c, i) => (
        <g key={i} transform={`translate(${330 + i * 420} 380) rotate(${(i - 1.5) * 3}) scale(${pop(t, c.at)})`}>
          <rect x={-180} y={-130} width={360} height={260} rx={24} fill="#fff" stroke={C.ink} strokeWidth={9} />
          <text y={20} textAnchor="middle" fontSize={110}>{c.e}</text>
          <text y={105} textAnchor="middle" fontFamily={TITLE} fontSize={42} fill={C.ink}>{c.txt}</text>
        </g>
      ))}
      <Ring x={460} w={1000} floorY={820} />
      <Stick x={900} y={820} pose={lerpPose(POSES.armsOut, up > 0.9 ? POSES.flex : POSES.stand, up)} face={up > 0.5 ? 'determined' : 'pain'} gear={{...YOU}} t={t} rot={-90 * (1 - up) * (t > back - 0.6 ? 1 : 0)} />
      <OText x={1250} y={700} text="GET UP!" size={100} fill="#FFD23F" scale={pop(t, back + 0.4)} rot={-6} />
    </g>
  );
};

/* 12 ─ call to action */
export const Cta: React.FC<SceneProps> = ({t, cue}) => {
  const surv = cue('survive', 0.3), comm = cue('comments', 0.7), fol = cue('follow', 0.85);
  return (
    <g>
      <rect width={1920} height={1080} fill={C.orange} />
      {Array.from({length: 16}).map((_, i) => <polygon key={i} points={`960,540 ${960 + Math.cos(i / 16 * Math.PI * 2 + t * 0.2) * 1600},${540 + Math.sin(i / 16 * Math.PI * 2 + t * 0.2) * 1600} ${960 + Math.cos((i + 0.5) / 16 * Math.PI * 2 + t * 0.2) * 1600},${540 + Math.sin((i + 0.5) / 16 * Math.PI * 2 + t * 0.2) * 1600}`} fill="#FFA94D" />)}
      <g transform={`translate(960 260) scale(${pop(t, surv - 0.2)}) rotate(-3)`}>
        <OText x={0} y={0} text="WOULD YOU" size={130} stroke={20} />
        <OText x={0} y={150} text="SURVIVE?" size={180} fill="#FFD23F" stroke={26} />
      </g>
      <Stick x={960} y={960} pose={Math.sin(t * 3) > 0 ? POSES.armsOut : POSES.cheer} face="grin" gear={{...YOU}} t={t} scale={1.2} />
      {[{x: 520, txt: 'YES 💪', c: C.green}, {x: 1400, txt: 'NO 😵', c: C.red}].map((b, i) => (
        <g key={i} transform={`translate(${b.x} 760) scale(${pop(t, comm - 0.2 + i * 0.15)})`}>
          <rect x={-190} y={-75} width={380} height={140} rx={30} fill={b.c} stroke={C.ink} strokeWidth={9} />
          <text y={22} textAnchor="middle" fontFamily={TITLE} fontSize={74} fill="#fff">{b.txt}</text>
        </g>
      ))}
      <OText x={960} y={1040} text="COMMENT BELOW & FOLLOW" size={58} scale={pop(t, fol - 0.1)} />
    </g>
  );
};

export const SCENES: Record<string, React.FC<SceneProps>> = {
  hook: Hook, pc: PC, bump: Bump, ring: RingScene, bumps: Bumps, ropes: Ropes, cardio: Cardio, promo: Promo, live: Live, road: Road, takes: Takes, cta: Cta,
};
export const CHAPTER: Record<string, [string, string]> = {
  hook: ['THE CALL', ''], pc: ['DAY 1', 'THE PERFORMANCE CENTER'], bump: ['DAY 1', 'LEARN TO FALL'], ring: ['DAY 1', 'THE RING'],
  bumps: ['DAY 1', 'BUMP AFTER BUMP'], ropes: ['DAY 2', 'THE ROPES'], cardio: ['WEEK 2', 'CARDIO'], promo: ['MONTH 2', 'PROMO CLASS'],
  live: ['MONTH 6', 'FIRST LIVE EVENT'], road: ['MAIN ROSTER', 'LIFE ON THE ROAD'], takes: ['VERDICT', 'WHAT IT TAKES'], cta: ['', ''],
};
export {BODY};
