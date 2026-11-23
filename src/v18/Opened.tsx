import React from 'react';
import {SCENES11} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 11 — "Be Opened" (Mark 7). TikTok only, English + Bidayuh Bau. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 11', title: ['BE', 'OPENED'], ref: 'MARK 7', follow: 'Follow for Part 12 →', voice: 'v18/voice.mp3', bed: 'v18/bed.mp3'},
  bdy: {ep: 'EPISOD 11', title: ['TIBUKA', 'NIH'], ref: 'MARK 7', follow: 'Nuna koih suo Part 12 →', voice: 'v18/voice_bdy.mp3', bed: 'v18/bed_bdy.mp3'},
};
export const OPENED_DUR = DATA.en.duration;
export const OPENED_DUR_BDY = DATA.bdy.duration;
export const OpenedTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES11} room />;
