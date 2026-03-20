import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, LAYOUT } from "../design";
import { SlideBase } from "./SlideBase";
import { fadeIn, slideInFromLeft } from "./Animations";

interface ComparisonSlideProps {
  title: string;
  leftLabel?: string;
  rightLabel?: string;
  leftItems: string[];
  rightItems: string[];
  slideNumber?: number;
  sessionId?: string;
}

export const ComparisonSlide: React.FC<ComparisonSlideProps> = ({
  title,
  leftLabel = "NG",
  rightLabel = "OK",
  leftItems,
  rightItems,
  slideNumber,
  sessionId,
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
          textAlign: "center",
          opacity: fadeIn(frame, 0),
        }}
      >
        {title}
      </div>

      {/* Two columns */}
      <div
        style={{
          display: "flex",
          gap: 40,
          flex: 1,
        }}
      >
        {/* Left (NG) column */}
        <div
          style={{
            flex: 1,
            backgroundColor: COLORS.ngBackground,
            borderRadius: 16,
            padding: 40,
            opacity: fadeIn(frame, 8),
            transform: `translateX(${slideInFromLeft(frame, 8)}px)`,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: COLORS.ngText,
              marginBottom: 28,
              textAlign: "center",
            }}
          >
            {leftLabel}
          </div>
          {leftItems.map((item, i) => (
            <div
              key={i}
              style={{
                fontSize: LAYOUT.bodyFontSize - 2,
                color: COLORS.textDark,
                lineHeight: 1.7,
                marginBottom: 16,
                paddingLeft: 20,
                borderLeft: `3px solid ${COLORS.ngText}`,
                opacity: fadeIn(frame, 14 + i * 4),
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Right (OK) column */}
        <div
          style={{
            flex: 1,
            backgroundColor: COLORS.okBackground,
            borderRadius: 16,
            padding: 40,
            opacity: fadeIn(frame, 12),
            transform: `translateX(${-slideInFromLeft(frame, 12)}px)`,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: COLORS.okText,
              marginBottom: 28,
              textAlign: "center",
            }}
          >
            {rightLabel}
          </div>
          {rightItems.map((item, i) => (
            <div
              key={i}
              style={{
                fontSize: LAYOUT.bodyFontSize - 2,
                color: COLORS.textDark,
                lineHeight: 1.7,
                marginBottom: 16,
                paddingLeft: 20,
                borderLeft: `3px solid ${COLORS.okText}`,
                opacity: fadeIn(frame, 18 + i * 4),
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </SlideBase>
  );
};
