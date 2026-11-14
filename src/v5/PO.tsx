import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import data from './data.json';
import face from './face.json';

/* ---------------- fonts ---------------- */
if (typeof document !== 'undefined') {
  const h = delayRender('v5 fonts');
  const faces = [
    new FontFace('Chakra Petch', `url(${staticFile('fonts/ChakraPetch-500.woff2')}) format('woff2')`, {weight: '500'}),
    new FontFace('Chakra Petch', `url(${staticFile('fonts/ChakraPetch-600.woff2')}) format('woff2')`, {weight: '600'}),
    new FontFace('Chakra Petch', `url(${staticFile('fonts/ChakraPetch-700.woff2')}) format('woff2')`, {weight: '700'}),
    new FontFace('JetBrains Mono', `url(${staticFile('fonts/JetBrainsMono.woff2')}) format('woff2')`, {weight: '400 700'}),
  ];
  Promise.all(faces.map((f) => f.load()))
    .then((l) => {
      l.forEach((f) => document.fonts.add(f));
      continueRender(h);
    })
    .catch(() => continueRender(h));
}

const D = '"Chakra Petch", sans-serif';
const M = '"JetBrains Mono", monospace';
const R = {cream: '#F4EFE7', rust: '#B4471F', ink: '#17120F', term: '#1C1714', muted: '#8A7F75', white: '#FFFFFF'};
const CX = 495;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (x: number, a: number, b: number) => interpolate(x, [a, b], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
const pop = (local: number, at = 0) => spring({frame: Math.round((local - at) * 30), fps: 30, config: {damping: 14, stiffness: 190}});

type Scene = {kind: string; start: number; end: number; beats: number[]; props: Record<string, any>};
type Vid = {src: string; srcStart: number; outStart: number; dur: number};
const scenes = data.scenes as Scene[];
const vids = data.video as Vid[];
const zooms = data.zooms as {start: number; end: number; k: number}[];
const pages = data.pages as {start: number; end: number; words: {text: string; start: number; end: number}[]}[];
export const PO_DURATION: number = data.duration;
const CUTAWAYS = new Set(['terminal', 'logTable', 'stairs', 'randomCards', 'logType', 'beat', 'follow']);

const srcAt = (t: number) => {
  let v = vids[0];
  for (const x of vids) if (t >= x.outStart) v = x;
  return v.srcStart + Math.min(Math.max(0, t - v.outStart), v.dur);
};
const eyeAt = (src: number) => {
  const i = Math.min(face.ex.length - 1, Math.max(0, Math.round(src * face.fps)));
  return [face.ex[i], face.ey[i]];
};

/* ---------------- footage with eye-anchored punch-ins ---------------- */
const Footage: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const z = zooms.find((q) => t >= q.start - 0.05 && t < q.end + 0.05);
  // hard punch (3 frames) like the reference
  let k = 1;
  if (z) k = 1 + (z.k - 1) * Math.min(ease(t, z.start - 0.05, z.start + 0.05), 1 - ease(t, z.end - 0.05, z.end + 0.05));
  const [ex, ey] = eyeAt(srcAt(t));
  const p = z ? (k - 1) / (z.k - 1) : 0;
  const ax = ex + (540 - ex) * p;
  const ay = ey + (800 - ey) * p;
  let tx = ax - ex * k;
  let ty = ay - ey * k;
  tx = Math.min(0, Math.max(1080 - 1080 * k, tx));
  ty = Math.min(0, Math.max(1920 - 1920 * k, ty));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${k})`, transformOrigin: '0 0'}}>
        {vids.map((v, i) => {
          const from = Math.round(v.outStart * fps);
          const last = i === vids.length - 1;
          return (
            <Sequence key={i} from={from} durationInFrames={last ? durationInFrames - from : Math.max(1, Math.round(v.dur * fps))} layout="none">
              <AbsoluteFill>
                <OffthreadVideo src={staticFile('v5/po.mp4')} muted trimBefore={Math.round(v.srcStart * fps)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.07) saturate(0.93) sepia(0.07)'}} />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 65% at 50% 42%, rgba(0,0,0,0) 55%, rgba(20,12,6,0.38) 100%), linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0) 28%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.3))'}} />
    </AbsoluteFill>
  );
};

/* ---------------- shared bits ---------------- */
const Tag: React.FC<{text: string; p: number; size?: number; dark?: boolean}> = ({text, p, size = 26, dark}) => {
  const n = Math.round(text.length * Math.min(1, p * 1.4));
  return (
    <div style={{display: 'inline-block', fontFamily: M, fontWeight: 700, fontSize: size, letterSpacing: 2, textTransform: 'uppercase', color: '#fff', background: dark ? R.ink : R.rust, padding: `${size * 0.25}px ${size * 0.55}px`, borderRadius: 4, opacity: p > 0.01 ? 1 : 0, boxShadow: '0 8px 22px rgba(0,0,0,0.3)'}}>
      {text.slice(0, n)}
      <span style={{opacity: 0}}>{text.slice(n)}</span>
    </div>
  );
};
const Label: React.FC<{text: string; p: number}> = ({text, p}) => (
  <div style={{fontFamily: M, fontSize: 24, letterSpacing: 3, color: R.muted, opacity: p, textTransform: 'uppercase'}}>{text}</div>
);
/** big squared number / word with an RGB-split glitch on entry */
const Big: React.FC<{text: string; size: number; local: number; at?: number; color?: string; shadow?: boolean; boxed?: boolean}> = ({text, size, local, at = 0, color = '#fff', shadow = true, boxed}) => {
  const l = local - at;
  if (l < 0) return null;
  const g = l < 0.25 ? Math.sin(l * 90) * (0.25 - l) * 40 : 0;
  const p = ease(l, 0, 0.12);
  const base: React.CSSProperties = {fontFamily: D, fontWeight: 700, fontSize: size, lineHeight: 0.95, letterSpacing: -size * 0.02, whiteSpace: 'nowrap'};
  return (
    <div style={{position: 'relative', opacity: p}}>
      {g ? <div style={{...base, position: 'absolute', left: g, top: 0, color: 'rgba(255,60,40,0.8)', mixBlendMode: 'screen'}}>{text}</div> : null}
      {g ? <div style={{...base, position: 'absolute', left: -g, top: 0, color: 'rgba(40,200,255,0.8)', mixBlendMode: 'screen'}}>{text}</div> : null}
      <div style={{...base, position: 'relative', color: boxed ? '#fff' : color, background: boxed ? R.rust : 'transparent', padding: boxed ? `0 ${size * 0.18}px ${size * 0.06}px` : 0, borderRadius: boxed ? 8 : 0, textShadow: shadow && !boxed ? '0 8px 40px rgba(0,0,0,0.45)' : 'none', boxShadow: boxed ? '0 14px 30px rgba(0,0,0,0.3)' : 'none'}}>{text}</div>
    </div>
  );
};
const TopZone: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 230}) => (
  <div style={{position: 'absolute', top, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>{children}</div>
);
const Cream: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 60% at 50% 40%, #FBF8F3 0%, ${R.cream} 60%, #EAE3D8 100%)`}}>{children}</AbsoluteFill>
);
const Terminal: React.FC<{file: string; children: React.ReactNode; w?: number; h?: number; top: number}> = ({file, children, w = 820, h = 300, top}) => (
  <div style={{position: 'absolute', left: CX - w / 2, top, width: w, height: h, borderRadius: 14, background: R.term, boxShadow: '0 30px 60px rgba(40,25,10,0.25)', overflow: 'hidden'}}>
    <div style={{height: 48, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
      <span style={{width: 12, height: 12, borderRadius: 6, background: R.rust}} />
      <span style={{fontFamily: M, fontSize: 20, color: '#9B8F84'}}>{file}</span>
    </div>
    <div style={{padding: '22px 30px', fontFamily: M, fontSize: 34, color: '#EDE6DC', lineHeight: 1.55}}>{children}</div>
  </div>
);
const typed = (s: string, local: number, at: number, cps = 28) => s.slice(0, Math.max(0, Math.round((local - at) * cps)));

/* ---------------- overlay scenes (on footage, top zone above the head) ---------------- */
const HookCount: React.FC<{sc: Scene; local: number}> = ({sc, local}) => {
  const n = Math.round(interpolate(local, [0.25, 2.2], [1, 365], {...cl, easing: Easing.out(Easing.cubic)}));
  const r = sc.beats[0];
  return (
    <TopZone>
      <Label text="— 1 year at the gym" p={ease(local, 0, 0.2)} />
      <Big text={String(n).padStart(3, '0')} size={200} local={local} at={0.15} />
      <div style={{display: 'flex', gap: 12}}>
        <Tag text="DAYS TRAINED" p={ease(local, 0.4, 0.9)} />
        {local >= r ? <Tag text="RESULTS: 0" p={ease(local, r, r + 0.3)} dark /> : null}
      </div>
    </TopZone>
  );
};
const GlitchTitle: React.FC<{sc: Scene; local: number}> = ({sc, local}) => (
  <TopZone top={250}>
    <Tag text={sc.props.kicker} p={ease(local, 0, 0.5)} />
    <Big text={sc.props.lines[0]} size={112} local={local} at={sc.beats[0] - 0.05} />
    <Big text={sc.props.lines[1]} size={104} local={local} at={sc.beats[0] + 0.35} boxed />
  </TopZone>
);
const TagScene: React.FC<{sc: Scene; local: number}> = ({sc, local}) => (
  <TopZone top={300}>
    <Tag text={sc.props.text} p={ease(local, 0.05, 0.8)} size={30} />
  </TopZone>
);
const Steps: React.FC<{sc: Scene; local: number}> = ({sc, local}) => {
  const items: string[] = sc.props.items;
  let idx = -1;
  sc.beats.slice(0, items.length).forEach((b, i) => {
    if (local >= b) idx = i;
  });
  const last = sc.beats[items.length];
  if (idx < 0)
    return (
      <TopZone top={280}>
        <Label text="— so how do you do this?" p={ease(local, 0, 0.2)} />
        <Big text="HOW?" size={190} local={local} at={0.1} />
      </TopZone>
    );
  const b = sc.beats[idx];
  return (
    <TopZone top={250}>
      <Tag text="WAYS TO OVERLOAD" p={1} dark />
      <Big key={idx} text={String(idx + 1).padStart(2, '0')} size={210} local={local} at={b} />
      <Tag key={'l' + idx} text={items[idx]} p={ease(local, b, b + 0.4)} size={32} />
      {local >= last ? <Tag text={'✓ ' + sc.props.last} p={ease(local, last, last + 0.4)} size={28} dark /> : null}
    </TopZone>
  );
};
const Myth: React.FC<{sc: Scene; local: number}> = ({sc, local}) => {
  const b = sc.beats[0];
  const s = ease(local, b - 0.15, b + 0.1);
  const st = pop(local, b);
  return (
    <TopZone top={300}>
      <div style={{position: 'relative'}}>
        <Big text={sc.props.text} size={92} local={local} at={0.05} />
        <div style={{position: 'absolute', left: -10, top: '46%', height: 12, width: `${s * 104}%`, background: R.rust}} />
      </div>
      <div style={{transform: `rotate(-6deg) scale(${2 - st})`, opacity: st, fontFamily: D, fontWeight: 700, fontSize: 84, color: '#fff', background: R.rust, padding: '0 28px', borderRadius: 6, boxShadow: '0 14px 30px rgba(0,0,0,0.35)'}}>MYTH</div>
    </TopZone>
  );
};
const Weeks: React.FC<{sc: Scene; local: number}> = ({sc, local}) => {
  const fill = interpolate(local, [0.6, sc.beats[0] + 0.4], [0, sc.props.n], cl);
  return (
    <TopZone top={250}>
      <Tag text="SAME EXERCISE · AT LEAST" p={ease(local, 0, 0.6)} />
      <Big text={`${sc.props.n} WEEKS`} size={150} local={local} at={sc.beats[0] - 0.1} />
      <div style={{display: 'flex', gap: 12}}>
        {Array.from({length: sc.props.n}).map((_, i) => (
          <div key={i} style={{width: 92, height: 36, borderRadius: 4, background: fill > i ? R.rust : 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.6)', fontFamily: M, fontSize: 18, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>W{i + 1}</div>
        ))}
      </div>
    </TopZone>
  );
};
const Guess: React.FC<{sc: Scene; local: number}> = ({sc, local}) => (
  <TopZone top={270}>
    {local >= sc.beats[0] - 0.1 ? <Tag text="NOT TRACKING?" p={ease(local, sc.beats[0] - 0.1, sc.beats[0] + 0.4)} size={30} dark /> : null}
    <Big text="= GUESSING" size={118} local={local} at={sc.beats[1] - 0.05} boxed />
  </TopZone>
);

/* ---------------- cream cutaways ---------------- */
const TerminalScene: React.FC<{sc: Scene; local: number}> = ({sc, local}) => (
  <Cream>
    <div style={{position: 'absolute', left: CX - 410, top: 400}}>
      <Label text={sc.props.label} p={ease(local, 0, 0.2)} />
    </div>
    <Terminal file={sc.props.file} top={450} h={170}>
      <span style={{color: R.rust}}>›</span> {typed(sc.props.lines[0], local, 0.1, 30)}
      {Math.floor(local * 3) % 2 === 0 ? '▌' : ''}
    </Terminal>
    <div style={{position: 'absolute', top: 700, width: 990, display: 'flex', justifyContent: 'center'}}>
      <Big text={sc.props.big} size={220} local={local} at={1.05} color={R.rust} shadow={false} />
    </div>
  </Cream>
);
const LogTable: React.FC<{sc: Scene; local: number}> = ({sc, local}) => {
  const g = sc.beats[0];
  return (
    <Cream>
      <div style={{position: 'absolute', left: CX - 410, top: 300}}>
        <Label text={sc.props.label} p={ease(local, 0, 0.2)} />
      </div>
      <div style={{position: 'absolute', left: CX - 410, top: 350, width: 820}}>
        {Array.from({length: 6}).map((_, i) => {
          const p = ease(local, 0.55 + i * 0.3, 0.75 + i * 0.3);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '12px 0', borderBottom: '1.5px solid rgba(23,18,15,0.1)', opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
              <span style={{fontFamily: M, fontSize: 26, color: R.muted, width: 140, whiteSpace: 'nowrap'}}>WEEK {i + 1}</span>
              <span style={{fontFamily: D, fontWeight: 700, fontSize: 52, color: R.ink, width: 300, whiteSpace: 'nowrap'}}>10 KG × 10</span>
              <div style={{flex: 1, height: 26, display: 'flex', gap: 4}}>
                {Array.from({length: 14}).map((__, j) => (
                  <div key={j} style={{flex: 1, background: j % 3 === 0 ? '#C9BFB3' : '#DDD5CA'}} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1000, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
        <Label text="— muscle growth" p={ease(local, g - 0.1, g + 0.2)} />
        <Big text="+0%" size={180} local={local} at={g + 0.75} color={R.rust} shadow={false} />
      </div>
    </Cream>
  );
};
const Stairs: React.FC<{sc: Scene; local: number}> = ({sc, local}) => (
  <Cream>
    <div style={{position: 'absolute', left: CX - 410, top: 330}}>
      <Label text={sc.props.label} p={ease(local, 0, 0.2)} />
    </div>
    <div style={{position: 'absolute', left: CX - 410, top: 400, width: 820, height: 520, display: 'flex', alignItems: 'flex-end', gap: 18}}>
      {Array.from({length: 6}).map((_, i) => {
        const p = ease(local, 0.1 + i * 0.16, 0.4 + i * 0.16);
        const h = (170 + i * 62) * p;
        return (
          <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
            <span style={{fontFamily: D, fontWeight: 700, fontSize: 30, color: i === 5 ? R.rust : R.ink, opacity: p}}>{(60 + i * 2.5).toFixed(1)}</span>
            <div style={{width: '100%', height: h, background: i === 5 ? R.rust : R.ink, borderRadius: '6px 6px 0 0', opacity: 0.35 + 0.65 * ((i + 1) / 6)}} />
            <span style={{fontFamily: M, fontSize: 20, color: R.muted}}>W{i + 1}</span>
          </div>
        );
      })}
    </div>
    <div style={{position: 'absolute', top: 1000, width: 990, display: 'flex', justifyContent: 'center'}}>
      <Big text="+ A LITTLE MORE" size={96} local={local} at={sc.beats[0] - 0.1} color={R.rust} shadow={false} />
    </div>
  </Cream>
);
const RandomCards: React.FC<{sc: Scene; local: number}> = ({sc, local}) => {
  const cards: string[] = sc.props.cards;
  const st = pop(local, sc.beats[1]);
  return (
    <Cream>
      <div style={{position: 'absolute', left: CX - 410, top: 330}}>
        <Label text="— random tiktok workouts" p={ease(local, 0, 0.2)} />
      </div>
      {cards.map((c, i) => {
        const p = pop(local, sc.beats[0] + i * 0.25);
        const rot = (i - 1) * 9;
        return (
          <div key={c} style={{position: 'absolute', left: CX - 150 + (i - 1) * 210, top: 440 + Math.abs(i - 1) * 40, width: 300, height: 520, borderRadius: 26, background: R.term, boxShadow: '0 30px 60px rgba(40,25,10,0.3)', transform: `rotate(${rot}deg) translateY(${(1 - p) * 300}px)`, opacity: p, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 24, boxSizing: 'border-box', zIndex: i === 1 ? 2 : 1}}>
            <div style={{position: 'absolute', top: 22, left: 22, fontFamily: M, fontSize: 16, color: '#fff', background: R.rust, padding: '3px 8px', borderRadius: 3}}>VIRAL</div>
            <div style={{fontFamily: D, fontWeight: 700, fontSize: 40, color: '#fff', lineHeight: 1.05}}>{c}</div>
            <div style={{marginTop: 14, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)'}}>
              <div style={{width: `${40 + i * 20}%`, height: '100%', borderRadius: 3, background: '#fff'}} />
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 640, width: 990, display: 'flex', justifyContent: 'center', zIndex: 5}}>
        <div style={{transform: `rotate(-8deg) scale(${2.2 - 1.2 * st})`, opacity: st, fontFamily: D, fontWeight: 700, fontSize: 170, color: '#fff', background: R.rust, padding: '0 46px', borderRadius: 10, boxShadow: '0 24px 50px rgba(0,0,0,0.35)'}}>STOP</div>
      </div>
    </Cream>
  );
};
const LogType: React.FC<{sc: Scene; local: number}> = ({sc, local}) => {
  const lines: string[] = sc.props.lines;
  const start = sc.beats[0] - 1.2;
  let used = 0;
  return (
    <Cream>
      <div style={{position: 'absolute', left: CX - 410, top: 380}}>
        <Label text={sc.props.label} p={ease(local, 0, 0.2)} />
      </div>
      <Terminal file={sc.props.file} top={430} h={420}>
        {lines.map((ln, i) => {
          const st = used;
          used += ln.length;
          const vis = typed(' '.repeat(st) + ln, local, Math.max(0.2, start), 34).slice(st);
          return (
            <div key={i} style={{whiteSpace: 'pre', color: i === 0 ? '#9B8F84' : ln.includes('✓') && vis.length === ln.length ? '#EDE6DC' : '#EDE6DC'}}>
              {vis.replace('✓', '')}
              {vis.length === ln.length && ln.includes('✓') ? <span style={{color: R.rust}}>✓</span> : null}
            </div>
          );
        })}
      </Terminal>
      <div style={{position: 'absolute', top: 900, width: 990, display: 'flex', justifyContent: 'center'}}>
        <Tag text="SAVED · BEAT IT NEXT WEEK" p={ease(local, sc.beats[0] + 2.2, sc.beats[0] + 2.9)} size={28} />
      </div>
    </Cream>
  );
};
const BeatIt: React.FC<{sc: Scene; local: number}> = ({sc, local}) => {
  const [p0, p1] = sc.props.prev as string[];
  const [n0, n1] = sc.props.now as string[];
  const b = sc.beats[0];
  const cnt = interpolate(local, [b - 0.4, b + 0.4], [60, 62.5], cl);
  return (
    <Cream>
      <div style={{position: 'absolute', left: CX - 410, top: 330, width: 820, display: 'flex', justifyContent: 'space-between'}}>
        <div style={{opacity: ease(local, 0, 0.25)}}>
          <Label text="— last week" p={1} />
          <div style={{fontFamily: D, fontWeight: 700, fontSize: 130, color: R.ink, lineHeight: 1}}>{p0}</div>
          <div style={{fontFamily: M, fontSize: 28, color: R.muted}}>{p1}</div>
        </div>
        <div style={{opacity: ease(local, b - 0.5, b - 0.3), textAlign: 'right'}}>
          <Label text="— this week" p={1} />
          <div style={{fontFamily: D, fontWeight: 700, fontSize: 130, color: R.rust, lineHeight: 1}}>{local < b + 0.4 ? cnt.toFixed(1) : n0}</div>
          <div style={{fontFamily: M, fontSize: 28, color: R.muted}}>{n1}</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: CX - 410, top: 600, width: 820, height: 70, display: 'flex', gap: 4}}>
        {Array.from({length: 40}).map((_, i) => {
          const on = ease(local, 0.1 + i * 0.02, 0.2 + i * 0.02);
          return <div key={i} style={{flex: 1, background: i > 30 && local > b ? R.rust : i % 4 === 0 ? R.ink : '#CFC6BA', opacity: on}} />;
        })}
      </div>
      <div style={{position: 'absolute', top: 730, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        <Tag text="+2.5 KG" p={ease(local, b, b + 0.3)} size={44} />
        {local >= sc.beats[1] - 0.1 ? <Big text="= MUSCLE" size={150} local={local} at={sc.beats[1] - 0.1} color={R.ink} shadow={false} /> : null}
      </div>
    </Cream>
  );
};
const Follow: React.FC<{sc: Scene; local: number}> = ({local}) => {
  const p = pop(local, 0.15);
  return (
    <Cream>
      <div style={{position: 'absolute', top: 560, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        <div style={{fontFamily: D, fontWeight: 600, fontSize: 64, color: R.ink, opacity: ease(local, 0, 0.2)}}>Follow</div>
        <div style={{position: 'relative', transform: `scale(${0.6 + 0.4 * p})`, opacity: p}}>
          <div style={{fontFamily: D, fontWeight: 700, fontSize: 120, color: '#fff', background: R.rust, padding: '6px 54px 14px', borderRadius: 26, boxShadow: '0 20px 40px rgba(120,50,20,0.3)'}}>FOR MORE</div>
          <div style={{position: 'absolute', left: 60, bottom: -26, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `30px solid ${R.rust}`}} />
        </div>
      </div>
    </Cream>
  );
};

const OVERLAY: Record<string, React.FC<{sc: Scene; local: number}>> = {hookCount: HookCount, glitchTitle: GlitchTitle, tag: TagScene, steps: Steps, myth: Myth, weeks: Weeks, guess: Guess};
const CUT: Record<string, React.FC<{sc: Scene; local: number}>> = {terminal: TerminalScene, logTable: LogTable, stairs: Stairs, randomCards: RandomCards, logType: LogType, beat: BeatIt, follow: Follow};

const Layers: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sc = scenes.find((s) => t >= s.start && t < s.end);
  if (!sc) return null;
  const local = t - sc.start;
  if (CUTAWAYS.has(sc.kind)) {
    const C = CUT[sc.kind];
    const inP = ease(local, 0, 5 / fps);
    return (
      <AbsoluteFill style={{opacity: inP, filter: inP < 1 ? `blur(${(1 - inP) * 14}px)` : undefined, transform: `scale(${1.04 - 0.04 * inP})`}}>
        <C sc={sc} local={local} />
      </AbsoluteFill>
    );
  }
  const O = OVERLAY[sc.kind];
  return O ? <O sc={sc} local={local} /> : null;
};

const KEY = /^(results?|progressive|overload|lazy|zero|grow|adapt|more|weights?|rep|set|tempo|perfect|form|stop|random|tiktok|myth|six|weeks|notebook|track|record|beat|numbers|muscles?|tracking|guessing|follow)[,.?]?$/i;
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const page = pages.find((p) => t >= p.start && t < p.end);
  const sc = scenes.find((s) => t >= s.start && t < s.end);
  if (!page) return null;
  const onCream = sc ? CUTAWAYS.has(sc.kind) : false;
  return (
    <div style={{position: 'absolute', top: onCream ? 1240 : 1352, width: 990, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 12px'}}>
      {page.words.map((w, i) => {
        const on = t >= w.start - 0.03;
        const key = KEY.test(w.text);
        return (
          <span
            key={i}
            style={{
              fontFamily: D,
              fontWeight: 600,
              fontSize: 58,
              color: key ? '#fff' : onCream ? R.ink : '#fff',
              background: key && on ? R.rust : 'transparent',
              padding: key ? '0 10px' : 0,
              borderRadius: 6,
              opacity: on ? 1 : 0.35,
              textShadow: onCream || key ? 'none' : '0 3px 14px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,0.6)',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const ProgressiveOverload: React.FC<{musicVolume: number}> = ({musicVolume}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: R.cream}}>
      <Footage />
      <Layers />
      <Captions />
      <Audio src={staticFile('v5/voice_edit.wav')} />
      <Audio src={staticFile('music/bgm.mp3')} loop volume={(f) => musicVolume * interpolate(f, [0, fps, durationInFrames - fps * 1.5, durationInFrames], [0.5, 1, 1, 0], cl)} />
      {data.sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} layout="none">
          <Audio src={staticFile(`sfx/${s.src}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
