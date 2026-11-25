import React from 'react';
import {SCENES14} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 14 — "What Do You Want?" (Mark 10). TikTok only, English + Bidayuh Bau. */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 14', title: ['WHAT DO', 'YOU WANT?'], ref: 'MARK 10', follow: 'Follow for Part 15 →', voice: 'v21/voice.mp3', bed: 'v21/bed.mp3'},
  bdy: {ep: 'EPISOD 14', title: ['ONI DE', 'RAN MU?'], ref: 'MARK 10', follow: 'Nuna koih suo Part 15 →', voice: 'v21/voice_bdy.mp3', bed: 'v21/bed_bdy.mp3'},
};
export const WANT_DUR = DATA.en.duration;
export const WANT_DUR_BDY = DATA.bdy.duration;
export const WantTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES14} room />;
