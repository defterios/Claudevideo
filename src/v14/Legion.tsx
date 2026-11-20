import React from 'react';
import {SCENES7} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 7 — "Legion" (Mark 5:1-20). TikTok only, lit-room cartoon style. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 7', title: ['', 'LEGION'], ref: 'MARK 5:1-20', follow: 'Follow for Part 8 →', voice: 'v14/voice.mp3', bed: 'v14/bed.mp3'},
  bdy: {ep: 'EPISOD 7', title: ['', 'LEGION'], ref: 'MARK 5:1-20', follow: 'Nuna koih suo Part 8 →', voice: 'v14/voice_bdy.mp3', bed: 'v14/bed_bdy.mp3'},
};
export const LEGION_DUR = DATA.en.duration;
export const LEGION_DUR_BDY = DATA.bdy.duration;
export const LegionTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES7} room />;
