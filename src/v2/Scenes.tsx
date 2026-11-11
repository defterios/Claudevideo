import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile} from 'remotion';
import {CX, P, SANS, SERIF} from './theme';

export type SP = {local: number; dur: number; fps: number; beats: number[]; props: Record<string, any>};

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (x: number, a: number, b: number) => interpolate(x, [a, b], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
/** soft blur-rise used for every text element */
const rise = (p: number, dist = 26): React.CSSProperties => ({
  opacity: p,
  filter: `blur(${(1 - p) * 10}px)`,
  transform: `translateY(${(1 - p) * dist}px)`,
});

export const Kicker: React.FC<{text: string; p: number; color?: string; style?: React.CSSProperties}> = ({text, p, color = P.ink, style}) => (
  <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: 9, textTransform: 'uppercase', color, ...rise(p, 12), ...style}}>{text}</div>
);

const Bg: React.FC<{kind: 'green' | 'cream'}> = ({kind}) => (
  <AbsoluteFill
    style={{
      background:
        kind === 'green'
          ? `radial-gradient(ellipse 90% 70% at 50% 40%, ${P.green} 0%, ${P.greenDeep} 100%)`
          : `radial-gradient(ellipse 90% 70% at 50% 40%, ${P.cream} 0%, ${P.paper} 100%)`,
    }}
  />
);

const Photo: React.FC<{img: string; local: number; dur: number; zoom?: 'in' | 'out'; style?: React.CSSProperties; dark?: boolean}> = ({img, local, dur, zoom = 'in', style, dark}) => {
  const k = interpolate(local, [0, Math.max(dur, 0.1)], zoom === 'in' ? [1.04, 1.14] : [1.14, 1.04], cl);
  return (
    <div style={{overflow: 'hidden', position: 'relative', ...style}}>
      <Img
        src={staticFile(`broll/${img}.jpg`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${k})`,
          // warm editorial grade
          filter: `sepia(0.18) saturate(0.85) contrast(1.05) brightness(${dark ? 0.62 : 0.95})`,
        }}
      />
    </div>
  );
};

/* ---------- big serif title card ---------- */
const Title: React.FC<SP> = ({local, beats, props}) => {
  const green = props.bg === 'green';
  const fg = green ? P.cream : P.ink;
  const it = beats[0] ?? 0.35;
  return (
    <AbsoluteFill>
      <Bg kind={green ? 'green' : 'cream'} />
      <div style={{position: 'absolute', left: 60, width: 870, top: 330, height: 760, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Kicker text={props.kicker} p={ease(local, 0, 0.35)} color={green ? P.sage : P.green} />
        <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 200, lineHeight: 1, letterSpacing: -4, color: fg, marginTop: 20, ...rise(ease(local, 0.08, 0.5), 40)}}>
          {props.title}
        </div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 132, lineHeight: 1.05, color: green ? P.sage : P.green, ...rise(ease(local, it, it + 0.4), 30)}}>
          {props.italic}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- framed photo + tag pills ---------- */
const PhotoCard: React.FC<SP> = ({local, dur, props}) => {
  const tags: string[] = props.tags;
  const s = ease(local, 0, 0.45);
  return (
    <AbsoluteFill>
      <Bg kind="cream" />
      <Kicker text={props.kicker} p={ease(local, 0.05, 0.4)} color={P.green} style={{position: 'absolute', top: 250, width: 1080, textAlign: 'center', left: -45}} />
      <Photo
        img={props.img}
        local={local}
        dur={dur}
        style={{position: 'absolute', left: CX - 410, top: 320, width: 820, height: 700, borderRadius: 28, boxShadow: '0 40px 80px rgba(20,38,25,0.28)', transform: `scale(${0.94 + 0.06 * s})`, opacity: s}}
      />
      <div style={{position: 'absolute', top: 975, left: 0, width: 990, display: 'flex', justifyContent: 'center', gap: 16}}>
        {tags.map((tg, i) => {
          const p = spring({frame: Math.round((local - 0.3 - i * 0.25) * 30), fps: 30, config: {damping: 14, stiffness: 160}});
          return (
            <div
              key={i}
              style={{
                fontFamily: SERIF,
                fontStyle: i ? 'italic' : 'normal',
                fontWeight: i ? 400 : 600,
                fontSize: 52,
                color: i ? P.green : P.cream,
                background: i ? P.cream : P.green,
                border: `2px solid ${P.green}`,
                borderRadius: 999,
                padding: '8px 34px 12px',
                boxShadow: '0 12px 30px rgba(20,38,25,0.25)',
                opacity: p,
                transform: `translateY(${(1 - p) * 40}px)`,
              }}
            >
              {tg}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- hormone nodes ---------- */
const Hormone: React.FC<SP> = ({local, beats, props}) => {
  const labels: string[] = props.labels;
  const n = labels.length;
  return (
    <AbsoluteFill>
      <Bg kind="cream" />
      <div style={{position: 'absolute', top: 280, width: 990, textAlign: 'center'}}>
        <div style={{fontFamily: SERIF, fontSize: 130, color: P.ink, letterSpacing: -2, ...rise(ease(local, 0, 0.4))}}>{props.drug}</div>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {labels.map((lb, i) => {
          const at = beats[i] ?? 0.4 + i * 0.4;
          const p = ease(local, at - 0.3, at + 0.2);
          const cx = n === 1 ? 495 : 495 + (i === 0 ? -190 : 190);
          const cy = 760;
          const pulse = 1 + 0.04 * Math.sin(local * 5 + i);
          return (
            <g key={i} opacity={p} transform={`translate(${cx} ${cy}) scale(${(0.7 + 0.3 * p) * pulse})`}>
              {[0, 1, 2, 3, 4, 5].map((k) => {
                const a = (k / 6) * Math.PI * 2 + local * 0.8 * (i ? -1 : 1);
                return <circle key={k} cx={Math.cos(a) * 190} cy={Math.sin(a) * 190} r={10} fill={P.sage} />;
              })}
              <circle r={190} fill="none" stroke={P.green} strokeWidth={2} strokeDasharray="4 10" />
              <circle r={140} fill={P.green} />
              <text y={22} textAnchor="middle" fontFamily="Bodoni Moda" fontWeight={600} fontSize={64} fill={P.cream}>
                {lb}
              </text>
            </g>
          );
        })}
        {n === 2 ? <text x={495} y={782} textAnchor="middle" fontFamily="Bodoni Moda" fontStyle="italic" fontSize={56} fill={P.green} opacity={ease(local, (beats[1] ?? 1) - 0.2, (beats[1] ?? 1) + 0.2)}>+</text> : null}
      </svg>
      <div style={{position: 'absolute', top: 1010, width: 990, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, color: P.green, ...rise(ease(local, 0.5, 0.9))}}>
        {props.note}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- UI knob card (like the reference's lighting knob) ---------- */
const Knob: React.FC<SP> = ({local, dur, props}) => {
  const turn = interpolate(local, [0.4, Math.min(dur - 0.3, 2.2)], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const ang = interpolate(turn, [0, 1], [60, -120]);
  const card = spring({frame: Math.round(local * 30), fps: 30, config: {damping: 15, stiffness: 140}});
  return (
    <AbsoluteFill>
      <Bg kind="cream" />
      <div
        style={{
          position: 'absolute',
          left: CX - 380,
          top: 420,
          width: 760,
          height: 520,
          borderRadius: 34,
          background: `linear-gradient(160deg, ${P.green}, ${P.greenDeep})`,
          boxShadow: '0 40px 90px rgba(20,38,25,0.35)',
          opacity: card,
          transform: `translateY(${(1 - card) * 80}px)`,
        }}
      >
        <div style={{position: 'absolute', left: 44, top: 40}}>
          <Kicker text={props.label} p={1} color={P.sage} />
          <div style={{fontFamily: SERIF, fontSize: 72, color: P.cream, marginTop: 10}}>{turn > 0.5 ? props.toLabel : props.fromLabel}</div>
        </div>
        <svg width={760} height={520} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 13}).map((_, i) => {
            const a = ((-210 + i * 20) * Math.PI) / 180;
            return <line key={i} x1={520 + Math.cos(a) * 150} y1={290 + Math.sin(a) * 150} x2={520 + Math.cos(a) * 170} y2={290 + Math.sin(a) * 170} stroke={P.sage} strokeWidth={4} opacity={0.6} />;
          })}
          <circle cx={520} cy={290} r={120} fill="#0d1a12" stroke="#2f5040" strokeWidth={6} />
          <g transform={`rotate(${ang} 520 290)`}>
            <line x1={520} y1={290} x2={520} y2={190} stroke={P.cream} strokeWidth={10} strokeLinecap="round" />
          </g>
          <text x={380} y={470} fontFamily="Inter Tight" fontWeight={600} fontSize={22} letterSpacing={4} fill={P.sage}>SLOW</text>
          <text x={600} y={470} fontFamily="Inter Tight" fontWeight={600} fontSize={22} letterSpacing={4} fill={P.sage}>FAST</text>
        </svg>
      </div>
      <div style={{position: 'absolute', top: 1010, width: 990, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 76, color: P.green, ...rise(ease(local, 1.2, 1.6))}}>
        {props.value}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- bar chart card ---------- */
const Chart: React.FC<SP> = ({local, beats, props}) => {
  const bars: {label: string; value: number}[] = props.bars;
  const go = beats[0] ?? 0.8;
  const max = 24;
  return (
    <AbsoluteFill>
      <Bg kind="cream" />
      <div style={{position: 'absolute', left: CX - 400, top: 300, width: 800, height: 860, borderRadius: 34, background: '#F7F3E8', boxShadow: '0 40px 90px rgba(20,38,25,0.18)', ...rise(ease(local, 0, 0.4), 60)}}>
        <div style={{position: 'absolute', left: 50, top: 46}}>
          <Kicker text="Clinical trial" p={1} color={P.gold} />
          <div style={{fontFamily: SERIF, fontSize: 64, color: P.ink, marginTop: 8}}>{props.title}</div>
        </div>
        <div style={{position: 'absolute', left: 90, right: 90, bottom: 150, height: 480, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around'}}>
          {bars.map((b, i) => {
            const p = interpolate(local, [go + i * 0.5, go + i * 0.5 + 1.0], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
            const v = b.value * p;
            return (
              <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 220}}>
                <div style={{fontFamily: SERIF, fontSize: 84, color: i ? P.green : P.gold, marginBottom: 12, opacity: p > 0.02 ? 1 : 0}}>
                  {v.toFixed(1)}
                  <span style={{fontSize: 46}}>{props.unit}</span>
                </div>
                <div style={{width: 170, height: (480 - 120) * (v / max), borderRadius: '18px 18px 4px 4px', background: i ? P.green : P.gold}} />
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 90, right: 90, bottom: 80, display: 'flex', justifyContent: 'space-around', borderTop: `2px solid ${P.ink}22`, paddingTop: 16}}>
          {bars.map((b, i) => (
            <div key={i} style={{width: 220, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 46, color: P.ink}}>{b.label}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 28, textAlign: 'center', fontFamily: SANS, fontSize: 20, letterSpacing: 2, color: '#6b6b5f'}}>{props.note}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- appetite / calorie deficit ---------- */
const Deficit: React.FC<SP> = ({local, dur, beats, props}) => {
  const drop = interpolate(local, [beats[0] - 1.6, beats[0]], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const kcal = Math.round(interpolate(drop, [0, 1], [props.fromKcal as number, props.toKcal as number]) / 10) * 10;
  const def = ease(local, beats[1] - 0.2, beats[1] + 0.3);
  return (
    <AbsoluteFill>
      <Bg kind="cream" />
      <Photo img={props.img} local={local} dur={dur} style={{position: 'absolute', left: CX - 410, top: 240, width: 820, height: 500, borderRadius: 28, opacity: ease(local, 0, 0.4)}} />
      <div style={{position: 'absolute', left: CX - 380, top: 680, width: 760, height: 470, borderRadius: 34, background: `linear-gradient(160deg, ${P.green}, ${P.greenDeep})`, boxShadow: '0 40px 90px rgba(20,38,25,0.35)', ...rise(ease(local, 0.2, 0.6), 80)}}>
        <div style={{position: 'absolute', left: 50, top: 44, right: 50}}>
          <Kicker text={props.label} p={1} color={P.sage} />
          <div style={{marginTop: 22, height: 16, borderRadius: 8, background: '#0d1a12'}}>
            <div style={{width: `${interpolate(drop, [0, 1], [92, 38])}%`, height: '100%', borderRadius: 8, background: P.sage}} />
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 40}}>
            <div style={{fontFamily: SERIF, fontSize: 150, color: P.cream, lineHeight: 1}}>{kcal.toLocaleString('en-US')}</div>
            <div style={{fontFamily: SANS, fontSize: 30, letterSpacing: 4, color: P.sage}}>KCAL / DAY</div>
          </div>
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, color: P.sage, marginTop: 10, ...rise(def)}}>calorie deficit.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- full-bleed photo + title (+ strike) ---------- */
const Full: React.FC<SP> = ({local, dur, beats, props}) => {
  const strike = props.strike ? ease(local, beats[0] ?? 1, (beats[0] ?? 1) + 0.35) : 0;
  return (
    <AbsoluteFill>
      <Photo img={props.img} local={local} dur={dur} dark style={{position: 'absolute', inset: 0}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,38,25,0.55), rgba(20,38,25,0.1) 40%, rgba(20,38,25,0.65))'}} />
      <div style={{position: 'absolute', left: 60, width: 870, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Kicker text={props.kicker} p={ease(local, 0, 0.35)} color={P.cream} />
        <div style={{position: 'relative', marginTop: 16, fontFamily: SERIF, fontWeight: 500, fontSize: 150, lineHeight: 1, letterSpacing: -3, color: P.cream, textAlign: 'center', ...rise(ease(local, 0.1, 0.5), 40)}}>
          {props.title}
          <div style={{position: 'absolute', left: -20, top: '52%', height: 12, width: `${strike * 110}%`, background: P.red, transform: 'rotate(-6deg)', transformOrigin: 'left center'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- fat vs muscle ---------- */
const FatMuscle: React.FC<SP> = ({local, beats, props}) => {
  const m = interpolate(local, [beats[0] - 0.2, beats[0] + 0.9], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const W = 820;
  return (
    <AbsoluteFill>
      <Bg kind="cream" />
      <div style={{position: 'absolute', top: 360, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Kicker text={props.kicker} p={ease(local, 0, 0.35)} color={P.green} />
        <div style={{fontFamily: SERIF, fontSize: 110, color: P.ink, marginTop: 14, letterSpacing: -2, ...rise(ease(local, 0.1, 0.5))}}>
          What you <span style={{fontStyle: 'italic', color: P.green}}>lose</span>
        </div>
        <div style={{position: 'relative', width: W, height: 150, borderRadius: 26, overflow: 'hidden', marginTop: 70, background: '#d9d1bb', ...rise(ease(local, 0.3, 0.7))}}>
          <div style={{position: 'absolute', inset: 0, width: W, background: P.gold}} />
          <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: W * 0.38 * m, background: P.red}} />
          <div style={{position: 'absolute', left: 34, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: SERIF, fontSize: 56, color: P.cream}}>Fat</div>
          <div style={{position: 'absolute', right: 30, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 56, color: P.cream, opacity: m}}>Muscle</div>
        </div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 70, color: P.red, marginTop: 40, ...rise(m)}}>not just fat.</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- metabolism crash line ---------- */
const Crash: React.FC<SP> = ({local, beats, props}) => {
  const draw = ease(local, 0.1, 0.8);
  const c = interpolate(local, [beats[0] - 0.1, beats[0] + 0.35], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
  const pts = Array.from({length: 40}).map((_, i) => {
    const x = 60 + (i / 39) * 640;
    const flat = 160 + Math.sin(i * 0.9) * 8;
    const y = i < 26 ? flat : flat + (((i - 26) / 13) ** 1.5) * 300 * c;
    return [x, y];
  });
  const shown = pts.slice(0, Math.max(2, Math.round(pts.length * (c > 0 ? 1 : draw * (26 / 40)))));
  const shake = c > 0 && c < 1 ? Math.sin(local * 80) * 6 * (1 - c) : 0;
  return (
    <AbsoluteFill>
      <Bg kind="cream" />
      <div style={{position: 'absolute', left: CX - 400 + shake, top: 360, width: 800, height: 700, borderRadius: 34, background: '#F7F3E8', boxShadow: '0 40px 90px rgba(20,38,25,0.18)', ...rise(ease(local, 0, 0.35), 60)}}>
        <div style={{position: 'absolute', left: 50, top: 44}}>
          <Kicker text={props.label} p={1} color={P.gold} />
          <div style={{fontFamily: SERIF, fontSize: 96, color: c > 0.5 ? P.red : P.ink, fontStyle: c > 0.5 ? 'italic' : 'normal'}}>{c > 0.5 ? 'Crash.' : 'Steady'}</div>
        </div>
        <svg width={800} height={700} style={{position: 'absolute', left: 0, top: 160}}>
          <polyline points={shown.map((p) => p.join(',')).join(' ')} fill="none" stroke={c > 0.3 ? P.red : P.green} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- checklist over photos ---------- */
const Checklist: React.FC<SP> = ({local, dur, beats, props}) => {
  const items: string[] = props.items;
  const imgs: string[] = props.imgs;
  const swap = ease(local, beats[3] - 0.15, beats[3] + 0.25);
  return (
    <AbsoluteFill>
      <Photo img={imgs[0]} local={local} dur={dur} dark style={{position: 'absolute', inset: 0}} />
      <div style={{position: 'absolute', inset: 0, opacity: swap}}>
        <Photo img={imgs[1]} local={local} dur={dur} zoom="out" dark style={{position: 'absolute', inset: 0}} />
      </div>
      <div style={{position: 'absolute', left: CX - 390, top: 560, width: 780, borderRadius: 34, background: 'rgba(239,233,218,0.96)', padding: '44px 50px', boxShadow: '0 40px 90px rgba(0,0,0,0.4)', ...rise(ease(local, 0, 0.4), 60)}}>
        <Kicker text="You must" p={1} color={P.green} />
        {items.map((it, i) => {
          const p = ease(local, beats[i] - 0.1, beats[i] + 0.2);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 28}}>
              <div style={{width: 64, height: 64, borderRadius: 999, border: `3px solid ${P.green}`, background: p > 0.5 ? P.green : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.cream, fontSize: 40, fontFamily: SANS, fontWeight: 800}}>
                <span style={{transform: `scale(${p})`}}>✓</span>
              </div>
              <div style={{fontFamily: SERIF, fontSize: 62, color: P.ink, opacity: 0.35 + 0.65 * p, fontStyle: i === 2 ? 'italic' : 'normal'}}>{it}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- comment CTA ---------- */
const Comment: React.FC<SP> = ({local, beats, props}) => {
  const text: string = props.text;
  const typed = Math.round(interpolate(local, [beats[0], beats[1] - 0.3], [0, text.length], cl));
  const posted = ease(local, beats[1], beats[1] + 0.35);
  const caret = Math.floor(local * 3) % 2 === 0 && posted < 0.5;
  return (
    <AbsoluteFill>
      <Bg kind="green" />
      <div style={{position: 'absolute', top: 330, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Kicker text={props.kicker} p={ease(local, 0, 0.35)} color={P.sage} />
        <div style={{fontFamily: SERIF, fontSize: 150, color: P.cream, marginTop: 12, letterSpacing: -3, ...rise(ease(local, 0.1, 0.5))}}>Let me know</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 110, color: P.sage, ...rise(ease(local, 0.3, 0.7))}}>in the comments.</div>
      </div>
      <div style={{position: 'absolute', left: CX - 400, top: 860, width: 800, ...rise(ease(local, 0.4, 0.8), 40)}}>
        <div style={{opacity: 1 - posted, display: 'flex', alignItems: 'center', gap: 18, background: P.cream, borderRadius: 999, padding: '20px 26px 20px 34px', boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
          <div style={{flex: 1, fontFamily: SANS, fontSize: 34, color: typed ? P.ink : '#8a8a7c'}}>
            {typed ? text.slice(0, typed) : 'Add a comment...'}
            {caret ? <span style={{color: P.green}}>|</span> : null}
          </div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: P.cream, background: typed >= text.length ? P.green : '#9aa79c', borderRadius: 999, padding: '10px 26px'}}>Post</div>
        </div>
        <div style={{position: 'absolute', left: 0, top: 0, width: 800, opacity: posted, transform: `translateY(${(1 - posted) * 30}px)`, display: 'flex', gap: 20, alignItems: 'flex-start', background: 'rgba(239,233,218,0.12)', border: '2px solid rgba(239,233,218,0.25)', borderRadius: 28, padding: '22px 28px'}}>
          <div style={{width: 64, height: 64, borderRadius: 999, background: P.sage, flexShrink: 0}} />
          <div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, color: P.sage}}>you · just now</div>
            <div style={{fontFamily: SANS, fontSize: 34, color: P.cream, marginTop: 4}}>{text}</div>
          </div>
          <div style={{marginLeft: 'auto', fontSize: 40, transform: `scale(${1 + 0.3 * Math.max(0, Math.sin((local - beats[1]) * 6)) * posted})`}}>❤️</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const REGISTRY: Record<string, React.FC<SP>> = {
  title: Title,
  photo: PhotoCard,
  hormone: Hormone,
  knob: Knob,
  chart: Chart,
  deficit: Deficit,
  full: Full,
  fatmuscle: FatMuscle,
  crash: Crash,
  checklist: Checklist,
  comment: Comment,
};
