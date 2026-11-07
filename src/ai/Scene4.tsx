import React from "react";
import { useCurrentFrame } from "remotion";
import { C, CX, CY, H, W } from "./tokens";
import { Abs, En, Fa, SceneShell, clamp01, lerp, prog } from "./util";

export const FRAME = { x1: 340, x2: 1580, y1: 380, y2: 700 };

export const LABELS = [
  { en: "DESIGN", fa: "طراحی", x: 1400, top: true, d: 30 },
  { en: "VIDEO", fa: "تولید ویدیو", x: 520, top: true, d: 75 },
  { en: "PHOTOGRAPHY", fa: "عکاسی", x: 1400, top: false, d: 120 },
  { en: "BUSINESS", fa: "کسب‌وکار", x: 520, top: false, d: 165 },
];
const GROUP_Y_TOP = 290;
const GROUP_Y_BOTTOM = 810;

/**
 * The scene-04 composition. `t` is animation time in frames, `c` (0-1) collapses
 * everything into the center. Scene 05 reuses it with t >= 450 and c animating,
 * so the hand-over between the scenes is seamless.
 */
export const Scene4Layout: React.FC<{ t: number; c: number }> = ({ t, c }) => {
  const frameP = prog(t, 15, 190);
  const gridP = prog(t, 0, 60);
  const fade = 1 - clamp01(c * 3);
  const textFade = 1 - prog(c, 0, 0.45);
  const p1 = prog(t, 230, 40);
  const p2 = prog(t, 265, 45);
  const glowP = prog(t, 300, 40);
  const s = 1 - c;

  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* faint architectural grid */}
        <g opacity={0.05 * gridP * (1 - c)}>
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`v${i}`} x1={120 + i * 120} y1={0} x2={120 + i * 120} y2={H} stroke="#fff" strokeWidth={1} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={135 + i * 135} x2={W} y2={135 + i * 135} stroke="#fff" strokeWidth={1} />
          ))}
        </g>
        {/* slow rotating dashed ring */}
        <circle
          cx={CX}
          cy={CY}
          r={400 * (1 - 0.6 * c)}
          fill="none"
          stroke={C.blueSoft}
          strokeWidth={1.5}
          strokeDasharray="2 18"
          opacity={0.22 * gridP * (1 - c)}
          transform={`rotate(${t * 0.08} ${CX} ${CY})`}
        />
        {/* connectors from labels to the frame */}
        {LABELS.map((l) => {
          const p = prog(t, l.d + 25, 20);
          const y1 = l.top ? 362 : 738;
          const y2 = l.top ? FRAME.y1 : FRAME.y2;
          return (
            <g key={l.en} opacity={fade}>
              <line x1={l.x} y1={y1} x2={l.x} y2={lerp(y1, y2, p)} stroke={C.blueSoft} strokeWidth={2} />
              <circle cx={l.x} cy={y2} r={5} fill={C.blueSoft} opacity={p} />
            </g>
          );
        })}
        {/* the frame that holds the key message */}
        <g transform={`translate(${CX} ${CY}) scale(${s}) translate(${-CX} ${-CY})`} opacity={1 - prog(c, 0.6, 0.4)}>
          <rect
            x={FRAME.x1}
            y={FRAME.y1}
            width={FRAME.x2 - FRAME.x1}
            height={FRAME.y2 - FRAME.y1}
            rx={4}
            fill="none"
            stroke={C.white}
            strokeWidth={1.5}
            opacity={0.5}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - frameP}
          />
        </g>
      </svg>

      {LABELS.map((l) => {
        const p = prog(t, l.d, 35);
        const yg = l.top ? GROUP_Y_TOP : GROUP_Y_BOTTOM;
        const dir = l.top ? -1 : 1;
        return (
          <div
            key={l.en}
            style={{
              position: "absolute",
              left: lerp(l.x, CX, c),
              top: lerp(yg, CY, c),
              transform: `translate(-50%, -50%) translateY(${(1 - p) * 24 * dir}px) scale(${lerp(1, 0.2, c)})`,
              opacity: p * (1 - prog(c, 0.55, 0.45)),
            }}
          >
            <En size={56} weight={700} ls={0.2}>
              {l.en}
            </En>
            <Fa size={40} weight={400} color={C.blueSoft} style={{ marginTop: 6 }}>
              {l.fa}
            </Fa>
          </div>
        );
      })}

      <Abs
        x={CX}
        y={CY}
        style={{ opacity: textFade, transform: `translate(-50%, -50%) scale(${lerp(1, 0.9, c)})`, filter: `blur(${c * 10}px)` }}
      >
        <div style={{ overflow: "hidden", padding: "0 20px" }}>
          <Fa size={66} weight={700} style={{ transform: `translateY(${(1 - p1) * 110}%)`, opacity: p1 }}>
            ابزارها در حال تغییرند؛
          </Fa>
        </div>
        <div style={{ overflow: "hidden", padding: "0 20px" }}>
          <Fa size={84} weight={900} style={{ transform: `translateY(${(1 - p2) * 110}%)`, opacity: p2 }}>
            اما{" "}
            <span style={{ color: C.blueSoft, textShadow: `0 0 ${lerp(0, 40, glowP)}px rgba(47,107,255,0.7)` }}>
              خلاقیت
            </span>{" "}
            همچنان مهم است.
          </Fa>
        </div>
      </Abs>
    </>
  );
};

// Scene 04 (0:32-0:47): the strongest scene. Four fields frame the key message.
export const Scene4: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell duration={duration} inFrames={14} outFrames={0} push={0}>
      <Scene4Layout t={frame} c={0} />
    </SceneShell>
  );
};
