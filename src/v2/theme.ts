import {continueRender, delayRender, staticFile} from 'remotion';

export const SERIF = '"Bodoni Moda", "Playfair Display", serif';
export const TEXT = '"Playfair Display", "Noto Color Emoji", serif';
export const SANS = '"Inter Tight", sans-serif';

const faces: [string, string, FontFaceDescriptors][] = [
  ['Bodoni Moda', 'fonts/BodoniModa-normal.woff2', {weight: '400 900', style: 'normal'}],
  ['Bodoni Moda', 'fonts/BodoniModa-italic.woff2', {weight: '400 900', style: 'italic'}],
  ['Playfair Display', 'fonts/PlayfairDisplay-normal.woff2', {weight: '400 900', style: 'normal'}],
  ['Playfair Display', 'fonts/PlayfairDisplay-italic.woff2', {weight: '400 900', style: 'italic'}],
  ['Inter Tight', 'fonts/InterTight-Variable.woff2', {weight: '100 900', style: 'normal'}],
];
if (typeof document !== 'undefined') {
  const h = delayRender('v2 fonts');
  Promise.all(faces.map(([f, u, d]) => new FontFace(f, `url(${staticFile(u)}) format('woff2')`, d).load()))
    .then((l) => {
      l.forEach((f) => document.fonts.add(f));
      continueRender(h);
    })
    .catch((e) => {
      console.error(e);
      continueRender(h);
    });
}

export const P = {
  green: '#1F3B2C',
  greenDeep: '#142619',
  cream: '#EFE9DA',
  paper: '#E7E0CD',
  ink: '#1B261F',
  sage: '#A8C7A0',
  red: '#B5382B',
  gold: '#B89A5B',
};

/** TikTok + IG safe zone (1080x1920). */
export const SAFE = {top: 210, bottom: 1440, left: 60, right: 930};
export const CX = (SAFE.left + SAFE.right) / 2;
