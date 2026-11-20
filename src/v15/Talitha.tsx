import React from 'react';
import {SCENES8} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 8 — "Talitha Koum" (Mark 5:21-43). TikTok only, lit-room cartoon style. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 8', title: ['TALITHA', 'KOUM'], ref: 'MARK 5:21-43', follow: 'Follow for Part 9 →', voice: 'v15/voice.mp3', bed: 'v15/bed.mp3'},
  bdy: {ep: 'EPISOD 8', title: ['TALITHA', 'KOUM'], ref: 'MARK 5:21-43', follow: 'Nuna koih suo Part 9 →', voice: 'v15/voice_bdy.mp3', bed: 'v15/bed_bdy.mp3'},
};
export const TALITHA_DUR = DATA.en.duration;
export const TALITHA_DUR_BDY = DATA.bdy.duration;
export const TalithaTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES8} room />;
