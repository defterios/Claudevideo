import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {POSES, Stick, Face} from './stick';

export const RigTest: React.FC = () => {
  const f = useCurrentFrame();
  const names = Object.keys(POSES);
  const faces: Face[] = ['happy', 'neutral', 'scared', 'pain', 'tired', 'grin', 'shock', 'determined', 'nervous'];
  return (
    <AbsoluteFill style={{background: '#F3E9D2'}}>
      <svg width={1920} height={1080}>
        {names.map((n, i) => (
          <g key={n}>
            <Stick x={130 + (i % 8) * 230} y={420 + Math.floor(i / 8) * 480} pose={POSES[n]} face={faces[i % faces.length]} scale={0.95} gear={{headband: '#D7262E', sweat: i % 3 === 0 ? 1 : 0, mic: n === 'mic', bulky: n === 'flex', whistle: n === 'arms', cap: n === 'arms' ? '#555' : undefined}} t={f / 30} />
            <text x={130 + (i % 8) * 230} y={460 + Math.floor(i / 8) * 480} textAnchor="middle" fontSize={28} fontFamily="sans-serif">{n}</text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
