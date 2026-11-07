import React from "react";
import { random, useCurrentFrame } from "remotion";
import { C, W, H } from "./tokens";
import { Abs, En, Fa, SceneShell, clamp01, lerp, prog } from "./util";

const CARD_W = 460;
const CARD_H = 540;
const CY2 = 570;
const TL_Y = 930;

const CARDS = [
  { en: "Machine Learning", fa: "یادگیری ماشین", n: "۰۱", x: 1560 },
  { en: "Deep Learning", fa: "یادگیری عمیق", n: "۰۲", x: 960 },
  { en: "Generative AI", fa: "هوش مصنوعی مولد", n: "۰۳", x: 360 },
];

const draw = (p: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p });

// Glyph 1: scatter plot with a fitted trend line (machine learning).
const GlyphML: React.FC<{ p: number }> = ({ p }) => {
  const pts = [
    [30, 140], [62, 120], [92, 132], [126, 98], [160, 104], [196, 72], [232, 80], [268, 46],
  ];
  return (
    <svg viewBox="0 0 300 180" width="100%" height="100%">
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={6 * clamp01(p * 2.2 - i * 0.12)} fill={C.blueSoft} />
      ))}
      <line x1={16} y1={152} x2={284} y2={38} stroke={C.white} strokeWidth={2} opacity={0.8} {...draw(clamp01(p * 1.4 - 0.3))} />
    </svg>
  );
};

// Glyph 2: layered neural network (deep learning).
const GlyphDL: React.FC<{ p: number }> = ({ p }) => {
  const cols = [
    { x: 50, ys: [40, 90, 140] },
    { x: 150, ys: [25, 65, 115, 155] },
    { x: 250, ys: [40, 90, 140] },
  ];
  const lines: React.ReactNode[] = [];
  let k = 0;
  for (let c = 0; c < 2; c++) {
    for (const y1 of cols[c].ys) {
      for (const y2 of cols[c + 1].ys) {
        const i = k++;
        lines.push(
          <line
            key={i}
            x1={cols[c].x}
            y1={y1}
            x2={cols[c + 1].x}
            y2={y2}
            stroke={C.violet}
            strokeWidth={1.2}
            opacity={0.55}
            {...draw(clamp01(p * 2 - i * 0.03))}
          />,
        );
      }
    }
  }
  return (
    <svg viewBox="0 0 300 180" width="100%" height="100%">
      {lines}
      {cols.flatMap((col, ci) =>
        col.ys.map((y, yi) => (
          <circle key={`${ci}-${yi}`} cx={col.x} cy={y} r={9 * clamp01(p * 3 - ci * 0.4)} fill={C.bg2} stroke={C.white} strokeWidth={2} />
        )),
      )}
    </svg>
  );
};

// Glyph 3: a generative spark with orbiting points (generative AI).
const GlyphGen: React.FC<{ p: number; t: number }> = ({ p, t }) => {
  const star = "M150 20 L163 77 L220 90 L163 103 L150 160 L137 103 L80 90 L137 77 Z";
  return (
    <svg viewBox="0 0 300 180" width="100%" height="100%">
      <defs>
        <linearGradient id="s2star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.blueSoft} />
          <stop offset="100%" stopColor={C.violet} />
        </linearGradient>
      </defs>
      <path d={star} fill="url(#s2star)" opacity={0.9 * clamp01(p * 2 - 0.9)} />
      <path d={star} fill="none" stroke={C.white} strokeWidth={2} {...draw(clamp01(p * 1.6))} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2 + t * 0.012;
        const r = 62 + random(`o${i}`) * 26;
        return (
          <circle
            key={i}
            cx={150 + Math.cos(a) * r * 1.5}
            cy={90 + Math.sin(a) * r * 0.85}
            r={2 + random(`s${i}`) * 3}
            fill={i % 2 ? C.blueSoft : C.violet}
            opacity={0.8 * clamp01(p * 2 - 1)}
          />
        );
      })}
    </svg>
  );
};

// Scene 02 (0:07-0:17): three evolution cards rise in sequence, linked by animated lines.
export const Scene2: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const head = prog(frame, 0, 40);
  const tl = prog(frame, 30, 130);
  const emph = prog(frame, 140, 40);
  const pulseU = ((frame - 170) % 110) / 110;

  return (
    <SceneShell duration={duration} inFrames={14} outFrames={14} push={0.04}>
      <Abs x={W / 2} y={95}>
        <En size={24} color={C.blueSoft} ls={0.5} style={{ opacity: head }}>
          EVOLUTION OF AI
        </En>
      </Abs>
      <Abs x={W / 2} y={170}>
        <Fa size={76} weight={900} style={{ opacity: head, transform: `translateY(${(1 - head) * 20}px)` }}>
          تکامل هوش مصنوعی
        </Fa>
      </Abs>

      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* timeline underneath the cards, drawn right to left */}
        <line x1={1560} y1={TL_Y} x2={lerp(1560, 360, tl)} y2={TL_Y} stroke={C.white} strokeWidth={1.5} opacity={0.35} />
        {CARDS.map((c, i) => {
          const u = (1560 - c.x) / 1200;
          const o = clamp01((tl - u * 0.97) * 25);
          return (
            <circle key={i} cx={c.x} cy={TL_Y} r={8} fill={i === 2 ? C.blue : C.bg} stroke={i === 2 ? C.blueSoft : C.white} strokeWidth={2} opacity={o} />
          );
        })}
        {frame > 170 && (
          <circle cx={lerp(1560, 360, pulseU)} cy={TL_Y} r={5} fill={C.blueSoft} opacity={Math.sin(Math.PI * pulseU)} />
        )}
        {/* connectors between cards */}
        {[0, 1].map((i) => {
          const x1 = i === 0 ? 1560 - CARD_W / 2 : 960 - CARD_W / 2;
          const x2 = i === 0 ? 960 + CARD_W / 2 : 360 + (CARD_W * 1.1) / 2;
          const p = prog(frame, 20 + (i + 1) * 35 + 25, 30);
          return (
            <g key={i}>
              <line x1={x1} y1={CY2} x2={lerp(x1, x2, p)} y2={CY2} stroke={C.blueSoft} strokeWidth={2} />
              <circle cx={x1} cy={CY2} r={4} fill={C.blueSoft} opacity={p} />
              <circle cx={lerp(x1, x2, p)} cy={CY2} r={4} fill={C.white} opacity={p} />
            </g>
          );
        })}
      </svg>

      {CARDS.map((c, i) => {
        const p = prog(frame, 20 + i * 35, 45);
        const last = i === 2;
        const scale = lerp(0.94, 1, p) * (last ? lerp(1, 1.1, emph) : 1);
        const gp = prog(frame, 20 + i * 35 + 25, 55);
        return (
          <div
            key={c.en}
            style={{
              position: "absolute",
              left: c.x - CARD_W / 2,
              top: CY2 - CARD_H / 2,
              width: CARD_W,
              height: CARD_H,
              boxSizing: "border-box",
              padding: 36,
              borderRadius: 28,
              background: C.bg2,
              border: `1.5px solid ${last ? C.blue : C.line}`,
              boxShadow: last ? `0 0 ${lerp(0, 70, emph)}px rgba(47,107,255,0.45)` : "none",
              opacity: p * (last ? 1 : 1 - 0.25 * emph),
              transform: `translateY(${(1 - p) * 170}px) scale(${scale})`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Fa size={34} weight={400} color={last ? C.blueSoft : C.dim} style={{ textAlign: "right" }}>
              {c.n}
            </Fa>
            <div style={{ width: "100%", height: 190 }}>
              {i === 0 && <GlyphML p={gp} />}
              {i === 1 && <GlyphDL p={gp} />}
              {i === 2 && <GlyphGen p={gp} t={frame} />}
            </div>
            <div>
              <En size={30} weight={600} color={last ? C.white : C.dim} ls={0.02} style={{ textAlign: "right", paddingLeft: 0 }}>
                {c.en}
              </En>
              <Fa size={48} weight={900} style={{ textAlign: "right", marginTop: 6 }}>
                {c.fa}
              </Fa>
            </div>
          </div>
        );
      })}
    </SceneShell>
  );
};
