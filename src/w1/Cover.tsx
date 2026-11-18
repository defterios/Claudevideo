import React from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Character, Sign} from '../v7/char';
import {COACH, Faller, Gym, YOU} from './scenes';

if (typeof document !== 'undefined') {
  const h = delayRender('w1 cover fonts');
  Promise.all([
    new FontFace('Anton', `url(${staticFile('fonts/Anton-400.woff2')}) format('woff2')`, {weight: '400'}).load(),
    new FontFace('Rubik', `url(${staticFile('fonts/Rubik-Variable.woff2')}) format('woff2')`, {weight: '300 900'}).load(),
  ])
    .then((l) => { l.forEach((f) => document.fonts.add(f)); continueRender(h); })
    .catch(() => continueRender(h));
}

const RED = '#E8372C';
const T: React.FC<{text: string; size: number; color?: string; rot?: number}> = ({text, size, color = '#fff', rot = 0}) => (
  <div style={{fontFamily: 'Anton, Impact, sans-serif', fontSize: size, lineHeight: 0.98, color, WebkitTextStroke: `${size * 0.11}px #111`, paintOrder: 'stroke fill', textShadow: '0 10px 0 rgba(0,0,0,0.4)', transform: `rotate(${rot}deg)`, whiteSpace: 'nowrap', letterSpacing: 1}}>{text}</div>
);

/** trainee mid-bump slamming the mat, coach yelling AGAIN! */
const Moment: React.FC<{w: number; h: number}> = ({w, h}) => (
  <ThreeCanvas width={w} height={h} shadows camera={{fov: 34, position: [1.0, 2.5, 8.4]}} gl={{antialias: true, preserveDrawingBuffer: true}} onCreated={({camera}) => camera.lookAt(0.2, 2.75, 0)}>
    <Gym t={1.2} />
    <pointLight position={[0, 3, 3]} intensity={10} distance={9} color="#ffd9b0" />
    <Faller look={YOU} f={0.62} t={0.4} p={[-0.05, 1, 0.7]} rotY={0.55} expr="pain" />
    {[[-0.45, 1.25], [-0.75, 1.1], [-0.15, 1.08]].map(([x, y], i) => <mesh key={i} position={[x, y, 0.2 + i * 0.3]} rotation={[0, 0, i]}><boxGeometry args={[0.04, 0.32, 0.04]} /><meshBasicMaterial color="#fff3b0" /></mesh>)}
    <Character look={COACH} expr="yell" limbs={{armL: -0.3, armR: -2.4, elbowR: -0.3, lean: 0.08}} t={0.45} position={[1.35, 1, -0.4]} rotY={-0.6} />
    <Sign lines={['AGAIN!']} position={[0.1, 2.75, -0.7]} w={1.2} h={0.48} rot={[0, -0.2, 0.1]} bg="#fff4e0" />
  </ThreeCanvas>
);

/** TikTok cover 9:16 — key content inside the 3:4 profile-grid crop (y 240..1680) */
export const WweCoverTT: React.FC = () => (
  <AbsoluteFill style={{background: '#2a2e38'}}>
    <Moment w={1080} h={1920} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,10,16,0.95) 0%, rgba(10,10,16,0.88) 34%, rgba(10,10,16,0) 47%, rgba(10,10,16,0) 78%, rgba(10,10,16,0.65) 100%)'}} />
    <div style={{position: 'absolute', top: 270, width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
      <T text="WOULD YOU SURVIVE" size={108} rot={-2} />
      <T text="WWE" size={200} color={RED} rot={-2} />
      <T text="TRAINING?" size={176} color={RED} rot={-2} />
    </div>
    <div style={{position: 'absolute', top: 1520, width: 1080, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: 'Rubik', fontWeight: 900, fontSize: 56, color: '#111', background: '#FFD23F', border: '7px solid #111', borderRadius: 18, padding: '6px 28px', transform: 'rotate(-3deg)', boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>THE RING IS NOT A TRAMPOLINE 💥</div>
    </div>
  </AbsoluteFill>
);
