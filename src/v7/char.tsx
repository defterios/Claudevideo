import React, {useMemo} from 'react';
import * as THREE from 'three';

/** Cute big-head 3D character (reference style). Units: ~1 = 1 m. Feet at y=0. */
export type Look = {skin: string; shirt: string; shorts: string; hair?: string; headband?: string; beard?: boolean; cap?: string};
export type Expr = 'happy' | 'neutral' | 'scared' | 'tired' | 'shock' | 'determined' | 'pain';
export type Limbs = {armL: number; armR: number; elbowL?: number; elbowR?: number; legL?: number; legR?: number; lean?: number; headTilt?: number; headTurn?: number; bob?: number; armOutL?: number; armOutR?: number};

const M = (c: string, r = 0.75) => new THREE.MeshStandardMaterial({color: c, roughness: r, metalness: 0});

const Limb: React.FC<{len: number; r: number; mat: THREE.Material; rot: number; rotZ?: number; elbow?: number; hand?: THREE.Material; handR?: number}> = ({len, r, mat, rot, rotZ = 0, elbow = 0, hand, handR}) => (
  <group rotation={[rot, 0, rotZ]}>
    <mesh position={[0, -len / 4, 0]} material={mat} castShadow>
      <capsuleGeometry args={[r, len / 2 - r, 6, 12]} />
    </mesh>
    <group position={[0, -len / 2, 0]} rotation={[elbow, 0, 0]}>
      <mesh position={[0, -len / 4, 0]} material={mat} castShadow>
        <capsuleGeometry args={[r * 0.92, len / 2 - r, 6, 12]} />
      </mesh>
      {hand ? (
        <mesh position={[0, -len / 2 - 0.02, 0]} material={hand} castShadow>
          <sphereGeometry args={[handR ?? r * 1.35, 16, 12]} />
        </mesh>
      ) : null}
    </group>
  </group>
);

export const Character: React.FC<{look: Look; expr?: Expr; limbs: Limbs; t: number; gloves?: string; pads?: boolean; sweat?: boolean; position?: [number, number, number]; rotY?: number; scale?: number}> = ({look, expr = 'neutral', limbs, t, gloves, pads, sweat, position = [0, 0, 0], rotY = 0, scale = 1}) => {
  const mats = useMemo(
    () => ({skin: M(look.skin, 0.65), shirt: M(look.shirt), shorts: M(look.shorts, 0.5), hair: M(look.hair ?? '#1a1210', 0.9), white: M('#ffffff', 0.25), black: M('#111111', 0.3), band: M(look.headband ?? '#c0392b', 0.6), glove: M(gloves ?? '#c0392b', 0.35), pad: M('#1d3557', 0.5), cap: M(look.cap ?? '#333', 0.7)}),
    [look, gloves]
  );
  const blink = Math.floor(t * 10) % 41 === 0;
  const eyeS: Record<Expr, number> = {happy: 1, neutral: 1, scared: 1.25, tired: 0.55, shock: 1.35, determined: 0.8, pain: 0.35};
  const browA: Record<Expr, number> = {happy: 0, neutral: 0, scared: -0.35, tired: 0.25, shock: -0.45, determined: 0.4, pain: 0.45};
  const es = blink ? 0.12 : eyeS[expr];
  const bob = limbs.bob ?? 0;
  const handMat = gloves ? mats.glove : pads ? mats.pad : mats.skin;
  const handR = gloves ? 0.13 : pads ? 0.15 : undefined;
  return (
    <group position={position} rotation={[0, rotY, 0]} scale={scale}>
      <group position={[0, bob, 0]} rotation={[limbs.lean ?? 0, 0, 0]}>
        {/* legs */}
        <group position={[-0.13, 0.62, 0]}>
          <Limb len={0.62} r={0.075} mat={mats.skin} rot={limbs.legL ?? 0} hand={mats.black} handR={0.1} />
        </group>
        <group position={[0.13, 0.62, 0]}>
          <Limb len={0.62} r={0.075} mat={mats.skin} rot={limbs.legR ?? 0} hand={mats.black} handR={0.1} />
        </group>
        {/* shorts + body */}
        <mesh position={[0, 0.66, 0]} material={mats.shorts} castShadow>
          <cylinderGeometry args={[0.25, 0.27, 0.22, 20]} />
        </mesh>
        <mesh position={[0, 0.98, 0]} material={mats.shirt} castShadow>
          <capsuleGeometry args={[0.24, 0.32, 8, 20]} />
        </mesh>
        {/* arms */}
        <group position={[-0.3, 1.18, 0]}>
          <Limb len={0.56} r={0.065} mat={mats.skin} rot={limbs.armL} rotZ={limbs.armOutL ?? -0.15} elbow={limbs.elbowL ?? 0} hand={handMat} handR={handR} />
        </group>
        <group position={[0.3, 1.18, 0]}>
          <Limb len={0.56} r={0.065} mat={mats.skin} rot={limbs.armR} rotZ={limbs.armOutR ?? 0.15} elbow={limbs.elbowR ?? 0} hand={handMat} handR={handR} />
        </group>
        {/* head */}
        <group position={[0, 1.72, 0]} rotation={[limbs.headTilt ?? 0, limbs.headTurn ?? 0, 0]}>
          <mesh material={mats.skin} castShadow>
            <sphereGeometry args={[0.42, 40, 32]} />
          </mesh>
          <mesh position={[0, 0.1, -0.03]} scale={[1.02, 0.78, 1.02]} material={mats.hair}>
            <sphereGeometry args={[0.42, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
          </mesh>
          {look.beard ? (
            <mesh position={[0, -0.1, 0.02]} scale={[1, 0.8, 1]} material={mats.hair}>
              <sphereGeometry args={[0.415, 32, 20, Math.PI * 0.2, Math.PI * 0.6, Math.PI * 0.68, Math.PI * 0.3]} />
            </mesh>
          ) : null}
          {look.headband ? (
            <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2 - 0.12, 0, 0]} material={mats.band}>
              <torusGeometry args={[0.405, 0.035, 10, 40]} />
            </mesh>
          ) : null}
          {look.cap ? (
            <group position={[0, 0.2, 0]}>
              <mesh material={mats.cap}><sphereGeometry args={[0.43, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} /></mesh>
              <mesh position={[0, 0.02, 0.38]} rotation={[0.25, 0, 0]} material={mats.cap}><boxGeometry args={[0.4, 0.03, 0.25]} /></mesh>
            </group>
          ) : null}
          {/* eyes */}
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.15, 0.03, 0.36]}>
              <mesh scale={[1, es, 0.6]} material={mats.white}>
                <sphereGeometry args={[0.085, 20, 16]} />
              </mesh>
              <mesh position={[0, 0, 0.045]} scale={[1, es, 0.5]} material={mats.black}>
                <sphereGeometry args={[0.055, 16, 12]} />
              </mesh>
              <mesh position={[0.02, 0.025 * es, 0.075]} material={mats.white}>
                <sphereGeometry args={[0.014, 8, 8]} />
              </mesh>
              <mesh position={[0, 0.13, 0.02]} rotation={[0, 0, s * browA[expr]]} material={mats.hair}>
                <boxGeometry args={[0.13, 0.025, 0.03]} />
              </mesh>
            </group>
          ))}
          {/* mouth */}
          {expr === 'shock' || expr === 'scared' || expr === 'tired' ? (
            <mesh position={[0, -0.17, 0.38]} scale={[1, expr === 'tired' ? 0.6 : 1.2, 0.4]} material={M('#4a1515', 0.6)}>
              <sphereGeometry args={[0.06, 16, 12]} />
            </mesh>
          ) : (
            <group position={[0, -0.15, 0.39]}>
              {expr === 'happy' ? (
                <mesh rotation={[0, 0, Math.PI]} material={mats.black}><torusGeometry args={[0.08, 0.016, 8, 24, Math.PI]} /></mesh>
              ) : expr === 'pain' ? (
                <mesh position={[0, -0.04, 0]} material={mats.black}><torusGeometry args={[0.07, 0.016, 8, 24, Math.PI]} /></mesh>
              ) : (
                <mesh rotation={[0, 0, expr === 'determined' ? 0.08 : 0]} material={mats.black}><boxGeometry args={[0.13, 0.022, 0.02]} /></mesh>
              )}
            </group>
          )}
          {sweat
            ? [0, 1].map((k) => {
                const ph = (t * 0.9 + k * 0.5) % 1;
                return (
                  <mesh key={k} position={[0.33 + k * 0.06, 0.2 - ph * 0.5, 0.18]} scale={[0.6, 1, 0.6]}>
                    <sphereGeometry args={[0.04, 10, 10]} />
                    <meshStandardMaterial color="#8fd3ff" transparent opacity={1 - ph} roughness={0.1} />
                  </mesh>
                );
              })
            : null}
        </group>
      </group>
    </group>
  );
};

/** in-world sign with canvas text (like the reference's plaques) */
export const Sign: React.FC<{lines: string[]; w?: number; h?: number; bg?: string; fg?: string; sub?: string; position?: [number, number, number]; rot?: [number, number, number]; scale?: number}> = ({lines, w = 1.6, h = 0.7, bg = '#f4ead5', fg = '#b02a1e', sub, position = [0, 0, 0], rot = [0, 0, 0], scale = 1}) => {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = Math.round((1024 * h) / w);
    const g = cv.getContext('2d')!;
    g.fillStyle = bg;
    g.fillRect(0, 0, cv.width, cv.height);
    g.strokeStyle = fg;
    g.lineWidth = 14;
    g.strokeRect(22, 22, cv.width - 44, cv.height - 44);
    g.fillStyle = fg;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const n = lines.length;
    let fs = Math.min(170, (cv.height * (sub ? 0.62 : 0.8)) / n);
    g.font = `800 ${fs}px Rubik, sans-serif`;
    // auto-fit: shrink until the widest line fits inside the frame
    const maxW = cv.width * 0.86;
    const widest = Math.max(...lines.map((ln) => g.measureText(ln).width));
    if (widest > maxW) {
      fs *= maxW / widest;
      g.font = `800 ${fs}px Rubik, sans-serif`;
    }
    lines.forEach((ln, i) => g.fillText(ln, cv.width / 2, cv.height * (sub ? 0.42 : 0.5) + (i - (n - 1) / 2) * fs * 1.05));
    if (sub) {
      g.font = `700 ${Math.min(fs * 0.33, (cv.height * 0.12))}px Rubik, sans-serif`;
      g.fillText(sub, cv.width / 2, cv.height * 0.8);
    }
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [lines.join('|'), w, h, bg, fg, sub]);
  return (
    <group position={position} rotation={rot} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[w + 0.08, h + 0.08, 0.05]} />
        <meshStandardMaterial color="#5a3a22" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={tex} roughness={0.85} />
      </mesh>
    </group>
  );
};
