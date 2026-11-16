import React, {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import {Easing, interpolate, spring} from 'remotion';
import {Character, Limbs, Look, Sign} from './char';
import {Bag, Beach, Camp, Palm, Ring, Stadium} from './sets';

export type P3 = {t: number; dur: number; cue: (n: string, f?: number) => number; wide: boolean};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const e = (x: number, a: number, b: number) => interpolate(x, [a, b], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
const pop = (t: number, at: number) => spring({frame: Math.round((t - at) * 30), fps: 30, config: {damping: 12, stiffness: 160}});
const lerp = (a: number[], b: number[], p: number) => a.map((v, i) => v + (b[i] - v) * p);

export const YOU: Look = {skin: '#8d5a3b', shirt: '#f4f1e8', shorts: '#c0392b', headband: '#c0392b'};
export const KRU: Look = {skin: '#a86f48', shirt: '#2e2e2e', shorts: '#1d3557', cap: '#1d3557', beard: true};
export const FOE: Look = {skin: '#c48a5c', shirt: '#2e2e2e', shorts: '#1d6fd1', headband: '#1d6fd1'};

/* ---------- poses ---------- */
const GUARD: Limbs = {armL: -1.3, armR: -1.1, elbowL: -1.5, elbowR: -1.5, legL: 0.12, legR: -0.12};
const run = (t: number, hz = 2.6): Limbs => {
  const s = Math.sin(t * Math.PI * 2 * hz);
  return {armL: 0.7 * s, armR: -0.7 * s, elbowL: -1.3, elbowR: -1.3, legL: -0.75 * s, legR: 0.75 * s, lean: 0.12, bob: Math.abs(s) * 0.06};
};
const kick = (p: number): Limbs => ({...GUARD, legR: -1.5 * p, lean: -0.18 * p, armR: -1.1 + 1.4 * p, elbowR: -1.5 + 1.2 * p});
const TIRED: Limbs = {armL: 0.15, armR: 0.2, elbowL: -0.2, elbowR: -0.2, lean: 0.32, headTilt: 0.3, legL: 0.1, legR: -0.1};

/** camera with keyframes; tall (9:16) frames pull back so everything fits horizontally */
const Cam: React.FC<{keys: {t: number; pos: number[]; look: number[]}[]; t: number; wide: boolean}> = ({keys, t, wide}) => {
  const {camera} = useThree();
  let a = keys[0], b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) if (t >= keys[i].t && t <= keys[i + 1].t) { a = keys[i]; b = keys[i + 1]; }
  const p = a === b ? 0 : e(t, a.t, b.t);
  const pos = lerp(a.pos, b.pos, p), look = lerp(a.look, b.look, p);
  const k = wide ? 1.08 : 1.55; // tall frames: back off along the view direction
  if (wide) { look[1] += 0.3; pos[1] += 0.3; } // landscape: frame a little higher so signs stay in shot
  const dir = pos.map((v, i) => v - look[i]);
  useLayoutEffect(() => {
    camera.position.set(look[0] + dir[0] * k, look[1] + dir[1] * k, look[2] + dir[2] * k);
    camera.lookAt(look[0], look[1], look[2]);
  });
  return null;
};

const Warm: React.FC<{key1?: string; amb?: number; sun?: number[]}> = ({key1 = '#ffd29a', amb = 0.45, sun = [3, 6, 4]}) => (
  <>
    <ambientLight intensity={amb} color="#ffd9b0" />
    <directionalLight position={sun as [number, number, number]} intensity={2.4} color={key1} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} />
    <directionalLight position={[-4, 3, -5]} intensity={1.0} color="#8fb0ff" />
  </>
);

/* 1 ── the trip / not a holiday / title */
export const Hook3: React.FC<P3> = ({t, cue, wide}) => {
  const hol = cue('holiday', 0.45), surv = cue('survive', 0.75);
  const atCamp = t > hol - 0.5;
  if (!atCamp)
    return (
      <>
        <Beach t={t} />
        <Warm key1="#fff0d8" amb={0.55} sun={[4, 6, 3]} />
        <Cam t={t} wide={wide} keys={[{t: 0, pos: [0.6, 1.8, 6.4], look: [0, 1.3, 0]}, {t: hol, pos: [0.2, 1.6, 5.2], look: [0, 1.3, 0]}]} />
        <Character look={{...YOU, shirt: '#ffcf56'}} expr="happy" limbs={{armL: -0.2, armR: -2.6 + Math.sin(t * 6) * 0.25, elbowR: -0.4, armOutR: 0.4, headTilt: -0.1}} t={t} rotY={0.15} />
        <mesh position={[0.7, 0.35, 0.2]} castShadow><boxGeometry args={[0.5, 0.7, 0.3]} /><meshStandardMaterial color="#3a6ea5" roughness={0.6} /></mesh>
        <group scale={pop(t, cue('Thailand', 0.1) - 0.2)}><Sign lines={['THAILAND']} sub="ONE MONTH · MUAY THAI CAMP" position={[0, 2.95, -0.8]} w={2} h={0.8} /></group>
      </>
    );
  const lt = t - (hol - 0.5);
  return (
    <>
      <Camp t={t} />
      <Warm />
      <Cam t={t} wide={wide} keys={[{t: hol - 0.5, pos: [0, 1.8, 6.8], look: [0, 1.3, 0]}, {t: surv, pos: [0, 2.0, 5.6], look: [0, 1.6, 0]}, {t: surv + 3, pos: [0, 2.6, 6.6], look: [0, 2.3, 0]}]} />
      <Character look={{...YOU, shirt: '#ffcf56'}} expr="shock" limbs={{armL: 0.05, armR: 0.05, headTilt: -0.05}} t={t} position={[-0.8, 0, 0.4]} rotY={0.4} sweat />
      <Character look={KRU} expr="determined" limbs={{armL: -0.6, armR: -0.6, elbowL: -1.7, elbowR: -1.7, armOutL: 0.5, armOutR: -0.5}} t={t} position={[0.9, 0, -0.2]} rotY={-0.5} />
      {t < surv - 0.2 ? <group scale={pop(lt, 0.2)}><Sign lines={['NOT A HOLIDAY']} sub="WELCOME TO CAMP" position={[0, 2.9, -1]} w={2.4} h={0.8} /></group> : null}
      {t > surv - 0.25 ? (
        <group scale={pop(t, surv - 0.2)}>
          <Sign lines={['WOULD YOU SURVIVE', 'A MUAY THAI', 'FIGHT CAMP?']} position={[0, 3.25, -1]} w={2.6} h={1.5} bg="#1b1a20" fg="#FFD23F" />
        </group>
      ) : null}
    </>
  );
};

/* 2 ── 6 AM run in the heat */
export const Run3: React.FC<P3> = ({t, cue, wide}) => {
  const six = cue('Six', 0.05), run_ = cue('run', 0.45), deg = cue('thirty-degree', 0.65);
  const running = t > run_ - 0.4;
  const x = running ? -3 + (t - run_) * 1.1 : 0;
  return (
    <>
      <color attach="background" args={['#f7a978']} />
      <fog attach="fog" args={['#f7b88a', 10, 30]} />
      <Warm key1="#ffc48a" sun={[-5, 3, 3]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color="#c9a36b" roughness={0.95} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow><planeGeometry args={[80, 2.4]} /><meshStandardMaterial color="#7d7468" roughness={0.9} /></mesh>
      {[-7, -3, 2, 6, 10].map((px, i) => <Palm key={i} position={[px, 0, -3.5 - (i % 2) * 2]} h={4.5 + (i % 3)} t={t} k={i} />)}
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 1.6, 5.2], look: [0, 1.4, 0]}, {t: run_ - 0.4, pos: [0, 1.7, 5.6], look: [0, 1.4, 0]}, {t: run_ + 6, pos: [x + 1.5, 1.7, 5.6], look: [x + 1.2, 1.2, 0]}]} />
      {!running ? (
        <>
          <Character look={YOU} expr="tired" limbs={{armL: -0.1, armR: -2.4, elbowR: -0.8, armOutR: 0.2, headTilt: 0.15}} t={t} rotY={0.2} />
          <group position={[0.75, 1.7, 0.5]} scale={pop(t, six - 0.15)}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.28, 0.28, 0.14, 28]} /><meshStandardMaterial color="#d7262e" roughness={0.4} /></mesh>
            <mesh position={[0, 0, 0.075]}><circleGeometry args={[0.23, 28]} /><meshStandardMaterial color="#fff" /></mesh>
            {[-1, 1].map((s) => <mesh key={s} position={[s * 0.18, 0.27, 0]}><sphereGeometry args={[0.09, 12, 10]} /><meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} /></mesh>)}
            <mesh position={[0, 0.06, 0.09]}><boxGeometry args={[0.02, 0.14, 0.01]} /><meshStandardMaterial color="#111" /></mesh>
            <mesh position={[0, -0.06, 0.09]}><boxGeometry args={[0.02, 0.14, 0.01]} /><meshStandardMaterial color="#111" /></mesh>
          </group>
          <group scale={pop(t, six)}><Sign lines={['6:00 AM']} sub="DAY 1" position={[-0.4, 2.95, -0.9]} w={1.6} h={0.7} /></group>
        </>
      ) : (
        <>
          <Character look={YOU} expr={t > deg ? 'tired' : 'determined'} limbs={run(t)} t={t} position={[x, 0, 0]} rotY={Math.PI / 2} sweat={t > deg} />
          <Character look={KRU} expr="neutral" limbs={run(t + 0.2, 2.4)} t={t} position={[x - 1.4, 0, -0.6]} rotY={Math.PI / 2} />
          <group scale={pop(t, deg)}><Sign lines={['30°C+']} sub="HUMIDITY: WET TOWEL" position={[x + 0.6, 2.9, -1.2]} w={1.7} h={0.75} bg="#fff1d6" /></group>
        </>
      )}
    </>
  );
};

/* 3 ── pads: AGAIN! */
export const Pads3: React.FC<P3> = ({t, dur, cue, wide}) => {
  const again = cue('again', 0.3), nood = cue('noodles', 0.85);
  const ph = ((t - 0.5) % 0.8) / 0.8;
  const kp = t > 0.5 && t < nood - 0.2 ? (ph < 0.3 ? e(ph, 0, 0.28) : 1 - e(ph, 0.35, 0.8)) : 0;
  const round = Math.min(12, 1 + Math.floor(Math.max(0, t - again) / 0.9));
  const flash = kp > 0.9 ? 1 : 0;
  return (
    <>
      <Camp t={t} />
      <Warm />
      <pointLight position={[0, 3.4, -2]} intensity={8} distance={9} color="#ffc66b" />
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [1.8, 2.0, 5.8], look: [0.1, 1.3, 0]}, {t: dur, pos: [1.0, 1.8, 4.6], look: [0.1, 1.3, 0]}]} />
      <Character look={YOU} expr={t > nood - 0.2 ? 'tired' : 'determined'} limbs={t > nood - 0.2 ? TIRED : kick(kp)} t={t} gloves="#c0392b" sweat position={[-0.75, 0, 0.2]} rotY={0.9} />
      <Character look={KRU} expr="determined" limbs={{armL: -1.5, armR: -1.3, elbowL: -0.4, elbowR: -0.5, lean: -0.08 * flash}} t={t} pads position={[0.85, 0, -0.2]} rotY={-0.9} />
      {flash ? <mesh position={[0.35, 1.0, 0.05]}><sphereGeometry args={[0.18, 12, 10]} /><meshBasicMaterial color="#fff3b0" transparent opacity={0.8} /></mesh> : null}
      <group scale={pop(t, again - 0.15)}><Sign lines={['AGAIN!']} sub="KRU'S FAVOURITE WORD" position={[0.3, wide ? 2.6 : 2.95, -1.2]} w={1.8} h={0.75} /></group>
      <group scale={pop(t, again + 0.6)}><Sign lines={[`ROUND ${round}`]} position={[wide ? -1.9 : -1.15, wide ? 2.2 : 2.3, -1.4]} w={1.1} h={0.45} bg="#1b1a20" fg="#FFD23F" /></group>
      {t > nood - 0.2 ? <group scale={pop(t, nood - 0.1)}><Sign lines={['ARMS = NOODLES']} position={[-1.2, 1.9, 0.8]} w={1.6} h={0.45} bg="#fff1d6" /></group> : null}
    </>
  );
};

/* 4 ── shins */
export const Shins3: React.FC<P3> = ({t, cue, wide}) => {
  const bruise = cue('bruises', 0.1), shin = cue('shin', 0.3), tree = cue('tree', 0.55), hurts = cue('hurts', 0.9);
  const kicking = t > tree - 0.6;
  const ph = ((t - tree + 0.6) % 1.1) / 1.1;
  const kp = kicking ? (ph < 0.35 ? e(ph, 0, 0.3) : 1 - e(ph, 0.4, 0.9)) : 0;
  return (
    <>
      <Camp t={t} />
      <Warm key1="#ff9f6a" amb={0.35} sun={[-4, 3, 3]} />
      <pointLight position={[-1.5, 3.2, 1]} intensity={9} distance={7} color="#ffc66b" />
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [-0.3, 1.0, 3.6], look: [-0.4, 0.55, 0]}, {t: tree - 0.6, pos: [0.6, 1.6, 5.4], look: [0, 1.1, 0]}]} />
      <Character look={YOU} expr={kp > 0.8 || t > hurts ? 'pain' : 'tired'} limbs={kicking ? {...kick(kp), legR: -1.2 * kp} : {armL: 0, armR: 0, legL: 0.05, legR: -0.05}} t={t} gloves="#c0392b" position={[-0.6, 0, 0.3]} rotY={kicking ? 0.9 : 0.2} />
      {/* bruises on the shins */}
      {!kicking ? [[-0.73, 0.28], [-0.47, 0.32], [-0.5, 0.2]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.4]} scale={pop(t, bruise + i * 0.15)}><sphereGeometry args={[0.06, 10, 8]} /><meshStandardMaterial color="#6b2fa0" roughness={0.6} /></mesh>
      )) : null}
      <Bag position={[0.65, 3.4, -0.1]} swing={kp * 0.12} color="#5b3a1e" />
      <group scale={pop(t, shin - 0.1) * (kicking ? 0 : 1)}><Sign lines={['SHIN ✓  FOOT ✗']} position={[-0.3, 1.55, -0.8]} w={1.7} h={0.5} /></group>
      <group scale={pop(t, tree)}><Sign lines={['LIKE KICKING A TREE']} position={[0.2, 2.9, -1.2]} w={2.3} h={0.6} bg="#e8d2a6" fg="#5b3a1e" /></group>
      {t > hurts - 0.2 ? <group scale={pop(t, hurts - 0.1)}><Sign lines={['OUCH!']} position={[-1.4, 2.2, 0.6]} w={1.0} h={0.45} bg="#ffd1dc" /></group> : null}
    </>
  );
};

/* 5 ── the schedule: 4 stations, camera pans */
export const Schedule3: React.FC<P3> = ({t, dur, cue, wide}) => {
  const st = [cue('morning', 0.12), cue('Eat', 0.22), cue('Sleep', 0.32), cue('afternoon', 0.45)];
  const two = cue('Two', 0.62), tired = cue('tired', 0.85);
  let idx = 0;
  st.forEach((s, i) => { if (t >= s - 0.3) idx = i; });
  const X = [-4.5, -1.5, 1.5, 4.5];
  const cx = interpolate(t, st.map((s) => s - 0.3), X, cl);
  const done = t > two - 0.3;
  return (
    <>
      <Camp t={t} />
      <Warm />
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [cx, 1.9, 5.4], look: [cx, 1.2, 0]}, {t: dur, pos: [cx, 1.9, 5.4], look: [cx, 1.2, 0]}].map((k) => ({...k, pos: done ? [0, 3.4, 10] : [cx, 1.9, 5.4], look: done ? [0, 1.4, 0] : [cx, 1.2, 0]}))} />
      {/* station 1: train (bag) */}
      <Bag position={[X[0] + 0.7, 3.4, -0.3]} swing={Math.sin(t * 4) * 0.08} />
      <Character look={YOU} expr="determined" limbs={idx === 0 && !done ? kick(Math.max(0, Math.sin(t * 7))) : TIRED} t={t} gloves="#c0392b" position={[X[0] - 0.2, 0, 0.2]} rotY={0.9} />
      {/* station 2: eat */}
      <mesh position={[X[1], 0.45, 0]} castShadow><boxGeometry args={[1.2, 0.08, 0.7]} /><meshStandardMaterial color="#8a5a35" /></mesh>
      <mesh position={[X[1], 0.55, 0]}><sphereGeometry args={[0.2, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#fff" side={2} /></mesh>
      <mesh position={[X[1], 0.58, 0]}><sphereGeometry args={[0.16, 14, 10]} /><meshStandardMaterial color="#f8f4ea" /></mesh>
      <Character look={YOU} expr="happy" limbs={{armL: -0.8, armR: -1.4 + Math.sin(t * 8) * 0.3 * (idx === 1 ? 1 : 0), elbowR: -1.2, elbowL: -0.8, legL: -1.4, legR: -1.4}} t={t} position={[X[1], -0.2, 0.75]} rotY={Math.PI} scale={0.9} />
      {/* station 3: sleep */}
      <mesh position={[X[2], 0.08, 0]} receiveShadow><boxGeometry args={[1.9, 0.14, 0.9]} /><meshStandardMaterial color="#3d6fb3" /></mesh>
      <group position={[X[2] - 0.8, 0.25, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <Character look={YOU} expr="tired" limbs={{armL: 0, armR: 0}} t={t} scale={0.9} />
      </group>
      {idx === 2 ? <group scale={pop(t, st[2])}><Sign lines={['Z z z']} position={[X[2] + 0.6, 1.4, 0]} w={0.9} h={0.4} bg="#e6efff" fg="#3d6fb3" /></group> : null}
      {/* station 4: train again (ring) */}
      <group position={[X[3] + 0.3, 0, -1.6]} scale={0.6}><Ring size={4} /></group>
      <Character look={YOU} expr="tired" limbs={run(t)} t={t} position={[X[3], 0, 0.6]} rotY={0.4} sweat />
      {['TRAIN', 'EAT', 'SLEEP', 'TRAIN AGAIN'].map((s, i) => (
        <group key={s} scale={pop(t, st[i] - 0.1)}><Sign lines={[s]} position={[X[i], 2.7, -0.8]} w={1.6} h={0.5} bg={i === 3 ? '#1b1a20' : '#f4ead5'} fg={i === 3 ? '#FFD23F' : '#b02a1e'} /></group>
      ))}
      {done ? <group scale={pop(t, two)}><Sign lines={['2 SESSIONS / DAY', '6 DAYS / WEEK']} position={[0, 3.55, 0.9]} w={2.8} h={0.95} bg="#1b1a20" fg="#FFD23F" /></group> : null}
      {t > tired - 0.2 ? <group scale={pop(t, tired)}><Sign lines={['ENERGY: 2%']} position={[0, 3.0, 0.4]} w={1.8} h={0.45} bg="#ffd1dc" /></group> : null}
    </>
  );
};

/* 6 ── the clinch */
export const Clinch3: React.FC<P3> = ({t, dur, cue, wide}) => {
  const throwAt = cue('half', 0.6), floor = cue('floor', 0.85);
  const cyc = t > throwAt - 0.2 ? ((t - throwAt + 0.2) % 1.2) / 1.2 : 0;
  const fall = t > throwAt - 0.2 ? (cyc < 0.4 ? e(cyc, 0.05, 0.35) : 1 - e(cyc, 0.65, 0.95)) : 0;
  const thrown = t > throwAt - 0.2 ? 1 + Math.floor((t - throwAt + 0.2) / 1.2) : 0;
  const sway = Math.sin(t * 2.2) * 0.06;
  const clinch: Limbs = {armL: -1.9, armR: -1.9, elbowL: -0.5, elbowR: -0.5, armOutL: 0.35, armOutR: -0.35, lean: 0.25, legL: 0.15, legR: -0.25};
  return (
    <>
      <Camp t={t} />
      <Warm />
      <group position={[0, -1, 0]}><Ring size={5} /></group>
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [2.5, 2.2, 5.2], look: [0, 1.0, 0]}, {t: dur, pos: [1.5, 2.0, 4.4], look: [0, 0.9, 0]}]} />
      <group rotation={[0, 0, fall * 1.35]} position={[-0.45 - fall * (wide ? 0.6 : 0.2), fall * 0.15, 0]}>
        <Character look={YOU} expr={fall > 0.3 ? 'shock' : 'pain'} limbs={{...clinch, legL: 0.15 + sway}} t={t} sweat rotY={Math.PI / 2 - 0.2} />
      </group>
      <Character look={FOE} expr="determined" limbs={{...clinch, legR: -0.25 - sway - fall * 0.8}} t={t} position={[0.45, 0, 0]} rotY={-Math.PI / 2 + 0.2} scale={0.78} />
      <group scale={pop(t, cue('clinch', 0.05))}><Sign lines={['THE CLINCH']} sub="WEEK 2" position={[0, wide ? 2.35 : 2.9, -1.4]} w={1.9} h={0.75} /></group>
      {thrown ? <group scale={pop(t, throwAt - 0.2)}><Sign lines={[`THROWN: ${thrown}`]} position={[wide ? -1.8 : -0.9, wide ? 2.1 : 2.35, -0.8]} w={1.3} h={0.42} bg="#1b1a20" fg="#FFD23F" /></group> : null}
      {t > throwAt - 0.3 ? <group scale={pop(t, throwAt - 0.3)}><Sign lines={['HALF YOUR SIZE']} position={[wide ? 1.4 : 0.55, wide ? 1.95 : 1.8, -0.6]} w={1.4} h={0.42} bg="#fff1d6" /></group> : null}
    </>
  );
};

/* 7 ── first sparring: push kick */
export const Spar3: React.FC<P3> = ({t, dur, cue, wide}) => {
  const guard = cue('guard', 0.5), push = cue('push', 0.65), breathe = cue('breathe', 0.85);
  const drop = e(t, guard - 0.1, guard + 0.2);
  const tp = t > push - 0.25 ? (t < push + 0.25 ? e(t, push - 0.25, push) : 1 - e(t, push + 0.3, push + 0.7)) : 0;
  const hurt = e(t, push, push + 0.3);
  const youLimbs: Limbs = hurt > 0.05 ? {armL: -0.3, armR: -0.3, elbowL: -1.6, elbowR: -1.6, lean: 0.5 * hurt, headTilt: 0.25 * hurt, legL: 0.15, legR: -0.1} : {...GUARD, armL: -1.3 + 1.1 * drop, armR: -1.1 + 0.9 * drop, elbowL: -1.5 + 1.0 * drop, elbowR: -1.5 + 1.0 * drop};
  return (
    <>
      <Camp t={t} />
      <Warm />
      <group position={[0, -1, 0]}><Ring size={5} /></group>
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0.2, 2.0, 5.8], look: [0, 1.1, 0]}, {t: push, pos: [0.4, 1.6, 4.4], look: [-0.2, 1.0, 0]}, {t: dur, pos: [0.2, 1.7, 4.8], look: [-0.2, 1.0, 0]}]} />
      <group position={[-0.8 - hurt * 0.35, 0, 0]}>
        <Character look={YOU} expr={hurt > 0.3 ? 'pain' : drop > 0.5 ? 'neutral' : 'determined'} limbs={youLimbs} t={t} gloves="#c0392b" sweat={hurt > 0.3} rotY={Math.PI / 2 - 0.25} />
      </group>
      <Character look={FOE} expr="determined" limbs={{...GUARD, legR: -1.55 * tp, lean: -0.2 * tp}} t={t} gloves="#1d6fd1" position={[0.8, 0, 0]} rotY={-Math.PI / 2 + 0.25} />
      <group scale={pop(t, cue('sparring', 0.05))}><Sign lines={['FIRST SPARRING']} sub="WEEK 3" position={[0, wide ? 2.45 : 2.9, -1.4]} w={2.2} h={0.75} /></group>
      {t > guard - 0.1 && t < push ? <group scale={pop(t, guard)}><Sign lines={['GUARD DOWN!']} position={[-1.6, 2.15, -0.6]} w={1.5} h={0.42} bg="#ffd1dc" /></group> : null}
      {t > push - 0.05 ? <group scale={pop(t, push)}><Sign lines={['PUSH KICK']} sub="TEEP" position={[wide ? 0.9 : 0.35, 1.75, 0.6]} w={1.3} h={0.55} bg="#FFD23F" fg="#1b1a20" /></group> : null}
      {t > breathe - 0.2 ? <group scale={pop(t, breathe - 0.1)}><Sign lines={['O₂: 0%']} position={[-1.6, 2.5, -0.4]} w={1.2} h={0.45} bg="#1b1a20" fg="#FFD23F" /></group> : null}
    </>
  );
};

/* 8 ── fight night */
export const Fight3: React.FC<P3> = ({t, dur, cue, wide}) => {
  const music = cue('music', 0.3), three = cue('Three', 0.55), fire = cue('fire', 0.85);
  const walk = e(t, music - 0.3, music + 2);
  const inRing = t > music + 2;
  const flame = t > fire - 0.2;
  return (
    <>
      <Stadium t={t} excite={t > music ? 1 : 0.3} />
      <ambientLight intensity={0.14} color="#8090ff" />
      <spotLight position={[0, 9, 3]} angle={0.42} penumbra={0.6} intensity={140} color="#ffe6c0" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 3, 4]} intensity={10} distance={10} color="#ff5a3c" />
      <pointLight position={[4, 3, 4]} intensity={10} distance={10} color="#3c7bff" />
      <pointLight position={[0, 4, -1]} intensity={6} distance={5} color="#ffe6c0" />
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 4.2, 10], look: [0, 1.6, 0]}, {t: music + 2, pos: [0.5, 3.0, 7.6], look: [0, 1.9, 0]}, {t: dur, pos: [0.3, 2.6, 6.2], look: [-0.4, 1.9, 0]}]} />
      {!inRing ? (
        <Character look={YOU} expr="scared" limbs={run(t, 1.2)} t={t} gloves="#c0392b" position={[-1 + walk * 0, 0, 4.5 - walk * 1.8]} rotY={Math.PI} sweat />
      ) : (
        <Character look={YOU} expr={flame ? 'tired' : 'determined'} limbs={flame ? TIRED : GUARD} t={t} gloves="#c0392b" sweat position={[-0.9, 1, 0.3]} rotY={0.6} />
      )}
      <Character look={FOE} expr="determined" limbs={GUARD} t={t} gloves="#1d6fd1" position={[1, 1, -0.4]} rotY={-0.7} />
      {t > music - 0.2 && t < three ? [0, 1, 2].map((k) => (
        <group key={k} position={[-2 + k * 2, 3 + Math.sin(t * 3 + k) * 0.2 + ((t * 0.6 + k * 0.3) % 1), -1]}>
          <Sign lines={['♪']} w={0.4} h={0.4} bg="#1b1a20" fg="#FFD23F" />
        </group>
      )) : null}
      <group scale={pop(t, cue('fight', 0.05))}><Sign lines={['FIGHT NIGHT']} sub="WEEK 4" position={[0, 3.9, -2.4]} w={2.6} h={0.9} /></group>
      {t > three - 0.1 ? <group scale={pop(t, three)}><Sign lines={['3 ROUNDS × 3 MIN']} position={[0, 3.2, -1.6]} w={2.4} h={0.5} bg="#1b1a20" fg="#FFD23F" /></group> : null}
      {flame
        ? [0, 1, 2, 3].map((k) => (
            <mesh key={k} position={[-0.9 + (k - 1.5) * 0.08, 2.0 + Math.sin(t * 20 + k) * 0.03, 0.55]} scale={[1, 1 + 0.3 * Math.sin(t * 18 + k), 1]}>
              <coneGeometry args={[0.07, 0.3, 8]} />
              <meshBasicMaterial color={k % 2 ? '#ffb020' : '#ff5a1f'} />
            </mesh>
          ))
        : null}
    </>
  );
};

/* 9 ── what it takes: hill under the stars */
export const Takes3: React.FC<P3> = ({t, dur, cue, wide}) => {
  const items: [string, number][] = [['CARDIO', cue('Cardio', 0.15)], ['SHINS', cue('Shins', 0.3)], ['DISCIPLINE', cue('discipline', 0.55)], ['HEART', cue('heart', 0.78)]];
  return (
    <>
      <color attach="background" args={['#120f2a']} />
      <fog attach="fog" args={['#120f2a', 10, 30]} />
      <ambientLight intensity={0.3} color="#9aa8ff" />
      <directionalLight position={[2, 5, 4]} intensity={1.4} color="#c8d4ff" castShadow />
      <pointLight position={[0, 2.5, 2]} intensity={5} distance={7} color="#ffd29a" />
      {Array.from({length: 120}).map((_, i) => (
        <mesh key={i} position={[((i * 37) % 60) - 30, 4 + ((i * 53) % 18), -20 - (i % 7)]}><sphereGeometry args={[0.05 + (i % 3) * 0.02, 6, 6]} /><meshBasicMaterial color="#fff" fog={false} /></mesh>
      ))}
      <mesh position={[0, -3.5, 0]} receiveShadow><sphereGeometry args={[4, 48, 24]} /><meshStandardMaterial color="#2c5a3a" roughness={0.9} /></mesh>
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 1.4, 6], look: [0, 1.6, 0]}, {t: dur, pos: [0, 1.8, 7.5], look: [0, 2.2, 0]}]} />
      <Character look={YOU} expr="determined" limbs={{armL: -0.1, armR: -0.1, armOutL: -0.5, armOutR: 0.5, headTilt: -0.15}} t={t} position={[0, 0.5, 0]} />
      {items.map(([s, at], i) => (
        <group key={s} scale={pop(t, at - 0.1)}>
          <Sign lines={[s]} position={[(i % 2 ? 1 : -1) * (wide ? 1.9 : 1.15), 3.4 - Math.floor(i / 2) * 0.75, -0.6]} w={1.6} h={0.5} bg="#1b1a20" fg="#FFD23F" />
        </group>
      ))}
    </>
  );
};

/* 10 ── CTA */
export const Cta3: React.FC<P3> = ({t, dur, cue, wide}) => (
  <>
    <Stadium t={t} excite={1} />
    <ambientLight intensity={0.2} color="#8090ff" />
    <spotLight position={[0, 9, 3]} angle={0.45} penumbra={0.6} intensity={150} color="#ffe6c0" castShadow />
    <pointLight position={[0, 4, -1]} intensity={6} distance={5} color="#ffe6c0" />
    <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 3.4, 8.6], look: [0, 2.3, 0]}, {t: dur, pos: [0, 3.0, 7.4], look: [0, 2.4, 0]}]} />
    <Character look={YOU} expr="happy" limbs={{armL: -2.8 + Math.sin(t * 6) * 0.2, armR: -2.8 - Math.sin(t * 6) * 0.2, armOutL: -0.3, armOutR: 0.3}} t={t} gloves="#c0392b" position={[0, 1, 0.3]} />
    <group scale={pop(t, cue('survive', 0.3) - 0.2)}><Sign lines={['WOULD YOU', 'SURVIVE?']} position={[0, 3.9, -1.6]} w={2.4} h={1.2} bg="#1b1a20" fg="#FFD23F" /></group>
    <group scale={pop(t, cue('comments', 0.65))}><Sign lines={['YES 💪']} position={[wide ? -2.2 : -1.2, 2.0, 0.4]} w={1.1} h={0.5} bg="#2e9e5b" fg="#fff" /></group>
    <group scale={pop(t, cue('comments', 0.65) + 0.15)}><Sign lines={['NO 😵']} position={[wide ? 2.2 : 1.2, 2.0, 0.4]} w={1.1} h={0.5} bg="#c0392b" fg="#fff" /></group>
  </>
);

export const SCENES3: Record<string, React.FC<P3>> = {hook: Hook3, run: Run3, pads: Pads3, shins: Shins3, schedule: Schedule3, clinch: Clinch3, spar: Spar3, fight: Fight3, takes: Takes3, cta: Cta3};
export const CHAP3: Record<string, string> = {hook: '', run: 'DAY 1 · 6 AM', pads: 'DAY 1 · PADS', shins: 'DAY 1 · SHINS', schedule: 'WEEK 1', clinch: 'WEEK 2', spar: 'WEEK 3', fight: 'WEEK 4', takes: 'VERDICT', cta: ''};
