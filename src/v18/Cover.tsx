import React from 'react';
import {AbsoluteFill} from 'remotion';
import {JESUS} from '../v8/fig';
import {C3, Cam, Defs, Glow} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {Sky} from '../v12/scenes';
import {DEAF} from './scenes';
import '../v8/Episode'; // fonts

/** Episode 11 cover: the deaf man hears for the first time — light bursting around him. */
type Lang = 'en' | 'bdy';
const T: Record<Lang, {ep: string; title: string[]; tag: string}> = {
  en: {ep: 'EPISODE 11', title: ['BE', 'OPENED'], tag: 'EPHPHATHA!'},
  bdy: {ep: 'EPISOD 11', title: ['TIBUKA', 'NIH'], tag: 'EFFATA!'},
};
export const Ep11Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 40, y: 120, z: 1.25};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          <Defs />{RDEFS}<Sky />
          <rect x={-3000} y={330} width={6000} height={3000} fill="#B8946A" />
          <Glow x={-120} y={420} r={700} o={0.85} id="gWhite" />
          {[260, 430, 620].map((r, i) => <circle key={i} cx={-120} cy={420} r={r} fill="none" stroke="#FFF6D8" strokeWidth={18 - i * 5} opacity={0.75 - i * 0.2} />)}
          <Bean x={-120} y={720} s={1.15} look={DEAF} t={0.3} arms="up" face={{eyes: 'wide', mouth: 'open', brow: -0.3, look: [0.6, -0.4]}} />
          <Bean x={250} y={720} s={1.05} flip look={JESUS} t={0.3} arms="offer" face={{eyes: 'open', mouth: 'smile', brow: 0.3, look: [-1, 0]}} />
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(30,14,6,0.65) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 170}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1a0c06'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 200, lineHeight: 0.98, color: '#FFF8EC', textAlign: 'center', letterSpacing: 4, textShadow: '0 12px 0 #1a0c06, 0 0 90px rgba(255,220,150,0.7)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 48, color: '#1c0d16', background: '#FFDD33', padding: '10px 36px', borderRadius: 50, border: '6px solid #1a0c06', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
