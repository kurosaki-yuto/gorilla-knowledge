import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TIMING } from "../design";
import { SlideData } from "../data/types";
import { TitleSlide } from "./TitleSlide";
import { SectionDoor } from "./SectionDoor";
import { ContentSlide } from "./ContentSlide";
import { ComparisonSlide } from "./ComparisonSlide";
import { PracticeSlide } from "./PracticeSlide";
import { QuizSlide } from "./QuizSlide";
import { SummarySlide } from "./SummarySlide";

interface SessionRendererProps {
  slides: SlideData[];
  sessionId: string;
}

export const SessionRenderer: React.FC<SessionRendererProps> = ({
  slides,
  sessionId,
}) => {
  const fps = TIMING.fps;

  // Calculate frame offsets from durationSeconds
  let frameOffset = 0;
  const slideOffsets = slides.map((slide) => {
    const offset = frameOffset;
    frameOffset += slide.durationSeconds * fps;
    return offset;
  });

  return (
    <AbsoluteFill>
      {slides.map((slide, index) => {
        const from = slideOffsets[index];
        const duration = slide.durationSeconds * fps;

        const sessionNum = sessionId.replace(/\D/g, "");
        const slideNum = String(index + 1).padStart(2, "0");
        const audioSrc = `audio/session${sessionNum}_slide${slideNum}.mp3`;

        return (
          <Sequence key={slide.id} from={from} durationInFrames={duration}>
            {renderSlide(slide, index, sessionId)}
            <Audio src={staticFile(audioSrc)} volume={1} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

function renderSlide(
  slide: SlideData,
  index: number,
  sessionId: string
): React.ReactNode {
  switch (slide.type) {
    case "title":
      return (
        <TitleSlide
          seriesTitle="AIエージェントを味方にする7つの習慣"
          sessionTitle={slide.subtitle || slide.title}
          subtitle={slide.subtitle ? undefined : slide.title}
        />
      );

    case "section":
      return (
        <SectionDoor
          habitNumber={slide.habitNumber || 0}
          habitName={slide.habitName || slide.title}
          subtitle={slide.subtitle}
        />
      );

    case "content":
      return (
        <ContentSlide
          title={slide.title}
          bullets={slide.bullets}
          description={slide.keyMessage}
          slideNumber={slide.id}
          sessionId={sessionId}
        />
      );

    case "comparison":
      return (
        <ComparisonSlide
          title={slide.title}
          leftLabel={slide.leftColumn?.label}
          rightLabel={slide.rightColumn?.label}
          leftItems={slide.leftColumn?.items || []}
          rightItems={slide.rightColumn?.items || []}
          slideNumber={slide.id}
          sessionId={sessionId}
        />
      );

    case "practice":
      return (
        <PracticeSlide
          exerciseType={slide.practiceType || "演習"}
          title={slide.title}
          steps={slide.steps || slide.bullets || []}
          slideNumber={slide.id}
          sessionId={sessionId}
        />
      );

    case "quiz": {
      const options = slide.quizOptions?.map((o) => o.text) || [];
      const answerIndex = slide.quizOptions?.findIndex((o) => o.correct);
      return (
        <QuizSlide
          question={slide.quizQuestion || slide.title}
          options={options}
          answerIndex={answerIndex !== undefined && answerIndex >= 0 ? answerIndex : undefined}
          slideNumber={slide.id}
          sessionId={sessionId}
        />
      );
    }

    case "summary":
      return (
        <SummarySlide
          title={slide.title}
          items={slide.bullets || []}
          keyMessage={slide.keyMessage}
          slideNumber={slide.id}
          sessionId={sessionId}
        />
      );

    default:
      return (
        <ContentSlide
          title={slide.title}
          bullets={slide.bullets}
          slideNumber={slide.id}
          sessionId={sessionId}
        />
      );
  }
}

// Helper to calculate total duration in frames from slide data
export function calculateTotalFrames(slides: SlideData[]): number {
  return slides.reduce((total, slide) => total + slide.durationSeconds * TIMING.fps, 0);
}
