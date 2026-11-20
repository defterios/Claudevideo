import React from 'react';
import {AbsoluteFill} from 'remotion';
import {JESUS} from '../v8/fig';
import {C3, Cam, Fill, Stars} from '../v8/scenes';
import {Bean, RDEFS} from '../v11/room';
import {Moon} from '../v13/scenes';
import {WILDMAN} from './scenes';
import '../v8/Episode'; // fonts

/** Episode 7 cover: the wild man in chains among the tombs, a hundred glowing eyes behind him, Jesus in moonlight. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'EPISODE 7', title: 'LEGION', tag: '"FOR WE ARE MANY."'},
  bdy: {ep: 'EPISOD 7', title: 'LEGION', tag: '"NYA KOIH BOGE."'},
};
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const Ep7Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 0, y: 200, z: 1.15};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Cam c={c} p={p}>
          {RDEFS}
          <Fill fill="url(#nightSt)" /><Stars t={0.3} n={50} /><Moon x={330} y={-420} />
          <path d="M -900 560 L -840 -300 L 900 -380 L 900 560 Z" fill="#2A2634" />
          {Array.from({length: 70}).map((_, i) => { const x = (rnd(i) - 0.5) * 1500, y = -360 + rnd(i + 7) * 880; return Math.abs(x + 120) < 220 && y > 120 ? null : <g key={i}>{[-1, 1].map((d) => <ellipse key={d} cx={x + d * 16} cy={y} rx={8} ry={3.5} fill="#FFE27A" opacity={0.6 + 0.4 * rnd(i + 3)} />)}</g>; })}
          <rect x={-3000} y={560} width={6000} height={3000} fill="#2E2A3A" />
          <Bean x={-120} y={760} s={1.25} look={WILDMAN} t={0.3} arms="up" face={{eyes: 'wide', mouth: 'open', brow: -1, look: [1, 0]}} />
          <g>{[[-330, 740, -8], [-10, 750, 10], [-200, 770, 2]].map(([x, y, a], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>{Array.from({length: 4}).map((_, k) => <ellipse key={k} cx={k * 30} cy={0} rx={18} ry={10} fill="none" stroke="#9A9AA6" strokeWidth={7} transform={`rotate(${k % 2 ? 60 : 0} ${k * 30} 0)`} />)}</g>)}</g>
          <Bean x={330} y={760} s={1.05} look={JESUS} t={0.3} flip face={{eyes: 'open', mouth: 'flat', brow: 0.4, look: [-1, 0]}} arms="point" />
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(6,4,12,0.75) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 190}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #0c0a1a'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 240, lineHeight: 0.98, color: '#F2F0FF', textAlign: 'center', letterSpacing: 6, textShadow: '0 12px 0 #0c0a1a, 0 0 90px rgba(255,200,90,0.45)'}}>{X.title}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 50, color: '#1c0d16', background: '#FFDD33', padding: '10px 32px', borderRadius: 50, border: '6px solid #0c0a1a', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
