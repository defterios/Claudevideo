import React from 'react';
import {AbsoluteFill} from 'remotion';
import {JESUS} from '../v8/fig';
import {C3, Cam, Glow} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {AP, TWELVE} from './scenes';
import '../v8/Episode'; // fonts

/** Episode 5 cover: the twelve on the mountain at sunset, Jesus in front, Judas half in shadow. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'EPISODE 5', title: ['THE', 'TWELVE'], tag: '12 ORDINARY MEN. 1 TRAITOR.'},
  bdy: {ep: 'EPISOD 5', title: ['12', 'RASOL'], tag: '12 URANG RASOL EH.'},
};
export const Ep5Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 0, y: 140, z: 1.0};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          {RDEFS}
          <rect x={-3000} y={-3000} width={6000} height={6000} fill="url(#goldHour)" />
          <rect x={-3000} y={-3000} width={6000} height={6000} fill="#2a1a3a" opacity={0.2} />
          <g filter="url(#dof)"><circle cx={0} cy={60} r={260} fill="#FFE6B0" /><Glow x={0} y={60} r={900} o={0.85} /></g>
          <path d="M -1600 900 Q -600 420 0 360 Q 600 420 1600 900 L 1600 3000 L -1600 3000 Z" fill="#6A5A3A" stroke="#2a1420" strokeWidth={8} />
          {TWELVE.slice(0, 6).map((n, i) => <Bean key={n} x={-500 + i * 200} y={540} s={0.72} look={AP[n]} t={0.3 + i} face={{eyes: 'open', mouth: 'smile', look: [0, 0]}} />)}
          {TWELVE.slice(6).map((n, i) => <Bean key={n} x={-470 + i * 190} y={720} s={0.86} look={AP[n]} t={0.3 + i + 6} face={{eyes: n === 'judas' ? 'half' : 'open', mouth: n === 'judas' ? 'flat' : 'smile', brow: n === 'judas' ? -0.6 : 0, look: n === 'judas' ? [-1, 0] : [0, 0]}} dim={n === 'judas' ? 0.55 : 0} />)}
          <Bean x={0} y={900} s={1.05} look={JESUS} t={0.3} face={{eyes: 'open', mouth: 'smile'}} arms="offer" />
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(10,4,16,0.65) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 170}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1c0d16'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 210, lineHeight: 0.98, color: '#FBEFD9', textAlign: 'center', letterSpacing: 4, textShadow: '0 12px 0 #1c0d16, 0 0 90px rgba(255,190,120,0.75)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 46, color: '#1c0d16', background: '#FFDD33', padding: '10px 32px', borderRadius: 50, border: '6px solid #1c0d16', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
