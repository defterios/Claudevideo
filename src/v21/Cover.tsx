import React from 'react';
import {AbsoluteFill} from 'remotion';
import {JESUS} from '../v8/fig';
import {C3, Cam, Defs, Glow} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {Sky} from '../v12/scenes';
import {Camel, Needle} from './scenes';
import '../v8/Episode'; // fonts

/** Episode 14 cover: a camel stuck at the eye of a giant needle; Jesus smiles. */
type Lang = 'en' | 'bdy';
const T: Record<Lang, {ep: string; title: string[]; tag: string}> = {
  en: {ep: 'EPISODE 14', title: ['WHAT DO', 'YOU WANT?'], tag: 'POSSIBLE WITH GOD'},
  bdy: {ep: 'EPISOD 14', title: ['ONI DE', 'RAN MU?'], tag: 'DAPED GEH DA TOPA'},
};
export const Ep14Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 0, y: 120, z: 0.95};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          <Defs />{RDEFS}<Sky />
          <rect x={-3000} y={330} width={6000} height={3000} fill="#C2A47A" />
          <Glow x={120} y={200} r={700} o={0.7} />
          <Needle x={140} y={560} s={0.75} />
          <Camel x={-170} y={640} s={1.5} t={0.3} squish={0.35} />
          <text x={-420} y={330} fontFamily="Fredoka" fontWeight={700} fontSize={130} fill="#FFDD33" stroke="#1c0d16" strokeWidth={14} paintOrder="stroke" textAnchor="middle" transform="rotate(-8 -420 330)">?!</text>
          <Bean x={390} y={860} s={1.0} flip look={JESUS} t={0.3} face={{eyes: 'open', mouth: 'smile', brow: 0.4, look: [-1, -0.3]}} />
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(30,14,6,0.6) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 150}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1a0c06'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 180, lineHeight: 0.98, color: '#FFF8EC', textAlign: 'center', letterSpacing: 3, textShadow: '0 12px 0 #1a0c06, 0 0 90px rgba(255,220,150,0.7)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 46, color: '#1c0d16', background: '#FFDD33', padding: '10px 34px', borderRadius: 50, border: '6px solid #1a0c06', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
