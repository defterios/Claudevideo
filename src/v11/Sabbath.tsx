import React from 'react';
import {SCENES4} from './scenes';
import {SCENES4R} from './scenes_room';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 4 — "Lord of the Sabbath" (Mark 2:23-3:6). TikTok only.
 *  SabbathTall: lit-room cartoon style (2nd reference). SabbathAnimeTall: the earlier 80s-anime version. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 4', title: ['LORD OF', 'THE SABBATH'], ref: 'MARK 2:23-3:6', follow: 'Follow for Part 5 →', voice: 'v11/voice.mp3', bed: 'v11/bed.mp3'},
  bdy: {ep: 'EPISOD 4', title: ['RAJA', 'SABBATH'], ref: 'MARK 2:23-3:6', follow: 'Nuna koih suo Part 5 →', voice: 'v11/voice_bdy.mp3', bed: 'v11/bed_bdy.mp3'},
};
const D = DATA.en, X = TXT.en;
export const SABBATH_DUR = DATA.en.duration;
export const SABBATH_DUR_BDY = DATA.bdy.duration;
export const SabbathTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES4R} room />;
export const SabbathAnimeTall: React.FC<{bed: number}> = ({bed}) => <EpisodeTall bed={bed} D={D} X={X} scenes={SCENES4} film />;
