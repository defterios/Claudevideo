import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FRIENDS, Fig, INK, JESUS, P} from '../v8/fig';
import {C3, Cam, Defs, FOOT, Fill, GREY, Glow, rnd} from '../v8/scenes';
import {Mat, ROOF} from './scenes';
import '../v8/Episode'; // loads the fonts

/** Episode 3 cover: cut-away house, friends on the roof lowering the mat into the light, Jesus looking up. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'EPISODE 3', title: ['THROUGH', 'THE ROOF'], tag: 'THEY DUG A HOLE IN THE ROOF.'},
  bdy: {ep: 'EPISOD 3', title: ['SUO', 'BUNG BORI'], tag: 'JU MEH NGIROKANG BUNGAN EH.'},
};
export const Ep3Cover: React.FC<{lang: Lang}> = ({lang}) => {
  const W = 1080, H = 1920;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide: false, W, H};
  const c: C3 = {x: 0, y: -470, z: 0.9};
  const matY = ROOF + 330;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Defs />
        <Cam c={c} p={p}>
          <Fill fill="url(#skyDusk)" />
          {/* cut-away room */}
          <rect x={-760} y={ROOF + 20} width={1520} height={1400} fill="#6A4C38" stroke={INK} strokeWidth={9} />
          <polygon points={`-120,${ROOF + 20} 120,${ROOF + 20} 380,${FOOT + 420} -380,${FOOT + 420}`} fill="#FFF3D0" opacity={0.35} />
          <Glow x={0} y={matY} r={520} o={0.55} id="gWhite" />
          {[-560, -380, 380, 560].map((x, i) => <Fig key={i} x={x} y={FOOT + 260} scale={0.85} flip={x > 0} pose={P.stand} look={GREY(i)} t={0.3 + i} face={{eyes: 'wide', mouth: 'open', look: [x > 0 ? -0.3 : 0.3, -1]}} />)}
          <Fig x={-170} y={FOOT + 280} pose={P.stand} look={JESUS} t={0.3} face={{eyes: 'open', mouth: 'smile', brow: 0.3, look: [0.4, -1]}} />
          {/* ropes + mat coming down */}
          {[-170, 170].map((dx, i) => <line key={i} x1={dx * 0.5} y1={ROOF - 150} x2={dx * 1.35} y2={matY - 4} stroke="#C8A86A" strokeWidth={6} />)}
          <Mat x={60} y={matY} t={0.3} face="wide" />
          {/* roof slab with the hole */}
          <rect x={-800} y={ROOF - 20} width={680} height={46} fill="#B9936A" stroke={INK} strokeWidth={8} />
          <rect x={120} y={ROOF - 20} width={680} height={46} fill="#B9936A" stroke={INK} strokeWidth={8} />
          {Array.from({length: 14}).map((_, i) => { const dx = (rnd(i) - 0.5) * 220, dy = ROOF + 40 + rnd(i + 3) * 110; return <rect key={i} x={dx} y={dy} width={14 + rnd(i) * 16} height={12 + rnd(i + 2) * 12} fill="#A07A54" stroke={INK} strokeWidth={3} transform={`rotate(${rnd(i + 5) * 90} ${dx} ${dy})`} />; })}
          {/* the four friends lowering */}
          {[-430, -230, 230, 430].map((x, i) => <Fig key={i} x={x} y={ROOF - 20} flip={i > 1} scale={0.85} pose={{...P.stand, lean: i > 1 ? -12 : 12, aB: [40, 20], aF: [70, 10]}} look={FRIENDS[i]} t={0.3 + i} face={{eyes: 'open', mouth: 'grit', brow: -0.4, look: [i > 1 ? 1 : -1, 1]}} />)}
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 48%, rgba(0,0,0,0) 55%, rgba(20,6,14,0.6) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 200}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1c0d16'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 180, lineHeight: 0.98, color: '#FBEFD9', textAlign: 'center', letterSpacing: 4, textShadow: '0 12px 0 #1c0d16, 0 0 90px rgba(255,190,120,0.75)'}}>{X.title[0]}<br />{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 44, color: '#1c0d16', background: '#FFDD33', padding: '10px 30px', borderRadius: 50, border: '6px solid #1c0d16', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
