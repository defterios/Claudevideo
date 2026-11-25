import React from 'react';
import {SCENES15} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 15 — "Hosanna!" (Mark 11). TikTok only, English + Bidayuh Bau. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 15', title: ['HOSANNA!', ''], ref: 'MARK 11', follow: 'Follow for Part 16 →', voice: 'v22/voice.mp3', bed: 'v22/bed.mp3'},
  bdy: {ep: 'EPISOD 15', title: ['HOSANNA!', ''], ref: 'MARK 11', follow: 'Nuna koih suo Part 16 →', voice: 'v22/voice_bdy.mp3', bed: 'v22/bed_bdy.mp3'},
};
export const HOSANNA_DUR = DATA.en.duration;
export const HOSANNA_DUR_BDY = DATA.bdy.duration;
export const HosannaTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES15} room />;
