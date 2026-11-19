import React from 'react';
import {AbsoluteFill} from 'remotion';
import {JESUS} from '../v8/fig';
import {C3, Cam, Glow} from '../v8/scenes';
import {Hand} from './anime';
import {Bean, RDEFS} from './room';
import {Hall, MAN, PH} from './scenes_room';
import '../v8/Episode'; // fonts

/** Episode 4 cover: the healed hand raised in the light, Jesus beside him, the Pharisees in the shadows. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'EPISODE 4', title: ['LORD OF', 'THE SABBATH'], tag: 'STRETCH OUT YOUR HAND.'},
  bdy: {ep: 'EPISOD 4', title: ['RAJA', 'SABBATH'], tag: 'NONGON TONGAN MU.'},
};
export const Ep4Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 0, y: -120, z: 1.1};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          {RDEFS}
          <Hall t={1} frozen />
          {[-470, 470].map((x, i) => <Bean key={i} x={x} y={640} s={0.85} look={PH(i)} t={1 + i} face={{eyes: 'half', mouth: 'frown', brow: -1, look: [x > 0 ? -1 : 1, 0]}} dim={0.45} />)}
          <Bean x={-190} y={640} s={0.95} look={JESUS} t={0.3} face={{eyes: 'open', mouth: 'smile', brow: 0.3, look: [1, -0.4]}} arms="offer" />
          <Bean x={190} y={640} s={0.95} look={MAN} t={0.3} face={{eyes: 'open', mouth: 'open', brow: -0.3, look: [0, -1]}} />
          <Glow x={300} y={-120} r={520} o={0.9} id="gWhite" />
          <line x1={250} y1={360} x2={300} y2={60} stroke="#2a1420" strokeWidth={9} strokeLinecap="round" /><g transform="translate(300 60) scale(0.95) rotate(10)"><Hand withered={0} spread={1.35} sleeve={MAN.tunic} /></g>
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(10,4,16,0.7) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 190}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1c0d16'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 200, lineHeight: 0.98, color: '#FBEFD9', textAlign: 'center', letterSpacing: 4, textShadow: '0 12px 0 #1c0d16, 0 0 90px rgba(255,190,120,0.7)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 48, color: '#1c0d16', background: '#FFDD33', padding: '10px 32px', borderRadius: 50, border: '6px solid #1c0d16', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
