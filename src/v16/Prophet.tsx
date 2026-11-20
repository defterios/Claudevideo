import React from 'react';
import {SCENES9} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 9 — "A Prophet Without Honor" (Mark 6:1-29). TikTok only. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 9', title: ['A PROPHET', 'WITHOUT HONOR'], ref: 'MARK 6:1-29', follow: 'Follow for Part 10 →', voice: 'v16/voice.mp3', bed: 'v16/bed.mp3'},
  bdy: {ep: 'EPISOD 9', title: ['NABI DE DOI', 'NYA SUKA'], ref: 'MARK 6:1-29', follow: 'Nuna koih suo Part 10 →', voice: 'v16/voice_bdy.mp3', bed: 'v16/bed_bdy.mp3'},
};
export const PROPHET_DUR = DATA.en.duration;
export const PROPHET_DUR_BDY = DATA.bdy.duration;
export const ProphetTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES9} room />;
