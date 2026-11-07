import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FA, LATIN } from "./tokens";

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const smooth = Easing.bezier(0.22, 1, 0.36, 1);
export const inOut = Easing.inOut(Easing.cubic);

/** 0 -> 1 progress between `start` and `start + dur` frames (eased, clamped). */
export const prog = (
  frame: number,
  start: number,
  dur: number,
  easing: (t: number) => number = smooth,
) => interpolate(frame, [start, start + dur], [0, 1], { ...clampOpts, easing });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Scene wrapper: fade in/out through black plus an optional slow camera push. */
export const SceneShell: React.FC<{
  children: React.ReactNode;
  duration: number;
  bg?: string;
  inFrames?: number;
  outFrames?: number;
  push?: number;
}> = ({ children, duration, bg = C.bg, inFrames = 14, outFrames = 14, push = 0 }) => {
  const frame = useCurrentFrame();
  const fin = inFrames > 0 ? interpolate(frame, [0, inFrames], [0, 1], clampOpts) : 1;
  const fout =
    outFrames > 0
      ? interpolate(frame, [duration - outFrames, duration], [1, 0], clampOpts)
      : 1;
  const scale = 1 + push * (frame / duration);
  return (
    <AbsoluteFill style={{ background: bg, opacity: Math.min(fin, fout) }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 50%" }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Absolutely positioned, centered on (x, y). */
export const Abs: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", ...style }}>
    {children}
  </div>
);

/** Persian text: RTL, never letter-spaced (it would break letter joining). */
export const Fa: React.FC<{
  size: number;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ size, weight = 700, color = C.white, style, children }) => (
  <div
    dir="rtl"
    style={{
      fontFamily: FA,
      fontSize: size,
      fontWeight: weight,
      color,
      textAlign: "center",
      lineHeight: 1.5,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Latin text with letter-spacing (em). Left padding balances trailing spacing. */
export const En: React.FC<{
  size: number;
  weight?: number;
  color?: string;
  ls?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ size, weight = 600, color = C.white, ls = 0.1, style, children }) => (
  <div
    style={{
      fontFamily: LATIN,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing: `${ls}em`,
      paddingLeft: `${ls}em`,
      whiteSpace: "nowrap",
      textAlign: "center",
      lineHeight: 1.2,
      ...style,
    }}
  >
    {children}
  </div>
);
