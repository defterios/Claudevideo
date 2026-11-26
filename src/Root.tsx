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
import {FollowTall, FollowWide, FOLLOW_DUR, FOLLOW_DUR_BDY} from './v9/FollowMe';
import {Ep1Cover} from './v8/Cover';
import {Ep2Cover} from './v9/Cover';
import {RoofTall, ROOF_DUR, ROOF_DUR_BDY} from './v10/Roof';
import {Ep3Cover} from './v10/Cover';
import {AnimeTest} from './v11/Test';
import {SabbathTall, SabbathAnimeTall, SABBATH_DUR, SABBATH_DUR_BDY} from './v11/Sabbath';
import {Ep4Cover} from './v11/Cover';
import {TwelveTall, TWELVE_DUR, TWELVE_DUR_BDY} from './v12/Twelve';
import {Ep5Cover} from './v12/Cover';
import {StormTall, STORM_DUR, STORM_DUR_BDY} from './v13/Storm';
import {Ep6Cover} from './v13/Cover';
import {LegionTall, LEGION_DUR, LEGION_DUR_BDY} from './v14/Legion';
import {Ep7Cover} from './v14/Cover';
import {TalithaTall, TALITHA_DUR, TALITHA_DUR_BDY} from './v15/Talitha';
import {Ep8Cover} from './v15/Cover';
import {ProphetTall, PROPHET_DUR, PROPHET_DUR_BDY} from './v16/Prophet';
import {Ep9Cover} from './v16/Cover';
import {WaterTall, WATER_DUR, WATER_DUR_BDY} from './v17/Water';
import {Ep10Cover} from './v17/Cover';
import {OpenedTall, OPENED_DUR, OPENED_DUR_BDY} from './v18/Opened';
import {Ep11Cover} from './v18/Cover';
import {ThreeTall, THREE_DUR, THREE_DUR_BDY} from './v100/Three';
import {ThreeCover} from './v100/Cover';
import {WhoTall, WHO_DUR, WHO_DUR_BDY} from './v19/WhoIAm';
import {Ep12Cover} from './v19/Cover';
import {ListenTall, LISTEN_DUR, LISTEN_DUR_BDY} from './v20/Listen';
import {Ep13Cover} from './v20/Cover';
import {WantTall, WANT_DUR, WANT_DUR_BDY} from './v21/Want';
import {Ep14Cover} from './v21/Cover';
import {HosannaTall, HOSANNA_DUR, HOSANNA_DUR_BDY} from './v22/Hosanna';
import {Ep15Cover} from './v22/Cover';
import {DeadTall, DEAD_DUR, DEAD_DUR_BDY} from './v101/Dead';
import {DeadCover} from './v101/Cover';
import {EverythingTall, EVERY_DUR, EVERY_DUR_BDY} from './v23/Everything';
import {Ep16Cover} from './v23/Cover';
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
    <Composition id="FollowTallBdy" component={FollowTall} durationInFrames={Math.ceil(FOLLOW_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.7, lang: 'bdy' as const}} />
    <Composition id="FollowWideBdy" component={FollowWide} durationInFrames={Math.ceil(FOLLOW_DUR_BDY * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{bed: 0.7, lang: 'bdy' as const}} />
    <Composition id="Ep1CoverBdy" component={Ep1Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const, W: WIDTH, H: HEIGHT}} />
    <Composition id="Ep1CoverEn" component={Ep1Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const, W: WIDTH, H: HEIGHT}} />
    <Composition id="Ep1ThumbBdy" component={Ep1Cover} durationInFrames={1} fps={FPS} width={1280} height={720} defaultProps={{lang: 'bdy' as const, W: 1280, H: 720}} />
    <Composition id="Ep2CoverBdy" component={Ep2Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const, W: WIDTH, H: HEIGHT}} />
    <Composition id="Ep2CoverEn" component={Ep2Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const, W: WIDTH, H: HEIGHT}} />
    <Composition id="Ep2ThumbBdy" component={Ep2Cover} durationInFrames={1} fps={FPS} width={1280} height={720} defaultProps={{lang: 'bdy' as const, W: 1280, H: 720}} />
    {/* Jesus series, Episode 3: Through the Roof (Mark 2:1-17), TikTok only */}
    <Composition id="RoofTall" component={RoofTall} durationInFrames={Math.ceil(ROOF_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.7}} />
    <Composition id="RoofTallBdy" component={RoofTall} durationInFrames={Math.ceil(ROOF_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.9, lang: 'bdy' as const}} />
    <Composition id="Ep3CoverBdy" component={Ep3Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    <Composition id="Ep3CoverEn" component={Ep3Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    <Composition id="AnimeTest" component={AnimeTest} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    {/* Jesus series, Episode 4: Lord of the Sabbath (Mark 2:23-3:6), TikTok only, 80s-anime look */}
    <Composition id="SabbathTall" component={SabbathTall} durationInFrames={Math.ceil(SABBATH_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.85}} />
    <Composition id="SabbathTallBdy" component={SabbathTall} durationInFrames={Math.ceil(SABBATH_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="SabbathAnimeTall" component={SabbathAnimeTall} durationInFrames={Math.ceil(SABBATH_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.85}} />
    <Composition id="Ep4CoverBdy" component={Ep4Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    <Composition id="Ep4CoverEn" component={Ep4Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    {/* Jesus series, Episode 5: The Twelve (Mark 3:7-35), TikTok only */}
    <Composition id="TwelveTall" component={TwelveTall} durationInFrames={Math.ceil(TWELVE_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="TwelveTallBdy" component={TwelveTall} durationInFrames={Math.ceil(TWELVE_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep5CoverBdy" component={Ep5Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    <Composition id="Ep5CoverEn" component={Ep5Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    {/* Jesus series, Episode 6: The Storm (Mark 4), TikTok only */}
    <Composition id="StormTall" component={StormTall} durationInFrames={Math.ceil(STORM_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="StormTallBdy" component={StormTall} durationInFrames={Math.ceil(STORM_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep6CoverBdy" component={Ep6Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    <Composition id="Ep6CoverEn" component={Ep6Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    {/* Jesus series, Episode 7: Legion (Mark 5:1-20), TikTok only */}
    <Composition id="LegionTall" component={LegionTall} durationInFrames={Math.ceil(LEGION_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="LegionTallBdy" component={LegionTall} durationInFrames={Math.ceil(LEGION_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep7CoverBdy" component={Ep7Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    <Composition id="Ep7CoverEn" component={Ep7Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    {/* Jesus series, Episode 8: Talitha Koum (Mark 5:21-43), TikTok only */}
    <Composition id="TalithaTall" component={TalithaTall} durationInFrames={Math.ceil(TALITHA_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="TalithaTallBdy" component={TalithaTall} durationInFrames={Math.ceil(TALITHA_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep8CoverBdy" component={Ep8Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    <Composition id="Ep8CoverEn" component={Ep8Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    {/* Jesus series, Episode 9: A Prophet Without Honor (Mark 6:1-29), TikTok only */}
    <Composition id="ProphetTall" component={ProphetTall} durationInFrames={Math.ceil(PROPHET_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="ProphetTallBdy" component={ProphetTall} durationInFrames={Math.ceil(PROPHET_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep9CoverBdy" component={Ep9Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    <Composition id="Ep9CoverEn" component={Ep9Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    {/* Jesus series, Episode 10: Walking on Water (Mark 6:30-56), TikTok only */}
    <Composition id="WaterTall" component={WaterTall} durationInFrames={Math.ceil(WATER_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="WaterTallBdy" component={WaterTall} durationInFrames={Math.ceil(WATER_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep10CoverBdy" component={Ep10Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    <Composition id="Ep10CoverEn" component={Ep10Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    {/* Jesus series, Episode 11: Be Opened (Mark 7), TikTok only */}
    <Composition id="OpenedTall" component={OpenedTall} durationInFrames={Math.ceil(OPENED_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="OpenedTallBdy" component={OpenedTall} durationInFrames={Math.ceil(OPENED_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep11CoverBdy" component={Ep11Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    <Composition id="Ep11CoverEn" component={Ep11Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    {/* Jesus series, Special: The Number 3, TikTok only */}
    <Composition id="ThreeTall" component={ThreeTall} durationInFrames={Math.ceil(THREE_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="ThreeTallBdy" component={ThreeTall} durationInFrames={Math.ceil(THREE_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="SpecialCoverEn" component={ThreeCover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    <Composition id="SpecialCoverBdy" component={ThreeCover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    {/* Jesus series, Episode 12: Who Do You Say I Am? (Mark 8), TikTok only */}
    <Composition id="WhoTall" component={WhoTall} durationInFrames={Math.ceil(WHO_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="WhoTallBdy" component={WhoTall} durationInFrames={Math.ceil(WHO_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep12CoverEn" component={Ep12Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    <Composition id="Ep12CoverBdy" component={Ep12Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    {/* Jesus series, Episode 13: Listen to Him (Mark 9), TikTok only */}
    <Composition id="ListenTall" component={ListenTall} durationInFrames={Math.ceil(LISTEN_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="ListenTallBdy" component={ListenTall} durationInFrames={Math.ceil(LISTEN_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep13CoverEn" component={Ep13Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    <Composition id="Ep13CoverBdy" component={Ep13Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    {/* Jesus series, Episode 14: What Do You Want? (Mark 10), TikTok only */}
    <Composition id="WantTall" component={WantTall} durationInFrames={Math.ceil(WANT_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="WantTallBdy" component={WantTall} durationInFrames={Math.ceil(WANT_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep14CoverEn" component={Ep14Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    <Composition id="Ep14CoverBdy" component={Ep14Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    {/* Jesus series, Episode 15: Hosanna! (Mark 11), TikTok only */}
    <Composition id="HosannaTall" component={HosannaTall} durationInFrames={Math.ceil(HOSANNA_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="HosannaTallBdy" component={HosannaTall} durationInFrames={Math.ceil(HOSANNA_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep15CoverEn" component={Ep15Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    <Composition id="Ep15CoverBdy" component={Ep15Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    {/* Jesus series, Special 2: Why Do We Pray for the Dead?, TikTok only */}
    <Composition id="DeadTall" component={DeadTall} durationInFrames={Math.ceil(DEAD_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="DeadTallBdy" component={DeadTall} durationInFrames={Math.ceil(DEAD_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Special2CoverEn" component={DeadCover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    <Composition id="Special2CoverBdy" component={DeadCover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    {/* Jesus series, Episode 16: Everything She Had (Mark 12-13), TikTok only */}
    <Composition id="EverythingTall" component={EverythingTall} durationInFrames={Math.ceil(EVERY_DUR * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95}} />
    <Composition id="EverythingTallBdy" component={EverythingTall} durationInFrames={Math.ceil(EVERY_DUR_BDY * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{bed: 0.95, lang: 'bdy' as const}} />
    <Composition id="Ep16CoverEn" component={Ep16Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
    <Composition id="Ep16CoverBdy" component={Ep16Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'bdy' as const}} />
    <Composition id="MuayStyle" component={MuayStyle} durationInFrames={3} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Test3D" component={Test3D} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="RigTest" component={RigTest} durationInFrames={30} fps={FPS} width={1920} height={1080} />
    <Composition id="TubTest" component={TubTest} durationInFrames={60} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
