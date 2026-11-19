import React from 'react';
import {AbsoluteFill} from 'remotion';
import {JESUS} from '../v8/fig';
import {C3, Cam, Fill} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {AP} from '../v12/scenes';
import {BigBoat, CREW, Rain, Waves} from './scenes';
import '../v8/Episode'; // fonts

/** Episode 6 cover: half storm, half calm — Jesus standing in the boat with his hand out, the storm breaking around him. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'EPISODE 6', title: ['THE', 'STORM'], tag: 'QUIET. BE STILL.'},
  bdy: {ep: 'EPISOD 6', title: ['SOBAK', 'RIBUT'], tag: 'NGOREK NYA. TONO TIA.'},
};
export const Ep6Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 0, y: -260, z: 1.05};
  const t = 1.3;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          {RDEFS}
          <Fill fill="url(#nightSt)" />
          {[-800, -300, 300, 800].map((x, i) => <ellipse key={i} cx={x} cy={-760 + (i % 2) * 120} rx={520} ry={190} fill="#2A2E44" filter="url(#softL)" />)}
          <polygon points="0,-1400 -40,-1400 -200,260 200,260" fill="#DDE8FF" opacity={0.12} />
          <Waves t={t} y={260} amp={110} col="#24304A" ph={1} />
          <BigBoat x={0} y={300} tilt={-10} night sail={false}>
            <Bean x={140} y={-110} s={0.95} look={JESUS} t={t} face={{eyes: 'open', mouth: 'open', brow: 0.6, look: [-0.5, -0.3]}} arms="point" flip />
            {[-360, -180].map((x, i) => <Bean key={i} x={x} y={-80} s={0.8} look={AP[CREW[i]]} t={t + i} arms="up" face={{eyes: 'wide', mouth: 'open', brow: -0.8, look: [1, 0]}} />)}
          </BigBoat>
          <Waves t={t + 0.7} y={400} amp={140} col="#1C2840" ph={2.5} />
          <Rain t={t} />
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(6,8,20,0.7) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 190}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #0c0a1a'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 210, lineHeight: 0.98, color: '#F2F0FF', textAlign: 'center', letterSpacing: 4, textShadow: '0 12px 0 #0c0a1a, 0 0 90px rgba(170,190,255,0.6)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 48, color: '#1c0d16', background: '#FFDD33', padding: '10px 32px', borderRadius: 50, border: '6px solid #0c0a1a', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
