import React from 'react';
import {scenesDead} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Special 2 — "Why Do We Pray for the Dead?" TikTok only, English + Bidayuh Bau. Gold line-art style. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'SPECIAL 2', title: ['WHY PRAY', 'FOR THE DEAD?'], ref: 'WHAT THE BIBLE SAYS', follow: 'Share with someone you miss →', voice: 'v101/voice.mp3', bed: 'v101/bed.mp3'},
  bdy: {ep: 'SPECIAL 2', title: ['ONI ROTI', 'SMAYANG?'], ref: 'SMAYANG SUO NYA DE KOBES', follow: 'Share nudu madis ayuo →', voice: 'v101/voice_bdy.mp3', bed: 'v101/bed_bdy.mp3'},
};
const SC = {en: scenesDead('en'), bdy: scenesDead('bdy')};
export const DEAD_DUR = DATA.en.duration;
export const DEAD_DUR_BDY = DATA.bdy.duration;
export const DeadTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SC[lang]} room />;
