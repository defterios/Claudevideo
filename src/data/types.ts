export type Word = {text: string; start: number; end: number};
export type CaptionPage = {start: number; end: number; words: Word[]};
export type Segment = {srcStart: number; srcEnd: number; outStart: number; zoom: number};

export type Tone = 'white' | 'red' | 'cyan' | 'gold' | 'green';
export type KLine = {t: string; s: 'sm' | 'lg' | 'xl'; c?: Tone};

type Base = {start: number; end: number};
export type Overlay =
  | (Base & {type: 'kinetic'; lines: KLine[]})
  | (Base & {type: 'scene'; scene: string; props: Record<string, any>; beats: number[]})
  | (Base & {type: 'cta'; text: string; sub: string})
  | (Base & {type: 'broll'; src: string; mode: 'full' | 'pip'; motion: 'in' | 'out' | 'left' | 'right'; focus?: [number, number]; aspect: number});

export type Sfx = {t: number; src: string; volume: number};
