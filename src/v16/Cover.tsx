import React from 'react';
import {AbsoluteFill} from 'remotion';
import {JOHN} from '../v8/fig';
import {C3, Cam, Defs} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {Cell} from './scenes';
import '../v8/Episode'; // fonts

/** Episode 9 cover: John in his prison cell beside a single candle. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'EPISODE 9', title: ['A PROPHET', 'WITHOUT HONOR'], tag: 'THE VOICE WENT SILENT.'},
  bdy: {ep: 'EPISOD 9', title: ['NABI DE DOI', 'NYA SUKA'], tag: 'MEH NGOROK EH TIA.'},
};
export const Ep9Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 100, y: 120, z: 1.45};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          <Defs />{RDEFS}
          <Cell t={0.3} candle={1} />
          <Bean x={-60} y={600} s={1.0} sit look={JOHN} t={0.3} face={{eyes: 'open', mouth: 'flat', brow: 0.3, look: [1, -0.3]}} />
          {[-440, -260, 150, 460, 640].map((x) => <rect key={x} x={x} y={-1200} width={26} height={2000} fill="#0e0c12" />)}
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 55%, rgba(0,0,0,0) 45%, rgba(4,2,8,0.75) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 170}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #0c0a1a'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 150, lineHeight: 1.0, color: '#FBEFD9', textAlign: 'center', letterSpacing: 3, textShadow: '0 10px 0 #0c0a1a, 0 0 80px rgba(255,200,120,0.55)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 46, color: '#1c0d16', background: '#FFDD33', padding: '10px 32px', borderRadius: 50, border: '6px solid #0c0a1a', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
