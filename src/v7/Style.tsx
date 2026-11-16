import React from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Character, Sign} from './char';
import {Beach, Camp, Stadium, Ring} from './sets';

if (typeof document !== 'undefined') {
  const h = delayRender('rubik');
  new FontFace('Rubik', `url(${staticFile('fonts/Rubik-Variable.woff2')}) format('woff2')`, {weight: '300 900'}).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}
const YOU = {skin: '#8d5a3b', shirt: '#f4f1e8', shorts: '#c0392b', headband: '#c0392b'};
const KRU = {skin: '#a86f48', shirt: '#2e2e2e', shorts: '#1d3557', cap: '#1d3557', beard: true};

const Cap: React.FC<{words: [string, boolean][]}> = ({words}) => (
  <div style={{position: 'absolute', top: 1330, width: 1080, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: 'rgba(20,16,24,0.55)', borderRadius: 18, padding: '10px 26px', fontFamily: 'Rubik', fontWeight: 800, fontSize: 64, color: '#fff', display: 'flex', gap: 18, textShadow: '0 3px 10px rgba(0,0,0,0.5)'}}>
      {words.map(([w, k], i) => <span key={i} style={{color: k ? '#FFD23F' : '#fff'}}>{w}</span>)}
    </div>
  </div>
);

/** three style frames: frame 0 = arrival, 1 = pads, 2 = fight night */
export const MuayStyle: React.FC = () => {
  const f = useCurrentFrame();
  const t = 1.3;
  const cam = [
    {pos: [0.4, 1.7, 5.6], look: [0, 1.25, 0]},
    {pos: [1.6, 2.0, 5.4], look: [0.2, 1.3, 0]},
    {pos: [0, 3.3, 8.2], look: [0, 1.9, 0]},
  ][f];
  return (
    <AbsoluteFill>
      <ThreeCanvas width={1080} height={1920} shadows camera={{fov: 34, position: cam.pos as [number, number, number]}} gl={{antialias: true}} onCreated={({camera}) => camera.lookAt(...(cam.look as [number, number, number]))}>
        {f === 0 ? (
          <>
            <Beach t={t} />
            <ambientLight intensity={0.55} color="#ffe2c4" />
            <directionalLight position={[4, 6, 3]} intensity={2.6} color="#fff0d8" castShadow shadow-mapSize={[1024, 1024]} />
            <Character look={{...YOU, shirt: '#ffcf56'}} expr="happy" limbs={{armL: -0.2, armR: -2.6, elbowR: -0.5, armOutR: 0.4, headTilt: -0.1}} t={t} position={[0, 0, 0]} rotY={0.15} />
            <mesh position={[0.65, 0.35, 0.2]} castShadow><boxGeometry args={[0.5, 0.7, 0.3]} /><meshStandardMaterial color="#3a6ea5" roughness={0.6} /></mesh>
            <Sign lines={['THAILAND']} sub="ONE MONTH · MUAY THAI CAMP" position={[0, 2.85, -0.8]} w={2} h={0.8} />
          </>
        ) : f === 1 ? (
          <>
            <Camp t={t} />
            <ambientLight intensity={0.45} color="#ffd9b0" />
            <directionalLight position={[3, 6, 4]} intensity={2.4} color="#ffd29a" castShadow shadow-mapSize={[1024, 1024]} />
            <pointLight position={[0, 3.4, -2]} intensity={8} distance={9} color="#ffc66b" />
            <Character look={YOU} expr="tired" limbs={{armL: -1.2, armR: -0.6, elbowL: -1.4, elbowR: -1.3, legR: -0.9, lean: 0.05}} t={t} gloves="#c0392b" sweat position={[-0.7, 0, 0.2]} rotY={0.9} />
            <Character look={KRU} expr="determined" limbs={{armL: -1.5, armR: -1.3, elbowL: -0.4, elbowR: -0.5}} t={t} pads position={[0.9, 0, -0.2]} rotY={-0.9} />
            <Sign lines={['AGAIN!']} sub="KRU'S FAVOURITE WORD" position={[0.3, 2.95, -1.2]} w={1.8} h={0.75} />
          </>
        ) : (
          <>
            <Stadium t={t} />
            <ambientLight intensity={0.12} color="#8090ff" />
            <spotLight position={[0, 9, 3]} angle={0.42} penumbra={0.6} intensity={140} color="#ffe6c0" castShadow shadow-mapSize={[1024, 1024]} target-position={[0, 1, 0]} />
            <pointLight position={[-4, 3, 4]} intensity={10} distance={10} color="#ff5a3c" />
            <pointLight position={[4, 3, 4]} intensity={10} distance={10} color="#3c7bff" />
            <Character look={YOU} expr="scared" limbs={{armL: -1.3, armR: -1.1, elbowL: -1.5, elbowR: -1.5}} t={t} gloves="#c0392b" sweat position={[-0.9, 1, 0.3]} rotY={0.6} />
            <Character look={{skin: '#c48a5c', shirt: '#2e2e2e', shorts: '#1d6fd1', headband: '#1d6fd1'}} expr="determined" limbs={{armL: -1.3, armR: -1.1, elbowL: -1.5, elbowR: -1.5}} t={t} gloves="#1d6fd1" position={[1, 1, -0.4]} rotY={-0.7} />
            <Sign lines={['FIGHT NIGHT']} sub="3 ROUNDS · 3 MINUTES" position={[0, 3.9, -2.4]} w={2.6} h={0.9} />
            <pointLight position={[0, 4, -1]} intensity={6} distance={5} color="#ffe6c0" />
          </>
        )}
      </ThreeCanvas>
      <Cap words={f === 0 ? [['this', false], ['is', false], ['NOT', true], ['a', false], ['holiday.', false]] : f === 1 ? [['one', false], ['word:', false], ['AGAIN!', true]] : [['THREE', true], ['ROUNDS.', true]]} />
    </AbsoluteFill>
  );
};
