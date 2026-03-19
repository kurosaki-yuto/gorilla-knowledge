"use client";

import { useState, useCallback } from "react";
import { VideoPlayer } from "@/components/video-player";
import { QuizForm } from "@/components/quiz-form";
import { CompletionStatus } from "@/components/completion-status";
import type { Course } from "@/types";

interface CourseContentProps {
  course: Course;
}

export function CourseContent({ course }: CourseContentProps) {
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  const handleComplete = useCallback(() => {
    setVideoCompleted(true);
  }, []);

  const handleQuizPass = useCallback(() => {
    setQuizPassed(true);
  }, []);

  return (
    <>
      {/* 動画プレーヤー */}
      <div className="mb-6">
        <VideoPlayer course={course} onComplete={handleComplete} />
      </div>

      {/* 修了ステータス */}
      <div className="mb-6">
        <CompletionStatus
          key={`status-${course.id}-${videoCompleted}-${quizPassed}`}
          courseId={course.id}
          videoCompleted={videoCompleted}
          quizPassed={quizPassed}
        />
      </div>

      {/* 確認テスト */}
      <div className="mb-8">
        <QuizForm
          courseId={course.id}
          videoCompleted={videoCompleted}
          onPass={handleQuizPass}
        />
      </div>
    </>
  );
}
