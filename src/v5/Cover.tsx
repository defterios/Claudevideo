import React from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

if (typeof document !== 'undefined') {
  const h = delayRender('cover fonts');
  Promise.all([
    new FontFace('Chakra Petch', `url(${staticFile('fonts/ChakraPetch-700.woff2')}) format('woff2')`, {weight: '700'}).load(),
    new FontFace('Chakra Petch', `url(${staticFile('fonts/ChakraPetch-600.woff2')}) format('woff2')`, {weight: '600'}).load(),
    new FontFace('JetBrains Mono', `url(${staticFile('fonts/JetBrainsMono.woff2')}) format('woff2')`, {weight: '400 700'}).load(),
  ])
    .then((l) => {
      l.forEach((f) => document.fonts.add(f));
      continueRender(h);
    })
    .catch(() => continueRender(h));
}

const D = '"Chakra Petch", sans-serif';
const M = '"JetBrains Mono", monospace';
const R = {cream: '#F4EFE7', rust: '#B4471F', ink: '#17120F'};

/** TikTok / IG cover (1080x1920). Key content kept inside the 3:4 grid crop (y 240..1680). */
export const PoCover: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 85% 60% at 50% 42%, #FBF8F3 0%, ${R.cream} 55%, #E6DED2 100%)`, overflow: 'hidden'}}>
    {/* faint grid */}
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(23,18,15,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(23,18,15,0.045) 2px, transparent 2px)', backgroundSize: '90px 90px'}} />
    {/* rising stair chart behind the speaker */}
    <div style={{position: 'absolute', left: 40, right: 40, top: 760, height: 760, display: 'flex', alignItems: 'flex-end', gap: 16, opacity: 0.9}}>
      {Array.from({length: 7}).map((_, i) => (
        <div key={i} style={{flex: 1, height: 220 + i * 85, borderRadius: '10px 10px 0 0', background: i === 6 ? R.rust : `rgba(180,71,31,${0.12 + i * 0.07})`}} />
      ))}
    </div>
    {/* title — sits BEHIND the speaker's head */}
    <div style={{position: 'absolute', top: 312, width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{fontFamily: M, fontWeight: 700, fontSize: 34, letterSpacing: 3, color: '#fff', background: R.ink, padding: '8px 20px', borderRadius: 6}}>1 YEAR · 0 RESULTS?</div>
      <div style={{fontFamily: D, fontWeight: 700, fontSize: 158, letterSpacing: -4, lineHeight: 1, color: R.ink, marginTop: 22}}>PROGRESSIVE</div>
      <div style={{fontFamily: D, fontWeight: 700, fontSize: 178, letterSpacing: -4, lineHeight: 1, color: '#fff', background: R.rust, padding: '0 30px 10px', borderRadius: 14, marginTop: 10, boxShadow: '0 20px 40px rgba(120,50,20,0.25)'}}>OVERLOAD</div>
    </div>
    {/* speaker cut-out, in front of the title */}
    <Img src={staticFile('v5/cover_cut.png')} style={{position: 'absolute', left: -60, top: 30, width: 1200, height: 2133, filter: 'drop-shadow(0 30px 50px rgba(40,25,10,0.35)) contrast(1.06) saturate(0.95)'}} />
    {/* the 4 levers */}
    <div style={{position: 'absolute', top: 1470, width: 1080, display: 'flex', justifyContent: 'center', gap: 14}}>
      {['+ WEIGHT', '+ REPS', '+ SETS', '+ TEMPO'].map((t, i) => (
        <div key={t} style={{fontFamily: D, fontWeight: 700, fontSize: 44, color: '#fff', background: i === 0 ? R.rust : 'rgba(23,18,15,0.88)', padding: '6px 22px 10px', borderRadius: 10, boxShadow: '0 12px 26px rgba(0,0,0,0.3)'}}>{t}</div>
      ))}
    </div>
    <div style={{position: 'absolute', top: 1570, width: 1080, textAlign: 'center', fontFamily: M, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.6)'}}>— TRACK IT. BEAT IT. GROW.</div>
  </AbsoluteFill>
);
