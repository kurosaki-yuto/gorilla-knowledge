import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, LAYOUT } from "../design";
import { SlideBase } from "./SlideBase";
import { fadeIn, slideInFromLeft } from "./Animations";

interface ContentSlideProps {
  title: string;
  bullets?: string[];
  description?: string;
  slideNumber?: number;
  sessionId?: string;
  children?: React.ReactNode;
}

export const ContentSlide: React.FC<ContentSlideProps> = ({
  title,
  bullets,
  description,
  slideNumber,
  sessionId,
  children,
}) => {
  const frame = useCurrentFrame();

  return (
    <SlideBase
      backgroundColor={COLORS.offWhite}
      showAccentBar={true}
      slideNumber={slideNumber}
      sessionId={sessionId}
    >
      {/* Title */}
      <div
        style={{
          fontSize: LAYOUT.titleFontSize,
          color: COLORS.textDark,
          fontWeight: 700,
          marginBottom: 40,
          paddingBottom: 20,
          borderBottom: `3px solid ${COLORS.accent}`,
          opacity: fadeIn(frame, 0),
          transform: `translateX(${slideInFromLeft(frame, 0)}px)`,
        }}
      >
        {title}
      </div>

      {/* Description */}
      {description && (
        <div
          style={{
            fontSize: LAYOUT.bodyFontSize,
            color: COLORS.textSub,
            lineHeight: 1.8,
            marginBottom: 32,
            opacity: fadeIn(frame, 6),
          }}
        >
          {description}
        </div>
      )}

      {/* Bullet points */}
      {bullets && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {bullets.map((bullet, index) => (
            <div
              key={index}
              style={{
                fontSize: LAYOUT.bodyFontSize,
                color: COLORS.textDark,
                lineHeight: 1.6,
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                opacity: fadeIn(frame, 8 + index * 5),
                transform: `translateX(${slideInFromLeft(frame, 8 + index * 5)}px)`,
              }}
            >
              <span
                style={{
                  color: COLORS.accent,
                  fontWeight: 700,
                  fontSize: 28,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                ●
              </span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      )}

      {/* Custom children */}
      {children}
    </SlideBase>
  );
};
