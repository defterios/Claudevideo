import React from 'react';
import {Composition} from 'remotion';
import {Main, MAIN_DURATION_SEC} from './Main';
import {FPS, HEIGHT, WIDTH} from './theme';
import {OzVsMj, V2_DURATION} from './v2/OzVsMj';
import {OzVsMjV3, V3_DURATION} from './v3/OzVsMjV3';
import {TubTest} from './v4/TubTest';
import {WheyV4, V4_DURATION} from './v4/WheyV4';
import {ProgressiveOverload, PO_DURATION} from './v5/PO';
import {PoCover} from './v5/Cover';
import {RigTest} from './v6/RigTest';
import {WweLong, WweShort, WWE_LONG_DUR, WWE_SHORT_DUR} from './v6/Wwe';
import {Test3D} from './v7/Test3D';
import {MuayStyle} from './v7/Style';
import {MuayLong, MuayTall, MuayShort, MUAY_LONG_DUR, MUAY_SHORT_DUR} from './v7/Muay';
import {MuayThumbYT, MuayCoverTT} from './v7/Thumbs';
import {Wwe1Long, Wwe1Tall, WWE1_LONG_DUR} from './w1/Wwe1';
import {WweCoverTT} from './w1/Cover';
import {OppoTT, OPPO_DUR} from './op/Oppo';
import {OppoCover} from './op/Cover';
import {BibleLong, BibleTall, BIBLE1_DUR} from './b1/Bible';

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
    {/* Video 3: whey concentrate vs isolate vs hydrolyzed */}
    <Composition id="WheyV4" component={WheyV4} durationInFrames={Math.ceil(V4_DURATION * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{musicVolume: 0.075}} />
    {/* Video 4: progressive overload (cream / rust reference) */}
    <Composition id="ProgressiveOverload" component={ProgressiveOverload} durationInFrames={Math.ceil(PO_DURATION * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{musicVolume: 0.07}} />
    <Composition id="PoCover" component={PoCover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* Video 5: Will You Survive WWE Training? (animated, AI narration) */}
    <Composition id="WweLong" component={WweLong} durationInFrames={Math.ceil(WWE_LONG_DUR * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{music: 0.11}} />
    <Composition id="WweShort" component={WweShort} durationInFrames={Math.ceil(WWE_SHORT_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{music: 0.11}} />
    {/* Episode 2: Would You Survive a Muay Thai Fight Camp? (3D, creator voice-over) */}
    <Composition id="MuayLong" component={MuayLong} durationInFrames={Math.ceil(MUAY_LONG_DUR * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{music: 0.47, voice: 'v7/voice_long.wav'}} />
    <Composition id="MuayTall" component={MuayTall} durationInFrames={Math.ceil(MUAY_LONG_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{music: 0.47, voice: 'v7/voice_long.wav'}} />
    <Composition id="MuayShort" component={MuayShort} durationInFrames={Math.ceil(MUAY_SHORT_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{music: 0.47, voice: 'v7/voice_short.wav'}} />
    <Composition id="MuayThumbYT" component={MuayThumbYT} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    <Composition id="MuayCoverTT" component={MuayCoverTT} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* OPPO Watch 5 — UltraBurn Mode (TikTok) */}
    <Composition id="OppoCover" component={OppoCover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="OppoTT" component={OppoTT} durationInFrames={Math.ceil(OPPO_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{music: 0.13}} />
    {/* Ep1 remake: Would You Survive WWE Training? (3D, creator voice) */}
    <Composition id="Wwe1Long" component={Wwe1Long} durationInFrames={Math.ceil(WWE1_LONG_DUR * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{music: 0.47, voice: 'w1/voice_long.wav'}} />
    <Composition id="Wwe1Tall" component={Wwe1Tall} durationInFrames={Math.ceil(WWE1_LONG_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{music: 0.47, voice: 'w1/voice_long.wav'}} />
    <Composition id="WweCoverTT" component={WweCoverTT} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* Bible series Ep1: The Wilderness (Bidayuh, creator voice) */}
    <Composition id="BibleLong" component={BibleLong} durationInFrames={Math.ceil(BIBLE1_DUR * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{music: 0.36}} />
    <Composition id="BibleTall" component={BibleTall} durationInFrames={Math.ceil(BIBLE1_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{music: 0.36}} />
    <Composition id="MuayStyle" component={MuayStyle} durationInFrames={3} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Test3D" component={Test3D} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="RigTest" component={RigTest} durationInFrames={30} fps={FPS} width={1920} height={1080} />
    <Composition id="TubTest" component={TubTest} durationInFrames={60} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
