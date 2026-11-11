import React from 'react';
import {Composition} from 'remotion';
import {Main, MAIN_DURATION_SEC} from './Main';
import {FPS, HEIGHT, WIDTH} from './theme';
import {OzVsMj, V2_DURATION} from './v2/OzVsMj';
import {OzVsMjV3, V3_DURATION} from './v3/OzVsMjV3';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Preview uses the 720p keyframe-dense proxy; final render swaps to the original via --props */}
    <Composition
      id="Main"
      component={Main}
      durationInFrames={Math.ceil(MAIN_DURATION_SEC * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{videoSrc: 'src/proxy.mp4', musicVolume: 0.085}}
    />
    {/* Video 2: Ozempic vs Mounjaro — trainer's POV (opening clip + voice-over) */}
    <Composition id="OzVsMj" component={OzVsMj} durationInFrames={Math.ceil(V2_DURATION * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{musicVolume: 0.075}} />
    {/* Video 2, v3 edit: slate / floating media cards reference */}
    <Composition id="OzVsMjV3" component={OzVsMjV3} durationInFrames={Math.ceil(V3_DURATION * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{musicVolume: 0.075}} />
  </>
);
