import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '../v2/theme';
import {SlateBg} from '../v3/ui';
import {Tubs3D} from './Tub3D';

export const TubTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SlateBg />
      <Tubs3D width={1080} height={1200} items={[
        {variant: 'concentrate', x: -2.3, rotY: 0.35, scale: 0.9},
        {variant: 'isolate', x: 0, rotY: 0},
        {variant: 'hydro', x: 2.3, rotY: -0.35, scale: 0.9},
      ]} camZ={11} />
    </AbsoluteFill>
  );
};
