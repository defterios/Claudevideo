import React from 'react';
import {AbsoluteFill} from 'remotion';
import {rnd} from '../v8/scenes';
import '../v8/Episode'; // fonts

/** Special 2 cover: a candle under a glowing cross, gold line art on black. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'SPECIAL 2', t1: 'WHY PRAY FOR', t2: 'THE DEAD?', tag: 'WHAT THE BIBLE SAYS'},
  bdy: {ep: 'SPECIAL 2', t1: 'ONI ROTI', t2: 'SMAYANG?', tag: 'SMAYANG SUO NYA DE KOBES'},
};
const GD = '#F4B942', WH = '#ECE7DC';
export const DeadCover: React.FC<{lang: Lang}> = ({lang}) => {
  const X = T[lang];
  return (
    <AbsoluteFill style={{background: '#0B0A0C'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
        <defs>
          <filter id="cg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <radialGradient id="cr"><stop offset="0" stopColor="#FFD873" stopOpacity="0.85" /><stop offset="0.4" stopColor="#F4B942" stopOpacity="0.3" /><stop offset="1" stopColor="#F4B942" stopOpacity="0" /></radialGradient>
        </defs>
        {Array.from({length: 90}).map((_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 99) * 1920} r={0.8 + rnd(i + 7) * 1.8} fill={WH} opacity={0.15 + 0.3 * rnd(i + 3)} />)}
        <circle cx={540} cy={1000} r={480} fill="url(#cr)" opacity={0.45} />
        <path d="M 540 1260 L 540 760 M 400 880 L 680 880" fill="none" stroke={GD} strokeWidth={8} strokeLinecap="round" filter="url(#cg)" />
        {Array.from({length: 9}).map((_, i) => <polygon key={i} points={`${530 + i * 2},620 ${550 + i * 2},620 ${540 + (i - 4) * 120 + 40},1500 ${540 + (i - 4) * 120 - 40},1500`} fill={GD} opacity={0.05} />)}
        <path d="M 160 1500 L 920 1500" stroke={WH} strokeWidth={3} opacity={0.7} />
        <circle cx={540} cy={1330} r={200} fill="url(#cr)" opacity={0.8} />
        <path d="M 500 1500 L 500 1380 L 580 1380 L 580 1500 Z M 540 1380 L 540 1360" fill="none" stroke={WH} strokeWidth={4} />
        <path d="M 540 1360 Q 518 1330 540 1280 Q 562 1330 540 1360 Z" fill={GD} stroke={GD} strokeWidth={3} filter="url(#cg)" />
        {[[300, 1500], [780, 1500]].map(([x, y], i) => <path key={i} d={`M ${x - 46} ${y - 100} Q ${x - 64} ${y - 50} ${x - 54} ${y} L ${x + 54} ${y} Q ${x + 64} ${y - 50} ${x + 46} ${y - 100} Q ${x} ${y - 112} ${x - 46} ${y - 100} Z M ${x - 30} ${y - 140} a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0`} fill="none" stroke={WH} strokeWidth={3} opacity={0.8} />)}
      </svg>
      <AbsoluteFill style={{alignItems: 'center', flexDirection: 'column', paddingTop: 170}}>
        <div style={{fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 46, letterSpacing: 16, color: GD}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 150, lineHeight: 1, color: '#FBEFD9', marginTop: 20, letterSpacing: 3, textAlign: 'center', textShadow: '0 10px 0 #000'}}>{X.t1}</div>
        <div style={{fontFamily: 'Anton', fontSize: 170, lineHeight: 1, color: GD, textAlign: 'center', textShadow: '0 0 60px rgba(244,185,66,0.75), 0 12px 0 #000'}}>{X.t2}</div>
        <div style={{marginTop: 18, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 38, color: '#1c0d16', background: '#FFDD33', padding: '10px 32px', borderRadius: 50, border: '5px solid #000', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
