import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, CX, CY, FA, H, W } from "./tokens";
import { Abs, En, SceneShell, inOut, lerp, prog } from "./util";
import { Scene4Layout } from "./Scene4";

const LINE1 = ["آینده", "را", "تماشا", "نکن؛"];
const LINE2 = ["آن", "را", "بساز."];

const Word: React.FC<{ frame: number; start: number; size: number; color?: string; glow?: number; children: string }> = ({
  frame,
  start,
  size,
  color = C.white,
  glow = 0,
  children,
}) => {
  const p = prog(frame, start, 36);
  return (
    <div
      style={{
        fontFamily: FA,
        fontSize: size,
        fontWeight: 900,
        color,
        lineHeight: 1.35,
        whiteSpace: "nowrap",
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px) scale(${lerp(0.92, 1, p)})`,
        filter: `blur(${(1 - p) * 12}px)`,
        textShadow: glow ? `0 0 ${glow}px rgba(47,107,255,0.6)` : "none",
      }}
    >
      {children}
    </div>
  );
};

// Scene 05 (0:47-1:00): everything gathers into a point of light, the closing line appears, fade out.
export const Scene5: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const c = prog(frame, 5, 85, inOut);
  const darken = prog(frame, 0, 100);
  const dotIn = prog(frame, 30, 45);
  const ambient = lerp(1, 0.4, prog(frame, 100, 40));
  const pulse = 1 + 0.05 * Math.sin(frame * 0.1);
  const lsP = prog(frame, 250, 60);
  const glow2 = prog(frame, 190, 40);

  return (
    <SceneShell duration={duration} inFrames={0} outFrames={40} push={0}>
      <Scene4Layout t={450 + frame} c={c} />
      <AbsoluteFill style={{ background: "#000", opacity: 0.55 * darken }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <radialGradient id="s5glow">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.95} />
            <stop offset="25%" stopColor={C.blueSoft} stopOpacity={0.55} />
            <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={CX} cy={CY} r={lerp(0, 230, dotIn) * pulse} fill="url(#s5glow)" opacity={ambient} />
        <circle cx={CX} cy={CY} r={lerp(0, 8, dotIn)} fill="#fff" opacity={1 - prog(frame, 110, 25)} />
      </svg>

      <Abs x={CX} y={460}>
        <div dir="rtl" style={{ display: "flex", flexDirection: "row", gap: 36 }}>
          {LINE1.map((w, i) => (
            <Word key={w + i} frame={frame} start={110 + i * 8} size={124}>
              {w}
            </Word>
          ))}
        </div>
      </Abs>
      <Abs x={CX} y={640}>
        <div dir="rtl" style={{ display: "flex", flexDirection: "row", gap: 40 }}>
          {LINE2.map((w, i) => (
            <Word key={w + i} frame={frame} start={160 + i * 10} size={156} color={C.blueSoft} glow={lerp(0, 50, glow2)}>
              {w}
            </Word>
          ))}
        </div>
      </Abs>

      <Abs x={CX} y={850}>
        <En size={38} weight={600} color={C.white} ls={lerp(0.7, 0.35, lsP)} style={{ opacity: lsP }}>
          AI IS THE NEW CREATIVE TOOL
        </En>
      </Abs>
    </SceneShell>
  );
};
