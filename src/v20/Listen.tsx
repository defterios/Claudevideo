import React from 'react';
import {SCENES13} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 13 — "Listen to Him" (Mark 9). TikTok only, English + Bidayuh Bau. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 13', title: ['LISTEN', 'TO HIM'], ref: 'MARK 9', follow: 'Follow for Part 14 →', voice: 'v20/voice.mp3', bed: 'v20/bed.mp3'},
  bdy: {ep: 'EPISOD 13', title: ['NGOJIT', 'NYA SINA YEH'], ref: 'MARK 9', follow: 'Nuna koih suo Part 14 →', voice: 'v20/voice_bdy.mp3', bed: 'v20/bed_bdy.mp3'},
};
export const LISTEN_DUR = DATA.en.duration;
export const LISTEN_DUR_BDY = DATA.bdy.duration;
export const ListenTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES13} room />;
