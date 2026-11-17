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
import {WildernessTall, WildernessWide, WILD_DUR, WILD_DUR_BDY} from './v8/Wilderness';
import {FollowTall, FollowWide, FOLLOW_DUR} from './v9/FollowMe';
import {MuayLong, MuayTall, MuayShort, MUAY_LONG_DUR, MUAY_SHORT_DUR} from './v7/Muay';

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
    <Composition id="MuayLong" component={MuayLong} durationInFrames={Math.ceil(MUAY_LONG_DUR * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{music: 0.2, voice: 'v7/voice_long.wav'}} />
    <Composition id="MuayTall" component={MuayTall} durationInFrames={Math.ceil(MUAY_LONG_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{music: 0.2, voice: 'v7/voice_long.wav'}} />
    <Composition id="MuayShort" component={MuayShort} durationInFrames={Math.ceil(MUAY_SHORT_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{music: 0.2, voice: 'v7/voice_short.wav'}} />
    {/* Jesus series, Episode 1: The Wilderness (Mark 1) — toon figures, narrated */}
    <Composition id="WildernessTall" component={WildernessTall} durationInFrames={Math.ceil(WILD_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.7}} />
    <Composition id="WildernessWide" component={WildernessWide} durationInFrames={Math.ceil(WILD_DUR * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{bed: 0.7}} />
    <Composition id="WildernessTallBdy" component={WildernessTall} durationInFrames={Math.ceil(WILD_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.7, lang: 'bdy' as const}} />
    <Composition id="WildernessWideBdy" component={WildernessWide} durationInFrames={Math.ceil(WILD_DUR_BDY * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{bed: 0.7, lang: 'bdy' as const}} />
    {/* Jesus series, Episode 2: Follow Me (Mark 1:16-45) */}
    <Composition id="FollowTall" component={FollowTall} durationInFrames={Math.ceil(FOLLOW_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.7}} />
    <Composition id="FollowWide" component={FollowWide} durationInFrames={Math.ceil(FOLLOW_DUR * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{bed: 0.7}} />
    <Composition id="MuayStyle" component={MuayStyle} durationInFrames={3} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Test3D" component={Test3D} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="RigTest" component={RigTest} durationInFrames={30} fps={FPS} width={1920} height={1080} />
    <Composition id="TubTest" component={TubTest} durationInFrames={60} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
