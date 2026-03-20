import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, LAYOUT } from "../design";
import { SlideBase } from "./SlideBase";
import { fadeIn, slideInFromBottom } from "./Animations";

interface SummarySlideProps {
  title: string;
  items: string[];
  keyMessage?: string;
  slideNumber?: number;
  sessionId?: string;
}

export const SummarySlide: React.FC<SummarySlideProps> = ({
  title,
  items,
  keyMessage,
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
          color: COLORS.navy,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 48,
          opacity: fadeIn(frame, 0),
        }}
      >
        {title}
      </div>

      {/* Numbered items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          paddingLeft: 80,
          paddingRight: 80,
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              opacity: fadeIn(frame, 6 + index * 4),
              transform: `translateY(${slideInFromBottom(frame, 6 + index * 4)}px)`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                backgroundColor: COLORS.accent,
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
              {item}
            </div>
          </div>
        ))}
      </div>

      {/* Key message */}
      {keyMessage && (
        <div
          style={{
            marginTop: 48,
            padding: "20px 40px",
            backgroundColor: COLORS.navy,
            borderRadius: 12,
            textAlign: "center",
            opacity: fadeIn(frame, 6 + items.length * 4 + 6),
            transform: `translateY(${slideInFromBottom(frame, 6 + items.length * 4 + 6)}px)`,
          }}
        >
          <span
            style={{
              fontSize: LAYOUT.subtitleFontSize,
              color: COLORS.white,
              fontWeight: 600,
            }}
          >
            {keyMessage}
          </span>
        </div>
      )}
    </SlideBase>
  );
};
