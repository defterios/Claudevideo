import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT, COLORS, DISPLAY_FONT, FACE, SAFE, SAFE_CENTER_X} from '../theme';
import type {Overlay} from '../data/types';

/** Shared enter/exit envelope: spring in, quick ease out. */
const useEnvelope = (start: number, end: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = Math.round(start * fps);
  const e = Math.round(end * fps);
  const enter = spring({frame: frame - s, fps, config: {damping: 14, stiffness: 180, mass: 0.8}});
  const exit = interpolate(frame, [e - 7, e], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  return {enter, exit, local: frame - s, fps, frame};
};

const TOP_ZONE = {top: SAFE.top + 20, height: FACE.y1 - SAFE.top - 50}; // area above the head

const stroke = (px: number): React.CSSProperties => ({
  WebkitTextStroke: `${px}px #000`,
  paintOrder: 'stroke fill',
});

const Hook: React.FC<Extract<Overlay, {type: 'hook'}>> = ({start, end, line1, line2}) => {
  const {enter, exit, local, fps} = useEnvelope(start, end);
  const l2 = spring({frame: local - 8, fps, config: {damping: 11, stiffness: 200}});
  const shake = local < 18 && local > 8 ? Math.sin(local * 2.2) * (18 - local) * 0.6 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        width: SAFE.right - SAFE.left,
        top: TOP_ZONE.top,
        height: TOP_ZONE.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: exit,
      }}
    >
      <div
        style={{
          fontFamily: BODY_FONT,
          fontWeight: 900,
          fontSize: 52,
          color: COLORS.white,
          background: COLORS.red,
          padding: '8px 22px',
          borderRadius: 12,
          transform: `translateY(${interpolate(enter, [0, 1], [-60, 0])}px) rotate(-2deg)`,
          opacity: enter,
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        }}
      >
        {line1}
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: DISPLAY_FONT,
          fontSize: 118,
          lineHeight: 1,
          color: COLORS.accent,
          textAlign: 'center',
          ...stroke(14),
          textShadow: '0 12px 30px rgba(0,0,0,0.5)',
          transform: `scale(${interpolate(l2, [0, 1], [2.2, 1])}) translateX(${shake}px)`,
          opacity: interpolate(l2, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
        }}
      >
        {line2}
      </div>
    </div>
  );
};

const Title: React.FC<Extract<Overlay, {type: 'title'}>> = ({start, end, kicker, text, color}) => {
  const {enter, exit, local, fps} = useEnvelope(start, end);
  const bar = spring({frame: local - 4, fps, config: {damping: 20, stiffness: 120}});
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        width: SAFE.right - SAFE.left,
        top: TOP_ZONE.top,
        height: TOP_ZONE.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: exit,
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontFamily: BODY_FONT,
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: 6,
            color: COLORS.white,
            textTransform: 'uppercase',
            opacity: enter,
            ...stroke(6),
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: DISPLAY_FONT,
          fontSize: 96,
          lineHeight: 1.02,
          textAlign: 'center',
          color: color ?? COLORS.white,
          textTransform: 'uppercase',
          ...stroke(12),
          textShadow: '0 10px 30px rgba(0,0,0,0.45)',
          clipPath: `inset(0 ${(1 - enter) * 100}% 0 0)`,
        }}
      >
        {text}
      </div>
      <div style={{marginTop: 14, height: 10, width: 360 * bar, background: COLORS.accent, borderRadius: 6, boxShadow: '0 4px 14px rgba(0,0,0,0.4)'}} />
    </div>
  );
};

const Stat: React.FC<Extract<Overlay, {type: 'stat'}>> = ({start, end, from, to, prefix, suffix, label, color}) => {
  const {enter, exit, local, fps} = useEnvelope(start, end);
  const count = interpolate(local, [4, 4 + fps * 0.9], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const decimals = Number.isInteger(to) && Number.isInteger(from) ? 0 : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_CENTER_X - 300,
        width: 600,
        top: TOP_ZONE.top + 20,
        height: TOP_ZONE.height - 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.glass,
        border: '3px solid rgba(255,255,255,0.18)',
        borderRadius: 36,
        backdropFilter: 'blur(14px)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
        opacity: exit * enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.6, 1])})`,
      }}
    >
      <div style={{fontFamily: DISPLAY_FONT, fontSize: 150, lineHeight: 1, color: color ?? COLORS.accent}}>
        {prefix}
        {count.toFixed(decimals)}
        <span style={{fontSize: 80, marginLeft: 8}}>{suffix}</span>
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: BODY_FONT,
          fontWeight: 800,
          fontSize: 36,
          color: COLORS.white,
          textAlign: 'center',
          padding: '0 30px',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Small pill on the left of the face (x 60..360) — never crosses the head box. */
const Chip: React.FC<Extract<Overlay, {type: 'chip'}>> = ({start, end, emoji, text}) => {
  const {enter, exit, local} = useEnvelope(start, end);
  const bob = Math.sin(local / 9) * 4;
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        width: FACE.x1 - SAFE.left - 30,
        top: FACE.y1 + 120 + bob,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity: exit,
        transform: `translateX(${interpolate(enter, [0, 1], [-260, 0])}px) rotate(${interpolate(enter, [0, 1], [-14, -4])}deg)`,
      }}
    >
      <div style={{fontSize: 96, filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.45))'}}>{emoji}</div>
      <div
        style={{
          fontFamily: BODY_FONT,
          fontWeight: 900,
          fontSize: 34,
          color: COLORS.ink,
          background: COLORS.accent,
          padding: '8px 16px',
          borderRadius: 14,
          textAlign: 'center',
          textTransform: 'uppercase',
          boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Compare: React.FC<Extract<Overlay, {type: 'compare'}>> = ({start, end, leftLabel, leftValue, rightLabel, rightValue}) => {
  const {enter, exit, local, fps} = useEnvelope(start, end);
  const r = spring({frame: local - 10, fps, config: {damping: 14, stiffness: 160}});
  const Card = (p: {label: string; value: string; color: string; e: number; dir: number}) => (
    <div
      style={{
        flex: 1,
        background: COLORS.glass,
        borderRadius: 28,
        border: `4px solid ${p.color}`,
        padding: '20px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translateX(${interpolate(p.e, [0, 1], [p.dir * 200, 0])}px)`,
        opacity: p.e,
        boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{fontFamily: DISPLAY_FONT, fontSize: 104, color: p.color, lineHeight: 1}}>{p.value}</div>
      <div style={{fontFamily: BODY_FONT, fontWeight: 800, fontSize: 32, color: COLORS.white, textTransform: 'uppercase', textAlign: 'center', marginTop: 6}}>
        {p.label}
      </div>
    </div>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left + 10,
        width: SAFE.right - SAFE.left - 20,
        top: TOP_ZONE.top + 30,
        height: TOP_ZONE.height - 60,
        display: 'flex',
        gap: 24,
        alignItems: 'center',
        opacity: exit,
      }}
    >
      <Card label={leftLabel} value={leftValue} color={COLORS.green} e={enter} dir={-1} />
      <div style={{fontFamily: DISPLAY_FONT, fontSize: 60, color: COLORS.white, ...stroke(8), opacity: r}}>VS</div>
      <Card label={rightLabel} value={rightValue} color={COLORS.red} e={r} dir={1} />
    </div>
  );
};

const Step: React.FC<Extract<Overlay, {type: 'step'}>> = ({start, end, n, text, total}) => {
  const {enter, exit, local, fps} = useEnvelope(start, end);
  const t = spring({frame: local - 6, fps, config: {damping: 16, stiffness: 140}});
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        width: SAFE.right - SAFE.left,
        top: TOP_ZONE.top + 30,
        height: TOP_ZONE.height - 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
        opacity: exit,
      }}
    >
      <div
        style={{
          width: 190,
          height: 190,
          borderRadius: 999,
          background: COLORS.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: DISPLAY_FONT,
          fontSize: 130,
          color: COLORS.ink,
          transform: `scale(${enter}) rotate(${interpolate(enter, [0, 1], [-180, 0])}deg)`,
          boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', maxWidth: 560}}>
        <div style={{fontFamily: BODY_FONT, fontWeight: 800, fontSize: 30, color: COLORS.white, letterSpacing: 4, opacity: t, ...stroke(5)}}>
          STEP {n}/{total}
        </div>
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 76,
            lineHeight: 1.02,
            color: COLORS.white,
            textTransform: 'uppercase',
            ...stroke(10),
            clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

const Cta: React.FC<Extract<Overlay, {type: 'cta'}>> = ({start, end, text, sub}) => {
  const {enter, exit, local} = useEnvelope(start, end);
  const pulse = 1 + Math.sin(local / 5) * 0.03;
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_CENTER_X - 400,
        width: 800,
        top: SAFE.bottom - 270,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: exit * enter,
        transform: `translateY(${interpolate(enter, [0, 1], [120, 0])}px) scale(${pulse})`,
      }}
    >
      <div
        style={{
          fontFamily: BODY_FONT,
          fontWeight: 900,
          fontSize: 62,
          color: COLORS.white,
          background: COLORS.red,
          padding: '18px 40px',
          borderRadius: 999,
          textTransform: 'uppercase',
          boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
        }}
      >
        {text}
      </div>
      <div style={{marginTop: 14, fontFamily: BODY_FONT, fontWeight: 800, fontSize: 38, color: COLORS.white, ...stroke(7)}}>{sub}</div>
    </div>
  );
};

export const Overlays: React.FC<{items: Overlay[]}> = ({items}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {items
        .filter((o) => t >= o.start - 0.05 && t < o.end)
        .map((o, i) => {
          switch (o.type) {
            case 'hook':
              return <Hook key={i} {...o} />;
            case 'title':
              return <Title key={i} {...o} />;
            case 'stat':
              return <Stat key={i} {...o} />;
            case 'chip':
              return <Chip key={i} {...o} />;
            case 'compare':
              return <Compare key={i} {...o} />;
            case 'step':
              return <Step key={i} {...o} />;
            case 'cta':
              return <Cta key={i} {...o} />;
          }
        })}
    </AbsoluteFill>
  );
};
