import {continueRender, delayRender, staticFile} from 'remotion';

// Self-hosted (OFL): Inter Tight variable — heavy grotesk like the reference edit.
export const FONT = '"Inter Tight", "Noto Color Emoji", sans-serif';

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading fonts');
  const face = new FontFace('Inter Tight', `url(${staticFile('fonts/InterTight-Variable.woff2')}) format('woff2')`, {weight: '100 900'});
  face
    .load()
    .then((f) => {
      document.fonts.add(f);
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
 * Top ~210px: status bar / tabs. Bottom ~480px: caption, music, nav. Right ~150px: action rail.
 */
export const SAFE = {top: 210, bottom: 1440, left: 60, right: 930};
export const SAFE_CENTER_X = (SAFE.left + SAFE.right) / 2;

/** Head/face bounding box measured from the footage (static tripod shot). */
export const FACE = {x1: 380, x2: 760, y1: 610, y2: 1110, cx: 565, cy: 860};

/** Picture-in-picture card used while a motion-graphics scene is on screen (face stays visible). */
export const PIP = {x: 120, y: 240, w: 780, h: 560, radius: 40, scale: 0.78};

/** Scene graphic area under the PiP card, above the captions. */
export const STAGE = {x: SAFE.left, y: 840, w: SAFE.right - SAFE.left, h: 440};

export const C = {
  red: '#FF2D55',
  cyan: '#64D2FF',
  gold: '#FFC940',
  green: '#34C759',
  white: '#FFFFFF',
  dim: 'rgba(255,255,255,0.42)',
  navy1: '#1B2350',
  navy2: '#06070F',
  card: '#F4F1EA',
};
