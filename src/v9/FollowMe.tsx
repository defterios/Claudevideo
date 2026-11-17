import React from 'react';
import {SCENES2} from './scenes';
import {Data, EpisodeTall, EpisodeWide, Text} from '../v8/Episode';
import dataEn from './data.json';
import dataBdy from './data_bdy.json';

/** Episode 2 — "Follow Me" (Mark 1:16-45). */
type Lang = 'en' | 'bdy';
const DATA: Record<Lang, Data> = {en: dataEn as unknown as Data, bdy: dataBdy as unknown as Data};
const TXT: Record<Lang, Text> = {
  en: {ep: 'EPISODE 2', title: ['FOLLOW', 'ME'], ref: 'MARK 1:16-45', follow: 'Follow for Part 3 →', voice: 'v9/voice.mp3', bed: 'v9/bed.mp3'},
  bdy: {ep: 'EPISOD 2', title: ['NUNA', 'OKU'], ref: 'MARK 1:16-45', follow: 'Follow suo Part 3 →', voice: 'v9/voice_bdy.mp3', bed: 'v9/bed_bdy.mp3'},
};
export const FOLLOW_DUR = DATA.en.duration;
export const FOLLOW_DUR_BDY = DATA.bdy.duration;
type Props = {bed: number; lang?: Lang};
export const FollowTall: React.FC<Props> = ({bed, lang = 'en'}) => <EpisodeTall bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES2} />;
export const FollowWide: React.FC<Props> = ({bed, lang = 'en'}) => <EpisodeWide bed={bed} D={DATA[lang]} X={TXT[lang]} scenes={SCENES2} />;
