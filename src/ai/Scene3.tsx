import React from "react";
import { random, useCurrentFrame } from "remotion";
import { C, H, W } from "./tokens";
import { En, Fa, SceneShell, clamp01, lerp, prog } from "./util";

const PW = 640;

const PANELS = [
  { en: "AI IMAGE GENERATION", fa: "تولید تصویر", delay: 10 },
  { en: "AI VIDEO GENERATION", fa: "تولید ویدیو", delay: 30 },
  { en: "AI AUTOMATION", fa: "اتوماسیون هوشمند", delay: 50 },
];

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(lerp(v, b[i], t)));
const BLUE = [47, 107, 255];
const VIOLET = [139, 123, 255];

// Visual 1: light particles converge and form an abstract digital image.
const VisualImage: React.FC<{ f: number }> = ({ f }) => {
  const COLS = 14;
  const ROWS = 9;
  const PITCH = 30;
  const frameP = prog(f, 150, 40);
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const dx = c - (COLS - 1) / 2;
      const dy = r - (ROWS - 1) / 2;
      const dist = Math.hypot(dx, dy);
      const sx = (random(`ix${r}-${c}`) - 0.5) * 900;
      const sy = (random(`iy${r}-${c}`) - 0.5) * 700;
      const p = prog(f, 20 + dist * 3.2, 45);
      const v = 0.5 + 0.5 * Math.sin(c * 0.5 + r * 0.35);
      const shimmer = p > 0.99 ? 0.12 * Math.sin(f * 0.05 + c * 0.4 + r * 0.2) : 0;
      const [rr, gg, bb] = mix(VIOLET, BLUE, c / (COLS - 1));
      const alpha = clamp01(0.25 + 0.75 * v + shimmer) * clamp01(p * 3);
      cells.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            left: 210 + dx * PITCH - 13 + lerp(sx, 0, p),
            top: 150 + dy * PITCH - 13 + lerp(sy, 0, p),
            width: 26,
            height: 26,
            borderRadius: `${lerp(50, 18, p)}%`,
            transform: `scale(${lerp(0.3, 1, p)})`,
            background: `rgba(${rr},${gg},${bb},${alpha})`,
            boxShadow: `0 0 ${lerp(14, 6, p)}px rgba(${rr},${gg},${bb},${0.5 * alpha})`,
          }}
        />,
      );
    }
  }
  return (
    <div style={{ position: "relative", width: 420, height: 300 }}>
      {cells}
      <svg width={420} height={300} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect
          x={-4}
          y={6}
          width={428}
          height={288}
          rx={6}
          fill="none"
          stroke={C.white}
          strokeWidth={1.5}
          opacity={0.45}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - frameP}
        />
      </svg>
    </div>
  );
};

// Visual 2: one frame splits into a strip of animated frames; a playhead scrubs across.
const VisualVideo: React.FC<{ f: number }> = ({ f }) => {
  const appear = prog(f, 10, 25);
  const t = prog(f, 45, 45);
  const idx = f > 100 ? Math.floor((f - 100) / 14) % 4 : -1;
  const headX = 406 - (((f - 100) * 3) % 392);
  return (
    <svg width={420} height={300} viewBox="0 0 420 300">
      {[0, 1, 2, 3].map((i) => {
        const w = lerp(200, 92, t);
        const h = lerp(130, 62, t);
        const cx = lerp(210, 210 + (1.5 - i) * 104, t);
        const cy = 130;
        const active = idx === i;
        const dotX = cx + lerp(0, (1.5 - i) * 10, t);
        const dotY = cy + lerp(0, -Math.sin((i / 3) * Math.PI) * 14 + 6, t);
        return (
          <g key={i} opacity={i === 0 ? appear : appear * clamp01(t * 4 - 0.2)}>
            <rect
              x={cx - w / 2}
              y={cy - h / 2}
              width={w}
              height={h}
              rx={lerp(10, 8, t)}
              fill={active ? "rgba(47,107,255,0.16)" : "rgba(255,255,255,0.03)"}
              stroke={active ? C.blue : C.white}
              strokeWidth={active ? 2.5 : 1.5}
              opacity={active ? 1 : 0.6}
            />
            <circle cx={dotX} cy={dotY} r={lerp(9, 5, t)} fill={active ? C.blueSoft : C.white} />
          </g>
        );
      })}
      <g opacity={clamp01((f - 90) / 15)}>
        <line x1={14} y1={230} x2={406} y2={230} stroke={C.white} strokeWidth={1.5} opacity={0.25} />
        <line x1={headX} y1={216} x2={headX} y2={244} stroke={C.blueSoft} strokeWidth={3} strokeLinecap="round" />
        <circle cx={headX} cy={230} r={5} fill={C.blueSoft} />
      </g>
    </svg>
  );
};

// Visual 3: connected workflow blocks with a pulse running through them.
const NODES = [
  { x: 310, y: 60 },
  { x: 110, y: 60 },
  { x: 110, y: 240 },
  { x: 310, y: 240 },
];
const BW = 120;
const BH = 70;
const SEGS: [number, number, number, number][] = [
  [NODES[0].x - BW / 2, NODES[0].y, NODES[1].x + BW / 2, NODES[1].y],
  [NODES[1].x, NODES[1].y + BH / 2, NODES[2].x, NODES[2].y - BH / 2],
  [NODES[2].x + BW / 2, NODES[2].y, NODES[3].x - BW / 2, NODES[3].y],
];
const PATH_LEN = 200 + 180 + 200;

const pulsePos = (u: number) => {
  if (u < 200) return { x: 310 - u, y: 60 };
  if (u < 380) return { x: 110, y: 60 + (u - 200) };
  return { x: 110 + (u - 380), y: 240 };
};

const VisualFlow: React.FC<{ f: number }> = ({ f }) => {
  const running = f > 130;
  const u = running ? ((f - 130) * 4) % (PATH_LEN + 120) : 0;
  const pp = pulsePos(Math.min(u, PATH_LEN));
  return (
    <svg width={420} height={300} viewBox="0 0 420 300">
      {SEGS.map(([x1, y1, x2, y2], i) => {
        const p = prog(f, 30 + i * 22, 25);
        return (
          <line key={i} x1={x1} y1={y1} x2={lerp(x1, x2, p)} y2={lerp(y1, y2, p)} stroke={C.violet} strokeWidth={2.5} opacity={0.8} />
        );
      })}
      {NODES.map((n, i) => {
        const p = prog(f, 15 + i * 22, 30);
        const near = running && u <= PATH_LEN + 20 && Math.hypot(pp.x - n.x, pp.y - n.y) < 55;
        return (
          <g key={i} opacity={p} transform={`translate(${n.x} ${n.y}) scale(${lerp(0.8, 1, p)})`}>
            <rect
              x={-BW / 2}
              y={-BH / 2}
              width={BW}
              height={BH}
              rx={14}
              fill={near ? "rgba(47,107,255,0.22)" : C.bg2}
              stroke={near ? C.blue : C.white}
              strokeWidth={near ? 2.5 : 1.5}
              opacity={near ? 1 : 0.8}
            />
            <circle cx={-BW / 2 + 22} cy={0} r={7} fill={near ? C.blueSoft : C.violet} />
            <line x1={-BW / 2 + 40} y1={-8} x2={BW / 2 - 18} y2={-8} stroke={C.white} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
            <line x1={-BW / 2 + 40} y1={9} x2={BW / 2 - 40} y2={9} stroke={C.dim} strokeWidth={3} strokeLinecap="round" />
          </g>
        );
      })}
      {running && u <= PATH_LEN && <circle cx={pp.x} cy={pp.y} r={7} fill={C.blueSoft} />}
    </svg>
  );
};

// Scene 03 (0:17-0:32): split screen with three AI capabilities.
export const Scene3: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const sep = prog(frame, 0, 40);

  return (
    <SceneShell duration={duration} inFrames={14} outFrames={14} push={0.03}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {[PW, PW * 2].map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={H * sep} stroke={C.white} strokeWidth={1} opacity={0.12} />
        ))}
      </svg>
      {PANELS.map((pn, i) => {
        const f = frame - pn.delay;
        const p = prog(frame, pn.delay, 40);
        const hair = prog(frame, pn.delay + 20, 40);
        return (
          <div
            key={pn.en}
            style={{
              position: "absolute",
              left: W - PW * (i + 1),
              top: 0,
              width: PW,
              height: H,
              opacity: p,
              transform: `translateY(${(1 - p) * 40}px)`,
            }}
          >
            <div style={{ position: "absolute", left: 110, top: 250 }}>
              {i === 0 && <VisualImage f={f} />}
              {i === 1 && <VisualVideo f={f} />}
              {i === 2 && <VisualFlow f={f} />}
            </div>
            <div style={{ position: "absolute", left: 110, top: 640, width: 420, height: 2, background: C.white, opacity: 0.18, transform: `scaleX(${hair})`, transformOrigin: "right center" }} />
            <div style={{ position: "absolute", left: 0, top: 690, width: PW }}>
              <En size={26} color={C.blueSoft} ls={0.18}>
                {pn.en}
              </En>
            </div>
            <div style={{ position: "absolute", left: 0, top: 740, width: PW }}>
              <Fa size={62} weight={900}>
                {pn.fa}
              </Fa>
            </div>
          </div>
        );
      })}
    </SceneShell>
  );
};
