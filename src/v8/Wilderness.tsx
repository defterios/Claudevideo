import React from 'react';
import {SCENES} from './scenes';
import {Data, EpisodeTall, EpisodeWide, Text} from './Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 1 — "The Wilderness" (Mark 1:1-15). */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 1', title: ['THE', 'WILDERNESS'], ref: 'MARK 1', follow: 'Follow for Part 2 →', voice: 'v8/voice.mp3', bed: 'v8/bed.mp3'},
  bdy: {ep: 'EPISOD 1', title: ['PADANG', 'PASIR'], ref: 'MARK 1', follow: 'Follow suo Part 2 →', voice: 'v8/voice_bdy.mp3', bed: 'v8/bed_bdy.mp3'},
};
export const WILD_DUR = DATA.en.duration;
export const WILD_DUR_BDY = DATA.bdy.duration;

type Props = {bed: number; lang?: Lang};
export const WildernessTall: React.FC<Props> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES} />;
export const WildernessWide: React.FC<Props> = ({bed, lang = 'en'}) => <EpisodeWide bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES} />;
