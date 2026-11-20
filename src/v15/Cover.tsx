import React from 'react';
import {AbsoluteFill} from 'remotion';
import {INK, JESUS} from '../v8/fig';
import {C3, Cam, Glow} from '../v8/scenes';
import {Bean, OilLamp, RDEFS, Room, SunPatch} from '../v11/room';
import {GIRL, JAIRUS} from './scenes';
import '../v8/Episode'; // fonts

/** Episode 8 cover: Jesus holding the girl's hand as she sits up in the light. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'EPISODE 8', title: ['TALITHA', 'KOUM'], tag: 'LITTLE GIRL, GET UP.'},
  bdy: {ep: 'EPISOD 8', title: ['TALITHA', 'KOUM'], tag: 'ONAK DAYUNG, MOKAT.'},
};
export const Ep8Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 40, y: 80, z: 1.25};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          {RDEFS}
          <Room t={0.3} wall="#5A4A44" floor="#3E2E24" win={false} />
          <OilLamp x={-380} y={-60} t={0.3} r={500} />
          <SunPatch pts="80,-900 300,-900 600,800 160,800" o={0.45} />
          <Glow x={60} y={360} r={700} o={0.7} id="gWhite" />
          <Bean x={-260} y={520} s={0.7} look={JAIRUS} t={0.3} face={{eyes: 'wide', mouth: 'open', brow: -0.4, look: [1, 0]}} />
          <rect x={-300} y={560} width={600} height={56} rx={14} fill="#C9B48A" stroke={INK} strokeWidth={6} />
          <rect x={-280} y={616} width={30} height={90} fill="#6E4A30" stroke={INK} strokeWidth={5} /><rect x={250} y={616} width={30} height={90} fill="#6E4A30" stroke={INK} strokeWidth={5} />
          <Bean x={20} y={590} s={0.8} sit look={GIRL} t={0.3} arms="reach" face={{eyes: 'open', mouth: 'smile', look: [1, -0.4]}} />
          <Bean x={340} y={740} s={1.0} flip look={JESUS} t={0.3} arms="reach" face={{eyes: 'open', mouth: 'smile', brow: 0.2, look: [-1, 0.4]}} />
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(10,4,16,0.7) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 190}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1c0d16'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 200, lineHeight: 0.98, color: '#FBEFD9', textAlign: 'center', letterSpacing: 4, textShadow: '0 12px 0 #1c0d16, 0 0 90px rgba(255,210,150,0.7)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 48, color: '#1c0d16', background: '#FFDD33', padding: '10px 32px', borderRadius: 50, border: '6px solid #1c0d16', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
