import React from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

if (typeof document !== 'undefined') {
  const h = delayRender('cover fonts');
  new FontFace('Inter Tight', `url(${staticFile('fonts/InterTight-Variable.woff2')}) format('woff2')`, {weight: '100 900'})
    .load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}
const ORANGE = '#FF8A1F';
const FONT = '"Inter Tight", sans-serif';
const T: React.FC<{children: React.ReactNode; size: number; color?: string}> = ({children, size, color = '#fff'}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: -size * 0.03, color, textShadow: '0 8px 30px rgba(0,0,0,0.6)'}}>{children}</div>
);

/** TikTok / IG Reels cover 1080x1920 — key content inside the 3:4 / 4:5 grid crops (y 285..1635) */
export const OppoCover: React.FC = () => (
  <AbsoluteFill style={{background: '#0a0604'}}>
    <Img src={staticFile('op/img/cover_bg.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(16px) brightness(0.45) saturate(1.2)', transform: 'scale(1.08)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 45% at 50% 52%, rgba(255,120,30,0.45) 0%, rgba(255,120,30,0) 70%)'}} />
    <Img src={staticFile('op/img/heart.png')} style={{position: 'absolute', left: 90, top: 520, width: 900, opacity: 0.55, filter: 'blur(30px)'}} />
    <Img src={staticFile('op/img/cover_cut.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'drop-shadow(0 0 40px rgba(255,140,40,0.35))'}} />
    {/* highlight ring on the watch */}
    <div style={{position: 'absolute', left: 380 - 125, top: 1520 - 115, width: 250, height: 230, borderRadius: '50%', border: `8px solid ${ORANGE}`, boxShadow: `0 0 40px ${ORANGE}, inset 0 0 30px rgba(255,138,31,0.5)`}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 28%, rgba(0,0,0,0) 36%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.55) 100%)'}} />
    <div style={{position: 'absolute', top: 270, left: 40, right: 40, textAlign: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: ORANGE, marginBottom: 14}}>OPPO WATCH 5</div>
      <T size={104}>THIS WATCH FIXED</T>
      <T size={118} color={ORANGE}>MY CARDIO 🔥</T>
    </div>
    <div style={{position: 'absolute', top: 1450, right: 70, padding: '18px 34px', borderRadius: 50, background: 'rgba(14,8,4,0.78)', border: `3px solid ${ORANGE}`, boxShadow: '0 0 40px rgba(255,138,31,0.45)', fontFamily: FONT, fontSize: 50, fontWeight: 850, color: '#fff', transform: 'rotate(-3deg)'}}>
      UltraBurn <span style={{color: ORANGE}}>Mode</span>
    </div>
  </AbsoluteFill>
);
