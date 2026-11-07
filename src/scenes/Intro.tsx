import React from "react";
import { Stage, FadeUp } from "../components";
import { colors } from "../theme";

export const Intro: React.FC<{ title: string; subtitle: string; compact?: boolean }> = ({
  title,
  subtitle,
  compact,
}) => (
  <Stage>
    <FadeUp size={compact ? 110 : 120} weight={900} color={colors.accent}>
      {title}
    </FadeUp>
    <div style={{ height: 30 }} />
    <FadeUp delay={12} size={compact ? 54 : 56} weight={400} color={colors.muted}>
      {subtitle}
    </FadeUp>
  </Stage>
);
