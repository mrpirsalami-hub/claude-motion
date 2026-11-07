import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import "./fonts";
import { DURATIONS } from "./tokens";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";
import { Scene5 } from "./Scene5";

const SCENES = [Scene1, Scene2, Scene3, Scene4, Scene5];

/** 60 s, 1920x1080 @ 30 fps. Scene timings live in DURATIONS (tokens.ts). */
export const AIRevolution: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SCENES.map((Scene, i) => {
        const start = from;
        from += DURATIONS[i];
        return (
          <Sequence key={i} from={start} durationInFrames={DURATIONS[i]}>
            <Scene duration={DURATIONS[i]} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
