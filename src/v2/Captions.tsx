import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CX, P, SAFE, TEXT} from './theme';

type Word = {text: string; start: number; end: number};
type Page = {start: number; end: number; words: Word[]};
const KEY = /^(ozempic|mounjaro|semaglutide|tirzepatide|glp-1|gip|muscle|muscles|fat|protein|strength|mandatory|deficit|metabolism|crash|skinny|shortcuts|tools|full|two|single|appetite|pt|trainer|comments)$/i;

/** Reference-style caption: small serif text in a deep-green box, keywords in sage italic. */
export const Captions: React.FC<{pages: Page[]; y?: number}> = ({pages, y = SAFE.bottom - 200}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  const pin = interpolate(t, [page.start, page.start + 0.1], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: CX - 430, width: 860, top: y, display: 'flex', justifyContent: 'center', opacity: pin}}>
      <div
        style={{
          background: 'rgba(16,32,23,0.96)',
          border: '1.5px solid rgba(239,233,218,0.22)',
          borderRadius: 10,
          padding: '8px 22px 12px',
          fontFamily: TEXT,
          fontSize: 50,
          lineHeight: 1.15,
          color: P.cream,
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          maxWidth: 860,
        }}
      >
        {page.words.map((w, i) => {
          const clean = w.text.replace(/[^A-Za-z0-9-]/g, '');
          const key = KEY.test(clean);
          const on = t >= w.start - 0.03;
          return (
            <span key={i} style={{fontStyle: key ? 'italic' : 'normal', color: key ? P.sage : P.cream, opacity: on ? 1 : 0.35}}>
              {w.text}
              {i < page.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};
