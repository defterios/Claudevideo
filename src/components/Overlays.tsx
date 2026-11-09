import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE, SAFE_CENTER_X} from '../theme';
import type {Overlay} from '../data/types';
import {Kinetic, KineticBlock} from './Kinetic';
import {Scene} from './Scenes';

const Cta: React.FC<Extract<Overlay, {type: 'cta'}>> = ({start, end, text, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame / fps - start, [0.2, 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: SAFE_CENTER_X - 420, width: 840, top: SAFE.bottom - 330, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <KineticBlock lines={[{t: text, s: 'lg'}]} start={start} end={end} align="center" />
      <div
        style={{
          marginTop: 18,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 2,
          color: '#111',
          background: C.white,
          padding: '12px 28px',
          borderRadius: 999,
          textTransform: 'uppercase',
          opacity: p,
          transform: `translateY(${(1 - p) * 20}px)`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
        }}
      >
        {sub}
      </div>
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
            case 'kinetic':
              return <Kinetic key={i} lines={o.lines} start={o.start} end={o.end} />;
            case 'scene':
              return <Scene key={i} {...o} />;
            case 'cta':
              return <Cta key={i} {...o} />;
          }
        })}
    </AbsoluteFill>
  );
};
