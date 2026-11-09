export type Word = {text: string; start: number; end: number};
export type CaptionPage = {start: number; end: number; words: Word[]};
export type Segment = {srcStart: number; srcEnd: number; outStart: number; zoom: number};

type Base = {start: number; end: number};
export type Overlay =
  | (Base & {type: 'hook'; line1: string; line2: string})
  | (Base & {type: 'title'; kicker?: string; text: string; color?: string})
  | (Base & {type: 'stat'; from: number; to: number; prefix?: string; suffix: string; label: string; color?: string})
  | (Base & {type: 'chip'; emoji: string; text: string})
  | (Base & {type: 'compare'; leftLabel: string; leftValue: string; rightLabel: string; rightValue: string})
  | (Base & {type: 'step'; n: number; text: string; total: number})
  | (Base & {type: 'cta'; text: string; sub: string});

export type Sfx = {t: number; src: string; volume: number};
