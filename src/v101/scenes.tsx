import React from 'react';
import {SP, ko, lerp, lin, rnd} from '../v8/scenes';
import {BG, Back, CX, CY, Defs3, Dot, Fig, GD, Ln, Mono, Tag, WH, cross, fig, lit} from '../v100/scenes';

/** Special 2 — "Why Do We Pray for the Dead?" Gold line-art on black (same look as Special 1). */
export type Lang = 'en' | 'bdy';
const L: Record<Lang, Record<string, string[]>> = {
  en: {two: ['WITH GOD NOW', 'THE LAST DAY'], cat: ['CATHOLIC · ORTHODOX'], pro: ['PROTESTANT'], love: ['HOPE', 'COMFORT', 'LOVE'], all: ['EVERY CHRISTIAN']},
  bdy: {two: ['DUOH TOPA DIE', 'ONU PINGITUONG'], cat: ['KATOLIK · ORTHODOX'], pro: ['PROTESTANT'], love: ['PINGARAP', 'PIMASI', 'PINYAYANG'], all: ['SUO KRISTIAN']},
};
const Candle: React.FC<{x: number; y: number; t: number; s?: number; l?: number}> = ({x, y, t, s = 1, l = 1}) => (
  <g>
    <circle cx={x} cy={y - 150 * s} r={160 * s} fill="url(#g3)" opacity={0.6 * l + 0.1 * Math.sin(t * 7)} />
    <Ln d={`M ${x - 32 * s} ${y} L ${x - 32 * s} ${y - 110 * s} L ${x + 32 * s} ${y - 110 * s} L ${x + 32 * s} ${y} Z M ${x} ${y - 110 * s} L ${x} ${y - 128 * s}`} w={3} />
    <Ln d={`M ${x} ${y - 128 * s} Q ${x - 16 * s} ${y - 150 * s} ${x} ${y - (190 + 8 * Math.sin(t * 9)) * s} Q ${x + 16 * s} ${y - 150 * s} ${x} ${y - 128 * s} Z`} l={l} w={3} />
  </g>
);
const Book: React.FC<{x: number; y: number; s?: number; p?: number; l?: number}> = ({x, y, s = 1, p = 1, l = 0}) => (
  <g>
    <Ln d={`M ${x} ${y} Q ${x - 120 * s} ${y - 40 * s} ${x - 240 * s} ${y} L ${x - 240 * s} ${y - 260 * s} Q ${x - 120 * s} ${y - 300 * s} ${x} ${y - 260 * s} Q ${x + 120 * s} ${y - 300 * s} ${x + 240 * s} ${y - 260 * s} L ${x + 240 * s} ${y} Q ${x + 120 * s} ${y - 40 * s} ${x} ${y} Z M ${x} ${y} L ${x} ${y - 260 * s}`} p={p} l={l} w={3} />
    {[0, 1, 2, 3].map((i) => <Ln key={i} d={`M ${x - 200 * s} ${y - (210 - i * 45) * s} L ${x - 40 * s} ${y - (200 - i * 45) * s} M ${x + 40 * s} ${y - (200 - i * 45) * s} L ${x + 200 * s} ${y - (210 - i * 45) * s}`} p={p} w={2} />)}
  </g>
);
const lie = (x: number, y: number, s = 1) => `M ${x - 230 * s} ${y} Q ${x - 230 * s} ${y - 60 * s} ${x - 150 * s} ${y - 62 * s} L ${x + 150 * s} ${y - 62 * s} Q ${x + 200 * s} ${y - 60 * s} ${x + 200 * s} ${y} Z M ${x + 260 * s} ${y - 40 * s} m -36 0 a ${36 * s} ${36 * s} 0 1 0 ${72 * s} 0 a ${36 * s} ${36 * s} 0 1 0 ${-72 * s} 0`;
const grave = (x: number, y: number, s = 1) => `M ${x - 70 * s} ${y} L ${x - 70 * s} ${y - 120 * s} Q ${x} ${y - 200 * s} ${x + 70 * s} ${y - 120 * s} L ${x + 70 * s} ${y}`;
const Sun: React.FC<{x: number; y: number; r: number; o: number}> = ({x, y, r, o}) => (
  <g opacity={o}><circle cx={x} cy={y} r={r * 3} fill="url(#g3)" /><Ln d={`M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`} l={1} w={4} />{Array.from({length: 7}).map((_, i) => { const a = Math.PI * (i / 6); return <Ln key={i} d={`M ${x - Math.cos(a) * r * 1.3} ${y - Math.sin(a) * r * 1.3} L ${x - Math.cos(a) * r * 1.7} ${y - Math.sin(a) * r * 1.7}`} l={1} w={3} />; })}</g>
);
const heart = (x: number, y: number, s: number) => `M ${x} ${y + 60 * s} C ${x - 120 * s} ${y - 10 * s} ${x - 90 * s} ${y - 110 * s} ${x - 30 * s} ${y - 100 * s} C ${x - 5 * s} ${y - 96 * s} ${x} ${y - 75 * s} ${x} ${y - 65 * s} C ${x} ${y - 75 * s} ${x + 5 * s} ${y - 96 * s} ${x + 30 * s} ${y - 100 * s} C ${x + 90 * s} ${y - 110 * s} ${x + 120 * s} ${y - 10 * s} ${x} ${y + 60 * s} Z`;

export const scenesDead = (lang: Lang): Record<string, React.FC<SP>> => {
  const X = L[lang];
  return {
    /* 1 — the question */
    hook: (p) => {
      const {t} = p;
      const q = ko(t, p.w('why', p.dur * 0.85) - 0.2, p.w('why', p.dur * 0.85) + 0.4);
      return (
        <g><Defs3 /><Back t={t} />
          <Candle x={700} y={1000} t={t} s={1.2} l={lit(t, p.w('pray', 1.0))} />
          <g transform={`rotate(-20 ${CX - 160} 1000)`}><Fig x={CX - 160} y={1000} s={0.9} p={lin(t, 0, 1.2)} /></g>
          <Ln d="M 120 1000 L 960 1000" w={2} />
          <Mono x={CX} y={460} s={220} c={GD} o={q}>?</Mono>
        </g>
      );
    },
    /* 2 — what does the Bible say? */
    what: (p) => {
      const {t} = p;
      return <g><Defs3 /><Back t={t} /><circle cx={CX} cy={760} r={380} fill="url(#g3)" opacity={0.5 * ko(t, 0.5, 1.5)} /><Book x={CX} y={900} s={1.4} p={lin(t, 0, 1.4)} l={ko(t, 1.2, 2.0) * 0.6} /></g>;
    },
    /* 3 — body to dust, spirit to God */
    dust: (p) => {
      const {t} = p;
      const d = ko(t, p.w('dust', p.dur * 0.35) - 0.3, p.w('dust', p.dur * 0.35) + 1.2);
      const g = ko(t, p.w('god', p.dur * 0.8) - 0.6, p.w('god', p.dur * 0.8) + 0.8);
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="ECCLESIASTES 12:7" />
          <Ln d="M 120 1000 L 960 1000" w={2} />
          <g opacity={1 - d * 0.85}><Ln d={lie(CX - 20, 1000, 1)} w={3} /></g>
          {d > 0 ? Array.from({length: 26}).map((_, i) => <circle key={i} cx={CX - 240 + rnd(i) * 520} cy={940 + Math.min(1, d) * 55 * rnd(i + 4)} r={2 + rnd(i + 2) * 3} fill={WH} opacity={0.6 * d} />) : null}
          <g transform={`translate(0 ${-g * 520})`} opacity={Math.max(0.0, g)}><circle cx={CX + 240} cy={960} r={80} fill="url(#g3)" /><circle cx={CX + 240} cy={960} r={14} fill={GD} filter="url(#l3)" /></g>
          <circle cx={CX} cy={260} r={140} fill="url(#g3)" opacity={g * 0.6} />
        </g>
      );
    },
    /* 4 — the thief on the cross */
    thief: (p) => {
      const {t} = p;
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="LUKE 23:39-43" />
          <Ln d="M 80 1060 Q 540 860 1000 1060" w={3} />
          {[-300, 0, 300].map((dx, i) => <Ln key={i} d={cross(CX + dx, 1000 - (i === 1 ? 110 : 40), i === 1 ? 1.25 : 0.95)} p={lin(t, 0.1 + i * 0.25, 0.9 + i * 0.25)} l={i === 1 ? 1 : i === 2 ? lit(t, p.dur * 0.7) * 0.6 : 0} />)}
        </g>
      );
    },
    /* 5 — "Today you will be with me in paradise" */
    paradise: (p) => {
      const {t} = p;
      const g = ko(t, p.w('paradise', p.dur * 0.75) - 0.2, p.w('paradise', p.dur * 0.75) + 0.8);
      return (
        <g><Defs3 /><Back t={t} />
          <circle cx={CX} cy={700} r={200 + g * 500} fill="url(#g3)" opacity={0.3 + g * 0.6} />
          <Ln d="M 80 1000 Q 540 940 1000 1000" w={2} />
          {[[260, 1000, 1], [820, 1000, 0.9], [560, 990, 1.2]].map(([x, y, s], i) => <Ln key={i} d={`M ${x} ${y} L ${x} ${y - 220 * s} M ${x} ${y - 160 * s} q -80 -40 -120 -20 M ${x} ${y - 200 * s} q 90 -50 130 -10 M ${x} ${y - 220 * s} m -90 0 a ${90 * s} ${70 * s} 0 1 0 ${180 * s} 0 a ${90 * s} ${70 * s} 0 1 0 ${-180 * s} 0`} p={lin(t, 0.2 + i * 0.3, 1.2 + i * 0.3)} l={g * 0.8} w={2.5} />)}
          {Array.from({length: 12}).map((_, i) => <circle key={i} cx={150 + rnd(i) * 780} cy={420 + rnd(i + 6) * 500 - (t * 30 * (0.5 + rnd(i))) % 200} r={3 + rnd(i + 1) * 3} fill={GD} opacity={g * 0.8} />)}
        </g>
      );
    },
    /* 6 — at home with the Lord */
    home: (p) => {
      const {t} = p;
      const h = ko(t, p.w('home', p.dur * 0.8) - 0.6, p.w('home', p.dur * 0.8) + 0.6);
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="2 CORINTHIANS 5:8" />
          <Ln d="M 80 1000 L 1000 1000" w={2} />
          <rect x={CX + 60} y={520} width={220} height={480} fill={GD} opacity={0.15 + h * 0.5} filter="url(#l3)" />
          <circle cx={CX + 170} cy={760} r={260} fill="url(#g3)" opacity={0.3 + h * 0.5} />
          <Ln d={`M ${CX + 60} 1000 L ${CX + 60} 520 L ${CX + 280} 520 L ${CX + 280} 1000`} l={h} w={4} />
          <Fig x={lerp(CX - 320, CX + 150, ko(t, 0.3, p.dur * 0.85))} y={1000} s={0.85} l={h * 0.7} />
        </g>
      );
    },
    /* 7 — the dead will rise and stand before God */
    rise: (p) => {
      const {t} = p;
      const r = ko(t, p.w('rise', p.dur * 0.5) - 0.2, p.w('rise', p.dur * 0.5) + 1.0);
      const st = ko(t, p.w('stand', p.dur * 0.85) - 0.3, p.w('stand', p.dur * 0.85) + 0.6);
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="JOHN 5:28-29" />
          <circle cx={CX} cy={240} r={200 + st * 400} fill="url(#g3)" opacity={st * 0.9} />
          {Array.from({length: 9}).map((_, i) => <polygon key={i} points={`${CX - 10 + i * 3},200 ${CX + 10 + i * 3},200 ${CX + (i - 4) * 140 + 50},1100 ${CX + (i - 4) * 140 - 50},1100`} fill={GD} opacity={0.06 * st} />)}
          <Ln d="M 60 1040 L 1020 1040" w={2} />
          {[200, 420, 660, 880].map((x, i) => <g key={i}><Ln d={grave(x, 1040, 0.8)} w={2.5} /><Fig x={x} y={1040 - r * 60} s={0.6} p={r} l={st} /></g>)}
        </g>
      );
    },
    /* 8 — death is a sleep; the dead will wake */
    sleep: (p) => {
      const {t} = p;
      const w = ko(t, p.w('wake', p.dur * 0.85) - 0.3, p.w('wake', p.dur * 0.85) + 0.8);
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="1 THESSALONIANS 4:13-14" />
          <g opacity={1 - w}><circle cx={260} cy={420} r={70} fill="#E8E2D0" opacity={0.85} /><circle cx={300} cy={400} r={60} fill={BG} /></g>
          <Sun x={CX} y={1000} r={120} o={w} />
          <Ln d="M 80 1000 L 1000 1000" w={2} />
          {w < 0.5 ? <g><Ln d={lie(CX, 960, 0.9)} w={3} />{[0, 1, 2].map((i) => <Mono key={i} x={CX + 300 + i * 30} y={850 - i * 50 - ((t * 30) % 30)} s={30 + i * 8} o={0.6}>z</Mono>)}</g>
            : <Fig x={CX} y={960} s={0.9} l={w} />}
        </g>
      );
    },
    /* 9 — both: with God now, judgement at the end */
    two: (p) => {
      const {t} = p;
      const a = lit(t, p.w('now', p.dur * 0.4)), b = lit(t, p.w('end', p.dur * 0.85));
      return (
        <g><Defs3 /><Back t={t} />
          <Ln d="M 160 700 L 920 700" p={lin(t, 0.2, 1.4)} w={3} />
          <Dot x={200} y={700} l={a} r={12} /><Dot x={880} y={700} l={b} r={12} />
          <Mono x={200} y={620} s={30} a="start" c={a > 0.5 ? GD : WH} o={0.4 + 0.6 * a}>{X.two[0]}</Mono>
          <Mono x={880} y={790} s={30} a="end" c={b > 0.5 ? GD : WH} o={0.4 + 0.6 * b}>{X.two[1]}</Mono>
          <circle cx={200} cy={700} r={140} fill="url(#g3)" opacity={a * 0.6} /><Sun x={880} y={700} r={60} o={b} />
        </g>
      );
    },
    /* 10 — why do we pray? different answers */
    why: (p) => {
      const {t} = p;
      const f = ko(t, p.w('different', p.dur * 0.8) - 0.4, p.w('different', p.dur * 0.8) + 0.6);
      return (
        <g><Defs3 /><Back t={t} />
          <Mono x={CX} y={520} s={200} c={GD} o={ko(t, 0, 0.6)}>?</Mono>
          <Ln d={`M ${CX} 1100 L ${CX} 900 M ${CX} 900 Q ${CX - 60} 760 ${CX - 300} 680 M ${CX} 900 Q ${CX + 60} 760 ${CX + 300} 680`} p={f} w={3} l={f * 0.5} />
        </g>
      );
    },
    /* 11 — Catholic and Orthodox: pray for mercy (2 Maccabees 12) */
    catholic: (p) => {
      const {t} = p;
      const m = lit(t, p.w('mercy', p.dur * 0.3)), fr = lit(t, p.w('freed', p.dur * 0.9));
      return (
        <g><Defs3 /><Back t={t} />
          <rect x={CX + 10} y={150} width={540} height={1100} fill={BG} opacity={0.7} />
          <Mono x={280} y={260} s={28} c={GD}>{X.cat[0]}</Mono><Mono x={280} y={310} s={24} o={0.8}>2 MACCABEES 12:43-46</Mono>
          <Candle x={170} y={1000} t={t} s={0.9} l={m} /><Candle x={390} y={1000} t={t + 1} s={0.9} l={m} />
          <g transform={`rotate(-20 280 1000)`}><Fig x={280} y={1000} s={0.75} l={m * 0.6} /></g>
          <circle cx={280} cy={560} r={60 + fr * 160} fill="url(#g3)" opacity={fr} /><circle cx={280} cy={560 - fr * 120} r={12} fill={GD} filter="url(#l3)" opacity={fr} />
          <Ln d="M 40 1000 L 520 1000" w={2} /><Ln d={`M ${CX} 200 L ${CX} 1150`} w={1.5} />
        </g>
      );
    },
    /* 12 — many Protestants: die once, then judgement (Hebrews 9:27) */
    protest: (p) => {
      const {t} = p;
      const o = lit(t, p.w('once', p.dur * 0.65)), j = lit(t, p.w('judgement', p.dur * 0.9));
      return (
        <g><Defs3 /><Back t={t} />
          <rect x={0} y={150} width={CX - 10} height={1100} fill={BG} opacity={0.7} />
          <Mono x={800} y={260} s={28} c={GD}>{X.pro[0]}</Mono><Mono x={800} y={310} s={24} o={0.8}>HEBREWS 9:27</Mono>
          <Book x={800} y={720} s={0.8} l={o * 0.6} />
          <Mono x={800} y={860} s={90} c={GD} o={o}>1</Mono>
          <g opacity={j}><Ln d="M 800 1000 L 800 900 M 700 920 L 900 920 M 700 920 L 670 980 L 730 980 Z M 900 920 L 870 980 L 930 980 Z" l={1} w={3} /></g>
          <Ln d={`M ${CX} 200 L ${CX} 1150`} w={1.5} />
        </g>
      );
    },
    /* 13 — but every Christian prays */
    all: (p) => {
      const {t} = p;
      return (
        <g><Defs3 /><Back t={t} />
          <Mono x={CX} y={300} s={34} c={GD} o={ko(t, 0.3, 1)}>{X.all[0]}</Mono>
          {Array.from({length: 5}).map((_, i) => <g key={i}><Fig x={170 + i * 185} y={1000} s={0.6} l={lit(t, 0.4 + i * 0.25)} /><Candle x={170 + i * 185 + 60} y={900} t={t + i} s={0.45} l={lit(t, 0.4 + i * 0.25)} /></g>)}
          <Ln d="M 80 1000 L 1000 1000" w={2} />
        </g>
      );
    },
    /* 14 — for those left behind; the God of all comfort */
    comfort: (p) => {
      const {t} = p;
      const c = lit(t, p.w('comfort', p.dur * 0.85));
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="2 CORINTHIANS 1:3" />
          <circle cx={CX} cy={720} r={200 + c * 260} fill="url(#g3)" opacity={0.25 + c * 0.6} />
          <Ln d="M 120 1000 L 960 1000" w={2} />
          <Fig x={CX - 70} y={1000} s={1.0} l={c * 0.7} /><Fig x={CX + 70} y={1000} s={0.9} l={c * 0.7} />
          <Ln d={`M ${CX + 20} 820 Q ${CX - 20} 790 ${CX - 70} 830`} l={c} w={4} />
        </g>
      );
    },
    /* 15 — not like those who have no hope */
    hope: (p) => {
      const {t} = p;
      const h = lit(t, p.w('hope', p.dur * 0.85));
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="1 THESSALONIANS 4:13" />
          <Ln d="M 80 1000 L 1000 1000" w={2} /><Ln d={grave(720, 1000, 1.0)} w={3} />
          <Fig x={400} y={1000} s={0.95} l={h * 0.5} />
          <g opacity={0.3 + 0.7 * h}><circle cx={720} cy={420} r={100 + h * 140} fill="url(#g3)" /><path d={`M 720 360 L 734 406 L 782 406 L 744 434 L 758 480 L 720 452 L 682 480 L 696 434 L 658 406 L 706 406 Z`} fill={GD} filter="url(#l3)" /></g>
        </g>
      );
    },
    /* 16 — thanks for the life and the time we shared */
    thanks: (p) => {
      const {t} = p;
      const th = lit(t, p.w('thank', p.dur * 0.3));
      return (
        <g><Defs3 /><Back t={t} />
          <Ln d={`M 260 440 L 820 440 L 820 960 L 260 960 Z M 290 470 L 790 470 L 790 930 L 290 930 Z`} p={lin(t, 0, 1.2)} l={th * 0.7} w={3} />
          <Fig x={460} y={900} s={0.95} l={th * 0.5} /><Fig x={620} y={900} s={0.8} l={th * 0.5} />
          {[0, 1, 2].map((i) => { const u = (t * 0.4 + i * 0.33) % 1; return <path key={i} d={heart(400 + i * 140, 400 - u * 160, 0.35)} fill={GD} opacity={th * (1 - u)} filter="url(#l3)" />; })}
        </g>
      );
    },
    /* 17 — "I am the resurrection and the life" */
    life: (p) => {
      const {t} = p;
      const r = lit(t, p.w('resurrection', p.dur * 0.3));
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="JOHN 11:25" />
          {Array.from({length: 9}).map((_, i) => <polygon key={i} points={`${CX - 10 + i * 3},150 ${CX + 10 + i * 3},150 ${CX + (i - 4) * 140 + 50},1100 ${CX + (i - 4) * 140 - 50},1100`} fill={GD} opacity={0.06 * r} />)}
          <circle cx={CX} cy={760} r={220 + r * 300} fill="url(#g3)" opacity={0.3 + r * 0.6} />
          <Ln d="M 80 1000 L 1000 1000" w={2} />
          <Ln d="M 780 1000 Q 790 760 900 740 Q 1010 760 1020 1000" w={2.5} /><Ln d="M 860 1000 L 860 880 Q 900 840 940 880 L 940 1000" w={2.5} />
          <Fig x={CX - 60} y={1000} s={1.15} l={Math.max(0.3, r)} />
        </g>
      );
    },
    /* 18 — the God of the living; to him all are alive */
    living: (p) => {
      const {t} = p;
      const a = lit(t, p.w('alive', p.dur * 0.85));
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="LUKE 20:38" />
          <Ln d="M 80 1000 L 1000 1000" w={2} />
          {Array.from({length: 7}).map((_, i) => <Fig key={i} x={140 + i * 135} y={1000 - (i % 2) * 30} s={0.5 + (i % 3) * 0.08} l={lit(t, (i / 7) * p.dur * 0.8) * (0.4 + 0.6 * a)} />)}
          {Array.from({length: 24}).map((_, i) => <circle key={i} cx={rnd(i) * 1080} cy={250 + rnd(i + 7) * 500} r={2 + rnd(i + 3) * 3} fill={GD} opacity={a * (0.4 + 0.5 * Math.sin(t * 3 + i))} />)}
        </g>
      );
    },
    /* 19 — hope, comfort, love */
    love: (p) => {
      const {t} = p;
      const at = [p.w('hope', p.dur * 0.25), p.w('comfort', p.dur * 0.4), p.w('love', p.dur * 0.55)];
      const Lt = at.map((a) => lit(t, a));
      const P = [[CX - 330, CY - 250], [CX + 330, CY - 250], [CX, CY + 330]];
      return (
        <g><Defs3 /><Back t={t} /><Tag t={t} txt="1 CORINTHIANS 13:8" y={260} />
          <Ln d={`M ${P[0][0]} ${P[0][1]} L ${P[1][0]} ${P[1][1]} L ${P[2][0]} ${P[2][1]} Z`} p={lin(t, 0, 1)} l={Math.min(...Lt) * 0.8} w={3} />
          {P.map(([x, y], i) => <Dot key={i} x={x} y={y} l={Lt[i]} />)}
          <Mono x={P[0][0] - 10} y={P[0][1] - 40} s={32} a="start" c={Lt[0] > 0.5 ? GD : WH} o={0.4 + 0.6 * Lt[0]}>{X.love[0]}</Mono>
          <Mono x={P[1][0] + 10} y={P[1][1] - 40} s={32} a="end" c={Lt[1] > 0.5 ? GD : WH} o={0.4 + 0.6 * Lt[1]}>{X.love[1]}</Mono>
          <Mono x={P[2][0]} y={P[2][1] + 70} s={32} c={Lt[2] > 0.5 ? GD : WH} o={0.4 + 0.6 * Lt[2]}>{X.love[2]}</Mono>
          <path d={heart(CX, CY - 20, 1.1)} fill="none" stroke={GD} strokeWidth={4} filter="url(#l3)" opacity={Lt[2]} />
        </g>
      );
    },
    /* end card: a candle under the title */
    end: (p) => {
      const {t} = p;
      return <g><Defs3 /><Back t={t} /><Candle x={CX} y={1760} t={t} s={1.6} l={ko(t, 0.5, 1.5)} /></g>;
    },
  };
};
