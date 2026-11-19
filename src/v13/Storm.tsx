import React from 'react';
import {SCENES6} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';

/** Episode 6 — "The Storm" (Mark 4). TikTok only, lit-room cartoon style. */
type Lang = 'en';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 6', title: ['THE', 'STORM'], ref: 'MARK 4', follow: 'Follow for Part 7 →', voice: 'v13/voice.mp3', bed: 'v13/bed.mp3'},
};
export const STORM_DUR = DATA.en.duration;
export const StormTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES6} room />;
