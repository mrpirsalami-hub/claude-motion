import React from "react";
import { Composition } from "remotion";
import { Intro } from "./scenes/Intro";
import { FPS } from "./theme";
import { AIRevolution } from "./ai/AIRevolution";
import { DURATIONS } from "./ai/tokens";

export const Root: React.FC = () => (
  <>
    {/* 16:9 motion graphic, 60 seconds: "AI Revolution" */}
    <Composition
      id="AIRevolution"
      component={AIRevolution}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={DURATIONS.reduce((a, b) => a + b, 0)}
    />
    {/* 9:16 Instagram Reel, 30 seconds */}
    <Composition
      id="Reel"
      component={Intro}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={FPS * 30}
      defaultProps={{ title: "موشن‌گرافیک با Claude", subtitle: "ریلز ۳۰ ثانیه‌ای", compact: true }}
    />
    {/* 16:9 YouTube tutorial, ~10 minutes */}
    <Composition
      id="Tutorial"
      component={Intro}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={FPS * 60 * 10}
      defaultProps={{ title: "چطور با Claude موشن‌گرافیک بسازیم؟", subtitle: "آموزش کامل با Remotion" }}
    />
  </>
);
