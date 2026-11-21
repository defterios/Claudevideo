import React from 'react';
import {AbsoluteFill} from 'remotion';
import {JESUS} from '../v8/fig';
import {C3, Cam, Defs, Fill, Glow, Stars} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {AP} from '../v12/scenes';
import {BigBoat, Moon, Waves} from '../v13/scenes';
import '../v8/Episode'; // fonts

/** Episode 10 cover: Jesus walking on the night sea toward the boat. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'EPISODE 10', title: ['WALKING', 'ON WATER'], tag: 'IT IS I. DON\'T BE AFRAID.'},
  bdy: {ep: 'EPISOD 10', title: ['PONU DE', 'TUN PIIN'], tag: 'OKU ITIH NEH. MA TORU.'},
};
export const Ep10Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 0, y: -60, z: 1.05};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          <Defs />{RDEFS}
          <Fill fill="url(#nightSt)" /><Stars t={0.3} n={90} /><Moon x={330} y={-560} />
          <rect x={-3000} y={260} width={6000} height={3000} fill="#1C2840" />
          <Glow x={-60} y={290} r={420} o={0.75} id="gWhite" />
          <ellipse cx={-60} cy={470} rx={150} ry={20} fill="#E8F0FF" opacity={0.6} />
          <Bean x={-60} y={470} s={0.95} look={JESUS} t={0.3} arms="offer" face={{eyes: 'open', mouth: 'smile', look: [1, 0.3]}} />
          <Waves t={1} y={560} amp={14} col="#1A2440" ph={1} />
          <g transform="translate(330 900) scale(1.1)"><BigBoat x={0} y={0} night sail={false}>{['simon', 'john'].map((n, i) => <Bean key={n} x={-200 + i * 190} y={-90} s={0.85} flip look={AP[n]} t={0.3 + i} arms="up" face={{eyes: 'wide', mouth: 'open', brow: -0.8, look: [-1, -0.6]}} />)}</BigBoat></g>
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(6,8,20,0.7) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 170}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #0c0a1a'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 190, lineHeight: 0.98, color: '#F2F0FF', textAlign: 'center', letterSpacing: 4, textShadow: '0 12px 0 #0c0a1a, 0 0 90px rgba(170,190,255,0.6)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 44, color: '#1c0d16', background: '#FFDD33', padding: '10px 32px', borderRadius: 50, border: '6px solid #0c0a1a', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
