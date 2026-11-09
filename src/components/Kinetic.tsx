import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FACE, FONT, SAFE} from '../theme';
import type {KLine, Tone} from '../data/types';

export const tone = (c?: Tone) => (c ? C[c] : C.white);

const SIZE = {sm: 40, lg: 104, xl: 168};
const WEIGHT = {sm: 700, lg: 900, xl: 900};

/** Blur-reveal word by word, blur-out on exit — the reference's kinetic type. */
export const KineticBlock: React.FC<{lines: KLine[]; start: number; end: number; align?: 'left' | 'center'}> = ({
  lines,
  start,
  end,
  align = 'left',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - start * fps;
  const outLocal = end * fps - frame;
  const exit = interpolate(outLocal, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  let wi = 0;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-start' : 'center'}}>
      {lines.map((ln, li) => (
        <div
          key={li}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: align === 'left' ? 'flex-start' : 'center',
            gap: `0 ${SIZE[ln.s] * 0.24}px`,
            fontFamily: FONT,
            fontWeight: WEIGHT[ln.s],
            fontSize: SIZE[ln.s],
            lineHeight: ln.s === 'sm' ? 1.2 : 0.95,
            letterSpacing: ln.s === 'sm' ? 1 : -3,
            textTransform: 'uppercase',
            color: tone(ln.c),
            marginBottom: ln.s === 'sm' ? 6 : 2,
            textShadow: '0 6px 30px rgba(0,0,0,0.55)',
          }}
        >
          {ln.t.split(' ').map((w, i) => {
            const d = (wi++) * 3;
            const p = interpolate(local - d, [0, 9], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });
            const o = p * exit;
            const blur = (1 - p) * 16 + (1 - exit) * 18;
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: o,
                  filter: `blur(${blur}px)`,
                  transform: `translateY(${(1 - p) * 34}px) scale(${1 + (1 - exit) * 0.08})`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Kinetic text in the negative space above the head. */
export const Kinetic: React.FC<{lines: KLine[]; start: number; end: number}> = (p) => (
  <div
    style={{
      position: 'absolute',
      left: SAFE.left + 24,
      width: SAFE.right - SAFE.left - 40,
      top: SAFE.top + 10,
      height: FACE.y1 - SAFE.top - 30,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }}
  >
    <KineticBlock {...p} />
  </div>
);
