import React from 'react';
import {AbsoluteFill} from 'remotion';
import {JESUS} from '../v8/fig';
import {C3, Cam, Defs, Glow} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {AP, Sky} from '../v12/scenes';
import '../v8/Episode'; // fonts

/** Episode 12 cover: on the road, Peter declares "You are the Messiah" — light breaking around Jesus. */
type Lang = 'en' | 'bdy';
const T: Record<Lang, {ep: string; title: string[]; tag: string}> = {
  en: {ep: 'EPISODE 12', title: ['WHO DO YOU', 'SAY I AM?'], tag: 'YOU ARE THE MESSIAH!'},
  bdy: {ep: 'EPISOD 12', title: ['OSI OKU IN', 'INGAN NANG?'], tag: 'INGAN PINUBUOS!'},
};
export const Ep12Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 0, y: 140, z: 1.25};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          <Defs />{RDEFS}<Sky dusk={0.1} />
          <rect x={-3000} y={330} width={6000} height={3000} fill="#C2A47A" />
          {Array.from({length: 7}).map((_, i) => <polygon key={i} points={`${170 + i * 10},-1700 ${200 + i * 10},-1700 ${170 + (i - 3) * 300 + 140},1300 ${170 + (i - 3) * 300 - 140},1300`} fill="#FFF6D0" opacity={0.1} />)}
          <Glow x={200} y={420} r={650} o={0.85} id="gWhite" />
          <Bean x={220} y={740} s={1.15} flip look={JESUS} t={0.3} face={{eyes: 'open', mouth: 'smile', brow: 0.3, look: [-1, 0]}} />
          <Bean x={-210} y={740} s={1.05} look={AP.simon} t={0.3} arms="point" face={{eyes: 'wide', mouth: 'open', brow: 0.5, look: [1, -0.2]}} />
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(30,14,6,0.65) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 170}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1a0c06'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 170, lineHeight: 0.98, color: '#FFF8EC', textAlign: 'center', letterSpacing: 3, textShadow: '0 12px 0 #1a0c06, 0 0 90px rgba(255,220,150,0.7)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 46, color: '#1c0d16', background: '#FFDD33', padding: '10px 34px', borderRadius: 50, border: '6px solid #1a0c06', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
