import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {CX, Card, Chip, Heavy, K, MONO, SANS, SlateBg, cl, ease, pop} from '../v3/ui';
import {Tubs3D, Variant} from './Tub3D';

export type SP = {local: number; dur: number; beats: number[]; props: Record<string, any>};
const ACC: Record<Variant, string> = {concentrate: K.yellow, isolate: '#4FA8F5', hydro: K.red};

/** Single tub that drops in, turns to face camera, then keeps a slow spin + float. */
const HeroTub: React.FC<{variant: Variant; local: number; w: number; h: number; camZ?: number; delay?: number}> = ({variant, local, w, h, camZ = 6.4, delay = 0}) => {
  const p = pop(local, delay);
  const turn = interpolate(local - delay, [0, 0.9], [-1.4, 0], {...cl, easing: Easing.out(Easing.cubic)});
  const rotY = turn + Math.sin(local * 1.1) * 0.22;
  return <Tubs3D width={w} height={h} camZ={camZ} items={[{variant, x: 0, y: interpolate(p, [0, 1], [-1.6, 0]) + Math.sin(local * 2) * 0.04, rotY, scale: 0.6 + 0.4 * p}]} />;
};

/* ---------- big hero tub + name ---------- */
const TubHero: React.FC<SP> = ({local, beats, props}) => (
  <AbsoluteFill>
    <SlateBg />
    <div style={{position: 'absolute', top: 240, width: 990, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 40, color: K.green, opacity: ease(local, 0, 0.25)}}>#{props.n}</div>
    <div style={{position: 'absolute', left: 0, top: 260}}>
      <HeroTub variant={props.variant} local={local} w={990} h={760} camZ={6.0} />
    </div>
    <div style={{position: 'absolute', top: 990, width: 990, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
      <Heavy text={props.name} size={84} p={ease(local, 0.15, 0.45)} />
      <Chip text={props.chip} tone={props.tone} p={pop(local, beats[0] ?? 0.6)} />
    </div>
  </AbsoluteFill>
);

/* ---------- macro breakdown card ---------- */
const Macro: React.FC<SP> = ({local, beats, props}) => {
  const v: Variant = props.variant;
  const go = beats[0] ?? 0.3;
  const p = interpolate(local, [go, go + 0.9], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const fat = ease(local, beats[1] - 0.1, beats[1] + 0.3);
  const carbs = ease(local, beats[2] - 0.1, beats[2] + 0.3);
  const nums = String(props.pct).match(/\d+/g)!.map(Number);
  const shown = String(props.pct).replace(/\d+/g, (m) => String(Math.round(Number(m) * p)));
  const seg = (w: number, color: string, label: string, a: number) => (
    <div style={{width: `${w * a}%`, height: '100%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: SANS, fontWeight: 800, fontSize: 22, color: '#111', letterSpacing: 1}}>{w * a > 6 ? label : ''}</div>
  );
  const zeros: string[] | undefined = props.zeros;
  return (
    <AbsoluteFill>
      <SlateBg />
      <div style={{position: 'absolute', left: CX - 230, top: 210}}>
        <HeroTub variant={v} local={local + 1} w={460} h={470} camZ={6.6} />
      </div>
      <Card local={local} at={0.05} style={{left: CX - 400, top: 690, width: 800, height: 400, padding: '34px 46px', boxSizing: 'border-box'}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: K.dim}}>PROTEIN PER SCOOP</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 140, letterSpacing: -5, color: props.color, lineHeight: 1.05}}>{nums.length ? shown : props.pct}</div>
        <div style={{display: 'flex', height: 56, borderRadius: 14, overflow: 'hidden', background: '#11161C', marginTop: 10}}>
          {seg(props.protein, props.color, 'PROTEIN', p)}
          {seg(Math.max(props.fat, 0.8), '#FF9F43', 'FAT', fat)}
          {seg(Math.max(props.carbs, 0.8), '#A0E7E5', 'CARBS', carbs)}
        </div>
        <div style={{display: 'flex', gap: 24, marginTop: 18, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: K.dim}}>
          <span style={{color: props.color}}>● protein</span>
          <span style={{color: '#FF9F43', opacity: 0.3 + 0.7 * fat}}>● fat</span>
          <span style={{color: '#A0E7E5', opacity: 0.3 + 0.7 * carbs}}>● carbs</span>
        </div>
      </Card>
      {zeros ? (
        <div style={{position: 'absolute', top: 1110, width: 990, display: 'flex', justifyContent: 'center', gap: 12}}>
          {zeros.map((z, i) => (
            <Chip key={z} text={z} tone="dim" size={26} p={pop(local, beats[i + 1] ?? 1)} dot={K.green} />
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- rating rows (taste / price / stomach) ---------- */
const Ratings: React.FC<SP> = ({local, beats, props}) => {
  const rows: [string, string, string][] = props.rows;
  const v: Variant = props.variant;
  return (
    <AbsoluteFill>
      <SlateBg />
      <div style={{position: 'absolute', left: CX - 230, top: 210}}>
        <HeroTub variant={v} local={local + 1.5} w={460} h={470} camZ={6.6} />
      </div>
      {rows.map(([label, value, chip], i) => {
        const p = pop(local, beats[i] - 0.15);
        const good = !value.startsWith('$') || value === '$';
        return (
          <Card key={i} local={local} at={beats[i] - 0.15} style={{left: CX - 400, top: 700 + i * 210, width: 800, height: 180, padding: '0 40px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: K.dim}}>{label}</div>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 84, color: value.startsWith('★') ? K.yellow : value === '✓' ? K.green : good ? K.green : '#FF9F43', letterSpacing: value.startsWith('$') ? 6 : 2}}>{value}</div>
            </div>
            <Chip text={chip} tone={value.startsWith('$') && value.length > 1 ? 'dim' : 'green'} p={p} size={26} />
          </Card>
        );
      })}
      <div style={{position: 'absolute', top: 252, left: 90, opacity: ease(local, 0, 0.3), fontFamily: SANS, fontWeight: 900, fontSize: 30, color: ACC[v], letterSpacing: 3}}>{v === 'concentrate' ? 'CONCENTRATE' : v === 'isolate' ? 'ISOLATE' : 'HYDROLYZED'}</div>
    </AbsoluteFill>
  );
};

/* ---------- tub + filtering scan + code window ---------- */
const TubCode: React.FC<SP> = ({local, beats, props}) => {
  const lines: string[] = props.lines;
  const total = lines.join('\n').length;
  const typed = Math.round(interpolate(local, [beats[0] - 0.3, beats[0] + 0.9], [0, total], cl));
  const scan = ((local * 0.9) % 1);
  let used = 0;
  return (
    <AbsoluteFill>
      <SlateBg />
      <div style={{position: 'absolute', top: 230, width: 990, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 40, color: K.green, opacity: ease(local, 0, 0.25)}}>#{props.n}</div>
      <div style={{position: 'absolute', left: CX - 280, top: 250}}>
        <HeroTub variant={props.variant} local={local} w={560} h={540} camZ={6.4} />
        {/* filter scan line */}
        <div style={{position: 'absolute', left: 60, right: 60, top: 60 + scan * 420, height: 6, borderRadius: 3, background: '#7CC4FF', boxShadow: '0 0 30px 10px rgba(124,196,255,0.55)', opacity: ease(local, 0.5, 0.8) * (1 - Math.abs(scan - 0.5) * 0.6)}} />
      </div>
      <Card local={local} at={0.15} style={{left: CX - 400, top: 800, width: 800, height: 330, background: '#161B21'}}>
        <div style={{height: 54, display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px', borderBottom: `1.5px solid ${K.line}`}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <span key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />
          ))}
          <span style={{marginLeft: 14, fontFamily: MONO, fontSize: 22, color: K.dim}}>{props.file}</span>
          <span style={{marginLeft: 'auto', fontFamily: SANS, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: '#7CC4FF'}}>● FILTERING</span>
        </div>
        <div style={{padding: '16px 30px', fontFamily: MONO, fontSize: 34, lineHeight: 1.5}}>
          {lines.map((ln, i) => {
            const st = used;
            used += ln.length + 1;
            const vis = ln.slice(0, Math.max(0, Math.min(ln.length, typed - st)));
            return (
              <div key={i} style={{whiteSpace: 'pre', color: ln.startsWith('//') ? '#6B7684' : K.white}}>
                {vis.split(/("[^"]*"?)/).map((w, j) => (
                  <span key={j} style={{color: w.startsWith('"') ? '#FF9F43' : undefined}}>{w}</span>
                ))}
              </div>
            );
          })}
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/* ---------- absorption race ---------- */
const Race: React.FC<SP> = ({local, beats}) => {
  const go = beats[0] ?? 0.3;
  const rows: [string, string, number, number][] = [
    ['CONCENTRATE', K.yellow, 0.62, 2.6],
    ['ISOLATE', '#4FA8F5', 0.75, 2.2],
    ['HYDROLYZED', K.red, 1.0, 1.0],
  ];
  return (
    <AbsoluteFill>
      <SlateBg />
      <div style={{position: 'absolute', top: 300, width: 990, display: 'flex', justifyContent: 'center', gap: 14}}>
        <Chip text="ABSORPTION SPEED" p={pop(local, 0)} dot={K.green} />
      </div>
      <Card local={local} at={0.05} style={{left: CX - 400, top: 410, width: 800, height: 560, padding: '30px 46px', boxSizing: 'border-box'}}>
        {rows.map(([name, color, max, dur], i) => {
          const v = interpolate(local, [go, go + dur], [0, max], {...cl, easing: Easing.out(Easing.quad)});
          const win = i === 2 && v >= 0.99;
          return (
            <div key={name} style={{marginTop: i ? 44 : 16}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: win ? K.white : K.dim}}>
                <span>{name}</span>
                <span style={{fontFamily: MONO, color}}>{Math.round(v * 100)}%</span>
              </div>
              <div style={{marginTop: 12, height: 34, borderRadius: 17, background: '#11161C', overflow: 'hidden', boxShadow: win ? `0 0 30px ${color}` : 'none'}}>
                <div style={{width: `${v * 100}%`, height: '100%', borderRadius: 17, background: `linear-gradient(90deg, ${color}99, ${color})`}} />
              </div>
            </div>
          );
        })}
      </Card>
      <div style={{position: 'absolute', top: 1010, width: 990, display: 'flex', justifyContent: 'center'}}>
        <Chip text="⚡ SUPER-FAST ABSORPTION" tone="red" p={pop(local, go + 1.0)} size={32} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3D shelf with price tags ---------- */
const Shelf: React.FC<SP> = ({local, beats}) => {
  const items: Variant[] = ['concentrate', 'isolate', 'hydro'];
  const tags = ['$', '$$', '$$$'];
  return (
    <AbsoluteFill>
      <SlateBg />
      <div style={{position: 'absolute', top: 260, width: 990, display: 'flex', justifyContent: 'center'}}>
        <Chip text="ON THE SHELF" p={pop(local, 0)} />
      </div>
      <div style={{position: 'absolute', left: -45, top: 320}}>
        <Tubs3D width={1080} height={560} camZ={9.6} items={items.map((v, i) => {
          const p = pop(local, i * 0.12);
          return {variant: v, x: (i - 1) * 2.45, y: -0.2 + (1 - p) * 0.6, rotY: -0.35 * (i - 1) - (1 - p) * 1.2 + Math.sin(local * 1.2 + i) * 0.12, scale: 0.05 + 0.87 * p};
        })} />
      </div>
      {/* shelf plank */}
      <div style={{position: 'absolute', left: 70, width: 850, top: 768, height: 34, borderRadius: 8, background: 'linear-gradient(180deg, #4A5361, #2A313B)', boxShadow: '0 30px 60px rgba(0,0,0,0.55)', opacity: ease(local, 0, 0.3)}} />
      {items.map((v, i) => {
        const p = pop(local, beats[i] ?? 0.5 + i * 0.3);
        const top = i === 2;
        return (
          <div key={v} style={{position: 'absolute', left: CX - 45 + (i - 1) * 270 - 85, top: 835, width: 260, display: 'flex', justifyContent: 'center'}}>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: top ? 64 : 52, color: top ? '#fff' : '#0E1A12', background: top ? K.red : K.green, borderRadius: 18, padding: '10px 26px', boxShadow: top ? `0 0 40px ${K.red}` : '0 12px 30px rgba(0,0,0,0.4)', opacity: p, transform: `translateY(${(1 - p) * 30}px) rotate(${top ? -4 : 0}deg) scale(${0.8 + 0.2 * p})`}}>{tags[i]}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 975, width: 990, display: 'flex', justifyContent: 'center'}}>
        <Heavy text="MOST EXPENSIVE" size={72} color={K.red} p={ease(local, (beats[2] ?? 1) - 0.1, (beats[2] ?? 1) + 0.3)} />
      </div>
    </AbsoluteFill>
  );
};

export const REGISTRY4: Record<string, React.FC<SP>> = {tubHero: TubHero, macro: Macro, ratings: Ratings, tubCode: TubCode, race: Race, shelf: Shelf};
export {HeroTub};
