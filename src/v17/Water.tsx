import React from 'react';
import {SCENES10} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 10 — "Walking on Water" (Mark 6:30-56). TikTok only. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 10', title: ['WALKING', 'ON WATER'], ref: 'MARK 6:30-56', follow: 'Follow for Part 11 →', voice: 'v17/voice.mp3', bed: 'v17/bed.mp3'},
  bdy: {ep: 'EPISOD 10', title: ['PONU DE', 'TUN PIIN'], ref: 'MARK 6:30-56', follow: 'Nuna koih suo Part 11 →', voice: 'v17/voice_bdy.mp3', bed: 'v17/bed_bdy.mp3'},
};
export const WATER_DUR = DATA.en.duration;
export const WATER_DUR_BDY = DATA.bdy.duration;
export const WaterTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES10} room />;
