import React from 'react';
import {SCENES16} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 16 — "Everything She Had" (Mark 12–13). TikTok only, English + Bidayuh Bau. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 16', title: ['EVERYTHING', 'SHE HAD'], ref: 'MARK 12–13', follow: 'Follow for Part 17 →', voice: 'v23/voice.mp3', bed: 'v23/bed.mp3'},
  bdy: {ep: 'EPISOD 16', title: ['SUO DUIT', 'DE OGI'], ref: 'MARK 12–13', follow: 'Nuna koih suo Part 17 →', voice: 'v23/voice_bdy.mp3', bed: 'v23/bed_bdy.mp3'},
};
export const EVERY_DUR = DATA.en.duration;
export const EVERY_DUR_BDY = DATA.bdy.duration;
export const EverythingTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES16} room />;
