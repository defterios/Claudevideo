import {continueRender, delayRender, staticFile} from 'remotion';

// Fonts are self-hosted in public/fonts (Montserrat variable + Anton, both OFL).
export const BODY_FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
export const DISPLAY_FONT = 'Anton, "Noto Color Emoji", Impact, sans-serif';

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading fonts');
  const faces = [
    new FontFace('Montserrat', `url(${staticFile('fonts/Montserrat-Variable.woff2')}) format('woff2')`, {weight: '100 900'}),
    new FontFace('Anton', `url(${staticFile('fonts/Anton-400.woff2')}) format('woff2')`, {weight: '400'}),
  ];
  Promise.all(faces.map((f) => f.load()))
    .then((loaded) => {
      loaded.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/**
 * Safe zone shared by TikTok + IG Reels (1080x1920).
 * Top ~210px: status bar / tabs. Bottom ~480px: caption, music, nav.
 * Right ~150px: like/comment/share rail.
 */
export const SAFE = {
  top: 210,
  bottom: 1440,
  left: 60,
  right: 930,
};
export const SAFE_CENTER_X = (SAFE.left + SAFE.right) / 2;
export const SAFE_WIDTH = SAFE.right - SAFE.left;

/** Head/face bounding box measured from the footage (static tripod shot). */
export const FACE = {
  x1: 380,
  x2: 760,
  y1: 610,
  y2: 1110,
  cx: 565,
  cy: 860,
};

export const COLORS = {
  accent: '#FFD60A', // punchy yellow
  red: '#FF3B30', // matches the red tee
  green: '#30D158',
  white: '#FFFFFF',
  ink: '#0B0B0F',
  glass: 'rgba(12,12,16,0.72)',
};
