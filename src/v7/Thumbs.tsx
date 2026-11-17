import React from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Character, Sign} from './char';
import {Camp} from './sets';
import {KRU, YOU} from './scenes3d';

if (typeof document !== 'undefined') {
  const h = delayRender('thumb fonts');
  Promise.all([
    new FontFace('Anton', `url(${staticFile('fonts/Anton-400.woff2')}) format('woff2')`, {weight: '400'}).load(),
    new FontFace('Rubik', `url(${staticFile('fonts/Rubik-Variable.woff2')}) format('woff2')`, {weight: '300 900'}).load(),
  ])
    .then((l) => {
      l.forEach((f) => document.fonts.add(f));
      continueRender(h);
    })
    .catch(() => continueRender(h));
}

const ORANGE = '#F28C28';
const T: React.FC<{text: string; size: number; color?: string; stroke?: number; rot?: number}> = ({text, size, color = '#fff', stroke, rot = 0}) => (
  <div style={{fontFamily: 'Anton, Impact, sans-serif', fontSize: size, lineHeight: 0.98, color, WebkitTextStroke: `${stroke ?? size * 0.11}px #111`, paintOrder: 'stroke fill', textShadow: '0 10px 0 rgba(0,0,0,0.35)', transform: `rotate(${rot}deg)`, whiteSpace: 'nowrap', letterSpacing: 1}}>{text}</div>
);

/** shared 3D moment: exhausted fighter, Kru yelling AGAIN! with pads */
const Moment: React.FC<{w: number; h: number; cam: [number, number, number]; look: [number, number, number]; fov: number}> = ({w, h, cam, look, fov}) => (
  <ThreeCanvas width={w} height={h} shadows camera={{fov, position: cam}} gl={{antialias: true, preserveDrawingBuffer: true}} onCreated={({camera}) => camera.lookAt(...look)}>
    <Camp t={1.2} />
    <ambientLight intensity={0.5} color="#ffd9b0" />
    <directionalLight position={[3, 6, 5]} intensity={2.6} color="#ffd29a" castShadow shadow-mapSize={[2048, 2048]} />
    <pointLight position={[0, 2.6, 2.5]} intensity={10} distance={8} color="#ffc66b" />
    <directionalLight position={[-4, 3, -4]} intensity={1.4} color="#8fb0ff" />
    <Character look={YOU} expr="shock" limbs={{armL: -1.2, armR: -1.0, elbowL: -1.6, elbowR: -1.6, lean: -0.08, headTilt: -0.05, legL: 0.12, legR: -0.12}} t={0.45} gloves="#c0392b" sweat position={[-0.6, 0, 0.4]} rotY={0.35} />
    <Character look={KRU} expr="yell" limbs={{armL: -1.4, armR: -2.4, elbowL: -0.3, elbowR: -0.3, lean: 0.08, headTilt: 0.05}} t={0.45} pads position={[0.75, 0, -0.15]} rotY={-0.6} />
    <Sign lines={['AGAIN!']} position={[0.55, 2.55, 0.3]} w={1.3} h={0.5} rot={[0, -0.35, 0.08]} bg="#fff4e0" />
  </ThreeCanvas>
);

/** YouTube 16:9 (rendered 1920x1080, exported 1280x720) */
export const MuayThumbYT: React.FC = () => (
  <AbsoluteFill style={{background: '#f2b07a'}}>
    <div style={{position: 'absolute', left: 560, top: 0}}>
      <Moment w={1360} h={1080} cam={[0.3, 1.9, 5.2]} look={[0.15, 1.55, 0]} fov={36} />
    </div>
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(30,14,8,0.85) 0%, rgba(30,14,8,0.55) 38%, rgba(30,14,8,0) 58%)'}} />
    <div style={{position: 'absolute', left: 70, top: 120, display: 'flex', flexDirection: 'column', gap: 14}}>
      <T text="30 DAYS" size={210} />
      <T text="IN A" size={150} />
      <T text="MUAY THAI" size={210} color={ORANGE} />
      <T text="CAMP" size={210} color={ORANGE} />
    </div>
    <div style={{position: 'absolute', right: 70, bottom: 60, fontFamily: 'Rubik', fontWeight: 900, fontSize: 64, color: '#111', background: '#FFD23F', border: '7px solid #111', borderRadius: 18, padding: '6px 28px', transform: 'rotate(-4deg)', boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>WOULD YOU SURVIVE?</div>
  </AbsoluteFill>
);

/** TikTok / Reels cover 9:16 — key content inside the 3:4 profile-grid crop (y 240..1680) */
export const MuayCoverTT: React.FC = () => (
  <AbsoluteFill style={{background: '#f2b07a'}}>
    <div style={{position: 'absolute', top: 600}}><Moment w={1080} h={1320} cam={[0.15, 1.75, 7.4]} look={[0.12, 1.45, 0]} fov={32} /></div>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(30,14,8,0.8) 0%, rgba(30,14,8,0.35) 30%, rgba(30,14,8,0) 45%, rgba(30,14,8,0) 78%, rgba(30,14,8,0.6) 100%)'}} />
    <div style={{position: 'absolute', top: 270, width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
      <T text="WOULD YOU SURVIVE" size={108} rot={-2} />
      <T text="MUAY THAI" size={176} color={ORANGE} rot={-2} />
      <T text="CAMP?" size={176} color={ORANGE} rot={-2} />
    </div>
    <div style={{position: 'absolute', top: 1520, width: 1080, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: 'Rubik', fontWeight: 900, fontSize: 56, color: '#111', background: '#FFD23F', border: '7px solid #111', borderRadius: 18, padding: '6px 28px', transform: 'rotate(-3deg)', boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>30 DAYS IN THAILAND 🇹🇭</div>
    </div>
  </AbsoluteFill>
);
