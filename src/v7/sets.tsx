import React, {useMemo} from 'react';
import * as THREE from 'three';

const std = (c: string, r = 0.85, e?: string, ei = 0) => <meshStandardMaterial color={c} roughness={r} emissive={e ?? '#000'} emissiveIntensity={ei} />;

export const Palm: React.FC<{position: [number, number, number]; h?: number; t: number; k?: number}> = ({position, h = 4, t, k = 0}) => (
  <group position={position}>
    {Array.from({length: 7}).map((_, i) => (
      <mesh key={i} position={[Math.sin(i * 0.35) * 0.15 * i * 0.3, (i + 0.5) * (h / 7), 0]} rotation={[0, 0, 0.05 * i]} castShadow>
        <cylinderGeometry args={[0.12 - i * 0.008, 0.14 - i * 0.008, h / 7 + 0.02, 10]} />
        {std(i % 2 ? '#8a6a45' : '#7b5c3a')}
      </mesh>
    ))}
    {Array.from({length: 7}).map((_, i) => {
      const a = (i / 7) * Math.PI * 2;
      const sway = Math.sin(t * 1.2 + i + k) * 0.06;
      return (
        <mesh key={'l' + i} position={[Math.cos(a) * 0.9 + 0.3, h + 0.05, Math.sin(a) * 0.9]} rotation={[Math.sin(a) * 0.5, -a, -0.5 + sway]} scale={[1.9, 0.08, 0.42]} castShadow>
          <sphereGeometry args={[0.6, 12, 8]} />
          {std('#2f8f4e', 0.7)}
        </mesh>
      );
    })}
  </group>
);

export const Beach: React.FC<{t: number}> = ({t}) => (
  <>
    <color attach="background" args={['#ffb27a']} />
    <fog attach="fog" args={['#ffc896', 12, 40]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} />{std('#f1d39a', 0.95)}</mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -14]}><planeGeometry args={[80, 18]} /><meshStandardMaterial color="#3fa7c9" roughness={0.25} metalness={0.1} /></mesh>
    <mesh position={[5, 5.5, -36]}><circleGeometry args={[2.6, 40]} /><meshBasicMaterial color="#fff6d8" fog={false} /></mesh>
    <Palm position={[-2.6, 0, -1.5]} t={t} />
    <Palm position={[3.1, 0, -3.5]} h={5} t={t} k={2} />
    <Palm position={[-5, 0, -7]} h={5.5} t={t} k={4} />
  </>
);

/** heavy bag on a chain */
export const Bag: React.FC<{position: [number, number, number]; swing?: number; color?: string}> = ({position, swing = 0, color = '#7a1f1f'}) => (
  <group position={position} rotation={[0, 0, swing]}>
    <mesh position={[0, -0.4, 0]}><cylinderGeometry args={[0.015, 0.015, 0.8, 6]} />{std('#999', 0.4)}</mesh>
    <mesh position={[0, -1.6, 0]} castShadow><capsuleGeometry args={[0.28, 1.3, 8, 20]} />{std(color, 0.55)}</mesh>
    <mesh position={[0, -1.6, 0]}><cylinderGeometry args={[0.285, 0.285, 0.12, 20]} />{std('#e8c547', 0.5)}</mesh>
  </group>
);

export const Ring: React.FC<{size?: number; t?: number; canvas?: string}> = ({size = 5, canvas = '#2d4f8b'}) => {
  const s = size / 2;
  return (
    <group>
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow><boxGeometry args={[size, 1, size]} />{std('#3b3b3b')}</mesh>
      <mesh position={[0, 1.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[size, size]} />{std(canvas, 0.9)}</mesh>
      {[[-s, -s], [s, -s], [-s, s], [s, s]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.75, z]} castShadow><cylinderGeometry args={[0.08, 0.08, 1.5, 12]} />{std(i % 2 ? '#c0392b' : '#1d3557', 0.5)}</mesh>
      ))}
      {[1.3, 1.65, 2.0].map((y, k) =>
        [[0, -s, 0], [0, s, 0], [-s, 0, Math.PI / 2], [s, 0, Math.PI / 2]].map(([x, z, r], i) => (
          <mesh key={k + '-' + i} position={[x, y, z]} rotation={[0, r, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, size, 8]} />{std(k === 1 ? '#f4f1e8' : '#c0392b', 0.5)}</mesh>
        ))
      )}
    </group>
  );
};

/** open-air Thai camp: wooden floor, tin roof on posts, string lights, bags */
export const Camp: React.FC<{t: number}> = ({t}) => (
  <>
    <color attach="background" args={['#f2b07a']} />
    <fog attach="fog" args={['#f2b07a', 10, 32]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 60]} />{std('#c9a36b', 0.95)}</mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow><planeGeometry args={[12, 9]} />{std('#8a5a35', 0.8)}</mesh>
    {[[-5.8, -4.2], [5.8, -4.2], [-5.8, 4.2], [5.8, 4.2], [0, -4.2]].map(([x, z], i) => (
      <mesh key={i} position={[x, 2, z]} castShadow><boxGeometry args={[0.22, 4, 0.22]} />{std('#6b4528')}</mesh>
    ))}
    <mesh position={[0, 4.15, 0]} rotation={[0.05, 0, 0]}><boxGeometry args={[12.6, 0.08, 9.2]} />{std('#9aa3a8', 0.5)}</mesh>
    {Array.from({length: 14}).map((_, i) => (
      <mesh key={'b' + i} position={[-5.6 + i * 0.86, 3.85 - Math.sin((i / 13) * Math.PI) * 0.35, -4.1]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffcf5a" emissiveIntensity={1.6 + 0.4 * Math.sin(t * 3 + i)} />
      </mesh>
    ))}
    <Bag position={[-4.2, 4.1, -2.6]} swing={Math.sin(t * 2) * 0.05} />
    <Bag position={[-3, 4.1, -3.2]} swing={Math.sin(t * 2 + 1) * 0.04} color="#1d3557" />
    <Bag position={[4.4, 4.1, -2.8]} swing={Math.sin(t * 2 + 2) * 0.05} />
    <Palm position={[-8, 0, -8]} h={6} t={t} />
    <Palm position={[8.5, 0, -9]} h={6.5} t={t} k={3} />
  </>
);

/** fight night: dark stadium, spotlit ring, crowd */
export const Stadium: React.FC<{t: number; excite?: number}> = ({t, excite = 1}) => {
  const crowd = useMemo(() => {
    const pts: [number, number, number, string][] = [];
    for (let r = 0; r < 4; r++)
      for (let i = 0; i < 26; i++) {
        const a = -Math.PI * 0.85 + (i / 25) * Math.PI * 1.7;
        const R = 6.2 + r * 0.9;
        pts.push([Math.sin(a) * R, r * 0.45, -Math.cos(a) * R, ['#2b2f45', '#3a2f45', '#24304a', '#40364a'][(i + r) % 4]]);
      }
    return pts;
  }, []);
  return (
    <>
      <color attach="background" args={['#0b0d18']} />
      <fog attach="fog" args={['#0b0d18', 9, 22]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 60]} />{std('#15151d')}</mesh>
      <Ring size={5} canvas="#e9e1d0" />
      {crowd.map(([x, y, z, c], i) => {
        const bob = Math.max(0, Math.sin(t * (5 + (i % 4)) + i)) * 0.12 * excite;
        return (
          <group key={i} position={[x, y + bob, z]}>
            <mesh position={[0, 0.5, 0]}><capsuleGeometry args={[0.22, 0.4, 4, 8]} />{std(c)}</mesh>
            <mesh position={[0, 1.05, 0]}><sphereGeometry args={[0.2, 10, 8]} />{std('#5a3d2b')}</mesh>
          </group>
        );
      })}
    </>
  );
};
