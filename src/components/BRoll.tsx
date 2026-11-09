import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PIP} from '../theme';
import type {Overlay} from '../data/types';

type B = Extract<Overlay, {type: 'broll'}>;

/** Ken Burns photo with the same cinematic grade as the footage; blur-in / blur-out. */
const Photo: React.FC<{b: B; w: number; h: number}> = ({b, w, h}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const dur = b.end - b.start;
  const p = interpolate(t, [b.start, b.end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const enter = interpolate(t, [b.start, b.start + 0.28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exit = interpolate(t, [b.end - 0.22, b.end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const vis = Math.min(enter, exit);
  const drift = Math.min(0.12, 0.02 * dur);
  let scale = 1.08;
  let tx = 0;
  if (b.motion === 'in') scale = 1.06 + drift * p;
  if (b.motion === 'out') scale = 1.06 + drift * (1 - p);
  if (b.motion === 'left') tx = interpolate(p, [0, 1], [3, -3]);
  if (b.motion === 'right') tx = interpolate(p, [0, 1], [-3, 3]);
  const [fx, fy] = b.focus ?? [50, 50];
  const grade = `contrast(1.1) saturate(0.8) brightness(0.85) blur(${(1 - vis) * 18}px)`;
  // Landscape photos on a full vertical frame: framed card over a blurred copy (no heavy upscaling).
  if (w === 1080 && b.aspect > 0.85) {
    const cw = 920;
    const ch = Math.min(640, cw / b.aspect);
    const top = 940 - ch / 2;
    const rise = interpolate(vis, [0, 1], [60, 0]);
    return (
      <div style={{position: 'absolute', inset: 0, width: w, height: h, overflow: 'hidden', opacity: vis}}>
        <Img src={staticFile(b.src)} style={{position: 'absolute', inset: -80, width: w + 160, height: h + 160, objectFit: 'cover', filter: 'blur(40px) brightness(0.45) saturate(0.8)'}} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 45%, rgba(10,14,40,0.2) 0%, rgba(6,7,15,0.75) 100%)'}} />
        <div
          style={{
            position: 'absolute',
            left: (w - cw) / 2 - 20,
            top: top + rise,
            width: cw,
            height: ch,
            borderRadius: 36,
            overflow: 'hidden',
            boxShadow: '0 40px 90px rgba(0,0,0,0.6)',
            transform: `perspective(1400px) rotateX(${(1 - vis) * 12}deg)`,
          }}
        >
          <Img
            src={staticFile(b.src)}
            style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, transform: `scale(${scale}) translateX(${tx}%)`, filter: grade}}
          />
        </div>
      </div>
    );
  }
  return (
    <div style={{position: 'absolute', inset: 0, width: w, height: h, overflow: 'hidden', opacity: vis}}>
      <Img
        src={staticFile(b.src)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${fx}% ${fy}%`,
          transform: `scale(${scale + (1 - vis) * 0.12}) translateX(${tx}%)`,
          filter: grade,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,8,20,0.6) 0%, rgba(4,8,20,0.05) 32%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 66%, rgba(0,0,0,0.75) 78%, rgba(0,0,0,0.5) 100%), radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0) 50%, rgba(4,10,24,0.5) 100%)',
        }}
      />
    </div>
  );
};

export const BRollFull: React.FC<{items: B[]}> = ({items}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <>
      {items
        .filter((b) => b.mode === 'full' && t >= b.start && t < b.end)
        .map((b, i) => (
          <AbsoluteFill key={i}>
            <Photo b={b} w={1080} h={1920} />
          </AbsoluteFill>
        ))}
    </>
  );
};

/** Swaps the face inside the PiP card for a photo (used when reading during a scene). */
export const BRollPip: React.FC<{items: B[]}> = ({items}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <>
      {items
        .filter((b) => b.mode === 'pip' && t >= b.start && t < b.end)
        .map((b, i) => (
          <div key={i} style={{position: 'absolute', left: PIP.x, top: PIP.y, width: PIP.w, height: PIP.h, borderRadius: PIP.radius, overflow: 'hidden'}}>
            <Photo b={b} w={PIP.w} h={PIP.h} />
          </div>
        ))}
    </>
  );
};
