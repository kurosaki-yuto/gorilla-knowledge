import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS, LAYOUT } from "../design";
import { SlideBase } from "./SlideBase";
import { fadeIn, slideInFromBottom } from "./Animations";

interface PracticeSlideProps {
  exerciseType: string; // e.g. "ペア演習", "個人ワーク", "グループワーク"
  title: string;
  timerMinutes?: number;
  steps: string[];
  slideNumber?: number;
  sessionId?: string;
}

export const PracticeSlide: React.FC<PracticeSlideProps> = ({
  exerciseType,
  title,
  timerMinutes,
  steps,
  slideNumber,
  sessionId,
}) => {
  const frame = useCurrentFrame();

  return (
    <SlideBase
      backgroundColor={COLORS.offWhite}
      showAccentBar={false}
      slideNumber={slideNumber}
      sessionId={sessionId}
    >
      {/* Orange banner */}
      <div
        style={{
          backgroundColor: COLORS.orange,
          color: COLORS.white,
          fontSize: 36,
          fontWeight: 700,
          padding: "16px 40px",
          borderRadius: 12,
          textAlign: "center",
          marginBottom: 24,
          letterSpacing: 4,
          opacity: fadeIn(frame, 0),
        }}
      >
        {exerciseType}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: LAYOUT.titleFontSize,
          color: COLORS.textDark,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 32,
          opacity: fadeIn(frame, 6),
        }}
      >
        {title}
      </div>

      {/* Timer */}
      {timerMinutes !== undefined && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 36,
            opacity: fadeIn(frame, 10),
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.white,
              border: `3px solid ${COLORS.orange}`,
              borderRadius: 16,
              padding: "12px 48px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 28, color: COLORS.orange }}>⏱</span>
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: COLORS.orange,
                fontFamily: FONTS.main,
              }}
            >
              {timerMinutes}分
            </span>
          </div>
        </div>
      )}

      {/* Steps */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              opacity: fadeIn(frame, 14 + index * 5),
              transform: `translateY(${slideInFromBottom(frame, 14 + index * 5)}px)`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: COLORS.orange,
                color: COLORS.white,
                fontSize: 24,
                fontWeight: 700,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {index + 1}
            </div>
            <div
              style={{
                fontSize: LAYOUT.bodyFontSize,
                color: COLORS.textDark,
                lineHeight: 1.6,
                paddingTop: 8,
              }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    </SlideBase>
  );
};
