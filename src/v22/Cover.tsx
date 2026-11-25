import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FRIENDS, JESUS} from '../v8/fig';
import {C3, Cam, Defs, Glow, rnd} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {Sky} from '../v12/scenes';
import {Donkey, Palm} from './scenes';
import '../v8/Episode'; // fonts

/** Episode 15 cover: Jesus rides the donkey into Jerusalem; the crowd waves palm branches. */
type Lang = 'en' | 'bdy';
const T: Record<Lang, {ep: string; title: string; tag: string}> = {
  en: {ep: 'EPISODE 15', title: 'HOSANNA!', tag: 'BLESSED IS HE WHO COMES'},
  bdy: {ep: 'EPISOD 15', title: 'HOSANNA!', tag: 'OBUOH BROKAT YEH DE NEG'},
};
export const Ep15Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 0, y: 260, z: 1.1};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          <Defs />{RDEFS}<Sky />
          <g filter="url(#dof)"><path d="M -3000 260 L -900 260 L -900 60 L -700 60 L -700 -40 L -500 -40 L -500 60 L 300 60 L 300 -80 L 420 -140 L 540 -80 L 540 60 L 1100 60 L 1100 260 L 3000 260 L 3000 3000 L -3000 3000 Z" fill="#D8C8A8" opacity={0.85} /></g>
          <rect x={-3000} y={330} width={6000} height={3000} fill="#C2A47A" />
          <Glow x={0} y={360} r={700} o={0.7} />
          {Array.from({length: 20}).map((_, i) => <path key={i} d="M 0 0 q 12 -6 24 0 q -12 8 -24 0 Z" transform={`translate(${(rnd(i + 3) - 0.5) * 1100} ${-300 + rnd(i) * 900}) rotate(${i * 40}) scale(1.6)`} fill="#5E9A44" opacity={0.85} />)}
          {[-470, -300, 300, 470].map((x, i) => <Bean key={i} x={x} y={760 + (i % 2) * 40} s={0.9} flip={x > 0} look={{...FRIENDS[i % 4], tunic: ['#A8794A', '#6A7A5A', '#8A5A5A', '#5A6A8A'][i]}} t={0.3 + i} arms="up" hold={<Palm x={0} y={0} s={0.55} rot={(i % 2 ? 15 : -15)} />} face={{eyes: 'closed', mouth: 'open', look: [x > 0 ? -1 : 1, -0.4]}} />)}
          <Donkey x={-30} y={880} s={1.05} t={0.3} rider />
          <Bean x={-30} y={730} s={0.95} sit look={JESUS} t={0.3} arms="offer" face={{eyes: 'open', mouth: 'smile', brow: 0.3, look: [0, 0.2]}} />
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(30,14,6,0.6) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 190}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1a0c06'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 210, lineHeight: 1, color: '#FFF8EC', textAlign: 'center', letterSpacing: 3, textShadow: '0 12px 0 #1a0c06, 0 0 90px rgba(255,220,150,0.7)'}}>{X.title}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 42, color: '#1c0d16', background: '#FFDD33', padding: '10px 34px', borderRadius: 50, border: '6px solid #1a0c06', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
