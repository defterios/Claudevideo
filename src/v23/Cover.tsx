import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C3, Cam, Defs, Glow} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {Hall} from '../v11/scenes_room';
import {Bag, Coin, RICHM, WIDOW} from './scenes';
import '../v8/Episode'; // fonts

/** Episode 16 cover: the widow's two tiny coins shine; the rich men stand in shadow. */
type Lang = 'en' | 'bdy';
const T: Record<Lang, {ep: string; title: string[]; tag: string}> = {
  en: {ep: 'EPISODE 16', title: ['EVERYTHING', 'SHE HAD'], tag: 'TWO SMALL COINS'},
  bdy: {ep: 'EPISOD 16', title: ['SUO DUIT', 'DE OGI'], tag: '2 KIPING SIRING TIBAGA'},
};
export const Ep16Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 0, y: 220, z: 1.2};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          <Defs />{RDEFS}<Hall t={0.3} dark={0.45} />
          {[-400, -240].map((x, i) => <g key={i} opacity={0.45}><Bean x={x} y={760} s={0.9} look={RICHM(i)} t={0.3 + i} arms="offer" hold={<Bag s={0.8} />} face={{eyes: 'half', mouth: 'smile', look: [1, 0]}} /></g>)}
          {Array.from({length: 8}).map((_, i) => <polygon key={i} points={`${170 - 20 + i * 5},-1700 ${170 + 20 + i * 5},-1700 ${170 + (i - 3.5) * 220 + 90},1300 ${170 + (i - 3.5) * 220 - 90},1300`} fill="#FFF6D0" opacity={0.1} />)}
          <Glow x={170} y={460} r={750} o={0.95} id="gWhite" />
          <Bean x={170} y={760} s={1.05} look={WIDOW} t={0.3} arms="offer" face={{eyes: 'closed', mouth: 'smile', brow: 0.4, look: [0, -0.3]}} />
          {[0, 1].map((i) => <g key={i}><Glow x={345 + i * 62} y={415} r={110} o={0.95} /><Coin x={345 + i * 62} y={415} r={28} copper /></g>)}
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(20,10,6,0.65) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 170}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1a0c06'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 175, lineHeight: 0.98, color: '#FFF8EC', textAlign: 'center', letterSpacing: 3, textShadow: '0 12px 0 #1a0c06, 0 0 90px rgba(255,220,150,0.7)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 44, color: '#1c0d16', background: '#FFDD33', padding: '10px 34px', borderRadius: 50, border: '6px solid #1a0c06', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
