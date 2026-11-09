import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {tone} from './Kinetic';

type SP = {local: number; fps: number; beats: number[]; props: Record<string, any>; exit: number};

const ease = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const Label: React.FC<{text: string; color?: string; size?: number; p: number; style?: React.CSSProperties}> = ({text, color, size = 38, p, style}) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: size > 50 ? -2 : 1,
      textTransform: 'uppercase',
      color: color ?? C.white,
      opacity: p,
      filter: `blur(${(1 - p) * 10}px)`,
      transform: `translateY(${(1 - p) * 16}px)`,
      ...style,
    }}
  >
    {text}
  </div>
);

/* ---------- cards (versus / can't inject / playbook) ---------- */
const Icon: React.FC<{kind: string; color: string}> = ({kind, color}) => (
  <div
    style={{
      width: 92,
      height: 92,
      borderRadius: 999,
      background: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: kind.length > 1 ? 40 : 58,
      boxShadow: `0 8px 24px ${color}66`,
    }}
  >
    {kind === 'check' ? '✓' : kind === 'x' ? '✕' : kind}
  </div>
);

const Cards: React.FC<SP> = ({local, fps, beats, props}) => {
  const cards: {icon: string; label: string; sub?: string; color: Tone}[] = props.cards;
  const head = ease(local, 0.05, 0.4);
  const active: number | undefined = props.active;
  return (
    <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Label text={props.heading} p={head} size={36} color="rgba(255,255,255,0.85)" style={{marginBottom: 26}} />
      <div style={{display: 'flex', gap: 26, justifyContent: 'center'}}>
        {cards.map((c, i) => {
          const at = beats[i] ?? 0.25 + i * 0.35;
          const s = spring({frame: Math.round((local - at) * fps), fps, config: {damping: 13, stiffness: 150}});
          const dim = active !== undefined && active !== i;
          return (
            <div
              key={i}
              style={{
                width: cards.length > 2 ? 250 : 340,
                height: 300,
                borderRadius: 26,
                background: C.card,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
                padding: 14,
                boxShadow: '0 30px 60px rgba(0,0,0,0.55)',
                opacity: Math.min(1, s * 1.4) * (dim ? 0.35 : 1),
                transform: `perspective(900px) rotateY(${(1 - s) * -70}deg) translateY(${(1 - s) * 60}px) scale(${active === i ? 1.06 : 1})`,
              }}
            >
              <Icon kind={c.icon} color={tone(c.color)} />
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: c.label.length > 9 ? 34 : 44, color: '#111', textAlign: 'center', lineHeight: 1, letterSpacing: -1, textTransform: 'uppercase'}}>
                {c.label}
              </div>
              {c.sub ? (
                <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 26, color: '#666', textAlign: 'center'}}>{c.sub}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
type Tone = 'white' | 'red' | 'cyan' | 'gold' | 'green';

/* ---------- receptors (mechanism) ---------- */
const Receptors: React.FC<SP> = ({local, beats, props}) => {
  const lit: string[] = props.lit;
  const all = ['GLP-1', 'GIP'];
  const pill = ease(local, 0.05, 0.4);
  const result = ease(local, beats[0] ?? 1.5, (beats[0] ?? 1.5) + 0.4);
  return (
    <div style={{width: '100%', height: '100%', position: 'relative'}}>
      <Label text={props.drug} p={pill} size={64} color={C.cyan} style={{position: 'absolute', left: 30, top: 20}} />
      <Label text={props.sub} p={pill} size={28} color="rgba(255,255,255,0.7)" style={{position: 'absolute', left: 34, top: 92}} />
      <svg width={STAGE.w} height={STAGE.h} style={{position: 'absolute', inset: 0}}>
        {all.map((r, i) => {
          const on = lit.includes(r);
          const p = ease(local, 0.35 + i * 0.25, 0.75 + i * 0.25);
          const y = 210 + i * 130;
          const glow = on ? 0.6 + 0.4 * Math.sin(local * 6 + i) : 0;
          return (
            <g key={r} opacity={p}>
              <line x1={150} y1={180} x2={150 + 260 * p} y2={y} stroke={on ? C.cyan : '#3a4170'} strokeWidth={6} strokeDasharray={on ? '0' : '10 10'} />
              <circle cx={430} cy={y} r={52} fill={on ? C.cyan : '#1f2547'} stroke={on ? '#fff' : '#3a4170'} strokeWidth={4} opacity={1} style={{filter: on ? `drop-shadow(0 0 ${20 * glow}px ${C.cyan})` : 'none'}} />
              <text x={430} y={y + 10} textAnchor="middle" fontFamily="Inter Tight" fontWeight={900} fontSize={28} fill={on ? '#06122a' : '#7a82b5'}>
                {r}
              </text>
              {on ? <line x1={482} y1={y} x2={482 + 120 * result} y2={260} stroke={C.cyan} strokeWidth={6} /> : null}
            </g>
          );
        })}
        <circle cx={150} cy={180} r={26} fill={C.white} opacity={pill} />
      </svg>
      <div style={{position: 'absolute', left: 620, top: 205, width: 260}}>
        <Label text={props.result} p={result} size={48} color={tone(props.resultColor ?? 'gold')} style={{lineHeight: 1}} />
      </div>
    </div>
  );
};

/* ---------- weight bar (fat vs muscle) ---------- */
const WeightBar: React.FC<SP> = ({local, beats, props}) => {
  const fill = ease(local, 0.3, 1.2);
  const split = interpolate(local, [beats[0] ?? 1.4, (beats[0] ?? 1.4) + 1.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const musclePct = interpolate(split, [0, 1], [0, 40]);
  const showRange = ease(local, (beats[0] ?? 1.4) + 1.2, (beats[0] ?? 1.4) + 1.6);
  const W = 780;
  return (
    <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20}}>
      <Label text={props.heading} p={ease(local, 0, 0.4)} size={36} color="rgba(255,255,255,0.85)" />
      <div style={{position: 'relative', width: W, height: 120, marginTop: 40, borderRadius: 24, background: '#1c2246', overflow: 'hidden', boxShadow: 'inset 0 0 0 3px #2c3466'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: W * fill, background: `linear-gradient(90deg, ${C.gold}, #ffdd7a)`}} />
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: (W * musclePct) / 100, background: `linear-gradient(90deg, ${C.red}, #ff6b88)`}} />
        <div style={{position: 'absolute', left: 28, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#1a1300', opacity: fill}}>FAT</div>
        <div style={{position: 'absolute', right: 24, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff', opacity: split}}>MUSCLE</div>
      </div>
      <div style={{width: W, display: 'flex', justifyContent: 'flex-end', marginTop: 18}}>
        <Label text={`up to ${Math.round(musclePct)}%`} p={split} size={84} color={C.red} />
      </div>
      <Label text={props.foot} p={showRange} size={30} color="rgba(255,255,255,0.75)" style={{alignSelf: 'flex-end', marginRight: 46}} />
    </div>
  );
};

/* ---------- 10 kg blocks, 3-4 turn red ---------- */
const Blocks: React.FC<SP> = ({local, fps, beats}) => {
  const turn = beats[0] ?? 2;
  return (
    <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{display: 'flex', gap: 30, alignItems: 'baseline', marginBottom: 26}}>
        <Label text="10 kg lost" p={ease(local, 0, 0.4)} size={64} />
        <Label text="→ 3–4 kg muscle" p={ease(local, turn, turn + 0.4)} size={44} color={C.red} />
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 120px)', gap: 22}}>
        {Array.from({length: 10}).map((_, i) => {
          const s = spring({frame: Math.round((local - 0.2 - i * 0.07) * fps), fps, config: {damping: 12, stiffness: 180}});
          const red = i >= 6;
          const r = red ? ease(local, turn + (i - 6) * 0.12, turn + 0.25 + (i - 6) * 0.12) : 0;
          const half = i === 6;
          return (
            <div
              key={i}
              style={{
                height: 120,
                borderRadius: 22,
                background: r > 0 ? `linear-gradient(${C.red}, #c4163a)` : 'linear-gradient(#2d3566, #1c2246)',
                opacity: s * (half && r > 0 ? 0.6 : 1),
                transform: `translateY(${(1 - s) * -80}px) scale(${1 + r * 0.06 - r * 0.06 * (local > turn + 0.6 ? 1 : 0)})`,
                boxShadow: r > 0 ? `0 0 30px ${C.red}88` : '0 10px 20px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 34,
                color: r > 0 ? '#fff' : '#7a82b5',
              }}
            >
              1kg
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- gears: the metabolic engine ---------- */
const gearPath = (r: number, teeth: number, depth: number) => {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 4; i++) {
    const a = (i / (teeth * 4)) * Math.PI * 2;
    const rr = i % 4 < 2 ? r : r - depth;
    pts.push(`${Math.cos(a) * rr},${Math.sin(a) * rr}`);
  }
  return `M${pts.join('L')}Z`;
};
const Gear: React.FC<{x: number; y: number; r: number; teeth: number; angle: number; fill: string; dark: string}> = ({x, y, r, teeth, angle, fill, dark}) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d={gearPath(r, teeth, r * 0.16)} fill={fill} stroke={dark} strokeWidth={3} />
    <circle r={r * 0.62} fill={dark} opacity={0.35} />
    <circle r={r * 0.5} fill={fill} />
    <circle r={r * 0.16} fill={dark} />
  </g>
);
const Gears: React.FC<SP> = ({local, beats, props}) => {
  const slowAt = beats[0] ?? 2.5;
  // angular position: full speed, then decays toward a stall
  const speed = 70; // deg/s
  const pos = local < slowAt ? local * speed : slowAt * speed + (speed / 1.4) * (1 - Math.exp(-1.4 * (local - slowAt)));
  const slow = ease(local, slowAt, slowAt + 0.5);
  const tint = interpolate(slow, [0, 1], [0, 1]);
  return (
    <div style={{width: '100%', height: '100%', position: 'relative'}}>
      <svg width={STAGE.w} height={STAGE.h} style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}}>
        <Gear x={170} y={250} r={140} teeth={14} angle={pos} fill={C.gold} dark="#7a5a10" />
        <Gear x={365} y={330} r={88} teeth={10} angle={-pos * 1.59 + 9} fill="#b8bcc8" dark="#4a4e5a" />
        <Gear x={330} y={110} r={56} teeth={8} angle={-pos * 2.5} fill={tint > 0.5 ? '#c4163a' : '#b8bcc8'} dark="#4a4e5a" />
      </svg>
      <div style={{position: 'absolute', right: 20, top: 60, textAlign: 'right'}}>
        <Label text={props.kicker} p={ease(local, 0.1, 0.5)} size={30} color="rgba(255,255,255,0.8)" />
        <Label text={props.title} p={ease(local, 0.25, 0.65)} size={60} style={{lineHeight: 0.95}} />
        <Label text={props.after} p={slow} size={60} color={C.red} style={{lineHeight: 0.95}} />
      </div>
    </div>
  );
};

/* ---------- gauge (protein target / oil) ---------- */
const Gauge: React.FC<SP> = ({local, beats, props}) => {
  const {min, max, from, to, unit, title, kicker, band, color} = props as {
    min: number; max: number; from: number; to: number; unit: string; title: string; kicker: string; band?: [number, number]; color: Tone;
  };
  const moveAt = beats[0] ?? 0.4;
  const v = interpolate(local, [moveAt, moveAt + 1.1], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const ang = (x: number) => Math.PI + ((x - min) / (max - min)) * Math.PI;
  const R = 190, cx = 250, cy = 290;
  const arc = (a0: number, a1: number) =>
    `M${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)}`;
  const a = ang(v);
  const blink = color === 'red' && v <= min + (max - min) * 0.1 ? (Math.floor(local * 4) % 2 === 0 ? 1 : 0.25) : 1;
  const appear = ease(local, 0, 0.4);
  return (
    <div style={{width: '100%', height: '100%', position: 'relative', opacity: appear}}>
      <svg width={STAGE.w} height={STAGE.h} style={{position: 'absolute', inset: 0}}>
        <path d={arc(Math.PI, 2 * Math.PI)} stroke="#2c3466" strokeWidth={34} fill="none" strokeLinecap="round" />
        {band ? <path d={arc(ang(band[0]), ang(band[1]))} stroke={C.green} strokeWidth={34} fill="none" /> : null}
        {Array.from({length: 11}).map((_, i) => {
          const t = Math.PI + (i / 10) * Math.PI;
          return <line key={i} x1={cx + (R - 40) * Math.cos(t)} y1={cy + (R - 40) * Math.sin(t)} x2={cx + (R - 58) * Math.cos(t)} y2={cy + (R - 58) * Math.sin(t)} stroke="#7a82b5" strokeWidth={4} />;
        })}
        <line x1={cx} y1={cy} x2={cx + (R - 30) * Math.cos(a)} y2={cy + (R - 30) * Math.sin(a)} stroke={tone(color)} strokeWidth={10} strokeLinecap="round" opacity={blink} />
        <circle cx={cx} cy={cy} r={22} fill={tone(color)} />
        <text x={cx - R} y={cy + 50} textAnchor="middle" fontFamily="Inter Tight" fontWeight={800} fontSize={28} fill="#7a82b5">{props.minLabel ?? min}</text>
        <text x={cx + R} y={cy + 50} textAnchor="middle" fontFamily="Inter Tight" fontWeight={800} fontSize={28} fill="#7a82b5">{props.maxLabel ?? max}</text>
      </svg>
      <div style={{position: 'absolute', left: 500, top: 70, width: 360}}>
        <Label text={kicker} p={ease(local, 0.1, 0.5)} size={30} color="rgba(255,255,255,0.8)" />
        <Label text={title} p={ease(local, 0.25, 0.65)} size={74} color={tone(color)} style={{lineHeight: 0.95}} />
        <Label text={unit} p={ease(local, 0.4, 0.8)} size={36} style={{marginTop: 8, opacity: blink}} />
      </div>
    </div>
  );
};

const REGISTRY: Record<string, React.FC<SP>> = {cards: Cards, receptors: Receptors, weightbar: WeightBar, blocks: Blocks, gears: Gears, gauge: Gauge};

export const Scene: React.FC<{scene: string; props: Record<string, any>; beats: number[]; start: number; end: number}> = ({scene, props, beats, start, end}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame / fps - start;
  const exit = interpolate(end - frame / fps, [0, 0.25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const Comp = REGISTRY[scene];
  return (
    <div
      style={{
        position: 'absolute',
        left: STAGE.x,
        top: STAGE.y,
        width: STAGE.w,
        height: STAGE.h,
        opacity: exit,
        filter: `blur(${(1 - exit) * 14}px)`,
      }}
    >
      <Comp local={local} fps={fps} beats={beats} props={props} exit={exit} />
    </div>
  );
};
