import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Bust, Fig, JESUS, P, SHADOW} from './fig';
import {C3, Cam, Defs, Dust, FOOT, Fill, Glow, Ground, Mesa, Rock, Stone, Sun} from './scenes';
import './Episode'; // loads the fonts

/** Episode 1 cover / thumbnail: starving Jesus vs. the shadow holding the stone-bread. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'EPISODE 1', title: ['THE', 'WILDERNESS'], tag: '40 DAYS. NO FOOD.'},
  bdy: {ep: 'EPISOD 1', title: ['PADANG', 'PASIR'], tag: '40 ONU. DOI PINGUMAN.'},
};
export const Ep1Cover: React.FC<{lang: Lang; W: number; H: number}> = ({lang, W, H}) => {
  const wide = W > H;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide, W, H};
  const c: C3 = wide ? {x: 330, y: -60, z: 1.05} : {x: 0, y: -170, z: 1.0};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Defs />
        <Cam c={c} p={p}>
          <Fill fill="url(#skyEmber)" /><Fill fill="#1a0d1c" o={0.35} />
          <Sun x={60} y={160} r={110} fill="#FFD9A0" />
          <Mesa x={760} y={FOOT} w={640} h={420} fill="#8A4B3A" shade="#5E2F28" />
          <Mesa x={-900} y={FOOT} w={520} h={300} fill="#8A4B3A" shade="#5E2F28" />
          <Ground fill="#B8734A" />
          {[-620, 560, 860].map((x, i) => <Rock key={i} x={x} y={FOOT + 60 + i * 50} s={0.9} fill="#9C7A66" />)}
          <Dust t={0.3} o={0.5} />
          <Fig x={wide ? 130 : 330} y={FOOT + 40} flip pose={P.offer} look={SHADOW} t={0.3} scale={1.15} face={{eyes: 'wide'}} hold={<g transform="translate(0 20) scale(1.5)"><Stone bread={1} t={0.3} /></g>} />
          <Glow x={wide ? -110 : 70} y={-60} r={420} o={0.35} />
          <Bust x={wide ? -330 : -170} y={wide ? 60 : 200} look={{...JESUS, gaunt: 1}} t={0.3} scale={wide ? 1.35 : 1.7} tilt={-4} face={{eyes: 'open', mouth: 'grit', brow: 0.7, look: [1, 0.3]}} />
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 48%, rgba(0,0,0,0) 50%, rgba(20,6,14,0.65) 100%)'}} />
      <AbsoluteFill style={wide
        ? {alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'column', paddingRight: 56}
        : {alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 230}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: wide ? 50 : 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1c0d16'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: wide ? 150 : 210, lineHeight: 0.98, color: '#FBEFD9', textAlign: wide ? 'right' : 'center', letterSpacing: 4, textShadow: '0 12px 0 #1c0d16, 0 0 90px rgba(255,170,80,0.7)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 26, fontFamily: 'Fredoka', fontWeight: 700, fontSize: wide ? 38 : 52, color: '#1c0d16', background: '#FFDD33', padding: '10px 34px', borderRadius: 50, border: '6px solid #1c0d16', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
