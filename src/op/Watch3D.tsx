import React, {useLayoutEffect, useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {continueRender, delayRender, staticFile} from 'remotion';

/** screen textures are preloaded at module load (outside the R3F tree, so delayRender reliably blocks) */
const SCREENS = ['op/img/scr_below.png', 'op/img/scr_fatmax.png', 'op/img/scr_fat.png', 'op/img/scr_ai.png', 'op/img/scr_ub.png'];
const CACHE = new Map<string, THREE.Texture>();
if (typeof document !== 'undefined') {
  const h = delayRender('watch screens');
  Promise.all(
    SCREENS.map(
      (src) =>
        new Promise<void>((res) => {
          const img = new Image();
          img.onload = () => {
            const W = 700, H = Math.round((700 * 42) / 37.27);
            const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
            const g = cv.getContext('2d')!;
            g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
            g.save(); g.beginPath(); g.roundRect(0, 0, W, H, 110); g.clip();
            const s = Math.max(W / img.width, H / img.height) * 1.02;
            g.drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s);
            g.restore();
            const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
            CACHE.set(src, t); res();
          };
          img.onerror = () => res();
          img.src = staticFile(src);
        })
    )
  ).then(() => continueRender(h));
}
const useScreen = (src: string) => CACHE.get(src) ?? null;

const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => { env.dispose(); pm.dispose(); };
  }, [gl, scene]);
  return null;
};

export const STRAP = {purple: '#a39ce0', green: '#c4dfb6', black: '#3a3a3e'};

/** OPPO Watch 5-style square watch: 37.27 x 42 x 9.2 mm (units: 1 = 37.27 mm) */
export const Watch: React.FC<{screen: string; screen2?: string; mix?: number; rot: [number, number, number]; pos?: [number, number, number]; scale?: number; strap?: string; glow?: number; noStrap?: boolean}> = ({screen, screen2, mix = 0, rot, pos = [0, 0, 0], scale = 1, strap = STRAP.purple, glow = 0, noStrap = false}) => {
  const W = 1, H = 42 / 37.27, D = 9.2 / 37.27;
  const body = useMemo(() => new RoundedBoxGeometry(W, H, D, 8, 0.2), [H, D]);
  const t1 = useScreen(screen);
  const t2 = useScreen(screen2 ?? screen);
  const strapGeo = useMemo(() => new RoundedBoxGeometry(0.62, 0.8, 0.07, 4, 0.03), []);
  return (
    <group position={pos} rotation={rot} scale={scale}>
      <mesh geometry={body} castShadow>
        <meshPhysicalMaterial color="#aeb3bc" metalness={1} roughness={0.3} clearcoat={0.5} clearcoatRoughness={0.2} envMapIntensity={0.75} />
      </mesh>
      {/* glass + UI */}
      <mesh position={[0, 0, D / 2 + 0.002]}>
        <planeGeometry args={[W * 0.9, H * 0.9]} />
        {t1 ? <meshBasicMaterial key={t1.uuid} map={t1} transparent opacity={1 - mix} toneMapped={false} /> : <meshBasicMaterial color="#000" />}
      </mesh>
      {screen2 ? (
        <mesh position={[0, 0, D / 2 + 0.003]}>
          <planeGeometry args={[W * 0.9, H * 0.9]} />
          {t2 ? <meshBasicMaterial key={t2.uuid} map={t2} transparent opacity={mix} toneMapped={false} /> : <meshBasicMaterial color="#000" transparent opacity={0} />}
        </mesh>
      ) : null}
      {glow > 0 ? (
        <mesh position={[0, 0, D / 2 + 0.004]}>
          <planeGeometry args={[W * 0.9, H * 0.9]} />
          <meshBasicMaterial color="#ff9a3c" transparent opacity={glow * 0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ) : null}
      {/* crown + button */}
      <mesh position={[W / 2 + 0.03, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.09, 32]} />
        <meshPhysicalMaterial color="#e4e6ea" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[W / 2 + 0.012, -0.12, 0]}>
        <boxGeometry args={[0.03, 0.16, 0.08]} />
        <meshPhysicalMaterial color="#e4e6ea" metalness={1} roughness={0.25} />
      </mesh>
      {/* strap: curls back from both lugs */}
      {(noStrap ? [] : [1, -1]).map((s) => (
        <group key={s} position={[0, (s * H) / 2, -0.02]}>
          <mesh geometry={strapGeo} position={[0, s * 0.38, -0.08]} rotation={[s * -0.35, 0, 0]}>
            <meshStandardMaterial color={strap} roughness={0.55} />
          </mesh>
          <mesh geometry={strapGeo} position={[0, s * 0.72, -0.52]} rotation={[s * -1.25, 0, 0]}>
            <meshStandardMaterial color={strap} roughness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const Studio: React.FC = () => (
  <>
    <Env />
    <ambientLight intensity={0.4} />
    <directionalLight position={[2, 3, 4]} intensity={2.2} />
    <directionalLight position={[-3, 1, 2]} intensity={1.2} color="#ffd0a0" />
    <pointLight position={[0, -2, 2]} intensity={6} color="#ff8a3c" distance={8} />
  </>
);
