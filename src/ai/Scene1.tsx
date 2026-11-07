import React from "react";
import { random, useCurrentFrame } from "remotion";
import { C, CX, CY, FA, H, W } from "./tokens";
import { Abs, En, Fa, SceneShell, lerp, prog } from "./util";

const WORDS = ["انقلاب", "هوش", "مصنوعی"];

// Scene 01 (0:00-0:07): a light point expands into fine digital lines, then the title arrives.
export const Scene1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const dot = prog(frame, 6, 30);
  const ring = prog(frame, 28, 80);
  const linesFade = 1 - 0.75 * prog(frame, 100, 60);
  const tagLs = lerp(1.2, 0.45, prog(frame, 70, 60));
  const glow = prog(frame, 130, 40);
  const pulse = 1 + 0.06 * Math.sin(frame * 0.12);
  const sub = prog(frame, 150, 40);

  return (
    <SceneShell duration={duration} inFrames={8} outFrames={14} push={0.07}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <radialGradient id="s1glow">
            <stop offset="0%" stopColor={C.blueSoft} stopOpacity={0.9} />
            <stop offset="40%" stopColor={C.blue} stopOpacity={0.35} />
            <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={CX} cy={CY} r={lerp(0, 150, dot) * pulse} fill="url(#s1glow)" />
        <circle cx={CX} cy={CY} r={lerp(0, 6, dot)} fill="#fff" />
        <circle
          cx={CX}
          cy={CY}
          r={lerp(0, 320, ring)}
          fill="none"
          stroke={C.blueSoft}
          strokeWidth={1}
          opacity={0.35 * linesFade}
        />
        <circle
          cx={CX}
          cy={CY}
          r={lerp(0, 190, ring)}
          fill="none"
          stroke={C.violet}
          strokeWidth={1}
          strokeDasharray="3 9"
          opacity={0.5 * linesFade}
        />
        {Array.from({ length: 48 }).map((_, i) => {
          const a = (i / 48) * Math.PI * 2;
          const r0 = lerp(10, 120, ring);
          const len = lerp(0, 30 + random(`len${i}`) * 220, ring);
          const accent = i % 4 === 0;
          return (
            <line
              key={i}
              x1={CX + Math.cos(a) * r0}
              y1={CY + Math.sin(a) * r0}
              x2={CX + Math.cos(a) * (r0 + len)}
              y2={CY + Math.sin(a) * (r0 + len)}
              stroke={accent ? C.blueSoft : "#fff"}
              strokeWidth={accent ? 1.5 : 1}
              opacity={(accent ? 0.7 : 0.25) * linesFade}
            />
          );
        })}
      </svg>

      <Abs x={CX} y={345}>
        <En size={26} weight={600} color={C.blueSoft} ls={tagLs} style={{ opacity: prog(frame, 70, 40) }}>
          AI REVOLUTION
        </En>
      </Abs>

      <Abs x={CX} y={530}>
        <div dir="rtl" style={{ display: "flex", flexDirection: "row", gap: 44 }}>
          {WORDS.map((w, i) => {
            const p = prog(frame, 92 + i * 9, 36);
            return (
              <div
                key={w}
                style={{
                  fontFamily: FA,
                  fontSize: 150,
                  fontWeight: 900,
                  color: C.white,
                  lineHeight: 1.4,
                  whiteSpace: "nowrap",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 34}px) scale(${lerp(0.9, 1, p)})`,
                  filter: `blur(${(1 - p) * 14}px)`,
                  textShadow: `0 0 ${lerp(0, 50, glow)}px rgba(47,107,255,0.5)`,
                }}
              >
                {w}
              </div>
            );
          })}
        </div>
      </Abs>

      <Abs x={CX} y={690}>
        <Fa
          size={54}
          weight={400}
          color={C.dim}
          style={{ opacity: sub, transform: `translateY(${(1 - sub) * 20}px)` }}
        >
          آینده همین حالا شروع شده است
        </Fa>
      </Abs>
    </SceneShell>
  );
};
