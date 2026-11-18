import React from 'react';
import {SCENES3} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 3 — "Through the Roof" (Mark 2:1-17). TikTok only. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 3', title: ['THROUGH', 'THE ROOF'], ref: 'MARK 2:1-17', follow: 'Follow for Part 4 →', voice: 'v10/voice.mp3', bed: 'v10/bed.mp3'},
  bdy: {ep: 'EPISOD 3', title: ['SUO', 'BUNG BORI'], ref: 'MARK 2:1-17', follow: 'Nuna koih suo Part 4 →', voice: 'v10/voice_bdy.mp3', bed: 'v10/bed_bdy.mp3'},
};
export const ROOF_DUR = DATA.en.duration;
export const ROOF_DUR_BDY = DATA.bdy.duration;
export const RoofTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES3} />;
