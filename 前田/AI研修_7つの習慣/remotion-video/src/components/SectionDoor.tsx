import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS, LAYOUT } from "../design";
import { fadeIn, scaleIn, slideInFromBottom } from "./Animations";

interface SectionDoorProps {
  habitNumber: number;
  habitName: string;
  subtitle?: string;
}

export const SectionDoor: React.FC<SectionDoorProps> = ({
  habitNumber,
  habitName,
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
      {/* Habit number */}
      <div
        style={{
          fontSize: 48,
          color: COLORS.accent,
          fontWeight: 600,
          marginBottom: 20,
          letterSpacing: 6,
          opacity: fadeIn(frame, 0),
          transform: `scale(${scaleIn(frame, 0)})`,
        }}
      >
        {`習慣 ${habitNumber}`}
      </div>

      {/* Habit name */}
      <div
        style={{
          fontSize: 72,
          color: COLORS.white,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.3,
          marginBottom: 28,
          opacity: fadeIn(frame, 8),
          transform: `translateY(${slideInFromBottom(frame, 8)}px)`,
        }}
      >
        {habitName}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            fontSize: LAYOUT.bodyFontSize,
            color: "rgba(255, 255, 255, 0.5)",
            fontWeight: 400,
            textAlign: "center",
            opacity: fadeIn(frame, 16),
            transform: `translateY(${slideInFromBottom(frame, 16)}px)`,
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Decorative lines */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 100,
          right: 100,
          bottom: 100,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          opacity: fadeIn(frame, 20),
        }}
      />
    </AbsoluteFill>
  );
};
