import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import {CX, Card, Chip, Heavy, K, MONO, Photo, SANS, SlateBg, cl, ease, pop} from './ui';

export type SP = {local: number; dur: number; beats: number[]; props: Record<string, any>};

/* ---------- section marker: "#1  THE SCIENCE" ---------- */
const Section: React.FC<SP> = ({local, props}) => {
  const words: string[] = props.title.split(' ');
  return (
    <AbsoluteFill>
      <SlateBg />
      <div style={{position: 'absolute', top: 470, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: K.green, opacity: ease(local, 0, 0.3)}}>#{props.n}</div>
        <div style={{width: 110, height: 110, borderRadius: 28, background: '#11161C', border: `1.5px solid ${K.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(local, 0.05)})`, boxShadow: '0 20px 50px rgba(0,0,0,0.45)'}}>
          <div style={{width: 46, height: 46, borderRadius: 12, background: K.green, transform: 'rotate(45deg)'}} />
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 26px', maxWidth: 880}}>
          {words.map((w, i) => (
            <Heavy key={i} text={w} size={118} p={ease(local, 0.15 + i * 0.08, 0.5 + i * 0.08)} color={w === props.accent ? K.yellow : K.white} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- photo card + chips under it ---------- */
const MediaCard: React.FC<SP> = ({local, dur, props}) => {
  const chips: [string, any][] = props.chips;
  return (
    <AbsoluteFill>
      <SlateBg />
      {props.tag ? <div style={{position: 'absolute', top: 250, width: 990, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 38, color: K.green, opacity: ease(local, 0, 0.3)}}>{props.tag}</div> : null}
      <Card local={local} style={{left: CX - 410, top: 310, width: 820, height: 640}}>
        <Photo img={props.img} local={local} dur={dur} zoom={props.zoom} />
      </Card>
      <div style={{position: 'absolute', top: 985, width: 990, display: 'flex', justifyContent: 'center', gap: 14}}>
        {chips.map(([t, tone], i) => (
          <Chip key={i} text={t} tone={tone} p={pop(local, 0.35 + i * 0.22)} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- code window (typed) ---------- */
const Code: React.FC<SP> = ({local, beats, props}) => {
  const lines: string[] = props.lines;
  const total = lines.join('\n').length;
  const typed = Math.round(interpolate(local, [beats[0] ?? 0.3, (beats[0] ?? 0.3) + 1.1], [0, total], cl));
  const hl = ease(local, (beats[1] ?? 1.5) - 0.1, (beats[1] ?? 1.5) + 0.2);
  let used = 0;
  const color = (ln: string) => (ln.startsWith('//') ? '#6B7684' : K.white);
  return (
    <AbsoluteFill>
      <SlateBg />
      <Card local={local} style={{left: CX - 420, top: 400, width: 840, height: 520, background: '#161B21'}}>
        <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px', borderBottom: `1.5px solid ${K.line}`}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <span key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />
          ))}
          <span style={{marginLeft: 18, fontFamily: MONO, fontSize: 24, color: K.dim}}>{props.file}</span>
        </div>
        <div style={{padding: '30px 34px', fontFamily: MONO, fontSize: 38, lineHeight: 1.75}}>
          {lines.map((ln, i) => {
            const start = used;
            used += ln.length + 1;
            const vis = ln.slice(0, Math.max(0, Math.min(ln.length, typed - start)));
            const isHl = i === props.hl;
            const words = vis.split(/("[^"]*"?)/);
            return (
              <div key={i} style={{position: 'relative', whiteSpace: 'pre', color: color(ln)}}>
                {isHl ? <div style={{position: 'absolute', left: -14, right: -14, top: 4, bottom: 4, borderRadius: 8, background: `rgba(245,197,24,${0.18 * hl})`, border: `1.5px solid rgba(245,197,24,${0.6 * hl})`}} /> : null}
                <span style={{position: 'relative'}}>
                  {words.map((w, j) => (
                    <span key={j} style={{color: w.startsWith('"') ? K.green : undefined}}>{w}</span>
                  ))}
                  {typed > start && typed < start + ln.length + 1 && Math.floor(local * 3) % 2 === 0 ? <span style={{color: K.yellow}}>▍</span> : null}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
      <div style={{position: 'absolute', top: 960, width: 990, display: 'flex', justifyContent: 'center'}}>
        <Chip text={`MIMICS ${props.lines[3].match(/\d/)?.[0]} HORMONE${props.lines[3].includes('2') ? 'S' : ''}`} tone="yellow" p={hl} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- progress / timer chips ---------- */
const Progress: React.FC<SP> = ({local, dur, props}) => {
  const prog = interpolate(local, [0.3, Math.min(dur, 2.4)], [100, props.toPct], {...cl, easing: Easing.inOut(Easing.cubic)});
  const secs = Math.floor(interpolate(local, [0.3, dur], [0, 4 * 3600], cl));
  const hh = String(Math.floor(secs / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  return (
    <AbsoluteFill>
      <SlateBg />
      <Card local={local} style={{left: CX - 400, top: 430, width: 800, height: 330, padding: '44px 50px', boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: K.dim}}>{props.label}</span>
          <span style={{fontFamily: MONO, fontSize: 30, color: K.dim}}>{Math.round(prog)}%</span>
        </div>
        <div style={{marginTop: 30, height: 22, borderRadius: 11, background: '#11161C', overflow: 'hidden'}}>
          <div style={{width: `${prog}%`, height: '100%', borderRadius: 11, background: `linear-gradient(90deg, ${K.red}, #FF7A59)`}} />
        </div>
        <div style={{marginTop: 34, fontFamily: SANS, fontWeight: 900, fontSize: 84, color: K.white, letterSpacing: -2}}>Slows down</div>
      </Card>
      <div style={{position: 'absolute', top: 820, width: 990, display: 'flex', justifyContent: 'center', gap: 16}}>
        <Chip text={`${hh}:${mm}`} p={pop(local, 0.5)} dot={K.red} />
        <Chip text={props.timer} tone="blue" p={pop(local, 0.8)} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- big numbers (trial) ---------- */
const Numbers: React.FC<SP> = ({local, beats, props}) => {
  const items: {label: string; value: number}[] = props.items;
  const go = beats[0] ?? 0.8;
  return (
    <AbsoluteFill>
      <SlateBg />
      <div style={{position: 'absolute', top: 300, width: 990, textAlign: 'center'}}>
        <Chip text="CLINICAL TRIAL" p={pop(local, 0)} dot={K.green} />
      </div>
      {items.map((it, i) => {
        const p = interpolate(local, [go + i * 0.45, go + i * 0.45 + 1.1], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
        const win = i === 1;
        return (
          <Card key={i} local={local} at={0.1 + i * 0.15} style={{left: CX - 400, top: 400 + i * 300, width: 800, height: 260, padding: '30px 44px', boxSizing: 'border-box', border: win && p > 0.95 ? `2px solid ${K.yellow}` : undefined}}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: K.dim}}>{it.label}</div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 132, color: win ? K.yellow : K.white, letterSpacing: -4, lineHeight: 1.05}}>{(it.value * p).toFixed(1)}%</div>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: K.dim}}>body weight</div>
            </div>
            <div style={{position: 'absolute', left: 44, right: 44, bottom: 28, height: 10, borderRadius: 5, background: '#11161C'}}>
              <div style={{width: `${(it.value / 22) * 100 * p}%`, height: '100%', borderRadius: 5, background: win ? K.yellow : K.dim}} />
            </div>
          </Card>
        );
      })}
      <div style={{position: 'absolute', top: 1000, width: 990, textAlign: 'center', fontFamily: SANS, fontSize: 22, letterSpacing: 1.5, color: K.dim, opacity: ease(local, go, go + 0.5)}}>{props.note}</div>
    </AbsoluteFill>
  );
};

/* ---------- calorie deficit UI ---------- */
const Deficit: React.FC<SP> = ({local, beats, props}) => {
  const d = interpolate(local, [beats[0] - 1.6, beats[0]], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const kcal = Math.round((props.fromKcal + (props.toKcal - props.fromKcal) * d) / 10) * 10;
  const ok = pop(local, beats[1]);
  return (
    <AbsoluteFill>
      <SlateBg />
      <Card local={local} style={{left: CX - 400, top: 400, width: 800, height: 470, padding: '44px 50px', boxSizing: 'border-box'}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: K.dim}}>APPETITE</div>
        <div style={{marginTop: 22, height: 22, borderRadius: 11, background: '#11161C', position: 'relative'}}>
          <div style={{width: `${interpolate(d, [0, 1], [90, 30])}%`, height: '100%', borderRadius: 11, background: K.blue}} />
          <div style={{position: 'absolute', top: -9, left: `calc(${interpolate(d, [0, 1], [90, 30])}% - 20px)`, width: 40, height: 40, borderRadius: 20, background: K.white, boxShadow: '0 4px 12px rgba(0,0,0,0.4)'}} />
        </div>
        <div style={{marginTop: 44, fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: K.dim}}>CALORIES / DAY</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 150, color: K.white, letterSpacing: -5, lineHeight: 1.05}}>{kcal.toLocaleString('en-US')}</div>
      </Card>
      <div style={{position: 'absolute', top: 920, width: 990, display: 'flex', justifyContent: 'center'}}>
        <Chip text="CALORIE DEFICIT ✓" tone="blue" p={ok} size={36} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- photo + red X ---------- */
const MediaX: React.FC<SP> = ({local, dur, beats, props}) => {
  const x = ease(local, beats[0] - 0.05, beats[0] + 0.25);
  return (
    <AbsoluteFill>
      <SlateBg />
      <Card local={local} style={{left: CX - 360, top: 300, width: 720, height: 720}}>
        <Photo img={props.img} local={local} dur={dur} />
        <AbsoluteFill style={{background: `rgba(20,24,30,${0.45 * x})`}} />
      </Card>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g stroke={K.red} strokeWidth={42} strokeLinecap="round" style={{filter: 'drop-shadow(0 10px 30px rgba(255,59,59,0.5))'}}>
          <line x1={330} y1={500} x2={330 + 330 * Math.min(1, x * 2)} y2={500 + 330 * Math.min(1, x * 2)} />
          <line x1={660} y1={500} x2={660 - 330 * Math.max(0, x * 2 - 1)} y2={500 + 330 * Math.max(0, x * 2 - 1)} />
        </g>
      </svg>
      <div style={{position: 'absolute', top: 1050, width: 990, display: 'flex', justifyContent: 'center', gap: 14}}>
        <Chip text={props.caption} p={pop(local, 0.3)} />
        <Chip text="NO" tone="red" p={pop(local, beats[0])} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- fat vs muscle progress bars ---------- */
const Bars: React.FC<SP> = ({local, beats, props}) => {
  const f = ease(local, beats[0] - 0.4, beats[0] + 0.6);
  const m = ease(local, beats[1] - 0.2, beats[1] + 0.6);
  const Row = (p: {label: string; pct: number; color: string; v: number}) => (
    <div style={{marginTop: 34}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: K.dim}}>
        <span>{p.label}</span>
        <span style={{fontFamily: MONO, color: p.color}}>-{Math.round(p.pct * p.v)}%</span>
      </div>
      <div style={{marginTop: 14, height: 26, borderRadius: 13, background: '#11161C'}}>
        <div style={{width: `${p.pct * p.v}%`, height: '100%', borderRadius: 13, background: p.color}} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <SlateBg />
      <div style={{position: 'absolute', top: 300, width: 990, textAlign: 'center'}}>
        <Chip text={props.title} p={pop(local, 0)} dot={K.red} />
      </div>
      <Card local={local} at={0.1} style={{left: CX - 400, top: 420, width: 800, height: 420, padding: '20px 50px', boxSizing: 'border-box'}}>
        <Row label="FAT" pct={60} color={K.green} v={f} />
        <Row label="MUSCLE" pct={38} color={K.red} v={m} />
        <div style={{marginTop: 38, fontFamily: SANS, fontWeight: 900, fontSize: 64, color: K.white, opacity: m}}>
          not just <span style={{color: K.yellow}}>fat.</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/* ---------- big heavy text ---------- */
const BigText: React.FC<SP> = ({local, beats, props}) => {
  const big: string[] = props.big;
  const strike = props.strikeIdx !== undefined ? ease(local, beats[0], beats[0] + 0.3) : 0;
  return (
    <AbsoluteFill>
      <SlateBg />
      <div style={{position: 'absolute', top: 430, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 48, color: K.dim, opacity: ease(local, 0, 0.3)}}>{props.small}</div>
        {big.map((b, i) => {
          const at = i === props.accentIdx && beats[0] !== undefined ? beats[0] - 0.1 : 0.12 + i * 0.15;
          const isStrike = i === props.strikeIdx;
          return (
            <div key={i} style={{position: 'relative', marginTop: 10}}>
              <Heavy text={b} size={b.length > 9 ? 104 : 160} p={ease(local, at, at + 0.35)} color={i === props.accentIdx ? K.yellow : isStrike ? (strike > 0.5 ? K.dim : K.white) : K.white} />
              {isStrike ? <div style={{position: 'absolute', left: -10, top: '48%', height: 12, width: `${strike * 104}%`, background: K.red, borderRadius: 6}} /> : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- metabolism crash (terminal-style chart) ---------- */
const Crash: React.FC<SP> = ({local, beats, props}) => {
  const c = interpolate(local, [beats[0] - 0.1, beats[0] + 0.35], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
  const draw = ease(local, 0.1, 0.7);
  const pts = Array.from({length: 40}).map((_, i) => {
    const x = 50 + (i / 39) * 700;
    const base = 120 + Math.sin(i * 0.8) * 8;
    return [x, i < 26 ? base : base + (((i - 26) / 13) ** 1.5) * 260 * c];
  });
  const shown = c > 0 ? pts : pts.slice(0, Math.max(2, Math.round(26 * draw)));
  const shake = c > 0 && c < 1 ? Math.sin(local * 80) * 8 * (1 - c) : 0;
  return (
    <AbsoluteFill>
      <SlateBg />
      <Card local={local} style={{left: CX - 400 + shake, top: 400, width: 800, height: 520, background: '#161B21'}}>
        <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px', borderBottom: `1.5px solid ${K.line}`}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((x) => (
            <span key={x} style={{width: 18, height: 18, borderRadius: 9, background: x}} />
          ))}
          <span style={{marginLeft: 18, fontFamily: MONO, fontSize: 24, color: K.dim}}>{props.label}</span>
        </div>
        <svg width={800} height={456}>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={50} x2={750} y1={60 + i * 100} y2={60 + i * 100} stroke={K.line} strokeWidth={2} />
          ))}
          <polyline points={shown.map((p) => p.join(',')).join(' ')} fill="none" stroke={c > 0.3 ? K.red : K.green} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Card>
      <div style={{position: 'absolute', top: 970, width: 990, display: 'flex', justifyContent: 'center'}}>
        <Chip text={c > 0.5 ? 'METABOLISM CRASH' : 'METABOLISM'} tone={c > 0.5 ? 'red' : 'dim'} p={pop(local, 0.2)} dot={c > 0.5 ? '#fff' : K.green} size={34} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- cards popping into place ---------- */
const PopCards: React.FC<SP> = ({local, dur, beats, props}) => {
  const cards: {img: string; label: string}[] = props.cards;
  return (
    <AbsoluteFill>
      <SlateBg />
      <div style={{position: 'absolute', top: 290, width: 990, textAlign: 'center'}}>
        <Heavy text="YOU MUST" size={70} p={ease(local, 0, 0.3)} color={K.dim} />
      </div>
      {cards.map((c, i) => (
        <React.Fragment key={i}>
          <Card local={local} at={beats[i] - 0.15} tilt={(i - 1) * 4} style={{left: CX - 405 + i * 280, top: 430 + Math.abs(i - 1) * 30, width: 250, height: 420}}>
            <Photo img={c.img} local={local} dur={dur} />
          </Card>
          <div style={{position: 'absolute', left: CX - 405 + i * 280, width: 250, top: 890, display: 'flex', justifyContent: 'center'}}>
            <Chip text={`✓ ${c.label}`} tone="green" p={pop(local, beats[i])} size={26} />
          </div>
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- comment bar CTA (like the reference's search bar ending) ---------- */
const CommentBar: React.FC<SP> = ({local, beats, props}) => {
  const text: string = props.text;
  const typed = Math.round(interpolate(local, [beats[0], beats[0] + 1.0], [0, text.length], cl));
  const sent = pop(local, beats[1]);
  const icons = ['💪', '🥩', '🏋️', '💉', '💬'];
  return (
    <AbsoluteFill>
      <SlateBg />
      <div style={{position: 'absolute', top: 330, width: 990, textAlign: 'center'}}>
        <Heavy text="Let me know in the" size={56} color={K.dim} p={ease(local, 0, 0.3)} />
        <Heavy text="COMMENTS" size={150} color={K.yellow} p={ease(local, 0.1, 0.45)} />
      </div>
      <Card local={local} at={0.15} style={{left: CX - 420, top: 700, width: 840, height: 130, borderRadius: 999, display: 'flex', alignItems: 'center', padding: '0 24px 0 50px', boxSizing: 'border-box'}}>
        <div style={{flex: 1, fontFamily: SANS, fontWeight: 900, fontSize: 60, color: K.white, letterSpacing: -1}}>
          {text.slice(0, typed)}
          {typed < text.length && Math.floor(local * 3) % 2 === 0 ? <span style={{color: K.dim}}>|</span> : null}
        </div>
        <div style={{width: 86, height: 86, borderRadius: 43, background: typed >= text.length ? K.green : '#3A424D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46, color: '#0E1A12', fontWeight: 900, fontFamily: SANS, transform: `scale(${1 + 0.15 * Math.sin(Math.min(1, sent) * Math.PI)})`}}>↑</div>
      </Card>
      <div style={{position: 'absolute', top: 880, width: 990, display: 'flex', justifyContent: 'center', gap: 22}}>
        {icons.map((ic, i) => {
          const p = pop(local, beats[1] + i * 0.08);
          return (
            <div key={i} style={{width: 120, height: 120, borderRadius: 30, background: K.card, border: `1.5px solid ${K.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 62, boxShadow: '0 16px 40px rgba(0,0,0,0.45)', opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.8 + 0.2 * p})`}}>
              {ic}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const REGISTRY: Record<string, React.FC<SP>> = {
  section: Section,
  mediaCard: MediaCard,
  code: Code,
  progress: Progress,
  numbers: Numbers,
  deficit: Deficit,
  mediaX: MediaX,
  bars: Bars,
  bigText: BigText,
  crash: Crash,
  popCards: PopCards,
  commentBar: CommentBar,
};
export {Img, staticFile};
