import React from 'react';
import {SCENES5} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';

/** Episode 5 — "The Twelve" (Mark 3:7-35). TikTok only, lit-room cartoon style. */
type Lang = 'en';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 5', title: ['THE', 'TWELVE'], ref: 'MARK 3:7-35', follow: 'Follow for Part 6 →', voice: 'v12/voice.mp3', bed: 'v12/bed.mp3'},
};
export const TWELVE_DUR = DATA.en.duration;
export const TwelveTall: React.FC<{bed: number; lang?: Lang}> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES5} room />;
