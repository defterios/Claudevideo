import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE, SAFE_CENTER_X} from '../theme';
import type {CaptionPage} from '../data/types';

/** Words that get the red accent (like the reference's highlighted keywords). */
const KEY = /^(GLP-1|GIP|OZEMPIC|MOUNJARO|MUSCLE|MUSCLES|FAT|PROTEIN|SARCOPENIA|METABOLISM|METABOLIC|STRENGTH|WEIGHT|LIFTING|MANDATORY|ESSENTIAL|INJECT|WRONG|NEVER|NOT|HEAVY|DEXA|INBODY|OIL|SUPERCAR|BREAK|[\d.,%–-]+(KG|G|%)?)$/;

export const Captions: React.FC<{pages: CaptionPage[]; hiddenRanges: [number, number][]}> = ({pages, hiddenRanges}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (hiddenRanges.some(([a, b]) => t >= a && t < b)) return null;
  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  const fadeIn = interpolate(t, [page.start, page.start + 0.12], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: SAFE_CENTER_X - 420,
          width: 840,
          top: SAFE.bottom - 150,
          height: 130,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignContent: 'center',
          gap: '0 14px',
          opacity: fadeIn,
        }}
      >
        {page.words.map((w, i) => {
          const spoken = t >= w.start - 0.02;
          const clean = w.text.toUpperCase().replace(/[^A-Z0-9.%–-]/g, '');
          const key = KEY.test(clean);
          const color = !spoken ? C.dim : key ? C.red : C.white;
          const lift = interpolate(t, [w.start - 0.02, w.start + 0.08], [6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 50,
                lineHeight: 1.15,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                color,
                textShadow: '0 2px 14px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.5)',
                transform: `translateY(${lift}px)`,
                display: 'inline-block',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
