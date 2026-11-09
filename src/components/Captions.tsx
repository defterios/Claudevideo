import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT, COLORS, SAFE, SAFE_CENTER_X} from '../theme';
import type {CaptionPage} from '../data/types';

const HIGHLIGHT = new Set(
  ['GLP-1', 'OZEMPIC', 'OTOT', 'LEMAK', 'PROTEIN', 'KG', 'SAINS', 'METABOLISMA', 'KUAT', 'BERAT', 'PENTING', 'BAHAYA', 'RAHSIA']
);

export const Captions: React.FC<{pages: CaptionPage[]; hiddenRanges: [number, number][]}> = ({
  pages,
  hiddenRanges,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  if (hiddenRanges.some(([a, b]) => t >= a && t < b)) return null;

  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page) return null;

  const pageIn = spring({frame: frame - Math.round(page.start * fps), fps, config: {damping: 16, stiffness: 260}, durationInFrames: 8});

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: SAFE_CENTER_X - 430,
          width: 860,
          top: SAFE.bottom - 250,
          height: 230,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignContent: 'center',
          gap: '6px 24px',
          transform: `scale(${interpolate(pageIn, [0, 1], [0.86, 1])})`,
          opacity: pageIn,
        }}
      >
        {page.words.map((w, i) => {
          const active = t >= w.start && t < w.end + 0.05;
          const spoken = t >= w.start;
          const clean = w.text.toUpperCase().replace(/[^A-Z0-9-]/g, '');
          const isKey = HIGHLIGHT.has(clean) || /\d/.test(clean);
          const pop = spring({frame: frame - Math.round(w.start * fps), fps, config: {damping: 12, stiffness: 320}, durationInFrames: 6});
          const color = isKey ? COLORS.accent : active ? COLORS.white : spoken ? '#FFFFFF' : 'rgba(255,255,255,0.55)';
          return (
            <span
              key={i}
              style={{
                fontFamily: BODY_FONT,
                fontWeight: 900,
                fontSize: 74,
                lineHeight: 1.08,
                letterSpacing: -1,
                textTransform: 'uppercase',
                color,
                WebkitTextStroke: '10px #000',
                paintOrder: 'stroke fill',
                textShadow: '0 6px 18px rgba(0,0,0,0.55)',
                display: 'inline-block',
                transform: `scale(${active ? interpolate(pop, [0, 1], [1.0, 1.12]) : 1}) translateY(${active ? -4 : 0}px)`,
                background: active && !isKey ? COLORS.red : 'transparent',
                borderRadius: 14,
                padding: active && !isKey ? '0 12px' : '0 2px',
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
