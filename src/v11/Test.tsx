import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AnimeHead, Hand, Wheat} from './anime';
export const AnimeTest: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(#3a2a5a, #e0884a)'}}>
    <svg width={1920} height={1080}>
      <g transform="translate(260 330) scale(1)"><AnimeHead who="jesus" eyes="open" mouth="flat" look={[0.4, 0]} /></g>
      <g transform="translate(700 330) scale(1)"><AnimeHead who="man" eyes="wide" mouth="open" brow={-0.6} light={1} /></g>
      <g transform="translate(1140 330) scale(1)"><AnimeHead who="pharisee" eyes="narrow" mouth="frown" brow={1} night={0.6} /></g>
      <g transform="translate(1560 330) scale(1)"><AnimeHead who="jesus" eyes="narrow" mouth="grit" brow={1} tear={0.7} light={1} rim="#B88CFF" night={0.4} /></g>
      <g transform="translate(400 1000) scale(1.4)"><Hand withered={1} /></g>
      <g transform="translate(800 1000) scale(1.4)"><Hand withered={0} /></g>
      {Array.from({length: 12}).map((_, i) => <Wheat key={i} x={1100 + i * 60} y={1080} h={260 + (i % 3) * 40} t={0.3} />)}
    </svg>
  </AbsoluteFill>
);
