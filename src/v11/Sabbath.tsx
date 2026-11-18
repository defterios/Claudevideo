import React from 'react';
import {SCENES4} from './scenes';
import {SCENES4R} from './scenes_room';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';

/** Episode 4 — "Lord of the Sabbath" (Mark 2:23-3:6). TikTok only.
 *  SabbathTall: lit-room cartoon style (2nd reference). SabbathAnimeTall: the earlier 80s-anime version. */
const D: Data = dataEn as unknown as Data;
const X: Text = {ep: 'EPISODE 4', title: ['LORD OF', 'THE SABBATH'], ref: 'MARK 2:23-3:6', follow: 'Follow for Part 5 →', voice: 'v11/voice.mp3', bed: 'v11/bed.mp3'};
export const SABBATH_DUR = D.duration;
export const SabbathTall: React.FC<{bed: number}> = ({bed}) => <EpisodeTall bed={bed} D={D} X={X} scenes={SCENES4R} room />;
export const SabbathAnimeTall: React.FC<{bed: number}> = ({bed}) => <EpisodeTall bed={bed} D={D} X={X} scenes={SCENES4} film />;
