import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontFamily } from "./theme";

// Base wrapper: RTL direction + Persian font + dark background.
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    dir="rtl"
    style={{
      width: "100%",
      height: "100%",
      background: colors.bg,
      color: colors.text,
      fontFamily,
      direction: "rtl",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 80,
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
);

// Spring-in text: slides up and fades in. `delay` is in frames.
export const FadeUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  weight?: number;
  color?: string;
}> = ({ children, delay = 0, size = 72, weight = 700, color = colors.text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: weight,
        color,
        textAlign: "center",
        lineHeight: 1.5,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};
