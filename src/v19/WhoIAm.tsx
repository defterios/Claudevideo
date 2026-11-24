import React from 'react';
import {SCENES12} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 12 — "Who Do You Say I Am?" (Mark 8). TikTok only, English + Bidayuh Bau. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 12', title: ['WHO DO YOU', 'SAY I AM?'], ref: 'MARK 8', follow: 'Follow for Part 13 →', voice: 'v19/voice.mp3', bed: 'v19/bed.mp3'},
  bdy: {ep: 'EPISOD 12', title: ['OSI OKU IN', 'INGAN NANG?'], ref: 'MARK 8', follow: 'Nuna koih suo Part 13 →', voice: 'v19/voice_bdy.mp3', bed: 'v19/bed_bdy.mp3'},
};
export const WHO_DUR = DATA.en.duration;
export const WHO_DUR_BDY = DATA.bdy.duration;
export const WhoTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES12} room />;
