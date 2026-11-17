import React from 'react';
import {SCENES2} from './scenes';
import {Data, EpisodeTall, EpisodeWide, Text} from '../v8/Episode';
import dataEn from './data.json';

/** Episode 2 — "Follow Me" (Mark 1:16-45). */
const D: Data = dataEn as unknown as Data;
const X: Text = {ep: 'EPISODE 2', title: ['FOLLOW', 'ME'], ref: 'MARK 1:16-45', follow: 'Follow for Part 3 →', voice: 'v9/voice.mp3', bed: 'v9/bed.mp3'};
export const FOLLOW_DUR = D.duration;
type Props = {bed: number};
export const FollowTall: React.FC<Props> = ({bed}) => <EpisodeTall bed={bed} D={D} X={X} scenes={SCENES2} />;
export const FollowWide: React.FC<Props> = ({bed}) => <EpisodeWide bed={bed} D={D} X={X} scenes={SCENES2} />;
