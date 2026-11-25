import React from 'react';
import {AbsoluteFill} from 'remotion';
import {JESUS} from '../v8/fig';
import {C3, Cam, Defs, Glow} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {AP, Sky} from '../v12/scenes';
import {ELIJAH, MOSES} from './scenes';
import '../v8/Episode'; // fonts

/** Episode 13 cover: the Transfiguration — Jesus dazzling white on the mountain, Moses and Elijah beside him. */
type Lang = 'en' | 'bdy';
const T: Record<Lang, {ep: string; title: string[]; tag: string}> = {
  en: {ep: 'EPISODE 13', title: ['LISTEN', 'TO HIM'], tag: 'THIS IS MY SON'},
  bdy: {ep: 'EPISOD 13', title: ['NGOJIT', 'NYA SINA YEH'], tag: 'ITIH ONAK KU'},
};
export const Ep13Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 0, y: 150, z: 1.2};
  const WHITE = {...JESUS, tunic: '#FFFFFF', sash: '#FFE9A8'};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          <Defs />{RDEFS}<Sky dusk={0.2} />
          <g filter="url(#dof)"><path d="M -3000 400 L -1500 -200 L -900 120 L -300 -500 L 300 60 L 900 -300 L 1600 180 L 3000 -100 L 3000 3000 L -3000 3000 Z" fill="#8A8098" opacity={0.7} /></g>
          <rect x={-3000} y={330} width={6000} height={3000} fill="#A89A88" />
          {Array.from({length: 9}).map((_, i) => <polygon key={i} points={`${-40 + i * 10},-1700 ${40 + i * 10},-1700 ${(i - 4) * 330 + 160},1300 ${(i - 4) * 330 - 160},1300`} fill="#FFFBEA" opacity={0.13} />)}
          <Glow x={0} y={420} r={900} o={0.95} id="gWhite" />
          <Bean x={-330} y={740} s={0.95} look={ELIJAH} t={0.3} face={{eyes: 'open', mouth: 'smile', look: [1, 0]}} />
          <Bean x={330} y={740} s={0.95} flip look={MOSES} t={0.6} face={{eyes: 'open', mouth: 'smile', look: [-1, 0]}} />
          <Bean x={0} y={740} s={1.15} look={WHITE} t={0.3} arms="up" face={{eyes: 'closed', mouth: 'smile', brow: 0.3, look: [0, -0.4]}} />
          {[-560, 560].map((x, i) => <Bean key={i} x={x} y={800} s={0.8} sit flip={x > 0} look={AP[i ? 'john' : 'simon']} t={0.3 + i} arms="up" face={{eyes: 'wide', mouth: 'open', brow: -0.5, look: [x > 0 ? -1 : 1, -0.3]}} />)}
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(30,14,40,0.6) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 170}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1a0c16'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 180, lineHeight: 0.98, color: '#FFFFFF', textAlign: 'center', letterSpacing: 3, textShadow: '0 12px 0 #1a0c16, 0 0 90px rgba(255,255,230,0.8)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 46, color: '#1c0d16', background: '#FFDD33', padding: '10px 34px', borderRadius: 50, border: '6px solid #1a0c16', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
