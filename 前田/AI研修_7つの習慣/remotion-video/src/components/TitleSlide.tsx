import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS, LAYOUT } from "../design";
import { fadeIn, slideInFromBottom } from "./Animations";

interface TitleSlideProps {
  seriesTitle: string;
  sessionTitle: string;
  subtitle?: string;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({
  seriesTitle,
  sessionTitle,
  subtitle,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.navy,
        fontFamily: FONTS.main,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: LAYOUT.padding,
      }}
    >
      {/* Series title */}
      <div
        style={{
          fontSize: LAYOUT.subtitleFontSize,
          color: COLORS.accent,
          fontWeight: 500,
          marginBottom: 24,
          opacity: fadeIn(frame, 0),
          transform: `translateY(${slideInFromBottom(frame, 0)}px)`,
          letterSpacing: 4,
        }}
      >
        {seriesTitle}
      </div>

      {/* Session title */}
      <div
        style={{
          fontSize: 80,
          color: COLORS.white,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.3,
          marginBottom: 32,
          opacity: fadeIn(frame, 8),
          transform: `translateY(${slideInFromBottom(frame, 8)}px)`,
        }}
      >
        {sessionTitle}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            fontSize: LAYOUT.bodyFontSize,
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 400,
            textAlign: "center",
            opacity: fadeIn(frame, 16),
            transform: `translateY(${slideInFromBottom(frame, 16)}px)`,
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Decorative accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          width: 120,
          height: 4,
          backgroundColor: COLORS.accent,
          opacity: fadeIn(frame, 20),
        }}
      />
    </AbsoluteFill>
  );
};
