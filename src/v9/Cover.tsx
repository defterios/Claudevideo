import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ANDREW, Bust, Fig, JESUS, P, SIMON} from '../v8/fig';
import {BIG, C3, Cam, Defs, FOOT, Fill, Glow, Sun, rnd} from '../v8/scenes';
import '../v8/Episode'; // loads the fonts

/** Episode 2 cover / thumbnail: Jesus calls from the shore, the fishermen look up from the net. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'EPISODE 2', title: ['FOLLOW', 'ME'], tag: 'THEY DROPPED EVERYTHING.'},
  bdy: {ep: 'EPISOD 2', title: ['NUNA', 'OKU'], tag: 'TORUS NYA MUNU POSAN JARING EH.'},
};
export const Ep2Cover: React.FC<{lang: Lang; W: number; H: number}> = ({lang, W, H}) => {
  const wide = W > H;
  const X = T[lang];
  const p = {t: 0.3, dur: 1, w: () => 0, segs: [0], wide, W, H};
  const c: C3 = wide ? {x: 230, y: 40, z: 1.0} : {x: 0, y: -120, z: 0.95};
  const net = (x0: number, x1: number, y: number) => (
    <g>{Array.from({length: 7}).map((_, r) => <path key={r} d={`M ${x0} ${y + r * 14} Q ${(x0 + x1) / 2} ${y + 70 + r * 16} ${x1} ${y + r * 14}`} fill="none" stroke="#C8A86A" strokeWidth={4} />)}
      {Array.from({length: 10}).map((_, i) => { const x = x0 + ((x1 - x0) * i) / 9; return <line key={i} x1={x} y1={y} x2={x} y2={y + 90 + Math.sin((i / 9) * Math.PI) * 60} stroke="#C8A86A" strokeWidth={4} />; })}</g>
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <Defs />
        <Cam c={c} p={p}>
          <Fill fill="url(#skyDusk)" />
          <Sun x={wide ? 60 : 0} y={140} r={120} fill="#FFE2B0" />
          <path d="M -1800 160 Q -1100 40 -500 140 Q 100 30 700 130 Q 1300 50 1800 150 L 1800 200 L -1800 200 Z" fill="#6C5F86" />
          <rect x={-BIG} y={180} width={BIG * 2} height={BIG} fill="#3F86A6" />
          <line x1={-BIG} y1={180} x2={BIG} y2={180} stroke="#FFD9A8" strokeWidth={6} />
          {Array.from({length: 26}).map((_, i) => <path key={i} d={`M ${(rnd(i) - 0.5) * 2600} ${220 + (i % 9) * 80} q 40 -12 80 0 t 80 0`} fill="none" stroke="#A9DCE4" strokeWidth={5} opacity={0.6} />)}
          {/* shore + Jesus */}
          <path d={`M ${-BIG} ${FOOT + 40} L ${wide ? -200 : -260} ${FOOT + 40} Q ${wide ? -90 : -150} ${FOOT + 80} ${wide ? -40 : -100} ${BIG} L ${-BIG} ${BIG} Z`} fill="#E6C795" stroke="#2a1420" strokeWidth={8} />
          <Glow x={wide ? -380 : -470} y={-100} r={460} o={0.55} />
          <Fig x={wide ? -390 : -440} y={FOOT + 40} pose={P.offer} look={JESUS} t={0.3} scale={wide ? 1.05 : 1.0} face={{eyes: 'open', mouth: 'smile', brow: 0.2, look: [1, 0.3]}} />
          {/* fishermen look up */}
          <Bust x={wide ? 190 : 210} y={wide ? 330 : 430} look={SIMON} t={0.3} scale={wide ? 1.05 : 1.15} tilt={-6} face={{eyes: 'wide', mouth: 'open', brow: -0.6, look: [-1, -0.5]}} />
          <Bust x={wide ? 450 : 440} y={wide ? 390 : 560} look={ANDREW} t={1.3} scale={wide ? 0.9 : 0.95} tilt={4} face={{eyes: 'wide', mouth: 'open', look: [-1, -0.5]}} />
          <rect x={-BIG} y={wide ? 590 : 760} width={BIG * 2} height={BIG} fill="#3F86A6" opacity={0.92} />
          {net(wide ? 60 : 60, wide ? 620 : 620, wide ? 560 : 720)}
        </Cam>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 48%, rgba(0,0,0,0) 50%, rgba(20,6,14,0.6) 100%)'}} />
      <AbsoluteFill style={wide
        ? {alignItems: 'flex-end', justifyContent: 'flex-start', flexDirection: 'column', paddingRight: 60, paddingTop: 50}
        : {alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', paddingTop: 230}}>
        <div style={{fontFamily: 'Fredoka', fontWeight: 700, fontSize: wide ? 46 : 62, letterSpacing: 14, color: '#FFDD33', textShadow: '0 5px 0 #1c0d16'}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: wide ? 150 : 230, lineHeight: 0.98, color: '#FBEFD9', textAlign: wide ? 'right' : 'center', letterSpacing: 4, textShadow: '0 12px 0 #1c0d16, 0 0 90px rgba(255,190,120,0.75)'}}>{X.title[0]}{wide ? ' ' : <br />}{X.title[1]}</div>
        <div style={{marginTop: 22, fontFamily: 'Fredoka', fontWeight: 700, fontSize: wide ? 34 : (lang === 'bdy' ? 40 : 48), color: '#1c0d16', background: '#FFDD33', padding: '10px 30px', borderRadius: 50, border: '6px solid #1c0d16', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
