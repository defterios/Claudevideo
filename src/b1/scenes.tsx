import React, {useMemo} from 'react';
import * as THREE from 'three';
import {interpolate} from 'remotion';
import {Character, Limbs, Look, Sign} from '../v7/char';
import {Cam, cl, e, pop} from '../v7/scenes3d';

/** ln = local start of each spoken line in the scene, le = local ends */
export type PB = {t: number; dur: number; ln: number[]; le: number[]; wide: boolean};

const JESUS: Look = {skin: '#b07a52', shirt: '#efe4cc', shorts: '#efe4cc', robe: '#efe4cc', sash: '#9c2a22', hair: '#3a2416', longHair: true, beard: true};
const THIN: Look = {...JESUS, skin: '#9a5f3c', robe: '#d8c7a5', shirt: '#d8c7a5'}; // after 40 days: sunburnt, dusty robe
const ANGEL: Look = {skin: '#d9a77c', shirt: '#ffffff', shorts: '#ffffff', robe: '#ffffff', hair: '#e8c46a', longHair: true, glow: 0.35};
const VILL: Look[] = [
  {skin: '#a86f48', shirt: '#6b8f71', shorts: '#6b8f71', robe: '#6b8f71', hair: '#20140c', beard: true},
  {skin: '#c48a5c', shirt: '#b5653a', shorts: '#b5653a', robe: '#b5653a', hair: '#2a1a10', longHair: true},
  {skin: '#8d5a3b', shirt: '#4d6a8f', shorts: '#4d6a8f', robe: '#4d6a8f', hair: '#140c08'},
];
const STAND: Limbs = {armL: 0.05, armR: -0.05, armOutL: 0.12, armOutR: -0.12};
const walk = (t: number, hz = 1.4, a = 0.45): Limbs => {
  const s = Math.sin(t * Math.PI * 2 * hz);
  return {armL: a * s, armR: -a * s, elbowL: -0.3, elbowR: -0.3, legL: -a * 1.1 * s, legR: a * 1.1 * s, bob: Math.abs(s) * 0.04};
};
const std = (c: string, r = 0.9) => <meshStandardMaterial color={c} roughness={r} />;
const Sky: React.FC<{bg: string; fog: string; near?: number; far?: number}> = ({bg, fog, near = 14, far = 48}) => (
  <>
    <color attach="background" args={[bg]} />
    <fog attach="fog" args={[fog, near, far]} />
  </>
);
const Lights: React.FC<{key1?: string; amb?: number; ambC?: string; sun?: number[]; fill?: string; k?: number}> = ({key1 = '#ffd29a', amb = 0.45, ambC = '#ffd9b0', sun = [3, 6, 4], fill = '#8fb0ff', k = 2.4}) => (
  <>
    <ambientLight intensity={amb} color={ambC} />
    <directionalLight position={sun as [number, number, number]} intensity={k} color={key1} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} />
    <directionalLight position={[-4, 3, -5]} intensity={0.9} color={fill} />
  </>
);
const Ground: React.FC<{c: string; y?: number}> = ({c, y = 0}) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow><planeGeometry args={[140, 140]} />{std(c, 0.97)}</mesh>
);
const Dune: React.FC<{p: [number, number, number]; s: [number, number, number]; c?: string}> = ({p, s, c = '#e2b072'}) => (
  <mesh position={p} scale={s} receiveShadow castShadow><sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />{std(c, 1)}</mesh>
);
const Rock: React.FC<{p: [number, number, number]; s?: number; c?: string; r?: number}> = ({p, s = 0.4, c = '#8a7360', r = 0}) => (
  <mesh position={p} scale={[s, s * 0.7, s]} rotation={[r, r * 2, 0]} castShadow receiveShadow><dodecahedronGeometry args={[1, 0]} />{std(c, 0.95)}</mesh>
);
const Sun: React.FC<{p: [number, number, number]; r?: number; c?: string}> = ({p, r = 3, c = '#fff1c4'}) => (
  <>
    <mesh position={p}><circleGeometry args={[r, 48]} /><meshBasicMaterial color={c} fog={false} /></mesh>
    <mesh position={[p[0], p[1], p[2] - 0.1]}><circleGeometry args={[r * 1.9, 48]} /><meshBasicMaterial color={c} transparent opacity={0.22} fog={false} /></mesh>
  </>
);
/** soft additive glow sprite */
const Glow: React.FC<{p: [number, number, number]; r: number; c: string; o?: number}> = ({p, r, c, o = 0.6}) => (
  <mesh position={p}><sphereGeometry args={[r, 24, 16]} /><meshBasicMaterial color={c} transparent opacity={o} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} /></mesh>
);
/** god-ray cone */
const Beam: React.FC<{p: [number, number, number]; h: number; r: number; o: number; c?: string}> = ({p, h, r, o, c = '#fff3c8'}) => (
  <mesh position={[p[0], p[1] + h / 2, p[2]]}><cylinderGeometry args={[r * 1.6, r, h, 32, 1, true]} /><meshBasicMaterial color={c} transparent opacity={o} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} /></mesh>
);
const Cloud: React.FC<{p: [number, number, number]; s?: number; c?: string}> = ({p, s = 1, c = '#ffffff'}) => (
  <group position={p} scale={s}>
    {[[-1, 0, 0, 1], [0, 0.35, 0, 1.3], [1.1, 0, 0, 1], [0.3, -0.1, 0.4, 0.9]].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]}><sphereGeometry args={[r, 20, 14]} /><meshStandardMaterial color={c} roughness={1} /></mesh>
    ))}
  </group>
);

/** the Tempter: hooded shadow, ember eyes, smoke */
const Tempter: React.FC<{t: number; p?: [number, number, number]; s?: number; o?: number; rotY?: number; big?: boolean}> = ({t, p = [0, 0, 0], s = 1, o = 1, rotY = 0}) => {
  const sway = Math.sin(t * 1.3) * 0.06;
  return (
    <group position={[p[0], p[1] + 0.1 + Math.sin(t * 1.7) * 0.06, p[2]]} rotation={[0, rotY, sway]} scale={s * Math.max(0.001, o)}>
      <mesh position={[0, 0.85, 0]} castShadow><coneGeometry args={[0.62, 1.9, 28, 1, true]} /><meshStandardMaterial color="#120c16" roughness={1} side={THREE.DoubleSide} transparent opacity={o} /></mesh>
      <mesh position={[0, 1.95, 0]}><sphereGeometry args={[0.33, 24, 18]} /><meshStandardMaterial color="#0c0810" roughness={1} transparent opacity={o} /></mesh>
      <mesh position={[0, 1.98, 0.06]} scale={[1.15, 1.2, 1.05]}><sphereGeometry args={[0.36, 24, 18, Math.PI * 0.2, Math.PI * 1.6]} /><meshStandardMaterial color="#1d1424" roughness={1} side={THREE.DoubleSide} transparent opacity={o} /></mesh>
      {[-0.11, 0.11].map((x) => (
        <mesh key={x} position={[x, 1.98, 0.3]}><sphereGeometry args={[0.045, 12, 8]} /><meshBasicMaterial color="#ff3b1f" transparent opacity={o} /></mesh>
      ))}
      <Glow p={[0, 1.98, 0.32]} r={0.1} c="#ff2a10" o={0.3 * o} />
      {/* arms reaching out */}
      <mesh position={[0.48, 1.3, 0.2]} rotation={[0.9, 0, -0.9 + Math.sin(t * 2) * 0.1]}><capsuleGeometry args={[0.07, 0.6, 6, 10]} /><meshStandardMaterial color="#120c16" transparent opacity={o} /></mesh>
      {/* smoke at the hem */}
      {Array.from({length: 9}).map((_, i) => {
        const a = (i / 9) * Math.PI * 2 + t * 0.4;
        const k = (t * 0.5 + i * 0.13) % 1;
        return <mesh key={i} position={[Math.cos(a) * (0.5 + k * 0.5), 0.1 + k * 0.5, Math.sin(a) * (0.5 + k * 0.5)]} scale={0.25 + k * 0.3}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#2a2033" transparent opacity={(1 - k) * 0.55 * o} depthWrite={false} /></mesh>;
      })}
    </group>
  );
};

const Angel: React.FC<{t: number; p: [number, number, number]; rotY?: number; ph?: number}> = ({t, p, rotY = 0, ph = 0}) => {
  const flap = Math.sin(t * 3 + ph) * 0.25;
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <Character look={ANGEL} expr="happy" limbs={{armL: -0.5, armR: -0.5, elbowL: -1.0, elbowR: -1.0, armOutL: 0.3, armOutR: -0.3}} t={t + ph} />
      <mesh position={[0, 2.25, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.28, 0.035, 10, 32]} /><meshBasicMaterial color="#ffd86a" /></mesh>
      <Glow p={[0, 2.25, 0]} r={0.4} c="#ffd86a" o={0.25} />
      {[-1, 1].map((sd) => (
        <group key={sd} position={[0.18 * sd, 1.35, -0.25]} rotation={[0.2, -0.5 * sd, sd * (0.5 + flap)]}>
          <mesh position={[0.55 * sd, 0.15, 0]} scale={[0.6, 0.85, 0.08]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#fffaf0" roughness={0.6} emissive="#fff3d0" emissiveIntensity={0.25} /></mesh>
        </group>
      ))}
    </group>
  );
};

/** stylised dove */
const Dove: React.FC<{t: number; p: [number, number, number]; s?: number}> = ({t, p, s = 1}) => {
  const f = Math.sin(t * 9) * 0.7;
  return (
    <group position={p} scale={s}>
      <mesh scale={[0.18, 0.15, 0.32]}><sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 0.07, 0.25]}><sphereGeometry args={[0.09, 12, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[0.22 * sd, 0.02, 0]} rotation={[0, 0, sd * f]} scale={[0.32, 0.03, 0.18]}><sphereGeometry args={[1, 12, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
      ))}
      <Glow p={[0, 0, 0]} r={0.5} c="#fff6d0" o={0.4} />
    </group>
  );
};

const Kicker: React.FC<{lines: string[]; sub?: string; at: number; t: number; p: [number, number, number]; w?: number; h?: number; dark?: boolean}> = ({lines, sub, at, t, p, w = 2.4, h = 0.8, dark}) =>
  t > at - 0.05 ? (
    <group scale={pop(t, at)} position={p}>
      <Sign lines={lines} sub={sub} w={w} h={h} bg={dark ? '#17121c' : '#f4ead5'} fg={dark ? '#FFD23F' : '#7a2a14'} />
    </group>
  ) : null;

/* 1 ── 30 years a carpenter, nobody noticed */
const Carpenter: React.FC<PB> = ({t, ln, wide}) => {
  const saw = Math.sin(t * 7);
  return (
    <>
      <Sky bg="#e9c89a" fog="#e9c89a" near={10} far={30} />
      <Lights key1="#ffcf8a" amb={0.55} sun={[-3, 5, 4]} />
      <Ground c="#b98e5f" />
      {/* workshop walls */}
      <mesh position={[0, 2, -2.6]} receiveShadow><boxGeometry args={[9, 4, 0.2]} />{std('#cfa776')}</mesh>
      <mesh position={[-4.4, 2, 0]} receiveShadow><boxGeometry args={[0.2, 4, 6]} />{std('#c49b6a')}</mesh>
      {[-3, -1, 1, 3].map((x) => <mesh key={x} position={[x, 3.9, -1]} castShadow><boxGeometry args={[0.18, 0.18, 3.4]} />{std('#6b4528')}</mesh>)}
      {/* workbench + plank */}
      <mesh position={[0.2, 0.75, 0.2]} castShadow receiveShadow><boxGeometry args={[2.2, 0.12, 0.8]} />{std('#7a4e2c')}</mesh>
      {[-0.8, 1.2].map((x) => <mesh key={x} position={[x, 0.37, 0.2]} castShadow><boxGeometry args={[0.12, 0.74, 0.7]} />{std('#5e3b20')}</mesh>)}
      <mesh position={[0.3, 0.86, 0.2]} castShadow><boxGeometry args={[1.6, 0.08, 0.35]} />{std('#d9b07a')}</mesh>
      {/* shavings */}
      {Array.from({length: 10}).map((_, i) => <mesh key={i} position={[-0.6 + (i % 5) * 0.4, 0.02, 0.9 + Math.floor(i / 5) * 0.3]} rotation={[0, i, Math.PI / 2]}><torusGeometry args={[0.06, 0.015, 6, 12, 4]} />{std('#f0cf94')}</mesh>)}
      {/* stacked planks + chair */}
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[-3.2, 0.1 + i * 0.13, -1.6]} rotation={[0, 0.1, 0]} castShadow><boxGeometry args={[1.8, 0.12, 0.3]} />{std(i % 2 ? '#c99b63' : '#b8874f')}</mesh>)}
      <Character look={JESUS} expr="neutral" limbs={{armL: -0.9, armR: -0.95 + saw * 0.25, elbowL: -0.6, elbowR: -0.5 + saw * 0.2, lean: 0.18, headTilt: 0.25}} t={t} position={[0.3, 0, -0.55]} />
      {/* villagers walk past without looking */}
      {VILL.map((v, i) => {
        const x = interpolate(t, [0, 6], [-4.2 + i * 0.4, 4.2 - i * 0.9], cl) * (i % 2 ? -1 : 1);
        return <Character key={i} look={v} expr="neutral" limbs={walk(t + i)} t={t + i * 3} position={[x, 0, -1.95 + (i % 2) * 0.35]} rotY={(i % 2 ? -1 : 1) * Math.PI / 2} />;
      })}
      <Kicker lines={['30 SOWA']} sub="TUKANG KOYUH" at={ln[0] + 0.5} t={t} p={wide ? [-2.6, 2.7, -2.3] : [0, 3.0, -2.3]} w={2} h={0.9} />
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0.4, 1.7, 4.6], look: [0.3, 1.2, -0.5]}, {t: 5.6, pos: [-0.6, 2.0, 6.6], look: [0, 1.5, -0.5]}]} />
    </>
  );
};

/* 2 ── river; the sky tears open; "You are my Son" */
const River: React.FC<PB> = ({t, ln, wide}) => {
  const tear = ln[1] - 0.1; // "Longit pun meh tibuka"
  const open = e(t, tear, tear + 1.4);
  const wade = interpolate(t, [0, ln[1] - 0.3], [0, 1], cl);
  const z = 2.2 - wade * 2.6;
  const dive = e(t, ln[2] - 0.4, ln[2] + 2.2);
  return (
    <>
      <Sky bg={open > 0 ? '#c9d9e8' : '#a8c4dc'} fog="#cfe0e8" near={14} far={50} />
      <Lights key1="#fff1d4" amb={0.5 + open * 0.3} sun={[2, 8, 2]} />
      <Ground c="#7c9a4a" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -0.6]}><planeGeometry args={[60, 4.6]} /><meshStandardMaterial color="#3d87a8" roughness={0.15} metalness={0.2} transparent opacity={0.92} /></mesh>
      {/* water ripples around his legs */}
      {[0, 1, 2].map((i) => { const k = (t * 0.6 + i / 3) % 1; return <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, Math.min(z, 1.2)]}><ringGeometry args={[0.3 + k * 0.9, 0.34 + k * 0.9, 40]} /><meshBasicMaterial color="#e8f6ff" transparent opacity={(1 - k) * 0.5 * (z < 1.4 ? 1 : 0)} /></mesh>; })}
      {/* reeds */}
      {Array.from({length: 26}).map((_, i) => <mesh key={i} position={[-8 + i * 0.65, 0.45, 1.85 + (i % 3) * 0.12]} rotation={[0, 0, Math.sin(t * 1.5 + i) * 0.08]}><cylinderGeometry args={[0.02, 0.03, 0.9, 5]} />{std('#5d7a34')}</mesh>)}
      {[-6, -3.5, 4, 6.5].map((x, i) => <mesh key={x} position={[x, 1.6, -5 - i]} castShadow><sphereGeometry args={[1.4, 16, 12]} />{std('#4f7a3a')}</mesh>)}
      {/* clouds part */}
      <Cloud p={[-1.8 - open * 3.5, 6.5, -8]} s={1.5} c={open > 0.2 ? '#f2eee8' : '#e4e8ee'} />
      <Cloud p={[1.8 + open * 3.5, 6.7, -8]} s={1.6} c={open > 0.2 ? '#f2eee8' : '#e4e8ee'} />
      {open > 0 ? <>
        <Beam p={[0, 0, -0.4]} h={14} r={0.7 + open * 0.3} o={0.28 * open} />
        <Glow p={[0, 7, -8.5]} r={1.8 * open} c="#fff2c0" o={0.8} />
      </> : null}
      {dive > 0 && dive < 1.02 ? <Dove t={t} p={[0.2, 6.5 - dive * 4.2, -0.4 + dive * 0.2]} s={0.9} /> : null}
      <Character look={JESUS} expr={open > 0.3 ? 'happy' : 'neutral'} limbs={wade < 1 ? walk(t, 0.9, 0.3) : {armL: -0.3 - open * 2.2, armR: -0.3 - open * 2.2, armOutL: 0.5 * open, armOutR: -0.5 * open, elbowL: -0.2, elbowR: -0.2, headTilt: -0.45 * open}} t={t} position={[0, -0.55 * Math.min(1, wade * 1.3), z]} rotY={Math.PI} />
      <Kicker lines={['MUU ONAK KU']} sub="OKU NYAYANG MUU" at={ln[2] + 0.4} t={t} p={wide ? [2.7, 3.3, -1] : [0, 3.7, -1]} w={2.4} h={0.9} />
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [1.4, 1.6, 6.2], look: [0, 1.0, 0.4]}, {t: tear, pos: [0.6, 1.4, 5.4], look: [0, 1.4, -0.4]}, {t: tear + 2, pos: [0, 1.0, 6.4], look: [0, 2.0, -1.0]}, {t: 12, pos: [0, 1.4, 6.8], look: [0, 1.9, -0.6]}]} />
    </>
  );
};

/* 3 ── driven into the desert; 40 days */
const Desert: React.FC<PB> = ({t, ln, wide}) => {
  const day = Math.min(40, Math.max(1, Math.round(interpolate(t, [ln[1], ln[1] + 2.6], [1, 40], cl))));
  const heat = Math.sin(t * 3) * 0.02;
  return (
    <>
      <Sky bg="#f2c27f" fog="#f0c88e" near={10} far={45} />
      <Lights key1="#ffe0a8" amb={0.55} sun={[5, 8, 2]} k={2.8} />
      <Ground c="#e3b375" />
      <Dune p={[-6, 0, -9]} s={[7, 2.4, 4]} />
      <Dune p={[6, 0, -12]} s={[9, 3.2, 5]} c="#dba768" />
      <Dune p={[0, 0, -18]} s={[12, 4, 5]} c="#d49c5e" />
      <Sun p={[3.5, 8, -30]} r={2.2} />
      {[[-2.2, 0.2, 0.6, 0.6], [2.4, 0.15, -0.5, 0.45], [1.4, 0.1, 1.6, 0.3], [-3.5, 0.2, -2, 0.8], [3.8, 0.2, -3, 0.9]].map(([x, y, z, s], i) => <Rock key={i} p={[x, y, z]} s={s} r={i} />)}
      {/* wild animal: a snake slithering in front */}
      {Array.from({length: 12}).map((_, i) => <mesh key={i} position={[interpolate(t, [ln[1] + 1, ln[1] + 9], [3.5, -1], cl) + i * 0.13, 0.06, 1.6 + Math.sin(t * 5 - i * 0.7) * 0.12]} castShadow><sphereGeometry args={[0.07 - i * 0.003, 10, 8]} />{std(i === 0 ? '#3b3020' : '#6b5a2e', 0.6)}</mesh>)}
      {/* vulture circling */}
      <group position={[Math.cos(t * 0.6) * 3, 5 + Math.sin(t) * 0.2, -3 + Math.sin(t * 0.6) * 1.5]} rotation={[0, -t * 0.6, Math.sin(t * 2) * 0.2]}>
        <mesh scale={[0.9, 0.05, 0.25]}><sphereGeometry args={[1, 12, 8]} />{std('#2b2018')}</mesh>
      </group>
      <Character look={t < ln[1] ? JESUS : THIN} expr={t < ln[1] ? 'determined' : 'tired'} limbs={t < ln[1] ? walk(t, 1.1, 0.4) : {...walk(t, 0.6, 0.2), lean: 0.2, headTilt: 0.3}} t={t} position={[interpolate(t, [0, 11], [-2.2, 0.6], cl), heat, 0]} rotY={0.55} sweat={t > ln[1]} />
      <Kicker lines={['PADANG PASIR']} at={ln[0] + 1.2} t={t} p={wide ? [-2.8, 3.1, -1.5] : [0, 3.4, -1.5]} w={2.6} h={0.75} />
      {t > ln[1] - 0.1 ? <group scale={pop(t, ln[1])} position={wide ? [2.8, 3.1, -1.5] : [0, 3.4, -1.4]}><Sign lines={[`${day} ONU`]} sub="DOI PINGUMAN" w={2} h={0.95} bg="#17121c" fg="#FFD23F" /></group> : null}
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 5, 10], look: [-1, 1, 0]}, {t: ln[1], pos: [1.2, 1.9, 6.4], look: [0, 1.3, 0]}, {t: 11, pos: [-0.6, 1.6, 5.2], look: [0.4, 1.4, 0]}]} />
    </>
  );
};

const Night: React.FC<{moon?: boolean}> = ({moon = true}) => (
  <>
    <Sky bg="#1d1d3a" fog="#262447" near={10} far={40} />
    <ambientLight intensity={0.6} color="#9a9fe6" />
    <directionalLight position={[-4, 7, 3]} intensity={1.4} color="#b9c4ff" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} />
    <Ground c="#6b5a5a" />
    <Dune p={[-6, 0, -9]} s={[7, 2.4, 4]} c="#5b4b55" />
    <Dune p={[6, 0, -12]} s={[9, 3.2, 5]} c="#4f4250" />
    {moon ? <Sun p={[-5, 8, -30]} r={1.6} c="#e8ecff" /> : null}
    {Array.from({length: 60}).map((_, i) => <mesh key={i} position={[((i * 37) % 60) - 30, 6 + ((i * 13) % 14), -32]}><circleGeometry args={[0.05 + (i % 3) * 0.03, 6]} /><meshBasicMaterial color="#ffffff" fog={false} /></mesh>)}
    {/* campfire-less: a small ember glow on rocks */}
    <Rock p={[-1.8, 0.15, 0.6]} s={0.5} c="#4d4048" />
    <Rock p={[2.2, 0.15, -0.4]} s={0.6} c="#4d4048" r={2} />
  </>
);

/* 4 ── then came a whisper */
const Whisper: React.FC<PB> = ({t, ln, wide}) => {
  const rise = e(t, ln[0] + 0.6, ln[0] + 2.4);
  return (
    <>
      <Night />
      <Character look={THIN} expr="tired" limbs={{armL: 0.1, armR: 0.1, lean: 0.25, headTilt: 0.35, headTurn: rise * 0.5}} t={t} position={[-0.7, 0, 0.3]} rotY={0.5} />
      <Tempter t={t} p={[1.6, -2 + rise * 2, -0.6]} o={rise} rotY={-0.6} />
      <Glow p={[1.6, 1.4, -0.6]} r={1.2} c="#5a1030" o={0.35 * rise} />
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [-1.6, 1.5, 4.6], look: [-0.4, 1.2, 0]}, {t: 3, pos: [0.6, 1.4, 5.4], look: [0.6, 1.4, -0.3]}]} />
    </>
  );
};

/* 5 ── stone into bread; "man does not live on bread alone" */
const Bread: React.FC<PB> = ({t, ln, wide}) => {
  const morph = e(t, ln[0] + 1.6, ln[0] + 3.2);
  const reject = e(t, ln[1] - 0.2, ln[1] + 0.6);
  const back = interpolate(reject, [0, 1], [1, 0.25]);
  return (
    <>
      <Night />
      <Character look={THIN} expr={reject > 0.5 ? 'determined' : 'tired'} limbs={{armL: 0.1, armR: -1.4 * reject, elbowR: -0.2 * reject, armOutR: -0.3 * reject, lean: 0.25 - reject * 0.25, headTilt: 0.3 - reject * 0.3}} t={t} position={[-0.9, 0, 0.3]} rotY={0.45} />
      <Tempter t={t} p={[1.5, 0, -0.5]} o={back < 0.3 ? 0.55 : 1} rotY={-0.6} />
      {/* the stone ↔ bread */}
      <group position={[0.3, 0.25, 0.7]}>
        {morph < 1 ? <mesh scale={(1 - morph) * 0.32 + 0.01} castShadow><dodecahedronGeometry args={[1, 0]} />{std('#77706c', 0.95)}</mesh> : null}
        {morph > 0 ? <mesh scale={[0.38 * morph, 0.22 * morph, 0.26 * morph]} castShadow><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#c98a43" roughness={0.7} emissive="#ffa040" emissiveIntensity={0.25 * (1 - reject)} /></mesh> : null}
        <Glow p={[0, 0, 0]} r={0.5} c="#ffb050" o={0.35 * morph * (1 - reject * 0.7)} />
      </group>
      <Kicker lines={['BATUH → RUTI']} at={ln[0] + 1.8} t={t} p={wide ? [2.6, 3.0, -1.5] : [0, 3.3, -1.5]} w={2.4} h={0.75} dark />
      <Kicker lines={['IDEH JEK RUTI']} sub="MISIA IDEH DI EH IDIP PAKAI PINGUMAN SIJA" at={ln[1] + 0.8} t={t} p={wide ? [-2.6, 3.0, -1.5] : [0, 3.3, -1.4]} w={2.6} h={0.95} />
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [1.6, 1.5, 5.4], look: [0.1, 0.9, 0.4]}, {t: ln[0] + 3.2, pos: [0.6, 1.0, 3.6], look: [0.3, 0.5, 0.6]}, {t: ln[1], pos: [-0.2, 1.7, 5.6], look: [0, 1.3, 0]}]} />
    </>
  );
};

/* 6 ── temple pinnacle: jump */
const Jump: React.FC<PB> = ({t, ln, wide}) => {
  const top = 7;
  return (
    <>
      <Sky bg="#e8b48a" fog="#e8b48a" near={12} far={60} />
      <Lights key1="#ffd5a0" amb={0.5} sun={[6, 10, 3]} />
      <Ground c="#c9a77a" y={0} />
      {/* city below */}
      {Array.from({length: 30}).map((_, i) => { const x = ((i * 23) % 26) - 13, z = -((i * 11) % 18) - 2, h = 0.6 + (i % 4) * 0.4; return <mesh key={i} position={[x, h / 2, z]} castShadow receiveShadow><boxGeometry args={[1.2, h, 1.2]} />{std(i % 3 ? '#e6cfa3' : '#d4b88a')}</mesh>; })}
      {/* temple tower */}
      <mesh position={[0, top / 2, 0]} castShadow receiveShadow><boxGeometry args={[2.6, top, 2.6]} />{std('#efe1bf')}</mesh>
      <mesh position={[0, top + 0.08, 0]} receiveShadow><boxGeometry args={[2.9, 0.16, 2.9]} />{std('#d7c29a')}</mesh>
      {[-1.3, 1.3].map((x) => <mesh key={x} position={[x, top - 2, 1.31]}><boxGeometry args={[0.4, 1.4, 0.05]} />{std('#3b2a1e')}</mesh>)}
      <group position={[0, top + 0.16, 0]}>
        <Character look={THIN} expr="determined" limbs={{...STAND, armL: 0.05, armR: 0.05}} t={t} position={[-0.5, 0, 0.6]} rotY={0.3} />
        <Tempter t={t} p={[0.7, 0, 0.2]} rotY={-0.5} />
      </group>
      <Kicker lines={['BITABUNG!']} at={ln[0] + 0.2} t={t} p={wide ? [2.7, top + 2.2, -0.5] : [0, top + 2.7, -0.8]} w={2.2} h={0.7} dark />
      <Kicker lines={['MA MU SUBA TOPA']} at={ln[1] + 0.9} t={t} p={wide ? [-2.7, top + 2.2, -0.5] : [0, top + 2.7, -0.6]} w={2.6} h={0.7} />
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [1.5, 1.2, 9], look: [0, top, 0]}, {t: 1.8, pos: [2.8, top + 2.2, 6.5], look: [0, top + 1, 0]}, {t: ln[1], pos: [0.6, top + 2.6, 5.2], look: [0, top + 1.1, 0]}, {t: 8, pos: [-0.4, top + 1.6, 5.6], look: [0, top + 1.2, 0]}]} />
    </>
  );
};

/* 7 ── bow to me / starving, shaking, alone / "Go." */
const Bow: React.FC<PB> = ({t, ln, wide}) => {
  const go = ln[2]; // "Meh in eh: Buu"
  const blast = e(t, go + 0.5, go + 1.2);
  const tempO = 1 - blast;
  const shake = t > ln[1] && t < go + 0.4 ? Math.sin(t * 40) * 0.025 : 0;
  const golden = 1 - blast * 0.4;
  return (
    <>
      <Sky bg={blast > 0.5 ? '#ffe9c2' : '#5b3a5c'} fog={blast > 0.5 ? '#ffe2b8' : '#6a4466'} near={12} far={70} />
      <Lights key1={blast > 0.5 ? '#fff1d0' : '#ffb27a'} amb={0.45 + blast * 0.4} sun={[-6, 6, 3]} />
      {/* mountain top */}
      <mesh position={[0, -6, -1]} castShadow receiveShadow><coneGeometry args={[9, 12, 9]} />{std('#8a6a5a')}</mesh>
      <mesh position={[0, -40, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[400, 400]} />{std('#6b4a58')}</mesh>
      {/* golden kingdoms far below */}
      {Array.from({length: 18}).map((_, i) => { const a = -0.9 + (i / 17) * 1.8, r = 22 + (i % 3) * 5; return (
        <group key={i} position={[Math.sin(a) * r, -9 + (i % 2), -Math.cos(a) * r]}>
          <mesh><boxGeometry args={[2, 2 + (i % 4), 2]} /><meshStandardMaterial color="#e2b44a" emissive="#ffb030" emissiveIntensity={0.55 * golden} metalness={0.4} roughness={0.4} /></mesh>
          <mesh position={[0, 1.6 + (i % 4) / 2, 0]}><coneGeometry args={[0.8, 1.4, 4]} /><meshStandardMaterial color="#f2c860" emissive="#ffc040" emissiveIntensity={0.6 * golden} /></mesh>
        </group>); })}
      <Character look={THIN} expr={t > go - 0.2 ? 'yell' : t > ln[1] ? 'pain' : 'tired'} limbs={t > go - 0.1 ? {armL: -0.4, armR: -1.9, elbowR: -0.1, armOutR: -0.2, lean: -0.05} : {armL: 0.15, armR: 0.2, lean: 0.3, headTilt: 0.35, legL: 0.1, legR: -0.1}} t={t} position={[-0.7 + shake, 0, 0.6]} rotY={0.5} sweat={t > ln[1]} />
      <Tempter t={t} p={[1.3, 0, -0.4]} s={1.25 + (1 - tempO) * 0.3} o={tempO} rotY={-0.5} />
      {/* the tempter's arm sweeping over the kingdoms */}
      {blast > 0 ? <>
        <Glow p={[-0.6, 1.5, 0.6]} r={0.5 + blast * 6} c="#fff3c8" o={0.6 * (1 - blast * 0.6)} />
        <Beam p={[-0.6, 0, 0.6]} h={30} r={0.6} o={0.25 * blast} />
      </> : null}
      <Kicker lines={['SUJUD TUDU OKU']} sub="DOI MONAM · DOI SALIP" at={ln[0] + 0.6} t={t} p={wide ? [2.2, 2.75, -1.6] : [0.2, 2.75, -2.4]} w={2.2} h={0.85} dark />
      {t > go ? <group scale={pop(t, go + 0.3)} position={wide ? [-2.6, 3.0, -1] : [0.6, 3.0, -1]}><Sign lines={['BUU!']} w={1.6} h={0.75} /></group> : null}
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [-2, 2.6, 7], look: [0, 0.4, -6]}, {t: 2.5, pos: [0.6, 2.0, 6.4], look: [0.3, 1.4, 0]}, {t: ln[1], pos: [-1.3, 1.7, 4.6], look: [-0.5, 1.6, 0.3]}, {t: go, pos: [-0.8, 1.7, 5.0], look: [-0.4, 1.7, 0.3]}, {t: go + 2, pos: [0, 2.2, 7], look: [0, 1.6, 0]}]} />
    </>
  );
};

/* 8 ── the whisper left, angels came; walks out unstoppable */
const Angels: React.FC<PB> = ({t, ln, wide}) => {
  const descend = e(t, 0.5, 3.5);
  const out = t > ln[1] - 0.2;
  const k = e(t, ln[1] - 0.2, ln[1] + 5);
  return (
    <>
      <Sky bg="#ffd6a8" fog="#ffd9ae" near={12} far={50} />
      <Lights key1="#ffe0b0" amb={0.6} sun={[0, 5, -6]} fill="#ffc8e0" />
      <Ground c="#e7b878" />
      <Dune p={[-6, 0, -9]} s={[7, 2.4, 4]} />
      <Dune p={[6, 0, -12]} s={[9, 3.2, 5]} c="#dba768" />
      <Sun p={[0, 2.4 + t * 0.15, -30]} r={3} c="#fff0c8" />
      {[-1, 1].map((sd, i) => <Angel key={sd} t={t} ph={i} p={[sd * 1.4, 5 - descend * 5 + Math.sin(t * 1.5 + i) * 0.08, -0.6]} rotY={-sd * 0.4} />)}
      {Array.from({length: 22}).map((_, i) => { const q = (t * 0.25 + i / 22) % 1; return <Glow key={i} p={[((i * 7) % 9) - 4.5, q * 5, -1 + ((i * 3) % 4) - 2]} r={0.04} c="#fff3c0" o={(1 - q) * 0.9} />; })}
      <Character look={THIN} expr={out ? 'determined' : 'tired'} limbs={out ? walk(t, 1.2, 0.45) : {armL: 0.1, armR: 0.1, lean: 0.25, headTilt: -0.3 * descend}} t={t} position={[0, 0, out ? 0.2 + k * 3.2 : 0.2]} rotY={0} />
      <Kicker lines={['MALAIKAT MEH NEG']} at={ln[0] + 1.2} t={t} p={wide ? [0, 3.6, -2.5] : [0, 4.0, -2.5]} w={2.8} h={0.7} />
      {out ? <group scale={pop(t, ln[1] + 2.4)} position={wide ? [2.8, 3.1, -1.2] : [0, 3.7, -1.2]}><Sign lines={['ROMAH · KOWEK']} sub="TAPI MASIH GOGAH" w={2.6} h={0.95} bg="#17121c" fg="#FFD23F" /></group> : null}
      <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 1.4, 6.6], look: [0, 2.6, -0.6]}, {t: ln[1] - 0.2, pos: [0, 1.6, 6.8], look: [0, 1.5, 0]}, {t: 10, pos: [0, 1.5, 7.8], look: [0, 1.4, 2.4]}]} />
    </>
  );
};

/* 9 ── the kingdom of God is near */
const Kingdom: React.FC<PB> = ({t, ln, wide}) => (
  <>
    <Sky bg="#ffe3b3" fog="#ffe6bd" near={12} far={60} />
    <Lights key1="#fff0cc" amb={0.65} sun={[0, 6, -6]} fill="#ffd0e8" />
    <Ground c="#8fa860" />
    <mesh position={[0, -2.6, -1]} scale={[1, 0.6, 1]} receiveShadow castShadow><sphereGeometry args={[5, 40, 24]} />{std('#93b062')}</mesh>
    <Sun p={[0, 4, -30]} r={3.4} c="#fff4d0" />
    {Array.from({length: 9}).map((_, i) => <mesh key={i} position={[0, 4, -29]} rotation={[0, 0, (i / 9) * Math.PI * 2 + t * 0.08]}><planeGeometry args={[0.5, 40]} /><meshBasicMaterial color="#fff6d8" transparent opacity={0.13} fog={false} depthWrite={false} /></mesh>)}
    <Character look={THIN} expr="happy" limbs={{armL: -0.3, armR: -0.3, armOutL: 0.7, armOutR: -0.7, elbowL: -0.1, elbowR: -0.1}} t={t} position={[0, 0.38, -0.6]} rotY={0} />
    {VILL.map((v, i) => <Character key={i} look={v} expr="happy" limbs={{...STAND, headTilt: -0.15}} t={t + i} position={[[-1.7, 1.7, -2.6][i], 0.3, [2.4, 2.2, 1.6][i]]} rotY={Math.PI + [-0.5, 0.5, -0.7][i]} scale={0.95} />)}
    <Kicker lines={['PRITAH TOPA', 'MEH SINEK']} at={ln[0] + 1.2} t={t} p={wide ? [2.9, 4.4, -1.5] : [0, 4.8, -1.5]} w={2.5} h={1.2} />
    <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 1.6, 9.5], look: [0, 1.9, 0]}, {t: 4.6, pos: [0, 2.2, 8.4], look: [0, 2.3, 0]}]} />
  </>
);

/* 10 ── title card */
const Title: React.FC<PB> = ({t, ln, wide}) => (
  <>
    <Sky bg="#f0a96a" fog="#f2b47a" near={10} far={45} />
    <Lights key1="#ffc88a" amb={0.55} sun={[-4, 4, 4]} />
    <Ground c="#d99a5e" />
    <Dune p={[-6, 0, -9]} s={[7, 2.4, 4]} c="#cf8f55" />
    <Dune p={[6, 0, -12]} s={[9, 3.2, 5]} c="#c78549" />
    <Sun p={[2, 3, -30]} r={3} c="#ffe2b0" />
    <Character look={THIN} expr="determined" limbs={walk(t, 1.0, 0.35)} t={t} position={[interpolate(t, [0, 7.5], [-1.6, 3.6], cl), 0, -2.2]} rotY={Math.PI / 2 - 0.3} scale={0.8} />
    <group scale={pop(t, 0.3)} position={[0, 2.4, 0]}><Sign lines={['EPISOD 1', 'PADANG PASIR']} w={2.6} h={1.3} bg="#17121c" fg="#FFD23F" /></group>
    {t > ln[0] + 2.4 ? <group scale={pop(t, ln[0] + 2.5)} position={[0, 1.35, 0.1]}><Sign lines={['FOLLOW SUO PART 2 →']} w={2.2} h={0.42} /></group> : null}
    <Cam t={t} wide={wide} keys={[{t: 0, pos: [0, 2.2, 6.4], look: [0, 2.0, 0]}, {t: 7, pos: [0, 2.0, 5.6], look: [0, 1.9, 0]}]} />
  </>
);

export const BIBLE_SCENES: Record<string, React.FC<PB>> = {carpenter: Carpenter, river: River, desert: Desert, whisper: Whisper, bread: Bread, jump: Jump, bow: Bow, angels: Angels, kingdom: Kingdom, title: Title};
