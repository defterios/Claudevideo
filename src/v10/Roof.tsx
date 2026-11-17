import React from 'react';
import {SCENES3} from './scenes';
import {Data, EpisodeTall, Text} from '../v8/Episode';
import dataEn from './data.json';

/** Episode 3 — "Through the Roof" (Mark 2:1-17). TikTok only. */
const D: Data = dataEn as unknown as Data;
const X: Text = {ep: 'EPISODE 3', title: ['THROUGH', 'THE ROOF'], ref: 'MARK 2:1-17', follow: 'Follow for Part 4 →', voice: 'v10/voice.mp3', bed: 'v10/bed.mp3'};
export const ROOF_DUR = D.duration;
export const RoofTall: React.FC<{bed: number}> = ({bed}) => <EpisodeTall bed={bed} D={D} X={X} scenes={SCENES3} />;
