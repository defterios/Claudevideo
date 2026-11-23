import React from 'react';
import {AbsoluteFill} from 'remotion';
import {rnd} from '../v8/scenes';
import '../v8/Episode'; // fonts

/** Cover for the special "The Number 3": gold line-art triangle with three glowing crosses, on black. */
type Lang = 'en' | 'bdy';
const T = {
  en: {ep: 'SPECIAL', title: 'WHY ALWAYS', tag: 'THE NUMBER 3 IN THE BIBLE'},
  bdy: {ep: 'SPECIAL', title: 'ONI SOKAN', tag: 'NUMUR 3 DANG BIBLE'},
};
const GD = '#F4B942', WH = '#ECE7DC';
export const ThreeCover: React.FC<{lang: Lang}> = ({lang}) => {
  const X = T[lang];
  const cross = (x: number, y: number, s: number) => `M ${x} ${y} L ${x} ${y - 330 * s} M ${x - 95 * s} ${y - 250 * s} L ${x + 95 * s} ${y - 250 * s}`;
  return (
    <AbsoluteFill style={{background: '#0B0A0C'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
        <defs>
          <filter id="cg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <radialGradient id="cr"><stop offset="0" stopColor="#FFD873" stopOpacity="0.85" /><stop offset="0.4" stopColor="#F4B942" stopOpacity="0.3" /><stop offset="1" stopColor="#F4B942" stopOpacity="0" /></radialGradient>
        </defs>
        {Array.from({length: 90}).map((_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 99) * 1920} r={0.8 + rnd(i + 7) * 1.8} fill={WH} opacity={0.15 + 0.3 * rnd(i + 3)} />)}
        <circle cx={540} cy={1240} r={520} fill="url(#cr)" opacity={0.55} />
        <path d="M 540 820 L 930 1500 L 150 1500 Z" fill="none" stroke={GD} strokeWidth={5} filter="url(#cg)" />
        {[[540, 820], [930, 1500], [150, 1500]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={26} fill="none" stroke={WH} strokeWidth={3} opacity={0.8} /><circle cx={x} cy={y} r={11} fill={GD} filter="url(#cg)" /></g>)}
        <path d="M 260 1440 Q 540 1340 820 1440" fill="none" stroke={WH} strokeWidth={4} opacity={0.8} />
        {[-170, 0, 170].map((dx, i) => <path key={i} d={cross(540 + dx, 1410 - (i === 1 ? 50 : 10), i === 1 ? 0.95 : 0.7)} fill="none" stroke={i === 1 ? GD : WH} strokeWidth={6} strokeLinecap="round" filter={i === 1 ? 'url(#cg)' : undefined} opacity={i === 1 ? 1 : 0.85} />)}
        {['1', '2', '3'].map((n, i) => <text key={i} x={370 + i * 170} y={1580} fontFamily="JetBrains Mono" fontWeight={700} fontSize={40} fill={GD} textAnchor="middle">{n}</text>)}
      </svg>
      <AbsoluteFill style={{alignItems: 'center', flexDirection: 'column', paddingTop: 170}}>
        <div style={{fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 46, letterSpacing: 16, color: GD}}>{X.ep}</div>
        <div style={{fontFamily: 'Anton', fontSize: 150, lineHeight: 1, color: '#FBEFD9', marginTop: 20, letterSpacing: 3, textShadow: '0 10px 0 #000'}}>{X.title}</div>
        <div style={{fontFamily: 'Anton', fontSize: 380, lineHeight: 0.95, color: GD, textShadow: '0 0 60px rgba(244,185,66,0.75), 0 12px 0 #000'}}>3?</div>
        <div style={{marginTop: 10, fontFamily: 'Fredoka', fontWeight: 700, fontSize: 40, color: '#1c0d16', background: '#FFDD33', padding: '10px 32px', borderRadius: 50, border: '5px solid #000', transform: 'rotate(-2deg)'}}>{X.tag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
