import React from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {Character, Sign} from './char';

if (typeof document !== 'undefined') {
  const h = delayRender('rubik');
  new FontFace('Rubik', `url(${staticFile('fonts/Rubik-Variable.woff2')}) format('woff2')`, {weight: '300 900'}).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}

export const Test3D: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <AbsoluteFill style={{background: '#1b1320'}}>
      <ThreeCanvas width={1080} height={1920} camera={{fov: 32, position: [0, 1.6, 6.2]}} shadows gl={{antialias: true}} onCreated={({camera}) => camera.lookAt(0, 1.2, 0)}>
        <color attach="background" args={['#2a1c24']} />
        <fog attach="fog" args={['#2a1c24', 6, 16]} />
        <ambientLight intensity={0.35} color="#ffd9b0" />
        <directionalLight position={[3, 5, 4]} intensity={2.2} color="#ffcf9a" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-2, 2, 2]} intensity={6} distance={8} color="#ff9a4a" />
        <directionalLight position={[-3, 3, -4]} intensity={1.2} color="#7fa7ff" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#6b4a33" roughness={0.9} />
        </mesh>
        <Character look={{skin: '#8d5a3b', shirt: '#2e2e2e', shorts: '#c0392b', headband: '#c0392b'}} expr="happy" limbs={{armL: -0.3, armR: -1.2, elbowR: -1.2, legL: 0.1, legR: -0.1}} t={t} gloves="#c0392b" position={[-0.7, 0, 0]} rotY={0.3} />
        <Character look={{skin: '#a86f48', shirt: '#f4f1e8', shorts: '#1d3557', cap: '#1d3557', beard: true}} expr="determined" limbs={{armL: -1.4, armR: -1.4, elbowL: -0.6, elbowR: -0.6}} t={t} pads position={[0.8, 0, -0.2]} rotY={-0.5} />
        <Sign lines={['AGAIN!']} sub="KRU'S FAVOURITE WORD" position={[0, 2.85, -0.6]} w={1.8} h={0.75} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
