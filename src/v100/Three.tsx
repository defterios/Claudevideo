import React from 'react';
import {scenes3} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Special — "The Number 3". TikTok only, English + Bidayuh Bau. Gold line-art style. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'SPECIAL', title: ['THE', 'NUMBER 3'], ref: 'WHY ALWAYS 3?', follow: 'Share with 3 people →', voice: 'v100/voice.mp3', bed: 'v100/bed.mp3'},
  bdy: {ep: 'SPECIAL', title: ['NUMUR', '3'], ref: 'ONI SOKAN 3?', follow: 'Share nudu 3 urang →', voice: 'v100/voice_bdy.mp3', bed: 'v100/bed_bdy.mp3'},
};
const SC = {en: scenes3('en'), bdy: scenes3('bdy')};
export const THREE_DUR = DATA.en.duration;
export const THREE_DUR_BDY = DATA.bdy.duration;
export const ThreeTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SC[lang]} room />;
