import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, FPS, fontFamily } from "../theme";

type SceneData = {
  id: string;
  seconds: number;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  tag: string;
  visual: "question" | "prompt" | "code" | "timer" | "future";
};

const scenes: SceneData[] = [
  { id: "01", seconds: 7, eyebrow: "THE OLD WAY", title: "برای موشن حرفه‌ای\nحتماً باید ادیتور باشی؟", accent: "نه لزوماً.", body: "AFTER EFFECTS  /  KEYFRAMES  /  HOURS", tag: "THINK AGAIN", visual: "question" },
  { id: "02", seconds: 11, eyebrow: "ONE PROMPT", title: "یک جمله؛\nیک موشن کامل", accent: "فقط با هوش مصنوعی", body: "PROMPT  →  DESIGN  →  MOTION", tag: "PROMPT ENGINE", visual: "prompt" },
  { id: "03", seconds: 14, eyebrow: "UNDER THE HOOD", title: "کد تبدیل به تصویر می‌شود", accent: "HyperFrames + HTML", body: "STRUCTURE  /  ANIMATION  /  RENDER", tag: "BUILT WITH CODE", visual: "code" },
  { id: "04", seconds: 16, eyebrow: "SOUND, FROM ZERO", title: "موسیقی هم\nهمان‌جا ساخته می‌شود", accent: "Python • بدون فایل آماده", body: "SYNTH  →  RHYTHM  →  SOUND DESIGN", tag: "GENERATIVE AUDIO", visual: "timer" },
  { id: "05", seconds: 12, eyebrow: "THE NEXT FRAME", title: "آینده موشن\nاز همین‌جا شروع می‌شود", accent: "THE FUTURE IS AI", body: "LEARN  /  CREATE  /  PUBLISH", tag: "MAKE SOMETHING", visual: "future" },
];

const totalFrames = scenes.reduce((sum, s) => sum + s.seconds * FPS, 0);

const Glow: React.FC<{ x: string; y: string; color: string; size: number }> = ({ x, y, color, size }) => (
  <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, filter: "blur(95px)", opacity: 0.23 }} />
);

const Grid: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.16, backgroundImage: "linear-gradient(rgba(140,160,210,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(140,160,210,.18) 1px, transparent 1px)", backgroundSize: "72px 72px", maskImage: "linear-gradient(to bottom, black, transparent 92%)" }} />
);

const Orb: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const spin = frame * 1.2;
  const pulse = 1 + Math.sin(frame / 11) * 0.055;
  return (
    <div style={{ width: 390, height: 390, position: "relative", transform: `scale(${pulse}) rotate(${spin * 0.15}deg)` }}>
      <div style={{ position: "absolute", inset: 22, borderRadius: "50%", border: `2px solid ${color}88`, boxShadow: `0 0 70px ${color}33, inset 0 0 70px ${color}22` }} />
      <div style={{ position: "absolute", inset: 64, borderRadius: "50%", border: "1px solid #ffffff55", transform: `rotate(${spin}deg)`, borderTopColor: color, borderBottomColor: color }} />
      <div style={{ position: "absolute", inset: 112, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ffffff, ${color} 24%, #111827 72%)`, boxShadow: `0 0 100px ${color}66` }} />
      {Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 18px ${color}`, transform: `rotate(${i * 45 + spin}deg) translateX(190px)` }} />)}
    </div>
  );
};

const PromptCard: React.FC<{ frame: number }> = ({ frame }) => {
  const words = ["یک موشن‌گرافیک", "۳۰ ثانیه‌ای بساز", "با موسیقی اختصاصی", "تمام توانت را به‌کار بگیر"];
  return (
    <div style={{ width: "100%", border: "1px solid #ffffff22", borderRadius: 28, background: "linear-gradient(145deg,#171e30dd,#0b1020ee)", padding: 34, boxShadow: "0 30px 90px #0008" }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#8e9bb5", fontSize: 19, letterSpacing: 3, marginBottom: 30 }}><span>✳  PROMPT</span><span>01 / 01</span></div>
      {words.map((w, i) => {
        const p = spring({ frame: frame - 12 - i * 13, fps: FPS, config: { damping: 16 } });
        return <div key={w} style={{ fontSize: 37, fontWeight: 800, marginBottom: 15, opacity: p, transform: `translateX(${(1-p)*55}px)`, color: i === 1 ? "#77a5ff" : "#f5f7ff" }}>{w}</div>;
      })}
      <div style={{ height: 5, background: "#ffffff18", borderRadius: 8, marginTop: 24, overflow: "hidden" }}><div style={{ height: "100%", width: `${interpolate(frame, [0, 90], [0, 100], { extrapolateRight: "clamp" })}%`, background: "linear-gradient(90deg,#5b8cff,#8e7bff)" }} /></div>
    </div>
  );
};

const CodeCard: React.FC<{ frame: number }> = ({ frame }) => {
  const lines = ["const scene = createMotion({", '  format: "9:16",', '  typography: "kinetic",', '  transitions: "cinematic",', "  sound: generateAudio()", "});", "render(scene);"];
  return (
    <div style={{ width: "100%", borderRadius: 24, background: "#080d18", border: "1px solid #6d8dce55", padding: 27, boxShadow: "0 25px 80px #0009", direction: "ltr", textAlign: "left", fontFamily: "monospace" }}>
      <div style={{ display: "flex", gap: 9, marginBottom: 25 }}>{["#ff6b6b", "#ffd166", "#06d6a0"].map(c => <i key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}<span style={{ color: "#68758e", fontSize: 15, marginLeft: 12 }}>motion.ts</span></div>
      {lines.map((line, i) => <div key={line} style={{ fontSize: 21, lineHeight: 1.9, color: i === 0 || i === 5 ? "#8db5ff" : i === 4 ? "#b9a0ff" : "#d9e4fa", opacity: spring({ frame: frame - i * 8, fps: FPS, config: { damping: 18 } }) }}>{line}</div>)}
      <div style={{ marginTop: 18, color: "#70e0b0", fontSize: 16 }}>● BUILD SUCCESSFUL</div>
    </div>
  );
};

const TimerVisual: React.FC<{ frame: number }> = ({ frame }) => {
  const seconds = Math.min(11 * 60, Math.floor(frame / FPS * 11));
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <div style={{ color: "#95a4c2", letterSpacing: 5, fontSize: 20, marginBottom: 18 }}>TOTAL CREATION TIME</div>
      <div style={{ fontSize: 126, fontWeight: 900, letterSpacing: -6, color: "#f5f7ff", textShadow: "0 0 50px #648dff77", direction: "ltr" }}>{mm}<span style={{ color: "#78a2ff" }}>:</span>{ss}</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28 }}>{["PYTHON AUDIO", "SOUND DESIGN", "FINAL RENDER"].map((x, i) => <div key={x} style={{ padding: "13px 15px", border: "1px solid #ffffff25", borderRadius: 14, color: "#c6d4ef", fontSize: 14, background: "#ffffff09" }}>{x}</div>)}</div>
    </div>
  );
};

const Visual: React.FC<{ scene: SceneData; frame: number }> = ({ scene, frame }) => {
  if (scene.visual === "prompt") return <PromptCard frame={frame} />;
  if (scene.visual === "code") return <CodeCard frame={frame} />;
  if (scene.visual === "timer") return <TimerVisual frame={frame} />;
  if (scene.visual === "future") return <Orb frame={frame} color="#79a4ff" />;
  return <Orb frame={frame} color="#ff795f" />;
};

const Scene: React.FC<{ data: SceneData; index: number }> = ({ data, index }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = enter * exit;
  const accent = data.visual === "question" ? "#ff795f" : data.visual === "future" ? "#79a4ff" : "#8b9dff";
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 36%, #17223b 0%, #0b0e18 50%, #070910 100%)", color: "#f6f7fb", fontFamily, direction: "rtl", overflow: "hidden" }}>
      <Glow x="55%" y="8%" color={accent} size={550} />
      <Glow x="-20%" y="62%" color="#5b8cff" size={480} />
      <Grid />
      <div style={{ position: "absolute", top: 60, left: 58, right: 58, display: "flex", justifyContent: "space-between", alignItems: "center", direction: "ltr", fontSize: 17, letterSpacing: 4, color: "#8492ad" }}>
        <span>MRP  /  AI MOTION LAB</span><span>{data.id} — 05</span>
      </div>
      <div style={{ position: "absolute", top: 112, left: 58, right: 58, height: 2, background: "#ffffff18" }}><div style={{ height: "100%", width: `${interpolate(frame, [0, durationInFrames], [0, 100])}%`, background: accent }} /></div>
      <div style={{ position: "absolute", top: 190, left: 65, right: 65, opacity, transform: `translateY(${(1-enter)*35}px)` }}>
        <div style={{ fontSize: 19, color: accent, letterSpacing: 4, fontWeight: 800, marginBottom: 25, direction: "ltr", textAlign: "right" }}>{data.eyebrow}</div>
        <div style={{ fontSize: data.visual === "question" ? 57 : 66, lineHeight: 1.42, fontWeight: 900, whiteSpace: "pre-line", textAlign: "right", textShadow: "0 10px 35px #0008" }}>{data.title}</div>
        <div style={{ fontSize: 27, fontWeight: 700, color: accent, marginTop: 18 }}>{data.accent}</div>
      </div>
      <div style={{ position: "absolute", top: 690, left: 64, right: 64, display: "flex", justifyContent: "center", alignItems: "center", opacity, transform: `scale(${0.92 + enter*0.08})` }}>
        <Visual scene={data} frame={frame} />
      </div>
      <div style={{ position: "absolute", bottom: 115, left: 60, right: 60, display: "flex", justifyContent: "space-between", alignItems: "center", direction: "ltr", color: "#8f9bb3", fontSize: 15, letterSpacing: 2 }}>
        <span>{data.body}</span><span style={{ color: accent, fontWeight: 800 }}>{data.tag}</span>
      </div>
      <div style={{ position: "absolute", bottom: 58, left: 60, right: 60, display: "flex", gap: 8 }}>{scenes.map((s, i) => <div key={s.id} style={{ flex: 1, height: 4, background: i <= index ? accent : "#ffffff20", borderRadius: 10 }} />)}</div>
    </AbsoluteFill>
  );
};

export const AIMotionReel: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "#070910" }}>
      {scenes.map((scene, index) => {
        const start = from;
        const duration = scene.seconds * FPS;
        from += duration;
        return <Sequence key={scene.id} from={start} durationInFrames={duration}><Scene data={scene} index={index} /></Sequence>;
      })}
      <Audio src={staticFile("audio/ai-tech-bed.wav")} volume={0.72} />
    </AbsoluteFill>
  );
};

export const AI_MOTION_REEL_DURATION = totalFrames;
