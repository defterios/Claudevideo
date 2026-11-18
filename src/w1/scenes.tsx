import React from 'react';
import {interpolate} from 'remotion';
import {Character, Limbs, Look, Sign} from '../v7/char';
import {Cam, P3, TIRED, Warm, YOU as Y0, cl, e, pop, run} from '../v7/scenes3d';
import {Ring} from '../v7/sets';

export const YOU: Look = {...Y0, shirt: '#1f1f24', shorts: '#c0392b', headband: undefined};
export const COACH: Look = {skin: '#a86f48', shirt: '#2e2e2e', shorts: '#2e2e2e', cap: '#c0392b', beard: true};
const BIG: Look[] = [
  {skin: '#c48a5c', shirt: '#c48a5c', shorts: '#1d3557'},
  {skin: '#7a4a2e', shirt: '#d4af37', shorts: '#111'},
  {skin: '#e0b08a', shirt: '#e0b08a', shorts: '#6b2fa0', beard: true},
];
const std = (c: string, r = 0.85) => <meshStandardMaterial color={c} roughness={r} />;
const STAND: Limbs = {armL: 0.05, armR: -0.05, armOutL: 0.1, armOutR: -0.1};
const FLEX: Limbs = {armL: -1.6, armR: -1.6, elbowL: -1.9, elbowR: -1.9, armOutL: 1.1, armOutR: -1.1};
const walk = (t: number, hz = 1.6, a = 0.5): Limbs => {
  const s = Math.sin(t * Math.PI * 2 * hz);
  return {armL: a * s, armR: -a * s, elbowL: -0.3, elbowR: -0.3, legL: -a * 1.1 * s, legR: a * 1.1 * s, bob: Math.abs(s) * 0.04};
};
const Pop: React.FC<{t: number; at: number; until?: number; children: React.ReactNode}> = ({t, at, until = 1e9, children}) =>
  t > at - 0.05 && t < until ? <group scale={pop(t, at)}>{children}</group> : null;
const S: React.FC<{l: string[]; sub?: string; p: [number, number, number]; w?: number; h?: number; dark?: boolean}> = ({l, sub, p, w = 2.2, h = 0.75, dark}) => (
  <Sign lines={l} sub={sub} position={p} w={w} h={h} bg={dark ? '#1b1a20' : '#f4ead5'} fg={dark ? '#FFD23F' : '#b02a1e'} />
);
/** a person falling flat on their back (pivot at the feet) */
export const Faller: React.FC<{look: Look; f: number; t: number; p: [number, number, number]; rotY?: number; expr?: 'shock' | 'pain' | 'determined' | 'tired'}> = ({look, f, t, p, rotY = 0, expr = 'shock'}) => (
  <group position={p} rotation={[0, rotY, 0]}>
    <group rotation={[-f * Math.PI * 0.5, 0, 0]}>
      <Character look={look} expr={expr} limbs={{armL: -0.6 * f, armR: -0.6 * f, armOutL: 0.9 * f, armOutR: -0.9 * f, headTilt: 0.5 * f}} t={t} />
    </group>
  </group>
);

/** the Performance Center: concrete floor, grey walls, rings, racks, banner */
const Warehouse: React.FC<{t: number; rings?: boolean}> = ({rings = true}) => (
  <>
    <color attach="background" args={['#2a2e38']} />
    <fog attach="fog" args={['#2a2e38', 12, 34]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} />{std('#6c6f75', 0.9)}</mesh>
    <mesh position={[0, 4, -9]} receiveShadow><boxGeometry args={[40, 8, 0.3]} />{std('#3d424d')}</mesh>
    {[-12, -6, 0, 6, 12].map((x) => <mesh key={x} position={[x, 6.6, -6]}><boxGeometry args={[0.3, 0.3, 14]} />{std('#262a33')}</mesh>)}
    {[-9, -3, 3, 9].map((x) => <mesh key={x} position={[x, 6.4, -2]}><boxGeometry args={[1.8, 0.08, 0.5]} /><meshStandardMaterial color="#fff" emissive="#eaf2ff" emissiveIntensity={1.5} /></mesh>)}
    <Sign lines={['PERFORMANCE CENTER']} position={[0, 5.4, -8.8]} w={5} h={0.8} bg="#111" fg="#f4f1e8" />
    {rings ? <>
      <group position={[-6.5, 0, -4]} scale={0.8}><Ring size={5} canvas="#e9e1d0" /></group>
      <group position={[6.5, 0, -4]} scale={0.8}><Ring size={5} canvas="#e9e1d0" /></group>
    </> : null}
    {/* weight rack */}
    {[-1, 1].map((s) => (
      <group key={s} position={[s * 3.2, 0, -7.6]}>
        <mesh position={[0, 0.9, 0]} castShadow><boxGeometry args={[1.8, 1.8, 0.5]} />{std('#1c1c1c', 0.5)}</mesh>
        {[0.5, 1.0, 1.5].map((y) => <mesh key={y} position={[0, y, 0.3]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 1.7, 8]} />{std('#aaa', 0.3)}</mesh>)}
        {[0.5, 1.0, 1.5].map((y) => [-0.7, 0.7].map((x) => <mesh key={y + '' + x} position={[x, y, 0.3]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.2, 0.2, 0.08, 16]} />{std('#222', 0.4)}</mesh>))}
      </group>
    ))}
  </>
);
export const Gym: React.FC<{t: number}> = ({t}) => (
  <>
    <Warehouse t={t} />
    <Ring size={5} canvas="#e9e1d0" />
    <Warm key1="#fff2dd" amb={0.55} sun={[3, 8, 4]} />
    <pointLight position={[0, 5, 1]} intensity={10} distance={12} color="#fff1d6" />
  </>
);
/** small arena: dark, spotlit ring, crowd on bleachers */
const Arena: React.FC<{t: number; excite: number; big?: boolean}> = ({t, excite, big}) => {
  const rows = big ? 6 : 3, per = big ? 30 : 18;
  return (
    <>
      <color attach="background" args={['#0b0d18']} />
      <fog attach="fog" args={['#0b0d18', 10, big ? 30 : 22]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 60]} />{std('#15151d')}</mesh>
      <Ring size={5} canvas="#e9e1d0" />
      {Array.from({length: rows * per}).map((_, i) => {
        const r = Math.floor(i / per), k = i % per;
        const a = -Math.PI * 0.8 + (k / (per - 1)) * Math.PI * 1.6, R = 6 + r * 0.9;
        const bob = Math.max(0, Math.sin(t * (5 + (i % 4)) + i)) * 0.14 * excite;
        return (
          <group key={i} position={[Math.sin(a) * R, r * 0.5 + bob, -Math.cos(a) * R]}>
            <mesh position={[0, 0.5, 0]}><capsuleGeometry args={[0.22, 0.4, 4, 8]} />{std(['#2b2f45', '#45304a', '#24304a', '#4a3a2a'][(k + r) % 4])}</mesh>
            <mesh position={[0, 1.05, 0]}><sphereGeometry args={[0.2, 10, 8]} />{std(['#5a3d2b', '#c48a5c', '#8d5a3b'][(k + r) % 3])}</mesh>
            {excite > 0.6 && i % 7 === 0 ? <mesh position={[0.15, 1.3 + bob, 0]}><sphereGeometry args={[0.04, 6, 6]} /><meshBasicMaterial color="#fff" /></mesh> : null}
          </group>
        );
      })}
      <ambientLight intensity={0.25} color="#8090ff" />
      <spotLight position={[0, 9, 2]} angle={0.45} penumbra={0.5} intensity={60} distance={20} color="#fff3dd" castShadow />
      <pointLight position={[0, 3, 4]} intensity={6} distance={10} color="#ffd9b0" />
      {[-1, 1].map((s) => <mesh key={s} position={[s * 4, 6, -6]} rotation={[0, 0, s * (0.3 + Math.sin(t * 2) * 0.2)]}><cylinderGeometry args={[0.05, 0.9, 10, 16, 1, true]} /><meshBasicMaterial color={s > 0 ? '#7aa2ff' : '#ff7ab0'} transparent opacity={0.12} depthWrite={false} /></mesh>)}
    </>
  );
};

/* 1 ── the call / most never make TV / title */
export const Hook: React.FC<P3> = ({t, cue, wide}) => {
  const call = cue('call', 0.1), wwe = cue('WWE', 0.2), doors = cue('doors', 0.55), surv = cue('survive', 0.8);
  const ring = t > call - 0.3 && t < wwe + 1.5;
  if (t < doors - 1.6)
    return (
      <>
        <color attach="background" args={['#f2c79a']} />
        <fog attach="fog" args={['#f2c79a', 10, 30]} />
        <Warm key1="#fff0d8" amb={0.55} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 60]} />{std('#b98e5f')}</mesh>
        <mesh position={[0, 2.5, -2.5]}><boxGeometry args={[12, 5, 0.2]} />{std('#e8d6bd')}</mesh>
        <mesh position={[1.8, 0.3, -1.2]} castShadow><boxGeometry args={[2.2, 0.5, 1.6]} />{std('#4d6a8f')}</mesh>
        <Character look={YOU} expr={t > wwe ? 'shock' : 'neutral'} limbs={{armL: 0.05, armR: -2.3 + (ring ? Math.sin(t * 30) * 0.03 : 0), elbowR: -1.7, armOutR: 0.25, headTilt: -0.05}} t={t} rotY={0.1} />
        <mesh position={[0.32, 1.78, 0.18]} rotation={[0, -0.3, 0]}><boxGeometry args={[0.1, 0.2, 0.03]} />{std('#111', 0.3)}</mesh>
        <Pop t={t} at={wwe}><S l={['WWE TRYOUT']} sub="YOU'RE INVITED" p={[wide ? -2.2 : 0, wide ? 2.7 : 3.0, -1.2]} w={2.2} h={0.85} dark /></Pop>
        <Cam t={t} wide={wide} keys={[{t: 0, pos: [0.4, 1.7, 3.6], look: [0, 1.5, 0]}, {t: doors, pos: [0.2, 1.8, 5.4], look: [0, 1.6, 0]}]} />
      </>
    );
  const lt = t - (doors - 1.6);
  return (
    <>
      <color attach="background" args={['#9fc3e6']} />
      <fog attach="fog" args={['#bcd4ea', 14, 40]} />
      <Warm key1="#fff0d8" amb={0.55} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} />{std('#8a8d92')}</mesh>
      <mesh position={[0, 3, -4]} castShadow receiveShadow><boxGeometry args={[14, 6, 0.4]} />{std('#3d424d')}</mesh>
      <Sign lines={['PERFORMANCE CENTER']} position={[0, 4.8, -3.75]} w={5} h={0.8} bg="#111" fg="#f4f1e8" />
      {[-1, 1].map((s) => <mesh key={s} position={[s * (0.6 + e(lt, 0.4, 1.4) * 0.6), 1.4, -3.75]}><boxGeometry args={[1.2, 2.8, 0.1]} />{std('#1c1c1c', 0.4)}</mesh>)}
      <mesh position={[0, 1.4, -3.78]}><planeGeometry args={[2.4, 2.8]} /><meshBasicMaterial color="#fff6dd" /></mesh>
      {Array.from({length: 7}).map((_, i) => (
        <Character key={i} look={i === 3 ? YOU : BIG[i % 3]} expr={i === 3 ? 'scared' : 'determined'} limbs={walk(t + i * 0.3, 1.4, 0.35)} t={t + i} position={[-3 + i, 0, interpolate(lt, [0, 6], [2.2, -1.2], cl) + (i % 2) * 0.6]} rotY={Math.PI} scale={i === 3 ? 1 : 1.15} />
      ))}
      <Pop t={t} at={doors} until={surv - 0.2}><S l={['MOST NEVER', 'MAKE IT TO TV']} p={[0, 3.3, -2]} w={2.4} h={1.1} /></Pop>
      <Pop t={t} at={surv - 0.15}><S l={['WOULD YOU SURVIVE', 'WWE TRAINING?']} p={[0, 3.2, 0]} w={2.9} h={1.3} dark /></Pop>
      <Cam t={t} wide={wide} keys={[{t: doors - 1.6, pos: [0, 2.2, 7], look: [0, 1.6, 0]}, {t: surv + 2, pos: [0, 2.4, 7.4], look: [0, 2.2, -1]}]} />
    </>
  );
};

/* 2 ── Performance Center; athletes; and then there's you */
export const PC: React.FC<P3> = ({t, cue, wide}) => {
  const perf = cue('Performance', 0.15), col = cue('College', 0.65), oly = cue('Olympians', 0.75), bb = cue('Bodybuilders', 0.85), you = cue("there's", 0.93);
  const tags = [['COLLEGE', 'ATHLETE', col], ['OLYMPIAN', '', oly], ['BODY', 'BUILDER', bb]] as const;
  return (
    <>
      <Warehouse t={t} />
      <Warm key1="#fff2dd" amb={0.55} sun={[3, 8, 4]} />
      <pointLight position={[0, 5, 1]} intensity={9} distance={12} color="#fff1d6" />
      {tags.map(([a, b, at], i) => {
        const x = (wide ? [-2.2, 0, 2.2] : [-1.35, 0, 1.35])[i];
        return (
          <group key={i}>
            <Character look={BIG[i]} expr="determined" limbs={t > at ? FLEX : STAND} t={t + i} position={[x, 0, -1.2]} scale={1.3} />
            <Pop t={t} at={at}><S l={b ? [a, b] : [a]} p={[x, 3.6, -1.6]} w={wide ? 1.6 : 1.25} h={b ? 0.8 : 0.5} /></Pop>
          </group>
        );
      })}
      <Character look={YOU} expr={t > you - 0.3 ? 'scared' : 'happy'} limbs={t < col - 1 ? walk(t, 1.4, 0.4) : {...STAND, headTilt: -0.3}} t={t} position={[interpolate(t, [0, col - 1], [-1.5, 0], cl), 0, interpolate(t, [0, col - 1], [4, 1.6], cl)]} rotY={t < col - 1 ? Math.PI : 0} />
      <Pop t={t} at={perf} until={col - 0.6}><S l={['DAY 1']} sub="ORLANDO, FLORIDA" p={[0, 3.0, -1]} w={1.8} h={0.85} dark /></Pop>
      <Pop t={t} at={you}><S l={['...AND YOU']} p={[0, 2.5, 1.4]} w={1.4} h={0.45} /></Pop>
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 2.2, 9], look: [0, 1.4, 0]}, {t: col - 0.8, pos: [0, 2.4, 8.6], look: [0, 2.0, -1]}, {t: you - 0.3, pos: [0, 2.2, 8.2], look: [0, 1.9, -0.6]}, {t: you + 1, pos: [0.3, 1.7, 4.4], look: [0, 1.5, 1.6]}]} />
    </>
  );
};

/* 3 ── learning how to fall */
export const Bump: React.FC<P3> = ({t, cue, wide}) => {
  const fall = cue('fall', 0.35), bump = cue('bump', 0.6), chin = cue('Chin', 0.66), land = cue('land', 0.85);
  const f = t < fall ? 0 : t < land - 0.3 ? e(t, fall, fall + 0.5) * 0.15 : e(t, land - 0.3, land);
  return (
    <>
      <Gym t={t} />
      <Faller look={YOU} f={f} t={t} p={[-0.3, 1, 0.6]} rotY={0.5} expr={f > 0.9 ? 'pain' : 'determined'} />
      <Character look={COACH} expr="neutral" limbs={{armL: -0.6, armR: -0.6, elbowL: -1.7, elbowR: -1.7, armOutL: 0.5, armOutR: -0.5}} t={t} position={[1.4, 1, -0.6]} rotY={-0.5} />
      <Pop t={t} at={cue('lesson', 0.05)} until={bump - 0.1}><S l={['LESSON 1']} sub="HOW TO FALL" p={[0, 3.5, -1.5]} w={2} h={0.9} dark /></Pop>
      <Pop t={t} at={bump - 0.05}><S l={['TAKING A BUMP']} p={[0, 3.6, -1.5]} w={2.4} h={0.6} dark /></Pop>
      {['CHIN TUCKED', 'ARMS OUT', 'FLAT BACK'].map((s, i) => (
        <Pop key={s} t={t} at={chin + i * 0.75}><S l={[`✓ ${s}`]} p={[wide ? 2.8 : 0.55, 2.75 - i * 0.48, -0.8]} w={1.4} h={0.4} /></Pop>
      ))}
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0.5, 2.4, 7.2], look: [0, 1.8, 0]}, {t: land - 0.3, pos: [1.2, 2.2, 5.6], look: [0, 1.6, 0]}, {t: land + 0.15, pos: [0.4, 3.4, 5.2], look: [-0.3, 1.2, 0]}]} />
    </>
  );
};

/* 4 ── what a ring really is: exploded layers */
export const RingScene: React.FC<P3> = ({t, cue, wide}) => {
  const mat = cue('mat', 0.15), tr = cue('trampoline', 0.42), st = cue('steel', 0.52), foam = cue('foam', 0.75), table = cue('table', 0.92);
  const ex = e(t, st - 0.2, st + 0.6) * (1 - e(t, table - 0.4, table));
  const layer = (y: number, h: number, c: string, at: number, k: number) => (
    <group scale={t > at - 0.1 ? 1 : 0}>
      <mesh position={[0, y + ex * k, 0]} castShadow receiveShadow><boxGeometry args={[4.4, h, 4.4]} />{std(c, 0.8)}</mesh>
    </group>
  );
  const fallF = t < mat - 0.4 ? 0 : e(t, mat - 0.4, mat);
  return (
    <>
      <Warehouse t={t} rings={false} />
      <Warm key1="#fff2dd" amb={0.55} sun={[3, 8, 4]} />
      {t < tr - 0.3 ? (
        <>
          <Ring size={5} canvas="#e9e1d0" />
          <Faller look={YOU} f={fallF} t={t} p={[0, 1, 0.8]} rotY={0.4} expr={fallF > 0.9 ? 'pain' : 'determined'} />
          <Pop t={t} at={mat + 0.1}><S l={['OOF!']} p={[1.6, 2.6, 0]} w={1} h={0.45} /></Pop>
        </>
      ) : (
        <>
          {/* steel frame */}
          <group scale={t > st - 0.1 ? 1 : 0} position={[0, 0, 0]}>
            {[-2, -1, 0, 1, 2].map((x) => <mesh key={x} position={[x, 0.4, 0]}><boxGeometry args={[0.08, 0.8, 4.4]} />{std('#9aa3ad', 0.35)}</mesh>)}
            {[-2, 0, 2].map((z) => <mesh key={z} position={[0, 0.78, z]}><boxGeometry args={[4.4, 0.06, 0.08]} />{std('#9aa3ad', 0.35)}</mesh>)}
          </group>
          {layer(0.88, 0.12, '#a0703f', st + 0.5, 0.45)}
          {layer(0.99, 0.08, '#3d6fb3', foam - 0.1, 0.9)}
          {layer(1.05, 0.04, '#e9e1d0', foam + 0.4, 1.3)}
          {t < tr + 0.9 ? <Pop t={t} at={tr - 0.2}><S l={['NOT A TRAMPOLINE ✗']} p={[0, 3.0, -1]} w={2.4} h={0.55} dark /></Pop> : null}
          <Pop t={t} at={st} until={table - 0.2}><S l={['STEEL FRAME']} p={[wide ? -2.5 : -0.6, 0.6, 2.4]} w={1.3} h={0.36} /></Pop>
          <Pop t={t} at={st + 0.6} until={table - 0.2}><S l={['WOODEN BOARDS']} p={[wide ? 2.5 : 0.6, 1.5, 2.4]} w={1.4} h={0.36} /></Pop>
          <Pop t={t} at={foam} until={table - 0.2}><S l={['THIN FOAM']} p={[wide ? -2.5 : -0.6, 2.3, 2.4]} w={1.2} h={0.36} /></Pop>
          <Pop t={t} at={table}><S l={['= FALLING ONTO', 'A TABLE']} p={[0, 3.0, -1]} w={2.4} h={1} dark /></Pop>
        </>
      )}
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0.6, 2.6, 7], look: [0, 1.4, 0]}, {t: tr - 0.3, pos: [0.6, 2.6, 7], look: [0, 1.4, 0]}, {t: st + 0.6, pos: [3, 3.2, 7.4], look: [0, 1.4, 0]}, {t: table + 2, pos: [1.2, 3, 8], look: [0, 1.7, 0]}]} />
    </>
  );
};

/* 5 ── dozens of bumps; purple back; can't sit */
export const Bumps: React.FC<P3> = ({t, cue, wide}) => {
  const doz = cue('dozens', 0.1), purple = cue('purple', 0.6), groan = cue('groaning', 0.85);
  const ph = ((t - doz + 0.3) % 1.0) / 1.0;
  const f = t < doz - 0.3 ? 0 : ph < 0.35 ? e(ph, 0, 0.3) : 1 - e(ph, 0.55, 0.95);
  const n = Math.max(0, Math.floor((t - doz + 0.3) / 1.0) + 1);
  const late = t > purple - 0.3;
  return (
    <>
      <Gym t={t} />
      {!late ? (
        <Faller look={YOU} f={f} t={t} p={[0, 1, 0.5]} rotY={0.6} expr={f > 0.8 ? 'pain' : 'tired'} />
      ) : (
        <group position={[0, 1, 0.6]}>
          <Character look={{...YOU, shirt: YOU.skin}} expr="pain" limbs={{...TIRED, lean: 0.35}} t={t} rotY={Math.PI} sweat />
          {[[-0.12, 1.05], [0.1, 0.92], [0.02, 1.2], [-0.08, 0.8]].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.27]} scale={pop(t, purple + i * 0.12)}><sphereGeometry args={[0.09, 10, 8]} /><meshStandardMaterial color="#6b2fa0" roughness={0.6} /></mesh>
          ))}
        </group>
      )}
      <Pop t={t} at={doz} until={purple - 0.3}><S l={[`BUMPS: ${Math.min(n * 3, 60)}`]} p={[0, 3.4, -1.5]} w={1.8} h={0.55} dark /></Pop>
      <Pop t={t} at={purple + 0.1}><S l={['BACK = PURPLE']} p={[0, 3.3, -1.5]} w={2} h={0.55} /></Pop>
      <Pop t={t} at={groan}><S l={['OWWW...']} p={[wide ? 1.8 : 0.9, 2.6, 0.5]} w={1.1} h={0.42} /></Pop>
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [1.6, 2.4, 6.6], look: [0, 1.7, 0]}, {t: purple - 0.3, pos: [1.6, 2.4, 6.6], look: [0, 1.7, 0]}, {t: purple + 0.3, pos: [0.3, 2.2, 3.8], look: [0, 1.9, 0.6]}]} />
    </>
  );
};

/* 6 ── the ropes are steel cables */
export const Ropes: React.FC<P3> = ({t, cue, wide}) => {
  const ropes = cue('ropes', 0.1), steel = cue('steel', 0.45), ten = cue('ten', 0.75), br = cue('bruises', 0.85);
  const ph = (t % 2.0) / 2.0; // run across and back
  const x = Math.sin(ph * Math.PI * 2) * 1.85;
  const dir = Math.cos(ph * Math.PI * 2) > 0 ? 1 : -1;
  const close = t > steel - 0.3 && t < ten - 0.3;
  const mins = Math.min(10, Math.floor(Math.max(0, t - ten + 0.4) * 2.2));
  return (
    <>
      <Gym t={t} />
      {close ? (
        <group position={[0, 1.65, 2.5]}>
          <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.16, 0.16, 3, 24]} />{std('#f4f1e8', 0.5)}</mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.4, 0, 0]} scale={e(t, steel, steel + 0.6)}><cylinderGeometry args={[0.17, 0.17, 1.6, 24, 1, true, 0, Math.PI]} />{std('#c0392b', 0.5)}</mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[1.0, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 1.2, 12]} />{std('#9aa3ad', 0.25)}</mesh>
        </group>
      ) : null}
      <Character look={YOU} expr={t > br ? 'pain' : 'determined'} limbs={run(t, 2.4)} t={t} position={[x, 1, 0.4]} rotY={(dir * Math.PI) / 2} sweat={t > ten} />
      {t > br ? [[0.18, 1.05], [0.2, 0.92]].map(([dx, y], i) => <mesh key={i} position={[x + dx * dir, 1 + y, 0.65]} scale={pop(t, br + i * 0.15)}><sphereGeometry args={[0.07, 10, 8]} /><meshStandardMaterial color="#6b2fa0" /></mesh>) : null}
      <Pop t={t} at={ropes} until={steel - 0.3}><S l={['DAY 2: THE ROPES']} p={[0, 3.4, -1.5]} w={2.4} h={0.55} dark /></Pop>
      <Pop t={t} at={steel + 0.2} until={ten - 0.3}><S l={['STEEL CABLE']} sub="RUBBER HOSE + TAPE" p={[0, 2.6, 1.4]} w={1.8} h={0.75} /></Pop>
      <Pop t={t} at={ten}><S l={[`${String(mins).padStart(2, '0')}:00`]} sub="ROPE RUNNING" p={[0, 3.4, -1.5]} w={1.6} h={0.75} dark /></Pop>
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 2.4, 7.2], look: [0, 1.7, 0]}, {t: steel - 0.3, pos: [0, 2.0, 5.4], look: [0, 1.7, 1.6]}, {t: ten - 0.3, pos: [0.4, 2.4, 7.2], look: [0, 1.8, 0]}]} />
    </>
  );
};

/* 7 ── cardio: a sprint that lasts 30 minutes; again; smile */
export const Cardio: React.FC<P3> = ({t, cue, wide}) => {
  const sprint = cue('sprint', 0.2), fif = cue('fifteen', 0.28), drills = cue('drills', 0.55), fire = cue('fire', 0.65), again = cue('again', 0.8), smile = cue('smile', 0.9);
  const m = t < fif ? 0 : t < fif + 0.8 ? 15 : t < fif + 1.6 ? 20 : 30;
  const dead = t > fire - 0.2 && t < again + 0.3;
  return (
    <>
      <Gym t={t} />
      <Character look={YOU} expr={t > smile - 0.1 ? 'happy' : dead ? 'tired' : 'determined'} limbs={dead ? TIRED : t > smile - 0.1 ? FLEX : run(t, 2.6)} t={t} position={[t > drills - 0.5 && !dead && t < smile ? Math.sin(t * 1.6) * 1.5 : 0, 1, 0.5]} rotY={dead || t > smile ? 0.3 : Math.cos(t * 1.6) > 0 ? Math.PI / 2 : -Math.PI / 2} sweat={t > drills} />
      <Character look={COACH} expr={t > again - 0.3 ? 'yell' : 'neutral'} limbs={t > again - 0.3 && t < smile ? {armL: 0, armR: -2.3, elbowR: -0.4} : {armL: -0.6, armR: -0.6, elbowL: -1.7, elbowR: -1.7, armOutL: 0.5, armOutR: -0.5}} t={t} position={[1.8, 1, -1]} rotY={-0.6} />
      <Pop t={t} at={cue('cardio', 0.05)} until={sprint - 0.1}><S l={['WEEK 2: CARDIO']} p={[0, 3.4, -1.5]} w={2.2} h={0.55} dark /></Pop>
      <Pop t={t} at={fif} until={drills - 0.2}><S l={[`${m} MIN`]} sub="ONE MATCH = ONE SPRINT" p={[0, 3.4, -1.5]} w={1.9} h={0.8} dark /></Pop>
      <Pop t={t} at={fire} until={again - 0.2}><S l={['LUNGS ON FIRE 🔥']} p={[0, 3.3, -1.5]} w={2.2} h={0.55} /></Pop>
      <Pop t={t} at={again - 0.1} until={smile - 0.2}><S l={['AGAIN!']} p={[wide ? 2.2 : 0.7, 3.2, -1.2]} w={1.3} h={0.55} dark /></Pop>
      <Pop t={t} at={smile}><S l={['NOW SMILE 😁']} sub="FOR THE CROWD" p={[0, 3.3, -1.5]} w={2} h={0.8} /></Pop>
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 2.6, 8], look: [0, 1.8, 0]}, {t: fire, pos: [0.6, 2.2, 5.6], look: [0, 1.7, 0.3]}, {t: smile + 0.2, pos: [0.2, 2.0, 4.6], look: [0, 1.9, 0.4]}]} />
    </>
  );
};

/* 8 ── promo class: mic, camera, silent coaches */
export const Promo: React.FC<P3> = ({t, cue, wide}) => {
  const mic = cue('microphone', 0.35), cam = cue('camera', 0.47), shakes = cue('shakes', 0.67), forget = cue('forget', 0.74), stare = cue('stare', 0.88);
  const sh = t > shakes - 0.2 ? Math.sin(t * 45) * 0.02 : 0;
  return (
    <>
      <Warehouse t={t} />
      <Warm key1="#fff2dd" amb={0.5} sun={[3, 8, 4]} />
      <spotLight position={[0, 5, 4]} angle={0.4} penumbra={0.6} intensity={30} distance={14} color="#fff3dd" />
      <group position={[sh, 0, 0]}>
        <Character look={YOU} expr={t > shakes - 0.2 ? 'scared' : 'determined'} limbs={{armL: 0.05, armR: t > mic - 0.3 ? -2.2 : 0.05, elbowR: -1.6, armOutR: 0.15}} t={t} position={[0, 0, 1]} />
        {t > mic - 0.3 ? <group position={[0.2, 1.55, 1.32]}>
          <mesh rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.035, 0.025, 0.28, 12]} />{std('#111', 0.4)}</mesh>
          <mesh position={[0, 0.17, 0.05]}><sphereGeometry args={[0.065, 14, 10]} />{std('#777', 0.3)}</mesh>
        </group> : null}
      </group>
      {/* camera on tripod facing them */}
      <group position={[wide ? -1.8 : -1.1, 0, 3.4]} rotation={[0, Math.PI - 0.35, 0]} scale={pop(t, cam - 0.2)}>
        {[-0.2, 0, 0.2].map((x, i) => <mesh key={i} position={[x * 0.8, 0.6, (i - 1) * 0.15]} rotation={[0.15 * (i - 1), 0, -x]}><cylinderGeometry args={[0.02, 0.02, 1.3, 6]} />{std('#222')}</mesh>)}
        <mesh position={[0, 1.35, 0]}><boxGeometry args={[0.4, 0.28, 0.5]} />{std('#1b1b1b', 0.4)}</mesh>
        <mesh position={[0, 1.35, 0.3]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.12, 0.2, 16]} />{std('#333', 0.3)}</mesh>
        <mesh position={[0.14, 1.52, 0]}><sphereGeometry args={[0.03, 8, 8]} /><meshBasicMaterial color={Math.floor(t * 2) % 2 ? '#ff2a2a' : '#5a0000'} /></mesh>
      </group>
      {/* coaches at a desk */}
      <mesh position={[0, 0.75, -1.6]} castShadow><boxGeometry args={[3.4, 0.1, 0.8]} />{std('#5e3b20')}</mesh>
      {[-1, 0, 1].map((x, i) => <Character key={i} look={i === 1 ? COACH : {...COACH, cap: undefined, shirt: ['#3d424d', '', '#24304a'][i]}} expr="neutral" limbs={{armL: -1.2, armR: -1.2, elbowL: -0.5, elbowR: -0.5}} t={t + i} position={[x * 1.1, 0, -2.2]} />)}
      <Pop t={t} at={cue('promo', 0.05)} until={mic - 0.3}><S l={['MONTH 2: PROMO CLASS']} p={[0, 3.3, -2.5]} w={2.8} h={0.55} dark /></Pop>
      <Pop t={t} at={cam + 0.4} until={shakes - 0.3}><S l={['MAKE THEM CARE']} p={[0, 3.3, -2.5]} w={2.2} h={0.55} /></Pop>
      <Pop t={t} at={forget} until={stare - 0.2}><S l={['UHHH...']} p={[wide ? 1.4 : 0.35, 2.55, 1.2]} w={1.0} h={0.42} /></Pop>
      <Pop t={t} at={stare}><S l={['. . .']} sub="SILENCE" p={[0, 2.8, -2.4]} w={1.4} h={0.7} dark /></Pop>
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0.4, 2.0, 6.4], look: [0, 1.5, 0]}, {t: shakes - 0.3, pos: [0.3, 1.8, 4.6], look: [0, 1.6, 1]}, {t: stare - 0.3, pos: [0, 1.8, 4.6], look: [0, 1.6, 1]}, {t: stare + 0.3, pos: [0.2, 1.6, 1.4], look: [0, 1.3, -2.2]}]} />
    </>
  );
};

/* 9 ── first live event */
export const Live: React.FC<P3> = ({t, cue, wide}) => {
  const music = cue('music', 0.45), mist = cue('mistake', 0.65), heart = cue('heart', 0.85);
  const beat = t > heart ? 1 + Math.max(0, Math.sin(t * 14)) * 0.12 : 1;
  const enter = e(t, music - 0.2, music + 2.2);
  return (
    <>
      <Arena t={t} excite={t > music ? 1 : 0.3} />
      <Character look={YOU} expr={t > mist ? 'scared' : 'determined'} limbs={t < music + 2.2 && t > music - 0.2 ? walk(t, 1.4, 0.4) : t > heart ? {...STAND, headTilt: 0.1} : FLEX} t={t} position={[interpolate(enter, [0, 1], [-4.5, 0]), interpolate(enter, [0, 0.8, 1], [0, 0, 1], cl), interpolate(enter, [0, 1], [3, 0.4])]} rotY={enter > 0 && enter < 1 ? 0.9 : 0} sweat={t > mist} />
      <Pop t={t} at={cue('live', 0.05)} until={music - 0.2}><S l={['MONTH 6']} sub="FIRST LIVE EVENT" p={[0, 3.4, -1.5]} w={1.9} h={0.85} dark /></Pop>
      <Pop t={t} at={mist} until={heart - 0.2}><S l={['NO RETAKES']} p={[0, 3.4, -1.5]} w={1.9} h={0.55} /></Pop>
      {t > heart - 0.05 ? <group scale={pop(t, heart) * beat} position={[wide ? 2.2 : 1.1, 3.0, -0.8]}><Sign lines={['♥ 180 BPM']} w={1.5} h={0.5} bg="#ffd1dc" fg="#b02a1e" /></group> : null}
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 4, 10], look: [0, 1.4, 0]}, {t: music, pos: [-1.5, 2.4, 7], look: [-1.2, 1.4, 1]}, {t: mist, pos: [0.4, 2.4, 6.4], look: [0, 1.9, 0]}, {t: heart + 1, pos: [0.2, 2.2, 4.8], look: [0, 2.0, 0.4]}]} />
    </>
  );
};

/* 10 ── on the road */
export const Road: React.FC<P3> = ({t, cue, dur, wide}) => {
  const main = cue('main', 0.15), road = cue('road', 0.35), city = cue('city', 0.5), air = cue('Airports', 0.65), off = cue('off-season', 0.92);
  const stops = ['AIRPORT', 'HOTEL', 'GYM', 'ARENA'];
  const si = Math.min(3, Math.max(0, Math.floor((t - air) / 0.7)));
  const cities = ['DALLAS', 'CHICAGO', 'NEW YORK', 'LONDON', 'TOKYO', 'MIAMI'];
  const ci = Math.floor(Math.max(0, t - city) / 0.45) % cities.length;
  return (
    <>
      <color attach="background" args={['#f2a76f']} />
      <fog attach="fog" args={['#f2b07a', 10, 36]} />
      <Warm key1="#ffc48a" sun={[-5, 4, 3]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[100, 100]} />{std('#8f8a7e')}</mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.5]}><planeGeometry args={[100, 2.4]} />{std('#3c3c40')}</mesh>
      {Array.from({length: 14}).map((_, i) => { const x = ((i * 2.6 - t * 3) % 36) + 18; return <mesh key={i} position={[x - 18, 0.02, 0.5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1, 0.1]} />{std('#f4f1e8')}</mesh>; })}
      {Array.from({length: 10}).map((_, i) => { const x = ((i * 4 - t * 2) % 40) + 20 - 20; const h = 2 + (i % 4) * 1.4; return <mesh key={i} position={[x, h / 2, -5 - (i % 3)]} castShadow><boxGeometry args={[2.2, h, 2]} />{std(['#c9a07a', '#9fa8b5', '#b98e6a', '#d9c3a0'][i % 4])}</mesh>; })}
      {t < main + 1.6 ? (
        <>
          <group position={[0, 0, 0]}><Ring size={4} canvas="#e9e1d0" /></group>
          <Character look={{...YOU, shirt: '#d4af37'}} expr="happy" limbs={{...FLEX}} t={t} position={[0, 1, 0.3]} />
          <Pop t={t} at={main}><S l={['MAIN ROSTER']} p={[0, 3.6, -1.5]} w={2.2} h={0.55} dark /></Pop>
        </>
      ) : (
        <>
          {/* tour van rolling */}
          <group position={[0, 0, 0.6]}>
            <mesh position={[0, 0.8, 0]} castShadow><boxGeometry args={[2.8, 1.2, 1.3]} />{std('#f4f1e8', 0.5)}</mesh>
            <mesh position={[0.7, 1.05, 0.66]}><planeGeometry args={[1, 0.45]} />{std('#3a4a5a', 0.2)}</mesh>
            <mesh position={[-0.5, 0.8, 0.66]}><planeGeometry args={[1.4, 0.4]} /><meshStandardMaterial color="#c0392b" /></mesh>
            {[-0.9, 0.9].map((x) => <mesh key={x} position={[x, 0.25, 0.62]} rotation={[Math.PI / 2, 0, t * 8]}><cylinderGeometry args={[0.25, 0.25, 0.12, 16]} />{std('#111')}</mesh>)}
          </group>
          <Character look={YOU} expr="tired" limbs={{armL: 0, armR: -1.2, elbowR: -0.3}} t={t} position={[0.75, 0.62, 1.3]} rotY={0} scale={0.42} />
          <Pop t={t} at={road} until={city - 0.2}><S l={['MOST OF THE YEAR', 'ON THE ROAD']} p={[0, 3.4, -1.5]} w={2.6} h={1} dark /></Pop>
          {t > city - 0.05 && t < air - 0.2 ? <group scale={pop(t, city)}><S l={[cities[ci]]} sub="TONIGHT" p={[0, 3.4, -1.5]} w={2} h={0.8} /></group> : null}
          {t > air - 0.05 && t < off - 0.2 ? <group scale={pop(t, air + si * 0.7)}><S l={[stops[si]]} p={[0, 3.4, -1.5]} w={1.8} h={0.55} /></group> : null}
          <Pop t={t} at={off}><S l={['NO OFF-SEASON']} p={[0, 3.4, -1.5]} w={2.2} h={0.55} dark /></Pop>
        </>
      )}
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 2.6, 7.6], look: [0, 1.8, 0]}, {t: main + 1.6, pos: [0, 1.9, 5.6], look: [0, 1.5, 0]}, {t: dur, pos: [0.8, 2.0, 5.4], look: [0, 1.6, 0]}]} />
    </>
  );
};

/* 11 ── what it takes: checklist; get back up */
export const Takes: React.FC<P3> = ({t, cue, wide}) => {
  const items = [['A BODY THAT', 'TAKES PUNISHMENT', cue('body', 0.2)], ['CARDIO THAT', 'NEVER QUITS', cue('Cardio', 0.35)], ['CONFIDENCE', 'IN FRONT OF MILLIONS', cue('confidence', 0.5)], ['THE MINDSET', 'TO GET BACK UP', cue('mindset', 0.75)]] as const;
  const bump = cue('bump', 0.95);
  const ph = ((t - 0.4) % 2.2) / 2.2;
  const f = t < bump - 1.2 ? (ph < 0.3 ? e(ph, 0, 0.25) : 1 - e(ph, 0.5, 0.9)) : t < bump ? 1 - e(t, bump - 1.0, bump - 0.1) : 0;
  return (
    <>
      <Gym t={t} />
      {t < bump ? <Faller look={YOU} f={f} t={t} p={[wide ? -1.2 : 0, 1, 0.5]} rotY={0.4} expr="determined" /> : <Character look={YOU} expr="determined" limbs={FLEX} t={t} position={[wide ? -1.2 : 0, 1, 0.5]} />}
      {items.map(([a, b, at], i) => (
        <Pop key={i} t={t} at={at}><Sign lines={[`✓ ${a}`, b]} position={wide ? [2.0, 3.3 - i * 0.62, -0.6] : [0, 5.0 - i * 0.72, -1.2]} w={wide ? 2.3 : 2.7} h={wide ? 0.55 : 0.64} bg="#1b1a20" fg="#FFD23F" /></Pop>
      ))}
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0.4, 2.8, 8.2], look: [0.3, 2.3, 0]}, {t: bump + 1, pos: [0.4, 2.8, 7.6], look: [0.3, 2.4, 0]}]} />
    </>
  );
};

/* 12 ── CTA */
export const Cta: React.FC<P3> = ({t, cue, wide}) => {
  const surv = cue('survive', 0.2), com = cue('comments', 0.6), fol = cue('follow', 0.7);
  return (
    <>
      <Arena t={t} excite={1} big />
      <Character look={{...YOU, shirt: '#d4af37'}} expr="happy" limbs={{armL: -2.8, armR: -2.8, elbowL: -0.2, elbowR: -0.2, armOutL: 0.4, armOutR: -0.4}} t={t} position={[0, 1, 0.4]} />
      <Pop t={t} at={surv}><S l={['WOULD YOU', 'SURVIVE?']} p={[0, 3.6, -1.4]} w={2.2} h={1.1} dark /></Pop>
      <Pop t={t} at={com}><S l={['💬 COMMENT']} p={wide ? [-2.4, 2.4, 0.4] : [-0.62, 0.55, 2.9]} w={wide ? 1.4 : 1.15} h={0.45} /></Pop>
      <Pop t={t} at={fol}><S l={['➕ FOLLOW']} p={wide ? [2.4, 2.4, 0.4] : [0.62, 0.55, 2.9]} w={wide ? 1.3 : 1.05} h={0.45} /></Pop>
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 2.4, 8.4], look: [0, 2.2, 0]}, {t: 7, pos: [0, 2.6, 7.6], look: [0, 2.4, 0]}]} />
    </>
  );
};

export const W1_SCENES: Record<string, React.FC<P3>> = {hook: Hook, pc: PC, bump: Bump, ring: RingScene, bumps: Bumps, ropes: Ropes, cardio: Cardio, promo: Promo, live: Live, road: Road, takes: Takes, cta: Cta};
