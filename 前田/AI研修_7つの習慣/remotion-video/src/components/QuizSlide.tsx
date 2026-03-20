import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, LAYOUT } from "../design";
import { SlideBase } from "./SlideBase";
import { fadeIn, slideInFromLeft, scaleIn } from "./Animations";

interface QuizSlideProps {
  question: string;
  options: string[];
  answerIndex?: number; // If provided, highlights the answer after a delay
  slideNumber?: number;
  sessionId?: string;
}

export const QuizSlide: React.FC<QuizSlideProps> = ({
  question,
  options,
  answerIndex,
  slideNumber,
  sessionId,
}) => {
  const frame = useCurrentFrame();
  const showAnswer = answerIndex !== undefined && frame > 450; // reveal after 15s

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <SlideBase
      backgroundColor={COLORS.offWhite}
      showAccentBar={true}
      slideNumber={slideNumber}
      sessionId={sessionId}
    >
      {/* Quiz badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 24,
          opacity: fadeIn(frame, 0),
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.teal,
            color: COLORS.white,
            fontSize: 28,
            fontWeight: 700,
            padding: "8px 36px",
            borderRadius: 8,
            letterSpacing: 4,
          }}
        >
          クイズ
        </div>
      </div>

      {/* Question */}
      <div
        style={{
          fontSize: LAYOUT.titleFontSize - 8,
          color: COLORS.textDark,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.5,
          marginBottom: 48,
          opacity: fadeIn(frame, 6),
        }}
      >
        {question}
      </div>

      {/* Options */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          paddingLeft: 120,
          paddingRight: 120,
        }}
      >
        {options.map((option, index) => {
          const isAnswer = showAnswer && index === answerIndex;
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "16px 28px",
                borderRadius: 12,
                backgroundColor: isAnswer ? COLORS.teal : COLORS.white,
                border: `2px solid ${isAnswer ? COLORS.teal : "#DDD"}`,
                opacity: fadeIn(frame, 12 + index * 4),
                transform: `translateX(${slideInFromLeft(frame, 12 + index * 4)}px) scale(${isAnswer ? scaleIn(frame, 450) : 1})`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: isAnswer ? COLORS.white : COLORS.accent,
                  color: isAnswer ? COLORS.teal : COLORS.white,
                  fontSize: 22,
                  fontWeight: 700,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                {optionLabels[index]}
              </div>
              <span
                style={{
                  fontSize: LAYOUT.bodyFontSize,
                  color: isAnswer ? COLORS.white : COLORS.textDark,
                  fontWeight: isAnswer ? 700 : 400,
                }}
              >
                {option}
              </span>
            </div>
          );
        })}
      </div>
    </SlideBase>
  );
};
