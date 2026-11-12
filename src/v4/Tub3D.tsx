import React, {useEffect, useMemo, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {continueRender, delayRender} from 'remotion';

export type Variant = 'concentrate' | 'isolate' | 'hydro';

const V: Record<Variant, {body: string; lid: string; lidTop: string; label: [string, string]; ink: string; accent: string; name: string; pct: string; tag: string; metal: number; rough: number}> = {
  concentrate: {body: '#F1E6CF', lid: '#D9A441', lidTop: '#C99332', label: ['#F7B733', '#E2852F'], ink: '#2A1A06', accent: '#FFFFFF', name: 'CONCENTRATE', pct: '70–80%', tag: 'THE STANDARD', metal: 0.05, rough: 0.35},
  isolate: {body: '#F5F8FC', lid: '#3A8DDE', lidTop: '#2F7BC6', label: ['#4FA8F5', '#1E5FB8'], ink: '#FFFFFF', accent: '#DDF0FF', name: 'ISOLATE', pct: '90%+', tag: 'EXTRA FILTERED', metal: 0.05, rough: 0.25},
  hydro: {body: '#17191D', lid: '#C8102E', lidTop: '#A50D25', label: ['#202329', '#0B0C0F'], ink: '#FFFFFF', accent: '#E9C46A', name: 'HYDROLYZED', pct: 'FASTEST', tag: 'PRE-DIGESTED', metal: 0.35, rough: 0.3},
};

/** Wrap-around label drawn on a canvas (2048x768 → cylinder band). */
const makeLabel = (v: Variant) => {
  const c = V[v];
  const cv = document.createElement('canvas');
  cv.width = 2048;
  cv.height = 768;
  const g = cv.getContext('2d')!;
  const grd = g.createLinearGradient(0, 0, 0, 768);
  grd.addColorStop(0, c.label[0]);
  grd.addColorStop(1, c.label[1]);
  g.fillStyle = grd;
  g.fillRect(0, 0, 2048, 768);
  // diagonal sheen stripes
  g.globalAlpha = 0.08;
  g.fillStyle = '#fff';
  for (let x = -800; x < 2048; x += 260) {
    g.beginPath();
    g.moveTo(x, 768);
    g.lineTo(x + 140, 768);
    g.lineTo(x + 540, 0);
    g.lineTo(x + 400, 0);
    g.fill();
  }
  g.globalAlpha = 1;
  // front panel is centred at u = 0.75 (faces +z after rotation offset below)
  const cx = 1024;
  g.textAlign = 'center';
  g.fillStyle = c.accent;
  g.font = '700 46px "Inter Tight"';
  g.fillText('PERFORMANCE NUTRITION', cx, 110);
  g.fillStyle = c.ink;
  g.font = '900 230px "Inter Tight"';
  g.fillText('WHEY', cx, 330);
  g.font = '900 96px "Inter Tight"';
  g.fillText(c.name, cx, 450);
  // badge
  g.fillStyle = v === 'hydro' ? c.accent : '#ffffff';
  const bw = 520;
  g.beginPath();
  g.roundRect(cx - bw / 2, 500, bw, 110, 55);
  g.fill();
  g.fillStyle = v === 'hydro' ? '#111' : c.label[1];
  g.font = '900 64px "Inter Tight"';
  g.fillText(c.pct + (v === 'hydro' ? '' : ' PROTEIN'), cx, 578);
  g.fillStyle = c.accent;
  g.font = '700 40px "Inter Tight"';
  g.fillText(`${c.tag}  ·  2 KG / 4.4 LB`, cx, 690);
  // side panels: nutrition-ish lines
  g.globalAlpha = 0.5;
  g.fillStyle = c.ink;
  for (const sx of [220, 1828]) {
    for (let i = 0; i < 8; i++) g.fillRect(sx - 140, 220 + i * 46, 280 - (i % 3) * 50, 14);
  }
  g.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
};

const Tub: React.FC<{variant: Variant; rotY: number; tex: THREE.Texture}> = ({variant, rotY, tex}) => {
  const c = V[variant];
  const bodyGeo = useMemo(() => {
    // profile: rounded base, straight wall, shoulder
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0, -1.1));
    for (let i = 0; i <= 8; i++) {
      const a = (i / 8) * (Math.PI / 2);
      pts.push(new THREE.Vector2(0.88 + Math.sin(a) * 0.12, -1.1 + (1 - Math.cos(a)) * 0.12));
    }
    pts.push(new THREE.Vector2(1.0, 0.9));
    pts.push(new THREE.Vector2(0.97, 0.98));
    pts.push(new THREE.Vector2(0.95, 1.0));
    return new THREE.LatheGeometry(pts, 96);
  }, []);
  return (
    <group rotation={[0.12, rotY, 0]}>
      <mesh geometry={bodyGeo}>
        <meshPhysicalMaterial color={c.body} roughness={c.rough} metalness={c.metal} clearcoat={0.8} clearcoatRoughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      {/* label band */}
      <mesh position={[0, -0.12, 0]} rotation={[0, Math.PI, 0]}>
        <cylinderGeometry args={[1.006, 1.006, 1.62, 128, 1, true]} />
        <meshPhysicalMaterial map={tex} roughness={0.35} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      {/* lid */}
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[1.04, 1.04, 0.38, 96]} />
        <meshPhysicalMaterial color={c.lid} roughness={0.3} clearcoat={0.6} />
      </mesh>
      {Array.from({length: 48}).map((_, i) => {
        const a = (i / 48) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.045, 1.18, Math.sin(a) * 1.045]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.025, 0.3, 0.035]} />
            <meshStandardMaterial color={c.lidTop} roughness={0.4} />
          </mesh>
        );
      })}
      <mesh position={[0, 1.375, 0]}>
        <cylinderGeometry args={[1.0, 1.04, 0.02, 96]} />
        <meshPhysicalMaterial color={c.lidTop} roughness={0.25} clearcoat={0.8} />
      </mesh>
    </group>
  );
};

/** One or more tubs rendered in a transparent ThreeCanvas. */
export const Tubs3D: React.FC<{
  width: number;
  height: number;
  items: {variant: Variant; x: number; y?: number; z?: number; rotY: number; scale?: number}[];
  camZ?: number;
}> = ({width, height, items, camZ = 6.2}) => {
  const [tex, setTex] = useState<Record<string, THREE.Texture> | null>(null);
  const [handle] = useState(() => delayRender('tub labels'));
  useEffect(() => {
    document.fonts.ready.then(() => {
      setTex({concentrate: makeLabel('concentrate'), isolate: makeLabel('isolate'), hydro: makeLabel('hydro')});
      continueRender(handle);
    });
  }, [handle]);
  if (!tex) return null;
  return (
    <ThreeCanvas width={width} height={height} camera={{fov: 30, position: [0, 0.5, camZ]}} gl={{antialias: true, alpha: true, preserveDrawingBuffer: true}} style={{background: 'transparent'}}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <directionalLight position={[-4, 2, -2]} intensity={1.4} color="#9fc4ff" />
      <pointLight position={[0, -2, 4]} intensity={6} distance={12} color="#ffffff" />
      <hemisphereLight args={['#ffffff', '#20262e', 0.6]} />
      {items.map((it, i) => (
        <group key={i} position={[it.x, it.y ?? 0, it.z ?? 0]} scale={it.scale ?? 1}>
          <Tub variant={it.variant} rotY={it.rotY} tex={tex[it.variant]} />
        </group>
      ))}
    </ThreeCanvas>
  );
};
